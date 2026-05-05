Goal (incl. success criteria):

- Rework `.compozy/tasks/tools-registry/_techspec.md` so extension-provided tools are executable extension capabilities, not descriptor-only placeholders.
- Success means the TechSpec and ADRs support native Go function tools plus TypeScript extension handler tools, reuse existing extension/SDK architecture, pass TechSpec marker checks, receive peer review, and are saved only after user approval.

Constraints/Assumptions:

- Must follow `cy-spec-preflight`, `cy-create-techspec`, and `cy-research-competitors`.
- Do not write `_techspec.md` until research, technical questions, ADRs, draft review, and user approval complete.
- Subagents for competitor research are read-only; parent writes analysis files.
- Conversation in BR-PT; artifacts in English.
- No destructive git commands.
- User explicitly asked to cross-reference `docs/ideas/from-claude-code` in addition to `.resources/*` competitor research.
- Current user feedback: existing spec is "muito ruim" for extension tool creation because extensions should define tools using Go functions or TypeScript, like existing AGH extensions.
- Runtime has no interactive question tool in Default mode; if a cy-create-techspec clarification is required, ask one plain-text question and stop.
- User correction: do not recreate a new TechSpec. Modify the existing `.compozy/tasks/tools-registry/_techspec.md` in place, preserving its structure where possible and changing only sections that conflict with accepted decisions.

Key decisions:

- Task slug: `tools-registry`.
- Focus: extensible Tool Registry foundation supporting native/bundled tools and extension-provided tools.
- Extension tool execution boundary: accepted option A. MVP uses manifest-first extension tool descriptors and out-of-process execution only (MCP, extension sidecar/Host API, subprocess adapter, future bridge adapter). Built-in AGH tools may register in-process; third-party extension handlers do not run in-process in the daemon.
- Session tool exposure path: accepted option A. MVP exposes AGH-native registry tools through an AGH-hosted local MCP server plus shared CLI/HTTP/UDS contracts. Direct ACP/driver injection is a later optimization, not MVP.
- Runtime registry package boundary: accepted option A. `internal/tools` owns runtime registry contracts and dispatch; a thin `internal/catalog` facade composes tools and skills for cross-domain discovery/search/view.
- MVP native tool scope: accepted option C. Include bootstrap catalog/skill tools plus `agh__network_peers`, `agh__network_send`, and a bounded `agh__task_*` set. Do not include `agh__skill_install`, `agh__skill_remove`, or `agh__skill_update` unless supply-chain policy/scanning is explicitly added.
- Policy integration: accepted user direction. Existing ACP `permissions.mode` is the system/session approval ceiling. Registry/tool policy is a granular layer below it and cannot silently grant more authority than ACP permits. `approve-all` is not a bypass for explicit registry denies, source grants, availability, session lineage, or hooks.
- Tool visibility by surface: accepted option A. Operator surfaces show unavailable/unauthorized/conflicted tools with reason codes; session/model-visible surfaces expose only tools visible and callable for that effective session. Dispatch still revalidates.
- Canonical ToolID format: accepted. Use one provider-safe public `ToolID` across registry, policy, CLI, HTTP, UDS, telemetry, hooks, and hosted MCP. Format is lower snake segments separated by reserved `__`, for example `agh__skill_view` and `mcp__github__create_issue`. No dotted callable IDs and no separate wire alias in MVP.
- Rework decision from 2026-04-28 user answer: MVP execution boundary is option B. Implement executable `native_go` and `extension_host` tools plus remote MCP call-through in the same TechSpec. Remote MCP call-through must consume existing MCP config/auth, preserve token redaction, and not create a parallel auth store.
- Extension tool descriptor source: accepted option A. Manifest-authoritative with runtime reconciliation. `extension.toml` declares `resources.tools.<name>` with canonical `id`, schemas, risk/policy, and handler binding. Runtime/SDK may expose `provide_tools`, but the daemon only marks the tool executable when runtime-provided descriptors match the manifest-authoritative descriptor.
- Go extension authoring boundary: accepted option B. MVP must include a public Go subprocess extension SDK equivalent to `@agh/extension-sdk`, with helper APIs for defining tools using Go functions. Built-in/first-party daemon tools still use in-process `native_go` functions; third-party Go tools execute out-of-process through the Go SDK and `tool.provider`/`tools/call`.
- Mutating/destructive external tools policy: accepted option A. MVP allows read-only, mutating, open-world, and destructive extension/MCP tools only behind explicit policy gates. `approve-reads` applies only to read-only tools; mutating/open-world/destructive tools require explicit allow by `ToolID`/toolset/source, ACP ceiling, approval bridge, hooks, session lineage, source-tier grants, and dispatch-time revalidation.

