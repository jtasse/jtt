import * as THREE from "three"
import "./content/overlay.css"
import "./contact/contact-pane.css"
import { initContactPane } from "./contact/ContactPane.js"
import {
	animatePyramid,
	showAboutPlane,
	showPortfolioPlane,
	hideAllPlanes,
	showBlogPlane,
	showBlogPost,
	animate,
	renderer,
	camera,
	scene,
	resetPyramidToHome,
	morphToOrcScene,
	morphFromOrcScene,
	isOrcSceneActive,
	spinPyramidToSection,
	controls,
	startLoading,
	stopLoading,
	// Roaming hand functions
	setLabelManager,
	pyramidGroup,
	layoutManager,
	initialPyramidState,
} from "./pyramid/pyramid.js"
import { handleContentLink } from "./content/ContentManager.js"
import { LabelManager } from "./navigation/LabelManager.js"
import { InputManager } from "./core/InputManager.js"
import {
	initRoamingHand,
	scheduleHandEntry,
	cancelHandEntry,
	triggerHandPageTransition,
	getCurrentHandPage,
} from "./hand/HandManager.js"
import { router } from "./router.js"

// Update Open Graph meta tags based on route
function updateMetaTags(route) {
	const metaConfig = {
		"/portfolio": {
			title: "Portfolio - James Tasse",
			description:
				"My portfolio of technical writing and software projects, including interactive 3D demos.",
			image: "https://jamestasse.tech/orc_page_thumbnail.png",
		},
		"/portfolio/orc-demo": {
			title: "ORC Demo - Interactive 3D Visualization",
			description:
				"Experience an interactive 3D demonstration of the ORC system with hand gesture controls.",
			image: "https://jamestasse.tech/orc_page_thumbnail.png",
		},
		"/portfolio/docs": {
			title: "Technical Documentation - James Tasse",
			description: "Comprehensive technical documentation and guides.",
			image: "https://jamestasse.tech/orc_page_thumbnail.png",
		},
	}

	// Provide a safe default so callers don't crash when route isn't mapped
	const defaultConfig = {
		title: document.title || "jamestasse.tech",
		description: "",
		image: "https://jamestasse.tech/orc_page_thumbnail.png",
		url: window.location.href,
	}

	const config = metaConfig[route] || defaultConfig

	// Helper: update or create meta tag
	function ensureMeta(propOrName, key, value) {
		let selector
		let el
		if (propOrName === "property") {
			selector = `meta[property="${key}"]`
			el = document.querySelector(selector)
			if (!el) {
				el = document.createElement("meta")
				el.setAttribute("property", key)
				document.head.appendChild(el)
			}
			el.setAttribute("content", value)
		} else {
			selector = `meta[name="${key}"]`
			el = document.querySelector(selector)
			if (!el) {
				el = document.createElement("meta")
				el.setAttribute("name", key)
				document.head.appendChild(el)
			}
			el.setAttribute("content", value)
		}
	}

	ensureMeta("property", "og:title", config.title || defaultConfig.title)
	ensureMeta(
		"property",
		"og:description",
		config.description || defaultConfig.description,
	)
	ensureMeta("property", "og:image", config.image || defaultConfig.image)
	ensureMeta("property", "og:url", config.url || defaultConfig.url)
	ensureMeta("property", "og:type", "website")
	ensureMeta("name", "twitter:card", "summary_large_image")
	ensureMeta("name", "twitter:title", config.title || defaultConfig.title)
	ensureMeta(
		"name",
		"twitter:description",
		config.description || defaultConfig.description,
	)
	ensureMeta("name", "twitter:image", config.image || defaultConfig.image)

	// Update page title
	document.title = config.title || defaultConfig.title
}

/*
 * Enhance links that open in a new tab:
 * - Ensure links inside `#post-article` (the canonical post) open in a new tab
 *   except for table-of-contents anchors (href starting with '#').
 * - Append a small external-link SVG icon to links with target="_blank".
 * - Observe DOM changes so dynamically injected content (SPA) is handled.
 */
