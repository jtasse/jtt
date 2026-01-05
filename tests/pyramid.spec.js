import { beforeEach, describe, it, expect, vi } from "vitest"

// Mock three and OrbitControls before importing the pyramid module
vi.mock("three", () => {
	class Vector3 {
		constructor(x = 0, y = 0, z = 0) {
			this.x = x
			this.y = y
			this.z = z
		}
		clone() {
			return new Vector3(this.x, this.y, this.z)
		}
		copy(v) {
			this.x = v.x
			this.y = v.y
			this.z = v.z
			return this
		}
		set(x, y, z) {
			this.x = x
			this.y = y
			this.z = z
		}
		lerpVectors(a, b, t) {
			this.x = a.x + (b.x - a.x) * t
			this.y = a.y + (b.y - a.y) * t
			this.z = a.z + (b.z - a.z) * t
		}
	}
	class Object3D {
		constructor() {
			this.children = []
			this.position = new Vector3()
			this.rotation = new Vector3()
			this.scale = { set: () => {} }
			this.userData = {}
			this.visible = true
		}
		add(c) {
			this.children.push(c)
		}

		remove(c) {
			this.children = this.children.filter((ch) => ch !== c)
		}

		getObjectByName(name) {
			if (this.name === name) return this
			for (const ch of this.children) {
				if (ch.name === name) return ch
				if (typeof ch.getObjectByName === "function") {
					const found = ch.getObjectByName(name)
					if (found) return found
				}
			}
			return null
		}
	}
	return {
		Scene: class extends Object3D {
			constructor() {
				super()
				this.background = null
			}
		},
		Color: class {
			constructor() {}
		},
		Vector3,
		BufferGeometry: class {
			setAttribute() {}
			computeVertexNormals() {}
		},
		BufferAttribute: class {
			constructor(a, s) {
				this.array = a
				this.itemSize = s
			}
		},
		Mesh: class extends Object3D {
			constructor() {
				super()
				this.material = {}
				this.name = ""
			}
		},
		MeshStandardMaterial: class {
			constructor() {
				this.envMap = null
				this.envMapIntensity = 1
				this.needsUpdate = false
			}
		},
		Group: class extends Object3D {},
		AmbientLight: class {},
		DirectionalLight: class {
			constructor() {
				this.position = new Vector3()
			}
		},
		Points: class extends Object3D {},
		PointsMaterial: class {},
		PerspectiveCamera: class {
			constructor() {
				this.position = new Vector3()
				this.aspect = 1
			}
			lookAt() {}
		},
		WebGLRenderer: class {
			constructor() {
				this.domElement = { style: {} }
			}
			setSize() {}
			setPixelRatio() {}
			render() {}
		},
		OrbitControls: class {
			constructor() {
				this.domElement = {}
			}
			update() {}
		},
		EdgesGeometry: class {},
		LineSegments: class extends Object3D {},
		LineBasicMaterial: class {},
		PlaneGeometry: class {},
		MeshBasicMaterial: class {},
		CanvasTexture: class {
			constructor() {
				this.needsUpdate = false
			}
		},
		WebGLCubeRenderTarget: class {
			constructor() {
				this.texture = null
			}
		},
		CubeCamera: class {
			constructor() {
				this.renderTarget = { texture: null }
				this.position = new Vector3()
			}
			update() {}
		},
		DoubleSide: 2,
		RGBAFormat: 0,
		LinearMipmapLinearFilter: 0,
		LinearFilter: 0,
		FloatType: 0,
	}
})

vi.mock("three/examples/jsm/controls/OrbitControls.js", () => ({
	OrbitControls: class {
		constructor() {}
	},
}))

// Mock contentLoader so show*Plane resolves predictable HTML
vi.mock("../src/contentLoader.js", () => ({
	loadContentHTML: vi.fn((name) =>
		Promise.resolve(`<div class="test-${name}">${name} content</div>`)
	),
	parseBioContent: vi.fn(() => ({})),
	parseBlogPosts: vi.fn(() => []),
}))

