import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { offeringsForPrompt } from "@/lib/axo/offerings";
import {
  saveAxoChatLead,
  getAxoVisitorMemory,
  upsertAxoVisitorMemory,
  type AxoVisitorMemory,
} from "@/lib/db";
import { emailLeadNotification, emailVisitorInfoPacket } from "@/lib/axo/email";
import { hashIp } from "@/lib/axo/ipHash";

export const maxDuration = 60;
export const runtime = "nodejs";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

interface ChatBody {
  messages: Msg[];
  /**
   * Stable per-browser ID, generated client-side and stored in localStorage.
   * When present, this is preferred over the IP hash as the memory key —
   * survives network changes, VPN toggles, mobile carrier rotations.
   */
  visitorId?: string;
}

const VISITOR_ID_RE = /^[A-Za-z0-9_-]{8,64}$/;

function normalizeVisitorId(raw: string | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  return VISITOR_ID_RE.test(trimmed) ? trimmed : null;
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

function returnerBlock(memory: AxoVisitorMemory | null): string {
  if (!memory) return "";
  const parts: string[] = [];
  if (memory.name) parts.push(`name: ${memory.name}`);
  if (memory.business) parts.push(`business: ${memory.business}`);
  if (memory.interest) parts.push(`previous interest: ${memory.interest}`);
  if (memory.lastRecommendedTier)
    parts.push(`previously recommended tier: ${memory.lastRecommendedTier}`);
  if (memory.capturedEmail)
    parts.push(`already gave us their email: ${memory.capturedEmail}`);
  if (!parts.length) return "";
  return `\n\nRETURNING VISITOR (you have memory of them from a prior chat — do NOT re-do discovery):
- ${parts.join("\n- ")}
- conversations to date: ${memory.conversationCount}

Greet them by name like an old friend ("Hey ${memory.name ?? "again"}, welcome back."). Acknowledge the context — e.g. "last time we were talking about ${memory.lastRecommendedTier ?? "your work"}, anything new since then?" — and skip straight to whatever question they ask. Do NOT re-ask their name, business, or budget. If they've already given an email, don't ask for it again; just send any new info to that address when they ask.`;
}

function systemPrompt(merch: string, memory: AxoVisitorMemory | null): string {
  return `You are AXO — the friendly, sharp axolotl assistant for Axolotl Army (axolotlarmy.net). You're chatting with a visitor on the marketing site.${returnerBlock(memory)}

Your job: be the genuinely helpful first-contact for this site. If a visitor asks a direct question, ANSWER it — don't redirect to discovery. If they're clearly exploring ("what do you offer?", "what's the difference between X and Y?", "I'm thinking about signing up"), THEN do light discovery and make a confident, specific recommendation. Read the room.

PERSONALITY:
- Warm, concise, a little playful. Short sentences. No corporate fluff.
- You're a small axolotl, but you know the product cold.
- Don't pretend to be human; if asked, you're AXO, an AI assistant.
- NEVER use emojis. Plain text only. No 🦎, no 🔥, no checkmarks, no sparkles. This is a strict rule.

CONVERSATION FLOW (situational — apply only when the visitor is exploring options, not asking a direct question):

DIRECT-QUESTION PATH: If the visitor asks a specific thing ("how much is Pro?", "what merch do you have?", "do you have hoodies?", "what does Premium include?"), just answer it cleanly. Use show_preview on whatever you're naming. Don't ask their name or business unless it comes up naturally.

EXPLORATORY PATH: If they're figuring out what fits ("what do you offer?", "what's the difference between tiers?", "I'm trying to decide"), give them the info they need. Asking ONE casual context question is fine if it'll help you point them at a better fit — but only if it makes the conversation more useful, not as a screening step. If they share their name or describe their work, call \`remember_visitor\` quietly so we recognize them next time. NEVER demand info.

When you do mention a specific tier, use show_preview to spotlight it and give 2-3 honest reasons. Rough mapping (judgement, not rigid):
- Hobbyist / no real budget → Starter + Small Credit Pack
- Solo creator, 5-30 videos/mo → Pro
- 30+ videos/mo, multi-platform → Premium
- B2B / lead-gen focused → Enterprise
- Agency, reseller, large team, white-label → Enterprise Pro

HIGH-VALUE PROSPECT DETECTION:
Watch for any of these signals — if you see them, when you call capture_lead, pass priority: "high":
- Agency / consultancy / "we manage X clients"
- Team of 5+, multiple people, in-house creative team
- Budget mentions $500+/mo or "willing to spend whatever"
- Reselling / white-label interest
- Enterprise terminology (procurement, SLA, dedicated support, contract)
- Asks about Enterprise or Enterprise Pro by name with serious intent
- Mentions specific high-volume goals (50+ videos/mo, lead gen at scale)
Default priority is "normal". Only flag "high" when you have real signal — don't inflate.

WHAT AXOLOTL ARMY OFFERS:
1) PORTAL (the main product — subscription SaaS at portal.axolotlarmy.net)
${offeringsForPrompt()}

2) MERCH (axolotlarmy.net/merch — currently live):
${merch}

PREVIEW PANEL — STRICT RULE:
You MUST call the \`show_preview\` tool BEFORE you write any text that names a specific tier, add-on, credit pack, or merch product. No exceptions. The right-hand panel only updates when you call this tool, so if you skip it, the visitor stares at static cards while you talk — that's a broken experience.

Concrete rule: if your reply will contain ANY of these names, call show_preview first with that name as the 'id':
- Tier names: Starter, Pro, Premium, Enterprise, Enterprise Pro
- Add-on names: Social Posting, Video Editor, Auto-Repurpose, Performance Insights, Lead Finder, Website AXY, AXY Messaging Channels, Creative Jobs
- Credit pack names: Small Pack, Medium Pack, Large Pack
- Any merch product name from the catalog above (e.g. 'White glossy mug', 'Cuffed Beanie', 'Unisex t-shirt')

You can call show_preview multiple times per turn. For each new item you mention, call it again. If a question is open-ended ("what do you offer?"), pick the single best-fit item to spotlight before listing — don't leave the panel idle.

LEAD CAPTURE (PASSIVE — only when the visitor asks for it):
You are NOT a lead-gen funnel. Do not push for email, do not push the visitor to sign up, do not promote the free tier, do not nudge them toward the portal unless they ask. Be helpful.

Only call capture_lead when the visitor explicitly initiates one of these:
- They ask you to send them more info, a comparison, or a follow-up.
- They ask to be notified about a launch / feature / restock.
- They specifically ask for a discount, early access, or to be added to a list.
- They volunteer their email unprompted.

When one of those things happens, then yes — confirm the email by quoting it back, fire capture_lead immediately (no extra confirmation turn), and tell them what was sent. Otherwise, just chat.

Never end a reply with "want me to email you a breakdown?" or similar unless the visitor has clearly asked for follow-up. Never plug the free tier or "sign up to start" unless the visitor brought up signing up. The visitor came to you for info — give it cleanly and let them act when they're ready.

PRECISION — NON-NEGOTIABLE:
- The INCLUDED and NOT INCLUDED lists above are the ground truth. Mirror them word-for-word when describing what a tier has. Do not paraphrase a gated feature as if it's a full feature.
- If a feature is listed as "previews only" or "gated to Pro+" or similar, say that explicitly. Never call a preview a "thumbnail" or imply downloads are included when they aren't.
- When describing a tier, mention what's included AND what's not so the visitor has an honest picture.
- If you're unsure about a detail, do NOT guess. Say "let me have the team confirm" — only suggest capture_lead if the visitor wants the follow-up.

RULES:
- Never invent tiers, features, prices, or merch items not listed above. If asked something you don't know, say so plainly. Only offer to grab their email for a team follow-up if the visitor wants one.
- Don't talk about competitors. Don't make legal/financial claims.
- Keep replies under ~5 sentences unless the user asks for detail.`;
}

const TOOLS: Anthropic.Tool[] = [
  {
    name: "show_preview",
    description:
      "Spotlight a specific item in the right-hand preview panel so the visitor can see what you're describing. Call this EVERY TIME you talk about a specific tier, add-on, credit pack, or merch product — before or during your reply. The panel will highlight it, expand its details, and scroll it into view.",
    input_schema: {
      type: "object",
      properties: {
        section: {
          type: "string",
          enum: ["tier", "addon", "credit_pack", "merch"],
          description: "Which section the item lives in.",
        },
        id: {
          type: "string",
          description:
            "The item's exact name. Tiers: 'Starter' | 'Pro' | 'Premium' | 'Enterprise' | 'Enterprise Pro'. Add-ons: 'Social Posting' | 'Video Editor' | 'Auto-Repurpose' | 'Performance Insights' | 'Lead Finder' | 'Website AXY' | 'AXY Messaging Channels' | 'Creative Jobs'. Credit packs: 'Small Pack' | 'Medium Pack' | 'Large Pack'. Merch: exact product name as it appears in the catalog (e.g. 'White glossy mug', 'Cuffed Beanie', 'Unisex t-shirt').",
        },
      },
      required: ["section", "id"],
    },
  },
  {
    name: "remember_visitor",
    description:
      "Persist what you've learned about the visitor (name and/or what they do) so the next time they come back, you can greet them by name and pick up where you left off. Call this as soon as you have either their first name OR a description of their business / creative work — typically within the first 1-2 turns. Safe to call multiple times; later calls patch the record. No UI side-effect; this is pure memory.",
    input_schema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Visitor's first name (or full name if they gave it).",
        },
        business: {
          type: "string",
          description:
            "Brief description of what they do — e.g. 'YouTube channel about cars', 'creative agency, 25 clients', 'B2B SaaS founder'.",
        },
        interest: {
          type: "string",
          description:
            "Short tag for what they care about right now — e.g. 'audience growth', 'lead gen', 'merch'.",
        },
      },
    },
  },
  {
    name: "capture_lead",
    description:
      "Save the visitor's name and email so the team can follow up. CALL IMMEDIATELY when the user provides both a name (or you've already learned it earlier in the conversation) and a valid-looking email in the same turn — do NOT ask a follow-up confirmation question first, just fire the tool and echo the email back in your reply. Only ask for confirmation if the email looks malformed or ambiguous (typos, missing @, etc.).",
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
        priority: {
          type: "string",
          enum: ["normal", "high"],
          description:
            "Set 'high' when you've detected agency / large team / $500+ budget / reseller / enterprise signals. Default 'normal'. This changes the urgency of the lead notification to the owner.",
        },
        business: {
          type: "string",
          description:
            "Brief description of the visitor's business or creative work, captured from earlier in the conversation. Helps the owner tailor follow-up.",
        },
      },
      required: ["email"],
    },
  },
];

