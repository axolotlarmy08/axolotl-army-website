import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { offeringsForPrompt } from "@/lib/axo/offerings";
import { saveAxoChatLead } from "@/lib/db";
import { emailLeadNotification } from "@/lib/axo/email";

export const maxDuration = 60;
export const runtime = "nodejs";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

interface ChatBody {
  messages: Msg[];
}

// Simple per-IP rate limit so a single visitor can't run up the API bill.
const RATE = new Map<string, { count: number; resetAt: number }>();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 20;

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const cur = RATE.get(ip);
  if (!cur || now > cur.resetAt) {
    RATE.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (cur.count >= RATE_MAX) return false;
  cur.count += 1;
  return true;
}

async function fetchMerchSummary(req: NextRequest): Promise<string> {
  try {
    const origin =
      req.headers.get("origin") ||
      `https://${req.headers.get("host") || "www.axolotlarmy.net"}`;
    const res = await fetch(`${origin}/api/printful/products`, {
      headers: { "user-agent": "axo-chat-internal" },
    });
    if (!res.ok) return "(merch catalog temporarily unavailable)";
    const data = (await res.json()) as {
      products: Array<{
        name: string;
        startingPrice: number;
        colors: Array<{ color: string; sizes: Array<{ size: string; retailPrice: number }> }>;
      }>;
    };
    if (!data.products?.length) return "(no merch live right now)";
    return data.products
      .map((p) => {
        const sizes = p.colors.flatMap((c) => c.sizes.map((s) => s.size));
        const uniqSizes = Array.from(new Set(sizes));
        return `- ${p.name} — from $${p.startingPrice}${
          uniqSizes.length ? ` (sizes: ${uniqSizes.join(", ")})` : ""
        }`;
      })
      .join("\n");
  } catch {
    return "(merch catalog temporarily unavailable)";
  }
}

function systemPrompt(merch: string): string {
  return `You are AXO — the friendly, sharp axolotl assistant for Axolotl Army (axolotlarmy.net). You're chatting with a visitor on the marketing site.

Your job: be genuinely helpful, answer questions about what Axolotl Army offers, and when there's real interest, naturally offer to grab their name + email so the team can follow up. Never demand contact info up front. Earn it: offer a real reason — early access, a discount on merch, a heads-up when a feature ships, a custom walkthrough — in exchange.

PERSONALITY:
- Warm, concise, a little playful. Short sentences. No corporate fluff.
- You're a small axolotl, but you know the product cold.
- Don't pretend to be human; if asked, you're AXO, an AI assistant.

WHAT AXOLOTL ARMY OFFERS:
1) PORTAL (the main product — subscription SaaS at portal.axolotlarmy.net)
${offeringsForPrompt()}

2) MERCH (axolotlarmy.net/merch — currently live):
${merch}

LEAD CAPTURE:
- Use the capture_lead tool when someone (a) wants to be notified about something, (b) wants a discount, (c) asks deep pricing/feature questions, or (d) explicitly offers their info.
- Always confirm with the user before calling the tool. Quote back the email so typos are caught.
- After capture, confirm warmly and continue the conversation — don't end it.

RULES:
- Never invent tiers, features, prices, or merch items not listed above. If asked something you don't know, say so and offer to have the team follow up (capture_lead).
- Don't talk about competitors. Don't make legal/financial claims.
- Keep replies under ~5 sentences unless the user asks for detail.`;
}

const TOOLS: Anthropic.Tool[] = [
  {
    name: "capture_lead",
    description:
      "Save the visitor's name and email so the team can follow up. Only call after the user has clearly consented and given a valid-looking email. Echo the email back to the user in the same turn for confirmation.",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Visitor's first name or full name." },
        email: { type: "string", description: "Visitor's email address." },
        interest: {
          type: "string",
          description:
            "Short tag for what they care about — e.g. 'merch discount', 'Pro tier', 'lead generator', 'video editor', 'general'.",
        },
      },
      required: ["email"],
    },
  },
];

