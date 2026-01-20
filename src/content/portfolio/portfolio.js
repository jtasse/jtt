;(function () {
	const init = () => {
		// Prevent duplicate initialization
		if (window.portfolioViewerInitialized) return
		window.portfolioViewerInitialized = true

		// Create Viewer Overlay
		const overlay = document.createElement("div")
		overlay.className = "portfolio-viewer-overlay"
		overlay.innerHTML = `
        <button class="viewer-close-btn" title="Close">&times;</button>
        <a href="#" target="_blank" class="viewer-new-tab-btn" style="display:none;">Open in New Tab</a>
        <div id="viewer-container" class="viewer-content" style="width:100%; height:100%; display:flex; justify-content:center; align-items:center;"></div>
    `
		document.body.appendChild(overlay)

		const container = overlay.querySelector("#viewer-container")
		const closeBtn = overlay.querySelector(".viewer-close-btn")
		const newTabBtn = overlay.querySelector(".viewer-new-tab-btn")

		// Close Logic
		function closeViewer() {
			overlay.classList.remove("visible")
			container.innerHTML = "" // Clear content
			document.body.style.overflow = "" // Restore scrolling
		}

		closeBtn.addEventListener("click", closeViewer)
		overlay.addEventListener("click", (e) => {
			if (e.target === overlay) {
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
			const item = e.target.closest(".portfolio-item")
			const link = e.target.closest("a")

			// 1. Handle Links (Global) - Intercept PDFs, Drive, Docs, Resume
			if (link) {
				// Handle anchor links (Jump to...)
				const hrefAttr = link.getAttribute("href")
				if (hrefAttr && hrefAttr.startsWith("#")) {
					e.preventDefault()
					const targetId = hrefAttr.substring(1)
					const target = document.getElementById(targetId)
					if (target) {
						target.scrollIntoView({ behavior: "smooth", block: "start" })
					}
					return
				}

				const href = link.href
				let shouldIntercept = false

				// Check for Resume class
				if (link.classList.contains("resume-link")) {
					shouldIntercept = true
				}
				// Check for PDF extension (ignoring query params)
				else {
					try {
						const urlObj = new URL(href)
						if (urlObj.pathname.toLowerCase().endsWith(".pdf")) {
							shouldIntercept = true
						}
					} catch {
						// Fallback if URL parsing fails
						if (href.toLowerCase().split("?")[0].endsWith(".pdf")) {
							shouldIntercept = true
						}
					}
				}

				// Check for Google Drive/Docs
				if (!shouldIntercept) {
					if (
						href.includes("drive.google.com") &&
						(href.includes("/view") || href.includes("/preview"))
					) {
						shouldIntercept = true
					} else if (
						href.includes("docs.google.com") &&
						(href.includes("/edit") ||
							href.includes("/view") ||
							href.includes("/preview"))
					) {
						shouldIntercept = true
					}
				}

				if (shouldIntercept) {
					e.preventDefault()
					openViewer(href)
					return
				}
			}

			// 2. Handle Portfolio Item clicks
			if (item) {
				// Ignore clicks on links inside items (unless handled above)
				if (link) return

				// Ignore clicks on paragraph text
				if (e.target.closest("p")) return

				const url = item.dataset.link
				if (url) {
					e.preventDefault()
					openViewer(url)
				}
			}
		})

		function openViewer(url) {
			container.innerHTML = ""
			newTabBtn.href = url
			newTabBtn.style.display = "inline-block"
			document.body.style.overflow = "hidden" // Prevent background scrolling

			let displayUrl = url

			// Handle Google Drive Links: Convert /view to /preview
			if (url.includes("drive.google.com") && url.includes("/view")) {
				displayUrl = url.replace("/view", "/preview")
			}

			// Handle Google Docs Links: Convert /edit or /view to /preview
			if (url.includes("docs.google.com")) {
				if (url.includes("/edit")) displayUrl = url.replace("/edit", "/preview")
				else if (url.includes("/view"))
					displayUrl = url.replace("/view", "/preview")
			}

			// Handle YouTube Links: Convert watch?v= to embed/
			if (url.includes("youtube.com/watch")) {
				try {
					const urlObj = new URL(url)
					const v = urlObj.searchParams.get("v")
					if (v) {
						displayUrl = `https://www.youtube.com/embed/${v}`
					}
				} catch (e) {
					console.error("Invalid YouTube URL", e)
				}
			}

			const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)$/i)

			if (isImage) {
				const img = document.createElement("img")
				img.src = url
				img.style.maxWidth = "100%"
				img.style.maxHeight = "100%"
				img.style.objectFit = "contain"
				container.appendChild(img)
			} else {
				// Assume PDF or External Site -> Use Iframe
				const iframe = document.createElement("iframe")
				iframe.src = displayUrl
				iframe.style.width = "100%"
				iframe.style.height = "100%"
				iframe.style.border = "none"
				iframe.style.backgroundColor = "white"
				container.appendChild(iframe)
			}

			overlay.classList.add("visible")
		}
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init)
	} else {
		init()
	}
})()
