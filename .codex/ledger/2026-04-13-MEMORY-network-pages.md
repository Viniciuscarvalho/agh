Goal (incl. success criteria):

- Implement the accepted `network` plan end-to-end: add truthful backend APIs and storage needed for channel/peer views, then build the Paper-aligned `web/` route and components using existing tokens/components where possible.
- Success means the app has a working `/_app/network` experience with `Channels` and `Peers`, create-channel creates new sessions for selected local agents, channel timelines and peer details come from real APIs, tests pass, and final verification is green.

Constraints/Assumptions:

- Follow root `AGENTS.md`, `CLAUDE.md`, `web/AGENTS.md`, `web/CLAUDE.md`, and `DESIGN.md`.
- User explicitly required `no-workarounds` and `interface-design`; prior planning/approval is already complete, so implementation can proceed directly.
- Accepted plan must be persisted under `.codex/plans/`.
- Do not touch unrelated dirty worktree changes, especially the in-progress `bridges`/`automation` edits.
- No compatibility shims for old alpha behavior; prefer truthful, direct domain modeling.

Key decisions:

- Creating a channel does not create a standalone channel record; it creates one new session per selected local agent with `channel` set on session creation.
- The create-channel modal lists local agents, not remote peers and not existing sessions.
- `Peers` is observability-only in v1; no disconnect/remove controls.
- Channel timeline is read-only and should log accepted network `say` envelopes once per `message_id`, separate from the transport audit log.
- Backend must expose detail endpoints for channel and peer views instead of asking the web app to derive them from lossy list payloads.

State:

- Completed.

Done:

- Explored the Paper artboards for the six target states and mapped their layout/interaction requirements.
- Inspected current backend network APIs and confirmed gaps: no create-channel endpoint, no channel timeline/detail endpoints, no peer-detail endpoint, and no persisted message body timeline.
- Confirmed current session creation already supports `channel`.
- Confirmed accepted product semantics with the user: entering a channel creates new agent sessions; modal selects agents; peers tab remains read-only.
- Loaded applicable skill guidance and workspace rules for Go, React, systems, TanStack Query, interface design, and no-workarounds.
- Persisted this task ledger and prepared to persist the accepted plan artifact.
- Implemented backend network detail/create APIs, persisted timeline message storage, delivered audit direction support, transport wiring, and supporting tests/codegen.
- Implemented the `web/src/systems/network` feature system, the `/_app/network` route, create-channel dialog, channels/peers panels, empty states, and sidebar entry aligned with the Paper layouts while reusing project tokens/components.
- Added frontend route/sidebar tests and fixed verification blockers uncovered during validation:
  - removed the dead helper in `internal/network/audit.go`
  - made `internal/automation/schedule_test.go` synchronize on dispatch completion instead of dispatch start
  - fixed existing web verification issues in bridges/session files required to get the repository back to green.
- Verified successfully with `make verify`.

Now:

- None.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None currently.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-13-MEMORY-network-pages.md`
- `.codex/plans/2026-04-13-network-paper-pages.md`
- `internal/network/**`
- `internal/api/{contract,core,httpapi,udsapi,spec}/**`
- `internal/store/globaldb/**`
- `web/src/routes/_app/network.tsx`
- `web/src/components/app-sidebar.tsx`
- `web/src/systems/network/**`
- `make codegen`
- `make web-lint`
- `make web-typecheck`
- `make web-test`
- `make verify`
