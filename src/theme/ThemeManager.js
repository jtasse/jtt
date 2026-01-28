import { router } from "../router.js"

const ICONS = {
	light: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,
	dark: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
	auto: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
}

export class ThemeManager {
	constructor() {
		this.theme = localStorage.getItem("starlight-theme") || "auto"
		this.control = null
		this.menu = null
		this.toggleBtn = null
		this.init()
	}

	init() {
		console.debug("[ThemeManager] Initializing...")
		this.applyTheme(this.theme)
		this.createControl()

		// Listen for system preference changes if in auto mode
		window
			.matchMedia("(prefers-color-scheme: dark)")
			.addEventListener("change", () => {
				if (this.theme === "auto") {
					this.applyTheme("auto")
				}
			})

		// Listen for storage changes (cross-tab sync with docs)
		window.addEventListener("storage", (e) => {
			if (e.key === "starlight-theme" || e.key === "theme") {
				const newTheme = e.newValue || "auto"
				if (newTheme && newTheme !== this.theme) {
					this.applyTheme(newTheme)
				}
			}
		})

		// Listen for route changes to toggle visibility
		if (router) {
			router.onRouteChange((route) => this.updateVisibility(route))
			// Initial check
			this.updateVisibility(router.getCurrentRoute())
		} else {
			console.debug(
				"[ThemeManager] Router not found, visibility updates disabled",
			)
		}

		// Close menu when clicking outside
		document.addEventListener("click", (e) => {
			if (
				this.menu &&
				this.menu.classList.contains("open") &&
				!this.control.contains(e.target)
			) {
				this.menu.classList.remove("open")
			}
		})
	}

	applyTheme(theme) {
		let effectiveTheme = theme
		if (theme === "auto") {
			effectiveTheme = window.matchMedia("(prefers-color-scheme: light)")
				.matches
				? "light"
				: "dark"
		}

		document.documentElement.setAttribute("data-theme", effectiveTheme)
		if (localStorage.getItem("theme") !== theme) {
			localStorage.setItem("theme", theme)
		}
		if (localStorage.getItem("starlight-theme") !== theme) {
			localStorage.setItem("starlight-theme", theme)
		}
		this.theme = theme

		// Update UI
		this.updateUI()

		// Notify iframes (e.g. docs viewer)
		document.querySelectorAll("iframe").forEach((iframe) => {
			iframe.contentWindow?.postMessage({ type: "THEME_CHANGE", theme }, "*")
		})
	}

	updateUI() {
		if (!this.toggleBtn) return

		// Update toggle button icon
		this.toggleBtn.innerHTML = ICONS[this.theme] || ICONS.auto

		// Update active state in menu
		if (this.menu) {
			const buttons = this.menu.querySelectorAll(".theme-option")
			buttons.forEach((btn) => {
				if (btn.dataset.value === this.theme) {
					btn.classList.add("active")
				} else {
					btn.classList.remove("active")
				}
			})
		}
	}

	updateVisibility(route) {
		console.debug(`[ThemeManager] Updating visibility for route: ${route}`)
		if (!this.control) return

		// Hide on home page, show on content pages
		if (route === "/" || route === "") {
			this.control.style.display = "none"
		} else {
			this.control.style.display = "block"
		}
	}

	createControl() {
		if (document.getElementById("theme-control")) return

		const container = document.createElement("div")
		container.id = "theme-control"
		container.style.display = "none" // Hidden by default

		// Toggle Button
		const toggleBtn = document.createElement("button")
		toggleBtn.id = "theme-toggle"
		toggleBtn.setAttribute("aria-label", "Select theme")
		toggleBtn.innerHTML = ICONS[this.theme] || ICONS.dark
		container.appendChild(toggleBtn)

		// Menu
		const menu = document.createElement("div")
		menu.id = "theme-menu"

		const options = [
			{ value: "light", label: "Light", icon: ICONS.light },
			{ value: "dark", label: "Dark", icon: ICONS.dark },
			{ value: "auto", label: "Auto", icon: ICONS.auto },
		]

		options.forEach((opt) => {
			const btn = document.createElement("button")
			btn.className = "theme-option"
			btn.dataset.value = opt.value
			btn.innerHTML = `${opt.icon} <span>${opt.label}</span>`
			btn.addEventListener("click", () => {
				this.applyTheme(opt.value)
			})
			menu.appendChild(btn)
		})

		container.appendChild(menu)
		document.body.appendChild(container)

		// Hover behavior
		let timeoutId
		container.addEventListener("mouseenter", () => {
			if (timeoutId) clearTimeout(timeoutId)
			this.menu.classList.add("open")
		})
		container.addEventListener("mouseleave", () => {
			timeoutId = setTimeout(() => {
				this.menu.classList.remove("open")
			}, 2000)
		})

		this.control = container
		this.toggleBtn = toggleBtn
		this.menu = menu
		this.updateUI()
	}
}

// Initialize immediately
new ThemeManager()
