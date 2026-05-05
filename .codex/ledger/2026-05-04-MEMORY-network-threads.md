# Goal (incl. success criteria):

- Author a greenfield TechSpec for first-class thread support in AGH Network under `.compozy/tasks/network-threads/`.
- The design must cover RFC changes, runtime/store/router changes, CLI/HTTP/UDS/web/docs impacts, agent prompts/orchestration semantics, and the test strategy.
- Success = user-approved TechSpec draft plus ADRs saved under `.compozy/tasks/network-threads/`, grounded in current codebase evidence and external research.

# Constraints/Assumptions:

- Conversation with the user is in Brazilian Portuguese; artifacts are in English.
- User explicitly invoked `cy-create-techspec`, `no-workarounds`, `compozy`, and allowed `qmd` plus the local knowledge vault under `~/dev/knowledge/agent-networks`.
- TechSpec flow requires one technical clarification question at a time; in this runtime that means a plain assistant question as the complete message when ready.
- Greenfield alpha hard cuts are allowed; no compatibility shims unless strictly necessary.
- Subagents are read-only exploration only.

# Key decisions:

- Use slug `network-threads` for the new workflow directory.
- Treat the first phase as research-heavy: current-state audit, knowledge-vault references, and one Claude/Opus architecture research round before asking the first design fork question.
- Use `.compozy/tasks/network-threads/analysis/claude-research-round1-prompt.md` as the external review artifact input.
- Accepted architecture direction from the user:
  - conversation is not modeled by a single universal thread container anymore
  - `channel` is the audience/discovery scope
  - `public_thread` is the N->N public conversation primitive inside a channel
  - `direct_room` is the 1->1 restricted-visibility conversation primitive inside a channel
  - `work_id` is orthogonal lifecycle-bearing work inside either conversation type
  - accepted hard cut rename: `interaction_id` -> `work_id`
  - accepted hard cut wire model: `direct` stops being a message `kind` and becomes the conversation `surface`
  - final wire shape accepted: `surface=thread|direct`, `thread_id` for thread conversations, `direct_id` for direct-room conversations, and `kind=direct` is deleted

# State:

- tasks_authored_validation_complete_with_external_verify_blocker

# Done:

- Read root workspace instructions, `internal/CLAUDE.md`, `web/CLAUDE.md`, and `packages/site/CLAUDE.md`.
- Read skills/instructions: `cy-spec-preflight`, `cy-create-techspec`, `brainstorming`, `no-workarounds`, `compozy`, `cy-impl-peer-review`, `cy-spec-peer-review`, `qmd`.
- Confirmed current AGH Network has `channel` + `interaction_id` but no first-class `thread_id` in RFC, runtime, store, contract, or web model.
- Confirmed current web network UX is room/timeline based and flat; public channel topics mix together, and concurrent peer interactions also mix because the UI does not group by `interaction_id`.
- Collected repo references: RFCs, current router/envelope/store/API/web timeline code, archived network techspec, old Agora drafts, complex scenarios, and GoClaw thread/topic isolation analysis.
- Queried local knowledge sources with `qmd` and direct reads; extracted relevant concepts from A2A `contextId`, multi-agent orchestration, handoff/context transfer, observability/tracing, and Claude Code subagent/mailbox patterns.
- Created `.compozy/tasks/network-threads/analysis/` and `.compozy/tasks/network-threads/adrs/`.
- Wrote Claude research prompt at `.compozy/tasks/network-threads/analysis/claude-research-round1-prompt.md`.
- Wrote a shorter follow-up Claude prompt at `.compozy/tasks/network-threads/analysis/claude-research-round2-prompt.md`.
- Spawned read-only explorers for surface mapping:
  - `Plato` (`019df3fc-26d9-7c50-9df3-662dae93f337`) — public surfaces
  - `Einstein` (`019df3fc-2840-7430-a8ee-8aa935cf5389`) — prompts/orchestration/tests
- Explorer findings confirmed:
  - public surfaces needing thread support include shared contracts, HTTP/UDS routes, API filters/detail payloads, CLI send/timeline workflows, web route state, query keys, OpenAPI/codegen, and protocol/runtime docs
  - prompt/orchestration surfaces already encode `interaction` semantics in bundled skills, inbound wrapper guidance, startup prompt sections, network-turn prompting, and a broad test matrix
