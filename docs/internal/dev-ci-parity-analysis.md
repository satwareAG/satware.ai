# Development-CI Environment Parity Analysis

**Date:** 2025-11-09  
**Repository:** satware.ai  
**Analyzed by:** Jane Alesi

## Executive Summary

The local Docker development environment (`mkdocs.sh` + `docker/mkdocs-material/Dockerfile`) and GitHub Actions CI/CD workflows (`.github/workflows/deploy-live.yml` and `deploy-preview.yml`) are **functionally identical** but suffer from **critical maintainability issues** due to **dependency duplication** and lack of a **single source of truth**.

### Critical Finding
Both environments use **identical Python packages** (15 total, including `mkdocs-material==9.6.14`), but dependencies are **hardcoded in 3 separate locations**:
1. `docker/mkdocs-material/Dockerfile`
2. `.github/workflows/deploy-live.yml`
3. `.github/workflows/deploy-preview.yml`

This creates **high risk of drift** when updating dependencies.

---

## Detailed Comparison Matrix

| Aspect | Local Development | GitHub Actions CI/CD | Match? | Risk Level |
|--------|-------------------|----------------------|--------|------------|
| **Base OS** | Debian Bullseye (via python:3.13-slim-bullseye) | Ubuntu 22.04 | ⚠️ Different | Low |
| **Python Version** | 3.13 | 3.13 | ✅ Identical | None |
| **Python Packages** | 15 packages (see below) | 15 packages (see below) | ✅ Identical | None |
| **mkdocs-material Version** | 9.6.14 (pinned) | 9.6.14 (pinned) | ✅ Identical | None |
| **SCSS Compilation** | pysassc (libsass) | pysassc (libsass) | ✅ Identical | None |
| **System Dependencies** | build-essential, cairo, gdk-pixbuf, pango, etc. | Not explicitly installed (bundled in ubuntu-22.04) | ⚠️ Implicit | Low |
| **Build Process** | mkdocs serve (development server) | mkdocs build → gh-deploy | ⚠️ Different purpose | None |
| **Dependency Management** | Hardcoded in Dockerfile | Hardcoded in workflow YAML | ❌ **DUPLICATED** | **HIGH** |
| **Version Locking** | Inline pip install | Inline pip install | ❌ **NO requirements.txt** | **HIGH** |

### Python Packages (Identical in Both Environments)
```
cairosvg
libsass
mkdocs-exclude
mkdocs-git-revision-date-localized-plugin
mkdocs-glightbox
mkdocs-include-markdown-plugin
mkdocs-literate-nav
mkdocs-macros-plugin
mkdocs-material==9.6.14
mkdocs-material[imaging]
mkdocs-minify-plugin
mkdocs-redirects
mkdocs-rss-plugin
mkdocs-snippets
mkdocs-video
watchdog
```

---

## Critical Issues Identified

### 🔴 Issue 1: Dependency Duplication (HIGH RISK)
**Problem:** Dependencies listed in 3 separate files means updating package versions requires changing 3 locations. Missing one creates immediate drift.

**Current State:**
- `docker/mkdocs-material/Dockerfile` (lines 20-36)
- `.github/workflows/deploy-live.yml` (lines 25-39)
- `.github/workflows/deploy-preview.yml` (lines 25-39)

**Risk:** Developer updates Dockerfile but forgets workflow → local works, CI fails → "works on my machine" syndrome.

### 🔴 Issue 2: No Requirements File (HIGH RISK)
**Problem:** Industry best practice is `requirements.txt` with pinned versions for reproducibility, audit trail, and dependency locking.

**Current Risk:**
- No version control history of dependency changes
- No easy rollback if package update breaks build
- Manual coordination required for updates

### 🟡 Issue 3: Base OS Mismatch (LOW RISK)
**Problem:** Local uses Debian Bullseye, CI uses Ubuntu 22.04. Both work but creates slight differences.

**Current Impact:** Minimal - Python packages abstract most OS differences. System dependencies (cairo, pango) are handled differently but both work.

### 🟢 Issue 4: Build Process Difference (NO RISK)
**Status:** Expected and correct behavior:
- Local: `mkdocs serve` for live development with hot reload
- CI: `mkdocs build` + `mkdocs gh-deploy` for static site generation

