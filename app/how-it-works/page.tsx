import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "How It Works — Axolotl Army Portal",
  description:
    "Walk through the Axolotl Army Portal end-to-end: AI video generation, multi-platform publishing, AXY assistant, lead generation, calendar booking, and the full production pipeline that runs every project.",
  robots: { index: true, follow: true },
};

const PORTAL_REGISTER = "https://portal.axolotlarmy.net/register";

const STEPS = [
  {
    n: "01",
    title: "Sign in with Google",
    body:
      "One click to sign up. The portal grants Calendar, Gmail, and Drive access in a single consent screen, so booking links, outreach sends, and asset uploads all just work the moment you land in your dashboard. No second connect-screen to remember later.",
    chips: ["Google sign-in", "Calendar + Gmail + Drive", "One-click onboarding"],
  },
  {
    n: "02",
    title: "Set up your brand profile",
    body:
      "Brand colors, voice, niche, target audience, value propositions, and reference content live in a single profile that every AI surface in the portal reads. Generate a video from scratch or via Axo chat — it pulls your brand context every time, so output stays on-brand without re-prompting.",
    chips: ["Voice + tone", "Theme tokens", "ICP defaults"],
  },
  {
    n: "03",
    title: "Generate video, on demand",
    body:
      "Tell the portal what you want. The 40-agent pipeline handles the rest — Orchestrator decides scene + character, Visual Concept Agent writes the brief, Prompt Engineer turns it into a Veo 3 or Runway prompt, QA Agent validates, then the actual generation fires on Kie.ai or Runway. You watch the status update live until the clip is ready.",
    chips: ["Veo 3 (8s)", "Runway Gen-4.5 (up to 60s)", "Auto-captions"],
  },
  {
    n: "04",
    title: "Approve, edit, schedule, post",
    body:
      "Each generated video opens in the editor with thumbnail picks, music suggestions, slideshow narration, auto-captions, and platform-specific cropping. Approve in one click, write captions and hashtags with the Copywriter agent, then publish across YouTube, TikTok, Instagram, Threads, X, LinkedIn, and Facebook from a single confirm screen — or schedule the whole drop into the calendar.",
    chips: ["Multi-platform publish", "Drag-drop scheduling", "Auto-repurpose"],
  },
  {
    n: "05",
    title: "AXY runs in the background",
    body:
      "AXY is the soldier-axolotl JARVIS that watches every signal in your portal — bounces, replies, calendar events, lead scoring, deliverability — and drops missions into your inbox before you have to ask. Talk to AXY by voice or text. AXY can book meetings, send invoices, schedule outreach, request thumbnails, and generate concepts on your behalf.",
    chips: ["Voice + text", "Mission feed", "Tier-gated tools"],
  },
  {
    n: "06",
    title: "Lead Finder fills the pipeline",
    body:
      "Tell the portal who your ideal customer is — industry, geography, persona, value prop. Every week the Lead Finder pulls fresh prospects from Google Maps + Places, runs decision-maker discovery via Claude with built-in web search, validates emails, and drops graded leads into your pipeline. Outreach engine handles the cold-email cadence with templates, A/B variants, AI rewriting, mailbox warmup, domain throttling, reply detection, and inbox-wide scanning so nothing slips.",
    chips: ["100 leads/wk on Enterprise", "Auto-warmup + dunning", "Reply intent classifier"],
  },
  {
    n: "07",
    title: "Calendar + booking",
    body:
      "Every event from posts, outreach steps, ICP drips, invoices, and your real Google or Outlook calendar lives on one timeline. Drag posts to reschedule, click any empty day to add a personal event, and share a public booking link so prospects pick slots from your real availability — including round-trip sync to Google Calendar so the meeting shows up on every device you own.",
    chips: ["Bidirectional Google sync", "Public /book/ pages", "Quiet hours"],
  },
  {
    n: "08",
    title: "Everything else, automated",
    body:
      "Stripe billing + dunning + chargebacks; subscription tiers + add-ons + credit top-ups; revenue attribution per video; A/B tests with auto-stop; per-mailbox health scores + bounce circuit-breakers; PWA install + Web Push; structured audit logs; daily AXY briefing at 7am with the day's missions; weekly digest Monday at 8am.",
    chips: ["Audit log", "Web Push", "PWA installable"],
  },
];

