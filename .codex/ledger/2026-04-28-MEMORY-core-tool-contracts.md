Goal (incl. success criteria):

- Implement `.compozy/tasks/tools-registry/task_01.md`: replace `internal/tools` metadata-only contracts with canonical ToolID, descriptors, backend/source refs, availability, results, errors, provider/handle interfaces, validators, and tests.
- Success requires focused unit tests, >=80% `internal/tools` coverage, `go test ./internal/tools -race`, `make boundaries`, full `make verify`, task tracking updates, and one local commit if verification is clean.

Constraints/Assumptions:

- Follow workflow memory paths under `.compozy/tasks/tools-registry/memory/`.
- No destructive git commands without explicit user permission.
- Preserve greenfield hard cut: no dotted IDs, no aliases, no legacy descriptor-only execution model.
- `internal/tools` must not import daemon, API, CLI, extension, MCP, session, task, skills, network, or other runtime domains.
- Keep tracking-only workflow memory out of the automatic commit unless repository policy requires it.

Key decisions:

- Use TechSpec Core Interfaces, Data Models, Architectural Boundaries, and Safety Invariants as source of truth.
- This task is limited to core `internal/tools` contracts and validators; executable registry indexing/dispatch/policy surfaces are later tasks.

State:

- Task completed. Core contracts, validators, tests, resource codec preservation, package adaptations, `make boundaries` wrapper, tracking updates, and local commit are complete.
- Final post-amend `make verify` is clean.

Done:

- Loaded `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, `testing-anti-patterns`, `no-workarounds`, `agh-code-guidelines`, and `agh-test-conventions`.
- Read root/internal AGENTS/CLAUDE guidance in the `agh` repo.
- Read shared workflow memory and task_01 workflow memory.
- Read `_techspec.md`, `_tasks.md`, `task_01.md`, and ADR-001 through ADR-010.
- Scanned other `.codex/ledger/*-MEMORY-*.md` files and read relevant tool-registry prior ledgers.
- Replaced old `internal/tools.Tool{Name,...}` shape with canonical `ToolID`, `Descriptor`, `BackendRef`, `SourceRef`, availability, result, deterministic reason, and provider/handle contract types.
- Preserved tool resource schema validation through `NewResourceCodec()` and canonical JSON-object schema handling.
- Adapted extension resource publication plus daemon/API tests needed by the hard-cut contract.
- Verified passing focused packages before compaction: `go test ./internal/tools -race -count=1`, `go test ./internal/extension -count=1`, and `go test ./internal/api/... -count=1`.
- Fixed daemon assertion to validate a semantically incomplete descriptor instead of expecting resource validation for a blank `ToolID` that now fails at JSON marshal time.
- Updated integration-only stale tool assertions to use `Spec.ID` and `Spec.Source.Kind`.
- Added `Makefile` `boundaries` wrapper for the existing Mage `Boundaries` task.
- Focused verification after new validator tests: `go test ./internal/tools -race -count=1`, `go test ./internal/tools -coverprofile=/tmp/tools.cover -count=1` (93.6%), AGH test-shape checker for `internal/tools/*_test.go`, `make boundaries`, and `go test ./internal/extension ./internal/daemon ./internal/api/... -count=1` all pass.
- Resolved full-verify blockers: regenerated SDK TypeScript contracts, added SDK `ToolSource = SourceKind` alias, fixed Go lint large-copy/line-length/noctx findings.
- `make verify` passed after the fixes.
- Updated `.compozy/tasks/tools-registry/task_01.md` status/checklists and `_tasks.md` row 01 to completed; updated workflow memory files.
- Created and amended final local commit `2cebdfe9 feat: add core tool registry contracts`.
- Re-ran final post-amend `make verify`; it passed with web format/lint/typecheck/tests/build, Go lint, race-enabled Go tests, Go build, and package boundaries.

Now:

- Final status check and response.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.compozy/tasks/tools-registry/task_01.md`
- `.compozy/tasks/tools-registry/_techspec.md`
- `.compozy/tasks/tools-registry/_tasks.md`
- `.compozy/tasks/tools-registry/adrs/*.md`
- `.compozy/tasks/tools-registry/memory/task_01.md`
- `internal/tools`
- `magefile.go`
- `internal/extension/resource_publication.go`
- `internal/daemon/tool_mcp_resources.go`
- `internal/api/spec/spec_test.go`
- `internal/api/udsapi/udsapi_integration_test.go`
- `Makefile`
- Final commit: `2cebdfe9`
