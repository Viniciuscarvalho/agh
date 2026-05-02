# Analysis: openfang

## Scope

- Path explored: `.resources/openfang/`
- Topic: Applying an "agent soul" idea to AGH's harness: persistent agent self/identity/context, liveness/heartbeat, coordination across agents/networks/tasks/orchestration, and memory/context continuity.
- Files read in full vs. sampled: targeted read-only exploration of OpenFang agent manifests, identity types, capabilities, kernel spawn and generated identity files, prompt/context builders, memory substrate, heartbeat monitor, background executor, workflow/task queue code, events/hooks/triggers, networking/A2A, manifest signing, and skill verification.
- Total available files: not counted by the subagent; repository was sampled by targeted source search.

The analysis uses AGH constraints as the comparison lens: `task_runs` is the single durable work queue, `ClaimNextRun` is the only claim owner, scheduler wake/sweep must stay separate from claiming, hooks are typed call-site dispatch rather than an event bus, heartbeat/progress must avoid ACP backpressure, and agent-manageable CLI/HTTP/UDS surfaces are required.

## Overview

OpenFang implements a concrete "agent soul" pattern: each agent has a manifest, durable registry entry, capability set, session id, identity metadata, generated workspace identity files, canonical session memory, and prompt assembly that rehydrates identity/context on every turn. The strongest signal is the kernel's identity-file generator, which creates `SOUL.md`, `USER.md`, `TOOLS.md`, `MEMORY.md`, `AGENTS.md`, `BOOTSTRAP.md`, `IDENTITY.md`, and autonomous `HEARTBEAT.md` files while preserving existing user edits.

The architecture is much broader than a harness. `OpenFangKernel` composes registry, capabilities, event bus, scheduler, memory, supervisor, workflows, triggers, background executor, hooks, process manager, OFP networking, MCP/A2A, cron, and extensions in one daemon object. This gives AGH useful design material, but also highlights mismatches: OpenFang uses in-memory workflow/task/A2A stores in several places, while AGH's durable orchestration must remain centered on `task_runs` and `ClaimNextRun`.

## Mechanisms / Patterns

- **Agent identity is explicit and layered:** `AgentManifest` carries name/version/module/schedule/model/resources/capabilities/profile/tools/skills/autonomy/workspace/identity behavior. `AgentIdentity` holds display/personality fields. `AgentEntry` persists runtime identity, state, session id, parent/children, tags, and onboarding state.
- **Capability inheritance is a safety boundary:** Capabilities cover files, network, tools, LLM, agent operations, memory, shell, OFP, and economics, with validation for parent-to-child inheritance.
- **Soul context is assembled from durable and workspace sources:** The prompt builder has explicit fields for SOUL, USER, MEMORY, canonical context, user name, subagent context, autonomous context, AGENTS, BOOTSTRAP, workspace context, IDENTITY, HEARTBEAT, peer agents, date, sender, and `context.md`.
- **Canonical context is a separate user message:** OpenFang keeps canonical context separate to preserve system-prompt stability and provider prompt caching. This is transferable to AGH as a bounded, deterministic prompt-context layer.
- **Heartbeat/liveness is out-of-band from normal conversation content at the kernel level:** The monitor checks `last_active`, autonomous heartbeat timeout, idle/reactive exemptions, running task status, quiet hours, and recovery limits.
- **Heartbeat turns can be pruned from session history:** OpenFang repairs `NO_REPLY` heartbeat turns. AGH should avoid adopting heartbeat as ACP traffic unless isolated from user-visible transcript and ACP backpressure.
- **Coordination exists through several layers:** parent/child agents, `agent_send`, shared memory, event bus/triggers, workflows, cron, A2A, and OFP peer registry. This is useful as a taxonomy, but AGH should collapse durable work initiation into `task_runs` rather than importing multiple work queues.
- **Signature verification exists for manifests and skills:** Manifests use Ed25519 hashes/signatures, and skill verification includes checksums plus content/security scans.

## Relevant Code Paths

