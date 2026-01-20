import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

// === Scene / Camera / Renderer ===
export const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)

export const camera = new THREE.PerspectiveCamera(
	50,
	window.innerWidth / window.innerHeight,
	0.1,
	2000,
)
camera.position.set(0, 0, 6)
camera.lookAt(0, 0, 0)

export const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.localClippingEnabled = true

// Add renderer canvas to the DOM (inside scene-container for proper z-index stacking)
const sceneContainer = document.getElementById("scene-container")
if (sceneContainer) {
	sceneContainer.appendChild(renderer.domElement)
} else {
	document.body.appendChild(renderer.domElement)
}

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
export const STAR_CONFIG = {
	count: 3500,
	size: 3.5, // Increased size for brightness
	opacity: 1.0,
}

const starGeo = new THREE.BufferGeometry()
const positions = new Float32Array(STAR_CONFIG.count * 3)
const colors = new Float32Array(STAR_CONFIG.count * 3)
const color = new THREE.Color()

for (let i = 0; i < STAR_CONFIG.count; i++) {
	// Spherical distribution for more natural background
	const r = 400 + Math.random() * 400
	const theta = 2 * Math.PI * Math.random()
	const phi = Math.acos(2 * Math.random() - 1)

	positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta)
	positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
	positions[i * 3 + 2] = r * Math.cos(phi)

	// Color variation
	const starType = Math.random()
	if (starType > 0.9) {
		color.setHex(0xaaaaaa) // Dimmer white
	} else if (starType > 0.7) {
		color.setHex(0xffdddd) // Reddish
	} else if (starType > 0.5) {
		color.setHex(0xddddff) // Blueish
	} else {
		color.setHex(0xffffff) // Bright white
	}

	colors[i * 3 + 0] = color.r
	colors[i * 3 + 1] = color.g
	colors[i * 3 + 2] = color.b
}
starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
starGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3))

// Create soft circle texture programmatically
const canvas = document.createElement("canvas")
canvas.width = 32
canvas.height = 32
const ctx = canvas.getContext("2d")
const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
gradient.addColorStop(0, "rgba(255,255,255,1)")
gradient.addColorStop(0.4, "rgba(255,255,255,0.9)") // Extended bright core
gradient.addColorStop(0.6, "rgba(255,255,255,0.4)")
gradient.addColorStop(1, "rgba(255,255,255,0)")
ctx.fillStyle = gradient
ctx.fillRect(0, 0, 32, 32)
const starTexture = new THREE.CanvasTexture(canvas)

const starMat = new THREE.PointsMaterial({
	size: STAR_CONFIG.size,
	map: starTexture,
	transparent: true,
	opacity: STAR_CONFIG.opacity,
	vertexColors: true,
	blending: THREE.AdditiveBlending,
	depthWrite: false,
})
export const stars = new THREE.Points(starGeo, starMat)
scene.add(stars)

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
