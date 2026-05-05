# Goal (incl. success criteria):

- Create a reusable AGH skill for production-like release/feature QA using realistic startup scenarios.
- Include an `argument-hint` for the scope/context under test, such as a release candidate or a complex feature area.
- Follow `skill-best-practices` metadata, structure, progressive-disclosure, and validation rules.

# Constraints/Assumptions:

- Do not use destructive git commands.
- Use `.agents/skills/skill-best-practices/SKILL.md`.
- Keep skill instructions lean and move scenario matrices/templates into `references/` or `assets/`.
- `make verify` is required before completion under workspace policy.

# Key decisions:

- Skill name: `real-scenario-qa`.
- Argument hint: `[scope-or-context]`.
- The skill orchestrates `qa-report`, `qa-execution`, `systematic-debugging`, `no-workarounds`, and browser validation when applicable, instead of replacing them.
- CLI validation and Web validation through `browser-use:browser` are mandatory release gates when those surfaces exist; fallback browser automation must be documented explicitly.
- Approved Web fallback is specifically `agent-browser` when `browser-use:browser` is unavailable after setup; shell/API-only checks are not acceptable Web substitutes.

# State:

- Skill implemented and validated.
- Skill updated after user feedback to require both CLI and browser-based Web coverage.
- Skill updated after user feedback to name `agent-browser` as the explicit fallback for unavailable browser-use.
- `make verify` passed again: web checks/build, Go tests/build, and package boundary check completed successfully.

# Done:

- Read current release QA ledger and recent ledger list for context.
- Read `skill-best-practices`, `qa-report`, `qa-execution`, and skill authoring checklist/template.
- Created `.agents/skills/real-scenario-qa/SKILL.md` with `argument-hint: "[scope-or-context]"`.
- Created supporting references, templates, and workspace initialization script.
- Validated metadata with `validate-metadata.py`.
- Validated helper script syntax with `bash -n`.
- Smoke-tested workspace initialization script with a feature-focused scope.
- Ran `make verify` successfully.
- Updated `real-scenario-qa` instructions, evidence checklist, scenario matrix, issue template, and final report template to require CLI + Web/browser-use validation.
- Re-ran metadata validation, script syntax validation, and `make verify` successfully after the update.
- Updated `real-scenario-qa` instructions, evidence checklist, scenario matrix, issue template, and final report template to document `agent-browser` as the approved fallback.
- Fixed a pre-existing lint blocker in `internal/task/hooks_test.go` by reordering the helper parameters so `context.Context` is first; behavior unchanged.
- Re-ran metadata validation, script syntax validation, and `make verify` successfully after the fallback update.

# Now:

- Ready to summarize the agent-browser fallback correction.

# Next:

- None for this task.

# Open questions (UNCONFIRMED if needed):

- None.

# Working set (files/ids/commands):

- `.agents/skills/real-scenario-qa/`
- `internal/task/hooks_test.go` (minimal lint-only fix in pre-existing modified test)
- `.codex/ledger/2026-04-26-MEMORY-real-scenario-qa-skill.md`
- Metadata command: `python3 .agents/skills/skill-best-practices/scripts/validate-metadata.py --name real-scenario-qa --description ...`
- Verification command: `make verify`
- Latest verification: `DONE 6323 tests in 30.245s`; package boundaries respected.
