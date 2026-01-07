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
		satellite.userData.handSlapped = true
		satellite.userData.burnStartTime = performance.now()

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
		const timeScale = orcHandStateMachine ? orcHandStateMachine.timeScale : 1.0

		// 1. Hand Slap Physics
		if (data.handSlapped) {
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

					if (newWorldPos.z < MIN_FRONT_Z) {
						const xyDist = Math.sqrt(
							newWorldPos.x * newWorldPos.x + newWorldPos.y * newWorldPos.y
						)
						if (xyDist > 0.15) {
							newWorldPos.z = MIN_FRONT_Z
							newWorldPos.x *= 0.98
							newWorldPos.y *= 0.98
						} else {
							newWorldPos.z = MIN_FRONT_Z
						}
					}

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

// === Preview ===

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

	const miniScene = new THREE.Scene()
	miniScene.background = new THREE.Color(0x000011)
	miniScene.add(new THREE.AmbientLight(0xffffff, 0.4))
	const light = new THREE.DirectionalLight(0xffffff, 0.8)
	light.position.set(3, 3, 3)
	miniScene.add(light)

	const miniGroup = new THREE.Group()
	const miniCanvas = document.createElement("canvas")
	miniCanvas.width = 256
	miniCanvas.height = 128
	const miniCtx = miniCanvas.getContext("2d")
	miniCtx.fillStyle = "#000000"
	miniCtx.fillRect(0, 0, miniCanvas.width, miniCanvas.height)
	miniCtx.fillStyle = "#EAE9BD"
	miniCtx.strokeStyle = "#EAE9BD"
	miniCtx.lineWidth = 1
	drawAccurateContinents(miniCtx, miniCanvas.width, miniCanvas.height)

	const miniTexture = new THREE.CanvasTexture(miniCanvas)
	miniTexture.colorSpace = THREE.SRGBColorSpace
	miniTexture.wrapS = THREE.RepeatWrapping
	const miniPlanet = new THREE.Mesh(
		new THREE.SphereGeometry(0.3, 32, 32),
		new THREE.MeshBasicMaterial({ map: miniTexture })
	)
	miniGroup.add(miniPlanet)

	const ring1 = createOrbitalRing(0.8, 0.5, 0xff00ff)
	const ring2 = new THREE.Mesh(
		new THREE.TorusGeometry(0.6, 0.008, 8, 64),
		new THREE.MeshBasicMaterial({
			color: 0x00ffaa,
			transparent: true,
			opacity: 0.5,
		})
	)
	ring2.rotation.x = Math.PI / 2
	miniGroup.add(ring2)

	const satGeo = new THREE.SphereGeometry(0.04, 8, 8)
	const sat1 = new THREE.Mesh(
		satGeo,
		new THREE.MeshBasicMaterial({ color: 0xff00ff })
	)
	const sat2 = new THREE.Mesh(
		satGeo.clone(),
		new THREE.MeshBasicMaterial({ color: 0x00ffaa })
	)
	miniGroup.add(sat2)

	const geoOrbitGroupMini = new THREE.Group()
	geoOrbitGroupMini.add(ring1)
	geoOrbitGroupMini.add(sat1)
	geoOrbitGroupMini.rotation.x = Math.PI / 2
	geoOrbitGroupMini.rotation.z = Math.PI / 6
	miniGroup.add(geoOrbitGroupMini)
	miniScene.add(miniGroup)

	const aspect = width / height
	const miniCamera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100)
	miniCamera.position.set(0, 2.0, 1.5)
	miniCamera.lookAt(0, 0, 0)

	const miniRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
	miniRenderer.setSize(width, height)
	miniRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	container.appendChild(miniRenderer.domElement)

	let sat1Angle = 0
	let sat2Angle = Math.PI
	let previewAnimId = null
	let isRunning = true

	function animatePreview() {
		if (!isRunning) return
		sat1Angle += 0.008
		sat2Angle += 0.012
		sat1.position.set(Math.cos(sat1Angle) * 0.8, Math.sin(sat1Angle) * 0.5, 0)
		sat2.position.set(Math.cos(sat2Angle) * 0.6, 0, Math.sin(sat2Angle) * 0.6)
		miniPlanet.rotation.y += 0.002
		miniRenderer.render(miniScene, miniCamera)
		previewAnimId = requestAnimationFrame(animatePreview)
	}
	animatePreview()

	container.cleanup = () => {
		isRunning = false
		if (previewAnimId) cancelAnimationFrame(previewAnimId)
		miniGroup.traverse((child) => {
			if (child.geometry) child.geometry.dispose()
			if (child.material) {
				if (Array.isArray(child.material))
					child.material.forEach((m) => m.dispose())
				else child.material.dispose()
			}
		})
		miniRenderer.dispose()
	}
	return container
}

