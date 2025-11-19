import * as THREE from "three"
import { makeLabelPlane } from "./planes.js"
import {
	pyramidGroup,
	labels,
	initLabels,
	animatePyramid,
	showBioPlane,
	showPortfolioPlane,
	hideAllPlanes,
	showBlogPlane,
	animateLabelToCenter,
	animateLabelToOriginal,
	animate,
	renderer,
	camera,
	scene,
	controls,
	hideHomeLabel,
	showHomeLabel,
	resetPyramidToHome,
} from "./pyramid/pyramid.js"
import { router } from "./router.js"
import { scrollbarState } from "./scrollbarState.js"

// Track camera rotation to show Home label when rotating at center
let lastCameraPhiAngle = controls.getSphericalDelta ? 0 : null

// Attach renderer DOM element
document.getElementById("scene-container").appendChild(renderer.domElement)

// Initialize Labels
initLabels(makeLabelPlane)

// Start animation loop
animate()

// -----------------------------
// Content-floor positioning
// -----------------------------
// Project a world-space position to screen coordinates
function projectWorldToScreen(worldPos, camera) {
	const v = worldPos.clone().project(camera)
	return {
		x: ((v.x + 1) / 2) * window.innerWidth,
		y: ((1 - v.y) / 2) * window.innerHeight,
	}
}

let lastFloorUpdate = 0
function updateContentFloorPosition() {
	const floor = document.getElementById("content-floor")
	if (!floor || !labels || !labels.Home) {
		if (floor) floor.classList.remove("show")
		return
	}

	// If a 3D separator exists and is visible, do not show the DOM separator.
	if (
		pyramidGroup &&
		pyramidGroup.userData &&
		pyramidGroup.userData._separator3D &&
		pyramidGroup.userData._separator3D.visible
	) {
		floor.classList.remove("show")
		return
	}

	// Debug log to help identify why the separator may not be visible
	// (no debug logging) - keep this function quiet in production

	const content = document.getElementById("content")
	// get Home label world->screen position
	const homeMesh = labels.Home
	const homeWorld = new THREE.Vector3()
	homeMesh.getWorldPosition(homeWorld)
	const homeScreen = projectWorldToScreen(homeWorld, camera)

	// determine horizontal alignment: prefer content pane, fallback to scene container
	const sceneContainer = document.getElementById("scene-container")
	const rect = content
		? content.getBoundingClientRect()
		: sceneContainer
		? sceneContainer.getBoundingClientRect()
		: { left: 0, width: window.innerWidth, bottom: window.innerHeight * 0.6 }

	const contentBottom = content ? rect.bottom : null

	// Decide when the floor should be visible:
	// - if the pyramid is at bottom (uncentered)
	// - OR if the content pane exists and is visible (user clicked a label)
	const pyramidAtBottom =
		pyramidGroup && pyramidGroup.position
			? pyramidGroup.position.y <= -1.5
			: false
	const contentVisible = !!(
		content && window.getComputedStyle(content).display !== "none"
	)

	if (!pyramidAtBottom && !contentVisible) {
		floor.classList.remove("show")
		// console debug
		// (no debug logging) - keep this function quiet in production
		return
	}

	// place the floor between content bottom and the Home label
	// Use larger padding so there's more vertical empty space above/below the separator.
	const pad = 36 // space between content bottom and separator
	const homeOffset = 72 // distance to keep between Home label/pyramid and separator
	let targetY
	if (content && contentBottom !== null) {
		// Ensure the separator stays at least `pad` below the content, but also
		// leave `homeOffset` space above the Home label. Choose the closest
		// position that satisfies both constraints and doesn't overlap.
		targetY = Math.min(
			homeScreen.y - pad,
			Math.max(contentBottom + pad, homeScreen.y - homeOffset)
		)
	} else {
		// No content pane: position a bit above the Home label so the separator
		// separates content area and Home; use the larger homeOffset to create breathing room.
		targetY = homeScreen.y - homeOffset
	}

	// Center the separator above the Home label with a fixed, short width
	const desiredWidth = 220
	floor.classList.add("show")
	floor.style.position = "fixed"
	const leftPos = Math.round(homeScreen.x - desiredWidth / 2)
	floor.style.left = leftPos + "px"
	floor.style.width = desiredWidth + "px"
	floor.style.top = Math.round(targetY) + "px"

	// Do not reposition the DOM `#content` from JS; keep vertical layout controlled by HTML/CSS.
}

