Goal (incl. success criteria):

- Complete task 08 by adding config and agent-definition hook declarations in `internal/config`, exposing combined `[]hooks.HookDecl`, covering parsing/validation/precedence/scoping with tests, and passing `make verify`.

Constraints/Assumptions:

- Must follow task_08, `_techspec.md`, `_tasks.md`, ADR-004, and ADR-011 as source of truth.
- Must read and update workflow memory files under `.compozy/tasks/hooks/memory/`.
- Scope stays limited to task 08; track follow-up work instead of expanding into daemon wiring.
- Worktree already contains unrelated user changes; do not touch them.

Key decisions:

- Export combined registry-ready declarations via package-level `internal/config.HookDeclarations(cfg, agents)`.
- Parse config hooks into `Config.Hooks.Declarations`, then normalize through `internal/hooks` with a stub resolver so validation/defaults stay aligned with task_02 semantics.
- Merge config hook declarations across precedence layers by hook name; later layers replace the same declaration name and preserve distinct names.
- Scope every agent-definition hook to `matcher.agent_name == agent.Name`; reject explicit mismatches at parse time.
- Decode agent frontmatter as strict YAML first, then strict TOML fallback so agent hook declarations work in either metadata format.
- Keep `session.Notifier.OnAgentEvent` payload-agnostic (`any`) and downcast in upper layers to avoid the `config -> hooks -> acp -> config` cycle introduced by config-based hook declarations.

State:

- Complete; code committed and committed `HEAD` re-verified.

Done:

- Read AGENTS/CLAUDE, required skills, workflow memory, task spec, techspec, task list, and relevant ADRs.
- Captured execution checklist and baseline task scope.
- Added `HooksConfig`, config overlay parsing, validation, and combined declaration export in `internal/config`.
- Added agent-definition hook parsing, validation, agent-name scoping, and YAML/TOML frontmatter support.
- Updated workspace cloning and notifier/observer seams to accommodate the new config/hooks dependencies without reintroducing cycles.
- Added focused tests for config parsing, precedence, validation failures, agent scoping, combined declarations, empty hooks, and TOML agent frontmatter.
- Verified with `go test ./internal/config -count=1`, `go test -cover ./internal/config -count=1` (`82.5%`), and `make verify` (exit `0` after the final code change).
- Updated workflow memory and PRD tracking for task 08.
- Created local commit `ee38729` (`feat: add config hook declarations`).
- Re-ran `make verify` on committed `HEAD` successfully.

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None currently.

Working set (files/ids/commands):

- `.compozy/tasks/hooks/task_08.md`
- `.compozy/tasks/hooks/_techspec.md`
- `.compozy/tasks/hooks/_tasks.md`
- `.compozy/tasks/hooks/adrs/adr-004.md`
- `.compozy/tasks/hooks/adrs/adr-011.md`
- `.compozy/tasks/hooks/memory/MEMORY.md`
- `.compozy/tasks/hooks/memory/task_08.md`
- `internal/config/config.go`
- `internal/config/merge.go`
- `internal/config/agent.go`
- `internal/config/bootstrap.go`
- `internal/config/hooks.go`
- `internal/config/hooks_test.go`
- `internal/workspace/clone.go`
- `internal/session/interfaces.go`
- `internal/hooks/agent_event.go`
- `internal/observe/observer.go`
