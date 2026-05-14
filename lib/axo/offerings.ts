/**
 * Source-of-truth list of Axolotl Army portal offerings used by the
 * website AXO chat agent. Mirrored from `Portal/portal-app/lib/tiers.ts`
 * as of 2026-05-13. Keep in sync manually — the portal owns the truth,
 * this is a static snapshot for the marketing site.
 */

export interface AxoTier {
  name: string;
  monthlyPrice: number;
  creditsUsd: number | null;
  tagline: string;
  highlights: string[];
  notIncluded?: string[];
}

export interface AxoAddon {
  name: string;
  monthlyPrice: number;
  blurb: string;
  /** Tier name where this is already bundled at no extra cost. */
  includedInTier?: string;
  /** Bullet details shown when the card is expanded. */
  details?: string[];
}

export interface AxoCreditPack {
  name: string;
  price: number;
  credits: number;
  blurb: string;
  /** Bullet details shown when the card is expanded. */
  details?: string[];
}

/** One-time lead packs from the Lead Marketplace — buy on demand, any tier. */
export interface AxoLeadPack {
  name: string;
  price: number;
  leads: number;
  perLead: number;
  blurb: string;
}

/** Voice character top-ups for AXY Voice — roll over for 90 days. */
export interface AxoVoiceTopUp {
  name: string;
  price: number;
  characters: number;
  approxReplies: number;
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
      "AXY assistant (Premium+ OR AXY Assistant Add-on $49/mo)",
      "Video Editor (Premium+)",
      "Auto-Repurpose (Premium+)",
      "Performance Insights (Premium+)",
      "Lead Generator (Enterprise) OR Lead Marketplace (any tier, pay-per-pack)",
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
      "Auto-post to YouTube, Instagram, TikTok, Facebook, X, LinkedIn, Threads, Pinterest",
      "Content Briefs (AI-powered topic + hook recommendations)",
      "Outbound invoicing (bill your own customers from the portal)",
      "Per-video revenue attribution",
      "$20/mo of included credits",
    ],
    notIncluded: [
      "AXY business assistant (Premium+ OR AXY Assistant Add-on $49/mo)",
      "AXY Voice replies (Premium+ OR AXY Assistant Add-on)",
      "Video Editor (Premium+)",
      "Slideshow Maker (Premium+)",
      "Auto-Repurpose (Premium+)",
      "Performance Insights (Premium+)",
      "Lead Generator (Enterprise) OR Lead Marketplace (any tier, pay-per-pack)",
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
      "AXY business assistant (chat) — 143 portal-wide tools, mission feed, ambient chip",
      "~140 AXY Voice replies / month included",
      "Video Editor (timeline, overlays, captions, exports)",
      "Slideshow Maker",
      "Auto-Repurpose: one video → up to 12 platform-tailored clips across 9 platforms",
      "Performance Insights (closed-loop — wins feed back into new generations)",
      "$100/mo of included credits",
    ],
    notIncluded: [
      "Lead Generator agent (Enterprise+)",
      "Higher AXY Voice cap (~350/mo on Enterprise, ~1,400/mo on Enterprise Pro)",
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
      "Lead Generator agent — 100 quality decision-maker leads/week (~430/month)",
      "Full outreach engine — templates, scheduled sequences, A/B testing, reply detection, bounce handling, deliverability dashboard, DNS setup wizard, mailbox warmup",
      "~350 AXY Voice replies / month included (up from ~140 on Premium)",
      "$300/mo of included credits",
    ],
    notIncluded: [
      "Website AXY embed (Enterprise Pro)",
      "Telegram + WhatsApp channels (Enterprise Pro)",
      "Creative Jobs intake (Enterprise Pro)",
      "Custom workflows + priority support (Enterprise Pro)",
      "Higher Enterprise Pro lead volume (250 leads/week, 2.5× Enterprise)",
    ],
  },
  {
    name: "Enterprise Pro",
    monthlyPrice: 5000,
    creditsUsd: 2500,
    tagline:
      "White-glove. Portal + AXY operator + Website AXY + messaging channels + creative jobs + 2.5× lead volume.",
    highlights: [
      "Everything in Enterprise",
      "Lead Generator agent — 250 leads/week (~1,075/month), 2.5× the Enterprise allowance",
      "Website AXY — embed AXY on your own site",
      "Telegram + WhatsApp messaging channels",
      "Creative Jobs: ad images, thumbnails, carousels, slideshows, reels on request",
      "Custom workflows + priority support",
      "~1,400 AXY Voice replies / month included (1,000,000 character units)",
      "$50/day document-analysis ceiling (up from $3/day on Premium and $5/day on Enterprise)",
      "$2,500/mo of included credits",
    ],
  },
];

