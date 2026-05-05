Goal (incl. success criteria):

- Compare the extensibility architecture of `agh` against `compozy`, with emphasis on hooks, extension points, runtime contracts, SDK/scaffolding, and system coverage across the execution lifecycle.
- Success means: analyze both repos using subagents, identify concrete gaps in `agh` relative to `compozy`, separate implemented capabilities from planned-but-not-shipped architecture, and deliver an evidence-backed conclusion with actionable recommendations.

Constraints/Assumptions:

- Analysis only unless a follow-up implementation is explicitly requested.
- Follow `no-workarounds` and `architectural-analysis`; focus on root-cause architectural gaps instead of superficial feature checklisting.
- Do not use destructive git commands or modify unrelated files.
- Use local code/doc inspection only for repo facts.
- Need cross-agent awareness from existing extension/hook ledgers in `agh`.

Key decisions:

- Use subagents to analyze `agh` and `compozy` separately, then synthesize locally.
- Treat shipped runtime/code as stronger evidence than ADRs, task docs, or TODO specs.
- Compare extensibility in five buckets: lifecycle hook coverage, extension runtime contract, host APIs/capabilities, packaging/SDK/DX, and operator observability/governance.

State:

- Completed analysis; final response pending.

Done:

- Read workspace-level instructions for `agh`.
- Read the `no-workarounds` and `architectural-analysis` skills.
- Scanned existing ledgers and opened relevant extension/hook ledgers in `agh`.
- Read root `AGENTS.md` / `CLAUDE.md` for `/Users/pedronauck/Dev/compozy/compozy`.
- Read mandatory `.cursor/rules/*.mdc` rules for `compozy`.
- Spawned dedicated subagents for `agh` and `compozy` analysis and merged their findings with local verification.
- Verified that `agh` ships a formal extension host: manifest, registry, manager, subprocess handshake, capability gating, external skill registration, and operator APIs/CLI.
- Verified that `compozy` ships a broader resource-driven extensibility model: autoload registry, resource store, project/workflow indexing, watcher/reconciler loop, tool runtime, MCP, webhook, and workflow/task DSL surfaces.
- Verified the main `agh` contract/runtime mismatches:
  - `tool.*` and `permission.*` hooks exist in taxonomy/dispatch, but no production callers were found outside their dispatch definitions, and session hook group interfaces omit tool/permission domains.
  - `provide_tools` exists in the subprocess handshake and TypeScript SDK, but `internal/extension/manager.go` negotiates only `execute_hook`, `health_check`, and `shutdown`.
  - extension manifests do not declare first-class `tools` resources.
- Wrote the comparison report to `.audits/architectural-analysis-2026-04-15-extensibility-comparison.md`.

Now:

- Prepare the final conclusion for the user.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-15-MEMORY-extensibility-comparison.md`
- `.codex/ledger/2026-04-09-MEMORY-hooks-taxonomy.md`
- `.codex/ledger/2026-04-10-MEMORY-ext-protocol.md`
- `.codex/ledger/2026-04-10-MEMORY-extension-manifest.md`
- `.codex/ledger/2026-04-10-MEMORY-extension-sdk.md`
- `.audits/architectural-analysis-2026-04-15-extensibility-comparison.md`
- `/Users/pedronauck/Dev/compozy/compozy/AGENTS.md`
- `/Users/pedronauck/Dev/compozy/compozy/CLAUDE.md`
- `/Users/pedronauck/Dev/compozy/compozy/engine/resources/store.go`
- `/Users/pedronauck/Dev/compozy/compozy/engine/autoload/registry.go`
- `/Users/pedronauck/Dev/compozy/compozy/engine/project/indexer.go`
- `/Users/pedronauck/Dev/compozy/compozy/engine/workflow/indexer.go`
- `/Users/pedronauck/Dev/compozy/compozy/engine/infra/server/reconciler/reconciler.go`
- `/Users/pedronauck/Dev/compozy/compozy/engine/tool/config.go`
- `/Users/pedronauck/Dev/compozy/compozy/engine/agent/config.go`
- `/Users/pedronauck/Dev/compozy/compozy/engine/runtime/bun/worker.tpl.ts`
- `/Users/pedronauck/Dev/compozy/compozy/engine/webhook/service.go`
