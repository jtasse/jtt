import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import matter from "gray-matter"
import { marked } from "marked"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SOURCE_DIR = path.resolve(__dirname, "../markdown")
const OUTPUT_DIR = path.resolve(__dirname, "../posts")
const NAV_IMAGES_DIR = path.resolve(__dirname, "../nav-images")
const BASE_URL = "https://jamestasse.tech"
const BLOG_LIST_PATH = path.resolve(__dirname, "../blog.html")

const GENERATED_START = "<!-- GENERATED_POSTS_START -->"
const GENERATED_END = "<!-- GENERATED_POSTS_END -->"

const IMAGE_EXTENSIONS = new Set([
	".png",
	".jpg",
	".jpeg",
	".webp",
	".gif",
	".avif",
	".svg",
])

function ensureDir(dirPath) {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true })
	}
}

function toPosixPath(filePath) {
	return filePath.replace(/\\/g, "/")
}

function escapeHtml(value) {
	return String(value ?? "")
		.replace(/&/g, "&amp;")
		.replace(/"/g, "&quot;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
}

function getMarkdownFiles(dir) {
	if (!fs.existsSync(dir)) return []

	let results = []
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name)
		if (entry.isDirectory()) {
			results = results.concat(getMarkdownFiles(fullPath))
			continue
		}
		if (entry.isFile() && entry.name.endsWith(".md")) {
			results.push(fullPath)
		}
	}
	return results
}

function getSlugFromFile(filePath) {
	const relativePath = toPosixPath(path.relative(SOURCE_DIR, filePath))
	const withoutExtension = relativePath.replace(/\.md$/i, "")
	const parts = withoutExtension.split("/")
	const last = parts[parts.length - 1]
	const parent = parts.length > 1 ? parts[parts.length - 2] : null

	if (last === "index") {
		return parts.slice(0, -1).join("/")
	}

	if (parent && last === parent) {
		return parts.slice(0, -1).join("/")
	}

	return withoutExtension
}

function formatDisplayDate(dateString) {
	if (!dateString) return ""
	return new Date(`${dateString}T12:00:00`).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	})
}

function normalizeFrontmatterDate(value, filePath) {
	if (!value) return ""

	const parsed = new Date(value)
	if (Number.isNaN(parsed.getTime())) {
		throw new Error(`Invalid frontmatter date in ${filePath}: ${value}`)
	}

	return parsed.toISOString().split("T")[0]
}

function isExternalUrl(filePath) {
	return /^(https?:)?\/\//i.test(filePath)
}

function isLocalProjectPath(filePath) {
	return filePath.startsWith("/")
}

function isImageFile(filePath) {
	return IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase())
}

function getPostFolderPath(slug) {
	return path.join(OUTPUT_DIR, slug)
}

function getNavImageFilename(slug, sourceImagePath) {
	return `${slug.replace(/\//g, "-")}${path.extname(sourceImagePath).toLowerCase()}`
}

