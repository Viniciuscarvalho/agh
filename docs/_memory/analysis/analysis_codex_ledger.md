# Analysis: Codex Ledger (.codex/ledger)

## Scope

The ledger directory contains **255 markdown files** spanning **2026-04-06 through 2026-04-26** (a single intense 21-day stretch of greenfield-alpha work on AGH). Files follow the convention `YYYY-MM-DD-MEMORY-<topic>.md` and average ~3 KB. Total payload is roughly 1.4 MB. Ledger volume per day: 22 (Apr 6), 18 (Apr 7), 3 (Apr 8), 16 (Apr 9), 26 (Apr 10), 11 (Apr 13), 9 (Apr 14), 15 (Apr 15), 11 (Apr 16), 32 (Apr 17), 2 (Apr 18), 2 (Apr 19), 17 (Apr 20), 8 (Apr 21), 1 (Apr 22), 2 (Apr 23), 21 (Apr 24), 18 (Apr 25), 21 (Apr 26).

Sampling: I read ~70 ledger files in full plus targeted greps over the remaining 185. The files are highly structured ("Goal / Constraints / Key decisions / State / Done / Now / Next / Open questions / Working set"), which made full reading of the most-information-dense entries efficient. Every workstream cluster (refac, hooks, autonomous, hermes, e2e, lint, CI, network, web pages, brand) is represented in the sample.

Each file is a memory snapshot Codex took during a discrete AGH work session. It is essentially the agent's own commit log of decisions and verification evidence.

## Timeline of Major Workstreams

### Week 1 (Apr 6–7) — Workspace Entity + refac-v2 foundation

The opening burst of activity is dominated by the **workspace-entity** PRD execution (`workspace-resolver`, `workspace-store`, `workspace-types`, `session-workspace`, `udsapi-workspace-mirror`, `web-workspace-ui`, `cli-workspace-session`, `acp-additional-dirs`, `config-workspace-loading`, `daemon-dreams`, `observe-memory-workspace`). This was the introduction of `internal/workspace` as a first-class entity with mtime/size cache invalidation, store-backed CRUD, and resolver-aligned `AdditionalDirs` propagation through ACP `session/new` and `session/load`. In parallel Pedro launched **refac-v2** — a broad package-graph reorganization (`internal/api/contract` extraction, `internal/store/sessiondb` + `globaldb` split, oversized-file splits in `daemon`, `session`, `store`, `workspace`, `udsapi`, helper extraction into `internal/procutil`, `internal/fileutil`, `internal/testutil`). The `refac-v2-techspec` ledger captures the conscious choice for **broad reorganization with same-phase bridge removal** rather than incremental path-preserving refactor. Apr 7 added marketplace-CLI/client/config plumbing, hookrunner dispatch, MCP hooks integration, and skill types — most of which got rolled into later layers.

### Apr 8 — RFC: AGORA → AGH Network

A sharp pivot to **protocol design**: `agora-rfc.md`, `agent-network-rfc.md`, `ai-harness-research.md`. The protocol was renamed from AGORA to **AGH Network**, restructured as "transport-agnostic core + normative NATS profile + Baseline Trust Profile". The KB-driven research used `qmd` + obsidian-cli + delegated subagent reviewers. This is the first appearance of the now-strategic "network protocol" framing.

### Apr 9 — Lifecycle Hooks system

`lifecycle-hooks-spec`, `hook-dispatch`, `hooks-config`, `hooks-observability`, `hooks-resolution`, `hooks-struct`, `hooks-taxonomy`, `session-hook-dispatch`, `skill-progressive-disclosure`, `skills-hook-migration`, `stop-classification`, `wire-hooks-daemon`, plus `data-layer-propagation`. A complete hook subsystem (`coordinator.*`, `task.run.*`, `spawn.*`, `tool.*`, `permission.*`, `session.*`) with dual-mode dispatch (sync/async), typed patches, fail-open default + `required` opt-in fail-closed, dotted naming. Also `pr10-coderabbit` + `pr10-review-fix` (first big CodeRabbit cycle). Skills shifted to **progressive disclosure**: metadata loaded eagerly, body content fetched lazily on click — fixed a real perf bug.

### Apr 10 — Network creation, extension architecture, session repair

`agh-network-create-tasks`, `agh-network-pattern-review`, `agh-network-techspec-review`, `channel-adapters-tasks` (later renamed to bridges), `daemon-extension-boot`, `extension-cli`, `extension-manifest`, `extension-registry`, `extension-sdk`, `ext-architecture`, `ext-protocol`, `harness-doc-research`, `host-api-handler`, `mcp-sidecars`, `pr11-review-fix`, `reference-extensions`, `session-chat-repair`, `session-resume-repair`, `tool-foundation`, `web-shell-workspaces`. The longest day in the ledger (26 entries). Includes the **session-chat-repair** incident — stale `starting`/`active` ghost sessions were exposing the composer in the web UI; root cause was "transitional metadata for inactive sessions". Fix: normalize stale meta + clear stale ACP session id + tighten web route guard.

### Apr 13 — Channel/space rename hard-cut + Paperclip analysis

`network-rename-plan` made two synchronized renames: `channels → bridges` (external messaging adapters) and `space → channel` (network namespace). Greenfield-alpha posture: **no compatibility shims, no aliases, no migration code** — direct table/column/payload rename. Also `core-tasks-techspec`, `goclaw-analysis`, `paperclip-analysis`, `network-pages`, `network-review-fix` (three reviewed network regressions: inbound remote-message authorship, ghost channels from rolled-back sessions, dialog showing global instead of workspace-scoped agents).

