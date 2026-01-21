import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import {
	createOrcScene,
	animateOrcScene,
	satellites,
	startDecommission,
	cancelDecommission,
	canCancelDecommission,
	disposeOrcScene,
	orcGroup,
	showGeoTether,
	hideGeoTether,
	orcHandStateMachine,
	setOrcHand,
	releaseOrcHand,
	getDecommissionState,
	getDecommissionConfig,
} from "./orc-demo.js"
import { getRoamingHand } from "../../hand/HandManager.js"

console.log("[OrcDemoManager] Module loading...")

// ORC scene state
let orcDemoContainer = null
let orcDemoRenderer = null
let orcDemoScene = null
let orcDemoCamera = null
let orcDemoRequestId = null
let orcDemoControls = null
let orcInfoPane = null
let selectionIndicator = null
let selectedSatellite = null
let orcDemoResizeObserver = null

// Camera tracking state
let originalCameraState = null
let isCameraTracking = false
// Smoothed camera target to reduce jerking on phase transitions
let smoothedCameraTarget = null

// Animation pause state
let isPaused = false

export const OrcDemoManager = {
	isActive: false,
	escapeListener: null,
	keydownListener: null,

	start() {
		console.log("[OrcDemoManager] Starting...")
		console.log("[OrcDemoManager] isActive:", this.isActive)
		if (this.isActive) {
			console.warn("[OrcDemoManager] Already active, returning")
			return
		}
		this.isActive = true

		console.log("[OrcDemoManager] Calling createOrcDemo()")
		try {
			createOrcDemo()
			console.log("[OrcDemoManager] createOrcDemo() completed successfully")
		} catch (error) {
			console.error("[OrcDemoManager] ERROR in createOrcDemo():", error)
			console.error("[OrcDemoManager] Stack:", error.stack)
			this.isActive = false
			return
		}
		console.log("[OrcDemoManager] orcDemoContainer:", orcDemoContainer)
		console.log("[OrcDemoManager] orcDemoRenderer:", orcDemoRenderer)
		console.log("[OrcDemoManager] orcDemoScene:", orcDemoScene)

		showAvailableSatellitesPane()

		// Increase contact pane opacity
		const contactPane = document.querySelector(".contact-pane, #contact-pane")
		if (contactPane) {
			contactPane.style.opacity = "1"
			contactPane.style.backgroundColor = "black"
		}

		// Fade in
		if (orcDemoContainer) {
			orcDemoContainer.style.opacity = "0"
			orcDemoContainer.style.transition = "opacity 0.6s ease-in"
			// Force reflow to ensure transition plays
			void orcDemoContainer.offsetWidth
			requestAnimationFrame(() => {
				orcDemoContainer.style.opacity = "1"
			})
		}

		// Transfer hand to ORC demo scene
		const roamingHand = getRoamingHand()
		if (roamingHand) {
			// Position hand off-screen to the left in ORC scene coordinates
			roamingHand.position.set(-10, 0, 4) // z:4 to be in front in ORC scene
			setOrcHand(roamingHand, orcDemoCamera)

			// Animate hand flying in from the left
			setTimeout(() => {
				flyHandIntoOrcScene()
			}, 300)
		}

		// Set up spacebar listener for play/pause
		this.keydownListener = (e) => {
			if (e.code === "Space" && !e.target.matches("input, textarea, button")) {
				e.preventDefault()
				togglePause()
			}
		}
		document.addEventListener("keydown", this.keydownListener)
	},

	stop() {
		if (!this.isActive) return

		// Restore contact pane opacity
		const contactPane = document.querySelector(".contact-pane, #contact-pane")
		if (contactPane) {
			contactPane.style.opacity = ""
			contactPane.style.backgroundColor = ""
		}

		document.body.classList.remove("orc-doc-active")

		// Release hand
		const hand = releaseOrcHand()

		destroyOrcDemo()

		// Remove info pane if it exists
		if (orcInfoPane) {
			orcInfoPane.remove()
			orcInfoPane = null
		}

		// Remove doc viewer if it exists
		const docViewer = document.getElementById("orc-doc-viewer")
		if (docViewer) {
			docViewer.remove()
		}

		if (this.escapeListener) {
			document.removeEventListener("keydown", this.escapeListener)
			this.escapeListener = null
		}

		if (this.keydownListener) {
			document.removeEventListener("keydown", this.keydownListener)
			this.keydownListener = null
		}

		// Reset pause state
		isPaused = false

		this.isActive = false
		return hand
	},

	onResize() {
		if (orcDemoRenderer && orcDemoCamera && orcDemoContainer) {
			const rect = orcDemoContainer.getBoundingClientRect()
			// Fallback to window dimensions if container is collapsed (e.g. CSS loading issue)
			const width = rect.width || window.innerWidth
			const height = rect.height || window.innerHeight

			if (width === 0 || height === 0) return
			orcDemoCamera.aspect = width / height
			orcDemoCamera.updateProjectionMatrix()
			orcDemoRenderer.setSize(width, height)
		}
	},
}

