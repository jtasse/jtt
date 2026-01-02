import * as THREE from "three"

// Hand States
export const HandState = {
	IDLE: "idle",
	POINTING: "pointing",
	APPROACHING: "approaching",
	WINDING_UP: "winding_up",
	SLAPPING: "slapping",
	CELEBRATING: "celebrating",
	THUMBS_UP: "thumbs_up",
	RETURNING: "returning",
	GRABBING: "grabbing", // For future use
	CARRYING: "carrying", // For future use
	RELEASING: "releasing", // For future use
}

// Create the 3D Hand Model (procedural geometry)
export function createOrcHand(scale = 1) {
	const handGroup = new THREE.Group()
	handGroup.name = "orcHand"

	// Materials
	const skinMaterial = new THREE.MeshStandardMaterial({
		color: 0x44aa88, // Teal/Greenish alien skin
		roughness: 0.7,
		metalness: 0.1,
	})

	const jointMaterial = new THREE.MeshStandardMaterial({
		color: 0x338866, // Darker joints
		roughness: 0.8,
	})

	// Palm (Box with rounded corners logic via scaling)
	const palmGeo = new THREE.BoxGeometry(0.08, 0.1, 0.03)
	const palm = new THREE.Mesh(palmGeo, skinMaterial)
	handGroup.add(palm)

	// Fingers
	const fingers = []
	const fingerGeo = new THREE.CylinderGeometry(0.01, 0.012, 0.08, 8)
	fingerGeo.translate(0, 0.04, 0) // Pivot at base

	// 4 Fingers
	for (let i = 0; i < 4; i++) {
		const finger = new THREE.Mesh(fingerGeo, skinMaterial)
		// Position spread across top of palm
		finger.position.set(-0.03 + i * 0.02, 0.05, 0)
		// Add joints/knuckles visual
		const knuckle = new THREE.Mesh(
			new THREE.SphereGeometry(0.013, 8, 8),
			jointMaterial
		)
		knuckle.position.y = 0
		finger.add(knuckle)

		palm.add(finger)
		fingers.push(finger)
	}

	// Thumb
	const thumbGeo = new THREE.CylinderGeometry(0.012, 0.014, 0.06, 8)
	thumbGeo.translate(0, 0.03, 0)
	const thumb = new THREE.Mesh(thumbGeo, skinMaterial)
	thumb.position.set(0.05, 0, 0.01)
	thumb.rotation.z = -Math.PI / 3
	thumb.rotation.y = -Math.PI / 4
	palm.add(thumb)

	// Wrist/Forearm
	const armGeo = new THREE.CylinderGeometry(0.035, 0.04, 0.15, 12)
	armGeo.translate(0, -0.075, 0)
	armGeo.rotateX(Math.PI / 2) // Align along Z axis for "flying" pose
	const arm = new THREE.Mesh(armGeo, skinMaterial)
	arm.position.y = -0.05
	palm.add(arm)

	// Store references for animation
	handGroup.userData = {
		palm,
		fingers,
		thumb,
		arm,
		originalScale: scale,
	}

	handGroup.scale.set(scale, scale, scale)
	return handGroup
}

// Calculate a position on an irregular orbit for the hand to idle/move
export function calculateIrregularOrbitPosition(time) {
	const t = time * 0.0005
	// Lissajous-like curve for organic floating movement
	const x = Math.sin(t * 0.7) * 3 + Math.cos(t * 0.3) * 1
	const y = Math.cos(t * 0.5) * 2 + Math.sin(t * 0.9) * 1
	const z = Math.sin(t * 0.4) * 2 + 4 // Keep it generally in front (z > 2)
	return new THREE.Vector3(x, y, z)
}

// State Machine to control Hand behavior
export class HandStateMachine {
	constructor(handGroup, sceneGroup, satellites, camera) {
		this.hand = handGroup
		this.scene = sceneGroup
		this.satellites = satellites
		this.camera = camera

		this.state = HandState.IDLE
		this.targetSatellite = null
		this.selectedSatellite = null // For pointing behavior

		// Animation properties
		this.position = new THREE.Vector3()
		this.rotation = new THREE.Quaternion()
		this.velocity = new THREE.Vector3()

		// State timers
		this.stateStartTime = 0
		this.lastUpdateTime = 0

		// Config
		this.idleSpeed = 1.0
		this.slapSpeed = 5.0
		this.returnSpeed = 2.0

		// Callbacks
		this.onSatelliteBurn = null
		this.onSatelliteDestroyed = null
		this.onSlowMotionStart = null
		this.onSlowMotionEnd = null

		// Time scaling for slow-mo effects
		this.timeScale = 1.0
	}

