;(function () {
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
	} catch (e) {}

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
						if (main) container.innerHTML = main.innerHTML
						else container.innerHTML = txt
						if (statusEl) statusEl.textContent = ""
						Array.from(container.querySelectorAll("script")).forEach((s) => {
							const ns = document.createElement("script")
							if (s.src) {
								ns.src = s.src
								ns.async = false
							} else ns.textContent = s.textContent
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
		const canonicalFilename = "git-and-backups.html"
		if (document.getElementById && document.getElementById("post-container")) {
			document.addEventListener(
				"DOMContentLoaded",
				makeLoader(canonicalFilename),
			)
		}
	} catch (e) {}
})()
