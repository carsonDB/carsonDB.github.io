# CarsonDB GitHub Pages

This repository is now an Astro-powered personal technical blog. It is prepared
for writing Markdown posts that promote and explain the open-source CogCore repo.

## Development

```sh
pnpm install
pnpm dev
```

## Build

```sh
pnpm build
pnpm preview
```

## Writing Posts

Create new Markdown files in `src/content/blog/` with frontmatter:

```md
---
title: "Post Title"
description: "Short summary for cards, RSS, and metadata."
date: 2026-06-12
tags: ["cogcore", "architecture"]
draft: false
---
```

Set `draft: true` while writing. Draft posts are excluded from the blog index,
RSS feed, and static routes.

## Deployment

GitHub Actions builds the Astro site and deploys the `dist/` output to GitHub
Pages whenever `master` is pushed.
