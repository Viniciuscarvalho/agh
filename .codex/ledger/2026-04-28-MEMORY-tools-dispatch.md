Goal (incl. success criteria):

- Implement tools-registry Task 04: central registry dispatch pipeline with schema validation, policy/availability recheck, canonical `tool_id` hooks, result budgets, redaction metadata, cancellation propagation, observability seams, deterministic tests, task tracking updates, clean `make verify`, and one local commit if verification stays clean.

Constraints/Assumptions:

- Follow `/Users/pedronauck/Dev/compozy/agh` root/internal guidance plus task docs under `.compozy/tasks/tools-registry`.
- Required skills in use: `cy-workflow-memory`, `cy-execute-task`, `golang-pro`, `testing-anti-patterns`, `systematic-debugging`, `no-workarounds`, local `agh-code-guidelines`, local `agh-test-conventions`; `cy-final-verify` is required before any completion or commit claim.
- Do not run destructive git commands. Do not touch unrelated pre-existing edits unless necessary for Task 04.
- Existing dirty state before edits: `.compozy/tasks/tools-registry/_tasks.md`, `task_03.md`, and untracked `.compozy/tasks/tools-registry/memory/`.

Key decisions:

- Treat the approved PRD/TechSpec/ADRs as the design approval for this implementation task; the generic brainstorming design gate is not rerun interactively.

State:

- Complete; code/generated changes committed locally, tracking/memory left unstaged.

Done:

- Read workflow memory files for tools-registry shared memory and `task_04.md`.
- Read root and internal AGH guidance plus local AGH Go/test skill files.
- Scanned prior ledger context for tools-registry and hook-dispatch awareness.
- Read Task 04, `_tasks.md`, `_techspec.md`, ADR-003, ADR-005, ADR-006, and ADR-007; no blocking conflicts found.
- Captured pre-change signal: `go test ./internal/tools -run TestRuntimeRegistryCallFailsClosedBeforeDispatchTask -count=1` passes because `Registry.Call` still returns "tool dispatch is not wired"; `rg` shows registry hook payloads/matchers still expose `tool_name`/`tool_namespace`; baseline `internal/tools` coverage is 86.2%.
- Added provider-agnostic `RuntimeRegistry.Call` dispatch, schema validation, policy/availability recheck, hook runner integration, result limiting/redaction, cancellation/timeout errors, and dispatch events.
- Hard-cut tool hook payloads/patches to `tool_id`; tool-family matchers now use `tool_id` while ACP permission-family matching retains `tool_name`.
- Added dispatch tests for invalid input, policy/availability denial, pre-call hook denial, provider failure, cancellation, redaction, truncation, and event ordering.
- Removed the unused registry-owned `tool_namespace` matcher/config projection path to avoid copying enlarged hook matcher values and to complete the canonical `tool_id` hard cut.
- Focused affected packages passed after codegen cleanup: `go test ./internal/tools ./internal/hooks ./internal/config ./internal/settings ./internal/cli ./internal/api/core ./internal/api/httpapi ./internal/daemon ./internal/extension -count=1`.
- Focused coverage passed: `go test ./internal/tools -coverprofile=/tmp/agh-tools-task04.cover -count=1` reported 81.8%.
- Focused race passed: `go test -race ./internal/tools ./internal/hooks -count=1`.
- `make codegen-check`, `git diff --check`, and AGH test-shape checks for `internal/tools/dispatch_test.go` and `internal/tools/registry_test.go` passed.
- Self-review tightened hook-denial behavior so any non-callable pre-call hook decision fails closed and gets `hook_denied` if omitted.
- Final `make verify` passed: frontend format/lint/typecheck/tests/build, Go lint, 6640 Go tests, build, and package boundary checks.
- Local commit created: `6be9d30c` (`feat: implement registry dispatch pipeline`).

Now:

- Final response with verification evidence and commit details.

Next:

- Build visible execution checklist, capture pre-change signal, implement, test, update memory/tracking, verify, self-review, then commit if clean.

Open questions (UNCONFIRMED if needed):

- None currently blocking.

Working set (files/ids/commands):

- `.compozy/tasks/tools-registry/task_04.md`
- `.compozy/tasks/tools-registry/_techspec.md`
- `.compozy/tasks/tools-registry/_tasks.md`
- `.compozy/tasks/tools-registry/adrs/adr-003-runtime-registry-package-boundary.md`
- `.compozy/tasks/tools-registry/adrs/adr-005-acp-approval-policy-integration.md`
- `.compozy/tasks/tools-registry/adrs/adr-006-tool-visibility-by-surface.md`
- `.compozy/tasks/tools-registry/adrs/adr-007-canonical-tool-id-format.md`
- `.compozy/tasks/tools-registry/memory/MEMORY.md`
- `.compozy/tasks/tools-registry/memory/task_04.md`
