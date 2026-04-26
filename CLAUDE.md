# CLAUDE.md

## Project Overview

AGH is an Agent Operating System — a Go single-binary daemon that manages AI agent sessions via ACP (Agent Client Protocol). It spawns ACP-compatible agents (Claude Code, Codex, Gemini CLI, etc.) as subprocesses, communicates via JSON-RPC over stdio, persists events in SQLite, and exposes interfaces via HTTP/SSE (web UI) and UDS (CLI). A Fumadocs site at `agh.compozy.com` documents the runtime and the AGH Network protocol.

**Goals**: daemon single-binary in background, strong observability, agent-first system (agents manipulate via CLI + REST), highly extensible, highly configurable.

**Core product premise**: every capability must be both extensible by the runtime and manageable by agents. Features are incomplete if they only work through internal Go calls or the web UI.

## Greenfield Alpha — Zero Legacy Tolerance

No production users exist. Never sacrifice code quality for backward compatibility. Never write migration, compat, or defensive code for old state — delete the old thing instead of working around it.

**Hard cuts, not bridges.** Renames sweep code, storage, APIs, CLI, extensions, specs, RFCs, AND `.compozy/tasks/*` artifacts in the same change. No aliases, no dual fields, no schema fallback paths. Every breaking-change techspec MUST explicitly name its delete targets.

## Critical Rules

- **`make verify` MUST pass** before completing ANY task (runs `fmt → lint → test → build`). Zero warnings, zero errors. No exceptions.
- **`make lint` has zero tolerance** — any golangci-lint issue is a blocking failure.
- **Check dependent package APIs** before writing integration code or tests.
- **Never add dependencies by hand in `go.mod`** — always use `go get`.
- **Never use web search tools for local project code** — use Grep/Glob instead. Web search is only for external docs.
- **Never run destructive git commands** (`git restore`, `git checkout`, `git reset`, `git clean`, `git rm`) **without explicit user permission**. If the worktree contains unexpected edits, read and work around them.
- <critical>NEVER ignore errors with `_` in production code or in tests — every error must be handled or have a written justification.</critical>
- <critical>NEVER COMMITS `ai-docs/`, `.tmp/`, or `.compozy/tasks/*/memory/` TO THE REPO. They are local tracking artifacts.</critical>
- **Subagents are read-only.** Use them for analysis, exploration, and parallel research. The author of every code change is the agent paired with the user. Subagent output is treated as evidence, not as committed work.

## Workflow Rules

These govern how features move from idea to ship. Internalize them before opening a TechSpec or running a task.

- **Multi-LLM pipeline is the default dev model.** Codex (`gpt-5.4` with `reasoning_effort=xhigh`) authors specs; Claude Opus pressure-tests them; `gpt-5.4-mini` with `reasoning_effort=high` does parallel breadth exploration when explicitly delegated. Do not substitute models without explicit user approval.
- **Every TechSpec is peer-reviewed before approval.** Run `compozy exec --ide claude --model opus --reasoning-effort xhigh --format json --prompt-file <prompt>`; resolve every blocker before approving.
- **Every `_tasks.md` ends with a QA pair.** `cy-create-tasks` MUST append `$qa-report` and `$qa-execution` (with e2e for UI-bearing features) following the `.compozy/tasks/hermes` template.
- **Every backend task carries a `Web/Docs Impact` subitem.** List affected `web/` routes/components/hooks AND `packages/site` doc pages. Backend-only tasks may declare "no impact" but only after analysis.
- **Every spec/feature carries an extensibility + agent-manageability + config lifecycle analysis.** Creating, updating, or removing a feature MUST state how it integrates with AGH extensibility surfaces (extensions, hooks, skills/capabilities, tools/resources, bundles, registries, bridge SDKs), which CLI/HTTP/UDS surfaces let agents manage it, and whether `config.toml` keys/defaults/docs are added, changed, or removed. "No impact" is acceptable only with explicit evidence.
- **Reference competitors by file path in tasks.** When a TechSpec relies on `.resources/<repo>/` references, generated tasks must include explicit competitor file paths so implementing agents read them too. Reference-bearing analysis files belong under `.compozy/tasks/<slug>/analysis/`.
- **Worktree isolation is mandatory for parallel QA.** Concurrent runs use unique `AGH_HOME`, unique daemon ports, and unique `tmux-bridge` socket paths. Default home/port use is forbidden when concurrency is signaled.
- **Two-touch rule.** If the same package or behavior has been patched twice in the same workstream, the third change MUST be a structural redesign, not a third patch. Open a new TechSpec.
- **Conversation in Brazilian Portuguese; artifacts in English.** Spoken/typed exchanges may use BR-PT. TechSpecs, ADRs, code, commit messages, docs are always English.
- **Pushback markers are escalation signals.** When the user uses "fraco", "leviano", "ruim", "está totalmente errado", "meia boca", "esquecendo coisas", slow down and re-clarify before acting.

