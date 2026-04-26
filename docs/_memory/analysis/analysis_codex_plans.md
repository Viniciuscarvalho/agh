# Analysis: Codex Plans (.codex/plans)

## Scope

- 42 markdown plans read in full from `/Users/pedronauck/Dev/compozy/agh/.codex/plans/`.
- Date range: `2026-03-31` (oldest, `daemon-runtime-dashboard`) → `2026-04-25` (most recent, `site-hardening`); two undated plans (`long-running-sessions.md`, `remove-legacy-alpha.md`) act as standing engineering directives.
- Average plan size ~4-6 KB; range ~1.3 KB (`acp-history-replay`) to ~8.3 KB (`site-positioning-rewrite`). All small enough to read fully.
- Plans authored by Pedro through Codex CLI; bilingual (about a third Portuguese, two-thirds English). Mix of structural, bug-fix, refactor, redesign, test-hardening, and CI plans.

## Plan Inventory

Status is inferred from cross-references in the workspace (commits like `fix: resolve autonomous review`, the present `.compozy/tasks/autonomous/` artifacts, the live code referenced) and from whether the plan reads as a clean specification vs. a "we tried X and it didn't work, so now we are doing Y" forensic plan. "Executed cleanly" = single coherent plan, no follow-up plan that contradicts it. "Required revisions" = a later plan in this same directory backtracks or completes scope. "Forensic" = plan starts from a confirmed bug reproduction.

