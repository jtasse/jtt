import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

const container = document.getElementById("scene-container")

// === Scene / Camera / Renderer ===
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)

const camera = new THREE.PerspectiveCamera(
	50,
	window.innerWidth / window.innerHeight,
	0.1,
	2000
)
camera.position.set(0, 0, 6)
camera.lookAt(0, 0, 0)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
container.appendChild(renderer.domElement)

// === Controls ===
const controls = new OrbitControls(camera, renderer.domElement)
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

// === Nearby star ===
// TODO

// === Pyramid ===
const size = 2.25
const height = 1.75
const halfSize = size / 2
const triHeight = (Math.sqrt(3) / 2) * size
const apex = new THREE.Vector3(0, height / 2, 0)
const v1 = new THREE.Vector3(-halfSize, -height / 2, triHeight / 3)
const v2 = new THREE.Vector3(halfSize, -height / 2, triHeight / 3)
const v3 = new THREE.Vector3(0, -height / 2, (-2 * triHeight) / 3)

const pyramidGroup = new THREE.Group()
scene.add(pyramidGroup)

// === Reflective pyramid faces ===
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

// === Label Helper ===
function makeLabelPlane(text, width = 1.6, height = 0.45) {
	const canvas = document.createElement("canvas")
	canvas.width = 1024
	canvas.height = 256
	const ctx = canvas.getContext("2d")
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.fillStyle = "white"
	ctx.font = "bold 120px sans-serif"
	ctx.textAlign = "center"
	ctx.textBaseline = "middle"
	ctx.fillText(text, canvas.width / 2, canvas.height / 2)
	const tex = new THREE.CanvasTexture(canvas)
	return new THREE.Mesh(
		new THREE.PlaneGeometry(width, height),
		new THREE.MeshBasicMaterial({
			map: tex,
			transparent: true,
			side: THREE.DoubleSide,
		})
	)
}

// === Labels ===
const labels = {}
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

// === Bio text ===
const bioText = `I am a Certified Professional Technical Communicator and software developer who has created technical documentation since 2007.

At least since I was assembling PCs in high school (and probably earlier), I have had a love of tech. I took the long way around by majoring in Philosophy in college, but after a few years I realized that I wanted to work with software. And I did just that at Hyland Software–going from implementer to QA to developer.

But a common thread throughout all this work was that I found I was particularly good at documenting the software for different stakeholders–developers, end users, tech support, product owners, etc. In fact, while I would say that while I am good at writing code, I am even better at writing in English!`

function makeBioPlane(text) {
	const margin = 20
	const canvasWidth = window.innerWidth * 0.9
	const lineHeight = 28
	const paragraphSpacing = 1.5

	const canvas = document.createElement("canvas")
	canvas.width = canvasWidth
	const ctx = canvas.getContext("2d")
	ctx.font = `${lineHeight}px sans-serif`

	const paragraphs = text.split("\n\n")
	const lines = []

	paragraphs.forEach((paragraph) => {
		const words = paragraph.split(" ")
		let currentLine = ""
		words.forEach((word) => {
			const testLine = currentLine ? currentLine + " " + word : word
			if (ctx.measureText(testLine).width > canvas.width - 2 * margin) {
				lines.push(currentLine)
				currentLine = word
			} else {
				currentLine = testLine
			}
		})
		if (currentLine) lines.push(currentLine)
		lines.push("")
	})

	const canvasHeight = lines.length * lineHeight + 50
	canvas.height = canvasHeight

	ctx.font = `${lineHeight}px sans-serif`
	ctx.fillStyle = "white"
	ctx.textAlign = "left"
	ctx.textBaseline = "top"

	let y = 20
	lines.forEach((line) => {
		ctx.fillText(line, margin, y)
		if (line === "") y += lineHeight * paragraphSpacing
		else y += lineHeight
	})

	const texture = new THREE.CanvasTexture(canvas)
	const planeWidth = 6
	const planeHeight = (canvasHeight / canvasWidth) * planeWidth

	const mesh = new THREE.Mesh(
		new THREE.PlaneGeometry(planeWidth, planeHeight),
		new THREE.MeshBasicMaterial({
			map: texture,
			transparent: true,
			side: THREE.DoubleSide,
		})
	)
	mesh.position.set(0, 0, -1)
	return mesh
}

// === Pyramid State ===
let isAtBottom = false

// === Click Handling ===
const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()

function onClick(event) {
	pointer.x = (event.clientX / window.innerWidth) * 2 - 1
	pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
	raycaster.setFromCamera(pointer, camera)

	const labelIntersects = raycaster.intersectObjects(Object.values(labels))
	if (labelIntersects.length > 0) {
		const obj = labelIntersects[0].object
		if (obj.userData.name === "Bio") {
			animatePyramid(true, true)
		} else {
			hideBio()
		}
		return
	}

	const pyramidIntersects = raycaster.intersectObjects(
		pyramidGroup.children.filter((c) => !labels[c.userData?.name])
	)
	if (pyramidIntersects.length > 0) {
		animatePyramid(!isAtBottom, false)
		hideBio()
	}
}
window.addEventListener("click", onClick)

// === Hide Bio ===
function hideBio() {
	const bioPlane = scene.getObjectByName("bioPlane")
	if (bioPlane) bioPlane.visible = false
}

// === Pyramid Animation ===
function animatePyramid(down = true, showBio = false) {
	const duration = 1000
	const startRot = pyramidGroup.rotation.y
	const endRot = startRot + (down ? Math.PI * 2 : -Math.PI * 2)
	const startPosY = pyramidGroup.position.y
	const endPosY = down ? -2 : 0.35
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
			if (showBio) {
				if (!scene.getObjectByName("bioPlane")) {
					const bioPlane = makeBioPlane(bioText)
					bioPlane.name = "bioPlane"
					bioPlane.position.y = 0.5
					scene.add(bioPlane)
				} else scene.getObjectByName("bioPlane").visible = true
			}
		}
	}
	requestAnimationFrame(step)
}

// === Animate Loop ===
function animate() {
	requestAnimationFrame(animate)
	stars.rotation.y += 0.0008
	controls.update()
	renderer.render(scene, camera)
}
animate()

// === Resize ===
window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
})
