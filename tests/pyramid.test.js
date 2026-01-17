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
			return this
		}
		add(v) {
			this.x += v.x
			this.y += v.y
			this.z += v.z
			return this
		}
		sub(v) {
			this.x -= v.x
			this.y -= v.y
			this.z -= v.z
			return this
		}
		multiplyScalar(s) {
			this.x *= s
			this.y *= s
			this.z *= s
			return this
		}
		normalize() {
			return this
		}
		applyQuaternion() {
			return this
		}
		lerpVectors(a, b, t) {
			this.x = a.x + (b.x - a.x) * t
			this.y = a.y + (b.y - a.y) * t
			this.z = a.z + (b.z - a.z) * t
			return this
		}
		distanceTo() {
			return 0
		}
		dot() {
			return 0
		}
	}

	class Quaternion {
		constructor() {}
		copy(q) {
			return this
		}
		clone() {
			return new Quaternion()
		}
		setFromEuler() {
			return this
		}
		slerpQuaternions() {
			return this
		}
		set() {
			return this
		}
	}

	class Object3D {
		constructor() {
			this.children = []
			this.position = new Vector3()
			this.rotation = new Vector3()
			this.scale = {
				set: () => {},
				x: 1,
				y: 1,
				z: 1,
				clone: () => ({ x: 1, y: 1, z: 1, copy: () => {} }),
				copy: () => {},
			}
			this.userData = {}
			this.visible = true
			this.quaternion = new Quaternion()
			this.parent = null
		}
		add(c) {
			this.children.push(c)
			c.parent = this
		}

		remove(c) {
			this.children = this.children.filter((ch) => ch !== c)
			if (c.parent === this) c.parent = null
		}

		attach(c) {
			this.add(c)
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

		updateMatrixWorld() {}
		getWorldPosition(target) {
			return target || new Vector3()
		}
		getWorldQuaternion(target) {
			return target || new Quaternion()
		}
		getWorldScale(target) {
			return target || new Vector3()
		}
		traverse(cb) {
			cb(this)
			this.children.forEach((c) => c.traverse(cb))
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
			setHex() {}
			setRGB() {}
			setHSL() {}
		},
		Vector3,
		Vector2: class {
			constructor(x, y) {
				this.x = x
				this.y = y
			}
			set() {}
		},
		Quaternion,
		Euler: class {
			constructor() {}
			set() {}
			copy() {}
			clone() {
				return this
			}
		},
		Matrix4: class {
			constructor() {}
		},
		Box3: class {
			constructor() {
				this.min = new Vector3()
				this.max = new Vector3()
			}
			setFromObject() {
				return this
			}
		},
		Plane: class {
			constructor() {}
		},
		Raycaster: class {
			constructor() {
				this.ray = { intersectPlane: () => null }
			}
			setFromCamera() {}
			intersectObjects() {
				return []
			}
			intersectObject() {
				return []
			}
		},
		BufferGeometry: class {
			setAttribute() {}
			computeVertexNormals() {}
			setFromPoints() {
				return this
			}
			dispose() {}
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
				this.material = { opacity: 1, transparent: false, dispose: () => {} }
				this.name = ""
				this.isMesh = true
				this.geometry = { dispose: () => {} }
			}
		},
		MeshStandardMaterial: class {
			constructor() {
				this.envMap = null
				this.envMapIntensity = 1
				this.needsUpdate = false
				this.dispose = () => {}
			}
		},
		MeshBasicMaterial: class {
			constructor() {
				this.dispose = () => {}
			}
		},
		LineBasicMaterial: class {
			constructor() {
				this.dispose = () => {}
			}
		},
		LineDashedMaterial: class {
			constructor() {
				this.dispose = () => {}
			}
		},
		SpriteMaterial: class {
			constructor() {
				this.dispose = () => {}
			}
		},
		ShaderMaterial: class {
			constructor() {
				this.dispose = () => {}
			}
		},
		PointsMaterial: class {
			constructor() {
				this.dispose = () => {}
			}
		},
		Group: class extends Object3D {},
		AmbientLight: class extends Object3D {},
		DirectionalLight: class extends Object3D {
			constructor() {
				super()
				this.position = new Vector3()
			}
		},
		Points: class extends Object3D {},
		PerspectiveCamera: class extends Object3D {
			constructor() {
				super()
				this.position = new Vector3()
				this.aspect = 1
				this.updateProjectionMatrix = () => {}
			}
			lookAt() {}
		},
		WebGLRenderer: class {
			constructor() {
				this.domElement = document.createElement("canvas")
			}
			setSize() {}
			setPixelRatio() {}
			render() {}
			dispose() {}
		},
		OrbitControls: class {
			constructor() {
				this.domElement = {}
				this.target = new Vector3()
			}
			update() {}
		},
		EdgesGeometry: class {
			dispose() {}
		},
		LineSegments: class extends Object3D {},
		PlaneGeometry: class {
			dispose() {}
		},
		SphereGeometry: class {
			dispose() {}
		},
		TorusGeometry: class {
			dispose() {}
		},
		ConeGeometry: class {
			dispose() {}
		},
		BoxGeometry: class {
			dispose() {}
		},
		CanvasTexture: class {
			constructor() {
				this.needsUpdate = false
				this.dispose = () => {}
			}
		},
		WebGLCubeRenderTarget: class {
			constructor() {
				this.texture = null
			}
		},
		CubeCamera: class extends Object3D {
			constructor() {
				super()
				this.renderTarget = { texture: null }
				this.position = new Vector3()
			}
			update() {}
		},
		EllipseCurve: class {
			getPoints() {
				return []
			}
		},
		LineLoop: class extends Object3D {},
		Line: class extends Object3D {
			computeLineDistances() {}
		},
		Sprite: class extends Object3D {
			constructor() {
				super()
				this.scale = { set: () => {} }
			}
		},
		TextureLoader: class {
			load() {
				return {}
			}
		},

		DoubleSide: 2,
		BackSide: 1,
		RGBAFormat: 0,
		LinearMipmapLinearFilter: 0,
		LinearFilter: 0,
		FloatType: 0,
		AdditiveBlending: 2,
		SRGBColorSpace: "srgb",
		RepeatWrapping: 1000,
		ClampToEdgeWrapping: 1001,
	}
})

