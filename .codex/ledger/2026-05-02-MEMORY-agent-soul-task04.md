Goal (incl. success criteria):

- Implement `.compozy/tasks/agent-soul/task_04.md`: integrate resolved Soul snapshots into session start, prompt/context assembly, explicit refresh, spawn semantics, and task claim provenance.
- Success means deterministic prompt/context inclusion, session snapshot/refresh persistence, task claim provenance without claim-time SOUL.md file I/O, no implicit parent Soul inheritance, invalid Soul fail-closed behavior, required tests, clean `make verify`, tracking updates, and one local code commit.

Constraints/Assumptions:

- Conversation in BR-PT; code/docs/artifacts in English.
- Must use `cy-workflow-memory`, `cy-execute-task`, and `cy-final-verify`.
- Must read workflow memory, PRD specs, ADR-001 through ADR-006, root/backend guidance before code edits.
- Must follow `agh-code-guidelines`, `golang-pro`, `agh-test-conventions`, and `testing-anti-patterns`.
- Do not run destructive git commands.
- Automatic local commit is enabled only after clean verification, self-review, memory/tracking updates.
- Keep tracking-only `.compozy/tasks/*`, workflow memory, and ledger files out of the code commit unless repo requirements force staging.

Key decisions:

- Reuse task 01 resolver types and task 02 GlobalDB snapshot/session provenance methods as the only Soul authority.
- Add agent source-path plumbing to `config.AgentDef` so session start resolves the `SOUL.md` beside the selected target agent instead of guessing from names when a concrete `AGENT.md` path is known.
- Session start/refresh should persist active valid Soul snapshots before exposing `soul_snapshot_id` / `soul_digest` on session metadata; missing or disabled Soul clears/omits the session snapshot, and invalid existing Soul fails closed.
- Prompt integration should be an append startup section with no harness-policy predicate so it renders after the base `AGENT.md` prompt and before skills/tools/network; the provider itself returns empty when no active snapshot exists.
- Task claim should receive session Soul provenance through `ClaimCriteria` and merge a `soul` metadata object into `task_runs.metadata_json` inside the claim transaction without filesystem access.

State:

- Core implementation, behavioral tests, task tracking, workflow memory updates, local commit, and post-commit verification are complete.

Done:

- Read shared workflow memory and `task_04` workflow memory.
- Scanned other ledger names and read recent `agent-soul` task ledgers for task 01-03 handoff context.
- Loaded required workflow, Go, and test skills plus root/backend guidance.
- Captured pre-existing dirty worktree state: task tracking files and `.compozy/tasks/agent-soul/memory/` are already modified/untracked.
- Read task specs, aggregate/child techspecs, ADR-001..ADR-006, competitor analyses, and current session/prompt/context/task code.
- Confirmed pre-change gaps in runtime integration: no session `Info`/meta Soul fields, no prompt Soul section, no `/agent/context` Soul projection, no claim provenance in `ClaimCriteria` or `ClaimNextRun`.
- Added agent source-path propagation, session/meta Soul fields, startup/refresh Soul snapshot wiring with session-scoped locks, prompt Soul section provider, compact `/agent/context` Soul projection, spawn parent Soul provenance, task claim Soul criteria, and GlobalDB metadata merge.
- Ran compile smoke: `go test ./internal/session ./internal/daemon ./internal/situation ./internal/api/core ./internal/api/contract ./internal/task ./internal/store/globaldb ./internal/agentidentity ./internal/config ./internal/workspace ./internal/soul -run TestDoesNotExist -count=1` passed.
- Added behavioral tests for prompt ordering/budgeting, compact Soul context, session start/refresh/locking/invalid failure, spawn parent provenance without inheritance, task claim metadata/no claim-time SOUL.md read, and core claim criteria provenance.
- Focused packages passed: `go test ./internal/session ./internal/daemon ./internal/situation ./internal/api/core ./internal/api/contract ./internal/task ./internal/store/globaldb ./internal/agentidentity ./internal/config ./internal/workspace ./internal/soul -count=1`.
- Test convention helper passed for new `internal/session/soul_test.go`; existing touched test files still report pre-existing convention violations outside this task's additions.
- `make web-test` passed: 200 test files, 1506 tests. Output included repeated Node `NO_COLOR` ignored because `FORCE_COLOR` is set warnings, but command exited 0.
- First `make verify` attempt failed in `make lint` on `funlen`, `lll`, and `gocritic hugeParam` issues in new Soul refresh/prompt code; split refresh helpers and switched heavy Soul values to pointers.
- After lint corrections, focused affected Go package suite passed again and `make lint` passed with 0 issues. Golangci printed non-blocking `modernize: omitzero` alternative-fix notices.
- Second `make verify` attempt failed immediately in `codegen-check` because `openapi/agh.json` was stale. Ran `make codegen`; official generated output reserialized `openapi/agh.json` heavily, and `make codegen-check` then passed.
- Third `make verify` attempt reached race-enabled `make test` and failed: extension tests exposed zero-valued `Agents.Soul` from partial test workspace configs, and one session stop lifecycle test blocked. Root-caused the Soul config issue to session integration passing raw partial config; added session-boundary defaulting only for the zero-value Soul config and a regression test.
- Validated the Soul config fix with the new focused test, representative extension tests, and `go test -race ./internal/session ./internal/extension -count=1`; all passed. The previous stop lifecycle failure reproduced as passing 20 times under `-race`, so it appears load/timing-related in the failed full gate run.
- Full `make verify` passed after the Soul config fix. Final output included `DONE 7479 tests in 62.198s` and `OK: all package boundaries respected`. Non-blocking repeated warnings remained: Node `NO_COLOR`/`FORCE_COLOR`, Turbo update notice, Vite chunk size warning, and macOS linker `-bind_at_load`.
- Added explicit resume/reopen provenance regressions after final task matrix review: session Soul provenance survives `Resume`, and task-run Soul metadata survives GlobalDB close/reopen. Focused tests passed for `TestManagerSoulSessionSnapshots` and `TestGlobalDBClaimNextRunPersistsSoulProvenanceMetadata`.
- Final pre-commit `make verify` passed after resume/reopen regressions: `DONE 7480 tests in 50.597s`; package boundaries OK.
- Updated `.compozy/tasks/agent-soul/task_04.md`, `.compozy/tasks/agent-soul/_tasks.md`, and workflow memory for task completion.
- Pre-commit `make verify` passed again after tracking/memory updates: `DONE 7480 tests in 11.968s`; package boundaries OK.
- Created local commit `fd256b7b` (`feat: integrate agent soul runtime context`).
- Post-commit `make verify` passed: `DONE 7480 tests in 13.929s`; package boundaries OK.

Now:

- Prepare final response with commit hash, verification evidence, and remaining unrelated dirty files.

Next:

- None for this task.

Open questions (UNCONFIRMED if needed):

- None currently blocking.

Working set (files/ids/commands):

- Workflow memory: `.compozy/tasks/agent-soul/memory/MEMORY.md`, `.compozy/tasks/agent-soul/memory/task_04.md`
- Task files: `.compozy/tasks/agent-soul/task_04.md`, `.compozy/tasks/agent-soul/_tasks.md`
- Ledger: `.codex/ledger/2026-05-02-MEMORY-agent-soul-task04.md`
- Expected implementation files: `internal/config/agent.go`, `internal/workspace/clone.go`, `internal/daemon/agent_skill_resources.go`, `internal/session/*`, `internal/daemon/prompt_sections.go`, `internal/daemon/composed_assembler.go`, `internal/situation/*`, `internal/api/contract/agents.go`, `internal/api/core/agent_tasks.go`, `internal/agentidentity/identity.go`, `internal/task/lease.go`, `internal/store/globaldb/global_db_task_claim.go`
- New implementation files: `internal/session/soul.go`, `internal/daemon/prompt_soul.go`, `internal/daemon/soul_runtime.go`