export const AXO_ADDONS: AxoAddon[] = [
  {
    name: "AXY Assistant Add-on",
    monthlyPrice: 49,
    blurb:
      "Unlock AXY chat on any tier — the JARVIS-style soldier-axolotl assistant with portal-wide awareness. Included in Premium+.",
    includedInTier: "Premium",
    details: [
      "Full premium AXY tool surface (143 tools across awareness, missions, knowledgebase, brain, platform)",
      "Mission feed + ambient chip on every page",
      "25,000 voice characters/month included (~35 voice replies)",
      "Lead marketplace access via chat",
      "Soldier-axolotl persona that always checks data before answering",
    ],
  },
  {
    name: "Social Posting",
    monthlyPrice: 29,
    blurb:
      "Auto-post videos to YouTube, Instagram, TikTok, Facebook, X, LinkedIn, Threads, Pinterest. Included in Pro+.",
    includedInTier: "Pro",
    details: [
      "Schedule posts ahead of time per platform",
      "Auto-format aspect ratios per channel",
      "Per-platform captions, hashtags, and titles",
      "One-click cross-post from any generation",
    ],
  },
  {
    name: "Video Editor",
    monthlyPrice: 49,
    blurb:
      "Pro-grade timeline, overlays, captions, exports. Included in Premium+.",
    includedInTier: "Premium",
    details: [
      "Multi-track timeline (video, audio, text, overlays)",
      "Captions auto-generated and styled",
      "Trim, split, ripple-delete, transitions",
      "Export 4K · vertical / square / wide",
    ],
  },
  {
    name: "Auto-Repurpose",
    monthlyPrice: 39,
    blurb:
      "One video → up to 12 platform-tailored clips with per-platform captions. Included in Premium+.",
    includedInTier: "Premium",
    details: [
      "AI finds the strongest hook moments in your master video",
      "Cuts and reframes for 9 platforms — YouTube Shorts, TikTok, Instagram Reels, Facebook Reels, Instagram Square, LinkedIn, X, X Premium long-form, YouTube long",
      "Per-platform captions written for each clip's audience",
      "Optional auto-schedule across all your channels",
    ],
  },
  {
    name: "Performance Insights",
    monthlyPrice: 19,
    blurb:
      "Closed-loop AI that feeds winning patterns back into new generations. Included in Premium+.",
    includedInTier: "Premium",
    details: [
      "Views, retention, and revenue per video across platforms",
      "Detects winning hooks, lengths, pacing patterns",
      "Surfaces under-performers with reasons + fix suggestions",
      "Feeds the patterns into your next generation prompts automatically",
    ],
  },
  {
    name: "Lead Finder",
    monthlyPrice: 49,
    blurb:
      "10 quality decision-maker leads/week. Includes Gmail/Outlook OAuth.",
    details: [
      "AI-curated real businesses in your niche",
      "AI + web search identifies the real decision-maker (not info@)",
      "Personal email enrichment per lead",
      "Gmail / Outlook OAuth for sending from your own inbox",
      "Outreach templates + scheduled sequences with A/B testing on subject lines AND body copy",
      "Reply detection + auto-pause on response",
      "Bounce handling + per-recipient exponential backoff",
      "Deliverability dashboard + DNS setup wizard (SPF/DKIM/DMARC)",
      "Per-client unsubscribe handling",
      "Smart mailbox warmup (5/25/100/day ramp over 14 days; auto-detects established senders)",
    ],
  },
  {
    name: "Website AXY",
    monthlyPrice: 497,
    blurb:
      "Embed AXY on your own site with lead capture, follow-up records, owner dashboard.",
    includedInTier: "Enterprise Pro",
    details: [
      "Drop-in script tag — branded chat on your domain",
      "Built-in lead capture + email follow-up records",
      "Usage bars and owner dashboard tracking",
      "Same AXY brain, your colors and voice",
    ],
  },
  {
    name: "AXY Messaging Channels",
    monthlyPrice: 99,
    blurb: "Connect AXY to Telegram and WhatsApp for outside-portal access.",
    includedInTier: "Enterprise Pro",
    details: [
      "Telegram bot integration",
      "WhatsApp Business integration",
      "Provider usage tracked separately from base AXY",
      "Same conversation context across all channels",
    ],
  },
  {
    name: "Creative Jobs",
    monthlyPrice: 199,
    blurb:
      "Ad images, thumbnails, carousels, slideshows, reels, revisions — from one intake.",
    includedInTier: "Enterprise Pro",
    details: [
      "One creative intake → ad image sets, thumbnails, carousels, slideshows, reels, longer videos",
      "Revision requests handled inside the same job",
      "Brand-aware: pulls your saved brand profile + recent assets",
      "Delivery in 24-48h on standard jobs",
    ],
  },
];

