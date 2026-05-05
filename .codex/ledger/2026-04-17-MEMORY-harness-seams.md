## Goal (incl. success criteria):

- Identify the best current implementation seams for a v1 internal-only harness spec covering runtime-inferred profiles, startup prompt layering, turn-time augmenters, and background run completion reentry via synthetic events.
- Success means a concise, evidence-based report with exact file references and suggested component boundaries.

## Constraints/Assumptions:

- Do not use destructive git commands.
- Focus on current code in `internal/session`, `internal/daemon`, and `internal/tasks/automation/network` if present.
- `internal/tasks/automation/network` does not exist in this checkout; treat that area as absent/renamed unless evidence appears.
- Report should stay concise and avoid speculation where the code already shows an established seam.

## Key decisions:

- Use the session manager as the primary seam for turn-time behavior.
- Use daemon boot/composition for startup prompt layering and runtime wiring.
- Use automation trigger/session observer boundaries for synthetic reentry after background completion.

## State:

- Evidence gathered from session manager, daemon boot/runtime, environment reconciliation, automation trigger engine, and network delivery coordinator.
- Analysis complete; ready to report.

## Done:

- Read the relevant session and daemon files.
- Verified startup prompt composition is already split between `daemon` and `session`.
- Verified network delivery reentry already exists through `deliveryCoordinator.trigger()` and `onTurnEnd()`.
- Verified automation has explicit synthetic session-observer entry points for session-created/stopped and hook-completion events.
- Captured exact line references for the final report.

## Now:

- Finalize the concise seam report.

## Next:

- None.

## Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether the intended `internal/tasks/automation/network` path was renamed to `internal/network` or `internal/automation` in this branch.

## Working set (files/ids/commands):

- `internal/session/interfaces.go`
- `internal/session/manager.go`
- `internal/session/manager_start.go`
- `internal/session/manager_helpers.go`
- `internal/session/manager_prompt.go`
- `internal/session/manager_hooks.go`
- `internal/session/environment.go`
- `internal/session/manager_lifecycle.go`
- `internal/daemon/boot.go`
- `internal/daemon/composed_assembler.go`
- `internal/daemon/environment_reconcile.go`
- `internal/daemon/task_runtime.go`
- `internal/daemon/hooks_bridge.go`
- `internal/automation/trigger.go`
- `internal/automation/dispatch.go`
- `internal/network/delivery.go`
