import * as THREE from "three"

let cachedPlanetCanvas = null

export function getPlanetCanvas() {
	if (cachedPlanetCanvas) return cachedPlanetCanvas

	const canvas = document.createElement("canvas")
	canvas.width = 1024
	canvas.height = 512
	const ctx = canvas.getContext("2d")
	ctx.fillStyle = "#0c177aff"
	ctx.fillRect(0, 0, canvas.width, canvas.height)
	ctx.fillStyle = "#EAE9BD"
	ctx.strokeStyle = "#EAE9BD"
	ctx.lineWidth = 1.5
	ctx.lineCap = "round"
	ctx.lineJoin = "round"
	drawAccurateContinents(ctx, canvas.width, canvas.height)

	cachedPlanetCanvas = canvas
	return canvas
}

function latLonToCanvas(lat, lon, width, height) {
	const x = ((lon + 180) / 360) * width
	const y = ((90 - lat) / 180) * height
	return { x, y }
}

function drawContinentPath(
	ctx,
	coords,
	width,
	height,
	closePath = true,
	fillColor = "#5A5840",
) {
	if (coords.length < 2) return

	ctx.beginPath()

	const start = latLonToCanvas(coords[0][1], coords[0][0], width, height)
	ctx.moveTo(start.x, start.y)

	for (let i = 1; i < coords.length; i++) {
		const point = latLonToCanvas(coords[i][1], coords[i][0], width, height)
		const prevPoint = latLonToCanvas(
			coords[i - 1][1],
			coords[i - 1][0],
			width,
			height,
		)

		// Handle longitude wraparound
		if (Math.abs(point.x - prevPoint.x) > width / 2) {
			if (closePath) ctx.closePath()
			ctx.fillStyle = fillColor
			ctx.strokeStyle = fillColor
			ctx.fill()
			ctx.stroke()

			ctx.beginPath()
			ctx.moveTo(point.x, point.y)
		} else {
			ctx.lineTo(point.x, point.y)
		}
	}

	if (closePath) {
		ctx.closePath()
	}

	ctx.fillStyle = fillColor
	ctx.strokeStyle = fillColor
	ctx.fill()
	ctx.stroke()
}

