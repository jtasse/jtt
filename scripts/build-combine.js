/**
 * Build Combine Script
 *
 * Copies the Astro Starlight docs build output to the main site's dist folder.
 * This allows both the Vite site and Astro docs to be deployed together.
 *
 * Run after: vite build && astro build
 * Output: dist/portfolio/docs/
 */

import * as fs from "fs"
import { join, dirname, relative } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")

const docsSource = join(root, "packages/docs/dist")
const docsTarget = join(root, "dist/portfolio/docs")

console.info("Combining build outputs...")
console.info(`  Source: ${docsSource}`)
console.info(`  Target: ${docsTarget}`)

if (!fs.existsSync(docsSource)) {
	console.error("Error: Docs build output not found at", docsSource)
	console.error("Make sure to run 'npm run build:docs' first")
	process.exit(1)
}

// Ensure target directory exists
fs.mkdirSync(dirname(docsTarget), { recursive: true })

// Copy docs to target
fs.cpSync(docsSource, docsTarget, { recursive: true })

console.info("Docs copied successfully to dist/portfolio/docs/")

// Ensure certain root `src` files (client module scripts) are available in the final
// `dist` publish tree so pages that reference `/src/main.js` or similar get a real file
// instead of the SPA fallback. This copies a small set of files if they exist.
const extraFiles = [
	join(root, "src", "main.js"),
	join(root, "src", "router.js"),
	join(root, "src", "settings.json"),
]

for (const f of extraFiles) {
	try {
		if (fs.existsSync(f)) {
			const rel = relative(root, f)
			const target = join(root, "dist", rel)
			fs.mkdirSync(dirname(target), { recursive: true })
			fs.cpSync(f, target)
			console.info(`Copied ${rel} -> ${target}`)
		}
	} catch (e) {
		console.warn(`Failed to copy extra file ${f}:`, e)
	}
}

// Find the Vite-built client entry script (index-*.js) and CSS (index-*.css) in dist/assets
try {
	const assetsDir = join(root, "dist", "assets")
	let mainScript = null
	let mainCss = null
	if (fs.existsSync(assetsDir)) {
		const assets = fs.readdirSync(assetsDir)
		for (const a of assets) {
			if (!mainScript && /^index-.*\.js$/.test(a)) {
				mainScript = `/assets/${a}`
			}
			if (!mainCss && /^index-.*\.css$/.test(a)) {
				mainCss = `/assets/${a}`
			}
			if (mainScript && mainCss) break
		}
	}

	// If we found assets, inject them into built blog post HTML files so
	// they load the bundled client app (labels/theme) and main stylesheet.
	const postsDistDir = join(root, "dist", "src", "content", "blog", "posts")
	if (fs.existsSync(postsDistDir)) {
		const postFiles = fs
			.readdirSync(postsDistDir)
			.filter((f) => f.endsWith(".html"))
		for (const pf of postFiles) {
			const ppath = join(postsDistDir, pf)
			let html = fs.readFileSync(ppath, "utf8")

			// Clean up any malformed stylesheet hrefs that may have been created
			// by earlier incorrect replacements (e.g. href="/assets/index-...css\n    /src/content/blog/blog.css").
			const malformedBlogCssRegex =
				/<link[^>]*href="[^"]*\/src\/content\/blog\/blog\.css"[^>]*>/g
			html = html.replace(malformedBlogCssRegex, (m) => {
				// If the matched tag contains whitespace/newline inside the href value,
				// replace with two proper link tags: mainCss (if available) then blog.css.
				if (
					/href="[^"]*\s+[^"]*"/.test(m) ||
					(mainCss && m.includes(mainCss))
				) {
					const blogLink =
						'<link rel="stylesheet" href="/src/content/blog/blog.css">'
					if (mainCss)
						return `    <link rel="stylesheet" href="${mainCss}">\n    ${blogLink}`
					return `    ${blogLink}`
				}
				return m
			})

			// Inject main CSS if found and not already present
			if (mainCss && !html.includes(mainCss)) {
				// Insert the stylesheet BEFORE the existing blog stylesheet link if present,
				// otherwise insert just before </head>.
				const blogCssRegex =
					/<link[^>]*href="\/src\/content\/blog\/blog\.css"[^>]*>/
				if (blogCssRegex.test(html)) {
					html = html.replace(
						blogCssRegex,
						`<link rel="stylesheet" href="${mainCss}">\n    $&`,
					)
				} else {
					const linkTag = `\n    <link rel="stylesheet" href="${mainCss}">\n`
					html = html.replace("</head>", linkTag + "</head>")
				}
				console.info(`Injected main CSS ${mainCss} into ${ppath}`)
			}

			// Inject main JS bundle if found and not already present
			if (mainScript && !html.includes(mainScript)) {
				const scriptTag = `\n    <script type="module" crossorigin src="${mainScript}"></script>\n`
				html = html.replace("</head>", scriptTag + "</head>")
				console.info(`Injected client bundle ${mainScript} into ${ppath}`)
			}

			// Remove duplicate mainCss tags if they were accidentally inserted more than once
			if (mainCss) {
				const escaped = mainCss.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
				const linkRegex = new RegExp(`<link[^>]*href="${escaped}"[^>]*>`, "g")
				let seen = 0
				html = html.replace(linkRegex, (m) => {
					seen += 1
					return seen === 1 ? m : ""
				})
			}

			fs.writeFileSync(ppath, html, "utf8")
		}
	} else {
		console.warn("Posts directory not found; skipping asset injection")
	}
} catch (e) {
	console.warn("Error while injecting client bundle into posts:", e)
}
