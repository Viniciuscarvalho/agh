# Agent Authored Context TechSpec

## Executive Summary

AGH will add an authored agent context layer composed of two optional files:

- `SOUL.md`: persona, identity, communication style, principles, constraints, and memory posture.
- `HEARTBEAT.md`: advisory wake and reentry policy for already eligible sessions.

The two artifacts are intentionally related in product shape but separate in runtime authority. Soul affects how an agent is introduced to a prompt. Heartbeat affects how an already live and wake-eligible session is reoriented when AGH sends a synthetic wake. Neither artifact owns task execution, task claiming, task lease heartbeat, session activity supervision, scheduler sweep, network greet presence, capabilities, provider configuration, or extension permissions.

The primary trade-off is coordination without authority merging. A single aggregate implementation program gives operators and agents one mental model for authored context, but AGH must keep storage, services, config, prompt behavior, and safety invariants explicit enough that `SOUL.md` cannot become a hidden `AGENT.md` and `HEARTBEAT.md` cannot become a second work queue.

MVP boundary: tasks generated from this aggregate implement the already approved Soul and Heartbeat specs in order: Soul foundation, Soul managed authoring, Soul session/task provenance, Heartbeat foundation, session health, Heartbeat managed authoring, Heartbeat wake integration, shared CLI/HTTP/UDS/Host API contracts, docs, and verification. Post-MVP work includes typed persona overlays, network-wide propagation, auto-spawned heartbeat sessions, heartbeat-only sessions, semantic liveness classification, richer web editors, and any cross-agent policy marketplace.

## Goals

- Implement the approved Soul design in [`_techspec_soul.md`](_techspec_soul.md).
- Implement the approved Heartbeat design in [`_techspec_heartbeat.md`](_techspec_heartbeat.md).
- Preserve `AGENT.md`, capabilities, config, `task_runs`, task-run lease heartbeat, session activity supervision, scheduler sweep, synthetic prompt plumbing, and AGH Network greet as separate authorities.
- Provide one coordinated implementation sequence for migrations, package boundaries, contracts, CLI, HTTP, UDS, Host API, docs, and QA.
- Make both artifacts agent-operable through deterministic, redacted, JSON-capable surfaces.
- Keep AGH extensibility complete: extensions, hooks, skills/capabilities, tools/resources, bundles, registries, bridge SDKs, MCP sidecars, and protocol docs must either gain explicit support or be listed as unaffected with evidence.
- Keep config lifecycle explicit for `[agents.soul]` and `[agents.heartbeat]`.

## Non-Goals

- Do not introduce a combined `authored_context` database table or runtime state bag.
- Do not make `SOUL.md` or `HEARTBEAT.md` required for agents.
- Do not let either file define provider, model, commands, tools, toolsets, capabilities, permissions, hooks, MCP servers, config, leases, task ownership, network membership, or scheduler behavior.
- Do not create work from `HEARTBEAT.md`, auto-claim work from a wake, auto-spawn sessions, or materialize heartbeat turns as `task_runs`.
- Do not change `ClaimNextRun`, `HeartbeatRunLease`, `ReleaseRunLease`, `CompleteRunLease`, or terminal run semantics.
- Do not replace `[session.supervision]` active prompt activity timers.
- Do not reinterpret AGH Network `greet` presence as local session health.
- Do not add a web-only implementation path. Web surfaces may render generated DTOs later, but runtime, CLI, HTTP, UDS, and Host API are the MVP authorities.

## Delete Targets

None. This is an additive alpha feature set. There are no compatibility shims, aliases, legacy migrations, or fallback readers to keep because the artifacts do not exist in the current runtime. The existing child specs remain normative and must not be deleted:

- [`_techspec_soul.md`](_techspec_soul.md)
- [`_techspec_heartbeat.md`](_techspec_heartbeat.md)

## Normative Sources And Precedence

This aggregate is the coordination spec for implementation order and cross-feature boundaries. It does not replace the child specs.

Precedence for implementation:

1. ADRs in [`adrs/`](adrs/) are authoritative for accepted decisions.
2. [`_techspec_soul.md`](_techspec_soul.md) is authoritative for Soul field-level behavior, DTOs, storage, prompt inclusion, refresh behavior, and managed authoring.
3. [`_techspec_heartbeat.md`](_techspec_heartbeat.md) is authoritative for Heartbeat field-level behavior, session health, wake policy, wake audit, and managed authoring.
4. This aggregate is authoritative for build order, shared boundaries, cross-feature tests, and task generation.

If an implementation agent finds a conflict, update the source ADR or child TechSpec first. Do not silently resolve conflicts inside code, docs, tests, or generated tasks.

## System Architecture

### Component Overview

