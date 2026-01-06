import * as THREE from "three"

export const pyramidDimensions = {
	size: 3.375,
	height: 3.025,
}

export function createPyramid() {
	const group = new THREE.Group()
	group.rotation.order = "YXZ"

	const { size, height } = pyramidDimensions
	const halfSize = size / 2
	const triHeight = (Math.sqrt(3) / 2) * size
	// Normal pyramid: base at bottom, apex at top
	const apex = new THREE.Vector3(0, height / 2, 0)
	const v1 = new THREE.Vector3(-halfSize, -height / 2, triHeight / 3)
	const v2 = new THREE.Vector3(halfSize, -height / 2, triHeight / 3)
	const v3 = new THREE.Vector3(0, -height / 2, (-2 * triHeight) / 3)

	const faces = [
		{ name: "Blog", verts: [apex.clone(), v1.clone(), v2.clone()] },
		{ name: "Portfolio", verts: [apex.clone(), v2.clone(), v3.clone()] },
		{ name: "About", verts: [apex.clone(), v3.clone(), v1.clone()] },
	]

	faces.forEach((f) => {
		const geom = new THREE.BufferGeometry()
		geom.setAttribute(
			"position",
			new THREE.BufferAttribute(
				new Float32Array(f.verts.flatMap((v) => [v.x, v.y, v.z])),
				3
			)
		)
		geom.computeVertexNormals()

		const mat = new THREE.MeshStandardMaterial({
			color: 0x111111,
			metalness: 0.8,
			roughness: 0.4,
			side: THREE.DoubleSide,
			transparent: false,
			opacity: 1,
			depthWrite: true,
			depthTest: true,
		})

		const mesh = new THREE.Mesh(geom, mat)
		const edges = new THREE.EdgesGeometry(geom)
		mesh.add(
			new THREE.LineSegments(
				edges,
				new THREE.LineBasicMaterial({ color: 0xffffff })
			)
		)

		group.add(mesh)
		f.mesh = mesh
	})

	// === Pyramid Base (closes the pyramid to make it a solid, opaque shape) ===
	const baseGeom = new THREE.BufferGeometry()
	// Base triangle uses v1, v2, v3 in reverse order (v3, v2, v1) so the normal points downward (inside the pyramid)
	baseGeom.setAttribute(
		"position",
		new THREE.BufferAttribute(
			new Float32Array([v3.x, v3.y, v3.z, v2.x, v2.y, v2.z, v1.x, v1.y, v1.z]),
			3
		)
	)
	baseGeom.computeVertexNormals()

	const baseMat = new THREE.MeshStandardMaterial({
		color: 0x111111,
		metalness: 0.8,
		roughness: 0.4,
		side: THREE.DoubleSide,
		transparent: false,
		opacity: 1,
		depthWrite: true,
		depthTest: true,
	})

	const baseMesh = new THREE.Mesh(baseGeom, baseMat)
	// Add edges to base for visual consistency
	const baseEdges = new THREE.EdgesGeometry(baseGeom)
	baseMesh.add(
		new THREE.LineSegments(
			baseEdges,
			new THREE.LineBasicMaterial({ color: 0xffffff })
		)
	)
	group.add(baseMesh)
	group.position.y = 0.35
	return group
}
