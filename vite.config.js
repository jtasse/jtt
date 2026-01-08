import { defineConfig } from "vite"
import { resolve } from "path"

export default defineConfig(({ mode }) => {
	const alias = {}
	if (mode === "test") {
		alias["path2d-polyfill"] = resolve("tests/path2d-polyfill.js")
	}

	return {
		server: {
			port: 5173,
		},
		resolve: {
			alias,
		},
		test: {
			environment: "jsdom",
		},
	}
})
