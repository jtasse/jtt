import * as THREE from "three"

export class InputManager {
	constructor(renderer, camera) {
		this.renderer = renderer
		this.camera = camera
		this.raycaster = new THREE.Raycaster()
		this.pointer = new THREE.Vector2()

		this.isPointerDown = false
		this.isDragging = false
		this.pointerDownPos = new THREE.Vector2()
		this.dragThreshold = 5

		this.clickHandlers = []
		this.hoverHandlers = []

		// Bind methods
		this.onMouseDown = this.onMouseDown.bind(this)
		this.onMouseMove = this.onMouseMove.bind(this)
		this.onMouseUp = this.onMouseUp.bind(this)
		this.onClick = this.onClick.bind(this)

		this.enable()
	}

	enable() {
		window.addEventListener("mousedown", this.onMouseDown)
		window.addEventListener("mousemove", this.onMouseMove)
		window.addEventListener("mouseup", this.onMouseUp)
		window.addEventListener("click", this.onClick, true)
	}

	disable() {
		window.removeEventListener("mousedown", this.onMouseDown)
		window.removeEventListener("mousemove", this.onMouseMove)
		window.removeEventListener("mouseup", this.onMouseUp)
		window.removeEventListener("click", this.onClick, true)
	}

	onMouseDown(event) {
		if (event.target.tagName !== "CANVAS") return
		this.isPointerDown = true
		this.isDragging = false
		this.pointerDownPos.set(event.clientX, event.clientY)
	}

	onMouseMove(event) {
		if (this.isPointerDown) {
			const dx = event.clientX - this.pointerDownPos.x
			const dy = event.clientY - this.pointerDownPos.y
			if (Math.sqrt(dx * dx + dy * dy) > this.dragThreshold) {
				this.isDragging = true
			}
		}

		// Update pointer coordinates
		try {
			const rect = this.renderer.domElement.getBoundingClientRect()
			this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
			this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
		} catch (e) {
			this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1
			this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
		}

		this.processHover(event)
	}

	onMouseUp(event) {
		this.isPointerDown = false
		if (!this.isDragging && event.target.tagName === "CANVAS") {
			this.processClick(event)
		}
		this.isDragging = false
	}
	onClick(event) {
		// Block clicks on canvas to prevent default behavior, but allow UI clicks
		const content = document.getElementById("content")
		const orcInfoPane = document.getElementById("orc-info-pane")
		const orcOverlay = document.getElementById("orc-preview-overlay")

		if (
			(content && content.contains(event.target)) ||
			(orcInfoPane && orcInfoPane.contains(event.target)) ||
			(orcOverlay && orcOverlay.contains(event.target))
		) {
			return
		}

		event.preventDefault()
		event.stopPropagation()
	}

	addClickHandler(handler) {
		this.clickHandlers.push(handler)
	}

	addHoverHandler(handler) {
		this.hoverHandlers.push(handler)
	}

	processClick(event) {
		this.raycaster.setFromCamera(this.pointer, this.camera)
		for (const handler of this.clickHandlers) {
			if (handler(this.raycaster, event)) return
		}
	}

	processHover(event) {
		this.raycaster.setFromCamera(this.pointer, this.camera)
		for (const handler of this.hoverHandlers) {
			handler(this.raycaster, event)
		}
	}

	setCursor(style) {
		this.renderer.domElement.style.cursor = style
	}
}
