/**
 * Single source of truth for all legal/compliance documents.
 *
 * Every policy page (privacy, terms, cookies, AUP, DPA, SLA, refunds,
 * sub-processor list) imports from here so:
 *   - the effective date stays consistent across docs
 *   - the sub-processor list updates in one place when we add/remove vendors
 *   - the contact emails / company name / jurisdiction don't drift between
 *     pages over time
 *
 * When you change anything here, also update CLAUDE.md Lab Notes so the
 * next session knows the policies were rev'd.
 */

/** ISO date when the current versions of all legal docs took effect. */
export const LEGAL_EFFECTIVE_DATE = "2026-04-29";

/** Human-readable last-updated string for headers. */
export const LEGAL_EFFECTIVE_DATE_HUMAN = "April 29, 2026";

/** Trading name used throughout the docs. */
export const COMPANY_NAME = "Axolotl Army";

/** Marketing domain (the public website). */
export const COMPANY_WEBSITE = "https://www.axolotlarmy.net";

/** Portal/SaaS app domain. */
export const PORTAL_DOMAIN = "https://portal.axolotlarmy.net";

/** Where customer-facing legal mail (DSARs, complaints, DPA requests, etc.) is sent. */
export const PRIVACY_EMAIL = "privacy@axolotlarmy.net";
export const LEGAL_EMAIL = "legal@axolotlarmy.net";
export const SUPPORT_EMAIL = "support@axolotlarmy.net";
export const SECURITY_EMAIL = "security@axolotlarmy.net";

/** Postal address for service of legal process. Operator-supplied below. */
export const POSTAL_ADDRESS_LINES = [
  "Axolotl Army",
  "Attn: Legal",
  "[Street address — fill in via env or update this constant]",
  "[City, State, ZIP, Country]",
];

/**
 * Sub-processors we share customer data with.
 *
 * Surface this list at /legal/subprocessors and reference it from the
 * Privacy Policy + DPA. When you add or remove a vendor, update this
 * array AND notify existing customers (DPA promises 30 days' notice for
 * material sub-processor changes for Enterprise contracts).
 */
export interface SubProcessor {
  /** Vendor name as customers know it. */
  name: string;
  /** What the vendor does for us in plain English. */
  purpose: string;
  /** Where the vendor stores / processes the data. */
  location: string;
  /** Categories of personal data the vendor sees. */
  dataCategories: string[];
  /** Public privacy / DPA URL for the vendor. */
  url: string;
}

