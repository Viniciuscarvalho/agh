## Goal (incl. success criteria):

- Resolve review round `003` batch issue `002` for `agent-capabilities`.
- Ensure `AgentDef.Validate()` persists normalized capability catalogs and add regression coverage.
- Finish with scoped issue file updated and repository verification evidence from `make verify`.

## Constraints/Assumptions:

- Scope is limited to `.compozy/tasks/agent-capabilities/reviews-003/issue_002.md` and code under `internal/config/agent.go`; test edits are allowed for validation.
- Do not touch other review issue files or run provider-specific resolution commands.
- No destructive git commands.

## Key decisions:

- Treat issue `002` as valid: `AgentDef.Validate()` discards the normalized capability catalog today.
- Keep `AgentDef.Validate()` as a value receiver and persist normalization by mutating the shared `Capabilities` pointer target in place.
- Add a direct regression test for `AgentDef.Validate()` normalization behavior.

## State:

- Completed.

## Done:

- Read required skills: `cy-fix-reviews`, `cy-final-verify`, `systematic-debugging`, `no-workarounds`, `golang-pro`, `testing-anti-patterns`.
- Read review round metadata and scoped issue file.
- Inspected `internal/config/agent.go`, `internal/config/capabilities.go`, and related tests.
- Updated `.compozy/tasks/agent-capabilities/reviews-003/issue_002.md` through triage and resolution.
- Patched `internal/config/agent.go` to persist normalized capabilities during validation.
- Added regression coverage in `internal/config/agent_capabilities_test.go`.
- Verified with `go test ./internal/config` and `make verify`.

## Now:

- None.

## Next:

- None.

## Open questions (UNCONFIRMED if needed):

- None.

## Working set (files/ids/commands):

- `.compozy/tasks/agent-capabilities/reviews-003/issue_002.md`
- `internal/config/agent.go`
- `internal/config/agent_capabilities_test.go`
- `make verify`
