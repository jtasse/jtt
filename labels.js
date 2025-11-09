const labelConfigs = {
	Bio: {
		text: "Bio",
		position: { x: -0.7, y: 0.04, z: 0.4 },
		rotation: { x: 0, y: 0.438, z: 1 },
		size: [1.5, 0.45],
	},
	Portfolio: {
		text: "Portfolio",
		position: { x: 0.7, y: 0, z: 0.4 },
		rotation: { x: -0.102, y: -0.502, z: -1 },
		size: [1.8, 0.45],
	},
	Blog: {
		text: "Blog",
		position: { x: 0, y: -1.05, z: 0.7 },
		rotation: { x: 0, y: 0, z: 0 },
		size: [1.8, 0.5],
	},
}

for (const key in labelConfigs) {
	const cfg = labelConfigs[key]
	const mesh = makeLabelPlane(cfg.text, ...cfg.size)
	mesh.position.set(cfg.position.x, cfg.position.y, cfg.position.z)
	mesh.rotation.set(cfg.rotation.x, cfg.rotation.y, cfg.rotation.z)
	labels[key] = mesh // <-- add mesh to exported object
	mesh.userData.name = key
}