| Component | Responsibility | Boundary |
| --- | --- | --- |
| Agent definition loader | Existing `AGENT.md`, executable authority, capabilities, provider defaults | Does not read authored wake policy |
| Soul resolver | Parse, validate, digest, and project optional `SOUL.md` | Persona only; no executable authority |
| Soul authoring service | Managed write/delete/history/rollback with CAS, revisions, atomic writes | Only writer for `SOUL.md` |
| Soul snapshot store | Immutable resolved Soul snapshots and authoring revisions | No task ownership or scheduler state |
| Session prompt builder | Compose existing prompt context plus optional Soul snapshot | Does not parse local files directly |
| Task claim integration | Attach opaque Soul provenance during `ClaimNextRun` | No file I/O and no claim decision changes |
| Heartbeat resolver | Parse, validate, digest, and project optional `HEARTBEAT.md` | Wake policy only; no liveness authority |
| Heartbeat authoring service | Managed write/delete/history/rollback with CAS, revisions, atomic writes | Only writer for `HEARTBEAT.md` |
| Session health service | Metadata-only health, presence, attachability, and wake eligibility | No prompt injection and no lease renewal |
| Heartbeat wake service | Evaluate latest policy plus session health and send synthetic wake if eligible | No `task_runs` creation, claim, release, or completion |
| Scheduler integration | Calls wake service only after normal eligibility checks | Never claims work for Heartbeat |
| API / UDS / CLI / Host API | Agent-operable management, status, diagnostics, and structured output | Shared DTOs and deterministic errors |
| Web generated contracts | Generated TypeScript and contract tests | No MVP editor unless backed by runtime surfaces |
| Site docs | Operator and extension-author docs | Not a runtime authority |

### Data Flow

```text
AGENT.md + capabilities + config
        |
        | existing agent authority
        v
Resolved agent definition
        |
        +--> optional SOUL.md resolver --> soul snapshot --> prompt/context/task provenance
        |
        +--> optional HEARTBEAT.md resolver --> heartbeat snapshot
                                                   |
session runtime --> session.health ---------------+
                                                   |
scheduler/manual wake/harness reentry --> wake service --> synthetic prompt
```

Soul and Heartbeat may coexist for the same agent. They do not import each other, do not share storage tables, and do not write each other's prompt sections.

## Architectural Boundaries

- `internal/config` owns config structs, defaults, overlays, validation, and docs examples for `[agents.soul]` and `[agents.heartbeat]`. It must not perform database writes or session mutations.
- `internal/soul` owns `SOUL.md` parsing, validation, digesting, path normalization, prompt projection, and managed authoring domain logic. If implementation chooses to keep this inside an existing package, the same ownership boundary still applies.
- `internal/heartbeat` owns `HEARTBEAT.md` parsing, validation, digesting, path normalization, wake policy resolution, wake decision logic, and managed authoring domain logic. It must not import `internal/task` claim internals.
- `internal/store/globaldb` owns migration v12 for Soul and migration v13 for Heartbeat/session health/wake audit. No `EnsureSchema` reconciliation is allowed for these columns or tables.
- `internal/session` consumes injected Soul and Heartbeat interfaces for prompt/session integration. It owns prompt-gate serialization for active prompt races and metadata-only session health updates.
- `internal/task` remains the sole owner of task-run claim, lease, release, completion, failure, and `task_runs` mutation semantics. It may persist Soul provenance during `ClaimNextRun`; it must not read `HEARTBEAT.md`.
- `internal/scheduler` may call Heartbeat wake evaluation after normal eligibility checks. It must not claim work, create task runs, or treat wake audit rows as queue entries.
- `internal/situation` renders compact authored-context projections for `/api/agent/context`. It must not expose full Soul or Heartbeat bodies in compact context.
- `internal/api/contract` owns DTOs for both features. OpenAPI, generated TypeScript, and contract parity tests must co-ship with DTO changes.
- `internal/api/core`, HTTP handlers, UDS handlers, and `cmd/agh` must route through the same services and DTOs. No transport-specific parser, validator, or response shape is allowed.
- `internal/extension` exposes Host API actions through explicit grants. Extensions must not bypass Soul or Heartbeat authoring services.
- `internal/hooks` may observe bounded hook payloads and request Host API actions when granted. Hooks must not receive raw claim tokens, full prompt transcripts, or unmanaged file mutation powers.
- `internal/daemon` remains the composition root. Leaf packages must not import daemon wiring or construct duplicate stores.
- `web/` consumes generated contracts only. It must not duplicate validation rules or parse local files.
- `packages/site` documents runtime truth, CLI examples, extension contracts, and config keys. It is not an implementation fallback.
- `internal/network` remains out of scope except docs that AGH Network greet presence is separate from session health and authored context.

No child package may import both runtime composition and transport packages to work around these boundaries. No Soul package may import Heartbeat package internals, and no Heartbeat package may import Soul package internals.

## Implementation Design

### Core Interfaces

The concrete child service signatures in the Soul and Heartbeat specs remain normative. The aggregate runtime should expose a narrow composition contract so session, task, scheduler, and API code depend on behavior rather than file parsing.

```go
type AuthoredContextRuntime interface {
	ResolveSoulForSession(ctx context.Context, req SoulSessionResolveRequest) (*SessionSoulSnapshot, error)
	CaptureSoulForClaim(ctx context.Context, req SoulClaimProvenanceRequest) (*SoulClaimProvenance, error)
	ResolveHeartbeatForWake(ctx context.Context, req HeartbeatWakeRequest) (*HeartbeatWakeResult, error)
	GetSessionHealth(ctx context.Context, req SessionHealthGetRequest) (*SessionHealth, error)
}
```

Shared transport wiring should keep the managed services explicit:

```go
type AuthoredContextSurfaces struct {
	SoulAuthoring      SoulAuthoringService
	HeartbeatAuthoring HeartbeatAuthoringService
	HeartbeatWake      HeartbeatWakeService
	SessionHealth      SessionHealthService
}
```

These aggregate types are composition and test seams only. They are not a new package mandate and must not hide the child specs' concrete service contracts.

### Data Models

Use side tables for queryable, invariant-bearing state. Use JSON only for bounded opaque projections explicitly called out by the child specs.

