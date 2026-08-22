# Demos

## v1-landing-page

Single-page demo of a Kevin Larson Presents website upgrade — real copy and
event details pulled from the client's live sites, dark/gold brand identity
matching their existing visual language, AI/SEO structured data built in.
See [../specs/v1-landing-page.md](../specs/v1-landing-page.md) for the spec
and [../context/data-sources.md](../context/data-sources.md) for where the
content came from.

```bash
cd demos/v1-landing-page
npm install
npm run dev
```

Open `http://localhost:3000`.

**Known gap:** the past-events gallery uses labeled placeholder tiles —
real event photography from the client hasn't been provided yet. Swap in
`app/components/PastEvents.js` once photos arrive.

### Checking the AI-serving side

```bash
curl http://localhost:3000/llms.txt
curl http://localhost:3000/robots.txt
curl http://localhost:3000/sitemap.xml
curl -s http://localhost:3000/ | grep -A2 'application/ld+json'
```
