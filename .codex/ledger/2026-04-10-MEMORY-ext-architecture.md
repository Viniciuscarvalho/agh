Goal (incl. success criteria):

- Resolve CodeRabbit review batch `ext-architecture` round `001` for issue files `issue_018.md` through `issue_034.md`.
- Triage every scoped issue file, implement all valid fixes with tests, run full verification, update issue files to `resolved`, and create exactly one local commit.

Constraints/Assumptions:

- Do not touch unrelated git changes already present in `.compozy/tasks/agh-network/...`.
- Do not use destructive git commands or provider-specific resolution commands.
- Batch scope is centered on the 11 listed Go files; any out-of-scope file change must be minimal and justified in issue triage.
- `make verify` must pass before completion and before commit.

Key decisions:

- Activated required review workflow skills: `cy-fix-reviews`, `cy-final-verify`.
- Activated project-mandated implementation skills for this Go bug-fix/test task: `systematic-debugging`, `no-workarounds`, `golang-pro`, `testing-anti-patterns`.
- Read all scoped issue files before making code changes, per workflow contract.

State:

- Verification passed; ready to commit.

Done:

- Read root `AGENTS.md` / `CLAUDE.md` instructions and required skill files.
- Scanned `.codex/ledger/` (empty before this session) and existing `.codex/plans/`.
- Read review round `_meta.md`.
- Read every scoped issue file `issue_018.md` through `issue_034.md`.
- Inspected the scoped production/test files around each reported line.
- Triaged every scoped review issue and recorded `valid` / `invalid` reasoning in the issue files.
- Fixed the valid review findings across extension and skills code, including nil-guarding host APIs, tightening resource-path containment, reducing inherited subprocess environment exposure, deep-cloning extension snapshots, normalizing manifest string slices, validating installed manifests from disk, rejecting payload symlinks, and normalizing external skill metadata names.
- Added and updated regression tests in extension and skills test files, including minimal out-of-scope test files required to verify manager, registry, and external-skill fixes.
- Ran focused verification with `go test ./internal/extension ./internal/skills`, fixed follow-up regressions, and reran until green.
- Ran full repository verification with `make verify` after the code fixes, then reran `make verify` after marking the tracked issue files `resolved`; both runs passed cleanly.
- Updated all scoped issue files `issue_018.md` through `issue_034.md` to `status: resolved`.

Now:

- Review the final diff and create the single local commit for this batch.

Next:

- Report the verified outcome to the user with the `cy-final-verify` evidence.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Review files: `.compozy/tasks/ext-architecture/reviews-001/_meta.md`, `.compozy/tasks/ext-architecture/reviews-001/issue_018.md` ... `issue_034.md`
- Scoped Go files: `internal/extension/capability_test.go`, `internal/extension/describe.go`, `internal/extension/host_api.go`, `internal/extension/host_api_test.go`, `internal/extension/manager.go`, `internal/extension/manifest.go`, `internal/extension/manifest_test.go`, `internal/extension/reference_support_unit_test.go`, `internal/extension/registry.go`, `internal/skills/loader.go`, `internal/skills/registry_external.go`
- Additional verification files touched: `internal/extension/manager_test.go`, `internal/extension/registry_test.go`, `internal/skills/registry_test.go`
- Commands run: `git status --short`, `sed`, `nl`, `rg`, `gofmt -w internal/extension/manager.go`, `go test ./internal/extension ./internal/skills`, `make verify`, `git add -- ...`, `git diff --cached --stat`
