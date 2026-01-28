// Per-post behavior: render embedded markdown and add image/video interactions
;(function () {
	const mdScript = document.getElementById("post-md")
	const target = document.getElementById("post-article")

	// If we have embedded markdown, render it into the article target.
	if (mdScript && target) {
		const md = mdScript.textContent || ""
		function render(markdown) {
			if (typeof marked !== "undefined") return marked.parse(markdown)
			return (
				"<pre>" +
				markdown.replace(/&/g, "&amp;").replace(/</g, "&lt;") +
				"</pre>"
			)
		}
		target.innerHTML = render(md)

		// Replace YouTube links with embedded iframe when present
		const youtubeLinks = [
			"https://youtu.be/9vRtx8cICvs?si=XKQvOTK4d8Sxvvlq",
			"https://youtu.be/jOjz16oaphM?si=bx6lZuF3H-yYNweq",
		]
		youtubeLinks.forEach((url) => {
			const a = target.querySelector(`a[href="${url}"]`)
			if (a) {
				const iframe = document.createElement("iframe")
				iframe.src = url
					.replace("youtu.be/", "www.youtube.com/embed/")
					.split("?")[0]
				iframe.setAttribute("allowfullscreen", "")
				iframe.style.width = "100%"
				iframe.style.height = "480px"
				const wrap = document.createElement("div")
				wrap.className = "video-embed"
				wrap.appendChild(iframe)
				a.parentNode.replaceChild(wrap, a)
			}
		})
	}

	// Delegated event handling so behaviors work whether HTML was rendered
	// server-side (static canonical) or injected later by the loader.
	document.addEventListener("click", function (e) {
		// New toggle-btn placeholders
		const toggleBtn = e.target.closest(".toggle-btn")
		if (toggleBtn) {
			const wrapper =
				toggleBtn.closest(".toggle-image") ||
				toggleBtn.closest(".image-wrapper")
			if (!wrapper) return
			const src = wrapper.getAttribute("data-src")
			if (!src) return

			// If we've already created an obscured container, don't recreate.
			if (wrapper.querySelector(".obscured-container")) return

			const container = document.createElement("div")
			container.className = "obscured-container"
			container.style.position = "relative"
			container.style.display = "block"
			container.style.width = "100%"

			const img = document.createElement("img")
			img.src = src
			img.alt = ""
			img.loading = "lazy"
			img.className = "obscured-img"
			img.style.display = "block"
			img.style.width = "100%"
			img.style.height = "auto"

			const overlay = document.createElement("div")
			overlay.className = "obscured-overlay"
			overlay.textContent = "click"
			overlay.title = "Click to show image"
			overlay.setAttribute("role", "button")
			overlay.style.position = "absolute"
			overlay.style.top = "0"
			overlay.style.left = "0"
			overlay.style.right = "0"
			overlay.style.bottom = "0"
			overlay.style.background = "rgba(0,0,0,0.85)"
			overlay.style.color = "#fff"
			overlay.style.display = "flex"
			overlay.style.alignItems = "center"
			overlay.style.justifyContent = "center"
			overlay.style.cursor = "pointer"
			overlay.style.fontSize = "1rem"
			overlay.style.textTransform = "lowercase"

			// Clicking overlay reveals image (remove overlay)
			overlay.addEventListener("click", function () {
				overlay.style.display = "none"
				img.title = "Click to hide image"
			})

			// Clicking image hides it again by showing the overlay
			img.addEventListener("click", function () {
				overlay.style.display = "flex"
				overlay.title = "Click to show image"
			})

			container.appendChild(img)
			container.appendChild(overlay)
			wrapper.innerHTML = ""
			wrapper.appendChild(container)
			return
		}

		// Legacy show-image buttons (keep compatibility)
		const showBtn = e.target.closest(".show-image")
		if (showBtn) {
			const wrapper = showBtn.closest(".image-wrapper")
			if (!wrapper) return
			const src =
				showBtn.getAttribute("data-src") || wrapper.getAttribute("data-src")
			if (!src) return

			if (wrapper.querySelector(".obscured-container")) return

			const container = document.createElement("div")
			container.className = "obscured-container"
			container.style.position = "relative"
			container.style.display = "block"
			container.style.width = "100%"

			const img = document.createElement("img")
			img.src = src
			img.alt = ""
			img.className = "obscured-img"
			img.style.display = "block"
			img.style.width = "100%"
			img.style.height = "auto"

			const overlay = document.createElement("div")
			overlay.className = "obscured-overlay"
			overlay.textContent = "click"
			overlay.title = "Click to show image"
			overlay.setAttribute("role", "button")
			overlay.style.position = "absolute"
			overlay.style.top = "0"
			overlay.style.left = "0"
			overlay.style.right = "0"
			overlay.style.bottom = "0"
			overlay.style.background = "rgba(0,0,0,0.85)"
			overlay.style.color = "#fff"
			overlay.style.display = "flex"
			overlay.style.alignItems = "center"
			overlay.style.justifyContent = "center"
			overlay.style.cursor = "pointer"
			overlay.style.fontSize = "1rem"

			overlay.addEventListener("click", function () {
				overlay.style.display = "none"
				img.title = "Click to hide image"
			})

			img.addEventListener("click", function () {
				overlay.style.display = "flex"
				overlay.title = "Click to show image"
			})

			container.appendChild(img)
			container.appendChild(overlay)
			wrapper.innerHTML = ""
			wrapper.appendChild(container)
			return
			return
		}
	})
})()

// Per-post external-link enhancer: set target/_blank and append icon
document.addEventListener("DOMContentLoaded", function () {
	try {
		const post = document.querySelector("#post-article") || document.body
		const anchors = post.querySelectorAll("a")
		for (const a of anchors) {
			const href = a.getAttribute("href") || ""
			if (!href) continue
			if (href.startsWith("#")) continue
			if (
				/^https?:\/\//i.test(href) ||
				href.startsWith("mailto:") ||
				href.startsWith("data:")
			) {
				a.setAttribute("target", "_blank")
				a.setAttribute("rel", "noopener noreferrer")
				if (
					!a.querySelector(".external-link-icon") &&
					!a.dataset.externalIconAdded
				) {
					const span = document.createElement("span")
					span.className = "external-link-icon"
					span.setAttribute("aria-hidden", "true")
					span.innerHTML =
						'<svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"/></svg>'
					a.appendChild(span)
					a.dataset.externalIconAdded = "true"
				}
			}
		}
	} catch (e) {
		console.debug("post external link enhancer error", e)
	}
})
