# satware.ai Development Rules (MANDATORY)

**Project:** satware.ai - Public Documentation Website  
**Repository:** https://github.com/satwareAG/satware.ai  
**Enforcement:** ABSOLUTE - No exceptions

---

## 🔒 Rule #1: Internal Documentation Placement (CRITICAL)

### MANDATORY Policy

**ALL internal documentation MUST be placed in `docs/internal/`**

This is **NON-NEGOTIABLE** and **ABSOLUTE**. The `docs/internal/` directory is excluded from publication via `mkdocs.yml` configuration.

### ⚠️ CRITICAL: Correct Glob Pattern (TESTED & VERIFIED)

**The mkdocs-exclude plugin requires specific glob syntax:**

```yaml
plugins:
  - exclude:
      glob:
        - "internal/*"      # ✅ WORKS - Excludes docs/internal/
        - "templates/*"     # ✅ WORKS - Excludes docs/templates/
```

**❌ WRONG - Does NOT work:**
```yaml
plugins:
  - exclude:
      glob:
        - "internal/**/*"   # ❌ FAILS - Does not exclude!
        - "templates/**/*"  # ❌ FAILS - Does not exclude!
```

**Why:** mkdocs-exclude patterns are relative to `docs/` directory. The `**/*` subdirectory wildcard does NOT work for top-level exclusion. Use `directory/*` pattern only.

**Verification (2025-11-09):**
- ✅ Pattern `"internal/*"` - site/internal/ does NOT exist (SUCCESS)
- ❌ Pattern `"internal/**/*"` - site/internal/ DOES exist (FAILURE)
- 📊 Performance: Build time improved 17.51s → 7.07s (59% faster)

### What MUST Go in `docs/internal/`

✅ **ALWAYS place these in `docs/internal/`:**
- Development analysis documents
- CI/CD configuration notes
- Architecture decision records (internal)
- Testing strategies and results
- Migration guides (internal processes)
- Performance analysis and benchmarks
- Security audit notes (internal)
- Team process documentation
- Technical debt tracking
- Research and investigation notes
- Planning documents for future features
- Any documentation NOT intended for public consumption

### What Goes in `docs/` (Public)

✅ **Public documentation only:**
- Team member profiles (`docs/team/*.md`)
- Public blog posts (`docs/blog/posts/*.md`)
- FAQ pages (`docs/faq/index.md`)
- Feature documentation for users
- Webinar/workshop information

### Verification Checklist (MANDATORY Before Committing)

Before committing ANY new `.md` file in `docs/`:

1. **Is this intended for public consumption on satware.ai?**
   - ✅ YES → Can go in `docs/`
   - ❌ NO → **MUST** go in `docs/internal/`

2. **Does this contain internal notes, analysis, or development information?**
   - ✅ YES → **MUST** go in `docs/internal/`
   - ❌ NO → Can go in `docs/` if public-facing

3. **Would I be comfortable with this being on the live website?**
   - ✅ YES → Can go in `docs/`
   - ❌ NO → **MUST** go in `docs/internal/`

**When in doubt:** PUT IT IN `docs/internal/`

### Testing Requirements (MANDATORY - VERIFIED PROCEDURES)

**Before pushing commits with new documentation:**

```bash
# 1. Start local development server
./mkdocs.sh

# 2. Build site explicitly (dev server doesn't generate site/)
docker exec nostalgic_bohr mkdocs build --clean

# 3. CRITICAL TEST: Verify site/internal/ does NOT exist
docker exec nostalgic_bohr ls -la /docs/site/internal/ 2>&1
# Expected output: "ls: cannot access '/docs/site/internal/': No such file or directory" ✅

# 4. Verify no internal files in built site
docker exec nostalgic_bohr find /docs/site/ -name "*internal*" 2>&1
# Expected output: (empty - no results) ✅

# 5. List site structure (should NOT include internal/)
docker exec nostalgic_bohr ls -1 /docs/site/ | grep internal
# Expected output: (empty - no match) ✅
```

**Success Criteria:**
- ✅ `site/internal/` directory does NOT exist
- ✅ No files with "internal" in name found in site/
- ✅ Build completes without internal document warnings
- ✅ Build time ~7s (not ~17s indicating excluded files)

---

## 🤖 Rule #2: AI Assistant Behavior (MANDATORY)

### Automatic Enforcement

When working on this project, AI assistants **MUST**:

1. **Always check file destination** before creating `.md` files in `docs/`
2. **Default to `docs/internal/`** for any development-related documentation
3. **Ask for confirmation** if uncertain about public vs. internal placement
4. **Refuse to create** internal docs outside `docs/internal/` without explicit override
5. **Suggest moving** existing internal docs found outside `docs/internal/`

### Red Flags (Trigger `docs/internal/` Placement)

