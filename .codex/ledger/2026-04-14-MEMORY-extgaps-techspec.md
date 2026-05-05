Goal (incl. success criteria):

- Produce a TechSpec for `extgaps` using the `cy-create-techspec` template and workflow.
- Success: gather implementation-aware context, ask technical clarification questions one at a time, create ADRs, draft the TechSpec in English, get user approval, and save it under `.compozy/tasks/extgaps/_techspec.md`.

Constraints/Assumptions:

- Follow the `cy-create-techspec` skill strictly: no TechSpec file before user approval.
- `request_user_input` is unavailable in Default mode, so each required question must be asked as the complete assistant message and the turn must stop.
- `.compozy/tasks/extgaps/` does not exist yet; operate in new-spec mode.
- The user chose scope `B`: as-built plus follow-ups.

Key decisions:

- Use the shipped extension bundle implementation as the primary technical source of truth.
- Frame the TechSpec as implementation-backed documentation with explicit remaining risks/follow-ups, not as a target-state rewrite.

State:

- Completed.

Done:

- Read the `cy-create-techspec` skill instructions and canonical TechSpec/ADR templates.
- Confirmed `.compozy/tasks/extgaps/` is absent, so the task starts in create mode.
- Read the accepted implementation plan and the implementation ledger for extension bundles.
- Inspected key code paths in `internal/extension`, `internal/bundles`, `internal/api`, and `internal/store/globaldb`.
- Reviewed an archived TechSpec to match repository style.
- Asked the first clarification question on TechSpec scope and captured the answer `B` (as-built + follow-ups).
- Asked the second clarification question on follow-up boundary and captured the answer `A` (limit follow-ups to what is already visible in shipped code/tests/public contracts).
- Asked how to weigh runtime versus API in the TechSpec; user clarified the document must reflect what was actually implemented and must not invent an idealized design.
- Asked how to treat testing/validation coverage and captured the answer `A` (document only the concrete verification that actually ran and passed for this delivery).
- Asked how to surface residual gaps and captured the answer `A` (keep them only in `Known Risks`).
- Created `.compozy/tasks/extgaps/adrs/adr-001.md` through `adr-003.md` to document the implemented technical decisions.
- Drafted and saved `.compozy/tasks/extgaps/_techspec.md` after user approval.

Now:

- TechSpec saved.

Next:

- Next recommended step is generating execution tasks from the approved TechSpec.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.agents/skills/cy-create-techspec/SKILL.md`
- `.agents/skills/cy-create-techspec/references/techspec-template.md`
- `.agents/skills/cy-create-techspec/references/adr-template.md`
- `.codex/plans/2026-04-14-extension-bundles.md`
- `.codex/ledger/2026-04-14-MEMORY-extension-bundles.md`
- `internal/extension/bundle.go`
- `internal/bundles/service.go`
- `internal/api/core/bundles.go`
- `internal/api/contract/bundles.go`
- `internal/store/globaldb/global_db_bundles.go`
