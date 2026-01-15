import * as THREE from "three"
import { GESTURES, HAND_ORBIT_CONFIG } from "./HandConfig.js"

// ============================================
// Gesture Animation
// ============================================

// Animation state (module-level for smooth transitions)
let gestureAnimationState = {
	hand: null,
	fromGesture: "fist",
	toGesture: "fist",
	progress: 1, // 0 = fromGesture, 1 = toGesture
	duration: 300,
}

export function transitionToGesture(hand, targetGesture, duration = 300) {
	if (!hand || !GESTURES[targetGesture]) return

	gestureAnimationState = {
		hand,
		fromGesture: hand.userData.currentGesture || "fist",
		toGesture: targetGesture,
		progress: 0,
		duration,
	}

	hand.userData.currentGesture = targetGesture
}

export function applyGesture(hand, gestureName) {
	const gesture = GESTURES[gestureName]
	if (!gesture || !hand.userData.fingers) return

	Object.keys(hand.userData.fingers).forEach((fingerName) => {
		const finger = hand.userData.fingers[fingerName]
		const fingerGesture = gesture[fingerName]
		if (!fingerGesture || !finger.userData.joints) return

		const joints = finger.userData.joints
		// Apply rotations to each joint pivot
		if (joints[0]) {
			joints[0].rotation.x = fingerGesture.proximal
			// Handle multi-axis rotation (e.g. for thumb abduction)
			joints[0].rotation.y = fingerGesture.proximalY || 0
			joints[0].rotation.z = fingerGesture.proximalZ || 0
		}
		if (joints[1]) joints[1].rotation.x = fingerGesture.middle
		if (joints[2]) joints[2].rotation.x = fingerGesture.distal
	})
}

function lerpGestures(hand, fromGesture, toGesture, t) {
	const from = GESTURES[fromGesture]
	const to = GESTURES[toGesture]
	if (!from || !to || !hand.userData.fingers) return

	Object.keys(hand.userData.fingers).forEach((fingerName) => {
		const finger = hand.userData.fingers[fingerName]
		const fromFinger = from[fingerName]
		const toFinger = to[fingerName]
		if (!fromFinger || !toFinger || !finger.userData.joints) return

		const joints = finger.userData.joints
		// Lerp each joint
		if (joints[0]) {
			joints[0].rotation.x =
				fromFinger.proximal + (toFinger.proximal - fromFinger.proximal) * t

			// Lerp extra axes
			const fromY = fromFinger.proximalY || 0
			const toY = toFinger.proximalY || 0
			joints[0].rotation.y = fromY + (toY - fromY) * t

			const fromZ = fromFinger.proximalZ || 0
			const toZ = toFinger.proximalZ || 0
			joints[0].rotation.z = fromZ + (toZ - fromZ) * t
		}
		if (joints[1]) {
			joints[1].rotation.x =
				fromFinger.middle + (toFinger.middle - fromFinger.middle) * t
		}
		if (joints[2]) {
			joints[2].rotation.x =
				fromFinger.distal + (toFinger.distal - fromFinger.distal) * t
		}
	})

	// Handle wrist rotation for backhand gesture
	const fromWrist = from.wristRotation || 0
	const toWrist = to.wristRotation || 0
	if (fromWrist !== toWrist) {
		// Find shortest rotation path
		let diff = toWrist - fromWrist
		if (diff > Math.PI) diff -= Math.PI * 2
		if (diff < -Math.PI) diff += Math.PI * 2
		hand.rotation.x = fromWrist + diff * t
	}
}

export function updateGestureAnimation(dt) {
	const state = gestureAnimationState
	if (!state.hand || state.progress >= 1) return

	state.progress += dt / state.duration
	const t = Math.min(state.progress, 1)

	// Smooth ease-in-out cubic
	const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

	// Use eased value for interpolation, but DON'T overwrite progress
	// (progress tracks linear 0→1 time, eased is just for smooth motion)
	lerpGestures(state.hand, state.fromGesture, state.toGesture, eased)

	if (t >= 1) {
		state.progress = 1
		applyGesture(state.hand, state.toGesture)
	}
}

