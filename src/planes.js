import * as THREE from "three"

// === Label Helper ===
export function makeLabelPlane(text, width = 1.6, height = 0.45) {
	const canvas = document.createElement("canvas")
	canvas.width = 1024
	canvas.height = 256
	const ctx = canvas.getContext("2d")
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.fillStyle = "white"
	ctx.font = "bold 120px sans-serif"
	ctx.textAlign = "center"
	ctx.textBaseline = "middle"
	ctx.fillText(text, canvas.width / 2, canvas.height / 2)
	const tex = new THREE.CanvasTexture(canvas)
	return new THREE.Mesh(
		new THREE.PlaneGeometry(width, height),
		new THREE.MeshBasicMaterial({
			map: tex,
			transparent: true,
			side: THREE.DoubleSide,
			// prevent transparent label textures from writing to the depth buffer
			// which can cause dark occlusion artifacts when other geometry overlaps
			depthWrite: false,
		})
	)
}

// === Bio Plane ===
export function makeBioPlane(bioContent) {
	// Accept either a string (legacy) or the structured object { heading, paragraphs: [] }
	const margin = 20
	const canvasWidth = window.innerWidth * 0.9
	const lineHeight = 28
	const paragraphSpacing = 1.5

	const canvas = document.createElement("canvas")
	canvas.width = canvasWidth
	const ctx = canvas.getContext("2d")
	ctx.font = `${lineHeight}px sans-serif`

	// Normalize input
	let heading = ""
	let paragraphs = []
	if (!bioContent) {
		paragraphs = []
	} else if (typeof bioContent === "string") {
		// Legacy: split on double newlines
		const parts = bioContent.split("\n\n")
		paragraphs = parts
	} else if (typeof bioContent === "object") {
		heading = bioContent.heading || ""
		paragraphs = Array.isArray(bioContent.paragraphs)
			? bioContent.paragraphs
			: []
	}

	const lines = []
	if (heading) {
		lines.push(heading)
		lines.push("")
	}

	paragraphs.forEach((paragraph) => {
		const words = String(paragraph).split(" ")
		let currentLine = ""
		words.forEach((word) => {
			const testLine = currentLine ? currentLine + " " + word : word
			if (ctx.measureText(testLine).width > canvas.width - 2 * margin) {
				lines.push(currentLine)
				currentLine = word
			} else {
				currentLine = testLine
			}
		})
		if (currentLine) lines.push(currentLine)
		lines.push("")
	})

	const canvasHeight = Math.max(lines.length * lineHeight + 50, 120)
	canvas.height = canvasHeight

	ctx.font = `${lineHeight}px sans-serif`
	ctx.fillStyle = "white"
	ctx.textAlign = "left"
	ctx.textBaseline = "top"

	let y = 20
	lines.forEach((line) => {
		ctx.fillText(line, margin, y)
		if (line === "") y += lineHeight * paragraphSpacing
		else y += lineHeight
	})

	const texture = new THREE.CanvasTexture(canvas)
	const planeWidth = 6
	const planeHeight = (canvasHeight / canvasWidth) * planeWidth

	const mesh = new THREE.Mesh(
		new THREE.PlaneGeometry(planeWidth, planeHeight),
		new THREE.MeshBasicMaterial({
			map: texture,
			transparent: true,
			side: THREE.DoubleSide,
			// avoid writing transparent pixels into the depth buffer
			depthWrite: false,
		})
	)
	mesh.position.set(0, 0, -1)
	mesh.name = "bioPlane"
	mesh.userData._canvasTexture = texture
	return mesh
}

// === Portfolio Plane ===
export function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
	const words = text.split(" ")
	let line = ""
	for (let n = 0; n < words.length; n++) {
		const testLine = line + words[n] + " "
		const testWidth = ctx.measureText(testLine).width
		if (testWidth > maxWidth && n > 0) {
			ctx.fillText(line, x, y)
			line = words[n] + " "
			y += lineHeight
		} else {
			line = testLine
		}
	}
	ctx.fillText(line, x, y)
}

