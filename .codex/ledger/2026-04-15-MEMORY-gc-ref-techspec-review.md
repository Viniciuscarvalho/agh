Goal (incl. success criteria):

- Review `.compozy/tasks/gc-ref/_techspec.md` against AGH architecture and the supporting `.compozy/tasks/gc-ref/analysis/` docs to determine whether the spec is correct and implementation-ready here.
- Success means a findings-first review with concrete file references, separating valid decisions from non-implementable or weakly justified proposals.

Constraints/Assumptions:

- Read-only review unless a concrete spec correction becomes necessary later.
- Use local project code and local `.resources/goclaw` materials only; no web.
- Must respect existing AGENTS/CLAUDE instructions, including ledger maintenance and non-destructive git behavior.

Key decisions:

- Use `architectural-analysis` workflow because this is an implementability/architecture audit rather than feature implementation.
- Validate the techspec against current AGH packages, not against hypothetical refactors.
- In brainstorming, the user chose a hybrid revision target for the spec: preserve the best GoClaw-derived ideas, but re-anchor them to the actual seams and rollout constraints of the current AGH codebase.
- The user chose an end-to-end minimum scope for the revised spec: include mandatory config/contract/SSE/web impacts whenever they are required for the proposal to be truly implementable, while keeping the center of gravity in backend design.
- The user chose a consolidation-first rule for cross-cutting foundations: when AGH already has a local retry/cache/dedup/atomic-write or hook seam, the revised spec should prefer reusing or gradually extracting it before proposing a brand-new shared package.
- The user chose to move speculative GoClaw-derived ideas without a concrete AGH seam or current pain point into a backlog/future-candidates section rather than the implementation core.
- The user selected the "re-write around real seams" approach for the revised spec instead of a patch-style correction or a dual-layer appendix-heavy format.
- The user chose to stop the meta-level discussion and move directly toward rewriting `.compozy/tasks/gc-ref/_techspec.md` once the final content-target design is approved.

State:

- Completed.

Done:

- Read workspace instructions and scanned existing ledgers for related GoClaw analysis context.
- Read the first half of `.compozy/tasks/gc-ref/_techspec.md` and identified candidate mismatches around new package proliferation, config shape, and event/API assumptions.
- Finished reading `.compozy/tasks/gc-ref/_techspec.md` and the supporting analysis docs most relevant to loop hardening, observability, error handling, and concurrency.
- Cross-checked the spec against live AGH code in `internal/store`, `internal/fileutil`, `internal/session`, `internal/observe`, `internal/config`, `internal/api/*`, `internal/hooks`, `internal/automation`, and `internal/skills`.
- Confirmed the strongest issues are implementability mismatches, not mere omissions:
- `internal/fileutil/atomic.go` already exists as `AtomicWriteFile`, so the spec's proposed new helper/build step is outdated.
- The spec ignores AGH's existing compaction and lifecycle hook surfaces when proposing agent-loop hardening, which makes its integration points incomplete.
- Proposed config sections (`session.guardrails`, `observability.cost`) and event additions are not wired through existing config/contract/web surfaces.
- The spec proposes generic retry/cache/dedup foundations without first accounting for existing domain-local implementations (`automation` retry, `skills` workspace cache, bridge ingest dedup).
- Brainstorming validated section 1 of the revised design: the techspec should be rewritten around real AGH seams with sections for current-state alignment, adoption decisions, implementation phases, required surface changes, backlog, and verification.
- Brainstorming validated section 2 of the revised design: each GoClaw-derived pattern should be classified with an explicit keep/reshape/backlog/drop rubric based on proven AGH gaps, real seams, mandatory surface impact, gradual consolidation, and verifiability.
- Persisted the approved rewrite design to `docs/plans/2026-04-15-gc-ref-techspec-rewrite-design.md`.
- Rewrote `.compozy/tasks/gc-ref/_techspec.md` to align with AGH's current seams, replacing the previous package-first draft with an AGH-first adoption plan.
- Confirmed the rewritten spec now:
- keeps only four implementation-core decisions
- removes mandatory config/contract/SSE/web additions from the core plan
- moves speculative GoClaw patterns to backlog/future candidates
- encodes the keep/reshape/backlog/drop decision rubric directly in the document

Now:

- None.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: none.

Working set (files/ids/commands):

- `.compozy/tasks/gc-ref/_techspec.md`
- `.compozy/tasks/gc-ref/analysis/`
- `.codex/ledger/2026-04-13-MEMORY-goclaw-analysis.md`
- `.agents/skills/architectural-analysis/SKILL.md`
- `find internal -maxdepth 2 -type d | sort`
- `rg -n "token|budget|guardrail|sanitize|dedup|retry|pragma|ContextWindow|Notifier|SSE|event" internal web .compozy/tasks/gc-ref/analysis`
