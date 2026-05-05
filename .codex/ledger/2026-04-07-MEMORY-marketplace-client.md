Goal (incl. success criteria):

- Implement task 08: add `internal/skills/marketplace` registry/types plus `internal/skills/marketplace/clawhub` client with retry/backoff, context-aware HTTP behavior, and unit tests.
- Finish with task tracking updated, workflow memory updated, `make verify` passing, and one local commit.

Constraints/Assumptions:

- Must use `cy-workflow-memory`, `cy-execute-task`, `golang-pro`, `testing-anti-patterns`, and `cy-final-verify`.
- Do not touch unrelated worktree changes (`docs/rfcs/skills-system-final.md`, untracked `.compozy/tasks/skills-v2/` files).
- Use stdlib `net/http` only for marketplace client.
- Task 08 depends on task 02 in spec, but current repo only exposes `SkillsConfig.AllowedMarketplaceMCP`; `MarketplaceConfig` is not present yet. Treat config wiring as out of scope unless implementation proves otherwise.

Key decisions:

- Skip `brainstorming` despite being an obvious new-feature skill because the user supplied an approved PRD/techspec/ADR and explicitly requested execution under `cy-execute-task`; re-running a design approval workflow would conflict with the requested task flow.

State:

- Completed pending commit.

Done:

- Read AGENTS/CLAUDE guidance, task spec, techspec, ADR-003, workflow memory, and current repo state.
- Added `internal/skills/marketplace` registry/types package.
- Added `internal/skills/marketplace/clawhub` client with retry/backoff, timeout, context cancellation, and descriptive HTTP errors.
- Added httptest coverage for search/info/download, retries, timeout, cancellation, helper behavior, and validation.
- Verified with targeted package coverage, `make lint`, and `make verify`.

Now:

- Update task tracking files and create the local commit.

Next:

- None after commit.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED whether task 10 should land the missing `SkillsConfig.Marketplace` fields from task 02 or wait for that task to be reconciled separately.

Working set (files/ids/commands):

- `.compozy/tasks/skills-v2/task_08.md`
- `.compozy/tasks/skills-v2/_techspec.md`
- `.compozy/tasks/skills-v2/_tasks.md`
- `.compozy/tasks/skills-v2/adrs/adr-003.md`
- `.compozy/tasks/skills-v2/memory/MEMORY.md`
- `.compozy/tasks/skills-v2/memory/task_08.md`
- `internal/skills/marketplace/registry.go`
- `internal/skills/marketplace/types.go`
- `internal/skills/marketplace/clawhub/client.go`
- `internal/skills/marketplace/clawhub/client_test.go`
- `internal/config/config.go`
- `internal/skills/types.go`
- `internal/skills/registry.go`
