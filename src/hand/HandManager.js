import * as THREE from "three"
import { createOrcHand } from "./HandMesh.js"

// === Roaming Hand of ORC ===
// The website is one continuous horizontal scene. Pages exist at different x-coordinates.
// The hand physically moves between pages when navigating.

const pageOrder = ["home", "about", "blog", "portfolio", "orc-demo"]

let roamingHand = null
let currentHandPage = "home"
let isHandAnimating = false
let handEntryTimeoutId = null
let handHasEntered = false // Track if hand has done initial entry

// Initialize the roaming hand
export function initRoamingHand() {
	if (roamingHand) return // Already initialized

	roamingHand = createOrcHand(5) // Scale factor of 5
	roamingHand.name = "roamingHand"
	// Start off-screen to the right, behind content (z: -2)
	roamingHand.position.set(10, 0, -2)
	// Orient the hand so it looks like it's flying (palm facing down, fingers forward)
	roamingHand.rotation.set(0, -Math.PI / 2, 0)
}

// Get the roaming hand for ORC demo to use
export function getRoamingHand() {
	return roamingHand
}

// Fly hand in from the right edge (initial home page entrance)
export function flyHandIn() {
	if (!roamingHand || handHasEntered) return

	handHasEntered = true
	isHandAnimating = true

	const startX = 10 // Off-screen right
	const endX = 5 // Visible on right edge, consistent with page transition rest position
	const duration = 1500

	roamingHand.position.x = startX
	const startTime = performance.now()

	function animateEntry(time) {
		const elapsed = time - startTime
		const t = Math.min(elapsed / duration, 1)
		// Ease out cubic for smooth deceleration
		const eased = 1 - Math.pow(1 - t, 3)

		roamingHand.position.x = startX + (endX - startX) * eased

		if (t < 1) {
			requestAnimationFrame(animateEntry)
		} else {
			isHandAnimating = false
		}
	}
	requestAnimationFrame(animateEntry)
}

// Schedule hand entry after delay (called on home page load)
export function scheduleHandEntry(delayMs = 2000) {
	if (handEntryTimeoutId) {
		clearTimeout(handEntryTimeoutId)
	}
	handEntryTimeoutId = setTimeout(() => {
		flyHandIn()
		handEntryTimeoutId = null
	}, delayMs)
}

// Cancel scheduled hand entry (if user navigates away before it triggers)
export function cancelHandEntry() {
	if (handEntryTimeoutId) {
		clearTimeout(handEntryTimeoutId)
		handEntryTimeoutId = null
	}
}

// Animate hand transition between pages
export function triggerHandPageTransition(fromPage, toPage) {
	if (!roamingHand) return

	const fromIndex = pageOrder.indexOf(fromPage)
	const toIndex = pageOrder.indexOf(toPage)

	if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return

	isHandAnimating = true
	const movingRight = toIndex > fromIndex

	// Animation timing to sync with pyramid animation (600ms total)
	const exitDuration = 300
	const entryDuration = 300

	// Exit: fly off-screen in direction of travel
	const exitX = movingRight ? 10 : -10

	// Entry: appear on opposite side and fly into view
	const entryStartX = movingRight ? -10 : 10
	// Rest at a visible position on the side the hand entered from
	// When entering from left (moving right), rest on left side (x: -5)
	// When entering from right (moving left), rest on right side (x: 5)
	const entryEndX = movingRight ? -5 : 5

	const startX = roamingHand.position.x
	const exitStartTime = performance.now()

	function animateExit(time) {
		const elapsed = time - exitStartTime
		const t = Math.min(elapsed / exitDuration, 1)
		const eased = t * t // Ease in (accelerate)

		roamingHand.position.x = startX + (exitX - startX) * eased

		if (t < 1) {
			requestAnimationFrame(animateExit)
		} else {
			// Teleport to entry position
			roamingHand.position.x = entryStartX
			currentHandPage = toPage
			// Start entry animation
			const entryStartTime = performance.now()
			animateEntryPhase(entryStartTime)
		}
	}

	function animateEntryPhase(entryStartTime) {
		function animateEntry(time) {
			const elapsed = time - entryStartTime
			const t = Math.min(elapsed / entryDuration, 1)
			// Ease out cubic for smooth deceleration
			const eased = 1 - Math.pow(1 - t, 3)

			roamingHand.position.x = entryStartX + (entryEndX - entryStartX) * eased

			if (t < 1) {
				requestAnimationFrame(animateEntry)
			} else {
				isHandAnimating = false
			}
		}
		requestAnimationFrame(animateEntry)
	}

	requestAnimationFrame(animateExit)
}

// Get current hand page
export function getCurrentHandPage() {
	return currentHandPage
}

// Update idle hand motion (called from animate loop)
export function updateHandIdleMotion(isOrcSceneActive) {
	if (!roamingHand || isHandAnimating) return
	// Don't apply idle motion when ORC scene is active (state machine handles it)
	if (isOrcSceneActive) return

	const time = performance.now() * 0.001
	// Gentle bobbing motion
	roamingHand.position.y = Math.sin(time * 0.5) * 0.15
	// Slight swaying
	roamingHand.rotation.z = Math.sin(time * 0.3) * 0.08
}

export function setCurrentHandPage(page) {
	currentHandPage = page
}
