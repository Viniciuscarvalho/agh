# Hermes Tail Template

Canonical row shape for the QA pair. Mirror this exactly when appending to a fresh `_tasks.md`.

## Column order (preserved from `cy-create-tasks` output)

```
| # | Title | Status | Complexity | Dependencies |
```

## qa-report row template

```markdown
| NN | QA Plan and Test Coverage | pending | high | task_<last_impl> |
```

Body content for the task file (`task_NN.md`):

- `<critical>ALWAYS READ _techspec.md, every ADR, and every per-task memory file before drafting test cases.</critical>`
- Activate `qa-report` skill.
- Output: `qa/test-plans/`, `qa/test-cases/` artifacts.
- Coverage: every public surface touched by tasks 01..N. Include CLI, HTTP, UDS, web routes, doc pages, automation triggers, extension points, agent-operation paths, and `config.toml` keys.
- Identify regression hot spots from `_techspec.md` invariants and ADRs.
- Plan negative tests, edge cases, and concurrency stress tests.

## qa-execution row template

```markdown
| NN | Real-Scenario QA Execution | pending | critical | task_<qa_report> |
```

Body content:

- `<critical>ALWAYS READ qa/test-plans/* before executing.</critical>`
- Activate `real-scenario-qa` for release-grade scope, `qa-execution` for inner mechanics.
- Activate `agh-worktree-isolation` (unique `AGH_HOME` + ports + tmux socket).
- For UI features: drive Playwright via `browser-use:browser` with `agent-browser` fallback.
- For CLI/API/agent-manageability features: exercise structured CLI output, HTTP/UDS routes, status/config discovery, deterministic errors, and compare persisted state.
- Generate `qa/issues/BUG-NNN.md` for every reproduced defect.
- Fix root causes; re-run gates; update `qa/verification-report.md`.

## E2E directive variants

When `requires_e2e=true`:

> Run `make test-e2e-runtime` (daemon harness) AND `make test-e2e-web` (Playwright). Drive the highest-risk UI workflow through `browser-use:browser`; fall back to `agent-browser` only if `browser-use:browser` is unavailable. Do not silently substitute shell-only checks.

When `requires_cli_e2e=true` and `requires_e2e=false`:

> Run `make test-e2e-runtime` and exercise the affected CLI verbs, HTTP/UDS routes, agent-operation paths, and config lifecycle end-to-end against a daemon-served runtime (unique `AGH_HOME`). Compare structured CLI output with HTTP/UDS responses for the same persisted state.

When neither is true (rare backend-only):

> Run `make test-integration` and a smoke `make test-e2e-runtime` even if no UI changed. Document the no-UI rationale in `qa/verification-report.md`.

## MVP Boundary update

If `_tasks.md` ends with a section like:

```markdown
## MVP Boundary
Tasks 01-16 implement the autonomy kernel. Tasks 17-18 prepare and execute QA.
```

Update the trailing range to include the appended tasks. Do NOT alter the kernel boundary description, only the numbers.