| File                                              | Topic                                                            | Status                                                                                 |
| ------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `2026-03-31-daemon-runtime-dashboard.md`          | Detached `agh start`, real driver boot, dashboard truthful state | Executed; later refined by `dashboard-zoom-fix` and `session-bootstrap-live-dashboard` |
| `2026-04-01-dashboard-zoom-fix.md`                | Persist viewport per session; stop auto-fit on shape changes     | Forensic, executed cleanly                                                             |
| `2026-04-01-observability-spine.md`               | `internal/observability` ledger replacing split state model      | Foundational; informs nearly every later plan                                          |
| `2026-04-02-child-workgroup-activation.md`        | Coordination bug: child workgroup never activates                | Forensic, surgical fix                                                                 |
| `2026-04-02-dashboard-xterm-visibility.md`        | xterm hidden-fit bug at compact zoom                             | Forensic, root-cause fix                                                               |
| `2026-04-02-session-bootstrap-live-dashboard.md`  | Prompt/tool alignment + live SSE dashboard updates               | Cross-cutting; prompt + driver + frontend                                              |
| `2026-04-05-daemon-web-integration.md`            | Embed SPA into daemon binary at same `http.port`                 | Executed; "no fallback, no placeholder" stance is exemplary                            |
| `2026-04-06-acp-history-replay.md`                | Backend canonical transcript API (smallest plan)                 | Executed; foundation for transcript model                                              |
| `2026-04-06-default-agent-install.md`             | `agh install` wizard + `general` default agent                   | Executed; sets `approve-all` permission default                                        |
| `2026-04-06-session-stop-hang.md`                 | Process-group termination of ACP wrapper trees                   | Forensic; concrete repro on `127.0.0.1:23230`                                          |
| `2026-04-09-hooks-cli-endpoints.md`               | Complete `agh hooks` CLI/transport/UDS surface                   | Required revisions (calls out structural causes of prior partial delivery)             |
| `2026-04-09-skill-progressive-disclosure.md`      | Metadata-only skill catalog; lazy content load                   | Executed cleanly                                                                       |
| `2026-04-10-api-contract-codegen.md`              | OpenAPI single-source-of-truth + Go→TS for extensions            | Executed; foundational tooling                                                         |
| `2026-04-10-kb-refac-full-sweep.md`               | Phased refactor: composition-root, hooks, transports             | Phased plan; status implementation-driven                                              |
| `2026-04-10-mcp-sidecars.md`                      | Top-level `mcp_servers` + `mcp.json` sidecars                    | Executed cleanly                                                                       |
| `2026-04-10-web-shell-workspace-onboarding.md`    | Shared workspace shell; first-run onboarding                     | Executed cleanly                                                                       |
| `2026-04-13-automation-bridges-paper-redesign.md` | New `/bridges` page from Paper system                            | Executed cleanly                                                                       |
| `2026-04-13-network-paper-pages.md`               | `/network` channels/peers UI grounded in real backend            | Executed cleanly; explicit guardrails against fakery                                   |
| `2026-04-13-network-rename-hard-cut.md`           | Rename `channel`→`bridge` then `space`→`channel`                 | Hard cut; phased migration plan                                                        |
| `2026-04-14-extension-bundles.md`                 | Daemon-owned bundle activation runtime                           | Architectural; plan rejects auto-materialization via Host API                          |
| `2026-04-15-bridge-secret-resolution-env-refs.md` | Stock daemon `env:NAME` resolver                                 | Executed cleanly                                                                       |
| `2026-04-15-bridge-web-e2e.md`                    | Operator-ready bridge edit/secret/lifecycle UI                   | Executed cleanly                                                                       |
| `2026-04-15-site-paper-redesign.md`               | Site shell + landing redesign per Paper system                   | Executed; explicit skill sequencing                                                    |
| `2026-04-15-site-positioning-rewrite.md`          | Reposition to Runtime + AGH Network                              | Strategic content rewrite                                                              |
| `2026-04-16-runtime-nav-reorg.md`                 | Fumadocs root-folder navigation tabs                             | Executed cleanly                                                                       |
| `2026-04-17-e2e-confidence-hardening.md`          | Replace fixture-substring matching; freeze `StepKind`            | Required revisions (re-spec of prior E2E delivery)                                     |
| `2026-04-17-memory-standard-upgrade.md`           | FTS5 catalog + per-turn recall + reindex                         | Phase 1 plan with explicit deferred Phase 2/3                                          |
| `2026-04-17-settings-ui-refinement.md`            | Three-band shell, footer save bar, divider rhythm                | Executed; design-discipline plan                                                       |
| `2026-04-18-storybook-route-stories-plan.md`      | MSW root-cause fix: grouped registry per system                  | Forensic, repo-wide fix                                                                |
| `2026-04-18-tasks-ui-redesign-plan.md`            | Tasks: route-driven shell, no modals                             | Executed cleanly                                                                       |
| `2026-04-20-ci-errors-fix.md`                     | Remove visual snapshot suite + lint fix                          | Executed; root-cause cleanup, not job suppression                                      |
| `2026-04-20-prompt-stream-stall.md`               | Detach prompt from request ctx; AI SDK v6 framing                | Forensic; multi-cause fix                                                              |
| `2026-04-20-session-chat-production-hardening.md` | Split transcript history vs. live tail; clear conversation       | Executed; structural repair                                                            |
| `2026-04-20-session-creation-feedback.md`         | Pending feedback in sidebar create flow                          | Executed; small-surface UX plan                                                        |
| `2026-04-20-tasks-route-stories.md`               | Storybook full coverage for `tasks` route family                 | Executed cleanly                                                                       |
| `2026-04-20-workspace-menu-hardcut.md`            | Replace `/automation` with `/jobs` + `/triggers`                 | Hard cut; structural reorg                                                             |
| `2026-04-21-assistant-ui-hard-cut.md`             | Hard-cut migration to `Tools()` + `assistant-ui`                 | Architectural hard cut                                                                 |
| `2026-04-24-shared-logo.md`                       | Shared `Logo` primitive in `@agh/ui`                             | Executed cleanly                                                                       |
| `2026-04-24-site-bento-section.md`                | New `BentoSection` on home                                       | Executed cleanly                                                                       |
| `2026-04-25-site-hardening.md`                    | Static-export quality/perf/security hardening                    | Executed; smallest plan                                                                |
| `long-running-sessions.md`                        | Activity supervisor, heartbeats, inactivity timeout              | Standing directive (Hermes-inspired)                                                   |
| `remove-legacy-alpha.md`                          | Strip nil-receiver/legacy-meta/no-op compat code                 | Standing directive (greenfield discipline)                                             |

## Plan-Quality Patterns

Patterns that consistently produce plans that read as "executable" (i.e. unambiguous, complete, and falsifiable) instead of plans that drift mid-implementation.

### 1. Always lead with the root cause, not the symptom

Almost every bug-fix plan begins with confirmed evidence and names the actual mechanism. Examples:

- `child-workgroup-activation.md`: "Root cause is confirmed from the latest session `d76v1johqf41hojcvpig`: the child master `impl-master` is spawned and reaches `agent_ready` in `resilience_manager`, but never reaches `agent_ready` in `workgroup_manager`."
- `session-stop-hang.md`: "Reproduced on April 6, 2026 against an isolated daemon on `127.0.0.1:23230`: `POST /api/sessions` succeeded, `DELETE /api/sessions/:id` hung for 66-116 seconds."
- `dashboard-xterm-visibility.md`: "Root cause is in the current dashboard terminal lifecycle, not the PTY stream."
- `storybook-route-stories-plan.md`: "Causa raiz confirmada: `msw-storybook-addon` faz `resetHandlers()` e reaplica apenas `context.parameters.msw`."
- `hooks-cli-endpoints.md`: "A causa raiz é estrutural: a entrega anterior parou em handlers HTTP locais, com filtros parciais e sem fechar a superfície compartilhada."

The forensic frame is a signature: plans that lead with reproduction + mechanism essentially never get backtracked.

### 2. Explicit "no fallback, no compat shim, no placeholder" clauses

Pedro routinely calls out things the plan must not do, not just things it must do. This eliminates the most common drift modes for AI agents.

- `daemon-web-integration.md`: "Sem fallback para filesystem, sem placeholder e sem build automático no startup. Sem fallback silencioso."
- `network-rename-hard-cut.md`: "Do not ship aliases, dual JSON fields, alternate CLI flags, deprecated paths, schema fallbacks, or old/new namespaces side by side."
- `assistant-ui-hard-cut.md`: "Treat this as a hard-cut migration in one branch/series: no committed dual renderer, no compat shims, and no custom frontend chat message model left behind."
- `prompt-stream-stall.md`: "Fixing the HTTP framing and decoupling prompt lifetime from request cancellation is the root-cause correction; no sleeps, retries, or client-side reconnect hacks should be introduced."
- `dashboard-xterm-visibility.md`: "Do not add CSS canvas width/height overrides, manual delays, forced refresh hacks, or dependency upgrades in this change. Those are symptom patches, not root-cause fixes."
- `storybook-route-stories-plan.md`: "Não haverá workaround de story individual, fallback silencioso, ou supressão de erro; a solução é mudar o contrato de composição dos handlers."

This is the same principle as `CLAUDE.md`'s "Greenfield Alpha — Zero Legacy Tolerance", expressed at the per-task level.

### 3. Phased plans separate "safe cleanup" from "behavior-changing edits"

Multi-touch plans are sequenced, not big-bang. `kb-refac-full-sweep.md` is the canonical example: phase 1 dead-export removal, phase 2 session lifecycle dedup, phase 3 ACP and daemon boot, phase 4 hook boundary, phase 5 transports/registries. Each phase has its own verification gate. `network-rename-hard-cut.md` does the same with two ordered renames; phase 1 frees the term `channel`, only then phase 2 renames `space` to `channel`.

### 4. Test plan is a per-section bullet list, not a vague "tests will pass"

Every plan produces concrete assertions and verification commands. The strongest plans include:

- explicit golden/contract drift checks (`api-contract-codegen.md`: "Drift canary for `SessionPayload`")
- regression coverage that makes the bug impossible to silently return (`session-stop-hang.md`: "asserts that `Driver.Stop` returns within the configured timeout and no child from that process group remains alive")
- terminal verification commands (`make verify`, `make web-test`, `bun run --cwd packages/site build`).

### 5. "Public Interfaces / Types" section is mandatory

Almost every plan includes a section explicitly enumerating: routes added/changed, payload shapes added/changed, CLI commands added/changed, config keys added/changed. The plans that are smallest still include this section (`shared-logo.md`, `acp-history-replay.md`).

### 6. Assumptions/Defaults section closes the plan

This section is where Pedro pre-empts the "what if" questions. Examples:

- `default-agent-install.md`: "`agh install` v1 será interativo via Bubble Tea; não inclui modo non-interactive neste escopo."
- `mcp-sidecars.md`: "JSON shape is a map keyed by server name, not an array mirror of TOML/frontmatter."
- `bridge-secret-resolution-env-refs.md`: "A future AGH-managed secret store can be introduced later as another resolver backend and ref scheme without changing the bridge launch handshake again."

This pattern signals which decisions are deliberate vs. open. The plans without this section are exclusively trivial (logo, bento section).

### 7. Plans that needed revision share one tell: they implemented a partial surface and stopped

