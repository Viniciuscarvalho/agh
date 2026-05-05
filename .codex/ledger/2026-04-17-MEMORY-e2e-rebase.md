Goal (incl. success criteria):

- Rebase the current `e2e` branch onto `main` without losing branch-specific work.
- Success means: a safety backup exists, the branch is rebased onto the latest fetched `origin/main`, conflicts are resolved correctly if they occur, and repository verification is run afterward.

Constraints/Assumptions:

- User explicitly requested a rebase from `main`.
- Must follow repo `AGENTS.md`, `CLAUDE.md`, and the `git-rebase` skill workflow.
- Must not use destructive git commands forbidden by workspace policy.
- Current worktree is clean at rebase start.

Key decisions:

- Use a backup-first linear rebase flow rather than squash-first unless divergence analysis shows a strong reason to compress history first.
- Read recent `e2e` ledgers for cross-agent awareness before rewriting branch history.

State:

- Completed.

Done:

- Confirmed current branch is `e2e`.
- Confirmed the working tree is clean.
- Verified the `git-rebase` helper scripts are present.
- Scanned `.codex/ledger/` and read recent related ledgers: `2026-04-17-MEMORY-e2e-review-r3.md`, `2026-04-17-MEMORY-e2e-review-fix.md`, and `2026-04-16-MEMORY-e2e-harness.md`.
- Created the safety backup branch `backup-rebase-e2e-20260417_144521` at commit `b5a08cd804e890c08f0e9a627c2ca670cf065fa7`.
- Fetched `origin`; `origin/main` advanced from `cf2dd190` to `4ded696d`.
- Assessed divergence: `e2e` was 9 commits ahead of and 1 commit behind `origin/main` before the rebase.
- Identified 9 overlapping files between the branch work and `origin/main`'s incoming commit.
- Rebasing onto `origin/main` produced one conflict in `internal/extensiontest/bridge_adapter_harness.go` while replaying `1cabcc7e`.
- Resolved that conflict by keeping the exported marker-helper API added on `e2e` and routing it through the generic JSON-lines wait helper introduced on `main`.
- Ran `go test ./internal/extensiontest` successfully before continuing the rebase.
- Completed `git rebase origin/main` successfully; the rebased branch now ends at `241f616f`.
- Removed the temporary `.rebase-backup-info` file created by the backup script.
- Ran `make verify` successfully after the rebase (`DONE 4697 tests in 28.524s`, package-boundary check OK).

Now:

- None.

Next:

- Force-push the rebased branch with `--force-with-lease` when requested or when the user is ready.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-17-MEMORY-e2e-rebase.md`
- `.codex/ledger/2026-04-17-MEMORY-e2e-review-r3.md`
- `.codex/ledger/2026-04-17-MEMORY-e2e-review-fix.md`
- `.codex/ledger/2026-04-16-MEMORY-e2e-harness.md`
- `.agents/skills/git-rebase/scripts/pre-rebase-backup.sh`
- `git status --short --branch`
- `git rev-parse --abbrev-ref HEAD`
- `git fetch origin`
- `git rebase origin/main`
- `go test ./internal/extensiontest`
- `make verify`
