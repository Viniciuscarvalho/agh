# Agent Heartbeat TechSpec

## Executive Summary

This TechSpec defines Agent Heartbeat as two related but separate runtime capabilities:

1. `HEARTBEAT.md` is an optional managed wake-policy artifact. It guides how an already eligible agent session should reorient when the daemon sends a synthetic wake, but it is not liveness, ownership, a scheduler, or a durable work queue.
2. `session.health` is a metadata-only runtime primitive that reports whether an idle or active session is healthy, attachable, and eligible for synthetic wake.

This spec resolves the Heartbeat deferral boundary set by ADR-005 and preserves the authority separations declared there.

The primary trade-off is intentional scope control. AGH will add stronger storage, managed authoring, session health, CLI/HTTP/UDS/Host API parity, and wake auditability instead of copying OpenClaw's mostly in-memory heartbeat runner or Paperclip's dual `wakeup_requests` / `heartbeat_runs` queue. V1 does not auto-spawn sessions and does not materialize heartbeat turns as `task_runs`.

## Goals

- Add optional `HEARTBEAT.md` authoring for agent wake/reentry guidance.
- Preserve `task_runs` and `ClaimNextRun` as the only executable work and claim path.
- Preserve task-run lease heartbeat, session activity heartbeat, and AGH Network greet presence as separate authorities.
- Add or reinforce metadata-only `session.health` so wake policy never targets broken, non-attachable, or active sessions blindly.
- Expose both heartbeat policy and session health through agent-operable CLI, HTTP, UDS, OpenAPI, generated TypeScript, and Host API surfaces.
- Keep configuration authoritative for cadence, rate limits, active-hours bounds, body limits, and context projection budgets.

## Non-Goals

- No auto-spawned heartbeat sessions in MVP.
- No recurring model loop created by `HEARTBEAT.md`.
- No Markdown task parser that creates, claims, completes, fails, releases, or renews `task_runs`.
- No changes to task-run lease heartbeat semantics.
- No changes to `[session.supervision]` active prompt activity timers.
- No changes to AGH Network peer presence or `greet_interval`.
- No generic heartbeat event bus.

## Delete Targets

None. This is an additive feature. It does not delete, rename, or replace Agent Soul artifacts, task-run lease heartbeat, session activity supervision, or AGH Network greet presence.

## MVP Boundary

In scope for MVP:

- Managed `HEARTBEAT.md` artifact: inspect, validate, write, delete, history, rollback, status, manual wake.
- Resolved heartbeat policy snapshots and revisions.
- Lightweight wake state/audit tables with no queue semantics.
- Metadata-only `session.health` / `session.liveness` primitive.
- Scheduler and synthetic prompt integration for already eligible sessions only.
- CLI/HTTP/UDS/Host API parity for policy and health inspection.
- Config-owned bounds under `[agents.heartbeat]`.

Post-MVP:

- Auto-spawning heartbeat sessions.
- Isolated heartbeat-only sessions.
- Network propagation of heartbeat policy.
- `HEARTBEAT_OK` transcript suppression.
- Semantic liveness classification such as `plan_only`, `empty_response`, or `needs_followup`.
- Recurring task schedules derived from authored files.

## System Architecture

### Component Overview

| Component | Responsibility | Boundary |
|-----------|----------------|----------|
| HeartbeatPolicyResolver | Load, parse, validate, and resolve optional `HEARTBEAT.md` into bounded policy | No task ownership, no model calls |
| HeartbeatAuthoringService | Managed write/delete/history/rollback with CAS and validation | No prompt mutation side channel |
| HeartbeatSnapshotStore | Immutable resolved policy snapshots and revision history | No queue state |
| HeartbeatWakeService | Evaluate policy + session health, coalesce wake attempts, call synthetic prompt path | No claim/complete/fail/release |
| SessionHealthService | Maintain queryable metadata-only session health/presence | No prompt injection, no task lease renewal |
| Scheduler Integration | Consult resolved policy only after normal scheduler eligibility checks | Wake only, never claim |
| Synthetic Prompt Integration | Deliver advisory wake prompt with typed metadata | Existing `PromptSynthetic` queue only |
| API / UDS / CLI / Host API | Agent-operable management and diagnostics | Redacted, deterministic error contracts |

### Flow

1. Agent author creates or updates `HEARTBEAT.md` through CLI/HTTP/UDS/Host API or direct file authoring.
2. Resolver validates frontmatter/body against `[agents.heartbeat]` bounds.
3. Runtime stores immutable snapshot and revision records.
4. Wake decisions evaluate the latest valid resolved snapshot at wake-decision time. Session start may expose the latest policy digest for diagnostics, but Heartbeat has no explicit session refresh surface in MVP.
5. Session health updates metadata-only state for active/idle/dead/attachable/wake eligibility.
6. Scheduler or manual wake requests call `HeartbeatWakeService`.
7. Wake service checks config, policy, health, cooldown, coalescing, and active-session-only rules.
8. If eligible, the daemon records a wake event with the chosen snapshot id and sends an advisory synthetic prompt with the same snapshot id.
9. The prompt tells the agent to inspect context and use normal task APIs before doing work.

## Architectural Boundaries

AGH must keep these authorities separate:

| Concept | Authority | Mutates | Does Not Do |
|---------|-----------|---------|-------------|
| Task Run Lease Heartbeat | `internal/task` + `task_runs` | `lease_until`, `heartbeat_at`, claim metadata | Does not wake sessions or call models |
| Session Activity Heartbeat | `[session.supervision]` + ACP activity reporter | prompt activity metadata, runtime progress/warnings | Does not renew task leases or parse files |
| Session Presence / Health | session runtime health service | health, presence, attachability, wake eligibility metadata | Does not inject prompts or claim work |
| Agent `HEARTBEAT.md` Wake Policy | authored policy resolver + wake service | policy snapshots, revisions, wake audit | Does not define liveness, ownership, or queue state |
| AGH Network Greet | network manager/router/peer registry | peer presence | Does not imply local session health or task readiness |

`HEARTBEAT.md` consumes `session.health`; it never implements session liveness itself.

## Implementation Design

### Core Interfaces