// ============================================
// Plume Animation
// ============================================

export function updatePlumeAnimation(plume, intensity = 1, time = 0) {
	if (!plume || !plume.userData) return

	const t = time * 0.01

	// Flickering effect
	const flicker =
		0.7 +
		Math.sin(t * 3.7) * 0.15 +
		Math.sin(t * 7.3) * 0.1 +
		Math.random() * 0.05
	const scaledIntensity = intensity * flicker

	// Scale cones
	const scaleVal = 0.5 + scaledIntensity * 0.5
	plume.userData.innerCone.scale.setScalar(scaleVal)
	plume.userData.outerCone.scale.setScalar(scaleVal * 1.3)

	// Adjust light intensity
	plume.userData.light.intensity = scaledIntensity * 0.6

	// Pulse opacity
	plume.userData.innerCone.material.opacity = 0.6 + scaledIntensity * 0.4
	plume.userData.outerCone.material.opacity = 0.2 + scaledIntensity * 0.3

	// Show/hide based on intensity
	plume.visible = intensity > 0.05
}

// ============================================
// Free-Flying Hand Movement - Smooth and Graceful
// ============================================

// Camera view bounds (approximate visible area)
// Camera is at Z=6 looking at origin. Planet is at origin with radius 0.5.
// minZ must be positive to keep the hand in front of the planet from camera's perspective.
const VIEW_BOUNDS = {
	minX: -2.2,
	maxX: 2.2,
	minY: -1.2,
	maxY: 1.8,
	minZ: 0.6, // Changed from -1.8: hand must stay in front of planet (positive Z)
	maxZ: 2.2,
}

// Minimum Z value to stay in front of the planet from camera's perspective
const MIN_FRONT_Z = 0.5

// Generate smooth, free-flowing movement using layered sine waves
// No orbiting - just graceful, free-willed flight
export function calculateIrregularOrbitPosition(time, _currentPos = null) {
	// Convert to seconds for smoother calculations
	const t = time * 0.0001

	// Layer multiple slow sine waves for organic, flowing movement
	// Each axis uses different frequencies to avoid repetitive patterns

	// X-axis: slow sweeping left-right with subtle variations
	const x =
		Math.sin(t * 0.7) * 1.2 + // Primary slow sweep
		Math.sin(t * 0.31) * 0.5 + // Secondary variation
		Math.sin(t * 0.13) * 0.3 // Tertiary drift

	// Y-axis: gentle up-down bobbing
	const y =
		Math.sin(t * 0.53) * 0.5 + // Primary bob
		Math.sin(t * 0.23) * 0.3 + // Secondary wave
		Math.cos(t * 0.11) * 0.2 + // Slow drift
		0.3 // Slight upward bias

	// Z-axis: forward-back movement, ALWAYS staying in front of planet
	// Use abs() on cosine to keep positive, then add forward bias
	const zBase =
		Math.abs(Math.cos(t * 0.47)) * 0.6 + // Primary depth (always positive)
		Math.abs(Math.sin(t * 0.19)) * 0.3 + // Variation (always positive)
		1.0 // Strong forward bias (toward camera)

	const targetPos = new THREE.Vector3(x, y, zBase)

	// Keep within camera view bounds
	targetPos.x = Math.max(
		VIEW_BOUNDS.minX,
		Math.min(VIEW_BOUNDS.maxX, targetPos.x)
	)
	targetPos.y = Math.max(
		VIEW_BOUNDS.minY,
		Math.min(VIEW_BOUNDS.maxY, targetPos.y)
	)
	targetPos.z = Math.max(
		VIEW_BOUNDS.minZ,
		Math.min(VIEW_BOUNDS.maxZ, targetPos.z)
	)

	// Ensure minimum distance from planet AND stay in front
	clampToFrontOfPlanet(targetPos)

	return targetPos
}