const PIPELINE_AGENTS = [
  {
    label: "Orchestrator",
    body: "Top-level coordinator. Reads PromptMemory + immediate feedback, picks category, writes the director's brief.",
  },
  {
    label: "Visual Concept Agent",
    body: "Expands the director's brief into scene, character, camera, lighting direction.",
  },
  {
    label: "Prompt Engineer",
    body: "Writes Veo 3 or Runway prompts with character lock and scene lock so multi-clip stories stay coherent.",
  },
  {
    label: "QA Agent",
    body: "Validates prompts against rubric (no banned celebrity names, no platform-policy violations, brand voice match) and auto-corrects before generation fires.",
  },
  {
    label: "Copywriter + Caption Agent",
    body: "Title, captions, and hashtag sets for each platform, written to that platform's voice.",
  },
  {
    label: "Video Generation Agent",
    body: "Calls Kie.ai (Veo 3) or Runway, manages job queue, polls until ready, retries on transient errors.",
  },
  {
    label: "Brand Consistency Agent",
    body: "Final pass on every output to confirm brand profile compliance before posting.",
  },
  {
    label: "Finance Agent",
    body: "Handles credit deduction, Stripe invoicing, subscription state machines, revenue attribution.",
  },
];

const TIERS = [
  {
    name: "Starter",
    price: "Free trial",
    body: "View videos, see invoices, check credits. 3 client-side AXY tools.",
    chips: ["View videos", "View invoices", "View credits"],
  },
  {
    name: "Professional",
    price: "$49/mo",
    body: "Plus invoice viewing, video approval, request revisions, send video email, generate thumbnails.",
    chips: ["8 AXY tools", "Editor add-on optional", "Web Push"],
  },
  {
    name: "Business",
    price: "$199/mo",
    body: "Plus request video, suggest concepts, account health score, lead pipeline, financial reports, full Lead Finder + outreach engine.",
    chips: ["15 AXY tools", "Lead Finder included", "Auto-repurpose"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    body: "Custom contracts. SLA with 99.9% uptime + service credits. Higher Lead Finder caps. Audit + DPA counter-signature workflow.",
    chips: ["SLA + service credits", "DPA + DocuSign", "100 leads/wk"],
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[1400px] px-6 pt-32 pb-24 text-foreground">
        {/* Hero */}
        <section className="max-w-3xl">
          <p className="text-accent text-sm font-mono mb-4">How it works</p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] mb-6">
            Sign up. Sign in with Google. Run a content empire.
          </h1>
          <p className="text-muted text-lg leading-relaxed mb-8 max-w-2xl">
            The Axolotl Army Portal is a full content production system in one
            place — AI video generation, multi-platform publishing, lead
            generation, scheduling, billing, and a soldier-axolotl assistant
            that runs missions in the background while you sleep. Here is
            exactly what happens between &ldquo;sign up&rdquo; and
            &ldquo;published, scheduled, and following up&rdquo;.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={PORTAL_REGISTER}
              className="text-sm bg-accent text-background font-medium px-5 py-2.5 rounded-full hover:bg-accent-dim transition-colors"
            >
              Get Started
            </a>
            <Link
              href="/features"
              className="text-sm text-muted hover:text-foreground border border-border/60 px-5 py-2.5 rounded-full transition-colors"
            >
              See features
            </Link>
            <Link
              href="/showreel"
              className="text-sm text-muted hover:text-foreground border border-border/60 px-5 py-2.5 rounded-full transition-colors"
            >
              Watch the showreel
            </Link>
          </div>
        </section>

        {/* Step list */}
        <section className="mt-24">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            From sign-up to scheduled drop
          </h2>
          <p className="text-muted text-sm mb-12 max-w-2xl">
            Every step happens inside the portal. No five-tab workflow, no
            switching between tools. Each surface knows about the others.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STEPS.map((s) => (
              <article
                key={s.n}
                className="bg-surface border border-border/50 rounded-2xl p-7 hover:border-accent/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-accent text-xs font-mono">{s.n}</span>
                  <h3 className="text-foreground text-lg font-semibold">
                    {s.title}
                  </h3>
                </div>
                <p className="text-muted text-sm leading-relaxed mb-4">
                  {s.body}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {s.chips.map((c) => (
                    <span
                      key={c}
                      className="text-[11px] text-foreground/80 bg-background border border-border/50 px-2 py-0.5 rounded-full"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Pipeline section */}
        <section className="mt-24">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            The 40-agent pipeline that runs every video
          </h2>
          <p className="text-muted text-sm mb-12 max-w-2xl">
            Generation isn&apos;t one model call. Every video goes through a
            chain of specialised agents — orchestration, creative direction,
            prompt engineering, QA, generation, brand check, copywriting —
            so output stays on-brand and platform-appropriate without you
            having to babysit it.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PIPELINE_AGENTS.map((a) => (
              <div
                key={a.label}
                className="bg-surface border border-border/40 rounded-xl p-5"
              >
                <h3 className="text-foreground font-medium mb-2 text-sm">
                  {a.label}
                </h3>
                <p className="text-muted text-xs leading-relaxed">{a.body}</p>
              </div>
            ))}
          </div>

          <p className="text-muted/70 text-xs mt-6 max-w-2xl">
            That&apos;s 8 of the 40-agent team. The rest cover analytics,
            optimization, security, file management, debugging, scheduling,
            cross-platform adaptation, and rate-limit monitoring. They run
            silently — the only output you see is the finished video,
            captioned, scheduled, and on-brand.
          </p>
        </section>

        {/* What you get section */}
        <section className="mt-24">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            What&apos;s actually in the portal
          </h2>
          <p className="text-muted text-sm mb-12 max-w-2xl">
            Plain-English inventory of the surfaces that ship today.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                t: "Generate Video modal",
                b: "Type a concept, get back a Veo 3 or Runway clip. Status polls live until READY. Approve, edit, post.",
              },
              {
                t: "AXY chat (text + voice)",
                b: "Soldier-axolotl assistant on every page. Voice via ElevenLabs Flash with sub-100ms first byte. Speaks first when the situation calls for it.",
              },
              {
                t: "Axo chat (admin)",
                b: "Power-user back-office assistant — 25 tools spanning videos, billing, leads, finance, AppSettings, platform credits.",
              },
              {
                t: "Calendar",
                b: "Posts, outreach steps, ICP drips, invoices, personal events, plus your real Google or Outlook calendar — drag-drop reschedule, click empty day to add.",
              },
              {
                t: "Lead Finder",
                b: "ICPs, weekly drip, full outreach engine with templates, sequences, A/B variants, mailbox warmup, deliverability dashboard, inbox alerts.",
              },
              {
                t: "Editor",
                b: "Slideshow / voiceover / music / cropping / branding presets. Auto-captions via Deepgram. Per-platform exports.",
              },
              {
                t: "Booking pages",
                b: "Public /book/<slug>/<meeting-type> URLs. Round-trip Google Calendar sync. Quiet hours. Lead-attached when the booker email matches.",
              },
              {
                t: "Plan + billing",
                b: "Stripe customer portal embedded. Tier swaps, add-on toggles, dunning visibility, credit top-ups, redundant-add-on auto-cancel on tier upgrade.",
              },
              {
                t: "Trend Radar",
                b: "Daily YouTube + TikTok pulls filtered by your niche. Click &ldquo;Generate similar&rdquo; to pre-fill the modal with the hook + title format that's working right now.",
              },
              {
                t: "⌘K command palette",
                b: "Find any video, invoice, contact, scheduled post, or page. Keyboard-first.",
              },
              {
                t: "PWA + Web Push",
                b: "Install to home screen. Receive grouped push notifications when AXY surfaces a mission or someone replies to outreach.",
              },
              {
                t: "Audit log",
                b: "Every privileged action stamped with who/when/what. Filterable by action type. Read-only.",
              },
            ].map((x) => (
              <div
                key={x.t}
                className="bg-surface/60 border border-border/40 rounded-xl p-5"
              >
                <h3 className="text-foreground font-medium mb-2">{x.t}</h3>
                <p className="text-muted text-sm leading-relaxed">{x.b}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tiers */}
        <section className="mt-24">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Plans
          </h2>
          <p className="text-muted text-sm mb-12 max-w-2xl">
            Every tier sees the same dashboard. Tools and capacity scale up.
            Add-ons (Editor, Lead Finder) layer on top of any paid tier.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TIERS.map((t) => (
              <article
                key={t.name}
                className="bg-surface border border-border/50 rounded-2xl p-6 flex flex-col"
              >
                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="text-foreground font-semibold">{t.name}</h3>
                  <span className="text-accent text-sm font-mono">
                    {t.price}
                  </span>
                </div>
                <p className="text-muted text-sm leading-relaxed mb-4 flex-1">
                  {t.body}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {t.chips.map((c) => (
                    <span
                      key={c}
                      className="text-[11px] text-foreground/80 bg-background border border-border/50 px-2 py-0.5 rounded-full"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Trust */}
        <section className="mt-24">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Built to be trusted with your business
          </h2>
          <p className="text-muted text-sm mb-12 max-w-2xl">
            We treat the security + privacy story as a product feature. The
            full trust package is at <Link href="/legal" className="underline text-accent hover:opacity-80">/legal</Link>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                t: "GDPR + CCPA + Google verified",
                b: "Full Privacy Policy with verbatim Google Limited Use Disclosure. SCCs incorporated by reference. CCPA / multi-state US privacy rights surfaced.",
              },
              {
                t: "Encryption end-to-end",
                b: "TLS 1.3 in transit. AES-256-GCM at rest for every OAuth refresh token. bcrypt for passwords. Secrets never logged.",
              },
              {
                t: "DPA + Sub-processors",
                b: "GDPR Article 28 Data Processing Agreement with full Annex II TOMs and Annex III sub-processor list. Counter-signed copies on request.",
              },
              {
                t: "Anti-abuse by default",
                b: "Rate limiting, session lockout, login-attempt throttling, mailbox warmup, bounce circuit-breakers, domain auto-pause, suppression lists.",
              },
              {
                t: "SLA for Enterprise",
                b: "99.9% uptime target. Service-credit ladder up to 30%. Support response targets P0-P3. RTO 4h / RPO 15m.",
              },
              {
                t: "Audit + transparency",
                b: "Every privileged action audit-logged. AXY tool transcript visible per turn. Status page coming. Vulnerability disclosure under safe-harbor.",
              },
            ].map((x) => (
              <div
                key={x.t}
                className="bg-surface/60 border border-border/40 rounded-xl p-5"
              >
                <h3 className="text-foreground font-medium mb-2">{x.t}</h3>
                <p className="text-muted text-sm leading-relaxed">{x.b}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-24 bg-surface/60 border border-border/40 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            Ready to run your content like a soldier-axolotl JARVIS?
          </h2>
          <p className="text-muted text-sm max-w-xl mx-auto mb-6">
            Sign in with Google, set your brand profile, and watch the
            pipeline run your first video. No setup calls, no installs.
          </p>
          <a
            href={PORTAL_REGISTER}
            className="inline-block text-sm bg-accent text-background font-medium px-6 py-3 rounded-full hover:bg-accent-dim transition-colors"
          >
            Sign in with Google
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