- Ran Claude/Opus research round 1 via `compozy exec`.
- Round 1 artifact stream was truncated before a full JSON object completed, but the high-signal recommendation was clear from the streamed answer:
  - introduce `thread` as a first-class channel-scoped primitive distinct from `interaction`
  - keep `interaction` as a bilateral lifecycle-bearing work unit that lives inside a thread
  - keep `reply_to`, `trace_id`, and `causation_id` as causality/observability primitives
  - treat peer rooms as derived UX views, not protocol primitives
- Started Claude/Opus research round 2 to try to obtain a shorter complete JSON artifact; it was still reading files at the time of this update.
- User provided and approved the conceptual taxonomy:
  - `channel` = audience/visibility
  - `public_thread` = public topic/conversation
  - `direct_room` = bilateral restricted conversation
  - `message` = individual envelope/event
  - `reply_to` = message-to-message edge
  - `work_id` = directed lifecycle-bearing work unit
  - peer filter/view = auxiliary inspection feature, not the same as `direct_room`
- User then refined the model further:
  - `direct` should not be “a message inside a public thread”
  - `public_thread` and `direct_room` are separate conversation containers
  - `receipt` and `trace` inherit the visibility of the conversation where the `work_id` was opened
  - a public conversation may hand off into a direct room, but that should open a new `work_id`
- User accepted the ideal wire hard cut:
  - `surface=thread|direct`
  - `thread_id` is required when `surface=thread`
  - `direct_id` is required when `surface=direct`
  - `kind=direct` is removed from the protocol
- Authored ADR set:
  - `.compozy/tasks/network-threads/adrs/adr-001.md`
  - `.compozy/tasks/network-threads/adrs/adr-002.md`
  - `.compozy/tasks/network-threads/adrs/adr-003.md`
- Authored review draft at `.compozy/tasks/network-threads/analysis/techspec-draft.md`.
- User approved the draft as-is.
- Saved final TechSpec to `.compozy/tasks/network-threads/_techspec.md`.
- User approved amending `_techspec.md` to satisfy peer-review quality markers.
- Added missing quality markers to `_techspec.md`:
  - `## MVP Boundary`
  - `## Architectural Boundaries`
  - data-model field rationale
  - side-table-vs-JSON decisions
  - numbered safety invariants
- Created `.compozy/tasks/network-threads/qa/peer-review-prompt-round1.md`.
- Ran `compozy exec --ide claude --model opus --reasoning-effort xhigh --format json --prompt-file .compozy/tasks/network-threads/qa/peer-review-prompt-round1.md`; command succeeded.
- Captured round 1 artifacts:
  - `.compozy/tasks/network-threads/qa/peer-review-result-round1.json`
  - `.compozy/tasks/network-threads/qa/peer-review-final-round1.json`
  - `.compozy/tasks/network-threads/qa/peer-review-result-round1.err`
  - `.compozy/tasks/network-threads/qa/peer-review-summary-round1.md`
- Round 1 verdict: `NEEDS_REWORK` with 8 blockers and 10 nits.
- User selected full incorporation of all round 1 blockers and nits.
- Updated `_techspec.md` with concrete migration DDL, Go/interface shapes, direct-room algorithm, `network_work`, task-run boundary, same-transaction writes, trust signed-field set, extensibility/agent-manageability/config lifecycle, CLI/API/UDS/web/native-tool/Host API route maps, metric definitions, and QA requirements.
- Updated ADRs:
  - `adr-001.md`: direct-room two-party constraint, deterministic resolver, future group-room migration trigger
  - `adr-002.md`: `work_id` is network metadata, not a task queue; hard-cut symbol rename list
  - `adr-003.md`: RFC 004 signed-field impact, `DirectBody` deletion, direct-room visibility inheritance
- Added `.compozy/tasks/network-threads/qa/peer-review-incorporation-round1.md`.
- Validation:
  - `rg -n "[ \t]$" ...` found no trailing whitespace in touched files.
  - marker scan confirmed MVP Boundary, Architectural Boundaries, Implementation Design, Data Models, Field Rationale, SQLite Migration, Side-Table vs JSON, RFC 004 Trust Integration, Extensibility and Agent Manageability, Safety Invariants, Test Strategy, Implementation Steps, Monitoring and Observability.
  - `make verify` passed on 2026-05-04 after all spec edits; final line: `OK: all package boundaries respected`.
