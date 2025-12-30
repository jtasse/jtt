import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { contentFiles } from "./constants.js"
import {
	makeAboutPlane,
	makePortfolioPlane,
	makeBlogPlane,
	makeContactLabelPlane,
} from "../planes.js"
import {
	loadContentHTML,
	parseAboutContent,
	parseBlogPosts,
} from "../contentLoader.js"
import {
	createOrcScene,
	animateOrcScene,
	satellites,
	startDecommission,
	disposeOrcScene,
	orcGroup,
	createOrcPreview,
	showGeoTether,
	hideGeoTether,
	getDecommissionState,
	getDecommissionConfig,
} from "../content/orc-demo/orc-demo.js"
import "../content/about/about.css"
import "../content/blog/blog.css"
import "../content/portfolio/portfolio.css"
import "../content/orc-demo/orc-demo.css"

export const pyramidGroup = new THREE.Group()
pyramidGroup.rotation.order = "YXZ"
export const labels = {}
export const hoverTargets = {}

// === Scene / Camera / Renderer ===
export const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)

export const camera = new THREE.PerspectiveCamera(
	50,
	window.innerWidth / window.innerHeight,
	0.1,
	2000
)
camera.position.set(0, 0, 6)
camera.lookAt(0, 0, 0)

// Store initial camera state for reset
const initialCameraState = {
	position: camera.position.clone(),
	target: new THREE.Vector3(0, 0, 0),
}

export const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.localClippingEnabled = true

export const controls = new OrbitControls(camera, renderer.domElement)
// Enable OrbitControls so user can click+drag to inspect the scene.
// Programmatic animations still run, but the user can rotate/zoom manually.
controls.enabled = true
controls.enableDamping = true
controls.enableRotate = true
controls.enableZoom = true
controls.enablePan = true
controls.autoRotate = false
controls.minDistance = 2.5
controls.maxDistance = 12
// Allow the user to look up/down reasonably but avoid flipping completely
controls.minPolarAngle = 0.1
controls.maxPolarAngle = Math.PI - 0.1

// === Lighting ===
scene.add(new THREE.AmbientLight(0xffffff, 0.6))
const key = new THREE.DirectionalLight(0xffffff, 0.8)
key.position.set(5, 8, 5)
scene.add(key)

// === Starfield ===
const starCount = 1500
const starGeo = new THREE.BufferGeometry()
const positions = new Float32Array(starCount * 3)
for (let i = 0; i < starCount; i++) {
	positions[i * 3 + 0] = (Math.random() - 0.5) * 800
	positions[i * 3 + 1] = (Math.random() - 0.5) * 800
	positions[i * 3 + 2] = (Math.random() - 0.5) * 800
}
starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.6 })
const stars = new THREE.Points(starGeo, starMat)
scene.add(stars)

// === Pyramid ===
const size = 3.375
const height = 3.025
const halfSize = size / 2
const triHeight = (Math.sqrt(3) / 2) * size
// Normal pyramid: base at bottom, apex at top
const apex = new THREE.Vector3(0, height / 2, 0)
const v1 = new THREE.Vector3(-halfSize, -height / 2, triHeight / 3)
const v2 = new THREE.Vector3(halfSize, -height / 2, triHeight / 3)
const v3 = new THREE.Vector3(0, -height / 2, (-2 * triHeight) / 3)

scene.add(pyramidGroup)

const faces = [
	{ name: "Blog", verts: [apex.clone(), v1.clone(), v2.clone()] },
	{ name: "Portfolio", verts: [apex.clone(), v2.clone(), v3.clone()] },
	{ name: "About", verts: [apex.clone(), v3.clone(), v1.clone()] },
]

faces.forEach((f) => {
	const geom = new THREE.BufferGeometry()
	geom.setAttribute(
		"position",
		new THREE.BufferAttribute(
			new Float32Array(f.verts.flatMap((v) => [v.x, v.y, v.z])),
			3
		)
	)
	geom.computeVertexNormals()

	const mat = new THREE.MeshStandardMaterial({
		color: 0x000000,
		metalness: 0.95,
		roughness: 0.1,
		side: THREE.DoubleSide,
		transparent: false,
		opacity: 1,
		depthWrite: true,
		depthTest: true,
	})

	const mesh = new THREE.Mesh(geom, mat)
	const edges = new THREE.EdgesGeometry(geom)
	mesh.add(
		new THREE.LineSegments(
			edges,
			new THREE.LineBasicMaterial({ color: 0xffffff })
		)
	)

	pyramidGroup.add(mesh)
	f.mesh = mesh
})

pyramidGroup.position.y = 0.35

// === Morph Sphere (for ORC demo transition) ===
// Create a sphere that the pyramid will morph into
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

// ORC scene state
let orcSceneActive = false
let activeOrcGroup = null
let orcDemoContainer = null
let orcDemoRenderer = null
let orcDemoScene = null
let orcDemoCamera = null
let orcDemoRequestId = null
let orcDemoControls = null
let selectionIndicator = null
let selectedSatellite = null
let availableSatellitesPane = null

// Camera tracking state for decommission animations
let originalCameraState = null // Stores camera position/target before decommission tracking
let isCameraTracking = false // Whether camera is currently tracking a decommissioning satellite
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
	// Hide pyramid meshes while rendering the cubemap to avoid self-reflection artifacts
	const meshes = pyramidGroup.children.filter((c) => c.isMesh)
	meshes.forEach((m) => (m.visible = false))

	// Position the cube camera at the pyramid group's position and render
	cubeCamera.position.copy(pyramidGroup.position)
	cubeCamera.update(renderer, scene)

	// Restore visibility and set envMap on each pyramid face material
	meshes.forEach((m) => {
		m.visible = true
		if (cubeCamera.renderTarget && cubeCamera.renderTarget.texture) {
			m.material.envMap = cubeCamera.renderTarget.texture
			m.material.envMapIntensity = 0.7
			m.material.needsUpdate = true
		}
	})
}

// Generate the env map once during init. If you add dynamic objects later you
// can call updatePyramidEnvMap() again to refresh reflections.
updatePyramidEnvMap()

// === Labels ===
export const labelConfigs = {
	About: {
		text: "About",
		position: { x: -1.05, y: 0.04, z: 0.5 },
		rotation: { x: 0, y: 0.438, z: 1 },
		pyramidCenteredSize: [2.4, 0.6],
		pyramidUncenteredSize: [2.4, 0.6],
	},
	Portfolio: {
		text: "Portfolio",
		position: { x: 1.08, y: 0, z: 0.3 },
		rotation: { x: 0.2, y: -0.6, z: -0.92 },
		pyramidCenteredSize: [2.4, 0.6],
		pyramidUncenteredSize: [2.4, 0.6],
	},
	Blog: {
		text: "Blog",
		position: { x: 0, y: -1.65, z: 1.2 },
		rotation: { x: 0, y: 0, z: 0 },
		pyramidCenteredSize: [2.4, 0.6],
		pyramidUncenteredSize: [2.4, 0.6],
	},
	// Home config can be customized externally before calling initLabels
	Home: {
		text: "Home",
		// position is relative to pyramidGroup; default sits above apex
		position: { x: 0, y: apex.y + 0.2, z: 0 },
		rotation: { x: 0, y: 0, z: 0 },
		pyramidCenteredSize: [2.4, 0.6],
		pyramidUncenteredSize: [2.4, 0.6],
	},
}

// Contact label configuration - configurable position/rotation
export const contactConfig = {
	lines: ["Contact", "james.tasse@gmail.com", "(216)-219-1538"],
	// Starting position (hidden below pyramid)
	hiddenPosition: { x: 0, y: -1.8, z: 0.8 },
	// Revealed position (front & center of pyramid face)
	revealedPosition: { x: 0, y: -0.95, z: 0.8 },
	// Position when in left sidebar mode
	leftPosition: { x: -4.85, y: 1.1, z: 0 },
	rotation: { x: 0, y: 0, z: 0 },
	size: [2, 1.3],
}

// Contact label mesh (created in initContactLabel)
export let contactLabel = null
let contactVisible = false
let contactPosition = "hidden" // "hidden", "center", "left"

// Initialize contact label
export function initContactLabel() {
	if (contactLabel) return // Already initialized

	const cfg = contactConfig
	contactLabel = makeContactLabelPlane(cfg.lines, ...cfg.size)
	contactLabel.position.set(
		cfg.hiddenPosition.x,
		cfg.hiddenPosition.y,
		cfg.hiddenPosition.z
	)
	contactLabel.rotation.set(cfg.rotation.x, cfg.rotation.y, cfg.rotation.z)
	contactLabel.material.opacity = 0
	contactLabel.visible = false
	contactLabel.userData.name = "Contact"
	pyramidGroup.add(contactLabel)
}

// Show contact label with slide-up animation (when pyramid is centered)
export function showContactLabelCentered() {
	if (!contactLabel || contactVisible) return
	contactVisible = true
	contactPosition = "center"

	const cfg = contactConfig
	contactLabel.visible = true

	// Animate from hidden to revealed position
	const startY = cfg.hiddenPosition.y
	const endY = cfg.revealedPosition.y
	const startZ = cfg.hiddenPosition.z
	const endZ = cfg.revealedPosition.z
	const duration = 600
	const startTime = performance.now()

	function animateSlideUp(time) {
		const elapsed = time - startTime
		const t = Math.min(elapsed / duration, 1)
		// Ease out cubic
		const eased = 1 - Math.pow(1 - t, 3)

		contactLabel.position.y = startY + (endY - startY) * eased
		contactLabel.position.z = startZ + (endZ - startZ) * eased
		contactLabel.material.opacity = eased

		if (t < 1) {
			requestAnimationFrame(animateSlideUp)
		}
	}
	requestAnimationFrame(animateSlideUp)
}