### Apr 14–15 — Extension gaps QA + Lint cleanup + Extensibility-parity techspec

Apr 14: `extgaps-qa` validated extension bundle runtime/persistence end-to-end and surfaced `BUG-007` (missing `extension_name` in bundle activation bridge payloads). Apr 15 was a **massive lint pass** (`fix-lint`, `api-lint`, `bridge-lint-comms`, `cli-lint`, `core-lint-assigned`, `lint-registry-extension-store`, `bridge-lint-assigned`, `store-registry-workspace-lint`) — root-cause cleanup, not suppressions. Concurrently `extensibility-techspec` (massive deliberation: typed `Store[T]`, `KindCodec[T]`, `TypedProjector[T]`, `MutationActor`, `ReconcileDriver`, `SourceVersion`, `SessionNonce`, three council passes before approval) and `tool-ui-reviews`, `gc-ref-techspec-review`, `sandbox-techspec-review`, `extensibility-comparison`.

### Apr 16 — Daytona, e2e harness, Playwright

Cherry-picked the Daytona Sandbox runtime fix from `ext-refac` to `pn/ext`. Added `internal/testutil/acpmock` driver, `internal/testutil/e2e` runtime harness, Playwright harness (`web/e2e`), browser-session-lifecycle, automation-task-e2e, network-collab-e2e, runtime-sandbox-e2e, transport-parity-e2e. Embedded web assets must be daemon-served, not Vite — explicit validation that the served HTML is daemon-hosted.

### Apr 17 — Big day: 32 entries

The largest day in the ledger by file count. `e2e-confidence-hardening` introduced **structured ACP prompt metadata as the routing contract for acpmock** — replacing fragile string-matching of rendered prompts with explicit metadata. Plus `e2e-rebase`, `e2e-review-fix`, `e2e-review-r3`, `harness-hermes-research`, `harness-seams`, `harness-techspec`, `hermes-policy-scan`, `mem-improvs-exec`/`-qa`/`-r3`, `memory-branch-audit`, `memory-standard-upgrade`, `nightly-e2e-followup`, `openclaw-harness`, `openfang-harness`, `paper-web-layout`, `pr35-ci-fix`, `settings-ui-analysis/-techspec/-qa-tasks`, `site-code-block`, `task-read-models`, `tasks-ui-analysis/-techspec`, `ci-release-audit`, `claude-code-modes`, `competitor-memory`, `e2e-lane-wiring`. The CI/release audit aligned `agh` with the canonical **looper / pr-release / compozy** Go-repo templates.

### Apr 18–19 — Documentation/storybook lulls

`agent-capabilities-spec`, `storybook-route-stories`, `cli-reference-audit`, `runtime-advanced-docs-audit`. Brief slow days.

### Apr 20 — Capabilities, prompt stall fix, CI fix

`capability-semantics`, `discovery-contracts`, `rfc-runtime-capabilities`, `unified-capabilities-qa`, `task-10-unified-qa`, `tasks-route-stories`, `prompt-stream-stall` (a serious bug: the prompt stream closed at the first `tool_call`; root causes were HTTP request lifetime tied to prompt execution, missing `tool-input-available` SDK framing, web stop using transport abort instead of an explicit cancel endpoint, and metadata repair classifying `m.pending` startups as crashed), `session-chat-hardening`, `session-creation-feedback`, `session-driver-override`, `workspace-menu-hardcut`, `harnss-chat-patterns`, `daemon-harness-lane`, `openapi-codegen` (parallel `compozy-daemon` browser contract added without replacing `agh.json`), `ci-errors-fix`, `fix-ci-pr48` (long log: `goconst` for `"warn"` literal, then `act`-revealed Linux race issues in `internal/session.StopWithCause`, `internal/resources` reconcile timeout, `internal/acp` stop terminating wrapped process tree, `internal/hooks` subprocess-execute-kills-descendants), `pr48-ci-path-filter` (`dorny/paths-filter@v3` runner-side download instability replaced by inline git-based change detection).

### Apr 21 — ACP supervision, assistant-ui, session provider

`acp-supervision` durably persists `subprocess_pid`, `subprocess_started_at`, `last_update_at`, `stall_state`, `stall_reason` through `store.SessionMeta`. Windows forced-exit fallbacks added; Unix process-group supervision retained. `assistant-ui` migration restored persisted session history through a remote thread-list adapter. `session-provider-contracts/-migration/-persistence/-qa-plan/-qa`, `workspace-provider-catalog`.

### Apr 22–23 — Brand showcase + rebase

A single ledger on Apr 22 (`brand-showcase`) using image generation skills against `DESIGN.md`. Apr 23: `rebase-main` and a re-execution of `session-driver-override`.

### Apr 24 — Hermes hardening

`hermes-techspec`, `hermes-lifecycle-hardening`, `hermes-observability`, `hermes-persistence-retry`, `landing-page-redesign`, `long-running-sessions`, `network-docs`, `release-adjustments-batch`, `release-adjustments-reviews`, `release-hermes-qa`, `release-openclaw-qa`, `release-smoke`, `runtime-core-illustration`, `shared-logo`, `site-bento-grid`, `site-bento-image`, `site-skill-illustration`, `tool-process-registry`, `daemon-session-illustrations`, `durable-scheduler` (durable cursor in `automation_scheduler_state` with pre-dispatch advancement, `skip_missed` boot reconciliation, delivery-error separation), `everything-cards`. Hermes is the umbrella for **MCP OAuth 2.1 + PKCE auth subsystem, durable migrations, ACP lifecycle failure classification with redacted bounded crash bundles, scheduler durability, memory health/history**.

### Apr 25 — Hermes QA + autonomous techspec

