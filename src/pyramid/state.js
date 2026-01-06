import * as THREE from "three"
import { createPyramid } from "./PyramidMesh.js"

// Pyramid Group
export const pyramidGroup = createPyramid()

// State Constants
export const initialPyramidState = {
	positionX: 0,
	positionY: 0.35,
	rotationY: 0,
	scale: 1,
}

export const flattenedMenuState = {
	// Position pyramid BELOW the labels so its base acts as an underline.
	positionY: 2.2,
	scale: 0.4,
	scaleY: 0.08, // Very flat - squished vertically for subtle underline effect
	scaleZ: 0.1, // Short height - squished Z for flatter triangle shape on screen
	rotationX: -1.4, // Tilt forward to show inverted triangle
}

export const pyramidXPositions = {
	about: -1.0,
	bio: -1.0, // Alias for about
	blog: 1.0,
	portfolio: 3.0,
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
