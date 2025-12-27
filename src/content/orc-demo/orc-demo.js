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
const GEO_ORBIT_SPEED = -0.003 // Counter-clockwise
const MEO_ORBIT_RADIUS_X = 3.0 // Major axis (Molniya)
const MEO_ORBIT_RADIUS_Z = 0.8 // Minor axis
const MEO_ORBIT_SPEED = -0.0025
const LEO_ORBIT_SPEED = -0.0045 // Counter-clockwise
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
		name: "George",
		id: "geo-001",
		orbitRadiusX: GEO_ORBIT_RADIUS_X,
		orbitRadiusZ: GEO_ORBIT_RADIUS_Z,
		orbitSpeed: GEO_ORBIT_SPEED,
		angle: 0,
		orbitalRing: geoRing,
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
		name: "Leonard",
		id: "leo-001",
		orbitRadius: LEO_ORBIT_RADIUS,
		orbitSpeed: LEO_ORBIT_SPEED,
		angle: Math.PI, // Start on opposite side
		orbitalRing: leoRing,
	}
	satellites.push(leoSatellite)
	orcGroup.add(leoSatellite)

	// Create MEO satellite (Molniya Orbit) - Purple
	// Molniya orbits are highly elliptical with high inclination (~63.4 degrees)
	const meoOrbitGroup = new THREE.Group()
	const meoRing = createOrbitalRing(
		MEO_ORBIT_RADIUS_X,
		MEO_ORBIT_RADIUS_Z,
		0xff00ff
	)
	const meoSatellite = createSatellite(0xff00ff) // Purple
	meoSatellite.userData = {
		name: "Moltar",
		id: "meo-001",
		orbitRadiusX: MEO_ORBIT_RADIUS_X,
		orbitRadiusZ: MEO_ORBIT_RADIUS_Z,
		orbitSpeed: MEO_ORBIT_SPEED,
		angle: Math.PI / 2,
		orbitalRing: meoRing,
	}
	meoOrbitGroup.add(meoRing)
	meoOrbitGroup.add(meoSatellite)
	// Pitch upward (X rotation) and tilt slightly (Z rotation) to avoid occlusion
	meoOrbitGroup.rotation.x = Math.PI / 2.5 // Steep inclination
	meoOrbitGroup.rotation.z = -Math.PI / 6
	orcGroup.add(meoOrbitGroup)
	orbitalRings.push(meoRing)
	satellites.push(meoSatellite)

	return orcGroup
}

// Create a monochromatic Earth-like sphere with accurate continent outlines
function createPlanet() {
	const geometry = new THREE.SphereGeometry(PLANET_RADIUS, 64, 64)

	// Create a high-resolution canvas texture for Earth-like appearance
	const canvas = document.createElement("canvas")
	canvas.width = 1024
	canvas.height = 512
	const ctx = canvas.getContext("2d")

	// Draw continents as white filled shapes with outlines
	ctx.fillStyle = "#ffffff"
	ctx.strokeStyle = "#ffffff"
	ctx.lineWidth = 1.5
	ctx.lineCap = "round"
	ctx.lineJoin = "round"

	// Draw all continents with accurate outlines
	drawAccurateContinents(ctx, canvas.width, canvas.height)

	const texture = new THREE.CanvasTexture(canvas)
	texture.wrapS = THREE.RepeatWrapping
	texture.wrapT = THREE.ClampToEdgeWrapping
	texture.anisotropy = 16

	const material = new THREE.MeshStandardMaterial({
		map: texture,
		metalness: 0.1,
		roughness: 0.9,
		emissive: new THREE.Color(0x111111), // Slight self-illumination
		emissiveIntensity: 0.3,
	})

	const sphere = new THREE.Mesh(geometry, material)
	sphere.name = "planet"
	// Store initial rotation for animation
	sphere.userData.rotationSpeed = 0.001 // Earth-like rotation speed

	// Add inner atmosphere glow (subtle rim light effect)
	const innerAtmosphereGeometry = new THREE.SphereGeometry(
		PLANET_RADIUS * 1.02,
		64,
		64
	)
	const innerAtmosphereMaterial = new THREE.ShaderMaterial({
		uniforms: {
			glowColor: { value: new THREE.Color(0x4488ff) },
			viewVector: { value: new THREE.Vector3(0, 0, 1) },
		},
		vertexShader: `
			varying vec3 vNormal;
			varying vec3 vPositionNormal;
			void main() {
				vNormal = normalize(normalMatrix * normal);
				vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
		`,
		fragmentShader: `
			uniform vec3 glowColor;
			varying vec3 vNormal;
			varying vec3 vPositionNormal;
			void main() {
				float intensity = pow(0.7 - dot(vNormal, vPositionNormal), 2.0);
				gl_FragColor = vec4(glowColor, intensity * 0.4);
			}
		`,
		side: THREE.FrontSide,
		blending: THREE.AdditiveBlending,
		transparent: true,
		depthWrite: false,
	})
	const innerAtmosphere = new THREE.Mesh(
		innerAtmosphereGeometry,
		innerAtmosphereMaterial
	)
	sphere.add(innerAtmosphere)

	// Add outer atmosphere glow
	const outerAtmosphereGeometry = new THREE.SphereGeometry(
		PLANET_RADIUS * 1.15,
		32,
		32
	)
	const outerAtmosphereMaterial = new THREE.ShaderMaterial({
		uniforms: {
			glowColor: { value: new THREE.Color(0x3366cc) },
		},
		vertexShader: `
			varying vec3 vNormal;
			void main() {
				vNormal = normalize(normalMatrix * normal);
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
		`,
		fragmentShader: `
			uniform vec3 glowColor;
			varying vec3 vNormal;
			void main() {
				float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
				gl_FragColor = vec4(glowColor, intensity * 0.15);
			}
		`,
		side: THREE.BackSide,
		blending: THREE.AdditiveBlending,
		transparent: true,
		depthWrite: false,
	})
	const outerAtmosphere = new THREE.Mesh(
		outerAtmosphereGeometry,
		outerAtmosphereMaterial
	)
	sphere.add(outerAtmosphere)

	return sphere
}

