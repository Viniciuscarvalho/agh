Goal (incl. success criteria):

- Complete `.compozy/tasks/unified-capabilities/task_05.md` by rewriting `docs/rfcs/003_agh-network-v0.md` and `docs/agents/capabilities.md` so the unified capability model is the only steady-state narrative.
- Success means: RFC 003 treats `capability` as the only authored/transferred artifact, the runtime guide documents current authoring layouts plus `version`/runtime-computed `digest`/`requirements`, discovery is described as brief in `greet` and rich in `whois`, one connected worked example exists, task tracking is updated only after clean verification, and `make verify` passes before any commit.

Constraints/Assumptions:

- Follow required skills: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`.
- Read-only awareness of other ledgers; do not modify them.
- Do not touch unrelated worktree changes in `.compozy/tasks/unified-capabilities/{_tasks.md,task_02.md,task_03.md,task_04.md}` unless task_05 completion requires the specific tracking updates.
- Keep docs aligned to implemented code in `internal/config`, `internal/session`, `internal/network`, and `internal/api`; no speculative protocol/runtime language.
- No destructive git commands.

Key decisions:

- Use ADR-001/002/003 plus task_04’s finalized discovery/API behavior as the canonical semantic source, then verify wording against current code.
- Keep the wire-level RFC focused on `PeerCard` IDs in `greet`, rich `whois` catalog in envelope `ext`, and transferable `kind:"capability"` payloads with canonical digest validation.
- Put the required end-to-end worked example in the runtime guide so it can connect local authoring to discovery and transfer; also rewrite the RFC worked example to remove the obsolete `recipe` narrative.

State:

- Completed.

Done:

- Read workspace instructions from `AGENTS.md` and `CLAUDE.md`.
- Read required skill docs for `cy-workflow-memory`, `cy-execute-task`, and `cy-final-verify`.
- Read workflow memory files:
  - `.compozy/tasks/unified-capabilities/memory/MEMORY.md`
  - `.compozy/tasks/unified-capabilities/memory/task_05.md`
- Scanned adjacent capability ledgers for cross-agent context:
  - `.codex/ledger/2026-04-20-MEMORY-capability-semantics.md`
  - `.codex/ledger/2026-04-20-MEMORY-discovery-contracts.md`
  - `.codex/ledger/2026-04-18-MEMORY-agent-capabilities-spec.md`
- Read task sources:
  - `.compozy/tasks/unified-capabilities/{task_05.md,_tasks.md,_techspec.md,task_04.md}`
  - `.compozy/tasks/unified-capabilities/adrs/{adr-001.md,adr-002.md,adr-003.md}`
- Read current docs and relevant code paths:
  - `docs/rfcs/003_agh-network-v0.md`
  - `docs/agents/capabilities.md`
  - `internal/{config/capabilities.go,session/network_peer.go,network/{envelope.go,validate.go,capability_brief.go,capability_catalog.go,manager.go,router.go},api/{contract/contract.go,core/network.go}}`
- Captured pre-change gap:
  - RFC 003 still names `recipe` as a normative kind, keeps a dedicated `recipe` section, and uses `recipe` examples/size guidance.
  - Runtime guide still documents only part of the unified schema and does not explain authored `version`, runtime-computed `digest`, `requirements`, or `kind:"capability"` transfer semantics.
- Rewrote `docs/agents/capabilities.md` around one capability model, including authored schema details, discovery/transfer projections, runtime/API boundary guidance, and an end-to-end worked example.
- Rewrote `docs/rfcs/003_agh-network-v0.md` so `capability` is the only authored/transferred artifact, `greet` stays brief, `whois` stays rich, interaction lifecycle text matches implemented capability behavior, and the worked example no longer reintroduces `recipe`.
- Ran targeted consistency checks:
  - `rg -n 'recipe' docs/rfcs/003_agh-network-v0.md docs/agents/capabilities.md` -> no matches
  - `git diff -- docs/rfcs/003_agh-network-v0.md docs/agents/capabilities.md` -> clean after commit
- Updated workflow task memory plus task tracking (`task_05.md`, `_tasks.md`) after verification.
- Created local commit `d381885b` (`docs: unify capability docs`).
- Ran `make verify` successfully on committed `HEAD`.

Now:

- None.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-20-MEMORY-rfc-runtime-capabilities.md`
- `.compozy/tasks/unified-capabilities/{task_05.md,_tasks.md,_techspec.md,task_04.md,memory/MEMORY.md,memory/task_05.md}`
- `.compozy/tasks/unified-capabilities/adrs/{adr-001.md,adr-002.md,adr-003.md}`
- `docs/rfcs/003_agh-network-v0.md`
- `docs/agents/capabilities.md`
- `internal/{config/capabilities.go,session/network_peer.go,network/{envelope.go,validate.go,capability_brief.go,capability_catalog.go,manager.go,router.go},api/{contract/contract.go,core/network.go}}`
- `git status --short`
- `rg -n 'recipe|capability|greet|whois|capability_catalog|capabilities_brief|digest|requirements' ...`
- `make verify`
- `git rev-parse --short HEAD`
