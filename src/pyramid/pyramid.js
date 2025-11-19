import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { contentFiles } from "./constants.js"
import { makeBioPlane, makePortfolioPlane, makeBlogPlane } from "../planes.js"
import {
	loadContentHTML,
	parseBioContent,
	parseBlogPosts,
} from "../contentLoader.js"

export const pyramidGroup = new THREE.Group()
export const labels = {}
export const hoverTargets = {}
export let homeLabel = null

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

export const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)

export const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = false
controls.minDistance = 2.5
controls.maxDistance = 12
controls.minPolarAngle = 0
controls.maxPolarAngle = Math.PI / 2

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
const height = 2.625
const halfSize = size / 2
const triHeight = (Math.sqrt(3) / 2) * size
const apex = new THREE.Vector3(0, height / 2, 0)
const v1 = new THREE.Vector3(-halfSize, -height / 2, triHeight / 3)
const v2 = new THREE.Vector3(halfSize, -height / 2, triHeight / 3)
const v3 = new THREE.Vector3(0, -height / 2, (-2 * triHeight) / 3)

scene.add(pyramidGroup)

const faces = [
	{ name: "Blog", verts: [apex.clone(), v1.clone(), v2.clone()] },
	{ name: "Portfolio", verts: [apex.clone(), v2.clone(), v3.clone()] },
	{ name: "Bio", verts: [apex.clone(), v3.clone(), v1.clone()] },
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
	Bio: {
		text: "Bio",
		position: { x: -1.05, y: 0.04, z: 0.5 },
		rotation: { x: 0, y: 0.438, z: 1 },
		pyramidCenteredSize: [5, 0.675],
		pyramidUncenteredSize: [5, 0.675],
	},
	Portfolio: {
		text: "Portfolio",
		position: { x: 1.07, y: 0, z: 0.5 },
		rotation: { x: 0, y: -0.502, z: -0.9 },
		pyramidCenteredSize: [5, 0.675],
		pyramidUncenteredSize: [4, 0.675],
	},
	Blog: {
		text: "Blog",
		position: { x: 0, y: -1.5, z: 1.2 },
		rotation: { x: 0, y: 0, z: 0 },
		pyramidCenteredSize: [5, 0.75],
		pyramidUncenteredSize: [5, 0.75],
	},
	// Home config can be customized externally before calling initLabels
	Home: {
		text: "Home",
		// position is relative to pyramidGroup; default sits above apex
		position: { x: 0, y: apex.y + 0.2, z: 0 },
		rotation: { x: 0, y: 0, z: 0 },
		pyramidCenteredSize: [7, 0.6],
		pyramidUncenteredSize: [7, 0.6],
	},
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
		const hoverWidth = cfg.pyramidCenteredSize[0] * 1.6
		const hoverHeight = cfg.pyramidCenteredSize[1] * 2.0
		const hoverGeo = new THREE.PlaneGeometry(hoverWidth, hoverHeight)
		const hoverMat = new THREE.MeshBasicMaterial({
			transparent: true,
			opacity: 0,
		})
		const hover = new THREE.Mesh(hoverGeo, hoverMat)
		hover.position.copy(mesh.position).add(new THREE.Vector3(0, 0, 0.08))
		hover.rotation.copy(mesh.rotation)
		hover.userData.labelKey = key
		hover.name = `${key}_hover`
		scene.add(hover)
		hoverTargets[key] = hover
	}

	// Create Home label (initially hidden). It will be positioned above the pyramid
	// and will always face the camera. Use same factory so styling matches.
	try {
		const hc = labelConfigs.Home || {
			position: { x: 0, y: apex.y + 0.4, z: 0 },
			pyramidCenteredSize: [3, 0.6],
			pyramidUncenteredSize: [3, 0.6],
		}
		const homeMesh = makeLabelPlane(
			hc.text || "Home",
			...(hc.pyramidCenteredSize || [3, 0.6])
		)
		homeMesh.position.set(hc.position.x, hc.position.y, hc.position.z)
		// store original transforms so code that expects these fields won't break
		homeMesh.userData.origPosition = homeMesh.position.clone()
		homeMesh.userData.origRotation = homeMesh.rotation.clone()
		homeMesh.userData.originalScale = homeMesh.scale.clone()
		// Store centered and uncentered sizes
		homeMesh.userData.pyramidCenteredSize = hc.pyramidCenteredSize || [3, 0.6]
		homeMesh.userData.pyramidUncenteredSize = hc.pyramidUncenteredSize || [
			3, 0.6,
		]
		// Keep it above pyramid group so it moves with the pyramid
		pyramidGroup.add(homeMesh)
		homeMesh.name = "HomeLabel"
		homeMesh.visible = false
		homeMesh.userData.isHome = true
		homeMesh.userData.name = "Home"
		homeLabel = homeMesh
		labels["Home"] = homeMesh

		// Ensure Home label renders on top and is always readable: don't depth-test it
		if (homeMesh.material) {
			homeMesh.material.depthTest = false
			homeMesh.renderOrder = 999
		}

		// Create hover target for Home so cursor shows pointer when hovering it
		const hoverWidth =
			(hc.pyramidCenteredSize && hc.pyramidCenteredSize[0]
				? hc.pyramidCenteredSize[0]
				: 3) * 1.6
		const hoverHeight =
			(hc.pyramidCenteredSize && hc.pyramidCenteredSize[1]
				? hc.pyramidCenteredSize[1]
				: 0.6) * 2.0
		const hoverGeo = new THREE.PlaneGeometry(hoverWidth, hoverHeight)
		const hoverMat = new THREE.MeshBasicMaterial({
			transparent: true,
			opacity: 0,
		})
		const hover = new THREE.Mesh(hoverGeo, hoverMat)
		hover.position.copy(homeMesh.position).add(new THREE.Vector3(0, 0, 0.08))
		hover.userData.labelKey = "Home"
		hover.name = `Home_hover`
		scene.add(hover)
		hoverTargets["Home"] = hover

		// Do not auto-show Home label on OrbitControls interaction; it will be shown
		// explicitly when the pyramid reaches the bottom or when content is loaded.
	} catch (e) {
		console.warn("Could not create Home label:", e)
	}

	// --- 3D separator (small white triangle) placed just above Home label.
	// The triangle is created once and scaled each frame so its screen height
	// measures approximately 5px; it faces the camera.
	try {
		// base triangle geometry in XY plane, width=1, height=1; we'll scale later
		const triGeom = new THREE.BufferGeometry()
		const verts = new Float32Array([
			-0.5,
			-0.5,
			0.0, // bottom-left
			0.5,
			-0.5,
			0.0, // bottom-right
			0.0,
			0.5,
			0.0, // top-center
		])
		triGeom.setAttribute("position", new THREE.BufferAttribute(verts, 3))
		triGeom.computeVertexNormals()

		const triMat = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			side: THREE.DoubleSide,
			depthTest: false,
			transparent: true,
		})

		const triMesh = new THREE.Mesh(triGeom, triMat)
		triMesh.name = "separator3D"
		triMesh.visible = false
		// keep it slightly in front so it's always readable
		triMesh.renderOrder = 1000
		scene.add(triMesh)

		pyramidGroup.userData._separator3D = triMesh
	} catch (e) {
		console.warn("Could not create 3D triangle separator:", e)
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
	positionY: 0.35,
	rotationY: 0,
	scale: 1,
}

