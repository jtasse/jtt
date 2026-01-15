// ============================================
// Configuration
// ============================================

// Hand size relative to satellite (satellites are ~0.08 units)
export const SATELLITE_SIZE = 0.08
// CONFIGURABLE: Change this value to adjust hand size (default 7 = 7x satellite size)
export const HAND_SCALE_FACTOR = 7
export const HAND_SIZE = SATELLITE_SIZE * HAND_SCALE_FACTOR // ~0.56 units

// Hand component sizes relative to HAND_SIZE
export const PALM_WIDTH = HAND_SIZE * 0.7
export const PALM_HEIGHT = HAND_SIZE * 0.45
export const PALM_DEPTH = HAND_SIZE * 0.12

export const FINGER_WIDTH = HAND_SIZE * 0.09
export const FINGER_SEGMENT_LENGTH = HAND_SIZE * 0.18
export const THUMB_SEGMENT_LENGTH = HAND_SIZE * 0.14
export const JOINT_RADIUS = FINGER_WIDTH * 0.6

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
	celebrateDuration: 2000, // Thumbs up duration
	returnDuration: 2000, // Time to return to orbit
}

// Slow motion factor during wind-up and burn phase (0.5 = half speed)
export const SLAP_SLOW_MOTION_FACTOR = 0.5

// GEO Punch configuration - staged animation
// Stages: POSITION -> PULL_BACK -> PUNCH -> FOLLOW_THROUGH -> CELEBRATE
export const GEO_PUNCH_CONFIG = {
	// Stage durations in milliseconds (real time)
	positionHoldDuration: 500, // Brief pause after positioning, before pull-back
	pullBackDuration: 1200, // Loooong exaggerated pull-back (reverse thrust)
	punchDuration: 300, // Quick punch forward
	followThroughDuration: 1000, // Drive through motion

	// Slow motion factors
	pullBackTimeScale: 0.15, // Super slow during pull-back
	punchTimeScale: 0.1, // Near normal speed for punch impact

	// Distance values (relative to satellite distance from Earth)
	approachOffset: 0.5, // How far beyond satellite to initially position
	pullBackDistance: 1.5, // How far to pull back during wind-up
	followThroughDistance: 0.4, // How far past satellite to drive through
	followThroughAngle: Math.PI * 0.15, // Angle offset after follow-through (like punch ending beside head)

	// Camera settings (relative to hand)
	windUpCameraOffset: { x: 4.0, y: 2.0, z: 4.0 },
	windUpCameraLookAt: { x: 0, y: 0, z: 0 },
	punchCameraOffset: { x: 2.5, y: 1.0, z: 2.5 },
	punchCameraLookAt: { x: 0, y: 0, z: 0 },
	followThroughCameraOffset: { x: 2.0, y: 0.5, z: 2.0 },
	followThroughCameraLookAt: { x: 0, y: 0, z: 0 },

	windUpCameraSpeed: 0.02,
	punchCameraSpeed: 0.05,
	followThroughCameraSpeed: 0.03,
}

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
