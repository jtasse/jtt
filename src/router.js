// Simple client-side router for pyramid labels
// Usage: router.navigate('/about')
// Listen for route changes: router.onRouteChange(callback)

class Router {
	constructor() {
		this.currentRoute = this.getCurrentRoute()
		this.listeners = []
		window.addEventListener("popstate", () => {
			this.currentRoute = this.getCurrentRoute()
			this.notify()
		})
	}

	getCurrentRoute() {
		return window.location.pathname
	}

	navigate(path) {
		// Always update history and notify, even if the route hasn't changed
		// This ensures that label clicks always trigger the animation
		window.history.pushState({}, "", path)
		this.currentRoute = path
		this.notify()
	}

	onRouteChange(callback) {
		console.log(
			"[router] onRouteChange registered, total listeners:",
			this.listeners.length + 1,
		)
		this.listeners.push(callback)
	}

	notify() {
		console.log(
			"[router] notify() called, listeners count:",
			this.listeners.length,
			"route:",
			this.currentRoute,
		)
		this.listeners.forEach((cb) => {
			try {
				console.log("[router] calling listener for route:", this.currentRoute)
				cb(this.currentRoute)
				console.log("[router] listener completed")
			} catch (e) {
				console.error("[router] listener threw error:", e.message)
			}
		})
	}
}

export const router = new Router()
