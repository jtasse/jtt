import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { LayoutManager } from "./core/LayoutManager.js"
import {
	scene,
	camera,
	renderer,
	controls,
	stars,
	screenToWorld,
} from "./core/SceneManager.js"
import {
	pyramidGroup,
	initialPyramidState,
	flattenedMenuState,
	pyramidXPositions,
	getCurrentSection,
	setCurrentSection,
	getPyramidAnimToken,
	incrementPyramidAnimToken,
	initialCameraState,
	setInitialCameraState,
} from "./pyramid/state.js"
import {
	animatePyramid,
	spinPyramidToSection,
	resetPyramidToHome,
} from "./pyramid/animations.js"
import {
	showAboutPlane,
	showPortfolioPlane,
	showBlogPlane,
	hideAllPlanes,
} from "./content/ContentManager.js"
import * as Contact from "./contact/ContactLabel.js"
import "./content/home/home.css"
import "./content/about/about.css"
import "./content/blog/blog.css"
import "./content/portfolio/portfolio.css"
import "./content/orc-demo/orc-demo.css"
import "./content/overlay.css"
import {
	initRoamingHand,
	getRoamingHand,
	updateHandIdleMotion,
	scheduleHandEntry,
	cancelHandEntry,
	triggerHandPageTransition,
	getCurrentHandPage,
	setCurrentHandPage,
} from "./hand/HandManager.js"
import { OrcDemoManager } from "./content/orc-demo/OrcDemoManager.js"
import { ScrollManager } from "./content/ScrollManager.js"

// Re-export core scene elements for main.js
export {
	scene,
	camera,
	renderer,
	controls,
	screenToWorld,
	animatePyramid,
	spinPyramidToSection,
	resetPyramidToHome,
	showAboutPlane,
	showPortfolioPlane,
	showBlogPlane,
	hideAllPlanes,
	pyramidGroup,
	isOrcSceneActive,
	morphToOrcScene,
	morphFromOrcScene,
	initRoamingHand,
	scheduleHandEntry,
	cancelHandEntry,
	triggerHandPageTransition,
	getCurrentHandPage,
}

Contact.initContactLabel()

let activeLabelManager = null
export function setLabelManager(lm) {
	activeLabelManager = lm
	setupPyramidLabels()
}

// Layout manager for responsive 3D positioning
export const layoutManager = new LayoutManager(camera)

setInitialCameraState(camera.position, new THREE.Vector3(0, 0, 0))

scene.add(pyramidGroup)

// Initial setup to attach labels to pyramid faces
function setupPyramidLabels() {
	if (!activeLabelManager || !pyramidGroup) return

	const labels = activeLabelManager.getLabels()

	// Configuration for placing labels on pyramid faces (3-sided)
	const placements = [
		{ id: "bio", angle: 0 }, // Front
		{ id: "portfolio", angle: (Math.PI * 2) / 3 }, // Left (120 deg)
		{ id: "blog", angle: -(Math.PI * 2) / 3 }, // Right (-120 deg)
	]

	placements.forEach((p) => {
		const label = labels[p.id]
		if (label) {
			// Attach to pyramid group so they rotate with it
			pyramidGroup.add(label)

			// Calculate position on face
			const radius = 1.1 // Distance from center
			const y = -0.2 // Vertical position

			label.position.set(
				Math.sin(p.angle) * radius,
				y,
				Math.cos(p.angle) * radius
			)

			// Rotation: Face outward + tilt back to match pyramid slope
			label.rotation.set(-0.35, p.angle, 0, "YXZ")

			// Save original state for resets
			label.userData.origPosition = label.position.clone()
			label.userData.origRotation = label.rotation.clone()
			label.userData.originalScale = label.scale.clone()
		}
	})
}

// === Morph Sphere (for ORC demo transition) ===
const morphSphereGeometry = new THREE.SphereGeometry(1.5, 32, 32)
const morphSphereMaterial = new THREE.MeshStandardMaterial({
	color: 0x000000,
	metalness: 0.95,
	roughness: 0.1,
	side: THREE.DoubleSide,
	transparent: true,
	opacity: 0,
})
export const morphSphere = new THREE.Mesh(
	morphSphereGeometry,
	morphSphereMaterial
)
morphSphere.visible = false
morphSphere.name = "morphSphere"
scene.add(morphSphere)

// Create a WebGLCubeRenderTarget + CubeCamera to generate an environment map for reflections
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(512, {
	format: THREE.RGBAFormat,
	generateMipmaps: true,
	minFilter: THREE.LinearMipmapLinearFilter,
	magFilter: THREE.LinearFilter,
	type: THREE.FloatType,
})
const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget)
scene.add(cubeCamera)

