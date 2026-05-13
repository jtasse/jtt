# Blog Content Management

This directory contains the source and generated files for the blog.

## Workflow

1. **Write**: Create a Markdown file in `markdown/`. You can create subfolders for assets (e.g., `markdown/my-new-post/index.md`).
2. **Assets**: Place your markdown file and any related assets in the same folder.
3. **Cover image**: Set `image` in frontmatter to the cover image for the post. The build script copies that file into `nav-images/`, uses it on the posts page, and inserts it at the top of the generated post.
4. **Other assets**: Any non-cover images are copied into `posts/<slug>/images/`. Any local `.js` or `.css` files are copied into `posts/<slug>/` and automatically included in the generated HTML.
5. **Convert**: Run the build script from the project root to generate HTML and update the generated section of the blog list:
   ```bash
   node src/content/blog/scripts/build-blog.js
   ```

## Markdown Frontmatter

Every post must have a YAML frontmatter block at the top:

```yaml
---
title: "My Amazing Post"
date: 2026-05-13
description: "A short summary for social media previews."
image: "./cover.jpg" # Path relative to the markdown file
author: "James Tasse"
tags: "tech, writing"
---
```

## Directory Structure

- `/markdown`: Source `.md` files.
- `/posts`: Generated `.html` files plus optional per-post folders for non-cover assets.
- `/scripts`: Contains `build-blog.js`.
- `blog.html`: The main blog listing page. Existing hand-authored entries stay intact; the script only updates the section between `GENERATED_POSTS_START` and `GENERATED_POSTS_END`.
- `blog.js` / `blog.css`: Shared logic and styles for the blog system.

## Technical Details

The build script uses `marked` for conversion and `gray-matter` for parsing metadata. It automatically handles:

- Recursive folder searching for Markdown files.
- Cover image promotion into `nav-images/`.
- Automatic copying of non-cover images into `posts/<slug>/images/`.
- Automatic inclusion of local post-specific CSS and JS files.
- Metadata injection for Social Media (Open Graph/Twitter).
- Syntax highlighting support via Prism.js.
