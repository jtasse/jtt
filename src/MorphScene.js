import * as THREE from "three"
import gsap from "gsap"

export class MorphScene {
	constructor(canvas) {
		this.canvas = canvas
		this.width = window.innerWidth
		this.height = window.innerHeight

		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera(
			45,
			this.width / this.height,
			0.1,
			100
		)
		this.camera.position.z = 5

		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
			alpha: true,
			antialias: true,
		})
		this.renderer.setSize(this.width, this.height)
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

		this.initLights()
		this.initObject()

		window.addEventListener("resize", this.onResize.bind(this))

		this.tick = this.tick.bind(this)
		this.tick()
	}

	initLights() {
		const ambient = new THREE.AmbientLight(0xffffff, 0.5)
		const point = new THREE.PointLight(0xffffff, 1)
		point.position.set(10, 10, 10)
		this.scene.add(ambient, point)
	}

	initObject() {
		// 1. The Perfect Pyramid (Low Poly, for Home State)
		// Detail 0 = exactly 4 faces. No internal lines possible.
		const pyramidGeometry = new THREE.TetrahedronGeometry(1.5, 0)

		// 2. The Morphing Mesh (High Poly, for Transitions/Planet)
		// Use detail 3 for a smooth sphere.
		let morphGeometry = new THREE.TetrahedronGeometry(1.5, 3)
		morphGeometry = morphGeometry.toNonIndexed()

		// Process Geometry: Align Morph Mesh Base to Pyramid, Morph Target to Sphere
		this.processGeometry(morphGeometry, pyramidGeometry)

		// 3. Shared Material
		this.material = new THREE.MeshStandardMaterial({
			color: 0x4488ff, // Default Planet Blue
			flatShading: false, // We control flatness via morph normals
			roughness: 0.4,
			metalness: 0.6,
		})

		this.pyramidMesh = new THREE.Mesh(pyramidGeometry, this.material)
		this.morphMesh = new THREE.Mesh(morphGeometry, this.material)

		// Default State: Sphere (Morph Mesh Visible, Influence 1)
		this.morphMesh.morphTargetInfluences[0] = 1
		this.pyramidMesh.visible = false

		this.scene.add(this.pyramidMesh)
		this.scene.add(this.morphMesh)
	}

	processGeometry(morphGeo, refGeo) {
		// Extract planes from the Reference Pyramid (refGeo)
		// This ensures the morph mesh flattens exactly onto the perfect pyramid's faces.
		const refPos = refGeo.attributes.position
		const planes = []

		for (let i = 0; i < refPos.count; i += 3) {
			const a = new THREE.Vector3().fromBufferAttribute(refPos, i)
			const b = new THREE.Vector3().fromBufferAttribute(refPos, i + 1)
			const c = new THREE.Vector3().fromBufferAttribute(refPos, i + 2)

			const normal = new THREE.Vector3()
				.crossVectors(b.clone().sub(a), c.clone().sub(a))
				.normalize()
			const d = normal.dot(a)
			planes.push({ normal, d })
		}

		// Process Morph Geometry
		const posAttribute = morphGeo.attributes.position

		// Arrays for the Base (Pyramid) and Morph (Sphere)
		const pyramidPos = []
		const pyramidNorm = []
		const spherePos = []
		const sphereNorm = []

		for (let i = 0; i < posAttribute.count; i++) {
			const v = new THREE.Vector3().fromBufferAttribute(posAttribute, i)

			// SPHERE DATA (The current geometry is already a sphere)
			spherePos.push(v.x, v.y, v.z)
			// Normal of a sphere at origin is just the normalized position
			const n = v.clone().normalize()
			sphereNorm.push(n.x, n.y, n.z)

			// PYRAMID DATA (Project sphere vertex onto closest tetrahedron face)
			// Find closest face
			let maxDot = -Infinity
			let bestPlane = planes[0]

			for (const plane of planes) {
				const dot = n.dot(plane.normal)
				if (dot > maxDot) {
					maxDot = dot
					bestPlane = plane
				}
			}

			// Project onto plane along the radius vector
			const t = bestPlane.d / n.dot(bestPlane.normal)
			const p = n.multiplyScalar(t)

			pyramidPos.push(p.x, p.y, p.z)
			pyramidNorm.push(
				bestPlane.normal.x,
				bestPlane.normal.y,
				bestPlane.normal.z
			)
		}

		// Update Geometry to be the PYRAMID (Base)
		morphGeo.setAttribute(
			"position",
			new THREE.Float32BufferAttribute(pyramidPos, 3)
		)
		morphGeo.setAttribute(
			"normal",
			new THREE.Float32BufferAttribute(pyramidNorm, 3)
		)

		// Add SPHERE as Morph Target
		morphGeo.morphAttributes.position = [
			new THREE.Float32BufferAttribute(spherePos, 3),
		]
		morphGeo.morphAttributes.normal = [
			new THREE.Float32BufferAttribute(sphereNorm, 3),
		]
	}

	onResize() {
		this.width = window.innerWidth
		this.height = window.innerHeight
		this.camera.aspect = this.width / this.height
		this.camera.updateProjectionMatrix()
		this.renderer.setSize(this.width, this.height)
	}

	tick() {
		if (this.morphMesh && this.pyramidMesh) {
			this.morphMesh.rotation.y += 0.002
			this.pyramidMesh.rotation.y += 0.002
		}
		this.renderer.render(this.scene, this.camera)
		window.requestAnimationFrame(this.tick)
	}

	// Transition Methods
	animateToHome() {
		if (!this.morphMesh) return

		// Kill any running animations
		gsap.killTweensOf(this.morphMesh.morphTargetInfluences)
		gsap.killTweensOf(this.material.color)
		gsap.killTweensOf(this.morphMesh.scale)
		gsap.killTweensOf(this.pyramidMesh.scale)

		// Instant Reset to Home State (Simulate fresh load)
		this.morphMesh.morphTargetInfluences[0] = 0
		this.scene.remove(this.morphMesh)
		this.scene.add(this.pyramidMesh)
		this.pyramidMesh.visible = true

		this.material.color.setHex(0xffd700) // Gold
		this.morphMesh.scale.set(1.2, 1.2, 1.2)
		this.pyramidMesh.scale.set(1.2, 1.2, 1.2)

		// Reset rotation to simulate a fresh entry
		this.morphMesh.rotation.set(0, 0, 0)
		this.pyramidMesh.rotation.set(0, 0, 0)
	}

	animateToOrcDemo() {
		if (!this.morphMesh) return

		// SWAP: Show morph mesh, hide perfect pyramid
		this.scene.remove(this.pyramidMesh)
		this.scene.add(this.morphMesh)
		this.morphMesh.visible = true

		gsap.to(this.morphMesh.morphTargetInfluences, {
			0: 1, // 1 = Morph Target (Sphere)
			duration: 1.5,
			ease: "power2.inOut",
		})
		gsap.to(this.material.color, { r: 0.26, g: 0.53, b: 1, duration: 1.5 }) // Blue
		gsap.to(this.morphMesh.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 1.5 })
		gsap.to(this.pyramidMesh.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 1.5 })
	}

	animateToPortfolio() {
		if (!this.morphMesh) return

		// SWAP: Show morph mesh (Portfolio is a Star/Sphere)
		this.scene.remove(this.pyramidMesh)
		this.scene.add(this.morphMesh)
		this.morphMesh.visible = true

		gsap.to(this.morphMesh.morphTargetInfluences, {
			0: 1, // 1 = Morph Target (Sphere/Star)
			duration: 1.5,
			ease: "power2.inOut",
		})
		gsap.to(this.material.color, { r: 1, g: 1, b: 1, duration: 1.5 }) // White
		gsap.to(this.morphMesh.scale, { x: 0.1, y: 0.1, z: 0.1, duration: 1.5 }) // Distant Star
		gsap.to(this.pyramidMesh.scale, { x: 0.1, y: 0.1, z: 0.1, duration: 1.5 })
	}
}