// Move contact label to left side (when pyramid moves to top nav)
export function moveContactLabelToLeft() {
	if (!contactLabel || !contactVisible) return
	contactPosition = "left"

	const cfg = contactConfig
	// Detach from pyramid group and add to scene for fixed positioning
	pyramidGroup.remove(contactLabel)
	scene.add(contactLabel)

	const startPos = contactLabel.position.clone()
	const endPos = new THREE.Vector3(
		cfg.leftPosition.x,
		cfg.leftPosition.y,
		cfg.leftPosition.z
	)
	const duration = 500
	const startTime = performance.now()

	function animateToLeft(time) {
		const elapsed = time - startTime
		const t = Math.min(elapsed / duration, 1)
		const eased = 1 - Math.pow(1 - t, 3)

		contactLabel.position.lerpVectors(startPos, endPos, eased)

		if (t < 1) {
			requestAnimationFrame(animateToLeft)
		}
	}
	requestAnimationFrame(animateToLeft)
}

// Hide contact label
export function hideContactLabel() {
	if (!contactLabel) return

	const cfg = contactConfig
	const duration = 400
	const startTime = performance.now()
	const startOpacity = contactLabel.material.opacity

	function animateFadeOut(time) {
		const elapsed = time - startTime
		const t = Math.min(elapsed / duration, 1)

		contactLabel.material.opacity = startOpacity * (1 - t)

		if (t >= 1) {
			contactLabel.visible = false
			contactVisible = false
			contactPosition = "hidden"
			// Reset to pyramid group and hidden position
			scene.remove(contactLabel)
			pyramidGroup.add(contactLabel)
			contactLabel.position.set(
				cfg.hiddenPosition.x,
				cfg.hiddenPosition.y,
				cfg.hiddenPosition.z
			)
		} else {
			requestAnimationFrame(animateFadeOut)
		}
	}
	requestAnimationFrame(animateFadeOut)
}

// Check if contact is currently visible
export function isContactVisible() {
	return contactVisible
}

export function initLabels(makeLabelPlane) {
	for (const key in labelConfigs) {
		// Skip Home here; Home is handled after creating the page labels
		if (key === "Home") continue
		const cfg = labelConfigs[key]
		const mesh = makeLabelPlane(cfg.text, ...cfg.pyramidCenteredSize)
		mesh.position.set(cfg.position.x, cfg.position.y, cfg.position.z)
		mesh.rotation.set(cfg.rotation.x, cfg.rotation.y, cfg.rotation.z)
		// Store original position/rotation for return animation
		mesh.userData.origPosition = mesh.position.clone()
		mesh.userData.origRotation = mesh.rotation.clone()
		mesh.userData.originalScale = mesh.scale.clone()
		// Store centered and uncentered sizes for label sizing during animation
		mesh.userData.pyramidCenteredSize = cfg.pyramidCenteredSize
		mesh.userData.pyramidUncenteredSize = cfg.pyramidUncenteredSize
		pyramidGroup.add(mesh)
		labels[key] = mesh
		mesh.userData.name = key
		mesh.cursor = "pointer"

		// Create a larger invisible hover target placed slightly in front of the label
		const hoverWidth = cfg.pyramidCenteredSize[0] * 0.8
		const hoverHeight = cfg.pyramidCenteredSize[1] * 1.0
		const hoverGeo = new THREE.PlaneGeometry(hoverWidth, hoverHeight)
		const hoverMat = new THREE.MeshBasicMaterial({
			transparent: true,
			opacity: 0,
		})
		const hover = new THREE.Mesh(hoverGeo, hoverMat)
		// Offset slightly up (0.05) to expose the pyramid underline for clicking
		hover.position.copy(mesh.position).add(new THREE.Vector3(0, 0.05, 0.08))
		hover.rotation.copy(mesh.rotation)
		hover.userData.labelKey = key
		hover.name = `${key}_hover`
		scene.add(hover)
		hoverTargets[key] = hover
	}
}

// === Pyramid State ===
let isAtBottom = false

// Token to invalidate in-progress pyramid animations. Incrementing this
// prevents prior animation completions from executing side-effects
// (like showing content) after a cancel/reset.
let pyramidAnimToken = 0

// Store initial pyramid state so we can always reset to it exactly
const initialPyramidState = {
	positionX: 0,
	positionY: 0.35,
	rotationY: 0,
	scale: 1,
}

// Flattened menu state - pyramid positioned below labels as underline indicator
const flattenedMenuState = {
	// Position pyramid BELOW the labels so its base acts as an underline.
	// The pyramid is squished vertically to be flat and unobtrusive.
	positionY: 2.2, // Below labels (which are at y=2.5) so base underlines them
	scale: 0.4,
	scaleY: 0.08, // Very flat - squished vertically for subtle underline effect
	scaleZ: 0.1, // Short height - squished Z for flatter triangle shape on screen
	rotationX: -1.4, // Tilt forward to show inverted triangle, hide bottom completely
}

// Flattened label positions for horizontal menu at top.
// These are WORLD positions (x/y/z) - fixed values that stay within camera view.
// Camera is at z=6, FOV 50, so visible Y range at z=0 is roughly ±2.8
const flattenedLabelPositions = {
	About: { x: -2.0, y: 2.5, z: 0 },
	Portfolio: { x: 0, y: 2.5, z: 0 },
	Blog: { x: 2.0, y: 2.5, z: 0 },
}

// Pyramid X positions when centered under each label (match flattenedLabelPositions)
const pyramidXPositions = {
	about: -2.0,
	portfolio: 0,
	blog: 2.0,
}

// Track current active section for rotation calculations
let currentSection = null

// Clipping plane to prevent content from overlapping the top nav
const contentClippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 2.1)

export function getInitialPyramidState() {
	return { ...initialPyramidState }
}