// Convert lat/lon to canvas x/y coordinates (equirectangular projection)
function latLonToCanvas(lat, lon, width, height) {
	// lon: -180 to 180 -> x: 0 to width
	// lat: 90 to -90 -> y: 0 to height
	const x = ((lon + 180) / 360) * width
	const y = ((90 - lat) / 180) * height
	return { x, y }
}

// Draw accurate continent outlines
function drawAccurateContinents(ctx, width, height) {
	// Simplified but recognizable continent outlines
	// Coordinates are [longitude, latitude] pairs

	// North America
	const northAmerica = [
		[-168, 65],
		[-165, 62],
		[-160, 60],
		[-150, 61],
		[-140, 60],
		[-135, 57],
		[-130, 55],
		[-125, 50],
		[-124, 45],
		[-123, 40],
		[-117, 33],
		[-110, 30],
		[-105, 25],
		[-100, 22],
		[-95, 18],
		[-90, 20],
		[-88, 22],
		[-85, 22],
		[-83, 18],
		[-80, 10],
		[-78, 8],
		[-82, 10],
		[-85, 12],
		[-88, 18],
		[-92, 20],
		[-95, 25],
		[-97, 28],
		[-95, 30],
		[-90, 30],
		[-85, 30],
		[-82, 32],
		[-78, 35],
		[-75, 38],
		[-72, 42],
		[-70, 43],
		[-68, 45],
		[-66, 45],
		[-64, 47],
		[-67, 48],
		[-70, 47],
		[-72, 45],
		[-75, 45],
		[-78, 43],
		[-80, 42],
		[-82, 45],
		[-85, 47],
		[-88, 48],
		[-92, 49],
		[-95, 49],
		[-100, 49],
		[-105, 49],
		[-115, 49],
		[-120, 49],
		[-125, 50],
		[-130, 55],
		[-135, 58],
		[-140, 60],
		[-145, 62],
		[-150, 64],
		[-155, 68],
		[-160, 70],
		[-165, 70],
		[-170, 68],
		[-168, 65],
	]

	// South America
	const southAmerica = [
		[-80, 10],
		[-75, 10],
		[-70, 12],
		[-65, 10],
		[-60, 5],
		[-55, 5],
		[-50, 0],
		[-48, -2],
		[-45, -5],
		[-42, -8],
		[-38, -12],
		[-35, -8],
		[-38, -15],
		[-42, -22],
		[-45, -24],
		[-48, -26],
		[-52, -30],
		[-55, -35],
		[-58, -38],
		[-65, -42],
		[-68, -50],
		[-72, -52],
		[-75, -50],
		[-73, -45],
		[-72, -40],
		[-70, -35],
		[-70, -30],
		[-70, -25],
		[-70, -20],
		[-72, -15],
		[-78, -5],
		[-80, 0],
		[-80, 5],
		[-80, 10],
	]

	// Europe
	const europe = [
		[-10, 36],
		[-8, 38],
		[-9, 40],
		[-8, 42],
		[-5, 44],
		[-2, 44],
		[0, 43],
		[3, 43],
		[5, 44],
		[8, 45],
		[12, 45],
		[14, 42],
		[18, 40],
		[20, 40],
		[24, 38],
		[26, 40],
		[28, 42],
		[30, 44],
		[32, 46],
		[35, 48],
		[38, 50],
		[42, 55],
		[38, 60],
		[30, 62],
		[25, 65],
		[20, 68],
		[15, 70],
		[10, 70],
		[5, 62],
		[8, 58],
		[10, 55],
		[8, 52],
		[5, 52],
		[0, 50],
		[-5, 50],
		[-8, 48],
		[-10, 44],
		[-10, 40],
		[-10, 36],
	]

	// Africa
	const africa = [
		[-17, 15],
		[-15, 20],
		[-12, 25],
		[-8, 30],
		[-5, 35],
		[0, 36],
		[10, 37],
		[15, 32],
		[25, 32],
		[30, 30],
		[35, 28],
		[38, 22],
		[42, 15],
		[45, 12],
		[50, 10],
		[50, 5],
		[45, 0],
		[42, -5],
		[40, -12],
		[38, -18],
		[35, -22],
		[30, -28],
		[28, -32],
		[25, -34],
		[20, -35],
		[18, -32],
		[15, -28],
		[12, -18],
		[15, -10],
		[12, -5],
		[10, 0],
		[8, 5],
		[5, 5],
		[0, 5],
		[-5, 5],
		[-10, 8],
		[-15, 12],
		[-17, 15],
	]

	// Asia (mainland)
	const asia = [
		[26, 40],
		[30, 42],
		[35, 42],
		[40, 42],
		[45, 40],
		[50, 38],
		[55, 38],
		[60, 40],
		[65, 42],
		[70, 45],
		[75, 42],
		[80, 35],
		[85, 28],
		[88, 22],
		[92, 20],
		[98, 18],
		[100, 15],
		[102, 12],
		[105, 10],
		[108, 12],
		[110, 15],
		[115, 20],
		[118, 25],
		[120, 30],
		[125, 35],
		[130, 40],
		[135, 45],
		[140, 45],
		[145, 48],
		[150, 52],
		[155, 58],
		[160, 62],
		[170, 65],
		[180, 68],
		// Continue from -180 (wrap around)
	]

	// Asia continuation (Siberia wraps around)
	const asiaContinuation = [
		[-180, 68],
		[-175, 65],
		[-170, 62],
		[-168, 65],
	]

	// India subcontinent
	const india = [
		[68, 24],
		[72, 22],
		[75, 18],
		[78, 12],
		[80, 8],
		[82, 10],
		[85, 15],
		[88, 22],
		[90, 24],
		[92, 22],
		[88, 22],
		[85, 25],
		[80, 28],
		[75, 30],
		[72, 28],
		[68, 24],
	]

	// Southeast Asia / Indonesia (simplified)
	const seAsia = [
		[100, 5],
		[102, 2],
		[105, 0],
		[108, -2],
		[112, -5],
		[115, -8],
		[120, -8],
		[125, -5],
		[130, -3],
		[135, -5],
		[140, -6],
		[142, -8],
		[145, -6],
		[148, -8],
		[150, -10],
		[145, -15],
		[140, -12],
		[135, -8],
		[130, -5],
		[125, -8],
		[120, -10],
		[115, -8],
		[110, -6],
		[105, -5],
		[102, -3],
		[100, 0],
		[100, 5],
	]

	// Australia
	const australia = [
		[115, -22],
		[118, -20],
		[122, -18],
		[128, -15],
		[132, -12],
		[136, -12],
		[140, -15],
		[145, -15],
		[150, -18],
		[153, -22],
		[153, -28],
		[150, -32],
		[147, -38],
		[145, -40],
		[140, -38],
		[135, -35],
		[130, -32],
		[125, -32],
		[120, -30],
		[115, -28],
		[113, -25],
		[115, -22],
	]

	// Japan (simplified)
	const japan = [
		[130, 32],
		[132, 34],
		[135, 35],
		[138, 36],
		[140, 38],
		[142, 40],
		[144, 43],
		[145, 45],
		[143, 44],
		[140, 42],
		[138, 40],
		[135, 38],
		[132, 36],
		[130, 34],
		[130, 32],
	]

	// UK/Ireland
	const uk = [
		[-10, 52],
		[-8, 54],
		[-6, 55],
		[-4, 58],
		[-3, 59],
		[-2, 58],
		[0, 55],
		[2, 52],
		[0, 50],
		[-2, 50],
		[-5, 50],
		[-6, 52],
		[-8, 52],
		[-10, 52],
	]

	// Greenland
	const greenland = [
		[-45, 60],
		[-42, 62],
		[-38, 65],
		[-35, 70],
		[-30, 75],
		[-25, 78],
		[-20, 80],
		[-25, 82],
		[-35, 83],
		[-45, 82],
		[-55, 78],
		[-60, 72],
		[-55, 68],
		[-50, 64],
		[-45, 60],
	]

	// New Zealand (simplified)
	const newZealand = [
		[172, -35],
		[175, -37],
		[178, -40],
		[177, -42],
		[174, -45],
		[170, -46],
		[168, -44],
		[170, -42],
		[172, -40],
		[172, -35],
	]

	// Draw all continents
	drawContinentPath(ctx, northAmerica, width, height)
	drawContinentPath(ctx, southAmerica, width, height)
	drawContinentPath(ctx, europe, width, height)
	drawContinentPath(ctx, africa, width, height)
	drawContinentPath(ctx, asia, width, height, false) // Don't close - wraps
	drawContinentPath(ctx, asiaContinuation, width, height, false)
	drawContinentPath(ctx, india, width, height)
	drawContinentPath(ctx, seAsia, width, height)
	drawContinentPath(ctx, australia, width, height)
	drawContinentPath(ctx, japan, width, height)
	drawContinentPath(ctx, uk, width, height)
	drawContinentPath(ctx, greenland, width, height)
	drawContinentPath(ctx, newZealand, width, height)
}

