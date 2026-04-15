# Deployment — Axolotl Army

Launched April 15, 2026. This doc describes the current setup so you can
maintain and extend it.

## What's live

- **URL:** https://www.axolotlarmy.net (apex redirects to www)
- **Hosting:** Vercel — project `axolotl-army-website`, team `axolotlarmy08s-projects`
- **Repo:** `github.com/axolotlarmy08/axolotl-army-website` (branch `main`)
- **Database:** Neon Postgres `neon-emerald-flask` (attached via Vercel Storage)
- **Domain registrar:** Netlify (domain managed via Name.com under the hood)
- **DNS:** Netlify DNS — A record to Vercel's edge + CNAME for www

Every `git push` to `main` triggers an auto-deploy (~1–2 min).

## Pushing changes

```bash
cd "/Users/codybrown/Desktop/claude 2026/Website design/axolotl-army-website"
git add -A
git commit -m "short description of change"
git push
```

## Environment variables (set in Vercel Project Settings → Environment Variables)

| Key | Notes |
|---|---|
| `DATABASE_URL` | Auto-managed by the Neon integration. Don't edit. |
| `STRIPE_SECRET_KEY` | Stripe live secret key (`sk_live_…`). |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe live publishable key (`pk_live_…`). |
| `PRINTFUL_API_TOKEN` | Printful API v2 token. |

Local dev mirrors these in `.env.local` (gitignored).

## DNS records at Netlify

| Type | Host | Value |
|---|---|---|
| A | `axolotlarmy.net` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |
| (email records) | MX/TXT for forwardemail + Resend — unchanged | |

Vercel has a standing "DNS Change Recommended" badge suggesting you move to
Vercel nameservers. Cosmetic — the current setup works. Switch only if you
want to consolidate.

## Database

Neon is attached to the Vercel project via the Storage integration. Tables
are created lazily on first insert — see `lib/db.ts` for the schema.

```sql
-- Everyone who signed up on the merch section
SELECT * FROM merch_signups ORDER BY created_at DESC;

-- Everyone who signed up via the "Portal coming soon" page
SELECT * FROM portal_signups ORDER BY created_at DESC;

-- Combined view
SELECT 'merch' AS type, email, source, created_at FROM merch_signups
UNION ALL
SELECT 'portal' AS type, email, source, created_at FROM portal_signups
ORDER BY created_at DESC;
```

Run these in the Neon dashboard → **Query** tab (the Data Editor dropdown
caches table names aggressively, so new tables may not show up there).

## Rolling back a deploy

Vercel → Deployments → find the last known-good deploy → **⋯** → Promote to Production.

## Logs

- Runtime errors: Vercel → your project → **Logs** tab.
- Build failures: Vercel → Deployments → click a failed deploy → **Build Logs**.

## Adding a new domain

1. Vercel → Settings → Domains → **Add Existing** → type the domain → **Add**
2. Vercel shows DNS records to add
3. Add them at Netlify DNS (Apex A → `76.76.21.21`; subdomain → CNAME `cname.vercel-dns.com`)
4. Wait 5–60 min for DNS propagation; SSL provisions automatically.

## Notes for Claude agents working on this repo

- Next.js here is bleeding edge — read `AGENTS.md` before touching Next APIs.
- Hero video is **1280×1280 square** — use `aspect-square` on mobile.
- Scroll animation is canvas + JPG frames, not `<video>` seeking (iOS Safari
  is too slow at seeks). Desktop frames in `/public/frames`, mobile in
  `/public/frames-mobile`.
