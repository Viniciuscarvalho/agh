# Analysis: paperclip

## Scope

- Path explored: `.resources/paperclip/`
- Topic: Applying an "agent soul" idea to AGH's harness: persistent agent self/identity/context, liveness/heartbeat, coordination across agents/networks/tasks/orchestration, and memory/context continuity.
- Files read in full vs. sampled: focused read-only exploration of Paperclip onboarding assets, DB schemas, heartbeat services, issue/agent/approval routes, liveness/recovery services, MCP tools, CLI heartbeat command, and memory docs.
- Total available files: not counted by the subagent; repository is large and was sampled by targeted search.

AGH constraints applied while interpreting Paperclip:

- AGH `task_runs` remains the single durable work queue.
- `ClaimNextRun` owns claims; scheduler may wake/sweep but must not claim.
- Hooks are typed call-site dispatch, not a general event bus.
- Heartbeat/progress must avoid ACP backpressure.
- Agent-manageable CLI/HTTP/UDS surfaces are required.

## Overview

Paperclip already embodies a strong "agent soul" product shape: an agent is not just an adapter process, but an organizational actor with role, title, manager, capabilities, runtime config, budget, permissions, last heartbeat, persona files, task-specific session continuity, inbox, approvals, blockers, and heartbeat-driven liveness. The clearest "soul" artifacts are the CEO onboarding files: `SOUL.md` defines role posture and voice, while `HEARTBEAT.md` tells the agent to confirm identity, read wake context, inspect daily local memory, work assigned issues, handle approvals, delegate, extract durable facts, and include run IDs on mutating API calls.

The implementation splits identity, runtime continuity, work ownership, wake orchestration, and liveness into distinct surfaces. Agents have durable org identity (`agents`), agent-level runtime state (`agent_runtime_state`), task-scoped sessions (`agent_task_sessions`), wake requests (`agent_wakeup_requests`), heartbeat runs (`heartbeat_runs`), issue ownership locks (`issues.checkout_run_id` / `issues.execution_run_id`), dependency edges (`issue_relations`), approvals, tree holds, routines, and watchdog decisions.

For AGH, the transferable idea is the shape of the context and control plane, not Paperclip's exact queue design. Paperclip has both `agent_wakeup_requests` and `heartbeat_runs`, while AGH must preserve `task_runs` as the single durable work queue and keep all claim authority in `ClaimNextRun`.

## Mechanisms / Patterns