function updatePyramidEnvMap() {
	const meshes = pyramidGroup.children.filter((c) => c.isMesh)
	meshes.forEach((m) => (m.visible = false))

	cubeCamera.position.copy(pyramidGroup.position)
	cubeCamera.update(renderer, scene)

	meshes.forEach((m) => {
		m.visible = true
		if (cubeCamera.renderTarget && cubeCamera.renderTarget.texture) {
			m.material.envMap = cubeCamera.renderTarget.texture
			m.material.envMapIntensity = 0
			m.material.needsUpdate = true
		}
	})
}

updatePyramidEnvMap()

let navLabelScale = 1.0

// Update nav layout based on screen size using LayoutManager for responsive positioning
function updateNavLayout() {
	const keys = ["Home", "Contact", "About", "Blog", "Portfolio"]
	const { width, height } = layoutManager.getFrustumDimensions()

	const navY = height * 0.35

	const leftMarginPercent = 0.12
	const rightMarginPercent = OrcDemoManager.isActive ? 0.35 : 0.12
	const availableWidth = width * (1 - leftMarginPercent - rightMarginPercent)
	const startX = -width / 2 + width * leftMarginPercent

	const baseLabelWidth = 2.4
	const baseSpacing = 0.2
	const totalStaticWidth =
		keys.length * baseLabelWidth + (keys.length - 1) * baseSpacing

	navLabelScale = 1.0
	if (totalStaticWidth > availableWidth) {
		navLabelScale = availableWidth / totalStaticWidth
	}

	if (layoutManager.isPortrait()) {
		navLabelScale *= 0.85
	}

	const scaledLabelWidth = baseLabelWidth * navLabelScale
	const scaledSpacing = baseSpacing * navLabelScale

	keys.forEach((key, i) => {
		const x =
			startX + scaledLabelWidth / 2 + i * (scaledLabelWidth + scaledSpacing)

		if (key === "About") pyramidXPositions.about = x
		if (key === "About") pyramidXPositions.bio = x
		if (key === "Blog") pyramidXPositions.blog = x
		if (key === "Portfolio") pyramidXPositions.portfolio = x
	})

	if (activeLabelManager) {
		activeLabelManager.updateNavLayout()
	}

	flattenedMenuState.positionY = navY - 0.3 * navLabelScale
}

// === ORC Scene / Morph Functions ===

function morphToOrcScene() {
	incrementPyramidAnimToken()
	hideAllPlanes()

	// Set active flag early to influence layout calculations
	// OrcDemoManager.isActive will be set in start(), but we need to update layout first
	// Actually we can just start it, then update layout

	// Show pyramid in flattened state under Portfolio label
	pyramidGroup.visible = true
	pyramidGroup.position.x = pyramidXPositions.portfolio
	pyramidGroup.position.y = flattenedMenuState.positionY
	pyramidGroup.scale.set(
		flattenedMenuState.scale,
		flattenedMenuState.scaleY,
		flattenedMenuState.scaleZ
	)
	pyramidGroup.rotation.x = flattenedMenuState.rotationX

	const labels = activeLabelManager ? activeLabelManager.labels : {}
	for (const key in labels) {
		const labelMesh = labels[key]
		if (!labelMesh) continue

		const flatPos = activeLabelManager.getNavPosition(key)
		if (flatPos) {
			if (labelMesh.parent !== scene) {
				scene.add(labelMesh)
			}
			labelMesh.position.set(flatPos.x, flatPos.y, 1)
			labelMesh.rotation.set(0, 0, 0)
			labelMesh.scale.set(1, 1, 1)
			labelMesh.userData.fixedNav = true
			if (labelMesh.material) {
				labelMesh.material.opacity = 1
			}
		}
	}

	morphSphere.visible = false

	// Remove hand from main scene before creating ORC demo
	const roamingHand = getRoamingHand()
	if (roamingHand && roamingHand.parent === scene) {
		scene.remove(roamingHand)
	}

	// Start ORC Demo
	OrcDemoManager.start()

	// Update layout now that ORC is active (affects margins)
	updateNavLayout()

	controls.enabled = false
}

