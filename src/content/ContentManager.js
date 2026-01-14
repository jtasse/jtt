import * as THREE from "three"
import { loadContentHTML, parseBlogPosts } from "../contentLoader.js"
import { router } from "../router.js"
import { scene, controls, camera } from "../core/SceneManager.js"
import { getPyramidAnimToken } from "../pyramid/state.js"
import { pyramidGroup } from "../pyramid/state.js"
import { ScrollManager } from "./ScrollManager.js"
import {
	createOrcShowcase,
	cleanupOrcShowcase,
} from "./orc-demo/OrcShowcase.js"

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

	// Hide ORC preview overlay
	hideOrcPreviewOverlay()

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

	loadContentHTML("portfolio").then((html) => {
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
			requestAnimationFrame(() => {
				createOrcShowcase(showcaseContainer)
			})
			showcaseContainer.addEventListener("click", () => {
				router.navigate("/portfolio/orc-demo")
			})
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
					return `<a href="${route}" class="blog-post-link">
						<div class="blog-post">
							<h2>${post.title}</h2>
							<div class="blog-meta">${post.date} | ${post.author}</div>
							${post.image ? `<img src="${post.image}" alt="${post.title}">` : ""}
							<p>${post.summary}</p>
						</div>
					</a>`
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

	const fetchUrl = `/src/content${route}.html`

	fetch(fetchUrl)
		.then((res) => {
			if (!res.ok) throw new Error("Failed to load post")
			return res.text()
		})
		.then((html) => {
			if (myToken !== getPyramidAnimToken()) return

			const parser = new DOMParser()
			const doc = parser.parseFromString(html, "text/html")
			const content = doc.querySelector("main")?.innerHTML || doc.body.innerHTML

			contentEl.innerHTML = `
				<div class="blog-content single-post">
					${content}
				</div>
			`
			contentEl.style.display = ""
			contentEl.classList.add("show")
			contentEl.style.pointerEvents = "auto"
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
	cleanupOrcShowcase()

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
}

function showEmbedViewer(contentEl, embedUrl, onCloseCallback) {
	contentEl.innerHTML = `
		<div class="embed-wrapper" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
			<div class="embed-inner-container" style="display: flex; flex-direction: column; width: 95vw; height: 98vh; background: rgba(10, 10, 26, 0.95); padding: 10px; border-radius: 8px; border: 1px solid #00ffff;">
				<div class="embed-controls" style="display: flex; justify-content: flex-end; gap: 10px; margin-bottom: 10px; flex-shrink: 0;">
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
				<div class="embed-content-container" style="flex: 1; min-height: 0; overflow: hidden;">
					<iframe
						src="${embedUrl}"
						width="100%"
						height="100%"
						style="border: none;"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen
					></iframe>
				</div>
			</div>
		</div>
	`
	const closeBtn = contentEl.querySelector(".embed-close-btn")
	if (closeBtn) {
		closeBtn.addEventListener("click", () =>
			showPortfolioPlane(onCloseCallback)
		)
	}
}

function showImageViewer(contentEl, imageUrl, onCloseCallback) {
	contentEl.innerHTML = `
		<div class="embed-wrapper" style="display: flex; align-items: center; justify-content: center;">
			<div class="embed-inner-container" style="display: flex; flex-direction: column; width: 90vw; height: 90vh; background: rgba(10, 10, 26, 0.95); padding: 10px; border-radius: 8px; border: 1px solid #00ffff;">
				<div class="embed-controls" style="display: flex; justify-content: flex-end; gap: 10px; margin-bottom: 10px; flex-shrink: 0;">
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
						style="max-width: 100%; max-height: 100%; object-fit: contain; border: 1px solid #335555; border-radius: 4px;"
					/>
				</div>
			</div>
		</div>
	`
	const closeBtn = contentEl.querySelector(".embed-close-btn")
	if (closeBtn) {
		closeBtn.addEventListener("click", () =>
			showPortfolioPlane(onCloseCallback)
		)
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

// === ORC Overlays ===

let orcPreviewOverlay = null

export function showOrcPreviewOverlay() {
	if (!orcPreviewOverlay) {
		orcPreviewOverlay = document.createElement("div")
		orcPreviewOverlay.id = "orc-preview-overlay"
		Object.assign(orcPreviewOverlay.style, {
			position: "fixed",
			top: "22%",
			left: "50%",
			transform: "translateX(-50%)",
			zIndex: "100",
			display: "flex",
			alignItems: "center",
			gap: "20px",
			background:
				"linear-gradient(135deg, rgba(0, 20, 40, 0.98), rgba(0, 40, 60, 0.95))",
			border: "2px solid #00aaff",
			borderRadius: "16px",
			padding: "16px 20px",
			cursor: "pointer",
			boxShadow: "0 0 30px rgba(0, 170, 255, 0.3)",
			maxWidth: "85%",
			height: "120px",
			boxSizing: "border-box",
		})

		const textContainer = document.createElement("div")
		textContainer.innerHTML = `
			<h2 style="color: #00ffff; margin: 0 0 8px 0; font-size: 1.3rem; text-shadow: 0 0 10px rgba(0,255,255,0.3);">
				Click here to view ORC demo with inline docs!
			</h2>
			<p style="color: #aaddff; margin: 0; font-size: 0.95rem; line-height: 1.4;">
				Orbital Refuse Collector - Interactive API documentation demo featuring satellite orbit visualization.
			</p>
		`
		textContainer.style.pointerEvents = "none"
		orcPreviewOverlay.appendChild(textContainer)

		orcPreviewOverlay.addEventListener("mouseenter", () => {
			orcPreviewOverlay.style.borderColor = "#00ffff"
			orcPreviewOverlay.style.boxShadow = "0 0 40px rgba(0, 255, 255, 0.4)"
			orcPreviewOverlay.style.transform = "translateX(-50%) scale(1.02)"
		})
		orcPreviewOverlay.addEventListener("mouseleave", () => {
			orcPreviewOverlay.style.borderColor = "#00aaff"
			orcPreviewOverlay.style.boxShadow = "0 0 30px rgba(0, 170, 255, 0.3)"
			orcPreviewOverlay.style.transform = "translateX(-50%) scale(1)"
		})

		orcPreviewOverlay.addEventListener("click", (e) => {
			e.stopPropagation()
			if (window.routerNavigate) window.routerNavigate("/portfolio/orc-demo")
		})

		document.body.appendChild(orcPreviewOverlay)
	}
	orcPreviewOverlay.style.display = "flex"
}

export function hideOrcPreviewOverlay() {
	if (orcPreviewOverlay) {
		orcPreviewOverlay.style.display = "none"
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

function showFullScreenEmbed(contentEl, url, type) {
	if (!contentEl) return

	// Reset styles for full screen
	contentEl.innerHTML = ""
	contentEl.className = "fullscreen-embed"
	contentEl.style.display = "block"
	contentEl.style.pointerEvents = "auto"

	contentEl.innerHTML = `
		<div class="embed-wrapper" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
			<div class="embed-inner-container" style="display: flex; flex-direction: column; width: 95vw; height: 98vh; background: rgba(10, 10, 26, 0.95); padding: 10px; border-radius: 8px; border: 1px solid #00ffff;">
				<div class="embed-controls" style="display: flex; justify-content: flex-end; gap: 10px; margin-bottom: 10px; flex-shrink: 0;">
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
				<div class="embed-content-container" style="flex: 1; min-height: 0; overflow: hidden;">
					<iframe
						src="${url}"
						width="100%"
						height="100%"
						style="border: none;"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen
					></iframe>
				</div>
			</div>
		</div>
	`

	const closeBtn = contentEl.querySelector(".embed-close-btn")
	if (closeBtn) {
		closeBtn.addEventListener("click", () => {
			contentEl.innerHTML = ""
			contentEl.style.display = "none"
			contentEl.className = ""
			// Restore portfolio state
			if (pyramidGroup) {
				pyramidGroup.visible = true
				// We assume we came from portfolio if clicking links
				showPortfolioPlane()
			}
		})
	}
}

function showFullScreenImage(contentEl, url) {
	if (!contentEl) return

	contentEl.innerHTML = ""
	contentEl.className = "fullscreen-embed"
	contentEl.style.display = "block"
	contentEl.style.pointerEvents = "auto"

	const closeBtn = createCloseButton(() => {
		contentEl.innerHTML = ""
		contentEl.style.display = "none"
		contentEl.className = ""
		if (pyramidGroup) {
			pyramidGroup.visible = true
			showPortfolioPlane()
		}
	})

	const img = document.createElement("img")
	img.src = url
	img.className = "fullscreen-image"

	contentEl.appendChild(img)
	contentEl.appendChild(closeBtn)
}

function createCloseButton(onClick) {
	const btn = document.createElement("button")
	btn.innerHTML = "&times;"
	btn.className = "fullscreen-close-btn"
	btn.onclick = (e) => {
		e.preventDefault()
		e.stopPropagation()
		onClick()
	}
	return btn
}
