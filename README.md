# jamestasse.tech (jtt)

Hi there. Welcome to the **jamestasse.tech** repo, which powers my personal website. This project leverages Three.js to create an immersive navigation experience, blending WebGL graphics with standard DOM-based content for accessibility.

## 📂 Portfolio Docs

My portfolio lives in `src\content\portfolio`. However, you can find my technical (Astro) docs under `packages\docs\src\content\docs`.

## 📐 Design Docs

The following docs contain information about how the website is designed and maintained:

- [**ARCHITECTURE.md**](./ARCHITECTURE.md)  
  Explains the project structure, the hybrid rendering model (WebGL + DOM), and how content is organized.

- [**CONTRIBUTING.md**](./CONTRIBUTING.md)  
  Guidelines for developers and AI assistants, covering file placement, coding standards, and best practices.

  > **NOTE**: I don't expect other people to contribute to my personal website, so this contributing guide targets coding assistants like Claude and Gemini.

- [**CLAUDE.md**](./CLAUDE.md)  
  Specific context and commands for AI coding assistants to understand the project context quickly.

## ⚡ Quick Start

Why does my personal website's repo have a quickstart? For the insanely curious, of course!

If you'd like to tinker with the pyramid, /orc-demo functionality, or anything else on the site; do the following to get the development environment running locally:

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Start the development server:**

    ```bash
    npm run dev
    ```

3.  **Start the documentation server (optional):**
    ```bash
    npm run dev:docs
    ```

> **NOTE**: you can also run both the dev and docs servers with `npm run dev:all`

## 🏗️ Project Structure

The project follows a specific organization to separate 3D logic from content:

- `src/core/`: Scene setup, camera, and layout management.
- `src/pyramid/`: Pyramid geometry and animation logic.
- `src/content/`: HTML content and CSS for the overlay pages (About, Portfolio, Blog, ORC Demo).
- `src/navigation/`: Navigation label management.
- `packages/docs/`: Astro Starlight documentation site for technical writing samples.

For a deep dive into the file organization, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## 🚀 Trigger a draft deployment

This is useful for running the Netlify build & deploy operation without publishing to production.

```bash
gh workflow run draft-deploy.yml --ref develop
```
