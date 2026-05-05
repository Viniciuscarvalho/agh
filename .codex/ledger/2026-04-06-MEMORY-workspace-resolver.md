Goal (incl. success criteria):

- Complete task_03 by implementing the `internal/workspace` resolver with store-backed CRUD, filesystem resolution, mtime/size cache invalidation with TTL eviction, and unit/integration tests, then pass targeted validation plus `make verify`.

Constraints/Assumptions:

- Scope stays within task_03 surfaces; task tracking and workflow memory files remain untracked unless repository policy changes.
- Required inputs already read: root `AGENTS.md`/`CLAUDE.md`, task_03, `_techspec.md`, `_tasks.md`, ADR-001/003/004, workflow memory, and prior task ledgers.
- Existing unrelated worktree changes in `.compozy/tasks/skills-system/_meta.md` and the untracked `.compozy/tasks/workspace-entity/` tree must not be touched outside the workflow memory/task-tracking files required by this task.
- Techspec conflict noted: canonical `root_dir` storage makes post-registration symlink retargeting impossible for newly canonicalized rows, so resolver support will cover stale/non-canonical stored rows by re-evaluating and updating them on resolve.

Key decisions:

- Resolver will own config loading, agent discovery, skill-path collection, cache snapshots, and logging, while reusing `workspace.WorkspaceStore` for persistence and `config.LoadAgentDefFile` for explicit agent files.
- Default config loading will use injected `HomePaths`; if current config helpers are insufficient, add the smallest config-package helper needed rather than mutating process env.
- Cache hits will be keyed by workspace ID and validated by snapshot equality plus relevant workspace metadata so stale default-agent overrides do not leak through cached configs.
- Resolver mints new workspace IDs with the `ws_` prefix while still accepting legacy `ws-` lookups so rows created before this task continue to resolve.
- Resolver returns merged skill paths in `ResolvedWorkspace.Skills`; task_07 should consume those paths instead of rescanning workspace directories.

State:

- Task complete; code committed and final verification re-run on the committed state.

Done:

- Loaded task docs, workflow memory, required skill instructions, and prior workspace ledgers.
- Captured baseline signal that `internal/workspace` currently has only types/interfaces and no resolver implementation (`rg` found no `Resolver`/`NewResolver` definitions).
- Inspected `internal/workspace`, `internal/config`, `internal/store`, `internal/skills`, and the approved workspace-entity design doc for implementation details.
- Added `internal/workspace/options.go` with resolver functional options, injected config loading, cache TTL control, deterministic clock/ID hooks, and logger/home path overrides.
- Added `internal/workspace/resolver.go` with store-backed CRUD, `Resolve`, `ResolveOrRegister`, mtime/size snapshot caching, TTL idle eviction, config loading, agent merge, skill path collection, symlink refresh, and structured `slog` events.
- Added `internal/workspace/resolver_test.go` with mock-store unit coverage for routing, registration, deduping, cache behavior, root-missing errors, stale symlink refresh, config precedence, and clone safety.
- Added `internal/workspace/resolver_integration_test.go` with real SQLite and temp-directory integration coverage for register/resolve resource merging and stale symlink registration repair.
- Fixed an option-defaulting bug uncovered by tests so `resolveOptions` applies all nil defaults instead of only the first missing dependency.
- Ran `go test ./internal/workspace -count=1`, `go test ./internal/workspace -cover -count=1` (`coverage: 80.3% of statements`), `go test -tags integration ./internal/workspace -count=1`, `go test -tags integration ./internal/workspace -cover -count=1` (`coverage: 80.5% of statements`), and `make verify` successfully.
- Updated workflow memory and task tracking artifacts outside the code commit.
- Created local commit `7146bf3` (`feat: implement workspace resolver`).
- Re-ran `make verify` on the committed state successfully, then re-checked workspace coverage with `go test ./internal/workspace -cover -count=1` (`80.3%`) and `go test -tags integration ./internal/workspace -cover -count=1` (`80.5%`).

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Files: `internal/workspace/options.go`, `internal/workspace/resolver.go`, `internal/workspace/resolver_test.go`, `internal/workspace/resolver_integration_test.go`, `.compozy/tasks/workspace-entity/memory/MEMORY.md`, `.compozy/tasks/workspace-entity/memory/task_03.md`, `.compozy/tasks/workspace-entity/task_03.md`, `.compozy/tasks/workspace-entity/_tasks.md`
- Commands: `go test ./internal/workspace -count=1`, `go test ./internal/workspace -cover -count=1`, `go test -tags integration ./internal/workspace -count=1`, `go test -tags integration ./internal/workspace -cover -count=1`, `make verify`, `git status --short`, `git commit -m "feat: implement workspace resolver"`
