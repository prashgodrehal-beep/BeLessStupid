# BeLessStupid — Deployment Guide
## From zero to live in ~45 minutes

---

## ACCOUNTS YOU NEED (all free tiers)

| Service | URL | Purpose |
|---|---|---|
| Anthropic | console.anthropic.com | Claude API key |
| Supabase | supabase.com | Auth + Database |
| Vercel | vercel.com | Hosting + CI/CD |
| Namecheap / GoDaddy | — | Domain (optional) |

---

## STEP 1 — ANTHROPIC API KEY

1. Go to https://console.anthropic.com/settings/keys
2. Create new key → name it `belessstupid-prod`
3. Copy it — you'll need it in Step 4

---

## STEP 2 — SUPABASE SETUP

### 2a. Create project
1. Go to https://supabase.com → New project
2. Name: `belessstupid`
3. Region: Asia South 1 (Mumbai) — closest to India
4. Password: generate a strong one, save it

### 2b. Run schema
1. Dashboard → SQL Editor → New query
2. Paste the entire contents of `supabase/schema.sql`
3. Click Run

### 2c. Enable Auth providers
**Email (magic link):**
1. Authentication → Providers → Email → Enable
2. Toggle "Confirm email" ON
3. Under "Email Templates", customise the magic link email (optional)

**Google OAuth:**
1. Go to https://console.cloud.google.com
2. Create new project → APIs & Services → Credentials
3. Create OAuth Client ID → Web application
4. Authorised redirect URIs: `https://[your-project-ref].supabase.co/auth/v1/callback`
5. Copy Client ID and Client Secret
6. Back in Supabase: Authentication → Providers → Google → Enable
7. Paste Client ID and Secret

### 2d. Get your keys
Dashboard → Project Settings → API:
- `Project URL` → this is your `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2e. Configure Site URL (for auth redirects)
Authentication → URL Configuration:
- Site URL: `https://yourdomain.com` (or Vercel URL initially)
- Add redirect URLs: `https://yourdomain.com/auth/callback`

---

## STEP 3 — PUSH TO GITHUB

```bash
cd belessstupid
git init
git add .
git commit -m "Initial BeLessStupid v1"
git remote add origin https://github.com/YOUR_USERNAME/belessstupid.git
git push -u origin main
```

---

## STEP 4 — DEPLOY TO VERCEL

1. Go to https://vercel.com → New Project
2. Import your GitHub repo
3. Framework: Next.js (auto-detected)
4. Add Environment Variables (Settings → Environment Variables):

```
ANTHROPIC_API_KEY          = sk-ant-...
NEXT_PUBLIC_SUPABASE_URL   = https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
NEXT_PUBLIC_APP_URL        = https://your-vercel-url.vercel.app
```

5. Deploy → wait ~90 seconds

---

## STEP 5 — CUSTOM DOMAIN (optional)

1. Vercel → your project → Settings → Domains
2. Add your domain (e.g. `belessstupid.com`)
3. Copy the CNAME record Vercel gives you
4. In Namecheap: Advanced DNS → Add CNAME record
5. Update `NEXT_PUBLIC_APP_URL` env var to your real domain
6. Update Supabase Site URL and redirect URLs to your real domain
7. Update Google OAuth redirect URI to use real domain

---

## STEP 6 — VERIFY EVERYTHING

Run this checklist after deploy:

- [ ] Home page loads
- [ ] "Start free" goes to /login
- [ ] Magic link email arrives and works
- [ ] Google OAuth completes and redirects to /audit
- [ ] Category picker loads
- [ ] Mode selector works
- [ ] Quick intake extracts correctly (check browser Network tab → /api/claude)
- [ ] Guided intake validates 3 required fields
- [ ] Model selector shows mandatory/optional correctly
- [ ] Complexity badges visible
- [ ] Model engine runs, flash insights appear in sidebar
- [ ] Preliminary verdict updates after every 2 models
- [ ] Stress-test loads and responds
- [ ] Decision memo generates
- [ ] "Copy Memo" copies to clipboard
- [ ] Decision saved to Supabase (check Table Editor → decisions)
- [ ] Dashboard shows saved decision
- [ ] Sign out works

---

## LOCAL DEVELOPMENT

```bash
# Copy env file
cp .env.local.example .env.local
# Fill in your real keys in .env.local

# Install dependencies
npm install

# Run dev server
npm run dev
# → open http://localhost:3000
```

---

## COSTS AT SCALE

| Users/month | Anthropic | Supabase | Vercel | Total |
|---|---|---|---|---|
| 0–100 | ~$2–5 | Free | Free | ~$5 |
| 100–500 | ~$10–30 | Free | Free | ~$30 |
| 500–1000 | ~$30–80 | Free | Free | ~$80 |
| 1000+ | ~$80–200 | $25/mo | $20/mo | ~$125–245 |

*Anthropic: claude-sonnet-4 at ~$3/M input, $15/M output tokens. Each full audit uses ~3000–5000 tokens.*

---

## NEXT STEPS (Stage 3+)

After deployment is confirmed working:

- **Stage 3**: Paywall / credit system (Razorpay for India)
- **Stage 4**: PDF export of Decision Memo
- **Stage 5**: Public share links for memos
- **Stage 6**: Bias tracking across decisions over time
