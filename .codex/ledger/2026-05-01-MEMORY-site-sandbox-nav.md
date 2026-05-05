Goal (incl. success criteria):

- Fix `packages/site` runtime docs sidebar so the Sandbox section behaves like other top-level doc sections: clicking "Sandbox" opens the sandbox index page and the sidebar item follows the standard icon treatment.

Constraints/Assumptions:

- Follow root AGENTS.md and `packages/site/CLAUDE.md`.
- Do not run destructive git commands.
- Do not commit generated `.source/`, `.velite/`, `.next/`, or local tracking artifacts.
- Conversation in Brazilian Portuguese; code/docs artifacts in English.

Key decisions:

- Fix Sandbox through folder metadata only: add a sidebar icon and remove `index` from `pages`, matching neighboring sections where the folder itself links to `index.mdx`.

State:

- Patch complete for Sandbox navigation; focused verification passed. Full `make verify` is blocked by an unrelated deterministic Go test failure in `internal/daemon`.

Done:

- Read `packages/site/CLAUDE.md`.
- Scanned `.codex/ledger/` for concurrent work awareness.
- Read `packages/site/AGENTS.md` and applicable site/docs/UI skills.
- Compared Sandbox metadata with neighboring runtime core sections.
- Updated `packages/site/content/runtime/core/sandbox/meta.json`.
- Ran `bun run source:generate` in `packages/site` successfully.
- Ran `bun test lib/source.test.ts` in `packages/site`: 4 pass, 0 fail after adding Sandbox coverage.
- Ran `bun run typecheck` in `packages/site` successfully.
- First `make verify` failed in pre-existing/unrelated landing test alt-text mismatch during `bun-test`.
- Second `make verify` failed because the new test imported `runtimeLayoutTree`, which made Vitest parse raw generated MDX; corrected test to validate Sandbox `meta.json` directly.
- Ran `bunx vitest run packages/site/lib/source.test.ts`: 4 pass, 0 fail.
- Re-ran `cd packages/site && bun run typecheck` successfully.
- Third `make verify`: `bun-lint`, `bun-typecheck`, `bun-test` (258 files, 1850 tests), web build, and Go lint progressed; failed in Go tests at `internal/daemon TestSettingsRuntimeSurfaceMCPAuthStatusSurvivesStoreReopen`.
- Isolated `go test -race -run TestSettingsRuntimeSurfaceMCPAuthStatusSurvivesStoreReopen ./internal/daemon` also failed deterministically with `Status = "expired", want "authenticated"`.

Now:

- Ready to report patch and verification status.

Next:

- If requested separately, investigate unrelated `internal/daemon` MCP auth status test failure.

Open questions (UNCONFIRMED if needed):

- Whether the unrelated `internal/daemon` MCP auth status failure should be fixed in this workstream or a separate task.

Working set (files/ids/commands):

- Edited: `packages/site/content/runtime/core/sandbox/meta.json`, `packages/site/lib/source.test.ts`.
- Commands run: `cd packages/site && bun run source:generate`; `cd packages/site && bun test lib/source.test.ts`; `cd packages/site && bun run typecheck`.
- Commands run after final edits: `bunx vitest run packages/site/lib/source.test.ts`; `cd packages/site && bun run typecheck`; `make verify`; `go test -race -run TestSettingsRuntimeSurfaceMCPAuthStatusSurvivesStoreReopen ./internal/daemon`.