## Design System

**`DESIGN.md` (repo root) is the authoritative design-system specification for every AGH surface** — runtime UI, marketing site, and docs. Any UI or asset work MUST:

- Pull tokens from `DESIGN.md` (colors, type, radii, spacing, motion) — never invent values.
- Follow the flat depth model (no shadows), warm-dark palette, Inter + JetBrains Mono + Playfair Display (site-home only) + NuixyberNext (wordmark only).
- Respect the signal palette: accent `#E8572A` = action, `#30D158` = success, `#FF453A` = danger, `#FFD60A` = warning, `#BF5AF2` = info.
- When a task belongs to `.compozy/tasks/redesign/`, run it through the `designer` agent (`.claude/agents/designer.md`) in **execution mode only** and activate the mandatory design skills listed below.
- **Truthful UI > plausible UI.** Don't render controls or metrics the runtime doesn't actually support. When Paper artboards conflict with daemon truth, daemon wins. Paper governs _composition_, `DESIGN.md` governs _grammar_.

## Skill Dispatch

Activate skills **before** writing code. Match task domain → activate all required skills:

| Domain                     | Required Skills                                                                          | Conditional Skills                     |
| -------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------- |
| Go / Runtime               | `golang-pro`                                                                             | `context7`                             |
| Config / Logging           | `golang-pro`                                                                             |                                        |
| Bug fix                    | `systematic-debugging` + `no-workarounds`                                                | `testing-anti-patterns`                |
| Writing Go tests           | `testing-anti-patterns` + `agh-test-conventions` + `golang-pro`                          | `vitest` (only for test tooling docs)  |
| Cleanup / failure paths    | `agh-cleanup-failure-paths` + `golang-pro`                                               | `deadlock-finder-and-fixer`            |
| Schema / migration changes | `agh-schema-migration` + `golang-pro`                                                    |                                        |
| Contract / OpenAPI changes | `agh-contract-codegen-coship`                                                            |                                        |
| Task completion            | `cy-final-verify`                                                                        |                                        |
| Architecture audit         | `architectural-analysis`                                                                 | `refactoring-analysis` + `ubs`         |
| Concurrency / races        | `deadlock-finder-and-fixer` + `golang-pro`                                               | `systematic-debugging`                 |
| Performance / hot paths    | `extreme-software-optimization` + `golang-pro`                                           |                                        |
| Security review            | `security-review`                                                                        | `ubs`                                  |
| Creative / new features    | `brainstorming`                                                                          | `cy-idea-factory`                      |
| PRD creation               | `cy-spec-preflight` + `cy-create-prd`                                                    | `cy-idea-factory`                      |
| TechSpec creation          | `cy-spec-preflight` + `cy-create-techspec` + `cy-spec-peer-review`                       | `cy-research-competitors`              |
| Task generation            | `cy-spec-preflight` + `cy-create-tasks` + `cy-tasks-tail-qa-pair` + `cy-web-docs-impact` |                                        |
| Competitor research        | `cy-research-competitors`                                                                | `context7` + `find-docs`               |
| Execute a PRD task         | `cy-execute-task`                                                                        | `cy-workflow-memory`                   |
| Review round / fixes       | `cy-review-round` + `cy-fix-reviews`                                                     | `fix-coderabbit-review`                |
| Release / scenario QA      | `real-scenario-qa` (delegates to `qa-execution` + `qa-report`)                           | `agh-worktree-isolation`               |
| Git rebase / conflicts     | `git-rebase`                                                                             |                                        |
| External docs lookup       | `context7` + `find-docs`                                                                 | `exa-web-search-free`                  |
| UI / Design (any surface)  | `agh-design` + `design-taste-frontend` + `minimalist-ui`                                 | `frontend-design` + `interface-design` |

Web-specific skill dispatch is in `web/CLAUDE.md` and `web/AGENTS.md`. Site-specific dispatch is in `packages/site/CLAUDE.md`.

Every domain change requires its skill — no skipping "because it's a small change". Activate multiple skills when code touches multiple domains.

`nats` skill is installed but architecturally forbidden in AGH (see Architecture Principles). Do not activate it.

## Build Commands

### Go (backend)

