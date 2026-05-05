Goal (incl. success criteria):

- Execute `.compozy/tasks/tools-refac/task_09.md`: add the session-bound `agh__autonomy` tool family and hard-cut AGH-owned autonomy contracts away from raw `claim_token`.
- Success means tool/CLI/HTTP/UDS/OpenAPI/web/docs surfaces use `run_id` plus session-bound lookup, raw `claim_token` stays internal, existing task lease writers remain authoritative, focused tests and `make verify` pass, and one local commit is created after verification.

Constraints/Assumptions:

- Conversation in BR-PT; artifacts/code/docs in English.
- No destructive git commands (`restore`, `checkout`, `reset`, `clean`, `rm`) without explicit permission.
- Must use workflow memory under `.compozy/tasks/tools-refac/memory/` and keep task tracking out of the automatic code commit unless explicitly required.
- Existing worktree has unrelated modified instruction/skill files and untracked `.compozy/tasks/tools-refac/`; do not touch unrelated changes.

Key decisions:

- No compatibility bridge or raw-token alias: public AGH-owned autonomy inputs/outputs must remove `claim_token`.
- Preserve `claim_token_hash` only as observability metadata.
- Route heartbeat/complete/fail/release through a session-bound lookup that resolves the internal raw token before calling existing task service writers.

State:

- PRD/ADR/TechSpec context loaded. No conflict found between Task 09, ADR-003, ADR-005, and TechSpec.
- Baseline search shows raw `claim_token` still present in contract/core/CLI/tests/OpenAPI/web/docs surfaces.
- Cross-agent ledger scan found `tools-refac-qa` claiming this hard cut was already fixed elsewhere, but current visible code still exposes raw `claim_token`; code/task docs remain the source of truth.
- Implementation decision confirmed: persist the raw token only inside `task_runs.claim_token` for active leases, keep all public read projections masked, and resolve internal tokens by `(session_id, run_id)` before calling existing task lease writers.
- Task complete. Session-bound implementation is committed locally as `1119d6e4 feat: add session-bound autonomy tools`, and post-commit `make verify` passed.

Done:

- Read workflow memory shared file and `task_09.md` memory.
- Read required skills: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `agh-code-guidelines`, `golang-pro`, `agh-test-conventions`, `testing-anti-patterns`, `agh-contract-codegen-coship`.
- Read `internal/CLAUDE.md`, `web/CLAUDE.md`, `packages/site/CLAUDE.md`, Task 09, `_techspec.md` sections, ADR-003, ADR-005, and lessons L-004/L-005.
- Mapped current lease writers/store masking, API contract/core handlers, CLI token flags, and native tool registry binding pattern.
- Added task-domain autonomy reason codes and `LookupActiveRunForSession`, with internal `task_runs.claim_token` retention during active leases and cleanup on terminal/release paths.
- Removed raw `claim_token` from public agent task claim/mutation DTOs, CLI flags, UDS/HTTP handlers, OpenAPI output, generated web types, and CLI reference pages.
- Added the `agh__autonomy` tool family and native handlers for claim-next/heartbeat/complete/fail/release over the existing lease writers.
- Added focused regression coverage for session-bound lookup reason codes, UDS/API redaction, CLI contract changes, and native autonomy routing.
- Focused Go packages passed: `go test ./internal/task ./internal/store/globaldb ./internal/api/... ./internal/cli ./internal/tools/builtin ./internal/daemon`.
- Focused CLI integration autonomy flows passed with `go test -tags integration ./internal/cli -run 'TestCLIAgentTaskLeaseLifecycleIntegration|TestCLIHistoricalChannelTaskNextAfterDaemonRestartIntegration|TestCLIHistoricalChannelMixedOwnershipAfterDaemonRestartIntegration' -count=1`.
- Fixed final lint issues from `make verify` and passed `go test ./internal/task ./internal/store/globaldb ./internal/daemon -count=1` plus `make lint`.
- Full pre-commit `make verify` passed with Bun lint/typecheck/test, web build, Go lint `0 issues`, Go tests `DONE 7080 tests`, build, and boundaries OK.
- Updated task-local workflow memory, shared workflow memory, `.compozy/tasks/tools-refac/task_09.md`, and `_tasks.md`.
- Created local commit `1119d6e4 feat: add session-bound autonomy tools`.
- Post-commit `make verify` passed with Bun lint/typecheck/test, web build, Go lint `0 issues`, Go tests `DONE 7080 tests`, and boundaries OK.

Now:

- Final handoff.

Next:

- None for Task 09 in this session.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Workflow memory: `.compozy/tasks/tools-refac/memory/MEMORY.md`, `.compozy/tasks/tools-refac/memory/task_09.md`
- Task tracking: `.compozy/tasks/tools-refac/task_09.md`, `.compozy/tasks/tools-refac/_tasks.md`
- Expected code surfaces: `internal/task`, `internal/api/contract`, `internal/api/core`, `internal/api/spec`, `internal/cli`, `internal/tools`, `internal/daemon`, `web/src/generated`, `web/src/systems/tasks`, `packages/site/content/runtime`
