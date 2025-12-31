/**
 * Hand of ORC - Orbital Refuse Collector's robotic hand
 * Industrial/mechanical style with 5 fingers, propulsion plume, and gesture animations
 */

import * as THREE from "three"

// ============================================
// Configuration
// ============================================

// Hand size relative to satellite (satellites are ~0.08 units)
const SATELLITE_SIZE = 0.08
// CONFIGURABLE: Change this value to adjust hand size (default 7 = 7x satellite size)
export const HAND_SCALE_FACTOR = 7
const HAND_SIZE = SATELLITE_SIZE * HAND_SCALE_FACTOR // ~0.56 units

// Hand component sizes relative to HAND_SIZE
const PALM_WIDTH = HAND_SIZE * 0.7
const PALM_HEIGHT = HAND_SIZE * 0.45
const PALM_DEPTH = HAND_SIZE * 0.12

const FINGER_WIDTH = HAND_SIZE * 0.09
const FINGER_SEGMENT_LENGTH = HAND_SIZE * 0.18
const THUMB_SEGMENT_LENGTH = HAND_SIZE * 0.14
const JOINT_RADIUS = FINGER_WIDTH * 0.6

// Orbit configuration
// CONFIGURABLE: Adjust these values to change hand orbit behavior
export const HAND_ORBIT_CONFIG = {
	baseRadius: 1.5, // Average distance from Earth (outside satellite orbits)
	radiusVariation: 0.2, // How much radius varies
	baseSpeed: 0.0004, // CONFIGURABLE: Base angular velocity (lower = slower orbit)
	speedVariation: 0.0002, // Speed fluctuation
	inclinationBase: 0.35, // Base orbit tilt (radians)
	inclinationVariation: 0.2,
	noiseFrequency: 0.0002, // How fast the irregularity changes
	avoidanceRadius: 0.35, // Distance to start avoiding satellites
	planetRadius: 0.5, // Planet radius for collision avoidance
	minPlanetDistance: 0.7, // Minimum distance from planet center
}

// Sequence timing (ms)
export const SEQUENCE_TIMINGS = {
	pointDuration: 800, // Time to point at satellite
	pointPause: 400, // Pause while pointing
	approachDuration: 2000, // Time to fly to satellite
	grabDuration: 500, // Time for pinch gesture
	carryDuration: 1500, // Time to carry to exosphere
	releaseDuration: 300, // Time to open hand
	windUpDuration: 600, // Time to wind up slap
	slapDuration: 200, // Time for slap motion
	burnDuration: 3000, // Satellite burn time (slow-mo)
	celebrateDuration: 1200, // Thumbs up duration
	returnDuration: 2000, // Time to return to orbit
}

// Slow motion factor during burn phase (matches existing decommission)
export const SLAP_SLOW_MOTION_FACTOR = 0.3

// ============================================
// Gesture Definitions
// ============================================

// Each gesture defines rotation angles (radians) for each joint
// proximal = knuckle, middle = first bend, distal = fingertip bend
export const GESTURES = {
	fist: {
		thumb: { proximal: 0.8, middle: 0.9, distal: 0.7 },
		index: { proximal: 1.4, middle: 1.3, distal: 1.1 },
		middle: { proximal: 1.4, middle: 1.3, distal: 1.1 },
		ring: { proximal: 1.4, middle: 1.3, distal: 1.1 },
		pinky: { proximal: 1.4, middle: 1.3, distal: 1.1 },
		wristRotation: 0,
	},

	point: {
		thumb: { proximal: 0.8, middle: 0.9, distal: 0.7 }, // curled
		index: { proximal: 0, middle: 0, distal: 0 }, // extended
		middle: { proximal: 1.4, middle: 1.3, distal: 1.1 }, // curled
		ring: { proximal: 1.4, middle: 1.3, distal: 1.1 },
		pinky: { proximal: 1.4, middle: 1.3, distal: 1.1 },
		wristRotation: 0,
	},

	pinch: {
		// OK gesture - thumb + index touching
		thumb: { proximal: 0.5, middle: 0.5, distal: 0.4 }, // partially curled toward index
		index: { proximal: 0.5, middle: 0.5, distal: 0.4 }, // partially curled toward thumb
		middle: { proximal: 0, middle: 0.1, distal: 0.1 }, // extended
		ring: { proximal: 0, middle: 0.1, distal: 0.1 },
		pinky: { proximal: 0, middle: 0.1, distal: 0.1 },
		wristRotation: 0,
	},

	flat: {
		thumb: { proximal: -0.3, middle: 0, distal: 0 }, // spread out
		index: { proximal: 0, middle: 0, distal: 0 },
		middle: { proximal: 0, middle: 0, distal: 0 },
		ring: { proximal: 0, middle: 0, distal: 0 },
		pinky: { proximal: 0, middle: 0, distal: 0 },
		wristRotation: 0,
	},

	backhand: {
		// Same as flat but with wrist rotation for slapping
		thumb: { proximal: -0.3, middle: 0, distal: 0 },
		index: { proximal: 0, middle: 0, distal: 0 },
		middle: { proximal: 0, middle: 0, distal: 0 },
		ring: { proximal: 0, middle: 0, distal: 0 },
		pinky: { proximal: 0, middle: 0, distal: 0 },
		wristRotation: Math.PI, // 180 degree flip
	},

	thumbsUp: {
		thumb: { proximal: -0.4, middle: -0.1, distal: 0 }, // extended up
		index: { proximal: 1.4, middle: 1.3, distal: 1.1 },
		middle: { proximal: 1.4, middle: 1.3, distal: 1.1 },
		ring: { proximal: 1.4, middle: 1.3, distal: 1.1 },
		pinky: { proximal: 1.4, middle: 1.3, distal: 1.1 },
		wristRotation: 0,
	},
}

