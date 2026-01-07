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
} from "./orc-demo.js"
import { getRoamingHand } from "../../hand/HandManager.js"

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

// Camera tracking state
let originalCameraState = null
let isCameraTracking = false

// Reset button
let orcResetButton = null

export const OrcDemoManager = {
	isActive: false,

	start() {
		if (this.isActive) return
		this.isActive = true

		createOrcDemo()
		showAvailableSatellitesPane()
		showOrcResetButton()

		// Fade in
		if (orcDemoContainer) {
			orcDemoContainer.style.opacity = "0"
			orcDemoContainer.style.transition = "opacity 0.6s ease-in"
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
	},

	stop() {
		if (!this.isActive) return

		// Fade out handled by caller (pyramid.js) usually, but we can ensure cleanup
		hideOrcResetButton()

		// Release hand
		const hand = releaseOrcHand()

		destroyOrcDemo()

		// Remove info pane if it exists
		if (orcInfoPane) {
			orcInfoPane.remove()
			orcInfoPane = null
		}

		this.isActive = false
		return hand
	},

	// Expose for external checks
	getSelectedSatellite() {
		return selectedSatellite
	},

	onResize() {
		if (orcDemoRenderer && orcDemoCamera && orcDemoContainer) {
			const rect = orcDemoContainer.getBoundingClientRect()
			orcDemoCamera.aspect = rect.width / rect.height
			orcDemoCamera.updateProjectionMatrix()
			orcDemoRenderer.setSize(rect.width, rect.height)
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
	if (orcDemoContainer) return

	// 1. Create container
	orcDemoContainer = document.createElement("div")
	orcDemoContainer.id = "orc-demo-container"
	document.body.appendChild(orcDemoContainer)

	// Add click listener
	orcDemoContainer.addEventListener("mousedown", onContainerMouseDown)

	// 2. Create renderer
	const rect = orcDemoContainer.getBoundingClientRect()
	orcDemoRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
	orcDemoRenderer.setPixelRatio(window.devicePixelRatio)
	orcDemoRenderer.setSize(rect.width, rect.height)
	orcDemoRenderer.outputColorSpace = THREE.SRGBColorSpace
	orcDemoContainer.appendChild(orcDemoRenderer.domElement)

	// 3. Create scene and camera
	orcDemoScene = new THREE.Scene()
	orcDemoCamera = new THREE.PerspectiveCamera(
		50,
		rect.width / rect.height,
		0.1,
		100
	)

	const styles = getComputedStyle(document.documentElement)
	const camX = parseFloat(styles.getPropertyValue("--orc-camera-x")) || 0
	const camY = parseFloat(styles.getPropertyValue("--orc-camera-y")) || 7
	const camZ = parseFloat(styles.getPropertyValue("--orc-camera-z")) || 2
	const sceneOffsetX =
		parseFloat(styles.getPropertyValue("--orc-scene-offset-x")) || 0

	orcDemoCamera.position.set(camX, camY, camZ)
	orcDemoCamera.lookAt(sceneOffsetX, 0, 0)

	orcDemoControls = new OrbitControls(orcDemoCamera, orcDemoRenderer.domElement)
	orcDemoControls.enableDamping = true
	orcDemoControls.dampingFactor = 0.05
	orcDemoControls.screenSpacePanning = false
	orcDemoControls.minDistance = 1
	orcDemoControls.maxDistance = 15
	orcDemoControls.maxPolarAngle = Math.PI / 2
	orcDemoControls.target.set(sceneOffsetX, 0, 0)

	// 4. Add content
	orcDemoScene.add(new THREE.AmbientLight(0xffffff, 0.6))
	const keyLight = new THREE.DirectionalLight(0xffffff, 0.8)
	keyLight.position.set(3, 3, 3)
	orcDemoScene.add(keyLight)

	const orcGroupForDemo = createOrcScene(orcDemoCamera)
	orcGroupForDemo.position.x = sceneOffsetX
	orcDemoScene.add(orcGroupForDemo)

	selectionIndicator = createSelectionIndicator()
	orcDemoScene.add(selectionIndicator)

	// 5. Start animation loop
	animateOrcDemo()
}

function animateOrcDemo() {
	orcDemoRequestId = requestAnimationFrame(animateOrcDemo)
	animateOrcScene(true)

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
		const adjustedTarget = satPos.clone()
		adjustedTarget.x += sidebarCompensation

		const dirFromCenter = satPos.clone().sub(planetCenter).normalize()
		const targetDistance = decommState.targetZoomDistance
		const cameraOffset = dirFromCenter.clone().multiplyScalar(targetDistance)
		cameraOffset.y += targetDistance * 0.3

		const targetCamPos = satPos.clone().add(cameraOffset)

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
			isOccluded = perpDistance < 0.65 // Radius + margin
		}

		let cameraSpeed = decommState.cameraSpeed
		if (isOccluded) cameraSpeed = 0.15

		orcDemoCamera.position.lerp(targetCamPos, cameraSpeed)
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
		}
	}
}

function destroyOrcDemo() {
	if (!orcDemoContainer) return

	if (orcDemoRequestId) {
		cancelAnimationFrame(orcDemoRequestId)
		orcDemoRequestId = null
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

function updateSelectedSatelliteInfo(satelliteId) {
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

		const list = orcInfoPane.querySelector("#satellite-list")
		if (list) {
			const sortedSatellites = [...satellites].sort(
				(a, b) => a.userData.orbitIndex - b.userData.orbitIndex
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
					`window.orcSelectSatellite('${sat.userData.id}')`
				)
				list.appendChild(listItem)
			})
		}

		const decommissionAction = orcInfoPane.querySelector("#decommission-action")
		if (decommissionAction) {
			decommissionAction.addEventListener(
				"click",
				window.orcDecommissionSatellite
			)
		}

		updateAvailableSatellitesHighlight()
		document.body.appendChild(orcInfoPane)
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

function createOrcResetButton() {
	if (orcResetButton) return

	orcResetButton = document.createElement("button")
	orcResetButton.id = "orc-reset-button"
	orcResetButton.textContent = "Reset"
	Object.assign(orcResetButton.style, {
		position: "fixed",
		left: "6px",
		top: "50px",
		zIndex: "10000",
		padding: "8px 14px",
		background: "rgba(0,0,0,0.6)",
		color: "white",
		border: "1px solid rgba(255,255,255,0.08)",
		borderRadius: "4px",
		font: "600 14px sans-serif",
		cursor: "pointer",
		backdropFilter: "blur(4px)",
		transition: "background 0.2s ease, box-shadow 0.2s ease",
		display: "none",
	})

	orcResetButton.addEventListener("mouseenter", () => {
		orcResetButton.style.background = "rgba(0,100,150,0.7)"
		orcResetButton.style.boxShadow = "0 0 12px rgba(0,200,255,0.4)"
	})
	orcResetButton.addEventListener("mouseleave", () => {
		orcResetButton.style.background = "rgba(0,0,0,0.6)"
		orcResetButton.style.boxShadow = "none"
	})

	orcResetButton.addEventListener("click", () => {
		window.location.reload()
	})
	document.body.appendChild(orcResetButton)
}

function showOrcResetButton() {
	if (!orcResetButton) createOrcResetButton()
	if (orcResetButton) orcResetButton.style.display = "block"
}

function hideOrcResetButton() {
	if (orcResetButton) orcResetButton.style.display = "none"
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

window.addEventListener("satelliteRemoved", (event) => {
	const { satelliteId } = event.detail
	if (selectedSatellite && selectedSatellite.userData.id === satelliteId) {
		deselectSatellite()
	}
	updateAvailableSatellitesHighlight()
})