State:

- Existing `_techspec.md` patched in place with accepted execution-model changes and round2 peer-review blockers resolved. Final checks and `make verify` passed.

Done:

- Loaded user request and relevant skill instructions.
- Created `.compozy/tasks/tools-registry/analysis/` and `.compozy/tasks/tools-registry/adrs/`.
- Dispatched read-only competitor research for `.resources/hermes`, `.resources/claude-code`, `.resources/openclaw`, and `.resources/goclaw`.
- Corrected OpenFang note: `.resources/openfang` exists in this checkout, but ACP inventory found no meaningful ACP evidence.
- Started reading `docs/ideas/from-claude-code` analysis, especially `analysis_tool_system.md`, `analysis_prompt_architecture.md`, `analysis_query_engine.md`, `analysis_services_infra.md`, and `filtered_recommendations.md`.
- Received all competitor research results.
- Wrote analysis files under `.compozy/tasks/tools-registry/analysis/`: AGH current state, Hermes, Claude Code, GoClaw, OpenClaw, local Claude Code ideas, and synthesis.
- Captured ADR-001 for the extension tool execution boundary.
- Captured ADR-002 for AGH-hosted MCP plus CLI/HTTP/UDS session exposure.
- Captured ADR-003 for runtime registry package boundary.
- Captured ADR-004 for MVP native tool scope.
- Captured ADR-005 for integrating registry/tool policy with existing ACP approval policy.
- Captured ADR-006 for tool visibility by surface.
- Completed subagent-backed ACP research for `rayclaw`, `harnss`, `acpx`, `openclaw`, `opencode`, and full `.resources/*` ACP inventory.
- Wrote `.compozy/tasks/tools-registry/analysis/analysis_acp_tool_registry_compatibility.md`.
- Updated `.compozy/tasks/tools-registry/analysis/synthesis.md` with ACP/MCP identity and collision implications.
- Captured ADR-007 for canonical ToolID format using reserved `__` namespace separators.
- Updated synthesis and ACP compatibility analysis to replace dotted/internal-plus-wire-alias naming with one canonical provider-safe `ToolID`.
- Saved approved TechSpec at `.compozy/tasks/tools-registry/_techspec.md`.
- Verified saved artifacts with `git diff --check -- .compozy/tasks/tools-registry .codex/ledger/2026-04-28-MEMORY-tools-registry-techspec.md`.
- Ran `make verify` successfully: Bun lint/typecheck/test/build, Go lint/test/build, and boundaries passed; final output reported 6470 Go tests and `OK: all package boundaries respected`.
- Attempted `cy-spec-peer-review` preflight. Resolved path to `.compozy/tasks/tools-registry/_techspec.md`, but did not run Opus because required quality markers are missing.
- Added required peer-review quality markers to `_techspec.md`: MVP Boundary Statement, Architectural Boundaries, final-shape Go interfaces, Data-Model Field Rationale, Side-Table vs JSON Decisions, Test Strategy, Implementation Steps, and Safety Invariants.
- Wrote `.compozy/tasks/tools-registry/qa/peer-review-prompt.md`.
- Ran `compozy exec --ide claude --model opus --reasoning-effort xhigh --format json --prompt-file .compozy/tasks/tools-registry/qa/peer-review-prompt.md`, captured stream at `qa/peer-review-result.json`, stderr at `qa/peer-review-result.err`, and extracted `qa/peer-review-verdict.json`.
- Opus verdict: `NEEDS_REWORK`, 4 blockers, 10 nits.
- Resolved blockers inline: hosted MCP auth, hosted MCP approval bridge, exact MVP task tool set/authority routes, and descriptor-only MVP boundary for external extension backends.
- Addressed all 10 nits inline and recorded them in `_techspec.md` `## Nits`.
- Wrote `.compozy/tasks/tools-registry/qa/peer-review-summary.md`.
- Verified post-review artifacts with `git diff --check -- .compozy/tasks/tools-registry .codex/ledger/2026-04-28-MEMORY-tools-registry-techspec.md`.
- Re-ran `make verify` successfully after peer-review edits: final output reported 6470 Go tests and `OK: all package boundaries respected`.
- Completed read-only MCP/auth explorer audit (`019dd552-61d1-7e11-b6f2-4725d3790ec0`). Verdict: spec was partially aligned but under-specified existing `internal/mcp/auth`, `agh mcp auth`, settings `auth_status`, config/MCP sidecars, ACP stdio-only conversion, skill/extension MCP source limits, and redaction tests.
- Patched `_techspec.md` to explicitly consume existing `internal/mcp/auth` and `globaldb.mcp_auth_tokens`, separate `hosted_mcp_bind_token` from remote OAuth tokens and `approval_token`, map `mcpauth.StatusValue` to registry reason codes, preserve existing MCP config/source lifecycle, call out `cloneDaemonMCPServer` `Transport`/`URL`/`Auth` preservation, call out `internal/acp.toSDKMCPServers` stdio-only limitation, link existing `agh mcp auth` and `/api/settings/mcp-servers` surfaces, and add focused tests/invariants.
- `python3 .agents/skills/cy-spec-preflight/scripts/check-techspec-markers.py .compozy/tasks/tools-registry/_techspec.md` passed.
- `git diff --check -- .compozy/tasks/tools-registry/_techspec.md .codex/ledger/2026-04-28-MEMORY-tools-registry-techspec.md` passed.
- Re-ran `make verify` after MCP/auth spec edits. Passed: Bun lint/typecheck/test/build, Go lint/test/build, and boundaries; final output reported 6470 Go tests and `OK: all package boundaries respected`.
- Re-opened after user rejected descriptor-only extension tools as insufficient.
- Spawned three read-only explorer subagents for current TechSpec/ADR deltas, extension runtime/SDK architecture, and tools/MCP/policy architecture.
- Subagent convergence:
  - Current `_techspec.md` and ADR-001 incorrectly turn extension tools into descriptor-only MVP entries.
  - Existing extension runtime already supports executable subprocess JSON-RPC handlers through `Extension.handle(...)`, `capabilities.provides`, Host API grants, health checks, and `process.Call`.
  - Correct model separates cold `tool` resources from runtime `Descriptor` and executable `Handle`.
  - MVP should support `native_go` built-in function tools and executable `extension_host` tools via `tool.provider` + `tools/call`.
  - Third-party extension code must stay out-of-process; Go extension authoring should mean compiled subprocess extension unless it is first-party daemon code.
  - Hosted MCP remains the session exposure path, but every call re-enters `internal/tools.Registry.Call`.
  - Remote MCP auth/config must remain owned by existing `internal/mcp/auth` and settings surfaces.
