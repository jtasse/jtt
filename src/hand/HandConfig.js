// ============================================
// Hand of ORC Configuration
// ============================================
// This file contains all configurable parameters for the Hand of ORC.
// It controls hand geometry, animation timing, camera behavior, and gestures.
//
// -----------------------------------------
// DECOMMISSION PHASE TERMINOLOGY (IMPORTANT!)
// -----------------------------------------
// The decommission sequence has GENERIC phases that apply to ALL orbit types:
//
//   POINTING → APPROACHING → WINDING_UP → CONTACTING → CELEBRATING → RETURNING
//
// The CONTACTING phase has orbit-specific implementations:
//   - LEO (Leona):    FLICKING  - index finger flick like a paper football
//   - GEO (George):   PUNCHING  - fist punch toward Earth
//   - Molniya (Moltar): SLAPPING - backhand slap
//
// When writing generic code, ALWAYS use "contact" terminology.
// Only use flick/punch/slap when writing orbit-specific code.
//
// -----------------------------------------
// CAMERA CONTROLS QUICK REFERENCE
// -----------------------------------------
// Each orbit type (GEO, LEO, Molniya) has camera settings per phase:
//
// cameraOffset: Direction vector pointing from hand to camera position
//   x: along punch line (positive = away from Earth, behind hand)
//   y: world up/down
//   z: perpendicular to punch line (for side views / orbiting around hand)
//
// cameraDistance: How far camera is from hand (ZOOM LEVEL)
//   - This is independent of the offset direction
//   - Larger value = more zoomed out
//   - The offset is normalized, then scaled by this distance
//
// cameraLookAt: Offset from hand position for camera target
//
// cameraSpeed: Lerp rate (0.01 = very smooth, 0.1 = snappy)
//
// EXAMPLES:
//
// Side view of thumbs-up (orbit around hand):
//   cameraOffset: { x: 0, y: 0.5, z: 1.0 }  // Camera to the side
//   cameraDistance: 2.5                      // Zoom level
//   cameraLookAt: { x: 0, y: 0, z: 0 }       // Looking at hand center
//
// Dramatic low-angle shot:
//   cameraOffset: { x: 1.0, y: -0.5, z: 1.5 }  // Camera below and to the side
//   cameraDistance: 3.0                        // Further back
//   cameraLookAt: { x: 0, y: 0.5, z: 0 }       // Looking slightly above hand
//
// Zoomed-in close-up:
//   cameraOffset: { x: 1.0, y: 0.3, z: 0.5 }
//   cameraDistance: 1.5                        // Close!
// -----------------------------------------

// ============================================
// Hand Geometry
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

// ============================================
// Idle Orbit Configuration
// ============================================
// Controls how the hand moves when not interacting with satellites.
// The hand follows an irregular orbit to appear more natural.
export const HAND_ORBIT_CONFIG = {
	baseRadius: 1.5, // Average distance from Earth center (outside satellite orbits)
	radiusVariation: 0.2, // Max deviation from baseRadius (+/-)
	baseSpeed: 0.0004, // Angular velocity in radians per ms (lower = slower)
	speedVariation: 0.0002, // Random speed fluctuation range
	inclinationBase: 0.35, // Base orbit tilt in radians (~20 degrees)
	inclinationVariation: 0.2, // Random tilt variation
	noiseFrequency: 0.0002, // How quickly the irregular motion changes (Perlin noise)
	avoidanceRadius: 0.35, // Distance at which hand starts avoiding satellites
	planetRadius: 0.5, // Planet radius for collision detection
	minPlanetDistance: 0.7, // Absolute minimum distance from planet center
}

// ============================================
// Animation Sequence Timing (milliseconds)
// ============================================
// DEFAULT timings used as fallback. Each orbit type can override these.
// See GEO_PUNCH_CONFIG, LEO_FLICK_CONFIG, MOLNIYA_SLAP_CONFIG for orbit-specific timings.
export const SEQUENCE_TIMINGS = {
	pointDuration: 800, // How long hand points at target before moving
	pointPause: 400, // Additional pause after pointing animation completes
	approachDuration: 2000, // Time to travel from orbit to satellite position
	windUpDuration: 1000, // Time for wind-up animation (pulling back arm)
	contactDuration: 400, // Duration of contact motion (LEO: flick, GEO: punch, Molniya: slap)
	burnDuration: 4000, // How long satellite burns before destruction
	celebrateDuration: 1000, // Duration of thumbs-up celebration
	returnDuration: 2000, // Time to travel back to idle orbit position
}

