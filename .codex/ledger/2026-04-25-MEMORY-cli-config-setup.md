Goal (incl. success criteria):

- Complete Hermes Task 08: implement and validate CLI config/setup lifecycle commands, redaction, managed lifecycle behavior, docs/web impact assessment, tracking updates, and one local commit after clean verification.
  Constraints/Assumptions:
- Must use cy-workflow-memory, cy-execute-task, and cy-final-verify.
- Must read workflow memory, AGENTS/CLAUDE, PRD docs, ADR-001, task_01, and task_05 before code edits.
- Must not run destructive git commands; must not print secrets; must run make verify before completion/commit.
  Key decisions:
- Satisfy both Task 08 command names (`get/set/list/path/validate`) and TechSpec names (`show/edit/check`) where feasible, using aliases/thin commands for consistency.
- Reuse Task 05 redaction boundaries for config output and lifecycle diagnostics; do not surface MCP token/auth secret material.
- Keep `agh update` diagnostic/idempotent: defer when `AGH_MANAGED` is set, otherwise recommend manual release/source update without mutating binaries.
- Keep `agh uninstall` non-destructive by default; purge of AGH home requires `--purge --force`.
- No web settings/API contract changes are needed; only CLI and site docs are affected outside Go config helpers.
  State:
- Task complete; implementation, docs, verification, self-review, tracking updates, local commit, and post-commit verification are complete.
  Done:
- Read required skill docs for cy-workflow-memory, cy-execute-task, cy-final-verify, golang-pro, and testing-anti-patterns.
- Read shared workflow memory and task_08 memory.
- Read root AGENTS/CLAUDE guidance, Task 08, `_tasks.md`, `_techspec.md`, ADR-001/002/003/004/005, Task 01 and Task 05 files/memory, and relevant CLI/setup + tools/security analyses.
- Captured pre-change signal: `agh config`, `agh update`, and `agh uninstall` are unknown commands; `agh completion bash` already emits Cobra completion output.
- Added CLI config/lifecycle command implementation and tests; `go test ./internal/cli ./internal/config` passed.
- Ran full `make verify`; result passed with web format/type/test/build, Go lint `0 issues.`, Go tests `DONE 5839 tests`, and package boundaries OK.
- Ran exploratory `bun --cwd packages/site test`; result failed in unrelated dirty landing-page tests, not Task 08 CLI docs.
- Created local commit `c96077ff feat: add cli config lifecycle`.
- Re-ran post-commit `make verify`; result passed with Go lint `0 issues.`, Go tests `DONE 5839 tests in 7.427s`, and package boundaries OK.
  Now:
- Final handoff only.
  Next:
- None.
  Open questions (UNCONFIRMED if needed):
- None.
  Working set (files/ids/commands):
- Ledger: .codex/ledger/2026-04-25-MEMORY-cli-config-setup.md
- Workflow memory: .compozy/tasks/hermes/memory/MEMORY.md; .compozy/tasks/hermes/memory/task_08.md
