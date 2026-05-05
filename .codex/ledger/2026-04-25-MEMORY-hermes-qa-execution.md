Goal (incl. success criteria):

- Execute Hermes task 11 QA validation end to end using `.compozy/tasks/hermes/qa/` artifacts from task 10.
- Success requires fresh QA evidence in `.compozy/tasks/hermes/qa/verification-report.md`, real backend/CLI/API/SSE/web/site-doc validation, root-cause fixes with regression coverage for any discovered bugs, clean final verification, task tracking updates, and one local commit.

Constraints/Assumptions:

- Required skills: `cy-workflow-memory`, `cy-execute-task`, `qa-execution`, `cy-final-verify`; activate `systematic-debugging` and `no-workarounds` before fixing any QA bug.
- Must use `qa-output-path=.compozy/tasks/hermes`.
- Must not run destructive git commands (`git restore`, `git checkout`, `git reset`, `git clean`, `git rm`) without explicit user permission.
- Must not touch unrelated dirty worktree changes.
- `make verify` is the blocking repository gate before completion/commit.
- Automatic commit enabled only after clean verification, self-review, memory/tracking updates.

Key decisions:

- Use task 10 QA artifacts as the execution matrix seed.
- Keep live evidence under `.compozy/tasks/hermes/qa/logs/`, `.compozy/tasks/hermes/qa/screenshots/`, and `.compozy/tasks/hermes/qa/verification-report.md`.

State:

- QA execution complete; final backend/runtime, integration, web, site, and repository gates are green. Verification report and BUG-001 through BUG-007 issue files are written. Tracking updates and local commit remain.

Done:

- Loaded required skill instructions for workflow memory, PRD task execution, QA execution, and final verification.
- Scanned `.codex/ledger/` and read relevant Hermes/session QA ledgers.
- Read root `AGENTS.md`/`CLAUDE.md`, web `AGENTS.md`/`CLAUDE.md`, Hermes workflow memory, current task memory, `_techspec.md`, `_tasks.md`, and task 11.
- Read ADRs 001-005, task 10 QA plans, regression suite, and all 15 manual test cases.
- Ran QA contract discovery; canonical project gate is `make verify` plus related backend/web/site/e2e lanes.
- Baseline `make deps` and `make verify` passed before live scenario execution.
- Captured live persistence/schema evidence for TC-INT-001 with isolated `AGH_HOME` daemon boot and `schema_migrations` rows.
- Captured ACP/session lifecycle diagnostics evidence for TC-INT-003 with an intentionally missing ACP binary, persisted stopped session failure, HTTP session payload, and crash bundle excerpt.
- Captured automation scheduler restart evidence for TC-INT-004 with a future scheduled job surviving real daemon stop/start.
- Ran focused passing test lanes for TC-INT-001, TC-INT-003, TC-INT-004, TC-SEC-001, and TC-SEC-002.
- TC-SEC-001 live MCP flow exposed a config overlay bug: documented remote MCP TOML fields (`transport`, `url`, `auth.*`) were rejected as unknown keys.
- Fixed remote MCP TOML overlay decoding/merge in `internal/config/merge.go`; added `TestLoadSupportsRemoteMCPAuthFieldsInTOML` in `internal/config/config_test.go`.
- Rebuilt `./bin/agh` and captured passing post-fix MCP redaction evidence through `agh config validate`, `agh config show`, `agh mcp auth status`, daemon settings API, and a secret/token-material check.
- TC-FUNC-001 live memory flow exposed a global DB schema bug: fresh daemon DBs had legacy `memory_operation_log` without `scope`, `workspace_root`, and `filename`, causing real `agh memory write` to fail.
- Fixed memory operation history schema with global migration v6 `add_memory_operation_scope` in `internal/store/globaldb/global_db.go`; added schema assertions in `internal/store/globaldb/global_db_test.go`.
- Rebuilt `./bin/agh` and captured passing post-fix memory evidence through global/workspace writes, CLI health/history, HTTP health/history/list, and a body-content redaction check.
- Captured TC-FUNC-002 setup/config evidence through focused CLI/config tests plus live `config path/list/get/validate/check/set/show`, `update`, and idempotent `uninstall` flows.
- Captured TC-FUNC-003 environment/extension evidence through focused tests plus live `config validate --repair-env`, extension install/list/status, settings API, and redaction checks.
- Captured TC-REG-001 release evidence through the GoReleaser config integrity test and release/site-doc inspection for Homebrew cask, deb/rpm, checksums, cosign signing, and SBOM coverage.
- Captured TC-UI-003 web codegen/lint/typecheck/test evidence; focused Hermes web settings/automation tests passed.
- TC-REG-002 site test initially failed on stale landing assertions; corrected the test to match the current accessible bento heading and four-card extensibility section, tracked as BUG-003.
- Final `make test-integration` initially exposed BUG-004 HTTP prompt drain cancellation, BUG-005 stale CLI TOON header assertion, and BUG-006 reference extension SDK symlink fixture. Fixed root causes/tests and reran integration successfully.
- Final daemon-served web E2E exposed BUG-007: the app route motion key used mutable `router.latestLocation`, causing a delayed `/` to `/jobs` remount that dropped automation editor state. Fixed route keying to reactive `useLocation` and added route-shell regression coverage.
- Final gates passed: `make test-integration`, `make test-e2e-runtime`, `make test-e2e-web`, web lint/typecheck/test, site test/typecheck/build/browser docs, and `make verify`.
- Wrote `.compozy/tasks/hermes/qa/verification-report.md` and issue files BUG-004 through BUG-007.

Now:

- Update task tracking files, self-review changes, stage the Task 11 working set carefully without unrelated dirty files, and create the local commit.

Next:

- Commit Task 11 once tracking and self-review are complete.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Ledger: `.codex/ledger/2026-04-25-MEMORY-hermes-qa-execution.md`
- Workflow memory: `.compozy/tasks/hermes/memory/MEMORY.md`, `.compozy/tasks/hermes/memory/task_11.md`
- Task files: `.compozy/tasks/hermes/task_11.md`, `.compozy/tasks/hermes/_tasks.md`, `.compozy/tasks/hermes/_techspec.md`
- QA root: `.compozy/tasks/hermes/qa/`
- Current evidence roots: `.compozy/tasks/hermes/qa/logs/TC-INT-001/`, `TC-INT-002/`, `TC-INT-003/`, `TC-INT-004/`, `TC-INT-005/`, `TC-SEC-001/`, `TC-SEC-002/`, `TC-FUNC-001/`, `TC-FUNC-002/`, `TC-FUNC-003/`, `TC-REG-001/`
- Bug files: `.compozy/tasks/hermes/qa/issues/BUG-001-remote-mcp-toml-overlay.md`, `.compozy/tasks/hermes/qa/issues/BUG-002-memory-operation-log-schema.md`, `.compozy/tasks/hermes/qa/issues/BUG-003-site-landing-test-drift.md`
- Additional bug files: `.compozy/tasks/hermes/qa/issues/BUG-004-http-prompt-drain-cancel.md`, `.compozy/tasks/hermes/qa/issues/BUG-005-cli-session-list-toon-header.md`, `.compozy/tasks/hermes/qa/issues/BUG-006-reference-extension-sdk-symlink.md`, `.compozy/tasks/hermes/qa/issues/BUG-007-automation-edit-dialog-route-remount.md`
- Verification report: `.compozy/tasks/hermes/qa/verification-report.md`
- Execution corrections to preserve in evidence: `agh daemon restart` is not a command; corrected with explicit stop/start. Non-interactive `agh install` needs a TTY and will be retried through a PTY or recorded as a CLI-mode constraint.
