# Agent Soul TechSpec

## Executive Summary

AGH will support an optional `SOUL.md` file beside an agent's existing `AGENT.md`. `SOUL.md` is an authored persona and behavioral identity artifact: it describes how an agent should think, communicate, collaborate, apply principles, and relate to memory. It is not a runtime state file, not a heartbeat file, not task ownership, not capability declaration, and not orchestration policy.

The primary trade-off is authoring ergonomics versus authority clarity. A separate Markdown file makes agent identity easy to author, but AGH must strictly prevent it from becoming a second `AGENT.md`, a hidden workflow engine, or a bypass around capabilities, task leases, session activity, or AGH Network presence.

The recommended design is additive and bounded:

- `AGENT.md` remains the canonical agent definition.
- `SOUL.md` is optional and scoped to persona/identity.
- AGH validates `SOUL.md` with strict frontmatter and reserved-section checks.
- AGH injects the resolved soul deterministically into prompt construction.
- AGH exposes compact soul context in `/agent/context`.
- AGH exposes the full resolved soul through agent-operable read and authoring surfaces.
- AGH provides managed `SOUL.md` authoring with validation, compare-and-swap writes, revision history, rollback, and auditability.
- AGH snapshots the soul digest/profile at session start and task-run claim time.
- `HEARTBEAT.md` is explicitly deferred to a separate operational wake/heartbeat spec.

MVP boundary: implementation steps 1-12 add optional `SOUL.md` parsing, validation, managed authoring, prompt inclusion, resolved read models, session/task provenance, extension Host API read/write actions, CLI/API/UDS manageability, contract codegen, docs, and verification. Post-MVP work includes typed persona overlays, extension-authored overlay layers, any `HEARTBEAT.md` or wake policy behavior, network-wide persona propagation, and richer web editing UI.

## Goals

- Add optional `SOUL.md` support without weakening the existing agent spec.
- Preserve the current authorities for tools, capabilities, tasks, leases, session liveness, and network presence.
- Make the resolved persona visible and auditable through prompt, context, API, CLI, and stored provenance.
- Let agents and explicitly-granted extensions create, update, delete, inspect, validate, list history, and roll back `SOUL.md` through the same managed authoring service.
- Keep spawned sessions role-clean: child sessions use the target agent's own soul plus explicit spawn overlays, not implicit parent soul inheritance.
- Record which soul digest/profile influenced each session and task claim.

## Non-Goals

- Do not implement `HEARTBEAT.md`.
- Do not add recurring model-driven heartbeat turns.
- Do not change `ClaimNextRun` as the authoritative task-claim primitive.
- Do not change task lease heartbeat, session activity heartbeat, scheduler claim behavior, or AGH Network greet presence.
- Do not let `SOUL.md` define provider, command, model, tools, toolsets, permissions, hooks, capabilities, MCP servers, config, tasks, leases, network membership, or scheduler behavior.
- Do not let hooks, bundles, tool registry resources, MCP sidecars, bridge adapters, or network peers mutate soul directly; all mutation must go through the managed authoring service.
- Do not add typed persona overlay layers in MVP.
- Delete targets: none. This is an additive feature.

## System Architecture

`SOUL.md` enters the same broad profile-resolution path as `AGENT.md`, but with narrower authority.

```text
AGENT.md + capabilities + config
        |
        |-- AgentDef / executable authority
        |
SOUL.md |
        |-- SoulDef / persona authority
                |
        ResolvedAgentProfile
                |
   session prompt + soul snapshot
                |
 /agent/context + /agent/soul + task-run provenance
```

`AGENT.md` continues to own executable and operational fields. `SOUL.md` contributes only a validated persona block and structured metadata. The resolved soul is immutable for a session unless an explicit refresh operation is requested and accepted.

## Architectural Boundaries

- `internal/config` owns `SOUL.md` parsing, frontmatter validation, digesting, source-path normalization, atomic file authoring, compare-and-swap checks, and `SoulDef` / `ResolvedSoul` construction. No session, task, API, CLI, extension, or web code parses or writes `SOUL.md` directly.
- `internal/store/globaldb` owns immutable soul snapshots and authoring revision history. File writes and revision rows must be coordinated by one service call; leaf packages must not write audit rows independently.
- `internal/session` consumes resolved soul snapshots for prompt assembly and session provenance. It must not validate frontmatter, infer capabilities, or mutate task ownership.
- `internal/task` records claim-time soul provenance through the existing `ClaimNextRun` path. It must not introduce a new claim primitive, task queue, scheduler path, or persona-driven lease authority.
- `internal/situation` renders a compact read-only `soul` section. It must not include the full body or become the full resolved soul API.
- `internal/api/contract` owns DTO changes for context, soul read models, and soul authoring requests/responses. OpenAPI and generated TypeScript must co-ship with contract changes.
- `internal/api/udsapi`, HTTP API, and `cmd/agh` expose equivalent agent-operable inspect/validate/write/delete/history/rollback/refresh surfaces. UI-only completion is incomplete.
- `internal/extension` exposes the same managed authoring service through explicitly-granted Host API actions. Host API authorization remains the only extension write gate.
- `internal/daemon` remains the composition root for wiring resolver, store, session, task, API, and CLI dependencies. Leaf packages must not import daemon wiring or construct their own stores.
- `web/` may render generated DTOs and call existing APIs. It must not duplicate soul validation rules or parse local agent files.
- `packages/site` documents semantics and examples only. It is not an authority for runtime behavior.
- `internal/network` is out of scope for MVP except for explicit documentation that AGH Network greet presence and peer identity are unchanged.

## Core Interfaces

Add a focused config-domain model near the existing agent definition loader:

```go
type SoulDef struct {
	SourcePath     string
	Digest         string
	Version        string
	Role          string
	Tone          []string
	Principles    []string
	Constraints   []string
	Collaboration []string
	MemoryPolicy  []string
	Body          string
	Truncated     bool
}
```

Resolved soul is the normalized in-memory contract passed from configuration loading into session creation:

```go
type ResolvedSoul struct {
	Def         SoulDef
	Diagnostics []SoulDiagnostic
	Valid       bool
}
```

Diagnostics use one typed shape across parser, CLI, API, UDS, and session creation:

```go
type SoulDiagnostic struct {
	Code    string
	Field   string
	Section string
	Message string
}
```

Add a resolver boundary so prompt/session/task code does not parse Markdown directly:

```go
type SoulResolver interface {
	Resolve(ctx context.Context, agentPath string) (*ResolvedSoul, error)
	Validate(ctx context.Context, soul *SoulDef) error
}
```

The parser entry point is explicit and testable:

```go
func ParseSoul(ctx context.Context, path string) (*SoulDef, []SoulDiagnostic, error)
```

Managed authoring is the only mutation boundary for `SOUL.md`:

```go
type SoulAuthoringService interface {
	Put(ctx context.Context, req SoulPutRequest) (SoulMutationResult, error)
	Delete(ctx context.Context, req SoulDeleteRequest) (SoulMutationResult, error)
	History(ctx context.Context, req SoulHistoryRequest) ([]SoulRevision, error)
	Rollback(ctx context.Context, req SoulRollbackRequest) (SoulMutationResult, error)
}
```

Persist resolved snapshots behind a typed store boundary:

```go
type SoulSnapshotStore interface {
	UpsertSnapshot(ctx context.Context, snapshot SoulSnapshot) (SoulSnapshot, error)
	GetSnapshot(ctx context.Context, id string) (SoulSnapshot, error)
	FindSnapshotByDigest(ctx context.Context, workspaceID, agentName, digest string) (SoulSnapshot, bool, error)
	AppendRevision(ctx context.Context, revision SoulRevision) error
}
```

Snapshot records are immutable and map directly to `agent_soul_snapshots`:

```go
type SoulSnapshot struct {
	ID          string
	WorkspaceID string
	AgentName   string
	SourcePath  string
	Digest      string
	ProfileJSON json.RawMessage
	Body        string
	Truncated   bool
	CreatedAt   time.Time
}
```

Prompt assembly receives an already-persisted snapshot and never reads files:

```go
func AssembleAgentSoulBlock(snapshot SoulSnapshot, budget int) (string, bool)
```

Read DTOs are projections. Full body content appears only in `AgentSoulPayload`; `AgentSoulSectionPayload` is the compact `/agent/context` projection. Mutation DTOs carry proposed authored content and always route through `SoulAuthoringService`.

```go
type AgentSoulSectionPayload struct {
	Enabled    bool   `json:"enabled"`
	Present    bool   `json:"present"`
	SnapshotID string `json:"snapshot_id,omitempty"`
	Digest     string `json:"digest,omitempty"`
	SourcePath string `json:"source_path,omitempty"`
	Role       string `json:"role,omitempty"`
	Truncated  bool   `json:"truncated"`
}
```

```go
type AgentSoulPayload struct {
	Section     AgentSoulSectionPayload `json:"section"`
	Frontmatter map[string]any          `json:"frontmatter,omitempty"`
	Body        string                  `json:"body,omitempty"`
	Diagnostics []SoulDiagnostic        `json:"diagnostics,omitempty"`
}
```

```go
type AgentSoulValidateRequest struct {
	AgentName string `json:"agent_name,omitempty"`
}
```

```go
type SessionSoulRefreshRequest struct {
	ExpectedDigest string `json:"expected_digest,omitempty"`
}
```

```go
type AgentSoulPutRequest struct {
	AgentName      string `json:"agent_name,omitempty"`
	Body           string `json:"body"`
	ExpectedDigest string `json:"expected_digest,omitempty"`
}
```

```go
type AgentSoulDeleteRequest struct {
	AgentName      string `json:"agent_name,omitempty"`
	ExpectedDigest string `json:"expected_digest"`
}
```

```go
type AgentSoulRollbackRequest struct {
	AgentName      string `json:"agent_name,omitempty"`
	RevisionID     string `json:"revision_id"`
	ExpectedDigest string `json:"expected_digest"`
}
```

```go
type AgentSoulMutationResponse struct {
	Soul     AgentSoulPayload `json:"soul"`
	Revision SoulRevisionPayload `json:"revision"`
}
```

Redaction surface: `SourcePath` is workspace-relative in payloads/events, never absolute; diagnostics never include raw file contents; body is excluded from logs, metrics, task metadata, and `/agent/context`.

Allowed frontmatter fields: `version`, `role`, `tone`, `principles`, `constraints`, `collaboration`, `memory_policy`, `tags`.

Forbidden frontmatter fields and reserved Markdown declaration sections: `name`, `provider`, `command`, `model`, `tools`, `toolsets`, `deny_tools`, `permissions`, `mcp_servers`, `hooks`, `capabilities`, `prompt`, `tasks`, `task_runs`, `scheduler`, `heartbeat`, `lease`, `network`, `channels`, `spawn`, `env`, `config`, and operational memory-store fields.

## Data Models

Add a numbered SQLite migration in the global AGH database. The target database is `agh.db`, owned by `internal/store/globaldb`. The migration belongs in `internal/store/globaldb/global_db.go` as the next entry in `globalSchemaMigrations` after version 11, with version 12 and name `add_agent_soul_snapshots`. Do not add `EnsureSchema` reconciliation for these columns or tables.

Migration DDL:

```sql
CREATE TABLE IF NOT EXISTS agent_soul_snapshots (
	id            TEXT PRIMARY KEY,
	workspace_id  TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
	agent_name    TEXT NOT NULL,
	source_path   TEXT NOT NULL,
	digest        TEXT NOT NULL,
	profile_json  TEXT NOT NULL DEFAULT '{}',
	body          TEXT NOT NULL DEFAULT '',
	truncated     INTEGER NOT NULL DEFAULT 0 CHECK (truncated IN (0, 1)),
	created_at    TEXT NOT NULL,
	UNIQUE (workspace_id, agent_name, digest)
);

CREATE INDEX IF NOT EXISTS idx_agent_soul_snapshots_agent
	ON agent_soul_snapshots(workspace_id, agent_name, created_at DESC);

CREATE TABLE IF NOT EXISTS agent_soul_revisions (
	id               TEXT PRIMARY KEY,
	workspace_id     TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
	agent_name       TEXT NOT NULL,
	source_path      TEXT NOT NULL,
	action           TEXT NOT NULL CHECK (action IN ('put', 'delete', 'rollback')),
	previous_digest  TEXT NOT NULL DEFAULT '',
	new_digest       TEXT NOT NULL DEFAULT '',
	body             TEXT NOT NULL DEFAULT '',
	diagnostics_json TEXT NOT NULL DEFAULT '[]',
	actor_kind       TEXT NOT NULL DEFAULT '',
	actor_ref        TEXT NOT NULL DEFAULT '',
	origin_kind      TEXT NOT NULL DEFAULT '',
	origin_ref       TEXT NOT NULL DEFAULT '',
	created_at       TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_agent_soul_revisions_agent
	ON agent_soul_revisions(workspace_id, agent_name, created_at DESC);

ALTER TABLE sessions ADD COLUMN soul_snapshot_id TEXT
	REFERENCES agent_soul_snapshots(id) ON DELETE SET NULL;

ALTER TABLE sessions ADD COLUMN soul_digest TEXT NOT NULL DEFAULT '';

ALTER TABLE sessions ADD COLUMN parent_soul_digest TEXT NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_sessions_soul_snapshot
	ON sessions(soul_snapshot_id);
```

`agent_soul_snapshots` stores immutable resolved souls by digest:

| Column | Purpose |
| --- | --- |
| `id` | stable snapshot id |
| `workspace_id` | workspace scope |
| `agent_name` | canonical `AGENT.md` name |
| `source_path` | resolved `SOUL.md` path |
| `digest` | canonical content/profile digest |
| `profile_json` | validated structured profile |
| `body` | bounded narrative body |
| `truncated` | whether resolver truncated by configured limits |
| `created_at` | snapshot creation time |

`agent_soul_revisions` stores managed authoring history for rollback and audit:

| Column | Purpose |
| --- | --- |
| `id` | stable revision id |
| `workspace_id` | workspace scope |
| `agent_name` | canonical `AGENT.md` name |
| `source_path` | workspace-relative target `SOUL.md` path |
| `action` | `put`, `delete`, or `rollback` mutation |
| `previous_digest` | digest before mutation; empty when file was absent |
| `new_digest` | digest after mutation; empty after delete |
| `body` | bounded post-mutation body for rollback; empty after delete |
| `diagnostics_json` | validation diagnostics observed during mutation |
| `actor_kind` / `actor_ref` | caller identity |
| `origin_kind` / `origin_ref` | CLI, HTTP, UDS, extension, or automation origin |
| `created_at` | mutation time |

Add session-level columns to `sessions`:

| Column | Purpose |
| --- | --- |
| `soul_snapshot_id` | immutable snapshot applied at session start |
| `soul_digest` | fast provenance/debugging lookup |
| `parent_soul_digest` | optional spawned-session lineage metadata; provenance only, never behavioral instruction |

Side-table vs JSON decision: soul snapshots and authoring revisions are matchable and auditable state, so they use typed `agent_soul_snapshots` and `agent_soul_revisions` side tables plus session columns. `task_runs.metadata_json` is the SQLite column that maps to Go field `task.Run.Metadata json.RawMessage`; it may store only opaque claim-time provenance references for historical debugging. It must never store ownership state, lease state, scheduler state, capability state, refresh state, authoring revision state, raw claim tokens, or any data needed to decide whether a run is claimable, active, or complete. If implementation discovers query or ownership requirements for run-level soul state, add typed columns or a side table through a numbered migration instead of expanding JSON metadata.

Use existing `task_runs.metadata_json` for claim-time provenance references instead of adding new task-run columns unless implementation discovers a query requirement. On claim, write:

```json
{
  "soul": {
    "snapshot_id": "soul_...",
    "digest": "sha256:...",
    "agent_name": "reviewer",
    "captured_at": "2026-05-01T..."
  }
}
```

## API Endpoints

Extend existing contract DTOs and regenerate OpenAPI/types.

- `GET /api/agent/context`
  - Adds compact `soul` section to `AgentContextPayload`.
  - Includes `enabled`, `present`, `digest`, `source_path`, `role`, compact profile fields, `truncated`, `snapshot_id`, and provenance.
  - Does not include full prose body.
- `GET /api/agent/soul`
  - Caller-scoped UDS/agent-operable endpoint for the active agent/session.
  - Returns full resolved soul read model: source path, digest, parsed frontmatter, body, validation status, truncation state, snapshot metadata, and provenance.
- `GET /api/agents/{agent_name}/soul`
  - Operator/workspace read endpoint for an agent definition's resolved soul.
  - Useful before starting a session.
- `POST /api/agent/soul/validate`
  - Validates supplied body or current `SOUL.md` for the target agent without writing.
  - Returns the same `AgentSoulPayload` diagnostics as inspect/session creation.
- `PUT /api/agents/{agent_name}/soul`
  - Managed authoring write for `SOUL.md`.
  - Requires `expected_digest` unless the request explicitly creates a previously-missing file.
  - Validates the new body before atomic write; rejects forbidden fields/sections before persistence.
  - Writes a revision row and returns `AgentSoulMutationResponse`.
- `DELETE /api/agents/{agent_name}/soul`
  - Managed delete for `SOUL.md`.
  - Requires `expected_digest` when the file exists.
  - Writes a delete revision and returns the inactive/missing soul read model.
- `GET /api/agents/{agent_name}/soul/history`
  - Lists bounded revision history for managed authoring and rollback.
- `POST /api/agents/{agent_name}/soul/rollback`
  - Replaces `SOUL.md` with a prior revision body through the same validation/CAS path.
  - Writes a rollback revision and never mutates active sessions silently.
- `POST /api/sessions/{session_id}/soul/refresh`
  - Explicit refresh for an idle session.
  - Re-resolves `SOUL.md`, creates or reuses a snapshot, updates the session snapshot, and emits an audit event.
  - Returns `409` for active task runs in v1 to avoid mid-run persona drift.

## UDS Endpoints

The UDS surface must expose the same DTOs and core handlers as HTTP. UDS route handlers must call `internal/api/core` with `internal/api/contract` request/response shapes; no UDS-only DTOs or shortcut parsers are allowed.

