import * as THREE from "three"
import { getCurrentSection } from "../pyramid/state.js"

let scrollOverlay = null
let scrollTrack = null
let scrollThumb = null
let activeScrollPlane = null
let scrollMinY = 0.0
let scrollMaxY = 0.0
const scrollBoundsBox = new THREE.Box3()

export const ScrollManager = {
	setup(plane) {
		activeScrollPlane = plane
		updateScrollBounds()
		createOverlay()
		scrollOverlay.style.display = "block"
		updateScrollThumb()
	},

	hide() {
		if (scrollOverlay) scrollOverlay.style.display = "none"
		activeScrollPlane = null
	},

	update() {
		if (activeScrollPlane) updateScrollBounds()
	},
}

function createOverlay() {
	if (scrollOverlay) return

	scrollOverlay = document.createElement("div")
	scrollOverlay.id = "content-overlay"
	Object.assign(scrollOverlay.style, {
		position: "absolute",
		top: "25%",
		bottom: "0",
		left: "0",
		right: "0",
		zIndex: "10",
		display: "none",
		pointerEvents: "none",
	})

	const stopProp = (e) => e.stopPropagation()
	scrollOverlay.addEventListener("pointerdown", stopProp)
	scrollOverlay.addEventListener("click", stopProp)
	scrollOverlay.addEventListener("mousedown", stopProp)
	scrollOverlay.addEventListener("touchstart", stopProp)
	scrollOverlay.addEventListener("wheel", handleScrollWheel, { passive: false })

	scrollTrack = document.createElement("div")
	Object.assign(scrollTrack.style, {
		position: "absolute",
		top: "10px",
		bottom: "10px",
		right: "10px",
		width: "8px",
		background: "rgba(255, 255, 255, 0.1)",
		borderRadius: "4px",
		cursor: "pointer",
		pointerEvents: "auto",
	})

	scrollThumb = document.createElement("div")
	Object.assign(scrollThumb.style, {
		position: "absolute",
		top: "0",
		left: "0",
		width: "100%",
		height: "20%",
		background: "rgba(255, 255, 255, 0.5)",
		borderRadius: "4px",
		cursor: "grab",
	})

	setupDragLogic()

	scrollTrack.appendChild(scrollThumb)
	scrollOverlay.appendChild(scrollTrack)
	document.body.appendChild(scrollOverlay)
}

function setupDragLogic() {
	let isDragging = false
	let startY = 0
	let startTop = 0

	scrollThumb.addEventListener("pointerdown", (e) => {
		e.stopPropagation()
		e.target.setPointerCapture(e.pointerId)
		isDragging = true
		startY = e.clientY
		startTop = scrollThumb.offsetTop
		scrollThumb.style.cursor = "grabbing"
	})

	scrollThumb.addEventListener("pointermove", (e) => {
		if (!isDragging) return
		e.stopPropagation()
		const deltaY = e.clientY - startY
		const trackHeight = scrollTrack.clientHeight
		const thumbHeight = scrollThumb.clientHeight
		const maxTop = trackHeight - thumbHeight

		let newTop = startTop + deltaY
		newTop = Math.max(0, Math.min(newTop, maxTop))

		const ratio = maxTop > 0 ? newTop / maxTop : 0
		if (activeScrollPlane && scrollMaxY > scrollMinY) {
			activeScrollPlane.position.y =
				scrollMinY + ratio * (scrollMaxY - scrollMinY)
		}
		updateScrollThumb()
	})

	scrollThumb.addEventListener("pointerup", (e) => {
		isDragging = false
		scrollThumb.style.cursor = "grab"
		e.target.releasePointerCapture(e.pointerId)
	})
}

function updateScrollBounds() {
	if (!activeScrollPlane) return
	scrollBoundsBox.setFromObject(activeScrollPlane)
	const h = scrollBoundsBox.max.y - scrollBoundsBox.min.y
	if (h === -Infinity || isNaN(h)) return

	const targetY = h - 1.5
	scrollMinY = 0.0
	scrollMaxY = Math.max(0.0, targetY)

	if (activeScrollPlane.position.y > scrollMaxY)
		activeScrollPlane.position.y = scrollMaxY

	updateScrollThumb()
}

function handleScrollWheel(e) {
	if (!activeScrollPlane) return
	e.preventDefault()
	e.stopPropagation()
	activeScrollPlane.position.y += e.deltaY * 0.005

	if (activeScrollPlane.position.y < scrollMinY)
		activeScrollPlane.position.y = scrollMinY
	if (activeScrollPlane.position.y > scrollMaxY)
		activeScrollPlane.position.y = scrollMaxY
	updateScrollThumb()
}

function updateScrollThumb() {
	if (!activeScrollPlane || !scrollThumb || !scrollTrack) return
	const range = scrollMaxY - scrollMinY
	if (range <= 0.001) {
		scrollThumb.style.height = "100%"
		scrollThumb.style.top = "0"
		return
	}
	const progress = (activeScrollPlane.position.y - scrollMinY) / range
	const trackHeight = scrollTrack.clientHeight
	const visibleH = 5.6
	const contentH = range + visibleH
	let thumbHeight = (visibleH / contentH) * trackHeight
	thumbHeight = Math.max(30, Math.min(thumbHeight, trackHeight))

	scrollThumb.style.height = `${thumbHeight}px`
	const maxTop = trackHeight - thumbHeight
	scrollThumb.style.top = `${progress * maxTop}px`
}

window.addEventListener(
	"wheel",
	(e) => {
		if (getCurrentSection() && activeScrollPlane) {
			handleScrollWheel(e)
		}
	},
	{ passive: false }
)
