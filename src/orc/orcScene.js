import * as THREE from "three"

// ORC Demo Scene - Orbital Refuse Collector visualization
// Features:
// - Monochromatic planet Earth sphere
// - Two satellites: geosynchronous and non-geosynchronous orbits
// - Orbital path rings
// - Isometric camera view

// Scene elements
export let orcGroup = null
export let planet = null
export let satellites = []
export let orbitalRings = []

// Animation state
let animationRunning = false
let animationId = null

// Constants
const PLANET_RADIUS = 0.5 // Much smaller planet
const GEO_ORBIT_RADIUS = 1.4 // Geosynchronous orbit
const LEO_ORBIT_RADIUS = 1.0 // Low Earth orbit (non-geosynchronous)
const GEO_ORBIT_SPEED = 0.003 // Slower - geosynchronous
const LEO_ORBIT_SPEED = 0.0045 // Only slightly faster - non-geosynchronous
const SATELLITE_SIZE = 0.08

// Create the ORC scene group
export function createOrcScene() {
	orcGroup = new THREE.Group()
	orcGroup.name = "orcScene"

	// Create Earth-like sphere (monochromatic)
	planet = createPlanet()
	orcGroup.add(planet)

	// Create orbital rings
	const geoRing = createOrbitalRing(GEO_ORBIT_RADIUS, 0x00aaff) // Blue for geo
	const leoRing = createOrbitalRing(LEO_ORBIT_RADIUS, 0x00ffaa) // Cyan for LEO
	// Tilt the LEO ring for visual interest
	leoRing.rotation.x = Math.PI * 0.15
	orbitalRings.push(geoRing, leoRing)
	orcGroup.add(geoRing)
	orcGroup.add(leoRing)

	// Create satellites
	const geoSatellite = createSatellite(0x00aaff) // Blue
	geoSatellite.userData = {
		orbitRadius: GEO_ORBIT_RADIUS,
		orbitSpeed: GEO_ORBIT_SPEED,
		angle: 0,
		orbitTiltX: 0,
	}
	satellites.push(geoSatellite)
	orcGroup.add(geoSatellite)

	const leoSatellite = createSatellite(0x00ffaa) // Cyan
	leoSatellite.userData = {
		orbitRadius: LEO_ORBIT_RADIUS,
		orbitSpeed: LEO_ORBIT_SPEED,
		angle: Math.PI, // Start on opposite side
		orbitTiltX: Math.PI * 0.15, // Match ring tilt
	}
	satellites.push(leoSatellite)
	orcGroup.add(leoSatellite)

	// Position for top-down isometric view where satellites are never occluded
	// Looking down at about 60 degrees ensures orbits are always visible
	orcGroup.rotation.x = -0.8
	orcGroup.rotation.y = 0.2

	return orcGroup
}

// Create a monochromatic Earth-like sphere
function createPlanet() {
	const geometry = new THREE.SphereGeometry(PLANET_RADIUS, 64, 64)

	// Create a canvas texture for Earth-like appearance
	const canvas = document.createElement("canvas")
	canvas.width = 512
	canvas.height = 256
	const ctx = canvas.getContext("2d")

	// Base color - dark blue/gray
	ctx.fillStyle = "#1a2a3a"
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	// Draw continents as lighter shapes (simplified monochromatic)
	ctx.fillStyle = "#3a5a6a"

	// North America
	drawContinent(ctx, 80, 40, 60, 50)
	// South America
	drawContinent(ctx, 120, 100, 35, 60)
	// Europe/Africa
	drawContinent(ctx, 250, 30, 40, 120)
	// Asia
	drawContinent(ctx, 320, 30, 100, 70)
	// Australia
	drawContinent(ctx, 420, 120, 40, 30)

	// Add some noise/texture
	for (let i = 0; i < 2000; i++) {
		const x = Math.random() * canvas.width
		const y = Math.random() * canvas.height
		const brightness = Math.random() * 20 + 40
		ctx.fillStyle = `rgba(${brightness}, ${brightness + 20}, ${
			brightness + 30
		}, 0.3)`
		ctx.fillRect(x, y, 2, 2)
	}

	// Add polar ice caps (lighter regions)
	ctx.fillStyle = "#5a7a8a"
	ctx.beginPath()
	ctx.ellipse(256, 10, 200, 15, 0, 0, Math.PI * 2)
	ctx.fill()
	ctx.beginPath()
	ctx.ellipse(256, 246, 200, 15, 0, 0, Math.PI * 2)
	ctx.fill()

	const texture = new THREE.CanvasTexture(canvas)
	texture.wrapS = THREE.RepeatWrapping
	texture.wrapT = THREE.ClampToEdgeWrapping

	const material = new THREE.MeshStandardMaterial({
		map: texture,
		metalness: 0.1,
		roughness: 0.8,
		emissive: new THREE.Color(0x0a1520),
		emissiveIntensity: 0.3,
	})

	const sphere = new THREE.Mesh(geometry, material)
	sphere.name = "planet"

	// Add atmosphere glow
	const atmosphereGeometry = new THREE.SphereGeometry(
		PLANET_RADIUS * 1.05,
		32,
		32
	)
	const atmosphereMaterial = new THREE.MeshBasicMaterial({
		color: 0x4488aa,
		transparent: true,
		opacity: 0.15,
		side: THREE.BackSide,
	})
	const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
	sphere.add(atmosphere)

	return sphere
}

