import * as THREE from "three"
import { makeLabelPlane } from "./planes.js"
import {
	pyramidGroup,
	labels,
	hoverTargets,
	initLabels,
	animatePyramid,
	spinPyramidToSection,
	showBioPlane,
	showPortfolioPlane,
	hideAllPlanes,
	showBlogPlane,
	showHomeLabel,
	animate,
	renderer,
	camera,
	scene,
	controls,
	resetPyramidToHome,
} from "./pyramid/pyramid.js"
import { router } from "./router.js"

// Attach renderer DOM element
document.getElementById("scene-container").appendChild(renderer.domElement)

// Create a DOM Home button top-left that overlays the scene. This button is
// always visible and acts independently of the 3D scene so it behaves like a
// sticky HUD element while using similar styling as the 3D labels.
;(function createHomeButton() {
	const existing = document.getElementById("home-button")
	if (existing) return
	const btn = document.createElement("button")
	btn.id = "home-button"
	btn.textContent = "Home"
	btn.style.position = "fixed"
	btn.style.left = "16px"
	btn.style.top = "12px"
	btn.style.zIndex = 10000
	btn.style.padding = "8px 14px"
	btn.style.background = "rgba(0,0,0,0.6)"
	btn.style.color = "white"
	btn.style.border = "1px solid rgba(255,255,255,0.08)"
	btn.style.borderRadius = "4px"
	btn.style.font = "600 14px sans-serif"
	btn.style.cursor = "pointer"
	btn.style.backdropFilter = "blur(4px)"
	// Hidden initially until the user interacts (drag or label click)
	btn.style.display = "none"
	btn.addEventListener("mousedown", (e) => e.stopPropagation())
	btn.addEventListener("click", (e) => {
		e.stopPropagation()
		try {
			resetPyramidToHome()
			hideAllPlanes()
			window.centeredLabelName = null
			router.navigate("/")
		} catch (err) {
			console.error("Home button handler error", err)
		}
	})
	document.body.appendChild(btn)
})()

// Initialize Labels
initLabels(makeLabelPlane)

// Start animation loop
animate()

window.addEventListener("resize", () => {})

// === Click Handling ===
const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()
let hoveredLabel = null
let currentContentVisible = null // Track which content plane is showing (bio/portfolio/blog or null)
let pointerDownPos = new THREE.Vector2() // Track pointer position on mousedown to detect true clicks vs drags
let isPointerDown = false
let isDragging = false
const DRAG_THRESHOLD = 5 // pixels

// Track mousedown to detect if click is a drag, and process scene interaction
function onMouseDown(event) {
	// Ignore mousedown on DOM elements (buttons, scrollbars, content pane)
	// Only track clicks that originate on the canvas
	if (event.target.tagName !== "CANVAS") {
		return
	}
	isPointerDown = true
	isDragging = false
	pointerDownPos.x = event.clientX
	pointerDownPos.y = event.clientY
	// Don't process scene interaction on mousedown - wait for mouseup to confirm it's a real click
}

window.addEventListener("mousedown", onMouseDown)

// Track mousemove to detect drag
window.addEventListener("mousemove", (event) => {
	if (isPointerDown) {
		const dx = event.clientX - pointerDownPos.x
		const dy = event.clientY - pointerDownPos.y
		if (Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) {
			isDragging = true
		}
	}
})

// Track mouseup to mark end of interaction AND trigger scene click
window.addEventListener("mouseup", (event) => {
	isPointerDown = false
	// Only trigger scene interaction if this wasn't a drag
	if (!isDragging) {
		onSceneMouseDown(event)
	}
	isDragging = false
})

// Completely block click events at capture phase - we'll use mousedown instead
// But allow clicks inside #content (for close button, etc.)
window.addEventListener(
	"click",
	(event) => {
		const content = document.getElementById("content")
		if (content && content.contains(event.target)) {
			// Allow clicks inside content area to pass through
			return
		}
		event.preventDefault()
		event.stopPropagation()
	},
	true
) // Use capture phase to prevent ALL clicks from reaching handlers

