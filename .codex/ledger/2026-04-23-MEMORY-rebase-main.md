Goal (incl. success criteria):

- Rebase current branch `session-provider` from `main`/`origin/main` without losing existing work; finish with clean rebase state and verification status.
  Constraints/Assumptions:
- Must not run forbidden destructive git commands (`restore`, `checkout`, `reset`, `clean`, `rm`) without explicit permission.
- Preserve pre-existing dirty files: `.compozy/tasks/session-driver-override/reviews-003/_meta.md` and `.compozy/tasks/session-driver-override/reviews-004/_meta.md`.
- `make verify` is required before completion unless blocked.
  Key decisions:
- Use simple linear rebase because branch is currently ahead by one commit.
- Create a backup branch at pre-rebase HEAD and patch/archive backups for dirty working-tree changes before rebasing.
  State:
- Complete.
  Done:
- Read git-rebase skill instructions.
- Inspected initial git status: `session-provider...origin/session-provider [ahead 1]` with two dirty task metadata files.
- Created safety branch `backup-rebase-20260423-234355` at pre-rebase HEAD `d57307e4e4974cf6d95dea8bc37bed200482b1fe`.
- Backed up dirty metadata files under `/tmp/agh-rebase-main.3qBHbm`.
- Fetched `origin`; `origin/main` advanced from `25db48fa` to `92f1b640`.
- Temporarily stashed only dirty metadata paths as `pre-rebase dirty session-driver metadata`.
- Rebased `session-provider` onto `origin/main` successfully.
- Resolved conflicts in `web/src/hooks/routes/use-session-page-controls.ts`, `web/src/routes/_app/session.$id.tsx`, and `web/src/systems/session/components/chat-header.tsx`.
- Reapplied the pre-existing dirty metadata changes after the rebase.
- Checked for remaining conflict markers with anchored marker search; none found.
- Added commit `3ff4506d` (`test: fix session route delete action mock`) to keep the rebased branch verification-clean.
- Final `make verify` passed after the commit: web format/lint/typecheck/tests/build passed; Go lint/tests/build passed; package boundaries respected.
  Now:
- Report final branch and verification status.
  Next:
- None.
  Open questions (UNCONFIRMED if needed):
- None.
  Working set (files/ids/commands):
- Ledger: `.codex/ledger/2026-04-23-MEMORY-rebase-main.md`
- Backup branch: `backup-rebase-20260423-234355`
- Dirty-file backup: `/tmp/agh-rebase-main.3qBHbm`
- Commands used: `git fetch origin`, `git rebase origin/main`, `git stash apply stash@{0}`, `make verify`, `make web-lint`, `make web-typecheck`
