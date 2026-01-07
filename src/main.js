import * as THREE from "three"
import "./content/overlay.css"
import {
	animatePyramid,
	showAboutPlane,
	showPortfolioPlane,
	hideAllPlanes,
	showBlogPlane,
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
	Contact,
} from "./pyramid.js"
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

// === Input Manager ===
const inputManager = new InputManager(renderer, camera)

// Initialize roaming hand
initRoamingHand()

// Start animation loop
animate()
window.dispatchEvent(new Event("resize"))

window.addEventListener("resize", () => {})

let hoveredLabel = null
let currentContentVisible = null // Track which content plane is showing (about/portfolio/blog or null)

// Hover detection
inputManager.addHoverHandler((raycaster) => {
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
	const hoverTargetIntersects = raycaster.intersectObjects(
		Object.values(hoverTargets)
	)
	// Clear previous hover if not still over its hover target
	if (hoveredLabel) {
		const stillOver = hoverTargetIntersects.some(
			(h) => h.object.userData.labelKey === hoveredLabel.userData.name
		)
		if (!stillOver) {
			if (hoveredLabel.userData.originalScale) {
				hoveredLabel.scale.copy(hoveredLabel.userData.originalScale)
			}
			hoveredLabel = null
			inputManager.setCursor("default")
		}
	}

	// Check if pyramid is in centered/home position (not at top nav)
	const isPyramidCentered = pyramidGroup.position.y < 1.0

	if (hoverTargetIntersects.length > 0) {
		const hoverObj = hoverTargetIntersects[0].object
		const labelKey = hoverObj.userData.labelKey
		const labelMesh = labels[labelKey]
		if (labelMesh && labelMesh.visible && hoveredLabel !== labelMesh) {
			// Only scale if the label is visible
			if (labelMesh.userData.originalScale) {
				hoveredLabel = labelMesh
				hoveredLabel.scale
					.copy(hoveredLabel.userData.originalScale)
					.multiplyScalar(1.12)
			}
		}
		// Show contact section when hovering over any content label while pyramid is centered
		if (
			isPyramidCentered &&
			labelMesh &&
			labelMesh.visible &&
			Contact.showContactLabelCentered
		) {
			Contact.showContactLabelCentered()
		}
		inputManager.setCursor("pointer")
	} else {
		// Check contact label/details hover state for expansion logic
		let isOverContactLabel = false
		let isOverContactDetails = false

		// 1. Check Contact Label (in nav mode)
		const contactLabel = scene.getObjectByName("contactLabel")
		if (contactLabel && contactLabel.visible) {
			const contactHits = raycaster.intersectObject(contactLabel, false)
			if (contactHits.length > 0) {
				isOverContactLabel = true
			}
		}

		// 2. Check Contact Details (if visible)
		const contactDetails = scene.getObjectByName("contactDetails")
		if (contactDetails && contactDetails.visible) {
			const contactHits = raycaster.intersectObject(contactDetails, false)
			if (contactHits.length > 0) {
				isOverContactDetails = true
				const hit = contactHits[0]

				// Check if hovering over any interactive region using UV coordinates
				const regions = contactDetails.userData.clickRegions || []
				let foundIndex = -1

				if (hit.uv) {
					const u = hit.uv.x
					const v = hit.uv.y
					const canvasY = 1 - v

					for (const region of regions) {
						if (
							u >= region.x1 &&
							u <= region.x2 &&
							canvasY >= region.y1 &&
							canvasY <= region.y2
						) {
							foundIndex = region.index
							break
						}
					}
				}

				if (foundIndex !== -1) {
					contactDetails.userData.setHoveredIndex?.(foundIndex)
					contactDetails.userData.showTooltip?.(foundIndex)
					renderer.domElement.style.cursor = "pointer"
				} else {
					contactDetails.userData.setHoveredIndex?.(-1)
					contactDetails.userData.hideTooltip?.()
					renderer.domElement.style.cursor = "default"
				}
			} else {
				if (contactDetails.userData.hideTooltip) {
					contactDetails.userData.hideTooltip()
				}
			}
		}

		// Handle Expansion State
		if (isOverContactLabel || isOverContactDetails) {
			if (Contact.setContactExpanded) Contact.setContactExpanded(true)
			if (isOverContactLabel) inputManager.setCursor("pointer")
		} else {
			// if (contactLabel && contactLabel.parent === scene) {
			if (Contact.setContactExpanded) Contact.setContactExpanded(false)
		}

		// Check if hovering over the pyramid mesh itself (when centered)
		if (isPyramidCentered && !isOverContactLabel && !isOverContactDetails) {
			const pyramidIntersects = raycaster.intersectObjects(
				pyramidGroup.children,
				true
			)
			if (pyramidIntersects.length > 0 && Contact.showContactLabelCentered) {
				Contact.showContactLabelCentered()
			}
		}
		// No hover targets: ensure cursor is default and reset hoveredLabel
		if (hoveredLabel) {
			hoveredLabel.scale.copy(hoveredLabel.userData.originalScale)
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
	// Contact label is now part of the nav row via LabelManager
	// It gets animated with other labels by animatePyramid()
	const isAtTop = pyramidGroup.position.y >= 1.5

	if (isAtTop) {
		// Already at top, just spin to new section
		hideAllPlanes()
		const sectionName = labelName.toLowerCase()
		spinPyramidToSection(sectionName, () => {
			if (labelName === "Bio") showAboutPlane()
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
		"/orc-demo": "orc-demo",
	}
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
		// If coming from ORC scene, morph back first
		if (isOrcSceneActive()) {
			morphFromOrcScene()
			setTimeout(() => {
				// After ORC scene fade out, trigger hand entry from the right
				// (ORC demo is rightmost, so leaving it means entering from right)
				triggerHandPageTransition("orc-demo", "about")
				centerAndOpenLabel(labelManager, "About")
				currentContentVisible = "about"
			}, 1300)
		} else {
			centerAndOpenLabel(labelManager, "About")
			currentContentVisible = "about"
		}
	} else if (route === "/portfolio") {
		if (isOrcSceneActive()) {
			morphFromOrcScene()
			setTimeout(() => {
				triggerHandPageTransition("orc-demo", "portfolio")
				centerAndOpenLabel(labelManager, "Portfolio")
				currentContentVisible = "portfolio"
			}, 1300)
		} else {
			centerAndOpenLabel(labelManager, "Portfolio")
			currentContentVisible = "portfolio"
		}
	} else if (route === "/blog") {
		if (isOrcSceneActive()) {
			morphFromOrcScene()
			setTimeout(() => {
				triggerHandPageTransition("orc-demo", "blog")
				centerAndOpenLabel(labelManager, "Blog")
				currentContentVisible = "blog"
			}, 1300)
		} else {
			centerAndOpenLabel(labelManager, "Blog")
			currentContentVisible = "blog"
		}
	} else if (route === "/orc-demo") {
		// Move contact label to left sidebar position instead of hiding it
		// moveContactLabelToLeft()
		// Morph pyramid into ORC demo scene
		morphToOrcScene()
		currentContentVisible = "orc-demo"
		window.centeredLabelName = null
	} else {
		// For non-content routes (home), reset pyramid, hide all content, and hide contact
		hideContactLabel()
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
			if (pyramidGroup.position.y > 0.5) {
				pyramidGroup.position.set(0, -0.3, 0)
				pyramidGroup.rotation.set(0, 0, 0)
				pyramidGroup.scale.set(1, 1, 1)
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

// Stub for hideContactLabel since it was removed
function hideContactLabel() {
	if (Contact.hideContactLabel) Contact.hideContactLabel()
}
// Trigger route listeners once at startup so direct navigation to /bio, /portfolio, /blog works
router.notify()

inputManager.addClickHandler((raycaster) => {
	// Check if contact label was clicked
	const contactDetails = scene.getObjectByName("contactDetails")
	if (contactDetails && contactDetails.visible) {
		const contactHits = raycaster.intersectObject(contactDetails, false)
		if (contactHits.length > 0) {
			const hit = contactHits[0]
			const regions = contactDetails.userData.clickRegions || []

			if (hit.uv) {
				const u = hit.uv.x
				const v = hit.uv.y
				const canvasY = 1 - v

				for (const region of regions) {
					if (
						u >= region.x1 &&
						u <= region.x2 &&
						canvasY >= region.y1 &&
						canvasY <= region.y2
					) {
						// handleContactClick(region.text, region.index)
						// For now just prevent other clicks
						return
					}
				}
			}
			return
		}
	}

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
							console.debug(
								"[onSceneMouseDown] EARLY clicked portfolio link:",
								node.userData.link
							)
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
	} else {
		// Fallback: check tight label meshes
		const labelIntersects = raycaster.intersectObjects(Object.values(labels))
		if (labelIntersects.length > 0) obj = labelIntersects[0].object
	}
	if (obj) {
		const labelName = obj.userData.name
		// If Home was clicked, perform a complete reset: return pyramid to home state,
		// restore all labels to original positions, hide all content, and navigate home.
		if (labelName === "Home") {
			router.navigate("/")
			return
		}
		// If Contact was clicked, show the pane instead of navigating
		if (labelName === "Contact") {
			if (Contact.showContactLabelCentered) Contact.showContactLabelCentered()
			return
		}

		console.debug(
			"[onClick] clicked object labelName=",
			labelName,
			"active=",
			window.centeredLabelName
		)

		// Map label names to section names for routing
		const sectionName = labelName.toLowerCase()

		// With flattened menu, all labels are visible at the top
		// Clicking a label navigates to that section
		if (window.centeredLabelName !== labelName) {
			// If already showing content, spin pyramid and switch sections
			const isAtTop = pyramidGroup.position.y >= 0.75
			if (isAtTop) {
				// Already in flattened state, spin pyramid to new face and switch content
				hideAllPlanes()
				console.log("pyramidGroup at top nav state:", pyramidGroup)
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
				window.centeredLabelName = labelName
			} else {
				// Animate pyramid to top and show content
				animatePyramid(labelManager, true, sectionName)
				window.centeredLabelName = labelName
			}

			// Update route
			router.navigate("/" + sectionName)
		}
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
						console.debug(
							"[onSceneMouseDown] clicked portfolio link:",
							node.userData.link
						)
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
						console.debug(
							"[onSceneMouseDown] clicked portfolio link (fallback):",
							node.userData.link
						)
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
		// Clicking the pyramid shows the contact info
		if (Contact.showContactLabelCentered) Contact.showContactLabelCentered()
		return
	}

	// If nothing else was hit (background click), show contact info (disabled for refactor)
	// showContactLabelCentered()
})
