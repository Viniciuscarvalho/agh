Goal (incl. success criteria):

- Implement task 02 for agent capabilities by plumbing capability-aware runtime data from `internal/session` into the network join boundary.
- Success requires: richer session-to-network join input, unchanged leave/no-op semantics, focused unit/integration coverage, updated tracking/memory, and clean verification.

Constraints/Assumptions:

- Must follow task docs under `.compozy/tasks/agent-capabilities`, especially `_techspec.md`, ADRs, and `task_01.md`.
- Must use `AgentDef.Capabilities` / normalized runtime data from task 01; `internal/network` must not parse local capability files.
- Must preserve current `joinNetworkPeer` no-op behavior for nil session, blank channel, and missing lifecycle handler.
- Must not touch unrelated dirty worktree files.
- `make verify` is the blocking completion gate.

Key decisions:

- Implement the seam as `session.NetworkPeerJoin`, carrying `session_id`, `peer_id`, `channel`, and a narrow runtime-owned capability projection (`id`, `summary`) rather than leaking config loader concerns into `internal/network`.
- Standardize the no-catalog path on a deterministic empty capability slice so downstream projection and tests do not depend on nil slice behavior.

State:

- completed

Done:

- Read workspace instructions, required skill docs, workflow memory, task docs, techspec, ADRs, and task 01.
- Scanned relevant prior ledgers for agent-capabilities context.
- Inspected the current session/network join seam and confirmed the pre-change gap: session passes only identifiers/channel and network falls back to `DefaultPeerCard(peerID)`.
- Added `session.NetworkPeerJoin` plus runtime capability projection helpers in `internal/session`.
- Threaded projected capabilities from `prepareSessionStartRuntime()` through activation/join into the late-bound network lifecycle.
- Updated `internal/network` local join preparation to consume runtime-provided capability data when building the local peer card.
- Added unit and integration regressions across `internal/session`, `internal/network`, and dependent daemon tests.
- Verified with:
  - `go test ./internal/session -count=1`
  - `go test ./internal/network -count=1`
  - `go test ./internal/daemon -count=1`
  - `go test -tags integration ./internal/session -run 'TestManagerIntegrationCapabilityAwareJoin' -count=1`
  - `go test -tags integration ./internal/daemon -run 'TestBootNetworkDeliversInboundMessagesThroughLateBoundLifecycle|TestBootNetworkShutdownTracksInterruptedInFlightDelivery' -count=1`
  - `go test ./internal/session -count=1 -cover` -> `81.2%`
  - `go test ./internal/network -count=1 -cover` -> `81.2%`
  - `make verify`
- Updated task workflow memory plus task tracking files.
- Created local commit `89636d9e` (`feat: wire capability-aware network joins`).

Now:

- Task 02 implementation is complete. Tracking and memory files remain intentionally outside the code commit.

Next:

- Task 03 can use the stable `session.NetworkPeerJoin` ingress to project brief capabilities into peer cards and API/network discovery surfaces.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-19-MEMORY-capability-join.md`
- `.compozy/tasks/agent-capabilities/_techspec.md`
- `.compozy/tasks/agent-capabilities/_tasks.md`
- `.compozy/tasks/agent-capabilities/task_01.md`
- `.compozy/tasks/agent-capabilities/task_02.md`
- `.compozy/tasks/agent-capabilities/memory/MEMORY.md`
- `.compozy/tasks/agent-capabilities/memory/task_02.md`
- `internal/session/interfaces.go`
- `internal/session/network_peer.go`
- `internal/session/manager_helpers.go`
- `internal/session/manager_start.go`
- `internal/session/manager_test.go`
- `internal/session/manager_hooks_test.go`
- `internal/session/manager_integration_test.go`
- `internal/network/manager.go`
- `internal/network/manager_test.go`
- `internal/daemon/daemon_test.go`
- `internal/daemon/daemon_integration_test.go`
- `.compozy/tasks/agent-capabilities/memory/MEMORY.md`
- `.compozy/tasks/agent-capabilities/memory/task_02.md`
- `.compozy/tasks/agent-capabilities/task_02.md`
- `.compozy/tasks/agent-capabilities/_tasks.md`
- `git status --short`
- `rg -n "JoinChannel|prepareJoinLocalPeer|DefaultPeerCard|Capabilities"`
