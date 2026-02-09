import { loadContentHTML, parseBlogPosts } from "../contentLoader.js"
import { router } from "../router.js"
import { scene, controls } from "../core/SceneManager.js"
import { getPyramidAnimToken } from "../pyramid/state.js"
import { pyramidGroup } from "../pyramid/state.js"
import { ScrollManager } from "./ScrollManager.js"

let orcShowcaseModule = null

// === Content Display Logic ===

export function hideAllPlanes() {
	hideAbout()
	hidePortfolio()
	hideBlog()

	// Hide new content overlay
	const overlayEl = document.getElementById("content-overlay")
	if (overlayEl) {
		overlayEl.classList.remove("visible")
		// Deactivate all panes after transition
		setTimeout(() => {
			overlayEl.querySelectorAll(".content-pane").forEach((pane) => {
				pane.classList.remove("active")
				pane.innerHTML = ""
			})
		}, 300)
	}

	// Remove legacy 3D planes
	const aboutPlane = scene.getObjectByName("aboutPlane")
	if (aboutPlane) scene.remove(aboutPlane)
	const portfolioPlane = scene.getObjectByName("portfolioPlane")
	if (portfolioPlane) scene.remove(portfolioPlane)
	const blogPlane = scene.getObjectByName("blogPlane")
	if (blogPlane) scene.remove(blogPlane)

	// Hide scroll UI
	ScrollManager.hide()

	// Hide navigation bar DOM element as a fallback
	const contentFloor = document.getElementById("content-floor")
	if (contentFloor) contentFloor.classList.remove("show")

	// Hide DOM content pane
	const contentEl = document.getElementById("content")
	if (contentEl) {
		contentEl.style.display = "none"
		contentEl.classList.remove("blog-active")
		contentEl.innerHTML = ""
	}

	// Re-enable zoom when content is hidden
	if (controls) controls.enableZoom = true
}