`hermes-qa-execution` (BUG-001 through BUG-007 — remote MCP TOML overlay, memory_operation_log schema, site landing test drift, HTTP prompt drain cancel, CLI session list TOON header, reference extension SDK symlink, automation edit dialog route remount). `mcp-auth-security`, `memory-visibility`, `automation-qa-guide`, `autonomous-analysis`, `autonomous-techspec` (massive: 18-task autonomy MVP — Situation Surface, Agent Kernel CLI, Task Claim+Lease, deterministic scheduler, safe spawn, network, memory, observability, eval/replay; multi-round Opus reviews; coordinator vs scheduler authority resolved with claim-as-only-authoritative-primitive). `network-tasks-qa`, `paperclip-analysis`, `release-startup-qa`, `runtime-overview-storyboards`, `site-hardening`, `cli-config-setup`, `docs-storyboards`, `hermes-task-09`, `hermes-review-021-031`, `hermes-review-fixes`, `hermes-round2-reviews`.

### Apr 26 — Autonomous task execution

The closing day: 21 ledgers, all autonomy. `autonomy-config`, `agent-caller-identity`, `agent-contract-dtos`, `agent-self-channel-verbs`, `autonomous-real-qa`, `autonomous-review`, `autonomous-reviews`, `autonomy-hooks-bridge`, `autonomy-qa-execution`, `autonomy-qa-plan`, `coordinator-bootstrap`, `mechanical-scheduler`, `qa-review`, `real-scenario-qa-skill`, `runtime-autonomy-docs`, `safe-spawn`, `session-lineage`, `situation-providers`, `task-09-agent-task-lease`, `task-10-execution-boundary`, `task-claim-lease`. Tasks 01–18 of the autonomous PRD all land, including the QA execution that produced BUG-001 (web E2E workspace onboarding race), BUG-002 (acpmock fixture exact-match canonicalization for situation-augmented prompts), and BUG-003 (Tasks browser E2E asserting wrong panel state). Final commit on the `autonomous` branch: `dcb89534 test: complete autonomy qa execution`.

## Recurring Decision Tensions

These are decisions that were revisited multiple times — strong indicators of architectural ambiguity that the project worked through:

### 1. Scheduler authority vs coordinator-agent authority

Re-litigated at least three times in the autonomous techspec ledger alone. Round 1: combined model. Round 2 (Opus review): **MVP scheduler is sweep/notify/recovery only; `ClaimNextRun` is the sole authoritative next-work primitive**. Round 3 (Paperclip cross-check): confirmed. The tension was whether agents pull or scheduler pushes — resolved decisively in favor of agent-pull, with the scheduler as a courteous waker.

### 2. Coordinator spawn trigger

First answer: "spawn on first work". Then refined to "spawn on task start/approval, not on creation" once the user clarified that creation is intent-only. Then refined again to "global-scope runs do not auto-spawn in MVP". Three iterations to lock down.

### 3. Hook taxonomy scope

Original spec: 6 events. After comparing Pi (`session_start`, `before_agent_start`, etc.), Hermes (`pre_llm_call`, `on_session_finalize`, etc.), Claude Code (25+ events), GoClaw (typed function hooks), the user explicitly said the TechSpec must be "robust enough" → a much larger taxonomy with `coordinator.*`, `task.run.*`, `spawn.*`, `tool.*`, `permission.*`, `session.*`. **No `autonomy.*` umbrella, no `workflow.*` family**. Scheduler hooks were demoted to metrics/logs in MVP.

### 4. Where shared API DTOs live

`internal/apicore` vs `internal/api/contract` vs duplicated across `internal/cli/client.go`. Decided in `refac-v2-techspec`: `internal/api/contract` is the canonical shared DTO package, separate from `api/core`. Subsequently `cli-contract-migration` and `api-contract-codegen` worked through the consequences.

### 5. Bundle activation projector handling

The "mixed-kind outlier" in extensibility-parity. After tightening `TypedProjector[T]` semantics, the team explicitly chose to handle `bundle.activation` with **package-local projector adapters** rather than over-generalizing the typed contract. ADR-008 captures this.

### 6. Test-only methods in production code

`testing-anti-patterns` skill is invoked many times specifically because the impulse keeps recurring. CodeRabbit reviewers also pushed for `t.Parallel()` repeatedly even when `t.Setenv` made it incorrect — Pedro's standard rejected those as INVALID with rationale.

### 7. Channel naming collision

`channel` overloaded between (a) external messaging adapters (Slack/Telegram/etc.) and (b) AGH Network namespace. `network-rename-plan` resolved this with a hard-cut: external → `bridge`, network → `channel`. No dual-naming, no aliases.

### 8. Web/site co-ship discipline

Repeatedly re-decided: when a backend task changes contracts, must `make codegen` regenerate web types? When must web fixtures/tests update? Hermes Task 5 surfaced this: first `make verify` failed in web typecheck because settings MCP fixtures didn't carry the new `transport` field. ADR-011 in autonomous techspec finally codified it: contract-changing steps must run generated OpenAPI/web type updates with web checks.

### 9. ACP terminal/process-tree supervision on Windows

Multiple times Windows-specific code paths had to be added (`internal/acp/process_tree_windows.go`, `internal/subprocess/signals_unix.go`, `process_group_unix.go`) after Linux-only logic was discovered. Workflow: cross-build with `GOOS=windows GOARCH=amd64` was added to verification.

## CodeRabbit / Reviewer Patterns