function normalizeRelativeAssetPath(assetPath) {
	return toPosixPath(assetPath).replace(/^\.\//, "")
}

function stripLeadingImagesSegment(assetPath) {
	return assetPath.replace(/^images\//, "")
}

function removeDirIfExists(dirPath) {
	if (fs.existsSync(dirPath)) {
		fs.rmSync(dirPath, { recursive: true, force: true })
	}
}

function renderPostHtml({
	title,
	description,
	date,
	author,
	coverImageUrl,
	url,
	bodyHtml,
	stylesheetHrefs,
	scriptSrcs,
}) {
	const absoluteCoverImage = coverImageUrl.startsWith("http")
		? coverImageUrl
		: `${BASE_URL}${coverImageUrl.replace("/src/content", "")}`

	const coverMarkup = coverImageUrl
		? `
					<div class="post-image">
						<img src="${coverImageUrl.replace("/src/content", "")}" alt="${title}" />
					</div>
`
		: ""

	const extraStylesheets = stylesheetHrefs
		.map(
			(href) =>
				`    <link rel="stylesheet" href="${href.replace("/src/content", "")}">`,
		)
		.join("\n")

	const extraScripts = scriptSrcs
		.map(
			(src) => `    <script src="${src.replace("/src/content", "")}"></script>`,
		)
		.join("\n")

	return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - James Tasse</title>
    <meta name="description" content="${description}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${absoluteCoverImage}">
    <meta property="og:url" content="${url}">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="stylesheet" href="/blog/blog.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css">
${extraStylesheets}
    <script src="/blog/blog.js" defer></script>
</head>
<body>
    <div id="content" class="container">
        <main class="blog-content single-post">
            <article id="post-article">
${coverMarkup}                <h1>${title}</h1>
                <div class="post-meta"><time datetime="${date}">${formatDisplayDate(date)}</time> | ${author}</div>
                <section class="post-body">
                    ${bodyHtml}
                </section>
            </article>
        </main>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
${extraScripts}
</body>
</html>`
}

function renderGeneratedArticle(post) {
	return `				<article data-tags="${post.tags}" data-generated="true">
					<h3>
						<a href="/blog/posts/${post.slug}">${post.title}</a>
					</h3>
					<div class="post-meta">
						<time datetime="${post.date}">${formatDisplayDate(post.date)}</time> | ${post.author}
					</div>
					${
						post.image
							? `
					<div class="post-image">
						<a href="/blog/posts/${post.slug}">
							<img src="${post.image.replace("/src/content", "")}" alt="${post.title}" loading="lazy" decoding="async" />
						</a>
					</div>`
							: ""
					}
					<hr />
				</article>`
}

function updateBlogIndex(generatedPosts) {
	const generatedMarkup =
		generatedPosts.length > 0
			? generatedPosts.map(renderGeneratedArticle).join("\n")
			: ""

	const replacementBlock = `${GENERATED_START}
${generatedMarkup}
				${GENERATED_END}`

	let blogHtml = fs.readFileSync(BLOG_LIST_PATH, "utf8")
	if (blogHtml.includes(GENERATED_START) && blogHtml.includes(GENERATED_END)) {
		blogHtml = blogHtml.replace(
			new RegExp(`${GENERATED_START}[\\s\\S]*?${GENERATED_END}`),
			replacementBlock,
		)
	} else {
		const insertionPoint = /(<div id="filter-container"><\/div>\s*<\/div>\s*)/
		if (!insertionPoint.test(blogHtml)) {
			throw new Error(
				`Could not find insertion point in ${BLOG_LIST_PATH}. Add generated post markers manually.`,
			)
		}
		blogHtml = blogHtml.replace(insertionPoint, `$1\n${replacementBlock}\n`)
	}

	fs.writeFileSync(BLOG_LIST_PATH, blogHtml)
}

function getRelativeCoverPath(frontmatterImage) {
	if (
		!frontmatterImage ||
		isExternalUrl(frontmatterImage) ||
		isLocalProjectPath(frontmatterImage)
	) {
		return null
	}
	return normalizeRelativeAssetPath(frontmatterImage)
}

function buildLocalAssetManifest(sourceFolder, slug, coverRelativePath) {
	const assetDir = getPostFolderPath(slug)
	const copiedStylesheets = []
	const copiedScripts = []
	const sourceAssets = []

	if (!fs.existsSync(sourceFolder)) {
		return { copiedStylesheets, copiedScripts, sourceAssets }
	}

	for (const entry of fs.readdirSync(sourceFolder, { withFileTypes: true })) {
		if (entry.name.endsWith(".md")) continue
		sourceAssets.push(path.join(sourceFolder, entry.name))
	}

	if (sourceAssets.length === 0) {
		removeDirIfExists(assetDir)
		return { copiedStylesheets, copiedScripts, sourceAssets }
	}

	removeDirIfExists(assetDir)

	const walk = (dirPath) => {
		for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
			const absolutePath = path.join(dirPath, entry.name)
			const relativePath = normalizeRelativeAssetPath(
				path.relative(sourceFolder, absolutePath),
			)

			if (entry.isDirectory()) {
				walk(absolutePath)
				continue
			}

			if (entry.name.endsWith(".md")) continue
			if (coverRelativePath && relativePath === coverRelativePath) continue

			const extension = path.extname(entry.name).toLowerCase()
			let outputRelativePath = relativePath

			if (isImageFile(entry.name)) {
				outputRelativePath = `images/${stripLeadingImagesSegment(relativePath)}`
			}

			const outputPath = path.join(assetDir, outputRelativePath)
			ensureDir(path.dirname(outputPath))
			fs.copyFileSync(absolutePath, outputPath)

			const publicPath = `/src/content/blog/posts/${slug}/${toPosixPath(outputRelativePath)}`
			if (extension === ".css") copiedStylesheets.push(publicPath)
			if (extension === ".js") copiedScripts.push(publicPath)
		}
	}

	walk(sourceFolder)

	if (!fs.existsSync(assetDir)) {
		return { copiedStylesheets, copiedScripts, sourceAssets }
	}

	const remainingEntries = fs.readdirSync(assetDir)
	if (remainingEntries.length === 0) {
		removeDirIfExists(assetDir)
	}

	return { copiedStylesheets, copiedScripts, sourceAssets }
}

function copyCoverImage(slug, sourceFolder, frontmatterImage) {
	if (!frontmatterImage) return frontmatterImage || ""
	if (isExternalUrl(frontmatterImage) || isLocalProjectPath(frontmatterImage)) {
		return frontmatterImage
	}

	const relativePath = normalizeRelativeAssetPath(frontmatterImage)
	const sourcePath = path.join(sourceFolder, relativePath)
	if (!fs.existsSync(sourcePath)) {
		throw new Error(`Cover image not found for "${slug}": ${sourcePath}`)
	}

	ensureDir(NAV_IMAGES_DIR)
	const navFilename = getNavImageFilename(slug, sourcePath)
	const destinationPath = path.join(NAV_IMAGES_DIR, navFilename)
	fs.copyFileSync(sourcePath, destinationPath)
	return `/src/content/blog/nav-images/${navFilename}`
}

function resolveMarkdownImageUrl(slug, href, coverRelativePath, coverImageUrl) {
	if (!href) return ""
	if (isExternalUrl(href) || isLocalProjectPath(href)) return href

	const normalizedPath = normalizeRelativeAssetPath(href)
	if (coverRelativePath && normalizedPath === coverRelativePath) {
		return coverImageUrl
	}

	return `/src/content/blog/posts/${slug}/images/${stripLeadingImagesSegment(normalizedPath)}`
}

function main() {
	ensureDir(SOURCE_DIR)
	ensureDir(OUTPUT_DIR)
	ensureDir(NAV_IMAGES_DIR)

	if (!fs.existsSync(BLOG_LIST_PATH)) {
		throw new Error(`Missing blog index: ${BLOG_LIST_PATH}`)
	}

	const markdownFiles = getMarkdownFiles(SOURCE_DIR)
	const generatedPosts = []
	const seenSlugs = new Set()

	for (const filePath of markdownFiles) {
		const slug = getSlugFromFile(filePath)
		if (!slug) {
			throw new Error(`Could not determine slug for ${filePath}`)
		}
		if (seenSlugs.has(slug)) {
			throw new Error(`Duplicate slug "${slug}" generated from markdown.`)
		}
		seenSlugs.add(slug)

		const raw = fs.readFileSync(filePath, "utf8")
		const { data, content } = matter(raw)
		const date = normalizeFrontmatterDate(data.date, filePath)
		const title = escapeHtml(data.title || path.basename(slug))
		const ogTitle = escapeHtml(data.og_title || title)
		const description = escapeHtml(data.description || "")
		const author = escapeHtml(data.author || "James Tasse")
		const tags = escapeHtml(
			Array.isArray(data.tags) ? data.tags.join(", ") : (data.tags ?? ""),
		)
		const canonicalUrl = `https://jamestasse.tech/blog/posts/${slug}`
		const sourceFolder = path.dirname(filePath)
		const coverRelativePath = getRelativeCoverPath(data.image)
		const coverImageUrl = escapeHtml(
			copyCoverImage(slug, sourceFolder, data.image || ""),
		)
		const { copiedStylesheets, copiedScripts } = buildLocalAssetManifest(
			sourceFolder,
			slug,
			coverRelativePath,
		)

		const renderer = new marked.Renderer()
		renderer.image = ({ href, title: imageTitle, text }) => {
			const src = escapeHtml(
				resolveMarkdownImageUrl(slug, href, coverRelativePath, coverImageUrl),
			)
			const safeAlt = escapeHtml(text)
			const safeTitle = imageTitle ? ` title="${escapeHtml(imageTitle)}"` : ""
			return `<img src="${src}" alt="${safeAlt}"${safeTitle}>`
		}

		const bodyHtml = marked.parse(content, { renderer })
		const postHtml = renderPostHtml({
			title: ogTitle,
			description,
			date,
			author,
			coverImageUrl,
			url: canonicalUrl,
			bodyHtml,
			stylesheetHrefs: copiedStylesheets,
			scriptSrcs: copiedScripts,
			displayTitle: title,
		})

		const outputFilePath = path.join(OUTPUT_DIR, `${slug}.html`)
		function renderPostHtml({
			title,
			description,
			date,
			author,
			coverImageUrl,
			url,
			bodyHtml,
			stylesheetHrefs,
			scriptSrcs,
			displayTitle,
		}) {
			const absoluteCoverImage = coverImageUrl.startsWith("http")
				? coverImageUrl
				: `${BASE_URL}${coverImageUrl.replace("/src/content", "")}`

			const coverMarkup = coverImageUrl
				? `
					<div class="post-image">
						<img src="${coverImageUrl.replace("/src/content", "")}" alt="${displayTitle || title}" />
					</div>
`
				: ""

			const extraStylesheets = stylesheetHrefs
				.map(
					(href) =>
						`    <link rel="stylesheet" href="${href.replace("/src/content", "")}">`,
				)
				.join("\n")

			const extraScripts = scriptSrcs
				.map(
					(src) =>
						`    <script src="${src.replace("/src/content", "")}"></script>`,
				)
				.join("\n")

			return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${displayTitle || title} - James Tasse</title>
    <meta name="description" content="${description}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${absoluteCoverImage}">
    <meta property="og:url" content="${url}">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="stylesheet" href="/blog/blog.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css">
${extraStylesheets}
    <script src="/blog/blog.js" defer></script>
</head>
<body>
    <div id="content" class="container">
        <main class="blog-content single-post">
            <article id="post-article">
${coverMarkup}                <h1>${displayTitle || title}</h1>
                <div class="post-meta"><time datetime="${date}">${formatDisplayDate(date)}</time> | ${author}</div>
                <section class="post-body">
                    ${bodyHtml}
                </section>
            </article>
        </main>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
${extraScripts}
</body>
</html>`
		}
		ensureDir(path.dirname(outputFilePath))
		fs.writeFileSync(outputFilePath, postHtml)

		generatedPosts.push({
			slug,
			title,
			date,
			author,
			image: coverImageUrl,
			tags,
		})
	}

	generatedPosts.sort((a, b) => new Date(b.date) - new Date(a.date))
	updateBlogIndex(generatedPosts)

	console.log(
		`Generated ${generatedPosts.length} markdown post(s) and updated the generated blog index section.`,
	)
}

main()
