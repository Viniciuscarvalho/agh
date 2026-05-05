Goal (incl. success criteria):

- Complete `skills-v2` task_04 by implementing `internal/skills/mcp.go` with trust-tier filtering, MCP server conversion/deduplication, structured logging, and unit tests, then finish with clean verification, memory/tracking updates, and one local commit.

Constraints/Assumptions:

- Must follow root `AGENTS.md`, `CLAUDE.md`, `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, and `testing-anti-patterns`.
- Scope is centered on `internal/skills` plus any minimal config support needed for the resolver constructor to consume marketplace consent settings.
- `make verify` is the completion gate; task-specific coverage target is `internal/skills` >=80%.
- The checked-in repo currently lacks the `SkillsConfig.AllowedMarketplaceMCP` field described by the techspec/task_02, so resolver work may need a narrow additive config update to stay compatible with the approved design.

Key decisions:

- `brainstorming` was not applied as an implementation gate because this run already has an approved PRD/techspec/task spec and `cy-execute-task` is the governing workflow.

State:

- Task complete; awaiting final handoff.

Done:

- Read required instructions, skill docs, workflow memory, task_04, `_techspec.md`, `_tasks.md`, ADR-001, and relevant adjacent ledgers.
- Confirmed `internal/skills/mcp.go` and any existing `MCPResolver` implementation are absent.
- Confirmed current `internal/config` is missing the marketplace consent field expected by the resolver design.
- Implemented `internal/skills/mcp.go` with `MCPResolver`, trust-tier filtering, stable source-precedence ordering, conversion to `aghconfig.MCPServer`, deduplication, and structured logging.
- Added `internal/skills/mcp_test.go` coverage for trusted sources, marketplace allow/block, nil/empty inputs, no-server skills, deduplication, and constructor cloning.
- Added narrow consent-config plumbing in `internal/config` for `SkillsConfig.AllowedMarketplaceMCP` plus overlay parsing and coverage.
- Fixed a reproducible uncached watcher-test failure by switching shared test skill writes to atomic temp-file renames in `internal/skills` test helpers.
- Ran `go test ./internal/skills ./internal/config -count=1`, `go test ./internal/skills -run TestWatcherStartRefreshesOnlyWhenGlobalStateChanges -count=10`, `go test ./internal/skills -cover -count=1` (`82.6%`), `make verify`, and `git diff --check` successfully.
- Updated workflow memory and task tracking files locally for task_04 completion.
- Created local commits `53e19b1` (`feat: add mcp resolver trust tiers`) and `aa927b3` (`test: make skill fixture writes atomic`).

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Files: `internal/skills/mcp.go`, `internal/skills/mcp_test.go`, `internal/skills/types.go`, `internal/config/config.go`, `.compozy/tasks/skills-v2/memory/MEMORY.md`, `.compozy/tasks/skills-v2/memory/task_04.md`, `.compozy/tasks/skills-v2/task_04.md`, `.compozy/tasks/skills-v2/_tasks.md`
- Commands: `rg -n`, `sed -n`, `go test ./internal/skills -count=1`, `go test ./internal/skills -cover -count=1`, `make verify`, `git status --short`
