import * as THREE from "three"
import {
	HandState,
	SEQUENCE_TIMINGS,
	SLAP_SLOW_MOTION_FACTOR,
	HAND_ORBIT_CONFIG,
} from "./HandConfig.js"
import {
	transitionToGesture,
	updateGestureAnimation,
	updatePlumeAnimation,
	calculateIrregularOrbitPosition,
	avoidSatellites,
	avoidPlanet,
	clampToFrontOfPlanet,
} from "./HandBehaviors.js"

// States where cancel is allowed
const CANCELLABLE_STATES = [
	HandState.POINTING,
	HandState.APPROACHING,
	HandState.WINDING_UP,
]

// State Machine to control Hand behavior
export class HandStateMachine {
	constructor(handGroup, sceneGroup, satellites, camera) {
		this.hand = handGroup
		this.orcGroup = sceneGroup
		this.satellites = satellites || []
		this.camera = camera
		this.state = HandState.IDLE_ORBIT
		this.targetSatellite = null
		this.stateData = {}

		this.timeScale = 1.0
		this.internalTime = 0
		this.lastFrameTime = performance.now()
		this.stateStartTime = 0
		this.orbitStartTime = 0

		// Selected satellite for pointing while orbiting
		this.selectedSatellite = null

		// Callbacks for external integration
		this.onSatelliteBurn = null
		this.onSatelliteDestroyed = null
		this.onSlowMotionStart = null
		this.onSlowMotionEnd = null
	}

	// Set the currently selected satellite (for pointing while orbiting)
	setSelectedSatellite(satellite) {
		this.selectedSatellite = satellite
		// If in idle orbit and satellite selected, start pointing
		if (satellite && this.state === HandState.IDLE_ORBIT) {
			transitionToGesture(this.hand, "point", 400)
		} else if (!satellite && this.state === HandState.IDLE_ORBIT) {
			transitionToGesture(this.hand, "fist", 400)
		}
	}

	transition(newState, data = {}) {
		console.log(`Hand state: ${this.state} -> ${newState}`)
		this.state = newState
		this.stateStartTime = this.internalTime

		// [DEBUG] Log position to catch NaNs early
		if (this.hand)
			console.log(
				`[DEBUG] Hand pos at transition: ${this.hand.position.x.toFixed(
					3
				)}, ${this.hand.position.y.toFixed(3)}, ${this.hand.position.z.toFixed(
					3
				)}`
			)

		this.stateData = { ...data }
		this.onEnterState(newState)
	}

	onEnterState(state) {
		switch (state) {
			case HandState.POINTING:
				transitionToGesture(this.hand, "point", 400)
				transitionToGesture(this.hand, "fist", 400)
				break
			case HandState.APPROACHING:
				transitionToGesture(this.hand, "fist", 200)
				this.stateData.startPosition = this.hand.position.clone()
				break
			case HandState.WINDING_UP:
				if (this.onSlowMotionStart) this.onSlowMotionStart()
				this.stateData.windUpStartRotation = this.hand.rotation.y
				break
			case HandState.SLAPPING:
				transitionToGesture(this.hand, "backhand", 100)
				this.stateData.slapApplied = false
				break
			case HandState.CELEBRATING:
				// LOCK the hand position RIGHT NOW
				this.stateData.lockedPosition = this.hand.position.clone()
				this.stateData.lockedRotation = this.hand.quaternion.clone()
				this.stateData.thumbsUpStarted = false
				this.stateData.thumbsUpStartTime = null
				break
			case HandState.RETURNING:
				transitionToGesture(this.hand, "fist", 400)
				this.stateData.returnStartPosition = this.hand.position.clone()
				this.timeScale = 1.0 // Ensure normal speed on return
				if (this.onSlowMotionEnd) this.onSlowMotionEnd()
				break
			case HandState.CANCELLED:
				transitionToGesture(this.hand, "fist", 300)
				this.stateData.cancelStartPosition = this.hand.position.clone()
				break
			case HandState.IDLE_ORBIT:
				transitionToGesture(this.hand, "fist", 400)
				break
		}
	}

	getElapsedTime() {
		return this.internalTime - this.stateStartTime
	}

	canCancel() {
		return CANCELLABLE_STATES.includes(this.state)
	}