// Slow motion factor during wind-up and burn phase
// 0.5 = half speed, 0.25 = quarter speed, etc.
export const SLAP_SLOW_MOTION_FACTOR = 0.5

// ============================================
// Helper: Get timing for current orbit type
// ============================================
// Use this to get phase durations. Falls back to SEQUENCE_TIMINGS if not specified.
export function getOrbitTiming(orbitConfig, phaseName) {
	if (orbitConfig?.phaseDurations?.[phaseName] !== undefined) {
		return orbitConfig.phaseDurations[phaseName]
	}
	// Fallback to SEQUENCE_TIMINGS
	return SEQUENCE_TIMINGS[phaseName] ?? 1000
}

// ============================================
// GEO Punch Configuration
// ============================================
// For Geosynchronous satellites (high orbit ~2.0 units from Earth).
// Animation: POINTING -> APPROACHING -> POSITION_HOLD -> PULL_BACK -> PUNCH -> FOLLOW_THROUGH -> CELEBRATING
// The hand positions BEHIND the satellite (further from Earth), then punches TOWARD Earth.
export const GEO_PUNCH_CONFIG = {
	// -----------------------------------------
	// Phase Durations (milliseconds)
	// -----------------------------------------
	// These override SEQUENCE_TIMINGS for GEO satellites
	phaseDurations: {
		pointDuration: 800, // How long hand points at satellite
		pointPause: 400, // Pause after pointing before approach
		approachDuration: 2000, // Time to fly to position behind satellite
		windUpDuration: 1000, // Total wind-up phase (includes sub-stages below)
		contactDuration: 400, // Base contact duration (GEO uses staged punch instead)
		returnDuration: 2000, // Time to return to idle orbit
	},

	// -----------------------------------------
	// GEO-Specific Stage Durations (milliseconds)
	// -----------------------------------------
	// These are sub-stages within the wind-up and contact phases
	positionHoldDuration: 500, // Brief pause at approach position before pull-back
	pullBackDuration: 300, // Duration of exaggerated pull-back (arm coils back)
	punchDuration: 800, // Duration of the forward punch motion
	followThroughDuration: 500, // Duration of follow-through after impact

	// -----------------------------------------
	// Slow Motion Factors (timeScale multipliers)
	// -----------------------------------------
	// Lower values = slower animation. 1.0 = normal speed.
	pullBackTimeScale: 0.15, // Super slow during pull-back for dramatic effect
	punchTimeScale: 0.1, // Near normal speed for punch impact

	// -----------------------------------------
	// Distance Values (3D scene units)
	// -----------------------------------------
	// All distances are along the Earth-to-satellite line.
	approachOffset: 0.5, // Hand starts this far BEYOND satellite (away from Earth)
	pullBackDistance: 0.75, // How far arm pulls back from start position
	followThroughDistance: 0.4, // How far past satellite the fist travels after impact
	followThroughAngle: Math.PI * 0.15, // Lateral angle offset at end of punch

	// -----------------------------------------
	// Camera Settings Per Phase
	// -----------------------------------------
	// Camera position is calculated as: handWorldPosition + (normalized offset * distance)
	// Camera looks at: handWorldPosition + lookAt
	//
	// cameraOffset: Direction vector for camera position (will be normalized)
	// cameraDistance: How far camera is from hand. Larger = more zoomed out.
	// cameraSpeed: Lerp rate (0.01 = slow/smooth, 0.1 = snappy)
	// cameraLookAt: Offset from hand position for camera target

	// Approach phase (POINTING, APPROACHING)
	approachCameraOffset: { x: 0.5, y: 1.0, z: 2.0 },
	approachCameraDistance: 4.0,
	approachCameraLookAt: { x: 0, y: 0, z: 0 },
	approachCameraSpeed: 0.02,

	// Wind-up phase (POSITION_HOLD, PULL_BACK)
	windUpCameraOffset: { x: 0.5, y: 1.0, z: 2.0 },
	windUpCameraDistance: 4.0,
	windUpCameraLookAt: { x: 0, y: 0, z: 0 },
	windUpCameraSpeed: 0.02,

	// Punch phase
	punchCameraOffset: { x: 0.5, y: 1.0, z: 2.0 },
	punchCameraDistance: 4.0,
	punchCameraLookAt: { x: 0, y: 0, z: 0 },
	punchCameraSpeed: 0.02,

	// Follow-through phase
	followThroughCameraOffset: { x: 0.5, y: 1.0, z: 2.0 },
	followThroughCameraDistance: 4.0,
	followThroughCameraLookAt: { x: 0, y: 0, z: 0 },
	followThroughCameraSpeed: 0.02,

	// -----------------------------------------
	// Hand Rotation Keyframes
	// -----------------------------------------
	// Euler angles in radians, applied relative to the punch line orientation.
	// Interpolated between start and end over the phase duration.
	// x = pitch (tilt forward/back), y = yaw (rotate left/right), z = roll
	rotations: {
		approach: {
			start: { x: 1, y: 1, z: 0 },
			end: { x: 2, y: 1, z: 0 },
		},
		pullBack: {
			start: { x: 2, y: 1, z: 0 },
			end: { x: 2, y: 1, z: 0 },
		},
		punch: {
			start: { x: 2, y: 1, z: 0 },
			end: { x: 2, y: 1, z: 0 },
		},
		followThrough: {
			start: { x: 2, y: 1, z: 0 },
			end: { x: 2, y: 1, z: 0.1 }, // Slight roll at end
		},
	},

	// -----------------------------------------
	// Celebration Phase Settings
	// -----------------------------------------
	celebration: {
		satelliteDestroyDelay: 800, // ms after entering celebration to destroy satellite
		gestureTransitionDuration: 600, // ms to transition fingers to thumbs up
		rotationTransitionDuration: 800, // ms to rotate hand to thumbs up orientation
		thumbsUpHoldDuration: 2000, // ms to hold thumbs up before returning
		// Camera for celebration - side view for thumbs up
		cameraOffset: { x: 0.5, y: 0.5, z: 2.0 },
		cameraDistance: 3.0,
		cameraLookAt: { x: 0, y: 0, z: 0 },
		cameraSpeed: 0.03,
	},
}