Across the PR review ledgers (`pr5-coderabbit`, `pr10-coderabbit`, `pr10-review-fix`, `pr11-review-fix`, `review-issues`, `review-round`, `current-review`, `extgaps-review`, `web-pages-reviews`, `tool-ui-reviews`, `core-tasks-review`, `agh-network-pattern-review`, `agh-network-techspec-review`, `qa-review`, `autonomous-review`, `autonomous-reviews`, `hermes-review-021-031`, `hermes-review-fixes`, `hermes-round2-reviews`, `release-adjustments-reviews`, `mem-improvs-r3`, `e2e-review-fix`, `e2e-review-r3`), the same flags repeat:

### Repeatedly flagged (and Pedro accepts as VALID)

- **Missing `errors.Is` / `errors.As`** — string error matching is consistently flagged. `mem-improvs-r3` issue 004 required adding a sentinel in `magefile.go` so `errors.As` could be used.
- **`rows.Close()` defer without error handling justification** — flagged in `mem-improvs-r3` issue 001.
- **Missing context propagation** — `noctx` was a top-3 lint category in `api-lint` (92 → 13 → 2 issues, with `noctx` cleared in pass 1).
- **Body-not-drained on HTTP responses** (`bodyclose`, `errcheck`).
- **Repeated string literals → goconst** — caught repeatedly in `internal/observe/tasks.go` (`"warn"`, `"ok"`), `internal/cli/lifecycle.go` (lifecycle status strings), boolean rendering in CLI.
- **Pointer vs value receiver / hugeParam** — large structs being copied by value in handler config (`core.NewBaseHandlers`, `httpapi.newHandlers`, `udsapi.newHandlers`).
- **Function length / cyclomatic complexity** (`funlen`, `gocyclo`) — repeatedly required splitting large handlers and constructors.
- **`t.Run("Should ...")` subtest naming** — turned up across many batches; tests refactored from monolithic to table-driven with `Should X` subtests.
- **Missing `t.Parallel()`** — flagged often, but Pedro's decision rule is firm: **decline if the test uses `t.Setenv` directly or transitively**. This rejection has been documented multiple times (e.g., `pr10-coderabbit` keeps `TestHooksConcurrentRebuildAndDispatch` serial because parallel execution amplified an unrelated flake under `make verify`).
- **OpenAPI / web type drift** — when backend changes contracts, generated `web/src/generated/agh-openapi.d.ts` or `compozy-openapi.d.ts` is checked for drift; `make codegen-check` is the gate.
- **Unredacted secrets in logs/payloads** — MCP auth tokens, OAuth codes, PKCE verifiers, claim tokens, secret bindings. Hermes Task 5 fully formalized redaction; autonomy added "Reject raw `claim_token` from lease complete/fail result metadata in task-domain validation".
- **Symlink escape hardening** — skill sidecars, skill files, skill-directory hashing, managed-extension dependency copying. `mcp-auth-security` ledger added this as part of Task 5.

### Repeatedly flagged but marked INVALID by Pedro (with rationale)

- **`t.Parallel()` on env-mutating tests** — Go forbids this; declined.
- **DTO decoupling refactors that are architectural, not correctness** — declined unless proven a real defect.
- **Hash-based fingerprint rewrites** (premature optimization).
- **Optimistic update suggestions** when no rollback-safe state exists in UI (e.g., `useTestBridgeDelivery`).
- **Stop-metadata clearing during activation** — `pr11` issue 007 was rejected because resume repair intentionally preserves crash classification.
- **Style-only suggestions that would force brittle assertions** — declined in `e2e-review-fix`.

### Pedro's review process

Triage every issue technically against current `HEAD` before editing code. Mark VALID/INVALID with concrete reasoning. Use the local export workflow (`.tmp/pr-review-env`, `bunx tsx`) — **not** the skill's `pnpm exec tsx` (Bun-configured repo). One commit per remediation batch; `make verify` before AND after the commit. Resolve GitHub threads via `resolve_pr_issues.sh` not provider-specific scripts.

## Refactor / Cleanup Patterns

These recur often enough to suggest the codebase has habitual blind spots that need codified rules:

### 1. Oversized files repeatedly need splitting

`refac/task_02` enumerated seven files exceeding the implicit budget: `internal/store/store.go`, `internal/store/schema.go`, `internal/store/global_db.go`, `internal/workspace/resolver.go`, `internal/session/manager.go`, `internal/daemon/daemon.go`, `internal/udsapi/handlers.go`. Each got mechanically reorganized into focused same-package files. **Recurrent triggers**: `internal/acp/handlers.go` (735 LOC), `internal/acp/permission.go` (546 LOC), `internal/cli/skill.go` (917 LOC), `internal/config/config.go` (511 LOC), `internal/store/migrate_workspace.go` (586 LOC).

### 2. Helper duplication across packages

`refac/task_01` found inlined helpers in `daemon`, `cli`, `memory`, `store`, `config`, `session`, `skills`, `udsapi`. The fix: extract into `internal/procutil`, `internal/fileutil`, `internal/testutil`. Specific repeated duplications: session activation helpers, ACP permission events, store validation/ready guards, raw JSON clone helpers, file snapshots, CLI list bundles. Frontmatter parsers were duplicated across `internal/config`, `internal/skills`, `internal/memory` — `internal/frontmatter` was carved out.

### 3. Cross-package back-pointers / cycles

The hooks ledger explicitly notes: "Keep `session.Notifier.OnAgentEvent` payload-agnostic (`any`) and downcast in upper layers to avoid the `config -> hooks -> acp -> config` cycle introduced by config-based hook declarations." Cycles are repeatedly avoided via interface-at-consumer + payload-agnostic notifier.

### 4. Bridge/shim removal post-cutover

