@AGENTS.md

# Project: Axolotl Army Website

Marketing site + email capture for the Axolotl Army AI video platform.
Launched April 2026 on Vercel.

## Live

- Primary: https://www.axolotlarmy.net (apex 308-redirects here)
- Vercel project: `axolotl-army-website` under team `axolotlarmy08s-projects`
- GitHub: `github.com/axolotlarmy08/axolotl-army-website` (branch `main`)
- DNS: Netlify DNS — A `76.76.21.21` + CNAME `cname.vercel-dns.com` pointing at Vercel

Every push to `main` auto-deploys (~1–2 min).

## Database (Neon Postgres)

- Attached via Vercel Storage integration (`neon-emerald-flask`)
- `DATABASE_URL` lives in Vercel env vars — the Neon integration keeps it in sync
- Schema is created lazily on first insert (see `lib/db.ts`)
- Tables: `merch_signups`, `portal_signups` — both `(id, email UNIQUE, source, created_at)`
- View signups via Neon Query tab (the Data Editor dropdown caches — use Query tab instead)

## Third-party integrations

- **Stripe** (live keys in Vercel env):
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **Printful** API v2: `PRINTFUL_API_TOKEN`
- Printful/Stripe webhooks under `app/api/webhooks/`
- Checkout flow under `app/api/checkout/` and `app/checkout/`

## Layout notes (things that bit us)

- `public/videos/hero.mp4` is **1280×1280 (square)**, not 16:9. Hero uses
  `aspect-square` on mobile, full-bleed absolute bg on desktop.
- Scroll animation uses canvas + JPG frames (smooth scrubbing), not
  `<video>` with currentTime seeking (choppy on iOS Safari).
  - Desktop: `public/frames/` (1280×720, ~6.8 MB)
  - Mobile: `public/frames-mobile/` (720×405, ~2.4 MB)
  - On mobile each frame draws in two layers: blurred cover-scale backdrop
    + sharp contain-scale foreground, so the viewport isn't an empty void
    around the centered frame.
- Signup tables are created on first insert, so `portal_signups` may not
  appear in Neon's Data Editor dropdown until after the first submission
  (and Data Editor caches — refresh or use Query tab).

## Local dev

```bash
npm run dev           # port 3000
```

`.claude/launch.json` configures the preview tool — starts `npm run dev`.

## Auto-deploy rule (important for Claude)

**When the user asks for a code change on this project, you are expected
to deploy it automatically when the change is complete.** Don't leave
edits sitting locally waiting for the user to push them.

- After finishing a task that modifies files, run `./deploy.sh "short
  description of the change"` as the final step.
- Bundle related edits in one deploy — don't push after every individual
  `Edit` tool call. Deploy once the user's request is finished.
- If you're mid-task and debugging, you can hold the deploy until the
  fix is verified — just don't forget to deploy once it's working.
- The only reasons to skip the auto-deploy: (a) the user explicitly
  says "don't push yet", (b) the change is still broken / untested,
  (c) the change is to something that shouldn't ship (a local-only
  file, a secret, etc).

## Making changes

Shortcut script — stages everything, commits, pushes, and prints the
Vercel deployments URL. Run from anywhere:

```bash
/Users/codybrown/Desktop/claude\ 2026/Website\ design/axolotl-army-website/deploy.sh "what you changed"
```

Or from inside the repo:

```bash
./deploy.sh "what you changed"
```

Leave the message off and it'll prompt for one. Pushes to `main` trigger
an auto-deploy on Vercel (~1–2 min). Preview deployments on branches / PRs
also work out of the box.