- **Persistent identity and persona:** Paperclip models agents with `name`, `role`, `title`, `reportsTo`, `capabilities`, adapter/runtime config, budgets, pause state, permissions, `lastHeartbeatAt`, and metadata. The CEO `SOUL.md` and `HEARTBEAT.md` are bundled persona/operating instructions, not transient prompt text.
- **Agent self-check on every wake:** The heartbeat checklist explicitly starts with `GET /api/agents/me` and wake context variables (`PAPERCLIP_TASK_ID`, `PAPERCLIP_WAKE_REASON`, `PAPERCLIP_WAKE_COMMENT_ID`) before local planning and assignment lookup. This maps to AGH's need to hydrate "who am I, why did I wake, what task/run/network context owns me?" from the harness, not from agent memory alone.
- **Runtime continuity in two layers:** `agent_runtime_state` stores agent-level adapter session ID, last run/status/error, token totals, and cost totals. `agent_task_sessions` stores adapter-defined session params per `(company, agent, adapter_type, task_key)` with unique indexing. Paperclip derives `taskKey` from task or issue identity and uses a synthetic `__heartbeat__` key for scheduled wakes.
- **Wakeup/run split and coalescing:** `agent_wakeup_requests` carries wake source, trigger detail, reason, payload, status, coalesced count, actor, idempotency key, and linked run. `heartbeat_runs` carries actual run status, session IDs, logs, process metadata, retry/liveness fields, next action, and context snapshot. Paperclip coalesces same-scope queued/running wakes, defers issue wakes behind active execution, or creates a queued run.
- **Claim-time ownership and safety checks:** `claimQueuedRun` transitions a queued run to `running`, rejects paused/terminated agents, checks budget, pause holds, blockers, stale issue state, then stamps `issues.executionRunId` lazily once the run is actually running. AGH should preserve the safety-check concept but execute it through `ClaimNextRun` over `task_runs`, not through a second wake table.
- **Issue checkout as ownership:** Paperclip checkout requires expected statuses, assignee constraints, unresolved-blocker checks, and run-aware lock conditions; success sets assignee, clears user assignee, sets checkout/execution run IDs, and moves status to `in_progress`.
- **Coordination graph:** Issues have `parentId`, assignee agent/user, checkout/execution run IDs, origin metadata, execution policy/state, workspace fields, and status timing. Blockers are first-class edges in `issue_relations`, with unique `(company, issue, related_issue, type)` edges. Dependency readiness treats non-`done` blockers as unresolved, including canceled blockers until the relation changes.
- **Approvals as durable coordination:** Approvals carry type, requester agent/user, status, payload, decision note, decider, and timestamps, with issue links in `issue_approvals`. Approval resolution queues a wake for the requester with approval and linked issue context.
- **Agent inbox as projection:** `/agents/me/inbox-lite` returns current authenticated agent assignments with dependency readiness and blocker details. Inbox/badge data is derived from approvals, failed runs, join requests, and unread touched issues, not from an unrelated mailbox.
- **Comments and mentions wake agents:** Issue comments can reopen/resume/interrupt, record activity, expire stale confirmations, batch wakeups, wake assignees, and wake mentioned agents with `wakeReason` and `wakeCommentId` context. This maps to AGH coordination messages if runnable work remains queued through `task_runs`.
- **Tree-level orchestration:** Paperclip can preview and create issue tree holds, storing affected issue snapshots including assignees and active runs. Routes interrupt active runs and cancel unclaimed wakeups for subtree pause/cancel holds.
- **Scheduler wakes and sweeps:** Paperclip startup and interval loops call timer ticks, routine ticks, orphan reaping, scheduled retry promotion, queued run resume, stranded issue reconciliation, issue graph liveness reconciliation, silent active run scanning, and productivity review reconciliation. For AGH this is useful as a responsibility catalog, but claim/start must stay in `ClaimNextRun`.
- **Heartbeat/liveness without relying only on process exit:** Paperclip stores `last_output_at`, output sequence/stream/bytes, `liveness_state`, `last_useful_action_at`, `next_action`, and `context_snapshot` on runs. Output progress is flushed to DB at a throttled interval while logs stream to a separate log store and live events.
- **Liveness classification uses concrete durable evidence:** Comments, document revisions, work products, activity events, and tool/action events count as useful progress; workspace creation alone intentionally does not.
- **Provider-neutral memory/control-plane thinking:** Paperclip's memory survey recommends company-scoped provider binding, agent overrides, provenance to runs/issues/comments/documents, cost/latency reporting, inspect surfaces, and plugin-backed providers. Common primitives are ingest, query, scope, provenance, maintenance, and context assembly.
- **Agent-manageable surfaces:** HTTP exposes self, wakeup, runtime state, task sessions, reset session, heartbeat runs, events, and logs. CLI has `heartbeat run` with API base/key, source, trigger, timeout, JSON, and debug flags. MCP exposes agent self, inbox, issues, heartbeat context, comments, approvals, checkout, interactions, documents, and workspace runtime controls.

## Relevant Code Paths