This is **intentional and appropriate**.

---

## Best Practices Research Findings

Based on research of GitHub Actions + Docker best practices (2024-2025):

### 1. **Single Source of Truth**
✅ **Recommendation:** Create `requirements.txt` with all Python dependencies
- Eliminates duplication
- Enables version locking with `pip freeze`
- Provides audit trail in git history
- Industry standard for Python projects

### 2. **Dockerfile Reuse in CI**
✅ **Recommendation:** GitHub Actions should build and use the same Dockerfile
- Guarantees environment parity
- Reduces configuration drift
- "Use same Dockerfile everywhere" principle

### 3. **Multi-Stage Builds**
✅ **Recommendation:** Separate build and runtime stages
- Already partially implemented (dependencies vs runtime)
- Could optimize further for production

### 4. **Cache Optimization**
✅ **Recommendation:** Layer caching for faster builds
- Docker layer caching in GitHub Actions
- Cache Python packages between runs

---

## Proposed Solutions

### 🎯 Option A: Requirements.txt with Dockerfile Reuse (RECOMMENDED)

**Implementation Steps:**

1. **Create `requirements.txt`**
   ```bash
   # Extract from current Dockerfile
   cairosvg
   libsass
   mkdocs-exclude
   mkdocs-git-revision-date-localized-plugin
   mkdocs-glightbox
   mkdocs-include-markdown-plugin
   mkdocs-literate-nav
   mkdocs-macros-plugin
   mkdocs-material==9.6.14
   mkdocs-material[imaging]
   mkdocs-minify-plugin
   mkdocs-redirects
   mkdocs-rss-plugin
   mkdocs-snippets
   mkdocs-video
   watchdog
   ```

2. **Update Dockerfile**
   ```dockerfile
   FROM python:3.13-slim-bullseye
   WORKDIR /docs
   
   # Install system dependencies
   RUN apt-get update && apt-get install -y --no-install-recommends \
       build-essential curl git \
       libcairo2 libffi-dev libgdk-pixbuf2.0-0 \
       libpango-1.0-0 libpangocairo-1.0-0 shared-mime-info \
       && rm -rf /var/lib/apt/lists/*
   
   # Copy and install Python dependencies
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   ```

3. **Update GitHub Actions Workflows**
   ```yaml
   - name: Setup Python
     uses: actions/setup-python@v5
     with:
       python-version: '3.13'
   
   - name: Install dependencies
     run: |
       pip install --upgrade pip
       pip install -r requirements.txt
   ```

4. **Update `mkdocs.sh`**
   ```bash
   # Build Docker image from Dockerfile
   docker build -t squidfunk/mkdocs-material-custom ${PWD}/docker/mkdocs-material
   
   # Run container (unchanged)
   docker run --rm -it --user $(id -u):$(id -g) -p 8000:8000 \
     -v ${PWD}:/docs --entrypoint sh \
     squidfunk/mkdocs-material-custom -c "..."
   ```

**Benefits:**
- ✅ Single source of truth (`requirements.txt`)
- ✅ Guaranteed parity (same file used everywhere)
- ✅ Easy dependency updates (one file)
- ✅ Git history of dependency changes
- ✅ Industry standard approach

**Trade-offs:**
- Requires updating 3 files initially (one-time cost)
- Dockerfile must `COPY requirements.txt` (adds build context dependency)

---

### 🎯 Option B: Docker-First CI/CD (ALTERNATIVE)

**Make GitHub Actions use the Docker container:**

```yaml
jobs:
  deploy:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4
      
      - name: Build Docker image
        run: docker build -t mkdocs-builder ./docker/mkdocs-material
      
      - name: Build SCSS
        run: |
          docker run --rm -v ${PWD}:/docs mkdocs-builder \
            pysassc overrides/assets/css/custom.scss docs/assets/css/custom.css
      
      - name: Build site
        run: docker run --rm -v ${PWD}:/docs mkdocs-builder mkdocs build
      
      - name: Deploy
        run: docker run --rm -v ${PWD}:/docs mkdocs-builder mkdocs gh-deploy --force
```

