Goal (incl. success criteria):

- Complete task `Unified Capability Schema, Canonicalization, and Session Projection` in `agh2`.
- Success means `internal/config` owns the extended authored capability schema and canonical digesting, `internal/session` projects the normalized runtime shape without aliasing config-owned slices, required unit/integration tests pass, workflow memory/task tracking are updated, `make verify` passes, and one local commit is created.

Constraints/Assumptions:

- Required skills for this run: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, and `testing-anti-patterns`.
- Source of truth lives in `/Users/pedronauck/dev/compozy/agh/.compozy/tasks/unified-capabilities/`, especially `_techspec.md`, `task_01.md`, `_tasks.md`, and ADR-001/002.
- Scope stays inside `internal/config` and `internal/session` plus tests/tracking artifacts required by task 01; no network/API/doc rewrites in this task.
- Missing capability catalogs must remain optional and deterministic.
- Worktree was clean at task start.

Key decisions:

- Use this ledger slug `unified-capability-schema`.
- Treat the current code gap as structural, not behavioral: `internal/config.CapabilityDef` and `internal/session.NetworkPeerCapability` currently lack `version`, `requirements`, and `digest`, so task 01 is not yet implemented even though the repo is green.
- Keep canonicalization and digest ownership in `internal/config`, with session projecting cloned runtime data only.
- Canonical runtime normalization sorts `requirements`, rejects blank or duplicate entries after normalization, and keeps unresolved requirement targets valid for downstream remote-dependency flows.

State:

- completed

Done:

- Read repo instructions from `AGENTS.md` and `CLAUDE.md`.
- Read required skills for workflow memory, PRD task execution, final verification, Go implementation, and test guardrails.
- Read workflow memory templates and task docs from sibling repo `agh`, including `_techspec.md`, `_tasks.md`, `task_01.md`, ADR-001, and ADR-002.
- Scanned other ledger files for cross-agent awareness and found recent capability-related work that this task builds on.
- Reconciled workspace state: `git status --short` was clean.
- Inspected initial task surfaces in `internal/config/capabilities.go`, `internal/config/agent.go`, `internal/config/agent_capabilities_test.go`, `internal/session/network_peer.go`, and `internal/session/manager_lifecycle.go`.
- Extended `internal/config.CapabilityDef` with `Version`, `Requirements`, and runtime-only `Digest`.
- Added canonical digest generation in `internal/config` and rejected authored `digest` plus invalid version/requirements input.
- Added config tests for version/requirements normalization, TOML/JSON parity, digest stability, digest sensitivity, and invalid schema cases.
- Extended `internal/session.NetworkPeerCapability` and projection helpers with `Version`, `Digest`, and `Requirements`.
- Added session unit/integration coverage for unified capability projection and alias safety when a network lifecycle mutates projected capability slices.
- Verified:
  - `go test ./internal/config -count=1`
  - `go test ./internal/session -count=1`
  - `go test -tags integration ./internal/session -run 'TestManagerIntegrationCapability(AwareJoinCarriesCatalogAcrossCreateResumeAndStop|ProjectionDoesNotAliasSourceCatalog|AwareJoinKeepsMissingCatalogProjectionEmpty)$' -count=1`
  - `go test ./internal/config -cover -count=1` -> `82.5%`
  - `go test ./internal/session -cover -count=1` -> `81.4%`
  - `make verify` -> pass

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-20-MEMORY-unified-capability-schema.md`
- `/Users/pedronauck/dev/compozy/agh/.compozy/tasks/unified-capabilities/_techspec.md`
- `/Users/pedronauck/dev/compozy/agh/.compozy/tasks/unified-capabilities/task_01.md`
- `internal/config/capabilities.go`
- `internal/config/capabilities_test.go`
- `internal/config/agent.go`
- `internal/config/agent_capabilities_test.go`
- `internal/session/network_peer.go`
- `internal/session/network_peer_test.go`
- `internal/session/manager_integration_test.go`
- `git status --short`
- `make verify`
- `4508bfe6`