// Draw a continent outline from coordinate array
function drawContinentPath(ctx, coords, width, height, closePath = true) {
	if (coords.length < 2) return

	ctx.beginPath()

	const start = latLonToCanvas(coords[0][1], coords[0][0], width, height)
	ctx.moveTo(start.x, start.y)

	for (let i = 1; i < coords.length; i++) {
		const point = latLonToCanvas(coords[i][1], coords[i][0], width, height)
		const prevPoint = latLonToCanvas(
			coords[i - 1][1],
			coords[i - 1][0],
			width,
			height
		)

		// Handle longitude wraparound
		if (Math.abs(point.x - prevPoint.x) > width / 2) {
			// Finish current subpath
			if (closePath) ctx.closePath()
			ctx.fill()
			ctx.stroke()

			// Start new subpath
			ctx.beginPath()
			ctx.moveTo(point.x, point.y)
		} else {
			ctx.lineTo(point.x, point.y)
		}
	}

	if (closePath) {
		ctx.closePath()
	}

	// 🔑 Fill first, then stroke
	ctx.fill()
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

// Satellites pending removal after decommission animation completes
const satellitesToRemove = []

// Animate satellites in their orbits and rotate the planet
// @param animateNormal - whether to animate normal (non-decommissioning) satellites
export function animateOrcScene(animateNormal = true) {
	if (!orcGroup) return

	// Rotate the planet like Earth (counter-clockwise when viewed from above)
	if (animateNormal && planet && planet.userData.rotationSpeed) {
		planet.rotation.y += planet.userData.rotationSpeed
	}

	satellites.forEach((sat) => {
		const data = sat.userData

		// Handle decommissioning satellites (always animate these)
		if (data.decommissioning) {
			const elapsed = Date.now() - data.decommissionStartTime
			const progress = Math.min(elapsed / data.decommissionDuration, 1)

			// Ease-in curve for acceleration effect
			const easeProgress = progress * progress

			// Calculate shrinking orbit radius (spiral inward)
			const radiusMultiplier = 1 - easeProgress * 0.9 // Shrink to 10% of original

			// Speed up as satellite falls inward (conservation of angular momentum effect)
			const speedMultiplier = 1 + easeProgress * 4

			// Pulse orbital ring color (black to red)
			if (data.orbitalRing) {
				const time = Date.now() * 0.003
				// Oscillate between 0 and 1
				const intensity = (Math.sin(time) + 1) / 2
				data.orbitalRing.material.color.setRGB(intensity, 0, 0)
			}

			// Apply de-orbit animation
			if (data.originalOrbitRadiusX) {
				// GEO satellite (elliptical)
				data.orbitRadiusX = data.originalOrbitRadiusX * radiusMultiplier
				data.orbitRadiusZ = data.originalOrbitRadiusZ * radiusMultiplier
				data.orbitSpeed = data.originalOrbitSpeed * speedMultiplier

				data.angle += data.orbitSpeed
				const x = Math.cos(data.angle) * data.orbitRadiusX
				const y = Math.sin(data.angle) * data.orbitRadiusZ
				sat.position.set(x, y, 0)
				sat.rotation.z = data.angle - Math.PI / 2
			} else {
				// LEO satellite (circular)
				data.orbitRadius = data.originalOrbitRadius * radiusMultiplier
				data.orbitSpeed = data.originalOrbitSpeed * speedMultiplier

				data.angle += data.orbitSpeed
				const x = Math.cos(data.angle) * data.orbitRadius
				const z = Math.sin(data.angle) * data.orbitRadius
				sat.position.set(x, 0, z)
				sat.rotation.y = -data.angle - Math.PI / 2
			}

			// Visual burn-up effect: scale down and change color as it enters atmosphere
			if (progress > 0.7) {
				const burnProgress = (progress - 0.7) / 0.3
				const scale = 1 - burnProgress * 0.8
				sat.scale.set(scale, scale, scale)

				// Make satellite glow orange/red as it burns
				sat.traverse((child) => {
					if (child.material && child.material.emissive) {
						child.material.emissive.setRGB(1, 0.3 * (1 - burnProgress), 0)
						child.material.emissiveIntensity = burnProgress * 2
					}
				})
			}

			// Satellite has completed de-orbit - mark for removal
			if (progress >= 1) {
				satellitesToRemove.push(sat)
			}
		} else if (animateNormal) {
			// Normal orbit animation (only when not paused)
			data.angle += data.orbitSpeed

			if (data.orbitRadiusX) {
				// GEO satellite - counter-clockwise
				const x = Math.cos(data.angle) * data.orbitRadiusX
				const y = Math.sin(data.angle) * data.orbitRadiusZ
				sat.position.set(x, y, 0)
				// Rotate satellite to face direction of travel
				sat.rotation.z = data.angle - Math.PI / 2
			} else {
				// LEO satellite - counter-clockwise
				const x = Math.cos(data.angle) * data.orbitRadius
				const z = Math.sin(data.angle) * data.orbitRadius
				sat.position.set(x, 0, z)
				// Rotate satellite to face direction of travel
				sat.rotation.y = -data.angle - Math.PI / 2
			}
		}
	})

	// Process satellites marked for removal
	while (satellitesToRemove.length > 0) {
		const sat = satellitesToRemove.pop()
		// Dispatch custom event for pyramid.js to handle UI cleanup
		window.dispatchEvent(
			new CustomEvent("satelliteDecommissioned", {
				detail: { satelliteId: sat.userData.id, satellite: sat },
			})
		)
	}
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

	// Mini planet with monochromatic Earth texture
	const miniCanvas = document.createElement("canvas")
	miniCanvas.width = 256
	miniCanvas.height = 128
	const miniCtx = miniCanvas.getContext("2d")
	miniCtx.fillStyle = "#000000"
	miniCtx.fillRect(0, 0, miniCanvas.width, miniCanvas.height)
	miniCtx.strokeStyle = "#ffffff"
	miniCtx.lineWidth = 1
	// Draw simplified continents for preview
	drawAccurateContinents(miniCtx, miniCanvas.width, miniCanvas.height)
	const miniTexture = new THREE.CanvasTexture(miniCanvas)
	miniTexture.wrapS = THREE.RepeatWrapping

	const miniPlanetGeo = new THREE.SphereGeometry(0.3, 32, 32)
	const miniPlanetMat = new THREE.MeshStandardMaterial({
		map: miniTexture,
		metalness: 0.1,
		roughness: 0.9,
		color: 0xffffff,
		emissive: new THREE.Color(0x111111),
		emissiveIntensity: 0.3,
	})
	const miniPlanet = new THREE.Mesh(miniPlanetGeo, miniPlanetMat)
	miniGroup.add(miniPlanet)

	// Mini atmosphere with blue glow
	const atmosGeo = new THREE.SphereGeometry(0.36, 32, 32)
	const atmosMat = new THREE.MeshBasicMaterial({
		color: 0x4488ff,
		transparent: true,
		opacity: 0.12,
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

// === Decommission Logic ===

// This function will be called from pyramid.js after the pane is created
export function initializeDecommissionButton(getSat, startDecom) {
	const decommissionBtn = document.getElementById("decommission-btn")
	if (decommissionBtn) {
		decommissionBtn.addEventListener("click", (e) => {
			e.stopPropagation()
			console.log("Gemini deco")
			const selectedSatellite = getSat()
			if (selectedSatellite && !selectedSatellite.userData.decommissioning) {
				startDecom(selectedSatellite)
			}
		})
	}
}

// === Decommission Logic ===

// Start the decommission process for a satellite
export function startDecommission(satellite) {
	if (!satellite || satellite.userData.decommissioning) {
		return
	}

	const data = satellite.userData

	// Store original orbit parameters for de-orbit calculation
	data.decommissioning = true
	data.decommissionStartTime = Date.now()
	data.decommissionDuration = 8000 // 8 seconds for full de-orbit

	// Store original radius values
	if (data.orbitRadiusX) {
		// GEO satellite (elliptical)
		data.originalOrbitRadiusX = data.orbitRadiusX
		data.originalOrbitRadiusZ = data.orbitRadiusZ
	} else {
		// LEO satellite (circular)
		data.originalOrbitRadius = data.orbitRadius
	}

	// Speed up the satellite as it de-orbits
	data.originalOrbitSpeed = data.orbitSpeed

	// Update UI
	updateSatelliteListItemState(satellite.userData.id, true)
}

// Update the satellite list item to show decommissioning state
function updateSatelliteListItemState(satelliteId, isDecommissioning) {
	const orcInfoPane = document.getElementById("orc-info-pane")
	if (!orcInfoPane) return
	const items = orcInfoPane.querySelectorAll(".satellite-list-item")
	items.forEach((item) => {
		if (item.dataset.satelliteId === satelliteId) {
			if (isDecommissioning) {
				item.classList.add("decommissioning")
				item.classList.remove("selected")
			} else {
				item.classList.remove("decommissioning")
			}
		}
	})
}

// Remove a satellite from the scene and UI after decommission
function removeSatelliteFromScene(satellite) {
	const satId = satellite.userData.id

	// Remove from satellites array
	const index = satellites.indexOf(satellite)
	if (index > -1) {
		satellites.splice(index, 1)
	}

	// Remove from scene
	if (satellite.parent) {
		satellite.parent.remove(satellite)
	}

	// Remove orbital ring if it exists
	if (satellite.userData.orbitalRing) {
		const ring = satellite.userData.orbitalRing
		// Remove from orbitalRings array
		const rIndex = orbitalRings.indexOf(ring)
		if (rIndex > -1) orbitalRings.splice(rIndex, 1)

		if (ring.parent) ring.parent.remove(ring)
		if (ring.geometry) ring.geometry.dispose()
		if (ring.material) ring.material.dispose()
	}

	// Dispose of geometry and materials
	satellite.traverse((child) => {
		if (child.geometry) child.geometry.dispose()
		if (child.material) {
			if (Array.isArray(child.material)) {
				child.material.forEach((m) => m.dispose())
			} else {
				child.material.dispose()
			}
		}
	})

	// Remove from the available satellites list in the UI
	const orcInfoPane = document.getElementById("orc-info-pane")
	if (orcInfoPane) {
		const listItem = orcInfoPane.querySelector(
			`.satellite-list-item[data-satellite-id="${satId}"]`
		)
		if (listItem) {
			listItem.remove()
		}

		// Check if list is empty
		const list = orcInfoPane.querySelector("#satellite-list")
		if (list && list.children.length === 0) {
			const emptyMsg = document.createElement("li")
			emptyMsg.textContent = "No satellites available"
			emptyMsg.style.cssText =
				"color: #888; font-style: italic; text-align: center; padding: 10px;"
			list.appendChild(emptyMsg)
		}
	}

	// If this was the selected satellite, deselect it
	// This requires access to the selection state, which should also be managed here.
	// For now, we'll dispatch an event to be handled in pyramid.js
	window.dispatchEvent(
		new CustomEvent("satelliteRemoved", {
			detail: { satelliteId: satId },
		})
	)
}

// Event handler for satellite decommission completion
function handleSatelliteDecommissioned(event) {
	const { satellite } = event.detail
	if (satellite) {
		removeSatelliteFromScene(satellite)
	}
}

// Listen for decommission events
window.addEventListener(
	"satelliteDecommissioned",
	handleSatelliteDecommissioned
)
