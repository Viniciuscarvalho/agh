# Goal (incl. success criteria):

- Implement the accepted `agh update` self-update plan end-to-end.
- Success requires: real CLI self-update for direct-binary macOS/Linux installs, managed-install guidance, `GET /api/settings/update`, web/settings visibility, updated installer and release assets, tests/codegen updates, and final validation for the update surface. Repo-wide `make verify` is desirable but can be blocked by unrelated concurrent work outside this scoped change.

# Constraints/Assumptions:

- Follow root `AGENTS.md`, `internal/CLAUDE.md`, `web/CLAUDE.md`, and `packages/site/CLAUDE.md`.
- Do not touch unrelated dirty worktree files.
- No destructive git commands without explicit user permission.
- Keep GitHub Releases as source of truth for v1.
- Use embedded Sigstore verification instead of external `cosign` for the updater.

# Key decisions:

- Accepted plan persisted at `.codex/plans/2026-05-03-agh-update.md`.
- V1 policy: GitHub First, Stable Only, Sigstore Embutido.
- Reuse AGH daemon restart action instead of inventing a second restart path.
- Add read-only web/API update visibility in v1, not web-triggered mutation.

# State:

- Completed.

# Done:

- Read root instructions supplied in-thread, `internal/CLAUDE.md`, `web/CLAUDE.md`, `COPY.md`, and the required skills for Go, tests, contract co-ship, and final verification.
- Scanned existing `.codex/ledger/*` and `.codex/plans/*` for cross-agent awareness.
- Confirmed the worktree already has unrelated dirty files and new untracked files outside this task surface.
- Reconfirmed current update/restart/settings surfaces and the existing GitHub-release installer/release pipeline.
- Persisted the accepted plan to `.codex/plans/2026-05-03-agh-update.md`.
- Implemented `internal/update` with install-method detection, GitHub release lookup/cache, Sigstore bundle verification, checksum verification, archive extraction, and atomic apply/rollback.
- Replaced the advisory `agh update` with a real direct-binary updater plus `--check`, daemon-aware restart/rollback, and structured human/JSON/toon output.
- Added `GET /api/settings/update`, daemon wiring, contract/spec/codegen updates, and backend tests for the new update status surface.
- Added the General Settings "Software update" section in `web/` with query wiring, read-only status display, release-notes link, recommendation/error surfacing, and route/hook tests.
- Switched the public installer and release pipeline from `checksums.txt.sig` + `.pem` to `checksums.txt.sigstore.json`, updated installer contract tests, and refreshed installation/docs/landing copy.
- Regenerated CLI docs via `make cli-docs`.
- Passed targeted validation: `go test -mod=mod ./internal/update/... ./internal/cli ./internal/api/core ./internal/api/httpapi ./internal/api/udsapi ./internal/api/spec ./internal/daemon ./internal/config`, `make web-typecheck`, targeted Vitest for settings/site install contract, `make fmt`, and `make bun-lint`.
- Ran an Opus peer review on the full implementation under `/tmp/agh-peer-reviews/20260504T014822Z`; round 1 returned `FIX_BEFORE_SHIP` with three blockers: preserve primary+rollback errors, reuse a daemon-scoped update manager, and make cache writes atomic.
- Remediated all three round-1 blockers plus adjacent test/cleanup work in `internal/update`, `internal/daemon`, and `internal/cli`.
- Passed remediation validation: `go test -mod=mod ./internal/update/... ./internal/cli ./internal/daemon ./internal/api/core ./internal/api/httpapi ./internal/api/udsapi ./internal/api/spec ./internal/config -count=1`, `bunx vitest run web/src/routes/_app/settings/-general.test.tsx web/src/hooks/routes/use-settings-general-page.test.tsx packages/site/lib/public-install-contract.test.ts`, `make codegen-check`, and `make lint`.
- Ran Opus peer review round 2 on the remediation diff under `/tmp/agh-peer-reviews/20260504T014822Z`; verdict `SHIP` with zero blockers. Summary artifact: `/tmp/agh-peer-reviews/20260504T014822Z/impl-review-summary-round2.md`.
- Reran `make verify`; it is currently blocked only by concurrent unrelated Storybook/workspace-mock edits from another agent, explicitly excluded from this task scope by the user.

# Now:

- None.

# Next:

- Hand off the implemented surfaces and validation result to the user.

# Open questions (UNCONFIRMED if needed):

- Repo-wide `make verify` remains red until the unrelated concurrent Storybook/workspace-mock changes are stabilized by their owner.

# Working set (files/ids/commands):

- Plan: `.codex/plans/2026-05-03-agh-update.md`
- Ledger: `.codex/ledger/2026-05-03-MEMORY-agh-update.md`
- Core code: `internal/cli/update.go`, `internal/cli/client.go`, `internal/api/core/settings.go`, `internal/api/contract/settings.go`, `internal/api/spec/spec.go`, `internal/daemon/settings.go`, `internal/update/*`
- Web/site: `web/src/systems/settings/**`, `web/src/hooks/routes/use-settings-general-page.ts`, `web/src/routes/_app/settings/general.tsx`, `packages/site/public/install.sh`, `packages/site/content/runtime/**`, `.goreleaser.yml`, `.github/workflows/release.yml`
- Peer review artifacts: `/tmp/agh-peer-reviews/20260504T014822Z/impl-review-summary-round1.md`, `/tmp/agh-peer-reviews/20260504T014822Z/impl-review-remediation-round1.md`, `/tmp/agh-peer-reviews/20260504T014822Z/impl-review-summary-round2.md`
