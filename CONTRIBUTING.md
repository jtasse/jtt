# Contributing Guidelines

This document provides guidelines for contributing to this project, whether you're a human developer or an AI coding assistant (Claude, Gemini, GitHub Copilot, etc.).

## Table of Contents

- [AI Coding Assistants](#ai-coding-assistants)
- [File Placement Rules](#file-placement-rules)
- [Architecture Rules](#architecture-rules)
- [Styling Rules](#styling-rules)
- [Responsive Design Rules](#responsive-design-rules)
- [Hand of ORC Rules](#hand-of-orc-rules)
- [File Size Limits](#file-size-limits)
- [Configuration and Constants](#configuration-and-constants)
- [Testing](#testing)
- [Quick Reference for AI Assistants](#quick-reference-for-ai-assistants)

## AI Coding Assistants

**If you are an AI assistant**, read this entire document before making changes. These rules are **mandatory**.

---

## File Placement Rules

### Source Code Location

All source code files MUST be created or modified under:

```
/src
```

Before attempting to create a file in another location, ASK FIRST.

### Content Locations

Content includes files that relate to the `About`, `Portfolio`, `Blog`, and `ORC Demo` pages.

#### Blog

Blog content must live under `src\content\blog`. More specifically:

- The `src\content\blog` folder contains the files for the blog post navigation page.
- The `src\content\blog\posts` folder contains the files for individual blog posts.

#### Portfolio

The Portfolio navigation page lives within `src\content\portfolio`. For now, portfolio content is stored externally, but should be viewable via a viewer on the portfolio navigation page.

#### Orc Demo

Files under `src\content\orc-demo` are for the Orc Demo, which should be treated as special interactive content. Accordingly, be careful when making changes within this folder, especially if the changes hould only apply to `Blog` or `Portfolio` content.

### Exceptions

Files may exist outside `/src` ONLY if they are:

- Project configuration files (e.g., `package.json`, `vite.config.js`)
- Tooling configuration (e.g., `.eslintrc`, `.prettierrc`)
- Project guidelines (e.g., `README.md`, `ARCHITECTURE.md`)
- Documentation (under `packages/docs`)
- Test files (under `/tests`)

### Prohibited Behavior

- Do NOT create files in the project root without asking first
- Do NOT recreate files that already exist under `/src`
- If a file already exists, ALWAYS update it in place

### If Unsure

- Ask before creating a new file
- Always prefer modifying an existing file under `/src`

---

## Architecture Rules

### Hybrid Rendering Model

This project uses a **hybrid architecture**:

| What                                   | Where                     | Technology |
| -------------------------------------- | ------------------------- | ---------- |
| 3D elements (pyramid, hand, starfield) | WebGL canvas              | Three.js   |
| Page content (About, Portfolio, Blog)  | DOM overlays              | HTML/CSS   |
| Navigation labels                      | WebGL (may move to CSS3D) | Three.js   |

**Important:** Do NOT render text content to canvas textures. Use DOM elements for any readable text content.

### Content Display Pattern

```javascript
// WRONG - Do not create canvas textures for content:
const texture = createCanvasTexture(htmlContent)
const plane = new THREE.Mesh(
	geometry,
	new THREE.MeshBasicMaterial({ map: texture })
)

// CORRECT - Use DOM overlays:
document.getElementById("content-overlay").innerHTML = htmlContent
document.getElementById("content-overlay").classList.add("visible")
```

---

## Styling Rules

### Accessibility

First and foremost, the styling of text and other content should always support accessibility.

With this in mind:

- All pages should use an accessible font. For the time being, Helvetica or Roboto should be used everywhere.
- Images should always have alt text.
- Any other reasonable measures, including catering to screen readers, should be taken to enhance accessibility.
- Ideally, a light theme should be available to users on pages that are text-heavy.

### Separation of Concerns

As stated in the [Architecture](./ARCHITECTURE.md) document, wherever possible we **MUST** follow the traditional web development approach of putting:

- _Content_ in HTML
- _Styles_ in CSS
- _Logic_ in in JavaScript

This may be difficult if not impossible for 3D scenes, but following this approach on other pages is **mandatory** as it will make maintenance, enhancement, and testing much easier.

I understand there will be exceptions to this rule, but if you believe that we need to violate this principle, ASK FIRST.

See below for additional guidelines regarding separation of concerns.

#### HTML

HTML is for content, not scripts or styles!

#### CSS

CSS is REQUIRED for:

- Colors, fonts, sizes
- Layout and positioning of DOM elements
- Responsive breakpoints (`@media` queries)
- Visibility toggling (`.visible`, `.hidden` classes)
- Transitions and animations (when possible)

##### Adding New Styles

1. Find the appropriate CSS file in `src/content/[section]/[section].css`
2. Add your CSS class there
3. Apply via `element.classList.add('your-class')` in JavaScript
4. Never create inline styles

#### JavaScript

##### JavaScript is REQUIRED for:

- Three.js object properties (positions, rotations, scales in 3D space)
- GSAP animations on Three.js objects
- Calculations that depend on runtime values (camera frustum, etc.)

##### Forbidden JavaScript Patterns

```javascript
// NEVER do this - inline styles in JavaScript:
element.style.color = "white"
element.style.fontSize = "16px"
element.style.top = "100px"
element.style.left = "50px"
element.style.display = "none"
element.style.opacity = "0"

// ALWAYS do this - use CSS classes:
element.classList.add("text-white")
element.classList.add("text-large")
element.classList.add("position-top")
element.classList.remove("visible")
```

#### Exception: GSAP Animations

GSAP may animate transform properties directly when animating DOM elements, but only for:

- `x`, `y` (translation)
- `scale`, `rotation`
- `opacity` (for fade animations)

GSAP should NOT be used to set:

- `fontSize`, `color`, `backgroundColor`
- `top`, `left`, `right`, `bottom`
- `width`, `height`, `padding`, `margin`

---

## Responsive Design Rules

### DOM Content

Use CSS for responsive DOM layouts:

- Viewport units (`vw`, `vh`, `vmin`, `vmax`)
- `clamp()`, `min()`, `max()` functions
- Media queries for breakpoints
- Flexbox/Grid for layouts

### 3D Elements (Three.js)

Use **frustum-based calculations** for responsive 3D positioning:

```javascript
// WRONG - hardcoded positions:
label.position.set(3.0, 2.5, 0)

// CORRECT - calculate from viewport:
function getViewportPosition(percentX, percentY, camera) {
	const vFov = (camera.fov * Math.PI) / 180
	const height = 2 * Math.tan(vFov / 2) * camera.position.z
	const width = height * camera.aspect
	return new THREE.Vector3(
		(percentX - 0.5) * width,
		(percentY - 0.5) * height,
		0
	)
}

// Position at 80% from left, 90% from bottom:
label.position.copy(getViewportPosition(0.8, 0.9, camera))
```

### Window Resize

All renderers and cameras must respond to window resize:

```javascript
window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)

	// Also update any secondary renderers (e.g., ORC demo)
	if (secondaryRenderer && secondaryCamera) {
		const container = secondaryRenderer.domElement.parentElement
		const rect = container.getBoundingClientRect()
		secondaryCamera.aspect = rect.width / rect.height
		secondaryCamera.updateProjectionMatrix()
		secondaryRenderer.setSize(rect.width, rect.height)
	}
})
```

---

## Hand of ORC Rules

The "Hand of ORC" is a complex 3D character. Follow these rules when modifying it:

### Use High-Level APIs

When available, use behavior methods instead of direct manipulation:

```javascript
// PREFERRED - high-level behavior:
hand.pointAt(targetObject)
hand.travelTo(destination)
hand.gesture("thumbsUp")

// AVOID - direct mesh manipulation:
hand.mesh.position.lerp(target, 0.1)
hand.fingers.index.rotation.z = -0.5
```

### Critical Constraints

1. **Z-Position Constraint:** The hand must NEVER be positioned where `z < 0.5` in the ORC scene (behind the planet). All movement functions must enforce this.

2. **State Machine:** Hand state transitions should go through the state machine, not be set directly.

3. **Satellite Occlusion:** During decommissioning animations, the hand must not occlude the target satellite from the camera's view.

### Adding New Behaviors

To add a new hand behavior:

1. Define the behavior as a method in the hand module
2. Document the expected inputs and resulting animation
3. Call the method from main code - don't implement animation logic inline

---

## File Size Limits

### Maximum File Size: 500 Lines

No single source file should exceed 500 lines of code.

**Current exceptions (technical debt):**

- `src/pyramid.js` (~2,800 lines) - needs refactoring
- `src/content/orc-demo/orc-demo.js` (~2,400 lines) - needs refactoring
- `src/content/orc-demo/orc-hand.js` (~1,600 lines) - needs refactoring

### When Approaching the Limit

1. Stop and discuss splitting the file before adding more code
2. Identify logical boundaries for extraction
3. Create new modules with clear, single responsibilities

### Preferred Module Structure

```
src/
├── core/           # Scene setup, camera, layout management
├── pyramid/        # Pyramid mesh and animations
├── navigation/     # Navigation labels and transitions
├── hand/           # Hand of ORC (self-contained module)
├── content/        # HTML content and CSS (existing)
│   ├── about/
│   ├── blog/
│   ├── portfolio/
│   └── orc-demo/
└── main.js         # Entry point, wiring only
```

---

## Configuration and Constants

### No Magic Numbers

Avoid hardcoded values scattered throughout the code:

```javascript
// WRONG - magic numbers:
if (position.z < 0.5) { ... }
hand.scale.setScalar(7);
camera.position.z = 6;

// CORRECT - named constants:
const MIN_FRONT_Z = 0.5;
const HAND_SCALE = 7;
const CAMERA_HOME_Z = 6;

if (position.z < MIN_FRONT_Z) { ... }
hand.scale.setScalar(HAND_SCALE);
camera.position.z = CAMERA_HOME_Z;
```

### Centralized Configuration

When `src/config.js` exists, add constants there:

```javascript
// src/config.js
export const CONFIG = {
	camera: { fov: 50, homeZ: 6 },
	hand: { scale: 7, minFrontZ: 0.5 },
	navigation: { labelY: 2.5 },
}
```

---

## Testing

### Test Location

All tests go in the `/tests` directory.

### Running Tests

```bash
npm run test:test   # Run tests once
npm run test        # Run tests in watch mode
```

### What to Test

Priority areas for testing:

1. Layout calculations (frustum math, responsive positioning)
2. State machine transitions (hand states, navigation states)
3. DOM visibility states (content overlay show/hide)

---

## Quick Reference for AI Assistants

Before making any change, verify:

- [ ] New files go in `/src` (not project root)
- [ ] No inline styles in HTML (use CSS classes)
- [ ] No inline scripts in HTML (use separate js files)
- [ ] Content uses DOM overlays (not canvas textures)
- [ ] 3D positions use frustum calculations (not hardcoded)
- [ ] Hand changes use high-level APIs (not direct mesh manipulation)
- [ ] File stays under 500 lines (discuss if approaching limit)
- [ ] No new magic numbers (use named constants)