// Now import the module under test
import {
	showBioPlane,
	showPortfolioPlane,
	showBlogPlane,
	hideAllPlanes,
	animatePyramid,
} from "../src/pyramid/pyramid.js"

beforeEach(() => {
	// Minimal DOM the module expects
	document.body.innerHTML = `
        <div id="scene-container"></div>
        <div id="content"></div>
        <div id="content-floor"><div class="bar"></div></div>
    `
	// fast, deterministic RAF that advances time enough to complete animations
	global.requestAnimationFrame = (cb) => cb(performance.now() + 2000)
})

describe("Pyramid UI smoke tests", () => {
	it("showBioPlane displays DOM content and shows content-floor", async () => {
		await showBioPlane()
		const content = document.getElementById("content")
		expect(content.style.display).toBe("block")
		expect(content.innerHTML).toContain("bio content")
		const floor = document.getElementById("content-floor")
		expect(floor.classList.contains("show")).toBe(true)
	})

	it("showPortfolioPlane displays DOM content and shows content-floor", async () => {
		await showPortfolioPlane()
		const content = document.getElementById("content")
		expect(content.style.display).toBe("block")
		expect(content.innerHTML).toContain("portfolio content")
		const floor = document.getElementById("content-floor")
		expect(floor.classList.contains("show")).toBe(true)
	})

	it("showBlogPlane displays DOM content and shows content-floor", async () => {
		await showBlogPlane()
		const content = document.getElementById("content")
		expect(content.style.display).toBe("block")
		expect(content.innerHTML).toContain("blog content")
		const floor = document.getElementById("content-floor")
		expect(floor.classList.contains("show")).toBe(true)
	})

	it("animatePyramid down for blog shows blog content", async () => {
		// Call animatePyramid to request the blog section and wait for RAF to complete
		const content = document.getElementById("content")
		await new Promise((res) => {
			animatePyramid(true, "blog")
			setTimeout(res, 10)
		})
		expect(content.style.display).toBe("block")
		expect(content.innerHTML).toContain("blog content")
		const floor = document.getElementById("content-floor")
		expect(floor.classList.contains("show")).toBe(true)
	})

	it("animatePyramid down for bio shows bio content", async () => {
		const content = document.getElementById("content")
		await new Promise((res) => {
			animatePyramid(true, "bio")
			setTimeout(res, 10)
		})
		expect(content.style.display).toBe("block")
		expect(content.innerHTML).toContain("bio content")
		const floor = document.getElementById("content-floor")
		expect(floor.classList.contains("show")).toBe(true)
	})

	it("animatePyramid down for portfolio shows portfolio content", async () => {
		const content = document.getElementById("content")
		await new Promise((res) => {
			animatePyramid(true, "portfolio")
			setTimeout(res, 10)
		})
		expect(content.style.display).toBe("block")
		expect(content.innerHTML).toContain("portfolio content")
		const floor = document.getElementById("content-floor")
		expect(floor.classList.contains("show")).toBe(true)
	})

	it("clicking pyramid (animate up) hides content pane", async () => {
		// show content first
		await showBioPlane()
		const content = document.getElementById("content")
		expect(content.style.display).toBe("block")
		// Now animate pyramid up (simulate clicking pyramid)
		await new Promise((res) => {
			animatePyramid(false, null)
			// requestAnimationFrame is mocked to advance time; wait a tick
			setTimeout(res, 10)
		})
		// After animation completes, content should be hidden
		expect(content.style.display).toBe("none")
		const floor = document.getElementById("content-floor")
		expect(floor.classList.contains("show")).toBe(false)
	})

	it("hideAllPlanes hides content and content-floor", () => {
		// show then hide
		const content = document.getElementById("content")
		const floor = document.getElementById("content-floor")
		content.style.display = "block"
		floor.classList.add("show")
		hideAllPlanes()
		expect(content.style.display).toBe("none")
		expect(floor.classList.contains("show")).toBe(false)
	})
})