Soul owns migration v12 in `agh.db`:

| Column | Purpose |
| --- | --- |
| `agent_soul_snapshots.id` | Immutable resolved Soul snapshot id |
| `agent_soul_snapshots.workspace_id` | Workspace scope |
| `agent_soul_snapshots.agent_name` | Canonical agent scope |
| `agent_soul_snapshots.source_path` | Resolved workspace-relative `SOUL.md` path |
| `agent_soul_snapshots.digest` | Canonical content/profile digest |
| `agent_soul_snapshots.profile_json` | Validated structured persona profile |
| `agent_soul_snapshots.body` | Bounded narrative body |
| `agent_soul_snapshots.truncated` | Whether configured projection limits truncated content |
| `agent_soul_snapshots.created_at` | Snapshot creation time |
| `agent_soul_revisions.*` | Managed authoring history for put/delete/rollback |
| `sessions.soul_snapshot_id` | Snapshot applied at session start |
| `sessions.soul_digest` | Fast provenance/debug lookup |
| `sessions.parent_soul_digest` | Spawn lineage metadata only |

Heartbeat owns migration v13 in `agh.db`:

| Column | Purpose |
| --- | --- |
| `agent_heartbeat_snapshots.id` | Immutable resolved Heartbeat policy snapshot id |
| `agent_heartbeat_snapshots.workspace_id` | Workspace scope |
| `agent_heartbeat_snapshots.agent_name` | Canonical agent scope |
| `agent_heartbeat_snapshots.source_path` | Resolved workspace-relative `HEARTBEAT.md` path |
| `agent_heartbeat_snapshots.schema_version` | Snapshot schema version |
| `agent_heartbeat_snapshots.digest` | Content plus resolved config digest |
| `agent_heartbeat_snapshots.config_digest` | Canonical digest of config subset used to resolve policy |
| `agent_heartbeat_snapshots.body` | Normalized bounded Markdown body |
| `agent_heartbeat_snapshots.frontmatter_json` | Strict parsed frontmatter |
| `agent_heartbeat_snapshots.resolved_json` | Bounded resolved wake policy |
| `agent_heartbeat_snapshots.diagnostics_json` | Validation diagnostics |
| `agent_heartbeat_revisions.*` | Managed authoring history for write/delete/rollback |
| `session_health.*` | Metadata-only session state, health, attachability, and wake eligibility |
| `agent_heartbeat_wake_state.*` | Per-session cooldown/coalescing summary |
| `agent_heartbeat_wake_events.*` | Retained wake audit events with expiry |

Side-table vs JSON decision:

- Soul snapshots and revisions are typed side tables because they are auditable, reusable, and referenced by sessions and task claim provenance.
- Heartbeat snapshots, revisions, session health, wake state, and wake events are typed side tables because they drive eligibility, coalescing, retention, and deterministic diagnostics.
- Existing `task_runs.metadata_json`, mapped to Go field `task.Run.Metadata json.RawMessage`, may store only opaque Soul provenance references captured during `ClaimNextRun`.
- No Heartbeat data may be stored in `task_runs.metadata_json`.
- No ownership, lease, scheduler, capability, refresh, wake eligibility, authoring revision, raw token, or claim decision state may be stored in JSON metadata.
- If a later task needs to query or enforce a field, add a typed column or side table through a numbered migration instead of expanding a JSON bag.

No aggregate table is added in MVP. A combined table would blur authorities and create a migration surface that neither child spec needs.

### Public Interfaces / Types

Soul public surfaces:

| Surface | Operations |
| --- | --- |
| HTTP | `GET /api/agent/context`, `GET /api/agent/soul`, `GET /api/agents/{agent_name}/soul`, `POST /api/agent/soul/validate`, `PUT /api/agents/{agent_name}/soul`, `DELETE /api/agents/{agent_name}/soul`, `GET /api/agents/{agent_name}/soul/history`, `POST /api/agents/{agent_name}/soul/rollback`, `POST /api/sessions/{session_id}/soul/refresh` |
| UDS | `agent.context.get`, `agent.soul.inspect`, `agent.soul.inspectDefinition`, `agent.soul.validate`, `agent.soul.put`, `agent.soul.delete`, `agent.soul.history`, `agent.soul.rollback`, `session.soul.refresh` |
| CLI | `agh agent context`, `agh agent soul inspect`, `agh agent soul validate`, `agh agent soul write`, `agh agent soul delete`, `agh agent soul history`, `agh agent soul rollback`, `agh session soul refresh` |
| Host API | Read, validate, write, delete, history, rollback, and refresh actions gated by explicit grants |

Heartbeat public surfaces:

| Surface | Operations |
| --- | --- |
| HTTP | `GET /api/agents/{agent_name}/heartbeat`, `POST /api/agents/{agent_name}/heartbeat/validate`, `PUT /api/agents/{agent_name}/heartbeat`, `DELETE /api/agents/{agent_name}/heartbeat`, `GET /api/agents/{agent_name}/heartbeat/history`, `POST /api/agents/{agent_name}/heartbeat/rollback`, `GET /api/agents/{agent_name}/heartbeat/status`, `POST /api/agents/{agent_name}/heartbeat/wake`, `GET /api/sessions/{session_id}/health`, `GET /api/sessions/{session_id}/status`, `GET /api/sessions/{session_id}/inspect`, session list `include_health=true` |
| UDS | Shared DTOs mirroring HTTP routes, including agent-scoped convenience methods for active sessions |
| CLI | `agh agent heartbeat inspect`, `agh agent heartbeat validate`, `agh agent heartbeat write`, `agh agent heartbeat delete`, `agh agent heartbeat history`, `agh agent heartbeat rollback`, `agh agent heartbeat status`, `agh agent heartbeat wake`, `agh session health`, `agh session status`, `agh session inspect` |
| Host API | Policy read/write/delete/history/rollback/status/wake plus session health read actions gated by explicit grants |

