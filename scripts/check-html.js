#!/usr/bin/env node
const fs = require("fs")
const path = require("path")

function walk(dir) {
	const entries = fs.readdirSync(dir, { withFileTypes: true })
	const files = []
	for (const e of entries) {
		const full = path.join(dir, e.name)
		if (e.isDirectory()) files.push(...walk(full))
		else if (e.isFile() && full.endsWith(".html")) files.push(full)
	}
	return files
}

function checkFile(file) {
	const src = fs.readFileSync(file, "utf8")
	const lower = src.toLowerCase()
	const doctypeMatches = lower.match(/<!doctype\s+html/gi) || []
	const closingMatches = lower.match(/<\/html>/gi) || []

	const errors = []
	if (doctypeMatches.length !== 1) {
		errors.push(
			`expected exactly one <!doctype html> (found ${doctypeMatches.length})`,
		)
	}

	// Check that doctype appears near the top (first non-empty line)
	const firstNonEmpty =
		src.split(/\r?\n/).find((line) => line.trim().length > 0) || ""
	if (!/<!doctype\s+html/i.test(firstNonEmpty)) {
		// allow it if within first 10 lines
		const headSlice = src.split(/\r?\n/).slice(0, 10).join("\n")
		if (!/<!doctype\s+html/i.test(headSlice)) {
			errors.push("<!doctype html> not found in the first 10 lines")
		}
	}

	if (closingMatches.length !== 1) {
		errors.push(`expected exactly one </html> (found ${closingMatches.length})`)
	} else {
		// ensure nothing substantial after the final </html>
		const idx = lower.lastIndexOf("</html>")
		const after = src.slice(idx + "</html>".length)
		if (after.replace(/\s|<!--.*?-->/gs, "").length > 0) {
			errors.push("unexpected content after closing </html>")
		}
	}

	return errors
}

function main() {
	const postsDir = path.join(__dirname, "..", "src", "content", "blog", "posts")
	if (!fs.existsSync(postsDir)) {
		console.error("posts directory not found:", postsDir)
		process.exit(0)
	}

	const files = walk(postsDir)
	let ok = true
	for (const f of files) {
		const errs = checkFile(f)
		if (errs.length) {
			ok = false
			console.error("\nERROR in", f)
			for (const e of errs) console.error("  -", e)
		}
	}

	if (!ok) process.exit(1)
	console.log("HTML checks passed for", files.length, "files.")
}

main()