- User answered all four TechSpec clarification questions:
  - MVP includes executable `native_go`, executable `extension_host`, and remote MCP call-through.
  - Extension descriptors are manifest-authoritative with runtime reconciliation.
  - MVP includes a public Go subprocess extension SDK for tool providers.
  - MVP allows read-only, mutating, open-world, and destructive extension/MCP tools behind explicit policy/approval gates.
- Rewrote ADR-001 to remove descriptor-only extension tool MVP and define `native_go`, `extension_host`, and `mcp` executable backend classes.
- Updated ADR-002, ADR-003, ADR-004, and ADR-005 to align session exposure, package boundaries, MVP scope, and policy with executable extension/MCP tools.
- Added ADR-008 for manifest-authoritative extension tool descriptors with runtime reconciliation.
- Added ADR-009 for the public Go extension tool SDK.
- Added ADR-010 for remote MCP call-through in MVP.
- `git diff --check -- .compozy/tasks/tools-registry/adrs .codex/ledger/2026-04-28-MEMORY-tools-registry-techspec.md` passed.
- User clarified that the existing TechSpec must be modified, not replaced/recreated.
- Patched existing `.compozy/tasks/tools-registry/_techspec.md` in place:
  - MVP now includes executable `native_go`, executable `extension_host`, and executable `mcp` backends.
  - Removed operational descriptor-only/post-MVP wording for `extension_host` and `mcp`.
  - Added manifest-authoritative extension runtime reconciliation, TypeScript `extension.tool(...)`, public Go extension SDK, `tool.provider`, `provide_tools`, and `tools/call`.
  - Added daemon-owned remote MCP call-through through existing MCP config/auth.
  - Updated tests, implementation steps, safety invariants, impact analysis, and ADR list.
