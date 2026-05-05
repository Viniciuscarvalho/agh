# Goal (incl. success criteria):

- Answer from local repo files how `web/` renders and queries network channels today.
- Determine whether the UI/data model contains any concept of thread, topic grouping, reply nesting, or intra-channel filtering.
- Explain what an operator would see if multiple agents discuss unrelated topics in the same channel, with exact file references.

# Constraints/Assumptions:

- Read-only exploration of local repository files only.
- Do not modify product code.
- Need concrete evidence from `web/`, `internal/network`, and local specs/RFCs if present.

# Key decisions:

- Treat this as an architecture/state audit.
- Keep repo exploration split into web query/render path, backend network model, and spec/RFC vocabulary.

# State:

- complete

# Done:

- Read root instructions plus `internal/CLAUDE.md`, `web/CLAUDE.md`, `internal/AGENTS.md`, and `web/AGENTS.md`.
- Read related cross-agent ledger `.codex/ledger/2026-05-04-MEMORY-network-threads.md`.
- Traced the `/_app/network` route, `useNetworkPage`, network query hooks/adapters, and the network workspace shell in `web/`.
- Traced backend network DTOs and message query handling in `internal/api/contract`, `internal/api/core/network.go`, and `internal/api/core/network_details.go`.
- Read local RFC/docs evidence showing `interaction_id` as the protocol correlation primitive, not a first-class thread/topic tree.

# Now:

- Final answer only.

# Next:

- None.

# Open questions (UNCONFIRMED if needed):

- None.

# Working set (files/ids/commands):

- `web/CLAUDE.md`
- `internal/CLAUDE.md`
- `web/AGENTS.md`
- `internal/AGENTS.md`
- `.codex/ledger/2026-05-04-MEMORY-network-threads.md`
- `rg -n "channel|thread|topic|reply|filter" web/src internal docs .compozy`
- `web/src/routes/_app/network.tsx`
- `web/src/hooks/routes/use-network-page.ts`
- `web/src/systems/network/components/network-workspace-shell.tsx`
- `web/src/systems/network/lib/network-formatters.ts`
- `web/src/systems/network/lib/query-options.ts`
- `web/src/systems/network/adapters/network-api.ts`
- `web/src/systems/network/types.ts`
- `internal/api/contract/contract.go`
- `internal/api/contract/responses.go`
- `internal/api/core/network.go`
- `internal/api/core/network_details.go`
- `internal/store/types.go`
- `internal/network/envelope.go`
- `docs/rfcs/003_agh-network-v0.md`
- `packages/site/content/runtime/core/network/protocol.mdx`
