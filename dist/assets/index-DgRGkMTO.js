;(function () {
	const t = document.createElement("link").relList
	if (t && t.supports && t.supports("modulepreload")) return
	for (const s of document.querySelectorAll('link[rel="modulepreload"]')) n(s)
	new MutationObserver((s) => {
		for (const r of s)
			if (r.type === "childList")
				for (const o of r.addedNodes)
					o.tagName === "LINK" && o.rel === "modulepreload" && n(o)
	}).observe(document, { childList: !0, subtree: !0 })
	function e(s) {
		const r = {}
		return (
			s.integrity && (r.integrity = s.integrity),
			s.referrerPolicy && (r.referrerPolicy = s.referrerPolicy),
			s.crossOrigin === "use-credentials"
				? (r.credentials = "include")
				: s.crossOrigin === "anonymous"
				? (r.credentials = "omit")
				: (r.credentials = "same-origin"),
			r
		)
	}
	function n(s) {
		if (s.ep) return
		s.ep = !0
		const r = e(s)
		fetch(s.href, r)
	}
})()
/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */ const Zo = "180",
	Fi = { ROTATE: 0, DOLLY: 1, PAN: 2 },
	Ii = { ROTATE: 0, PAN: 1, DOLLY_PAN: 2, DOLLY_ROTATE: 3 },
	Yc = 0,
	ya = 1,
	qc = 2,
	Hl = 1,
	jc = 2,
	Cn = 3,
	Zn = 0,
	Ie = 1,
	De = 2,
	Xn = 0,
	Oi = 1,
	Sa = 2,
	Ea = 3,
	ba = 4,
	Kc = 5,
	ai = 100,
	Zc = 101,
	$c = 102,
	Jc = 103,
	Qc = 104,
	th = 200,
	eh = 201,
	nh = 202,
	ih = 203,
	ro = 204,
	oo = 205,
	sh = 206,
	rh = 207,
	oh = 208,
	ah = 209,
	lh = 210,
	ch = 211,
	hh = 212,
	uh = 213,
	dh = 214,
	ao = 0,
	lo = 1,
	co = 2,
	zi = 3,
	ho = 4,
	uo = 5,
	fo = 6,
	po = 7,
	kl = 0,
	fh = 1,
	ph = 2,
	Yn = 0,
	mh = 1,
	gh = 2,
	_h = 3,
	xh = 4,
	vh = 5,
	Mh = 6,
	yh = 7,
	Gl = 300,
	Hi = 301,
	ki = 302,
	mo = 303,
	go = 304,
	xr = 306,
	ar = 1e3,
	Gn = 1001,
	_o = 1002,
	dn = 1003,
	Sh = 1004,
	Es = 1005,
	rn = 1006,
	br = 1007,
	Vn = 1008,
	Mn = 1009,
	Vl = 1010,
	Wl = 1011,
	os = 1012,
	$o = 1013,
	ui = 1014,
	xn = 1015,
	ms = 1016,
	Jo = 1017,
	Qo = 1018,
	as = 1020,
	Xl = 35902,
	Yl = 35899,
	ql = 1021,
	jl = 1022,
	on = 1023,
	ls = 1026,
	cs = 1027,
	Kl = 1028,
	ta = 1029,
	Zl = 1030,
	ea = 1031,
	na = 1033,
	tr = 33776,
	er = 33777,
	nr = 33778,
	ir = 33779,
	xo = 35840,
	vo = 35841,
	Mo = 35842,
	yo = 35843,
	So = 36196,
	Eo = 37492,
	bo = 37496,
	To = 37808,
	Ao = 37809,
	wo = 37810,
	Ro = 37811,
	Co = 37812,
	Po = 37813,
	Do = 37814,
	Lo = 37815,
	Io = 37816,
	Uo = 37817,
	No = 37818,
	Fo = 37819,
	Oo = 37820,
	Bo = 37821,
	zo = 36492,
	Ho = 36494,
	ko = 36495,
	Go = 36283,
	Vo = 36284,
	Wo = 36285,
	Xo = 36286,
	Eh = 3200,
	bh = 3201,
	$l = 0,
	Th = 1,
	Hn = "",
	en = "srgb",
	Gi = "srgb-linear",
	lr = "linear",
	Jt = "srgb",
	_i = 7680,
	Ta = 519,
	Ah = 512,
	wh = 513,
	Rh = 514,
	Jl = 515,
	Ch = 516,
	Ph = 517,
	Dh = 518,
	Lh = 519,
	Aa = 35044,
	wa = "300 es",
	vn = 2e3,
	cr = 2001
class pi {
	addEventListener(t, e) {
		this._listeners === void 0 && (this._listeners = {})
		const n = this._listeners
		n[t] === void 0 && (n[t] = []), n[t].indexOf(e) === -1 && n[t].push(e)
	}
	hasEventListener(t, e) {
		const n = this._listeners
		return n === void 0 ? !1 : n[t] !== void 0 && n[t].indexOf(e) !== -1
	}
	removeEventListener(t, e) {
		const n = this._listeners
		if (n === void 0) return
		const s = n[t]
		if (s !== void 0) {
			const r = s.indexOf(e)
			r !== -1 && s.splice(r, 1)
		}
	}
	dispatchEvent(t) {
		const e = this._listeners
		if (e === void 0) return
		const n = e[t.type]
		if (n !== void 0) {
			t.target = this
			const s = n.slice(0)
			for (let r = 0, o = s.length; r < o; r++) s[r].call(this, t)
			t.target = null
		}
	}
}
const Re = [
		"00",
		"01",
		"02",
		"03",
		"04",
		"05",
		"06",
		"07",
		"08",
		"09",
		"0a",
		"0b",
		"0c",
		"0d",
		"0e",
		"0f",
		"10",
		"11",
		"12",
		"13",
		"14",
		"15",
		"16",
		"17",
		"18",
		"19",
		"1a",
		"1b",
		"1c",
		"1d",
		"1e",
		"1f",
		"20",
		"21",
		"22",
		"23",
		"24",
		"25",
		"26",
		"27",
		"28",
		"29",
		"2a",
		"2b",
		"2c",
		"2d",
		"2e",
		"2f",
		"30",
		"31",
		"32",
		"33",
		"34",
		"35",
		"36",
		"37",
		"38",
		"39",
		"3a",
		"3b",
		"3c",
		"3d",
		"3e",
		"3f",
		"40",
		"41",
		"42",
		"43",
		"44",
		"45",
		"46",
		"47",
		"48",
		"49",
		"4a",
		"4b",
		"4c",
		"4d",
		"4e",
		"4f",
		"50",
		"51",
		"52",
		"53",
		"54",
		"55",
		"56",
		"57",
		"58",
		"59",
		"5a",
		"5b",
		"5c",
		"5d",
		"5e",
		"5f",
		"60",
		"61",
		"62",
		"63",
		"64",
		"65",
		"66",
		"67",
		"68",
		"69",
		"6a",
		"6b",
		"6c",
		"6d",
		"6e",
		"6f",
		"70",
		"71",
		"72",
		"73",
		"74",
		"75",
		"76",
		"77",
		"78",
		"79",
		"7a",
		"7b",
		"7c",
		"7d",
		"7e",
		"7f",
		"80",
		"81",
		"82",
		"83",
		"84",
		"85",
		"86",
		"87",
		"88",
		"89",
		"8a",
		"8b",
		"8c",
		"8d",
		"8e",
		"8f",
		"90",
		"91",
		"92",
		"93",
		"94",
		"95",
		"96",
		"97",
		"98",
		"99",
		"9a",
		"9b",
		"9c",
		"9d",
		"9e",
		"9f",
		"a0",
		"a1",
		"a2",
		"a3",
		"a4",
		"a5",
		"a6",
		"a7",
		"a8",
		"a9",
		"aa",
		"ab",
		"ac",
		"ad",
		"ae",
		"af",
		"b0",
		"b1",
		"b2",
		"b3",
		"b4",
		"b5",
		"b6",
		"b7",
		"b8",
		"b9",
		"ba",
		"bb",
		"bc",
		"bd",
		"be",
		"bf",
		"c0",
		"c1",
		"c2",
		"c3",
		"c4",
		"c5",
		"c6",
		"c7",
		"c8",
		"c9",
		"ca",
		"cb",
		"cc",
		"cd",
		"ce",
		"cf",
		"d0",
		"d1",
		"d2",
		"d3",
		"d4",
		"d5",
		"d6",
		"d7",
		"d8",
		"d9",
		"da",
		"db",
		"dc",
		"dd",
		"de",
		"df",
		"e0",
		"e1",
		"e2",
		"e3",
		"e4",
		"e5",
		"e6",
		"e7",
		"e8",
		"e9",
		"ea",
		"eb",
		"ec",
		"ed",
		"ee",
		"ef",
		"f0",
		"f1",
		"f2",
		"f3",
		"f4",
		"f5",
		"f6",
		"f7",
		"f8",
		"f9",
		"fa",
		"fb",
		"fc",
		"fd",
		"fe",
		"ff",
	],
	rs = Math.PI / 180,
	Yo = 180 / Math.PI
function gs() {
	const i = (Math.random() * 4294967295) | 0,
		t = (Math.random() * 4294967295) | 0,
		e = (Math.random() * 4294967295) | 0,
		n = (Math.random() * 4294967295) | 0
	return (
		Re[i & 255] +
		Re[(i >> 8) & 255] +
		Re[(i >> 16) & 255] +
		Re[(i >> 24) & 255] +
		"-" +
		Re[t & 255] +
		Re[(t >> 8) & 255] +
		"-" +
		Re[((t >> 16) & 15) | 64] +
		Re[(t >> 24) & 255] +
		"-" +
		Re[(e & 63) | 128] +
		Re[(e >> 8) & 255] +
		"-" +
		Re[(e >> 16) & 255] +
		Re[(e >> 24) & 255] +
		Re[n & 255] +
		Re[(n >> 8) & 255] +
		Re[(n >> 16) & 255] +
		Re[(n >> 24) & 255]
	).toLowerCase()
}
function Ht(i, t, e) {
	return Math.max(t, Math.min(e, i))
}
function Ih(i, t) {
	return ((i % t) + t) % t
}
function Tr(i, t, e) {
	return (1 - e) * i + e * t
}
function ji(i, t) {
	switch (t.constructor) {
		case Float32Array:
			return i
		case Uint32Array:
			return i / 4294967295
		case Uint16Array:
			return i / 65535
		case Uint8Array:
			return i / 255
		case Int32Array:
			return Math.max(i / 2147483647, -1)
		case Int16Array:
			return Math.max(i / 32767, -1)
		case Int8Array:
			return Math.max(i / 127, -1)
		default:
			throw new Error("Invalid component type.")
	}
}
function He(i, t) {
	switch (t.constructor) {
		case Float32Array:
			return i
		case Uint32Array:
			return Math.round(i * 4294967295)
		case Uint16Array:
			return Math.round(i * 65535)
		case Uint8Array:
			return Math.round(i * 255)
		case Int32Array:
			return Math.round(i * 2147483647)
		case Int16Array:
			return Math.round(i * 32767)
		case Int8Array:
			return Math.round(i * 127)
		default:
			throw new Error("Invalid component type.")
	}
}
const Uh = { DEG2RAD: rs }
class Dt {
	constructor(t = 0, e = 0) {
		;(Dt.prototype.isVector2 = !0), (this.x = t), (this.y = e)
	}
	get width() {
		return this.x
	}
	set width(t) {
		this.x = t
	}
	get height() {
		return this.y
	}
	set height(t) {
		this.y = t
	}
	set(t, e) {
		return (this.x = t), (this.y = e), this
	}
	setScalar(t) {
		return (this.x = t), (this.y = t), this
	}
	setX(t) {
		return (this.x = t), this
	}
	setY(t) {
		return (this.y = t), this
	}
	setComponent(t, e) {
		switch (t) {
			case 0:
				this.x = e
				break
			case 1:
				this.y = e
				break
			default:
				throw new Error("index is out of range: " + t)
		}
		return this
	}
	getComponent(t) {
		switch (t) {
			case 0:
				return this.x
			case 1:
				return this.y
			default:
				throw new Error("index is out of range: " + t)
		}
	}
	clone() {
		return new this.constructor(this.x, this.y)
	}
	copy(t) {
		return (this.x = t.x), (this.y = t.y), this
	}
	add(t) {
		return (this.x += t.x), (this.y += t.y), this
	}
	addScalar(t) {
		return (this.x += t), (this.y += t), this
	}
	addVectors(t, e) {
		return (this.x = t.x + e.x), (this.y = t.y + e.y), this
	}
	addScaledVector(t, e) {
		return (this.x += t.x * e), (this.y += t.y * e), this
	}
	sub(t) {
		return (this.x -= t.x), (this.y -= t.y), this
	}
	subScalar(t) {
		return (this.x -= t), (this.y -= t), this
	}
	subVectors(t, e) {
		return (this.x = t.x - e.x), (this.y = t.y - e.y), this
	}
	multiply(t) {
		return (this.x *= t.x), (this.y *= t.y), this
	}
	multiplyScalar(t) {
		return (this.x *= t), (this.y *= t), this
	}
	divide(t) {
		return (this.x /= t.x), (this.y /= t.y), this
	}
	divideScalar(t) {
		return this.multiplyScalar(1 / t)
	}
	applyMatrix3(t) {
		const e = this.x,
			n = this.y,
			s = t.elements
		return (
			(this.x = s[0] * e + s[3] * n + s[6]),
			(this.y = s[1] * e + s[4] * n + s[7]),
			this
		)
	}
	min(t) {
		return (
			(this.x = Math.min(this.x, t.x)), (this.y = Math.min(this.y, t.y)), this
		)
	}
	max(t) {
		return (
			(this.x = Math.max(this.x, t.x)), (this.y = Math.max(this.y, t.y)), this
		)
	}
	clamp(t, e) {
		return (
			(this.x = Ht(this.x, t.x, e.x)), (this.y = Ht(this.y, t.y, e.y)), this
		)
	}
	clampScalar(t, e) {
		return (this.x = Ht(this.x, t, e)), (this.y = Ht(this.y, t, e)), this
	}
	clampLength(t, e) {
		const n = this.length()
		return this.divideScalar(n || 1).multiplyScalar(Ht(n, t, e))
	}
	floor() {
		return (this.x = Math.floor(this.x)), (this.y = Math.floor(this.y)), this
	}
	ceil() {
		return (this.x = Math.ceil(this.x)), (this.y = Math.ceil(this.y)), this
	}
	round() {
		return (this.x = Math.round(this.x)), (this.y = Math.round(this.y)), this
	}
	roundToZero() {
		return (this.x = Math.trunc(this.x)), (this.y = Math.trunc(this.y)), this
	}
	negate() {
		return (this.x = -this.x), (this.y = -this.y), this
	}
	dot(t) {
		return this.x * t.x + this.y * t.y
	}
	cross(t) {
		return this.x * t.y - this.y * t.x
	}
	lengthSq() {
		return this.x * this.x + this.y * this.y
	}
	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y)
	}
	manhattanLength() {
		return Math.abs(this.x) + Math.abs(this.y)
	}
	normalize() {
		return this.divideScalar(this.length() || 1)
	}
	angle() {
		return Math.atan2(-this.y, -this.x) + Math.PI
	}
	angleTo(t) {
		const e = Math.sqrt(this.lengthSq() * t.lengthSq())
		if (e === 0) return Math.PI / 2
		const n = this.dot(t) / e
		return Math.acos(Ht(n, -1, 1))
	}
	distanceTo(t) {
		return Math.sqrt(this.distanceToSquared(t))
	}
	distanceToSquared(t) {
		const e = this.x - t.x,
			n = this.y - t.y
		return e * e + n * n
	}
	manhattanDistanceTo(t) {
		return Math.abs(this.x - t.x) + Math.abs(this.y - t.y)
	}
	setLength(t) {
		return this.normalize().multiplyScalar(t)
	}
	lerp(t, e) {
		return (this.x += (t.x - this.x) * e), (this.y += (t.y - this.y) * e), this
	}
	lerpVectors(t, e, n) {
		return (
			(this.x = t.x + (e.x - t.x) * n), (this.y = t.y + (e.y - t.y) * n), this
		)
	}
	equals(t) {
		return t.x === this.x && t.y === this.y
	}
	fromArray(t, e = 0) {
		return (this.x = t[e]), (this.y = t[e + 1]), this
	}
	toArray(t = [], e = 0) {
		return (t[e] = this.x), (t[e + 1] = this.y), t
	}
	fromBufferAttribute(t, e) {
		return (this.x = t.getX(e)), (this.y = t.getY(e)), this
	}
	rotateAround(t, e) {
		const n = Math.cos(e),
			s = Math.sin(e),
			r = this.x - t.x,
			o = this.y - t.y
		return (this.x = r * n - o * s + t.x), (this.y = r * s + o * n + t.y), this
	}
	random() {
		return (this.x = Math.random()), (this.y = Math.random()), this
	}
	*[Symbol.iterator]() {
		yield this.x, yield this.y
	}
}
class fn {
	constructor(t = 0, e = 0, n = 0, s = 1) {
		;(this.isQuaternion = !0),
			(this._x = t),
			(this._y = e),
			(this._z = n),
			(this._w = s)
	}
	static slerpFlat(t, e, n, s, r, o, a) {
		let h = n[s + 0],
			l = n[s + 1],
			d = n[s + 2],
			c = n[s + 3]
		const f = r[o + 0],
			m = r[o + 1],
			g = r[o + 2],
			_ = r[o + 3]
		if (a === 0) {
			;(t[e + 0] = h), (t[e + 1] = l), (t[e + 2] = d), (t[e + 3] = c)
			return
		}
		if (a === 1) {
			;(t[e + 0] = f), (t[e + 1] = m), (t[e + 2] = g), (t[e + 3] = _)
			return
		}
		if (c !== _ || h !== f || l !== m || d !== g) {
			let p = 1 - a
			const u = h * f + l * m + d * g + c * _,
				b = u >= 0 ? 1 : -1,
				T = 1 - u * u
			if (T > Number.EPSILON) {
				const C = Math.sqrt(T),
					w = Math.atan2(C, u * b)
				;(p = Math.sin(p * w) / C), (a = Math.sin(a * w) / C)
			}
			const S = a * b
			if (
				((h = h * p + f * S),
				(l = l * p + m * S),
				(d = d * p + g * S),
				(c = c * p + _ * S),
				p === 1 - a)
			) {
				const C = 1 / Math.sqrt(h * h + l * l + d * d + c * c)
				;(h *= C), (l *= C), (d *= C), (c *= C)
			}
		}
		;(t[e] = h), (t[e + 1] = l), (t[e + 2] = d), (t[e + 3] = c)
	}
	static multiplyQuaternionsFlat(t, e, n, s, r, o) {
		const a = n[s],
			h = n[s + 1],
			l = n[s + 2],
			d = n[s + 3],
			c = r[o],
			f = r[o + 1],
			m = r[o + 2],
			g = r[o + 3]
		return (
			(t[e] = a * g + d * c + h * m - l * f),
			(t[e + 1] = h * g + d * f + l * c - a * m),
			(t[e + 2] = l * g + d * m + a * f - h * c),
			(t[e + 3] = d * g - a * c - h * f - l * m),
			t
		)
	}
	get x() {
		return this._x
	}
	set x(t) {
		;(this._x = t), this._onChangeCallback()
	}
	get y() {
		return this._y
	}
	set y(t) {
		;(this._y = t), this._onChangeCallback()
	}
	get z() {
		return this._z
	}
	set z(t) {
		;(this._z = t), this._onChangeCallback()
	}
	get w() {
		return this._w
	}
	set w(t) {
		;(this._w = t), this._onChangeCallback()
	}
	set(t, e, n, s) {
		return (
			(this._x = t),
			(this._y = e),
			(this._z = n),
			(this._w = s),
			this._onChangeCallback(),
			this
		)
	}
	clone() {
		return new this.constructor(this._x, this._y, this._z, this._w)
	}
	copy(t) {
		return (
			(this._x = t.x),
			(this._y = t.y),
			(this._z = t.z),
			(this._w = t.w),
			this._onChangeCallback(),
			this
		)
	}
	setFromEuler(t, e = !0) {
		const n = t._x,
			s = t._y,
			r = t._z,
			o = t._order,
			a = Math.cos,
			h = Math.sin,
			l = a(n / 2),
			d = a(s / 2),
			c = a(r / 2),
			f = h(n / 2),
			m = h(s / 2),
			g = h(r / 2)
		switch (o) {
			case "XYZ":
				;(this._x = f * d * c + l * m * g),
					(this._y = l * m * c - f * d * g),
					(this._z = l * d * g + f * m * c),
					(this._w = l * d * c - f * m * g)
				break
			case "YXZ":
				;(this._x = f * d * c + l * m * g),
					(this._y = l * m * c - f * d * g),
					(this._z = l * d * g - f * m * c),
					(this._w = l * d * c + f * m * g)
				break
			case "ZXY":
				;(this._x = f * d * c - l * m * g),
					(this._y = l * m * c + f * d * g),
					(this._z = l * d * g + f * m * c),
					(this._w = l * d * c - f * m * g)
				break
			case "ZYX":
				;(this._x = f * d * c - l * m * g),
					(this._y = l * m * c + f * d * g),
					(this._z = l * d * g - f * m * c),
					(this._w = l * d * c + f * m * g)
				break
			case "YZX":
				;(this._x = f * d * c + l * m * g),
					(this._y = l * m * c + f * d * g),
					(this._z = l * d * g - f * m * c),
					(this._w = l * d * c - f * m * g)
				break
			case "XZY":
				;(this._x = f * d * c - l * m * g),
					(this._y = l * m * c - f * d * g),
					(this._z = l * d * g + f * m * c),
					(this._w = l * d * c + f * m * g)
				break
			default:
				console.warn(
					"THREE.Quaternion: .setFromEuler() encountered an unknown order: " + o
				)
		}
		return e === !0 && this._onChangeCallback(), this
	}
	setFromAxisAngle(t, e) {
		const n = e / 2,
			s = Math.sin(n)
		return (
			(this._x = t.x * s),
			(this._y = t.y * s),
			(this._z = t.z * s),
			(this._w = Math.cos(n)),
			this._onChangeCallback(),
			this
		)
	}
	setFromRotationMatrix(t) {
		const e = t.elements,
			n = e[0],
			s = e[4],
			r = e[8],
			o = e[1],
			a = e[5],
			h = e[9],
			l = e[2],
			d = e[6],
			c = e[10],
			f = n + a + c
		if (f > 0) {
			const m = 0.5 / Math.sqrt(f + 1)
			;(this._w = 0.25 / m),
				(this._x = (d - h) * m),
				(this._y = (r - l) * m),
				(this._z = (o - s) * m)
		} else if (n > a && n > c) {
			const m = 2 * Math.sqrt(1 + n - a - c)
			;(this._w = (d - h) / m),
				(this._x = 0.25 * m),
				(this._y = (s + o) / m),
				(this._z = (r + l) / m)
		} else if (a > c) {
			const m = 2 * Math.sqrt(1 + a - n - c)
			;(this._w = (r - l) / m),
				(this._x = (s + o) / m),
				(this._y = 0.25 * m),
				(this._z = (h + d) / m)
		} else {
			const m = 2 * Math.sqrt(1 + c - n - a)
			;(this._w = (o - s) / m),
				(this._x = (r + l) / m),
				(this._y = (h + d) / m),
				(this._z = 0.25 * m)
		}
		return this._onChangeCallback(), this
	}
	setFromUnitVectors(t, e) {
		let n = t.dot(e) + 1
		return (
			n < 1e-8
				? ((n = 0),
				  Math.abs(t.x) > Math.abs(t.z)
						? ((this._x = -t.y), (this._y = t.x), (this._z = 0), (this._w = n))
						: ((this._x = 0), (this._y = -t.z), (this._z = t.y), (this._w = n)))
				: ((this._x = t.y * e.z - t.z * e.y),
				  (this._y = t.z * e.x - t.x * e.z),
				  (this._z = t.x * e.y - t.y * e.x),
				  (this._w = n)),
			this.normalize()
		)
	}
	angleTo(t) {
		return 2 * Math.acos(Math.abs(Ht(this.dot(t), -1, 1)))
	}
	rotateTowards(t, e) {
		const n = this.angleTo(t)
		if (n === 0) return this
		const s = Math.min(1, e / n)
		return this.slerp(t, s), this
	}
	identity() {
		return this.set(0, 0, 0, 1)
	}
	invert() {
		return this.conjugate()
	}
	conjugate() {
		return (
			(this._x *= -1),
			(this._y *= -1),
			(this._z *= -1),
			this._onChangeCallback(),
			this
		)
	}
	dot(t) {
		return this._x * t._x + this._y * t._y + this._z * t._z + this._w * t._w
	}
	lengthSq() {
		return (
			this._x * this._x +
			this._y * this._y +
			this._z * this._z +
			this._w * this._w
		)
	}
	length() {
		return Math.sqrt(
			this._x * this._x +
				this._y * this._y +
				this._z * this._z +
				this._w * this._w
		)
	}
	normalize() {
		let t = this.length()
		return (
			t === 0
				? ((this._x = 0), (this._y = 0), (this._z = 0), (this._w = 1))
				: ((t = 1 / t),
				  (this._x = this._x * t),
				  (this._y = this._y * t),
				  (this._z = this._z * t),
				  (this._w = this._w * t)),
			this._onChangeCallback(),
			this
		)
	}
	multiply(t) {
		return this.multiplyQuaternions(this, t)
	}
	premultiply(t) {
		return this.multiplyQuaternions(t, this)
	}
	multiplyQuaternions(t, e) {
		const n = t._x,
			s = t._y,
			r = t._z,
			o = t._w,
			a = e._x,
			h = e._y,
			l = e._z,
			d = e._w
		return (
			(this._x = n * d + o * a + s * l - r * h),
			(this._y = s * d + o * h + r * a - n * l),
			(this._z = r * d + o * l + n * h - s * a),
			(this._w = o * d - n * a - s * h - r * l),
			this._onChangeCallback(),
			this
		)
	}
	slerp(t, e) {
		if (e === 0) return this
		if (e === 1) return this.copy(t)
		const n = this._x,
			s = this._y,
			r = this._z,
			o = this._w
		let a = o * t._w + n * t._x + s * t._y + r * t._z
		if (
			(a < 0
				? ((this._w = -t._w),
				  (this._x = -t._x),
				  (this._y = -t._y),
				  (this._z = -t._z),
				  (a = -a))
				: this.copy(t),
			a >= 1)
		)
			return (this._w = o), (this._x = n), (this._y = s), (this._z = r), this
		const h = 1 - a * a
		if (h <= Number.EPSILON) {
			const m = 1 - e
			return (
				(this._w = m * o + e * this._w),
				(this._x = m * n + e * this._x),
				(this._y = m * s + e * this._y),
				(this._z = m * r + e * this._z),
				this.normalize(),
				this
			)
		}
		const l = Math.sqrt(h),
			d = Math.atan2(l, a),
			c = Math.sin((1 - e) * d) / l,
			f = Math.sin(e * d) / l
		return (
			(this._w = o * c + this._w * f),
			(this._x = n * c + this._x * f),
			(this._y = s * c + this._y * f),
			(this._z = r * c + this._z * f),
			this._onChangeCallback(),
			this
		)
	}
	slerpQuaternions(t, e, n) {
		return this.copy(t).slerp(e, n)
	}
	random() {
		const t = 2 * Math.PI * Math.random(),
			e = 2 * Math.PI * Math.random(),
			n = Math.random(),
			s = Math.sqrt(1 - n),
			r = Math.sqrt(n)
		return this.set(
			s * Math.sin(t),
			s * Math.cos(t),
			r * Math.sin(e),
			r * Math.cos(e)
		)
	}
	equals(t) {
		return (
			t._x === this._x &&
			t._y === this._y &&
			t._z === this._z &&
			t._w === this._w
		)
	}
	fromArray(t, e = 0) {
		return (
			(this._x = t[e]),
			(this._y = t[e + 1]),
			(this._z = t[e + 2]),
			(this._w = t[e + 3]),
			this._onChangeCallback(),
			this
		)
	}
	toArray(t = [], e = 0) {
		return (
			(t[e] = this._x),
			(t[e + 1] = this._y),
			(t[e + 2] = this._z),
			(t[e + 3] = this._w),
			t
		)
	}
	fromBufferAttribute(t, e) {
		return (
			(this._x = t.getX(e)),
			(this._y = t.getY(e)),
			(this._z = t.getZ(e)),
			(this._w = t.getW(e)),
			this._onChangeCallback(),
			this
		)
	}
	toJSON() {
		return this.toArray()
	}
	_onChange(t) {
		return (this._onChangeCallback = t), this
	}
	_onChangeCallback() {}
	*[Symbol.iterator]() {
		yield this._x, yield this._y, yield this._z, yield this._w
	}
}
class U {
	constructor(t = 0, e = 0, n = 0) {
		;(U.prototype.isVector3 = !0), (this.x = t), (this.y = e), (this.z = n)
	}
	set(t, e, n) {
		return (
			n === void 0 && (n = this.z),
			(this.x = t),
			(this.y = e),
			(this.z = n),
			this
		)
	}
	setScalar(t) {
		return (this.x = t), (this.y = t), (this.z = t), this
	}
	setX(t) {
		return (this.x = t), this
	}
	setY(t) {
		return (this.y = t), this
	}
	setZ(t) {
		return (this.z = t), this
	}
	setComponent(t, e) {
		switch (t) {
			case 0:
				this.x = e
				break
			case 1:
				this.y = e
				break
			case 2:
				this.z = e
				break
			default:
				throw new Error("index is out of range: " + t)
		}
		return this
	}
	getComponent(t) {
		switch (t) {
			case 0:
				return this.x
			case 1:
				return this.y
			case 2:
				return this.z
			default:
				throw new Error("index is out of range: " + t)
		}
	}
	clone() {
		return new this.constructor(this.x, this.y, this.z)
	}
	copy(t) {
		return (this.x = t.x), (this.y = t.y), (this.z = t.z), this
	}
	add(t) {
		return (this.x += t.x), (this.y += t.y), (this.z += t.z), this
	}
	addScalar(t) {
		return (this.x += t), (this.y += t), (this.z += t), this
	}
	addVectors(t, e) {
		return (
			(this.x = t.x + e.x), (this.y = t.y + e.y), (this.z = t.z + e.z), this
		)
	}
	addScaledVector(t, e) {
		return (this.x += t.x * e), (this.y += t.y * e), (this.z += t.z * e), this
	}
	sub(t) {
		return (this.x -= t.x), (this.y -= t.y), (this.z -= t.z), this
	}
	subScalar(t) {
		return (this.x -= t), (this.y -= t), (this.z -= t), this
	}
	subVectors(t, e) {
		return (
			(this.x = t.x - e.x), (this.y = t.y - e.y), (this.z = t.z - e.z), this
		)
	}
	multiply(t) {
		return (this.x *= t.x), (this.y *= t.y), (this.z *= t.z), this
	}
	multiplyScalar(t) {
		return (this.x *= t), (this.y *= t), (this.z *= t), this
	}
	multiplyVectors(t, e) {
		return (
			(this.x = t.x * e.x), (this.y = t.y * e.y), (this.z = t.z * e.z), this
		)
	}
	applyEuler(t) {
		return this.applyQuaternion(Ra.setFromEuler(t))
	}
	applyAxisAngle(t, e) {
		return this.applyQuaternion(Ra.setFromAxisAngle(t, e))
	}
	applyMatrix3(t) {
		const e = this.x,
			n = this.y,
			s = this.z,
			r = t.elements
		return (
			(this.x = r[0] * e + r[3] * n + r[6] * s),
			(this.y = r[1] * e + r[4] * n + r[7] * s),
			(this.z = r[2] * e + r[5] * n + r[8] * s),
			this
		)
	}
	applyNormalMatrix(t) {
		return this.applyMatrix3(t).normalize()
	}
	applyMatrix4(t) {
		const e = this.x,
			n = this.y,
			s = this.z,
			r = t.elements,
			o = 1 / (r[3] * e + r[7] * n + r[11] * s + r[15])
		return (
			(this.x = (r[0] * e + r[4] * n + r[8] * s + r[12]) * o),
			(this.y = (r[1] * e + r[5] * n + r[9] * s + r[13]) * o),
			(this.z = (r[2] * e + r[6] * n + r[10] * s + r[14]) * o),
			this
		)
	}
	applyQuaternion(t) {
		const e = this.x,
			n = this.y,
			s = this.z,
			r = t.x,
			o = t.y,
			a = t.z,
			h = t.w,
			l = 2 * (o * s - a * n),
			d = 2 * (a * e - r * s),
			c = 2 * (r * n - o * e)
		return (
			(this.x = e + h * l + o * c - a * d),
			(this.y = n + h * d + a * l - r * c),
			(this.z = s + h * c + r * d - o * l),
			this
		)
	}
	project(t) {
		return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(
			t.projectionMatrix
		)
	}
	unproject(t) {
		return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(
			t.matrixWorld
		)
	}
	transformDirection(t) {
		const e = this.x,
			n = this.y,
			s = this.z,
			r = t.elements
		return (
			(this.x = r[0] * e + r[4] * n + r[8] * s),
			(this.y = r[1] * e + r[5] * n + r[9] * s),
			(this.z = r[2] * e + r[6] * n + r[10] * s),
			this.normalize()
		)
	}
	divide(t) {
		return (this.x /= t.x), (this.y /= t.y), (this.z /= t.z), this
	}
	divideScalar(t) {
		return this.multiplyScalar(1 / t)
	}
	min(t) {
		return (
			(this.x = Math.min(this.x, t.x)),
			(this.y = Math.min(this.y, t.y)),
			(this.z = Math.min(this.z, t.z)),
			this
		)
	}
	max(t) {
		return (
			(this.x = Math.max(this.x, t.x)),
			(this.y = Math.max(this.y, t.y)),
			(this.z = Math.max(this.z, t.z)),
			this
		)
	}
	clamp(t, e) {
		return (
			(this.x = Ht(this.x, t.x, e.x)),
			(this.y = Ht(this.y, t.y, e.y)),
			(this.z = Ht(this.z, t.z, e.z)),
			this
		)
	}
	clampScalar(t, e) {
		return (
			(this.x = Ht(this.x, t, e)),
			(this.y = Ht(this.y, t, e)),
			(this.z = Ht(this.z, t, e)),
			this
		)
	}
	clampLength(t, e) {
		const n = this.length()
		return this.divideScalar(n || 1).multiplyScalar(Ht(n, t, e))
	}
	floor() {
		return (
			(this.x = Math.floor(this.x)),
			(this.y = Math.floor(this.y)),
			(this.z = Math.floor(this.z)),
			this
		)
	}
	ceil() {
		return (
			(this.x = Math.ceil(this.x)),
			(this.y = Math.ceil(this.y)),
			(this.z = Math.ceil(this.z)),
			this
		)
	}
	round() {
		return (
			(this.x = Math.round(this.x)),
			(this.y = Math.round(this.y)),
			(this.z = Math.round(this.z)),
			this
		)
	}
	roundToZero() {
		return (
			(this.x = Math.trunc(this.x)),
			(this.y = Math.trunc(this.y)),
			(this.z = Math.trunc(this.z)),
			this
		)
	}
	negate() {
		return (this.x = -this.x), (this.y = -this.y), (this.z = -this.z), this
	}
	dot(t) {
		return this.x * t.x + this.y * t.y + this.z * t.z
	}
	lengthSq() {
		return this.x * this.x + this.y * this.y + this.z * this.z
	}
	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
	}
	manhattanLength() {
		return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z)
	}
	normalize() {
		return this.divideScalar(this.length() || 1)
	}
	setLength(t) {
		return this.normalize().multiplyScalar(t)
	}
	lerp(t, e) {
		return (
			(this.x += (t.x - this.x) * e),
			(this.y += (t.y - this.y) * e),
			(this.z += (t.z - this.z) * e),
			this
		)
	}
	lerpVectors(t, e, n) {
		return (
			(this.x = t.x + (e.x - t.x) * n),
			(this.y = t.y + (e.y - t.y) * n),
			(this.z = t.z + (e.z - t.z) * n),
			this
		)
	}
	cross(t) {
		return this.crossVectors(this, t)
	}
	crossVectors(t, e) {
		const n = t.x,
			s = t.y,
			r = t.z,
			o = e.x,
			a = e.y,
			h = e.z
		return (
			(this.x = s * h - r * a),
			(this.y = r * o - n * h),
			(this.z = n * a - s * o),
			this
		)
	}
	projectOnVector(t) {
		const e = t.lengthSq()
		if (e === 0) return this.set(0, 0, 0)
		const n = t.dot(this) / e
		return this.copy(t).multiplyScalar(n)
	}
	projectOnPlane(t) {
		return Ar.copy(this).projectOnVector(t), this.sub(Ar)
	}
	reflect(t) {
		return this.sub(Ar.copy(t).multiplyScalar(2 * this.dot(t)))
	}
	angleTo(t) {
		const e = Math.sqrt(this.lengthSq() * t.lengthSq())
		if (e === 0) return Math.PI / 2
		const n = this.dot(t) / e
		return Math.acos(Ht(n, -1, 1))
	}
	distanceTo(t) {
		return Math.sqrt(this.distanceToSquared(t))
	}
	distanceToSquared(t) {
		const e = this.x - t.x,
			n = this.y - t.y,
			s = this.z - t.z
		return e * e + n * n + s * s
	}
	manhattanDistanceTo(t) {
		return (
			Math.abs(this.x - t.x) + Math.abs(this.y - t.y) + Math.abs(this.z - t.z)
		)
	}
	setFromSpherical(t) {
		return this.setFromSphericalCoords(t.radius, t.phi, t.theta)
	}
	setFromSphericalCoords(t, e, n) {
		const s = Math.sin(e) * t
		return (
			(this.x = s * Math.sin(n)),
			(this.y = Math.cos(e) * t),
			(this.z = s * Math.cos(n)),
			this
		)
	}
	setFromCylindrical(t) {
		return this.setFromCylindricalCoords(t.radius, t.theta, t.y)
	}
	setFromCylindricalCoords(t, e, n) {
		return (
			(this.x = t * Math.sin(e)), (this.y = n), (this.z = t * Math.cos(e)), this
		)
	}
	setFromMatrixPosition(t) {
		const e = t.elements
		return (this.x = e[12]), (this.y = e[13]), (this.z = e[14]), this
	}
	setFromMatrixScale(t) {
		const e = this.setFromMatrixColumn(t, 0).length(),
			n = this.setFromMatrixColumn(t, 1).length(),
			s = this.setFromMatrixColumn(t, 2).length()
		return (this.x = e), (this.y = n), (this.z = s), this
	}
	setFromMatrixColumn(t, e) {
		return this.fromArray(t.elements, e * 4)
	}
	setFromMatrix3Column(t, e) {
		return this.fromArray(t.elements, e * 3)
	}
	setFromEuler(t) {
		return (this.x = t._x), (this.y = t._y), (this.z = t._z), this
	}
	setFromColor(t) {
		return (this.x = t.r), (this.y = t.g), (this.z = t.b), this
	}
	equals(t) {
		return t.x === this.x && t.y === this.y && t.z === this.z
	}
	fromArray(t, e = 0) {
		return (this.x = t[e]), (this.y = t[e + 1]), (this.z = t[e + 2]), this
	}
	toArray(t = [], e = 0) {
		return (t[e] = this.x), (t[e + 1] = this.y), (t[e + 2] = this.z), t
	}
	fromBufferAttribute(t, e) {
		return (
			(this.x = t.getX(e)), (this.y = t.getY(e)), (this.z = t.getZ(e)), this
		)
	}
	random() {
		return (
			(this.x = Math.random()),
			(this.y = Math.random()),
			(this.z = Math.random()),
			this
		)
	}
	randomDirection() {
		const t = Math.random() * Math.PI * 2,
			e = Math.random() * 2 - 1,
			n = Math.sqrt(1 - e * e)
		return (
			(this.x = n * Math.cos(t)), (this.y = e), (this.z = n * Math.sin(t)), this
		)
	}
	*[Symbol.iterator]() {
		yield this.x, yield this.y, yield this.z
	}
}
const Ar = new U(),
	Ra = new fn()
class Nt {
	constructor(t, e, n, s, r, o, a, h, l) {
		;(Nt.prototype.isMatrix3 = !0),
			(this.elements = [1, 0, 0, 0, 1, 0, 0, 0, 1]),
			t !== void 0 && this.set(t, e, n, s, r, o, a, h, l)
	}
	set(t, e, n, s, r, o, a, h, l) {
		const d = this.elements
		return (
			(d[0] = t),
			(d[1] = s),
			(d[2] = a),
			(d[3] = e),
			(d[4] = r),
			(d[5] = h),
			(d[6] = n),
			(d[7] = o),
			(d[8] = l),
			this
		)
	}
	identity() {
		return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1), this
	}
	copy(t) {
		const e = this.elements,
			n = t.elements
		return (
			(e[0] = n[0]),
			(e[1] = n[1]),
			(e[2] = n[2]),
			(e[3] = n[3]),
			(e[4] = n[4]),
			(e[5] = n[5]),
			(e[6] = n[6]),
			(e[7] = n[7]),
			(e[8] = n[8]),
			this
		)
	}
	extractBasis(t, e, n) {
		return (
			t.setFromMatrix3Column(this, 0),
			e.setFromMatrix3Column(this, 1),
			n.setFromMatrix3Column(this, 2),
			this
		)
	}
	setFromMatrix4(t) {
		const e = t.elements
		return this.set(e[0], e[4], e[8], e[1], e[5], e[9], e[2], e[6], e[10]), this
	}
	multiply(t) {
		return this.multiplyMatrices(this, t)
	}
	premultiply(t) {
		return this.multiplyMatrices(t, this)
	}
	multiplyMatrices(t, e) {
		const n = t.elements,
			s = e.elements,
			r = this.elements,
			o = n[0],
			a = n[3],
			h = n[6],
			l = n[1],
			d = n[4],
			c = n[7],
			f = n[2],
			m = n[5],
			g = n[8],
			_ = s[0],
			p = s[3],
			u = s[6],
			b = s[1],
			T = s[4],
			S = s[7],
			C = s[2],
			w = s[5],
			E = s[8]
		return (
			(r[0] = o * _ + a * b + h * C),
			(r[3] = o * p + a * T + h * w),
			(r[6] = o * u + a * S + h * E),
			(r[1] = l * _ + d * b + c * C),
			(r[4] = l * p + d * T + c * w),
			(r[7] = l * u + d * S + c * E),
			(r[2] = f * _ + m * b + g * C),
			(r[5] = f * p + m * T + g * w),
			(r[8] = f * u + m * S + g * E),
			this
		)
	}
	multiplyScalar(t) {
		const e = this.elements
		return (
			(e[0] *= t),
			(e[3] *= t),
			(e[6] *= t),
			(e[1] *= t),
			(e[4] *= t),
			(e[7] *= t),
			(e[2] *= t),
			(e[5] *= t),
			(e[8] *= t),
			this
		)
	}
	determinant() {
		const t = this.elements,
			e = t[0],
			n = t[1],
			s = t[2],
			r = t[3],
			o = t[4],
			a = t[5],
			h = t[6],
			l = t[7],
			d = t[8]
		return e * o * d - e * a * l - n * r * d + n * a * h + s * r * l - s * o * h
	}
	invert() {
		const t = this.elements,
			e = t[0],
			n = t[1],
			s = t[2],
			r = t[3],
			o = t[4],
			a = t[5],
			h = t[6],
			l = t[7],
			d = t[8],
			c = d * o - a * l,
			f = a * h - d * r,
			m = l * r - o * h,
			g = e * c + n * f + s * m
		if (g === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0)
		const _ = 1 / g
		return (
			(t[0] = c * _),
			(t[1] = (s * l - d * n) * _),
			(t[2] = (a * n - s * o) * _),
			(t[3] = f * _),
			(t[4] = (d * e - s * h) * _),
			(t[5] = (s * r - a * e) * _),
			(t[6] = m * _),
			(t[7] = (n * h - l * e) * _),
			(t[8] = (o * e - n * r) * _),
			this
		)
	}
	transpose() {
		let t
		const e = this.elements
		return (
			(t = e[1]),
			(e[1] = e[3]),
			(e[3] = t),
			(t = e[2]),
			(e[2] = e[6]),
			(e[6] = t),
			(t = e[5]),
			(e[5] = e[7]),
			(e[7] = t),
			this
		)
	}
	getNormalMatrix(t) {
		return this.setFromMatrix4(t).invert().transpose()
	}
	transposeIntoArray(t) {
		const e = this.elements
		return (
			(t[0] = e[0]),
			(t[1] = e[3]),
			(t[2] = e[6]),
			(t[3] = e[1]),
			(t[4] = e[4]),
			(t[5] = e[7]),
			(t[6] = e[2]),
			(t[7] = e[5]),
			(t[8] = e[8]),
			this
		)
	}
	setUvTransform(t, e, n, s, r, o, a) {
		const h = Math.cos(r),
			l = Math.sin(r)
		return (
			this.set(
				n * h,
				n * l,
				-n * (h * o + l * a) + o + t,
				-s * l,
				s * h,
				-s * (-l * o + h * a) + a + e,
				0,
				0,
				1
			),
			this
		)
	}
	scale(t, e) {
		return this.premultiply(wr.makeScale(t, e)), this
	}
	rotate(t) {
		return this.premultiply(wr.makeRotation(-t)), this
	}
	translate(t, e) {
		return this.premultiply(wr.makeTranslation(t, e)), this
	}
	makeTranslation(t, e) {
		return (
			t.isVector2
				? this.set(1, 0, t.x, 0, 1, t.y, 0, 0, 1)
				: this.set(1, 0, t, 0, 1, e, 0, 0, 1),
			this
		)
	}
	makeRotation(t) {
		const e = Math.cos(t),
			n = Math.sin(t)
		return this.set(e, -n, 0, n, e, 0, 0, 0, 1), this
	}
	makeScale(t, e) {
		return this.set(t, 0, 0, 0, e, 0, 0, 0, 1), this
	}
	equals(t) {
		const e = this.elements,
			n = t.elements
		for (let s = 0; s < 9; s++) if (e[s] !== n[s]) return !1
		return !0
	}
	fromArray(t, e = 0) {
		for (let n = 0; n < 9; n++) this.elements[n] = t[n + e]
		return this
	}
	toArray(t = [], e = 0) {
		const n = this.elements
		return (
			(t[e] = n[0]),
			(t[e + 1] = n[1]),
			(t[e + 2] = n[2]),
			(t[e + 3] = n[3]),
			(t[e + 4] = n[4]),
			(t[e + 5] = n[5]),
			(t[e + 6] = n[6]),
			(t[e + 7] = n[7]),
			(t[e + 8] = n[8]),
			t
		)
	}
	clone() {
		return new this.constructor().fromArray(this.elements)
	}
}
const wr = new Nt()
function Ql(i) {
	for (let t = i.length - 1; t >= 0; --t) if (i[t] >= 65535) return !0
	return !1
}
function hr(i) {
	return document.createElementNS("http://www.w3.org/1999/xhtml", i)
}
function Nh() {
	const i = hr("canvas")
	return (i.style.display = "block"), i
}
const Ca = {}
function hs(i) {
	i in Ca || ((Ca[i] = !0), console.warn(i))
}
function Fh(i, t, e) {
	return new Promise(function (n, s) {
		function r() {
			switch (i.clientWaitSync(t, i.SYNC_FLUSH_COMMANDS_BIT, 0)) {
				case i.WAIT_FAILED:
					s()
					break
				case i.TIMEOUT_EXPIRED:
					setTimeout(r, e)
					break
				default:
					n()
			}
		}
		setTimeout(r, e)
	})
}
const Pa = new Nt().set(
		0.4123908,
		0.3575843,
		0.1804808,
		0.212639,
		0.7151687,
		0.0721923,
		0.0193308,
		0.1191948,
		0.9505322
	),
	Da = new Nt().set(
		3.2409699,
		-1.5373832,
		-0.4986108,
		-0.9692436,
		1.8759675,
		0.0415551,
		0.0556301,
		-0.203977,
		1.0569715
	)
function Oh() {
	const i = {
			enabled: !0,
			workingColorSpace: Gi,
			spaces: {},
			convert: function (s, r, o) {
				return (
					this.enabled === !1 ||
						r === o ||
						!r ||
						!o ||
						(this.spaces[r].transfer === Jt &&
							((s.r = Ln(s.r)), (s.g = Ln(s.g)), (s.b = Ln(s.b))),
						this.spaces[r].primaries !== this.spaces[o].primaries &&
							(s.applyMatrix3(this.spaces[r].toXYZ),
							s.applyMatrix3(this.spaces[o].fromXYZ)),
						this.spaces[o].transfer === Jt &&
							((s.r = Bi(s.r)), (s.g = Bi(s.g)), (s.b = Bi(s.b)))),
					s
				)
			},
			workingToColorSpace: function (s, r) {
				return this.convert(s, this.workingColorSpace, r)
			},
			colorSpaceToWorking: function (s, r) {
				return this.convert(s, r, this.workingColorSpace)
			},
			getPrimaries: function (s) {
				return this.spaces[s].primaries
			},
			getTransfer: function (s) {
				return s === Hn ? lr : this.spaces[s].transfer
			},
			getToneMappingMode: function (s) {
				return (
					this.spaces[s].outputColorSpaceConfig.toneMappingMode || "standard"
				)
			},
			getLuminanceCoefficients: function (s, r = this.workingColorSpace) {
				return s.fromArray(this.spaces[r].luminanceCoefficients)
			},
			define: function (s) {
				Object.assign(this.spaces, s)
			},
			_getMatrix: function (s, r, o) {
				return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)
			},
			_getDrawingBufferColorSpace: function (s) {
				return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace
			},
			_getUnpackColorSpace: function (s = this.workingColorSpace) {
				return this.spaces[s].workingColorSpaceConfig.unpackColorSpace
			},
			fromWorkingColorSpace: function (s, r) {
				return (
					hs(
						"THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."
					),
					i.workingToColorSpace(s, r)
				)
			},
			toWorkingColorSpace: function (s, r) {
				return (
					hs(
						"THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."
					),
					i.colorSpaceToWorking(s, r)
				)
			},
		},
		t = [0.64, 0.33, 0.3, 0.6, 0.15, 0.06],
		e = [0.2126, 0.7152, 0.0722],
		n = [0.3127, 0.329]
	return (
		i.define({
			[Gi]: {
				primaries: t,
				whitePoint: n,
				transfer: lr,
				toXYZ: Pa,
				fromXYZ: Da,
				luminanceCoefficients: e,
				workingColorSpaceConfig: { unpackColorSpace: en },
				outputColorSpaceConfig: { drawingBufferColorSpace: en },
			},
			[en]: {
				primaries: t,
				whitePoint: n,
				transfer: Jt,
				toXYZ: Pa,
				fromXYZ: Da,
				luminanceCoefficients: e,
				outputColorSpaceConfig: { drawingBufferColorSpace: en },
			},
		}),
		i
	)
}
const Xt = Oh()
function Ln(i) {
	return i < 0.04045
		? i * 0.0773993808
		: Math.pow(i * 0.9478672986 + 0.0521327014, 2.4)
}
function Bi(i) {
	return i < 0.0031308 ? i * 12.92 : 1.055 * Math.pow(i, 0.41666) - 0.055
}
let xi
class Bh {
	static getDataURL(t, e = "image/png") {
		if (/^data:/i.test(t.src) || typeof HTMLCanvasElement > "u") return t.src
		let n
		if (t instanceof HTMLCanvasElement) n = t
		else {
			xi === void 0 && (xi = hr("canvas")),
				(xi.width = t.width),
				(xi.height = t.height)
			const s = xi.getContext("2d")
			t instanceof ImageData
				? s.putImageData(t, 0, 0)
				: s.drawImage(t, 0, 0, t.width, t.height),
				(n = xi)
		}
		return n.toDataURL(e)
	}
	static sRGBToLinear(t) {
		if (
			(typeof HTMLImageElement < "u" && t instanceof HTMLImageElement) ||
			(typeof HTMLCanvasElement < "u" && t instanceof HTMLCanvasElement) ||
			(typeof ImageBitmap < "u" && t instanceof ImageBitmap)
		) {
			const e = hr("canvas")
			;(e.width = t.width), (e.height = t.height)
			const n = e.getContext("2d")
			n.drawImage(t, 0, 0, t.width, t.height)
			const s = n.getImageData(0, 0, t.width, t.height),
				r = s.data
			for (let o = 0; o < r.length; o++) r[o] = Ln(r[o] / 255) * 255
			return n.putImageData(s, 0, 0), e
		} else if (t.data) {
			const e = t.data.slice(0)
			for (let n = 0; n < e.length; n++)
				e instanceof Uint8Array || e instanceof Uint8ClampedArray
					? (e[n] = Math.floor(Ln(e[n] / 255) * 255))
					: (e[n] = Ln(e[n]))
			return { data: e, width: t.width, height: t.height }
		} else
			return (
				console.warn(
					"THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."
				),
				t
			)
	}
}
let zh = 0
class ia {
	constructor(t = null) {
		;(this.isSource = !0),
			Object.defineProperty(this, "id", { value: zh++ }),
			(this.uuid = gs()),
			(this.data = t),
			(this.dataReady = !0),
			(this.version = 0)
	}
	getSize(t) {
		const e = this.data
		return (
			typeof HTMLVideoElement < "u" && e instanceof HTMLVideoElement
				? t.set(e.videoWidth, e.videoHeight, 0)
				: e instanceof VideoFrame
				? t.set(e.displayHeight, e.displayWidth, 0)
				: e !== null
				? t.set(e.width, e.height, e.depth || 0)
				: t.set(0, 0, 0),
			t
		)
	}
	set needsUpdate(t) {
		t === !0 && this.version++
	}
	toJSON(t) {
		const e = t === void 0 || typeof t == "string"
		if (!e && t.images[this.uuid] !== void 0) return t.images[this.uuid]
		const n = { uuid: this.uuid, url: "" },
			s = this.data
		if (s !== null) {
			let r
			if (Array.isArray(s)) {
				r = []
				for (let o = 0, a = s.length; o < a; o++)
					s[o].isDataTexture ? r.push(Rr(s[o].image)) : r.push(Rr(s[o]))
			} else r = Rr(s)
			n.url = r
		}
		return e || (t.images[this.uuid] = n), n
	}
}
function Rr(i) {
	return (typeof HTMLImageElement < "u" && i instanceof HTMLImageElement) ||
		(typeof HTMLCanvasElement < "u" && i instanceof HTMLCanvasElement) ||
		(typeof ImageBitmap < "u" && i instanceof ImageBitmap)
		? Bh.getDataURL(i)
		: i.data
		? {
				data: Array.from(i.data),
				width: i.width,
				height: i.height,
				type: i.data.constructor.name,
		  }
		: (console.warn("THREE.Texture: Unable to serialize Texture."), {})
}
let Hh = 0
const Cr = new U()
class Oe extends pi {
	constructor(
		t = Oe.DEFAULT_IMAGE,
		e = Oe.DEFAULT_MAPPING,
		n = Gn,
		s = Gn,
		r = rn,
		o = Vn,
		a = on,
		h = Mn,
		l = Oe.DEFAULT_ANISOTROPY,
		d = Hn
	) {
		super(),
			(this.isTexture = !0),
			Object.defineProperty(this, "id", { value: Hh++ }),
			(this.uuid = gs()),
			(this.name = ""),
			(this.source = new ia(t)),
			(this.mipmaps = []),
			(this.mapping = e),
			(this.channel = 0),
			(this.wrapS = n),
			(this.wrapT = s),
			(this.magFilter = r),
			(this.minFilter = o),
			(this.anisotropy = l),
			(this.format = a),
			(this.internalFormat = null),
			(this.type = h),
			(this.offset = new Dt(0, 0)),
			(this.repeat = new Dt(1, 1)),
			(this.center = new Dt(0, 0)),
			(this.rotation = 0),
			(this.matrixAutoUpdate = !0),
			(this.matrix = new Nt()),
			(this.generateMipmaps = !0),
			(this.premultiplyAlpha = !1),
			(this.flipY = !0),
			(this.unpackAlignment = 4),
			(this.colorSpace = d),
			(this.userData = {}),
			(this.updateRanges = []),
			(this.version = 0),
			(this.onUpdate = null),
			(this.renderTarget = null),
			(this.isRenderTargetTexture = !1),
			(this.isArrayTexture = !!(t && t.depth && t.depth > 1)),
			(this.pmremVersion = 0)
	}
	get width() {
		return this.source.getSize(Cr).x
	}
	get height() {
		return this.source.getSize(Cr).y
	}
	get depth() {
		return this.source.getSize(Cr).z
	}
	get image() {
		return this.source.data
	}
	set image(t = null) {
		this.source.data = t
	}
	updateMatrix() {
		this.matrix.setUvTransform(
			this.offset.x,
			this.offset.y,
			this.repeat.x,
			this.repeat.y,
			this.rotation,
			this.center.x,
			this.center.y
		)
	}
	addUpdateRange(t, e) {
		this.updateRanges.push({ start: t, count: e })
	}
	clearUpdateRanges() {
		this.updateRanges.length = 0
	}
	clone() {
		return new this.constructor().copy(this)
	}
	copy(t) {
		return (
			(this.name = t.name),
			(this.source = t.source),
			(this.mipmaps = t.mipmaps.slice(0)),
			(this.mapping = t.mapping),
			(this.channel = t.channel),
			(this.wrapS = t.wrapS),
			(this.wrapT = t.wrapT),
			(this.magFilter = t.magFilter),
			(this.minFilter = t.minFilter),
			(this.anisotropy = t.anisotropy),
			(this.format = t.format),
			(this.internalFormat = t.internalFormat),
			(this.type = t.type),
			this.offset.copy(t.offset),
			this.repeat.copy(t.repeat),
			this.center.copy(t.center),
			(this.rotation = t.rotation),
			(this.matrixAutoUpdate = t.matrixAutoUpdate),
			this.matrix.copy(t.matrix),
			(this.generateMipmaps = t.generateMipmaps),
			(this.premultiplyAlpha = t.premultiplyAlpha),
			(this.flipY = t.flipY),
			(this.unpackAlignment = t.unpackAlignment),
			(this.colorSpace = t.colorSpace),
			(this.renderTarget = t.renderTarget),
			(this.isRenderTargetTexture = t.isRenderTargetTexture),
			(this.isArrayTexture = t.isArrayTexture),
			(this.userData = JSON.parse(JSON.stringify(t.userData))),
			(this.needsUpdate = !0),
			this
		)
	}
	setValues(t) {
		for (const e in t) {
			const n = t[e]
			if (n === void 0) {
				console.warn(
					`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`
				)
				continue
			}
			const s = this[e]
			if (s === void 0) {
				console.warn(
					`THREE.Texture.setValues(): property '${e}' does not exist.`
				)
				continue
			}
			;(s && n && s.isVector2 && n.isVector2) ||
			(s && n && s.isVector3 && n.isVector3) ||
			(s && n && s.isMatrix3 && n.isMatrix3)
				? s.copy(n)
				: (this[e] = n)
		}
	}
	toJSON(t) {
		const e = t === void 0 || typeof t == "string"
		if (!e && t.textures[this.uuid] !== void 0) return t.textures[this.uuid]
		const n = {
			metadata: { version: 4.7, type: "Texture", generator: "Texture.toJSON" },
			uuid: this.uuid,
			name: this.name,
			image: this.source.toJSON(t).uuid,
			mapping: this.mapping,
			channel: this.channel,
			repeat: [this.repeat.x, this.repeat.y],
			offset: [this.offset.x, this.offset.y],
			center: [this.center.x, this.center.y],
			rotation: this.rotation,
			wrap: [this.wrapS, this.wrapT],
			format: this.format,
			internalFormat: this.internalFormat,
			type: this.type,
			colorSpace: this.colorSpace,
			minFilter: this.minFilter,
			magFilter: this.magFilter,
			anisotropy: this.anisotropy,
			flipY: this.flipY,
			generateMipmaps: this.generateMipmaps,
			premultiplyAlpha: this.premultiplyAlpha,
			unpackAlignment: this.unpackAlignment,
		}
		return (
			Object.keys(this.userData).length > 0 && (n.userData = this.userData),
			e || (t.textures[this.uuid] = n),
			n
		)
	}
	dispose() {
		this.dispatchEvent({ type: "dispose" })
	}
	transformUv(t) {
		if (this.mapping !== Gl) return t
		if ((t.applyMatrix3(this.matrix), t.x < 0 || t.x > 1))
			switch (this.wrapS) {
				case ar:
					t.x = t.x - Math.floor(t.x)
					break
				case Gn:
					t.x = t.x < 0 ? 0 : 1
					break
				case _o:
					Math.abs(Math.floor(t.x) % 2) === 1
						? (t.x = Math.ceil(t.x) - t.x)
						: (t.x = t.x - Math.floor(t.x))
					break
			}
		if (t.y < 0 || t.y > 1)
			switch (this.wrapT) {
				case ar:
					t.y = t.y - Math.floor(t.y)
					break
				case Gn:
					t.y = t.y < 0 ? 0 : 1
					break
				case _o:
					Math.abs(Math.floor(t.y) % 2) === 1
						? (t.y = Math.ceil(t.y) - t.y)
						: (t.y = t.y - Math.floor(t.y))
					break
			}
		return this.flipY && (t.y = 1 - t.y), t
	}
	set needsUpdate(t) {
		t === !0 && (this.version++, (this.source.needsUpdate = !0))
	}
	set needsPMREMUpdate(t) {
		t === !0 && this.pmremVersion++
	}
}
Oe.DEFAULT_IMAGE = null
Oe.DEFAULT_MAPPING = Gl
Oe.DEFAULT_ANISOTROPY = 1
class de {
	constructor(t = 0, e = 0, n = 0, s = 1) {
		;(de.prototype.isVector4 = !0),
			(this.x = t),
			(this.y = e),
			(this.z = n),
			(this.w = s)
	}
	get width() {
		return this.z
	}
	set width(t) {
		this.z = t
	}
	get height() {
		return this.w
	}
	set height(t) {
		this.w = t
	}
	set(t, e, n, s) {
		return (this.x = t), (this.y = e), (this.z = n), (this.w = s), this
	}
	setScalar(t) {
		return (this.x = t), (this.y = t), (this.z = t), (this.w = t), this
	}
	setX(t) {
		return (this.x = t), this
	}
	setY(t) {
		return (this.y = t), this
	}
	setZ(t) {
		return (this.z = t), this
	}
	setW(t) {
		return (this.w = t), this
	}
	setComponent(t, e) {
		switch (t) {
			case 0:
				this.x = e
				break
			case 1:
				this.y = e
				break
			case 2:
				this.z = e
				break
			case 3:
				this.w = e
				break
			default:
				throw new Error("index is out of range: " + t)
		}
		return this
	}
	getComponent(t) {
		switch (t) {
			case 0:
				return this.x
			case 1:
				return this.y
			case 2:
				return this.z
			case 3:
				return this.w
			default:
				throw new Error("index is out of range: " + t)
		}
	}
	clone() {
		return new this.constructor(this.x, this.y, this.z, this.w)
	}
	copy(t) {
		return (
			(this.x = t.x),
			(this.y = t.y),
			(this.z = t.z),
			(this.w = t.w !== void 0 ? t.w : 1),
			this
		)
	}
	add(t) {
		return (
			(this.x += t.x), (this.y += t.y), (this.z += t.z), (this.w += t.w), this
		)
	}
	addScalar(t) {
		return (this.x += t), (this.y += t), (this.z += t), (this.w += t), this
	}
	addVectors(t, e) {
		return (
			(this.x = t.x + e.x),
			(this.y = t.y + e.y),
			(this.z = t.z + e.z),
			(this.w = t.w + e.w),
			this
		)
	}
	addScaledVector(t, e) {
		return (
			(this.x += t.x * e),
			(this.y += t.y * e),
			(this.z += t.z * e),
			(this.w += t.w * e),
			this
		)
	}
	sub(t) {
		return (
			(this.x -= t.x), (this.y -= t.y), (this.z -= t.z), (this.w -= t.w), this
		)
	}
	subScalar(t) {
		return (this.x -= t), (this.y -= t), (this.z -= t), (this.w -= t), this
	}
	subVectors(t, e) {
		return (
			(this.x = t.x - e.x),
			(this.y = t.y - e.y),
			(this.z = t.z - e.z),
			(this.w = t.w - e.w),
			this
		)
	}
	multiply(t) {
		return (
			(this.x *= t.x), (this.y *= t.y), (this.z *= t.z), (this.w *= t.w), this
		)
	}
	multiplyScalar(t) {
		return (this.x *= t), (this.y *= t), (this.z *= t), (this.w *= t), this
	}
	applyMatrix4(t) {
		const e = this.x,
			n = this.y,
			s = this.z,
			r = this.w,
			o = t.elements
		return (
			(this.x = o[0] * e + o[4] * n + o[8] * s + o[12] * r),
			(this.y = o[1] * e + o[5] * n + o[9] * s + o[13] * r),
			(this.z = o[2] * e + o[6] * n + o[10] * s + o[14] * r),
			(this.w = o[3] * e + o[7] * n + o[11] * s + o[15] * r),
			this
		)
	}
	divide(t) {
		return (
			(this.x /= t.x), (this.y /= t.y), (this.z /= t.z), (this.w /= t.w), this
		)
	}
	divideScalar(t) {
		return this.multiplyScalar(1 / t)
	}
	setAxisAngleFromQuaternion(t) {
		this.w = 2 * Math.acos(t.w)
		const e = Math.sqrt(1 - t.w * t.w)
		return (
			e < 1e-4
				? ((this.x = 1), (this.y = 0), (this.z = 0))
				: ((this.x = t.x / e), (this.y = t.y / e), (this.z = t.z / e)),
			this
		)
	}
	setAxisAngleFromRotationMatrix(t) {
		let e, n, s, r
		const h = t.elements,
			l = h[0],
			d = h[4],
			c = h[8],
			f = h[1],
			m = h[5],
			g = h[9],
			_ = h[2],
			p = h[6],
			u = h[10]
		if (
			Math.abs(d - f) < 0.01 &&
			Math.abs(c - _) < 0.01 &&
			Math.abs(g - p) < 0.01
		) {
			if (
				Math.abs(d + f) < 0.1 &&
				Math.abs(c + _) < 0.1 &&
				Math.abs(g + p) < 0.1 &&
				Math.abs(l + m + u - 3) < 0.1
			)
				return this.set(1, 0, 0, 0), this
			e = Math.PI
			const T = (l + 1) / 2,
				S = (m + 1) / 2,
				C = (u + 1) / 2,
				w = (d + f) / 4,
				E = (c + _) / 4,
				D = (g + p) / 4
			return (
				T > S && T > C
					? T < 0.01
						? ((n = 0), (s = 0.707106781), (r = 0.707106781))
						: ((n = Math.sqrt(T)), (s = w / n), (r = E / n))
					: S > C
					? S < 0.01
						? ((n = 0.707106781), (s = 0), (r = 0.707106781))
						: ((s = Math.sqrt(S)), (n = w / s), (r = D / s))
					: C < 0.01
					? ((n = 0.707106781), (s = 0.707106781), (r = 0))
					: ((r = Math.sqrt(C)), (n = E / r), (s = D / r)),
				this.set(n, s, r, e),
				this
			)
		}
		let b = Math.sqrt((p - g) * (p - g) + (c - _) * (c - _) + (f - d) * (f - d))
		return (
			Math.abs(b) < 0.001 && (b = 1),
			(this.x = (p - g) / b),
			(this.y = (c - _) / b),
			(this.z = (f - d) / b),
			(this.w = Math.acos((l + m + u - 1) / 2)),
			this
		)
	}
	setFromMatrixPosition(t) {
		const e = t.elements
		return (
			(this.x = e[12]),
			(this.y = e[13]),
			(this.z = e[14]),
			(this.w = e[15]),
			this
		)
	}
	min(t) {
		return (
			(this.x = Math.min(this.x, t.x)),
			(this.y = Math.min(this.y, t.y)),
			(this.z = Math.min(this.z, t.z)),
			(this.w = Math.min(this.w, t.w)),
			this
		)
	}
	max(t) {
		return (
			(this.x = Math.max(this.x, t.x)),
			(this.y = Math.max(this.y, t.y)),
			(this.z = Math.max(this.z, t.z)),
			(this.w = Math.max(this.w, t.w)),
			this
		)
	}
	clamp(t, e) {
		return (
			(this.x = Ht(this.x, t.x, e.x)),
			(this.y = Ht(this.y, t.y, e.y)),
			(this.z = Ht(this.z, t.z, e.z)),
			(this.w = Ht(this.w, t.w, e.w)),
			this
		)
	}
	clampScalar(t, e) {
		return (
			(this.x = Ht(this.x, t, e)),
			(this.y = Ht(this.y, t, e)),
			(this.z = Ht(this.z, t, e)),
			(this.w = Ht(this.w, t, e)),
			this
		)
	}
	clampLength(t, e) {
		const n = this.length()
		return this.divideScalar(n || 1).multiplyScalar(Ht(n, t, e))
	}
	floor() {
		return (
			(this.x = Math.floor(this.x)),
			(this.y = Math.floor(this.y)),
			(this.z = Math.floor(this.z)),
			(this.w = Math.floor(this.w)),
			this
		)
	}
	ceil() {
		return (
			(this.x = Math.ceil(this.x)),
			(this.y = Math.ceil(this.y)),
			(this.z = Math.ceil(this.z)),
			(this.w = Math.ceil(this.w)),
			this
		)
	}
	round() {
		return (
			(this.x = Math.round(this.x)),
			(this.y = Math.round(this.y)),
			(this.z = Math.round(this.z)),
			(this.w = Math.round(this.w)),
			this
		)
	}
	roundToZero() {
		return (
			(this.x = Math.trunc(this.x)),
			(this.y = Math.trunc(this.y)),
			(this.z = Math.trunc(this.z)),
			(this.w = Math.trunc(this.w)),
			this
		)
	}
	negate() {
		return (
			(this.x = -this.x),
			(this.y = -this.y),
			(this.z = -this.z),
			(this.w = -this.w),
			this
		)
	}
	dot(t) {
		return this.x * t.x + this.y * t.y + this.z * t.z + this.w * t.w
	}
	lengthSq() {
		return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
	}
	length() {
		return Math.sqrt(
			this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
		)
	}
	manhattanLength() {
		return (
			Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w)
		)
	}
	normalize() {
		return this.divideScalar(this.length() || 1)
	}
	setLength(t) {
		return this.normalize().multiplyScalar(t)
	}
	lerp(t, e) {
		return (
			(this.x += (t.x - this.x) * e),
			(this.y += (t.y - this.y) * e),
			(this.z += (t.z - this.z) * e),
			(this.w += (t.w - this.w) * e),
			this
		)
	}
	lerpVectors(t, e, n) {
		return (
			(this.x = t.x + (e.x - t.x) * n),
			(this.y = t.y + (e.y - t.y) * n),
			(this.z = t.z + (e.z - t.z) * n),
			(this.w = t.w + (e.w - t.w) * n),
			this
		)
	}
	equals(t) {
		return t.x === this.x && t.y === this.y && t.z === this.z && t.w === this.w
	}
	fromArray(t, e = 0) {
		return (
			(this.x = t[e]),
			(this.y = t[e + 1]),
			(this.z = t[e + 2]),
			(this.w = t[e + 3]),
			this
		)
	}
	toArray(t = [], e = 0) {
		return (
			(t[e] = this.x),
			(t[e + 1] = this.y),
			(t[e + 2] = this.z),
			(t[e + 3] = this.w),
			t
		)
	}
	fromBufferAttribute(t, e) {
		return (
			(this.x = t.getX(e)),
			(this.y = t.getY(e)),
			(this.z = t.getZ(e)),
			(this.w = t.getW(e)),
			this
		)
	}
	random() {
		return (
			(this.x = Math.random()),
			(this.y = Math.random()),
			(this.z = Math.random()),
			(this.w = Math.random()),
			this
		)
	}
	*[Symbol.iterator]() {
		yield this.x, yield this.y, yield this.z, yield this.w
	}
}
class kh extends pi {
	constructor(t = 1, e = 1, n = {}) {
		super(),
			(n = Object.assign(
				{
					generateMipmaps: !1,
					internalFormat: null,
					minFilter: rn,
					depthBuffer: !0,
					stencilBuffer: !1,
					resolveDepthBuffer: !0,
					resolveStencilBuffer: !0,
					depthTexture: null,
					samples: 0,
					count: 1,
					depth: 1,
					multiview: !1,
				},
				n
			)),
			(this.isRenderTarget = !0),
			(this.width = t),
			(this.height = e),
			(this.depth = n.depth),
			(this.scissor = new de(0, 0, t, e)),
			(this.scissorTest = !1),
			(this.viewport = new de(0, 0, t, e))
		const s = { width: t, height: e, depth: n.depth },
			r = new Oe(s)
		this.textures = []
		const o = n.count
		for (let a = 0; a < o; a++)
			(this.textures[a] = r.clone()),
				(this.textures[a].isRenderTargetTexture = !0),
				(this.textures[a].renderTarget = this)
		this._setTextureOptions(n),
			(this.depthBuffer = n.depthBuffer),
			(this.stencilBuffer = n.stencilBuffer),
			(this.resolveDepthBuffer = n.resolveDepthBuffer),
			(this.resolveStencilBuffer = n.resolveStencilBuffer),
			(this._depthTexture = null),
			(this.depthTexture = n.depthTexture),
			(this.samples = n.samples),
			(this.multiview = n.multiview)
	}
	_setTextureOptions(t = {}) {
		const e = {
			minFilter: rn,
			generateMipmaps: !1,
			flipY: !1,
			internalFormat: null,
		}
		t.mapping !== void 0 && (e.mapping = t.mapping),
			t.wrapS !== void 0 && (e.wrapS = t.wrapS),
			t.wrapT !== void 0 && (e.wrapT = t.wrapT),
			t.wrapR !== void 0 && (e.wrapR = t.wrapR),
			t.magFilter !== void 0 && (e.magFilter = t.magFilter),
			t.minFilter !== void 0 && (e.minFilter = t.minFilter),
			t.format !== void 0 && (e.format = t.format),
			t.type !== void 0 && (e.type = t.type),
			t.anisotropy !== void 0 && (e.anisotropy = t.anisotropy),
			t.colorSpace !== void 0 && (e.colorSpace = t.colorSpace),
			t.flipY !== void 0 && (e.flipY = t.flipY),
			t.generateMipmaps !== void 0 && (e.generateMipmaps = t.generateMipmaps),
			t.internalFormat !== void 0 && (e.internalFormat = t.internalFormat)
		for (let n = 0; n < this.textures.length; n++) this.textures[n].setValues(e)
	}
	get texture() {
		return this.textures[0]
	}
	set texture(t) {
		this.textures[0] = t
	}
	set depthTexture(t) {
		this._depthTexture !== null && (this._depthTexture.renderTarget = null),
			t !== null && (t.renderTarget = this),
			(this._depthTexture = t)
	}
	get depthTexture() {
		return this._depthTexture
	}
	setSize(t, e, n = 1) {
		if (this.width !== t || this.height !== e || this.depth !== n) {
			;(this.width = t), (this.height = e), (this.depth = n)
			for (let s = 0, r = this.textures.length; s < r; s++)
				(this.textures[s].image.width = t),
					(this.textures[s].image.height = e),
					(this.textures[s].image.depth = n),
					(this.textures[s].isArrayTexture = this.textures[s].image.depth > 1)
			this.dispose()
		}
		this.viewport.set(0, 0, t, e), this.scissor.set(0, 0, t, e)
	}
	clone() {
		return new this.constructor().copy(this)
	}
	copy(t) {
		;(this.width = t.width),
			(this.height = t.height),
			(this.depth = t.depth),
			this.scissor.copy(t.scissor),
			(this.scissorTest = t.scissorTest),
			this.viewport.copy(t.viewport),
			(this.textures.length = 0)
		for (let e = 0, n = t.textures.length; e < n; e++) {
			;(this.textures[e] = t.textures[e].clone()),
				(this.textures[e].isRenderTargetTexture = !0),
				(this.textures[e].renderTarget = this)
			const s = Object.assign({}, t.textures[e].image)
			this.textures[e].source = new ia(s)
		}
		return (
			(this.depthBuffer = t.depthBuffer),
			(this.stencilBuffer = t.stencilBuffer),
			(this.resolveDepthBuffer = t.resolveDepthBuffer),
			(this.resolveStencilBuffer = t.resolveStencilBuffer),
			t.depthTexture !== null && (this.depthTexture = t.depthTexture.clone()),
			(this.samples = t.samples),
			this
		)
	}
	dispose() {
		this.dispatchEvent({ type: "dispose" })
	}
}
class di extends kh {
	constructor(t = 1, e = 1, n = {}) {
		super(t, e, n), (this.isWebGLRenderTarget = !0)
	}
}
class tc extends Oe {
	constructor(t = null, e = 1, n = 1, s = 1) {
		super(null),
			(this.isDataArrayTexture = !0),
			(this.image = { data: t, width: e, height: n, depth: s }),
			(this.magFilter = dn),
			(this.minFilter = dn),
			(this.wrapR = Gn),
			(this.generateMipmaps = !1),
			(this.flipY = !1),
			(this.unpackAlignment = 1),
			(this.layerUpdates = new Set())
	}
	addLayerUpdate(t) {
		this.layerUpdates.add(t)
	}
	clearLayerUpdates() {
		this.layerUpdates.clear()
	}
}
class Gh extends Oe {
	constructor(t = null, e = 1, n = 1, s = 1) {
		super(null),
			(this.isData3DTexture = !0),
			(this.image = { data: t, width: e, height: n, depth: s }),
			(this.magFilter = dn),
			(this.minFilter = dn),
			(this.wrapR = Gn),
			(this.generateMipmaps = !1),
			(this.flipY = !1),
			(this.unpackAlignment = 1)
	}
}
class Xi {
	constructor(
		t = new U(1 / 0, 1 / 0, 1 / 0),
		e = new U(-1 / 0, -1 / 0, -1 / 0)
	) {
		;(this.isBox3 = !0), (this.min = t), (this.max = e)
	}
	set(t, e) {
		return this.min.copy(t), this.max.copy(e), this
	}
	setFromArray(t) {
		this.makeEmpty()
		for (let e = 0, n = t.length; e < n; e += 3)
			this.expandByPoint(ln.fromArray(t, e))
		return this
	}
	setFromBufferAttribute(t) {
		this.makeEmpty()
		for (let e = 0, n = t.count; e < n; e++)
			this.expandByPoint(ln.fromBufferAttribute(t, e))
		return this
	}
	setFromPoints(t) {
		this.makeEmpty()
		for (let e = 0, n = t.length; e < n; e++) this.expandByPoint(t[e])
		return this
	}
	setFromCenterAndSize(t, e) {
		const n = ln.copy(e).multiplyScalar(0.5)
		return this.min.copy(t).sub(n), this.max.copy(t).add(n), this
	}
	setFromObject(t, e = !1) {
		return this.makeEmpty(), this.expandByObject(t, e)
	}
	clone() {
		return new this.constructor().copy(this)
	}
	copy(t) {
		return this.min.copy(t.min), this.max.copy(t.max), this
	}
	makeEmpty() {
		return (
			(this.min.x = this.min.y = this.min.z = 1 / 0),
			(this.max.x = this.max.y = this.max.z = -1 / 0),
			this
		)
	}
	isEmpty() {
		return (
			this.max.x < this.min.x ||
			this.max.y < this.min.y ||
			this.max.z < this.min.z
		)
	}
	getCenter(t) {
		return this.isEmpty()
			? t.set(0, 0, 0)
			: t.addVectors(this.min, this.max).multiplyScalar(0.5)
	}
	getSize(t) {
		return this.isEmpty() ? t.set(0, 0, 0) : t.subVectors(this.max, this.min)
	}
	expandByPoint(t) {
		return this.min.min(t), this.max.max(t), this
	}
	expandByVector(t) {
		return this.min.sub(t), this.max.add(t), this
	}
	expandByScalar(t) {
		return this.min.addScalar(-t), this.max.addScalar(t), this
	}
	expandByObject(t, e = !1) {
		t.updateWorldMatrix(!1, !1)
		const n = t.geometry
		if (n !== void 0) {
			const r = n.getAttribute("position")
			if (e === !0 && r !== void 0 && t.isInstancedMesh !== !0)
				for (let o = 0, a = r.count; o < a; o++)
					t.isMesh === !0
						? t.getVertexPosition(o, ln)
						: ln.fromBufferAttribute(r, o),
						ln.applyMatrix4(t.matrixWorld),
						this.expandByPoint(ln)
			else
				t.boundingBox !== void 0
					? (t.boundingBox === null && t.computeBoundingBox(),
					  bs.copy(t.boundingBox))
					: (n.boundingBox === null && n.computeBoundingBox(),
					  bs.copy(n.boundingBox)),
					bs.applyMatrix4(t.matrixWorld),
					this.union(bs)
		}
		const s = t.children
		for (let r = 0, o = s.length; r < o; r++) this.expandByObject(s[r], e)
		return this
	}
	containsPoint(t) {
		return (
			t.x >= this.min.x &&
			t.x <= this.max.x &&
			t.y >= this.min.y &&
			t.y <= this.max.y &&
			t.z >= this.min.z &&
			t.z <= this.max.z
		)
	}
	containsBox(t) {
		return (
			this.min.x <= t.min.x &&
			t.max.x <= this.max.x &&
			this.min.y <= t.min.y &&
			t.max.y <= this.max.y &&
			this.min.z <= t.min.z &&
			t.max.z <= this.max.z
		)
	}
	getParameter(t, e) {
		return e.set(
			(t.x - this.min.x) / (this.max.x - this.min.x),
			(t.y - this.min.y) / (this.max.y - this.min.y),
			(t.z - this.min.z) / (this.max.z - this.min.z)
		)
	}
	intersectsBox(t) {
		return (
			t.max.x >= this.min.x &&
			t.min.x <= this.max.x &&
			t.max.y >= this.min.y &&
			t.min.y <= this.max.y &&
			t.max.z >= this.min.z &&
			t.min.z <= this.max.z
		)
	}
	intersectsSphere(t) {
		return (
			this.clampPoint(t.center, ln),
			ln.distanceToSquared(t.center) <= t.radius * t.radius
		)
	}
	intersectsPlane(t) {
		let e, n
		return (
			t.normal.x > 0
				? ((e = t.normal.x * this.min.x), (n = t.normal.x * this.max.x))
				: ((e = t.normal.x * this.max.x), (n = t.normal.x * this.min.x)),
			t.normal.y > 0
				? ((e += t.normal.y * this.min.y), (n += t.normal.y * this.max.y))
				: ((e += t.normal.y * this.max.y), (n += t.normal.y * this.min.y)),
			t.normal.z > 0
				? ((e += t.normal.z * this.min.z), (n += t.normal.z * this.max.z))
				: ((e += t.normal.z * this.max.z), (n += t.normal.z * this.min.z)),
			e <= -t.constant && n >= -t.constant
		)
	}
	intersectsTriangle(t) {
		if (this.isEmpty()) return !1
		this.getCenter(Ki),
			Ts.subVectors(this.max, Ki),
			vi.subVectors(t.a, Ki),
			Mi.subVectors(t.b, Ki),
			yi.subVectors(t.c, Ki),
			Un.subVectors(Mi, vi),
			Nn.subVectors(yi, Mi),
			ti.subVectors(vi, yi)
		let e = [
			0,
			-Un.z,
			Un.y,
			0,
			-Nn.z,
			Nn.y,
			0,
			-ti.z,
			ti.y,
			Un.z,
			0,
			-Un.x,
			Nn.z,
			0,
			-Nn.x,
			ti.z,
			0,
			-ti.x,
			-Un.y,
			Un.x,
			0,
			-Nn.y,
			Nn.x,
			0,
			-ti.y,
			ti.x,
			0,
		]
		return !Pr(e, vi, Mi, yi, Ts) ||
			((e = [1, 0, 0, 0, 1, 0, 0, 0, 1]), !Pr(e, vi, Mi, yi, Ts))
			? !1
			: (As.crossVectors(Un, Nn),
			  (e = [As.x, As.y, As.z]),
			  Pr(e, vi, Mi, yi, Ts))
	}
	clampPoint(t, e) {
		return e.copy(t).clamp(this.min, this.max)
	}
	distanceToPoint(t) {
		return this.clampPoint(t, ln).distanceTo(t)
	}
	getBoundingSphere(t) {
		return (
			this.isEmpty()
				? t.makeEmpty()
				: (this.getCenter(t.center),
				  (t.radius = this.getSize(ln).length() * 0.5)),
			t
		)
	}
	intersect(t) {
		return (
			this.min.max(t.min),
			this.max.min(t.max),
			this.isEmpty() && this.makeEmpty(),
			this
		)
	}
	union(t) {
		return this.min.min(t.min), this.max.max(t.max), this
	}
	applyMatrix4(t) {
		return this.isEmpty()
			? this
			: (bn[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(t),
			  bn[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(t),
			  bn[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(t),
			  bn[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(t),
			  bn[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(t),
			  bn[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(t),
			  bn[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(t),
			  bn[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(t),
			  this.setFromPoints(bn),
			  this)
	}
	translate(t) {
		return this.min.add(t), this.max.add(t), this
	}
	equals(t) {
		return t.min.equals(this.min) && t.max.equals(this.max)
	}
	toJSON() {
		return { min: this.min.toArray(), max: this.max.toArray() }
	}
	fromJSON(t) {
		return this.min.fromArray(t.min), this.max.fromArray(t.max), this
	}
}
const bn = [
		new U(),
		new U(),
		new U(),
		new U(),
		new U(),
		new U(),
		new U(),
		new U(),
	],
	ln = new U(),
	bs = new Xi(),
	vi = new U(),
	Mi = new U(),
	yi = new U(),
	Un = new U(),
	Nn = new U(),
	ti = new U(),
	Ki = new U(),
	Ts = new U(),
	As = new U(),
	ei = new U()
function Pr(i, t, e, n, s) {
	for (let r = 0, o = i.length - 3; r <= o; r += 3) {
		ei.fromArray(i, r)
		const a =
				s.x * Math.abs(ei.x) + s.y * Math.abs(ei.y) + s.z * Math.abs(ei.z),
			h = t.dot(ei),
			l = e.dot(ei),
			d = n.dot(ei)
		if (Math.max(-Math.max(h, l, d), Math.min(h, l, d)) > a) return !1
	}
	return !0
}
const Vh = new Xi(),
	Zi = new U(),
	Dr = new U()
class _s {
	constructor(t = new U(), e = -1) {
		;(this.isSphere = !0), (this.center = t), (this.radius = e)
	}
	set(t, e) {
		return this.center.copy(t), (this.radius = e), this
	}
	setFromPoints(t, e) {
		const n = this.center
		e !== void 0 ? n.copy(e) : Vh.setFromPoints(t).getCenter(n)
		let s = 0
		for (let r = 0, o = t.length; r < o; r++)
			s = Math.max(s, n.distanceToSquared(t[r]))
		return (this.radius = Math.sqrt(s)), this
	}
	copy(t) {
		return this.center.copy(t.center), (this.radius = t.radius), this
	}
	isEmpty() {
		return this.radius < 0
	}
	makeEmpty() {
		return this.center.set(0, 0, 0), (this.radius = -1), this
	}
	containsPoint(t) {
		return t.distanceToSquared(this.center) <= this.radius * this.radius
	}
	distanceToPoint(t) {
		return t.distanceTo(this.center) - this.radius
	}
	intersectsSphere(t) {
		const e = this.radius + t.radius
		return t.center.distanceToSquared(this.center) <= e * e
	}
	intersectsBox(t) {
		return t.intersectsSphere(this)
	}
	intersectsPlane(t) {
		return Math.abs(t.distanceToPoint(this.center)) <= this.radius
	}
	clampPoint(t, e) {
		const n = this.center.distanceToSquared(t)
		return (
			e.copy(t),
			n > this.radius * this.radius &&
				(e.sub(this.center).normalize(),
				e.multiplyScalar(this.radius).add(this.center)),
			e
		)
	}
	getBoundingBox(t) {
		return this.isEmpty()
			? (t.makeEmpty(), t)
			: (t.set(this.center, this.center), t.expandByScalar(this.radius), t)
	}
	applyMatrix4(t) {
		return (
			this.center.applyMatrix4(t),
			(this.radius = this.radius * t.getMaxScaleOnAxis()),
			this
		)
	}
	translate(t) {
		return this.center.add(t), this
	}
	expandByPoint(t) {
		if (this.isEmpty()) return this.center.copy(t), (this.radius = 0), this
		Zi.subVectors(t, this.center)
		const e = Zi.lengthSq()
		if (e > this.radius * this.radius) {
			const n = Math.sqrt(e),
				s = (n - this.radius) * 0.5
			this.center.addScaledVector(Zi, s / n), (this.radius += s)
		}
		return this
	}
	union(t) {
		return t.isEmpty()
			? this
			: this.isEmpty()
			? (this.copy(t), this)
			: (this.center.equals(t.center) === !0
					? (this.radius = Math.max(this.radius, t.radius))
					: (Dr.subVectors(t.center, this.center).setLength(t.radius),
					  this.expandByPoint(Zi.copy(t.center).add(Dr)),
					  this.expandByPoint(Zi.copy(t.center).sub(Dr))),
			  this)
	}
	equals(t) {
		return t.center.equals(this.center) && t.radius === this.radius
	}
	clone() {
		return new this.constructor().copy(this)
	}
	toJSON() {
		return { radius: this.radius, center: this.center.toArray() }
	}
	fromJSON(t) {
		return (this.radius = t.radius), this.center.fromArray(t.center), this
	}
}
const Tn = new U(),
	Lr = new U(),
	ws = new U(),
	Fn = new U(),
	Ir = new U(),
	Rs = new U(),
	Ur = new U()
class xs {
	constructor(t = new U(), e = new U(0, 0, -1)) {
		;(this.origin = t), (this.direction = e)
	}
	set(t, e) {
		return this.origin.copy(t), this.direction.copy(e), this
	}
	copy(t) {
		return this.origin.copy(t.origin), this.direction.copy(t.direction), this
	}
	at(t, e) {
		return e.copy(this.origin).addScaledVector(this.direction, t)
	}
	lookAt(t) {
		return this.direction.copy(t).sub(this.origin).normalize(), this
	}
	recast(t) {
		return this.origin.copy(this.at(t, Tn)), this
	}
	closestPointToPoint(t, e) {
		e.subVectors(t, this.origin)
		const n = e.dot(this.direction)
		return n < 0
			? e.copy(this.origin)
			: e.copy(this.origin).addScaledVector(this.direction, n)
	}
	distanceToPoint(t) {
		return Math.sqrt(this.distanceSqToPoint(t))
	}
	distanceSqToPoint(t) {
		const e = Tn.subVectors(t, this.origin).dot(this.direction)
		return e < 0
			? this.origin.distanceToSquared(t)
			: (Tn.copy(this.origin).addScaledVector(this.direction, e),
			  Tn.distanceToSquared(t))
	}
	distanceSqToSegment(t, e, n, s) {
		Lr.copy(t).add(e).multiplyScalar(0.5),
			ws.copy(e).sub(t).normalize(),
			Fn.copy(this.origin).sub(Lr)
		const r = t.distanceTo(e) * 0.5,
			o = -this.direction.dot(ws),
			a = Fn.dot(this.direction),
			h = -Fn.dot(ws),
			l = Fn.lengthSq(),
			d = Math.abs(1 - o * o)
		let c, f, m, g
		if (d > 0)
			if (((c = o * h - a), (f = o * a - h), (g = r * d), c >= 0))
				if (f >= -g)
					if (f <= g) {
						const _ = 1 / d
						;(c *= _),
							(f *= _),
							(m = c * (c + o * f + 2 * a) + f * (o * c + f + 2 * h) + l)
					} else
						(f = r),
							(c = Math.max(0, -(o * f + a))),
							(m = -c * c + f * (f + 2 * h) + l)
				else
					(f = -r),
						(c = Math.max(0, -(o * f + a))),
						(m = -c * c + f * (f + 2 * h) + l)
			else
				f <= -g
					? ((c = Math.max(0, -(-o * r + a))),
					  (f = c > 0 ? -r : Math.min(Math.max(-r, -h), r)),
					  (m = -c * c + f * (f + 2 * h) + l))
					: f <= g
					? ((c = 0),
					  (f = Math.min(Math.max(-r, -h), r)),
					  (m = f * (f + 2 * h) + l))
					: ((c = Math.max(0, -(o * r + a))),
					  (f = c > 0 ? r : Math.min(Math.max(-r, -h), r)),
					  (m = -c * c + f * (f + 2 * h) + l))
		else
			(f = o > 0 ? -r : r),
				(c = Math.max(0, -(o * f + a))),
				(m = -c * c + f * (f + 2 * h) + l)
		return (
			n && n.copy(this.origin).addScaledVector(this.direction, c),
			s && s.copy(Lr).addScaledVector(ws, f),
			m
		)
	}
	intersectSphere(t, e) {
		Tn.subVectors(t.center, this.origin)
		const n = Tn.dot(this.direction),
			s = Tn.dot(Tn) - n * n,
			r = t.radius * t.radius
		if (s > r) return null
		const o = Math.sqrt(r - s),
			a = n - o,
			h = n + o
		return h < 0 ? null : a < 0 ? this.at(h, e) : this.at(a, e)
	}
	intersectsSphere(t) {
		return t.radius < 0
			? !1
			: this.distanceSqToPoint(t.center) <= t.radius * t.radius
	}
	distanceToPlane(t) {
		const e = t.normal.dot(this.direction)
		if (e === 0) return t.distanceToPoint(this.origin) === 0 ? 0 : null
		const n = -(this.origin.dot(t.normal) + t.constant) / e
		return n >= 0 ? n : null
	}
	intersectPlane(t, e) {
		const n = this.distanceToPlane(t)
		return n === null ? null : this.at(n, e)
	}
	intersectsPlane(t) {
		const e = t.distanceToPoint(this.origin)
		return e === 0 || t.normal.dot(this.direction) * e < 0
	}
	intersectBox(t, e) {
		let n, s, r, o, a, h
		const l = 1 / this.direction.x,
			d = 1 / this.direction.y,
			c = 1 / this.direction.z,
			f = this.origin
		return (
			l >= 0
				? ((n = (t.min.x - f.x) * l), (s = (t.max.x - f.x) * l))
				: ((n = (t.max.x - f.x) * l), (s = (t.min.x - f.x) * l)),
			d >= 0
				? ((r = (t.min.y - f.y) * d), (o = (t.max.y - f.y) * d))
				: ((r = (t.max.y - f.y) * d), (o = (t.min.y - f.y) * d)),
			n > o ||
			r > s ||
			((r > n || isNaN(n)) && (n = r),
			(o < s || isNaN(s)) && (s = o),
			c >= 0
				? ((a = (t.min.z - f.z) * c), (h = (t.max.z - f.z) * c))
				: ((a = (t.max.z - f.z) * c), (h = (t.min.z - f.z) * c)),
			n > h || a > s) ||
			((a > n || n !== n) && (n = a), (h < s || s !== s) && (s = h), s < 0)
				? null
				: this.at(n >= 0 ? n : s, e)
		)
	}
	intersectsBox(t) {
		return this.intersectBox(t, Tn) !== null
	}
	intersectTriangle(t, e, n, s, r) {
		Ir.subVectors(e, t), Rs.subVectors(n, t), Ur.crossVectors(Ir, Rs)
		let o = this.direction.dot(Ur),
			a
		if (o > 0) {
			if (s) return null
			a = 1
		} else if (o < 0) (a = -1), (o = -o)
		else return null
		Fn.subVectors(this.origin, t)
		const h = a * this.direction.dot(Rs.crossVectors(Fn, Rs))
		if (h < 0) return null
		const l = a * this.direction.dot(Ir.cross(Fn))
		if (l < 0 || h + l > o) return null
		const d = -a * Fn.dot(Ur)
		return d < 0 ? null : this.at(d / o, r)
	}
	applyMatrix4(t) {
		return (
			this.origin.applyMatrix4(t), this.direction.transformDirection(t), this
		)
	}
	equals(t) {
		return t.origin.equals(this.origin) && t.direction.equals(this.direction)
	}
	clone() {
		return new this.constructor().copy(this)
	}
}
class le {
	constructor(t, e, n, s, r, o, a, h, l, d, c, f, m, g, _, p) {
		;(le.prototype.isMatrix4 = !0),
			(this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
			t !== void 0 && this.set(t, e, n, s, r, o, a, h, l, d, c, f, m, g, _, p)
	}
	set(t, e, n, s, r, o, a, h, l, d, c, f, m, g, _, p) {
		const u = this.elements
		return (
			(u[0] = t),
			(u[4] = e),
			(u[8] = n),
			(u[12] = s),
			(u[1] = r),
			(u[5] = o),
			(u[9] = a),
			(u[13] = h),
			(u[2] = l),
			(u[6] = d),
			(u[10] = c),
			(u[14] = f),
			(u[3] = m),
			(u[7] = g),
			(u[11] = _),
			(u[15] = p),
			this
		)
	}
	identity() {
		return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this
	}
	clone() {
		return new le().fromArray(this.elements)
	}
	copy(t) {
		const e = this.elements,
			n = t.elements
		return (
			(e[0] = n[0]),
			(e[1] = n[1]),
			(e[2] = n[2]),
			(e[3] = n[3]),
			(e[4] = n[4]),
			(e[5] = n[5]),
			(e[6] = n[6]),
			(e[7] = n[7]),
			(e[8] = n[8]),
			(e[9] = n[9]),
			(e[10] = n[10]),
			(e[11] = n[11]),
			(e[12] = n[12]),
			(e[13] = n[13]),
			(e[14] = n[14]),
			(e[15] = n[15]),
			this
		)
	}
	copyPosition(t) {
		const e = this.elements,
			n = t.elements
		return (e[12] = n[12]), (e[13] = n[13]), (e[14] = n[14]), this
	}
	setFromMatrix3(t) {
		const e = t.elements
		return (
			this.set(
				e[0],
				e[3],
				e[6],
				0,
				e[1],
				e[4],
				e[7],
				0,
				e[2],
				e[5],
				e[8],
				0,
				0,
				0,
				0,
				1
			),
			this
		)
	}
	extractBasis(t, e, n) {
		return (
			t.setFromMatrixColumn(this, 0),
			e.setFromMatrixColumn(this, 1),
			n.setFromMatrixColumn(this, 2),
			this
		)
	}
	makeBasis(t, e, n) {
		return (
			this.set(
				t.x,
				e.x,
				n.x,
				0,
				t.y,
				e.y,
				n.y,
				0,
				t.z,
				e.z,
				n.z,
				0,
				0,
				0,
				0,
				1
			),
			this
		)
	}
	extractRotation(t) {
		const e = this.elements,
			n = t.elements,
			s = 1 / Si.setFromMatrixColumn(t, 0).length(),
			r = 1 / Si.setFromMatrixColumn(t, 1).length(),
			o = 1 / Si.setFromMatrixColumn(t, 2).length()
		return (
			(e[0] = n[0] * s),
			(e[1] = n[1] * s),
			(e[2] = n[2] * s),
			(e[3] = 0),
			(e[4] = n[4] * r),
			(e[5] = n[5] * r),
			(e[6] = n[6] * r),
			(e[7] = 0),
			(e[8] = n[8] * o),
			(e[9] = n[9] * o),
			(e[10] = n[10] * o),
			(e[11] = 0),
			(e[12] = 0),
			(e[13] = 0),
			(e[14] = 0),
			(e[15] = 1),
			this
		)
	}
	makeRotationFromEuler(t) {
		const e = this.elements,
			n = t.x,
			s = t.y,
			r = t.z,
			o = Math.cos(n),
			a = Math.sin(n),
			h = Math.cos(s),
			l = Math.sin(s),
			d = Math.cos(r),
			c = Math.sin(r)
		if (t.order === "XYZ") {
			const f = o * d,
				m = o * c,
				g = a * d,
				_ = a * c
			;(e[0] = h * d),
				(e[4] = -h * c),
				(e[8] = l),
				(e[1] = m + g * l),
				(e[5] = f - _ * l),
				(e[9] = -a * h),
				(e[2] = _ - f * l),
				(e[6] = g + m * l),
				(e[10] = o * h)
		} else if (t.order === "YXZ") {
			const f = h * d,
				m = h * c,
				g = l * d,
				_ = l * c
			;(e[0] = f + _ * a),
				(e[4] = g * a - m),
				(e[8] = o * l),
				(e[1] = o * c),
				(e[5] = o * d),
				(e[9] = -a),
				(e[2] = m * a - g),
				(e[6] = _ + f * a),
				(e[10] = o * h)
		} else if (t.order === "ZXY") {
			const f = h * d,
				m = h * c,
				g = l * d,
				_ = l * c
			;(e[0] = f - _ * a),
				(e[4] = -o * c),
				(e[8] = g + m * a),
				(e[1] = m + g * a),
				(e[5] = o * d),
				(e[9] = _ - f * a),
				(e[2] = -o * l),
				(e[6] = a),
				(e[10] = o * h)
		} else if (t.order === "ZYX") {
			const f = o * d,
				m = o * c,
				g = a * d,
				_ = a * c
			;(e[0] = h * d),
				(e[4] = g * l - m),
				(e[8] = f * l + _),
				(e[1] = h * c),
				(e[5] = _ * l + f),
				(e[9] = m * l - g),
				(e[2] = -l),
				(e[6] = a * h),
				(e[10] = o * h)
		} else if (t.order === "YZX") {
			const f = o * h,
				m = o * l,
				g = a * h,
				_ = a * l
			;(e[0] = h * d),
				(e[4] = _ - f * c),
				(e[8] = g * c + m),
				(e[1] = c),
				(e[5] = o * d),
				(e[9] = -a * d),
				(e[2] = -l * d),
				(e[6] = m * c + g),
				(e[10] = f - _ * c)
		} else if (t.order === "XZY") {
			const f = o * h,
				m = o * l,
				g = a * h,
				_ = a * l
			;(e[0] = h * d),
				(e[4] = -c),
				(e[8] = l * d),
				(e[1] = f * c + _),
				(e[5] = o * d),
				(e[9] = m * c - g),
				(e[2] = g * c - m),
				(e[6] = a * d),
				(e[10] = _ * c + f)
		}
		return (
			(e[3] = 0),
			(e[7] = 0),
			(e[11] = 0),
			(e[12] = 0),
			(e[13] = 0),
			(e[14] = 0),
			(e[15] = 1),
			this
		)
	}
	makeRotationFromQuaternion(t) {
		return this.compose(Wh, t, Xh)
	}
	lookAt(t, e, n) {
		const s = this.elements
		return (
			Xe.subVectors(t, e),
			Xe.lengthSq() === 0 && (Xe.z = 1),
			Xe.normalize(),
			On.crossVectors(n, Xe),
			On.lengthSq() === 0 &&
				(Math.abs(n.z) === 1 ? (Xe.x += 1e-4) : (Xe.z += 1e-4),
				Xe.normalize(),
				On.crossVectors(n, Xe)),
			On.normalize(),
			Cs.crossVectors(Xe, On),
			(s[0] = On.x),
			(s[4] = Cs.x),
			(s[8] = Xe.x),
			(s[1] = On.y),
			(s[5] = Cs.y),
			(s[9] = Xe.y),
			(s[2] = On.z),
			(s[6] = Cs.z),
			(s[10] = Xe.z),
			this
		)
	}
	multiply(t) {
		return this.multiplyMatrices(this, t)
	}
	premultiply(t) {
		return this.multiplyMatrices(t, this)
	}
	multiplyMatrices(t, e) {
		const n = t.elements,
			s = e.elements,
			r = this.elements,
			o = n[0],
			a = n[4],
			h = n[8],
			l = n[12],
			d = n[1],
			c = n[5],
			f = n[9],
			m = n[13],
			g = n[2],
			_ = n[6],
			p = n[10],
			u = n[14],
			b = n[3],
			T = n[7],
			S = n[11],
			C = n[15],
			w = s[0],
			E = s[4],
			D = s[8],
			v = s[12],
			y = s[1],
			R = s[5],
			L = s[9],
			N = s[13],
			z = s[2],
			H = s[6],
			W = s[10],
			j = s[14],
			V = s[3],
			rt = s[7],
			ht = s[11],
			Et = s[15]
		return (
			(r[0] = o * w + a * y + h * z + l * V),
			(r[4] = o * E + a * R + h * H + l * rt),
			(r[8] = o * D + a * L + h * W + l * ht),
			(r[12] = o * v + a * N + h * j + l * Et),
			(r[1] = d * w + c * y + f * z + m * V),
			(r[5] = d * E + c * R + f * H + m * rt),
			(r[9] = d * D + c * L + f * W + m * ht),
			(r[13] = d * v + c * N + f * j + m * Et),
			(r[2] = g * w + _ * y + p * z + u * V),
			(r[6] = g * E + _ * R + p * H + u * rt),
			(r[10] = g * D + _ * L + p * W + u * ht),
			(r[14] = g * v + _ * N + p * j + u * Et),
			(r[3] = b * w + T * y + S * z + C * V),
			(r[7] = b * E + T * R + S * H + C * rt),
			(r[11] = b * D + T * L + S * W + C * ht),
			(r[15] = b * v + T * N + S * j + C * Et),
			this
		)
	}
	multiplyScalar(t) {
		const e = this.elements
		return (
			(e[0] *= t),
			(e[4] *= t),
			(e[8] *= t),
			(e[12] *= t),
			(e[1] *= t),
			(e[5] *= t),
			(e[9] *= t),
			(e[13] *= t),
			(e[2] *= t),
			(e[6] *= t),
			(e[10] *= t),
			(e[14] *= t),
			(e[3] *= t),
			(e[7] *= t),
			(e[11] *= t),
			(e[15] *= t),
			this
		)
	}
	determinant() {
		const t = this.elements,
			e = t[0],
			n = t[4],
			s = t[8],
			r = t[12],
			o = t[1],
			a = t[5],
			h = t[9],
			l = t[13],
			d = t[2],
			c = t[6],
			f = t[10],
			m = t[14],
			g = t[3],
			_ = t[7],
			p = t[11],
			u = t[15]
		return (
			g *
				(+r * h * c -
					s * l * c -
					r * a * f +
					n * l * f +
					s * a * m -
					n * h * m) +
			_ *
				(+e * h * m -
					e * l * f +
					r * o * f -
					s * o * m +
					s * l * d -
					r * h * d) +
			p *
				(+e * l * c -
					e * a * m -
					r * o * c +
					n * o * m +
					r * a * d -
					n * l * d) +
			u *
				(-s * a * d - e * h * c + e * a * f + s * o * c - n * o * f + n * h * d)
		)
	}
	transpose() {
		const t = this.elements
		let e
		return (
			(e = t[1]),
			(t[1] = t[4]),
			(t[4] = e),
			(e = t[2]),
			(t[2] = t[8]),
			(t[8] = e),
			(e = t[6]),
			(t[6] = t[9]),
			(t[9] = e),
			(e = t[3]),
			(t[3] = t[12]),
			(t[12] = e),
			(e = t[7]),
			(t[7] = t[13]),
			(t[13] = e),
			(e = t[11]),
			(t[11] = t[14]),
			(t[14] = e),
			this
		)
	}
	setPosition(t, e, n) {
		const s = this.elements
		return (
			t.isVector3
				? ((s[12] = t.x), (s[13] = t.y), (s[14] = t.z))
				: ((s[12] = t), (s[13] = e), (s[14] = n)),
			this
		)
	}
	invert() {
		const t = this.elements,
			e = t[0],
			n = t[1],
			s = t[2],
			r = t[3],
			o = t[4],
			a = t[5],
			h = t[6],
			l = t[7],
			d = t[8],
			c = t[9],
			f = t[10],
			m = t[11],
			g = t[12],
			_ = t[13],
			p = t[14],
			u = t[15],
			b = c * p * l - _ * f * l + _ * h * m - a * p * m - c * h * u + a * f * u,
			T = g * f * l - d * p * l - g * h * m + o * p * m + d * h * u - o * f * u,
			S = d * _ * l - g * c * l + g * a * m - o * _ * m - d * a * u + o * c * u,
			C = g * c * h - d * _ * h - g * a * f + o * _ * f + d * a * p - o * c * p,
			w = e * b + n * T + s * S + r * C
		if (w === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
		const E = 1 / w
		return (
			(t[0] = b * E),
			(t[1] =
				(_ * f * r -
					c * p * r -
					_ * s * m +
					n * p * m +
					c * s * u -
					n * f * u) *
				E),
			(t[2] =
				(a * p * r -
					_ * h * r +
					_ * s * l -
					n * p * l -
					a * s * u +
					n * h * u) *
				E),
			(t[3] =
				(c * h * r -
					a * f * r -
					c * s * l +
					n * f * l +
					a * s * m -
					n * h * m) *
				E),
			(t[4] = T * E),
			(t[5] =
				(d * p * r -
					g * f * r +
					g * s * m -
					e * p * m -
					d * s * u +
					e * f * u) *
				E),
			(t[6] =
				(g * h * r -
					o * p * r -
					g * s * l +
					e * p * l +
					o * s * u -
					e * h * u) *
				E),
			(t[7] =
				(o * f * r -
					d * h * r +
					d * s * l -
					e * f * l -
					o * s * m +
					e * h * m) *
				E),
			(t[8] = S * E),
			(t[9] =
				(g * c * r -
					d * _ * r -
					g * n * m +
					e * _ * m +
					d * n * u -
					e * c * u) *
				E),
			(t[10] =
				(o * _ * r -
					g * a * r +
					g * n * l -
					e * _ * l -
					o * n * u +
					e * a * u) *
				E),
			(t[11] =
				(d * a * r -
					o * c * r -
					d * n * l +
					e * c * l +
					o * n * m -
					e * a * m) *
				E),
			(t[12] = C * E),
			(t[13] =
				(d * _ * s -
					g * c * s +
					g * n * f -
					e * _ * f -
					d * n * p +
					e * c * p) *
				E),
			(t[14] =
				(g * a * s -
					o * _ * s -
					g * n * h +
					e * _ * h +
					o * n * p -
					e * a * p) *
				E),
			(t[15] =
				(o * c * s -
					d * a * s +
					d * n * h -
					e * c * h -
					o * n * f +
					e * a * f) *
				E),
			this
		)
	}
	scale(t) {
		const e = this.elements,
			n = t.x,
			s = t.y,
			r = t.z
		return (
			(e[0] *= n),
			(e[4] *= s),
			(e[8] *= r),
			(e[1] *= n),
			(e[5] *= s),
			(e[9] *= r),
			(e[2] *= n),
			(e[6] *= s),
			(e[10] *= r),
			(e[3] *= n),
			(e[7] *= s),
			(e[11] *= r),
			this
		)
	}
	getMaxScaleOnAxis() {
		const t = this.elements,
			e = t[0] * t[0] + t[1] * t[1] + t[2] * t[2],
			n = t[4] * t[4] + t[5] * t[5] + t[6] * t[6],
			s = t[8] * t[8] + t[9] * t[9] + t[10] * t[10]
		return Math.sqrt(Math.max(e, n, s))
	}
	makeTranslation(t, e, n) {
		return (
			t.isVector3
				? this.set(1, 0, 0, t.x, 0, 1, 0, t.y, 0, 0, 1, t.z, 0, 0, 0, 1)
				: this.set(1, 0, 0, t, 0, 1, 0, e, 0, 0, 1, n, 0, 0, 0, 1),
			this
		)
	}
	makeRotationX(t) {
		const e = Math.cos(t),
			n = Math.sin(t)
		return this.set(1, 0, 0, 0, 0, e, -n, 0, 0, n, e, 0, 0, 0, 0, 1), this
	}
	makeRotationY(t) {
		const e = Math.cos(t),
			n = Math.sin(t)
		return this.set(e, 0, n, 0, 0, 1, 0, 0, -n, 0, e, 0, 0, 0, 0, 1), this
	}
	makeRotationZ(t) {
		const e = Math.cos(t),
			n = Math.sin(t)
		return this.set(e, -n, 0, 0, n, e, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this
	}
	makeRotationAxis(t, e) {
		const n = Math.cos(e),
			s = Math.sin(e),
			r = 1 - n,
			o = t.x,
			a = t.y,
			h = t.z,
			l = r * o,
			d = r * a
		return (
			this.set(
				l * o + n,
				l * a - s * h,
				l * h + s * a,
				0,
				l * a + s * h,
				d * a + n,
				d * h - s * o,
				0,
				l * h - s * a,
				d * h + s * o,
				r * h * h + n,
				0,
				0,
				0,
				0,
				1
			),
			this
		)
	}
	makeScale(t, e, n) {
		return this.set(t, 0, 0, 0, 0, e, 0, 0, 0, 0, n, 0, 0, 0, 0, 1), this
	}
	makeShear(t, e, n, s, r, o) {
		return this.set(1, n, r, 0, t, 1, o, 0, e, s, 1, 0, 0, 0, 0, 1), this
	}
	compose(t, e, n) {
		const s = this.elements,
			r = e._x,
			o = e._y,
			a = e._z,
			h = e._w,
			l = r + r,
			d = o + o,
			c = a + a,
			f = r * l,
			m = r * d,
			g = r * c,
			_ = o * d,
			p = o * c,
			u = a * c,
			b = h * l,
			T = h * d,
			S = h * c,
			C = n.x,
			w = n.y,
			E = n.z
		return (
			(s[0] = (1 - (_ + u)) * C),
			(s[1] = (m + S) * C),
			(s[2] = (g - T) * C),
			(s[3] = 0),
			(s[4] = (m - S) * w),
			(s[5] = (1 - (f + u)) * w),
			(s[6] = (p + b) * w),
			(s[7] = 0),
			(s[8] = (g + T) * E),
			(s[9] = (p - b) * E),
			(s[10] = (1 - (f + _)) * E),
			(s[11] = 0),
			(s[12] = t.x),
			(s[13] = t.y),
			(s[14] = t.z),
			(s[15] = 1),
			this
		)
	}
	decompose(t, e, n) {
		const s = this.elements
		let r = Si.set(s[0], s[1], s[2]).length()
		const o = Si.set(s[4], s[5], s[6]).length(),
			a = Si.set(s[8], s[9], s[10]).length()
		this.determinant() < 0 && (r = -r),
			(t.x = s[12]),
			(t.y = s[13]),
			(t.z = s[14]),
			cn.copy(this)
		const l = 1 / r,
			d = 1 / o,
			c = 1 / a
		return (
			(cn.elements[0] *= l),
			(cn.elements[1] *= l),
			(cn.elements[2] *= l),
			(cn.elements[4] *= d),
			(cn.elements[5] *= d),
			(cn.elements[6] *= d),
			(cn.elements[8] *= c),
			(cn.elements[9] *= c),
			(cn.elements[10] *= c),
			e.setFromRotationMatrix(cn),
			(n.x = r),
			(n.y = o),
			(n.z = a),
			this
		)
	}
	makePerspective(t, e, n, s, r, o, a = vn, h = !1) {
		const l = this.elements,
			d = (2 * r) / (e - t),
			c = (2 * r) / (n - s),
			f = (e + t) / (e - t),
			m = (n + s) / (n - s)
		let g, _
		if (h) (g = r / (o - r)), (_ = (o * r) / (o - r))
		else if (a === vn) (g = -(o + r) / (o - r)), (_ = (-2 * o * r) / (o - r))
		else if (a === cr) (g = -o / (o - r)), (_ = (-o * r) / (o - r))
		else
			throw new Error(
				"THREE.Matrix4.makePerspective(): Invalid coordinate system: " + a
			)
		return (
			(l[0] = d),
			(l[4] = 0),
			(l[8] = f),
			(l[12] = 0),
			(l[1] = 0),
			(l[5] = c),
			(l[9] = m),
			(l[13] = 0),
			(l[2] = 0),
			(l[6] = 0),
			(l[10] = g),
			(l[14] = _),
			(l[3] = 0),
			(l[7] = 0),
			(l[11] = -1),
			(l[15] = 0),
			this
		)
	}
	makeOrthographic(t, e, n, s, r, o, a = vn, h = !1) {
		const l = this.elements,
			d = 2 / (e - t),
			c = 2 / (n - s),
			f = -(e + t) / (e - t),
			m = -(n + s) / (n - s)
		let g, _
		if (h) (g = 1 / (o - r)), (_ = o / (o - r))
		else if (a === vn) (g = -2 / (o - r)), (_ = -(o + r) / (o - r))
		else if (a === cr) (g = -1 / (o - r)), (_ = -r / (o - r))
		else
			throw new Error(
				"THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + a
			)
		return (
			(l[0] = d),
			(l[4] = 0),
			(l[8] = 0),
			(l[12] = f),
			(l[1] = 0),
			(l[5] = c),
			(l[9] = 0),
			(l[13] = m),
			(l[2] = 0),
			(l[6] = 0),
			(l[10] = g),
			(l[14] = _),
			(l[3] = 0),
			(l[7] = 0),
			(l[11] = 0),
			(l[15] = 1),
			this
		)
	}
	equals(t) {
		const e = this.elements,
			n = t.elements
		for (let s = 0; s < 16; s++) if (e[s] !== n[s]) return !1
		return !0
	}
	fromArray(t, e = 0) {
		for (let n = 0; n < 16; n++) this.elements[n] = t[n + e]
		return this
	}
	toArray(t = [], e = 0) {
		const n = this.elements
		return (
			(t[e] = n[0]),
			(t[e + 1] = n[1]),
			(t[e + 2] = n[2]),
			(t[e + 3] = n[3]),
			(t[e + 4] = n[4]),
			(t[e + 5] = n[5]),
			(t[e + 6] = n[6]),
			(t[e + 7] = n[7]),
			(t[e + 8] = n[8]),
			(t[e + 9] = n[9]),
			(t[e + 10] = n[10]),
			(t[e + 11] = n[11]),
			(t[e + 12] = n[12]),
			(t[e + 13] = n[13]),
			(t[e + 14] = n[14]),
			(t[e + 15] = n[15]),
			t
		)
	}
}
const Si = new U(),
	cn = new le(),
	Wh = new U(0, 0, 0),
	Xh = new U(1, 1, 1),
	On = new U(),
	Cs = new U(),
	Xe = new U(),
	La = new le(),
	Ia = new fn()
class yn {
	constructor(t = 0, e = 0, n = 0, s = yn.DEFAULT_ORDER) {
		;(this.isEuler = !0),
			(this._x = t),
			(this._y = e),
			(this._z = n),
			(this._order = s)
	}
	get x() {
		return this._x
	}
	set x(t) {
		;(this._x = t), this._onChangeCallback()
	}
	get y() {
		return this._y
	}
	set y(t) {
		;(this._y = t), this._onChangeCallback()
	}
	get z() {
		return this._z
	}
	set z(t) {
		;(this._z = t), this._onChangeCallback()
	}
	get order() {
		return this._order
	}
	set order(t) {
		;(this._order = t), this._onChangeCallback()
	}
	set(t, e, n, s = this._order) {
		return (
			(this._x = t),
			(this._y = e),
			(this._z = n),
			(this._order = s),
			this._onChangeCallback(),
			this
		)
	}
	clone() {
		return new this.constructor(this._x, this._y, this._z, this._order)
	}
	copy(t) {
		return (
			(this._x = t._x),
			(this._y = t._y),
			(this._z = t._z),
			(this._order = t._order),
			this._onChangeCallback(),
			this
		)
	}
	setFromRotationMatrix(t, e = this._order, n = !0) {
		const s = t.elements,
			r = s[0],
			o = s[4],
			a = s[8],
			h = s[1],
			l = s[5],
			d = s[9],
			c = s[2],
			f = s[6],
			m = s[10]
		switch (e) {
			case "XYZ":
				;(this._y = Math.asin(Ht(a, -1, 1))),
					Math.abs(a) < 0.9999999
						? ((this._x = Math.atan2(-d, m)), (this._z = Math.atan2(-o, r)))
						: ((this._x = Math.atan2(f, l)), (this._z = 0))
				break
			case "YXZ":
				;(this._x = Math.asin(-Ht(d, -1, 1))),
					Math.abs(d) < 0.9999999
						? ((this._y = Math.atan2(a, m)), (this._z = Math.atan2(h, l)))
						: ((this._y = Math.atan2(-c, r)), (this._z = 0))
				break
			case "ZXY":
				;(this._x = Math.asin(Ht(f, -1, 1))),
					Math.abs(f) < 0.9999999
						? ((this._y = Math.atan2(-c, m)), (this._z = Math.atan2(-o, l)))
						: ((this._y = 0), (this._z = Math.atan2(h, r)))
				break
			case "ZYX":
				;(this._y = Math.asin(-Ht(c, -1, 1))),
					Math.abs(c) < 0.9999999
						? ((this._x = Math.atan2(f, m)), (this._z = Math.atan2(h, r)))
						: ((this._x = 0), (this._z = Math.atan2(-o, l)))
				break
			case "YZX":
				;(this._z = Math.asin(Ht(h, -1, 1))),
					Math.abs(h) < 0.9999999
						? ((this._x = Math.atan2(-d, l)), (this._y = Math.atan2(-c, r)))
						: ((this._x = 0), (this._y = Math.atan2(a, m)))
				break
			case "XZY":
				;(this._z = Math.asin(-Ht(o, -1, 1))),
					Math.abs(o) < 0.9999999
						? ((this._x = Math.atan2(f, l)), (this._y = Math.atan2(a, r)))
						: ((this._x = Math.atan2(-d, m)), (this._y = 0))
				break
			default:
				console.warn(
					"THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " +
						e
				)
		}
		return (this._order = e), n === !0 && this._onChangeCallback(), this
	}
	setFromQuaternion(t, e, n) {
		return (
			La.makeRotationFromQuaternion(t), this.setFromRotationMatrix(La, e, n)
		)
	}
	setFromVector3(t, e = this._order) {
		return this.set(t.x, t.y, t.z, e)
	}
	reorder(t) {
		return Ia.setFromEuler(this), this.setFromQuaternion(Ia, t)
	}
	equals(t) {
		return (
			t._x === this._x &&
			t._y === this._y &&
			t._z === this._z &&
			t._order === this._order
		)
	}
	fromArray(t) {
		return (
			(this._x = t[0]),
			(this._y = t[1]),
			(this._z = t[2]),
			t[3] !== void 0 && (this._order = t[3]),
			this._onChangeCallback(),
			this
		)
	}
	toArray(t = [], e = 0) {
		return (
			(t[e] = this._x),
			(t[e + 1] = this._y),
			(t[e + 2] = this._z),
			(t[e + 3] = this._order),
			t
		)
	}
	_onChange(t) {
		return (this._onChangeCallback = t), this
	}
	_onChangeCallback() {}
	*[Symbol.iterator]() {
		yield this._x, yield this._y, yield this._z, yield this._order
	}
}
yn.DEFAULT_ORDER = "XYZ"
class sa {
	constructor() {
		this.mask = 1
	}
	set(t) {
		this.mask = ((1 << t) | 0) >>> 0
	}
	enable(t) {
		this.mask |= (1 << t) | 0
	}
	enableAll() {
		this.mask = -1
	}
	toggle(t) {
		this.mask ^= (1 << t) | 0
	}
	disable(t) {
		this.mask &= ~((1 << t) | 0)
	}
	disableAll() {
		this.mask = 0
	}
	test(t) {
		return (this.mask & t.mask) !== 0
	}
	isEnabled(t) {
		return (this.mask & ((1 << t) | 0)) !== 0
	}
}
let Yh = 0
const Ua = new U(),
	Ei = new fn(),
	An = new le(),
	Ps = new U(),
	$i = new U(),
	qh = new U(),
	jh = new fn(),
	Na = new U(1, 0, 0),
	Fa = new U(0, 1, 0),
	Oa = new U(0, 0, 1),
	Ba = { type: "added" },
	Kh = { type: "removed" },
	bi = { type: "childadded", child: null },
	Nr = { type: "childremoved", child: null }
class Te extends pi {
	constructor() {
		super(),
			(this.isObject3D = !0),
			Object.defineProperty(this, "id", { value: Yh++ }),
			(this.uuid = gs()),
			(this.name = ""),
			(this.type = "Object3D"),
			(this.parent = null),
			(this.children = []),
			(this.up = Te.DEFAULT_UP.clone())
		const t = new U(),
			e = new yn(),
			n = new fn(),
			s = new U(1, 1, 1)
		function r() {
			n.setFromEuler(e, !1)
		}
		function o() {
			e.setFromQuaternion(n, void 0, !1)
		}
		e._onChange(r),
			n._onChange(o),
			Object.defineProperties(this, {
				position: { configurable: !0, enumerable: !0, value: t },
				rotation: { configurable: !0, enumerable: !0, value: e },
				quaternion: { configurable: !0, enumerable: !0, value: n },
				scale: { configurable: !0, enumerable: !0, value: s },
				modelViewMatrix: { value: new le() },
				normalMatrix: { value: new Nt() },
			}),
			(this.matrix = new le()),
			(this.matrixWorld = new le()),
			(this.matrixAutoUpdate = Te.DEFAULT_MATRIX_AUTO_UPDATE),
			(this.matrixWorldAutoUpdate = Te.DEFAULT_MATRIX_WORLD_AUTO_UPDATE),
			(this.matrixWorldNeedsUpdate = !1),
			(this.layers = new sa()),
			(this.visible = !0),
			(this.castShadow = !1),
			(this.receiveShadow = !1),
			(this.frustumCulled = !0),
			(this.renderOrder = 0),
			(this.animations = []),
			(this.customDepthMaterial = void 0),
			(this.customDistanceMaterial = void 0),
			(this.userData = {})
	}
	onBeforeShadow() {}
	onAfterShadow() {}
	onBeforeRender() {}
	onAfterRender() {}
	applyMatrix4(t) {
		this.matrixAutoUpdate && this.updateMatrix(),
			this.matrix.premultiply(t),
			this.matrix.decompose(this.position, this.quaternion, this.scale)
	}
	applyQuaternion(t) {
		return this.quaternion.premultiply(t), this
	}
	setRotationFromAxisAngle(t, e) {
		this.quaternion.setFromAxisAngle(t, e)
	}
	setRotationFromEuler(t) {
		this.quaternion.setFromEuler(t, !0)
	}
	setRotationFromMatrix(t) {
		this.quaternion.setFromRotationMatrix(t)
	}
	setRotationFromQuaternion(t) {
		this.quaternion.copy(t)
	}
	rotateOnAxis(t, e) {
		return Ei.setFromAxisAngle(t, e), this.quaternion.multiply(Ei), this
	}
	rotateOnWorldAxis(t, e) {
		return Ei.setFromAxisAngle(t, e), this.quaternion.premultiply(Ei), this
	}
	rotateX(t) {
		return this.rotateOnAxis(Na, t)
	}
	rotateY(t) {
		return this.rotateOnAxis(Fa, t)
	}
	rotateZ(t) {
		return this.rotateOnAxis(Oa, t)
	}
	translateOnAxis(t, e) {
		return (
			Ua.copy(t).applyQuaternion(this.quaternion),
			this.position.add(Ua.multiplyScalar(e)),
			this
		)
	}
	translateX(t) {
		return this.translateOnAxis(Na, t)
	}
	translateY(t) {
		return this.translateOnAxis(Fa, t)
	}
	translateZ(t) {
		return this.translateOnAxis(Oa, t)
	}
	localToWorld(t) {
		return this.updateWorldMatrix(!0, !1), t.applyMatrix4(this.matrixWorld)
	}
	worldToLocal(t) {
		return (
			this.updateWorldMatrix(!0, !1),
			t.applyMatrix4(An.copy(this.matrixWorld).invert())
		)
	}
	lookAt(t, e, n) {
		t.isVector3 ? Ps.copy(t) : Ps.set(t, e, n)
		const s = this.parent
		this.updateWorldMatrix(!0, !1),
			$i.setFromMatrixPosition(this.matrixWorld),
			this.isCamera || this.isLight
				? An.lookAt($i, Ps, this.up)
				: An.lookAt(Ps, $i, this.up),
			this.quaternion.setFromRotationMatrix(An),
			s &&
				(An.extractRotation(s.matrixWorld),
				Ei.setFromRotationMatrix(An),
				this.quaternion.premultiply(Ei.invert()))
	}
	add(t) {
		if (arguments.length > 1) {
			for (let e = 0; e < arguments.length; e++) this.add(arguments[e])
			return this
		}
		return t === this
			? (console.error(
					"THREE.Object3D.add: object can't be added as a child of itself.",
					t
			  ),
			  this)
			: (t && t.isObject3D
					? (t.removeFromParent(),
					  (t.parent = this),
					  this.children.push(t),
					  t.dispatchEvent(Ba),
					  (bi.child = t),
					  this.dispatchEvent(bi),
					  (bi.child = null))
					: console.error(
							"THREE.Object3D.add: object not an instance of THREE.Object3D.",
							t
					  ),
			  this)
	}
	remove(t) {
		if (arguments.length > 1) {
			for (let n = 0; n < arguments.length; n++) this.remove(arguments[n])
			return this
		}
		const e = this.children.indexOf(t)
		return (
			e !== -1 &&
				((t.parent = null),
				this.children.splice(e, 1),
				t.dispatchEvent(Kh),
				(Nr.child = t),
				this.dispatchEvent(Nr),
				(Nr.child = null)),
			this
		)
	}
	removeFromParent() {
		const t = this.parent
		return t !== null && t.remove(this), this
	}
	clear() {
		return this.remove(...this.children)
	}
	attach(t) {
		return (
			this.updateWorldMatrix(!0, !1),
			An.copy(this.matrixWorld).invert(),
			t.parent !== null &&
				(t.parent.updateWorldMatrix(!0, !1), An.multiply(t.parent.matrixWorld)),
			t.applyMatrix4(An),
			t.removeFromParent(),
			(t.parent = this),
			this.children.push(t),
			t.updateWorldMatrix(!1, !0),
			t.dispatchEvent(Ba),
			(bi.child = t),
			this.dispatchEvent(bi),
			(bi.child = null),
			this
		)
	}
	getObjectById(t) {
		return this.getObjectByProperty("id", t)
	}
	getObjectByName(t) {
		return this.getObjectByProperty("name", t)
	}
	getObjectByProperty(t, e) {
		if (this[t] === e) return this
		for (let n = 0, s = this.children.length; n < s; n++) {
			const o = this.children[n].getObjectByProperty(t, e)
			if (o !== void 0) return o
		}
	}
	getObjectsByProperty(t, e, n = []) {
		this[t] === e && n.push(this)
		const s = this.children
		for (let r = 0, o = s.length; r < o; r++) s[r].getObjectsByProperty(t, e, n)
		return n
	}
	getWorldPosition(t) {
		return (
			this.updateWorldMatrix(!0, !1), t.setFromMatrixPosition(this.matrixWorld)
		)
	}
	getWorldQuaternion(t) {
		return (
			this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose($i, t, qh), t
		)
	}
	getWorldScale(t) {
		return (
			this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose($i, jh, t), t
		)
	}
	getWorldDirection(t) {
		this.updateWorldMatrix(!0, !1)
		const e = this.matrixWorld.elements
		return t.set(e[8], e[9], e[10]).normalize()
	}
	raycast() {}
	traverse(t) {
		t(this)
		const e = this.children
		for (let n = 0, s = e.length; n < s; n++) e[n].traverse(t)
	}
	traverseVisible(t) {
		if (this.visible === !1) return
		t(this)
		const e = this.children
		for (let n = 0, s = e.length; n < s; n++) e[n].traverseVisible(t)
	}
	traverseAncestors(t) {
		const e = this.parent
		e !== null && (t(e), e.traverseAncestors(t))
	}
	updateMatrix() {
		this.matrix.compose(this.position, this.quaternion, this.scale),
			(this.matrixWorldNeedsUpdate = !0)
	}
	updateMatrixWorld(t) {
		this.matrixAutoUpdate && this.updateMatrix(),
			(this.matrixWorldNeedsUpdate || t) &&
				(this.matrixWorldAutoUpdate === !0 &&
					(this.parent === null
						? this.matrixWorld.copy(this.matrix)
						: this.matrixWorld.multiplyMatrices(
								this.parent.matrixWorld,
								this.matrix
						  )),
				(this.matrixWorldNeedsUpdate = !1),
				(t = !0))
		const e = this.children
		for (let n = 0, s = e.length; n < s; n++) e[n].updateMatrixWorld(t)
	}
	updateWorldMatrix(t, e) {
		const n = this.parent
		if (
			(t === !0 && n !== null && n.updateWorldMatrix(!0, !1),
			this.matrixAutoUpdate && this.updateMatrix(),
			this.matrixWorldAutoUpdate === !0 &&
				(this.parent === null
					? this.matrixWorld.copy(this.matrix)
					: this.matrixWorld.multiplyMatrices(
							this.parent.matrixWorld,
							this.matrix
					  )),
			e === !0)
		) {
			const s = this.children
			for (let r = 0, o = s.length; r < o; r++) s[r].updateWorldMatrix(!1, !0)
		}
	}
	toJSON(t) {
		const e = t === void 0 || typeof t == "string",
			n = {}
		e &&
			((t = {
				geometries: {},
				materials: {},
				textures: {},
				images: {},
				shapes: {},
				skeletons: {},
				animations: {},
				nodes: {},
			}),
			(n.metadata = {
				version: 4.7,
				type: "Object",
				generator: "Object3D.toJSON",
			}))
		const s = {}
		;(s.uuid = this.uuid),
			(s.type = this.type),
			this.name !== "" && (s.name = this.name),
			this.castShadow === !0 && (s.castShadow = !0),
			this.receiveShadow === !0 && (s.receiveShadow = !0),
			this.visible === !1 && (s.visible = !1),
			this.frustumCulled === !1 && (s.frustumCulled = !1),
			this.renderOrder !== 0 && (s.renderOrder = this.renderOrder),
			Object.keys(this.userData).length > 0 && (s.userData = this.userData),
			(s.layers = this.layers.mask),
			(s.matrix = this.matrix.toArray()),
			(s.up = this.up.toArray()),
			this.matrixAutoUpdate === !1 && (s.matrixAutoUpdate = !1),
			this.isInstancedMesh &&
				((s.type = "InstancedMesh"),
				(s.count = this.count),
				(s.instanceMatrix = this.instanceMatrix.toJSON()),
				this.instanceColor !== null &&
					(s.instanceColor = this.instanceColor.toJSON())),
			this.isBatchedMesh &&
				((s.type = "BatchedMesh"),
				(s.perObjectFrustumCulled = this.perObjectFrustumCulled),
				(s.sortObjects = this.sortObjects),
				(s.drawRanges = this._drawRanges),
				(s.reservedRanges = this._reservedRanges),
				(s.geometryInfo = this._geometryInfo.map((a) => ({
					...a,
					boundingBox: a.boundingBox ? a.boundingBox.toJSON() : void 0,
					boundingSphere: a.boundingSphere ? a.boundingSphere.toJSON() : void 0,
				}))),
				(s.instanceInfo = this._instanceInfo.map((a) => ({ ...a }))),
				(s.availableInstanceIds = this._availableInstanceIds.slice()),
				(s.availableGeometryIds = this._availableGeometryIds.slice()),
				(s.nextIndexStart = this._nextIndexStart),
				(s.nextVertexStart = this._nextVertexStart),
				(s.geometryCount = this._geometryCount),
				(s.maxInstanceCount = this._maxInstanceCount),
				(s.maxVertexCount = this._maxVertexCount),
				(s.maxIndexCount = this._maxIndexCount),
				(s.geometryInitialized = this._geometryInitialized),
				(s.matricesTexture = this._matricesTexture.toJSON(t)),
				(s.indirectTexture = this._indirectTexture.toJSON(t)),
				this._colorsTexture !== null &&
					(s.colorsTexture = this._colorsTexture.toJSON(t)),
				this.boundingSphere !== null &&
					(s.boundingSphere = this.boundingSphere.toJSON()),
				this.boundingBox !== null &&
					(s.boundingBox = this.boundingBox.toJSON()))
		function r(a, h) {
			return a[h.uuid] === void 0 && (a[h.uuid] = h.toJSON(t)), h.uuid
		}
		if (this.isScene)
			this.background &&
				(this.background.isColor
					? (s.background = this.background.toJSON())
					: this.background.isTexture &&
					  (s.background = this.background.toJSON(t).uuid)),
				this.environment &&
					this.environment.isTexture &&
					this.environment.isRenderTargetTexture !== !0 &&
					(s.environment = this.environment.toJSON(t).uuid)
		else if (this.isMesh || this.isLine || this.isPoints) {
			s.geometry = r(t.geometries, this.geometry)
			const a = this.geometry.parameters
			if (a !== void 0 && a.shapes !== void 0) {
				const h = a.shapes
				if (Array.isArray(h))
					for (let l = 0, d = h.length; l < d; l++) {
						const c = h[l]
						r(t.shapes, c)
					}
				else r(t.shapes, h)
			}
		}
		if (
			(this.isSkinnedMesh &&
				((s.bindMode = this.bindMode),
				(s.bindMatrix = this.bindMatrix.toArray()),
				this.skeleton !== void 0 &&
					(r(t.skeletons, this.skeleton), (s.skeleton = this.skeleton.uuid))),
			this.material !== void 0)
		)
			if (Array.isArray(this.material)) {
				const a = []
				for (let h = 0, l = this.material.length; h < l; h++)
					a.push(r(t.materials, this.material[h]))
				s.material = a
			} else s.material = r(t.materials, this.material)
		if (this.children.length > 0) {
			s.children = []
			for (let a = 0; a < this.children.length; a++)
				s.children.push(this.children[a].toJSON(t).object)
		}
		if (this.animations.length > 0) {
			s.animations = []
			for (let a = 0; a < this.animations.length; a++) {
				const h = this.animations[a]
				s.animations.push(r(t.animations, h))
			}
		}
		if (e) {
			const a = o(t.geometries),
				h = o(t.materials),
				l = o(t.textures),
				d = o(t.images),
				c = o(t.shapes),
				f = o(t.skeletons),
				m = o(t.animations),
				g = o(t.nodes)
			a.length > 0 && (n.geometries = a),
				h.length > 0 && (n.materials = h),
				l.length > 0 && (n.textures = l),
				d.length > 0 && (n.images = d),
				c.length > 0 && (n.shapes = c),
				f.length > 0 && (n.skeletons = f),
				m.length > 0 && (n.animations = m),
				g.length > 0 && (n.nodes = g)
		}
		return (n.object = s), n
		function o(a) {
			const h = []
			for (const l in a) {
				const d = a[l]
				delete d.metadata, h.push(d)
			}
			return h
		}
	}
	clone(t) {
		return new this.constructor().copy(this, t)
	}
	copy(t, e = !0) {
		if (
			((this.name = t.name),
			this.up.copy(t.up),
			this.position.copy(t.position),
			(this.rotation.order = t.rotation.order),
			this.quaternion.copy(t.quaternion),
			this.scale.copy(t.scale),
			this.matrix.copy(t.matrix),
			this.matrixWorld.copy(t.matrixWorld),
			(this.matrixAutoUpdate = t.matrixAutoUpdate),
			(this.matrixWorldAutoUpdate = t.matrixWorldAutoUpdate),
			(this.matrixWorldNeedsUpdate = t.matrixWorldNeedsUpdate),
			(this.layers.mask = t.layers.mask),
			(this.visible = t.visible),
			(this.castShadow = t.castShadow),
			(this.receiveShadow = t.receiveShadow),
			(this.frustumCulled = t.frustumCulled),
			(this.renderOrder = t.renderOrder),
			(this.animations = t.animations.slice()),
			(this.userData = JSON.parse(JSON.stringify(t.userData))),
			e === !0)
		)
			for (let n = 0; n < t.children.length; n++) {
				const s = t.children[n]
				this.add(s.clone())
			}
		return this
	}
}
Te.DEFAULT_UP = new U(0, 1, 0)
Te.DEFAULT_MATRIX_AUTO_UPDATE = !0
Te.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = !0
const hn = new U(),
	wn = new U(),
	Fr = new U(),
	Rn = new U(),
	Ti = new U(),
	Ai = new U(),
	za = new U(),
	Or = new U(),
	Br = new U(),
	zr = new U(),
	Hr = new de(),
	kr = new de(),
	Gr = new de()
class sn {
	constructor(t = new U(), e = new U(), n = new U()) {
		;(this.a = t), (this.b = e), (this.c = n)
	}
	static getNormal(t, e, n, s) {
		s.subVectors(n, e), hn.subVectors(t, e), s.cross(hn)
		const r = s.lengthSq()
		return r > 0 ? s.multiplyScalar(1 / Math.sqrt(r)) : s.set(0, 0, 0)
	}
	static getBarycoord(t, e, n, s, r) {
		hn.subVectors(s, e), wn.subVectors(n, e), Fr.subVectors(t, e)
		const o = hn.dot(hn),
			a = hn.dot(wn),
			h = hn.dot(Fr),
			l = wn.dot(wn),
			d = wn.dot(Fr),
			c = o * l - a * a
		if (c === 0) return r.set(0, 0, 0), null
		const f = 1 / c,
			m = (l * h - a * d) * f,
			g = (o * d - a * h) * f
		return r.set(1 - m - g, g, m)
	}
	static containsPoint(t, e, n, s) {
		return this.getBarycoord(t, e, n, s, Rn) === null
			? !1
			: Rn.x >= 0 && Rn.y >= 0 && Rn.x + Rn.y <= 1
	}
	static getInterpolation(t, e, n, s, r, o, a, h) {
		return this.getBarycoord(t, e, n, s, Rn) === null
			? ((h.x = 0),
			  (h.y = 0),
			  "z" in h && (h.z = 0),
			  "w" in h && (h.w = 0),
			  null)
			: (h.setScalar(0),
			  h.addScaledVector(r, Rn.x),
			  h.addScaledVector(o, Rn.y),
			  h.addScaledVector(a, Rn.z),
			  h)
	}
	static getInterpolatedAttribute(t, e, n, s, r, o) {
		return (
			Hr.setScalar(0),
			kr.setScalar(0),
			Gr.setScalar(0),
			Hr.fromBufferAttribute(t, e),
			kr.fromBufferAttribute(t, n),
			Gr.fromBufferAttribute(t, s),
			o.setScalar(0),
			o.addScaledVector(Hr, r.x),
			o.addScaledVector(kr, r.y),
			o.addScaledVector(Gr, r.z),
			o
		)
	}
	static isFrontFacing(t, e, n, s) {
		return hn.subVectors(n, e), wn.subVectors(t, e), hn.cross(wn).dot(s) < 0
	}
	set(t, e, n) {
		return this.a.copy(t), this.b.copy(e), this.c.copy(n), this
	}
	setFromPointsAndIndices(t, e, n, s) {
		return this.a.copy(t[e]), this.b.copy(t[n]), this.c.copy(t[s]), this
	}
	setFromAttributeAndIndices(t, e, n, s) {
		return (
			this.a.fromBufferAttribute(t, e),
			this.b.fromBufferAttribute(t, n),
			this.c.fromBufferAttribute(t, s),
			this
		)
	}
	clone() {
		return new this.constructor().copy(this)
	}
	copy(t) {
		return this.a.copy(t.a), this.b.copy(t.b), this.c.copy(t.c), this
	}
	getArea() {
		return (
			hn.subVectors(this.c, this.b),
			wn.subVectors(this.a, this.b),
			hn.cross(wn).length() * 0.5
		)
	}
	getMidpoint(t) {
		return t
			.addVectors(this.a, this.b)
			.add(this.c)
			.multiplyScalar(1 / 3)
	}
	getNormal(t) {
		return sn.getNormal(this.a, this.b, this.c, t)
	}
	getPlane(t) {
		return t.setFromCoplanarPoints(this.a, this.b, this.c)
	}
	getBarycoord(t, e) {
		return sn.getBarycoord(t, this.a, this.b, this.c, e)
	}
	getInterpolation(t, e, n, s, r) {
		return sn.getInterpolation(t, this.a, this.b, this.c, e, n, s, r)
	}
	containsPoint(t) {
		return sn.containsPoint(t, this.a, this.b, this.c)
	}
	isFrontFacing(t) {
		return sn.isFrontFacing(this.a, this.b, this.c, t)
	}
	intersectsBox(t) {
		return t.intersectsTriangle(this)
	}
	closestPointToPoint(t, e) {
		const n = this.a,
			s = this.b,
			r = this.c
		let o, a
		Ti.subVectors(s, n), Ai.subVectors(r, n), Or.subVectors(t, n)
		const h = Ti.dot(Or),
			l = Ai.dot(Or)
		if (h <= 0 && l <= 0) return e.copy(n)
		Br.subVectors(t, s)
		const d = Ti.dot(Br),
			c = Ai.dot(Br)
		if (d >= 0 && c <= d) return e.copy(s)
		const f = h * c - d * l
		if (f <= 0 && h >= 0 && d <= 0)
			return (o = h / (h - d)), e.copy(n).addScaledVector(Ti, o)
		zr.subVectors(t, r)
		const m = Ti.dot(zr),
			g = Ai.dot(zr)
		if (g >= 0 && m <= g) return e.copy(r)
		const _ = m * l - h * g
		if (_ <= 0 && l >= 0 && g <= 0)
			return (a = l / (l - g)), e.copy(n).addScaledVector(Ai, a)
		const p = d * g - m * c
		if (p <= 0 && c - d >= 0 && m - g >= 0)
			return (
				za.subVectors(r, s),
				(a = (c - d) / (c - d + (m - g))),
				e.copy(s).addScaledVector(za, a)
			)
		const u = 1 / (p + _ + f)
		return (
			(o = _ * u),
			(a = f * u),
			e.copy(n).addScaledVector(Ti, o).addScaledVector(Ai, a)
		)
	}
	equals(t) {
		return t.a.equals(this.a) && t.b.equals(this.b) && t.c.equals(this.c)
	}
}
const ec = {
		aliceblue: 15792383,
		antiquewhite: 16444375,
		aqua: 65535,
		aquamarine: 8388564,
		azure: 15794175,
		beige: 16119260,
		bisque: 16770244,
		black: 0,
		blanchedalmond: 16772045,
		blue: 255,
		blueviolet: 9055202,
		brown: 10824234,
		burlywood: 14596231,
		cadetblue: 6266528,
		chartreuse: 8388352,
		chocolate: 13789470,
		coral: 16744272,
		cornflowerblue: 6591981,
		cornsilk: 16775388,
		crimson: 14423100,
		cyan: 65535,
		darkblue: 139,
		darkcyan: 35723,
		darkgoldenrod: 12092939,
		darkgray: 11119017,
		darkgreen: 25600,
		darkgrey: 11119017,
		darkkhaki: 12433259,
		darkmagenta: 9109643,
		darkolivegreen: 5597999,
		darkorange: 16747520,
		darkorchid: 10040012,
		darkred: 9109504,
		darksalmon: 15308410,
		darkseagreen: 9419919,
		darkslateblue: 4734347,
		darkslategray: 3100495,
		darkslategrey: 3100495,
		darkturquoise: 52945,
		darkviolet: 9699539,
		deeppink: 16716947,
		deepskyblue: 49151,
		dimgray: 6908265,
		dimgrey: 6908265,
		dodgerblue: 2003199,
		firebrick: 11674146,
		floralwhite: 16775920,
		forestgreen: 2263842,
		fuchsia: 16711935,
		gainsboro: 14474460,
		ghostwhite: 16316671,
		gold: 16766720,
		goldenrod: 14329120,
		gray: 8421504,
		green: 32768,
		greenyellow: 11403055,
		grey: 8421504,
		honeydew: 15794160,
		hotpink: 16738740,
		indianred: 13458524,
		indigo: 4915330,
		ivory: 16777200,
		khaki: 15787660,
		lavender: 15132410,
		lavenderblush: 16773365,
		lawngreen: 8190976,
		lemonchiffon: 16775885,
		lightblue: 11393254,
		lightcoral: 15761536,
		lightcyan: 14745599,
		lightgoldenrodyellow: 16448210,
		lightgray: 13882323,
		lightgreen: 9498256,
		lightgrey: 13882323,
		lightpink: 16758465,
		lightsalmon: 16752762,
		lightseagreen: 2142890,
		lightskyblue: 8900346,
		lightslategray: 7833753,
		lightslategrey: 7833753,
		lightsteelblue: 11584734,
		lightyellow: 16777184,
		lime: 65280,
		limegreen: 3329330,
		linen: 16445670,
		magenta: 16711935,
		maroon: 8388608,
		mediumaquamarine: 6737322,
		mediumblue: 205,
		mediumorchid: 12211667,
		mediumpurple: 9662683,
		mediumseagreen: 3978097,
		mediumslateblue: 8087790,
		mediumspringgreen: 64154,
		mediumturquoise: 4772300,
		mediumvioletred: 13047173,
		midnightblue: 1644912,
		mintcream: 16121850,
		mistyrose: 16770273,
		moccasin: 16770229,
		navajowhite: 16768685,
		navy: 128,
		oldlace: 16643558,
		olive: 8421376,
		olivedrab: 7048739,
		orange: 16753920,
		orangered: 16729344,
		orchid: 14315734,
		palegoldenrod: 15657130,
		palegreen: 10025880,
		paleturquoise: 11529966,
		palevioletred: 14381203,
		papayawhip: 16773077,
		peachpuff: 16767673,
		peru: 13468991,
		pink: 16761035,
		plum: 14524637,
		powderblue: 11591910,
		purple: 8388736,
		rebeccapurple: 6697881,
		red: 16711680,
		rosybrown: 12357519,
		royalblue: 4286945,
		saddlebrown: 9127187,
		salmon: 16416882,
		sandybrown: 16032864,
		seagreen: 3050327,
		seashell: 16774638,
		sienna: 10506797,
		silver: 12632256,
		skyblue: 8900331,
		slateblue: 6970061,
		slategray: 7372944,
		slategrey: 7372944,
		snow: 16775930,
		springgreen: 65407,
		steelblue: 4620980,
		tan: 13808780,
		teal: 32896,
		thistle: 14204888,
		tomato: 16737095,
		turquoise: 4251856,
		violet: 15631086,
		wheat: 16113331,
		white: 16777215,
		whitesmoke: 16119285,
		yellow: 16776960,
		yellowgreen: 10145074,
	},
	Bn = { h: 0, s: 0, l: 0 },
	Ds = { h: 0, s: 0, l: 0 }
function Vr(i, t, e) {
	return (
		e < 0 && (e += 1),
		e > 1 && (e -= 1),
		e < 1 / 6
			? i + (t - i) * 6 * e
			: e < 1 / 2
			? t
			: e < 2 / 3
			? i + (t - i) * 6 * (2 / 3 - e)
			: i
	)
}
class Bt {
	constructor(t, e, n) {
		return (
			(this.isColor = !0),
			(this.r = 1),
			(this.g = 1),
			(this.b = 1),
			this.set(t, e, n)
		)
	}
	set(t, e, n) {
		if (e === void 0 && n === void 0) {
			const s = t
			s && s.isColor
				? this.copy(s)
				: typeof s == "number"
				? this.setHex(s)
				: typeof s == "string" && this.setStyle(s)
		} else this.setRGB(t, e, n)
		return this
	}
	setScalar(t) {
		return (this.r = t), (this.g = t), (this.b = t), this
	}
	setHex(t, e = en) {
		return (
			(t = Math.floor(t)),
			(this.r = ((t >> 16) & 255) / 255),
			(this.g = ((t >> 8) & 255) / 255),
			(this.b = (t & 255) / 255),
			Xt.colorSpaceToWorking(this, e),
			this
		)
	}
	setRGB(t, e, n, s = Xt.workingColorSpace) {
		return (
			(this.r = t),
			(this.g = e),
			(this.b = n),
			Xt.colorSpaceToWorking(this, s),
			this
		)
	}
	setHSL(t, e, n, s = Xt.workingColorSpace) {
		if (((t = Ih(t, 1)), (e = Ht(e, 0, 1)), (n = Ht(n, 0, 1)), e === 0))
			this.r = this.g = this.b = n
		else {
			const r = n <= 0.5 ? n * (1 + e) : n + e - n * e,
				o = 2 * n - r
			;(this.r = Vr(o, r, t + 1 / 3)),
				(this.g = Vr(o, r, t)),
				(this.b = Vr(o, r, t - 1 / 3))
		}
		return Xt.colorSpaceToWorking(this, s), this
	}
	setStyle(t, e = en) {
		function n(r) {
			r !== void 0 &&
				parseFloat(r) < 1 &&
				console.warn(
					"THREE.Color: Alpha component of " + t + " will be ignored."
				)
		}
		let s
		if ((s = /^(\w+)\(([^\)]*)\)/.exec(t))) {
			let r
			const o = s[1],
				a = s[2]
			switch (o) {
				case "rgb":
				case "rgba":
					if (
						(r =
							/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(
								a
							))
					)
						return (
							n(r[4]),
							this.setRGB(
								Math.min(255, parseInt(r[1], 10)) / 255,
								Math.min(255, parseInt(r[2], 10)) / 255,
								Math.min(255, parseInt(r[3], 10)) / 255,
								e
							)
						)
					if (
						(r =
							/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(
								a
							))
					)
						return (
							n(r[4]),
							this.setRGB(
								Math.min(100, parseInt(r[1], 10)) / 100,
								Math.min(100, parseInt(r[2], 10)) / 100,
								Math.min(100, parseInt(r[3], 10)) / 100,
								e
							)
						)
					break
				case "hsl":
				case "hsla":
					if (
						(r =
							/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(
								a
							))
					)
						return (
							n(r[4]),
							this.setHSL(
								parseFloat(r[1]) / 360,
								parseFloat(r[2]) / 100,
								parseFloat(r[3]) / 100,
								e
							)
						)
					break
				default:
					console.warn("THREE.Color: Unknown color model " + t)
			}
		} else if ((s = /^\#([A-Fa-f\d]+)$/.exec(t))) {
			const r = s[1],
				o = r.length
			if (o === 3)
				return this.setRGB(
					parseInt(r.charAt(0), 16) / 15,
					parseInt(r.charAt(1), 16) / 15,
					parseInt(r.charAt(2), 16) / 15,
					e
				)
			if (o === 6) return this.setHex(parseInt(r, 16), e)
			console.warn("THREE.Color: Invalid hex color " + t)
		} else if (t && t.length > 0) return this.setColorName(t, e)
		return this
	}
	setColorName(t, e = en) {
		const n = ec[t.toLowerCase()]
		return (
			n !== void 0
				? this.setHex(n, e)
				: console.warn("THREE.Color: Unknown color " + t),
			this
		)
	}
	clone() {
		return new this.constructor(this.r, this.g, this.b)
	}
	copy(t) {
		return (this.r = t.r), (this.g = t.g), (this.b = t.b), this
	}
	copySRGBToLinear(t) {
		return (this.r = Ln(t.r)), (this.g = Ln(t.g)), (this.b = Ln(t.b)), this
	}
	copyLinearToSRGB(t) {
		return (this.r = Bi(t.r)), (this.g = Bi(t.g)), (this.b = Bi(t.b)), this
	}
	convertSRGBToLinear() {
		return this.copySRGBToLinear(this), this
	}
	convertLinearToSRGB() {
		return this.copyLinearToSRGB(this), this
	}
	getHex(t = en) {
		return (
			Xt.workingToColorSpace(Ce.copy(this), t),
			Math.round(Ht(Ce.r * 255, 0, 255)) * 65536 +
				Math.round(Ht(Ce.g * 255, 0, 255)) * 256 +
				Math.round(Ht(Ce.b * 255, 0, 255))
		)
	}
	getHexString(t = en) {
		return ("000000" + this.getHex(t).toString(16)).slice(-6)
	}
	getHSL(t, e = Xt.workingColorSpace) {
		Xt.workingToColorSpace(Ce.copy(this), e)
		const n = Ce.r,
			s = Ce.g,
			r = Ce.b,
			o = Math.max(n, s, r),
			a = Math.min(n, s, r)
		let h, l
		const d = (a + o) / 2
		if (a === o) (h = 0), (l = 0)
		else {
			const c = o - a
			switch (((l = d <= 0.5 ? c / (o + a) : c / (2 - o - a)), o)) {
				case n:
					h = (s - r) / c + (s < r ? 6 : 0)
					break
				case s:
					h = (r - n) / c + 2
					break
				case r:
					h = (n - s) / c + 4
					break
			}
			h /= 6
		}
		return (t.h = h), (t.s = l), (t.l = d), t
	}
	getRGB(t, e = Xt.workingColorSpace) {
		return (
			Xt.workingToColorSpace(Ce.copy(this), e),
			(t.r = Ce.r),
			(t.g = Ce.g),
			(t.b = Ce.b),
			t
		)
	}
	getStyle(t = en) {
		Xt.workingToColorSpace(Ce.copy(this), t)
		const e = Ce.r,
			n = Ce.g,
			s = Ce.b
		return t !== en
			? `color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`
			: `rgb(${Math.round(e * 255)},${Math.round(n * 255)},${Math.round(
					s * 255
			  )})`
	}
	offsetHSL(t, e, n) {
		return this.getHSL(Bn), this.setHSL(Bn.h + t, Bn.s + e, Bn.l + n)
	}
	add(t) {
		return (this.r += t.r), (this.g += t.g), (this.b += t.b), this
	}
	addColors(t, e) {
		return (
			(this.r = t.r + e.r), (this.g = t.g + e.g), (this.b = t.b + e.b), this
		)
	}
	addScalar(t) {
		return (this.r += t), (this.g += t), (this.b += t), this
	}
	sub(t) {
		return (
			(this.r = Math.max(0, this.r - t.r)),
			(this.g = Math.max(0, this.g - t.g)),
			(this.b = Math.max(0, this.b - t.b)),
			this
		)
	}
	multiply(t) {
		return (this.r *= t.r), (this.g *= t.g), (this.b *= t.b), this
	}
	multiplyScalar(t) {
		return (this.r *= t), (this.g *= t), (this.b *= t), this
	}
	lerp(t, e) {
		return (
			(this.r += (t.r - this.r) * e),
			(this.g += (t.g - this.g) * e),
			(this.b += (t.b - this.b) * e),
			this
		)
	}
	lerpColors(t, e, n) {
		return (
			(this.r = t.r + (e.r - t.r) * n),
			(this.g = t.g + (e.g - t.g) * n),
			(this.b = t.b + (e.b - t.b) * n),
			this
		)
	}
	lerpHSL(t, e) {
		this.getHSL(Bn), t.getHSL(Ds)
		const n = Tr(Bn.h, Ds.h, e),
			s = Tr(Bn.s, Ds.s, e),
			r = Tr(Bn.l, Ds.l, e)
		return this.setHSL(n, s, r), this
	}
	setFromVector3(t) {
		return (this.r = t.x), (this.g = t.y), (this.b = t.z), this
	}
	applyMatrix3(t) {
		const e = this.r,
			n = this.g,
			s = this.b,
			r = t.elements
		return (
			(this.r = r[0] * e + r[3] * n + r[6] * s),
			(this.g = r[1] * e + r[4] * n + r[7] * s),
			(this.b = r[2] * e + r[5] * n + r[8] * s),
			this
		)
	}
	equals(t) {
		return t.r === this.r && t.g === this.g && t.b === this.b
	}
	fromArray(t, e = 0) {
		return (this.r = t[e]), (this.g = t[e + 1]), (this.b = t[e + 2]), this
	}
	toArray(t = [], e = 0) {
		return (t[e] = this.r), (t[e + 1] = this.g), (t[e + 2] = this.b), t
	}
	fromBufferAttribute(t, e) {
		return (
			(this.r = t.getX(e)), (this.g = t.getY(e)), (this.b = t.getZ(e)), this
		)
	}
	toJSON() {
		return this.getHex()
	}
	*[Symbol.iterator]() {
		yield this.r, yield this.g, yield this.b
	}
}
const Ce = new Bt()
Bt.NAMES = ec
let Zh = 0
class mi extends pi {
	constructor() {
		super(),
			(this.isMaterial = !0),
			Object.defineProperty(this, "id", { value: Zh++ }),
			(this.uuid = gs()),
			(this.name = ""),
			(this.type = "Material"),
			(this.blending = Oi),
			(this.side = Zn),
			(this.vertexColors = !1),
			(this.opacity = 1),
			(this.transparent = !1),
			(this.alphaHash = !1),
			(this.blendSrc = ro),
			(this.blendDst = oo),
			(this.blendEquation = ai),
			(this.blendSrcAlpha = null),
			(this.blendDstAlpha = null),
			(this.blendEquationAlpha = null),
			(this.blendColor = new Bt(0, 0, 0)),
			(this.blendAlpha = 0),
			(this.depthFunc = zi),
			(this.depthTest = !0),
			(this.depthWrite = !0),
			(this.stencilWriteMask = 255),
			(this.stencilFunc = Ta),
			(this.stencilRef = 0),
			(this.stencilFuncMask = 255),
			(this.stencilFail = _i),
			(this.stencilZFail = _i),
			(this.stencilZPass = _i),
			(this.stencilWrite = !1),
			(this.clippingPlanes = null),
			(this.clipIntersection = !1),
			(this.clipShadows = !1),
			(this.shadowSide = null),
			(this.colorWrite = !0),
			(this.precision = null),
			(this.polygonOffset = !1),
			(this.polygonOffsetFactor = 0),
			(this.polygonOffsetUnits = 0),
			(this.dithering = !1),
			(this.alphaToCoverage = !1),
			(this.premultipliedAlpha = !1),
			(this.forceSinglePass = !1),
			(this.allowOverride = !0),
			(this.visible = !0),
			(this.toneMapped = !0),
			(this.userData = {}),
			(this.version = 0),
			(this._alphaTest = 0)
	}
	get alphaTest() {
		return this._alphaTest
	}
	set alphaTest(t) {
		this._alphaTest > 0 != t > 0 && this.version++, (this._alphaTest = t)
	}
	onBeforeRender() {}
	onBeforeCompile() {}
	customProgramCacheKey() {
		return this.onBeforeCompile.toString()
	}
	setValues(t) {
		if (t !== void 0)
			for (const e in t) {
				const n = t[e]
				if (n === void 0) {
					console.warn(
						`THREE.Material: parameter '${e}' has value of undefined.`
					)
					continue
				}
				const s = this[e]
				if (s === void 0) {
					console.warn(
						`THREE.Material: '${e}' is not a property of THREE.${this.type}.`
					)
					continue
				}
				s && s.isColor
					? s.set(n)
					: s && s.isVector3 && n && n.isVector3
					? s.copy(n)
					: (this[e] = n)
			}
	}
	toJSON(t) {
		const e = t === void 0 || typeof t == "string"
		e && (t = { textures: {}, images: {} })
		const n = {
			metadata: {
				version: 4.7,
				type: "Material",
				generator: "Material.toJSON",
			},
		}
		;(n.uuid = this.uuid),
			(n.type = this.type),
			this.name !== "" && (n.name = this.name),
			this.color && this.color.isColor && (n.color = this.color.getHex()),
			this.roughness !== void 0 && (n.roughness = this.roughness),
			this.metalness !== void 0 && (n.metalness = this.metalness),
			this.sheen !== void 0 && (n.sheen = this.sheen),
			this.sheenColor &&
				this.sheenColor.isColor &&
				(n.sheenColor = this.sheenColor.getHex()),
			this.sheenRoughness !== void 0 &&
				(n.sheenRoughness = this.sheenRoughness),
			this.emissive &&
				this.emissive.isColor &&
				(n.emissive = this.emissive.getHex()),
			this.emissiveIntensity !== void 0 &&
				this.emissiveIntensity !== 1 &&
				(n.emissiveIntensity = this.emissiveIntensity),
			this.specular &&
				this.specular.isColor &&
				(n.specular = this.specular.getHex()),
			this.specularIntensity !== void 0 &&
				(n.specularIntensity = this.specularIntensity),
			this.specularColor &&
				this.specularColor.isColor &&
				(n.specularColor = this.specularColor.getHex()),
			this.shininess !== void 0 && (n.shininess = this.shininess),
			this.clearcoat !== void 0 && (n.clearcoat = this.clearcoat),
			this.clearcoatRoughness !== void 0 &&
				(n.clearcoatRoughness = this.clearcoatRoughness),
			this.clearcoatMap &&
				this.clearcoatMap.isTexture &&
				(n.clearcoatMap = this.clearcoatMap.toJSON(t).uuid),
			this.clearcoatRoughnessMap &&
				this.clearcoatRoughnessMap.isTexture &&
				(n.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(t).uuid),
			this.clearcoatNormalMap &&
				this.clearcoatNormalMap.isTexture &&
				((n.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(t).uuid),
				(n.clearcoatNormalScale = this.clearcoatNormalScale.toArray())),
			this.sheenColorMap &&
				this.sheenColorMap.isTexture &&
				(n.sheenColorMap = this.sheenColorMap.toJSON(t).uuid),
			this.sheenRoughnessMap &&
				this.sheenRoughnessMap.isTexture &&
				(n.sheenRoughnessMap = this.sheenRoughnessMap.toJSON(t).uuid),
			this.dispersion !== void 0 && (n.dispersion = this.dispersion),
			this.iridescence !== void 0 && (n.iridescence = this.iridescence),
			this.iridescenceIOR !== void 0 &&
				(n.iridescenceIOR = this.iridescenceIOR),
			this.iridescenceThicknessRange !== void 0 &&
				(n.iridescenceThicknessRange = this.iridescenceThicknessRange),
			this.iridescenceMap &&
				this.iridescenceMap.isTexture &&
				(n.iridescenceMap = this.iridescenceMap.toJSON(t).uuid),
			this.iridescenceThicknessMap &&
				this.iridescenceThicknessMap.isTexture &&
				(n.iridescenceThicknessMap =
					this.iridescenceThicknessMap.toJSON(t).uuid),
			this.anisotropy !== void 0 && (n.anisotropy = this.anisotropy),
			this.anisotropyRotation !== void 0 &&
				(n.anisotropyRotation = this.anisotropyRotation),
			this.anisotropyMap &&
				this.anisotropyMap.isTexture &&
				(n.anisotropyMap = this.anisotropyMap.toJSON(t).uuid),
			this.map && this.map.isTexture && (n.map = this.map.toJSON(t).uuid),
			this.matcap &&
				this.matcap.isTexture &&
				(n.matcap = this.matcap.toJSON(t).uuid),
			this.alphaMap &&
				this.alphaMap.isTexture &&
				(n.alphaMap = this.alphaMap.toJSON(t).uuid),
			this.lightMap &&
				this.lightMap.isTexture &&
				((n.lightMap = this.lightMap.toJSON(t).uuid),
				(n.lightMapIntensity = this.lightMapIntensity)),
			this.aoMap &&
				this.aoMap.isTexture &&
				((n.aoMap = this.aoMap.toJSON(t).uuid),
				(n.aoMapIntensity = this.aoMapIntensity)),
			this.bumpMap &&
				this.bumpMap.isTexture &&
				((n.bumpMap = this.bumpMap.toJSON(t).uuid),
				(n.bumpScale = this.bumpScale)),
			this.normalMap &&
				this.normalMap.isTexture &&
				((n.normalMap = this.normalMap.toJSON(t).uuid),
				(n.normalMapType = this.normalMapType),
				(n.normalScale = this.normalScale.toArray())),
			this.displacementMap &&
				this.displacementMap.isTexture &&
				((n.displacementMap = this.displacementMap.toJSON(t).uuid),
				(n.displacementScale = this.displacementScale),
				(n.displacementBias = this.displacementBias)),
			this.roughnessMap &&
				this.roughnessMap.isTexture &&
				(n.roughnessMap = this.roughnessMap.toJSON(t).uuid),
			this.metalnessMap &&
				this.metalnessMap.isTexture &&
				(n.metalnessMap = this.metalnessMap.toJSON(t).uuid),
			this.emissiveMap &&
				this.emissiveMap.isTexture &&
				(n.emissiveMap = this.emissiveMap.toJSON(t).uuid),
			this.specularMap &&
				this.specularMap.isTexture &&
				(n.specularMap = this.specularMap.toJSON(t).uuid),
			this.specularIntensityMap &&
				this.specularIntensityMap.isTexture &&
				(n.specularIntensityMap = this.specularIntensityMap.toJSON(t).uuid),
			this.specularColorMap &&
				this.specularColorMap.isTexture &&
				(n.specularColorMap = this.specularColorMap.toJSON(t).uuid),
			this.envMap &&
				this.envMap.isTexture &&
				((n.envMap = this.envMap.toJSON(t).uuid),
				this.combine !== void 0 && (n.combine = this.combine)),
			this.envMapRotation !== void 0 &&
				(n.envMapRotation = this.envMapRotation.toArray()),
			this.envMapIntensity !== void 0 &&
				(n.envMapIntensity = this.envMapIntensity),
			this.reflectivity !== void 0 && (n.reflectivity = this.reflectivity),
			this.refractionRatio !== void 0 &&
				(n.refractionRatio = this.refractionRatio),
			this.gradientMap &&
				this.gradientMap.isTexture &&
				(n.gradientMap = this.gradientMap.toJSON(t).uuid),
			this.transmission !== void 0 && (n.transmission = this.transmission),
			this.transmissionMap &&
				this.transmissionMap.isTexture &&
				(n.transmissionMap = this.transmissionMap.toJSON(t).uuid),
			this.thickness !== void 0 && (n.thickness = this.thickness),
			this.thicknessMap &&
				this.thicknessMap.isTexture &&
				(n.thicknessMap = this.thicknessMap.toJSON(t).uuid),
			this.attenuationDistance !== void 0 &&
				this.attenuationDistance !== 1 / 0 &&
				(n.attenuationDistance = this.attenuationDistance),
			this.attenuationColor !== void 0 &&
				(n.attenuationColor = this.attenuationColor.getHex()),
			this.size !== void 0 && (n.size = this.size),
			this.shadowSide !== null && (n.shadowSide = this.shadowSide),
			this.sizeAttenuation !== void 0 &&
				(n.sizeAttenuation = this.sizeAttenuation),
			this.blending !== Oi && (n.blending = this.blending),
			this.side !== Zn && (n.side = this.side),
			this.vertexColors === !0 && (n.vertexColors = !0),
			this.opacity < 1 && (n.opacity = this.opacity),
			this.transparent === !0 && (n.transparent = !0),
			this.blendSrc !== ro && (n.blendSrc = this.blendSrc),
			this.blendDst !== oo && (n.blendDst = this.blendDst),
			this.blendEquation !== ai && (n.blendEquation = this.blendEquation),
			this.blendSrcAlpha !== null && (n.blendSrcAlpha = this.blendSrcAlpha),
			this.blendDstAlpha !== null && (n.blendDstAlpha = this.blendDstAlpha),
			this.blendEquationAlpha !== null &&
				(n.blendEquationAlpha = this.blendEquationAlpha),
			this.blendColor &&
				this.blendColor.isColor &&
				(n.blendColor = this.blendColor.getHex()),
			this.blendAlpha !== 0 && (n.blendAlpha = this.blendAlpha),
			this.depthFunc !== zi && (n.depthFunc = this.depthFunc),
			this.depthTest === !1 && (n.depthTest = this.depthTest),
			this.depthWrite === !1 && (n.depthWrite = this.depthWrite),
			this.colorWrite === !1 && (n.colorWrite = this.colorWrite),
			this.stencilWriteMask !== 255 &&
				(n.stencilWriteMask = this.stencilWriteMask),
			this.stencilFunc !== Ta && (n.stencilFunc = this.stencilFunc),
			this.stencilRef !== 0 && (n.stencilRef = this.stencilRef),
			this.stencilFuncMask !== 255 &&
				(n.stencilFuncMask = this.stencilFuncMask),
			this.stencilFail !== _i && (n.stencilFail = this.stencilFail),
			this.stencilZFail !== _i && (n.stencilZFail = this.stencilZFail),
			this.stencilZPass !== _i && (n.stencilZPass = this.stencilZPass),
			this.stencilWrite === !0 && (n.stencilWrite = this.stencilWrite),
			this.rotation !== void 0 &&
				this.rotation !== 0 &&
				(n.rotation = this.rotation),
			this.polygonOffset === !0 && (n.polygonOffset = !0),
			this.polygonOffsetFactor !== 0 &&
				(n.polygonOffsetFactor = this.polygonOffsetFactor),
			this.polygonOffsetUnits !== 0 &&
				(n.polygonOffsetUnits = this.polygonOffsetUnits),
			this.linewidth !== void 0 &&
				this.linewidth !== 1 &&
				(n.linewidth = this.linewidth),
			this.dashSize !== void 0 && (n.dashSize = this.dashSize),
			this.gapSize !== void 0 && (n.gapSize = this.gapSize),
			this.scale !== void 0 && (n.scale = this.scale),
			this.dithering === !0 && (n.dithering = !0),
			this.alphaTest > 0 && (n.alphaTest = this.alphaTest),
			this.alphaHash === !0 && (n.alphaHash = !0),
			this.alphaToCoverage === !0 && (n.alphaToCoverage = !0),
			this.premultipliedAlpha === !0 && (n.premultipliedAlpha = !0),
			this.forceSinglePass === !0 && (n.forceSinglePass = !0),
			this.wireframe === !0 && (n.wireframe = !0),
			this.wireframeLinewidth > 1 &&
				(n.wireframeLinewidth = this.wireframeLinewidth),
			this.wireframeLinecap !== "round" &&
				(n.wireframeLinecap = this.wireframeLinecap),
			this.wireframeLinejoin !== "round" &&
				(n.wireframeLinejoin = this.wireframeLinejoin),
			this.flatShading === !0 && (n.flatShading = !0),
			this.visible === !1 && (n.visible = !1),
			this.toneMapped === !1 && (n.toneMapped = !1),
			this.fog === !1 && (n.fog = !1),
			Object.keys(this.userData).length > 0 && (n.userData = this.userData)
		function s(r) {
			const o = []
			for (const a in r) {
				const h = r[a]
				delete h.metadata, o.push(h)
			}
			return o
		}
		if (e) {
			const r = s(t.textures),
				o = s(t.images)
			r.length > 0 && (n.textures = r), o.length > 0 && (n.images = o)
		}
		return n
	}
	clone() {
		return new this.constructor().copy(this)
	}
	copy(t) {
		;(this.name = t.name),
			(this.blending = t.blending),
			(this.side = t.side),
			(this.vertexColors = t.vertexColors),
			(this.opacity = t.opacity),
			(this.transparent = t.transparent),
			(this.blendSrc = t.blendSrc),
			(this.blendDst = t.blendDst),
			(this.blendEquation = t.blendEquation),
			(this.blendSrcAlpha = t.blendSrcAlpha),
			(this.blendDstAlpha = t.blendDstAlpha),
			(this.blendEquationAlpha = t.blendEquationAlpha),
			this.blendColor.copy(t.blendColor),
			(this.blendAlpha = t.blendAlpha),
			(this.depthFunc = t.depthFunc),
			(this.depthTest = t.depthTest),
			(this.depthWrite = t.depthWrite),
			(this.stencilWriteMask = t.stencilWriteMask),
			(this.stencilFunc = t.stencilFunc),
			(this.stencilRef = t.stencilRef),
			(this.stencilFuncMask = t.stencilFuncMask),
			(this.stencilFail = t.stencilFail),
			(this.stencilZFail = t.stencilZFail),
			(this.stencilZPass = t.stencilZPass),
			(this.stencilWrite = t.stencilWrite)
		const e = t.clippingPlanes
		let n = null
		if (e !== null) {
			const s = e.length
			n = new Array(s)
			for (let r = 0; r !== s; ++r) n[r] = e[r].clone()
		}
		return (
			(this.clippingPlanes = n),
			(this.clipIntersection = t.clipIntersection),
			(this.clipShadows = t.clipShadows),
			(this.shadowSide = t.shadowSide),
			(this.colorWrite = t.colorWrite),
			(this.precision = t.precision),
			(this.polygonOffset = t.polygonOffset),
			(this.polygonOffsetFactor = t.polygonOffsetFactor),
			(this.polygonOffsetUnits = t.polygonOffsetUnits),
			(this.dithering = t.dithering),
			(this.alphaTest = t.alphaTest),
			(this.alphaHash = t.alphaHash),
			(this.alphaToCoverage = t.alphaToCoverage),
			(this.premultipliedAlpha = t.premultipliedAlpha),
			(this.forceSinglePass = t.forceSinglePass),
			(this.visible = t.visible),
			(this.toneMapped = t.toneMapped),
			(this.userData = JSON.parse(JSON.stringify(t.userData))),
			this
		)
	}
	dispose() {
		this.dispatchEvent({ type: "dispose" })
	}
	set needsUpdate(t) {
		t === !0 && this.version++
	}
}
class Le extends mi {
	constructor(t) {
		super(),
			(this.isMeshBasicMaterial = !0),
			(this.type = "MeshBasicMaterial"),
			(this.color = new Bt(16777215)),
			(this.map = null),
			(this.lightMap = null),
			(this.lightMapIntensity = 1),
			(this.aoMap = null),
			(this.aoMapIntensity = 1),
			(this.specularMap = null),
			(this.alphaMap = null),
			(this.envMap = null),
			(this.envMapRotation = new yn()),
			(this.combine = kl),
			(this.reflectivity = 1),
			(this.refractionRatio = 0.98),
			(this.wireframe = !1),
			(this.wireframeLinewidth = 1),
			(this.wireframeLinecap = "round"),
			(this.wireframeLinejoin = "round"),
			(this.fog = !0),
			this.setValues(t)
	}
	copy(t) {
		return (
			super.copy(t),
			this.color.copy(t.color),
			(this.map = t.map),
			(this.lightMap = t.lightMap),
			(this.lightMapIntensity = t.lightMapIntensity),
			(this.aoMap = t.aoMap),
			(this.aoMapIntensity = t.aoMapIntensity),
			(this.specularMap = t.specularMap),
			(this.alphaMap = t.alphaMap),
			(this.envMap = t.envMap),
			this.envMapRotation.copy(t.envMapRotation),
			(this.combine = t.combine),
			(this.reflectivity = t.reflectivity),
			(this.refractionRatio = t.refractionRatio),
			(this.wireframe = t.wireframe),
			(this.wireframeLinewidth = t.wireframeLinewidth),
			(this.wireframeLinecap = t.wireframeLinecap),
			(this.wireframeLinejoin = t.wireframeLinejoin),
			(this.fog = t.fog),
			this
		)
	}
}
const pe = new U(),
	Ls = new Dt()
let $h = 0
class an {
	constructor(t, e, n = !1) {
		if (Array.isArray(t))
			throw new TypeError(
				"THREE.BufferAttribute: array should be a Typed Array."
			)
		;(this.isBufferAttribute = !0),
			Object.defineProperty(this, "id", { value: $h++ }),
			(this.name = ""),
			(this.array = t),
			(this.itemSize = e),
			(this.count = t !== void 0 ? t.length / e : 0),
			(this.normalized = n),
			(this.usage = Aa),
			(this.updateRanges = []),
			(this.gpuType = xn),
			(this.version = 0)
	}
	onUploadCallback() {}
	set needsUpdate(t) {
		t === !0 && this.version++
	}
	setUsage(t) {
		return (this.usage = t), this
	}
	addUpdateRange(t, e) {
		this.updateRanges.push({ start: t, count: e })
	}
	clearUpdateRanges() {
		this.updateRanges.length = 0
	}
	copy(t) {
		return (
			(this.name = t.name),
			(this.array = new t.array.constructor(t.array)),
			(this.itemSize = t.itemSize),
			(this.count = t.count),
			(this.normalized = t.normalized),
			(this.usage = t.usage),
			(this.gpuType = t.gpuType),
			this
		)
	}
	copyAt(t, e, n) {
		;(t *= this.itemSize), (n *= e.itemSize)
		for (let s = 0, r = this.itemSize; s < r; s++)
			this.array[t + s] = e.array[n + s]
		return this
	}
	copyArray(t) {
		return this.array.set(t), this
	}
	applyMatrix3(t) {
		if (this.itemSize === 2)
			for (let e = 0, n = this.count; e < n; e++)
				Ls.fromBufferAttribute(this, e),
					Ls.applyMatrix3(t),
					this.setXY(e, Ls.x, Ls.y)
		else if (this.itemSize === 3)
			for (let e = 0, n = this.count; e < n; e++)
				pe.fromBufferAttribute(this, e),
					pe.applyMatrix3(t),
					this.setXYZ(e, pe.x, pe.y, pe.z)
		return this
	}
	applyMatrix4(t) {
		for (let e = 0, n = this.count; e < n; e++)
			pe.fromBufferAttribute(this, e),
				pe.applyMatrix4(t),
				this.setXYZ(e, pe.x, pe.y, pe.z)
		return this
	}
	applyNormalMatrix(t) {
		for (let e = 0, n = this.count; e < n; e++)
			pe.fromBufferAttribute(this, e),
				pe.applyNormalMatrix(t),
				this.setXYZ(e, pe.x, pe.y, pe.z)
		return this
	}
	transformDirection(t) {
		for (let e = 0, n = this.count; e < n; e++)
			pe.fromBufferAttribute(this, e),
				pe.transformDirection(t),
				this.setXYZ(e, pe.x, pe.y, pe.z)
		return this
	}
	set(t, e = 0) {
		return this.array.set(t, e), this
	}
	getComponent(t, e) {
		let n = this.array[t * this.itemSize + e]
		return this.normalized && (n = ji(n, this.array)), n
	}
	setComponent(t, e, n) {
		return (
			this.normalized && (n = He(n, this.array)),
			(this.array[t * this.itemSize + e] = n),
			this
		)
	}
	getX(t) {
		let e = this.array[t * this.itemSize]
		return this.normalized && (e = ji(e, this.array)), e
	}
	setX(t, e) {
		return (
			this.normalized && (e = He(e, this.array)),
			(this.array[t * this.itemSize] = e),
			this
		)
	}
	getY(t) {
		let e = this.array[t * this.itemSize + 1]
		return this.normalized && (e = ji(e, this.array)), e
	}
	setY(t, e) {
		return (
			this.normalized && (e = He(e, this.array)),
			(this.array[t * this.itemSize + 1] = e),
			this
		)
	}
	getZ(t) {
		let e = this.array[t * this.itemSize + 2]
		return this.normalized && (e = ji(e, this.array)), e
	}
	setZ(t, e) {
		return (
			this.normalized && (e = He(e, this.array)),
			(this.array[t * this.itemSize + 2] = e),
			this
		)
	}
	getW(t) {
		let e = this.array[t * this.itemSize + 3]
		return this.normalized && (e = ji(e, this.array)), e
	}
	setW(t, e) {
		return (
			this.normalized && (e = He(e, this.array)),
			(this.array[t * this.itemSize + 3] = e),
			this
		)
	}
	setXY(t, e, n) {
		return (
			(t *= this.itemSize),
			this.normalized && ((e = He(e, this.array)), (n = He(n, this.array))),
			(this.array[t + 0] = e),
			(this.array[t + 1] = n),
			this
		)
	}
	setXYZ(t, e, n, s) {
		return (
			(t *= this.itemSize),
			this.normalized &&
				((e = He(e, this.array)),
				(n = He(n, this.array)),
				(s = He(s, this.array))),
			(this.array[t + 0] = e),
			(this.array[t + 1] = n),
			(this.array[t + 2] = s),
			this
		)
	}
	setXYZW(t, e, n, s, r) {
		return (
			(t *= this.itemSize),
			this.normalized &&
				((e = He(e, this.array)),
				(n = He(n, this.array)),
				(s = He(s, this.array)),
				(r = He(r, this.array))),
			(this.array[t + 0] = e),
			(this.array[t + 1] = n),
			(this.array[t + 2] = s),
			(this.array[t + 3] = r),
			this
		)
	}
	onUpload(t) {
		return (this.onUploadCallback = t), this
	}
	clone() {
		return new this.constructor(this.array, this.itemSize).copy(this)
	}
	toJSON() {
		const t = {
			itemSize: this.itemSize,
			type: this.array.constructor.name,
			array: Array.from(this.array),
			normalized: this.normalized,
		}
		return (
			this.name !== "" && (t.name = this.name),
			this.usage !== Aa && (t.usage = this.usage),
			t
		)
	}
}
class nc extends an {
	constructor(t, e, n) {
		super(new Uint16Array(t), e, n)
	}
}
class ic extends an {
	constructor(t, e, n) {
		super(new Uint32Array(t), e, n)
	}
}
class ve extends an {
	constructor(t, e, n) {
		super(new Float32Array(t), e, n)
	}
}
let Jh = 0
const tn = new le(),
	Wr = new Te(),
	wi = new U(),
	Ye = new Xi(),
	Ji = new Xi(),
	Ee = new U()
class Be extends pi {
	constructor() {
		super(),
			(this.isBufferGeometry = !0),
			Object.defineProperty(this, "id", { value: Jh++ }),
			(this.uuid = gs()),
			(this.name = ""),
			(this.type = "BufferGeometry"),
			(this.index = null),
			(this.indirect = null),
			(this.attributes = {}),
			(this.morphAttributes = {}),
			(this.morphTargetsRelative = !1),
			(this.groups = []),
			(this.boundingBox = null),
			(this.boundingSphere = null),
			(this.drawRange = { start: 0, count: 1 / 0 }),
			(this.userData = {})
	}
	getIndex() {
		return this.index
	}
	setIndex(t) {
		return (
			Array.isArray(t)
				? (this.index = new (Ql(t) ? ic : nc)(t, 1))
				: (this.index = t),
			this
		)
	}
	setIndirect(t) {
		return (this.indirect = t), this
	}
	getIndirect() {
		return this.indirect
	}
	getAttribute(t) {
		return this.attributes[t]
	}
	setAttribute(t, e) {
		return (this.attributes[t] = e), this
	}
	deleteAttribute(t) {
		return delete this.attributes[t], this
	}
	hasAttribute(t) {
		return this.attributes[t] !== void 0
	}
	addGroup(t, e, n = 0) {
		this.groups.push({ start: t, count: e, materialIndex: n })
	}
	clearGroups() {
		this.groups = []
	}
	setDrawRange(t, e) {
		;(this.drawRange.start = t), (this.drawRange.count = e)
	}
	applyMatrix4(t) {
		const e = this.attributes.position
		e !== void 0 && (e.applyMatrix4(t), (e.needsUpdate = !0))
		const n = this.attributes.normal
		if (n !== void 0) {
			const r = new Nt().getNormalMatrix(t)
			n.applyNormalMatrix(r), (n.needsUpdate = !0)
		}
		const s = this.attributes.tangent
		return (
			s !== void 0 && (s.transformDirection(t), (s.needsUpdate = !0)),
			this.boundingBox !== null && this.computeBoundingBox(),
			this.boundingSphere !== null && this.computeBoundingSphere(),
			this
		)
	}
	applyQuaternion(t) {
		return tn.makeRotationFromQuaternion(t), this.applyMatrix4(tn), this
	}
	rotateX(t) {
		return tn.makeRotationX(t), this.applyMatrix4(tn), this
	}
	rotateY(t) {
		return tn.makeRotationY(t), this.applyMatrix4(tn), this
	}
	rotateZ(t) {
		return tn.makeRotationZ(t), this.applyMatrix4(tn), this
	}
	translate(t, e, n) {
		return tn.makeTranslation(t, e, n), this.applyMatrix4(tn), this
	}
	scale(t, e, n) {
		return tn.makeScale(t, e, n), this.applyMatrix4(tn), this
	}
	lookAt(t) {
		return Wr.lookAt(t), Wr.updateMatrix(), this.applyMatrix4(Wr.matrix), this
	}
	center() {
		return (
			this.computeBoundingBox(),
			this.boundingBox.getCenter(wi).negate(),
			this.translate(wi.x, wi.y, wi.z),
			this
		)
	}
	setFromPoints(t) {
		const e = this.getAttribute("position")
		if (e === void 0) {
			const n = []
			for (let s = 0, r = t.length; s < r; s++) {
				const o = t[s]
				n.push(o.x, o.y, o.z || 0)
			}
			this.setAttribute("position", new ve(n, 3))
		} else {
			const n = Math.min(t.length, e.count)
			for (let s = 0; s < n; s++) {
				const r = t[s]
				e.setXYZ(s, r.x, r.y, r.z || 0)
			}
			t.length > e.count &&
				console.warn(
					"THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."
				),
				(e.needsUpdate = !0)
		}
		return this
	}
	computeBoundingBox() {
		this.boundingBox === null && (this.boundingBox = new Xi())
		const t = this.attributes.position,
			e = this.morphAttributes.position
		if (t && t.isGLBufferAttribute) {
			console.error(
				"THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",
				this
			),
				this.boundingBox.set(
					new U(-1 / 0, -1 / 0, -1 / 0),
					new U(1 / 0, 1 / 0, 1 / 0)
				)
			return
		}
		if (t !== void 0) {
			if ((this.boundingBox.setFromBufferAttribute(t), e))
				for (let n = 0, s = e.length; n < s; n++) {
					const r = e[n]
					Ye.setFromBufferAttribute(r),
						this.morphTargetsRelative
							? (Ee.addVectors(this.boundingBox.min, Ye.min),
							  this.boundingBox.expandByPoint(Ee),
							  Ee.addVectors(this.boundingBox.max, Ye.max),
							  this.boundingBox.expandByPoint(Ee))
							: (this.boundingBox.expandByPoint(Ye.min),
							  this.boundingBox.expandByPoint(Ye.max))
				}
		} else this.boundingBox.makeEmpty()
		;(isNaN(this.boundingBox.min.x) ||
			isNaN(this.boundingBox.min.y) ||
			isNaN(this.boundingBox.min.z)) &&
			console.error(
				'THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',
				this
			)
	}
	computeBoundingSphere() {
		this.boundingSphere === null && (this.boundingSphere = new _s())
		const t = this.attributes.position,
			e = this.morphAttributes.position
		if (t && t.isGLBufferAttribute) {
			console.error(
				"THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",
				this
			),
				this.boundingSphere.set(new U(), 1 / 0)
			return
		}
		if (t) {
			const n = this.boundingSphere.center
			if ((Ye.setFromBufferAttribute(t), e))
				for (let r = 0, o = e.length; r < o; r++) {
					const a = e[r]
					Ji.setFromBufferAttribute(a),
						this.morphTargetsRelative
							? (Ee.addVectors(Ye.min, Ji.min),
							  Ye.expandByPoint(Ee),
							  Ee.addVectors(Ye.max, Ji.max),
							  Ye.expandByPoint(Ee))
							: (Ye.expandByPoint(Ji.min), Ye.expandByPoint(Ji.max))
				}
			Ye.getCenter(n)
			let s = 0
			for (let r = 0, o = t.count; r < o; r++)
				Ee.fromBufferAttribute(t, r), (s = Math.max(s, n.distanceToSquared(Ee)))
			if (e)
				for (let r = 0, o = e.length; r < o; r++) {
					const a = e[r],
						h = this.morphTargetsRelative
					for (let l = 0, d = a.count; l < d; l++)
						Ee.fromBufferAttribute(a, l),
							h && (wi.fromBufferAttribute(t, l), Ee.add(wi)),
							(s = Math.max(s, n.distanceToSquared(Ee)))
				}
			;(this.boundingSphere.radius = Math.sqrt(s)),
				isNaN(this.boundingSphere.radius) &&
					console.error(
						'THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',
						this
					)
		}
	}
	computeTangents() {
		const t = this.index,
			e = this.attributes
		if (
			t === null ||
			e.position === void 0 ||
			e.normal === void 0 ||
			e.uv === void 0
		) {
			console.error(
				"THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)"
			)
			return
		}
		const n = e.position,
			s = e.normal,
			r = e.uv
		this.hasAttribute("tangent") === !1 &&
			this.setAttribute("tangent", new an(new Float32Array(4 * n.count), 4))
		const o = this.getAttribute("tangent"),
			a = [],
			h = []
		for (let D = 0; D < n.count; D++) (a[D] = new U()), (h[D] = new U())
		const l = new U(),
			d = new U(),
			c = new U(),
			f = new Dt(),
			m = new Dt(),
			g = new Dt(),
			_ = new U(),
			p = new U()
		function u(D, v, y) {
			l.fromBufferAttribute(n, D),
				d.fromBufferAttribute(n, v),
				c.fromBufferAttribute(n, y),
				f.fromBufferAttribute(r, D),
				m.fromBufferAttribute(r, v),
				g.fromBufferAttribute(r, y),
				d.sub(l),
				c.sub(l),
				m.sub(f),
				g.sub(f)
			const R = 1 / (m.x * g.y - g.x * m.y)
			isFinite(R) &&
				(_.copy(d)
					.multiplyScalar(g.y)
					.addScaledVector(c, -m.y)
					.multiplyScalar(R),
				p
					.copy(c)
					.multiplyScalar(m.x)
					.addScaledVector(d, -g.x)
					.multiplyScalar(R),
				a[D].add(_),
				a[v].add(_),
				a[y].add(_),
				h[D].add(p),
				h[v].add(p),
				h[y].add(p))
		}
		let b = this.groups
		b.length === 0 && (b = [{ start: 0, count: t.count }])
		for (let D = 0, v = b.length; D < v; ++D) {
			const y = b[D],
				R = y.start,
				L = y.count
			for (let N = R, z = R + L; N < z; N += 3)
				u(t.getX(N + 0), t.getX(N + 1), t.getX(N + 2))
		}
		const T = new U(),
			S = new U(),
			C = new U(),
			w = new U()
		function E(D) {
			C.fromBufferAttribute(s, D), w.copy(C)
			const v = a[D]
			T.copy(v),
				T.sub(C.multiplyScalar(C.dot(v))).normalize(),
				S.crossVectors(w, v)
			const R = S.dot(h[D]) < 0 ? -1 : 1
			o.setXYZW(D, T.x, T.y, T.z, R)
		}
		for (let D = 0, v = b.length; D < v; ++D) {
			const y = b[D],
				R = y.start,
				L = y.count
			for (let N = R, z = R + L; N < z; N += 3)
				E(t.getX(N + 0)), E(t.getX(N + 1)), E(t.getX(N + 2))
		}
	}
	computeVertexNormals() {
		const t = this.index,
			e = this.getAttribute("position")
		if (e !== void 0) {
			let n = this.getAttribute("normal")
			if (n === void 0)
				(n = new an(new Float32Array(e.count * 3), 3)),
					this.setAttribute("normal", n)
			else for (let f = 0, m = n.count; f < m; f++) n.setXYZ(f, 0, 0, 0)
			const s = new U(),
				r = new U(),
				o = new U(),
				a = new U(),
				h = new U(),
				l = new U(),
				d = new U(),
				c = new U()
			if (t)
				for (let f = 0, m = t.count; f < m; f += 3) {
					const g = t.getX(f + 0),
						_ = t.getX(f + 1),
						p = t.getX(f + 2)
					s.fromBufferAttribute(e, g),
						r.fromBufferAttribute(e, _),
						o.fromBufferAttribute(e, p),
						d.subVectors(o, r),
						c.subVectors(s, r),
						d.cross(c),
						a.fromBufferAttribute(n, g),
						h.fromBufferAttribute(n, _),
						l.fromBufferAttribute(n, p),
						a.add(d),
						h.add(d),
						l.add(d),
						n.setXYZ(g, a.x, a.y, a.z),
						n.setXYZ(_, h.x, h.y, h.z),
						n.setXYZ(p, l.x, l.y, l.z)
				}
			else
				for (let f = 0, m = e.count; f < m; f += 3)
					s.fromBufferAttribute(e, f + 0),
						r.fromBufferAttribute(e, f + 1),
						o.fromBufferAttribute(e, f + 2),
						d.subVectors(o, r),
						c.subVectors(s, r),
						d.cross(c),
						n.setXYZ(f + 0, d.x, d.y, d.z),
						n.setXYZ(f + 1, d.x, d.y, d.z),
						n.setXYZ(f + 2, d.x, d.y, d.z)
			this.normalizeNormals(), (n.needsUpdate = !0)
		}
	}
	normalizeNormals() {
		const t = this.attributes.normal
		for (let e = 0, n = t.count; e < n; e++)
			Ee.fromBufferAttribute(t, e),
				Ee.normalize(),
				t.setXYZ(e, Ee.x, Ee.y, Ee.z)
	}
	toNonIndexed() {
		function t(a, h) {
			const l = a.array,
				d = a.itemSize,
				c = a.normalized,
				f = new l.constructor(h.length * d)
			let m = 0,
				g = 0
			for (let _ = 0, p = h.length; _ < p; _++) {
				a.isInterleavedBufferAttribute
					? (m = h[_] * a.data.stride + a.offset)
					: (m = h[_] * d)
				for (let u = 0; u < d; u++) f[g++] = l[m++]
			}
			return new an(f, d, c)
		}
		if (this.index === null)
			return (
				console.warn(
					"THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."
				),
				this
			)
		const e = new Be(),
			n = this.index.array,
			s = this.attributes
		for (const a in s) {
			const h = s[a],
				l = t(h, n)
			e.setAttribute(a, l)
		}
		const r = this.morphAttributes
		for (const a in r) {
			const h = [],
				l = r[a]
			for (let d = 0, c = l.length; d < c; d++) {
				const f = l[d],
					m = t(f, n)
				h.push(m)
			}
			e.morphAttributes[a] = h
		}
		e.morphTargetsRelative = this.morphTargetsRelative
		const o = this.groups
		for (let a = 0, h = o.length; a < h; a++) {
			const l = o[a]
			e.addGroup(l.start, l.count, l.materialIndex)
		}
		return e
	}
	toJSON() {
		const t = {
			metadata: {
				version: 4.7,
				type: "BufferGeometry",
				generator: "BufferGeometry.toJSON",
			},
		}
		if (
			((t.uuid = this.uuid),
			(t.type = this.type),
			this.name !== "" && (t.name = this.name),
			Object.keys(this.userData).length > 0 && (t.userData = this.userData),
			this.parameters !== void 0)
		) {
			const h = this.parameters
			for (const l in h) h[l] !== void 0 && (t[l] = h[l])
			return t
		}
		t.data = { attributes: {} }
		const e = this.index
		e !== null &&
			(t.data.index = {
				type: e.array.constructor.name,
				array: Array.prototype.slice.call(e.array),
			})
		const n = this.attributes
		for (const h in n) {
			const l = n[h]
			t.data.attributes[h] = l.toJSON(t.data)
		}
		const s = {}
		let r = !1
		for (const h in this.morphAttributes) {
			const l = this.morphAttributes[h],
				d = []
			for (let c = 0, f = l.length; c < f; c++) {
				const m = l[c]
				d.push(m.toJSON(t.data))
			}
			d.length > 0 && ((s[h] = d), (r = !0))
		}
		r &&
			((t.data.morphAttributes = s),
			(t.data.morphTargetsRelative = this.morphTargetsRelative))
		const o = this.groups
		o.length > 0 && (t.data.groups = JSON.parse(JSON.stringify(o)))
		const a = this.boundingSphere
		return a !== null && (t.data.boundingSphere = a.toJSON()), t
	}
	clone() {
		return new this.constructor().copy(this)
	}
	copy(t) {
		;(this.index = null),
			(this.attributes = {}),
			(this.morphAttributes = {}),
			(this.groups = []),
			(this.boundingBox = null),
			(this.boundingSphere = null)
		const e = {}
		this.name = t.name
		const n = t.index
		n !== null && this.setIndex(n.clone())
		const s = t.attributes
		for (const l in s) {
			const d = s[l]
			this.setAttribute(l, d.clone(e))
		}
		const r = t.morphAttributes
		for (const l in r) {
			const d = [],
				c = r[l]
			for (let f = 0, m = c.length; f < m; f++) d.push(c[f].clone(e))
			this.morphAttributes[l] = d
		}
		this.morphTargetsRelative = t.morphTargetsRelative
		const o = t.groups
		for (let l = 0, d = o.length; l < d; l++) {
			const c = o[l]
			this.addGroup(c.start, c.count, c.materialIndex)
		}
		const a = t.boundingBox
		a !== null && (this.boundingBox = a.clone())
		const h = t.boundingSphere
		return (
			h !== null && (this.boundingSphere = h.clone()),
			(this.drawRange.start = t.drawRange.start),
			(this.drawRange.count = t.drawRange.count),
			(this.userData = t.userData),
			this
		)
	}
	dispose() {
		this.dispatchEvent({ type: "dispose" })
	}
}
const Ha = new le(),
	ni = new xs(),
	Is = new _s(),
	ka = new U(),
	Us = new U(),
	Ns = new U(),
	Fs = new U(),
	Xr = new U(),
	Os = new U(),
	Ga = new U(),
	Bs = new U()
class Zt extends Te {
	constructor(t = new Be(), e = new Le()) {
		super(),
			(this.isMesh = !0),
			(this.type = "Mesh"),
			(this.geometry = t),
			(this.material = e),
			(this.morphTargetDictionary = void 0),
			(this.morphTargetInfluences = void 0),
			(this.count = 1),
			this.updateMorphTargets()
	}
	copy(t, e) {
		return (
			super.copy(t, e),
			t.morphTargetInfluences !== void 0 &&
				(this.morphTargetInfluences = t.morphTargetInfluences.slice()),
			t.morphTargetDictionary !== void 0 &&
				(this.morphTargetDictionary = Object.assign(
					{},
					t.morphTargetDictionary
				)),
			(this.material = Array.isArray(t.material)
				? t.material.slice()
				: t.material),
			(this.geometry = t.geometry),
			this
		)
	}
	updateMorphTargets() {
		const e = this.geometry.morphAttributes,
			n = Object.keys(e)
		if (n.length > 0) {
			const s = e[n[0]]
			if (s !== void 0) {
				;(this.morphTargetInfluences = []), (this.morphTargetDictionary = {})
				for (let r = 0, o = s.length; r < o; r++) {
					const a = s[r].name || String(r)
					this.morphTargetInfluences.push(0),
						(this.morphTargetDictionary[a] = r)
				}
			}
		}
	}
	getVertexPosition(t, e) {
		const n = this.geometry,
			s = n.attributes.position,
			r = n.morphAttributes.position,
			o = n.morphTargetsRelative
		e.fromBufferAttribute(s, t)
		const a = this.morphTargetInfluences
		if (r && a) {
			Os.set(0, 0, 0)
			for (let h = 0, l = r.length; h < l; h++) {
				const d = a[h],
					c = r[h]
				d !== 0 &&
					(Xr.fromBufferAttribute(c, t),
					o ? Os.addScaledVector(Xr, d) : Os.addScaledVector(Xr.sub(e), d))
			}
			e.add(Os)
		}
		return e
	}
	raycast(t, e) {
		const n = this.geometry,
			s = this.material,
			r = this.matrixWorld
		s !== void 0 &&
			(n.boundingSphere === null && n.computeBoundingSphere(),
			Is.copy(n.boundingSphere),
			Is.applyMatrix4(r),
			ni.copy(t.ray).recast(t.near),
			!(
				Is.containsPoint(ni.origin) === !1 &&
				(ni.intersectSphere(Is, ka) === null ||
					ni.origin.distanceToSquared(ka) > (t.far - t.near) ** 2)
			) &&
				(Ha.copy(r).invert(),
				ni.copy(t.ray).applyMatrix4(Ha),
				!(n.boundingBox !== null && ni.intersectsBox(n.boundingBox) === !1) &&
					this._computeIntersections(t, e, ni)))
	}
	_computeIntersections(t, e, n) {
		let s
		const r = this.geometry,
			o = this.material,
			a = r.index,
			h = r.attributes.position,
			l = r.attributes.uv,
			d = r.attributes.uv1,
			c = r.attributes.normal,
			f = r.groups,
			m = r.drawRange
		if (a !== null)
			if (Array.isArray(o))
				for (let g = 0, _ = f.length; g < _; g++) {
					const p = f[g],
						u = o[p.materialIndex],
						b = Math.max(p.start, m.start),
						T = Math.min(
							a.count,
							Math.min(p.start + p.count, m.start + m.count)
						)
					for (let S = b, C = T; S < C; S += 3) {
						const w = a.getX(S),
							E = a.getX(S + 1),
							D = a.getX(S + 2)
						;(s = zs(this, u, t, n, l, d, c, w, E, D)),
							s &&
								((s.faceIndex = Math.floor(S / 3)),
								(s.face.materialIndex = p.materialIndex),
								e.push(s))
					}
				}
			else {
				const g = Math.max(0, m.start),
					_ = Math.min(a.count, m.start + m.count)
				for (let p = g, u = _; p < u; p += 3) {
					const b = a.getX(p),
						T = a.getX(p + 1),
						S = a.getX(p + 2)
					;(s = zs(this, o, t, n, l, d, c, b, T, S)),
						s && ((s.faceIndex = Math.floor(p / 3)), e.push(s))
				}
			}
		else if (h !== void 0)
			if (Array.isArray(o))
				for (let g = 0, _ = f.length; g < _; g++) {
					const p = f[g],
						u = o[p.materialIndex],
						b = Math.max(p.start, m.start),
						T = Math.min(
							h.count,
							Math.min(p.start + p.count, m.start + m.count)
						)
					for (let S = b, C = T; S < C; S += 3) {
						const w = S,
							E = S + 1,
							D = S + 2
						;(s = zs(this, u, t, n, l, d, c, w, E, D)),
							s &&
								((s.faceIndex = Math.floor(S / 3)),
								(s.face.materialIndex = p.materialIndex),
								e.push(s))
					}
				}
			else {
				const g = Math.max(0, m.start),
					_ = Math.min(h.count, m.start + m.count)
				for (let p = g, u = _; p < u; p += 3) {
					const b = p,
						T = p + 1,
						S = p + 2
					;(s = zs(this, o, t, n, l, d, c, b, T, S)),
						s && ((s.faceIndex = Math.floor(p / 3)), e.push(s))
				}
			}
	}
}
function Qh(i, t, e, n, s, r, o, a) {
	let h
	if (
		(t.side === Ie
			? (h = n.intersectTriangle(o, r, s, !0, a))
			: (h = n.intersectTriangle(s, r, o, t.side === Zn, a)),
		h === null)
	)
		return null
	Bs.copy(a), Bs.applyMatrix4(i.matrixWorld)
	const l = e.ray.origin.distanceTo(Bs)
	return l < e.near || l > e.far
		? null
		: { distance: l, point: Bs.clone(), object: i }
}
function zs(i, t, e, n, s, r, o, a, h, l) {
	i.getVertexPosition(a, Us),
		i.getVertexPosition(h, Ns),
		i.getVertexPosition(l, Fs)
	const d = Qh(i, t, e, n, Us, Ns, Fs, Ga)
	if (d) {
		const c = new U()
		sn.getBarycoord(Ga, Us, Ns, Fs, c),
			s && (d.uv = sn.getInterpolatedAttribute(s, a, h, l, c, new Dt())),
			r && (d.uv1 = sn.getInterpolatedAttribute(r, a, h, l, c, new Dt())),
			o &&
				((d.normal = sn.getInterpolatedAttribute(o, a, h, l, c, new U())),
				d.normal.dot(n.direction) > 0 && d.normal.multiplyScalar(-1))
		const f = { a, b: h, c: l, normal: new U(), materialIndex: 0 }
		sn.getNormal(Us, Ns, Fs, f.normal), (d.face = f), (d.barycoord = c)
	}
	return d
}
class fi extends Be {
	constructor(t = 1, e = 1, n = 1, s = 1, r = 1, o = 1) {
		super(),
			(this.type = "BoxGeometry"),
			(this.parameters = {
				width: t,
				height: e,
				depth: n,
				widthSegments: s,
				heightSegments: r,
				depthSegments: o,
			})
		const a = this
		;(s = Math.floor(s)), (r = Math.floor(r)), (o = Math.floor(o))
		const h = [],
			l = [],
			d = [],
			c = []
		let f = 0,
			m = 0
		g("z", "y", "x", -1, -1, n, e, t, o, r, 0),
			g("z", "y", "x", 1, -1, n, e, -t, o, r, 1),
			g("x", "z", "y", 1, 1, t, n, e, s, o, 2),
			g("x", "z", "y", 1, -1, t, n, -e, s, o, 3),
			g("x", "y", "z", 1, -1, t, e, n, s, r, 4),
			g("x", "y", "z", -1, -1, t, e, -n, s, r, 5),
			this.setIndex(h),
			this.setAttribute("position", new ve(l, 3)),
			this.setAttribute("normal", new ve(d, 3)),
			this.setAttribute("uv", new ve(c, 2))
		function g(_, p, u, b, T, S, C, w, E, D, v) {
			const y = S / E,
				R = C / D,
				L = S / 2,
				N = C / 2,
				z = w / 2,
				H = E + 1,
				W = D + 1
			let j = 0,
				V = 0
			const rt = new U()
			for (let ht = 0; ht < W; ht++) {
				const Et = ht * R - N
				for (let zt = 0; zt < H; zt++) {
					const ee = zt * y - L
					;(rt[_] = ee * b),
						(rt[p] = Et * T),
						(rt[u] = z),
						l.push(rt.x, rt.y, rt.z),
						(rt[_] = 0),
						(rt[p] = 0),
						(rt[u] = w > 0 ? 1 : -1),
						d.push(rt.x, rt.y, rt.z),
						c.push(zt / E),
						c.push(1 - ht / D),
						(j += 1)
				}
			}
			for (let ht = 0; ht < D; ht++)
				for (let Et = 0; Et < E; Et++) {
					const zt = f + Et + H * ht,
						ee = f + Et + H * (ht + 1),
						se = f + (Et + 1) + H * (ht + 1),
						jt = f + (Et + 1) + H * ht
					h.push(zt, ee, jt), h.push(ee, se, jt), (V += 6)
				}
			a.addGroup(m, V, v), (m += V), (f += j)
		}
	}
	copy(t) {
		return (
			super.copy(t), (this.parameters = Object.assign({}, t.parameters)), this
		)
	}
	static fromJSON(t) {
		return new fi(
			t.width,
			t.height,
			t.depth,
			t.widthSegments,
			t.heightSegments,
			t.depthSegments
		)
	}
}
function Vi(i) {
	const t = {}
	for (const e in i) {
		t[e] = {}
		for (const n in i[e]) {
			const s = i[e][n]
			s &&
			(s.isColor ||
				s.isMatrix3 ||
				s.isMatrix4 ||
				s.isVector2 ||
				s.isVector3 ||
				s.isVector4 ||
				s.isTexture ||
				s.isQuaternion)
				? s.isRenderTargetTexture
					? (console.warn(
							"UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."
					  ),
					  (t[e][n] = null))
					: (t[e][n] = s.clone())
				: Array.isArray(s)
				? (t[e][n] = s.slice())
				: (t[e][n] = s)
		}
	}
	return t
}
function Ne(i) {
	const t = {}
	for (let e = 0; e < i.length; e++) {
		const n = Vi(i[e])
		for (const s in n) t[s] = n[s]
	}
	return t
}
function tu(i) {
	const t = []
	for (let e = 0; e < i.length; e++) t.push(i[e].clone())
	return t
}
function sc(i) {
	const t = i.getRenderTarget()
	return t === null
		? i.outputColorSpace
		: t.isXRRenderTarget === !0
		? t.texture.colorSpace
		: Xt.workingColorSpace
}
const eu = { clone: Vi, merge: Ne }
var nu = `void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,
	iu = `void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`
class $n extends mi {
	constructor(t) {
		super(),
			(this.isShaderMaterial = !0),
			(this.type = "ShaderMaterial"),
			(this.defines = {}),
			(this.uniforms = {}),
			(this.uniformsGroups = []),
			(this.vertexShader = nu),
			(this.fragmentShader = iu),
			(this.linewidth = 1),
			(this.wireframe = !1),
			(this.wireframeLinewidth = 1),
			(this.fog = !1),
			(this.lights = !1),
			(this.clipping = !1),
			(this.forceSinglePass = !0),
			(this.extensions = { clipCullDistance: !1, multiDraw: !1 }),
			(this.defaultAttributeValues = {
				color: [1, 1, 1],
				uv: [0, 0],
				uv1: [0, 0],
			}),
			(this.index0AttributeName = void 0),
			(this.uniformsNeedUpdate = !1),
			(this.glslVersion = null),
			t !== void 0 && this.setValues(t)
	}
	copy(t) {
		return (
			super.copy(t),
			(this.fragmentShader = t.fragmentShader),
			(this.vertexShader = t.vertexShader),
			(this.uniforms = Vi(t.uniforms)),
			(this.uniformsGroups = tu(t.uniformsGroups)),
			(this.defines = Object.assign({}, t.defines)),
			(this.wireframe = t.wireframe),
			(this.wireframeLinewidth = t.wireframeLinewidth),
			(this.fog = t.fog),
			(this.lights = t.lights),
			(this.clipping = t.clipping),
			(this.extensions = Object.assign({}, t.extensions)),
			(this.glslVersion = t.glslVersion),
			this
		)
	}
	toJSON(t) {
		const e = super.toJSON(t)
		;(e.glslVersion = this.glslVersion), (e.uniforms = {})
		for (const s in this.uniforms) {
			const o = this.uniforms[s].value
			o && o.isTexture
				? (e.uniforms[s] = { type: "t", value: o.toJSON(t).uuid })
				: o && o.isColor
				? (e.uniforms[s] = { type: "c", value: o.getHex() })
				: o && o.isVector2
				? (e.uniforms[s] = { type: "v2", value: o.toArray() })
				: o && o.isVector3
				? (e.uniforms[s] = { type: "v3", value: o.toArray() })
				: o && o.isVector4
				? (e.uniforms[s] = { type: "v4", value: o.toArray() })
				: o && o.isMatrix3
				? (e.uniforms[s] = { type: "m3", value: o.toArray() })
				: o && o.isMatrix4
				? (e.uniforms[s] = { type: "m4", value: o.toArray() })
				: (e.uniforms[s] = { value: o })
		}
		Object.keys(this.defines).length > 0 && (e.defines = this.defines),
			(e.vertexShader = this.vertexShader),
			(e.fragmentShader = this.fragmentShader),
			(e.lights = this.lights),
			(e.clipping = this.clipping)
		const n = {}
		for (const s in this.extensions) this.extensions[s] === !0 && (n[s] = !0)
		return Object.keys(n).length > 0 && (e.extensions = n), e
	}
}
class rc extends Te {
	constructor() {
		super(),
			(this.isCamera = !0),
			(this.type = "Camera"),
			(this.matrixWorldInverse = new le()),
			(this.projectionMatrix = new le()),
			(this.projectionMatrixInverse = new le()),
			(this.coordinateSystem = vn),
			(this._reversedDepth = !1)
	}
	get reversedDepth() {
		return this._reversedDepth
	}
	copy(t, e) {
		return (
			super.copy(t, e),
			this.matrixWorldInverse.copy(t.matrixWorldInverse),
			this.projectionMatrix.copy(t.projectionMatrix),
			this.projectionMatrixInverse.copy(t.projectionMatrixInverse),
			(this.coordinateSystem = t.coordinateSystem),
			this
		)
	}
	getWorldDirection(t) {
		return super.getWorldDirection(t).negate()
	}
	updateMatrixWorld(t) {
		super.updateMatrixWorld(t),
			this.matrixWorldInverse.copy(this.matrixWorld).invert()
	}
	updateWorldMatrix(t, e) {
		super.updateWorldMatrix(t, e),
			this.matrixWorldInverse.copy(this.matrixWorld).invert()
	}
	clone() {
		return new this.constructor().copy(this)
	}
}
const zn = new U(),
	Va = new Dt(),
	Wa = new Dt()
class je extends rc {
	constructor(t = 50, e = 1, n = 0.1, s = 2e3) {
		super(),
			(this.isPerspectiveCamera = !0),
			(this.type = "PerspectiveCamera"),
			(this.fov = t),
			(this.zoom = 1),
			(this.near = n),
			(this.far = s),
			(this.focus = 10),
			(this.aspect = e),
			(this.view = null),
			(this.filmGauge = 35),
			(this.filmOffset = 0),
			this.updateProjectionMatrix()
	}
	copy(t, e) {
		return (
			super.copy(t, e),
			(this.fov = t.fov),
			(this.zoom = t.zoom),
			(this.near = t.near),
			(this.far = t.far),
			(this.focus = t.focus),
			(this.aspect = t.aspect),
			(this.view = t.view === null ? null : Object.assign({}, t.view)),
			(this.filmGauge = t.filmGauge),
			(this.filmOffset = t.filmOffset),
			this
		)
	}
	setFocalLength(t) {
		const e = (0.5 * this.getFilmHeight()) / t
		;(this.fov = Yo * 2 * Math.atan(e)), this.updateProjectionMatrix()
	}
	getFocalLength() {
		const t = Math.tan(rs * 0.5 * this.fov)
		return (0.5 * this.getFilmHeight()) / t
	}
	getEffectiveFOV() {
		return Yo * 2 * Math.atan(Math.tan(rs * 0.5 * this.fov) / this.zoom)
	}
	getFilmWidth() {
		return this.filmGauge * Math.min(this.aspect, 1)
	}
	getFilmHeight() {
		return this.filmGauge / Math.max(this.aspect, 1)
	}
	getViewBounds(t, e, n) {
		zn.set(-1, -1, 0.5).applyMatrix4(this.projectionMatrixInverse),
			e.set(zn.x, zn.y).multiplyScalar(-t / zn.z),
			zn.set(1, 1, 0.5).applyMatrix4(this.projectionMatrixInverse),
			n.set(zn.x, zn.y).multiplyScalar(-t / zn.z)
	}
	getViewSize(t, e) {
		return this.getViewBounds(t, Va, Wa), e.subVectors(Wa, Va)
	}
	setViewOffset(t, e, n, s, r, o) {
		;(this.aspect = t / e),
			this.view === null &&
				(this.view = {
					enabled: !0,
					fullWidth: 1,
					fullHeight: 1,
					offsetX: 0,
					offsetY: 0,
					width: 1,
					height: 1,
				}),
			(this.view.enabled = !0),
			(this.view.fullWidth = t),
			(this.view.fullHeight = e),
			(this.view.offsetX = n),
			(this.view.offsetY = s),
			(this.view.width = r),
			(this.view.height = o),
			this.updateProjectionMatrix()
	}
	clearViewOffset() {
		this.view !== null && (this.view.enabled = !1),
			this.updateProjectionMatrix()
	}
	updateProjectionMatrix() {
		const t = this.near
		let e = (t * Math.tan(rs * 0.5 * this.fov)) / this.zoom,
			n = 2 * e,
			s = this.aspect * n,
			r = -0.5 * s
		const o = this.view
		if (this.view !== null && this.view.enabled) {
			const h = o.fullWidth,
				l = o.fullHeight
			;(r += (o.offsetX * s) / h),
				(e -= (o.offsetY * n) / l),
				(s *= o.width / h),
				(n *= o.height / l)
		}
		const a = this.filmOffset
		a !== 0 && (r += (t * a) / this.getFilmWidth()),
			this.projectionMatrix.makePerspective(
				r,
				r + s,
				e,
				e - n,
				t,
				this.far,
				this.coordinateSystem,
				this.reversedDepth
			),
			this.projectionMatrixInverse.copy(this.projectionMatrix).invert()
	}
	toJSON(t) {
		const e = super.toJSON(t)
		return (
			(e.object.fov = this.fov),
			(e.object.zoom = this.zoom),
			(e.object.near = this.near),
			(e.object.far = this.far),
			(e.object.focus = this.focus),
			(e.object.aspect = this.aspect),
			this.view !== null && (e.object.view = Object.assign({}, this.view)),
			(e.object.filmGauge = this.filmGauge),
			(e.object.filmOffset = this.filmOffset),
			e
		)
	}
}
const Ri = -90,
	Ci = 1
class oc extends Te {
	constructor(t, e, n) {
		super(),
			(this.type = "CubeCamera"),
			(this.renderTarget = n),
			(this.coordinateSystem = null),
			(this.activeMipmapLevel = 0)
		const s = new je(Ri, Ci, t, e)
		;(s.layers = this.layers), this.add(s)
		const r = new je(Ri, Ci, t, e)
		;(r.layers = this.layers), this.add(r)
		const o = new je(Ri, Ci, t, e)
		;(o.layers = this.layers), this.add(o)
		const a = new je(Ri, Ci, t, e)
		;(a.layers = this.layers), this.add(a)
		const h = new je(Ri, Ci, t, e)
		;(h.layers = this.layers), this.add(h)
		const l = new je(Ri, Ci, t, e)
		;(l.layers = this.layers), this.add(l)
	}
	updateCoordinateSystem() {
		const t = this.coordinateSystem,
			e = this.children.concat(),
			[n, s, r, o, a, h] = e
		for (const l of e) this.remove(l)
		if (t === vn)
			n.up.set(0, 1, 0),
				n.lookAt(1, 0, 0),
				s.up.set(0, 1, 0),
				s.lookAt(-1, 0, 0),
				r.up.set(0, 0, -1),
				r.lookAt(0, 1, 0),
				o.up.set(0, 0, 1),
				o.lookAt(0, -1, 0),
				a.up.set(0, 1, 0),
				a.lookAt(0, 0, 1),
				h.up.set(0, 1, 0),
				h.lookAt(0, 0, -1)
		else if (t === cr)
			n.up.set(0, -1, 0),
				n.lookAt(-1, 0, 0),
				s.up.set(0, -1, 0),
				s.lookAt(1, 0, 0),
				r.up.set(0, 0, 1),
				r.lookAt(0, 1, 0),
				o.up.set(0, 0, -1),
				o.lookAt(0, -1, 0),
				a.up.set(0, -1, 0),
				a.lookAt(0, 0, 1),
				h.up.set(0, -1, 0),
				h.lookAt(0, 0, -1)
		else
			throw new Error(
				"THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: " +
					t
			)
		for (const l of e) this.add(l), l.updateMatrixWorld()
	}
	update(t, e) {
		this.parent === null && this.updateMatrixWorld()
		const { renderTarget: n, activeMipmapLevel: s } = this
		this.coordinateSystem !== t.coordinateSystem &&
			((this.coordinateSystem = t.coordinateSystem),
			this.updateCoordinateSystem())
		const [r, o, a, h, l, d] = this.children,
			c = t.getRenderTarget(),
			f = t.getActiveCubeFace(),
			m = t.getActiveMipmapLevel(),
			g = t.xr.enabled
		t.xr.enabled = !1
		const _ = n.texture.generateMipmaps
		;(n.texture.generateMipmaps = !1),
			t.setRenderTarget(n, 0, s),
			t.render(e, r),
			t.setRenderTarget(n, 1, s),
			t.render(e, o),
			t.setRenderTarget(n, 2, s),
			t.render(e, a),
			t.setRenderTarget(n, 3, s),
			t.render(e, h),
			t.setRenderTarget(n, 4, s),
			t.render(e, l),
			(n.texture.generateMipmaps = _),
			t.setRenderTarget(n, 5, s),
			t.render(e, d),
			t.setRenderTarget(c, f, m),
			(t.xr.enabled = g),
			(n.texture.needsPMREMUpdate = !0)
	}
}
class ac extends Oe {
	constructor(t = [], e = Hi, n, s, r, o, a, h, l, d) {
		super(t, e, n, s, r, o, a, h, l, d),
			(this.isCubeTexture = !0),
			(this.flipY = !1)
	}
	get images() {
		return this.image
	}
	set images(t) {
		this.image = t
	}
}
class lc extends di {
	constructor(t = 1, e = {}) {
		super(t, t, e), (this.isWebGLCubeRenderTarget = !0)
		const n = { width: t, height: t, depth: 1 },
			s = [n, n, n, n, n, n]
		;(this.texture = new ac(s)),
			this._setTextureOptions(e),
			(this.texture.isRenderTargetTexture = !0)
	}
	fromEquirectangularTexture(t, e) {
		;(this.texture.type = e.type),
			(this.texture.colorSpace = e.colorSpace),
			(this.texture.generateMipmaps = e.generateMipmaps),
			(this.texture.minFilter = e.minFilter),
			(this.texture.magFilter = e.magFilter)
		const n = {
				uniforms: { tEquirect: { value: null } },
				vertexShader: `

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,
				fragmentShader: `

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`,
			},
			s = new fi(5, 5, 5),
			r = new $n({
				name: "CubemapFromEquirect",
				uniforms: Vi(n.uniforms),
				vertexShader: n.vertexShader,
				fragmentShader: n.fragmentShader,
				side: Ie,
				blending: Xn,
			})
		r.uniforms.tEquirect.value = e
		const o = new Zt(s, r),
			a = e.minFilter
		return (
			e.minFilter === Vn && (e.minFilter = rn),
			new oc(1, 10, this).update(t, o),
			(e.minFilter = a),
			o.geometry.dispose(),
			o.material.dispose(),
			this
		)
	}
	clear(t, e = !0, n = !0, s = !0) {
		const r = t.getRenderTarget()
		for (let o = 0; o < 6; o++) t.setRenderTarget(this, o), t.clear(e, n, s)
		t.setRenderTarget(r)
	}
}
class Wn extends Te {
	constructor() {
		super(), (this.isGroup = !0), (this.type = "Group")
	}
}
const su = { type: "move" }
class Yr {
	constructor() {
		;(this._targetRay = null), (this._grip = null), (this._hand = null)
	}
	getHandSpace() {
		return (
			this._hand === null &&
				((this._hand = new Wn()),
				(this._hand.matrixAutoUpdate = !1),
				(this._hand.visible = !1),
				(this._hand.joints = {}),
				(this._hand.inputState = { pinching: !1 })),
			this._hand
		)
	}
	getTargetRaySpace() {
		return (
			this._targetRay === null &&
				((this._targetRay = new Wn()),
				(this._targetRay.matrixAutoUpdate = !1),
				(this._targetRay.visible = !1),
				(this._targetRay.hasLinearVelocity = !1),
				(this._targetRay.linearVelocity = new U()),
				(this._targetRay.hasAngularVelocity = !1),
				(this._targetRay.angularVelocity = new U())),
			this._targetRay
		)
	}
	getGripSpace() {
		return (
			this._grip === null &&
				((this._grip = new Wn()),
				(this._grip.matrixAutoUpdate = !1),
				(this._grip.visible = !1),
				(this._grip.hasLinearVelocity = !1),
				(this._grip.linearVelocity = new U()),
				(this._grip.hasAngularVelocity = !1),
				(this._grip.angularVelocity = new U())),
			this._grip
		)
	}
	dispatchEvent(t) {
		return (
			this._targetRay !== null && this._targetRay.dispatchEvent(t),
			this._grip !== null && this._grip.dispatchEvent(t),
			this._hand !== null && this._hand.dispatchEvent(t),
			this
		)
	}
	connect(t) {
		if (t && t.hand) {
			const e = this._hand
			if (e) for (const n of t.hand.values()) this._getHandJoint(e, n)
		}
		return this.dispatchEvent({ type: "connected", data: t }), this
	}
	disconnect(t) {
		return (
			this.dispatchEvent({ type: "disconnected", data: t }),
			this._targetRay !== null && (this._targetRay.visible = !1),
			this._grip !== null && (this._grip.visible = !1),
			this._hand !== null && (this._hand.visible = !1),
			this
		)
	}
	update(t, e, n) {
		let s = null,
			r = null,
			o = null
		const a = this._targetRay,
			h = this._grip,
			l = this._hand
		if (t && e.session.visibilityState !== "visible-blurred") {
			if (l && t.hand) {
				o = !0
				for (const _ of t.hand.values()) {
					const p = e.getJointPose(_, n),
						u = this._getHandJoint(l, _)
					p !== null &&
						(u.matrix.fromArray(p.transform.matrix),
						u.matrix.decompose(u.position, u.rotation, u.scale),
						(u.matrixWorldNeedsUpdate = !0),
						(u.jointRadius = p.radius)),
						(u.visible = p !== null)
				}
				const d = l.joints["index-finger-tip"],
					c = l.joints["thumb-tip"],
					f = d.position.distanceTo(c.position),
					m = 0.02,
					g = 0.005
				l.inputState.pinching && f > m + g
					? ((l.inputState.pinching = !1),
					  this.dispatchEvent({
							type: "pinchend",
							handedness: t.handedness,
							target: this,
					  }))
					: !l.inputState.pinching &&
					  f <= m - g &&
					  ((l.inputState.pinching = !0),
					  this.dispatchEvent({
							type: "pinchstart",
							handedness: t.handedness,
							target: this,
					  }))
			} else
				h !== null &&
					t.gripSpace &&
					((r = e.getPose(t.gripSpace, n)),
					r !== null &&
						(h.matrix.fromArray(r.transform.matrix),
						h.matrix.decompose(h.position, h.rotation, h.scale),
						(h.matrixWorldNeedsUpdate = !0),
						r.linearVelocity
							? ((h.hasLinearVelocity = !0),
							  h.linearVelocity.copy(r.linearVelocity))
							: (h.hasLinearVelocity = !1),
						r.angularVelocity
							? ((h.hasAngularVelocity = !0),
							  h.angularVelocity.copy(r.angularVelocity))
							: (h.hasAngularVelocity = !1)))
			a !== null &&
				((s = e.getPose(t.targetRaySpace, n)),
				s === null && r !== null && (s = r),
				s !== null &&
					(a.matrix.fromArray(s.transform.matrix),
					a.matrix.decompose(a.position, a.rotation, a.scale),
					(a.matrixWorldNeedsUpdate = !0),
					s.linearVelocity
						? ((a.hasLinearVelocity = !0),
						  a.linearVelocity.copy(s.linearVelocity))
						: (a.hasLinearVelocity = !1),
					s.angularVelocity
						? ((a.hasAngularVelocity = !0),
						  a.angularVelocity.copy(s.angularVelocity))
						: (a.hasAngularVelocity = !1),
					this.dispatchEvent(su)))
		}
		return (
			a !== null && (a.visible = s !== null),
			h !== null && (h.visible = r !== null),
			l !== null && (l.visible = o !== null),
			this
		)
	}
	_getHandJoint(t, e) {
		if (t.joints[e.jointName] === void 0) {
			const n = new Wn()
			;(n.matrixAutoUpdate = !1),
				(n.visible = !1),
				(t.joints[e.jointName] = n),
				t.add(n)
		}
		return t.joints[e.jointName]
	}
}
class cc extends Te {
	constructor() {
		super(),
			(this.isScene = !0),
			(this.type = "Scene"),
			(this.background = null),
			(this.environment = null),
			(this.fog = null),
			(this.backgroundBlurriness = 0),
			(this.backgroundIntensity = 1),
			(this.backgroundRotation = new yn()),
			(this.environmentIntensity = 1),
			(this.environmentRotation = new yn()),
			(this.overrideMaterial = null),
			typeof __THREE_DEVTOOLS__ < "u" &&
				__THREE_DEVTOOLS__.dispatchEvent(
					new CustomEvent("observe", { detail: this })
				)
	}
	copy(t, e) {
		return (
			super.copy(t, e),
			t.background !== null && (this.background = t.background.clone()),
			t.environment !== null && (this.environment = t.environment.clone()),
			t.fog !== null && (this.fog = t.fog.clone()),
			(this.backgroundBlurriness = t.backgroundBlurriness),
			(this.backgroundIntensity = t.backgroundIntensity),
			this.backgroundRotation.copy(t.backgroundRotation),
			(this.environmentIntensity = t.environmentIntensity),
			this.environmentRotation.copy(t.environmentRotation),
			t.overrideMaterial !== null &&
				(this.overrideMaterial = t.overrideMaterial.clone()),
			(this.matrixAutoUpdate = t.matrixAutoUpdate),
			this
		)
	}
	toJSON(t) {
		const e = super.toJSON(t)
		return (
			this.fog !== null && (e.object.fog = this.fog.toJSON()),
			this.backgroundBlurriness > 0 &&
				(e.object.backgroundBlurriness = this.backgroundBlurriness),
			this.backgroundIntensity !== 1 &&
				(e.object.backgroundIntensity = this.backgroundIntensity),
			(e.object.backgroundRotation = this.backgroundRotation.toArray()),
			this.environmentIntensity !== 1 &&
				(e.object.environmentIntensity = this.environmentIntensity),
			(e.object.environmentRotation = this.environmentRotation.toArray()),
			e
		)
	}
}
const qr = new U(),
	ru = new U(),
	ou = new Nt()
class Dn {
	constructor(t = new U(1, 0, 0), e = 0) {
		;(this.isPlane = !0), (this.normal = t), (this.constant = e)
	}
	set(t, e) {
		return this.normal.copy(t), (this.constant = e), this
	}
	setComponents(t, e, n, s) {
		return this.normal.set(t, e, n), (this.constant = s), this
	}
	setFromNormalAndCoplanarPoint(t, e) {
		return this.normal.copy(t), (this.constant = -e.dot(this.normal)), this
	}
	setFromCoplanarPoints(t, e, n) {
		const s = qr.subVectors(n, e).cross(ru.subVectors(t, e)).normalize()
		return this.setFromNormalAndCoplanarPoint(s, t), this
	}
	copy(t) {
		return this.normal.copy(t.normal), (this.constant = t.constant), this
	}
	normalize() {
		const t = 1 / this.normal.length()
		return this.normal.multiplyScalar(t), (this.constant *= t), this
	}
	negate() {
		return (this.constant *= -1), this.normal.negate(), this
	}
	distanceToPoint(t) {
		return this.normal.dot(t) + this.constant
	}
	distanceToSphere(t) {
		return this.distanceToPoint(t.center) - t.radius
	}
	projectPoint(t, e) {
		return e.copy(t).addScaledVector(this.normal, -this.distanceToPoint(t))
	}
	intersectLine(t, e) {
		const n = t.delta(qr),
			s = this.normal.dot(n)
		if (s === 0)
			return this.distanceToPoint(t.start) === 0 ? e.copy(t.start) : null
		const r = -(t.start.dot(this.normal) + this.constant) / s
		return r < 0 || r > 1 ? null : e.copy(t.start).addScaledVector(n, r)
	}
	intersectsLine(t) {
		const e = this.distanceToPoint(t.start),
			n = this.distanceToPoint(t.end)
		return (e < 0 && n > 0) || (n < 0 && e > 0)
	}
	intersectsBox(t) {
		return t.intersectsPlane(this)
	}
	intersectsSphere(t) {
		return t.intersectsPlane(this)
	}
	coplanarPoint(t) {
		return t.copy(this.normal).multiplyScalar(-this.constant)
	}
	applyMatrix4(t, e) {
		const n = e || ou.getNormalMatrix(t),
			s = this.coplanarPoint(qr).applyMatrix4(t),
			r = this.normal.applyMatrix3(n).normalize()
		return (this.constant = -s.dot(r)), this
	}
	translate(t) {
		return (this.constant -= t.dot(this.normal)), this
	}
	equals(t) {
		return t.normal.equals(this.normal) && t.constant === this.constant
	}
	clone() {
		return new this.constructor().copy(this)
	}
}
const ii = new _s(),
	au = new Dt(0.5, 0.5),
	Hs = new U()
class ra {
	constructor(
		t = new Dn(),
		e = new Dn(),
		n = new Dn(),
		s = new Dn(),
		r = new Dn(),
		o = new Dn()
	) {
		this.planes = [t, e, n, s, r, o]
	}
	set(t, e, n, s, r, o) {
		const a = this.planes
		return (
			a[0].copy(t),
			a[1].copy(e),
			a[2].copy(n),
			a[3].copy(s),
			a[4].copy(r),
			a[5].copy(o),
			this
		)
	}
	copy(t) {
		const e = this.planes
		for (let n = 0; n < 6; n++) e[n].copy(t.planes[n])
		return this
	}
	setFromProjectionMatrix(t, e = vn, n = !1) {
		const s = this.planes,
			r = t.elements,
			o = r[0],
			a = r[1],
			h = r[2],
			l = r[3],
			d = r[4],
			c = r[5],
			f = r[6],
			m = r[7],
			g = r[8],
			_ = r[9],
			p = r[10],
			u = r[11],
			b = r[12],
			T = r[13],
			S = r[14],
			C = r[15]
		if (
			(s[0].setComponents(l - o, m - d, u - g, C - b).normalize(),
			s[1].setComponents(l + o, m + d, u + g, C + b).normalize(),
			s[2].setComponents(l + a, m + c, u + _, C + T).normalize(),
			s[3].setComponents(l - a, m - c, u - _, C - T).normalize(),
			n)
		)
			s[4].setComponents(h, f, p, S).normalize(),
				s[5].setComponents(l - h, m - f, u - p, C - S).normalize()
		else if (
			(s[4].setComponents(l - h, m - f, u - p, C - S).normalize(), e === vn)
		)
			s[5].setComponents(l + h, m + f, u + p, C + S).normalize()
		else if (e === cr) s[5].setComponents(h, f, p, S).normalize()
		else
			throw new Error(
				"THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: " +
					e
			)
		return this
	}
	intersectsObject(t) {
		if (t.boundingSphere !== void 0)
			t.boundingSphere === null && t.computeBoundingSphere(),
				ii.copy(t.boundingSphere).applyMatrix4(t.matrixWorld)
		else {
			const e = t.geometry
			e.boundingSphere === null && e.computeBoundingSphere(),
				ii.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)
		}
		return this.intersectsSphere(ii)
	}
	intersectsSprite(t) {
		ii.center.set(0, 0, 0)
		const e = au.distanceTo(t.center)
		return (
			(ii.radius = 0.7071067811865476 + e),
			ii.applyMatrix4(t.matrixWorld),
			this.intersectsSphere(ii)
		)
	}
	intersectsSphere(t) {
		const e = this.planes,
			n = t.center,
			s = -t.radius
		for (let r = 0; r < 6; r++) if (e[r].distanceToPoint(n) < s) return !1
		return !0
	}
	intersectsBox(t) {
		const e = this.planes
		for (let n = 0; n < 6; n++) {
			const s = e[n]
			if (
				((Hs.x = s.normal.x > 0 ? t.max.x : t.min.x),
				(Hs.y = s.normal.y > 0 ? t.max.y : t.min.y),
				(Hs.z = s.normal.z > 0 ? t.max.z : t.min.z),
				s.distanceToPoint(Hs) < 0)
			)
				return !1
		}
		return !0
	}
	containsPoint(t) {
		const e = this.planes
		for (let n = 0; n < 6; n++) if (e[n].distanceToPoint(t) < 0) return !1
		return !0
	}
	clone() {
		return new this.constructor().copy(this)
	}
}
class hc extends mi {
	constructor(t) {
		super(),
			(this.isLineBasicMaterial = !0),
			(this.type = "LineBasicMaterial"),
			(this.color = new Bt(16777215)),
			(this.map = null),
			(this.linewidth = 1),
			(this.linecap = "round"),
			(this.linejoin = "round"),
			(this.fog = !0),
			this.setValues(t)
	}
	copy(t) {
		return (
			super.copy(t),
			this.color.copy(t.color),
			(this.map = t.map),
			(this.linewidth = t.linewidth),
			(this.linecap = t.linecap),
			(this.linejoin = t.linejoin),
			(this.fog = t.fog),
			this
		)
	}
}
const ur = new U(),
	dr = new U(),
	Xa = new le(),
	Qi = new xs(),
	ks = new _s(),
	jr = new U(),
	Ya = new U()
class lu extends Te {
	constructor(t = new Be(), e = new hc()) {
		super(),
			(this.isLine = !0),
			(this.type = "Line"),
			(this.geometry = t),
			(this.material = e),
			(this.morphTargetDictionary = void 0),
			(this.morphTargetInfluences = void 0),
			this.updateMorphTargets()
	}
	copy(t, e) {
		return (
			super.copy(t, e),
			(this.material = Array.isArray(t.material)
				? t.material.slice()
				: t.material),
			(this.geometry = t.geometry),
			this
		)
	}
	computeLineDistances() {
		const t = this.geometry
		if (t.index === null) {
			const e = t.attributes.position,
				n = [0]
			for (let s = 1, r = e.count; s < r; s++)
				ur.fromBufferAttribute(e, s - 1),
					dr.fromBufferAttribute(e, s),
					(n[s] = n[s - 1]),
					(n[s] += ur.distanceTo(dr))
			t.setAttribute("lineDistance", new ve(n, 1))
		} else
			console.warn(
				"THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry."
			)
		return this
	}
	raycast(t, e) {
		const n = this.geometry,
			s = this.matrixWorld,
			r = t.params.Line.threshold,
			o = n.drawRange
		if (
			(n.boundingSphere === null && n.computeBoundingSphere(),
			ks.copy(n.boundingSphere),
			ks.applyMatrix4(s),
			(ks.radius += r),
			t.ray.intersectsSphere(ks) === !1)
		)
			return
		Xa.copy(s).invert(), Qi.copy(t.ray).applyMatrix4(Xa)
		const a = r / ((this.scale.x + this.scale.y + this.scale.z) / 3),
			h = a * a,
			l = this.isLineSegments ? 2 : 1,
			d = n.index,
			f = n.attributes.position
		if (d !== null) {
			const m = Math.max(0, o.start),
				g = Math.min(d.count, o.start + o.count)
			for (let _ = m, p = g - 1; _ < p; _ += l) {
				const u = d.getX(_),
					b = d.getX(_ + 1),
					T = Gs(this, t, Qi, h, u, b, _)
				T && e.push(T)
			}
			if (this.isLineLoop) {
				const _ = d.getX(g - 1),
					p = d.getX(m),
					u = Gs(this, t, Qi, h, _, p, g - 1)
				u && e.push(u)
			}
		} else {
			const m = Math.max(0, o.start),
				g = Math.min(f.count, o.start + o.count)
			for (let _ = m, p = g - 1; _ < p; _ += l) {
				const u = Gs(this, t, Qi, h, _, _ + 1, _)
				u && e.push(u)
			}
			if (this.isLineLoop) {
				const _ = Gs(this, t, Qi, h, g - 1, m, g - 1)
				_ && e.push(_)
			}
		}
	}
	updateMorphTargets() {
		const e = this.geometry.morphAttributes,
			n = Object.keys(e)
		if (n.length > 0) {
			const s = e[n[0]]
			if (s !== void 0) {
				;(this.morphTargetInfluences = []), (this.morphTargetDictionary = {})
				for (let r = 0, o = s.length; r < o; r++) {
					const a = s[r].name || String(r)
					this.morphTargetInfluences.push(0),
						(this.morphTargetDictionary[a] = r)
				}
			}
		}
	}
}
function Gs(i, t, e, n, s, r, o) {
	const a = i.geometry.attributes.position
	if (
		(ur.fromBufferAttribute(a, s),
		dr.fromBufferAttribute(a, r),
		e.distanceSqToSegment(ur, dr, jr, Ya) > n)
	)
		return
	jr.applyMatrix4(i.matrixWorld)
	const l = t.ray.origin.distanceTo(jr)
	if (!(l < t.near || l > t.far))
		return {
			distance: l,
			point: Ya.clone().applyMatrix4(i.matrixWorld),
			index: o,
			face: null,
			faceIndex: null,
			barycoord: null,
			object: i,
		}
}
const qa = new U(),
	ja = new U()
class cu extends lu {
	constructor(t, e) {
		super(t, e), (this.isLineSegments = !0), (this.type = "LineSegments")
	}
	computeLineDistances() {
		const t = this.geometry
		if (t.index === null) {
			const e = t.attributes.position,
				n = []
			for (let s = 0, r = e.count; s < r; s += 2)
				qa.fromBufferAttribute(e, s),
					ja.fromBufferAttribute(e, s + 1),
					(n[s] = s === 0 ? 0 : n[s - 1]),
					(n[s + 1] = n[s] + qa.distanceTo(ja))
			t.setAttribute("lineDistance", new ve(n, 1))
		} else
			console.warn(
				"THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry."
			)
		return this
	}
}
class uc extends mi {
	constructor(t) {
		super(),
			(this.isPointsMaterial = !0),
			(this.type = "PointsMaterial"),
			(this.color = new Bt(16777215)),
			(this.map = null),
			(this.alphaMap = null),
			(this.size = 1),
			(this.sizeAttenuation = !0),
			(this.fog = !0),
			this.setValues(t)
	}
	copy(t) {
		return (
			super.copy(t),
			this.color.copy(t.color),
			(this.map = t.map),
			(this.alphaMap = t.alphaMap),
			(this.size = t.size),
			(this.sizeAttenuation = t.sizeAttenuation),
			(this.fog = t.fog),
			this
		)
	}
}
const Ka = new le(),
	qo = new xs(),
	Vs = new _s(),
	Ws = new U()
class hu extends Te {
	constructor(t = new Be(), e = new uc()) {
		super(),
			(this.isPoints = !0),
			(this.type = "Points"),
			(this.geometry = t),
			(this.material = e),
			(this.morphTargetDictionary = void 0),
			(this.morphTargetInfluences = void 0),
			this.updateMorphTargets()
	}
	copy(t, e) {
		return (
			super.copy(t, e),
			(this.material = Array.isArray(t.material)
				? t.material.slice()
				: t.material),
			(this.geometry = t.geometry),
			this
		)
	}
	raycast(t, e) {
		const n = this.geometry,
			s = this.matrixWorld,
			r = t.params.Points.threshold,
			o = n.drawRange
		if (
			(n.boundingSphere === null && n.computeBoundingSphere(),
			Vs.copy(n.boundingSphere),
			Vs.applyMatrix4(s),
			(Vs.radius += r),
			t.ray.intersectsSphere(Vs) === !1)
		)
			return
		Ka.copy(s).invert(), qo.copy(t.ray).applyMatrix4(Ka)
		const a = r / ((this.scale.x + this.scale.y + this.scale.z) / 3),
			h = a * a,
			l = n.index,
			c = n.attributes.position
		if (l !== null) {
			const f = Math.max(0, o.start),
				m = Math.min(l.count, o.start + o.count)
			for (let g = f, _ = m; g < _; g++) {
				const p = l.getX(g)
				Ws.fromBufferAttribute(c, p), Za(Ws, p, h, s, t, e, this)
			}
		} else {
			const f = Math.max(0, o.start),
				m = Math.min(c.count, o.start + o.count)
			for (let g = f, _ = m; g < _; g++)
				Ws.fromBufferAttribute(c, g), Za(Ws, g, h, s, t, e, this)
		}
	}
	updateMorphTargets() {
		const e = this.geometry.morphAttributes,
			n = Object.keys(e)
		if (n.length > 0) {
			const s = e[n[0]]
			if (s !== void 0) {
				;(this.morphTargetInfluences = []), (this.morphTargetDictionary = {})
				for (let r = 0, o = s.length; r < o; r++) {
					const a = s[r].name || String(r)
					this.morphTargetInfluences.push(0),
						(this.morphTargetDictionary[a] = r)
				}
			}
		}
	}
}
function Za(i, t, e, n, s, r, o) {
	const a = qo.distanceSqToPoint(i)
	if (a < e) {
		const h = new U()
		qo.closestPointToPoint(i, h), h.applyMatrix4(n)
		const l = s.ray.origin.distanceTo(h)
		if (l < s.near || l > s.far) return
		r.push({
			distance: l,
			distanceToRay: Math.sqrt(a),
			point: h,
			index: t,
			face: null,
			faceIndex: null,
			barycoord: null,
			object: o,
		})
	}
}
class vs extends Oe {
	constructor(t, e, n, s, r, o, a, h, l) {
		super(t, e, n, s, r, o, a, h, l),
			(this.isCanvasTexture = !0),
			(this.needsUpdate = !0)
	}
}
class dc extends Oe {
	constructor(t, e, n = ui, s, r, o, a = dn, h = dn, l, d = ls, c = 1) {
		if (d !== ls && d !== cs)
			throw new Error(
				"DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat"
			)
		const f = { width: t, height: e, depth: c }
		super(f, s, r, o, a, h, d, n, l),
			(this.isDepthTexture = !0),
			(this.flipY = !1),
			(this.generateMipmaps = !1),
			(this.compareFunction = null)
	}
	copy(t) {
		return (
			super.copy(t),
			(this.source = new ia(Object.assign({}, t.image))),
			(this.compareFunction = t.compareFunction),
			this
		)
	}
	toJSON(t) {
		const e = super.toJSON(t)
		return (
			this.compareFunction !== null &&
				(e.compareFunction = this.compareFunction),
			e
		)
	}
}
class fc extends Oe {
	constructor(t = null) {
		super(), (this.sourceTexture = t), (this.isExternalTexture = !0)
	}
	copy(t) {
		return super.copy(t), (this.sourceTexture = t.sourceTexture), this
	}
}
class oa extends Be {
	constructor(
		t = 1,
		e = 1,
		n = 1,
		s = 32,
		r = 1,
		o = !1,
		a = 0,
		h = Math.PI * 2
	) {
		super(),
			(this.type = "CylinderGeometry"),
			(this.parameters = {
				radiusTop: t,
				radiusBottom: e,
				height: n,
				radialSegments: s,
				heightSegments: r,
				openEnded: o,
				thetaStart: a,
				thetaLength: h,
			})
		const l = this
		;(s = Math.floor(s)), (r = Math.floor(r))
		const d = [],
			c = [],
			f = [],
			m = []
		let g = 0
		const _ = [],
			p = n / 2
		let u = 0
		b(),
			o === !1 && (t > 0 && T(!0), e > 0 && T(!1)),
			this.setIndex(d),
			this.setAttribute("position", new ve(c, 3)),
			this.setAttribute("normal", new ve(f, 3)),
			this.setAttribute("uv", new ve(m, 2))
		function b() {
			const S = new U(),
				C = new U()
			let w = 0
			const E = (e - t) / n
			for (let D = 0; D <= r; D++) {
				const v = [],
					y = D / r,
					R = y * (e - t) + t
				for (let L = 0; L <= s; L++) {
					const N = L / s,
						z = N * h + a,
						H = Math.sin(z),
						W = Math.cos(z)
					;(C.x = R * H),
						(C.y = -y * n + p),
						(C.z = R * W),
						c.push(C.x, C.y, C.z),
						S.set(H, E, W).normalize(),
						f.push(S.x, S.y, S.z),
						m.push(N, 1 - y),
						v.push(g++)
				}
				_.push(v)
			}
			for (let D = 0; D < s; D++)
				for (let v = 0; v < r; v++) {
					const y = _[v][D],
						R = _[v + 1][D],
						L = _[v + 1][D + 1],
						N = _[v][D + 1]
					;(t > 0 || v !== 0) && (d.push(y, R, N), (w += 3)),
						(e > 0 || v !== r - 1) && (d.push(R, L, N), (w += 3))
				}
			l.addGroup(u, w, 0), (u += w)
		}
		function T(S) {
			const C = g,
				w = new Dt(),
				E = new U()
			let D = 0
			const v = S === !0 ? t : e,
				y = S === !0 ? 1 : -1
			for (let L = 1; L <= s; L++)
				c.push(0, p * y, 0), f.push(0, y, 0), m.push(0.5, 0.5), g++
			const R = g
			for (let L = 0; L <= s; L++) {
				const z = (L / s) * h + a,
					H = Math.cos(z),
					W = Math.sin(z)
				;(E.x = v * W),
					(E.y = p * y),
					(E.z = v * H),
					c.push(E.x, E.y, E.z),
					f.push(0, y, 0),
					(w.x = H * 0.5 + 0.5),
					(w.y = W * 0.5 * y + 0.5),
					m.push(w.x, w.y),
					g++
			}
			for (let L = 0; L < s; L++) {
				const N = C + L,
					z = R + L
				S === !0 ? d.push(z, z + 1, N) : d.push(z + 1, z, N), (D += 3)
			}
			l.addGroup(u, D, S === !0 ? 1 : 2), (u += D)
		}
	}
	copy(t) {
		return (
			super.copy(t), (this.parameters = Object.assign({}, t.parameters)), this
		)
	}
	static fromJSON(t) {
		return new oa(
			t.radiusTop,
			t.radiusBottom,
			t.height,
			t.radialSegments,
			t.heightSegments,
			t.openEnded,
			t.thetaStart,
			t.thetaLength
		)
	}
}
const Xs = new U(),
	Ys = new U(),
	Kr = new U(),
	qs = new sn()
class uu extends Be {
	constructor(t = null, e = 1) {
		if (
			(super(),
			(this.type = "EdgesGeometry"),
			(this.parameters = { geometry: t, thresholdAngle: e }),
			t !== null)
		) {
			const s = Math.pow(10, 4),
				r = Math.cos(rs * e),
				o = t.getIndex(),
				a = t.getAttribute("position"),
				h = o ? o.count : a.count,
				l = [0, 0, 0],
				d = ["a", "b", "c"],
				c = new Array(3),
				f = {},
				m = []
			for (let g = 0; g < h; g += 3) {
				o
					? ((l[0] = o.getX(g)), (l[1] = o.getX(g + 1)), (l[2] = o.getX(g + 2)))
					: ((l[0] = g), (l[1] = g + 1), (l[2] = g + 2))
				const { a: _, b: p, c: u } = qs
				if (
					(_.fromBufferAttribute(a, l[0]),
					p.fromBufferAttribute(a, l[1]),
					u.fromBufferAttribute(a, l[2]),
					qs.getNormal(Kr),
					(c[0] = `${Math.round(_.x * s)},${Math.round(_.y * s)},${Math.round(
						_.z * s
					)}`),
					(c[1] = `${Math.round(p.x * s)},${Math.round(p.y * s)},${Math.round(
						p.z * s
					)}`),
					(c[2] = `${Math.round(u.x * s)},${Math.round(u.y * s)},${Math.round(
						u.z * s
					)}`),
					!(c[0] === c[1] || c[1] === c[2] || c[2] === c[0]))
				)
					for (let b = 0; b < 3; b++) {
						const T = (b + 1) % 3,
							S = c[b],
							C = c[T],
							w = qs[d[b]],
							E = qs[d[T]],
							D = `${S}_${C}`,
							v = `${C}_${S}`
						v in f && f[v]
							? (Kr.dot(f[v].normal) <= r &&
									(m.push(w.x, w.y, w.z), m.push(E.x, E.y, E.z)),
							  (f[v] = null))
							: D in f ||
							  (f[D] = { index0: l[b], index1: l[T], normal: Kr.clone() })
					}
			}
			for (const g in f)
				if (f[g]) {
					const { index0: _, index1: p } = f[g]
					Xs.fromBufferAttribute(a, _),
						Ys.fromBufferAttribute(a, p),
						m.push(Xs.x, Xs.y, Xs.z),
						m.push(Ys.x, Ys.y, Ys.z)
				}
			this.setAttribute("position", new ve(m, 3))
		}
	}
	copy(t) {
		return (
			super.copy(t), (this.parameters = Object.assign({}, t.parameters)), this
		)
	}
}
class Sn extends Be {
	constructor(t = 1, e = 1, n = 1, s = 1) {
		super(),
			(this.type = "PlaneGeometry"),
			(this.parameters = {
				width: t,
				height: e,
				widthSegments: n,
				heightSegments: s,
			})
		const r = t / 2,
			o = e / 2,
			a = Math.floor(n),
			h = Math.floor(s),
			l = a + 1,
			d = h + 1,
			c = t / a,
			f = e / h,
			m = [],
			g = [],
			_ = [],
			p = []
		for (let u = 0; u < d; u++) {
			const b = u * f - o
			for (let T = 0; T < l; T++) {
				const S = T * c - r
				g.push(S, -b, 0), _.push(0, 0, 1), p.push(T / a), p.push(1 - u / h)
			}
		}
		for (let u = 0; u < h; u++)
			for (let b = 0; b < a; b++) {
				const T = b + l * u,
					S = b + l * (u + 1),
					C = b + 1 + l * (u + 1),
					w = b + 1 + l * u
				m.push(T, S, w), m.push(S, C, w)
			}
		this.setIndex(m),
			this.setAttribute("position", new ve(g, 3)),
			this.setAttribute("normal", new ve(_, 3)),
			this.setAttribute("uv", new ve(p, 2))
	}
	copy(t) {
		return (
			super.copy(t), (this.parameters = Object.assign({}, t.parameters)), this
		)
	}
	static fromJSON(t) {
		return new Sn(t.width, t.height, t.widthSegments, t.heightSegments)
	}
}
class qn extends Be {
	constructor(
		t = 1,
		e = 32,
		n = 16,
		s = 0,
		r = Math.PI * 2,
		o = 0,
		a = Math.PI
	) {
		super(),
			(this.type = "SphereGeometry"),
			(this.parameters = {
				radius: t,
				widthSegments: e,
				heightSegments: n,
				phiStart: s,
				phiLength: r,
				thetaStart: o,
				thetaLength: a,
			}),
			(e = Math.max(3, Math.floor(e))),
			(n = Math.max(2, Math.floor(n)))
		const h = Math.min(o + a, Math.PI)
		let l = 0
		const d = [],
			c = new U(),
			f = new U(),
			m = [],
			g = [],
			_ = [],
			p = []
		for (let u = 0; u <= n; u++) {
			const b = [],
				T = u / n
			let S = 0
			u === 0 && o === 0
				? (S = 0.5 / e)
				: u === n && h === Math.PI && (S = -0.5 / e)
			for (let C = 0; C <= e; C++) {
				const w = C / e
				;(c.x = -t * Math.cos(s + w * r) * Math.sin(o + T * a)),
					(c.y = t * Math.cos(o + T * a)),
					(c.z = t * Math.sin(s + w * r) * Math.sin(o + T * a)),
					g.push(c.x, c.y, c.z),
					f.copy(c).normalize(),
					_.push(f.x, f.y, f.z),
					p.push(w + S, 1 - T),
					b.push(l++)
			}
			d.push(b)
		}
		for (let u = 0; u < n; u++)
			for (let b = 0; b < e; b++) {
				const T = d[u][b + 1],
					S = d[u][b],
					C = d[u + 1][b],
					w = d[u + 1][b + 1]
				;(u !== 0 || o > 0) && m.push(T, S, w),
					(u !== n - 1 || h < Math.PI) && m.push(S, C, w)
			}
		this.setIndex(m),
			this.setAttribute("position", new ve(g, 3)),
			this.setAttribute("normal", new ve(_, 3)),
			this.setAttribute("uv", new ve(p, 2))
	}
	copy(t) {
		return (
			super.copy(t), (this.parameters = Object.assign({}, t.parameters)), this
		)
	}
	static fromJSON(t) {
		return new qn(
			t.radius,
			t.widthSegments,
			t.heightSegments,
			t.phiStart,
			t.phiLength,
			t.thetaStart,
			t.thetaLength
		)
	}
}
class us extends Be {
	constructor(t = 1, e = 0.4, n = 12, s = 48, r = Math.PI * 2) {
		super(),
			(this.type = "TorusGeometry"),
			(this.parameters = {
				radius: t,
				tube: e,
				radialSegments: n,
				tubularSegments: s,
				arc: r,
			}),
			(n = Math.floor(n)),
			(s = Math.floor(s))
		const o = [],
			a = [],
			h = [],
			l = [],
			d = new U(),
			c = new U(),
			f = new U()
		for (let m = 0; m <= n; m++)
			for (let g = 0; g <= s; g++) {
				const _ = (g / s) * r,
					p = (m / n) * Math.PI * 2
				;(c.x = (t + e * Math.cos(p)) * Math.cos(_)),
					(c.y = (t + e * Math.cos(p)) * Math.sin(_)),
					(c.z = e * Math.sin(p)),
					a.push(c.x, c.y, c.z),
					(d.x = t * Math.cos(_)),
					(d.y = t * Math.sin(_)),
					f.subVectors(c, d).normalize(),
					h.push(f.x, f.y, f.z),
					l.push(g / s),
					l.push(m / n)
			}
		for (let m = 1; m <= n; m++)
			for (let g = 1; g <= s; g++) {
				const _ = (s + 1) * m + g - 1,
					p = (s + 1) * (m - 1) + g - 1,
					u = (s + 1) * (m - 1) + g,
					b = (s + 1) * m + g
				o.push(_, p, b), o.push(p, u, b)
			}
		this.setIndex(o),
			this.setAttribute("position", new ve(a, 3)),
			this.setAttribute("normal", new ve(h, 3)),
			this.setAttribute("uv", new ve(l, 2))
	}
	copy(t) {
		return (
			super.copy(t), (this.parameters = Object.assign({}, t.parameters)), this
		)
	}
	static fromJSON(t) {
		return new us(t.radius, t.tube, t.radialSegments, t.tubularSegments, t.arc)
	}
}
class Wi extends mi {
	constructor(t) {
		super(),
			(this.isMeshStandardMaterial = !0),
			(this.type = "MeshStandardMaterial"),
			(this.defines = { STANDARD: "" }),
			(this.color = new Bt(16777215)),
			(this.roughness = 1),
			(this.metalness = 0),
			(this.map = null),
			(this.lightMap = null),
			(this.lightMapIntensity = 1),
			(this.aoMap = null),
			(this.aoMapIntensity = 1),
			(this.emissive = new Bt(0)),
			(this.emissiveIntensity = 1),
			(this.emissiveMap = null),
			(this.bumpMap = null),
			(this.bumpScale = 1),
			(this.normalMap = null),
			(this.normalMapType = $l),
			(this.normalScale = new Dt(1, 1)),
			(this.displacementMap = null),
			(this.displacementScale = 1),
			(this.displacementBias = 0),
			(this.roughnessMap = null),
			(this.metalnessMap = null),
			(this.alphaMap = null),
			(this.envMap = null),
			(this.envMapRotation = new yn()),
			(this.envMapIntensity = 1),
			(this.wireframe = !1),
			(this.wireframeLinewidth = 1),
			(this.wireframeLinecap = "round"),
			(this.wireframeLinejoin = "round"),
			(this.flatShading = !1),
			(this.fog = !0),
			this.setValues(t)
	}
	copy(t) {
		return (
			super.copy(t),
			(this.defines = { STANDARD: "" }),
			this.color.copy(t.color),
			(this.roughness = t.roughness),
			(this.metalness = t.metalness),
			(this.map = t.map),
			(this.lightMap = t.lightMap),
			(this.lightMapIntensity = t.lightMapIntensity),
			(this.aoMap = t.aoMap),
			(this.aoMapIntensity = t.aoMapIntensity),
			this.emissive.copy(t.emissive),
			(this.emissiveMap = t.emissiveMap),
			(this.emissiveIntensity = t.emissiveIntensity),
			(this.bumpMap = t.bumpMap),
			(this.bumpScale = t.bumpScale),
			(this.normalMap = t.normalMap),
			(this.normalMapType = t.normalMapType),
			this.normalScale.copy(t.normalScale),
			(this.displacementMap = t.displacementMap),
			(this.displacementScale = t.displacementScale),
			(this.displacementBias = t.displacementBias),
			(this.roughnessMap = t.roughnessMap),
			(this.metalnessMap = t.metalnessMap),
			(this.alphaMap = t.alphaMap),
			(this.envMap = t.envMap),
			this.envMapRotation.copy(t.envMapRotation),
			(this.envMapIntensity = t.envMapIntensity),
			(this.wireframe = t.wireframe),
			(this.wireframeLinewidth = t.wireframeLinewidth),
			(this.wireframeLinecap = t.wireframeLinecap),
			(this.wireframeLinejoin = t.wireframeLinejoin),
			(this.flatShading = t.flatShading),
			(this.fog = t.fog),
			this
		)
	}
}
class du extends mi {
	constructor(t) {
		super(),
			(this.isMeshDepthMaterial = !0),
			(this.type = "MeshDepthMaterial"),
			(this.depthPacking = Eh),
			(this.map = null),
			(this.alphaMap = null),
			(this.displacementMap = null),
			(this.displacementScale = 1),
			(this.displacementBias = 0),
			(this.wireframe = !1),
			(this.wireframeLinewidth = 1),
			this.setValues(t)
	}
	copy(t) {
		return (
			super.copy(t),
			(this.depthPacking = t.depthPacking),
			(this.map = t.map),
			(this.alphaMap = t.alphaMap),
			(this.displacementMap = t.displacementMap),
			(this.displacementScale = t.displacementScale),
			(this.displacementBias = t.displacementBias),
			(this.wireframe = t.wireframe),
			(this.wireframeLinewidth = t.wireframeLinewidth),
			this
		)
	}
}
class fu extends mi {
	constructor(t) {
		super(),
			(this.isMeshDistanceMaterial = !0),
			(this.type = "MeshDistanceMaterial"),
			(this.map = null),
			(this.alphaMap = null),
			(this.displacementMap = null),
			(this.displacementScale = 1),
			(this.displacementBias = 0),
			this.setValues(t)
	}
	copy(t) {
		return (
			super.copy(t),
			(this.map = t.map),
			(this.alphaMap = t.alphaMap),
			(this.displacementMap = t.displacementMap),
			(this.displacementScale = t.displacementScale),
			(this.displacementBias = t.displacementBias),
			this
		)
	}
}
class pc extends Te {
	constructor(t, e = 1) {
		super(),
			(this.isLight = !0),
			(this.type = "Light"),
			(this.color = new Bt(t)),
			(this.intensity = e)
	}
	dispose() {}
	copy(t, e) {
		return (
			super.copy(t, e),
			this.color.copy(t.color),
			(this.intensity = t.intensity),
			this
		)
	}
	toJSON(t) {
		const e = super.toJSON(t)
		return (
			(e.object.color = this.color.getHex()),
			(e.object.intensity = this.intensity),
			this.groundColor !== void 0 &&
				(e.object.groundColor = this.groundColor.getHex()),
			this.distance !== void 0 && (e.object.distance = this.distance),
			this.angle !== void 0 && (e.object.angle = this.angle),
			this.decay !== void 0 && (e.object.decay = this.decay),
			this.penumbra !== void 0 && (e.object.penumbra = this.penumbra),
			this.shadow !== void 0 && (e.object.shadow = this.shadow.toJSON()),
			this.target !== void 0 && (e.object.target = this.target.uuid),
			e
		)
	}
}
const Zr = new le(),
	$a = new U(),
	Ja = new U()
class pu {
	constructor(t) {
		;(this.camera = t),
			(this.intensity = 1),
			(this.bias = 0),
			(this.normalBias = 0),
			(this.radius = 1),
			(this.blurSamples = 8),
			(this.mapSize = new Dt(512, 512)),
			(this.mapType = Mn),
			(this.map = null),
			(this.mapPass = null),
			(this.matrix = new le()),
			(this.autoUpdate = !0),
			(this.needsUpdate = !1),
			(this._frustum = new ra()),
			(this._frameExtents = new Dt(1, 1)),
			(this._viewportCount = 1),
			(this._viewports = [new de(0, 0, 1, 1)])
	}
	getViewportCount() {
		return this._viewportCount
	}
	getFrustum() {
		return this._frustum
	}
	updateMatrices(t) {
		const e = this.camera,
			n = this.matrix
		$a.setFromMatrixPosition(t.matrixWorld),
			e.position.copy($a),
			Ja.setFromMatrixPosition(t.target.matrixWorld),
			e.lookAt(Ja),
			e.updateMatrixWorld(),
			Zr.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse),
			this._frustum.setFromProjectionMatrix(
				Zr,
				e.coordinateSystem,
				e.reversedDepth
			),
			e.reversedDepth
				? n.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 1, 0, 0, 0, 0, 1)
				: n.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1),
			n.multiply(Zr)
	}
	getViewport(t) {
		return this._viewports[t]
	}
	getFrameExtents() {
		return this._frameExtents
	}
	dispose() {
		this.map && this.map.dispose(), this.mapPass && this.mapPass.dispose()
	}
	copy(t) {
		return (
			(this.camera = t.camera.clone()),
			(this.intensity = t.intensity),
			(this.bias = t.bias),
			(this.radius = t.radius),
			(this.autoUpdate = t.autoUpdate),
			(this.needsUpdate = t.needsUpdate),
			(this.normalBias = t.normalBias),
			(this.blurSamples = t.blurSamples),
			this.mapSize.copy(t.mapSize),
			this
		)
	}
	clone() {
		return new this.constructor().copy(this)
	}
	toJSON() {
		const t = {}
		return (
			this.intensity !== 1 && (t.intensity = this.intensity),
			this.bias !== 0 && (t.bias = this.bias),
			this.normalBias !== 0 && (t.normalBias = this.normalBias),
			this.radius !== 1 && (t.radius = this.radius),
			(this.mapSize.x !== 512 || this.mapSize.y !== 512) &&
				(t.mapSize = this.mapSize.toArray()),
			(t.camera = this.camera.toJSON(!1).object),
			delete t.camera.matrix,
			t
		)
	}
}
class mc extends rc {
	constructor(t = -1, e = 1, n = 1, s = -1, r = 0.1, o = 2e3) {
		super(),
			(this.isOrthographicCamera = !0),
			(this.type = "OrthographicCamera"),
			(this.zoom = 1),
			(this.view = null),
			(this.left = t),
			(this.right = e),
			(this.top = n),
			(this.bottom = s),
			(this.near = r),
			(this.far = o),
			this.updateProjectionMatrix()
	}
	copy(t, e) {
		return (
			super.copy(t, e),
			(this.left = t.left),
			(this.right = t.right),
			(this.top = t.top),
			(this.bottom = t.bottom),
			(this.near = t.near),
			(this.far = t.far),
			(this.zoom = t.zoom),
			(this.view = t.view === null ? null : Object.assign({}, t.view)),
			this
		)
	}
	setViewOffset(t, e, n, s, r, o) {
		this.view === null &&
			(this.view = {
				enabled: !0,
				fullWidth: 1,
				fullHeight: 1,
				offsetX: 0,
				offsetY: 0,
				width: 1,
				height: 1,
			}),
			(this.view.enabled = !0),
			(this.view.fullWidth = t),
			(this.view.fullHeight = e),
			(this.view.offsetX = n),
			(this.view.offsetY = s),
			(this.view.width = r),
			(this.view.height = o),
			this.updateProjectionMatrix()
	}
	clearViewOffset() {
		this.view !== null && (this.view.enabled = !1),
			this.updateProjectionMatrix()
	}
	updateProjectionMatrix() {
		const t = (this.right - this.left) / (2 * this.zoom),
			e = (this.top - this.bottom) / (2 * this.zoom),
			n = (this.right + this.left) / 2,
			s = (this.top + this.bottom) / 2
		let r = n - t,
			o = n + t,
			a = s + e,
			h = s - e
		if (this.view !== null && this.view.enabled) {
			const l = (this.right - this.left) / this.view.fullWidth / this.zoom,
				d = (this.top - this.bottom) / this.view.fullHeight / this.zoom
			;(r += l * this.view.offsetX),
				(o = r + l * this.view.width),
				(a -= d * this.view.offsetY),
				(h = a - d * this.view.height)
		}
		this.projectionMatrix.makeOrthographic(
			r,
			o,
			a,
			h,
			this.near,
			this.far,
			this.coordinateSystem,
			this.reversedDepth
		),
			this.projectionMatrixInverse.copy(this.projectionMatrix).invert()
	}
	toJSON(t) {
		const e = super.toJSON(t)
		return (
			(e.object.zoom = this.zoom),
			(e.object.left = this.left),
			(e.object.right = this.right),
			(e.object.top = this.top),
			(e.object.bottom = this.bottom),
			(e.object.near = this.near),
			(e.object.far = this.far),
			this.view !== null && (e.object.view = Object.assign({}, this.view)),
			e
		)
	}
}
class mu extends pu {
	constructor() {
		super(new mc(-5, 5, 5, -5, 0.5, 500)), (this.isDirectionalLightShadow = !0)
	}
}
class gc extends pc {
	constructor(t, e) {
		super(t, e),
			(this.isDirectionalLight = !0),
			(this.type = "DirectionalLight"),
			this.position.copy(Te.DEFAULT_UP),
			this.updateMatrix(),
			(this.target = new Te()),
			(this.shadow = new mu())
	}
	dispose() {
		this.shadow.dispose()
	}
	copy(t) {
		return (
			super.copy(t),
			(this.target = t.target.clone()),
			(this.shadow = t.shadow.clone()),
			this
		)
	}
}
class _c extends pc {
	constructor(t, e) {
		super(t, e), (this.isAmbientLight = !0), (this.type = "AmbientLight")
	}
}
class gu extends je {
	constructor(t = []) {
		super(),
			(this.isArrayCamera = !0),
			(this.isMultiViewCamera = !1),
			(this.cameras = t)
	}
}
const Qa = new le()
class _u {
	constructor(t, e, n = 0, s = 1 / 0) {
		;(this.ray = new xs(t, e)),
			(this.near = n),
			(this.far = s),
			(this.camera = null),
			(this.layers = new sa()),
			(this.params = {
				Mesh: {},
				Line: { threshold: 1 },
				LOD: {},
				Points: { threshold: 1 },
				Sprite: {},
			})
	}
	set(t, e) {
		this.ray.set(t, e)
	}
	setFromCamera(t, e) {
		e.isPerspectiveCamera
			? (this.ray.origin.setFromMatrixPosition(e.matrixWorld),
			  this.ray.direction
					.set(t.x, t.y, 0.5)
					.unproject(e)
					.sub(this.ray.origin)
					.normalize(),
			  (this.camera = e))
			: e.isOrthographicCamera
			? (this.ray.origin
					.set(t.x, t.y, (e.near + e.far) / (e.near - e.far))
					.unproject(e),
			  this.ray.direction.set(0, 0, -1).transformDirection(e.matrixWorld),
			  (this.camera = e))
			: console.error("THREE.Raycaster: Unsupported camera type: " + e.type)
	}
	setFromXRController(t) {
		return (
			Qa.identity().extractRotation(t.matrixWorld),
			this.ray.origin.setFromMatrixPosition(t.matrixWorld),
			this.ray.direction.set(0, 0, -1).applyMatrix4(Qa),
			this
		)
	}
	intersectObject(t, e = !0, n = []) {
		return jo(t, this, n, e), n.sort(tl), n
	}
	intersectObjects(t, e = !0, n = []) {
		for (let s = 0, r = t.length; s < r; s++) jo(t[s], this, n, e)
		return n.sort(tl), n
	}
}
function tl(i, t) {
	return i.distance - t.distance
}
function jo(i, t, e, n) {
	let s = !0
	if (
		(i.layers.test(t.layers) && i.raycast(t, e) === !1 && (s = !1),
		s === !0 && n === !0)
	) {
		const r = i.children
		for (let o = 0, a = r.length; o < a; o++) jo(r[o], t, e, !0)
	}
}
class el {
	constructor(t = 1, e = 0, n = 0) {
		;(this.radius = t), (this.phi = e), (this.theta = n)
	}
	set(t, e, n) {
		return (this.radius = t), (this.phi = e), (this.theta = n), this
	}
	copy(t) {
		return (
			(this.radius = t.radius), (this.phi = t.phi), (this.theta = t.theta), this
		)
	}
	makeSafe() {
		return (this.phi = Ht(this.phi, 1e-6, Math.PI - 1e-6)), this
	}
	setFromVector3(t) {
		return this.setFromCartesianCoords(t.x, t.y, t.z)
	}
	setFromCartesianCoords(t, e, n) {
		return (
			(this.radius = Math.sqrt(t * t + e * e + n * n)),
			this.radius === 0
				? ((this.theta = 0), (this.phi = 0))
				: ((this.theta = Math.atan2(t, n)),
				  (this.phi = Math.acos(Ht(e / this.radius, -1, 1)))),
			this
		)
	}
	clone() {
		return new this.constructor().copy(this)
	}
}
class xu extends pi {
	constructor(t, e = null) {
		super(),
			(this.object = t),
			(this.domElement = e),
			(this.enabled = !0),
			(this.state = -1),
			(this.keys = {}),
			(this.mouseButtons = { LEFT: null, MIDDLE: null, RIGHT: null }),
			(this.touches = { ONE: null, TWO: null })
	}
	connect(t) {
		if (t === void 0) {
			console.warn("THREE.Controls: connect() now requires an element.")
			return
		}
		this.domElement !== null && this.disconnect(), (this.domElement = t)
	}
	disconnect() {}
	dispose() {}
	update() {}
}
function nl(i, t, e, n) {
	const s = vu(n)
	switch (e) {
		case ql:
			return i * t
		case Kl:
			return ((i * t) / s.components) * s.byteLength
		case ta:
			return ((i * t) / s.components) * s.byteLength
		case Zl:
			return ((i * t * 2) / s.components) * s.byteLength
		case ea:
			return ((i * t * 2) / s.components) * s.byteLength
		case jl:
			return ((i * t * 3) / s.components) * s.byteLength
		case on:
			return ((i * t * 4) / s.components) * s.byteLength
		case na:
			return ((i * t * 4) / s.components) * s.byteLength
		case tr:
		case er:
			return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 8
		case nr:
		case ir:
			return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 16
		case vo:
		case yo:
			return (Math.max(i, 16) * Math.max(t, 8)) / 4
		case xo:
		case Mo:
			return (Math.max(i, 8) * Math.max(t, 8)) / 2
		case So:
		case Eo:
			return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 8
		case bo:
			return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 16
		case To:
			return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 16
		case Ao:
			return Math.floor((i + 4) / 5) * Math.floor((t + 3) / 4) * 16
		case wo:
			return Math.floor((i + 4) / 5) * Math.floor((t + 4) / 5) * 16
		case Ro:
			return Math.floor((i + 5) / 6) * Math.floor((t + 4) / 5) * 16
		case Co:
			return Math.floor((i + 5) / 6) * Math.floor((t + 5) / 6) * 16
		case Po:
			return Math.floor((i + 7) / 8) * Math.floor((t + 4) / 5) * 16
		case Do:
			return Math.floor((i + 7) / 8) * Math.floor((t + 5) / 6) * 16
		case Lo:
			return Math.floor((i + 7) / 8) * Math.floor((t + 7) / 8) * 16
		case Io:
			return Math.floor((i + 9) / 10) * Math.floor((t + 4) / 5) * 16
		case Uo:
			return Math.floor((i + 9) / 10) * Math.floor((t + 5) / 6) * 16
		case No:
			return Math.floor((i + 9) / 10) * Math.floor((t + 7) / 8) * 16
		case Fo:
			return Math.floor((i + 9) / 10) * Math.floor((t + 9) / 10) * 16
		case Oo:
			return Math.floor((i + 11) / 12) * Math.floor((t + 9) / 10) * 16
		case Bo:
			return Math.floor((i + 11) / 12) * Math.floor((t + 11) / 12) * 16
		case zo:
		case Ho:
		case ko:
			return Math.ceil(i / 4) * Math.ceil(t / 4) * 16
		case Go:
		case Vo:
			return Math.ceil(i / 4) * Math.ceil(t / 4) * 8
		case Wo:
		case Xo:
			return Math.ceil(i / 4) * Math.ceil(t / 4) * 16
	}
	throw new Error(`Unable to determine texture byte length for ${e} format.`)
}
function vu(i) {
	switch (i) {
		case Mn:
		case Vl:
			return { byteLength: 1, components: 1 }
		case os:
		case Wl:
		case ms:
			return { byteLength: 2, components: 1 }
		case Jo:
		case Qo:
			return { byteLength: 2, components: 4 }
		case ui:
		case $o:
		case xn:
			return { byteLength: 4, components: 1 }
		case Xl:
		case Yl:
			return { byteLength: 4, components: 3 }
	}
	throw new Error(`Unknown texture type ${i}.`)
}
typeof __THREE_DEVTOOLS__ < "u" &&
	__THREE_DEVTOOLS__.dispatchEvent(
		new CustomEvent("register", { detail: { revision: Zo } })
	)
typeof window < "u" &&
	(window.__THREE__
		? console.warn("WARNING: Multiple instances of Three.js being imported.")
		: (window.__THREE__ = Zo))
/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */ function xc() {
	let i = null,
		t = !1,
		e = null,
		n = null
	function s(r, o) {
		e(r, o), (n = i.requestAnimationFrame(s))
	}
	return {
		start: function () {
			t !== !0 && e !== null && ((n = i.requestAnimationFrame(s)), (t = !0))
		},
		stop: function () {
			i.cancelAnimationFrame(n), (t = !1)
		},
		setAnimationLoop: function (r) {
			e = r
		},
		setContext: function (r) {
			i = r
		},
	}
}
function Mu(i) {
	const t = new WeakMap()
	function e(a, h) {
		const l = a.array,
			d = a.usage,
			c = l.byteLength,
			f = i.createBuffer()
		i.bindBuffer(h, f), i.bufferData(h, l, d), a.onUploadCallback()
		let m
		if (l instanceof Float32Array) m = i.FLOAT
		else if (typeof Float16Array < "u" && l instanceof Float16Array)
			m = i.HALF_FLOAT
		else if (l instanceof Uint16Array)
			a.isFloat16BufferAttribute ? (m = i.HALF_FLOAT) : (m = i.UNSIGNED_SHORT)
		else if (l instanceof Int16Array) m = i.SHORT
		else if (l instanceof Uint32Array) m = i.UNSIGNED_INT
		else if (l instanceof Int32Array) m = i.INT
		else if (l instanceof Int8Array) m = i.BYTE
		else if (l instanceof Uint8Array) m = i.UNSIGNED_BYTE
		else if (l instanceof Uint8ClampedArray) m = i.UNSIGNED_BYTE
		else
			throw new Error(
				"THREE.WebGLAttributes: Unsupported buffer data format: " + l
			)
		return {
			buffer: f,
			type: m,
			bytesPerElement: l.BYTES_PER_ELEMENT,
			version: a.version,
			size: c,
		}
	}
	function n(a, h, l) {
		const d = h.array,
			c = h.updateRanges
		if ((i.bindBuffer(l, a), c.length === 0)) i.bufferSubData(l, 0, d)
		else {
			c.sort((m, g) => m.start - g.start)
			let f = 0
			for (let m = 1; m < c.length; m++) {
				const g = c[f],
					_ = c[m]
				_.start <= g.start + g.count + 1
					? (g.count = Math.max(g.count, _.start + _.count - g.start))
					: (++f, (c[f] = _))
			}
			c.length = f + 1
			for (let m = 0, g = c.length; m < g; m++) {
				const _ = c[m]
				i.bufferSubData(l, _.start * d.BYTES_PER_ELEMENT, d, _.start, _.count)
			}
			h.clearUpdateRanges()
		}
		h.onUploadCallback()
	}
	function s(a) {
		return a.isInterleavedBufferAttribute && (a = a.data), t.get(a)
	}
	function r(a) {
		a.isInterleavedBufferAttribute && (a = a.data)
		const h = t.get(a)
		h && (i.deleteBuffer(h.buffer), t.delete(a))
	}
	function o(a, h) {
		if (
			(a.isInterleavedBufferAttribute && (a = a.data), a.isGLBufferAttribute)
		) {
			const d = t.get(a)
			;(!d || d.version < a.version) &&
				t.set(a, {
					buffer: a.buffer,
					type: a.type,
					bytesPerElement: a.elementSize,
					version: a.version,
				})
			return
		}
		const l = t.get(a)
		if (l === void 0) t.set(a, e(a, h))
		else if (l.version < a.version) {
			if (l.size !== a.array.byteLength)
				throw new Error(
					"THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported."
				)
			n(l.buffer, a, h), (l.version = a.version)
		}
	}
	return { get: s, remove: r, update: o }
}
var yu = `#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,
	Su = `#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,
	Eu = `#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,
	bu = `#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,
	Tu = `#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,
	Au = `#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,
	wu = `#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,
	Ru = `#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,
	Cu = `#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,
	Pu = `#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,
	Du = `vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,
	Lu = `vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,
	Iu = `float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,
	Uu = `#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,
	Nu = `#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,
	Fu = `#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,
	Ou = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,
	Bu = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,
	zu = `#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,
	Hu = `#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,
	ku = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,
	Gu = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,
	Vu = `#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,
	Wu = `#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,
	Xu = `#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,
	Yu = `vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,
	qu = `#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,
	ju = `#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,
	Ku = `#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,
	Zu = `#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,
	$u = "gl_FragColor = linearToOutputTexel( gl_FragColor );",
	Ju = `vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,
	Qu = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,
	td = `#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,
	ed = `#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,
	nd = `#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,
	id = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,
	sd = `#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,
	rd = `#ifdef USE_FOG
	varying float vFogDepth;
#endif`,
	od = `#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,
	ad = `#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,
	ld = `#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,
	cd = `#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,
	hd = `LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,
	ud = `varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,
	dd = `uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,
	fd = `#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,
	pd = `ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,
	md = `varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,
	gd = `BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,
	_d = `varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,
	xd = `PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,
	vd = `struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,
	Md = `
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,
	yd = `#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,
	Sd = `#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,
	Ed = `#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,
	bd = `#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,
	Td = `#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,
	Ad = `#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,
	wd = `#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,
	Rd = `#ifdef USE_MAP
	uniform sampler2D map;
#endif`,
	Cd = `#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,
	Pd = `#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,
	Dd = `float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,
	Ld = `#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,
	Id = `#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,
	Ud = `#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,
	Nd = `#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,
	Fd = `#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,
	Od = `#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,
	Bd = `float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,
	zd = `#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,
	Hd = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,
	kd = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,
	Gd = `#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,
	Vd = `#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,
	Wd = `#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,
	Xd = `#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,
	Yd = `#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,
	qd = `#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,
	jd = `#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,
	Kd = `vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,
	Zd = `#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,
	$d = `vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,
	Jd = `#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,
	Qd = `#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,
	tf = `float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,
	ef = `#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,
	nf = `#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,
	sf = `#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,
	rf = `#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,
	of = `float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,
	af = `#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,
	lf = `#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,
	cf = `#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,
	hf = `#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,
	uf = `float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,
	df = `#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,
	ff = `#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,
	pf = `#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,
	mf = `#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,
	gf = `#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,
	_f = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,
	xf = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,
	vf = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,
	Mf = `#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`
const yf = `varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,
	Sf = `uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
	Ef = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,
	bf = `#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
	Tf = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,
	Af = `uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
	wf = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,
	Rf = `#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,
	Cf = `#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,
	Pf = `#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,
	Df = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,
	Lf = `uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
	If = `uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,
	Uf = `uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,
	Nf = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,
	Ff = `uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
	Of = `#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
	Bf = `#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
	zf = `#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,
	Hf = `#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
	kf = `#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,
	Gf = `#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,
	Vf = `#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
	Wf = `#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
	Xf = `#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,
	Yf = `#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
	qf = `#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
	jf = `#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
	Kf = `uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,
	Zf = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,
	$f = `#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
	Jf = `uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,
	Qf = `uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,
	tp = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,
	Ot = {
		alphahash_fragment: yu,
		alphahash_pars_fragment: Su,
		alphamap_fragment: Eu,
		alphamap_pars_fragment: bu,
		alphatest_fragment: Tu,
		alphatest_pars_fragment: Au,
		aomap_fragment: wu,
		aomap_pars_fragment: Ru,
		batching_pars_vertex: Cu,
		batching_vertex: Pu,
		begin_vertex: Du,
		beginnormal_vertex: Lu,
		bsdfs: Iu,
		iridescence_fragment: Uu,
		bumpmap_pars_fragment: Nu,
		clipping_planes_fragment: Fu,
		clipping_planes_pars_fragment: Ou,
		clipping_planes_pars_vertex: Bu,
		clipping_planes_vertex: zu,
		color_fragment: Hu,
		color_pars_fragment: ku,
		color_pars_vertex: Gu,
		color_vertex: Vu,
		common: Wu,
		cube_uv_reflection_fragment: Xu,
		defaultnormal_vertex: Yu,
		displacementmap_pars_vertex: qu,
		displacementmap_vertex: ju,
		emissivemap_fragment: Ku,
		emissivemap_pars_fragment: Zu,
		colorspace_fragment: $u,
		colorspace_pars_fragment: Ju,
		envmap_fragment: Qu,
		envmap_common_pars_fragment: td,
		envmap_pars_fragment: ed,
		envmap_pars_vertex: nd,
		envmap_physical_pars_fragment: fd,
		envmap_vertex: id,
		fog_vertex: sd,
		fog_pars_vertex: rd,
		fog_fragment: od,
		fog_pars_fragment: ad,
		gradientmap_pars_fragment: ld,
		lightmap_pars_fragment: cd,
		lights_lambert_fragment: hd,
		lights_lambert_pars_fragment: ud,
		lights_pars_begin: dd,
		lights_toon_fragment: pd,
		lights_toon_pars_fragment: md,
		lights_phong_fragment: gd,
		lights_phong_pars_fragment: _d,
		lights_physical_fragment: xd,
		lights_physical_pars_fragment: vd,
		lights_fragment_begin: Md,
		lights_fragment_maps: yd,
		lights_fragment_end: Sd,
		logdepthbuf_fragment: Ed,
		logdepthbuf_pars_fragment: bd,
		logdepthbuf_pars_vertex: Td,
		logdepthbuf_vertex: Ad,
		map_fragment: wd,
		map_pars_fragment: Rd,
		map_particle_fragment: Cd,
		map_particle_pars_fragment: Pd,
		metalnessmap_fragment: Dd,
		metalnessmap_pars_fragment: Ld,
		morphinstance_vertex: Id,
		morphcolor_vertex: Ud,
		morphnormal_vertex: Nd,
		morphtarget_pars_vertex: Fd,
		morphtarget_vertex: Od,
		normal_fragment_begin: Bd,
		normal_fragment_maps: zd,
		normal_pars_fragment: Hd,
		normal_pars_vertex: kd,
		normal_vertex: Gd,
		normalmap_pars_fragment: Vd,
		clearcoat_normal_fragment_begin: Wd,
		clearcoat_normal_fragment_maps: Xd,
		clearcoat_pars_fragment: Yd,
		iridescence_pars_fragment: qd,
		opaque_fragment: jd,
		packing: Kd,
		premultiplied_alpha_fragment: Zd,
		project_vertex: $d,
		dithering_fragment: Jd,
		dithering_pars_fragment: Qd,
		roughnessmap_fragment: tf,
		roughnessmap_pars_fragment: ef,
		shadowmap_pars_fragment: nf,
		shadowmap_pars_vertex: sf,
		shadowmap_vertex: rf,
		shadowmask_pars_fragment: of,
		skinbase_vertex: af,
		skinning_pars_vertex: lf,
		skinning_vertex: cf,
		skinnormal_vertex: hf,
		specularmap_fragment: uf,
		specularmap_pars_fragment: df,
		tonemapping_fragment: ff,
		tonemapping_pars_fragment: pf,
		transmission_fragment: mf,
		transmission_pars_fragment: gf,
		uv_pars_fragment: _f,
		uv_pars_vertex: xf,
		uv_vertex: vf,
		worldpos_vertex: Mf,
		background_vert: yf,
		background_frag: Sf,
		backgroundCube_vert: Ef,
		backgroundCube_frag: bf,
		cube_vert: Tf,
		cube_frag: Af,
		depth_vert: wf,
		depth_frag: Rf,
		distanceRGBA_vert: Cf,
		distanceRGBA_frag: Pf,
		equirect_vert: Df,
		equirect_frag: Lf,
		linedashed_vert: If,
		linedashed_frag: Uf,
		meshbasic_vert: Nf,
		meshbasic_frag: Ff,
		meshlambert_vert: Of,
		meshlambert_frag: Bf,
		meshmatcap_vert: zf,
		meshmatcap_frag: Hf,
		meshnormal_vert: kf,
		meshnormal_frag: Gf,
		meshphong_vert: Vf,
		meshphong_frag: Wf,
		meshphysical_vert: Xf,
		meshphysical_frag: Yf,
		meshtoon_vert: qf,
		meshtoon_frag: jf,
		points_vert: Kf,
		points_frag: Zf,
		shadow_vert: $f,
		shadow_frag: Jf,
		sprite_vert: Qf,
		sprite_frag: tp,
	},
	ot = {
		common: {
			diffuse: { value: new Bt(16777215) },
			opacity: { value: 1 },
			map: { value: null },
			mapTransform: { value: new Nt() },
			alphaMap: { value: null },
			alphaMapTransform: { value: new Nt() },
			alphaTest: { value: 0 },
		},
		specularmap: {
			specularMap: { value: null },
			specularMapTransform: { value: new Nt() },
		},
		envmap: {
			envMap: { value: null },
			envMapRotation: { value: new Nt() },
			flipEnvMap: { value: -1 },
			reflectivity: { value: 1 },
			ior: { value: 1.5 },
			refractionRatio: { value: 0.98 },
		},
		aomap: {
			aoMap: { value: null },
			aoMapIntensity: { value: 1 },
			aoMapTransform: { value: new Nt() },
		},
		lightmap: {
			lightMap: { value: null },
			lightMapIntensity: { value: 1 },
			lightMapTransform: { value: new Nt() },
		},
		bumpmap: {
			bumpMap: { value: null },
			bumpMapTransform: { value: new Nt() },
			bumpScale: { value: 1 },
		},
		normalmap: {
			normalMap: { value: null },
			normalMapTransform: { value: new Nt() },
			normalScale: { value: new Dt(1, 1) },
		},
		displacementmap: {
			displacementMap: { value: null },
			displacementMapTransform: { value: new Nt() },
			displacementScale: { value: 1 },
			displacementBias: { value: 0 },
		},
		emissivemap: {
			emissiveMap: { value: null },
			emissiveMapTransform: { value: new Nt() },
		},
		metalnessmap: {
			metalnessMap: { value: null },
			metalnessMapTransform: { value: new Nt() },
		},
		roughnessmap: {
			roughnessMap: { value: null },
			roughnessMapTransform: { value: new Nt() },
		},
		gradientmap: { gradientMap: { value: null } },
		fog: {
			fogDensity: { value: 25e-5 },
			fogNear: { value: 1 },
			fogFar: { value: 2e3 },
			fogColor: { value: new Bt(16777215) },
		},
		lights: {
			ambientLightColor: { value: [] },
			lightProbe: { value: [] },
			directionalLights: {
				value: [],
				properties: { direction: {}, color: {} },
			},
			directionalLightShadows: {
				value: [],
				properties: {
					shadowIntensity: 1,
					shadowBias: {},
					shadowNormalBias: {},
					shadowRadius: {},
					shadowMapSize: {},
				},
			},
			directionalShadowMap: { value: [] },
			directionalShadowMatrix: { value: [] },
			spotLights: {
				value: [],
				properties: {
					color: {},
					position: {},
					direction: {},
					distance: {},
					coneCos: {},
					penumbraCos: {},
					decay: {},
				},
			},
			spotLightShadows: {
				value: [],
				properties: {
					shadowIntensity: 1,
					shadowBias: {},
					shadowNormalBias: {},
					shadowRadius: {},
					shadowMapSize: {},
				},
			},
			spotLightMap: { value: [] },
			spotShadowMap: { value: [] },
			spotLightMatrix: { value: [] },
			pointLights: {
				value: [],
				properties: { color: {}, position: {}, decay: {}, distance: {} },
			},
			pointLightShadows: {
				value: [],
				properties: {
					shadowIntensity: 1,
					shadowBias: {},
					shadowNormalBias: {},
					shadowRadius: {},
					shadowMapSize: {},
					shadowCameraNear: {},
					shadowCameraFar: {},
				},
			},
			pointShadowMap: { value: [] },
			pointShadowMatrix: { value: [] },
			hemisphereLights: {
				value: [],
				properties: { direction: {}, skyColor: {}, groundColor: {} },
			},
			rectAreaLights: {
				value: [],
				properties: { color: {}, position: {}, width: {}, height: {} },
			},
			ltc_1: { value: null },
			ltc_2: { value: null },
		},
		points: {
			diffuse: { value: new Bt(16777215) },
			opacity: { value: 1 },
			size: { value: 1 },
			scale: { value: 1 },
			map: { value: null },
			alphaMap: { value: null },
			alphaMapTransform: { value: new Nt() },
			alphaTest: { value: 0 },
			uvTransform: { value: new Nt() },
		},
		sprite: {
			diffuse: { value: new Bt(16777215) },
			opacity: { value: 1 },
			center: { value: new Dt(0.5, 0.5) },
			rotation: { value: 0 },
			map: { value: null },
			mapTransform: { value: new Nt() },
			alphaMap: { value: null },
			alphaMapTransform: { value: new Nt() },
			alphaTest: { value: 0 },
		},
	},
	_n = {
		basic: {
			uniforms: Ne([
				ot.common,
				ot.specularmap,
				ot.envmap,
				ot.aomap,
				ot.lightmap,
				ot.fog,
			]),
			vertexShader: Ot.meshbasic_vert,
			fragmentShader: Ot.meshbasic_frag,
		},
		lambert: {
			uniforms: Ne([
				ot.common,
				ot.specularmap,
				ot.envmap,
				ot.aomap,
				ot.lightmap,
				ot.emissivemap,
				ot.bumpmap,
				ot.normalmap,
				ot.displacementmap,
				ot.fog,
				ot.lights,
				{ emissive: { value: new Bt(0) } },
			]),
			vertexShader: Ot.meshlambert_vert,
			fragmentShader: Ot.meshlambert_frag,
		},
		phong: {
			uniforms: Ne([
				ot.common,
				ot.specularmap,
				ot.envmap,
				ot.aomap,
				ot.lightmap,
				ot.emissivemap,
				ot.bumpmap,
				ot.normalmap,
				ot.displacementmap,
				ot.fog,
				ot.lights,
				{
					emissive: { value: new Bt(0) },
					specular: { value: new Bt(1118481) },
					shininess: { value: 30 },
				},
			]),
			vertexShader: Ot.meshphong_vert,
			fragmentShader: Ot.meshphong_frag,
		},
		standard: {
			uniforms: Ne([
				ot.common,
				ot.envmap,
				ot.aomap,
				ot.lightmap,
				ot.emissivemap,
				ot.bumpmap,
				ot.normalmap,
				ot.displacementmap,
				ot.roughnessmap,
				ot.metalnessmap,
				ot.fog,
				ot.lights,
				{
					emissive: { value: new Bt(0) },
					roughness: { value: 1 },
					metalness: { value: 0 },
					envMapIntensity: { value: 1 },
				},
			]),
			vertexShader: Ot.meshphysical_vert,
			fragmentShader: Ot.meshphysical_frag,
		},
		toon: {
			uniforms: Ne([
				ot.common,
				ot.aomap,
				ot.lightmap,
				ot.emissivemap,
				ot.bumpmap,
				ot.normalmap,
				ot.displacementmap,
				ot.gradientmap,
				ot.fog,
				ot.lights,
				{ emissive: { value: new Bt(0) } },
			]),
			vertexShader: Ot.meshtoon_vert,
			fragmentShader: Ot.meshtoon_frag,
		},
		matcap: {
			uniforms: Ne([
				ot.common,
				ot.bumpmap,
				ot.normalmap,
				ot.displacementmap,
				ot.fog,
				{ matcap: { value: null } },
			]),
			vertexShader: Ot.meshmatcap_vert,
			fragmentShader: Ot.meshmatcap_frag,
		},
		points: {
			uniforms: Ne([ot.points, ot.fog]),
			vertexShader: Ot.points_vert,
			fragmentShader: Ot.points_frag,
		},
		dashed: {
			uniforms: Ne([
				ot.common,
				ot.fog,
				{
					scale: { value: 1 },
					dashSize: { value: 1 },
					totalSize: { value: 2 },
				},
			]),
			vertexShader: Ot.linedashed_vert,
			fragmentShader: Ot.linedashed_frag,
		},
		depth: {
			uniforms: Ne([ot.common, ot.displacementmap]),
			vertexShader: Ot.depth_vert,
			fragmentShader: Ot.depth_frag,
		},
		normal: {
			uniforms: Ne([
				ot.common,
				ot.bumpmap,
				ot.normalmap,
				ot.displacementmap,
				{ opacity: { value: 1 } },
			]),
			vertexShader: Ot.meshnormal_vert,
			fragmentShader: Ot.meshnormal_frag,
		},
		sprite: {
			uniforms: Ne([ot.sprite, ot.fog]),
			vertexShader: Ot.sprite_vert,
			fragmentShader: Ot.sprite_frag,
		},
		background: {
			uniforms: {
				uvTransform: { value: new Nt() },
				t2D: { value: null },
				backgroundIntensity: { value: 1 },
			},
			vertexShader: Ot.background_vert,
			fragmentShader: Ot.background_frag,
		},
		backgroundCube: {
			uniforms: {
				envMap: { value: null },
				flipEnvMap: { value: -1 },
				backgroundBlurriness: { value: 0 },
				backgroundIntensity: { value: 1 },
				backgroundRotation: { value: new Nt() },
			},
			vertexShader: Ot.backgroundCube_vert,
			fragmentShader: Ot.backgroundCube_frag,
		},
		cube: {
			uniforms: {
				tCube: { value: null },
				tFlip: { value: -1 },
				opacity: { value: 1 },
			},
			vertexShader: Ot.cube_vert,
			fragmentShader: Ot.cube_frag,
		},
		equirect: {
			uniforms: { tEquirect: { value: null } },
			vertexShader: Ot.equirect_vert,
			fragmentShader: Ot.equirect_frag,
		},
		distanceRGBA: {
			uniforms: Ne([
				ot.common,
				ot.displacementmap,
				{
					referencePosition: { value: new U() },
					nearDistance: { value: 1 },
					farDistance: { value: 1e3 },
				},
			]),
			vertexShader: Ot.distanceRGBA_vert,
			fragmentShader: Ot.distanceRGBA_frag,
		},
		shadow: {
			uniforms: Ne([
				ot.lights,
				ot.fog,
				{ color: { value: new Bt(0) }, opacity: { value: 1 } },
			]),
			vertexShader: Ot.shadow_vert,
			fragmentShader: Ot.shadow_frag,
		},
	}
_n.physical = {
	uniforms: Ne([
		_n.standard.uniforms,
		{
			clearcoat: { value: 0 },
			clearcoatMap: { value: null },
			clearcoatMapTransform: { value: new Nt() },
			clearcoatNormalMap: { value: null },
			clearcoatNormalMapTransform: { value: new Nt() },
			clearcoatNormalScale: { value: new Dt(1, 1) },
			clearcoatRoughness: { value: 0 },
			clearcoatRoughnessMap: { value: null },
			clearcoatRoughnessMapTransform: { value: new Nt() },
			dispersion: { value: 0 },
			iridescence: { value: 0 },
			iridescenceMap: { value: null },
			iridescenceMapTransform: { value: new Nt() },
			iridescenceIOR: { value: 1.3 },
			iridescenceThicknessMinimum: { value: 100 },
			iridescenceThicknessMaximum: { value: 400 },
			iridescenceThicknessMap: { value: null },
			iridescenceThicknessMapTransform: { value: new Nt() },
			sheen: { value: 0 },
			sheenColor: { value: new Bt(0) },
			sheenColorMap: { value: null },
			sheenColorMapTransform: { value: new Nt() },
			sheenRoughness: { value: 1 },
			sheenRoughnessMap: { value: null },
			sheenRoughnessMapTransform: { value: new Nt() },
			transmission: { value: 0 },
			transmissionMap: { value: null },
			transmissionMapTransform: { value: new Nt() },
			transmissionSamplerSize: { value: new Dt() },
			transmissionSamplerMap: { value: null },
			thickness: { value: 0 },
			thicknessMap: { value: null },
			thicknessMapTransform: { value: new Nt() },
			attenuationDistance: { value: 0 },
			attenuationColor: { value: new Bt(0) },
			specularColor: { value: new Bt(1, 1, 1) },
			specularColorMap: { value: null },
			specularColorMapTransform: { value: new Nt() },
			specularIntensity: { value: 1 },
			specularIntensityMap: { value: null },
			specularIntensityMapTransform: { value: new Nt() },
			anisotropyVector: { value: new Dt() },
			anisotropyMap: { value: null },
			anisotropyMapTransform: { value: new Nt() },
		},
	]),
	vertexShader: Ot.meshphysical_vert,
	fragmentShader: Ot.meshphysical_frag,
}
const js = { r: 0, b: 0, g: 0 },
	si = new yn(),
	ep = new le()
function np(i, t, e, n, s, r, o) {
	const a = new Bt(0)
	let h = r === !0 ? 0 : 1,
		l,
		d,
		c = null,
		f = 0,
		m = null
	function g(T) {
		let S = T.isScene === !0 ? T.background : null
		return (
			S && S.isTexture && (S = (T.backgroundBlurriness > 0 ? e : t).get(S)), S
		)
	}
	function _(T) {
		let S = !1
		const C = g(T)
		C === null ? u(a, h) : C && C.isColor && (u(C, 1), (S = !0))
		const w = i.xr.getEnvironmentBlendMode()
		w === "additive"
			? n.buffers.color.setClear(0, 0, 0, 1, o)
			: w === "alpha-blend" && n.buffers.color.setClear(0, 0, 0, 0, o),
			(i.autoClear || S) &&
				(n.buffers.depth.setTest(!0),
				n.buffers.depth.setMask(!0),
				n.buffers.color.setMask(!0),
				i.clear(i.autoClearColor, i.autoClearDepth, i.autoClearStencil))
	}
	function p(T, S) {
		const C = g(S)
		C && (C.isCubeTexture || C.mapping === xr)
			? (d === void 0 &&
					((d = new Zt(
						new fi(1, 1, 1),
						new $n({
							name: "BackgroundCubeMaterial",
							uniforms: Vi(_n.backgroundCube.uniforms),
							vertexShader: _n.backgroundCube.vertexShader,
							fragmentShader: _n.backgroundCube.fragmentShader,
							side: Ie,
							depthTest: !1,
							depthWrite: !1,
							fog: !1,
							allowOverride: !1,
						})
					)),
					d.geometry.deleteAttribute("normal"),
					d.geometry.deleteAttribute("uv"),
					(d.onBeforeRender = function (w, E, D) {
						this.matrixWorld.copyPosition(D.matrixWorld)
					}),
					Object.defineProperty(d.material, "envMap", {
						get: function () {
							return this.uniforms.envMap.value
						},
					}),
					s.update(d)),
			  si.copy(S.backgroundRotation),
			  (si.x *= -1),
			  (si.y *= -1),
			  (si.z *= -1),
			  C.isCubeTexture &&
					C.isRenderTargetTexture === !1 &&
					((si.y *= -1), (si.z *= -1)),
			  (d.material.uniforms.envMap.value = C),
			  (d.material.uniforms.flipEnvMap.value =
					C.isCubeTexture && C.isRenderTargetTexture === !1 ? -1 : 1),
			  (d.material.uniforms.backgroundBlurriness.value =
					S.backgroundBlurriness),
			  (d.material.uniforms.backgroundIntensity.value = S.backgroundIntensity),
			  d.material.uniforms.backgroundRotation.value.setFromMatrix4(
					ep.makeRotationFromEuler(si)
			  ),
			  (d.material.toneMapped = Xt.getTransfer(C.colorSpace) !== Jt),
			  (c !== C || f !== C.version || m !== i.toneMapping) &&
					((d.material.needsUpdate = !0),
					(c = C),
					(f = C.version),
					(m = i.toneMapping)),
			  d.layers.enableAll(),
			  T.unshift(d, d.geometry, d.material, 0, 0, null))
			: C &&
			  C.isTexture &&
			  (l === void 0 &&
					((l = new Zt(
						new Sn(2, 2),
						new $n({
							name: "BackgroundMaterial",
							uniforms: Vi(_n.background.uniforms),
							vertexShader: _n.background.vertexShader,
							fragmentShader: _n.background.fragmentShader,
							side: Zn,
							depthTest: !1,
							depthWrite: !1,
							fog: !1,
							allowOverride: !1,
						})
					)),
					l.geometry.deleteAttribute("normal"),
					Object.defineProperty(l.material, "map", {
						get: function () {
							return this.uniforms.t2D.value
						},
					}),
					s.update(l)),
			  (l.material.uniforms.t2D.value = C),
			  (l.material.uniforms.backgroundIntensity.value = S.backgroundIntensity),
			  (l.material.toneMapped = Xt.getTransfer(C.colorSpace) !== Jt),
			  C.matrixAutoUpdate === !0 && C.updateMatrix(),
			  l.material.uniforms.uvTransform.value.copy(C.matrix),
			  (c !== C || f !== C.version || m !== i.toneMapping) &&
					((l.material.needsUpdate = !0),
					(c = C),
					(f = C.version),
					(m = i.toneMapping)),
			  l.layers.enableAll(),
			  T.unshift(l, l.geometry, l.material, 0, 0, null))
	}
	function u(T, S) {
		T.getRGB(js, sc(i)), n.buffers.color.setClear(js.r, js.g, js.b, S, o)
	}
	function b() {
		d !== void 0 && (d.geometry.dispose(), d.material.dispose(), (d = void 0)),
			l !== void 0 && (l.geometry.dispose(), l.material.dispose(), (l = void 0))
	}
	return {
		getClearColor: function () {
			return a
		},
		setClearColor: function (T, S = 1) {
			a.set(T), (h = S), u(a, h)
		},
		getClearAlpha: function () {
			return h
		},
		setClearAlpha: function (T) {
			;(h = T), u(a, h)
		},
		render: _,
		addToRenderList: p,
		dispose: b,
	}
}
function ip(i, t) {
	const e = i.getParameter(i.MAX_VERTEX_ATTRIBS),
		n = {},
		s = f(null)
	let r = s,
		o = !1
	function a(y, R, L, N, z) {
		let H = !1
		const W = c(N, L, R)
		r !== W && ((r = W), l(r.object)),
			(H = m(y, N, L, z)),
			H && g(y, N, L, z),
			z !== null && t.update(z, i.ELEMENT_ARRAY_BUFFER),
			(H || o) &&
				((o = !1),
				S(y, R, L, N),
				z !== null && i.bindBuffer(i.ELEMENT_ARRAY_BUFFER, t.get(z).buffer))
	}
	function h() {
		return i.createVertexArray()
	}
	function l(y) {
		return i.bindVertexArray(y)
	}
	function d(y) {
		return i.deleteVertexArray(y)
	}
	function c(y, R, L) {
		const N = L.wireframe === !0
		let z = n[y.id]
		z === void 0 && ((z = {}), (n[y.id] = z))
		let H = z[R.id]
		H === void 0 && ((H = {}), (z[R.id] = H))
		let W = H[N]
		return W === void 0 && ((W = f(h())), (H[N] = W)), W
	}
	function f(y) {
		const R = [],
			L = [],
			N = []
		for (let z = 0; z < e; z++) (R[z] = 0), (L[z] = 0), (N[z] = 0)
		return {
			geometry: null,
			program: null,
			wireframe: !1,
			newAttributes: R,
			enabledAttributes: L,
			attributeDivisors: N,
			object: y,
			attributes: {},
			index: null,
		}
	}
	function m(y, R, L, N) {
		const z = r.attributes,
			H = R.attributes
		let W = 0
		const j = L.getAttributes()
		for (const V in j)
			if (j[V].location >= 0) {
				const ht = z[V]
				let Et = H[V]
				if (
					(Et === void 0 &&
						(V === "instanceMatrix" &&
							y.instanceMatrix &&
							(Et = y.instanceMatrix),
						V === "instanceColor" && y.instanceColor && (Et = y.instanceColor)),
					ht === void 0 || ht.attribute !== Et || (Et && ht.data !== Et.data))
				)
					return !0
				W++
			}
		return r.attributesNum !== W || r.index !== N
	}
	function g(y, R, L, N) {
		const z = {},
			H = R.attributes
		let W = 0
		const j = L.getAttributes()
		for (const V in j)
			if (j[V].location >= 0) {
				let ht = H[V]
				ht === void 0 &&
					(V === "instanceMatrix" &&
						y.instanceMatrix &&
						(ht = y.instanceMatrix),
					V === "instanceColor" && y.instanceColor && (ht = y.instanceColor))
				const Et = {}
				;(Et.attribute = ht),
					ht && ht.data && (Et.data = ht.data),
					(z[V] = Et),
					W++
			}
		;(r.attributes = z), (r.attributesNum = W), (r.index = N)
	}
	function _() {
		const y = r.newAttributes
		for (let R = 0, L = y.length; R < L; R++) y[R] = 0
	}
	function p(y) {
		u(y, 0)
	}
	function u(y, R) {
		const L = r.newAttributes,
			N = r.enabledAttributes,
			z = r.attributeDivisors
		;(L[y] = 1),
			N[y] === 0 && (i.enableVertexAttribArray(y), (N[y] = 1)),
			z[y] !== R && (i.vertexAttribDivisor(y, R), (z[y] = R))
	}
	function b() {
		const y = r.newAttributes,
			R = r.enabledAttributes
		for (let L = 0, N = R.length; L < N; L++)
			R[L] !== y[L] && (i.disableVertexAttribArray(L), (R[L] = 0))
	}
	function T(y, R, L, N, z, H, W) {
		W === !0
			? i.vertexAttribIPointer(y, R, L, z, H)
			: i.vertexAttribPointer(y, R, L, N, z, H)
	}
	function S(y, R, L, N) {
		_()
		const z = N.attributes,
			H = L.getAttributes(),
			W = R.defaultAttributeValues
		for (const j in H) {
			const V = H[j]
			if (V.location >= 0) {
				let rt = z[j]
				if (
					(rt === void 0 &&
						(j === "instanceMatrix" &&
							y.instanceMatrix &&
							(rt = y.instanceMatrix),
						j === "instanceColor" && y.instanceColor && (rt = y.instanceColor)),
					rt !== void 0)
				) {
					const ht = rt.normalized,
						Et = rt.itemSize,
						zt = t.get(rt)
					if (zt === void 0) continue
					const ee = zt.buffer,
						se = zt.type,
						jt = zt.bytesPerElement,
						q = se === i.INT || se === i.UNSIGNED_INT || rt.gpuType === $o
					if (rt.isInterleavedBufferAttribute) {
						const $ = rt.data,
							ft = $.stride,
							Pt = rt.offset
						if ($.isInstancedInterleavedBuffer) {
							for (let St = 0; St < V.locationSize; St++)
								u(V.location + St, $.meshPerAttribute)
							y.isInstancedMesh !== !0 &&
								N._maxInstanceCount === void 0 &&
								(N._maxInstanceCount = $.meshPerAttribute * $.count)
						} else
							for (let St = 0; St < V.locationSize; St++) p(V.location + St)
						i.bindBuffer(i.ARRAY_BUFFER, ee)
						for (let St = 0; St < V.locationSize; St++)
							T(
								V.location + St,
								Et / V.locationSize,
								se,
								ht,
								ft * jt,
								(Pt + (Et / V.locationSize) * St) * jt,
								q
							)
					} else {
						if (rt.isInstancedBufferAttribute) {
							for (let $ = 0; $ < V.locationSize; $++)
								u(V.location + $, rt.meshPerAttribute)
							y.isInstancedMesh !== !0 &&
								N._maxInstanceCount === void 0 &&
								(N._maxInstanceCount = rt.meshPerAttribute * rt.count)
						} else for (let $ = 0; $ < V.locationSize; $++) p(V.location + $)
						i.bindBuffer(i.ARRAY_BUFFER, ee)
						for (let $ = 0; $ < V.locationSize; $++)
							T(
								V.location + $,
								Et / V.locationSize,
								se,
								ht,
								Et * jt,
								(Et / V.locationSize) * $ * jt,
								q
							)
					}
				} else if (W !== void 0) {
					const ht = W[j]
					if (ht !== void 0)
						switch (ht.length) {
							case 2:
								i.vertexAttrib2fv(V.location, ht)
								break
							case 3:
								i.vertexAttrib3fv(V.location, ht)
								break
							case 4:
								i.vertexAttrib4fv(V.location, ht)
								break
							default:
								i.vertexAttrib1fv(V.location, ht)
						}
				}
			}
		}
		b()
	}
	function C() {
		D()
		for (const y in n) {
			const R = n[y]
			for (const L in R) {
				const N = R[L]
				for (const z in N) d(N[z].object), delete N[z]
				delete R[L]
			}
			delete n[y]
		}
	}
	function w(y) {
		if (n[y.id] === void 0) return
		const R = n[y.id]
		for (const L in R) {
			const N = R[L]
			for (const z in N) d(N[z].object), delete N[z]
			delete R[L]
		}
		delete n[y.id]
	}
	function E(y) {
		for (const R in n) {
			const L = n[R]
			if (L[y.id] === void 0) continue
			const N = L[y.id]
			for (const z in N) d(N[z].object), delete N[z]
			delete L[y.id]
		}
	}
	function D() {
		v(), (o = !0), r !== s && ((r = s), l(r.object))
	}
	function v() {
		;(s.geometry = null), (s.program = null), (s.wireframe = !1)
	}
	return {
		setup: a,
		reset: D,
		resetDefaultState: v,
		dispose: C,
		releaseStatesOfGeometry: w,
		releaseStatesOfProgram: E,
		initAttributes: _,
		enableAttribute: p,
		disableUnusedAttributes: b,
	}
}
function sp(i, t, e) {
	let n
	function s(l) {
		n = l
	}
	function r(l, d) {
		i.drawArrays(n, l, d), e.update(d, n, 1)
	}
	function o(l, d, c) {
		c !== 0 && (i.drawArraysInstanced(n, l, d, c), e.update(d, n, c))
	}
	function a(l, d, c) {
		if (c === 0) return
		t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n, l, 0, d, 0, c)
		let m = 0
		for (let g = 0; g < c; g++) m += d[g]
		e.update(m, n, 1)
	}
	function h(l, d, c, f) {
		if (c === 0) return
		const m = t.get("WEBGL_multi_draw")
		if (m === null) for (let g = 0; g < l.length; g++) o(l[g], d[g], f[g])
		else {
			m.multiDrawArraysInstancedWEBGL(n, l, 0, d, 0, f, 0, c)
			let g = 0
			for (let _ = 0; _ < c; _++) g += d[_] * f[_]
			e.update(g, n, 1)
		}
	}
	;(this.setMode = s),
		(this.render = r),
		(this.renderInstances = o),
		(this.renderMultiDraw = a),
		(this.renderMultiDrawInstances = h)
}
function rp(i, t, e, n) {
	let s
	function r() {
		if (s !== void 0) return s
		if (t.has("EXT_texture_filter_anisotropic") === !0) {
			const E = t.get("EXT_texture_filter_anisotropic")
			s = i.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)
		} else s = 0
		return s
	}
	function o(E) {
		return !(
			E !== on &&
			n.convert(E) !== i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT)
		)
	}
	function a(E) {
		const D =
			E === ms &&
			(t.has("EXT_color_buffer_half_float") || t.has("EXT_color_buffer_float"))
		return !(
			E !== Mn &&
			n.convert(E) !== i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE) &&
			E !== xn &&
			!D
		)
	}
	function h(E) {
		if (E === "highp") {
			if (
				i.getShaderPrecisionFormat(i.VERTEX_SHADER, i.HIGH_FLOAT).precision >
					0 &&
				i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.HIGH_FLOAT).precision >
					0
			)
				return "highp"
			E = "mediump"
		}
		return E === "mediump" &&
			i.getShaderPrecisionFormat(i.VERTEX_SHADER, i.MEDIUM_FLOAT).precision >
				0 &&
			i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.MEDIUM_FLOAT).precision >
				0
			? "mediump"
			: "lowp"
	}
	let l = e.precision !== void 0 ? e.precision : "highp"
	const d = h(l)
	d !== l &&
		(console.warn(
			"THREE.WebGLRenderer:",
			l,
			"not supported, using",
			d,
			"instead."
		),
		(l = d))
	const c = e.logarithmicDepthBuffer === !0,
		f = e.reversedDepthBuffer === !0 && t.has("EXT_clip_control"),
		m = i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),
		g = i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
		_ = i.getParameter(i.MAX_TEXTURE_SIZE),
		p = i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),
		u = i.getParameter(i.MAX_VERTEX_ATTRIBS),
		b = i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),
		T = i.getParameter(i.MAX_VARYING_VECTORS),
		S = i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),
		C = g > 0,
		w = i.getParameter(i.MAX_SAMPLES)
	return {
		isWebGL2: !0,
		getMaxAnisotropy: r,
		getMaxPrecision: h,
		textureFormatReadable: o,
		textureTypeReadable: a,
		precision: l,
		logarithmicDepthBuffer: c,
		reversedDepthBuffer: f,
		maxTextures: m,
		maxVertexTextures: g,
		maxTextureSize: _,
		maxCubemapSize: p,
		maxAttributes: u,
		maxVertexUniforms: b,
		maxVaryings: T,
		maxFragmentUniforms: S,
		vertexTextures: C,
		maxSamples: w,
	}
}
function op(i) {
	const t = this
	let e = null,
		n = 0,
		s = !1,
		r = !1
	const o = new Dn(),
		a = new Nt(),
		h = { value: null, needsUpdate: !1 }
	;(this.uniform = h),
		(this.numPlanes = 0),
		(this.numIntersection = 0),
		(this.init = function (c, f) {
			const m = c.length !== 0 || f || n !== 0 || s
			return (s = f), (n = c.length), m
		}),
		(this.beginShadows = function () {
			;(r = !0), d(null)
		}),
		(this.endShadows = function () {
			r = !1
		}),
		(this.setGlobalState = function (c, f) {
			e = d(c, f, 0)
		}),
		(this.setState = function (c, f, m) {
			const g = c.clippingPlanes,
				_ = c.clipIntersection,
				p = c.clipShadows,
				u = i.get(c)
			if (!s || g === null || g.length === 0 || (r && !p)) r ? d(null) : l()
			else {
				const b = r ? 0 : n,
					T = b * 4
				let S = u.clippingState || null
				;(h.value = S), (S = d(g, f, T, m))
				for (let C = 0; C !== T; ++C) S[C] = e[C]
				;(u.clippingState = S),
					(this.numIntersection = _ ? this.numPlanes : 0),
					(this.numPlanes += b)
			}
		})
	function l() {
		h.value !== e && ((h.value = e), (h.needsUpdate = n > 0)),
			(t.numPlanes = n),
			(t.numIntersection = 0)
	}
	function d(c, f, m, g) {
		const _ = c !== null ? c.length : 0
		let p = null
		if (_ !== 0) {
			if (((p = h.value), g !== !0 || p === null)) {
				const u = m + _ * 4,
					b = f.matrixWorldInverse
				a.getNormalMatrix(b),
					(p === null || p.length < u) && (p = new Float32Array(u))
				for (let T = 0, S = m; T !== _; ++T, S += 4)
					o.copy(c[T]).applyMatrix4(b, a),
						o.normal.toArray(p, S),
						(p[S + 3] = o.constant)
			}
			;(h.value = p), (h.needsUpdate = !0)
		}
		return (t.numPlanes = _), (t.numIntersection = 0), p
	}
}
function ap(i) {
	let t = new WeakMap()
	function e(o, a) {
		return a === mo ? (o.mapping = Hi) : a === go && (o.mapping = ki), o
	}
	function n(o) {
		if (o && o.isTexture) {
			const a = o.mapping
			if (a === mo || a === go)
				if (t.has(o)) {
					const h = t.get(o).texture
					return e(h, o.mapping)
				} else {
					const h = o.image
					if (h && h.height > 0) {
						const l = new lc(h.height)
						return (
							l.fromEquirectangularTexture(i, o),
							t.set(o, l),
							o.addEventListener("dispose", s),
							e(l.texture, o.mapping)
						)
					} else return null
				}
		}
		return o
	}
	function s(o) {
		const a = o.target
		a.removeEventListener("dispose", s)
		const h = t.get(a)
		h !== void 0 && (t.delete(a), h.dispose())
	}
	function r() {
		t = new WeakMap()
	}
	return { get: n, dispose: r }
}
const Ui = 4,
	il = [0.125, 0.215, 0.35, 0.446, 0.526, 0.582],
	li = 20,
	$r = new mc(),
	sl = new Bt()
let Jr = null,
	Qr = 0,
	to = 0,
	eo = !1
const oi = (1 + Math.sqrt(5)) / 2,
	Pi = 1 / oi,
	rl = [
		new U(-oi, Pi, 0),
		new U(oi, Pi, 0),
		new U(-Pi, 0, oi),
		new U(Pi, 0, oi),
		new U(0, oi, -Pi),
		new U(0, oi, Pi),
		new U(-1, 1, -1),
		new U(1, 1, -1),
		new U(-1, 1, 1),
		new U(1, 1, 1),
	],
	lp = new U()
class ol {
	constructor(t) {
		;(this._renderer = t),
			(this._pingPongRenderTarget = null),
			(this._lodMax = 0),
			(this._cubeSize = 0),
			(this._lodPlanes = []),
			(this._sizeLods = []),
			(this._sigmas = []),
			(this._blurMaterial = null),
			(this._cubemapMaterial = null),
			(this._equirectMaterial = null),
			this._compileMaterial(this._blurMaterial)
	}
	fromScene(t, e = 0, n = 0.1, s = 100, r = {}) {
		const { size: o = 256, position: a = lp } = r
		;(Jr = this._renderer.getRenderTarget()),
			(Qr = this._renderer.getActiveCubeFace()),
			(to = this._renderer.getActiveMipmapLevel()),
			(eo = this._renderer.xr.enabled),
			(this._renderer.xr.enabled = !1),
			this._setSize(o)
		const h = this._allocateTargets()
		return (
			(h.depthBuffer = !0),
			this._sceneToCubeUV(t, n, s, h, a),
			e > 0 && this._blur(h, 0, 0, e),
			this._applyPMREM(h),
			this._cleanup(h),
			h
		)
	}
	fromEquirectangular(t, e = null) {
		return this._fromTexture(t, e)
	}
	fromCubemap(t, e = null) {
		return this._fromTexture(t, e)
	}
	compileCubemapShader() {
		this._cubemapMaterial === null &&
			((this._cubemapMaterial = cl()),
			this._compileMaterial(this._cubemapMaterial))
	}
	compileEquirectangularShader() {
		this._equirectMaterial === null &&
			((this._equirectMaterial = ll()),
			this._compileMaterial(this._equirectMaterial))
	}
	dispose() {
		this._dispose(),
			this._cubemapMaterial !== null && this._cubemapMaterial.dispose(),
			this._equirectMaterial !== null && this._equirectMaterial.dispose()
	}
	_setSize(t) {
		;(this._lodMax = Math.floor(Math.log2(t))),
			(this._cubeSize = Math.pow(2, this._lodMax))
	}
	_dispose() {
		this._blurMaterial !== null && this._blurMaterial.dispose(),
			this._pingPongRenderTarget !== null &&
				this._pingPongRenderTarget.dispose()
		for (let t = 0; t < this._lodPlanes.length; t++)
			this._lodPlanes[t].dispose()
	}
	_cleanup(t) {
		this._renderer.setRenderTarget(Jr, Qr, to),
			(this._renderer.xr.enabled = eo),
			(t.scissorTest = !1),
			Ks(t, 0, 0, t.width, t.height)
	}
	_fromTexture(t, e) {
		t.mapping === Hi || t.mapping === ki
			? this._setSize(
					t.image.length === 0 ? 16 : t.image[0].width || t.image[0].image.width
			  )
			: this._setSize(t.image.width / 4),
			(Jr = this._renderer.getRenderTarget()),
			(Qr = this._renderer.getActiveCubeFace()),
			(to = this._renderer.getActiveMipmapLevel()),
			(eo = this._renderer.xr.enabled),
			(this._renderer.xr.enabled = !1)
		const n = e || this._allocateTargets()
		return this._textureToCubeUV(t, n), this._applyPMREM(n), this._cleanup(n), n
	}
	_allocateTargets() {
		const t = 3 * Math.max(this._cubeSize, 112),
			e = 4 * this._cubeSize,
			n = {
				magFilter: rn,
				minFilter: rn,
				generateMipmaps: !1,
				type: ms,
				format: on,
				colorSpace: Gi,
				depthBuffer: !1,
			},
			s = al(t, e, n)
		if (
			this._pingPongRenderTarget === null ||
			this._pingPongRenderTarget.width !== t ||
			this._pingPongRenderTarget.height !== e
		) {
			this._pingPongRenderTarget !== null && this._dispose(),
				(this._pingPongRenderTarget = al(t, e, n))
			const { _lodMax: r } = this
			;({
				sizeLods: this._sizeLods,
				lodPlanes: this._lodPlanes,
				sigmas: this._sigmas,
			} = cp(r)),
				(this._blurMaterial = hp(r, t, e))
		}
		return s
	}
	_compileMaterial(t) {
		const e = new Zt(this._lodPlanes[0], t)
		this._renderer.compile(e, $r)
	}
	_sceneToCubeUV(t, e, n, s, r) {
		const h = new je(90, 1, e, n),
			l = [1, -1, 1, 1, 1, 1],
			d = [1, 1, 1, -1, -1, -1],
			c = this._renderer,
			f = c.autoClear,
			m = c.toneMapping
		c.getClearColor(sl),
			(c.toneMapping = Yn),
			(c.autoClear = !1),
			c.state.buffers.depth.getReversed() &&
				(c.setRenderTarget(s), c.clearDepth(), c.setRenderTarget(null))
		const _ = new Le({
				name: "PMREM.Background",
				side: Ie,
				depthWrite: !1,
				depthTest: !1,
			}),
			p = new Zt(new fi(), _)
		let u = !1
		const b = t.background
		b
			? b.isColor && (_.color.copy(b), (t.background = null), (u = !0))
			: (_.color.copy(sl), (u = !0))
		for (let T = 0; T < 6; T++) {
			const S = T % 3
			S === 0
				? (h.up.set(0, l[T], 0),
				  h.position.set(r.x, r.y, r.z),
				  h.lookAt(r.x + d[T], r.y, r.z))
				: S === 1
				? (h.up.set(0, 0, l[T]),
				  h.position.set(r.x, r.y, r.z),
				  h.lookAt(r.x, r.y + d[T], r.z))
				: (h.up.set(0, l[T], 0),
				  h.position.set(r.x, r.y, r.z),
				  h.lookAt(r.x, r.y, r.z + d[T]))
			const C = this._cubeSize
			Ks(s, S * C, T > 2 ? C : 0, C, C),
				c.setRenderTarget(s),
				u && c.render(p, h),
				c.render(t, h)
		}
		p.geometry.dispose(),
			p.material.dispose(),
			(c.toneMapping = m),
			(c.autoClear = f),
			(t.background = b)
	}
	_textureToCubeUV(t, e) {
		const n = this._renderer,
			s = t.mapping === Hi || t.mapping === ki
		s
			? (this._cubemapMaterial === null && (this._cubemapMaterial = cl()),
			  (this._cubemapMaterial.uniforms.flipEnvMap.value =
					t.isRenderTargetTexture === !1 ? -1 : 1))
			: this._equirectMaterial === null && (this._equirectMaterial = ll())
		const r = s ? this._cubemapMaterial : this._equirectMaterial,
			o = new Zt(this._lodPlanes[0], r),
			a = r.uniforms
		a.envMap.value = t
		const h = this._cubeSize
		Ks(e, 0, 0, 3 * h, 2 * h), n.setRenderTarget(e), n.render(o, $r)
	}
	_applyPMREM(t) {
		const e = this._renderer,
			n = e.autoClear
		e.autoClear = !1
		const s = this._lodPlanes.length
		for (let r = 1; r < s; r++) {
			const o = Math.sqrt(
					this._sigmas[r] * this._sigmas[r] -
						this._sigmas[r - 1] * this._sigmas[r - 1]
				),
				a = rl[(s - r - 1) % rl.length]
			this._blur(t, r - 1, r, o, a)
		}
		e.autoClear = n
	}
	_blur(t, e, n, s, r) {
		const o = this._pingPongRenderTarget
		this._halfBlur(t, o, e, n, s, "latitudinal", r),
			this._halfBlur(o, t, n, n, s, "longitudinal", r)
	}
	_halfBlur(t, e, n, s, r, o, a) {
		const h = this._renderer,
			l = this._blurMaterial
		o !== "latitudinal" &&
			o !== "longitudinal" &&
			console.error(
				"blur direction must be either latitudinal or longitudinal!"
			)
		const d = 3,
			c = new Zt(this._lodPlanes[s], l),
			f = l.uniforms,
			m = this._sizeLods[n] - 1,
			g = isFinite(r) ? Math.PI / (2 * m) : (2 * Math.PI) / (2 * li - 1),
			_ = r / g,
			p = isFinite(r) ? 1 + Math.floor(d * _) : li
		p > li &&
			console.warn(
				`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${li}`
			)
		const u = []
		let b = 0
		for (let E = 0; E < li; ++E) {
			const D = E / _,
				v = Math.exp((-D * D) / 2)
			u.push(v), E === 0 ? (b += v) : E < p && (b += 2 * v)
		}
		for (let E = 0; E < u.length; E++) u[E] = u[E] / b
		;(f.envMap.value = t.texture),
			(f.samples.value = p),
			(f.weights.value = u),
			(f.latitudinal.value = o === "latitudinal"),
			a && (f.poleAxis.value = a)
		const { _lodMax: T } = this
		;(f.dTheta.value = g), (f.mipInt.value = T - n)
		const S = this._sizeLods[s],
			C = 3 * S * (s > T - Ui ? s - T + Ui : 0),
			w = 4 * (this._cubeSize - S)
		Ks(e, C, w, 3 * S, 2 * S), h.setRenderTarget(e), h.render(c, $r)
	}
}
function cp(i) {
	const t = [],
		e = [],
		n = []
	let s = i
	const r = i - Ui + 1 + il.length
	for (let o = 0; o < r; o++) {
		const a = Math.pow(2, s)
		e.push(a)
		let h = 1 / a
		o > i - Ui ? (h = il[o - i + Ui - 1]) : o === 0 && (h = 0), n.push(h)
		const l = 1 / (a - 2),
			d = -l,
			c = 1 + l,
			f = [d, d, c, d, c, c, d, d, c, c, d, c],
			m = 6,
			g = 6,
			_ = 3,
			p = 2,
			u = 1,
			b = new Float32Array(_ * g * m),
			T = new Float32Array(p * g * m),
			S = new Float32Array(u * g * m)
		for (let w = 0; w < m; w++) {
			const E = ((w % 3) * 2) / 3 - 1,
				D = w > 2 ? 0 : -1,
				v = [
					E,
					D,
					0,
					E + 2 / 3,
					D,
					0,
					E + 2 / 3,
					D + 1,
					0,
					E,
					D,
					0,
					E + 2 / 3,
					D + 1,
					0,
					E,
					D + 1,
					0,
				]
			b.set(v, _ * g * w), T.set(f, p * g * w)
			const y = [w, w, w, w, w, w]
			S.set(y, u * g * w)
		}
		const C = new Be()
		C.setAttribute("position", new an(b, _)),
			C.setAttribute("uv", new an(T, p)),
			C.setAttribute("faceIndex", new an(S, u)),
			t.push(C),
			s > Ui && s--
	}
	return { lodPlanes: t, sizeLods: e, sigmas: n }
}
function al(i, t, e) {
	const n = new di(i, t, e)
	return (
		(n.texture.mapping = xr),
		(n.texture.name = "PMREM.cubeUv"),
		(n.scissorTest = !0),
		n
	)
}
function Ks(i, t, e, n, s) {
	i.viewport.set(t, e, n, s), i.scissor.set(t, e, n, s)
}
function hp(i, t, e) {
	const n = new Float32Array(li),
		s = new U(0, 1, 0)
	return new $n({
		name: "SphericalGaussianBlur",
		defines: {
			n: li,
			CUBEUV_TEXEL_WIDTH: 1 / t,
			CUBEUV_TEXEL_HEIGHT: 1 / e,
			CUBEUV_MAX_MIP: `${i}.0`,
		},
		uniforms: {
			envMap: { value: null },
			samples: { value: 1 },
			weights: { value: n },
			latitudinal: { value: !1 },
			dTheta: { value: 0 },
			mipInt: { value: 0 },
			poleAxis: { value: s },
		},
		vertexShader: aa(),
		fragmentShader: `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,
		blending: Xn,
		depthTest: !1,
		depthWrite: !1,
	})
}
function ll() {
	return new $n({
		name: "EquirectangularToCubeUV",
		uniforms: { envMap: { value: null } },
		vertexShader: aa(),
		fragmentShader: `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,
		blending: Xn,
		depthTest: !1,
		depthWrite: !1,
	})
}
function cl() {
	return new $n({
		name: "CubemapToCubeUV",
		uniforms: { envMap: { value: null }, flipEnvMap: { value: -1 } },
		vertexShader: aa(),
		fragmentShader: `

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,
		blending: Xn,
		depthTest: !1,
		depthWrite: !1,
	})
}
function aa() {
	return `

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`
}
function up(i) {
	let t = new WeakMap(),
		e = null
	function n(a) {
		if (a && a.isTexture) {
			const h = a.mapping,
				l = h === mo || h === go,
				d = h === Hi || h === ki
			if (l || d) {
				let c = t.get(a)
				const f = c !== void 0 ? c.texture.pmremVersion : 0
				if (a.isRenderTargetTexture && a.pmremVersion !== f)
					return (
						e === null && (e = new ol(i)),
						(c = l ? e.fromEquirectangular(a, c) : e.fromCubemap(a, c)),
						(c.texture.pmremVersion = a.pmremVersion),
						t.set(a, c),
						c.texture
					)
				if (c !== void 0) return c.texture
				{
					const m = a.image
					return (l && m && m.height > 0) || (d && m && s(m))
						? (e === null && (e = new ol(i)),
						  (c = l ? e.fromEquirectangular(a) : e.fromCubemap(a)),
						  (c.texture.pmremVersion = a.pmremVersion),
						  t.set(a, c),
						  a.addEventListener("dispose", r),
						  c.texture)
						: null
				}
			}
		}
		return a
	}
	function s(a) {
		let h = 0
		const l = 6
		for (let d = 0; d < l; d++) a[d] !== void 0 && h++
		return h === l
	}
	function r(a) {
		const h = a.target
		h.removeEventListener("dispose", r)
		const l = t.get(h)
		l !== void 0 && (t.delete(h), l.dispose())
	}
	function o() {
		;(t = new WeakMap()), e !== null && (e.dispose(), (e = null))
	}
	return { get: n, dispose: o }
}
function dp(i) {
	const t = {}
	function e(n) {
		if (t[n] !== void 0) return t[n]
		let s
		switch (n) {
			case "WEBGL_depth_texture":
				s =
					i.getExtension("WEBGL_depth_texture") ||
					i.getExtension("MOZ_WEBGL_depth_texture") ||
					i.getExtension("WEBKIT_WEBGL_depth_texture")
				break
			case "EXT_texture_filter_anisotropic":
				s =
					i.getExtension("EXT_texture_filter_anisotropic") ||
					i.getExtension("MOZ_EXT_texture_filter_anisotropic") ||
					i.getExtension("WEBKIT_EXT_texture_filter_anisotropic")
				break
			case "WEBGL_compressed_texture_s3tc":
				s =
					i.getExtension("WEBGL_compressed_texture_s3tc") ||
					i.getExtension("MOZ_WEBGL_compressed_texture_s3tc") ||
					i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc")
				break
			case "WEBGL_compressed_texture_pvrtc":
				s =
					i.getExtension("WEBGL_compressed_texture_pvrtc") ||
					i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc")
				break
			default:
				s = i.getExtension(n)
		}
		return (t[n] = s), s
	}
	return {
		has: function (n) {
			return e(n) !== null
		},
		init: function () {
			e("EXT_color_buffer_float"),
				e("WEBGL_clip_cull_distance"),
				e("OES_texture_float_linear"),
				e("EXT_color_buffer_half_float"),
				e("WEBGL_multisampled_render_to_texture"),
				e("WEBGL_render_shared_exponent")
		},
		get: function (n) {
			const s = e(n)
			return (
				s === null &&
					hs("THREE.WebGLRenderer: " + n + " extension not supported."),
				s
			)
		},
	}
}
function fp(i, t, e, n) {
	const s = {},
		r = new WeakMap()
	function o(c) {
		const f = c.target
		f.index !== null && t.remove(f.index)
		for (const g in f.attributes) t.remove(f.attributes[g])
		f.removeEventListener("dispose", o), delete s[f.id]
		const m = r.get(f)
		m && (t.remove(m), r.delete(f)),
			n.releaseStatesOfGeometry(f),
			f.isInstancedBufferGeometry === !0 && delete f._maxInstanceCount,
			e.memory.geometries--
	}
	function a(c, f) {
		return (
			s[f.id] === !0 ||
				(f.addEventListener("dispose", o),
				(s[f.id] = !0),
				e.memory.geometries++),
			f
		)
	}
	function h(c) {
		const f = c.attributes
		for (const m in f) t.update(f[m], i.ARRAY_BUFFER)
	}
	function l(c) {
		const f = [],
			m = c.index,
			g = c.attributes.position
		let _ = 0
		if (m !== null) {
			const b = m.array
			_ = m.version
			for (let T = 0, S = b.length; T < S; T += 3) {
				const C = b[T + 0],
					w = b[T + 1],
					E = b[T + 2]
				f.push(C, w, w, E, E, C)
			}
		} else if (g !== void 0) {
			const b = g.array
			_ = g.version
			for (let T = 0, S = b.length / 3 - 1; T < S; T += 3) {
				const C = T + 0,
					w = T + 1,
					E = T + 2
				f.push(C, w, w, E, E, C)
			}
		} else return
		const p = new (Ql(f) ? ic : nc)(f, 1)
		p.version = _
		const u = r.get(c)
		u && t.remove(u), r.set(c, p)
	}
	function d(c) {
		const f = r.get(c)
		if (f) {
			const m = c.index
			m !== null && f.version < m.version && l(c)
		} else l(c)
		return r.get(c)
	}
	return { get: a, update: h, getWireframeAttribute: d }
}
function pp(i, t, e) {
	let n
	function s(f) {
		n = f
	}
	let r, o
	function a(f) {
		;(r = f.type), (o = f.bytesPerElement)
	}
	function h(f, m) {
		i.drawElements(n, m, r, f * o), e.update(m, n, 1)
	}
	function l(f, m, g) {
		g !== 0 && (i.drawElementsInstanced(n, m, r, f * o, g), e.update(m, n, g))
	}
	function d(f, m, g) {
		if (g === 0) return
		t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n, m, 0, r, f, 0, g)
		let p = 0
		for (let u = 0; u < g; u++) p += m[u]
		e.update(p, n, 1)
	}
	function c(f, m, g, _) {
		if (g === 0) return
		const p = t.get("WEBGL_multi_draw")
		if (p === null) for (let u = 0; u < f.length; u++) l(f[u] / o, m[u], _[u])
		else {
			p.multiDrawElementsInstancedWEBGL(n, m, 0, r, f, 0, _, 0, g)
			let u = 0
			for (let b = 0; b < g; b++) u += m[b] * _[b]
			e.update(u, n, 1)
		}
	}
	;(this.setMode = s),
		(this.setIndex = a),
		(this.render = h),
		(this.renderInstances = l),
		(this.renderMultiDraw = d),
		(this.renderMultiDrawInstances = c)
}
function mp(i) {
	const t = { geometries: 0, textures: 0 },
		e = { frame: 0, calls: 0, triangles: 0, points: 0, lines: 0 }
	function n(r, o, a) {
		switch ((e.calls++, o)) {
			case i.TRIANGLES:
				e.triangles += a * (r / 3)
				break
			case i.LINES:
				e.lines += a * (r / 2)
				break
			case i.LINE_STRIP:
				e.lines += a * (r - 1)
				break
			case i.LINE_LOOP:
				e.lines += a * r
				break
			case i.POINTS:
				e.points += a * r
				break
			default:
				console.error("THREE.WebGLInfo: Unknown draw mode:", o)
				break
		}
	}
	function s() {
		;(e.calls = 0), (e.triangles = 0), (e.points = 0), (e.lines = 0)
	}
	return {
		memory: t,
		render: e,
		programs: null,
		autoReset: !0,
		reset: s,
		update: n,
	}
}
function gp(i, t, e) {
	const n = new WeakMap(),
		s = new de()
	function r(o, a, h) {
		const l = o.morphTargetInfluences,
			d =
				a.morphAttributes.position ||
				a.morphAttributes.normal ||
				a.morphAttributes.color,
			c = d !== void 0 ? d.length : 0
		let f = n.get(a)
		if (f === void 0 || f.count !== c) {
			let y = function () {
				D.dispose(), n.delete(a), a.removeEventListener("dispose", y)
			}
			var m = y
			f !== void 0 && f.texture.dispose()
			const g = a.morphAttributes.position !== void 0,
				_ = a.morphAttributes.normal !== void 0,
				p = a.morphAttributes.color !== void 0,
				u = a.morphAttributes.position || [],
				b = a.morphAttributes.normal || [],
				T = a.morphAttributes.color || []
			let S = 0
			g === !0 && (S = 1), _ === !0 && (S = 2), p === !0 && (S = 3)
			let C = a.attributes.position.count * S,
				w = 1
			C > t.maxTextureSize &&
				((w = Math.ceil(C / t.maxTextureSize)), (C = t.maxTextureSize))
			const E = new Float32Array(C * w * 4 * c),
				D = new tc(E, C, w, c)
			;(D.type = xn), (D.needsUpdate = !0)
			const v = S * 4
			for (let R = 0; R < c; R++) {
				const L = u[R],
					N = b[R],
					z = T[R],
					H = C * w * 4 * R
				for (let W = 0; W < L.count; W++) {
					const j = W * v
					g === !0 &&
						(s.fromBufferAttribute(L, W),
						(E[H + j + 0] = s.x),
						(E[H + j + 1] = s.y),
						(E[H + j + 2] = s.z),
						(E[H + j + 3] = 0)),
						_ === !0 &&
							(s.fromBufferAttribute(N, W),
							(E[H + j + 4] = s.x),
							(E[H + j + 5] = s.y),
							(E[H + j + 6] = s.z),
							(E[H + j + 7] = 0)),
						p === !0 &&
							(s.fromBufferAttribute(z, W),
							(E[H + j + 8] = s.x),
							(E[H + j + 9] = s.y),
							(E[H + j + 10] = s.z),
							(E[H + j + 11] = z.itemSize === 4 ? s.w : 1))
				}
			}
			;(f = { count: c, texture: D, size: new Dt(C, w) }),
				n.set(a, f),
				a.addEventListener("dispose", y)
		}
		if (o.isInstancedMesh === !0 && o.morphTexture !== null)
			h.getUniforms().setValue(i, "morphTexture", o.morphTexture, e)
		else {
			let g = 0
			for (let p = 0; p < l.length; p++) g += l[p]
			const _ = a.morphTargetsRelative ? 1 : 1 - g
			h.getUniforms().setValue(i, "morphTargetBaseInfluence", _),
				h.getUniforms().setValue(i, "morphTargetInfluences", l)
		}
		h.getUniforms().setValue(i, "morphTargetsTexture", f.texture, e),
			h.getUniforms().setValue(i, "morphTargetsTextureSize", f.size)
	}
	return { update: r }
}
function _p(i, t, e, n) {
	let s = new WeakMap()
	function r(h) {
		const l = n.render.frame,
			d = h.geometry,
			c = t.get(h, d)
		if (
			(s.get(c) !== l && (t.update(c), s.set(c, l)),
			h.isInstancedMesh &&
				(h.hasEventListener("dispose", a) === !1 &&
					h.addEventListener("dispose", a),
				s.get(h) !== l &&
					(e.update(h.instanceMatrix, i.ARRAY_BUFFER),
					h.instanceColor !== null && e.update(h.instanceColor, i.ARRAY_BUFFER),
					s.set(h, l))),
			h.isSkinnedMesh)
		) {
			const f = h.skeleton
			s.get(f) !== l && (f.update(), s.set(f, l))
		}
		return c
	}
	function o() {
		s = new WeakMap()
	}
	function a(h) {
		const l = h.target
		l.removeEventListener("dispose", a),
			e.remove(l.instanceMatrix),
			l.instanceColor !== null && e.remove(l.instanceColor)
	}
	return { update: r, dispose: o }
}
const vc = new Oe(),
	hl = new dc(1, 1),
	Mc = new tc(),
	yc = new Gh(),
	Sc = new ac(),
	ul = [],
	dl = [],
	fl = new Float32Array(16),
	pl = new Float32Array(9),
	ml = new Float32Array(4)
function Yi(i, t, e) {
	const n = i[0]
	if (n <= 0 || n > 0) return i
	const s = t * e
	let r = ul[s]
	if ((r === void 0 && ((r = new Float32Array(s)), (ul[s] = r)), t !== 0)) {
		n.toArray(r, 0)
		for (let o = 1, a = 0; o !== t; ++o) (a += e), i[o].toArray(r, a)
	}
	return r
}
function Me(i, t) {
	if (i.length !== t.length) return !1
	for (let e = 0, n = i.length; e < n; e++) if (i[e] !== t[e]) return !1
	return !0
}
function ye(i, t) {
	for (let e = 0, n = t.length; e < n; e++) i[e] = t[e]
}
function vr(i, t) {
	let e = dl[t]
	e === void 0 && ((e = new Int32Array(t)), (dl[t] = e))
	for (let n = 0; n !== t; ++n) e[n] = i.allocateTextureUnit()
	return e
}
function xp(i, t) {
	const e = this.cache
	e[0] !== t && (i.uniform1f(this.addr, t), (e[0] = t))
}
function vp(i, t) {
	const e = this.cache
	if (t.x !== void 0)
		(e[0] !== t.x || e[1] !== t.y) &&
			(i.uniform2f(this.addr, t.x, t.y), (e[0] = t.x), (e[1] = t.y))
	else {
		if (Me(e, t)) return
		i.uniform2fv(this.addr, t), ye(e, t)
	}
}
function Mp(i, t) {
	const e = this.cache
	if (t.x !== void 0)
		(e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) &&
			(i.uniform3f(this.addr, t.x, t.y, t.z),
			(e[0] = t.x),
			(e[1] = t.y),
			(e[2] = t.z))
	else if (t.r !== void 0)
		(e[0] !== t.r || e[1] !== t.g || e[2] !== t.b) &&
			(i.uniform3f(this.addr, t.r, t.g, t.b),
			(e[0] = t.r),
			(e[1] = t.g),
			(e[2] = t.b))
	else {
		if (Me(e, t)) return
		i.uniform3fv(this.addr, t), ye(e, t)
	}
}
function yp(i, t) {
	const e = this.cache
	if (t.x !== void 0)
		(e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) &&
			(i.uniform4f(this.addr, t.x, t.y, t.z, t.w),
			(e[0] = t.x),
			(e[1] = t.y),
			(e[2] = t.z),
			(e[3] = t.w))
	else {
		if (Me(e, t)) return
		i.uniform4fv(this.addr, t), ye(e, t)
	}
}
function Sp(i, t) {
	const e = this.cache,
		n = t.elements
	if (n === void 0) {
		if (Me(e, t)) return
		i.uniformMatrix2fv(this.addr, !1, t), ye(e, t)
	} else {
		if (Me(e, n)) return
		ml.set(n), i.uniformMatrix2fv(this.addr, !1, ml), ye(e, n)
	}
}
function Ep(i, t) {
	const e = this.cache,
		n = t.elements
	if (n === void 0) {
		if (Me(e, t)) return
		i.uniformMatrix3fv(this.addr, !1, t), ye(e, t)
	} else {
		if (Me(e, n)) return
		pl.set(n), i.uniformMatrix3fv(this.addr, !1, pl), ye(e, n)
	}
}
function bp(i, t) {
	const e = this.cache,
		n = t.elements
	if (n === void 0) {
		if (Me(e, t)) return
		i.uniformMatrix4fv(this.addr, !1, t), ye(e, t)
	} else {
		if (Me(e, n)) return
		fl.set(n), i.uniformMatrix4fv(this.addr, !1, fl), ye(e, n)
	}
}
function Tp(i, t) {
	const e = this.cache
	e[0] !== t && (i.uniform1i(this.addr, t), (e[0] = t))
}
function Ap(i, t) {
	const e = this.cache
	if (t.x !== void 0)
		(e[0] !== t.x || e[1] !== t.y) &&
			(i.uniform2i(this.addr, t.x, t.y), (e[0] = t.x), (e[1] = t.y))
	else {
		if (Me(e, t)) return
		i.uniform2iv(this.addr, t), ye(e, t)
	}
}
function wp(i, t) {
	const e = this.cache
	if (t.x !== void 0)
		(e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) &&
			(i.uniform3i(this.addr, t.x, t.y, t.z),
			(e[0] = t.x),
			(e[1] = t.y),
			(e[2] = t.z))
	else {
		if (Me(e, t)) return
		i.uniform3iv(this.addr, t), ye(e, t)
	}
}
function Rp(i, t) {
	const e = this.cache
	if (t.x !== void 0)
		(e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) &&
			(i.uniform4i(this.addr, t.x, t.y, t.z, t.w),
			(e[0] = t.x),
			(e[1] = t.y),
			(e[2] = t.z),
			(e[3] = t.w))
	else {
		if (Me(e, t)) return
		i.uniform4iv(this.addr, t), ye(e, t)
	}
}
function Cp(i, t) {
	const e = this.cache
	e[0] !== t && (i.uniform1ui(this.addr, t), (e[0] = t))
}
function Pp(i, t) {
	const e = this.cache
	if (t.x !== void 0)
		(e[0] !== t.x || e[1] !== t.y) &&
			(i.uniform2ui(this.addr, t.x, t.y), (e[0] = t.x), (e[1] = t.y))
	else {
		if (Me(e, t)) return
		i.uniform2uiv(this.addr, t), ye(e, t)
	}
}
function Dp(i, t) {
	const e = this.cache
	if (t.x !== void 0)
		(e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) &&
			(i.uniform3ui(this.addr, t.x, t.y, t.z),
			(e[0] = t.x),
			(e[1] = t.y),
			(e[2] = t.z))
	else {
		if (Me(e, t)) return
		i.uniform3uiv(this.addr, t), ye(e, t)
	}
}
function Lp(i, t) {
	const e = this.cache
	if (t.x !== void 0)
		(e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) &&
			(i.uniform4ui(this.addr, t.x, t.y, t.z, t.w),
			(e[0] = t.x),
			(e[1] = t.y),
			(e[2] = t.z),
			(e[3] = t.w))
	else {
		if (Me(e, t)) return
		i.uniform4uiv(this.addr, t), ye(e, t)
	}
}
function Ip(i, t, e) {
	const n = this.cache,
		s = e.allocateTextureUnit()
	n[0] !== s && (i.uniform1i(this.addr, s), (n[0] = s))
	let r
	this.type === i.SAMPLER_2D_SHADOW
		? ((hl.compareFunction = Jl), (r = hl))
		: (r = vc),
		e.setTexture2D(t || r, s)
}
function Up(i, t, e) {
	const n = this.cache,
		s = e.allocateTextureUnit()
	n[0] !== s && (i.uniform1i(this.addr, s), (n[0] = s)),
		e.setTexture3D(t || yc, s)
}
function Np(i, t, e) {
	const n = this.cache,
		s = e.allocateTextureUnit()
	n[0] !== s && (i.uniform1i(this.addr, s), (n[0] = s)),
		e.setTextureCube(t || Sc, s)
}
function Fp(i, t, e) {
	const n = this.cache,
		s = e.allocateTextureUnit()
	n[0] !== s && (i.uniform1i(this.addr, s), (n[0] = s)),
		e.setTexture2DArray(t || Mc, s)
}
function Op(i) {
	switch (i) {
		case 5126:
			return xp
		case 35664:
			return vp
		case 35665:
			return Mp
		case 35666:
			return yp
		case 35674:
			return Sp
		case 35675:
			return Ep
		case 35676:
			return bp
		case 5124:
		case 35670:
			return Tp
		case 35667:
		case 35671:
			return Ap
		case 35668:
		case 35672:
			return wp
		case 35669:
		case 35673:
			return Rp
		case 5125:
			return Cp
		case 36294:
			return Pp
		case 36295:
			return Dp
		case 36296:
			return Lp
		case 35678:
		case 36198:
		case 36298:
		case 36306:
		case 35682:
			return Ip
		case 35679:
		case 36299:
		case 36307:
			return Up
		case 35680:
		case 36300:
		case 36308:
		case 36293:
			return Np
		case 36289:
		case 36303:
		case 36311:
		case 36292:
			return Fp
	}
}
function Bp(i, t) {
	i.uniform1fv(this.addr, t)
}
function zp(i, t) {
	const e = Yi(t, this.size, 2)
	i.uniform2fv(this.addr, e)
}
function Hp(i, t) {
	const e = Yi(t, this.size, 3)
	i.uniform3fv(this.addr, e)
}
function kp(i, t) {
	const e = Yi(t, this.size, 4)
	i.uniform4fv(this.addr, e)
}
function Gp(i, t) {
	const e = Yi(t, this.size, 4)
	i.uniformMatrix2fv(this.addr, !1, e)
}
function Vp(i, t) {
	const e = Yi(t, this.size, 9)
	i.uniformMatrix3fv(this.addr, !1, e)
}
function Wp(i, t) {
	const e = Yi(t, this.size, 16)
	i.uniformMatrix4fv(this.addr, !1, e)
}
function Xp(i, t) {
	i.uniform1iv(this.addr, t)
}
function Yp(i, t) {
	i.uniform2iv(this.addr, t)
}
function qp(i, t) {
	i.uniform3iv(this.addr, t)
}
function jp(i, t) {
	i.uniform4iv(this.addr, t)
}
function Kp(i, t) {
	i.uniform1uiv(this.addr, t)
}
function Zp(i, t) {
	i.uniform2uiv(this.addr, t)
}
function $p(i, t) {
	i.uniform3uiv(this.addr, t)
}
function Jp(i, t) {
	i.uniform4uiv(this.addr, t)
}
function Qp(i, t, e) {
	const n = this.cache,
		s = t.length,
		r = vr(e, s)
	Me(n, r) || (i.uniform1iv(this.addr, r), ye(n, r))
	for (let o = 0; o !== s; ++o) e.setTexture2D(t[o] || vc, r[o])
}
function tm(i, t, e) {
	const n = this.cache,
		s = t.length,
		r = vr(e, s)
	Me(n, r) || (i.uniform1iv(this.addr, r), ye(n, r))
	for (let o = 0; o !== s; ++o) e.setTexture3D(t[o] || yc, r[o])
}
function em(i, t, e) {
	const n = this.cache,
		s = t.length,
		r = vr(e, s)
	Me(n, r) || (i.uniform1iv(this.addr, r), ye(n, r))
	for (let o = 0; o !== s; ++o) e.setTextureCube(t[o] || Sc, r[o])
}
function nm(i, t, e) {
	const n = this.cache,
		s = t.length,
		r = vr(e, s)
	Me(n, r) || (i.uniform1iv(this.addr, r), ye(n, r))
	for (let o = 0; o !== s; ++o) e.setTexture2DArray(t[o] || Mc, r[o])
}
function im(i) {
	switch (i) {
		case 5126:
			return Bp
		case 35664:
			return zp
		case 35665:
			return Hp
		case 35666:
			return kp
		case 35674:
			return Gp
		case 35675:
			return Vp
		case 35676:
			return Wp
		case 5124:
		case 35670:
			return Xp
		case 35667:
		case 35671:
			return Yp
		case 35668:
		case 35672:
			return qp
		case 35669:
		case 35673:
			return jp
		case 5125:
			return Kp
		case 36294:
			return Zp
		case 36295:
			return $p
		case 36296:
			return Jp
		case 35678:
		case 36198:
		case 36298:
		case 36306:
		case 35682:
			return Qp
		case 35679:
		case 36299:
		case 36307:
			return tm
		case 35680:
		case 36300:
		case 36308:
		case 36293:
			return em
		case 36289:
		case 36303:
		case 36311:
		case 36292:
			return nm
	}
}
class sm {
	constructor(t, e, n) {
		;(this.id = t),
			(this.addr = n),
			(this.cache = []),
			(this.type = e.type),
			(this.setValue = Op(e.type))
	}
}
class rm {
	constructor(t, e, n) {
		;(this.id = t),
			(this.addr = n),
			(this.cache = []),
			(this.type = e.type),
			(this.size = e.size),
			(this.setValue = im(e.type))
	}
}
class om {
	constructor(t) {
		;(this.id = t), (this.seq = []), (this.map = {})
	}
	setValue(t, e, n) {
		const s = this.seq
		for (let r = 0, o = s.length; r !== o; ++r) {
			const a = s[r]
			a.setValue(t, e[a.id], n)
		}
	}
}
const no = /(\w+)(\])?(\[|\.)?/g
function gl(i, t) {
	i.seq.push(t), (i.map[t.id] = t)
}
function am(i, t, e) {
	const n = i.name,
		s = n.length
	for (no.lastIndex = 0; ; ) {
		const r = no.exec(n),
			o = no.lastIndex
		let a = r[1]
		const h = r[2] === "]",
			l = r[3]
		if ((h && (a = a | 0), l === void 0 || (l === "[" && o + 2 === s))) {
			gl(e, l === void 0 ? new sm(a, i, t) : new rm(a, i, t))
			break
		} else {
			let c = e.map[a]
			c === void 0 && ((c = new om(a)), gl(e, c)), (e = c)
		}
	}
}
class sr {
	constructor(t, e) {
		;(this.seq = []), (this.map = {})
		const n = t.getProgramParameter(e, t.ACTIVE_UNIFORMS)
		for (let s = 0; s < n; ++s) {
			const r = t.getActiveUniform(e, s),
				o = t.getUniformLocation(e, r.name)
			am(r, o, this)
		}
	}
	setValue(t, e, n, s) {
		const r = this.map[e]
		r !== void 0 && r.setValue(t, n, s)
	}
	setOptional(t, e, n) {
		const s = e[n]
		s !== void 0 && this.setValue(t, n, s)
	}
	static upload(t, e, n, s) {
		for (let r = 0, o = e.length; r !== o; ++r) {
			const a = e[r],
				h = n[a.id]
			h.needsUpdate !== !1 && a.setValue(t, h.value, s)
		}
	}
	static seqWithValue(t, e) {
		const n = []
		for (let s = 0, r = t.length; s !== r; ++s) {
			const o = t[s]
			o.id in e && n.push(o)
		}
		return n
	}
}
function _l(i, t, e) {
	const n = i.createShader(t)
	return i.shaderSource(n, e), i.compileShader(n), n
}
const lm = 37297
let cm = 0
function hm(i, t) {
	const e = i.split(`
`),
		n = [],
		s = Math.max(t - 6, 0),
		r = Math.min(t + 6, e.length)
	for (let o = s; o < r; o++) {
		const a = o + 1
		n.push(`${a === t ? ">" : " "} ${a}: ${e[o]}`)
	}
	return n.join(`
`)
}
const xl = new Nt()
function um(i) {
	Xt._getMatrix(xl, Xt.workingColorSpace, i)
	const t = `mat3( ${xl.elements.map((e) => e.toFixed(4))} )`
	switch (Xt.getTransfer(i)) {
		case lr:
			return [t, "LinearTransferOETF"]
		case Jt:
			return [t, "sRGBTransferOETF"]
		default:
			return (
				console.warn("THREE.WebGLProgram: Unsupported color space: ", i),
				[t, "LinearTransferOETF"]
			)
	}
}
function vl(i, t, e) {
	const n = i.getShaderParameter(t, i.COMPILE_STATUS),
		r = (i.getShaderInfoLog(t) || "").trim()
	if (n && r === "") return ""
	const o = /ERROR: 0:(\d+)/.exec(r)
	if (o) {
		const a = parseInt(o[1])
		return (
			e.toUpperCase() +
			`

` +
			r +
			`

` +
			hm(i.getShaderSource(t), a)
		)
	} else return r
}
function dm(i, t) {
	const e = um(t)
	return [
		`vec4 ${i}( vec4 value ) {`,
		`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,
		"}",
	].join(`
`)
}
function fm(i, t) {
	let e
	switch (t) {
		case mh:
			e = "Linear"
			break
		case gh:
			e = "Reinhard"
			break
		case _h:
			e = "Cineon"
			break
		case xh:
			e = "ACESFilmic"
			break
		case Mh:
			e = "AgX"
			break
		case yh:
			e = "Neutral"
			break
		case vh:
			e = "Custom"
			break
		default:
			console.warn("THREE.WebGLProgram: Unsupported toneMapping:", t),
				(e = "Linear")
	}
	return (
		"vec3 " + i + "( vec3 color ) { return " + e + "ToneMapping( color ); }"
	)
}
const Zs = new U()
function pm() {
	Xt.getLuminanceCoefficients(Zs)
	const i = Zs.x.toFixed(4),
		t = Zs.y.toFixed(4),
		e = Zs.z.toFixed(4)
	return [
		"float luminance( const in vec3 rgb ) {",
		`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,
		"	return dot( weights, rgb );",
		"}",
	].join(`
`)
}
function mm(i) {
	return [
		i.extensionClipCullDistance
			? "#extension GL_ANGLE_clip_cull_distance : require"
			: "",
		i.extensionMultiDraw ? "#extension GL_ANGLE_multi_draw : require" : "",
	].filter(is).join(`
`)
}
function gm(i) {
	const t = []
	for (const e in i) {
		const n = i[e]
		n !== !1 && t.push("#define " + e + " " + n)
	}
	return t.join(`
`)
}
function _m(i, t) {
	const e = {},
		n = i.getProgramParameter(t, i.ACTIVE_ATTRIBUTES)
	for (let s = 0; s < n; s++) {
		const r = i.getActiveAttrib(t, s),
			o = r.name
		let a = 1
		r.type === i.FLOAT_MAT2 && (a = 2),
			r.type === i.FLOAT_MAT3 && (a = 3),
			r.type === i.FLOAT_MAT4 && (a = 4),
			(e[o] = {
				type: r.type,
				location: i.getAttribLocation(t, o),
				locationSize: a,
			})
	}
	return e
}
function is(i) {
	return i !== ""
}
function Ml(i, t) {
	const e =
		t.numSpotLightShadows + t.numSpotLightMaps - t.numSpotLightShadowsWithMaps
	return i
		.replace(/NUM_DIR_LIGHTS/g, t.numDirLights)
		.replace(/NUM_SPOT_LIGHTS/g, t.numSpotLights)
		.replace(/NUM_SPOT_LIGHT_MAPS/g, t.numSpotLightMaps)
		.replace(/NUM_SPOT_LIGHT_COORDS/g, e)
		.replace(/NUM_RECT_AREA_LIGHTS/g, t.numRectAreaLights)
		.replace(/NUM_POINT_LIGHTS/g, t.numPointLights)
		.replace(/NUM_HEMI_LIGHTS/g, t.numHemiLights)
		.replace(/NUM_DIR_LIGHT_SHADOWS/g, t.numDirLightShadows)
		.replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, t.numSpotLightShadowsWithMaps)
		.replace(/NUM_SPOT_LIGHT_SHADOWS/g, t.numSpotLightShadows)
		.replace(/NUM_POINT_LIGHT_SHADOWS/g, t.numPointLightShadows)
}
function yl(i, t) {
	return i
		.replace(/NUM_CLIPPING_PLANES/g, t.numClippingPlanes)
		.replace(
			/UNION_CLIPPING_PLANES/g,
			t.numClippingPlanes - t.numClipIntersection
		)
}
const xm = /^[ \t]*#include +<([\w\d./]+)>/gm
function Ko(i) {
	return i.replace(xm, Mm)
}
const vm = new Map()
function Mm(i, t) {
	let e = Ot[t]
	if (e === void 0) {
		const n = vm.get(t)
		if (n !== void 0)
			(e = Ot[n]),
				console.warn(
					'THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',
					t,
					n
				)
		else throw new Error("Can not resolve #include <" + t + ">")
	}
	return Ko(e)
}
const ym =
	/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g
function Sl(i) {
	return i.replace(ym, Sm)
}
function Sm(i, t, e, n) {
	let s = ""
	for (let r = parseInt(t); r < parseInt(e); r++)
		s += n
			.replace(/\[\s*i\s*\]/g, "[ " + r + " ]")
			.replace(/UNROLLED_LOOP_INDEX/g, r)
	return s
}
function El(i) {
	let t = `precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`
	return (
		i.precision === "highp"
			? (t += `
#define HIGH_PRECISION`)
			: i.precision === "mediump"
			? (t += `
#define MEDIUM_PRECISION`)
			: i.precision === "lowp" &&
			  (t += `
#define LOW_PRECISION`),
		t
	)
}
function Em(i) {
	let t = "SHADOWMAP_TYPE_BASIC"
	return (
		i.shadowMapType === Hl
			? (t = "SHADOWMAP_TYPE_PCF")
			: i.shadowMapType === jc
			? (t = "SHADOWMAP_TYPE_PCF_SOFT")
			: i.shadowMapType === Cn && (t = "SHADOWMAP_TYPE_VSM"),
		t
	)
}
function bm(i) {
	let t = "ENVMAP_TYPE_CUBE"
	if (i.envMap)
		switch (i.envMapMode) {
			case Hi:
			case ki:
				t = "ENVMAP_TYPE_CUBE"
				break
			case xr:
				t = "ENVMAP_TYPE_CUBE_UV"
				break
		}
	return t
}
function Tm(i) {
	let t = "ENVMAP_MODE_REFLECTION"
	if (i.envMap)
		switch (i.envMapMode) {
			case ki:
				t = "ENVMAP_MODE_REFRACTION"
				break
		}
	return t
}
function Am(i) {
	let t = "ENVMAP_BLENDING_NONE"
	if (i.envMap)
		switch (i.combine) {
			case kl:
				t = "ENVMAP_BLENDING_MULTIPLY"
				break
			case fh:
				t = "ENVMAP_BLENDING_MIX"
				break
			case ph:
				t = "ENVMAP_BLENDING_ADD"
				break
		}
	return t
}
function wm(i) {
	const t = i.envMapCubeUVHeight
	if (t === null) return null
	const e = Math.log2(t) - 2,
		n = 1 / t
	return {
		texelWidth: 1 / (3 * Math.max(Math.pow(2, e), 112)),
		texelHeight: n,
		maxMip: e,
	}
}
function Rm(i, t, e, n) {
	const s = i.getContext(),
		r = e.defines
	let o = e.vertexShader,
		a = e.fragmentShader
	const h = Em(e),
		l = bm(e),
		d = Tm(e),
		c = Am(e),
		f = wm(e),
		m = mm(e),
		g = gm(r),
		_ = s.createProgram()
	let p,
		u,
		b = e.glslVersion
			? "#version " +
			  e.glslVersion +
			  `
`
			: ""
	e.isRawShaderMaterial
		? ((p = [
				"#define SHADER_TYPE " + e.shaderType,
				"#define SHADER_NAME " + e.shaderName,
				g,
		  ].filter(is).join(`
`)),
		  p.length > 0 &&
				(p += `
`),
		  (u = [
				"#define SHADER_TYPE " + e.shaderType,
				"#define SHADER_NAME " + e.shaderName,
				g,
		  ].filter(is).join(`
`)),
		  u.length > 0 &&
				(u += `
`))
		: ((p = [
				El(e),
				"#define SHADER_TYPE " + e.shaderType,
				"#define SHADER_NAME " + e.shaderName,
				g,
				e.extensionClipCullDistance ? "#define USE_CLIP_DISTANCE" : "",
				e.batching ? "#define USE_BATCHING" : "",
				e.batchingColor ? "#define USE_BATCHING_COLOR" : "",
				e.instancing ? "#define USE_INSTANCING" : "",
				e.instancingColor ? "#define USE_INSTANCING_COLOR" : "",
				e.instancingMorph ? "#define USE_INSTANCING_MORPH" : "",
				e.useFog && e.fog ? "#define USE_FOG" : "",
				e.useFog && e.fogExp2 ? "#define FOG_EXP2" : "",
				e.map ? "#define USE_MAP" : "",
				e.envMap ? "#define USE_ENVMAP" : "",
				e.envMap ? "#define " + d : "",
				e.lightMap ? "#define USE_LIGHTMAP" : "",
				e.aoMap ? "#define USE_AOMAP" : "",
				e.bumpMap ? "#define USE_BUMPMAP" : "",
				e.normalMap ? "#define USE_NORMALMAP" : "",
				e.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
				e.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
				e.displacementMap ? "#define USE_DISPLACEMENTMAP" : "",
				e.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
				e.anisotropy ? "#define USE_ANISOTROPY" : "",
				e.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
				e.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
				e.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
				e.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
				e.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
				e.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
				e.specularMap ? "#define USE_SPECULARMAP" : "",
				e.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
				e.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
				e.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
				e.metalnessMap ? "#define USE_METALNESSMAP" : "",
				e.alphaMap ? "#define USE_ALPHAMAP" : "",
				e.alphaHash ? "#define USE_ALPHAHASH" : "",
				e.transmission ? "#define USE_TRANSMISSION" : "",
				e.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
				e.thicknessMap ? "#define USE_THICKNESSMAP" : "",
				e.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
				e.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
				e.mapUv ? "#define MAP_UV " + e.mapUv : "",
				e.alphaMapUv ? "#define ALPHAMAP_UV " + e.alphaMapUv : "",
				e.lightMapUv ? "#define LIGHTMAP_UV " + e.lightMapUv : "",
				e.aoMapUv ? "#define AOMAP_UV " + e.aoMapUv : "",
				e.emissiveMapUv ? "#define EMISSIVEMAP_UV " + e.emissiveMapUv : "",
				e.bumpMapUv ? "#define BUMPMAP_UV " + e.bumpMapUv : "",
				e.normalMapUv ? "#define NORMALMAP_UV " + e.normalMapUv : "",
				e.displacementMapUv
					? "#define DISPLACEMENTMAP_UV " + e.displacementMapUv
					: "",
				e.metalnessMapUv ? "#define METALNESSMAP_UV " + e.metalnessMapUv : "",
				e.roughnessMapUv ? "#define ROUGHNESSMAP_UV " + e.roughnessMapUv : "",
				e.anisotropyMapUv
					? "#define ANISOTROPYMAP_UV " + e.anisotropyMapUv
					: "",
				e.clearcoatMapUv ? "#define CLEARCOATMAP_UV " + e.clearcoatMapUv : "",
				e.clearcoatNormalMapUv
					? "#define CLEARCOAT_NORMALMAP_UV " + e.clearcoatNormalMapUv
					: "",
				e.clearcoatRoughnessMapUv
					? "#define CLEARCOAT_ROUGHNESSMAP_UV " + e.clearcoatRoughnessMapUv
					: "",
				e.iridescenceMapUv
					? "#define IRIDESCENCEMAP_UV " + e.iridescenceMapUv
					: "",
				e.iridescenceThicknessMapUv
					? "#define IRIDESCENCE_THICKNESSMAP_UV " + e.iridescenceThicknessMapUv
					: "",
				e.sheenColorMapUv
					? "#define SHEEN_COLORMAP_UV " + e.sheenColorMapUv
					: "",
				e.sheenRoughnessMapUv
					? "#define SHEEN_ROUGHNESSMAP_UV " + e.sheenRoughnessMapUv
					: "",
				e.specularMapUv ? "#define SPECULARMAP_UV " + e.specularMapUv : "",
				e.specularColorMapUv
					? "#define SPECULAR_COLORMAP_UV " + e.specularColorMapUv
					: "",
				e.specularIntensityMapUv
					? "#define SPECULAR_INTENSITYMAP_UV " + e.specularIntensityMapUv
					: "",
				e.transmissionMapUv
					? "#define TRANSMISSIONMAP_UV " + e.transmissionMapUv
					: "",
				e.thicknessMapUv ? "#define THICKNESSMAP_UV " + e.thicknessMapUv : "",
				e.vertexTangents && e.flatShading === !1 ? "#define USE_TANGENT" : "",
				e.vertexColors ? "#define USE_COLOR" : "",
				e.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
				e.vertexUv1s ? "#define USE_UV1" : "",
				e.vertexUv2s ? "#define USE_UV2" : "",
				e.vertexUv3s ? "#define USE_UV3" : "",
				e.pointsUvs ? "#define USE_POINTS_UV" : "",
				e.flatShading ? "#define FLAT_SHADED" : "",
				e.skinning ? "#define USE_SKINNING" : "",
				e.morphTargets ? "#define USE_MORPHTARGETS" : "",
				e.morphNormals && e.flatShading === !1
					? "#define USE_MORPHNORMALS"
					: "",
				e.morphColors ? "#define USE_MORPHCOLORS" : "",
				e.morphTargetsCount > 0
					? "#define MORPHTARGETS_TEXTURE_STRIDE " + e.morphTextureStride
					: "",
				e.morphTargetsCount > 0
					? "#define MORPHTARGETS_COUNT " + e.morphTargetsCount
					: "",
				e.doubleSided ? "#define DOUBLE_SIDED" : "",
				e.flipSided ? "#define FLIP_SIDED" : "",
				e.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
				e.shadowMapEnabled ? "#define " + h : "",
				e.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "",
				e.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
				e.logarithmicDepthBuffer ? "#define USE_LOGARITHMIC_DEPTH_BUFFER" : "",
				e.reversedDepthBuffer ? "#define USE_REVERSED_DEPTH_BUFFER" : "",
				"uniform mat4 modelMatrix;",
				"uniform mat4 modelViewMatrix;",
				"uniform mat4 projectionMatrix;",
				"uniform mat4 viewMatrix;",
				"uniform mat3 normalMatrix;",
				"uniform vec3 cameraPosition;",
				"uniform bool isOrthographic;",
				"#ifdef USE_INSTANCING",
				"	attribute mat4 instanceMatrix;",
				"#endif",
				"#ifdef USE_INSTANCING_COLOR",
				"	attribute vec3 instanceColor;",
				"#endif",
				"#ifdef USE_INSTANCING_MORPH",
				"	uniform sampler2D morphTexture;",
				"#endif",
				"attribute vec3 position;",
				"attribute vec3 normal;",
				"attribute vec2 uv;",
				"#ifdef USE_UV1",
				"	attribute vec2 uv1;",
				"#endif",
				"#ifdef USE_UV2",
				"	attribute vec2 uv2;",
				"#endif",
				"#ifdef USE_UV3",
				"	attribute vec2 uv3;",
				"#endif",
				"#ifdef USE_TANGENT",
				"	attribute vec4 tangent;",
				"#endif",
				"#if defined( USE_COLOR_ALPHA )",
				"	attribute vec4 color;",
				"#elif defined( USE_COLOR )",
				"	attribute vec3 color;",
				"#endif",
				"#ifdef USE_SKINNING",
				"	attribute vec4 skinIndex;",
				"	attribute vec4 skinWeight;",
				"#endif",
				`
`,
		  ].filter(is).join(`
`)),
		  (u = [
				El(e),
				"#define SHADER_TYPE " + e.shaderType,
				"#define SHADER_NAME " + e.shaderName,
				g,
				e.useFog && e.fog ? "#define USE_FOG" : "",
				e.useFog && e.fogExp2 ? "#define FOG_EXP2" : "",
				e.alphaToCoverage ? "#define ALPHA_TO_COVERAGE" : "",
				e.map ? "#define USE_MAP" : "",
				e.matcap ? "#define USE_MATCAP" : "",
				e.envMap ? "#define USE_ENVMAP" : "",
				e.envMap ? "#define " + l : "",
				e.envMap ? "#define " + d : "",
				e.envMap ? "#define " + c : "",
				f ? "#define CUBEUV_TEXEL_WIDTH " + f.texelWidth : "",
				f ? "#define CUBEUV_TEXEL_HEIGHT " + f.texelHeight : "",
				f ? "#define CUBEUV_MAX_MIP " + f.maxMip + ".0" : "",
				e.lightMap ? "#define USE_LIGHTMAP" : "",
				e.aoMap ? "#define USE_AOMAP" : "",
				e.bumpMap ? "#define USE_BUMPMAP" : "",
				e.normalMap ? "#define USE_NORMALMAP" : "",
				e.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
				e.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
				e.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
				e.anisotropy ? "#define USE_ANISOTROPY" : "",
				e.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
				e.clearcoat ? "#define USE_CLEARCOAT" : "",
				e.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
				e.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
				e.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
				e.dispersion ? "#define USE_DISPERSION" : "",
				e.iridescence ? "#define USE_IRIDESCENCE" : "",
				e.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
				e.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
				e.specularMap ? "#define USE_SPECULARMAP" : "",
				e.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
				e.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
				e.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
				e.metalnessMap ? "#define USE_METALNESSMAP" : "",
				e.alphaMap ? "#define USE_ALPHAMAP" : "",
				e.alphaTest ? "#define USE_ALPHATEST" : "",
				e.alphaHash ? "#define USE_ALPHAHASH" : "",
				e.sheen ? "#define USE_SHEEN" : "",
				e.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
				e.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
				e.transmission ? "#define USE_TRANSMISSION" : "",
				e.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
				e.thicknessMap ? "#define USE_THICKNESSMAP" : "",
				e.vertexTangents && e.flatShading === !1 ? "#define USE_TANGENT" : "",
				e.vertexColors || e.instancingColor || e.batchingColor
					? "#define USE_COLOR"
					: "",
				e.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
				e.vertexUv1s ? "#define USE_UV1" : "",
				e.vertexUv2s ? "#define USE_UV2" : "",
				e.vertexUv3s ? "#define USE_UV3" : "",
				e.pointsUvs ? "#define USE_POINTS_UV" : "",
				e.gradientMap ? "#define USE_GRADIENTMAP" : "",
				e.flatShading ? "#define FLAT_SHADED" : "",
				e.doubleSided ? "#define DOUBLE_SIDED" : "",
				e.flipSided ? "#define FLIP_SIDED" : "",
				e.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
				e.shadowMapEnabled ? "#define " + h : "",
				e.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : "",
				e.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
				e.decodeVideoTexture ? "#define DECODE_VIDEO_TEXTURE" : "",
				e.decodeVideoTextureEmissive
					? "#define DECODE_VIDEO_TEXTURE_EMISSIVE"
					: "",
				e.logarithmicDepthBuffer ? "#define USE_LOGARITHMIC_DEPTH_BUFFER" : "",
				e.reversedDepthBuffer ? "#define USE_REVERSED_DEPTH_BUFFER" : "",
				"uniform mat4 viewMatrix;",
				"uniform vec3 cameraPosition;",
				"uniform bool isOrthographic;",
				e.toneMapping !== Yn ? "#define TONE_MAPPING" : "",
				e.toneMapping !== Yn ? Ot.tonemapping_pars_fragment : "",
				e.toneMapping !== Yn ? fm("toneMapping", e.toneMapping) : "",
				e.dithering ? "#define DITHERING" : "",
				e.opaque ? "#define OPAQUE" : "",
				Ot.colorspace_pars_fragment,
				dm("linearToOutputTexel", e.outputColorSpace),
				pm(),
				e.useDepthPacking ? "#define DEPTH_PACKING " + e.depthPacking : "",
				`
`,
		  ].filter(is).join(`
`))),
		(o = Ko(o)),
		(o = Ml(o, e)),
		(o = yl(o, e)),
		(a = Ko(a)),
		(a = Ml(a, e)),
		(a = yl(a, e)),
		(o = Sl(o)),
		(a = Sl(a)),
		e.isRawShaderMaterial !== !0 &&
			((b = `#version 300 es
`),
			(p =
				[
					m,
					"#define attribute in",
					"#define varying out",
					"#define texture2D texture",
				].join(`
`) +
				`
` +
				p),
			(u =
				[
					"#define varying in",
					e.glslVersion === wa
						? ""
						: "layout(location = 0) out highp vec4 pc_fragColor;",
					e.glslVersion === wa ? "" : "#define gl_FragColor pc_fragColor",
					"#define gl_FragDepthEXT gl_FragDepth",
					"#define texture2D texture",
					"#define textureCube texture",
					"#define texture2DProj textureProj",
					"#define texture2DLodEXT textureLod",
					"#define texture2DProjLodEXT textureProjLod",
					"#define textureCubeLodEXT textureLod",
					"#define texture2DGradEXT textureGrad",
					"#define texture2DProjGradEXT textureProjGrad",
					"#define textureCubeGradEXT textureGrad",
				].join(`
`) +
				`
` +
				u))
	const T = b + p + o,
		S = b + u + a,
		C = _l(s, s.VERTEX_SHADER, T),
		w = _l(s, s.FRAGMENT_SHADER, S)
	s.attachShader(_, C),
		s.attachShader(_, w),
		e.index0AttributeName !== void 0
			? s.bindAttribLocation(_, 0, e.index0AttributeName)
			: e.morphTargets === !0 && s.bindAttribLocation(_, 0, "position"),
		s.linkProgram(_)
	function E(R) {
		if (i.debug.checkShaderErrors) {
			const L = s.getProgramInfoLog(_) || "",
				N = s.getShaderInfoLog(C) || "",
				z = s.getShaderInfoLog(w) || "",
				H = L.trim(),
				W = N.trim(),
				j = z.trim()
			let V = !0,
				rt = !0
			if (s.getProgramParameter(_, s.LINK_STATUS) === !1)
				if (((V = !1), typeof i.debug.onShaderError == "function"))
					i.debug.onShaderError(s, _, C, w)
				else {
					const ht = vl(s, C, "vertex"),
						Et = vl(s, w, "fragment")
					console.error(
						"THREE.WebGLProgram: Shader Error " +
							s.getError() +
							" - VALIDATE_STATUS " +
							s.getProgramParameter(_, s.VALIDATE_STATUS) +
							`

Material Name: ` +
							R.name +
							`
Material Type: ` +
							R.type +
							`

Program Info Log: ` +
							H +
							`
` +
							ht +
							`
` +
							Et
					)
				}
			else
				H !== ""
					? console.warn("THREE.WebGLProgram: Program Info Log:", H)
					: (W === "" || j === "") && (rt = !1)
			rt &&
				(R.diagnostics = {
					runnable: V,
					programLog: H,
					vertexShader: { log: W, prefix: p },
					fragmentShader: { log: j, prefix: u },
				})
		}
		s.deleteShader(C), s.deleteShader(w), (D = new sr(s, _)), (v = _m(s, _))
	}
	let D
	this.getUniforms = function () {
		return D === void 0 && E(this), D
	}
	let v
	this.getAttributes = function () {
		return v === void 0 && E(this), v
	}
	let y = e.rendererExtensionParallelShaderCompile === !1
	return (
		(this.isReady = function () {
			return y === !1 && (y = s.getProgramParameter(_, lm)), y
		}),
		(this.destroy = function () {
			n.releaseStatesOfProgram(this),
				s.deleteProgram(_),
				(this.program = void 0)
		}),
		(this.type = e.shaderType),
		(this.name = e.shaderName),
		(this.id = cm++),
		(this.cacheKey = t),
		(this.usedTimes = 1),
		(this.program = _),
		(this.vertexShader = C),
		(this.fragmentShader = w),
		this
	)
}
let Cm = 0
class Pm {
	constructor() {
		;(this.shaderCache = new Map()), (this.materialCache = new Map())
	}
	update(t) {
		const e = t.vertexShader,
			n = t.fragmentShader,
			s = this._getShaderStage(e),
			r = this._getShaderStage(n),
			o = this._getShaderCacheForMaterial(t)
		return (
			o.has(s) === !1 && (o.add(s), s.usedTimes++),
			o.has(r) === !1 && (o.add(r), r.usedTimes++),
			this
		)
	}
	remove(t) {
		const e = this.materialCache.get(t)
		for (const n of e)
			n.usedTimes--, n.usedTimes === 0 && this.shaderCache.delete(n.code)
		return this.materialCache.delete(t), this
	}
	getVertexShaderID(t) {
		return this._getShaderStage(t.vertexShader).id
	}
	getFragmentShaderID(t) {
		return this._getShaderStage(t.fragmentShader).id
	}
	dispose() {
		this.shaderCache.clear(), this.materialCache.clear()
	}
	_getShaderCacheForMaterial(t) {
		const e = this.materialCache
		let n = e.get(t)
		return n === void 0 && ((n = new Set()), e.set(t, n)), n
	}
	_getShaderStage(t) {
		const e = this.shaderCache
		let n = e.get(t)
		return n === void 0 && ((n = new Dm(t)), e.set(t, n)), n
	}
}
class Dm {
	constructor(t) {
		;(this.id = Cm++), (this.code = t), (this.usedTimes = 0)
	}
}
function Lm(i, t, e, n, s, r, o) {
	const a = new sa(),
		h = new Pm(),
		l = new Set(),
		d = [],
		c = s.logarithmicDepthBuffer,
		f = s.vertexTextures
	let m = s.precision
	const g = {
		MeshDepthMaterial: "depth",
		MeshDistanceMaterial: "distanceRGBA",
		MeshNormalMaterial: "normal",
		MeshBasicMaterial: "basic",
		MeshLambertMaterial: "lambert",
		MeshPhongMaterial: "phong",
		MeshToonMaterial: "toon",
		MeshStandardMaterial: "physical",
		MeshPhysicalMaterial: "physical",
		MeshMatcapMaterial: "matcap",
		LineBasicMaterial: "basic",
		LineDashedMaterial: "dashed",
		PointsMaterial: "points",
		ShadowMaterial: "shadow",
		SpriteMaterial: "sprite",
	}
	function _(v) {
		return l.add(v), v === 0 ? "uv" : `uv${v}`
	}
	function p(v, y, R, L, N) {
		const z = L.fog,
			H = N.geometry,
			W = v.isMeshStandardMaterial ? L.environment : null,
			j = (v.isMeshStandardMaterial ? e : t).get(v.envMap || W),
			V = j && j.mapping === xr ? j.image.height : null,
			rt = g[v.type]
		v.precision !== null &&
			((m = s.getMaxPrecision(v.precision)),
			m !== v.precision &&
				console.warn(
					"THREE.WebGLProgram.getParameters:",
					v.precision,
					"not supported, using",
					m,
					"instead."
				))
		const ht =
				H.morphAttributes.position ||
				H.morphAttributes.normal ||
				H.morphAttributes.color,
			Et = ht !== void 0 ? ht.length : 0
		let zt = 0
		H.morphAttributes.position !== void 0 && (zt = 1),
			H.morphAttributes.normal !== void 0 && (zt = 2),
			H.morphAttributes.color !== void 0 && (zt = 3)
		let ee, se, jt, q
		if (rt) {
			const Kt = _n[rt]
			;(ee = Kt.vertexShader), (se = Kt.fragmentShader)
		} else
			(ee = v.vertexShader),
				(se = v.fragmentShader),
				h.update(v),
				(jt = h.getVertexShaderID(v)),
				(q = h.getFragmentShaderID(v))
		const $ = i.getRenderTarget(),
			ft = i.state.buffers.depth.getReversed(),
			Pt = N.isInstancedMesh === !0,
			St = N.isBatchedMesh === !0,
			Gt = !!v.map,
			we = !!v.matcap,
			P = !!j,
			re = !!v.aoMap,
			It = !!v.lightMap,
			Rt = !!v.bumpMap,
			gt = !!v.normalMap,
			oe = !!v.displacementMap,
			_t = !!v.emissiveMap,
			Ft = !!v.metalnessMap,
			Se = !!v.roughnessMap,
			fe = v.anisotropy > 0,
			A = v.clearcoat > 0,
			x = v.dispersion > 0,
			B = v.iridescence > 0,
			Y = v.sheen > 0,
			Z = v.transmission > 0,
			X = fe && !!v.anisotropyMap,
			yt = A && !!v.clearcoatMap,
			it = A && !!v.clearcoatNormalMap,
			xt = A && !!v.clearcoatRoughnessMap,
			vt = B && !!v.iridescenceMap,
			tt = B && !!v.iridescenceThicknessMap,
			ct = Y && !!v.sheenColorMap,
			wt = Y && !!v.sheenRoughnessMap,
			Mt = !!v.specularMap,
			at = !!v.specularColorMap,
			Ut = !!v.specularIntensityMap,
			I = Z && !!v.transmissionMap,
			et = Z && !!v.thicknessMap,
			st = !!v.gradientMap,
			dt = !!v.alphaMap,
			J = v.alphaTest > 0,
			K = !!v.alphaHash,
			mt = !!v.extensions
		let Lt = Yn
		v.toneMapped &&
			($ === null || $.isXRRenderTarget === !0) &&
			(Lt = i.toneMapping)
		const ne = {
			shaderID: rt,
			shaderType: v.type,
			shaderName: v.name,
			vertexShader: ee,
			fragmentShader: se,
			defines: v.defines,
			customVertexShaderID: jt,
			customFragmentShaderID: q,
			isRawShaderMaterial: v.isRawShaderMaterial === !0,
			glslVersion: v.glslVersion,
			precision: m,
			batching: St,
			batchingColor: St && N._colorsTexture !== null,
			instancing: Pt,
			instancingColor: Pt && N.instanceColor !== null,
			instancingMorph: Pt && N.morphTexture !== null,
			supportsVertexTextures: f,
			outputColorSpace:
				$ === null
					? i.outputColorSpace
					: $.isXRRenderTarget === !0
					? $.texture.colorSpace
					: Gi,
			alphaToCoverage: !!v.alphaToCoverage,
			map: Gt,
			matcap: we,
			envMap: P,
			envMapMode: P && j.mapping,
			envMapCubeUVHeight: V,
			aoMap: re,
			lightMap: It,
			bumpMap: Rt,
			normalMap: gt,
			displacementMap: f && oe,
			emissiveMap: _t,
			normalMapObjectSpace: gt && v.normalMapType === Th,
			normalMapTangentSpace: gt && v.normalMapType === $l,
			metalnessMap: Ft,
			roughnessMap: Se,
			anisotropy: fe,
			anisotropyMap: X,
			clearcoat: A,
			clearcoatMap: yt,
			clearcoatNormalMap: it,
			clearcoatRoughnessMap: xt,
			dispersion: x,
			iridescence: B,
			iridescenceMap: vt,
			iridescenceThicknessMap: tt,
			sheen: Y,
			sheenColorMap: ct,
			sheenRoughnessMap: wt,
			specularMap: Mt,
			specularColorMap: at,
			specularIntensityMap: Ut,
			transmission: Z,
			transmissionMap: I,
			thicknessMap: et,
			gradientMap: st,
			opaque:
				v.transparent === !1 && v.blending === Oi && v.alphaToCoverage === !1,
			alphaMap: dt,
			alphaTest: J,
			alphaHash: K,
			combine: v.combine,
			mapUv: Gt && _(v.map.channel),
			aoMapUv: re && _(v.aoMap.channel),
			lightMapUv: It && _(v.lightMap.channel),
			bumpMapUv: Rt && _(v.bumpMap.channel),
			normalMapUv: gt && _(v.normalMap.channel),
			displacementMapUv: oe && _(v.displacementMap.channel),
			emissiveMapUv: _t && _(v.emissiveMap.channel),
			metalnessMapUv: Ft && _(v.metalnessMap.channel),
			roughnessMapUv: Se && _(v.roughnessMap.channel),
			anisotropyMapUv: X && _(v.anisotropyMap.channel),
			clearcoatMapUv: yt && _(v.clearcoatMap.channel),
			clearcoatNormalMapUv: it && _(v.clearcoatNormalMap.channel),
			clearcoatRoughnessMapUv: xt && _(v.clearcoatRoughnessMap.channel),
			iridescenceMapUv: vt && _(v.iridescenceMap.channel),
			iridescenceThicknessMapUv: tt && _(v.iridescenceThicknessMap.channel),
			sheenColorMapUv: ct && _(v.sheenColorMap.channel),
			sheenRoughnessMapUv: wt && _(v.sheenRoughnessMap.channel),
			specularMapUv: Mt && _(v.specularMap.channel),
			specularColorMapUv: at && _(v.specularColorMap.channel),
			specularIntensityMapUv: Ut && _(v.specularIntensityMap.channel),
			transmissionMapUv: I && _(v.transmissionMap.channel),
			thicknessMapUv: et && _(v.thicknessMap.channel),
			alphaMapUv: dt && _(v.alphaMap.channel),
			vertexTangents: !!H.attributes.tangent && (gt || fe),
			vertexColors: v.vertexColors,
			vertexAlphas:
				v.vertexColors === !0 &&
				!!H.attributes.color &&
				H.attributes.color.itemSize === 4,
			pointsUvs: N.isPoints === !0 && !!H.attributes.uv && (Gt || dt),
			fog: !!z,
			useFog: v.fog === !0,
			fogExp2: !!z && z.isFogExp2,
			flatShading: v.flatShading === !0 && v.wireframe === !1,
			sizeAttenuation: v.sizeAttenuation === !0,
			logarithmicDepthBuffer: c,
			reversedDepthBuffer: ft,
			skinning: N.isSkinnedMesh === !0,
			morphTargets: H.morphAttributes.position !== void 0,
			morphNormals: H.morphAttributes.normal !== void 0,
			morphColors: H.morphAttributes.color !== void 0,
			morphTargetsCount: Et,
			morphTextureStride: zt,
			numDirLights: y.directional.length,
			numPointLights: y.point.length,
			numSpotLights: y.spot.length,
			numSpotLightMaps: y.spotLightMap.length,
			numRectAreaLights: y.rectArea.length,
			numHemiLights: y.hemi.length,
			numDirLightShadows: y.directionalShadowMap.length,
			numPointLightShadows: y.pointShadowMap.length,
			numSpotLightShadows: y.spotShadowMap.length,
			numSpotLightShadowsWithMaps: y.numSpotLightShadowsWithMaps,
			numLightProbes: y.numLightProbes,
			numClippingPlanes: o.numPlanes,
			numClipIntersection: o.numIntersection,
			dithering: v.dithering,
			shadowMapEnabled: i.shadowMap.enabled && R.length > 0,
			shadowMapType: i.shadowMap.type,
			toneMapping: Lt,
			decodeVideoTexture:
				Gt &&
				v.map.isVideoTexture === !0 &&
				Xt.getTransfer(v.map.colorSpace) === Jt,
			decodeVideoTextureEmissive:
				_t &&
				v.emissiveMap.isVideoTexture === !0 &&
				Xt.getTransfer(v.emissiveMap.colorSpace) === Jt,
			premultipliedAlpha: v.premultipliedAlpha,
			doubleSided: v.side === De,
			flipSided: v.side === Ie,
			useDepthPacking: v.depthPacking >= 0,
			depthPacking: v.depthPacking || 0,
			index0AttributeName: v.index0AttributeName,
			extensionClipCullDistance:
				mt &&
				v.extensions.clipCullDistance === !0 &&
				n.has("WEBGL_clip_cull_distance"),
			extensionMultiDraw:
				((mt && v.extensions.multiDraw === !0) || St) &&
				n.has("WEBGL_multi_draw"),
			rendererExtensionParallelShaderCompile: n.has(
				"KHR_parallel_shader_compile"
			),
			customProgramCacheKey: v.customProgramCacheKey(),
		}
		return (
			(ne.vertexUv1s = l.has(1)),
			(ne.vertexUv2s = l.has(2)),
			(ne.vertexUv3s = l.has(3)),
			l.clear(),
			ne
		)
	}
	function u(v) {
		const y = []
		if (
			(v.shaderID
				? y.push(v.shaderID)
				: (y.push(v.customVertexShaderID), y.push(v.customFragmentShaderID)),
			v.defines !== void 0)
		)
			for (const R in v.defines) y.push(R), y.push(v.defines[R])
		return (
			v.isRawShaderMaterial === !1 &&
				(b(y, v), T(y, v), y.push(i.outputColorSpace)),
			y.push(v.customProgramCacheKey),
			y.join()
		)
	}
	function b(v, y) {
		v.push(y.precision),
			v.push(y.outputColorSpace),
			v.push(y.envMapMode),
			v.push(y.envMapCubeUVHeight),
			v.push(y.mapUv),
			v.push(y.alphaMapUv),
			v.push(y.lightMapUv),
			v.push(y.aoMapUv),
			v.push(y.bumpMapUv),
			v.push(y.normalMapUv),
			v.push(y.displacementMapUv),
			v.push(y.emissiveMapUv),
			v.push(y.metalnessMapUv),
			v.push(y.roughnessMapUv),
			v.push(y.anisotropyMapUv),
			v.push(y.clearcoatMapUv),
			v.push(y.clearcoatNormalMapUv),
			v.push(y.clearcoatRoughnessMapUv),
			v.push(y.iridescenceMapUv),
			v.push(y.iridescenceThicknessMapUv),
			v.push(y.sheenColorMapUv),
			v.push(y.sheenRoughnessMapUv),
			v.push(y.specularMapUv),
			v.push(y.specularColorMapUv),
			v.push(y.specularIntensityMapUv),
			v.push(y.transmissionMapUv),
			v.push(y.thicknessMapUv),
			v.push(y.combine),
			v.push(y.fogExp2),
			v.push(y.sizeAttenuation),
			v.push(y.morphTargetsCount),
			v.push(y.morphAttributeCount),
			v.push(y.numDirLights),
			v.push(y.numPointLights),
			v.push(y.numSpotLights),
			v.push(y.numSpotLightMaps),
			v.push(y.numHemiLights),
			v.push(y.numRectAreaLights),
			v.push(y.numDirLightShadows),
			v.push(y.numPointLightShadows),
			v.push(y.numSpotLightShadows),
			v.push(y.numSpotLightShadowsWithMaps),
			v.push(y.numLightProbes),
			v.push(y.shadowMapType),
			v.push(y.toneMapping),
			v.push(y.numClippingPlanes),
			v.push(y.numClipIntersection),
			v.push(y.depthPacking)
	}
	function T(v, y) {
		a.disableAll(),
			y.supportsVertexTextures && a.enable(0),
			y.instancing && a.enable(1),
			y.instancingColor && a.enable(2),
			y.instancingMorph && a.enable(3),
			y.matcap && a.enable(4),
			y.envMap && a.enable(5),
			y.normalMapObjectSpace && a.enable(6),
			y.normalMapTangentSpace && a.enable(7),
			y.clearcoat && a.enable(8),
			y.iridescence && a.enable(9),
			y.alphaTest && a.enable(10),
			y.vertexColors && a.enable(11),
			y.vertexAlphas && a.enable(12),
			y.vertexUv1s && a.enable(13),
			y.vertexUv2s && a.enable(14),
			y.vertexUv3s && a.enable(15),
			y.vertexTangents && a.enable(16),
			y.anisotropy && a.enable(17),
			y.alphaHash && a.enable(18),
			y.batching && a.enable(19),
			y.dispersion && a.enable(20),
			y.batchingColor && a.enable(21),
			y.gradientMap && a.enable(22),
			v.push(a.mask),
			a.disableAll(),
			y.fog && a.enable(0),
			y.useFog && a.enable(1),
			y.flatShading && a.enable(2),
			y.logarithmicDepthBuffer && a.enable(3),
			y.reversedDepthBuffer && a.enable(4),
			y.skinning && a.enable(5),
			y.morphTargets && a.enable(6),
			y.morphNormals && a.enable(7),
			y.morphColors && a.enable(8),
			y.premultipliedAlpha && a.enable(9),
			y.shadowMapEnabled && a.enable(10),
			y.doubleSided && a.enable(11),
			y.flipSided && a.enable(12),
			y.useDepthPacking && a.enable(13),
			y.dithering && a.enable(14),
			y.transmission && a.enable(15),
			y.sheen && a.enable(16),
			y.opaque && a.enable(17),
			y.pointsUvs && a.enable(18),
			y.decodeVideoTexture && a.enable(19),
			y.decodeVideoTextureEmissive && a.enable(20),
			y.alphaToCoverage && a.enable(21),
			v.push(a.mask)
	}
	function S(v) {
		const y = g[v.type]
		let R
		if (y) {
			const L = _n[y]
			R = eu.clone(L.uniforms)
		} else R = v.uniforms
		return R
	}
	function C(v, y) {
		let R
		for (let L = 0, N = d.length; L < N; L++) {
			const z = d[L]
			if (z.cacheKey === y) {
				;(R = z), ++R.usedTimes
				break
			}
		}
		return R === void 0 && ((R = new Rm(i, y, v, r)), d.push(R)), R
	}
	function w(v) {
		if (--v.usedTimes === 0) {
			const y = d.indexOf(v)
			;(d[y] = d[d.length - 1]), d.pop(), v.destroy()
		}
	}
	function E(v) {
		h.remove(v)
	}
	function D() {
		h.dispose()
	}
	return {
		getParameters: p,
		getProgramCacheKey: u,
		getUniforms: S,
		acquireProgram: C,
		releaseProgram: w,
		releaseShaderCache: E,
		programs: d,
		dispose: D,
	}
}
function Im() {
	let i = new WeakMap()
	function t(o) {
		return i.has(o)
	}
	function e(o) {
		let a = i.get(o)
		return a === void 0 && ((a = {}), i.set(o, a)), a
	}
	function n(o) {
		i.delete(o)
	}
	function s(o, a, h) {
		i.get(o)[a] = h
	}
	function r() {
		i = new WeakMap()
	}
	return { has: t, get: e, remove: n, update: s, dispose: r }
}
function Um(i, t) {
	return i.groupOrder !== t.groupOrder
		? i.groupOrder - t.groupOrder
		: i.renderOrder !== t.renderOrder
		? i.renderOrder - t.renderOrder
		: i.material.id !== t.material.id
		? i.material.id - t.material.id
		: i.z !== t.z
		? i.z - t.z
		: i.id - t.id
}
function bl(i, t) {
	return i.groupOrder !== t.groupOrder
		? i.groupOrder - t.groupOrder
		: i.renderOrder !== t.renderOrder
		? i.renderOrder - t.renderOrder
		: i.z !== t.z
		? t.z - i.z
		: i.id - t.id
}
function Tl() {
	const i = []
	let t = 0
	const e = [],
		n = [],
		s = []
	function r() {
		;(t = 0), (e.length = 0), (n.length = 0), (s.length = 0)
	}
	function o(c, f, m, g, _, p) {
		let u = i[t]
		return (
			u === void 0
				? ((u = {
						id: c.id,
						object: c,
						geometry: f,
						material: m,
						groupOrder: g,
						renderOrder: c.renderOrder,
						z: _,
						group: p,
				  }),
				  (i[t] = u))
				: ((u.id = c.id),
				  (u.object = c),
				  (u.geometry = f),
				  (u.material = m),
				  (u.groupOrder = g),
				  (u.renderOrder = c.renderOrder),
				  (u.z = _),
				  (u.group = p)),
			t++,
			u
		)
	}
	function a(c, f, m, g, _, p) {
		const u = o(c, f, m, g, _, p)
		m.transmission > 0
			? n.push(u)
			: m.transparent === !0
			? s.push(u)
			: e.push(u)
	}
	function h(c, f, m, g, _, p) {
		const u = o(c, f, m, g, _, p)
		m.transmission > 0
			? n.unshift(u)
			: m.transparent === !0
			? s.unshift(u)
			: e.unshift(u)
	}
	function l(c, f) {
		e.length > 1 && e.sort(c || Um),
			n.length > 1 && n.sort(f || bl),
			s.length > 1 && s.sort(f || bl)
	}
	function d() {
		for (let c = t, f = i.length; c < f; c++) {
			const m = i[c]
			if (m.id === null) break
			;(m.id = null),
				(m.object = null),
				(m.geometry = null),
				(m.material = null),
				(m.group = null)
		}
	}
	return {
		opaque: e,
		transmissive: n,
		transparent: s,
		init: r,
		push: a,
		unshift: h,
		finish: d,
		sort: l,
	}
}
function Nm() {
	let i = new WeakMap()
	function t(n, s) {
		const r = i.get(n)
		let o
		return (
			r === void 0
				? ((o = new Tl()), i.set(n, [o]))
				: s >= r.length
				? ((o = new Tl()), r.push(o))
				: (o = r[s]),
			o
		)
	}
	function e() {
		i = new WeakMap()
	}
	return { get: t, dispose: e }
}
function Fm() {
	const i = {}
	return {
		get: function (t) {
			if (i[t.id] !== void 0) return i[t.id]
			let e
			switch (t.type) {
				case "DirectionalLight":
					e = { direction: new U(), color: new Bt() }
					break
				case "SpotLight":
					e = {
						position: new U(),
						direction: new U(),
						color: new Bt(),
						distance: 0,
						coneCos: 0,
						penumbraCos: 0,
						decay: 0,
					}
					break
				case "PointLight":
					e = { position: new U(), color: new Bt(), distance: 0, decay: 0 }
					break
				case "HemisphereLight":
					e = { direction: new U(), skyColor: new Bt(), groundColor: new Bt() }
					break
				case "RectAreaLight":
					e = {
						color: new Bt(),
						position: new U(),
						halfWidth: new U(),
						halfHeight: new U(),
					}
					break
			}
			return (i[t.id] = e), e
		},
	}
}
function Om() {
	const i = {}
	return {
		get: function (t) {
			if (i[t.id] !== void 0) return i[t.id]
			let e
			switch (t.type) {
				case "DirectionalLight":
					e = {
						shadowIntensity: 1,
						shadowBias: 0,
						shadowNormalBias: 0,
						shadowRadius: 1,
						shadowMapSize: new Dt(),
					}
					break
				case "SpotLight":
					e = {
						shadowIntensity: 1,
						shadowBias: 0,
						shadowNormalBias: 0,
						shadowRadius: 1,
						shadowMapSize: new Dt(),
					}
					break
				case "PointLight":
					e = {
						shadowIntensity: 1,
						shadowBias: 0,
						shadowNormalBias: 0,
						shadowRadius: 1,
						shadowMapSize: new Dt(),
						shadowCameraNear: 1,
						shadowCameraFar: 1e3,
					}
					break
			}
			return (i[t.id] = e), e
		},
	}
}
let Bm = 0
function zm(i, t) {
	return (
		(t.castShadow ? 2 : 0) -
		(i.castShadow ? 2 : 0) +
		(t.map ? 1 : 0) -
		(i.map ? 1 : 0)
	)
}
function Hm(i) {
	const t = new Fm(),
		e = Om(),
		n = {
			version: 0,
			hash: {
				directionalLength: -1,
				pointLength: -1,
				spotLength: -1,
				rectAreaLength: -1,
				hemiLength: -1,
				numDirectionalShadows: -1,
				numPointShadows: -1,
				numSpotShadows: -1,
				numSpotMaps: -1,
				numLightProbes: -1,
			},
			ambient: [0, 0, 0],
			probe: [],
			directional: [],
			directionalShadow: [],
			directionalShadowMap: [],
			directionalShadowMatrix: [],
			spot: [],
			spotLightMap: [],
			spotShadow: [],
			spotShadowMap: [],
			spotLightMatrix: [],
			rectArea: [],
			rectAreaLTC1: null,
			rectAreaLTC2: null,
			point: [],
			pointShadow: [],
			pointShadowMap: [],
			pointShadowMatrix: [],
			hemi: [],
			numSpotLightShadowsWithMaps: 0,
			numLightProbes: 0,
		}
	for (let l = 0; l < 9; l++) n.probe.push(new U())
	const s = new U(),
		r = new le(),
		o = new le()
	function a(l) {
		let d = 0,
			c = 0,
			f = 0
		for (let v = 0; v < 9; v++) n.probe[v].set(0, 0, 0)
		let m = 0,
			g = 0,
			_ = 0,
			p = 0,
			u = 0,
			b = 0,
			T = 0,
			S = 0,
			C = 0,
			w = 0,
			E = 0
		l.sort(zm)
		for (let v = 0, y = l.length; v < y; v++) {
			const R = l[v],
				L = R.color,
				N = R.intensity,
				z = R.distance,
				H = R.shadow && R.shadow.map ? R.shadow.map.texture : null
			if (R.isAmbientLight) (d += L.r * N), (c += L.g * N), (f += L.b * N)
			else if (R.isLightProbe) {
				for (let W = 0; W < 9; W++)
					n.probe[W].addScaledVector(R.sh.coefficients[W], N)
				E++
			} else if (R.isDirectionalLight) {
				const W = t.get(R)
				if ((W.color.copy(R.color).multiplyScalar(R.intensity), R.castShadow)) {
					const j = R.shadow,
						V = e.get(R)
					;(V.shadowIntensity = j.intensity),
						(V.shadowBias = j.bias),
						(V.shadowNormalBias = j.normalBias),
						(V.shadowRadius = j.radius),
						(V.shadowMapSize = j.mapSize),
						(n.directionalShadow[m] = V),
						(n.directionalShadowMap[m] = H),
						(n.directionalShadowMatrix[m] = R.shadow.matrix),
						b++
				}
				;(n.directional[m] = W), m++
			} else if (R.isSpotLight) {
				const W = t.get(R)
				W.position.setFromMatrixPosition(R.matrixWorld),
					W.color.copy(L).multiplyScalar(N),
					(W.distance = z),
					(W.coneCos = Math.cos(R.angle)),
					(W.penumbraCos = Math.cos(R.angle * (1 - R.penumbra))),
					(W.decay = R.decay),
					(n.spot[_] = W)
				const j = R.shadow
				if (
					(R.map &&
						((n.spotLightMap[C] = R.map),
						C++,
						j.updateMatrices(R),
						R.castShadow && w++),
					(n.spotLightMatrix[_] = j.matrix),
					R.castShadow)
				) {
					const V = e.get(R)
					;(V.shadowIntensity = j.intensity),
						(V.shadowBias = j.bias),
						(V.shadowNormalBias = j.normalBias),
						(V.shadowRadius = j.radius),
						(V.shadowMapSize = j.mapSize),
						(n.spotShadow[_] = V),
						(n.spotShadowMap[_] = H),
						S++
				}
				_++
			} else if (R.isRectAreaLight) {
				const W = t.get(R)
				W.color.copy(L).multiplyScalar(N),
					W.halfWidth.set(R.width * 0.5, 0, 0),
					W.halfHeight.set(0, R.height * 0.5, 0),
					(n.rectArea[p] = W),
					p++
			} else if (R.isPointLight) {
				const W = t.get(R)
				if (
					(W.color.copy(R.color).multiplyScalar(R.intensity),
					(W.distance = R.distance),
					(W.decay = R.decay),
					R.castShadow)
				) {
					const j = R.shadow,
						V = e.get(R)
					;(V.shadowIntensity = j.intensity),
						(V.shadowBias = j.bias),
						(V.shadowNormalBias = j.normalBias),
						(V.shadowRadius = j.radius),
						(V.shadowMapSize = j.mapSize),
						(V.shadowCameraNear = j.camera.near),
						(V.shadowCameraFar = j.camera.far),
						(n.pointShadow[g] = V),
						(n.pointShadowMap[g] = H),
						(n.pointShadowMatrix[g] = R.shadow.matrix),
						T++
				}
				;(n.point[g] = W), g++
			} else if (R.isHemisphereLight) {
				const W = t.get(R)
				W.skyColor.copy(R.color).multiplyScalar(N),
					W.groundColor.copy(R.groundColor).multiplyScalar(N),
					(n.hemi[u] = W),
					u++
			}
		}
		p > 0 &&
			(i.has("OES_texture_float_linear") === !0
				? ((n.rectAreaLTC1 = ot.LTC_FLOAT_1), (n.rectAreaLTC2 = ot.LTC_FLOAT_2))
				: ((n.rectAreaLTC1 = ot.LTC_HALF_1), (n.rectAreaLTC2 = ot.LTC_HALF_2))),
			(n.ambient[0] = d),
			(n.ambient[1] = c),
			(n.ambient[2] = f)
		const D = n.hash
		;(D.directionalLength !== m ||
			D.pointLength !== g ||
			D.spotLength !== _ ||
			D.rectAreaLength !== p ||
			D.hemiLength !== u ||
			D.numDirectionalShadows !== b ||
			D.numPointShadows !== T ||
			D.numSpotShadows !== S ||
			D.numSpotMaps !== C ||
			D.numLightProbes !== E) &&
			((n.directional.length = m),
			(n.spot.length = _),
			(n.rectArea.length = p),
			(n.point.length = g),
			(n.hemi.length = u),
			(n.directionalShadow.length = b),
			(n.directionalShadowMap.length = b),
			(n.pointShadow.length = T),
			(n.pointShadowMap.length = T),
			(n.spotShadow.length = S),
			(n.spotShadowMap.length = S),
			(n.directionalShadowMatrix.length = b),
			(n.pointShadowMatrix.length = T),
			(n.spotLightMatrix.length = S + C - w),
			(n.spotLightMap.length = C),
			(n.numSpotLightShadowsWithMaps = w),
			(n.numLightProbes = E),
			(D.directionalLength = m),
			(D.pointLength = g),
			(D.spotLength = _),
			(D.rectAreaLength = p),
			(D.hemiLength = u),
			(D.numDirectionalShadows = b),
			(D.numPointShadows = T),
			(D.numSpotShadows = S),
			(D.numSpotMaps = C),
			(D.numLightProbes = E),
			(n.version = Bm++))
	}
	function h(l, d) {
		let c = 0,
			f = 0,
			m = 0,
			g = 0,
			_ = 0
		const p = d.matrixWorldInverse
		for (let u = 0, b = l.length; u < b; u++) {
			const T = l[u]
			if (T.isDirectionalLight) {
				const S = n.directional[c]
				S.direction.setFromMatrixPosition(T.matrixWorld),
					s.setFromMatrixPosition(T.target.matrixWorld),
					S.direction.sub(s),
					S.direction.transformDirection(p),
					c++
			} else if (T.isSpotLight) {
				const S = n.spot[m]
				S.position.setFromMatrixPosition(T.matrixWorld),
					S.position.applyMatrix4(p),
					S.direction.setFromMatrixPosition(T.matrixWorld),
					s.setFromMatrixPosition(T.target.matrixWorld),
					S.direction.sub(s),
					S.direction.transformDirection(p),
					m++
			} else if (T.isRectAreaLight) {
				const S = n.rectArea[g]
				S.position.setFromMatrixPosition(T.matrixWorld),
					S.position.applyMatrix4(p),
					o.identity(),
					r.copy(T.matrixWorld),
					r.premultiply(p),
					o.extractRotation(r),
					S.halfWidth.set(T.width * 0.5, 0, 0),
					S.halfHeight.set(0, T.height * 0.5, 0),
					S.halfWidth.applyMatrix4(o),
					S.halfHeight.applyMatrix4(o),
					g++
			} else if (T.isPointLight) {
				const S = n.point[f]
				S.position.setFromMatrixPosition(T.matrixWorld),
					S.position.applyMatrix4(p),
					f++
			} else if (T.isHemisphereLight) {
				const S = n.hemi[_]
				S.direction.setFromMatrixPosition(T.matrixWorld),
					S.direction.transformDirection(p),
					_++
			}
		}
	}
	return { setup: a, setupView: h, state: n }
}
function Al(i) {
	const t = new Hm(i),
		e = [],
		n = []
	function s(d) {
		;(l.camera = d), (e.length = 0), (n.length = 0)
	}
	function r(d) {
		e.push(d)
	}
	function o(d) {
		n.push(d)
	}
	function a() {
		t.setup(e)
	}
	function h(d) {
		t.setupView(e, d)
	}
	const l = {
		lightsArray: e,
		shadowsArray: n,
		camera: null,
		lights: t,
		transmissionRenderTarget: {},
	}
	return {
		init: s,
		state: l,
		setupLights: a,
		setupLightsView: h,
		pushLight: r,
		pushShadow: o,
	}
}
function km(i) {
	let t = new WeakMap()
	function e(s, r = 0) {
		const o = t.get(s)
		let a
		return (
			o === void 0
				? ((a = new Al(i)), t.set(s, [a]))
				: r >= o.length
				? ((a = new Al(i)), o.push(a))
				: (a = o[r]),
			a
		)
	}
	function n() {
		t = new WeakMap()
	}
	return { get: e, dispose: n }
}
const Gm = `void main() {
	gl_Position = vec4( position, 1.0 );
}`,
	Vm = `uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`
function Wm(i, t, e) {
	let n = new ra()
	const s = new Dt(),
		r = new Dt(),
		o = new de(),
		a = new du({ depthPacking: bh }),
		h = new fu(),
		l = {},
		d = e.maxTextureSize,
		c = { [Zn]: Ie, [Ie]: Zn, [De]: De },
		f = new $n({
			defines: { VSM_SAMPLES: 8 },
			uniforms: {
				shadow_pass: { value: null },
				resolution: { value: new Dt() },
				radius: { value: 4 },
			},
			vertexShader: Gm,
			fragmentShader: Vm,
		}),
		m = f.clone()
	m.defines.HORIZONTAL_PASS = 1
	const g = new Be()
	g.setAttribute(
		"position",
		new an(new Float32Array([-1, -1, 0.5, 3, -1, 0.5, -1, 3, 0.5]), 3)
	)
	const _ = new Zt(g, f),
		p = this
	;(this.enabled = !1),
		(this.autoUpdate = !0),
		(this.needsUpdate = !1),
		(this.type = Hl)
	let u = this.type
	this.render = function (w, E, D) {
		if (
			p.enabled === !1 ||
			(p.autoUpdate === !1 && p.needsUpdate === !1) ||
			w.length === 0
		)
			return
		const v = i.getRenderTarget(),
			y = i.getActiveCubeFace(),
			R = i.getActiveMipmapLevel(),
			L = i.state
		L.setBlending(Xn),
			L.buffers.depth.getReversed() === !0
				? L.buffers.color.setClear(0, 0, 0, 0)
				: L.buffers.color.setClear(1, 1, 1, 1),
			L.buffers.depth.setTest(!0),
			L.setScissorTest(!1)
		const N = u !== Cn && this.type === Cn,
			z = u === Cn && this.type !== Cn
		for (let H = 0, W = w.length; H < W; H++) {
			const j = w[H],
				V = j.shadow
			if (V === void 0) {
				console.warn("THREE.WebGLShadowMap:", j, "has no shadow.")
				continue
			}
			if (V.autoUpdate === !1 && V.needsUpdate === !1) continue
			s.copy(V.mapSize)
			const rt = V.getFrameExtents()
			if (
				(s.multiply(rt),
				r.copy(V.mapSize),
				(s.x > d || s.y > d) &&
					(s.x > d &&
						((r.x = Math.floor(d / rt.x)),
						(s.x = r.x * rt.x),
						(V.mapSize.x = r.x)),
					s.y > d &&
						((r.y = Math.floor(d / rt.y)),
						(s.y = r.y * rt.y),
						(V.mapSize.y = r.y))),
				V.map === null || N === !0 || z === !0)
			) {
				const Et = this.type !== Cn ? { minFilter: dn, magFilter: dn } : {}
				V.map !== null && V.map.dispose(),
					(V.map = new di(s.x, s.y, Et)),
					(V.map.texture.name = j.name + ".shadowMap"),
					V.camera.updateProjectionMatrix()
			}
			i.setRenderTarget(V.map), i.clear()
			const ht = V.getViewportCount()
			for (let Et = 0; Et < ht; Et++) {
				const zt = V.getViewport(Et)
				o.set(r.x * zt.x, r.y * zt.y, r.x * zt.z, r.y * zt.w),
					L.viewport(o),
					V.updateMatrices(j, Et),
					(n = V.getFrustum()),
					S(E, D, V.camera, j, this.type)
			}
			V.isPointLightShadow !== !0 && this.type === Cn && b(V, D),
				(V.needsUpdate = !1)
		}
		;(u = this.type), (p.needsUpdate = !1), i.setRenderTarget(v, y, R)
	}
	function b(w, E) {
		const D = t.update(_)
		f.defines.VSM_SAMPLES !== w.blurSamples &&
			((f.defines.VSM_SAMPLES = w.blurSamples),
			(m.defines.VSM_SAMPLES = w.blurSamples),
			(f.needsUpdate = !0),
			(m.needsUpdate = !0)),
			w.mapPass === null && (w.mapPass = new di(s.x, s.y)),
			(f.uniforms.shadow_pass.value = w.map.texture),
			(f.uniforms.resolution.value = w.mapSize),
			(f.uniforms.radius.value = w.radius),
			i.setRenderTarget(w.mapPass),
			i.clear(),
			i.renderBufferDirect(E, null, D, f, _, null),
			(m.uniforms.shadow_pass.value = w.mapPass.texture),
			(m.uniforms.resolution.value = w.mapSize),
			(m.uniforms.radius.value = w.radius),
			i.setRenderTarget(w.map),
			i.clear(),
			i.renderBufferDirect(E, null, D, m, _, null)
	}
	function T(w, E, D, v) {
		let y = null
		const R =
			D.isPointLight === !0 ? w.customDistanceMaterial : w.customDepthMaterial
		if (R !== void 0) y = R
		else if (
			((y = D.isPointLight === !0 ? h : a),
			(i.localClippingEnabled &&
				E.clipShadows === !0 &&
				Array.isArray(E.clippingPlanes) &&
				E.clippingPlanes.length !== 0) ||
				(E.displacementMap && E.displacementScale !== 0) ||
				(E.alphaMap && E.alphaTest > 0) ||
				(E.map && E.alphaTest > 0) ||
				E.alphaToCoverage === !0)
		) {
			const L = y.uuid,
				N = E.uuid
			let z = l[L]
			z === void 0 && ((z = {}), (l[L] = z))
			let H = z[N]
			H === void 0 &&
				((H = y.clone()), (z[N] = H), E.addEventListener("dispose", C)),
				(y = H)
		}
		if (
			((y.visible = E.visible),
			(y.wireframe = E.wireframe),
			v === Cn
				? (y.side = E.shadowSide !== null ? E.shadowSide : E.side)
				: (y.side = E.shadowSide !== null ? E.shadowSide : c[E.side]),
			(y.alphaMap = E.alphaMap),
			(y.alphaTest = E.alphaToCoverage === !0 ? 0.5 : E.alphaTest),
			(y.map = E.map),
			(y.clipShadows = E.clipShadows),
			(y.clippingPlanes = E.clippingPlanes),
			(y.clipIntersection = E.clipIntersection),
			(y.displacementMap = E.displacementMap),
			(y.displacementScale = E.displacementScale),
			(y.displacementBias = E.displacementBias),
			(y.wireframeLinewidth = E.wireframeLinewidth),
			(y.linewidth = E.linewidth),
			D.isPointLight === !0 && y.isMeshDistanceMaterial === !0)
		) {
			const L = i.properties.get(y)
			L.light = D
		}
		return y
	}
	function S(w, E, D, v, y) {
		if (w.visible === !1) return
		if (
			w.layers.test(E.layers) &&
			(w.isMesh || w.isLine || w.isPoints) &&
			(w.castShadow || (w.receiveShadow && y === Cn)) &&
			(!w.frustumCulled || n.intersectsObject(w))
		) {
			w.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse, w.matrixWorld)
			const N = t.update(w),
				z = w.material
			if (Array.isArray(z)) {
				const H = N.groups
				for (let W = 0, j = H.length; W < j; W++) {
					const V = H[W],
						rt = z[V.materialIndex]
					if (rt && rt.visible) {
						const ht = T(w, rt, v, y)
						w.onBeforeShadow(i, w, E, D, N, ht, V),
							i.renderBufferDirect(D, null, N, ht, w, V),
							w.onAfterShadow(i, w, E, D, N, ht, V)
					}
				}
			} else if (z.visible) {
				const H = T(w, z, v, y)
				w.onBeforeShadow(i, w, E, D, N, H, null),
					i.renderBufferDirect(D, null, N, H, w, null),
					w.onAfterShadow(i, w, E, D, N, H, null)
			}
		}
		const L = w.children
		for (let N = 0, z = L.length; N < z; N++) S(L[N], E, D, v, y)
	}
	function C(w) {
		w.target.removeEventListener("dispose", C)
		for (const D in l) {
			const v = l[D],
				y = w.target.uuid
			y in v && (v[y].dispose(), delete v[y])
		}
	}
}
const Xm = {
	[ao]: lo,
	[co]: fo,
	[ho]: po,
	[zi]: uo,
	[lo]: ao,
	[fo]: co,
	[po]: ho,
	[uo]: zi,
}
function Ym(i, t) {
	function e() {
		let I = !1
		const et = new de()
		let st = null
		const dt = new de(0, 0, 0, 0)
		return {
			setMask: function (J) {
				st !== J && !I && (i.colorMask(J, J, J, J), (st = J))
			},
			setLocked: function (J) {
				I = J
			},
			setClear: function (J, K, mt, Lt, ne) {
				ne === !0 && ((J *= Lt), (K *= Lt), (mt *= Lt)),
					et.set(J, K, mt, Lt),
					dt.equals(et) === !1 && (i.clearColor(J, K, mt, Lt), dt.copy(et))
			},
			reset: function () {
				;(I = !1), (st = null), dt.set(-1, 0, 0, 0)
			},
		}
	}
	function n() {
		let I = !1,
			et = !1,
			st = null,
			dt = null,
			J = null
		return {
			setReversed: function (K) {
				if (et !== K) {
					const mt = t.get("EXT_clip_control")
					K
						? mt.clipControlEXT(mt.LOWER_LEFT_EXT, mt.ZERO_TO_ONE_EXT)
						: mt.clipControlEXT(mt.LOWER_LEFT_EXT, mt.NEGATIVE_ONE_TO_ONE_EXT),
						(et = K)
					const Lt = J
					;(J = null), this.setClear(Lt)
				}
			},
			getReversed: function () {
				return et
			},
			setTest: function (K) {
				K ? $(i.DEPTH_TEST) : ft(i.DEPTH_TEST)
			},
			setMask: function (K) {
				st !== K && !I && (i.depthMask(K), (st = K))
			},
			setFunc: function (K) {
				if ((et && (K = Xm[K]), dt !== K)) {
					switch (K) {
						case ao:
							i.depthFunc(i.NEVER)
							break
						case lo:
							i.depthFunc(i.ALWAYS)
							break
						case co:
							i.depthFunc(i.LESS)
							break
						case zi:
							i.depthFunc(i.LEQUAL)
							break
						case ho:
							i.depthFunc(i.EQUAL)
							break
						case uo:
							i.depthFunc(i.GEQUAL)
							break
						case fo:
							i.depthFunc(i.GREATER)
							break
						case po:
							i.depthFunc(i.NOTEQUAL)
							break
						default:
							i.depthFunc(i.LEQUAL)
					}
					dt = K
				}
			},
			setLocked: function (K) {
				I = K
			},
			setClear: function (K) {
				J !== K && (et && (K = 1 - K), i.clearDepth(K), (J = K))
			},
			reset: function () {
				;(I = !1), (st = null), (dt = null), (J = null), (et = !1)
			},
		}
	}
	function s() {
		let I = !1,
			et = null,
			st = null,
			dt = null,
			J = null,
			K = null,
			mt = null,
			Lt = null,
			ne = null
		return {
			setTest: function (Kt) {
				I || (Kt ? $(i.STENCIL_TEST) : ft(i.STENCIL_TEST))
			},
			setMask: function (Kt) {
				et !== Kt && !I && (i.stencilMask(Kt), (et = Kt))
			},
			setFunc: function (Kt, En, pn) {
				;(st !== Kt || dt !== En || J !== pn) &&
					(i.stencilFunc(Kt, En, pn), (st = Kt), (dt = En), (J = pn))
			},
			setOp: function (Kt, En, pn) {
				;(K !== Kt || mt !== En || Lt !== pn) &&
					(i.stencilOp(Kt, En, pn), (K = Kt), (mt = En), (Lt = pn))
			},
			setLocked: function (Kt) {
				I = Kt
			},
			setClear: function (Kt) {
				ne !== Kt && (i.clearStencil(Kt), (ne = Kt))
			},
			reset: function () {
				;(I = !1),
					(et = null),
					(st = null),
					(dt = null),
					(J = null),
					(K = null),
					(mt = null),
					(Lt = null),
					(ne = null)
			},
		}
	}
	const r = new e(),
		o = new n(),
		a = new s(),
		h = new WeakMap(),
		l = new WeakMap()
	let d = {},
		c = {},
		f = new WeakMap(),
		m = [],
		g = null,
		_ = !1,
		p = null,
		u = null,
		b = null,
		T = null,
		S = null,
		C = null,
		w = null,
		E = new Bt(0, 0, 0),
		D = 0,
		v = !1,
		y = null,
		R = null,
		L = null,
		N = null,
		z = null
	const H = i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS)
	let W = !1,
		j = 0
	const V = i.getParameter(i.VERSION)
	V.indexOf("WebGL") !== -1
		? ((j = parseFloat(/^WebGL (\d)/.exec(V)[1])), (W = j >= 1))
		: V.indexOf("OpenGL ES") !== -1 &&
		  ((j = parseFloat(/^OpenGL ES (\d)/.exec(V)[1])), (W = j >= 2))
	let rt = null,
		ht = {}
	const Et = i.getParameter(i.SCISSOR_BOX),
		zt = i.getParameter(i.VIEWPORT),
		ee = new de().fromArray(Et),
		se = new de().fromArray(zt)
	function jt(I, et, st, dt) {
		const J = new Uint8Array(4),
			K = i.createTexture()
		i.bindTexture(I, K),
			i.texParameteri(I, i.TEXTURE_MIN_FILTER, i.NEAREST),
			i.texParameteri(I, i.TEXTURE_MAG_FILTER, i.NEAREST)
		for (let mt = 0; mt < st; mt++)
			I === i.TEXTURE_3D || I === i.TEXTURE_2D_ARRAY
				? i.texImage3D(et, 0, i.RGBA, 1, 1, dt, 0, i.RGBA, i.UNSIGNED_BYTE, J)
				: i.texImage2D(et + mt, 0, i.RGBA, 1, 1, 0, i.RGBA, i.UNSIGNED_BYTE, J)
		return K
	}
	const q = {}
	;(q[i.TEXTURE_2D] = jt(i.TEXTURE_2D, i.TEXTURE_2D, 1)),
		(q[i.TEXTURE_CUBE_MAP] = jt(
			i.TEXTURE_CUBE_MAP,
			i.TEXTURE_CUBE_MAP_POSITIVE_X,
			6
		)),
		(q[i.TEXTURE_2D_ARRAY] = jt(i.TEXTURE_2D_ARRAY, i.TEXTURE_2D_ARRAY, 1, 1)),
		(q[i.TEXTURE_3D] = jt(i.TEXTURE_3D, i.TEXTURE_3D, 1, 1)),
		r.setClear(0, 0, 0, 1),
		o.setClear(1),
		a.setClear(0),
		$(i.DEPTH_TEST),
		o.setFunc(zi),
		Rt(!1),
		gt(ya),
		$(i.CULL_FACE),
		re(Xn)
	function $(I) {
		d[I] !== !0 && (i.enable(I), (d[I] = !0))
	}
	function ft(I) {
		d[I] !== !1 && (i.disable(I), (d[I] = !1))
	}
	function Pt(I, et) {
		return c[I] !== et
			? (i.bindFramebuffer(I, et),
			  (c[I] = et),
			  I === i.DRAW_FRAMEBUFFER && (c[i.FRAMEBUFFER] = et),
			  I === i.FRAMEBUFFER && (c[i.DRAW_FRAMEBUFFER] = et),
			  !0)
			: !1
	}
	function St(I, et) {
		let st = m,
			dt = !1
		if (I) {
			;(st = f.get(et)), st === void 0 && ((st = []), f.set(et, st))
			const J = I.textures
			if (st.length !== J.length || st[0] !== i.COLOR_ATTACHMENT0) {
				for (let K = 0, mt = J.length; K < mt; K++)
					st[K] = i.COLOR_ATTACHMENT0 + K
				;(st.length = J.length), (dt = !0)
			}
		} else st[0] !== i.BACK && ((st[0] = i.BACK), (dt = !0))
		dt && i.drawBuffers(st)
	}
	function Gt(I) {
		return g !== I ? (i.useProgram(I), (g = I), !0) : !1
	}
	const we = {
		[ai]: i.FUNC_ADD,
		[Zc]: i.FUNC_SUBTRACT,
		[$c]: i.FUNC_REVERSE_SUBTRACT,
	}
	;(we[Jc] = i.MIN), (we[Qc] = i.MAX)
	const P = {
		[th]: i.ZERO,
		[eh]: i.ONE,
		[nh]: i.SRC_COLOR,
		[ro]: i.SRC_ALPHA,
		[lh]: i.SRC_ALPHA_SATURATE,
		[oh]: i.DST_COLOR,
		[sh]: i.DST_ALPHA,
		[ih]: i.ONE_MINUS_SRC_COLOR,
		[oo]: i.ONE_MINUS_SRC_ALPHA,
		[ah]: i.ONE_MINUS_DST_COLOR,
		[rh]: i.ONE_MINUS_DST_ALPHA,
		[ch]: i.CONSTANT_COLOR,
		[hh]: i.ONE_MINUS_CONSTANT_COLOR,
		[uh]: i.CONSTANT_ALPHA,
		[dh]: i.ONE_MINUS_CONSTANT_ALPHA,
	}
	function re(I, et, st, dt, J, K, mt, Lt, ne, Kt) {
		if (I === Xn) {
			_ === !0 && (ft(i.BLEND), (_ = !1))
			return
		}
		if ((_ === !1 && ($(i.BLEND), (_ = !0)), I !== Kc)) {
			if (I !== p || Kt !== v) {
				if (
					((u !== ai || S !== ai) &&
						(i.blendEquation(i.FUNC_ADD), (u = ai), (S = ai)),
					Kt)
				)
					switch (I) {
						case Oi:
							i.blendFuncSeparate(
								i.ONE,
								i.ONE_MINUS_SRC_ALPHA,
								i.ONE,
								i.ONE_MINUS_SRC_ALPHA
							)
							break
						case Sa:
							i.blendFunc(i.ONE, i.ONE)
							break
						case Ea:
							i.blendFuncSeparate(i.ZERO, i.ONE_MINUS_SRC_COLOR, i.ZERO, i.ONE)
							break
						case ba:
							i.blendFuncSeparate(
								i.DST_COLOR,
								i.ONE_MINUS_SRC_ALPHA,
								i.ZERO,
								i.ONE
							)
							break
						default:
							console.error("THREE.WebGLState: Invalid blending: ", I)
							break
					}
				else
					switch (I) {
						case Oi:
							i.blendFuncSeparate(
								i.SRC_ALPHA,
								i.ONE_MINUS_SRC_ALPHA,
								i.ONE,
								i.ONE_MINUS_SRC_ALPHA
							)
							break
						case Sa:
							i.blendFuncSeparate(i.SRC_ALPHA, i.ONE, i.ONE, i.ONE)
							break
						case Ea:
							console.error(
								"THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true"
							)
							break
						case ba:
							console.error(
								"THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true"
							)
							break
						default:
							console.error("THREE.WebGLState: Invalid blending: ", I)
							break
					}
				;(b = null),
					(T = null),
					(C = null),
					(w = null),
					E.set(0, 0, 0),
					(D = 0),
					(p = I),
					(v = Kt)
			}
			return
		}
		;(J = J || et),
			(K = K || st),
			(mt = mt || dt),
			(et !== u || J !== S) &&
				(i.blendEquationSeparate(we[et], we[J]), (u = et), (S = J)),
			(st !== b || dt !== T || K !== C || mt !== w) &&
				(i.blendFuncSeparate(P[st], P[dt], P[K], P[mt]),
				(b = st),
				(T = dt),
				(C = K),
				(w = mt)),
			(Lt.equals(E) === !1 || ne !== D) &&
				(i.blendColor(Lt.r, Lt.g, Lt.b, ne), E.copy(Lt), (D = ne)),
			(p = I),
			(v = !1)
	}
	function It(I, et) {
		I.side === De ? ft(i.CULL_FACE) : $(i.CULL_FACE)
		let st = I.side === Ie
		et && (st = !st),
			Rt(st),
			I.blending === Oi && I.transparent === !1
				? re(Xn)
				: re(
						I.blending,
						I.blendEquation,
						I.blendSrc,
						I.blendDst,
						I.blendEquationAlpha,
						I.blendSrcAlpha,
						I.blendDstAlpha,
						I.blendColor,
						I.blendAlpha,
						I.premultipliedAlpha
				  ),
			o.setFunc(I.depthFunc),
			o.setTest(I.depthTest),
			o.setMask(I.depthWrite),
			r.setMask(I.colorWrite)
		const dt = I.stencilWrite
		a.setTest(dt),
			dt &&
				(a.setMask(I.stencilWriteMask),
				a.setFunc(I.stencilFunc, I.stencilRef, I.stencilFuncMask),
				a.setOp(I.stencilFail, I.stencilZFail, I.stencilZPass)),
			_t(I.polygonOffset, I.polygonOffsetFactor, I.polygonOffsetUnits),
			I.alphaToCoverage === !0
				? $(i.SAMPLE_ALPHA_TO_COVERAGE)
				: ft(i.SAMPLE_ALPHA_TO_COVERAGE)
	}
	function Rt(I) {
		y !== I && (I ? i.frontFace(i.CW) : i.frontFace(i.CCW), (y = I))
	}
	function gt(I) {
		I !== Yc
			? ($(i.CULL_FACE),
			  I !== R &&
					(I === ya
						? i.cullFace(i.BACK)
						: I === qc
						? i.cullFace(i.FRONT)
						: i.cullFace(i.FRONT_AND_BACK)))
			: ft(i.CULL_FACE),
			(R = I)
	}
	function oe(I) {
		I !== L && (W && i.lineWidth(I), (L = I))
	}
	function _t(I, et, st) {
		I
			? ($(i.POLYGON_OFFSET_FILL),
			  (N !== et || z !== st) && (i.polygonOffset(et, st), (N = et), (z = st)))
			: ft(i.POLYGON_OFFSET_FILL)
	}
	function Ft(I) {
		I ? $(i.SCISSOR_TEST) : ft(i.SCISSOR_TEST)
	}
	function Se(I) {
		I === void 0 && (I = i.TEXTURE0 + H - 1),
			rt !== I && (i.activeTexture(I), (rt = I))
	}
	function fe(I, et, st) {
		st === void 0 && (rt === null ? (st = i.TEXTURE0 + H - 1) : (st = rt))
		let dt = ht[st]
		dt === void 0 && ((dt = { type: void 0, texture: void 0 }), (ht[st] = dt)),
			(dt.type !== I || dt.texture !== et) &&
				(rt !== st && (i.activeTexture(st), (rt = st)),
				i.bindTexture(I, et || q[I]),
				(dt.type = I),
				(dt.texture = et))
	}
	function A() {
		const I = ht[rt]
		I !== void 0 &&
			I.type !== void 0 &&
			(i.bindTexture(I.type, null), (I.type = void 0), (I.texture = void 0))
	}
	function x() {
		try {
			i.compressedTexImage2D(...arguments)
		} catch (I) {
			console.error("THREE.WebGLState:", I)
		}
	}
	function B() {
		try {
			i.compressedTexImage3D(...arguments)
		} catch (I) {
			console.error("THREE.WebGLState:", I)
		}
	}
	function Y() {
		try {
			i.texSubImage2D(...arguments)
		} catch (I) {
			console.error("THREE.WebGLState:", I)
		}
	}
	function Z() {
		try {
			i.texSubImage3D(...arguments)
		} catch (I) {
			console.error("THREE.WebGLState:", I)
		}
	}
	function X() {
		try {
			i.compressedTexSubImage2D(...arguments)
		} catch (I) {
			console.error("THREE.WebGLState:", I)
		}
	}
	function yt() {
		try {
			i.compressedTexSubImage3D(...arguments)
		} catch (I) {
			console.error("THREE.WebGLState:", I)
		}
	}
	function it() {
		try {
			i.texStorage2D(...arguments)
		} catch (I) {
			console.error("THREE.WebGLState:", I)
		}
	}
	function xt() {
		try {
			i.texStorage3D(...arguments)
		} catch (I) {
			console.error("THREE.WebGLState:", I)
		}
	}
	function vt() {
		try {
			i.texImage2D(...arguments)
		} catch (I) {
			console.error("THREE.WebGLState:", I)
		}
	}
	function tt() {
		try {
			i.texImage3D(...arguments)
		} catch (I) {
			console.error("THREE.WebGLState:", I)
		}
	}
	function ct(I) {
		ee.equals(I) === !1 && (i.scissor(I.x, I.y, I.z, I.w), ee.copy(I))
	}
	function wt(I) {
		se.equals(I) === !1 && (i.viewport(I.x, I.y, I.z, I.w), se.copy(I))
	}
	function Mt(I, et) {
		let st = l.get(et)
		st === void 0 && ((st = new WeakMap()), l.set(et, st))
		let dt = st.get(I)
		dt === void 0 && ((dt = i.getUniformBlockIndex(et, I.name)), st.set(I, dt))
	}
	function at(I, et) {
		const dt = l.get(et).get(I)
		h.get(et) !== dt &&
			(i.uniformBlockBinding(et, dt, I.__bindingPointIndex), h.set(et, dt))
	}
	function Ut() {
		i.disable(i.BLEND),
			i.disable(i.CULL_FACE),
			i.disable(i.DEPTH_TEST),
			i.disable(i.POLYGON_OFFSET_FILL),
			i.disable(i.SCISSOR_TEST),
			i.disable(i.STENCIL_TEST),
			i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),
			i.blendEquation(i.FUNC_ADD),
			i.blendFunc(i.ONE, i.ZERO),
			i.blendFuncSeparate(i.ONE, i.ZERO, i.ONE, i.ZERO),
			i.blendColor(0, 0, 0, 0),
			i.colorMask(!0, !0, !0, !0),
			i.clearColor(0, 0, 0, 0),
			i.depthMask(!0),
			i.depthFunc(i.LESS),
			o.setReversed(!1),
			i.clearDepth(1),
			i.stencilMask(4294967295),
			i.stencilFunc(i.ALWAYS, 0, 4294967295),
			i.stencilOp(i.KEEP, i.KEEP, i.KEEP),
			i.clearStencil(0),
			i.cullFace(i.BACK),
			i.frontFace(i.CCW),
			i.polygonOffset(0, 0),
			i.activeTexture(i.TEXTURE0),
			i.bindFramebuffer(i.FRAMEBUFFER, null),
			i.bindFramebuffer(i.DRAW_FRAMEBUFFER, null),
			i.bindFramebuffer(i.READ_FRAMEBUFFER, null),
			i.useProgram(null),
			i.lineWidth(1),
			i.scissor(0, 0, i.canvas.width, i.canvas.height),
			i.viewport(0, 0, i.canvas.width, i.canvas.height),
			(d = {}),
			(rt = null),
			(ht = {}),
			(c = {}),
			(f = new WeakMap()),
			(m = []),
			(g = null),
			(_ = !1),
			(p = null),
			(u = null),
			(b = null),
			(T = null),
			(S = null),
			(C = null),
			(w = null),
			(E = new Bt(0, 0, 0)),
			(D = 0),
			(v = !1),
			(y = null),
			(R = null),
			(L = null),
			(N = null),
			(z = null),
			ee.set(0, 0, i.canvas.width, i.canvas.height),
			se.set(0, 0, i.canvas.width, i.canvas.height),
			r.reset(),
			o.reset(),
			a.reset()
	}
	return {
		buffers: { color: r, depth: o, stencil: a },
		enable: $,
		disable: ft,
		bindFramebuffer: Pt,
		drawBuffers: St,
		useProgram: Gt,
		setBlending: re,
		setMaterial: It,
		setFlipSided: Rt,
		setCullFace: gt,
		setLineWidth: oe,
		setPolygonOffset: _t,
		setScissorTest: Ft,
		activeTexture: Se,
		bindTexture: fe,
		unbindTexture: A,
		compressedTexImage2D: x,
		compressedTexImage3D: B,
		texImage2D: vt,
		texImage3D: tt,
		updateUBOMapping: Mt,
		uniformBlockBinding: at,
		texStorage2D: it,
		texStorage3D: xt,
		texSubImage2D: Y,
		texSubImage3D: Z,
		compressedTexSubImage2D: X,
		compressedTexSubImage3D: yt,
		scissor: ct,
		viewport: wt,
		reset: Ut,
	}
}
function qm(i, t, e, n, s, r, o) {
	const a = t.has("WEBGL_multisampled_render_to_texture")
			? t.get("WEBGL_multisampled_render_to_texture")
			: null,
		h =
			typeof navigator > "u" ? !1 : /OculusBrowser/g.test(navigator.userAgent),
		l = new Dt(),
		d = new WeakMap()
	let c
	const f = new WeakMap()
	let m = !1
	try {
		m =
			typeof OffscreenCanvas < "u" &&
			new OffscreenCanvas(1, 1).getContext("2d") !== null
	} catch {}
	function g(A, x) {
		return m ? new OffscreenCanvas(A, x) : hr("canvas")
	}
	function _(A, x, B) {
		let Y = 1
		const Z = fe(A)
		if (
			((Z.width > B || Z.height > B) && (Y = B / Math.max(Z.width, Z.height)),
			Y < 1)
		)
			if (
				(typeof HTMLImageElement < "u" && A instanceof HTMLImageElement) ||
				(typeof HTMLCanvasElement < "u" && A instanceof HTMLCanvasElement) ||
				(typeof ImageBitmap < "u" && A instanceof ImageBitmap) ||
				(typeof VideoFrame < "u" && A instanceof VideoFrame)
			) {
				const X = Math.floor(Y * Z.width),
					yt = Math.floor(Y * Z.height)
				c === void 0 && (c = g(X, yt))
				const it = x ? g(X, yt) : c
				return (
					(it.width = X),
					(it.height = yt),
					it.getContext("2d").drawImage(A, 0, 0, X, yt),
					console.warn(
						"THREE.WebGLRenderer: Texture has been resized from (" +
							Z.width +
							"x" +
							Z.height +
							") to (" +
							X +
							"x" +
							yt +
							")."
					),
					it
				)
			} else
				return (
					"data" in A &&
						console.warn(
							"THREE.WebGLRenderer: Image in DataTexture is too big (" +
								Z.width +
								"x" +
								Z.height +
								")."
						),
					A
				)
		return A
	}
	function p(A) {
		return A.generateMipmaps
	}
	function u(A) {
		i.generateMipmap(A)
	}
	function b(A) {
		return A.isWebGLCubeRenderTarget
			? i.TEXTURE_CUBE_MAP
			: A.isWebGL3DRenderTarget
			? i.TEXTURE_3D
			: A.isWebGLArrayRenderTarget || A.isCompressedArrayTexture
			? i.TEXTURE_2D_ARRAY
			: i.TEXTURE_2D
	}
	function T(A, x, B, Y, Z = !1) {
		if (A !== null) {
			if (i[A] !== void 0) return i[A]
			console.warn(
				"THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '" +
					A +
					"'"
			)
		}
		let X = x
		if (
			(x === i.RED &&
				(B === i.FLOAT && (X = i.R32F),
				B === i.HALF_FLOAT && (X = i.R16F),
				B === i.UNSIGNED_BYTE && (X = i.R8)),
			x === i.RED_INTEGER &&
				(B === i.UNSIGNED_BYTE && (X = i.R8UI),
				B === i.UNSIGNED_SHORT && (X = i.R16UI),
				B === i.UNSIGNED_INT && (X = i.R32UI),
				B === i.BYTE && (X = i.R8I),
				B === i.SHORT && (X = i.R16I),
				B === i.INT && (X = i.R32I)),
			x === i.RG &&
				(B === i.FLOAT && (X = i.RG32F),
				B === i.HALF_FLOAT && (X = i.RG16F),
				B === i.UNSIGNED_BYTE && (X = i.RG8)),
			x === i.RG_INTEGER &&
				(B === i.UNSIGNED_BYTE && (X = i.RG8UI),
				B === i.UNSIGNED_SHORT && (X = i.RG16UI),
				B === i.UNSIGNED_INT && (X = i.RG32UI),
				B === i.BYTE && (X = i.RG8I),
				B === i.SHORT && (X = i.RG16I),
				B === i.INT && (X = i.RG32I)),
			x === i.RGB_INTEGER &&
				(B === i.UNSIGNED_BYTE && (X = i.RGB8UI),
				B === i.UNSIGNED_SHORT && (X = i.RGB16UI),
				B === i.UNSIGNED_INT && (X = i.RGB32UI),
				B === i.BYTE && (X = i.RGB8I),
				B === i.SHORT && (X = i.RGB16I),
				B === i.INT && (X = i.RGB32I)),
			x === i.RGBA_INTEGER &&
				(B === i.UNSIGNED_BYTE && (X = i.RGBA8UI),
				B === i.UNSIGNED_SHORT && (X = i.RGBA16UI),
				B === i.UNSIGNED_INT && (X = i.RGBA32UI),
				B === i.BYTE && (X = i.RGBA8I),
				B === i.SHORT && (X = i.RGBA16I),
				B === i.INT && (X = i.RGBA32I)),
			x === i.RGB &&
				(B === i.UNSIGNED_INT_5_9_9_9_REV && (X = i.RGB9_E5),
				B === i.UNSIGNED_INT_10F_11F_11F_REV && (X = i.R11F_G11F_B10F)),
			x === i.RGBA)
		) {
			const yt = Z ? lr : Xt.getTransfer(Y)
			B === i.FLOAT && (X = i.RGBA32F),
				B === i.HALF_FLOAT && (X = i.RGBA16F),
				B === i.UNSIGNED_BYTE && (X = yt === Jt ? i.SRGB8_ALPHA8 : i.RGBA8),
				B === i.UNSIGNED_SHORT_4_4_4_4 && (X = i.RGBA4),
				B === i.UNSIGNED_SHORT_5_5_5_1 && (X = i.RGB5_A1)
		}
		return (
			(X === i.R16F ||
				X === i.R32F ||
				X === i.RG16F ||
				X === i.RG32F ||
				X === i.RGBA16F ||
				X === i.RGBA32F) &&
				t.get("EXT_color_buffer_float"),
			X
		)
	}
	function S(A, x) {
		let B
		return (
			A
				? x === null || x === ui || x === as
					? (B = i.DEPTH24_STENCIL8)
					: x === xn
					? (B = i.DEPTH32F_STENCIL8)
					: x === os &&
					  ((B = i.DEPTH24_STENCIL8),
					  console.warn(
							"DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment."
					  ))
				: x === null || x === ui || x === as
				? (B = i.DEPTH_COMPONENT24)
				: x === xn
				? (B = i.DEPTH_COMPONENT32F)
				: x === os && (B = i.DEPTH_COMPONENT16),
			B
		)
	}
	function C(A, x) {
		return p(A) === !0 ||
			(A.isFramebufferTexture && A.minFilter !== dn && A.minFilter !== rn)
			? Math.log2(Math.max(x.width, x.height)) + 1
			: A.mipmaps !== void 0 && A.mipmaps.length > 0
			? A.mipmaps.length
			: A.isCompressedTexture && Array.isArray(A.image)
			? x.mipmaps.length
			: 1
	}
	function w(A) {
		const x = A.target
		x.removeEventListener("dispose", w), D(x), x.isVideoTexture && d.delete(x)
	}
	function E(A) {
		const x = A.target
		x.removeEventListener("dispose", E), y(x)
	}
	function D(A) {
		const x = n.get(A)
		if (x.__webglInit === void 0) return
		const B = A.source,
			Y = f.get(B)
		if (Y) {
			const Z = Y[x.__cacheKey]
			Z.usedTimes--,
				Z.usedTimes === 0 && v(A),
				Object.keys(Y).length === 0 && f.delete(B)
		}
		n.remove(A)
	}
	function v(A) {
		const x = n.get(A)
		i.deleteTexture(x.__webglTexture)
		const B = A.source,
			Y = f.get(B)
		delete Y[x.__cacheKey], o.memory.textures--
	}
	function y(A) {
		const x = n.get(A)
		if (
			(A.depthTexture && (A.depthTexture.dispose(), n.remove(A.depthTexture)),
			A.isWebGLCubeRenderTarget)
		)
			for (let Y = 0; Y < 6; Y++) {
				if (Array.isArray(x.__webglFramebuffer[Y]))
					for (let Z = 0; Z < x.__webglFramebuffer[Y].length; Z++)
						i.deleteFramebuffer(x.__webglFramebuffer[Y][Z])
				else i.deleteFramebuffer(x.__webglFramebuffer[Y])
				x.__webglDepthbuffer && i.deleteRenderbuffer(x.__webglDepthbuffer[Y])
			}
		else {
			if (Array.isArray(x.__webglFramebuffer))
				for (let Y = 0; Y < x.__webglFramebuffer.length; Y++)
					i.deleteFramebuffer(x.__webglFramebuffer[Y])
			else i.deleteFramebuffer(x.__webglFramebuffer)
			if (
				(x.__webglDepthbuffer && i.deleteRenderbuffer(x.__webglDepthbuffer),
				x.__webglMultisampledFramebuffer &&
					i.deleteFramebuffer(x.__webglMultisampledFramebuffer),
				x.__webglColorRenderbuffer)
			)
				for (let Y = 0; Y < x.__webglColorRenderbuffer.length; Y++)
					x.__webglColorRenderbuffer[Y] &&
						i.deleteRenderbuffer(x.__webglColorRenderbuffer[Y])
			x.__webglDepthRenderbuffer &&
				i.deleteRenderbuffer(x.__webglDepthRenderbuffer)
		}
		const B = A.textures
		for (let Y = 0, Z = B.length; Y < Z; Y++) {
			const X = n.get(B[Y])
			X.__webglTexture &&
				(i.deleteTexture(X.__webglTexture), o.memory.textures--),
				n.remove(B[Y])
		}
		n.remove(A)
	}
	let R = 0
	function L() {
		R = 0
	}
	function N() {
		const A = R
		return (
			A >= s.maxTextures &&
				console.warn(
					"THREE.WebGLTextures: Trying to use " +
						A +
						" texture units while this GPU supports only " +
						s.maxTextures
				),
			(R += 1),
			A
		)
	}
	function z(A) {
		const x = []
		return (
			x.push(A.wrapS),
			x.push(A.wrapT),
			x.push(A.wrapR || 0),
			x.push(A.magFilter),
			x.push(A.minFilter),
			x.push(A.anisotropy),
			x.push(A.internalFormat),
			x.push(A.format),
			x.push(A.type),
			x.push(A.generateMipmaps),
			x.push(A.premultiplyAlpha),
			x.push(A.flipY),
			x.push(A.unpackAlignment),
			x.push(A.colorSpace),
			x.join()
		)
	}
	function H(A, x) {
		const B = n.get(A)
		if (
			(A.isVideoTexture && Ft(A),
			A.isRenderTargetTexture === !1 &&
				A.isExternalTexture !== !0 &&
				A.version > 0 &&
				B.__version !== A.version)
		) {
			const Y = A.image
			if (Y === null)
				console.warn(
					"THREE.WebGLRenderer: Texture marked for update but no image data found."
				)
			else if (Y.complete === !1)
				console.warn(
					"THREE.WebGLRenderer: Texture marked for update but image is incomplete"
				)
			else {
				q(B, A, x)
				return
			}
		} else
			A.isExternalTexture &&
				(B.__webglTexture = A.sourceTexture ? A.sourceTexture : null)
		e.bindTexture(i.TEXTURE_2D, B.__webglTexture, i.TEXTURE0 + x)
	}
	function W(A, x) {
		const B = n.get(A)
		if (
			A.isRenderTargetTexture === !1 &&
			A.version > 0 &&
			B.__version !== A.version
		) {
			q(B, A, x)
			return
		}
		e.bindTexture(i.TEXTURE_2D_ARRAY, B.__webglTexture, i.TEXTURE0 + x)
	}
	function j(A, x) {
		const B = n.get(A)
		if (
			A.isRenderTargetTexture === !1 &&
			A.version > 0 &&
			B.__version !== A.version
		) {
			q(B, A, x)
			return
		}
		e.bindTexture(i.TEXTURE_3D, B.__webglTexture, i.TEXTURE0 + x)
	}
	function V(A, x) {
		const B = n.get(A)
		if (A.version > 0 && B.__version !== A.version) {
			$(B, A, x)
			return
		}
		e.bindTexture(i.TEXTURE_CUBE_MAP, B.__webglTexture, i.TEXTURE0 + x)
	}
	const rt = { [ar]: i.REPEAT, [Gn]: i.CLAMP_TO_EDGE, [_o]: i.MIRRORED_REPEAT },
		ht = {
			[dn]: i.NEAREST,
			[Sh]: i.NEAREST_MIPMAP_NEAREST,
			[Es]: i.NEAREST_MIPMAP_LINEAR,
			[rn]: i.LINEAR,
			[br]: i.LINEAR_MIPMAP_NEAREST,
			[Vn]: i.LINEAR_MIPMAP_LINEAR,
		},
		Et = {
			[Ah]: i.NEVER,
			[Lh]: i.ALWAYS,
			[wh]: i.LESS,
			[Jl]: i.LEQUAL,
			[Rh]: i.EQUAL,
			[Dh]: i.GEQUAL,
			[Ch]: i.GREATER,
			[Ph]: i.NOTEQUAL,
		}
	function zt(A, x) {
		if (
			(x.type === xn &&
				t.has("OES_texture_float_linear") === !1 &&
				(x.magFilter === rn ||
					x.magFilter === br ||
					x.magFilter === Es ||
					x.magFilter === Vn ||
					x.minFilter === rn ||
					x.minFilter === br ||
					x.minFilter === Es ||
					x.minFilter === Vn) &&
				console.warn(
					"THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."
				),
			i.texParameteri(A, i.TEXTURE_WRAP_S, rt[x.wrapS]),
			i.texParameteri(A, i.TEXTURE_WRAP_T, rt[x.wrapT]),
			(A === i.TEXTURE_3D || A === i.TEXTURE_2D_ARRAY) &&
				i.texParameteri(A, i.TEXTURE_WRAP_R, rt[x.wrapR]),
			i.texParameteri(A, i.TEXTURE_MAG_FILTER, ht[x.magFilter]),
			i.texParameteri(A, i.TEXTURE_MIN_FILTER, ht[x.minFilter]),
			x.compareFunction &&
				(i.texParameteri(A, i.TEXTURE_COMPARE_MODE, i.COMPARE_REF_TO_TEXTURE),
				i.texParameteri(A, i.TEXTURE_COMPARE_FUNC, Et[x.compareFunction])),
			t.has("EXT_texture_filter_anisotropic") === !0)
		) {
			if (
				x.magFilter === dn ||
				(x.minFilter !== Es && x.minFilter !== Vn) ||
				(x.type === xn && t.has("OES_texture_float_linear") === !1)
			)
				return
			if (x.anisotropy > 1 || n.get(x).__currentAnisotropy) {
				const B = t.get("EXT_texture_filter_anisotropic")
				i.texParameterf(
					A,
					B.TEXTURE_MAX_ANISOTROPY_EXT,
					Math.min(x.anisotropy, s.getMaxAnisotropy())
				),
					(n.get(x).__currentAnisotropy = x.anisotropy)
			}
		}
	}
	function ee(A, x) {
		let B = !1
		A.__webglInit === void 0 &&
			((A.__webglInit = !0), x.addEventListener("dispose", w))
		const Y = x.source
		let Z = f.get(Y)
		Z === void 0 && ((Z = {}), f.set(Y, Z))
		const X = z(x)
		if (X !== A.__cacheKey) {
			Z[X] === void 0 &&
				((Z[X] = { texture: i.createTexture(), usedTimes: 0 }),
				o.memory.textures++,
				(B = !0)),
				Z[X].usedTimes++
			const yt = Z[A.__cacheKey]
			yt !== void 0 &&
				(Z[A.__cacheKey].usedTimes--, yt.usedTimes === 0 && v(x)),
				(A.__cacheKey = X),
				(A.__webglTexture = Z[X].texture)
		}
		return B
	}
	function se(A, x, B) {
		return Math.floor(Math.floor(A / B) / x)
	}
	function jt(A, x, B, Y) {
		const X = A.updateRanges
		if (X.length === 0)
			e.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, x.width, x.height, B, Y, x.data)
		else {
			X.sort((tt, ct) => tt.start - ct.start)
			let yt = 0
			for (let tt = 1; tt < X.length; tt++) {
				const ct = X[yt],
					wt = X[tt],
					Mt = ct.start + ct.count,
					at = se(wt.start, x.width, 4),
					Ut = se(ct.start, x.width, 4)
				wt.start <= Mt + 1 &&
				at === Ut &&
				se(wt.start + wt.count - 1, x.width, 4) === at
					? (ct.count = Math.max(ct.count, wt.start + wt.count - ct.start))
					: (++yt, (X[yt] = wt))
			}
			X.length = yt + 1
			const it = i.getParameter(i.UNPACK_ROW_LENGTH),
				xt = i.getParameter(i.UNPACK_SKIP_PIXELS),
				vt = i.getParameter(i.UNPACK_SKIP_ROWS)
			i.pixelStorei(i.UNPACK_ROW_LENGTH, x.width)
			for (let tt = 0, ct = X.length; tt < ct; tt++) {
				const wt = X[tt],
					Mt = Math.floor(wt.start / 4),
					at = Math.ceil(wt.count / 4),
					Ut = Mt % x.width,
					I = Math.floor(Mt / x.width),
					et = at,
					st = 1
				i.pixelStorei(i.UNPACK_SKIP_PIXELS, Ut),
					i.pixelStorei(i.UNPACK_SKIP_ROWS, I),
					e.texSubImage2D(i.TEXTURE_2D, 0, Ut, I, et, st, B, Y, x.data)
			}
			A.clearUpdateRanges(),
				i.pixelStorei(i.UNPACK_ROW_LENGTH, it),
				i.pixelStorei(i.UNPACK_SKIP_PIXELS, xt),
				i.pixelStorei(i.UNPACK_SKIP_ROWS, vt)
		}
	}
	function q(A, x, B) {
		let Y = i.TEXTURE_2D
		;(x.isDataArrayTexture || x.isCompressedArrayTexture) &&
			(Y = i.TEXTURE_2D_ARRAY),
			x.isData3DTexture && (Y = i.TEXTURE_3D)
		const Z = ee(A, x),
			X = x.source
		e.bindTexture(Y, A.__webglTexture, i.TEXTURE0 + B)
		const yt = n.get(X)
		if (X.version !== yt.__version || Z === !0) {
			e.activeTexture(i.TEXTURE0 + B)
			const it = Xt.getPrimaries(Xt.workingColorSpace),
				xt = x.colorSpace === Hn ? null : Xt.getPrimaries(x.colorSpace),
				vt = x.colorSpace === Hn || it === xt ? i.NONE : i.BROWSER_DEFAULT_WEBGL
			i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, x.flipY),
				i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, x.premultiplyAlpha),
				i.pixelStorei(i.UNPACK_ALIGNMENT, x.unpackAlignment),
				i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, vt)
			let tt = _(x.image, !1, s.maxTextureSize)
			tt = Se(x, tt)
			const ct = r.convert(x.format, x.colorSpace),
				wt = r.convert(x.type)
			let Mt = T(x.internalFormat, ct, wt, x.colorSpace, x.isVideoTexture)
			zt(Y, x)
			let at
			const Ut = x.mipmaps,
				I = x.isVideoTexture !== !0,
				et = yt.__version === void 0 || Z === !0,
				st = X.dataReady,
				dt = C(x, tt)
			if (x.isDepthTexture)
				(Mt = S(x.format === cs, x.type)),
					et &&
						(I
							? e.texStorage2D(i.TEXTURE_2D, 1, Mt, tt.width, tt.height)
							: e.texImage2D(
									i.TEXTURE_2D,
									0,
									Mt,
									tt.width,
									tt.height,
									0,
									ct,
									wt,
									null
							  ))
			else if (x.isDataTexture)
				if (Ut.length > 0) {
					I &&
						et &&
						e.texStorage2D(i.TEXTURE_2D, dt, Mt, Ut[0].width, Ut[0].height)
					for (let J = 0, K = Ut.length; J < K; J++)
						(at = Ut[J]),
							I
								? st &&
								  e.texSubImage2D(
										i.TEXTURE_2D,
										J,
										0,
										0,
										at.width,
										at.height,
										ct,
										wt,
										at.data
								  )
								: e.texImage2D(
										i.TEXTURE_2D,
										J,
										Mt,
										at.width,
										at.height,
										0,
										ct,
										wt,
										at.data
								  )
					x.generateMipmaps = !1
				} else
					I
						? (et && e.texStorage2D(i.TEXTURE_2D, dt, Mt, tt.width, tt.height),
						  st && jt(x, tt, ct, wt))
						: e.texImage2D(
								i.TEXTURE_2D,
								0,
								Mt,
								tt.width,
								tt.height,
								0,
								ct,
								wt,
								tt.data
						  )
			else if (x.isCompressedTexture)
				if (x.isCompressedArrayTexture) {
					I &&
						et &&
						e.texStorage3D(
							i.TEXTURE_2D_ARRAY,
							dt,
							Mt,
							Ut[0].width,
							Ut[0].height,
							tt.depth
						)
					for (let J = 0, K = Ut.length; J < K; J++)
						if (((at = Ut[J]), x.format !== on))
							if (ct !== null)
								if (I) {
									if (st)
										if (x.layerUpdates.size > 0) {
											const mt = nl(at.width, at.height, x.format, x.type)
											for (const Lt of x.layerUpdates) {
												const ne = at.data.subarray(
													(Lt * mt) / at.data.BYTES_PER_ELEMENT,
													((Lt + 1) * mt) / at.data.BYTES_PER_ELEMENT
												)
												e.compressedTexSubImage3D(
													i.TEXTURE_2D_ARRAY,
													J,
													0,
													0,
													Lt,
													at.width,
													at.height,
													1,
													ct,
													ne
												)
											}
											x.clearLayerUpdates()
										} else
											e.compressedTexSubImage3D(
												i.TEXTURE_2D_ARRAY,
												J,
												0,
												0,
												0,
												at.width,
												at.height,
												tt.depth,
												ct,
												at.data
											)
								} else
									e.compressedTexImage3D(
										i.TEXTURE_2D_ARRAY,
										J,
										Mt,
										at.width,
										at.height,
										tt.depth,
										0,
										at.data,
										0,
										0
									)
							else
								console.warn(
									"THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"
								)
						else
							I
								? st &&
								  e.texSubImage3D(
										i.TEXTURE_2D_ARRAY,
										J,
										0,
										0,
										0,
										at.width,
										at.height,
										tt.depth,
										ct,
										wt,
										at.data
								  )
								: e.texImage3D(
										i.TEXTURE_2D_ARRAY,
										J,
										Mt,
										at.width,
										at.height,
										tt.depth,
										0,
										ct,
										wt,
										at.data
								  )
				} else {
					I &&
						et &&
						e.texStorage2D(i.TEXTURE_2D, dt, Mt, Ut[0].width, Ut[0].height)
					for (let J = 0, K = Ut.length; J < K; J++)
						(at = Ut[J]),
							x.format !== on
								? ct !== null
									? I
										? st &&
										  e.compressedTexSubImage2D(
												i.TEXTURE_2D,
												J,
												0,
												0,
												at.width,
												at.height,
												ct,
												at.data
										  )
										: e.compressedTexImage2D(
												i.TEXTURE_2D,
												J,
												Mt,
												at.width,
												at.height,
												0,
												at.data
										  )
									: console.warn(
											"THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"
									  )
								: I
								? st &&
								  e.texSubImage2D(
										i.TEXTURE_2D,
										J,
										0,
										0,
										at.width,
										at.height,
										ct,
										wt,
										at.data
								  )
								: e.texImage2D(
										i.TEXTURE_2D,
										J,
										Mt,
										at.width,
										at.height,
										0,
										ct,
										wt,
										at.data
								  )
				}
			else if (x.isDataArrayTexture)
				if (I) {
					if (
						(et &&
							e.texStorage3D(
								i.TEXTURE_2D_ARRAY,
								dt,
								Mt,
								tt.width,
								tt.height,
								tt.depth
							),
						st)
					)
						if (x.layerUpdates.size > 0) {
							const J = nl(tt.width, tt.height, x.format, x.type)
							for (const K of x.layerUpdates) {
								const mt = tt.data.subarray(
									(K * J) / tt.data.BYTES_PER_ELEMENT,
									((K + 1) * J) / tt.data.BYTES_PER_ELEMENT
								)
								e.texSubImage3D(
									i.TEXTURE_2D_ARRAY,
									0,
									0,
									0,
									K,
									tt.width,
									tt.height,
									1,
									ct,
									wt,
									mt
								)
							}
							x.clearLayerUpdates()
						} else
							e.texSubImage3D(
								i.TEXTURE_2D_ARRAY,
								0,
								0,
								0,
								0,
								tt.width,
								tt.height,
								tt.depth,
								ct,
								wt,
								tt.data
							)
				} else
					e.texImage3D(
						i.TEXTURE_2D_ARRAY,
						0,
						Mt,
						tt.width,
						tt.height,
						tt.depth,
						0,
						ct,
						wt,
						tt.data
					)
			else if (x.isData3DTexture)
				I
					? (et &&
							e.texStorage3D(
								i.TEXTURE_3D,
								dt,
								Mt,
								tt.width,
								tt.height,
								tt.depth
							),
					  st &&
							e.texSubImage3D(
								i.TEXTURE_3D,
								0,
								0,
								0,
								0,
								tt.width,
								tt.height,
								tt.depth,
								ct,
								wt,
								tt.data
							))
					: e.texImage3D(
							i.TEXTURE_3D,
							0,
							Mt,
							tt.width,
							tt.height,
							tt.depth,
							0,
							ct,
							wt,
							tt.data
					  )
			else if (x.isFramebufferTexture) {
				if (et)
					if (I) e.texStorage2D(i.TEXTURE_2D, dt, Mt, tt.width, tt.height)
					else {
						let J = tt.width,
							K = tt.height
						for (let mt = 0; mt < dt; mt++)
							e.texImage2D(i.TEXTURE_2D, mt, Mt, J, K, 0, ct, wt, null),
								(J >>= 1),
								(K >>= 1)
					}
			} else if (Ut.length > 0) {
				if (I && et) {
					const J = fe(Ut[0])
					e.texStorage2D(i.TEXTURE_2D, dt, Mt, J.width, J.height)
				}
				for (let J = 0, K = Ut.length; J < K; J++)
					(at = Ut[J]),
						I
							? st && e.texSubImage2D(i.TEXTURE_2D, J, 0, 0, ct, wt, at)
							: e.texImage2D(i.TEXTURE_2D, J, Mt, ct, wt, at)
				x.generateMipmaps = !1
			} else if (I) {
				if (et) {
					const J = fe(tt)
					e.texStorage2D(i.TEXTURE_2D, dt, Mt, J.width, J.height)
				}
				st && e.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, ct, wt, tt)
			} else e.texImage2D(i.TEXTURE_2D, 0, Mt, ct, wt, tt)
			p(x) && u(Y), (yt.__version = X.version), x.onUpdate && x.onUpdate(x)
		}
		A.__version = x.version
	}
	function $(A, x, B) {
		if (x.image.length !== 6) return
		const Y = ee(A, x),
			Z = x.source
		e.bindTexture(i.TEXTURE_CUBE_MAP, A.__webglTexture, i.TEXTURE0 + B)
		const X = n.get(Z)
		if (Z.version !== X.__version || Y === !0) {
			e.activeTexture(i.TEXTURE0 + B)
			const yt = Xt.getPrimaries(Xt.workingColorSpace),
				it = x.colorSpace === Hn ? null : Xt.getPrimaries(x.colorSpace),
				xt = x.colorSpace === Hn || yt === it ? i.NONE : i.BROWSER_DEFAULT_WEBGL
			i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, x.flipY),
				i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, x.premultiplyAlpha),
				i.pixelStorei(i.UNPACK_ALIGNMENT, x.unpackAlignment),
				i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, xt)
			const vt = x.isCompressedTexture || x.image[0].isCompressedTexture,
				tt = x.image[0] && x.image[0].isDataTexture,
				ct = []
			for (let K = 0; K < 6; K++)
				!vt && !tt
					? (ct[K] = _(x.image[K], !0, s.maxCubemapSize))
					: (ct[K] = tt ? x.image[K].image : x.image[K]),
					(ct[K] = Se(x, ct[K]))
			const wt = ct[0],
				Mt = r.convert(x.format, x.colorSpace),
				at = r.convert(x.type),
				Ut = T(x.internalFormat, Mt, at, x.colorSpace),
				I = x.isVideoTexture !== !0,
				et = X.__version === void 0 || Y === !0,
				st = Z.dataReady
			let dt = C(x, wt)
			zt(i.TEXTURE_CUBE_MAP, x)
			let J
			if (vt) {
				I &&
					et &&
					e.texStorage2D(i.TEXTURE_CUBE_MAP, dt, Ut, wt.width, wt.height)
				for (let K = 0; K < 6; K++) {
					J = ct[K].mipmaps
					for (let mt = 0; mt < J.length; mt++) {
						const Lt = J[mt]
						x.format !== on
							? Mt !== null
								? I
									? st &&
									  e.compressedTexSubImage2D(
											i.TEXTURE_CUBE_MAP_POSITIVE_X + K,
											mt,
											0,
											0,
											Lt.width,
											Lt.height,
											Mt,
											Lt.data
									  )
									: e.compressedTexImage2D(
											i.TEXTURE_CUBE_MAP_POSITIVE_X + K,
											mt,
											Ut,
											Lt.width,
											Lt.height,
											0,
											Lt.data
									  )
								: console.warn(
										"THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"
								  )
							: I
							? st &&
							  e.texSubImage2D(
									i.TEXTURE_CUBE_MAP_POSITIVE_X + K,
									mt,
									0,
									0,
									Lt.width,
									Lt.height,
									Mt,
									at,
									Lt.data
							  )
							: e.texImage2D(
									i.TEXTURE_CUBE_MAP_POSITIVE_X + K,
									mt,
									Ut,
									Lt.width,
									Lt.height,
									0,
									Mt,
									at,
									Lt.data
							  )
					}
				}
			} else {
				if (((J = x.mipmaps), I && et)) {
					J.length > 0 && dt++
					const K = fe(ct[0])
					e.texStorage2D(i.TEXTURE_CUBE_MAP, dt, Ut, K.width, K.height)
				}
				for (let K = 0; K < 6; K++)
					if (tt) {
						I
							? st &&
							  e.texSubImage2D(
									i.TEXTURE_CUBE_MAP_POSITIVE_X + K,
									0,
									0,
									0,
									ct[K].width,
									ct[K].height,
									Mt,
									at,
									ct[K].data
							  )
							: e.texImage2D(
									i.TEXTURE_CUBE_MAP_POSITIVE_X + K,
									0,
									Ut,
									ct[K].width,
									ct[K].height,
									0,
									Mt,
									at,
									ct[K].data
							  )
						for (let mt = 0; mt < J.length; mt++) {
							const ne = J[mt].image[K].image
							I
								? st &&
								  e.texSubImage2D(
										i.TEXTURE_CUBE_MAP_POSITIVE_X + K,
										mt + 1,
										0,
										0,
										ne.width,
										ne.height,
										Mt,
										at,
										ne.data
								  )
								: e.texImage2D(
										i.TEXTURE_CUBE_MAP_POSITIVE_X + K,
										mt + 1,
										Ut,
										ne.width,
										ne.height,
										0,
										Mt,
										at,
										ne.data
								  )
						}
					} else {
						I
							? st &&
							  e.texSubImage2D(
									i.TEXTURE_CUBE_MAP_POSITIVE_X + K,
									0,
									0,
									0,
									Mt,
									at,
									ct[K]
							  )
							: e.texImage2D(
									i.TEXTURE_CUBE_MAP_POSITIVE_X + K,
									0,
									Ut,
									Mt,
									at,
									ct[K]
							  )
						for (let mt = 0; mt < J.length; mt++) {
							const Lt = J[mt]
							I
								? st &&
								  e.texSubImage2D(
										i.TEXTURE_CUBE_MAP_POSITIVE_X + K,
										mt + 1,
										0,
										0,
										Mt,
										at,
										Lt.image[K]
								  )
								: e.texImage2D(
										i.TEXTURE_CUBE_MAP_POSITIVE_X + K,
										mt + 1,
										Ut,
										Mt,
										at,
										Lt.image[K]
								  )
						}
					}
			}
			p(x) && u(i.TEXTURE_CUBE_MAP),
				(X.__version = Z.version),
				x.onUpdate && x.onUpdate(x)
		}
		A.__version = x.version
	}
	function ft(A, x, B, Y, Z, X) {
		const yt = r.convert(B.format, B.colorSpace),
			it = r.convert(B.type),
			xt = T(B.internalFormat, yt, it, B.colorSpace),
			vt = n.get(x),
			tt = n.get(B)
		if (((tt.__renderTarget = x), !vt.__hasExternalTextures)) {
			const ct = Math.max(1, x.width >> X),
				wt = Math.max(1, x.height >> X)
			Z === i.TEXTURE_3D || Z === i.TEXTURE_2D_ARRAY
				? e.texImage3D(Z, X, xt, ct, wt, x.depth, 0, yt, it, null)
				: e.texImage2D(Z, X, xt, ct, wt, 0, yt, it, null)
		}
		e.bindFramebuffer(i.FRAMEBUFFER, A),
			_t(x)
				? a.framebufferTexture2DMultisampleEXT(
						i.FRAMEBUFFER,
						Y,
						Z,
						tt.__webglTexture,
						0,
						oe(x)
				  )
				: (Z === i.TEXTURE_2D ||
						(Z >= i.TEXTURE_CUBE_MAP_POSITIVE_X &&
							Z <= i.TEXTURE_CUBE_MAP_NEGATIVE_Z)) &&
				  i.framebufferTexture2D(i.FRAMEBUFFER, Y, Z, tt.__webglTexture, X),
			e.bindFramebuffer(i.FRAMEBUFFER, null)
	}
	function Pt(A, x, B) {
		if ((i.bindRenderbuffer(i.RENDERBUFFER, A), x.depthBuffer)) {
			const Y = x.depthTexture,
				Z = Y && Y.isDepthTexture ? Y.type : null,
				X = S(x.stencilBuffer, Z),
				yt = x.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT,
				it = oe(x)
			_t(x)
				? a.renderbufferStorageMultisampleEXT(
						i.RENDERBUFFER,
						it,
						X,
						x.width,
						x.height
				  )
				: B
				? i.renderbufferStorageMultisample(
						i.RENDERBUFFER,
						it,
						X,
						x.width,
						x.height
				  )
				: i.renderbufferStorage(i.RENDERBUFFER, X, x.width, x.height),
				i.framebufferRenderbuffer(i.FRAMEBUFFER, yt, i.RENDERBUFFER, A)
		} else {
			const Y = x.textures
			for (let Z = 0; Z < Y.length; Z++) {
				const X = Y[Z],
					yt = r.convert(X.format, X.colorSpace),
					it = r.convert(X.type),
					xt = T(X.internalFormat, yt, it, X.colorSpace),
					vt = oe(x)
				B && _t(x) === !1
					? i.renderbufferStorageMultisample(
							i.RENDERBUFFER,
							vt,
							xt,
							x.width,
							x.height
					  )
					: _t(x)
					? a.renderbufferStorageMultisampleEXT(
							i.RENDERBUFFER,
							vt,
							xt,
							x.width,
							x.height
					  )
					: i.renderbufferStorage(i.RENDERBUFFER, xt, x.width, x.height)
			}
		}
		i.bindRenderbuffer(i.RENDERBUFFER, null)
	}
	function St(A, x) {
		if (x && x.isWebGLCubeRenderTarget)
			throw new Error("Depth Texture with cube render targets is not supported")
		if (
			(e.bindFramebuffer(i.FRAMEBUFFER, A),
			!(x.depthTexture && x.depthTexture.isDepthTexture))
		)
			throw new Error(
				"renderTarget.depthTexture must be an instance of THREE.DepthTexture"
			)
		const Y = n.get(x.depthTexture)
		;(Y.__renderTarget = x),
			(!Y.__webglTexture ||
				x.depthTexture.image.width !== x.width ||
				x.depthTexture.image.height !== x.height) &&
				((x.depthTexture.image.width = x.width),
				(x.depthTexture.image.height = x.height),
				(x.depthTexture.needsUpdate = !0)),
			H(x.depthTexture, 0)
		const Z = Y.__webglTexture,
			X = oe(x)
		if (x.depthTexture.format === ls)
			_t(x)
				? a.framebufferTexture2DMultisampleEXT(
						i.FRAMEBUFFER,
						i.DEPTH_ATTACHMENT,
						i.TEXTURE_2D,
						Z,
						0,
						X
				  )
				: i.framebufferTexture2D(
						i.FRAMEBUFFER,
						i.DEPTH_ATTACHMENT,
						i.TEXTURE_2D,
						Z,
						0
				  )
		else if (x.depthTexture.format === cs)
			_t(x)
				? a.framebufferTexture2DMultisampleEXT(
						i.FRAMEBUFFER,
						i.DEPTH_STENCIL_ATTACHMENT,
						i.TEXTURE_2D,
						Z,
						0,
						X
				  )
				: i.framebufferTexture2D(
						i.FRAMEBUFFER,
						i.DEPTH_STENCIL_ATTACHMENT,
						i.TEXTURE_2D,
						Z,
						0
				  )
		else throw new Error("Unknown depthTexture format")
	}
	function Gt(A) {
		const x = n.get(A),
			B = A.isWebGLCubeRenderTarget === !0
		if (x.__boundDepthTexture !== A.depthTexture) {
			const Y = A.depthTexture
			if ((x.__depthDisposeCallback && x.__depthDisposeCallback(), Y)) {
				const Z = () => {
					delete x.__boundDepthTexture,
						delete x.__depthDisposeCallback,
						Y.removeEventListener("dispose", Z)
				}
				Y.addEventListener("dispose", Z), (x.__depthDisposeCallback = Z)
			}
			x.__boundDepthTexture = Y
		}
		if (A.depthTexture && !x.__autoAllocateDepthBuffer) {
			if (B)
				throw new Error(
					"target.depthTexture not supported in Cube render targets"
				)
			const Y = A.texture.mipmaps
			Y && Y.length > 0
				? St(x.__webglFramebuffer[0], A)
				: St(x.__webglFramebuffer, A)
		} else if (B) {
			x.__webglDepthbuffer = []
			for (let Y = 0; Y < 6; Y++)
				if (
					(e.bindFramebuffer(i.FRAMEBUFFER, x.__webglFramebuffer[Y]),
					x.__webglDepthbuffer[Y] === void 0)
				)
					(x.__webglDepthbuffer[Y] = i.createRenderbuffer()),
						Pt(x.__webglDepthbuffer[Y], A, !1)
				else {
					const Z = A.stencilBuffer
							? i.DEPTH_STENCIL_ATTACHMENT
							: i.DEPTH_ATTACHMENT,
						X = x.__webglDepthbuffer[Y]
					i.bindRenderbuffer(i.RENDERBUFFER, X),
						i.framebufferRenderbuffer(i.FRAMEBUFFER, Z, i.RENDERBUFFER, X)
				}
		} else {
			const Y = A.texture.mipmaps
			if (
				(Y && Y.length > 0
					? e.bindFramebuffer(i.FRAMEBUFFER, x.__webglFramebuffer[0])
					: e.bindFramebuffer(i.FRAMEBUFFER, x.__webglFramebuffer),
				x.__webglDepthbuffer === void 0)
			)
				(x.__webglDepthbuffer = i.createRenderbuffer()),
					Pt(x.__webglDepthbuffer, A, !1)
			else {
				const Z = A.stencilBuffer
						? i.DEPTH_STENCIL_ATTACHMENT
						: i.DEPTH_ATTACHMENT,
					X = x.__webglDepthbuffer
				i.bindRenderbuffer(i.RENDERBUFFER, X),
					i.framebufferRenderbuffer(i.FRAMEBUFFER, Z, i.RENDERBUFFER, X)
			}
		}
		e.bindFramebuffer(i.FRAMEBUFFER, null)
	}
	function we(A, x, B) {
		const Y = n.get(A)
		x !== void 0 &&
			ft(
				Y.__webglFramebuffer,
				A,
				A.texture,
				i.COLOR_ATTACHMENT0,
				i.TEXTURE_2D,
				0
			),
			B !== void 0 && Gt(A)
	}
	function P(A) {
		const x = A.texture,
			B = n.get(A),
			Y = n.get(x)
		A.addEventListener("dispose", E)
		const Z = A.textures,
			X = A.isWebGLCubeRenderTarget === !0,
			yt = Z.length > 1
		if (
			(yt ||
				(Y.__webglTexture === void 0 && (Y.__webglTexture = i.createTexture()),
				(Y.__version = x.version),
				o.memory.textures++),
			X)
		) {
			B.__webglFramebuffer = []
			for (let it = 0; it < 6; it++)
				if (x.mipmaps && x.mipmaps.length > 0) {
					B.__webglFramebuffer[it] = []
					for (let xt = 0; xt < x.mipmaps.length; xt++)
						B.__webglFramebuffer[it][xt] = i.createFramebuffer()
				} else B.__webglFramebuffer[it] = i.createFramebuffer()
		} else {
			if (x.mipmaps && x.mipmaps.length > 0) {
				B.__webglFramebuffer = []
				for (let it = 0; it < x.mipmaps.length; it++)
					B.__webglFramebuffer[it] = i.createFramebuffer()
			} else B.__webglFramebuffer = i.createFramebuffer()
			if (yt)
				for (let it = 0, xt = Z.length; it < xt; it++) {
					const vt = n.get(Z[it])
					vt.__webglTexture === void 0 &&
						((vt.__webglTexture = i.createTexture()), o.memory.textures++)
				}
			if (A.samples > 0 && _t(A) === !1) {
				;(B.__webglMultisampledFramebuffer = i.createFramebuffer()),
					(B.__webglColorRenderbuffer = []),
					e.bindFramebuffer(i.FRAMEBUFFER, B.__webglMultisampledFramebuffer)
				for (let it = 0; it < Z.length; it++) {
					const xt = Z[it]
					;(B.__webglColorRenderbuffer[it] = i.createRenderbuffer()),
						i.bindRenderbuffer(i.RENDERBUFFER, B.__webglColorRenderbuffer[it])
					const vt = r.convert(xt.format, xt.colorSpace),
						tt = r.convert(xt.type),
						ct = T(
							xt.internalFormat,
							vt,
							tt,
							xt.colorSpace,
							A.isXRRenderTarget === !0
						),
						wt = oe(A)
					i.renderbufferStorageMultisample(
						i.RENDERBUFFER,
						wt,
						ct,
						A.width,
						A.height
					),
						i.framebufferRenderbuffer(
							i.FRAMEBUFFER,
							i.COLOR_ATTACHMENT0 + it,
							i.RENDERBUFFER,
							B.__webglColorRenderbuffer[it]
						)
				}
				i.bindRenderbuffer(i.RENDERBUFFER, null),
					A.depthBuffer &&
						((B.__webglDepthRenderbuffer = i.createRenderbuffer()),
						Pt(B.__webglDepthRenderbuffer, A, !0)),
					e.bindFramebuffer(i.FRAMEBUFFER, null)
			}
		}
		if (X) {
			e.bindTexture(i.TEXTURE_CUBE_MAP, Y.__webglTexture),
				zt(i.TEXTURE_CUBE_MAP, x)
			for (let it = 0; it < 6; it++)
				if (x.mipmaps && x.mipmaps.length > 0)
					for (let xt = 0; xt < x.mipmaps.length; xt++)
						ft(
							B.__webglFramebuffer[it][xt],
							A,
							x,
							i.COLOR_ATTACHMENT0,
							i.TEXTURE_CUBE_MAP_POSITIVE_X + it,
							xt
						)
				else
					ft(
						B.__webglFramebuffer[it],
						A,
						x,
						i.COLOR_ATTACHMENT0,
						i.TEXTURE_CUBE_MAP_POSITIVE_X + it,
						0
					)
			p(x) && u(i.TEXTURE_CUBE_MAP), e.unbindTexture()
		} else if (yt) {
			for (let it = 0, xt = Z.length; it < xt; it++) {
				const vt = Z[it],
					tt = n.get(vt)
				let ct = i.TEXTURE_2D
				;(A.isWebGL3DRenderTarget || A.isWebGLArrayRenderTarget) &&
					(ct = A.isWebGL3DRenderTarget ? i.TEXTURE_3D : i.TEXTURE_2D_ARRAY),
					e.bindTexture(ct, tt.__webglTexture),
					zt(ct, vt),
					ft(B.__webglFramebuffer, A, vt, i.COLOR_ATTACHMENT0 + it, ct, 0),
					p(vt) && u(ct)
			}
			e.unbindTexture()
		} else {
			let it = i.TEXTURE_2D
			if (
				((A.isWebGL3DRenderTarget || A.isWebGLArrayRenderTarget) &&
					(it = A.isWebGL3DRenderTarget ? i.TEXTURE_3D : i.TEXTURE_2D_ARRAY),
				e.bindTexture(it, Y.__webglTexture),
				zt(it, x),
				x.mipmaps && x.mipmaps.length > 0)
			)
				for (let xt = 0; xt < x.mipmaps.length; xt++)
					ft(B.__webglFramebuffer[xt], A, x, i.COLOR_ATTACHMENT0, it, xt)
			else ft(B.__webglFramebuffer, A, x, i.COLOR_ATTACHMENT0, it, 0)
			p(x) && u(it), e.unbindTexture()
		}
		A.depthBuffer && Gt(A)
	}
	function re(A) {
		const x = A.textures
		for (let B = 0, Y = x.length; B < Y; B++) {
			const Z = x[B]
			if (p(Z)) {
				const X = b(A),
					yt = n.get(Z).__webglTexture
				e.bindTexture(X, yt), u(X), e.unbindTexture()
			}
		}
	}
	const It = [],
		Rt = []
	function gt(A) {
		if (A.samples > 0) {
			if (_t(A) === !1) {
				const x = A.textures,
					B = A.width,
					Y = A.height
				let Z = i.COLOR_BUFFER_BIT
				const X = A.stencilBuffer
						? i.DEPTH_STENCIL_ATTACHMENT
						: i.DEPTH_ATTACHMENT,
					yt = n.get(A),
					it = x.length > 1
				if (it)
					for (let vt = 0; vt < x.length; vt++)
						e.bindFramebuffer(i.FRAMEBUFFER, yt.__webglMultisampledFramebuffer),
							i.framebufferRenderbuffer(
								i.FRAMEBUFFER,
								i.COLOR_ATTACHMENT0 + vt,
								i.RENDERBUFFER,
								null
							),
							e.bindFramebuffer(i.FRAMEBUFFER, yt.__webglFramebuffer),
							i.framebufferTexture2D(
								i.DRAW_FRAMEBUFFER,
								i.COLOR_ATTACHMENT0 + vt,
								i.TEXTURE_2D,
								null,
								0
							)
				e.bindFramebuffer(i.READ_FRAMEBUFFER, yt.__webglMultisampledFramebuffer)
				const xt = A.texture.mipmaps
				xt && xt.length > 0
					? e.bindFramebuffer(i.DRAW_FRAMEBUFFER, yt.__webglFramebuffer[0])
					: e.bindFramebuffer(i.DRAW_FRAMEBUFFER, yt.__webglFramebuffer)
				for (let vt = 0; vt < x.length; vt++) {
					if (
						(A.resolveDepthBuffer &&
							(A.depthBuffer && (Z |= i.DEPTH_BUFFER_BIT),
							A.stencilBuffer &&
								A.resolveStencilBuffer &&
								(Z |= i.STENCIL_BUFFER_BIT)),
						it)
					) {
						i.framebufferRenderbuffer(
							i.READ_FRAMEBUFFER,
							i.COLOR_ATTACHMENT0,
							i.RENDERBUFFER,
							yt.__webglColorRenderbuffer[vt]
						)
						const tt = n.get(x[vt]).__webglTexture
						i.framebufferTexture2D(
							i.DRAW_FRAMEBUFFER,
							i.COLOR_ATTACHMENT0,
							i.TEXTURE_2D,
							tt,
							0
						)
					}
					i.blitFramebuffer(0, 0, B, Y, 0, 0, B, Y, Z, i.NEAREST),
						h === !0 &&
							((It.length = 0),
							(Rt.length = 0),
							It.push(i.COLOR_ATTACHMENT0 + vt),
							A.depthBuffer &&
								A.resolveDepthBuffer === !1 &&
								(It.push(X),
								Rt.push(X),
								i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER, Rt)),
							i.invalidateFramebuffer(i.READ_FRAMEBUFFER, It))
				}
				if (
					(e.bindFramebuffer(i.READ_FRAMEBUFFER, null),
					e.bindFramebuffer(i.DRAW_FRAMEBUFFER, null),
					it)
				)
					for (let vt = 0; vt < x.length; vt++) {
						e.bindFramebuffer(i.FRAMEBUFFER, yt.__webglMultisampledFramebuffer),
							i.framebufferRenderbuffer(
								i.FRAMEBUFFER,
								i.COLOR_ATTACHMENT0 + vt,
								i.RENDERBUFFER,
								yt.__webglColorRenderbuffer[vt]
							)
						const tt = n.get(x[vt]).__webglTexture
						e.bindFramebuffer(i.FRAMEBUFFER, yt.__webglFramebuffer),
							i.framebufferTexture2D(
								i.DRAW_FRAMEBUFFER,
								i.COLOR_ATTACHMENT0 + vt,
								i.TEXTURE_2D,
								tt,
								0
							)
					}
				e.bindFramebuffer(i.DRAW_FRAMEBUFFER, yt.__webglMultisampledFramebuffer)
			} else if (A.depthBuffer && A.resolveDepthBuffer === !1 && h) {
				const x = A.stencilBuffer
					? i.DEPTH_STENCIL_ATTACHMENT
					: i.DEPTH_ATTACHMENT
				i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER, [x])
			}
		}
	}
	function oe(A) {
		return Math.min(s.maxSamples, A.samples)
	}
	function _t(A) {
		const x = n.get(A)
		return (
			A.samples > 0 &&
			t.has("WEBGL_multisampled_render_to_texture") === !0 &&
			x.__useRenderToTexture !== !1
		)
	}
	function Ft(A) {
		const x = o.render.frame
		d.get(A) !== x && (d.set(A, x), A.update())
	}
	function Se(A, x) {
		const B = A.colorSpace,
			Y = A.format,
			Z = A.type
		return (
			A.isCompressedTexture === !0 ||
				A.isVideoTexture === !0 ||
				(B !== Gi &&
					B !== Hn &&
					(Xt.getTransfer(B) === Jt
						? (Y !== on || Z !== Mn) &&
						  console.warn(
								"THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."
						  )
						: console.error(
								"THREE.WebGLTextures: Unsupported texture color space:",
								B
						  ))),
			x
		)
	}
	function fe(A) {
		return (
			typeof HTMLImageElement < "u" && A instanceof HTMLImageElement
				? ((l.width = A.naturalWidth || A.width),
				  (l.height = A.naturalHeight || A.height))
				: typeof VideoFrame < "u" && A instanceof VideoFrame
				? ((l.width = A.displayWidth), (l.height = A.displayHeight))
				: ((l.width = A.width), (l.height = A.height)),
			l
		)
	}
	;(this.allocateTextureUnit = N),
		(this.resetTextureUnits = L),
		(this.setTexture2D = H),
		(this.setTexture2DArray = W),
		(this.setTexture3D = j),
		(this.setTextureCube = V),
		(this.rebindTextures = we),
		(this.setupRenderTarget = P),
		(this.updateRenderTargetMipmap = re),
		(this.updateMultisampleRenderTarget = gt),
		(this.setupDepthRenderbuffer = Gt),
		(this.setupFrameBufferTexture = ft),
		(this.useMultisampledRTT = _t)
}
function jm(i, t) {
	function e(n, s = Hn) {
		let r
		const o = Xt.getTransfer(s)
		if (n === Mn) return i.UNSIGNED_BYTE
		if (n === Jo) return i.UNSIGNED_SHORT_4_4_4_4
		if (n === Qo) return i.UNSIGNED_SHORT_5_5_5_1
		if (n === Xl) return i.UNSIGNED_INT_5_9_9_9_REV
		if (n === Yl) return i.UNSIGNED_INT_10F_11F_11F_REV
		if (n === Vl) return i.BYTE
		if (n === Wl) return i.SHORT
		if (n === os) return i.UNSIGNED_SHORT
		if (n === $o) return i.INT
		if (n === ui) return i.UNSIGNED_INT
		if (n === xn) return i.FLOAT
		if (n === ms) return i.HALF_FLOAT
		if (n === ql) return i.ALPHA
		if (n === jl) return i.RGB
		if (n === on) return i.RGBA
		if (n === ls) return i.DEPTH_COMPONENT
		if (n === cs) return i.DEPTH_STENCIL
		if (n === Kl) return i.RED
		if (n === ta) return i.RED_INTEGER
		if (n === Zl) return i.RG
		if (n === ea) return i.RG_INTEGER
		if (n === na) return i.RGBA_INTEGER
		if (n === tr || n === er || n === nr || n === ir)
			if (o === Jt)
				if (((r = t.get("WEBGL_compressed_texture_s3tc_srgb")), r !== null)) {
					if (n === tr) return r.COMPRESSED_SRGB_S3TC_DXT1_EXT
					if (n === er) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT
					if (n === nr) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT
					if (n === ir) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT
				} else return null
			else if (((r = t.get("WEBGL_compressed_texture_s3tc")), r !== null)) {
				if (n === tr) return r.COMPRESSED_RGB_S3TC_DXT1_EXT
				if (n === er) return r.COMPRESSED_RGBA_S3TC_DXT1_EXT
				if (n === nr) return r.COMPRESSED_RGBA_S3TC_DXT3_EXT
				if (n === ir) return r.COMPRESSED_RGBA_S3TC_DXT5_EXT
			} else return null
		if (n === xo || n === vo || n === Mo || n === yo)
			if (((r = t.get("WEBGL_compressed_texture_pvrtc")), r !== null)) {
				if (n === xo) return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG
				if (n === vo) return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG
				if (n === Mo) return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG
				if (n === yo) return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG
			} else return null
		if (n === So || n === Eo || n === bo)
			if (((r = t.get("WEBGL_compressed_texture_etc")), r !== null)) {
				if (n === So || n === Eo)
					return o === Jt ? r.COMPRESSED_SRGB8_ETC2 : r.COMPRESSED_RGB8_ETC2
				if (n === bo)
					return o === Jt
						? r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC
						: r.COMPRESSED_RGBA8_ETC2_EAC
			} else return null
		if (
			n === To ||
			n === Ao ||
			n === wo ||
			n === Ro ||
			n === Co ||
			n === Po ||
			n === Do ||
			n === Lo ||
			n === Io ||
			n === Uo ||
			n === No ||
			n === Fo ||
			n === Oo ||
			n === Bo
		)
			if (((r = t.get("WEBGL_compressed_texture_astc")), r !== null)) {
				if (n === To)
					return o === Jt
						? r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR
						: r.COMPRESSED_RGBA_ASTC_4x4_KHR
				if (n === Ao)
					return o === Jt
						? r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR
						: r.COMPRESSED_RGBA_ASTC_5x4_KHR
				if (n === wo)
					return o === Jt
						? r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR
						: r.COMPRESSED_RGBA_ASTC_5x5_KHR
				if (n === Ro)
					return o === Jt
						? r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR
						: r.COMPRESSED_RGBA_ASTC_6x5_KHR
				if (n === Co)
					return o === Jt
						? r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR
						: r.COMPRESSED_RGBA_ASTC_6x6_KHR
				if (n === Po)
					return o === Jt
						? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR
						: r.COMPRESSED_RGBA_ASTC_8x5_KHR
				if (n === Do)
					return o === Jt
						? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR
						: r.COMPRESSED_RGBA_ASTC_8x6_KHR
				if (n === Lo)
					return o === Jt
						? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR
						: r.COMPRESSED_RGBA_ASTC_8x8_KHR
				if (n === Io)
					return o === Jt
						? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR
						: r.COMPRESSED_RGBA_ASTC_10x5_KHR
				if (n === Uo)
					return o === Jt
						? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR
						: r.COMPRESSED_RGBA_ASTC_10x6_KHR
				if (n === No)
					return o === Jt
						? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR
						: r.COMPRESSED_RGBA_ASTC_10x8_KHR
				if (n === Fo)
					return o === Jt
						? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR
						: r.COMPRESSED_RGBA_ASTC_10x10_KHR
				if (n === Oo)
					return o === Jt
						? r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR
						: r.COMPRESSED_RGBA_ASTC_12x10_KHR
				if (n === Bo)
					return o === Jt
						? r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR
						: r.COMPRESSED_RGBA_ASTC_12x12_KHR
			} else return null
		if (n === zo || n === Ho || n === ko)
			if (((r = t.get("EXT_texture_compression_bptc")), r !== null)) {
				if (n === zo)
					return o === Jt
						? r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT
						: r.COMPRESSED_RGBA_BPTC_UNORM_EXT
				if (n === Ho) return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT
				if (n === ko) return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT
			} else return null
		if (n === Go || n === Vo || n === Wo || n === Xo)
			if (((r = t.get("EXT_texture_compression_rgtc")), r !== null)) {
				if (n === Go) return r.COMPRESSED_RED_RGTC1_EXT
				if (n === Vo) return r.COMPRESSED_SIGNED_RED_RGTC1_EXT
				if (n === Wo) return r.COMPRESSED_RED_GREEN_RGTC2_EXT
				if (n === Xo) return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT
			} else return null
		return n === as ? i.UNSIGNED_INT_24_8 : i[n] !== void 0 ? i[n] : null
	}
	return { convert: e }
}
const Km = `
void main() {

	gl_Position = vec4( position, 1.0 );

}`,
	Zm = `
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`
class $m {
	constructor() {
		;(this.texture = null),
			(this.mesh = null),
			(this.depthNear = 0),
			(this.depthFar = 0)
	}
	init(t, e) {
		if (this.texture === null) {
			const n = new fc(t.texture)
			;(t.depthNear !== e.depthNear || t.depthFar !== e.depthFar) &&
				((this.depthNear = t.depthNear), (this.depthFar = t.depthFar)),
				(this.texture = n)
		}
	}
	getMesh(t) {
		if (this.texture !== null && this.mesh === null) {
			const e = t.cameras[0].viewport,
				n = new $n({
					vertexShader: Km,
					fragmentShader: Zm,
					uniforms: {
						depthColor: { value: this.texture },
						depthWidth: { value: e.z },
						depthHeight: { value: e.w },
					},
				})
			this.mesh = new Zt(new Sn(20, 20), n)
		}
		return this.mesh
	}
	reset() {
		;(this.texture = null), (this.mesh = null)
	}
	getDepthTexture() {
		return this.texture
	}
}
class Jm extends pi {
	constructor(t, e) {
		super()
		const n = this
		let s = null,
			r = 1,
			o = null,
			a = "local-floor",
			h = 1,
			l = null,
			d = null,
			c = null,
			f = null,
			m = null,
			g = null
		const _ = typeof XRWebGLBinding < "u",
			p = new $m(),
			u = {},
			b = e.getContextAttributes()
		let T = null,
			S = null
		const C = [],
			w = [],
			E = new Dt()
		let D = null
		const v = new je()
		v.viewport = new de()
		const y = new je()
		y.viewport = new de()
		const R = [v, y],
			L = new gu()
		let N = null,
			z = null
		;(this.cameraAutoUpdate = !0),
			(this.enabled = !1),
			(this.isPresenting = !1),
			(this.getController = function (q) {
				let $ = C[q]
				return (
					$ === void 0 && (($ = new Yr()), (C[q] = $)), $.getTargetRaySpace()
				)
			}),
			(this.getControllerGrip = function (q) {
				let $ = C[q]
				return $ === void 0 && (($ = new Yr()), (C[q] = $)), $.getGripSpace()
			}),
			(this.getHand = function (q) {
				let $ = C[q]
				return $ === void 0 && (($ = new Yr()), (C[q] = $)), $.getHandSpace()
			})
		function H(q) {
			const $ = w.indexOf(q.inputSource)
			if ($ === -1) return
			const ft = C[$]
			ft !== void 0 &&
				(ft.update(q.inputSource, q.frame, l || o),
				ft.dispatchEvent({ type: q.type, data: q.inputSource }))
		}
		function W() {
			s.removeEventListener("select", H),
				s.removeEventListener("selectstart", H),
				s.removeEventListener("selectend", H),
				s.removeEventListener("squeeze", H),
				s.removeEventListener("squeezestart", H),
				s.removeEventListener("squeezeend", H),
				s.removeEventListener("end", W),
				s.removeEventListener("inputsourceschange", j)
			for (let q = 0; q < C.length; q++) {
				const $ = w[q]
				$ !== null && ((w[q] = null), C[q].disconnect($))
			}
			;(N = null), (z = null), p.reset()
			for (const q in u) delete u[q]
			t.setRenderTarget(T),
				(m = null),
				(f = null),
				(c = null),
				(s = null),
				(S = null),
				jt.stop(),
				(n.isPresenting = !1),
				t.setPixelRatio(D),
				t.setSize(E.width, E.height, !1),
				n.dispatchEvent({ type: "sessionend" })
		}
		;(this.setFramebufferScaleFactor = function (q) {
			;(r = q),
				n.isPresenting === !0 &&
					console.warn(
						"THREE.WebXRManager: Cannot change framebuffer scale while presenting."
					)
		}),
			(this.setReferenceSpaceType = function (q) {
				;(a = q),
					n.isPresenting === !0 &&
						console.warn(
							"THREE.WebXRManager: Cannot change reference space type while presenting."
						)
			}),
			(this.getReferenceSpace = function () {
				return l || o
			}),
			(this.setReferenceSpace = function (q) {
				l = q
			}),
			(this.getBaseLayer = function () {
				return f !== null ? f : m
			}),
			(this.getBinding = function () {
				return c === null && _ && (c = new XRWebGLBinding(s, e)), c
			}),
			(this.getFrame = function () {
				return g
			}),
			(this.getSession = function () {
				return s
			}),
			(this.setSession = async function (q) {
				if (((s = q), s !== null)) {
					if (
						((T = t.getRenderTarget()),
						s.addEventListener("select", H),
						s.addEventListener("selectstart", H),
						s.addEventListener("selectend", H),
						s.addEventListener("squeeze", H),
						s.addEventListener("squeezestart", H),
						s.addEventListener("squeezeend", H),
						s.addEventListener("end", W),
						s.addEventListener("inputsourceschange", j),
						b.xrCompatible !== !0 && (await e.makeXRCompatible()),
						(D = t.getPixelRatio()),
						t.getSize(E),
						_ && "createProjectionLayer" in XRWebGLBinding.prototype)
					) {
						let ft = null,
							Pt = null,
							St = null
						b.depth &&
							((St = b.stencil ? e.DEPTH24_STENCIL8 : e.DEPTH_COMPONENT24),
							(ft = b.stencil ? cs : ls),
							(Pt = b.stencil ? as : ui))
						const Gt = { colorFormat: e.RGBA8, depthFormat: St, scaleFactor: r }
						;(c = this.getBinding()),
							(f = c.createProjectionLayer(Gt)),
							s.updateRenderState({ layers: [f] }),
							t.setPixelRatio(1),
							t.setSize(f.textureWidth, f.textureHeight, !1),
							(S = new di(f.textureWidth, f.textureHeight, {
								format: on,
								type: Mn,
								depthTexture: new dc(
									f.textureWidth,
									f.textureHeight,
									Pt,
									void 0,
									void 0,
									void 0,
									void 0,
									void 0,
									void 0,
									ft
								),
								stencilBuffer: b.stencil,
								colorSpace: t.outputColorSpace,
								samples: b.antialias ? 4 : 0,
								resolveDepthBuffer: f.ignoreDepthValues === !1,
								resolveStencilBuffer: f.ignoreDepthValues === !1,
							}))
					} else {
						const ft = {
							antialias: b.antialias,
							alpha: !0,
							depth: b.depth,
							stencil: b.stencil,
							framebufferScaleFactor: r,
						}
						;(m = new XRWebGLLayer(s, e, ft)),
							s.updateRenderState({ baseLayer: m }),
							t.setPixelRatio(1),
							t.setSize(m.framebufferWidth, m.framebufferHeight, !1),
							(S = new di(m.framebufferWidth, m.framebufferHeight, {
								format: on,
								type: Mn,
								colorSpace: t.outputColorSpace,
								stencilBuffer: b.stencil,
								resolveDepthBuffer: m.ignoreDepthValues === !1,
								resolveStencilBuffer: m.ignoreDepthValues === !1,
							}))
					}
					;(S.isXRRenderTarget = !0),
						this.setFoveation(h),
						(l = null),
						(o = await s.requestReferenceSpace(a)),
						jt.setContext(s),
						jt.start(),
						(n.isPresenting = !0),
						n.dispatchEvent({ type: "sessionstart" })
				}
			}),
			(this.getEnvironmentBlendMode = function () {
				if (s !== null) return s.environmentBlendMode
			}),
			(this.getDepthTexture = function () {
				return p.getDepthTexture()
			})
		function j(q) {
			for (let $ = 0; $ < q.removed.length; $++) {
				const ft = q.removed[$],
					Pt = w.indexOf(ft)
				Pt >= 0 && ((w[Pt] = null), C[Pt].disconnect(ft))
			}
			for (let $ = 0; $ < q.added.length; $++) {
				const ft = q.added[$]
				let Pt = w.indexOf(ft)
				if (Pt === -1) {
					for (let Gt = 0; Gt < C.length; Gt++)
						if (Gt >= w.length) {
							w.push(ft), (Pt = Gt)
							break
						} else if (w[Gt] === null) {
							;(w[Gt] = ft), (Pt = Gt)
							break
						}
					if (Pt === -1) break
				}
				const St = C[Pt]
				St && St.connect(ft)
			}
		}
		const V = new U(),
			rt = new U()
		function ht(q, $, ft) {
			V.setFromMatrixPosition($.matrixWorld),
				rt.setFromMatrixPosition(ft.matrixWorld)
			const Pt = V.distanceTo(rt),
				St = $.projectionMatrix.elements,
				Gt = ft.projectionMatrix.elements,
				we = St[14] / (St[10] - 1),
				P = St[14] / (St[10] + 1),
				re = (St[9] + 1) / St[5],
				It = (St[9] - 1) / St[5],
				Rt = (St[8] - 1) / St[0],
				gt = (Gt[8] + 1) / Gt[0],
				oe = we * Rt,
				_t = we * gt,
				Ft = Pt / (-Rt + gt),
				Se = Ft * -Rt
			if (
				($.matrixWorld.decompose(q.position, q.quaternion, q.scale),
				q.translateX(Se),
				q.translateZ(Ft),
				q.matrixWorld.compose(q.position, q.quaternion, q.scale),
				q.matrixWorldInverse.copy(q.matrixWorld).invert(),
				St[10] === -1)
			)
				q.projectionMatrix.copy($.projectionMatrix),
					q.projectionMatrixInverse.copy($.projectionMatrixInverse)
			else {
				const fe = we + Ft,
					A = P + Ft,
					x = oe - Se,
					B = _t + (Pt - Se),
					Y = ((re * P) / A) * fe,
					Z = ((It * P) / A) * fe
				q.projectionMatrix.makePerspective(x, B, Y, Z, fe, A),
					q.projectionMatrixInverse.copy(q.projectionMatrix).invert()
			}
		}
		function Et(q, $) {
			$ === null
				? q.matrixWorld.copy(q.matrix)
				: q.matrixWorld.multiplyMatrices($.matrixWorld, q.matrix),
				q.matrixWorldInverse.copy(q.matrixWorld).invert()
		}
		this.updateCamera = function (q) {
			if (s === null) return
			let $ = q.near,
				ft = q.far
			p.texture !== null &&
				(p.depthNear > 0 && ($ = p.depthNear),
				p.depthFar > 0 && (ft = p.depthFar)),
				(L.near = y.near = v.near = $),
				(L.far = y.far = v.far = ft),
				(N !== L.near || z !== L.far) &&
					(s.updateRenderState({ depthNear: L.near, depthFar: L.far }),
					(N = L.near),
					(z = L.far)),
				(L.layers.mask = q.layers.mask | 6),
				(v.layers.mask = L.layers.mask & 3),
				(y.layers.mask = L.layers.mask & 5)
			const Pt = q.parent,
				St = L.cameras
			Et(L, Pt)
			for (let Gt = 0; Gt < St.length; Gt++) Et(St[Gt], Pt)
			St.length === 2
				? ht(L, v, y)
				: L.projectionMatrix.copy(v.projectionMatrix),
				zt(q, L, Pt)
		}
		function zt(q, $, ft) {
			ft === null
				? q.matrix.copy($.matrixWorld)
				: (q.matrix.copy(ft.matrixWorld),
				  q.matrix.invert(),
				  q.matrix.multiply($.matrixWorld)),
				q.matrix.decompose(q.position, q.quaternion, q.scale),
				q.updateMatrixWorld(!0),
				q.projectionMatrix.copy($.projectionMatrix),
				q.projectionMatrixInverse.copy($.projectionMatrixInverse),
				q.isPerspectiveCamera &&
					((q.fov = Yo * 2 * Math.atan(1 / q.projectionMatrix.elements[5])),
					(q.zoom = 1))
		}
		;(this.getCamera = function () {
			return L
		}),
			(this.getFoveation = function () {
				if (!(f === null && m === null)) return h
			}),
			(this.setFoveation = function (q) {
				;(h = q),
					f !== null && (f.fixedFoveation = q),
					m !== null && m.fixedFoveation !== void 0 && (m.fixedFoveation = q)
			}),
			(this.hasDepthSensing = function () {
				return p.texture !== null
			}),
			(this.getDepthSensingMesh = function () {
				return p.getMesh(L)
			}),
			(this.getCameraTexture = function (q) {
				return u[q]
			})
		let ee = null
		function se(q, $) {
			if (((d = $.getViewerPose(l || o)), (g = $), d !== null)) {
				const ft = d.views
				m !== null &&
					(t.setRenderTargetFramebuffer(S, m.framebuffer), t.setRenderTarget(S))
				let Pt = !1
				ft.length !== L.cameras.length && ((L.cameras.length = 0), (Pt = !0))
				for (let P = 0; P < ft.length; P++) {
					const re = ft[P]
					let It = null
					if (m !== null) It = m.getViewport(re)
					else {
						const gt = c.getViewSubImage(f, re)
						;(It = gt.viewport),
							P === 0 &&
								(t.setRenderTargetTextures(
									S,
									gt.colorTexture,
									gt.depthStencilTexture
								),
								t.setRenderTarget(S))
					}
					let Rt = R[P]
					Rt === void 0 &&
						((Rt = new je()),
						Rt.layers.enable(P),
						(Rt.viewport = new de()),
						(R[P] = Rt)),
						Rt.matrix.fromArray(re.transform.matrix),
						Rt.matrix.decompose(Rt.position, Rt.quaternion, Rt.scale),
						Rt.projectionMatrix.fromArray(re.projectionMatrix),
						Rt.projectionMatrixInverse.copy(Rt.projectionMatrix).invert(),
						Rt.viewport.set(It.x, It.y, It.width, It.height),
						P === 0 &&
							(L.matrix.copy(Rt.matrix),
							L.matrix.decompose(L.position, L.quaternion, L.scale)),
						Pt === !0 && L.cameras.push(Rt)
				}
				const St = s.enabledFeatures
				if (
					St &&
					St.includes("depth-sensing") &&
					s.depthUsage == "gpu-optimized" &&
					_
				) {
					c = n.getBinding()
					const P = c.getDepthInformation(ft[0])
					P && P.isValid && P.texture && p.init(P, s.renderState)
				}
				if (St && St.includes("camera-access") && _) {
					t.state.unbindTexture(), (c = n.getBinding())
					for (let P = 0; P < ft.length; P++) {
						const re = ft[P].camera
						if (re) {
							let It = u[re]
							It || ((It = new fc()), (u[re] = It))
							const Rt = c.getCameraImage(re)
							It.sourceTexture = Rt
						}
					}
				}
			}
			for (let ft = 0; ft < C.length; ft++) {
				const Pt = w[ft],
					St = C[ft]
				Pt !== null && St !== void 0 && St.update(Pt, $, l || o)
			}
			ee && ee(q, $),
				$.detectedPlanes &&
					n.dispatchEvent({ type: "planesdetected", data: $ }),
				(g = null)
		}
		const jt = new xc()
		jt.setAnimationLoop(se),
			(this.setAnimationLoop = function (q) {
				ee = q
			}),
			(this.dispose = function () {})
	}
}
const ri = new yn(),
	Qm = new le()
function tg(i, t) {
	function e(p, u) {
		p.matrixAutoUpdate === !0 && p.updateMatrix(), u.value.copy(p.matrix)
	}
	function n(p, u) {
		u.color.getRGB(p.fogColor.value, sc(i)),
			u.isFog
				? ((p.fogNear.value = u.near), (p.fogFar.value = u.far))
				: u.isFogExp2 && (p.fogDensity.value = u.density)
	}
	function s(p, u, b, T, S) {
		u.isMeshBasicMaterial || u.isMeshLambertMaterial
			? r(p, u)
			: u.isMeshToonMaterial
			? (r(p, u), c(p, u))
			: u.isMeshPhongMaterial
			? (r(p, u), d(p, u))
			: u.isMeshStandardMaterial
			? (r(p, u), f(p, u), u.isMeshPhysicalMaterial && m(p, u, S))
			: u.isMeshMatcapMaterial
			? (r(p, u), g(p, u))
			: u.isMeshDepthMaterial
			? r(p, u)
			: u.isMeshDistanceMaterial
			? (r(p, u), _(p, u))
			: u.isMeshNormalMaterial
			? r(p, u)
			: u.isLineBasicMaterial
			? (o(p, u), u.isLineDashedMaterial && a(p, u))
			: u.isPointsMaterial
			? h(p, u, b, T)
			: u.isSpriteMaterial
			? l(p, u)
			: u.isShadowMaterial
			? (p.color.value.copy(u.color), (p.opacity.value = u.opacity))
			: u.isShaderMaterial && (u.uniformsNeedUpdate = !1)
	}
	function r(p, u) {
		;(p.opacity.value = u.opacity),
			u.color && p.diffuse.value.copy(u.color),
			u.emissive &&
				p.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),
			u.map && ((p.map.value = u.map), e(u.map, p.mapTransform)),
			u.alphaMap &&
				((p.alphaMap.value = u.alphaMap), e(u.alphaMap, p.alphaMapTransform)),
			u.bumpMap &&
				((p.bumpMap.value = u.bumpMap),
				e(u.bumpMap, p.bumpMapTransform),
				(p.bumpScale.value = u.bumpScale),
				u.side === Ie && (p.bumpScale.value *= -1)),
			u.normalMap &&
				((p.normalMap.value = u.normalMap),
				e(u.normalMap, p.normalMapTransform),
				p.normalScale.value.copy(u.normalScale),
				u.side === Ie && p.normalScale.value.negate()),
			u.displacementMap &&
				((p.displacementMap.value = u.displacementMap),
				e(u.displacementMap, p.displacementMapTransform),
				(p.displacementScale.value = u.displacementScale),
				(p.displacementBias.value = u.displacementBias)),
			u.emissiveMap &&
				((p.emissiveMap.value = u.emissiveMap),
				e(u.emissiveMap, p.emissiveMapTransform)),
			u.specularMap &&
				((p.specularMap.value = u.specularMap),
				e(u.specularMap, p.specularMapTransform)),
			u.alphaTest > 0 && (p.alphaTest.value = u.alphaTest)
		const b = t.get(u),
			T = b.envMap,
			S = b.envMapRotation
		T &&
			((p.envMap.value = T),
			ri.copy(S),
			(ri.x *= -1),
			(ri.y *= -1),
			(ri.z *= -1),
			T.isCubeTexture &&
				T.isRenderTargetTexture === !1 &&
				((ri.y *= -1), (ri.z *= -1)),
			p.envMapRotation.value.setFromMatrix4(Qm.makeRotationFromEuler(ri)),
			(p.flipEnvMap.value =
				T.isCubeTexture && T.isRenderTargetTexture === !1 ? -1 : 1),
			(p.reflectivity.value = u.reflectivity),
			(p.ior.value = u.ior),
			(p.refractionRatio.value = u.refractionRatio)),
			u.lightMap &&
				((p.lightMap.value = u.lightMap),
				(p.lightMapIntensity.value = u.lightMapIntensity),
				e(u.lightMap, p.lightMapTransform)),
			u.aoMap &&
				((p.aoMap.value = u.aoMap),
				(p.aoMapIntensity.value = u.aoMapIntensity),
				e(u.aoMap, p.aoMapTransform))
	}
	function o(p, u) {
		p.diffuse.value.copy(u.color),
			(p.opacity.value = u.opacity),
			u.map && ((p.map.value = u.map), e(u.map, p.mapTransform))
	}
	function a(p, u) {
		;(p.dashSize.value = u.dashSize),
			(p.totalSize.value = u.dashSize + u.gapSize),
			(p.scale.value = u.scale)
	}
	function h(p, u, b, T) {
		p.diffuse.value.copy(u.color),
			(p.opacity.value = u.opacity),
			(p.size.value = u.size * b),
			(p.scale.value = T * 0.5),
			u.map && ((p.map.value = u.map), e(u.map, p.uvTransform)),
			u.alphaMap &&
				((p.alphaMap.value = u.alphaMap), e(u.alphaMap, p.alphaMapTransform)),
			u.alphaTest > 0 && (p.alphaTest.value = u.alphaTest)
	}
	function l(p, u) {
		p.diffuse.value.copy(u.color),
			(p.opacity.value = u.opacity),
			(p.rotation.value = u.rotation),
			u.map && ((p.map.value = u.map), e(u.map, p.mapTransform)),
			u.alphaMap &&
				((p.alphaMap.value = u.alphaMap), e(u.alphaMap, p.alphaMapTransform)),
			u.alphaTest > 0 && (p.alphaTest.value = u.alphaTest)
	}
	function d(p, u) {
		p.specular.value.copy(u.specular),
			(p.shininess.value = Math.max(u.shininess, 1e-4))
	}
	function c(p, u) {
		u.gradientMap && (p.gradientMap.value = u.gradientMap)
	}
	function f(p, u) {
		;(p.metalness.value = u.metalness),
			u.metalnessMap &&
				((p.metalnessMap.value = u.metalnessMap),
				e(u.metalnessMap, p.metalnessMapTransform)),
			(p.roughness.value = u.roughness),
			u.roughnessMap &&
				((p.roughnessMap.value = u.roughnessMap),
				e(u.roughnessMap, p.roughnessMapTransform)),
			u.envMap && (p.envMapIntensity.value = u.envMapIntensity)
	}
	function m(p, u, b) {
		;(p.ior.value = u.ior),
			u.sheen > 0 &&
				(p.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),
				(p.sheenRoughness.value = u.sheenRoughness),
				u.sheenColorMap &&
					((p.sheenColorMap.value = u.sheenColorMap),
					e(u.sheenColorMap, p.sheenColorMapTransform)),
				u.sheenRoughnessMap &&
					((p.sheenRoughnessMap.value = u.sheenRoughnessMap),
					e(u.sheenRoughnessMap, p.sheenRoughnessMapTransform))),
			u.clearcoat > 0 &&
				((p.clearcoat.value = u.clearcoat),
				(p.clearcoatRoughness.value = u.clearcoatRoughness),
				u.clearcoatMap &&
					((p.clearcoatMap.value = u.clearcoatMap),
					e(u.clearcoatMap, p.clearcoatMapTransform)),
				u.clearcoatRoughnessMap &&
					((p.clearcoatRoughnessMap.value = u.clearcoatRoughnessMap),
					e(u.clearcoatRoughnessMap, p.clearcoatRoughnessMapTransform)),
				u.clearcoatNormalMap &&
					((p.clearcoatNormalMap.value = u.clearcoatNormalMap),
					e(u.clearcoatNormalMap, p.clearcoatNormalMapTransform),
					p.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),
					u.side === Ie && p.clearcoatNormalScale.value.negate())),
			u.dispersion > 0 && (p.dispersion.value = u.dispersion),
			u.iridescence > 0 &&
				((p.iridescence.value = u.iridescence),
				(p.iridescenceIOR.value = u.iridescenceIOR),
				(p.iridescenceThicknessMinimum.value = u.iridescenceThicknessRange[0]),
				(p.iridescenceThicknessMaximum.value = u.iridescenceThicknessRange[1]),
				u.iridescenceMap &&
					((p.iridescenceMap.value = u.iridescenceMap),
					e(u.iridescenceMap, p.iridescenceMapTransform)),
				u.iridescenceThicknessMap &&
					((p.iridescenceThicknessMap.value = u.iridescenceThicknessMap),
					e(u.iridescenceThicknessMap, p.iridescenceThicknessMapTransform))),
			u.transmission > 0 &&
				((p.transmission.value = u.transmission),
				(p.transmissionSamplerMap.value = b.texture),
				p.transmissionSamplerSize.value.set(b.width, b.height),
				u.transmissionMap &&
					((p.transmissionMap.value = u.transmissionMap),
					e(u.transmissionMap, p.transmissionMapTransform)),
				(p.thickness.value = u.thickness),
				u.thicknessMap &&
					((p.thicknessMap.value = u.thicknessMap),
					e(u.thicknessMap, p.thicknessMapTransform)),
				(p.attenuationDistance.value = u.attenuationDistance),
				p.attenuationColor.value.copy(u.attenuationColor)),
			u.anisotropy > 0 &&
				(p.anisotropyVector.value.set(
					u.anisotropy * Math.cos(u.anisotropyRotation),
					u.anisotropy * Math.sin(u.anisotropyRotation)
				),
				u.anisotropyMap &&
					((p.anisotropyMap.value = u.anisotropyMap),
					e(u.anisotropyMap, p.anisotropyMapTransform))),
			(p.specularIntensity.value = u.specularIntensity),
			p.specularColor.value.copy(u.specularColor),
			u.specularColorMap &&
				((p.specularColorMap.value = u.specularColorMap),
				e(u.specularColorMap, p.specularColorMapTransform)),
			u.specularIntensityMap &&
				((p.specularIntensityMap.value = u.specularIntensityMap),
				e(u.specularIntensityMap, p.specularIntensityMapTransform))
	}
	function g(p, u) {
		u.matcap && (p.matcap.value = u.matcap)
	}
	function _(p, u) {
		const b = t.get(u).light
		p.referencePosition.value.setFromMatrixPosition(b.matrixWorld),
			(p.nearDistance.value = b.shadow.camera.near),
			(p.farDistance.value = b.shadow.camera.far)
	}
	return { refreshFogUniforms: n, refreshMaterialUniforms: s }
}
function eg(i, t, e, n) {
	let s = {},
		r = {},
		o = []
	const a = i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS)
	function h(b, T) {
		const S = T.program
		n.uniformBlockBinding(b, S)
	}
	function l(b, T) {
		let S = s[b.id]
		S === void 0 &&
			(g(b), (S = d(b)), (s[b.id] = S), b.addEventListener("dispose", p))
		const C = T.program
		n.updateUBOMapping(b, C)
		const w = t.render.frame
		r[b.id] !== w && (f(b), (r[b.id] = w))
	}
	function d(b) {
		const T = c()
		b.__bindingPointIndex = T
		const S = i.createBuffer(),
			C = b.__size,
			w = b.usage
		return (
			i.bindBuffer(i.UNIFORM_BUFFER, S),
			i.bufferData(i.UNIFORM_BUFFER, C, w),
			i.bindBuffer(i.UNIFORM_BUFFER, null),
			i.bindBufferBase(i.UNIFORM_BUFFER, T, S),
			S
		)
	}
	function c() {
		for (let b = 0; b < a; b++) if (o.indexOf(b) === -1) return o.push(b), b
		return (
			console.error(
				"THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."
			),
			0
		)
	}
	function f(b) {
		const T = s[b.id],
			S = b.uniforms,
			C = b.__cache
		i.bindBuffer(i.UNIFORM_BUFFER, T)
		for (let w = 0, E = S.length; w < E; w++) {
			const D = Array.isArray(S[w]) ? S[w] : [S[w]]
			for (let v = 0, y = D.length; v < y; v++) {
				const R = D[v]
				if (m(R, w, v, C) === !0) {
					const L = R.__offset,
						N = Array.isArray(R.value) ? R.value : [R.value]
					let z = 0
					for (let H = 0; H < N.length; H++) {
						const W = N[H],
							j = _(W)
						typeof W == "number" || typeof W == "boolean"
							? ((R.__data[0] = W),
							  i.bufferSubData(i.UNIFORM_BUFFER, L + z, R.__data))
							: W.isMatrix3
							? ((R.__data[0] = W.elements[0]),
							  (R.__data[1] = W.elements[1]),
							  (R.__data[2] = W.elements[2]),
							  (R.__data[3] = 0),
							  (R.__data[4] = W.elements[3]),
							  (R.__data[5] = W.elements[4]),
							  (R.__data[6] = W.elements[5]),
							  (R.__data[7] = 0),
							  (R.__data[8] = W.elements[6]),
							  (R.__data[9] = W.elements[7]),
							  (R.__data[10] = W.elements[8]),
							  (R.__data[11] = 0))
							: (W.toArray(R.__data, z),
							  (z += j.storage / Float32Array.BYTES_PER_ELEMENT))
					}
					i.bufferSubData(i.UNIFORM_BUFFER, L, R.__data)
				}
			}
		}
		i.bindBuffer(i.UNIFORM_BUFFER, null)
	}
	function m(b, T, S, C) {
		const w = b.value,
			E = T + "_" + S
		if (C[E] === void 0)
			return (
				typeof w == "number" || typeof w == "boolean"
					? (C[E] = w)
					: (C[E] = w.clone()),
				!0
			)
		{
			const D = C[E]
			if (typeof w == "number" || typeof w == "boolean") {
				if (D !== w) return (C[E] = w), !0
			} else if (D.equals(w) === !1) return D.copy(w), !0
		}
		return !1
	}
	function g(b) {
		const T = b.uniforms
		let S = 0
		const C = 16
		for (let E = 0, D = T.length; E < D; E++) {
			const v = Array.isArray(T[E]) ? T[E] : [T[E]]
			for (let y = 0, R = v.length; y < R; y++) {
				const L = v[y],
					N = Array.isArray(L.value) ? L.value : [L.value]
				for (let z = 0, H = N.length; z < H; z++) {
					const W = N[z],
						j = _(W),
						V = S % C,
						rt = V % j.boundary,
						ht = V + rt
					;(S += rt),
						ht !== 0 && C - ht < j.storage && (S += C - ht),
						(L.__data = new Float32Array(
							j.storage / Float32Array.BYTES_PER_ELEMENT
						)),
						(L.__offset = S),
						(S += j.storage)
				}
			}
		}
		const w = S % C
		return w > 0 && (S += C - w), (b.__size = S), (b.__cache = {}), this
	}
	function _(b) {
		const T = { boundary: 0, storage: 0 }
		return (
			typeof b == "number" || typeof b == "boolean"
				? ((T.boundary = 4), (T.storage = 4))
				: b.isVector2
				? ((T.boundary = 8), (T.storage = 8))
				: b.isVector3 || b.isColor
				? ((T.boundary = 16), (T.storage = 12))
				: b.isVector4
				? ((T.boundary = 16), (T.storage = 16))
				: b.isMatrix3
				? ((T.boundary = 48), (T.storage = 48))
				: b.isMatrix4
				? ((T.boundary = 64), (T.storage = 64))
				: b.isTexture
				? console.warn(
						"THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."
				  )
				: console.warn(
						"THREE.WebGLRenderer: Unsupported uniform value type.",
						b
				  ),
			T
		)
	}
	function p(b) {
		const T = b.target
		T.removeEventListener("dispose", p)
		const S = o.indexOf(T.__bindingPointIndex)
		o.splice(S, 1), i.deleteBuffer(s[T.id]), delete s[T.id], delete r[T.id]
	}
	function u() {
		for (const b in s) i.deleteBuffer(s[b])
		;(o = []), (s = {}), (r = {})
	}
	return { bind: h, update: l, dispose: u }
}
class Ec {
	constructor(t = {}) {
		const {
			canvas: e = Nh(),
			context: n = null,
			depth: s = !0,
			stencil: r = !1,
			alpha: o = !1,
			antialias: a = !1,
			premultipliedAlpha: h = !0,
			preserveDrawingBuffer: l = !1,
			powerPreference: d = "default",
			failIfMajorPerformanceCaveat: c = !1,
			reversedDepthBuffer: f = !1,
		} = t
		this.isWebGLRenderer = !0
		let m
		if (n !== null) {
			if (
				typeof WebGLRenderingContext < "u" &&
				n instanceof WebGLRenderingContext
			)
				throw new Error(
					"THREE.WebGLRenderer: WebGL 1 is not supported since r163."
				)
			m = n.getContextAttributes().alpha
		} else m = o
		const g = new Uint32Array(4),
			_ = new Int32Array(4)
		let p = null,
			u = null
		const b = [],
			T = []
		;(this.domElement = e),
			(this.debug = { checkShaderErrors: !0, onShaderError: null }),
			(this.autoClear = !0),
			(this.autoClearColor = !0),
			(this.autoClearDepth = !0),
			(this.autoClearStencil = !0),
			(this.sortObjects = !0),
			(this.clippingPlanes = []),
			(this.localClippingEnabled = !1),
			(this.toneMapping = Yn),
			(this.toneMappingExposure = 1),
			(this.transmissionResolutionScale = 1)
		const S = this
		let C = !1
		this._outputColorSpace = en
		let w = 0,
			E = 0,
			D = null,
			v = -1,
			y = null
		const R = new de(),
			L = new de()
		let N = null
		const z = new Bt(0)
		let H = 0,
			W = e.width,
			j = e.height,
			V = 1,
			rt = null,
			ht = null
		const Et = new de(0, 0, W, j),
			zt = new de(0, 0, W, j)
		let ee = !1
		const se = new ra()
		let jt = !1,
			q = !1
		const $ = new le(),
			ft = new U(),
			Pt = new de(),
			St = {
				background: null,
				fog: null,
				environment: null,
				overrideMaterial: null,
				isScene: !0,
			}
		let Gt = !1
		function we() {
			return D === null ? V : 1
		}
		let P = n
		function re(M, F) {
			return e.getContext(M, F)
		}
		try {
			const M = {
				alpha: !0,
				depth: s,
				stencil: r,
				antialias: a,
				premultipliedAlpha: h,
				preserveDrawingBuffer: l,
				powerPreference: d,
				failIfMajorPerformanceCaveat: c,
			}
			if (
				("setAttribute" in e &&
					e.setAttribute("data-engine", `three.js r${Zo}`),
				e.addEventListener("webglcontextlost", st, !1),
				e.addEventListener("webglcontextrestored", dt, !1),
				e.addEventListener("webglcontextcreationerror", J, !1),
				P === null)
			) {
				const F = "webgl2"
				if (((P = re(F, M)), P === null))
					throw re(F)
						? new Error(
								"Error creating WebGL context with your selected attributes."
						  )
						: new Error("Error creating WebGL context.")
			}
		} catch (M) {
			throw (console.error("THREE.WebGLRenderer: " + M.message), M)
		}
		let It,
			Rt,
			gt,
			oe,
			_t,
			Ft,
			Se,
			fe,
			A,
			x,
			B,
			Y,
			Z,
			X,
			yt,
			it,
			xt,
			vt,
			tt,
			ct,
			wt,
			Mt,
			at,
			Ut
		function I() {
			;(It = new dp(P)),
				It.init(),
				(Mt = new jm(P, It)),
				(Rt = new rp(P, It, t, Mt)),
				(gt = new Ym(P, It)),
				Rt.reversedDepthBuffer && f && gt.buffers.depth.setReversed(!0),
				(oe = new mp(P)),
				(_t = new Im()),
				(Ft = new qm(P, It, gt, _t, Rt, Mt, oe)),
				(Se = new ap(S)),
				(fe = new up(S)),
				(A = new Mu(P)),
				(at = new ip(P, A)),
				(x = new fp(P, A, oe, at)),
				(B = new _p(P, x, A, oe)),
				(tt = new gp(P, Rt, Ft)),
				(it = new op(_t)),
				(Y = new Lm(S, Se, fe, It, Rt, at, it)),
				(Z = new tg(S, _t)),
				(X = new Nm()),
				(yt = new km(It)),
				(vt = new np(S, Se, fe, gt, B, m, h)),
				(xt = new Wm(S, B, Rt)),
				(Ut = new eg(P, oe, Rt, gt)),
				(ct = new sp(P, It, oe)),
				(wt = new pp(P, It, oe)),
				(oe.programs = Y.programs),
				(S.capabilities = Rt),
				(S.extensions = It),
				(S.properties = _t),
				(S.renderLists = X),
				(S.shadowMap = xt),
				(S.state = gt),
				(S.info = oe)
		}
		I()
		const et = new Jm(S, P)
		;(this.xr = et),
			(this.getContext = function () {
				return P
			}),
			(this.getContextAttributes = function () {
				return P.getContextAttributes()
			}),
			(this.forceContextLoss = function () {
				const M = It.get("WEBGL_lose_context")
				M && M.loseContext()
			}),
			(this.forceContextRestore = function () {
				const M = It.get("WEBGL_lose_context")
				M && M.restoreContext()
			}),
			(this.getPixelRatio = function () {
				return V
			}),
			(this.setPixelRatio = function (M) {
				M !== void 0 && ((V = M), this.setSize(W, j, !1))
			}),
			(this.getSize = function (M) {
				return M.set(W, j)
			}),
			(this.setSize = function (M, F, k = !0) {
				if (et.isPresenting) {
					console.warn(
						"THREE.WebGLRenderer: Can't change size while VR device is presenting."
					)
					return
				}
				;(W = M),
					(j = F),
					(e.width = Math.floor(M * V)),
					(e.height = Math.floor(F * V)),
					k === !0 && ((e.style.width = M + "px"), (e.style.height = F + "px")),
					this.setViewport(0, 0, M, F)
			}),
			(this.getDrawingBufferSize = function (M) {
				return M.set(W * V, j * V).floor()
			}),
			(this.setDrawingBufferSize = function (M, F, k) {
				;(W = M),
					(j = F),
					(V = k),
					(e.width = Math.floor(M * k)),
					(e.height = Math.floor(F * k)),
					this.setViewport(0, 0, M, F)
			}),
			(this.getCurrentViewport = function (M) {
				return M.copy(R)
			}),
			(this.getViewport = function (M) {
				return M.copy(Et)
			}),
			(this.setViewport = function (M, F, k, G) {
				M.isVector4 ? Et.set(M.x, M.y, M.z, M.w) : Et.set(M, F, k, G),
					gt.viewport(R.copy(Et).multiplyScalar(V).round())
			}),
			(this.getScissor = function (M) {
				return M.copy(zt)
			}),
			(this.setScissor = function (M, F, k, G) {
				M.isVector4 ? zt.set(M.x, M.y, M.z, M.w) : zt.set(M, F, k, G),
					gt.scissor(L.copy(zt).multiplyScalar(V).round())
			}),
			(this.getScissorTest = function () {
				return ee
			}),
			(this.setScissorTest = function (M) {
				gt.setScissorTest((ee = M))
			}),
			(this.setOpaqueSort = function (M) {
				rt = M
			}),
			(this.setTransparentSort = function (M) {
				ht = M
			}),
			(this.getClearColor = function (M) {
				return M.copy(vt.getClearColor())
			}),
			(this.setClearColor = function () {
				vt.setClearColor(...arguments)
			}),
			(this.getClearAlpha = function () {
				return vt.getClearAlpha()
			}),
			(this.setClearAlpha = function () {
				vt.setClearAlpha(...arguments)
			}),
			(this.clear = function (M = !0, F = !0, k = !0) {
				let G = 0
				if (M) {
					let O = !1
					if (D !== null) {
						const Q = D.texture.format
						O = Q === na || Q === ea || Q === ta
					}
					if (O) {
						const Q = D.texture.type,
							lt =
								Q === Mn ||
								Q === ui ||
								Q === os ||
								Q === as ||
								Q === Jo ||
								Q === Qo,
							pt = vt.getClearColor(),
							ut = vt.getClearAlpha(),
							At = pt.r,
							Ct = pt.g,
							bt = pt.b
						lt
							? ((g[0] = At),
							  (g[1] = Ct),
							  (g[2] = bt),
							  (g[3] = ut),
							  P.clearBufferuiv(P.COLOR, 0, g))
							: ((_[0] = At),
							  (_[1] = Ct),
							  (_[2] = bt),
							  (_[3] = ut),
							  P.clearBufferiv(P.COLOR, 0, _))
					} else G |= P.COLOR_BUFFER_BIT
				}
				F && (G |= P.DEPTH_BUFFER_BIT),
					k &&
						((G |= P.STENCIL_BUFFER_BIT),
						this.state.buffers.stencil.setMask(4294967295)),
					P.clear(G)
			}),
			(this.clearColor = function () {
				this.clear(!0, !1, !1)
			}),
			(this.clearDepth = function () {
				this.clear(!1, !0, !1)
			}),
			(this.clearStencil = function () {
				this.clear(!1, !1, !0)
			}),
			(this.dispose = function () {
				e.removeEventListener("webglcontextlost", st, !1),
					e.removeEventListener("webglcontextrestored", dt, !1),
					e.removeEventListener("webglcontextcreationerror", J, !1),
					vt.dispose(),
					X.dispose(),
					yt.dispose(),
					_t.dispose(),
					Se.dispose(),
					fe.dispose(),
					B.dispose(),
					at.dispose(),
					Ut.dispose(),
					Y.dispose(),
					et.dispose(),
					et.removeEventListener("sessionstart", pn),
					et.removeEventListener("sessionend", ma),
					Jn.stop()
			})
		function st(M) {
			M.preventDefault(),
				console.log("THREE.WebGLRenderer: Context Lost."),
				(C = !0)
		}
		function dt() {
			console.log("THREE.WebGLRenderer: Context Restored."), (C = !1)
			const M = oe.autoReset,
				F = xt.enabled,
				k = xt.autoUpdate,
				G = xt.needsUpdate,
				O = xt.type
			I(),
				(oe.autoReset = M),
				(xt.enabled = F),
				(xt.autoUpdate = k),
				(xt.needsUpdate = G),
				(xt.type = O)
		}
		function J(M) {
			console.error(
				"THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",
				M.statusMessage
			)
		}
		function K(M) {
			const F = M.target
			F.removeEventListener("dispose", K), mt(F)
		}
		function mt(M) {
			Lt(M), _t.remove(M)
		}
		function Lt(M) {
			const F = _t.get(M).programs
			F !== void 0 &&
				(F.forEach(function (k) {
					Y.releaseProgram(k)
				}),
				M.isShaderMaterial && Y.releaseShaderCache(M))
		}
		this.renderBufferDirect = function (M, F, k, G, O, Q) {
			F === null && (F = St)
			const lt = O.isMesh && O.matrixWorld.determinant() < 0,
				pt = Hc(M, F, k, G, O)
			gt.setMaterial(G, lt)
			let ut = k.index,
				At = 1
			if (G.wireframe === !0) {
				if (((ut = x.getWireframeAttribute(k)), ut === void 0)) return
				At = 2
			}
			const Ct = k.drawRange,
				bt = k.attributes.position
			let kt = Ct.start * At,
				$t = (Ct.start + Ct.count) * At
			Q !== null &&
				((kt = Math.max(kt, Q.start * At)),
				($t = Math.min($t, (Q.start + Q.count) * At))),
				ut !== null
					? ((kt = Math.max(kt, 0)), ($t = Math.min($t, ut.count)))
					: bt != null &&
					  ((kt = Math.max(kt, 0)), ($t = Math.min($t, bt.count)))
			const ue = $t - kt
			if (ue < 0 || ue === 1 / 0) return
			at.setup(O, G, pt, k, ut)
			let ie,
				te = ct
			if (
				(ut !== null && ((ie = A.get(ut)), (te = wt), te.setIndex(ie)),
				O.isMesh)
			)
				G.wireframe === !0
					? (gt.setLineWidth(G.wireframeLinewidth * we()), te.setMode(P.LINES))
					: te.setMode(P.TRIANGLES)
			else if (O.isLine) {
				let Tt = G.linewidth
				Tt === void 0 && (Tt = 1),
					gt.setLineWidth(Tt * we()),
					O.isLineSegments
						? te.setMode(P.LINES)
						: O.isLineLoop
						? te.setMode(P.LINE_LOOP)
						: te.setMode(P.LINE_STRIP)
			} else
				O.isPoints
					? te.setMode(P.POINTS)
					: O.isSprite && te.setMode(P.TRIANGLES)
			if (O.isBatchedMesh)
				if (O._multiDrawInstances !== null)
					hs(
						"THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."
					),
						te.renderMultiDrawInstances(
							O._multiDrawStarts,
							O._multiDrawCounts,
							O._multiDrawCount,
							O._multiDrawInstances
						)
				else if (It.get("WEBGL_multi_draw"))
					te.renderMultiDraw(
						O._multiDrawStarts,
						O._multiDrawCounts,
						O._multiDrawCount
					)
				else {
					const Tt = O._multiDrawStarts,
						ce = O._multiDrawCounts,
						Wt = O._multiDrawCount,
						Ve = ut ? A.get(ut).bytesPerElement : 1,
						gi = _t.get(G).currentProgram.getUniforms()
					for (let We = 0; We < Wt; We++)
						gi.setValue(P, "_gl_DrawID", We), te.render(Tt[We] / Ve, ce[We])
				}
			else if (O.isInstancedMesh) te.renderInstances(kt, ue, O.count)
			else if (k.isInstancedBufferGeometry) {
				const Tt = k._maxInstanceCount !== void 0 ? k._maxInstanceCount : 1 / 0,
					ce = Math.min(k.instanceCount, Tt)
				te.renderInstances(kt, ue, ce)
			} else te.render(kt, ue)
		}
		function ne(M, F, k) {
			M.transparent === !0 && M.side === De && M.forceSinglePass === !1
				? ((M.side = Ie),
				  (M.needsUpdate = !0),
				  Ss(M, F, k),
				  (M.side = Zn),
				  (M.needsUpdate = !0),
				  Ss(M, F, k),
				  (M.side = De))
				: Ss(M, F, k)
		}
		;(this.compile = function (M, F, k = null) {
			k === null && (k = M),
				(u = yt.get(k)),
				u.init(F),
				T.push(u),
				k.traverseVisible(function (O) {
					O.isLight &&
						O.layers.test(F.layers) &&
						(u.pushLight(O), O.castShadow && u.pushShadow(O))
				}),
				M !== k &&
					M.traverseVisible(function (O) {
						O.isLight &&
							O.layers.test(F.layers) &&
							(u.pushLight(O), O.castShadow && u.pushShadow(O))
					}),
				u.setupLights()
			const G = new Set()
			return (
				M.traverse(function (O) {
					if (!(O.isMesh || O.isPoints || O.isLine || O.isSprite)) return
					const Q = O.material
					if (Q)
						if (Array.isArray(Q))
							for (let lt = 0; lt < Q.length; lt++) {
								const pt = Q[lt]
								ne(pt, k, O), G.add(pt)
							}
						else ne(Q, k, O), G.add(Q)
				}),
				(u = T.pop()),
				G
			)
		}),
			(this.compileAsync = function (M, F, k = null) {
				const G = this.compile(M, F, k)
				return new Promise((O) => {
					function Q() {
						if (
							(G.forEach(function (lt) {
								_t.get(lt).currentProgram.isReady() && G.delete(lt)
							}),
							G.size === 0)
						) {
							O(M)
							return
						}
						setTimeout(Q, 10)
					}
					It.get("KHR_parallel_shader_compile") !== null
						? Q()
						: setTimeout(Q, 10)
				})
			})
		let Kt = null
		function En(M) {
			Kt && Kt(M)
		}
		function pn() {
			Jn.stop()
		}
		function ma() {
			Jn.start()
		}
		const Jn = new xc()
		Jn.setAnimationLoop(En),
			typeof self < "u" && Jn.setContext(self),
			(this.setAnimationLoop = function (M) {
				;(Kt = M), et.setAnimationLoop(M), M === null ? Jn.stop() : Jn.start()
			}),
			et.addEventListener("sessionstart", pn),
			et.addEventListener("sessionend", ma),
			(this.render = function (M, F) {
				if (F !== void 0 && F.isCamera !== !0) {
					console.error(
						"THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera."
					)
					return
				}
				if (C === !0) return
				if (
					(M.matrixWorldAutoUpdate === !0 && M.updateMatrixWorld(),
					F.parent === null &&
						F.matrixWorldAutoUpdate === !0 &&
						F.updateMatrixWorld(),
					et.enabled === !0 &&
						et.isPresenting === !0 &&
						(et.cameraAutoUpdate === !0 && et.updateCamera(F),
						(F = et.getCamera())),
					M.isScene === !0 && M.onBeforeRender(S, M, F, D),
					(u = yt.get(M, T.length)),
					u.init(F),
					T.push(u),
					$.multiplyMatrices(F.projectionMatrix, F.matrixWorldInverse),
					se.setFromProjectionMatrix($, vn, F.reversedDepth),
					(q = this.localClippingEnabled),
					(jt = it.init(this.clippingPlanes, q)),
					(p = X.get(M, b.length)),
					p.init(),
					b.push(p),
					et.enabled === !0 && et.isPresenting === !0)
				) {
					const Q = S.xr.getDepthSensingMesh()
					Q !== null && Sr(Q, F, -1 / 0, S.sortObjects)
				}
				Sr(M, F, 0, S.sortObjects),
					p.finish(),
					S.sortObjects === !0 && p.sort(rt, ht),
					(Gt =
						et.enabled === !1 ||
						et.isPresenting === !1 ||
						et.hasDepthSensing() === !1),
					Gt && vt.addToRenderList(p, M),
					this.info.render.frame++,
					jt === !0 && it.beginShadows()
				const k = u.state.shadowsArray
				xt.render(k, M, F),
					jt === !0 && it.endShadows(),
					this.info.autoReset === !0 && this.info.reset()
				const G = p.opaque,
					O = p.transmissive
				if ((u.setupLights(), F.isArrayCamera)) {
					const Q = F.cameras
					if (O.length > 0)
						for (let lt = 0, pt = Q.length; lt < pt; lt++) {
							const ut = Q[lt]
							_a(G, O, M, ut)
						}
					Gt && vt.render(M)
					for (let lt = 0, pt = Q.length; lt < pt; lt++) {
						const ut = Q[lt]
						ga(p, M, ut, ut.viewport)
					}
				} else O.length > 0 && _a(G, O, M, F), Gt && vt.render(M), ga(p, M, F)
				D !== null &&
					E === 0 &&
					(Ft.updateMultisampleRenderTarget(D), Ft.updateRenderTargetMipmap(D)),
					M.isScene === !0 && M.onAfterRender(S, M, F),
					at.resetDefaultState(),
					(v = -1),
					(y = null),
					T.pop(),
					T.length > 0
						? ((u = T[T.length - 1]),
						  jt === !0 && it.setGlobalState(S.clippingPlanes, u.state.camera))
						: (u = null),
					b.pop(),
					b.length > 0 ? (p = b[b.length - 1]) : (p = null)
			})
		function Sr(M, F, k, G) {
			if (M.visible === !1) return
			if (M.layers.test(F.layers)) {
				if (M.isGroup) k = M.renderOrder
				else if (M.isLOD) M.autoUpdate === !0 && M.update(F)
				else if (M.isLight) u.pushLight(M), M.castShadow && u.pushShadow(M)
				else if (M.isSprite) {
					if (!M.frustumCulled || se.intersectsSprite(M)) {
						G && Pt.setFromMatrixPosition(M.matrixWorld).applyMatrix4($)
						const lt = B.update(M),
							pt = M.material
						pt.visible && p.push(M, lt, pt, k, Pt.z, null)
					}
				} else if (
					(M.isMesh || M.isLine || M.isPoints) &&
					(!M.frustumCulled || se.intersectsObject(M))
				) {
					const lt = B.update(M),
						pt = M.material
					if (
						(G &&
							(M.boundingSphere !== void 0
								? (M.boundingSphere === null && M.computeBoundingSphere(),
								  Pt.copy(M.boundingSphere.center))
								: (lt.boundingSphere === null && lt.computeBoundingSphere(),
								  Pt.copy(lt.boundingSphere.center)),
							Pt.applyMatrix4(M.matrixWorld).applyMatrix4($)),
						Array.isArray(pt))
					) {
						const ut = lt.groups
						for (let At = 0, Ct = ut.length; At < Ct; At++) {
							const bt = ut[At],
								kt = pt[bt.materialIndex]
							kt && kt.visible && p.push(M, lt, kt, k, Pt.z, bt)
						}
					} else pt.visible && p.push(M, lt, pt, k, Pt.z, null)
				}
			}
			const Q = M.children
			for (let lt = 0, pt = Q.length; lt < pt; lt++) Sr(Q[lt], F, k, G)
		}
		function ga(M, F, k, G) {
			const O = M.opaque,
				Q = M.transmissive,
				lt = M.transparent
			u.setupLightsView(k),
				jt === !0 && it.setGlobalState(S.clippingPlanes, k),
				G && gt.viewport(R.copy(G)),
				O.length > 0 && ys(O, F, k),
				Q.length > 0 && ys(Q, F, k),
				lt.length > 0 && ys(lt, F, k),
				gt.buffers.depth.setTest(!0),
				gt.buffers.depth.setMask(!0),
				gt.buffers.color.setMask(!0),
				gt.setPolygonOffset(!1)
		}
		function _a(M, F, k, G) {
			if ((k.isScene === !0 ? k.overrideMaterial : null) !== null) return
			u.state.transmissionRenderTarget[G.id] === void 0 &&
				(u.state.transmissionRenderTarget[G.id] = new di(1, 1, {
					generateMipmaps: !0,
					type:
						It.has("EXT_color_buffer_half_float") ||
						It.has("EXT_color_buffer_float")
							? ms
							: Mn,
					minFilter: Vn,
					samples: 4,
					stencilBuffer: r,
					resolveDepthBuffer: !1,
					resolveStencilBuffer: !1,
					colorSpace: Xt.workingColorSpace,
				}))
			const Q = u.state.transmissionRenderTarget[G.id],
				lt = G.viewport || R
			Q.setSize(
				lt.z * S.transmissionResolutionScale,
				lt.w * S.transmissionResolutionScale
			)
			const pt = S.getRenderTarget(),
				ut = S.getActiveCubeFace(),
				At = S.getActiveMipmapLevel()
			S.setRenderTarget(Q),
				S.getClearColor(z),
				(H = S.getClearAlpha()),
				H < 1 && S.setClearColor(16777215, 0.5),
				S.clear(),
				Gt && vt.render(k)
			const Ct = S.toneMapping
			S.toneMapping = Yn
			const bt = G.viewport
			if (
				(G.viewport !== void 0 && (G.viewport = void 0),
				u.setupLightsView(G),
				jt === !0 && it.setGlobalState(S.clippingPlanes, G),
				ys(M, k, G),
				Ft.updateMultisampleRenderTarget(Q),
				Ft.updateRenderTargetMipmap(Q),
				It.has("WEBGL_multisampled_render_to_texture") === !1)
			) {
				let kt = !1
				for (let $t = 0, ue = F.length; $t < ue; $t++) {
					const ie = F[$t],
						te = ie.object,
						Tt = ie.geometry,
						ce = ie.material,
						Wt = ie.group
					if (ce.side === De && te.layers.test(G.layers)) {
						const Ve = ce.side
						;(ce.side = Ie),
							(ce.needsUpdate = !0),
							xa(te, k, G, Tt, ce, Wt),
							(ce.side = Ve),
							(ce.needsUpdate = !0),
							(kt = !0)
					}
				}
				kt === !0 &&
					(Ft.updateMultisampleRenderTarget(Q), Ft.updateRenderTargetMipmap(Q))
			}
			S.setRenderTarget(pt, ut, At),
				S.setClearColor(z, H),
				bt !== void 0 && (G.viewport = bt),
				(S.toneMapping = Ct)
		}
		function ys(M, F, k) {
			const G = F.isScene === !0 ? F.overrideMaterial : null
			for (let O = 0, Q = M.length; O < Q; O++) {
				const lt = M[O],
					pt = lt.object,
					ut = lt.geometry,
					At = lt.group
				let Ct = lt.material
				Ct.allowOverride === !0 && G !== null && (Ct = G),
					pt.layers.test(k.layers) && xa(pt, F, k, ut, Ct, At)
			}
		}
		function xa(M, F, k, G, O, Q) {
			M.onBeforeRender(S, F, k, G, O, Q),
				M.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse, M.matrixWorld),
				M.normalMatrix.getNormalMatrix(M.modelViewMatrix),
				O.onBeforeRender(S, F, k, G, M, Q),
				O.transparent === !0 && O.side === De && O.forceSinglePass === !1
					? ((O.side = Ie),
					  (O.needsUpdate = !0),
					  S.renderBufferDirect(k, F, G, O, M, Q),
					  (O.side = Zn),
					  (O.needsUpdate = !0),
					  S.renderBufferDirect(k, F, G, O, M, Q),
					  (O.side = De))
					: S.renderBufferDirect(k, F, G, O, M, Q),
				M.onAfterRender(S, F, k, G, O, Q)
		}
		function Ss(M, F, k) {
			F.isScene !== !0 && (F = St)
			const G = _t.get(M),
				O = u.state.lights,
				Q = u.state.shadowsArray,
				lt = O.state.version,
				pt = Y.getParameters(M, O.state, Q, F, k),
				ut = Y.getProgramCacheKey(pt)
			let At = G.programs
			;(G.environment = M.isMeshStandardMaterial ? F.environment : null),
				(G.fog = F.fog),
				(G.envMap = (M.isMeshStandardMaterial ? fe : Se).get(
					M.envMap || G.environment
				)),
				(G.envMapRotation =
					G.environment !== null && M.envMap === null
						? F.environmentRotation
						: M.envMapRotation),
				At === void 0 &&
					(M.addEventListener("dispose", K),
					(At = new Map()),
					(G.programs = At))
			let Ct = At.get(ut)
			if (Ct !== void 0) {
				if (G.currentProgram === Ct && G.lightsStateVersion === lt)
					return Ma(M, pt), Ct
			} else
				(pt.uniforms = Y.getUniforms(M)),
					M.onBeforeCompile(pt, S),
					(Ct = Y.acquireProgram(pt, ut)),
					At.set(ut, Ct),
					(G.uniforms = pt.uniforms)
			const bt = G.uniforms
			return (
				((!M.isShaderMaterial && !M.isRawShaderMaterial) ||
					M.clipping === !0) &&
					(bt.clippingPlanes = it.uniform),
				Ma(M, pt),
				(G.needsLights = Gc(M)),
				(G.lightsStateVersion = lt),
				G.needsLights &&
					((bt.ambientLightColor.value = O.state.ambient),
					(bt.lightProbe.value = O.state.probe),
					(bt.directionalLights.value = O.state.directional),
					(bt.directionalLightShadows.value = O.state.directionalShadow),
					(bt.spotLights.value = O.state.spot),
					(bt.spotLightShadows.value = O.state.spotShadow),
					(bt.rectAreaLights.value = O.state.rectArea),
					(bt.ltc_1.value = O.state.rectAreaLTC1),
					(bt.ltc_2.value = O.state.rectAreaLTC2),
					(bt.pointLights.value = O.state.point),
					(bt.pointLightShadows.value = O.state.pointShadow),
					(bt.hemisphereLights.value = O.state.hemi),
					(bt.directionalShadowMap.value = O.state.directionalShadowMap),
					(bt.directionalShadowMatrix.value = O.state.directionalShadowMatrix),
					(bt.spotShadowMap.value = O.state.spotShadowMap),
					(bt.spotLightMatrix.value = O.state.spotLightMatrix),
					(bt.spotLightMap.value = O.state.spotLightMap),
					(bt.pointShadowMap.value = O.state.pointShadowMap),
					(bt.pointShadowMatrix.value = O.state.pointShadowMatrix)),
				(G.currentProgram = Ct),
				(G.uniformsList = null),
				Ct
			)
		}
		function va(M) {
			if (M.uniformsList === null) {
				const F = M.currentProgram.getUniforms()
				M.uniformsList = sr.seqWithValue(F.seq, M.uniforms)
			}
			return M.uniformsList
		}
		function Ma(M, F) {
			const k = _t.get(M)
			;(k.outputColorSpace = F.outputColorSpace),
				(k.batching = F.batching),
				(k.batchingColor = F.batchingColor),
				(k.instancing = F.instancing),
				(k.instancingColor = F.instancingColor),
				(k.instancingMorph = F.instancingMorph),
				(k.skinning = F.skinning),
				(k.morphTargets = F.morphTargets),
				(k.morphNormals = F.morphNormals),
				(k.morphColors = F.morphColors),
				(k.morphTargetsCount = F.morphTargetsCount),
				(k.numClippingPlanes = F.numClippingPlanes),
				(k.numIntersection = F.numClipIntersection),
				(k.vertexAlphas = F.vertexAlphas),
				(k.vertexTangents = F.vertexTangents),
				(k.toneMapping = F.toneMapping)
		}
		function Hc(M, F, k, G, O) {
			F.isScene !== !0 && (F = St), Ft.resetTextureUnits()
			const Q = F.fog,
				lt = G.isMeshStandardMaterial ? F.environment : null,
				pt =
					D === null
						? S.outputColorSpace
						: D.isXRRenderTarget === !0
						? D.texture.colorSpace
						: Gi,
				ut = (G.isMeshStandardMaterial ? fe : Se).get(G.envMap || lt),
				At =
					G.vertexColors === !0 &&
					!!k.attributes.color &&
					k.attributes.color.itemSize === 4,
				Ct = !!k.attributes.tangent && (!!G.normalMap || G.anisotropy > 0),
				bt = !!k.morphAttributes.position,
				kt = !!k.morphAttributes.normal,
				$t = !!k.morphAttributes.color
			let ue = Yn
			G.toneMapped &&
				(D === null || D.isXRRenderTarget === !0) &&
				(ue = S.toneMapping)
			const ie =
					k.morphAttributes.position ||
					k.morphAttributes.normal ||
					k.morphAttributes.color,
				te = ie !== void 0 ? ie.length : 0,
				Tt = _t.get(G),
				ce = u.state.lights
			if (jt === !0 && (q === !0 || M !== y)) {
				const Ue = M === y && G.id === v
				it.setState(G, M, Ue)
			}
			let Wt = !1
			G.version === Tt.__version
				? ((Tt.needsLights && Tt.lightsStateVersion !== ce.state.version) ||
						Tt.outputColorSpace !== pt ||
						(O.isBatchedMesh && Tt.batching === !1) ||
						(!O.isBatchedMesh && Tt.batching === !0) ||
						(O.isBatchedMesh &&
							Tt.batchingColor === !0 &&
							O.colorTexture === null) ||
						(O.isBatchedMesh &&
							Tt.batchingColor === !1 &&
							O.colorTexture !== null) ||
						(O.isInstancedMesh && Tt.instancing === !1) ||
						(!O.isInstancedMesh && Tt.instancing === !0) ||
						(O.isSkinnedMesh && Tt.skinning === !1) ||
						(!O.isSkinnedMesh && Tt.skinning === !0) ||
						(O.isInstancedMesh &&
							Tt.instancingColor === !0 &&
							O.instanceColor === null) ||
						(O.isInstancedMesh &&
							Tt.instancingColor === !1 &&
							O.instanceColor !== null) ||
						(O.isInstancedMesh &&
							Tt.instancingMorph === !0 &&
							O.morphTexture === null) ||
						(O.isInstancedMesh &&
							Tt.instancingMorph === !1 &&
							O.morphTexture !== null) ||
						Tt.envMap !== ut ||
						(G.fog === !0 && Tt.fog !== Q) ||
						(Tt.numClippingPlanes !== void 0 &&
							(Tt.numClippingPlanes !== it.numPlanes ||
								Tt.numIntersection !== it.numIntersection)) ||
						Tt.vertexAlphas !== At ||
						Tt.vertexTangents !== Ct ||
						Tt.morphTargets !== bt ||
						Tt.morphNormals !== kt ||
						Tt.morphColors !== $t ||
						Tt.toneMapping !== ue ||
						Tt.morphTargetsCount !== te) &&
				  (Wt = !0)
				: ((Wt = !0), (Tt.__version = G.version))
			let Ve = Tt.currentProgram
			Wt === !0 && (Ve = Ss(G, F, O))
			let gi = !1,
				We = !1,
				qi = !1
			const he = Ve.getUniforms(),
				Je = Tt.uniforms
			if (
				(gt.useProgram(Ve.program) && ((gi = !0), (We = !0), (qi = !0)),
				G.id !== v && ((v = G.id), (We = !0)),
				gi || y !== M)
			) {
				gt.buffers.depth.getReversed() &&
					M.reversedDepth !== !0 &&
					((M._reversedDepth = !0), M.updateProjectionMatrix()),
					he.setValue(P, "projectionMatrix", M.projectionMatrix),
					he.setValue(P, "viewMatrix", M.matrixWorldInverse)
				const ze = he.map.cameraPosition
				ze !== void 0 &&
					ze.setValue(P, ft.setFromMatrixPosition(M.matrixWorld)),
					Rt.logarithmicDepthBuffer &&
						he.setValue(
							P,
							"logDepthBufFC",
							2 / (Math.log(M.far + 1) / Math.LN2)
						),
					(G.isMeshPhongMaterial ||
						G.isMeshToonMaterial ||
						G.isMeshLambertMaterial ||
						G.isMeshBasicMaterial ||
						G.isMeshStandardMaterial ||
						G.isShaderMaterial) &&
						he.setValue(P, "isOrthographic", M.isOrthographicCamera === !0),
					y !== M && ((y = M), (We = !0), (qi = !0))
			}
			if (O.isSkinnedMesh) {
				he.setOptional(P, O, "bindMatrix"),
					he.setOptional(P, O, "bindMatrixInverse")
				const Ue = O.skeleton
				Ue &&
					(Ue.boneTexture === null && Ue.computeBoneTexture(),
					he.setValue(P, "boneTexture", Ue.boneTexture, Ft))
			}
			O.isBatchedMesh &&
				(he.setOptional(P, O, "batchingTexture"),
				he.setValue(P, "batchingTexture", O._matricesTexture, Ft),
				he.setOptional(P, O, "batchingIdTexture"),
				he.setValue(P, "batchingIdTexture", O._indirectTexture, Ft),
				he.setOptional(P, O, "batchingColorTexture"),
				O._colorsTexture !== null &&
					he.setValue(P, "batchingColorTexture", O._colorsTexture, Ft))
			const Qe = k.morphAttributes
			if (
				((Qe.position !== void 0 ||
					Qe.normal !== void 0 ||
					Qe.color !== void 0) &&
					tt.update(O, k, Ve),
				(We || Tt.receiveShadow !== O.receiveShadow) &&
					((Tt.receiveShadow = O.receiveShadow),
					he.setValue(P, "receiveShadow", O.receiveShadow)),
				G.isMeshGouraudMaterial &&
					G.envMap !== null &&
					((Je.envMap.value = ut),
					(Je.flipEnvMap.value =
						ut.isCubeTexture && ut.isRenderTargetTexture === !1 ? -1 : 1)),
				G.isMeshStandardMaterial &&
					G.envMap === null &&
					F.environment !== null &&
					(Je.envMapIntensity.value = F.environmentIntensity),
				We &&
					(he.setValue(P, "toneMappingExposure", S.toneMappingExposure),
					Tt.needsLights && kc(Je, qi),
					Q && G.fog === !0 && Z.refreshFogUniforms(Je, Q),
					Z.refreshMaterialUniforms(
						Je,
						G,
						V,
						j,
						u.state.transmissionRenderTarget[M.id]
					),
					sr.upload(P, va(Tt), Je, Ft)),
				G.isShaderMaterial &&
					G.uniformsNeedUpdate === !0 &&
					(sr.upload(P, va(Tt), Je, Ft), (G.uniformsNeedUpdate = !1)),
				G.isSpriteMaterial && he.setValue(P, "center", O.center),
				he.setValue(P, "modelViewMatrix", O.modelViewMatrix),
				he.setValue(P, "normalMatrix", O.normalMatrix),
				he.setValue(P, "modelMatrix", O.matrixWorld),
				G.isShaderMaterial || G.isRawShaderMaterial)
			) {
				const Ue = G.uniformsGroups
				for (let ze = 0, Er = Ue.length; ze < Er; ze++) {
					const Qn = Ue[ze]
					Ut.update(Qn, Ve), Ut.bind(Qn, Ve)
				}
			}
			return Ve
		}
		function kc(M, F) {
			;(M.ambientLightColor.needsUpdate = F),
				(M.lightProbe.needsUpdate = F),
				(M.directionalLights.needsUpdate = F),
				(M.directionalLightShadows.needsUpdate = F),
				(M.pointLights.needsUpdate = F),
				(M.pointLightShadows.needsUpdate = F),
				(M.spotLights.needsUpdate = F),
				(M.spotLightShadows.needsUpdate = F),
				(M.rectAreaLights.needsUpdate = F),
				(M.hemisphereLights.needsUpdate = F)
		}
		function Gc(M) {
			return (
				M.isMeshLambertMaterial ||
				M.isMeshToonMaterial ||
				M.isMeshPhongMaterial ||
				M.isMeshStandardMaterial ||
				M.isShadowMaterial ||
				(M.isShaderMaterial && M.lights === !0)
			)
		}
		;(this.getActiveCubeFace = function () {
			return w
		}),
			(this.getActiveMipmapLevel = function () {
				return E
			}),
			(this.getRenderTarget = function () {
				return D
			}),
			(this.setRenderTargetTextures = function (M, F, k) {
				const G = _t.get(M)
				;(G.__autoAllocateDepthBuffer = M.resolveDepthBuffer === !1),
					G.__autoAllocateDepthBuffer === !1 && (G.__useRenderToTexture = !1),
					(_t.get(M.texture).__webglTexture = F),
					(_t.get(M.depthTexture).__webglTexture = G.__autoAllocateDepthBuffer
						? void 0
						: k),
					(G.__hasExternalTextures = !0)
			}),
			(this.setRenderTargetFramebuffer = function (M, F) {
				const k = _t.get(M)
				;(k.__webglFramebuffer = F), (k.__useDefaultFramebuffer = F === void 0)
			})
		const Vc = P.createFramebuffer()
		;(this.setRenderTarget = function (M, F = 0, k = 0) {
			;(D = M), (w = F), (E = k)
			let G = !0,
				O = null,
				Q = !1,
				lt = !1
			if (M) {
				const ut = _t.get(M)
				if (ut.__useDefaultFramebuffer !== void 0)
					gt.bindFramebuffer(P.FRAMEBUFFER, null), (G = !1)
				else if (ut.__webglFramebuffer === void 0) Ft.setupRenderTarget(M)
				else if (ut.__hasExternalTextures)
					Ft.rebindTextures(
						M,
						_t.get(M.texture).__webglTexture,
						_t.get(M.depthTexture).__webglTexture
					)
				else if (M.depthBuffer) {
					const bt = M.depthTexture
					if (ut.__boundDepthTexture !== bt) {
						if (
							bt !== null &&
							_t.has(bt) &&
							(M.width !== bt.image.width || M.height !== bt.image.height)
						)
							throw new Error(
								"WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size."
							)
						Ft.setupDepthRenderbuffer(M)
					}
				}
				const At = M.texture
				;(At.isData3DTexture ||
					At.isDataArrayTexture ||
					At.isCompressedArrayTexture) &&
					(lt = !0)
				const Ct = _t.get(M).__webglFramebuffer
				M.isWebGLCubeRenderTarget
					? (Array.isArray(Ct[F]) ? (O = Ct[F][k]) : (O = Ct[F]), (Q = !0))
					: M.samples > 0 && Ft.useMultisampledRTT(M) === !1
					? (O = _t.get(M).__webglMultisampledFramebuffer)
					: Array.isArray(Ct)
					? (O = Ct[k])
					: (O = Ct),
					R.copy(M.viewport),
					L.copy(M.scissor),
					(N = M.scissorTest)
			} else
				R.copy(Et).multiplyScalar(V).floor(),
					L.copy(zt).multiplyScalar(V).floor(),
					(N = ee)
			if (
				(k !== 0 && (O = Vc),
				gt.bindFramebuffer(P.FRAMEBUFFER, O) && G && gt.drawBuffers(M, O),
				gt.viewport(R),
				gt.scissor(L),
				gt.setScissorTest(N),
				Q)
			) {
				const ut = _t.get(M.texture)
				P.framebufferTexture2D(
					P.FRAMEBUFFER,
					P.COLOR_ATTACHMENT0,
					P.TEXTURE_CUBE_MAP_POSITIVE_X + F,
					ut.__webglTexture,
					k
				)
			} else if (lt) {
				const ut = F
				for (let At = 0; At < M.textures.length; At++) {
					const Ct = _t.get(M.textures[At])
					P.framebufferTextureLayer(
						P.FRAMEBUFFER,
						P.COLOR_ATTACHMENT0 + At,
						Ct.__webglTexture,
						k,
						ut
					)
				}
			} else if (M !== null && k !== 0) {
				const ut = _t.get(M.texture)
				P.framebufferTexture2D(
					P.FRAMEBUFFER,
					P.COLOR_ATTACHMENT0,
					P.TEXTURE_2D,
					ut.__webglTexture,
					k
				)
			}
			v = -1
		}),
			(this.readRenderTargetPixels = function (M, F, k, G, O, Q, lt, pt = 0) {
				if (!(M && M.isWebGLRenderTarget)) {
					console.error(
						"THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget."
					)
					return
				}
				let ut = _t.get(M).__webglFramebuffer
				if ((M.isWebGLCubeRenderTarget && lt !== void 0 && (ut = ut[lt]), ut)) {
					gt.bindFramebuffer(P.FRAMEBUFFER, ut)
					try {
						const At = M.textures[pt],
							Ct = At.format,
							bt = At.type
						if (!Rt.textureFormatReadable(Ct)) {
							console.error(
								"THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format."
							)
							return
						}
						if (!Rt.textureTypeReadable(bt)) {
							console.error(
								"THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type."
							)
							return
						}
						F >= 0 &&
							F <= M.width - G &&
							k >= 0 &&
							k <= M.height - O &&
							(M.textures.length > 1 && P.readBuffer(P.COLOR_ATTACHMENT0 + pt),
							P.readPixels(F, k, G, O, Mt.convert(Ct), Mt.convert(bt), Q))
					} finally {
						const At = D !== null ? _t.get(D).__webglFramebuffer : null
						gt.bindFramebuffer(P.FRAMEBUFFER, At)
					}
				}
			}),
			(this.readRenderTargetPixelsAsync = async function (
				M,
				F,
				k,
				G,
				O,
				Q,
				lt,
				pt = 0
			) {
				if (!(M && M.isWebGLRenderTarget))
					throw new Error(
						"THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget."
					)
				let ut = _t.get(M).__webglFramebuffer
				if ((M.isWebGLCubeRenderTarget && lt !== void 0 && (ut = ut[lt]), ut))
					if (F >= 0 && F <= M.width - G && k >= 0 && k <= M.height - O) {
						gt.bindFramebuffer(P.FRAMEBUFFER, ut)
						const At = M.textures[pt],
							Ct = At.format,
							bt = At.type
						if (!Rt.textureFormatReadable(Ct))
							throw new Error(
								"THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format."
							)
						if (!Rt.textureTypeReadable(bt))
							throw new Error(
								"THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type."
							)
						const kt = P.createBuffer()
						P.bindBuffer(P.PIXEL_PACK_BUFFER, kt),
							P.bufferData(P.PIXEL_PACK_BUFFER, Q.byteLength, P.STREAM_READ),
							M.textures.length > 1 && P.readBuffer(P.COLOR_ATTACHMENT0 + pt),
							P.readPixels(F, k, G, O, Mt.convert(Ct), Mt.convert(bt), 0)
						const $t = D !== null ? _t.get(D).__webglFramebuffer : null
						gt.bindFramebuffer(P.FRAMEBUFFER, $t)
						const ue = P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE, 0)
						return (
							P.flush(),
							await Fh(P, ue, 4),
							P.bindBuffer(P.PIXEL_PACK_BUFFER, kt),
							P.getBufferSubData(P.PIXEL_PACK_BUFFER, 0, Q),
							P.deleteBuffer(kt),
							P.deleteSync(ue),
							Q
						)
					} else
						throw new Error(
							"THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range."
						)
			}),
			(this.copyFramebufferToTexture = function (M, F = null, k = 0) {
				const G = Math.pow(2, -k),
					O = Math.floor(M.image.width * G),
					Q = Math.floor(M.image.height * G),
					lt = F !== null ? F.x : 0,
					pt = F !== null ? F.y : 0
				Ft.setTexture2D(M, 0),
					P.copyTexSubImage2D(P.TEXTURE_2D, k, 0, 0, lt, pt, O, Q),
					gt.unbindTexture()
			})
		const Wc = P.createFramebuffer(),
			Xc = P.createFramebuffer()
		;(this.copyTextureToTexture = function (
			M,
			F,
			k = null,
			G = null,
			O = 0,
			Q = null
		) {
			Q === null &&
				(O !== 0
					? (hs(
							"WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."
					  ),
					  (Q = O),
					  (O = 0))
					: (Q = 0))
			let lt, pt, ut, At, Ct, bt, kt, $t, ue
			const ie = M.isCompressedTexture ? M.mipmaps[Q] : M.image
			if (k !== null)
				(lt = k.max.x - k.min.x),
					(pt = k.max.y - k.min.y),
					(ut = k.isBox3 ? k.max.z - k.min.z : 1),
					(At = k.min.x),
					(Ct = k.min.y),
					(bt = k.isBox3 ? k.min.z : 0)
			else {
				const Qe = Math.pow(2, -O)
				;(lt = Math.floor(ie.width * Qe)),
					(pt = Math.floor(ie.height * Qe)),
					M.isDataArrayTexture
						? (ut = ie.depth)
						: M.isData3DTexture
						? (ut = Math.floor(ie.depth * Qe))
						: (ut = 1),
					(At = 0),
					(Ct = 0),
					(bt = 0)
			}
			G !== null
				? ((kt = G.x), ($t = G.y), (ue = G.z))
				: ((kt = 0), ($t = 0), (ue = 0))
			const te = Mt.convert(F.format),
				Tt = Mt.convert(F.type)
			let ce
			F.isData3DTexture
				? (Ft.setTexture3D(F, 0), (ce = P.TEXTURE_3D))
				: F.isDataArrayTexture || F.isCompressedArrayTexture
				? (Ft.setTexture2DArray(F, 0), (ce = P.TEXTURE_2D_ARRAY))
				: (Ft.setTexture2D(F, 0), (ce = P.TEXTURE_2D)),
				P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL, F.flipY),
				P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL, F.premultiplyAlpha),
				P.pixelStorei(P.UNPACK_ALIGNMENT, F.unpackAlignment)
			const Wt = P.getParameter(P.UNPACK_ROW_LENGTH),
				Ve = P.getParameter(P.UNPACK_IMAGE_HEIGHT),
				gi = P.getParameter(P.UNPACK_SKIP_PIXELS),
				We = P.getParameter(P.UNPACK_SKIP_ROWS),
				qi = P.getParameter(P.UNPACK_SKIP_IMAGES)
			P.pixelStorei(P.UNPACK_ROW_LENGTH, ie.width),
				P.pixelStorei(P.UNPACK_IMAGE_HEIGHT, ie.height),
				P.pixelStorei(P.UNPACK_SKIP_PIXELS, At),
				P.pixelStorei(P.UNPACK_SKIP_ROWS, Ct),
				P.pixelStorei(P.UNPACK_SKIP_IMAGES, bt)
			const he = M.isDataArrayTexture || M.isData3DTexture,
				Je = F.isDataArrayTexture || F.isData3DTexture
			if (M.isDepthTexture) {
				const Qe = _t.get(M),
					Ue = _t.get(F),
					ze = _t.get(Qe.__renderTarget),
					Er = _t.get(Ue.__renderTarget)
				gt.bindFramebuffer(P.READ_FRAMEBUFFER, ze.__webglFramebuffer),
					gt.bindFramebuffer(P.DRAW_FRAMEBUFFER, Er.__webglFramebuffer)
				for (let Qn = 0; Qn < ut; Qn++)
					he &&
						(P.framebufferTextureLayer(
							P.READ_FRAMEBUFFER,
							P.COLOR_ATTACHMENT0,
							_t.get(M).__webglTexture,
							O,
							bt + Qn
						),
						P.framebufferTextureLayer(
							P.DRAW_FRAMEBUFFER,
							P.COLOR_ATTACHMENT0,
							_t.get(F).__webglTexture,
							Q,
							ue + Qn
						)),
						P.blitFramebuffer(
							At,
							Ct,
							lt,
							pt,
							kt,
							$t,
							lt,
							pt,
							P.DEPTH_BUFFER_BIT,
							P.NEAREST
						)
				gt.bindFramebuffer(P.READ_FRAMEBUFFER, null),
					gt.bindFramebuffer(P.DRAW_FRAMEBUFFER, null)
			} else if (O !== 0 || M.isRenderTargetTexture || _t.has(M)) {
				const Qe = _t.get(M),
					Ue = _t.get(F)
				gt.bindFramebuffer(P.READ_FRAMEBUFFER, Wc),
					gt.bindFramebuffer(P.DRAW_FRAMEBUFFER, Xc)
				for (let ze = 0; ze < ut; ze++)
					he
						? P.framebufferTextureLayer(
								P.READ_FRAMEBUFFER,
								P.COLOR_ATTACHMENT0,
								Qe.__webglTexture,
								O,
								bt + ze
						  )
						: P.framebufferTexture2D(
								P.READ_FRAMEBUFFER,
								P.COLOR_ATTACHMENT0,
								P.TEXTURE_2D,
								Qe.__webglTexture,
								O
						  ),
						Je
							? P.framebufferTextureLayer(
									P.DRAW_FRAMEBUFFER,
									P.COLOR_ATTACHMENT0,
									Ue.__webglTexture,
									Q,
									ue + ze
							  )
							: P.framebufferTexture2D(
									P.DRAW_FRAMEBUFFER,
									P.COLOR_ATTACHMENT0,
									P.TEXTURE_2D,
									Ue.__webglTexture,
									Q
							  ),
						O !== 0
							? P.blitFramebuffer(
									At,
									Ct,
									lt,
									pt,
									kt,
									$t,
									lt,
									pt,
									P.COLOR_BUFFER_BIT,
									P.NEAREST
							  )
							: Je
							? P.copyTexSubImage3D(ce, Q, kt, $t, ue + ze, At, Ct, lt, pt)
							: P.copyTexSubImage2D(ce, Q, kt, $t, At, Ct, lt, pt)
				gt.bindFramebuffer(P.READ_FRAMEBUFFER, null),
					gt.bindFramebuffer(P.DRAW_FRAMEBUFFER, null)
			} else
				Je
					? M.isDataTexture || M.isData3DTexture
						? P.texSubImage3D(ce, Q, kt, $t, ue, lt, pt, ut, te, Tt, ie.data)
						: F.isCompressedArrayTexture
						? P.compressedTexSubImage3D(
								ce,
								Q,
								kt,
								$t,
								ue,
								lt,
								pt,
								ut,
								te,
								ie.data
						  )
						: P.texSubImage3D(ce, Q, kt, $t, ue, lt, pt, ut, te, Tt, ie)
					: M.isDataTexture
					? P.texSubImage2D(P.TEXTURE_2D, Q, kt, $t, lt, pt, te, Tt, ie.data)
					: M.isCompressedTexture
					? P.compressedTexSubImage2D(
							P.TEXTURE_2D,
							Q,
							kt,
							$t,
							ie.width,
							ie.height,
							te,
							ie.data
					  )
					: P.texSubImage2D(P.TEXTURE_2D, Q, kt, $t, lt, pt, te, Tt, ie)
			P.pixelStorei(P.UNPACK_ROW_LENGTH, Wt),
				P.pixelStorei(P.UNPACK_IMAGE_HEIGHT, Ve),
				P.pixelStorei(P.UNPACK_SKIP_PIXELS, gi),
				P.pixelStorei(P.UNPACK_SKIP_ROWS, We),
				P.pixelStorei(P.UNPACK_SKIP_IMAGES, qi),
				Q === 0 && F.generateMipmaps && P.generateMipmap(ce),
				gt.unbindTexture()
		}),
			(this.initRenderTarget = function (M) {
				_t.get(M).__webglFramebuffer === void 0 && Ft.setupRenderTarget(M)
			}),
			(this.initTexture = function (M) {
				M.isCubeTexture
					? Ft.setTextureCube(M, 0)
					: M.isData3DTexture
					? Ft.setTexture3D(M, 0)
					: M.isDataArrayTexture || M.isCompressedArrayTexture
					? Ft.setTexture2DArray(M, 0)
					: Ft.setTexture2D(M, 0),
					gt.unbindTexture()
			}),
			(this.resetState = function () {
				;(w = 0), (E = 0), (D = null), gt.reset(), at.reset()
			}),
			typeof __THREE_DEVTOOLS__ < "u" &&
				__THREE_DEVTOOLS__.dispatchEvent(
					new CustomEvent("observe", { detail: this })
				)
	}
	get coordinateSystem() {
		return vn
	}
	get outputColorSpace() {
		return this._outputColorSpace
	}
	set outputColorSpace(t) {
		this._outputColorSpace = t
		const e = this.getContext()
		;(e.drawingBufferColorSpace = Xt._getDrawingBufferColorSpace(t)),
			(e.unpackColorSpace = Xt._getUnpackColorSpace())
	}
}
function ng(i, t = 1.6, e = 0.45) {
	const n = document.createElement("canvas")
	;(n.width = 1024), (n.height = 256)
	const s = n.getContext("2d")
	s.clearRect(0, 0, n.width, n.height),
		(s.fillStyle = "white"),
		(s.font = "bold 120px sans-serif"),
		(s.textAlign = "center"),
		(s.textBaseline = "middle"),
		s.fillText(i, n.width / 2, n.height / 2)
	const r = new vs(n),
		o = new Le({
			map: r,
			transparent: !0,
			side: De,
			depthWrite: !1,
			depthTest: !1,
		}),
		a = new Zt(new Sn(t, e), o)
	return (a.renderOrder = 999), a
}
function ig(i) {
	const e = window.innerWidth * 0.95,
		n = window.innerHeight * 0.75,
		s = 30,
		r = 1.5,
		o = document.createElement("canvas")
	o.width = e
	const a = o.getContext("2d")
	a.font = `${s}px sans-serif`
	let h = "",
		l = []
	i
		? typeof i == "string"
			? (l = i.split(`

`))
			: typeof i == "object" &&
			  ((h = i.heading || ""),
			  (l = Array.isArray(i.paragraphs) ? i.paragraphs : []))
		: (l = [])
	const d = []
	h && (d.push(h), d.push("")),
		l.forEach((b) => {
			const T = String(b).split(" ")
			let S = ""
			T.forEach((C) => {
				const w = S ? S + " " + C : C
				a.measureText(w).width > o.width - 60 ? (d.push(S), (S = C)) : (S = w)
			}),
				S && d.push(S),
				d.push("")
		})
	const c = d.length * s + 50,
		f = Math.max(Math.min(c, n), 120)
	;(o.height = f),
		(a.font = `${s}px sans-serif`),
		(a.fillStyle = "white"),
		(a.textAlign = "left"),
		(a.textBaseline = "top")
	let m = 20
	d.forEach((b) => {
		a.fillText(b, 30, m), b === "" ? (m += s * r) : (m += s)
	})
	const g = new vs(o),
		_ = 8,
		p = (f / e) * _,
		u = new Zt(
			new Sn(_, p),
			new Le({ map: g, transparent: !0, side: De, depthWrite: !1 })
		)
	return (
		u.position.set(0, -0.3, -1),
		(u.name = "bioPlane"),
		(u.userData._canvasTexture = g),
		u
	)
}
function sg(i, t, e, n, s, r) {
	const o = t.split(" ")
	let a = ""
	for (let h = 0; h < o.length; h++) {
		const l = a + o[h] + " "
		i.measureText(l).width > s && h > 0
			? (i.fillText(a, e, n), (a = o[h] + " "), (n += r))
			: (a = l)
	}
	i.fillText(a, e, n)
}
function rg(i) {
	const t = window.innerWidth * 0.95,
		e = window.innerHeight * 0.75,
		n = document.createElement("canvas"),
		s = n.getContext("2d"),
		r = 50,
		o = 2,
		a = (t - r * (o + 1)) / o,
		h = 320,
		l = 60,
		d = r,
		f = Math.ceil(i.length / o) * (h + l) + r,
		m = Math.min(f, e)
	;(n.width = t),
		(n.height = m),
		(s.fillStyle = "white"),
		(s.textAlign = "left"),
		(s.font = "bold 26px sans-serif")
	const g = []
	i.forEach((C, w) => {
		const E = w % o,
			D = Math.floor(w / o),
			v = r + E * (a + d),
			y = r + D * (h + l)
		;(s.strokeStyle = "#999"),
			(s.lineWidth = 2),
			s.strokeRect(v, y, a, h),
			(s.fillStyle = "white"),
			(s.font = "bold 26px sans-serif"),
			s.fillText(C.title, v + 10, y + 35),
			(s.font = "20px sans-serif"),
			sg(s, C.description, v + 10, y + 65, a - 20, 24)
		const R = v + 10,
			L = y + h - 150,
			N = a - 20,
			z = 130
		;(s.strokeStyle = "#444"),
			s.strokeRect(R, L, N, z),
			(s.fillStyle = "#ccc"),
			(s.font = "18px sans-serif"),
			s.fillText("[loading image]", R + 10, L + z / 2 - 8),
			g.push({ x: v, y, w: a, h, item: C })
		const H = new Image()
		;(H.crossOrigin = "anonymous"),
			(H.src = C.image),
			(H.onload = () => {
				s.clearRect(R, L, N, z)
				const W = Math.min(H.width / N, H.height / z),
					j = N * W,
					V = z * W,
					rt = (H.width - j) / 2,
					ht = (H.height - V) / 2
				s.drawImage(H, rt, ht, j, V, R, L, N, z), (_.needsUpdate = !0)
			}),
			(H.onerror = () => {
				;(s.fillStyle = "white"),
					s.fillText("[image missing]", R + 10, L + z / 2 - 8),
					(_.needsUpdate = !0)
			})
	})
	const _ = new vs(n)
	_.minFilter = rn
	const p = 8,
		u = (m / t) * p,
		b = new Sn(p, u),
		T = new Le({ map: _, transparent: !0, side: De, depthWrite: !1 }),
		S = new Zt(b, T)
	return (
		S.position.set(0, -0.3, -1),
		(S.name = "portfolioPlane"),
		g.forEach((C, w) => {
			const E = C.x + C.w / 2,
				D = C.y + C.h / 2,
				v = (E - t / 2) / t,
				y = (m / 2 - D) / m,
				R = v * p,
				L = y * u,
				N = (C.w / t) * p,
				z = (C.h / m) * u,
				H = new Sn(N, z),
				W = new Le({ transparent: !0, opacity: 0, side: De, depthWrite: !1 }),
				j = new Zt(H, W)
			j.position.set(R, L, -0.01),
				(j.userData.link = C.item.link),
				(j.name = `portfolioItem${w}`),
				S.add(j)
		}),
		S
	)
}
function og(i) {
	const e = window.innerWidth * 0.95,
		n = window.innerHeight * 0.75,
		s = 26,
		r = 50,
		o = 140,
		a = Array.isArray(i) ? i : [],
		l = document.createElement("canvas").getContext("2d")
	l.font = `${s}px sans-serif`
	let d = 30
	a.forEach((S) => {
		;(d += s * 1.5), (d += 18), (d += o + 10)
		const C = String(S.summary || "").split(" ")
		let w = "",
			E = 0
		C.forEach((D) => {
			const v = w ? w + " " + D : D
			l.measureText(v).width > e - 60 ? (w && E++, (w = D)) : (w = v)
		}),
			w && E++,
			(d += E * s + r)
	})
	const f = Math.min(d, n),
		m = document.createElement("canvas")
	;(m.width = e), (m.height = f)
	const g = m.getContext("2d")
	;(g.font = `${s}px sans-serif`),
		(g.fillStyle = "white"),
		(g.textAlign = "left"),
		(g.textBaseline = "top")
	let _ = 30
	a.forEach((S) => {
		if (_ > m.height - 50) return
		;(g.font = `bold ${s}px sans-serif`),
			g.fillText(String(S.title || ""), 30, _),
			(_ += s + 6),
			(g.font = `${Math.max(11, s - 8)}px sans-serif`),
			(g.fillStyle = "#bbb"),
			g.fillText(`${S.date || ""} | ${S.author || ""}`, 30, _),
			(_ += 18)
		const C = e - 60,
			w = o
		;(g.strokeStyle = "#555"),
			(g.lineWidth = 1),
			g.strokeRect(30, _, C, w),
			(g.fillStyle = "#333"),
			g.fillRect(30, _, C, w)
		const E = new Image()
		;(E.crossOrigin = "anonymous"),
			(E.src = S.image),
			(E.onload = () => {
				g.clearRect(30, _, C, w)
				const y = Math.min(E.width / C, E.height / w),
					R = C * y,
					L = w * y,
					N = (E.width - R) / 2,
					z = (E.height - L) / 2
				g.drawImage(E, N, z, R, L, 30, _, C, w), p && (p.needsUpdate = !0)
			}),
			(_ += w + 10),
			(g.font = `${s - 2}px sans-serif`),
			(g.fillStyle = "white")
		const D = String(S.summary || "").split(" ")
		let v = ""
		D.forEach((y) => {
			const R = v ? v + " " + y : y
			g.measureText(R).width > e - 60
				? (v && g.fillText(v, 30, _), (_ += s), (v = y))
				: (v = R)
		}),
			v && (g.fillText(v, 30, _), (_ += s)),
			(_ += r - s)
	})
	const p = new vs(m),
		u = 8,
		b = (m.height / m.width) * u,
		T = new Zt(
			new Sn(u, b),
			new Le({ map: p, transparent: !0, side: De, depthWrite: !1 })
		)
	return T.position.set(0, -0.3, -1), (T.name = "blogPlane"), T
}
const wl = { type: "change" },
	la = { type: "start" },
	bc = { type: "end" },
	$s = new xs(),
	Rl = new Dn(),
	ag = Math.cos(70 * Uh.DEG2RAD),
	ge = new U(),
	ke = 2 * Math.PI,
	Qt = {
		NONE: -1,
		ROTATE: 0,
		DOLLY: 1,
		PAN: 2,
		TOUCH_ROTATE: 3,
		TOUCH_PAN: 4,
		TOUCH_DOLLY_PAN: 5,
		TOUCH_DOLLY_ROTATE: 6,
	},
	io = 1e-6
class lg extends xu {
	constructor(t, e = null) {
		super(t, e),
			(this.state = Qt.NONE),
			(this.target = new U()),
			(this.cursor = new U()),
			(this.minDistance = 0),
			(this.maxDistance = 1 / 0),
			(this.minZoom = 0),
			(this.maxZoom = 1 / 0),
			(this.minTargetRadius = 0),
			(this.maxTargetRadius = 1 / 0),
			(this.minPolarAngle = 0),
			(this.maxPolarAngle = Math.PI),
			(this.minAzimuthAngle = -1 / 0),
			(this.maxAzimuthAngle = 1 / 0),
			(this.enableDamping = !1),
			(this.dampingFactor = 0.05),
			(this.enableZoom = !0),
			(this.zoomSpeed = 1),
			(this.enableRotate = !0),
			(this.rotateSpeed = 1),
			(this.keyRotateSpeed = 1),
			(this.enablePan = !0),
			(this.panSpeed = 1),
			(this.screenSpacePanning = !0),
			(this.keyPanSpeed = 7),
			(this.zoomToCursor = !1),
			(this.autoRotate = !1),
			(this.autoRotateSpeed = 2),
			(this.keys = {
				LEFT: "ArrowLeft",
				UP: "ArrowUp",
				RIGHT: "ArrowRight",
				BOTTOM: "ArrowDown",
			}),
			(this.mouseButtons = {
				LEFT: Fi.ROTATE,
				MIDDLE: Fi.DOLLY,
				RIGHT: Fi.PAN,
			}),
			(this.touches = { ONE: Ii.ROTATE, TWO: Ii.DOLLY_PAN }),
			(this.target0 = this.target.clone()),
			(this.position0 = this.object.position.clone()),
			(this.zoom0 = this.object.zoom),
			(this._domElementKeyEvents = null),
			(this._lastPosition = new U()),
			(this._lastQuaternion = new fn()),
			(this._lastTargetPosition = new U()),
			(this._quat = new fn().setFromUnitVectors(t.up, new U(0, 1, 0))),
			(this._quatInverse = this._quat.clone().invert()),
			(this._spherical = new el()),
			(this._sphericalDelta = new el()),
			(this._scale = 1),
			(this._panOffset = new U()),
			(this._rotateStart = new Dt()),
			(this._rotateEnd = new Dt()),
			(this._rotateDelta = new Dt()),
			(this._panStart = new Dt()),
			(this._panEnd = new Dt()),
			(this._panDelta = new Dt()),
			(this._dollyStart = new Dt()),
			(this._dollyEnd = new Dt()),
			(this._dollyDelta = new Dt()),
			(this._dollyDirection = new U()),
			(this._mouse = new Dt()),
			(this._performCursorZoom = !1),
			(this._pointers = []),
			(this._pointerPositions = {}),
			(this._controlActive = !1),
			(this._onPointerMove = hg.bind(this)),
			(this._onPointerDown = cg.bind(this)),
			(this._onPointerUp = ug.bind(this)),
			(this._onContextMenu = xg.bind(this)),
			(this._onMouseWheel = pg.bind(this)),
			(this._onKeyDown = mg.bind(this)),
			(this._onTouchStart = gg.bind(this)),
			(this._onTouchMove = _g.bind(this)),
			(this._onMouseDown = dg.bind(this)),
			(this._onMouseMove = fg.bind(this)),
			(this._interceptControlDown = vg.bind(this)),
			(this._interceptControlUp = Mg.bind(this)),
			this.domElement !== null && this.connect(this.domElement),
			this.update()
	}
	connect(t) {
		super.connect(t),
			this.domElement.addEventListener("pointerdown", this._onPointerDown),
			this.domElement.addEventListener("pointercancel", this._onPointerUp),
			this.domElement.addEventListener("contextmenu", this._onContextMenu),
			this.domElement.addEventListener("wheel", this._onMouseWheel, {
				passive: !1,
			}),
			this.domElement
				.getRootNode()
				.addEventListener("keydown", this._interceptControlDown, {
					passive: !0,
					capture: !0,
				}),
			(this.domElement.style.touchAction = "none")
	}
	disconnect() {
		this.domElement.removeEventListener("pointerdown", this._onPointerDown),
			this.domElement.removeEventListener("pointermove", this._onPointerMove),
			this.domElement.removeEventListener("pointerup", this._onPointerUp),
			this.domElement.removeEventListener("pointercancel", this._onPointerUp),
			this.domElement.removeEventListener("wheel", this._onMouseWheel),
			this.domElement.removeEventListener("contextmenu", this._onContextMenu),
			this.stopListenToKeyEvents(),
			this.domElement
				.getRootNode()
				.removeEventListener("keydown", this._interceptControlDown, {
					capture: !0,
				}),
			(this.domElement.style.touchAction = "auto")
	}
	dispose() {
		this.disconnect()
	}
	getPolarAngle() {
		return this._spherical.phi
	}
	getAzimuthalAngle() {
		return this._spherical.theta
	}
	getDistance() {
		return this.object.position.distanceTo(this.target)
	}
	listenToKeyEvents(t) {
		t.addEventListener("keydown", this._onKeyDown),
			(this._domElementKeyEvents = t)
	}
	stopListenToKeyEvents() {
		this._domElementKeyEvents !== null &&
			(this._domElementKeyEvents.removeEventListener(
				"keydown",
				this._onKeyDown
			),
			(this._domElementKeyEvents = null))
	}
	saveState() {
		this.target0.copy(this.target),
			this.position0.copy(this.object.position),
			(this.zoom0 = this.object.zoom)
	}
	reset() {
		this.target.copy(this.target0),
			this.object.position.copy(this.position0),
			(this.object.zoom = this.zoom0),
			this.object.updateProjectionMatrix(),
			this.dispatchEvent(wl),
			this.update(),
			(this.state = Qt.NONE)
	}
	update(t = null) {
		const e = this.object.position
		ge.copy(e).sub(this.target),
			ge.applyQuaternion(this._quat),
			this._spherical.setFromVector3(ge),
			this.autoRotate &&
				this.state === Qt.NONE &&
				this._rotateLeft(this._getAutoRotationAngle(t)),
			this.enableDamping
				? ((this._spherical.theta +=
						this._sphericalDelta.theta * this.dampingFactor),
				  (this._spherical.phi +=
						this._sphericalDelta.phi * this.dampingFactor))
				: ((this._spherical.theta += this._sphericalDelta.theta),
				  (this._spherical.phi += this._sphericalDelta.phi))
		let n = this.minAzimuthAngle,
			s = this.maxAzimuthAngle
		isFinite(n) &&
			isFinite(s) &&
			(n < -Math.PI ? (n += ke) : n > Math.PI && (n -= ke),
			s < -Math.PI ? (s += ke) : s > Math.PI && (s -= ke),
			n <= s
				? (this._spherical.theta = Math.max(
						n,
						Math.min(s, this._spherical.theta)
				  ))
				: (this._spherical.theta =
						this._spherical.theta > (n + s) / 2
							? Math.max(n, this._spherical.theta)
							: Math.min(s, this._spherical.theta))),
			(this._spherical.phi = Math.max(
				this.minPolarAngle,
				Math.min(this.maxPolarAngle, this._spherical.phi)
			)),
			this._spherical.makeSafe(),
			this.enableDamping === !0
				? this.target.addScaledVector(this._panOffset, this.dampingFactor)
				: this.target.add(this._panOffset),
			this.target.sub(this.cursor),
			this.target.clampLength(this.minTargetRadius, this.maxTargetRadius),
			this.target.add(this.cursor)
		let r = !1
		if (
			(this.zoomToCursor && this._performCursorZoom) ||
			this.object.isOrthographicCamera
		)
			this._spherical.radius = this._clampDistance(this._spherical.radius)
		else {
			const o = this._spherical.radius
			;(this._spherical.radius = this._clampDistance(
				this._spherical.radius * this._scale
			)),
				(r = o != this._spherical.radius)
		}
		if (
			(ge.setFromSpherical(this._spherical),
			ge.applyQuaternion(this._quatInverse),
			e.copy(this.target).add(ge),
			this.object.lookAt(this.target),
			this.enableDamping === !0
				? ((this._sphericalDelta.theta *= 1 - this.dampingFactor),
				  (this._sphericalDelta.phi *= 1 - this.dampingFactor),
				  this._panOffset.multiplyScalar(1 - this.dampingFactor))
				: (this._sphericalDelta.set(0, 0, 0), this._panOffset.set(0, 0, 0)),
			this.zoomToCursor && this._performCursorZoom)
		) {
			let o = null
			if (this.object.isPerspectiveCamera) {
				const a = ge.length()
				o = this._clampDistance(a * this._scale)
				const h = a - o
				this.object.position.addScaledVector(this._dollyDirection, h),
					this.object.updateMatrixWorld(),
					(r = !!h)
			} else if (this.object.isOrthographicCamera) {
				const a = new U(this._mouse.x, this._mouse.y, 0)
				a.unproject(this.object)
				const h = this.object.zoom
				;(this.object.zoom = Math.max(
					this.minZoom,
					Math.min(this.maxZoom, this.object.zoom / this._scale)
				)),
					this.object.updateProjectionMatrix(),
					(r = h !== this.object.zoom)
				const l = new U(this._mouse.x, this._mouse.y, 0)
				l.unproject(this.object),
					this.object.position.sub(l).add(a),
					this.object.updateMatrixWorld(),
					(o = ge.length())
			} else
				console.warn(
					"WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."
				),
					(this.zoomToCursor = !1)
			o !== null &&
				(this.screenSpacePanning
					? this.target
							.set(0, 0, -1)
							.transformDirection(this.object.matrix)
							.multiplyScalar(o)
							.add(this.object.position)
					: ($s.origin.copy(this.object.position),
					  $s.direction.set(0, 0, -1).transformDirection(this.object.matrix),
					  Math.abs(this.object.up.dot($s.direction)) < ag
							? this.object.lookAt(this.target)
							: (Rl.setFromNormalAndCoplanarPoint(this.object.up, this.target),
							  $s.intersectPlane(Rl, this.target))))
		} else if (this.object.isOrthographicCamera) {
			const o = this.object.zoom
			;(this.object.zoom = Math.max(
				this.minZoom,
				Math.min(this.maxZoom, this.object.zoom / this._scale)
			)),
				o !== this.object.zoom &&
					(this.object.updateProjectionMatrix(), (r = !0))
		}
		return (
			(this._scale = 1),
			(this._performCursorZoom = !1),
			r ||
			this._lastPosition.distanceToSquared(this.object.position) > io ||
			8 * (1 - this._lastQuaternion.dot(this.object.quaternion)) > io ||
			this._lastTargetPosition.distanceToSquared(this.target) > io
				? (this.dispatchEvent(wl),
				  this._lastPosition.copy(this.object.position),
				  this._lastQuaternion.copy(this.object.quaternion),
				  this._lastTargetPosition.copy(this.target),
				  !0)
				: !1
		)
	}
	_getAutoRotationAngle(t) {
		return t !== null
			? (ke / 60) * this.autoRotateSpeed * t
			: (ke / 60 / 60) * this.autoRotateSpeed
	}
	_getZoomScale(t) {
		const e = Math.abs(t * 0.01)
		return Math.pow(0.95, this.zoomSpeed * e)
	}
	_rotateLeft(t) {
		this._sphericalDelta.theta -= t
	}
	_rotateUp(t) {
		this._sphericalDelta.phi -= t
	}
	_panLeft(t, e) {
		ge.setFromMatrixColumn(e, 0), ge.multiplyScalar(-t), this._panOffset.add(ge)
	}
	_panUp(t, e) {
		this.screenSpacePanning === !0
			? ge.setFromMatrixColumn(e, 1)
			: (ge.setFromMatrixColumn(e, 0), ge.crossVectors(this.object.up, ge)),
			ge.multiplyScalar(t),
			this._panOffset.add(ge)
	}
	_pan(t, e) {
		const n = this.domElement
		if (this.object.isPerspectiveCamera) {
			const s = this.object.position
			ge.copy(s).sub(this.target)
			let r = ge.length()
			;(r *= Math.tan(((this.object.fov / 2) * Math.PI) / 180)),
				this._panLeft((2 * t * r) / n.clientHeight, this.object.matrix),
				this._panUp((2 * e * r) / n.clientHeight, this.object.matrix)
		} else
			this.object.isOrthographicCamera
				? (this._panLeft(
						(t * (this.object.right - this.object.left)) /
							this.object.zoom /
							n.clientWidth,
						this.object.matrix
				  ),
				  this._panUp(
						(e * (this.object.top - this.object.bottom)) /
							this.object.zoom /
							n.clientHeight,
						this.object.matrix
				  ))
				: (console.warn(
						"WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."
				  ),
				  (this.enablePan = !1))
	}
	_dollyOut(t) {
		this.object.isPerspectiveCamera || this.object.isOrthographicCamera
			? (this._scale /= t)
			: (console.warn(
					"WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."
			  ),
			  (this.enableZoom = !1))
	}
	_dollyIn(t) {
		this.object.isPerspectiveCamera || this.object.isOrthographicCamera
			? (this._scale *= t)
			: (console.warn(
					"WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."
			  ),
			  (this.enableZoom = !1))
	}
	_updateZoomParameters(t, e) {
		if (!this.zoomToCursor) return
		this._performCursorZoom = !0
		const n = this.domElement.getBoundingClientRect(),
			s = t - n.left,
			r = e - n.top,
			o = n.width,
			a = n.height
		;(this._mouse.x = (s / o) * 2 - 1),
			(this._mouse.y = -(r / a) * 2 + 1),
			this._dollyDirection
				.set(this._mouse.x, this._mouse.y, 1)
				.unproject(this.object)
				.sub(this.object.position)
				.normalize()
	}
	_clampDistance(t) {
		return Math.max(this.minDistance, Math.min(this.maxDistance, t))
	}
	_handleMouseDownRotate(t) {
		this._rotateStart.set(t.clientX, t.clientY)
	}
	_handleMouseDownDolly(t) {
		this._updateZoomParameters(t.clientX, t.clientX),
			this._dollyStart.set(t.clientX, t.clientY)
	}
	_handleMouseDownPan(t) {
		this._panStart.set(t.clientX, t.clientY)
	}
	_handleMouseMoveRotate(t) {
		this._rotateEnd.set(t.clientX, t.clientY),
			this._rotateDelta
				.subVectors(this._rotateEnd, this._rotateStart)
				.multiplyScalar(this.rotateSpeed)
		const e = this.domElement
		this._rotateLeft((ke * this._rotateDelta.x) / e.clientHeight),
			this._rotateUp((ke * this._rotateDelta.y) / e.clientHeight),
			this._rotateStart.copy(this._rotateEnd),
			this.update()
	}
	_handleMouseMoveDolly(t) {
		this._dollyEnd.set(t.clientX, t.clientY),
			this._dollyDelta.subVectors(this._dollyEnd, this._dollyStart),
			this._dollyDelta.y > 0
				? this._dollyOut(this._getZoomScale(this._dollyDelta.y))
				: this._dollyDelta.y < 0 &&
				  this._dollyIn(this._getZoomScale(this._dollyDelta.y)),
			this._dollyStart.copy(this._dollyEnd),
			this.update()
	}
	_handleMouseMovePan(t) {
		this._panEnd.set(t.clientX, t.clientY),
			this._panDelta
				.subVectors(this._panEnd, this._panStart)
				.multiplyScalar(this.panSpeed),
			this._pan(this._panDelta.x, this._panDelta.y),
			this._panStart.copy(this._panEnd),
			this.update()
	}
	_handleMouseWheel(t) {
		this._updateZoomParameters(t.clientX, t.clientY),
			t.deltaY < 0
				? this._dollyIn(this._getZoomScale(t.deltaY))
				: t.deltaY > 0 && this._dollyOut(this._getZoomScale(t.deltaY)),
			this.update()
	}
	_handleKeyDown(t) {
		let e = !1
		switch (t.code) {
			case this.keys.UP:
				t.ctrlKey || t.metaKey || t.shiftKey
					? this.enableRotate &&
					  this._rotateUp(
							(ke * this.keyRotateSpeed) / this.domElement.clientHeight
					  )
					: this.enablePan && this._pan(0, this.keyPanSpeed),
					(e = !0)
				break
			case this.keys.BOTTOM:
				t.ctrlKey || t.metaKey || t.shiftKey
					? this.enableRotate &&
					  this._rotateUp(
							(-ke * this.keyRotateSpeed) / this.domElement.clientHeight
					  )
					: this.enablePan && this._pan(0, -this.keyPanSpeed),
					(e = !0)
				break
			case this.keys.LEFT:
				t.ctrlKey || t.metaKey || t.shiftKey
					? this.enableRotate &&
					  this._rotateLeft(
							(ke * this.keyRotateSpeed) / this.domElement.clientHeight
					  )
					: this.enablePan && this._pan(this.keyPanSpeed, 0),
					(e = !0)
				break
			case this.keys.RIGHT:
				t.ctrlKey || t.metaKey || t.shiftKey
					? this.enableRotate &&
					  this._rotateLeft(
							(-ke * this.keyRotateSpeed) / this.domElement.clientHeight
					  )
					: this.enablePan && this._pan(-this.keyPanSpeed, 0),
					(e = !0)
				break
		}
		e && (t.preventDefault(), this.update())
	}
	_handleTouchStartRotate(t) {
		if (this._pointers.length === 1) this._rotateStart.set(t.pageX, t.pageY)
		else {
			const e = this._getSecondPointerPosition(t),
				n = 0.5 * (t.pageX + e.x),
				s = 0.5 * (t.pageY + e.y)
			this._rotateStart.set(n, s)
		}
	}
	_handleTouchStartPan(t) {
		if (this._pointers.length === 1) this._panStart.set(t.pageX, t.pageY)
		else {
			const e = this._getSecondPointerPosition(t),
				n = 0.5 * (t.pageX + e.x),
				s = 0.5 * (t.pageY + e.y)
			this._panStart.set(n, s)
		}
	}
	_handleTouchStartDolly(t) {
		const e = this._getSecondPointerPosition(t),
			n = t.pageX - e.x,
			s = t.pageY - e.y,
			r = Math.sqrt(n * n + s * s)
		this._dollyStart.set(0, r)
	}
	_handleTouchStartDollyPan(t) {
		this.enableZoom && this._handleTouchStartDolly(t),
			this.enablePan && this._handleTouchStartPan(t)
	}
	_handleTouchStartDollyRotate(t) {
		this.enableZoom && this._handleTouchStartDolly(t),
			this.enableRotate && this._handleTouchStartRotate(t)
	}
	_handleTouchMoveRotate(t) {
		if (this._pointers.length == 1) this._rotateEnd.set(t.pageX, t.pageY)
		else {
			const n = this._getSecondPointerPosition(t),
				s = 0.5 * (t.pageX + n.x),
				r = 0.5 * (t.pageY + n.y)
			this._rotateEnd.set(s, r)
		}
		this._rotateDelta
			.subVectors(this._rotateEnd, this._rotateStart)
			.multiplyScalar(this.rotateSpeed)
		const e = this.domElement
		this._rotateLeft((ke * this._rotateDelta.x) / e.clientHeight),
			this._rotateUp((ke * this._rotateDelta.y) / e.clientHeight),
			this._rotateStart.copy(this._rotateEnd)
	}
	_handleTouchMovePan(t) {
		if (this._pointers.length === 1) this._panEnd.set(t.pageX, t.pageY)
		else {
			const e = this._getSecondPointerPosition(t),
				n = 0.5 * (t.pageX + e.x),
				s = 0.5 * (t.pageY + e.y)
			this._panEnd.set(n, s)
		}
		this._panDelta
			.subVectors(this._panEnd, this._panStart)
			.multiplyScalar(this.panSpeed),
			this._pan(this._panDelta.x, this._panDelta.y),
			this._panStart.copy(this._panEnd)
	}
	_handleTouchMoveDolly(t) {
		const e = this._getSecondPointerPosition(t),
			n = t.pageX - e.x,
			s = t.pageY - e.y,
			r = Math.sqrt(n * n + s * s)
		this._dollyEnd.set(0, r),
			this._dollyDelta.set(
				0,
				Math.pow(this._dollyEnd.y / this._dollyStart.y, this.zoomSpeed)
			),
			this._dollyOut(this._dollyDelta.y),
			this._dollyStart.copy(this._dollyEnd)
		const o = (t.pageX + e.x) * 0.5,
			a = (t.pageY + e.y) * 0.5
		this._updateZoomParameters(o, a)
	}
	_handleTouchMoveDollyPan(t) {
		this.enableZoom && this._handleTouchMoveDolly(t),
			this.enablePan && this._handleTouchMovePan(t)
	}
	_handleTouchMoveDollyRotate(t) {
		this.enableZoom && this._handleTouchMoveDolly(t),
			this.enableRotate && this._handleTouchMoveRotate(t)
	}
	_addPointer(t) {
		this._pointers.push(t.pointerId)
	}
	_removePointer(t) {
		delete this._pointerPositions[t.pointerId]
		for (let e = 0; e < this._pointers.length; e++)
			if (this._pointers[e] == t.pointerId) {
				this._pointers.splice(e, 1)
				return
			}
	}
	_isTrackingPointer(t) {
		for (let e = 0; e < this._pointers.length; e++)
			if (this._pointers[e] == t.pointerId) return !0
		return !1
	}
	_trackPointer(t) {
		let e = this._pointerPositions[t.pointerId]
		e === void 0 && ((e = new Dt()), (this._pointerPositions[t.pointerId] = e)),
			e.set(t.pageX, t.pageY)
	}
	_getSecondPointerPosition(t) {
		const e =
			t.pointerId === this._pointers[0] ? this._pointers[1] : this._pointers[0]
		return this._pointerPositions[e]
	}
	_customWheelEvent(t) {
		const e = t.deltaMode,
			n = { clientX: t.clientX, clientY: t.clientY, deltaY: t.deltaY }
		switch (e) {
			case 1:
				n.deltaY *= 16
				break
			case 2:
				n.deltaY *= 100
				break
		}
		return t.ctrlKey && !this._controlActive && (n.deltaY *= 10), n
	}
}
function cg(i) {
	this.enabled !== !1 &&
		(this._pointers.length === 0 &&
			(this.domElement.setPointerCapture(i.pointerId),
			this.domElement.addEventListener("pointermove", this._onPointerMove),
			this.domElement.addEventListener("pointerup", this._onPointerUp)),
		!this._isTrackingPointer(i) &&
			(this._addPointer(i),
			i.pointerType === "touch" ? this._onTouchStart(i) : this._onMouseDown(i)))
}
function hg(i) {
	this.enabled !== !1 &&
		(i.pointerType === "touch" ? this._onTouchMove(i) : this._onMouseMove(i))
}
function ug(i) {
	switch ((this._removePointer(i), this._pointers.length)) {
		case 0:
			this.domElement.releasePointerCapture(i.pointerId),
				this.domElement.removeEventListener("pointermove", this._onPointerMove),
				this.domElement.removeEventListener("pointerup", this._onPointerUp),
				this.dispatchEvent(bc),
				(this.state = Qt.NONE)
			break
		case 1:
			const t = this._pointers[0],
				e = this._pointerPositions[t]
			this._onTouchStart({ pointerId: t, pageX: e.x, pageY: e.y })
			break
	}
}
function dg(i) {
	let t
	switch (i.button) {
		case 0:
			t = this.mouseButtons.LEFT
			break
		case 1:
			t = this.mouseButtons.MIDDLE
			break
		case 2:
			t = this.mouseButtons.RIGHT
			break
		default:
			t = -1
	}
	switch (t) {
		case Fi.DOLLY:
			if (this.enableZoom === !1) return
			this._handleMouseDownDolly(i), (this.state = Qt.DOLLY)
			break
		case Fi.ROTATE:
			if (i.ctrlKey || i.metaKey || i.shiftKey) {
				if (this.enablePan === !1) return
				this._handleMouseDownPan(i), (this.state = Qt.PAN)
			} else {
				if (this.enableRotate === !1) return
				this._handleMouseDownRotate(i), (this.state = Qt.ROTATE)
			}
			break
		case Fi.PAN:
			if (i.ctrlKey || i.metaKey || i.shiftKey) {
				if (this.enableRotate === !1) return
				this._handleMouseDownRotate(i), (this.state = Qt.ROTATE)
			} else {
				if (this.enablePan === !1) return
				this._handleMouseDownPan(i), (this.state = Qt.PAN)
			}
			break
		default:
			this.state = Qt.NONE
	}
	this.state !== Qt.NONE && this.dispatchEvent(la)
}
function fg(i) {
	switch (this.state) {
		case Qt.ROTATE:
			if (this.enableRotate === !1) return
			this._handleMouseMoveRotate(i)
			break
		case Qt.DOLLY:
			if (this.enableZoom === !1) return
			this._handleMouseMoveDolly(i)
			break
		case Qt.PAN:
			if (this.enablePan === !1) return
			this._handleMouseMovePan(i)
			break
	}
}
function pg(i) {
	this.enabled === !1 ||
		this.enableZoom === !1 ||
		this.state !== Qt.NONE ||
		(i.preventDefault(),
		this.dispatchEvent(la),
		this._handleMouseWheel(this._customWheelEvent(i)),
		this.dispatchEvent(bc))
}
function mg(i) {
	this.enabled !== !1 && this._handleKeyDown(i)
}
function gg(i) {
	switch ((this._trackPointer(i), this._pointers.length)) {
		case 1:
			switch (this.touches.ONE) {
				case Ii.ROTATE:
					if (this.enableRotate === !1) return
					this._handleTouchStartRotate(i), (this.state = Qt.TOUCH_ROTATE)
					break
				case Ii.PAN:
					if (this.enablePan === !1) return
					this._handleTouchStartPan(i), (this.state = Qt.TOUCH_PAN)
					break
				default:
					this.state = Qt.NONE
			}
			break
		case 2:
			switch (this.touches.TWO) {
				case Ii.DOLLY_PAN:
					if (this.enableZoom === !1 && this.enablePan === !1) return
					this._handleTouchStartDollyPan(i), (this.state = Qt.TOUCH_DOLLY_PAN)
					break
				case Ii.DOLLY_ROTATE:
					if (this.enableZoom === !1 && this.enableRotate === !1) return
					this._handleTouchStartDollyRotate(i),
						(this.state = Qt.TOUCH_DOLLY_ROTATE)
					break
				default:
					this.state = Qt.NONE
			}
			break
		default:
			this.state = Qt.NONE
	}
	this.state !== Qt.NONE && this.dispatchEvent(la)
}
function _g(i) {
	switch ((this._trackPointer(i), this.state)) {
		case Qt.TOUCH_ROTATE:
			if (this.enableRotate === !1) return
			this._handleTouchMoveRotate(i), this.update()
			break
		case Qt.TOUCH_PAN:
			if (this.enablePan === !1) return
			this._handleTouchMovePan(i), this.update()
			break
		case Qt.TOUCH_DOLLY_PAN:
			if (this.enableZoom === !1 && this.enablePan === !1) return
			this._handleTouchMoveDollyPan(i), this.update()
			break
		case Qt.TOUCH_DOLLY_ROTATE:
			if (this.enableZoom === !1 && this.enableRotate === !1) return
			this._handleTouchMoveDollyRotate(i), this.update()
			break
		default:
			this.state = Qt.NONE
	}
}
function xg(i) {
	this.enabled !== !1 && i.preventDefault()
}
function vg(i) {
	i.key === "Control" &&
		((this._controlActive = !0),
		this.domElement
			.getRootNode()
			.addEventListener("keyup", this._interceptControlUp, {
				passive: !0,
				capture: !0,
			}))
}
function Mg(i) {
	i.key === "Control" &&
		((this._controlActive = !1),
		this.domElement
			.getRootNode()
			.removeEventListener("keyup", this._interceptControlUp, {
				passive: !0,
				capture: !0,
			}))
}
async function ca(i) {
	try {
		const t = await fetch(`/src/content/${i}/${i}.html`)
		if (!t.ok) throw new Error(`Failed to load ${i}.html`)
		return await t.text()
	} catch (t) {
		return (
			console.error(`Error loading content for ${i}:`, t),
			`<div class="error">Content for ${i} could not be loaded</div>`
		)
	}
}
function yg(i) {
	try {
		const e = new DOMParser().parseFromString(i, "text/html"),
			n = e.querySelector("h1"),
			s = e.querySelectorAll("p")
		console.log("Paragraphs: ", s)
		const r = { heading: n ? n.textContent.trim() : "", paragraphs: [] }
		return (
			s.forEach((o) => {
				r.paragraphs.push(o.textContent.trim())
			}),
			r
		)
	} catch (t) {
		return (
			console.error("Error parsing bio content:", t),
			{ heading: "", paragraphs: [] }
		)
	}
}
function Sg(i) {
	try {
		const n = new DOMParser()
			.parseFromString(i, "text/html")
			.getElementById("blogPosts")
		return n ? JSON.parse(n.textContent) : []
	} catch (t) {
		return console.error("Error parsing blog posts:", t), []
	}
}
let Ge = null,
	ds = null,
	fr = [],
	Tc = []
const Cl = 0.5,
	Pl = 1.4,
	Dl = 1,
	Eg = 0.003,
	bg = 0.0045,
	mn = 0.08
function Tg() {
	;(Ge = new Wn()), (Ge.name = "orcScene"), (ds = Ag()), Ge.add(ds)
	const i = Ll(Pl, 43775),
		t = Ll(Dl, 65450)
	;(t.rotation.x = Math.PI * 0.15), Tc.push(i, t), Ge.add(i), Ge.add(t)
	const e = Il(43775)
	;(e.userData = { orbitRadius: Pl, orbitSpeed: Eg, angle: 0, orbitTiltX: 0 }),
		fr.push(e),
		Ge.add(e)
	const n = Il(65450)
	return (
		(n.userData = {
			orbitRadius: Dl,
			orbitSpeed: bg,
			angle: Math.PI,
			orbitTiltX: Math.PI * 0.6,
		}),
		fr.push(n),
		Ge.add(n),
		(Ge.rotation.x = -0.8),
		(Ge.rotation.y = 0.2),
		Ge
	)
}
function Ag() {
	const i = new qn(Cl, 64, 64),
		t = document.createElement("canvas")
	;(t.width = 512), (t.height = 256)
	const e = t.getContext("2d")
	;(e.fillStyle = "#1a2a3a"),
		e.fillRect(0, 0, t.width, t.height),
		(e.fillStyle = "#3a5a6a"),
		ts(e, 80, 40, 60, 50),
		ts(e, 120, 100, 35, 60),
		ts(e, 250, 30, 40, 120),
		ts(e, 320, 30, 100, 70),
		ts(e, 420, 120, 40, 30)
	for (let l = 0; l < 2e3; l++) {
		const d = Math.random() * t.width,
			c = Math.random() * t.height,
			f = Math.random() * 20 + 40
		;(e.fillStyle = `rgba(${f}, ${f + 20}, ${f + 30}, 0.3)`),
			e.fillRect(d, c, 2, 2)
	}
	;(e.fillStyle = "#5a7a8a"),
		e.beginPath(),
		e.ellipse(256, 10, 200, 15, 0, 0, Math.PI * 2),
		e.fill(),
		e.beginPath(),
		e.ellipse(256, 246, 200, 15, 0, 0, Math.PI * 2),
		e.fill()
	const n = new vs(t)
	;(n.wrapS = ar), (n.wrapT = Gn)
	const s = new Wi({
			map: n,
			metalness: 0.1,
			roughness: 0.8,
			emissive: new Bt(660768),
			emissiveIntensity: 0.3,
		}),
		r = new Zt(i, s)
	r.name = "planet"
	const o = new qn(Cl * 1.05, 32, 32),
		a = new Le({ color: 4491434, transparent: !0, opacity: 0.15, side: Ie }),
		h = new Zt(o, a)
	return r.add(h), r
}
function ts(i, t, e, n, s) {
	i.beginPath(),
		i.moveTo(t + n * 0.5, e),
		i.bezierCurveTo(
			t + n,
			e + s * 0.2,
			t + n * 0.8,
			e + s * 0.8,
			t + n * 0.5,
			e + s
		),
		i.bezierCurveTo(t, e + s * 0.7, t + n * 0.2, e + s * 0.3, t + n * 0.5, e),
		i.fill()
}
function Ll(i, t) {
	const e = new us(i, 0.01, 8, 128),
		n = new Le({ color: t, transparent: !0, opacity: 0.5 }),
		s = new Zt(e, n)
	return (s.rotation.x = Math.PI / 2), (s.name = `orbitalRing_${i}`), s
}
function Il(i) {
	const t = new Wn(),
		e = new fi(mn, mn * 0.5, mn * 0.5),
		n = new Wi({ color: 8947848, metalness: 0.8, roughness: 0.2 }),
		s = new Zt(e, n)
	t.add(s)
	const r = new fi(mn * 0.1, mn * 1.5, mn * 0.02),
		o = new Wi({
			color: i,
			metalness: 0.3,
			roughness: 0.5,
			emissive: new Bt(i),
			emissiveIntensity: 0.3,
		}),
		a = new Zt(r, o)
	a.position.set(-mn * 0.6, 0, 0), t.add(a)
	const h = new Zt(r, o)
	h.position.set(mn * 0.6, 0, 0), t.add(h)
	const l = new oa(0.005, 0.005, mn * 0.5, 8),
		d = new Le({ color: 16777215 }),
		c = new Zt(l, d)
	return c.position.set(0, mn * 0.4, 0), t.add(c), (t.name = "satellite"), t
}
function wg() {
	Ge &&
		(fr.forEach((i) => {
			const t = i.userData
			t.angle += t.orbitSpeed
			const e = Math.cos(t.angle) * t.orbitRadius,
				n = Math.sin(t.angle) * t.orbitRadius,
				s = Math.sin(t.angle) * Math.sin(t.orbitTiltX) * t.orbitRadius
			i.position.set(e, s, n), (i.rotation.y = -t.angle + Math.PI / 2)
		}),
		ds && (ds.rotation.y += 0.001))
}
function Rg() {
	Ge &&
		Ge.traverse((i) => {
			i.geometry && i.geometry.dispose(),
				i.material &&
					(Array.isArray(i.material)
						? i.material.forEach((t) => t.dispose())
						: i.material.dispose())
		}),
		(Ge = null),
		(ds = null),
		(fr = []),
		(Tc = [])
}
function Cg(i = 300, t = 200) {
	const e = document.createElement("div")
	;(e.style.width = `${i}px`),
		(e.style.height = `${t}px`),
		(e.style.position = "relative"),
		(e.style.overflow = "hidden"),
		(e.style.borderRadius = "8px"),
		(e.style.border = "2px solid #00aaff"),
		(e.style.cursor = "pointer"),
		(e.style.background = "#000011")
	const n = new cc()
	;(n.background = new Bt(17)), n.add(new _c(16777215, 0.4))
	const s = new gc(16777215, 0.8)
	s.position.set(3, 3, 3), n.add(s)
	const r = new Wn(),
		o = new qn(0.3, 32, 32),
		a = new Wi({
			color: 1718874,
			metalness: 0.1,
			roughness: 0.8,
			emissive: new Bt(660768),
			emissiveIntensity: 0.3,
		}),
		h = new Zt(o, a)
	r.add(h)
	const l = new qn(0.35, 32, 32),
		d = new Le({ color: 4491434, transparent: !0, opacity: 0.15, side: Ie })
	h.add(new Zt(l, d))
	const c = new us(0.8, 0.008, 8, 64),
		f = new Le({ color: 43775, transparent: !0, opacity: 0.5 }),
		m = new Zt(c, f)
	;(m.rotation.x = Math.PI / 2), r.add(m)
	const g = new us(0.6, 0.008, 8, 64),
		_ = new Le({ color: 65450, transparent: !0, opacity: 0.5 }),
		p = new Zt(g, _)
	;(p.rotation.x = Math.PI / 2 + 0.15), r.add(p)
	const u = new qn(0.04, 8, 8),
		b = new Le({ color: 43775, emissive: 43775 }),
		T = new Zt(u, b)
	r.add(T)
	const S = new Le({ color: 65450, emissive: 65450 }),
		C = new Zt(u.clone(), S)
	r.add(C)
	let w = 0,
		E = Math.PI
	;(r.rotation.x = -0.8), (r.rotation.y = 0.2), n.add(r)
	const D = i / t,
		v = new je(50, D, 0.1, 100)
	v.position.set(1.2, 2.4, 1.8), v.lookAt(0, 0, 0)
	const y = new Ec({ antialias: !0, alpha: !0 })
	y.setSize(i, t),
		y.setPixelRatio(Math.min(window.devicePixelRatio, 2)),
		e.appendChild(y.domElement)
	let R = null,
		L = !0
	function N() {
		L &&
			((w += 0.008),
			(E += 0.012),
			T.position.set(Math.cos(w) * 0.8, 0, Math.sin(w) * 0.8),
			C.position.set(Math.cos(E) * 0.6, Math.sin(E) * 0.1, Math.sin(E) * 0.6),
			(h.rotation.y += 0.002),
			y.render(n, v),
			(R = requestAnimationFrame(N)))
	}
	return (
		N(),
		(e.cleanup = () => {
			;(L = !1),
				R && (cancelAnimationFrame(R), (R = null)),
				r.traverse((z) => {
					z.geometry && z.geometry.dispose(),
						z.material &&
							(Array.isArray(z.material)
								? z.material.forEach((H) => H.dispose())
								: z.material.dispose())
				}),
				y.dispose()
		}),
		e
	)
}
const nt = new Wn()
nt.rotation.order = "YXZ"
const Yt = {},
	Ke = {},
	Vt = new cc()
Vt.background = new Bt(0)
const ae = new je(50, window.innerWidth / window.innerHeight, 0.1, 2e3)
ae.position.set(0, 0, 6)
ae.lookAt(0, 0, 0)
const un = { position: ae.position.clone(), target: new U(0, 0, 0) },
	Ze = new Ec({ antialias: !0 })
Ze.setSize(window.innerWidth, window.innerHeight)
Ze.setPixelRatio(window.devicePixelRatio)
Ze.localClippingEnabled = !0
const qt = new lg(ae, Ze.domElement)
qt.enabled = !0
qt.enableDamping = !0
qt.enableRotate = !0
qt.enableZoom = !0
qt.enablePan = !0
qt.autoRotate = !1
qt.minDistance = 2.5
qt.maxDistance = 12
qt.minPolarAngle = 0.1
qt.maxPolarAngle = Math.PI - 0.1
Vt.add(new _c(16777215, 0.6))
const Ac = new gc(16777215, 0.8)
Ac.position.set(5, 8, 5)
Vt.add(Ac)
const wc = 1500,
	Rc = new Be(),
	rr = new Float32Array(wc * 3)
for (let i = 0; i < wc; i++)
	(rr[i * 3 + 0] = (Math.random() - 0.5) * 800),
		(rr[i * 3 + 1] = (Math.random() - 0.5) * 800),
		(rr[i * 3 + 2] = (Math.random() - 0.5) * 800)
Rc.setAttribute("position", new an(rr, 3))
const Pg = new uc({ color: 16777215, size: 0.6 }),
	Cc = new hu(Rc, Pg)
Vt.add(Cc)
const Pc = 3.375,
	Mr = 3.025,
	Dc = Pc / 2,
	ha = (Math.sqrt(3) / 2) * Pc,
	or = new U(0, Mr / 2, 0),
	Ul = new U(-Dc, -Mr / 2, ha / 3),
	Nl = new U(Dc, -Mr / 2, ha / 3),
	Fl = new U(0, -Mr / 2, (-2 * ha) / 3)
Vt.add(nt)
const Dg = [
	{ name: "Blog", verts: [or.clone(), Ul.clone(), Nl.clone()] },
	{ name: "Portfolio", verts: [or.clone(), Nl.clone(), Fl.clone()] },
	{ name: "Bio", verts: [or.clone(), Fl.clone(), Ul.clone()] },
]
Dg.forEach((i) => {
	const t = new Be()
	t.setAttribute(
		"position",
		new an(new Float32Array(i.verts.flatMap((r) => [r.x, r.y, r.z])), 3)
	),
		t.computeVertexNormals()
	const e = new Wi({
			color: 0,
			metalness: 0.95,
			roughness: 0.1,
			side: De,
			transparent: !1,
			opacity: 1,
			depthWrite: !0,
			depthTest: !0,
		}),
		n = new Zt(t, e),
		s = new uu(t)
	n.add(new cu(s, new hc({ color: 16777215 }))), nt.add(n), (i.mesh = n)
})
nt.position.y = 0.35
const Lg = new qn(1.5, 32, 32),
	fs = new Wi({
		color: 0,
		metalness: 0.95,
		roughness: 0.1,
		side: De,
		transparent: !0,
		opacity: 0,
	}),
	$e = new Zt(Lg, fs)
$e.visible = !1
$e.name = "morphSphere"
Vt.add($e)
let yr = !1,
	nn = null
const Ig = new lc(512, {
		format: on,
		generateMipmaps: !0,
		minFilter: Vn,
		magFilter: rn,
		type: xn,
	}),
	Li = new oc(0.1, 1e3, Ig)
Vt.add(Li)
function Ug() {
	const i = nt.children.filter((t) => t.isMesh)
	i.forEach((t) => (t.visible = !1)),
		Li.position.copy(nt.position),
		Li.update(Ze, Vt),
		i.forEach((t) => {
			;(t.visible = !0),
				Li.renderTarget &&
					Li.renderTarget.texture &&
					((t.material.envMap = Li.renderTarget.texture),
					(t.material.envMapIntensity = 0.7),
					(t.material.needsUpdate = !0))
		})
}
Ug()
const Ol = {
	Bio: {
		text: "Bio",
		position: { x: -1.05, y: 0.04, z: 0.5 },
		rotation: { x: 0, y: 0.438, z: 1 },
		pyramidCenteredSize: [2.4, 0.6],
		pyramidUncenteredSize: [2.4, 0.6],
	},
	Portfolio: {
		text: "Portfolio",
		position: { x: 1.08, y: 0, z: 0.3 },
		rotation: { x: 0.2, y: -0.6, z: -0.92 },
		pyramidCenteredSize: [2.4, 0.6],
		pyramidUncenteredSize: [2.4, 0.6],
	},
	Blog: {
		text: "Blog",
		position: { x: 0, y: -1.65, z: 1.2 },
		rotation: { x: 0, y: 0, z: 0 },
		pyramidCenteredSize: [2.4, 0.6],
		pyramidUncenteredSize: [2.4, 0.6],
	},
	Home: {
		text: "Home",
		position: { x: 0, y: or.y + 0.2, z: 0 },
		rotation: { x: 0, y: 0, z: 0 },
		pyramidCenteredSize: [2.4, 0.6],
		pyramidUncenteredSize: [2.4, 0.6],
	},
}
function Ng(i) {
	for (const t in Ol) {
		if (t === "Home") continue
		const e = Ol[t],
			n = i(e.text, ...e.pyramidCenteredSize)
		n.position.set(e.position.x, e.position.y, e.position.z),
			n.rotation.set(e.rotation.x, e.rotation.y, e.rotation.z),
			(n.userData.origPosition = n.position.clone()),
			(n.userData.origRotation = n.rotation.clone()),
			(n.userData.originalScale = n.scale.clone()),
			(n.userData.pyramidCenteredSize = e.pyramidCenteredSize),
			(n.userData.pyramidUncenteredSize = e.pyramidUncenteredSize),
			nt.add(n),
			(Yt[t] = n),
			(n.userData.name = t),
			(n.cursor = "pointer")
		const s = e.pyramidCenteredSize[0] * 0.8,
			r = e.pyramidCenteredSize[1] * 1,
			o = new Sn(s, r),
			a = new Le({ transparent: !0, opacity: 0 }),
			h = new Zt(o, a)
		h.position.copy(n.position).add(new U(0, 0.05, 0.08)),
			h.rotation.copy(n.rotation),
			(h.userData.labelKey = t),
			(h.name = `${t}_hover`),
			Vt.add(h),
			(Ke[t] = h)
	}
}
let me = 0
const xe = { positionX: 0, positionY: 0.35, rotationY: 0, scale: 1 },
	es = {
		positionY: 2.2,
		scale: 0.4,
		scaleY: 0.08,
		scaleZ: 0.1,
		rotationX: -1.4,
	},
	so = {
		Bio: { x: -2, y: 2.5, z: 0 },
		Portfolio: { x: 0, y: 2.5, z: 0 },
		Blog: { x: 2, y: 2.5, z: 0 },
	},
	pr = { bio: -2, portfolio: 0, blog: 2 }
let Ms = null
const Lc = new Dn(new U(0, -1, 0), 2.1)
function ss(i = !0, t = null) {
	const e = ++me
	nt.visible = !0
	const n = 1e3,
		s = nt.rotation.y,
		r = nt.rotation.x
	let o = i ? s + Math.PI * 2 : xe.rotationY
	i && t && (Ms = t)
	const a = i ? es.rotationX : 0,
		h = nt.position.x,
		l = nt.position.y,
		d = i ? es.positionY : xe.positionY,
		c = i && t && pr[t] !== void 0 ? pr[t] : 0,
		f = nt.scale.x,
		m = nt.scale.y,
		g = nt.scale.z,
		_ = i ? es.scale : xe.scale,
		p = i ? es.scaleY : xe.scale,
		u = i ? es.scaleZ : xe.scale,
		b = {},
		T = {}
	for (const w in Yt) {
		const E = Yt[w]
		if (E)
			if (i && so[w] && !(E.userData && E.userData.fixedNav)) {
				E.updateMatrixWorld()
				const D = new U()
				E.getWorldPosition(D)
				const v = new fn()
				E.getWorldQuaternion(v)
				const y = new U()
				E.getWorldScale(y),
					Vt.add(E),
					E.position.copy(D),
					E.quaternion.copy(v),
					E.scale.copy(y),
					(b[w] = {
						position: D.clone(),
						quaternion: v.clone(),
						scale: y.clone(),
					})
				const R = so[w]
				T[w] = {
					position: new U(R.x, R.y, R.z),
					quaternion: new fn(),
					scale: new U(1, 1, 1),
				}
			} else
				b[w] = {
					position: E.position.clone(),
					rotation: E.rotation.clone(),
					scale: E.scale.clone(),
					visible: E.visible,
				}
	}
	const S = performance.now()
	function C(w) {
		if (e !== me) return
		const E = Math.min((w - S) / n, 1)
		;(nt.rotation.x = r + (a - r) * E),
			(nt.rotation.y = s + (o - s) * E),
			(nt.position.x = h + (c - h) * E),
			(nt.position.y = l + (d - l) * E)
		const D = f + (_ - f) * E,
			v = m + (p - m) * E,
			y = g + (u - g) * E
		nt.scale.set(D, v, y)
		for (const R in Yt) {
			const L = Yt[R]
			if (!L) continue
			const N = b[R]
			if (N) {
				if (i && T[R]) {
					const z = T[R]
					L.position.lerpVectors(N.position, z.position, E),
						N.quaternion &&
							z.quaternion &&
							L.quaternion.slerpQuaternions(N.quaternion, z.quaternion, E),
						L.scale.lerpVectors(N.scale, z.scale, E)
				} else if (!i) {
					const z = L.userData.origPosition,
						H = L.userData.origRotation,
						W = L.userData.originalScale
					if (
						(z && L.position.lerpVectors(N.position, z, E),
						H &&
							((L.rotation.x = N.rotation.x + (H.x - N.rotation.x) * E),
							(L.rotation.y = N.rotation.y + (H.y - N.rotation.y) * E),
							(L.rotation.z = N.rotation.z + (H.z - N.rotation.z) * E)),
						W)
					) {
						const j = N.scale.x + (W.x - N.scale.x) * E,
							V = N.scale.y + (W.y - N.scale.y) * E,
							rt = N.scale.z + (W.z - N.scale.z) * E
						L.scale.set(j, V, rt)
					}
				}
			}
		}
		if (E < 1) requestAnimationFrame(C)
		else {
			if (e !== me) return
			for (const R in Yt) {
				const L = Yt[R]
				if (L) {
					if (i && T[R]) {
						const N = so[R]
						N &&
							(L.position.set(N.x, N.y, N.z),
							L.rotation.set(0, 0, 0),
							L.scale.set(1, 1, 1),
							(L.userData.fixedNav = !0))
					} else if (!i) {
						const N = L.userData.origPosition,
							z = L.userData.origRotation,
							H = L.userData.originalScale
						L.parent !== nt && nt.add(L),
							N && L.position.copy(N),
							z && L.rotation.copy(z),
							H && L.scale.copy(H)
					}
				}
			}
			t === "bio" ? ua() : t === "portfolio" ? Ni() : t === "blog" && da()
		}
	}
	requestAnimationFrame(C)
}
function Ic(i, t = null) {
	if ((console.log(`spinPyramidToSection(${i})`), !i || pr[i] === void 0))
		return
	const e = ++me
	nt.visible = !0
	const n = 600,
		s = nt.position.x,
		r = pr[i],
		o = nt.rotation.y,
		a = o + Math.PI * 2
	Ms = i
	const h = performance.now()
	function l(d) {
		if (e !== me) return
		const c = Math.min((d - h) / n, 1),
			f = c < 0.5 ? 2 * c * c : 1 - Math.pow(-2 * c + 2, 2) / 2
		if (
			((nt.position.x = s + (r - s) * f),
			(nt.rotation.y = o + (a - o) * f),
			c < 1)
		)
			requestAnimationFrame(l)
		else {
			if (e !== me) return
			;(nt.position.x = r), (nt.rotation.y = a), t && t()
		}
	}
	requestAnimationFrame(l)
}
function Fg() {
	const i = ++me
	;(Ms = null), In(), (nt.visible = !0)
	const t = 1e3,
		e = nt.rotation.y,
		n = nt.rotation.x,
		s = xe.rotationY,
		r = 0,
		o = ((e % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
	let h = (((s % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - o
	h > Math.PI && (h -= 2 * Math.PI), h < -Math.PI && (h += 2 * Math.PI)
	const l = nt.position.x,
		d = xe.positionX,
		c = nt.position.y,
		f = xe.positionY,
		m = nt.scale.x,
		g = nt.scale.y,
		_ = nt.scale.z,
		p = xe.scale,
		u = ae.position.clone(),
		b = un.position.clone(),
		T = {}
	for (const w in Yt) {
		if (w === "Home") continue
		const E = Yt[w]
		E &&
			(E.parent === Vt && nt.attach(E),
			(T[w] = {
				position: E.position.clone(),
				quaternion: E.quaternion.clone(),
				scale: E.scale.clone(),
			}),
			(E.userData.fixedNav = !1))
	}
	const S = performance.now()
	function C(w) {
		if (i !== me) return
		const E = Math.min((w - S) / t, 1),
			D = E < 0.5 ? 2 * E * E : 1 - Math.pow(-2 * E + 2, 2) / 2
		;(nt.rotation.y = e + h * D),
			(nt.rotation.x = n + (r - n) * D),
			(nt.position.x = l + (d - l) * D),
			(nt.position.y = c + (f - c) * D)
		const v = m + (p - m) * D,
			y = g + (p - g) * D,
			R = _ + (p - _) * D
		nt.scale.set(v, y, R),
			ae.position.lerpVectors(u, b, D),
			ae.lookAt(un.target),
			qt.target.copy(un.target),
			qt.update()
		for (const L in Yt) {
			if (L === "Home") continue
			const N = Yt[L]
			if (!N) continue
			const z = T[L],
				H = N.userData.origPosition,
				W = N.userData.origRotation,
				j = N.userData.originalScale
			if (z && H && W && j) {
				N.position.lerpVectors(z.position, H, D)
				const V = new fn().setFromEuler(W)
				N.quaternion.slerpQuaternions(z.quaternion, V, D),
					N.scale.lerpVectors(z.scale, j, D)
			}
		}
		if (E < 1) requestAnimationFrame(C)
		else {
			;(nt.rotation.y = xe.rotationY),
				(nt.rotation.x = 0),
				(nt.position.x = d),
				(nt.position.y = f),
				nt.scale.set(p, p, p),
				ae.position.copy(un.position),
				ae.lookAt(un.target),
				qt.target.copy(un.target),
				qt.update()
			for (const L in Yt) {
				if (L === "Home") continue
				const N = Yt[L]
				if (!N) continue
				const z = N.userData.origPosition,
					H = N.userData.origRotation,
					W = N.userData.originalScale
				z && N.position.copy(z),
					H && N.rotation.copy(H),
					W && N.scale.copy(W),
					(N.userData.fixedNav = !1)
			}
			Fc()
		}
	}
	requestAnimationFrame(C)
}
function ua() {
	In(), (qt.enableZoom = !1)
	const i = document.getElementById("content")
	i && ((i.style.display = "none"), (i.style.pointerEvents = "none"))
	const t = document.getElementById("content-floor")
	if ((t && t.classList.remove("show"), !Vt.getObjectByName("bioPlane"))) {
		const n = me
		ca("bio").then((s) => {
			if (n !== me) return
			const r = yg(s),
				o = ig(r)
			;(o.name = "bioPlane"),
				(o.frustumCulled = !1),
				o.traverse((h) => {
					h.material &&
						(Array.isArray(h.material) ? h.material : [h.material]).forEach(
							(d) => {
								;(d.clippingPlanes = [Lc]), (d.needsUpdate = !0)
							}
						)
				}),
				(o.position.y = 0),
				Vt.add(o),
				mr(o)
			const a = document.getElementById("content-floor")
			a && a.classList.remove("show")
		})
	}
}
function Ni() {
	In(), (qt.enableZoom = !1)
	const i = document.getElementById("content")
	i && ((i.style.display = "none"), (i.style.pointerEvents = "none"))
	const t = document.getElementById("content-floor")
	if ((t && t.classList.remove("show"), Vt.getObjectByName("portfolioPlane")))
		zl()
	else {
		const n = me
		ca("portfolio").then((s) => {
			if (n !== me) return
			document.getElementById("content")
			const o = new DOMParser().parseFromString(s, "text/html"),
				a = []
			o.querySelectorAll(".portfolio-item").forEach((d) => {
				const c = d.querySelector("h2"),
					f = d.querySelector("p"),
					m = d.querySelector("a"),
					g = d.dataset.link || (m ? m.href : null),
					_ = d.querySelector("img")
				let p = null
				if ((_ && _.src && (p = _.src), !p && g))
					try {
						p = `${new URL(g).origin}/favicon.ico`
					} catch {
						p = null
					}
				a.push({
					title: c ? c.textContent.trim() : "Untitled",
					description: f ? f.textContent.trim() : "",
					image: p,
					link: g,
				})
			})
			const h = rg(a)
			;(h.name = "portfolioPlane"),
				(h.frustumCulled = !1),
				h.traverse((d) => {
					d.material &&
						(Array.isArray(d.material) ? d.material : [d.material]).forEach(
							(f) => {
								;(f.clippingPlanes = [Lc]), (f.needsUpdate = !0)
							}
						)
				}),
				(h.position.y = 0),
				Vt.add(h),
				mr(h)
			const l = document.getElementById("content-floor")
			l && l.classList.remove("show"), zl()
		})
	}
}
function da() {
	In(), (qt.enableZoom = !1)
	const i = document.getElementById("content-floor")
	i && i.classList.remove("show")
	let t = Vt.getObjectByName("blogPlane")
	if (t) (t.visible = !0), mr(t)
	else {
		const e = me
		ca("blog").then((n) => {
			if (e !== me) return
			const s = document.getElementById("content")
			s &&
				((s.innerHTML = n),
				(s.style.display = "block"),
				(s.style.pointerEvents = "auto"),
				(s.style.top = "25%"),
				(s.style.bottom = "5%"),
				(s.style.height = "auto"),
				(s.style.overflowY = "auto"))
			const r = Sg(n),
				o = og(r)
			;(o.position.y = -0.5), Vt.add(o), mr(o)
			const a = document.getElementById("content-floor")
			a && a.classList.remove("show")
		})
	}
}
function Og() {
	const i = Vt.getObjectByName("bioPlane")
	i && Vt.remove(i)
}
function Bg() {
	const i = Vt.getObjectByName("portfolioPlane")
	i && Vt.remove(i)
}
function zg() {
	const i = Vt.getObjectByName("blogPlane")
	i && Vt.remove(i)
}
let _e = null,
	Bl = null
function zl() {
	if (!_e) {
		;(_e = document.createElement("div")),
			(_e.id = "orc-preview-overlay"),
			Object.assign(_e.style, {
				position: "fixed",
				top: "28%",
				left: "50%",
				transform: "translateX(-50%)",
				zIndex: "100",
				display: "flex",
				alignItems: "center",
				gap: "20px",
				background:
					"linear-gradient(135deg, rgba(0, 20, 40, 0.95), rgba(0, 40, 60, 0.85))",
				border: "2px solid #00aaff",
				borderRadius: "16px",
				padding: "20px",
				cursor: "pointer",
				boxShadow: "0 0 30px rgba(0, 170, 255, 0.3)",
				maxWidth: "90%",
			}),
			(Bl = Cg(200, 150)),
			_e.appendChild(Bl)
		const i = document.createElement("div")
		;(i.innerHTML = `
			<h2 style="color: #00ffff; margin: 0 0 8px 0; font-size: 1.3rem; text-shadow: 0 0 10px rgba(0,255,255,0.3);">
				Click here to view ORC demo with inline docs!
			</h2>
			<p style="color: #aaddff; margin: 0; font-size: 0.95rem; line-height: 1.4;">
				Orbital Refuse Collector - Interactive API documentation demo featuring satellite orbit visualization.
			</p>
		`),
			_e.appendChild(i),
			_e.addEventListener("mouseenter", () => {
				;(_e.style.borderColor = "#00ffff"),
					(_e.style.boxShadow = "0 0 40px rgba(0, 255, 255, 0.4)"),
					(_e.style.transform = "translateX(-50%) scale(1.02)")
			}),
			_e.addEventListener("mouseleave", () => {
				;(_e.style.borderColor = "#00aaff"),
					(_e.style.boxShadow = "0 0 30px rgba(0, 170, 255, 0.3)"),
					(_e.style.transform = "translateX(-50%) scale(1)")
			}),
			_e.addEventListener("click", (t) => {
				t.stopPropagation(),
					window.history.pushState({}, "", "/orc-demo"),
					window.dispatchEvent(new PopStateEvent("popstate"))
			}),
			document.body.appendChild(_e)
	}
	_e.style.display = "flex"
}
function Hg() {
	_e && (_e.style.display = "none")
}
let Pn = null
function kg() {
	Pn ||
		((Pn = document.createElement("div")),
		(Pn.id = "orc-info-pane"),
		Object.assign(Pn.style, {
			position: "fixed",
			top: "80px",
			right: "0",
			width: "33.33%",
			height: "calc(100vh - 100px)",
			background:
				"linear-gradient(180deg, rgba(0, 20, 40, 0.95) 0%, rgba(0, 30, 50, 0.9) 100%)",
			borderLeft: "2px solid #00aaff",
			borderTop: "2px solid #00aaff",
			borderBottom: "2px solid #00aaff",
			borderTopLeftRadius: "16px",
			borderBottomLeftRadius: "16px",
			padding: "24px",
			boxShadow: "-10px 0 40px rgba(0, 170, 255, 0.2)",
			zIndex: "50",
			overflowY: "auto",
			display: "none",
		}),
		(Pn.innerHTML = `
			<h2 style="color: #00ffff; margin: 0 0 16px 0; font-size: 1.5rem; text-shadow: 0 0 10px rgba(0,255,255,0.3);">
				Orbital Refuse Collector
			</h2>
			<div style="color: #aaddff; font-size: 0.95rem; line-height: 1.6;">
				<p style="margin-bottom: 16px;">
					Interactive API documentation demo featuring real-time satellite orbit visualization.
				</p>
				<div style="border-top: 1px solid rgba(0,170,255,0.3); padding-top: 16px; margin-top: 16px;">
					<h3 style="color: #00aaff; font-size: 1.1rem; margin-bottom: 12px;">Satellite Status</h3>
					<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
						<div style="width: 12px; height: 12px; background: #00aaff; border-radius: 50%; box-shadow: 0 0 8px #00aaff;"></div>
						<span>GEO Satellite - Geosynchronous Orbit</span>
					</div>
					<div style="display: flex; align-items: center; gap: 10px;">
						<div style="width: 12px; height: 12px; background: #00ffaa; border-radius: 50%; box-shadow: 0 0 8px #00ffaa;"></div>
						<span>LEO Satellite - Low Earth Orbit</span>
					</div>
				</div>
				<div style="border-top: 1px solid rgba(0,170,255,0.3); padding-top: 16px; margin-top: 16px;">
					<h3 style="color: #00aaff; font-size: 1.1rem; margin-bottom: 12px;">API Documentation</h3>
					<p style="margin-bottom: 12px;">
						Full documentation available at:
					</p>
					<a href="https://jtj-inc.github.io/docusaurus-openapi-docs/" target="_blank"
					   style="color: #00ffff; text-decoration: none; display: inline-block; padding: 8px 16px;
					          border: 1px solid #00ffff; border-radius: 8px; transition: all 0.3s ease;">
						View API Docs
					</a>
				</div>
			</div>
		`),
		document.body.appendChild(Pn)),
		(Pn.style.display = "block")
}
function Uc() {
	Pn && (Pn.style.display = "none")
}
function In() {
	Og(), Bg(), zg(), Hg(), Uc()
	const i = document.getElementById("content-floor")
	i && i.classList.remove("show")
	const t = document.getElementById("content")
	t && (t.style.display = "none"), Vg(), (qt.enableZoom = !0)
}
const ns = { position: new U(0.5, 3.5, 4), target: new U(-1, 0, 0) },
	Nc = new U(-1.2, 0.35, 0)
function Gg() {
	const i = ++me
	In()
	for (const o in Yt) Yt[o] && (Yt[o].visible = !1)
	for (const o in Ke) Ke[o] && (Ke[o].visible = !1)
	fa()
	const t = 1200
	nt.scale.clone()
	const e = ae.position.clone(),
		n = ns.position.clone()
	;($e.visible = !0),
		$e.position.copy(nt.position),
		$e.scale.set(0.1, 0.1, 0.1),
		(fs.opacity = 0),
		nn || ((nn = Tg()), (nn.visible = !1), nn.position.copy(Nc), Vt.add(nn))
	const s = performance.now()
	function r(o) {
		if (i !== me) return
		const a = Math.min((o - s) / t, 1),
			h = a < 0.5 ? 2 * a * a : 1 - Math.pow(-2 * a + 2, 2) / 2,
			l = 1 - h * 0.9
		nt.scale.set(l, l, l),
			nt.children.forEach((c) => {
				c.isMesh &&
					c.material &&
					((c.material.opacity = 1 - h), (c.material.transparent = !0))
			})
		const d = 0.1 + h * 0.9
		if (
			($e.scale.set(d, d, d),
			(fs.opacity = h * 0.8),
			ae.position.lerpVectors(e, n, h),
			ae.lookAt(ns.target),
			qt.target.copy(ns.target),
			qt.update(),
			a < 1)
		)
			requestAnimationFrame(r)
		else {
			if (i !== me) return
			;(nt.visible = !1),
				($e.visible = !1),
				nn && (nn.visible = !0),
				(yr = !0),
				ae.position.copy(n),
				ae.lookAt(ns.target),
				qt.target.copy(ns.target),
				qt.update(),
				kg()
		}
	}
	requestAnimationFrame(r)
}
function Js() {
	const i = ++me,
		t = 1200,
		e = ae.position.clone(),
		n = un.position.clone()
	;($e.visible = !0),
		$e.position.copy(Nc),
		$e.scale.set(1, 1, 1),
		(fs.opacity = 0.8),
		nn && (nn.visible = !1),
		Uc(),
		(nt.visible = !0),
		(nt.position.x = xe.positionX),
		(nt.position.y = xe.positionY),
		(nt.rotation.x = 0),
		(nt.rotation.y = xe.rotationY),
		(nt.rotation.z = 0),
		nt.scale.set(0.1, 0.1, 0.1)
	for (const o in Yt) {
		if (o === "Home") continue
		const a = Yt[o]
		if (!a) continue
		if (a.parent !== nt) {
			const c = new U()
			a.getWorldPosition(c), nt.add(a)
		}
		a.userData.fixedNav = !1
		const h = a.userData.origPosition,
			l = a.userData.origRotation,
			d = a.userData.originalScale
		h && a.position.copy(h),
			l && a.rotation.copy(l),
			d && a.scale.copy(d),
			(a.visible = !0)
	}
	for (const o in Ke) Ke[o] && (Ke[o].visible = !0)
	nt.children.forEach((o) => {
		o.isMesh &&
			o.material &&
			!Object.values(Yt).includes(o) &&
			((o.material.opacity = 0), (o.material.transparent = !0))
	})
	const s = performance.now()
	function r(o) {
		if (i !== me) return
		const a = Math.min((o - s) / t, 1),
			h = a < 0.5 ? 2 * a * a : 1 - Math.pow(-2 * a + 2, 2) / 2,
			l = 1 - h * 0.9
		$e.scale.set(l, l, l), (fs.opacity = 0.8 * (1 - h))
		const d = 0.1 + h * 0.9
		if (
			(nt.scale.set(d, d, d),
			nt.children.forEach((c) => {
				c.isMesh &&
					c.material &&
					!Object.values(Yt).includes(c) &&
					(c.material.opacity = h)
			}),
			ae.position.lerpVectors(e, n, h),
			ae.lookAt(un.target),
			qt.target.copy(un.target),
			qt.update(),
			a < 1)
		)
			requestAnimationFrame(r)
		else {
			if (i !== me) return
			;($e.visible = !1),
				(yr = !1),
				(Ms = null),
				nt.scale.set(xe.scale, xe.scale, xe.scale),
				(nt.position.x = xe.positionX),
				(nt.position.y = xe.positionY),
				(nt.rotation.x = 0),
				(nt.rotation.y = xe.rotationY),
				(nt.rotation.z = 0),
				nt.children.forEach((c) => {
					c.isMesh &&
						c.material &&
						!Object.values(Yt).includes(c) &&
						((c.material.opacity = 1), (c.material.transparent = !1))
				})
			for (const c in Yt) {
				if (c === "Home") continue
				const f = Yt[c]
				if (!f) continue
				;(f.visible = !0),
					(f.userData.fixedNav = !1),
					f.parent !== nt && nt.add(f)
				const m = f.userData.origPosition,
					g = f.userData.origRotation,
					_ = f.userData.originalScale
				m && f.position.copy(m), g && f.rotation.copy(g), _ && f.scale.copy(_)
			}
			for (const c in Ke) Ke[c] && (Ke[c].visible = !0)
			ae.position.copy(n),
				ae.lookAt(un.target),
				qt.target.copy(un.target),
				qt.update(),
				nn && (Vt.remove(nn), Rg(), (nn = null)),
				Fc()
		}
	}
	requestAnimationFrame(r)
}
function Qs() {
	return yr
}
function fa() {
	try {
		const i = document.getElementById("home-button")
		i && (i.style.display = "block")
	} catch {}
}
function Fc() {
	try {
		const i = document.getElementById("home-button")
		i && (i.style.display = "none")
	} catch {}
}
function Oc() {
	requestAnimationFrame(Oc),
		(Cc.rotation.y += 8e-4),
		yr && wg(),
		qt.enabled && qt.update()
	for (const i in Yt) {
		const t = Yt[i],
			e = Ke[i]
		if (t && e) {
			const n = new U()
			t.getWorldPosition(n)
			const s = new fn()
			t.getWorldQuaternion(s)
			const r = new U(0, 0, 0.08)
			r.applyQuaternion(s), e.position.copy(n).add(r), e.quaternion.copy(s)
			const o = new U()
			t.getWorldScale(o), e.scale.copy(o)
		}
	}
	be && Bc(), Ze.render(Vt, ae)
}
window.addEventListener("resize", () => {
	;(ae.aspect = window.innerWidth / window.innerHeight),
		ae.updateProjectionMatrix(),
		Ze.setSize(window.innerWidth, window.innerHeight)
	const i = Vt.getObjectByName("bioPlane")
	i && Vt.remove(i)
	const t = Vt.getObjectByName("portfolioPlane")
	t && Vt.remove(t)
})
let Pe = null,
	ci = null,
	Fe = null,
	be = null,
	jn = 0,
	Kn = 0
function mr(i) {
	if (
		((be = i),
		Bc(),
		Pe || (Pe = document.getElementById("content-overlay")),
		!Pe)
	) {
		;(Pe = document.createElement("div")),
			(Pe.id = "content-overlay"),
			Object.assign(Pe.style, {
				position: "absolute",
				top: "25%",
				bottom: "0",
				left: "0",
				right: "0",
				zIndex: "10",
				display: "none",
				pointerEvents: "none",
			}),
			Pe.addEventListener("pointerdown", (s) => s.stopPropagation()),
			Pe.addEventListener("click", (s) => s.stopPropagation()),
			Pe.addEventListener("mousedown", (s) => s.stopPropagation()),
			Pe.addEventListener("touchstart", (s) => s.stopPropagation()),
			Pe.addEventListener("wheel", zc, { passive: !1 }),
			(ci = document.createElement("div")),
			Object.assign(ci.style, {
				position: "absolute",
				top: "10px",
				bottom: "10px",
				right: "10px",
				width: "8px",
				background: "rgba(255, 255, 255, 0.1)",
				borderRadius: "4px",
				cursor: "pointer",
				pointerEvents: "auto",
			}),
			(Fe = document.createElement("div")),
			Object.assign(Fe.style, {
				position: "absolute",
				top: "0",
				left: "0",
				width: "100%",
				height: "20%",
				background: "rgba(255, 255, 255, 0.5)",
				borderRadius: "4px",
				cursor: "grab",
			})
		let t = !1,
			e = 0,
			n = 0
		Fe.addEventListener("pointerdown", (s) => {
			s.stopPropagation(),
				s.target.setPointerCapture(s.pointerId),
				(t = !0),
				(e = s.clientY),
				(n = Fe.offsetTop),
				(Fe.style.cursor = "grabbing")
		}),
			Fe.addEventListener("pointermove", (s) => {
				if (!t) return
				s.stopPropagation()
				const r = s.clientY - e,
					o = ci.clientHeight,
					a = Fe.clientHeight,
					h = o - a
				let l = n + r
				l = Math.max(0, Math.min(l, h))
				const d = h > 0 ? l / h : 0
				be && Kn > jn && (be.position.y = jn + d * (Kn - jn)), gr()
			}),
			Fe.addEventListener("pointerup", (s) => {
				;(t = !1),
					(Fe.style.cursor = "grab"),
					s.target.releasePointerCapture(s.pointerId)
			}),
			ci.appendChild(Fe),
			Pe.appendChild(ci),
			document.body.appendChild(Pe)
	}
	;(Pe.style.display = "block"), gr()
}
function Vg() {
	Pe && (Pe.style.display = "none"), (be = null)
}
function Bc() {
	if (!be) return
	const i = new Xi().setFromObject(be),
		t = i.max.y - i.min.y
	if (t === -1 / 0 || isNaN(t)) return
	const e = t - 1.5
	;(jn = 0),
		(Kn = Math.max(0, e)),
		be.position.y > Kn && (be.position.y = Kn),
		gr()
}
function zc(i) {
	be &&
		(i.preventDefault(),
		i.stopPropagation(),
		(be.position.y += i.deltaY * 0.005),
		be.position.y < jn && (be.position.y = jn),
		be.position.y > Kn && (be.position.y = Kn),
		gr())
}
function gr() {
	if (!be || !Fe || !ci) return
	const i = Kn - jn
	if (i <= 0.001) {
		;(Fe.style.height = "100%"), (Fe.style.top = "0")
		return
	}
	const t = (be.position.y - jn) / i,
		e = ci.clientHeight,
		n = 5.6,
		s = i + n
	let r = (n / s) * e
	;(r = Math.max(30, Math.min(r, e))), (Fe.style.height = `${r}px`)
	const o = e - r
	Fe.style.top = `${t * o}px`
}
window.addEventListener(
	"wheel",
	(i) => {
		Ms && be && zc(i)
	},
	{ passive: !1 }
)
class Wg {
	constructor() {
		;(this.currentRoute = this.getCurrentRoute()),
			(this.listeners = []),
			window.addEventListener("popstate", () => {
				;(this.currentRoute = this.getCurrentRoute()), this.notify()
			})
	}
	getCurrentRoute() {
		return window.location.pathname
	}
	navigate(t) {
		window.history.pushState({}, "", t), (this.currentRoute = t), this.notify()
	}
	onRouteChange(t) {
		this.listeners.push(t)
	}
	notify() {
		this.listeners.forEach((t) => t(this.currentRoute))
	}
}
const hi = new Wg()
document.getElementById("scene-container").appendChild(Ze.domElement)
;(function () {
	if (document.getElementById("home-button")) return
	const e = document.createElement("button")
	;(e.id = "home-button"),
		(e.textContent = "Home"),
		(e.style.position = "fixed"),
		(e.style.left = "16px"),
		(e.style.top = "12px"),
		(e.style.zIndex = 1e4),
		(e.style.padding = "8px 14px"),
		(e.style.background = "rgba(0,0,0,0.6)"),
		(e.style.color = "white"),
		(e.style.border = "1px solid rgba(255,255,255,0.08)"),
		(e.style.borderRadius = "4px"),
		(e.style.font = "600 14px sans-serif"),
		(e.style.cursor = "pointer"),
		(e.style.backdropFilter = "blur(4px)"),
		(e.style.display = "none"),
		e.addEventListener("mousedown", (n) => n.stopPropagation()),
		e.addEventListener("click", (n) => {
			n.stopPropagation()
			try {
				hi.navigate("/")
			} catch (s) {
				console.error("Home button handler error", s)
			}
		}),
		document.body.appendChild(e)
})()
Ng(ng)
Oc()
window.addEventListener("resize", () => {})
const gn = new _u(),
	kn = new Dt()
let qe = null,
	Ae = null,
	_r = new Dt(),
	pa = !1,
	ps = !1
const Xg = 5
function Yg(i) {
	i.target.tagName === "CANVAS" &&
		((pa = !0), (ps = !1), (_r.x = i.clientX), (_r.y = i.clientY))
}
window.addEventListener("mousedown", Yg)
window.addEventListener("mousemove", (i) => {
	if (pa) {
		const t = i.clientX - _r.x,
			e = i.clientY - _r.y
		Math.sqrt(t * t + e * e) > Xg && (ps = !0)
	}
})
window.addEventListener("mouseup", (i) => {
	if (((pa = !1), !ps)) {
		if (i.target.tagName !== "CANVAS") return
		jg(i)
	}
	ps = !1
})
window.addEventListener(
	"click",
	(i) => {
		const t = document.getElementById("content"),
			e = document.getElementById("home-button")
		;(t && t.contains(i.target)) ||
			(e && e.contains(i.target)) ||
			(i.preventDefault(), i.stopPropagation())
	},
	!0
)
function qg(i) {
	try {
		const n = Ze.domElement.getBoundingClientRect()
		;(kn.x = ((i.clientX - n.left) / n.width) * 2 - 1),
			(kn.y = -((i.clientY - n.top) / n.height) * 2 + 1)
	} catch {
		;(kn.x = (i.clientX / window.innerWidth) * 2 - 1),
			(kn.y = -(i.clientY / window.innerHeight) * 2 + 1)
	}
	gn.setFromCamera(kn, ae)
	const t = Vt.getObjectByName("portfolioPlane")
	if (t) {
		const n = t.children.filter((s) => s && s.userData && s.userData.link)
		if (n.length > 0 && gn.intersectObjects(n, !1).length > 0) {
			Ze.domElement.style.cursor = "pointer"
			return
		}
	}
	const e = gn.intersectObjects(Object.values(Ke))
	if (
		(qe &&
			(e.some((s) => s.object.userData.labelKey === qe.userData.name) ||
				(qe.scale.copy(qe.userData.originalScale),
				(qe = null),
				(Ze.domElement.style.cursor = "default"))),
		e.length > 0)
	) {
		const s = e[0].object.userData.labelKey,
			r = Yt[s]
		r &&
			r.visible &&
			qe !== r &&
			s !== "Home" &&
			r.userData.originalScale &&
			((qe = r), qe.scale.copy(qe.userData.originalScale).multiplyScalar(1.12)),
			(Ze.domElement.style.cursor = "pointer")
	} else
		qe && (qe.scale.copy(qe.userData.originalScale), (qe = null)),
			(Ze.domElement.style.cursor = "default")
}
window.addEventListener("mousemove", qg)
try {
	qt &&
		qt.addEventListener &&
		qt.addEventListener("start", () => {
			fa()
		})
} catch {}
function Di(i) {
	if (!Yt || !Yt[i]) return
	try {
		fa()
	} catch {}
	const t = nt.position.y >= 1.5
	if (t) {
		In()
		const e = i.toLowerCase()
		console.log("pyramidGroup at top nav state:", nt),
			Ic(e, () => {
				i === "Bio" ? ua() : i === "Portfolio" ? Ni() : i === "Blog" && da()
			})
	} else t || ss(!0, i.toLowerCase())
	window.centeredLabelName = i
}
hi.onRouteChange((i) => {
	i === "/bio"
		? Qs()
			? (Js(),
			  setTimeout(() => {
					Di("Bio"), (Ae = "bio")
			  }, 1300))
			: (Di("Bio"), (Ae = "bio"))
		: i === "/portfolio"
		? Qs()
			? (Js(),
			  setTimeout(() => {
					Di("Portfolio"), (Ae = "portfolio")
			  }, 1300))
			: (Di("Portfolio"), (Ae = "portfolio"))
		: i === "/blog"
		? Qs()
			? (Js(),
			  setTimeout(() => {
					Di("Blog"), (Ae = "blog")
			  }, 1300))
			: (Di("Blog"), (Ae = "blog"))
		: i === "/orc-demo"
		? (Gg(), (Ae = "orc-demo"), (window.centeredLabelName = null))
		: (Qs() ? Js() : Fg(), In(), (Ae = null), (window.centeredLabelName = null))
})
hi.notify()
function jg(i) {
	if (ps) return
	;(kn.x = (i.clientX / window.innerWidth) * 2 - 1),
		(kn.y = -(i.clientY / window.innerHeight) * 2 + 1),
		gn.setFromCamera(kn, ae)
	function t(l) {
		try {
			const d = new URL(l)
			if (d.hostname.includes("youtube.com")) return d.searchParams.get("v")
			if (d.hostname === "youtu.be") return d.pathname.slice(1)
		} catch {
			return null
		}
		return null
	}
	function e(l) {
		try {
			const d = new URL(l)
			if (d.hostname.includes("docs.google.com")) {
				const c = d.pathname.match(/\/document\/d\/([^\/]+)/)
				return c ? c[1] : null
			}
		} catch {
			return null
		}
		return null
	}
	function n(l) {
		try {
			const c = new URL(l).pathname.toLowerCase()
			return /\.(png|jpg|jpeg|gif|webp|svg|bmp)$/.test(c)
		} catch {
			return !1
		}
	}
	function s(l) {
		if (!l) return !1
		if (l.startsWith("/")) return hi.navigate(l), !0
		const d = t(l),
			c = document.getElementById("content")
		try {
			In()
		} catch {
			window.hideAllPlanes && window.hideAllPlanes()
		}
		if ((c && ((c.style.bottom = ""), (c.style.maxHeight = "")), d)) {
			if (c) {
				c.innerHTML = ""
				try {
					const _ = window.innerHeight - 85 - 20
					;(c.style.maxHeight = "none"),
						(c.style.height = _ + "px"),
						(c.style.top = "85px"),
						(c.style.left = "40px"),
						(c.style.right = "40px"),
						(c.style.width = "auto"),
						(c.style.transform = "none")
					const p = document.createElement("button")
					;(p.innerHTML = "&times;"),
						(p.style.cssText = `
						position: absolute;
						top: 10px;
						right: 10px;
						width: 36px;
						height: 36px;
						border: 2px solid #00ffff;
						border-radius: 50%;
						background: rgba(0, 0, 0, 0.8);
						color: #00ffff;
						font-size: 24px;
						line-height: 1;
						cursor: pointer;
						z-index: 10;
						display: flex;
						align-items: center;
						justify-content: center;
					`),
						(p.onmouseover = () => {
							p.style.background = "rgba(0, 255, 255, 0.3)"
						}),
						(p.onmouseout = () => {
							p.style.background = "rgba(0, 0, 0, 0.8)"
						}),
						(p.onclick = (T) => {
							T.preventDefault(),
								T.stopPropagation(),
								nt && ((nt.visible = !0), ss(!0, "portfolio")),
								(c.innerHTML = ""),
								(c.style.display = "none"),
								(c.style.height = ""),
								(c.style.top = ""),
								(c.style.left = ""),
								(c.style.right = ""),
								(c.style.width = ""),
								(c.style.transform = ""),
								(c.style.maxHeight = ""),
								(c.style.overflow = ""),
								(c.style.padding = ""),
								Ni(),
								(Ae = "portfolio")
						})
					const u = document.createElement("iframe")
					u.setAttribute(
						"src",
						`https://www.youtube.com/embed/${d}?autoplay=1&rel=0&modestbranding=1`
					),
						u.setAttribute("width", "100%"),
						(u.style.height = "calc(100% - 20px)"),
						u.setAttribute(
							"allow",
							"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						),
						u.setAttribute("frameborder", "0"),
						u.setAttribute("allowfullscreen", "")
					const b = document.createElement("div")
					return (
						(b.className = "video-wrapper"),
						(b.id = "embedded-video-wrapper"),
						(b.style.width = "100%"),
						(b.style.height = "100%"),
						(b.style.overflow = "hidden"),
						(b.style.position = "relative"),
						b.appendChild(u),
						b.appendChild(p),
						c.appendChild(b),
						(c.style.display = "block"),
						(c.style.overflow = "hidden"),
						(c.style.padding = "0"),
						(c.style.zIndex = String(2147483646)),
						(c.style.position = "fixed"),
						(c.style.pointerEvents = "auto"),
						(Ae = "portfolio"),
						!0
					)
				} catch (f) {
					return (
						console.error("Failed to create YouTube iframe:", f),
						window.open(l, "_blank"),
						!0
					)
				}
			}
		} else {
			const f = e(l)
			if (f && c) {
				c.innerHTML = ""
				const m = 40,
					g = 85,
					p = window.innerHeight - g - 20
				;(c.style.maxHeight = "none"),
					(c.style.height = p + "px"),
					(c.style.top = g + "px"),
					(c.style.left = m + "px"),
					(c.style.right = m + "px"),
					(c.style.width = "auto"),
					(c.style.transform = "none")
				const u = document.createElement("button")
				;(u.innerHTML = "&times;"),
					(u.style.cssText = `
					position: absolute;
					top: 10px;
					right: 10px;
					width: 36px;
					height: 36px;
					border: 2px solid #00ffff;
					border-radius: 50%;
					background: rgba(0, 0, 0, 0.8);
					color: #00ffff;
					font-size: 24px;
					line-height: 1;
					cursor: pointer;
					z-index: 10;
					display: flex;
					align-items: center;
					justify-content: center;
				`),
					(u.onmouseover = () => {
						u.style.background = "rgba(0, 255, 255, 0.3)"
					}),
					(u.onmouseout = () => {
						u.style.background = "rgba(0, 0, 0, 0.8)"
					}),
					(u.onclick = (S) => {
						S.preventDefault(),
							S.stopPropagation(),
							nt && ((nt.visible = !0), ss(!0, "portfolio")),
							(c.innerHTML = ""),
							(c.style.display = "none"),
							(c.style.height = ""),
							(c.style.top = ""),
							(c.style.left = ""),
							(c.style.right = ""),
							(c.style.width = ""),
							(c.style.transform = ""),
							(c.style.maxHeight = ""),
							(c.style.overflow = ""),
							(c.style.padding = ""),
							Ni(),
							(Ae = "portfolio")
					})
				const b = document.createElement("iframe")
				;(b.src = `https://docs.google.com/document/d/${f}/preview`),
					(b.width = "100%"),
					(b.style.height = "calc(100% - 20px)"),
					(b.style.border = "1px solid #00ffff"),
					(b.style.borderRadius = "8px"),
					(b.style.display = "block")
				const T = document.createElement("div")
				return (
					(T.className = "doc-wrapper"),
					(T.style.width = "100%"),
					(T.style.height = "100%"),
					(T.style.overflow = "hidden"),
					(T.style.position = "relative"),
					T.appendChild(b),
					T.appendChild(u),
					c.appendChild(T),
					(c.style.display = "block"),
					(c.style.overflow = "hidden"),
					(c.style.padding = "0"),
					(c.style.zIndex = String(2147483646)),
					(c.style.position = "fixed"),
					(c.style.pointerEvents = "auto"),
					(Ae = "portfolio"),
					!0
				)
			}
			if (n(l)) {
				c.innerHTML = ""
				const m = 40,
					g = 85,
					p = window.innerHeight - g - 20
				;(c.style.maxHeight = "none"),
					(c.style.height = p + "px"),
					(c.style.top = g + "px"),
					(c.style.left = m + "px"),
					(c.style.right = m + "px"),
					(c.style.width = "auto"),
					(c.style.transform = "none")
				const u = document.createElement("button")
				;(u.innerHTML = "&times;"),
					(u.style.cssText = `
					position: absolute;
					top: 10px;
					right: 10px;
					width: 36px;
					height: 36px;
					border: 2px solid #00ffff;
					border-radius: 50%;
					background: rgba(0, 0, 0, 0.8);
					color: #00ffff;
					font-size: 24px;
					line-height: 1;
					cursor: pointer;
					z-index: 10;
					display: flex;
					align-items: center;
					justify-content: center;
				`),
					(u.onmouseover = () => {
						u.style.background = "rgba(0, 255, 255, 0.3)"
					}),
					(u.onmouseout = () => {
						u.style.background = "rgba(0, 0, 0, 0.8)"
					}),
					(u.onclick = (R) => {
						R.preventDefault(),
							R.stopPropagation(),
							nt && ((nt.visible = !0), ss(!0, "portfolio")),
							(c.innerHTML = ""),
							(c.style.display = "none"),
							(c.style.height = ""),
							(c.style.top = ""),
							(c.style.left = ""),
							(c.style.right = ""),
							(c.style.width = ""),
							(c.style.transform = ""),
							(c.style.maxHeight = ""),
							(c.style.overflow = ""),
							(c.style.padding = ""),
							Ni(),
							(Ae = "portfolio")
					})
				const b = document.createElement("img")
				;(b.src = l),
					(b.alt = "Visual Resume"),
					(b.style.width = "100%"),
					(b.style.height = "auto"),
					(b.style.display = "block"),
					(b.style.margin = "0 auto")
				const T = document.createElement("div")
				;(T.className = "image-wrapper"),
					(T.style.width = "100%"),
					(T.style.height = "100%"),
					(T.style.overflow = "auto"),
					(T.style.position = "relative"),
					T.appendChild(b)
				let S = 1
				const C = (R) => {
						;(S = Math.max(0.25, R)),
							(b.style.width = `${S * 100}%`),
							(b.style.maxWidth = "none")
					},
					w = document.createElement("div")
				w.style.cssText = `
					position: absolute;
					bottom: 20px;
					right: 20px;
					display: flex;
					gap: 10px;
					z-index: 11;
				`
				const E = `
					width: 40px;
					height: 40px;
					border: 2px solid #00ffff;
					border-radius: 50%;
					background: rgba(0, 0, 0, 0.8);
					color: #00ffff;
					font-size: 24px;
					line-height: 1;
					cursor: pointer;
					display: flex;
					align-items: center;
					justify-content: center;
					user-select: none;
				`,
					D = document.createElement("div")
				;(D.innerHTML = "+"),
					(D.style.cssText = E),
					(D.onclick = (R) => {
						R.stopPropagation(), C(S + 0.25)
					})
				const v = document.createElement("div")
				;(v.innerHTML = "&minus;"),
					(v.style.cssText = E),
					(v.onclick = (R) => {
						R.stopPropagation(), C(S - 0.25)
					})
				const y = (R) => {
					;(R.onmouseover = () =>
						(R.style.background = "rgba(0, 255, 255, 0.3)")),
						(R.onmouseout = () => (R.style.background = "rgba(0, 0, 0, 0.8)"))
				}
				return (
					y(D),
					y(v),
					w.appendChild(v),
					w.appendChild(D),
					T.addEventListener(
						"wheel",
						(R) => {
							R.preventDefault(), R.stopPropagation()
							const L = R.deltaY > 0 ? -1 : 1
							C(S + L * 0.1)
						},
						{ passive: !1 }
					),
					c.appendChild(T),
					c.appendChild(u),
					c.appendChild(w),
					(c.style.display = "block"),
					(c.style.overflow = "hidden"),
					(c.style.padding = "0"),
					(c.style.zIndex = String(2147483646)),
					(c.style.position = "fixed"),
					(c.style.pointerEvents = "auto"),
					(Ae = "portfolio"),
					!0
				)
			}
			return window.open(l, "_blank"), !0
		}
		return !1
	}
	try {
		const l = Vt.getObjectByName("portfolioPlane")
		if (l) {
			const d = l.children.filter((c) => c && c.userData && c.userData.link)
			if (d.length > 0) {
				const c = gn.intersectObjects(d, !0)
				if (c.length > 0) {
					let f = c[0].object
					for (; f; ) {
						if (f.userData && f.userData.link) {
							console.debug(
								"[onSceneMouseDown] EARLY clicked portfolio link:",
								f.userData.link
							)
							try {
								if (s(f.userData.link)) return
							} catch (m) {
								console.error("Error handling content link (early)", m)
							}
						}
						f = f.parent
					}
				}
			}
		}
	} catch {}
	const r = gn.intersectObjects(Object.values(Ke))
	let o = null
	if (r.length > 0) {
		const d = r[0].object.userData.labelKey
		o = Yt[d]
	} else {
		const l = gn.intersectObjects(Object.values(Yt))
		l.length > 0 && (o = l[0].object)
	}
	if (o) {
		let l = o.userData.name
		if (l === "Home") {
			hi.navigate("/")
			return
		}
		if (
			(console.debug(
				"[onClick] clicked object labelName=",
				l,
				"active=",
				window.centeredLabelName
			),
			window.centeredLabelName !== l)
		) {
			if (nt.position.y >= 0.75) {
				In()
				const c = l.toLowerCase()
				console.log("pyramidGroup at top nav state:", nt),
					Ic(c, () => {
						l === "Bio"
							? (ua(), (Ae = "bio"))
							: l === "Portfolio"
							? (Ni(), (Ae = "portfolio"))
							: l === "Blog" && (da(), (Ae = "blog"))
					}),
					(window.centeredLabelName = l)
			} else ss(!0, l.toLowerCase()), (window.centeredLabelName = l)
			hi.navigate("/" + l.toLowerCase())
		}
		return
	}
	const a = Vt.getObjectByName("portfolioPlane")
	if (a) {
		const l = a.children.filter((d) => d && d.userData && d.userData.link)
		if (l.length > 0) {
			const d = gn.intersectObjects(l, !0)
			if (d.length > 0) {
				let c = d[0].object
				for (; c; ) {
					if (c.userData && c.userData.link) {
						console.debug(
							"[onSceneMouseDown] clicked portfolio link:",
							c.userData.link
						)
						try {
							if (s(c.userData.link)) return
						} catch (f) {
							console.error("Error handling content link", f)
						}
					}
					c = c.parent
				}
			}
		} else {
			const d = gn.intersectObjects([a], !0)
			if (d.length > 0) {
				let f = d[0].object
				for (; f; ) {
					if (f.userData && f.userData.link) {
						console.debug(
							"[onSceneMouseDown] clicked portfolio link (fallback):",
							f.userData.link
						)
						try {
							if (s(f.userData.link)) return
						} catch (m) {
							console.error("Error handling content link", m)
						}
					}
					f = f.parent
				}
			}
		}
	}
	const h = gn.intersectObjects(nt.children, !0)
	if (h.length > 0) {
		const d = h[0].object
		if (Object.values(Yt).includes(d) || (d.name || "").endsWith("_hover"))
			return
		hi.navigate("/")
	}
}
