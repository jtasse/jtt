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
	windUpDuration: 1000, // Time to wind up slap
	slapDuration: 400, // Fast slap motion
	burnDuration: 4000, // Extended time to ensure satellite reaches Earth
	celebrateDuration: 3000, // Thumbs up duration
	returnDuration: 2000, // Time to return to orbit
}

// Slow motion factor during wind-up and burn phase (0.5 = half speed)
export const SLAP_SLOW_MOTION_FACTOR = 0.5

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
		thumb: {
			proximal: -0.5, // Extend outward more
			middle: 0, // Straight
			distal: 0, // Straight
			proximalZ: 2.2, // Rotate out perpendicular to palm (increased from 1.5)
			proximalY: -0.4, // Rotate to face up
		}, // extended up and out, perpendicular to other fingers
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
	THUMBS_UP: "THUMBS_UP", // Holding thumbs up pose (slow motion, camera zoomed)
	APPROACHING: "APPROACHING", // Flying toward satellite
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
	fingerGroup.position.set(
		config.position[0],
		config.position[1],
		config.position[2]
	)
	fingerGroup.rotation.set(
		config.rotation[0],
		config.rotation[1],
		config.rotation[2]
	)

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
	const knucklePlateGeo = new THREE.BoxGeometry(
		PALM_WIDTH * 0.9,
		PALM_HEIGHT * 0.15,
		PALM_DEPTH * 1.1
	)
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
	const forearmGeo = new THREE.BoxGeometry(
		PALM_WIDTH * 0.6,
		PALM_HEIGHT * 0.6,
		PALM_DEPTH * 1.2
	)
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
	const innerConeGeo = new THREE.ConeGeometry(
		PALM_DEPTH * 0.4,
		PALM_HEIGHT * 0.6,
		12
	)
	const innerCone = new THREE.Mesh(innerConeGeo, materials.plumeInner)
	innerCone.rotation.x = -Math.PI / 2 // Point backward
	innerCone.position.z = -PALM_HEIGHT * 0.25
	plumeGroup.add(innerCone)

	// Outer glow
	const outerConeGeo = new THREE.ConeGeometry(
		PALM_DEPTH * 0.7,
		PALM_HEIGHT * 0.9,
		12
	)
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

