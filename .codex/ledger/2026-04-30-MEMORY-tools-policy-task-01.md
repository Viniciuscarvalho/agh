Goal (incl. success criteria):

- Implement tools-refac task_01: dynamic per-call tool policy input resolution and default discovery overlay for `agh__bootstrap`/`agh__catalog`.
- Success requires projection/dispatch parity, deterministic reason codes, focused unit/integration coverage including >=80% affected package coverage, clean `make verify`, task tracking updates, and one local commit without pushing.

Constraints/Assumptions:

- Must use workflow memory files under `.compozy/tasks/tools-refac/memory/` and update task-local memory during the run.
- Must follow AGH root/internal guidance: no destructive git commands, no ignored errors, Go/test skills loaded before edits, no web search for local code.
- Existing worktree has unrelated modified guidance files and an untracked tools-refac PRD bundle; leave unrelated changes intact and avoid staging tracking-only files unless explicitly required.
- Conversation can be BR-PT; code, docs, task artifacts, and commits are English.

Key decisions:

- Use the branch's shipped `internal/tools` registry/evaluator/contracts as authority; add runtime input resolution around them instead of creating a parallel policy engine.
- Default discovery is a runtime overlay, not persisted into agent definitions.
- `Registry.Call` remains the execution-time revalidation path even when projections are filtered.

State:

- Complete. Implementation committed locally as `a4601294 feat: add dynamic tool policy resolver`; post-commit verification passed.

Done:

- Loaded required `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, `testing-anti-patterns`, `systematic-debugging`, `no-workarounds`, and AGH repo-local Go/test guidance.
- Read AGH root/internal guidance, workflow memory, task_01, `_techspec.md`, `_tasks.md`, and ADR-001 through ADR-006.
- Scanned relevant prior tool-registry/tools-refac ledgers for cross-agent awareness.
- Confirmed current registry uses one evaluation path for projection and dispatch but `WithPolicyInputs` is static and not scoped.
- Confirmed daemon boot currently derives policy only from boot config and does not resolve agent/session lineage per call.
- Added scoped `tools.PolicyInputResolver`, daemon runtime resolver, default discovery overlay, and tests for projection/dispatch parity.
- Focused tests passed: `go test ./internal/tools ...`, `go test ./internal/daemon ...`, `go test -cover ./internal/tools` (80.7%), and `go test ./internal/tools ./internal/daemon`.
- Full `make verify` passed after fixing lint issues from `bootToolRegistry` funlen and range value copies.
- Updated `task_01.md` and `_tasks.md` to completed with verification evidence.
- Self-review completed with no additional code corrections.
- Created local commit `a4601294 feat: add dynamic tool policy resolver`.
- Post-commit `make verify` passed: frontend checks completed, Go lint reported `0 issues.`, Go tests reported `DONE 7008 tests in 10.381s`, and package boundaries reported `OK: all package boundaries respected`.

Now:

- Final response.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None currently blocking.

Working set (files/ids/commands):

- PRD dir: `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-refac`
- Task file: `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-refac/task_01.md`
- Master tasks file: `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-refac/_tasks.md`
- Workflow memory: `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-refac/memory/MEMORY.md`, `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-refac/memory/task_01.md`
- Likely code files: `internal/tools/policy.go`, `internal/tools/registry.go`, `internal/tools/dispatch.go`, `internal/daemon/native_tools.go`
- Likely tests: `internal/tools/registry_test.go`, `internal/daemon/native_tools_test.go`
- Added files: `internal/tools/policy_resolver.go`, `internal/daemon/tool_policy_resolver.go`
