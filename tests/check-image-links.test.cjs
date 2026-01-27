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

function findImageSrcsFromHtml(html) {
	const regex = /<img[^>]+src=["']([^"']+)["']/g
	const matches = []
	let m
	while ((m = regex.exec(html)) !== null) matches.push(m[1])
	return matches
}

function isRemoteUrl(u) {
	return /^https?:\/\//i.test(u)
}

function urlHead(url) {
	return new Promise((resolve) => {
		const client = url.startsWith("https") ? https : http
		const req = client.request(
			url,
			{ method: "HEAD", headers: { "User-Agent": "Mozilla/5.0 (node.js)" } },
			(res) => {
				resolve({ statusCode: res.statusCode })
			},
		)
		req.on("error", () => resolve({ statusCode: 0 }))
		req.setTimeout(5000, () => {
			req.destroy()
			resolve({ statusCode: 0 })
		})
		req.end()
	})
}

async function checkImage(src, htmlFile) {
	// preserve full remote URL (including querystring) for HTTP checks; strip for local
	const isRemote = isRemoteUrl(src)
	const cleanSrc = isRemote ? src : src.split(/[?#]/)[0]

	if (isRemote) {
		const { statusCode } = await urlHead(cleanSrc)
		if (statusCode >= 200 && statusCode < 400)
			return { ok: true, reason: `HTTP ${statusCode}` }
		if (statusCode === 404) return { ok: false, reason: `HTTP ${statusCode}` }
		return { ok: null, reason: `HTTP ${statusCode}` }
	}

	// Normalize local paths: allow absolute repo-root /src/... and relative ./images/...
	let candidate
	if (cleanSrc.startsWith("/")) {
		candidate = path.join(__dirname, "..", cleanSrc)
	} else {
		candidate = path.resolve(path.dirname(htmlFile), cleanSrc)
	}

	const exists = fs.existsSync(candidate)
	return { ok: exists, reason: exists ? "exists" : `missing: ${candidate}` }
}

// Simple runner
;(async function main() {
	const htmlFiles = walkDir(POSTS_DIR).filter((f) => f.endsWith(".html"))
	const failures = []
	const warnings = []

	for (const htmlFile of htmlFiles) {
		const html = fs.readFileSync(htmlFile, "utf8")
		const imgs = findImageSrcsFromHtml(html)
		for (const src of imgs) {
			const res = await checkImage(src, htmlFile)
			if (res.ok === true) continue
			if (res.ok === false)
				failures.push({ file: htmlFile, src, reason: res.reason })
			else warnings.push({ file: htmlFile, src, reason: res.reason })
		}
	}

	if (failures.length) {
		console.error("Broken image links found:")
		for (const f of failures)
			console.error(`${f.file} -> ${f.src} (${f.reason})`)
		process.exit(2)
	}

	if (warnings.length) {
		console.warn(
			"Image link warnings (remote servers may block HEAD/GET or return non-200):",
		)
		for (const w of warnings)
			console.warn(`${w.file} -> ${w.src} (${w.reason})`)
	}

	console.log("All image links OK (no definitive failures)")
	process.exit(0)
})()