| UDS route | Method name | Request DTO | Response DTO |
| --- | --- | --- | --- |
| `GET /api/agent/context` | `agent.context.get` | none | `AgentContextPayload` with `soul` section |
| `GET /api/agent/soul` | `agent.soul.inspect` | caller identity | `AgentSoulPayload` |
| `GET /api/agents/:name/soul` | `agent.soul.inspectDefinition` | `agent_name` | `AgentSoulPayload` |
| `POST /api/agent/soul/validate` | `agent.soul.validate` | `AgentSoulValidateRequest` | `AgentSoulPayload` with diagnostics |
| `PUT /api/agents/:name/soul` | `agent.soul.put` | `AgentSoulPutRequest` | `AgentSoulMutationResponse` |
| `DELETE /api/agents/:name/soul` | `agent.soul.delete` | `AgentSoulDeleteRequest` | `AgentSoulMutationResponse` |
| `GET /api/agents/:name/soul/history` | `agent.soul.history` | `AgentSoulHistoryRequest` | `AgentSoulHistoryResponse` |
| `POST /api/agents/:name/soul/rollback` | `agent.soul.rollback` | `AgentSoulRollbackRequest` | `AgentSoulMutationResponse` |
| `POST /api/sessions/:id/soul/refresh` | `session.soul.refresh` | `SessionSoulRefreshRequest` | `AgentSoulPayload` |

Transport parity is required: the same tests must exercise HTTP, UDS, and CLI paths for inspect, validate, write, delete, history, rollback, context projection, and refresh.

## Safety Invariants

1. `ClaimNextRun` remains the only authoritative primitive that can attach soul provenance to a task run.
2. Soul provenance never changes run ownership, `claim_token`, `claim_token_hash`, `lease_until`, `heartbeat_at`, or terminal-state semantics.
3. Raw `claim_token` values never enter soul snapshots, context payloads, task metadata, logs, prompts, memory, channels, or API responses.
4. Active task runs reject soul refresh with `409`; refresh must not silently alter an in-flight run's persona context.
5. Active sessions keep their session-start soul snapshot unless an explicit refresh succeeds while no active task run can be affected.
6. Scheduler sweep, recovery, and notification paths must not resolve `SOUL.md`, claim work, or create persona-driven wake behavior.
7. `HEARTBEAT.md` remains non-existent in MVP; any future wake policy must use existing task/scheduler primitives and a separate TechSpec.
8. Spawned sessions resolve the target agent's own soul and treat parent soul only as provenance metadata, never as behavioral instruction.
9. Invalid `SOUL.md` fails closed for the affected agent profile and reports actionable diagnostics; AGH must not silently drop forbidden operational declarations.
10. Snapshot writes must be idempotent by digest and must not create duplicate snapshots for identical resolved content within the same workspace and agent.
11. Soul provenance is read-only inside `ClaimNextRun` and never blocks, extends, or performs external work in the claim transaction.
12. `SOUL.md` mutation is allowed only through `SoulAuthoringService`; direct writes from API handlers, CLI commands, hooks, extensions, tools, resources, bundles, MCP sidecars, bridge adapters, or web code are forbidden.
13. Every put/delete/rollback uses `expected_digest` compare-and-swap when replacing an existing file; stale writes return deterministic conflict diagnostics and do not persist.
14. Every successful authoring mutation writes an `agent_soul_revisions` row before returning success.
15. Authoring mutations never change active sessions or active task runs; operators must call explicit refresh for idle sessions.
16. Extension Host API write/delete/rollback actions require explicit grants separate from read/validate/history actions.
17. Atomic file replacement is required for writes and rollback; partial file writes and best-effort cleanup are invalid completion states.

### Claim-Time Soul Provenance

Task-run soul provenance is copied from the claiming session's persisted `sessions.soul_snapshot_id` and `sessions.soul_digest` values that were loaded before the claim transaction opens. `ClaimNextRun` must perform no `SOUL.md` resolution, Markdown parsing, validation, digest computation, path traversal, or filesystem I/O.

When a claim has no session snapshot available, `ClaimNextRun` omits the `soul` block from task-run metadata and returns a typed internal `SoulProvenanceUnavailableNoSession` sentinel for diagnostics. It must not resolve the agent definition from disk to fill the gap. This keeps the claim primitive purely transactional and preserves task lease authority.

## Prompt And Runtime Behavior

- Session creation resolves `SOUL.md` once and records the snapshot.
- Prompt construction injects a bounded `Agent Soul` block after the canonical `AGENT.md` prompt and before dynamic situation/task context.
- `/agent/context` renders compact `soul` before dynamic runtime/task sections.
- Editing `SOUL.md` does not silently affect active sessions or active task runs.
- New sessions and new task-run claims use the latest valid resolved soul.
- Invalid `SOUL.md` fails validation for that agent profile; AGH reports actionable diagnostics and does not silently ignore forbidden fields.
- Managed authoring validates before persistence, records revisions after successful mutation, and never refreshes an active session implicitly.

Invalid existing `SOUL.md` files fail closed at session creation. Missing `SOUL.md` is valid and means `present=false`; malformed or forbidden `SOUL.md` is invalid and blocks prompt/session startup until fixed.

| Condition | `agh agent soul validate` | `agh agent soul inspect` | Session creation | `ClaimNextRun` | Refresh |
| --- | --- | --- | --- | --- | --- |
| Missing `SOUL.md` | success, `present=false` | success, `present=false` | proceeds without soul snapshot | omits soul metadata | returns no-op `present=false` |
| Forbidden field/section | fails with typed diagnostic | `422` with diagnostic | fails closed | not reached for new session; existing claim uses existing snapshot | rejects, no mutation |
| Malformed frontmatter | fails with typed diagnostic | `422` with diagnostic | fails closed | not reached for new session; existing claim uses existing snapshot | rejects, no mutation |
| Oversized body | fails with typed diagnostic unless truncation rules permit | `422` or truncated payload with diagnostic per limit policy | fails closed when beyond parser hard limit | not reached for new session; existing claim uses existing snapshot | rejects, no mutation |
| Path traversal/symlink escape | fails with typed diagnostic | `422` with diagnostic | fails closed | not reached for new session; existing claim uses existing snapshot | rejects, no mutation |
| Parser I/O error | fails with typed diagnostic | `500` with diagnostic correlation id | fails closed | not reached for new session; existing claim uses existing snapshot | rejects, no mutation |

