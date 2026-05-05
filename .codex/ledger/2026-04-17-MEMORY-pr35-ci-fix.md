Goal (incl. success criteria):

- Fix the failing GitHub Actions job for PR 35 referenced by run 24592074692/job 71914712662.
- Success: identify the exact failing command, apply a root-cause fix in the repo, and finish with local verification via `make verify` in the same env shape as CI.

Constraints/Assumptions:

- Worktree contains unrelated Storybook edits and task metadata; do not touch or revert them.
- Follow workspace/project bug-fix workflow: root-cause first, no workarounds, tests must protect correctness.
- Use local code search for project code; use network access only for external artifacts like GitHub Actions logs.

Key decisions:

- Activated `systematic-debugging`, `no-workarounds`, `golang-pro`, and `testing-anti-patterns`.
- Fixed the bug in Mage rather than only in GitHub Actions so all race-enabled test targets self-manage their cgo requirement while preserving the outer `CGO_ENABLED=0` build check.
- Added a focused tagged unit test for the new env-merging helper in `magefile_test.go`.

State:

- Completed.

Done:

- Read workspace/project instructions from AGENTS.md and CLAUDE.md.
- Scanned existing ledgers and reviewed the relevant prior CI ledger (`2026-04-17-MEMORY-ci-release-audit.md`).
- Pulled the failing GitHub Actions log with `gh run view 24592074692 --job 71914712662 --log`.
- Identified the root cause from the failing step: `.github/workflows/ci.yml` runs `make verify` under `CGO_ENABLED=0`, but `magefile.go` runs `go test -race`, which fails with `go: -race requires cgo; enable cgo by setting CGO_ENABLED=1`.
- Confirmed the same root-cause shape also affected other race-enabled Mage paths (`TestIntegration`, E2E Go suites via `runIntegrationSuite`) whenever ambient env forced `CGO_ENABLED=0`.
- Updated `magefile.go` so `Test`, `TestIntegration`, and `runIntegrationSuite` invoke `go` through `runRaceEnabledGoCommand`, which clones caller env and forces `CGO_ENABLED=1` only for race-enabled test subprocesses.
- Added `TestWithRaceEnabledEnv` in `magefile_test.go` to verify the helper overrides `CGO_ENABLED` without mutating caller-provided env maps.
- Ran `gofmt -w magefile.go magefile_test.go`.
- Verified with `go test -tags mage .`.
- Reproduced the original CI env and verified the fix with `CGO_ENABLED=0 make verify`.

Now:

- No active work.

Next:

- If requested, prepare a commit or inspect any additional failing PR jobs.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-17-MEMORY-pr35-ci-fix.md`
- `magefile.go`
- `magefile_test.go`
- GitHub run `24592074692`, job `71914712662`
- `gh run view 24592074692 --job 71914712662 --log`
- `go test -tags mage .`
- `CGO_ENABLED=0 make verify`
