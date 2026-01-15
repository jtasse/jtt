import { defineConfig } from "vite"
import { resolve, join } from "path"
import fs from "fs"

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
		plugins: [
			{
				name: "watch-content",
				handleHotUpdate({ file, server }) {
					if (
						file.replace(/\\/g, "/").includes("/src/content/") &&
						file.endsWith(".html")
					) {
						server.ws.send({ type: "full-reload", path: "*" })
					}
				},
			},
			{
				name: "copy-content",
				closeBundle() {
					const srcDir = resolve(__dirname, "src/content")
					const destDir = resolve(__dirname, "dist/src/content")

					if (fs.existsSync(srcDir)) {
						const copyRecursive = (src, dest) => {
							if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })
							fs.readdirSync(src).forEach((file) => {
								const srcPath = join(src, file)
								const destPath = join(dest, file)
								if (fs.statSync(srcPath).isDirectory()) {
									copyRecursive(srcPath, destPath)
								} else {
									fs.copyFileSync(srcPath, destPath)
								}
							})
						}
						copyRecursive(srcDir, destDir)
						console.log("[copy-content] Copied src/content to dist/src/content")
					}
				},
			},
		],
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