```bash
make verify              # BLOCKING GATE: fmt → lint → test → boundaries → build
make fmt                 # Format with gofmt
make lint                # Strict golangci-lint (zero issues)
make test                # Run unit tests with -race flag
make test-integration    # Add -tags integration tests
make test-e2e-runtime    # Daemon-side E2E (Go harness)
make test-e2e-web        # Browser-side E2E (Playwright)
make test-e2e            # Both lanes
make test-e2e-nightly    # Heavy E2E (release PR dry-run only)
make build               # Compile binary
make codegen             # Regenerate openapi/agh.json + web/src/generated/agh-openapi.d.ts
make codegen-check       # Verify no codegen drift (mandatory after contract changes)
make deps                # Tidy and verify modules
```

### Site (Fumadocs at packages/site)

```bash
cd packages/site && bun run source:generate
cd packages/site && bun run typecheck
cd packages/site && bun run test
cd packages/site && bun run build
make site-dev            # Dev server
make site-build          # Production build
make cli-docs            # Regenerate CLI reference from cobra JSON export
```

Web (`web/`) commands are documented in `web/CLAUDE.md`.

## Commit style: <type>: <description>

Allowed prefixes: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `build:`. **NO `chore:`, `style:`, or `ci:`.** Tooling and CI changes use `build:`. PR-merged commits include `(#NN)` suffix.

**One commit per remediation batch.** `cy-fix-reviews` rounds produce exactly one local commit per round. Run `make verify` BEFORE and AFTER the commit. Never `git commit --amend` after pre-commit hook failures — fix and create a new commit.

## Code Search Hierarchy

1. **Grep / Glob** — for local project code.
2. **`context7` / `find-docs` skills** — for external library documentation.
3. **`exa-web-search-free`** — for web research, news, external code examples when the local docs tools are insufficient.

## Old Project Reference

The `.old_project/` directory contains the previous AGH implementation (78K+ LOC). **Reference only** — do not modify, do not import, do not include in builds. Exclude from code search results.

## Architecture

### Principles

- **Designed for incremental extension** — new capabilities arrive as new packages wired into `daemon/`, without modifying existing packages. Small interfaces + dependency injection. Every capability plan decides which extension points, hooks, capabilities, tools/resources, bundles, registries, bridge SDKs, and docs must be added, updated, or removed.
- **Pragmatic Flat with Discipline** — packages under `internal/`, API transports grouped under `api/`, no domain/infra split, no event bus.
- **`daemon/` is the sole composition root** — the only package that imports all others. Reconciliation logic running at boot belongs to composition root and is not "legacy support".
- **No package imports `daemon/`, `api/`, or `cli/`** — dependencies flow downward only.
- **Interfaces defined where consumed** (Go-style) — `session/` defines `AgentDriver`, `acp/` implements it.
- **Direct function calls through interfaces** — no event bus, no NATS, no reflection-based routing.
- **Notifier pattern for fan-out** — typed interface for observability and SSE, not a generic bus.
- **No back-pointers between packages** — inject callbacks or interfaces.
- **Functional options for constructors** — `NewManager(opts ...Option)`.
- **Maps for <10 items** — no registry interfaces for small collections.
- **File-level organization** within packages — sub-packages only when complexity justifies it.
- **CI-enforceable boundaries** — `mage Boundaries` rules prevent import cycles. Update `magefile.go` Boundaries() in the same commit that introduces a new `internal/api/*` subpackage.
- **`internal/api/core` is the canonical handler home.** REST/UDS endpoints exist as shared `BaseHandlers` methods; HTTP and UDS only choose registration and authentication. No transport-duplicated parsing/validation.
- **Authoritative primitives are exclusive.** When a primitive owns a state transition (`task.Service.ClaimNextRun`, `Spawn`, `EnsureMigration`), no peer package may replicate it. Wake/observe/sweep are allowed; claim/own is not. The mechanical scheduler does not call `ClaimNextRun`.
- **Hooks are typed dispatch, not an event bus.** Dispatch at the call site that owns the state transition. Never tail event/log tables to fire hooks. Hooks may deny/narrow/annotate but cannot bypass safety primitives (claim tokens, leases, TTL, lineage, spawn caps, permission narrowing).
- **Agent-manageable by default.** User-visible runtime capabilities must expose stable machine-readable control surfaces for agents: CLI verbs with `-o json`/`-o jsonl` where relevant, HTTP/UDS parity when state crosses the daemon boundary, discoverable status/config output, and docs that describe the agent path. UI-only manageability is incomplete.
- **No partial-surface completions.** Any change touching a public surface closes the loop end-to-end in one pass: contract → HTTP handler → UDS handler → CLI client → CLI command → extension/config/docs surfaces → tests → docs.

