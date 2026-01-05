import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import {
	makeAboutPlane,
	makePortfolioPlane,
	makeBlogPlane,
	makeContactLabelPlane,
	makeLabelPlane,
} from "./planes.js"
import {
	loadContentHTML,
	parseAboutContent,
	parseBlogPosts,
} from "./contentLoader.js"
import {
	createOrcScene,
	animateOrcScene,
	satellites,
	startDecommission,
	cancelDecommission,
	canCancelDecommission,
	disposeOrcScene,
	orcGroup,
	createOrcPreview,
	showGeoTether,
	hideGeoTether,
	getDecommissionState,
	getDecommissionConfig,
	orcHandStateMachine,
	setOrcHand,
	releaseOrcHand,
} from "./content/orc-demo/orc-demo.js"
import { createOrcHand } from "./content/orc-demo/orc-hand.js"
import { LayoutManager } from "./core/LayoutManager.js"
import "./content/home/home.css"
import "./content/about/about.css"
import "./content/blog/blog.css"
import "./content/portfolio/portfolio.css"
import "./content/orc-demo/orc-demo.css"

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

// Layout manager for responsive 3D positioning
export const layoutManager = new LayoutManager(camera)

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

// Helper function to convert 2D screen coordinates to 3D world coordinates
export function screenToWorld(screenX, screenY, targetZ = 0) {
	const ndcX = (screenX / window.innerWidth) * 2 - 1
	const ndcY = -(screenY / window.innerHeight) * 2 + 1

	// Calculate the intersection point with a plane at targetZ (e.g., z=0 for labels)
	const raycaster = new THREE.Raycaster()
	raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera)

	// Define a plane at the target Z depth (e.g., where labels typically reside)
	const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -targetZ)
	const intersectionPoint = new THREE.Vector3()
	const result = raycaster.ray.intersectPlane(plane, intersectionPoint)
	return result || new THREE.Vector3(0, 0, targetZ)
}

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
		color: 0x111111,
		metalness: 0.8,
		roughness: 0.4,
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

// === Pyramid Base (closes the pyramid to make it a solid, opaque shape) ===
const baseGeom = new THREE.BufferGeometry()
// Base triangle uses v1, v2, v3 in reverse order (v3, v2, v1) so the normal points downward (inside the pyramid)
baseGeom.setAttribute(
	"position",
	new THREE.BufferAttribute(
		new Float32Array([v3.x, v3.y, v3.z, v2.x, v2.y, v2.z, v1.x, v1.y, v1.z]),
		3
	)
)
baseGeom.computeVertexNormals()

const baseMat = new THREE.MeshStandardMaterial({
	color: 0x111111,
	metalness: 0.8,
	roughness: 0.4,
	side: THREE.DoubleSide,
	transparent: false,
	opacity: 1,
	depthWrite: true,
	depthTest: true,
})

const baseMesh = new THREE.Mesh(baseGeom, baseMat)
// Add edges to base for visual consistency
const baseEdges = new THREE.EdgesGeometry(baseGeom)
baseMesh.add(
	new THREE.LineSegments(
		baseEdges,
		new THREE.LineBasicMaterial({ color: 0xffffff })
	)
)
pyramidGroup.add(baseMesh)

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
let orcDemoContainer = null
let orcDemoRenderer = null
let orcDemoScene = null
let orcDemoCamera = null
let orcDemoRequestId = null
let orcDemoControls = null
let selectionIndicator = null
let selectedSatellite = null

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
			m.material.envMapIntensity = 0
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
		position: { x: -1.0, y: 0.04, z: 0.53 },
		rotation: { x: -0.1, y: 0.438, z: 1 },
		pyramidCenteredSize: [2.4, 0.6],
		pyramidUncenteredSize: [2.4, 0.6],
	},
	Portfolio: {
		text: "Portfolio",
		position: { x: 1.02, y: 0, z: 0.6 },
		rotation: { x: 0.1, y: -0.6, z: -0.95 },
		pyramidCenteredSize: [2.4, 0.6],
		pyramidUncenteredSize: [2.4, 0.6],
	},
	Blog: {
		text: "Blog",
		position: { x: 0, y: -1.7, z: 1.0 },
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
	lines: ["james.tasse@gmail.com", "(216)-219-1538"],
	revealedTextAlign: "left",
	revealedTitleFontSize: 80,
	revealedBodyFontSize: 60,
	// Starting position (hidden below pyramid)
	hiddenPosition: { x: 0, y: -1.8, z: 0.8 },
	// Revealed position (front & center of pyramid face)
	revealedPosition: { x: 0, y: -0.28, z: 0.9 }, // Centered on pyramid face
	revealedRotation: { x: -0.3, y: 0, z: 0 },
	revealedSize: [2.26, 1.15], // Taller height to accommodate tooltips
	// Phone number offset (aligns with email text, after icon+gap)
	phoneOffsetX: 75,
	// Tooltip configuration (hover state)
	tooltipText: "Click to copy email address",
	tooltipFontSize: 48,
	tooltipColor: "#4da6ff",
	tooltipBgColor: "rgba(0, 0, 0, 0.85)",
	tooltipPadding: 0,
	tooltipBorderRadius: 2,
	tooltipOffsetX: -5,
	tooltipOffsetY: -1,
	tooltipSlideDistance: 50,
	tooltipAnimationDuration: 200,
	// Email hover color (matches tooltip by default)
	emailHoverColor: "#4da6ff",
	// Toast configuration (after click)
	toastText: "Copied!",
	toastFontSize: 48,
	toastColor: "#08a13b",
	toastBgColor: "rgba(0, 0, 0, 0.85)",
	toastPadding: 0,
	toastBorderRadius: 2,
	toastOffsetX: 0.5,
	toastOffsetY: -1,
	toastSlideDistance: 50,
	toastDuration: 2000,
	toastAnimationDuration: 200,
	// Collapsed state (when moved to left)
	collapsedSize: [2.4, 0.6],
	// Expanded state (when moved to left)
	leftExpandedSize: [2.4, 1.4],
}