// Fly hand into ORC scene from the left
function flyHandIntoOrcScene() {
	const roamingHand = getRoamingHand()
	if (!roamingHand) return

	const startX = -10
	const endX = 3
	const duration = 1200

	roamingHand.position.x = startX
	const startTime = performance.now()

	function animateEntry(time) {
		const elapsed = time - startTime
		const t = Math.min(elapsed / duration, 1)
		const eased = 1 - Math.pow(1 - t, 3)

		roamingHand.position.x = startX + (endX - startX) * eased

		if (t < 1) {
			requestAnimationFrame(animateEntry)
		}
	}
	requestAnimationFrame(animateEntry)
}

function createOrcDemo() {
	try {
		console.log("[createOrcDemo] Starting...")
		if (orcDemoContainer) {
			console.log("[createOrcDemo] Container already exists, returning")
			return
		}

		// 1. Create container
		console.log("[createOrcDemo] Creating container element")
		orcDemoContainer = document.createElement("div")
		orcDemoContainer.id = "orc-demo-container"
		console.log("[createOrcDemo] Appending container to body")
		document.body.appendChild(orcDemoContainer)
		console.log(
			"[createOrcDemo] Container appended. Body has",
			document.body.children.length,
			"children",
		)

		// Safety check: Apply fallback styles if CSS didn't load or variables are missing
		const computed = window.getComputedStyle(orcDemoContainer)
		console.log(
			"[createOrcDemo] Computed styles - position:",
			computed.position,
			"width:",
			computed.width,
			"height:",
			computed.height,
		)
		if (computed.position !== "fixed" || computed.width === "0px") {
			console.warn("[createOrcDemo] CSS not loaded? Applying fallbacks.")
			orcDemoContainer.style.position = "fixed"
			orcDemoContainer.style.top = "85px"
			orcDemoContainer.style.left = "0"
			orcDemoContainer.style.width = "calc(100vw - 300px)"
			orcDemoContainer.style.height = "calc(100vh - 85px)"
			orcDemoContainer.style.zIndex = "40"
		}

		// Add click listener
		orcDemoContainer.addEventListener("mousedown", onContainerMouseDown)

		// 2. Create renderer
		console.log("[createOrcDemo] Getting container dimensions")
		const rect = orcDemoContainer.getBoundingClientRect()
		// Fallback to window dimensions if container has no size yet (common in prod race conditions)
		const width = rect.width || window.innerWidth
		const height = rect.height || window.innerHeight
		console.log(
			"[createOrcDemo] Container dimensions - width:",
			width,
			"height:",
			height,
		)

		if (width === 0 || height === 0) {
			console.error("[createOrcDemo] CRITICAL: Container has zero dimensions!")
		}

		console.log("[createOrcDemo] Creating WebGLRenderer")
		orcDemoRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
		orcDemoRenderer.setPixelRatio(window.devicePixelRatio)
		orcDemoRenderer.setSize(width, height)
		orcDemoRenderer.outputColorSpace = THREE.SRGBColorSpace
		console.log("[createOrcDemo] Renderer created and configured")

		console.log("[createOrcDemo] Appending canvas to container")
		orcDemoContainer.appendChild(orcDemoRenderer.domElement)
		console.log(
			"[createOrcDemo] Canvas appended. Container now has",
			orcDemoContainer.children.length,
			"children",
		)

		// 3. Create scene and camera
		console.log("[createOrcDemo] Creating scene and camera")
		orcDemoScene = new THREE.Scene()
		orcDemoCamera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)

		const styles = getComputedStyle(document.documentElement)
		const camX = parseFloat(styles.getPropertyValue("--orc-camera-x")) || 0
		const camY = parseFloat(styles.getPropertyValue("--orc-camera-y")) || 7
		const camZ = parseFloat(styles.getPropertyValue("--orc-camera-z")) || 2
		const sceneOffsetX =
			parseFloat(styles.getPropertyValue("--orc-scene-offset-x")) || 0

		console.log(
			"[createOrcDemo] Camera config - x:",
			camX,
			"y:",
			camY,
			"z:",
			camZ,
			"sceneOffsetX:",
			sceneOffsetX,
		)

		orcDemoCamera.position.set(camX, camY, camZ)
		orcDemoCamera.lookAt(sceneOffsetX, 0, 0)

		orcDemoControls = new OrbitControls(
			orcDemoCamera,
			orcDemoRenderer.domElement,
		)
		orcDemoControls.enableDamping = true
		orcDemoControls.dampingFactor = 0.05
		orcDemoControls.screenSpacePanning = false
		orcDemoControls.minDistance = 1
		orcDemoControls.maxDistance = 15
		orcDemoControls.maxPolarAngle = Math.PI / 2
		orcDemoControls.target.set(sceneOffsetX, 0, 0)

		// 4. Add content
		console.log("[createOrcDemo] Adding scene content")
		orcDemoScene.add(new THREE.AmbientLight(0xffffff, 0.6))
		const keyLight = new THREE.DirectionalLight(0xffffff, 0.8)
		keyLight.position.set(3, 3, 3)
		orcDemoScene.add(keyLight)

		const orcGroupForDemo = createOrcScene(orcDemoCamera)
		orcGroupForDemo.position.x = sceneOffsetX
		orcDemoScene.add(orcGroupForDemo)
		console.log("[createOrcDemo] ORC scene created and added")

		selectionIndicator = createSelectionIndicator()
		orcDemoScene.add(selectionIndicator)

		// 5. Start animation loop
		console.log("[createOrcDemo] Starting animation loop")
		animateOrcDemo()
		console.log("[createOrcDemo] Complete!")

		// 6. Watch for size changes (CSS loading race conditions)
		orcDemoResizeObserver = new ResizeObserver(() => {
			OrcDemoManager.onResize()
		})
		orcDemoResizeObserver.observe(orcDemoContainer)
	} catch (error) {
		console.error("[createOrcDemo] EXCEPTION:", error)
		console.error("[createOrcDemo] Stack:", error.stack)
		// Clean up on error
		if (orcDemoContainer && orcDemoContainer.parentNode) {
			orcDemoContainer.parentNode.removeChild(orcDemoContainer)
		}
		orcDemoContainer = null
		orcDemoRenderer = null
		orcDemoScene = null
		throw error // Re-throw so start() can catch it
	}
}

