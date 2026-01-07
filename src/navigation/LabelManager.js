import * as THREE from "three"
import { makeLabelPlane } from "../planes.js"
import { screenToWorld } from "../core/SceneManager.js"
import {
	flattenedLabelPositions,
	flattenedMenuState,
	pyramidXPositions,
} from "../pyramid/state.js"

// Label configurations with positions on pyramid faces
const labelConfigs = {
	About: {
		text: "About",
		position: { x: -1.0, y: 0.04, z: 0.53 },
		rotation: { x: -0.1, y: 0.438, z: 1 },
		size: [2.4, 0.6],
	},
	Portfolio: {
		text: "Portfolio",
		position: { x: 1.02, y: 0, z: 0.6 },
		rotation: { x: 0.1, y: -0.6, z: -0.95 },
		size: [2.4, 0.6],
	},
	Blog: {
		text: "Blog",
		position: { x: 0, y: -1.7, z: 1.0 },
		rotation: { x: 0, y: 0, z: 0 },
		size: [2.4, 0.6],
	},
	Home: {
		text: "Home",
		position: { x: 0, y: 1.7, z: 0 }, // Above apex
		rotation: { x: 0, y: 0, z: 0 },
		size: [2.4, 0.6],
	},
	Contact: {
		text: "Contact",
		position: { x: 0, y: -1.8, z: 0.8 }, // Below pyramid (hidden initially)
		rotation: { x: -0.3, y: 0, z: 0 },
		size: [2.4, 0.6],
	},
}

export class LabelManager {
	constructor(scene, layoutManager, pyramidGroup) {
		this.scene = scene
		this.layoutManager = layoutManager
		this.pyramidGroup = pyramidGroup
		this.labels = {}
		this.hoverTargets = {}
		this.navLabelScale = 1.0

		this.handleLayoutChange = this.handleLayoutChange.bind(this)
		window.addEventListener("layoutChange", this.handleLayoutChange)
		window.addEventListener("resize", () => this.updateNavLayout())
	}

	createLabels() {
		for (const key in labelConfigs) {
			const cfg = labelConfigs[key]
			const mesh = makeLabelPlane(cfg.text, ...cfg.size)
			mesh.position.set(cfg.position.x, cfg.position.y, cfg.position.z)
			mesh.rotation.set(cfg.rotation.x, cfg.rotation.y, cfg.rotation.z)

			// Store original position/rotation for return animation
			mesh.userData.origPosition = mesh.position.clone()
			mesh.userData.origRotation = mesh.rotation.clone()
			mesh.userData.originalScale = mesh.scale.clone()
			mesh.userData.name = key
			mesh.name = `label-${key}`
			mesh.cursor = "pointer"

			this.pyramidGroup.add(mesh)
			this.labels[key] = mesh

			// Create larger invisible hover target for better click detection
			const hoverWidth = cfg.size[0] * 0.8
			const hoverHeight = cfg.size[1] * 1.0
			const hoverGeo = new THREE.PlaneGeometry(hoverWidth, hoverHeight)
			const hoverMat = new THREE.MeshBasicMaterial({
				transparent: true,
				opacity: 0,
			})
			const hover = new THREE.Mesh(hoverGeo, hoverMat)
			hover.position.set(0, 0.05, 0.01) // Local offset
			hover.userData.labelKey = key
			hover.name = `${key}_hover`
			mesh.add(hover) // Parent to label so it moves with it
			this.hoverTargets[key] = hover
		}

		// Hide Home and Contact labels initially (visible in top nav)
		if (this.labels.Home) this.labels.Home.visible = false
		if (this.labels.Contact) this.labels.Contact.visible = false

		// Initialize nav layout
		this.updateNavLayout()
	}

	updateNavLayout() {
		const { width, height } = this.layoutManager.getFrustumDimensions()

		// Position Y: 35% of height (approx 70% up from center)
		const navY = height * 0.35
		const availableWorldWidth = width * 0.9 // 90% of width

		const keys = ["Home", "Contact", "About", "Blog", "Portfolio"]

		const labelWidth = 2.4
		const spacing = 0.1
		const totalStaticWidth =
			keys.length * labelWidth + (keys.length - 1) * spacing

		this.navLabelScale = 1.0
		if (totalStaticWidth > availableWorldWidth) {
			this.navLabelScale = availableWorldWidth / totalStaticWidth
		}

		const scaledLabelWidth = labelWidth * this.navLabelScale
		const scaledSpacing = spacing * this.navLabelScale

		keys.forEach((key, i) => {
			// Ensure position object exists
			if (!flattenedLabelPositions[key]) {
				flattenedLabelPositions[key] = new THREE.Vector3()
			}

			// Center the group of labels
			const totalGroupWidth =
				keys.length * scaledLabelWidth + (keys.length - 1) * scaledSpacing
			const startX = -totalGroupWidth / 2 + scaledLabelWidth / 2

			flattenedLabelPositions[key].x =
				startX + i * (scaledLabelWidth + scaledSpacing)
			flattenedLabelPositions[key].y = navY
			flattenedLabelPositions[key].z = 1.0
		})

		// Update pyramid positions to match new label positions
		if (flattenedLabelPositions.About)
			pyramidXPositions.about = flattenedLabelPositions.About.x
		if (flattenedLabelPositions.About)
			pyramidXPositions.bio = flattenedLabelPositions.About.x
		if (flattenedLabelPositions.Blog)
			pyramidXPositions.blog = flattenedLabelPositions.Blog.x
		if (flattenedLabelPositions.Portfolio)
			pyramidXPositions.portfolio = flattenedLabelPositions.Portfolio.x

		// Update flattened pyramid Y position to be just below labels
		flattenedMenuState.positionY = navY - 0.3 * this.navLabelScale
	}

	handleLayoutChange() {
		this.updateNavLayout()
	}

	getLabel(id) {
		// Support both "About" and "about" style lookups
		const normalizedId = id.charAt(0).toUpperCase() + id.slice(1).toLowerCase()
		return this.labels[normalizedId] || this.labels[id]
	}

	getLabels() {
		return this.labels
	}

	getHoverTargets() {
		return this.hoverTargets
	}

	getNavPosition(id) {
		const normalizedId = id.charAt(0).toUpperCase() + id.slice(1).toLowerCase()
		const pos =
			flattenedLabelPositions[normalizedId] || flattenedLabelPositions[id]
		if (pos) {
			return new THREE.Vector3(pos.x, pos.y, pos.z)
		}
		return null
	}

	getNavLabelScale() {
		return this.navLabelScale
	}

	showHomeLabel() {
		if (this.labels.Home) {
			this.labels.Home.visible = true
		}
		if (this.labels.Contact) {
			this.labels.Contact.visible = true
		}
	}

	hideHomeLabel() {
		if (this.labels.Home) {
			this.labels.Home.visible = false
		}
		if (this.labels.Contact) {
			this.labels.Contact.visible = false
		}
	}

	dispose() {
		window.removeEventListener("layoutChange", this.handleLayoutChange)

		// Clean up label meshes
		Object.values(this.labels).forEach((mesh) => {
			if (mesh.geometry) mesh.geometry.dispose()
			if (mesh.material) {
				if (mesh.material.map) mesh.material.map.dispose()
				mesh.material.dispose()
			}
		})

		// Clean up hover targets
		Object.values(this.hoverTargets).forEach((mesh) => {
			if (mesh.geometry) mesh.geometry.dispose()
			if (mesh.material) mesh.material.dispose()
		})

		this.labels = {}
		this.hoverTargets = {}
	}
}
