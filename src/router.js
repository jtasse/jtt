// Simple client-side router for pyramid labels
// Usage: router.navigate('/portfolio')
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
		if (this.currentRoute !== path) {
			window.history.pushState({}, "", path)
			this.currentRoute = path
			this.notify()
		}
	}

	onRouteChange(callback) {
		this.listeners.push(callback)
	}

	notify() {
		this.listeners.forEach((cb) => cb(this.currentRoute))
	}
}

export const router = new Router()