Keywords indicating internal documentation:
- "analysis" / "analyze" / "investigation"
- "CI/CD" / "GitHub Actions" / "workflow" / "pipeline"
- "dev" / "development" / "developer" / "debug"
- "internal" / "private" / "confidential"
- "architecture decision" / "technical debt"
- "testing strategy" / "performance benchmark"
- "migration guide" (internal) / "planning" / "roadmap" (internal)

---

## 📋 Rule #3: File Naming Conventions

### Internal Documentation

**Pattern:** `docs/internal/<descriptive-name>.md`

**Examples:**
- `docs/internal/dev-ci-parity-analysis.md`
- `docs/internal/architecture-microservices-evaluation.md`
- `docs/internal/testing-strategy-2025.md`
- `docs/internal/performance-optimization-notes.md`

**Avoid:** Vague names like `notes.md`, `temp.md`, `draft.md`, `doc1.md`

### Public Documentation

**Follow existing patterns:**
- Team profiles: `docs/team/<name>.md`
- Blog posts: `docs/blog/posts/YYYY-MM-DD-<title>.md`
- FAQ: `docs/faq/index.md`
- Features: `docs/anwendungen/index.md`

---

## 🔍 Rule #4: Code Review Checklist

### For ALL Pull Requests

Before approving any PR that adds/modifies `.md` files:

- [ ] All internal docs are in `docs/internal/`
- [ ] No development notes in public `docs/` directories
- [ ] `mkdocs.yml` uses correct glob pattern: `"internal/*"` (not `"internal/**/*"`)
- [ ] Local build tested with verification commands (Rule #1)
- [ ] Verified internal docs not visible in built site
- [ ] No sensitive information in ANY committed files

---

## 🚨 Rule #5: Incident Response

### If Internal Docs Are Accidentally Published

**Immediate Actions:**

1. **Remove from source:**
   ```bash
   git rm docs/<accidental-file>.md
   git commit -m "fix: Remove accidentally published internal documentation"
   git push
   ```

2. **Wait for redeployment** (GitHub Actions will rebuild)

3. **Verify removal:**
   - Check https://satware.ai after deployment
   - Use Google Search Console to request re-crawl
   - Monitor search results for leaked content

4. **Document incident** in `docs/internal/incidents/YYYY-MM-DD-doc-leak.md`

---

## 📖 Rule #6: Documentation Standards

### All Documentation

1. **Markdown:** Proper syntax with frontmatter where appropriate
2. **Headers:** Proper hierarchy (H1 → H6)
3. **Links:** Relative links for internal references
4. **Images:** Place in `docs/assets/images/` subdirectories
5. **Code blocks:** Use syntax highlighting (```language)

### Internal Documentation Specific

**Example frontmatter:**

```yaml
---
title: "CI/CD Pipeline Analysis (INTERNAL)"
date: 2025-11-09
author: Development Team
status: Active
confidentiality: Internal Use Only
---
```

---

## 🎯 Rule #7: Enforcement Priority

### Priority Levels

1. **P0 - CRITICAL:** Never publish internal docs (Rule #1) + Use correct glob pattern
2. **P1 - HIGH:** Always test before committing (Rule #1)
3. **P2 - MEDIUM:** Follow naming conventions (Rule #3)
4. **P3 - LOW:** Documentation standards (Rule #6)

### Non-Compliance Consequences

**P0 Violation:** Immediate rollback, incident report required  
**P1 Violation:** PR rejected, must fix before merge  
**P2 Violation:** Warning, fix in next commit  
**P3 Violation:** Suggestion for improvement

---

## 📚 Quick Reference

### Essential Commands

```bash
# Start local server
./mkdocs.sh

# Build and test (MANDATORY before commit)
docker exec nostalgic_bohr mkdocs build --clean
docker exec nostalgic_bohr ls -la /docs/site/internal/ 2>&1  # Should error

# Create new internal document
touch docs/internal/<descriptive-name>.md

# Check for accidental internal content
grep -r "INTERNAL" docs/ --exclude-dir=internal
```

### Key Files

- `mkdocs.yml` lines 48-52 - Exclusion configuration (use `"internal/*"` pattern)
- `README.md` - Internal documentation policy section
- `.clinerules/satware-ai-dev.md` - This file (enforcement rules)

### Performance Benchmarks (2025-11-09)

- Build time WITHOUT exclusion: ~17.51s
- Build time WITH exclusion: ~7.07s
- **Improvement:** 59% faster (10.44s saved per build)

---

## ✅ Summary

**The ONE rule to remember:**

> **Internal docs → `docs/internal/`**  
> **Public docs → `docs/`**  
> **When in doubt → `docs/internal/`**
> 
> **Use glob pattern: `"internal/*"` NOT `"internal/**/*"`**

**This is MANDATORY and ABSOLUTE. No exceptions.**

---

**Last Updated:** 2025-11-09  
**Version:** 1.1 (Updated with verified glob pattern and testing procedures)  
**Status:** Active and Enforced
