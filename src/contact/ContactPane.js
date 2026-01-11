// DOM-based contact pane for bottom-right corner
// Slides in on page load, expands on hover to show email/phone with copy functionality

import { router } from "../router.js"
import contactPaneHTML from "./contact-pane.html?raw"

// Timing constants (in milliseconds)
const HOME_ENTRANCE_DELAY = 800 // Delay on home page after pyramid settles
const OTHER_ENTRANCE_DELAY = 300 // Faster entrance on other pages
const COLLAPSE_DELAY = 3000 // Time before collapsing on mouse leave

// Module state
let paneElement = null
let collapseTimeoutId = null
let isExpanded = false
let isVisible = false

/**
 * Initialize the contact pane DOM element
 * Call this once during app initialization
 */
export function initContactPane() {
	if (paneElement) return // Already initialized

	// Create container and inject HTML template
	const container = document.createElement("div")
	container.innerHTML = contactPaneHTML
	paneElement = container.firstElementChild

	document.body.appendChild(paneElement)

	// Attach event listeners
	setupEventListeners()

	// Listen for route changes
	router.onRouteChange(handleRouteChange)

	// Trigger initial entrance based on current route
	handleRouteChange(router.getCurrentRoute())
}

/**
 * Set up all event listeners for the pane
 */
function setupEventListeners() {
	const header = paneElement.querySelector(".contact-pane-header")
	const items = paneElement.querySelectorAll(".contact-item")

	// Header click toggles expansion
	header.addEventListener("click", toggleExpand)

	// Mouse enter on pane: expand and cancel collapse timer
	paneElement.addEventListener("mouseenter", () => {
		cancelCollapseTimer()
		expand()
	})

	// Mouse leave on pane: start collapse timer
	paneElement.addEventListener("mouseleave", () => {
		startCollapseTimer()
	})

	// Click on contact items copies to clipboard
	items.forEach((item) => {
		item.addEventListener("click", (e) => {
			e.stopPropagation() // Don't trigger header toggle
			if (item.dataset.value) {
				copyToClipboard(item)
			}
		})
	})
}

/**
 * Handle route changes to trigger entrance animation
 */
function handleRouteChange(route) {
	// If already visible, no need to re-animate
	if (isVisible) return

	// Determine delay based on route
	const delay = route === "/" ? HOME_ENTRANCE_DELAY : OTHER_ENTRANCE_DELAY

	// Schedule entrance
	setTimeout(() => {
		slideIn()
	}, delay)
}

/**
 * Slide the pane in from the right
 */
function slideIn() {
	if (isVisible) return
	isVisible = true
	paneElement.classList.add("visible")
}

/**
 * Expand the pane to show contact details
 */
function expand() {
	if (isExpanded) return
	isExpanded = true
	paneElement.classList.add("expanded")
}

/**
 * Collapse the pane to show only header
 */
function collapse() {
	if (!isExpanded) return
	isExpanded = false
	paneElement.classList.remove("expanded")
}

/**
 * Toggle between expanded and collapsed states
 */
function toggleExpand() {
	if (isExpanded) {
		collapse()
	} else {
		expand()
	}
}

/**
 * Start the collapse timer (3 second delay)
 */
function startCollapseTimer() {
	cancelCollapseTimer()
	collapseTimeoutId = setTimeout(() => {
		collapse()
		collapseTimeoutId = null
	}, COLLAPSE_DELAY)
}

/**
 * Cancel any pending collapse timer
 */
function cancelCollapseTimer() {
	if (collapseTimeoutId) {
		clearTimeout(collapseTimeoutId)
		collapseTimeoutId = null
	}
}

/**
 * Copy contact info to clipboard and show confirmation
 */
async function copyToClipboard(itemElement) {
	const value = itemElement.dataset.value
	const type = itemElement.dataset.type
	const tooltip = itemElement.querySelector(".contact-item-tooltip")

	try {
		await navigator.clipboard.writeText(value)

		// Show "Copied!" confirmation
		const originalText = tooltip.textContent
		tooltip.textContent = `${type === "email" ? "Email" : "Phone"} copied!`
		tooltip.classList.add("copied")

		// Restore original tooltip after 2 seconds
		setTimeout(() => {
			tooltip.textContent = originalText
			tooltip.classList.remove("copied")
		}, 2000)
	} catch (err) {
		console.error("Failed to copy to clipboard:", err)
	}
}

/**
 * Hide the pane completely (for cleanup or if needed)
 */
export function hideContactPane() {
	if (!paneElement) return
	isVisible = false
	isExpanded = false
	paneElement.classList.remove("visible", "expanded")
	cancelCollapseTimer()
}

/**
 * Check if pane is currently visible
 */
export function isContactPaneVisible() {
	return isVisible
}
