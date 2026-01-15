document.addEventListener("DOMContentLoaded", () => {
	// Create Viewer Overlay
	const overlay = document.createElement("div")
	overlay.className = "portfolio-viewer-overlay"
	overlay.innerHTML = `
        <button class="viewer-close-btn">&times;</button>
        <div class="viewer-content-wrapper" style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%;">
            <div id="viewer-container" class="viewer-content" style="width:100%; height:100%; display:flex; justify-content:center; align-items:center;"></div>
            <a href="#" target="_blank" class="viewer-new-tab-btn" style="display:none;">Open in New Tab</a>
        </div>
    `
	document.body.appendChild(overlay)

	const container = overlay.querySelector("#viewer-container")
	const closeBtn = overlay.querySelector(".viewer-close-btn")
	const newTabBtn = overlay.querySelector(".viewer-new-tab-btn")

	let savedScrollPosition = 0

	// Close Logic
	function closeViewer() {
		overlay.classList.remove("visible")
		container.innerHTML = "" // Clear content (stops video/iframe)

		// Restore scroll position
		document.body.style.overflow = ""
		document.documentElement.style.overflow = ""
		window.scrollTo(0, savedScrollPosition)
	}

	closeBtn.addEventListener("click", closeViewer)
	overlay.addEventListener("click", (e) => {
		if (
			e.target === overlay ||
			e.target.classList.contains("viewer-content-wrapper")
		) {
			closeViewer()
		}
	})
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && overlay.classList.contains("visible")) {
			closeViewer()
		}
	})

	// Global Click Handler
	document.addEventListener("click", (e) => {
		const link = e.target.closest("a")
		const portfolioItem = e.target.closest(".portfolio-item")

		// 1. Handle Quick Links (Table of Contents) - Smooth Scroll
		if (link && link.closest(".quick-links")) {
			const href = link.getAttribute("href")
			// Only intercept hash links (internal anchors)
			if (href && href.startsWith("#")) {
				e.preventDefault()
				const target = document.querySelector(href)
				if (target) {
					target.scrollIntoView({ behavior: "smooth" })
					history.pushState(null, null, href)
				}
				return
			}
		}

		// 2. Handle Resume or PDF links (in text or elsewhere)
		if (
			link &&
			(link.classList.contains("resume-link") || link.href.endsWith(".pdf"))
		) {
			e.preventDefault()
			openViewer(link.href)
			return
		}

		// 3. Handle Portfolio Item Clicks
		if (portfolioItem) {
			// If clicking a link inside the item (that wasn't handled above), let it be normal
			if (link) return

			// If clicking paragraph text, ignore
			if (e.target.closest("p")) return

			// Otherwise (Header, Image, Card), open viewer
			const itemLink = portfolioItem.dataset.link
			if (itemLink) {
				e.preventDefault()
				openViewer(itemLink)
			}
		}
	})

	function openViewer(url) {
		// Save current scroll position
		savedScrollPosition = window.scrollY

		container.innerHTML = ""
		newTabBtn.href = url
		newTabBtn.style.display = "inline-block"

		// Lock scrolling
		document.body.style.overflow = "hidden"
		document.documentElement.style.overflow = "hidden"

		// Determine Content Type
		const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)$/i)

		// Handle Google Drive Links: Convert /view to /preview for iframe embedding
		let displayUrl = url
		if (url.includes("drive.google.com") && url.includes("/view")) {
			displayUrl = url.replace("/view", "/preview")
		}
		// Handle Google Docs Edit Links: Convert /edit to /preview
		if (url.includes("docs.google.com") && url.includes("/edit")) {
			displayUrl = url.replace(/\/edit.*$/, "/preview")
		}
		// Handle YouTube Links: Convert /watch?v= to /embed/
		if (url.includes("youtube.com/watch")) {
			displayUrl = url.replace("watch?v=", "embed/")
		}

		if (isImage) {
			const img = document.createElement("img")
			img.src = url
			img.style.maxWidth = "100%"
			img.style.maxHeight = "100%"
			img.style.objectFit = "contain"
			container.appendChild(img)
			// Optional: hide new tab button for images if desired, but keeping it is safe
		} else {
			// Assume PDF, Video, or External Site -> Use Iframe
			const iframe = document.createElement("iframe")
			iframe.src = displayUrl
			iframe.style.width = "85%"
			iframe.style.height = "85%"
			iframe.style.border = "none"
			iframe.style.backgroundColor = "white"
			iframe.style.borderRadius = "4px"

			// Allow fullscreen for videos
			iframe.allow =
				"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			iframe.allowFullscreen = true

			// Handle load errors or X-Frame-Options issues gracefully-ish
			iframe.onerror = () => {
				container.innerHTML = `<div style="color:white; text-align:center;">
                    <p>Unable to display content directly.</p>
                    <p>Please use the "Open in New Tab" button below.</p>
                </div>`
			}

			container.appendChild(iframe)
		}

		overlay.classList.add("visible")
	}
})