- Ran `compozy exec --ide claude --model opus --reasoning-effort xhigh --format json --prompt-file .compozy/tasks/tools-registry/qa/peer-review-prompt-round2.md`.
- Round2 verdict was `NEEDS_REWORK` with blockers B-001..B-005 and nits N-001..N-008.
- Resolved round2 blockers/nits in place:
  - Added extension wire contracts and protocol constants.
  - Added RFC 8785/JCS schema digest contract and fixtures.
  - Added `MCPCallExecutor` owned by `internal/mcp`.
  - Replaced hosted MCP bearer bind token design with non-secret bind nonce plus UDS peer credential and AGH binary validation.
  - Added approval timeout/cancellation config, reason codes, and tests.
  - Added `trusted_sources`, `id_too_long`, acpmock/Playwright fixture requirements, coverage/race note, hook delete targets, and child task lineage enforcement.
  - Updated ADR-005, ADR-008, ADR-009, and ADR-010.
  - Wrote `.compozy/tasks/tools-registry/qa/peer-review-summary-round2.md`.
- Final checks passed:
  - `python3 .agents/skills/cy-spec-preflight/scripts/check-techspec-markers.py .compozy/tasks/tools-registry/_techspec.md`
  - custom whitespace/final-newline check for TechSpec, ADRs, QA Markdown, and ledger
  - `make verify` passed with Bun lint/typecheck/test/build, Go lint/test/build, and package boundaries; final output reported 6470 Go tests and `OK: all package boundaries respected`.

Now:

- Ready for user review. No further Opus confirmation round was run after resolving round2 blockers.

Next:

- If requested, run a round3 Opus confirmation review.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.compozy/tasks/tools-registry/analysis/`
- `.compozy/tasks/tools-registry/adrs/`
- `.compozy/tasks/tools-registry/adrs/adr-001-extension-tool-execution-boundary.md`
- `.compozy/tasks/tools-registry/adrs/adr-002-session-tool-exposure-path.md`
- `.compozy/tasks/tools-registry/adrs/adr-003-runtime-registry-package-boundary.md`
- `.compozy/tasks/tools-registry/adrs/adr-004-mvp-native-tool-scope.md`
- `.compozy/tasks/tools-registry/adrs/adr-005-acp-approval-policy-integration.md`
- `.compozy/tasks/tools-registry/adrs/adr-006-tool-visibility-by-surface.md`
- `.compozy/tasks/tools-registry/adrs/adr-007-canonical-tool-id-format.md`
- `.compozy/tasks/tools-registry/adrs/adr-008-manifest-authoritative-extension-tool-descriptors.md`
- `.compozy/tasks/tools-registry/adrs/adr-009-public-go-extension-tool-sdk.md`
- `.compozy/tasks/tools-registry/adrs/adr-010-remote-mcp-call-through.md`
- `.compozy/tasks/tools-registry/analysis/synthesis.md`
- `.compozy/tasks/tools-registry/analysis/analysis_acp_tool_registry_compatibility.md`
- `.compozy/tasks/tools-registry/_techspec.md`
- `.compozy/tasks/tools-registry/qa/peer-review-prompt.md`
- `.compozy/tasks/tools-registry/qa/peer-review-result.json`
- `.compozy/tasks/tools-registry/qa/peer-review-result.err`
- `.compozy/tasks/tools-registry/qa/peer-review-verdict.json`
- `.compozy/tasks/tools-registry/qa/peer-review-summary.md`
- `docs/ideas/from-claude-code/analysis_tool_system.md`
- `docs/ideas/from-claude-code/filtered_recommendations.md`
- `.codex/ledger/2026-04-28-MEMORY-tools-registry-techspec.md`
- Subagents: `019dd56b-1436-7b92-bc47-05d5a92d7f7e`, `019dd56b-1597-71a1-b3c5-497b3ab2316b`, `019dd56b-1707-77b0-81ba-383d3998d56d`