- `.resources/paperclip/server/src/onboarding-assets/ceo/SOUL.md:1-33` - static persona/identity/voice instructions for the CEO agent.
- `.resources/paperclip/server/src/onboarding-assets/ceo/HEARTBEAT.md:5-84` - per-wake operating checklist: identity, local memory, assignments, checkout, delegation, fact extraction, run header.
- `.resources/paperclip/packages/db/src/schema/agents.ts:14-36` - durable agent identity/org/runtime/budget/permission shape.
- `.resources/paperclip/packages/db/src/schema/agent_runtime_state.ts:5-21` - agent-level session, last run, token/cost totals, last error.
- `.resources/paperclip/packages/db/src/schema/agent_task_sessions.ts:6-39` - task-scoped session continuity by company/agent/adapter/task key.
- `.resources/paperclip/packages/db/src/schema/agent_wakeup_requests.ts:5-26` - separate wake request queue metadata; useful conceptually but mismatched with AGH's single `task_runs` queue.
- `.resources/paperclip/packages/db/src/schema/heartbeat_runs.ts:6-58` - run lifecycle, session, process, retry, liveness, output progress, and context snapshot fields.
- `.resources/paperclip/server/src/services/heartbeat.ts:1446-1488` - task key derivation and synthetic scheduled-heartbeat key.
- `.resources/paperclip/server/src/services/heartbeat.ts:2772-2866` - upsert/clear task session and ensure runtime state.
- `.resources/paperclip/server/src/services/heartbeat.ts:3967-4078` - claim queued run, validate agent/budget/holds/blockers/staleness, stamp execution lock.
- `.resources/paperclip/server/src/services/heartbeat.ts:4817-4887` - start next queued runs under agent start lock, prioritize dependency-ready work, execute claimed runs.
- `.resources/paperclip/server/src/services/heartbeat.ts:5528-5650` - throttled output-progress flush and log streaming.
- `.resources/paperclip/server/src/services/heartbeat.ts:6594-7282` - wake enqueue/coalescing/defer logic for issue and non-issue wakes.
- `.resources/paperclip/server/src/services/heartbeat.ts:7775-7808` - timer scheduler wake loop.
- `.resources/paperclip/server/src/services/issues.ts:262-305` - dependency readiness and unresolved blocker counting.
- `.resources/paperclip/server/src/services/issues.ts:1923-1974` - blocker edge synchronization with cycle/company validation.
- `.resources/paperclip/server/src/services/issues.ts:3098-3247` - checkout ownership, run locks, stale adoption, and conflict details.
- `.resources/paperclip/server/src/routes/issues.ts:2732-2803` - agent checkout route.
- `.resources/paperclip/server/src/routes/issues.ts:3401-3660` - comments as wake/resume/interrupt/mention coordination.
- `.resources/paperclip/server/src/routes/approvals.ts:136-224` - approval resolution wakes requester with linked issue context.
- `.resources/paperclip/server/src/routes/agents.ts:1532-1579` - authenticated agent self and inbox-lite assignment projection.
- `.resources/paperclip/server/src/routes/agents.ts:1688-1752` - runtime state, task sessions, and reset-session API.
- `.resources/paperclip/server/src/routes/agents.ts:2694-2800` - HTTP wakeup/invoke endpoints.
- `.resources/paperclip/server/src/routes/issue-tree-control.ts:75-204` - tree hold creation, active run interruption, and unclaimed wake cancellation.
- `.resources/paperclip/server/src/services/issue-tree-control.ts:628-850` - tree hold preview/persistence.
- `.resources/paperclip/server/src/services/recovery/service.ts:40-52` - recovery service signal definitions.
- `.resources/paperclip/server/src/services/recovery/service.ts:582-670` - recovery scan behavior.
- `.resources/paperclip/server/src/services/recovery/service.ts:1059-1100` - silent active run scan.
- `.resources/paperclip/server/src/services/run-liveness.ts:150-197` - useful-output/concrete-action evidence rules.
- `.resources/paperclip/server/src/index.ts:672-783` - startup and interval reconciliation loops.
- `.resources/paperclip/doc/spec/agents-runtime.md:71-80` - runtime behavior notes.
- `.resources/paperclip/doc/memory-landscape.md:7-18` - memory control-plane goals.
- `.resources/paperclip/doc/memory-landscape.md:62-72` - memory primitive taxonomy.
- `.resources/paperclip/doc/memory-landscape.md:117-151` - memory provider/control-plane recommendations.
- `.resources/paperclip/packages/mcp-server/src/tools.ts:224-281` - MCP agent self, inbox, issue, heartbeat-context tools.
- `.resources/paperclip/packages/mcp-server/src/tools.ts:409-518` - MCP approval, issue mutation, checkout, interaction, document tools.
- `.resources/paperclip/cli/src/index.ts:118-139` - CLI heartbeat invocation surface.
- `.resources/paperclip/cli/src/commands/heartbeat-run.ts:58-91` - CLI heartbeat run options.

