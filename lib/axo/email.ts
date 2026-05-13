import { Resend } from "resend";
import { renderToBuffer, DocumentProps } from "@react-pdf/renderer";
import { createElement, ReactElement } from "react";
import { InfoPacketPdf } from "./InfoPacketPdf";

const FROM = "Axolotl Army <leads@axolotlarmy.net>";
const REPLY_TO = "axolotlarmy08@gmail.com";
const SITE_URL = "https://www.axolotlarmy.net";

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

  let pdfBuffer: Buffer | null = null;
  try {
    pdfBuffer = await renderToBuffer(
      createElement(InfoPacketPdf, {
        visitorName: opts.name ?? null,
        highlightTierName: opts.interest ?? null,
        baseUrl: SITE_URL,
      }) as ReactElement<DocumentProps>
    );
  } catch (err) {
    console.error("[axo info packet] PDF render failed:", err);
  }

  const interestLine = opts.interest
    ? `<p style="font-size:15px;">You mentioned <strong>${escapeHtml(
        opts.interest
      )}</strong> — the attached PDF has the full breakdown, with your tier highlighted up front.</p>`
    : `<p style="font-size:15px;">The attached PDF is the full breakdown — every tier, every add-on, every credit pack, plus signup links.</p>`;

  const subject =
    "Your Axolotl Army breakdown (PDF) — tiers, add-ons, and how to start";
  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111;max-width:560px;margin:0 auto;padding:24px;line-height:1.6;">
  <p style="font-size:15px;">${greeting}</p>
  ${interestLine}
  <p style="font-size:15px;">A few quick links if you don't want to wait:</p>
  <ul style="font-size:15px;line-height:1.8;padding-left:18px;">
    <li>Sign up for the portal — <a href="https://portal.axolotlarmy.net/register">portal.axolotlarmy.net/register</a></li>
    <li>Merch — <a href="https://www.axolotlarmy.net/merch">axolotlarmy.net/merch</a></li>
    <li>Chat with AXO again — <a href="https://www.axolotlarmy.net/axo">axolotlarmy.net/axo</a></li>
  </ul>
  <p style="font-size:15px;margin-top:24px;">Just reply to this email if you have questions — goes straight to the team.</p>
  <p style="color:#999;font-size:12px;margin-top:32px;">You're getting this because you asked AXO on axolotlarmy.net to send you more info. If you didn't, ignore it — we won't follow up.</p>
</div>`;

  try {
    await resend.emails.send({
      from: FROM,
      to: opts.email,
      replyTo: REPLY_TO,
      subject,
      html,
      attachments: pdfBuffer
        ? [
            {
              filename: "axolotl-army-breakdown.pdf",
              content: pdfBuffer,
            },
          ]
        : undefined,
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