// Contact label mesh (created in initContactLabel)
export let contactLabel = null
export let contactDetails = null
let contactVisible = false

// Initialize contact label
export function initContactLabel() {
	if (contactLabel) return // Already initialized

	const cfg = contactConfig

	// 1. Create the main "Contact" label using the standard label generator
	// This ensures it looks exactly like About/Blog/Portfolio
	contactLabel = makeLabelPlane("Contact", 2.4, 0.6)
	contactLabel.position.set(
		cfg.hiddenPosition.x,
		cfg.hiddenPosition.y,
		cfg.hiddenPosition.z
	)
	contactLabel.rotation.set(
		cfg.revealedRotation.x,
		cfg.revealedRotation.y,
		cfg.revealedRotation.z
	)
	contactLabel.material.opacity = 0
	contactLabel.visible = false
	contactLabel.userData.name = "Contact"
	pyramidGroup.add(contactLabel)

	// 2. Create the details pane (Email/Phone) separately
	contactDetails = makeContactLabelPlane(cfg)
	contactDetails.position.copy(contactLabel.position)
	contactDetails.rotation.copy(contactLabel.rotation)
	// Position details below the label
	contactDetails.position.y -= 0.6
	contactDetails.material.opacity = 0
	contactDetails.visible = false
	contactDetails.userData.name = "ContactDetails"
	pyramidGroup.add(contactDetails)
}

// Show contact label with slide-up animation (when pyramid is centered)
export function showContactLabelCentered() {
	if (!contactLabel || contactVisible) return
	contactVisible = true

	// Ensure both are attached to pyramidGroup
	if (contactLabel.parent !== pyramidGroup) pyramidGroup.add(contactLabel)
	if (contactDetails.parent !== pyramidGroup) pyramidGroup.add(contactDetails)

	const cfg = contactConfig
	contactLabel.visible = true
	contactDetails.visible = true
	contactLabel.scale.set(1, 1, 1)
	contactDetails.scale.set(1, 1, 1)

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

		// Details follow relative to label
		contactDetails.position.copy(contactLabel.position)
		contactDetails.position.y -= 0.7 // Offset below label
		contactDetails.material.opacity = eased

		if (t < 1) {
			requestAnimationFrame(animateSlideUp)
		}
	}
	requestAnimationFrame(animateSlideUp)
}

// Calculate position for contact label on the left side
function getContactLeftPosition() {
	// Use the uniform flattened position for Contact
	const pos = flattenedLabelPositions.Contact
	return new THREE.Vector3(pos.x, pos.y, pos.z)
}

// Move contact label to left side (when pyramid moves to top nav)
export function moveContactLabelToLeft() {
	if (!contactLabel) return

	// Hide details initially when moving to nav
	if (contactDetails) {
		contactDetails.visible = false
	}

	// Ensure visible
	contactLabel.visible = true
	contactLabel.material.opacity = 1
	contactVisible = true

	const cfg = contactConfig

	// Get world position before re-parenting
	contactLabel.updateMatrixWorld()
	const startPos = new THREE.Vector3()
	contactLabel.getWorldPosition(startPos)
	const startQuat = new THREE.Quaternion()
	contactLabel.getWorldQuaternion(startQuat)
	const startScale = contactLabel.scale.clone()

	// Detach from pyramid group and add to scene for fixed positioning
	if (contactLabel.parent !== scene) {
		scene.add(contactLabel)
	}
	contactLabel.position.copy(startPos)
	contactLabel.quaternion.copy(startQuat)
	contactLabel.scale.copy(startScale)

	const endPos = getContactLeftPosition()
	const endQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0))

	// Standard label scale
	const endScale = new THREE.Vector3(1, 1, 1)

	const duration = 500
	const startTime = performance.now()

	function animateToLeft(time) {
		const elapsed = time - startTime
		const t = Math.min(elapsed / duration, 1)
		const eased = 1 - Math.pow(1 - t, 3)

		contactLabel.position.lerpVectors(startPos, endPos, eased)
		contactLabel.quaternion.slerpQuaternions(startQuat, endQuat, eased)
		contactLabel.scale.lerpVectors(startScale, endScale, eased)

		if (t < 1) {
			requestAnimationFrame(animateToLeft)
		}
	}
	requestAnimationFrame(animateToLeft)
}

// Animation state for contact expansion
let contactExpandAnim = null
let contactHideTimer = null

