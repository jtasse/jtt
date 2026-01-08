import { describe, it, expect, beforeEach } from "vitest"
import { HandStateMachine } from "../src/hand/HandStateMachine.js"
import * as THREE from "three"

describe("HandStateMachine", () => {
	let fsm
	let mockHand
	let mockScene
	let mockCamera

	beforeEach(() => {
		mockHand = new THREE.Group()
		mockHand.userData = { plume: { opacity: 0 } } // Mock plume data
		mockScene = new THREE.Group()
		mockCamera = new THREE.PerspectiveCamera()

		fsm = new HandStateMachine(mockHand, mockScene, [], mockCamera)
	})

	it("should be instantiated", () => {
		expect(fsm).toBeInstanceOf(HandStateMachine)
	})

	it("should have initial state", () => {
		expect(fsm.state).toBeDefined()
		// Assuming IDLE_ORBIT is the default
		expect(fsm.state).toBe("IDLE_ORBIT")
	})

	it("should transition states", () => {
		fsm.transition("POINTING")
		expect(fsm.state).toBe("POINTING")
	})
})
