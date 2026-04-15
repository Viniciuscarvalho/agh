---
status: pending
title: "Daemon restart environment cleanup"
type: backend
complexity: medium
dependencies:
  - task_04
---

# Task 07: Daemon restart environment cleanup

## Overview

Add environment reconciliation to the daemon boot sequence so that orphaned or partially-created remote sandboxes from a prior crash/provider timeout are detected, reattached, or cleaned up. Without this, a daemon crash leaves billable Daytona sandboxes running indefinitely.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST add environment reconciliation step in `bootRuntime` after `cleanupOrphans`
- MUST load persisted `SessionEnvironmentMeta` for all sessions with non-local backends
- MUST attempt reattach via `Provider.Prepare()` with `EnvironmentID`, `InstanceID`, and `ProviderState` for sessions in non-terminal states
- MUST list/find remote sandboxes by `agh_environment_id` when local metadata has `EnvironmentID` but no `InstanceID`
- MUST reattach partial creates when the session is recoverable and destroy them when the session is unrecoverable
- MUST call `Provider.Destroy()` for unrecoverable sandboxes and log the cleanup
- MUST NOT block daemon boot if cleanup fails — log errors and continue
- MUST handle the case where provider SDK is unavailable (e.g., no API key) gracefully
- MUST follow existing pattern of `observer.Reconcile()` for session discovery
</requirements>

## Subtasks

- [ ] 7.1 Add environment reconciliation function to daemon boot
- [ ] 7.2 Load session environment metadata for non-local backends during boot
- [ ] 7.3 Attempt reattach for recoverable sessions, including partial creates found by `agh_environment_id`
- [ ] 7.4 Destroy unrecoverable or orphaned environments and log cleanup
- [ ] 7.5 Add structured logging for all cleanup actions and errors

## Implementation Details

See TechSpec section: build order step 12.

The reconciliation plugs into `bootRuntime` in `daemon/boot.go` after the existing `cleanupOrphans` call and after the canonical resource-runtime reconcile phase when that runtime is enabled. It uses the same session metadata store that `observer.Reconcile()` uses, plus provider label lookup for partial remote creates that never wrote an `InstanceID` locally.

### Relevant Files

- `internal/daemon/boot.go:274-288` — After `cleanupOrphans`, add environment cleanup
- `internal/daemon/orphan.go` — Existing orphan cleanup pattern to follow
- `internal/store/globaldb/global_db_session.go` — Load session environment metadata
- `internal/environment/registry.go` — Lookup provider by backend name
- `internal/environment/types.go` — `Provider.Prepare()` and `Provider.Destroy()` interfaces

### Dependent Files

- None — this is a leaf task

### Related ADRs

- [ADR-003: Session-Scoped Sandbox](adrs/adr-003.md) — Session owns sandbox lifecycle, cleanup on crash

## Deliverables

- Environment reconciliation function in daemon boot
- Partial-create recovery by daemon-owned `EnvironmentID`
- Structured logging for all cleanup actions
- Unit tests with >=80% coverage
- Integration test simulating daemon crash with active remote sessions

## Tests

- Unit tests:
  - [ ] Reconciliation with no remote sessions is a no-op
  - [ ] Reconciliation with recoverable remote session calls `Prepare` with `EnvironmentID`, `InstanceID`, and `ProviderState`
  - [ ] Reconciliation with partial create and no local `InstanceID` finds remote sandbox by `agh_environment_id`
  - [ ] Reconciliation with recoverable partial create attaches sandbox to session and persists returned `InstanceID`/`ProviderState`
  - [ ] Reconciliation with unrecoverable partial create calls `Destroy` and logs cleanup
  - [ ] Reconciliation with unrecoverable session calls `Destroy` and logs
  - [ ] Reconciliation with unavailable provider (no API key) logs warning and continues
  - [ ] Reconciliation failure does not block daemon boot (returns nil, logs error)
  - [ ] Reconciliation skips sessions with `backend=local`
- Integration tests:
  - [ ] Simulate daemon restart with persisted `SessionEnvironmentMeta` for crashed active session — verify reattach via `Prepare` with `EnvironmentID`, `InstanceID`, and `ProviderState` is attempted
  - [ ] Simulate provider create succeeds remotely but times out locally — verify restart reconciliation finds sandbox by `agh_environment_id`
  - [ ] Simulate daemon restart with unrecoverable sandbox (provider returns error) — verify `Destroy` is called and cleanup logged
  - [ ] Simulate daemon restart with stopped session that has remote backend — verify no reattach attempted (terminal state)
- Test coverage target: >=80%
- All tests must pass

## Success Criteria

- All tests passing
- Test coverage >=80%
- `make verify` passes
- Daemon boots successfully even when environment cleanup encounters errors
- Orphaned sandboxes are detected and cleanup is attempted