// Hover detection
function onMouseMove(event) {
	// Compute normalized device coordinates (NDC) relative to renderer canvas
	try {
		const rect = renderer.domElement.getBoundingClientRect()
		pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
		pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
	} catch (e) {
		// Fallback to window-based coords
		pointer.x = (event.clientX / window.innerWidth) * 2 - 1
		pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
	}
	raycaster.setFromCamera(pointer, camera)

	// Check for portfolio item clickables FIRST (highest priority)
	const portfolioPlane = scene.getObjectByName("portfolioPlane")
	if (portfolioPlane) {
		const portfolioClickables = portfolioPlane.children.filter(
			(c) => c && c.userData && c.userData.link
		)
		if (portfolioClickables.length > 0) {
			const portfolioHits = raycaster.intersectObjects(
				portfolioClickables,
				false
			)
			if (portfolioHits.length > 0) {
				renderer.domElement.style.cursor = "pointer"
				return
			}
		}
	}

	// Check hover targets for pyramid labels (only if no content plane is visible)
	// When portfolio/bio/blog is showing, skip pyramid label hover to avoid conflicts
	const bioPlane = scene.getObjectByName("bioPlane")
	const blogPlane = scene.getObjectByName("blogPlane")
	const hasContentPlane = portfolioPlane || bioPlane || blogPlane

	if (!hasContentPlane) {
		const hoverTargetIntersects = raycaster.intersectObjects(
			Object.values(hoverTargets)
		)

		// Clear previous hover if not still over its hover target
		if (hoveredLabel) {
			const stillOver = hoverTargetIntersects.some(
				(h) => h.object.userData.labelKey === hoveredLabel.userData.name
			)
			if (!stillOver) {
				hoveredLabel.scale.copy(hoveredLabel.userData.originalScale)
				hoveredLabel = null
				renderer.domElement.style.cursor = "default"
			}
		}

		if (hoverTargetIntersects.length > 0) {
			const hoverObj = hoverTargetIntersects[0].object
			const labelKey = hoverObj.userData.labelKey
			// Do not hover labels that are currently centered (but allow Home label even when visible)
			if (labelKey !== "Home" && window.centeredLabelName === labelKey) {
				renderer.domElement.style.cursor = "default"
				return
			}
			const labelMesh = labels[labelKey]
			if (labelMesh && labelMesh.visible && hoveredLabel !== labelMesh) {
				// Only scale if the label is visible and not Home (Home doesn't scale on hover)
				if (labelKey !== "Home" && labelMesh.userData.originalScale) {
					hoveredLabel = labelMesh
					hoveredLabel.scale
						.copy(hoveredLabel.userData.originalScale)
						.multiplyScalar(1.12)
				}
			}
			renderer.domElement.style.cursor = "pointer"
		} else {
			// No hover targets: ensure cursor is default and reset hoveredLabel
			if (hoveredLabel) {
				hoveredLabel.scale.copy(hoveredLabel.userData.originalScale)
				hoveredLabel = null
			}
			renderer.domElement.style.cursor = "default"
		}
	} else {
		// Content plane is visible, clear any label hover state
		if (hoveredLabel) {
			hoveredLabel.scale.copy(hoveredLabel.userData.originalScale)
			hoveredLabel = null
		}
		renderer.domElement.style.cursor = "default"
	}
}

window.addEventListener("mousemove", onMouseMove)

// Show corner Home when the user starts an OrbitControls interaction (drag)
// This replaces the previous interval-based camera polling.
try {
	if (controls && controls.addEventListener) {
		controls.addEventListener("start", () => {
			showHomeLabel()
		})
	}
} catch (e) {}

