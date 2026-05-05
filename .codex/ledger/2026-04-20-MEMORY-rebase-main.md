Goal (incl. success criteria):

- Rebase current branch `agent-capabilities` onto `main`/latest mainline state without losing branch changes or disturbing unrelated workspace files.
- Success criteria: backup created, rebase completed or safely aborted with reason, conflicts resolved correctly if present, verification run, user informed of any remaining follow-up.

Constraints/Assumptions:

- Do not run destructive git restore/reset/checkout/clean/rm commands.
- Workspace policy requires a per-session ledger in `.codex/ledger/`.
- Current worktree is clean at task start.
- User explicitly requested `$git-rebase from main`.

Key decisions:

- Use the `git-rebase` skill workflow.
- Inspect divergence before choosing between straight rebase and squash-first.
- Use a straight rebase onto `origin/main` because the incoming mainline change set was one commit with only two overlapping files.
- Resolve the single docs conflict by preserving `main`'s decision-table rewrite and carrying forward the capability-catalog guidance.

State:

- Completed.

Done:

- Confirmed current branch is `agent-capabilities`.
- Confirmed worktree is clean.
- Confirmed no existing ledger files were present.
- Fetched latest refs from `origin`.
- Measured divergence: branch was 12 commits ahead / 1 commit behind `origin/main` before rebase.
- Created backup branch `backup-rebase-agent-capabilities-20260420_160613` at pre-rebase HEAD `ded2127d`.
- Rebased `agent-capabilities` onto `origin/main`.
- Resolved the conflict in `packages/site/content/runtime/core/configuration/index.mdx`.
- Ran `make verify` successfully after the rebase.
- Confirmed final divergence is 12 commits ahead / 0 behind `origin/main`.

Now:

- Task complete; ready to report outcome.

Next:

- Optional follow-up if user wants remote updated: force-push with lease because local history was rewritten.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-20-MEMORY-rebase-main.md`
- `packages/site/content/runtime/core/configuration/index.mdx`
- `git fetch origin`
- `git branch backup-rebase-agent-capabilities-20260420_160613`
- `git rebase origin/main`
- `make verify`
- `git status --short --branch`
