# Scenario Matrix

Select rows based on `scope-or-context`. Always include at least one baseline release track and one changed-feature track.

| Track | Use When | Required Surfaces | Evidence |
|---|---|---|---|
| Release candidate | Preparing a broad release | verify gate, daemon, CLI, API, Web through browser-use or agent-browser fallback, persistence health | baseline/final gate, CLI evidence, browser evidence, health payloads, core flows |
| Feature-focused | Branch introduces a complex feature | changed feature plus adjacent integrations across CLI and Web when exposed | before/after behavior, regression tests, live scenario artifacts |
| Autonomy and orchestration | Agents coordinate work or spawn/manage tasks | sessions, tasks, subtasks, dependencies, task runs, network channels, CLI/Web task views | task tree, run lifecycle, agent messages, artifacts |
| Network collaboration | Agents talk, hand off, or coordinate in channels | channels, peers, direct/say/receipt/trace messages, historical channels, CLI/Web channel views | message timelines, peer state, channel detail |
| Automations | Jobs, cron, triggers, or scheduler behavior changed | jobs, cron/every schedules, webhook triggers, runs, retries/fire limits, CLI/Web run history | run history, scheduler state, generated artifacts |
| Knowledge and memory | Knowledge, memory, or retrieval changed | write/list/search/read/reindex/consolidate flows, CLI/Web knowledge views | created memory files, search results, detail rendering |
| Hooks and extensions | Lifecycle hooks or extensions changed | hook catalog, hook runs, extension install/enable/disable, side effects, CLI/Web status | hook logs, extension status, artifact side effects |
| Web integration | UI behavior or read model changed | `browser-use:browser` flows, or `agent-browser` only when browser-use is unavailable, navigation, filters/toggles, details, loading/error states | screenshots, DOM snapshots, final URLs |
| Performance/stability | Memory, storage, long runs, or concurrency risk exists | health endpoints, DB size, process RSS, repeated runs, concurrent agents | before/after metrics, bounded growth, no stuck work |

## Minimum Scenario Composition

For broad release validation, include:

1. Startup workspace bootstrap.
2. At least six agents across distinct company functions.
3. At least four channels representing company areas.
4. At least one automation job and one trigger.
5. At least one task tree with dependencies and multiple runs.
6. At least one knowledge entry that is written, searched, and opened.
7. At least one Web UI pass through `browser-use:browser` when the app has a Web surface, with `agent-browser` allowed only when browser-use is unavailable after setup.
8. At least one failure or edge-path probe, such as blocked dependency, failed run, invalid trigger, retry, stale channel, or historical data view.
9. At least one CLI/Web parity check that proves the same persisted object is correct across both surfaces.

For feature-focused validation, include the broad release baseline plus:

1. A scenario explicitly built around the feature under test.
2. At least two adjacent features that consume or display the feature's state.
3. One historical or stale-data case when persistence is involved.
4. One concurrency or repeated-operation case when orchestration is involved.
5. One final browser-use check, or `agent-browser` fallback check when browser-use is unavailable, that proves the feature's output is understandable in the operator-facing UI.