All manual and autonomous surfaces return the same `SoulDiagnostic` structure for the same failure class.

### Managed Authoring Behavior

`SOUL.md` authoring uses one service for CLI, HTTP, UDS, Host API, and future web calls. The service resolves the target agent directory, validates that the caller can mutate that workspace/agent, reads the current digest, validates the proposed body, checks `expected_digest`, writes the file atomically, re-resolves the file, appends a revision row, and returns the same `AgentSoulMutationResponse` shape across transports.

Create semantics: when `SOUL.md` is absent, put may omit `expected_digest`; if the file appears between read and write, the operation returns conflict and does not overwrite it. Update/delete/rollback semantics: when `SOUL.md` exists, callers must provide the current `expected_digest`; stale or missing digests fail with deterministic `soul_conflict` diagnostics.

Rollback is a managed write from a prior revision body. It does not bypass validation, CAS, source-path checks, or revision recording. Delete records a revision with `new_digest=""` and leaves future session creation equivalent to `present=false`.

### Refresh Lifetime

Refresh splits validation from durable mutation. Parsing and validation run under the request context. Once validation succeeds, durable mutation uses `context.WithoutCancel(ctx)` with a bounded daemon-configured deadline so snapshot upsert, session row update, and audit event emission finish or roll back atomically even if the HTTP/UDS client disconnects.

Refresh must acquire a session-scoped soul refresh lock before the durable phase. Task claim code that claims on behalf of a session must acquire the same lock while loading `sessions.soul_snapshot_id` and invoking `ClaimNextRun`. If the lock is unavailable or a non-terminal run exists for the session, refresh returns `409`. The durable phase runs in one globaldb transaction and re-checks the active-run predicate immediately before updating the session row.

## Integration Points

| Surface | Change |
| --- | --- |
| `internal/config/agent.go` | Resolve optional `SOUL.md` beside `AGENT.md`; preserve `AGENT.md` authority. |
| `internal/config` authoring service | Validate, compare-and-swap, atomically write/delete, rollback, and re-resolve `SOUL.md`; this is the only mutation path. |
| `internal/store/globaldb` | Persist `agent_soul_snapshots`, `agent_soul_revisions`, and session provenance columns in one numbered migration. |
| `internal/situation/render.go` | Add compact `soul` section to rendered context. |
| `internal/session` | Snapshot soul at session start; prompt assembly includes resolved soul. |
| `internal/task` | On `ClaimNextRun`, copy already-loaded session soul provenance to `task_runs.metadata_json`; do not parse `SOUL.md` or change lease authority. |
| `internal/api/contract/agents.go` | Add soul read, mutation, history, rollback, and context DTOs; run codegen. |
| `internal/api/udsapi` / HTTP routes | Add read, write, delete, history, rollback, validate, and refresh surfaces. |
| `internal/hooks/payloads.go` | Add soul provenance fields to existing session, task-run, and spawn hook contexts. |
| `internal/extension/protocol`, `internal/extension/contract`, `internal/extension/host_api.go` | Add Host API actions for soul get/validate/put/delete/history/rollback and keep each behind the existing extension action allowlist. |
| `sdk/go`, `sdk/typescript`, `sdk/create-extension` | Publish the new Host API methods and generated contract types so extension authors can request and call the managed soul surface without hand-written strings. |
| `cmd/agh` | Add `agh agent soul inspect`, `validate`, `write`, `delete`, `history`, `rollback`, and `agh session soul refresh`. |
| `web/` | Update generated OpenAPI types and any context viewer that renders `/agent/context`. |
| `packages/site` | Document `SOUL.md`, validation, examples, lifecycle, and `HEARTBEAT.md` deferral. |
| AGH Network | No protocol or greet-presence change. |

## Extensibility Integration Plan

Agent Soul is extension-manageable in v1 through one managed authoring plane. External code can discover, validate, write, delete, list history, roll back, audit, and correlate resolved soul metadata only through explicit CLI/HTTP/UDS/Host API surfaces. No extension, hook, skill, capability, bundle, tool, resource projector, MCP sidecar, bridge adapter, or network peer may mutate persona policy through a side channel or inject soul text directly into prompt construction.

Concrete v1 extension surfaces:

- Add Host API methods `agents/soul/get`, `agents/soul/validate`, `agents/soul/put`, `agents/soul/delete`, `agents/soul/history`, and `agents/soul/rollback`.
- Register the methods in `internal/extension/protocol/host_api.go`, mirror them in `internal/extension/contract/host_api.go`, add handlers in `internal/extension/host_api.go`, and update Host API method-order tests.
- Gate every method through the existing extension actions/Host API allowlist. Write/delete/rollback grants are separate from get/validate/history grants.
- Export the methods through `sdk/go/host_api.go` and regenerated TypeScript SDK contracts so extension authors can declare them in `extension.toml` actions without raw string drift.
- Add `SoulSnapshotID` and `SoulDigest` to hook payload contexts that already expose session or task-run context: `hooks.SessionContext`, `hooks.TaskRunContext`, and `hooks.SpawnContext`.
- Add `ParentSoulDigest` only to spawn/session lineage payloads as provenance metadata.
- Never expose the raw soul body in hook payloads, extension events, logs, metrics, task metadata, or resource snapshots.

Required SD-011 surface matrix:

| Surface | v1 impact | Required evidence / implementation note |
| --- | --- | --- |
| Extension manifests / Host API | Changed | New actions `agents/soul/get`, `agents/soul/validate`, `agents/soul/put`, `agents/soul/delete`, `agents/soul/history`, and `agents/soul/rollback`; extensions must request each explicitly; existing action allowlist and `CheckHostAPI` remain authoritative. |
| Hooks | Changed | Existing session/task/spawn hook contexts gain compact provenance fields only; hook handlers cannot override or refresh soul. |
| Skills / capabilities | Managed through agent-operable surfaces | `SOUL.md` cannot declare skills, capabilities, tools, MCP servers, or hooks. Agents may manage soul via CLI/API/UDS/Host API when authorized, but no skill/capability metadata grants direct soul mutation. |
| Tools / resources | Explicitly unaffected for execution and desired state | Do not add a tool registry entry, MCP tool, or canonical `internal/resources` desired-state kind for soul in MVP; soul is an agent read model plus snapshot, not executable capability state. |
| Bundles | Explicitly unaffected for ownership | Bundle activation may create sessions/jobs that use the target agent's own resolved soul at session start, but bundle specs must not carry persona overlays or `SOUL.md` bodies in v1. Future bundle-provided agent files must land through the same validation rules. |
| Registries / marketplace | Explicitly unaffected for package metadata | No registry listing field, package capability classification, or marketplace policy changes in v1; package install/verification must treat `SOUL.md` as authored content that must pass soul validation when installed with an agent package. |
| Bridge SDKs / bridge adapters | Managed through Host API only | Bridge runtimes can request soul read/write actions like any extension when explicitly allowed; no bridge-specific persona contract or delivery behavior changes. |
| MCP sidecars | Explicitly unaffected | `SOUL.md` is forbidden from declaring `mcp_servers`; global/workspace MCP sidecar config and hosted MCP launch records do not change. |
| AGH Network protocol docs | Explicitly unaffected | No peer card, greet, presence, channel, whois, or capability-brief change; docs must state that soul is local runtime persona, not network identity or availability. |
| Public protocol / SDK docs | Changed | Update extension Host API docs, generated SDK method references, agent authoring docs, CLI/API docs, config reference, and authoring conflict/rollback examples in the same change. |

Future extension points may add typed persona overlays or resource-backed soul catalogs only after a separate TechSpec defines precedence, audit trails, conflict handling, and agent-operable rollback. Such future work must remain additive to the authoritative `SOUL.md` snapshot model and must not turn hooks or capabilities into prompt mutation backdoors.

## Agent Manageability Plan

Agents must be able to inspect and manage this feature without a UI-only path.

- `agh agent soul validate <agent>` validates frontmatter, reserved sections, size limits, and forbidden operational declarations.
- `agh agent soul inspect <agent> --json` returns the full resolved soul read model.
- `agh agent soul write <agent> --file <path>|--stdin --expected-digest <digest> --json` validates and atomically writes `SOUL.md`.
- `agh agent soul delete <agent> --expected-digest <digest> --json` removes `SOUL.md` through the managed authoring service.
- `agh agent soul history <agent> --json` lists bounded managed authoring revisions.
- `agh agent soul rollback <agent> --revision <id> --expected-digest <digest> --json` restores a prior revision through the same validation/CAS path.
- `agh agent context --json` includes compact `soul`.
- `agh session soul refresh <session-id>` explicitly refreshes an idle session.
- All `agh agent soul ...` commands and `agh session soul refresh <session-id>` support `--json` and `--workspace <workspace>` so multi-workspace daemons and agents can operate without UI-only state.
- API/UDS endpoints mirror the CLI behavior.
- Structured outputs must expose `present`, `active`, `digest`, `snapshot_id`, `revision_id`, `source_path`, `limits`, `diagnostics`, `context_projection_bytes`, and `max_body_bytes` where relevant, with workspace-relative paths.
- Status/config discovery must work through `agh agent soul inspect --json`, `agh agent context --json`, and `agh config get agents.soul --json`.
- Validation and mutation errors must include deterministic `SoulDiagnostic.Code`, file path, field/section, reason, and suggested owner surface such as `AGENT.md`, `capabilities.toml`, config, or task runtime.
- HTTP, UDS, CLI, and Host API must return the same diagnostic codes for `missing`, `inactive`, `forbidden_field`, `reserved_section`, `oversized_body`, `path_escape`, `soul_conflict`, `revision_not_found`, unauthorized mutation, and parser I/O failures.
- No web-only workflow is allowed in MVP; any future web editor must call the same HTTP/UDS/core services used by CLI and extensions.

## Config Lifecycle

Add optional config keys with documented defaults:

```toml
[agents.soul]
enabled = true
max_body_bytes = 32768
context_projection_bytes = 2048
```

`max_body_bytes = 32768` is large enough for authored persona prose while preserving OpenClaw/Hermes-style bounded prompt injection and scan/truncation discipline. `context_projection_bytes = 2048` keeps `/agent/context` compact while exposing enough role/style/provenance for agent self-awareness; full prose remains in the prompt path and full read model.

Config implementation requirements:

- Add `Agents.Soul` config structs, defaults, overlay structs, merge behavior, and validation in `internal/config`.
- Preserve existing precedence: built-in defaults, global `config.toml`, then workspace `.agh/config.toml` overlay when a workspace is resolved.
- Validate `max_body_bytes > 0`, `context_projection_bytes > 0`, and `context_projection_bytes <= max_body_bytes`.
- Validation strictness is not configurable in v1. Forbidden operational fields always fail.
- If `enabled = false`, AGH reports `SOUL.md` as present but inactive and does not inject it into prompts or snapshots. Inspect, validate, write, delete, history, and rollback remain available so agents can repair authored files while runtime injection is disabled.
- `agh config get/set agents.soul.*` must manage the keys through the existing validated config mutation path; invalid updates fail before persistence.
- Tests must cover defaults, global override, workspace overlay, validation failures, disabled behavior, authoring-while-disabled behavior, and generated docs/examples.

Docs must update config reference, agent authoring docs, CLI reference, and site examples. `agh config get/set agents.soul.*` should manage these keys through the existing config lifecycle.

## Spawn Semantics

Spawned sessions do not inherit the parent session's `SOUL.md`. A spawned session resolves the target agent's own `SOUL.md`, then applies explicit spawn fields already present in `internal/api/contract/agents.go` (`AgentSpawnRequest.SpawnRole`, `AgentSpawnRequest.PromptOverlay`) and `internal/session/spawn.go` (`SpawnOpts.SpawnRole`, `SpawnOpts.PromptOverlay`).

Parent soul may appear only as provenance metadata, for example `parent_soul_digest`, and never as behavioral instruction. This prevents coordinator persona leakage into reviewer, implementer, QA, or external/networked agents.

## HEARTBEAT.md Decision

`HEARTBEAT.md` is out of scope for this TechSpec.