function applyGesture(hand, gestureName) {
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
export function calculateIrregularOrbitPosition(time, currentPos = null) {
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

// ============================================
// State Machine Class
// ============================================

export class HandStateMachine {
	constructor(hand, orcGroup, satellites, camera) {
		this.hand = hand
		this.orcGroup = orcGroup
		this.satellites = satellites || []
		this.camera = camera
		this.state = HandState.IDLE_ORBIT
		this.targetSatellite = null
		this.stateData = {}

		this.timeScale = 1.0
		this.internalTime = 0
		this.lastFrameTime = performance.now()
		this.stateStartTime = 0
		this.orbitStartTime = 0

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
		this.stateStartTime = this.internalTime

		// [DEBUG] Log position to catch NaNs early
		if (this.hand)
			console.log(
				`[DEBUG] Hand pos at transition: ${this.hand.position.x.toFixed(
					3
				)}, ${this.hand.position.y.toFixed(3)}, ${this.hand.position.z.toFixed(
					3
				)}`
			)

		this.stateData = { ...data }
		this.onEnterState(newState)
	}

	onEnterState(state) {
		switch (state) {
			case HandState.POINTING:
				transitionToGesture(this.hand, "point", 400)
				transitionToGesture(this.hand, "fist", 400)
				break
			case HandState.APPROACHING:
				transitionToGesture(this.hand, "fist", 200)
				this.stateData.startPosition = this.hand.position.clone()
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
				// LOCK the hand position RIGHT NOW
				this.stateData.lockedPosition = this.hand.position.clone()
				this.stateData.lockedRotation = this.hand.quaternion.clone()
				this.stateData.thumbsUpStarted = false
				this.stateData.thumbsUpStartTime = null
				break
			case HandState.RETURNING:
				transitionToGesture(this.hand, "fist", 400)
				this.stateData.returnStartPosition = this.hand.position.clone()
				this.timeScale = 1.0 // Ensure normal speed on return
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
		return this.internalTime - this.stateStartTime
	}

	canCancel() {
		return CANCELLABLE_STATES.includes(this.state)
	}

	cancel() {
		if (!this.canCancel()) return false

		// If satellite is attached to hand, detach it
		if (
			this.targetSatellite &&
			this.hand.children.includes(this.targetSatellite)
		) {
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
		const now = performance.now()
		const realDt = Math.min(now - this.lastFrameTime, 100) // Cap dt
		this.lastFrameTime = now

		const dt = realDt * this.timeScale
		this.internalTime += dt

		// Update gesture animation
		updateGestureAnimation(dt)

		// Update plume based on state
		const plumeIntensity = this.state === HandState.IDLE_ORBIT ? 0.4 : 1.0
		updatePlumeAnimation(
			this.hand.userData.plume,
			plumeIntensity,
			this.internalTime
		)

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
			case HandState.WINDING_UP:
				this.updateWindingUp()
				break
			case HandState.SLAPPING:
				this.updateSlapping(dt)
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
		const time = this.internalTime - this.orbitStartTime
		const targetPos = calculateIrregularOrbitPosition(time, this.hand.position)

		// Apply satellite avoidance
		const avoidance = avoidSatellites(this.hand.position, this.satellites)
		targetPos.add(avoidance)

		// Apply planet collision avoidance
		const planetAvoidance = avoidPlanet(targetPos)
		targetPos.add(planetAvoidance)

		// Smooth movement toward target
		this.hand.position.lerp(targetPos, 0.02)

		// If a satellite is selected, point index fingertip at it like an arrow
		if (this.selectedSatellite) {
			const satPos = new THREE.Vector3()
			this.selectedSatellite.getWorldPosition(satPos)

			// The index finger extends in local +Y direction when in pointing pose
			// Think of it as an arrow: we need to rotate the hand so its +Y axis
			// points directly at the satellite's position in space
			const localFingerDirection = new THREE.Vector3(0, 1, 0)

			// Calculate the world direction from hand to satellite
			const worldDirectionToSat = satPos
				.clone()
				.sub(this.hand.position)
				.normalize()

			// Create quaternion that rotates local +Y to point at satellite
			const targetQuat = new THREE.Quaternion().setFromUnitVectors(
				localFingerDirection,
				worldDirectionToSat
			)

			// Smoothly rotate to point at satellite
			this.hand.quaternion.slerp(targetQuat, 0.04)
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

		// Continue gentle movement while pointing
		const time = this.internalTime - this.orbitStartTime
		const targetPos = calculateIrregularOrbitPosition(time, this.hand.position)
		this.hand.position.lerp(targetPos, 0.008)

		// Point index fingertip at satellite like an arrow
		if (this.targetSatellite) {
			const satPos = new THREE.Vector3()
			this.targetSatellite.getWorldPosition(satPos)

			// The index finger extends in local +Y direction
			// Rotate hand so +Y points directly at satellite position
			const localFingerDirection = new THREE.Vector3(0, 1, 0)
			const worldDirectionToSat = satPos
				.clone()
				.sub(this.hand.position)
				.normalize()

			const targetQuat = new THREE.Quaternion().setFromUnitVectors(
				localFingerDirection,
				worldDirectionToSat
			)

			// Smoothly rotate to maintain arrow-like pointing
			this.hand.quaternion.slerp(targetQuat, 0.06)
		}

		// Transition after duration + pause
		if (
			elapsed >
			SEQUENCE_TIMINGS.pointDuration + SEQUENCE_TIMINGS.pointPause
		) {
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

			// If satellite is behind the planet (negative Z), we need a special approach
			// that keeps the hand in front of the planet at all times
			const satBehindPlanet = targetPos.z < MIN_FRONT_Z

			// Calculate path that avoids the planet
			// Use an arc if direct path would go through planet
			const startPos = this.stateData.startPosition
			const directPath = targetPos.clone().sub(startPos)
			const midPoint = startPos
				.clone()
				.add(directPath.clone().multiplyScalar(0.5))
			const midDistance = midPoint.length()

			// If midpoint is too close to planet OR satellite is behind planet, arc around it
			let interpolatedPos
			if (
				midDistance < HAND_ORBIT_CONFIG.minPlanetDistance ||
				satBehindPlanet
			) {
				// Create an arc path by pushing the midpoint outward
				// ALWAYS bias towards camera (positive Z) to stay visible
				let pushDirection

				if (this.camera) {
					// Use camera direction as primary push direction
					pushDirection = this.camera.position.clone().normalize()
				} else {
					// Fallback: push toward positive Z (camera direction)
					pushDirection = new THREE.Vector3(0, 0, 1)
				}

				// Add some XY component from the midpoint for more natural arc
				const xyBias = new THREE.Vector3(midPoint.x, midPoint.y, 0)
				if (xyBias.lengthSq() > 0.01) {
					xyBias.normalize().multiplyScalar(0.3)
					pushDirection.add(xyBias)
					pushDirection.normalize()
				}

				// Ensure arc midpoint has strong positive Z to stay in front
				const arcMidPoint = pushDirection.multiplyScalar(
					HAND_ORBIT_CONFIG.minPlanetDistance * 1.5
				)
				// Force arc midpoint to stay in front of planet
				arcMidPoint.z = Math.max(arcMidPoint.z, MIN_FRONT_Z + 0.3)

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

			// Apply planet collision clamping AND ensure we stay in front
			clampToFrontOfPlanet(interpolatedPos)
			this.hand.position.copy(interpolatedPos)

			// Face satellite
			const direction = targetPos.clone().sub(this.hand.position).normalize()
			if (direction.length() > 0) {
				const up = new THREE.Vector3(0, 1, 0)
				const rotMatrix = new THREE.Matrix4().lookAt(
					new THREE.Vector3(),
					direction,
					up
				)
				const targetQuat = new THREE.Quaternion().setFromRotationMatrix(
					rotMatrix
				)
				this.hand.quaternion.slerp(targetQuat, 0.1)
			}
		}

		if (t >= 1) {
			// Skip grab/carry/release - go straight to wind up
			this.transition(HandState.WINDING_UP)
		}
	}

	updateWindingUp() {
		const elapsed = this.getElapsedTime()
		const t = Math.min(elapsed / SEQUENCE_TIMINGS.windUpDuration, 1)

		// Smooth ease-in-out for graceful wind-up
		const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

		// Engage slow motion during wind up
		this.timeScale = SLAP_SLOW_MOTION_FACTOR

		if (this.targetSatellite) {
			const satPos = new THREE.Vector3()
			this.targetSatellite.getWorldPosition(satPos)

			// Position hand for a swing toward the satellite
			// Calculate vector from Earth to Satellite
			let earthToSat = satPos.clone()
			if (earthToSat.lengthSq() < 0.0001) {
				earthToSat.set(0, 1, 0) // Fallback
			} else {
				earthToSat.normalize()
			}

			// Wind up position: outside the orbit but ALWAYS in front of planet
			const windUpDist = 0.8 // Distance from satellite
			let windUpPos = satPos
				.clone()
				.add(earthToSat.clone().multiplyScalar(windUpDist))

			// If the wind-up position would be behind the planet, reposition
			// to the side/front while maintaining ability to swing at satellite
			if (windUpPos.z < MIN_FRONT_Z) {
				// Calculate a position that's in front of planet but offset to swing from
				// Use the satellite's XY position to determine swing direction
				const swingDir = new THREE.Vector3(satPos.x, satPos.y, 0)
				if (swingDir.lengthSq() > 0.01) {
					swingDir.normalize()
				} else {
					swingDir.set(1, 0, 0) // Default swing from right
				}

				// Position to the side of the satellite, in front of planet
				windUpPos = new THREE.Vector3(
					satPos.x + swingDir.x * windUpDist,
					satPos.y + swingDir.y * windUpDist * 0.5,
					Math.max(MIN_FRONT_Z + 0.3, satPos.z + 0.5)
				)
			}

			// Final safety clamp
			clampToFrontOfPlanet(windUpPos)
			this.hand.position.lerp(windUpPos, 0.1)

			// Rotate hand to face satellite, with palm ready for backhand
			let toSatellite = satPos.clone().sub(this.hand.position)
			if (toSatellite.lengthSq() < 0.0001) {
				toSatellite.set(0, 0, 1) // Fallback
			} else {
				toSatellite.normalize()
			}
			const up = new THREE.Vector3(0, 1, 0)
			const rotMatrix = new THREE.Matrix4().lookAt(
				new THREE.Vector3(),
				toSatellite,
				up
			)
			const targetQuat = new THREE.Quaternion().setFromRotationMatrix(rotMatrix)

			// Add wind-up rotation (pull arm back)
			const windUpQuat = new THREE.Quaternion().setFromAxisAngle(
				new THREE.Vector3(0, 1, 0),
				-eased * Math.PI * 0.4 // Wind up by rotating away
			)
			targetQuat.multiply(windUpQuat)

			this.hand.quaternion.slerp(targetQuat, 0.06)
		}

		if (t >= 1) {
			this.transition(HandState.SLAPPING)
		}
	}

	updateSlapping(dt) {
		const elapsed = this.getElapsedTime()
		const t = Math.min(elapsed / SEQUENCE_TIMINGS.slapDuration, 1)

		// Linear swing for impact
		const eased = t // Linear is good for impact speed

		if (this.targetSatellite) {
			const satPos = new THREE.Vector3()
			this.targetSatellite.getWorldPosition(satPos)

			// Swing THROUGH the satellite toward Earth
			// Start from current hand pos (wind up pos)
			// End pos is past the satellite

			// Vector from Hand to Satellite
			let toSat = satPos.clone().sub(this.hand.position)
			if (toSat.lengthSq() < 0.0001) {
				toSat.set(0, -1, 0) // Fallback if on top of it
			} else {
				toSat.normalize()
			}

			const moveSpeed = 0.02 // units per ms
			this.hand.position.add(toSat.multiplyScalar(moveSpeed * dt))

			clampToFrontOfPlanet(this.hand.position)

			// Check for contact
			const dist = this.hand.position.distanceTo(satPos)
			const CONTACT_THRESHOLD = 0.5

			if (dist < CONTACT_THRESHOLD && !this.stateData.slapApplied) {
				this.stateData.slapApplied = true

				// Trigger satellite burn / launch EXACTLY on contact
				if (this.onSatelliteBurn) {
					this.onSatelliteBurn(this.targetSatellite)
				}

				// Transition to celebrate - thumbs up will start THERE after hand stops
				this.transition(HandState.CELEBRATING, {
					burnStartTime: this.internalTime,
				})
			}
		}

		// Failsafe transition if missed
		if (t >= 1 && !this.stateData.slapApplied) {
			this.transition(HandState.CELEBRATING, {
				burnStartTime: this.internalTime,
			})
		}
	}

	updateCelebrating() {
		const elapsed = this.getElapsedTime()

		// FORCE hand to locked position EVERY FRAME - absolutely no movement allowed
		this.hand.position.copy(this.stateData.lockedPosition)
		this.hand.quaternion.copy(this.stateData.lockedRotation)

		// Phase 1: Wait for satellite to be destroyed
		if (this.targetSatellite) {
			if (elapsed > 1500 && this.onSatelliteDestroyed) {
				this.onSatelliteDestroyed(this.targetSatellite)
				this.targetSatellite = null
			}
			return
		}

		// Phase 2: Satellite is gone - now do thumbs up
		if (!this.stateData.thumbsUpStarted) {
			this.stateData.thumbsUpStarted = true
			this.stateData.thumbsUpStartTime = this.internalTime
			transitionToGesture(this.hand, "thumbsUp", 500)
		}

		// After 3 seconds of thumbs up, transition to RETURNING
		const thumbsUpElapsed = this.internalTime - this.stateData.thumbsUpStartTime
		const thumbsUpDuration = 3000
		if (thumbsUpElapsed > thumbsUpDuration) {
			this.transition(HandState.RETURNING)
		}
	}

	updateReturning() {
		const elapsed = this.getElapsedTime()
		const t = Math.min(elapsed / SEQUENCE_TIMINGS.returnDuration, 1)
		const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

		// Return to orbit position
		const time = this.internalTime - this.orbitStartTime
		const targetPos = calculateIrregularOrbitPosition(time)
		const startPos = this.stateData.returnStartPosition

		// Check if direct path would go through planet or if start is behind planet
		const midPoint = startPos.clone().lerp(targetPos, 0.5)
		const midDistance = midPoint.length()
		const startBehindPlanet = startPos.z < MIN_FRONT_Z

		let interpolatedPos
		if (
			midDistance < HAND_ORBIT_CONFIG.minPlanetDistance ||
			startBehindPlanet
		) {
			// Arc around the planet, always staying in front
			let pushDirection
			if (this.camera) {
				pushDirection = this.camera.position.clone().normalize()
			} else {
				pushDirection = new THREE.Vector3(0, 0, 1)
			}

			const arcMidPoint = pushDirection.multiplyScalar(
				HAND_ORBIT_CONFIG.minPlanetDistance * 1.5
			)
			// Ensure arc stays in front
			arcMidPoint.z = Math.max(arcMidPoint.z, MIN_FRONT_Z + 0.3)

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

		// Final safety clamp - stay in front of planet
		clampToFrontOfPlanet(interpolatedPos)
		this.hand.position.copy(interpolatedPos)

		// Gradually return to orbit orientation
		const velocity = targetPos.clone().sub(this.hand.position)
		if (velocity.length() > 0.001) {
			const lookTarget = this.hand.position.clone().add(velocity.normalize())
			const targetQuat = new THREE.Quaternion()
			const up = new THREE.Vector3(0, 1, 0)
			const dir = velocity.normalize()

			// Guard against parallel vectors causing NaN in lookAt
			if (Math.abs(dir.dot(up)) > 0.99) {
				up.set(0, 0, 1)
			}

			const rotMatrix = new THREE.Matrix4().lookAt(new THREE.Vector3(), dir, up)
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
		const time = this.internalTime - this.orbitStartTime
		const targetPos = calculateIrregularOrbitPosition(time)
		const startPos = this.stateData.cancelStartPosition

		// Check if direct path would go through planet or if start is behind planet
		const midPoint = startPos.clone().lerp(targetPos, 0.5)
		const midDistance = midPoint.length()
		const startBehindPlanet = startPos.z < MIN_FRONT_Z

		let interpolatedPos
		if (
			midDistance < HAND_ORBIT_CONFIG.minPlanetDistance ||
			startBehindPlanet
		) {
			// Arc around the planet, always staying in front
			let pushDirection
			if (this.camera) {
				pushDirection = this.camera.position.clone().normalize()
			} else {
				pushDirection = new THREE.Vector3(0, 0, 1)
			}

			const arcMidPoint = pushDirection.multiplyScalar(
				HAND_ORBIT_CONFIG.minPlanetDistance * 1.5
			)
			// Ensure arc stays in front
			arcMidPoint.z = Math.max(arcMidPoint.z, MIN_FRONT_Z + 0.3)

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

		// Final safety clamp - stay in front of planet
		clampToFrontOfPlanet(interpolatedPos)
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
