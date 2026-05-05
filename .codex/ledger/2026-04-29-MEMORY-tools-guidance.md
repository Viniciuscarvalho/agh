Goal (incl. success criteria):

- Implement `.compozy/tasks/tools-refac/task_01.md`: add the startup `tools` prompt section, bundled `agh-tools-guide`, tool-first skill catalog wording, deterministic tests, tracking updates, and one local commit after clean verification.

Constraints/Assumptions:

- Follow `cy-workflow-memory`, `cy-execute-task`, and `cy-final-verify`.
- No destructive git commands without explicit user permission.
- Do not invent the `tools-registry` foundation; task 01 is guidance-only.
- Required task skills `documentation-writer`, `agh-code-guidelines`, and `agh-test-conventions` are not installed in this session; use repo guidance plus installed `golang-pro`, `testing-anti-patterns`, and `skill-best-practices`.
- `make verify` must pass before any completion claim.

Key decisions:

- Treat the accepted PRD/TechSpec/ADR task artifacts as the already-approved design for this implementation run.
- Keep `.compozy/tasks/tools-refac` tracking/memory updates out of the code commit unless explicitly required later.

State:

- Task complete: implementation, focused verification, pre-commit full verification, self-review, tracking updates, commit, and post-commit verification are complete.

Done:

- Read workflow memory files.
- Read root and internal AGENTS/CLAUDE guidance.
- Read task_01, `_tasks.md`, `_techspec.md`, ADR-001 through ADR-006, competitor notes, and relevant prior ledger `2026-04-29-MEMORY-tools-refac.md`.
- Inspected current prompt, catalog, bundled-skill, and tool-package surfaces.
- Captured pre-change signal: `HarnessPromptSectionTools`, `agh-tools-guide`, and `agh__skill_view` catalog guidance are absent.
- Implemented `HarnessPromptSectionTools`, boot-time tools prompt enablement, bundled `agh-tools-guide`, tool-first catalog wording, and daemon/skills/bundled tests.
- Focused tests passed:
  `go test -count=1 -cover ./internal/daemon ./internal/skills ./internal/skills/bundled`
  and targeted integration prompt tests.
- First `make verify` failed in Go lint on `appendCombine` in `internal/daemon/prompt_sections.go`; fixed by combining adjacent descriptor appends.
- Added coverage tests for existing daemon helper surfaces so `internal/daemon` now meets the task coverage target:
  `go test -count=1 -cover ./internal/daemon ./internal/skills ./internal/skills/bundled`
  passed with daemon 80.1%, skills 81.9%, bundled 85.7%.
- Targeted integration prompt tests passed with `-tags integration`.
- Pre-commit `env -u NO_COLOR make verify` passed after replacing direct nil-context test calls with `nilDaemonTestContext()` to remove a golangci autofix warning. Observed remaining warnings are existing Vite chunk-size and macOS linker warnings; golangci reported `0 issues`.
- Self-review found intended code changes scoped to daemon prompt wiring, bundled tools guidance, catalog wording, and tests; `git diff --check -- internal/daemon internal/skills` passed.
- Updated `.compozy/tasks/tools-refac/task_01.md` and `_tasks.md` completion tracking; tracking/memory files stay out of the code commit.
- Created local commit `9115e135 feat: add tools startup prompt guidance`.
- Post-commit `env -u NO_COLOR make verify` passed: format/oxlint `Found 0 warnings and 0 errors`; Vitest `257 passed (257)` and `1832 passed (1832)`; Go lint `0 issues`; Go tests `DONE 6530 tests`; package boundaries `OK`.

Now:

- Ready to hand off.

Next:

- None for task 01 in this session.

Open questions (UNCONFIRMED if needed):

- Whether the pending `tools-registry` task tracking reflects missing foundation work or stale tracking. Current task remains guidance-only to avoid parallel registry implementation.

Working set (files/ids/commands):

- `.compozy/tasks/tools-refac/memory/task_01.md`
- `.compozy/tasks/tools-refac/memory/MEMORY.md`
- `internal/daemon/harness_context.go`
- `internal/daemon/prompt_sections.go`
- `internal/daemon/composed_assembler.go`
- `internal/skills/catalog.go`
- `internal/skills/bundled/skills/agh-tools-guide/SKILL.md`
- `internal/daemon/*_test.go`
- `internal/skills/*_test.go`
- `internal/skills/bundled/*_test.go`