// Helper to perform the actual expansion animation
function performContactExpansion(expanded) {
	if (!contactLabel || !contactDetails || contactLabel.parent !== scene) return

	// Avoid redundant updates
	if (contactLabel.userData.isExpanded === expanded) return
	contactLabel.userData.isExpanded = expanded

	if (contactExpandAnim) cancelAnimationFrame(contactExpandAnim)

	// New offsets for tighter positioning
	const baseOffset = -0.2
	const slideOffset = -0.5

	// Ensure details are in the scene (not pyramidGroup) so they render with the label
	if (expanded) {
		if (contactDetails.parent !== scene) {
			scene.add(contactDetails)
			// Position details below the label
			contactDetails.position.copy(contactLabel.position)
			contactDetails.position.y += baseOffset
			contactDetails.rotation.copy(contactLabel.rotation)
			contactDetails.scale.set(1, 1, 1)
		}
		contactDetails.visible = true
	}

	const duration = 200
	const startTime = performance.now()
	const startAlpha = contactDetails.material.opacity
	const endAlpha = expanded ? 1 : 0

	function animateExpand(time) {
		const elapsed = time - startTime
		const t = Math.min(elapsed / duration, 1)
		const eased = t // Linear is fine for short hover transitions

		// Fade details in/out
		contactDetails.material.opacity =
			startAlpha + (endAlpha - startAlpha) * eased

		// Slide details down slightly
		const currentSlide = expanded ? slideOffset : 0
		contactDetails.position.y =
			contactLabel.position.y + baseOffset + currentSlide * eased

		if (t < 1) {
			contactExpandAnim = requestAnimationFrame(animateExpand)
		} else {
			contactExpandAnim = null
			// Final state cleanup
			if (!expanded) {
				contactDetails.visible = false
			}
		}
	}
	contactExpandAnim = requestAnimationFrame(animateExpand)
}

// Toggle contact label expansion state (called on hover when in left position)
export function setContactExpanded(expanded) {
	if (!contactLabel || !contactDetails || contactLabel.parent !== scene) return

	if (expanded) {
		// User is hovering: cancel any pending hide timer and expand immediately
		if (contactHideTimer) {
			clearTimeout(contactHideTimer)
			contactHideTimer = null
		}
		if (!contactLabel.userData.isExpanded) {
			performContactExpansion(true)
		}
	} else {
		// User left hover: start timer to hide
		// If already collapsed or timer running, do nothing
		if (!contactLabel.userData.isExpanded || contactHideTimer) return

		contactHideTimer = setTimeout(() => {
			performContactExpansion(false)
			contactHideTimer = null
		}, 2000)
	}
}

