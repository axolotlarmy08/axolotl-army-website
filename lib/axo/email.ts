import { Resend } from "resend";
import { AXO_TIERS, AXO_ADDONS, AXO_CREDIT_PACKS } from "./offerings";

const FROM = "Axolotl Army <leads@axolotlarmy.net>";
const REPLY_TO = "axolotlarmy08@gmail.com";

export async function emailLeadNotification(lead: {
  name?: string | null;
  email: string;
  interest?: string | null;
  transcriptSnippet?: string | null;
}): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  if (!key || !to) {
    console.warn("[axo lead email] missing RESEND_API_KEY or LEAD_NOTIFICATION_EMAIL — skipping notification");
    return;
  }
  const resend = new Resend(key);
  const subject = `New AXO chat lead — ${lead.name ?? lead.email}`;
  const lines = [
    `<p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>`,
    lead.name ? `<p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>` : "",
    lead.interest
      ? `<p><strong>Interest:</strong> ${escapeHtml(lead.interest)}</p>`
      : "",
    lead.transcriptSnippet
      ? `<p><strong>Conversation snippet:</strong></p><blockquote style="border-left:3px solid #ccc;padding-left:12px;color:#444;white-space:pre-wrap;">${escapeHtml(
          lead.transcriptSnippet
        )}</blockquote>`
      : "",
    `<p style="color:#888;font-size:12px;">Source: axolotlarmy.net /axo chat</p>`,
  ].filter(Boolean);
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject,
      html: lines.join("\n"),
    });
  } catch (err) {
    console.error("[axo lead email] send failed:", err);
  }
}

export async function emailVisitorInfoPacket(opts: {
  name?: string | null;
  email: string;
  interest?: string | null;
}): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[axo info packet] missing RESEND_API_KEY — skipping send");
    return;
  }
  const resend = new Resend(key);
  const firstName = (opts.name ?? "").split(/\s+/)[0]?.trim();
  const greeting = firstName ? `Hey ${escapeHtml(firstName)},` : "Hey,";
  const interestLine = opts.interest
    ? `<p>You mentioned <strong>${escapeHtml(opts.interest)}</strong> — here's the full breakdown so you can compare and pick what fits.</p>`
    : `<p>Here's the full breakdown of what Axolotl Army offers, so you can compare and pick what fits.</p>`;

  const tiersHtml = AXO_TIERS.map((t) => {
    const price =
      t.monthlyPrice === 0
        ? "Free"
        : `$${t.monthlyPrice.toLocaleString()}/mo${
            t.creditsUsd ? ` · $${t.creditsUsd}/mo credits included` : ""
          }`;
    const included = t.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join("");
    const notIncluded = t.notIncluded?.length
      ? `<p style="margin:8px 0 4px;color:#888;font-size:13px;">Not included (upgrade for):</p><ul style="margin:0;padding-left:18px;color:#888;font-size:13px;">${t.notIncluded
          .map((n) => `<li>${escapeHtml(n)}</li>`)
          .join("")}</ul>`
      : "";
    return `<div style="border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin:0 0 12px;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px;">
        <strong style="font-size:16px;">${escapeHtml(t.name)}</strong>
        <span style="color:#555;white-space:nowrap;">${escapeHtml(price)}</span>
      </div>
      <p style="color:#555;margin:6px 0 8px;font-size:14px;">${escapeHtml(t.tagline)}</p>
      <ul style="margin:0;padding-left:18px;font-size:14px;">${included}</ul>
      ${notIncluded}
    </div>`;
  }).join("");

  const addonsHtml = AXO_ADDONS.map(
    (a) => `<li><strong>${escapeHtml(a.name)}</strong> — $${a.monthlyPrice}/mo · ${escapeHtml(a.blurb)}</li>`
  ).join("");

  const packsHtml = AXO_CREDIT_PACKS.map(
    (p) =>
      `<li><strong>${escapeHtml(p.name)}</strong> — ${p.credits.toLocaleString()} credits for $${p.price} · ${escapeHtml(p.blurb)}</li>`
  ).join("");

  const subject = "Your Axolotl Army breakdown — tiers, add-ons, and how to start";
  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111;max-width:640px;margin:0 auto;padding:24px;line-height:1.5;">
  <p>${greeting}</p>
  ${interestLine}

  <h2 style="font-size:18px;margin:24px 0 12px;">Tiers</h2>
  ${tiersHtml}

  <h2 style="font-size:18px;margin:24px 0 12px;">Add-ons (a-la-carte)</h2>
  <ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.7;">${addonsHtml}</ul>

  <h2 style="font-size:18px;margin:24px 0 12px;">Credit packs (one-time top-ups)</h2>
  <ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.7;">${packsHtml}</ul>

  <h2 style="font-size:18px;margin:24px 0 12px;">When you're ready</h2>
  <p style="font-size:14px;">
    Create your portal account: <a href="https://portal.axolotlarmy.net/register">portal.axolotlarmy.net/register</a><br>
    Browse merch: <a href="https://www.axolotlarmy.net/merch">axolotlarmy.net/merch</a><br>
    Keep chatting with AXO: <a href="https://www.axolotlarmy.net/axo">axolotlarmy.net/axo</a>
  </p>

  <p style="font-size:14px;margin-top:24px;">
    Just reply to this email if you have questions — it goes straight to the team.
  </p>

  <p style="color:#999;font-size:12px;margin-top:32px;">
    You're getting this because you asked AXO on axolotlarmy.net to send you more info. If you didn't, ignore it — we won't follow up.
  </p>
</div>`;

  try {
    await resend.emails.send({
      from: FROM,
      to: opts.email,
      replyTo: REPLY_TO,
      subject,
      html,
    });
  } catch (err) {
    console.error("[axo info packet] send failed:", err);
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
