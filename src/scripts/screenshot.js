#!/usr/bin/env node
// Simple screenshot script: uses Puppeteer to open the local dev server
// and capture a single JPEG screenshot of the scene.

const puppeteer = require("puppeteer")
const fs = require("fs")
const path = require("path")

async function main() {
	const url = process.argv[2] || "http://localhost:5173"
	const out = path.resolve(process.cwd(), "screenshot.jpg")
	const width = parseInt(process.env.SCREENSHOT_WIDTH || "1920", 10)
	const height = parseInt(process.env.SCREENSHOT_HEIGHT || "1080", 10)

	console.log("Capturing:", url, "->", out)

	const browser = await puppeteer.launch({
		headless: "new",
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
		defaultViewport: { width, height },
	})
	try {
		const page = await browser.newPage()
		await page.setViewport({ width, height })
		console.log("Loading page (waiting for network idle)...")
		await page.setDefaultNavigationTimeout(120000)
		await page.goto(url, { waitUntil: "networkidle2", timeout: 120000 })
		// Give a brief settle time so animations start and canvas paints
		await page.waitForTimeout(1200)

		// If your canvas has a selector, you can capture it specifically.
		// Default: capture full page viewport.
		await page.screenshot({ path: out, type: "jpeg", quality: 90, fullPage: false })
		console.log("Saved:", out)
		await browser.close()
	} catch (e) {
		console.error("Screenshot failed:", e)
		await browser.close()
		process.exit(1)
	}
}

main().catch((e) => {
	console.error(e)
	process.exit(1)
})