```go
type ResolveHeartbeatRequest struct {
	WorkspaceID string
	AgentName   string
	SourcePath  string
	Body        []byte
	Config      HeartbeatConfig
	Actor       HeartbeatActor
}

type ValidateHeartbeatRequest struct {
	WorkspaceID string
	AgentName   string
	SourcePath  string
	Body        []byte
	Config      HeartbeatConfig
}

type ResolvedHeartbeatPolicy struct {
	SnapshotID       string
	WorkspaceID      string
	AgentName        string
	Digest           string
	ConfigDigest     string
	SchemaVersion    int
	Enabled          bool
	Summary          string
	GuidanceMarkdown string
	Preferences      HeartbeatPreferences
	Diagnostics      []HeartbeatDiagnostic
}

type HeartbeatPreferences struct {
	MinInterval  time.Duration
	QuietWindows []HeartbeatTimeWindow
	ActiveHours  []HeartbeatTimeWindow
	Context       HeartbeatContextProjection
}

type HeartbeatContextProjection struct {
	Include []string
}

type HeartbeatTimeWindow struct {
	Timezone string
	Start    string
	End      string
}

type HeartbeatDiagnostic struct {
	Code     string
	Severity string
	Message  string
	Field    string
}

type HeartbeatConfig struct {
	Enabled                      bool
	MaxBodyBytes                 int64
	ContextProjectionBytes        int64
	MinInterval                  time.Duration
	DefaultInterval              time.Duration
	WakeCooldown                 time.Duration
	MaxWakesPerCycle             int
	ActiveSessionOnly            bool
	AllowActiveHoursPreferences  bool
	WakeEventRetention           time.Duration
	SessionHealthStaleAfter      time.Duration
	SessionHealthHookMinInterval time.Duration
}

type HeartbeatActor struct {
	Kind string
	Ref  string
}

type HeartbeatValidationResult struct {
	Valid       bool
	Digest      string
	Policy      *ResolvedHeartbeatPolicy
	Diagnostics []HeartbeatDiagnostic
}

type HeartbeatSnapshot struct {
	ID              string
	WorkspaceID     string
	AgentName       string
	SourcePath      string
	SchemaVersion   int
	Digest          string
	ConfigDigest    string
	Body            string
	FrontmatterJSON []byte
	ResolvedJSON    []byte
	DiagnosticsJSON []byte
	CreatedAt       time.Time
}

type HeartbeatRevision struct {
	ID             string `json:"id"`
	WorkspaceID    string `json:"workspace_id"`
	AgentName      string `json:"agent_name"`
	SourcePath     string `json:"source_path"`
	Operation      string `json:"operation"`
	PreviousDigest string `json:"previous_digest,omitempty"`
	NewDigest      string `json:"new_digest,omitempty"`
	NewSnapshotID  string `json:"new_snapshot_id,omitempty"`
	ActorKind      string `json:"actor_kind"`
	ActorRef       string `json:"actor_ref"`
	CreatedAt      string `json:"created_at"`
}
```

```go
type HeartbeatPolicyResolver interface {
	Resolve(ctx context.Context, req ResolveHeartbeatRequest) (*ResolvedHeartbeatPolicy, error)
	Validate(ctx context.Context, req ValidateHeartbeatRequest) (*HeartbeatValidationResult, error)
}
```

```go
type HeartbeatAuthoringService interface {
	Get(ctx context.Context, req HeartbeatGetRequest) (*HeartbeatStatusResponse, error)
	Put(ctx context.Context, req HeartbeatPutRequest) (*HeartbeatStatusResponse, error)
	Delete(ctx context.Context, req HeartbeatDeleteRequest) (*HeartbeatStatusResponse, error)
	History(ctx context.Context, req HeartbeatHistoryRequest) (*HeartbeatHistoryResponse, error)
	Rollback(ctx context.Context, req HeartbeatRollbackRequest) (*HeartbeatStatusResponse, error)
}

type HeartbeatSnapshotStore interface {
	InsertSnapshot(ctx context.Context, snapshot HeartbeatSnapshot) (*HeartbeatSnapshot, error)
	GetLatestValid(ctx context.Context, workspaceID string, agentName string) (*HeartbeatSnapshot, error)
	GetByID(ctx context.Context, id string) (*HeartbeatSnapshot, error)
	GetByDigest(ctx context.Context, workspaceID string, agentName string, digest string) (*HeartbeatSnapshot, error)
	ListRevisions(ctx context.Context, req HeartbeatHistoryRequest) (*HeartbeatHistoryResponse, error)
	RecordRevision(ctx context.Context, revision HeartbeatRevision) (*HeartbeatRevision, error)
}
```

```go
type SessionHealth struct {
	SessionID           string
	WorkspaceID          string
	AgentName            string
	State               string
	Health              string
	ActivePrompt        bool
	Attachable          bool
	EligibleForWake     bool
	IneligibilityReason *string
	LastActivityAt      time.Time
	LastPresenceAt      time.Time
	UpdatedAt           time.Time
}

type SessionHealthUpdateRequest struct {
	SessionID      string
	WorkspaceID     string
	AgentName       string
	State           string
	Health          string
	ActivePrompt    bool
	Attachable      bool
	LastActivityAt  *time.Time
	LastPresenceAt  time.Time
	LastError       string
}

type SessionHealthGetRequest struct {
	SessionID string
}

type SessionHealthListRequest struct {
	WorkspaceID      string
	AgentName        string
	IncludeUnhealthy bool
	Limit            int
	Cursor           string
}

type SessionHealthListResponse struct {
	Sessions   []SessionHealth
	NextCursor string
}

type SessionHealthService interface {
	Update(ctx context.Context, req SessionHealthUpdateRequest) (*SessionHealth, error)
	Get(ctx context.Context, req SessionHealthGetRequest) (*SessionHealth, error)
	List(ctx context.Context, req SessionHealthListRequest) (*SessionHealthListResponse, error)
}
```

```go
type HeartbeatWakeService interface {
	Wake(ctx context.Context, req HeartbeatWakeRequest) (*HeartbeatWakeResult, error)
	Status(ctx context.Context, req HeartbeatStatusRequest) (*HeartbeatStatus, error)
}
```

