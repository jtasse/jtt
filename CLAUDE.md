# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A 3D interactive personal website built with Three.js featuring a rotating pyramid with clickable face labels (Bio, Portfolio, Blog) that animate into a top navigation menu when selected.

## Commands

```bash
npm run dev        # Start Vite dev server (hot reload)
npm run dev:docs   # Start Astro Starlight docs dev server
npm run build      # Build both main site and docs
npm run build:main # Build main site only
npm run build:docs # Build docs only
```

## Architecture

### Core Structure

- **src/main.js** - Application entry point. Initializes labels, handles click/hover detection via raycasting, manages route changes, and coordinates between pyramid animations and content display.

- **src/pyramid/pyramid.js** - The heart of the 3D scene. Contains:

  - Three.js scene setup (camera, renderer, lighting, starfield)
  - Pyramid geometry with three labeled faces
  - Animation functions: `animatePyramid()`, `spinPyramidToSection()`, `resetPyramidToHome()`
  - Content plane display: `showBioPlane()`, `showPortfolioPlane()`, `showBlogPlane()`
  - Label management and positioning

- **src/planes.js** - Canvas-based text rendering for 3D planes. Creates textures from HTML content for Bio, Portfolio, and Blog sections. Also provides `makeLabelPlane()` for face labels.

- **src/router.js** - Simple client-side router using History API. Routes: `/`, `/bio`, `/portfolio`, `/blog`

- **src/contentLoader.js** - Fetches and parses HTML content files into structured data for rendering.

### Content Layer

Content is stored as HTML in `src/content/` and rendered to canvas textures (not DOM):

- `src/content/bio.html` - Bio page markup
- `src/content/portfolio.html` - Portfolio items
- `src/content/blog.html` - Blog posts as JSON in script tag

See `ARCHITECTURE.md` for detailed content editing instructions.

### Key Animation Flow

1. **Home state**: Pyramid centered with labels on faces
2. **Label click**: Labels animate to horizontal top nav, pyramid moves up/shrinks under selected label
3. **Section switch**: Pyramid slides horizontally to new label position
4. **Home click**: Everything animates back to initial state

### Important State Variables

- `pyramidGroup` - The Three.js group containing pyramid mesh and labels
- `labels` - Object mapping label names to their mesh objects
- `flattenedLabelPositions` - World positions for top nav layout
- `pyramidXPositions` - Pyramid X positions when behind each nav label
- `isAtBottom` - Tracks if pyramid is in flattened menu state

## Dependencies

- **three** - 3D rendering
- **gsap** - Animation library
- **lil-gui** - Debug GUI (dev only)
- **vite** - Build tooling

---

## AI Assistant Guidelines

These rules apply to Claude Code, Gemini, GitHub Copilot, and any other AI coding assistants. See also `CONTRIBUTING.md` for general guidelines.

### Architectural Direction: Hybrid Rendering

We are transitioning to a **hybrid architecture**:

| Layer | Technology | Content |
|-------|------------|---------|
| **WebGL (Three.js)** | Canvas | Pyramid, starfield, Hand of ORC, navigation labels |
| **DOM Overlay** | HTML/CSS | Page content (About, Portfolio, Blog) |

**Why:** Canvas-rendered text (current `planes.js` approach) cannot be made responsive or accessible. DOM overlays give us CSS responsiveness and screen reader support.

**When implementing content display:**
```javascript
// ❌ OLD: Do not create new canvas textures for content
const plane = makeAboutPlane(content);
scene.add(plane);

// ✅ NEW: Use DOM overlays
const overlay = document.getElementById('about-content');
overlay.innerHTML = content;
overlay.classList.add('visible');
```

### Styling Rules

**CSS is REQUIRED for:**
- All text styling (fonts, colors, sizes)
- Layout of DOM content
- Responsive breakpoints and media queries
- Visibility states (use classes like `.visible`, `.hidden`)
- Transitions and hover effects

**JavaScript is ALLOWED for:**
- Three.js object positioning (required - no CSS alternative)
- GSAP animations (transforms only, not layout properties)
- Dynamic calculations based on camera/viewport

