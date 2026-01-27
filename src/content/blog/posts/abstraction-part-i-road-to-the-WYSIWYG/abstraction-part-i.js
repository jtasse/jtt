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

	// Post loader: runs on index.html to fetch and inject the canonical post HTML
	function makeLoader(canonicalFilename) {
		return async function load() {
			const statusEl = document.getElementById("post-status")
			const container = document.getElementById("post-container")
			if (!container) return

			const candidates = []
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
					console.log("Attempting fetch:", url)
					if (statusEl) statusEl.textContent = "Trying " + url
					const r = await fetch(url, { cache: "no-store" })
					console.log("Fetch", url, "->", r.status)
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
						} else {
							container.innerHTML = txt
						}
						if (statusEl) statusEl.textContent = ""
						// re-run any scripts inside the injected content
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
						console.log("Parse failed for", url, parseErr)
						container.innerHTML = txt
						if (statusEl) statusEl.textContent = ""
						return
					}
				} catch (err) {
					console.log("Fetch error for", url, err)
					continue
				}
			}
			container.innerHTML = "<p>Post not found.</p>"
			if (statusEl) statusEl.textContent = "Post not found."
		}
	}

	// Wire up loader only when this script runs in the index shell (post-container present)
	try {
		const canonicalFilename = "abstraction-part-i-road-to-the-WYSIWYG.html"
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