### Concurrency

- Every goroutine must have explicit ownership and shutdown via `context.Context` cancellation.
- No fire-and-forget goroutines — track with `sync.WaitGroup` or equivalent.
- Use `select` with `ctx.Done()` in all long-running goroutine loops.
- Prefer channels over shared memory with mutexes when practical.
- `sync.RWMutex` for read-heavy, `sync.Mutex` for write-heavy shared state.
- No `time.Sleep()` in orchestration — use proper synchronization primitives.
- **Goroutines spawned by `internal/session/manager_*.go` MUST be tracked by Manager-owned WaitGroup and joined in Manager shutdown.** Never put goroutine-owned channels in a struct field that another goroutine mutates — use a per-run handle.
- **Detached execution lifetime.** Any work that outlives an HTTP/UDS request — prompts, network channel sends, automation jobs — MUST detach via `context.WithoutCancel(ctx)`. Never tie execution lifetime to request lifetime. Expose explicit cancel endpoints (e.g., `POST /api/sessions/:id/prompt/cancel`).
- **`context.WithoutCancel` does NOT preserve deadlines.** Re-attach a deadline if needed.
- **Subprocess managed-stop** must respect `ctx.Done()` between Shutdown and Wait. Wrap `proc.Wait()` in `select { case <-proc.Done(): case <-ctx.Done(): }`.
- **Process-group supervision parity.** Unix uses process groups; Windows uses forced-exit fallback. Always cross-build with `GOOS=windows GOARCH=amd64 go build` before claiming subprocess work complete. Centralize signaling helpers in `internal/procutil`.

### Runtime

- Single-binary and local-first. Sidecars or external control planes require a written techspec.
- Keep execution paths deterministic and observable.
- **Daemon runs in background by default.** No daemon should require a foreground terminal.
- **`compozy exec` is headless.** `--format text` returns a single string; `--format json` returns a stream of valid JSON objects; the TUI is opt-in via `--tui`. `exec` does not persist artifacts to `.compozy/runs/` unless `--persist` is given.
- **Agent operations must not depend on the web UI.** If agents need to inspect, configure, start, stop, approve, claim, release, or repair a capability, the spec must provide a CLI/HTTP/UDS path with structured output and deterministic errors.

### Observability

- Every domain operation emits a canonical event with correlation keys (`workspace_id`, `session_id`, `parent_session_id`, `root_session_id`, `agent_name`, `task_id`, `run_id`, `claim_token_hash`, `lease_until`, `workflow_id`, `coordinator_session_id`, `scheduler_reason`, `hook_event`, `hook_name`, `spawn_depth`, `actor_kind`, `actor_id`, `release_reason`).
- Cover with a coverage matrix test that fails if any required lifecycle path doesn't emit its canonical event.
- Append-only event store (`runtime.db`) is the canonical operational ledger; session DBs are projections, not authority.
- Live broadcasters publish only after durable append; reconnect/replay uses `after_seq`.

## Autonomy Contracts

These are load-bearing rules from the autonomous-mode ADRs (`.compozy/tasks/autonomous/adrs/adr-001..012`) and `_techspec.md`. Internalize them before touching the kernel.