// ============================================
// State Machine
// ============================================

export const HandState = {
	IDLE_ORBIT: "IDLE_ORBIT", // Orbiting Earth, fist gesture
	POINTING: "POINTING", // Pointing at target satellite
	APPROACHING: "APPROACHING", // Flying toward satellite
	GRABBING: "GRABBING", // Pinch gesture, holding satellite
	CARRYING: "CARRYING", // Moving toward Earth with satellite
	RELEASING: "RELEASING", // Opening hand at exosphere
	WINDING_UP: "WINDING_UP", // Winding up for slap
	SLAPPING: "SLAPPING", // Backhand slap motion
	CELEBRATING: "CELEBRATING", // Thumbs up
	RETURNING: "RETURNING", // Return to idle orbit
	CANCELLED: "CANCELLED", // Cancel sequence, return satellite
}

// States where cancel is allowed
const CANCELLABLE_STATES = [
	HandState.POINTING,
	HandState.APPROACHING,
	HandState.GRABBING,
	HandState.CARRYING,
	HandState.RELEASING,
	HandState.WINDING_UP,
]

// ============================================
// Materials (Industrial/Mechanical Style)
// ============================================

function createHandMaterials() {
	// Main metal body - dark gunmetal
	const metalMaterial = new THREE.MeshStandardMaterial({
		color: 0x3a3a42,
		metalness: 0.85,
		roughness: 0.25,
	})

	// Joint material - darker, more worn
	const jointMaterial = new THREE.MeshStandardMaterial({
		color: 0x2a2a30,
		metalness: 0.7,
		roughness: 0.4,
	})

	// Accent/piston material - brass/copper tones
	const accentMaterial = new THREE.MeshStandardMaterial({
		color: 0x8b7355,
		metalness: 0.9,
		roughness: 0.2,
	})

	// Rivet material - darker steel
	const rivetMaterial = new THREE.MeshStandardMaterial({
		color: 0x222228,
		metalness: 0.95,
		roughness: 0.15,
	})

	// Plume materials
	const plumeInnerMaterial = new THREE.MeshBasicMaterial({
		color: 0x4488ff,
		transparent: true,
		opacity: 0.9,
	})

	const plumeOuterMaterial = new THREE.MeshBasicMaterial({
		color: 0x2266dd,
		transparent: true,
		opacity: 0.4,
		blending: THREE.AdditiveBlending,
		depthWrite: false,
	})

	return {
		metal: metalMaterial,
		joint: jointMaterial,
		accent: accentMaterial,
		rivet: rivetMaterial,
		plumeInner: plumeInnerMaterial,
		plumeOuter: plumeOuterMaterial,
	}
}

// ============================================
// Geometry Creation
// ============================================

function createFinger(config, materials) {
	const fingerGroup = new THREE.Group()
	fingerGroup.name = config.name

	const isThumb = config.name === "thumb"
	const segmentLength = isThumb ? THUMB_SEGMENT_LENGTH : FINGER_SEGMENT_LENGTH
	const segments = isThumb ? 2 : 3

	// Create segments with joints
	let currentGroup = fingerGroup
	const joints = []

	for (let i = 0; i < segments; i++) {
		// Joint sphere (knuckle/bend point)
		const jointGeo = new THREE.SphereGeometry(JOINT_RADIUS, 8, 8)
		const joint = new THREE.Mesh(jointGeo, materials.joint)
		joint.name = `${config.name}_joint_${i}`
		currentGroup.add(joint)

		// Create a pivot group for this segment
		const segmentPivot = new THREE.Group()
		segmentPivot.name = `${config.name}_pivot_${i}`
		joint.add(segmentPivot)
		joints.push(segmentPivot)

		// Finger segment (phalanx)
		const phalanxGeo = new THREE.CylinderGeometry(
			FINGER_WIDTH * 0.4,
			FINGER_WIDTH * 0.45,
			segmentLength,
			8
		)
		const phalanx = new THREE.Mesh(phalanxGeo, materials.metal)
		phalanx.position.y = segmentLength / 2
		phalanx.name = `${config.name}_phalanx_${i}`
		segmentPivot.add(phalanx)

		// Add piston detail on sides (industrial look)
		if (i < segments - 1) {
			const pistonGeo = new THREE.CylinderGeometry(
				FINGER_WIDTH * 0.15,
				FINGER_WIDTH * 0.15,
				segmentLength * 0.6,
				6
			)
			const pistonL = new THREE.Mesh(pistonGeo, materials.accent)
			pistonL.position.set(FINGER_WIDTH * 0.35, segmentLength / 2, 0)
			segmentPivot.add(pistonL)

			const pistonR = new THREE.Mesh(pistonGeo, materials.accent)
			pistonR.position.set(-FINGER_WIDTH * 0.35, segmentLength / 2, 0)
			segmentPivot.add(pistonR)
		}

		// Create group for next segment at end of this one
		const nextJointPos = new THREE.Group()
		nextJointPos.position.y = segmentLength
		segmentPivot.add(nextJointPos)
		currentGroup = nextJointPos
	}

	// Fingertip cap with glowing light
	const tipGeo = new THREE.SphereGeometry(FINGER_WIDTH * 0.4, 8, 8)
	const tip = new THREE.Mesh(tipGeo, materials.metal)
	currentGroup.add(tip)

	// Add glowing light at fingertip for visibility
	const tipLightGeo = new THREE.SphereGeometry(FINGER_WIDTH * 0.25, 8, 8)
	const tipLightMaterial = new THREE.MeshBasicMaterial({
		color: 0x00ffff,
		transparent: true,
		opacity: 0.8,
	})
	const tipLightMesh = new THREE.Mesh(tipLightGeo, tipLightMaterial)
	tipLightMesh.position.y = FINGER_WIDTH * 0.1
	tip.add(tipLightMesh)

	// Add point light at fingertip
	const tipLight = new THREE.PointLight(0x00ffff, 0.3, 0.5)
	tipLight.position.y = FINGER_WIDTH * 0.1
	tip.add(tipLight)

	// Store joint references for animation
	fingerGroup.userData = {
		joints: joints, // Array of pivot groups: [proximal, middle, distal]
		name: config.name,
		tipLight: tipLight,
		tipLightMesh: tipLightMesh,
	}

	// Position finger on palm
	fingerGroup.position.set(config.position[0], config.position[1], config.position[2])
	fingerGroup.rotation.set(config.rotation[0], config.rotation[1], config.rotation[2])

	return fingerGroup
}

