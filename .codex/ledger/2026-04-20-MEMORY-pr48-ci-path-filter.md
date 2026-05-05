Goal (incl. success criteria):

- Fix PR 48 CI run `24675945868` job `72159800480` (`Detect changes`) so the workflow no longer fails during action setup.
- Success: `.github/workflows/ci.yml` no longer depends on the failing external path-filter action, preserves the `backend` / `web` / `relevant` outputs, and the repo passes `make verify`.

Constraints/Assumptions:

- Follow `systematic-debugging` and `no-workarounds`: fix the workflow root cause, do not mask the failure.
- Do not touch unrelated files or use destructive git commands.
- This repo requires `make verify` before completion even if the change is workflow-only.

Key decisions:

- Treat the failure as CI infrastructure fragility in the external `dorny/paths-filter@v3` dependency, not a Go/web code regression.
- Keep selective CI behavior instead of forcing all jobs to run on every change.
- Replace the third-party action with repo-owned shell logic in `.github/workflows/ci.yml`.

State:

- In progress.

Done:

- Read workspace instructions and required skills (`systematic-debugging`, `no-workarounds`, `golang-pro`).
- Scanned existing ledgers for cross-agent awareness, especially `2026-04-20-MEMORY-ci-errors-fix.md` and `2026-04-17-MEMORY-pr35-ci-fix.md`.
- Pulled the failing job log with `gh run view 24675945868 --job 72159800480 --log`.
- Confirmed failure occurs before repo code runs: GitHub Actions cannot complete `dorny/paths-filter@v3` setup in `Detect changes`.
- Verified via GitHub API that the referenced upstream tag/commit exists, which points to runner-side download instability rather than an invalid commit in the repo.

Now:

- Replace the `dorny/paths-filter` step with inline git-based change detection.

Next:

- Validate the workflow logic and run `make verify`.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether the upstream action failure is a transient GitHub outage or a persistent compatibility issue. The repo fix should avoid depending on that answer.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-20-MEMORY-pr48-ci-path-filter.md`
- `.github/workflows/ci.yml`
- GitHub run `24675945868`, job `72159800480`
- `gh run view 24675945868 --job 72159800480 --log`
- `gh api repos/dorny/paths-filter/git/ref/tags/v3`
- `gh api repos/dorny/paths-filter/commits/d1c1ffe0248fe513906c8e24db8ea791d46f8590`
