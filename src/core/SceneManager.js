import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

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
renderer.localClippingEnabled = true

// Add renderer canvas to the DOM
document.body.appendChild(renderer.domElement)

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