function createPalm(materials) {
	const palmGroup = new THREE.Group()
	palmGroup.name = "palm"

	// Main palm body
	const palmGeo = new THREE.BoxGeometry(PALM_WIDTH, PALM_HEIGHT, PALM_DEPTH)
	const palm = new THREE.Mesh(palmGeo, materials.metal)
	palmGroup.add(palm)

	// Add industrial details - rivets along edges
	const rivetGeo = new THREE.SphereGeometry(PALM_DEPTH * 0.15, 6, 6)
	const rivetPositions = [
		[-PALM_WIDTH * 0.4, PALM_HEIGHT * 0.35, PALM_DEPTH * 0.5],
		[PALM_WIDTH * 0.4, PALM_HEIGHT * 0.35, PALM_DEPTH * 0.5],
		[-PALM_WIDTH * 0.4, -PALM_HEIGHT * 0.35, PALM_DEPTH * 0.5],
		[PALM_WIDTH * 0.4, -PALM_HEIGHT * 0.35, PALM_DEPTH * 0.5],
		[-PALM_WIDTH * 0.4, PALM_HEIGHT * 0.35, -PALM_DEPTH * 0.5],
		[PALM_WIDTH * 0.4, PALM_HEIGHT * 0.35, -PALM_DEPTH * 0.5],
		[-PALM_WIDTH * 0.4, -PALM_HEIGHT * 0.35, -PALM_DEPTH * 0.5],
		[PALM_WIDTH * 0.4, -PALM_HEIGHT * 0.35, -PALM_DEPTH * 0.5],
	]

	rivetPositions.forEach((pos) => {
		const rivet = new THREE.Mesh(rivetGeo, materials.rivet)
		rivet.position.set(pos[0], pos[1], pos[2])
		palmGroup.add(rivet)
	})

	// Add knuckle plate (top of palm)
	const knucklePlateGeo = new THREE.BoxGeometry(PALM_WIDTH * 0.9, PALM_HEIGHT * 0.15, PALM_DEPTH * 1.1)
	const knucklePlate = new THREE.Mesh(knucklePlateGeo, materials.accent)
	knucklePlate.position.y = PALM_HEIGHT * 0.35
	palmGroup.add(knucklePlate)

	return palmGroup
}

function createWristWithPlume(materials) {
	const wristGroup = new THREE.Group()
	wristGroup.name = "wrist"

	// Wrist joint
	const wristJointGeo = new THREE.CylinderGeometry(
		PALM_DEPTH * 0.8,
		PALM_DEPTH * 0.9,
		PALM_WIDTH * 0.3,
		12
	)
	const wristJoint = new THREE.Mesh(wristJointGeo, materials.joint)
	wristJoint.rotation.z = Math.PI / 2
	wristJoint.position.y = -PALM_HEIGHT * 0.35
	wristGroup.add(wristJoint)

	// Forearm section
	const forearmGeo = new THREE.BoxGeometry(PALM_WIDTH * 0.6, PALM_HEIGHT * 0.6, PALM_DEPTH * 1.2)
	const forearm = new THREE.Mesh(forearmGeo, materials.metal)
	forearm.position.y = -PALM_HEIGHT * 0.65
	wristGroup.add(forearm)

	// Thruster housing - positioned at bottom of wrist (opposite to fingers)
	// When hand points with index finger, thruster points opposite direction
	const thrusterHousingGeo = new THREE.CylinderGeometry(
		PALM_DEPTH * 0.8,
		PALM_DEPTH * 1.0,
		PALM_HEIGHT * 0.35,
		12
	)
	const thrusterHousing = new THREE.Mesh(thrusterHousingGeo, materials.accent)
	// Position at bottom of forearm, pointing down (-Y direction)
	thrusterHousing.position.set(0, -PALM_HEIGHT * 1.0, 0)
	// No rotation needed - cylinder already points along Y axis
	wristGroup.add(thrusterHousing)

	// Create propulsion plume - pointing down from wrist (opposite to fingers)
	const plumeGroup = createPropulsionPlume(materials)
	plumeGroup.position.set(0, -PALM_HEIGHT * 1.2, 0)
	// Rotate plume to point downward (-Y direction)
	plumeGroup.rotation.x = Math.PI / 2
	wristGroup.add(plumeGroup)

	wristGroup.userData.plume = plumeGroup

	return wristGroup
}

function createPropulsionPlume(materials) {
	const plumeGroup = new THREE.Group()
	plumeGroup.name = "propulsionPlume"

	// Inner bright core
	const innerConeGeo = new THREE.ConeGeometry(PALM_DEPTH * 0.4, PALM_HEIGHT * 0.6, 12)
	const innerCone = new THREE.Mesh(innerConeGeo, materials.plumeInner)
	innerCone.rotation.x = -Math.PI / 2 // Point backward
	innerCone.position.z = -PALM_HEIGHT * 0.25
	plumeGroup.add(innerCone)

	// Outer glow
	const outerConeGeo = new THREE.ConeGeometry(PALM_DEPTH * 0.7, PALM_HEIGHT * 0.9, 12)
	const outerCone = new THREE.Mesh(outerConeGeo, materials.plumeOuter)
	outerCone.rotation.x = -Math.PI / 2
	outerCone.position.z = -PALM_HEIGHT * 0.35
	plumeGroup.add(outerCone)

	// Point light for glow effect
	const plumeLight = new THREE.PointLight(0x4488ff, 0.5, 1.0)
	plumeLight.position.z = -PALM_HEIGHT * 0.2
	plumeGroup.add(plumeLight)

	// Store references for animation
	plumeGroup.userData = {
		innerCone,
		outerCone,
		light: plumeLight,
		baseIntensity: 1,
	}

	return plumeGroup
}

