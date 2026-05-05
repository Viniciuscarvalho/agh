Goal (incl. success criteria):

- Implement task 03 for agent capabilities by projecting the normalized capability catalog into `peer_card.capabilities` and `peer_card.ext["agh.capabilities_brief"]`.
- Success requires: one centralized projection helper, no-catalog peers staying empty-but-valid, ext cloning preserved through network/API surfaces, focused unit/integration coverage, updated workflow memory/tracking, and clean verification.

Constraints/Assumptions:

- Must follow task docs under `.compozy/tasks/agent-capabilities`, especially `_techspec.md`, ADRs, and `task_02.md`.
- Must consume the task 02 join payload (`session.NetworkPeerCapability`) instead of rereading local capability files.
- `peer_card.capabilities` and `agh.capabilities_brief[*].id` must come from the same normalized order and never drift.
- No-catalog path must keep `PeerCard.Capabilities` non-nil and omit the brief ext key.
- Must not touch unrelated dirty worktree files.
- `make verify` is the blocking completion gate.

Key decisions:

- Centralize the brief projection in `internal/network` near peer-card construction/cloning instead of scattering ext-map writes across manager/router/API layers.
- Treat the approved task docs as the design baseline and implement the minimal projection surface from that spec.

State:

- completed

Done:

- Read workspace instructions, required skill docs, workflow memory, task docs, techspec, ADRs, and task 02 handoff context.
- Scanned relevant prior ledgers for agent-capabilities context.
- Identified the pre-change gap: task 02 passes capability IDs/summaries into `internal/network`, but local peer cards only set `Capabilities` and never emit `agh.capabilities_brief`.
- Extracted the implementation checklist and the pre-change signal proving task 03 is not complete yet.
- Added `internal/network/capability_brief.go` to project ordered capability IDs plus `agh.capabilities_brief` from the same join payload and applied it during local peer-card construction.
- Extended network tests to cover projection alignment, no-catalog omission, clone/normalize deep-copy behavior, router greet serialization, manager join projection, and integration regreet preservation.
- Extended API tests to assert brief metadata survives peer list/detail payloads and to recover `internal/api/core` package coverage to the 80% task threshold.
- Created the local code commit `b3f31b93` (`feat: project brief peer capabilities`).
- Verified with:
  - `go test ./internal/network -count=1`
  - `go test ./internal/api/core -count=1`
  - `go test -tags integration ./internal/network -run TestManagerJoinPublishesProjectedCapabilityBriefInInitialAndReconnectGreets -count=1`
  - `go test ./internal/network -count=1 -cover` -> `81.2%`
  - `go test ./internal/api/core -count=1 -cover` -> `80.0%`
  - `make verify`
  - post-commit `make verify`

Now:

- Report completion with verification evidence and note that task/memory tracking files remain intentionally unstaged.

Next:

- Task 04 can build explicit rich capability discovery on top of the now-stable brief projection/runtime peer-card shape.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-19-MEMORY-brief-capability-projection.md`
- `.codex/ledger/2026-04-19-MEMORY-capability-join.md`
- `.compozy/tasks/agent-capabilities/_techspec.md`
- `.compozy/tasks/agent-capabilities/_tasks.md`
- `.compozy/tasks/agent-capabilities/task_03.md`
- `.compozy/tasks/agent-capabilities/task_02.md`
- `.compozy/tasks/agent-capabilities/memory/MEMORY.md`
- `.compozy/tasks/agent-capabilities/memory/task_03.md`
- `internal/network/peer.go`
- `internal/network/manager.go`
- `internal/network/validate.go`
- `internal/network/router.go`
- `internal/network/peer_test.go`
- `internal/network/manager_test.go`
- `internal/network/router_test.go`
- `internal/network/router_integration_test.go`
- `internal/api/core/network.go`
- `internal/api/core/network_details.go`
- `internal/api/core/network_test.go`
- `b3f31b93`
- `git status --short`
- `rg -n "agh\\.capabilities_brief|Capabilities|prepareJoinLocalPeer|NetworkPeerPayloadFromInfo"`