`hooks-cli-endpoints.md` and `e2e-confidence-hardening.md` both open by listing what the prior delivery skipped:

- hooks: "filtros parciais e sem fechar a superfície compartilhada... o `DaemonClient` não expõe hooks... o UDS não registra `/api/hooks/*`."
- e2e: "duas principais fontes de falsa confiança já confirmadas no repo: roteamento de fixture por substring em prompt renderizado e cobertura limitada a agentes cooperativos."

Both forced a re-plan. The lesson: if a plan cannot guarantee end-to-end coverage in one pass (CLI ↔ HTTP ↔ UDS ↔ contracts ↔ docs), it will need a second one.

### 8. Reference patterns from sister codebases when available

Several plans cite `.resources/` (Collaborator, Hermes, OpenClaw/OpenFang/GoClaw) as anchors:

- `dashboard-xterm-visibility.md`: "The relevant Collaborator reference is `.resources/collaborator-ai/collab-electron/packages/components/src/Terminal/TerminalTab.tsx`, which uses an explicit `visible` prop and re-fits on visibility changes."
- `child-workgroup-activation.md`: "Reference pattern to follow: keep spawn/register/status transitions owned by one lifecycle path, like `.resources/claude-code/bridge/sessionRunner.ts`."
- `long-running-sessions.md`: "Implementar um supervisor de atividade por prompt/sessão inspirado no Hermes."

Plans that don't reference an existing pattern when one is available tend to be the ones that need rework.

## Recurring Technical Patterns

### Concurrency

- **One lifecycle path per concept.** `child-workgroup-activation.md` formalizes this as a rule: `driver.Start` → `attachProcess` → `MarkAgentReady` → publish `ReadySubject` → return. Both bootstrap and `spawnAgent` must use the same helper. The plan explicitly names the failure mode: "After this change, bootstrap and `spawnAgent` must both call the same activation helper so a future agent type cannot bypass the lifecycle handshake again."
- **Process trees, not processes.** `session-stop-hang.md` is the canonical reference: spawn ACP wrappers in their own process group on Unix, terminate the whole group with `SIGTERM` then `SIGKILL`, with a non-Unix fallback that still builds.
- **Detach long work from request lifetime.** `prompt-stream-stall.md`: "call `Sessions.Prompt` with `context.WithoutCancel(c.Request.Context())`; keep the writer loop itself bound to the request context so disconnect stops streaming only, not prompt execution." Combined with explicit `CancelPrompt` API.
- **Activity supervision over wall-clock timeouts.** `long-running-sessions.md`: heartbeats update metadata only, structured `runtime_progress` events at lower cadence reach the prompt stream, warnings emitted exactly once, cancel grace before `StopTimeout`. "Inactivity timeout não é wall-clock timeout."
- **Idempotent cancel.** Cancel/stop/timeout all collapse into one path. `long-running-sessions.md`: "`CancelPrompt`, stop de sessão e timeout usam o mesmo caminho idempotente de cancelamento."

### Configuration

- **TOML + sidecar JSON pattern.** `mcp-sidecars.md` formalizes: `config.toml` for the global baseline, `mcp.json` sidecar files in four containers (`~/.agh/`, `<workspace>/.agh/`, `<agentDir>/`, `<skillDir>/`) with same-scope `mcp.json` taking precedence. Cross-scope precedence preserved.
- **No magic defaults; explicit bootstrap.** `default-agent-install.md`: "Rejeitar heurística invisível de auto-instalação no primeiro uso; isso mascararia estado e continuaria produzindo comportamento implícito difícil de entender e testar."
- **Resolution chains documented as ordered fallbacks.** Same plan: "Provider efetivo: `agent.provider` -> `config.defaults.provider` -> erro explícito com orientação para rodar `agh install`."
- **Config keys grouped under namespaced TOML blocks.** Observability uses `[observability]`, `[observability.transcripts]`, `[observability.otlp]`. Long-running-sessions adds `[session.supervision]`.
- **Disable/zero-value semantics are explicit.** `long-running-sessions.md`: "`0` desabilita warning/timeout/progress; heartbeat deve ser positivo."

### Persistence

