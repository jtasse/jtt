import * as THREE from "three"
import { HandStateMachine } from "../../hand/HandStateMachine.js"
import {
	DECOMMISSION_CONFIG,
	updateFlameTrail,
	disposeFlameTrail,
	createFlameTrail,
	clearActiveDecommission,
} from "./Decommission.js"

// === Scene State ===
export let orcGroup = null
export let planet = null
export let satellites = []
export let orbitalRings = []

// Surface marker elements
export let surfaceMarker = null
export let surfaceCircle = null
export let geoTether = null

// Hand of ORC
export let orcHand = null
export let orcHandStateMachine = null

// Surface marker position
export let markerLatitude = 33 // Charleston, SC
export let markerLongitude = -80
export const MARKER_CIRCLE_RADIUS_DEG = 15
const LONGITUDE_OFFSET = 88

// Constants
export const PLANET_RADIUS = 0.5
export const LEO_ORBIT_RADIUS = 0.65
export const LEO_ORBIT_SPEED = 0.0045
export const SATELLITE_SIZE = 0.08
export const GEO_ALTITUDE = 2.0
export const MIN_FRONT_Z = 0.4
export const EXOSPHERE_RADIUS = 0.72
export const INNER_ATMOSPHERE_RADIUS = PLANET_RADIUS * 1.08

// === Helper Functions ===

export function latLonTo3D(lat, lon, radius = PLANET_RADIUS) {
	const latRad = (lat * Math.PI) / 180
	const lonRad = ((lon + LONGITUDE_OFFSET) * Math.PI) / 180
	const x = radius * Math.cos(latRad) * Math.sin(lonRad)
	const y = radius * Math.sin(latRad)
	const z = radius * Math.cos(latRad) * Math.cos(lonRad)
	return { x, y, z }
}

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
		planet.remove(surfaceCircle)
		surfaceCircle.geometry.dispose()
		surfaceCircle = createSurfaceCircle()
		planet.add(surfaceCircle)
	}
}

export function showGeoTether() {
	if (geoTether) geoTether.visible = true
}

export function hideGeoTether() {
	if (geoTether) geoTether.visible = false
}

// === Scene Creation ===

export function createOrcScene(camera) {
	orcGroup = new THREE.Group()
	orcGroup.name = "orcScene"

	planet = createPlanet()
	orcGroup.add(planet)

	// Geosynchronous Satellite (George)
	const geoSatellite = createSatellite(0xff00ff)
	const geoPos = latLonTo3D(markerLatitude, markerLongitude, GEO_ALTITUDE)
	geoSatellite.position.set(geoPos.x, geoPos.y, geoPos.z)
	geoSatellite.lookAt(0, 0, 0)
	geoSatellite.rotateX(Math.PI / 2)

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
		isGeosynchronous: true,
		orbitalRing: geoRing,
		originalOrbitColor: 0xff00ff,
	}

	planet.add(geoSatellite)
	planet.add(geoRing)
	orbitalRings.push(geoRing)
	satellites.push(geoSatellite)

	geoTether = createGeoTether()
	geoTether.visible = false
	planet.add(geoTether)

	// LEO Satellite (Leona)
	const leoRing = createOrbitalRing(LEO_ORBIT_RADIUS, undefined, 0x00ffaa)
	leoRing.rotation.x = Math.PI / 2
	orcGroup.add(leoRing)
	orbitalRings.push(leoRing)

	const leoSatellite = createSatellite(0x00ffaa)
	leoSatellite.userData = {
		name: "Leona",
		id: "leo-001",
		orbitIndex: 0,
		orbitRadius: LEO_ORBIT_RADIUS,
		orbitSpeed: LEO_ORBIT_SPEED,
		angle: Math.PI,
		orbitalRing: leoRing,
		originalOrbitColor: 0x00ffaa,
	}
	satellites.push(leoSatellite)
	orcGroup.add(leoSatellite)

	// Molniya Satellite (Moltar)
	const molOrbitGroup = new THREE.Group()
	const molSemiMajor = 2.3
	const molEccentricity = 0.72
	const molSemiMinor = molSemiMajor * Math.sqrt(1 - molEccentricity ** 2)
	const molLinearEccentricity = molSemiMajor * molEccentricity

	const molRing = createOrbitalRing(molSemiMajor, molSemiMinor, 0xffaa00)
	molRing.position.x = -molLinearEccentricity

	const molSatellite = createSatellite(0xffaa00)
	molSatellite.userData = {
		name: "Moltar",
		id: "mol-001",
		orbitIndex: 2,
		semiMajorAxis: molSemiMajor,
		eccentricity: molEccentricity,
		orbitSpeed: 0.006,
		angle: 0,
		orbitalRing: molRing,
		originalOrbitColor: 0xffaa00,
	}
	molOrbitGroup.add(molRing)
	molOrbitGroup.add(molSatellite)
	molOrbitGroup.rotation.x = -Math.PI / 2.4
	molOrbitGroup.rotation.y = Math.PI / 0.084
	molOrbitGroup.rotation.z = Math.PI / 3.8
	orcGroup.add(molOrbitGroup)
	orbitalRings.push(molRing)
	satellites.push(molSatellite)

	// Surface Marker
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

	return orcGroup
}