// Scroll handling: when the location.hash changes, attempt to find the
// anchor inside the injected content or inside any iframe used to render
// the post and scroll it into view.
function tryScrollFragmentIntoContent() {
	try {
		const hash = (location && location.hash) || ""
		if (!hash) return
		const id = hash.replace(/^#/, "")

		// 1) Try to find the element in the main document (injected content)
		const contentRoot = document.getElementById("content")
		if (contentRoot) {
			const el =
				contentRoot.querySelector(`#${CSS.escape(id)}`) ||
				contentRoot.querySelector(`[name="${id}"]`)
			if (el) {
				el.scrollIntoView({ behavior: "smooth", block: "start" })
				return
			}
		}

		// 2) Try to find an iframe that contains the post and search inside it
		const iframe = document.querySelector(
			"#content iframe, #post-container iframe",
		)
		if (iframe) {
			try {
				const idoc = iframe.contentDocument || iframe.contentWindow.document
				if (!idoc) return
				const iel =
					idoc.getElementById(id) || idoc.querySelector(`[name="${id}"]`)
				if (iel) {
					// Scroll the iframe into view first, then the element inside it
					iframe.scrollIntoView({ behavior: "smooth", block: "start" })
					// Slight timeout to allow browser to layout iframe content
					setTimeout(() => {
						try {
							iel.scrollIntoView({ behavior: "smooth", block: "start" })
						} catch (e) {}
					}, 50)
				}
			} catch (e) {
				// Cross-origin or not ready — ignore
			}
		}
	} catch (e) {
		console.debug("tryScrollFragmentIntoContent error", e)
	}
}

// Listen for hash changes so externally-provided URLs with fragments
// will scroll into the injected post content when possible.
if (typeof window !== "undefined") {
	window.addEventListener("hashchange", tryScrollFragmentIntoContent)
}

export function showAboutPlane() {
	hideAllPlanes()
	if (controls) controls.enableZoom = false

	const navBar = document.getElementById("content-floor")
	if (navBar) navBar.classList.remove("show")

	const contentEl = document.getElementById("content")
	if (!contentEl) return

	const myToken = getPyramidAnimToken()

	loadContentHTML("about").then((html) => {
		if (myToken !== getPyramidAnimToken()) return

		contentEl.innerHTML = `<div class="about-content">${html}</div>`
		contentEl.style.display = ""
		contentEl.classList.add("show")
		contentEl.style.pointerEvents = "auto"
	})
}

export function showPortfolioPlane(onCloseCallback) {
	hideAllPlanes()
	if (controls) controls.enableZoom = false

	const navBar = document.getElementById("content-floor")
	if (navBar) navBar.classList.remove("show")

	const contentEl = document.getElementById("content")
	if (!contentEl) return

	const myToken = getPyramidAnimToken()

	loadContentHTML("portfolio").then(async (html) => {
		if (myToken !== getPyramidAnimToken()) return

		const parser = new DOMParser()
		const doc = parser.parseFromString(html, "text/html")
		const scriptEl = doc.querySelector("script")
		if (scriptEl) scriptEl.remove()

		contentEl.innerHTML = `<div class="portfolio-content">${doc.body.innerHTML}</div>`
		contentEl.style.display = ""
		contentEl.classList.add("show")
		contentEl.style.pointerEvents = "auto"

		// Initialize the ORC showcase in the header container
		const showcaseContainer = contentEl.querySelector("#orc-showcase-container")
		if (showcaseContainer) {
			// Small delay to ensure container has proper dimensions
			setTimeout(async () => {
				if (!orcShowcaseModule) {
					orcShowcaseModule = await import("./orc-demo/OrcShowcase.js")
				}
				orcShowcaseModule.createOrcShowcase(showcaseContainer)
			}, 0)
		}

		setupPortfolioClickHandlers(contentEl, onCloseCallback)
	})
}

export function showBlogPlane() {
	hideAllPlanes()
	if (controls) controls.enableZoom = false

	const navBar = document.getElementById("content-floor")
	if (navBar) navBar.classList.remove("show")

	const contentEl = document.getElementById("content")
	if (!contentEl) return

	const myToken = getPyramidAnimToken()

	loadContentHTML("blog").then((html) => {
		if (myToken !== getPyramidAnimToken()) return

		const posts = parseBlogPosts(html)
		let contentHtml = ""

		if (posts && posts.length > 0) {
			contentHtml = posts
				.map((post) => {
					const route = post.url
						.replace(/^(\/)?src\/content/, "")
						.replace(/\.html$/, "")
					const tags = post.tags || post.keywords || ""
					return `<article class="blog-post-item" data-tags="${tags}">
						<a href="${route}" class="blog-post-link">
							<div class="blog-post">
								<h2>${post.title}</h2>
								<div class="blog-meta">${post.date} | ${post.author}</div>
								${post.image ? `<div class="post-image"><img src="${post.image}" alt="${post.title}"></div>` : ""}
								<p>${post.summary}</p>
							</div>
						</a>
					</article>`
				})
				.join("")
		} else {
			// Extract main content if possible to avoid duplicating headers/footers
			const parser = new DOMParser()
			const doc = parser.parseFromString(html, "text/html")
			const main = doc.querySelector("main")
			contentHtml = main ? main.innerHTML : html
		}
		contentEl.innerHTML = `<div class="blog-content">${contentHtml}</div>`
		contentEl.style.display = ""
		contentEl.classList.add("show")
		contentEl.style.pointerEvents = "auto"

		// Add click handlers to prevent default navigation and use the client-side router
		contentEl.querySelectorAll("a").forEach((link) => {
			const href = link.getAttribute("href")
			if (
				href &&
				(link.classList.contains("blog-post-link") ||
					href.includes("/src/content/blog/posts/"))
			) {
				link.addEventListener("click", (e) => {
					e.preventDefault()
					let route = href
					if (route.includes("/src/content/")) {
						route = route.replace("/src/content", "").replace(".html", "")
					}
					window.history.pushState({}, "", route)
					showBlogPost(route)
				})
			}
		})
	})
}

export function showBlogPost(route) {
	hideAllPlanes()
	if (controls) controls.enableZoom = false

	const navBar = document.getElementById("content-floor")
	if (navBar) navBar.classList.remove("show")

	const contentEl = document.getElementById("content")
	if (!contentEl) return

	const myToken = getPyramidAnimToken()

	// Normalize route to support several incoming forms:
	// - `/blog/posts/slug`
	// - `/blog/posts/slug.html`
	// - `/src/content/blog/posts/slug` (full path)
	// - `/src/content/blog/posts/slug.html` (full path with extension)
	let normalizedRoute = route || ""
	if (normalizedRoute.startsWith("/src/content")) {
		normalizedRoute = normalizedRoute.replace(/^\/src\/content/, "")
	}
	if (normalizedRoute.endsWith(".html")) {
		normalizedRoute = normalizedRoute.replace(/\.html$/, "")
	}
	const fetchUrl = `/src/content${normalizedRoute}.html`

	// Helper to try the requested URL, then fall back to /index.html only when
	// the direct .html fetch returns 404. This avoids accepting the SPA shell.
	async function fetchHtmlWithIndexFallback(url, opts) {
		const direct = await fetch(url, opts)
		if (direct && direct.ok) return direct

		if (direct && direct.status !== 404) return direct

		if (/\.html$/i.test(url)) {
			const indexUrl = url.replace(/\.html$/i, "/index.html")
			try {
				return await fetch(indexUrl, opts)
			} catch (e) {
				// ignore network errors and fall back to returning direct response
			}
		}

		return direct
	}

	function isSpaShellHtml(html) {
		if (!html) return false
		return (
			html.includes("__indexHtmlLoaded") ||
			html.includes("/src/main.js") ||
			html.includes("#scene-container") ||
			html.includes('id="site-footer"')
		)
	}

	console.debug("showBlogPost: fetching", fetchUrl)
	fetchHtmlWithIndexFallback(fetchUrl)
		.then((res) => {
			console.debug("showBlogPost: fetch result", res && res.status)
			if (!res || !res.ok) throw new Error("Failed to load post")
			return res.text()
		})
		.then((html) => {
			console.debug(
				"showBlogPost: myToken=",
				myToken,
				"current=",
				getPyramidAnimToken(),
			)
			if (myToken !== getPyramidAnimToken()) {
				console.debug("showBlogPost: token changed, aborting render")
				return
			}

			if (isSpaShellHtml(html)) {
				throw new Error("Post HTML resolved to SPA shell")
			}

			const parser = new DOMParser()
			console.debug("showBlogPost: fetched html length", html.length)
			console.debug("showBlogPost: fetched html snippet", html.slice(0, 200))
			const doc = parser.parseFromString(html, "text/html")

			// Extract the post folder name from the normalized route to resolve relative paths
			// e.g., "/blog/posts/abstraction-part-i-road-to-the-WYSIWYG" -> "abstraction-part-i-road-to-the-WYSIWYG"
			const postFolderName = normalizedRoute.split("/").filter(Boolean).pop()

			// Helper to convert relative paths to absolute blog post paths
			function resolvePostPath(src) {
				if (!src) return null
				// Already absolute
				if (src.startsWith("/src/content/blog/")) return src
				// Relative path like "./slug.js" or "./style.css" -> resolve to post folder
				if (src.startsWith("./")) {
					return `/src/content/blog/posts/${postFolderName}/${src.slice(2)}`
				}
				// Other relative paths
				if (!src.startsWith("/") && !src.startsWith("http")) {
					return `/src/content/blog/posts/${postFolderName}/${src}`
				}
				return src
			}

			// Copy stylesheet links from the fetched document into the current
			// document head so per-post CSS is applied when we inject only the
			// body content. Avoid adding duplicates by checking existing hrefs.
			try {
				doc.querySelectorAll('link[rel="stylesheet"]').forEach((lnk) => {
					const href = lnk.getAttribute("href")
					const resolvedHref = resolvePostPath(href)
					if (!resolvedHref || !resolvedHref.startsWith("/src/content/blog/"))
						return
					// Check if an equivalent href already exists in current head
					const exists = Array.from(
						document.head.querySelectorAll('link[rel="stylesheet"]'),
					).some((h) => h.getAttribute("href") === resolvedHref)
					if (!exists) {
						const newLink = document.createElement("link")
						newLink.setAttribute("rel", "stylesheet")
						newLink.setAttribute("href", resolvedHref)
						document.head.appendChild(newLink)
					}
				})

				// Also copy over script tags with src so post-specific JS runs.
				doc.querySelectorAll("script[src]").forEach((s) => {
					const src = s.getAttribute("src")
					const resolvedSrc = resolvePostPath(src)
					if (!resolvedSrc || !resolvedSrc.startsWith("/src/content/blog/"))
						return
					const exists = Array.from(
						document.head.querySelectorAll("script"),
					).some((h) => h.getAttribute("src") === resolvedSrc)
					if (!exists) {
						const scr = document.createElement("script")
						scr.setAttribute("src", resolvedSrc)
						if (s.hasAttribute("defer")) scr.setAttribute("defer", "")
						document.head.appendChild(scr)
					}
				})
			} catch (e) {
				console.debug("Failed to copy post assets:", e)
			}
			// Prefer main.blog-content or .blog-content to extract the article body
			let contentElMatch = null
			let content = null
			// Prefer explicit article element when available to avoid injecting
			// full page wrappers (headers/footers) which cause duplication.
			const postArticle = doc.querySelector("article#post-article")
			if (postArticle) {
				contentElMatch = "article#post-article"
				content = postArticle.outerHTML
			} else {
				const matchedMain = doc.querySelector("main.blog-content")
				if (matchedMain) {
					contentElMatch = "main.blog-content"
					console.debug(
						"showBlogPost: matched outerHTML snippet",
						matchedMain.outerHTML.slice(0, 300),
					)
					content = matchedMain.innerHTML
				} else if (doc.querySelector(".blog-content")) {
					contentElMatch = ".blog-content"
					content = doc.querySelector(".blog-content").innerHTML
				} else if (doc.querySelector("#content")) {
					contentElMatch = "#content"
					content = doc.querySelector("#content").innerHTML
					// If the selected container exists but is empty (some templates
					// render content client-side), fall back to the full body so we
					// still inject something useful.
					if (!content || !content.trim()) {
						content = doc.body ? doc.body.innerHTML : content
						contentElMatch = contentElMatch + " (fallback to body)"
					}
				} else if (doc.querySelector("main")) {
					contentElMatch = "main"
					content = doc.querySelector("main").innerHTML
				} else {
					contentElMatch = "body"
					content = doc.body.innerHTML
				}
			}

			console.debug("showBlogPost: matched selector", contentElMatch)
			// Log a short snippet to help debug missing content issues
			try {
				console.debug(
					"showBlogPost: content snippet",
					content && content.slice ? content.slice(0, 300) : String(content),
				)
			} catch (e) {}
			console.debug(
				"showBlogPost: injecting content (len)",
				content && content.length,
			)
			contentEl.innerHTML = `
						<div class="blog-content single-post">
							${content}
						</div>
					`
			contentEl.style.display = ""
			contentEl.classList.add("show")
			contentEl.style.pointerEvents = "auto"
			// If the URL contains a fragment (or later changes), attempt to
			// scroll the corresponding element inside the injected content
			// or inside any same-origin iframe that hosts the post.
			tryScrollFragmentIntoContent()
		})
		.catch((err) => {
			console.error(err)
			contentEl.innerHTML = `
				<div class="blog-content single-post">
					<h1>Error</h1>
					<p>Failed to load blog post. Please try again later.</p>
				</div>
			`
			contentEl.style.display = ""
			contentEl.classList.add("show")
			contentEl.style.pointerEvents = "auto"
		})
}

function hideAbout() {
	const aboutPlane = scene.getObjectByName("aboutPlane")
	if (aboutPlane) scene.remove(aboutPlane)

	const contentEl = document.getElementById("content")
	if (contentEl && contentEl.querySelector(".about-content")) {
		contentEl.classList.remove("show")
		contentEl.innerHTML = ""
	}
}

function hidePortfolio() {
	const plane = scene.getObjectByName("portfolioPlane")

	// Clean up ORC showcase if active
	if (orcShowcaseModule) {
		orcShowcaseModule.cleanupOrcShowcase()
	}

	if (plane) scene.remove(plane)

	const contentEl = document.getElementById("content")
	if (
		contentEl &&
		(contentEl.querySelector(".portfolio-content") ||
			contentEl.querySelector(".embed-wrapper"))
	) {
		contentEl.classList.remove("show")
		contentEl.innerHTML = ""
	}
}

function hideBlog() {
	const blogPlane = scene.getObjectByName("blogPlane")
	if (blogPlane) scene.remove(blogPlane)

	const contentEl = document.getElementById("content")
	if (contentEl && contentEl.querySelector(".blog-content")) {
		contentEl.classList.remove("show")
		contentEl.innerHTML = ""
	}
}

// === Portfolio Helpers ===

function setupPortfolioClickHandlers(contentEl, onCloseCallback) {
	contentEl.querySelectorAll(".portfolio-item").forEach((item) => {
		item.style.cursor = "pointer"
		item.addEventListener("click", (ev) => {
			ev.preventDefault()
			ev.stopPropagation()
			const link = item.dataset.link
			if (!link) return

			const ytId = extractYouTubeID(link)
			if (ytId) {
				const embedUrl = `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`
				showEmbedViewer(contentEl, embedUrl, onCloseCallback)
				return
			}

			const docId = extractGoogleDocsID(link)
			if (docId) {
				const embedUrl = `https://docs.google.com/document/d/${docId}/preview`
				showEmbedViewer(contentEl, embedUrl, onCloseCallback)
				return
			}

			if (isImageURL(link)) {
				showImageViewer(contentEl, link, onCloseCallback)
				return
			}

			window.open(link, "_blank")
		})
	})

	// Handle external links (like Wikipedia links)
	contentEl.querySelectorAll("a[href^='http']").forEach((link) => {
		link.addEventListener("click", (ev) => {
			ev.preventDefault()
			ev.stopPropagation()
			window.open(link.getAttribute("href"), "_blank")
		})
	})

	// Resume link handler (in intro text)
	const resumeLink = contentEl.querySelector(".resume-link")
	if (resumeLink) {
		resumeLink.addEventListener("click", (ev) => {
			ev.preventDefault()
			ev.stopPropagation()
			const link = resumeLink.getAttribute("href")
			const docId = extractGoogleDocsID(link)
			if (docId) {
				const embedUrl = `https://docs.google.com/document/d/${docId}/preview`
				showEmbedViewer(contentEl, embedUrl, onCloseCallback)
			}
		})
	}

	// Handle Diataxis quadrant clicks
	contentEl.querySelectorAll(".diataxis-quadrant").forEach((quadrant) => {
		quadrant.addEventListener("click", (ev) => {
			ev.preventDefault()
			ev.stopPropagation()
			const link = quadrant.dataset.link
			if (link) {
				showEmbedViewer(contentEl, link, onCloseCallback)
			}
		})
	})

	// Handle launch button clicks
	contentEl.querySelectorAll(".orc-launch-btn").forEach((btn) => {
		btn.addEventListener("click", (ev) => {
			ev.preventDefault()
			ev.stopPropagation()
			const href = btn.getAttribute("href")
			if (href) {
				if (href.startsWith("/portfolio/orc-demo")) {
					router.navigate(href)
				} else {
					window.location.href = href
				}
			}
		})
	})
}

function showEmbedViewer(contentEl, embedUrl, onCloseCallback) {
	contentEl.scrollTop = 0
	contentEl.classList.add("fullscreen-viewer")

	contentEl.innerHTML = `
		<div class="embed-wrapper" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
			<div class="embed-inner-container" style="display: flex; flex-direction: column; width: 100%; height: 100%; background: rgba(10, 10, 26, 0.95); padding: 10px; border-radius: 8px; border: 1px solid #00ffff;">
				<div class="embed-controls" style="display: flex; justify-content: flex-end; align-items: center; gap: 10px; margin-bottom: 10px; flex-shrink: 0;">
					<a href="${embedUrl}" target="_blank" class="embed-control-btn" title="Open in new tab" style="display: flex; align-items: center; gap: 8px; color: white; text-decoration: none; background: rgba(0, 255, 255, 0.1); padding: 8px 12px; border-radius: 4px; border: 1px solid #00ffff; transition: all 0.2s ease;">
						<span style="font-size: 0.9rem; font-weight: bold;">Open in new tab</span>
						<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF">
							<path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"/>
						</svg>
					</a>
					<button class="embed-control-btn embed-close-btn" title="Close" style="background: rgba(255, 0, 0, 0.2); border: 1px solid #ff4444; border-radius: 4px; cursor: pointer; padding: 5px; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
						<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
							<path d="M256-213.85 213.85-256l224-224-224-224L256-746.15l224 224 224-224L746.15-704l-224 224 224 224L704-213.85l-224-224-224 224Z"/>
						</svg>
					</button>
				</div>
				<div class="embed-content-container" style="flex: 1; min-height: 0; overflow: hidden; position: relative;">
					<iframe
						src="${embedUrl}"
						style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen
					></iframe>
				</div>
			</div>
		</div>
	`

	const closeViewer = () => {
		document.removeEventListener("keydown", onEsc)
		contentEl.classList.remove("fullscreen-viewer")
		showPortfolioPlane(onCloseCallback)
	}

	const onEsc = (e) => {
		if (e.key === "Escape") closeViewer()
	}
	document.addEventListener("keydown", onEsc)

	const closeBtn = contentEl.querySelector(".embed-close-btn")
	if (closeBtn) {
		closeBtn.addEventListener("click", closeViewer)
	}
}

function showImageViewer(contentEl, imageUrl, onCloseCallback) {
	contentEl.scrollTop = 0
	contentEl.innerHTML = `
		<div class="embed-wrapper" style="display: flex; align-items: center; justify-content: center;">
			<div class="embed-inner-container" style="display: flex; flex-direction: column; width: auto; max-width: 90vw; height: auto; max-height: 90vh; background: rgba(10, 10, 26, 0.95); padding: 10px; border-radius: 8px; border: 1px solid #00ffff;">
				<div class="embed-controls" style="display: flex; justify-content: flex-end; align-items: center; gap: 10px; margin-bottom: 10px; flex-shrink: 0;">
					<a href="${imageUrl}" target="_blank" class="embed-control-btn" title="Open in new tab" style="display: flex; align-items: center; gap: 8px; color: white; text-decoration: none; background: rgba(0, 255, 255, 0.1); padding: 8px 12px; border-radius: 4px; border: 1px solid #00ffff; transition: all 0.2s ease;">
						<span style="font-size: 0.9rem; font-weight: bold;">Open in new tab</span>
						<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF">
							<path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"/>
						</svg>
					</a>
					<button class="embed-control-btn embed-close-btn" title="Close" style="background: rgba(255, 0, 0, 0.2); border: 1px solid #ff4444; border-radius: 4px; cursor: pointer; padding: 5px; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
						<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
							<path d="M256-213.85 213.85-256l224-224-224-224L256-746.15l224 224 224-224L746.15-704l-224 224 224 224L704-213.85l-224-224-224 224Z"/>
						</svg>
					</button>
				</div>
				<div class="embed-content-container" style="flex: 1; min-height: 0; overflow: hidden; display: flex; justify-content: center; align-items: center;">
					<img
						src="${imageUrl}"
						alt="Portfolio image"
						class="portfolio-viewer-image"
						style="max-width: 100%; max-height: calc(90vh - 60px); object-fit: contain; border: 1px solid #335555; border-radius: 4px;"
					/>
				</div>
			</div>
		</div>
	`

	const closeViewer = () => {
		document.removeEventListener("keydown", onEsc)
		showPortfolioPlane(onCloseCallback)
	}

	const onEsc = (e) => {
		if (e.key === "Escape") closeViewer()
	}
	document.addEventListener("keydown", onEsc)

	const closeBtn = contentEl.querySelector(".embed-close-btn")
	if (closeBtn) {
		closeBtn.addEventListener("click", closeViewer)
	}
}

function extractYouTubeID(url) {
	try {
		const u = new URL(url)
		if (u.hostname.includes("youtube.com")) return u.searchParams.get("v")
		if (u.hostname === "youtu.be") return u.pathname.slice(1)
	} catch {
		return null
	}
	return null
}

function extractGoogleDocsID(url) {
	try {
		const u = new URL(url)
		if (u.hostname.includes("docs.google.com")) {
			const match = u.pathname.match(/\/document\/d\/([^/]+)/)
			return match ? match[1] : null
		}
	} catch {
		return null
	}
	return null
}

function isImageURL(url) {
	try {
		const u = new URL(url, window.location.origin)
		const path = u.pathname.toLowerCase()
		return /\.(png|jpg|jpeg|gif|webp|svg)$/.test(path)
	} catch {
		return false
	}
}

// === Global Link Handling ===

export function handleContentLink(link, router) {
	if (!link) return false

	// Check for internal routes (like /orc-demo)
	if (link.startsWith("/")) {
		if (router) router.navigate(link)
		return true
	}

	const ytId = extractYouTubeID(link)
	const contentEl = document.getElementById("content")

	hideAllPlanes()

	if (contentEl) {
		contentEl.style.bottom = ""
		contentEl.style.maxHeight = ""
	}

	if (ytId) {
		const embedUrl = `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`
		showFullScreenEmbed(contentEl, embedUrl, "video")
		return true
	}

	const docId = extractGoogleDocsID(link)
	if (docId) {
		const embedUrl = `https://docs.google.com/document/d/${docId}/preview`
		showFullScreenEmbed(contentEl, embedUrl, "doc")
		return true
	}

	if (isImageURL(link)) {
		showFullScreenImage(contentEl, link)
		return true
	}

	// Fallback: open in new tab
	window.open(link, "_blank")
	return true
}

function showFullScreenEmbed(contentEl, url, _type) {
	if (!contentEl) return

	contentEl.scrollTop = 0
	// Reset styles for full screen
	contentEl.innerHTML = ""
	contentEl.className = "fullscreen-viewer"
	contentEl.style.display = "block"
	contentEl.style.pointerEvents = "auto"

	contentEl.innerHTML = `
		<div class="embed-wrapper" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
			<div class="embed-inner-container" style="display: flex; flex-direction: column; width: 100%; height: 100%; background: rgba(10, 10, 26, 0.95); padding: 10px; border-radius: 8px; border: 1px solid #00ffff;">
				<div class="embed-controls" style="display: flex; justify-content: flex-end; align-items: center; gap: 10px; margin-bottom: 10px; flex-shrink: 0;">
					<a href="${url}" target="_blank" class="embed-control-btn" title="Open in new tab" style="display: flex; align-items: center; gap: 8px; color: white; text-decoration: none; background: rgba(0, 255, 255, 0.1); padding: 8px 12px; border-radius: 4px; border: 1px solid #00ffff; transition: all 0.2s ease;">
						<span style="font-size: 0.9rem; font-weight: bold;">Open in new tab</span>
						<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF">
							<path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"/>
						</svg>
					</a>
					<button class="embed-control-btn embed-close-btn" title="Close" style="background: rgba(255, 0, 0, 0.2); border: 1px solid #ff4444; border-radius: 4px; cursor: pointer; padding: 5px; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
						<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
							<path d="M256-213.85 213.85-256l224-224-224-224L256-746.15l224 224 224-224L746.15-704l-224 224 224 224L704-213.85l-224-224-224 224Z"/>
						</svg>
					</button>
				</div>
				<div class="embed-content-container" style="flex: 1; min-height: 0; overflow: hidden; position: relative;">
					<iframe
						src="${url}"
						style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen
					></iframe>
				</div>
			</div>
		</div>
	`

	const closeViewer = () => {
		document.removeEventListener("keydown", onEsc)
		contentEl.innerHTML = ""
		contentEl.style.display = "none"
		contentEl.className = ""
		// Restore portfolio state
		if (pyramidGroup) {
			pyramidGroup.visible = true
			// We assume we came from portfolio if clicking links
			showPortfolioPlane()
		}
	}

	const onEsc = (e) => {
		if (e.key === "Escape") closeViewer()
	}
	document.addEventListener("keydown", onEsc)

	const closeBtn = contentEl.querySelector(".embed-close-btn")
	if (closeBtn) {
		closeBtn.addEventListener("click", closeViewer)
	}
}

function showFullScreenImage(contentEl, url, onCloseCallback) {
	if (!contentEl) return

	contentEl.scrollTop = 0
	contentEl.innerHTML = ""
	contentEl.className = "fullscreen-viewer"
	contentEl.style.display = "block"
	contentEl.style.pointerEvents = "auto"

	contentEl.innerHTML = `
		<div class="embed-wrapper" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
			<div class="embed-inner-container" style="display: flex; flex-direction: column; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.95); padding: 10px; box-sizing: border-box;">
				<div class="embed-controls" style="display: flex; justify-content: flex-end; align-items: center; gap: 10px; margin-bottom: 10px; flex-shrink: 0;">
					<a href="${url}" target="_blank" class="embed-control-btn" title="Open in new tab" style="display: flex; align-items: center; gap: 8px; color: white; text-decoration: none; background: rgba(0, 255, 255, 0.1); padding: 8px 12px; border-radius: 4px; border: 1px solid #00ffff; transition: all 0.2s ease;">
						<span style="font-size: 0.9rem; font-weight: bold;">Open in new tab</span>
						<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF">
							<path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"/>
						</svg>
					</a>
					<button class="embed-control-btn embed-close-btn" title="Close" style="background: rgba(255, 0, 0, 0.2); border: 1px solid #ff4444; border-radius: 4px; cursor: pointer; padding: 5px; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
						<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
							<path d="M256-213.85 213.85-256l224-224-224-224L256-746.15l224 224 224-224L746.15-704l-224 224 224 224L704-213.85l-224-224-224 224Z"/>
						</svg>
					</button>
				</div>
				<div class="embed-content-container" style="flex: 1; min-height: 0; overflow: hidden; display: flex; justify-content: center; align-items: center;">
					<img
						src="${url}"
						alt="Full screen image"
						style="max-width: 100%; max-height: 100%; object-fit: contain;"
					/>
				</div>
			</div>
		</div>
	`

	const closeViewer = () => {
		document.removeEventListener("keydown", onEsc)
		if (onCloseCallback) {
			onCloseCallback()
		} else {
			contentEl.innerHTML = ""
			contentEl.style.display = "none"
			contentEl.className = ""
			if (pyramidGroup) {
				pyramidGroup.visible = true
				showPortfolioPlane()
			}
		}
	}

	const onEsc = (e) => {
		if (e.key === "Escape") closeViewer()
	}
	document.addEventListener("keydown", onEsc)

	const closeBtn = contentEl.querySelector(".embed-close-btn")
	if (closeBtn) {
		closeBtn.addEventListener("click", closeViewer)
	}
}