export function makePortfolioPlane(items) {
	const canvasWidth = window.innerWidth * 0.9
	const canvas = document.createElement("canvas")
	const ctx = canvas.getContext("2d")
	const margin = 40
	const columns = 3
	const cardWidth = (canvasWidth - margin * (columns + 1)) / columns
	const cardHeight = 280
	const rowGap = 80
	const colGap = margin

	const rows = Math.ceil(items.length / columns)
	const canvasHeight = rows * (cardHeight + rowGap) + margin
	canvas.width = canvasWidth
	canvas.height = canvasHeight

	// background (transparent) and text setup
	ctx.fillStyle = "white"
	ctx.textAlign = "left"
	ctx.font = "bold 26px sans-serif"

	const cardRects = []

	items.forEach((item, i) => {
		const col = i % columns
		const row = Math.floor(i / columns)
		const x = margin + col * (cardWidth + colGap)
		const y = margin + row * (cardHeight + rowGap)

		ctx.strokeStyle = "#999"
		ctx.lineWidth = 2
		ctx.strokeRect(x, y, cardWidth, cardHeight)

		ctx.fillStyle = "white"
		ctx.font = "bold 26px sans-serif"
		ctx.fillText(item.title, x + 10, y + 35)
		ctx.font = "20px sans-serif"
		wrapText(ctx, item.description, x + 10, y + 65, cardWidth - 20, 24)

		const imgX = x + 10
		const imgY = y + cardHeight - 150
		const imgW = cardWidth - 20
		const imgH = 130
		ctx.strokeStyle = "#444"
		ctx.strokeRect(imgX, imgY, imgW, imgH)
		ctx.fillStyle = "#ccc"
		ctx.font = "18px sans-serif"
		ctx.fillText("[loading image]", imgX + 10, imgY + imgH / 2 - 8)

		cardRects.push({ x: imgX, y: imgY, w: imgW, h: imgH, item })

		const img = new Image()
		img.crossOrigin = "anonymous"
		img.src = item.image
		img.onload = () => {
			ctx.clearRect(imgX, imgY, imgW, imgH)
			const ratio = Math.min(img.width / imgW, img.height / imgH)
			const sw = imgW * ratio
			const sh = imgH * ratio
			const sx = (img.width - sw) / 2
			const sy = (img.height - sh) / 2
			ctx.drawImage(img, sx, sy, sw, sh, imgX, imgY, imgW, imgH)
			texture.needsUpdate = true
		}
		img.onerror = () => {
			ctx.fillStyle = "white"
			ctx.fillText("[image missing]", imgX + 10, imgY + imgH / 2 - 8)
			texture.needsUpdate = true
		}
	})

	const texture = new THREE.CanvasTexture(canvas)
	texture.minFilter = THREE.LinearFilter
	const planeWidth = 6
	const planeHeight = (canvasHeight / canvasWidth) * planeWidth
	const planeGeo = new THREE.PlaneGeometry(planeWidth, planeHeight)
	const planeMat = new THREE.MeshBasicMaterial({
		map: texture,
		transparent: true,
		side: THREE.DoubleSide,
		// avoid transparent-depth artifacts for canvas-based UI
		depthWrite: false,
	})
	const mesh = new THREE.Mesh(planeGeo, planeMat)
	mesh.position.set(0, 1, -1)
	mesh.name = "portfolioPlane"

	cardRects.forEach((rect, idx) => {
		const cx = rect.x + rect.w / 2
		const cy = rect.y + rect.h / 2
		const nx = (cx - canvasWidth / 2) / canvasWidth
		const ny = (canvasHeight / 2 - cy) / canvasHeight
		const worldX = nx * planeWidth
		const worldY = ny * planeHeight
		const clickableW = (rect.w / canvasWidth) * planeWidth
		const clickableH = (rect.h / canvasHeight) * planeHeight
		const clickableGeo = new THREE.PlaneGeometry(clickableW, clickableH)
		const clickableMat = new THREE.MeshBasicMaterial({
			transparent: true,
			opacity: 0,
			side: THREE.DoubleSide,
			// clickable overlays should not write depth (they are invisible)
			depthWrite: false,
		})
		const clickable = new THREE.Mesh(clickableGeo, clickableMat)
		clickable.position.set(worldX, worldY + 0.05, -0.01)
		// Attach link and log for debugging so we can verify links on the 3D plane
		clickable.userData.link = rect.item.link
		if (clickable.userData.link) {
			console.debug(
				`makePortfolioPlane: clickable[${idx}] link=`,
				clickable.userData.link
			)
		} else {
			console.debug(`makePortfolioPlane: clickable[${idx}] has no link`)
		}
		clickable.name = `portfolioItem${idx}`
		mesh.add(clickable)
	})

	return mesh
}

