# Pyramid Site - Architecture Guide

## File Organization

This project separates concerns across multiple layers:

### Content Layer (`src/content/`)

HTML files that define page structure and data:

- **bio.html**: Semantic HTML with heading and paragraphs
- **portfolio.html**: Portfolio items with structured markup (portfolio-item divs)
- **blog.html**: JSON script containing blog post data

### Style Layer (`src/styles/`)

JavaScript style objects that define how content is rendered on canvas:

- **bio.style.js**: Typography and layout settings for bio page
- **portfolio.style.js**: Card styling, borders, and responsive sizing for portfolio
- **blog.style.js**: Post typography and image sizing for blog

These styles are applied dynamically during canvas rendering and can be imported to control appearance.

### Content Loader (`src/contentLoader.js`)

Handles loading and parsing HTML content:

- `loadContentHTML(page)`: Fetches HTML file for a page
- `parseBioContent(html)`: Extracts heading and paragraphs from bio HTML
- `parseBlogPosts(html)`: Extracts JSON blog post data from script tag

### Plane Renderers (`src/planes.js`)

Renders parsed content to Three.js canvas textures:

- `makeBioPlane(bioContent)`: Renders structured bio content with typography
- `makePortfolioPlane(items)`: Renders portfolio cards with images
- `makeBlogPlane(posts)`: Renders blog posts with images and metadata

### Main Scene (`src/pyramid/pyramid.js`)

Orchestrates content loading and display:

- `showBioPlane()`: Loads bio HTML, parses it, and renders to canvas
- `showPortfolioPlane()`: Loads and renders portfolio items
- `showBlogPlane()`: Loads and renders blog posts

## Adding or Modifying Content

### To Update Bio Content

1. Edit `src/content/bio.html` - change the h1 text or add/modify paragraphs
2. Styling is controlled in `src/styles/bio.style.js`
3. Changes appear automatically on next page load

### To Update Portfolio

1. Edit `src/content/portfolio.html` - add/remove portfolio-item divs
2. Styling is in `src/styles/portfolio.style.js`
3. The system automatically extracts h2, p, and a tags from each item

### To Update Blog

1. Edit the JSON in `src/content/blog.html` script tag
2. Update post title, date, author, summary, and image properties
3. Styling is in `src/styles/blog.style.js`

## Why No CSS?

Because content is rendered to canvas textures (for the 3D display), CSS files don't apply. Instead, styling is defined programmatically in JavaScript style objects. This allows:

- Full control over typography and layout during rendering
- Dynamic responsive behavior
- Easy style modifications without dealing with CSS parsing

The separation is maintained by:

- **HTML files**: Content structure and data
- **JS style files**: Appearance and layout rules
- **Plane renderers**: Canvas rendering logic that applies styles

# Refactor

> **Status**: Phase 3 Complete (as of 1/7/26)
> Remove this section once the refactor is complete.

## Background

On 1/4/26 I began a refactor project working with Claude Code and Gemini Code Assist. This document tracks progress and remaining work.

---

## Current File Structure

This is the **actual** current state of the codebase:

```
src/
├── core/
│   ├── SceneManager.js      # ✅ DONE - Scene, camera, renderer, lighting, starfield
│   └── LayoutManager.js     # ✅ DONE - Frustum-based responsive positioning
├── pyramid/
│   └── PyramidMesh.js       # ✅ DONE - Pyramid geometry creation (createPyramid)
├── navigation/
│   └── LabelManager.js      # ✅ DONE - Label creation and nav positioning
├── contact/
│   └── ContactLabel.js      # ✅ DONE - Contact info system (extracted)
├── content/
│   ├── overlay.css          # ✅ DONE - Content overlay styles
│   ├── home/                # Home page content & styles
│   ├── about/               # About/Bio page content & styles
│   ├── blog/                # Blog content & styles
│   ├── portfolio/           # Portfolio content & styles
│   ├── orc-demo/            # ORC demo
│   │   ├── orc-demo.js      # ✅ DONE - Barrel file
│   │   ├── OrcScene.js      # ✅ DONE - Scene setup
│   │   ├── Decommission.js  # ✅ DONE - Decommission logic
│   │   ├── SmartCamera.js   # ✅ DONE - Camera tracking
│   │   ├── OrcDemoManager.js # ✅ DONE - Manager logic
│   │   └── ...
│   ├── ContentManager.js    # ✅ DONE - Content display logic
│   └── ScrollManager.js     # ✅ DONE - Scroll UI logic
├── contentLoader.js         # HTML content loading utilities
├── planes.js                # ✅ CLEANED - Canvas texture rendering (Label helper only)
├── pyramid.js               # ✅ CLEANED - Main scene orchestration
├── router.js                # Simple client-side router
└── main.js                  # Entry point, event handling
```

### Files to Delete (Duplicates)

These files were created during refactoring but are duplicates (some deleted):

