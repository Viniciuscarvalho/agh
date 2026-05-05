# Goal (incl. success criteria):

- Implement deterministic local QA bootstrap hardening across AGH repo skills/instructions and the global `~/.codex` loop/runtime guidance.
- Success requires a reusable bootstrap contract, aligned QA skills, enforced instruction changes, smoke evidence, and a fresh `make verify`.

# Constraints/Assumptions:

- Follow root `AGENTS.md` and `~/.codex/AGENTS.md`; no destructive git commands.
- Scope includes repo-local files and global `~/.codex` runtime guidance/config used by QA loops.
- Must persist the accepted plan under `.codex/plans/`.
- Final claims require fresh verification evidence.

# Key decisions:

- Add a new repo-local skill `agh-qa-bootstrap`.
- Use `<qa-output-path>/qa/bootstrap-manifest.json` and `bootstrap.env` as the canonical bootstrap handoff.
- Prefer reusing a healthy QA lab by default; only create a fresh wave when explicitly requested or when health checks fail.
- Standardize provider isolation with dedicated `HOME`/`CODEX_HOME` instead of inheriting raw global `~/.codex`.
- Standardize Web QA on `browser-use` first, `agent-browser` fallback second.

# State:

- Completed.

# Done:

- Analyzed repo/global skills, ledgers, plans, and logs for QA bootstrap failures.
- Confirmed main issues: thin scenario bootstrap, contradictory browser guidance, ambiguous helper paths, missing provider isolation, config-write races, and loop continuations that do not prefer healthy lab reuse.
- Persisted the accepted implementation plan to `.codex/plans/2026-04-27-qa-bootstrap-hardening.md`.
- Added repo-local skill `.agents/skills/agh-qa-bootstrap/` with a bootstrap CLI that creates or reuses a QA lab, isolates provider `HOME`/`CODEX_HOME`, writes `bootstrap-manifest.json` and `bootstrap.env`, and embeds the discovered project contract.
- Aligned `real-scenario-qa`, `qa-execution`, `qa-report`, `agh-worktree-isolation`, `skill-best-practices`, `AGENTS.md`, `CLAUDE.md`, `web/AGENTS.md`, and `web/CLAUDE.md` to the new manifest/browser/helper-path contract.
- Improved `.agents/skills/qa-execution/scripts/discover-project-contract.py` so AGH now surfaces Bun and `make web-dev`/`web/*` targets instead of generic npm-only defaults.
- Updated global `~/.codex/AGENTS.md`, `~/.codex/codex-timed-loop/config.toml`, `loop_common.py`, and `loop_stop.py` to support generic QA bootstrap reuse without AGH-specific field names in the plugin contract.
- Smoke-validated the new bootstrap twice (`REUSED_LAB=false` on first bootstrap, `REUSED_LAB=true` on reuse) and verified the generated provider home and manifest.
- Tightened the policy after user clarification: fresh lab is now the default for a new QA pass; reuse only happens when the same active session/loop provides an explicit manifest path.
- Re-smoke-validated the revised policy: two fresh invocations for the same scenario produced two distinct labs with `REUSED_LAB=false`, and explicit `--reuse-manifest` reused the original lab with `REUSED_LAB=true`.
- Ran fresh verification successfully after the policy change: `python3 -m py_compile ...` for the touched Python files, helper contract smoke checks, and `make verify` passing.

# Now:

- Task complete; preparing the final summary.

# Next:

- None.

# Open questions (UNCONFIRMED if needed):

- None.

# Working set (files/ids/commands):

- `.codex/plans/2026-04-27-qa-bootstrap-hardening.md`
- `.codex/ledger/2026-04-27-MEMORY-qa-bootstrap-hardening.md`
- `.agents/skills/agh-qa-bootstrap/`
- `.agents/skills/real-scenario-qa/`
- `.agents/skills/qa-execution/`
- `.agents/skills/qa-report/`
- `.agents/skills/agh-worktree-isolation/`
- `.agents/skills/skill-best-practices/`
- `AGENTS.md`
- `CLAUDE.md`
- `web/AGENTS.md`
- `web/CLAUDE.md`
- `~/.codex/AGENTS.md`
- `~/.codex/codex-timed-loop/config.toml`
- `~/.codex/codex-timed-loop/hooks/loop_common.py`
- `~/.codex/codex-timed-loop/hooks/loop_stop.py`
- `make verify`
