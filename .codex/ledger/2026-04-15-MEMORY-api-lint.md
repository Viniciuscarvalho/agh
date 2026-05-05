Goal (incl. success criteria):

- Fix all current `make lint` failures under `internal/api` only (`contract`, `core`, `httpapi`, `spec`, `testutil`, `udsapi`) with root-cause code changes and no suppressions.
- Success means `golangci-lint run ./internal/api/...` passes cleanly and the final report lists changed files, cleared categories, and any remaining blockers outside this scope as none/UNCONFIRMED.

Constraints/Assumptions:

- Root-cause fixes only; no lint suppressions, no workaround comments unless a true external blocker appears.
- Do not revert or disturb unrelated edits from other agents; worktree is already dirty in this scope.
- Prioritize `noctx`, `revive`, `unconvert`, `lll`, and `funlen`, then clear the remaining categories in-scope.

Key decisions:

- Diagnose with segmented `golangci-lint run ./internal/api/...` instead of broad repo changes.
- Treat each lint category as a correctness/design signal and refactor the source instead of suppressing or renaming around it blindly.
- Keep edits localized by package so concurrent work elsewhere in the repo stays isolated.

State:

- In progress.

Done:

- Read workspace instructions from prompt context.
- Read `no-workarounds`, `systematic-debugging`, and `golang-pro` skills.
- Scanned `.codex/ledger/` for cross-agent awareness and read `.codex/ledger/2026-04-15-MEMORY-fix-lint.md`.
- Ran `golangci-lint run ./internal/api/...` and captured 92 issues across `bodyclose`, `errcheck`, `funlen`, `goconst`, `gocritic`, `gocyclo`, `gosec`, `lll`, `noctx`, `revive`, `unconvert`, and `unparam`.
- Cleared `noctx`, `revive`, `unconvert`, `lll`, `bodyclose`, `errcheck`, `goconst`, and `gosec` findings in-scope.
- Refactored heavy local config flow to pass handler config by pointer for `core.NewBaseHandlers`, `httpapi.newHandlers`, and `udsapi.newHandlers`, reducing `gocritic` noise without touching unrelated packages.
- Reduced the segmented lint result from 92 findings to 13 findings.
- Refactored `httpapi.promptStreamState.emit`, `httpapi.New`, `udsapi.New`, `udsapi.RegisterRoutes`, and `spec` operation/schema helpers to address the remaining local `funlen`, `gocyclo`, and `unparam` issues.
- Re-ran `golangci-lint run ./internal/api/...` and hit a concrete external typecheck blocker in `internal/automation` (`AutomationScope` undefined across multiple files), which prevents further scoped lint evaluation inside `internal/api`.
- Synced `SkillsRegistry.ForWorkspace` to the pointer-based contract inside `internal/api` and updated the `core/skills_test.go` callbacks accordingly after parallel edits landed in `internal/api/core/interfaces.go` and `internal/api/core/skills.go`.
- Current `golangci-lint run ./internal/api/...` result is down to 2 findings, both `gocritic` on exported constructors `httpapi.WithConfig(cfg aghconfig.Config)` and `udsapi.WithConfig(cfg aghconfig.Config)`.

Now:

- The only remaining findings are 2 exported API signatures in `internal/api` that need pointer-based `WithConfig` parameters. Their current callsites live outside `internal/api` (`internal/daemon/daemon.go`, `internal/cli/cli_integration_test.go`), so changing them cleanly would cross the current ownership boundary.

Next:

- Hold on the final 2 `gocritic` findings unless ownership expands to update the external callsites for `httpapi.WithConfig` and `udsapi.WithConfig`.
- Re-run segmented lint and summarize results.

Open questions (UNCONFIRMED if needed):

- None for the current scope; the remaining blocker is explicit and ownership-boundary related.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-15-MEMORY-api-lint.md`
- `golangci-lint run ./internal/api/...`
- `internal/api/{contract,core,httpapi,spec,testutil,udsapi}/**`