	update() {
		const now = performance.now()
		const dt = Math.min((now - this.lastUpdateTime) / 1000, 0.1) // Cap dt at 0.1s
		this.lastUpdateTime = now

		switch (this.state) {
			case HandState.IDLE:
				this.updateIdle(now, dt)
				break
			case HandState.POINTING:
				this.updatePointing(now, dt)
				break
			case HandState.APPROACHING:
				this.updateApproaching(now, dt)
				break
			case HandState.WINDING_UP:
				this.updateWindingUp(now, dt)
				break
			case HandState.SLAPPING:
				this.updateSlapping(now, dt)
				break
			case HandState.CELEBRATING:
			case HandState.THUMBS_UP:
				this.updateCelebrating(now, dt)
				break
			case HandState.RETURNING:
				this.updateReturning(now, dt)
				break
		}

		// Apply transforms
		this.hand.position.lerp(this.position, dt * 5) // Smooth movement
		this.hand.quaternion.slerp(this.rotation, dt * 5) // Smooth rotation
	}

	// --- State Updates ---

	updateIdle(time, dt) {
		// Float around organically
		const targetPos = calculateIrregularOrbitPosition(time)
		this.position.copy(targetPos)

		// Gently rotate/sway
		const sway = Math.sin(time * 0.001) * 0.2
		const q = new THREE.Quaternion().setFromEuler(
			new THREE.Euler(sway, sway * 0.5, 0)
		)
		this.rotation.copy(q)

		// Reset time scale
		this.timeScale = 1.0
	}

	updatePointing(time, dt) {
		if (!this.selectedSatellite) {
			this.transitionTo(HandState.IDLE)
			return
		}

		// Position hand near the selected satellite, but backed off
		const satPos = new THREE.Vector3()
		this.selectedSatellite.getWorldPosition(satPos)

		// Convert world pos to local space of the hand's parent (orcGroup)
		// Assuming orcGroup is at 0,0,0 or we handle it via world-to-local if needed.
		// For simplicity, we'll assume hand and satellites share the same coordinate space context roughly,
		// or we use world positions for calculation and local for setting.
		// Actually, satellites orbit, so their position changes.

		// Target position: slightly towards the camera from the satellite
		const camPos = this.camera.position.clone()
		const directionToCam = new THREE.Vector3()
			.subVectors(camPos, satPos)
			.normalize()
		const hoverDist = 1.5 // Distance to hover away
		const targetPos = satPos
			.clone()
			.add(directionToCam.multiplyScalar(hoverDist))

		// Add some bobbing
		targetPos.y += Math.sin(time * 0.003) * 0.1

		this.position.copy(targetPos)

		// Point finger at satellite
		this.pointAt(satPos)
	}

	updateApproaching(time, dt) {
		if (!this.targetSatellite) return

		const satPos = new THREE.Vector3()
		this.targetSatellite.getWorldPosition(satPos)

		// Move towards "wind up" position (above/behind satellite relative to planet)
		const planetPos = new THREE.Vector3(0, 0, 0) // Assuming planet at origin
		const upDir = satPos.clone().sub(planetPos).normalize()

		// Wind up position is further out along the radius
		const windUpDist = 1.0
		const targetPos = satPos.clone().add(upDir.multiplyScalar(windUpDist))

		this.position.lerp(targetPos, dt * 2)
		this.lookAt(satPos)

		// Check distance to transition
		if (this.position.distanceTo(targetPos) < 0.2) {
			this.transitionTo(HandState.WINDING_UP)
		}
	}

	updateWindingUp(time, dt) {
		// Pull back hand (cocking back for slap)
		// Rotate palm open
		// This is a brief pause/anticipation
		const elapsed = time - this.stateStartTime
		if (elapsed > 800) {
			// 0.8s wind up
			this.transitionTo(HandState.SLAPPING)
		}
	}

	updateSlapping(time, dt) {
		if (!this.targetSatellite) return

		const satPos = new THREE.Vector3()
		this.targetSatellite.getWorldPosition(satPos)

		// Move FAST through the satellite
		// Target is past the satellite (follow through)
		const planetPos = new THREE.Vector3(0, 0, 0)
		const downDir = planetPos.clone().sub(satPos).normalize()
		const followThroughPos = satPos.clone().add(downDir.multiplyScalar(0.5))

		// Lerp very fast
		this.position.lerp(followThroughPos, dt * 15)

		// Check for "impact"
		if (this.position.distanceTo(satPos) < 0.3) {
			// Trigger impact logic once
			if (!this.hasSlapped) {
				this.hasSlapped = true
				if (this.onSatelliteBurn) {
					this.onSatelliteBurn(this.targetSatellite)
				}
				// Trigger slow motion
				if (this.onSlowMotionStart) {
					this.onSlowMotionStart()
				}
				this.timeScale = 0.1 // Slow down world
			}
		}

		// Transition to celebration after follow through
		if (this.position.distanceTo(followThroughPos) < 0.2) {
			this.transitionTo(HandState.THUMBS_UP)
		}
	}

