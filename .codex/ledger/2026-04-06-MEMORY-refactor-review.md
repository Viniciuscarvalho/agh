Goal (incl. success criteria):

- Review the proposed AGH package refactor and give direct architectural guidance on the proposed boundaries, nesting, and extractions.
- Success means answering the seven review questions with concrete recommendations grounded in the current codebase structure, not generic package advice.

Constraints/Assumptions:

- Scope is analysis only unless a supporting artifact is required by workspace policy.
- Must follow root `AGENTS.md` and `CLAUDE.md`, including ledger maintenance and non-destructive git rules.
- User wants concise, candid architectural judgment and explicit challenge to weak assumptions.

Key decisions:

- Use the `architectural-analysis` skill because this is an architecture audit.
- Ground the review in the current repository state, especially `internal/apicore`, `internal/apisupport`, `internal/cli`, `internal/fileutil`, `internal/filesnap`, `internal/session/transcript.go`, and the duplicated frontmatter parsers in `config`, `skills`, and `memory`.
- Focus on package-boundary quality: ownership, dependency direction, cohesion, and likely long-term churn.

State:

- Complete; review synthesized and ready for handoff.

Done:

- Read root instructions and `CLAUDE.md`.
- Read the `architectural-analysis` skill instructions.
- Scanned related peer ledgers for file splits, domain deduplication, daemon dream work, and prior refactor spec review.
- Inspected the current `internal/` package tree and package file counts.
- Verified current usages of `apicore`, `apisupport`, `fileutil`, `filesnap`, and `procutil`.
- Inspected current frontmatter parsing code in `internal/config`, `internal/skills`, and `internal/memory`.
- Inspected `internal/session/transcript.go` and current API payload duplication between `internal/apicore` and `internal/cli`.
- Final review conclusions:
- `api/` grouping is directionally right because `httpapi` and `udsapi` are thin shells around `apicore`, but names like `api/http` are risky in Go; keep transport packages explicitly named and keep the shared contract under the same subtree.
- `fileutil` should not be absorbed into `store`; it is a generic cross-domain filesystem helper currently used by both `store` and `memory`.
- A shared API contract package is justified now because `internal/apicore/payloads.go` and `internal/cli/client.go` duplicate the wire DTOs heavily; the main question is location/naming, not whether the seam exists.
- `frontmatter` is reasonable only if it owns split/scan mechanics and lets each caller keep its own decode/validation policy; forcing one universal parser over the current differing YAML behavior would be a mistake.
- `transcript` is a real seam if it becomes a pure replay/read-model package over persisted events rather than a thin wrapper around `session.Manager`.
- Missing concerns worth flagging: omitted `filesnap`, inconsistent treatment of tiny utility packages (`fileutil` vs `procutil`), and the risk of moving `ComposedAssembler` into `session` without a stronger reason than “it uses session interfaces”.

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether the proposed `apitypes/` is intended for server-only reuse first or for future SDK extraction; the answer affects whether it should live under `internal/api/` or outside that subtree.

Working set (files/ids/commands):

- Files: `CLAUDE.md`, `internal/session/transcript.go`, `internal/fileutil/atomic.go`, `internal/store/meta.go`, `internal/config/agent.go`, `internal/skills/loader.go`, `internal/memory/document.go`, `internal/memory/store.go`, `internal/apicore/payloads.go`, `internal/apicore/workspaces.go`, `internal/apisupport/support.go`, `internal/cli/client.go`, related ledgers under `.codex/ledger/`.
- Commands: `find internal -maxdepth 2 -type d | sort`, `rg` dependency scans, `sed` file reads.
