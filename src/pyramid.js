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
	initialPyramidState,
	isOrcSceneActive,
	morphToOrcScene,
	morphFromOrcScene,
	initRoamingHand,
	scheduleHandEntry,
	cancelHandEntry,
	triggerHandPageTransition,
	getCurrentHandPage,
	Contact,
}

Contact.initContactLabel()

let activeLabelManager = null
export function setLabelManager(lm) {
	activeLabelManager = lm
	// Labels are already attached to pyramidGroup by LabelManager.createLabels()
	// Just trigger initial layout update
	if (activeLabelManager) {
		activeLabelManager.updateNavLayout()
	}
}

// Layout manager for responsive 3D positioning
export const layoutManager = new LayoutManager(camera)

camera.position.set(0, -0.36, 6)
controls.target.set(0, -0.36, 0)
controls.update()
setInitialCameraState(camera.position, new THREE.Vector3(0, -0.36, 0))

scene.add(pyramidGroup)

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

// Update nav layout based on screen size - delegates to LabelManager
function updateNavLayout() {
	if (activeLabelManager) {
		activeLabelManager.updateNavLayout()
		navLabelScale = activeLabelManager.getNavLabelScale()
	}
}

// === ORC Scene / Morph Functions ===

function morphToOrcScene() {
	incrementPyramidAnimToken()
	hideAllPlanes()

	// Start ORC Demo first so isActive is true for layout calculations
	OrcDemoManager.start()

	// Update layout now that ORC is active (affects margins for sidebar)
	updateNavLayout()

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

	// Position labels AFTER layout update so they use ORC-adjusted positions
	const labels = activeLabelManager ? activeLabelManager.labels : {}
	for (const key in labels) {
		const labelMesh = labels[key]
		if (!labelMesh) continue

		const flatPos = activeLabelManager.getNavPosition(key)
		if (flatPos) {
			if (labelMesh.parent !== scene) {
				scene.add(labelMesh)
			}
			labelMesh.position.set(flatPos.x, flatPos.y, flatPos.z)
			labelMesh.rotation.set(0, 0, 0)
			labelMesh.scale.set(1, 1, 1)
			labelMesh.visible = true // Make visible (including Home label)
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

	// Keep hover targets synchronized with labels (they're in scene, not pyramidGroup children)
	if (activeLabelManager) {
		activeLabelManager.syncHoverTargets()
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

	// If in nav mode, update positions immediately
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
				label.scale.set(navLabelScale, navLabelScale, 1)
			}
		}
		// Update pyramid position to match new layout
		pyramidGroup.position.y = flattenedMenuState.positionY - 50
		if (
			getCurrentSection() &&
			pyramidXPositions[getCurrentSection()] !== undefined
		) {
			pyramidGroup.position.x = pyramidXPositions[getCurrentSection()]
		}
	}
})
