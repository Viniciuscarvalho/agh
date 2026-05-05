Goal (incl. success criteria):

- Fix current scoped Go lint failures in `extensions/bridges/{teams,telegram,whatsapp}` with root-cause changes only.
- Success means segmented `golangci-lint` passes for those three packages, with no suppressions and no regressions from shared worktree edits.

Constraints/Assumptions:

- Scope is limited to `extensions/bridges/teams`, `extensions/bridges/telegram`, and `extensions/bridges/whatsapp`.
- Other agents are editing the repository in parallel; do not revert or overwrite unrelated changes.
- User explicitly asked for root-cause fixes and segmented validation.
- Root repo policy requires `make verify` before completion, but parallel scoped ownership may block whole-repo verification in this worker.

Key decisions:

- Use the current working tree as source of truth and inspect lint failures from the real segmented command before editing.
- Prioritize repeated categories called out by the coordinator: `reportState`, `reconcileInstanceConfigs`, `noctx`, `errcheck`, and `gocritic`.
- Keep edits local to the assigned bridge packages and associated tests.
- Treat unrelated repo-wide typecheck failures as concrete blockers and continue validating local root-cause lint fixes as far as the current worktree allows.

State:

- Completed for current scope.

Done:

- Read root `AGENTS.md` / `CLAUDE.md` instructions from prompt context.
- Read `no-workarounds`, `systematic-debugging`, and `golang-pro` guidance.
- Read cross-agent ledger `.codex/ledger/2026-04-15-MEMORY-fix-lint.md`.
- Confirmed pre-existing modifications already exist in the scoped bridge packages.
- Fixed scoped bridge issues across `teams`, `telegram`, and `whatsapp` for repeated categories including `reportState`/`reconcileInstanceConfigs`, `errcheck`, `noctx`, `gocritic`, `gocyclo`, `funlen`, `lll`, `revive`, and `gosec`.
- Applied `gofmt` and `golines` to all six edited files in scope.
- Verified one clean scoped lint pass for the non-typecheck categories before external repo churn reintroduced unrelated typecheck failures.
- Re-ran scoped `golangci-lint` on the current workspace state for `./extensions/bridges/teams/... ./extensions/bridges/telegram/... ./extensions/bridges/whatsapp/...` and it passed with `0 issues`.
- Ran `go test ./extensions/bridges/teams/... ./extensions/bridges/telegram/... ./extensions/bridges/whatsapp/...` and all three packages passed.

Now:

- No active work remaining in the owned bridge scope.

Next:

- Hand off the clean scoped result and exact changed files.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-15-MEMORY-bridge-lint-comms.md`
- `go run github.com/golangci/golangci-lint/v2/cmd/golangci-lint@v2.11.4 run --allow-parallel-runners ./extensions/bridges/teams ./extensions/bridges/telegram ./extensions/bridges/whatsapp`
- `go run github.com/golangci/golangci-lint/v2/cmd/golangci-lint@v2.11.4 run --allow-parallel-runners --default=none -E errcheck -E funlen -E gocritic -E gocyclo -E gosec -E lll -E noctx -E revive -E unparam ./extensions/bridges/teams ./extensions/bridges/telegram ./extensions/bridges/whatsapp`