- **`task_runs` is the single durable work queue.** Do not introduce a parallel queue or actor table. Add new ownership/state via columns + side tables on `task_runs`.
- **`task.Service.ClaimNextRun` is the canonical claim primitive.** Lease invariants: exactly one active claim token per non-terminal run; heartbeat/complete/fail/release compare run owner + claim token; stale/late after recovery fails explicitly; sweep + heartbeat serialize via SQLite tx; boot recovery before scheduler accepts wake/claim traffic; lease extension bounded by config; one active lease per session in MVP. Use `BEGIN IMMEDIATE`; CAS predicates for sweep.
- **Capability matching = durable exact-match rows** in `task_run_required_capabilities` / `task_run_preferred_capabilities`, NOT JSON metadata.
- **Manual operator paths and autonomous paths converge on the same primitives.** User-created, automation-created, coordinator-created, and agent-spawned tasks all use the same task/run model and the same claim-token/lease/heartbeat/complete/fail/release rules. Task creation alone NEVER enqueues claimable work or starts the coordinator. Publish/start/approval is the run-enqueue boundary.
- **Coordinator auto-spawn** triggers ONLY when: workspace has no healthy active coordinator AND a coordinated run is enqueued by publish/start/approval AND run has stable `coordination_channel_id` AND auto-start enabled AND spawn caps allow. Conservative defaults (auto-start disabled, max-children 5, max-active-per-workspace 1).
- **Coordinator-agent owns semantic orchestration; mechanical scheduler owns operational safety** (idle registry, capability-aware wakeups, lease sweep, recovery, backpressure). The scheduler does NOT call `ClaimNextRun` directly in MVP.
- **Safe spawn defaults**: max-depth 1, max-children 5, mandatory TTL on every spawned session; children auto-stop with parent. Permission narrowing compares concrete atoms only (tools, skills, MCP server IDs, workspace path grants, network channels, env profile grants); subset-only; unknown child atoms count as widening and reject. Daemon NEVER silently narrows.
- **Hook taxonomy** (MVP allowlist): `coordinator.{pre_spawn,spawned,decision,stopped,failed}`, `task.run.{enqueued,pre_claim,post_claim,lease_extended,lease_expired,lease_recovered,released}`, `spawn.{pre_create,created,parent_stopped,ttl_expired,reaped}`, plus `tool.*`, `permission.*`, `session.*`. Scheduler wake/no-match/recovery stay internal metrics. No `workflow.*` umbrella in MVP.
- **Coordination channels.** Every workspace-scoped coordinated run has ONE durable `coordination_channel_id` on `task_runs`. Bind always, speak when useful — heartbeats/lease transitions never mirror as chat. Network message kinds limited to `status` / `request` / `reply` / `blocker` / `handoff` / `result` / `review_request` in MVP. Channels are NEVER an ownership/status authority.
- **Generated contracts and docs co-ship.** Any change to `internal/api/contract` co-ships in the same PR with: regen of `openapi/agh.json` and `web/src/generated/agh-openapi.d.ts`, updates to `web/src/systems/*/types.ts` consumers, Storybook/MSW fixtures, and passes `make codegen-check`, `make web-typecheck`, AND `make web-test`.
- **Agent-facing CLI is identity-inferred.** Caller identity flows from `AGH_SESSION_ID` / `AGH_AGENT` through `internal/agentidentity`. Operator endpoints MUST NOT infer agent identity from environment variables. Stable `-o json` and `-o jsonl` are compatibility contracts; no command aliases (no `done`, no `pass`).

## Security Invariants

- **`claim_token` redaction is non-negotiable.** Raw `claim_token` (`agh_claim_*`), MCP auth tokens, OAuth codes, PKCE verifiers, and secret bindings MUST NEVER appear in logs, status APIs, settings views, error payloads, channel messages, SSE, web UI, or memory. Use hash forms (`claim_token_hash`) over the wire. Network layer rejects raw `claim_token` in metadata.
- **Symlink escape hardening.** Skill sidecars, skill files, managed-extension dependency copies, and bundle install paths MUST verify resolved targets remain inside approved roots. Use `EvalSymlinks` + path-prefix check, not naive joins. Handle macOS `/private/var/folders` quirk (canonicalize source root before containment check).
- **Path security helpers.** Filesystem helpers resolving user-controlled or agent-controlled paths use the `sanitizePathKey` + `realpathDeepestExisting` pattern (defenses against null-byte, URL-encoded traversal, Unicode normalization, symlink-escape).
- **Identity proof-stripping defense.** In any signed-message processing path (AGH Network v1), an identity in verified format (`nickname@fingerprint`) without valid `proof` MUST classify as `rejected`, not `unverified`.
- **External-call timeouts.** Outbound HTTP/network calls MUST use a client with an explicit timeout. `http.DefaultClient` is forbidden in production code paths.
- **Load-time security scan.** Every non-bundled skill is scanned via `internal/skills.VerifyContent` on every load (not just install). Critical findings block; warning findings log; info findings log silently. Bundled skills are exempt because `go:embed` provides immutability.

## Package Layout

