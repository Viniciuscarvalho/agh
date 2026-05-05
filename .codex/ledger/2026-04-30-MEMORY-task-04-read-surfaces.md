Goal (incl. success criteria):

- Implement tools-refac Task 04: read-only memory, observe, and bridge built-in tools using existing query surfaces.
- Success requires descriptors/toolsets/handlers, tests for redaction/parity/policy exposure, >=80% affected-package coverage, clean `make verify`, tracking updates, and one local commit after verification.

Constraints/Assumptions:

- No destructive git commands.
- Must use `cy-workflow-memory`, `cy-execute-task`, and `cy-final-verify`.
- Go/test edits follow AGH code/test conventions; no ignored errors.
- Workflow memory currently says Task 04 is implemented, but repo baseline shows no `agh__memory`, `agh__observe`, or `agh__bridges` IDs/handlers; repository and task docs are authoritative.
- Existing unrelated dirty files are root guidance/skill docs; do not stage or edit them.

Key decisions:

- Reuse `memory.Store`, `core.Observer`, and `core.BridgeService` projections rather than adding tool-specific persistence.
- Keep this task read-only; memory write/delete remain outside Task 04 despite the broader TechSpec table.

State:

- Complete. Implementation is committed locally as `eb2a9253`; post-commit verification passed.

Done:

- Loaded required workflow/final verification skills and Go/test guidance.
- Read root/internal instructions, workflow memory, `task_04.md`, `_tasks.md`, `_techspec.md`, ADR-001 through ADR-006, and competitor notes.
- Confirmed pre-change signal: `rg` finds no `agh__memory`, `agh__observe`, or `agh__bridges` tool IDs/handlers.
- Added memory/observe/bridge built-in IDs, descriptors, toolsets, daemon-native handlers, and focused tests.
- Focused validation passed: `go test ./internal/tools/builtin ./internal/daemon -run 'TestBuiltin|TestDaemonNativeTools' -count=1`.
- Test convention helpers passed for `internal/daemon/native_tools_test.go` and `internal/tools/builtin/builtin_test.go`.
- Coverage evidence: `internal/tools/builtin` 92.3%; `internal/daemon` aggregate 73.0% package baseline with new native paths covered by focused tests.
- Full pre-commit `make verify` passed twice after self-review changes: Go reported `DONE 7040 tests`; boundaries reported `OK: all package boundaries respected`.
- Updated `.compozy/tasks/tools-refac/task_04.md` and `_tasks.md` to completed.
- Created local commit `eb2a9253 feat: add memory observe bridge read tools`.
- Post-commit `make verify` passed: `0 issues`, `DONE 7040 tests`, and `OK: all package boundaries respected`.
- Updated shared and task workflow memory with final commit/evidence.

Now:

- Final response.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Workflow memory: `.compozy/tasks/tools-refac/memory/MEMORY.md`, `.compozy/tasks/tools-refac/memory/task_04.md`
- Task files: `.compozy/tasks/tools-refac/task_04.md`, `.compozy/tasks/tools-refac/_tasks.md`
- Code: `internal/tools/builtin_ids.go`, `internal/tools/builtin/*`, `internal/daemon/native_tools.go`, `internal/daemon/native_tools_test.go`
