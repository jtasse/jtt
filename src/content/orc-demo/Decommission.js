import * as THREE from "three"
import {
	HandState,
	GEO_PUNCH_CONFIG,
	LEO_FLICK_CONFIG,
	MOL_SLAP_CONFIG,
} from "../../hand/HandConfig.js"
import {
	orcHandStateMachine,
	orcHand,
	orcGroup,
	planet,
	surfaceMarker,
	surfaceCircle,
	hideGeoTether,
	LEO_ORBIT_RADIUS,
	EXOSPHERE_RADIUS,
} from "./OrcScene.js"

// Decommission animation configuration
export const DECOMMISSION_CONFIG = {
	approachDurationBase: 6000,
	approachDurationPerUnit: 3000,
	burnDuration: 5000,
	slowMotionFactor: 0.3,
	cameraZoomDistanceFar: 3.0,
	cameraZoomDistanceClose: 0.8,
	cameraApproachSpeed: 0.012,
	cameraQuickZoomSpeed: 0.04,
	cameraResetSpeed: 0.03,
}

let activeDecommission = null

export function getDecommissionConfig() {
	return DECOMMISSION_CONFIG
}

export function getDecommissionState() {
	const handInDecommissionState =
		orcHandStateMachine &&
		(orcHandStateMachine.state === HandState.POINTING ||
			orcHandStateMachine.state === HandState.APPROACHING ||
			orcHandStateMachine.state === HandState.WINDING_UP ||
			orcHandStateMachine.state === HandState.CONTACTING ||
			orcHandStateMachine.state === HandState.CELEBRATING ||
			orcHandStateMachine.state === HandState.THUMBS_UP ||
			orcHandStateMachine.state === HandState.RETURNING)

	if (!activeDecommission && !handInDecommissionState) return null

	const sat = activeDecommission
	const data = sat?.userData
	const smoothEase = (t) =>
		t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

	const trackingPosition = new THREE.Vector3()
	let phase = "approach"
	let burnProgress = 0
	let inBurnPhase = false

	if (orcHandStateMachine && orcHand) {
		const handState = orcHandStateMachine.state
		orcHand.getWorldPosition(trackingPosition)

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
			case HandState.CONTACTING:
			case HandState.CELEBRATING:
			case HandState.THUMBS_UP:
				phase = "burning"
				inBurnPhase = true
				if (data?.burnStartTime) {
					const burnElapsed = performance.now() - data.burnStartTime
					burnProgress = Math.min(burnElapsed / 3000, 1)
				} else {
					burnProgress = 1
				}
				break
			case HandState.RETURNING:
				phase = "returning"
				inBurnPhase = false
				break
		}
	} else if (sat) {
		sat.getWorldPosition(trackingPosition)
	}

	const distance = trackingPosition.length()
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

	let cameraOffset = null
	let cameraLookAt = null
	let cameraDistance = null

	// Get celebration config based on decommission type
	const getCelebrationConfig = () => {
		if (orcHandStateMachine?.stateData?.isGeoPunch) {
			return GEO_PUNCH_CONFIG.celebration
		} else if (orcHandStateMachine?.stateData?.isLeoFlick) {
			return LEO_FLICK_CONFIG.celebration
		} else {
			return MOL_SLAP_CONFIG.celebration
		}
	}

	const handState = orcHandStateMachine?.state

	// Check celebration state FIRST (applies to all decommission types)
	if (
		handState === HandState.CELEBRATING ||
		handState === HandState.THUMBS_UP
	) {
		const celebConfig = getCelebrationConfig()
		cameraSpeed = celebConfig.cameraSpeed
		cameraOffset = celebConfig.cameraOffset
		cameraDistance = celebConfig.cameraDistance
		cameraLookAt = celebConfig.cameraLookAt
	} else if (orcHandStateMachine?.stateData?.isGeoPunch) {
		// GEO Punch camera handling
		const stage = orcHandStateMachine.stateData.geoPunchStage

		if (
			handState === HandState.POINTING ||
			handState === HandState.APPROACHING
		) {
			cameraSpeed = GEO_PUNCH_CONFIG.approachCameraSpeed || 0.02
			cameraOffset = GEO_PUNCH_CONFIG.approachCameraOffset
			cameraDistance = GEO_PUNCH_CONFIG.approachCameraDistance
			cameraLookAt = GEO_PUNCH_CONFIG.approachCameraLookAt
		} else if (
			stage === "PULL_BACK" ||
			stage === "POSITION_HOLD" ||
			handState === HandState.WINDING_UP
		) {
			// Include WINDING_UP state check to handle first frame before stage is set
			cameraSpeed = GEO_PUNCH_CONFIG.windUpCameraSpeed
			cameraOffset = GEO_PUNCH_CONFIG.windUpCameraOffset
			cameraDistance = GEO_PUNCH_CONFIG.windUpCameraDistance
			cameraLookAt = GEO_PUNCH_CONFIG.windUpCameraLookAt
		} else if (stage === "PUNCH") {
			cameraSpeed = GEO_PUNCH_CONFIG.punchCameraSpeed
			cameraOffset = GEO_PUNCH_CONFIG.punchCameraOffset
			cameraDistance = GEO_PUNCH_CONFIG.punchCameraDistance
			cameraLookAt = GEO_PUNCH_CONFIG.punchCameraLookAt
		} else if (stage === "FOLLOW_THROUGH") {
			cameraSpeed = GEO_PUNCH_CONFIG.followThroughCameraSpeed
			cameraOffset = GEO_PUNCH_CONFIG.followThroughCameraOffset
			cameraDistance = GEO_PUNCH_CONFIG.followThroughCameraDistance
			cameraLookAt = GEO_PUNCH_CONFIG.followThroughCameraLookAt
		}
	} else if (orcHandStateMachine?.stateData?.isLeoFlick) {
		// LEO Flick camera handling
		const config = LEO_FLICK_CONFIG

		if (
			handState === HandState.POINTING ||
			handState === HandState.APPROACHING
		) {
			cameraSpeed = config.approachCameraSpeed
			cameraOffset = config.approachCameraOffset
			cameraDistance = config.approachCameraDistance
			cameraLookAt = config.approachCameraLookAt
		} else if (handState === HandState.WINDING_UP) {
			// PREPARING phase for LEO
			cameraSpeed = config.preparingCameraSpeed
			cameraOffset = config.preparingCameraOffset
			cameraDistance = config.preparingCameraDistance
			cameraLookAt = config.preparingCameraLookAt
		} else if (handState === HandState.CONTACTING) {
			// FLICKING phase for LEO
			cameraSpeed = config.flickingCameraSpeed
			cameraOffset = config.flickingCameraOffset
			cameraDistance = config.flickingCameraDistance
			cameraLookAt = config.flickingCameraLookAt
		}
	} else {
		// Molniya Slap camera handling (default for non-GEO, non-LEO)
		const config = MOL_SLAP_CONFIG

		if (
			handState === HandState.POINTING ||
			handState === HandState.APPROACHING
		) {
			cameraSpeed = config.approachCameraSpeed
			cameraOffset = config.approachCameraOffset
			cameraDistance = config.approachCameraDistance
			cameraLookAt = config.approachCameraLookAt
		} else if (handState === HandState.WINDING_UP) {
			cameraSpeed = config.windUpCameraSpeed
			cameraOffset = config.windUpCameraOffset
			cameraDistance = config.windUpCameraDistance
			cameraLookAt = config.windUpCameraLookAt
		} else if (handState === HandState.CONTACTING) {
			cameraSpeed = config.slapCameraSpeed
			cameraOffset = config.slapCameraOffset
			cameraDistance = config.slapCameraDistance
			cameraLookAt = config.slapCameraLookAt
		}
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
		isGeoPunch: orcHandStateMachine?.stateData?.isGeoPunch === true,
		cameraOffset,
		cameraDistance,
		cameraLookAt,
	}
}