**Forbidden patterns:**
```javascript
// ❌ NEVER do this:
element.style.fontSize = '16px';
element.style.color = '#fff';
element.style.top = '100px';
element.style.display = 'none';

// ✅ Do this instead:
element.classList.add('large-text');
element.classList.add('highlight');
element.classList.add('positioned-top');
element.classList.remove('visible');
```

**When you need a new style:**
1. Add a CSS class to the appropriate `.css` file in `src/content/`
2. Apply the class via JavaScript using `classList.add()`/`classList.remove()`
3. Never inline styles in JavaScript

### Text Readability

**Critical:** All text content must be readable against the dark, semi-transparent backgrounds used throughout the site. The 3D starfield and scene elements show through behind content.

**Required patterns for text containers:**
```css
/* ✅ CORRECT: High-opacity backgrounds for text readability */
.text-container {
  background: rgba(0, 10, 20, 0.85);  /* Min 0.85 opacity */
  padding: 12px 15px;
  border-radius: 6px;
}

/* ✅ Accent border for visual hierarchy */
.important-text {
  background: rgba(0, 10, 20, 0.9);
  border-left: 3px solid #00ffff;
}

/* ❌ WRONG: Low-opacity backgrounds make text unreadable */
.bad-container {
  background: rgba(0, 0, 0, 0.3);  /* Too transparent! */
}
```

**Text color guidelines:**
- Primary text: `#cceeff` or `#ddeeff` (light blue-white)
- Headings: `#00ffff` (cyan)
- Secondary/muted text: `#aaddff`
- Links/interactive: `#00ffff` with hover glow

**Accessibility requirements:**
- Maintain WCAG AA contrast ratio (4.5:1 minimum for body text)
- Use bright, saturated colors for labels and UI elements (e.g., `#8eff8e` instead of `#4CAF50`)
- Add `text-shadow` for text over variable backgrounds

### Responsive Positioning (3D Elements)

Navigation labels and 3D objects should use **frustum-based positioning**, not hardcoded coordinates:

```javascript
// ❌ AVOID hardcoded positions:
label.position.set(3.0, 2.5, 0);

// ✅ PREFER viewport-relative calculations:
// Calculate based on camera frustum so positions adapt to screen size
const frustumHeight = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
const frustumWidth = frustumHeight * camera.aspect;
const xPos = (percentX - 0.5) * frustumWidth;
```

When a `LayoutManager` class exists, use it:
```javascript
const pos = layoutManager.getWorldPosition(0.8, 0.9); // 80% right, 90% up
label.position.copy(pos);
```

### Hand of ORC

The Hand is treated as an **actor** with high-level behaviors, not a mesh to manipulate directly.

**When modifying hand behavior:**

1. **Use high-level methods** (when available in `HandBehaviors.js`):
   ```javascript
   // ✅ Preferred:
   hand.pointAt(satellite);
   hand.travelTo(destination);
   hand.gesture('thumbsUp');
   ```

2. **Do not directly manipulate mesh properties:**
   ```javascript
   // ❌ Avoid in main code:
   hand.mesh.position.set(x, y, z);
   hand.mesh.rotation.set(rx, ry, rz);
   fingerJoint.rotation.z = angle;
   ```

3. **To add new hand behaviors:**
   - First propose a new method for the Hand class
   - Implement it in the hand module (`src/content/orc-demo/orc-hand.js` or future `src/hand/`)
   - Call the method from main code

**Critical constraint:** The hand must NEVER be positioned behind the planet (z < 0.5 in ORC scene). All movement calculations must enforce this.

**Decommission animations by orbit type:**

Each satellite type has a distinct decommission animation:

| Orbit | Satellite | Animation | Description |
|-------|-----------|-----------|-------------|
| LEO | Leona | **Flicking** | Quick flick motion |
| GEO | George | **Punching** | Hand winds up far behind satellite, punches straight through toward Earth |
| Molniya | Moltar | **Slapping** | Backhand slap motion |

