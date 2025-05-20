# satware.ai Blog Posts

This directory contains blog posts for the satware.ai website.

## Post Format

Posts follow the MkDocs Material blog plugin format:

```yaml
---
date: YYYY-MM-DD
title: "Post Title"
description: "Post description"
authors: [author-id]
categories:
  - Category1
  - Category2
tags:
  - tag1
  - tag2
---

# Post content
```

## Naming Convention

Files should be named using one of these formats:
- `YYYY-MM-DD-short-title.md` (preferred)
- `descriptive-title.md`

## File Organization

All posts are stored in the `docs/blog/posts` directory and automatically appear on the blog page.

## Preview

After pushing changes, the GitHub Actions workflow will automatically generate a preview at:
https://jane-alesi.github.io/satware.ai/blog/