export function startDecommission(satellite) {
	if (!satellite || satellite.userData.decommissioning) return false

	// Prevent starting a new decommission if one is already in progress
	if (activeDecommission) {
		console.warn(
			"[Decommission] Cannot start - another decommission is in progress",
		)
		return false
	}

	// Check if hand state machine is ready
	if (orcHandStateMachine && orcHandStateMachine.state !== "IDLE_ORBIT") {
		console.warn("[Decommission] Cannot start - hand not in IDLE_ORBIT state")
		return false
	}

	const data = satellite.userData
	activeDecommission = satellite
	data.decommissioning = true
	data.decommissionStartTime = Date.now()

	// GEO satellites: Don't auto-approach, wait for hand to punch
	if (data.isGeosynchronous) {
		data.waitForPunch = true
	}

	if (data.isGeosynchronous) {
		hideGeoTether()
		if (surfaceMarker) surfaceMarker.visible = false
		if (surfaceCircle) surfaceCircle.visible = false

		const worldPos = new THREE.Vector3()
		satellite.getWorldPosition(worldPos)
		planet.remove(satellite)
		orcGroup.add(satellite)
		orcGroup.worldToLocal(worldPos)
		satellite.position.copy(worldPos)

		const radiusXZ = Math.sqrt(
			worldPos.x * worldPos.x + worldPos.z * worldPos.z,
		)
		data.orbitRadius = radiusXZ
		data.orbitY = worldPos.y
		data.angle = Math.atan2(worldPos.z, worldPos.x)
		data.orbitSpeed = 0.001
		data.originalWorldPos = worldPos.clone()
	}

	if (data.eccentricity) {
		data.originalAngle = data.angle
	} else if (data.orbitRadiusX) {
		data.originalOrbitRadiusX = data.orbitRadiusX
		data.originalOrbitRadiusZ = data.orbitRadiusZ
	} else if (data.orbitRadius) {
		data.originalOrbitRadius = data.orbitRadius
	}
	data.originalOrbitSpeed = data.orbitSpeed

	if (orcHandStateMachine) {
		const started = orcHandStateMachine.startDecommission(satellite)
		if (!started) {
			// Hand state machine rejected the decommission, reset state
			data.decommissioning = false
			activeDecommission = null
			console.warn("[Decommission] Hand state machine rejected start")
			return false
		}
	}

	return true
}

