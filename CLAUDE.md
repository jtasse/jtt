# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A 3D interactive personal website built with Three.js featuring a rotating pyramid with clickable face labels (Bio, Portfolio, Blog) that animate into a top navigation menu when selected.

## Commands

```bash
npm run dev    # Start Vite dev server (hot reload)
npm run build  # Production build to dist/
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
2. **Label click**: Labels animate to horizontal top nav, pyramid moves up/shrinks behind selected label
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