	cancel() {
		if (!this.canCancel()) return false

		// If satellite is attached to hand, detach it
		if (
			this.targetSatellite &&
			this.hand.children.includes(this.targetSatellite)
		) {
			const worldPos = new THREE.Vector3()
			this.targetSatellite.getWorldPosition(worldPos)
			this.hand.remove(this.targetSatellite)
			this.orcGroup.add(this.targetSatellite)
			this.targetSatellite.position.copy(worldPos)
		}

		this.transition(HandState.CANCELLED, {
			satellite: this.targetSatellite,
		})

		return true
	}

	startDecommission(satellite) {
		if (this.state !== HandState.IDLE_ORBIT) return false

		this.targetSatellite = satellite
		const targetPos = new THREE.Vector3()
		satellite.getWorldPosition(targetPos)

		this.transition(HandState.POINTING, {
			targetPosition: targetPos,
		})

		return true
	}

	update() {
		const now = performance.now()
		const realDt = Math.min(now - this.lastFrameTime, 100) // Cap dt
		this.lastFrameTime = now

		const dt = realDt * this.timeScale
		this.internalTime += dt

		// Update gesture animation
		updateGestureAnimation(dt)

		// Update plume based on state
		const plumeIntensity = this.state === HandState.IDLE_ORBIT ? 0.4 : 1.0
		updatePlumeAnimation(
			this.hand.userData.plume,
			plumeIntensity,
			this.internalTime
		)

		// State-specific update
		switch (this.state) {
			case HandState.IDLE_ORBIT:
				this.updateIdleOrbit()
				break
			case HandState.POINTING:
				this.updatePointing()
				break
			case HandState.APPROACHING:
				this.updateApproaching()
				break
			case HandState.WINDING_UP:
				this.updateWindingUp()
				break
			case HandState.SLAPPING:
				this.updateSlapping(dt)
				break
			case HandState.CELEBRATING:
				this.updateCelebrating()
				break
			case HandState.RETURNING:
				this.updateReturning()
				break
			case HandState.CANCELLED:
				this.updateCancelled()
				break
		}
	}

	updateIdleOrbit() {
		const time = this.internalTime - this.orbitStartTime
		const targetPos = calculateIrregularOrbitPosition(time, this.hand.position)

		// Apply satellite avoidance
		const avoidance = avoidSatellites(this.hand.position, this.satellites)
		targetPos.add(avoidance)

		// Apply planet collision avoidance
		const planetAvoidance = avoidPlanet(targetPos)
		targetPos.add(planetAvoidance)

		// Smooth movement toward target
		this.hand.position.lerp(targetPos, 0.02)

		// If a satellite is selected, point index fingertip at it like an arrow
		if (this.selectedSatellite) {
			const satPos = new THREE.Vector3()
			this.selectedSatellite.getWorldPosition(satPos)

			// The index finger extends in local +Y direction when in pointing pose
			// Think of it as an arrow: we need to rotate the hand so its +Y axis
			// points directly at the satellite's position in space
			const localFingerDirection = new THREE.Vector3(0, 1, 0)

			// Calculate the world direction from hand to satellite
			const worldDirectionToSat = satPos
				.clone()
				.sub(this.hand.position)
				.normalize()

			// Create quaternion that rotates local +Y to point at satellite
			const targetQuat = new THREE.Quaternion().setFromUnitVectors(
				localFingerDirection,
				worldDirectionToSat
			)

			// Smoothly rotate to point at satellite
			this.hand.quaternion.slerp(targetQuat, 0.04)
		} else {
			// Face direction of travel when no satellite selected
			const velocity = targetPos.clone().sub(this.hand.position)
			if (velocity.length() > 0.001) {
				const lookTarget = this.hand.position.clone().add(velocity.normalize())
				this.hand.lookAt(lookTarget)
				// Rotate so palm faces forward
				this.hand.rotateY(Math.PI / 2)
			}
		}
	}

	updatePointing() {
		const elapsed = this.getElapsedTime()

		// Continue gentle movement while pointing
		const time = this.internalTime - this.orbitStartTime
		const targetPos = calculateIrregularOrbitPosition(time, this.hand.position)
		this.hand.position.lerp(targetPos, 0.008)

		// Point index fingertip at satellite like an arrow
		if (this.targetSatellite) {
			const satPos = new THREE.Vector3()
			this.targetSatellite.getWorldPosition(satPos)

			// The index finger extends in local +Y direction
			// Rotate hand so +Y points directly at satellite position
			const localFingerDirection = new THREE.Vector3(0, 1, 0)
			const worldDirectionToSat = satPos
				.clone()
				.sub(this.hand.position)
				.normalize()

			const targetQuat = new THREE.Quaternion().setFromUnitVectors(
				localFingerDirection,
				worldDirectionToSat
			)

			// Smoothly rotate to maintain arrow-like pointing
			this.hand.quaternion.slerp(targetQuat, 0.06)
		}

		// Transition after duration + pause
		if (
			elapsed >
			SEQUENCE_TIMINGS.pointDuration + SEQUENCE_TIMINGS.pointPause
		) {
			this.transition(HandState.APPROACHING)
		}
	}

