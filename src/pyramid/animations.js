import * as THREE from "three"
import { scene, camera, controls } from "../core/SceneManager.js"
import {
	pyramidGroup,
	initialPyramidState,
	flattenedMenuState,
	pyramidXPositions,
	getCurrentSection,
	setCurrentSection,
	getPyramidAnimToken,
	incrementPyramidAnimToken,
	initialCameraState,
} from "./state.js"
import {
	showAboutPlane,
	showPortfolioPlane,
	showBlogPlane,
	hideAllPlanes,
} from "../content/ContentManager.js"

// Nav label scale (matches pyramid.js)
const navLabelScale = 1.0

export function animatePyramid(labelManager, down = true, section = null) {
	// capture a local token for this animation; incrementing global token
	// elsewhere (e.g. reset) will invalidate this animation's completion
	const myToken = incrementPyramidAnimToken()

	// Show Home and Contact labels when animating to nav (includes their hover targets)
	if (down) {
		labelManager.showHomeLabel()
	}

	pyramidGroup.visible = true
	const duration = 1000
	const startRotY = pyramidGroup.rotation.y
	const startRotX = pyramidGroup.rotation.x

	// No Y rotation when going to flattened state - pyramid slides horizontally
	// and always points straight down. Only reset Y rotation when returning home.
	const endRotY = down ? startRotY + Math.PI * 2 : initialPyramidState.rotationY
	if (down && section) {
		setCurrentSection(section)
	}

	// X rotation to tilt pyramid so apex points down (inverted triangle)
	const endRotX = down ? flattenedMenuState.rotationX || 0 : 0

	const startPosX = pyramidGroup.position.x
	const startPosY = pyramidGroup.position.y
	// Animate to TOP of screen
	const endPosY = down
		? flattenedMenuState.positionY
		: initialPyramidState.positionY
	// Animate X position to be behind the selected label
	const endPosX =
		down && section && pyramidXPositions[section] !== undefined
			? pyramidXPositions[section]
			: initialPyramidState.positionX || 0

	// Scaling - use non-uniform scale for flattened state
	const startScaleX = pyramidGroup.scale.x
	const startScaleY = pyramidGroup.scale.y
	const startScaleZ = pyramidGroup.scale.z
	const endScaleX = down ? flattenedMenuState.scale : initialPyramidState.scale
	const endScaleY = down
		? flattenedMenuState.scaleY || flattenedMenuState.scale
		: initialPyramidState.scale
	const endScaleZ = down
		? flattenedMenuState.scaleZ || flattenedMenuState.scale
		: initialPyramidState.scale

	// Store starting label positions and rotations for animation
	// Also pre-compute target positions based on FINAL pyramid state
	const labelStartStates = {}
	const labels = labelManager.getLabels()
	const labelTargetStates = {}
	for (const key in labels) {
		const labelMesh = labels[key]
		if (!labelMesh) continue

		// If going down (to menu) and label is not already fixed:
		// Detach from pyramid and move in World Space for a clear path.
		if (
			down &&
			labelManager.getNavPosition(key) &&
			!(labelMesh.userData && labelMesh.userData.fixedNav)
		) {
			// Update world matrix to ensure accurate world transforms
			labelMesh.updateMatrixWorld()
			const worldPos = new THREE.Vector3()
			labelMesh.getWorldPosition(worldPos)
			const worldQuat = new THREE.Quaternion()
			labelMesh.getWorldQuaternion(worldQuat)
			const worldScale = new THREE.Vector3()
			labelMesh.getWorldScale(worldScale)

			// Reparent to scene to animate freely in world space
			scene.add(labelMesh)
			labelMesh.position.copy(worldPos)
			labelMesh.quaternion.copy(worldQuat)
			labelMesh.scale.copy(worldScale)

			labelStartStates[key] = {
				position: worldPos.clone(),
				quaternion: worldQuat.clone(),
				scale: worldScale.clone(),
			}

			const flatPos = labelManager.getNavPosition(key)
			// Target: Flat position, Face camera (identity rotation), Scale based on navLabelScale
			labelTargetStates[key] = {
				position: new THREE.Vector3(flatPos.x, flatPos.y, flatPos.z),
				quaternion: new THREE.Quaternion(), // Identity (0,0,0) faces camera
				scale: new THREE.Vector3(navLabelScale, navLabelScale, 1),
			}
		} else {
			// Existing logic for !down or fixed labels (local space)
			labelStartStates[key] = {
				position: labelMesh.position.clone(),
				rotation: labelMesh.rotation.clone(),
				scale: labelMesh.scale.clone(),
				visible: labelMesh.visible,
			}
		}
	}

	const startTime = performance.now()
	function step(time) {
		// If this animation has been invalidated (a newer token exists), stop updating
		if (myToken !== getPyramidAnimToken()) return
		const t = Math.min((time - startTime) / duration, 1)
		pyramidGroup.rotation.x = startRotX + (endRotX - startRotX) * t
		pyramidGroup.rotation.y = startRotY + (endRotY - startRotY) * t
		pyramidGroup.position.x = startPosX + (endPosX - startPosX) * t
		pyramidGroup.position.y = startPosY + (endPosY - startPosY) * t
		// Non-uniform scaling for flattened pyramid effect
		const sx = startScaleX + (endScaleX - startScaleX) * t
		const sy = startScaleY + (endScaleY - startScaleY) * t
		const sz = startScaleZ + (endScaleZ - startScaleZ) * t
		pyramidGroup.scale.set(sx, sy, sz)

		// Animate labels to/from flattened horizontal positions
		for (const key in labels) {
			const labelMesh = labels[key]
			if (!labelMesh) continue
			const startState = labelStartStates[key]
			if (!startState) continue

			if (down && labelTargetStates[key]) {
				// Animate in World Space
				const targetState = labelTargetStates[key]
				labelMesh.position.lerpVectors(
					startState.position,
					targetState.position,
					t
				)
				if (startState.quaternion && targetState.quaternion) {
					labelMesh.quaternion.slerpQuaternions(
						startState.quaternion,
						targetState.quaternion,
						t
					)
				}
				labelMesh.scale.lerpVectors(startState.scale, targetState.scale, t)
			} else if (!down) {
				// Animate back to original positions
				const origPos = labelMesh.userData.origPosition
				const origRot = labelMesh.userData.origRotation
				const origScale = labelMesh.userData.originalScale
				if (origPos) {
					labelMesh.position.lerpVectors(startState.position, origPos, t)
				}
				if (origRot) {
					labelMesh.rotation.x =
						startState.rotation.x + (origRot.x - startState.rotation.x) * t
					labelMesh.rotation.y =
						startState.rotation.y + (origRot.y - startState.rotation.y) * t
					labelMesh.rotation.z =
						startState.rotation.z + (origRot.z - startState.rotation.z) * t
				}
				if (origScale) {
					const sx = startState.scale.x + (origScale.x - startState.scale.x) * t
					const sy = startState.scale.y + (origScale.y - startState.scale.y) * t
					const sz = startState.scale.z + (origScale.z - startState.scale.z) * t
					labelMesh.scale.set(sx, sy, sz)
				}
			}
		}

		if (t < 1) requestAnimationFrame(step)
		else {
			// If a newer animation has been started since this one began,
			// abort executing completion side-effects.
			if (myToken !== getPyramidAnimToken()) return

			// Snap labels to final positions
			for (const key in labels) {
				const labelMesh = labels[key]
				if (!labelMesh) continue

				if (down && labelTargetStates[key]) {
					// Already in scene and animated to target.
					// Just ensure exact final values.
					const flatPos = labelManager.getNavPosition(key)
					if (flatPos) {
						labelMesh.position.set(flatPos.x, flatPos.y, flatPos.z)
						labelMesh.rotation.set(0, 0, 0)
						labelMesh.scale.set(1, 1, 1)
						// Mark as fixed nav so it never moves again
						labelMesh.userData.fixedNav = true
					}
				} else if (!down) {
					// Snap to original
					const origPos = labelMesh.userData.origPosition
					const origRot = labelMesh.userData.origRotation
					const origScale = labelMesh.userData.originalScale
					// Ensure the label is a child of the pyramidGroup and restore local transforms
					if (labelMesh.parent !== pyramidGroup) pyramidGroup.add(labelMesh)
					if (origPos) labelMesh.position.copy(origPos)
					if (origRot) labelMesh.rotation.copy(origRot)
					if (origScale) labelMesh.scale.copy(origScale)
				}
			}

			// Show section content only if requested and this animation is still valid
			if (down) {
				if (section === "about" || section === "bio") showAboutPlane()
				else if (section === "portfolio") showPortfolioPlane()
				else if (section === "blog") showBlogPlane()
			} else {
				hideAllPlanes()
			}

			// Hide Home and Contact labels if returning to centered state (includes their hover targets)
			if (!down) {
				labelManager.hideHomeLabel()
			}
		}
	}
	requestAnimationFrame(step)
}

