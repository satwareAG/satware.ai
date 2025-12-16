# Fork Cleanup Implementation Plan

[Overview]
Safely synchronize origin fork (jane-alesi/satware.ai) with upstream (satwareAG/satware.ai) using Baby Steps™ methodology, preserving unique local content while cleaning up stale branches.

The fork has diverged from upstream with stale feature branches from June-November 2025. The upstream repository (satwareAG/satware.ai) is the authoritative source of truth. This cleanup will:
- Preserve unique internal documentation before reset
- Sync the main-mkdocs branch with upstream
- Remove stale feature branches that are either merged or abandoned
- Establish a clean working state for future contributions

**Current State Analysis:**
- Remote `origin`: jane-alesi/satware.ai.git (fork)
- Remote `upstream`: satwareAG/satware.ai.git (source of truth)
- Current branch: `feature/156-add-brenda-alesi-profile` (4 commits ahead, 20+ behind upstream)
- Uncommitted changes: 7 files (branding fixes + deletions)
- Stale branches on origin: 6 branches from June 2025

[Types]
No type definitions required - this is a git repository cleanup operation.

This plan involves git operations only, not code changes. The "types" in this context are:
- **Branch categories**: stale (June 2025), merged (confirmed in upstream), active (recent work)
- **File categories**: unique-to-preserve, modified-discard, deleted-from-upstream

[Files]
One file to preserve, uncommitted changes to handle, and multiple branch deletions.

**Files to Preserve (copy before cleanup):**
1. `docs/internal/session-2025-11-09-complete.md` → Copy to `/tmp/satware-ai-backup/`
   - Reason: Only file unique to local that doesn't exist in upstream

**Uncommitted Changes (decision required):**
- `docs/index.md` - "satware AI" → "satware® AI" (branding fix) → **Commit to upstream PR**
- `docs/blog/posts/2025-06-04-*.md` - Same branding fix → **Commit to upstream PR**
- `docs/blog/posts/2025-06-13-*.md` - Same branding fix → **Commit to upstream PR**
- `LICENSE` - Deleted → **Discard (restore from upstream)**
- `docs/assets/images/home/testimonials/ocupro.*` - Deleted → **Discard**
- `docs/assets/js/consent.js` - Deleted → **Discard**

**No new files to create in repository** (except this plan in docs/internal/).

[Functions]
No code functions involved - git commands only.

**Git Operations Sequence:**
1. `git stash` - Save uncommitted branding fixes
2. `git checkout main-mkdocs` - Switch to main branch
3. `git fetch upstream` - Get latest upstream changes
4. `git reset --hard upstream/main-mkdocs` - Sync main-mkdocs with upstream
5. `git push origin main-mkdocs --force-with-lease` - Update origin
6. `git branch -D <local-branches>` - Delete local stale branches
7. `git push origin --delete <branch>` - Delete remote stale branches
8. `git stash pop` - Restore branding fixes
9. `git checkout -b fix/branding-trademark-symbol` - Create new clean branch
10. `git add/commit/push` - Commit branding fixes for upstream PR

[Classes]
No classes involved - this is a git repository management operation.

**Branch Management:**

**Branches to DELETE from origin:**
| Branch | Last Activity | Reason |
|--------|--------------|--------|
| `blog-evolution-llm-thinking` | June 2025 | Stale, never merged |
| `blog/ki-revolution-2025-emotionale-intelligenz` | June 2025 | Stale, never merged |
| `feature/replace-custom-lightbox` | June 2025 | Stale, never merged |
| `fix/critical-404-redirects` | June 2025 | Stale, never merged |
| `ideas` | June 2025 | Scribble branch, never used |
| `feature/elevenlabs-convai-widget` | Dec 2025 | **Already merged to upstream as PR #221** |
| `feature/156-add-brenda-alesi-profile` | Nov 2025 | Content already in upstream |

**Branches to KEEP on origin:**
| Branch | Reason |
|--------|--------|
| `main-mkdocs` | Main development branch |
| `archive-jekyll` | Historical archive |
| `gh-pages` | GitHub Pages deployment |
| `feature/vhs-dates` | Active work (Nov 2025) - review separately |

**Local Branches to DELETE:**
| Branch | Reason |
|--------|--------|
| `feature/156-add-brenda-alesi-profile` | Will be reset |
| `feature/dev-env-inspection` | Marked [gone], orphaned |

[Dependencies]
No package dependencies involved.

**Tool Requirements:**
- `git` CLI (already available)
- `gh` CLI (optional, for PR creation)
- Write access to origin remote (jane-alesi/satware.ai)

**No npm/pip/composer changes required.**

[Testing]
Verification steps after each Baby Step™.

**Verification Commands:**

1. **After backup:**
   ```bash
   ls -la /tmp/satware-ai-backup/
   ```

2. **After main-mkdocs reset:**
   ```bash
   git log --oneline -5 main-mkdocs
   git log --oneline -5 upstream/main-mkdocs
   # Should show identical commits
   ```