// Adjust the DOM content max-height so the content always ends above the separator.
// Prefers the 3D separator position when available, otherwise falls back to the DOM `#content-floor`.
function updateContentMaxHeightToSeparator() {
	const content = document.getElementById("content")
	if (!content) return

	// If content is not visible, clear any inline maxHeight so CSS controls it when shown
	if (window.getComputedStyle(content).display === "none") {
		content.style.maxHeight = ""
		content.style.bottom = ""
		content.style.bottom = ""
		return
	}

	// determine separator screen Y
	let sepScreenY = null
	// Prefer 3D separator if present and visible
	try {
		const sep3D =
			pyramidGroup &&
			pyramidGroup.userData &&
			pyramidGroup.userData._separator3D
		if (sep3D && sep3D.visible) {
			const sepWorld = new THREE.Vector3()
			sep3D.getWorldPosition(sepWorld)
			const s = projectWorldToScreen(sepWorld, camera)
			sepScreenY = s.y
		}
	} catch (e) {
		// ignore - fallback to DOM bar
	}

	// If no 3D separator, check DOM content-floor if shown
	if (sepScreenY === null) {
		const floor = document.getElementById("content-floor")
		if (floor && floor.classList.contains("show")) {
			const r = floor.getBoundingClientRect()
			sepScreenY = r.top
		}
	}

	// If still no separator position, fall back to CSS rule (clear inline style)
	if (sepScreenY === null) {
		// If we don't have a visible 3D separator or DOM bar yet, use the Home
		// label screen position as a conservative fallback so content never
		// overlaps the pyramid. This ensures the content is clamped above the
		// scene even during startup or when the separator is still initializing.
		try {
			if (labels && labels.Home) {
				const homeWorld = new THREE.Vector3()
				labels.Home.getWorldPosition(homeWorld)
				const hs = projectWorldToScreen(homeWorld, camera)
				// place the virtual separator some px above Home label
				const fallbackOffset = 60 // px above Home label
				sepScreenY = hs.y - fallbackOffset
			}
		} catch (e) {
			// if fallback also fails, clear inline style and exit
			if (sepScreenY === null) {
				content.style.maxHeight = ""
				content.style.bottom = ""
				content.style.bottom = ""
				return
			}
		}
	}

	// Compute available bottom distance for content so it ends above the separator by gapPx
	const gapPx = 36 // pixels between content bottom and separator; tweakable
	const topRect = content.getBoundingClientRect()
	const topPx = topRect.top
	// Determine bottom in px from viewport bottom: we want the content's bottom to be
	// window.innerHeight - (sepScreenY - gapPx).
	let bottomPx = Math.round(window.innerHeight - (sepScreenY - gapPx))
	// Ensure there's at least a minimum height available for content
	const minHeight = 120
	const availableHeight = bottomPx - topPx
	if (availableHeight < minHeight) {
		// If not enough room, push the bottom further down to guarantee min height
		bottomPx = Math.round(topPx + minHeight)
	}
	// Apply bottom as inline style so the fixed-positioned `#content` will size responsively
	content.style.bottom = bottomPx + "px"
	// Clear maxHeight so CSS doesn't conflict with bottom-based sizing
	content.style.maxHeight = ""
	// ensure any previous bottom override is preserved by this updater; if you
	// want to clear bottom elsewhere, do so explicitly
}

function contentFloorAnimationLoop(time) {
	if (time - lastFloorUpdate > 33) {
		updateContentFloorPosition()
		updateContentMaxHeightToSeparator()
		lastFloorUpdate = time
	}
	requestAnimationFrame(contentFloorAnimationLoop)
}
requestAnimationFrame(contentFloorAnimationLoop)

window.addEventListener("resize", () => {
	updateContentFloorPosition()
	updateContentMaxHeightToSeparator()
})

// Expose updater so other modules (pyramid) can request immediate positioning
window.updateContentFloorPosition = updateContentFloorPosition

// Debug helper: if URL contains ?debugFloor, force-show the separator at 80px
if (
	typeof window !== "undefined" &&
	window.location &&
	window.location.search.includes("debugFloor")
) {
	const dbgFloor = document.getElementById("content-floor")
	if (dbgFloor) {
		dbgFloor.classList.add("show")
		dbgFloor.style.top = "80px"
	}
}