- `src/layout/LayoutManager.js` - Duplicate of `src/core/LayoutManager.js`
- `LayoutManager.js` (root) - Stray file
- `config.js` (root) - Stray file

---

## Refactor Progress

### Phase 0: Hybrid Architecture ✅ COMPLETE

DOM overlays now used for content instead of canvas textures.

- `#content` div receives page content
- CSS in `src/content/overlay.css` handles layout
- Portfolio page converted to DOM hybrid

### Phase 1: Responsive Layout System ✅ MOSTLY COMPLETE

- `LayoutManager` created in `src/core/LayoutManager.js`
- `LabelManager` created in `src/navigation/LabelManager.js`
- Nav labels use frustum-based positioning
- **Known issue**: ORC demo nav labels shift right (sidebar collision)

### Phase 2: Code Extraction 🔄 IN PROGRESS

| Module        | Status     | Notes                                    |
| ------------- | ---------- | ---------------------------------------- |
| SceneManager  | ✅ Done    | Scene, camera, renderer, lighting        |
| InputManager  | ✅ Done    | Raycasting, click/drag detection         |
| LayoutManager | ✅ Done    | Frustum calculations, responsive scaling |
| PyramidMesh   | ✅ Done    | Geometry only, no animation              |
| LabelManager  | ✅ Done    | Label creation, nav positions            |
| ContactLabel  | ✅ Done    | Contact info display                     |
| pyramid.js    | ⚠️ Bloated | Still ~2400 lines, needs splitting       |
| main.js       | ✅ Clean   | Reduced to wiring and initialization     |

### Phase 3: ORC Demo Fixes ✅ COMPLETE

- SmartCamera implemented (`src/content/orc-demo/SmartCamera.js`)
- Hand behaviors extracted to separate module (`src/hand/`)
- ORC Demo logic split into `OrcScene.js` and `Decommission.js`
- Sidebar layout issues fixed via CSS

### Phase 4: Testing ❌ NOT STARTED

- No unit tests yet
- No visual regression tests

---

## Known Issues (as of 1/6/26)

- Pyramid and some nav labels not showing on home page
- Labels that do appear are not in the right positions
- About, portfolio, & blog pages:
  - Nav labels are too high, don't show a hover icon, and don't navigate when clicked
  - Contact pane is missing
  - There should not be a "contact" page

## Next Steps (Priority Order)

### Immediate Cleanup

1. Delete duplicate files listed above

### Testing

2. Add unit tests for `LayoutManager`
3. Add unit tests for `HandStateMachine`

## Target File Structure

Once refactor is complete:

```
src/
├── core/
│   ├── SceneManager.js      # Scene, camera, renderer, lighting
│   ├── LayoutManager.js     # Frustum-based responsive positioning
│   └── InputManager.js      # Raycasting, click/drag detection
├── pyramid/
│   ├── PyramidMesh.js       # Geometry creation
│   ├── animations.js        # All pyramid animations
│   └── state.js             # Position state, pyramidGroup
├── navigation/
│   ├── LabelManager.js      # Label creation and management
│   └── NavAnimations.js     # Label transition animations
├── contact/
│   └── ContactLabel.js      # Contact info system
├── hand/
│   ├── HandMesh.js          # Hand geometry
│   ├── HandBehaviors.js     # High-level API: pointAt, travelTo, gesture
│   └── HandStateMachine.js  # State transitions
├── content/
│   ├── ContentManager.js    # Load and display content
│   ├── overlay.css          # Content overlay styles
│   └── [page folders]/      # Page-specific content
├── orc-demo/
│   ├── OrcScene.js          # Planet, satellites, atmosphere
│   ├── Decommission.js      # Decommission orchestration
│   └── SmartCamera.js       # Camera that avoids occlusion
├── config.js                # All magic constants
├── router.js                # Client-side routing
└── main.js                  # Wiring only (~200 lines)
```

---

## Architecture Principles

### Hybrid Rendering

| Layer            | Technology | Content                               |
| ---------------- | ---------- | ------------------------------------- |
| WebGL (Three.js) | Canvas     | Pyramid, starfield, Hand, nav labels  |
| DOM Overlay      | HTML/CSS   | Page content (About, Portfolio, Blog) |

### Key Rules

1. **Nav labels at z=1** - Keeps them in front of pyramid for visibility and raycasting
2. **Frustum-based positioning** - Use LayoutManager, never hardcode 3D positions
3. **CSS for styling** - Never use `element.style.*` in JavaScript
4. **Hand as Actor** - Use high-level behavior methods, not direct mesh manipulation

### Import Conventions

```javascript
// Core utilities
import { scene, camera, renderer } from "./core/SceneManager.js"
import { LayoutManager } from "./core/LayoutManager.js"

// Pyramid
import { createPyramid } from "./pyramid/PyramidMesh.js"

// Navigation
import { LabelManager } from "./navigation/LabelManager.js"
```
