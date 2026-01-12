import { defineConfig } from "vite"
import { resolve } from "path"

export default defineConfig(({ mode }) => {
	const alias = {}
	if (mode === "test") {
		alias["path2d-polyfill"] = resolve("tests/path2d-polyfill.js")
	}

	const handleProxyError = (err, req, res) => {
		console.error(
			"\n\x1b[33m%s\x1b[0m\n",
			"Proxy Error: Docs server not running. Run 'npm run dev:docs' in a separate terminal."
		)
		res.writeHead(502, {
			"Content-Type": "text/plain",
		})
		res.end('Docs server is not running. Run "npm run dev:docs" to start it.')
	}

	return {
		server: {
			port: 5173,
			proxy: {
				"/portfolio/docs": {
					target: "http://127.0.0.1:4321",
					changeOrigin: true,
					onError: handleProxyError,
				},
				// Proxy Astro/Starlight assets to the docs server
				"^/(@fs/.*)?(node_modules/astro|node_modules/@astrojs|packages/docs)/.*":
					{
						target: "http://127.0.0.1:4321",
						changeOrigin: true,
						onError: handleProxyError,
					},
				// Proxy Astro component styles/scripts
				"^/.*\\?astro.*": {
					target: "http://127.0.0.1:4321",
					changeOrigin: true,
					onError: handleProxyError,
				},
				// Proxy Astro/Starlight virtual modules
				"^/@id/.*(astro|starlight).*": {
					target: "http://127.0.0.1:4321",
					changeOrigin: true,
					onError: handleProxyError,
				},
				// Proxy Astro-specific dependencies in node_modules/.vite
				"^/node_modules/\\.vite/deps/astro_.*": {
					target: "http://127.0.0.1:4321",
					changeOrigin: true,
					onError: handleProxyError,
				},
				// Proxy docs styles (main app doesn't use src/styles)
				"^/src/styles/.*": {
					target: "http://127.0.0.1:4321",
					changeOrigin: true,
					onError: handleProxyError,
				},
			},
		},
		resolve: {
			alias,
		},
		test: {
			environment: "jsdom",
		},
	}
})
