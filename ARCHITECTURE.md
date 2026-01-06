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

TODO: remove this section once the refactor is complete

## Background

On 1/4/26 I began a refactor project working with Claude Code and Gemini Code assist. The content below was the product of this discussion and should be closely adhered to until this project is complete.

## Integrated Plan (Claude + Gemini)

Phase 0: Prototype Hybrid Architecture (NEW - Highest Priority)

Addresses: Responsiveness, Accessibility, Maintainability, Over-reliance on JS

Before any refactoring, prove the hybrid concept on the About page.

Current Flow:

about.html → contentLoader.js → planes.js:makeAboutPlane() → Canvas texture → 3D mesh

New Flow:

about.html → Inject into #content-overlay (DOM) → CSS handles layout
Pyramid animates → Content fades in over empty space

Implementation:

Step 1: Create overlay container in index.html:

  <div id="content-overlay" class="hidden">
      <div id="about-content"></div>
      <div id="portfolio-content"></div>
      <div id="blog-content"></div>
  </div>

Step 2: New CSS (src/content/overlay.css):
#content-overlay {
position: fixed;
top: 15vh;
left: 50%;
transform: translateX(-50%);
width: min(800px, 90vw);
max-height: 70vh;
overflow-y: auto;
z-index: 10;
opacity: 0;
transition: opacity 0.3s ease;
}

#content-overlay.visible {
opacity: 1;
}

/_ Responsive adjustments _/
@media (max-aspect-ratio: 1/1) { /_ Portrait _/
#content-overlay {
top: 20vh;
width: 95vw;
}
}

Step 3: Modify showAboutPlane() to show DOM instead of 3D mesh:
export function showAboutPlane() {
const overlay = document.getElementById('content-overlay');
const aboutContent = document.getElementById('about-content');

      // Load and inject HTML content
      fetch('/src/content/about/about.html')
          .then(r => r.text())
          .then(html => {
              aboutContent.innerHTML = html;
              overlay.classList.add('visible');
          });

}

Success Criteria:

- About page content is readable at 1920x1080 AND 1080x1920
- Screen reader can read content
- Pyramid animations still work
- Text reflows on window resize

---

Phase 1: Responsive 3D Layout System

Addresses: Navigation alignment, 3D element responsiveness