// Hide contact label
export function hideContactLabel() {
	if (!contactLabel) return

	if (contactHideTimer) {
		clearTimeout(contactHideTimer)
		contactHideTimer = null
	}

	const cfg = contactConfig
	const duration = 400
	const startTime = performance.now()
	const startOpacity = contactLabel.material.opacity

	function animateFadeOut(time) {
		const elapsed = time - startTime
		const t = Math.min(elapsed / duration, 1)

		contactLabel.material.opacity = startOpacity * (1 - t)
		if (contactDetails) contactDetails.material.opacity = startOpacity * (1 - t)

		if (t >= 1) {
			contactLabel.visible = false
			contactVisible = false
			// Reset to pyramid group and hidden position
			if (contactLabel.parent === scene) {
				scene.remove(contactLabel)
				pyramidGroup.add(contactLabel)
			}
			if (contactDetails && contactDetails.parent === scene) {
				scene.remove(contactDetails)
				pyramidGroup.add(contactDetails)
			}

			contactLabel.position.set(
				cfg.hiddenPosition.x,
				cfg.hiddenPosition.y,
				cfg.hiddenPosition.z
			)
			contactLabel.scale.set(1, 1, 1)

			if (contactDetails) {
				contactDetails.visible = false
				contactDetails.position.copy(contactLabel.position)
				contactDetails.rotation.copy(contactLabel.rotation)
			}

			contactLabel.userData.isExpanded = false
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

// === Roaming Hand of ORC ===
// The website is one continuous horizontal scene. Pages exist at different x-coordinates.
// The hand physically moves between pages when navigating.

const pageOrder = ["home", "about", "blog", "portfolio", "orc-demo"]
const pageXPositions = {
	home: -4,
	about: -2,
	blog: 0,
	portfolio: 2,
	"orc-demo": 4,
}

let roamingHand = null
let currentHandPage = "home"
let isHandAnimating = false
let handEntryTimeoutId = null
let handHasEntered = false // Track if hand has done initial entry

// Initialize the roaming hand
export function initRoamingHand() {
	if (roamingHand) return // Already initialized

	roamingHand = createOrcHand(5) // Scale factor of 5
	roamingHand.name = "roamingHand"
	// Start off-screen to the right, behind content (z: -2)
	roamingHand.position.set(10, 0, -2)
	// Orient the hand so it looks like it's flying (palm facing down, fingers forward)
	roamingHand.rotation.set(0, -Math.PI / 2, 0)
	scene.add(roamingHand)
}

// Get the roaming hand for ORC demo to use
export function getRoamingHand() {
	return roamingHand
}

// Fly hand in from the right edge (initial home page entrance)
export function flyHandIn() {
	if (!roamingHand || handHasEntered) return

	handHasEntered = true
	isHandAnimating = true

	const startX = 10 // Off-screen right
	const endX = 5 // Visible on right edge, consistent with page transition rest position
	const duration = 1500

	roamingHand.position.x = startX
	const startTime = performance.now()

	function animateEntry(time) {
		const elapsed = time - startTime
		const t = Math.min(elapsed / duration, 1)
		// Ease out cubic for smooth deceleration
		const eased = 1 - Math.pow(1 - t, 3)

		roamingHand.position.x = startX + (endX - startX) * eased

		if (t < 1) {
			requestAnimationFrame(animateEntry)
		} else {
			isHandAnimating = false
		}
	}
	requestAnimationFrame(animateEntry)
}

// Schedule hand entry after delay (called on home page load)
export function scheduleHandEntry(delayMs = 2000) {
	if (handEntryTimeoutId) {
		clearTimeout(handEntryTimeoutId)
	}
	handEntryTimeoutId = setTimeout(() => {
		flyHandIn()
		handEntryTimeoutId = null
	}, delayMs)
}

// Cancel scheduled hand entry (if user navigates away before it triggers)
export function cancelHandEntry() {
	if (handEntryTimeoutId) {
		clearTimeout(handEntryTimeoutId)
		handEntryTimeoutId = null
	}
}

// Animate hand transition between pages
export function triggerHandPageTransition(fromPage, toPage) {
	if (!roamingHand) return

	const fromIndex = pageOrder.indexOf(fromPage)
	const toIndex = pageOrder.indexOf(toPage)

	if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return

	isHandAnimating = true
	const movingRight = toIndex > fromIndex

	// Animation timing to sync with pyramid animation (600ms total)
	const exitDuration = 300
	const entryDuration = 300

	// Exit: fly off-screen in direction of travel
	const exitX = movingRight ? 10 : -10

	// Entry: appear on opposite side and fly into view
	const entryStartX = movingRight ? -10 : 10
	// Rest at a visible position on the side the hand entered from
	// When entering from left (moving right), rest on left side (x: -5)
	// When entering from right (moving left), rest on right side (x: 5)
	const entryEndX = movingRight ? -5 : 5

	const startX = roamingHand.position.x
	const exitStartTime = performance.now()

	function animateExit(time) {
		const elapsed = time - exitStartTime
		const t = Math.min(elapsed / exitDuration, 1)
		const eased = t * t // Ease in (accelerate)

		roamingHand.position.x = startX + (exitX - startX) * eased

		if (t < 1) {
			requestAnimationFrame(animateExit)
		} else {
			// Teleport to entry position
			roamingHand.position.x = entryStartX
			currentHandPage = toPage
			// Start entry animation
			const entryStartTime = performance.now()
			animateEntryPhase(entryStartTime)
		}
	}

	function animateEntryPhase(entryStartTime) {
		function animateEntry(time) {
			const elapsed = time - entryStartTime
			const t = Math.min(elapsed / entryDuration, 1)
			// Ease out cubic for smooth deceleration
			const eased = 1 - Math.pow(1 - t, 3)

			roamingHand.position.x = entryStartX + (entryEndX - entryStartX) * eased

			if (t < 1) {
				requestAnimationFrame(animateEntry)
			} else {
				isHandAnimating = false
			}
		}
		requestAnimationFrame(animateEntry)
	}

	requestAnimationFrame(animateExit)
}

// Get current hand page
export function getCurrentHandPage() {
	return currentHandPage
}

// Check if hand is currently animating
export function isHandInAnimation() {
	return isHandAnimating
}

// Update idle hand motion (called from animate loop)
function updateHandIdleMotion() {
	if (!roamingHand || isHandAnimating) return
	// Don't apply idle motion when ORC scene is active (state machine handles it)
	if (orcSceneActive) return

	const time = performance.now() * 0.001
	// Gentle bobbing motion
	roamingHand.position.y = Math.sin(time * 0.5) * 0.15
	// Slight swaying
	roamingHand.rotation.z = Math.sin(time * 0.3) * 0.08
}

// Fly hand into ORC scene from the left
function flyHandIntoOrcScene() {
	if (!roamingHand) return

	isHandAnimating = true
	const startX = -10 // Off-screen left
	const endX = 3 // Visible in ORC scene
	const duration = 1200

	roamingHand.position.x = startX
	const startTime = performance.now()

	function animateEntry(time) {
		const elapsed = time - startTime
		const t = Math.min(elapsed / duration, 1)
		// Ease out cubic
		const eased = 1 - Math.pow(1 - t, 3)

		roamingHand.position.x = startX + (endX - startX) * eased

		if (t < 1) {
			requestAnimationFrame(animateEntry)
		} else {
			isHandAnimating = false
		}
	}
	requestAnimationFrame(animateEntry)
}

// Fly hand out of ORC scene to the right (when leaving ORC demo)
export function flyHandOutOfOrcScene(onComplete) {
	if (!roamingHand) {
		if (onComplete) onComplete()
		return
	}

	isHandAnimating = true
	const startX = roamingHand.position.x
	const endX = 10 // Off-screen right
	const duration = 500

	const startTime = performance.now()

	function animateExit(time) {
		const elapsed = time - startTime
		const t = Math.min(elapsed / duration, 1)
		const eased = t * t // Ease in

		roamingHand.position.x = startX + (endX - startX) * eased

		if (t < 1) {
			requestAnimationFrame(animateExit)
		} else {
			isHandAnimating = false
			if (onComplete) onComplete()
		}
	}
	requestAnimationFrame(animateExit)
}

export function initLabels(makeLabelPlane) {
	for (const key in labelConfigs) {
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

	// Hide Home label initially (only visible in top nav)
	if (labels.Home) labels.Home.visible = false

	// Initialize nav layout
	updateNavLayout()
}

// === Pyramid State ===

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
	Home: { x: -5.0, y: 2.5, z: 0 },
	Contact: { x: -3.0, y: 2.5, z: 0 },
	About: { x: -1.0, y: 2.5, z: 0 },
	Blog: { x: 1.0, y: 2.5, z: 0 },
	Portfolio: { x: 3.0, y: 2.5, z: 0 },
}

// Pyramid X positions when centered under each label (match flattenedLabelPositions)
const pyramidXPositions = {
	about: -1.0,
	blog: 1.0,
	portfolio: 3.0,
}

// Track current active section for rotation calculations
let currentSection = null

// Clipping plane to prevent content from overlapping the top nav
const contentClippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 2.1)

let navLabelScale = 1.0

// Update nav layout based on screen size using LayoutManager for responsive positioning
function updateNavLayout() {
	const keys = ["Home", "Contact", "About", "Blog", "Portfolio"]
	const { width, height } = layoutManager.getFrustumDimensions()

	// Calculate Y position: 85% up from center (near top of viewport)
	const navY = height * 0.35  // 0.35 from center = 85% up from bottom

	// Calculate available width with margins (5% on each side)
	const marginPercent = 0.05
	const availableWidth = width * (1 - 2 * marginPercent)
	const startX = -width / 2 + width * marginPercent

	// Label sizing
	const baseLabelWidth = 2.4
	const baseSpacing = 0.1
	const totalStaticWidth = keys.length * baseLabelWidth + (keys.length - 1) * baseSpacing

	// Scale down if labels don't fit
	navLabelScale = 1.0
	if (totalStaticWidth > availableWidth) {
		navLabelScale = availableWidth / totalStaticWidth
	}

	// Apply additional scaling for portrait orientations
	if (layoutManager.isPortrait()) {
		navLabelScale *= 0.85
	}

	const scaledLabelWidth = baseLabelWidth * navLabelScale
	const scaledSpacing = baseSpacing * navLabelScale

	// Position each label from left to right
	keys.forEach((key, i) => {
		if (flattenedLabelPositions[key]) {
			flattenedLabelPositions[key].x =
				startX + scaledLabelWidth / 2 + i * (scaledLabelWidth + scaledSpacing)
			flattenedLabelPositions[key].y = navY
			flattenedLabelPositions[key].z = 0
		}
	})

	// Update pyramid positions to match new label positions
	pyramidXPositions.about = flattenedLabelPositions.About.x
	pyramidXPositions.blog = flattenedLabelPositions.Blog.x
	pyramidXPositions.portfolio = flattenedLabelPositions.Portfolio.x

	// Update flattened pyramid Y position to be just below labels
	flattenedMenuState.positionY = navY - 0.3 * navLabelScale
}

export function getInitialPyramidState() {
	return { ...initialPyramidState }
}

export function animatePyramid(down = true, section = null) {
	// capture a local token for this animation; incrementing global token
	// elsewhere (e.g. reset) will invalidate this animation's completion
	const myToken = ++pyramidAnimToken

	// Show Home label when animating to nav
	if (down && labels.Home) labels.Home.visible = true
	pyramidGroup.visible = true
	const duration = 1000
	const startRotY = pyramidGroup.rotation.y
	const startRotX = pyramidGroup.rotation.x

	// No Y rotation when going to flattened state - pyramid slides horizontally
	// and always points straight down. Only reset Y rotation when returning home.
	const endRotY = down ? startRotY + Math.PI * 2 : initialPyramidState.rotationY
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
				scale: new THREE.Vector3(navLabelScale, navLabelScale, 1),
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

			// Hide Home label if returning to centered state
			if (!down && labels.Home) labels.Home.visible = false
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
				const labelMesh = labels[key]
				if (!labelMesh) continue
				const origPos = labelMesh.userData.origPosition
				const origRot = labelMesh.userData.origRotation
				const origScale = labelMesh.userData.originalScale
				if (origPos) labelMesh.position.copy(origPos)
				if (origRot) labelMesh.rotation.copy(origRot)
				if (origScale) labelMesh.scale.copy(origScale)
				labelMesh.userData.fixedNav = false

				// Ensure Home is hidden after reset
				if (key === "Home") labelMesh.visible = false
			}
		}
	}
	requestAnimationFrame(step)
}

