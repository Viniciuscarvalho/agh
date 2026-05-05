Goal (incl. success criteria):

- Decompose the approved `harness` TechSpec into executable task files under `.compozy/tasks/harness/`.
- Success means a user-approved task breakdown aligned to the saved TechSpec/ADRs, with two final QA tasks dedicated to `/qa-report` and `/qa-execution` including browser/E2E expectations where appropriate.

Constraints/Assumptions:

- Focus outside memory lifecycle work; memory changes are only relevant where they affect harness seams.
- Must follow `cy-create-tasks` flow: read config/type registry, load `_techspec.md` + ADRs, explore the codebase, present the task breakdown for approval, and only then write `_tasks.md` + `task_*.md`.
- No destructive git commands. Do not modify unrelated worktree files.
- No interactive question tool is available in Default mode, so questions must be asked as plain assistant messages and execution must pause for user response.
- `.compozy/config.toml` is absent, so task `type` values fall back to the built-in defaults: `frontend`, `backend`, `docs`, `test`, `infra`, `refactor`, `chore`, `bugfix`.
- `_prd.md` is absent in `.compozy/tasks/harness/`; task decomposition is driven by `_techspec.md`, ADRs, and codebase exploration.

Key decisions:

- Treat current harness seams in `internal/session` and `internal/daemon` as the implementation baseline.
- Reuse recent competitor research from `.resources/*`, local docs, and existing ledgers instead of redoing generic research.
- Treat the new memory recall augmenter as a harness seam, not as scope for the TechSpec itself.
- First implementation slice is runtime-internal only: no new user-facing harness/profile config surface in v1.
- First implementation slice includes profiles + prompt architecture + background reentry.
- Background behavior stays in scope for the rewritten TechSpec, but the persistence/runtime substrate is fixed to the existing task runtime rather than a separate `BackgroundRun` entity.
- Harness behavior will no longer be modeled around `HarnessProfile` as the foundational primitive; the rewritten TechSpec will resolve behavior from durable session context plus turn-level origin/signals, with any profile term kept only as a derived/internal label if still useful.
- Startup prompt/profile layering in v1 will extend the existing assembler/provider chain instead of introducing a separate policy component.
- Feature slug for the TechSpec is `harness`.
- Specialized coordinator/planner/reviewer orchestration contracts are out of scope for v1 and will be documented as explicit follow-up work, with `docs/ideas/orchestration/multi-agent-patterns-analysis.md` as a key reference.
- The rewritten TechSpec will be a single broad spec with explicit workstreams, not an artificially narrow v1 slice.
- The async/background substrate decision is now fixed for the spec: reuse the existing task runtime (`task`/`task_runs`) rather than introduce a separate `BackgroundRun` persistence primitive.
- The augmenter evolution will be staged via daemon-side composition first, rather than requiring an immediate session-layer API break.
- Synthetic reentry must use a dedicated turn/event model and cannot be persisted as `EventTypeUserMessage`.
- The task plan must include two final QA tasks in the same style used for `settings-ui` and `tasks-ui`: one for `/qa-report` planning artifacts and one for `/qa-execution` with persistent E2E/verification coverage.

State:

- Completed. `_tasks.md` and `task_01.md` through `task_10.md` were generated, enriched with local and competitor references, and validated successfully.

Done:

- Read the `cy-create-techspec` skill instructions and templates.
- Confirmed there is no existing `_prd.md` or `_techspec.md` for this harness topic in `.compozy/tasks/`.
- Reviewed current AGH harness touchpoints: prompt assembly, turn-source handling, network skill injection, and prompt input augmentation.
- Reviewed recent competitor findings for Claude Code, OpenClaw, Hermes, and OpenFang.
- Reviewed existing internal docs under `docs/ideas/` and relevant ledger notes.
- Reviewed local implementation seams for profiles, startup prompt layering, turn augmenters, and background/synthetic event wiring.
- Locked the v1 scope boundary against broader orchestration work.
- Created ADR-001 through ADR-004 under `.compozy/tasks/harness/adrs/`.
- Ran external review via `compozy exec --ide claude --model opus --reasoning-effort xhigh --persist --prompt-file .codex/tmp/harness-spec-review-prompt.md`.
- External review artifacts persisted under `.compozy/runs/exec-20260417-232547-929722000/`.
- External reviewer used specialized subagents and returned “Precisa de revisão antes de aprovar”.
- Key external findings:
  - current `HarnessProfile` enum conflates durable session shape with per-turn origin and needs a matrix or split model
  - `BackgroundRun` may duplicate `task_runs` and is under-justified against current globaldb schema
  - profile-aware section selection has no named daemon-owned owner in the current spec
  - ordered augmenter pipeline migration is under-specified against the existing single `PromptInputAugmenter` seam
  - synthetic background reentry needs a dedicated trust/audit model and must not be recorded as `EventTypeUserMessage`
- Local follow-up research findings:
  - current code already separates a durable session axis (`session.Type` with `user|dream|system`) from turn origin (`TurnSource` with `user|network`), so the split-axes critique is valid but does not necessarily require a brand-new persisted `session_shape` field
  - the augmenter migration can be staged because daemon composition currently injects a single augmenter in `internal/daemon/daemon.go`; a composite augmenter can be introduced there before any session-layer API break
  - `task.Run` plus `taskRuntime` already provide rich durable run semantics, boot recovery, idempotency, and session bridging, which makes the `BackgroundRun` justification problem materially stronger
  - synthetic reentry is expensive because transcript assembly, hooks, and extension prompt submission currently key off `EventTypeUserMessage`
