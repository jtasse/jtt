# jamestasse.tech (jtt) - Architecture Guide

## File Organization

## Table of Contents

- [File Organization](#file-organization)
- [Adding or Modifying Content](#adding-or-modifying-content)
- [Why No CSS?](#why-no-css)
- [Refactor](#refactor)
  - [Background](#background)
  - [Refactor Progress](#refactor-progress)
  - [Known Issues](#known-issues-as-of-11026)
  - [Architecture Principles](#architecture-principles)

This project separates concerns across multiple layers:

### Content Layer (`src/content/`)

HTML files that define page structure and data:

- **about.html**: Semantic HTML with heading and paragraphs (in `src/content/about/`)
- **portfolio.html**: Portfolio items with structured markup (portfolio-item divs)
- **blog.html**: JSON script containing blog post data

### Style Layer (`src/styles/`)

JavaScript style objects that define how content is rendered on canvas:

- **about.style.js**: Typography and layout settings for about page
- **portfolio.style.js**: Card styling, borders, and responsive sizing for portfolio
- **blog.style.js**: Post typography and image sizing for blog

These styles are applied dynamically during canvas rendering and can be imported to control appearance.

### Content Loader (`src/contentLoader.js`)

Handles loading and parsing HTML content:

- `loadContentHTML(page)`: Fetches HTML file for a page
- `parseAboutContent(html)`: Extracts heading and paragraphs from about HTML
- `parseBlogPosts(html)`: Extracts JSON blog post data from script tag

### Plane Renderers (`src/planes.js`)

Renders parsed content to Three.js canvas textures:

- `makeAboutPlane(aboutContent)`: Renders structured about content with typography
- `makePortfolioPlane(items)`: Renders portfolio cards with images
- `makeBlogPlane(posts)`: Renders blog posts with images and metadata

### Main Scene (`src/pyramid/pyramid.js`)

Orchestrates content loading and display:

- `showAboutPlane()`: Loads about HTML, parses it, and renders to canvas
- `showPortfolioPlane()`: Loads and renders portfolio items
- `showBlogPlane()`: Loads and renders blog posts

## Adding or Modifying Content

### To Update About Content

1. Edit `src/content/about/about.html` - change the h1 text or add/modify paragraphs
2. Styling is controlled in `src/styles/about.style.js` (or CSS)
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

---

## Architecture Principles

### Hybrid Rendering

| Layer            | Technology | Content                               |
| ---------------- | ---------- | ------------------------------------- |
| WebGL (Three.js) | Canvas     | Pyramid, starfield, Hand, nav labels  |
| DOM Overlay      | HTML/CSS   | Page content (About, Portfolio, Blog) |

### Key Rules

1. **Maintain separation of concerns (where possible)**: although this has been more challening for 3D scenes, in places where pages follow a more traditional approach, we have tried to keep:

- _Content_ in HTML
- _Styles_ in CSS
- _Logic_ in in JavaScript

2. **Nav labels at z=1** - Keeps them in front of pyramid for visibility and raycasting
3. **Frustum-based positioning** - Use LayoutManager, never hardcode 3D positions
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
