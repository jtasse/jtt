import * as THREE from "three"
import { makeLabelPlane } from "../planes.js"
import { screenToWorld } from "../core/SceneManager.js"
import {
	flattenedLabelPositions,
	flattenedMenuState,
	pyramidXPositions,
} from "../pyramid/state.js"
import { OrcDemoManager } from "../content/orc-demo/OrcDemoManager.js"

// Label configurations with positions on pyramid faces
const labelConfigs = {
	About: {
		text: "About",
		position: { x: -1.0, y: 0.04, z: 0.53 },
		rotation: { x: -0.1, y: 0.438, z: 1 },
		size: [3.0, 0.75],
	},
	Portfolio: {
		text: "Portfolio",
		position: { x: 1.02, y: 0, z: 0.6 },
		rotation: { x: 0.1, y: -0.6, z: -0.95 },
		size: [3.0, 0.75],
	},
	Blog: {
		text: "Blog",
		position: { x: 0, y: -1.7, z: 1.0 },
		rotation: { x: 0, y: 0, z: 0 },
		size: [3.0, 0.75],
	},
	Home: {
		text: "Home",
		position: { x: 0, y: 1.7, z: 0 }, // Above apex
		rotation: { x: 0, y: 0, z: 0 },
		size: [3.0, 0.75],
	},
	Contact: {
		text: "Contact",
		position: { x: 0, y: -1.8, z: 0.8 }, // Below pyramid (hidden initially)
		rotation: { x: -0.3, y: 0, z: 0 },
		size: [3.0, 0.75],
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
			// Added to SCENE directly (not as child of label) - synchronized in animate loop
			const hoverWidth = cfg.size[0] * 0.8
			const hoverHeight = cfg.size[1] * 1.0
			const hoverGeo = new THREE.PlaneGeometry(hoverWidth, hoverHeight)
			const hoverMat = new THREE.MeshBasicMaterial({
				transparent: true,
				opacity: 0,
				side: THREE.DoubleSide,
			})
			const hover = new THREE.Mesh(hoverGeo, hoverMat)
			// Initial position matches label (will be synced in animate loop)
			hover.position.copy(mesh.position).add(new THREE.Vector3(0, 0.05, 0.08))
			hover.rotation.copy(mesh.rotation)
			hover.userData.labelKey = key
			hover.name = `${key}_hover`
			this.scene.add(hover) // Add to scene, not as child of label
			this.hoverTargets[key] = hover
			hover.updateMatrixWorld()
		}

		// Hide Home and Contact labels initially (visible in top nav)
		// Also hide their hover targets to prevent click interference
		if (this.labels.Home) {
			this.labels.Home.visible = false
			if (this.hoverTargets.Home) this.hoverTargets.Home.visible = false
		}
		if (this.labels.Contact) {
			this.labels.Contact.visible = false
			if (this.hoverTargets.Contact) this.hoverTargets.Contact.visible = false
		}

		// Initialize nav layout
		this.updateNavLayout()
	}

	updateNavLayout() {
		// Match reference code positioning exactly
		const startPixelX = 30
		const startPixelY = 30
		const topLeft = screenToWorld(startPixelX, startPixelY, 0)

		// Fallback if screenToWorld fails (e.g. camera not ready)
		if (!topLeft) return

		const keys = ["Home", "Contact", "About", "Blog", "Portfolio"]

		// Calculate right edge, accounting for ORC demo sidebar
		const rightMarginPx = OrcDemoManager.isActive ? 350 : 50
		const rightEdgePixel = window.innerWidth - rightMarginPx
		const worldRightEdge = screenToWorld(rightEdgePixel, startPixelY, 0)
		if (!worldRightEdge) return

		const availableWorldWidth = worldRightEdge.x - topLeft.x

		// Use reference code values for label sizing
		const labelWidth = 2.4
		const spacing = 0.1
		const totalStaticWidth =
			keys.length * labelWidth + (keys.length - 1) * spacing

		// Calculate scale if labels don't fit
		this.navLabelScale = 1.0
		if (totalStaticWidth > availableWorldWidth) {
			this.navLabelScale = availableWorldWidth / totalStaticWidth
		}

		const scaledLabelWidth = labelWidth * this.navLabelScale
		const scaledSpacing = spacing * this.navLabelScale

		// Position each label
		keys.forEach((key, i) => {
			if (!flattenedLabelPositions[key]) {
				flattenedLabelPositions[key] = { x: 0, y: 0, z: 0 }
			}
			flattenedLabelPositions[key].x =
				topLeft.x +
				scaledLabelWidth / 2 +
				i * (scaledLabelWidth + scaledSpacing)
			flattenedLabelPositions[key].y = topLeft.y
			flattenedLabelPositions[key].z = 0
		})

		// Update pyramid X positions to match label centers exactly
		if (flattenedLabelPositions.Home)
			pyramidXPositions.home = flattenedLabelPositions.Home.x
		if (flattenedLabelPositions.Contact)
			pyramidXPositions.contact = flattenedLabelPositions.Contact.x
		if (flattenedLabelPositions.About)
			pyramidXPositions.about = flattenedLabelPositions.About.x
		if (flattenedLabelPositions.About)
			pyramidXPositions.bio = flattenedLabelPositions.About.x
		if (flattenedLabelPositions.Blog)
			pyramidXPositions.blog = flattenedLabelPositions.Blog.x
		if (flattenedLabelPositions.Portfolio)
			pyramidXPositions.portfolio = flattenedLabelPositions.Portfolio.x

		// Update flattened pyramid Y position to be just below labels
		flattenedMenuState.positionY = topLeft.y - 0.5 * this.navLabelScale
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
			if (this.hoverTargets.Home) this.hoverTargets.Home.visible = true
		}
		if (this.labels.Contact) {
			this.labels.Contact.visible = true
			if (this.hoverTargets.Contact) this.hoverTargets.Contact.visible = true
		}
	}

	hideHomeLabel() {
		if (this.labels.Home) {
			this.labels.Home.visible = false
			if (this.hoverTargets.Home) this.hoverTargets.Home.visible = false
		}
		if (this.labels.Contact) {
			this.labels.Contact.visible = false
			if (this.hoverTargets.Contact) this.hoverTargets.Contact.visible = false
		}
	}

	// Synchronize hover targets with their labels (called from animate loop)
	// Hover targets are in scene space, labels may be in pyramidGroup or scene
	syncHoverTargets() {
		for (const key in this.labels) {
			const label = this.labels[key]
			const hover = this.hoverTargets[key]
			if (label && hover) {
				// Ensure label's world matrix is up to date (works whether in pyramidGroup or scene)
				label.updateWorldMatrix(true, true)

				// Get label's world position
				const labelWorldPos = new THREE.Vector3()
				label.getWorldPosition(labelWorldPos)

				// Position hover target in front of label (0.08 units on label's Z-axis in world space)
				const worldQuaternion = new THREE.Quaternion()
				label.getWorldQuaternion(worldQuaternion)
				const offset = new THREE.Vector3(0, 0, 0.08)
				offset.applyQuaternion(worldQuaternion)
				hover.position.copy(labelWorldPos).add(offset)

				// Match label's world rotation
				hover.quaternion.copy(worldQuaternion)

				// Scale hover target based on label's world scale
				const s = new THREE.Vector3()
				label.getWorldScale(s)
				hover.scale.copy(s)

				// Ensure hover target visibility matches label visibility
				hover.visible = label.visible

				// Update hover target's world matrix immediately so raycasting works
				hover.updateMatrixWorld()
			}
		}
	}
}
