---
status: pending
title: "Daytona SSH transport and provider implementation"
type: backend
complexity: critical
dependencies:
  - task_03
  - task_04
  - task_05
---

# Task 06: Daytona SSH transport and provider implementation

## Overview

Implement the Daytona provider with SSH transport, filesystem sync, and full lifecycle management. This is the first remote execution environment, proving the entire abstraction layer works end-to-end: sandbox provisioning via Daytona SDK, ACP agent launch over SSH, file IO via SDK, workspace sync (copy-on-start/collect-on-stop), and cleanup. Includes E2E integration tests.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST implement provider-internal `transport` interface per ADR-002 Design B
- MUST implement `sshTransport` using `golang.org/x/crypto/ssh` with token-based auth
- MUST NOT call `session.RequestPty()` — non-PTY only
- MUST implement SSH token management: fetch via REST API, proactive refresh at 50% expiry
- MUST implement SSH keepalive (30s interval)
- MUST implement `daytonaProvider` fulfilling `Provider` interface
- MUST implement `Prepare()`: create or reattach sandbox via Daytona Go SDK
- MUST implement `SyncToRuntime()`: upload workspace `RootDir` + `AdditionalDirs` via SDK filesystem
- MUST implement `SyncFromRuntime()`: download changed files via SDK filesystem
- MUST implement `Destroy()`: delete or archive sandbox based on profile persistence setting
- MUST implement `daytonaLauncher` fulfilling `Launcher` interface via SSH transport
- MUST implement `daytonaToolHost` fulfilling `ToolHost` interface via Daytona SDK for file ops
- MUST implement allowlist-based env var propagation per TechSpec Security section
- MUST implement network policy enforcement per TechSpec Security section: `AllowPublicIngress` maps to preview link visibility, unsupported policies log warning
- MUST validate required policy settings in `Prepare()` — return error if unsupported and marked required, otherwise log and continue
- MUST pin Daytona Go SDK to specific commit in go.mod
- MUST wrap all SDK calls with AGH error context and timeouts
- MUST include E2E integration tests (tagged, requires `DAYTONA_API_KEY`)
</requirements>

## Subtasks

- [ ] 6.1 Implement provider-internal `transport` interface and `sshTransport`
- [ ] 6.2 Implement SSH token fetch, refresh, and keepalive management
- [ ] 6.3 Implement `daytonaProvider` with sandbox lifecycle (create/start/stop/archive/delete)
- [ ] 6.4 Implement workspace sync via Daytona filesystem SDK (upload/download)
- [ ] 6.5 Implement `daytonaLauncher` and `daytonaToolHost`
- [ ] 6.6 Add env var allowlist filtering for sandbox env propagation
- [ ] 6.7 Write E2E integration tests for full Daytona session lifecycle

## Implementation Details

See TechSpec sections: "Integration Points — Daytona Go SDK", "Integration Points — SSH Transport", "Security — Environment Variable Propagation", build order steps 10-11.

### Relevant Files

- `internal/environment/daytona/transport.go` — Transport interface + `sshTransport` (to create)
- `internal/environment/daytona/ssh.go` — SSH connection and token management (to create)
- `internal/environment/daytona/provider.go` — `daytonaProvider` implementation (to create)
- `internal/environment/daytona/launcher.go` — `daytonaLauncher` (to create)
- `internal/environment/daytona/tool_host.go` — `daytonaToolHost` (to create)
- `internal/environment/daytona/sync.go` — Workspace sync logic (to create)
- `internal/environment/daytona/env.go` — Env var allowlist filtering (to create)
- `internal/environment/types.go` — Interfaces to implement (from task 01)
- `internal/environment/registry.go` — Register `daytona` backend (from task 03)

### Dependent Files

- `internal/daemon/daemon.go` — Will register Daytona provider in registry (task 04 wiring already done)
- `go.mod` — Will add `golang.org/x/crypto` and Daytona SDK dependencies

### Related ADRs

- [ADR-001: Daemon-Native Environment Providers](adrs/adr-001.md) — In-process provider
- [ADR-002: SSH as Primary Transport](adrs/adr-002.md) — SSH non-PTY with internal transport abstraction
- [ADR-003: Session-Scoped Sandbox](adrs/adr-003.md) — One sandbox per session, session-bidirectional sync

## Deliverables

- `internal/environment/daytona/` package with all files listed above
- Daytona provider registered in provider registry
- `go.mod` updated with `golang.org/x/crypto/ssh` and Daytona SDK
- Unit tests with >=80% coverage (mocked SDK/SSH)
- E2E integration tests (tagged `integration`, requires `DAYTONA_API_KEY`)

## Tests

- Unit tests (with mocked Daytona SDK and SSH):
  - [ ] `sshTransport.Dial` connects and returns `io.ReadWriteCloser`
  - [ ] `sshTransport.Dial` fails with invalid token and returns error
  - [ ] SSH token refresh triggers before 50% expiry
  - [ ] `daytonaProvider.Prepare` creates sandbox and returns correct runtime paths
  - [ ] `daytonaProvider.Prepare` with resume token reattaches to existing sandbox
  - [ ] `daytonaProvider.SyncToRuntime` calls SDK upload for root + additional dirs
  - [ ] `daytonaProvider.SyncFromRuntime` calls SDK download for changed files
  - [ ] `daytonaProvider.Destroy` deletes sandbox when `DestroyOnStop` is true
  - [ ] `daytonaProvider.Destroy` archives sandbox when persistence is `archive`
  - [ ] `daytonaLauncher.Launch` returns Handle with working Stdin/Stdout via SSH
  - [ ] `daytonaToolHost.ReadTextFile` calls SDK filesystem read
  - [ ] `daytonaToolHost.WriteTextFile` calls SDK filesystem write
  - [ ] Env var allowlist blocks `DAYTONA_API_KEY` from propagation
  - [ ] Env var allowlist allows `AGH_SESSION_ID` through
  - [ ] Env var allowlist includes profile-level env overrides
  - [ ] Network policy `AllowPublicIngress=false` configures sandbox preview links as private
  - [ ] Unsupported network policy setting logs warning and continues
  - [ ] Required unsupported network policy setting returns error from `Prepare()`
- Integration tests (tagged, requires `DAYTONA_API_KEY`):
  - [ ] Create Daytona sandbox, SSH connect, run `echo test`, verify output
  - [ ] Upload files via sync, verify they exist in sandbox filesystem
  - [ ] Download files from sandbox, verify content matches
  - [ ] Full session lifecycle: create workspace with Daytona profile → create session → verify SSH transport → sync files → stop session → verify sync-back → cleanup sandbox
- Test coverage target: >=80% (unit tests, excluding integration)
- All tests must pass

## Success Criteria

- All tests passing
- Test coverage >=80%
- `make verify` passes
- Daytona provider registered and functional
- E2E: workspace files synced to sandbox, agent launched via SSH, files synced back on stop
- No `DAYTONA_API_KEY` or daemon secrets leak into sandbox