// Listen for route changes and show correct content
// Helper to animate pyramid to top menu and show a section
function centerAndOpenLabel(labelName) {
	if (!labels || !labels[labelName]) return
	// Clicking a label should reveal the corner Home control
	try {
		showHomeLabel()
	} catch (e) {}
	const isAtTop = pyramidGroup.position.y >= 1.5

	if (isAtTop) {
		// Already at top, just spin to new section
		hideAllPlanes()
		const sectionName = labelName.toLowerCase()
		console.log("pyramidGroup at top nav state:", pyramidGroup)
		spinPyramidToSection(sectionName, () => {
			if (labelName === "Bio") showBioPlane()
			else if (labelName === "Portfolio") showPortfolioPlane()
			else if (labelName === "Blog") showBlogPlane()
		})
	} else if (!isAtTop) {
		// animate pyramid to top and flatten labels - content will be shown when animation completes
		animatePyramid(true, labelName.toLowerCase())
	}
	// Track which section is active (for highlighting in menu if desired)
	window.centeredLabelName = labelName
}

router.onRouteChange((route) => {
	if (route === "/bio") {
		centerAndOpenLabel("Bio")
		currentContentVisible = "bio"
	} else if (route === "/portfolio") {
		centerAndOpenLabel("Portfolio")
		currentContentVisible = "portfolio"
	} else if (route === "/blog") {
		centerAndOpenLabel("Blog")
		currentContentVisible = "blog"
	} else {
		// For non-content routes (home), reset pyramid and hide all content planes
		resetPyramidToHome()
		hideAllPlanes()
		currentContentVisible = null
	}
})

// Trigger route listeners once at startup so direct navigation to /bio, /portfolio, /blog works
router.notify()