| Path                            | Responsibility                                                                |
| ------------------------------- | ----------------------------------------------------------------------------- |
| `cmd/agh`                       | Main entry point, CLI binary                                                  |
| `internal/config`               | TOML loading, validation, merge, home paths, agent def parsing                |
| `internal/acp`                  | ACP client: subprocess spawn, JSON-RPC over stdio                             |
| `internal/agentidentity`        | Caller-identity inference from `AGH_SESSION_ID`/`AGH_AGENT`                   |
| `internal/automation`           | Cron, webhook, and scheduled triggers; durable scheduler state                |
| `internal/bridges`              | External messaging adapters (Slack, Telegram, etc.)                           |
| `internal/bridgesdk`            | Bridge SDK / contract types                                                   |
| `internal/bundles`              | Bundle activation projector                                                   |
| `internal/cli`                  | Cobra commands                                                                |
| `internal/codegen`              | OpenAPI → TS generator helpers                                                |
| `internal/coordinator`          | Coordinator-agent bootstrap and lifecycle                                     |
| `internal/daemon`               | Composition root, lock, boot, shutdown                                        |
| `internal/diagnostics`          | Diagnostics + health probes                                                   |
| `internal/e2elane`              | E2E lane harness wiring                                                       |
| `internal/environment`          | Env-profile resolution                                                        |
| `internal/extension`            | Extension manifest, registry, host API, install runtime                       |
| `internal/extensiontest`        | Extension test harness                                                        |
| `internal/filesnap`             | File snapshot utilities                                                       |
| `internal/fileutil`             | Shared filesystem helpers                                                     |
| `internal/frontmatter`          | YAML frontmatter parsing                                                      |
| `internal/hooks`                | Typed hook taxonomy + dispatch                                                |
| `internal/logger`               | Structured logging (slog)                                                     |
| `internal/mcp`                  | MCP server lifecycle / sidecars                                               |
| `internal/memory`               | Persistent dual-scope memory (global + workspace + agent), provenance, recall |
| `internal/memory/consolidation` | Dream consolidation runtime (Time → Sessions → Lock gate cascade)             |
| `internal/network`              | AGH Network channels/peers/wire, NATS profile                                 |
| `internal/observe`              | Event recording, health metrics, query engine                                 |
| `internal/procutil`             | Process utilities, process-group signaling, Windows fallback                  |
| `internal/registry`             | Skill/agent/capability registry helpers                                       |
| `internal/resources`            | Resource projector / codec / validate                                         |
| `internal/retry`                | Retry primitives                                                              |
| `internal/scheduler`            | Mechanical scheduler (idle registry, wakeups, sweep, recovery)                |
| `internal/session`              | Session lifecycle, Manager, state machine                                     |
| `internal/settings`             | Settings overlay/projection                                                   |
| `internal/situation`            | Situation surface providers (`/agent/context`)                                |
| `internal/skills`               | Skills catalog, loader, `VerifyContent`, MCP/hook decl, provenance            |
| `internal/skills/bundled`       | Bundled skill definitions                                                     |
| `internal/sse`                  | Shared SSE helpers                                                            |
| `internal/store`                | SQLite shared helpers, migrations registry, validation                        |
| `internal/store/globaldb`       | Global catalog (`agh.db`): sessions, metadata                                 |
| `internal/store/sessiondb`      | Per-session event store (`events.db`)                                         |
| `internal/subprocess`           | Subprocess signaling primitives                                               |
| `internal/task`                 | Task domain, `task_runs` ownership, `ClaimNextRun`                            |
| `internal/testutil`             | Shared test helpers                                                           |
| `internal/api/contract`         | Shared daemon/CLI/HTTP contract types                                         |
| `internal/api/core`             | Shared handler types (`BaseHandlers`), error mapping, SSE helpers             |
| `internal/api/httpapi`          | HTTP/SSE server (Gin) for web UI                                              |
| `internal/api/udsapi`           | UDS server for CLI IPC                                                        |
| `internal/api/testutil`         | Test helpers for the API layer                                                |
| `internal/toolruntime`          | Tool process registry + interrupts                                            |
| `internal/tools`                | Tool definitions and dispatch                                                 |
| `internal/transcript`           | Canonical replay message assembly from persisted events                       |
| `internal/version`              | Build metadata                                                                |
| `internal/workref`              | Work reference helpers                                                        |
| `internal/workspace`            | Workspace resolver and entity management                                      |
| `web/`                          | React 19 SPA (Vite, TanStack Router/Query, Tailwind, shadcn)                  |
| `web/src/systems/`              | Domain feature modules (app-renderer-systems pattern)                         |
| `packages/site`                 | Fumadocs documentation site (Bun)                                             |
| `packages/ui`                   | Shared UI primitives (`@agh/ui`)                                              |

## Coding Style