export function getInitialPyramidState() {
	return { ...initialPyramidState }
}

export function animatePyramid(down = true, section = null) {
	// capture a local token for this animation; incrementing global token
	// elsewhere (e.g. reset) will invalidate this animation's completion
	const myToken = ++pyramidAnimToken
	const duration = 1000
	const startRot = pyramidGroup.rotation.y
	// Always rotate full 360 degrees (2π) in the same direction
	const endRot = startRot + Math.PI * 2
	const startPosY = pyramidGroup.position.y
	const endPosY = down ? -1.75 : 0.35 // adjusted

	const startScale = pyramidGroup.scale.x
	const endScale = down ? 0.5 : 1

	const startTime = performance.now()
	function step(time) {
		// If this animation has been invalidated (a newer token exists), stop updating
		if (myToken !== pyramidAnimToken) return
		const t = Math.min((time - startTime) / duration, 1)
		pyramidGroup.rotation.y = startRot + (endRot - startRot) * t
		pyramidGroup.position.y = startPosY + (endPosY - startPosY) * t
		const s = startScale + (endScale - startScale) * t
		pyramidGroup.scale.set(s, s, s)

		// Animate label scales based on centered/uncentered sizes (skip Home label)
		for (const key in labels) {
			if (key === "Home") continue // Home label stays fixed above pyramid
			const labelMesh = labels[key]
			if (!labelMesh) continue
			const centeredSize = labelMesh.userData.pyramidCenteredSize
			const uncenteredSize = labelMesh.userData.pyramidUncenteredSize
			if (centeredSize && uncenteredSize) {
				const startSize = down ? centeredSize : uncenteredSize
				const endSize = down ? uncenteredSize : centeredSize
				const startScaleRatio = startSize[0] / centeredSize[0]
				const endScaleRatio = endSize[0] / centeredSize[0]
				const labelScale =
					startScaleRatio + (endScaleRatio - startScaleRatio) * t
				labelMesh.scale.set(labelScale, labelScale, labelScale)
			}
		}

		if (t < 1) requestAnimationFrame(step)
		else {
			// If a newer animation has been started since this one began,
			// abort executing completion side-effects.
			if (myToken !== pyramidAnimToken) return
			isAtBottom = down
			// Snap labels to final scale (skip Home label)
			for (const key in labels) {
				if (key === "Home") continue // Home label stays fixed above pyramid
				const labelMesh = labels[key]
				if (!labelMesh) continue
				const centeredSize = labelMesh.userData.pyramidCenteredSize
				const uncenteredSize = labelMesh.userData.pyramidUncenteredSize
				if (centeredSize && uncenteredSize) {
					const finalSize = down ? uncenteredSize : centeredSize
					const finalScaleRatio = finalSize[0] / centeredSize[0]
					labelMesh.scale.set(finalScaleRatio, finalScaleRatio, finalScaleRatio)
				}
			}
			// If pyramid ended at bottom, ensure Home label is visible
			if (isAtBottom) showHomeLabel()
			// Show section content only if requested and this animation is still valid
			if (section === "bio") showBioPlane()
			else if (section === "portfolio") showPortfolioPlane()
			else if (section === "blog") showBlogPlane()
		}
	}
	requestAnimationFrame(step)
}