function morphFromOrcScene() {
	const myToken = incrementPyramidAnimToken()
	const endCamPos = initialCameraState.position.clone()
	const fadeOutDuration = 500
	const fadeInDuration = 800

	// Fade out handled by OrcDemoManager internally or we can do it here if we had access to container
	// OrcDemoManager.stop() handles cleanup but not the fade animation of the container itself
	// because we don't have access to the container here anymore.
	// However, we can just stop it after a delay.

	// We need to trigger the fade out on the DOM elements.
	const container = document.getElementById("orc-demo-container")
	if (container) {
		container.style.transition = `opacity ${fadeOutDuration}ms ease-out`
		container.style.opacity = "0"
	}
	const infoPane = document.getElementById("orc-info-pane")
	if (infoPane) {
		infoPane.style.transition = `opacity ${fadeOutDuration}ms ease-out`
		infoPane.style.opacity = "0"
	}

	setTimeout(() => {
		if (myToken !== getPyramidAnimToken()) return

		const hand = OrcDemoManager.stop()

		if (hand) {
			hand.position.set(10, 0, -2)
			scene.add(hand)
			setCurrentHandPage("orc-demo")
		}

		pyramidGroup.visible = true
		pyramidGroup.position.x = initialPyramidState.positionX
		pyramidGroup.position.y = initialPyramidState.positionY
		pyramidGroup.rotation.x = 0
		pyramidGroup.rotation.y = initialPyramidState.rotationY
		pyramidGroup.rotation.z = 0
		pyramidGroup.scale.set(
			initialPyramidState.scale,
			initialPyramidState.scale,
			initialPyramidState.scale
		)

		const labels = activeLabelManager ? activeLabelManager.labels : {}

		pyramidGroup.children.forEach((child) => {
			if (
				child.isMesh &&
				child.material &&
				!Object.values(labels).includes(child)
			) {
				child.material.opacity = 0
				child.material.transparent = true
			}
		})

		Object.values(labels).forEach((label) => {
			if (label.material) {
				label.material.opacity = 0
			}
		})

		camera.position.copy(endCamPos)
		camera.lookAt(initialCameraState.target)
		controls.target.copy(initialCameraState.target)
		controls.enabled = true
		controls.update()

		updateNavLayout()
		setCurrentSection(null)
		morphSphere.visible = false

		const startTime = performance.now()

		function fadeInStep(time) {
			if (myToken !== getPyramidAnimToken()) return

			const t = Math.min((time - startTime) / fadeInDuration, 1)
			const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

			pyramidGroup.children.forEach((child) => {
				if (
					child.isMesh &&
					child.material &&
					!Object.values(labels).includes(child)
				) {
					child.material.opacity = eased
				}
			})

			Object.values(labels).forEach((label) => {
				if (label.material) {
					label.material.opacity = eased
				}
			})

			if (t < 1) {
				requestAnimationFrame(fadeInStep)
			} else {
				if (myToken !== getPyramidAnimToken()) return

				pyramidGroup.children.forEach((child) => {
					if (
						child.isMesh &&
						child.material &&
						!Object.values(labels).includes(child)
					) {
						child.material.opacity = 1
						child.material.transparent = false
					}
				})

				const finalLabels = activeLabelManager ? activeLabelManager.labels : {}
				for (const key in finalLabels) {
					const labelMesh = finalLabels[key]
					if (!labelMesh) continue
					if (labelMesh.material) labelMesh.material.opacity = 1

					labelMesh.userData.fixedNav = false

					if (labelMesh.parent !== pyramidGroup) {
						pyramidGroup.add(labelMesh)
					}

					const origPos = labelMesh.userData.origPosition
					const origRot = labelMesh.userData.origRotation
					const origScale = labelMesh.userData.originalScale
					if (origPos) labelMesh.position.copy(origPos)
					if (origRot) labelMesh.rotation.copy(origRot)
					if (origScale) labelMesh.scale.copy(origScale)
				}
			}
		}

		requestAnimationFrame(fadeInStep)
	}, fadeOutDuration)
}

function isOrcSceneActive() {
	return OrcDemoManager.isActive
}

// === Animate Loop ===
export function animate() {
	requestAnimationFrame(animate)
	stars.rotation.y += 0.0008

	updateHandIdleMotion(OrcDemoManager.isActive)

	if (controls.enabled) {
		controls.update()
	}

	ScrollManager.update()
	renderer.render(scene, camera)
}

// === Resize ===
window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)

	layoutManager.onResize()

	// ORC demo resize handled by its own internal logic if we exposed it,
	// but currently it's inside OrcDemoManager.
	// We should probably add a resize method to OrcDemoManager if needed,
	// but the container uses CSS so it might be fine or need a refresh.
	// For now, let's assume it handles itself or we add a method later.
	if (OrcDemoManager.isActive) {
		OrcDemoManager.onResize()
	}

	const aboutPlane = scene.getObjectByName("aboutPlane")
	if (aboutPlane) scene.remove(aboutPlane)
	const portfolioPlane = scene.getObjectByName("portfolioPlane")
	if (portfolioPlane) scene.remove(portfolioPlane)

	updateNavLayout()

	if (pyramidGroup.position.y > 1.0) {
		const labels = activeLabelManager ? activeLabelManager.labels : {}
		for (const key in labels) {
			const label = labels[key]
			const flatPos = activeLabelManager
				? activeLabelManager.getNavPosition(key)
				: null
			if (label && flatPos) {
				label.position.x = flatPos.x
				label.position.y = flatPos.y
				label.position.z = 1
				label.scale.set(navLabelScale, navLabelScale, 1)
			}
		}
		pyramidGroup.position.y = flattenedMenuState.positionY
		if (
			getCurrentSection() &&
			pyramidXPositions[getCurrentSection()] !== undefined
		) {
			pyramidGroup.position.x = pyramidXPositions[getCurrentSection()]
		}
	}
})
