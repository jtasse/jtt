import * as THREE from "three"
import { makeLabelPlane } from "./planes.js"
import {
	pyramidGroup,
	labels,
	hoverTargets,
	initLabels,
	animatePyramid,
	resetPyramidToHome,
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

	// Check labels first (direct meshes)
	const labelIntersects = raycaster.intersectObjects(Object.values(labels))
	if (labelIntersects.length > 0) {
		const obj = labelIntersects[0].object
		handleLabelClick(obj)
		return
	}

	// If no direct label hit, check hover targets (they sit in front of labels)
	const hoverIntersects = raycaster.intersectObjects(
		Object.values(hoverTargets)
	)
	if (hoverIntersects.length > 0) {
		const hit = hoverIntersects[0].object
		const key = hit.userData && hit.userData.labelKey
		if (key && labels[key]) {
			handleLabelClick(labels[key])
			return
		}
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

// Extracted handler so both label meshes and hover targets can reuse logic
function handleLabelClick(obj) {
	if (obj.userData.name === "Bio") {
		// First bring the label to front/center, then animate pyramid down
		animateLabelToCenter(obj)
		animatePyramid(true, "bio")
	} else if (obj.userData.name === "Portfolio") {
		animateLabelToCenter(obj)
		animatePyramid(true, "portfolio")
	} else if (obj.userData.name === "Blog") {
		animateLabelToCenter(obj)
		animatePyramid(true, "blog")
	} else if (obj.userData.name === "Home") {
		// Clicking Home should behave like clicking the pyramid: animate up
		// and hide any visible content.
		animatePyramid(false, null)
	}
}
