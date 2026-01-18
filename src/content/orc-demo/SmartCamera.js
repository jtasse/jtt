import * as THREE from "three"
import {
	getDecommissionState,
	getDecommissionConfig,
	orcGroup,
} from "./orc-demo.js"

export class SmartCamera {
	constructor(camera, controls) {
		this.camera = camera
		this.controls = controls
		this.isTracking = false
		this.originalState = null
	}

	update() {
		const decommState = getDecommissionState()

		if (decommState) {
			// === Tracking Mode ===
			if (!this.isTracking) {
				this.isTracking = true
				this.originalState = {
					position: this.camera.position.clone(),
					target: this.controls.target.clone(),
				}
			}

			const handPos = decommState.position.clone()

			// Calculate planet center in world space
			const planetCenter = new THREE.Vector3()
			if (orcGroup) {
				orcGroup.getWorldPosition(planetCenter)
			}

			// Offset target slightly to the right (sidebar compensation)
			const sidebarCompensation = 0.4

			let targetCamPos
			let adjustedTarget

			// Use orbit-specific camera config if available
			if (decommState.cameraOffset && decommState.cameraDistance) {
				// Camera position: hand position + (normalized offset * distance)
				const offset = new THREE.Vector3(
					decommState.cameraOffset.x,
					decommState.cameraOffset.y,
					decommState.cameraOffset.z
				).normalize().multiplyScalar(decommState.cameraDistance)

				targetCamPos = handPos.clone().add(offset)

				// Camera looks at hand + lookAt offset
				adjustedTarget = handPos.clone()
				if (decommState.cameraLookAt) {
					adjustedTarget.add(new THREE.Vector3(
						decommState.cameraLookAt.x,
						decommState.cameraLookAt.y,
						decommState.cameraLookAt.z
					))
				}
				adjustedTarget.x += sidebarCompensation
			} else {
				// Fallback: Legacy camera calculation
				adjustedTarget = handPos.clone()
				adjustedTarget.x += sidebarCompensation

				const dirFromCenter = handPos.clone().sub(planetCenter).normalize()
				const targetDistance = decommState.targetZoomDistance
				const cameraOffset = dirFromCenter.clone().multiplyScalar(targetDistance)
				cameraOffset.y += targetDistance * 0.3

				targetCamPos = handPos.clone().add(cameraOffset)
			}

			// === Occlusion Avoidance ===
			// Check if the planet is blocking the view of the satellite
			const currentCamPos = this.camera.position.clone()
			const camToSat = satPos.clone().sub(currentCamPos)
			const camToPlanet = planetCenter.clone().sub(currentCamPos)
			const camToSatLength = camToSat.length()
			const projLength = camToPlanet.dot(camToSat.normalize())

			let isOccluded = false
			if (projLength > 0 && projLength < camToSatLength) {
				// Camera is looking past the planet to see the satellite
				const closestPointOnLine = currentCamPos
					.clone()
					.add(camToSat.normalize().multiplyScalar(projLength))
				const perpDistance = planetCenter.distanceTo(closestPointOnLine)
				// Planet radius is ~0.5, plus atmosphere and margin
				isOccluded = perpDistance < 0.65
			}

			// Slow down camera if occluded to prevent clipping/jumping
			let cameraSpeed = decommState.cameraSpeed
			if (isOccluded) cameraSpeed = 0.15

			// Apply movement
			this.camera.position.lerp(targetCamPos, cameraSpeed)
			this.controls.target.lerp(adjustedTarget, cameraSpeed * 2)
		} else if (this.isTracking && this.originalState) {
			// === Reset Mode ===
			const resetSpeed = getDecommissionConfig().cameraResetSpeed
			this.camera.position.lerp(this.originalState.position, resetSpeed)
			this.controls.target.lerp(this.originalState.target, resetSpeed)

			// Snap to finish when close enough
			if (this.camera.position.distanceTo(this.originalState.position) < 0.05) {
				this.camera.position.copy(this.originalState.position)
				this.controls.target.copy(this.originalState.target)
				this.isTracking = false
				this.originalState = null
			}
		}
	}
}