```go
type SchedulerHeartbeatGate interface {
	ConsultHeartbeatPolicy(ctx context.Context, req HeartbeatConsultRequest) ([]HeartbeatWakeIntent, error)
}

type HeartbeatSyntheticPrompter interface {
	PromptSynthetic(ctx context.Context, sessionID string, opts session.SyntheticPromptOpts) (<-chan acp.AgentEvent, error)
}

type HeartbeatWakeRequest struct {
	WorkspaceID string `json:"workspace_id"`
	AgentName   string `json:"agent_name"`
	SessionID   string `json:"session_id"`
	Source      string `json:"source"` // scheduler, manual, harness_reentry
	DryRun      bool   `json:"dry_run,omitempty"`
}

type HeartbeatWakeResult struct {
	WakeEventID       string                `json:"wake_event_id"`
	Result            string                `json:"result"`
	Reason            string                `json:"reason"`
	PolicySnapshotID  string                `json:"policy_snapshot_id,omitempty"`
	PolicyDigest      string                `json:"policy_digest,omitempty"`
	SyntheticPromptID string                `json:"synthetic_prompt_id,omitempty"`
	Diagnostics       []HeartbeatDiagnostic `json:"diagnostics,omitempty"`
}

type HeartbeatConsultRequest struct {
	WorkspaceID string
	Candidates  []SessionHealth
	Source      string
}

type HeartbeatWakeIntent struct {
	WorkspaceID      string
	AgentName        string
	SessionID        string
	PolicySnapshotID string
	PolicyDigest     string
	Reason           string
}
```

The scheduler calls `ConsultHeartbeatPolicy` only after existing scheduler eligibility checks have selected candidate sessions. The wake service, not `internal/scheduler`, owns policy resolution, coalescing, audit writes, and synthetic prompt dispatch. The synthetic prompt metadata must include:

```go
type HeartbeatSyntheticMetadata struct {
	Reason           string `json:"reason"` // agent_heartbeat_wake
	WakeEventID      string `json:"wake_event_id"`
	PolicySnapshotID string `json:"policy_snapshot_id"`
	PolicyDigest     string `json:"policy_digest"`
}
```

`Reason` is always `agent_heartbeat_wake` for this feature.

### `HEARTBEAT.md` Format

`HEARTBEAT.md` is Markdown with optional strict YAML frontmatter:

```yaml
---
version: 1
enabled: true
summary: "Reorient, inspect assignments, and claim only through AGH task APIs."
preferences:
  min_interval: "30m"
  active_hours:
    - timezone: "America/Sao_Paulo"
      start: "08:00"
      end: "20:00"
  quiet_windows:
    - timezone: "America/Sao_Paulo"
      start: "22:00"
      end: "08:00"
context:
  include:
    - self
    - session_health
    - task
    - inbox_summary
---
```

The body is prompt guidance only. It may describe reentry behavior, checklists, context inspection, and reminders to use official AGH APIs. It must not define operational authority fields such as raw claim tokens, task status transitions, lease duration overrides, scheduler intervals, network membership, provider config, tools, capabilities, or queue ownership.

Resolution rules:

- The digest algorithm is `sha256("agh.heartbeat.v1\n" || canonical_json(frontmatter) || "\n" || normalized_body || "\n" || canonical_json(resolved_config_subset))`.
- `normalized_body` trims trailing whitespace, normalizes line endings to `\n`, preserves authored Markdown order, and excludes YAML delimiters.
- `resolved_config_subset` includes only `[agents.heartbeat]` keys that affect parsing, preference resolution, context projection, wake eligibility, retention, and coalescing.
- Managed writes and rollback create a new snapshot only after validation under the current config subset.
- Direct file authoring is resolved at daemon load and at wake-decision time when the source digest or config digest has changed; this is metadata-only and must not call the model.
- Time-window predicates are evaluated at wake-decision time against the latest valid snapshot and current config subset.
- `active_hours` windows are allow windows; multiple windows use union semantics. If omitted, the policy is allowed all day before quiet-window subtraction.
- `quiet_windows` are deny windows; multiple windows use union semantics and subtract from `active_hours`.
- Windows use IANA timezone names only. Fixed offsets and unknown zones make the preference invalid with diagnostic `heartbeat_invalid_timezone`.
- `HH:MM` uses local wall time. If `end <= start`, the window crosses midnight. DST is evaluated from the actual current instant converted into the named timezone, so repeated or skipped local clock labels do not create duplicate wake opportunities.
- If `allow_active_hours_preferences=false`, `active_hours` and `quiet_windows` are ignored with diagnostic `heartbeat_preference_ignored`.
- If file preferences exceed config bounds, the resolver clamps to config and emits diagnostic `heartbeat_preference_clamped`. Invalid syntax or forbidden operational fields fail validation.

### Data Models

Use side tables for queryable, invariant-bearing state. Do not put ownership, wake eligibility, or resolved policy state in `metadata_json`.

Heartbeat reserves global DB migration v13. Agent Soul owns v12. If implementation order changes, update both specs and ADR references before coding; do not silently reuse v12.

The canonical v13 migration creates standalone heartbeat and health tables:

```sql
CREATE TABLE agent_heartbeat_snapshots (
	id TEXT PRIMARY KEY,
	workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
	agent_name TEXT NOT NULL,
	source_path TEXT NOT NULL,
	schema_version INTEGER NOT NULL DEFAULT 1,
	digest TEXT NOT NULL,
	config_digest TEXT NOT NULL,
	body TEXT NOT NULL,
	frontmatter_json TEXT NOT NULL,
	resolved_json TEXT NOT NULL,
	diagnostics_json TEXT NOT NULL,
	created_at TEXT NOT NULL,
	UNIQUE (workspace_id, agent_name, digest)
);

CREATE INDEX idx_agent_heartbeat_snapshots_agent_created
	ON agent_heartbeat_snapshots(workspace_id, agent_name, created_at DESC, id DESC);

CREATE TABLE agent_heartbeat_revisions (
	id TEXT PRIMARY KEY,
	workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
	agent_name TEXT NOT NULL,
	source_path TEXT NOT NULL,
	operation TEXT NOT NULL CHECK (operation IN ('write', 'delete', 'rollback')),
	previous_digest TEXT,
	new_digest TEXT,
	new_snapshot_id TEXT REFERENCES agent_heartbeat_snapshots(id) ON DELETE SET NULL,
	body TEXT,
	actor_kind TEXT NOT NULL CHECK (actor_kind IN ('user', 'agent', 'extension', 'system')),
	actor_ref TEXT NOT NULL,
	created_at TEXT NOT NULL
);

CREATE INDEX idx_agent_heartbeat_revisions_agent_created
	ON agent_heartbeat_revisions(workspace_id, agent_name, created_at DESC, id DESC);

CREATE TABLE session_health (
	session_id TEXT PRIMARY KEY REFERENCES sessions(id) ON DELETE CASCADE,
	workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
	agent_name TEXT NOT NULL,
	state TEXT NOT NULL CHECK (state IN ('idle', 'prompting', 'stopped', 'detached')),
	health TEXT NOT NULL CHECK (health IN ('healthy', 'degraded', 'stale', 'dead', 'unknown')),
	active_prompt BOOLEAN NOT NULL,
	attachable BOOLEAN NOT NULL,
	eligible_for_wake BOOLEAN NOT NULL,
	ineligibility_reason TEXT,
	last_activity_at TEXT,
	last_presence_at TEXT,
	last_error TEXT,
	updated_at TEXT NOT NULL
);

CREATE INDEX idx_session_health_workspace_agent
	ON session_health(workspace_id, agent_name, health, updated_at DESC);

CREATE INDEX idx_session_health_wake
	ON session_health(workspace_id, agent_name, eligible_for_wake, active_prompt, attachable);

CREATE TABLE agent_heartbeat_wake_state (
	workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
	agent_name TEXT NOT NULL,
	session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
	policy_snapshot_id TEXT REFERENCES agent_heartbeat_snapshots(id) ON DELETE SET NULL,
	last_wake_at TEXT,
	next_allowed_at TEXT,
	coalesced_count INTEGER NOT NULL DEFAULT 0 CHECK (coalesced_count >= 0),
	last_result TEXT NOT NULL CHECK (
		last_result IN ('sent', 'skipped', 'coalesced', 'rate_limited', 'failed')
	),
	last_reason TEXT CHECK (
		last_reason IS NULL OR last_reason IN (
			'wake_sent',
			'heartbeat_disabled',
			'heartbeat_invalid',
			'heartbeat_no_policy',
			'heartbeat_rate_limited',
			'cooldown_active',
			'quiet_window',
			'session_not_found',
			'session_unhealthy',
			'session_not_attachable',
			'session_prompt_active',
			'session_prompt_active_race',
			'synthetic_prompt_failed',
			'wake_coalesced'
		)
	),
	updated_at TEXT NOT NULL,
	PRIMARY KEY (workspace_id, agent_name, session_id)
);

CREATE INDEX idx_agent_heartbeat_wake_state_next_allowed
	ON agent_heartbeat_wake_state(next_allowed_at, updated_at DESC);

CREATE TABLE agent_heartbeat_wake_events (
	id TEXT PRIMARY KEY,
	workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
	agent_name TEXT NOT NULL,
	session_id TEXT REFERENCES sessions(id) ON DELETE SET NULL,
	policy_snapshot_id TEXT REFERENCES agent_heartbeat_snapshots(id) ON DELETE SET NULL,
	source TEXT NOT NULL CHECK (source IN ('scheduler', 'manual', 'harness_reentry')),
	result TEXT NOT NULL CHECK (
		result IN ('sent', 'skipped', 'coalesced', 'rate_limited', 'failed')
	),
	reason TEXT NOT NULL,
	synthetic_prompt_id TEXT,
	created_at TEXT NOT NULL,
	expires_at TEXT NOT NULL
);

CREATE INDEX idx_agent_heartbeat_wake_events_agent_created
	ON agent_heartbeat_wake_events(workspace_id, agent_name, created_at DESC, id DESC);

CREATE INDEX idx_agent_heartbeat_wake_events_expires
	ON agent_heartbeat_wake_events(expires_at);
```

#### `agent_heartbeat_snapshots`

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT PK | Immutable snapshot id |
| `workspace_id` | TEXT NOT NULL | Workspace scope |
| `agent_name` | TEXT NOT NULL | Agent scope |
| `source_path` | TEXT NOT NULL | Resolved `HEARTBEAT.md` path |
| `digest` | TEXT NOT NULL | Content + resolved config digest |
| `config_digest` | TEXT NOT NULL | Canonical digest of the config subset used to resolve this snapshot |
| `schema_version` | INTEGER NOT NULL | Snapshot schema version, v1 for MVP |
| `body` | TEXT NOT NULL | Stored normalized Markdown body |
| `frontmatter_json` | TEXT NOT NULL | Parsed strict frontmatter |
| `resolved_json` | TEXT NOT NULL | Bounded resolved policy |
| `diagnostics_json` | TEXT NOT NULL | Validation diagnostics |
| `created_at` | TIMESTAMP NOT NULL | Snapshot creation time |

#### `agent_heartbeat_revisions`

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT PK | Revision id |
| `workspace_id` | TEXT NOT NULL | Workspace scope |
| `agent_name` | TEXT NOT NULL | Agent scope |
| `source_path` | TEXT NOT NULL | Managed file path |
| `operation` | TEXT NOT NULL | `write`, `delete`, `rollback` |
| `previous_digest` | TEXT | CAS previous digest |
| `new_digest` | TEXT | Resulting digest |
| `new_snapshot_id` | TEXT | Snapshot created by the revision, if any |
| `body` | TEXT | New body for write/rollback |
| `actor_kind` | TEXT NOT NULL | `user`, `agent`, `extension`, `system` |
| `actor_ref` | TEXT NOT NULL | Redacted actor identifier |
| `created_at` | TIMESTAMP NOT NULL | Revision time |

#### `session_health`

| Column | Type | Description |
|--------|------|-------------|
| `session_id` | TEXT PK | Session id |
| `workspace_id` | TEXT NOT NULL | Workspace scope |
| `agent_name` | TEXT NOT NULL | Agent name |
| `state` | TEXT NOT NULL | `idle`, `prompting`, `stopped`, `detached` |
| `health` | TEXT NOT NULL | `healthy`, `degraded`, `stale`, `dead`, `unknown` |
| `active_prompt` | BOOLEAN NOT NULL | Prompt currently in flight |
| `attachable` | BOOLEAN NOT NULL | Runtime can receive prompts |
| `eligible_for_wake` | BOOLEAN NOT NULL | Scheduler/manual wake can target it |
| `ineligibility_reason` | TEXT | Deterministic reason |
| `last_activity_at` | TIMESTAMP | Last active prompt activity |
| `last_presence_at` | TIMESTAMP | Last metadata-only presence touch |
| `last_error` | TEXT | Redacted health error |
| `updated_at` | TIMESTAMP NOT NULL | Last health write |

#### `agent_heartbeat_wake_state`

| Column | Type | Description |
|--------|------|-------------|
| `workspace_id` | TEXT NOT NULL | Workspace scope |
| `agent_name` | TEXT NOT NULL | Agent scope |
| `session_id` | TEXT NOT NULL | Target session |
| `policy_snapshot_id` | TEXT | Policy used for current state |
| `last_wake_at` | TIMESTAMP | Last attempted wake |
| `next_allowed_at` | TIMESTAMP | Cooldown/coalescing boundary |
| `coalesced_count` | INTEGER NOT NULL | Coalesced attempts |
| `last_result` | TEXT NOT NULL | `sent`, `skipped`, `coalesced`, `rate_limited`, `failed` |
| `last_reason` | TEXT | Closed deterministic reason enum, never free text |
| `updated_at` | TIMESTAMP NOT NULL | Last update |