ADR-004 of `refac-v2` mandates "phased cutovers with same-phase bridge removal". `refac-v2/task_09` (the convergence task) deletes `internal/api/httpapi/shared.go` and `internal/api/udsapi/shared.go` — bridge layers that existed only to ease the transition. The greenfield-alpha rule meant they were removed instead of preserved.

### 5. Test helpers leaking into production

Pedro is consistent: production code never has test-only methods. When a real bug is uncovered (e.g., race in version override serialization in `session-chat-repair`), the fix is to separate override serialization from runtime reads in `internal/version` — not to add a test hook.

### 6. Status string constants

`taskHealthStatusWarn`, lifecycle status constants, etc., keep getting introduced after `goconst` flags. The pattern keeps repeating in new code.

### 7. Run-everything-then-fix-fallout cycle

Almost every `cy-execute-task` ledger reports the same shape: implementation → focused tests pass → `make verify` fails on something distant → fix the distant cleanup race / lint finding / regenerated contract drift → rerun. Examples: `internal/extension TestManagerDisablesExtensionAfterConsecutiveFailures` cleanup-race fix during Task 08 claim/lease work; `internal/session TestPromptActivitySupervisorTimeoutCancelsThenStopsSession` race during Hermes Task 03; `internal/session TestStopWithCauseLifecycle/ShouldWaitForPostStopDispatchWhenWatcherFinalizesFirst` during PR 48 CI fix.

## "Burned By" Moments

Specific incidents where something concrete broke and a durable lesson was extracted:

### Prompt stream stall on first tool call (Apr 20)

Reported as "prompt closes at first tool_call". Four root causes compounded: HTTP request lifetime tied to prompt execution; HTTP stream missing AI SDK v6 `tool-input-available` framing; web stop using transport abort instead of explicit cancel; metadata repair classifying `m.pending` startups as crashed. Lesson: detach prompt execution from request lifetime via `context.WithoutCancel(...)`; expose explicit `POST /api/sessions/:id/prompt/cancel`; treat startup-pending as still-starting in repair classifier.

### Session chat repair (Apr 10) — ghost sessions

Stale half-started sessions were leaving `state: "starting"` in metadata; web exposed composer for non-active sessions; `POST /api/sessions/:id/resume` returned 500 because ACP `session/load` failed `Resource not found` for a stale ACP session id. Lesson: normalize stale transitional metadata; convert missing upstream ACP sessions into a fresh start; tighten web routes to render composer only for truly-active sessions.

### CGO race flag in CI (Apr 17, PR 35)

`make verify` ran under `CGO_ENABLED=0` but `magefile.go` ran `go test -race`. Race requires cgo. The fix was structural: a `runRaceEnabledGoCommand` helper that clones caller env and forces `CGO_ENABLED=1` only for race-enabled subprocesses. **Lesson**: race-enabled paths must self-manage cgo; don't trust ambient env.

### `dorny/paths-filter@v3` runner instability (Apr 20, PR 48)

External CI action's setup phase could not complete on GitHub Actions runners. **Lesson**: replace third-party actions with repo-owned shell logic — explicit git-based change detection in `.github/workflows/ci.yml`. The repo now controls its own change-filter logic.

### Visual snapshot CI mismatch (Apr 20)

Linux runners expected `*-chromium-linux.png`; repo only committed `*-chromium-darwin.png`. Pedro chose **full removal of visual-snapshot infra** rather than seeding Linux baselines. Lesson recorded in `ci-errors-fix` ledger.

### ACP `Resource not found` for stale session ids (Apr 10)

`session/load` against a missing upstream resource was a hard 500 with cryptic ACP error. **Lesson**: classify the ACP error explicitly and convert to a fresh start fallback; restore failed resume attempts back to stopped metadata instead of leaking `starting`.

### Test asset missing on branch (Apr 17)

`internal/testutil/acpmock/driver/dist/index.js` was missing on the `e2e` branch, preventing `make verify` from passing. Pedro held the e2e batch commit and reported the verified blocker rather than commit anyway. **Lesson**: clean verification is a commit gate, not a recommendation.

### Web E2E workspace onboarding race (Apr 26, BUG-001 autonomous QA)

Playwright failures on `TC-AUTO-015` due to absence of a shared workspace-onboarding wait helper. Fix: `web/e2e/fixtures/selectors.ts` shared wait helper; updated stale session-create flow.

### Acpmock exact-match canonicalization (Apr 26, BUG-002 autonomous QA)

Situation-augmented prompts (added by `internal/situation`) broke acpmock fixture exact-match because the prompt rendered with extra context. Fix: canonicalize situation-augmented prompts back to user turn before matching.

### Memory `_operation_log` schema drift (Apr 25, Hermes BUG-002)

Fresh daemon DBs had legacy `memory_operation_log` without `scope`, `workspace_root`, `filename`, causing `agh memory write` to fail. Schema migration v6 was added. **Lesson**: schema changes need explicit migrations even on fresh DBs.

### Remote MCP TOML overlay rejecting documented fields (Apr 25, Hermes BUG-001)

`transport`, `url`, `auth.*` were rejected as unknown keys despite being documented. Root cause: `internal/config/merge.go` didn't decode them. **Lesson**: documented config fields require explicit overlay merge support; cover with `TestLoadSupportsRemoteMCPAuthFieldsInTOML`.

### App-route motion key on mutable `router.latestLocation` (Apr 25, Hermes BUG-007)

Caused a delayed `/` to `/jobs` remount that dropped automation editor state. Fix: route keying to reactive `useLocation` and route-shell regression coverage.

### Subprocess health-monitor lifecycle race (Apr 15, fix-lint)

