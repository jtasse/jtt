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

// Constants
const PLANET_RADIUS = 0.5 // Planet's size
const GEO_ORBIT_RADIUS_X = 2.7 // Elongated outer orbit (left-right)
const GEO_ORBIT_RADIUS_Z = 1.7 // Elongated outer orbit (front-back)
const LEO_ORBIT_RADIUS = 1.2 // Inner circular orbit
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

	// Create a group for the GEO satellite and its ring to make it elliptical and tilted
	const geoOrbitGroup = new THREE.Group()
	const geoRing = createOrbitalRing(
		GEO_ORBIT_RADIUS_X,
		GEO_ORBIT_RADIUS_Z,
		0x00aaff
	)
	const geoSatellite = createSatellite(0x00aaff) // Blue
	geoSatellite.userData = {
		id: "geo-001",
		orbitRadiusX: GEO_ORBIT_RADIUS_X,
		orbitRadiusZ: GEO_ORBIT_RADIUS_Z,
		orbitSpeed: GEO_ORBIT_SPEED,
		angle: 0,
	}
	geoOrbitGroup.add(geoRing)
	geoOrbitGroup.add(geoSatellite)
	geoOrbitGroup.rotation.x = Math.PI / 2 // Rotate group to XZ plane
	geoOrbitGroup.rotation.z = Math.PI / 6 // Tilt group 30 degrees
	orcGroup.add(geoOrbitGroup)
	orbitalRings.push(geoRing)
	satellites.push(geoSatellite)

	// Create LEO satellite and its ring (flat on XZ plane)
	const leoRing = createOrbitalRing(LEO_ORBIT_RADIUS, undefined, 0x00ffaa)
	leoRing.rotation.x = Math.PI / 2 // Place LEO orbit on the XZ plane
	orcGroup.add(leoRing)
	orbitalRings.push(leoRing)

	const leoSatellite = createSatellite(0x00ffaa) // Cyan
	leoSatellite.userData = {
		id: "leo-001",
		orbitRadius: LEO_ORBIT_RADIUS,
		orbitSpeed: LEO_ORBIT_SPEED,
		angle: Math.PI, // Start on opposite side
	}
	satellites.push(leoSatellite)
	orcGroup.add(leoSatellite)

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
	ctx.fillStyle = "#222222" // Dark gray for deep water
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	// Draw continents as outlines
	ctx.strokeStyle = "#555555" // Medium-light gray for outlines
	ctx.lineWidth = 2

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

	const texture = new THREE.CanvasTexture(canvas)
	texture.wrapS = THREE.RepeatWrapping
	texture.wrapT = THREE.ClampToEdgeWrapping

	const material = new THREE.MeshStandardMaterial({
		map: texture,
		metalness: 0, // Non-metallic
		roughness: 0.8, // A bit rough
		color: 0x333333, // Dark base color for the planet
		emissive: new THREE.Color(0x000000), // No emission
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
		color: 0xaaaaaa,
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
	ctx.stroke()
}

// Create an orbital ring (path visualization)
function createOrbitalRing(xRadius, zRadius, color) {
	let ring
	if (zRadius === undefined) {
		// It's a circle, use TorusGeometry
		const geometry = new THREE.TorusGeometry(xRadius, 0.01, 8, 128)
		const material = new THREE.MeshBasicMaterial({
			color: color,
			transparent: true,
			opacity: 0.5,
		})
		ring = new THREE.Mesh(geometry, material)
	} else {
		// It's an ellipse, use LineLoop with an EllipseCurve for robustness
		const curve = new THREE.EllipseCurve(
			0,
			0, // Center x, y
			xRadius,
			zRadius, // xRadius, yRadius
			0,
			2 * Math.PI, // Start and end angle
			false, // Clockwise
			0 // Rotation
		)
		const points = curve.getPoints(128)
		const geometry = new THREE.BufferGeometry().setFromPoints(points)
		const material = new THREE.LineBasicMaterial({
			color: color,
			transparent: true,
			opacity: 0.5,
		})
		ring = new THREE.LineLoop(geometry, material)
	}

	ring.name = `orbitalRing_${xRadius}`
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

		if (data.orbitRadiusX) {
			// GEO satellite, moving on its local elliptical XY plane within a rotated group
			const x = Math.cos(data.angle) * data.orbitRadiusX
			const y = Math.sin(data.angle) * data.orbitRadiusZ
			sat.position.set(x, y, 0)
			// Rotate satellite to face direction of travel
			sat.rotation.z = data.angle + Math.PI / 2
		} else {
			// LEO satellite, moving on a circular XZ plane
			const x = Math.cos(data.angle) * data.orbitRadius
			const z = Math.sin(data.angle) * data.orbitRadius
			sat.position.set(x, 0, z)
			// Rotate satellite to face direction of travel
			sat.rotation.y = -data.angle + Math.PI / 2
		}
	})
}

// Dispose of ORC scene resources
export function disposeOrcScene() {
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
	// Outer ring (blue, elliptical)
	const ring1 = createOrbitalRing(0.8, 0.5, 0x00aaff)

	// Inner ring (green, circular)
	const ring2Geo = new THREE.TorusGeometry(0.6, 0.008, 8, 64)
	const ring2Mat = new THREE.MeshBasicMaterial({
		color: 0x00ffaa,
		transparent: true,
		opacity: 0.5,
	})
	const ring2 = new THREE.Mesh(ring2Geo, ring2Mat)
	ring2.rotation.x = Math.PI / 2 // Lay flat on XZ plane
	miniGroup.add(ring2)

	// Mini satellites
	const satGeo = new THREE.SphereGeometry(0.04, 8, 8)
	const sat1Mat = new THREE.MeshBasicMaterial({
		color: 0x00aaff,
		emissive: 0x00aaff,
	})
	const sat1 = new THREE.Mesh(satGeo, sat1Mat)

	const sat2Mat = new THREE.MeshBasicMaterial({
		color: 0x00ffaa,
		emissive: 0x00ffaa,
	})
	const sat2 = new THREE.Mesh(satGeo.clone(), sat2Mat)
	miniGroup.add(sat2)

	// Group for outer satellite and its ring
	const geoOrbitGroupMini = new THREE.Group()
	geoOrbitGroupMini.add(ring1)
	geoOrbitGroupMini.add(sat1)
	geoOrbitGroupMini.rotation.x = Math.PI / 2
	geoOrbitGroupMini.rotation.z = Math.PI / 6
	miniGroup.add(geoOrbitGroupMini)
	miniScene.add(miniGroup)

	// Mini camera
	const aspect = width / height
	const miniCamera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100)
	miniCamera.position.set(0, 2.0, 1.5)
	miniCamera.lookAt(0, 0, 0)

	// Mini renderer
	const miniRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
	miniRenderer.setSize(width, height)
	miniRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	container.appendChild(miniRenderer.domElement)

	// Animation state for mini satellites
	let sat1Angle = 0
	let sat2Angle = Math.PI

	// Animation for preview
	let previewAnimId = null
	let isRunning = true

	function animatePreview() {
		if (!isRunning) return

		// Animate mini satellites
		sat1Angle += 0.008
		sat2Angle += 0.012

		// Outer satellite (blue) - elliptical on its local XY plane
		sat1.position.set(Math.cos(sat1Angle) * 0.8, Math.sin(sat1Angle) * 0.5, 0)

		// Inner satellite (green) - circular on the main XZ plane
		sat2.position.set(Math.cos(sat2Angle) * 0.6, 0, Math.sin(sat2Angle) * 0.6)

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