Primary key: `(workspace_id, agent_name, session_id)`.

#### `agent_heartbeat_wake_events`

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT PK | Wake event id |
| `workspace_id` | TEXT NOT NULL | Workspace scope |
| `agent_name` | TEXT NOT NULL | Agent scope |
| `session_id` | TEXT | Target session if known |
| `policy_snapshot_id` | TEXT | Snapshot used |
| `source` | TEXT NOT NULL | `scheduler`, `manual`, `harness_reentry` |
| `result` | TEXT NOT NULL | `sent`, `skipped`, `coalesced`, `rate_limited`, `failed` |
| `reason` | TEXT NOT NULL | Deterministic reason |
| `synthetic_prompt_id` | TEXT | Synthetic prompt id if sent |
| `created_at` | TIMESTAMP NOT NULL | Event time |
| `expires_at` | TIMESTAMP NOT NULL | Retention cutoff |

These tables are not queues. They contain no claimable work and no ownership transition.

Lifecycle rules:

- `agent_heartbeat_snapshots` and `agent_heartbeat_revisions` are deleted by workspace cascade only. Rollback creates a new revision and may point to an existing snapshot; it never mutates historical rows.
- `session_health` is a standalone table keyed by `session_id` and deleted with `sessions(id) ON DELETE CASCADE`. On daemon restart, health is recomputed from runtime/session state before any wake decision; stale rows alone cannot make a session wake-eligible.
- `agent_heartbeat_wake_state` is one row per `(workspace_id, agent_name, session_id)` and is deleted with the session. Snapshot rollback does not delete wake state; the next wake evaluation overwrites `policy_snapshot_id` with the latest selected snapshot.
- `agent_heartbeat_wake_events` keeps audit rows for `wake_event_retention` and then deletes them through a bounded cleanup task. The default retention is 168 hours. Cleanup runs at daemon startup and during the scheduler maintenance cycle, deleting expired rows in bounded batches.
- Cleanup never touches `task_runs`, claim tokens, task events, or session transcripts.

### API Endpoints

#### Heartbeat Policy

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/agents/{agent_name}/heartbeat` | Inspect source, resolved policy, digest, diagnostics |
| `POST` | `/api/agents/{agent_name}/heartbeat/validate` | Validate proposed body/frontmatter |
| `PUT` | `/api/agents/{agent_name}/heartbeat` | Managed write with CAS |
| `DELETE` | `/api/agents/{agent_name}/heartbeat` | Managed delete with CAS |
| `GET` | `/api/agents/{agent_name}/heartbeat/history` | Revision history |
| `POST` | `/api/agents/{agent_name}/heartbeat/rollback` | Roll back to revision/digest |
| `GET` | `/api/agents/{agent_name}/heartbeat/status` | Policy + wake state summary |
| `POST` | `/api/agents/{agent_name}/heartbeat/wake` | Manual advisory wake for eligible session |

CAS semantics use the request body field `expected_digest` on every transport. CLI `--if-match <digest>` maps to `expected_digest`. HTTP `If-Match` headers are rejected with `heartbeat_if_match_header_unsupported` so HTTP, UDS, CLI, and Host API cannot drift into different CAS contracts.

```go
type HeartbeatGetRequest struct {
	WorkspaceID string `json:"workspace_id,omitempty"`
	AgentName   string `json:"agent_name"`
}

type HeartbeatValidateRequest struct {
	Body string `json:"body"`
}

type HeartbeatPutRequest struct {
	WorkspaceID     string `json:"workspace_id,omitempty"`
	AgentName       string `json:"agent_name"`
	Body            string `json:"body"`
	ExpectedDigest  string `json:"expected_digest"`
	IdempotencyKey  string `json:"idempotency_key,omitempty"`
}

type HeartbeatDeleteRequest struct {
	WorkspaceID    string `json:"workspace_id,omitempty"`
	AgentName      string `json:"agent_name"`
	ExpectedDigest string `json:"expected_digest"`
}

type HeartbeatRollbackRequest struct {
	WorkspaceID    string `json:"workspace_id,omitempty"`
	AgentName      string `json:"agent_name"`
	RevisionID     string `json:"revision_id,omitempty"`
	TargetDigest   string `json:"target_digest,omitempty"`
	ExpectedDigest string `json:"expected_digest"`
}

type HeartbeatHistoryRequest struct {
	WorkspaceID string `json:"workspace_id,omitempty"`
	AgentName   string `json:"agent_name"`
	Limit       int    `json:"limit,omitempty"`
	Cursor      string `json:"cursor,omitempty"`
}

type HeartbeatStatusRequest struct {
	WorkspaceID string `json:"workspace_id,omitempty"`
	AgentName   string `json:"agent_name"`
	SessionID   string `json:"session_id,omitempty"`
}

type HeartbeatStatusResponse struct {
	AgentName        string                `json:"agent_name"`
	SourcePath       string                `json:"source_path,omitempty"`
	Enabled          bool                  `json:"enabled"`
	Digest           string                `json:"digest,omitempty"`
	ConfigDigest     string                `json:"config_digest,omitempty"`
	SnapshotID       string                `json:"snapshot_id,omitempty"`
	Summary          string                `json:"summary,omitempty"`
	Preferences      HeartbeatPreferences  `json:"preferences"`
	Diagnostics      []HeartbeatDiagnostic `json:"diagnostics,omitempty"`
	WakeState        *HeartbeatWakeState    `json:"wake_state,omitempty"`
	SessionHealth    *SessionHealth         `json:"session_health,omitempty"`
	RevisionCursor   string                `json:"revision_cursor,omitempty"`
}

type HeartbeatHistoryResponse struct {
	Revisions  []HeartbeatRevision `json:"revisions"`
	NextCursor string              `json:"next_cursor,omitempty"`
}