function decorateNewTabLinks(root = document) {
	try {
		const anchors = (root || document).querySelectorAll("a")
		for (const a of anchors) {
			// Skip if inside the post TOC
			if (a.closest && a.closest(".post-toc")) continue

			const href = a.getAttribute("href") || ""
			// Keep internal fragment links as-is (TOC/internal anchors)
			if (href.startsWith("#")) continue

			// If this link is inside the abstraction post article, force new tab
			const postArticle = document.querySelector("#post-article")
			if (postArticle && postArticle.contains(a)) {
				a.setAttribute("target", "_blank")
				// Use noopener/noreferrer for security
				a.setAttribute("rel", "noopener noreferrer")
			}

			// Add icon for any link that opens in a new tab (only once)
			if (a.target === "_blank") {
				// If an existing icon (static SVG) already exists, don't add another
				if (a.querySelector && a.querySelector(".external-link-icon")) continue
				if (a.dataset.externalIconAdded) continue
				const span = document.createElement("span")
				span.className = "external-link-icon"
				span.setAttribute("aria-hidden", "true")
				span.innerHTML = `
					<svg xmlns="http://www.w3.org/2000/svg" class="external-link-icon" height="14px" viewBox="0 -960 960 960" width="14px" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"/></svg>
				`
				a.appendChild(span)
				a.dataset.externalIconAdded = "true"
			}
		}
	} catch (e) {
		// Silently ignore errors in decoration to avoid affecting UX
		console.debug("decorateNewTabLinks error", e)
	}
}

// Initial run and mutation observer for SPA content
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", () =>
		decorateNewTabLinks(document),
	)
} else {
	decorateNewTabLinks(document)
}

try {
	const observer = new MutationObserver((mutations) => {
		for (const m of mutations) {
			if (m.addedNodes && m.addedNodes.length) {
				// Run decorator against added nodes to catch injected posts
				for (const n of m.addedNodes) {
					if (n.nodeType === 1) decorateNewTabLinks(n)
				}
			}
		}
	})
	observer.observe(document.body, { childList: true, subtree: true })
} catch (e) {
	console.debug("New-tab link observer init failed", e)
}

// Hide debug logs in production
if (import.meta.env.PROD) {
	console.debug = () => {}
}

// Set copyright year
const yearSpan = document.getElementById("copyright-year")
if (yearSpan) {
	yearSpan.textContent = new Date().getFullYear()
}

// Footer visibility logic
const contentEl = document.getElementById("content")
const footerEl = document.getElementById("site-footer")

if (contentEl && footerEl) {
	const checkFooter = () => {
		// If content is not showing, always show footer (Home, ORC Demo)
		if (!contentEl.classList.contains("show")) {
			footerEl.style.opacity = "1"
			return
		}

		// If content is showing, check if it's scrollable
		const isScrollable = contentEl.scrollHeight > contentEl.clientHeight + 1

		if (!isScrollable) {
			footerEl.style.opacity = "1"
			return
		}

		// It is scrollable, check if at bottom
		const isAtBottom =
			contentEl.scrollTop + contentEl.clientHeight >=
			contentEl.scrollHeight - 20
		footerEl.style.opacity = isAtBottom ? "1" : "0"
	}

	contentEl.addEventListener("scroll", checkFooter)
	// Check when content changes (navigation) or window resizes
	const observer = new MutationObserver(checkFooter)
	observer.observe(contentEl, {
		attributes: true,
		childList: true,
		subtree: true,
		attributeFilter: ["class"],
	})
	window.addEventListener("resize", checkFooter)
}

// === Managers ===
// Force initial layout calculation BEFORE creating labels to ensure they are positioned correctly
layoutManager.onResize()

const labelManager = new LabelManager(scene, layoutManager, pyramidGroup)
labelManager.createLabels()
setLabelManager(labelManager)

// Ensure all labels have originalScale set (specifically Home label might be missing it)
const allLabels = labelManager.getLabels()
Object.values(allLabels).forEach((label) => {
	if (!label.userData.originalScale) {
		label.userData.originalScale = label.scale.clone()
	}
})

// === Input Manager ===
const inputManager = new InputManager(renderer, camera)

// Initialize roaming hand
initRoamingHand()

let hoveredLabel = null

// Animation loop for smooth label scaling
function animateLabels() {
	requestAnimationFrame(animateLabels)

	const labels = labelManager.getLabels()
	const navScale = labelManager.getNavLabelScale()
	const isMobile = window.innerWidth <= 768

	Object.values(labels).forEach((label) => {
		if (!label.visible) return
		if (label.userData.isAnimating) return
		if (!label.userData.originalScale) return

		const isHovered = hoveredLabel === label
		const targetScaleScalar = isHovered ? 1.12 : 1.0

		let target
		if (label.userData.fixedNav) {
			const scale = isMobile ? 0.45 : navScale
			target = new THREE.Vector3(scale, scale, 1).multiplyScalar(
				targetScaleScalar,
			)
		} else {
			target = label.userData.originalScale
				.clone()
				.multiplyScalar(targetScaleScalar)
		}

		// Adjust 0.1 to change the speed of the smoothing (lower = slower/smoother)
		label.scale.lerp(target, 0.1)
	})
}
animateLabels()