// Force visible debug bar when visiting with ?forceFloor
if (
	typeof window !== "undefined" &&
	window.location &&
	window.location.search.includes("forceFloor")
) {
	const existing = document.getElementById("content-floor-debug")
	if (!existing) {
		const el = document.createElement("div")
		el.id = "content-floor-debug"
		el.style.position = "fixed"
		el.style.top = "80px"
		el.style.left = "0"
		el.style.right = "0"
		el.style.height = "8px"
		el.style.background = "red"
		el.style.zIndex = "2147483647"
		el.style.pointerEvents = "none"
		document.body.appendChild(el)
	}
}

// === Click Handling ===
const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()
let hoveredLabel = null
let currentContentVisible = null // Track which content plane is showing (bio/portfolio/blog or null)
let pointerDownPos = new THREE.Vector2() // Track pointer position on mousedown to detect true clicks vs drags
let isPointerDown = false
let isDragging = false
const DRAG_THRESHOLD = 5 // pixels

// Track mousedown to detect if click is a drag, and process scene interaction
function onMouseDown(event) {
	isPointerDown = true
	isDragging = false
	pointerDownPos.x = event.clientX
	pointerDownPos.y = event.clientY
	// Don't process scene interaction on mousedown - wait for mouseup to confirm it's a real click
}

window.addEventListener("mousedown", onMouseDown)

// Track mousemove to detect drag
window.addEventListener("mousemove", (event) => {
	if (isPointerDown) {
		const dx = event.clientX - pointerDownPos.x
		const dy = event.clientY - pointerDownPos.y
		if (Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) {
			isDragging = true
		}
	}
})

// Track mouseup to mark end of interaction AND trigger scene click
window.addEventListener("mouseup", (event) => {
	isPointerDown = false
	// Only trigger scene interaction if this wasn't a drag
	if (!isDragging) {
		onSceneMouseDown(event)
	}
	isDragging = false
})

// Completely block click events at capture phase - we'll use mousedown instead
window.addEventListener(
	"click",
	(event) => {
		event.preventDefault()
		event.stopPropagation()
	},
	true
) // Use capture phase to prevent ALL clicks from reaching handlers

// Hover detection
function onMouseMove(event) {
	pointer.x = (event.clientX / window.innerWidth) * 2 - 1
	pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
	raycaster.setFromCamera(pointer, camera)

	// Check hover targets FIRST (generous area outside pyramid)
	const { hoverTargets } = awaitImportHover()
	const hoverTargetIntersects = raycaster.intersectObjects(
		Object.values(hoverTargets)
	)

	// Clear previous hover if not still over its hover target
	if (hoveredLabel) {
		const stillOver = hoverTargetIntersects.some(
			(h) => h.object.userData.labelKey === hoveredLabel.userData.name
		)
		if (!stillOver) {
			hoveredLabel.scale.copy(hoveredLabel.userData.originalScale)
			hoveredLabel = null
			renderer.domElement.style.cursor = "default"
		}
	}

	if (hoverTargetIntersects.length > 0) {
		const hoverObj = hoverTargetIntersects[0].object
		const labelKey = hoverObj.userData.labelKey
		// Do not hover labels that are currently centered (but allow Home label even when visible)
		if (labelKey !== "Home" && window.centeredLabelName === labelKey) {
			renderer.domElement.style.cursor = "default"
			return
		}
		const labelMesh = labels[labelKey]
		if (labelMesh && labelMesh.visible && hoveredLabel !== labelMesh) {
			// Only scale if the label is visible and not Home (Home doesn't scale on hover)
			if (labelKey !== "Home" && labelMesh.userData.originalScale) {
				hoveredLabel = labelMesh
				hoveredLabel.scale
					.copy(hoveredLabel.userData.originalScale)
					.multiplyScalar(1.12)
			}
		}
		renderer.domElement.style.cursor = "pointer"
	} else {
		// No hover targets: ensure cursor is default and reset hoveredLabel
		if (hoveredLabel) {
			hoveredLabel.scale.copy(hoveredLabel.userData.originalScale)
			hoveredLabel = null
		}
		renderer.domElement.style.cursor = "default"
	}

	// Also detect if pointer is over a content plane (bio/portfolio/blog) to enable scrolling
	const contentPlanes = []
	const bioPlane = scene.getObjectByName("bioPlane")
	const portfolioPlane = scene.getObjectByName("portfolioPlane")
	const blogPlane = scene.getObjectByName("blogPlane")
	if (bioPlane) contentPlanes.push(bioPlane)
	if (portfolioPlane) contentPlanes.push(portfolioPlane)
	if (blogPlane) contentPlanes.push(blogPlane)
	if (contentPlanes.length > 0) {
		const intersects = raycaster.intersectObjects(contentPlanes, true)
		if (intersects.length > 0) {
			const hit = intersects[0].object
			// determine plane name
			let planeName = null
			if (hit.name === "bioPlane") planeName = "bio"
			else if (hit.name === "portfolioPlane") planeName = "portfolio"
			else if (hit.name === "blogPlane") planeName = "blog"
			// If the intersected object is a child (e.g., clickable), climb up to parent to get plane
			if (!planeName) {
				let parent = hit.parent
				while (parent) {
					if (parent.name === "bioPlane") {
						planeName = "bio"
						break
					}
					if (parent.name === "portfolioPlane") {
						planeName = "portfolio"
						break
					}
					if (parent.name === "blogPlane") {
						planeName = "blog"
						break
					}
					parent = parent.parent
				}
			}
			if (planeName) {
				// mark this plane as active for scrolling
				scrollbarState.setActiveScrollable(planeName)
				return
			}
		}
	}
	// not over any content plane
	scrollbarState.setActiveScrollable(null)
}