type HeartbeatWakeState struct {
	SessionID        string `json:"session_id"`
	PolicySnapshotID string `json:"policy_snapshot_id,omitempty"`
	LastWakeAt       string `json:"last_wake_at,omitempty"`
	NextAllowedAt    string `json:"next_allowed_at,omitempty"`
	CoalescedCount   int    `json:"coalesced_count"`
	LastResult       string `json:"last_result"`
	LastReason       string `json:"last_reason,omitempty"`
	UpdatedAt        string `json:"updated_at"`
}
```

#### Session Health

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/sessions/{session_id}/health` | Health and wake eligibility |
| `GET` | `/api/sessions/{session_id}/status` | Compact status |
| `GET` | `/api/sessions/{session_id}/inspect` | Detailed health, policy digest, and diagnostics |
| `GET` | `/api/sessions?include_health=true` | List sessions with health summary |

### UDS Endpoints

Mirror HTTP endpoints under the local UDS API. Agent-authenticated convenience routes may be added for the current caller:

- `GET /api/agent/heartbeat`
- `GET /api/agent/heartbeat/status`
- `POST /api/agent/heartbeat/wake`
- `GET /api/session/health`

UDS responses must use the same DTOs and deterministic error codes as HTTP.

Exact UDS route names mirror HTTP:

- `GET /api/agents/{agent_name}/heartbeat`
- `POST /api/agents/{agent_name}/heartbeat/validate`
- `PUT /api/agents/{agent_name}/heartbeat`
- `DELETE /api/agents/{agent_name}/heartbeat`
- `GET /api/agents/{agent_name}/heartbeat/history`
- `POST /api/agents/{agent_name}/heartbeat/rollback`
- `GET /api/agents/{agent_name}/heartbeat/status`
- `POST /api/agents/{agent_name}/heartbeat/wake`
- `GET /api/sessions/{session_id}/health`
- `GET /api/sessions/{session_id}/status`
- `GET /api/sessions/{session_id}/inspect`

## Safety Invariants

1. `HEARTBEAT.md` never creates, claims, completes, fails, releases, or renews `task_runs`.
2. Scheduler integration never calls `ClaimNextRun`; it only selects eligible sessions and requests synthetic wake.
3. `HeartbeatWakeService` must fail with typed diagnostics when `session.health.eligible_for_wake=false`.
4. `session.health` updates are metadata-only and must not call the model, inject prompts, or renew task leases.
5. `agent_heartbeat_wake_state` and `agent_heartbeat_wake_events` are not queues and contain no claim tokens.
6. `ClaimNextRun` and `HeartbeatRunLease` must not parse or read `HEARTBEAT.md`.
7. Invalid `HEARTBEAT.md` disables heartbeat-policy wake for that agent but does not break normal sessions or task-run APIs.
8. Active/prompting sessions are never interrupted by heartbeat wake; attempts are skipped or coalesced.
9. Wake eligibility evaluation and synthetic prompt enqueue are serialized under the session-scoped prompt gate. If a user or model prompt starts concurrently, wake is skipped with reason `session_prompt_active_race`.
10. Raw claim tokens, provider secrets, and full prompt transcripts must never appear in heartbeat policy, health, wake audit, logs, or API payloads.
11. Network greet presence remains separate from session health and cannot make a session wake-eligible by itself.

## Prompt And Runtime Behavior

A synthetic heartbeat wake prompt is advisory. It must state:

- This wake does not assign ownership.
- This wake grants no claim token; the agent must call `agh task next` to obtain one.
- Inspect `/agent/context`, session health, and heartbeat policy before action.
- Use existing task APIs such as `agh task next`, `agh task heartbeat`, `agh task complete`, `agh task fail`, and `agh task release` before doing task work.
- If no work is claimable, return a concise no-op response.

The wake service uses existing `PromptSynthetic` metadata with a reason such as `agent_heartbeat_wake`. It does not create a new prompt runner.

## Integration Points

- `internal/config`: add `[agents.heartbeat]` config, defaults, merge, validation, and config mutation support.
- `internal/heartbeat`: own policy resolution, authoring, snapshot storage, wake coalescing, wake audit writes, and deterministic diagnostics.
- `internal/session`: add or reinforce `session.health` metadata writes and read models.
- `internal/scheduler`: pass candidate sessions to the heartbeat gate only after existing eligibility checks; never write wake tables directly.
- `internal/daemon`: wire wake service to existing synthetic prompt manager and session-scoped prompt gate.
- `internal/api/contract`, `internal/api/spec`, `internal/api/udsapi`: add DTOs and routes.
- `internal/cli`: add `agent heartbeat` and `session health/status/inspect` verbs.
- `internal/hooks`: add typed wake call-site hooks only.
- `web/`: consume regenerated DTOs in contract tests only; no user-facing route/component changes in MVP.
- `packages/site`: document authored `HEARTBEAT.md`, session health, and the four heartbeat concepts.

## Extensibility Integration Plan

| Surface | Change |
|---------|--------|
| Extension manifests / grants | Add actions for heartbeat policy and session health reads/writes |
| Host API | `agents/heartbeat/get`, `validate`, `put`, `delete`, `history`, `rollback`, `status`, `wake`; `sessions/health/get`, `sessions/status/get` |
| Hooks | `agent.heartbeat.wake.before`, `agent.heartbeat.wake.after`, `session.health.update.after` as typed call-site hooks. `session.health.update.after` fires on state/health/eligibility transitions only and is capped by `session_health_hook_min_interval`; metadata-only touches are coalesced. |
| Skills/capabilities | No capability format change; docs should show agents using CLI/UDS surfaces |
| Tools/resources | Optional read resources for resolved heartbeat policy and session health; no tool may bypass task claim |
| Bundles/registries | Heartbeat policy files can be packaged with agent bundles, preserving CAS/revision semantics on install |
| Bridge SDKs | TypeScript/Go SDK updates from OpenAPI and Host API action definitions |
| MCP sidecars | May expose typed read/write actions through Host API grants; no generic REST escape hatch as the only control |
| AGH Network/protocol docs | No protocol change in MVP; explicitly state greet presence is separate |
| Public docs | Add guide distinguishing task lease, session activity, session health, and `HEARTBEAT.md` wake policy |

## Agent Manageability Plan

CLI:

- `agh agent heartbeat inspect <agent>`
- `agh agent heartbeat validate <agent> --file HEARTBEAT.md`
- `agh agent heartbeat write <agent> --file HEARTBEAT.md --if-match <digest>`
- `agh agent heartbeat delete <agent> --if-match <digest>`
- `agh agent heartbeat history <agent> -o json`
- `agh agent heartbeat rollback <agent> --revision <id> --if-match <digest>`
- `agh agent heartbeat status <agent> -o json`
- `agh agent heartbeat wake <agent> --session <id> -o json`
- `agh session status <session-id> -o json`
- `agh session health <session-id> -o json`
- `agh session inspect <session-id> -o json`

