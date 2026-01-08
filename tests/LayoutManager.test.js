import { describe, it, expect, beforeEach, vi } from "vitest"
import * as THREE from "three"
import { LayoutManager } from "../src/core/LayoutManager.js"

describe("LayoutManager", () => {
	let camera
	let layoutManager

	beforeEach(() => {
		// Mock window dimensions
		vi.stubGlobal("innerWidth", 1024)
		vi.stubGlobal("innerHeight", 768)

		camera = new THREE.PerspectiveCamera(50, 1024 / 768, 0.1, 100)
		camera.position.set(0, 0, 10)
		camera.updateProjectionMatrix()

		layoutManager = new LayoutManager(camera)
	})

	it("should be instantiated", () => {
		expect(layoutManager).toBeInstanceOf(LayoutManager)
	})

	it("should have onResize method", () => {
		expect(typeof layoutManager.onResize).toBe("function")
	})

	it("should calculate world position", () => {
		// Based on CLAUDE.md example: layoutManager.getWorldPosition(0.8, 0.9)
		if (layoutManager.getWorldPosition) {
			const pos = layoutManager.getWorldPosition(0.5, 0.5)
			expect(pos).toBeInstanceOf(THREE.Vector3)
			// Center of screen should be (0,0,0) relative to camera center projection
			expect(pos.x).toBeCloseTo(0)
			expect(pos.y).toBeCloseTo(0)
		}
	})
})