- `.resources/openfang/crates/openfang-types/src/agent.rs:L69-L83` - core agent identity and type definitions.
- `.resources/openfang/crates/openfang-types/src/agent.rs:L111-L126` - additional agent model fields.
- `.resources/openfang/crates/openfang-types/src/agent.rs:L172-L241` - agent profile/runtime fields.
- `.resources/openfang/crates/openfang-types/src/agent.rs:L298-L367` - agent configuration structures.
- `.resources/openfang/crates/openfang-types/src/agent.rs:L423-L568` - `AgentManifest` fields for schedule/model/resources/capabilities/profile/tools/skills/autonomy/workspace/identity.
- `.resources/openfang/crates/openfang-types/src/agent.rs:L607-L660` - `AgentIdentity` and `AgentEntry`.
- `.resources/openfang/crates/openfang-types/src/capability.rs:L1-L72` - capability enum/scope.
- `.resources/openfang/crates/openfang-types/src/capability.rs:L100-L185` - capability inheritance validation.
- `.resources/openfang/crates/openfang-kernel/src/kernel.rs:L60-L180` - kernel composition.
- `.resources/openfang/crates/openfang-kernel/src/kernel.rs:L291-L447` - spawn and identity/soul materialization.
- `.resources/openfang/crates/openfang-kernel/src/kernel.rs:L477-L502` - path/security checks for context materialization.
- `.resources/openfang/crates/openfang-kernel/src/kernel.rs:L1443-L1595` - agent spawn/runtime handling.
- `.resources/openfang/crates/openfang-kernel/src/kernel.rs:L1961-L2103` - prompt/context loading.
- `.resources/openfang/crates/openfang-kernel/src/kernel.rs:L2119-L2245` - context continuity logic.
- `.resources/openfang/crates/openfang-kernel/src/kernel.rs:L4245-L4249` - heartbeat/background wiring.
- `.resources/openfang/crates/openfang-kernel/src/kernel.rs:L4600-L4748` - heartbeat monitor and recovery behavior.
- `.resources/openfang/crates/openfang-kernel/src/heartbeat.rs:L1-L58` - heartbeat definitions.
- `.resources/openfang/crates/openfang-kernel/src/heartbeat.rs:L129-L226` - liveness checks.
- `.resources/openfang/crates/openfang-kernel/src/background.rs:L1-L180` - background executor.
- `.resources/openfang/crates/openfang-kernel/src/workflow.rs:L1-L205` - workflow model and in-memory runtime.
- `.resources/openfang/crates/openfang-kernel/src/workflow.rs:L210-L390` - workflow orchestration.
- `.resources/openfang/crates/openfang-kernel/src/event_bus.rs:L1-L98` - event bus.
- `.resources/openfang/crates/openfang-kernel/src/triggers.rs:L1-L80` - trigger system.
- `.resources/openfang/crates/openfang-runtime/src/hooks.rs:L1-L76` - runtime hooks.
- `.resources/openfang/crates/openfang-runtime/src/prompt_builder.rs:L9-L210` - ordered prompt builder fields and sections.
- `.resources/openfang/crates/openfang-runtime/src/prompt_builder.rs:L292-L305` - canonical context separated as user message.
- `.resources/openfang/crates/openfang-runtime/src/agent_context.rs:L1-L125` - agent context rendering.
- `.resources/openfang/crates/openfang-runtime/src/workspace_context.rs:L1-L158` - workspace context rendering.
- `.resources/openfang/crates/openfang-runtime/src/session_repair.rs:L674-L723` - heartbeat `NO_REPLY` repair.
- `.resources/openfang/crates/openfang-memory/src/lib.rs:L1-L8` - memory crate entry.
- `.resources/openfang/crates/openfang-memory/src/substrate.rs:L28-L67` - memory substrate definitions.
- `.resources/openfang/crates/openfang-memory/src/substrate.rs:L190-L213` - session/memory persistence.
- `.resources/openfang/crates/openfang-memory/src/substrate.rs:L465-L616` - task queue and claim mismatch evidence.
- `.resources/openfang/crates/openfang-memory/src/session.rs:L12-L100` - canonical session memory.
- `.resources/openfang/crates/openfang-memory/src/structured.rs:L113-L158` - structured memory.
- `.resources/openfang/crates/openfang-types/src/manifest_signing.rs:L1-L107` - manifest signing primitives.
- `.resources/openfang/crates/openfang-skills/src/verify.rs:L1-L179` - skill checksum/content/security verification.
- `.resources/openfang/crates/openfang-wire/src/peer.rs:L1-L213` - peer identity/card model.
- `.resources/openfang/crates/openfang-wire/src/registry.rs:L1-L190` - peer registry.
- `.resources/openfang/crates/openfang-wire/src/message.rs:L33-L149` - network message model.
- `.resources/openfang/crates/openfang-runtime/src/a2a.rs:L1-L116` - A2A model integration.
- `.resources/openfang/crates/openfang-runtime/src/a2a.rs:L211-L510` - in-memory A2A tasks.
- `.resources/openfang/docs/workflows.md:L1-L15` - workflow docs.
- `.resources/openfang/docs/workflows.md:L96-L153` - workflow orchestration patterns.