3. **After branch cleanup:**
   ```bash
   git branch -r | grep origin | wc -l
   # Should show 4 branches: main-mkdocs, archive-jekyll, gh-pages, feature/vhs-dates
   ```

4. **After branding fix branch creation:**
   ```bash
   git status
   # Should show clean working tree on new branch
   ```

5. **Final verification:**
   ```bash
   git fetch origin
   git fetch upstream
   git log --oneline origin/main-mkdocs..upstream/main-mkdocs
   # Should show nothing (in sync)
   ```

[Implementation Order]
Twelve Baby Steps™ with verification after each step.

**Phase 1: Preparation (Steps 1-3)**

1. **Create backup directory and save unique files**
   ```bash
   mkdir -p /tmp/satware-ai-backup/
   cp docs/internal/session-2025-11-09-complete.md /tmp/satware-ai-backup/
   ```
   - Verify: File exists in backup location

2. **Stash uncommitted branding fixes (keep for later)**
   ```bash
   git stash push -m "branding-fixes-trademark" -- \
     docs/index.md \
     docs/blog/posts/2025-06-04-ki-fuer-einsteiger-live-erleben.md \
     docs/blog/posts/2025-06-13-ki-digitaler-kollege-handwerk-gunta-alesi-webinar.md
   ```
   - Verify: `git stash list` shows the stash

3. **Discard remaining uncommitted deletions**
   ```bash
   git checkout -- LICENSE
   git checkout -- docs/assets/images/home/testimonials/
   git checkout -- docs/assets/js/consent.js
   git status
   ```
   - Verify: Working tree clean or only stashed files

**Phase 2: Main Branch Sync (Steps 4-6)**

4. **Switch to main-mkdocs and fetch upstream**
   ```bash
   git checkout main-mkdocs
   git fetch upstream
   git fetch origin
   ```
   - Verify: On main-mkdocs branch

5. **Hard reset main-mkdocs to upstream**
   ```bash
   git reset --hard upstream/main-mkdocs
   ```
   - Verify: `git log --oneline -3` matches upstream

6. **Force push to sync origin/main-mkdocs**
   ```bash
   git push origin main-mkdocs --force-with-lease
   ```
   - Verify: GitHub shows identical commits
   - **⚠️ REQUIRES APPROVAL** - destructive operation

**Phase 3: Local Branch Cleanup (Steps 7-8)**

7. **Delete local stale branches**
   ```bash
   git branch -D feature/156-add-brenda-alesi-profile
   git branch -D feature/dev-env-inspection
   ```
   - Verify: `git branch` shows only main-mkdocs

8. **Verify local branch state**
   ```bash
   git branch -v
   ```
   - Verify: Clean local branch list

**Phase 4: Remote Branch Cleanup (Steps 9-10)**

9. **Delete stale branches from origin (batch 1 - oldest)**
   ```bash
   git push origin --delete blog-evolution-llm-thinking
   git push origin --delete blog/ki-revolution-2025-emotionale-intelligenz
   git push origin --delete feature/replace-custom-lightbox
   ```
   - Verify: Branches no longer visible on GitHub
   - **⚠️ REQUIRES APPROVAL** - destructive operation

10. **Delete stale branches from origin (batch 2 - remaining)**
    ```bash
    git push origin --delete fix/critical-404-redirects
    git push origin --delete ideas
    git push origin --delete feature/elevenlabs-convai-widget
    git push origin --delete feature/156-add-brenda-alesi-profile
    ```
    - Verify: `git branch -r | grep origin` shows only 4 branches
    - **⚠️ REQUIRES APPROVAL** - destructive operation

**Phase 5: Restore and Create PR (Steps 11-12)**

11. **Create clean branch for branding fixes**
    ```bash
    git checkout -b fix/branding-trademark-symbol
    git stash pop
    ```
    - Verify: Files restored, ready to commit

12. **Commit branding fixes and push**
    ```bash
    git add docs/index.md docs/blog/posts/2025-06-04-*.md docs/blog/posts/2025-06-13-*.md
    git commit -m "fix: Use trademark symbol in satware® AI branding"
    git push origin fix/branding-trademark-symbol
    ```
    - Verify: Branch pushed, ready for PR to upstream
    - Create PR: `gh pr create --repo satwareAG/satware.ai --title "fix: Use trademark symbol in satware® AI branding"`

**Post-Cleanup:**

13. **Restore preserved internal docs (if not in upstream)**
    ```bash
    cp /tmp/satware-ai-backup/session-2025-11-09-complete.md docs/internal/
    git add docs/internal/session-2025-11-09-complete.md
    git commit -m "docs: Restore session notes from fork cleanup"
    git push origin fix/branding-trademark-symbol
    ```

**Rollback Plan:**
If any step fails critically:
```bash
# Restore from GitHub (origin still has old state until force push)
git fetch origin
git reset --hard origin/main-mkdocs

# Or restore specific branch
git checkout -b <branch-name> origin/<branch-name>
```

---

**Estimated Time:** 15-20 minutes
**Risk Level:** Medium (force push involved, but backup created)
**Requires Approval:** Steps 6, 9, 10 (destructive git operations)
