import * as THREE from "three"

// Showcase state (completely isolated from the main ORC demo)
let showcaseRenderer = null
let showcaseScene = null
let showcaseCamera = null
let showcaseContainer = null
let showcaseAnimId = null
let showcaseGroup = null
let showcaseSatellites = []
let showcaseHand = null
let handAnimationTime = 0
let isRunning = false

// Constants matching OrcScene.js
const PLANET_RADIUS = 0.5
const LEO_ORBIT_RADIUS = 0.65
const LEO_ORBIT_SPEED = 0.0045
const SATELLITE_SIZE = 0.08
const GEO_ALTITUDE = 2.0
const EXOSPHERE_RADIUS = 0.72

// Surface marker position (Charleston, SC)
const markerLatitude = 33
const markerLongitude = -80
const LONGITUDE_OFFSET = 88

/**
 * Creates an ORC scene showcase in the specified container element.
 * This renders a full-fidelity ORC scene (planet, satellites, orbits) at an angle
 * suitable for a horizontal banner display.
 *
 * This showcase is completely isolated from the main ORC demo to avoid conflicts.
 *
 * @param {HTMLElement} container - The DOM element to render into
 * @returns {Object} Controller with cleanup method
 */
export function createOrcShowcase(container) {
	if (!container) return null

	// Prevent duplicate initialization
	if (showcaseContainer === container && isRunning) {
		return { cleanup: cleanupOrcShowcase }
	}

	// Clean up any existing showcase first
	cleanupOrcShowcase()

	showcaseContainer = container
	isRunning = true

	const rect = container.getBoundingClientRect()
	const width = rect.width || container.clientWidth || 800
	const height = rect.height || container.clientHeight || 300

	// Create renderer
	showcaseRenderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true,
	})
	showcaseRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	showcaseRenderer.setSize(width, height)
	showcaseRenderer.outputColorSpace = THREE.SRGBColorSpace
	container.appendChild(showcaseRenderer.domElement)

	// Create scene
	showcaseScene = new THREE.Scene()

	// Add lighting
	showcaseScene.add(new THREE.AmbientLight(0xffffff, 0.5))
	const keyLight = new THREE.DirectionalLight(0xffffff, 0.8)
	keyLight.position.set(5, 5, 5)
	showcaseScene.add(keyLight)

	// Create camera with wide aspect ratio for horizontal banner
	const aspect = width / height
	showcaseCamera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100)

	// Position camera for a cinematic horizontal slice view
	// Looking down at an angle to show the planet and orbits nicely
	showcaseCamera.position.set(0.2, 0, 6.5)
	showcaseCamera.lookAt(0, 0, 2)

	// Create the ORC scene content (isolated, not using global state)
	showcaseGroup = createShowcaseOrcScene()
	showcaseScene.add(showcaseGroup)

	// Start animation
	animateShowcase()

	// Handle resize
	const resizeObserver = new ResizeObserver((entries) => {
		for (const entry of entries) {
			const { width: w, height: h } = entry.contentRect
			if (showcaseRenderer && showcaseCamera && w > 0 && h > 0) {
				showcaseCamera.aspect = w / h
				showcaseCamera.updateProjectionMatrix()
				showcaseRenderer.setSize(w, h)
			}
		}
	})
	resizeObserver.observe(container)

	// Store observer for cleanup
	showcaseContainer._resizeObserver = resizeObserver

	return {
		cleanup: cleanupOrcShowcase,
	}
}

/**
 * Creates an isolated ORC scene for the showcase (does not use global state)
 */