// ============================================
// Main Hand Creation
// ============================================

export function createOrcHand(scaleFactor = HAND_SCALE_FACTOR) {
	const handGroup = new THREE.Group()
	handGroup.name = "orcHand"

	const materials = createHandMaterials()

	// Create palm
	const palm = createPalm(materials)
	handGroup.add(palm)

	// Create wrist with plume
	const wrist = createWristWithPlume(materials)
	handGroup.add(wrist)

	// Finger configurations - positions relative to palm center
	const fingerConfigs = [
		{
			name: "thumb",
			position: [-PALM_WIDTH * 0.45, -PALM_HEIGHT * 0.1, PALM_DEPTH * 0.3],
			rotation: [0, 0, -0.6],
		},
		{
			name: "index",
			position: [-PALM_WIDTH * 0.3, PALM_HEIGHT * 0.3, 0],
			rotation: [0, 0, 0.05],
		},
		{
			name: "middle",
			position: [0, PALM_HEIGHT * 0.35, 0],
			rotation: [0, 0, 0],
		},
		{
			name: "ring",
			position: [PALM_WIDTH * 0.28, PALM_HEIGHT * 0.3, 0],
			rotation: [0, 0, -0.05],
		},
		{
			name: "pinky",
			position: [PALM_WIDTH * 0.48, PALM_HEIGHT * 0.2, 0],
			rotation: [0, 0, -0.1],
		},
	]

	// Create fingers
	const fingers = {}
	fingerConfigs.forEach((config) => {
		const finger = createFinger(config, materials)
		handGroup.add(finger)
		fingers[config.name] = finger
	})

	// Store references
	handGroup.userData = {
		fingers,
		plume: wrist.userData.plume,
		materials,
		currentGesture: "fist",
		gestureProgress: 1,
	}

	// Apply initial fist gesture
	applyGesture(handGroup, "fist")

	return handGroup
}

// ============================================
// Gesture Animation
// ============================================

// Animation state (module-level for smooth transitions)
let gestureAnimationState = {
	hand: null,
	fromGesture: "fist",
	toGesture: "fist",
	progress: 1, // 0 = fromGesture, 1 = toGesture
	startTime: 0,
	duration: 300,
}

export function transitionToGesture(hand, targetGesture, duration = 300) {
	if (!hand || !GESTURES[targetGesture]) return

	gestureAnimationState = {
		hand,
		fromGesture: hand.userData.currentGesture || "fist",
		toGesture: targetGesture,
		progress: 0,
		startTime: performance.now(),
		duration,
	}

	hand.userData.currentGesture = targetGesture
}

