Goal (incl. success criteria):

- Fix the three reviewed network regressions with root-cause changes only.
- Success means:
- inbound remote channel messages retain remote authorship in `/api/network/channels/:channel/messages`
- rolled-back/stopped sessions do not materialize ghost channels in list/detail responses
- the create-channel dialog only offers agents allowed by the active workspace
- targeted regressions are covered by tests and full verification passes

Constraints/Assumptions:

- Follow root `AGENTS.md`, `CLAUDE.md`, `web/AGENTS.md`, and `web/CLAUDE.md`.
- User explicitly required `no-workarounds`.
- Do not touch unrelated dirty worktree changes.
- Use root-cause fixes, not UI-only guards or error-swallowing.

Key decisions:

- Treat `NetworkMessageEntry.SessionID` as the receiving local session for inbound traffic, not as authorship.
- Determine message locality/authorship from the persisted peer id / runtime peer map, and only expose a session link when the message author is local.
- Filter channel summaries/details against active/non-stopped sessions so rollback-created stopped sessions do not count as live channel membership.
- Source dialog agent options from the active workspace detail payload because backend validation is workspace-scoped.

State:

- Completed.

Done:

- Loaded required skills: `systematic-debugging`, `no-workarounds`, `golang-pro`, `testing-anti-patterns`, `app-renderer-systems`, `react`, `tanstack-query-best-practices`, `vitest`, `cy-final-verify`.
- Read existing 2026-04-13 network/current-review ledgers for context.
- Traced the three regressions to concrete code paths in `internal/api/core/network_details.go` and `web/src/routes/_app/network.tsx`.
- Confirmed backend already exposes workspace detail payloads with resolved agents.
- Fixed channel timeline authorship to derive locality from persisted audit direction instead of treating every non-empty `session_id` as local authorship.
- Filtered stopped sessions out of channel list/detail existence so rollback-created sessions no longer leave ghost channels behind.
- Added workspace-detail fetching in the web workspace system and switched the network route to the active workspace's resolved agents.
- Added/updated regression tests for stopped-session channel visibility, remote message authorship, workspace detail fetching, workspace hooks, and the network route dialog options.
- Verified focused regressions with:
- `go test ./internal/api/core -run 'TestBaseHandlersNetworkChannelEndpointsIgnoreStoppedSessions|TestBaseHandlersNetworkChannelMessagesPreserveRemoteAuthors'`
- `bun x vitest run src/routes/_app/-network.test.tsx src/systems/workspace/adapters/workspace-api.test.ts src/systems/workspace/hooks/use-workspaces.test.tsx`
- Verified the full repository with `make verify`.

Now:

- None.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-13-MEMORY-network-review-fix.md`
- `internal/api/core/network_details.go`
- `internal/api/core/network_test.go`
- `internal/network/audit.go`
- `internal/network/audit_test.go`
- `web/src/routes/_app/network.tsx`
- `web/src/routes/_app/-network.test.tsx`
- `web/src/systems/workspace/**`
- `git status --short`
- `make test`
- `make web-test`
- `make verify`
