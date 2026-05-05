Goal (incl. success criteria):

- Author a new TechSpec under `.compozy/tasks/tools-refac/_techspec.md` that defines the final canonical AGH tool surface after the initial `tools-registry` implementation.
- Success means the spec is grounded in current code and prior `tools-registry` artifacts, resolves the CLI-vs-tool ambiguity, defines final agent/operator boundaries, includes ADRs, and is approved by the user before being written.
- After TechSpec finalization, generate `.compozy/tasks/tools-refac/_tasks.md` and
  `task_NN.md` files that decompose the follow-up implementation into
  independently implementable tasks with QA tail coverage.
- Correction on 2026-04-29: `_techspec.md` and ADRs must be grounded in the
  current branch that already implements `.compozy/tasks/tools-registry`, not
  `main`. Any regenerated tasks must be derived from that corrected baseline.

Constraints/Assumptions:

- Follow `cy-spec-preflight` + `cy-create-techspec`; do not write the TechSpec until all clarification phases are complete and the user approves the final draft.
- Conversation in BR-PT; artifacts in English.
- No destructive git commands without explicit user permission.
- Final-state thinking only; do not frame this as an MVP patch.
- No `_prd.md` currently exists for `tools-refac`; user supplied prior discussion is the input context.
- `.compozy/config.toml` is absent in this workspace, so task types fall back to
  the built-in defaults:
  `frontend`, `backend`, `docs`, `test`, `infra`, `refactor`, `chore`,
  `bugfix`.
- The previous assumption that the `tools-registry` foundation was not present
  in `internal/tools` was wrong. The current branch already contains the
  registry core, hosted MCP transport, approval bridge, built-in tool MVP, CLI
  operator surfaces, contracts, docs, and SDK groundwork from
  `.compozy/tasks/tools-registry`.

Key decisions:

- Use `.compozy/tasks/tools-registry/_techspec.md`, its ADRs, prior ledgers, and the user-provided prior discussion as the baseline context.
- Treat the new spec as a structural redesign follow-up under the two-touch rule, not as an incremental amendment to the existing TechSpec.
- Preserve the repo rule that tools must stay extensible and agent-manageable through CLI/HTTP/UDS parity and explicit policy analysis.
- Agent access posture: `tools-first by convention`. Do not design sandbox or driver-level blocking of `agh` inside shell tools; Bash behavior is native to each ACP driver. The TechSpec should define the preferred AGH-internal path as dedicated tools, while acknowledging shell access may still exist.
- Authority boundary: identity-bound autonomy/task execution operations (`run_claim_next`, `run_heartbeat`, `run_complete`, `run_fail`, `run_release`) should become dedicated agent-callable tools that reuse the existing authoritative writers. Spawn, cross-session terminal-state mutation, and daemon/session lifecycle control remain operator-only.
- Discovery default: all agents receive `agh__bootstrap` + `agh__catalog` by default unless effective policy explicitly narrows or denies them.
- Agent guidance surface: add both a bundled `agh-tools-guide` skill and a new startup prompt section `tools`.
- Registry policy model: recompute effective policy per call for `list/search/get/call` from current agent definition, session lineage, scope, source policy, availability, and hooks. Discovery filtering is UX; dispatch revalidation remains authoritative. Caches are allowed only as invalidatable accelerators.
- MCP auth surface: expose status as an agent-callable tool, but keep login/logout on operator/management surfaces (CLI/HTTP/UDS) because OAuth/browser re-auth flows are a distinct interactive management path.

State:

- TechSpec finalized in `.compozy/tasks/tools-refac/_techspec.md`. The preview
  artifact was removed after finalization.
- The user identified that the spec had been authored against the wrong
  baseline (`main`). `_techspec.md` and ADRs are now being corrected to treat
  the current branch `tools-registry` foundation as already shipped. Earlier
  task artifacts are not authoritative until tasks are regenerated from the
  corrected spec.