- Rewrote the TechSpec as a single broad, modular architecture document with explicit workstreams.
- Saved the approved TechSpec to `.compozy/tasks/harness/_techspec.md`.
- Rewrote and saved ADR-001 through ADR-004 to match the approved architecture:
  - harness behavior resolved from durable session context + turn origin
  - staged extension of existing prompt seams
  - detached async work reuses task runtime
  - coordinator-grade orchestration deferred to follow-up work
- Read the `cy-create-tasks` skill plus its task template and frontmatter schema.
- Confirmed `.compozy/config.toml` is absent, so built-in task types apply.
- Confirmed `.compozy/tasks/harness/` has `_techspec.md` and ADRs but no `_prd.md`.
- Reviewed existing QA tail-task patterns in `.compozy/tasks/settings-ui/` and `.compozy/tasks/tasks-ui/`.
- Re-explored the relevant harness codepaths in `internal/session`, `internal/daemon`, `internal/task`, `internal/transcript`, `internal/observe`, `internal/extension`, and `internal/store/globaldb` to ground task boundaries in the current implementation.
- Got user approval for the 10-task breakdown with the QA pair at the end.
- Spawned four explorer subagents (`gpt-5.4-mini`, `high`) to mine task-oriented references from `.resources/claude-code`, `.resources/openclaw`, `.resources/hermes`, and `.resources/openfang`.
- Incorporated competitor references directly into the generated harness task files under `### External References`.
- Wrote `.compozy/tasks/harness/_tasks.md` and `.compozy/tasks/harness/task_01.md` through `.compozy/tasks/harness/task_10.md`.
- Ran `compozy validate-tasks --name harness` and it passed with `all tasks valid (10 scanned)`.
- Closed the temporary explorer subagents after collecting their outputs.
- Strengthened `## Deliverables` and `## Tests` across `.compozy/tasks/harness/task_01.md` through `task_10.md` to make unit and integration expectations more specific and package/runtime-oriented.
- Re-ran `compozy validate-tasks --name harness` after the test-section hardening and it still passed with `all tasks valid (10 scanned)`.

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.agents/skills/cy-create-techspec/SKILL.md`
- `.agents/skills/cy-create-techspec/references/techspec-template.md`
- `.agents/skills/cy-create-techspec/references/adr-template.md`
- `.compozy/tasks/harness/adrs/adr-001.md`
- `.compozy/tasks/harness/adrs/adr-002.md`
- `.compozy/tasks/harness/adrs/adr-003.md`
- `.compozy/tasks/harness/adrs/adr-004.md`
- `.compozy/tasks/harness/_techspec.md`
- `.agents/skills/cy-create-tasks/SKILL.md`
- `.agents/skills/cy-create-tasks/references/task-template.md`
- `.agents/skills/cy-create-tasks/references/task-context-schema.md`
- `.codex/tmp/harness-spec-review-prompt.md`
- `.compozy/runs/exec-20260417-232547-929722000/turns/0001/response.txt`
- `.compozy/tasks/settings-ui/_tasks.md`
- `.compozy/tasks/settings-ui/task_15.md`
- `.compozy/tasks/settings-ui/task_16.md`
- `.compozy/tasks/tasks-ui/_tasks.md`
- `.compozy/tasks/tasks-ui/task_18.md`
- `.compozy/tasks/tasks-ui/task_19.md`
- `.compozy/tasks/harness/_tasks.md`
- `.compozy/tasks/harness/task_01.md`
- `.compozy/tasks/harness/task_02.md`
- `.compozy/tasks/harness/task_03.md`
- `.compozy/tasks/harness/task_04.md`
- `.compozy/tasks/harness/task_05.md`
- `.compozy/tasks/harness/task_06.md`
- `.compozy/tasks/harness/task_07.md`
- `.compozy/tasks/harness/task_08.md`
- `.compozy/tasks/harness/task_09.md`
- `.compozy/tasks/harness/task_10.md`
- `internal/session/manager_prompt.go`
- `internal/session/interfaces.go`
- `internal/session/manager_start.go`
- `internal/session/manager_network_skill.go`
- `internal/session/manager_hooks.go`
- `internal/session/session.go`
- `internal/daemon/composed_assembler.go`
- `internal/daemon/daemon.go`
- `internal/daemon/boot.go`
- `internal/daemon/task_runtime.go`
- `internal/memory/recall.go`
- `internal/store/globaldb/global_db.go`
- `internal/store/globaldb/global_db_task.go`
- `internal/store/globaldb/global_db_session.go`
- `internal/store/globaldb/global_db_observe.go`
- `internal/task/types.go`
- `internal/observe/observer.go`
- `internal/extension/host_api.go`
- `internal/transcript/transcript.go`
- `docs/ideas/from-claude-code/filtered_recommendations.md`
- `docs/ideas/market-pair/gap-analysis.md`
- `docs/ideas/orchestration/multi-agent-patterns-analysis.md`
- `.codex/ledger/2026-04-17-MEMORY-claude-code-modes.md`
- `.codex/ledger/2026-04-17-MEMORY-openclaw-harness.md`
- `.codex/ledger/2026-04-17-MEMORY-hermes-policy-scan.md`
- `.codex/ledger/2026-04-17-MEMORY-openfang-harness.md`
