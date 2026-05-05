# Goal (incl. success criteria):

- Decompose `.compozy/tasks/agh-network/_techspec.md` into independently implementable task files for the `agh-network` feature.
- Present a complete task breakdown for user approval before generating `_tasks.md` and `task_N.md` files.
- After approval, generate enriched task files and pass `compozy validate-tasks --name agh-network`.

# Constraints/Assumptions:

- Must use the `cy-create-tasks` skill workflow.
- `.compozy/config.toml` is currently missing, so task `type` values fall back to built-in defaults unless a different config file is discovered.
- `_prd.md` is absent in `.compozy/tasks/agh-network/`; task derivation will use `_techspec.md` plus ADRs and codebase exploration.
- Must present the task breakdown and wait for user approval before writing task files.

# Key decisions:

- Use `_techspec.md` as the primary source of truth and ADRs as decision context.
- Explore the current runtime codebase to map realistic task boundaries and file ownership before proposing tasks.
- Prefer smaller dependency-ordered tasks over broad implementation epics.
- Split the work into 10 tasks so protocol, transport, session wiring, delivery, daemon integration, API/CLI, bundled skill content, and final hardening remain independently implementable.

# State:

- completed

# Done:

- Read `cy-create-tasks` skill instructions.
- Scanned available ledgers and noted the prior `agh-network` spec-review ledgers.
- Confirmed feature directory exists and currently contains `_techspec.md` plus ADRs.
- Confirmed `.compozy/config.toml` is not present at the expected path.
- Re-read the prior `agh-network` ledgers that finalized the techspec corrections.
- Mapped current code ownership for likely implementation surfaces:
  - `internal/session`: `CreateOpts`, session runtime state, start/resume flow, prompt path, hook dispatch
  - `internal/acp`: inbound file/terminal handlers and permission gates
  - `internal/daemon`: boot sequencing, runtime deps, daemon info, hook bridge
  - `internal/api/contract`, `internal/api/core`, `internal/api/udsapi`, `internal/cli`: session DTOs and UDS/CLI transport surface
  - `internal/store` / `internal/store/globaldb`: session metadata/index persistence and likely audit storage
  - `internal/observe`: notifier-backed observability surface
- Confirmed there is no `internal/network/` package yet, so protocol/transport/router/delivery can start as a new isolated package family.
- Confirmed existing integration harnesses already exist in `internal/session/manager_integration_test.go`, `internal/api/udsapi/udsapi_integration_test.go`, `internal/cli/cli_integration_test.go`, and `internal/daemon/daemon_integration_test.go`.
- Presented the 10-task breakdown and received user approval to proceed.
- Generated `.compozy/tasks/agh-network/_tasks.md` and `task_01.md` through `task_10.md`.
- Adjusted the last slice into an operational hardening task so the plan remains compliant with the rule against tests-only tasks.
- Ran `compozy validate-tasks --name agh-network` successfully (`all tasks valid (10 scanned)`).
- Ran `make verify`; the workspace-level gate still fails, but now because of pre-existing `internal/extension` race-detection test failures rather than task-file formatting or parser issues.

# Now:

- Ready to hand off the generated task files and validation results.

# Next:

- If requested, refine task wording, rebalance dependencies, or start executing `task_01`.

# Open questions (UNCONFIRMED if needed):

- None.

# Working set (files/ids/commands):

- `.agents/skills/cy-create-tasks/SKILL.md`
- `.compozy/tasks/agh-network/_techspec.md`
- `.compozy/tasks/agh-network/adrs/adr-001.md`
- `.compozy/tasks/agh-network/adrs/adr-002.md`
- `.compozy/tasks/agh-network/adrs/adr-003.md`
- `.compozy/tasks/agh-network/adrs/adr-004.md`
- `.compozy/tasks/agh-network/adrs/adr-005.md`
- `.codex/ledger/2026-04-10-MEMORY-agh-network-techspec-review.md`
- `.codex/ledger/2026-04-10-MEMORY-agh-network-prior-issues.md`
- `internal/session/manager.go`
- `internal/session/manager_start.go`
- `internal/session/manager_prompt.go`
- `internal/session/session.go`
- `internal/session/interfaces.go`
- `internal/acp/handlers.go`
- `internal/api/contract/contract.go`
- `internal/api/core/handlers.go`
- `internal/api/udsapi/routes.go`
- `internal/api/udsapi/sessions.go`
- `internal/cli/client.go`
- `internal/cli/session.go`
- `internal/daemon/boot.go`
- `internal/daemon/daemon.go`
- `internal/daemon/info.go`
- `internal/daemon/hooks_bridge.go`
- `internal/observe/observer.go`
- `internal/store/types.go`
- `.compozy/tasks/agh-network/_tasks.md`
- `.compozy/tasks/agh-network/task_01.md`
- `.compozy/tasks/agh-network/task_02.md`
- `.compozy/tasks/agh-network/task_03.md`
- `.compozy/tasks/agh-network/task_04.md`
- `.compozy/tasks/agh-network/task_05.md`
- `.compozy/tasks/agh-network/task_06.md`
- `.compozy/tasks/agh-network/task_07.md`
- `.compozy/tasks/agh-network/task_08.md`
- `.compozy/tasks/agh-network/task_09.md`
- `.compozy/tasks/agh-network/task_10.md`
- `compozy validate-tasks --name agh-network`
- `make verify`
