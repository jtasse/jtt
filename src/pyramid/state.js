import * as THREE from "three"
import { createPyramid } from "./PyramidMesh.js"

// Pyramid Group
export const pyramidGroup = createPyramid()
pyramidGroup.rotation.order = "YXZ"

// Set initial pyramid position
pyramidGroup.position.y = 0.35

// State Constants
export const initialPyramidState = {
	positionX: 0,
	positionY: 0.35,
	rotationY: 0,
	scale: 1,
}

export const flattenedMenuState = {
	// Position pyramid BELOW the labels so its base acts as an underline.
	positionY: 2.0,
	scale: 0.4,
	scaleY: 0.08, // Very flat - squished vertically for subtle underline effect
	scaleZ: 0.1, // Short height - squished Z for flatter triangle shape on screen
	rotationX: -1.4, // Tilt forward to show inverted triangle
}

export const pyramidXPositions = {
	home: -5.0,
	contact: -3.0,
	about: -1.0,
	bio: -1.0, // Alias for about
	blog: 1.0,
	portfolio: 3.0,
}

// Flattened label positions for horizontal menu at top.
// These are WORLD positions - values that stay within camera view.
export const flattenedLabelPositions = {
	Home: { x: -5.0, y: 2.5, z: 0 },
	Contact: { x: -3.0, y: 2.5, z: 0 },
	About: { x: -1.0, y: 2.5, z: 0 },
	Blog: { x: 1.0, y: 2.5, z: 0 },
	Portfolio: { x: 3.0, y: 2.5, z: 0 },
}

// Mutable State
let currentSection = null
export const getCurrentSection = () => currentSection
export const setCurrentSection = (val) => {
	currentSection = val
}

let pyramidAnimToken = 0
export const getPyramidAnimToken = () => pyramidAnimToken
export const incrementPyramidAnimToken = () => ++pyramidAnimToken

// Camera State (initialized later in pyramid.js)
export const initialCameraState = {
	position: new THREE.Vector3(0, 0, 6),
	target: new THREE.Vector3(0, 0, 0),
}

export const setInitialCameraState = (pos, target) => {
	initialCameraState.position.copy(pos)
	initialCameraState.target.copy(target)
}