	updateApproaching() {
		const elapsed = this.getElapsedTime()
		const t = Math.min(elapsed / SEQUENCE_TIMINGS.approachDuration, 1)

		// Cubic ease-in-out
		const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

		if (this.targetSatellite) {
			const targetPos = new THREE.Vector3()
			this.targetSatellite.getWorldPosition(targetPos)

			// Check if this is a LEO satellite (close to planet)
			const satDistance = targetPos.length()
			const isLEO = satDistance < 0.8 // LEO orbit is 0.65, GEO is 2.0

			// If satellite is behind the planet (negative Z), we need a special approach
			// that keeps the hand in front of the planet at all times
			const satBehindPlanet = targetPos.z < 0.5 // MIN_FRONT_Z

			// Calculate path that avoids the planet
			// Use an arc if direct path would go through planet
			const startPos = this.stateData.startPosition
			const directPath = targetPos.clone().sub(startPos)
			const midPoint = startPos
				.clone()
				.add(directPath.clone().multiplyScalar(0.5))
			const midDistance = midPoint.length()

			// For LEO satellites, always use an arc approach to stay clear of planet
			// If midpoint is too close to planet OR satellite is behind planet, arc around it
			let interpolatedPos
			if (
				midDistance < HAND_ORBIT_CONFIG.minPlanetDistance ||
				satBehindPlanet ||
				isLEO
			) {
				// Create an arc path by pushing the midpoint outward
				// ALWAYS bias towards camera (positive Z) to stay visible
				let pushDirection

				if (this.camera) {
					// Use camera direction as primary push direction
					pushDirection = this.camera.position.clone().normalize()
				} else {
					// Fallback: push toward positive Z (camera direction)
					pushDirection = new THREE.Vector3(0, 0, 1)
				}

				// Add some XY component from the midpoint for more natural arc
				const xyBias = new THREE.Vector3(midPoint.x, midPoint.y, 0)
				if (xyBias.lengthSq() > 0.01) {
					xyBias.normalize().multiplyScalar(0.3)
					pushDirection.add(xyBias)
					pushDirection.normalize()
				}

				// For LEO satellites, push the arc further out to avoid planet proximity
				const arcRadius = isLEO
					? HAND_ORBIT_CONFIG.minPlanetDistance * 2.0
					: HAND_ORBIT_CONFIG.minPlanetDistance * 1.5

				// Ensure arc midpoint has strong positive Z to stay in front
				const arcMidPoint = pushDirection.multiplyScalar(arcRadius)
				// Force arc midpoint to stay in front of planet
				arcMidPoint.z = Math.max(
					arcMidPoint.z,
					0.5 + (isLEO ? 0.6 : 0.3) // MIN_FRONT_Z + buffer
				)

				// Quadratic bezier interpolation for smooth arc
				const oneMinusT = 1 - eased
				interpolatedPos = startPos
					.clone()
					.multiplyScalar(oneMinusT * oneMinusT)
					.add(arcMidPoint.clone().multiplyScalar(2 * oneMinusT * eased))
					.add(targetPos.clone().multiplyScalar(eased * eased))
			} else {
				// Direct path is safe
				interpolatedPos = startPos.clone().lerp(targetPos, eased)
			}

			// Apply planet collision clamping AND ensure we stay in front
			clampToFrontOfPlanet(interpolatedPos)
			this.hand.position.copy(interpolatedPos)

			// Face satellite
			const direction = targetPos.clone().sub(this.hand.position).normalize()
			if (direction.length() > 0) {
				const up = new THREE.Vector3(0, 1, 0)
				const rotMatrix = new THREE.Matrix4().lookAt(
					new THREE.Vector3(),
					direction,
					up
				)
				const targetQuat = new THREE.Quaternion().setFromRotationMatrix(
					rotMatrix
				)
				this.hand.quaternion.slerp(targetQuat, 0.1)
			}
		}

		if (t >= 1) {
			// Skip grab/carry/release - go straight to wind up
			this.transition(HandState.WINDING_UP)
		}
	}