**Benefits:**
- ✅ 100% identical environments (same container)
- ✅ True "build once, run anywhere"

**Trade-offs:**
- ❌ Slower CI builds (Docker build overhead)
- ❌ More complex workflow
- ❌ Still needs requirements.txt for maintainability

---

### 🎯 Option C: Hybrid Approach (BALANCED)

**Combine best of both:**

1. Create `requirements.txt` (single source of truth)
2. Keep lightweight GitHub Actions (faster CI)
3. Docker image references `requirements.txt`
4. Both use same dependency file

**This is Option A** - recommended approach.

---

## Implementation Roadmap

### Phase 1: Create Single Source of Truth (IMMEDIATE)
- [ ] Create `requirements.txt` in repository root
- [ ] Copy exact package list from Dockerfile
- [ ] Commit with message: `build: create requirements.txt for dependency management`

### Phase 2: Update Dockerfile (IMMEDIATE)
- [ ] Modify `docker/mkdocs-material/Dockerfile` to use `requirements.txt`
- [ ] Test local build: `docker build -t test ./docker/mkdocs-material`
- [ ] Test local server: `./mkdocs.sh`
- [ ] Commit with message: `build: update Dockerfile to use requirements.txt`

### Phase 3: Update GitHub Actions (IMMEDIATE)
- [ ] Update `.github/workflows/deploy-live.yml` to use `requirements.txt`
- [ ] Update `.github/workflows/deploy-preview.yml` to use `requirements.txt`
- [ ] Test on feature branch before merging
- [ ] Commit with message: `ci: use requirements.txt for Python dependencies`

### Phase 4: Validation (BEFORE MERGE)
- [ ] Local development server works
- [ ] GitHub Actions preview deployment succeeds
- [ ] No regressions in site build

### Phase 5: Documentation (POST-MERGE)
- [ ] Update README.md with dependency update process
- [ ] Document: "To update dependencies, edit requirements.txt only"
- [ ] Add comments in Dockerfile and workflows pointing to requirements.txt

---

## Dependency Update Process (After Implementation)

**Current (BROKEN):**
```bash
# Must update 3 files manually - high error risk
1. Edit docker/mkdocs-material/Dockerfile
2. Edit .github/workflows/deploy-live.yml
3. Edit .github/workflows/deploy-preview.yml
```

**Future (RECOMMENDED):**
```bash
# Single source of truth
1. Edit requirements.txt
2. Test locally: docker build && ./mkdocs.sh
3. Commit and push - CI automatically uses new versions
```

---

## Risk Assessment

| Risk | Current | After Implementation |
|------|---------|---------------------|
| Dependency drift | HIGH | LOW |
| "Works on my machine" | MEDIUM | LOW |
| Update complexity | HIGH | LOW |
| Audit trail | NONE | FULL (git history) |
| Rollback difficulty | HIGH | LOW (git revert) |

---

## Conclusion

**Current Status:** ✅ Environments are functionally identical but ❌ maintained unsafely

**Recommended Action:** Implement **Option A (Requirements.txt with Dockerfile Reuse)** immediately

**Effort:** ~30 minutes implementation, ~15 minutes testing

**Impact:** 
- Eliminates high-risk dependency duplication
- Establishes industry-standard Python dependency management
- Prevents future "works on my machine" issues
- Makes dependency updates 10x easier and safer

**Next Step:** Create `requirements.txt` file and begin Phase 1 implementation

---

## References

### Files Analyzed
- `mkdocs.sh` - Local development container launcher
- `docker/mkdocs-material/Dockerfile` - Custom Docker image definition
- `.github/workflows/deploy-live.yml` - Production deployment workflow
- `.github/workflows/deploy-preview.yml` - Preview deployment workflow

### Research Sources
- "GitHub Actions Docker development environment parity best practices 2024 2025" (Perplexity search)
- "MkDocs Material Docker GitHub Actions best practices requirements.txt vs inline pip install" (Perplexity search)

### Key Best Practices Applied
1. Use same Dockerfile in both local and CI
2. Single source of truth for dependencies (requirements.txt)
3. Version locking for reproducibility
4. Layer caching optimization
5. Clear documentation and audit trails
