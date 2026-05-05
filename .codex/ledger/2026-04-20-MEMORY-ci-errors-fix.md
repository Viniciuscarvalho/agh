Goal (incl. success criteria):

- Fix the three CI failures from run `24668204199` on PR 48.
- Success: `Verify (fmt, lint, unit, build)` passes locally, and the visual snapshot infrastructure that caused the other two CI failures is fully removed from the repo and workflow.

Constraints/Assumptions:

- Follow `systematic-debugging` and `no-workarounds`: fix root causes, do not paper over failures.
- User explicitly chose to remove the visual snapshot flows entirely, including local tooling and committed baselines.
- Do not touch unrelated files or use destructive git commands.
- Final verification must include `make verify`; web changes should also satisfy `make web-lint` and `make web-typecheck`.

Key decisions:

- Treat the Go CI failure as an isolated lint issue in `internal/observe/tasks.go`.
- Treat the two visual CI failures as structural mismatch plus unwanted maintenance burden; remove the entire snapshot system instead of seeding Linux baselines.
- Persist the accepted implementation plan under `.codex/plans/`.

State:

- Completed.

Done:

- Identified CI root causes from GitHub Actions logs:
  - `Verify` fails on `goconst` for repeated `"warn"` in `internal/observe/tasks.go`.
  - `ui-visual` and `web-visual` fail because CI on Linux expects `*-chromium-linux.png` baselines while the repo only commits `*-chromium-darwin.png`.
- Confirmed the repo currently contains visual snapshot infra in both `packages/ui` and `web`.
- Confirmed user wants full removal of that infra, not just CI disablement.
- Removed `ui-visual` and `web-visual` jobs plus their `changes` filters from `.github/workflows/ci.yml`.
- Removed visual-only scripts/exports/config from `packages/ui` and `web`, deleted visual test directories and committed darwin baselines, and updated docs/story comments that still described the removed suite.
- Fixed the Go lint failure by introducing `taskHealthStatusWarn` in `internal/observe/tasks.go`.
- Updated `bun.lock` to remove `@playwright/test` from `packages/ui`.
- Re-ran validation:
  - `bun run --cwd packages/ui test` → 44 files / 248 tests passed.
  - `bun run --cwd web test` → 199 files / 1500 tests passed.
  - `make web-lint` → 0 warnings / 0 errors.
  - `make web-typecheck` → passed.
  - `BUN_AUTO_INSTALL=disable make verify` → `DONE 5345 tests` and `OK: all package boundaries respected`.

Now:

- Task implementation is complete; only final handoff remains.

Next:

- If requested, prepare a commit or help isolate the unrelated local Bun manifest mutation tied to the untracked `scripts/scrape-prs.ts`.

Open questions (UNCONFIRMED if needed):

- `UNCONFIRMED`: local Bun commands in this workspace keep reintroducing `prs:scrape` / `@octokit/rest` into root `package.json` and `bun.lock` because of the untracked `scripts/scrape-prs.ts`. This is outside the CI-fix scope but explains the unrelated manifest diff that remains in `git status`.

Working set (files/ids/commands):

- `.codex/plans/2026-04-20-ci-errors-fix.md`
- `.codex/ledger/2026-04-20-MEMORY-ci-errors-fix.md`
- `.github/workflows/ci.yml`
- `packages/ui/package.json`
- `packages/ui/README.md`
- `packages/ui/playwright.config.ts`
- `packages/ui/tests/visual/*`
- `packages/ui/src/components/stories/__snapshots__/`
- `packages/ui/src/testing/visual-story-index.ts`
- `web/package.json`
- `web/playwright.visual.config.ts`
- `web/tests/visual/*`
- `web/tests/visual/__snapshots__/`
- `internal/observe/tasks.go`
- `gh run view 24668204199 --job 72131428570 --log-failed`
- `gh run view 24668204199 --job 72131428581 --log-failed`
- `gh run view 24668204199 --job 72131428584 --log-failed`