// Reset pyramid to exact home state
export function resetPyramidToHome() {
	// Invalidate any in-progress pyramid animations so their completion
	// handlers won't show content after we start resetting.
	++pyramidAnimToken
	// Immediately hide any content so nothing appears while we animate up
	hideAllPlanes()
	const duration = 1000
	const startRot = pyramidGroup.rotation.y
	// Always rotate full 360 degrees to ensure twisting motion
	const rotDiff = Math.PI * 2
	const startPosY = pyramidGroup.position.y
	const endPosY = initialPyramidState.positionY // Use stored initial position
	const startScale = pyramidGroup.scale.x
	const endScale = initialPyramidState.scale // Use stored initial scale

	const startTime = performance.now()
	function step(time) {
		const t = Math.min((time - startTime) / duration, 1)
		pyramidGroup.rotation.y = startRot + rotDiff * t
		pyramidGroup.position.y = startPosY + (endPosY - startPosY) * t
		const s = startScale + (endScale - startScale) * t
		pyramidGroup.scale.set(s, s, s) // Animate label scales back to centered
		for (const key in labels) {
			const labelMesh = labels[key]
			if (!labelMesh) continue
			const centeredSize = labelMesh.userData.pyramidCenteredSize
			const uncenteredSize = labelMesh.userData.pyramidUncenteredSize
			if (centeredSize && uncenteredSize) {
				const startSize = uncenteredSize
				const endSize = centeredSize
				const startScaleRatio = startSize[0] / centeredSize[0]
				const endScaleRatio = endSize[0] / centeredSize[0]
				const labelScale =
					startScaleRatio + (endScaleRatio - startScaleRatio) * t
				labelMesh.scale.set(labelScale, labelScale, labelScale)
			}
		}

		if (t < 1) requestAnimationFrame(step)
		else {
			isAtBottom = false
			// Snap labels to centered scale (skip Home label)
			for (const key in labels) {
				if (key === "Home") continue // Home label stays fixed above pyramid
				const labelMesh = labels[key]
				if (!labelMesh) continue
				labelMesh.scale.set(1, 1, 1)
			}
			// Ensure exact values after animation
			pyramidGroup.rotation.y = initialPyramidState.rotationY
			pyramidGroup.position.y = endPosY
			pyramidGroup.scale.set(endScale, endScale, endScale)
			// After reset, hide Home label
			hideHomeLabel()
		}
	}
	requestAnimationFrame(step)
}