- **Append-only event store as the canonical operational ledger.** `observability-spine.md`: a global `runtime.db` with `event_id`, `seq`, `timestamp`, `observed_timestamp`, `severity`, `event_type`, plus correlation fields. Session DBs become projections, not authority.
- **Live broadcaster only after durable append.** Same plan: "publishes only after durable append; reconnect/replay uses `after_seq` from `runtime.db`."
- **Derived FTS5 catalog over Markdown source of truth.** `memory-standard-upgrade.md`: "Keep Markdown memory files as the source of truth. Add a derived SQLite FTS5 catalog hosted in the global database." Catalog is rebuildable; explicit `reindex` exists; read paths fall back to synthesized index when `MEMORY.md` is stale.
- **Hard-cut schema renames; rewrite tables instead of migrating.** `network-rename-hard-cut.md`: "Rewrite schema builders/assertions to the final names only; do not add migration code for the old table names." This matches `CLAUDE.md`'s greenfield rule.
- **Crash-recovery `Reconcile` stays; legacy-meta compat goes.** `remove-legacy-alpha.md`: explicit distinction between "still useful current logic" (`Reconcile`) and "legacy support" (`legacySessionMeta`).

### Testing

- **Build tags for integration tests, co-located.** Visible in `kb-refac-full-sweep.md` and `e2e-confidence-hardening.md`. `make test` = unit only; `make test-integration` adds tag-gated tests.
- **Mock servers as helper subprocesses, not in-process fakes.** `e2e-confidence-hardening.md`: "`AGH_TEST_DAEMON_BIN` e `AGH_TEST_ACPMOCK_DRIVER_BIN` passam a ser os overrides oficiais do harness para Go e Playwright."
- **Drift canary tests on contracts.** `api-contract-codegen.md`: drift canary for `SessionPayload`, golden test REST and SDK; `make verify` fails on stale codegen.
- **Coverage matrix tests that fail on missing emissions.** `observability-spine.md`: "Add an event coverage matrix test that fails if any required lifecycle path does not emit its canonical event."
- **Manual verification still listed.** Pedro routinely lists browser/CLI manual checks alongside automated tests, especially for UX-sensitive surfaces (session creation feedback, tasks UI).
- **Stress runs for concurrency.** `e2e-confidence-hardening.md`: "Executar stress run do recorte de transport parity em loop para eliminar a flake observada sob concorrência."

### Transport / API

- **Shared `BaseHandlers` in `internal/api/core` between HTTP and UDS.** `hooks-cli-endpoints.md` is the explicit refactor: "Extrair a lógica de hooks de `httpapi` para `internal/api/core`, com métodos compartilhados em `BaseHandlers`."
- **OpenAPI is the single source of truth for REST; Go→TS for JSON-RPC extensions.** `api-contract-codegen.md` formalizes: REST gets `kin-openapi`, extensions get a Go→TS generator. SSE and prompt-streaming envelopes stay outside OpenAPI by design.
- **SSE convention.** `bridge-web-e2e.md` documents it cleanly: "one initial `snapshot`, subsequent `snapshot` events only when state changes, one `error` event before exit if polling fails. Keep the SSE contract out of OpenAPI, matching the project's existing stream convention."
- **AI SDK v6 UI-message protocol compliance for prompt streaming.** `prompt-stream-stall.md` and `assistant-ui-hard-cut.md` together establish: server emits `tool-input-start` → `tool-input-available` → `tool-output-available`; `data-agh-permission` is the only required AGH-specific data part; `data-agh-event` is additive only.

### Frontend

- **App-renderer-systems pattern.** `network-paper-pages.md`: "Create `web/src/systems/network` following the app-renderer-systems pattern: adapters, types, query keys, query options, hooks, and pure presentational components."
- **Generated types only; no hand-mirrored DTOs.** `api-contract-codegen.md`: "Remove schemas REST duplicados de `web/src/systems/*/types.ts` quando apenas espelham o backend."
- **MSW grouped registry per system.** `storybook-route-stories-plan.md` (root-cause fix); `tasks-route-stories.md` (consumer).
- **Route-driven shell with persistent left rail.** `tasks-ui-redesign-plan.md` and `workspace-menu-hardcut.md` agree on this architecture.
- **One accent color, one signal palette.** Settings UI plan, paper redesign plan, bento plan all reaffirm the `DESIGN.md` constraint: orange for action, semantic colors only for status, no decorative color competition.

## Cross-Plan Themes

### Theme 1: Truthful UI > Plausible UI