function onSceneMouseDown(event) {
	// Only handle mousedown if it's a true click (not part of a drag)
	// We detect this by waiting for mouseup to see if isDragging was set
	// For now, just mark that we're ready to process a click
	if (isDragging) {
		return
	}

	pointer.x = (event.clientX / window.innerWidth) * 2 - 1
	pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
	raycaster.setFromCamera(pointer, camera)

	// Helper: extract YouTube video id from a URL
	function extractYouTubeID(url) {
		try {
			const u = new URL(url)
			if (u.hostname.includes("youtube.com")) return u.searchParams.get("v")
			if (u.hostname === "youtu.be") return u.pathname.slice(1)
		} catch (e) {
			return null
		}
		return null
	}

	// Helper: extract Google Docs document ID from a URL
	function extractGoogleDocsID(url) {
		try {
			const u = new URL(url)
			if (u.hostname.includes("docs.google.com")) {
				const match = u.pathname.match(/\/document\/d\/([^\/]+)/)
				return match ? match[1] : null
			}
		} catch (e) {
			return null
		}
		return null
	}

	// Helper: check if URL points to an image
	function isImageUrl(url) {
		try {
			const u = new URL(url)
			const path = u.pathname.toLowerCase()
			return /\.(png|jpg|jpeg|gif|webp|svg|bmp)$/.test(path)
		} catch (e) {
			return false
		}
	}

	// Helper: handle a content link (embed YouTube if applicable, otherwise open)
	function handleContentLink(link) {
		if (!link) return false
		const ytId = extractYouTubeID(link)
		const content = document.getElementById("content")
		// Use the exported function from pyramid module (imported above)
		try {
			hideAllPlanes()
		} catch (e) {
			// fallback to any global if available
			if (window.hideAllPlanes) window.hideAllPlanes()
		}
		if (content) {
			content.style.bottom = ""
			content.style.maxHeight = ""
		}
		if (ytId) {
			if (content) {
				content.innerHTML = ""
				try {
					// Hide the pyramid when showing full-page content
					if (pyramidGroup) pyramidGroup.visible = false

					// Full page layout with margins
					const sideMargin = 40
					const topMargin = 60
					const bottomMargin = 20
					const availableHeight = window.innerHeight - topMargin - bottomMargin

					// Override CSS and set full-page positioning
					content.style.maxHeight = "none"
					content.style.height = availableHeight + "px"
					content.style.top = topMargin + "px"
					content.style.left = sideMargin + "px"
					content.style.right = sideMargin + "px"
					content.style.width = "auto"
					content.style.transform = "none"

					// Create close button
					const closeBtn = document.createElement("button")
					closeBtn.innerHTML = "&times;"
					closeBtn.style.cssText = `
						position: absolute;
						top: 10px;
						right: 10px;
						width: 36px;
						height: 36px;
						border: 2px solid #00ffff;
						border-radius: 50%;
						background: rgba(0, 0, 0, 0.8);
						color: #00ffff;
						font-size: 24px;
						line-height: 1;
						cursor: pointer;
						z-index: 10;
						display: flex;
						align-items: center;
						justify-content: center;
					`
					closeBtn.onmouseover = () => {
						closeBtn.style.background = "rgba(0, 255, 255, 0.3)"
					}
					closeBtn.onmouseout = () => {
						closeBtn.style.background = "rgba(0, 0, 0, 0.8)"
					}
					closeBtn.onclick = (e) => {
						e.preventDefault()
						e.stopPropagation()
						// Restore pyramid at bottom position
						if (pyramidGroup) {
							pyramidGroup.visible = true
							animatePyramid(true, "portfolio")
						}
						// Clear content and hide
						content.innerHTML = ""
						content.style.display = "none"
						// Reset content styles
						content.style.height = ""
						content.style.top = ""
						content.style.left = ""
						content.style.right = ""
						content.style.width = ""
						content.style.transform = ""
						content.style.maxHeight = ""
						content.style.overflow = ""
						content.style.padding = ""
						// Show portfolio plane again
						showPortfolioPlane()
						currentContentVisible = "portfolio"
					}

					const iframe = document.createElement("iframe")
					iframe.setAttribute(
						"src",
						`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`
					)
					iframe.setAttribute("width", "100%")
					iframe.style.height = "calc(100% - 20px)"
					iframe.setAttribute(
						"allow",
						"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					)
					iframe.setAttribute("frameborder", "0")
					iframe.setAttribute("allowfullscreen", "")
					const wrapper = document.createElement("div")
					wrapper.className = "video-wrapper"
					wrapper.id = "embedded-video-wrapper"
					wrapper.style.width = "100%"
					wrapper.style.height = "100%"
					wrapper.style.overflow = "hidden"
					wrapper.style.position = "relative"
					wrapper.appendChild(iframe)
					wrapper.appendChild(closeBtn)
					content.appendChild(wrapper)

					content.style.display = "block"
					content.style.overflow = "hidden"
					content.style.padding = "0"
					content.style.zIndex = String(2147483646)
					content.style.position = "fixed"
					content.style.pointerEvents = "auto"
					currentContentVisible = "portfolio"
					return true
				} catch (e) {
					// If creating the iframe failed for some reason, open the link instead
					console.error("Failed to create YouTube iframe:", e)
					window.open(link, "_blank")
					return true
				}
			}
		} else {
			// Check for Google Docs
			const docId = extractGoogleDocsID(link)
			if (docId && content) {
				content.innerHTML = ""

				// Hide the pyramid when showing full-page content
				if (pyramidGroup) pyramidGroup.visible = false

				// Full page layout with margins
				const sideMargin = 40
				const topMargin = 60
				const bottomMargin = 20
				const availableHeight = window.innerHeight - topMargin - bottomMargin

				// Override CSS and set full-page positioning
				content.style.maxHeight = "none"
				content.style.height = availableHeight + "px"
				content.style.top = topMargin + "px"
				content.style.left = sideMargin + "px"
				content.style.right = sideMargin + "px"
				content.style.width = "auto"
				content.style.transform = "none"

				// Create close button
				const closeBtn = document.createElement("button")
				closeBtn.innerHTML = "&times;"
				closeBtn.style.cssText = `
					position: absolute;
					top: 10px;
					right: 10px;
					width: 36px;
					height: 36px;
					border: 2px solid #00ffff;
					border-radius: 50%;
					background: rgba(0, 0, 0, 0.8);
					color: #00ffff;
					font-size: 24px;
					line-height: 1;
					cursor: pointer;
					z-index: 10;
					display: flex;
					align-items: center;
					justify-content: center;
				`
				closeBtn.onmouseover = () => {
					closeBtn.style.background = "rgba(0, 255, 255, 0.3)"
				}
				closeBtn.onmouseout = () => {
					closeBtn.style.background = "rgba(0, 0, 0, 0.8)"
				}
				closeBtn.onclick = (e) => {
					e.preventDefault()
					e.stopPropagation()
					// Restore pyramid at bottom position
					if (pyramidGroup) {
						pyramidGroup.visible = true
						animatePyramid(true, "portfolio")
					}
					// Clear content and hide
					content.innerHTML = ""
					content.style.display = "none"
					// Reset content styles
					content.style.height = ""
					content.style.top = ""
					content.style.left = ""
					content.style.right = ""
					content.style.width = ""
					content.style.transform = ""
					content.style.maxHeight = ""
					content.style.overflow = ""
					content.style.padding = ""
					// Show portfolio plane again
					showPortfolioPlane()
					currentContentVisible = "portfolio"
				}

				const iframe = document.createElement("iframe")
				iframe.src = `https://docs.google.com/document/d/${docId}/preview`
				iframe.width = "100%"
				iframe.style.height = "calc(100% - 20px)"
				iframe.style.border = "1px solid #00ffff"
				iframe.style.borderRadius = "8px"
				iframe.style.display = "block"
				const wrapper = document.createElement("div")
				wrapper.className = "doc-wrapper"
				wrapper.style.width = "100%"
				wrapper.style.height = "100%"
				wrapper.style.overflow = "hidden"
				wrapper.style.position = "relative"
				wrapper.appendChild(iframe)
				wrapper.appendChild(closeBtn)
				content.appendChild(wrapper)
				content.style.display = "block"
				content.style.overflow = "hidden"
				content.style.padding = "0"
				content.style.zIndex = String(2147483646)
				content.style.position = "fixed"
				content.style.pointerEvents = "auto"
				currentContentVisible = "portfolio"
				return true
			}

			// Check for image URL
			if (isImageUrl(link)) {
				content.innerHTML = ""

				// Hide the pyramid when showing full-page content
				if (pyramidGroup) pyramidGroup.visible = false

				// Full page layout with margins
				const sideMargin = 40
				const topMargin = 60
				const bottomMargin = 20
				const availableHeight = window.innerHeight - topMargin - bottomMargin

				// Override CSS and set full-page positioning
				content.style.maxHeight = "none"
				content.style.height = availableHeight + "px"
				content.style.top = topMargin + "px"
				content.style.left = sideMargin + "px"
				content.style.right = sideMargin + "px"
				content.style.width = "auto"
				content.style.transform = "none"

				// Create close button
				const closeBtn = document.createElement("button")
				closeBtn.innerHTML = "&times;"
				closeBtn.style.cssText = `
					position: absolute;
					top: 10px;
					right: 10px;
					width: 36px;
					height: 36px;
					border: 2px solid #00ffff;
					border-radius: 50%;
					background: rgba(0, 0, 0, 0.8);
					color: #00ffff;
					font-size: 24px;
					line-height: 1;
					cursor: pointer;
					z-index: 10;
					display: flex;
					align-items: center;
					justify-content: center;
				`
				closeBtn.onmouseover = () => {
					closeBtn.style.background = "rgba(0, 255, 255, 0.3)"
				}
				closeBtn.onmouseout = () => {
					closeBtn.style.background = "rgba(0, 0, 0, 0.8)"
				}
				closeBtn.onclick = (e) => {
					e.preventDefault()
					e.stopPropagation()
					// Restore pyramid at bottom position
					if (pyramidGroup) {
						pyramidGroup.visible = true
						animatePyramid(true, "portfolio")
					}
					// Clear content and hide
					content.innerHTML = ""
					content.style.display = "none"
					// Reset content styles
					content.style.height = ""
					content.style.top = ""
					content.style.left = ""
					content.style.right = ""
					content.style.width = ""
					content.style.transform = ""
					content.style.maxHeight = ""
					content.style.overflow = ""
					content.style.padding = ""
					// Show portfolio plane again
					showPortfolioPlane()
					currentContentVisible = "portfolio"
				}

				const img = document.createElement("img")
				img.src = link
				img.alt = "Visual Resume"
				img.style.maxWidth = "100%"
				img.style.maxHeight = "100%"
				img.style.objectFit = "contain"
				img.style.display = "block"
				img.style.margin = "0 auto"

				const wrapper = document.createElement("div")
				wrapper.className = "image-wrapper"
				wrapper.style.width = "100%"
				wrapper.style.height = "100%"
				wrapper.style.overflow = "auto"
				wrapper.style.position = "relative"
				wrapper.style.display = "flex"
				wrapper.style.alignItems = "center"
				wrapper.style.justifyContent = "center"
				wrapper.appendChild(img)
				wrapper.appendChild(closeBtn)
				content.appendChild(wrapper)
				content.style.display = "block"
				content.style.overflow = "hidden"
				content.style.padding = "0"
				content.style.zIndex = String(2147483646)
				content.style.position = "fixed"
				content.style.pointerEvents = "auto"
				currentContentVisible = "portfolio"
				return true
			}

			// Fallback: open in new tab
			window.open(link, "_blank")
			return true
		}
		return false
	}

	// Track which label is centered
	let centeredLabelName = window.centeredLabelName || null
	// If a content plane is visible, prefer handling clickable overlays on it first
	try {
		const portfolioPlaneEarly = scene.getObjectByName("portfolioPlane")
		if (portfolioPlaneEarly) {
			const clickablesEarly = portfolioPlaneEarly.children.filter(
				(c) => c && c.userData && c.userData.link
			)
			if (clickablesEarly.length > 0) {
				const hitsEarly = raycaster.intersectObjects(clickablesEarly, true)
				if (hitsEarly.length > 0) {
					let node = hitsEarly[0].object
					while (node) {
						if (node.userData && node.userData.link) {
							console.debug(
								"[onSceneMouseDown] EARLY clicked portfolio link:",
								node.userData.link
							)
							try {
								if (handleContentLink(node.userData.link)) return
							} catch (e) {
								console.error("Error handling content link (early)", e)
							}
						}
						node = node.parent
					}
				}
			}
		}
	} catch (e) {
		// ignore early plane detection errors
	}
	// Check generous hover targets first (so clicks near a label register even if a centered label is in front)
	const hoverHits = raycaster.intersectObjects(Object.values(hoverTargets))
	let obj = null
	if (hoverHits.length > 0) {
		const hoverObj = hoverHits[0].object
		const labelKey = hoverObj.userData.labelKey
		obj = labels[labelKey]
	} else {
		// Fallback: check tight label meshes
		const labelIntersects = raycaster.intersectObjects(Object.values(labels))
		if (labelIntersects.length > 0) obj = labelIntersects[0].object
	}
	if (obj) {
		let labelName = obj.userData.name
		// If Home was clicked, perform a complete reset: return pyramid to home state,
		// restore all labels to original positions, hide all content, and navigate home.
		if (labelName === "Home") {
			// ALWAYS reset pyramid to center with home rotation, position, and scale
			resetPyramidToHome()
			// Hide all content planes
			hideAllPlanes()
			window.centeredLabelName = null
			router.navigate("/")
			return
		}
		console.debug(
			"[onClick] clicked object labelName=",
			labelName,
			"active=",
			window.centeredLabelName
		)

		// With flattened menu, all labels are visible at the top
		// Clicking a label navigates to that section
		if (window.centeredLabelName !== labelName) {
			// If already showing content, spin pyramid and switch sections
			const isAtTop = pyramidGroup.position.y >= 0.75
			if (isAtTop) {
				// Already in flattened state, spin pyramid to new face and switch content
				hideAllPlanes()
				const sectionName = labelName.toLowerCase()
				console.log("pyramidGroup at top nav state:", pyramidGroup)
				spinPyramidToSection(sectionName, () => {
					// Show content after spin completes
					if (labelName === "Bio") {
						showBioPlane()
						currentContentVisible = "bio"
					} else if (labelName === "Portfolio") {
						showPortfolioPlane()
						currentContentVisible = "portfolio"
					} else if (labelName === "Blog") {
						showBlogPlane()
						currentContentVisible = "blog"
					}
				})
				window.centeredLabelName = labelName
			} else {
				// Animate pyramid to top and show content
				animatePyramid(true, labelName.toLowerCase())
				window.centeredLabelName = labelName
			}

			// Update route
			router.navigate("/" + labelName.toLowerCase())
		}
		return
	}

	// Click on pyramid toggles back up

	// If the click intersected a clickable overlay on a content plane (portfolio items), handle it.
	const portfolioPlane = scene.getObjectByName("portfolioPlane")
	if (portfolioPlane) {
		// Prefer to raycast against the explicit clickable overlays added as children
		const clickables = portfolioPlane.children.filter(
			(c) => c && c.userData && c.userData.link
		)
		if (clickables.length > 0) {
			const hits = raycaster.intersectObjects(clickables, true)
			if (hits.length > 0) {
				let node = hits[0].object
				// climb up to find any userData.link on the clicked object or its parents
				while (node) {
					if (node.userData && node.userData.link) {
						console.debug(
							"[onSceneMouseDown] clicked portfolio link:",
							node.userData.link
						)
						try {
							if (handleContentLink(node.userData.link)) return
						} catch (e) {
							console.error("Error handling content link", e)
						}
					}
					node = node.parent
				}
			}
		} else {
			// Fallback: raycast the whole plane if no explicit clickables found
			const pHits = raycaster.intersectObjects([portfolioPlane], true)
			if (pHits.length > 0) {
				let hit = pHits[0].object
				let node = hit
				while (node) {
					if (node.userData && node.userData.link) {
						console.debug(
							"[onSceneMouseDown] clicked portfolio link (fallback):",
							node.userData.link
						)
						try {
							if (handleContentLink(node.userData.link)) return
						} catch (e) {
							console.error("Error handling content link", e)
						}
					}
					node = node.parent
				}
			}
		}
	}

	// If any content plane is currently visible and the click was not on a label,
	// treat this click as a request to return "home" (dismiss content and animate pyramid up).
	console.debug(
		"[onClick] currentContentVisible:",
		currentContentVisible,
		"obj:",
		obj
	)
	if (currentContentVisible && !obj) {
		// If any content plane is currently visible and the click was not on a label,
		// reset pyramid to home state and navigate home
		resetPyramidToHome()
		hideAllPlanes()
		currentContentVisible = null
		window.centeredLabelName = null
		router.navigate("/")
		return
	}

	const pyramidIntersects = raycaster.intersectObjects(
		pyramidGroup.children,
		true
	)
	if (pyramidIntersects.length > 0) {
		const firstHit = pyramidIntersects[0]
		const hitObj = firstHit.object
		// If the hit object is a label mesh or a hover target, ignore here (labels handled above)
		if (
			Object.values(labels).includes(hitObj) ||
			(hitObj.name || "").endsWith("_hover")
		) {
			return
		}
		// Clicking the pyramid acts like clicking Home: reset everything to initial state
		resetPyramidToHome()
		hideAllPlanes()
		window.centeredLabelName = null
		currentContentVisible = null
		router.navigate("/")
	}
}
