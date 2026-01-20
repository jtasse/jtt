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
		this.onPointerDown = this.onPointerDown.bind(this)
		this.onPointerMove = this.onPointerMove.bind(this)
		this.onPointerUp = this.onPointerUp.bind(this)
		this.onClick = this.onClick.bind(this)

		this.enable()
	}

	enable() {
		// Use pointer events on the canvas to match OrbitControls behavior
		this.renderer.domElement.addEventListener("pointerdown", this.onPointerDown)
		window.addEventListener("pointermove", this.onPointerMove)
		window.addEventListener("pointerup", this.onPointerUp)
		window.addEventListener("click", this.onClick, true)
	}

	onPointerDown(event) {
		this.isPointerDown = true
		this.isDragging = false
		this.pointerDownPos.set(event.clientX, event.clientY)
	}

	onPointerMove(event) {
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
		} catch (_e) {
			this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1
			this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
		}

		this.processHover(event)
	}

	onPointerUp(_event) {
		this.isPointerDown = false
		// Don't reset isDragging here; we need it for the click handler
		// It will be reset on the next pointer down
	}
	onClick(event) {
		// Block clicks on canvas to prevent default behavior, but allow UI clicks
		const content = document.getElementById("content")
		const orcInfoPane = document.getElementById("orc-info-pane")
		const orcOverlay = document.getElementById("orc-preview-overlay")
		const userGuideOverlay = document.getElementById("user-guide-overlay")
		const contactPane = document.querySelector(".contact-pane")

		if (
			(content && content.contains(event.target)) ||
			(orcInfoPane && orcInfoPane.contains(event.target)) ||
			(orcOverlay && orcOverlay.contains(event.target)) ||
			(userGuideOverlay && userGuideOverlay.contains(event.target)) ||
			(contactPane && contactPane.contains(event.target))
		) {
			return
		}

		// If we dragged, ignore this click (OrbitControls handled the drag)
		if (this.isDragging) return

		this.processClick(event)
	}

	addClickHandler(handler) {
		this.clickHandlers.push(handler)
	}

	addHoverHandler(handler) {
		this.hoverHandlers.push(handler)
	}

	processClick(event) {
		// Update pointer coordinates from click event (not relying on last mouseMove)
		try {
			const rect = this.renderer.domElement.getBoundingClientRect()
			this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
			this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
		} catch (_e) {
			this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1
			this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
		}

		this.raycaster.setFromCamera(this.pointer, this.camera)
		for (const handler of this.clickHandlers) {
			if (handler(this.raycaster, event)) return
		}
	}

	processHover(event) {
		// Update pointer coordinates from click event (not relying on last mouseMove)
		try {
			const rect = this.renderer.domElement.getBoundingClientRect()
			this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
			this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
		} catch (_e) {
			this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1
			this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
		}

		this.raycaster.setFromCamera(this.pointer, this.camera)
		for (const handler of this.hoverHandlers) {
			handler(this.raycaster, event)
		}
	}

	setCursor(style) {
		this.renderer.domElement.style.cursor = style
	}
}
