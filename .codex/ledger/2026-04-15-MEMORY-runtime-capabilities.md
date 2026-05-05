Goal (incl. success criteria):

- Perform a deep local research pass on AGH Runtime features, capabilities, surfaces, and differentiators, excluding the AGH Network Protocol.
- Produce `.compozy/tasks/site/analysis/analysis_runtime_capabilities.md` with the requested sections and evidence.

Constraints/Assumptions:

- Do not touch other workers' files.
- No web browsing.
- Prefer primary local sources: README, docs, cmd/agh, internal, web routes, and relevant local reference docs.
- AGH Network Protocol is out of scope for this subtask.

Key decisions:

- Use repo source, web routes, and reference-project docs to infer runtime product shape and docs taxonomy.
- Keep the analysis centered on the runtime/control-plane product, not the protocol work.

State:

- in_progress

Done:

- Read the current site-docs ledger and the workspace instructions.
- Gathered evidence from README, CLI, API spec, daemon/session/memory/skills/workspace code, and runtime-related web routes.
- Sampled `.resources/*` docs patterns from OpenClaw, Hermes, OpenCode, GoClaw, and ACPX.

Now:

- Write the runtime capability analysis markdown file.

Next:

- Report the changed file path and summarize the runtime conclusions.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether the site will canonically use `Memory` or `Knowledge` for the runtime docs term.
- UNCONFIRMED: how much of hooks/tasks/extensions should be exposed in the first homepage pass versus deeper docs.

Working set (files/ids/commands):

- `.compozy/tasks/site/analysis/analysis_runtime_capabilities.md`
- `.codex/ledger/2026-04-15-MEMORY-runtime-capabilities.md`
- `README.md`
- `internal/cli/root.go`
- `internal/api/spec/spec.go`
- `internal/session/manager_lifecycle.go`
- `internal/session/transcript.go`
- `internal/memory/consolidation/runtime.go`
- `internal/daemon/boot.go`
- `internal/daemon/daemon.go`
- `internal/skills/registry.go`
- `internal/skills/catalog.go`
- `internal/cli/skill_commands.go`
- `internal/cli/workspace.go`
- `internal/cli/observe.go`
- `web/src/routes/_app/session.$id.tsx`
- `web/src/routes/_app/knowledge.tsx`
- `web/src/routes/_app/skills.tsx`
- `web/src/routes/_app/automation.tsx`
- `web/src/routes/_app/bridges.tsx`
- `web/src/routes/_app/network.tsx`
- `.resources/openclaw/docs/index.md`
- `.resources/hermes/website/docs/index.md`
- `.resources/opencode/packages/docs/index.mdx`
- `.resources/goclaw/docs/00-architecture-overview.md`
- `.resources/acpx/conformance/README.md`
