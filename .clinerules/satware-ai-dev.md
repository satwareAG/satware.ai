# satware.ai Development Rules (MANDATORY)

**Project:** satware.ai - Public Documentation Website  
**Repository:** https://github.com/satwareAG/satware.ai  
**Enforcement:** ABSOLUTE - No exceptions

---

## 🔒 Rule #1: Internal Documentation Placement (CRITICAL)

### MANDATORY Policy

**ALL internal documentation MUST be placed in `docs/internal/`**

This is **NON-NEGOTIABLE** and **ABSOLUTE**. The `docs/internal/` directory is excluded from publication via `mkdocs.yml` configuration:

```yaml
plugins:
  - exclude:
      glob:
        - "internal/**/*"
        - "templates/**/*"
```

### What MUST Go in `docs/internal/`

✅ **ALWAYS place these in `docs/internal/`:**
- Development analysis documents (e.g., `dev-ci-parity-analysis.md`)
- CI/CD configuration notes and comparisons
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
- Public-facing content

### Verification Checklist (MANDATORY Before Committing)

Before committing ANY new `.md` file in `docs/`, ask:

1. **Is this intended for public consumption on satware.ai?**
   - ✅ YES → Can go in `docs/` (appropriate subdirectory)
   - ❌ NO → **MUST** go in `docs/internal/`

2. **Does this contain internal notes, analysis, or development information?**
   - ✅ YES → **MUST** go in `docs/internal/`
   - ❌ NO → Can go in `docs/` if public-facing

3. **Would I be comfortable with this being on the live website?**
   - ✅ YES → Can go in `docs/`
   - ❌ NO → **MUST** go in `docs/internal/`

**When in doubt:** PUT IT IN `docs/internal/`

### Testing Requirements (MANDATORY)

Before pushing commits with new documentation:

```bash
# 1. Test locally
./mkdocs.sh

# 2. Verify in browser at http://localhost:8000
#    - Check navigation menu
#    - Use search function
#    - Verify internal docs are NOT visible

# 3. Check built site
docker exec -it mkdocs-material mkdocs build
ls -la site/internal/  # Should NOT exist
```

### Enforcement Examples

**❌ WRONG:**
```bash
# Creating analysis document in docs root
touch docs/performance-analysis.md
```

**✅ CORRECT:**
```bash
# Creating analysis document in docs/internal/
touch docs/internal/performance-analysis.md
```

**❌ WRONG:**
```bash
# Creating CI/CD notes in docs/
touch docs/github-actions-comparison.md
```

**✅ CORRECT:**
```bash
# Creating CI/CD notes in docs/internal/
touch docs/internal/github-actions-comparison.md
```

---

## 🤖 Rule #2: AI Assistant Behavior (MANDATORY)

### Automatic Enforcement

When working on this project, AI assistants (Cline, Claude, etc.) **MUST**:

1. **Always check file destination** before creating `.md` files in `docs/`
2. **Default to `docs/internal/`** for any development-related documentation
3. **Ask for confirmation** if uncertain about public vs. internal placement
4. **Refuse to create** internal docs outside `docs/internal/` without explicit override
5. **Suggest moving** any existing internal docs found outside `docs/internal/`

### Response Pattern

When asked to create documentation, AI assistants should:

```
User: "Create a document analyzing the CI/CD pipeline"

AI Response:
This appears to be internal documentation. I will create it in docs/internal/:
- File: docs/internal/ci-cd-pipeline-analysis.md
- Reason: Development analysis, not public-facing
- Verification: Will be excluded from published site

Proceed? (Y/n)
```

### Red Flags (Trigger `docs/internal/` Placement)

These keywords/phrases indicate internal documentation:
- "analysis" / "analyze"
- "CI/CD" / "GitHub Actions" / "workflow"
- "dev" / "development" / "developer"
- "internal" / "private"
- "architecture decision"
- "testing strategy"
- "performance benchmark"
- "migration guide" (internal)
- "investigation" / "research"
- "planning" / "roadmap" (internal)

---

## 📋 Rule #3: File Naming Conventions

### Internal Documentation

**Pattern:** `docs/internal/<descriptive-name>.md`