export function animatePyramid(down = true, section = null) {
	// capture a local token for this animation; incrementing global token
	// elsewhere (e.g. reset) will invalidate this animation's completion
	const myToken = ++pyramidAnimToken
	pyramidGroup.visible = true
	const duration = 1000
	const startRotY = pyramidGroup.rotation.y
	const startRotX = pyramidGroup.rotation.x

	// No Y rotation when going to flattened state - pyramid slides horizontally
	// and always points straight down. Only reset Y rotation when returning home.
	let endRotY = down ? startRotY + Math.PI * 2 : initialPyramidState.rotationY
	if (down && section) {
		currentSection = section
	}

	// X rotation to tilt pyramid so apex points down (inverted triangle)
	const endRotX = down ? flattenedMenuState.rotationX || 0 : 0

	const startPosX = pyramidGroup.position.x
	const startPosY = pyramidGroup.position.y
	// Animate to TOP of screen
	const endPosY = down
		? flattenedMenuState.positionY
		: initialPyramidState.positionY
	// Animate X position to be behind the selected label
	const endPosX =
		down && section && pyramidXPositions[section] !== undefined
			? pyramidXPositions[section]
			: initialPyramidState.positionX || 0

	// Scaling - use non-uniform scale for flattened state
	const startScaleX = pyramidGroup.scale.x
	const startScaleY = pyramidGroup.scale.y
	const startScaleZ = pyramidGroup.scale.z
	const endScaleX = down ? flattenedMenuState.scale : initialPyramidState.scale
	const endScaleY = down
		? flattenedMenuState.scaleY || flattenedMenuState.scale
		: initialPyramidState.scale
	const endScaleZ = down
		? flattenedMenuState.scaleZ || flattenedMenuState.scale
		: initialPyramidState.scale

	// Store starting label positions and rotations for animation
	// Also pre-compute target positions based on FINAL pyramid state
	const labelStartStates = {}
	const labelTargetStates = {}
	for (const key in labels) {
		const labelMesh = labels[key]
		if (!labelMesh) continue

		// If going down (to menu) and label is not already fixed:
		// Detach from pyramid and move in World Space for a clear path.
		if (
			down &&
			flattenedLabelPositions[key] &&
			!(labelMesh.userData && labelMesh.userData.fixedNav)
		) {
			// Update world matrix to ensure accurate world transforms
			labelMesh.updateMatrixWorld()
			const worldPos = new THREE.Vector3()
			labelMesh.getWorldPosition(worldPos)
			const worldQuat = new THREE.Quaternion()
			labelMesh.getWorldQuaternion(worldQuat)
			const worldScale = new THREE.Vector3()
			labelMesh.getWorldScale(worldScale)

			// Reparent to scene to animate freely in world space
			scene.add(labelMesh)
			labelMesh.position.copy(worldPos)
			labelMesh.quaternion.copy(worldQuat)
			labelMesh.scale.copy(worldScale)

			labelStartStates[key] = {
				position: worldPos.clone(),
				quaternion: worldQuat.clone(),
				scale: worldScale.clone(),
			}

			const flatPos = flattenedLabelPositions[key]
			// Target: Flat position, Face camera (identity rotation), Scale 0.4
			labelTargetStates[key] = {
				position: new THREE.Vector3(flatPos.x, flatPos.y, flatPos.z),
				quaternion: new THREE.Quaternion(), // Identity (0,0,0) faces camera
				scale: new THREE.Vector3(1, 1, 1),
			}
		} else {
			// Existing logic for !down or fixed labels (local space)
			labelStartStates[key] = {
				position: labelMesh.position.clone(),
				rotation: labelMesh.rotation.clone(),
				scale: labelMesh.scale.clone(),
				visible: labelMesh.visible,
			}
		}
	}

	const startTime = performance.now()
	function step(time) {
		// If this animation has been invalidated (a newer token exists), stop updating
		if (myToken !== pyramidAnimToken) return
		const t = Math.min((time - startTime) / duration, 1)
		pyramidGroup.rotation.x = startRotX + (endRotX - startRotX) * t
		pyramidGroup.rotation.y = startRotY + (endRotY - startRotY) * t
		pyramidGroup.position.x = startPosX + (endPosX - startPosX) * t
		pyramidGroup.position.y = startPosY + (endPosY - startPosY) * t
		// Non-uniform scaling for flattened pyramid effect
		const sx = startScaleX + (endScaleX - startScaleX) * t
		const sy = startScaleY + (endScaleY - startScaleY) * t
		const sz = startScaleZ + (endScaleZ - startScaleZ) * t
		pyramidGroup.scale.set(sx, sy, sz)

		// Animate labels to/from flattened horizontal positions
		for (const key in labels) {
			const labelMesh = labels[key]
			if (!labelMesh) continue
			const startState = labelStartStates[key]
			if (!startState) continue

			if (down && labelTargetStates[key]) {
				// Animate in World Space
				const targetState = labelTargetStates[key]
				labelMesh.position.lerpVectors(
					startState.position,
					targetState.position,
					t
				)
				if (startState.quaternion && targetState.quaternion) {
					labelMesh.quaternion.slerpQuaternions(
						startState.quaternion,
						targetState.quaternion,
						t
					)
				}
				labelMesh.scale.lerpVectors(startState.scale, targetState.scale, t)
			} else if (!down) {
				// Animate back to original positions
				const origPos = labelMesh.userData.origPosition
				const origRot = labelMesh.userData.origRotation
				const origScale = labelMesh.userData.originalScale
				if (origPos) {
					labelMesh.position.lerpVectors(startState.position, origPos, t)
				}
				if (origRot) {
					labelMesh.rotation.x =
						startState.rotation.x + (origRot.x - startState.rotation.x) * t
					labelMesh.rotation.y =
						startState.rotation.y + (origRot.y - startState.rotation.y) * t
					labelMesh.rotation.z =
						startState.rotation.z + (origRot.z - startState.rotation.z) * t
				}
				if (origScale) {
					const sx = startState.scale.x + (origScale.x - startState.scale.x) * t
					const sy = startState.scale.y + (origScale.y - startState.scale.y) * t
					const sz = startState.scale.z + (origScale.z - startState.scale.z) * t
					labelMesh.scale.set(sx, sy, sz)
				}
			}
		}

		if (t < 1) requestAnimationFrame(step)
		else {
			// If a newer animation has been started since this one began,
			// abort executing completion side-effects.
			if (myToken !== pyramidAnimToken) return
			isAtBottom = down

			// Snap labels to final positions
			for (const key in labels) {
				const labelMesh = labels[key]
				if (!labelMesh) continue

				if (down && labelTargetStates[key]) {
					// Already in scene and animated to target.
					// Just ensure exact final values.
					const flatPos = flattenedLabelPositions[key]
					if (flatPos) {
						labelMesh.position.set(flatPos.x, flatPos.y, flatPos.z)
						labelMesh.rotation.set(0, 0, 0)
						labelMesh.scale.set(1, 1, 1)
						// Mark as fixed nav so it never moves again
						labelMesh.userData.fixedNav = true
					}
				} else if (!down) {
					// Snap to original
					const origPos = labelMesh.userData.origPosition
					const origRot = labelMesh.userData.origRotation
					const origScale = labelMesh.userData.originalScale
					// Ensure the label is a child of the pyramidGroup and restore local transforms
					if (labelMesh.parent !== pyramidGroup) pyramidGroup.add(labelMesh)
					if (origPos) labelMesh.position.copy(origPos)
					if (origRot) labelMesh.rotation.copy(origRot)
					if (origScale) labelMesh.scale.copy(origScale)
				}
			}

			// Show section content only if requested and this animation is still valid
			if (section === "about") showAboutPlane()
			else if (section === "portfolio") showPortfolioPlane()
			else if (section === "blog") showBlogPlane()
		}
	}
	requestAnimationFrame(step)
}

// Slide pyramid horizontally to position below a different label (when already at top)
export function spinPyramidToSection(section, onComplete = null) {
	console.log(`spinPyramidToSection(${section})`)
	if (!section || pyramidXPositions[section] === undefined) return

	const myToken = ++pyramidAnimToken
	pyramidGroup.visible = true

	const duration = 600

	const startPosX = pyramidGroup.position.x
	const endPosX = pyramidXPositions[section]

	const startRotY = pyramidGroup.rotation.y
	const endRotY = startRotY + Math.PI * 2

	currentSection = section

	const startTime = performance.now()
	function step(time) {
		if (myToken !== pyramidAnimToken) return
		const t = Math.min((time - startTime) / duration, 1)
		const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

		// Animate X position
		pyramidGroup.position.x = startPosX + (endPosX - startPosX) * eased
		// Animate rotation around Y-axis
		pyramidGroup.rotation.y = startRotY + (endRotY - startRotY) * eased

		if (t < 1) requestAnimationFrame(step)
		else {
			if (myToken !== pyramidAnimToken) return
			pyramidGroup.position.x = endPosX
			pyramidGroup.rotation.y = endRotY
			if (onComplete) onComplete()
		}
	}
	requestAnimationFrame(step)
}