// Slide pyramid horizontally to position below a different label (when already at top)
export function spinPyramidToSection(section, onComplete = null) {
	console.log(`spinPyramidToSection(${section})`)
	if (!section || pyramidXPositions[section] === undefined) return

	const myToken = incrementPyramidAnimToken()
	pyramidGroup.visible = true

	const duration = 600

	const startPosX = pyramidGroup.position.x
	const endPosX = pyramidXPositions[section]

	const startRotY = pyramidGroup.rotation.y
	const endRotY = startRotY + Math.PI * 2

	setCurrentSection(section)

	const startTime = performance.now()
	function step(time) {
		if (myToken !== getPyramidAnimToken()) return
		const t = Math.min((time - startTime) / duration, 1)
		const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

		// Animate X position
		pyramidGroup.position.x = startPosX + (endPosX - startPosX) * eased
		// Animate rotation around Y-axis
		pyramidGroup.rotation.y = startRotY + (endRotY - startRotY) * eased

		if (t < 1) requestAnimationFrame(step)
		else {
			if (myToken !== getPyramidAnimToken()) return
			pyramidGroup.position.x = endPosX
			pyramidGroup.rotation.y = endRotY
			if (onComplete) onComplete()
		}
	}
	requestAnimationFrame(step)
}

// Reset pyramid to exact home state
export function resetPyramidToHome(labelManager) {
	// Invalidate any in-progress pyramid animations so their completion
	// handlers won't show content after we start resetting.
	const myToken = incrementPyramidAnimToken()
	// Clear current section
	setCurrentSection(null)
	pyramidGroup.visible = true
	const duration = 1000
	const startRotY = pyramidGroup.rotation.y
	const startRotX = pyramidGroup.rotation.x
	// Rotate back to initial rotation (Blog face forward, no tilt)
	const targetRotY = initialPyramidState.rotationY
	const targetRotX = 0 // Reset X rotation to 0 (no tilt)
	// Normalize and find shortest path for Y rotation
	const normalizedStart =
		((startRotY % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
	const normalizedTarget =
		((targetRotY % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
	let rotDiffY = normalizedTarget - normalizedStart
	if (rotDiffY > Math.PI) rotDiffY -= 2 * Math.PI
	if (rotDiffY < -Math.PI) rotDiffY += 2 * Math.PI
	const startPosX = pyramidGroup.position.x
	const endPosX = initialPyramidState.positionX // Reset X to center
	const startPosY = pyramidGroup.position.y
	const endPosY = initialPyramidState.positionY // Use stored initial position
	// Uniform scaling
	const startScaleX = pyramidGroup.scale.x
	const startScaleY = pyramidGroup.scale.y
	const startScaleZ = pyramidGroup.scale.z
	const endScale = initialPyramidState.scale

	// Camera reset - store starting camera position for animation
	const startCamPos = camera.position.clone()
	const endCamPos = initialCameraState.position.clone()

	// Capture label start states so we can animate them back to original positions
	const labelStartStates = {}
	const labels = labelManager.getLabels()
	for (const key in labels) {
		const labelMesh = labels[key]
		if (!labelMesh) continue

		// Ensure attached to pyramidGroup to animate in local space
		if (labelMesh.parent === scene) {
			pyramidGroup.attach(labelMesh)
		}

		labelStartStates[key] = {
			position: labelMesh.position.clone(),
			quaternion: labelMesh.quaternion.clone(),
			scale: labelMesh.scale.clone(),
		}
		// Clear fixedNav flag so labels can be animated again
		labelMesh.userData.fixedNav = false
	}

	const startTime = performance.now()
	function step(time) {
		if (myToken !== getPyramidAnimToken()) return
		const t = Math.min((time - startTime) / duration, 1)
		// Use easeInOut for smoother animation
		const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

		pyramidGroup.rotation.y = startRotY + rotDiffY * eased
		pyramidGroup.rotation.x = startRotX + (targetRotX - startRotX) * eased
		pyramidGroup.position.x = startPosX + (endPosX - startPosX) * eased
		pyramidGroup.position.y = startPosY + (endPosY - startPosY) * eased
		// Uniform scaling
		const sx = startScaleX + (endScale - startScaleX) * eased
		const sy = startScaleY + (endScale - startScaleY) * eased
		const sz = startScaleZ + (endScale - startScaleZ) * eased
		pyramidGroup.scale.set(sx, sy, sz)

		// Animate camera back to initial position
		camera.position.lerpVectors(startCamPos, endCamPos, eased)
		camera.lookAt(initialCameraState.target)
		controls.target.copy(initialCameraState.target)
		controls.update()

		// Animate labels back to their original positions (local space)
		for (const key in labels) {
			const labelMesh = labels[key]
			if (!labelMesh) continue
			const startState = labelStartStates[key]
			const origPos = labelMesh.userData.origPosition
			const origRot = labelMesh.userData.origRotation
			const origScale = labelMesh.userData.originalScale

			if (startState && origPos && origRot && origScale) {
				labelMesh.position.lerpVectors(startState.position, origPos, eased)

				const targetQuat = new THREE.Quaternion().setFromEuler(origRot)
				labelMesh.quaternion.slerpQuaternions(
					startState.quaternion,
					targetQuat,
					eased
				)

				labelMesh.scale.lerpVectors(startState.scale, origScale, eased)
			}
		}

		if (t < 1) requestAnimationFrame(step)
		else {
			// Ensure exact values after animation
			pyramidGroup.rotation.y = initialPyramidState.rotationY
			pyramidGroup.rotation.x = 0
			pyramidGroup.position.x = endPosX
			pyramidGroup.position.y = endPosY
			pyramidGroup.scale.set(endScale, endScale, endScale)

			// Ensure camera is exactly at initial position
			camera.position.copy(initialCameraState.position)
			camera.lookAt(initialCameraState.target)
			controls.target.copy(initialCameraState.target)
			controls.update()

			// Snap labels to exact original positions
			for (const key in labels) {
				const labelMesh = labels[key]
				if (!labelMesh) continue
				const origPos = labelMesh.userData.origPosition
				const origRot = labelMesh.userData.origRotation
				const origScale = labelMesh.userData.originalScale
				if (origPos) labelMesh.position.copy(origPos)
				if (origRot) labelMesh.rotation.copy(origRot)
				if (origScale) labelMesh.scale.copy(origScale)
				labelMesh.userData.fixedNav = false
			}

			// Hide Home and Contact labels after reset (includes their hover targets)
			labelManager.hideHomeLabel()
		}
	}
	requestAnimationFrame(step)
}
