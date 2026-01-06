import * as THREE from "three"
import {
	HAND_SCALE_FACTOR,
	PALM_WIDTH,
	PALM_HEIGHT,
	PALM_DEPTH,
	FINGER_WIDTH,
	FINGER_SEGMENT_LENGTH,
	THUMB_SEGMENT_LENGTH,
	JOINT_RADIUS,
} from "./HandConfig.js"
import { applyGesture } from "./HandBehaviors.js"

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

export function createOrcHand(_scaleFactor = HAND_SCALE_FACTOR) {
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

	// Store references for animation
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
