import * as THREE from "three"
import { pyramidGroup } from "../pyramid/state.js"
import "path2d-polyfill"

export const contactConfig = {
	lines: ["james.tasse@gmail.com", "(216)-219-1538"],
	revealedTextAlign: "center",
	revealedBodyFontSize: 60,
	revealedSize: [3.0, 1.5],
	// Hidden position (below pyramid, out of view)
	hiddenPosition: { x: 0, y: -2.5, z: 0.8 },
	// Revealed position (in front of pyramid)
	revealedPosition: { x: 0, y: -0.5, z: 0.85 },
	// Tooltip configuration (hover state)
	tooltipText: "Click to copy",
	tooltipFontSize: 36,
	tooltipColor: "#4da6ff",
	tooltipBgColor: "rgba(0, 0, 0, 0.85)",
	tooltipPadding: 12,
	tooltipBorderRadius: 8,
	tooltipOffsetX: 20,
	tooltipOffsetY: -50,
	tooltipSlideDistance: 30,
	tooltipAnimationDuration: 200,
	// Email hover color
	emailHoverColor: "#4da6ff",
	// Toast configuration (after click)
	toastText: "Copied!",
	toastFontSize: 36,
	toastColor: "#08a13b",
	toastBgColor: "rgba(0, 0, 0, 0.85)",
	toastPadding: 12,
	toastBorderRadius: 8,
	toastOffsetX: 20,
	toastOffsetY: -50,
	toastSlideDistance: 30,
	toastDuration: 2000,
	toastAnimationDuration: 200,
}

export let contactLabel = null
export let contactDetails = null
let contactVisible = false

export function initContactLabel() {
	if (contactDetails) return // Already initialized
	contactDetails = makeContactLabelPlane(contactConfig)
	contactDetails.name = "contactDetails"
	contactDetails.visible = false
	contactDetails.material.opacity = 0
	// Start at hidden position
	contactDetails.position.set(
		contactConfig.hiddenPosition.x,
		contactConfig.hiddenPosition.y,
		contactConfig.hiddenPosition.z
	)
	pyramidGroup.add(contactDetails)
}

export function showContactLabelCentered() {
	if (!contactDetails || contactVisible) return // Don't show if already visible
	contactVisible = true

	const cfg = contactConfig
	contactDetails.visible = true

	// Animate from hidden to revealed position
	const startY = cfg.hiddenPosition.y
	const endY = cfg.revealedPosition.y
	const startZ = cfg.hiddenPosition.z
	const endZ = cfg.revealedPosition.z
	const duration = 600
	const startTime = performance.now()

	function animateSlideUp(time) {
		const t = Math.min((time - startTime) / duration, 1)
		// Ease out cubic
		const eased = 1 - Math.pow(1 - t, 3)

		contactDetails.position.y = startY + (endY - startY) * eased
		contactDetails.position.z = startZ + (endZ - startZ) * eased
		contactDetails.material.opacity = eased

		if (t < 1) {
			requestAnimationFrame(animateSlideUp)
		}
	}
	requestAnimationFrame(animateSlideUp)
}

export function hideContactLabel() {
	if (!contactDetails) return
	contactVisible = false
	contactDetails.visible = false
	contactDetails.material.opacity = 0
	// Reset to hidden position
	contactDetails.position.set(
		contactConfig.hiddenPosition.x,
		contactConfig.hiddenPosition.y,
		contactConfig.hiddenPosition.z
	)
}

export function setContactExpanded(expanded) {
	// Stub for future implementation
}

export function isContactVisible() {
	return contactVisible
}

