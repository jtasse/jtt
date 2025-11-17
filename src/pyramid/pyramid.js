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

// In test environments (Node/jsdom) `window` may be undefined. Use a
// guarded WIN helper to provide reasonable fallbacks so the module can
// be imported safely during unit tests.
const WIN = typeof window !== "undefined" ? window : null
const DEFAULT_WIDTH = 1024
const DEFAULT_HEIGHT = 768
const VIEWPORT_WIDTH = WIN ? WIN.innerWidth : DEFAULT_WIDTH
const VIEWPORT_HEIGHT = WIN ? WIN.innerHeight : DEFAULT_HEIGHT
const VIEWPORT_PIXEL_RATIO = WIN ? WIN.devicePixelRatio || 1 : 1

export const camera = new THREE.PerspectiveCamera(
	50,
	VIEWPORT_WIDTH / VIEWPORT_HEIGHT,
	0.1,
	2000
)
camera.position.set(0, 0, 6)
camera.lookAt(0, 0, 0)

export const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT)
renderer.setPixelRatio(VIEWPORT_PIXEL_RATIO)

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

// Lift the whole pyramid a little so labels (like Blog) don't get clipped
// against the bottom of the viewport.
pyramidGroup.position.y = 0.5

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
		pyramidUncenteredSize: [8, 0.675],
	},
	Portfolio: {
		text: "Portfolio",
		position: { x: 1.07, y: 0, z: 0.5 },
		rotation: { x: 0, y: -0.502, z: -0.9 },
		pyramidCenteredSize: [5, 0.675],
		pyramidUncenteredSize: [8, 0.675],
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
		pyramidUncenteredSize: [8, 0.6],
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

		// Ensure label renders on top of pyramid geometry to avoid being
		// visually occluded. Prevent depth testing and give a higher renderOrder.
		if (mesh.material) {
			mesh.material.depthTest = false
			mesh.renderOrder = 500
		}

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
		// Use Home config from `labelConfigs.Home`. Create the Home mesh
		// using the configured `pyramidUncenteredSize` as the native mesh
		// size so we have a single source of truth for the visual size
		// (avoids creating at centered size and then scaling it up).
		const hc = labelConfigs.Home || {
			position: { x: 0, y: apex.y + 0.4, z: 0 },
			pyramidCenteredSize: [3, 0.6],
			pyramidUncenteredSize: [3, 0.6],
		}
		// Create the Home mesh using the configured `pyramidCenteredSize` so
		// it matches how the other labels are created. The animation code
		// will scale it to `pyramidUncenteredSize` when the pyramid moves
		// down. This keeps a single source of truth in `labelConfigs` and
		// avoids special-case upscaling logic.
		const nativeSize =
			hc.pyramidCenteredSize && hc.pyramidCenteredSize[0]
				? hc.pyramidCenteredSize
				: hc.pyramidUncenteredSize || [3, 0.6]
		const homeMesh = makeLabelPlane(hc.text || "Home", ...nativeSize)
		homeMesh.position.set(hc.position.x, hc.position.y, hc.position.z)
		// store original transforms so code that expects these fields won't break
		homeMesh.userData.origPosition = homeMesh.position.clone()
		homeMesh.userData.origRotation = homeMesh.rotation.clone()
		// Store centered and uncentered sizes explicitly on the mesh so
		// animation code can reference them. `pyramidCenteredSize` may be
		// used for computing animation ratios; `pyramidUncenteredSize` is
		// the actual native size we used to construct the mesh above.
		homeMesh.userData.pyramidCenteredSize = hc.pyramidCenteredSize || nativeSize
		homeMesh.userData.pyramidUncenteredSize =
			hc.pyramidUncenteredSize || nativeSize
		// No manual scaling: mesh geometry is created at the uncentered size
		// (nativeSize). Record the original scale for safety.
		homeMesh.userData.originalScale = homeMesh.scale.clone()
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

		// Create hover target for Home so cursor shows pointer when hovering it.
		// Use the centered size (same base as other labels) so the hover
		// geometry scales consistently when the label animates.
		const hoverWidth =
			(homeMesh.userData.pyramidCenteredSize &&
			homeMesh.userData.pyramidCenteredSize[0]
				? homeMesh.userData.pyramidCenteredSize[0]
				: 3) * 1.6
		const hoverHeight =
			(homeMesh.userData.pyramidCenteredSize &&
			homeMesh.userData.pyramidCenteredSize[1]
				? homeMesh.userData.pyramidCenteredSize[1]
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
}

// Helper: ensure a per-page stylesheet is loaded for the content pane.
function ensurePageStyle(pageName) {
	if (!WIN) return
	const existing = document.getElementById("page-style")
	if (existing) existing.remove()
	const link = document.createElement("link")
	link.id = "page-style"
	link.rel = "stylesheet"
	// Vite serves files under /src during dev; using a relative path keeps
	// this simple for development. Adjust if you build to a different output.
	// Per-page styles are named `<page>.css` inside each content folder.
	link.href = `/src/content/${pageName}/${pageName}.css`
	document.head.appendChild(link)
}

// === Pyramid State ===
let isAtBottom = false

// Token to invalidate in-progress pyramid animations. Incrementing this
// prevents prior animation completions from executing side-effects
// (like showing content) after a cancel/reset.
let pyramidAnimToken = 0

// Store initial pyramid state so we can always reset to it exactly
const initialPyramidState = {
	// match the visible pyramid start position above
	positionY: 0.5,
	rotationY: 0,
	scale: 1,
}

export function getInitialPyramidState() {
	return { ...initialPyramidState }
}

export function animatePyramid(down = true, section = null) {
	// If we're animating back up, immediately hide any visible content so
	// the scene is cleared before the upward animation begins.
	if (!down) {
		hideAllPlanes()
	}

	// capture a local token for this animation; incrementing global token
	// elsewhere (e.g. reset) will invalidate this animation's completion
	const myToken = ++pyramidAnimToken
	const duration = 1000
	const startRot = pyramidGroup.rotation.y
	// Always rotate full 360 degrees (2π) in the same direction
	const endRot = startRot + Math.PI * 2
	const startPosY = pyramidGroup.position.y
	// When moving up, return to the initial stored position so we stay consistent
	const endPosY = down ? -1.75 : initialPyramidState.positionY

	const startScale = pyramidGroup.scale.x
	const endScale = down ? 0.5 : initialPyramidState.scale

	const startTime = performance.now()
	function step(time) {
		// If this animation has been invalidated (a newer token exists), stop updating
		if (myToken !== pyramidAnimToken) return
		const t = Math.min((time - startTime) / duration, 1)
		pyramidGroup.rotation.y = startRot + (endRot - startRot) * t
		pyramidGroup.position.y = startPosY + (endPosY - startPosY) * t
		const s = startScale + (endScale - startScale) * t
		pyramidGroup.scale.set(s, s, s)

		// Animate label scales based on centered/uncentered sizes
		for (const key in labels) {
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
				// Keep hover target scale synchronized as well
				const hover = hoverTargets[key]
				if (hover) hover.scale.set(labelScale, labelScale, labelScale)
			}
		}

		if (t < 1) requestAnimationFrame(step)
		else {
			// If a newer animation has been started since this one began,
			// abort executing completion side-effects.
			if (myToken !== pyramidAnimToken) return
			isAtBottom = down
			// Snap labels to final scale
			for (const key in labels) {
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
			else {
				// If we moved back up, hide any visible content so the scene
				// returns to the navigation/pyramid-only view.
				hideAllPlanes()
			}
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
			// Snap labels to centered scale
			for (const key in labels) {
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
	// Show navigation bar positioned between content and home label
	const navBar = document.getElementById("content-floor")
	if (navBar) {
		navBar.classList.add("show")
		// Separator display is handled by the UI layer; dispatch event to notify.
		document.dispatchEvent(new CustomEvent("content:changed"))
	}
	let bioPlane = scene.getObjectByName("bioPlane")
	if (!bioPlane) {
		// Capture current animation token so we can abort if a reset occurs
		const myToken = pyramidAnimToken
		// Load HTML content and parse bio structure (heading + paragraphs)
		loadContentHTML("bio").then((html) => {
			// Load page-specific stylesheet
			ensurePageStyle("bio")
			// If a newer pyramid animation/reset occurred, abort adding content
			if (myToken !== pyramidAnimToken) return
			// 1) Populate DOM content pane so layout is HTML-driven
			const contentEl = document.getElementById("content")
			if (contentEl) {
				contentEl.innerHTML = `<header class="content-header"><h1>Bio</h1></header><div class="content-body"><div class="bio-content">${html}</div></div>`
				contentEl.style.display = "block"
			}
			// 2) We now rely on DOM content for layout. Skip creating the 3D canvas plane
			// (this prevents duplicate smaller text appearing in the 3D scene).
			// reveal Home label when content is shown
			showHomeLabel()
			// 3) Position separator immediately under the DOM content pane
			const navBar = document.getElementById("content-floor")
			if (navBar && contentEl) {
				const r = contentEl.getBoundingClientRect()
				navBar.classList.add("show")
				navBar.style.position = "fixed"
				// Clear CSS transform so left/top coordinates are absolute
				navBar.style.transform = "none"
				navBar.style.left = `${Math.round(r.left)}px`
				navBar.style.width = `${Math.round(r.width)}px`
				navBar.style.top = `${Math.round(r.bottom + 5)}px`
			} else if (window.updateContentFloorPosition) {
				window.updateContentFloorPosition()
			}
		})
	} else bioPlane.visible = true
}

export function showPortfolioPlane() {
	// Always remove any existing content before showing a new plane to avoid overlap
	hideAllPlanes()
	// Show navigation bar positioned between content and home label
	const navBar = document.getElementById("content-floor")
	if (navBar) {
		navBar.classList.add("show")
		document.dispatchEvent(new CustomEvent("content:changed"))
	}
	let portfolioPlane = scene.getObjectByName("portfolioPlane")
	if (!portfolioPlane) {
		const myToken = pyramidAnimToken
		// Load portfolio HTML and extract items (title, description, link)
		loadContentHTML("portfolio").then((html) => {
			// Load page-specific stylesheet
			ensurePageStyle("portfolio")
			if (myToken !== pyramidAnimToken) return
			// Populate DOM content pane
			const contentEl = document.getElementById("content")
			if (contentEl) {
				// Normalize upstream portfolio HTML: wrap each top-level child as
				// a `.portfolio-item` so the `.portfolio-grid` layout consistently
				// shows two items per row.
				const tmp = document.createElement("div")
				tmp.innerHTML = html
				let gridInner = ""
				Array.from(tmp.children).forEach((child) => {
					gridInner += `<div class="portfolio-item">${child.outerHTML}</div>`
				})
				contentEl.innerHTML = `<header class="content-header"><h1>Portfolio</h1></header><div class="content-body"><div class="portfolio-grid">${gridInner}</div></div>`
				contentEl.style.display = "block"
			}
			// We now populate DOM content only; skip creating the 3D portfolio plane
			// to avoid duplicate/smaller-rendered content in the scene.
			// reveal Home label when content is shown
			showHomeLabel()
			// Position separator under DOM content
			const navBar = document.getElementById("content-floor")
			if (navBar && contentEl) {
				const r = contentEl.getBoundingClientRect()
				navBar.classList.add("show")
				navBar.style.position = "fixed"
				navBar.style.transform = "none"
				navBar.style.left = `${Math.round(r.left)}px`
				navBar.style.width = `${Math.round(r.width)}px`
				navBar.style.top = `${Math.round(r.bottom + 5)}px`
			} else if (window.updateContentFloorPosition) {
				window.updateContentFloorPosition()
			}
		})
	} else portfolioPlane.visible = true
}

export function showBlogPlane() {
	// Always remove any existing content before showing a new plane to avoid overlap
	hideAllPlanes()
	// Show navigation bar positioned between content and home label
	const navBar = document.getElementById("content-floor")
	if (navBar) {
		navBar.classList.add("show")
		document.dispatchEvent(new CustomEvent("content:changed"))
	}
	let blogPlane = scene.getObjectByName("blogPlane")
	if (!blogPlane) {
		const myToken = pyramidAnimToken
		// load HTML content and parse blog posts
		loadContentHTML("blog").then((html) => {
			if (myToken !== pyramidAnimToken) return
			// Load page-specific stylesheet
			ensurePageStyle("blog")
			// Populate DOM content
			const contentEl = document.getElementById("content")
			if (contentEl) {
				const posts = parseBlogPosts(html)
				let bodyHtml = ""
				if (posts && posts.length > 0) {
					let out = '<div class="blog-list">'
					posts.forEach((p) => {
						out += `<article class="blog-post">`
						if (p.image) {
							out += `<img class="blog-thumb" src="${p.image}" alt="${
								p.title || ""
							}">`
						}
						out += `<h2>${p.title}</h2>`
						out += `<p class="meta">${p.date || ""} | ${p.author || ""}</p>`
						out += `<p class="summary">${p.summary || ""}</p>`
						out += `</article>`
					})
					out += "</div>"
					bodyHtml = out
				} else {
					bodyHtml = html
				}
				contentEl.innerHTML = `<header class="content-header"><h1>Blog</h1></header><div class="content-body">${bodyHtml}</div>`
				contentEl.style.display = "block"
				// Start at the top of the blog list, then nudge any first thumbnail
				// into view below the sticky header if present.
				contentEl.scrollTop = 0
				requestAnimationFrame(() => {
					const header = contentEl.querySelector(".content-header")
					const headerHeight = header
						? Math.round(header.getBoundingClientRect().height)
						: 0
					const firstThumb = contentEl.querySelector(".blog-thumb")
					if (firstThumb) {
						const desired = Math.max(0, firstThumb.offsetTop - headerHeight - 8)
						contentEl.scrollTop = desired
					}
				})
			}
			// We now populate DOM content only; skip creating the 3D blog plane
			// to avoid duplicate/smaller-rendered content in the scene.
			// reveal Home label when content is shown
			showHomeLabel()
			const navBar = document.getElementById("content-floor")
			if (navBar && contentEl) {
				const r = contentEl.getBoundingClientRect()
				navBar.classList.add("show")
				navBar.style.position = "fixed"
				navBar.style.transform = "none"
				navBar.style.left = `${Math.round(r.left)}px`
				navBar.style.width = `${Math.round(r.width)}px`
				navBar.style.top = `${Math.round(r.bottom + 5)}px`
			} else if (window.updateContentFloorPosition) {
				window.updateContentFloorPosition()
			}
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
	// Hide navigation bar
	const contentFloor = document.getElementById("content-floor")
	if (contentFloor) contentFloor.classList.remove("show")
	// Hide DOM content pane (if any) and notify UI layer
	const contentEl = document.getElementById("content")
	if (contentEl) {
		contentEl.style.display = "none"
		// Optionally clear contentEl.innerHTML if desired
	}
	document.dispatchEvent(new CustomEvent("content:hidden"))

	// Do not hide the Home label here — Home remains visible until the user
	// explicitly returns to the original state by clicking the Home label.
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
	// Defensive defaults: if callers omit endPos/endRot, fall back to
	// the label's original stored transform (if available) or a safe center.
	const startPos = labelMesh.position.clone()
	const startRot = labelMesh.rotation.clone()

	if (!endPos) {
		if (labelMesh.userData && labelMesh.userData.origPosition) {
			const p = labelMesh.userData.origPosition
			endPos = { x: p.x, y: p.y, z: p.z }
		} else {
			endPos = { x: 0, y: 0, z: 0 }
		}
	}
	if (!endRot) {
		if (labelMesh.userData && labelMesh.userData.origRotation) {
			const r = labelMesh.userData.origRotation
			endRot = { x: r.x, y: r.y, z: r.z }
		} else {
			endRot = { x: 0, y: 0, z: 0 }
		}
	}

	// Increase z when centering to float above the pyramid
	const finalEndPos = new THREE.Vector3(endPos.x, endPos.y, 1.0)
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
			// Keep hover target scale in sync with the label so hit area
			// matches visual size when labels animate between centered/uncentered.
			hover.scale.copy(label.scale)
		}
	}
	renderer.render(scene, camera)
}

// Expose some APIs to the global `window` for legacy callers and tests that
// invoke functions directly without importing. Guarded so it only runs when
// a `window` object is present (e.g. in the browser or jsdom test env).
if (WIN) {
	WIN.animatePyramid = animatePyramid
	WIN.resetPyramidToHome = resetPyramidToHome
}

// === Resize ===
if (WIN) {
	WIN.addEventListener("resize", () => {
		camera.aspect = WIN.innerWidth / WIN.innerHeight
		camera.updateProjectionMatrix()
		renderer.setSize(WIN.innerWidth, WIN.innerHeight)

		const bioPlane = scene.getObjectByName("bioPlane")
		if (bioPlane) scene.remove(bioPlane)
		const portfolioPlane = scene.getObjectByName("portfolioPlane")
		if (portfolioPlane) scene.remove(portfolioPlane)
	})
}
