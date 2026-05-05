Goal (incl. success criteria):

- Perform a read-only codebase review for Cluster B agent-local spec completeness and report only hidden gaps not already captured, focused on runtime call sites still depending on `ForWorkspace` or global-only settings paths, global-vs-workspace agent resolution/storage implications, and public surface inconsistencies against the current draft.

Constraints/Assumptions:

- Read-only review; do not propose or apply code patches.
- Focus on net-new gaps only; avoid repeating already-captured findings.
- Must include concise `file:line` references and recommended spec closures.
- Avoid destructive git commands.

Key decisions:

- Review will center on `internal/config`, `internal/settings`, `internal/workspace`, `internal/api/*`, `internal/cli`, and relevant `web/` consumers.
- Prior workspace/config ledgers are reference material only; this ledger is the canonical session state.

State:

- In progress

Done:

- Read root instructions from user context.
- Loaded `internal/CLAUDE.md`, `internal/AGENTS.md`, and `web/CLAUDE.md`.
- Loaded the `architectural-analysis` skill instructions.
- Scanned existing ledgers and read related workspace/config ledgers for prior context.

Now:

- Trace runtime settings resolution and agent/workspace persistence call sites.

Next:

- Inspect public HTTP/UDS/CLI/web surfaces for parity gaps against the current Cluster B draft.
- Summarize only net-new findings with recommended spec closures.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: Which exact gaps are already captured in the current Cluster B draft; review will infer “hidden” from code paths that appear unaddressed by the draft focus.

Working set (files/ids/commands):

- Files: `internal/config`, `internal/settings`, `internal/workspace`, `internal/api`, `internal/cli`, `web/src`, `.codex/ledger/2026-05-04-MEMORY-cluster-b-spec-review.md`
- Commands: `rg -n 'ForWorkspace|ForAgent|workspace_id|workspaceId|default_agent|agent-local|settings' ...`, targeted `sed -n`, `nl -ba`