Stop/done channels were shared between runs. Fix: each run gets immutable stop/done channel ownership.

### Extension cleanup race on disable (Apr 26, Task 08)

`internal/extension.Manager.disableExtension` persisted disable state before unregistering runtime resources. Reordered: unregister first, then persist. Test: `go test ./internal/extension -run TestManagerDisablesExtensionAfterConsecutiveFailures -count=10`.

### Resource reconcile timeout propagation (Apr 20, PR 48)

Projector `Build/Apply` contexts were spending the deadline inside raw-store reads instead of the projector itself. Fix: scope the timeout to projector work specifically.

### `internal/session.StopWithCause` watcher-race finalization (Apr 20, PR 48)

After session removal from active map, in-flight watcher-owned finalization was lost. Fix: `StopWithCause` waits on in-flight finalization even after removal.

### `act` exposing Linux-only race issues (Apr 20)

Repos passing `make verify` on macOS were failing on Linux/race in `internal/session`, `internal/resources`, `internal/acp`, `internal/hooks`. **Lesson**: `act workflow_dispatch -W .github/workflows/ci.yml -j verify --container-architecture linux/amd64` is the local repro for Linux race environments, and `internal/procutil/process_group_unix.go` centralizes Unix signaling.

### `test/release_config_test.go` deletion

Pedro explicitly told the agent **not** to add a regression test for config/workflow files. Per his own ledger note: "user explicitly chose to remove the visual snapshot flows entirely, including local tooling and committed baselines" and "Removi a suíte `test/release_config_test.go` depois do feedback explícito do usuário contra teste de regressão de config." **Lesson**: not every breakage needs a regression test; sometimes config drift is detected by the gate itself.

## Skill Candidates

The ledger reveals skills that the workflow keeps reinventing or that would help future automation:

1. **`acp-error-classify`** — classify ACP errors (especially `Resource not found`) and propose fresh-start fallbacks. Currently embedded in `internal/acp/client.go` ad hoc.
2. **`schema-migration-author`** — detect when a config field, store column, or DB index needs a migration. Hermes Task 1 + Hermes BUG-002 + Task 12 (lineage migration v8) all revisited this; a skill would standardize migration numbering, idempotence, transactional wrap, and `schema_migrations` recording.
3. **`opensapi-codegen-driver`** — encode "regenerate `make codegen` after backend contract changes" as a checked rule. Hermes Task 3 / Task 5 / autonomous Task 10 each had to discover this anew.
4. **`act-linux-repro`** — wrap the `act --container-architecture linux/amd64 -j verify` reproduction loop as a skill. Pedro used it manually multiple times.
5. **`secret-redaction-audit`** — verify that no MCP auth tokens, OAuth codes, PKCE verifiers, claim tokens, or secret bindings appear in logs, error payloads, settings views, status APIs. Hermes Task 5 + autonomous Task 9 codified the patterns; the audit could be a checklist skill.
6. **`symlink-escape-hardening`** — verify skill sidecar / managed extension copy paths don't follow symlinks outside approved roots. The Hermes review batch repeatedly surfaced this.
7. **`process-group-supervision`** — Windows + Unix parity for process tree termination. The pattern is now centralized in `internal/procutil` but a skill would prevent regression.
8. **`bridge-removal-discipline`** — given the greenfield-alpha rule, a skill that detects "bridge file with no callers" and proposes removal would close `refac-v2`-like gaps automatically.
9. **`ledger-driven-progress`** — the ledger format itself (Goal/Constraints/Decisions/State/Done/Now/Next) is a strong pattern. It's already implicit in `cy-workflow-memory` but could be promoted as the canonical format.
10. **`ci-third-party-action-replacer`** — when an external Action fails on setup, prefer inline shell logic. Manual lesson; could be skillified.

## Lesson-Learned Candidates

Concrete incidents worth preserving outside the ledger:

- **HTTP request lifetime ≠ prompt execution lifetime.** Detach via `context.WithoutCancel(...)` and expose explicit cancel endpoints. (prompt-stream-stall)
- **Generated artifacts must be checked, not assumed.** `make codegen-check` is mandatory after any contract change; web typecheck is a separate failure surface. (multiple Hermes/autonomous tasks)
- **`t.Parallel()` is incompatible with `t.Setenv`.** Always reject reviewer suggestions to add it to env-mutating tests. (pr10/pr11/hermes-round2)
- **Race-enabled tests need their own cgo env management.** Don't trust ambient `CGO_ENABLED`. (PR 35 CI fix)
- **Replace third-party CI actions with shell logic** when their setup fails on runners. (PR 48 path-filter fix)
- **Branch-side test assets break clean verification.** The `internal/testutil/acpmock/driver/dist/index.js` blocker meant the e2e batch couldn't commit. (e2e-review-fix)
- **Schema migrations are required even on fresh DBs.** Document schema explicitly in migration runner; don't implicitly rely on table create. (hermes-qa-execution / Task 1)
- **Stale ACP session ids must be classified, not propagated.** Convert "Resource not found" to fresh-start fallback. (session-chat-repair)
- **Inactive metadata repair must not classify `m.pending` startups as crashed.** Treat startup-pending as still-starting. (prompt-stream-stall)
- **Crash bundles must be bounded and redacted.** Hermes Task 3 codified this; it's a security + retention concern.
- **Process-group supervision needs Windows fallbacks at compile time.** Cross-build with `GOOS=windows` is a mandatory verification step. (acp-supervision)
- **OAuth loopback redirects must validate localhost/loopback hosts.** Self-review tightening in mcp-auth-security caught this.
- **Web fixtures, types, tests must update in lockstep with backend contract.** First `make verify` failed in web typecheck because settings MCP fixtures didn't carry new `transport` field. (mcp-auth-security)
- **Test failures during execution are production bugs, not test issues.** Fix production code, not the test. Repeatedly stated across `cy-execute-task` ledgers.
- **Renames must be hard-cuts, not aliases, in greenfield alpha.** `network-rename-plan` is the canonical example.
- **One commit per remediation batch.** `cy-fix-reviews` rule. `make verify` before and after the commit.
- **Don't commit `ai-docs/`.** Ad-hoc local export staging area only.
- **Don't commit `.compozy/tasks/*/memory/` files in code commits.** Tracking is local; code is committed.

