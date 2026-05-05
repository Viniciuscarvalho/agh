Goal (incl. success criteria):

- Implement Task 12: agent-operable CLI commands for Soul, Heartbeat, and session health via managed UDS/API behavior, with tests, tracking updates, verification, and one local commit if clean.

Constraints/Assumptions:

- Do not run destructive git commands (`git restore`, `git checkout`, `git reset`, `git clean`, `git rm`) without explicit permission.
- Must read workflow memory and PRD specs before editing code.
- Must use `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, Go/test skills.
- Must run `make verify` before completion/commit.
- Conversation in BR-PT; code/docs artifacts in English.

Key decisions:

- Implement CLI verbs against Task 11 HTTP/UDS contract DTOs and managed API routes; do not duplicate Soul/Heartbeat service logic in CLI.
- Add global `--json` as an alias for deterministic JSON output while preserving the existing `-o/--output json` convention.
- If the operator-scoped Soul validate route is missing, add it to HTTP/UDS and reuse shared core validation logic instead of routing CLI validation through an agent-caller-only path.
- Preserve workspace-resolved `[agents]` config in `workspace.cloneConfig`; managed Soul/Heartbeat authoring depends on non-zero resolver defaults.
- CLI integration authoring uses a workspace-local agent definition because managed authoring must not write `SOUL.md`/`HEARTBEAT.md` outside the registered workspace root.

State:

- Task complete; local code commit and post-commit verification are complete.

Done:

- Read required workflow/execution/final-verify and Go/test skill entrypoints.
- Read root AGENTS/CLAUDE and `internal/CLAUDE.md` entrypoint.
- Read workflow memory, Task 12 memory, aggregate/child TechSpecs, ADRs, local CLI/API patterns, and relevant cross-agent ledgers.
- Captured baseline: `agh agent soul` currently falls through to the parent `agent` help and no Task 12 CLI tree exists.
- Added Task 12 CLI trees, UDS client methods, operator Soul validate route, codegen, command tests, and CLI integration coverage.
- Fixed `workspace.cloneConfig` dropping `Agents`, which caused workspace authoring config to validate as zero.
- Focused tests passed for CLI command behavior, route registration, workspace clone coverage, and authored-context CLI integration.
- Fixed the first `make verify` Go lint findings: large output-bundle parameters, redundant workspace helper parameter, and long method/flag lines.
- Re-ran focused CLI tests, authored-context CLI integration, and `make lint`; all passed.
- Ran `make verify` twice after implementation; the latest pre-commit run passed with Bun tests `264` files / `1872` tests, Go gate `7693` tests, and package boundaries OK.
- Updated Task 12 tracking and task memory; tracking/memory will stay out of the code commit.
- Created local commit `2ee510ec` (`feat: add authored context CLI commands`) with code/generated/docs only.
- Re-ran post-commit `make verify`; it passed with Bun tests `264` files / `1872` tests, Go gate `7693` tests, and package boundaries OK.
- Updated shared/task workflow memory with the Task 12 handoff.

Now:

- Final handoff.

Next:

- None for Task 12 unless the user asks for follow-up.

Open questions (UNCONFIRMED if needed):

- None yet.

Working set (files/ids/commands):

- `.codex/ledger/2026-05-02-MEMORY-agent-operable-cli.md`
- `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/agent-soul/memory/MEMORY.md`
- `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/agent-soul/memory/task_12.md`
- `internal/cli/*`
- `internal/workspace/{clone.go,resolver_test.go}`
- `internal/api/core/authored_context.go`
- `internal/api/{httpapi,udsapi}/routes.go`
- `openapi/agh.json`
- `web/src/generated/agh-openapi.d.ts`
