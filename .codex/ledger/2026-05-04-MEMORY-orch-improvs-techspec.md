Goal (incl. success criteria):

- Create an English TechSpec for `.compozy/tasks/orch-improvs` based on `.compozy/tasks/orch-improvs/analysis`.
- Success requires: cy-spec-preflight context loaded, codebase exploration completed, 3-6 technical clarifications answered, at least one ADR created, complete draft reviewed/approved by the user, and `_techspec.md` saved only after approval.

Constraints/Assumptions:

- Conversation in Brazilian Portuguese; persistent artifacts in English.
- Must follow `cy-spec-preflight` and `cy-create-techspec`.
- TechSpec file must not be written until the final draft is approved.
- ADRs may be written before the TechSpec as required by the skill.
- Local date for ledger naming is `2026-05-04` from `date +%F`.

Key decisions:

- UNCONFIRMED: primary technical approach for orchestration improvements.

State:

- Context gathered; preparing technical clarification questions.

Done:

- Loaded `cy-spec-preflight` and `cy-create-techspec` skill instructions.
- Confirmed target analysis files exist under `.compozy/tasks/orch-improvs/analysis`.
- Scanned `.codex/ledger` for related `orch`/`orchestr` ledgers; none found.
- Loaded AGH spec authoring playbook, standing directives, glossary, TechSpec phase lessons, root `CLAUDE.md`, `internal/CLAUDE.md`, `web/CLAUDE.md`, `packages/site/CLAUDE.md`, and `cy-web-docs-impact`.
- Read `.compozy/tasks/orch-improvs/analysis/*.md`; no `_prd.md`, `_techspec.md`, or `adrs/` currently exists.
- Explored task/autonomy code: `internal/task`, `internal/store/globaldb`, `internal/api/core`, `internal/api/contract`, `internal/api/udsapi`, `internal/tools/builtin`, `internal/scheduler`, and `web/src/systems/tasks`.
- Confirmed AGH already has session-bound agent lease mutations through `LookupActiveRunForSession`; worker-scoped mutation enforcement should be preserved/extended rather than treated as absent.

Now:

- Ask technical clarification questions one at a time.

Next:

- Create ADRs once the technical approach is confirmed.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether MVP should be the core orchestration safety/handoff set only or also include agent-experience/web/bulk conveniences.
- UNCONFIRMED: storage placement for run `summary`, active-run pointer, runtime budgets, and circuit-breaker counters.
- UNCONFIRMED: exact config defaults/thresholds for summary caps, runtime budget, spawn-failure breaker, and scheduler health window.

Working set (files/ids/commands):

- `.compozy/tasks/orch-improvs/analysis/*.md`
- `.compozy/tasks/orch-improvs/adrs/`
- `.compozy/tasks/orch-improvs/_techspec.md`
- `docs/_memory/spec-authoring-playbook.md`
- `docs/_memory/standing_directives.md`
- `docs/_memory/glossary.md`
- `internal/task/{interfaces.go,lease.go,lease_manager.go,manager.go,types.go}`
- `internal/store/globaldb/global_db.go`
- `internal/api/{contract,core,udsapi,httpapi}`
- `internal/tools/builtin/{tasks.go,autonomy.go}`
- `internal/scheduler/{scheduler.go,doc.go}`
- `web/src/systems/tasks/**`