Mutation DTOs use body-level `expected_digest` compare-and-swap. HTTP `If-Match` is intentionally rejected for these authoring APIs so CLI, HTTP, UDS, Host API, and generated SDKs share one deterministic CAS shape.

## Safety Invariants

1. `task_runs` remains the only durable executable work queue.
2. `ClaimNextRun` remains the only authoritative primitive that claims work.
3. `HeartbeatRunLease` remains the task-run lease heartbeat primitive and never reads `SOUL.md` or `HEARTBEAT.md`.
4. `SOUL.md` is persona and identity only; it cannot define capabilities, provider config, permissions, task ownership, scheduler policy, session health, or network presence.
5. `HEARTBEAT.md` is wake and reentry policy only; it cannot define liveness, task ownership, task leases, scheduler queues, or recurring model loops.
6. Session health is metadata-only; it cannot inject prompts, renew leases, or create task runs.
7. Wake state and wake events are audit/coalescing records, not claimable queue rows.
8. Scheduler integration may call `HeartbeatWakeService`; it must not call `ClaimNextRun` because of `HEARTBEAT.md`.
9. Synthetic wake prompts must tell agents to inspect context and use normal task APIs before doing work.
10. Raw `claim_token` values, token hashes, secrets, full prompt transcripts, and provider credentials must never enter Soul snapshots, Heartbeat snapshots, context payloads, task metadata, logs, hooks, memory, channels, API responses, CLI output, or docs examples.
11. Every Soul and Heartbeat mutation goes through the corresponding managed authoring service.
12. Every write/delete/rollback against an existing authored file requires `expected_digest`; stale writes fail without persistence.
13. Every successful authoring mutation writes a revision row before returning success.
14. Active task runs reject Soul refresh with `409`.
15. Heartbeat wake dispatch is serialized with the session prompt gate; an active-prompt race records `session_prompt_active_race` and does not inject another prompt.
16. Invalid `SOUL.md` fails closed for affected agent profile loading and reports diagnostics.
17. Invalid `HEARTBEAT.md` disables wake policy for that agent and reports diagnostics without making the session unhealthy by itself.
18. Extensions, hooks, tools, resources, bundles, bridge SDKs, MCP sidecars, and web code must not bypass managed services or write authored files directly.
19. Migrations v12 and v13 are numbered global DB migrations; `EnsureSchema`-style reconciliation is forbidden.
20. AGH Network greet presence is never used as proof of local session health or wake eligibility.

## Prompt And Runtime Behavior

Prompt construction order for normal turns:

1. Existing agent definition and provider/system instructions.
2. Optional resolved Soul projection, when valid and enabled.
3. Runtime situation context, task context, channel context, inbox, memory, peer roster, capabilities, and limits.

`HEARTBEAT.md` does not participate in normal prompts. It contributes only to synthetic wake prompts created by Heartbeat wake service after session health and policy gates pass.

Synthetic wake prompt behavior:

- Uses the latest valid Heartbeat snapshot at wake-decision time.
- Includes no raw claim token or claim-token-derived text.
- Names the wake reason and policy snapshot id in bounded metadata.
- Instructs the agent to inspect `/agent/context`, session state, inbox, and task APIs before acting.
- Does not imply there is claimable work.
- Does not renew task-run leases.
- Does not bypass `[session.supervision]`.

Soul session behavior:

- Session start resolves and snapshots Soul.
- Task claim captures Soul provenance through `ClaimNextRun` without file I/O inside the claim transaction.
- Explicit Soul refresh is allowed only for idle sessions that satisfy the child spec checks.
- Spawned sessions resolve the target agent's own Soul; parent Soul digest is provenance only.

Heartbeat session behavior:

- Session health updates are metadata-only and maintained independently from `HEARTBEAT.md`.
- Wake evaluation consumes session health; it does not implement session liveness.
- Heartbeat has no explicit session refresh surface in MVP.

## Integration Points

| Surface | Integration |
| --- | --- |
| `internal/config` | Add `[agents.soul]` and `[agents.heartbeat]` structs, defaults, overlay behavior, validation, and docs examples |
| `internal/store/globaldb` | Add v12 and v13 migrations plus fresh DB, reopen, cascade, and retention tests |
| `internal/session` | Prompt inclusion, session Soul refs, session health, prompt-gate serialization, synthetic wake delivery |
| `internal/task` | Soul provenance only during `ClaimNextRun`; no Heartbeat reads |
| `internal/scheduler` | Wake-service call after existing eligibility; no claim or queue semantics |
| `internal/situation` | Compact `soul` and heartbeat/status projections in agent context where specified |
| `internal/api/contract` | DTOs and redaction contracts for Soul, Heartbeat, and session health |
| `internal/api/core` | Shared handlers/services for HTTP and UDS |
| `cmd/agh` | Agent-operable CLI verbs with `--json`, deterministic errors, and workspace targeting |
| `internal/extension` | Host API actions and grant enforcement for read/write/wake/status operations |
| `internal/hooks` | Bounded hook payloads for authoring and wake events, no sensitive payloads |
| `openapi/agh.json` | Regenerated API contract |
| `web/src/generated/agh-openapi.d.ts` | Regenerated TypeScript contract |
| `sdk/typescript` | Generated or manually maintained SDK types/actions where applicable |
| `packages/site` | Runtime docs, config docs, CLI docs, extension docs, and concept docs |