- Explicit error returns with wrapped context: `fmt.Errorf("context: %w", err)`.
- Use `errors.Is()` and `errors.As()` exclusively for error matching. **`strings.Contains(err.Error(), …)` is forbidden.**
- Never ignore errors with `_` — every error must be handled or have a written justification.
- **Cleanup paths must cancel contexts and release resources.** Every error-return path that previously created or extended a `context.Context`, registered a resource, opened a connection, or spawned a subprocess MUST `cancel()`, `Close()`, `Stop()`, or release its lease on the error path. Pair `defer cancel()` immediately after `WithCancel`/`WithTimeout`.
- No `panic()` or `log.Fatal()` in production paths — only for truly unrecoverable startup failures.
- `log/slog` for structured logging — no `log.Printf` or `fmt.Println` for operational output.
- `context.Context` as first argument to functions crossing runtime boundaries — avoid `context.Background()` outside `main` and focused tests.
- **Compile-time interface verification is mandatory.** `var _ Interface = (*Type)(nil)` next to every new exported type that satisfies an interface.
- No `interface{}`/`any` when a concrete type is known.
- No reflection without performance justification.
- **Never hardcode configuration** — use TOML config or functional options. Disable/zero-value semantics must be explicit. Resolution chains documented as ordered fallbacks ending in actionable errors.
- **Config lifecycle is part of the feature lifecycle.** Any spec that adds, updates, removes, or stops needing configuration must update structs, defaults, merge/overlay behavior, validation, examples, `config.toml` docs, generated CLI/site docs, and tests in the same change. If no config change is needed, the TechSpec says why.
- **CLI flag presence detection.** Distinguish "flag not set" from "flag set to zero value" via `cmd.Flags().Changed(name)` (Cobra) or equivalent. Silently ignoring an explicit flag is a bug.
- **Whitespace normalization at CLI boundary.** String-slice CLI inputs (capabilities, IDs, tags, paths) MUST trim and drop empty entries before sending. Do not push whitespace-only strings to the daemon as "validation problems".
- **No defensive nil-checks after `make`.** Reviewers and lint flag `if x == nil` after `make(...)` as unreachable.
- **No comments restating WHAT the code does.** Comments capture WHY when non-obvious — hidden constraints, invariants, workarounds for specific bugs. Don't reference the current task or callers ("used by X", "added for Y") — those rot.

## Testing

- **Every Go test case MUST be inside a `t.Run("Should ...")` subtest.** Adding inline cases to an existing function is a blocking violation.
- **Independent subtests MUST call `t.Parallel()`.** The only legitimate opt-out is a comment justifying `t.Setenv` use or shared state. Reject reviewer suggestions to add `t.Parallel()` to env-mutating tests as INVALID with rationale.
- Table-driven default; use `t.Helper()` on test helpers and `t.TempDir()` for filesystem isolation.
- **No `_ = errFn(...)` in tests.** Handle marshal/JSON/cleanup errors explicitly.
- **Status-code-only assertions are insufficient.** Also assert response body, error message, or contract-specific evidence (idempotency key, request payload).
- Mock via interfaces, not test-only methods in production code.
- `-race` flag must pass before committing.
- **Race-enabled tests must self-manage `CGO_ENABLED=1`.** Verification commands wrapping `go test -race` go through `runRaceEnabledGoCommand` (or equivalent). Don't trust ambient env.
- **Linux-Race CI parity.** Before claiming `make verify` complete on race-sensitive packages (`internal/session`, `internal/acp`, `internal/hooks`, `internal/subprocess`, `internal/resources`), reproduce locally with `act workflow_dispatch -W .github/workflows/ci.yml -j verify --container-architecture linux/amd64`.
- **`make verify` is the commit gate.** If verification is blocked by an external/branch-side asset issue (missing test fixture, etc.), do NOT commit — report the verified blocker and hold.
- **Test failures are production bugs.** Fix production code; don't weaken assertions. The only exception is documenting an INVALID review item with concrete evidence.
- **Replace fragile string-matching with structured metadata.** ACP prompt routing in `acpmock` uses typed prompt metadata, not rendered prompt substrings.
- **80% coverage minimum** per package.

### Integration & E2E Tests

- **Build tags**: `//go:build integration` at top of `*_integration_test.go` files.
- **Co-located** with the package they test (not in a separate `test/` directory).
- `make test` = unit only. `make test-integration` = `+integration` tag. `make test-e2e-runtime` = daemon-side E2E. `make test-e2e-web` = browser-side Playwright.
- `TestMain` for expensive one-time setup/teardown.
- Use **real dependencies** (real SQLite via `t.TempDir()`, mock ACP server as subprocess).
- Keep fast enough for CI (~30s max per package).
- **E2E tests are part of the runtime contract.** When a runtime contract changes (prompt augmenter, situation context, fixture format), the E2E mock and matchers ship in the same PR. Otherwise tests pass against a stale prompt and fail later.

