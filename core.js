import * as THREE from "three"

// === Scene, Camera, Renderer ===
export const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)

export const camera = new THREE.PerspectiveCamera(
	50,
	window.innerWidth / window.innerHeight,
	0.1,
	2000
)
camera.position.set(0, 0, 6)

export const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)

// === Lighting ===
scene.add(new THREE.AmbientLight(0xffffff, 0.6))
const keyLight = new THREE.DirectionalLight(0xffffff, 0.8)
keyLight.position.set(5, 8, 5)
scene.add(keyLight)
