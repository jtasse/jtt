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

console.log("Combining build outputs...")
console.log(`  Source: ${docsSource}`)
console.log(`  Target: ${docsTarget}`)

if (!existsSync(docsSource)) {
	console.error("Error: Docs build output not found at", docsSource)
	console.error("Make sure to run 'npm run build:docs' first")
	process.exit(1)
}

// Ensure target directory exists
mkdirSync(dirname(docsTarget), { recursive: true })

// Copy docs to target
cpSync(docsSource, docsTarget, { recursive: true })

console.log("Docs copied successfully to dist/portfolio/docs/")