function togglePause() {
	isPaused = !isPaused
	updatePauseButtonUI()
}

function updatePauseButtonUI() {
	const button = document.getElementById("orc-play-pause-button")
	if (!button) return

	const path = button.querySelector("path")
	if (!path) return

	if (isPaused) {
		button.classList.add("paused")
		button.title = "Resume Scene (Spacebar)"
		path.setAttribute("d", "M320-200v-560l440 280-440 280Z")
	} else {
		button.classList.remove("paused")
		button.title = "Pause Scene (Spacebar)"
		path.setAttribute(
			"d",
			"M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z",
		)
	}
}

function animateOrcDemo() {
	orcDemoRequestId = requestAnimationFrame(animateOrcDemo)

	// Skip animation updates when paused, but still render
	if (!isPaused) {
		animateOrcScene(true)
	}

	if (selectedSatellite && selectionIndicator) {
		const worldPos = new THREE.Vector3()
		selectedSatellite.getWorldPosition(worldPos)
		selectionIndicator.position.copy(worldPos)
	}

	if (selectedSatellite) {
		updateActionButtonState()
		updateSelectedSatelliteInfo(selectedSatellite.userData.id)
	}

	updateCameraTracking()

	orcDemoControls.update()
	orcDemoRenderer.render(orcDemoScene, orcDemoCamera)
}