// helper to access hoverTargets without circular import issues
function awaitImportHover() {
	// hoverTargets is exported from pyramid module; it's available via labels object scope
	// but to be safe just reference the export directly
	return { hoverTargets: requireHoverTargets() }
}

function requireHoverTargets() {
	// the hoverTargets object was attached to the labels file as export; import dynamically
	// since we're in the same bundle, it's available on the pyramid module; simply access global
	// We already imported pyramid module above; it didn't export hoverTargets in main.js imports, so access via labels object
	// Build hoverTargets by finding objects named *_hover in scene (not pyramidGroup - they're at root)
	const targets = {}
	scene.children.forEach((child) => {
		if (child.name && child.name.endsWith("_hover")) {
			const key = child.userData.labelKey
			targets[key] = child
		}
	})
	return targets
}

window.addEventListener("mousemove", onMouseMove)

// Monitor camera changes to show Home label when rotating at center
let lastCameraAzimuth = controls.getAzimuthalAngle
	? controls.getAzimuthalAngle()
	: null
setInterval(() => {
	// Check if pyramid is at center (not at bottom)
	const isPyramidAtCenter = pyramidGroup.position.y > -1
	if (isPyramidAtCenter && controls.getAzimuthalAngle) {
		const currentAzimuth = controls.getAzimuthalAngle()
		// If camera angle changed, show Home label (indicates user is interacting with view)
		if (
			lastCameraAzimuth !== null &&
			Math.abs(currentAzimuth - lastCameraAzimuth) > 0.01
		) {
			// Only show if not already showing a centered label
			if (!window.centeredLabelName && pyramidGroup.position.y > 0) {
				showHomeLabel()
			}
		}
		lastCameraAzimuth = currentAzimuth
	} else if (!isPyramidAtCenter) {
		lastCameraAzimuth = controls.getAzimuthalAngle
			? controls.getAzimuthalAngle()
			: lastCameraAzimuth
	}
}, 100)

// Listen for route changes and show correct content
// Helper to center a label and animate pyramid down to show a section
function centerAndOpenLabel(labelName) {
	if (!labels || !labels[labelName]) return
	const labelMesh = labels[labelName]
	// animate pyramid down and request the section be shown when animation completes
	animatePyramid(true, labelName.toLowerCase())
	// animate label to center/front
	let endPos = new THREE.Vector3(0, 0, 0.5)
	if (labelName === "Portfolio") {
		// nudge Portfolio slightly down in screen space for visual alignment
		const px = 10
		const viewportH = window.innerHeight || 1
		const fov = camera.fov * (Math.PI / 180)
		const targetZ = 1.0
		const distance = camera.position.distanceTo(
			new THREE.Vector3(endPos.x, endPos.y, targetZ)
		)
		const worldOffset = 2 * distance * Math.tan(fov / 2) * (px / viewportH)
		endPos = new THREE.Vector3(endPos.x, endPos.y - worldOffset, endPos.z)
	}
	const endRot = new THREE.Euler(0, 0, 0)
	animateLabelToCenter(labelMesh, endPos, endRot)
	window.centeredLabelName = labelName
}