export function setOrcHand(hand, camera) {
	if (!hand) return
	orcHand = hand
	if (orcHand.parent !== orcGroup && orcGroup) {
		orcGroup.add(orcHand)
	}

	orcHandStateMachine = new HandStateMachine(
		orcHand,
		orcGroup,
		satellites,
		camera
	)

	orcHandStateMachine.onSatelliteBurn = (satellite) => {
		if (!satellite.userData.flameParticles) {
			satellite.userData.flameParticles = createFlameTrail(satellite)
		}
		// Generic flag for all orbit types (LEO=flick, GEO=punch, Molniya=slap)
		satellite.userData.handContacted = true
		satellite.userData.burnStartTime = performance.now()
		// Reset decommission start time for proper animation timing
		satellite.userData.decommissionStartTime = Date.now()

		if (satellite.userData.isGeosynchronous && satellite.parent === planet) {
			const worldPos = new THREE.Vector3()
			satellite.getWorldPosition(worldPos)
			planet.remove(satellite)
			orcGroup.add(satellite)
			orcGroup.worldToLocal(worldPos)
			satellite.position.copy(worldPos)
		}
	}

	orcHandStateMachine.onSatelliteDestroyed = (satellite) => {
		disposeFlameTrail(satellite)
		removeSatelliteFromScene(satellite)
	}
}

export function releaseOrcHand() {
	const hand = orcHand
	if (hand && orcGroup && hand.parent === orcGroup) {
		orcGroup.remove(hand)
	}
	orcHand = null
	orcHandStateMachine = null
	return hand
}

