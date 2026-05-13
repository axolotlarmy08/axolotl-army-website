import { Resend } from "resend";

const FROM = "Axolotl Army <leads@axolotlarmy.net>";

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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
