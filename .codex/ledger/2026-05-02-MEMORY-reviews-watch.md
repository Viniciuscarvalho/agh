Goal (incl. success criteria):

- Verify whether `.compozy/tasks/agent-soul` is fully complete; if yes, create the final commit, open a PR from the current branch, and start `compozy reviews watch` for that PR.

Constraints/Assumptions:

- Never use destructive git commands.
- Must read local workflow artifacts and automation memory before acting.
- Must run `make verify` before commit and after commit.
- User explicitly requested `git add . && git commit -m "feat: agents soul"` when the workflow is complete.

Key decisions:

- Treat workflow completion as requiring both task artifacts marked complete and no active Compozy run for the workflow.
- Use `~/dev/compozy/looper/bin/compozy` directly because the `cy` alias is unavailable in non-interactive shells.

State:

- In progress.

Done:

- Read automation memory path; file was missing.
- Scanned `.codex/ledger/`; no prior session ledger existed.
- Confirmed `.compozy/tasks/agent-soul/_tasks.md` marks tasks 01-17 as `completed`.
- Confirmed Compozy daemon is `ready` with `active_runs: 0`.
- Confirmed current branch is `vault` and no PR exists for it.
- Inspected `compozy reviews watch` help and looper docs/source for required flags and behavior.

Now:

- Run the required `make verify` gate on the current tree before committing.

Next:

- If verify passes, stage the requested files, create commit `feat: agents soul`, push branch if needed, open a PR, and start `compozy reviews watch`.
- If verify fails, stop the release flow and report the blocking failures.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED whether the untracked `.compozy/extensions/` and QA evidence files are intended repo artifacts beyond the user’s explicit `git add .` instruction.

Working set (files/ids/commands):

- `.compozy/tasks/agent-soul/_tasks.md`
- `.compozy/tasks/agent-soul/memory/MEMORY.md`
- `~/dev/compozy/looper/internal/cli/reviews_exec_daemon.go`
- `~/dev/compozy/looper/skills/compozy/references/config-reference.md`
- `git status --short --branch`
- `~/dev/compozy/looper/bin/compozy daemon status`
- `~/dev/compozy/looper/bin/compozy reviews watch --help`