Reason: heartbeat files cross into wake policy, scheduling, liveness, recurring checks, task ownership, and background model turns. AGH already has task lease heartbeat, session activity heartbeat, scheduler sweep/notify/recovery, and AGH Network greet presence. A future heartbeat/wake spec must preserve `task_runs` and `ClaimNextRun` as the authoritative executable work path.

Future work is tracked under a TechSpec slug to be created, working name `agent-heartbeat`. Do not open it until Agent Soul ships and a wake-policy PRD exists.

## Test Strategy

- Unit-test `SOUL.md` parser, strict frontmatter validation, forbidden fields, reserved Markdown sections, digest stability, truncation, missing-file behavior, and path safety.
- Integration-test agent profile loading with and without `SOUL.md`.
- Session tests prove prompt inclusion, snapshot persistence, and no silent reload after file edits.
- Task tests prove `ClaimNextRun` writes soul provenance to `task_runs.metadata_json` without changing lease behavior.
- Spawn tests prove target-agent soul is used and parent soul is not inherited.
- API/CLI/UDS/Host API tests cover inspect, validate, write, delete, history, rollback, context projection, authorization, CAS conflicts, and refresh conflicts.
- Contract tests require `make codegen` and `make codegen-check` for `openapi/agh.json` and `web/src/generated/agh-openapi.d.ts`.
- Final gate remains `make verify`.

Required schema and claim tests:

1. `TestAgentSoulSnapshotsFreshDB` verifies version 12 creates `agent_soul_snapshots`, session soul columns, uniqueness, indexes, and foreign-key behavior on a fresh `agh.db`.
2. `TestAgentSoulSnapshotsReopenAfterRestart` verifies snapshots and session soul references survive close/reopen.
3. `TestAgentSoulSessionColumnsFreshDB` verifies new `sessions.soul_snapshot_id` and `sessions.soul_digest` columns exist with expected defaults.
4. `TestAgentSoulMigrationHandlesWALCompanions` verifies reopen and recovery behavior does not leave stale `-wal` / `-shm` companions after migration.
5. `TestClaimNextRunCopiesSoulProvenanceWithoutFileIO` proves claim metadata is copied from the preloaded session snapshot and does not invoke the resolver.
6. `TestSessionSoulRefreshRejectsConcurrentClaim` proves refresh returns `409` when the session claim/refresh lock is held or an active run appears.
7. `TestSoulInvalidFileFailsClosedAcrossSurfaces` proves CLI validate, inspect, session creation, and refresh return consistent typed diagnostics.

Additional explicit tests:

1. `TestSoulParserRejectsForbiddenFrontmatterFields` covers operational keys such as `tools`, `provider`, `heartbeat`, `lease`, and `network`.
2. `TestSoulParserRejectsReservedMarkdownSections` covers forbidden declaration sections in the Markdown body.
3. `TestSoulParserTruncatesWithinConfiguredPromptBudget` covers bounded prompt assembly without leaking full body into `/agent/context`.
4. `TestSoulSnapshotStoreDeduplicatesByDigest` covers idempotent snapshot reuse for identical resolved content.
5. `TestAgentContextIncludesCompactSoulProjectionOnly` verifies context has role/digest/provenance but not full body.
6. `TestAgentSoulInspectReturnsFullReadModel` verifies full body and diagnostics only appear on the dedicated read surface.
7. `TestAgentSoulUDSHTTPCLIParity` verifies validate, inspect, context, and refresh use the same DTOs across transports.
8. `TestSpawnUsesTargetSoulAndRecordsParentSoulDigestOnly` verifies child sessions do not inherit parent behavioral persona.
9. `TestAgentSoulObservabilityRedactsAbsoluteSourcePaths` verifies events/logs use workspace-relative paths and never emit `$HOME`.
10. `TestAgentSoulConfigDisableReportsInactiveWithoutPromptInjection` verifies `agents.soul.enabled=false` keeps inspection available but disables prompt/context injection.
11. `TestAgentSoulAuthoringPutDeleteHistoryRollback` verifies managed writes, deletes, revision rows, and rollback through the shared service.
12. `TestAgentSoulAuthoringRejectsStaleExpectedDigest` verifies stale CAS writes fail without changing `SOUL.md`.
13. `TestAgentSoulHostAPIRequiresExplicitActionGrant` verifies extensions cannot call `agents/soul/get`, `agents/soul/put`, `agents/soul/delete`, or `agents/soul/rollback` unless their manifest/action allowlist grants the exact action.
14. `TestAgentSoulExtensibilityMutationUsesManagedServiceOnly` verifies hooks, bundles, resources, tools, MCP sidecars, bridge adapters, and web code cannot bypass the managed authoring service or inject soul content directly.

## Testing Approach

Use the same coverage defined in `Test Strategy`. This compatibility section exists so downstream task generation can reference both the historical AGH TechSpec heading and the peer-review-required heading.

## Implementation Steps