export function showAboutPlane() {
	// Always remove any existing content before showing new content
	hideAllPlanes()
	controls.enableZoom = false

	// Hide navigation bar separator
	const navBar = document.getElementById("content-floor")
	if (navBar) navBar.classList.remove("show")

	// Use DOM overlay instead of 3D canvas texture (hybrid architecture)
	const contentEl = document.getElementById("content")
	if (!contentEl) return

	// Capture current animation token so we can abort if a reset occurs
	const myToken = pyramidAnimToken

	// Load HTML content and display in DOM overlay
	loadContentHTML("about").then((html) => {
		// If a newer pyramid animation/reset occurred, abort adding content
		if (myToken !== pyramidAnimToken) return

		// Wrap content in about-content class for styling
		contentEl.innerHTML = `<div class="about-content">${html}</div>`

		// Show the content overlay (clear inline display style that hideAllPlanes sets)
		contentEl.style.display = ""
		contentEl.classList.add("show")
		contentEl.style.pointerEvents = "auto"
	})
}

export function showPortfolioPlane() {
	// Always remove any existing content before showing new content
	hideAllPlanes()
	controls.enableZoom = false

	// Hide navigation bar separator
	const navBar = document.getElementById("content-floor")
	if (navBar) navBar.classList.remove("show")

	// Use DOM overlay instead of 3D canvas texture (hybrid architecture)
	const contentEl = document.getElementById("content")
	if (!contentEl) return

	const myToken = pyramidAnimToken

	// Load portfolio HTML and display in DOM overlay
	loadContentHTML("portfolio").then((html) => {
		if (myToken !== pyramidAnimToken) return

		// Parse HTML and remove script tag (we'll handle interactions separately)
		const parser = new DOMParser()
		const doc = parser.parseFromString(html, "text/html")
		const scriptEl = doc.querySelector("script")
		if (scriptEl) scriptEl.remove()

		// Inject content into DOM overlay
		contentEl.innerHTML = `<div class="portfolio-content">${doc.body.innerHTML}</div>`

		// Show the content overlay
		contentEl.style.display = ""
		contentEl.classList.add("show")
		contentEl.style.pointerEvents = "auto"

		// Set up click handlers for portfolio items
		setupPortfolioClickHandlers(contentEl)
	})
}

