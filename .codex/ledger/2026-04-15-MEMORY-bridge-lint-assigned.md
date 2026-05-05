Goal (incl. success criteria):

- Fix all current `make lint` errors in `extensions/bridges/gchat`, `extensions/bridges/slack`, and `extensions/bridges/discord` with root-cause changes only.
- Success means folder-scoped lint passes for the owned packages, with no suppressions and no disruption to unrelated in-flight edits.

Constraints/Assumptions:

- Scope is limited to `extensions/bridges/gchat`, `extensions/bridges/slack`, and `extensions/bridges/discord`.
- Worktree is already dirty, including files inside this scope; do not revert or overwrite unrelated agent changes.
- User explicitly requested `no-workarounds`; fixes must remove the underlying lint cause.

Key decisions:

- Use targeted `golangci-lint` on the assigned directories instead of repo-wide lint during remediation.
- Inspect current file state before editing because parallel agents are modifying nearby code.
- Prefer structural fixes that clear repeated warnings across provider/api/test files.

State:

- In progress.

Done:

- Read root AGENTS/CLAUDE instructions from prompt context.
- Read `no-workarounds`, `golang-pro`, and `systematic-debugging` skills.
- Read the shared `fix-lint` ledger for cross-agent context.
- Confirmed the worktree already contains many unrelated edits.
- Cleaned `extensions/bridges/slack` with structural fixes and verified `golangci-lint run ./extensions/bridges/slack/...` -> `0 issues`.
- Cleaned `extensions/bridges/discord` with structural fixes and verified `golangci-lint run ./extensions/bridges/discord/...` -> `0 issues`.
- Cleaned `extensions/bridges/gchat` with structural fixes and verified `golangci-lint run ./extensions/bridges/gchat/...` -> `0 issues`.
- Verified combined scope with `golangci-lint run ./extensions/bridges/slack/... ./extensions/bridges/discord/... ./extensions/bridges/gchat/...` -> `0 issues`.

Now:

- Prepare final report with owned-scope status and exact files changed.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-15-MEMORY-bridge-lint-assigned.md`
- `extensions/bridges/gchat`
- `extensions/bridges/slack`
- `extensions/bridges/discord`
- `golangci-lint run ./extensions/bridges/...`