## System Prompt Candidates for CLAUDE.md

Rules implied by the ledger but not yet captured in `CLAUDE.md`:

1. **"Detached execution lifetime: any work that outlives an HTTP/UDS request — prompts, network channel sends, automation jobs — MUST detach via `context.WithoutCancel(...)`. Never tie execution lifetime to request lifetime. Expose explicit cancel endpoints for these flows."**

2. **"Schema migrations are mandatory. Any new config field, store column, or DB index requires a numbered migration in `internal/store.RunMigrations`. Document schema_migrations rows. Test fresh-DB and reopen-after-restart paths."**

3. **"Race-enabled tests must self-manage `CGO_ENABLED=1`. Verification commands that wrap `go test -race` go through `runRaceEnabledGoCommand` (or equivalent). Don't trust ambient env."**

4. **"Linux-Race CI parity: before claiming `make verify` complete, run `act workflow_dispatch -W .github/workflows/ci.yml -j verify --container-architecture linux/amd64` for race-sensitive packages (`internal/session`, `internal/acp`, `internal/hooks`, `internal/subprocess`, `internal/resources`)."**

5. **"Generated artifacts are part of the contract. After any change to `openapi/agh.json`, `openapi/compozy-daemon.json`, or any DTO, run `make codegen` AND verify `make codegen-check` AND web typecheck. Web fixtures and tests must update in lockstep."**

6. **"Secret redaction is non-negotiable. MCP auth tokens, OAuth codes, PKCE verifiers, claim tokens (`agh_claim_*`), and secret bindings must NEVER appear in logs, status APIs, settings views, or error payloads. Add redaction tests for every new path that handles them. Reject raw `claim_token` from result metadata in domain validation."**

7. **"Symlink escape hardening: skill sidecars, skill files, managed-extension dependency copies, and bundle install paths must verify resolved targets remain inside approved roots. Use `EvalSymlinks` + path-prefix check, not naive joins."**

8. **"Process-group supervision parity: Unix uses process groups; Windows uses forced-exit fallback. Always cross-build with `GOOS=windows GOARCH=amd64 go build` before claiming subprocess work complete. Centralize signaling helpers in `internal/procutil`."**

9. **"Reviewer suggestions are not commands. Triage every CodeRabbit / reviewer item against current `HEAD` before editing. Mark VALID with rationale or INVALID with technical evidence. Specifically reject `t.Parallel()` on env-mutating tests."**

10. **"One commit per remediation batch. `make verify` BEFORE and AFTER the commit. Never `git commit --amend` after pre-commit hook failures — fix and create a new commit."**

11. **"Ledger maintenance during sessions: read existing ledger files for cross-agent awareness before starting; create a session ledger when working on a multi-step task; update Done/Now/Next as work progresses."**

12. **"Inactive session metadata repair must distinguish startup-pending from crashed. Sessions in `m.pending` are still starting, not failed."**

13. **"Greenfield-alpha rename discipline: when renaming a concept, do a hard cut. No dual-naming, no aliases, no legacy fields. Update specs, RFCs, ADRs in the same pass. Keep storage tables/columns at final names."**

14. **"Don't commit `ai-docs/`, `.tmp/`, or `.compozy/tasks/*/memory/`. Code commits include code, tests, generated artifacts, and scoped review issue files only. Tracking artifacts stay local unstaged."**

15. **"`make verify` is the commit gate. If verification is blocked by an external/branch-side asset issue (missing test fixture, etc.), do NOT commit. Report the verified blocker and hold."**

16. **"Test failures uncovered by verification are production bugs, not test issues. Fix production code; don't weaken assertions. The only exception is documenting an INVALID review item with concrete evidence."**

17. **"Replace fragile string-matching in test routing with structured metadata. ACP prompt routing in acpmock uses typed prompt metadata, not rendered prompt substrings."**

## Cross-Cutting Concerns

Themes that span many ledger files:

### `make verify` as the universal gate

The phrase appears in every single execution ledger. It is invoked before commits, after commits, after rebases, after CI fixes, after lint cleanup. The full sequence is canonical: web format → web lint → web typecheck → web tests → web build → Go lint (`0 issues`) → Go race-enabled tests → Go build → package-boundary check (`OK: all package boundaries respected`).

### Test count as health metric

Test counts are tracked obsessively as a quality signal: 749 (Apr 6 acp-additional-dirs) → 815 (Apr 6 pr5-coderabbit) → 853 (refac task_02) → 962 (refac-v2 task_09) → 1522 web tests + 5457 Go tests (prompt-stream-stall) → 5743 (hermes techspec) → 5790 (Hermes Task 03) → 5810 (Hermes Task 05) → 5896 (Hermes review batch) → 5950 (autonomous techspec) → 6041 (autonomous Task 04) → 6193 (autonomous Task 10) → 6202 (autonomous Task 11) → 6257 (autonomous Task 13) → 6302 (autonomous review round 001). The trajectory itself is testimony to test-driven discipline.

### Coverage targets