## Transferable Patterns

- Model "agent soul" as a versioned harness-owned identity bundle, not as hidden prompt residue. AGH should persist agent self/profile/instructions/context policy separately from runs, then inject it per `task_runs` claim. Paperclip's `SOUL.md` + `HEARTBEAT.md` split is a useful artifact shape: one file for durable persona, one for per-wake operating procedure.
- Add explicit self and wake context hydration. Paperclip's first heartbeat step is `GET /api/agents/me` plus wake environment/context. AGH should provide equivalent CLI/HTTP/UDS calls such as "who am I?", "why did I wake?", "what run/task/network claim do I own?", and "what durable context should I continue from?"
- Use task-scoped session continuity. Paperclip's `agent_task_sessions` is directly relevant, but AGH should attach equivalent `session_key`, `session_params`, `context_snapshot`, `resume_from_run_id`, and `task_key` semantics to `task_runs` or a `task_run_sessions` table keyed from `task_runs`, not to a separate wake queue.
- Treat inbox as a query over durable work state. Paperclip's agent inbox is derived from assigned issues plus dependency readiness. AGH can compute agent inbox from `task_runs`, task ownership, blockers, mentions, approvals, network handoffs, and liveness escalations instead of creating an independent mailbox.
- Use durable relationship edges for coordination. Paperclip's blockers, parent/child issues, issue approvals, routines, and tree holds give agents a coordination graph that survives restarts. AGH can adapt this as task relationships and network coordination metadata while keeping runnable work in `task_runs`.
- Keep scheduler authority narrow. Paperclip's scheduler does too much by AGH standards because it can call wakeup/start paths. AGH should keep only wake/sweep/reconciliation portions: enqueue due runs, mark stale candidates, create liveness evaluation work, promote due retries, and let `ClaimNextRun` perform the only claim transition.
- Use output/liveness side channels that do not pressure ACP. Paperclip flushes last-output progress to DB at a bounded interval and stores full logs separately. AGH should avoid sending heartbeat/progress through ACP request/response paths; use daemon-observed process/tool/task signals, throttled durable progress rows, or explicit UDS/HTTP progress APIs.
- Classify progress from harness-observed durable effects. Paperclip's liveness classifier counts comments, document revisions, work products, activity events, and tool/action events as progress and discounts setup-only events. AGH should base "agent is alive/useful/stuck" on typed harness effects and run state, not merely model text.
- Make coordination agent-manageable on every required surface. Paperclip has HTTP, CLI, and MCP. AGH should cover CLI/HTTP/UDS for self identity, session reset, wake/resume, liveness decisions, inbox, blockers, approvals, and memory operations.

## Risks / Mismatches

- Paperclip's dual durable structures (`agent_wakeup_requests` plus `heartbeat_runs`) conflict with AGH's `task_runs` as the single durable work queue. Do not import that storage split; fold wake reason, source, idempotency, actor, coalescing, and context snapshot into `task_runs` or side tables that do not become a second queue.
- Paperclip's `enqueueWakeup` can immediately start queued runs via `startNextQueuedRunForAgent`; AGH's scheduler must not claim or start work. The only AGH analogue to Paperclip's `claimQueuedRun` should be `ClaimNextRun`.
- Paperclip stamps issue execution locks from heartbeat claim/checkout code. AGH should avoid parallel ownership fields that can drift from `task_runs`; run claim ownership should derive from the queue claim record and be projected outward, not owned by task records independently.
- Paperclip emits plugin domain events during run lifecycle. AGH's hook model is typed call-site dispatch, not an event bus. Transfer the call-site ideas (`run started`, `run finished`, `memory hydrate`, `liveness decision`) but keep typed hooks with explicit payload contracts.
- Paperclip's persona files are static onboarding assets. AGH needs agent-manageable and versioned identity/context surfaces through CLI/HTTP/UDS, with audit and config lifecycle, not only files baked into an instructions bundle.
- Paperclip's surfaces include HTTP/CLI/MCP, but no UDS pattern appeared in the inspected paths. AGH cannot stop at HTTP/CLI; local agents need UDS parity for daemon-managed operations.
- Paperclip's liveness uses stdout/stderr output as a key signal. For ACP agents, stdout may be the protocol transport, so AGH must avoid adding heartbeat chatter that competes with ACP framing or backpressure. Prefer daemon-side observation, sidecar progress sinks, or separate UDS/HTTP progress APIs.
- Paperclip's memory work is partly a plan/survey rather than fully implemented schema in the inspected code. Use its provider-neutral control-plane requirements as design input, not evidence of complete production behavior.
- Paperclip is company/org-chart centric. AGH's network model may need peer/network/task provenance beyond Paperclip's company/project/goal hierarchy, especially for cross-agent and cross-network orchestration.

