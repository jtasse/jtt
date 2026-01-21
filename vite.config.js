import { defineConfig } from "vite"
import { resolve, join, dirname } from "path"
import fs from "fs"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig(({ mode }) => {
	const alias = {}
	if (mode === "test") {
		alias["path2d-polyfill"] = resolve("tests/path2d-polyfill.js")
	}

	const handleProxyError = (err, req, res) => {
		console.error(
			"\n\x1b[33m%s\x1b[0m\n",
			"Proxy Error: Docs server not running. Run 'npm run dev:docs' in a separate terminal.",
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

						// Copy Draco decoders from node_modules to dist/draco
						const dracoSrc = resolve(
							__dirname,
							"node_modules/three/examples/jsm/libs/draco",
						)
						const dracoDest = resolve(__dirname, "dist/draco")
						if (fs.existsSync(dracoSrc)) {
							copyRecursive(dracoSrc, dracoDest)
							console.log("[copy-content] Copied draco decoders to dist/draco")
						}
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
					ws: true,
				},
				// Proxy Astro/Starlight assets to the docs server
				"^/(@fs/.*)?(node_modules/astro|node_modules/@astrojs|packages/docs)/.*":
					{
						target: "http://127.0.0.1:4321",
						changeOrigin: true,
						onError: handleProxyError,
						ws: true,
					},
				// Proxy Astro component styles/scripts
				"^/.*\\?astro.*": {
					target: "http://127.0.0.1:4321",
					changeOrigin: true,
					onError: handleProxyError,
					ws: true,
				},
				// Proxy Astro/Starlight virtual modules
				"^/@id/.*(astro|starlight).*": {
					target: "http://127.0.0.1:4321",
					changeOrigin: true,
					onError: handleProxyError,
					ws: true,
				},
				// Proxy Astro-specific dependencies in node_modules/.vite
				"^/node_modules/\\.vite/deps/astro_.*": {
					target: "http://127.0.0.1:4321",
					changeOrigin: true,
					onError: handleProxyError,
					ws: true,
				},
				// Proxy docs styles (main app doesn't use src/styles)
				"^/src/styles/.*": {
					target: "http://127.0.0.1:4321",
					changeOrigin: true,
					onError: handleProxyError,
					ws: true,
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