Recurring rule: never invent a control or metric the backend does not actually support.

- `automation-bridges-paper-redesign.md`: "Do not implement per-bridge `retry` or `timeout` settings in this round. The runtime does not support them yet, and the UI must not imply otherwise."
- `network-paper-pages.md`: "Keep `Peers` observability-only in v1. Do not fake `Disconnect` or `Remove` actions before the backend models them honestly."
- `automation-bridges-paper-redesign.md`: "Backlog microcopy must reflect real telemetry only. No invented 'pending retry' metrics."
- `network-paper-pages.md`: "When the Paper conflicts with the RFC/current daemon model, the implementation follows the truthful daemon model while staying as close as possible to the approved layout."

### Theme 2: One vocabulary across all surfaces

`network-rename-hard-cut.md` codifies: rename across "code, storage, APIs, CLI, extension protocol, specs, and RFCs" simultaneously, including DB columns, NATS subjects, env vars, OpenAPI tags, and `.compozy/tasks/*` artifacts. The `Phase 3` directive — "update specs and docs in place so the repo has one vocabulary everywhere" — is a model rule.

### Theme 3: Composition root discipline

`observability-spine.md`, `kb-refac-full-sweep.md`, and `remove-legacy-alpha.md` all enforce that `daemon/` is the only place where wiring lives, and lifecycle reconciliation (`Reconcile`) is composition-root logic, not "legacy".

### Theme 4: Hard cuts over migrations

Five plans explicitly use the phrase "hard cut" (`network-rename-hard-cut`, `assistant-ui-hard-cut`, `workspace-menu-hardcut`) or equivalent ("Sem fallback silencioso", "no compat shim"). The pattern: rename/restructure in place, regenerate codegen, delete the old surface in the same PR. Phased only when the change is too big for one branch — and even then, no transitional bridge code left between phases.

### Theme 5: Observability is not optional

Almost every backend plan adds explicit events or extends an existing event family. Observability spine plus per-feature additions (`memory.search`, `memory.reindex`, `runtime_progress`, `runtime_warning`, `bridges.status`). Coverage tests force compliance.

### Theme 6: Dual sources for design — Paper + DESIGN.md

UI plans uniformly cite Paper artboards as visual source of truth for layout and copy, and `DESIGN.md` as the token authority for color/type/depth/motion. The split is consistent: Paper governs _composition_, `DESIGN.md` governs _grammar_.

### Theme 7: "Greenfield alpha" is enforced per-plan

The `remove-legacy-alpha.md` standing directive shows up enforced in dozens of subordinate plans. Examples in actual plans of the form "do not preserve old field name", "do not add migration code", "delete legacy mappers", "no compatibility shim", "Because this is unreleased alpha, the rename is applied in place."

### Theme 8: Skill-driven execution

`site-paper-redesign.md` is the most explicit: "explicitly sequence the installed skills this way: `frontend-design` for context/anti-pattern rules, `normalize` for Paper alignment, `bolder` for landing composition, `typeset` for typography, and `polish` for the final pass." This matches `CLAUDE.md`'s skill dispatch table.

## Skill Candidates

These skills are justified by repeated patterns in the plans.

1. **`acp-driver-lifecycle`** — codify the four-step activation sequence (`driver.Start` → `attachProcess` → `MarkAgentReady` → publish `ReadySubject`), the ACP wrapper process-group launch/kill, the cooperative cancel-then-grace stop semantics. Evidence: `child-workgroup-activation.md`, `session-stop-hang.md`, `long-running-sessions.md`, `prompt-stream-stall.md`, `daemon-runtime-dashboard.md`.

2. **`agh-observability-events`** — checklist for adding any new domain operation: define canonical event name; pick correlation keys; emit before+after state transitions; ensure coverage matrix test catches a missing emission. Evidence: `observability-spine.md`, `memory-standard-upgrade.md`, `long-running-sessions.md`, almost every backend plan.

3. **`agh-no-fakery-ui`** — UI must reflect actual backend capabilities; no invented metrics; no plausible-looking but unmodeled controls; when Paper conflicts with daemon truth, daemon wins. Evidence: `automation-bridges-paper-redesign.md`, `network-paper-pages.md`, `bridge-web-e2e.md`.

