Goal (incl. success criteria):

- Refactor AGH built-in tools implementation so tools are organized by domain (for example task/network) instead of concentrated in one large file.
- Success means behavior is preserved, package cohesion improves, relevant tests pass, and no workaround/symptom patch is introduced.

Constraints/Assumptions:

- Follow repo rules: no destructive git commands, no ignored errors, `make verify` is the full completion gate.
- Go/runtime edits require `internal/CLAUDE.md`, `agh-code-guidelines`, and `golang-pro`.
- User explicitly requested `refactoring-analysis` and `no-workarounds`.
- Conversation in BR-PT; code/artifacts in English.

Key decisions:

- Treat the current single built-in tools file as a Large Module / Divergent Change smell and fix the module boundary, not just move text mechanically.

State:

- Completed.

Done:

- Created session ledger.
- Loaded requested skills `refactoring-analysis` and `no-workarounds`.
- Loaded Go/runtime skills `agh-code-guidelines` and `golang-pro`, plus `internal/CLAUDE.md`.
- Scanned related tools-registry ledgers and task artifacts.
- Confirmed primary smell: `internal/tools/builtin.go` is a 554-line Large Module / Divergent Change hotspot mixing catalog, skills, network, task descriptors, toolsets, source, IDs, and schemas.
- Confirmed existing dirty worktree has unrelated edits; do not touch them.
- Replaced `internal/tools/builtin.go` with `internal/tools/builtin_ids.go` plus `internal/tools/builtin/{catalog,skills,network,tasks,descriptors,source,toolsets}.go`.
- Moved built-in descriptor tests into `internal/tools/builtin/builtin_test.go`.
- Updated daemon native provider wiring/tests to use `internal/tools/builtin`.
- Added `docs/_refacs/20260429-tools-builtin-domain-split.md`.
- Ran focused filtered tests before gofmt: `go test ./internal/tools ./internal/tools/builtin ./internal/daemon -run 'TestBuiltin|TestDaemonNativeTools|TestDaemonBootToolRegistry' -count=1` passed.
- Ran `gofmt` on touched Go files.
- Ran full touched-package tests: `go test ./internal/tools/... ./internal/daemon -count=1` passed.
- Ran `make verify` successfully: Bun lint/typecheck/test/build, Go lint/test/build, and package boundaries passed; final output reported `DONE 6974 tests in 66.632s` and `OK: all package boundaries respected`.

Now:

- Final handoff.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-29-MEMORY-tools-builtin-refactor.md`
- `internal/tools/builtin.go`
- `internal/tools/builtin_test.go`
- `internal/daemon/native_tools.go`
- `internal/daemon/native_tools_test.go`
- `internal/tools/builtin_ids.go`
- `internal/tools/builtin/*.go`
- `docs/_refacs/20260429-tools-builtin-domain-split.md`
