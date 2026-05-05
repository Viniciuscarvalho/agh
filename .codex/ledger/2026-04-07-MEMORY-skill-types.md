Goal (incl. success criteria):

- Complete `skills-v2` task_01 by extending `internal/skills` with MCP/hook/provenance types, adding `SourceMarketplace`, deep-copying the new fields in clone helpers, covering the behavior with unit tests, and finishing with clean verification plus required task/memory tracking updates.

Constraints/Assumptions:

- Must follow root `AGENTS.md`, `CLAUDE.md`, `cy-workflow-memory`, `cy-execute-task`, and `cy-final-verify`.
- Scope is limited to task_01 surfaces: `internal/skills/types.go`, `internal/skills/registry.go`, unit tests, workflow memory, and task tracking files.
- `make verify` is the completion gate; task-specific coverage target is `internal/skills` >=80%.
- Manual skills in `~/.agh/skills/` remain `SourceUser` unless later tasks add sidecar-backed marketplace detection.

Key decisions:

- Use the techspec/ADR precedence model directly: `SourceMarketplace` sits between bundled and user.
- Keep marketplace handling in `skillSourceFromWorkspacePath()` unchanged unless a concrete workspace-source mapping is required by current code paths.

State:

- Task complete; code commit created and committed state verified clean.

Done:

- Read required skill docs, workflow memory files, task_01, `_techspec.md`, `_tasks.md`, ADR-001, ADR-004, and relevant prior ledgers.
- Inspected current `internal/skills/types.go`, `internal/skills/registry.go`, and existing registry/loader tests.
- Captured baseline gap: the new marketplace/MCP/hook/provenance types and clone logic are not implemented yet.
- Added `MCPServerDecl`, `HookDecl`, `HookEvent`, `Provenance`, `SourceMarketplace`, and the new `Skill` fields in `internal/skills/types.go`.
- Updated `internal/skills/registry.go` to deep-copy MCP server declarations, hook declarations, and provenance, and to name/parse marketplace sources.
- Added unit coverage for the new declarations, source ordering/naming, and extended clone behavior.
- Ran `go test ./internal/skills -count=1`, `go test ./internal/skills -cover -count=1` (`81.6%` after final commit), and `make verify` successfully.
- Updated workflow memory and task tracking files locally and created local code commit `c760b7d` (`feat: extend marketplace skill types`).

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Files: `internal/skills/types.go`, `internal/skills/registry.go`, `internal/skills/registry_test.go`, `.compozy/tasks/skills-v2/memory/MEMORY.md`, `.compozy/tasks/skills-v2/memory/task_01.md`, `.compozy/tasks/skills-v2/task_01.md`, `.compozy/tasks/skills-v2/_tasks.md`
- Commands: `sed`, `rg`, `go test ./internal/skills -count=1`, `go test ./internal/skills -cover -count=1`, `make verify`, `git status --short`