function createShowcaseOrcScene() {
	const group = new THREE.Group()
	group.name = "showcaseOrcScene"

	// Create planet
	const planet = createPlanet()
	group.add(planet)

	// LEO Satellite (Leona) - cyan
	const leoRing = createOrbitalRing(LEO_ORBIT_RADIUS, undefined, 0x00ffaa)
	leoRing.rotation.x = Math.PI / 2
	group.add(leoRing)

	const leoSatellite = createSatellite(0x00ffaa)
	leoSatellite.userData = {
		orbitRadius: LEO_ORBIT_RADIUS,
		orbitSpeed: LEO_ORBIT_SPEED,
		angle: Math.PI,
	}
	showcaseSatellites.push(leoSatellite)
	group.add(leoSatellite)

	// Geosynchronous Satellite (George) - magenta
	const geoPos = latLonTo3D(markerLatitude, markerLongitude, GEO_ALTITUDE)
	const geoSatellite = createSatellite(0xff00ff)
	geoSatellite.position.set(geoPos.x, geoPos.y, geoPos.z)
	geoSatellite.lookAt(0, 0, 0)
	geoSatellite.rotateX(Math.PI / 2)
	geoSatellite.userData = { isGeosynchronous: true }
	planet.add(geoSatellite)

	const geoRing = createGeoRing(
		markerLatitude,
		markerLongitude,
		GEO_ALTITUDE,
		0xff00ff
	)
	planet.add(geoRing)

	// Molniya Satellite (Moltar) - orange
	const molOrbitGroup = new THREE.Group()
	const molSemiMajor = 2.3
	const molEccentricity = 0.72
	const molSemiMinor = molSemiMajor * Math.sqrt(1 - molEccentricity ** 2)
	const molLinearEccentricity = molSemiMajor * molEccentricity

	const molRing = createOrbitalRing(molSemiMajor, molSemiMinor, 0xffaa00)
	molRing.position.x = -molLinearEccentricity

	const molSatellite = createSatellite(0xffaa00)
	molSatellite.userData = {
		semiMajorAxis: molSemiMajor,
		eccentricity: molEccentricity,
		orbitSpeed: 0.006,
		angle: 0,
	}
	molOrbitGroup.add(molRing)
	molOrbitGroup.add(molSatellite)
	molOrbitGroup.rotation.x = -Math.PI / 2.4
	molOrbitGroup.rotation.y = Math.PI / 0.084
	molOrbitGroup.rotation.z = Math.PI / 3.8
	showcaseSatellites.push(molSatellite)
	group.add(molOrbitGroup)

	// Store planet reference for rotation animation
	group.userData.planet = planet

	return group
}

function animateShowcase() {
	if (!isRunning) return

	showcaseAnimId = requestAnimationFrame(animateShowcase)

	// Rotate planet
	if (showcaseGroup && showcaseGroup.userData.planet) {
		showcaseGroup.userData.planet.rotation.y += 0.001
	}

	// Animate satellites
	showcaseSatellites.forEach((sat) => {
		const data = sat.userData
		if (data.isGeosynchronous) return

		if (data.eccentricity) {
			// Molniya orbit (elliptical)
			const r =
				(data.semiMajorAxis * (1 - data.eccentricity ** 2)) /
				(1 + data.eccentricity * Math.cos(data.angle))
			const speed = data.orbitSpeed * (1.5 / (r * r))
			data.angle += speed
			const x = Math.cos(data.angle) * r
			const y = Math.sin(data.angle) * r
			sat.position.set(x, y, 0)
			sat.rotation.z = data.angle + Math.PI / 2
		} else {
			// Circular orbit (LEO)
			data.angle += data.orbitSpeed
			const x = Math.cos(data.angle) * data.orbitRadius
			const z = Math.sin(data.angle) * data.orbitRadius
			sat.position.set(x, 0, z)
			sat.rotation.y = -data.angle - Math.PI / 2
		}
	})

	// Render
	if (showcaseRenderer && showcaseScene && showcaseCamera) {
		showcaseRenderer.render(showcaseScene, showcaseCamera)
	}
}

/**
 * Cleans up the ORC showcase, disposing of all Three.js resources.
 */
