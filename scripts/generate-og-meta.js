import fs from "fs"
import path from "path"
import { JSDOM } from "jsdom"

const POSTS_DIR = path.join(process.cwd(), "src", "content", "blog", "posts")
const NAV_IMAGES_DIR = path.join(
	process.cwd(),
	"src",
	"content",
	"blog",
	"nav-images",
)
const SITE_BASE = "https://jamestasse.tech"

function stripTags(html) {
	return html
		.replace(/<[^>]*>/g, "")
		.replace(/\s+/g, " ")
		.trim()
}

function shortText(text, max = 200) {
	if (!text) return ""
	const t = text.replace(/\s+/g, " ").trim()
	return t.length > max ? t.slice(0, max - 1).trim() + "…" : t
}

function findNavImageForSlug(slug) {
	if (!fs.existsSync(NAV_IMAGES_DIR)) return null
	const files = fs.readdirSync(NAV_IMAGES_DIR)
	const tokens = slug.split(/[-_]/).filter(Boolean)

	// prefer exact startsWith match
	for (const f of files) {
		const lower = f.toLowerCase()
		if (lower.startsWith(slug.toLowerCase())) return f
	}

	// fallback: pick the file with the highest number of token matches
	const scores = files.map((f) => {
		const lower = f.toLowerCase()
		let score = 0
		for (const token of tokens) {
			if (lower.includes(token.toLowerCase())) score++
		}
		return { file: f, score }
	})

	scores.sort((a, b) => b.score - a.score)
	if (scores.length && scores[0].score > 0) return scores[0].file

	return null
}

function ensureMeta(doc, nameOrProp, attrName, content) {
	// attrName is either 'name' or 'property'
	const selector = `meta[${attrName}="${nameOrProp}"]`
	let el = doc.querySelector(selector)
	if (el) {
		el.setAttribute("content", content)
		return
	}
	el = doc.createElement("meta")
	el.setAttribute(attrName, nameOrProp)
	el.setAttribute("content", content)
	doc.head.appendChild(el)
}

function ensureLink(doc, rel, href) {
	const selector = `link[rel="${rel}"]`
	let el = doc.querySelector(selector)
	if (el) {
		el.setAttribute("href", href)
		return
	}
	el = doc.createElement("link")
	el.setAttribute("rel", rel)
	el.setAttribute("href", href)
	doc.head.appendChild(el)
}

function processFile(filePath) {
	const html = fs.readFileSync(filePath, "utf8")
	const dom = new JSDOM(html)
	const { document } = dom.window

	const titleEl = document.querySelector("title")
	let title = titleEl ? titleEl.textContent.trim() : null
	const h1 = document.querySelector(".single-post article h1")
	if (!title && h1) title = stripTags(h1.outerHTML)

	// description: first paragraph inside the article
	let description = ""
	const article = document.querySelector(".single-post article")
	if (article) {
		const p = article.querySelector("p")
		if (p) description = stripTags(p.innerHTML)
	}
	description = shortText(
		description || `${title} — read more on jamestasse.tech`,
		200,
	)

	// url: map file path to site URL (normalize to POSIX-style slashes)
	const contentRoot = path.join(process.cwd(), "src", "content")
	let relPath = path.relative(contentRoot, filePath)
	relPath = relPath.replace(/\\/g, "/")
	if (!relPath.startsWith("/")) relPath = "/" + relPath
	const url = SITE_BASE + relPath.replace(/index\.html$/, "")

	// try to find an image: first look for img in article
	let image = null
	if (article) {
		const img = article.querySelector("img")
		if (img && img.src) image = img.src
	}

	// fallback: try nav-images by slug
	if (!image) {
		const basename = path.basename(filePath, path.extname(filePath))
		const found = findNavImageForSlug(basename)
		if (found) image = SITE_BASE + "/src/content/blog/nav-images/" + found
	}

	// fallback: site default (use favicon or site image)
	if (!image) image = SITE_BASE + "/favicon/android-chrome-512x512.png"

	// inject/ensure meta tags
	ensureMeta(document, "description", "name", description)
	ensureLink(document, "canonical", url)
	ensureLink(document, "image_src", image)

	// OG
	ensureMeta(document, "og:type", "property", "article")
	ensureMeta(document, "og:title", "property", title || "")
	ensureMeta(document, "og:description", "property", description)
	ensureMeta(document, "og:image", "property", image)
	ensureMeta(document, "og:url", "property", url)
	ensureMeta(document, "og:site_name", "property", "James Tasse")

	// Twitter
	ensureMeta(document, "twitter:card", "name", "summary_large_image")
	ensureMeta(document, "twitter:title", "name", title || "")
	ensureMeta(document, "twitter:description", "name", description)
	ensureMeta(document, "twitter:image", "name", image)

	// write back only if changed
	const updated = dom.serialize()
	if (updated !== html) {
		fs.writeFileSync(filePath, updated, "utf8")
		console.log(`Updated meta for ${filePath}`)
	} else {
		console.log(`No change needed for ${filePath}`)
	}
}

function main() {
	const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".html"))
	for (const f of files) {
		try {
			processFile(path.join(POSTS_DIR, f))
		} catch (err) {
			console.error(`Error processing ${f}:`, err)
		}
	}
}

main()
