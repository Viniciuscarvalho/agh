Goal (incl. success criteria):

- Resolve Hermes CodeRabbit PR 69 review round 002 issues 001-022.
- Success requires reading all scoped issue files, triaging each with concrete reasoning, fixing every valid issue with focused tests, marking each issue resolved after verification, running full repository verification, and creating exactly one local commit.

Constraints/Assumptions:

- Follow `cy-fix-reviews` as source of truth and `cy-final-verify` before completion or commit.
- Do not call provider-specific scripts, `gh` mutations, or external resolution commands.
- Do not edit issue files outside `.compozy/tasks/hermes/reviews-002/issue_001.md` through `issue_022.md`.
- Keep code edits constrained to the listed batch code files unless a minimal out-of-scope edit is technically required and documented.
- Do not run destructive git commands (`git restore`, `git checkout`, `git reset`, `git clean`, `git rm`) without explicit permission.
- Full repository gate is expected to be `make verify`.

Key decisions:

- All 22 scoped issues are valid against current code.
- Issue 006 requires a minimal out-of-scope edit in `internal/config` so the daemon probe timeout is operator-configurable through observability settings.

State:

- In progress: code/test fixes implemented, issues resolved, full verification passed; preparing exactly one local commit.

Done:

- Read required skills: `cy-fix-reviews`, `cy-final-verify`, `systematic-debugging`, `no-workarounds`, `testing-anti-patterns`, and `golang-pro`.
- Scanned `.codex/ledger/` and read relevant Hermes/MCP ledgers for cross-agent awareness.
- Read review round `_meta.md`.
- Read issue files `issue_001.md` through `issue_022.md` completely.
- Verified every finding against current code and updated all issue files from `pending` to `valid` with concrete triage notes.
- Implemented fixes for ACP process registry timeouts, lifecycle managed short-circuits/TOON output, MCP auth close handling/client timeout/logout cleanup, memory operation scoping/history defaults, failure-health recency sorting, and focused test hardening across the scoped packages.
- Fresh targeted tests passed: `go test -count=1 ./internal/acp ./internal/cli ./internal/config ./internal/daemon ./internal/diagnostics ./internal/mcp/auth ./internal/memory ./internal/observe ./internal/retry ./internal/session`.
- Marked all scoped issue files `issue_001.md` through `issue_022.md` as `status: resolved`.
- Fresh full verification passed: `make verify` exited 0, reported `Found 0 warnings and 0 errors.`, `0 issues.`, `DONE 5930 tests in 14.587s`, and `OK: all package boundaries respected`.

Now:

- Stage only scoped batch files and create one local commit.

Next:

- Report final verification evidence and commit hash.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Review dir: `.compozy/tasks/hermes/reviews-002/`
- Issue files: `issue_001.md` through `issue_022.md`
- Code scope: `internal/acp/client.go`, `internal/cli/lifecycle.go`, `internal/cli/mcp_auth.go`, `internal/daemon/daemon.go`, `internal/daemon/daemon_test.go`, `internal/diagnostics/redact_test.go`, `internal/mcp/auth/service.go`, `internal/mcp/auth/service_test.go`, `internal/memory/store.go`, `internal/memory/store_test.go`, `internal/observe/health.go`, `internal/observe/observer_test.go`, `internal/retry/retry_test.go`, `internal/session/crash_bundle_test.go`, `internal/session/prompt_activity_test.go`, `internal/session/resume_repair_test.go`
