Goal (incl. success criteria):

- Complete ext-architecture task_04 by adding a capability checker with source-trust tiers, typed capability denial errors, and table-driven tests for source-tier and Host API enforcement.
- Success means: `internal/extension/capability.go` and tests exist, denials align with `-32001 capability_denied` semantics, tracking/memory files are updated correctly, coverage for `internal/extension` stays >=80%, and `make verify` passes before completion/commit.

Constraints/Assumptions:

- Follow root `AGENTS.md` and `CLAUDE.md`; do not touch unrelated worktree changes except required task/workflow tracking files.
- Required skills for this run: `cy-workflow-memory`, `cy-execute-task`, `golang-pro`, `testing-anti-patterns`, and `cy-final-verify` before any completion claim or commit.
- Source of truth is `.compozy/tasks/ext-architecture/task_04.md`, `_techspec.md`, `_protocol.md`, `_tasks.md`, ADR-003, and the provided workflow memory files.
- Existing unrelated modifications are present in `.compozy/tasks/ext-architecture/task_01.md`, `task_02.md`, `task_03.md`, `_tasks.md`, and `docs/ideas/anp/*`; leave them intact.

Key decisions:

- No conflict found between task_04, `_techspec.md`, `_protocol.md`, and ADR-003; implement source tier as a ceiling applied before manifest requests.
- Reuse manifest fields from task_03 (`Actions.Requires`, `Security.Capabilities`) and align Host API mapping with `_protocol.md` instead of inventing new capability names.
- Mirror the `internal/skills.SkillSource` shape for `ExtensionSource`, but keep extension-specific semantics local to `internal/extension`.

State:

- Verification complete; workflow memory and task tracking are updated, and the local code-only commit is still pending.

Done:

- Read required skill docs, workflow memory, task_04, `_techspec.md`, `_tasks.md`, `_protocol.md`, ADR-003, and relevant ledgers for task_03 and protocol work.
- Confirmed baseline gap: `internal/extension/` currently has only manifest loading/tests; no capability checker exists.
- Confirmed existing handshake structs already expose `GrantedActions` and `GrantedSecurity`.
- Captured current worktree state to avoid touching unrelated changes.
- Published the execution checklist and captured the pre-change signal before implementation.
- Added `internal/extension/capability.go` with `ExtensionSource`, `CapabilityChecker`, marketplace source-tier ceilings, Host API method-to-security mapping, wildcard-aware security grant matching, and typed `ErrCapabilityDenied` data carrying the `-32001` equivalent code.
- Added `internal/extension/capability_test.go` with table-driven coverage for `Check`, `CheckHostAPI`, trusted-source grants, marketplace restrictions/defaults, source-tier ceiling application, and wildcard grant handling.
- Ran `go test ./internal/extension -count=1`, `go test ./internal/extension -coverprofile=/tmp/internal-extension-task04.cover.out -covermode=count -count=1` (`81.7%`), and `make verify` successfully.
- Updated workflow memory (`MEMORY.md`, `task_04.md`) and task tracking (`task_04.md`, `_tasks.md`) after verification.

Now:

- Review staging scope and create the local code-only commit.

Next:

- Re-run `make verify` on committed `HEAD` and capture the final verification evidence for handoff.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-10-MEMORY-capability-checker.md`
- `.compozy/tasks/ext-architecture/task_04.md`
- `.compozy/tasks/ext-architecture/_techspec.md`
- `.compozy/tasks/ext-architecture/_protocol.md`
- `.compozy/tasks/ext-architecture/adrs/adr-003.md`
- `.compozy/tasks/ext-architecture/memory/MEMORY.md`
- `.compozy/tasks/ext-architecture/memory/task_04.md`
- `.compozy/tasks/ext-architecture/task_04.md`
- `.compozy/tasks/ext-architecture/_tasks.md`
- `internal/extension/manifest.go`
- `internal/extension/capability.go`
- `internal/extension/capability_test.go`
- `internal/skills/types.go`
- `internal/subprocess/handshake.go`
- `internal/hooks/permission.go`
- Commands: `rg`, `sed`, `git status`, `go test`, `go tool cover -func`, `make verify`, `git commit`