4. **`agh-shared-handler-rule`** — every REST/UDS endpoint must live in `internal/api/core` (`BaseHandlers`); no parsing/validation/mapping duplicated between transports; CLI/SDK consume the same shared contract types. Evidence: `hooks-cli-endpoints.md`, `api-contract-codegen.md`, `bridge-web-e2e.md`.

5. **`agh-msw-storybook-grouping`** — MSW handlers in Storybook must be a per-system grouped registry; story overrides replace one group, never the array; `appRouteParameters()` separates router stub from MSW. Evidence: `storybook-route-stories-plan.md`, `tasks-route-stories.md`.

6. **`agh-config-resolution`** — config resolution chains are explicit ordered fallbacks ending in actionable errors; no magic auto-install; sidecar JSON co-exists with TOML at the same scope. Evidence: `default-agent-install.md`, `mcp-sidecars.md`, `bridge-secret-resolution-env-refs.md`.

7. **`agh-hard-cut-rename`** — when renaming, sweep code, storage, APIs, CLI, extensions, specs, RFCs, and task artifacts; rewrite schema to final names; no aliases or dual fields. Evidence: `network-rename-hard-cut.md`, `assistant-ui-hard-cut.md`, `workspace-menu-hardcut.md`, `remove-legacy-alpha.md`.

8. **`agh-prompt-streaming-protocol`** — prompt execution detached from request context; explicit cancel API; AI SDK v6 UI-message parts; AGH-specific data parts only as additive. Evidence: `prompt-stream-stall.md`, `session-chat-production-hardening.md`, `assistant-ui-hard-cut.md`, `acp-history-replay.md`.

## Lesson-Learned Candidates

Plans that contain durable engineering insights worth lifting into project memory.

1. **xterm hidden/reveal lifecycle.** `dashboard-xterm-visibility.md` — measuring or fitting xterm while under `display:none` produces stuck `300x150` canvases. Fix: visibility-aware fit guard; `requestAnimationFrame` chained on reveal; `ResizeObserver` ignores zero-size observations. References: xterm.js PR #525, issue #3029.

2. **Process group termination is mandatory for wrapper-launched ACP runtimes.** `session-stop-hang.md` — `npm exec @zed-industries/codex-acp -> node -> native codex-acp` keeps stdio open through descendants; `SIGTERM` to wrapper alone leaves the tree alive and `cmd.Wait()` never returns.

3. **`shapeSignature`-driven `fitView` resets the user's viewport on every spawn.** `dashboard-zoom-fix.md` — viewport state must live above the canvas, persisted by session, restored on remount; structural changes recompute layout but never reset camera.

4. **Detaching prompt lifetime from HTTP request context is the right boundary.** `prompt-stream-stall.md` — `context.WithoutCancel`; explicit `CancelPrompt` API. Stream framing and prompt lifetime are different concerns and must be solved independently.

5. **MSW Storybook addon `resetHandlers()` reapplies only `parameters.msw`.** `storybook-route-stories-plan.md` — flat-array handlers + per-story override = global wipe. Solve at the contract level: grouped registry, override one group only.

6. **Markdown is source of truth; FTS5 is derived.** `memory-standard-upgrade.md` — search/recall path must synthesize a safe index when `MEMORY.md` is missing or stale; never silently overwrite during read.

7. **Inactivity-supervisor heartbeats must not flow through the ACP event channel.** `long-running-sessions.md` — backpressure risk; heartbeats update metadata only; `runtime_progress` is a low-cadence persisted event.

8. **Greenfield alpha means delete, not migrate.** `remove-legacy-alpha.md` and the rename plan together — if no users exist, the cheapest cleanup is to break the schema in place and rewrite the writer.

9. **The "two equal cards" homepage anti-pattern.** `site-positioning-rewrite.md` and `site-paper-redesign.md` — equal-weight grids dilute positioning; editorial asymmetry communicates better.

10. **`Tools()` toolkit registration centralizes tool UI ownership.** `assistant-ui-hard-cut.md` — backend-defined tool definitions; `type: "backend"` render-only entries; `useAui({ tools: Tools({ toolkit }) })` replaces per-component `makeAssistantToolUI`.

## System Prompt Candidates for CLAUDE.md

Rules implicit across the plans that are not yet captured in `CLAUDE.md`.

1. **Plan format requirement.** Every Codex plan in this repo has Summary → Implementation Changes → Public Interfaces/Types → Test Plan → Assumptions/Defaults. New plans should follow the same structure or call out explicitly why a section is absent.