When implementing or modifying decommission animations, ensure each orbit type maintains its unique motion style.

### File Organization

**Size limits:**
- No single file should exceed **500 lines**
- If approaching this limit, discuss splitting before adding more code

**When creating new functionality:**
- Create new modules rather than expanding existing large files
- `pyramid.js` (2800+ lines) is a known issue - prefer adding to other files

**Planned structure** (work in progress):
```
src/
├── core/           # Scene, camera, layout management
├── pyramid/        # Pyramid geometry and animations
├── navigation/     # Nav labels and transitions
├── hand/           # Hand of ORC (self-contained)
├── content/        # HTML content and styles (existing)
└── main.js         # Wiring only
```

### Configuration

**Magic numbers should be centralized:**
- Check `src/config.js` for existing constants (when it exists)
- Add new constants there rather than inline in code
- Document units and expected ranges

```javascript
// ❌ Avoid magic numbers:
if (z < 0.5) { ... }
hand.scale.setScalar(7);

// ✅ Use named constants:
if (z < CONFIG.hand.minFrontZ) { ... }
hand.scale.setScalar(CONFIG.hand.scaleFactor);
```

---

## Documentation System (Astro Starlight)

The project uses **Astro Starlight** for technical documentation, organized in a monorepo structure with npm workspaces.

### Structure

```
packages/docs/
├── astro.config.mjs          # Starlight configuration
├── src/
│   ├── content/docs/         # Markdown/MDX content
│   │   ├── index.mdx         # Docs landing page
│   │   └── orc/              # ORC documentation
│   │       ├── index.mdx     # ORC overview
│   │       ├── tutorial.md   # Diataxis: Tutorial
│   │       ├── user-guide.md # Diataxis: How-To
│   │       ├── api-reference.md # Diataxis: Reference
│   │       └── whitepaper.md # Diataxis: Explanation
│   └── styles/
│       └── custom-theme.css  # Theme customization
```

### Adding New Documentation

1. **Create a Markdown file** in `packages/docs/src/content/docs/`
2. **Add frontmatter** with title, description, and `head: []`:
   ```markdown
   ---
   title: My New Page
   description: A brief description
   head: []
   ---
   ```
   **Note:** The `head: []` is required due to a bug in Starlight v0.32.6 where undefined head config causes render errors.
3. **Update the sidebar** in `packages/docs/astro.config.mjs`
4. **Run locally** with `npm run dev:docs` to preview

### Adding a New App Section

To document a new application (e.g., "my-app"):

1. Create folder: `packages/docs/src/content/docs/my-app/`
2. Add an `index.mdx` overview page
3. Add doc pages following Diataxis categories
4. Update sidebar in `astro.config.mjs`:
   ```javascript
   sidebar: [
     { label: 'ORC', items: [...] },
     {
       label: 'My App',
       items: [
         { label: 'Overview', slug: 'my-app' },
         // ... more items
       ],
     },
   ],
   ```

### Diataxis Categories

Follow the [Diataxis framework](https://diataxis.fr/) for documentation:

| Category | File Pattern | Purpose |
|----------|--------------|---------|
| Tutorial | `tutorial-*.md` | Learning-oriented, step-by-step |
| How-To | `*-guide.md` | Task-oriented, practical |
| Reference | `*-reference.md` | Information-oriented, specifications |
| Explanation | `whitepaper.md`, `architecture.md` | Understanding-oriented, conceptual |

### Starlight Components

Use Starlight's built-in components for rich content:

```mdx
import { Steps, Tabs, TabItem, Card, CardGrid } from '@astrojs/starlight/components';

<Steps>
1. First step
2. Second step
</Steps>

:::note[Title]
A note callout
:::

:::tip
A tip callout
:::

:::caution
A warning callout
:::
```

### Build Output

The combined build places docs at `dist/portfolio/docs/`:

- `jamestasse.tech/portfolio/docs/` - Docs landing
- `jamestasse.tech/portfolio/docs/orc/` - ORC section
- `jamestasse.tech/portfolio/docs/orc/tutorial/` - Individual pages