	updateWindingUp() {
		const elapsed = this.getElapsedTime()
		const t = Math.min(elapsed / SEQUENCE_TIMINGS.windUpDuration, 1)

		// Smooth ease-in-out for graceful wind-up
		const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

		// Engage slow motion during wind up
		this.timeScale = SLAP_SLOW_MOTION_FACTOR

		if (this.targetSatellite) {
			const satPos = new THREE.Vector3()
			this.targetSatellite.getWorldPosition(satPos)

			// Position hand for a swing toward the satellite
			// Calculate vector from Earth to Satellite
			const earthToSat = satPos.clone()
			if (earthToSat.lengthSq() < 0.0001) {
				earthToSat.set(0, 1, 0) // Fallback
			} else {
				earthToSat.normalize()
			}

			// Check if this is a LEO satellite (close to planet)
			const satDistance = satPos.length()
			const isLEO = satDistance < 0.8 // LEO orbit is 0.65, GEO is 2.0

			// Wind up position: outside the orbit but ALWAYS in front of planet
			// For LEO satellites, use a larger wind-up distance to stay clear of planet
			const windUpDist = isLEO ? 1.2 : 0.8
			let windUpPos = satPos
				.clone()
				.add(earthToSat.clone().multiplyScalar(windUpDist))

			// For LEO satellites, ALWAYS swing from above/side to avoid planet proximity
			// The satellite is so close to the planet that we need a different approach angle
			if (isLEO) {
				// Position above and to the side of the satellite for a downward swing
				// This keeps the hand far from the planet surface
				const lateralDir = new THREE.Vector3(satPos.x, 0, satPos.z)
				if (lateralDir.lengthSq() > 0.01) {
					lateralDir.normalize()
				} else {
					lateralDir.set(1, 0, 0)
				}

				// Wind up position: above the satellite and pushed outward
				windUpPos = new THREE.Vector3(
					satPos.x + lateralDir.x * 0.5,
					satPos.y + 0.8, // Above the satellite
					Math.max(0.5 + 0.5, satPos.z + 0.6) // In front of planet
				)
			} else if (windUpPos.z < 0.5) {
				// If the wind-up position would be behind the planet, reposition
				// to the side/front while maintaining ability to swing at satellite
				// Calculate a position that's in front of planet but offset to swing from
				// Use the satellite's XY position to determine swing direction
				const swingDir = new THREE.Vector3(satPos.x, satPos.y, 0)
				if (swingDir.lengthSq() > 0.01) {
					swingDir.normalize()
				} else {
					swingDir.set(1, 0, 0) // Default swing from right
				}

				// Position to the side of the satellite, in front of planet
				windUpPos = new THREE.Vector3(
					satPos.x + swingDir.x * windUpDist,
					satPos.y + swingDir.y * windUpDist * 0.5,
					Math.max(0.5 + 0.3, satPos.z + 0.5)
				)
			}

			// Final safety clamp
			clampToFrontOfPlanet(windUpPos)
			this.hand.position.lerp(windUpPos, 0.1)

			// Rotate hand to face satellite, with palm ready for backhand
			const toSatellite = satPos.clone().sub(this.hand.position)
			if (toSatellite.lengthSq() < 0.0001) {
				toSatellite.set(0, 0, 1) // Fallback
			} else {
				toSatellite.normalize()
			}
			const up = new THREE.Vector3(0, 1, 0)
			const rotMatrix = new THREE.Matrix4().lookAt(
				new THREE.Vector3(),
				toSatellite,
				up
			)
			const targetQuat = new THREE.Quaternion().setFromRotationMatrix(rotMatrix)

			// Add wind-up rotation (pull arm back)
			const windUpQuat = new THREE.Quaternion().setFromAxisAngle(
				new THREE.Vector3(0, 1, 0),
				-eased * Math.PI * 0.4 // Wind up by rotating away
			)
			targetQuat.multiply(windUpQuat)

			this.hand.quaternion.slerp(targetQuat, 0.06)
		}

		if (t >= 1) {
			this.transition(HandState.SLAPPING)
		}
	}