// Start animation loop
animate()
window.dispatchEvent(new Event("resize"))

// Initialize DOM-based contact pane (bottom-right corner)
initContactPane()

// Hover detection
inputManager.addHoverHandler((raycaster) => {
	if (document.body.classList.contains("orc-doc-active")) {
		inputManager.setCursor("default")
		return
	}

	// Check for portfolio item clickables FIRST (highest priority)
	const portfolioPlane = scene.getObjectByName("portfolioPlane")
	if (portfolioPlane) {
		const portfolioClickables = portfolioPlane.children.filter(
			(c) => c && c.userData && c.userData.link,
		)
		if (portfolioClickables.length > 0) {
			const portfolioHits = raycaster.intersectObjects(
				portfolioClickables,
				false,
			)
			if (portfolioHits.length > 0) {
				inputManager.setCursor("pointer")
				return
			}
		}
	}

	// Check hover targets for pyramid labels (use hoverTargets for larger hit areas)
	const labels = labelManager.getLabels()
	const hoverTargets = labelManager.getHoverTargets()

	// 1. Try hover targets (invisible planes for larger hit area)
	let intersects = raycaster.intersectObjects(Object.values(hoverTargets))
	let hitLabel = null

	if (intersects.length > 0) {
		const labelKey = intersects[0].object.userData.labelKey
		hitLabel = labels[labelKey]
	}

	// 2. Fallback: Try actual label meshes (for Home label or if hover target missed)
	if (!hitLabel) {
		intersects = raycaster.intersectObjects(Object.values(labels), true)
		if (intersects.length > 0) {
			let hit = intersects[0].object
			while (hit && !hit.userData.name && hit.parent) {
				hit = hit.parent
			}
			if (hit && hit.userData.name) {
				hitLabel = labels[hit.userData.name]
			}
		}
	}

	// Update hover state
	if (hitLabel && hitLabel.visible) {
		// Lazy capture of originalScale if missing or zero (fixes Home label animation)
		if (
			!hitLabel.userData.originalScale ||
			hitLabel.userData.originalScale.lengthSq() < 0.0001
		) {
			if (hitLabel.scale.lengthSq() > 0.01) {
				hitLabel.userData.originalScale = hitLabel.scale.clone()
			}
		}

		if (hoveredLabel !== hitLabel) {
			if (
				hitLabel.userData.originalScale &&
				hitLabel.userData.originalScale.lengthSq() > 0.0001
			) {
				hoveredLabel = hitLabel
			}
		}
		inputManager.setCursor("pointer")
	} else {
		// Clear hover if no label hit
		if (hoveredLabel) {
			hoveredLabel = null
		}

		// Check contact label/details hover state for expansion logic
		let isOverContactLabel = false
		let isOverContactDetails = false

		// 1. Check Contact Label (in nav mode)

		// 2. Check Contact Details (if visible)

		// Handle Expansion State

		// Check if hovering over the pyramid mesh itself (when centered)
		// No hover targets: ensure cursor is default and reset hoveredLabel
		if (hoveredLabel) {
			// Scale reset handled in animateLabels loop
			hoveredLabel = null
		}

		if (isOverContactLabel || isOverContactDetails) {
			return
		}

		inputManager.setCursor("default")
	}
})

// Listen for route changes and show correct content
// Helper to animate pyramid to top menu and show a section
function centerAndOpenLabel(labelManager, labelName) {
	if (!labelManager.getLabel(labelName)) return
	// Clicking a label should reveal the corner Home control
	try {
		labelManager.showHomeLabel()
	} catch (_e) {
		/* showHomeLabel might not be available yet */
	}

	const isAtTop = pyramidGroup.position.y >= 1.5

	if (isAtTop) {
		// Already at top, just spin to new section
		hideAllPlanes()
		const sectionName = labelName.toLowerCase()
		spinPyramidToSection(
			sectionName,
			() => {
				startLoading()
				setTimeout(async () => {
					if (labelName === "About") await showAboutPlane()
					else if (labelName === "Portfolio") await showPortfolioPlane()
					else if (labelName === "Blog") await showBlogPlane()
					stopLoading()
				}, 500)
			},
			600,
		)
	} else if (!isAtTop) {
		// animate pyramid to top and flatten labels - content will be shown when animation completes
		animatePyramid(labelManager, true, labelName.toLowerCase(), () => {
			startLoading()
			setTimeout(async () => {
				if (labelName === "About") await showAboutPlane()
				else if (labelName === "Portfolio") await showPortfolioPlane()
				else if (labelName === "Blog") await showBlogPlane()
				stopLoading()
			}, 500)
		})
	}
	// Track which section is active (for highlighting in menu if desired)
	window.centeredLabelName = labelName
}

