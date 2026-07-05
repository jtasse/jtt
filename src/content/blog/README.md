# Blog Content Management

This directory contains the source and generated files for the blog.

## Workflow

The `markdown/` folder is **staging only**—use it while drafting a new post. Once the HTML (and any post-specific CSS/JS) is in good shape, promote the post to the hand-maintained section of `blog.html` and delete the markdown source.

1. **Write**: Create a Markdown file in `markdown/`. You can create subfolders for assets (e.g., `markdown/my-new-post/my-new-post.md`).
2. **Assets**: Place your markdown file and any related assets in the same folder.
3. **Cover image**: Set `image` in frontmatter to the cover image for the post. The build script copies that file into `nav-images/`, uses it on the posts page, and inserts it at the top of the generated post.
4. **Other assets**: Any non-cover images are copied into `posts/<slug>/images/`. Any local `.js` or `.css` files are copied into `posts/<slug>/` and automatically included in the generated HTML.
5. **Convert**: Run the build script from the project root to generate HTML and update the generated section of the blog list:
   ```bash
   node src/content/blog/scripts/build-blog.js
   ```
6. **Publish**: Review the generated HTML under `posts/`. When satisfied, copy the listing entry from the generated section of `blog.html` into the hand-maintained posts below it (drop `data-generated="true"`), then delete the markdown folder and re-run the build script so the generated section is cleared.

## Markdown Frontmatter

Every staging post must have a YAML frontmatter block at the top:

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

- `/markdown`: Temporary staging `.md` files (delete after publishing).
- `/posts`: Published `.html` files plus optional per-post folders for assets, CSS, and JS.
- `/scripts`: Contains `build-blog.js`.
- `blog.html`: The main blog listing page. Published entries are hand-maintained; the script only updates the section between `GENERATED_POSTS_START` and `GENERATED_POSTS_END`.
- `blog.js` / `blog.css`: Shared logic and styles for the blog system.

## Technical Details

The build script uses `marked` for conversion and `gray-matter` for parsing metadata. It automatically handles:

- Recursive folder searching for Markdown files.
- Cover image promotion into `nav-images/`.
- Automatic copying of non-cover images into `posts/<slug>/images/`.
- Automatic inclusion of local post-specific CSS and JS files.
- Standalone YouTube URLs converted to responsive iframe embeds.
- Metadata injection for Social Media (Open Graph/Twitter).
- Syntax highlighting support via Prism.js.