There is no `agh agent heartbeat refresh` command in MVP. Managed writes create new snapshots, and wake decisions evaluate the latest valid snapshot at wake-decision time.

Deterministic errors:

- `heartbeat_disabled`
- `heartbeat_invalid`
- `heartbeat_conflict`
- `heartbeat_if_match_header_unsupported`
- `heartbeat_rate_limited`
- `heartbeat_no_eligible_session`
- `heartbeat_no_policy`
- `cooldown_active`
- `quiet_window`
- `session_not_found`
- `session_unhealthy`
- `session_not_attachable`
- `session_prompt_active`
- `session_prompt_active_race`
- `synthetic_prompt_failed`

All CLI commands that emit machine-readable state support `-o json`; event streams use `-o jsonl` only where streaming is introduced.

## Config Lifecycle

Add `[agents.heartbeat]`:

```toml
[agents.heartbeat]
enabled = true
max_body_bytes = "32KiB"
context_projection_bytes = "4KiB"
min_interval = "5m"
default_interval = "30m"
wake_cooldown = "1m"
max_wakes_per_cycle = 25
active_session_only = true
allow_active_hours_preferences = true
wake_event_retention = "168h"
session_health_stale_after = "2m"
session_health_hook_min_interval = "1m"
```

Config authority rules:

- Config owns timing and limits.
- `HEARTBEAT.md` preferences are clamped to config bounds.
- `[session.supervision]` continues to own active prompt activity heartbeat, warnings, and timeouts.
- Scheduler config continues to own mechanical sweep/wake loop behavior.
- `[network].greet_interval` continues to own peer presence.
- `wake_event_retention` owns audit row cleanup for `agent_heartbeat_wake_events`.
- `session_health_stale_after` owns when idle presence becomes `stale` for wake eligibility.
- `session_health_hook_min_interval` owns hook coalescing for `session.health.update.after`.

Validation:

- Durations must be positive where enabled.
- `min_interval <= default_interval`.
- `max_wakes_per_cycle > 0`.
- Body/projection budgets must be positive and bounded.
- Active-hours and quiet-window preferences must validate IANA timezone names and `HH:MM` windows.
- `wake_event_retention >= 1h`.
- `session_health_stale_after > 0`.
- `session_health_hook_min_interval > 0`.
- `active_session_only=true` is the MVP default.

Config changes affect the heartbeat digest through `resolved_config_subset`. On config reload, the resolver cache is invalidated. The next wake decision re-resolves the latest source if the stored `config_digest` differs from the current config subset before selecting a snapshot.

## Web/Docs Impact

| Surface | Impact | Required Action |
|---------|--------|-----------------|
| `web/` | Generated type and contract-test impact only in MVP; no user-facing route/component changes | Consume regenerated DTOs where tests require it; defer session-health UI to a later web task backed by implemented runtime state |
| `packages/site` | New conceptual docs and CLI/API docs | Document the four heartbeat concepts and managed authoring workflow |
| `openapi/agh.json` | Contract changes | Regenerate through `make codegen` during implementation |
| `web/src/generated/agh-openapi.d.ts` | Generated TypeScript drift | Co-ship with OpenAPI changes |
| CLI reference docs | New commands | Regenerate with `make cli-docs` during implementation |

## Impact Analysis

| Component | Impact Type | Description and Risk | Required Action |
|-----------|-------------|----------------------|-----------------|
| `internal/config` | Modified | New config section and validation | Add defaults, merge, config set support, tests |
| `internal/session` | Modified | Add health/presence read/write model | Metadata-only implementation and tests |
| `internal/scheduler` | Modified | Consult wake policy and health | Preserve no-claim invariant |
| `internal/daemon` | Modified | Wire heartbeat wake to synthetic prompts | Use existing prompt queue |
| `internal/store/globaldb` | Modified | New schema tables | Numbered migration and reopen tests |
| `internal/api` | Modified | New contracts and routes | Codegen co-ship |
| `internal/cli` | Modified | New agent/session commands | JSON parity tests |
| `web/` | Modified | Generated API types and contract tests only; no MVP UI controls | Co-ship generated types; do not render speculative controls |
| `packages/site` | Modified | Docs for policy and health | Explain four heartbeat concepts |

## Testing Approach

### Unit Tests

- Parser accepts valid Markdown/frontmatter and rejects forbidden operational fields.
- Resolver clamps preferences to `[agents.heartbeat]` bounds.
- Resolver computes digest from schema version, normalized body, canonical frontmatter, and canonical resolved config subset.
- Active-hours tests cover multi-window union, quiet-window subtraction, midnight crossing, invalid timezone rejection, disabled preference diagnostics, and DST evaluation from current instant.
- Config defaults, overlay, invalid values, and reload semantics.
- Session health computes `eligible_for_wake` and deterministic reasons.
- Wake service skips unhealthy, active, stopped, detached, or non-attachable sessions.
- Wake audit state never creates claimable work.
- Redaction tests for policy, health, wake audit, logs, and API DTOs.
- Static boundary test asserts only `internal/heartbeat` writes `agent_heartbeat_wake_state` and `agent_heartbeat_wake_events`.

### Integration Tests

- `TestHeartbeatSnapshotsFreshDB` and `TestHeartbeatSnapshotsReopenAfterRestart`.
- `TestHeartbeatRevisionsFreshDB` and `TestHeartbeatRevisionsReopenAfterRestart`.
- `TestHeartbeatWakeStateFreshDB` and `TestHeartbeatWakeStateReopenAfterRestart`.
- `TestHeartbeatWakeEventsFreshDB` and `TestHeartbeatWakeEventsReopenAfterRestart`.
- `TestSessionHealthFreshDB` and `TestSessionHealthReopenAfterRestart`.
- HTTP/UDS/CLI parity for inspect, validate, write, delete, history, rollback, status, wake.
- HTTP rejects `If-Match` headers and accepts `expected_digest` request bodies consistently across HTTP, UDS, CLI, and Host API.
- Scheduler wake uses policy only after normal eligibility checks.
- Manual wake creates wake event and synthetic prompt for healthy idle session.
- Busy session wake is coalesced/skipped and does not interrupt active prompt.
- Concurrent prompt-start race records `session_prompt_active_race` and sends no synthetic prompt.
- `HeartbeatWakeService.Wake` race test starts N goroutines against the same session and proves deterministic coalescing under `-race`.
- Invalid policy disables heartbeat wake but does not block normal conversation or task APIs.
- `ClaimNextRun` and `HeartbeatRunLease` behavior unchanged and perform zero file I/O on `HEARTBEAT.md`.
- Boundary test proves `internal/task` and `internal/scheduler` cannot mutate heartbeat wake tables directly.
- Daemon restart preserves snapshots/revisions/wake audit and recomputes safe runtime health.

