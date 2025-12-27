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