## Open Questions

- Should AGH's "agent soul" be a new durable entity attached to an agent profile, or a versioned run-context bundle assembled from existing config, memory, capabilities, skills, and network identity at claim time?
- How should AGH represent task-scoped session continuity without creating a second queue: embedded fields on `task_runs`, a `task_run_sessions` table, or a broader `agent_context_sessions` table keyed by agent/task/network scope?
- What is the minimal liveness signal AGH can collect for ACP-backed agents without touching ACP stdout/stderr: process health, UDS progress API, log tail timestamps, tool-call events, task-run state transitions, or all of these?
- Which Paperclip coordination concepts should become AGH first-class primitives versus derived task metadata: blockers, approvals, issue-thread interactions, tree holds, routines, and mentions?
- `~/dev/knowledge/paperclip/` produced no files in the allowed read-only pass. Parent agent should confirm whether an alternate knowledge path exists if additional private notes are expected.

## Evidence

- `.resources/paperclip/server/src/onboarding-assets/ceo/SOUL.md:1-33`
- `.resources/paperclip/server/src/onboarding-assets/ceo/HEARTBEAT.md:5-84`
- `.resources/paperclip/packages/db/src/schema/agents.ts:14-36`
- `.resources/paperclip/packages/db/src/schema/agent_runtime_state.ts:5-21`
- `.resources/paperclip/packages/db/src/schema/agent_task_sessions.ts:6-39`
- `.resources/paperclip/packages/db/src/schema/agent_wakeup_requests.ts:5-26`
- `.resources/paperclip/packages/db/src/schema/heartbeat_runs.ts:6-80`
- `.resources/paperclip/packages/db/src/schema/issues.ts:21-63`
- `.resources/paperclip/packages/db/src/schema/issue_relations.ts:6-29`
- `.resources/paperclip/packages/db/src/schema/approvals.ts:5-27`
- `.resources/paperclip/packages/db/src/schema/issue_approvals.ts:7-22`
- `.resources/paperclip/packages/db/src/schema/issue_tree_holds.ts:7-38`
- `.resources/paperclip/packages/db/src/schema/issue_tree_hold_members.ts:8-33`
- `.resources/paperclip/packages/db/src/schema/routines.ts:20-113`
- `.resources/paperclip/packages/db/src/schema/heartbeat_run_watchdog_decisions.ts:7-33`
- `.resources/paperclip/server/src/services/heartbeat.ts:1446-1488`
- `.resources/paperclip/server/src/services/heartbeat.ts:2772-2866`
- `.resources/paperclip/server/src/services/heartbeat.ts:3967-4078`
- `.resources/paperclip/server/src/services/heartbeat.ts:4817-4887`
- `.resources/paperclip/server/src/services/heartbeat.ts:5528-5650`
- `.resources/paperclip/server/src/services/heartbeat.ts:6594-7282`
- `.resources/paperclip/server/src/services/heartbeat.ts:7775-7808`
- `.resources/paperclip/server/src/services/issues.ts:262-305`
- `.resources/paperclip/server/src/services/issues.ts:1923-1974`
- `.resources/paperclip/server/src/services/issues.ts:3098-3247`
- `.resources/paperclip/server/src/routes/issues.ts:2732-2803`
- `.resources/paperclip/server/src/routes/issues.ts:3401-3660`
- `.resources/paperclip/server/src/routes/agents.ts:1532-1579`
- `.resources/paperclip/server/src/routes/agents.ts:1688-1752`
- `.resources/paperclip/server/src/routes/agents.ts:2694-2800`
- `.resources/paperclip/server/src/routes/approvals.ts:136-224`
- `.resources/paperclip/server/src/routes/issue-tree-control.ts:75-204`
- `.resources/paperclip/server/src/services/issue-tree-control.ts:628-850`
- `.resources/paperclip/server/src/services/issue-tree-control.ts:1158-1184`
- `.resources/paperclip/server/src/services/recovery/service.ts:40-52`
- `.resources/paperclip/server/src/services/recovery/service.ts:582-670`
- `.resources/paperclip/server/src/services/recovery/service.ts:1059-1100`
- `.resources/paperclip/server/src/services/recovery/service.ts:1148-1228`
- `.resources/paperclip/server/src/services/run-liveness.ts:150-197`
- `.resources/paperclip/server/src/index.ts:672-783`
- `.resources/paperclip/doc/spec/agents-runtime.md:71-80`
- `.resources/paperclip/doc/memory-landscape.md:7-18`
- `.resources/paperclip/doc/memory-landscape.md:62-72`
- `.resources/paperclip/doc/memory-landscape.md:117-151`
- `.resources/paperclip/packages/mcp-server/src/tools.ts:224-281`
- `.resources/paperclip/packages/mcp-server/src/tools.ts:409-518`
- `.resources/paperclip/cli/src/index.ts:118-139`
- `.resources/paperclip/cli/src/commands/heartbeat-run.ts:58-91`

