# Review Request: AGH Harness TechSpec Draft

Você está revisando criticamente uma draft de TechSpec para o AGH.

Use `claude`/`opus` com raciocínio alto e, importante, **use subagents especializados** para explorar e revisar a spec antes de concluir. Quero pelo menos estes ângulos:

- arquitetura/runtime
- prompt/harness policy
- storage/observability
- test strategy / rollout risk

## Objetivo da revisão

Avaliar se a TechSpec abaixo está sólida o suficiente para aprovação, considerando:

- aderência ao código atual do AGH
- riscos arquiteturais ou lacunas importantes
- inconsistências entre ADRs e spec
- escopo v1 realista
- desenho de APIs/interfaces internas
- riscos em background reentry, augmenters e profile resolution
- pontos que estão vagos demais e precisam ficar mais concretos antes de aprovar

## Instruções de saída

Responda em português do Brasil.

Estruture a resposta assim:

1. `Veredito`
   - `Aprovável como está`
   - `Aprovável com ajustes`
   - `Precisa de revisão antes de aprovar`
2. `Achados`
   - liste findings por severidade, do mais importante para o menos importante
   - cite seções da spec e paths do código quando relevante
   - seja específico e adversarial
3. `Mudanças recomendadas na spec`
   - diga exatamente o que mudar no texto/estrutura da TechSpec
4. `Riscos residuais`
   - o que ainda ficaria para follow-up mesmo após ajustes

Se não encontrar problemas relevantes, diga explicitamente por que a spec está coerente.

## Contexto e artefatos para inspecionar

Leia e compare com a draft:

- `.compozy/tasks/harness/adrs/adr-001.md`
- `.compozy/tasks/harness/adrs/adr-002.md`
- `.compozy/tasks/harness/adrs/adr-003.md`
- `.compozy/tasks/harness/adrs/adr-004.md`
- `internal/session/manager_prompt.go`
- `internal/session/interfaces.go`
- `internal/session/manager_network_skill.go`
- `internal/daemon/composed_assembler.go`
- `internal/daemon/boot.go`
- `internal/daemon/daemon.go`
- `internal/memory/recall.go`
- `docs/ideas/orchestration/multi-agent-patterns-analysis.md`
- `docs/ideas/from-claude-code/filtered_recommendations.md`
- `docs/ideas/market-pair/gap-analysis.md`

## Draft da TechSpec

# TechSpec: Harness Runtime v1

## Executive Summary

This initiative defines the first internal-only harness foundation for AGH. There is no `_prd.md` for `harness`; this document uses the current runtime architecture, recent competitor analysis, and local orchestration research as the authoritative input. The implementation focuses on four runtime capabilities: explicit internal `HarnessProfile` selection, structured startup prompt layering, ordered turn-time prompt augmentation, and first-class background completion reentry.

The implementation strategy is to extend existing seams rather than introduce a parallel architecture. Startup prompt behavior remains on the existing assembler/provider chain in `internal/daemon` and `internal/session`. Turn-time context remains on the existing prompt augmentation seam in `session.Manager`. Background completion becomes a first-class daemon runtime concept backed by global storage and policy-based synthetic reentry. The primary trade-off is deliberate scope restraint: v1 creates a strong harness foundation but explicitly defers richer coordinator/planner/reviewer orchestration to follow-up work.

## System Architecture

### Component Overview

The implementation consists of these main components:

- `internal/session`: owns session-level harness state, prompt dispatch, turn-source handling, and ordered turn augmentation before `driver.Prompt`.
- `internal/daemon`: owns startup prompt assembly, provider registration, profile-aware section selection, and background runtime wiring during boot.
- `internal/store/globaldb`: persists `BackgroundRun` records and related lifecycle metadata in daemon-global storage.
- `internal/observe` plus existing event summary surfaces: records harness lifecycle signals for operator visibility.
- `internal/memory`: remains one prompt augmenter implementation, but no longer defines the harness pattern by itself; it becomes one participant in an ordered augmenter pipeline.

Data flow is intentionally split:

- Session startup resolves a base `HarnessProfile`, stores it in session metadata, and assembles the startup prompt through the existing assembler chain.
- Prompt dispatch records the original user input, then applies ordered augmenters based on the session profile and turn-level signals.
- Background work records a `BackgroundRun` in global storage, updates lifecycle state as it progresses, and emits completion observability.
- If the run policy requires reentry, the daemon synthesizes an internal prompt/event back to the owning session instead of requiring explicit polling.

## Implementation Design

### Core Interfaces

The harness foundation needs a narrow internal persistence surface for background work:

```go
type BackgroundRunStore interface {
	Create(ctx context.Context, run BackgroundRunRecord) error
	Get(ctx context.Context, id string) (*BackgroundRunRecord, error)
	ListByOwnerSession(ctx context.Context, sessionID string) ([]BackgroundRunRecord, error)
	MarkCompleted(ctx context.Context, id string, result BackgroundRunResult) error
}
```

Turn augmentation should stay explicit and ordered rather than hidden behind one opaque callback:

```go
type TurnAugmenter interface {
	Name() string
	Augment(ctx context.Context, session *Session, input PromptInput) (PromptInput, error)
}
```

### Data Models

Core runtime additions:

- `HarnessProfile`: internal enum with `interactive`, `network`, `background`, and `worker`.
- `BackgroundRunState`: internal enum such as `queued`, `running`, `completed`, `failed`, `canceled`.
- `BackgroundRunPolicy`: internal policy describing whether completion is silent or triggers session reentry.

Core persistent models:

- `BackgroundRunRecord`
  - `id`
  - `owner_session_id`
  - `owner_workspace_id`
  - `profile`
  - `policy`
  - `state`
  - `source`
  - `summary`
  - `error`
  - `created_at`
  - `started_at`
  - `completed_at`
- Session metadata extension
  - add `harness_profile` as the persisted base profile for resume and observability

Ephemeral prompt-dispatch models:

- `PromptInput`
  - original message text
  - normalized turn source
  - optional background reentry payload
  - optional network metadata
- `PromptSectionDescriptor`
  - section name
  - section category
  - order
  - budget
  - profile eligibility

No new public OpenAPI or CLI contract is required in v1. The first slice is runtime-internal and should expose observability through existing event surfaces rather than a new public harness CRUD API.

### API Endpoints

No new public HTTP or UDS endpoints are required in v1.

Internal daemon/runtime surfaces change as follows:

- session startup uses the existing `PromptAssembler` path with profile-aware section selection
- prompt dispatch uses the existing `PromptInputAugmenter` seam, evolved into ordered augmenters
- daemon runtime uses a new internal `BackgroundRunStore` backed by `internal/store/globaldb`
- observability uses existing event summary and lifecycle emission paths

If operator-facing read APIs become necessary later, they should be added as follow-up work after the runtime contract stabilizes.

## Integration Points

No external service integration is required in v1. The implementation stays within the existing AGH daemon, session manager, global store, and observer boundaries.

## Impact Analysis

| Component                            | Impact Type      | Description and Risk                                                                                                                            | Required Action                                                        |
| ------------------------------------ | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `internal/session`                   | modified         | Adds base profile handling, ordered turn augmentation, and synthetic background reentry hooks. Medium risk because prompt flow is load-bearing. | Extend prompt lifecycle types and tests carefully.                     |
| `internal/daemon`                    | modified         | Extends startup assembler/provider chain with profile-aware section selection and background runtime wiring. Medium risk.                       | Keep boot ownership clear and avoid moving policy into session code.   |
| `internal/store/globaldb`            | modified         | Adds `BackgroundRun` persistence and read/write helpers. Medium risk due to schema evolution.                                                   | Add tables/indexes and lifecycle queries with tests.                   |
| `internal/observe` / event summaries | modified         | Adds harness lifecycle visibility for profile resolution and background run completion. Low to medium risk.                                     | Emit structured events and keep ordering stable.                       |
| `internal/memory`                    | modified         | Conforms to ordered augmenter pipeline as one augmenter implementation. Low risk.                                                               | Preserve existing recall behavior and persistence semantics.           |
| `internal/api/*`                     | unchanged for v1 | No public API contract change is required in the first slice.                                                                                   | Defer public harness endpoints unless runtime evidence justifies them. |

## Testing Approach

### Unit Tests

Required unit coverage:

- profile resolution from session-level inputs
- turn-time signal projection for `TurnSource`, network context, and background reentry context
- startup section selection and section ordering by `HarnessProfile`
- section budget behavior and truncation or omission policy
- ordered augmenter execution and failure handling
- guarantee that stored user input remains the original message while the driver sees the augmented message
- `BackgroundRun` state transitions and policy evaluation

### Integration Tests

Required integration coverage:

- session create and resume preserve base `harness_profile`
- startup prompt assembly changes correctly by profile
- network-originated turns activate the correct turn-time behavior without mutating stored input
- a completed `BackgroundRun` updates global storage and emits observability
- reentering background completion generates a synthetic internal prompt/event for the owning session
- silent background completion records lifecycle data without waking the session

Required verification gates before completion:

- `make verify`

## Development Sequencing

### Build Order

1. Add internal harness types and session metadata support for `HarnessProfile`. No dependencies.
2. Extend the existing assembler/provider chain with profile-aware section descriptors and budgets. Depends on step 1.
3. Replace the single prompt augmenter callback with an ordered augmenter pipeline while preserving current memory recall behavior. Depends on step 1.
4. Add `BackgroundRun` persistence to global daemon storage and schema helpers. Depends on step 1.
5. Wire background completion lifecycle and policy-based synthetic reentry into daemon and session flow. Depends on steps 3 and 4.
6. Add harness observability events and integration coverage for profile, augmentation, and background completion. Depends on steps 2, 3, 4, and 5.
7. Run full verification and tighten failure-path behavior. Depends on step 6.

### Technical Dependencies

- Session metadata persistence must be stable before profile-aware resume can be tested.
- The assembler extension must preserve existing prompt provider ordering semantics.
- The augmenter pipeline must preserve the existing “store original input, dispatch augmented input” invariant.
- Global daemon storage schema changes for `BackgroundRun` must land before background reentry wiring is implemented.

## Monitoring and Observability

Operational visibility should include:

- log events for `harness_profile_resolved`
- log events for `prompt_augmenter_applied` and `prompt_augmenter_failed`
- log events for `background_run_created`, `background_run_completed`, `background_run_failed`, and `background_run_reentered`
- structured log fields:
  - `session_id`
  - `workspace_id`
  - `harness_profile`
  - `turn_source`
  - `background_run_id`
  - `reentry_policy`
  - `reentered`
- event summary visibility for background completion and harness lifecycle transitions
- metrics or counters for:
  - background runs created
  - background runs completed
  - background runs reentered
  - augmenter failures
  - profile distribution by session

## Technical Considerations

### Key Decisions

- Decision: keep the v1 harness internal-only.  
  Rationale: the runtime needs stable semantics before exposing configuration.  
  Trade-off: less operator control in the first slice.  
  Alternatives rejected: user-declared profiles from day one.

- Decision: use a session-level base profile plus turn-level signals.  
  Rationale: startup prompt needs stability, but turns still need contextual behavior.  
  Trade-off: two layers of policy instead of one.  
  Alternatives rejected: fully dynamic per-turn resolution.

- Decision: extend the current assembler/provider and augmenter seams.  
  Rationale: current seams already map well to stable startup context versus volatile turn-time context.  
  Trade-off: richer behavior inside existing abstractions rather than a clean-slate redesign.  
  Alternatives rejected: new top-level harness policy component.

- Decision: model background completion as `BackgroundRun` in global storage with policy-based reentry.  
  Rationale: background work needs durable runtime identity and inspectable lifecycle.  
  Trade-off: extra runtime entity and storage surface.  
  Alternatives rejected: task runtime reuse and event-only modeling.

- Decision: defer coordinator/planner/reviewer orchestration contracts from v1.  
  Rationale: that work belongs to a richer orchestration layer, not the harness foundation slice.  
  Trade-off: v1 stops at `worker`-grade behavior.  
  Alternatives rejected: pulling full coordinator-grade orchestration into the same first spec.

### Known Risks

- Prompt policy may spread across too many files if profile logic is not centralized.
- Background reentry may over-notify sessions if internal policy defaults are too permissive.
- Existing augmenters may start depending on ordering accidentally if contracts are not explicit.
- Future orchestration work may need additional metadata beyond v1 `BackgroundRun` and `worker` semantics.

Mitigations:

- centralize profile resolution in daemon-owned runtime policy
- keep reentry policy narrow and explicit in v1
- name and order augmenters explicitly
- document follow-up orchestration work clearly instead of implying it is solved by this slice

## Architecture Decision Records

- [ADR-001: Use Internal Harness Profiles with Hybrid Resolution](adrs/adr-001.md) — Introduces internal `HarnessProfile` selection with a session base plus turn-level signals.
- [ADR-002: Extend Existing Prompt Assembly and Turn Augmentation Seams](adrs/adr-002.md) — Reuses the current assembler/provider and augmentation seams instead of creating a parallel prompt policy stack.
- [ADR-003: Model Background Completion as a Global BackgroundRun with Policy-Based Reentry](adrs/adr-003.md) — Adds a global daemon runtime entity for detached work and optional synthetic session reentry.
- [ADR-004: Defer Coordinator-Grade Orchestration Contracts from Harness v1](adrs/adr-004.md) — Keeps richer multi-agent orchestration out of the first harness slice and points to explicit follow-up work.