export function showBioPlane() {
	// Always remove any existing content before showing a new plane to avoid overlap
	hideAllPlanes()

	// Ensure the DOM content pane is hidden when using a 3D bio plane so
	// we don't show duplicate/overlapping DOM text over the pyramid.
	const contentEl = document.getElementById("content")
	if (contentEl) {
		contentEl.style.display = "none"
	}
	// Show navigation bar positioned between content and home label
	// ensure DOM separator is not shown here; we use the 3D separator instead
	const navBar = document.getElementById("content-floor")
	if (navBar) navBar.classList.remove("show")
	let bioPlane = scene.getObjectByName("bioPlane")
	if (!bioPlane) {
		// Capture current animation token so we can abort if a reset occurs
		const myToken = pyramidAnimToken
		// Load HTML content and parse bio structure (heading + paragraphs)
		loadContentHTML("bio").then((html) => {
			// If a newer pyramid animation/reset occurred, abort adding content
			if (myToken !== pyramidAnimToken) return
			// 1) We no longer inject flat DOM content for bio to avoid duplicate
			//     flat text when a 3D bio plane is rendered. The 3D plane will
			//     present the content and the short centered separator is used.
			const contentEl = document.getElementById("content")
			// 2) Also create the 3D plane (existing behavior)
			const bioContent = parseBioContent(html)
			const plane = makeBioPlane(bioContent)
			// raise bio plane slightly so Home label has room above the pyramid
			plane.position.y = 0.9
			scene.add(plane)
			// reveal Home label when content is shown
			showHomeLabel()
			// 3) Use the 3D separator (hide DOM separator)
			const navBar = document.getElementById("content-floor")
			if (navBar) navBar.classList.remove("show")
			const sep = pyramidGroup.userData && pyramidGroup.userData._separator3D
			if (sep) sep.visible = true
		})
	} else bioPlane.visible = true
}

export function showPortfolioPlane() {
	// Always remove any existing content before showing a new plane to avoid overlap
	hideAllPlanes()

	// Ensure DOM content is hidden when presenting the 3D portfolio plane.
	const contentEl = document.getElementById("content")
	if (contentEl) {
		contentEl.style.display = "none"
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
				items.push({
					title: titleEl ? titleEl.textContent.trim() : "Untitled",
					description: pEl ? pEl.textContent.trim() : "",
					image: null,
					link: aEl ? aEl.href : null,
				})
			})
			const plane = makePortfolioPlane(items)
			// keep portfolio slightly lower than bio but raised to avoid overlap with Home label
			plane.position.y = 0.8
			scene.add(plane)
			// reveal Home label when content is shown
			showHomeLabel()
			// Use 3D separator (hide DOM separator)
			const navBar = document.getElementById("content-floor")
			if (navBar) navBar.classList.remove("show")
			const sep = pyramidGroup.userData && pyramidGroup.userData._separator3D
			if (sep) sep.visible = true
		})
	} else portfolioPlane.visible = true
}

export function showBlogPlane() {
	// Always remove any existing content before showing a new plane to avoid overlap
	hideAllPlanes()
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
			}
			const posts = parseBlogPosts(html)
			const plane = makeBlogPlane(posts)
			// raise blog plane slightly to leave space above pyramid for Home label
			plane.position.y = 0.8
			scene.add(plane)
			// reveal Home label when content is shown
			showHomeLabel()
			const navBar = document.getElementById("content-floor")
			if (navBar && contentEl) navBar.classList.remove("show")
			const sep = pyramidGroup.userData && pyramidGroup.userData._separator3D
			if (sep) sep.visible = true
			else if (window.updateContentFloorPosition)
				window.updateContentFloorPosition()
		})
	} else blogPlane.visible = true
}