- User requested peer-review round 2 against the updated TechSpec.
- `cy-spec-peer-review` quality-marker preflight passed for round 2.
- Created `.compozy/tasks/network-threads/qa/peer-review-prompt-round2.md`.
- Ran `compozy exec --ide claude --model opus --reasoning-effort xhigh --format json --prompt-file .compozy/tasks/network-threads/qa/peer-review-prompt-round2.md`; command completed with exit code 0.
- Captured round 2 artifacts:
  - `.compozy/tasks/network-threads/qa/peer-review-result-round2.json`
  - `.compozy/tasks/network-threads/qa/peer-review-final-round2.json`
  - `.compozy/tasks/network-threads/qa/peer-review-result-round2.err`
  - `.compozy/tasks/network-threads/qa/peer-review-summary-round2.md`
- Round 2 verdict: `READY` with 0 blockers and 13 nits.
- Round 2 artifact validation passed:
  - parsed `.compozy/tasks/network-threads/qa/peer-review-final-round2.json` as JSON and confirmed `READY`, 0 blockers, 13 nits
  - trailing-whitespace scan found no matches in round 2 prompt/final JSON/summary and this ledger
- `make verify` was attempted after round 2 artifacts; it failed immediately at `codegen-check` because `sdk/typescript/src/generated/contracts.ts` is stale.
- `git status --short -- sdk/typescript/src/generated/contracts.ts internal/api/contract openapi/agh.json web/src/generated` shows pre-existing contract/codegen edits outside this peer-review artifact task.
- User selected option `A`: incorporate all 13 round 2 nits.
- Updated `.compozy/tasks/network-threads/_techspec.md` to incorporate all round 2 nits:
  - store-safe `store.NetworkConversationRef`
  - migration version verification and foreign-key assertions
  - direct-room collision behavior
  - explicit thread-opening rule and ID grammar
  - no broad post-terminal duplicate carve-out
  - hook delivery semantics
  - symmetric container-field validation
  - `network_work` foreign keys / restrict behavior
  - `task_runs.metadata_json.network_work_id` correlation key
  - channel-level web new-thread composer behavior
  - mandatory QA pair clarification
  - RFC 004/JCS nullable-field tests
- Added `.compozy/tasks/network-threads/qa/peer-review-incorporation-round2.md`.
- No ADRs changed in round 2 incorporation.
- Round 2 incorporation validation:
  - marker scan still finds MVP Boundary, Architectural Boundaries, Implementation Design, Data Models, Field Rationale, SQLite Migration, Side-Table vs JSON, RFC 004 Trust Integration, Extensibility and Agent Manageability, Safety Invariants, Test Strategy, Implementation Steps, Monitoring and Observability
  - incorporation markers for all 13 nits found in `_techspec.md` and/or `peer-review-incorporation-round2.md`
  - trailing-whitespace scan found no matches in `_techspec.md`, `peer-review-incorporation-round2.md`, or this ledger
  - `make verify` passed after incorporation; final lines: `DONE 8022 tests in 59.859s` and `OK: all package boundaries respected`
- Final scoped status still shows pre-existing contract/codegen edits outside this spec task:
  - `internal/api/contract/authored_context.go`
  - `internal/api/contract/contract.go`
  - `internal/api/contract/settings.go`
  - `openapi/agh.json`
  - `sdk/typescript/src/generated/contracts.ts`
  - `web/src/generated/agh-openapi.d.ts`
- User invoked `$cy-create-tasks` for `network-threads`.
- `.compozy/config.toml` is missing in this checkout, so use built-in task types: `frontend`, `backend`, `docs`, `test`, `infra`, `refactor`, `chore`, `bugfix`.
- Started read-only task-surface exploration subagents:
  - `James` (`019df46e-57d8-7fb3-8296-df27d57736a5`) for backend/runtime/store/network/API/CLI/UDS/native tools/extension surfaces.
  - `Socrates` (`019df46e-70e9-7f42-b902-e8aa60a749e2`) for web/packages/site/OpenAPI/generated TS route/query/component/doc impacts.
  - `Mill` (`019df46e-8d1c-73d2-8b7c-ecc1dc522525`) for prompt/skills/orchestration/hooks/observability/tests/real-scenario QA surfaces.