Done:

- Loaded `cy-spec-preflight` and `cy-create-techspec`.
- Read `docs/_memory/spec-authoring-playbook.md`, `standing_directives.md`, and `glossary.md`.
- Scanned relevant prior ledgers, including `tools-builtin-refactor`, `tools-registry-policy`, `core-tool-contracts`, and `cli-operator-commands`.
- Read `internal/CLAUDE.md` architecture/security sections.
- Read `tools-registry` TechSpec sections relevant to built-ins, task/network scope, extensibility, agent-manageability, and config lifecycle.
- Read ADR-004 (MVP tool scope) and ADR-006 (tool visibility by surface).
- Collected user decision: shell access is not a sandbox concern for this TechSpec; choose `tools-first by convention`, not structural blocking.
- Re-checked current identity-bound task CLI evidence: `agh task next|heartbeat|complete|fail|release` already require agent identity in `internal/cli/task.go`, and `task.Service.ClaimNextRun` remains the authoritative primitive in `internal/task`.
- Collected user decision: identity-bound task execution operations should move into dedicated agent-callable tools; authority-sensitive spawn and cross-session lifecycle operations stay operator-only.
- Collected user decision: discovery toolsets `agh__bootstrap` and `agh__catalog` should be default for all agents.
- Re-checked current prompt surface: startup prompt sections are `situation`, `memory`, `skills`, and `network`; there is no tools prompt section and bundled skills currently include only `agh-agent-setup`, `agh-memory-guide`, `agh-network`, and `agh-session-guide`.
- Collected user decision: add both `agh-tools-guide` and a new startup prompt section `tools`.
- Ran three read-only subagents with `gpt-5.4-mini` over `.resources/claude-code`, `.resources/hermes`, and `.resources/openclaw`.
- Competitor convergence confirmed:
  - `claude-code`: explicit startup `# Using your tools` block and tool-search guidance; tool-first posture; guide is distributed across prompt/tool prompts instead of one dedicated tools guide.
  - `hermes`: startup prompt guidance + tool/runtime docs + explicit tools guide pages; tool-first posture; toolsets are first-class discovery/config surfaces.
  - `openclaw`: dedicated startup `## Tooling` block with policy-filtered inventory; explicit tools guide docs; tool-first posture with a rule to use direct tools instead of equivalent CLI/slash paths.
- Re-checked `claude-code` permission flow for the upcoming AGH policy decision:
  - discovery/model exposure filters tools up front via deny rules and `isEnabled()` in `.resources/claude-code/tools.ts`;
  - request-time API assembly further filters the schema set in `.resources/claude-code/services/api/claude.ts`;
  - dispatch still revalidates input, hook mutations, and permission decisions in `.resources/claude-code/services/tools/toolExecution.ts`;
  - permission evaluation is recomputed at call time in `.resources/claude-code/utils/permissions/permissions.ts`, including deny/ask rules, tool-specific checks, safety checks, mode transforms, and allow rules.
- Collected user decision: effective registry policy must be recomputed per call; discovery-time filtering is not authoritative.
- Collected path-level evidence from `.resources/openclaw` for tools discovery, tool/CLI balance, explicit tools guidance, and startup prompt patterns.
- Collected auth/MCP management patterns from competitors:
  - `claude-code`: MCP re-auth is managed through `/mcp` settings/management surfaces, not as a normal model-callable tool; runtime messages point users back to `/mcp` when authentication is required.
  - `hermes`: MCP OAuth is configured declaratively (`auth: oauth`), opens a browser on first connect, persists tokens under `~/.hermes/mcp-tokens/`, and uses `/reload-mcp` / config changes as the management surface rather than tool-callable login/logout commands.
  - `openclaw`: MCP docs focus on `openclaw mcp serve/list/show/set/unset` plus gateway token/password auth; no evidence of agent-callable MCP OAuth login/logout tools.
