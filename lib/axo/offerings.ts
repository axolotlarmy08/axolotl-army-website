/**
 * Source-of-truth list of Axolotl Army portal offerings used by the
 * website AXO chat agent. Mirrored from `Portal/portal-app/lib/tiers.ts`
 * as of 2026-05-12. Keep in sync manually — the portal owns the truth,
 * this is a static snapshot for the marketing site.
 */

export interface AxoTier {
  name: string;
  monthlyPrice: number;
  creditsUsd: number | null;
  tagline: string;
  highlights: string[];
}

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

export const AXO_TIERS: AxoTier[] = [
  {
    name: "Starter",
    monthlyPrice: 0,
    creditsUsd: null,
    tagline: "Free portal access. Try the video generators, pay per credit.",
    highlights: [
      "8s / 30s / 60s AI video generation",
      "Thumbnail previews",
      "Trend Radar (always free)",
      "Vector Maker",
      "Pay-as-you-go credits",
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
      "Thumbnail downloads",
      "Auto-post to YouTube, TikTok, IG, Facebook, X",
      "Content Briefs",
      "Outbound invoicing",
      "Per-video revenue attribution",
      "$20/mo of included credits",
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
      "~140 AXY Voice replies / month",
      "Video Editor",
      "Slideshow Maker",
      "Auto-Repurpose (1 video → up to 12 platform clips)",
      "Performance Insights (closed-loop)",
      "$100/mo of included credits",
    ],
  },
  {
    name: "Enterprise",
    monthlyPrice: 499,
    creditsUsd: 300,
    tagline: "For businesses that need full automation + lead gen.",
    highlights: [
      "Everything in Premium",
      "Lead Generator agent (up to 750 leads/mo)",
      "~350 AXY Voice replies / month",
      "$300/mo of included credits",
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
      "Website AXY (embed AXY on your own site)",
      "Telegram + WhatsApp channels",
      "Creative Jobs (ads, thumbnails, carousels, slideshows on request)",
      "Custom workflows + priority support",
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
  const tiers = AXO_TIERS.map(
    (t) =>
      `- ${t.name} ($${t.monthlyPrice}/mo${
        t.creditsUsd ? `, includes $${t.creditsUsd}/mo credits` : ""
      }) — ${t.tagline}\n   • ${t.highlights.join("\n   • ")}`
  ).join("\n");
  const addons = AXO_ADDONS.map(
    (a) => `- ${a.name} ($${a.monthlyPrice}/mo) — ${a.blurb}`
  ).join("\n");
  const packs = AXO_CREDIT_PACKS.map(
    (p) => `- ${p.name}: ${p.credits.toLocaleString()} credits for $${p.price} — ${p.blurb}`
  ).join("\n");
  return `TIERS (subscriptions):\n${tiers}\n\nADD-ONS (a-la-carte monthly):\n${addons}\n\nCREDIT PACKS (one-time top-ups):\n${packs}`;
}
