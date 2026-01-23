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

// Find the Vite-built client entry script (index-*.js) in dist/assets
try {
	const assetsDir = join(root, "dist", "assets")
	let mainScript = null
	if (fs.existsSync(assetsDir)) {
		const assets = fs.readdirSync(assetsDir)
		for (const a of assets) {
			if (/^index-.*\.js$/.test(a)) {
				mainScript = `/assets/${a}`
				break
			}
		}
	}

	// If we found a main script, inject it into built blog post HTML files so
	// they load the bundled client app (labels/theme) instead of referencing
	// unbundled /src/main.js
	if (mainScript) {
		const postsDistDir = join(root, "dist", "src", "content", "blog", "posts")
		if (fs.existsSync(postsDistDir)) {
			const postFiles = fs
				.readdirSync(postsDistDir)
				.filter((f) => f.endsWith(".html"))
			for (const pf of postFiles) {
				const ppath = join(postsDistDir, pf)
				let html = fs.readFileSync(ppath, "utf8")
				if (!html.includes(mainScript)) {
					// Insert as module script before </head>
					const scriptTag = `\n    <script type="module" crossorigin src="${mainScript}"></script>\n`
					html = html.replace("</head>", scriptTag + "</head>")
					fs.writeFileSync(ppath, html, "utf8")
					console.info(`Injected client bundle ${mainScript} into ${ppath}`)
				}
			}
		}
	} else {
		console.warn(
			"No Vite index-*.js asset found in dist/assets; skipping post bundle injection",
		)
	}
} catch (e) {
	console.warn("Error while injecting client bundle into posts:", e)
}
