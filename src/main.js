import * as THREE from "three"
import { makeLabelPlane } from "./planes.js"
import {
	pyramidGroup,
	labels,
	initLabels,
	animatePyramid,
	showBioPlane,
	showPortfolioPlane,
	animateLabelToCenter,
	scene,
	camera,
	renderer,
	animate,
} from "./pyramid/pyramid.js"

// Attach renderer DOM element
document.getElementById("scene-container").appendChild(renderer.domElement)

// Initialize Labels
initLabels(makeLabelPlane)

// Start animation loop
animate()

// === Click Handling ===
const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()

function onClick(event) {
	pointer.x = (event.clientX / window.innerWidth) * 2 - 1
	pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
	raycaster.setFromCamera(pointer, camera)

	// Check labels first
	const labelIntersects = raycaster.intersectObjects(Object.values(labels))
	if (labelIntersects.length > 0) {
		const obj = labelIntersects[0].object

		if (obj.userData.name === "Bio") {
			animatePyramid(true, "bio")
			animateLabelToCenter(obj)
		} else if (obj.userData.name === "Portfolio") {
			animatePyramid(true, "portfolio")
		}
		return
	}

	// Click on pyramid toggles back up
	const pyramidIntersects = raycaster.intersectObjects(
		pyramidGroup.children,
		true
	)
	if (pyramidIntersects.length > 0) {
		animatePyramid(false, null)
	}
}

window.addEventListener("click", onClick)
