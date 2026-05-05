Goal (incl. success criteria):

- Port the important Daytona Sandbox fix from commit `3c663cef4575554d9fe0f4db0f422c4500ed46d1` on branch `ext-refac` into the current branch `pn/ext`.
- Success means the relevant runtime/test changes land cleanly on `pn/ext`, unrelated worktree state remains untouched, and repository verification is rerun from the resulting tree.

Constraints/Assumptions:

- Follow root `AGENTS.md` and `CLAUDE.md`.
- Never use destructive git commands (`git restore`, `git checkout`, `git reset`, `git clean`, `git rm`) without explicit user permission.
- Worktree is currently clean on `pn/ext`.
- The source commit mixes Daytona runtime/test changes with `.compozy` QA artifacts; default assumption is to port the code fix surface, not generated QA evidence, unless later evidence shows those artifacts are required.

Key decisions:

- Treat this as a root-cause transfer problem, not a blind cherry-pick: inspect the commit contents first, then apply only the necessary surface if the full commit would introduce unrelated artifacts.
- Create a local safety backup branch before applying the change.

State:

- completed

Done:

- Confirmed current branch is `pn/ext`.
- Confirmed source commit `3c663cef4575554d9fe0f4db0f422c4500ed46d1` exists on `ext-refac`.
- Confirmed `pn/ext` and `ext-refac` diverge from the same early base and have very different histories.
- Identified mixed source-commit contents:
  - relevant: `internal/environment/daytona/*`, `.env.example`
  - likely unrelated/generated: `.compozy/tasks/e2e/*`, `.compozy/tasks/*/qa/*`
- Scanned existing ledgers for relevant sandbox/extensibility/QA context.
- Confirmed required dependencies already exist on `pn/ext` (`github.com/gorilla/websocket`, `github.com/kballard/go-shellquote`).
- Created safety backup branch `backup-cherry-pick-pn-ext-20260416-1`.
- Dry-ran a 3-way apply of the Daytona-specific patch from `3c663cef4575`; it applied cleanly.
- Applied the Daytona-specific patch only:
  - `.env.example`
  - `internal/environment/daytona/VALIDATION.md`
  - `internal/environment/daytona/cmd/agh-daytona-sidecar/main.go`
  - `internal/environment/daytona/launcher.go`
  - `internal/environment/daytona/launcher_transport_integration_test.go`
  - `internal/environment/daytona/provider.go`
  - `internal/environment/daytona/provider_integration_test.go`
  - `internal/environment/daytona/provider_test.go`
  - `internal/environment/daytona/shell.go`
  - `internal/environment/daytona/sidecar_transport.go`
  - `internal/environment/daytona/ssh.go`
  - `internal/environment/daytona/ssh_validation_test.go`
  - `internal/environment/daytona/sync.go`
  - `internal/environment/daytona/tar.go`
  - `internal/environment/daytona/tar_test.go`
- Confirmed no `.compozy` QA artifacts were brought into the index.
- Ran `go test ./internal/environment/daytona` successfully.
- Ran `go test -tags integration ./internal/environment/daytona -count=1` successfully from the current tree; live Daytona coverage remains environment-dependent because no `DAYTONA_*` variables are present in this shell.
- Ran `make verify` successfully from the patched tree.
- Committed the port on `pn/ext` as `8086aeb6` with message `fix: port daytona sandbox qa fixes`.
- Re-ran `make verify` on top of committed `HEAD`; it passed.
- Inspected `../_worktrees/ext-refac/.codex/ledger/` for transferable memory.
- Imported high-signal worktree context into `.codex/ledger/2026-04-16-MEMORY-imported-ext-refac-context.md` instead of copying every source ledger verbatim.

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether the user also wants the `.compozy` QA artifacts from `3c663cef4575` copied over separately after the runtime fix is secured on `pn/ext`.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-16-MEMORY-daytona-cherry-pick.md`
- `.codex/ledger/2026-04-16-MEMORY-imported-ext-refac-context.md`
- `3c663cef4575554d9fe0f4db0f422c4500ed46d1`
- `backup-cherry-pick-pn-ext-20260416-1`
- `internal/environment/daytona/`
- `.env.example`
- `git status --short --branch`
- `git show --stat 3c663cef4575`
- `git diff --stat HEAD 3c663cef4575 -- internal/environment/daytona .env.example`
- `go test ./internal/environment/daytona`
- `go test -tags integration ./internal/environment/daytona -count=1`
- `make verify`
