Goal (incl. success criteria):

- Create a new TechSpec for `.compozy/tasks/refac-v2/` that translates the refactoring analysis into an implementation design aligned with the current AGH codebase.
- Success criteria: gather current-task context, ask one technical clarification question at a time, capture decisions in ADRs, draft `_techspec.md`, get user approval, then save the approved artifact.

Constraints/Assumptions:

- User explicitly requested the `cy-create-techspec` workflow for `refac-v2`.
- No `_prd.md` exists yet in `.compozy/tasks/refac-v2/`; current input is the refactoring-analysis document set under that task directory plus live codebase exploration.
- Do not write `.compozy/tasks/refac-v2/_techspec.md` until the draft is complete and the user approves it.
- Must follow root `AGENTS.md` rules, including non-destructive git behavior and ledger maintenance.
- `request_user_input` is unavailable in this runtime, so clarification questions must be asked as the full assistant reply and await user input.

Key decisions:

- Use `cy-create-techspec` as the primary workflow and `brainstorming` guardrails for design-first interaction.
- Treat `.compozy/tasks/refac-v2/20260406-summary.md` as the current analysis entry point, but verify assumptions against the live package tree before proposing the design.
- Reuse `.compozy/tasks/refac/_techspec.md` only as a style/reference point, not as an authoritative source for `refac-v2`.
- User selected the broad package-graph reorganization target for `refac-v2` rather than a purely incremental path-preserving refactor.
- User selected `internal/api/contract` as the canonical shared API DTO package, separate from `api/core`.
- User selected a hybrid rollout rule: prefer direct cutovers, but allow strictly temporary bridges inside the same phase when they reduce mechanical risk; each phase closes only after bridge removal and `make verify`.
- User selected validation rule `B`: `make verify` on every step that moves packages/contracts, and `make test-integration` on every phase that touches `api/*`, `cli`, `daemon`, `session`, `store`, or `workspace`.
- User selected persistence target `B`: split persistence into `internal/store/sessiondb` and `internal/store/globaldb`, with `internal/store` reduced to shared types/helpers.

State:

- Completed.

Done:

- Confirmed repo instruction scope from root `AGENTS.md` / `CLAUDE.md`.
- Scanned existing ledgers for related refactor context.
- Confirmed `.compozy/tasks/refac-v2/` exists and currently has analysis docs only; no `_prd.md`, no `_techspec.md`, no `adrs/` directory yet.
- Read the `cy-create-techspec` template files and the `brainstorming` skill instructions relevant to design-first flow.
- Read the `refac-v2` summary doc and the existing `.compozy/tasks/refac/_techspec.md` for reference.
- Confirmed current top-level `internal/` package tree.
- Verified representative high-impact code paths:
  - `internal/session/transcript.go` is still a 634-line self-contained replay module.
  - `internal/daemon/dream.go` still contains 323 lines of dream orchestration while `internal/memory/dream.go` holds the consolidation service.
  - `internal/acp/handlers.go` (735 LOC), `internal/acp/permission.go` (546 LOC), `internal/cli/skill.go` (917 LOC), `internal/config/config.go` (511 LOC), and `internal/store/migrate_workspace.go` (586 LOC) remain large refactor targets.
  - `internal/apicore/` already exists and centralizes transport interfaces/payloads; `httpapi/` and `udsapi/` are already split by concern.
  - `internal/cli/client.go` still defines its own API DTO surface separately from `internal/apicore/payloads.go`, so an `api/contract` extraction remains a real design option.
- Checked recent history: latest commits already landed utility extraction, oversized-file splits, API transport consolidation, and domain-helper deduplication.
- Checked worktree state and confirmed many unrelated user changes are present; avoid touching them.
- Asked the first architecture-scope question and captured the answer: `B` (broad package-graph reorganization).
- Asked the API-contract ownership question and captured the answer: `A` (`internal/api/contract` is the source of truth for shared DTOs).
- Asked the rollout-style question and captured the answer: `C` (hybrid rollout with same-phase bridge removal).
- Reconfirmed the repo verification surface:
  - `make verify` is the mandatory fmt/lint/test/build gate.
  - `make test-integration` exists separately.
  - Integration coverage already exists in `daemon`, `httpapi`, `udsapi`, `cli`, `store`, `workspace`, `session`, `observe`, and `acp`.
- Asked the validation-gate question and captured the answer: `B` (unit gate on each moving step; integration gate on structural runtime phases).
- Asked the persistence-boundary question and captured the answer: `B` (`store/sessiondb` + `store/globaldb`).
- Created `.compozy/tasks/refac-v2/adrs/`.
- Wrote ADRs:
  - `adr-001.md` broad package-graph reorganization
  - `adr-002.md` canonical `internal/api/contract`
  - `adr-003.md` split persistence into `store/sessiondb` and `store/globaldb`
  - `adr-004.md` phased cutovers with same-phase bridge removal and layered verification
- Presented the complete TechSpec draft and captured approval `A`.
- Wrote `.compozy/tasks/refac-v2/_techspec.md`.

Now:

- Task complete.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether the user wants `refac-v2` to supersede the existing `refac` TechSpec or intentionally coexist as a distinct more ambitious plan.

Working set (files/ids/commands):

- `.compozy/tasks/refac-v2/20260406-summary.md`
- `.compozy/tasks/refac/_techspec.md`
- `.agents/skills/cy-create-techspec/SKILL.md`
- `.agents/skills/cy-create-techspec/references/techspec-template.md`
- `.agents/skills/cy-create-techspec/references/adr-template.md`
- `.agents/skills/brainstorming/SKILL.md`
- `find internal -maxdepth 2 -type d | sort`
- `wc -l internal/acp/handlers.go internal/acp/permission.go internal/session/transcript.go internal/daemon/dream.go internal/memory/dream.go internal/cli/skill.go internal/config/config.go internal/store/migrate_workspace.go`
- `git log --oneline -n 8`
- `git status --short`
