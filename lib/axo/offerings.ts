/**
 * Source-of-truth list of Axolotl Army portal offerings used by the
 * website AXO chat agent. Mirrored from `Portal/portal-app/lib/tiers.ts`
 * as of 2026-05-12. Keep in sync manually — the portal owns the truth,
 * this is a static snapshot for the marketing site.
 */

export interface AxoAddon {
  name: string;
  monthlyPrice: number;
  blurb: string;
}

export interface AxoCreditPack {
  name: string;
  price: number;
  credits: number;
  blurb: string;
}

export interface AxoTier {
  name: string;
  monthlyPrice: number;
  creditsUsd: number | null;
  tagline: string;
  highlights: string[];
  notIncluded?: string[];
}

export const AXO_TIERS: AxoTier[] = [
  {
    name: "Starter",
    monthlyPrice: 0,
    creditsUsd: null,
    tagline: "Free portal access. Try the video generators, pay per credit.",
    highlights: [
      "Portal access",
      "AI video generation: 8s, 30s, 60s",
      "Thumbnail PREVIEWS only (cannot download — that's gated to Pro+)",
      "Trend Radar (always free, every tier)",
      "Vector Maker (always free, every tier)",
      "Pay-as-you-go credits (buy credit packs separately)",
      "No included monthly credits",
    ],
    notIncluded: [
      "Thumbnail downloads (Pro+)",
      "Character-consistent video / Seedance 2.0 (Pro+)",
      "Auto-posting to social platforms (Pro+)",
      "Content Briefs (Pro+)",
      "Outbound invoicing (Pro+)",
      "Revenue attribution (Pro+)",
      "AXY assistant (Premium+)",
      "Video Editor (Premium+)",
      "Auto-Repurpose (Premium+)",
      "Performance Insights (Premium+)",
      "Lead Generator (Enterprise+)",
    ],
  },
  {
    name: "Pro",
    monthlyPrice: 43,
    creditsUsd: 20,
    tagline:
      "For creators who care about video quality AND want to know what drives revenue.",
    highlights: [
      "Everything in Starter",
      "Character-consistent video (Seedance 2.0)",
      "Thumbnail downloads (full files, not just previews)",
      "Auto-post to YouTube, TikTok, Instagram, Facebook, X",
      "Content Briefs (AI-powered topic + hook recommendations)",
      "Outbound invoicing (bill your own customers from the portal)",
      "Per-video revenue attribution",
      "$20/mo of included credits",
    ],
    notIncluded: [
      "AXY business assistant (Premium+)",
      "AXY Voice replies (Premium+)",
      "Video Editor (Premium+)",
      "Slideshow Maker (Premium+)",
      "Auto-Repurpose (Premium+)",
      "Performance Insights (Premium+)",
      "Lead Generator (Enterprise+)",
    ],
  },
  {
    name: "Premium",
    monthlyPrice: 199,
    creditsUsd: 100,
    tagline:
      "Full creator studio with AXY assistant + ~140 included voice replies/mo.",
    highlights: [
      "Everything in Pro",
      "AXY business assistant (chat)",
      "~140 AXY Voice replies / month included",
      "Video Editor (timeline, overlays, captions, exports)",
      "Slideshow Maker",
      "Auto-Repurpose: one video → up to 12 platform-tailored clips",
      "Performance Insights (closed-loop — wins feed back into new generations)",
      "$100/mo of included credits",
    ],
    notIncluded: [
      "Lead Generator agent (Enterprise+)",
      "Higher AXY Voice cap (~350/mo on Enterprise)",
      "Website AXY embed (Enterprise Pro)",
      "Telegram + WhatsApp channels (Enterprise Pro)",
      "Creative Jobs (Enterprise Pro)",
    ],
  },
  {
    name: "Enterprise",
    monthlyPrice: 499,
    creditsUsd: 300,
    tagline: "For businesses that need full automation + lead gen.",
    highlights: [
      "Everything in Premium",
      "Lead Generator agent (up to 750 leads/month)",
      "~350 AXY Voice replies / month included (up from ~140 on Premium)",
      "$300/mo of included credits",
    ],
    notIncluded: [
      "Website AXY embed (Enterprise Pro)",
      "Telegram + WhatsApp channels (Enterprise Pro)",
      "Creative Jobs intake (Enterprise Pro)",
      "Custom workflows + priority support (Enterprise Pro)",
    ],
  },
  {
    name: "Enterprise Pro",
    monthlyPrice: 5000,
    creditsUsd: 3000,
    tagline:
      "White-glove. Portal + AXY operator + Website AXY + messaging channels + creative jobs.",
    highlights: [
      "Everything in Enterprise",
      "Website AXY — embed AXY on your own site",
      "Telegram + WhatsApp messaging channels",
      "Creative Jobs: ad images, thumbnails, carousels, slideshows, reels on request",
      "Custom workflows + priority support",
      "Higher AXY Voice + analysis ceilings (Enterprise Pro tier)",
      "$3,000/mo of included credits",
    ],
  },
];