	updateCelebrating(time, dt) {
		// Hold position, show thumbs up gesture
		// Rotate hand to face camera, form fist with thumb up
		const elapsed = time - this.stateStartTime

		// Pose hand (simplified - just rotation for now)
		const camPos = this.camera.position.clone()
		this.lookAt(camPos)

		// Wait for burn duration
		if (elapsed > 4000) {
			// 4s celebration/burn watch
			if (this.onSatelliteDestroyed && this.targetSatellite) {
				this.onSatelliteDestroyed(this.targetSatellite)
			}
			if (this.onSlowMotionEnd) {
				this.onSlowMotionEnd()
			}
			this.timeScale = 1.0
			this.targetSatellite = null
			this.transitionTo(HandState.RETURNING)
		}
	}

	updateReturning(time, dt) {
		// Return to idle behavior
		const targetPos = calculateIrregularOrbitPosition(time)
		this.position.lerp(targetPos, dt * 2)

		if (this.position.distanceTo(targetPos) < 1.0) {
			this.transitionTo(HandState.IDLE)
		}
	}

	// --- Helpers ---

	transitionTo(newState) {
		this.state = newState
		this.stateStartTime = performance.now()
		this.hasSlapped = false

		// Reset poses if needed
		this.resetPose()

		if (newState === HandState.THUMBS_UP) {
			this.setThumbsUpPose()
		} else if (newState === HandState.POINTING) {
			this.setPointingPose()
		} else if (newState === HandState.SLAPPING) {
			this.setOpenPalmPose()
		}
	}

	lookAt(target) {
		const m = new THREE.Matrix4()
		m.lookAt(this.position, target, new THREE.Vector3(0, 1, 0))
		this.rotation.setFromRotationMatrix(m)
	}

	pointAt(target) {
		// Orient hand so index finger points at target
		// Hand model: Palm is Y-up (local), Fingers point X-ish?
		// Adjust based on how createOrcHand builds geometry.
		// Assuming Palm faces +Y, Fingers point +X.
		// We want +X to point at target.

		const direction = new THREE.Vector3()
			.subVectors(target, this.position)
			.normalize()
		const up = new THREE.Vector3(0, 1, 0)

		// Create quaternion looking down 'direction' with 'up'
		const m = new THREE.Matrix4()
		// lookAt(eye, target, up) -> Z axis points eye->target
		// We want X axis to point eye->target.
		// Standard lookAt makes Z point to target.
		// We can rotate -90 deg around Y to make X point to target?
		m.lookAt(this.position, target, up)
		const q = new THREE.Quaternion().setFromRotationMatrix(m)
		// Rotate geometry correction if needed
		// If fingers point +X, and lookAt points +Z, we rotate Y by -90
		// q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -Math.PI/2));

		this.rotation.slerp(q, 0.1)
	}

	// --- Poses (Manipulating finger rotations) ---

	resetPose() {
		const { fingers, thumb } = this.hand.userData
		fingers.forEach((f) => {
			f.rotation.set(0, 0, 0)
		})
		thumb.rotation.set(0, 0, -Math.PI / 3) // Default thumb
	}

	setPointingPose() {
		const { fingers, thumb } = this.hand.userData
		// Index finger (i=1 usually, or 0 depending on loop) straight
		// Others curled
		fingers.forEach((f, i) => {
			if (i === 1) {
				// Index
				f.rotation.z = 0
			} else {
				f.rotation.z = Math.PI / 2 // Curl
			}
		})
		thumb.rotation.z = 0 // Tucked
	}

	setThumbsUpPose() {
		const { fingers, thumb } = this.hand.userData
		// All fingers curled
		fingers.forEach((f) => {
			f.rotation.z = Math.PI / 2
		})
		// Thumb straight up
		thumb.rotation.set(0, -Math.PI / 2, Math.PI / 2)
	}

	setOpenPalmPose() {
		const { fingers, thumb } = this.hand.userData
		// Fingers spread and straight
		fingers.forEach((f, i) => {
			f.rotation.z = -0.1 // Slight back bend
			f.rotation.y = (i - 1.5) * 0.1 // Spread
		})
		thumb.rotation.set(0, 0, -Math.PI / 4)
	}

	// --- Public API ---

	setSelectedSatellite(sat) {
		this.selectedSatellite = sat
		if (this.state === HandState.IDLE || this.state === HandState.POINTING) {
			if (sat) {
				this.transitionTo(HandState.POINTING)
			} else {
				this.transitionTo(HandState.IDLE)
			}
		}
	}

	startDecommission(sat) {
		this.targetSatellite = sat
		this.transitionTo(HandState.APPROACHING)
	}

	canCancel() {
		// Can cancel if we haven't slapped yet
		return (
			this.state === HandState.APPROACHING ||
			this.state === HandState.WINDING_UP ||
			this.state === HandState.POINTING
		)
	}

	cancel() {
		if (this.canCancel()) {
			this.targetSatellite = null
			this.transitionTo(HandState.IDLE)
			// Restore selected state if we still have a selection
			if (this.selectedSatellite) {
				this.transitionTo(HandState.POINTING)
			}
			return true
		}
		return false
	}
}
