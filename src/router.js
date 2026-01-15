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
		this.listeners.push(callback)
	}

	notify() {
		this.listeners.forEach((cb) => cb(this.currentRoute))
	}
}

export const router = new Router()