### Schema Migrations

- **Schema migrations are mandatory** for any change to a SQLite column, index, or constraint. Add a numbered migration in the migrations registry. `EnsureSchema`-style boot reconciliation is forbidden for column changes. Test fresh-DB AND reopen-after-restart paths.
- **One schema migration primitive shared by all SQLite databases** (`agh.db`, `events.db`, catalog DBs).
- **SQLite recovery code paths** must rename or remove `-wal` and `-shm` companions, not only the `.db` file.
- **`ORDER BY 0` is invalid in SQLite** (positional reference). Use `(SELECT 0)` or an explicit constant column.

## Memory & Skills (RFC-backed)

These rules come from RFC 001 (`.../agh-rfcs-local/001-agent-md-with-skills-memory.md`) and RFC 002 (`.../agh-rfcs-local/002-skills-system-final.md`):

- **Five-layer skill/memory/agent precedence**: Bundled → Marketplace → User → Additional → Workspace, with agent-local overriding all. Higher precedence wins on collision; an audit trail logs every shadow.
- **Memory taxonomy**: `user | feedback | project | reference` types; scopes `agent | workspace | global`. Default write scope declared per agent in `memory.scope`.
- **Memory consolidation gates**: Time → Sessions → Lock cascade ordered by computational cost. Default gates: 24h, 5 touched sessions, file-lock. Never replace gates with naive heuristics.
- **Lifecycle hooks** (`on_session_created`, `on_session_stopped`) execute in hierarchy precedence then alphabetical order; configurable timeout (default 5s); fail-open semantics (errors logged, never block); JSON over stdin.
- **Format extension default**: when integrating with an external spec (AgentSkills, AGENTS.md, MCP, A2A), extend via a namespaced metadata field (`metadata.agh.*` or `agh.*`) — never fork the format.
- **Capability vs Recipe**: reusable agent artifacts are called `capability`, NOT `recipe`/`workflow`/`procedure`/`playbook`. Capabilities are interpretive, not deterministic; they are not workflow programs in disguise.
- **Runtime moat statement**: AGH competes on runtime, SDK, observability, DX, and integration depth — NOT the wire protocol. The AGH Network protocol must remain implementable outside AGH. Any feature requiring AGH to interoperate is a design smell.

## CI / Release

- **No cron / schedule workflows.** Heavy/credentialed tests (`make test-e2e-nightly`, `make test-integration`) live in the `dry-run` job of the auto-created release PR. Rationale: release PR is the natural human-gated batching point.
- **Looper repo (`~/dev/compozy/looper`) is the canonical source** for compozy-org Go-repo CI: composite actions (`setup-go`, `setup-bun`, `setup-git-cliff`, `setup-release`), `ci.yml`, `release.yml`, `.goreleaser.yml`, `cliff.toml`. Verbatim copies into AGH.
- **Replace third-party CI actions with shell logic** when their setup fails on runners (lesson: `dorny/paths-filter@v3` runner instability replaced by inline git-based change detection).

## Forensic Bug Fixes

- **Bug-fix plans open with confirmed reproduction** (timestamp, command, observed evidence) BEFORE listing changes. "I think" or "probably" is forbidden at the top of a fix plan.
- **Inactive metadata repair must distinguish startup-pending from crashed.** Sessions in `m.pending` are still starting, not failed.
- **Stale ACP session ids must be classified, not propagated.** Convert `Resource not found` to fresh-start fallback.

## Cross-References

- **Spec authoring playbook** (mandatory preflight for `cy-create-prd`/`cy-create-techspec`/`cy-create-tasks`): `docs/_memory/spec-authoring-playbook.md`.
- **Standing directives** (perpetual posture): `docs/_memory/standing_directives.md`.
- **Lessons learned** (durable engineering insights with evidence): `docs/_memory/lessons/` — see `README.md` for the index.
- **Glossary** (canonical vocabulary — `capability` vs `recipe`, AGENT.md vs AGENTS.md, Peer Card vs Agent Card, autonomy primitives): `docs/_memory/glossary.md`.
- **Cross-source synthesis** (evidence trail behind every rule above): `docs/_memory/_synthesis.md` and `docs/_memory/analysis/analysis_*.md`.
- **Web rules**: `web/CLAUDE.md`. **Site rules**: `packages/site/CLAUDE.md`.
- **Active TechSpec**: `.compozy/tasks/autonomous/_techspec.md`. **ADRs**: `.compozy/tasks/autonomous/adrs/`.
- **Authoritative design tokens**: `DESIGN.md` (repo root).
