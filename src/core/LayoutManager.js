import * as THREE from "three"

export class LayoutManager {
	constructor(camera) {
		this.camera = camera
		this.width = 0
		this.height = 0
		this.updateDimensions()
	}

	onResize() {
		this.updateDimensions()
		window.dispatchEvent(new Event("layoutChange"))
	}

	updateDimensions() {
		if (!this.camera) return
		const dist = this.camera.position.z || 6
		const vFov = (this.camera.fov * Math.PI) / 180
		this.height = 2 * Math.tan(vFov / 2) * dist
		this.width = this.height * this.camera.aspect
	}

	getFrustumDimensions() {
		return { width: this.width, height: this.height }
	}

	isPortrait() {
		return this.width < this.height
	}
}
