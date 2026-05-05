Goal (incl. success criteria):

- Complete workspace-entity task_08 by adding resolver-aligned `AdditionalDirs` to ACP start options, forwarding them on `session/new` and `session/load`, extending session plumbing/tests, and finishing with clean verification plus task tracking updates.

Constraints/Assumptions:

- Required inputs already read: root `AGENTS.md`, `CLAUDE.md`, workflow memory files, `task_08.md`, `_techspec.md`, `_tasks.md`, ADR-001..004, and related task ledgers.
- Scope should stay centered on `internal/acp` and `internal/session`, with minimal test helper changes needed to assert the wire payload.
- The `.compozy/tasks/workspace-entity/` tree is currently untracked; workflow memory/task tracking updates should stay out of the eventual code commit.
- Existing unrelated worktree change in `.compozy/tasks/skills-system/_meta.md` must remain untouched.

Key decisions:

- Follow the task `_techspec.md` as source of truth for wire naming: ACP request payloads will use a top-level `additional_dirs` field for both `session/new` and `session/load`.
- Skip the `brainstorming` skill because this run already has an approved PRD/techspec task with explicit deliverables and validation gates.
- Match resolver semantics by canonicalizing `Cwd` and `AdditionalDirs` via absolute-path resolution, `EvalSymlinks`, directory existence checks, and root-dir deduplication.
- Keep the change scoped to start/load transport; ACP permission sandbox expansion for additional roots is out of scope unless required by failing validation.

State:

- Task complete; code-only commit created; full verification re-run on committed `HEAD` passed.

Done:

- Read repository instructions, required skills, workflow memory, task spec, techspec, master tasks file, ADRs, and related ledgers.
- Inspected `internal/acp`, `internal/session`, `internal/workspace`, ACP SDK request types, and current test helpers.
- Identified the pre-change gap: `StartOpts` lacks `AdditionalDirs`, session create/resume only pass `RootDir`, ACP start/load requests only send `cwd` and `mcpServers`, and the helper agent does not inspect raw start/load payloads.
- Added `StartOpts.AdditionalDirs`, absolute-path validation, resolver-aligned canonicalization/dedupe for `Cwd` and additional roots, and local ACP wire request structs that send top-level `additional_dirs` on `session/new` and `session/load`.
- Threaded resolver `ResolvedWorkspace.AdditionalDirs` through session create/resume and updated session fake-driver cloning so tests can assert the propagated values.
- Extended ACP tests to verify empty baseline behavior, multi-root payloads for both new/load flows via raw captured JSON-RPC messages, and invalid additional-dir failures; added session tests for create/resume propagation.
- Ran `go test ./internal/acp -count=1`, `go test ./internal/session -count=1`, `go test ./internal/acp -cover -count=1` (`82.0%`), `go test -tags integration ./internal/acp -count=1`, and `make verify` successfully.
- Updated workflow memory and task tracking artifacts outside the future code commit.
- Created local commit `d99a5eb` (`feat: send acp additional workspace dirs`).
- Re-ran `make verify` on committed `HEAD` and got exit code 0 with `0 issues.`, `DONE 749 tests in 0.184s`, and `OK: all package boundaries respected`.
- Re-ran ACP-specific handoff checks: `go test ./internal/acp -cover -count=1` (`82.0%` coverage) and `go test -tags integration ./internal/acp -count=1` (pass).

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether ACP permission sandboxing should later expand beyond `Cwd` to permit client file access under `AdditionalDirs`; current task scope did not require it and verification stayed green without that follow-up.

Working set (files/ids/commands):

- Files: `internal/acp/types.go`, `internal/acp/client.go`, `internal/acp/handlers.go`, `internal/acp/client_test.go`, `internal/acp/handlers_test.go`, `internal/session/manager.go`, `internal/session/manager_test.go`, workflow memory/task tracking files.
- Commands: `rg -n 'AdditionalDirs|session/new|session/load|normalizeStartOpts' internal`, targeted `go test` for `internal/acp` and `internal/session`, `make verify`, `git status --short`.
