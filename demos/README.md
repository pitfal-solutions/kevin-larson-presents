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

To deploy a change: `cd demos/v1-landing-page && vercel --prod --yes`
(project is already linked; GitHub pushes to `main` also auto-deploy).

### Checking the AI-serving side

```bash
curl http://localhost:3000/llms.txt
curl http://localhost:3000/robots.txt
curl http://localhost:3000/sitemap.xml
curl -s http://localhost:3000/ | grep -A2 'application/ld+json'
```