- Collected user decision: `mcp auth` final surface is status-only for agents; login/logout remain operator management paths.
- Wrote ADR-005 (`session-bound-autonomy-surface`) to close the raw-`claim_token`
  contract hole across tool/CLI/API surfaces.
- Wrote ADR-006 (`agent-manageable-mutation-default`) to record the final-state
  rule that mutable AGH management surfaces should be tool-callable by default
  unless they cross trust-root, raw-secret, human-interactive, or unsafe
  cross-session boundaries.
- Drafted `.compozy/tasks/tools-refac/_techspec.preview.md`.
- Ran peer review via Claude Opus (`compozy exec --ide claude --model opus --reasoning-effort xhigh --format json --prompt-file .compozy/tasks/tools-refac/qa/peer-review-prompt.md`).
- Recorded peer-review outputs under `.compozy/tasks/tools-refac/qa/`.
- Revised the preview draft to address the six peer-review blockers:
  - concrete delete targets;
  - explicit session-bound autonomy lookup invariants and named lookup primitive;
  - bounded mutating-tool scope and denial codes;
  - concrete Go typed models;
  - stronger cross-session / double-lease tests;
  - explicit single-PR hard-cut statement.
- Incorporated low-cost review nits:
  exact hosted-MCP parity, cache-key invalidation notes, conditional skill/CLI
  guidance, network raw-token rejection, observe/event redaction, log fields,
  and old-vs-new config behavior table.
- Ran `python3 .agents/skills/cy-spec-preflight/scripts/check-techspec-markers.py .compozy/tasks/tools-refac/_techspec.preview.md` and it passed.
- User rejected the overly conservative mutation posture and approved a broader
  `agent-manageable by default` rewrite.
- Revised the preview to widen mutable tool coverage:
  - `agh__config` becomes broadly tool-mutable except trust-root/secret paths;
  - `agh__automation` gets CRUD/history/trigger tool coverage;
  - `agh__extensions` gets search/install/update/remove/enable/disable tool
    coverage subject to source policy and approval;
  - `agh__hooks` gets mutable config/overlay-backed create/update/delete and
    enable/disable coverage while source-owned hooks remain immutable.
- Started a second Claude Opus peer review after the broadened rewrite; the run
  was interrupted and persisted partial output to
  `.compozy/tasks/tools-refac/qa/peer-review-result-round2.json` with stderr in
  `.compozy/tasks/tools-refac/qa/peer-review-result-round2.err`.
- Extracted the three credible round-2 blockers from the partial output:
  hosted MCP authentication/session binding, hosted MCP approval bridge, and
  tighter `agh__task_*` scope/exclusions.
- Patched the preview to inherit hosted MCP authentication and approval-bridge
  semantics explicitly from the `tools-registry` foundation spec and to add a
  contractual `agh__tasks` vs `agh__autonomy` split with exact writer mappings
  and exclusions.
- Re-ran the techspec marker checker after those fixes; it still passes.
- User explicitly ended the review loop and requested finalization.
- Copied `.compozy/tasks/tools-refac/_techspec.preview.md` to
  `.compozy/tasks/tools-refac/_techspec.md`.
- Verified the final file is byte-identical to the preview.
- Deleted `.compozy/tasks/tools-refac/_techspec.preview.md` after finalization
  at the user's request.
- Loaded `cy-create-tasks`, `cy-tasks-tail-qa-pair`, `cy-web-docs-impact`, and
  `cy-spec-preflight`.
- Read `docs/_memory/spec-authoring-playbook.md`,
  `docs/_memory/standing_directives.md`, `docs/_memory/glossary.md`,
  `.agents/skills/cy-create-tasks/references/task-template.md`,
  `.agents/skills/cy-create-tasks/references/task-context-schema.md`,
  `.agents/skills/cy-spec-preflight/references/tasks-checks.md`,
  `.agents/skills/cy-spec-preflight/references/phase-lessons.md`, and the task
  phase lessons `L-002`, `L-007`, `L-009`, and `L-011`.
