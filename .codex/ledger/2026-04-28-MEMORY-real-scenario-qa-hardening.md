# Goal (incl. success criteria):

- Implement accepted Behavioral Real-Scenario QA Hardening plan.
- Success: QA skills require realistic operator/agent/LLM behavior evidence rather than smoke-only checks; accepted plan persisted under `.codex/plans/`; metadata/static checks and `make verify` run.

# Constraints/Assumptions:

- Do not run destructive git commands.
- Preserve unrelated dirty worktree changes.
- Conversation may be BR-PT; artifacts and code/docs are English.
- Use `skill-best-practices` for skill edits.
- Plan acceptance must be persisted under `.codex/plans/`.

# Key decisions:

- Scope covers `real-scenario-qa`, `qa-report`, `qa-execution`, and light `agh-qa-bootstrap` wording.
- Behavior-first QA means user/operator journeys, real agent roles, live provider-backed agent sessions when available, coherent artifacts, and cross-surface product truth checks.
- Smoke checks are entry criteria only, not completion evidence.

# State:

- Implementation and verification complete.

# Done:

- Scanned recent ledgers for cross-agent awareness.
- Read `skill-best-practices`.
- Observed existing dirty worktree before edits.
- Persisted accepted plan to `.codex/plans/2026-04-28-real-scenario-qa-behavioral-hardening.md`.
- Updated `real-scenario-qa` with a mandatory Behavioral Scenario Charter, live provider/LLM evidence requirements, anti-smoke gates, behavior-first execution, and behavioral final readiness criteria.
- Replaced `real-scenario-qa` scenario matrix with behavior-first tracks and minimum scenario composition.
- Updated real-scenario evidence checklist, final report template, and bug template with behavioral impact, agent evidence, artifacts, cross-surface truth, disruptions, and provider-boundary fields.
- Updated `qa-report` and its test/regression/bug templates to generate `TC-SCEN` real-scenario cases and keep smoke as readiness-only.
- Updated `qa-execution` instructions, checklist, Web QA reference, verification report, and issue template to execute/replay high-risk operator/agent journeys.
- Clarified `agh-qa-bootstrap` is infrastructure only and does not satisfy real-scenario QA.
- Metadata validation passed for changed `real-scenario-qa`, `qa-report`, and `qa-execution` descriptions.
- Metadata validation passed for `agh-qa-bootstrap`.
- `git diff --check` passed for the working set.
- Python helper compile check passed for QA helper scripts.
- Bash syntax check passed for QA shell helpers.
- `make verify` passed: Web format/lint/typecheck/tests/build, Go lint/tests/build, and package boundaries.

# Now:

- Ready to summarize.

# Next:

- None.

# Open questions (UNCONFIRMED if needed):

- None.

# Working set (files/ids/commands):

- `.agents/skills/real-scenario-qa/`
- `.agents/skills/qa-report/`
- `.agents/skills/qa-execution/`
- `.agents/skills/agh-qa-bootstrap/`
- `.codex/plans/2026-04-28-real-scenario-qa-behavioral-hardening.md`
- `.codex/ledger/2026-04-28-MEMORY-real-scenario-qa-hardening.md`