## Transferable Patterns

- Model "agent soul" as a durable identity bundle with typed fields plus bounded rendered context. OpenFang's `AgentManifest` plus `AgentIdentity` plus generated identity files is a useful precedent, but AGH should make database state authoritative and treat files as editable projections or import/export artifacts.
- Centralize prompt assembly. AGH can adopt OpenFang's explicit, ordered prompt-context model with bounded reads, separate canonical context, persona/user/memory sections, and peer-agent context instead of scattering prompt fragments across harness call sites.
- Separate liveness from conversation. OpenFang's heartbeat monitor, idle-reactive exemption, background semaphore, and health endpoint patterns support AGH's requirement that heartbeat/progress not travel through ACP stream backpressure. AGH should persist liveness/progress side-channel state keyed to agent/session/task_run.
- Keep scheduler responsibilities narrow. OpenFang has separate scheduler, cron, background loops, and task queue. For AGH, the transferable idea is separation of wake/sweep/monitor from work claiming; the non-transferable part is allowing any scheduler-like subsystem to claim durable work outside `ClaimNextRun`.
- Use capability/profile declarations for agent self-description and spawn policy. OpenFang's tool profiles and capability inheritance are useful for AGH agent identity, task routing, and network publication, as long as AGH avoids hidden compatibility aliases and exposes management via CLI/HTTP/UDS.
- Consider signed "soul" artifacts if AGH imports external agent identities/capabilities. OpenFang's manifest signing and skill verification provide a baseline for tamper detection, prompt-injection scanning, and provenance checks.
- Publish network identity as cards, not only internal structs. OpenFang's OFP peer registry and A2A AgentCard model are useful for AGH Network: expose agent identity, capabilities, endpoint, and health/liveness without conflating remote tasks with the local durable `task_runs` queue.

## Risks / Mismatches

- OpenFang's `task_queue` is not compatible with AGH's `task_runs` invariant. `task_claim` selects and updates pending tasks under a process mutex; AGH must preserve `ClaimNextRun` as the single durable claim path.
- OpenFang workflows and A2A task storage are in-memory. AGH should not copy this for orchestration state because recovery/restart semantics require durable `task_runs`.
- OpenFang's event bus and triggers mismatch AGH hook semantics. AGH hooks are typed call-site dispatch, not a general event bus; importing trigger/event-bus behavior as hooks would blur invariants and create hidden asynchronous control flow.
- Heartbeat-as-message is risky for AGH. OpenFang includes autonomous heartbeat config and repairs `NO_REPLY` heartbeat turns, but AGH must avoid ACP backpressure and transcript pollution by using out-of-band heartbeat/progress storage.
- File-based soul context can become stale or prompt-injected. AGH needs schema validation, signing/provenance, bounded rendering, and agent-manageable update APIs.
- OpenFang's kernel is highly centralized. AGH should avoid turning agent soul into another composition-root grab bag; instead, keep soul state in clear storage/service boundaries and expose it through existing harness, CLI, HTTP, and UDS surfaces.
- Signature primitives exist, but the reviewed spawn path primarily computes manifest hash/integrity metadata. Verification enforcement for every agent load would need confirmation before treating OpenFang's signing model as complete.

## Open Questions

- Does OpenFang enforce signed manifest verification on every production agent load, or are signatures optional tooling around manifests?
- Which OpenFang persistence paths survive daemon restart for workflow runs, trigger state, peer registry, and A2A tasks beyond canonical memory/session stores?
- Are `SOUL.md`, `IDENTITY.md`, and `MEMORY.md` intended to be user-authored long-lived truth, generated scaffolding, or cacheable projections from structured state?
- How does OpenFang prevent heartbeat/background self-prompts from competing with user work under model/provider rate limits?
- If AGH adopts identity files as projections, what is the conflict policy when an agent edits the file while HTTP/CLI updates structured soul state?

