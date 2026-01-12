import * as THREE from "three"

// === Label Helper ===
export function makeLabelPlane(text, width = 1.6, height = 0.45) {
	const canvas = document.createElement("canvas")
	canvas.width = 1024
	canvas.height = 256
	const ctx = canvas.getContext("2d")
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.fillStyle = "white"
	ctx.font = "bold 120px Helvetica, sans-serif"
	ctx.textAlign = "center"
	ctx.textBaseline = "middle"
	ctx.fillText(text, canvas.width / 2, canvas.height / 2)
	const tex = new THREE.CanvasTexture(canvas)
	const mat = new THREE.MeshBasicMaterial({
		map: tex,
		transparent: true,
		side: THREE.DoubleSide,
		// prevent transparent label textures from writing to the depth buffer
		// which can cause dark occlusion artifacts when other geometry overlaps
		depthWrite: false,
		// Enable depth testing so pyramid can properly occlude labels when viewed from behind
		depthTest: true,
	})
	const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat)
	return mesh
}