	updateSlapping(dt) {
		const elapsed = this.getElapsedTime()
		const t = Math.min(elapsed / SEQUENCE_TIMINGS.slapDuration, 1)

		// Linear swing for impact
		const eased = t // Linear is good for impact speed

		if (this.targetSatellite) {
			const satPos = new THREE.Vector3()
			this.targetSatellite.getWorldPosition(satPos)

			// Swing THROUGH the satellite toward Earth
			// Start from current hand pos (wind up pos)
			// End pos is past the satellite

			// Vector from Hand to Satellite
			const toSat = satPos.clone().sub(this.hand.position)
			if (toSat.lengthSq() < 0.0001) {
				toSat.set(0, -1, 0) // Fallback if on top of it
			} else {
				toSat.normalize()
			}

			const moveSpeed = 0.02 // units per ms
			this.hand.position.add(toSat.multiplyScalar(moveSpeed * dt))

			clampToFrontOfPlanet(this.hand.position)

			// Check for contact
			const dist = this.hand.position.distanceTo(satPos)
			const CONTACT_THRESHOLD = 0.5

			if (dist < CONTACT_THRESHOLD && !this.stateData.slapApplied) {
				this.stateData.slapApplied = true

				// Trigger satellite burn / launch EXACTLY on contact
				if (this.onSatelliteBurn) {
					this.onSatelliteBurn(this.targetSatellite)
				}

				// Transition to celebrate - thumbs up will start THERE after hand stops
				this.transition(HandState.CELEBRATING, {
					burnStartTime: this.internalTime,
				})
			}
		}

		// Failsafe transition if missed
		if (t >= 1 && !this.stateData.slapApplied) {
			this.transition(HandState.CELEBRATING, {
				burnStartTime: this.internalTime,
			})
		}
	}

	updateCelebrating() {
		const elapsed = this.getElapsedTime()

		// Keep position locked - no movement allowed
		this.hand.position.copy(this.stateData.lockedPosition)

		// Phase 1: Wait for satellite to be destroyed - keep original rotation
		if (this.targetSatellite) {
			this.hand.quaternion.copy(this.stateData.lockedRotation)
			if (elapsed > 1500 && this.onSatelliteDestroyed) {
				this.onSatelliteDestroyed(this.targetSatellite)
				this.targetSatellite = null
			}
			return
		}

		// Phase 2: Satellite is gone - now do thumbs up
		if (!this.stateData.thumbsUpStarted) {
			this.stateData.thumbsUpStarted = true
			this.stateData.thumbsUpStartTime = this.internalTime
			transitionToGesture(this.hand, "thumbsUp", 500)

			// Calculate target rotation: palm faces camera, thumb points straight up
			// Like looking at Washington Monument from the front - thumb rises vertically
			// - Palm (local +Z) faces camera (world +Z)
			// - Fingers (local +Y) point sideways (world +X, to the right)
			// - Thumb side (local -X) points up (world +Y)
			const targetQuat = new THREE.Quaternion()

			// Use makeBasis to define where each local axis points in world space
			const localXInWorld = new THREE.Vector3(0, -1, 0) // local X points down
			const localYInWorld = new THREE.Vector3(1, 0, 0) // fingers point right
			const localZInWorld = new THREE.Vector3(0, 0, 1) // palm faces camera

			const rotMatrix = new THREE.Matrix4()
			rotMatrix.makeBasis(localXInWorld, localYInWorld, localZInWorld)
			targetQuat.setFromRotationMatrix(rotMatrix)

			this.stateData.targetThumbsUpQuat = targetQuat
		}

		// Smoothly rotate to thumbs-up orientation
		if (this.stateData.targetThumbsUpQuat) {
			const rotationProgress = Math.min(
				(this.internalTime - this.stateData.thumbsUpStartTime) / 500,
				1
			)
			const eased =
				rotationProgress < 0.5
					? 4 * rotationProgress * rotationProgress * rotationProgress
					: 1 - Math.pow(-2 * rotationProgress + 2, 3) / 2

			this.hand.quaternion
				.copy(this.stateData.lockedRotation)
				.slerp(this.stateData.targetThumbsUpQuat, eased)
		}

		// After 3 seconds of thumbs up, transition to RETURNING
		const thumbsUpElapsed = this.internalTime - this.stateData.thumbsUpStartTime
		const thumbsUpDuration = 3000
		if (thumbsUpElapsed > thumbsUpDuration) {
			this.transition(HandState.RETURNING)
		}
	}