### Verification

After implementation:

- Run `python3 .agents/skills/cy-spec-preflight/scripts/check-techspec-markers.py .compozy/tasks/agent-soul/_techspec_heartbeat.md`.
- Run focused markdown/section checks.
- Run `make codegen` after API/contract changes and commit generated `openapi/agh.json` plus `web/src/generated/agh-openapi.d.ts`.
- Run `make codegen-check`.
- Run `make cli-docs` after CLI command additions and commit generated site CLI references.
- Run focused `go test -race ./internal/heartbeat ./internal/session ./internal/scheduler ./internal/task`.
- Run `make verify` before completion of implementation work.

## Implementation Steps

1. Add `[agents.heartbeat]` config structs, defaults, overlays, CLI config mutation entries, and validation.
2. Add global DB migration v13 for `agent_heartbeat_snapshots`, `agent_heartbeat_revisions`, `session_health`, `agent_heartbeat_wake_state`, and `agent_heartbeat_wake_events` using the canonical standalone-table DDL above.
3. Implement `HeartbeatPolicyResolver` and strict parser/diagnostics.
4. Implement `HeartbeatAuthoringService` with CAS, history, delete, and rollback.
5. Implement `SessionHealthService` as metadata-only runtime state.
6. Implement `HeartbeatWakeService` with health checks, latest-snapshot selection at wake-decision time, cooldown, coalescing, audit, session-scoped prompt-gate serialization, and synthetic prompt dispatch.
7. Integrate scheduler wake decisions with heartbeat policy after existing eligibility checks.
8. Add HTTP/UDS contracts and regenerate OpenAPI/TypeScript.
9. Add CLI commands with `-o json` parity.
10. Add Host API actions, grants, and typed hook payloads.
11. Update web generated types and contract tests only; do not add user-facing controls in MVP.
12. Update site docs and CLI docs.
13. Add unit, integration, parity, redaction, and restart tests.

## Development Sequencing

### Build Order

1. Config and domain types - no dependencies.
2. Schema migration and stores - depends on step 1.
3. Resolver and authoring service - depends on steps 1 and 2.
4. Session health service/read model - depends on step 2.
5. Wake service and synthetic prompt integration - depends on steps 3 and 4.
6. Scheduler integration - depends on step 5.
7. HTTP/UDS contracts and codegen - depends on steps 3, 4, and 5.
8. CLI commands - depends on step 7.
9. Host API, hooks, and extension grants - depends on steps 5 and 7.
10. Web/docs updates - depends on generated contracts from step 7.
11. Integration/e2e tests - depends on steps 1 through 10.

### Technical Dependencies

- Agent Soul managed authoring patterns, if merged first.
- Existing scheduler and synthetic prompt paths.
- Existing global DB migration registry.
- OpenAPI/codegen pipeline.

## Monitoring and Observability

Structured logs:

- `agent_heartbeat.policy_resolved`
- `agent_heartbeat.policy_invalid`
- `agent_heartbeat.wake_requested`
- `agent_heartbeat.wake_sent`
- `agent_heartbeat.wake_skipped`
- `agent_heartbeat.wake_coalesced`
- `session.health.updated`
- `session.health.unhealthy`

Metrics:

- heartbeat policy validation failures by reason.
- wake attempts by result/source.
- wake eligibility failures by reason.
- `agent_heartbeat_wake.evaluate_duration` histogram for scheduler/manual wake decision latency.
- session health states by count.
- synthetic heartbeat prompt failures.
- CAS conflicts for managed authoring.

No metric or log includes raw claim tokens, provider secrets, or full prompt transcripts.

## Technical Considerations

### Key Decisions

- `HEARTBEAT.md` is advisory wake policy only.
- Snapshots/revisions/wake audit use side tables, not JSON metadata.
- `session.health` is a separate runtime primitive.
- Managed surfaces cover both policy and health.
- Config owns timing and limits; files express bounded preferences.

### Known Risks

- The word "heartbeat" remains overloaded. Mitigation: docs and API names must distinguish lease heartbeat, activity heartbeat, session health, and wake policy.
- Wake audit tables could drift into queue semantics. Mitigation: schema, service names, and tests forbid claim/status ownership fields.
- Session health may initially be conservative. Mitigation: `unknown` and `not_attachable` states produce safe skip diagnostics.
- Managed authoring expands surface area. Mitigation: follow Agent Soul parity and CAS patterns.

## Reference Research

- `.compozy/tasks/agent-soul/analysis/analysis_agh_heartbeat.md`
- `.compozy/tasks/agent-soul/analysis/analysis_openclaw_heartbeat.md`
- `.compozy/tasks/agent-soul/analysis/analysis_hermes_heartbeat.md`
- `.compozy/tasks/agent-soul/analysis/analysis_paperclip_heartbeat.md`
- `.compozy/tasks/agent-soul/_techspec_soul.md`
- `.compozy/tasks/agent-soul/adrs/adr-005.md`
- `docs/_memory/lessons/L-003-task-runs-single-queue.md`
- `docs/_memory/lessons/L-005-authoritative-primitive-exclusivity.md`
- `docs/_memory/lessons/L-008-schema-migrations-mandatory.md`

## Architecture Decision Records

- [ADR-007: Treat HEARTBEAT.md as Advisory Wake Policy](adrs/adr-007.md) - `HEARTBEAT.md` guides wake/reentry but never owns liveness, leases, sessions, or work queues.
- [ADR-008: Persist Heartbeat Policy Snapshots and Wake Audit Without a Queue](adrs/adr-008.md) - Heartbeat uses snapshots/revisions and lightweight wake audit side tables, not queue semantics.
- [ADR-009: Separate Session Health From HEARTBEAT.md](adrs/adr-009.md) - session health is a daemon-owned runtime primitive consumed by wake policy.
- [ADR-010: Provide Managed Heartbeat and Session Health Surfaces in MVP](adrs/adr-010.md) - CLI/HTTP/UDS/Host API parity covers both policy and health.
- [ADR-011: Make Config the Authority for Cadence and Wake Limits](adrs/adr-011.md) - `[agents.heartbeat]` owns timing and limits; `HEARTBEAT.md` expresses bounded preferences.
