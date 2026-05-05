Goal (incl. success criteria):

- Evolve the AGORA/network drafts into a complete RFC for an agent network protocol that third parties can implement without AGH, while preserving strong ergonomic advantage for AGH/Go/NATS.
- Success means: clarified scope/principles, protocol boundaries, mandatory vs optional pieces, and approved RFC structure ready to write under docs/rfcs/.

Constraints/Assumptions:

- Must use brainstorming skill flow: explore context first, ask one clarifying question at a time, propose approaches, present design, get approval before writing the RFC.
- Must use karpathy-kb process as research input from ~/dev/knowledge/agent-networks and ~/dev/knowledge/ai-harness.
- RFC should describe a protocol, not an AGH-only product feature.
- Prefer alignment with Go + NATS and AGH architecture where that improves reference SDK quality, but protocol cannot require AGH installation.

Key decisions:

- Working from docs/rfcs/ideas/network/agora-spec-v0.2.md as latest draft baseline.
- Research sources come from local knowledge-base wiki/indexes and selected concept articles instead of web search.

State:

- In discovery/brainstorming.
- Existing drafts inventoried; KB indexes loaded.

Done:

- Listed current network drafts and recent git history.
- Scanned existing ledger files for cross-agent awareness.
- Read AGORA v0.1 and initial portion of v0.2.
- Read agent-networks and ai-harness concept/source indexes.

Now:

- Synthesized AGORA draft drift vs KB guidance and isolated the main design axis: protocol core vs NATS binding.
- Asked user to choose between transport-agnostic core, NATS-native core, or two-level conformance.

Next:

- After user answers, propose 2-3 architectural approaches and recommend one.
- Then present RFC structure sections for approval before writing.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: user preference among transport-agnostic core, NATS-native core, or two-level conformance with NATS profile.
- UNCONFIRMED: how much of identity/discovery/trust should be mandatory in v1 versus extension profiles.
- UNCONFIRMED: whether “recipes/artifacts” remain first-class in the same RFC or move to a second RFC.

Working set (files/ids/commands):

- docs/rfcs/ideas/network/agora-spec-v0.2.md
- docs/rfcs/ideas/network/agora-spec-v0.1.md
- ~/dev/knowledge/agent-networks/wiki/index/Concept Index.md
- ~/dev/knowledge/agent-networks/wiki/index/Source Index.md
- ~/dev/knowledge/ai-harness/wiki/index/Concept Index.md
- ~/dev/knowledge/ai-harness/wiki/index/Source Index.md
- git log --oneline -- docs/rfcs/ideas/network docs/rfcs
