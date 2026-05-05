Goal (incl. success criteria):

- Audit QA-related skills and repo instruction files for remaining inconsistencies around bootstrap manifests, browser policy, provider-home isolation, `AGH_WEB_API_PROXY_TARGET`, and helper script path references. Success = report concrete wording conflicts or missing integration points with file/line references; no file edits beyond this required session ledger.

Constraints/Assumptions:

- User requested a read-only repo check; do not edit scoped repo files.
- Must inspect `.agents/skills/{real-scenario-qa,qa-execution,qa-report,agh-worktree-isolation,skill-best-practices}` plus `AGENTS.md`, `CLAUDE.md`, `web/AGENTS.md`, `web/CLAUDE.md`.
- Read-only analysis only; no fixes in this turn.

Key decisions:

- Use a review-style output focused on findings ordered by severity.
- Limit evidence to the requested files and directly related instructions they reference when needed.

State:

- In progress.

Done:

- Confirmed scoped repo root and presence of requested AGENTS/CLAUDE files.
- Confirmed no prior ledger files exist under `.codex/ledger/`.
- Verified helper scripts exist only under each skill directory, not under repo-root `scripts/`.
- Verified `real-scenario-qa` requires `browser-use:browser` first while `qa-execution`, `qa-report`, and `qa-execution/references/web-ui-qa.md` still center `agent-browser`.
- Verified `web/AGENTS.md` and `web/CLAUDE.md` document `AGH_WEB_API_PROXY_TARGET`, but scoped QA skills do not connect it to isolated daemon ports.
- Verified `qa-execution/scripts/discover-project-contract.py` only scans repo-root manifests and emits generic `npm` commands that do not model AGH's Bun-first `web/` workflow well.

Now:

- Consolidating conflicts and missing integration points with line references.

Next:

- Deliver the review report.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED whether "provider-home isolation" is intended to include provider-specific homes/env vars beyond `AGH_HOME`; no scoped file names any such variables.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-27-MEMORY-qa-instruction-audit.md`
- `AGENTS.md`, `CLAUDE.md`, `web/AGENTS.md`, `web/CLAUDE.md`
- `.agents/skills/real-scenario-qa/SKILL.md`
- `.agents/skills/qa-execution/SKILL.md`
- `.agents/skills/qa-report/SKILL.md`
- `.agents/skills/agh-worktree-isolation/SKILL.md`
- `.agents/skills/skill-best-practices/SKILL.md`
- Commands: `rg`, `nl -ba`, `sed -n`
