import * as THREE from "three"
import { loadContentHTML, parseBlogPosts } from "../contentLoader.js"
import { createOrcPreview } from "./orc-demo/orc-demo.js"
import { scene, controls } from "../core/SceneManager.js"
import { getPyramidAnimToken } from "../pyramid/state.js"
import { pyramidGroup } from "../pyramid/state.js"
import { ScrollManager } from "./ScrollManager.js"

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
				.map(
					(post) => `
				<div class="blog-post">
					<h2>${post.title}</h2>
					<div class="blog-meta">${post.date} | ${post.author}</div>
					${post.image ? `<img src="${post.image}" alt="${post.title}">` : ""}
					<p>${post.summary}</p>
				</div>
			`
				)
				.join("")
		} else {
			contentHtml = html
		}
		contentEl.innerHTML = `<div class="blog-content">${contentHtml}</div>`
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
}

function showEmbedViewer(contentEl, embedUrl, onCloseCallback) {
	contentEl.innerHTML = `
		<div class="embed-wrapper">
			<button class="embed-back-btn">← Back to Portfolio</button>
			<iframe
				src="${embedUrl}"
				width="100%"
				height="600"
				style="border: 1px solid #00ffff; border-radius: 8px;"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowfullscreen
			></iframe>
		</div>
	`
	const backBtn = contentEl.querySelector(".embed-back-btn")
	if (backBtn) {
		backBtn.addEventListener("click", () => showPortfolioPlane(onCloseCallback))
	}
}

function showImageViewer(contentEl, imageUrl, onCloseCallback) {
	contentEl.innerHTML = `
		<div class="embed-wrapper image-viewer">
			<button class="embed-back-btn">← Back to Portfolio</button>
			<img
				src="${imageUrl}"
				alt="Portfolio image"
				style="max-width: 100%; max-height: 80vh; border: 1px solid #00ffff; border-radius: 8px; display: block; margin: 0 auto;"
			/>
		</div>
	`
	const backBtn = contentEl.querySelector(".embed-back-btn")
	if (backBtn) {
		backBtn.addEventListener("click", () => showPortfolioPlane(onCloseCallback))
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
		const u = new URL(url)
		const path = u.pathname.toLowerCase()
		return /\.(png|jpg|jpeg|gif|webp|svg)$/.test(path)
	} catch {
		return false
	}
}

// === ORC Overlays ===

let orcPreviewOverlay = null
let orcPreviewElement = null

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

		orcPreviewElement = createOrcPreview(140, 90)
		orcPreviewElement.style.borderRadius = "8px"
		orcPreviewElement.style.pointerEvents = "none"
		orcPreviewOverlay.appendChild(orcPreviewElement)

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

	const closeBtn = createCloseButton(() => {
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

	const iframe = document.createElement("iframe")
	iframe.src = url
	iframe.className = "fullscreen-iframe"
	iframe.allow =
		"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
	iframe.allowFullscreen = true

	contentEl.appendChild(iframe)
	contentEl.appendChild(closeBtn)
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