export function cancelDecommission(satellite) {
	if (!satellite || !satellite.userData.decommissioning) return false
	if (orcHandStateMachine && !orcHandStateMachine.canCancel()) return false

	const data = satellite.userData
	if (orcHandStateMachine) {
		const cancelled = orcHandStateMachine.cancel()
		if (!cancelled) return false
	}

	data.decommissioning = false
	data.returning = true
	data.returnStartTime = Date.now()

	const worldPos = new THREE.Vector3()
	satellite.getWorldPosition(worldPos)

	let originalRadius
	if (data.eccentricity && data.semiMajorAxis) {
		const a = data.semiMajorAxis
		const e = data.eccentricity
		const theta = data.angle || 0
		originalRadius = (a * (1 - e * e)) / (1 + e * Math.cos(theta))
		data.returnStartRadiusMultiplier =
			satellite.position.length() / originalRadius
	} else if (data.originalOrbitRadius) {
		originalRadius = data.originalOrbitRadius
		data.returnStartRadiusMultiplier = worldPos.length() / originalRadius
	} else if (data.originalOrbitRadiusX) {
		originalRadius = data.originalOrbitRadiusX
		data.returnStartRadiusMultiplier = worldPos.length() / originalRadius
	} else {
		originalRadius = LEO_ORBIT_RADIUS
		data.returnStartRadiusMultiplier = 1
	}

	data.returnDuration = 2000
	disposeFlameTrail(satellite)
	if (activeDecommission === satellite) activeDecommission = null
	return true
}

export function canCancelDecommission(satellite) {
	if (!satellite || !satellite.userData.decommissioning) return false
	if (orcHandStateMachine) return orcHandStateMachine.canCancel()
	return false
}

export function clearActiveDecommission(satellite) {
	if (activeDecommission === satellite) activeDecommission = null
}

// === Flame Trail Effects ===

export function createFlameTrail(satellite) {
	const flameGroup = new THREE.Group()
	flameGroup.name = "flameTrail"
	const flameCount = 8
	const flames = []

	for (let i = 0; i < flameCount; i++) {
		const flameGeometry = new THREE.ConeGeometry(
			0.02 + i * 0.008,
			0.08 + i * 0.02,
			8,
		)
		const flameMaterial = new THREE.MeshBasicMaterial({
			color: new THREE.Color().setHSL(0.08 - i * 0.01, 1, 0.5 + i * 0.05),
			transparent: true,
			opacity: 0.9 - i * 0.08,
			blending: THREE.AdditiveBlending,
			depthWrite: false,
		})
		const flame = new THREE.Mesh(flameGeometry, flameMaterial)
		flame.rotation.x = Math.PI
		flame.position.z = 0.03 + i * 0.025
		flame.visible = false
		flame.userData = {
			baseScale: 1 + i * 0.3,
			phaseOffset: i * 0.5,
			baseOpacity: 0.9 - i * 0.08,
		}
		flames.push(flame)
		flameGroup.add(flame)
	}

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
	satellite.add(flameGroup)
	return { group: flameGroup, flames, glow }
}

export function updateFlameTrail(
	satellite,
	burnProgress,
	orbitDirection,
	currentDistance,
) {
	const data = satellite.userData
	if (!data.flameParticles) return

	const { group, flames, glow } = data.flameParticles
	const time = Date.now() * 0.01
	const inExosphere = currentDistance <= EXOSPHERE_RADIUS
	const burning =
		inExosphere && (data.reachedExosphere || data.startedInExosphere)

	flames.forEach((flame) => {
		flame.visible = burning
		if (burning) {
			const { baseScale, phaseOffset, baseOpacity } = flame.userData
			const flicker = 0.7 + Math.sin(time + phaseOffset) * 0.3
			const intensityScale = 0.5 + burnProgress * 1.5
			flame.scale.setScalar(baseScale * flicker * intensityScale)
			flame.material.opacity =
				baseOpacity * (0.3 + burnProgress * 0.7) * flicker
			const hue = 0.08 - burnProgress * 0.03
			const lightness = 0.5 + burnProgress * 0.3
			flame.material.color.setHSL(hue, 1, lightness)
		}
	})

	if (glow) {
		glow.visible = burning
		if (burning) {
			glow.material.opacity = burnProgress * 0.6
			glow.scale.setScalar(1 + burnProgress * 2)
			glow.material.opacity *= 0.8 + Math.sin(time * 2) * 0.2
		}
	}

	if (burning && orbitDirection) {
		group.lookAt(group.position.clone().sub(orbitDirection))
	}
}

export function disposeFlameTrail(satellite) {
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
	if (group.parent) group.parent.remove(group)
	data.flameParticles = null
}
