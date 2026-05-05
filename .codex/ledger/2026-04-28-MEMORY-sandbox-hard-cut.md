# Goal (incl. success criteria):

- Implement accepted hard-cut plan renaming execution `environments` feature to `sandbox` across runtime, contracts, CLI, web UI, site docs, internal instructions, `.compozy/tasks`, and `docs/_memory`.
- Success requires regenerated contracts/docs, focused tests, and final `make verify` evidence.

# Constraints/Assumptions:

- No destructive git commands.
- Existing unrelated change: `docs/ideas/complex-scenarios/network.md`; do not touch unless explicitly required.
- Hard cut: no public aliases, redirects, dual fields, or config fallbacks.
- Generic OS env/env-var terminology remains allowed.
- Conversation BR-PT; artifacts/code/docs English.

# Key decisions:

- Product term: `Sandbox`; collection/config plural: `sandboxes`.
- API remains config-backed as `/api/settings/sandboxes`; web IA is top-level `/sandbox`.
- Implemented providers documented: `local`, `daytona`.
- Persisted accepted plan at `.codex/plans/2026-04-28-sandbox-hard-cut.md`.

# State:

- Implementation complete.
- Post-migration audit complete for accidental over-renames of process environment terminology.
- Final full `make verify` passed before the audit after fixing web Settings expectations, Daytona line length, and the global DB v1 checksum drift.
- Focused audit verification passed: `go test ./internal/acp ./internal/hooks ./internal/sandbox ./internal/extension ./internal/extensiontest -count=1`.
- Guard search only reports obsolete `environment_*` identifiers inside `migrateSandboxColumnNames`, where they are required as source column names for the rename migration.
- Generic process environment terminology remains intentionally present for env vars, provider secrets, hook subprocess env, and daemon process env docs/tests.

# Done:

- Read relevant ledger list and confirmed unrelated dirty file.
- Read `internal/CLAUDE.md` / `internal/AGENTS.md` and skill guidance.
- Persisted accepted plan.
- Moved `internal/environment` to `internal/sandbox`.
- Mechanically renamed Go runtime/contract/store/CLI/hook identifiers from Environment to Sandbox.
- Fixed Daytona local type collision with the new `internal/sandbox` package.
- Added top-level web `/sandbox` route and sidebar item after Skills.
- Added site landing Sandbox section and dedicated runtime Sandbox docs.
- Added `docs/_memory` glossary entry and L-014 lesson for Sandbox vocabulary drift.
- Regenerated CLI docs after the `--sandbox` / `--sandbox-profile` hard cut.
- Normalized `.compozy/tasks` artifacts for Sandbox public terminology.
- Preserved the historical global schema v1 checksum so existing DBs can advance to migration 9 instead of failing integrity before the rename migration runs.
- Final verification passed: `make verify`.
- Audited accidental Sandbox substitutions in generic env-var surfaces.
- Fixed false positives in comments/test labels/fixtures: extension manifest env requirements, manifest template getenv, hook subprocess env overrides, bridge harness expected environment, and grammar around "a sandbox".
- Re-normalized readable sandbox/settings task artifacts, excluding raw QA logs, while preserving `environment variable(s)` terminology.

# Now:

- Ready to report the audit result.

# Next:

- None.

# Open questions (UNCONFIRMED if needed):

- None.

# Working set (files/ids/commands):

- `.codex/plans/2026-04-28-sandbox-hard-cut.md`
- `.codex/ledger/2026-04-28-MEMORY-sandbox-hard-cut.md`
- Expected broad working set: `internal/**`, `cmd/**`, `web/**`, `packages/site/**`, `openapi/**`, `.compozy/tasks/**`, `docs/_memory/**`.
- Audit commands:
  - `rg -n "sandbox lookup|sandbox expected|explicit sandbox overrides|sandbox variable|sandbox variables|sandbox requirement|sandbox requirements|sandbox env|process sandbox|daemon sandbox|current sandbox environment|an sandbox" ...`
  - `rg -n "WithEnvironmentRegistry|SessionManagerDeps\\.EnvironmentRegistry|EnvironmentRegistry|EnvironmentProfile|Environments map|/environments|environment/list|environment/info|environment/exec|environment\\.prepare|environment\\.ready|environment\\.sync|environment\\.stop|environment\\.exec|environment_id|environment_backend|environment_profile|\\[environments\\." ...`
  - `rg -n "environment variables|environment variable|process environment|daemon environment|api_key_env|requires_env|client_secret_env|webhook_secret_env|DAYTONA_API_KEY" ...`