## Targeted Soul Exposure Addendum

Follow-up read-only subagent research focused specifically on `SOUL.md` exposure found that Paperclip treats `SOUL.md` as a companion Markdown file inside an agent instruction bundle, not as first-class runtime state. `AGENTS.md` remains the entry file; it references `SOUL.md` as the file that defines who the agent is and how it should act. The default CEO bundle contains `AGENTS.md`, `HEARTBEAT.md`, `SOUL.md`, and `TOOLS.md`; default non-CEO agents only receive `AGENTS.md` unless a custom bundle is supplied.

Paperclip adapters typically inject the entry instructions and a path directive that tells the model how to resolve sibling files. The sibling `SOUL.md` body is not automatically parsed into structured runtime context. Structured wake context is separate: wake payloads, issue state, liveness continuation, session handoff, and environment JSON are rendered by runtime services. Runtime/session state lives in agent, heartbeat run, task session, and issue tables.

Transfer to AGH: avoid Paperclip's weaker sibling-reference behavior. AGH should directly resolve optional `SOUL.md` into the agent profile/prompt path so the content is actually in scope when intended. Keep Paperclip's separation between managed identity content and structured wake/runtime context, and improve it with semantic validation, hashing/versioning of the full agent identity bundle, and CLI/HTTP/UDS inspection.

Additional evidence:

- `.resources/paperclip/server/src/services/default-agent-instructions.ts:3-26`
- `.resources/paperclip/server/src/onboarding-assets/ceo/AGENTS.md:53-59`
- `.resources/paperclip/server/src/onboarding-assets/ceo/SOUL.md:1-33`
- `.resources/paperclip/server/src/onboarding-assets/ceo/HEARTBEAT.md:5-85`
- `.resources/paperclip/server/src/services/agent-instructions.ts:114-131`
- `.resources/paperclip/server/src/services/agent-instructions.ts:685-723`
- `.resources/paperclip/packages/adapters/codex-local/src/server/execute.ts:516-626`
- `.resources/paperclip/packages/adapters/claude-local/src/server/execute.ts:364-390`
- `.resources/paperclip/server/src/services/heartbeat.ts:1757-1925`
- `.resources/paperclip/packages/db/src/schema/heartbeat_runs.ts:6-58`
