Goal (incl. success criteria):

- Implement Hermes Task 09: environment, extension, and release hardening.
- Success requires safe `.env` sanitization/repair, extension `requires_env` parsing/validation/status, release packaging hardening with checksums/signing/SBOM preserved, focused tests/dry-run evidence, web/site impact assessment, tracking updates, clean `make verify`, self-review, and one local commit.

Constraints/Assumptions:

- Must follow repository guidance and required skills: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`.
- Must read Hermes workflow memory, PRD docs, ADR-001, and task_08 outputs before code edits.
- Do not run destructive git commands without explicit user permission.
- Do not commit generated secrets, local `.env` contents, private artifacts, or `ai-docs/`.
- Automatic commit is enabled only after clean verification, self-review, and tracking updates.

Key decisions:

- Implement `.env` repair as an explicit config validation/check flag rather than an automatic write during config load.
- Surface extension environment requirements as requirement names only (`requires_env`, `missing_env`), never values.
- Avoid schema churn for extension registry rows by deriving requirement status from the installed manifest path when building status payloads.
- Use GoReleaser `homebrew_casks` plus nFPM `deb`/`rpm` package targets while preserving checksum signing and SBOMs.

State:

- Completed; implementation, verification, tracking updates, self-review, and local commit are done.

Done:

- Loaded required skill instructions.
- Confirmed no prior session ledger file for this task was present.
- Loaded Hermes workflow memory, task_09, \_techspec, \_tasks, ADR-001, task_08, and task_08 memory.
- Audited current `.env`, extension, release, API, web/settings, and site docs surfaces.
- Implemented `.env` parsing/repair, extension `requires_env`, CLI/API/settings/web diagnostics, release package targets, release config test, docs updates, and codegen.
- Focused Go validation passed: `go test ./internal/config ./internal/extension ./internal/cli ./internal/api/contract ./internal/api/core ./internal/daemon ./internal/settings`.
- Full verification passed: `make verify` completed web lint/typecheck/test/build, Go fmt/lint, race-enabled Go tests, build, and boundaries.
- Task tracking updated for task_09, master task list, task_10 QA scope, and workflow memory.
- Fresh pre-commit `make verify` passed with Go lint `0 issues`, `DONE 5851 tests in 6.118s`, and `OK: all package boundaries respected`.
- Created local commit `a799dea3 feat: harden env extension release`.

Now:

- Prepare final response.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Ledger: `.codex/ledger/2026-04-25-MEMORY-hermes-task-09.md`
- Workflow memory: `.compozy/tasks/hermes/memory/MEMORY.md`, `.compozy/tasks/hermes/memory/task_09.md`
- Task docs: `.compozy/tasks/hermes/task_09.md`, `_tasks.md`, `_techspec.md`, ADR-001.
- Baseline commands: `git status --short`, `rg` audits for `.env`, `requires_env`, and GoReleaser packaging.
- Verification so far: `go test ./internal/config ./internal/extension ./internal/cli ./internal/api/contract ./internal/api/core ./internal/daemon ./internal/settings`.
- Final verification: `make verify` passed with Go lint `0 issues`, `DONE 5851 tests in 6.118s`, and `OK: all package boundaries respected`.
- Commit: `a799dea3 feat: harden env extension release`.