export const AXO_ADDONS: AxoAddon[] = [
  {
    name: "Social Posting",
    monthlyPrice: 29,
    blurb:
      "Auto-post videos to YouTube, TikTok, Instagram, Facebook, X. Included in Pro+.",
  },
  {
    name: "Video Editor",
    monthlyPrice: 49,
    blurb:
      "Pro-grade timeline, overlays, captions, exports. Included in Premium+.",
  },
  {
    name: "Auto-Repurpose",
    monthlyPrice: 39,
    blurb:
      "One video → up to 12 platform-tailored clips with per-platform captions. Included in Premium+.",
  },
  {
    name: "Performance Insights",
    monthlyPrice: 19,
    blurb:
      "Closed-loop AI that feeds winning patterns back into new generations. Included in Premium+.",
  },
  {
    name: "Lead Finder",
    monthlyPrice: 49,
    blurb:
      "10 quality decision-maker leads/week via Google Places + AI. Includes Gmail/Outlook OAuth.",
  },
  {
    name: "Website AXY",
    monthlyPrice: 497,
    blurb:
      "Embed AXY on your own site with lead capture, follow-up records, owner dashboard.",
  },
  {
    name: "AXY Messaging Channels",
    monthlyPrice: 99,
    blurb: "Connect AXY to Telegram and WhatsApp for outside-portal access.",
  },
  {
    name: "Creative Jobs",
    monthlyPrice: 199,
    blurb:
      "Ad images, thumbnails, carousels, slideshows, reels, revisions — from one intake.",
  },
];

export const AXO_CREDIT_PACKS: AxoCreditPack[] = [
  {
    name: "Small Pack",
    price: 10,
    credits: 1000,
    blurb: "≈ 1 Runway 30s video, or 5 VEO3 8s videos, or 50 thumbnails.",
  },
  {
    name: "Medium Pack",
    price: 45,
    credits: 5000,
    blurb: "≈ 2 Seedance 34s videos + leftover. 10% off base rate.",
  },
  {
    name: "Large Pack",
    price: 170,
    credits: 20000,
    blurb: "≈ 11 Seedance 34s videos. 15% off base rate.",
  },
];

/** Compact text block used inside the AXO system prompt. */
export function offeringsForPrompt(): string {
  const tiers = AXO_TIERS.map((t) => {
    const head = `- ${t.name} ($${t.monthlyPrice}/mo${
      t.creditsUsd ? `, includes $${t.creditsUsd}/mo credits` : ""
    }) — ${t.tagline}`;
    const incl = `  INCLUDED:\n   • ${t.highlights.join("\n   • ")}`;
    const excl = t.notIncluded?.length
      ? `\n  NOT INCLUDED (upsell path):\n   • ${t.notIncluded.join("\n   • ")}`
      : "";
    return `${head}\n${incl}${excl}`;
  }).join("\n");
  const addons = AXO_ADDONS.map(
    (a) => `- ${a.name} ($${a.monthlyPrice}/mo) — ${a.blurb}`
  ).join("\n");
  const packs = AXO_CREDIT_PACKS.map(
    (p) => `- ${p.name}: ${p.credits.toLocaleString()} credits for $${p.price} — ${p.blurb}`
  ).join("\n");
  return `TIERS (subscriptions):\n${tiers}\n\nADD-ONS (a-la-carte monthly):\n${addons}\n\nCREDIT PACKS (one-time top-ups):\n${packs}`;
}
