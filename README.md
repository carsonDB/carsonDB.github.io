# Carson Wu — Personal Blog

This repository contains Carson Wu's Astro-powered personal blog at
`carsonDB.github.io`, with writing on AI, software, research, and other ideas in
progress.

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
