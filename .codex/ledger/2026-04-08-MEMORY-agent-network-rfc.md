# Goal (incl. success criteria):

- Produce a complete RFC for the agent network protocol under docs/rfcs/.
- Ground it in existing network drafts plus knowledge vault references from ~/dev/knowledge/{agent-networks,ai-harness}.
- Ensure protocol is independent of AGH, but strategically aligned with AGH/Go/NATS/SDK direction.
- Working name is now `AGH Network` (replaces `AGORA` as the protocol/project name).

# Constraints/Assumptions:

- Must use brainstorming, karpathy-kb, and qmd workflows.
- User explicitly asked to use subagents and to use qmd/obsidian CLI extensively.
- This turn is still in design/RFC mode, not implementation of protocol code.
- The final RFC must include explicit `Sources/References` sections and list the knowledge-vault materials actually consulted from `~/dev/knowledge/{agent-networks,ai-harness}`.

# Key decisions:

- Existing AGORA v0.2 is strongly NATS-bound and mixes protocol semantics, transport binding, artifact model, SDK, CLI, and product ergonomics.
- User selected: layered design with a transport-agnostic core plus a normative NATS binding/profile for v1.
- User selected: `task lifecycle leve` for the core direction (`submitted`, `working`, `completed`, etc. in a minimal form), instead of staying purely chat/artifact-centric or moving to a heavy workflow state machine.
- User selected: identity/discovery option `3` (`meio-termo`) for the core. The core should include canonical identity plus a minimal `whois/capabilities` surface, while advanced discovery, trust, registry, and richer runtime metadata stay in profiles.
- User selected: `recipe` should remain a first-class core artifact, but only as a light protocol artifact. Execution/runtime policy/packaging complexity should stay outside the core.
- User agreed with `observability mínima obrigatória` in the core: correlation, lineage, basic `receipt`, and light `trace`/progress semantics belong in the core, while richer telemetry and runtime observability stay in profiles.
- User selected: delivery semantics option `2`, meaning the core defines delivery expectations semantically, while concrete retry/ack/timeout/replay behavior belongs to the NATS/profile layer.
- User accepted the recommendation that verified-mode interoperability should use a normative `Baseline Trust Profile` with a single MTI algorithm in v1; trust semantics are modeled in the core, while concrete verification mechanics are fixed by the baseline profile.
- UNCONFIRMED: final RFC filename/title not chosen yet.
- `AGH Network` should preserve open-spec characteristics while letting AGH be the best implementation via SDK/runtime/profile quality.
- User clarified the top priority for v1: maximize AGH operational superiority, even if the protocol becomes more opinionated.

# State:

- in_progress

# Done:

- Initialized session ledger.
- Confirmed `qmd` collections for `agent-networks` and `ai-harness`.
- Confirmed Obsidian CLI works for vault/workspace/backlinks/search navigation in this environment.
- Identified that `qmd query` hybrid/vector mode crashes locally (`sqlite vec0` / Bun); using `qmd search`, `qmd ls`, and `qmd get` as fallback.
- Read AGORA v0.2 plus prior council/recipe documents and relevant KB articles on A2A, ANP, AGNTCY, discovery, identity, observability, harnesses, and orchestration.
- Confirmed qmd collections for `agent-networks` and `ai-harness` exist.
- Confirmed Obsidian CLI vault/workspace access; direct read/search are partially unreliable in this environment.
- qmd query hybrid mode crashes locally due sqlite vec0/Bun issue; using qmd search/ls/get fallback.
- Subagent `agent-networks` synthesis: prefer small semantic core plus profiles for transport, trust, federation, routing, and governance.
- Subagent `drafts/network` synthesis: current material strongly supports splitting AGORA Core from AGORA NATS Profile; current v0.2 is too NATS/AGH-coupled for a third-party protocol RFC.
- Subagent `ai-harness` synthesis: moat should live in SDK/runtime/harness/observability/memory quality, not in locking the wire spec to AGH.
- User approved the general direction: `Core agnostic + NATS normative`.
- User approved design section 1: layered architecture with `Core`, `NATS Profile`, and `Baseline Trust Profile` within a single RFC for v1.
- User approved design section 2: core semantic model with envelope, interaction lifecycle, minimal message kinds, recipe as a first-class artifact, and explicit conformance classes.
- User approved design section 3: profile responsibilities, verified interoperability via the baseline trust profile, and operational conformance modes beyond the core.
- User approved design section 4 after adding explicit `Sources/References`, `Research Corpus Consulted`, and local knowledge-vault traceability requirements.
- Rewrote `docs/plans/2026-04-08-agh-network-design.md` to match the approved design and include the consulted research corpus.
- Rewrote the main RFC into `docs/rfcs/agh-network-v1.md` and converted `docs/rfcs/agh-network.md` into a superseded pointer.
- User requested removing the old `docs/rfcs/agh-network.md` entirely to avoid confusion.
- Removed `docs/rfcs/agh-network.md` and updated the design doc and v1 RFC to stop referring to it as a living path.

# Now:

- Run repository verification after removing the legacy RFC path and fix any fallout.

# Next:

- If verification passes, summarize the final single-RFC path and note that the legacy RFC file was removed.

# Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether the RFC should later add a second appendix for upstream raw source files cited by the consulted vault notes, beyond the directly consulted local corpus already listed.

# Working set (files/ids/commands):

- docs/rfcs/ideas/network/
- ~/dev/knowledge/agent-networks/
- ~/dev/knowledge/ai-harness/