	updateReturning() {
		const elapsed = this.getElapsedTime()
		const t = Math.min(elapsed / SEQUENCE_TIMINGS.returnDuration, 1)

		// Smooth ease-in-out for graceful return
		const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

		// Return to orbit position
		const time = this.internalTime - this.orbitStartTime
		const targetPos = calculateIrregularOrbitPosition(time)
		const startPos = this.stateData.returnStartPosition

		// Check if direct path would go through planet or if start is behind planet
		const midPoint = startPos.clone().lerp(targetPos, 0.5)
		const midDistance = midPoint.length()
		const startBehindPlanet = startPos.z < 0.5 // MIN_FRONT_Z

		let interpolatedPos
		if (
			midDistance < HAND_ORBIT_CONFIG.minPlanetDistance ||
			startBehindPlanet
		) {
			// Arc around the planet, always staying in front
			let pushDirection
			if (this.camera) {
				pushDirection = this.camera.position.clone().normalize()
			} else {
				pushDirection = new THREE.Vector3(0, 0, 1)
			}

			const arcMidPoint = pushDirection.multiplyScalar(
				HAND_ORBIT_CONFIG.minPlanetDistance * 1.5
			)
			// Ensure arc stays in front
			arcMidPoint.z = Math.max(arcMidPoint.z, 0.5 + 0.3) // MIN_FRONT_Z + buffer

			// Quadratic bezier interpolation for smooth arc
			const oneMinusT = 1 - eased
			interpolatedPos = startPos
				.clone()
				.multiplyScalar(oneMinusT * oneMinusT)
				.add(arcMidPoint.clone().multiplyScalar(2 * oneMinusT * eased))
				.add(targetPos.clone().multiplyScalar(eased * eased))
		} else {
			interpolatedPos = startPos.clone().lerp(targetPos, eased)
		}

		// Final safety clamp - stay in front of planet
		clampToFrontOfPlanet(interpolatedPos)
		this.hand.position.copy(interpolatedPos)

		// Gradually return to orbit orientation
		const velocity = targetPos.clone().sub(this.hand.position)
		if (velocity.length() > 0.001) {
			const targetQuat = new THREE.Quaternion()
			const up = new THREE.Vector3(0, 1, 0)
			const dir = velocity.normalize()

			// Guard against parallel vectors causing NaN in lookAt
			if (Math.abs(dir.dot(up)) > 0.99) {
				up.set(0, 0, 1)
			}

			const rotMatrix = new THREE.Matrix4().lookAt(new THREE.Vector3(), dir, up)
			targetQuat.setFromRotationMatrix(rotMatrix)
			this.hand.quaternion.slerp(targetQuat, 0.03)
		}

		if (t >= 1) {
			this.transition(HandState.IDLE_ORBIT)
		}
	}

	updateCancelled() {
		const elapsed = this.getElapsedTime()
		const t = Math.min(elapsed / 1000, 1) // 1 second to return
		const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

		// Return to orbit
		const time = this.internalTime - this.orbitStartTime
		const targetPos = calculateIrregularOrbitPosition(time)
		const startPos = this.stateData.cancelStartPosition

		// Check if direct path would go through planet or if start is behind planet
		const midPoint = startPos.clone().lerp(targetPos, 0.5)
		const midDistance = midPoint.length()
		const startBehindPlanet = startPos.z < 0.5 // MIN_FRONT_Z

		let interpolatedPos
		if (
			midDistance < HAND_ORBIT_CONFIG.minPlanetDistance ||
			startBehindPlanet
		) {
			// Arc around the planet, always staying in front
			let pushDirection
			if (this.camera) {
				pushDirection = this.camera.position.clone().normalize()
			} else {
				pushDirection = new THREE.Vector3(0, 0, 1)
			}

			const arcMidPoint = pushDirection.multiplyScalar(
				HAND_ORBIT_CONFIG.minPlanetDistance * 1.5
			)
			// Ensure arc stays in front
			arcMidPoint.z = Math.max(arcMidPoint.z, 0.5 + 0.3) // MIN_FRONT_Z + buffer

			// Quadratic bezier interpolation for smooth arc
			const oneMinusT = 1 - eased
			interpolatedPos = startPos
				.clone()
				.multiplyScalar(oneMinusT * oneMinusT)
				.add(arcMidPoint.clone().multiplyScalar(2 * oneMinusT * eased))
				.add(targetPos.clone().multiplyScalar(eased * eased))
		} else {
			interpolatedPos = startPos.clone().lerp(targetPos, eased)
		}

		// Final safety clamp - stay in front of planet
		clampToFrontOfPlanet(interpolatedPos)
		this.hand.position.copy(interpolatedPos)

		if (t >= 1) {
			this.targetSatellite = null
			this.transition(HandState.IDLE_ORBIT)
		}
	}
}