function updateCameraTracking() {
	const decommState = getDecommissionState()
	if (decommState) {
		if (!isCameraTracking) {
			isCameraTracking = true
			originalCameraState = {
				position: orcDemoCamera.position.clone(),
				target: orcDemoControls.target.clone(),
			}
		}

		const satPos = decommState.position.clone()
		const planetCenter = new THREE.Vector3(orcGroup.position.x, 0, 0)
		satPos.x += orcGroup.position.x

		const sidebarCompensation = 0.4
		const targetDistance = decommState.targetZoomDistance
		let targetCamPos
		let adjustedTarget

		// Check if we have explicit camera offset (works for all decommission types)
		if (
			decommState.cameraOffset &&
			decommState.cameraLookAt &&
			decommState.hand
		) {
			// Explicit camera positioning relative to hand
			const handWorldPos = new THREE.Vector3()
			decommState.hand.getWorldPosition(handWorldPos)

			// Create offset vector from config
			const offsetDir = new THREE.Vector3(
				decommState.cameraOffset.x,
				decommState.cameraOffset.y,
				decommState.cameraOffset.z,
			)

			// If cameraDistance is provided, normalize the offset and scale by distance
			// This separates "direction" from "zoom level"
			if (decommState.cameraDistance && offsetDir.lengthSq() > 0) {
				offsetDir.normalize().multiplyScalar(decommState.cameraDistance)
			}

			// Apply offset relative to hand position
			targetCamPos = handWorldPos.clone().add(offsetDir)

			adjustedTarget = handWorldPos
				.clone()
				.add(
					new THREE.Vector3(
						decommState.cameraLookAt.x,
						decommState.cameraLookAt.y,
						decommState.cameraLookAt.z,
					),
				)

			// Apply sidebar compensation
			adjustedTarget.x += sidebarCompensation
		} else if (decommState.isGeoPunch && decommState.hand) {
			// Fallback for GEO: Camera to the SIDE, framing BOTH hand AND satellite
			const handWorldPos = new THREE.Vector3()
			decommState.hand.getWorldPosition(handWorldPos)
			handWorldPos.x += orcGroup.position.x

			const punchLine = satPos.clone().sub(planetCenter).normalize()
			const upDir = new THREE.Vector3(0, 1, 0)
			const sideDir = new THREE.Vector3()
				.crossVectors(punchLine, upDir)
				.normalize()
			if (sideDir.lengthSq() < 0.0001) sideDir.set(1, 0, 0)

			const midPoint = satPos.clone().lerp(handWorldPos, 0.5)
			const handSatDist = handWorldPos.distanceTo(satPos)
			const frameDistance = Math.max(targetDistance, handSatDist * 1.2)

			adjustedTarget = midPoint.clone()
			adjustedTarget.x += sidebarCompensation

			targetCamPos = midPoint.clone()
			targetCamPos.add(sideDir.multiplyScalar(frameDistance * 1.5))
			targetCamPos.y += frameDistance * 0.3

			if (targetCamPos.z < 0.3) targetCamPos.z = 0.3
		} else if (
			(decommState.isLeoFlick ||
				(decommState.satellite &&
					decommState.satellite.userData.id.startsWith("leo"))) &&
			decommState.hand
		) {
			// LEO Flick: Side view to see finger extension
			// Hand is radially outward from satellite. We want a view tangent to the surface.
			const dist = decommState.cameraDistance || targetDistance

			// Calculate radial vector (Planet -> Satellite)
			const radial = satPos.clone().sub(planetCenter).normalize()
			const up = new THREE.Vector3(0, 1, 0)

			// Calculate side vector (tangent to surface)
			const side = new THREE.Vector3().crossVectors(radial, up).normalize()
			if (side.lengthSq() < 0.001) side.set(0, 0, 1)

			// Position camera: Satellite Pos + Side * Dist + Up * Offset
			targetCamPos = satPos.clone().add(side.multiplyScalar(dist))
			targetCamPos.y += dist * 0.2 // Slight look down

			adjustedTarget = satPos.clone()
			adjustedTarget.x += sidebarCompensation
		} else {
			// LEO/Molniya: Default camera tracking (follows satellite)
			adjustedTarget = satPos.clone()
			adjustedTarget.x += sidebarCompensation

			const dirFromCenter = satPos.clone().sub(planetCenter).normalize()
			const cameraOffset = dirFromCenter.clone().multiplyScalar(targetDistance)
			cameraOffset.y += targetDistance * 0.3
			targetCamPos = satPos.clone().add(cameraOffset)
		}

		// Occlusion check
		const currentCamPos = orcDemoCamera.position.clone()
		const camToSat = satPos.clone().sub(currentCamPos)
		const camToPlanet = planetCenter.clone().sub(currentCamPos)
		const camToSatLength = camToSat.length()
		const projLength = camToPlanet.dot(camToSat.normalize())

		let isOccluded = false
		if (projLength > 0 && projLength < camToSatLength) {
			const closestPointOnLine = currentCamPos
				.clone()
				.add(camToSat.normalize().multiplyScalar(projLength))
			const perpDistance = planetCenter.distanceTo(closestPointOnLine)
			isOccluded = perpDistance < 0.65
		}

		let cameraSpeed = decommState.cameraSpeed
		if (isOccluded) cameraSpeed = 0.15

		// Smooth the camera target position to reduce jerking on phase transitions
		// The target itself is smoothed before applying the camera lerp
		if (!smoothedCameraTarget) {
			smoothedCameraTarget = targetCamPos.clone()
		} else {
			// Use a slower rate for target smoothing to reduce jerking
			const targetSmoothRate = Math.min(cameraSpeed * 0.5, 0.03)
			smoothedCameraTarget.lerp(targetCamPos, targetSmoothRate)
		}

		orcDemoCamera.position.lerp(smoothedCameraTarget, cameraSpeed)
		orcDemoControls.target.lerp(adjustedTarget, cameraSpeed * 2)
	} else if (isCameraTracking && originalCameraState) {
		const resetSpeed = getDecommissionConfig().cameraResetSpeed
		orcDemoCamera.position.lerp(originalCameraState.position, resetSpeed)
		orcDemoControls.target.lerp(originalCameraState.target, resetSpeed)

		if (
			orcDemoCamera.position.distanceTo(originalCameraState.position) < 0.05
		) {
			orcDemoCamera.position.copy(originalCameraState.position)
			orcDemoControls.target.copy(originalCameraState.target)
			isCameraTracking = false
			originalCameraState = null
			smoothedCameraTarget = null
		}
	}
}

