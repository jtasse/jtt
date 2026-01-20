# jamestasse.tech (jtt) - Architecture Guide

## File Organization

## Table of Contents

- [File Organization](#file-organization)
- [Adding or Modifying Content](#adding-or-modifying-content)
- [Tech Stack](#tech-stack)
- [Refactor](#refactor)
  - [Background](#background)
  - [Refactor Progress](#refactor-progress)
  - [Known Issues](#known-issues-as-of-11026)
  - [Architecture Principles](#architecture-principles)

This project separates concerns across multiple layers:

### Content Layer (`src/content/[page]/`)

HTML and CSS files that define page structure and styling for the DOM overlays:

- **about.html/css**: Semantic HTML and styles for the About page.
- **portfolio.html/css**: Portfolio grid structure and styles.
- **blog.html/css**: Blog listing and post styles.

### 3D Layer (`src/pyramid/`, `src/core/`)

Handles the WebGL scene, camera, and 3D objects:

- **pyramid.js**: Manages the central pyramid geometry and animations.
- **SceneManager.js**: Sets up the Three.js scene, camera, and renderer.
- **LayoutManager.js**: Handles responsive 3D positioning based on camera frustum.

### Navigation Layer (`src/navigation/`)

Manages the 3D labels and their transition to the top navigation bar:

- **LabelManager.js**: Creates and animates the 'Home', 'About', 'Blog', and 'Portfolio' labels.

## Adding or Modifying Content

### To Update About Content

1. Edit `src/content/about/about.html`.
2. Styling is controlled in `src/content/about/about.css`.

### To Update Portfolio

1. Edit `src/content/portfolio/portfolio.html`.
2. Styling is in `src/content/portfolio/portfolio.css`.

### To Update Blog

1. Add new posts to `src/content/blog/posts/`.
2. Update the list in `src/content/blog/blog.html`.
3. Styling is in `src/content/blog/blog.css`.

## Tech Stack

| Tool            | Usage                                         |
| :-------------- | :-------------------------------------------- |
| Vite            | Build tool and development server             |
| Three.js        | 3D rendering engine for scenes and navigation |
| GSAP            | Animation library for smooth transitions      |
| Path2D Polyfill | Canvas API support for legacy environments    |
| Astro           | Documentation site generator                  |
| Vale            | Docs linter                                   |
| Vitest          | Unit testing framework                        |
| jsdom           | DOM implementation for testing environments   |

## Architecture Principles

### Hybrid Rendering

| Layer            | Technology | Content                                                 |
| ---------------- | ---------- | ------------------------------------------------------- |
| WebGL (Three.js) | Canvas     | Pyramid, starfield, Hand, nav labels                    |
| DOM Overlay      | HTML/CSS   | Page content (About, Portfolio, Blog, ORC Demo sidebar) |

### Key Rules

1. **Maintain separation of concerns (where possible)**: although this has been more challenging for 3D scenes, in places where pages follow a more traditional approach, we have tried to keep:

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
  - The light/dark/auto theme control
- While these items should be present on every page, if you believe you need manually add them (instead of using existing logic), _ask me first_.

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
