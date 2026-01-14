# jamestasse.tech (jtt) - Architecture Guide

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

### Phase 4: Testing - IN PROGRESS

- No unit tests yet
- No visual regression tests

---

## Known Issues (as of 1/10/26)

- navigation:

  - pyramid under nav labels is still sometimes misaligned

- orc-demo:

  - after decommissioning a satellite, the hand of ORC should only give a thumbs up for 2 seconds before returning to idle mode
  - going from orc-demo to the blog or other pages is bugged--the labels don't fill the screen and pyramid is off

- Docs:
  - When documentation is displayed, the top of the document viewer should end just below the top nav labels (to ensure they are always visible)
  - Portfolio doc viewer places content on the left side of the screen. It should be centered.

## Nice to have features

- Hand of ORC
  - When the user clicks "decommission satellite", the hand's thruster should change from blue to red
  - As the hand is giving a thumbs up after a successful decommission, the thruster color should switch back to blue

## Next Steps (Priority Order)

### Testing

TBD

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

### Must-Display Elements

- The following items **MUST** be displayed on every page _except_ those that live under `portfolio/docs/`
  - The same 'Home', 'About', 'Blog', and 'Portfolio' navigation elements as can be seen on the home screen
  - The same 'Contact Info' pane as can be seen on the home screen
- While these items should be present on every page, if you believe you need manually add them (instead of using existing navl label and contact pane logic), _ask me first_.

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