export function disposeOrcScene() {
	if (orcGroup) {
		if (orcHand && orcHand.parent === orcGroup) {
			orcGroup.remove(orcHand)
		}
		orcGroup.traverse((child) => {
			if (child.name === "orcHand") return
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
	orcHandStateMachine = null
}

export function removeSatelliteFromScene(satellite) {
	const satId = satellite.userData.id
	const index = satellites.indexOf(satellite)
	if (index > -1) satellites.splice(index, 1)

	clearActiveDecommission(satellite)

	if (satellite.parent) satellite.parent.remove(satellite)

	if (satellite.userData.orbitalRing) {
		const ring = satellite.userData.orbitalRing
		const rIndex = orbitalRings.indexOf(ring)
		if (rIndex > -1) orbitalRings.splice(rIndex, 1)
		if (ring.parent) ring.parent.remove(ring)
		if (ring.geometry) ring.geometry.dispose()
		if (ring.material) ring.material.dispose()
	}

	satellite.traverse((child) => {
		if (child.geometry) child.geometry.dispose()
		if (child.material) {
			if (Array.isArray(child.material))
				child.material.forEach((m) => m.dispose())
			else child.material.dispose()
		}
	})

	window.dispatchEvent(
		new CustomEvent("satelliteRemoved", { detail: { satelliteId: satId } })
	)
}

// === Internal Creation Helpers ===

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
	sphere.userData.rotationSpeed = 0.001

	// Atmosphere
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
	sphere.add(new THREE.Mesh(innerAtmosphereGeometry, innerAtmosphereMaterial))

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
	sphere.add(new THREE.Mesh(outerAtmosphereGeometry, outerAtmosphereMaterial))

	const exosphereGeometry = new THREE.SphereGeometry(EXOSPHERE_RADIUS, 32, 32)
	const exosphereMaterial = new THREE.ShaderMaterial({
		uniforms: { glowColor: { value: new THREE.Color(0x2255aa) } },
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
	sphere.add(new THREE.Mesh(exosphereGeometry, exosphereMaterial))

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
	ring.name = `orbitalRing_${xRadius}`
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

function createSurfaceMarker() {
	const geometry = new THREE.SphereGeometry(0.02, 16, 16)
	const material = new THREE.MeshBasicMaterial({
		color: 0xff00ff,
		transparent: true,
		opacity: 0.9,
	})
	surfaceMarker = new THREE.Mesh(geometry, material)
	surfaceMarker.name = "surfaceMarker"
	return surfaceMarker
}

function createSurfaceCircle() {
	const segments = 64
	const points = []
	for (let i = 0; i <= segments; i++) {
		const bearing = (i / segments) * 2 * Math.PI
		const lat1 = (markerLatitude * Math.PI) / 180
		const lon1 = (markerLongitude * Math.PI) / 180
		const angularDistance = (MARKER_CIRCLE_RADIUS_DEG * Math.PI) / 180
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
		const pos = latLonTo3D(
			(lat2 * 180) / Math.PI,
			(lon2 * 180) / Math.PI,
			PLANET_RADIUS * 1.005
		)
		points.push(new THREE.Vector3(pos.x, pos.y, pos.z))
	}
	const geometry = new THREE.BufferGeometry().setFromPoints(points)
	const material = new THREE.LineBasicMaterial({
		color: 0xff00ff,
		transparent: true,
		opacity: 0.8,
		linewidth: 2,
	})
	surfaceCircle = new THREE.LineLoop(geometry, material)
	surfaceCircle.name = "surfaceCircle"
	return surfaceCircle
}

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
		color: 0xff00ff,
		transparent: true,
		opacity: 0.8,
		dashSize: 0.05,
		gapSize: 0.03,
	})
	const line = new THREE.Line(geometry, material)
	line.computeLineDistances()
	line.name = "geoTether"
	return line
}

// === Animation Loop ===

const satellitesToRemove = []

export function animateOrcScene(animateNormal = true) {
	if (!orcGroup) return

	if (animateNormal && planet && planet.userData.rotationSpeed) {
		planet.rotation.y += planet.userData.rotationSpeed
	}

	if (orcHandStateMachine) {
		orcHandStateMachine.update()
	}

	satellites.forEach((sat) => {
		const data = sat.userData
		// Use timeScale from state machine if available, otherwise default to 1.0
		const timeScale =
			orcHandStateMachine && typeof orcHandStateMachine.timeScale === "number"
				? orcHandStateMachine.timeScale
				: 1.0

		// 1. Post-Contact Physics (after hand flick/punch/slap)
		if (data.handContacted) {
			if (sat.parent) {
				const burnElapsed = performance.now() - data.burnStartTime
				const burnDuration = 4000
				const burnProgress = Math.min(burnElapsed / burnDuration, 1)

				const worldPos = new THREE.Vector3()
				sat.getWorldPosition(worldPos)
				const orbitDir = worldPos.clone().normalize().negate()
				updateFlameTrail(sat, burnProgress, orbitDir, worldPos.length())

				const scale = 1 - burnProgress * 0.85
				sat.scale.set(scale, scale, scale)

				if (burnProgress > 0.8) {
					const fizzleProgress = (burnProgress - 0.8) / 0.2
					sat.visible = Math.random() > fizzleProgress * 0.5
				}

				let currentDist = worldPos.length()
				if (currentDist > INNER_ATMOSPHERE_RADIUS) {
					const earthDir = worldPos.clone().normalize().negate()
					if (isNaN(earthDir.x)) earthDir.set(0, -1, 0)
					const speed = 0.08 * timeScale
					const movement = earthDir.clone().multiplyScalar(speed)
					const newWorldPos = worldPos.clone().add(movement)

					if (sat.parent) sat.parent.worldToLocal(newWorldPos)
					sat.position.copy(newWorldPos)
				}

				sat.rotation.x += 0.15
				sat.rotation.z += 0.08

				sat.getWorldPosition(worldPos)
				currentDist = worldPos.length()
				if (currentDist < INNER_ATMOSPHERE_RADIUS + 0.02) {
					sat.visible = false
				}
			}
			return
		}

		// 2. Decommissioning
		if (data.decommissioning) {
			// ALL satellites stay in place until hand makes contact
			// This prevents drift/spiral that could clip satellite into planet
			// Contact phase: LEO=flick, GEO=punch, Molniya=slap
			if (!data.handContacted) {
				// Satellite frozen in place - hand is still approaching/preparing
				return
			}

			const worldPos = new THREE.Vector3()
			sat.getWorldPosition(worldPos)
			const currentDistance = worldPos.length()

			if (
				currentDistance <= EXOSPHERE_RADIUS &&
				!data.reachedExosphere &&
				!data.startedInExosphere
			) {
				data.reachedExosphere = true
				data.exosphereTime = Date.now()
			}

			const inBurnPhase = data.reachedExosphere || data.startedInExosphere
			const elapsed = Date.now() - data.decommissionStartTime
			let burnProgress = 0

			if (inBurnPhase && data.exosphereTime) {
				const burnElapsed = Date.now() - data.exosphereTime
				burnProgress = Math.min(
					burnElapsed / DECOMMISSION_CONFIG.burnDuration,
					1
				)
			}

			let radiusMultiplier
			const startRadius =
				data.originalOrbitRadius ||
				data.originalOrbitRadiusX ||
				LEO_ORBIT_RADIUS
			const distanceToExosphere = Math.max(0, startRadius - EXOSPHERE_RADIUS)
			const approachDuration =
				DECOMMISSION_CONFIG.approachDurationBase +
				distanceToExosphere * DECOMMISSION_CONFIG.approachDurationPerUnit

			const smoothEase = (t) =>
				t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

			if (!inBurnPhase) {
				const approachProgress = Math.min(elapsed / approachDuration, 0.98)
				const easeProgress = smoothEase(approachProgress)
				const targetRadius = EXOSPHERE_RADIUS * 0.9
				radiusMultiplier = 1 - easeProgress * (1 - targetRadius / startRadius)
				if (approachProgress >= 0.98 && currentDistance > EXOSPHERE_RADIUS) {
					const extraProgress = (elapsed - approachDuration) / 3000
					radiusMultiplier =
						radiusMultiplier * (1 - Math.min(extraProgress, 0.5) * 0.2)
				}
			} else {
				const entryMultiplier = data.startedInExosphere
					? 1
					: Math.min(
							EXOSPHERE_RADIUS / startRadius,
							currentDistance / startRadius
					  )
				const innerMultiplier = INNER_ATMOSPHERE_RADIUS / startRadius
				const easedBurnProgress = smoothEase(burnProgress)
				radiusMultiplier =
					entryMultiplier -
					easedBurnProgress * (entryMultiplier - innerMultiplier)
			}

			let speedMultiplier
			if (!inBurnPhase) {
				const approachProgress = Math.min(elapsed / approachDuration, 1)
				speedMultiplier = 1 + smoothEase(approachProgress) * 1.5
			} else {
				const burnElapsed = Date.now() - data.exosphereTime
				const transitionProgress = Math.min(burnElapsed / 500, 1)
				const approachEndSpeed = 2.5
				const targetSpeed = DECOMMISSION_CONFIG.slowMotionFactor
				speedMultiplier =
					approachEndSpeed -
					smoothEase(transitionProgress) * (approachEndSpeed - targetSpeed)
			}

			if (data.orbitalRing) {
				const time = Date.now() * 0.003
				const intensity = (Math.sin(time) + 1) / 2
				data.orbitalRing.material.color.setRGB(intensity, 0, 0)
			}

			let orbitDirection = null
			if (data.eccentricity) {
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
				orbitDirection = new THREE.Vector3(
					-Math.sin(data.angle),
					Math.cos(data.angle),
					0
				)
			} else if (data.originalOrbitRadiusX) {
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
				data.orbitRadius = data.originalOrbitRadius * radiusMultiplier
				data.orbitSpeed = data.originalOrbitSpeed * speedMultiplier
				const x = Math.cos(data.angle) * data.orbitRadius
				let z = Math.sin(data.angle) * data.orbitRadius
				const y = data.orbitY !== undefined ? data.orbitY * radiusMultiplier : 0

				if (z < MIN_FRONT_Z) {
					const xyDist = Math.sqrt(x * x + y * y)
					if (xyDist < data.orbitRadius * 0.8) {
						const requiredZ = Math.sqrt(
							Math.max(0, data.orbitRadius * data.orbitRadius - xyDist * xyDist)
						)
						z = Math.max(MIN_FRONT_Z, requiredZ)
					} else {
						z = MIN_FRONT_Z
					}
				}
				sat.position.set(x, y, z)
				sat.rotation.y = -data.angle - Math.PI / 2
				data.angle += data.orbitSpeed
				orbitDirection = new THREE.Vector3(
					-Math.sin(data.angle),
					0,
					Math.cos(data.angle)
				)
				if (data.orbitSpeed < 0) orbitDirection.negate()
			}

			updateFlameTrail(sat, burnProgress, orbitDirection, currentDistance)

			if (inBurnPhase) {
				const scale = 1 - burnProgress * 0.85
				sat.scale.set(scale, scale, scale)
				if (burnProgress > 0.8) {
					const fizzleProgress = (burnProgress - 0.8) / 0.2
					sat.visible = Math.random() > fizzleProgress * 0.5
				}
			}

			if (inBurnPhase && burnProgress >= 1) {
				disposeFlameTrail(sat)
				clearActiveDecommission(sat)
				satellitesToRemove.push(sat)
			}
		}
		// 3. Returning
		else if (data.returning) {
			const elapsed = Date.now() - data.returnStartTime
			const returnProgress = Math.min(elapsed / data.returnDuration, 1)
			const smoothEaseOut = (t) => 1 - Math.pow(1 - t, 3)
			const easedProgress = smoothEaseOut(returnProgress)
			const radiusMultiplier =
				data.returnStartRadiusMultiplier +
				easedProgress * (1 - data.returnStartRadiusMultiplier)

			if (data.orbitalRing && data.originalOrbitColor !== undefined) {
				const time = Date.now() * 0.003
				const intensity = (Math.sin(time) + 1) / 2
				const color = new THREE.Color(data.originalOrbitColor)
				data.orbitalRing.material.color.setRGB(
					color.r * intensity,
					color.g * intensity,
					color.b * intensity
				)
			}

			if (data.eccentricity) {
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
				data.angle += data.originalOrbitSpeed
				const x =
					Math.cos(data.angle) * data.originalOrbitRadiusX * radiusMultiplier
				const y =
					Math.sin(data.angle) * data.originalOrbitRadiusZ * radiusMultiplier
				sat.position.set(x, y, 0)
				sat.rotation.z = data.angle - Math.PI / 2
			} else {
				data.angle += data.originalOrbitSpeed
				const x =
					Math.cos(data.angle) * data.originalOrbitRadius * radiusMultiplier
				const z =
					Math.sin(data.angle) * data.originalOrbitRadius * radiusMultiplier
				sat.position.set(x, 0, z)
				sat.rotation.y = -data.angle - Math.PI / 2
			}

			if (returnProgress >= 1) {
				data.returning = false
				data.returnStartTime = null
				data.returnStartRadiusMultiplier = null
				data.returnDuration = null
				data.orbitSpeed = data.originalOrbitSpeed
				if (data.orbitalRing && data.originalOrbitColor !== undefined) {
					data.orbitalRing.material.color.setHex(data.originalOrbitColor)
				}
				data.decommissionStartTime = null
				data.reachedExosphere = false
				data.exosphereTime = null
				data.startedInExosphere = false

				if (data.originalOrbitRadius)
					data.orbitRadius = data.originalOrbitRadius
				if (data.originalOrbitRadiusX) {
					data.orbitRadiusX = data.originalOrbitRadiusX
					data.orbitRadiusZ = data.originalOrbitRadiusZ
				}

				if (data.isGeosynchronous) {
					orcGroup.remove(sat)
					planet.add(sat)
					const geoPos = latLonTo3D(
						markerLatitude,
						markerLongitude,
						GEO_ALTITUDE
					)
					sat.position.set(geoPos.x, geoPos.y, geoPos.z)
					sat.lookAt(0, 0, 0)
					sat.rotateX(Math.PI / 2)
					delete data.angle
					delete data.orbitRadius
					delete data.orbitSpeed
					delete data.orbitY
					delete data.originalOrbitRadius
					delete data.originalOrbitSpeed
					if (surfaceMarker) surfaceMarker.visible = true
					if (surfaceCircle) surfaceCircle.visible = true
				}
			}
		}
		// 4. Normal Orbit
		else if (animateNormal) {
			if (data.isGeosynchronous) return

			if (data.eccentricity) {
				const { r } = updateKeplerianPosition(
					data.angle,
					data.semiMajorAxis,
					data.eccentricity
				)
				const instantaneousSpeed = data.orbitSpeed * (1.5 / (r * r)) * timeScale
				data.angle += instantaneousSpeed
				const { x, y } = updateKeplerianPosition(
					data.angle,
					data.semiMajorAxis,
					data.eccentricity
				)
				sat.position.set(x, y, 0)
				sat.rotation.z = data.angle + Math.PI / 2
			} else if (data.orbitRadiusX) {
				data.angle += data.orbitSpeed * timeScale
				const x = Math.cos(data.angle) * data.orbitRadiusX
				const y = Math.sin(data.angle) * data.orbitRadiusZ
				sat.position.set(x, y, 0)
				sat.rotation.z = data.angle - Math.PI / 2
			} else {
				data.angle += data.orbitSpeed * timeScale
				const x = Math.cos(data.angle) * data.orbitRadius
				const z = Math.sin(data.angle) * data.orbitRadius
				sat.position.set(x, 0, z)
				sat.rotation.y = -data.angle - Math.PI / 2
			}
		}
	})

	while (satellitesToRemove.length > 0) {
		const sat = satellitesToRemove.pop()
		window.dispatchEvent(
			new CustomEvent("satelliteDecommissioned", {
				detail: { satelliteId: sat.userData.id, satellite: sat },
			})
		)
	}
}

function updateKeplerianPosition(angle, semiMajor, eccentricity) {
	const r =
		(semiMajor * (1 - eccentricity ** 2)) / (1 + eccentricity * Math.cos(angle))
	const x = Math.cos(angle) * r
	const y = Math.sin(angle) * r
	return { x, y, r }
}

// Convert lat/lon to canvas x/y coordinates (equirectangular projection)
function latLonToCanvas(lat, lon, width, height) {
	const x = ((lon + 180) / 360) * width
	const y = ((90 - lat) / 180) * height
	return { x, y }
}

// Draw a continent outline from coordinate array
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

	if (closePath) {
		ctx.closePath()
	}

	ctx.fillStyle = fillColor
	ctx.strokeStyle = fillColor
	ctx.fill()
	ctx.stroke()
}

// Continent drawing helper with accurate geographic coordinates
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

	// Southeast Asia / Indonesia
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

	// Japan
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

	// New Zealand
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
