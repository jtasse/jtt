import * as THREE from "three"
import {
	createOrcHand,
	HandStateMachine,
	HandState,
	calculateIrregularOrbitPosition,
} from "./orc-hand.js"

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

// Surface marker elements
export let surfaceMarker = null
export let surfaceCircle = null
export let geoTether = null // Line from George to surface point

// Hand of ORC
export let orcHand = null
export let orcHandStateMachine = null

// Surface marker position (editable lat/lon in degrees)
// Latitude: -90 (south pole) to +90 (north pole)
// Longitude: -180 to +180 (0 = prime meridian)
export let markerLatitude = 33 // Charleston, SC (33° N)
export let markerLongitude = -80 // Charleston, SC (80° W)
export const MARKER_CIRCLE_RADIUS_DEG = 15 // Circle radius in degrees

// Longitude offset to align internal coordinates with real Earth lat/lon
// Internal system has lon=8 at Charleston, real Charleston is lon=-80
// So: internal_lon = real_lon + 88
const LONGITUDE_OFFSET = 88

// Constants
const PLANET_RADIUS = 0.5 // Planet's size
const LEO_ORBIT_RADIUS = 0.65 // Inner circular orbit
const LEO_ORBIT_SPEED = 0.0045 // Counter-clockwise
const SATELLITE_SIZE = 0.08
const GEO_ALTITUDE = 2.0 // Geosynchronous orbit altitude (radius from planet center)

// Atmosphere boundaries for decommission effects
// Exosphere should just envelop Leona's orbit (LEO at 0.65)
const EXOSPHERE_RADIUS = 0.72 // Just outside LEO orbit - where burning starts
const OUTER_ATMOSPHERE_RADIUS = PLANET_RADIUS * 1.25 // 0.625 - visible atmosphere layer
const INNER_ATMOSPHERE_RADIUS = PLANET_RADIUS * 1.08 // 0.54 - where satellite is destroyed

// Decommission animation configuration
const DECOMMISSION_CONFIG = {
	approachDurationBase: 6000, // Base time to reach exosphere (ms) - scales with orbit radius
	approachDurationPerUnit: 3000, // Additional ms per unit of orbit radius above exosphere
	burnDuration: 5000, // Time from exosphere entry to destruction (ms) - configurable
	slowMotionFactor: 0.3, // How much to slow down during burn phase (30% speed)
	cameraZoomDistanceFar: 3.0, // Camera distance during approach
	cameraZoomDistanceClose: 0.8, // Camera distance during burn (close-up)
	cameraApproachSpeed: 0.012, // Slow zoom during approach (slightly faster for smoothness)
	cameraQuickZoomSpeed: 0.04, // Quick zoom when entering exosphere (reduced for smoothness)
	cameraResetSpeed: 0.03, // Speed to return camera after destruction
}

// Decommission state tracking (for camera coordination with pyramid.js)
let activeDecommission = null // The satellite currently decommissioning

// Get the current decommission state for camera tracking
export function getDecommissionState() {
	if (!activeDecommission) return null

	const sat = activeDecommission
	const data = sat.userData
	if (!data.decommissioning) return null

	// Smooth ease function for camera transitions
	const smoothEase = (t) =>
		t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

	// Get tracking position - ALWAYS track the hand during decommission
	let trackingPosition = new THREE.Vector3()
	let phase = "approach"
	let burnProgress = 0
	let inBurnPhase = false

	if (orcHandStateMachine && orcHand) {
		const handState = orcHandStateMachine.state

		// Always track the hand position during decommission
		orcHand.getWorldPosition(trackingPosition)

		// Determine phase based on hand state
		switch (handState) {
			case HandState.POINTING:
			case HandState.APPROACHING:
				phase = "approach"
				break

			case HandState.GRABBING:
			case HandState.CARRYING:
			case HandState.RELEASING:
			case HandState.WINDING_UP:
				phase = "carrying"
				break

			case HandState.SLAPPING:
			case HandState.CELEBRATING:
				phase = "burning"
				inBurnPhase = true

				// Calculate burn progress
				if (sat.userData.burnStartTime) {
					const burnElapsed = performance.now() - sat.userData.burnStartTime
					burnProgress = Math.min(burnElapsed / 3000, 1)
				}
				break

			default:
				// Still track hand even in other states
				break
		}
	} else {
		// Fallback to satellite if no hand available
		sat.getWorldPosition(trackingPosition)
	}

	const distance = trackingPosition.length()

	// Camera parameters based on phase
	let cameraSpeed = DECOMMISSION_CONFIG.cameraApproachSpeed
	let targetZoomDistance = DECOMMISSION_CONFIG.cameraZoomDistanceFar

	if (inBurnPhase) {
		cameraSpeed = DECOMMISSION_CONFIG.cameraQuickZoomSpeed
		const easedBurn = smoothEase(Math.min(burnProgress * 2, 1))
		targetZoomDistance =
			DECOMMISSION_CONFIG.cameraZoomDistanceFar -
			easedBurn *
				(DECOMMISSION_CONFIG.cameraZoomDistanceFar -
					DECOMMISSION_CONFIG.cameraZoomDistanceClose)
	}

	return {
		satellite: sat,
		position: trackingPosition,
		distance,
		phase,
		burnProgress,
		inBurnPhase,
		cameraSpeed,
		targetZoomDistance,
		config: DECOMMISSION_CONFIG,
		handState: orcHandStateMachine?.state,
		hand: orcHand,
	}
}

// Export config for external use
export function getDecommissionConfig() {
	return DECOMMISSION_CONFIG
}

// Convert latitude/longitude (degrees) to 3D world coordinates on the planet surface
// Returns { x, y, z } in world space (before planet rotation)
export function latLonTo3D(lat, lon, radius = PLANET_RADIUS) {
	const latRad = (lat * Math.PI) / 180
	// Apply longitude offset to convert from real Earth coordinates
	const lonRad = ((lon + LONGITUDE_OFFSET) * Math.PI) / 180
	// Y is up (north pole), XZ is equatorial plane
	// Longitude 0 points toward +Z, +90 points toward +X
	const x = radius * Math.cos(latRad) * Math.sin(lonRad)
	const y = radius * Math.sin(latRad)
	const z = radius * Math.cos(latRad) * Math.cos(lonRad)
	return { x, y, z }
}

