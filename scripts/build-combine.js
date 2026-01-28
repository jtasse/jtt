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
	// Ensure theme styles referenced by post shells are present in dist
	join(root, "src", "theme", "theme.css"),
	join(root, "src", "content", "portfolio", "theme.css"),
	// Also ensure blog/content assets (CSS/JS/overlays) are available
	join(root, "src", "content"),
]

for (const f of extraFiles) {
	try {
		if (fs.existsSync(f)) {
			const rel = relative(root, f)
			const target = join(root, "dist", rel)
			fs.mkdirSync(dirname(target), { recursive: true })
			// If the source is a directory, copy recursively; otherwise copy the file
			const stat = fs.statSync(f)
			if (stat.isDirectory()) {
				fs.cpSync(f, target, { recursive: true })
			} else {
				fs.cpSync(f, target)
			}
			console.info(`Copied ${rel} -> ${target}`)
		}
	} catch (e) {
		console.warn(`Failed to copy extra file ${f}:`, e)
	}
}

// Backwards-compatible copy: some post shells reference /src/content/theme/theme.css
// while the canonical file lives at /src/theme/theme.css. Ensure both paths exist
// in dist by duplicating the theme file into the content tree if needed.
try {
	const srcTheme = join(root, "src", "theme", "theme.css")
	const altTarget = join(root, "dist", "src", "content", "theme")
	if (fs.existsSync(srcTheme)) {
		fs.mkdirSync(altTarget, { recursive: true })
		fs.cpSync(srcTheme, join(altTarget, "theme.css"))
		console.info(
			`Also copied src/theme/theme.css -> dist/src/content/theme/theme.css`,
		)
	}
} catch (e) {
	console.warn("Failed to create fallback content/theme/theme.css:", e)
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

			// Inject a small MutationObserver safety shim early in the <head>
			// so third-party content scripts that call observe on non-Node targets
			// don't throw and break page scripts. Idempotent via marker check.
			if (!/window\.__MO_SAFE_PATCH/.test(html)) {
				const moShim = `\n    <script>\n      // window.__MO_SAFE_PATCH prevents double-injection\n      (function(){try{if(window.__MO_SAFE_PATCH)return;window.__MO_SAFE_PATCH=true;const orig=MutationObserver.prototype.observe;MutationObserver.prototype.observe=function(target,opts){try{if(target&&typeof target==='object'){if(typeof target.nodeType==='number'){return orig.call(this,target,opts);}try{if(target.document&&target.document.documentElement){return orig.call(this,target.document.documentElement,opts);}catch(e){} }console.warn('MO shim: skipping observe for non-Node target',target);return;}catch(e){try{return orig.call(this,target,opts)}catch(_){return}}};}catch(e){} })();\n      // Suppress cross-realm MutationObserver TypeError logged as uncaught\n      window.addEventListener('error', function(ev){try{if(ev && ev.message && ev.message.indexOf("Failed to execute 'observe' on 'MutationObserver'")!==-1){ev.stopImmediatePropagation && ev.stopImmediatePropagation();ev.preventDefault && ev.preventDefault();console.warn('Suppressed cross-realm MutationObserver TypeError');}}catch(e){}}, true);\n    </script>\n`
				html = html.replace(/<head([^>]*)>/i, (m) => m + moShim)
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

	// Additionally, inject the MutationObserver safety shim into top-level HTML
	// files in `dist` (excluding combined docs) so the shim runs as early as
	// possible on preview pages. This helps suppress cross-realm errors from
	// browser extensions or external content scripts.
	function walkAndInject(rootDir) {
		const stack = [rootDir]
		while (stack.length) {
			const cur = stack.pop()
			const entries = fs.readdirSync(cur, { withFileTypes: true })
			for (const e of entries) {
				const p = join(cur, e.name)
				if (e.isDirectory()) {
					// Skip docs folder where we don't want to inject
					if (p.includes(join("dist", "portfolio", "docs"))) continue
					stack.push(p)
				} else if (e.isFile() && p.endsWith(".html")) {
					let h = fs.readFileSync(p, "utf8")
					if (!/window\.__MO_SAFE_PATCH/.test(h)) {
						const shim = `\n    <script>\n      (function(){try{if(window.__MO_SAFE_PATCH)return;window.__MO_SAFE_PATCH=true;const orig=MutationObserver.prototype.observe;MutationObserver.prototype.observe=function(target,opts){try{if(target&&typeof target==='object'){if(typeof target.nodeType==='number'){return orig.call(this,target,opts);}try{if(target.document&&target.document.documentElement){return orig.call(this,target.document.documentElement,opts);}catch(e){} }console.warn('MO shim: skipping observe for non-Node target',target);return;}catch(e){try{return orig.call(this,target,opts)}catch(_){return}}};}catch(e){} })();\n      window.addEventListener('error', function(ev){try{if(ev && ev.message && ev.message.indexOf("Failed to execute 'observe' on 'MutationObserver'")!==-1){ev.stopImmediatePropagation && ev.stopImmediatePropagation();ev.preventDefault && ev.preventDefault();console.warn('Suppressed cross-realm MutationObserver TypeError');}}catch(e){}}, true);\n    </script>\n`
						h = h.replace(/<head([^>]*)>/i, (m) => m + shim)
						fs.writeFileSync(p, h, "utf8")
						console.info(`Injected MO shim into ${p}`)
					}
				}
			}
		}
	}

	walkAndInject(join(root, "dist"))

	// Post-process JS files in dist to replace optional catch binding ("catch {")
	// with a compatible form ("catch (e) {") to avoid "Unexpected token 'catch'"
	// in environments that don't support optional catch binding.
	try {
		const jsWalk = (dir) => {
			const ents = fs.readdirSync(dir, { withFileTypes: true })
			for (const en of ents) {
				const p = join(dir, en.name)
				if (en.isDirectory()) {
					jsWalk(p)
				} else if (en.isFile() && p.endsWith(".js")) {
					try {
						let content = fs.readFileSync(p, "utf8")
						// Replace `catch {` (optional catch) with `catch (e) {` where appropriate
						const replaced = content.replace(/\bcatch\s*\{/g, "catch (e) {")
						if (replaced !== content) {
							fs.writeFileSync(p, replaced, "utf8")
							console.info(`Patched optional catch in ${p}`)
						}
					} catch (err) {
						console.warn(`Failed to post-process JS file ${p}:`, err)
					}
				}
			}
		}
		jsWalk(join(root, "dist"))
	} catch (e) {
		console.warn(
			"Failed to post-process JS files for optional catch replacement:",
			e,
		)
	}

	// Also post-process inline scripts inside HTML files to replace optional catch
	try {
		const htmlWalk = (dir) => {
			const ents = fs.readdirSync(dir, { withFileTypes: true })
			for (const en of ents) {
				const p = join(dir, en.name)
				if (en.isDirectory()) {
					htmlWalk(p)
				} else if (en.isFile() && p.endsWith(".html")) {
					try {
						let content = fs.readFileSync(p, "utf8")
						// Replace only inside inline <script>...</script> blocks
						const newContent = content.replace(
							/<script\b[^>]*>([\s\S]*?)<\/script>/gi,
							(m, code) => {
								if (!code || !/\bcatch\s*\{/.test(code)) return m
								const patched = code.replace(/\bcatch\s*\{/g, "catch (e) {")
								return m.replace(code, patched)
							},
						)
						if (newContent !== content) {
							fs.writeFileSync(p, newContent, "utf8")
							console.info(`Patched optional catch in inline scripts in ${p}`)
						}
					} catch (err) {
						console.warn(`Failed to post-process HTML file ${p}:`, err)
					}
				}
			}
		}
		htmlWalk(join(root, "dist"))
	} catch (e) {
		console.warn(
			"Failed to post-process HTML inline scripts for optional catch replacement:",
			e,
		)
	}
} catch (e) {
	console.warn("Error while injecting client bundle into posts:", e)
}