- Subagents did not complete within two wait windows, so the first breakdown is based on the approved TechSpec, ADRs, repo instructions, and local surface reads already completed.
- Drafted initial proposed task breakdown with 12 implementation tasks plus mandatory QA pair:
  1. RFC, Glossary, and Protocol Hard Cut
  2. Network Wire Model, Validation, and Hard-Cut Symbol Deletion
  3. Work Lifecycle and Direct-Room Identity Primitives
  4. SQLite Conversation Schema and Store DTO Foundation
  5. Conversation Persistence, Queries, Summaries, and Audit Writes
  6. Router, Delivery, Task Ingress, Hooks, and Observability
  7. Agent Prompt Wrappers and Bundled Network Skill
  8. Public Contracts, HTTP/UDS Parity, and Codegen
  9. CLI Network Thread, Direct, Work, and Send Commands
  10. Native Tools, Hosted Tool Schemas, and Extension Host API
  11. Web Network Thread/Direct Room Experience
  12. Site, Runtime Docs, Examples, and CLI Reference Co-Ship
  13. QA Plan and Test Coverage
  14. Real-Scenario QA Execution
- `Mill` (`019df46e-8d1c-73d2-8b7c-ecc1dc522525`) completed read-only prompt/skills/orchestration/hooks/observability/test-surface exploration. Key incorporation:
  - split runtime orchestration/delivery from network hooks/observability
  - keep agent prompt/bundled skill separate and make it depend on final CLI/native-tool shapes
  - split native tools/hosted schemas from extension Host API
  - add verification harness/E2E fixture alignment before the final QA pair, without treating it as a substitute for per-task unit/integration tests
- Revised proposed task breakdown to 15 implementation/support tasks plus mandatory QA pair:
  1. RFC, Glossary, and Protocol Hard Cut
  2. Network Wire Model, Validation, and Hard-Cut Symbol Deletion
  3. Work Lifecycle and Direct-Room Identity Primitives
  4. SQLite Conversation Schema and Store DTO Foundation
  5. Conversation Persistence, Queries, Summaries, and Audit Writes
  6. Runtime Routing, Delivery Wrappers, and Task Ingress
  7. Network Hooks, Status Counters, and Observability
  8. Public Contracts, HTTP/UDS Parity, and Codegen
  9. CLI Network Thread, Direct, Work, and Send Commands
  10. Native Agent Tools and Hosted Tool Schemas
  11. Extension Host API and SDK Network Surfaces
  12. Agent Prompt Wrappers and Bundled Network Skill
  13. Web Network Thread/Direct Room Experience
  14. Site, Runtime Docs, Examples, and CLI Reference Co-Ship
  15. E2E Harness and Fixture Alignment
  16. QA Plan and Test Coverage
  17. Real-Scenario QA Execution
- `Socrates` (`019df46e-70e9-7f42-b902-e8aa60a749e2`) completed read-only web/site/OpenAPI/generated TS exploration. Key incorporation for the eventual task files:
  - web work should explicitly cover data layer/query keys, route tree/state, components/view models, mocks/Storybook/browser artifacts/E2E fixtures, and settings/config lifecycle no-new-controls checks
  - generated `openapi/agh.json`, `web/src/generated/agh-openapi.d.ts`, `web/src/routeTree.gen.ts`, API reference, and CLI reference must be regenerated by proper generators, not hand-edited
  - site docs must distinguish NATS transport "direct" terminology from `surface:"direct"` direct rooms
  - final task list still requires the `qa-report` and `qa-execution` pair because the feature is UI-bearing and repo policy mandates it
- User asked to omit tasks 16 and 17. This conflicts with repo and `cy-tasks-tail-qa-pair` requirements: every `_tasks.md` must end with `QA Plan and Test Coverage` and `Real-Scenario QA Execution`. The negotiable part is keeping them canonical/concise, not deleting them.
- User clarified QA tasks are now autogenerated by `.compozy/extensions/cy-qa-workflow/extension.toml`; confirmed the extension exists and declares required hooks for plan/task mutation.
- Authored implementation/support task artifacts only:
  - `.compozy/tasks/network-threads/_tasks.md`
  - `.compozy/tasks/network-threads/task_01.md` through `.compozy/tasks/network-threads/task_15.md`
- Incorporated all three read-only subagent findings:
  - `James`: backend/runtime/store/API/CLI/native/extension/bridge split, agent-native UDS path, migration registry currently already at version 16 so schema task must use the next free version.
  - `Socrates`: web data layer, route tree, components/view models, MSW/Storybook/E2E fixtures, site docs, generated-reference boundaries, settings/config no-new-controls check.
  - `Mill`: split runtime delivery from hooks/observability, keep prompt/skill separate, split native tools from Host API, add E2E harness alignment before generated QA.