// Continent drawing helper (kept here as it's used by both scene and preview)
function drawAccurateContinents(ctx, width, height) {
	const w = width
	const h = height

	// North America
	ctx.beginPath()
	ctx.moveTo(w * 0.15, h * 0.15)
	ctx.bezierCurveTo(w * 0.2, h * 0.1, w * 0.3, h * 0.1, w * 0.35, h * 0.15) // Arctic
	ctx.lineTo(w * 0.32, h * 0.3) // East coast
	ctx.lineTo(w * 0.25, h * 0.45) // Florida/Mexico
	ctx.lineTo(w * 0.15, h * 0.35) // West coast
	ctx.lineTo(w * 0.1, h * 0.2) // Alaska
	ctx.closePath()
	ctx.fill()
	ctx.stroke()

	// South America
	ctx.beginPath()
	ctx.moveTo(w * 0.26, h * 0.46)
	ctx.lineTo(w * 0.35, h * 0.55) // Brazil
	ctx.lineTo(w * 0.32, h * 0.8) // Argentina
	ctx.lineTo(w * 0.28, h * 0.85) // Chile tip
	ctx.lineTo(w * 0.24, h * 0.6) // Peru/Andes
	ctx.closePath()
	ctx.fill()
	ctx.stroke()

	// Europe & Asia
	ctx.beginPath()
	ctx.moveTo(w * 0.45, h * 0.25) // Spain
	ctx.lineTo(w * 0.5, h * 0.15) // Scandinavia
	ctx.lineTo(w * 0.7, h * 0.12) // Russia
	ctx.lineTo(w * 0.85, h * 0.15) // Siberia
	ctx.lineTo(w * 0.9, h * 0.3) // China/Japan
	ctx.lineTo(w * 0.8, h * 0.45) // SE Asia
	ctx.lineTo(w * 0.7, h * 0.4) // India
	ctx.lineTo(w * 0.6, h * 0.42) // Middle East
	ctx.lineTo(w * 0.55, h * 0.35) // Turkey
	ctx.closePath()
	ctx.fill()
	ctx.stroke()

	// Africa
	ctx.beginPath()
	ctx.moveTo(w * 0.48, h * 0.35) // North Africa
	ctx.lineTo(w * 0.6, h * 0.38) // Horn of Africa
	ctx.lineTo(w * 0.55, h * 0.7) // South Africa
	ctx.lineTo(w * 0.48, h * 0.5) // West Africa
	ctx.closePath()
	ctx.fill()
	ctx.stroke()

	// Australia
	ctx.beginPath()
	ctx.moveTo(w * 0.8, h * 0.65)
	ctx.lineTo(w * 0.9, h * 0.65)
	ctx.lineTo(w * 0.92, h * 0.75)
	ctx.lineTo(w * 0.82, h * 0.78)
	ctx.closePath()
	ctx.fill()
	ctx.stroke()

	// Antarctica
	ctx.beginPath()
	ctx.moveTo(w * 0.1, h * 0.92)
	ctx.bezierCurveTo(w * 0.3, h * 0.88, w * 0.7, h * 0.88, w * 0.9, h * 0.92)
	ctx.lineTo(w * 0.9, h * 0.98)
	ctx.lineTo(w * 0.1, h * 0.98)
	ctx.closePath()
	ctx.fill()
	ctx.stroke()
}
