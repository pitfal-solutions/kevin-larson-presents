# Demos

## v1-landing-page

**Live:** https://v1-landing-page-mu.vercel.app

Demo of a Kevin Larson Presents website upgrade — real copy, real event
photography, and real event details pulled from the client's live sites,
dark/gold brand identity matching their existing visual language, AI/SEO
structured data built in. Homepage (`/`) plus a dedicated page per event
(`/events/<slug>`). See [../specs/v1-landing-page.md](../specs/v1-landing-page.md)
for the spec and [../context/data-sources.md](../context/data-sources.md)
for where the content and photos came from.

```bash
cd demos/v1-landing-page
npm install
npm run dev
```

Open `http://localhost:3000`.

**Known gap:** Jammy Jam (Sept 2026) hasn't happened yet, so it correctly
shows a labeled "photo coming soon" placeholder instead of a gallery.
Update `events-data.js` (`hasPhotos`/`gallery`) once real photos exist.

### Admin dashboard + lead capture

`/admin` shows traffic (views, visitors, clicks, sources, campaigns,
devices) and Members Club leads with their metadata. Setup:

```bash
cd demos/v1-landing-page
cp .env.example .env.local   # then set ADMIN_PASSWORD
npm run dev
```

Locally, data is written to `.data/analytics.json` (gitignored). On Vercel
there's no persistent disk, so add **Upstash for Redis** from the project's
Storage tab (free tier is plenty) — it sets `UPSTASH_REDIS_REST_URL` /
`UPSTASH_REDIS_REST_TOKEN` automatically — and add `ADMIN_PASSWORD` under
Settings → Environment Variables, then redeploy. Without Redis the live
site still tracks, but each serverless instance writes to its own
throwaway disk and the dashboard will look empty.

To attribute a campaign, share links with UTM params, e.g.
`https://v1-landing-page-mu.vercel.app/?utm_source=instagram&utm_medium=social&utm_campaign=mardi-gras-2027`.

To deploy a change: `cd demos/v1-landing-page && vercel --prod --yes`
(project is already linked; GitHub pushes to `main` also auto-deploy).

### Checking the AI-serving side

```bash
curl http://localhost:3000/llms.txt
curl http://localhost:3000/robots.txt
curl http://localhost:3000/sitemap.xml
curl -s http://localhost:3000/ | grep -A2 'application/ld+json'
```