export const SUB_PROCESSORS: SubProcessor[] = [
  {
    name: "Neon",
    purpose: "Managed PostgreSQL hosting (primary database).",
    location: "United States (AWS us-east region).",
    dataCategories: ["Account data", "Billing metadata", "Generated content metadata", "Audit logs"],
    url: "https://neon.tech/privacy-policy",
  },
  {
    name: "Vercel",
    purpose: "Application hosting, edge runtime, and CDN.",
    location: "United States and global edge network.",
    dataCategories: ["Request logs", "IP addresses", "Account session cookies"],
    url: "https://vercel.com/legal/privacy-policy",
  },
  {
    name: "Cloudflare (R2 + Workers)",
    purpose: "Object storage for generated media and uploaded assets.",
    location: "United States and global edge network.",
    dataCategories: ["Generated videos", "Uploaded images", "Generated audio"],
    url: "https://www.cloudflare.com/privacypolicy/",
  },
  {
    name: "Stripe",
    purpose: "Payment processing, subscription billing, invoicing.",
    location: "United States, Ireland.",
    dataCategories: ["Name", "Billing email", "Card last-4 / brand", "Transaction history"],
    url: "https://stripe.com/privacy",
  },
  {
    name: "Resend",
    purpose: "Transactional email delivery (account, billing, security notifications).",
    location: "United States.",
    dataCategories: ["Recipient email", "Email content", "Delivery logs"],
    url: "https://resend.com/legal/privacy-policy",
  },
  {
    name: "Anthropic",
    purpose: "Large-language-model inference for AXY, Axo, and content generation features (Claude API).",
    location: "United States.",
    dataCategories: ["Prompts you submit", "Content you ask the assistants to draft", "Brand profile context"],
    url: "https://www.anthropic.com/legal/privacy",
  },
  {
    name: "OpenAI",
    purpose: "Fallback text-to-speech for AXY voice and slideshow narration when ElevenLabs is unavailable.",
    location: "United States.",
    dataCategories: ["Text to be spoken (no audio retention beyond synthesis)"],
    url: "https://openai.com/policies/privacy-policy",
  },
  {
    name: "ElevenLabs",
    purpose: "Primary text-to-speech provider for AXY chat voice and slideshow narration.",
    location: "United States, United Kingdom.",
    dataCategories: ["Text to be spoken", "Voice ID selection"],
    url: "https://elevenlabs.io/privacy",
  },
  {
    name: "Kie.ai",
    purpose: "Veo 3 video generation (8-second portrait clips with native audio).",
    location: "United States.",
    dataCategories: ["Generation prompts", "Generated video output"],
    url: "https://kie.ai/privacy",
  },
  {
    name: "Runway ML",
    purpose: "Gen-4.5 video generation (multi-clip stories up to 60 seconds).",
    location: "United States.",
    dataCategories: ["Generation prompts", "Reference images you upload", "Generated video output"],
    url: "https://runwayml.com/privacy-policy",
  },
  {
    name: "Deepgram",
    purpose: "Speech-to-text for auto-captions on generated and uploaded video.",
    location: "United States.",
    dataCategories: ["Audio you submit for transcription", "Resulting transcripts"],
    url: "https://deepgram.com/privacy",
  },
  {
    name: "Google (Workspace APIs)",
    purpose: "OAuth login, Google Calendar bidirectional sync, Gmail send (outreach), Drive upload (assets), Google Maps geocoding (Lead Finder).",
    location: "United States, European Union (per Google's regional data centers).",
    dataCategories: [
      "Account email + display name",
      "Calendar events you create on the portal (when sync is enabled)",
      "Outreach emails sent through your connected mailbox",
      "Free/busy availability for booking links",
      "Place lookups for Lead Finder (no end-user data leaves your client account)",
    ],
    url: "https://policies.google.com/privacy",
  },
  {
    name: "Microsoft (Graph)",
    purpose: "Outlook calendar read sync (free/busy lookup) when an Outlook account is connected.",
    location: "United States, European Union (per Microsoft's regional data centers).",
    dataCategories: ["Calendar event subjects, start/end, attendees, busy/free status"],
    url: "https://privacy.microsoft.com/privacystatement",
  },
  {
    name: "Blotato",
    purpose: "Cross-posting helper for Threads + Instagram (other platforms publish via direct platform APIs).",
    location: "United States.",
    dataCategories: ["Social post text + media", "Linked social account identifiers"],
    url: "https://blotato.com/privacy",
  },
  {
    name: "Upstash",
    purpose: "Rate-limit counters and ephemeral session/cache state.",
    location: "United States, European Union.",
    dataCategories: ["Hashed account identifiers", "Counter values"],
    url: "https://upstash.com/trust/privacy.pdf",
  },
  {
    name: "Sentry (optional)",
    purpose: "Error tracking and exception aggregation. Native error monitor is preferred; Sentry runs alongside.",
    location: "United States, European Union.",
    dataCategories: ["Stack traces", "Hashed user IDs", "Request URLs (sanitized)"],
    url: "https://sentry.io/privacy/",
  },
];

/**
 * Tiers of personal data we hold, used by the Privacy Policy "What we
 * collect" + DPA Annex II.
 */
export interface DataCategory {
  key: string;
  label: string;
  description: string;
  retention: string;
  lawfulBasis: string;
}

