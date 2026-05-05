Goal (incl. success criteria):

- Remediate the current CodeRabbit review feedback for PR #11 by validating each unresolved issue against HEAD, implementing only the valid fixes with production-quality Go code and tests, running full repo verification, creating one local remediation commit, and resolving the GitHub review threads that correspond to addressed issues.

Constraints/Assumptions:

- Must follow `/Users/pedronauck/Dev/projects/agh/AGENTS.md` and `/Users/pedronauck/Dev/projects/agh/CLAUDE.md`.
- Required skills in use: `fix-coderabbit-review`, `systematic-debugging`, `no-workarounds`, `golang-pro`, `testing-anti-patterns`, `cy-final-verify`.
- Do not touch unrelated files or use destructive git commands.
- `ai-docs/` may be generated locally for review export state but must not be committed.
- Current worktree started clean.
- The user supplied a pasted issue list, but live PR export remains the source of truth for unresolved thread state.

Key decisions:

- Re-export the current PR #11 review state before editing so triage is based on live unresolved threads, not stale pasted comments.
- Validate every issue technically before changing code; mark invalid findings with evidence rather than forcing low-value or incorrect edits.
- Use the repository verification gate `make verify` before any completion claim or commit.
- Treat the active-session stop-metadata review suggestion as INVALID because the current resume-repair contract intentionally preserves crash classification across `Resume()`, and a fresh integration test confirms that behavior.

State:

- In progress.

Done:

- Read root instructions and the required skill docs.
- Scanned existing ledgers for cross-agent awareness.
- Confirmed the tracked worktree is clean.
- Exported the live PR #11 review set to `ai-docs/reviews-pr-11/` and confirmed 13 unresolved review-thread issues.
- Triaged the exported issues: 12 VALID, 1 INVALID (`issue 007` on clearing stop metadata during activation).
- Implemented the validated fixes:
  - normalized `conversa.jsonl` into valid one-line JSONL entries and added missing `ts` fields
  - wrapped the flagged tests in `t.Run("Should...")` and strengthened error assertions
  - centralized stop-reason normalization in `internal/session/query.go`
  - preserved `Config.Session` in workspace config cloning and added regression coverage
  - added explicit stop-metadata clearing support to `store.SessionStateUpdate` / global DB updates with regression coverage
  - moved the workspace-migration `PRAGMA foreign_keys` toggle onto a dedicated SQLite connection
- Added VALID/INVALID triage notes to the local exported issue files.
- Verified the data artifact with `jq -c . conversa.jsonl`.
- Verified targeted package tests with `go test ./internal/api/contract ./internal/config ./internal/observe ./internal/session ./internal/store/... ./internal/workspace -count=1`.
- Verified the INVALID disposition with `go test -tags integration ./internal/session -run TestManagerIntegrationResumeClassifiesCrashAndActivates -count=1`.

Now:

- Run the full repo verification gate, then create the single remediation commit and resolve the VALID review threads.

Next:

- Refresh the local review summary after thread resolution and report any intentionally unresolved INVALID thread.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-10-MEMORY-pr11-review-fix.md`
- `.agents/skills/fix-coderabbit-review/SKILL.md`
- `.agents/skills/systematic-debugging/SKILL.md`
- `.agents/skills/no-workarounds/SKILL.md`
- `.agents/skills/testing-anti-patterns/SKILL.md`
- `.agents/skills/golang-pro/SKILL.md`
- `.agents/skills/cy-final-verify/SKILL.md`
- `ai-docs/reviews-pr-11/_summary.md`
- `ai-docs/reviews-pr-11/issues/*.md`
- `conversa.jsonl`
- `internal/api/contract/contract_test.go`
- `internal/config/config_test.go`
- `internal/observe/observer.go`
- `internal/session/query.go`
- `internal/session/query_test.go`
- `internal/session/session_test.go`
- `internal/session/stop_reason_test.go`
- `internal/store/types.go`
- `internal/store/globaldb/global_db_session.go`
- `internal/store/globaldb/global_db_test.go`
- `internal/store/globaldb/migrate_workspace.go`
- `internal/store/meta_test.go`
- `internal/store/stop_reason_test.go`
- `internal/workspace/clone.go`
- `internal/workspace/resolver_test.go`
- `GITHUB_TOKEN=\"$(gh auth token)\" NODE_PATH=/tmp/pr11-review.fXCqTz/node_modules /tmp/pr11-review.fXCqTz/node_modules/.bin/tsx .claude/skills/fix-coderabbit-review/scripts/pr-review.ts 11 --hide-resolved`
- `go test ./internal/api/contract ./internal/config ./internal/observe ./internal/session ./internal/store/... ./internal/workspace -count=1`
- `go test -tags integration ./internal/session -run TestManagerIntegrationResumeClassifiesCrashAndActivates -count=1`
