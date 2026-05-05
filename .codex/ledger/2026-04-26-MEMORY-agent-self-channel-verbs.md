Goal (incl. success criteria):

- Implement Task 06: agent-facing `agh me`, `agh me context`, and `agh ch` verbs over UDS/CLI using Task 05 caller identity and Task 04 situation context.
- Success requires self/context endpoints, channel list/recv/send/reply endpoints and CLI commands, coordination metadata validation, raw `claim_token` rejection, required tests/coverage, `make verify`, tracking/memory updates, and one local commit after clean verification.

Constraints/Assumptions:

- Must not run destructive git commands (`restore`, `checkout`, `reset`, `clean`, `rm`) without explicit user permission.
- Must read and keep workflow memory current: `.compozy/tasks/autonomous/memory/MEMORY.md` and `task_06.md`.
- Must preserve explicit operator `agh network ...` commands; agent commands infer identity from validated caller context only.
- Must keep network evolution local-first and minimal; no cross-daemon swarm/protocol expansion.
- Raw `claim_token` values must never be accepted into channel metadata/payloads or exposed through channel read models.

Key decisions:

- Reuse existing contract DTOs from Task 02, `situation.Service.ContextForSession` from Task 04, and Task 05 identity helpers.
- Keep `agh network ...` operator commands explicit and unchanged; add separate agent-facing `me` and `ch` command namespaces.
- Resolve `agh ch reply --to-message` from the caller's current inbox first because current persisted network timeline rows do not retain envelope extension metadata needed to reconstruct coordination metadata after delivery.
- Back `agh ch recv --wait` with delivery-coordinator waiters woken by accepted inbound messages; no sleeps or shell polling.
- Reject explicit non-`reply` metadata on `agh ch reply`; zero metadata is allowed so the server can inherit source-message coordination metadata.

State:

- Required workflow memory, task file, `_techspec.md`, `_tasks.md`, ADR-002, ADR-007, ADR-010, ADR-012, root guidance, and relevant prior ledgers have been read.

Done:

- Loaded skills: `cy-workflow-memory`, `cy-execute-task`, `golang-pro`, `testing-anti-patterns`.
- Read shared workflow memory and current task memory before code edits.
- Captured pre-change signal: `rg` found no wired `/agent/context` or `/agent/channels` UDS routes and no CLI `me`/`ch` commands.
- Updated task-local workflow memory with objective, baseline, and initial decisions.
- Implemented UDS/core handlers for agent context and channel list/recv/send/reply.
- Implemented CLI client methods and commands for `agh me`, `agh me context`, `agh ch list`, `agh ch recv`, `agh ch send`, and `agh ch reply`.
- Implemented network `WaitInbox` support and tests for notification-based receive wakeup.
- Added CLI/client/core/UDS/network tests for identity, metadata, raw-token rejection, JSONL, reply-by-message, wait receive, and operator network regression coverage.
- Final `make verify` passed after lint corrections.
- Marked Task 06 tracking and workflow memory complete.
- Created local code commit `9cccc2f3 feat: add agent self and channel verbs`.
- Post-commit `make verify` passed with exit code 0.

Now:

- Prepare final response with verification evidence, warnings, commit hash, and dirty tracking-only artifacts.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Task docs: `.compozy/tasks/autonomous/task_06.md`, `.compozy/tasks/autonomous/_tasks.md`, `.compozy/tasks/autonomous/_techspec.md`.
- Workflow memory: `.compozy/tasks/autonomous/memory/MEMORY.md`, `.compozy/tasks/autonomous/memory/task_06.md`.
- Expected code surfaces: `internal/api/udsapi`, `internal/cli`, `internal/network`, `internal/api/contract`, `internal/api/core`, `internal/situation`, `internal/agentidentity`.
- Latest focused test: `go test ./internal/api/core ./internal/api/udsapi ./internal/cli ./internal/network ./internal/daemon`.
- Final gate: `make verify` exit 0 before commit and exit 0 again after commit.
- Commit: `9cccc2f3 feat: add agent self and channel verbs`.