// ============================================
// LEO Flick Configuration
// ============================================
// For Low Earth Orbit satellites (close orbit ~0.65 units from Earth).
// Animation: POINTING -> APPROACHING -> PREPARING -> FLICKING -> CELEBRATING
// Uses a "flick" gesture like flicking a paper football.
// NOTE: PREPARING maps to WINDING_UP state, FLICKING maps to CONTACT state internally.
export const LEO_FLICK_CONFIG = {
	// -----------------------------------------
	// Phase Durations (milliseconds)
	// -----------------------------------------
	// These override SEQUENCE_TIMINGS for LEO satellites
	phaseDurations: {
		pointDuration: 600, // Shorter point for close satellites
		pointPause: 300, // Quick pause before approach
		approachDuration: 1500, // Faster approach (closer distance)
		windUpDuration: 2000, // "Preparing" - getting fingers ready to flick
		contactDuration: 500, // "Flicking" - the actual flick motion (fast!)
		returnDuration: 1800, // Return to orbit
	},

	// Slow motion factor during preparing phase (0.5 = half speed)
	slowMotionFactor: 0.5,

	// -----------------------------------------
	// LEO Flick Positioning (3D scene units)
	// -----------------------------------------
	// The hand is positioned BEYOND the satellite (further from Earth).
	// Satellite is sandwiched between Earth and hand.
	//
	// These values position the hand so the index fingertip contacts the satellite.
	// standoffDistance: How far hand center is from satellite during PREPARING
	// flickForwardDistance: How far hand moves toward satellite during FLICKING
	standoffDistance: 0.02, // Hand center very close to satellite
	flickForwardDistance: 0.0, // No forward motion - finger extension does the work

	// -----------------------------------------
	// Camera Settings Per Phase
	// -----------------------------------------
	// LEO satellites are close to Earth. Camera stays relatively stable.

	// Approach phase (POINTING, APPROACHING)
	approachCameraOffset: null, // Use dynamic side view
	approachCameraDistance: 3.5,
	approachCameraLookAt: { x: 0, y: 0, z: 0 },
	approachCameraSpeed: 0.02,

	// Preparing phase (WINDING_UP state - hand gets ready to flick)
	preparingCameraOffset: null, // Use dynamic side view
	preparingCameraDistance: 2.5,
	preparingCameraLookAt: { x: 0, y: 0, z: 0 },
	preparingCameraSpeed: 0.02,

	// Flicking phase (SLAPPING state - the actual flick motion)
	flickingCameraOffset: null, // Use dynamic side view
	flickingCameraDistance: 3.5,
	flickingCameraLookAt: { x: 0, y: 0, z: 0 },
	flickingCameraSpeed: 0.02,

	// -----------------------------------------
	// Celebration Phase Settings
	// -----------------------------------------
	celebration: {
		satelliteDestroyDelay: 800, // ms before satellite is removed
		gestureTransitionDuration: 600, // ms to form thumbs up
		rotationTransitionDuration: 800, // ms to rotate to thumbs up pose
		thumbsUpHoldDuration: 2500, // ms to hold thumbs up
		cameraOffset: { x: 0.5, y: 0.5, z: 2.0 },
		cameraDistance: 3.0,
		cameraLookAt: { x: 0, y: 0, z: 0 },
		cameraSpeed: 0.03,
	},
}

