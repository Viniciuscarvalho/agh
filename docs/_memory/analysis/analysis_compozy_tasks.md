# Analysis: AGH Compozy Tasks (.compozy/tasks)

## Scope

Forensic read of `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/` covering:

- **Active workstreams (full read):** `autonomous/` (current MVP, 18 tasks + 12 ADRs + 34 review issues + 19 memory snapshots), `hermes/` (11 tasks + 5 ADRs + 53 review issues across 2 rounds), `unified-capabilities/` (10 tasks + 3 ADRs + 4 review rounds), `session-driver-override/` (8 tasks + 5 ADRs + 4 review rounds).
- **Review-only directories (sampled):** `qa-review/reviews-001` (25 issues), `network-redesign/reviews-001..002` (34 issues), `network-default/reviews-001` (4), `delete-session/reviews-001..003` (29), `release-adjustments/reviews-001..003` (23).
- **Archived (sampled):** 46 directories under `_archived/`. Read meta + task lists for `20260411-014454-ext-architecture` (11/11 done), `20260417-180201-improvs` (36/36 done), `20260418-161152-tasks-ui` (19/19 done), `1776788383758-7ec49d11-harness` (10 tasks), `1776789714756-4ddeaeed-agent-capabilities` (7 tasks), `1776788383759-3e7caf89-redesign` (32 tasks), `1776787980139-2df15575-unified-capabilities` (empty leftover shell).

Read depth: every ADR file in active dirs in full, every memory snapshot in `autonomous/`, every active `_tasks.md` and verification report, plus a representative sample of review issues across providers (CodeRabbit dominant).

## Task Inventory & Status

### Active (top-level, post-`_archived` pivot — Apr 19+ 2026)

