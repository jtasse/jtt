import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import {
	bioText,
	portfolioData,
	makeBioPlane,
	makePortfolioPlane,
} from "../planes.js"

export const pyramidGroup = new THREE.Group()
export const labels = {}

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
controls.enableDamping = true
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
const size = 2.25
const height = 1.75
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
		metalness: 1,
		roughness: 0,
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

// === Labels ===
export function initLabels(makeLabelPlane) {
	const labelConfigs = {
		Bio: {
			text: "Bio",
			position: { x: -0.7, y: 0.04, z: 0.4 },
			rotation: { x: 0, y: 0.438, z: 1 },
			size: [1.5, 0.45],
		},
		Portfolio: {
			text: "Portfolio",
			position: { x: 0.7, y: 0, z: 0.4 },
			rotation: { x: -0.102, y: -0.502, z: -1.0 },
			size: [1.8, 0.45],
		},
		Blog: {
			text: "Blog",
			position: { x: 0, y: -1.05, z: 0.7 },
			rotation: { x: 0, y: 0, z: 0 },
			size: [1.8, 0.5],
		},
	}

	for (const key in labelConfigs) {
		const cfg = labelConfigs[key]
		const mesh = makeLabelPlane(cfg.text, ...cfg.size)
		mesh.position.set(cfg.position.x, cfg.position.y, cfg.position.z)
		mesh.rotation.set(cfg.rotation.x, cfg.rotation.y, cfg.rotation.z)
		pyramidGroup.add(mesh)
		labels[key] = mesh
		mesh.userData.name = key
		mesh.cursor = "pointer"
	}
}

// === Pyramid State ===
let isAtBottom = false

export function animatePyramid(down = true, section = null) {
	const duration = 1000
	const startRot = pyramidGroup.rotation.y
	const endRot = startRot + (down ? Math.PI * 2 : -Math.PI * 2)
	const startPosY = pyramidGroup.position.y
	const endPosY = down ? -1.75 : 0.35 // adjusted

	const startScale = pyramidGroup.scale.x
	const endScale = down ? 0.5 : 1

	const startTime = performance.now()
	function step(time) {
		const t = Math.min((time - startTime) / duration, 1)
		pyramidGroup.rotation.y = startRot + (endRot - startRot) * t
		pyramidGroup.position.y = startPosY + (endPosY - startPosY) * t
		const s = startScale + (endScale - startScale) * t
		pyramidGroup.scale.set(s, s, s)

		if (t < 1) requestAnimationFrame(step)
		else {
			isAtBottom = down
			if (section === "bio") showBioPlane()
			else if (section === "portfolio") showPortfolioPlane()
		}
	}
	requestAnimationFrame(step)
}

// === Plane visibility functions ===
export function showBioPlane() {
	hidePortfolio()
	let bioPlane = scene.getObjectByName("bioPlane")
	if (!bioPlane) {
		bioPlane = makeBioPlane(bioText)
		bioPlane.position.y = 0.5
		scene.add(bioPlane)
	} else bioPlane.visible = true
}

export function showPortfolioPlane() {
	hideBio()
	let portfolioPlane = scene.getObjectByName("portfolioPlane")
	if (!portfolioPlane) {
		portfolioPlane = makePortfolioPlane(portfolioData)
		portfolioPlane.position.y = 0.5
		scene.add(portfolioPlane)
	} else portfolioPlane.visible = true
}

function hideBio() {
	const bioPlane = scene.getObjectByName("bioPlane")
	if (bioPlane) bioPlane.visible = false
}

function hidePortfolio() {
	const plane = scene.getObjectByName("portfolioPlane")
	if (plane) plane.visible = false
}

// === Animate Label to Front/Center ===
export function animateLabelToCenter(labelMesh) {
	const startPos = labelMesh.position.clone()
	const endPos = new THREE.Vector3(0, 0, 1.5) // slightly in front
	const startRot = labelMesh.rotation.clone()
	const endRot = new THREE.Euler(0, 0, 0)

	const duration = 1000
	const startTime = performance.now()

	function step(time) {
		const t = Math.min((time - startTime) / duration, 1)
		labelMesh.position.lerpVectors(startPos, endPos, t)
		labelMesh.rotation.x = startRot.x + (endRot.x - startRot.x) * t
		labelMesh.rotation.y = startRot.y + (endRot.y - startRot.y) * t
		labelMesh.rotation.z = startRot.z + (endRot.z - startRot.z) * t
		if (t < 1) requestAnimationFrame(step)
	}
	requestAnimationFrame(step)
}

// === Animate Loop ===
export function animate() {
	requestAnimationFrame(animate)
	stars.rotation.y += 0.0008
	controls.update()
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