export const AXO_CREDIT_PACKS: AxoCreditPack[] = [
  {
    name: "Small Pack",
    price: 10,
    credits: 1000,
    blurb: "≈ 5× 8-second videos OR 50 thumbnails.",
    details: [
      "$0.010 per credit (base rate)",
      "≈ 5× 8-second videos",
      "≈ 50 thumbnail generations",
      "No expiration on unused credits",
    ],
  },
  {
    name: "Medium Pack",
    price: 45,
    credits: 5000,
    blurb: "10% off base rate.",
    details: [
      "$0.009 per credit (10% off base rate)",
      "≈ 25× 8-second videos",
      "≈ 250 thumbnails",
      "Save $5 vs buying five Small Packs",
    ],
  },
  {
    name: "Large Pack",
    price: 170,
    credits: 20000,
    blurb: "15% off base rate.",
    details: [
      "$0.0085 per credit (15% off base rate — biggest discount)",
      "≈ 100× 8-second videos",
      "≈ 1,000 thumbnails",
      "Save $30 vs buying twenty Small Packs",
    ],
  },
];

export const AXO_LEAD_PACKS: AxoLeadPack[] = [
  {
    name: "10 leads",
    price: 39,
    leads: 10,
    perLead: 3.9,
    blurb: "$3.90/lead — entry pack, no commitment.",
  },
  {
    name: "25 leads",
    price: 79,
    leads: 25,
    perLead: 3.16,
    blurb: "$3.16/lead — 19% off the 10-pack rate.",
  },
  {
    name: "50 leads",
    price: 129,
    leads: 50,
    perLead: 2.58,
    blurb: "$2.58/lead — 34% off the 10-pack rate.",
  },
  {
    name: "100 leads",
    price: 199,
    leads: 100,
    perLead: 1.99,
    blurb: "$1.99/lead — 49% off, matches Lead Finder per-lead rate.",
  },
];

export const AXO_VOICE_TOPUPS: AxoVoiceTopUp[] = [
  { name: "Small", price: 9, characters: 10000, approxReplies: 14 },
  { name: "Growth", price: 19, characters: 25000, approxReplies: 35 },
  { name: "Heavy", price: 39, characters: 100000, approxReplies: 140 },
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
    (p) =>
      `- ${p.name}: ${p.credits.toLocaleString()} credits for $${p.price} — ${p.blurb}`
  ).join("\n");
  const leadPacks = AXO_LEAD_PACKS.map(
    (p) => `- ${p.name} for $${p.price} ($${p.perLead}/lead) — ${p.blurb}`
  ).join("\n");
  const voiceTopUps = AXO_VOICE_TOPUPS.map(
    (v) =>
      `- ${v.name}: ${v.characters.toLocaleString()} characters for $${v.price} (~${v.approxReplies} replies)`
  ).join("\n");
  return `TIERS (subscriptions):\n${tiers}\n\nADD-ONS (a-la-carte monthly):\n${addons}\n\nCREDIT PACKS (one-time top-ups, any tier):\n${packs}\n\nLEAD MARKETPLACE (one-time lead packs, any tier — no monthly commitment):\n${leadPacks}\n\nAXY VOICE TOP-UPS (extra characters for AXY Voice, 90-day rollover):\n${voiceTopUps}`;
}