// Create a point marker on the planet surface
function createSurfaceMarker() {
	const markerRadius = 0.02
	const geometry = new THREE.SphereGeometry(markerRadius, 16, 16)
	const material = new THREE.MeshBasicMaterial({
		color: 0xff00ff, // Magenta
		transparent: true,
		opacity: 0.9,
	})
	surfaceMarker = new THREE.Mesh(geometry, material)
	surfaceMarker.name = "surfaceMarker"
	return surfaceMarker
}

// Create a circle on the planet surface around the marker
function createSurfaceCircle() {
	const segments = 64
	const points = []

	// Calculate circle points at angular distance from center
	for (let i = 0; i <= segments; i++) {
		const bearing = (i / segments) * 2 * Math.PI

		// Calculate point at MARKER_CIRCLE_RADIUS_DEG degrees from center
		// Using spherical geometry: given center (lat1, lon1) and bearing, find point at angular distance
		const lat1 = (markerLatitude * Math.PI) / 180
		const lon1 = (markerLongitude * Math.PI) / 180
		const angularDistance = (MARKER_CIRCLE_RADIUS_DEG * Math.PI) / 180

		// Spherical law of cosines
		const lat2 = Math.asin(
			Math.sin(lat1) * Math.cos(angularDistance) +
				Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearing)
		)
		const lon2 =
			lon1 +
			Math.atan2(
				Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(lat1),
				Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2)
			)

		// Convert to 3D with slight offset above surface
		const pos = latLonTo3D(
			(lat2 * 180) / Math.PI,
			(lon2 * 180) / Math.PI,
			PLANET_RADIUS * 1.005
		)
		points.push(new THREE.Vector3(pos.x, pos.y, pos.z))
	}

	const geometry = new THREE.BufferGeometry().setFromPoints(points)
	const material = new THREE.LineBasicMaterial({
		color: 0xff00ff, // Magenta
		transparent: true,
		opacity: 0.8,
		linewidth: 2,
	})
	surfaceCircle = new THREE.LineLoop(geometry, material)
	surfaceCircle.name = "surfaceCircle"
	return surfaceCircle
}

// Create a proper geosynchronous orbital ring - a great circle around the planet center
// The ring passes through George's exact position and orbits the planet center
function createGeoRing(latitude, longitude, altitude, color) {
	const segments = 128
	const points = []

	// Get George's position (the peak of the orbit)
	const peakPos = latLonTo3D(latitude, longitude, altitude)
	const peak = new THREE.Vector3(peakPos.x, peakPos.y, peakPos.z)

	// Unit vector toward George (peak of orbit)
	const u = peak.clone().normalize()

	// Vector perpendicular to u and horizontal (in XZ plane)
	// This is the orbit direction at the peak
	// v = normalize(Y × u) = normalize((-uz, 0, ux))
	const v = new THREE.Vector3(-u.z, 0, u.x).normalize()

	// Generate points on the orbit: P(θ) = altitude * (cos(θ) * u + sin(θ) * v)
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
	const ring = new THREE.LineLoop(geometry, material)
	ring.name = "geoRing"
	return ring
}

// Create the tether line between George and the surface point
function createGeoTether() {
	const surfacePos = latLonTo3D(
		markerLatitude,
		markerLongitude,
		PLANET_RADIUS * 1.01
	)
	const geoPos = latLonTo3D(markerLatitude, markerLongitude, GEO_ALTITUDE)

	const points = [
		new THREE.Vector3(surfacePos.x, surfacePos.y, surfacePos.z),
		new THREE.Vector3(geoPos.x, geoPos.y, geoPos.z),
	]

	const geometry = new THREE.BufferGeometry().setFromPoints(points)
	const material = new THREE.LineDashedMaterial({
		color: 0xff00ff, // Magenta
		transparent: true,
		opacity: 0.8,
		dashSize: 0.05,
		gapSize: 0.03,
	})

	const line = new THREE.Line(geometry, material)
	line.computeLineDistances() // Required for dashed lines
	line.name = "geoTether"
	return line
}

// Show the tether line (call when George is selected)
export function showGeoTether() {
	if (geoTether) {
		geoTether.visible = true
	}
}

// Hide the tether line (call when George is deselected)
export function hideGeoTether() {
	if (geoTether) {
		geoTether.visible = false
	}
}

// Update the marker and circle positions based on current lat/lon
export function updateMarkerPosition(lat, lon) {
	markerLatitude = lat
	markerLongitude = lon

	if (surfaceMarker) {
		const pos = latLonTo3D(
			markerLatitude,
			markerLongitude,
			PLANET_RADIUS * 1.01
		)
		surfaceMarker.position.set(pos.x, pos.y, pos.z)
	}

	if (surfaceCircle && planet) {
		// Recreate circle geometry at new position
		planet.remove(surfaceCircle)
		surfaceCircle.geometry.dispose()
		surfaceCircle = createSurfaceCircle()
		planet.add(surfaceCircle)
	}
}

