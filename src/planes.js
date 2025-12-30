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

// === Contact Label Helper (multi-line with border) ===
export function makeContactLabelPlane(config) {
	const { revealedSize } = config
	const width = revealedSize[0]
	const height = revealedSize[1]

	// Tooltip configuration (hover state)
	const tooltipConfig = {
		text: config.tooltipText || "Click to copy email address",
		fontSize: config.tooltipFontSize || 36,
		color: config.tooltipColor || "#4da6ff",
		bgColor: config.tooltipBgColor || "rgba(0, 0, 0, 0.85)",
		padding: config.tooltipPadding || 12,
		borderRadius: config.tooltipBorderRadius || 8,
		offsetX: config.tooltipOffsetX || 20,
		offsetY: config.tooltipOffsetY || -50,
		slideDistance: config.tooltipSlideDistance || 30,
		animationDuration: config.tooltipAnimationDuration || 200,
	}

	// Toast configuration (after click)
	const toastConfig = {
		text: config.toastText || "Copied!",
		fontSize: config.toastFontSize || 36,
		color: config.toastColor || "#08a13b",
		bgColor: config.toastBgColor || "rgba(0, 0, 0, 0.85)",
		padding: config.toastPadding || 12,
		borderRadius: config.toastBorderRadius || 8,
		offsetX: config.toastOffsetX || 20,
		offsetY: config.toastOffsetY || -50,
		slideDistance: config.toastSlideDistance || 30,
		duration: config.toastDuration || 2000,
		animationDuration: config.toastAnimationDuration || 200,
	}

	// Phone number offset to align with email text (after icon+gap)
	const phoneOffsetX = config.phoneOffsetX || 0

	// Email hover color
	const emailHoverColor = config.emailHoverColor || tooltipConfig.color

	const canvas = document.createElement("canvas")
	canvas.width = 1024
	canvas.height = 512

	const tex = new THREE.CanvasTexture(canvas)
	const mat = new THREE.MeshBasicMaterial({
		map: tex,
		transparent: true,
		side: THREE.DoubleSide,
		depthWrite: false,
		// Enable depth testing so pyramid can properly occlude contact info when viewed from behind
		depthTest: true,
		alphaTest: 0.1,
	})
	const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat)

	// Store current appearance config for redraws
	let currentConfig = null
	let animationId = null
	let toastTimeout = null
	let tooltipVisible = false
	let emailHovered = false
	let currentPopupType = null // 'tooltip' or 'toast'

	// Copy icon SVG path (from Material Icons)
	const copyIconPath = new Path2D(
		"M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"
	)

	function drawClipboardIcon(ctx, x, y, size, color = "white") {
		ctx.save()
		// Transform from SVG viewBox (0 -960 960 960) to target position/size
		ctx.translate(x, y + size)
		const scale = size / 960
		ctx.scale(scale, -scale) // Flip Y since SVG has inverted Y
		ctx.translate(0, 960) // Shift to account for viewBox y=-960
		ctx.fillStyle = color
		ctx.fill(copyIconPath)
		ctx.restore()
	}

	// Draw rounded rectangle helper
	function drawRoundedRect(ctx, x, y, w, h, radius) {
		ctx.beginPath()
		ctx.moveTo(x + radius, y)
		ctx.lineTo(x + w - radius, y)
		ctx.quadraticCurveTo(x + w, y, x + w, y + radius)
		ctx.lineTo(x + w, y + h - radius)
		ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h)
		ctx.lineTo(x + radius, y + h)
		ctx.quadraticCurveTo(x, y + h, x, y + h - radius)
		ctx.lineTo(x, y + radius)
		ctx.quadraticCurveTo(x, y, x + radius, y)
		ctx.closePath()
	}

	// popupState: { type: 'tooltip'|'toast', slideOffset: 0-1, opacity: 0-1 } or null
	function updateTexture(appearanceConfig, popupState = null) {
		currentConfig = appearanceConfig
		const { lines, textAlign, titleFontSize, bodyFontSize } = appearanceConfig

		const ctx = canvas.getContext("2d")
		ctx.clearRect(0, 0, canvas.width, canvas.height)

		// Draw border (Rectangle or Pentagon with cutout)
		ctx.strokeStyle = "white"
		ctx.lineWidth = 4
		const margin = 20
		const w = canvas.width
		const h = canvas.height

		ctx.beginPath()
		ctx.rect(margin, margin, w - 2 * margin, h - 2 * margin)
		ctx.stroke()

		// Draw text lines
		ctx.fillStyle = "white"
		ctx.textAlign = textAlign || "left"
		ctx.textBaseline = "middle"
		const leftMargin = 40
		const rightMargin = canvas.width - 40

		const lineHeight = canvas.height / (lines.length + 1)
		lines.forEach((line, i) => {
			let xPos = leftMargin
			if (textAlign === "center") {
				xPos = canvas.width / 2
			} else if (textAlign === "right") {
				xPos = rightMargin
			}

			if (i === 0) {
				ctx.font = `bold ${titleFontSize || 80}px sans-serif`
				ctx.fillText(line, xPos, lineHeight * (i + 1))

				// Draw popup (tooltip or toast) if active
				if (popupState && popupState.opacity > 0) {
					// Select config based on popup type
					const cfg = popupState.type === 'tooltip' ? tooltipConfig : toastConfig
					const titleY = lineHeight * (i + 1)

					// Calculate popup position with slide offset
					const slideOffset =
						(1 - popupState.slideOffset) * cfg.slideDistance

					// Get title width to position popup
					ctx.font = `bold ${titleFontSize || 80}px sans-serif`
					const titleWidth = ctx.measureText(line).width

					// Calculate popup text dimensions
					ctx.font = `${cfg.fontSize}px sans-serif`
					const textMetrics = ctx.measureText(cfg.text)
					const popupTextWidth = textMetrics.width
					const popupTextHeight = cfg.fontSize

					// Popup box dimensions
					const boxPadding = cfg.padding
					const boxWidth = popupTextWidth + boxPadding * 2
					const boxHeight = popupTextHeight + boxPadding * 2

					// Popup position
					let popupX
					if (textAlign === "center") {
						popupX = xPos + titleWidth / 2 + cfg.offsetX
					} else {
						popupX = xPos + titleWidth + cfg.offsetX
					}
					const popupY = titleY + cfg.offsetY + slideOffset

					// Save context for opacity
					ctx.save()
					ctx.globalAlpha = popupState.opacity

					// Draw background
					ctx.fillStyle = cfg.bgColor
					drawRoundedRect(
						ctx,
						popupX - boxPadding,
						popupY - popupTextHeight / 2 - boxPadding,
						boxWidth,
						boxHeight,
						cfg.borderRadius
					)
					ctx.fill()

					// Draw text
					ctx.font = `${cfg.fontSize}px sans-serif`
					ctx.fillStyle = cfg.color
					ctx.textAlign = "left"
					ctx.textBaseline = "middle"
					ctx.fillText(cfg.text, popupX, popupY)

					ctx.restore()

					// Reset for remaining content
					ctx.textAlign = textAlign || "left"
					ctx.fillStyle = "white"
				}
			} else if (i === 1) {
				ctx.font = `${bodyFontSize || 60}px sans-serif`

				const iconSize = 60
				const gap = 15
				let startX = xPos
				if (textAlign === "center") {
					const textWidth = ctx.measureText(line).width
					const totalWidth = iconSize + gap + textWidth
					startX = (canvas.width - totalWidth) / 2
				}
				const y = lineHeight * (i + 1)
				const iconX = startX
				const iconY = y - iconSize / 2

				// Draw the clipboard icon (always white)
				drawClipboardIcon(ctx, iconX, iconY, iconSize, "white")

				// Draw email text (use hover color if hovered)
				const originalAlign = ctx.textAlign
				ctx.textAlign = "left"
				ctx.fillStyle = emailHovered ? emailHoverColor : "white"
				ctx.fillText(line, startX + iconSize + gap, y)

				// Store email click region in canvas coordinates (normalized 0-1)
				const emailTextWidth = ctx.measureText(line).width
				mesh.userData.emailClickRegion = {
					x1: startX / canvas.width,
					y1: (y - iconSize / 2) / canvas.height,
					x2: (startX + iconSize + gap + emailTextWidth) / canvas.width,
					y2: (y + iconSize / 2) / canvas.height,
					email: line,
				}

				ctx.textAlign = originalAlign
			} else {
				// Phone number and other lines - apply offset to align with email text
				ctx.font = `${bodyFontSize || 60}px sans-serif`
				ctx.fillStyle = "white"
				ctx.fillText(line, xPos + phoneOffsetX, lineHeight * (i + 1))
			}
		})
		tex.needsUpdate = true
	}

	// Easing function for smooth animation
	function easeOutCubic(t) {
		return 1 - Math.pow(1 - t, 3)
	}

	function easeInCubic(t) {
		return t * t * t
	}

	// Cancel any running animation
	function cancelAnimation() {
		if (animationId) {
			cancelAnimationFrame(animationId)
			animationId = null
		}
		if (toastTimeout) {
			clearTimeout(toastTimeout)
			toastTimeout = null
		}
	}

	// Show tooltip on hover
	function showTooltip() {
		// Don't show tooltip if toast is active
		if (currentPopupType === 'toast') return
		// Don't re-animate if already showing
		if (tooltipVisible && currentPopupType === 'tooltip') return

		cancelAnimation()
		tooltipVisible = true
		emailHovered = true
		currentPopupType = 'tooltip'

		const animDuration = tooltipConfig.animationDuration
		let startTime = null

		function animateIn(timestamp) {
			if (!startTime) startTime = timestamp
			const elapsed = timestamp - startTime
			const progress = Math.min(elapsed / animDuration, 1)
			const eased = easeOutCubic(progress)

			updateTexture(currentConfig, { type: 'tooltip', slideOffset: eased, opacity: eased })

			if (progress < 1) {
				animationId = requestAnimationFrame(animateIn)
			} else {
				animationId = null
			}
		}

		animationId = requestAnimationFrame(animateIn)
	}

	// Hide tooltip when mouse leaves
	function hideTooltip() {
		// Don't hide if toast is showing (toast takes priority)
		if (currentPopupType === 'toast') return
		if (!tooltipVisible && !emailHovered) return

		cancelAnimation()
		tooltipVisible = false
		emailHovered = false

		const animDuration = tooltipConfig.animationDuration
		let startTime = null

		function animateOut(timestamp) {
			if (!startTime) startTime = timestamp
			const elapsed = timestamp - startTime
			const progress = Math.min(elapsed / animDuration, 1)
			const eased = easeInCubic(progress)

			updateTexture(currentConfig, {
				type: 'tooltip',
				slideOffset: 1 - eased,
				opacity: 1 - eased,
			})

			if (progress < 1) {
				animationId = requestAnimationFrame(animateOut)
			} else {
				animationId = null
				currentPopupType = null
				updateTexture(currentConfig, null)
			}
		}

		animationId = requestAnimationFrame(animateOut)
	}

	// Show "Copied!" toast with slide up animation (replaces tooltip)
	function showCopiedMessage() {
		cancelAnimation()
		tooltipVisible = false
		emailHovered = false
		currentPopupType = 'toast'

		const animDuration = toastConfig.animationDuration
		const showDuration = toastConfig.duration
		let startTime = null

		// Phase 1: Slide up animation
		function animateIn(timestamp) {
			if (!startTime) startTime = timestamp
			const elapsed = timestamp - startTime
			const progress = Math.min(elapsed / animDuration, 1)
			const eased = easeOutCubic(progress)

			updateTexture(currentConfig, { type: 'toast', slideOffset: eased, opacity: eased })

			if (progress < 1) {
				animationId = requestAnimationFrame(animateIn)
			} else {
				// Animation complete, wait for duration then fade out
				animationId = null
				toastTimeout = setTimeout(() => {
					startTime = null
					animationId = requestAnimationFrame(animateOut)
				}, showDuration)
			}
		}

		// Phase 2: Slide down + fade out animation
		function animateOut(timestamp) {
			if (!startTime) startTime = timestamp
			const elapsed = timestamp - startTime
			const progress = Math.min(elapsed / animDuration, 1)
			const eased = easeInCubic(progress)

			updateTexture(currentConfig, {
				type: 'toast',
				slideOffset: 1 - eased,
				opacity: 1 - eased,
			})

			if (progress < 1) {
				animationId = requestAnimationFrame(animateOut)
			} else {
				// Animation complete, clear popup
				animationId = null
				currentPopupType = null
				updateTexture(currentConfig, null)
			}
		}

		// Start slide up animation
		animationId = requestAnimationFrame(animateIn)
	}

	mesh.userData.updateTexture = updateTexture
	mesh.userData.showTooltip = showTooltip
	mesh.userData.hideTooltip = hideTooltip
	mesh.userData.showCopiedMessage = showCopiedMessage

	// Initial draw with revealed settings
	const revealedConfig = {
		lines: config.lines,
		textAlign: config.revealedTextAlign,
		titleFontSize: config.revealedTitleFontSize,
		bodyFontSize: config.revealedBodyFontSize,
	}
	mesh.userData.updateTexture(revealedConfig)

	return mesh
}

