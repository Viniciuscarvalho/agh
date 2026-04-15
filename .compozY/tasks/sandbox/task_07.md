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

Add environment reconciliation to the daemon boot sequence so that orphaned remote sandboxes from a prior crash are detected and cleaned up. Without this, a daemon crash leaves billable Daytona sandboxes running indefinitely.

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
- MUST attempt reattach via `Provider.Prepare()` with `ResumeToken` for sessions in non-terminal states
- MUST call `Provider.Destroy()` for unrecoverable sandboxes and log the cleanup
- MUST NOT block daemon boot if cleanup fails — log errors and continue
- MUST handle the case where provider SDK is unavailable (e.g., no API key) gracefully
- MUST follow existing pattern of `observer.Reconcile()` for session discovery
</requirements>

## Subtasks

- [ ] 7.1 Add environment reconciliation function to daemon boot
- [ ] 7.2 Load session environment metadata for non-local backends during boot
- [ ] 7.3 Attempt reattach for recoverable sessions, destroy for unrecoverable ones
- [ ] 7.4 Add structured logging for all cleanup actions and errors

## Implementation Details

See TechSpec section: build order step 12.

The reconciliation plugs into `bootRuntime` in `daemon/boot.go` after the existing `cleanupOrphans` call. It uses the same session metadata store that `observer.Reconcile()` uses.

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
- Structured logging for all cleanup actions
- Unit tests with >=80% coverage
- Integration test simulating daemon crash with active remote sessions

## Tests

- Unit tests:
  - [ ] Reconciliation with no remote sessions is a no-op
  - [ ] Reconciliation with recoverable remote session calls `Prepare` with resume token
  - [ ] Reconciliation with unrecoverable session calls `Destroy` and logs
  - [ ] Reconciliation with unavailable provider (no API key) logs warning and continues
  - [ ] Reconciliation failure does not block daemon boot (returns nil, logs error)
  - [ ] Reconciliation skips sessions with `backend=local`
- Integration tests:
  - [ ] Simulate daemon restart with persisted `SessionEnvironmentMeta` for crashed active session — verify reattach via `Prepare` with resume token is attempted
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