## Evidence

- `.resources/openfang/crates/openfang-types/src/agent.rs:L69-L83`
- `.resources/openfang/crates/openfang-types/src/agent.rs:L111-L126`
- `.resources/openfang/crates/openfang-types/src/agent.rs:L172-L241`
- `.resources/openfang/crates/openfang-types/src/agent.rs:L298-L367`
- `.resources/openfang/crates/openfang-types/src/agent.rs:L423-L568`
- `.resources/openfang/crates/openfang-types/src/agent.rs:L607-L660`
- `.resources/openfang/crates/openfang-types/src/capability.rs:L1-L72`
- `.resources/openfang/crates/openfang-types/src/capability.rs:L100-L185`
- `.resources/openfang/crates/openfang-kernel/src/kernel.rs:L60-L180`
- `.resources/openfang/crates/openfang-kernel/src/kernel.rs:L291-L447`
- `.resources/openfang/crates/openfang-kernel/src/kernel.rs:L477-L502`
- `.resources/openfang/crates/openfang-kernel/src/kernel.rs:L1443-L1595`
- `.resources/openfang/crates/openfang-kernel/src/kernel.rs:L1961-L2103`
- `.resources/openfang/crates/openfang-kernel/src/kernel.rs:L2119-L2245`
- `.resources/openfang/crates/openfang-kernel/src/kernel.rs:L4245-L4249`
- `.resources/openfang/crates/openfang-kernel/src/kernel.rs:L4600-L4748`
- `.resources/openfang/crates/openfang-kernel/src/heartbeat.rs:L1-L58`
- `.resources/openfang/crates/openfang-kernel/src/heartbeat.rs:L129-L226`
- `.resources/openfang/crates/openfang-kernel/src/background.rs:L1-L180`
- `.resources/openfang/crates/openfang-kernel/src/workflow.rs:L1-L205`
- `.resources/openfang/crates/openfang-kernel/src/workflow.rs:L210-L390`
- `.resources/openfang/crates/openfang-kernel/src/event_bus.rs:L1-L98`
- `.resources/openfang/crates/openfang-kernel/src/triggers.rs:L1-L80`
- `.resources/openfang/crates/openfang-runtime/src/hooks.rs:L1-L76`
- `.resources/openfang/crates/openfang-runtime/src/prompt_builder.rs:L9-L210`
- `.resources/openfang/crates/openfang-runtime/src/prompt_builder.rs:L292-L305`
- `.resources/openfang/crates/openfang-runtime/src/agent_context.rs:L1-L125`
- `.resources/openfang/crates/openfang-runtime/src/workspace_context.rs:L1-L158`
- `.resources/openfang/crates/openfang-runtime/src/session_repair.rs:L674-L723`
- `.resources/openfang/crates/openfang-memory/src/lib.rs:L1-L8`
- `.resources/openfang/crates/openfang-memory/src/substrate.rs:L28-L67`
- `.resources/openfang/crates/openfang-memory/src/substrate.rs:L190-L213`
- `.resources/openfang/crates/openfang-memory/src/substrate.rs:L465-L616`
- `.resources/openfang/crates/openfang-memory/src/session.rs:L12-L100`
- `.resources/openfang/crates/openfang-memory/src/structured.rs:L113-L158`
- `.resources/openfang/crates/openfang-types/src/manifest_signing.rs:L1-L107`
- `.resources/openfang/crates/openfang-skills/src/verify.rs:L1-L179`
- `.resources/openfang/crates/openfang-wire/src/peer.rs:L1-L213`
- `.resources/openfang/crates/openfang-wire/src/registry.rs:L1-L190`
- `.resources/openfang/crates/openfang-wire/src/message.rs:L33-L149`
- `.resources/openfang/crates/openfang-runtime/src/a2a.rs:L1-L116`
- `.resources/openfang/crates/openfang-runtime/src/a2a.rs:L211-L510`
- `.resources/openfang/docs/workflows.md:L1-L15`
- `.resources/openfang/docs/workflows.md:L96-L153`