- Re-read `.compozy/tasks/tools-refac/_techspec.md`, all `tools-refac` ADRs,
  and `analysis/competitor-tool-surface-notes.md`.
- Confirmed there is no `.compozy/tasks/tools-refac/_prd.md`.
- Confirmed there is no `.compozy/config.toml` in the workspace.
- Explored the current codebase and found:
  - current prompt sections only cover `situation`, `memory`, `skills`, and
    `network`;
  - bundled skills currently include only `agh-agent-setup`,
    `agh-memory-guide`, `agh-network`, and `agh-session-guide`;
  - current autonomy contracts still expose raw `claim_token` through
    `internal/api/contract/agents.go`, `internal/api/core/agent_tasks.go`, and
    `internal/cli/task.go`;
  - the current branch already ships the `tools-registry` foundation in
    `internal/tools`, `internal/daemon`, hosted MCP, CLI/HTTP/UDS, config
    lifecycle, docs, and SDK surfaces.
- User reported the baseline mistake explicitly: `tools-refac` must use the
  current branch where `.compozy/tasks/tools-registry/_techspec.md` was
  implemented, not `main`.
- Re-ran branch exploration with `git log --oneline main..HEAD` and
  `git diff --stat main..HEAD`; confirmed the branch already ships the
  `tools-registry` foundation in `internal/tools`, `internal/daemon`,
  hosted MCP, CLI/HTTP/UDS, config lifecycle, docs, and SDK surfaces.
- Ran three read-only `gpt-5.4-mini` explorer subagents over the current
  branch:
  - registry core + policy
  - built-ins + prompt/hosted MCP guidance
  - CLI/contracts/docs/config/extensibility
- Consolidated the main corrections:
  - registry core/policy/approval bridge/hosted MCP already exist in-branch;
  - the shipped built-in subset is `agh__bootstrap`, `agh__catalog`,
    `agh__coordination`, and `agh__tasks`;
  - the spec had invented parallel vocabulary (`ToolCallScope`,
    `ToolSurface`, `EffectivePolicyResolver`) instead of reusing shipped
    contracts (`tools.Scope`, `Registry`, `PolicyEvaluator`);
  - the spec needed a split between current shipped subset and target canonical
    expansion, plus more concrete delete targets for docs/prompt guidance.
- Updated `.compozy/tasks/tools-refac/_techspec.md` to:
  - state the current-branch foundation explicitly in the Executive Summary and
    MVP boundary;
  - reuse current branch contracts in Core Interfaces;
  - split built-ins into current shipped subset vs canonical expansion;
  - preserve `agh__coordination` as the shipped network-facing toolset;
  - align MCP auth status shapes to the existing `tools.MCPAuthStatus` model;
  - expand delete targets to cover docs, prompt assembly, and shipped
    CLI-first guidance.
- Updated ADR-001, ADR-002, ADR-003, ADR-004, and ADR-006 so their context and
  implementation notes reflect the current branch foundation accurately.
- Re-ran `python3 .agents/skills/cy-spec-preflight/scripts/check-techspec-markers.py .compozy/tasks/tools-refac/_techspec.md`; it still passes.
- Re-ran `cy-create-tasks` against the corrected branch-grounded TechSpec.
- Replaced the stale `_tasks.md` with a new 13-task tree grounded in the
  shipped branch baseline:
  - `task_01` dynamic policy resolver + default discovery overlay
  - `task_02` tools guidance assets + startup prompt section
  - `task_03` coordination/session/workspace read surfaces
  - `task_04` memory/observe/bridge read surfaces
  - `task_05` config mutable tool family
  - `task_06` hook management tool family
  - `task_07` automation tool family
  - `task_08` extension lifecycle tool family
  - `task_09` session-bound autonomy tools + claim-token hard cut
  - `task_10` MCP auth status + hosted MCP parity
  - `task_11` site docs + generated references alignment
  - `task_12` QA plan
  - `task_13` real-scenario QA execution