function destroyOrcDemo() {
	if (!orcDemoContainer) return

	if (orcDemoRequestId) {
		cancelAnimationFrame(orcDemoRequestId)
		orcDemoRequestId = null
	}

	if (orcDemoResizeObserver) {
		orcDemoResizeObserver.disconnect()
		orcDemoResizeObserver = null
	}

	disposeOrcScene()

	if (orcDemoRenderer) {
		orcDemoRenderer.dispose()
		orcDemoRenderer = null
	}

	if (orcDemoContainer) {
		document.body.removeChild(orcDemoContainer)
		orcDemoContainer = null
	}

	orcDemoScene = null
	orcDemoCamera = null
	orcDemoControls = null
	selectionIndicator = null
	selectedSatellite = null
}

function onContainerMouseDown(event) {
	const rect = orcDemoContainer.getBoundingClientRect()
	const mouse = new THREE.Vector2()
	mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
	mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

	const raycaster = new THREE.Raycaster()
	raycaster.setFromCamera(mouse, orcDemoCamera)

	const intersects = raycaster.intersectObjects(satellites, true)

	if (intersects.length > 0) {
		let clickedObject = intersects[0].object
		while (clickedObject && !clickedObject.userData.id) {
			clickedObject = clickedObject.parent
		}

		if (clickedObject) {
			selectSatellite(clickedObject)
		}
	} else {
		deselectSatellite()
	}
}

