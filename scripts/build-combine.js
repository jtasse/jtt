/**
 * Build Combine Script
 *
 * Copies the Astro Starlight docs build output to the main site's dist folder.
 * This allows both the Vite site and Astro docs to be deployed together.
 *
 * Run after: vite build && astro build
 * Output: dist/portfolio/docs/
 */

import { cpSync, existsSync, mkdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")

const docsSource = join(root, "packages/docs/dist")
const docsTarget = join(root, "dist/portfolio/docs")

console.info("Combining build outputs...")
console.info(`  Source: ${docsSource}`)
console.info(`  Target: ${docsTarget}`)

if (!existsSync(docsSource)) {
	console.error("Error: Docs build output not found at", docsSource)
	console.error("Make sure to run 'npm run build:docs' first")
	process.exit(1)
}

// Ensure target directory exists
mkdirSync(dirname(docsTarget), { recursive: true })

// Copy docs to target
cpSync(docsSource, docsTarget, { recursive: true })

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
		if (existsSync(f)) {
			const rel = f.replace(root + "/", "")
			const target = join(root, "dist", rel)
			mkdirSync(dirname(target), { recursive: true })
			cpSync(f, target)
			console.info(`Copied ${rel} -> ${target}`)
		}
	} catch (e) {
		console.warn(`Failed to copy extra file ${f}:`, e)
	}
}