- Wrote `.compozy/tasks/tools-refac/task_01.md` through
  `.compozy/tasks/tools-refac/task_13.md`.
- Embedded explicit `Web/Docs Impact` and
  `Extensibility / Agent Manageability / Config Lifecycle` sections in the
  backend tasks, plus competitor file references where the TechSpec depended on
  `.resources/*`.
- Re-ran `compozy validate-tasks --name tools-refac`; it passed with
  `all tasks valid (13 scanned)`.

Now:

- Report that the branch-grounded `tools-refac` task tree is regenerated and
  validated.

Next:

- Wait for the user's next direction; the natural follow-up is task execution
  starting from `task_01`.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-29-MEMORY-tools-refac.md`
- `.compozy/tasks/tools-refac/adrs/adr-001-agent-tool-surface.md`
- `.compozy/tasks/tools-refac/adrs/adr-002-dynamic-tool-policy-and-projections.md`
- `.compozy/tasks/tools-refac/adrs/adr-003-identity-bound-autonomy-tools.md`
- `.compozy/tasks/tools-refac/adrs/adr-004-mcp-auth-status-tool.md`
- `.compozy/tasks/tools-refac/adrs/adr-005-session-bound-autonomy-surface.md`
- `.compozy/tasks/tools-refac/adrs/adr-006-agent-manageable-mutation-default.md`
- `.compozy/tasks/tools-refac/_techspec.md`
- `git log --oneline main..HEAD`
- `git diff --stat main..HEAD`
- `.compozy/tasks/tools-refac/_tasks.md`
- `.compozy/tasks/tools-refac/task_01.md`
- `.compozy/tasks/tools-refac/task_02.md`
- `.compozy/tasks/tools-refac/task_03.md`
- `.compozy/tasks/tools-refac/task_04.md`
- `.compozy/tasks/tools-refac/task_05.md`
- `.compozy/tasks/tools-refac/task_06.md`
- `.compozy/tasks/tools-refac/task_07.md`
- `.compozy/tasks/tools-refac/task_08.md`
- `.compozy/tasks/tools-refac/task_09.md`
- `.compozy/tasks/tools-refac/task_10.md`
- `.compozy/tasks/tools-refac/task_11.md`
- `.compozy/tasks/tools-refac/task_12.md`
- `.compozy/tasks/tools-refac/task_13.md`
- `.compozy/tasks/tools-registry/_techspec.md`
- `.compozy/tasks/tools-registry/adrs/adr-004-mvp-native-tool-scope.md`
- `.compozy/tasks/tools-registry/adrs/adr-006-tool-visibility-by-surface.md`
- `.codex/ledger/2026-04-25-MEMORY-mcp-auth-security.md`
- `.codex/ledger/2026-04-26-MEMORY-task-claim-lease.md`
- `.codex/ledger/2026-04-29-MEMORY-tools-api-contracts.md`
- `.codex/ledger/2026-04-29-MEMORY-tools-builtin-refactor.md`
- `.codex/ledger/2026-04-28-MEMORY-tools-registry-policy.md`
- `.codex/ledger/2026-04-28-MEMORY-core-tool-contracts.md`
- `.codex/ledger/2026-04-29-MEMORY-cli-operator-commands.md`
- `internal/daemon/prompt_sections.go`
- `internal/daemon/harness_context.go`
- `internal/skills/catalog.go`
- `internal/skills/bundled/skills/agh-network/SKILL.md`
- `internal/cli/mcp_auth.go`
- `internal/cli/task.go`
- `internal/api/core/agent_tasks.go`
- `internal/api/contract/agents.go`
- `internal/cli/root.go`
- `internal/task/interfaces.go`
- `compozy validate-tasks --name tools-refac`