router.onRouteChange((route) => {
	if (route === "/bio") {
		centerAndOpenLabel("Bio")
		currentContentVisible = "bio"
	} else if (route === "/portfolio") {
		centerAndOpenLabel("Portfolio")
		currentContentVisible = "portfolio"
	} else if (route === "/blog") {
		centerAndOpenLabel("Blog")
		currentContentVisible = "blog"
	} else {
		// For non-content routes (home), reset pyramid and hide all content planes
		resetPyramidToHome()
		hideAllPlanes()
		currentContentVisible = null
	}
})

// Trigger route listeners once at startup so direct navigation to /bio, /portfolio, /blog works
router.notify()

function onSceneMouseDown(event) {
	// Only handle mousedown if it's a true click (not part of a drag)
	// We detect this by waiting for mouseup to see if isDragging was set
	// For now, just mark that we're ready to process a click
	if (isDragging) {
		return
	}

	pointer.x = (event.clientX / window.innerWidth) * 2 - 1
	pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
	raycaster.setFromCamera(pointer, camera)

	// Track which label is centered
	let centeredLabelName = window.centeredLabelName || null
	// Check generous hover targets first (so clicks near a label register even if a centered label is in front)
	const hoverTargets = requireHoverTargets()
	const hoverHits = raycaster.intersectObjects(Object.values(hoverTargets))
	let obj = null
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
		let labelName = obj.userData.name
		// If Home was clicked, perform a complete reset: return pyramid to home state,
		// restore all labels to original positions, hide all content, and navigate home.
		if (labelName === "Home") {
			// ALWAYS reset pyramid to center with home rotation, position, and scale
			resetPyramidToHome()
			// Hide all content planes
			hideAllPlanes()
			// Restore any centered label to its original position
			if (window.centeredLabelName) {
				const centeredLabel = labels[window.centeredLabelName]
				animateLabelToOriginal(
					centeredLabel,
					centeredLabel.userData.origPosition,
					centeredLabel.userData.origRotation
				)
				window.centeredLabelName = null
			}
			router.navigate("/")
			return
		}
		console.debug(
			"[onClick] clicked object labelName=",
			labelName,
			"centered=",
			window.centeredLabelName
		)
		// If the clicked object is the currently centered label, there is a special case:
		// the user might have clicked near a different label but the centered label is blocking the ray.
		// Check generous hover targets to see if the click was intended for another label.
		if (window.centeredLabelName === labelName) {
			// Try to detect whether the click was intended for another label by checking hover targets
			const hoverTargets = requireHoverTargets()
			const hoverHits = raycaster.intersectObjects(Object.values(hoverTargets))
			let intendedKey = null
			if (hoverHits.length > 0)
				intendedKey = hoverHits[0].object.userData.labelKey
			// Fallback: use 2D proximity to labels if hover target was occluded
			if (!intendedKey) {
				const rect = renderer.domElement.getBoundingClientRect()
				const clickX = ((pointer.x + 1) / 2) * rect.width
				const clickY = ((-pointer.y + 1) / 2) * rect.height
				let best = { key: null, dist: Infinity }
				for (const k of Object.keys(labels)) {
					if (k === labelName) continue
					const labelMesh = labels[k]
					const wp = new THREE.Vector3()
					labelMesh.getWorldPosition(wp)
					wp.project(camera)
					const sx = ((wp.x + 1) / 2) * rect.width
					const sy = ((-wp.y + 1) / 2) * rect.height
					const dx = sx - clickX
					const dy = sy - clickY
					const d = Math.sqrt(dx * dx + dy * dy)
					if (d < best.dist) best = { key: k, dist: d }
				}
				if (best.dist < 140) intendedKey = best.key
			}
			if (intendedKey && intendedKey !== labelName) {
				console.debug(
					"[onClick] hoverHits=",
					hoverHits.length,
					"intendedKey=",
					intendedKey
				)
				// user intended to click a different label while one was centered
				const prevCenteredLabel = labels[window.centeredLabelName]
				// return previous centered label
				animateLabelToOriginal(
					prevCenteredLabel,
					prevCenteredLabel.userData.origPosition,
					prevCenteredLabel.userData.origRotation
				)
				// now treat the click as targeting the intended label
				obj = labels[intendedKey]
				labelName = intendedKey
				// spin pyramid in place (already at bottom)
				animatePyramid(true, labelName.toLowerCase())
			} else {
				// No other intended label: treat as dismissal of the centered label
				animateLabelToOriginal(
					obj,
					obj.userData.origPosition,
					obj.userData.origRotation
				)
				hideAllPlanes()
				window.centeredLabelName = null
				return
			}
		}
		console.debug("[onClick] proceeding to center label=", labelName)
		// now handle clicking a (possibly new) label
		if (window.centeredLabelName !== labelName) {
			// If a different label is already centered, return it to original position
			if (window.centeredLabelName) {
				const prevCenteredLabel = labels[window.centeredLabelName]
				animateLabelToOriginal(
					prevCenteredLabel,
					prevCenteredLabel.userData.origPosition,
					prevCenteredLabel.userData.origRotation
				)
				// Only spin pyramid if already at bottom, don't move it
				animatePyramid(true, labelName.toLowerCase())
			} else {
				// Animate pyramid down and label to center (first time)
				animatePyramid(true, labelName.toLowerCase())
			}

			// Animate label to center/front (floating)
			let endPos = new THREE.Vector3(0, 0, 0.5) // tweak as needed
			// If Portfolio is being centered, nudge it down by 10px in screen space.
			if (labelName === "Portfolio") {
				const px = 10 // pixels to move down
				const viewportH = window.innerHeight || 1
				const fov = camera.fov * (Math.PI / 180)
				// animateLabelToCenter will set final z to 1.0; compute distance to that plane
				const targetZ = 1.0
				const distance = camera.position.distanceTo(
					new THREE.Vector3(endPos.x, endPos.y, targetZ)
				)
				const worldOffset = 2 * distance * Math.tan(fov / 2) * (px / viewportH)
				endPos = new THREE.Vector3(endPos.x, endPos.y - worldOffset, endPos.z)
			}
			const endRot = new THREE.Euler(0, 0, 0)
			animateLabelToCenter(obj, endPos, endRot)
			window.centeredLabelName = labelName

			// If pyramid is already at bottom, show the content immediately and only spin
			const isAtBottom = pyramidGroup.position.y <= -1.5
			if (isAtBottom) {
				if (labelName === "Bio") {
					showBioPlane()
					currentContentVisible = "bio"
				} else if (labelName === "Portfolio") {
					showPortfolioPlane()
					currentContentVisible = "portfolio"
				} else if (labelName === "Blog") {
					showBlogPlane()
					currentContentVisible = "blog"
				}
			}

			// Update route
			router.navigate("/" + labelName.toLowerCase())
		}
		return
	}

	// Click on pyramid toggles back up

	// If any content plane is currently visible and the click was not on a label,
	// treat this click as a request to return "home" (dismiss content and animate pyramid up).
	console.debug(
		"[onClick] currentContentVisible:",
		currentContentVisible,
		"obj:",
		obj
	)
	if (currentContentVisible && !obj) {
		// If any content plane is currently visible and the click was not on a label,
		// dismiss content but do NOT animate the pyramid. Pyramid movement should only
		// happen when the user clicks directly on the pyramid or on a label.
		hideAllPlanes()
		currentContentVisible = null
		if (window.centeredLabelName) {
			const centeredLabel = labels[window.centeredLabelName]
			animateLabelToOriginal(
				centeredLabel,
				centeredLabel.userData.origPosition,
				centeredLabel.userData.origRotation
			)
			window.centeredLabelName = null
		}
		router.navigate("/")
		return
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
		// Clicking the pyramid acts like clicking Home: reset everything to initial state
		resetPyramidToHome()
		hideAllPlanes()
		if (window.centeredLabelName) {
			const centeredLabel = labels[window.centeredLabelName]
			animateLabelToOriginal(
				centeredLabel,
				centeredLabel.userData.origPosition,
				centeredLabel.userData.origRotation
			)
			window.centeredLabelName = null
		}
		router.navigate("/")
	}
}

// update the content-floor position so it sits between the content area and the Home label.
// keeps the floor aligned to the content pane width and horizontally centered with it.
// (Content-floor updater duplicated earlier in file; duplicate removed.)