export function avoidSatellites(
	handPosition,
	satellites,
	avoidanceRadius = HAND_ORBIT_CONFIG.avoidanceRadius
) {
	const avoidanceVector = new THREE.Vector3()

	if (!satellites || satellites.length === 0) return avoidanceVector

	satellites.forEach((sat) => {
		if (!sat || sat.userData.decommissioning) return // Don't avoid target

		const satPos = new THREE.Vector3()
		sat.getWorldPosition(satPos)

		const toHand = handPosition.clone().sub(satPos)
		const distance = toHand.length()

		if (distance < avoidanceRadius && distance > 0) {
			// Push away from satellite
			const strength = (avoidanceRadius - distance) / avoidanceRadius
			avoidanceVector.add(toHand.normalize().multiplyScalar(strength * 0.08))
		}
	})

	return avoidanceVector
}

// Avoid flying through the planet
export function avoidPlanet(
	position,
	minDistance = HAND_ORBIT_CONFIG.minPlanetDistance
) {
	const avoidanceVector = new THREE.Vector3()
	const distanceFromCenter = position.length()

	if (distanceFromCenter < minDistance && distanceFromCenter > 0) {
		// Push away from planet center
		const pushStrength = (minDistance - distanceFromCenter) / minDistance
		const pushDirection = position.clone().normalize()
		avoidanceVector.add(pushDirection.multiplyScalar(pushStrength * 0.2))
	}

	return avoidanceVector
}

// Ensure a position stays outside the planet
export function clampOutsidePlanet(
	position,
	minDistance = HAND_ORBIT_CONFIG.minPlanetDistance
) {
	const distanceFromCenter = position.length()
	if (distanceFromCenter < minDistance) {
		if (distanceFromCenter < 0.0001) {
			position.set(0, minDistance, 0)
		} else {
			position.normalize().multiplyScalar(minDistance)
		}
	}
	return position
}

// Clamp position to stay outside planet surface (allows going behind planet)
// Used for LEO punch animation where hand needs to go behind satellite
export function clampToPlanetSurface(
	position,
	buffer = 0.1
) {
	const planetRadius = HAND_ORBIT_CONFIG.planetRadius
	const dist = position.length()
	if (dist < planetRadius + buffer) {
		if (dist < 0.0001) {
			position.set(0, 0, planetRadius + buffer)
		} else {
			position.normalize().multiplyScalar(planetRadius + buffer)
		}
	}
	return position
}

// Ensure a position stays in front of the planet from camera's perspective
// Camera is at Z=6 looking at origin. Negative Z values put objects behind the planet.
// This function ensures the hand never goes behind the planet and stays visible.
export function clampToFrontOfPlanet(
	position,
	minDistance = HAND_ORBIT_CONFIG.minPlanetDistance
) {
	// First ensure minimum distance from planet center
	const distanceFromCenter = position.length()
	if (distanceFromCenter < minDistance) {
		if (distanceFromCenter < 0.0001) {
			// At origin - push to front
			position.set(0, 0, minDistance)
		} else {
			position.normalize().multiplyScalar(minDistance)
		}
	}

	// Now ensure Z stays positive (in front of planet from camera's perspective)
	// If Z is negative or too close to zero, push to front while maintaining XY
	if (position.z < MIN_FRONT_Z) {
		const xyDist = Math.sqrt(position.x * position.x + position.y * position.y)

		// If position is close to the planet center in XY, we need to push out in Z
		if (xyDist < minDistance * 0.8) {
			// Push straight forward to maintain minimum distance
			const requiredZ = Math.sqrt(
				Math.max(0, minDistance * minDistance - xyDist * xyDist)
			)
			position.z = Math.max(MIN_FRONT_Z, requiredZ)
		} else {
			// XY is far enough, just clamp Z to minimum
			position.z = MIN_FRONT_Z
		}
	}

	return position
}
