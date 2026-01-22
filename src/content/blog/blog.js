const READING_CONFIG = {
	minExpectedWPM: 150,
	maxExpectedWPM: 260,
}

function calculateReadingTimeRange(text) {
	const words = text.trim().split(/\s+/).length
	// Faster reading speed (maxWPM) results in lower time
	const minTime = Math.max(1, Math.round(words / READING_CONFIG.maxExpectedWPM))
	// Slower reading speed (minWPM) results in higher time
	const maxTime = Math.max(1, Math.round(words / READING_CONFIG.minExpectedWPM))

	if (minTime === maxTime) {
		return `${minTime} min`
	}
	return `${minTime}-${maxTime} min`
}

function updatePostMeta(metaElement, timeRange) {
	if (!metaElement) return

	// Use innerHTML to preserve the <time> tag
	const html = metaElement.innerHTML
	const parts = html.split("|")

	// If we have 3 or more parts, assume the last one is the old reading time and replace it
	// If not, append the new time
	if (parts.length >= 3) {
		parts[parts.length - 1] = ` ${timeRange} read`
	} else {
		parts.push(` ${timeRange} read`)
	}

	metaElement.innerHTML = parts.join("|")
}

function hideReadingTime(metaElement) {
	if (!metaElement) return
	const parts = metaElement.innerHTML.split("|")
	if (parts.length >= 3) {
		parts.pop()
		metaElement.innerHTML = parts.join("|")
	}
}

async function initReadingTime() {
	try {
		const singlePostArticle = document.querySelector(".single-post article")

		if (singlePostArticle) {
			// Check if already processed
			if (singlePostArticle.dataset.readingTimeProcessed) return
			singlePostArticle.dataset.readingTimeProcessed = "true"

			// Single Post View
			const text = singlePostArticle.textContent
			const range = calculateReadingTimeRange(text)
			const meta = singlePostArticle.querySelector(".post-meta")
			updatePostMeta(meta, range)
		} else {
			// Blog List View
			const articles = document.querySelectorAll(
				".blog-content article, .blog-content .blog-post-item",
			)

			for (const article of articles) {
				// Check if already processed
				if (article.dataset.readingTimeProcessed) continue
				article.dataset.readingTimeProcessed = "true"

				const link = article.querySelector("a")
				const meta = article.querySelector(".post-meta")

				if (link && meta) {
					try {
						const response = await fetch(link.href)
						if (!response.ok) throw new Error("Fetch failed")
						const html = await response.text()
						const parser = new DOMParser()
						const doc = parser.parseFromString(html, "text/html")
						const postContent = doc.querySelector(".single-post article")

						if (postContent) {
							const text = postContent.textContent
							const range = calculateReadingTimeRange(text)
							updatePostMeta(meta, range)
						}
					} catch (err) {
						console.warn(`Error calculating time for ${link.href}`, err)
						hideReadingTime(meta)
					}
				}
			}
		}
	} catch (e) {
		console.warn("Global error in reading time script", e)
	}
}

function filterPostsByTag() {
	const params = new URLSearchParams(window.location.search)
	const tag = params.get("tag")
	if (!tag) return

	const articles = document.querySelectorAll(
		".blog-content article, .blog-content .blog-post-item",
	)
	articles.forEach((article) => {
		const tags = article.dataset.tags ? article.dataset.tags.split(",") : []
		if (tags.includes(tag)) {
			article.style.display = ""
		} else {
			article.style.display = "none"
		}
	})

	// Update heading to show filtered state
	const heading = document.getElementById("posts-heading")
	if (heading) {
		// Avoid duplicate tags
		const existingSpan = heading.querySelector("span")
		if (!existingSpan) {
			heading.innerHTML += ` <span style="font-size: 0.5em; vertical-align: middle; opacity: 0.7;">#${tag}</span>`
		}
	}
}

function init() {
	initReadingTime()
	filterPostsByTag()
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", init)
} else {
	init()
}

// Watch for dynamic content injection (SPA navigation)
let initTimeout
const observer = new MutationObserver((mutations) => {
	for (const mutation of mutations) {
		if (mutation.addedNodes.length) {
			// If blog content is added, re-initialize
			if (document.querySelector(".blog-content")) {
				if (initTimeout) clearTimeout(initTimeout)
				initTimeout = setTimeout(() => {
					init()
				}, 50)
				return
			}
		}
	}
})

observer.observe(document.body, { childList: true, subtree: true })
