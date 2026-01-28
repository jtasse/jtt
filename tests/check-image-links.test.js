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
		const req = client.request(url, { method: "HEAD" }, (res) => {
			resolve({ statusCode: res.statusCode })
		})
		req.on("error", () => resolve({ statusCode: 0 }))
		req.setTimeout(5000, () => {
			req.destroy()
			resolve({ statusCode: 0 })
		})
		req.end()
	})
}

async function checkImage(src, htmlFile) {
	if (isRemoteUrl(src)) {
		const { statusCode } = await urlHead(src)
		return {
			ok: statusCode >= 200 && statusCode < 400,
			reason: `HTTP ${statusCode}`,
		}
	}

	// Normalize local paths: allow absolute repo-root /src/... and relative ./images/...
	let candidate
	if (src.startsWith("/")) {
		candidate = path.join(__dirname, "..", src)
	} else {
		candidate = path.resolve(path.dirname(htmlFile), src)
	}

	const exists = fs.existsSync(candidate)
	return { ok: exists, reason: exists ? "exists" : `missing: ${candidate}` }
}

// Simple runner
;(async function main() {
	const htmlFiles = walkDir(POSTS_DIR).filter((f) => f.endsWith(".html"))
	const failures = []

	for (const htmlFile of htmlFiles) {
		const html = fs.readFileSync(htmlFile, "utf8")
		const imgs = findImageSrcsFromHtml(html)
		for (const src of imgs) {
			const res = await checkImage(src, htmlFile)
			if (!res.ok) failures.push({ file: htmlFile, src, reason: res.reason })
		}
	}

	if (failures.length) {
		console.error("Broken image links found:")
		for (const f of failures)
			console.error(`${f.file} -> ${f.src} (${f.reason})`)
		process.exit(2)
	}

	console.log("All image links OK")
	process.exit(0)
})()
