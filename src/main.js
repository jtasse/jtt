import * as THREE from "three"
import { makeLabelPlane } from "./planes.js"
import {
	pyramidGroup,
	labels,
	hoverTargets,
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
let currentHover = null

function onPointerMove(event) {
	pointer.x = (event.clientX / window.innerWidth) * 2 - 1
	pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
	raycaster.setFromCamera(pointer, camera)

	// Prefer hoverTargets (larger invisible planes) for reliable hover
	const targets = hoverTargets
		? Object.values(hoverTargets)
		: Object.values(labels)
	const intersects = raycaster.intersectObjects(targets)
	if (intersects.length > 0) {
		const hit = intersects[0].object
		// Determine which label this hover target corresponds to
		const key = hit.userData && hit.userData.labelKey
		const labelMesh = key
			? labels[key]
			: hit.userData && hit.userData.name
			? hit
			: null
		if (labelMesh) {
			document.body.style.cursor = "pointer"
			if (currentHover !== labelMesh) {
				// reset previous
				if (currentHover) currentHover.scale.set(1, 1, 1)
				currentHover = labelMesh
				currentHover.scale.set(1.06, 1.06, 1.06)
			}
			return
		}
	}
	// no hover
	if (currentHover) {
		currentHover.scale.set(1, 1, 1)
		currentHover = null
	}
	document.body.style.cursor = "default"
}

window.addEventListener("pointermove", onPointerMove)

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
