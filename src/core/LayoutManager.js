import * as THREE from "three"

export class LayoutManager {
	constructor(camera) {
		this.camera = camera
		this.onResize = this.onResize.bind(this)
		window.addEventListener("resize", this.onResize)
	}

	getFrustumDimensions() {
		const distance = this.camera.position.z
		const vFov = (this.camera.fov * Math.PI) / 180
		const height = 2 * Math.tan(vFov / 2) * distance
		const width = height * this.camera.aspect
		return { width, height }
	}

	/**
	 * Get world position from viewport percentage
	 * @param {number} percentX - 0.0 (left) to 1.0 (right)
	 * @param {number} percentY - 0.0 (bottom) to 1.0 (top)
	 * @returns {THREE.Vector3}
	 */
	getWorldPosition(percentX, percentY) {
		const { width, height } = this.getFrustumDimensions()
		return new THREE.Vector3(
			(percentX - 0.5) * width,
			(percentY - 0.5) * height,
			0
		)
	}

	// Get scale factor for current aspect ratio
	getResponsiveScale(baseScale = 1) {
		const aspect = this.camera.aspect
		if (aspect < 0.75) return baseScale * 0.6 // Very portrait
		if (aspect < 1.0) return baseScale * 0.8 // Portrait
		if (aspect > 2.0) return baseScale * 0.9 // Ultrawide
		return baseScale
	}

	isPortrait() {
		return this.camera.aspect < 1.0
	}

	onResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight
		this.camera.updateProjectionMatrix()
		// Dispatch event for other systems to respond
		window.dispatchEvent(
			new CustomEvent("layoutChange", {
				detail: this.getFrustumDimensions(),
			})
		)
	}

	dispose() {
		window.removeEventListener("resize", this.onResize)
	}
}
