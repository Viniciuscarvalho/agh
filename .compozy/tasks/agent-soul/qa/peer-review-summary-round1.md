# Peer Review Summary - Round 1

## Readiness

NEEDS_REWORK

## Verdict

The spec is structurally solid after the preflight amendment: it has an MVP boundary, architectural boundaries, a side-table-vs-JSON decision, numbered safety invariants, and a clean `HEARTBEAT.md` deferral. It is not ready for task generation because load-bearing claim-time soul provenance, Go type definitions, migration ownership, invalid-soul behavior, UDS parity, and refresh lifetime are still under-specified.

## Blockers

- B-001: `ClaimNextRun` provenance semantics are ambiguous; the spec must say the claim transaction copies an already-resolved session snapshot and performs no `SOUL.md` parsing, validation, digesting, or filesystem I/O.
- B-002: Core interfaces reference undefined `ResolvedSoul` and `SoulSnapshot` types; the spec must define all load-bearing Go structs, parser contracts, prompt assembly contracts, and DTO shapes.
- B-003: The schema change does not name the database or migration registry; the spec must bind the migration to the correct SQLite database/registry and require fresh-DB plus reopen-after-restart tests.
- B-004: "Fails closed" is ambiguous; the spec must define behavior for each invalid/missing/oversized/path-traversal failure class across CLI, inspect, session creation, claim, and refresh.
- B-005: API surface parity is incomplete; the spec lists HTTP routes but not explicit UDS verbs and transport-parity tests.
- B-006: Session soul refresh lifetime and locking are under-specified; the spec must define request-context vs detached-context work, bounded deadlines, session refresh locking, and race behavior with `ClaimNextRun`.

## Nits

- N-001: Convert `Test Strategy` from category bullets into explicit test names/assertions.
- N-002: Cite existing spawn structs for `spawn_role` and `prompt_overlay`, or define them if new.
- N-003: Clarify that `task_runs.metadata_json` maps to the Go field `Metadata json.RawMessage`.
- N-004: Add observability redaction guarantees for workspace-relative source paths and cite the logger/metrics surface.
- N-005: Add rationale for `max_body_bytes` and `context_projection_bytes`, anchored to OpenClaw/Hermes evidence.
- N-006: Add Web/Docs Impact subitems to each implementation step.
- N-007: Name the extension Host API verb and hook payload fields for read-only resolved soul access.
- N-008: Add `--json` and `--workspace` to all soul CLI verbs and align schemas with API/UDS DTOs.
- N-009: Anchor the `HEARTBEAT.md` deferral to a future TechSpec slug such as `agent-heartbeat`.
- N-010: Promote or explicitly locate `parent_soul_digest` in the data model / spawn lineage structure.

## Recommended Sections Affected

- `Core Interfaces`
- `Data Models`
- `API Endpoints`
- `Prompt And Runtime Behavior`
- `Agent Manageability Plan`
- `Config Lifecycle`
- `Spawn Semantics`
- `HEARTBEAT.md Decision`
- `Test Strategy`
- `Implementation Steps`
- `Monitoring And Observability`
- `Lease And Safety Invariants`

## Recommended ADRs Affected

- `adr-002.md`: read model / DTO exposure details.
- `adr-003.md`: session-start and task-claim snapshot semantics.
- `adr-004.md`: spawned session provenance field details.
- `adr-005.md`: future `HEARTBEAT.md` deferral anchor.

## Artifact Paths

- Raw executor stream: `.compozy/tasks/agent-soul/qa/peer-review-result-round1.json`
- Executor stderr: `.compozy/tasks/agent-soul/qa/peer-review-result-round1.err`
- Extracted model message: `.compozy/tasks/agent-soul/qa/peer-review-message-round1.md`
- Parsed model JSON: `.compozy/tasks/agent-soul/qa/peer-review-parsed-round1.json`
- Summary: `.compozy/tasks/agent-soul/qa/peer-review-summary-round1.md`
