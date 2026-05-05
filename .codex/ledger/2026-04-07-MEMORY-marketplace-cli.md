Goal (incl. success criteria):

- Implement skills-v2 task_10 by adding `agh skill search/install/remove/update`, wiring marketplace config into `internal/config`, adding required unit/integration coverage, updating task tracking, and finishing with clean verification plus one local commit.

Constraints/Assumptions:

- Must follow root `AGENTS.md`, `CLAUDE.md`, task_10, `_techspec.md`, `_tasks.md`, ADR-003, ADR-004, workflow memory, and required skills (`cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, `testing-anti-patterns`).
- Do not touch unrelated worktree changes (`docs/rfcs/skills-system-final.md`) or unrelated untracked files outside required tracking/memory updates.
- `make verify` is the completion gate; task also requires targeted unit/integration evidence for the new CLI flows.

Key decisions:

- Task 10 must absorb the missing `SkillsConfig.Marketplace` / `MarketplaceConfig` config plumbing because the repo still lacks it and the CLI commands are required to construct the marketplace registry from config.
- Treat the user-provided PRD/techspec/task package as the approved design baseline for this implementation run rather than reopening brainstorming approval flow.

State:

- Verification complete; pending final self-review and commit.

Done:

- Read AGENTS.md, CLAUDE.md, task_10, `_techspec.md`, `_tasks.md`, task_02, ADR-003, ADR-004, workflow memory, and relevant prior ledgers.
- Inspected current `internal/cli/skill.go`, CLI formatting/test helpers, marketplace client/types, provenance helpers, verification helpers, and config/merge code.
- Confirmed the repo currently lacks `SkillsConfig.Marketplace`, despite task_02 being marked completed in `task_02.md`.
- Added `MarketplaceConfig` support plus overlay/validation coverage in `internal/config`.
- Added `agh skill search/install/remove/update` commands, secure archive extraction/install helpers, sidecar-backed remove/update flows, and marketplace output bundles in `internal/cli/skill.go`.
- Added unit coverage in `internal/cli/skill_test.go` and integration coverage in `internal/cli/skill_marketplace_integration_test.go`.
- Verified with `go test ./internal/config ./internal/cli -count=1`, `go test -tags integration ./internal/cli -count=1`, `go test ./internal/cli -cover -count=1` (`80.0%`), and `make verify`.

Now:

- Review/stage intended files only, then create the local commit.

Next:

- Final handoff after the local commit.

Open questions (UNCONFIRMED if needed):

- None currently recorded.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-07-MEMORY-marketplace-cli.md`
- `.compozy/tasks/skills-v2/task_10.md`
- `.compozy/tasks/skills-v2/_techspec.md`
- `.compozy/tasks/skills-v2/_tasks.md`
- `.compozy/tasks/skills-v2/task_02.md`
- `.compozy/tasks/skills-v2/adrs/adr-003.md`
- `.compozy/tasks/skills-v2/adrs/adr-004.md`
- `.compozy/tasks/skills-v2/memory/MEMORY.md`
- `.compozy/tasks/skills-v2/memory/task_10.md`
- `internal/config/config.go`
- `internal/config/merge.go`
- `internal/config/config_test.go`
- `internal/config/merge_test.go`
- `internal/cli/skill.go`
- `internal/cli/skill_test.go`
- `internal/cli/skill_marketplace_integration_test.go`
