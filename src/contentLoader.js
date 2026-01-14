// Load HTML content from separate files
export async function loadContentHTML(page) {
	try {
		const response = await fetch(`/src/content/${page}/${page}.html`)
		if (!response.ok) {
			throw new Error(`Failed to load ${page}.html`)
		}
		return await response.text()
	} catch (error) {
		console.error(`Error loading content for ${page}:`, error)
		return `<div class="error">Content for ${page} could not be loaded</div>`
	}
}

// Parse blog posts from HTML that contains JSON
export function parseBlogPosts(htmlContent) {
	try {
		const parser = new DOMParser()
		const doc = parser.parseFromString(htmlContent, "text/html")
		const scriptTag = doc.getElementById("blogPosts")
		if (scriptTag) {
			return JSON.parse(scriptTag.textContent)
		}
		return []
	} catch (error) {
		console.error("Error parsing blog posts:", error)
		return []
	}
}
