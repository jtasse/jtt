;(function () {
	// MutationObserver safety patch (keeps original behavior otherwise)
	try {
		const orig = MutationObserver.prototype.observe
		MutationObserver.prototype.observe = function (target, options) {
			try {
				if (target && typeof target === "object") {
					if ("nodeType" in target && target.nodeType === 1) {
						return orig.call(this, target, options)
					}
					try {
						if (target.document && target.document.documentElement) {
							return orig.call(this, target.document.documentElement, options)
						}
					} catch (inner) {}
				}
				console.warn(
					"Skipping MutationObserver.observe for non-Node target",
					target,
				)
				return
			} catch (e) {
				try {
					return orig.call(this, target, options)
				} catch (_) {
					return
				}
			}
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
							// Render fetched post inside a same-origin iframe to isolate scripts
							try {
								const iframe = document.createElement("iframe")
								iframe.setAttribute("title", "Post content")
								iframe.style.width = "100%"
								iframe.style.border = "0"
								iframe.style.display = "block"

								// Collect stylesheet links from fetched document head and resolve them
								const links = Array.from(
									doc.querySelectorAll('link[rel="stylesheet"]'),
								)
									.map((l) => {
										try {
											const href = l.getAttribute("href") || l.href
											return `<link rel="stylesheet" href="${new URL(href, url).href}">`
										} catch (e) {
											return ""
										}
									})
									.join("\n")

								const srcdoc =
									`<!doctype html><html><head><meta charset="utf-8"><base href="${url}">` +
									links +
									`</head><body>` +
									main.outerHTML +
									`</body></html>`

								container.innerHTML = ""
								container.appendChild(iframe)
								iframe.srcdoc = srcdoc

								// Resize iframe to content height for a short period after load
								iframe.addEventListener("load", function () {
									try {
										const docEl = iframe.contentDocument.documentElement
										iframe.style.height = docEl.scrollHeight + "px"
										let ticks = 0
										const iv = setInterval(() => {
											try {
												iframe.style.height =
													iframe.contentDocument.documentElement.scrollHeight +
													"px"
											} catch (e) {}
											ticks += 1
											if (ticks > 20) clearInterval(iv)
										}, 250)
									} catch (e) {}
								})
							} catch (e) {
								// Fallback to direct injection on error
								container.innerHTML = main.innerHTML
							}
						} else {
							container.innerHTML = txt
						}
						if (statusEl) statusEl.textContent = ""
						return
					} catch (e) {
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
