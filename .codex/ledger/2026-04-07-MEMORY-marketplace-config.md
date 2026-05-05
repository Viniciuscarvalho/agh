Goal (incl. success criteria):

- Complete `skills-v2` task_02 by extending `internal/config` with marketplace consent and registry settings, adding overlay merge plumbing, covering parse/merge/validation/default behavior with unit tests, and finishing with clean verification plus required tracking updates.

Constraints/Assumptions:

- Must follow root `AGENTS.md`, `CLAUDE.md`, `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, `testing-anti-patterns`, and `brainstorming`.
- Scope is limited to task_02 surfaces in `internal/config` plus required workflow/task tracking files.
- `make verify` is the completion gate; task-specific coverage target is `internal/config` >=80%.
- Marketplace defaults should stay disabled/empty until explicitly configured; techspec default registry is `clawhub` when marketplace config is present.

Key decisions:

- None yet.

State:

- In progress.

Done:

- Read required instructions, skill docs, workflow memory, task docs, techspec, ADR-001, ADR-003, and relevant prior ledgers.
- Inspected current `internal/config` structures, overlay merge behavior, and existing tests for loading and validation patterns.

Now:

- Produce execution checklist and concise design for approval, then implement once approved.

Next:

- Extend config/merge structs, add validation/default behavior, add tests, run verification, update tracking, and create the local commit.

Open questions (UNCONFIRMED if needed):

- Whether the workspace should treat an explicitly empty `[skills.marketplace] registry = ""` as invalid even when `skills.enabled = false`; current task/spec implies yes when marketplace is explicitly configured.

Working set (files/ids/commands):

- Files: `internal/config/config.go`, `internal/config/merge.go`, `internal/config/config_test.go`, `internal/config/merge_test.go`, `.compozy/tasks/skills-v2/memory/MEMORY.md`, `.compozy/tasks/skills-v2/memory/task_02.md`, `.compozy/tasks/skills-v2/task_02.md`, `.compozy/tasks/skills-v2/_tasks.md`
- Commands: `sed -n`, `rg -n`, `go test ./internal/config -count=1`, `go test ./internal/config -cover -count=1`, `make verify`, `git status --short`
