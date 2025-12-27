#!/usr/bin/env node
// Simple recording script: uses Puppeteer to capture frames and ffmpeg to encode
// Usage: npm run record -- [http://localhost:5173]

const puppeteer = require("puppeteer")
const fs = require("fs")
const path = require("path")
const { spawn } = require("child_process")

async function ensureDir(dir) {
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

async function main() {
	const url = process.argv[2] || "http://localhost:5173"
	const outDir = path.resolve(process.cwd(), "record-frames")
	const outFile = path.resolve(process.cwd(), "site-record.mp4")
	const fps = 30
	const durationSeconds = 60
	const frames = fps * durationSeconds
	const width = 1920
	const height = 1080

	console.log("Recording", url, "->", outFile)
	console.log("Frames:", frames, "at", fps, "fps")

	await ensureDir(outDir)

	const browser = await puppeteer.launch({
		// opt into the new headless implementation to avoid deprecation warnings
		headless: "new",
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
		defaultViewport: { width, height },
	})
	try {
		const page = await browser.newPage()
		await page.setViewport({ width, height })
		console.log(
			"Loading page... this expects your dev server to be running (npm run dev)"
		)
		// Increase navigation timeout to give local dev server extra time to boot
		await page.setDefaultNavigationTimeout(120000)
		await page.goto(url, { waitUntil: "networkidle2", timeout: 120000 })
		// Give a brief settle time so animations start
		await page.waitForTimeout(1000)

		for (let i = 0; i < frames; i++) {
			const filename = path.join(
				outDir,
				`frame${String(i).padStart(5, "0")}.png`
			)
			await page.screenshot({ path: filename, type: "png" })
			if (i % 50 === 0) console.log(`Captured ${i}/${frames}`)
			await page.waitForTimeout(Math.round(1000 / fps))
		}
		console.log("Captured frames, closing browser...")
		await browser.close()

		// Run ffmpeg to assemble frames into MP4
		console.log("Encoding with ffmpeg ->", outFile)
		const ff = spawn(
			"ffmpeg",
			[
				"-y",
				"-framerate",
				String(fps),
				"-i",
				path.join(outDir, "frame%05d.png"),
				"-c:v",
				"libx264",
				"-pix_fmt",
				"yuv420p",
				"-crf",
				"18",
				outFile,
			],
			{ stdio: "inherit" }
		)

		ff.on("close", (code) => {
			if (code === 0) console.log("Encoding complete:", outFile)
			else console.error("ffmpeg exited with code", code)
		})
	} catch (e) {
		console.error("Recording failed:", e)
		await browser.close()
	}
}

main().catch((e) => {
	console.error(e)
	process.exit(1)
})