function selectSatellite(sat) {
	selectedSatellite = sat
	selectionIndicator.visible = true
	updateSelectedSatelliteInfo(sat.userData.id)
	updateAvailableSatellitesHighlight()
	updateActionButtonState()

	if (sat.userData.id === "geo-001") showGeoTether()
	else hideGeoTether()

	if (orcHandStateMachine) orcHandStateMachine.setSelectedSatellite(sat)
}

function deselectSatellite() {
	selectedSatellite = null
	if (selectionIndicator) selectionIndicator.visible = false
	updateSelectedSatelliteInfo(null)
	updateAvailableSatellitesHighlight()
	updateActionButtonState()
	hideGeoTether()
	if (orcHandStateMachine) orcHandStateMachine.setSelectedSatellite(null)
}

// UI Helpers
function createSelectionIndicator() {
	const canvas = document.createElement("canvas")
	canvas.width = 64
	canvas.height = 64
	const context = canvas.getContext("2d")
	context.strokeStyle = "#00ffff"
	context.lineWidth = 6
	context.strokeRect(0, 0, 64, 64)
	const texture = new THREE.CanvasTexture(canvas)
	const material = new THREE.SpriteMaterial({
		map: texture,
		blending: THREE.AdditiveBlending,
		depthTest: false,
		transparent: true,
	})
	const sprite = new THREE.Sprite(material)
	sprite.scale.set(0.3, 0.3, 1)
	sprite.visible = false
	return sprite
}

function updateSelectedSatelliteInfo() {
	const statusEl = document.getElementById("selected-satellite-status")
	const idEl = document.getElementById("selected-satellite-display-id")
	const orbitTypeEl = document.getElementById("selected-satellite-orbit-type")
	const infoContainer = document.getElementById("satellite-info-content")
	const noSelectionMsg = document.getElementById("no-satellite-selected")

	if (statusEl && orbitTypeEl && infoContainer && noSelectionMsg) {
		if (selectedSatellite) {
			infoContainer.style.display = "block"
			noSelectionMsg.style.display = "none"

			if (selectedSatellite.userData.returning) {
				statusEl.textContent = "Returning to orbit"
				statusEl.className = "info-value status-returning"
			} else if (selectedSatellite.userData.decommissioning) {
				statusEl.textContent = "Decommissioning"
				statusEl.className = "info-value status-decommissioning"
			} else {
				statusEl.textContent = "Operational"
				statusEl.className = "info-value status-operational"
			}

			if (idEl) idEl.textContent = selectedSatellite.userData.id

			let orbitType = "Unknown"
			const satId = selectedSatellite.userData.id
			if (satId.startsWith("geo")) orbitType = "Geosynchronous"
			else if (satId.startsWith("leo")) orbitType = "Low Earth"
			else if (satId.startsWith("mol")) orbitType = "Molniya"

			orbitTypeEl.textContent = orbitType
		} else {
			infoContainer.style.display = "none"
			noSelectionMsg.style.display = "block"
		}
	}
}

function updateActionButtonState() {
	const actionBtn = document.getElementById("decommission-action")
	if (!actionBtn) return

	actionBtn.onclick = null

	if (!selectedSatellite) {
		actionBtn.classList.add("disabled")
		actionBtn.classList.remove("cancel-action")
		actionBtn.textContent = "Decommission Satellite"
		actionBtn.disabled = true
	} else if (canCancelDecommission(selectedSatellite)) {
		actionBtn.classList.remove("disabled")
		actionBtn.classList.add("cancel-action")
		actionBtn.textContent = "Cancel Decommission"
		actionBtn.disabled = false
		actionBtn.onclick = window.orcCancelDecommission
	} else if (
		selectedSatellite.userData.returning ||
		selectedSatellite.userData.decommissioning
	) {
		actionBtn.classList.add("disabled")
		actionBtn.classList.remove("cancel-action")
		actionBtn.textContent = "Decommission Satellite"
		actionBtn.disabled = true
	} else {
		actionBtn.classList.remove("disabled")
		actionBtn.classList.remove("cancel-action")
		actionBtn.textContent = "Decommission Satellite"
		actionBtn.disabled = false
		actionBtn.onclick = window.orcDecommissionSatellite
	}
}

