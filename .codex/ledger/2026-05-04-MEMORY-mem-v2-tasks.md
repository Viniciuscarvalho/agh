Goal (incl. success criteria):

- Generate the `mem-v2` task graph from the repaired TechSpec: propose a dependency-safe breakdown for approval, then write `_tasks.md` plus `task_NN.md` files, append the mandatory QA pair, and leave `compozy tasks validate --name mem-v2` passing.

Constraints/Assumptions:

- Conversation in BR-PT; all written artifacts stay in English.
- User explicitly required: create a `.backup`, do not remove/rewrite the TechSpec from scratch, patch in place, then compare against the backup.
- Subagents are read-only and provide evidence only.
- Must keep the result compatible with the `cy-create-techspec` template while making it strict-ready for `cy-create-tasks`.
- `make verify` is mandatory before completion.

Key decisions:

- TechSpec-first remains the normative source; ADRs now align to it and are inputs for task generation.
- Use `cy-spec-preflight`, `cy-create-tasks`, `cy-tasks-tail-qa-pair`, and `cy-web-docs-impact` as the governing workflow.
- Task types fall back to built-ins (`frontend`, `backend`, `docs`, `test`, `infra`, `refactor`, `chore`, `bugfix`) because `.compozy/config.toml` is absent.
- The breakdown must be approval-first: present the full task graph before writing `_tasks.md` or any `task_NN.md`.
- QA tail is mandatory and must close the program with `QA Plan and Test Coverage` then `Real-Scenario QA Execution`.
- User approved a compressed graph rather than the original 32-row version. Final shape is 26 tasks total including the QA pair.
- This machine's installed CLI uses `compozy validate-tasks`, not `compozy tasks validate`; validation must use the installed command surface.

State:

- TechSpec and core ADRs repaired; repo verification passed; mem-v2 task pack generated and validated.

Done:

- Scanned root instructions and active ledgers.
- Loaded `cy-spec-preflight`, `cy-create-techspec`, `cy-create-tasks`, `cy-tasks-tail-qa-pair`, and `cy-web-docs-impact`.
- Read spec authoring playbook, standing directives, glossary, TechSpec template, mem-v2 TechSpec, ADRs, analysis corpus, and prior review artifacts.
- Ran three read-only subagent reviews covering ADR/spec consistency, taskability/dependency graph, and web/docs/agent/config/extensibility surfaces.
- Created `.compozy/tasks/mem-v2/_techspec.md.backup`.
- Patched `_techspec.md` in place to close normative gaps: contract hard-cut, direct-edit reconcile policy, inbox ownership, session-ledger scope, default agent binding, hard-cut public surface inventory, config lifecycle, real web/site paths, real route families, and readiness closure.
- Patched ADR-001, ADR-002, ADR-006, ADR-008, ADR-009, ADR-010, and ADR-011 to align with the repaired TechSpec.
- Ran `python3 .agents/skills/cy-spec-preflight/scripts/check-techspec-markers.py .compozy/tasks/mem-v2/_techspec.md` successfully.
- Compared `_techspec.md` against `_techspec.md.backup` with `diff -u`.
- Ran `make verify` successfully.
- Re-loaded the task-generation playbook, task template, QA-tail template, task preflight checks, and the current mem-v2 slug context.
- Confirmed `.compozy/config.toml` is absent, so built-in task types apply.
- Audited real backend/web/site surfaces for current memory, settings, CLI, API, native tools, codegen, and docs paths.
- Spawned three read-only explorer subagents to map backend slices, web/docs surfaces, and existing task-pack authoring patterns.
- Wrote `.compozy/tasks/mem-v2/_tasks.md`.
- Wrote `.compozy/tasks/mem-v2/task_01.md` through `.compozy/tasks/mem-v2/task_26.md`.
- Ran `compozy validate-tasks --name mem-v2 --format json` successfully; validator returned `ok: true`, `scanned: 26`, `message: "all tasks valid"`.
- Re-ran `make verify` after task-pack generation; monorepo gate passed through bun lint/typecheck/test, web build, Go lint/test/build, and boundaries.

Now:

- Finalize the session summary and hand the validated task pack back to the user.

Next:

- Optional next operator step: execute the first task from the generated pack.

Open questions (UNCONFIRMED if needed):

- None at the moment. Waiting only on subagent evidence and final parent-agent clustering.

Working set (files/ids/commands):

- `.codex/ledger/2026-05-04-MEMORY-mem-v2-tasks.md`
- `.compozy/tasks/mem-v2/_techspec.md`
- `.compozy/tasks/mem-v2/_techspec.md.backup`
- `.compozy/tasks/mem-v2/_codex_techspec_review_response.md`
- `.compozy/tasks/mem-v2/_codex_techspec_review2_response.md`
- `.compozy/tasks/mem-v2/_codex_techspec_review3_response.md`
- `.compozy/tasks/mem-v2/adrs/adr-001.md`
- `.compozy/tasks/mem-v2/adrs/adr-002.md`
- `.compozy/tasks/mem-v2/adrs/adr-006.md`
- `.compozy/tasks/mem-v2/adrs/adr-008.md`
- `.compozy/tasks/mem-v2/adrs/adr-009.md`
- `.compozy/tasks/mem-v2/adrs/adr-010.md`
- `.compozy/tasks/mem-v2/adrs/adr-011.md`
- `.compozy/tasks/mem-v2/analysis/analysis.md`
- `.compozy/tasks/mem-v2/analysis/analysis_agent-scope-dilemma.md`
- `.compozy/tasks/mem-v2/analysis/analysis_session-ledger-retention.md`
- `.compozy/tasks/mem-v2/analysis/analysis_extraction-location.md`
- `docs/_memory/spec-authoring-playbook.md`
- `docs/_memory/standing_directives.md`
- `docs/_memory/glossary.md`
- `.agents/skills/cy-create-techspec/`
- `.agents/skills/cy-create-tasks/`
- `.agents/skills/cy-spec-preflight/`
- `.agents/skills/cy-tasks-tail-qa-pair/`
- `.agents/skills/cy-web-docs-impact/`
- `internal/CLAUDE.md`
- `web/CLAUDE.md`
- `packages/site/CLAUDE.md`
- `.compozy/tasks/mem-v2/_tasks.md`
- `.compozy/tasks/mem-v2/task_01.md`
- `.compozy/tasks/mem-v2/task_26.md`
- `internal/api/httpapi/routes.go`
- `internal/api/udsapi/routes.go`
- `internal/api/core/memory.go`
- `internal/cli/memory.go`
- `internal/tools/builtin/memory.go`
- `internal/config/tool_surface.go`
- `web/src/routes/_app/knowledge.tsx`
- `web/src/routes/_app/settings/memory.tsx`
- `web/src/systems/knowledge/**`
- `web/src/systems/settings/**`
- `packages/site/content/runtime/**`
- `python3 .agents/skills/cy-spec-preflight/scripts/check-techspec-markers.py .compozy/tasks/mem-v2/_techspec.md`
- `diff -u .compozy/tasks/mem-v2/_techspec.md.backup .compozy/tasks/mem-v2/_techspec.md`
- `make verify`
- `compozy validate-tasks --name mem-v2 --format json`
