;(function () {
	// MutationObserver safety patch (keeps original behavior otherwise)
	try {
		const orig = MutationObserver.prototype.observe
		MutationObserver.prototype.observe = function (target, options) {
			try {
				if (!(target && target.nodeType === 1)) {
					console.warn(
						"Ignored MutationObserver.observe with non-Node target",
						target,
					)
					return
				}
			} catch (e) {
				return
			}
			return orig.call(this, target, options)
		}
	} catch (e) {
		// environment doesn't expose MutationObserver or it's already broken
	}

	function makeLoader(canonicalFilename) {
		return async function load() {
			const statusEl = document.getElementById("post-status")
			const container = document.getElementById("post-container")
			if (!container) return

			const candidates = []
			try {
				const slug = canonicalFilename.replace(/\.html$/, "")
				candidates.push(
					location.origin +
						"/src/content/blog/posts/" +
						slug +
						"/" +
						canonicalFilename,
				)
			} catch (e) {
				// ignore
			}
			candidates.push("./" + canonicalFilename)
			candidates.push(canonicalFilename)
			candidates.push(
				location.pathname.replace(/\/?$/, "/") + canonicalFilename,
			)
			candidates.push(location.pathname.replace(/\/$/, "") + ".html")
			candidates.push(
				location.origin + location.pathname.replace(/\/$/, "") + ".html",
			)
			candidates.push(
				location.origin +
					location.pathname.replace(/\/?$/, "/") +
					canonicalFilename,
			)

			for (const url of candidates) {
				try {
					if (statusEl) statusEl.textContent = "Trying " + url
					const r = await fetch(url, { cache: "no-store" })
					if (!r.ok) continue
					const txt = await r.text()
					try {
						const doc = new DOMParser().parseFromString(txt, "text/html")
						const main =
							doc.querySelector("main.blog-content") ||
							doc.querySelector("#content") ||
							doc.querySelector("article")
						if (main) {
							container.innerHTML = main.innerHTML
							// Ensure toggle/show image handlers work even when HTML is injected
							try {
								container.addEventListener("click", function (ev) {
									const tbtn =
										ev.target.closest && ev.target.closest(".toggle-btn")
									if (tbtn) {
										const wrapper =
											tbtn.closest(".toggle-image") ||
											tbtn.closest(".image-wrapper")
										if (!wrapper) return
										const src = wrapper.getAttribute("data-src")
										if (!src) return
										if (wrapper.querySelector(".obscured-container")) return

										const containerEl = document.createElement("div")
										containerEl.className = "obscured-container"
										containerEl.style.position = "relative"
										containerEl.style.display = "block"
										containerEl.style.width = "100%"

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

										overlay.addEventListener("click", function () {
											overlay.style.display = "none"
											img.title = "Click to hide image"
										})

										img.addEventListener("click", function () {
											overlay.style.display = "flex"
											overlay.title = "Click to show image"
										})

										containerEl.appendChild(img)
										containerEl.appendChild(overlay)
										wrapper.innerHTML = ""
										wrapper.appendChild(containerEl)
										return
									}

									// Legacy .show-image handler
									const sbtn =
										ev.target.closest && ev.target.closest(".show-image")
									if (sbtn) {
										const wrapper = sbtn.closest(".image-wrapper")
										if (!wrapper) return
										const src =
											sbtn.getAttribute("data-src") ||
											wrapper.getAttribute("data-src")
										if (!src) return
										if (wrapper.querySelector(".obscured-container")) return

										const containerEl = document.createElement("div")
										containerEl.className = "obscured-container"
										containerEl.style.position = "relative"
										containerEl.style.display = "block"
										containerEl.style.width = "100%"

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

										containerEl.appendChild(img)
										containerEl.appendChild(overlay)
										wrapper.innerHTML = ""
										wrapper.appendChild(containerEl)
									}
								})
							} catch (e) {
								// ignore handler attach failures
							}
						} else {
							container.innerHTML = txt
						}
						if (statusEl) statusEl.textContent = ""
						Array.from(container.querySelectorAll("script")).forEach((s) => {
							const ns = document.createElement("script")
							if (s.src) {
								ns.src = s.src
								ns.async = false
							} else {
								ns.textContent = s.textContent
							}
							document.body.appendChild(ns)
						})
						return
					} catch (parseErr) {
						container.innerHTML = txt
						if (statusEl) statusEl.textContent = ""
						return
					}
				} catch (err) {
					continue
				}
			}
			container.innerHTML = "<p>Post not found.</p>"
			if (statusEl) statusEl.textContent = "Post not found."
		}
	}

	try {
		const canonicalFilename =
			"abstraction-part-ii-gen-ai-and-the-wysiwyg-revolution.html"
		if (document.getElementById && document.getElementById("post-container")) {
			document.addEventListener(
				"DOMContentLoaded",
				makeLoader(canonicalFilename),
			)
		}
	} catch (e) {
		// ignore
	}
})()
