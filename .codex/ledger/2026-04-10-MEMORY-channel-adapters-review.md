Goal (incl. success criteria):

- Review and then update `.compozy/tasks/channel-adapters/_techspec.md` against the original prompt, internal extension/automation architecture, and competitor knowledge bases.
- Success means the approved hybrid design is saved in the TechSpec, superseding ADRs are recorded, and the workspace verification gate passes.

Constraints/Assumptions:

- Review-first process; spec edits only after explicit user approval.
- Must use `qmd` for markdown knowledge-base search because the user requested it.
- User explicitly allowed subagents to explore harness/knowledge-base context.
- Must respect existing AGH architecture constraints from root `AGENTS.md` and `CLAUDE.md`.
- User prefers that recommended options always be labeled with `(recomendado)`.

Key decisions:

- Treat this as an architecture/design review, not a rewrite pass.
- Validate claims in the techspec against `.compozy/tasks/ext-architecture/*`, `.compozy/tasks/automation/_techspec.md`, and relevant memory ledgers.
- Use explorer subagents to summarize competitor channel-adapter patterns in parallel.
- In brainstorming, the user selected direction `A`: keep v1 as real-time conversational channels, but fix protocol, routing, backpressure, and credentials rather than narrowing the scope.
- Recommended architecture direction is now hybrid: core owns the channel substrate/governance, while platform adapters remain extensions/subprocesses.
- User signaled agreement that v1 should include an explicit core channel registry rather than substrate-only runtime wiring.
- User selected registry option `B`: the core registry also owns the canonical `routing key -> session` mapping, making conversational routing a daemon responsibility rather than an extension-local concern.
- User selected scope option `2`: channel instances and routing keys support both `global` and `workspace` scope.
- User selected credential option `B`: extensions do not get arbitrary vault reads; the daemon binds only the credentials explicitly attached to a channel instance.
- User selected the first streaming option (answered `A` to the latest multiple-choice): real-time outbound delivery should use a new extension service negotiated in `initialize`, with explicit ordering/backpressure/cleanup semantics.
- User selected routing option `2`: the core owns a policy-driven routing key model where a fixed base (`scope`, `workspace_id?`, `channel_instance_id`) is extended by per-instance policy dimensions such as `peer`, `thread`, and `group`.
- User selected delivery-target option `B`: automation and manual sends use a typed canonical `delivery_target` object rather than free-form fields or compact strings.

State:

- Completed.

Done:

- Read root instructions and skill files for `qmd` and `architectural-analysis`.
- Scanned `.codex/ledger/` for related sessions and opened relevant extension/automation ledgers.
- Opened the target techspec and started extracting architecture decisions.
- Queried QMD collections `openclaw`, `openfang`, `goclaw`, `hermes`, `ai-harness`, and `agh-compozy` for channel-adapter, automation, credential, and harness patterns.
- Cross-checked the target spec against current code in `internal/extension`, `internal/session`, `internal/observe`, `internal/hooks`, and `internal/daemon`.
- Spawned explorer subagents; received usable summaries for OpenClaw/OpenFang and AI-harness protocol patterns.
- Identified five review findings: protocol mismatch for `channel/on_event`, wrong event seam/subscription design, under-specified routing key, incomplete automation delivery model, and overly broad/operationally weak vault model.
- Brainstorming Section 1 approved: hybrid architecture with a small `internal/channels/` substrate in the core, while platform adapters remain extensions/subprocesses.
- Brainstorming Section 2 approved: separate persisted models for `channel_instances`, `channel_secret_bindings`, and `channel_routes`, with core-owned routing and lifecycle.
- Brainstorming completed with approved decisions for hybrid substrate, core-owned registry/routing, scoped instances, bound secret injection, negotiated delivery stream, policy-driven routing keys, and typed delivery targets.
- Created ADR-005 through ADR-008 under `.compozy/tasks/channel-adapters/adrs/`.
- Marked ADR-001 through ADR-004 as superseded by the new accepted ADRs.
- Saved the approved TechSpec to `.compozy/tasks/channel-adapters/_techspec.md`.
- Fixed relative links in channel-adapter ADR references.
- Ran `make verify` successfully after the documentation changes.

Now:

- TechSpec and ADR set are saved and verified. No further execution in this session.

Next:

- If requested, decompose this TechSpec with `cy-create-tasks`.

Open questions (UNCONFIRMED if needed):

- None for this session.

Working set (files/ids/commands):

- `.compozy/tasks/channel-adapters/_techspec.md`
- `.compozy/tasks/channel-adapters/adrs/adr-001.md`
- `.compozy/tasks/channel-adapters/adrs/adr-003.md`
- `.compozy/tasks/channel-adapters/adrs/adr-004.md`
- `.compozy/tasks/channel-adapters/adrs/adr-005.md`
- `.compozy/tasks/channel-adapters/adrs/adr-006.md`
- `.compozy/tasks/channel-adapters/adrs/adr-007.md`
- `.compozy/tasks/channel-adapters/adrs/adr-008.md`
- `.compozy/tasks/ext-architecture/_techspec.md`
- `.compozy/tasks/ext-architecture/_protocol.md`
- `.compozy/tasks/automation/_techspec.md`
- `.compozy/tasks/extensability/analysis.md`
- `docs/ideas/market-pair/gap-analysis.md`
- `.codex/ledger/2026-04-10-MEMORY-ext-architecture.md`
- `.codex/ledger/2026-04-10-MEMORY-ext-architecture-reviews.md`
- `.codex/ledger/2026-04-10-MEMORY-automation-techspec-review.md`
- `internal/extension/host_api.go`
- `internal/extension/protocol/host_api.go`
- `internal/extension/manager.go`
- `internal/extension/capability.go`
- `internal/session/interfaces.go`
- `internal/session/manager_prompt.go`
- `internal/observe/observer.go`
- `internal/hooks/events.go`
- Commands/tools: `sed`, `nl -ba`, `rg`, `qmd`, explorer subagents, `make verify`