// Helper to extract YouTube video ID from URL
function extractYouTubeID(url) {
	try {
		const u = new URL(url)
		if (u.hostname.includes("youtube.com")) return u.searchParams.get("v")
		if (u.hostname === "youtu.be") return u.pathname.slice(1)
	} catch {
		return null
	}
	return null
}

// Helper to extract Google Docs ID from URL
function extractGoogleDocsID(url) {
	try {
		const u = new URL(url)
		if (u.hostname.includes("docs.google.com")) {
			const match = u.pathname.match(/\/document\/d\/([^/]+)/)
			return match ? match[1] : null
		}
	} catch {
		return null
	}
	return null
}

// Check if URL points to an image
function isImageURL(url) {
	try {
		const u = new URL(url)
		const path = u.pathname.toLowerCase()
		return /\.(png|jpg|jpeg|gif|webp|svg)$/.test(path)
	} catch {
		return false
	}
}

// Set up click handlers for portfolio items (YouTube/Google Docs/images embedding)
function setupPortfolioClickHandlers(contentEl) {
	contentEl.querySelectorAll(".portfolio-item").forEach((item) => {
		item.style.cursor = "pointer"
		item.addEventListener("click", (ev) => {
			ev.preventDefault()
			ev.stopPropagation()
			const link = item.dataset.link
			if (!link) return

			// Check for YouTube
			const ytId = extractYouTubeID(link)
			if (ytId) {
				const embedUrl = `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`
				showEmbedViewer(contentEl, embedUrl)
				return
			}

			// Check for Google Docs
			const docId = extractGoogleDocsID(link)
			if (docId) {
				const embedUrl = `https://docs.google.com/document/d/${docId}/preview`
				showEmbedViewer(contentEl, embedUrl)
				return
			}

			// Check for images
			if (isImageURL(link)) {
				showImageViewer(contentEl, link)
				return
			}

			// For other links, open in new tab
			window.open(link, "_blank")
		})
	})
}

// Show embedded content (YouTube, Google Docs) in the content overlay
function showEmbedViewer(contentEl, embedUrl) {
	contentEl.innerHTML = `
		<div class="embed-wrapper">
			<button class="embed-back-btn">← Back to Portfolio</button>
			<iframe
				src="${embedUrl}"
				width="100%"
				height="600"
				style="border: 1px solid #00ffff; border-radius: 8px;"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowfullscreen
			></iframe>
		</div>
	`
	// Add back button handler
	const backBtn = contentEl.querySelector(".embed-back-btn")
	if (backBtn) {
		backBtn.addEventListener("click", () => showPortfolioPlane())
	}
}

