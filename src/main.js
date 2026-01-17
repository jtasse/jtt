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
	// Roaming hand functions
	setLabelManager,
	pyramidGroup,
	layoutManager,
	screenToWorld,
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
	Object.values(labels).forEach((label) => {
		if (!label.visible) return
		if (!label.userData.originalScale) return

		const isHovered = hoveredLabel === label
		const targetScaleScalar = isHovered ? 1.12 : 1.0

		const target = label.userData.originalScale
			.clone()
			.multiplyScalar(targetScaleScalar)
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

let currentContentVisible = null // Track which content plane is showing (about/portfolio/blog or null)

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
			(c) => c && c.userData && c.userData.link
		)
		if (portfolioClickables.length > 0) {
			const portfolioHits = raycaster.intersectObjects(
				portfolioClickables,
				false
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
	} catch (e) {
		/* showHomeLabel might not be available yet */
	}

	const isAtTop = pyramidGroup.position.y >= 1.5

	if (isAtTop) {
		// Already at top, just spin to new section
		hideAllPlanes()
		const sectionName = labelName.toLowerCase()
		spinPyramidToSection(sectionName, () => {
			if (labelName === "About") showAboutPlane()
			else if (labelName === "Portfolio") showPortfolioPlane()
			else if (labelName === "Blog") showBlogPlane()
		})
	} else if (!isAtTop) {
		// animate pyramid to top and flatten labels - content will be shown when animation completes
		animatePyramid(labelManager, true, labelName.toLowerCase())
	}
	// Track which section is active (for highlighting in menu if desired)
	window.centeredLabelName = labelName
}

// Helper to map routes to page names for hand transitions
function routeToPage(route) {
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

router.onRouteChange((route) => {
	// Handle hand transitions
	const newPage = routeToPage(route)
	const currentPage = getCurrentHandPage()

	if (newPage !== currentPage) {
		// Cancel any pending hand entry if navigating away from home
		cancelHandEntry()

		// Don't trigger hand page transition when going to/from ORC demo
		// - morphToOrcScene handles entry into ORC demo (hand flies in from left)
		// - morphFromOrcScene handles exit from ORC demo (releases hand to main scene)
		const isOrcTransition = newPage === "orc-demo" || currentPage === "orc-demo"
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
				currentContentVisible = "about"
			}, 1300)
		} else {
			centerAndOpenLabel(labelManager, "About")
			currentContentVisible = "about"
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
				currentContentVisible = "portfolio"
			}, 1300)
		} else {
			centerAndOpenLabel(labelManager, "Portfolio")
			currentContentVisible = "portfolio"
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
				currentContentVisible = "blog"
			}, 1300)
		} else {
			centerAndOpenLabel(labelManager, "Blog")
			currentContentVisible = "blog"
		}
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
				animatePyramid(labelManager, true, "blog")
			} else {
				spinPyramidToSection("blog")
			}
			showBlogPost(route)
		}
		window.centeredLabelName = "Blog"
	} else if (route === "/portfolio/orc-demo") {
		if (controls) controls.enabled = false
		// Move contact label to left sidebar position instead of hiding it
		// moveContactLabelToLeft()

		// Ensure previous content (like portfolio preview) is cleaned up
		hideAllPlanes()

		// Morph pyramid into ORC demo scene
		morphToOrcScene()
		currentContentVisible = "orc-demo"
		window.centeredLabelName = null
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
					0
				)
				pyramidGroup.rotation.set(0, initialPyramidState.rotationY, 0)
				pyramidGroup.scale.set(
					initialPyramidState.scale,
					initialPyramidState.scale,
					initialPyramidState.scale
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
		currentContentVisible = null
		window.centeredLabelName = null
	}
})

// Trigger route listeners once at startup so direct navigation to /bio, /portfolio, /blog works
router.notify()

inputManager.addClickHandler((raycaster) => {
	if (document.body.classList.contains("orc-doc-active")) return

	// Check if contact label was clicked - only block if a click region was actually hit

	// Track which label is centered
	const centeredLabelName = window.centeredLabelName || null
	// If a content plane is visible, prefer handling clickable overlays on it first
	try {
		const portfolioPlaneEarly = scene.getObjectByName("portfolioPlane")
		if (portfolioPlaneEarly) {
			const clickablesEarly = portfolioPlaneEarly.children.filter(
				(c) => c && c.userData && c.userData.link
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
	} catch (e) {
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
			true
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

		// Always navigate when a label is clicked, regardless of current state
		// This fixes issues where navigation could get stuck
		const isAtTop = pyramidGroup.position.y >= 0.75
		if (isAtTop) {
			// Already in flattened state, spin pyramid to new face and switch content
			hideAllPlanes()
			spinPyramidToSection(sectionName, () => {
				// Show content after spin completes
				if (labelName === "About") {
					showAboutPlane()
					currentContentVisible = "about"
				} else if (labelName === "Portfolio") {
					showPortfolioPlane()
					currentContentVisible = "portfolio"
				} else if (labelName === "Blog") {
					showBlogPlane()
					currentContentVisible = "blog"
				}
			})
		} else {
			// Animate pyramid to top and show content
			animatePyramid(labelManager, true, sectionName)
		}

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
			(c) => c && c.userData && c.userData.link
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
		true
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