function makeContactLabelPlane(config) {
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
	let activePopup = null // { index: number, type: 'tooltip'|'toast', progress: 0-1 }
	let hoveredIndex = -1

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

	// popupOverride: optional { type, progress } to override current animation state for a frame
	function updateTexture(appearanceConfig, popupOverride = null) {
		currentConfig = appearanceConfig
		const { lines, textAlign, bodyFontSize } = appearanceConfig

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
		ctx.fillStyle = "rgba(0, 0, 0, 0.9)"
		ctx.fill()
		ctx.stroke()

		// Draw text lines
		ctx.fillStyle = "white"
		ctx.textAlign = textAlign || "left"
		ctx.textBaseline = "middle"
		const leftMargin = 40

		// Calculate layout
		// We need space at the top for tooltips, so we push content down
		const contentStartY = 140
		const lineHeight = 120

		// Clear previous click regions
		mesh.userData.clickRegions = []

		lines.forEach((line, i) => {
			const y = contentStartY + i * lineHeight

			ctx.font = `${bodyFontSize || 60}px sans-serif`
			const iconSize = 60
			const gap = 20

			// Calculate width to center content if needed
			const textWidth = ctx.measureText(line).width
			const totalWidth = iconSize + gap + textWidth

			let startX = leftMargin
			if (textAlign === "center") {
				startX = (canvas.width - totalWidth) / 2
			}

			const iconX = startX
			const iconY = y - iconSize / 2
			const textX = startX + iconSize + gap

			// Draw the clipboard icon (always white)
			drawClipboardIcon(ctx, iconX, iconY, iconSize, "white")

			// Draw text (use hover color if this line is hovered)
			const isHovered = i === hoveredIndex
			ctx.fillStyle = isHovered ? emailHoverColor : "white"
			ctx.textAlign = "left" // Always draw left-aligned relative to startX
			ctx.fillText(line, textX, y)

			// Store click region for this line
			mesh.userData.clickRegions.push({
				index: i,
				text: line,
				x1: startX / canvas.width,
				y1: (y - iconSize / 2) / canvas.height,
				x2: (textX + textWidth) / canvas.width,
				y2: (y + iconSize / 2) / canvas.height,
			})
		})

		// Draw popup (tooltip or toast) on top of everything
		const popup = popupOverride || activePopup
		if (popup && popup.progress > 0) {
			const { index, type, progress } = popup
			const cfg = type === "tooltip" ? tooltipConfig : toastConfig

			// Fixed Y position for tooltips (below phone number area)
			const fixedPopupY = 400

			// Calculate popup position with slide offset
			const slideOffset = (1 - progress) * cfg.slideDistance
			const popupY = fixedPopupY + slideOffset

			// Prepare text first to get dimensions
			let displayText = cfg.text
			if (type === "tooltip") {
				// Customize tooltip text based on content
				displayText = `Click to copy ${lines[index]}`
			}

			ctx.font = `${cfg.fontSize}px sans-serif`
			const textMetrics = ctx.measureText(displayText)
			const boxPadding = cfg.padding
			const boxWidth = textMetrics.width + boxPadding * 2
			const boxHeight = cfg.fontSize + boxPadding * 2

			// Determine X position (left edge)
			let popupLeftX = (canvas.width - boxWidth) / 2 // Default center fallback

			// If we have region data, center on the text
			if (mesh.userData.clickRegions[index]) {
				const r = mesh.userData.clickRegions[index]
				// Align left edge of tooltip with start of text for both email and phone
				const startX = r.x1 * canvas.width
				const iconSize = 60
				const gap = 20
				const textX = startX + iconSize + gap
				popupLeftX = textX
			}

			// Apply offset from config
			popupLeftX += cfg.offsetX

			// Save context for opacity
			ctx.save()
			ctx.globalAlpha = progress

			// Draw background
			ctx.fillStyle = cfg.bgColor
			drawRoundedRect(
				ctx,
				popupLeftX,
				popupY - boxHeight / 2,
				boxWidth,
				boxHeight,
				cfg.borderRadius
			)
			ctx.fill()

			// Draw text
			ctx.fillStyle = cfg.color
			ctx.textAlign = "left"
			ctx.textBaseline = "middle"
			ctx.fillText(displayText, popupLeftX + boxPadding, popupY)

			ctx.restore()
		}

		tex.needsUpdate = true
	}

	// Animation state
	let animationId = null
	let toastTimeout = null

	function easeOutCubic(t) {
		return 1 - Math.pow(1 - t, 3)
	}

	function easeInCubic(t) {
		return t * t * t
	}

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

	function setHoveredIndex(index) {
		if (hoveredIndex !== index) {
			hoveredIndex = index
			updateTexture(currentConfig, activePopup)
		}
	}

	function showTooltip(index) {
		// Don't show tooltip if toast is active
		if (activePopup && activePopup.type === "toast") return
		// Don't re-animate if already showing this tooltip
		if (activePopup && activePopup.type === "tooltip" && activePopup.index === index && activePopup.progress === 1) return

		cancelAnimation()
		activePopup = { index, type: "tooltip", progress: 0 }

		const animDuration = tooltipConfig.animationDuration
		let startTime = null

		function animateIn(timestamp) {
			if (!startTime) startTime = timestamp
			const elapsed = timestamp - startTime
			const progress = Math.min(elapsed / animDuration, 1)
			activePopup.progress = easeOutCubic(progress)
			updateTexture(currentConfig, activePopup)

			if (progress < 1) {
				animationId = requestAnimationFrame(animateIn)
			} else {
				animationId = null
			}
		}

		animationId = requestAnimationFrame(animateIn)
	}

	function hideTooltip() {
		// Don't hide if toast is showing
		if (activePopup && activePopup.type === "toast") return
		if (!activePopup || activePopup.type !== "tooltip") return

		cancelAnimation()
		const startProgress = activePopup.progress

		const animDuration = tooltipConfig.animationDuration
		let startTime = null

		function animateOut(timestamp) {
			if (!startTime) startTime = timestamp
			const elapsed = timestamp - startTime
			const progress = Math.min(elapsed / animDuration, 1)
			activePopup.progress = startProgress * (1 - easeInCubic(progress))
			updateTexture(currentConfig, activePopup)

			if (progress < 1) {
				animationId = requestAnimationFrame(animateOut)
			} else {
				animationId = null
				activePopup = null
				hoveredIndex = -1
				updateTexture(currentConfig, null)
			}
		}

		animationId = requestAnimationFrame(animateOut)
	}

	function showCopiedMessage(index) {
		cancelAnimation()
		activePopup = { index, type: "toast", progress: 0 }

		const animDuration = toastConfig.animationDuration
		const showDuration = toastConfig.duration
		let startTime = null

		function animateIn(timestamp) {
			if (!startTime) startTime = timestamp
			const elapsed = timestamp - startTime
			const progress = Math.min(elapsed / animDuration, 1)
			activePopup.progress = easeOutCubic(progress)
			updateTexture(currentConfig, activePopup)

			if (progress < 1) {
				animationId = requestAnimationFrame(animateIn)
			} else {
				animationId = null
				toastTimeout = setTimeout(() => {
					startTime = null
					animationId = requestAnimationFrame(animateOut)
				}, showDuration)
			}
		}

		function animateOut(timestamp) {
			if (!startTime) startTime = timestamp
			const elapsed = timestamp - startTime
			const progress = Math.min(elapsed / animDuration, 1)
			activePopup.progress = 1 - easeInCubic(progress)
			updateTexture(currentConfig, activePopup)

			if (progress < 1) {
				animationId = requestAnimationFrame(animateOut)
			} else {
				animationId = null
				activePopup = null
				updateTexture(currentConfig, null)
			}
		}

		animationId = requestAnimationFrame(animateIn)
	}

	mesh.userData.updateTexture = updateTexture
	mesh.userData.setHoveredIndex = setHoveredIndex
	mesh.userData.showTooltip = showTooltip
	mesh.userData.hideTooltip = hideTooltip
	mesh.userData.showCopiedMessage = showCopiedMessage

	// Initial draw with revealed settings
	const revealedConfig = {
		lines: config.lines,
		textAlign: config.revealedTextAlign,
		bodyFontSize: config.revealedBodyFontSize,
	}
	mesh.userData.updateTexture(revealedConfig)

	return mesh
}

// Handle click on contact details - copy text to clipboard
export function handleContactClick(text, index) {
	if (!text) return

	navigator.clipboard
		.writeText(text)
		.then(() => {
			// Show "Copied!" toast
			if (contactDetails && contactDetails.userData.showCopiedMessage) {
				contactDetails.userData.showCopiedMessage(index)
			}
		})
		.catch((err) => {
			console.error("Failed to copy to clipboard:", err)
		})
}