// === Blog Plane ===
export function makeBlogPlane(posts) {
	// posts: array of { title, date, author, image, summary }
	const margin = 20
	const canvasWidth = window.innerWidth * 0.9
	const lineHeight = 24
	const postSpacing = 40
	const imageH = 120

	const arr = Array.isArray(posts) ? posts : []

	const m = document.createElement("canvas")
	const mc = m.getContext("2d")
	mc.font = `${lineHeight}px sans-serif`
	let total = margin
	arr.forEach((post) => {
		total += lineHeight * 1.5 // title
		total += 18 // meta
		total += imageH + 10
		const words = String(post.summary || "").split(" ")
		let cur = "",
			lines = 0
		words.forEach((w) => {
			const t = cur ? cur + " " + w : w
			if (mc.measureText(t).width > canvasWidth - 2 * margin) {
				if (cur) lines++
				cur = w
			} else cur = t
		})
		if (cur) lines++
		total += lines * lineHeight + postSpacing
	})

	const contentH = total
	const h = Math.min(contentH, window.innerHeight * 0.7)
	const canvas = document.createElement("canvas")
	canvas.width = canvasWidth
	canvas.height = h
	const ctx = canvas.getContext("2d")
	ctx.font = `${lineHeight}px sans-serif`
	ctx.fillStyle = "white"
	ctx.textAlign = "left"
	ctx.textBaseline = "top"

	let y = margin
	arr.forEach((post) => {
		if (y > canvas.height - 50) return
		ctx.font = `bold ${lineHeight}px sans-serif`
		ctx.fillText(String(post.title || ""), margin, y)
		y += lineHeight + 6
		ctx.font = `${Math.max(11, lineHeight - 8)}px sans-serif`
		ctx.fillStyle = "#bbb"
		ctx.fillText(`${post.date || ""} | ${post.author || ""}`, margin, y)
		y += 18

		const imgW = canvasWidth - 2 * margin
		const imgH = imageH
		ctx.strokeStyle = "#555"
		ctx.lineWidth = 1
		ctx.strokeRect(margin, y, imgW, imgH)
		ctx.fillStyle = "#333"
		ctx.fillRect(margin, y, imgW, imgH)

		const img = new Image()
		img.crossOrigin = "anonymous"
		img.src = post.image
		img.onload = () => {
			ctx.clearRect(margin, y, imgW, imgH)
			const ratio = Math.min(img.width / imgW, img.height / imgH)
			const sw = imgW * ratio
			const sh = imgH * ratio
			const sx = (img.width - sw) / 2
			const sy = (img.height - sh) / 2
			ctx.drawImage(img, sx, sy, sw, sh, margin, y, imgW, imgH)
			if (tex) tex.needsUpdate = true
		}

		y += imgH + 10

		ctx.font = `${lineHeight - 2}px sans-serif`
		ctx.fillStyle = "white"
		const words = String(post.summary || "").split(" ")
		let cur = ""
		words.forEach((w) => {
			const t = cur ? cur + " " + w : w
			if (ctx.measureText(t).width > canvasWidth - 2 * margin) {
				if (cur) ctx.fillText(cur, margin, y)
				y += lineHeight
				cur = w
			} else cur = t
		})
		if (cur) {
			ctx.fillText(cur, margin, y)
			y += lineHeight
		}
		y += postSpacing - lineHeight
	})

	const tex = new THREE.CanvasTexture(canvas)
	const pw = 6
	const ph = (canvas.height / canvas.width) * pw
	const mesh = new THREE.Mesh(
		new THREE.PlaneGeometry(pw, ph),
		new THREE.MeshBasicMaterial({
			map: tex,
			transparent: true,
			side: THREE.DoubleSide,
			// avoid transparent-depth artifacts
			depthWrite: false,
		})
	)
	mesh.position.set(0, 0, -1)
	mesh.name = "blogPlane"
	return mesh
}