2. **Forensic-first bug fixes.** Bug-fix plans must open with a confirmed reproduction (timestamp, command, observed evidence) before listing changes. "I think" or "probably" is not allowed at the top of a fix plan.

3. **Anti-fakery rule for UI.** UI must not display controls or metrics that the backend does not currently support. When Paper artboards or design references conflict with daemon reality, daemon truth wins.

4. **No partial-surface completions.** Any change touching a public surface must close the loop end to end: contract types → HTTP handler → UDS handler → CLI client → CLI command → tests → docs. Stopping at "HTTP works, UDS later" forces a re-plan.

5. **Hard-cut renames.** Renames sweep code, storage, APIs, CLI, extensions, specs, RFCs, and task artifacts in the same change. No aliases, no dual fields, no schema fallback paths.

6. **Composition root discipline.** Only `daemon/` wires components. Reconciliation logic that runs at boot belongs to composition root and is not "legacy support".

7. **Skill sequencing for design tasks.** UI/design tasks call out skill order explicitly (e.g. `frontend-design` → `normalize` → `bolder` → `typeset` → `polish`).

8. **`make verify` is the closing gate, but per-package focused tests run first.** Pattern visible in nearly every Test Plan: "`go test ./internal/<package> -count=1`, then `make verify`."

9. **MSW grouped registry for Storybook.** Override per system group only; never replace handler arrays.

10. **`internal/api/core` as the canonical handler home.** REST endpoints exist as shared `BaseHandlers` methods; HTTP/UDS only choose registration and authentication.

11. **Detached prompts.** Prompts run on `context.WithoutCancel(req)`; client disconnect stops streaming, not execution; explicit `CancelPrompt` API for cooperative cancel.

12. **No `time.Sleep` for orchestration; heartbeats and progress events are the supervision primitive.** Already implied in `CLAUDE.md` Concurrency rules but reinforced explicitly in `long-running-sessions.md`.

## Notes for Synthesis

- **Bilingual habit:** roughly a third of plans are in Portuguese. The structure, vocabulary, and discipline are identical across languages; the bilingual choice does not correlate with plan quality. Future tooling should treat both as first-class.
- **Plans build on each other.** The observability spine plan (April 1) is the substrate that almost every later plan references for events, transcripts, audit, and reconnect/replay. Memory standard, long-running sessions, and tasks all extend it.
- **Plan length is anti-correlated with quality only at extremes.** The shortest plan (`acp-history-replay.md`, 1.3 KB) is one of the cleanest; the longest (`site-positioning-rewrite.md`, 8.3 KB) needed restructuring across content + nav + comparison. The middle band (3-6 KB) holds most of the executable, single-pass plans.
- **Plans that needed revision.** `hooks-cli-endpoints.md` and `e2e-confidence-hardening.md` both open by enumerating gaps in a prior delivery. Both are honest about why the partial outcome happened (skipped UDS, skipped client, skipped exact-match fixtures). They are not failures of planning — they are the recovery plans. The lesson: surface coverage must be enumerated up front, not assumed.
- **Two standing directives (`long-running-sessions.md`, `remove-legacy-alpha.md`).** These are not date-stamped because they describe ongoing engineering posture rather than a single delivery. They could be lifted into `CLAUDE.md` or a `docs/_memory/standing_directives.md`.
- **No retired plans, no ABANDONED markers.** Every plan in the directory was implemented or extended; none was discarded mid-flight. The discipline of writing plans only when scope is real is a discoverable property of this corpus.
- **The site/web split is unusually well separated.** `packages/site` plans (paper redesign, positioning, bento, hardening, logo) never leak into runtime concerns; runtime/daemon plans (observability, long-running, hooks, ACP lifecycle) never assume web reactivity. The boundary appears to be enforced consciously.
- **`DESIGN.md` is the only authority cited for cross-cutting visual rules.** Paper artboards govern composition; `DESIGN.md` governs tokens. Any future "design system" skill should encode this split explicitly.
- **The plans are remarkably consistent about _what changes_ and _what stays_.** Every plan that touches an existing surface lists explicit "preserve" clauses (preserve current parent-to-child messaging, preserve dialog-based collection editing, preserve Inter + JetBrains Mono, preserve `/protocol` URL paths). This is what makes the plans cheap to review.