// Helper to draw simplified continent shapes
function drawContinent(ctx, x, y, w, h) {
	ctx.beginPath()
	// Draw organic-looking shape
	ctx.moveTo(x + w * 0.5, y)
	ctx.bezierCurveTo(
		x + w,
		y + h * 0.2,
		x + w * 0.8,
		y + h * 0.8,
		x + w * 0.5,
		y + h
	)
	ctx.bezierCurveTo(x, y + h * 0.7, x + w * 0.2, y + h * 0.3, x + w * 0.5, y)
	ctx.fill()
}

// Create an orbital ring (path visualization)
function createOrbitalRing(radius, color) {
	const geometry = new THREE.TorusGeometry(radius, 0.01, 8, 128)
	const material = new THREE.MeshBasicMaterial({
		color: color,
		transparent: true,
		opacity: 0.5,
	})
	const ring = new THREE.Mesh(geometry, material)
	ring.rotation.x = Math.PI / 2 // Lay flat
	ring.name = `orbitalRing_${radius}`
	return ring
}

// Create a satellite
function createSatellite(color) {
	const group = new THREE.Group()

	// Main body
	const bodyGeometry = new THREE.BoxGeometry(
		SATELLITE_SIZE,
		SATELLITE_SIZE * 0.5,
		SATELLITE_SIZE * 0.5
	)
	const bodyMaterial = new THREE.MeshStandardMaterial({
		color: 0x888888,
		metalness: 0.8,
		roughness: 0.2,
	})
	const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
	group.add(body)

	// Solar panels (two wings)
	const panelGeometry = new THREE.BoxGeometry(
		SATELLITE_SIZE * 0.1,
		SATELLITE_SIZE * 1.5,
		SATELLITE_SIZE * 0.02
	)
	const panelMaterial = new THREE.MeshStandardMaterial({
		color: color,
		metalness: 0.3,
		roughness: 0.5,
		emissive: new THREE.Color(color),
		emissiveIntensity: 0.3,
	})

	const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial)
	leftPanel.position.set(-SATELLITE_SIZE * 0.6, 0, 0)
	group.add(leftPanel)

	const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial)
	rightPanel.position.set(SATELLITE_SIZE * 0.6, 0, 0)
	group.add(rightPanel)

	// Antenna
	const antennaGeometry = new THREE.CylinderGeometry(
		0.005,
		0.005,
		SATELLITE_SIZE * 0.5,
		8
	)
	const antennaMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
	const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial)
	antenna.position.set(0, SATELLITE_SIZE * 0.4, 0)
	group.add(antenna)

	group.name = "satellite"
	return group
}

// Animate satellites in their orbits
export function animateOrcScene() {
	if (!orcGroup) return

	satellites.forEach((sat) => {
		const data = sat.userData
		data.angle += data.orbitSpeed

		// Calculate position on orbit
		const x = Math.cos(data.angle) * data.orbitRadius
		const z = Math.sin(data.angle) * data.orbitRadius

		// Apply orbit tilt
		const y =
			Math.sin(data.angle) * Math.sin(data.orbitTiltX) * data.orbitRadius

		sat.position.set(x, y, z)

		// Make satellite face direction of travel
		sat.rotation.y = -data.angle + Math.PI / 2
	})

	// Slowly rotate planet
	if (planet) {
		planet.rotation.y += 0.001
	}
}

// Start animation loop (for standalone preview)
export function startOrcAnimation(renderer, scene, camera) {
	animationRunning = true
	function loop() {
		if (!animationRunning) return
		animateOrcScene()
		renderer.render(scene, camera)
		animationId = requestAnimationFrame(loop)
	}
	loop()
}

// Stop animation
export function stopOrcAnimation() {
	animationRunning = false
	if (animationId) {
		cancelAnimationFrame(animationId)
		animationId = null
	}
}

// Get isometric camera position for this scene
export function getOrcCameraPosition() {
	// More top-down view to ensure satellites are never occluded by planet
	return {
		position: new THREE.Vector3(2, 4, 3),
		target: new THREE.Vector3(0, 0, 0),
	}
}

// Dispose of ORC scene resources
export function disposeOrcScene() {
	stopOrcAnimation()

	if (orcGroup) {
		orcGroup.traverse((child) => {
			if (child.geometry) child.geometry.dispose()
			if (child.material) {
				if (Array.isArray(child.material)) {
					child.material.forEach((m) => m.dispose())
				} else {
					child.material.dispose()
				}
			}
		})
	}

	orcGroup = null
	planet = null
	satellites = []
	orbitalRings = []
}