function applyGesture(hand, gestureName) {
	const gesture = GESTURES[gestureName]
	if (!gesture || !hand.userData.fingers) return

	Object.keys(hand.userData.fingers).forEach((fingerName) => {
		const finger = hand.userData.fingers[fingerName]
		const fingerGesture = gesture[fingerName]
		if (!fingerGesture || !finger.userData.joints) return

		const joints = finger.userData.joints
		// Apply rotations to each joint pivot
		if (joints[0]) joints[0].rotation.x = fingerGesture.proximal
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
			joints[0].rotation.x = fromFinger.proximal + (toFinger.proximal - fromFinger.proximal) * t
		}
		if (joints[1]) {
			joints[1].rotation.x = fromFinger.middle + (toFinger.middle - fromFinger.middle) * t
		}
		if (joints[2]) {
			joints[2].rotation.x = fromFinger.distal + (toFinger.distal - fromFinger.distal) * t
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

export function updateGestureAnimation() {
	const state = gestureAnimationState
	if (!state.hand || state.progress >= 1) return

	const elapsed = performance.now() - state.startTime
	const t = Math.min(elapsed / state.duration, 1)

	// Smooth ease-in-out cubic
	const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

	state.progress = eased
	lerpGestures(state.hand, state.fromGesture, state.toGesture, eased)

	if (t >= 1) {
		state.progress = 1
		applyGesture(state.hand, state.toGesture)
	}
}

// ============================================
// Plume Animation
// ============================================

export function updatePlumeAnimation(plume, intensity = 1) {
	if (!plume || !plume.userData) return

	const time = performance.now() * 0.01

	// Flickering effect
	const flicker = 0.7 + Math.sin(time * 3.7) * 0.15 + Math.sin(time * 7.3) * 0.1 + Math.random() * 0.05
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
// Irregular Orbit Calculation
// ============================================

export function calculateIrregularOrbitPosition(time) {
	const config = HAND_ORBIT_CONFIG

	// Base circular motion
	const baseAngle = time * config.baseSpeed

	// Add noise-based variations for irregularity
	const t = time * config.noiseFrequency
	const radiusNoise = Math.sin(t * 2.7) * Math.cos(t * 1.3) + Math.sin(t * 4.1) * 0.3
	const speedNoise = Math.sin(t * 1.9) * 0.5 + Math.cos(t * 3.2) * 0.3
	const inclinationNoise = Math.sin(t * 0.7) * Math.cos(t * 1.1)

	const radius = config.baseRadius + radiusNoise * config.radiusVariation
	const angle = baseAngle + speedNoise * config.speedVariation * time * 0.001
	const inclination = config.inclinationBase + inclinationNoise * config.inclinationVariation

	// Convert to 3D position
	const x = Math.cos(angle) * radius
	const y = Math.sin(inclination) * Math.sin(angle * 0.7) * radius * 0.4
	const z = Math.sin(angle) * radius * Math.cos(inclination * 0.5)

	return new THREE.Vector3(x, y, z)
}

export function avoidSatellites(handPosition, satellites, avoidanceRadius = HAND_ORBIT_CONFIG.avoidanceRadius) {
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
export function avoidPlanet(position, minDistance = HAND_ORBIT_CONFIG.minPlanetDistance) {
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
export function clampOutsidePlanet(position, minDistance = HAND_ORBIT_CONFIG.minPlanetDistance) {
	const distanceFromCenter = position.length()
	if (distanceFromCenter < minDistance && distanceFromCenter > 0) {
		// Move position to minimum distance from center
		position.normalize().multiplyScalar(minDistance)
	}
	return position
}

// ============================================
// State Machine Class
// ============================================

export class HandStateMachine {
	constructor(hand, orcGroup, satellites) {
		this.hand = hand
		this.orcGroup = orcGroup
		this.satellites = satellites || []
		this.state = HandState.IDLE_ORBIT
		this.stateStartTime = performance.now()
		this.targetSatellite = null
		this.stateData = {}
		this.orbitStartTime = performance.now()

		// Selected satellite for pointing while orbiting
		this.selectedSatellite = null

		// Callbacks for external integration
		this.onSatelliteBurn = null
		this.onSatelliteDestroyed = null
		this.onSlowMotionStart = null
		this.onSlowMotionEnd = null
	}

	// Set the currently selected satellite (for pointing while orbiting)
	setSelectedSatellite(satellite) {
		this.selectedSatellite = satellite
		// If in idle orbit and satellite selected, start pointing
		if (satellite && this.state === HandState.IDLE_ORBIT) {
			transitionToGesture(this.hand, "point", 400)
		} else if (!satellite && this.state === HandState.IDLE_ORBIT) {
			transitionToGesture(this.hand, "fist", 400)
		}
	}

	transition(newState, data = {}) {
		console.log(`Hand state: ${this.state} -> ${newState}`)
		this.state = newState
		this.stateStartTime = performance.now()
		this.stateData = { ...data }
		this.onEnterState(newState)
	}

	onEnterState(state) {
		switch (state) {
			case HandState.POINTING:
				transitionToGesture(this.hand, "point", 400)
				break
			case HandState.APPROACHING:
				transitionToGesture(this.hand, "fist", 200)
				this.stateData.startPosition = this.hand.position.clone()
				break
			case HandState.GRABBING:
				transitionToGesture(this.hand, "pinch", 350)
				break
			case HandState.CARRYING:
				this.stateData.carryStartPosition = this.hand.position.clone()
				break
			case HandState.RELEASING:
				transitionToGesture(this.hand, "flat", 200)
				break
			case HandState.WINDING_UP:
				if (this.onSlowMotionStart) this.onSlowMotionStart()
				this.stateData.windUpStartRotation = this.hand.rotation.y
				break
			case HandState.SLAPPING:
				transitionToGesture(this.hand, "backhand", 100)
				this.stateData.slapApplied = false
				break
			case HandState.CELEBRATING:
				transitionToGesture(this.hand, "thumbsUp", 300)
				break
			case HandState.RETURNING:
				transitionToGesture(this.hand, "fist", 400)
				this.stateData.returnStartPosition = this.hand.position.clone()
				if (this.onSlowMotionEnd) this.onSlowMotionEnd()
				break
			case HandState.CANCELLED:
				transitionToGesture(this.hand, "fist", 300)
				this.stateData.cancelStartPosition = this.hand.position.clone()
				break
			case HandState.IDLE_ORBIT:
				transitionToGesture(this.hand, "fist", 400)
				break
		}
	}

	getElapsedTime() {
		return performance.now() - this.stateStartTime
	}

	canCancel() {
		return CANCELLABLE_STATES.includes(this.state)
	}

	cancel() {
		if (!this.canCancel()) return false

		// If satellite is attached to hand, detach it
		if (this.targetSatellite && this.hand.children.includes(this.targetSatellite)) {
			const worldPos = new THREE.Vector3()
			this.targetSatellite.getWorldPosition(worldPos)
			this.hand.remove(this.targetSatellite)
			this.orcGroup.add(this.targetSatellite)
			this.targetSatellite.position.copy(worldPos)
		}

		this.transition(HandState.CANCELLED, {
			satellite: this.targetSatellite,
		})

		return true
	}

	startDecommission(satellite) {
		if (this.state !== HandState.IDLE_ORBIT) return false

		this.targetSatellite = satellite
		const targetPos = new THREE.Vector3()
		satellite.getWorldPosition(targetPos)

		this.transition(HandState.POINTING, {
			targetPosition: targetPos,
		})

		return true
	}

	update() {
		// Update gesture animation
		updateGestureAnimation()

		// Update plume based on state
		const plumeIntensity = this.state === HandState.IDLE_ORBIT ? 0.4 : 1.0
		updatePlumeAnimation(this.hand.userData.plume, plumeIntensity)

		// State-specific update
		switch (this.state) {
			case HandState.IDLE_ORBIT:
				this.updateIdleOrbit()
				break
			case HandState.POINTING:
				this.updatePointing()
				break
			case HandState.APPROACHING:
				this.updateApproaching()
				break
			case HandState.GRABBING:
				this.updateGrabbing()
				break
			case HandState.CARRYING:
				this.updateCarrying()
				break
			case HandState.RELEASING:
				this.updateReleasing()
				break
			case HandState.WINDING_UP:
				this.updateWindingUp()
				break
			case HandState.SLAPPING:
				this.updateSlapping()
				break
			case HandState.CELEBRATING:
				this.updateCelebrating()
				break
			case HandState.RETURNING:
				this.updateReturning()
				break
			case HandState.CANCELLED:
				this.updateCancelled()
				break
		}
	}

	updateIdleOrbit() {
		const time = performance.now() - this.orbitStartTime
		const targetPos = calculateIrregularOrbitPosition(time)

		// Apply satellite avoidance
		const avoidance = avoidSatellites(this.hand.position, this.satellites)
		targetPos.add(avoidance)

		// Apply planet collision avoidance
		const planetAvoidance = avoidPlanet(targetPos)
		targetPos.add(planetAvoidance)

		// Smooth movement toward target
		this.hand.position.lerp(targetPos, 0.015)

		// If a satellite is selected, point at it while orbiting
		if (this.selectedSatellite) {
			const satPos = new THREE.Vector3()
			this.selectedSatellite.getWorldPosition(satPos)

			// Calculate direction to satellite
			const direction = satPos.clone().sub(this.hand.position).normalize()
			const up = new THREE.Vector3(0, 1, 0)
			const rotMatrix = new THREE.Matrix4().lookAt(new THREE.Vector3(), direction, up)
			const targetQuat = new THREE.Quaternion().setFromRotationMatrix(rotMatrix)

			// Smoothly rotate to point at satellite
			this.hand.quaternion.slerp(targetQuat, 0.05)
		} else {
			// Face direction of travel when no satellite selected
			const velocity = targetPos.clone().sub(this.hand.position)
			if (velocity.length() > 0.001) {
				const lookTarget = this.hand.position.clone().add(velocity.normalize())
				this.hand.lookAt(lookTarget)
				// Rotate so palm faces forward
				this.hand.rotateY(Math.PI / 2)
			}
		}
	}

	updatePointing() {
		const elapsed = this.getElapsedTime()

		// Slow down idle orbit movement
		const time = performance.now() - this.orbitStartTime
		const targetPos = calculateIrregularOrbitPosition(time)
		this.hand.position.lerp(targetPos, 0.005)

		// Turn toward satellite
		if (this.targetSatellite) {
			const targetPos = new THREE.Vector3()
			this.targetSatellite.getWorldPosition(targetPos)

			const direction = targetPos.clone().sub(this.hand.position).normalize()
			const targetQuat = new THREE.Quaternion()
			const up = new THREE.Vector3(0, 1, 0)
			const rotMatrix = new THREE.Matrix4().lookAt(new THREE.Vector3(), direction, up)
			targetQuat.setFromRotationMatrix(rotMatrix)

			this.hand.quaternion.slerp(targetQuat, 0.08)
		}

		// Transition after duration + pause
		if (elapsed > SEQUENCE_TIMINGS.pointDuration + SEQUENCE_TIMINGS.pointPause) {
			this.transition(HandState.APPROACHING)
		}
	}

	updateApproaching() {
		const elapsed = this.getElapsedTime()
		const t = Math.min(elapsed / SEQUENCE_TIMINGS.approachDuration, 1)

		// Cubic ease-in-out
		const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

		if (this.targetSatellite) {
			const targetPos = new THREE.Vector3()
			this.targetSatellite.getWorldPosition(targetPos)

			// Calculate path that avoids the planet
			// Use an arc if direct path would go through planet
			const startPos = this.stateData.startPosition
			const directPath = targetPos.clone().sub(startPos)
			const midPoint = startPos.clone().add(directPath.clone().multiplyScalar(0.5))
			const midDistance = midPoint.length()

			// If midpoint is too close to planet, arc around it
			let interpolatedPos
			if (midDistance < HAND_ORBIT_CONFIG.minPlanetDistance) {
				// Create an arc path by pushing the midpoint outward
				const pushDirection = midPoint.clone().normalize()
				const arcMidPoint = pushDirection.multiplyScalar(HAND_ORBIT_CONFIG.minPlanetDistance * 1.2)

				// Quadratic bezier interpolation for smooth arc
				const oneMinusT = 1 - eased
				interpolatedPos = startPos
					.clone()
					.multiplyScalar(oneMinusT * oneMinusT)
					.add(arcMidPoint.clone().multiplyScalar(2 * oneMinusT * eased))
					.add(targetPos.clone().multiplyScalar(eased * eased))
			} else {
				// Direct path is safe
				interpolatedPos = startPos.clone().lerp(targetPos, eased)
			}

			// Apply planet collision clamping as final safety
			clampOutsidePlanet(interpolatedPos)
			this.hand.position.copy(interpolatedPos)

			// Face satellite
			const direction = targetPos.clone().sub(this.hand.position).normalize()
			if (direction.length() > 0) {
				const up = new THREE.Vector3(0, 1, 0)
				const rotMatrix = new THREE.Matrix4().lookAt(new THREE.Vector3(), direction, up)
				const targetQuat = new THREE.Quaternion().setFromRotationMatrix(rotMatrix)
				this.hand.quaternion.slerp(targetQuat, 0.1)
			}
		}

		if (t >= 1) {
			this.transition(HandState.GRABBING)
		}
	}

	updateGrabbing() {
		const elapsed = this.getElapsedTime()

		// Keep position on satellite
		if (this.targetSatellite) {
			const targetPos = new THREE.Vector3()
			this.targetSatellite.getWorldPosition(targetPos)
			this.hand.position.lerp(targetPos, 0.2)
		}

		if (elapsed > SEQUENCE_TIMINGS.grabDuration) {
			// Attach satellite to hand
			if (this.targetSatellite && !this.hand.children.includes(this.targetSatellite)) {
				const worldPos = new THREE.Vector3()
				this.targetSatellite.getWorldPosition(worldPos)

				// Remove from parent and add to hand
				if (this.targetSatellite.parent) {
					this.targetSatellite.parent.remove(this.targetSatellite)
				}
				this.hand.add(this.targetSatellite)

				// Position in front of palm (in pinch area)
				this.targetSatellite.position.set(
					-PALM_WIDTH * 0.15,
					PALM_HEIGHT * 0.25,
					PALM_DEPTH * 0.5
				)
				this.targetSatellite.scale.setScalar(1)
			}

			this.transition(HandState.CARRYING)
		}
	}

	updateCarrying() {
		const elapsed = this.getElapsedTime()
		const t = Math.min(elapsed / SEQUENCE_TIMINGS.carryDuration, 1)
		const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

		// Calculate a path to the exosphere that avoids the planet
		const EXOSPHERE_RADIUS = 0.72

		// Target position: on the exosphere, in the direction from planet to satellite
		// (so the hand approaches from outside, not through the planet)
		const startPos = this.stateData.carryStartPosition
		const startDirection = startPos.clone().normalize()

		// Target is on the exosphere edge, same general direction as start
		// but we need to approach from the "outside" for the slap
		const targetPos = startDirection.clone().multiplyScalar(EXOSPHERE_RADIUS + 0.08)

		// Check if direct path would go through planet
		const midPoint = startPos.clone().lerp(targetPos, 0.5)
		const midDistance = midPoint.length()

		let interpolatedPos
		if (midDistance < HAND_ORBIT_CONFIG.minPlanetDistance) {
			// Arc around the planet
			const perpendicular = new THREE.Vector3()
				.crossVectors(startPos, new THREE.Vector3(0, 1, 0))
				.normalize()
			if (perpendicular.length() < 0.1) {
				perpendicular.set(1, 0, 0)
			}
			const arcMidPoint = startDirection
				.clone()
				.add(perpendicular.multiplyScalar(0.5))
				.normalize()
				.multiplyScalar(HAND_ORBIT_CONFIG.minPlanetDistance * 1.3)

			// Quadratic bezier interpolation for smooth arc
			const oneMinusT = 1 - eased
			interpolatedPos = startPos
				.clone()
				.multiplyScalar(oneMinusT * oneMinusT)
				.add(arcMidPoint.clone().multiplyScalar(2 * oneMinusT * eased))
				.add(targetPos.clone().multiplyScalar(eased * eased))
		} else {
			interpolatedPos = startPos.clone().lerp(targetPos, eased)
		}

		// Final safety clamp
		clampOutsidePlanet(interpolatedPos, HAND_ORBIT_CONFIG.planetRadius + 0.05)
		this.hand.position.copy(interpolatedPos)

		// Face Earth
		const toEarth = new THREE.Vector3().sub(this.hand.position).normalize()
		const up = new THREE.Vector3(0, 1, 0)
		const rotMatrix = new THREE.Matrix4().lookAt(new THREE.Vector3(), toEarth, up)
		const targetQuat = new THREE.Quaternion().setFromRotationMatrix(rotMatrix)
		this.hand.quaternion.slerp(targetQuat, 0.05)

		if (t >= 1) {
			this.transition(HandState.RELEASING)
		}
	}

	updateReleasing() {
		const elapsed = this.getElapsedTime()

		if (elapsed > SEQUENCE_TIMINGS.releaseDuration) {
			// Detach satellite from hand
			if (this.targetSatellite && this.hand.children.includes(this.targetSatellite)) {
				const worldPos = new THREE.Vector3()
				this.targetSatellite.getWorldPosition(worldPos)
				this.hand.remove(this.targetSatellite)
				this.orcGroup.add(this.targetSatellite)
				this.targetSatellite.position.copy(worldPos)

				// Store satellite position for slap
				this.stateData.satellitePosition = worldPos.clone()
			}

			this.transition(HandState.WINDING_UP)
		}
	}

	updateWindingUp() {
		const elapsed = this.getElapsedTime()
		const t = Math.min(elapsed / SEQUENCE_TIMINGS.windUpDuration, 1)

		// Wind up rotation (pull back arm)
		const windUpAngle = t * Math.PI * 0.4 // 72 degree wind-up
		this.hand.rotation.y = (this.stateData.windUpStartRotation || 0) - windUpAngle

		// Move hand back slightly
		if (this.stateData.satellitePosition) {
			const backDirection = this.stateData.satellitePosition.clone().normalize()
			const backPos = this.stateData.satellitePosition.clone().add(backDirection.multiplyScalar(0.15 * t))
			this.hand.position.lerp(backPos, 0.1)
		}

		if (t >= 1) {
			this.transition(HandState.SLAPPING)
		}
	}

	updateSlapping() {
		const elapsed = this.getElapsedTime()
		const t = Math.min(elapsed / SEQUENCE_TIMINGS.slapDuration, 1)

		// Fast slap motion - ease out for impact
		const slapEased = 1 - Math.pow(1 - t, 3)

		// Swing forward
		const startAngle = (this.stateData.windUpStartRotation || 0) - Math.PI * 0.4
		const endAngle = (this.stateData.windUpStartRotation || 0) + Math.PI * 0.3
		this.hand.rotation.y = startAngle + (endAngle - startAngle) * slapEased

		// Move hand forward during slap
		if (this.stateData.satellitePosition) {
			const forwardDirection = this.stateData.satellitePosition.clone().normalize().negate()
			const forwardPos = this.stateData.satellitePosition.clone().add(forwardDirection.multiplyScalar(0.1 * slapEased))
			this.hand.position.lerp(forwardPos, 0.3)
		}

		// Apply slap impulse at contact point
		if (t > 0.5 && !this.stateData.slapApplied) {
			this.stateData.slapApplied = true

			// Trigger satellite burn
			if (this.targetSatellite && this.onSatelliteBurn) {
				this.onSatelliteBurn(this.targetSatellite)
			}
		}

		if (t >= 1) {
			this.transition(HandState.CELEBRATING, { burnStartTime: performance.now() })
		}
	}

	updateCelebrating() {
		const elapsed = this.getElapsedTime()

		// Position hand for clear thumbs up visibility (no bounce)
		// Move hand to a position where the thumbs up is clearly visible to the camera
		if (!this.stateData.celebrateStartPosition) {
			this.stateData.celebrateStartPosition = this.hand.position.clone()
		}

		// Smoothly rotate hand to present thumbs up toward camera
		// Thumbs up should be clearly visible - rotate wrist so thumb points upward
		const targetQuat = new THREE.Quaternion()
		// Face toward camera (which is typically at positive Z, above the scene)
		const up = new THREE.Vector3(0, 1, 0)
		const forward = new THREE.Vector3(0, 0.5, 1).normalize()
		const rotMatrix = new THREE.Matrix4().lookAt(new THREE.Vector3(), forward, up)
		targetQuat.setFromRotationMatrix(rotMatrix)

		// Smoothly rotate to thumbs up presentation angle
		this.hand.quaternion.slerp(targetQuat, 0.03)

		// Monitor satellite burn progress
		const burnElapsed = performance.now() - this.stateData.burnStartTime
		if (burnElapsed > SEQUENCE_TIMINGS.burnDuration) {
			// Destroy satellite
			if (this.targetSatellite && this.onSatelliteDestroyed) {
				this.onSatelliteDestroyed(this.targetSatellite)
			}

			if (elapsed > SEQUENCE_TIMINGS.celebrateDuration + SEQUENCE_TIMINGS.burnDuration) {
				this.targetSatellite = null
				this.stateData.celebrateStartPosition = null
				this.transition(HandState.RETURNING)
			}
		}
	}

	updateReturning() {
		const elapsed = this.getElapsedTime()
		const t = Math.min(elapsed / SEQUENCE_TIMINGS.returnDuration, 1)
		const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

		// Return to orbit position
		const time = performance.now() - this.orbitStartTime
		const targetPos = calculateIrregularOrbitPosition(time)
		const startPos = this.stateData.returnStartPosition

		// Check if direct path would go through planet
		const midPoint = startPos.clone().lerp(targetPos, 0.5)
		const midDistance = midPoint.length()

		let interpolatedPos
		if (midDistance < HAND_ORBIT_CONFIG.minPlanetDistance) {
			// Arc around the planet
			const pushDirection = midPoint.clone().normalize()
			const arcMidPoint = pushDirection.multiplyScalar(HAND_ORBIT_CONFIG.minPlanetDistance * 1.2)

			// Quadratic bezier interpolation for smooth arc
			const oneMinusT = 1 - eased
			interpolatedPos = startPos
				.clone()
				.multiplyScalar(oneMinusT * oneMinusT)
				.add(arcMidPoint.clone().multiplyScalar(2 * oneMinusT * eased))
				.add(targetPos.clone().multiplyScalar(eased * eased))
		} else {
			interpolatedPos = startPos.clone().lerp(targetPos, eased)
		}

		// Final safety clamp
		clampOutsidePlanet(interpolatedPos)
		this.hand.position.copy(interpolatedPos)

		// Gradually return to orbit orientation
		const velocity = targetPos.clone().sub(this.hand.position)
		if (velocity.length() > 0.001) {
			const lookTarget = this.hand.position.clone().add(velocity.normalize())
			const targetQuat = new THREE.Quaternion()
			const up = new THREE.Vector3(0, 1, 0)
			const rotMatrix = new THREE.Matrix4().lookAt(
				new THREE.Vector3(),
				velocity.normalize(),
				up
			)
			targetQuat.setFromRotationMatrix(rotMatrix)
			this.hand.quaternion.slerp(targetQuat, 0.03)
		}

		if (t >= 1) {
			this.transition(HandState.IDLE_ORBIT)
		}
	}

	updateCancelled() {
		const elapsed = this.getElapsedTime()
		const t = Math.min(elapsed / 1000, 1) // 1 second to return
		const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

		// Return to orbit
		const time = performance.now() - this.orbitStartTime
		const targetPos = calculateIrregularOrbitPosition(time)
		const startPos = this.stateData.cancelStartPosition

		// Check if direct path would go through planet
		const midPoint = startPos.clone().lerp(targetPos, 0.5)
		const midDistance = midPoint.length()

		let interpolatedPos
		if (midDistance < HAND_ORBIT_CONFIG.minPlanetDistance) {
			// Arc around the planet
			const pushDirection = midPoint.clone().normalize()
			const arcMidPoint = pushDirection.multiplyScalar(HAND_ORBIT_CONFIG.minPlanetDistance * 1.2)

			// Quadratic bezier interpolation for smooth arc
			const oneMinusT = 1 - eased
			interpolatedPos = startPos
				.clone()
				.multiplyScalar(oneMinusT * oneMinusT)
				.add(arcMidPoint.clone().multiplyScalar(2 * oneMinusT * eased))
				.add(targetPos.clone().multiplyScalar(eased * eased))
		} else {
			interpolatedPos = startPos.clone().lerp(targetPos, eased)
		}

		// Final safety clamp
		clampOutsidePlanet(interpolatedPos)
		this.hand.position.copy(interpolatedPos)

		if (t >= 1) {
			this.targetSatellite = null
			this.transition(HandState.IDLE_ORBIT)
		}
	}
}

// ============================================
// Exports
// ============================================

export default {
	createOrcHand,
	HandState,
	HandStateMachine,
	GESTURES,
	SEQUENCE_TIMINGS,
	HAND_SCALE_FACTOR,
	transitionToGesture,
	updateGestureAnimation,
	updatePlumeAnimation,
	calculateIrregularOrbitPosition,
	avoidSatellites,
}
