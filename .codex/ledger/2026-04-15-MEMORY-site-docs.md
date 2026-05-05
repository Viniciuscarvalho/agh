Goal (incl. success criteria):

- Research how AGH should present its marketing site and documentation architecture.
- Produce parallel analysis artifacts under `.compozy/tasks/site/analysis/analysis_<name>.md`.
- Synthesize the research into homepage positioning, docs taxonomy, and a recommendation on PRD vs TechSpec.

Constraints/Assumptions:

- User explicitly requested multiple subagents in parallel.
- Use local project sources first: `.resources/*`, local docs/specs, KB/QMD/Obsidian collections, and repository code/docs.
- This turn is research and synthesis first, not site implementation.
- The AGH Network Protocol (`docs/rfcs/003_agh-network-v0.md`) is the primary differentiator and must be treated as a first-class product/documentation surface.
- Obsidian CLI is not available in this environment; use QMD and repo files as the primary local knowledge sources.

Key decisions:

- Use four research tracks: reference projects in `.resources`, local KB/QMD/Obsidian knowledge, repository/spec analysis, and protocol-specific positioning.
- Write one markdown artifact per research track into `.compozy/tasks/site/analysis/`.
- Defer PRD/TechSpec recommendation until after evidence is synthesized.
- Position AGH Network separately from AGH Runtime, with protocol docs focused on wire semantics, trust, transport profiles, and conformance, and runtime docs focused on daemon/session/UI/CLI behavior.
- Recommend a focused PRD before a TechSpec because the open work is product framing and information architecture, not implementation detail.
- Make runtime documentation domain-first in navigation: explicit hubs such as `Sessions`, `Agents`, `Skills`, `Memory`, `Automations`, `Bridges`, `Extensions`, and `ACP Drivers`, with Diataxis used inside each hub rather than as the only top-level split.

State:

- in_progress

Done:

- Read workspace instructions and relevant skill instructions supplied by the user.
- Scanned existing ledgers for relevant prior context on harness docs and network protocol work.
- Created `.compozy/tasks/site/analysis/`.
- Confirmed `kb` and `qmd` are installed; confirmed QMD collections `agent-networks` and `ai-harness` are available.
- Confirmed Obsidian CLI cannot attach to a running vault in this environment.
- Wrote `.compozy/tasks/site/analysis/analysis_kb_qmd_obsidian.md` with tool limits, QMD collection findings, AGH docs/runtime implications, and evidence.
- Wrote `.compozy/tasks/site/analysis/analysis_resources_docs.md` with a cross-project docs IA comparison and AGH-specific copy/avoid guidance.
- Wrote `.compozy/tasks/site/analysis/analysis_runtime_capabilities.md` with the runtime product summary, capability map, and runtime docs taxonomy.
- Wrote `.compozy/tasks/site/analysis/analysis_network_protocol.md` with standalone AGH Network positioning, runtime/protocol split, taxonomy, guardrails, and evidence.
- Wrote `.compozy/tasks/site/analysis/analysis.md` with the unified site/docs strategy, draft copy direction, documentation taxonomy, and PRD-vs-TechSpec recommendation.
- Refined the runtime docs taxonomy after user feedback to make feature domains explicit in top-level navigation.

Now:

- Finalize the user-facing synthesis and recommend the next artifact.

Next:

- If the user agrees, run `cy-create-prd` for `.compozy/tasks/site/_prd.md` using the approved strategy.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: which headline direction the user prefers for the homepage.
- UNCONFIRMED: whether the docs landing page should expose RFCs directly in top navigation or only within the protocol branch.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-15-MEMORY-site-docs.md`
- `.compozy/tasks/site/analysis/`
- `.compozy/tasks/site/analysis/analysis.md`
- `.compozy/tasks/site/analysis/analysis_kb_qmd_obsidian.md`
- `.compozy/tasks/site/analysis/analysis_resources_docs.md`
- `.compozy/tasks/site/analysis/analysis_runtime_capabilities.md`
- `.compozy/tasks/site/analysis/analysis_network_protocol.md`
- `.resources/*`
- `.compozy/tasks/*`
- `docs/rfcs/003_agh-network-v0.md`
- `kb`, `qmd`, `obsidian`