// Create the ORC scene group
export function createOrcScene(camera) {
	orcGroup = new THREE.Group()
	orcGroup.name = "orcScene"

	// Create Earth-like sphere (monochromatic)
	planet = createPlanet()
	orcGroup.add(planet)

	// Create geosynchronous satellite (George) - always above the marker point
	// George is added to the planet so it rotates with it
	const geoSatellite = createSatellite(0xff00ff) // Magenta
	const geoPos = latLonTo3D(markerLatitude, markerLongitude, GEO_ALTITUDE)
	geoSatellite.position.set(geoPos.x, geoPos.y, geoPos.z)
	// Orient satellite to face the planet (nadir pointing)
	geoSatellite.lookAt(0, 0, 0)
	geoSatellite.rotateX(Math.PI / 2)

	// Create orbital ring at the geosynchronous altitude, tilted to marker's latitude
	const geoRing = createGeoRing(
		markerLatitude,
		markerLongitude,
		GEO_ALTITUDE,
		0xff00ff
	)

	geoSatellite.userData = {
		name: "George",
		id: "geo-001",
		orbitIndex: 1,
		isGeosynchronous: true, // Flag for special handling
		orbitalRing: geoRing,
		originalOrbitColor: 0xff00ff, // Magenta - store for cancel decommission
	}

	// Add George to the planet so it rotates with the planet
	planet.add(geoSatellite)
	planet.add(geoRing) // Ring rotates with planet, keeping George on the ring
	orbitalRings.push(geoRing)
	satellites.push(geoSatellite)

	// Create tether line (initially hidden)
	geoTether = createGeoTether()
	geoTether.visible = false
	planet.add(geoTether)

	// Create LEO satellite and its ring (flat on XZ plane)
	const leoRing = createOrbitalRing(LEO_ORBIT_RADIUS, undefined, 0x00ffaa)
	leoRing.rotation.x = Math.PI / 2 // Place LEO orbit on the XZ plane
	orcGroup.add(leoRing)
	orbitalRings.push(leoRing)

	const leoSatellite = createSatellite(0x00ffaa) // Cyan
	leoSatellite.userData = {
		name: "Leona",
		id: "leo-001",
		orbitIndex: 0,
		orbitRadius: LEO_ORBIT_RADIUS,
		orbitSpeed: LEO_ORBIT_SPEED,
		angle: Math.PI, // Start on opposite side
		orbitalRing: leoRing,
		originalOrbitColor: 0x00ffaa, // Cyan - store for cancel decommission
	}
	satellites.push(leoSatellite)
	orcGroup.add(leoSatellite)

	// Create Molniya satellite (Molniya Orbit) - Orange
	// Molniya orbits are highly elliptical with high inclination (~63.4 degrees)
	const molOrbitGroup = new THREE.Group()

	// Keplerian parameters for Molniya orbit
	const molSemiMajor = 2.3 // a (Elongated)
	const molEccentricity = 0.72 // e (0 = circle, < 1 = ellipse)
	const molSemiMinor = molSemiMajor * Math.sqrt(1 - molEccentricity ** 2) // b
	const molLinearEccentricity = molSemiMajor * molEccentricity // c (distance from center to focus)

	const molRing = createOrbitalRing(molSemiMajor, molSemiMinor, 0xffaa00)
	// Shift the ring so that the focus (Earth at 0,0) is correct
	// The ellipse center must be offset by -c
	molRing.position.x = -molLinearEccentricity

	const molSatellite = createSatellite(0xffaa00) // Orange
	molSatellite.userData = {
		name: "Moltar",
		id: "mol-001",
		orbitIndex: 2,
		semiMajorAxis: molSemiMajor,
		eccentricity: molEccentricity,
		orbitSpeed: 0.006, // Base speed factor (will be modulated by distance)
		angle: 0, // True anomaly (0 = perigee)
		orbitalRing: molRing,
		originalOrbitColor: 0xffaa00, // Orange - store for cancel decommission
	}
	molOrbitGroup.add(molRing)
	molOrbitGroup.add(molSatellite)
	// Pitch upward (X rotation) and tilt slightly (Z rotation) to avoid occlusion
	// Orient apogee (local -X) to lower-left (World -X, +Z) relative to camera
	molOrbitGroup.rotation.x = -Math.PI / 2.4 // Inclination
	molOrbitGroup.rotation.y = Math.PI / 0.084 // Rotate azimuth to point apogee South-West
	molOrbitGroup.rotation.z = Math.PI / 3.8 // Tilt
	orcGroup.add(molOrbitGroup)
	orbitalRings.push(molRing)
	satellites.push(molSatellite)

	// Create surface marker and circle on the planet
	const marker = createSurfaceMarker()
	const markerPos = latLonTo3D(
		markerLatitude,
		markerLongitude,
		PLANET_RADIUS * 1.01
	)
	marker.position.set(markerPos.x, markerPos.y, markerPos.z)
	planet.add(marker)

	const circle = createSurfaceCircle()
	planet.add(circle)

	// Create Hand of ORC
	orcHand = createOrcHand(5) // 5x satellite size
	const initialHandPos = calculateIrregularOrbitPosition(performance.now())
	orcHand.position.copy(initialHandPos)
	orcGroup.add(orcHand)

	// Initialize hand state machine
	orcHandStateMachine = new HandStateMachine(
		orcHand,
		orcGroup,
		satellites,
		camera
	)

	// Set up callbacks for hand state machine
	orcHandStateMachine.onSatelliteBurn = (satellite) => {
		// Create flame trail when hand slaps satellite
		if (!satellite.userData.flameParticles) {
			satellite.userData.flameParticles = createFlameTrail(satellite)
		}
		satellite.userData.handSlapped = true
		satellite.userData.burnStartTime = performance.now()
	}

	orcHandStateMachine.onSatelliteDestroyed = (satellite) => {
		// Clean up and remove satellite
		disposeFlameTrail(satellite)
		removeSatelliteFromScene(satellite)
	}

	orcHandStateMachine.onSlowMotionStart = () => {
		// Slow down normal satellite animations during slap
		// This is handled by the hand state machine internally
	}

	orcHandStateMachine.onSlowMotionEnd = () => {
		// Resume normal speed
	}

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

	// Fill background with ocean color (blue)
	ctx.fillStyle = "#0c177aff"
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	// Draw continents
	ctx.fillStyle = "#EAE9BD"
	ctx.strokeStyle = "#EAE9BD"
	ctx.lineWidth = 1.5
	ctx.lineCap = "round"
	ctx.lineJoin = "round"
	drawAccurateContinents(ctx, canvas.width, canvas.height)

	const texture = new THREE.CanvasTexture(canvas)
	// No colorSpace - use default
	texture.wrapS = THREE.RepeatWrapping
	texture.wrapT = THREE.ClampToEdgeWrapping
	texture.anisotropy = 16
	texture.needsUpdate = true

	const material = new THREE.MeshBasicMaterial({
		map: texture,
	})

	const sphere = new THREE.Mesh(geometry, material)
	sphere.name = "planet"
	// Store initial rotation for animation
	sphere.userData.rotationSpeed = 0.001 // Earth-like rotation speed

	// Add inner atmosphere glow (subtle rim light effect)
	const innerAtmosphereGeometry = new THREE.SphereGeometry(
		PLANET_RADIUS * 1.1,
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
				gl_FragColor = vec4(glowColor, intensity * 0.3);
			}
		`,
		side: THREE.BackSide,
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
	const outerAtmosphere = new THREE.Mesh(
		outerAtmosphereGeometry,
		outerAtmosphereMaterial
	)
	sphere.add(outerAtmosphere)

	// Add exosphere (faint extended atmosphere) - should just envelop Leona's orbit
	const exosphereGeometry = new THREE.SphereGeometry(
		EXOSPHERE_RADIUS, // Use the decommission boundary constant
		32,
		32
	)
	const exosphereMaterial = new THREE.ShaderMaterial({
		uniforms: {
			glowColor: { value: new THREE.Color(0x2255aa) }, // Slightly brighter to be visible at smaller size
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
				float intensity = pow(max(0.0, 0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
				gl_FragColor = vec4(glowColor, intensity * 0.15);
			}
		`,
		side: THREE.BackSide,
		blending: THREE.AdditiveBlending,
		transparent: true,
		depthWrite: false,
	})
	const exosphere = new THREE.Mesh(exosphereGeometry, exosphereMaterial)
	sphere.add(exosphere)

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
// Using a color that appears as beige after atmosphere effects
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

		// Handle longitude wraparound
		if (Math.abs(point.x - prevPoint.x) > width / 2) {
			// Finish current subpath
			if (closePath) ctx.closePath()
			ctx.fillStyle = fillColor
			ctx.strokeStyle = fillColor
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

	// 🔑 Fill first, then stroke - set color immediately before
	ctx.fillStyle = fillColor
	ctx.strokeStyle = fillColor
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

	// Update Hand of ORC
	if (orcHandStateMachine) {
		orcHandStateMachine.update()
	}

	satellites.forEach((sat) => {
		const data = sat.userData

		// 1. Handle Crash Physics (Hand Slap) - Overrides all other logic
		if (data.handSlapped) {
			// Check if satellite is still active (not destroyed)
			if (sat.parent) {
				const burnElapsed = performance.now() - data.burnStartTime
				const burnDuration = 4000 // Match extended duration in hand config
				const burnProgress = Math.min(burnElapsed / burnDuration, 1)

				// Update flame trail
				const worldPos = new THREE.Vector3()
				sat.getWorldPosition(worldPos)
				const orbitDir = worldPos.clone().normalize().negate()
				updateFlameTrail(sat, burnProgress, orbitDir, worldPos.length())

				// Scale down and fizzle
				const scale = 1 - burnProgress * 0.85
				sat.scale.set(scale, scale, scale)

				if (burnProgress > 0.8) {
					const fizzleProgress = (burnProgress - 0.8) / 0.2
					sat.visible = Math.random() > fizzleProgress * 0.5
				}

				// Move satellite toward Earth during burn
				const earthDir = worldPos.clone().normalize().negate()
				// Safety check for NaN
				if (isNaN(earthDir.x)) earthDir.set(0, -1, 0)

				if (sat.parent) {
					const parentWorldQuat = new THREE.Quaternion()
					sat.parent.getWorldQuaternion(parentWorldQuat)
					earthDir.applyQuaternion(parentWorldQuat.invert())
				}

				// Apply time scaling from hand state machine for slow motion effect
				const timeScale = orcHandStateMachine
					? orcHandStateMachine.timeScale
					: 1.0
				const speed = 0.12 * timeScale
				sat.position.add(earthDir.multiplyScalar(speed))
				sat.rotation.x += 0.2 // Tumble
				sat.rotation.z += 0.1

				// Check for impact with Earth surface
				if (worldPos.length() < PLANET_RADIUS + 0.05) {
					sat.visible = false
					if (orcHandStateMachine) orcHandStateMachine.timeScale = 1.0 // Reset to normal speed on impact
				}
			}
			return // Skip normal orbit logic
		}

		// Helper to calculate position for Keplerian orbits (MEO)
		const updateKeplerianPosition = (angle, semiMajor, eccentricity) => {
			// Calculate radius r based on true anomaly (angle)
			// r = a(1-e^2) / (1 + e*cos(theta))
			const r =
				(semiMajor * (1 - eccentricity ** 2)) /
				(1 + eccentricity * Math.cos(angle))

			// Position relative to focus (Earth at 0,0)
			// Perigee is at angle 0 (positive X axis in local space)
			const x = Math.cos(angle) * r
			const y = Math.sin(angle) * r
			return { x, y, r }
		}

		// Apply global time scaling (for slow motion effects)
		const timeScale = orcHandStateMachine ? orcHandStateMachine.timeScale : 1.0

		// Skip geosynchronous satellites - they move with the planet
		// (but not if decommissioning or returning from cancelled decommission)
		if (data.isGeosynchronous && !data.decommissioning && !data.returning) {
			return // George rotates with planet, no animation needed
		}

		// Handle decommissioning satellites (always animate these)
		if (data.decommissioning) {
			// Get current distance from planet center
			const worldPos = new THREE.Vector3()
			sat.getWorldPosition(worldPos)
			const currentDistance = worldPos.length()

			// Check if we've entered the exosphere (distance-based, not time-based)
			if (
				currentDistance <= EXOSPHERE_RADIUS &&
				!data.reachedExosphere &&
				!data.startedInExosphere
			) {
				data.reachedExosphere = true
				data.exosphereTime = Date.now()
			}

			const inBurnPhase = data.reachedExosphere || data.startedInExosphere

			// Calculate progress for each phase
			const elapsed = Date.now() - data.decommissionStartTime
			let burnProgress = 0

			if (inBurnPhase && data.exosphereTime) {
				// Burn phase - 5 seconds of burning
				const burnElapsed = Date.now() - data.exosphereTime
				burnProgress = Math.min(
					burnElapsed / DECOMMISSION_CONFIG.burnDuration,
					1
				)
			}

			// Calculate target radius based on phase
			let radiusMultiplier
			const startRadius =
				data.originalOrbitRadius ||
				data.originalOrbitRadiusX ||
				LEO_ORBIT_RADIUS

			// Calculate scaled approach duration based on starting orbit radius
			const distanceToExosphere = Math.max(0, startRadius - EXOSPHERE_RADIUS)
			const approachDuration =
				DECOMMISSION_CONFIG.approachDurationBase +
				distanceToExosphere * DECOMMISSION_CONFIG.approachDurationPerUnit

			// Smooth ease-in-out function for gentler acceleration
			const smoothEase = (t) => {
				// Cubic ease-in-out: slow start, smooth middle, slow end
				return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
			}

			if (!inBurnPhase) {
				// Approach: continuously shrink toward exosphere based on time
				const approachProgress = Math.min(elapsed / approachDuration, 0.98)
				const easeProgress = smoothEase(approachProgress)

				// Target slightly inside exosphere to ensure we trigger the distance check
				const targetRadius = EXOSPHERE_RADIUS * 0.9
				radiusMultiplier = 1 - easeProgress * (1 - targetRadius / startRadius)

				// If time ran out but we haven't reached exosphere, continue gently
				if (approachProgress >= 0.98 && currentDistance > EXOSPHERE_RADIUS) {
					const extraProgress = (elapsed - approachDuration) / 3000
					radiusMultiplier =
						radiusMultiplier * (1 - Math.min(extraProgress, 0.5) * 0.2)
				}
			} else {
				// Burn: shrink from current position to inner atmosphere with smooth easing
				const entryMultiplier = data.startedInExosphere
					? 1 // Started in exosphere, use original radius
					: Math.min(
							EXOSPHERE_RADIUS / startRadius,
							currentDistance / startRadius
					  )
				const innerMultiplier = INNER_ATMOSPHERE_RADIUS / startRadius
				// Use smooth ease for burn phase too
				const easedBurnProgress = smoothEase(burnProgress)
				radiusMultiplier =
					entryMultiplier -
					easedBurnProgress * (entryMultiplier - innerMultiplier)
			}

			// Speed multiplier - gradual increase during approach, smooth transition to slow-mo
			let speedMultiplier
			if (!inBurnPhase) {
				const approachProgress = Math.min(elapsed / approachDuration, 1)
				// Gentler speed increase: use smooth easing, max 2.5x speed
				speedMultiplier = 1 + smoothEase(approachProgress) * 1.5
			} else {
				// Smooth transition into slow motion over first 500ms of burn
				const burnElapsed = Date.now() - data.exosphereTime
				const transitionProgress = Math.min(burnElapsed / 500, 1)
				const approachEndSpeed = 2.5 // Speed at end of approach
				const targetSpeed = DECOMMISSION_CONFIG.slowMotionFactor
				// Lerp from approach speed to slow-mo
				speedMultiplier =
					approachEndSpeed -
					smoothEase(transitionProgress) * (approachEndSpeed - targetSpeed)
			}

			// Pulse orbital ring color (black to red)
			if (data.orbitalRing) {
				const time = Date.now() * 0.003
				const intensity = (Math.sin(time) + 1) / 2
				data.orbitalRing.material.color.setRGB(intensity, 0, 0)
			}

			// Calculate orbit direction for flame trail orientation
			let orbitDirection = null

			// Apply de-orbit animation
			if (data.eccentricity) {
				// MEO (Keplerian)
				const { r: currentR } = updateKeplerianPosition(
					data.angle,
					data.semiMajorAxis,
					data.eccentricity
				)
				const speed =
					data.orbitSpeed * (1.5 / (currentR * currentR)) * speedMultiplier
				data.angle += speed

				const { x, y } = updateKeplerianPosition(
					data.angle,
					data.semiMajorAxis,
					data.eccentricity
				)
				sat.position.set(x * radiusMultiplier, y * radiusMultiplier, 0)
				sat.rotation.z = data.angle + Math.PI / 2

				// Calculate orbit direction (tangent to orbit)
				orbitDirection = new THREE.Vector3(
					-Math.sin(data.angle),
					Math.cos(data.angle),
					0
				)
			} else if (data.originalOrbitRadiusX) {
				// GEO satellite (elliptical)
				data.orbitRadiusX = data.originalOrbitRadiusX * radiusMultiplier
				data.orbitRadiusZ = data.originalOrbitRadiusZ * radiusMultiplier
				data.orbitSpeed = data.originalOrbitSpeed * speedMultiplier

				data.angle += data.orbitSpeed
				const x = Math.cos(data.angle) * data.orbitRadiusX
				const y = Math.sin(data.angle) * data.orbitRadiusZ
				sat.position.set(x, y, 0)
				sat.rotation.z = data.angle - Math.PI / 2

				orbitDirection = new THREE.Vector3(
					-Math.sin(data.angle),
					Math.cos(data.angle),
					0
				)
			} else {
				// LEO satellite (circular) - also handles George with orbitY
				data.orbitRadius = data.originalOrbitRadius * radiusMultiplier
				data.orbitSpeed = data.originalOrbitSpeed * speedMultiplier

				const x = Math.cos(data.angle) * data.orbitRadius
				const z = Math.sin(data.angle) * data.orbitRadius
				const y = data.orbitY !== undefined ? data.orbitY * radiusMultiplier : 0
				sat.position.set(x, y, z)
				sat.rotation.y = -data.angle - Math.PI / 2
				data.angle += data.orbitSpeed

				// Orbit direction for LEO (tangent in XZ plane)
				orbitDirection = new THREE.Vector3(
					-Math.sin(data.angle),
					0,
					Math.cos(data.angle)
				)
				if (data.orbitSpeed < 0) orbitDirection.negate() // Reverse for clockwise orbits
			}

			// Update flame trail effect (only visible when inside exosphere)
			updateFlameTrail(sat, burnProgress, orbitDirection, currentDistance)

			// Scale down satellite as it burns
			if (inBurnPhase) {
				const scale = 1 - burnProgress * 0.85
				sat.scale.set(scale, scale, scale)

				// Fizzle effect near the end - flickering visibility
				if (burnProgress > 0.8) {
					const fizzleProgress = (burnProgress - 0.8) / 0.2
					const flicker = Math.random() > fizzleProgress * 0.5
					sat.visible = flicker
				}
			}

			// Satellite has completed de-orbit - mark for removal
			if (inBurnPhase && burnProgress >= 1) {
				disposeFlameTrail(sat)
				activeDecommission = null
				satellitesToRemove.push(sat)
			}
		} else if (data.returning) {
			// Return-to-orbit animation (cancelled decommission)
			if (!data._loggedReturning) {
				console.log("Returning animation started for", data.id)
				data._loggedReturning = true
			}
			const elapsed = Date.now() - data.returnStartTime
			const returnProgress = Math.min(elapsed / data.returnDuration, 1)

			// Smooth ease-out function for natural return
			const smoothEaseOut = (t) => 1 - Math.pow(1 - t, 3)
			const easedProgress = smoothEaseOut(returnProgress)

			// Interpolate radius from return start position back to 1.0 (original)
			const radiusMultiplier =
				data.returnStartRadiusMultiplier +
				easedProgress * (1 - data.returnStartRadiusMultiplier)

			// Pulse orbital ring with original color (blink effect)
			if (data.orbitalRing && data.originalOrbitColor !== undefined) {
				const time = Date.now() * 0.003
				const intensity = (Math.sin(time) + 1) / 2
				const color = new THREE.Color(data.originalOrbitColor)
				// Blink between black and original color
				data.orbitalRing.material.color.setRGB(
					color.r * intensity,
					color.g * intensity,
					color.b * intensity
				)
			}

			// Apply position based on orbit type
			if (data.eccentricity) {
				// MEO (Keplerian)
				const { r: currentR } = updateKeplerianPosition(
					data.angle,
					data.semiMajorAxis,
					data.eccentricity
				)
				const speed = data.originalOrbitSpeed * (1.5 / (currentR * currentR))
				data.angle += speed

				const { x, y } = updateKeplerianPosition(
					data.angle,
					data.semiMajorAxis,
					data.eccentricity
				)
				sat.position.set(x * radiusMultiplier, y * radiusMultiplier, 0)
				sat.rotation.z = data.angle + Math.PI / 2
			} else if (data.originalOrbitRadiusX) {
				// GEO satellite (elliptical)
				data.angle += data.originalOrbitSpeed
				const x =
					Math.cos(data.angle) * data.originalOrbitRadiusX * radiusMultiplier
				const y =
					Math.sin(data.angle) * data.originalOrbitRadiusZ * radiusMultiplier
				sat.position.set(x, y, 0)
				sat.rotation.z = data.angle - Math.PI / 2
			} else {
				// LEO satellite (circular)
				data.angle += data.originalOrbitSpeed
				const x =
					Math.cos(data.angle) * data.originalOrbitRadius * radiusMultiplier
				const z =
					Math.sin(data.angle) * data.originalOrbitRadius * radiusMultiplier
				sat.position.set(x, 0, z)
				sat.rotation.y = -data.angle - Math.PI / 2
			}

			// Check if return is complete
			if (returnProgress >= 1) {
				console.log("Return complete for", data.id)
				// Restore original state
				data.returning = false
				data._loggedReturning = false
				data.returnStartTime = null
				data.returnStartRadiusMultiplier = null
				data.returnDuration = null

				// Restore orbit speed
				data.orbitSpeed = data.originalOrbitSpeed

				// Restore orbital ring to original color (no more blinking)
				if (data.orbitalRing && data.originalOrbitColor !== undefined) {
					data.orbitalRing.material.color.setHex(data.originalOrbitColor)
				}

				// Clean up decommission-related data
				data.decommissionStartTime = null
				data.reachedExosphere = false
				data.exosphereTime = null
				data.startedInExosphere = false

				// Restore original radius values
				if (data.originalOrbitRadius) {
					data.orbitRadius = data.originalOrbitRadius
				}
				if (data.originalOrbitRadiusX) {
					data.orbitRadiusX = data.originalOrbitRadiusX
					data.orbitRadiusZ = data.originalOrbitRadiusZ
				}

				// Special handling for George (geosynchronous) - put back on planet
				if (data.isGeosynchronous) {
					// Remove from orcGroup and add back to planet
					orcGroup.remove(sat)
					planet.add(sat)

					// Restore original position relative to planet
					const geoPos = latLonTo3D(
						markerLatitude,
						markerLongitude,
						GEO_ALTITUDE
					)
					sat.position.set(geoPos.x, geoPos.y, geoPos.z)
					sat.lookAt(0, 0, 0)
					sat.rotateX(Math.PI / 2)

					// Clean up temporary LEO-like orbit params
					delete data.angle
					delete data.orbitRadius
					delete data.orbitSpeed
					delete data.orbitY
					delete data.originalOrbitRadius
					delete data.originalOrbitSpeed

					// Restore surface marker and circle visibility
					if (surfaceMarker) surfaceMarker.visible = true
					if (surfaceCircle) surfaceCircle.visible = true

					console.log("George restored to geosynchronous orbit")
				}
			}
		} else if (animateNormal) {
			// Normal orbit animation (only when not paused)
			if (data.eccentricity) {
				// MEO Satellite (Keplerian Orbit)
				// 1. Calculate current radius to determine instantaneous speed
				const { r } = updateKeplerianPosition(
					data.angle,
					data.semiMajorAxis,
					data.eccentricity
				)

				// 2. Update angle (True Anomaly)
				// Angular velocity is proportional to 1/r^2 (Conservation of angular momentum)
				// 1.5 is a tuning factor to match visual speed expectations
				const instantaneousSpeed = data.orbitSpeed * (1.5 / (r * r)) * timeScale
				data.angle += instantaneousSpeed

				// 3. Update Position
				const { x, y } = updateKeplerianPosition(
					data.angle,
					data.semiMajorAxis,
					data.eccentricity
				)
				sat.position.set(x, y, 0)
				sat.rotation.z = data.angle + Math.PI / 2
			} else if (data.orbitRadiusX) {
				// GEO satellite - counter-clockwise
				data.angle += data.orbitSpeed * timeScale
				const x = Math.cos(data.angle) * data.orbitRadiusX
				const y = Math.sin(data.angle) * data.orbitRadiusZ
				sat.position.set(x, y, 0)
				// Rotate satellite to face direction of travel
				sat.rotation.z = data.angle - Math.PI / 2
			} else {
				// LEO satellite - counter-clockwise
				data.angle += data.orbitSpeed * timeScale
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
	orcHand = null
	orcHandStateMachine = null
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
	// Draw continents
	miniCtx.fillStyle = "#EAE9BD"
	miniCtx.strokeStyle = "#EAE9BD"
	miniCtx.lineWidth = 1
	drawAccurateContinents(miniCtx, miniCanvas.width, miniCanvas.height)

	const miniTexture = new THREE.CanvasTexture(miniCanvas)
	miniTexture.colorSpace = THREE.SRGBColorSpace
	miniTexture.wrapS = THREE.RepeatWrapping

	const miniPlanetGeo = new THREE.SphereGeometry(0.3, 32, 32)
	const miniPlanetMat = new THREE.MeshBasicMaterial({
		map: miniTexture,
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
	const ring1 = createOrbitalRing(0.8, 0.5, 0xff00ff)

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
		color: 0xff00ff,
		emissive: 0xff00ff,
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

// Create flame trail particles for burning effect
function createFlameTrail(satellite) {
	const flameGroup = new THREE.Group()
	flameGroup.name = "flameTrail"

	// Create multiple flame particles at different scales
	const flameCount = 8
	const flames = []

	for (let i = 0; i < flameCount; i++) {
		// Create a cone-shaped flame
		const flameGeometry = new THREE.ConeGeometry(
			0.02 + i * 0.008,
			0.08 + i * 0.02,
			8
		)
		const flameMaterial = new THREE.MeshBasicMaterial({
			color: new THREE.Color().setHSL(0.08 - i * 0.01, 1, 0.5 + i * 0.05), // Orange to yellow
			transparent: true,
			opacity: 0.9 - i * 0.08,
			blending: THREE.AdditiveBlending,
			depthWrite: false,
		})

		const flame = new THREE.Mesh(flameGeometry, flameMaterial)
		flame.rotation.x = Math.PI // Point backwards
		flame.position.z = 0.03 + i * 0.025 // Stagger behind satellite
		flame.visible = false // Hidden until burning starts

		// Store initial properties for animation
		flame.userData = {
			baseScale: 1 + i * 0.3,
			phaseOffset: i * 0.5,
			baseOpacity: 0.9 - i * 0.08,
		}

		flames.push(flame)
		flameGroup.add(flame)
	}

	// Add outer glow sphere
	const glowGeometry = new THREE.SphereGeometry(0.06, 16, 16)
	const glowMaterial = new THREE.MeshBasicMaterial({
		color: 0xff4400,
		transparent: true,
		opacity: 0,
		blending: THREE.AdditiveBlending,
		depthWrite: false,
	})
	const glow = new THREE.Mesh(glowGeometry, glowMaterial)
	glow.name = "flameGlow"
	flameGroup.add(glow)

	// Add to satellite
	satellite.add(flameGroup)

	return { group: flameGroup, flames, glow }
}

// Update flame trail animation
// currentDistance: the satellite's actual distance from planet center
function updateFlameTrail(
	satellite,
	burnProgress,
	orbitDirection,
	currentDistance
) {
	const data = satellite.userData
	if (!data.flameParticles) return

	const { group, flames, glow } = data.flameParticles
	const time = Date.now() * 0.01

	// Only show flames when satellite has ACTUALLY entered the exosphere (distance check)
	const inExosphere = currentDistance <= EXOSPHERE_RADIUS
	const burning =
		inExosphere && (data.reachedExosphere || data.startedInExosphere)

	flames.forEach((flame, i) => {
		flame.visible = burning

		if (burning) {
			const { baseScale, phaseOffset, baseOpacity } = flame.userData

			// Flickering scale animation
			const flicker = 0.7 + Math.sin(time + phaseOffset) * 0.3
			const intensityScale = 0.5 + burnProgress * 1.5 // Grows with burn progress
			flame.scale.setScalar(baseScale * flicker * intensityScale)

			// Opacity based on burn progress
			flame.material.opacity =
				baseOpacity * (0.3 + burnProgress * 0.7) * flicker

			// Color shifts from orange to white as it intensifies
			const hue = 0.08 - burnProgress * 0.03 // Orange toward yellow
			const lightness = 0.5 + burnProgress * 0.3
			flame.material.color.setHSL(hue, 1, lightness)
		}
	})

	// Update glow
	if (glow) {
		glow.visible = burning
		if (burning) {
			glow.material.opacity = burnProgress * 0.6
			glow.scale.setScalar(1 + burnProgress * 2)
			// Pulse effect
			glow.material.opacity *= 0.8 + Math.sin(time * 2) * 0.2
		}
	}

	// Orient flames to trail behind orbital direction
	if (burning && orbitDirection) {
		// Point flames opposite to velocity direction
		group.lookAt(group.position.clone().sub(orbitDirection))
	}
}

// Cleanup flame trail
function disposeFlameTrail(satellite) {
	const data = satellite.userData
	if (!data.flameParticles) return

	const { group, flames, glow } = data.flameParticles

	flames.forEach((flame) => {
		flame.geometry.dispose()
		flame.material.dispose()
	})

	if (glow) {
		glow.geometry.dispose()
		glow.material.dispose()
	}

	if (group.parent) {
		group.parent.remove(group)
	}

	data.flameParticles = null
}

// Start the decommission process for a satellite
export function startDecommission(satellite) {
	if (!satellite || satellite.userData.decommissioning) {
		return
	}

	const data = satellite.userData

	// Set as active decommission for camera tracking
	activeDecommission = satellite

	// Mark satellite as being decommissioned
	data.decommissioning = true
	data.decommissionStartTime = Date.now()

	// If this is George (geosynchronous satellite), handle specially
	if (data.isGeosynchronous) {
		// Hide tether and marker immediately
		hideGeoTether()
		if (surfaceMarker) surfaceMarker.visible = false
		if (surfaceCircle) surfaceCircle.visible = false

		// George is a child of planet - get world position and detach
		const worldPos = new THREE.Vector3()
		satellite.getWorldPosition(worldPos)

		// Remove from planet and add to orcGroup
		planet.remove(satellite)
		orcGroup.add(satellite)
		orcGroup.worldToLocal(worldPos)
		satellite.position.copy(worldPos)

		// Initialize orbit parameters for animation (treat as circular orbit around Y axis)
		// This ensures we don't get NaNs in animateOrcScene
		const radiusXZ = Math.sqrt(
			worldPos.x * worldPos.x + worldPos.z * worldPos.z
		)
		data.orbitRadius = radiusXZ
		data.orbitY = worldPos.y
		data.angle = Math.atan2(worldPos.z, worldPos.x)
		data.orbitSpeed = 0.001 // Match planet rotation speed

		// Store original orbit params for potential cancel
		data.originalWorldPos = worldPos.clone()
	}

	// Store original orbit parameters for potential cancel
	if (data.eccentricity) {
		// MEO - store current angle
		data.originalAngle = data.angle
	} else if (data.orbitRadiusX) {
		// GEO satellite (elliptical)
		data.originalOrbitRadiusX = data.orbitRadiusX
		data.originalOrbitRadiusZ = data.orbitRadiusZ
	} else if (data.orbitRadius) {
		// LEO satellite (circular)
		// LEO satellite (circular) or initialized GEO
		data.originalOrbitRadius = data.orbitRadius
	}
	data.originalOrbitSpeed = data.orbitSpeed

	// Start the Hand of ORC decommission sequence
	if (orcHandStateMachine) {
		orcHandStateMachine.startDecommission(satellite)
	}

	// Update UI
	updateSatelliteListItemState(satellite.userData.id, true)
}

// Update the satellite list item to show decommissioning state
// Keep satellite selected during decommission (visual feedback comes from other animations)
function updateSatelliteListItemState(satelliteId, isDecommissioning) {
	// No longer changing the list item appearance during decommission
	// The satellite stays selected until it's removed from the scene
}

// Cancel the decommission process and return satellite to original orbit
export function cancelDecommission(satellite) {
	console.log("cancelDecommission called", satellite?.userData?.id)
	if (!satellite || !satellite.userData.decommissioning) {
		console.log("cancelDecommission: not decommissioning")
		return false
	}

	// Check if hand state machine can cancel
	if (orcHandStateMachine && !orcHandStateMachine.canCancel()) {
		console.log(
			"cancelDecommission: hand cannot cancel (slap already delivered)"
		)
		return false
	}

	const data = satellite.userData

	// Cancel through hand state machine
	if (orcHandStateMachine) {
		const cancelled = orcHandStateMachine.cancel()
		if (!cancelled) {
			console.log("cancelDecommission: hand cancel failed")
			return false
		}
	}

	// Mark satellite as returning to orbit
	data.decommissioning = false
	data.returning = true
	data.returnStartTime = Date.now()

	// Get current world position for return animation
	const worldPos = new THREE.Vector3()
	satellite.getWorldPosition(worldPos)

	// Calculate return parameters based on orbit type
	let originalRadius
	if (data.eccentricity && data.semiMajorAxis) {
		// MEO: Calculate expected radius at current angle
		const a = data.semiMajorAxis
		const e = data.eccentricity
		const theta = data.angle || 0
		originalRadius = (a * (1 - e * e)) / (1 + e * Math.cos(theta))
		data.returnStartRadiusMultiplier =
			satellite.position.length() / originalRadius
	} else if (data.originalOrbitRadius) {
		// LEO or GEO circular
		originalRadius = data.originalOrbitRadius
		data.returnStartRadiusMultiplier = worldPos.length() / originalRadius
	} else if (data.originalOrbitRadiusX) {
		// GEO elliptical
		originalRadius = data.originalOrbitRadiusX
		data.returnStartRadiusMultiplier = worldPos.length() / originalRadius
	} else {
		originalRadius = LEO_ORBIT_RADIUS
		data.returnStartRadiusMultiplier = 1
	}

	// Duration based on how far through the sequence we were
	data.returnDuration = 2000

	console.log("cancelDecommission: return animation started", {
		returning: data.returning,
		returnDuration: data.returnDuration,
	})

	// Dispose flame trail if any
	disposeFlameTrail(satellite)

	// Clear active decommission tracking
	if (activeDecommission === satellite) {
		activeDecommission = null
	}

	return true
}

// Check if a satellite can have its decommission cancelled
export function canCancelDecommission(satellite) {
	if (!satellite || !satellite.userData.decommissioning) {
		return false
	}
	// Check if hand state machine allows cancellation
	if (orcHandStateMachine) {
		return orcHandStateMachine.canCancel()
	}
	return false
}

// Remove a satellite from the scene and UI after decommission
function removeSatelliteFromScene(satellite) {
	const satId = satellite.userData.id

	// Remove from satellites array
	const index = satellites.indexOf(satellite)
	if (index > -1) {
		satellites.splice(index, 1)
	}

	// Clear active decommission tracking if this was the active one
	if (activeDecommission === satellite) {
		activeDecommission = null
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