// Helper to map routes to page names for hand transitions
function routeToPage(route) {
	// Normalize trailing slash
	if (route && route.length > 1 && route.endsWith("/"))
		route = route.slice(0, -1)

	const routeMap = {
		"/": "home",
		"/about": "about",
		"/bio": "about", // Alias
		"/blog": "blog",
		"/portfolio": "portfolio",
		"/portfolio/orc-demo": "orc-demo",
	}
	// Handle individual blog posts
	if (route.includes("/blog/posts/")) return "blog"
	return routeMap[route] || "home"
}

router.onRouteChange((rawRoute) => {
	try {
		// Normalize trailing slash
		const route =
			rawRoute && rawRoute.length > 1 && rawRoute.endsWith("/")
				? rawRoute.slice(0, -1)
				: rawRoute

		// Update meta tags for social sharing
		updateMetaTags(route)

		// Handle hand transitions
		const newPage = routeToPage(route)
		const currentPage = getCurrentHandPage()

		if (newPage !== currentPage) {
			// Cancel any pending hand entry if navigating away from home
			cancelHandEntry()

			// Don't trigger hand page transition when going to/from ORC demo
			// - morphToOrcScene handles entry into ORC demo (hand flies in from left)
			// - morphFromOrcScene handles exit from ORC demo (releases hand to main scene)
			const isOrcTransition =
				newPage === "orc-demo" || currentPage === "orc-demo"
			if (!isOrcTransition) {
				triggerHandPageTransition(currentPage, newPage)
			}
		}

		if (route === "/bio" || route === "/about") {
			if (controls) controls.enabled = false
			// If coming from ORC scene, morph back first
			if (isOrcSceneActive()) {
				hideAllPlanes()
				morphFromOrcScene()
				setTimeout(() => {
					// After ORC scene fade out, trigger hand entry from the right
					// (ORC demo is rightmost, so leaving it means entering from right)
					triggerHandPageTransition("orc-demo", "about")
					resetPyramidToHome(labelManager)
					centerAndOpenLabel(labelManager, "About")
				}, 1300)
			} else {
				centerAndOpenLabel(labelManager, "About")
			}
		} else if (route === "/portfolio") {
			if (controls) controls.enabled = false
			if (isOrcSceneActive()) {
				hideAllPlanes()
				morphFromOrcScene()
				setTimeout(() => {
					triggerHandPageTransition("orc-demo", "portfolio")
					resetPyramidToHome(labelManager)
					centerAndOpenLabel(labelManager, "Portfolio")
				}, 1300)
			} else {
				centerAndOpenLabel(labelManager, "Portfolio")
			}
		} else if (route === "/blog") {
			if (controls) controls.enabled = false
			if (isOrcSceneActive()) {
				hideAllPlanes()
				morphFromOrcScene()
				setTimeout(() => {
					triggerHandPageTransition("orc-demo", "blog")
					resetPyramidToHome(labelManager)
					centerAndOpenLabel(labelManager, "Blog")
				}, 1300)
			} else {
				centerAndOpenLabel(labelManager, "Blog")
			}
		} else if (
			/^\/[a-z0-9-]+$/.test(route) &&
			!["/about", "/bio", "/blog", "/portfolio", "/contact", "/"].includes(
				route,
			)
		) {
			// Single-segment route like `/em-dashing` — treat as blog post slug
			const postRoute = `/blog/posts${route}`
			if (controls) controls.enabled = false
			// Reuse existing blog post flow by delegating to showBlogPost with the
			// mapped `/blog/posts/<slug>` route.
			if (isOrcSceneActive()) {
				hideAllPlanes()
				morphFromOrcScene()
				setTimeout(() => {
					triggerHandPageTransition("orc-demo", "blog")
					resetPyramidToHome(labelManager)
					animatePyramid(labelManager, true, "blog")
					showBlogPost(postRoute)
				}, 1300)
			} else {
				const isAtTop = pyramidGroup.position.y >= 1.5
				if (!isAtTop) {
					animatePyramid(labelManager, true, "blog", () => {
						startLoading()
						setTimeout(async () => {
							await showBlogPost(postRoute)
							stopLoading()
						}, 500)
					})
				} else {
					spinPyramidToSection(
						"blog",
						() => {
							startLoading()
							setTimeout(async () => {
								await showBlogPost(postRoute)
								stopLoading()
							}, 600)
						},
						600,
					)
				}
			}
			window.centeredLabelName = "Blog"
		} else if (route.includes("/blog/posts/")) {
			if (controls) controls.enabled = false
			// Handle individual blog posts - keep pyramid at top but don't reload content
			if (isOrcSceneActive()) {
				hideAllPlanes()
				morphFromOrcScene()
				setTimeout(() => {
					triggerHandPageTransition("orc-demo", "blog")
					resetPyramidToHome(labelManager)
					animatePyramid(labelManager, true, "blog")
					showBlogPost(route)
				}, 1300)
			} else {
				const isAtTop = pyramidGroup.position.y >= 1.5
				if (!isAtTop) {
					animatePyramid(labelManager, true, "blog", () => {
						startLoading()
						setTimeout(async () => {
							await showBlogPost(route)
							stopLoading()
						}, 500)
					})
				} else {
					spinPyramidToSection(
						"blog",
						() => {
							startLoading()
							setTimeout(async () => {
								await showBlogPost(route)
								stopLoading()
							}, 600)
						},
						600,
					)
				}
			}
			window.centeredLabelName = "Blog"
		} else if (route === "/portfolio/orc-demo") {
			if (controls) controls.enabled = false

			hideAllPlanes()
			const isAtTop = pyramidGroup.position.y >= 1.5
			if (!isAtTop) {
				animatePyramid(labelManager, true, "portfolio", () => {
					startLoading()
					setTimeout(() => {
						morphToOrcScene()
						window.centeredLabelName = null
						stopLoading()
					}, 600)
				})
			} else {
				spinPyramidToSection("portfolio", () => {
					startLoading()
					setTimeout(() => {
						morphToOrcScene()
						window.centeredLabelName = null
						stopLoading()
					}, 600)
				})
			}
		} else {
			// For non-content routes (home), reset pyramid, hide all content, and hide contact
			if (isOrcSceneActive && isOrcSceneActive()) {
				// morphFromOrcScene handles its own cleanup with fade animation
				// Don't call hideAllPlanes() here as it would remove elements before fade completes
				morphFromOrcScene()
				// After transition, animate hand from right (ORC demo is rightmost)
				setTimeout(() => {
					triggerHandPageTransition("orc-demo", "home")
				}, 1300)
			} else {
				resetPyramidToHome(labelManager)
				hideAllPlanes()
				// Schedule hand entry on home page (2 second delay) only if not coming from ORC
				scheduleHandEntry(2000)

				// Ensure controls are enabled
				if (controls) controls.enabled = true

				// Ensure pyramid is visible and opaque (fix for home page regression)
				pyramidGroup.visible = true

				// Force reset position/scale if it looks wrong (e.g. stuck in nav state)
				if (pyramidGroup.position.y > 1.0) {
					pyramidGroup.position.set(
						initialPyramidState.positionX,
						initialPyramidState.positionY,
						0,
					)
					pyramidGroup.rotation.set(0, initialPyramidState.rotationY, 0)
					pyramidGroup.scale.set(
						initialPyramidState.scale,
						initialPyramidState.scale,
						initialPyramidState.scale,
					)
				}

				const labels = labelManager.getLabels()
				const labelMeshes = Object.values(labels)

				pyramidGroup.children.forEach((c) => {
					if (labelMeshes.includes(c)) return
					c.visible = true
					if (c.material) {
						c.material.opacity = 1
						c.material.transparent = false
						c.material.needsUpdate = true
					}
				})
			}
			window.centeredLabelName = null
		}
	} catch (routeError) {
		console.error("[main.js] ERROR in route change handler:", routeError)
		console.error("[main.js] Stack:", routeError.stack)
	}
})