**Examples:**
- `docs/internal/dev-ci-parity-analysis.md`
- `docs/internal/architecture-microservices-evaluation.md`
- `docs/internal/testing-strategy-2025.md`
- `docs/internal/migration-mkdocs-material-v10.md`
- `docs/internal/performance-optimization-notes.md`

**Avoid:**
- Vague names: `notes.md`, `temp.md`, `draft.md`
- Non-descriptive: `doc1.md`, `analysis.md`
- Use descriptive, searchable names

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
- [ ] `mkdocs.yml` still excludes `internal/**/*`
- [ ] Local build tested (`./mkdocs.sh`)
- [ ] Verified internal docs not visible in local preview
- [ ] No sensitive information in ANY committed files

### Automated Checks (Future)

Consider adding to CI/CD:

```yaml
# .github/workflows/validate-docs.yml
- name: Check for internal docs outside docs/internal/
  run: |
    # Find files with internal keywords outside docs/internal/
    if find docs/ -name "*.md" -not -path "docs/internal/*" | xargs grep -l "INTERNAL\|TODO\|FIXME" ; then
      echo "Error: Internal documentation markers found outside docs/internal/"
      exit 1
    fi
```

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
   - Check https://satware.ai site after deployment
   - Use Google Search Console to request re-crawl
   - Monitor search results for leaked content

4. **Document incident** in `docs/internal/incidents/YYYY-MM-DD-doc-leak.md`

### Prevention

- Always use local testing (`./mkdocs.sh`)
- Always verify `mkdocs.yml` exclusions
- Always check PR diff before merging
- Never disable the `exclude` plugin

---

## 📖 Rule #6: Documentation Standards

### All Documentation (Public and Internal)

Follow these standards:

1. **Markdown:** Use proper Markdown syntax
2. **Frontmatter:** Include YAML frontmatter where appropriate
3. **Headers:** Use proper heading hierarchy (H1 → H6)
4. **Links:** Use relative links for internal references
5. **Images:** Place in appropriate `docs/assets/images/` subdirectories
6. **Code blocks:** Use syntax highlighting (```language)

### Internal Documentation Specific

- Include creation date in filename or frontmatter
- Add "INTERNAL" marker in title or frontmatter
- Document author/team responsible
- Link to related public documentation when applicable

**Example frontmatter for internal docs:**

```yaml
---
title: "CI/CD Pipeline Analysis (INTERNAL)"
date: 2025-11-09
author: Development Team
status: Active
related_public_docs: []
confidentiality: Internal Use Only
---
```

---

## 🎯 Rule #7: Enforcement Priority

### Priority Levels

1. **P0 - CRITICAL:** Never publish internal docs (Rule #1)
2. **P1 - HIGH:** Always test before committing (Rule #1)
3. **P2 - MEDIUM:** Follow naming conventions (Rule #3)
4. **P3 - LOW:** Nice-to-have documentation standards

### Non-Compliance Consequences

**P0 Violation:** Immediate rollback, incident report required  
**P1 Violation:** PR rejected, must fix before merge  
**P2 Violation:** Warning, fix in next commit  
**P3 Violation:** Suggestion for improvement

---

## 🔄 Rule Updates

This `.clinerules/satware-ai-dev.md` file may be updated as the project evolves.

**Change Process:**
1. Propose changes via PR
2. Document rationale in PR description
3. Update this file
4. Communicate to all team members and AI assistants

---

## 📚 Quick Reference

### Commands

```bash
# Start local development server
./mkdocs.sh

# Create new internal document
touch docs/internal/<descriptive-name>.md

# Verify exclusions work
docker exec -it mkdocs-material mkdocs build
ls site/internal/  # Should error: No such file or directory

# Check for accidental internal content
grep -r "INTERNAL" docs/ --exclude-dir=internal
```

### Key Files

- `mkdocs.yml` - Exclusion configuration (lines 48-52)
- `README.md` - Internal documentation policy section
- `.clinerules/satware-ai-dev.md` - This file (enforcement rules)

---

## ✅ Summary

**The ONE rule to remember:**

> **Internal docs → `docs/internal/`  
> Public docs → `docs/`  
> When in doubt → `docs/internal/`**

**This is MANDATORY and ABSOLUTE. No exceptions.**

---

**Last Updated:** 2025-11-09  
**Version:** 1.0  
**Status:** Active and Enforced