vi.mock("three/examples/jsm/controls/OrbitControls.js", () => ({
	OrbitControls: class {
		constructor() {
			this.target = { set: () => {}, copy: () => {} }
			this.update = () => {}
			this.domElement = {}
		}
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

// Mock HandManager
vi.mock("../src/hand/HandManager.js", () => ({
	getRoamingHand: vi.fn(() => null),
	updateHandIdleMotion: vi.fn(),
	setCurrentHandPage: vi.fn(),
}))

// Mock OrcDemoManager
vi.mock("../src/content/orc-demo/OrcDemoManager.js", () => ({
	OrcDemoManager: {
		start: vi.fn(),
		stop: vi.fn(),
		isActive: false,
	},
}))

// Mock ContactLabel to prevent canvas context errors during side-effect initialization
vi.mock("../src/contact/ContactLabel.js", () => ({
	initContactLabel: vi.fn(),
}))

// Mock GSAP to execute animations immediately
vi.mock("gsap", () => {
	const timelineMock = {
		to: function (target, vars) {
			if (vars && vars.onComplete) vars.onComplete()
			if (vars && vars.onReverseComplete)
				this._onReverseComplete = vars.onReverseComplete
			return this
		},
		fromTo: function (target, from, to) {
			if (to && to.onComplete) to.onComplete()
			if (to && to.onReverseComplete)
				this._onReverseComplete = to.onReverseComplete
			return this
		},
		add: function (value) {
			if (typeof value === "function") value()
			return this
		},
		call: function (callback, params) {
			if (typeof callback === "function") callback.apply(null, params || [])
			return this
		},
		eventCallback: function (event, callback, params) {
			if (event === "onComplete" && typeof callback === "function")
				callback.apply(null, params || [])
			if (event === "onReverseComplete" && typeof callback === "function") {
				this._onReverseComplete = callback
				this._onReverseCompleteParams = params
			}
			return this
		},
		play: function () {
			return this
		},
		reverse: function () {
			if (this._onReverseComplete)
				this._onReverseComplete.apply(null, this._onReverseCompleteParams || [])
			return this
		},
	}
	return {
		default: {
			to: (target, vars) => {
				if (vars && vars.onComplete) vars.onComplete()
				return { kill: () => {} }
			},
			delayedCall: (delay, callback, params) => {
				if (callback) callback.apply(null, params || [])
				return { kill: () => {} }
			},
			timeline: (vars) => {
				if (vars && vars.onComplete) vars.onComplete()
				if (vars && vars.onReverseComplete)
					timelineMock._onReverseComplete = vars.onReverseComplete
				return timelineMock
			},
			registerPlugin: () => {},
		},
	}
})

// Now import the module under test
import {
	showAboutPlane,
	showPortfolioPlane,
	showBlogPlane,
	hideAllPlanes,
	animatePyramid,
} from "../src/pyramid/pyramid.js"

describe("Pyramid UI smoke tests", () => {
	let mockLabelManager

	beforeEach(() => {
		// Minimal DOM the module expects
		document.body.innerHTML = `
			<div id="scene-container"></div>
			<div id="content"></div>
			<div id="content-floor"><div class="bar"></div></div>
		`
		// fast, deterministic RAF that advances time enough to complete animations
		global.requestAnimationFrame = (cb) => cb(performance.now() + 2000)

		// Mock LabelManager
		mockLabelManager = {
			showHomeLabel: vi.fn(),
			hideHomeLabel: vi.fn(),
			getLabels: vi.fn(() => ({})),
			getNavPosition: vi.fn(() => ({ x: 0, y: 0, z: 0 })),
		}
	})

	it("showAboutPlane displays DOM content", async () => {
		await showAboutPlane()
		const content = document.getElementById("content")
		expect(content.style.display).not.toBe("none")
		expect(content.innerHTML).toContain("about-content")
	})

	it("showPortfolioPlane displays DOM content", async () => {
		await showPortfolioPlane()
		const content = document.getElementById("content")
		expect(content.style.display).not.toBe("none")
		expect(content.innerHTML).toContain("portfolio-content")
	})

	it("showBlogPlane displays DOM content", async () => {
		await showBlogPlane()
		const content = document.getElementById("content")
		expect(content.style.display).not.toBe("none")
		expect(content.innerHTML).toContain("blog-content")
	})

	it("animatePyramid down for blog shows blog content", async () => {
		// Call animatePyramid to request the blog section and wait for RAF to complete
		await new Promise((res) => {
			animatePyramid(mockLabelManager, true, "blog")
			setTimeout(res, 10)
		})
		const content = document.getElementById("content")
		expect(content.style.display).not.toBe("none")
		expect(content.innerHTML).toContain("blog-content")
	})

	it("animatePyramid down for about shows about content", async () => {
		await new Promise((res) => {
			animatePyramid(mockLabelManager, true, "about")
			setTimeout(res, 10)
		})
		const content = document.getElementById("content")
		expect(content.style.display).not.toBe("none")
		expect(content.innerHTML).toContain("about-content")
	})

	it("animatePyramid down for portfolio shows portfolio content", async () => {
		await new Promise((res) => {
			animatePyramid(mockLabelManager, true, "portfolio")
			setTimeout(res, 10)
		})
		const content = document.getElementById("content")
		expect(content.style.display).not.toBe("none")
		expect(content.innerHTML).toContain("portfolio-content")
	})

	it("clicking pyramid (animate up) hides content pane", async () => {
		// show content first
		await showAboutPlane()
		const content = document.getElementById("content")
		expect(content.style.display).not.toBe("none")

		// First animate down to set up the state/timeline
		await new Promise((res) => {
			animatePyramid(mockLabelManager, true, "about")
			setTimeout(res, 10)
		})

		// Now animate pyramid up (simulate clicking pyramid)
		await new Promise((res) => {
			animatePyramid(mockLabelManager, false, null)
			// requestAnimationFrame is mocked to advance time; wait a tick
			setTimeout(res, 10)
		})
		// After animation completes, content should be hidden
		expect(content.style.display).toBe("none")
	})

	it("hideAllPlanes hides content", () => {
		// show then hide
		const content = document.getElementById("content")
		content.style.display = "block"
		hideAllPlanes()
		expect(content.style.display).toBe("none")
	})
})