export function cleanupOrcShowcase() {
	isRunning = false

	if (showcaseAnimId) {
		cancelAnimationFrame(showcaseAnimId)
		showcaseAnimId = null
	}

	// Disconnect resize observer
	if (showcaseContainer && showcaseContainer._resizeObserver) {
		showcaseContainer._resizeObserver.disconnect()
		delete showcaseContainer._resizeObserver
	}

	// Dispose scene objects
	if (showcaseGroup) {
		showcaseGroup.traverse((child) => {
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

	// Dispose renderer
	if (showcaseRenderer) {
		if (showcaseRenderer.domElement && showcaseRenderer.domElement.parentNode) {
			showcaseRenderer.domElement.parentNode.removeChild(
				showcaseRenderer.domElement
			)
		}
		showcaseRenderer.dispose()
		showcaseRenderer = null
	}

	showcaseScene = null
	showcaseCamera = null
	showcaseGroup = null
	showcaseSatellites = []
	showcaseContainer = null
}

/**
 * Check if the showcase is currently running
 */
export function isShowcaseActive() {
	return isRunning
}

// === Helper Functions (copied from OrcScene.js to keep isolation) ===

function latLonTo3D(lat, lon, radius = PLANET_RADIUS) {
	const latRad = (lat * Math.PI) / 180
	const lonRad = ((lon + LONGITUDE_OFFSET) * Math.PI) / 180
	const x = radius * Math.cos(latRad) * Math.sin(lonRad)
	const y = radius * Math.sin(latRad)
	const z = radius * Math.cos(latRad) * Math.cos(lonRad)
	return { x, y, z }
}

function createPlanet() {
	const geometry = new THREE.SphereGeometry(PLANET_RADIUS, 64, 64)
	const canvas = document.createElement("canvas")
	canvas.width = 1024
	canvas.height = 512
	const ctx = canvas.getContext("2d")
	ctx.fillStyle = "#0c177aff"
	ctx.fillRect(0, 0, canvas.width, canvas.height)
	ctx.fillStyle = "#EAE9BD"
	ctx.strokeStyle = "#EAE9BD"
	ctx.lineWidth = 1.5
	ctx.lineCap = "round"
	ctx.lineJoin = "round"
	drawAccurateContinents(ctx, canvas.width, canvas.height)

	const texture = new THREE.CanvasTexture(canvas)
	texture.wrapS = THREE.RepeatWrapping
	texture.wrapT = THREE.ClampToEdgeWrapping
	texture.anisotropy = 16
	texture.needsUpdate = true

	const material = new THREE.MeshBasicMaterial({ map: texture })
	const sphere = new THREE.Mesh(geometry, material)
	sphere.name = "planet"

	// Add atmosphere glow
	const atmosphereGeometry = new THREE.SphereGeometry(
		PLANET_RADIUS * 1.1,
		64,
		64
	)
	const atmosphereMaterial = new THREE.ShaderMaterial({
		uniforms: {
			glowColor: { value: new THREE.Color(0x4488ff) },
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
				gl_FragColor = vec4(glowColor, intensity * 0.3);
			}
		`,
		side: THREE.BackSide,
		blending: THREE.AdditiveBlending,
		transparent: true,
		depthWrite: false,
	})
	sphere.add(new THREE.Mesh(atmosphereGeometry, atmosphereMaterial))

	// Outer glow
	const outerAtmosphereGeometry = new THREE.SphereGeometry(
		PLANET_RADIUS * 1.4,
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
				float intensity = pow(0.99 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
				gl_FragColor = vec4(glowColor, intensity * 0.15);
			}
		`,
		side: THREE.BackSide,
		blending: THREE.AdditiveBlending,
		transparent: true,
		depthWrite: false,
	})
	sphere.add(new THREE.Mesh(outerAtmosphereGeometry, outerAtmosphereMaterial))

	return sphere
}

function createSatellite(color) {
	const group = new THREE.Group()
	const body = new THREE.Mesh(
		new THREE.BoxGeometry(
			SATELLITE_SIZE,
			SATELLITE_SIZE * 0.5,
			SATELLITE_SIZE * 0.5
		),
		new THREE.MeshStandardMaterial({
			color: 0x888888,
			metalness: 0.8,
			roughness: 0.2,
		})
	)
	group.add(body)

	const panelGeo = new THREE.BoxGeometry(
		SATELLITE_SIZE * 0.1,
		SATELLITE_SIZE * 1.5,
		SATELLITE_SIZE * 0.02
	)
	const panelMat = new THREE.MeshStandardMaterial({
		color: color,
		metalness: 0.3,
		roughness: 0.5,
		emissive: new THREE.Color(color),
		emissiveIntensity: 0.3,
	})
	const leftPanel = new THREE.Mesh(panelGeo, panelMat)
	leftPanel.position.set(-SATELLITE_SIZE * 0.6, 0, 0)
	group.add(leftPanel)
	const rightPanel = new THREE.Mesh(panelGeo, panelMat)
	rightPanel.position.set(SATELLITE_SIZE * 0.6, 0, 0)
	group.add(rightPanel)

	group.name = "satellite"
	return group
}

function createOrbitalRing(xRadius, zRadius, color) {
	let ring
	if (zRadius === undefined) {
		const geometry = new THREE.TorusGeometry(xRadius, 0.01, 8, 128)
		const material = new THREE.MeshBasicMaterial({
			color: color,
			transparent: true,
			opacity: 0.5,
		})
		ring = new THREE.Mesh(geometry, material)
	} else {
		const curve = new THREE.EllipseCurve(
			0,
			0,
			xRadius,
			zRadius,
			0,
			2 * Math.PI,
			false,
			0
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
	return ring
}

function createGeoRing(latitude, longitude, altitude, color) {
	const segments = 128
	const points = []
	const peakPos = latLonTo3D(latitude, longitude, altitude)
	const peak = new THREE.Vector3(peakPos.x, peakPos.y, peakPos.z)
	const u = peak.clone().normalize()
	const v = new THREE.Vector3(-u.z, 0, u.x).normalize()

	for (let i = 0; i <= segments; i++) {
		const angle = (i / segments) * 2 * Math.PI
		const point = new THREE.Vector3()
			.addScaledVector(u, Math.cos(angle) * altitude)
			.addScaledVector(v, Math.sin(angle) * altitude)
		points.push(point)
	}
	const geometry = new THREE.BufferGeometry().setFromPoints(points)
	const material = new THREE.LineBasicMaterial({
		color: color,
		transparent: true,
		opacity: 0.5,
	})
	return new THREE.LineLoop(geometry, material)
}

// Continent drawing helpers (simplified for the showcase)
function latLonToCanvas(lat, lon, width, height) {
	const x = ((lon + 180) / 360) * width
	const y = ((90 - lat) / 180) * height
	return { x, y }
}

function drawContinentPath(
	ctx,
	coords,
	width,
	height,
	closePath = true,
	fillColor = "#5A5840"
) {
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

		if (Math.abs(point.x - prevPoint.x) > width / 2) {
			if (closePath) ctx.closePath()
			ctx.fillStyle = fillColor
			ctx.strokeStyle = fillColor
			ctx.fill()
			ctx.stroke()
			ctx.beginPath()
			ctx.moveTo(point.x, point.y)
		} else {
			ctx.lineTo(point.x, point.y)
		}
	}

	if (closePath) ctx.closePath()
	ctx.fillStyle = fillColor
	ctx.strokeStyle = fillColor
	ctx.fill()
	ctx.stroke()
}

function drawAccurateContinents(ctx, width, height) {
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

	// Asia (simplified)
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

	drawContinentPath(ctx, northAmerica, width, height)
	drawContinentPath(ctx, southAmerica, width, height)
	drawContinentPath(ctx, europe, width, height)
	drawContinentPath(ctx, africa, width, height)
	drawContinentPath(ctx, asia, width, height, false)
	drawContinentPath(ctx, australia, width, height)
}