// Trigger route listeners once at startup so direct navigation to /bio, /portfolio, /blog works
try {
	router.notify()
	// Update meta tags for initial route
	updateMetaTags(router.getCurrentRoute())
} catch (error) {
	console.error("[main.js] ERROR in router.notify():", error)
}

inputManager.addClickHandler((raycaster) => {
	if (document.body.classList.contains("orc-doc-active")) return

	// Check if contact label was clicked - only block if a click region was actually hit

	// Track which label is centered
	try {
		const portfolioPlaneEarly = scene.getObjectByName("portfolioPlane")
		if (portfolioPlaneEarly) {
			const clickablesEarly = portfolioPlaneEarly.children.filter(
				(c) => c && c.userData && c.userData.link,
			)
			if (clickablesEarly.length > 0) {
				const hitsEarly = raycaster.intersectObjects(clickablesEarly, true)
				if (hitsEarly.length > 0) {
					let node = hitsEarly[0].object
					while (node) {
						if (node.userData && node.userData.link) {
							try {
								if (handleContentLink(node.userData.link, router)) return
							} catch (e) {
								console.error("Error handling content link (early)", e)
							}
						}
						node = node.parent
					}
				}
			}
		}
	} catch (_e) {
		// ignore early plane detection errors
	}
	// Check generous hover targets first (so clicks near a label register even if a centered label is in front)
	const hoverTargets = labelManager.getHoverTargets()
	const hoverHits = raycaster.intersectObjects(Object.values(hoverTargets))
	let obj = null
	const labels = labelManager.getLabels()

	if (hoverHits.length > 0) {
		const hoverObj = hoverHits[0].object
		const labelKey = hoverObj.userData.labelKey
		obj = labels[labelKey]
	}
	// Fallback: check tight label meshes if no hover target hit
	if (!obj) {
		const labelIntersects = raycaster.intersectObjects(
			Object.values(labels),
			true,
		)
		if (labelIntersects.length > 0) {
			// Find the root label object from the intersection
			let hit = labelIntersects[0].object
			while (hit && !hit.userData.name && hit.parent) {
				hit = hit.parent
			}
			if (hit && hit.userData.name) obj = hit
		}
	}

	if (obj) {
		const labelName = obj.userData.name
		// If Home was clicked, perform a complete reset: return pyramid to home state,
		// restore all labels to original positions, hide all content, and navigate home.
		if (labelName === "Home") {
			router.navigate("/")
			return
		}

		// Map label names to section names for routing
		const sectionName = labelName.toLowerCase()

		window.centeredLabelName = labelName
		router.navigate("/" + sectionName)
		return
	}

	// Click on pyramid toggles back up

	// If the click intersected a clickable overlay on a content plane (portfolio items), handle it.
	const portfolioPlane = scene.getObjectByName("portfolioPlane")
	if (portfolioPlane) {
		// Prefer to raycast against the explicit clickable overlays added as children
		const clickables = portfolioPlane.children.filter(
			(c) => c && c.userData && c.userData.link,
		)
		if (clickables.length > 0) {
			const hits = raycaster.intersectObjects(clickables, true)
			if (hits.length > 0) {
				let node = hits[0].object
				// climb up to find any userData.link on the clicked object or its parents
				while (node) {
					if (node.userData && node.userData.link) {
						try {
							if (handleContentLink(node.userData.link, router)) return
						} catch (e) {
							console.error("Error handling content link", e)
						}
					}
					node = node.parent
				}
			}
		} else {
			// Fallback: raycast the whole plane if no explicit clickables found
			const pHits = raycaster.intersectObjects([portfolioPlane], true)
			if (pHits.length > 0) {
				const hit = pHits[0].object
				let node = hit
				while (node) {
					if (node.userData && node.userData.link) {
						try {
							if (handleContentLink(node.userData.link, router)) return
						} catch (e) {
							console.error("Error handling content link", e)
						}
					}
					node = node.parent
				}
			}
		}
	}

	const pyramidIntersects = raycaster.intersectObjects(
		pyramidGroup.children,
		true,
	)
	if (pyramidIntersects.length > 0) {
		const firstHit = pyramidIntersects[0]
		const hitObj = firstHit.object
		// If the hit object is a label mesh or a hover target, ignore here (labels handled above)
		if (
			Object.values(labels).includes(hitObj) ||
			(hitObj.name || "").endsWith("_hover")
		) {
			return
		}
		return
	}

	// If nothing else was hit (background click), show contact info (disabled for refactor)
	// showContactLabelCentered()
})
