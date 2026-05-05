# Goal (incl. success criteria):

- Produce a decision-complete hard-cut plan to rename the external messaging subsystem from `channel` to `bridge`, and the AGH network namespace concept from `space` to `channel`.
- Success means the plan covers code, API, CLI, config, storage, extension protocol, docs/specs/RFCs, tests, and sequencing with no compatibility aliases or leftover ambiguous terminology.

# Constraints/Assumptions:

- User explicitly requested `architectural-analysis` and `no-workarounds`.
- Greenfield alpha posture: no backward-compatibility shims, no dual fields, no legacy-preserving aliases.
- User confirmed `hard cut`, including specs and RFCs.
- Accepted plan persisted to `.codex/plans/2026-04-13-network-rename-hard-cut.md`.

# Key decisions:

- Resolve the terminology collision at the root: free `channel` for AGH Network by renaming the existing external adapter subsystem to `bridge`.
- Apply the rename in two ordered passes: `channels -> bridges` first, then `space -> channel` in the network/session/config/API surfaces.
- Keep the network package name `internal/network`; rename its namespace concept and payload fields to `channel`.
- Rename public extension capability/method namespaces from `channel.*` / `channels/*` to `bridge.*` / `bridges/*`.
- Rename session/config/storage/public payload field names from `space` to `channel`; use explicit names like `NetworkChannel` outside `internal/network` where bare `Channel` would be ambiguous.
- Rename storage tables/columns directly to final names; do not add migration/compat code for old alpha state.

# State:

- completed

# Done:

- Read relevant skill instructions and workspace rules.
- Scanned existing ledgers for related network/channel-adapter work.
- Mapped current blast radius across `internal/channels`, `internal/network`, session startup, config validation, storage, API, CLI, extension protocol, docs, and bundled skills.
- Confirmed web app does not currently consume the network/channel surfaces directly, but API spec/codegen references the channel subsystem.
- Asked the one open tradeoff question; user chose `hard cut` and explicitly wants specs/RFCs updated too.
- Persisted the accepted execution plan under `.codex/plans/2026-04-13-network-rename-hard-cut.md`.
- Completed the first hard-cut pass: `internal/channels -> internal/bridges`, including API/CLI/extension/store/SDK/generated contract surfaces.
- Verified the bridge rename compiles end-to-end with `go test ./...`.
- Completed the second hard-cut pass: AGH Network `space -> channel` across network/session/config/API/store/docs/specs/RFCs.
- Regenerated derived artifacts and passed the final verification gates: `make web-lint`, `make web-typecheck`, and `make verify`.

# Now:

- Task complete.

# Next:

- None.

# Open questions (UNCONFIRMED if needed):

- None. The remaining choices are locked by the hard-cut recommendation and repo architecture.

# Working set (files/ids/commands):

- `internal/channels/`
- `internal/bridges/`
- `internal/network/`
- `internal/session/`
- `internal/api/{contract,core,httpapi,udsapi,spec}`
- `internal/store/{types.go,globaldb/}`
- `internal/extension/{protocol,contract,host_api_channels.go}`
- `internal/cli/{channel.go,network.go,session.go,client.go}`
- `docs/rfcs/003_agh-network-v0.md`
- `docs/rfcs/004_agh-network-v1.md`
- `.compozy/tasks/channel-adapters/`