// Show image in the content overlay
function showImageViewer(contentEl, imageUrl) {
	contentEl.innerHTML = `
		<div class="embed-wrapper image-viewer">
			<button class="embed-back-btn">← Back to Portfolio</button>
			<img
				src="${imageUrl}"
				alt="Portfolio image"
				style="max-width: 100%; max-height: 80vh; border: 1px solid #00ffff; border-radius: 8px; display: block; margin: 0 auto;"
			/>
		</div>
	`
	// Add back button handler
	const backBtn = contentEl.querySelector(".embed-back-btn")
	if (backBtn) {
		backBtn.addEventListener("click", () => showPortfolioPlane())
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
	const blogPlane = scene.getObjectByName("blogPlane")
	if (!blogPlane) {
		const myToken = pyramidAnimToken
		// load HTML content and parse blog posts
		loadContentHTML("blog").then((html) => {
			if (myToken !== pyramidAnimToken) return
			// Populate DOM content
			const contentEl = document.getElementById("content")
			if (contentEl) {
				contentEl.innerHTML = html
				contentEl.classList.add("blog-active")
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
		// Ensure DOM content is also shown/active if returning to cached plane
		const contentEl = document.getElementById("content")
		if (contentEl) {
			contentEl.classList.add("blog-active")
		}
	}
}

function hideAbout() {
	// Remove legacy 3D plane if it exists
	const aboutPlane = scene.getObjectByName("aboutPlane")
	if (aboutPlane) scene.remove(aboutPlane)

	// Hide DOM overlay content
	const contentEl = document.getElementById("content")
	if (contentEl && contentEl.querySelector(".about-content")) {
		contentEl.classList.remove("show")
		contentEl.innerHTML = ""
	}
}

function hidePortfolio() {
	// Remove legacy 3D plane if it exists
	const plane = scene.getObjectByName("portfolioPlane")
	if (plane) scene.remove(plane)

	// Hide DOM overlay content
	const contentEl = document.getElementById("content")
	if (contentEl && (contentEl.querySelector(".portfolio-content") || contentEl.querySelector(".embed-wrapper"))) {
		contentEl.classList.remove("show")
		contentEl.innerHTML = ""
	}
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

// Update the info pane with the selected satellite's info
function updateSelectedSatelliteInfo(satelliteId) {
	const statusEl = document.getElementById("selected-satellite-status")
	const idEl = document.getElementById("selected-satellite-display-id")
	const orbitTypeEl = document.getElementById("selected-satellite-orbit-type")
	const infoContainer = document.getElementById("satellite-info-content")
	const noSelectionMsg = document.getElementById("no-satellite-selected")

	if (statusEl && orbitTypeEl && infoContainer && noSelectionMsg) {
		if (selectedSatellite) {
			infoContainer.style.display = "block"
			noSelectionMsg.style.display = "none"

			// Check satellite status - update with info-value class preserved
			if (selectedSatellite.userData.returning) {
				statusEl.textContent = "Returning to orbit"
				statusEl.className = "info-value status-returning"
			} else if (selectedSatellite.userData.decommissioning) {
				statusEl.textContent = "Decommissioning"
				statusEl.className = "info-value status-decommissioning"
			} else {
				statusEl.textContent = "Operational"
				statusEl.className = "info-value status-operational"
			}

			// Update ID field
			if (idEl) idEl.textContent = selectedSatellite.userData.id

			// Lookup orbit type based on ID prefix
			let orbitType = "Unknown"
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
		contentEl.classList.remove("blog-active")
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

	// Show pyramid in flattened state under Portfolio label (ORC demo is part of Portfolio)
	pyramidGroup.visible = true
	pyramidGroup.position.x = pyramidXPositions.portfolio // x: 0
	pyramidGroup.position.y = flattenedMenuState.positionY
	pyramidGroup.scale.set(
		flattenedMenuState.scale,
		flattenedMenuState.scaleY,
		flattenedMenuState.scaleZ
	)
	pyramidGroup.rotation.x = flattenedMenuState.rotationX

	// Move labels to flattened top nav positions
	for (const key in labels) {
		const labelMesh = labels[key]
		if (!labelMesh) continue

		const flatPos = flattenedLabelPositions[key]
		if (flatPos) {
			// Detach from pyramid and add to scene for fixed positioning
			if (labelMesh.parent !== scene) {
				scene.add(labelMesh)
			}
			labelMesh.position.set(flatPos.x, flatPos.y, flatPos.z)
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
	// The hand will be added to the ORC scene after creation
	if (roamingHand && roamingHand.parent === scene) {
		scene.remove(roamingHand)
	}

	// Create the demo scene
	createOrcDemo()
	showAvailableSatellitesPane()

	// Keep main scene camera in place for top nav rendering
	// The ORC demo has its own camera
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

	// Transfer hand to ORC demo scene and set up state machine
	// The hand will fly in from the left after a brief delay
	if (roamingHand) {
		// Position hand off-screen to the left in ORC scene coordinates
		roamingHand.position.set(-10, 0, 4) // z:4 to be in front in ORC scene
		setOrcHand(roamingHand, orcDemoCamera)

		// Animate hand flying in from the left
		setTimeout(() => {
			flyHandIntoOrcScene()
		}, 300) // Small delay for scene to be ready
	}
}

// Return from ORC scene back to pyramid
export function morphFromOrcScene() {
	const myToken = ++pyramidAnimToken

	// Capture camera/controls state BEFORE fading out
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

	// After fade out completes, destroy ORC and show pyramid
	setTimeout(() => {
		if (myToken !== pyramidAnimToken) return

		// Release hand from ORC demo before destroying
		const hand = releaseOrcHand()
		if (hand) {
			// Add hand back to main scene, positioned off-screen right
			// (it will animate in from the right when entering new page)
			hand.position.set(10, 0, -2) // Off-screen right, behind content
			scene.add(hand)
			currentHandPage = "orc-demo" // Will be updated by next page transition
		}

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
				updateCancelDecommissionActionState()
				// Show tether for George (geosynchronous satellite)
				if (clickedObject.userData.id === "geo-001") {
					showGeoTether()
				} else {
					hideGeoTether()
				}
				// Tell hand to point at the selected satellite
				if (orcHandStateMachine) {
					orcHandStateMachine.setSelectedSatellite(clickedObject)
				}
			}
		} else {
			// Clicked on empty space, deselect
			selectedSatellite = null
			selectionIndicator.visible = false
			updateSelectedSatelliteInfo(null)
			updateAvailableSatellitesHighlight()
			updateDecommissionActionState()
			updateCancelDecommissionActionState()
			hideGeoTether()
			// Tell hand to stop pointing
			if (orcHandStateMachine) {
				orcHandStateMachine.setSelectedSatellite(null)
			}
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
	const orcGroupForDemo = createOrcScene(orcDemoCamera)
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

		// Update button states during animation (satellite state may change)
		if (selectedSatellite) {
			updateDecommissionActionState()
			updateCancelDecommissionActionState()
			updateSelectedSatelliteInfo(selectedSatellite.userData.id)
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
		left: "6px", // Aligned with home button
		top: "50px", // Under home button
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
window.orcSelectSatellite = function (satId) {
	console.log("[DEBUG] Satellite selected via onclick, satId:", satId)
	const targetSat = satellites.find((s) => s.userData.id === satId)
	if (targetSat) {
		selectedSatellite = targetSat
		selectionIndicator.visible = true
		updateSelectedSatelliteInfo(targetSat.userData.id)
		updateAvailableSatellitesHighlight()
		updateDecommissionActionState()
		updateCancelDecommissionActionState()
		// Show tether for George (geosynchronous satellite)
		if (satId === "geo-001") {
			showGeoTether()
		} else {
			hideGeoTether()
		}
		// Tell hand to point at the selected satellite
		if (orcHandStateMachine) {
			orcHandStateMachine.setSelectedSatellite(targetSat)
		}
	}
}

window.orcDecommissionSatellite = function () {
	if (selectedSatellite && !selectedSatellite.userData.decommissioning) {
		startDecommission(selectedSatellite)
		updateDecommissionActionState()
		updateCancelDecommissionActionState()
		updateSelectedSatelliteInfo(selectedSatellite.userData.id)
	}
}

window.orcCancelDecommission = function () {
	console.log("Cancel decommission button clicked")
	console.log("Selected satellite:", selectedSatellite?.userData?.id)
	console.log(
		"Can cancel:",
		selectedSatellite ? canCancelDecommission(selectedSatellite) : false
	)
	if (selectedSatellite && canCancelDecommission(selectedSatellite)) {
		const success = cancelDecommission(selectedSatellite)
		console.log("Cancel decommission result:", success)
		updateDecommissionActionState()
		updateCancelDecommissionActionState()
		updateSelectedSatelliteInfo(selectedSatellite.userData.id)
	}
}

// Update the action button state - transforms between Decommission and Cancel
function updateActionButtonState() {
	const actionBtn = document.getElementById("decommission-action")
	if (!actionBtn) return

	// Remove existing click handler to prevent duplicates
	actionBtn.onclick = null

	if (!selectedSatellite) {
		// No satellite selected - show disabled Decommission
		actionBtn.classList.add("disabled")
		actionBtn.classList.remove("cancel-action")
		actionBtn.textContent = "Decommission Satellite"
		actionBtn.disabled = true
	} else if (canCancelDecommission(selectedSatellite)) {
		// Can cancel decommission - show Cancel button
		actionBtn.classList.remove("disabled")
		actionBtn.classList.add("cancel-action")
		actionBtn.textContent = "Cancel Decommission"
		actionBtn.disabled = false
		actionBtn.onclick = window.orcCancelDecommission
	} else if (selectedSatellite.userData.returning) {
		// Returning - disable button
		actionBtn.classList.add("disabled")
		actionBtn.classList.remove("cancel-action")
		actionBtn.textContent = "Decommission Satellite"
		actionBtn.disabled = true
	} else if (selectedSatellite.userData.decommissioning) {
		// Decommissioning but can't cancel (past point of no return) - disable
		actionBtn.classList.add("disabled")
		actionBtn.classList.remove("cancel-action")
		actionBtn.textContent = "Decommission Satellite"
		actionBtn.disabled = true
	} else {
		// Satellite is operational - show Decommission button
		actionBtn.classList.remove("disabled")
		actionBtn.classList.remove("cancel-action")
		actionBtn.textContent = "Decommission Satellite"
		actionBtn.disabled = false
		actionBtn.onclick = window.orcDecommissionSatellite
	}
}

// Wrapper functions for compatibility with existing calls
function updateDecommissionActionState() {
	updateActionButtonState()
}

function updateCancelDecommissionActionState() {
	// Now handled by updateActionButtonState
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
			decommissionAction.addEventListener(
				"click",
				window.orcDecommissionSatellite
			)
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
		updateCancelDecommissionActionState()
		// Tell hand to stop pointing
		if (orcHandStateMachine) {
			orcHandStateMachine.setSelectedSatellite(null)
		}
	}
	updateAvailableSatellitesHighlight()
})

// Show/hide helpers for Home label
export function showHomeLabel() {
	// No-op: Home is now a standard 3D label managed by the scene
}

export function hideHomeLabel() {
	// No-op: Home is now a standard 3D label managed by the scene
}

// === Animate Loop ===
export function animate() {
	requestAnimationFrame(animate)
	stars.rotation.y += 0.0008

	// Update roaming hand idle motion
	updateHandIdleMotion()

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

	// Update layout manager with new frustum dimensions
	layoutManager.onResize()

	// Update ORC demo renderer and camera if active
	if (orcDemoRenderer && orcDemoCamera && orcDemoContainer) {
		const rect = orcDemoContainer.getBoundingClientRect()
		orcDemoCamera.aspect = rect.width / rect.height
		orcDemoCamera.updateProjectionMatrix()
		orcDemoRenderer.setSize(rect.width, rect.height)
	}

	const aboutPlane = scene.getObjectByName("aboutPlane")
	if (aboutPlane) scene.remove(aboutPlane)
	const portfolioPlane = scene.getObjectByName("portfolioPlane")
	if (portfolioPlane) scene.remove(portfolioPlane)

	// Update nav layout on resize
	updateNavLayout()

	// If in nav mode, update positions immediately
	if (pyramidGroup.position.y > 1.0) {
		for (const key in labels) {
			const label = labels[key]
			if (label && flattenedLabelPositions[key]) {
				label.position.x = flattenedLabelPositions[key].x
				label.position.y = flattenedLabelPositions[key].y
				label.scale.set(navLabelScale, navLabelScale, 1)
			}
		}
		if (contactLabel && contactLabel.parent === scene) {
			const pos = flattenedLabelPositions.Contact
			contactLabel.position.set(pos.x, pos.y, pos.z)
		}
		pyramidGroup.position.y = flattenedMenuState.positionY
		if (currentSection && pyramidXPositions[currentSection] !== undefined) {
			pyramidGroup.position.x = pyramidXPositions[currentSection]
		}
	}
})

// === Custom Scrollbar & Overlay ===
let scrollOverlay = null
let scrollTrack = null
let scrollThumb = null
let activeScrollPlane = null
let scrollMinY = 0.0
let scrollMaxY = 0.0
const scrollBoundsBox = new THREE.Box3()

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
	scrollBoundsBox.setFromObject(activeScrollPlane)
	const h = scrollBoundsBox.max.y - scrollBoundsBox.min.y
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