| Task                       | Status                                                                                                       | Tasks completed                                     | ADRs | Review rounds                            | Notes                                                                                                                                                                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- | ---- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `autonomous/`              | In-progress (PR #75 round 1 open)                                                                            | 18/18 implementation, QA pass logged                | 12   | 1 round, 34 issues                       | Largest current effort: local-first autonomy MVP (situation surface, agent CLI verbs, claim/lease, scheduler, coordinator, safe spawn). Verification report written; round 1 review fixes already commited (`060729d7`, `d7b1d56e`). |
| `hermes/`                  | Completed                                                                                                    | 11/11                                               | 5    | 2 rounds, 53 issues, both fully resolved | Hardening pass against Hermes external research gaps (persistence, observability, ACP/session lifecycle, automation scheduler, MCP OAuth, tool-process registry).                                                                    |
| `unified-capabilities/`    | Mostly completed (task 03/09 pending in `_tasks.md`, but task 10 marked completed — likely table-text drift) | 8 fully completed + 1 marked completed out-of-order | 3    | 4 rounds, 42 issues, 100% resolved       | Collapsed `recipe` and `capability` into a single concept.                                                                                                                                                                           |
| `session-driver-override/` | Completed                                                                                                    | 8/8                                                 | 5    | 4 rounds, 62 issues, 100% resolved       | Per-session ACP runtime override with persisted-provider semantics.                                                                                                                                                                  |
| `delete-session/`          | Completed (no `_tasks.md`, only review rounds)                                                               | n/a                                                 | 0    | 3 rounds, 29 issues                      | Targeted single-feature PR (`pr 58`).                                                                                                                                                                                                |
| `network-redesign/`        | Completed                                                                                                    | n/a                                                 | 0    | 2 rounds, 34 issues, 100% resolved       | Reviews-only directory.                                                                                                                                                                                                              |
| `network-default/`         | Completed                                                                                                    | n/a                                                 | 0    | 1 round, 4 issues                        | Tiny PR.                                                                                                                                                                                                                             |
| `release-adjustments/`     | Open (round 1 only — 23 issues, none resolved)                                                               | n/a                                                 | 0    | 3 rounds dirs (only round 1 has issues)  | Release-time fix-ups for PR #66.                                                                                                                                                                                                     |
| `qa-review/`               | Open (PR #73, round 1, 25 issues, none resolved)                                                             | n/a                                                 | 0    | 1 round                                  | Cross-cutting QA review.                                                                                                                                                                                                             |

### Archived selection (representative, all 46 carry `Pending: 0` in `_meta.md`)

- `20260411-014454-ext-architecture` (11/11) — Extension architecture pre-Hermes.
- `20260417-180201-improvs` (36/36) — Per-package quality pass running the five-skill pipeline (`refactoring-analysis`, `extreme-software-optimization`, `ubs`, `deadlock-finder-and-fixer`, `security-review`) against every `internal/*` package.
- `20260417-180201-e2e` (14/14), `20260418-161152-tasks-ui` (19/19), `20260418-161152-settings-ui` — UI-side hardening passes.
- `20260411-014454-ext-architecture`, `20260417-021722-ext-parity`, `20260417-021722-sandbox`, `20260417-021722-site` — extension/site infrastructure.
- `1776787980139-2df15575-unified-capabilities` is an empty stub (only contains empty `adrs/` and `reviews-001/2`) — superseded by the top-level `unified-capabilities/` directory.
- `1776788383759-3e7caf89-redesign` (32 tasks, all completed) — full visual redesign pass.
- `20260402-013544-spec-v2`, `20260404-033408-agh-v2`, `20260407-030550-refac`, `20260407-185953-refac-v2`, `20260408-201357-skills-v2` — successive "v2" rewrites of major subsystems, each completed before being archived.
- Several skill-systems and memory-extensibility passes (`20260406-230650-skills-system`, `20260408-201357-skills-v2`, `20260405-031926-agh-memory-extensibility`).

The "v2" naming pattern signals Pedro's approach to greenfield: when a subsystem doesn't fit, he discards the old task tree, opens a v2, and archives the predecessor rather than evolving in-place. No archived task directory contains explicit "abandoned/superseded" marker text; status is implied by being moved into `_archived/` while the live code reflects the v2 outcome.

## ADR Landscape

The autonomous TechSpec is the densest ADR cluster in the repo. Consistent themes across `autonomous/`, `hermes/`, `unified-capabilities/`, and `session-driver-override/`:

### Theme 1: Reuse the existing substrate; never fork it

Quoted explicitly:

- `autonomous/adrs/adr-003.md`: "Extend the current `task_runs` model and task service/globaldb APIs. `task_runs` remains the durable source of truth for run queueing, ownership, execution, and completion." The alternative — a separate scheduler-owned durable queue — was explicitly rejected because it would "duplicate task ownership state."
- `autonomous/adrs/adr-009.md`: "Autonomy must expose first-class hook and extension contracts through the existing hook and resource systems… If those behaviors are implemented only as closed daemon internals, autonomy becomes hard to extend… That would violate AGH's existing extensibility model and create a workaround instead of a root-cause architecture."
- `session-driver-override/adrs/adr-001.md`: "AGH will model per-session ACP driver selection as an optional **session-level provider override** layered on top of the existing agent-resolution flow… The session manager keeps the current global ACP `AgentDriver`; it does not grow a per-session driver registry."
- `unified-capabilities/adrs/adr-001.md`: "`Capability` becomes the single surviving concept for authored delegation offers and transferable network artifacts" — collapsing `recipe` rather than maintaining a parallel concept.
- `hermes/adrs/adr-001.md`: "Create one Hermes Hardening TechSpec with domain tracks and shared foundations first" rather than an issue-by-issue fix campaign.

### Theme 2: Separate semantic intent from operational safety primitives

`autonomous/adrs/adr-004.md` is canonical: "A coordinator-agent owns semantic orchestration… A daemon-owned mechanical scheduler owns operational safety: idle registry, capability-aware wakeups, lease sweep, recovery, backpressure signals, and deterministic state transitions. `ClaimNextRun` remains the single authoritative claim primitive."

This pattern recurs in `hermes/adrs/adr-002.md` ("Use Durable Scheduler State for Automation At-Most-Once Dispatch") and `hermes/adrs/adr-004.md` ("Own Tool Processes and Interrupts in a Shared Runtime Package") — every time a higher-level decision-maker exists, the daemon owns the safety/durability layer underneath it.

### Theme 3: Manual operator control is first-class and never demoted

`autonomous/adrs/adr-010.md` is the load-bearing one: "Autonomy is additive. Manual operator control remains a first-class path… User-created tasks, automation-created tasks, coordinator-created tasks, and agent-created child tasks all use the same task/run model… Manual task assignment and autonomous claim converge on the same claim token, lease, heartbeat, completion, failure, and release rules."

This is reinforced by `autonomous/adrs/adr-002.md` (CLI verbs ship before built-in MCP tools — operator-facing always first) and `autonomous/adrs/adr-006.md` (children may only narrow parent permissions, never widen — preserves operator constraint propagation).

### Theme 4: Ship contracts and docs alongside the code, not after

`autonomous/adrs/adr-011.md`: "Every autonomy MVP step that changes `internal/api/contract` must co-ship generated contract updates: regenerate `openapi/agh.json`, regenerate `web/src/generated/agh-openapi.d.ts`, update affected `web/src/systems/*/types.ts` consumers and Storybook/MSW fixtures, pass `make web-typecheck` and `make web-test` in the same implementation unit."

This codifies the consequence of having a generated-contract pipeline: the only safe rule is "generation is part of the task, not follow-up work."

### Theme 5: Greenfield-direct migrations, but with surgical legacy repair where it actually saves work

`session-driver-override/adrs/adr-005.md`: "AGH will migrate provider persistence in two explicit steps: The global `sessions` table adds `provider TEXT NOT NULL DEFAULT ''` through the existing session-column migration path. Legacy inactive session metadata with a blank provider is repaired once by resolving the effective provider from the stored agent plus resolved workspace config… After that one-time repair, normal strict semantics apply."

Despite the CLAUDE.md rule "never write migration, compat, or defensive code for old state — delete the old thing instead of working around it," the ADRs show one allowed exception: in-place ALTER + one-shot repair when the cost of `delete the old thing` is "every developer rebuilds their local SQLite." The repair is bounded and immediately followed by strict semantics.

### Theme 6: Fail explicitly; never silently fall back

`session-driver-override/adrs/adr-003.md`: "If validation fails, AGH returns an explicit error and does not fall back to the current agent default." `autonomous/adrs/adr-006.md`: "Unknown child atoms count as widening and reject the spawn. The daemon rejects invalid spawn requests; it must not silently narrow and continue."

## PRD/TechSpec Quality Patterns

The autonomy `_techspec.md` is the cleanest example. Patterns that correlate with smooth execution (low review-round count, single fix commit) vs. heavy rework:

### Markers of "good enough to execute"

1. **Boundary statements at the top.** `autonomous/_techspec.md` opens with "MVP boundary: tasks 01-16 implement the autonomy kernel. Tasks 17-18 prepare and execute QA. Post-MVP network evolution, broad memory scopes, self-correction telemetry, eval/replay, and broad web visibility remain follow-up TechSpecs unless explicitly pulled into scope later." This sentence single-handedly prevents scope creep across 18 tasks.
2. **Architectural Boundaries section listed verbatim.** Autonomy lists: "`internal/daemon` remains the composition root. `internal/session`, `internal/task`, `internal/network`, `internal/memory`, `internal/hooks`, and `internal/resources` do not import `daemon`. Scheduler logic lives behind narrow interfaces consumed from `internal/scheduler`. Hooks are extension/observation boundaries, not the source of safety invariants. Durable ownership state lives in `task_runs`; scheduler state is rebuildable. The coordinator-agent is a managed session, not a privileged in-process scheduler. Manual operator flows are peers of autonomous flows."
3. **Concrete Go interface signatures in TechSpec.** `ClaimCriteria`, `ClaimedRun`, `TaskClaimer`, `SpawnOpts`, `PermissionNarrower` are pasted as code blocks. Tasks 07-09 had exactly one round of fixes because there was no contract ambiguity.
4. **Data model fields enumerated with rationale.** `task_runs` extension lists `claim_token`, `lease_until`, `heartbeat_at`, `coordination_channel_id` and explicitly says "Do not add duplicate ownership or actor columns. The existing `task_runs.session_id` is the canonical owning session." This blocks future authors from re-litigating column choices.
5. **Side-table strategy made explicit.** `task_run_required_capabilities` and `task_run_preferred_capabilities` chosen over JSON blobs _with rationale_ ("`ClaimNextRun(criteria)` uses these tables for exact capability filtering"). Eliminates a common review-round complaint about JSON parsing in hot paths.
6. **Lease invariants as a numbered list** rather than prose: exactly one active claim, heartbeat compares both run-ID and token, stale heartbeats fail explicitly, sweep uses CAS predicates, boot recovery before scheduler accepts traffic, max one lease per session in MVP.

### Markers of trouble

- Tasks where the techspec only described the goal in prose (no signature, no listed fields) and the test-table churned through review rounds. `release-adjustments/` and `qa-review/` are review-only — there was no techspec at all and review rounds run unresolved.
- `unified-capabilities/_tasks.md` shows `task_03` and `task_09` `pending` while `task_10` is `completed`. This is execution drift: tasks that should have been completed in order weren't, and the table wasn't reconciled. Suggests `_tasks.md` is occasionally treated as a worklist rather than ground truth.

## Recurring Review Issues (autonomous, hermes, etc.)

Provider mix: nearly every reviewed PR routes through `coderabbit` (issue front-matter consistently shows `author: coderabbitai[bot]`). Decisions are recorded as `VALID`/`valid`/`INVALID`/`invalid` in the per-issue triage section.

Aggregate disposition (sampled across `autonomous` round 1, `hermes` rounds 1-2, `release-adjustments` round 1, `network-redesign` rounds 1-2, `delete-session`, `session-driver-override`, `unified-capabilities` reviews):

- ~158 valid, ~26 invalid, ~18 unreviewed/open (≈ 78% acceptance rate; reviews are taken seriously).

### Recurring categories (counted)

1. **Test pattern violations (>40% of all issues).** "Use `t.Run("Should...")` subtests" appears repeatedly. Examples (autonomy round 1): issues 002, 007, 009, 023, 024, 025, 026, 028. Hermes: issues 003, 005, 009, 016, 029. The repo has a coding rule "MUST use `t.Run("Should...")` pattern for ALL test cases" but new tests still ship without it. Same review reliably catches `t.Parallel()` missing on subtests.
2. **`_` ignored errors** (CLAUDE.md: "Never ignore errors with `_`"). Autonomy issue 020 ("Handle the json.Marshal failure here instead of discarding it"), Hermes issue 002, Hermes round-2 issue 010 (logout silently fails when remote revoke errors).
3. **Unreachable nil checks after `make`/`append` initialization.** Autonomy issues 004 and 005 (consecutive — same author wrote both helpers and reproduced the same dead branch). Indicates a personal anti-pattern that no linter currently catches.
4. **Double work / redundant filtering.** Autonomy issue 003 (envelopes filtered twice when `agentChannelInbox` and `agentChannelMessagesFromEnvelopes` both call `filterAgentChannelEnvelopes`). Suggests refactoring without checking call sites.
5. **String-comparison error matching.** Autonomy issue 030, Hermes issue 030 ("Use structured error checking instead of string matching"). CLAUDE.md says `errors.Is`/`errors.As` only — but strings keep slipping in.
6. **Schema/migration drift.** Hermes issue 020 (critical): "memory_operation_log" widened in code but no migration on existing DBs — `EnsureSchema` skipped existing tables. Recurring across hermes/autonomy: when SQL changes ship, migrations get under-tested.
7. **Resource cleanup on error path.** Hermes issue 001 ("Cancel the per-process context when registry setup fails"), Hermes round-2 issue 010 (local logout returns before `DeleteMCPAuthToken`). Pattern: happy path is fine, but partial-failure cleanup is incomplete.
8. **Defensive/whole-map fallback that swallows real bugs.** Autonomy issue 006 (`coordinationMetadataFromEnvelope` Ext fallback marshals the entire map and could match unrelated extension data).
9. **HTTP status mapping inconsistency.** Autonomy issue 008 ("Return 503 when the session service is not configured"). Multiple endpoints inconsistent on availability vs. internal failures.
10. **Compile-time interface assertions missing.** Autonomy issues 031, 033 (add `var _ Interface = (*Type)(nil)`). CLAUDE.md mandates this — still slipped.
11. **`force: true` in Playwright/E2E tests** (release-adjustments issue 020). Bypassing actionability checks hides UI regressions.
12. **`context.WithoutCancel` misuse.** Hermes round-2 issue 001 (critical). Reviewer attached web-search evidence inline, indicating this is a real Go gotcha worth a permanent rule.
13. **Whitespace/blank input not normalized at CLI boundary.** Autonomy issue 030 (`--capability "   "` survives trim as `""`).

### Blind spots Pedro himself flags in memory snapshots

From `autonomous/memory/MEMORY.md` and per-task memory:

- `task_01.md`: "First `make verify` failed on `gocritic hugeParam` because the daemon resolver constructor accepted `aghconfig.Config` by value." Recurring lint issue.
- `task_14.md`: Errcheck, funlen, line-length, unused-parameter all hit at first lint pass; pre-commit hook reformats files so a post-commit `make verify` re-run is needed.
- `task_18.md`: E2E harness regressions cluster around timing (workspace onboarding race, ACP mock prompt-matching after a new prompt augmenter shipped, browser test asserting an old empty state). Three separate E2E fixes (`BUG-001`, `BUG-002`, `BUG-003`) all rooted in tests being written against an older runtime contract.

## Architecture Themes

Cross-cutting threads visible in three or more task directories:

### A. Session lifecycle is a stable spine; everything decorates it

Hermes Track 03 ("ACP and Session Lifecycle Hardening"), session-driver-override (effective provider becomes part of session identity), autonomous task_12-13 (lineage + safe spawn), and autonomous task_14 (coordinator is a managed session, not a privileged scheduler) all reuse `internal/session` rather than introducing parallel session managers. The architecture is "make sessions richer," not "make a new session-shaped thing."

### B. ACP is the only subprocess transport; runtime selection moves up to provider/agent layer

Session-driver-override ADR-001 explicitly: "The session manager keeps the current global ACP `AgentDriver`; it does not grow a per-session driver registry." Hermes ADR-004 puts process management in a _shared_ runtime package, not inside ACP. The pattern: ACP stays narrow; everything else flows through provider config and resolved-agent semantics.

### C. Observability is layered, not centralized

`internal/observe` is treated as an event recorder and query engine. Hermes ADR-002 (durable scheduler state) and ADR-005 (memory health/history CLI before runtime context refs) push health/visibility surfaces into existing CLI/UI before designing dashboards. Autonomy ADR-009 keeps "scheduler wake/no-match/recovery signals" as internal observability instead of hooks until an external policy use case appears.

### D. Memory provenance precedes memory features

Autonomy ADR-008: "Start memory autonomy with provenance and session-level usefulness… Defer full peer/channel memory and network echo/receipt promotion until workflows produce enough signal." Hermes ADR-005 makes the same call from a different angle (ship the CLI surface for existing memory health/history before adding `@file`/`@folder`/`@git`/`@url` context refs).

### E. Hooks are typed contracts, not generic event taps

Autonomy ADR-009 demands typed `coordinator.*`, `task.run.*`, `spawn.*` events with payloads/patches/dispatchers and explicitly disallows tailing event tables. The hermes work also pushed the hook system as the extension surface rather than a NATS-style bus. Cross-cutting principle: there is no event bus in AGH; there are typed dispatch points with explicit denial/narrowing semantics.

### F. Greenfield with one-pass repair is acceptable; speculative compat is not

`session-driver-override/adrs/adr-005.md` documents one-pass legacy repair. Otherwise, every ADR explicitly forbids compat layers, dual code paths, or "preserve old behavior" branches. The discipline is "delete the old thing, repair once if forced, then go strict."

## Skill Candidates

Each candidate is justified by 3+ task directories where the absence of a codified skill rule produced review issues or rework.

### 1. `agh-test-conventions` (or extend `golang-pro` / `testing-anti-patterns`)

**Evidence:** ~29 review issues (autonomy round 1 alone has 8) on `t.Run("Should...")` subtests, `t.Parallel()`, `t.Helper()`, ignored `json.Marshal` errors in tests, non-deterministic timestamps in tests, and `force: true` in Playwright. This is the single most common review category.

**Action:** Codify a "before writing or editing a Go test in AGH" preflight skill with a 5-item checklist mapped to actual review-issue patterns: (1) named subtests, (2) parallel where independent, (3) handle marshal/JSON errors, (4) deterministic time/IDs, (5) compile-time interface assertions for new types under test.

### 2. `autonomy-claim-fencing-review` (operational invariants)

**Evidence:** ADR-003 (autonomy), ADR-004 (autonomy), tasks 07-09 of autonomy, ADR-002 of hermes (at-most-once dispatch). Five places where the same invariants get re-derived: token-fenced mutations, exactly-one-active-claim, heartbeat compares both run-ID and token, sweep uses CAS, boot recovery before scheduler.

**Action:** A skill that, when triggered by lease/claim/scheduler edits, walks the seven autonomy lease invariants in `_techspec.md` lines 302-312 against the diff.

### 3. `agh-contract-cogenshipping`

**Evidence:** ADR-011 (autonomy), the recurring memory line "co-ship generated contract updates," and the fact that `make codegen-check` runs as a final gate in QA. Multiple tasks list "regenerate `openapi/agh.json` and `web/src/generated/agh-openapi.d.ts`" as a manual step.

**Action:** A skill that detects edits in `internal/api/contract/**`, `internal/api/spec/**`, or `web/src/generated/**` and enforces the regenerate-and-test bundle in the same PR.

### 4. `agh-error-handling-review`

**Evidence:** Autonomy issues 008, 020, 030; hermes issues 002, 010 round-2; recurring "use structured error checking" reviews. The CLAUDE.md rules are correct but not enforced at write time.

**Action:** A pre-edit skill that, when changes touch error returns, validates: `fmt.Errorf("...: %w", err)` wrapping, no `_` for errors, no `errors.New` strings later compared with `==`, no `strings.Contains(err.Error(), …)`.

### 5. `agh-techspec-quality-checklist`

**Evidence:** The autonomy techspec executes cleanly with one round of reviews; release-adjustments and qa-review (no techspec) have unresolved review queues. Six concrete markers (boundary statement, listed architectural boundaries, Go interface signatures, data-model field rationale, side-table strategy decisions, lease/safety invariants enumerated) correlate with low rework.

**Action:** A skill that grades a draft techspec against the six markers and refuses to mark it ready-to-execute until all six are present.

### 6. `agh-cleanup-on-failure-paths`

**Evidence:** Hermes issue 001 (cancel proc context on register-fail), hermes round-2 issue 010 (delete local token even when remote revoke fails), autonomy issues around expired-lease recovery. All "happy path is fine; partial failure leaks resources" patterns.

**Action:** When editing a function with a multi-step setup or teardown, the skill checks every error-return for resources allocated above the return point.

## Lesson-Learned Candidates

Worth preserving as durable lessons (matching the `lesson-learned` skill format):

1. **`task_runs` is the single durable queue.** Three ADRs (autonomy 003/004/010) all explicitly forbid a parallel queue. Lesson: when an existing table can carry new state through extra columns + side tables, never add a second table even if it would feel cleaner — the second table will diverge.
2. **Coordinator/scheduler split (ADR-004).** Distinguish "what work to do" (semantic, agent-driven) from "is it safe to start" (mechanical, daemon-owned). Reusable far beyond autonomy: applies to any scheduler-plus-policy design.
3. **Manual control is a peer, not a backdoor (ADR-010).** Autonomous and manual paths must converge on the same primitives (claim tokens, leases, hooks). Don't build a "user mode" + "agent mode" split.
4. **Permission narrowing on concrete atoms only (ADR-006).** Free-form permission text always becomes ambiguous. The atom space (tools, skills, MCP server IDs, workspace path grants, network channels, environment profile grants) is finite and comparable.
5. **Co-ship generated contracts in the same PR (ADR-011).** Skipping regeneration until "later" creates a guaranteed integration break.
6. **One-pass legacy repair is acceptable for in-place schema migration (session-driver-override ADR-005).** Document the boundary clearly and switch to strict semantics immediately after repair.
7. **Hooks are typed dispatch, not a bus (ADR-009).** "Tailing event tables" was explicitly rejected as a hook implementation strategy; co-emit at the call site that owns the state transition.
8. **Boot recovery runs before the scheduler accepts traffic.** A small line in autonomy lease invariants — but an entire class of reorder bugs disappears when this is invariant.
9. **Provider/runtime resolution is part of session identity (session-driver-override).** Persist effective provider, fail explicitly when it can't resolve. Equivalent pattern shows up wherever runtime selection is deferred to call time and creates drift.
10. **`task_18.md` (autonomy QA) — E2E harness regressions follow runtime contract changes.** When a new prompt augmenter ships, the deterministic ACP mock fixture matcher must be updated in the same PR; otherwise the tests pass against a stale prompt and fail later. Generalizable: tests against a deterministic mock are only as valid as the mock's contract version.

## System Prompt Candidates for CLAUDE.md

Rules already implicit in ADRs/memory/reviews but not in CLAUDE.md:

1. **"Generated artifacts ship in the same PR as their source."** Right now CLAUDE.md says "`make verify` MUST pass" but doesn't name OpenAPI/web type regeneration explicitly. ADR-011 makes this load-bearing for autonomy and beyond.
2. **"`task_runs` is the only durable work queue. Do not introduce a parallel queue."** Three ADRs forbid this. Belongs as a hard rule in the architecture section.
3. **"`internal/scheduler` does not claim runs; only agent sessions and explicit operator endpoints do."** From autonomy ADR-004. Equivalently: "There is one authoritative claim primitive; all other components produce wake/sweep/observability events around it."
4. **"Manual operator paths and autonomous paths must converge on the same primitives."** Direct from ADR-010. Avoids splitting into user-mode and agent-mode.
5. **"Hooks dispatch at the call site that owns the state transition. Never tail event/log tables to fire hooks."** From ADR-009. Reviewers caught this multiple times in early autonomy iterations.
6. **"`var _ Interface = (*Type)(nil)` is not optional."** CLAUDE.md says "Compile-time interface verification: `var _ Interface = (*Type)(nil)`" — but reviews still find this missing on new types (autonomy 031, 033). Strengthen with "every new exported type that is supposed to satisfy an interface must have this assertion next to its definition."
7. **"Whitespace-only CLI flag values are normalized to absent at the CLI boundary, not the daemon."** Autonomy issue 030, recurring elsewhere. Daemon validation should reject blanks too, but normalization belongs at the entry point.
8. **"E2E tests are part of the runtime contract."** When a runtime contract changes (prompt augmenter, situation context, fixture format), the E2E mock and matchers ship in the same PR. From `autonomous/memory/task_18.md`.
9. **"`context.WithoutCancel` does not preserve deadlines."** Hermes round-2 issue 001. Worth a single sentence as a Go-specific gotcha next to the existing concurrency rules.
10. **"Permission narrowing compares concrete atoms (tools, skills, MCP server IDs, workspace path grants, channels, env profile grants)."** From ADR-006. Belongs as an architecture rule because it bounds every future permission/capability surface.
11. **"Tasks must reconcile `_tasks.md` with actual completion order."** `unified-capabilities/_tasks.md` shows `task_10 completed` while `task_03` and `task_09` are still `pending`. Either the worklist is wrong or the order isn't honored — both are scoping risks.
12. **"Use `errors.Is`/`errors.As` exclusively for error matching. No `strings.Contains(err.Error(), …)`."** Already implied by the existing CLAUDE.md rule; reviews find violations often enough to warrant explicit prohibition of the substring form.

## Memory File Findings

`autonomous/memory/MEMORY.md` (workflow-scoped) plus `task_NN.md` per-task snapshots (19 files) reveal Pedro's executor pattern:

### Structure that's stable across tasks

Every per-task memory contains six sections: Objective Snapshot, Important Decisions, Learnings, Files / Surfaces, Errors / Corrections, Ready for Next Run. This matches the `cy-workflow-memory` skill format. The discipline is exceptional — no missing sections across 19 files.

### Information density

`MEMORY.md` keeps **one bullet per implemented task** under "Current State" — never duplicating the technical detail in the per-task file. "Shared Decisions" carries cross-task contracts (e.g., "Coordinator config keys established for later tasks: `enabled`, `agent_name`, `provider`, `model`, `default_ttl`, `max_children`, `max_active_per_workspace`"). "Shared Learnings" carries durable architectural facts (e.g., "Scheduler state is intentionally ephemeral and rebuildable from durable queued/active task runs plus active session snapshots").

### What memory captures that ADRs don't

- **Lint repeats.** task_01: `gocritic hugeParam`. task_14: errcheck/funlen/line-length/unused-parameter. Each task records the lint hits found at first verify and the fix. These never make it into ADRs but help the next task avoid the same fail.
- **Pre-commit/post-commit hook timing.** task_14 explicitly notes "Post-commit `make verify` was rerun because the pre-commit hook runs `make fmt` on staged Go files." A subtle process detail that informs the QA report.
- **Concrete coverage numbers.** task_01: 81.2%; task_14: 86.7%. CLAUDE.md says "80% coverage minimum per package"; the memory files validate it run-by-run.
- **Bug origin classification.** task_18 records `BUG-001`/`BUG-002`/`BUG-003` and identifies each as "E2E synchronization/stale flow," "deterministic ACP mock driver's prompt matching contract lagging behind the live situation augmenter," and "stale browser E2E expectation." Each is rooted in test-vs-runtime drift, not production bugs.

### Notable gap

There is no "Open Risks" content in `MEMORY.md` (the heading is empty). Either nothing carries forward, or risks aren't being captured. Given the QA report mentions "Known non-blocking warnings: NO_COLOR, Vite chunk-size, macOS linker `-bind_at_load`," some of those should plausibly land in Open Risks if they're long-lived.

### Reusable insight

`MEMORY.md` "Handoffs" is the cleanest pattern in the corpus — it tells the _next_ task what's already true and what conventions to consume. Pedro effectively hand-writes the dependency graph between tasks into a single living document. This is what makes 18-task techspecs converge.

## Notes for Synthesis

- The autonomy task is the high-water mark of how this workflow is supposed to look: dense `_techspec.md` with explicit boundaries, twelve targeted ADRs that each name a real architectural fork, eighteen tasks that compose without colliding, per-task memory snapshots, a verification report, and one round of reviewer issues that are 78% accepted-as-valid and being resolved in batches.
- The review-only directories (`qa-review`, `release-adjustments`, `network-default`, `delete-session`, `network-redesign`) are downstream of single PRs and don't carry techspecs/ADRs. They're useful for review-pattern analysis but don't reveal scoping discipline.
- Archived directories show the "v2" / restart pattern: when a subsystem doesn't fit, Pedro forks a new task tree, completes it, and archives the predecessor wholesale. There is no in-place evolution of large task trees.
- The strongest correlate of low review rework is the presence of concrete Go code (interfaces, structs, SQL fields) in the techspec, not prose-only descriptions.
- The most actionable gap: a codified test-conventions skill. ~40% of all review issues are the same "named subtests + `t.Parallel` + don't ignore errors in tests" complaints, and the existing `testing-anti-patterns` skill doesn't appear to be triggered consistently when AGH Go tests are written.
- Consider a `lesson-learned` registry under `docs/_memory/lessons/` capturing the ten ADR-derived lessons above — the autonomous task tree is the moment to do it because the architecture has just been justified across twelve ADRs in one place.
- The `_archived/_meta.md` is a stub (created Apr 2; never updated). If archive auditing matters, the meta should record _why_ each task was archived (completed-and-shipped vs. superseded vs. abandoned). Currently there's no way to tell `1776787980139-2df15575-unified-capabilities` (empty stub, superseded) apart from `20260411-014454-ext-architecture` (11/11 done, shipped) without inspecting each directory.
