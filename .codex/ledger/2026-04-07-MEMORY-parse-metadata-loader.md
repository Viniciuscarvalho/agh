Goal (incl. success criteria):

- Complete `skills-v2` task_03 by parsing `metadata.agh.mcp_servers` and `metadata.agh.hooks` into typed `Skill.MCPServers` / `Skill.Hooks`, covering both disk and bundled loader paths, adding fixture-based tests, and finishing with clean verification plus tracking updates and one local code commit.

Constraints/Assumptions:

- Must follow root `AGENTS.md`, `CLAUDE.md`, task_03, `_techspec.md`, `_tasks.md`, ADR-001..004, and the provided workflow memory files.
- Required skills for this run: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, and `testing-anti-patterns`.
- Scope stays within `internal/skills` plus required workflow/task tracking files; no silent expansion into future MCP/hook runtime tasks.
- Existing unrelated worktree changes in `docs/rfcs/skills-system-final.md` and untracked `.compozy/tasks/skills-v2/` files must not be disturbed beyond the task-required memory/tracking updates.

Key decisions:

- Parse `metadata.agh` via nested `map[string]any` assertions only; no second YAML decode pass.
- Malformed `metadata.agh`, bad MCP entries, and unknown hook events should log warnings and be skipped rather than failing the skill load.
- Add fixture SKILL.md files under `internal/skills/testdata/` because the task explicitly requires fixture-based coverage.
- Keep hook parsing validation scoped to known event values for this task; other hook runtime validation belongs to later execution work.

State:

- Complete. Code-only commit created and committed state verified clean.

Done:

- Read repository instructions, required skill docs, workflow memory, task_03, `_techspec.md`, `_tasks.md`, and ADR-001..004.
- Scanned cross-agent ledgers and confirmed task_01 already added the typed fields this loader task must populate.
- Inspected `internal/skills/types.go`, `loader.go`, `loader_test.go`, and `registry.go` to locate the missing typed parsing path.
- Captured the pre-change signal: `ParseSkillFile()` and `parseBundledSkill()` only use `parseSkillContent()`, so `Skill.MCPServers` and `Skill.Hooks` stay empty even when `metadata.agh` exists.
- Built the execution checklist and verification plan (`go test ./internal/skills -count=1`, `go test ./internal/skills -cover -count=1`, `make verify`).
- Implemented `parseAGHMetadata()` plus typed MCP/hook helper parsers in `internal/skills/loader.go`, including warning-only handling for malformed nested fields.
- Wired typed metadata parsing into both `ParseSkillFile()` and `parseBundledSkill()`.
- Added fixture `SKILL.md` files under `internal/skills/testdata/loader/` for MCP-only, hooks-only, combined, malformed, missing-agh, invalid-MCP, and invalid-hook cases.
- Added loader tests covering typed MCP/hook parsing, raw `${}` env preservation, bundled-skill parsing, malformed metadata warnings, invalid MCP warnings, and unknown hook event warnings.
- Ran `go test ./internal/skills -count=1`, `go test ./internal/skills -cover -count=1` (`81.5%`), and `make verify` successfully.
- Updated workflow memory plus task tracking (`task_03.md`, `_tasks.md`) locally.
- Created local code-only commit `331f30d` (`feat: parse agh skill metadata`).
- Re-ran `make verify` on committed `HEAD` successfully.

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None currently.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-07-MEMORY-parse-metadata-loader.md`
- `.compozy/tasks/skills-v2/memory/MEMORY.md`
- `.compozy/tasks/skills-v2/memory/task_03.md`
- `.compozy/tasks/skills-v2/task_03.md`
- `.compozy/tasks/skills-v2/_techspec.md`
- `.compozy/tasks/skills-v2/_tasks.md`
- `internal/skills/loader.go`
- `internal/skills/loader_test.go`
- `internal/skills/testdata/...`
- Commands: `rg -n 'parseBundledSkill|ParseSkillFile|metadata\\.agh|MCPServers|Hooks' internal/skills`, `go test ./internal/skills -count=1`, `go test ./internal/skills -cover -count=1`, `make verify`
