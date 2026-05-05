Goal (incl. success criteria):

- Remediate CodeRabbit review batch `qa-rounds` PR 82 round 001, issue files `issue_001.md` through `issue_012.md`.
- Success = all scoped issue files read and triaged, valid issues fixed with tests where needed, issue files resolved after verification, `make verify` passes, and exactly one local commit is created.

Constraints/Assumptions:

- Use `cy-fix-reviews` as workflow source of truth and `cy-final-verify` before completion/commit.
- Scope is limited to the listed issue files and listed code files unless a minimal out-of-scope edit is strictly required and documented.
- Do not call provider-specific scripts, `gh` mutations, external resolution commands, or edit issue files outside this batch.
- Do not run destructive git commands (`restore`, `checkout`, `reset`, `clean`, `rm`) without explicit permission.
- Worktree already has uncommitted review-file changes and deletions outside this batch; do not revert or stage unrelated files.
- Conversation in Brazilian Portuguese; artifacts in English.

Key decisions:

- Created a new ledger for this PR 82 round 001 run instead of reusing the previous PR 80 round 002 ledger.
- Read all scoped issue files completely before code edits.

State:

- Completed.

Done:

- Scanned `.codex/ledger/` and read the relevant previous `qa-rounds` ledger for cross-agent awareness.
- Loaded `cy-fix-reviews`, `cy-final-verify`, `internal/CLAUDE.md`, `agh-code-guidelines`, `golang-pro`, `agh-test-conventions`, `testing-anti-patterns`, `systematic-debugging`, and `no-workarounds`.
- Read review round `_meta.md`.
- Checked `git status --short`; found pre-existing modified review files and out-of-scope deletions.
- Read all scoped issue files `issue_001.md` through `issue_012.md`.
- Inspected the relevant code paths for each finding.
- Updated all 12 scoped issue files from `pending` to `valid` with concrete triage notes.
- Implemented fixes for all 12 valid issues, including cursor pass-through, workspace resolver unavailability mapping, CLI workspace flag consolidation, skill name/source normalization, settings response assertions, install wizard state capture, and config sandbox/legacy path coverage.
- Ran targeted checks:
  - `go test ./internal/api/core ./internal/cli ./internal/workspace -count=1` passed.
  - `go test -tags integration ./internal/api/core -run TestTaskRunTerminalHandlersPreserveHistoricalChannelBindingsIntegration -count=1` passed.
  - `.agents/skills/agh-test-conventions/scripts/check-test-conventions.py internal/cli/install_test.go` and touched integration/daemon skill tests passed; broader legacy files still have pre-existing heuristic violations.
- Ran `make verify`; first run exposed a real `unparam` lint issue in `paginateNetworkTimelineViews`, fixed by removing the dead error return.
- Ran `make verify` clean before resolving issue files.
- Marked scoped issues `issue_001.md` through `issue_012.md` as `resolved` and added `## Resolution` notes.
- Ran final pre-commit `make verify` clean.
- Created local commit `6e93dd38 fix: resolve qa-rounds review batch`.
- Ran post-commit `make verify` clean.

Now:

- Done.

Next:

- None for this batch.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.compozy/tasks/qa-rounds/reviews-001/issue_001.md` through `issue_012.md`
- Scoped code files listed in the user request under `internal/api/core` and `internal/cli`.
- Minimal documented support includes `internal/api/core/network_test.go` for issue 003 cursor assertions, `internal/workspace/workspace.go` for issue 002 sentinel, and `internal/api/core/session_workspace.go` for issue 002 status mapping.
- Unrelated dirty files remain unmodified/uncommitted: `.compozy/tasks/qa-rounds/reviews-001/_meta.md`, deleted `.compozy/tasks/qa-rounds/reviews-001/issue_013.md`, and deleted `.compozy/tasks/qa-rounds/reviews-002/*`.