// Reset pyramid to exact home state
export function resetPyramidToHome() {
	// Invalidate any in-progress pyramid animations so their completion
	// handlers won't show content after we start resetting.
	const myToken = ++pyramidAnimToken
	// Clear current section
	currentSection = null
	// Immediately hide any content so nothing appears while we animate
	hideAllPlanes()
	pyramidGroup.visible = true
	const duration = 1000
	const startRotY = pyramidGroup.rotation.y
	const startRotX = pyramidGroup.rotation.x
	// Rotate back to initial rotation (Blog face forward, no tilt)
	const targetRotY = initialPyramidState.rotationY
	const targetRotX = 0 // Reset X rotation to 0 (no tilt)
	// Normalize and find shortest path for Y rotation
	const normalizedStart =
		((startRotY % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
	const normalizedTarget =
		((targetRotY % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
	let rotDiffY = normalizedTarget - normalizedStart
	if (rotDiffY > Math.PI) rotDiffY -= 2 * Math.PI
	if (rotDiffY < -Math.PI) rotDiffY += 2 * Math.PI
	const startPosX = pyramidGroup.position.x
	const endPosX = initialPyramidState.positionX // Reset X to center
	const startPosY = pyramidGroup.position.y
	const endPosY = initialPyramidState.positionY // Use stored initial position
	// Uniform scaling
	const startScaleX = pyramidGroup.scale.x
	const startScaleY = pyramidGroup.scale.y
	const startScaleZ = pyramidGroup.scale.z
	const endScale = initialPyramidState.scale

	// Camera reset - store starting camera position for animation
	const startCamPos = camera.position.clone()
	const endCamPos = initialCameraState.position.clone()

	// Capture label start states so we can animate them back to original positions
	const labelStartStates = {}
	for (const key in labels) {
		if (key === "Home") continue
		const labelMesh = labels[key]
		if (!labelMesh) continue

		// Ensure attached to pyramidGroup to animate in local space
		if (labelMesh.parent === scene) {
			pyramidGroup.attach(labelMesh)
		}

		labelStartStates[key] = {
			position: labelMesh.position.clone(),
			quaternion: labelMesh.quaternion.clone(),
			scale: labelMesh.scale.clone(),
		}
		// Clear fixedNav flag so labels can be animated again
		labelMesh.userData.fixedNav = false
	}

	const startTime = performance.now()
	function step(time) {
		if (myToken !== pyramidAnimToken) return
		const t = Math.min((time - startTime) / duration, 1)
		// Use easeInOut for smoother animation
		const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

		pyramidGroup.rotation.y = startRotY + rotDiffY * eased
		pyramidGroup.rotation.x = startRotX + (targetRotX - startRotX) * eased
		pyramidGroup.position.x = startPosX + (endPosX - startPosX) * eased
		pyramidGroup.position.y = startPosY + (endPosY - startPosY) * eased
		// Uniform scaling
		const sx = startScaleX + (endScale - startScaleX) * eased
		const sy = startScaleY + (endScale - startScaleY) * eased
		const sz = startScaleZ + (endScale - startScaleZ) * eased
		pyramidGroup.scale.set(sx, sy, sz)

		// Animate camera back to initial position
		camera.position.lerpVectors(startCamPos, endCamPos, eased)
		camera.lookAt(initialCameraState.target)
		controls.target.copy(initialCameraState.target)
		controls.update()

		// Animate labels back to their original positions (local space)
		for (const key in labels) {
			if (key === "Home") continue
			const labelMesh = labels[key]
			if (!labelMesh) continue
			const startState = labelStartStates[key]
			const origPos = labelMesh.userData.origPosition
			const origRot = labelMesh.userData.origRotation
			const origScale = labelMesh.userData.originalScale

			if (startState && origPos && origRot && origScale) {
				labelMesh.position.lerpVectors(startState.position, origPos, eased)

				const targetQuat = new THREE.Quaternion().setFromEuler(origRot)
				labelMesh.quaternion.slerpQuaternions(
					startState.quaternion,
					targetQuat,
					eased
				)

				labelMesh.scale.lerpVectors(startState.scale, origScale, eased)
			}
		}

		if (t < 1) requestAnimationFrame(step)
		else {
			isAtBottom = false
			// Ensure exact values after animation
			pyramidGroup.rotation.y = initialPyramidState.rotationY
			pyramidGroup.rotation.x = 0
			pyramidGroup.position.x = endPosX
			pyramidGroup.position.y = endPosY
			pyramidGroup.scale.set(endScale, endScale, endScale)

			// Ensure camera is exactly at initial position
			camera.position.copy(initialCameraState.position)
			camera.lookAt(initialCameraState.target)
			controls.target.copy(initialCameraState.target)
			controls.update()

			// Snap labels to exact original positions
			for (const key in labels) {
				if (key === "Home") continue
				const labelMesh = labels[key]
				if (!labelMesh) continue
				const origPos = labelMesh.userData.origPosition
				const origRot = labelMesh.userData.origRotation
				const origScale = labelMesh.userData.originalScale
				if (origPos) labelMesh.position.copy(origPos)
				if (origRot) labelMesh.rotation.copy(origRot)
				if (origScale) labelMesh.scale.copy(origScale)
				labelMesh.userData.fixedNav = false
			}

			// After reset, hide the DOM Home button
			hideHomeLabel()
		}
	}
	requestAnimationFrame(step)
}

export function showAboutPlane() {
	// Always remove any existing content before showing a new plane to avoid overlap
	hideAllPlanes()
	controls.enableZoom = false

	// Ensure the DOM content pane is hidden when using a 3D about plane so
	// we don't show duplicate/overlapping DOM text over the pyramid.
	const contentEl = document.getElementById("content")
	if (contentEl) {
		contentEl.style.display = "none"
		// Ensure DOM does not block pointer events when hidden
		contentEl.style.pointerEvents = "none"
	}
	// Show navigation bar positioned between content and home label
	// ensure DOM separator is not shown here; we use the 3D separator instead
	const navBar = document.getElementById("content-floor")
	if (navBar) navBar.classList.remove("show")
	let aboutPlane = scene.getObjectByName("aboutPlane")
	if (!aboutPlane) {
		// Capture current animation token so we can abort if a reset occurs
		const myToken = pyramidAnimToken
		// Load HTML content and parse about structure (heading + paragraphs)
		loadContentHTML("about").then((html) => {
			// If a newer pyramid animation/reset occurred, abort adding content
			if (myToken !== pyramidAnimToken) return
			const aboutContent = parseAboutContent(html)
			const plane = makeAboutPlane(aboutContent)
			plane.name = "aboutPlane"
			plane.frustumCulled = false // Prevent culling when scrolling out of initial bounds
			plane.traverse((child) => {
				if (child.material) {
					const mats = Array.isArray(child.material)
						? child.material
						: [child.material]
					mats.forEach((m) => {
						m.clippingPlanes = [contentClippingPlane]
						m.needsUpdate = true
					})
				}
			})
			// Position content plane below the top menu
			plane.position.y = 0.0
			scene.add(plane)
			setupContentScrolling(plane)
			// Hide separators since flattened menu serves as navigation
			const navBar = document.getElementById("content-floor")
			if (navBar) navBar.classList.remove("show")
		})
	}
}

export function showPortfolioPlane() {
	// Always remove any existing content before showing a new plane to avoid overlap
	hideAllPlanes()
	controls.enableZoom = false

	// Ensure DOM content is hidden when presenting the 3D portfolio plane.
	const contentEl = document.getElementById("content")
	if (contentEl) {
		contentEl.style.display = "none"
		// Ensure DOM does not block pointer events when hidden
		contentEl.style.pointerEvents = "none"
	}
	// Show navigation bar positioned between content and home label
	// ensure DOM separator is not shown here; we use the 3D separator instead
	const navBar = document.getElementById("content-floor")
	if (navBar) navBar.classList.remove("show")
	let portfolioPlane = scene.getObjectByName("portfolioPlane")
	if (!portfolioPlane) {
		const myToken = pyramidAnimToken
		// Load portfolio HTML and extract items (title, description, link)
		loadContentHTML("portfolio").then((html) => {
			if (myToken !== pyramidAnimToken) return
			// Do not populate the DOM content pane for portfolio to avoid
			// duplicating the portfolio items. The 3D plane will be used.
			const contentEl = document.getElementById("content")
			const parser = new DOMParser()
			const doc = parser.parseFromString(html, "text/html")
			const items = []
			doc.querySelectorAll(".portfolio-item").forEach((el) => {
				const titleEl = el.querySelector("h2")
				const pEl = el.querySelector("p")
				const aEl = el.querySelector("a")
				// Get link from data-link attribute first, then fallback to anchor tag
				const link = el.dataset.link || (aEl ? aEl.href : null)
				const imgEl = el.querySelector("img")
				let imageSrc = null
				if (imgEl && imgEl.src) imageSrc = imgEl.src
				// If no explicit img, attempt to infer an image from the link (favicon)
				if (!imageSrc && link) {
					try {
						const url = new URL(link)
						imageSrc = `${url.origin}/favicon.ico`
					} catch (e) {
						imageSrc = null
					}
				}
				items.push({
					title: titleEl ? titleEl.textContent.trim() : "Untitled",
					description: pEl ? pEl.textContent.trim() : "",
					image: imageSrc,
					link: link,
				})
			})
			const plane = makePortfolioPlane(items)
			plane.name = "portfolioPlane"
			plane.frustumCulled = false
			plane.traverse((child) => {
				if (child.material) {
					const mats = Array.isArray(child.material)
						? child.material
						: [child.material]
					mats.forEach((m) => {
						m.clippingPlanes = [contentClippingPlane]
						m.needsUpdate = true
					})
				}
			})
			// Position content plane lower to make room for ORC preview overlay
			plane.position.y = -0.8
			scene.add(plane)
			setupContentScrolling(plane)
			// Hide separators since flattened menu serves as navigation
			const navBar = document.getElementById("content-floor")
			if (navBar) navBar.classList.remove("show")

			// Show the live ORC preview overlay at the top
			showOrcPreviewOverlay()
		})
	} else {
		// Portfolio plane already exists, just show the ORC preview
		showOrcPreviewOverlay()
	}
}

export function showBlogPlane() {
	// Always remove any existing content before showing a new plane to avoid overlap
	hideAllPlanes()
	controls.enableZoom = false
	// Show navigation bar positioned between content and home label
	// ensure DOM separator is not shown here; we use the 3D separator instead
	const navBar = document.getElementById("content-floor")
	if (navBar) navBar.classList.remove("show")
	let blogPlane = scene.getObjectByName("blogPlane")
	if (!blogPlane) {
		const myToken = pyramidAnimToken
		// load HTML content and parse blog posts
		loadContentHTML("blog").then((html) => {
			if (myToken !== pyramidAnimToken) return
			// Populate DOM content
			const contentEl = document.getElementById("content")
			if (contentEl) {
				contentEl.innerHTML = html
				contentEl.style.display = "block"
				// Ensure content accepts pointer events when visible
				contentEl.style.pointerEvents = "auto"
				// Push content down to clear nav and add scrollbar
				contentEl.style.top = "25%"
				contentEl.style.bottom = "5%"
				contentEl.style.height = "auto"
				contentEl.style.overflowY = "auto"
			}
			const posts = parseBlogPosts(html)
			const plane = makeBlogPlane(posts)
			// Position content plane below the top menu
			plane.position.y = -0.5
			scene.add(plane)
			// Hide separators since flattened menu serves as navigation
			setupContentScrolling(plane)
			const navBar = document.getElementById("content-floor")
			if (navBar) navBar.classList.remove("show")
		})
	} else {
		blogPlane.visible = true
		setupContentScrolling(blogPlane)
	}
}

function hideAbout() {
	const aboutPlane = scene.getObjectByName("aboutPlane")
	if (aboutPlane) scene.remove(aboutPlane)
}

function hidePortfolio() {
	const plane = scene.getObjectByName("portfolioPlane")
	if (plane) scene.remove(plane)
}

function hideBlog() {
	const blogPlane = scene.getObjectByName("blogPlane")
	if (blogPlane) scene.remove(blogPlane)
}

// === ORC Preview Overlay for Portfolio ===
let orcPreviewOverlay = null
let orcPreviewElement = null

function showOrcPreviewOverlay() {
	// Create overlay if it doesn't exist
	if (!orcPreviewOverlay) {
		orcPreviewOverlay = document.createElement("div")
		orcPreviewOverlay.id = "orc-preview-overlay"
		Object.assign(orcPreviewOverlay.style, {
			position: "fixed",
			top: "22%",
			left: "50%",
			transform: "translateX(-50%)",
			zIndex: "100",
			display: "flex",
			alignItems: "center",
			gap: "20px",
			background:
				"linear-gradient(135deg, rgba(0, 20, 40, 0.98), rgba(0, 40, 60, 0.95))",
			border: "2px solid #00aaff",
			borderRadius: "16px",
			padding: "16px 20px",
			cursor: "pointer",
			boxShadow: "0 0 30px rgba(0, 170, 255, 0.3)",
			maxWidth: "85%",
			height: "120px",
			boxSizing: "border-box",
		})

		// Create the live 3D preview (smaller to fit container)
		orcPreviewElement = createOrcPreview(140, 90)
		orcPreviewElement.style.borderRadius = "8px"
		orcPreviewElement.style.pointerEvents = "none"
		orcPreviewOverlay.appendChild(orcPreviewElement)

		// Create text container
		const textContainer = document.createElement("div")
		textContainer.innerHTML = `
			<h2 style="color: #00ffff; margin: 0 0 8px 0; font-size: 1.3rem; text-shadow: 0 0 10px rgba(0,255,255,0.3);">
				Click here to view ORC demo with inline docs!
			</h2>
			<p style="color: #aaddff; margin: 0; font-size: 0.95rem; line-height: 1.4;">
				Orbital Refuse Collector - Interactive API documentation demo featuring satellite orbit visualization.
			</p>
		`
		textContainer.style.pointerEvents = "none"
		orcPreviewOverlay.appendChild(textContainer)

		// Add hover effect
		orcPreviewOverlay.addEventListener("mouseenter", () => {
			orcPreviewOverlay.style.borderColor = "#00ffff"
			orcPreviewOverlay.style.boxShadow = "0 0 40px rgba(0, 255, 255, 0.4)"
			orcPreviewOverlay.style.transform = "translateX(-50%) scale(1.02)"
		})
		orcPreviewOverlay.addEventListener("mouseleave", () => {
			orcPreviewOverlay.style.borderColor = "#00aaff"
			orcPreviewOverlay.style.boxShadow = "0 0 30px rgba(0, 170, 255, 0.3)"
			orcPreviewOverlay.style.transform = "translateX(-50%) scale(1)"
		})

		// Click handler to navigate to ORC demo
		orcPreviewOverlay.addEventListener("click", (e) => {
			e.stopPropagation()
			// Use the globally exposed router navigation
			window.routerNavigate("/orc-demo")
		})

		document.body.appendChild(orcPreviewOverlay)
	}

	orcPreviewOverlay.style.display = "flex"
}

function hideOrcPreviewOverlay() {
	if (orcPreviewOverlay) {
		orcPreviewOverlay.style.display = "none"
	}
}

function cleanupOrcPreviewOverlay() {
	if (orcPreviewElement && orcPreviewElement.cleanup) {
		orcPreviewElement.cleanup()
	}
	if (orcPreviewOverlay && orcPreviewOverlay.parentNode) {
		orcPreviewOverlay.parentNode.removeChild(orcPreviewOverlay)
	}
	orcPreviewOverlay = null
	orcPreviewElement = null
}

// === ORC Info Pane (right 1/3 of screen during ORC demo) ===
let orcInfoPane = null

function hideOrcInfoPane() {
	// Remove the module-level reference if it exists
	if (orcInfoPane) {
		orcInfoPane.remove()
		orcInfoPane = null
	}
	// Also check for any DOM element with this ID (in case it was created elsewhere)
	const existingPane = document.getElementById("orc-info-pane")
	if (existingPane) {
		existingPane.remove()
	}
}

// Create a 2D sprite to indicate the selected satellite
function createSelectionIndicator() {
	const canvas = document.createElement("canvas")
	canvas.width = 64
	canvas.height = 64
	const context = canvas.getContext("2d")
	context.strokeStyle = "#00ffff"
	context.lineWidth = 6
	context.strokeRect(0, 0, 64, 64)
	const texture = new THREE.CanvasTexture(canvas)

	const material = new THREE.SpriteMaterial({
		map: texture,
		blending: THREE.AdditiveBlending,
		depthTest: false,
		transparent: true,
	})

	const sprite = new THREE.Sprite(material)
	sprite.scale.set(0.3, 0.3, 1)
	sprite.visible = false
	sprite.name = "selectionIndicator"
	return sprite
}

// Update the info pane with the selected satellite's ID
function updateSelectedSatelliteInfo(satelliteId) {
	const statusEl = document.getElementById("selected-satellite-status")
	const idEl = document.getElementById("selected-satellite-display-id")
	const orbitTypeEl = document.getElementById("selected-satellite-orbit-type")
	const infoContainer = document.getElementById("satellite-info-content")
	const topIdEl = document.getElementById("selected-satellite-id")
	const noSelectionMsg = document.getElementById("no-satellite-selected")
	const decommissionBtn = document.getElementById("decommission-btn")

	if (statusEl && orbitTypeEl && infoContainer && noSelectionMsg) {
		if (selectedSatellite) {
			infoContainer.style.display = "block"
			noSelectionMsg.style.display = "none"

			// Check if satellite is decommissioning
			if (selectedSatellite.userData.decommissioning) {
				statusEl.textContent = "Decommissioning"
				statusEl.className = "status-decommissioning"
				if (decommissionBtn) {
					decommissionBtn.disabled = true
					decommissionBtn.classList.add("decommissioning")
					decommissionBtn.textContent = "Decommissioning..."
				}
			} else {
				statusEl.textContent = "Operational"
				statusEl.className = "status-operational"
				if (decommissionBtn) {
					decommissionBtn.disabled = false
					decommissionBtn.classList.remove("decommissioning")
					decommissionBtn.textContent = "Decommission"
				}
			}

			// Update ID fields
			if (idEl) idEl.textContent = selectedSatellite.userData.id
			if (topIdEl) topIdEl.textContent = selectedSatellite.userData.name

			// Lookup orbit type based on ID prefix or specific ID
			let orbitType = "Unknown Orbit"
			const satId = selectedSatellite.userData.id
			if (satId.startsWith("geo")) {
				orbitType = "Geosynchronous"
			} else if (satId.startsWith("leo")) {
				orbitType = "Low Earth"
			} else if (satId.startsWith("mol")) {
				orbitType = "Molniya"
			}

			orbitTypeEl.textContent = orbitType
		} else {
			infoContainer.style.display = "none"
			noSelectionMsg.style.display = "block"
		}
	}
}

// Exported helper to hide all content planes
export function hideAllPlanes() {
	hideAbout()
	hidePortfolio()
	hideBlog()
	// Hide ORC preview overlay and info pane
	hideOrcPreviewOverlay()
	hideOrcInfoPane()
	// Hide navigation bar DOM element as a fallback
	const contentFloor = document.getElementById("content-floor")
	if (contentFloor) contentFloor.classList.remove("show")

	// Also hide the DOM content pane to avoid lingering DOM content
	const contentEl = document.getElementById("content")
	if (contentEl) {
		contentEl.style.display = "none"
	}
	hideContentScrolling()
	controls.enableZoom = true

	// Do not hide the Home label here — Home remains visible until the user
	// explicitly returns to the original state by clicking the Home label.
}

// === ORC Scene / Morph Functions ===

// Show ORC scene directly (no pyramid morph animation)
export function morphToOrcScene() {
	++pyramidAnimToken
	hideAllPlanes()

	// Immediately hide pyramid and labels
	pyramidGroup.visible = false
	Object.values(labels).forEach((label) => {
		if (label.material) {
			label.material.opacity = 0
		}
	})
	morphSphere.visible = false

	// Create the demo scene
	createOrcDemo()
	showOrcResetButton()
	showAvailableSatellitesPane()

	// Show home button
	showHomeLabel()

	// Set up camera for ORC scene
	camera.position.copy(orcDemoCamera.position)
	camera.lookAt(orcDemoControls.target)
	controls.target.copy(orcDemoControls.target)
	controls.enabled = false

	orcSceneActive = true

	// Fade in the ORC demo container
	if (orcDemoContainer) {
		// Start with 0 opacity, then fade in
		orcDemoContainer.style.opacity = "0"
		orcDemoContainer.style.transition = "opacity 0.6s ease-in"
		requestAnimationFrame(() => {
			orcDemoContainer.style.opacity = "1"
		})
	}
}

// Return from ORC scene back to pyramid
export function morphFromOrcScene() {
	const myToken = ++pyramidAnimToken

	// Capture camera/controls state BEFORE fading out
	const startCamPos = orcDemoCamera.position.clone()
	const startControlsTarget = orcDemoControls.target.clone()
	const endCamPos = initialCameraState.position.clone()

	const fadeOutDuration = 500 // Duration for ORC elements to fade out
	const fadeInDuration = 800 // Duration for pyramid to fade in

	// Phase 1: Fade out all ORC elements
	if (orcDemoContainer) {
		orcDemoContainer.style.transition = `opacity ${fadeOutDuration}ms ease-out`
		orcDemoContainer.style.opacity = "0"
	}
	// Target the DOM element directly in case orcInfoPane variable is out of sync
	const infoPane = document.getElementById("orc-info-pane")
	if (infoPane) {
		infoPane.style.transition = `opacity ${fadeOutDuration}ms ease-out`
		infoPane.style.opacity = "0"
	}
	hideOrcResetButton()

	// After fade out completes, destroy ORC and show pyramid
	setTimeout(() => {
		if (myToken !== pyramidAnimToken) return

		// Now destroy the ORC elements
		destroyOrcDemo()
		hideOrcInfoPane()

		// Prepare pyramid - set to initial state but transparent for fade in
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

		// Show hover targets
		for (const key in hoverTargets) {
			if (hoverTargets[key]) hoverTargets[key].visible = true
		}

		// Set pyramid face materials to transparent for fade in
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

		// Set labels to transparent
		Object.values(labels).forEach((label) => {
			if (label.material) {
				label.material.opacity = 0
			}
		})

		// Set camera to final position immediately
		camera.position.copy(endCamPos)
		camera.lookAt(initialCameraState.target)
		controls.target.copy(initialCameraState.target)
		controls.enabled = true
		controls.update()

		orcSceneActive = false
		isAtBottom = false
		currentSection = null
		morphSphere.visible = false

		// Phase 2: Fade in pyramid and labels
		const startTime = performance.now()

		function fadeInStep(time) {
			if (myToken !== pyramidAnimToken) return

			const t = Math.min((time - startTime) / fadeInDuration, 1)
			const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

			// Fade in pyramid faces
			pyramidGroup.children.forEach((child) => {
				if (
					child.isMesh &&
					child.material &&
					!Object.values(labels).includes(child)
				) {
					child.material.opacity = eased
				}
			})

			// Fade in labels
			Object.values(labels).forEach((label) => {
				if (label.material) {
					label.material.opacity = eased
				}
			})

			if (t < 1) {
				requestAnimationFrame(fadeInStep)
			} else {
				// Animation complete
				if (myToken !== pyramidAnimToken) return

				// Restore pyramid face materials to full opacity
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

				// Final check - ensure labels are visible and in correct positions
				for (const key in labels) {
					if (key === "Home") continue
					const labelMesh = labels[key]
					if (!labelMesh) continue
					if (labelMesh.material) labelMesh.material.opacity = 1

					labelMesh.userData.fixedNav = false

					// Ensure attached to pyramidGroup
					if (labelMesh.parent !== pyramidGroup) {
						pyramidGroup.add(labelMesh)
					}

					// Snap to exact original positions
					const origPos = labelMesh.userData.origPosition
					const origRot = labelMesh.userData.origRotation
					const origScale = labelMesh.userData.originalScale
					if (origPos) labelMesh.position.copy(origPos)
					if (origRot) labelMesh.rotation.copy(origRot)
					if (origScale) labelMesh.scale.copy(origScale)
				}

				// Ensure hover targets visible
				for (const key in hoverTargets) {
					if (hoverTargets[key]) hoverTargets[key].visible = true
				}

				hideHomeLabel()
			}
		}

		requestAnimationFrame(fadeInStep)
	}, fadeOutDuration)
}

// Check if ORC scene is currently active
export function isOrcSceneActive() {
	return orcSceneActive
}

// Create the ORC demo in its own container
function createOrcDemo() {
	if (orcDemoContainer) return // Already created

	// 1. Create container (styles defined in orc-demo.css)
	orcDemoContainer = document.createElement("div")
	orcDemoContainer.id = "orc-demo-container"
	document.body.appendChild(orcDemoContainer)

	// Add click listener for satellite selection
	orcDemoContainer.addEventListener("mousedown", (event) => {
		const rect = orcDemoContainer.getBoundingClientRect()
		const mouse = new THREE.Vector2()
		mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
		mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

		const raycaster = new THREE.Raycaster()
		raycaster.setFromCamera(mouse, orcDemoCamera)

		const intersects = raycaster.intersectObjects(satellites, true)

		if (intersects.length > 0) {
			let clickedObject = intersects[0].object
			// Traverse up to find the satellite group with userData.id
			while (clickedObject && !clickedObject.userData.id) {
				clickedObject = clickedObject.parent
			}

			if (clickedObject) {
				selectedSatellite = clickedObject
				selectionIndicator.visible = true
				updateSelectedSatelliteInfo(clickedObject.userData.id)
				updateAvailableSatellitesHighlight()
				updateDecommissionActionState()
				// Show tether for George (geosynchronous satellite)
				if (clickedObject.userData.id === "geo-001") {
					showGeoTether()
				} else {
					hideGeoTether()
				}
			}
		} else {
			// Clicked on empty space, deselect
			selectedSatellite = null
			selectionIndicator.visible = false
			updateSelectedSatelliteInfo(null)
			updateAvailableSatellitesHighlight()
			updateDecommissionActionState()
			hideGeoTether()
		}
	})

	// 2. Create renderer
	const rect = orcDemoContainer.getBoundingClientRect()
	orcDemoRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
	orcDemoRenderer.setPixelRatio(window.devicePixelRatio)
	orcDemoRenderer.setSize(rect.width, rect.height)
	orcDemoRenderer.outputColorSpace = THREE.SRGBColorSpace
	orcDemoContainer.appendChild(orcDemoRenderer.domElement)

	// 3. Create scene and camera
	orcDemoScene = new THREE.Scene()
	orcDemoCamera = new THREE.PerspectiveCamera(
		50,
		rect.width / rect.height,
		0.1,
		100
	)

	// Read camera position from CSS custom properties (defined in orc-demo.css)
	const styles = getComputedStyle(document.documentElement)
	const camX = parseFloat(styles.getPropertyValue("--orc-camera-x")) || 0
	const camY = parseFloat(styles.getPropertyValue("--orc-camera-y")) || 7
	const camZ = parseFloat(styles.getPropertyValue("--orc-camera-z")) || 2
	const sceneOffsetX =
		parseFloat(styles.getPropertyValue("--orc-scene-offset-x")) || 0

	// Position camera for a top-down isometric view so satellites are not occluded
	orcDemoCamera.position.set(camX, camY, camZ)
	orcDemoCamera.lookAt(sceneOffsetX, 0, 0)

	// New: Add OrbitControls for the ORC demo camera
	orcDemoControls = new OrbitControls(orcDemoCamera, orcDemoRenderer.domElement)
	orcDemoControls.enableDamping = true
	orcDemoControls.dampingFactor = 0.05
	orcDemoControls.screenSpacePanning = false
	orcDemoControls.minDistance = 1
	orcDemoControls.maxDistance = 15
	orcDemoControls.maxPolarAngle = Math.PI / 2 // Prevent camera from going below the planet
	orcDemoControls.target.set(sceneOffsetX, 0, 0) // Center controls on scene offset

	// 4. Add content
	orcDemoScene.add(new THREE.AmbientLight(0xffffff, 0.6))
	const keyLight = new THREE.DirectionalLight(0xffffff, 0.8)
	keyLight.position.set(3, 3, 3)
	orcDemoScene.add(keyLight)

	// This creates the orcGroup and satellites at the module level in orcScene.js
	const orcGroupForDemo = createOrcScene()
	orcGroupForDemo.position.x = sceneOffsetX // Apply scene offset from CSS
	orcDemoScene.add(orcGroupForDemo)

	// Create and add selection indicator
	selectionIndicator = createSelectionIndicator()
	orcDemoScene.add(selectionIndicator)

	// 5. Start animation loop
	function animateOrcDemo() {
		orcDemoRequestId = requestAnimationFrame(animateOrcDemo)
		// Animate the ORC scene (satellites orbiting)
		animateOrcScene(true)

		// Update indicator position to follow the selected satellite
		if (selectedSatellite && selectionIndicator) {
			const worldPos = new THREE.Vector3()
			selectedSatellite.getWorldPosition(worldPos)
			selectionIndicator.position.copy(worldPos)
		}

		// Camera tracking for decommissioning satellites
		const decommState = getDecommissionState()
		if (decommState) {
			// Start tracking if not already
			if (!isCameraTracking) {
				isCameraTracking = true
				// Store original camera state for reset later
				originalCameraState = {
					position: orcDemoCamera.position.clone(),
					target: orcDemoControls.target.clone(),
				}
			}

			// Calculate target camera position - follow satellite with zoom
			const satPos = decommState.position.clone()
			// Add orcGroup offset to satellite position (planet center in world space)
			const planetCenter = new THREE.Vector3(orcGroup.position.x, 0, 0)
			satPos.x += orcGroup.position.x

			const config = decommState.config

			// Camera should be positioned to keep satellite centered in VISIBLE area
			// The sidebar takes 1/3 of screen on the right, so we offset the camera
			// to center the satellite in the left 2/3
			const sidebarCompensation = 0.4 // World units to shift target right
			const adjustedTarget = satPos.clone()
			adjustedTarget.x += sidebarCompensation

			// Calculate direction from planet center to satellite (in world space)
			const dirFromCenter = satPos.clone().sub(planetCenter).normalize()

			// Use different zoom distances based on phase
			const targetDistance = decommState.targetZoomDistance

			// Camera offset: position camera on the opposite side of satellite from planet
			// This ensures the satellite is ALWAYS between camera and planet (never occluded)
			const cameraOffset = dirFromCenter.clone().multiplyScalar(targetDistance)
			cameraOffset.y += targetDistance * 0.3 // Slight vertical offset for better view

			// Target camera position: satellite position + offset (away from planet)
			const targetCamPos = satPos.clone().add(cameraOffset)

			// Check for potential occlusion: is the planet between camera and satellite?
			// We detect this by checking if moving toward target would cross the planet
			const currentCamPos = orcDemoCamera.position.clone()
			const camToSat = satPos.clone().sub(currentCamPos)
			const camToPlanet = planetCenter.clone().sub(currentCamPos)

			// Project planet center onto camera-to-satellite line
			const camToSatLength = camToSat.length()
			const projLength = camToPlanet.dot(camToSat.normalize())

			// Planet radius for occlusion check (approximate)
			const PLANET_RADIUS = 0.5
			const OCCLUSION_MARGIN = 0.15 // Extra margin to prevent near-misses

			// Check if planet is between camera and satellite AND close to the line of sight
			let isOccluded = false
			if (projLength > 0 && projLength < camToSatLength) {
				// Planet center is between camera and satellite (along the line)
				// Check perpendicular distance from planet center to line of sight
				const closestPointOnLine = currentCamPos
					.clone()
					.add(camToSat.normalize().multiplyScalar(projLength))
				const perpDistance = planetCenter.distanceTo(closestPointOnLine)
				isOccluded = perpDistance < PLANET_RADIUS + OCCLUSION_MARGIN
			}

			// Use appropriate camera speed based on phase and occlusion
			let cameraSpeed = decommState.cameraSpeed

			if (isOccluded) {
				// Satellite would be occluded - move camera much faster to maintain visibility
				// Use a high lerp factor to quickly reposition around the planet
				cameraSpeed = 0.15
			}

			// Smooth camera transition - lerp toward target
			orcDemoCamera.position.lerp(targetCamPos, cameraSpeed)

			// Look at adjusted target to keep satellite in visible center
			orcDemoControls.target.lerp(adjustedTarget, cameraSpeed * 2)
		} else if (isCameraTracking && originalCameraState) {
			// Decommission finished - reset camera smoothly
			const resetSpeed = getDecommissionConfig().cameraResetSpeed

			orcDemoCamera.position.lerp(originalCameraState.position, resetSpeed)
			orcDemoControls.target.lerp(originalCameraState.target, resetSpeed)

			// Check if camera is close enough to original position
			const posDistance = orcDemoCamera.position.distanceTo(
				originalCameraState.position
			)
			const targetDistance = orcDemoControls.target.distanceTo(
				originalCameraState.target
			)

			if (posDistance < 0.05 && targetDistance < 0.05) {
				// Snap to exact position and clear tracking state
				orcDemoCamera.position.copy(originalCameraState.position)
				orcDemoControls.target.copy(originalCameraState.target)
				isCameraTracking = false
				originalCameraState = null
			}
		}

		orcDemoControls.update() // Update ORC demo controls
		orcDemoRenderer.render(orcDemoScene, orcDemoCamera)
	}
	animateOrcDemo()
}

// Destroy the ORC demo
function destroyOrcDemo() {
	if (!orcDemoContainer) return

	if (orcDemoRequestId) {
		cancelAnimationFrame(orcDemoRequestId)
		orcDemoRequestId = null
	}

	disposeOrcScene() // Disposes the module-level orcGroup

	if (orcDemoRenderer) {
		orcDemoRenderer.dispose()
		orcDemoRenderer = null
	}

	if (orcDemoContainer) {
		document.body.removeChild(orcDemoContainer)
		orcDemoContainer = null
	}

	orcDemoScene = null
	orcDemoCamera = null
	orcDemoControls = null // Dispose controls
	selectionIndicator = null
	selectedSatellite = null
}

// Reset button for ORC demo
let orcResetButton = null

function createOrcResetButton() {
	if (orcResetButton) return

	orcResetButton = document.createElement("button")
	orcResetButton.id = "orc-reset-button"
	orcResetButton.textContent = "Reset"
	Object.assign(orcResetButton.style, {
		position: "fixed",
		left: "100px", // Next to home button
		top: "12px",
		zIndex: "10000",
		padding: "8px 14px",
		background: "rgba(0,0,0,0.6)",
		color: "white",
		border: "1px solid rgba(255,255,255,0.08)",
		borderRadius: "4px",
		font: "600 14px sans-serif",
		cursor: "pointer",
		backdropFilter: "blur(4px)",
		transition: "background 0.2s ease, box-shadow 0.2s ease",
		display: "none",
	})

	// Hover effects
	orcResetButton.addEventListener("mouseenter", () => {
		orcResetButton.style.background = "rgba(0,100,150,0.7)"
		orcResetButton.style.boxShadow = "0 0 12px rgba(0,200,255,0.4)"
	})
	orcResetButton.addEventListener("mouseleave", () => {
		orcResetButton.style.background = "rgba(0,0,0,0.6)"
		orcResetButton.style.boxShadow = "none"
	})

	orcResetButton.addEventListener("click", () => {
		window.location.reload()
	})
	document.body.appendChild(orcResetButton)
}

function showOrcResetButton() {
	if (!orcResetButton) createOrcResetButton()
	if (orcResetButton) orcResetButton.style.display = "block"
}

function hideOrcResetButton() {
	if (orcResetButton) orcResetButton.style.display = "none"
}

// === Global functions for HTML onclick handlers ===
// These are called by inline onclick in orc-demo.html
window.orcDontSuck = function () {
	console.log("Gemini doesn't suck")
}

window.orcSelectSatellite = function (satId) {
	console.log("[DEBUG] Satellite selected via onclick, satId:", satId)
	const targetSat = satellites.find((s) => s.userData.id === satId)
	if (targetSat) {
		selectedSatellite = targetSat
		selectionIndicator.visible = true
		updateSelectedSatelliteInfo(targetSat.userData.id)
		updateAvailableSatellitesHighlight()
		updateDecommissionActionState()
		// Show tether for George (geosynchronous satellite)
		if (satId === "geo-001") {
			showGeoTether()
		} else {
			hideGeoTether()
		}
	}
}

window.orcDecommissionSatellite = function () {
	console.log(
		"Decommission list item clicked (window.orcDecommissionSatellite)."
	)
	if (selectedSatellite && !selectedSatellite.userData.decommissioning) {
		startDecommission(selectedSatellite)
		updateDecommissionActionState()
		updateSelectedSatelliteInfo(selectedSatellite.userData.id)
	}
}

// Update the decommission action list item state based on selection
function updateDecommissionActionState() {
	const decommissionAction = document.getElementById("decommission-action")
	if (!decommissionAction) return

	if (!selectedSatellite) {
		// No satellite selected - disable
		decommissionAction.classList.add("disabled")
		decommissionAction.classList.remove("decommissioning")
		decommissionAction.textContent = "Decommission"
		decommissionAction.disabled = true
	} else if (selectedSatellite.userData.decommissioning) {
		// Satellite is decommissioning
		decommissionAction.classList.remove("disabled")
		decommissionAction.classList.add("decommissioning")
		decommissionAction.textContent = "Decommissioning..."
		decommissionAction.disabled = true
	} else {
		// Satellite is selected and operational - enable
		decommissionAction.classList.remove("disabled")
		decommissionAction.classList.remove("decommissioning")
		decommissionAction.textContent = "Decommission"
		decommissionAction.disabled = false
	}
}

// === Available Satellites Pane (loads HTML from file) ===
async function showAvailableSatellitesPane() {
	if (!orcInfoPane) {
		// Fetch the HTML template
		const response = await fetch("/src/content/orc-demo/orc-demo.html")
		const html = await response.text()

		// Create a temporary container to parse the HTML
		const temp = document.createElement("div")
		temp.innerHTML = html

		// Get the orc-info-pane element from the template
		orcInfoPane = temp.querySelector("#orc-info-pane")
		if (!orcInfoPane) {
			console.error("Could not find #orc-info-pane in orc-demo.html")
			return
		}

		// Populate the satellite list
		const list = orcInfoPane.querySelector("#satellite-list")
		if (list) {
			const sortedSatellites = [...satellites].sort(
				(a, b) => a.userData.orbitIndex - b.userData.orbitIndex
			)
			sortedSatellites.forEach((sat) => {
				const listItem = document.createElement("li")
				listItem.textContent = sat.userData.name
				listItem.dataset.satelliteId = sat.userData.id
				listItem.className = "satellite-list-item"

				// Add color class based on ID prefix
				if (sat.userData.id.startsWith("leo")) {
					listItem.classList.add("sat-leo")
				} else if (sat.userData.id.startsWith("geo")) {
					listItem.classList.add("sat-geo")
				} else if (sat.userData.id.startsWith("mol")) {
					listItem.classList.add("sat-mol")
				}

				// Use inline onclick to call global function
				listItem.setAttribute(
					"onclick",
					`window.orcSelectSatellite('${sat.userData.id}')`
				)
				list.appendChild(listItem)
			})
		}

		// Wire up decommission action click handler
		const decommissionAction = orcInfoPane.querySelector("#decommission-action")
		if (decommissionAction) {
			console.log("Running decommissionAction")
			decommissionAction.addEventListener(
				"click",
				window.orcDecommissionSatellite
			)
			//window.orcDecommissionSatellite()
		}

		updateAvailableSatellitesHighlight()

		document.body.appendChild(orcInfoPane)
	}

	orcInfoPane.style.display = "block"
	requestAnimationFrame(() => {
		orcInfoPane.style.opacity = "1"
	})
}

function updateAvailableSatellitesHighlight() {
	if (!orcInfoPane) return

	const hasSatellites = satellites.length > 0
	const showHelp = hasSatellites && !selectedSatellite

	// Toggle selection pulse on the list container
	const list = orcInfoPane.querySelector("#satellite-list")
	if (list) {
		if (showHelp) list.classList.add("selection-needed")
		else list.classList.remove("selection-needed")
	}

	const items = orcInfoPane.querySelectorAll(".satellite-list-item")
	items.forEach((item) => {
		if (
			selectedSatellite &&
			item.dataset.satelliteId === selectedSatellite.userData.id
		) {
			item.classList.add("selected")
		} else {
			item.classList.remove("selected")
		}
	})

	// Update help text visibility
	const helpText = document.getElementById("satellite-help-text")
	if (helpText) {
		helpText.style.display = showHelp ? "block" : "none"
	}
}

// Handle satellite removal after decommission completes
window.addEventListener("satelliteRemoved", (event) => {
	const { satelliteId } = event.detail
	// If the removed satellite was selected, deselect it
	if (selectedSatellite && selectedSatellite.userData.id === satelliteId) {
		selectedSatellite = null
		if (selectionIndicator) {
			selectionIndicator.visible = false
		}
		updateSelectedSatelliteInfo(null)
		updateDecommissionActionState()
	}
	updateAvailableSatellitesHighlight()
})

// Show/hide helpers for Home label
export function showHomeLabel() {
	// We no longer create a 3D Home mesh; ensure the DOM home button is shown.
	try {
		const btn = document.getElementById("home-button")
		if (btn) btn.style.display = "block"
	} catch (e) {}
}

export function hideHomeLabel() {
	// Ensure the DOM home button is hidden.
	try {
		const btn = document.getElementById("home-button")
		if (btn) btn.style.display = "none"
	} catch (e) {}
}

// === Animate Loop ===
export function animate() {
	requestAnimationFrame(animate)
	stars.rotation.y += 0.0008

	// Animate ORC scene if active
	if (orcSceneActive) {
		animateOrcScene()
	}

	// Only update controls when they are explicitly enabled (during label animations)
	if (controls.enabled) {
		controls.update()
	}
	// Keep hover targets synchronized with labels (they're in scene, not pyramidGroup children)
	for (const key in labels) {
		const label = labels[key]
		const hover = hoverTargets[key]
		if (label && hover) {
			// Get label's world position (since labels are children of pyramidGroup)
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
			// Scale hover target based on pyramid scale to maintain appropriate hit area
			const s = new THREE.Vector3()
			label.getWorldScale(s)
			hover.scale.copy(s)
		}
	}
	// continuously update scroll bounds to handle async text loading/layout
	if (activeScrollPlane) updateScrollBounds()
	renderer.render(scene, camera)
}

// === Resize ===
window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)

	const aboutPlane = scene.getObjectByName("aboutPlane")
	if (aboutPlane) scene.remove(aboutPlane)
	const portfolioPlane = scene.getObjectByName("portfolioPlane")
	if (portfolioPlane) scene.remove(portfolioPlane)
})

// === Custom Scrollbar & Overlay ===
let scrollOverlay = null
let scrollTrack = null
let scrollThumb = null
let activeScrollPlane = null
let scrollMinY = 0.0
let scrollMaxY = 0.0

function setupContentScrolling(plane) {
	activeScrollPlane = plane
	// Initial bounds check
	updateScrollBounds()

	// Create overlay if it doesn't exist
	if (!scrollOverlay) scrollOverlay = document.getElementById("content-overlay")
	if (!scrollOverlay) {
		scrollOverlay = document.createElement("div")
		scrollOverlay.id = "content-overlay"
		Object.assign(scrollOverlay.style, {
			position: "absolute",
			top: "25%",
			bottom: "0",
			left: "0",
			right: "0",
			zIndex: "10",
			display: "none",
			pointerEvents: "none", // Allow clicks to pass through to 3D scene
		})
		// Stop propagation of clicks to prevent "go home" reset
		scrollOverlay.addEventListener("pointerdown", (e) => e.stopPropagation())
		scrollOverlay.addEventListener("click", (e) => e.stopPropagation())
		scrollOverlay.addEventListener("mousedown", (e) => e.stopPropagation())
		scrollOverlay.addEventListener("touchstart", (e) => e.stopPropagation())
		scrollOverlay.addEventListener("wheel", handleScrollWheel, {
			passive: false,
		})

		// Scrollbar Track
		scrollTrack = document.createElement("div")
		Object.assign(scrollTrack.style, {
			position: "absolute",
			top: "10px",
			bottom: "10px",
			right: "10px",
			width: "8px",
			background: "rgba(255, 255, 255, 0.1)",
			borderRadius: "4px",
			cursor: "pointer",
			pointerEvents: "auto", // Re-enable events for the scrollbar itself
		})

		// Scrollbar Thumb
		scrollThumb = document.createElement("div")
		Object.assign(scrollThumb.style, {
			position: "absolute",
			top: "0",
			left: "0",
			width: "100%",
			height: "20%",
			background: "rgba(255, 255, 255, 0.5)",
			borderRadius: "4px",
			cursor: "grab",
		})

		// Drag logic for thumb
		let isDragging = false
		let startY = 0
		let startTop = 0

		scrollThumb.addEventListener("pointerdown", (e) => {
			e.stopPropagation()
			e.target.setPointerCapture(e.pointerId)
			isDragging = true
			startY = e.clientY
			startTop = scrollThumb.offsetTop
			scrollThumb.style.cursor = "grabbing"
		})

		scrollThumb.addEventListener("pointermove", (e) => {
			if (!isDragging) return
			e.stopPropagation()
			const deltaY = e.clientY - startY
			const trackHeight = scrollTrack.clientHeight
			const thumbHeight = scrollThumb.clientHeight
			const maxTop = trackHeight - thumbHeight

			let newTop = startTop + deltaY
			newTop = Math.max(0, Math.min(newTop, maxTop))

			// Update 3D plane
			const ratio = maxTop > 0 ? newTop / maxTop : 0
			if (activeScrollPlane && scrollMaxY > scrollMinY) {
				activeScrollPlane.position.y =
					scrollMinY + ratio * (scrollMaxY - scrollMinY)
			}
			updateScrollThumb()
		})

		scrollThumb.addEventListener("pointerup", (e) => {
			isDragging = false
			scrollThumb.style.cursor = "grab"
			e.target.releasePointerCapture(e.pointerId)
		})

		scrollTrack.appendChild(scrollThumb)
		scrollOverlay.appendChild(scrollTrack)
		document.body.appendChild(scrollOverlay)
	}

	scrollOverlay.style.display = "block"
	updateScrollThumb()
}

function hideContentScrolling() {
	if (scrollOverlay) scrollOverlay.style.display = "none"
	activeScrollPlane = null
}

function updateScrollBounds() {
	if (!activeScrollPlane) return
	// Re-calculate bounds every frame to handle async text loading
	const box = new THREE.Box3().setFromObject(activeScrollPlane)
	const h = box.max.y - box.min.y
	if (h === -Infinity || isNaN(h)) return

	// Visible area is roughly from y=-2.8 to y=+2.8 (height ~5.6)
	// Plane starts at -0.5. We want to scroll UP until bottom of content (y=-h)
	// is at bottom of screen (y=-2.8).
	// Target Y = h - 1.5. (Increased buffer to ensure bottom is fully visible)
	const targetY = h - 1.5
	scrollMinY = 0.0
	scrollMaxY = Math.max(0.0, targetY)

	// If not dragging, ensure we stay in bounds (e.g. if content shrinks)
	if (activeScrollPlane.position.y > scrollMaxY)
		activeScrollPlane.position.y = scrollMaxY

	updateScrollThumb()
}

function handleScrollWheel(e) {
	if (!activeScrollPlane) return
	e.preventDefault()
	e.stopPropagation()
	activeScrollPlane.position.y += e.deltaY * 0.005
	// Clamp
	if (activeScrollPlane.position.y < scrollMinY)
		activeScrollPlane.position.y = scrollMinY
	if (activeScrollPlane.position.y > scrollMaxY)
		activeScrollPlane.position.y = scrollMaxY
	updateScrollThumb()
}

function updateScrollThumb() {
	if (!activeScrollPlane || !scrollThumb || !scrollTrack) return
	const range = scrollMaxY - scrollMinY
	if (range <= 0.001) {
		scrollThumb.style.height = "100%"
		scrollThumb.style.top = "0"
		return
	}
	const progress = (activeScrollPlane.position.y - scrollMinY) / range
	const trackHeight = scrollTrack.clientHeight
	// Dynamic thumb height based on content ratio
	const visibleH = 5.6
	const contentH = range + visibleH
	let thumbHeight = (visibleH / contentH) * trackHeight
	thumbHeight = Math.max(30, Math.min(thumbHeight, trackHeight))

	scrollThumb.style.height = `${thumbHeight}px`
	const maxTop = trackHeight - thumbHeight
	scrollThumb.style.top = `${progress * maxTop}px`
}

// Global wheel listener for when mouse is over canvas but content is active
window.addEventListener(
	"wheel",
	(e) => {
		if (currentSection && activeScrollPlane) {
			handleScrollWheel(e)
		}
	},
	{ passive: false }
)