## Extensibility Integration Plan

| Surface | Soul Impact | Heartbeat Impact | Required Action |
| --- | --- | --- | --- |
| Extension manifests | Add explicit grants for Soul inspect/validate/write/delete/history/rollback/refresh | Add explicit grants for Heartbeat inspect/validate/write/delete/history/rollback/status/wake and session health read | Update manifest schema/docs/tests; no implicit broad grants |
| Host API | Expose managed authoring and read actions only through services | Expose managed authoring, status, wake, and health actions only through services | Add parity tests for allowed/denied actions |
| Hooks | Emit redacted authoring and refresh events | Emit redacted authoring, wake, and health-transition events with cadence limits | Add bounded payload structs and tests; no raw bodies when not required |
| Skills/capabilities | No capability declaration from Soul | No capability declaration from Heartbeat | Docs must state artifacts cannot grant capabilities |
| Tools/resources | Tool resources may inspect through Host API grants; no direct file writes | Tool resources may inspect/wake through Host API grants; no queue mutation | Add native tool/resource docs if surfaced |
| Bundles | Bundles may include optional `SOUL.md` files and config examples | Bundles may include optional `HEARTBEAT.md` files and config examples | Validate bundle install through managed services when mutation is runtime-managed |
| Registries/marketplace | Registry metadata may advertise authored-context support | Registry metadata may advertise wake-policy support | Do not treat registry metadata as runtime authority |
| Bridge SDKs | Add generated types and action wrappers for Soul | Add generated types and action wrappers for Heartbeat/session health | Co-ship SDK docs and type tests |
| MCP sidecars | May call Host API with explicit grants | May call Host API with explicit grants | No filesystem bypass; add negative tests |
| AGH Network/protocol docs | No network propagation in MVP | No network propagation in MVP | Document that peer greet is separate from authored context |
| Public docs/examples | Add authoring, validation, prompt, and provenance examples | Add wake policy, session health, status, and wake examples | Docs must match generated CLI/API behavior |

## Agent Manageability Plan

Agents and operators must be able to inspect, validate, mutate, roll back, and diagnose authored context without using internal Go calls or web-only paths.

Required CLI behavior:

- Every inspect/status/history command supports structured output with `--json`.
- Mutation commands return the new digest, previous digest, revision id, diagnostics, and redacted actor/origin metadata.
- CAS conflicts return deterministic machine-readable errors.
- `agh session heartbeat` must not exist in MVP because it conflates liveness with authored Heartbeat policy. Use `agh session health`, `agh session status`, and `agh session inspect`.

Required HTTP/UDS behavior:

- HTTP and UDS route handlers call the same `internal/api/core` logic and contract DTOs.
- UDS does not define shortcut parsers or alternate output fields.
- API responses redact secrets, raw claim tokens, and full prompt transcripts.
- Session health and wake status include deterministic `ineligibility_reason` / `reason` enums.

Required repair/operation behavior:

- Agents can validate candidate files before writing.
- Agents can inspect current digests before mutation.
- Agents can list bounded history and roll back to a prior revision.
- Agents can inspect session health before attempting wake.
- Agents can request manual wake and receive `sent`, `skipped`, `coalesced`, `rate_limited`, or `failed` with a closed reason.

E2E parity checks must compare CLI, HTTP, and UDS for representative Soul, Heartbeat, and session health flows.

## Config Lifecycle

Add two config sections. Config remains the authority for limits and cadence. Authored files may express preferences only within config bounds.

Soul config:

```toml
[agents.soul]
enabled = true
max_body_bytes = 32768
context_projection_bytes = 4096
```

Heartbeat config:

```toml
[agents.heartbeat]
enabled = true
max_body_bytes = 32768
context_projection_bytes = 4096
min_wake_interval = "5m"
max_wakes_per_hour = 6
active_session_only = true
session_health_stale_after = "2m"
session_health_hook_min_interval = "30s"
wake_event_retention = "168h"
```

Config rules:

- Defaults must be safe, deterministic, and documented in generated and site docs.
- Zero-value semantics must be explicit in config structs and tests.
- Workspace overlays must merge predictably with global config.
- Invalid values fail config validation with deterministic errors.
- Runtime reload behavior must be documented. If a setting requires daemon restart, the docs and CLI diagnostics must say so.
- `HEARTBEAT.md` cannot redefine `[session.supervision]`, task lease heartbeat, scheduler sweep, or network greet intervals.
- `SOUL.md` cannot redefine provider, command, permission, capability, or hook config.
- `config_digest` must be part of Heartbeat snapshot digesting where the Heartbeat child spec requires it.

## Web/Docs Impact

Web MVP impact:

- Regenerate `web/src/generated/agh-openapi.d.ts`.
- Add or update contract tests that generated types include Soul, Heartbeat, and session health DTOs.
- Do not add a Soul or Heartbeat editor UI in MVP unless a later task adds a runtime-backed product surface. A UI without the runtime authoring APIs is incomplete and must not be shipped.

Docs impact:

