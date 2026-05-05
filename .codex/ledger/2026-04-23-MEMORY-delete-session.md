Goal (incl. success criteria):

- Remediate review batch `delete-session` for PR `58`, round `002`, across the 9 scoped issue files and 7 scoped code files in `/Users/pedronauck/dev/compozy/agh3`.
- Success means: every issue file triaged and finalized per workflow, valid issues fixed with tests, repository verification passes fresh, and exactly one local commit is created.

Constraints/Assumptions:

- Scope is limited to the listed batch issue files and scoped code files unless a minimal out-of-scope fix is absolutely required and documented.
- Do not use provider-specific resolution scripts or GitHub mutations.
- Must follow `cy-fix-reviews`, `cy-final-verify`, `systematic-debugging`, `no-workarounds`, `golang-pro`, `testing-anti-patterns`, `react`, `vitest`, `tanstack-query-best-practices`, `app-renderer-systems`, `tanstack-router-best-practices`, and `vercel-react-best-practices`.
- Must run full verification before any completion claim or commit.

Key decisions:

- Work in `/Users/pedronauck/dev/compozy/agh3`, which is the actual batch workspace.
- Read all issue files completely before touching code.
- Keep ledger in `agh3/.codex/ledger/` because that is the repository being modified.

State:

- In progress; verification complete, final batch artifacts and commit pending.

Done:

- Read batch `_meta.md`.
- Read all 9 issue files completely.
- Read root and web workspace instructions for `agh3`.
- Loaded required workflow and domain skill instructions.
- Created execution plan.
- Triaged all 9 review issues as `valid` with concrete technical reasoning.
- Fixed daemon test conformance and fake-session parity issues in `internal/daemon/daemon_test.go`.
- Hardened session delete against concurrent stop races and added regression coverage in `internal/session/manager_delete_test.go`.
- Wrapped the global task store delete/reconcile path in a transactional boundary and added rollback coverage in task manager tests.
- Hardened web session controls serialization and strengthened delete-action regression coverage in the scoped hook tests.
- Ran targeted Go tests for the touched backend packages.
- Ran targeted Vitest coverage for the touched web hook files.
- Ran full repository verification with `make verify` and explicit web verification with `make web-lint` and `make web-typecheck`.
- Re-ran `make verify` on the final staged tree after resolving the batch issue files.

Now:

- Review the final diff, then create exactly one local commit for the batch.

Next:

- Capture the commit hash and report the batch outcome with verification evidence.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Review dir: `/Users/pedronauck/dev/compozy/agh3/.compozy/tasks/delete-session/reviews-002`
- Ledger: `/Users/pedronauck/dev/compozy/agh3/.codex/ledger/2026-04-23-MEMORY-delete-session.md`
- Scoped code files:
- `internal/daemon/daemon_test.go`
- `internal/session/manager_delete.go`
- `internal/store/globaldb/global_db_task_test.go`
- `internal/task/manager.go`
- `web/src/hooks/routes/use-session-page-controls.test.tsx`
- `web/src/hooks/routes/use-session-page-controls.ts`
- `web/src/systems/session/hooks/use-session-actions.test.tsx`
- Additional supporting files:
- `internal/session/manager_delete_test.go`
- `internal/store/globaldb/global_db_task.go`
- `internal/store/globaldb/global_db_task_aux.go`
- `internal/task/interfaces.go`
- `internal/task/manager_test.go`
- Verification commands:
- `go test ./internal/session ./internal/task ./internal/store/globaldb ./internal/daemon`
- `bunx vitest run web/src/hooks/routes/use-session-page-controls.test.tsx web/src/systems/session/hooks/use-session-actions.test.tsx`
- `make verify`
- `make web-lint`
- `make web-typecheck`