function drawAccurateContinents(ctx, width, height) {
	// North America
	const northAmerica = [
		[-168, 65],
		[-165, 62],
		[-160, 60],
		[-150, 61],
		[-140, 60],
		[-135, 57],
		[-130, 55],
		[-125, 50],
		[-124, 45],
		[-123, 40],
		[-117, 33],
		[-110, 30],
		[-105, 25],
		[-100, 22],
		[-95, 18],
		[-90, 20],
		[-88, 22],
		[-85, 22],
		[-83, 18],
		[-80, 10],
		[-78, 8],
		[-82, 10],
		[-85, 12],
		[-88, 18],
		[-92, 20],
		[-95, 25],
		[-97, 28],
		[-95, 30],
		[-90, 30],
		[-85, 30],
		[-82, 32],
		[-78, 35],
		[-75, 38],
		[-72, 42],
		[-70, 43],
		[-68, 45],
		[-66, 45],
		[-64, 47],
		[-67, 48],
		[-70, 47],
		[-72, 45],
		[-75, 45],
		[-78, 43],
		[-80, 42],
		[-82, 45],
		[-85, 47],
		[-88, 48],
		[-92, 49],
		[-95, 49],
		[-100, 49],
		[-105, 49],
		[-115, 49],
		[-120, 49],
		[-125, 50],
		[-130, 55],
		[-135, 58],
		[-140, 60],
		[-145, 62],
		[-150, 64],
		[-155, 68],
		[-160, 70],
		[-165, 70],
		[-170, 68],
		[-168, 65],
	]

	// South America
	const southAmerica = [
		[-80, 10],
		[-75, 10],
		[-70, 12],
		[-65, 10],
		[-60, 5],
		[-55, 5],
		[-50, 0],
		[-48, -2],
		[-45, -5],
		[-42, -8],
		[-38, -12],
		[-35, -8],
		[-38, -15],
		[-42, -22],
		[-45, -24],
		[-48, -26],
		[-52, -30],
		[-55, -35],
		[-58, -38],
		[-65, -42],
		[-68, -50],
		[-72, -52],
		[-75, -50],
		[-73, -45],
		[-72, -40],
		[-70, -35],
		[-70, -30],
		[-70, -25],
		[-70, -20],
		[-72, -15],
		[-78, -5],
		[-80, 0],
		[-80, 5],
		[-80, 10],
	]

	// Europe
	const europe = [
		[-10, 36],
		[-8, 38],
		[-9, 40],
		[-8, 42],
		[-5, 44],
		[-2, 44],
		[0, 43],
		[3, 43],
		[5, 44],
		[8, 45],
		[12, 45],
		[14, 42],
		[18, 40],
		[20, 40],
		[24, 38],
		[26, 40],
		[28, 42],
		[30, 44],
		[32, 46],
		[35, 48],
		[38, 50],
		[42, 55],
		[38, 60],
		[30, 62],
		[25, 65],
		[20, 68],
		[15, 70],
		[10, 70],
		[5, 62],
		[8, 58],
		[10, 55],
		[8, 52],
		[5, 52],
		[0, 50],
		[-5, 50],
		[-8, 48],
		[-10, 44],
		[-10, 40],
		[-10, 36],
	]

	// Africa
	const africa = [
		[-17, 15],
		[-15, 20],
		[-12, 25],
		[-8, 30],
		[-5, 35],
		[0, 36],
		[10, 37],
		[15, 32],
		[25, 32],
		[30, 30],
		[35, 28],
		[38, 22],
		[42, 15],
		[45, 12],
		[50, 10],
		[50, 5],
		[45, 0],
		[42, -5],
		[40, -12],
		[38, -18],
		[35, -22],
		[30, -28],
		[28, -32],
		[25, -34],
		[20, -35],
		[18, -32],
		[15, -28],
		[12, -18],
		[15, -10],
		[12, -5],
		[10, 0],
		[8, 5],
		[5, 5],
		[0, 5],
		[-5, 5],
		[-10, 8],
		[-15, 12],
		[-17, 15],
	]

	// Asia (mainland)
	const asia = [
		[26, 40],
		[30, 42],
		[35, 42],
		[40, 42],
		[45, 40],
		[50, 38],
		[55, 38],
		[60, 40],
		[65, 42],
		[70, 45],
		[75, 42],
		[80, 35],
		[85, 28],
		[88, 22],
		[92, 20],
		[98, 18],
		[100, 15],
		[102, 12],
		[105, 10],
		[108, 12],
		[110, 15],
		[115, 20],
		[118, 25],
		[120, 30],
		[125, 35],
		[130, 40],
		[135, 45],
		[140, 45],
		[145, 48],
		[150, 52],
		[155, 58],
		[160, 62],
		[170, 65],
		[180, 68],
	]

	// Asia continuation (Siberia wraps around)
	const asiaContinuation = [
		[-180, 68],
		[-175, 65],
		[-170, 62],
		[-168, 65],
	]

	// India subcontinent
	const india = [
		[68, 24],
		[72, 22],
		[75, 18],
		[78, 12],
		[80, 8],
		[82, 10],
		[85, 15],
		[88, 22],
		[90, 24],
		[92, 22],
		[88, 22],
		[85, 25],
		[80, 28],
		[75, 30],
		[72, 28],
		[68, 24],
	]

	// Southeast Asia / Indonesia
	const seAsia = [
		[100, 5],
		[102, 2],
		[105, 0],
		[108, -2],
		[112, -5],
		[115, -8],
		[120, -8],
		[125, -5],
		[130, -3],
		[135, -5],
		[140, -6],
		[142, -8],
		[145, -6],
		[148, -8],
		[150, -10],
		[145, -15],
		[140, -12],
		[135, -8],
		[130, -5],
		[125, -8],
		[120, -10],
		[115, -8],
		[110, -6],
		[105, -5],
		[102, -3],
		[100, 0],
		[100, 5],
	]

	// Australia
	const australia = [
		[115, -22],
		[118, -20],
		[122, -18],
		[128, -15],
		[132, -12],
		[136, -12],
		[140, -15],
		[145, -15],
		[150, -18],
		[153, -22],
		[153, -28],
		[150, -32],
		[147, -38],
		[145, -40],
		[140, -38],
		[135, -35],
		[130, -32],
		[125, -32],
		[120, -30],
		[115, -28],
		[113, -25],
		[115, -22],
	]

	// Japan
	const japan = [
		[130, 32],
		[132, 34],
		[135, 35],
		[138, 36],
		[140, 38],
		[142, 40],
		[144, 43],
		[145, 45],
		[143, 44],
		[140, 42],
		[138, 40],
		[135, 38],
		[132, 36],
		[130, 34],
		[130, 32],
	]

	// UK/Ireland
	const uk = [
		[-10, 52],
		[-8, 54],
		[-6, 55],
		[-4, 58],
		[-3, 59],
		[-2, 58],
		[0, 55],
		[2, 52],
		[0, 50],
		[-2, 50],
		[-5, 50],
		[-6, 52],
		[-8, 52],
		[-10, 52],
	]

	// Greenland
	const greenland = [
		[-45, 60],
		[-42, 62],
		[-38, 65],
		[-35, 70],
		[-30, 75],
		[-25, 78],
		[-20, 80],
		[-25, 82],
		[-35, 83],
		[-45, 82],
		[-55, 78],
		[-60, 72],
		[-55, 68],
		[-50, 64],
		[-45, 60],
	]

	// New Zealand
	const newZealand = [
		[172, -35],
		[175, -37],
		[178, -40],
		[177, -42],
		[174, -45],
		[170, -46],
		[168, -44],
		[170, -42],
		[172, -40],
		[172, -35],
	]

	// Draw all continents
	drawContinentPath(ctx, northAmerica, width, height)
	drawContinentPath(ctx, southAmerica, width, height)
	drawContinentPath(ctx, europe, width, height)
	drawContinentPath(ctx, africa, width, height)
	drawContinentPath(ctx, asia, width, height, false) // Don't close - wraps
	drawContinentPath(ctx, asiaContinuation, width, height, false)
	drawContinentPath(ctx, india, width, height)
	drawContinentPath(ctx, seAsia, width, height)
	drawContinentPath(ctx, australia, width, height)
	drawContinentPath(ctx, japan, width, height)
	drawContinentPath(ctx, uk, width, height)
	drawContinentPath(ctx, greenland, width, height)
	drawContinentPath(ctx, newZealand, width, height)
}