- Add `packages/site` runtime docs for optional `SOUL.md` and managed authoring.
- Add `packages/site` runtime docs for optional `HEARTBEAT.md`, session health, wake status, and manual wake.
- Update config docs for `[agents.soul]` and `[agents.heartbeat]`.
- Update CLI docs after command generation.
- Update extension/Host API docs for grants and managed actions.
- Update protocol docs to state AGH Network greet is independent from authored context and session health.
- Reference competitor research paths from the analysis directory when explaining design rationale.

Generated artifacts:

- Regenerate `openapi/agh.json`.
- Regenerate `web/src/generated/agh-openapi.d.ts`.
- Update TypeScript SDK contracts if the generated contract surface feeds SDK types.
- Run `make cli-docs` if CLI command docs are generated from cobra metadata.

## Impact Analysis

| Component | Impact Type | Description and Risk | Required Action |
| --- | --- | --- | --- |
| `internal/config` | Modified | New config sections and validation; risk of ambiguous zero values | Add tests for defaults, overlays, invalid values, docs examples |
| `internal/store/globaldb` | Modified | Two numbered migrations; risk of ordering drift | Add v12 and v13 migrations with fresh DB and reopen tests |
| `internal/soul` or equivalent | New | Soul parsing, validation, authoring, snapshots | Implement from child spec and keep authority narrow |
| `internal/heartbeat` or equivalent | New | Heartbeat parsing, validation, authoring, wake policy | Implement from child spec and keep no-queue invariant |
| `internal/session` | Modified | Prompt inclusion, health, prompt gate, synthetic wake | Add active prompt race and idle health tests |
| `internal/task` | Modified | Soul claim provenance only | Add no-file-I/O and no-claim-semantic-change tests |
| `internal/scheduler` | Modified | Calls wake service after normal eligibility | Add no-claim-from-heartbeat tests |
| `internal/api/contract` | Modified | New DTOs | Regenerate contracts and add parity tests |
| `cmd/agh` | Modified | New agent/session commands | Add JSON output and deterministic error tests |
| `internal/extension` | Modified | New Host API grants/actions | Add authorization and bypass-negative tests |
| `web/` | Modified generated files | Generated DTO updates only in MVP | Typecheck and contract tests |
| `packages/site` | Modified | Runtime, config, CLI, and extension docs | Build site and verify docs names |

## Testing Approach

### Unit Tests

- Soul parser accepts valid strict frontmatter/body and rejects forbidden operational fields.
- Soul authoring service validates before atomic writes, enforces `expected_digest`, writes revisions, and preserves active-session invariants.
- Heartbeat parser accepts valid wake policy and rejects liveness, queue, task, lease, provider, and scheduler declarations.
- Heartbeat authoring service validates before atomic writes, enforces `expected_digest`, writes revisions, and rejects `If-Match`-only mutation paths.
- Session health service computes `idle`, `prompting`, `stopped`, `detached`, `healthy`, `degraded`, `stale`, `dead`, and `unknown` states without prompt injection.
- Wake service returns closed reasons and never calls task claim APIs.
- Config defaults, overlays, invalid values, and docs examples are tested for both sections.

### Integration Tests

- Migration v12 fresh DB, reopen, uniqueness, cascade, and session-column behavior.
- Migration v13 fresh DB, reopen, uniqueness, retention, cascade, and wake-state primary-key behavior.
- Soul + Heartbeat can coexist for one agent without shared tables or prompt section bleed.
- Invalid `SOUL.md` blocks affected agent profile/session behavior while Heartbeat inspect/status remains independently diagnosable.
- Invalid `HEARTBEAT.md` disables wake policy while Soul prompt inclusion remains independently diagnosable.
- `ClaimNextRun` captures Soul provenance without file I/O and without changing claim ordering, lease, or token behavior.
- Scheduler/manual wake evaluates latest valid Heartbeat snapshot and records wake audit without creating a task run.
- Prompt-gate race records `session_prompt_active_race` and skips duplicate prompt injection.
- CLI, HTTP, and UDS return equivalent DTOs for inspect, validate, write, delete, history, rollback, status, health, and wake.
- Host API grant tests prove read-only, write, rollback, wake, and health permissions are separate.
- Extension, hook, MCP sidecar, tool/resource, and bundle negative tests prove no direct file-write bypass exists.

### Verification

Run these before completion:

```bash
python3 .agents/skills/cy-spec-preflight/scripts/check-techspec-markers.py .compozy/tasks/agent-soul/_techspec.md
make codegen
make codegen-check
make cli-docs
make verify
```

During implementation, run narrower package tests close to each step, but `make verify` remains the blocking final gate.

## Implementation Steps

1. Add Soul config/domain foundation.
   - Depends on: none.
   - Includes `[agents.soul]`, parser, strict validation, digesting, projection limits, diagnostics, and unit tests.
2. Add Soul migration v12 and stores.
   - Depends on: step 1.
   - Includes snapshots, revisions, session columns, global DB tests, and no `EnsureSchema`.
3. Add Soul managed authoring.
   - Depends on: steps 1-2.
   - Includes validate/write/delete/history/rollback, CAS, atomic writes, revision audit, and Host API grant boundaries.
4. Add Soul runtime integration.
   - Depends on: steps 1-3.
   - Includes prompt inclusion, `/agent/context` compact projection, full read model, session refresh, spawn semantics, and task claim provenance.