// ============================================
// Molniya Slap Configuration
// ============================================
// For Molniya orbit satellites (highly elliptical orbit, varies from ~0.6 to ~2.3 units).
// Animation: POINTING -> APPROACHING -> WINDING_UP -> CONTACT (slap) -> CELEBRATING
// Uses a backhand slap motion - the only orbit type that actually slaps!
export const MOL_SLAP_CONFIG = {
	// -----------------------------------------
	// Phase Durations (milliseconds)
	// -----------------------------------------
	// These override SEQUENCE_TIMINGS for Molniya satellites
	phaseDurations: {
		pointDuration: 800, // Point at satellite
		pointPause: 400, // Pause before approach
		approachDuration: 2200, // Longer approach (elliptical orbit = variable distance)
		windUpDuration: 1200, // Dramatic wind-up for backhand slap
		contactDuration: 1000, // The backhand slap motion
		returnDuration: 2200, // Return to orbit
	},

	// Slow motion factor during wind-up phase (0.5 = half speed)
	slowMotionFactor: 0.5,

	// -----------------------------------------
	// Camera Settings Per Phase
	// -----------------------------------------
	// Molniya has an elliptical orbit. Camera positioned to show both hand AND planet.
	// Larger distances and look-at offsets toward planet center (negative z).

	// Approach phase (POINTING, APPROACHING)
	approachCameraOffset: { x: 0.3, y: 0.8, z: 0 },
	approachCameraDistance: 5.0,
	approachCameraLookAt: { x: 0, y: -0.3, z: -1.0 }, // Look toward planet
	approachCameraSpeed: 0.02,

	// Wind-up phase (arm pulls back for slap)
	windUpCameraOffset: { x: 0.3, y: 0.8, z: 0 },
	windUpCameraDistance: 4.0,
	windUpCameraLookAt: { x: 0, y: -0.3, z: 0 },
	windUpCameraSpeed: 0.02,

	// Contact phase (the actual slap motion)
	slapCameraOffset: { x: 0.3, y: 0.8, z: 0 },
	slapCameraDistance: 3.0,
	slapCameraLookAt: { x: 0, y: -0.3, z: 0 },
	slapCameraSpeed: 0.02,

	// -----------------------------------------
	// Celebration Phase Settings
	// -----------------------------------------
	celebration: {
		satelliteDestroyDelay: 1500, // ms before satellite is removed
		gestureTransitionDuration: 600, // ms to form thumbs up
		rotationTransitionDuration: 800, // ms to rotate to thumbs up pose
		thumbsUpHoldDuration: 2500, // ms to hold thumbs up
		cameraOffset: { x: 0.5, y: 0.5, z: 2.0 },
		cameraDistance: 3.0,
		cameraLookAt: { x: 0, y: 0, z: 0 },
		cameraSpeed: 0.03,
	},
}

