import * as THREE from "three"

export function createPyramid() {
	const group = new THREE.Group()
	group.name = "PyramidGroup"

	// 3-sided pyramid (tetrahedron)
	const geometry = new THREE.ConeGeometry(1.8, 2.2, 3)
	const material = new THREE.MeshStandardMaterial({
		color: 0x151515,
		roughness: 0.3,
		metalness: 0.8,
		flatShading: true,
	})

	const mesh = new THREE.Mesh(geometry, material)
	mesh.name = "PyramidMesh"
	mesh.rotation.y = -Math.PI / 2

	group.add(mesh)
	return group
}
