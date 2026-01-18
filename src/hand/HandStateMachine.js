import * as THREE from "three"
import {
	HandState,
	SEQUENCE_TIMINGS,
	SLAP_SLOW_MOTION_FACTOR,
	HAND_ORBIT_CONFIG,
	GEO_PUNCH_CONFIG,
	LEO_FLICK_CONFIG,
	MOLNIYA_SLAP_CONFIG,
	getOrbitTiming,
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

// Helper: Interpolate rotation keyframes and apply to base orientation
function applyRotationKeyframe(baseQuat, rotations, phase, t) {
	if (!rotations || !rotations[phase]) return baseQuat.clone()

	const { start, end } = rotations[phase]
	// Interpolate Euler angles
	const x = start.x + t * (end.x - start.x)
	const y = start.y + t * (end.y - start.y)
	const z = start.z + t * (end.z - start.z)

	// Create rotation from interpolated Euler angles
	const offsetQuat = new THREE.Quaternion().setFromEuler(
		new THREE.Euler(x, y, z, "XYZ")
	)

	// Apply offset to base orientation
	return baseQuat.clone().multiply(offsetQuat)
}

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

		// Use real time (performance.now) throughout for predictable timing
		this.lastFrameTime = performance.now()
		this.stateStartTime = performance.now()
		this.orbitStartTime = performance.now()

		// timeScale is always 1.0 (real-time) - kept for compatibility with OrcScene.js
		this.timeScale = 1.0

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
		// Log with orbit-specific phase names for clarity
		let displayState = newState
		if (this.stateData.isLeoFlick) {
			if (newState === HandState.WINDING_UP) displayState = "PREPARING"
			else if (newState === HandState.CONTACTING) displayState = "FLICKING"
		}
		this.state = newState
		this.stateStartTime = performance.now()

		// MERGE new data into existing stateData (don't replace!)
		// This preserves flags like isGeoPunch across state transitions
		this.stateData = { ...this.stateData, ...data }
		this.onEnterState(newState)
	}

	onEnterState(state) {
		console.log(`[HandStateMachine] Transitioned to state: ${state}`)
		switch (state) {
			case HandState.POINTING:
				console.log(`[HandStateMachine] POINTING at target satellite.`)
				transitionToGesture(this.hand, "point", 400)
				transitionToGesture(this.hand, "fist", 400)
				break
			case HandState.APPROACHING:
				console.log(`[HandStateMachine] APPROACHING target.`)
				transitionToGesture(this.hand, "fist", 200)
				this.stateData.startPosition = this.hand.position.clone()
				break
			case HandState.WINDING_UP:
				console.log(`[HandStateMachine] WINDING_UP started.`)
				this.stateData.windUpStartRotation = this.hand.rotation.y
				// LEO uses flickReady gesture (thumb and index finger pressed together)
				if (this.stateData.isLeoFlick) {
					console.log(
						`[HandStateMachine] LEO Flick detected: Transitioning to 'flickReady' gesture.`
					)
					transitionToGesture(this.hand, "flickReady", 300)
				}
				break
			case HandState.CONTACTING:
				console.log(`[HandStateMachine] CONTACTING started.`)
				// Use appropriate gesture for each orbit type
				if (this.stateData.isGeoPunch) {
					transitionToGesture(this.hand, "fist", 100)
				} else if (this.stateData.isLeoFlick) {
					// LEO: transition to flickRelease (finger extends)
					console.log(
						`[HandStateMachine] LEO Flick: Transitioning to 'flickRelease' gesture.`
					)
					transitionToGesture(this.hand, "flickRelease", 100)
				} else {
					// Molniya: backhand slap
					transitionToGesture(this.hand, "backhand", 100)
				}
				this.stateData.contactApplied = false
				break
			case HandState.CELEBRATING:
				console.log(`[HandStateMachine] CELEBRATING started.`)
				// LOCK the hand position RIGHT NOW
				this.stateData.lockedPosition = this.hand.position.clone()
				this.stateData.lockedRotation = this.hand.quaternion.clone()
				this.stateData.thumbsUpStarted = false
				this.stateData.thumbsUpStartTime = null
				break
			case HandState.RETURNING:
				transitionToGesture(this.hand, "fist", 400)
				this.stateData.returnStartPosition = this.hand.position.clone()
				break
			case HandState.CANCELLED:
				transitionToGesture(this.hand, "fist", 300)
				this.stateData.cancelStartPosition = this.hand.position.clone()
				break
			case HandState.IDLE_ORBIT:
				transitionToGesture(this.hand, "fist", 400)
				// Clear all decommission state when returning to idle
				this.targetSatellite = null
				this.stateData = {}
				break
		}
	}

	getElapsedTime() {
		return performance.now() - this.stateStartTime
	}

	// Get the orbit config for the current decommission type
	getOrbitConfig() {
		if (this.stateData.isGeoPunch) {
			return GEO_PUNCH_CONFIG
		} else if (this.stateData.isLeoFlick) {
			return LEO_FLICK_CONFIG
		} else {
			return MOLNIYA_SLAP_CONFIG
		}
	}

	// Get timing for a specific phase, using orbit-specific config with fallback
	getPhaseDuration(phaseName) {
		return getOrbitTiming(this.getOrbitConfig(), phaseName)
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

		// Clear ALL stateData when starting a new decommission sequence
		this.stateData = {}

		this.transition(HandState.POINTING, {
			targetPosition: targetPos,
		})

		return true
	}

	update() {
		const now = performance.now()
		const dt = Math.min(now - this.lastFrameTime, 100) // Cap dt
		this.lastFrameTime = now

		// Update gesture animation
		updateGestureAnimation(dt)

		// Update plume based on state
		const plumeIntensity = this.state === HandState.IDLE_ORBIT ? 0.4 : 1.0
		updatePlumeAnimation(this.hand.userData.plume, plumeIntensity, now)

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
			case HandState.CONTACTING:
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
		const time = performance.now() - this.orbitStartTime
		const targetPos = calculateIrregularOrbitPosition(time, this.hand.position)

		// Apply satellite avoidance
		const avoidance = avoidSatellites(this.hand.position, this.satellites)
		targetPos.add(avoidance)

		// Apply planet collision avoidance
		const planetAvoidance = avoidPlanet(targetPos)
		targetPos.add(planetAvoidance)

		// Validate targetPos before lerping
		if (isNaN(targetPos.x) || isNaN(targetPos.y) || isNaN(targetPos.z)) {
			return // Skip this frame if targetPos is invalid
		}

		// Smooth movement toward target
		this.hand.position.lerp(targetPos, 0.02)

		// Reset to safe position if hand position became NaN
		if (isNaN(this.hand.position.x)) {
			this.hand.position.set(0, 0, 2)
		}

		// If a satellite is selected, point index fingertip at it like an arrow
		if (this.selectedSatellite) {
			const satPos = new THREE.Vector3()
			this.selectedSatellite.getWorldPosition(satPos)

			// Check for valid satellite position
			if (isNaN(satPos.x) || isNaN(satPos.y) || isNaN(satPos.z)) {
				return // Skip pointing at invalid satellite
			}

			// The index finger extends in local +Y direction when in pointing pose
			const localFingerDirection = new THREE.Vector3(0, 1, 0)

			// Calculate the world direction from hand to satellite
			const dirToSat = satPos.clone().sub(this.hand.position)
			const dirLength = dirToSat.length()

			// Only rotate if we have a valid direction
			if (dirLength > 0.01) {
				const worldDirectionToSat = dirToSat.divideScalar(dirLength)

				// Create quaternion that rotates local +Y to point at satellite
				const targetQuat = new THREE.Quaternion().setFromUnitVectors(
					localFingerDirection,
					worldDirectionToSat
				)

				// Check for valid quaternion
				if (!isNaN(targetQuat.x)) {
					this.hand.quaternion.slerp(targetQuat, 0.04)
				}
			}
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
		const time = performance.now() - this.orbitStartTime
		const targetPos = calculateIrregularOrbitPosition(time, this.hand.position)

		// Validate before lerping
		if (!isNaN(targetPos.x)) {
			this.hand.position.lerp(targetPos, 0.008)
		}

		// Point index fingertip at satellite like an arrow
		if (this.targetSatellite) {
			const satPos = new THREE.Vector3()
			this.targetSatellite.getWorldPosition(satPos)

			// Check for valid positions
			if (isNaN(satPos.x) || isNaN(this.hand.position.x)) {
				return
			}

			// The index finger extends in local +Y direction
			const localFingerDirection = new THREE.Vector3(0, 1, 0)
			const dirToSat = satPos.clone().sub(this.hand.position)
			const dirLength = dirToSat.length()

			// Only rotate if we have a valid direction
			if (dirLength > 0.01) {
				const worldDirectionToSat = dirToSat.divideScalar(dirLength)
				const targetQuat = new THREE.Quaternion().setFromUnitVectors(
					localFingerDirection,
					worldDirectionToSat
				)

				if (!isNaN(targetQuat.x)) {
					this.hand.quaternion.slerp(targetQuat, 0.06)
				}
			}
		}

		// Transition after duration + pause
		const pointDuration = this.getPhaseDuration("pointDuration")
		const pointPause = this.getPhaseDuration("pointPause")
		if (elapsed > pointDuration + pointPause) {
			this.transition(HandState.APPROACHING)
		}
	}

	updateApproaching() {
		const elapsed = this.getElapsedTime()
		const approachDuration = this.getPhaseDuration("approachDuration")
		const t = Math.min(elapsed / approachDuration, 1)

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
				// Per whitepaper: "placing its target between itself and the Earth"
				this.stateData.isGeoPunch = true

				const earthToSat = targetPos.clone().normalize()
				const satDistance = targetPos.length()

				// Hand approaches to position BEYOND satellite (further from Earth)
				// Satellite will be between hand and Earth
				const approachDistance = satDistance + GEO_PUNCH_CONFIG.approachOffset
				const approachPos = earthToSat.clone().multiplyScalar(approachDistance)

				// Store punch line direction (toward Earth, through satellite)
				this.stateData.earthToSat = earthToSat.clone()
				this.stateData.punchLineDirection = earthToSat.clone().negate()
				this.stateData.satelliteDistance = satDistance
				this.stateData.geoPunchStartTime = null // Will be set when wind-up starts

				// Arc to approach position (stay on the punch line)
				interpolatedPos = startPos.clone().lerp(approachPos, eased)

				// Only prevent planet collision, NOT z-clamping
				// Hand must stay on punch line regardless of camera view
				clampToPlanetSurface(interpolatedPos)
			} else {
				// LEO/Molniya: Original slap behavior - approach from front
				this.stateData.isGeoPunch = false

				const isLEO = satDistance < 0.8
				this.stateData.isLeoFlick = isLEO

				// Guard against undefined/NaN startPos or targetPos
				const startValid = startPos && !isNaN(startPos.x)
				const targetValid = !isNaN(targetPos.x)

				if (!startValid || !targetValid) {
					// Invalid start or target position
					// Use last known good position or a safe default
					interpolatedPos = startValid
						? startPos.clone()
						: new THREE.Vector3(0, 0, 2)
				} else {
					// Simple linear interpolation
					interpolatedPos = new THREE.Vector3(
						startPos.x + (targetPos.x - startPos.x) * eased,
						startPos.y + (targetPos.y - startPos.y) * eased,
						startPos.z + (targetPos.z - startPos.z) * eased
					)
				}

				// Validate and fix any NaN values
				if (
					isNaN(interpolatedPos.x) ||
					isNaN(interpolatedPos.y) ||
					isNaN(interpolatedPos.z)
				) {
					interpolatedPos = targetPos.clone()
				}

				// For LEO/Molniya, use a smaller clamp distance since they orbit
				// closer to the planet than GEO. Just ensure Z stays positive.
				if (interpolatedPos.z < 0.3) {
					interpolatedPos.z = 0.3
				}
				// Also ensure we don't go inside the planet
				const dist = interpolatedPos.length()
				if (dist < 0.55) {
					const scale = 0.55 / dist
					interpolatedPos.multiplyScalar(scale)
				}

				// Validate after clamping
				if (
					isNaN(interpolatedPos.x) ||
					isNaN(interpolatedPos.y) ||
					isNaN(interpolatedPos.z)
				) {
					interpolatedPos = targetPos.clone()
				}
			}

			// Final safety check before setting position
			if (!interpolatedPos || isNaN(interpolatedPos.x)) {
				interpolatedPos = targetPos.clone()
			}

			this.hand.position.copy(interpolatedPos)

			// Face satellite (or set up punch orientation for GEO)
			if (this.stateData.isGeoPunch) {
				// For GEO: Set up base orientation and apply approach keyframes
				const punchLine = this.stateData.earthToSat
				const awayFromEarth = punchLine.clone() // Points away from Earth
				const up = new THREE.Vector3(0, 1, 0)
				const rotMatrix = new THREE.Matrix4().lookAt(
					new THREE.Vector3(),
					awayFromEarth,
					up
				)
				const baseQuat = new THREE.Quaternion().setFromRotationMatrix(rotMatrix)

				// Apply approach rotation keyframes
				const rotations = GEO_PUNCH_CONFIG.rotations
				const targetQuat = applyRotationKeyframe(
					baseQuat,
					rotations,
					"approach",
					eased
				)
				this.hand.quaternion.slerp(targetQuat, 0.1)
			} else if (this.stateData.isLeoFlick) {
				// LEO FLICK: Orient hand so fingers (local +Y) point toward satellite
				// Like flicking a paper football - fingers aim at target
				const dirToSat = targetPos.clone().sub(this.hand.position)
				const dirLength = dirToSat.length()

				// Only update orientation if we have a valid direction (not at satellite yet)
				if (dirLength > 0.01) {
					const directionToSat = dirToSat.divideScalar(dirLength) // normalize safely
					const localFingerDirection = new THREE.Vector3(0, 1, 0)
					const targetQuat = new THREE.Quaternion().setFromUnitVectors(
						localFingerDirection,
						directionToSat
					)
					this.hand.quaternion.slerp(targetQuat, 0.1)
				}
			} else {
				// Molniya: Face satellite (standard lookAt)
				const dirToSat = targetPos.clone().sub(this.hand.position)
				const dirLength = dirToSat.length()

				// Only update orientation if we have a valid direction
				if (dirLength > 0.01) {
					const direction = dirToSat.divideScalar(dirLength) // normalize safely
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
		}

		if (t >= 1) {
			this.transition(HandState.WINDING_UP)
		}
	}

	updateWindingUp() {
		const elapsed = this.getElapsedTime()
		const windUpDuration = this.getPhaseDuration("windUpDuration")
		const t = Math.min(elapsed / windUpDuration, 1)

		// Smooth ease-in-out for graceful wind-up
		const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

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
				// GEO PUNCH: Staged animation with explicit positioning
				// The hand is BEHIND the satellite (further from Earth)
				// Pull-back moves AWAY from Earth (increasing distance)
				// Punch moves TOWARD Earth (decreasing distance)

				const punchLine = this.stateData.earthToSat || earthToSat.clone()
				const satDist = this.stateData.satelliteDistance || satPos.length()

				// Initialize stage tracking
				if (!this.stateData.geoPunchStage) {
					this.stateData.geoPunchStage = "POSITION_HOLD"
					this.stateData.geoPunchStageStart = performance.now()

					// Lock orientation: fist/knuckles toward Earth, thruster away from Earth
					// The hand model's local -Z is the "forward" (fist direction)
					// So we lookAt AWAY from Earth, which makes -Z point toward Earth
					const awayFromEarth = punchLine.clone() // Points away from Earth
					const up = new THREE.Vector3(0, 1, 0)
					const rotMatrix = new THREE.Matrix4().lookAt(
						new THREE.Vector3(),
						awayFromEarth,
						up
					)
					this.stateData.lockedPunchOrientation =
						new THREE.Quaternion().setFromRotationMatrix(rotMatrix)
					this.stateData.punchDirection = punchLine.clone().negate() // Toward Earth (movement direction)

					// Starting position: just beyond satellite
					this.stateData.initialPunchDist =
						satDist + GEO_PUNCH_CONFIG.approachOffset
				}

				const stageElapsed =
					performance.now() - this.stateData.geoPunchStageStart

				if (this.stateData.geoPunchStage === "POSITION_HOLD") {
					// Brief pause at starting position
					const holdDist = this.stateData.initialPunchDist
					windUpPos = punchLine.clone().multiplyScalar(holdDist)

					// Apply end-of-approach rotation (hold position uses approach.end)
					const rotations = GEO_PUNCH_CONFIG.rotations
					const targetQuat = applyRotationKeyframe(
						this.stateData.lockedPunchOrientation,
						rotations,
						"approach",
						1.0 // t=1 means end keyframe
					)
					this.hand.quaternion.slerp(targetQuat, 0.2)

					if (stageElapsed >= GEO_PUNCH_CONFIG.positionHoldDuration) {
						this.stateData.geoPunchStage = "PULL_BACK"
						this.stateData.geoPunchStageStart = performance.now()
					}
				} else if (this.stateData.geoPunchStage === "PULL_BACK") {
					// PULL_BACK: Move AWAY from Earth (like car reversing)
					// Distance increases from initialPunchDist to initialPunchDist + pullBackDistance
					const pullT = Math.min(
						stageElapsed / GEO_PUNCH_CONFIG.pullBackDuration,
						1
					)
					const pullEased =
						pullT < 0.5
							? 2 * pullT * pullT
							: 1 - Math.pow(-2 * pullT + 2, 2) / 2

					const startDist = this.stateData.initialPunchDist
					const maxDist = startDist + GEO_PUNCH_CONFIG.pullBackDistance
					const currentDist =
						startDist + pullEased * GEO_PUNCH_CONFIG.pullBackDistance

					// Position along Earth-to-satellite line at currentDist
					windUpPos = punchLine.clone().multiplyScalar(currentDist)

					// Apply pullBack rotation keyframes
					const rotations = GEO_PUNCH_CONFIG.rotations
					const targetQuat = applyRotationKeyframe(
						this.stateData.lockedPunchOrientation,
						rotations,
						"pullBack",
						pullEased
					)
					this.hand.quaternion.slerp(targetQuat, 0.15)

					// Store max distance for punch phase
					this.stateData.maxPullBackDist = maxDist

					if (pullT >= 1) {
						this.stateData.geoPunchStage = "PUNCH"
						this.stateData.geoPunchStageStart = performance.now()
						this.transition(HandState.CONTACTING)
						return
					}
				}

				// Ensure valid position
				if (windUpPos) {
					clampToPlanetSurface(windUpPos)
				}
			} else if (this.stateData.isLeoFlick) {
				// LEO FLICK: Hand stays in place, only fingers move
				// Lock position at start of preparing phase
				if (!this.stateData.flickLockedPosition) {
					console.log(
						`[HandStateMachine] LEO Flick: Locking position for flick preparation.`
					)
					this.stateData.flickLockedPosition = this.hand.position.clone()

					// Set correct flick orientation: fingers (local +Y) point toward satellite
					const satPos = new THREE.Vector3()
					this.targetSatellite.getWorldPosition(satPos)
					const dirToSat = satPos.clone().sub(this.hand.position)
					const dirLength = dirToSat.length()

					// Use current rotation if too close, otherwise point at satellite
					if (dirLength > 0.01) {
						const directionToSat = dirToSat.divideScalar(dirLength)
						const localFingerDirection = new THREE.Vector3(0, 1, 0)
						const flickQuat = new THREE.Quaternion().setFromUnitVectors(
							localFingerDirection,
							directionToSat
						)
						this.stateData.flickLockedRotation = flickQuat
					} else {
						// Fallback: use current orientation
						this.stateData.flickLockedRotation = this.hand.quaternion.clone()
					}
				}

				// Keep hand locked in position with correct orientation
				this.hand.position.copy(this.stateData.flickLockedPosition)
				this.hand.quaternion.copy(this.stateData.flickLockedRotation)

				// Transition to FLICKING after preparing duration
				if (t >= 1) {
					console.log(
						`[HandStateMachine] LEO Flick: Preparation complete. Transitioning to CONTACTING.`
					)
					this.transition(HandState.CONTACTING)
				}
				return
			} else {
				// Molniya: Original slap behavior
				const windUpDist = 0.8
				windUpPos = satPos
					.clone()
					.add(earthToSat.clone().multiplyScalar(windUpDist))

				if (windUpPos.z < 0.5) {
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

			// For GEO punch, position is set directly in staged code above
			// For Molniya, use lerp
			if (!this.stateData.isGeoPunch && !this.stateData.isLeoFlick) {
				this.hand.position.lerp(windUpPos, 0.1)
			} else if (this.stateData.isGeoPunch) {
				this.hand.position.copy(windUpPos)
			}

			// Rotate hand - GEO handles its own rotation in stages, LEO is locked
			if (this.stateData.isGeoPunch || this.stateData.isLeoFlick) {
				// Rotation already handled above
			} else {
				// For Molniya slap: face toward satellite
				let faceDirection = satPos.clone().sub(this.hand.position).normalize()
				if (faceDirection.lengthSq() < 0.0001) {
					faceDirection.set(0, 0, 1)
				}

				const up = new THREE.Vector3(0, 1, 0)
				const rotMatrix = new THREE.Matrix4().lookAt(
					new THREE.Vector3(),
					faceDirection,
					up
				)
				const targetQuat = new THREE.Quaternion().setFromRotationMatrix(
					rotMatrix
				)

				// Add wind-up rotation (pull arm back)
				const windUpQuat = new THREE.Quaternion().setFromAxisAngle(
					new THREE.Vector3(0, 1, 0),
					-eased * Math.PI * 0.4
				)
				targetQuat.multiply(windUpQuat)

				this.hand.quaternion.slerp(targetQuat, 0.06)
			}
		}

		// Transition for non-GEO (GEO handles its own transitions in staged code)
		if (t >= 1 && !this.stateData.isGeoPunch) {
			this.transition(HandState.CONTACTING)
		}
	}

	updateSlapping(dt) {
		let t, eased

		if (this.stateData.isGeoPunch) {
			// GEO PUNCH: Staged PUNCH and FOLLOW_THROUGH
			// Uses explicit distance-based positioning along the punch line
			const stageElapsed = performance.now() - this.stateData.geoPunchStageStart
			const punchLine = this.stateData.earthToSat
			const satDist = this.stateData.satelliteDistance

			if (!punchLine || !satDist) {
				console.error("[GEO PUNCH] Missing punchLine or satDist!")
				return
			}

			if (this.stateData.geoPunchStage === "PUNCH") {
				// PUNCH: Move TOWARD Earth (decreasing distance)
				// From maxPullBackDist down to near satellite, then through
				t = Math.min(stageElapsed / GEO_PUNCH_CONFIG.punchDuration, 1)
				// Ease-in-out for smooth acceleration then deceleration
				eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

				const startDist = this.stateData.maxPullBackDist
				// Target: just past the satellite (closer to Earth)
				const targetDist = satDist - GEO_PUNCH_CONFIG.followThroughDistance
				const currentDist = startDist - eased * (startDist - targetDist)

				// Position along punch line
				this.hand.position.copy(punchLine.clone().multiplyScalar(currentDist))

				// Apply punch rotation keyframes
				if (this.stateData.lockedPunchOrientation) {
					const rotations = GEO_PUNCH_CONFIG.rotations
					const targetQuat = applyRotationKeyframe(
						this.stateData.lockedPunchOrientation,
						rotations,
						"punch",
						eased
					)
					this.hand.quaternion.slerp(targetQuat, 0.3)
				}

				// Check for contact with satellite (when distance crosses satellite distance)
				if (currentDist <= satDist && !this.stateData.contactMade) {
					this.stateData.contactMade = true
					if (this.onSatelliteBurn) {
						this.onSatelliteBurn(this.targetSatellite)
					}
				}

				clampToPlanetSurface(this.hand.position, 0.3)

				if (t >= 1) {
					this.stateData.geoPunchStage = "FOLLOW_THROUGH"
					this.stateData.geoPunchStageStart = performance.now()
					this.stateData.followThroughStartDist = currentDist
				}
				return
			} else if (this.stateData.geoPunchStage === "FOLLOW_THROUGH") {
				// FOLLOW_THROUGH: Continue briefly, add lateral offset, rotation from keyframes
				t = Math.min(stageElapsed / GEO_PUNCH_CONFIG.followThroughDuration, 1)
				eased = 1 - Math.pow(1 - t, 2) // Ease-out

				const startDist = this.stateData.followThroughStartDist
				// Continue slightly closer to Earth
				const currentDist = startDist - eased * 0.2

				// Base position along punch line
				const basePos = punchLine.clone().multiplyScalar(currentDist)

				// Add lateral offset (ending "beside the head")
				const up = new THREE.Vector3(0, 1, 0)
				const lateral = new THREE.Vector3()
					.crossVectors(punchLine, up)
					.normalize()
				const lateralOffset = lateral.multiplyScalar(eased * 0.3)

				this.hand.position.copy(basePos).add(lateralOffset)

				// Apply followThrough rotation keyframes
				if (this.stateData.lockedPunchOrientation) {
					const rotations = GEO_PUNCH_CONFIG.rotations
					const targetQuat = applyRotationKeyframe(
						this.stateData.lockedPunchOrientation,
						rotations,
						"followThrough",
						eased
					)
					this.hand.quaternion.slerp(targetQuat, 0.3)
				}

				clampToPlanetSurface(this.hand.position, 0.3)

				if (t >= 1) {
					this.transition(HandState.CELEBRATING, {
						burnStartTime: performance.now(),
					})
				}
				return
			}
		}

		// Non-GEO path (LEO/Molniya slap)
		const elapsed = this.getElapsedTime()
		const contactDuration = this.getPhaseDuration("contactDuration")
		t = Math.min(elapsed / contactDuration, 1)
		eased = t

		if (this.targetSatellite) {
			const satPos = new THREE.Vector3()
			this.targetSatellite.getWorldPosition(satPos)

			let moveDirection
			const moveSpeed = 0.025 // units per ms

			if (this.stateData.isGeoPunch) {
				// This branch shouldn't be reached anymore for GEO
				return
			} else if (this.stateData.isLeoFlick) {
				// LEO FLICK: Hand stays mostly stationary, finger does the work
				// The gesture transition to 'flickRelease' is already playing (triggered in onEnterState)

				// Keep orientation locked to what we set in PREPARING
				if (this.stateData.flickLockedRotation) {
					this.hand.quaternion.copy(this.stateData.flickLockedRotation)
				}

				// Small recoil/impulse effect
				// The flick happens fast. Let's add a tiny forward jerk.
				const impulse = Math.sin(t * Math.PI) * 0.03 // Small movement

				const basePos =
					this.stateData.flickLockedPosition || this.hand.position.clone()
				const dirToSat = satPos.clone().sub(basePos).normalize()

				this.hand.position.copy(basePos).add(dirToSat.multiplyScalar(impulse))

				// Trigger contact early in the animation (snap)
				if (t > 0.2 && !this.stateData.contactApplied) {
					console.log(`[HandStateMachine] Flick contact!`)
					this.stateData.contactApplied = true
					if (this.onSatelliteBurn) {
						this.onSatelliteBurn(this.targetSatellite)
					}
					// Transition to celebrating happens at t >= 1 below
				}
			} else {
				// LEO/Molniya: Original slap behavior - swing through satellite
				moveDirection = satPos.clone().sub(this.hand.position)
				if (moveDirection.lengthSq() < 0.0001) {
					moveDirection.set(0, -1, 0)
				} else {
					moveDirection.normalize()
				}

				this.hand.position.add(
					moveDirection.clone().multiplyScalar(moveSpeed * dt)
				)
				clampToFrontOfPlanet(this.hand.position)
			}

			// Check for contact
			const dist = this.hand.position.distanceTo(satPos)
			const CONTACT_THRESHOLD = 0.5

			if (dist < CONTACT_THRESHOLD && !this.stateData.contactApplied) {
				console.log(
					`[HandStateMachine] Contact made with satellite! Distance: ${dist.toFixed(
						3
					)}`
				)
				this.stateData.contactApplied = true

				// Trigger satellite burn / launch EXACTLY on contact
				if (this.onSatelliteBurn) {
					this.onSatelliteBurn(this.targetSatellite)
				}

				// Transition to celebrate - thumbs up will start THERE after hand stops
				this.transition(HandState.CELEBRATING, {
					burnStartTime: performance.now(),
				})
			}
		}

		// Failsafe transition if missed
		if (t >= 1 && !this.stateData.contactApplied) {
			this.transition(HandState.CELEBRATING, {
				burnStartTime: performance.now(),
			})
		}
	}

	// Get celebration config based on decommission type
	getCelebrationConfig() {
		if (this.stateData.isGeoPunch) {
			return GEO_PUNCH_CONFIG.celebration
		} else if (this.stateData.isLeoFlick) {
			return LEO_FLICK_CONFIG.celebration
		} else {
			// Default to Molniya slap config
			return MOLNIYA_SLAP_CONFIG.celebration
		}
	}

	updateCelebrating() {
		const elapsed = this.getElapsedTime()
		const celebrationConfig = this.getCelebrationConfig()

		// Keep position locked - no movement allowed
		this.hand.position.copy(this.stateData.lockedPosition)

		// Store celebration config for camera access
		this.stateData.celebrationConfig = celebrationConfig

		// Phase 1: Wait briefly for satellite destruction animation - keep original rotation
		if (this.targetSatellite) {
			this.hand.quaternion.copy(this.stateData.lockedRotation)
			if (
				elapsed > celebrationConfig.satelliteDestroyDelay &&
				this.onSatelliteDestroyed
			) {
				this.onSatelliteDestroyed(this.targetSatellite)
				this.targetSatellite = null
			}
			return
		}

		// Phase 2: Satellite is gone - now do thumbs up
		if (!this.stateData.thumbsUpStarted) {
			console.log(`[HandStateMachine] Starting Thumbs Up gesture.`)
			this.stateData.thumbsUpStarted = true
			this.stateData.thumbsUpStartTime = performance.now()

			// Use config for gesture transition duration
			const gestureDuration = celebrationConfig.gestureTransitionDuration || 400
			transitionToGesture(this.hand, "thumbsUp", gestureDuration)

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

		// Smoothly rotate to thumbs-up orientation using config duration
		const rotationDuration = celebrationConfig.rotationTransitionDuration || 400
		if (this.stateData.targetThumbsUpQuat) {
			const rotationProgress = Math.min(
				(performance.now() - this.stateData.thumbsUpStartTime) /
					rotationDuration,
				1
			)
			// Cubic ease-in-out for smooth rotation
			const eased =
				rotationProgress < 0.5
					? 4 * rotationProgress * rotationProgress * rotationProgress
					: 1 - Math.pow(-2 * rotationProgress + 2, 3) / 2

			this.hand.quaternion
				.copy(this.stateData.lockedRotation)
				.slerp(this.stateData.targetThumbsUpQuat, eased)
		}

		// Transition to RETURNING after rotation completes + hold duration
		const thumbsUpElapsed = performance.now() - this.stateData.thumbsUpStartTime
		const totalDuration =
			rotationDuration + celebrationConfig.thumbsUpHoldDuration
		if (thumbsUpElapsed > totalDuration) {
			this.transition(HandState.RETURNING)
		}
	}

	updateReturning() {
		const elapsed = this.getElapsedTime()
		const returnDuration = this.getPhaseDuration("returnDuration")
		const t = Math.min(elapsed / returnDuration, 1)

		// Smooth ease-in-out for graceful return
		const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

		// Return to orbit position
		const time = performance.now() - this.orbitStartTime
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
		const time = performance.now() - this.orbitStartTime
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