function hideBio() {
	const bioPlane = scene.getObjectByName("bioPlane")
	if (bioPlane) scene.remove(bioPlane)
}

function hidePortfolio() {
	const plane = scene.getObjectByName("portfolioPlane")
	if (plane) scene.remove(plane)
}

function hideBlog() {
	const blogPlane = scene.getObjectByName("blogPlane")
	if (blogPlane) scene.remove(blogPlane)
}

// Exported helper to hide all content planes
export function hideAllPlanes() {
	hideBio()
	hidePortfolio()
	hideBlog()
	// Hide 3D separator first so the DOM updater does not early-return
	const sep = pyramidGroup.userData && pyramidGroup.userData._separator3D
	if (sep) sep.visible = false
	// Hide navigation bar DOM element as a fallback
	const contentFloor = document.getElementById("content-floor")
	if (contentFloor) contentFloor.classList.remove("show")

	// Also hide the DOM content pane to avoid lingering DOM content
	const contentEl = document.getElementById("content")
	if (contentEl) {
		contentEl.style.display = "none"
	}
	if (window.updateContentFloorPosition) window.updateContentFloorPosition()

	// Do not hide the Home label here — Home remains visible until the user
	// explicitly returns to the original state by clicking the Home label.
}

// Update 3D separator position to sit between Home label and visible content plane.
function update3DSeparator() {
	const sep = pyramidGroup.userData && pyramidGroup.userData._separator3D
	if (!sep) return

	// Find a visible content plane (bio, portfolio, blog)
	const bioPlane = scene.getObjectByName("bioPlane")
	const portfolioPlane = scene.getObjectByName("portfolioPlane")
	const blogPlane = scene.getObjectByName("blogPlane")
	const contentPlane = bioPlane || portfolioPlane || blogPlane

	// If no content plane visible, hide separator
	if (!contentPlane) {
		sep.visible = false
		return
	}

	// Get world positions
	const homeWorld = new THREE.Vector3()
	if (labels.Home) labels.Home.getWorldPosition(homeWorld)
	const contentWorld = new THREE.Vector3()
	contentPlane.getWorldPosition(contentWorld)

	// Determine world-space size so the triangle's projected height ~5px
	const sepMesh = sep
	const desiredPxHeight = 5
	const viewportH = window.innerHeight || 1
	const fov = camera.fov * (Math.PI / 180)
	// distance from camera to target position (we'll estimate using Home label)
	const targetPos = new THREE.Vector3()
	targetPos.copy(homeWorld)
	const distance = camera.position.distanceTo(targetPos)
	// world height that projects to desiredPxHeight
	const worldHeight =
		2 * distance * Math.tan(fov / 2) * (desiredPxHeight / viewportH)
	// choose a projected width in pixels (visual width), e.g. 160px
	const desiredPxWidth = 160
	const worldWidth =
		2 * distance * Math.tan(fov / 2) * (desiredPxWidth / viewportH)

	// Place separator just above top of Home label: compute small world offset
	// Add an explicit 10px upward offset (converted to world units) for extra breathing room
	const offsetPx = 20
	const worldOffset = 2 * distance * Math.tan(fov / 2) * (offsetPx / viewportH)
	const y = homeWorld.y + worldHeight * 0.5 + 0.01 + worldOffset
	const centerX = pyramidGroup.position ? pyramidGroup.position.x : homeWorld.x
	const zOffset = (homeWorld.z || 0) + 0.02
	sepMesh.position.set(centerX, y, zOffset)

	// Face the camera so it appears flat to the viewer
	sepMesh.lookAt(camera.position)

	// Apply computed scale (our geometry is 1 unit high by 1 unit wide baseline)
	sepMesh.scale.set(worldWidth, worldHeight, 1)
	sepMesh.visible = true
}

// Show/hide helpers for Home label
export function showHomeLabel() {
	if (!homeLabel) return
	homeLabel.visible = true
}

export function hideHomeLabel() {
	if (!homeLabel) return
	homeLabel.visible = false
}