// Create a mini preview version for portfolio showcase
// This creates a completely independent scene that doesn't affect the main ORC scene
export function createOrcPreview(width = 300, height = 200) {
	const container = document.createElement("div")
	container.style.width = `${width}px`
	container.style.height = `${height}px`
	container.style.position = "relative"
	container.style.overflow = "hidden"
	container.style.borderRadius = "8px"
	container.style.border = "2px solid #00aaff"
	container.style.cursor = "pointer"
	container.style.background = "#000011"

	// Create independent mini scene (not using shared orcGroup)
	const miniScene = new THREE.Scene()
	miniScene.background = new THREE.Color(0x000011)

	// Add lighting
	miniScene.add(new THREE.AmbientLight(0xffffff, 0.4))
	const light = new THREE.DirectionalLight(0xffffff, 0.8)
	light.position.set(3, 3, 3)
	miniScene.add(light)

	// Create mini ORC elements independently
	const miniGroup = new THREE.Group()

	// Mini planet
	const miniPlanetGeo = new THREE.SphereGeometry(0.3, 32, 32)
	const miniPlanetMat = new THREE.MeshStandardMaterial({
		color: 0x1a3a5a,
		metalness: 0.1,
		roughness: 0.8,
		emissive: new THREE.Color(0x0a1520),
		emissiveIntensity: 0.3,
	})
	const miniPlanet = new THREE.Mesh(miniPlanetGeo, miniPlanetMat)
	miniGroup.add(miniPlanet)

	// Mini atmosphere
	const atmosGeo = new THREE.SphereGeometry(0.35, 32, 32)
	const atmosMat = new THREE.MeshBasicMaterial({
		color: 0x4488aa,
		transparent: true,
		opacity: 0.15,
		side: THREE.BackSide,
	})
	miniPlanet.add(new THREE.Mesh(atmosGeo, atmosMat))

	// Mini orbital rings
	const ring1Geo = new THREE.TorusGeometry(0.8, 0.008, 8, 64)
	const ring1Mat = new THREE.MeshBasicMaterial({
		color: 0x00aaff,
		transparent: true,
		opacity: 0.5,
	})
	const ring1 = new THREE.Mesh(ring1Geo, ring1Mat)
	ring1.rotation.x = Math.PI / 2
	miniGroup.add(ring1)

	const ring2Geo = new THREE.TorusGeometry(0.6, 0.008, 8, 64)
	const ring2Mat = new THREE.MeshBasicMaterial({
		color: 0x00ffaa,
		transparent: true,
		opacity: 0.5,
	})
	const ring2 = new THREE.Mesh(ring2Geo, ring2Mat)
	ring2.rotation.x = Math.PI / 2 + 0.15
	miniGroup.add(ring2)

	// Mini satellites
	const satGeo = new THREE.SphereGeometry(0.04, 8, 8)
	const sat1Mat = new THREE.MeshBasicMaterial({
		color: 0x00aaff,
		emissive: 0x00aaff,
	})
	const sat1 = new THREE.Mesh(satGeo, sat1Mat)
	miniGroup.add(sat1)

	const sat2Mat = new THREE.MeshBasicMaterial({
		color: 0x00ffaa,
		emissive: 0x00ffaa,
	})
	const sat2 = new THREE.Mesh(satGeo.clone(), sat2Mat)
	miniGroup.add(sat2)

	// Animation state for mini satellites
	let sat1Angle = 0
	let sat2Angle = Math.PI

	miniGroup.rotation.x = -0.8
	miniGroup.rotation.y = 0.2
	miniScene.add(miniGroup)

	// Mini camera
	const aspect = width / height
	const miniCamera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100)
	miniCamera.position.set(1.2, 2.4, 1.8)
	miniCamera.lookAt(0, 0, 0)

	// Mini renderer
	const miniRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
	miniRenderer.setSize(width, height)
	miniRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	container.appendChild(miniRenderer.domElement)

	// Animation for preview
	let previewAnimId = null
	let isRunning = true

	function animatePreview() {
		if (!isRunning) return

		// Animate mini satellites
		sat1Angle += 0.008
		sat2Angle += 0.012

		sat1.position.set(Math.cos(sat1Angle) * 0.8, 0, Math.sin(sat1Angle) * 0.8)

		sat2.position.set(
			Math.cos(sat2Angle) * 0.6,
			Math.sin(sat2Angle) * 0.1,
			Math.sin(sat2Angle) * 0.6
		)

		// Slowly rotate planet
		miniPlanet.rotation.y += 0.002

		miniRenderer.render(miniScene, miniCamera)
		previewAnimId = requestAnimationFrame(animatePreview)
	}
	animatePreview()

	// Cleanup function
	container.cleanup = () => {
		isRunning = false
		if (previewAnimId) {
			cancelAnimationFrame(previewAnimId)
			previewAnimId = null
		}
		// Dispose geometries and materials
		miniGroup.traverse((child) => {
			if (child.geometry) child.geometry.dispose()
			if (child.material) {
				if (Array.isArray(child.material)) {
					child.material.forEach((m) => m.dispose())
				} else {
					child.material.dispose()
				}
			}
		})
		miniRenderer.dispose()
	}

	return container
}