- Validation:
  - trailing-whitespace scan across `_tasks.md` and `task_*.md` found no matches
  - `compozy tasks validate --name network-threads` failed because this installed Compozy version has no `tasks` command
  - `compozy validate-tasks --name network-threads --format json` passed with `scanned: 15`, `ok: true`, `message: all tasks valid`
- `make verify` was run after task generation. It passed early stages through `bun-test` and `web-build`, then failed at `make lint` on unrelated dirty file `internal/skills/catalog.go:22` with `lll` (134 chars > 120) in a pre-existing user/other-agent change. I did not edit that unrelated file.

# Now:

- Report authored task files, Compozy validation, and the external `make verify` blocker.

# Next:

- Await user direction if they want me to fix the unrelated `internal/skills/catalog.go` lint blocker.

# Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether thread opening is explicit-only or whether reply ergonomics may auto-resolve `thread_id` from `reply_to`; current spec will make wire explicit and allow control-plane helpers only where documented.
- User selected all round 1 blockers and nits for incorporation.
- User selected all round 2 nits for incorporation.
- Research findings to apply:
  - `globalSchemaMigrations` currently includes version 16; the conversation-container migration should use the next free version at implementation time, currently expected to be 17 unless the registry changes before implementation.
  - Existing network timeline storage is flat and uses `interaction_id`; the new spec must replace `WriteNetworkMessage` with same-transaction conversation writes and summaries.
  - `task_runs` is the only durable work queue; `work_id` must not become a second task queue.
  - Extension Host API currently has no first-class network conversation methods; the spec must add agent/extension-manageable network methods.
  - Hooks currently have no `network` family; the spec must add typed network hooks dispatched at authoritative state transitions.

# Working set (files/ids/commands):

- `.compozy/tasks/network-threads/_techspec.md`
- `.compozy/tasks/network-threads/analysis/techspec-draft.md`
- `.compozy/tasks/network-threads/adrs/adr-001.md`
- `.compozy/tasks/network-threads/adrs/adr-002.md`
- `.compozy/tasks/network-threads/adrs/adr-003.md`
- `.compozy/tasks/network-threads/qa/peer-review-prompt-round1.md`
- `.compozy/tasks/network-threads/qa/peer-review-result-round1.json`
- `.compozy/tasks/network-threads/qa/peer-review-final-round1.json`
- `.compozy/tasks/network-threads/qa/peer-review-result-round1.err`
- `.compozy/tasks/network-threads/qa/peer-review-summary-round1.md`
- `.compozy/tasks/network-threads/analysis/claude-research-round1-prompt.md`
- `.compozy/tasks/network-threads/analysis/claude-research-round1-result.json`
- `.compozy/tasks/network-threads/analysis/claude-research-round2-prompt.md`
- `.compozy/tasks/network-threads/analysis/claude-research-round2-result.json`
- `docs/rfcs/003_agh-network-v0.md`
- `docs/rfcs/004_agh-network-v1.md`
- `internal/network/envelope.go`
- `internal/network/lifecycle.go`
- `internal/network/router.go`
- `internal/api/contract/contract.go`
- `internal/api/core/network_details.go`
- `internal/store/types.go`
- `internal/store/globaldb/global_db_network_messages.go`
- `web/src/routes/_app/network.tsx`
- `web/src/hooks/routes/use-network-page.ts`
- `web/src/systems/network/components/network-workspace-shell.tsx`
- `web/src/systems/network/lib/network-formatters.ts`
- `docs/ideas/complex-scenarios/network.md`
- `docs/ideas/network-drafts/agora-spec-v0.2.md`
- `docs/ideas/from-goclaw/analysis/analysis_providers_gateway.md`
- `.compozy/tasks/_archived/20260412-040024-network/_techspec.md`
- `~/dev/knowledge/agent-networks/wiki/concepts/Multi-Agent Orchestration Patterns.md`
- `~/dev/knowledge/agent-networks/wiki/concepts/Agent Handoff and Context Transfer.md`
- `~/dev/knowledge/agent-networks/wiki/concepts/The A2A Protocol.md`
- `~/dev/knowledge/agent-networks/wiki/concepts/Agent Observability and Distributed Tracing.md`
- `~/dev/knowledge/agent-networks/raw/articles/a2a-agent-card-specification.md`
- `~/dev/knowledge/agent-networks/raw/articles/azure-ai-agent-orchestration-patterns.md`
- `~/dev/knowledge/claude-code/wiki/concepts/Agent Swarm and Subagents.md`
- `qmd status`
- `qmd search ... -c agent-networks`
- `qmd search ... -c claude-code`
