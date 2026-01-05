/**
 * LayoutManager - Responsive 3D positioning based on camera frustum
 *
 * Provides frustum-based calculations for positioning 3D elements
 * relative to the viewport, enabling responsive layouts that adapt
 * to different screen sizes and aspect ratios.
 */

import * as THREE from "three"

export class LayoutManager {
	constructor(camera) {
		this.camera = camera
		this._frustumCache = { width: 0, height: 0, aspect: 0 }
		this._updateCache()
	}

	/**
	 * Update internal cache of frustum dimensions
	 * Call this after camera changes (resize, zoom, etc.)
	 */
	_updateCache() {
		const cam = this.camera
		this._frustumCache.aspect = cam.aspect

		// Calculate visible dimensions at z=0 plane
		const distance = cam.position.z
		const vFov = (cam.fov * Math.PI) / 180
		this._frustumCache.height = 2 * Math.tan(vFov / 2) * distance
		this._frustumCache.width = this._frustumCache.height * cam.aspect
	}

	/**
	 * Get the visible frustum dimensions at z=0
	 * @returns {{ width: number, height: number }}
	 */
	getFrustumDimensions() {
		// Refresh cache if aspect ratio changed
		if (this._frustumCache.aspect !== this.camera.aspect) {
			this._updateCache()
		}
		return {
			width: this._frustumCache.width,
			height: this._frustumCache.height
		}
	}

	/**
	 * Convert percentage position to world coordinates
	 * @param {number} percentX - 0 = left edge, 0.5 = center, 1 = right edge
	 * @param {number} percentY - 0 = bottom edge, 0.5 = center, 1 = top edge
	 * @param {number} [z=0] - Z position in world space
	 * @returns {THREE.Vector3}
	 */
	getWorldPosition(percentX, percentY, z = 0) {
		const { width, height } = this.getFrustumDimensions()
		return new THREE.Vector3(
			(percentX - 0.5) * width,
			(percentY - 0.5) * height,
			z
		)
	}

	/**
	 * Get responsive scale factor based on aspect ratio
	 * Useful for scaling objects on narrow/portrait screens
	 * @param {number} [baseScale=1] - Base scale for standard aspect ratio
	 * @returns {number}
	 */
	getResponsiveScale(baseScale = 1) {
		const aspect = this.camera.aspect
		if (aspect < 0.6) return baseScale * 0.5       // Very narrow/portrait
		if (aspect < 0.8) return baseScale * 0.65      // Portrait
		if (aspect < 1.0) return baseScale * 0.8       // Slightly portrait
		if (aspect > 2.5) return baseScale * 0.85      // Ultra-wide
		return baseScale                               // Normal range
	}

	/**
	 * Get the current aspect ratio
	 * @returns {number}
	 */
	getAspectRatio() {
		return this.camera.aspect
	}

	/**
	 * Check if viewport is in portrait orientation
	 * @returns {boolean}
	 */
	isPortrait() {
		return this.camera.aspect < 1
	}

	/**
	 * Calculate evenly spaced positions along horizontal axis
	 * @param {number} count - Number of items to space
	 * @param {number} [marginPercent=0.1] - Margin from edges (0-0.5)
	 * @param {number} [y=0.5] - Y position as percentage (0-1)
	 * @returns {THREE.Vector3[]}
	 */
	getHorizontalSpacing(count, marginPercent = 0.1, y = 0.5) {
		const positions = []
		const startX = marginPercent
		const endX = 1 - marginPercent
		const range = endX - startX

		for (let i = 0; i < count; i++) {
			const percentX = count === 1
				? 0.5
				: startX + (i / (count - 1)) * range
			positions.push(this.getWorldPosition(percentX, y))
		}
		return positions
	}

	/**
	 * Calculate maximum item width that fits count items with spacing
	 * @param {number} count - Number of items
	 * @param {number} [marginPercent=0.1] - Margin from edges
	 * @param {number} [gapPercent=0.02] - Gap between items
	 * @returns {number} - Maximum width in world units
	 */
	getMaxItemWidth(count, marginPercent = 0.1, gapPercent = 0.02) {
		const { width } = this.getFrustumDimensions()
		const usableWidth = width * (1 - 2 * marginPercent)
		const totalGapWidth = width * gapPercent * (count - 1)
		return (usableWidth - totalGapWidth) / count
	}

	/**
	 * Notify that viewport has changed - refreshes cached calculations
	 */
	onResize() {
		this._updateCache()
	}
}