function ipFrom(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") || "anon";
}

export async function POST(req: NextRequest) {
  const ip = ipFrom(req);
  if (!rateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: "Too many messages — give it a minute." }),
      { status: 429, headers: { "content-type": "application/json" } }
    );
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return new Response(
      JSON.stringify({ error: "AXO is not configured on this deployment." }),
      { status: 503, headers: { "content-type": "application/json" } }
    );
  }

  const body = (await req.json()) as ChatBody;
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return new Response(JSON.stringify({ error: "messages required" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const anthropic = new Anthropic({ apiKey: key });
  const merch = await fetchMerchSummary(req);

  // Build Anthropic message list. We agentically loop so capture_lead can
  // fire mid-turn and the model can keep talking after.
  const messages: Anthropic.MessageParam[] = body.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };

      try {
        let iter = 0;
        const maxIter = 4;
        while (iter < maxIter) {
          iter += 1;
          const resp = await anthropic.messages.stream({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 700,
            system: systemPrompt(merch),
            tools: TOOLS,
            messages,
          });

          let assistantText = "";
          const toolUses: Array<{
            id: string;
            name: string;
            input: Record<string, unknown>;
          }> = [];

          for await (const chunk of resp) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              assistantText += chunk.delta.text;
              send("text", { delta: chunk.delta.text });
            }
          }

          const final = await resp.finalMessage();
          for (const block of final.content) {
            if (block.type === "tool_use") {
              toolUses.push({
                id: block.id,
                name: block.name,
                input: block.input as Record<string, unknown>,
              });
            }
          }

          if (toolUses.length === 0) {
            send("done", {});
            controller.close();
            return;
          }

          // Push assistant turn (with tool_use blocks) into history.
          messages.push({ role: "assistant", content: final.content });

          // Execute each tool call.
          const toolResults: Anthropic.ToolResultBlockParam[] = [];
          for (const tu of toolUses) {
            if (tu.name === "capture_lead") {
              const name = String(tu.input.name ?? "").trim() || undefined;
              const email = String(tu.input.email ?? "").trim();
              const interest = String(tu.input.interest ?? "").trim() || undefined;
              const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
              if (!valid) {
                toolResults.push({
                  type: "tool_result",
                  tool_use_id: tu.id,
                  content: "Email looks invalid. Ask the user to confirm it.",
                  is_error: true,
                });
                send("lead", { ok: false, reason: "invalid_email" });
                continue;
              }
              try {
                const snippet = messages
                  .slice(-6)
                  .map((m) =>
                    typeof m.content === "string"
                      ? `${m.role}: ${m.content}`
                      : `${m.role}: [non-text]`
                  )
                  .join("\n");
                const result = await saveAxoChatLead({
                  name,
                  email,
                  interest,
                  transcriptSnippet: snippet,
                });
                await emailLeadNotification({
                  name,
                  email,
                  interest,
                  transcriptSnippet: snippet,
                });
                toolResults.push({
                  type: "tool_result",
                  tool_use_id: tu.id,
                  content: result.inserted
                    ? "Saved new lead."
                    : "Updated existing lead.",
                });
                send("lead", { ok: true, email, name, interest });
              } catch (err) {
                console.error("[axo capture_lead] failed:", err);
                toolResults.push({
                  type: "tool_result",
                  tool_use_id: tu.id,
                  content: "Could not save — try again next message.",
                  is_error: true,
                });
                send("lead", { ok: false, reason: "save_failed" });
              }
            } else {
              toolResults.push({
                type: "tool_result",
                tool_use_id: tu.id,
                content: "Unknown tool.",
                is_error: true,
              });
            }
          }

          messages.push({ role: "user", content: toolResults });
          // Loop to let the model continue after tool results.
        }
        send("done", { truncated: true });
        controller.close();
      } catch (err) {
        console.error("[axo chat] error:", err);
        const msg = err instanceof Error ? err.message : String(err);
        send("error", { message: msg.slice(0, 300) });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
    },
  });
}
