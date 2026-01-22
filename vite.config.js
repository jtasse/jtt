import { defineConfig } from "vite"
import { resolve, join, dirname, relative } from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import { execSync } from "child_process"
import { JSDOM } from "jsdom"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function getGitLastUpdated(filePath) {
	const relativePath = relative(__dirname, filePath).replace(/\\/g, "/")
	try {
		// Check for uncommitted changes
		const isDirty =
			execSync(`git status --porcelain "${relativePath}"`, {
				encoding: "utf8",
				stdio: ["ignore", "pipe", "ignore"],
			}).trim().length > 0

		if (isDirty) {
			console.log(
				`[getGitLastUpdated] Local changes detected for ${relativePath}`,
			)
			return new Date().toISOString().split("T")[0]
		}

		const stdout = execSync(
			`git log -1 --format=%cd --date=short "${relativePath}"`,
			{ encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
		)
		return stdout.trim()
	} catch (e) {
		console.warn(`[getGitLastUpdated] Failed for ${relativePath}:`, e.message)
		return null
	}
}

function generateRssXml(posts) {
	const siteUrl = "https://jamestasse.tech"
	const items = posts
		.map(
			(post) => `
		<item>
			<title><![CDATA[${post.title}]]></title>
			<link>${siteUrl}${post.link}</link>
			<guid>${siteUrl}${post.link}</guid>
			<pubDate>${new Date(post.date).toUTCString()}</pubDate>
			<description><![CDATA[${post.description}]]></description>
		</item>`,
		)
		.join("")

	return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
	<title>James Tasse's Blog</title>
	<link>${siteUrl}/blog</link>
	<description>Thoughts on technical writing, software development, and more.</description>
	<language>en-us</language>
	<atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
	${items}
</channel>
</rss>`
}

function formatDate(dateStr) {
	if (!dateStr) return ""
	const date = new Date(dateStr + "T12:00:00")
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	})
}

export default defineConfig(({ mode }) => {
	const alias = {}
	if (mode === "test") {
		alias["path2d-polyfill"] = resolve("tests/path2d-polyfill.js")
	}

	const handleProxyError = (err, req, res) => {
		console.error(
			"\n\x1b[33m%s\x1b[0m\n",
			"Proxy Error: Docs server not running. Run 'npm run dev:docs' in a separate terminal.",
		)
		res.writeHead(502, {
			"Content-Type": "text/plain",
		})
		res.end('Docs server is not running. Run "npm run dev:docs" to start it.')
	}

	return {
		plugins: [
			{
				name: "serve-rss-dev",
				configureServer(server) {
					server.middlewares.use((req, res, next) => {
						if (req.url === "/rss.xml") {
							const srcDir = resolve(__dirname, "src/content")
							const postsDir = join(srcDir, "blog/posts")
							const blogPosts = []

							if (fs.existsSync(postsDir)) {
								const files = fs.readdirSync(postsDir)
								files.forEach((file) => {
									if (file.endsWith(".html")) {
										const srcPath = join(postsDir, file)
										const content = fs.readFileSync(srcPath, "utf8")
										try {
											const dom = new JSDOM(content)
											const doc = dom.window.document
											const timeEl =
												doc.querySelector(".post-meta time") ||
												doc.querySelector("time")

											if (timeEl) {
												const title =
													doc.querySelector("h1")?.textContent || "Untitled"
												const date =
													timeEl.getAttribute("datetime") ||
													new Date().toISOString()
												const descMeta = doc.querySelector(
													'meta[name="description"]',
												)
												let description = descMeta ? descMeta.content : ""
												if (!description) {
													const firstP = doc.querySelector(
														"article p:not(.toc-heading)",
													)
													if (firstP) description = firstP.textContent
												}
												if (description.length > 300)
													description = description.substring(0, 297) + "..."
												const link = `/blog/posts/${file.replace(".html", "")}`
												blogPosts.push({ title, date, description, link })
											}
										} catch (e) {
											console.error("Error parsing post for RSS dev:", e)
										}
									}
								})
							}

							blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date))
							const rssXml = generateRssXml(blogPosts)

							res.setHeader("Content-Type", "application/xml")
							res.end(rssXml)
							return
						}
						next()
					})
				},
			},
			{
				name: "watch-content",
				handleHotUpdate({ file, server }) {
					if (
						file.replace(/\\/g, "/").includes("/src/content/") &&
						file.endsWith(".html")
					) {
						server.ws.send({ type: "full-reload", path: "*" })
					}
				},
			},
			{
				name: "copy-content",
				closeBundle() {
					const srcDir = resolve(__dirname, "src/content")
					const destDir = resolve(__dirname, "dist/src/content")
					const blogPosts = []

					if (fs.existsSync(srcDir)) {
						const copyRecursive = (src, dest) => {
							if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })
							fs.readdirSync(src).forEach((file) => {
								const srcPath = join(src, file)
								const destPath = join(dest, file)
								if (fs.statSync(srcPath).isDirectory()) {
									copyRecursive(srcPath, destPath)
								} else {
									// Check for blog HTML files to inject updated dates
									if (
										file.endsWith(".html") &&
										srcPath.replace(/\\/g, "/").includes("/src/content/blog")
									) {
										let content = fs.readFileSync(srcPath, "utf8")
										try {
											const dom = new JSDOM(content)
											const doc = dom.window.document
											let modified = false

											if (file === "blog.html") {
												const articles = doc.querySelectorAll("article")
												articles.forEach((article) => {
													const link = article.querySelector("h3 a")
													if (!link) return
													const href = link.getAttribute("href")
													if (!href) return

													const postPath = resolve(
														__dirname,
														href.replace(/^\//, ""),
													)
													if (fs.existsSync(postPath)) {
														const lastUpdated = getGitLastUpdated(postPath)
														const timeEl =
															article.querySelector(".post-meta time") ||
															article.querySelector("time")

														if (timeEl && lastUpdated) {
															const createdDate =
																timeEl.getAttribute("datetime")
															if (lastUpdated > createdDate) {
																const metaDiv =
																	article.querySelector(".post-meta") ||
																	timeEl.parentElement

																if (
																	metaDiv &&
																	!metaDiv.innerHTML.includes("Date updated")
																) {
																	console.log(
																		`[copy-content] Updating blog listing for ${href} with date ${lastUpdated}`,
																	)
																	timeEl.before(
																		doc.createTextNode("Date created: "),
																	)
																	const updatedHtml = ` | Date updated: <time datetime="${lastUpdated}">${formatDate(lastUpdated)}</time>`
																	timeEl.insertAdjacentHTML(
																		"afterend",
																		updatedHtml,
																	)
																	modified = true
																}
															}
														}
													}
												})
											} else if (
												srcPath
													.replace(/\\/g, "/")
													.includes("/src/content/blog/posts/")
											) {
												const lastUpdated = getGitLastUpdated(srcPath)
												const timeEl =
													doc.querySelector(".post-meta time") ||
													doc.querySelector("time")

												if (timeEl && lastUpdated) {
													const createdDate = timeEl.getAttribute("datetime")
													if (lastUpdated > createdDate) {
														const metaDiv =
															doc.querySelector(".post-meta") ||
															timeEl.parentElement

														if (
															metaDiv &&
															!metaDiv.innerHTML.includes("Date updated")
														) {
															console.log(
																`[copy-content] Updating post ${file} with date ${lastUpdated}`,
															)
															timeEl.before(
																doc.createTextNode("Date created: "),
															)
															const updatedHtml = ` | Date updated: <time datetime="${lastUpdated}">${formatDate(lastUpdated)}</time>`
															timeEl.insertAdjacentHTML("afterend", updatedHtml)
															modified = true
														}

														// Collect RSS data
														const title =
															doc.querySelector("h1")?.textContent || "Untitled"
														const date =
															timeEl.getAttribute("datetime") ||
															new Date().toISOString()
														const descMeta = doc.querySelector(
															'meta[name="description"]',
														)
														let description = descMeta ? descMeta.content : ""
														if (!description) {
															const firstP = doc.querySelector(
																"article p:not(.toc-heading)",
															)
															if (firstP) description = firstP.textContent
														}
														if (description.length > 300)
															description =
																description.substring(0, 297) + "..."
														const link = `/blog/posts/${file.replace(".html", "")}`
														blogPosts.push({ title, date, description, link })
													}
												}
											}

											if (modified) {
												content = dom.serialize()
											}
										} catch (e) {
											console.error(`Error processing ${file}:`, e)
										}
										fs.writeFileSync(destPath, content)
									} else {
										fs.copyFileSync(srcPath, destPath)
									}
								}
							})
						}
						copyRecursive(srcDir, destDir)
						console.log("[copy-content] Copied src/content to dist/src/content")

						// Copy Draco decoders from node_modules to dist/draco
						const dracoSrc = resolve(
							__dirname,
							"node_modules/three/examples/jsm/libs/draco",
						)
						const dracoDest = resolve(__dirname, "dist/draco")
						if (fs.existsSync(dracoSrc)) {
							copyRecursive(dracoSrc, dracoDest)
							console.log("[copy-content] Copied draco decoders to dist/draco")
						}

						// Fix for Netlify redirect loop on /portfolio
						// Ensure dist/portfolio/index.html exists so /portfolio/ serves it instead of redirecting
						const indexSrc = resolve(__dirname, "dist/index.html")
						const portfolioDir = resolve(__dirname, "dist/portfolio")

						if (fs.existsSync(indexSrc)) {
							if (!fs.existsSync(portfolioDir))
								fs.mkdirSync(portfolioDir, { recursive: true })
							fs.copyFileSync(indexSrc, join(portfolioDir, "index.html"))
							console.log(
								"[copy-content] Copied index.html to dist/portfolio/index.html",
							)
						}

						// Generate RSS Feed
						if (blogPosts.length > 0) {
							blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date))
							const rssXml = generateRssXml(blogPosts)
							fs.writeFileSync(resolve(__dirname, "dist/rss.xml"), rssXml)
							console.log(
								`[copy-content] Generated dist/rss.xml with ${blogPosts.length} posts`,
							)
						}
					}
				},
			},
		],
		server: {
			port: 5173,
			proxy: {
				"/portfolio/docs": {
					target: "http://127.0.0.1:4321",
					changeOrigin: true,
					onError: handleProxyError,
					ws: true,
				},
				// Proxy Astro/Starlight assets to the docs server
				"^/(@fs/.*)?(node_modules/astro|node_modules/@astrojs|packages/docs)/.*":
					{
						target: "http://127.0.0.1:4321",
						changeOrigin: true,
						onError: handleProxyError,
						ws: true,
					},
				// Proxy Astro component styles/scripts
				"^/.*\\?astro.*": {
					target: "http://127.0.0.1:4321",
					changeOrigin: true,
					onError: handleProxyError,
					ws: true,
				},
				// Proxy Astro/Starlight virtual modules
				"^/@id/.*(astro|starlight).*": {
					target: "http://127.0.0.1:4321",
					changeOrigin: true,
					onError: handleProxyError,
					ws: true,
				},
				// Proxy Astro-specific dependencies in node_modules/.vite
				"^/node_modules/\\.vite/deps/astro_.*": {
					target: "http://127.0.0.1:4321",
					changeOrigin: true,
					onError: handleProxyError,
					ws: true,
				},
				// Proxy docs styles (main app doesn't use src/styles)
				"^/src/styles/.*": {
					target: "http://127.0.0.1:4321",
					changeOrigin: true,
					onError: handleProxyError,
					ws: true,
				},
			},
		},
		resolve: {
			alias,
		},
		test: {
			environment: "jsdom",
		},
	}
})
