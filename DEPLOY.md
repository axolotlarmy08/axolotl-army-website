# Deploy to Vercel

Step-by-step guide to launch axolotlarmy.net on Vercel.

---

## 1. Find where the domain is registered

The domain `axolotlarmy.net` is hosted on Netlify, but the **registrar** (where you bought it) is what controls DNS. To find it:

1. Log into Netlify → https://app.netlify.com/teams/axolotlarmy08/projects
2. Click **Domains** in the left sidebar
3. Click on `axolotlarmy.net`
4. Look for "Registered at" or "Managed by" — this tells you the registrar
   - If it says **Netlify** → you registered it through Netlify (we'll transfer it out)
   - If it says something else (Google, GoDaddy, Namecheap, etc.) → we just point the DNS at Vercel

Also run this command in your terminal to check:

```bash
whois axolotlarmy.net | grep -i registrar
```

---

## 2. Push the code to GitHub

```bash
cd "/Users/codybrown/Desktop/claude 2026/Website design/axolotl-army-website"

# Stage everything
git add -A

# Commit
git commit -m "Initial Axolotl Army website"

# Create a new GitHub repo (replace YOUR-USERNAME)
# Go to https://github.com/new and create "axolotl-army-website"

# Connect local to remote
git remote add origin https://github.com/YOUR-USERNAME/axolotl-army-website.git
git branch -M main
git push -u origin main
```

---

## 3. Deploy to Vercel

1. Go to https://vercel.com/new
2. **Import Git Repository** → select your `axolotl-army-website` repo
3. Vercel auto-detects it as Next.js — don't change anything
4. **Before clicking Deploy**, expand **Environment Variables** and add:

| Key | Value |
|-----|-------|
| `PRINTFUL_API_TOKEN` | `nzJ2xiHB6tNkNAEJ1uhK4pe8lPRhxQnEDofPmS6h` |
| `STRIPE_SECRET_KEY` | `sk_live_...` (from `.env.local`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` (from `.env.local`) |
| `DATABASE_URL` | (we'll add this in step 4) |

5. Click **Deploy** — first deploy will fail because `DATABASE_URL` is empty. That's expected, we'll fix it next.

---

## 4. Create a Neon Postgres database

1. In your Vercel project, click the **Storage** tab
2. Click **Create Database**
3. Choose **Neon — Serverless Postgres**
4. Pick a name (e.g. `axolotl-army-db`) and region close to you
5. Click **Create** — Vercel automatically adds `DATABASE_URL` to your environment variables
6. Redeploy the project (Deployments tab → latest → Redeploy)

Your signups will now save to Neon. First request creates the tables automatically.

---

## 5. Connect axolotlarmy.net to Vercel

### If domain is registered at Netlify:

1. Netlify dashboard → Domains → `axolotlarmy.net` → **Transfer out**
2. Follow the transfer process (takes up to 5 days)
3. Once transferred, come back to this step

### If domain is at another registrar (GoDaddy, Namecheap, etc.):

1. In Vercel project → **Settings** → **Domains** → click **Add**
2. Type `axolotlarmy.net` and click **Add**
3. Vercel shows you either:
   - **Nameservers to change** (easier — points the whole domain to Vercel)
   - **DNS records to add** (keeps your current nameservers)

4. Go to your registrar's DNS settings and either:
   - **Option A (nameservers)**: Replace your nameservers with Vercel's:
     ```
     ns1.vercel-dns.com
     ns2.vercel-dns.com
     ```
   - **Option B (A/CNAME records)**: Add what Vercel shows you, usually:
     ```
     A     @     76.76.21.21
     CNAME www   cname.vercel-dns.com
     ```

5. Wait 5-60 minutes for DNS to propagate
6. Vercel auto-provisions SSL — the site will be live at `https://axolotlarmy.net`

### Unlink from Netlify first

Before pointing the domain to Vercel, unlink it from Netlify so there's no conflict:
1. Netlify → Domains → `axolotlarmy.net` → **Remove domain**
2. Or just delete the Netlify project entirely

---

## 6. Post-launch checklist

- [ ] Visit `https://axolotlarmy.net` — should show the website
- [ ] Test email signup in the merch section — should save to Neon DB
- [ ] Test email signup on `/portal-coming-soon` — should also save
- [ ] Check Vercel logs if anything breaks: Project → Logs
- [ ] View your signup data:
  - Vercel Storage → Neon DB → **Query** tab
  - Run: `SELECT * FROM merch_signups ORDER BY created_at DESC;`
  - Run: `SELECT * FROM portal_signups ORDER BY created_at DESC;`

---

## Future updates

Every `git push` to `main` auto-deploys to Vercel. To deploy changes:

```bash
cd "/Users/codybrown/Desktop/claude 2026/Website design/axolotl-army-website"
git add -A
git commit -m "your change description"
git push
```

Vercel builds and deploys automatically in ~1-2 minutes.
