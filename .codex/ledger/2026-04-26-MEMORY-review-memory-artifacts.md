Goal (incl. success criteria):

- Review the previous memory/skills/CLAUDE.md artifact batch, fix invalid skills, remove harmful inconsistency/duplication, and validate the result.
- Follow-up: update stale references after `docs/_memory/analysis_*.md` files were moved under `docs/_memory/analysis/`.
- Follow-up: add the missing rule that every spec/feature lifecycle change must plan extensibility integration, agent-manageable CLI/HTTP/UDS support, and config.toml lifecycle impact.

Constraints/Assumptions:

- Do not run destructive git commands.
- Do not touch unrelated dirty source changes unless directly required by this review.
- Conversation in Brazilian Portuguese; artifacts in English.
- Skill metadata must be valid YAML and follow skill-best-practices constraints.

Key decisions:

- Focus first on loader-blocking SKILL.md YAML errors, then audit generated guidance for overreach and duplication.
- Treat the Paper MCP startup error as configuration/runtime evidence to investigate separately from repo skill YAML.

State:

- In progress.

Done:

- Loaded systematic-debugging, no-workarounds, testing-anti-patterns, and skill-best-practices.
- Scanned existing ledger files for cross-agent awareness.
- Captured git status showing many pre-existing dirty files; relevant generated surfaces include root CLAUDE/AGENTS, docs/\_memory, .agents/skills/\* generated skills, and packages/site CLAUDE/AGENTS.
- Fixed YAML frontmatter for agh-test-conventions, agh-cleanup-failure-paths, and cy-spec-preflight.
- Split root skill dispatch for PRD, TechSpec, and Task generation so unrelated cy-\* skills do not all trigger together.
- Reconciled cy-spec-preflight/cy-tasks-tail-qa-pair with the actual cy-create-tasks table format.
- Updated cy-research-competitors so subagents are read-only and the parent writes analysis files.
- Replaced invalid model shorthand in operational docs with model + reasoning_effort wording.
- Validated all SKILL.md frontmatter with Ruby YAML parser; result OK.
- Validated generated skill metadata with skill-best-practices validator; result OK for generated skills.
- Py-compiled generated Python validators; result OK.
- Found stale analysis-doc references in `docs/_memory` lessons/playbook/synthesis/standing directives and a few skill references.
- Updated stale analysis-doc references to `analysis/analysis_*.md`, `../analysis/analysis_*.md`, or `docs/_memory/analysis/analysis_*.md` depending on the source file location.
- Verified no bare stale `analysis_*.md` references remain outside `docs/_memory/analysis/`.
- Verified no trailing whitespace in the touched docs/skill references.
- Mapped relevant guidance surfaces: root CLAUDE/AGENTS, spec-authoring playbook, standing directives, cy-spec-preflight, cy-web-docs-impact.
- Added root CLAUDE/AGENTS premise: every capability must be extensible and agent-manageable; added workflow, architecture, runtime, and config lifecycle rules.
- Added `SD-011 — Extensible and Agent-Manageable by Design` to standing directives.
- Updated spec-authoring playbook with required Extensibility Integration Plan, Agent Manageability Plan, and Config Lifecycle sections.
- Updated cy-spec-preflight, cy-web-docs-impact, cy-create-prd, cy-create-techspec, cy-create-tasks, and cy-tasks-tail-qa-pair guidance/templates/checklists to enforce the new sections.
- Validated touched skill metadata and all SKILL.md YAML; result OK.
- Verified CLAUDE.md and AGENTS.md remain byte-identical; result OK.
- Verified no stale `SD-001..SD-010`, old `docs/_memory/analysis_*.md` references, or trailing whitespace remain in touched guidance surfaces.

Now:

- Summarize changes to user.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether the local Paper MCP service is expected to be running during this task.

Working set (files/ids/commands):

- .agents/skills/agh-test-conventions/SKILL.md
- .agents/skills/agh-cleanup-failure-paths/SKILL.md
- .agents/skills/cy-spec-preflight/SKILL.md
- CLAUDE.md
- AGENTS.md
- packages/site/CLAUDE.md
- packages/site/AGENTS.md
- docs/\_memory/
- docs/\_memory/analysis/
- docs/\_memory/spec-authoring-playbook.md
- docs/\_memory/standing_directives.md
- .agents/skills/cy-spec-preflight/SKILL.md
- .agents/skills/cy-spec-preflight/references/\*.md
- .agents/skills/cy-web-docs-impact/SKILL.md
- .agents/skills/cy-web-docs-impact/references/audit-triggers.md
- ~/.codex/config.toml has `[mcp_servers.paper] url = "http://127.0.0.1:29979/mcp"`; service was not reachable in the user-reported warning.
