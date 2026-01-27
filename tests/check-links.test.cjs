const fs = require("fs")
const path = require("path")
const http = require("http")
const https = require("https")

const POSTS_DIR = path.join(__dirname, "..", "src", "content", "blog", "posts")

function walkDir(dir) {
	const results = []
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name)
		if (entry.isDirectory()) results.push(...walkDir(full))
		else results.push(full)
	}
	return results
}

function findHrefFromHtml(html) {
	const regex = /<a[^>]+href=["']([^"']+)["']/g
	const matches = []
	let m
	while ((m = regex.exec(html)) !== null) matches.push(m[1])
	return matches
}

function isRemoteUrl(u) {
	return /^https?:\/\//i.test(u)
}

function decodeHtmlEntities(s) {
	if (!s) return s
	return s
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
}

function shouldIgnoreHref(href) {
	if (!href) return true
	const lc = href.toLowerCase().trim()
	return (
		lc.startsWith("mailto:") ||
		lc.startsWith("tel:") ||
		lc.startsWith("javascript:") ||
		lc === "#" ||
		lc.startsWith("#")
	)
}

function doRequest(url, method = "HEAD") {
	return new Promise((resolve) => {
		const client = url.startsWith("https") ? https : http
		const opts = { method, headers: { "User-Agent": "Mozilla/5.0 (node.js)" } }
		const req = client.request(url, opts, (res) => {
			// consume body for GET to avoid socket hang
			if (method === "GET") {
				res.on("data", () => {})
				res.on("end", () => resolve({ statusCode: res.statusCode }))
			} else {
				resolve({ statusCode: res.statusCode })
			}
		})
		req.on("error", () => resolve({ statusCode: 0 }))
		req.setTimeout(8000, () => {
			req.destroy()
			resolve({ statusCode: 0 })
		})
		req.end()
	})
}

async function urlHead(url) {
	// Try HEAD; if service blocks (403/0) try a GET with a browser UA as fallback
	const head = await doRequest(url, "HEAD")
	if (head.statusCode && head.statusCode >= 200 && head.statusCode < 400)
		return head
	if (head.statusCode === 403 || head.statusCode === 0) {
		const getRes = await doRequest(url, "GET")
		return getRes
	}
	return head
}

function resolveLocalCandidates(href, htmlFile) {
	const raw = decodeHtmlEntities(href)
	const clean = raw.split(/[?#]/)[0]
	// absolute repo file paths
	if (clean.startsWith("/src/")) {
		const direct = path.join(__dirname, "..", clean)
		// Special-case: a link like /src/content/blog/posts/slug.html should map
		// to /src/content/blog/posts/slug/slug.html (per-post folder canonical)
		const m = clean.match(/^\/src\/content\/blog\/posts\/(.+?)\.html$/)
		if (m) {
			const slug = m[1]
			const alt = path.join(
				__dirname,
				"..",
				"src",
				"content",
				"blog",
				"posts",
				slug,
				slug + ".html",
			)
			return [direct, alt]
		}
		return [direct]
	}

	// site route to blog posts: /blog/posts/<slug> or /blog/posts/<slug>/...
	if (clean.startsWith("/blog/posts/")) {
		const rel = clean.replace(/^\/blog\/posts\//, "")
		const parts = rel.split("/")
		const slug = parts[0]
		const remaining = parts.slice(1).join("/")
		const base = path.join(
			__dirname,
			"..",
			"src",
			"content",
			"blog",
			"posts",
			slug,
		)
		const candidates = []
		if (!remaining) {
			candidates.push(path.join(base, slug + ".html"))
			candidates.push(path.join(base, "index.html"))
		} else {
			const p = path.join(base, remaining)
			candidates.push(p)
			if (!path.extname(p)) {
				candidates.push(p + ".html")
				candidates.push(path.join(p, "index.html"))
			}
		}
		return candidates
	}

	// relative paths: resolve from the HTML file's directory
	const candidate = path.resolve(path.dirname(htmlFile), clean)
	const candidates = [candidate]
	if (clean.endsWith("/")) candidates.push(path.join(candidate, "index.html"))
	if (!path.extname(clean)) {
		candidates.push(candidate + ".html")
		candidates.push(path.join(candidate, "index.html"))
	}
	return candidates
}

async function checkHref(href, htmlFile) {
	if (shouldIgnoreHref(href)) return { ok: true, reason: "ignored" }

	const decoded = decodeHtmlEntities(href)
	if (isRemoteUrl(decoded)) {
		const { statusCode } = await urlHead(decoded)
		if (statusCode >= 200 && statusCode < 400)
			return { ok: true, reason: `HTTP ${statusCode}` }
		if (statusCode === 404) return { ok: false, reason: `HTTP ${statusCode}` }
		return { ok: null, reason: `HTTP ${statusCode}` }
	}

	const clean = decoded.split(/[?#]/)[0]
	const candidates = resolveLocalCandidates(clean, htmlFile)
	for (const c of candidates)
		if (fs.existsSync(c)) return { ok: true, reason: "exists" }
	return { ok: false, reason: `missing: ${candidates.join(" || ")}` }
}

;(async function main() {
	const htmlFiles = walkDir(POSTS_DIR).filter((f) => f.endsWith(".html"))
	const failures = []
	const warnings = []

	for (const htmlFile of htmlFiles) {
		const html = fs.readFileSync(htmlFile, "utf8")
		const hrefs = findHrefFromHtml(html)
		for (const href of hrefs) {
			const decoded = decodeHtmlEntities(href)
			const res = await checkHref(decoded, htmlFile)
			if (res.ok === true) continue
			if (res.ok === false)
				failures.push({ file: htmlFile, href: decoded, reason: res.reason })
			else warnings.push({ file: htmlFile, href: decoded, reason: res.reason })
		}
	}

	if (failures.length) {
		console.error("Broken links found:")
		for (const f of failures)
			console.error(`${f.file} -> ${f.href} (${f.reason})`)
		process.exit(2)
	}

	if (warnings.length) {
		console.warn(
			"Link warnings (servers may block HEAD/GET or return non-200):",
		)
		for (const w of warnings)
			console.warn(`${w.file} -> ${w.href} (${w.reason})`)
	}

	console.log("All links OK (no definitive failures)")
	process.exit(0)
})()
