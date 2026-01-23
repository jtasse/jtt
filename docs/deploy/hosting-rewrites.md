# Hosting rewrite and fallback guidance

This document shows recommended rewrite/fallback configurations so that social scrapers (LinkedIn, Facebook, Twitter) fetch the prerendered per-post HTML with correct Open Graph / Twitter meta instead of the SPA index.html fallback.

Key principle: serve existing static files as-is; only fall back to `index.html` for truly missing routes. Avoid broad "force" catch-alls that return `index.html` for every request.

## Netlify (netlify.toml)

Use the filesystem-first handler and a non-forced catch-all. This ensures files in `dist/` (for example `/blog/posts/slug.html`) are served directly.

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = false
```

If you previously had a `_redirects` with a line like `/* /index.html 200` remove or replace it with the `force = false` variant in `netlify.toml` so existing files are not shadowed.

## Vercel (vercel.json)

Use the filesystem handler first (so static files are served), then fall back to `index.html`.

```json
{
	"routes": [
		{ "handle": "filesystem" },
		{ "src": "/(.*)", "dest": "/index.html" }
	]
}
```

This instructs Vercel to serve on-disk files (including `dist/src/content/blog/posts/<slug>.html`) before applying the SPA fallback.

## S3 + CloudFront

Principle: deploy the built `dist/` as static objects. Configure CloudFront to serve objects normally; only configure a custom error response that maps 404 -> /index.html (200) so that missing routes fall back. Do NOT rewrite all requests to /index.html at the origin level.

- S3: upload `dist/` with the same paths (e.g. `src/content/blog/posts/abstraction-part-i-road-to-the-WYSIWYG.html`).
- CloudFront: in **Error Responses**, add a custom response: `HTTP 404` -> `Customize response` -> `Response page path: /index.html` and `HTTP Response Code: 200`.

This preserves serving existing files while still providing SPA fallback for missing routes.

## Checklist before re-running LinkedIn Post Inspector

- Ensure `npm run build` was executed and the built `dist` contains the per-post HTML with meta.
- Deploy the `dist` output to your host (Netlify/Vercel/S3) and ensure the uploaded files include the post HTML (not just an index.html rewrite).
- On the host, verify the post URL returns the generated HTML (curl or `wget -S`) and inspect the `<head>` for `og:title` / `og:image` / `og:description`.
- Re-run the LinkedIn Post Inspector (or Facebook Sharing Debugger) and request a re-scrape.

If you want, I can prepare exact `netlify.toml` or `vercel.json` files in the repo and/or run a `curl` against your deployed URL (if you provide it).