5. Add Heartbeat config/domain foundation.
   - Depends on: none, but must not reuse Soul types beyond generic helpers.
   - Includes `[agents.heartbeat]`, parser, strict validation, digest/config digest, policy resolution, diagnostics, and unit tests.
6. Add Heartbeat migration v13 and stores.
   - Depends on: step 5 and completion of migration v12 ordering.
   - Includes policy snapshots, revisions, `session_health`, wake state, wake events, retention fields, and global DB tests.
7. Add session health primitive.
   - Depends on: step 6.
   - Includes metadata-only presence/health updates, stale detection, attachability, wake eligibility, and session inspect/status DTOs.
8. Add Heartbeat managed authoring.
   - Depends on: steps 5-6.
   - Includes inspect/validate/write/delete/history/rollback/status, CAS, atomic writes, revisions, and Host API grant boundaries.
9. Add Heartbeat wake integration.
   - Depends on: steps 5-8.
   - Includes scheduler/manual/harness-reentry wake evaluation, latest-snapshot selection, cooldown/coalescing, prompt-gate serialization, synthetic prompt delivery, and wake audit.
10. Add shared API, UDS, CLI, and Host API parity.
    - Depends on: steps 3-4 and 7-9.
    - Includes contract DTOs, route handlers, cobra commands, JSON outputs, deterministic errors, redaction, and grant enforcement.
11. Regenerate contracts and generated clients.
    - Depends on: step 10.
    - Includes OpenAPI, TypeScript generated contracts, SDK impacts, and contract tests.
12. Update docs.
    - Depends on: steps 10-11.
    - Includes site docs, config docs, CLI docs, extension docs, AGH Network boundary docs, and competitor-research references.
13. Add cross-feature QA.
    - Depends on: steps 1-12.
    - Includes coexistence, independence, authority-bleed, transport parity, extension bypass, prompt redaction, migration ordering, and wake race tests.
14. Run final verification.
    - Depends on: steps 1-13.
    - Includes marker check, codegen check, CLI docs check, and `make verify`.

## Development Sequencing

### Build Order

1. Soul-only foundation and tests.
2. Soul runtime and manageability.
3. Heartbeat-only foundation and tests.
4. Session health and Heartbeat wake behavior.
5. Shared surfaces and generated contracts.
6. Docs and extension ecosystem updates.
7. Cross-feature QA and final verification.

This order keeps the already approved Soul work independent while reserving migration v13 and session health work for the Heartbeat package. It also prevents a partial Heartbeat implementation from reaching scheduler code before the no-queue and prompt-gate invariants are testable.

### Technical Dependencies

- Existing global DB migration registry in `internal/store/globaldb`.
- Existing API contract and OpenAPI generation flow.
- Existing UDS route parity patterns.
- Existing CLI command and JSON output patterns.
- Existing extension Host API grant enforcement.
- Existing session synthetic prompt path and prompt activity supervision.
- Existing scheduler eligibility path.
- Existing task `ClaimNextRun` and lease manager tests.

## Monitoring and Observability

Soul metrics and logs:

- Snapshot creation count by result.
- Authoring mutation count by action/result.
- Validation failure count by diagnostic code.
- Refresh count by result and rejection reason.
- Session start with Soul digest, redacted and bounded.
- Task claim provenance attached count, without claim token values.

Heartbeat metrics and logs:

- Snapshot creation count by result.
- Authoring mutation count by action/result.
- Session health state transitions by state/health.
- Wake attempts by source/result/reason.
- Wake latency histogram from decision start to synthetic prompt enqueue.
- Coalesced and rate-limited wake counts.
- Prompt-gate race count by `session_prompt_active_race`.

Observability rules:

- Logs use structured fields and redacted values.
- No raw prompt body, raw authored body beyond configured diagnostic snippets, secrets, or claim tokens in logs.
- Metrics labels use bounded enums, not free-form file paths or user text.
- Wake audit retention follows `[agents.heartbeat].wake_event_retention`.

## Technical Considerations

### Key Decisions

- Decision: Keep Soul and Heartbeat as sibling optional authored files.
  - Rationale: Authoring ergonomics improve without changing `AGENT.md` authority.
  - Trade-off: More surfaces to document and test.
  - Alternatives rejected: merging into `AGENT.md`, generic `context.md`, or extension-only metadata.
- Decision: Use typed side tables and numbered migrations.
  - Rationale: Snapshots, revisions, session health, and wake audit are queryable and invariant-bearing.
  - Trade-off: More schema and migration work.
  - Alternatives rejected: JSON metadata bags or file-only runtime state.
- Decision: Use managed authoring for both artifacts in MVP.
  - Rationale: Agents and extensions must manage the feature through runtime surfaces, not hidden filesystem writes.
  - Trade-off: More CLI/API/UDS/Host API work in MVP.
  - Alternatives rejected: read-only MVP or UI-only authoring.
- Decision: Keep Heartbeat wake policy separate from liveness.
  - Rationale: Session health should be metadata-only and reliable without model calls.
  - Trade-off: Heartbeat needs a session health primitive before wake behavior is useful.
  - Alternatives rejected: recurring model pings, Paperclip-style dual wake queues, and OpenClaw-style unpersisted runner-only design.

### Known Risks

- Risk: Implementation may blur `HEARTBEAT.md` with task-run lease heartbeat.
  - Mitigation: Tests must prove `HeartbeatRunLease` and `ClaimNextRun` never read Heartbeat policy.