// === About Plane ===
export function makeAboutPlane(aboutContent) {
	// Accept either a string (legacy) or the structured object { heading, paragraphs: [] }
	const margin = 30
	const canvasWidth = window.innerWidth * 0.95
	// Use more vertical space - leave room for nav at top
	const maxContentHeight = window.innerHeight * 0.75
	const lineHeight = 30
	const paragraphSpacing = 1.5

	const canvas = document.createElement("canvas")
	canvas.width = canvasWidth
	const ctx = canvas.getContext("2d")
	ctx.font = `${lineHeight}px sans-serif`

	// Normalize input
	let heading = ""
	let paragraphs = []
	if (!aboutContent) {
		paragraphs = []
	} else if (typeof aboutContent === "string") {
		// Legacy: split on double newlines
		const parts = aboutContent.split("\n\n")
		paragraphs = parts
	} else if (typeof aboutContent === "object") {
		heading = aboutContent.heading || ""
		paragraphs = Array.isArray(aboutContent.paragraphs)
			? aboutContent.paragraphs
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

	const rawHeight = lines.length * lineHeight + 50
	const canvasHeight = Math.max(Math.min(rawHeight, maxContentHeight), 120)
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
	const planeWidth = 6.5
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
	// Position content below nav area - center vertically in remaining space
	mesh.position.set(0, -0.3, -1)
	mesh.name = "aboutPlane"
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
	const canvasWidth = window.innerWidth * 0.95
	// Use more vertical space - leave room for nav at top
	const maxContentHeight = window.innerHeight * 0.75
	const canvas = document.createElement("canvas")
	const ctx = canvas.getContext("2d")
	const margin = 50
	const columns = 2
	const cardWidth = (canvasWidth - margin * (columns + 1)) / columns
	const cardHeight = 320
	const rowGap = 60
	const colGap = margin

	const rows = Math.ceil(items.length / columns)
	const rawHeight = rows * (cardHeight + rowGap) + margin
	const canvasHeight = Math.min(rawHeight, maxContentHeight)
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

		cardRects.push({ x: x, y: y, w: cardWidth, h: cardHeight, item })

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
	const planeWidth = 6.5
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
	// Position content below nav area - center vertically in remaining space
	mesh.position.set(0, -0.3, -1)
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
		clickable.position.set(worldX, worldY, -0.01)
		clickable.userData.link = rect.item.link
		clickable.name = `portfolioItem${idx}`
		mesh.add(clickable)
	})

	return mesh
}

// === Blog Plane ===
export function makeBlogPlane(posts) {
	// posts: array of { title, date, author, image, summary }
	const margin = 30
	const canvasWidth = window.innerWidth * 0.95
	// Use more vertical space - leave room for nav at top
	const maxContentHeight = window.innerHeight * 0.75
	const lineHeight = 26
	const postSpacing = 50
	const imageH = 140

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
	const h = Math.min(contentH, maxContentHeight)
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
	const pw = 6.5
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
	// Position content below nav area - center vertically in remaining space
	mesh.position.set(0, -0.3, -1)
	mesh.name = "blogPlane"
	return mesh
}