// === Animate Label to Front/Center ===
// Animate label to center position (floating above pyramid with increased z)
export function animateLabelToCenter(labelMesh, endPos, endRot) {
	const startPos = labelMesh.position.clone()
	const startRot = labelMesh.rotation.clone()
	// Increase z when centering to float above the pyramid
	// Compute the final end position at z=1.0 and apply a small world-space
	// downward offset for the Portfolio label so it sits slightly lower when
	// centered. Convert 10px -> world units at the target depth to keep the
	// visual offset consistent across screen sizes.
	const finalEndPos = new THREE.Vector3(endPos.x, endPos.y, 1.0)
	try {
		if (
			labelMesh &&
			labelMesh.userData &&
			labelMesh.userData.name === "Portfolio"
		) {
			const px = 15 // pixels to move down
			const viewportH = window.innerHeight || 1
			const fov = camera.fov * (Math.PI / 180)
			const targetPos = new THREE.Vector3(
				finalEndPos.x,
				finalEndPos.y,
				finalEndPos.z
			)
			const distance = camera.position.distanceTo(targetPos)
			const worldOffset = 2 * distance * Math.tan(fov / 2) * (px / viewportH)
			finalEndPos.y -= worldOffset
		}
	} catch (e) {
		// swallow - optional visual tweak shouldn't break centering
	}
	const duration = 500
	const startTime = performance.now()
	function step(time) {
		const t = Math.min((time - startTime) / duration, 1)
		labelMesh.position.lerpVectors(startPos, finalEndPos, t)
		labelMesh.rotation.x = startRot.x + (endRot.x - startRot.x) * t
		labelMesh.rotation.y = startRot.y + (endRot.y - startRot.y) * t
		labelMesh.rotation.z = startRot.z + (endRot.z - startRot.z) * t
		if (t < 1) requestAnimationFrame(step)
	}
	requestAnimationFrame(step)
}

// Animate label back to its original position/rotation
export function animateLabelToOriginal(labelMesh, origPos, origRot) {
	const startPos = labelMesh.position.clone()
	const startRot = labelMesh.rotation.clone()
	const duration = 500
	const startTime = performance.now()
	function step(time) {
		const t = Math.min((time - startTime) / duration, 1)
		labelMesh.position.lerpVectors(startPos, origPos, t)
		labelMesh.rotation.x = startRot.x + (origRot.x - startRot.x) * t
		labelMesh.rotation.y = startRot.y + (origRot.y - startRot.y) * t
		labelMesh.rotation.z = startRot.z + (origRot.z - startRot.z) * t
		if (t < 1) requestAnimationFrame(step)
	}
	requestAnimationFrame(step)
}

// === Animate Loop ===
export function animate() {
	requestAnimationFrame(animate)
	stars.rotation.y += 0.0008
	controls.update()
	// Orient home label to face camera each frame (if present)
	if (homeLabel && homeLabel.visible) {
		// Compute world position to face camera while keeping label upright
		const worldPos = new THREE.Vector3()
		homeLabel.getWorldPosition(worldPos)
		homeLabel.lookAt(camera.position)
		// Keep label's rotation around X/Z but avoid flipping scale
	}
	// Keep hover targets synchronized with labels (they're in scene, not pyramidGroup children)
	for (const key in labels) {
		const label = labels[key]
		const hover = hoverTargets[key]
		if (label && hover) {
			// Position hover target in front of label (0.08 units on label's Z-axis)
			const offset = new THREE.Vector3(0, 0, 0.08)
			offset.applyQuaternion(label.quaternion)
			hover.position.copy(label.position).add(offset)
			hover.rotation.copy(label.rotation)
		}
	}
	// Update 3D separator position every frame if present
	try {
		update3DSeparator()
	} catch (e) {
		// swallow - optional visual
	}
	renderer.render(scene, camera)
}

// === Resize ===
window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)

	const bioPlane = scene.getObjectByName("bioPlane")
	if (bioPlane) scene.remove(bioPlane)
	const portfolioPlane = scene.getObjectByName("portfolioPlane")
	if (portfolioPlane) scene.remove(portfolioPlane)
})
