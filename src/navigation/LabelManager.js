import * as THREE from "three"
import { makeLabelPlane } from "../planes.js"

export class LabelManager {
	constructor(scene, layoutManager) {
		this.scene = scene
		this.layoutManager = layoutManager
		this.labels = {}
		this.navPositions = {}

		// Group to hold labels.
		// Note: If labels are initially attached to the pyramid, they might need to be
		// re-parented to this group during the transition to navigation state.
		this.group = new THREE.Group()
		this.scene.add(this.group)

		this.handleLayoutChange = this.handleLayoutChange.bind(this)
		window.addEventListener("layoutChange", this.handleLayoutChange)
	}

	createLabels() {
		// Core sections as defined in project overview
		const labelData = [
			{ id: "home", text: "Home" },
			{ id: "contact", text: "Contact" },
			{ id: "bio", text: "Bio" },
			{ id: "portfolio", text: "Portfolio" },
			{ id: "blog", text: "Blog" },
		]

		labelData.forEach((data) => {
			const mesh = makeLabelPlane(data.text)
			mesh.name = `label-${data.id}`
			mesh.userData = {
				id: data.id,
				name: data.text, // Match main.js expectation
				isLabel: true,
			}

			// Home is hidden initially
			if (data.id === "home") mesh.visible = false

			this.labels[data.id] = mesh
			this.group.add(mesh)
		})

		this.updateNavLayout()
	}

	updateNavLayout() {
		const { width, height } = this.layoutManager.getFrustumDimensions()
		const labelKeys = Object.keys(this.labels)
		const count = labelKeys.length

		// Calculate spacing for top navigation
		// Spread them out across the top, but cap the spacing so they don't get too far apart on wide screens
		const spacing = Math.min(width / (count + 1), 2.5)
		const startX = (-spacing * (count - 1)) / 2

		// Position near the top of the screen (0.4 * height is 90% up from center relative to full height)
		const topY = height * 0.4

		labelKeys.forEach((key, index) => {
			const x = startX + index * spacing
			this.navPositions[key] = new THREE.Vector3(x, topY, 0)
		})
	}

	handleLayoutChange() {
		this.updateNavLayout()
		// Future: If currently in nav state, trigger animation update here
	}

	getLabel(id) {
		return this.labels[id]
	}

	getLabels() {
		return this.labels
	}

	getNavPosition(id) {
		return this.navPositions[id]
	}

	showHomeLabel() {
		if (this.labels.home) {
			this.labels.home.visible = true
		}
	}

	dispose() {
		window.removeEventListener("layoutChange", this.handleLayoutChange)
		this.scene.remove(this.group)

		// Clean up meshes
		Object.values(this.labels).forEach((mesh) => {
			if (mesh.geometry) mesh.geometry.dispose()
			if (mesh.material) {
				if (mesh.material.map) mesh.material.map.dispose()
				mesh.material.dispose()
			}
		})
		this.labels = {}
	}
}
