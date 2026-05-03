---
name: final-qa
description: Master index — pre-release final QA pass for AGH (Go agent runtime daemon). Real-LLM scenarios, no glorified mocks. 283 numbered scenarios across 15 modules + cross-cutting integration.
type: qa-master-index
status: planning-complete · ready-for-execution
authoring_run: 2026-05-02
language_policy: artifacts-en · conversation-brpt
---

# AGH Final QA — Master Index

A complete, executable, evidence-first QA plan for AGH. Built by 14 read-only research subagents in 4 batches against AGH's `internal/*` packages, web SPA, Fumadocs site, and the openclaw + hermes reference frameworks.

The artifact set is the contract. The runtime IS the truth. Real LLMs back every load-bearing scenario.

## Read Order (operator)

1. `_master-qa-plan.md` — philosophy, gate criteria, execution order, bootstrap, evidence requirements.
2. `_references/openclaw-qa-patterns.md` — adopted scenario anatomy, qa-channel, frontier vs regression, credential-broker contract.
3. `_references/hermes-qa-patterns.md` — pytest-fixture discipline translated to Go build tags, autouse-vs-explicit guardrails.
4. `_children/*.md` — per-module QA child plans. Read in numbered order; cross-references are explicit.

## Module Coverage

| #  | Child file | Scope | Scenarios | Lines |
|----|------------|-------|-----------|-------|
| 01 | `01-daemon-boot.md` | daemon composition root, lock, boot, shutdown, migrations, signals, subprocess lifetime | 15 (DB-01..DB-15) | 1,081 |
| 02 | `02-config-settings.md` | TOML config, settings overlay, workspace resolver, vault redaction, agent-local config | 16 (CFG-01..CFG-16) | 937 |
| 03 | `03-acp-sessions.md` | ACP JSON-RPC, session manager, transcripts, replay, lineage, cancellation, claim_token redaction | 19 (ACP-01..ACP-19) | 772 |
| 04 | `04-autonomy-kernel.md` | task_runs, ClaimNextRun, mechanical scheduler, hooks, coordinator, lease/sweep | 18 (AUT-01..AUT-18) | 1,131 |
| 05 | `05-memory-soul.md` | dual-scope memory, consolidation Time/Sessions/Lock cascade, agent soul, lifecycle hooks | 19 (MEM-01..MEM-19) | 1,509 |
| 06 | `06-skills-capabilities.md` | five-layer precedence, VerifyContent, registry, situation, symlink-escape | 20 (SKL-01..SKL-20) | 1,344 |
| 07 | `07-tools-sandbox.md` | tool registry, toolruntime interrupts, sandbox profiles, MCP sidecars, path-security | 17 (TOL-01..TOL-17) | 1,100 |
| 08 | `08-extensions-bridges.md` | extension manifest + install runtime, bundles, Slack/Telegram bridges, bridge SDK | 20 (EXT-01..EXT-20) | 1,291 |
| 09 | `09-automation-cron.md` | cron + webhook + scheduled triggers, durable scheduler state, DST + timezone discipline | 22 (CRN-01..CRN-22) | 1,367 |
| 10 | `10-network-identity.md` | AGH Network channels/peers/wire, embedded NATS, identity proof verification | 21 (NET-01..NET-21) | 1,366 |
| 11 | `11-api-cli-parity.md` | HTTP↔UDS↔CLI parity for 202 ops, OpenAPI codegen drift, BaseHandlers contract, SSE replay | 18 (API-01..API-18) | 1,007 |
| 12 | `12-web-ui.md` | React 19 SPA, real-Claude-Code Playwright, accessibility, truthful-UI invariant, COPY.md adherence | 20 (UI-01..UI-20) | 1,273 |
| 13 | `13-docs-site.md` | Fumadocs static export, OpenAPI + CLI reference rendering, copy/design-token compliance | 22 (DOC-01..DOC-22) | 1,185 |
| 14 | `14-cross-cutting.md` | ≥3-module integration scenarios, cross-module failure matrix, composes other children | 16 (XCT-01..XCT-16) | 1,285 |
| 15 | `15-observability.md` | canonical event coverage matrix, claim_token grep gate, durable-append-before-broadcast | 20 (OBS-01..OBS-20) | 1,420 |
|    | **Totals** |   | **283 scenarios** | **17,068 lines** |