- Risk: Soul prompt inclusion may drift into capability or permission authority.
  - Mitigation: Strict validation rejects operational declarations and forbidden sections.
- Risk: Managed authoring across CLI/HTTP/UDS/Host API may drift.
  - Mitigation: Shared DTOs, shared core handlers, and parity tests.
- Risk: Session health may be treated as a prompt event.
  - Mitigation: Metadata-only service tests and no model-call assertions.
- Risk: Generated docs/types drift from runtime behavior.
  - Mitigation: Codegen checks, CLI docs generation, site build, and contract tests in `make verify`.

## Assumptions And Defaults

- No `_prd.md` exists for this task; the source requirements are the user conversation, research artifacts, ADRs, and approved child TechSpecs.
- The exact original `<context>` payload from the first request is not visible; the approved decisions in the conversation and ADRs supersede that missing text.
- Local runtime is the MVP scope. AGH Network propagation of Soul or Heartbeat is post-MVP.
- Existing alpha posture allows hard additive schema changes through numbered migrations with no legacy compatibility shims.
- `SOUL.md` and `HEARTBEAT.md` are optional. Missing files produce explicit inactive/missing read models, not errors.
- Invalid `SOUL.md` and invalid `HEARTBEAT.md` fail differently because they have different authorities: Soul fails the affected agent profile; Heartbeat disables wake policy and reports diagnostics.
- Config defaults listed here may be refined during implementation only if the child specs and config docs are updated in the same change.
- The aggregate spec should drive task generation. Implementing agents must still read both child TechSpecs and referenced competitor analysis files.

## Reference Research

- [`analysis/analysis_agh_heartbeat.md`](analysis/analysis_agh_heartbeat.md) - AGH heartbeat/liveness authority mapping.
- [`analysis/analysis_openclaw_heartbeat.md`](analysis/analysis_openclaw_heartbeat.md) - OpenClaw heartbeat runner and `HEARTBEAT.md` patterns.
- [`analysis/analysis_hermes_heartbeat.md`](analysis/analysis_hermes_heartbeat.md) - Hermes task-run heartbeat and liveness separation.
- [`analysis/analysis_paperclip_heartbeat.md`](analysis/analysis_paperclip_heartbeat.md) - Paperclip wake queue and heartbeat run trade-offs.
- [`analysis/analysis_openclaw.md`](analysis/analysis_openclaw.md) - OpenClaw `SOUL.md` prompt inclusion and identity separation.
- [`analysis/analysis_hermes.md`](analysis/analysis_hermes.md) - Hermes prompt snapshot and `SOUL.md` scanning behavior.
- [`analysis/analysis_paperclip.md`](analysis/analysis_paperclip.md) - Paperclip companion instruction-bundle model.
- [`analysis/analysis_claude-code.md`](analysis/analysis_claude-code.md) - Related agent instruction patterns.
- [`analysis/analysis_openfang.md`](analysis/analysis_openfang.md) - Related agent configuration patterns.
- [`analysis/analysis_goclaw.md`](analysis/analysis_goclaw.md) - Related agent runtime patterns.
- [`analysis/analysis_multica.md`](analysis/analysis_multica.md) - Related multi-agent context patterns.
- [`analysis/analysis_acpx.md`](analysis/analysis_acpx.md) - Related ACP integration patterns.
- [`analysis/analysis_harnss.md`](analysis/analysis_harnss.md) - Related harness patterns.
- [`analysis/analysis_opencode.md`](analysis/analysis_opencode.md) - Related agent runtime patterns.

## Architecture Decision Records

- [ADR-001: Treat SOUL.md as an Optional Persona Artifact](adrs/adr-001.md) - `SOUL.md` is authored persona/identity only and stays subordinate to `AGENT.md`.
- [ADR-002: Expose Resolved Soul Through Prompt and Read Models](adrs/adr-002.md) - Soul is injected deterministically and exposed through compact/full read models.
- [ADR-003: Snapshot Resolved Soul at Session Start and Task Claim](adrs/adr-003.md) - Soul provenance is snapshotted for sessions and task claims without runtime drift.
- [ADR-004: Do Not Implicitly Inherit Parent Soul in Spawned Sessions](adrs/adr-004.md) - Spawned sessions resolve the target agent's own Soul.
- [ADR-005: Defer HEARTBEAT.md to a Separate Runtime Policy Spec](adrs/adr-005.md) - Soul and Heartbeat are separate design scopes.
- [ADR-006: Provide Managed Soul Authoring In V1](adrs/adr-006.md) - Soul write/delete/history/rollback are managed runtime operations in MVP.
- [ADR-007: Treat HEARTBEAT.md as Advisory Wake Policy](adrs/adr-007.md) - Heartbeat guides synthetic wake and does not implement liveness or ownership.
- [ADR-008: Persist Heartbeat Policy Snapshots and Wake Audit Without a Queue](adrs/adr-008.md) - Heartbeat uses typed snapshots/revisions/wake audit, not queue rows.
- [ADR-009: Separate Session Health From HEARTBEAT.md](adrs/adr-009.md) - Session health is metadata-only runtime state consumed by wake policy.
- [ADR-010: Provide Managed Heartbeat and Session Health Surfaces in MVP](adrs/adr-010.md) - Heartbeat and health are agent-operable through CLI/HTTP/UDS/Host API.
- [ADR-011: Make Config the Authority for Cadence and Wake Limits](adrs/adr-011.md) - Config owns cadence, limits, active-hours bounds, and retention.