1. Build `SoulDef`, parser, resolver, digesting, limits, and validation. Web/Docs Impact: no web impact; docs impact is pending examples in step 11.
2. Add SQLite migration, snapshot store, and revision store; depends on resolver output shape. Web/Docs Impact: no web impact; docs impact is schema/config reference notes in step 11.
3. Add managed authoring service for validate/put/delete/history/rollback with atomic file writes, CAS, revision rows, and re-resolution; depends on steps 1-2. Web/Docs Impact: no web impact; docs impact is authoring CLI/API examples in step 11.
4. Wire session creation and prompt assembly; depends on snapshot persistence. Web/Docs Impact: no web impact; docs impact is lifecycle semantics in step 11.
5. Add task-claim provenance via `task_runs.metadata_json`; depends on snapshot persistence and existing claim flow. The claim path copies `sessions.soul_snapshot_id` and `sessions.soul_digest` from the claiming session before the claim transaction opens and performs no filesystem work. Web/Docs Impact: no web impact; docs impact is task-run provenance wording in step 11.
6. Add `/agent/context` compact projection and full soul read endpoints; depends on session/snapshot data. Web/Docs Impact: generated API types and any context viewer consuming `AgentContextPayload`; docs impact is API reference in step 11.
7. Add soul write/delete/history/rollback endpoints and CLI verbs; depends on managed authoring service. Web/Docs Impact: no web UI required in MVP; docs impact is CLI/API authoring reference in step 11.
8. Add explicit refresh endpoint/CLI; depends on session snapshot update semantics and authoring service. Web/Docs Impact: no web UI required in MVP; docs impact is refresh CLI/API reference in step 11.
9. Add spawn behavior tests and provenance fields; depends on session creation integration. Web/Docs Impact: generated session/spawn types if `parent_soul_digest` is exposed; docs impact is spawn semantics in step 11.
10. Add extension Host API actions `agents/soul/get|validate|put|delete|history|rollback`, SDK method exports, and hook payload provenance fields; depends on API read/mutation models and session/task provenance. Web/Docs Impact: generated SDK/contract docs and extension Host API reference updates in step 11.
11. Regenerate contracts and update web/docs/site/CLI reference; depends on final CLI/API/Host API names. Web/Docs Impact: `openapi/agh.json`, `web/src/generated/agh-openapi.d.ts`, TypeScript SDK generated contracts, `packages/site` agent authoring docs, config reference, CLI reference, API reference, extension Host API reference, SDK reference, authoring conflict/rollback examples, and `HEARTBEAT.md` deferral note.
12. Run focused tests, `make codegen-check`, then `make verify`; depends on all implementation tasks. Web/Docs Impact: no new surface; verifies co-shipped generated artifacts and docs build.

## Development Sequencing

Implementation follows the numbered `Implementation Steps` above. Each step after step 1 depends on the resolved interfaces and persistence shape produced by the earlier steps, and no later API/UI/docs work should start before the relevant source contracts exist.

## Monitoring And Observability

Emit structured events/logs for:

- `agent_soul.resolve.started`
- `agent_soul.resolve.succeeded`
- `agent_soul.resolve.failed`
- `agent_soul.validation.failed`
- `agent_soul.snapshot.created`
- `agent_soul.snapshot.reused`
- `agent_soul.refresh.succeeded`
- `agent_soul.refresh.rejected`
- `agent_soul.truncated`
- `agent_soul.authoring.put.succeeded`
- `agent_soul.authoring.delete.succeeded`
- `agent_soul.authoring.rollback.succeeded`
- `agent_soul.authoring.conflict`
- `agent_soul.authoring.unauthorized`

Expose counters for validation failures, truncation, refresh attempts, refresh rejections, snapshot reuse, authoring attempts, authoring conflicts, rollback attempts, and unauthorized Host API mutations. Include `workspace_id`, `agent_name`, `session_id`, `task_run_id` when available, `digest`, `revision_id`, actor identity, origin identity, and non-sensitive source path provenance.

Observability goes through existing `internal/logger` structured logs and `internal/observe` queryable event surfaces where applicable. Event source paths must be workspace-relative; absolute paths, `$HOME`, and provider-home paths are stripped before logging or persistence. Soul body content is never logged or emitted as a metric/event field.

## Technical Considerations And Risks

- Prompt bloat: compact `/agent/context`; full prose only in prompt and full read endpoint.
- Authority confusion: strict validation and docs must clearly direct operational fields back to `AGENT.md`, capabilities, config, or task runtime.
- Storage bloat: immutable snapshots dedupe by digest; task runs store provenance references in metadata.
- Mid-run drift: no silent reload; v1 refresh rejects active task runs.
- Generated contract drift: OpenAPI and web generated types must ship in the same change.
- Security: resolver must avoid path traversal, unsafe symlink behavior, oversized files, and secret-like operational fields being treated as authority.
- Authoring race: stale `expected_digest` writes must fail closed; tests must cover concurrent writes and delete/update conflicts.
- Unauthorized extension mutation: Host API write/delete/rollback grants must be exact-action grants and must fail closed when omitted.
- Rollback drift: rollback must revalidate historical bodies against current rules instead of restoring forbidden content blindly.

## Assumptions And Defaults

- Default config keeps Agent Soul enabled: `agents.soul.enabled = true`.
- Default body limit is `32768` bytes; default compact context projection budget is `2048` bytes.
- `SOUL.md` lives beside the target agent's `AGENT.md`; no alternate file name or external catalog is supported in MVP.
- Managed authoring writes the canonical `SOUL.md` file, not a database-only persona shadow.
- Missing `SOUL.md` is valid and produces `present=false`.
- Existing invalid `SOUL.md` fails closed until fixed through file edit or managed authoring.
- Active sessions and active task runs keep their original soul snapshot until an explicit idle-session refresh succeeds.
- Extension write actions are disabled unless the extension manifest requests and receives the exact Host API action grant.
- No compatibility aliases, deprecated route names, or legacy fallback paths are introduced.

## Reference Research

Primary reference analyses:

- `.compozy/tasks/agent-soul/analysis/analysis_openclaw.md`
- `.compozy/tasks/agent-soul/analysis/analysis_hermes.md`
- `.compozy/tasks/agent-soul/analysis/analysis_paperclip.md`

Additional comparison corpus:

- `.compozy/tasks/agent-soul/analysis/analysis_claude-code.md`
- `.compozy/tasks/agent-soul/analysis/analysis_openfang.md`
- `.compozy/tasks/agent-soul/analysis/analysis_goclaw.md`
- `.compozy/tasks/agent-soul/analysis/analysis_acpx.md`
- `.compozy/tasks/agent-soul/analysis/analysis_opencode.md`
- `.compozy/tasks/agent-soul/analysis/analysis_harnss.md`
- `.compozy/tasks/agent-soul/analysis/analysis_multica.md`

## Architecture Decision Records

- [adr-001.md](./adrs/adr-001.md): Treat `SOUL.md` as an optional persona artifact.
- [adr-002.md](./adrs/adr-002.md): Expose resolved soul through prompt and read models.
- [adr-003.md](./adrs/adr-003.md): Snapshot resolved soul at session start and task claim.
- [adr-004.md](./adrs/adr-004.md): Do not implicitly inherit parent soul in spawned sessions.
- [adr-005.md](./adrs/adr-005.md): Defer `HEARTBEAT.md` to a separate runtime policy spec.
- [adr-006.md](./adrs/adr-006.md): Provide managed soul authoring in v1.
