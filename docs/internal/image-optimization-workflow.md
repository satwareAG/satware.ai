---
title: "Team Image Optimization Workflow (INTERNAL)"
date: 2025-11-09
author: Development Team
status: Active
confidentiality: Internal Use Only
---

# Team Image Optimization Workflow

## Overview

**Purpose:** Optimize team member profile images using modern formats (AVIF, WebP, JPEG) for maximum performance while maintaining visual quality.

**Results:** 86% file size reduction (AVIF vs JPEG) with imperceptible quality loss.

---

## Compression Settings (2025 Best Practices)

### ImageMagick Commands

**JPEG Optimization (Baseline):**
```bash
magick input.jpg -quality 85 -sampling-factor 4:2:0 -strip output.jpg
```
- Quality 85: Sweet spot for web (perceptually lossless)
- 4:2:0 sampling: Standard chroma subsampling
- Strip: Remove EXIF/metadata

**WebP Conversion:**
```bash
magick input.jpg -quality 85 output.webp
```
- Quality 85: Matches JPEG quality for consistency
- Automatically applies optimal WebP encoding

**AVIF Conversion:**
```bash
magick input.jpg -quality 85 output.avif
```
- Quality 85: Best compression-to-quality ratio
- Achieves 80-90% size reduction vs JPEG

---

## File Size Benchmarks (Brenda Alesi Example)

| Format | Size | vs JPEG | vs Original | Browser Support |
|--------|------|---------|-------------|-----------------|
| **Original JPEG** | 2.5MB | - | - | - |
| **Optimized JPEG** | 35K | Baseline | 98.6% smaller | ✅ Universal |
| **WebP** | 29K | 17% smaller | 98.8% smaller | ✅ 97% (2025) |
| **AVIF** | 4.9K | 86% smaller | 99.8% smaller | ✅ 90% (2025) |

**Winner:** AVIF provides 86% size reduction vs optimized JPEG with no visible quality loss.

---

## Batch Processing Workflow

### Step 1: Generate Missing Formats

**WebP batch conversion:**
```bash
cd docs/assets/images/team
for file in *-alesi.jpg; do
  base="${file%.jpg}"
  if [ ! -f "${base}.webp" ]; then
    echo "Converting $file to WebP..."
    magick "$file" -quality 85 "${base}.webp"
  fi
done
```

**AVIF batch conversion:**
```bash
cd docs/assets/images/team
for file in *-alesi.jpg; do
  base="${file%.jpg}"
  if [ ! -f "${base}.avif" ]; then
    echo "Converting $file to AVIF..."
    magick "$file" -quality 85 "${base}.avif"
  fi
done
```

### Step 2: Update Markdown Files

**Replace all team member image references with 3-format picture tag:**

**Before:**
```markdown
![Brenda Alesi](../assets/images/team/brenda-alesi.jpg){ .team-member-image }
```

**After:**
```html
<picture>
  <source srcset="../assets/images/team/brenda-alesi.avif" type="image/avif">
  <source srcset="../assets/images/team/brenda-alesi.webp" type="image/webp">
  <img src="../assets/images/team/brenda-alesi.jpg" alt="Brenda Alesi" class="team-member-image">
</picture>
```

### Step 3: Verify Build Output

```bash
# Rebuild site
./mkdocs.sh
docker exec nostalgic_bohr mkdocs build --clean

# Verify picture tags in HTML
grep -A3 "<picture>" site/team/*.html | head -20
```

---

## Browser Fallback Strategy

**Modern browsers (2025):**
1. Try AVIF first (best compression) → 90% browser support
2. Fall back to WebP if AVIF unsupported → 97% browser support
3. Use JPEG as universal fallback → 100% support

**Performance benefits:**
- Mobile users: Save 86% bandwidth (AVIF)
- Desktop users: Save 17-86% bandwidth (WebP/AVIF)
- Legacy browsers: Works perfectly (JPEG fallback)

---

## Quality Verification Checklist

Before committing optimized images:

- [ ] Visual inspection: No visible artifacts
- [ ] File size: <50KB per image (target)
- [ ] All 3 formats generated (AVIF, WebP, JPEG)
- [ ] Picture tag syntax valid in markdown
- [ ] Build successful without errors
- [ ] HTML output contains all 3 sources

---

## Current Status (2025-11-09)

**Completed:**
- ✅ Brenda Alesi - 3 formats (AVIF: 4.9K, WebP: 29K, JPEG: 35K)

**Pending:**
- ⏳ 24 team members - Need WebP generation
  - amira, bastian, bea, catgpt, denopus, eddi, fenix, franzi
  - gunta, jane, john, justus, lara, lenna, leon, lojban
  - luna, marco, olu, team, theo, tim, wolfgang, zuri

---

## Next Steps

1. Batch generate WebP for all 24 remaining team members
2. Update all team/*.md files with picture tags
3. Verify build and visual quality
4. Document learnings in .clinerules
5. Update PR #179 with improvements

---

## References

- [ImageMagick Documentation](https://imagemagick.org/)
- [WebP Format Specification](https://developers.google.com/speed/webp)
- [AVIF Format Best Practices 2025](https://web.dev/articles/avif)
- [Can I Use - Browser Support Stats](https://caniuse.com/)

---

**Last Updated:** 2025-11-09  
**Version:** 1.0