Reference docs add 1,542 lines (`openclaw-qa-patterns.md` + `hermes-qa-patterns.md`).

## Non-negotiable invariants this pass MUST prove

1. **No raw `claim_token` (`agh_claim_*`)** in any output: logs, SSE, web responses, db rows, error payloads, settings views, channel messages. Enforced by AUT-16, ACP-18, OBS-04, UI-17, NET-05, and a top-level grep gate.
2. **Detached lifetime**: HTTP/UDS request cancellation MUST NOT cancel an in-flight prompt. Explicit `prompt/cancel` is the only cancel path. Proved by DB-14, ACP-05.
3. **Append-only event store**: `runtime.db` UPDATE/DELETE attempts are a typed error. Proved by OBS-13.
4. **Durable-append-before-broadcast**: kill -9 between append and broadcast — replay is consistent. Proved by OBS-03, XCT-08.
5. **Authoritative primitive exclusivity**: only `internal/task/` writes to `task_runs.claimed_by`. Static + runtime audit by AUT-14, AUT-16.
6. **Truthful UI**: a control NOT supported by daemon does NOT render. Proved by UI-19, XCT-14.
7. **Agent-manageable by default**: every state surface reachable via CLI + HTTP + UDS. Proved by API-01 + 202-op parity matrix.
8. **Identity proof-stripping defense**: verified-format identity without proof = REJECTED, not unverified. Proved by NET-02.
9. **Workspace isolation**: cross-workspace memory invisible to agents. Proved by MEM-12, XCT-10.
10. **Codegen co-ship**: contract change without `make codegen` blocks CI. Proved by API-07/08, XCT-15.

## Execution gate

A QA pass is "release-ready" only when:

- All 283 scenarios run with their declared `provider:` (real Claude Code where `live: true`; openclaw / hermes where parity demanded; mock-acp ONLY where flagged for determinism).
- Forbidden-needle list (each child has its own; rolled up in `_master-qa-plan.md` §7) shows zero hits across all captured artifacts.
- Coverage matrix (`15-observability.md` §11) has zero red rows.
- Cross-module failure matrix (`14-cross-cutting.md` §12) has every coupling-debt cell either green or filed as a known follow-up issue.
- A real-LLM minimum from each module appears in the run ledger (SD-005 gate audited by XCT-16).
- `make verify` is green at the commit being QAd.

## How to run a child

Each child is independently executable. The `qa-execution` skill walks a child file, parses its `qa-scenario` blocks, and runs each one with the daemon-driver, mock-acp lane, or live-LLM lane per the scenario's `provider:` field. Bootstrap uses `agh-qa-bootstrap` per the standing directives. Concurrency requires `agh-worktree-isolation` (unique `AGH_HOME`, daemon ports, and tmux-bridge socket paths per the parallel-QA rule).

## Decision points still open

The plan flagged a small number of unresolved questions that the operator MUST answer before the live lane runs. They are listed in `_master-qa-plan.md` §10 with the child + section that surfaced each one (skill hot-install hot-vs-cold rule; per-agent recall filtering; default scope for memory write; webhook past-rejection vs immediate-fire; DST spring-forward fire-or-skip; v0↔v1 network negotiation rule; spawn_depth cap value; `agh extension info` vs `status` canonical; the four observability matrix rows whose canonical event names need a code-grep close-out).

## Where this plan came from

- 14 read-only research subagents, dispatched in 4 batches to keep within rate limits.
- Each subagent read its package(s), the AGH `CLAUDE.md`s, both reference docs, and competitor scenarios from `.resources/openclaw/qa/` + `.resources/hermes/tests/`.
- Subagents are read-only by standing directive SD-007. The author of this master plan is the agent paired with the user.
- All file:line citations in children are against the live `internal/*` tree at this commit.
