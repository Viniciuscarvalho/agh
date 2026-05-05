# Goal (incl. success criteria):

- Implement the accepted `COPY.md` plan: create a root copy system file, wire it into agent instructions, cross-reference from `DESIGN.md`, persist the accepted plan, and verify.

# Constraints/Assumptions:

- Do not run destructive git commands (`git restore`, `git checkout`, `git reset`, `git clean`, `git rm`).
- Worktree is already dirty with many unrelated changes, including files this task touches; preserve existing content and patch narrowly.
- Artifacts must be in English; conversation can be BR-PT.
- `COPY.md` is the chosen filename; title is "Copy System: AGH".

# Key decisions:

- `COPY.md` replaces the earlier `MESSAGING.md` proposal to avoid protocol-message ambiguity.
- `DESIGN.md` remains the visual authority; `COPY.md` becomes the verbal/product-language authority.
- `docs/_memory/glossary.md` remains the canonical vocabulary authority.

# State:

- Implementation complete; verification passed.

# Done:

- Accepted plan recorded in chat.
- Accepted plan persisted to `.codex/plans/2026-05-01-copy-system.md`.
- Ledger created at `.codex/ledger/2026-05-01-MEMORY-copy-system.md`.
- Skills read: `copywriting`, `documentation-writer`, `crafting-effective-readmes`.
- Dirty worktree checked.
- Added root `COPY.md`.
- Updated root `AGENTS.md`/`CLAUDE.md`, `packages/site` instructions, `web` instructions, and `DESIGN.md` cross-reference.
- Static checks passed:
  - `rg -n "COPY\\.md|Copy System" ...` found expected references.
  - ASCII check over `COPY.md`, plan, and ledger returned no non-ASCII output.
  - `git diff --check -- <working set>` exited 0.
- `make verify` exited 0. Final output included `DONE 7165 tests in 51.892s` and `OK: all package boundaries respected`.

# Now:

- Summarize completed implementation and verification evidence to the user.

# Next:

- None.

# Open questions (UNCONFIRMED if needed):

- None.

# Working set (files/ids/commands):

- `.codex/plans/2026-05-01-copy-system.md`
- `.codex/ledger/2026-05-01-MEMORY-copy-system.md`
- `COPY.md`
- `AGENTS.md`, `CLAUDE.md`
- `packages/site/AGENTS.md`, `packages/site/CLAUDE.md`
- `web/AGENTS.md`, `web/CLAUDE.md`
- `DESIGN.md`
- Commands: `rg`, ASCII grep, `git diff --check`, `make verify`
