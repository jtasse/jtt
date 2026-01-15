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
	clampToPlanetSurface,
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
				// Use fist for GEO punch, backhand for LEO/Molniya slap
				if (this.stateData.isGeoPunch) {
					transitionToGesture(this.hand, "fist", 100)
				} else {
					transitionToGesture(this.hand, "backhand", 100)
				}
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

			const satDistance = targetPos.length()
			// GEO satellites are at altitude ~2.0, LEO at ~0.65, Molniya varies (elliptical)
			const isGEO = this.targetSatellite.userData.isGeosynchronous === true

			const startPos = this.stateData.startPosition
			let interpolatedPos

			if (isGEO) {
				// GEO PUNCH: Position hand FAR BEHIND satellite (further from Earth)
				// Hand will punch TOWARD Earth, through the satellite
				this.stateData.isGeoPunch = true

				const earthToSat = targetPos.clone().normalize()
				const satDistance = targetPos.length()

				// Hand approaches to a position BEYOND the satellite (further from Earth)
				// This is the "cocked back" position before the wind-up pulls even further
				const approachDistance = satDistance + 0.8 // Beyond satellite
				const approachPos = earthToSat.clone().multiplyScalar(approachDistance)

				// Store punch line direction (toward Earth, through satellite)
				this.stateData.punchLineDirection = earthToSat.clone().negate()
				this.stateData.satelliteDistance = satDistance

				// Simple arc to approach position
				interpolatedPos = startPos.clone().lerp(approachPos, eased)

				// Keep hand visible (don't go behind planet from camera view)
				if (interpolatedPos.z < 0.3) {
					interpolatedPos.z = 0.3
				}

			} else {
				// LEO/Molniya: Original slap behavior - approach from front
				this.stateData.isGeoPunch = false

				const isLEO = satDistance < 0.8
				const satBehindPlanet = targetPos.z < 0.5
				const directPath = targetPos.clone().sub(startPos)
				const midPoint = startPos.clone().add(directPath.clone().multiplyScalar(0.5))
				const midDistance = midPoint.length()

				if (midDistance < HAND_ORBIT_CONFIG.minPlanetDistance || satBehindPlanet || isLEO) {
					let pushDirection = this.camera
						? this.camera.position.clone().normalize()
						: new THREE.Vector3(0, 0, 1)

					const xyBias = new THREE.Vector3(midPoint.x, midPoint.y, 0)
					if (xyBias.lengthSq() > 0.01) {
						xyBias.normalize().multiplyScalar(0.3)
						pushDirection.add(xyBias)
						pushDirection.normalize()
					}

					const arcRadius = isLEO
						? HAND_ORBIT_CONFIG.minPlanetDistance * 2.0
						: HAND_ORBIT_CONFIG.minPlanetDistance * 1.5
					const arcMidPoint = pushDirection.multiplyScalar(arcRadius)
					arcMidPoint.z = Math.max(arcMidPoint.z, 0.5 + (isLEO ? 0.6 : 0.3))

					const oneMinusT = 1 - eased
					interpolatedPos = startPos.clone().multiplyScalar(oneMinusT * oneMinusT)
						.add(arcMidPoint.clone().multiplyScalar(2 * oneMinusT * eased))
						.add(targetPos.clone().multiplyScalar(eased * eased))
				} else {
					interpolatedPos = startPos.clone().lerp(targetPos, eased)
				}

				clampToFrontOfPlanet(interpolatedPos)
			}

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
				const targetQuat = new THREE.Quaternion().setFromRotationMatrix(rotMatrix)
				this.hand.quaternion.slerp(targetQuat, 0.1)
			}
		}

		if (t >= 1) {
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

			const earthToSat = satPos.clone()
			if (earthToSat.lengthSq() < 0.0001) {
				earthToSat.set(0, 1, 0)
			} else {
				earthToSat.normalize()
			}

			const satDistance = satPos.length()
			const isLEO = satDistance < 0.8
			let windUpPos

			if (this.stateData.isGeoPunch) {
				// GEO PUNCH: Pull hand WAY BACK in a straight line from Earth
				// Like winding up for a massive punch toward Earth
				this.timeScale = 0.15 // Very slow for dramatic effect

				const satDistance = this.stateData.satelliteDistance || satPos.length()

				// Wind-up position: Pull hand FURTHER from Earth (beyond satellite)
				// Start at satDistance + 0.8, pull back to satDistance + 2.5
				const pullBackDistance = satDistance + 0.8 + eased * 1.7

				// Position directly along the Earth-to-satellite line
				windUpPos = earthToSat.clone().multiplyScalar(pullBackDistance)

				// Store the wind-up end position for the punch
				this.stateData.windUpEndPos = earthToSat.clone().multiplyScalar(satDistance + 2.5)
				this.stateData.punchDirection = earthToSat.clone().negate() // Toward Earth

				// Keep hand visible to camera
				if (windUpPos.z < 0.2) {
					windUpPos.z = 0.2
				}

			} else {
				// LEO/Molniya: Original slap behavior
				const windUpDist = isLEO ? 1.2 : 0.8
				windUpPos = satPos.clone().add(earthToSat.clone().multiplyScalar(windUpDist))

				if (isLEO) {
					const lateralDir = new THREE.Vector3(satPos.x, 0, satPos.z)
					if (lateralDir.lengthSq() > 0.01) {
						lateralDir.normalize()
					} else {
						lateralDir.set(1, 0, 0)
					}
					windUpPos = new THREE.Vector3(
						satPos.x + lateralDir.x * 0.5,
						satPos.y + 0.8,
						Math.max(0.5 + 0.5, satPos.z + 0.6)
					)
				} else if (windUpPos.z < 0.5) {
					const swingDir = new THREE.Vector3(satPos.x, satPos.y, 0)
					if (swingDir.lengthSq() > 0.01) {
						swingDir.normalize()
					} else {
						swingDir.set(1, 0, 0)
					}
					windUpPos = new THREE.Vector3(
						satPos.x + swingDir.x * windUpDist,
						satPos.y + swingDir.y * windUpDist * 0.5,
						Math.max(0.5 + 0.3, satPos.z + 0.5)
					)
				}

				clampToFrontOfPlanet(windUpPos)
			}

			this.hand.position.lerp(windUpPos, 0.1)

			// Rotate hand to face toward Earth (for punch) or satellite (for slap)
			let faceDirection
			if (this.stateData.isGeoPunch) {
				// For punch: fist faces TOWARD Earth (the punch direction)
				// Hand is behind satellite, punching toward planet
				faceDirection = this.stateData.punchDirection
					? this.stateData.punchDirection.clone()
					: satPos.clone().negate().normalize()

				if (faceDirection.lengthSq() < 0.0001) {
					faceDirection.set(0, -1, 0)
				}

				const up = new THREE.Vector3(0, 1, 0)
				const rotMatrix = new THREE.Matrix4().lookAt(
					new THREE.Vector3(),
					faceDirection,
					up
				)
				const targetQuat = new THREE.Quaternion().setFromRotationMatrix(rotMatrix)

				// Fist cocked back, ready to punch forward
				// Slight rotation to show the arm is pulled back
				const cockBackQuat = new THREE.Quaternion().setFromAxisAngle(
					new THREE.Vector3(0, 1, 0),
					eased * Math.PI * 0.15 // Slight twist
				)
				targetQuat.multiply(cockBackQuat)

				this.hand.quaternion.slerp(targetQuat, 0.1)
			} else {
				// For slap: face toward satellite
				faceDirection = satPos.clone().sub(this.hand.position).normalize()
				if (faceDirection.lengthSq() < 0.0001) {
					faceDirection.set(0, 0, 1)
				}

				const up = new THREE.Vector3(0, 1, 0)
				const rotMatrix = new THREE.Matrix4().lookAt(
					new THREE.Vector3(),
					faceDirection,
					up
				)
				const targetQuat = new THREE.Quaternion().setFromRotationMatrix(rotMatrix)

				// Add wind-up rotation (pull arm back)
				const windUpQuat = new THREE.Quaternion().setFromAxisAngle(
					new THREE.Vector3(0, 1, 0),
					-eased * Math.PI * 0.4
				)
				targetQuat.multiply(windUpQuat)

				this.hand.quaternion.slerp(targetQuat, 0.06)
			}
		}

		if (t >= 1) {
			this.transition(HandState.SLAPPING)
		}
	}

	updateSlapping(dt) {
		const elapsed = this.getElapsedTime()
		const t = Math.min(elapsed / SEQUENCE_TIMINGS.slapDuration, 1)

		// For GEO punch: Use ease-out for explosive start, decelerating impact
		// For slap: Linear is fine
		const eased = this.stateData.isGeoPunch
			? 1 - Math.pow(1 - t, 3) // Ease-out cubic - fast start, slow end
			: t

		if (this.targetSatellite) {
			const satPos = new THREE.Vector3()
			this.targetSatellite.getWorldPosition(satPos)

			let moveDirection
			const moveSpeed = 0.025 // units per ms

			if (this.stateData.isGeoPunch) {
				// GEO PUNCH: Straight line punch TOWARD Earth, through satellite
				// Gradually speed up for impact feel
				this.timeScale = 0.2 + t * 0.5 // Speed up as punch lands

				// Punch direction: straight toward Earth center
				const punchDir = this.stateData.punchDirection
					? this.stateData.punchDirection.clone()
					: satPos.clone().negate().normalize()

				// Accelerating punch - starts slow, gets FAST
				const punchSpeed = moveSpeed * (0.5 + eased * 4) // Much faster at end
				this.hand.position.add(punchDir.multiplyScalar(punchSpeed * dt))

				// Hand maintains forward-facing orientation during punch
				const up = new THREE.Vector3(0, 1, 0)
				const rotMatrix = new THREE.Matrix4().lookAt(
					new THREE.Vector3(),
					punchDir,
					up
				)
				const targetQuat = new THREE.Quaternion().setFromRotationMatrix(rotMatrix)
				this.hand.quaternion.slerp(targetQuat, 0.2)

				// Stop hand when it reaches past the satellite (closer to Earth)
				// Don't let it go into the planet
				clampToPlanetSurface(this.hand.position, 0.3)

			} else {
				// LEO/Molniya: Original slap behavior - swing through satellite
				moveDirection = satPos.clone().sub(this.hand.position)
				if (moveDirection.lengthSq() < 0.0001) {
					moveDirection.set(0, -1, 0)
				} else {
					moveDirection.normalize()
				}

				this.hand.position.add(moveDirection.clone().multiplyScalar(moveSpeed * dt))
				clampToFrontOfPlanet(this.hand.position)
			}

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