// ============================================
// Gesture Definitions
// ============================================
// Define finger positions for various hand poses.
//
// Joint hierarchy (each finger):
//   proximal: knuckle joint (where finger meets palm)
//   middle: middle joint of finger
//   distal: fingertip joint
//
// Rotation values are in radians:
//   0 = straight (extended)
//   positive = curled inward (toward palm)
//   negative = extended outward (spread)
//
// Special thumb properties:
//   proximalZ: Z-axis rotation to swing thumb perpendicular to palm
//   proximalY: Y-axis rotation to point thumb direction
//
// wristRotation: Rotate entire hand around wrist (used for backhand slap)
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

	// LEO Flick gestures - like flicking a paper football
	flickReady: {
		// Thumb and index finger pressed together, ready to flick
		thumb: {
			proximal: 0.3, // Slightly bent inward
			middle: 0.8, // Bent to meet index finger
			distal: 0.3,
			proximalZ: 0.8, // Rotated toward index finger
		},
		index: {
			proximal: 0.6, // Bent at knuckle
			middle: 1.5, // Strongly bent - fingertip pulled back under thumb
			distal: 0.8, // Tip bent
		},
		middle: { proximal: 1.4, middle: 1.3, distal: 1.1 }, // Curled out of the way
		ring: { proximal: 1.4, middle: 1.3, distal: 1.1 }, // Curled
		pinky: { proximal: 1.4, middle: 1.3, distal: 1.1 }, // Curled
		wristRotation: 0,
	},

	flickRelease: {
		// Index finger extended after flick (thumb stays in position)
		thumb: {
			proximal: 0.3,
			middle: 0.8,
			distal: 0.3,
			proximalZ: 0.8,
		},
		index: {
			proximal: -0.2, // Slightly raised at knuckle
			middle: 0, // Straight
			distal: 0, // Straight - finger fully extended
		},
		middle: { proximal: 1.4, middle: 1.3, distal: 1.1 }, // Still curled
		ring: { proximal: 1.4, middle: 1.3, distal: 1.1 }, // Curled
		pinky: { proximal: 1.4, middle: 1.3, distal: 1.1 }, // Curled
		wristRotation: 0,
	},
}

// ============================================
// Hand State Machine States
// ============================================
// States control the hand's behavior during decommission sequences.
// Transitions: IDLE_ORBIT -> POINTING -> APPROACHING -> WINDING_UP -> CONTACT -> CELEBRATING -> RETURNING -> IDLE_ORBIT
//
// The CONTACT phase (internal state name: SLAPPING for legacy reasons) manifests differently per orbit:
//   - LEO (Leona): FLICKING - finger flick like a paper football
//   - GEO (George): PUNCHING - fist punch toward Earth
//   - Molniya (Moltar): SLAPPING - backhand slap
export const HandState = {
	IDLE_ORBIT: "IDLE_ORBIT", // Default state: hand orbits Earth autonomously
	POINTING: "POINTING", // Points at target satellite to indicate selection
	THUMBS_UP: "THUMBS_UP", // Legacy state for thumbs up pose
	APPROACHING: "APPROACHING", // Flying from orbit position to satellite
	WINDING_UP: "WINDING_UP", // Preparing strike (LEO: PREPARING, GEO: PULL_BACK)
	CONTACTING: "CONTACTING", // CONTACT phase (LEO: flick, GEO: punch, Molniya: slap)
	CELEBRATING: "CELEBRATING", // Post-strike thumbs up gesture
	RETURNING: "RETURNING", // Flying back to idle orbit position
	CANCELLED: "CANCELLED", // User cancelled - returning satellite to orbit
}