export const DATA_CATEGORIES: DataCategory[] = [
  {
    key: "account",
    label: "Account data",
    description: "Email address, display name, hashed password (never plaintext), portal role, login timestamps.",
    retention: "For the life of the account plus 30 days after deletion.",
    lawfulBasis: "Performance of the contract (GDPR Art. 6(1)(b)).",
  },
  {
    key: "billing",
    label: "Billing data",
    description: "Stripe customer ID, subscription tier, invoice history, payment status. We do not store full card numbers — Stripe holds them under PCI-DSS.",
    retention: "Seven (7) years after final invoice (US tax / SOX retention).",
    lawfulBasis: "Performance of the contract and legal obligation (GDPR Art. 6(1)(b) and (c)).",
  },
  {
    key: "content",
    label: "Generated and uploaded content",
    description: "Prompts you write, videos you generate, images you upload, social captions, brand profile, lead lists, contact records, outbound emails sent through connected mailboxes.",
    retention: "While the account is active. Deleted within 30 days of account closure unless legal hold applies.",
    lawfulBasis: "Performance of the contract (GDPR Art. 6(1)(b)).",
  },
  {
    key: "operational",
    label: "Operational logs",
    description: "Request logs, error reports, audit trails (who did what when), rate-limit counters, security events.",
    retention: "Ninety (90) days for verbose logs; permanent for audit trails of security-sensitive actions.",
    lawfulBasis: "Legitimate interest in security and reliability (GDPR Art. 6(1)(f)).",
  },
  {
    key: "google_workspace",
    label: "Google Workspace data (when connected)",
    description: "OAuth refresh tokens (encrypted at rest with AES-256-GCM), calendar events you create through the portal, outreach email metadata, Drive folder IDs.",
    retention: "Until you disconnect the Google account or delete the related portal record. Token revocation is immediate; mirrored events on Google's side stay there until you delete them.",
    lawfulBasis: "Consent (GDPR Art. 6(1)(a)) granted via Google's OAuth consent screen.",
  },
];

/** Where to direct EU/UK data subject requests. */
export const EU_REPRESENTATIVE = {
  // Operator: fill in once an Article 27 representative is appointed.
  // Until then we honor DSARs from any jurisdiction via the privacy email.
  appointed: false,
  contact: PRIVACY_EMAIL,
};

/** California Privacy Rights metadata for CCPA / CPRA disclosures. */
export const CCPA_METADATA = {
  doNotSellOrShare: "We do not sell or share personal information for cross-context behavioral advertising. The 'Do Not Sell or Share My Personal Information' link in our footer is provided as required by California law.",
  sensitiveDataUse: "We use sensitive personal information (account credentials, OAuth tokens for connected accounts) only to provide the Service you requested. We do not infer characteristics from this data.",
};

/** Google API Services User Data Policy — Limited Use disclosure. Required wording for Google verification when requesting Gmail / Drive / Calendar sensitive scopes. */
export const GOOGLE_LIMITED_USE_DISCLOSURE = `${COMPANY_NAME}'s use and transfer of information received from Google APIs to any other app will adhere to the Google API Services User Data Policy, including the Limited Use requirements. We do not use Google user data for serving ads, transfer it to third parties for purposes other than providing or improving user-facing features that are prominent in our application's user interface, allow humans to read it (except with your explicit permission, for security and legal compliance, or to comply with applicable law), or use it for any purpose unrelated to delivering the features the user signed up for.`;

/** Convenience: the navigation links rendered in the legal layout. */
export const LEGAL_NAV_LINKS = [
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/cookies", label: "Cookies" },
  { href: "/legal/aup", label: "Acceptable use" },
  { href: "/legal/dpa", label: "DPA" },
  { href: "/legal/subprocessors", label: "Sub-processors" },
  { href: "/legal/refunds", label: "Refunds" },
  { href: "/legal/sla", label: "SLA" },
  { href: "/legal/security", label: "Security" },
  { href: "/legal/accessibility", label: "Accessibility" },
];