async function showAvailableSatellitesPane() {
	if (orcInfoPane && !document.body.contains(orcInfoPane)) {
		document.body.appendChild(orcInfoPane)
	}

	if (!orcInfoPane) {
		const response = await fetch("/src/content/orc-demo/orc-demo.html")
		const html = await response.text()
		const temp = document.createElement("div")
		temp.innerHTML = html
		orcInfoPane = temp.querySelector("#orc-info-pane")

		if (!orcInfoPane) return

		// Add responsive class to docs container for mobile layout
		const docsLinks = orcInfoPane.querySelectorAll(".docs-link")
		if (docsLinks.length > 0) {
			const container = docsLinks[0].parentElement
			if (container) {
				container.classList.add("docs-container-responsive")
				// Force 2-column grid layout for all screen sizes
				container.style.display = "grid"
				container.style.gridTemplateColumns = "1fr 1fr"
				container.style.gap = "10px"
			}
		}

		const list = orcInfoPane.querySelector("#satellite-list")
		if (list) {
			const sortedSatellites = [...satellites].sort(
				(a, b) => a.userData.orbitIndex - b.userData.orbitIndex,
			)
			sortedSatellites.forEach((sat) => {
				const listItem = document.createElement("li")
				listItem.textContent = sat.userData.name
				listItem.dataset.satelliteId = sat.userData.id
				listItem.className = "satellite-list-item"

				if (sat.userData.id.startsWith("leo")) listItem.classList.add("sat-leo")
				else if (sat.userData.id.startsWith("geo"))
					listItem.classList.add("sat-geo")
				else if (sat.userData.id.startsWith("mol"))
					listItem.classList.add("sat-mol")

				listItem.setAttribute(
					"onclick",
					`window.orcSelectSatellite('${sat.userData.id}')`,
				)
				list.appendChild(listItem)
			})
		}

		const decommissionAction = orcInfoPane.querySelector("#decommission-action")
		if (decommissionAction) {
			decommissionAction.addEventListener(
				"click",
				window.orcDecommissionSatellite,
			)
		}

		// Set up play/pause button
		const playPauseButton = orcInfoPane.querySelector("#orc-play-pause-button")
		if (playPauseButton) {
			playPauseButton.addEventListener("click", togglePause)
		}

		updateAvailableSatellitesHighlight()
		document.body.appendChild(orcInfoPane)

		updatePauseButtonUI()

		// Also extract and add the doc viewer
		const docViewer = temp.querySelector("#orc-doc-viewer")
		if (docViewer) {
			document.body.appendChild(docViewer)

			// Block all interaction with the scene while hovering/clicking the doc viewer
			// This prevents clicks from passing through to the "Portfolio" label behind it
			const blockEvent = (e) => e.stopPropagation()
			const eventsToBlock = [
				"mousedown",
				"mouseup",
				"click",
				"dblclick",
				"pointerdown",
				"pointerup",
				"pointermove",
				"wheel",
				"touchstart",
				"touchend",
				"touchmove",
			]
			eventsToBlock.forEach((evt) => {
				docViewer.addEventListener(evt, blockEvent, { passive: true })
			})

			const iframe = docViewer.querySelector("#orc-doc-iframe")
			const closeBtn = docViewer.querySelector("#orc-doc-close")
			const newTabBtn = docViewer.querySelector("#orc-doc-new-tab")

			if (iframe && closeBtn && newTabBtn) {
				// Use event delegation on the info pane for all docs links
				orcInfoPane.addEventListener("click", async (e) => {
					const link = e.target.closest(".docs-link")
					if (!link) return

					// Ignore external links
					if (link.getAttribute("target") === "_blank") return

					e.preventDefault()
					e.stopPropagation()

					let fetchUrl = ""
					if (link.id === "user-guide-link") {
						fetchUrl = "/portfolio/docs/orc/user-guide/"
					} else if (link.id === "decommission-tutorial-link") {
						fetchUrl = "/portfolio/docs/orc/getting-started-tutorial/"
					} else if (link.id === "api-docs-link") {
						fetchUrl = "/portfolio/docs/orc/api-reference/"
					} else if (link.id === "whitepaper-link") {
						fetchUrl = "/portfolio/docs/orc/whitepaper/"
					} else {
						return
					}

					iframe.src = fetchUrl
					newTabBtn.href = fetchUrl
					docViewer.classList.add("visible")
					document.body.classList.add("orc-doc-active")
				})

				const handleClose = (e) => {
					e.preventDefault()
					e.stopImmediatePropagation() // Ensure this stops everything
					closeDocViewer()
				}

				closeBtn.addEventListener("click", handleClose)
			}

			// Close on escape key (Global)
			OrcDemoManager.escapeListener = (e) => {
				if (e.key === "Escape" && docViewer.classList.contains("visible")) {
					closeDocViewer()
				}
			}
			document.addEventListener("keydown", OrcDemoManager.escapeListener)

			// Close on escape key (Inside Iframe)
			iframe.addEventListener("load", () => {
				try {
					const iframeDoc =
						iframe.contentDocument || iframe.contentWindow.document
					iframeDoc.addEventListener("keydown", (e) => {
						if (e.key === "Escape") {
							// Dispatch to main window handler
							document.dispatchEvent(
								new KeyboardEvent("keydown", { key: "Escape" }),
							)
						}
					})
				} catch {
					// Ignore cross-origin errors in dev if they occur
				}
			})

			function closeDocViewer() {
				docViewer.classList.remove("visible")
				iframe.src = ""
				setTimeout(() => {
					document.body.classList.remove("orc-doc-active")
				}, 100)
			}
		}
	}

	orcInfoPane.style.display = "block"
	requestAnimationFrame(() => {
		orcInfoPane.style.opacity = "1"
	})
}