80% per package is the unwritten floor. Many ledgers explicitly report coverage: `internal/workspace 80.3%`, `internal/session 81.6%`, `internal/agentidentity 94.6%`, `internal/coordinator 86.7%`, `internal/scheduler 86.5%`, `internal/situation 81.2%`. When a touched package falls below, additional tests are added before completion.

### Workflow memory + task tracking discipline

Every PRD execution follows the pattern: read `.compozy/tasks/<name>/memory/MEMORY.md` and `task_NN.md` before edits; update them before completion; **leave them unstaged in the code commit**. The split is tight: production code commits contain production + tests + generated artifacts only; tracking is local.

### Sub-agent delegation policy

Delegated sub-agents are **not allowed unless explicitly requested by the user**. Multiple ledgers explicitly note: "Delegated sub-agents are not allowed unless explicitly requested by the user, so codebase exploration is local." When delegation is approved (e.g., explorer subagents for Paperclip/Multica/Hermes/Pi analysis, or council-style multi-advisor reviews via Opus), it is loud and explicit.

### Brazilian Portuguese vs English

Some ledgers (`ci-release-audit`, `landing-page-redesign`, others) are partly in Brazilian Portuguese reflecting the user's preference: "User preference: conversation in Brazilian Portuguese; generated artifacts stay in English." The artifacts (TechSpecs, ADRs, code, commit messages) are always English.

### `qmd` + obsidian-cli + `kb` for knowledge-base navigation

External knowledge access is explicitly local: `~/dev/knowledge/agent-networks`, `~/dev/knowledge/ai-harness`, `~/dev/knowledge/paperclip`. `qmd` is the primary search tool. **`qmd query` semantic mode crashes locally due to a missing SQLite `vec0` module on Bun**, so the fallback is `qmd search` + `qmd get` lexical mode. Web search is reserved for genuinely external research.

### Opus / GPT-5.4 mini / Council reviews

For high-impact specs, multiple LLM passes are used: `compozy exec --ide claude --model opus --timeout 30m --prompt-file ...` for techspec critique, plus 2–3 GPT-5.4 mini explorer subagents for codebase mapping or competitor analysis. The autonomous techspec went through Opus rounds 1, 2, and a web/site impact research round.

### Persistent local plans

`.codex/plans/` stores accepted implementation plans before code work starts. Examples: `.codex/plans/2026-04-17-e2e-confidence-hardening.md`, `.codex/plans/2026-04-20-prompt-stream-stall.md`, `.codex/plans/2026-04-25-site-hardening.md`. The plan is persisted so the agent can refer back during multi-turn execution.

### Hermes BUG-001..BUG-007 as quality benchmark

The Hermes QA pass found 7 distinct production bugs across MCP overlay, memory schema, site landing test drift, HTTP prompt drain cancel, CLI TOON header, reference extension symlink, and automation route remount. This is the most concentrated bug-discovery yield in the ledger — a strong signal that real-scenario QA (under isolated `AGH_HOME`) catches things make verify can't.

### `agh-network` rename arc

Originally `AGORA`, then `AGH Network`. The protocol/project name was deliberately decoupled. The renaming preserved transport-agnostic core, NATS profile, Baseline Trust Profile model, but removed AGORA references from RFCs and replaced them with v0/v1 numbering (`docs/rfcs/003_agh-network-v0.md`, `docs/rfcs/004_agh-network-v1.md`).

### Branch hygiene

Multiple `rebase-main`, `e2e-rebase` ledgers show the rebase workflow: backup branch first, fetch, divergence assessment, rebase, conflict resolution, `make verify` post-rebase, commit message preservation. No force pushes without explicit user permission.

## Notes for Synthesis

- The ledger is a **production artifact**, not just a memory aid. Pedro evidently uses it to track agent decisions, justify INVALID reviewer rejections, and preserve verification evidence across sessions. The "Working set" sections are particularly valuable as exact file paths + commands. Future agent prompts could use this format directly.
- The frequency of "the user explicitly said X" entries shows Pedro is steering hard at decision points but accepts agent autonomy on execution. Skill activation is explicit. Sub-agent delegation is explicit. Destructive git is forbidden.
- The volume on Apr 17 (32 entries) and Apr 26 (21 entries) shows two distinct intensities: Apr 17 is a wide infrastructure consolidation day (e2e harness + lint cleanup + CI audit + memory upgrade); Apr 26 is a deep autonomous-feature land day. Different intensities of work generate different ledger patterns.
- The repeated `cy-fix-reviews` cycles show the project goes through CodeRabbit rounds frequently — at least 8–10 distinct review rounds in the 21-day window. The remediation pattern is so standardized that it could be templated.
- "No-workarounds" is explicitly invoked over and over. This is Pedro's strongest signal: **fix root causes, not symptoms**. The skill is invoked as a guardrail before debugging.
- The autonomous PRD is a striking case study: 18 tasks executed in roughly 30 hours of agent time (Apr 25 evening through Apr 26 evening), passing real-scenario QA at the end. Tasks 01 → 18 each landed cleanly with `make verify` at every commit.
- The Hermes hardening track is the single largest quality investment in the ledger window — it's the Apr 24–25 spine and produced the durable retry primitives, MCP OAuth subsystem, ACP lifecycle classification with crash bundles, automation scheduler durability, and memory health/history. Plus 7 production bugs caught by real-scenario QA before any release.
- Greenfield-alpha discipline is the unifying ethos. "Zero legacy tolerance," "no compatibility shims," "hard-cut renames," "delete the old thing instead of working around it" — these phrases recur. The codebase is being built with deliberate refusal to carry technical debt forward, even within a 3-week development window.