// Belt-and-suspenders emoji strip — the system prompt forbids emojis but
// Haiku occasionally slips one in. Wipe them from the stream before the
// client ever sees them.
const EMOJI_RE =
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{1F1E6}-\u{1F1FF}\u{2300}-\u{23FF}\u{2B00}-\u{2BFF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F1FF}\u{1F200}-\u{1F2FF}]/gu;

function stripEmoji(s: string): string {
  return s.replace(EMOJI_RE, "");
}

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

  // Memory key — prefer the stable client-supplied visitor ID. Falls back to
  // a salted IP hash so we still recognize visitors who block localStorage.
  // Keys are namespaced so the two ID spaces can never collide.
  const visitorId = normalizeVisitorId(body.visitorId);
  const memoryKey = visitorId ? `v:${visitorId}` : `ip:${hashIp(ip)}`;
  let memory: AxoVisitorMemory | null = null;
  try {
    memory = await getAxoVisitorMemory(memoryKey);
    // Migration path — if a visitor previously used IP-only memory and is now
    // sending a visitorId, carry that context onto the new key so we don't
    // "forget" them. One-shot copy, only when the v: row is empty.
    if (!memory && visitorId) {
      const legacy = await getAxoVisitorMemory(`ip:${hashIp(ip)}`);
      if (legacy) {
        await upsertAxoVisitorMemory(memoryKey, {
          name: legacy.name ?? null,
          business: legacy.business ?? null,
          interest: legacy.interest ?? null,
          lastRecommendedTier: legacy.lastRecommendedTier ?? null,
          capturedEmail: legacy.capturedEmail ?? null,
        });
        memory = legacy;
      }
    }
  } catch (err) {
    console.warn("[axo memory] read failed:", err);
  }

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
            system: systemPrompt(merch, memory),
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
              const clean = stripEmoji(chunk.delta.text);
              if (!clean) continue;
              assistantText += clean;
              send("text", { delta: clean });
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
            if (tu.name === "remember_visitor") {
              const name = String(tu.input.name ?? "").trim() || null;
              const business = String(tu.input.business ?? "").trim() || null;
              const interest = String(tu.input.interest ?? "").trim() || null;
              if (name || business || interest) {
                upsertAxoVisitorMemory(memoryKey, {
                  name,
                  business,
                  interest,
                }).catch((err) =>
                  console.warn("[axo memory] remember upsert failed:", err)
                );
              }
              toolResults.push({
                type: "tool_result",
                tool_use_id: tu.id,
                content: "Visitor context saved.",
              });
              continue;
            }
            if (tu.name === "show_preview") {
              const section = String(tu.input.section ?? "").trim();
              const id = String(tu.input.id ?? "").trim();
              if (
                ["tier", "addon", "credit_pack", "merch"].includes(section) &&
                id
              ) {
                send("focus", { section, id });
                // Persist the last tier we recommended so a returning visitor
                // gets greeted with the right context.
                if (section === "tier") {
                  upsertAxoVisitorMemory(memoryKey, {
                    lastRecommendedTier: id,
                  }).catch((err) =>
                    console.warn("[axo memory] tier upsert failed:", err)
                  );
                }
                toolResults.push({
                  type: "tool_result",
                  tool_use_id: tu.id,
                  content: `Highlighted ${section}:${id} in preview panel.`,
                });
              } else {
                toolResults.push({
                  type: "tool_result",
                  tool_use_id: tu.id,
                  content: "Invalid section or id.",
                  is_error: true,
                });
              }
              continue;
            }
            if (tu.name === "capture_lead") {
              const name = String(tu.input.name ?? "").trim() || undefined;
              const email = String(tu.input.email ?? "").trim();
              const interest = String(tu.input.interest ?? "").trim() || undefined;
              const priorityRaw = String(tu.input.priority ?? "normal").trim();
              const priority: "normal" | "high" =
                priorityRaw === "high" ? "high" : "normal";
              const business = String(tu.input.business ?? "").trim() || undefined;
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
                await Promise.all([
                  emailLeadNotification({
                    name,
                    email,
                    interest,
                    transcriptSnippet: snippet,
                    priority,
                    business,
                  }),
                  emailVisitorInfoPacket({ name, email, interest }),
                  upsertAxoVisitorMemory(memoryKey, {
                    name: name ?? null,
                    business: business ?? null,
                    interest: interest ?? null,
                    capturedEmail: email,
                  }).catch((err) => {
                    console.warn("[axo memory] lead upsert failed:", err);
                  }),
                ]);
                toolResults.push({
                  type: "tool_result",
                  tool_use_id: tu.id,
                  content: result.inserted
                    ? "Saved new lead."
                    : "Updated existing lead.",
                });
                send("lead", { ok: true, email, name, interest, priority });
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