1.1 Create LayoutManager (Gemini's suggestion, refined)

// src/layout/LayoutManager.js
export class LayoutManager {
constructor(camera) {
this.camera = camera;
this.onResize = this.onResize.bind(this);
window.addEventListener('resize', this.onResize);
}

      getFrustumDimensions() {
          const distance = this.camera.position.z;
          const vFov = (this.camera.fov * Math.PI) / 180;
          const height = 2 * Math.tan(vFov / 2) * distance;
          const width = height * this.camera.aspect;
          return { width, height };
      }

      // Position as percentage of visible area
      getWorldPosition(percentX, percentY) {
          const { width, height } = this.getFrustumDimensions();
          return new THREE.Vector3(
              (percentX - 0.5) * width,
              (percentY - 0.5) * height,
              0
          );
      }

      // Get scale factor for current aspect ratio
      getResponsiveScale(baseScale = 1) {
          const aspect = this.camera.aspect;
          if (aspect < 0.75) return baseScale * 0.6;      // Very portrait
          if (aspect < 1.0) return baseScale * 0.8;       // Portrait
          if (aspect > 2.0) return baseScale * 0.9;       // Ultrawide
          return baseScale;
      }

      onResize() {
          this.camera.aspect = window.innerWidth / window.innerHeight;
          this.camera.updateProjectionMatrix();
          // Dispatch event for other systems to respond
          window.dispatchEvent(new CustomEvent('layoutChange', {
              detail: this.getFrustumDimensions()
          }));
      }

}

1.2 Refactor Navigation Positioning

Replace hardcoded positions in pyramid.js:966-979 with frustum-based calculations:

function updateNavLayout() {
const { width } = layoutManager.getFrustumDimensions();
const labelCount = 5; // Home, Contact, About, Blog, Portfolio
const spacing = Math.min(width / (labelCount + 1), 2.0); // Cap spacing
const startX = -spacing \* (labelCount - 1) / 2;

      Object.keys(flattenedLabelPositions).forEach((name, i) => {
          flattenedLabelPositions[name].x = startX + (i * spacing);
      });

}

---

Phase 2: Code Organization

Addresses: pyramid.js bloat, maintainability

Integrated File Structure (combining Claude + Gemini):

src/
├── core/
│ ├── SceneManager.js # Scene, camera, renderer, lighting
│ ├── LayoutManager.js # Frustum-based responsive positioning
│ └── InputManager.js # Raycasting, click/drag detection
├── pyramid/
│ ├── geometry.js # Pyramid mesh and materials
│ ├── animations.js # spin, reset, morph (GSAP)
│ └── state.js # Position state, pyramidGroup reference
├── navigation/
│ ├── NavLabels.js # Label creation (consider CSS3D here)
│ └── NavAnimations.js # Label transition animations
├── contact/
│ └── ContactLabel.js # Contact info system
├── hand/
│ ├── HandMesh.js # Geometry creation only
│ ├── HandGestures.js # Gesture definitions and lerping
│ ├── HandBehaviors.js # High-level: pointAt(), travelTo(), gesture()
│ └── HandStateMachine.js # State transitions (isolated, testable)
├── content/
│ ├── overlay.css # Content overlay responsive styles
│ ├── ContentManager.js # Load and inject HTML content
│ └── [about|blog|portfolio]/ # Existing content files
├── orc-demo/
│ ├── OrcScene.js # Planet, satellites, atmosphere
│ ├── Decommission.js # Orchestrates hand + satellite + camera
│ └── SmartCamera.js # Camera rig that avoids occlusion
├── config.js # All magic constants
└── main.js # Wiring only (~200 lines max)

Key Principle: Hand as Actor (Gemini's insight)

// src/hand/HandBehaviors.js
export class HandBehaviors {
constructor(mesh, stateMachine, gestures) {
this.mesh = mesh;
this.stateMachine = stateMachine;
this.gestures = gestures;
}

      // High-level API for AI assistants and main code
      pointAt(target) {
          const direction = target.clone().sub(this.mesh.position).normalize();
          this.stateMachine.setState('POINTING', { target, direction });
          this.gestures.setGesture('point');
      }

      travelTo(destination) {
          this.stateMachine.setState('TRAVELING', { destination });
      }

      async slapSatellite(satellite) {
          await this.travelTo(satellite.position);
          this.gestures.setGesture('flat');
          await this.stateMachine.executeSlap(satellite);
          this.gestures.setGesture('thumbsUp');
      }

      gesture(name) {
          this.gestures.setGesture(name);
      }

}

---

Phase 3: ORC Demo Fixes

Addresses: Camera occlusion, satellite visibility

Smart Camera Rig (Gemini's suggestion)

// src/orc-demo/SmartCamera.js
export class SmartCamera {
constructor(camera, hand, planet) {
this.camera = camera;
this.hand = hand;
this.planet = planet;
this.preferredAngles = [0, 45, -45, 90, -90]; // degrees
}

      lookAtWithoutOcclusion(target) {
          const bestAngle = this.findClearAngle(target);
          this.orbitToAngle(bestAngle);
          this.camera.lookAt(target);
      }

      findClearAngle(target) {
          for (const angle of this.preferredAngles) {
              if (!this.isOccluded(target, angle)) {
                  return angle;
              }
          }
          return this.preferredAngles[0]; // Fallback
      }

      isOccluded(target, angle) {
          // Raycast from potential camera position to target
          // Check if hand or planet intersects
          const testPosition = this.getPositionAtAngle(angle);
          const ray = new THREE.Raycaster(testPosition,
              target.clone().sub(testPosition).normalize());
          const intersects = ray.intersectObjects([this.hand.mesh, this.planet]);
          return intersects.length > 0;
      }

}

---

Phase 4: Testing Strategy

4.1 Unit Tests (Logic that doesn't need WebGL)

// test/LayoutManager.spec.js
describe('LayoutManager', () => {
it('calculates correct frustum width for 16:9 aspect', () => {
const mockCamera = { fov: 50, aspect: 16/9, position: { z: 6 } };
const lm = new LayoutManager(mockCamera);
const { width } = lm.getFrustumDimensions();
expect(width).toBeCloseTo(9.95, 1);
});

      it('returns scaled-down value for portrait aspect', () => {
          const mockCamera = { fov: 50, aspect: 0.5, position: { z: 6 } };
          const lm = new LayoutManager(mockCamera);
          expect(lm.getResponsiveScale(1.0)).toBe(0.6);
      });

});

4.2 Visual Regression (Playwright)

// test/e2e/responsive.spec.js
import { test, expect } from '@playwright/test';

const viewports = [
{ name: '1920x1080', width: 1920, height: 1080 },
{ name: '1080x1920-portrait', width: 1080, height: 1920 },
{ name: '1440x900', width: 1440, height: 900 },
];

for (const vp of viewports) {
test(`About page renders correctly at ${vp.name}`, async ({ page }) => {
await page.setViewportSize({ width: vp.width, height: vp.height });
await page.goto('/about');
await page.waitForSelector('#content-overlay.visible');
await expect(page).toHaveScreenshot(`about-${vp.name}.png`);
});
}

4.3 Hand State Machine Tests

// test/HandStateMachine.spec.js
describe('HandStateMachine', () => {
it('transitions IDLE_ORBIT → POINTING on satellite select', () => {
const sm = new HandStateMachine();
sm.setState('IDLE_ORBIT');
sm.onSatelliteSelected(mockSatellite);
expect(sm.currentState).toBe('POINTING');
});

      it('never allows z < MIN_FRONT_Z during any state', () => {
          const sm = new HandStateMachine();
          const positions = sm.calculateApproachPath(mockTarget);
          positions.forEach(pos => {
              expect(pos.z).toBeGreaterThan(MIN_FRONT_Z);
          });
      });

});

---

Phase 5: AI Assistant Guidelines

Updated CLAUDE.md Section:

## Architecture

This site uses a **Hybrid Architecture**:

- **WebGL Layer**: Pyramid, starfield, Hand of ORC (Three.js)
- **DOM Layer**: Content (About, Portfolio, Blog), positioned as overlays
- **Navigation**: Labels can be CSS3D or DOM-synced

## Styling Rules

### CSS is Required For:

- All content text styling (fonts, colors, sizes)
- Layout of DOM content overlays
- Responsive breakpoints
- Visibility states (use `.visible` class, not `display: none` in JS)

### JavaScript is Allowed For:

- Three.js object positioning (required)
- GSAP animations on DOM elements (transforms only)
- Dynamic calculations based on camera frustum

### Forbidden Patterns:

```javascript
// ❌ Never do this:
element.style.fontSize = '16px';
element.style.top = '100px';

// ✅ Do this instead:
element.classList.add('large-text');
element.classList.add('positioned-top');

Hand of ORC

The Hand is an actor with high-level behaviors. When modifying hand behavior:

1. Use the high-level API in src/hand/HandBehaviors.js:
  - hand.pointAt(target) - Point at a 3D object
  - hand.travelTo(position) - Move to a location
  - hand.gesture(name) - Set hand pose ('point', 'fist', 'thumbsUp', etc.)
2. Do not directly manipulate:
  - hand.mesh.position - Use travelTo() instead
  - hand.mesh.rotation - Handled by gesture system
  - Finger joint rotations - Use gesture() instead
3. To add new behaviors: Create a new method in HandBehaviors.js first.

Responsive Positioning

All 3D positions are calculated via LayoutManager:
// ❌ Never hardcode:
label.position.set(3.0, 2.5, 0);

// ✅ Use frustum-based positioning:
const pos = layoutManager.getWorldPosition(0.8, 0.9); // 80% right, 90% up
label.position.copy(pos);

---

## Revised Priority Roadmap

| Order | Task | Impact | Effort | Addresses |
|-------|------|--------|--------|-----------|
| **0** | Prototype hybrid on About page | Very High | Low | Proves concept |
| **1** | Add LayoutManager + nav refactor | High | Medium | Responsiveness |
| **2** | Add ORC resize handler | High | Low | ORC responsiveness |
| **3** | Extract Hand behaviors API | High | Medium | Hand issues, AI assistance |
| **4** | Update CLAUDE.md with guidelines | Medium | Low | JS over-reliance, AI assistance |
| **5** | Split pyramid.js | High | Medium | Maintainability |
| **6** | Add visual regression tests | Medium | Medium | Prevent regressions |
| **7** | Implement SmartCamera for ORC | Medium | Medium | Occlusion issues |

---

## Key Differences from My Original Plan

| Area | My Original | Integrated (with Gemini) |
|------|-------------|--------------------------|
| Content rendering | Keep canvas textures, improve positioning | **Move to DOM overlays** |
| Responsiveness | CSS custom properties | **Frustum-based calculations** |
| Hand architecture | Split into files | **High-level behavior API** |
| Starting point | Refactor first | **Prototype hybrid first** |
| Accessibility | Stretch goal | **Built into Phase 0** |

The Gemini insight about the hybrid architecture is the most valuable addition - it solves multiple problems simultaneously and should be the first thing you prototype.
```
