/**
 * Scrollbar State Management
 * Tracks scrollable content and enables scroll wheel handling
 */

export class ScrollbarState {
	constructor() {
		this.activeScrollable = null // Currently hoverable scrollable content
		this.scrollOffsets = {
			bio: 0,
			portfolio: 0,
			blog: 0,
		}
		this.maxScrollOffsets = {
			bio: 0,
			portfolio: 0,
			blog: 0,
		}
	}

	// Set which plane has scrollable content
	setScrollableContent(planeName, hasScroll, contentHeight, displayHeight) {
		// Register scroll metadata for a plane. Do NOT activate it here.
		this.maxScrollOffsets[planeName] = hasScroll
			? Math.max(0, contentHeight - displayHeight)
			: 0
	}

	// Explicitly set which plane is currently hovered/active for scrolling
	setActiveScrollable(planeName) {
		if (!planeName) {
			this.activeScrollable = null
			return
		}
		// Only set if this plane actually has scrollable content
		if (
			this.maxScrollOffsets[planeName] &&
			this.maxScrollOffsets[planeName] > 0
		) {
			this.activeScrollable = planeName
		} else {
			this.activeScrollable = null
		}
	}

	// Scroll the active content
	scrollBy(amount) {
		if (!this.activeScrollable) return false

		const key = this.activeScrollable
		const maxScroll = this.maxScrollOffsets[key]

		if (maxScroll <= 0) return false

		// Increment scroll offset (positive = scroll down)
		this.scrollOffsets[key] = Math.max(
			0,
			Math.min(maxScroll, this.scrollOffsets[key] + amount)
		)

		return true
	}

	// Get current scroll offset for a plane
	getScrollOffset(planeName) {
		return this.scrollOffsets[planeName] || 0
	}

	// Reset all scroll offsets
	resetAllScrolls() {
		this.scrollOffsets = {
			bio: 0,
			portfolio: 0,
			blog: 0,
		}
		this.activeScrollable = null
	}
}

// Global singleton instance
export const scrollbarState = new ScrollbarState()