function updateAvailableSatellitesHighlight() {
	if (!orcInfoPane) return

	const hasSatellites = satellites.length > 0
	const showHelp = hasSatellites && !selectedSatellite

	const list = orcInfoPane.querySelector("#satellite-list")
	if (list) {
		if (showHelp) list.classList.add("selection-needed")
		else list.classList.remove("selection-needed")
	}

	const items = orcInfoPane.querySelectorAll(".satellite-list-item")
	items.forEach((item) => {
		if (
			selectedSatellite &&
			item.dataset.satelliteId === selectedSatellite.userData.id
		) {
			item.classList.add("selected")
		} else {
			item.classList.remove("selected")
		}
	})

	const helpText = document.getElementById("satellite-help-text")
	if (helpText) helpText.style.display = showHelp ? "block" : "none"
}

// Global handlers
window.orcSelectSatellite = function (satId) {
	const targetSat = satellites.find((s) => s.userData.id === satId)
	if (targetSat) selectSatellite(targetSat)
}

window.orcDecommissionSatellite = function () {
	if (selectedSatellite && !selectedSatellite.userData.decommissioning) {
		startDecommission(selectedSatellite)
		updateActionButtonState()
		updateSelectedSatelliteInfo(selectedSatellite.userData.id)
	}
}

window.orcCancelDecommission = function () {
	if (selectedSatellite && canCancelDecommission(selectedSatellite)) {
		cancelDecommission(selectedSatellite)
		updateActionButtonState()
		updateSelectedSatelliteInfo(selectedSatellite.userData.id)
	}
}

// Handle satellite removal from both possible event sources
function handleSatelliteRemoved(satelliteId) {
	if (selectedSatellite && selectedSatellite.userData.id === satelliteId) {
		deselectSatellite()
	}

	// Remove the satellite from the available satellites list
	if (orcInfoPane) {
		const listItem = orcInfoPane.querySelector(
			`.satellite-list-item[data-satellite-id="${satelliteId}"]`,
		)
		if (listItem) {
			listItem.remove()
		}
	}

	updateAvailableSatellitesHighlight()
}

// Listen to both events since satellites can be removed via different code paths
window.addEventListener("satelliteDecommissioned", (event) => {
	handleSatelliteRemoved(event.detail.satelliteId)
})

window.addEventListener("satelliteRemoved", (event) => {
	handleSatelliteRemoved(event.detail.satelliteId)
})
