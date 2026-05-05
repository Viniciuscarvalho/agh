Goal (incl. success criteria):

- Resolve Hermes CodeRabbit PR 69 review round 001 issues 021-031.
- Success requires reading all scoped issue files, triaging each with concrete reasoning, fixing every valid issue with focused tests, marking each issue resolved after verification, running full repository verification, and creating exactly one local commit.

Constraints/Assumptions:

- Follow `cy-fix-reviews` as source of truth and `cy-final-verify` before completion or commit.
- Do not call provider-specific scripts, `gh` mutations, or external resolution commands.
- Do not edit issue files outside `.compozy/tasks/hermes/reviews-001/issue_021.md` through `issue_031.md`.
- Keep code edits constrained to the listed batch code files unless a minimal out-of-scope edit is technically required and documented.
- Do not run destructive git commands (`git restore`, `git checkout`, `git reset`, `git clean`, `git rm`) without explicit permission.
- Full repository gate is expected to be `make verify`.

Key decisions:

- All 11 scoped issues are valid against current code.
- Issue 029 requires a minimal out-of-scope production edit in `internal/skills/provenance.go` to expose a structured symlink escape error identity; test-only changes cannot satisfy the review.
- Valid fixes may add or update focused test files adjacent to the scoped code to prove behavior.

State:

- Batch complete and committed locally.

Done:

- Read required skills: `cy-fix-reviews`, `cy-final-verify`, `systematic-debugging`, `no-workarounds`, `testing-anti-patterns`, and `golang-pro`.
- Scanned `.codex/ledger/` and read relevant Hermes ledgers for cross-agent awareness, including prior review batch 001-020.
- Read review round `_meta.md`.
- Read issue files `issue_021.md` through `issue_031.md` completely.
- Checked scoped implementation paths and updated issue files from `pending` to `valid` with concrete root-cause triage notes.
- Implemented scoped fixes for memory health operation filters, observe failure status aggregation, Windows process-group unsupported signaling, retry error wrapping/test structure, crash bundle filename truncation, liveness failure preservation, runtime timeout stop deadline configuration, skills symlink error identity, automation scheduler SQLite constraint handling, and encrypted MCP auth token persistence.
- Added/updated focused regression tests across `internal/memory`, `internal/observe`, `internal/retry`, `internal/session`, `internal/skills`, and `internal/store/globaldb`.
- Targeted tests passed: `go test ./internal/memory ./internal/observe ./internal/procutil ./internal/retry ./internal/session ./internal/skills ./internal/store/globaldb`.
- Windows process utility compile check passed: `GOOS=windows go test -c ./internal/procutil -o /tmp/agh-procutil-windows.test.exe`.
- Full `make verify` failed in lint with goconst/gosec/lll findings; gofmt/golangci auto-fix split the long lines, remaining manual fixes are a crash-bundle fallback-name constant and a justified gosec false-positive suppression for a key-file suffix constant.
- Full `make verify` passed after lint cleanup: web format/lint/typecheck/vitest/build, Go lint, race tests, build, dependency check, and architecture check completed successfully.
- Marked issue files `issue_021.md` through `issue_031.md` resolved.
- Final `make verify` passed after resolving issue files: web format/lint/typecheck/vitest/build, Go lint, race tests, build, dependency check, and architecture check completed successfully.
- Created local commit `8abfcf4c fix: resolve hermes review issues 021-031`.
- Post-commit `make verify` passed: web format/lint/typecheck/vitest/build, Go lint, race tests, build, dependency check, and architecture check completed successfully.
- Post-commit status has one pre-existing/unscoped untracked file left unstaged: `.compozy/tasks/hermes/reviews-001/_meta.md`.

Now:

- Report commit hash and verification evidence.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Review dir: `.compozy/tasks/hermes/reviews-001/`
- Issue files: `issue_021.md` through `issue_031.md`
- Code scope: `internal/memory/store.go`, `internal/observe/health.go`, `internal/procutil/process_group_windows.go`, `internal/retry/retry.go`, `internal/retry/retry_test.go`, `internal/session/crash_bundle.go`, `internal/session/liveness.go`, `internal/session/prompt_activity.go`, `internal/skills/provenance_test.go`, `internal/store/globaldb/global_db_automation_scheduler.go`, `internal/store/globaldb/global_db_mcp_auth.go`
