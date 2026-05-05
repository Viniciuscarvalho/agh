## Goal (incl. success criteria):

- Decompose `.compozy/tasks/bridge-adapters/_techspec.md` into independently implementable task files under `.compozy/tasks/bridge-adapters/`.
- Success = present an approved task breakdown with explicit dependencies and complexity, then generate `_tasks.md` plus enriched `task_XX.md` files that pass `compozy validate-tasks --name bridge-adapters`.

## Constraints/Assumptions:

- User explicitly invoked `$cy-create-tasks`; must follow the skill workflow and wait for approval before generating task files.
- `.compozy/config.toml` is absent, so allowed task types fall back to built-in defaults: `frontend`, `backend`, `docs`, `test`, `infra`, `refactor`, `chore`, `bugfix`.
- `.compozy/tasks/bridge-adapters/_prd.md` is absent; tasks must derive from the TechSpec, ADRs, and codebase exploration without inventing product requirements.
- Developer policy forbids spawning subagents unless the user explicitly asks for delegation, so codebase exploration is being done locally rather than with agent tool calls mentioned by the skill.

## Key decisions:

- Use `architectural-analysis` skill workflow selectively for structured spec/code cross-checking.
- Scope evidence to the bridge tech spec, sibling ADRs, relevant ledgers, and current code paths under `internal/bridges`, `internal/extension`, `internal/daemon`, `internal/api`, and `web/src/systems/bridges` only if needed.
- Brainstorming decision: choose provider-scoped bridge runtimes. One subprocess runs per provider extension and multiplexes multiple bridge instances/tenants internally.
- Brainstorming decision: use a narrowed v1 bridge protocol. Core conversational flows stay first-class, and typed optional interaction events cover high-value `commands`, `actions`, and `reactions`; full chat-sdk parity stays out of scope for v1.
- Brainstorming decision: store adapter/provider-specific runtime config on each bridge instance in a dedicated config blob/schema, separate from `delivery_defaults` and extension manifest metadata.

## State:

- Completed.

## Done:

- Read workspace instructions and skill guidance.
- Listed bridge-adapters task files and ledger inventory.
- Identified adjacent historical ledgers for channel/bridge architecture and rename work.
- Read `.compozy/tasks/bridge-adapters/_techspec.md` and ADR-001..003.
- Cross-checked the spec against current bridge runtime, extension manifest schema, bridge transport types, provider/secret-binding APIs, and the `sdk/examples/telegram-reference` adapter.
- Confirmed multiple material gaps: current runtime allows only one enabled bridge instance per extension; bridge instance/runtime types do not model adapter-specific config; outbound delivery contract only covers text-stream events plus typed target selection; webhook-port provisioning is not implemented anywhere outside the spec.
- Confirmed internal spec contradictions: Teams is described as multi-tenant in overview but single-tenant in the feature matrix; Telegram webhook verification mentions a webhook secret but the secret table omits it; the spec claims extraction from telegram-reference while impact analysis says the reference stays unchanged.
- User selected runtime option `A`: provider-scoped subprocesses with internal multiplexing for multiple bridge instances/tenants.
- User accepted the recommended middle-ground protocol direction: conversational bridge core plus typed high-value interaction events, without full UI/modal/ephemeral parity in v1.
- User selected configuration option `A`: per-instance adapter config in a dedicated field/schema.
- Reviewed external research summary covering `.resources/{goclaw,hermes,openclaw}` and identified additions that fit the accepted bridge design.
- Classified research additions:
  - Add to v1 spec: inbound message batching/debounce, multi-layer webhook defenses, platform-error classification with recovery actions, adapter-local dedup cache, DM access policy, structured degradation reasons.
  - Optional/low-priority in v1: platform capability hints for prompt/context injection.
  - Future phase only: credential pool rotation, two-lane reasoning/answer rendering, platform-native approval UI/event families.
- User approved the proposed selection of which research findings should enter v1 versus be deferred.
- Persisted the approved design to `docs/plans/2026-04-15-bridge-adapters-design.md`.
- Rewrote `.compozy/tasks/bridge-adapters/_techspec.md` around provider-scoped runtimes, `provider_config`, narrowed bridge v1 scope, and shared SDK operational hardening.
- Replaced ADR-001..003 with the approved decisions:
  - provider-scoped bridge SDK/runtime
  - hardened webhook + REST provider communication
  - bridge v1 scope instead of full chat-sdk parity
- Performed a consistency pass to confirm the old contradictory claims are no longer presented as active design decisions.
- Ran `make verify` successfully after the documentation rewrite.
- Read `.agents/skills/cy-create-tasks/SKILL.md` plus `references/task-template.md` and `references/task-context-schema.md`.
- Confirmed no `.compozy/config.toml` exists in the workspace, so task-type defaults apply.
- Confirmed `.compozy/tasks/bridge-adapters/_prd.md` does not exist; this task set will be TechSpec-driven.
- Mapped the main implementation surfaces for bridge-adapters:
  - `internal/bridges`
  - `internal/daemon/bridges.go`
  - `internal/extension/{manager.go,manifest.go,host_api_bridges.go,protocol/host_api.go}`
  - `internal/subprocess/handshake.go`
  - `internal/api/{contract,core,httpapi,udsapi}`
  - `internal/store/globaldb/global_db_bridge.go`
  - `internal/extensiontest/bridge_adapter_harness.go`
  - `sdk/examples/telegram-reference/*`
  - `web/src/systems/bridges/*` and `web/src/routes/_app/bridges.tsx`
- Confirmed the current code is still instance-scoped in the exact places the TechSpec says must change:
  - `internal/subprocess.InitializeBridgeRuntime` carries a single `Instance`
  - `internal/daemon/bridges.go` resolves exactly one enabled instance per extension
  - `internal/extension/host_api_bridges.go` authorizes Host API calls against one runtime-bound instance
  - `internal/bridges/types.go`, `internal/api/contract/bridges.go`, `internal/store/globaldb/global_db_bridge.go`, and the web bridge UI do not model `provider_config` or provider-declared required secret/config metadata
  - `sdk/examples/telegram-reference` and `internal/extensiontest/bridge_adapter_harness.go` encode the old single-instance handshake contract
- Proposed and got approval for a 17-task decomposition spanning substrate/runtime work, API/UI surfacing, provider conformance, and one task per provider implementation.
- Wrote `.compozy/tasks/bridge-adapters/_tasks.md` and enriched `task_01.md` through `task_17.md` using the Compozy task template.
- Fixed YAML frontmatter title quoting and title/H1 synchronization issues reported by the validator.
- Ran `compozy validate-tasks --name bridge-adapters` successfully with `all tasks valid (17 scanned)`.
- Ran `make verify` successfully after generating the task files.

## Now:

- Task complete.

## Next:

- None.

## Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether prompt/context capability hints should be represented in any near-term task or remain only an implementation note outside the first task set.

## Working set (files/ids/commands):

- `.compozy/tasks/bridge-adapters/_techspec.md`
- `.compozy/tasks/bridge-adapters/_tasks.md`
- `.compozy/tasks/bridge-adapters/task_01.md`
- `.compozy/tasks/bridge-adapters/task_02.md`
- `.compozy/tasks/bridge-adapters/task_03.md`
- `.compozy/tasks/bridge-adapters/task_04.md`
- `.compozy/tasks/bridge-adapters/task_05.md`
- `.compozy/tasks/bridge-adapters/task_06.md`
- `.compozy/tasks/bridge-adapters/task_07.md`
- `.compozy/tasks/bridge-adapters/task_08.md`
- `.compozy/tasks/bridge-adapters/task_09.md`
- `.compozy/tasks/bridge-adapters/task_10.md`
- `.compozy/tasks/bridge-adapters/task_11.md`
- `.compozy/tasks/bridge-adapters/task_12.md`
- `.compozy/tasks/bridge-adapters/task_13.md`
- `.compozy/tasks/bridge-adapters/task_14.md`
- `.compozy/tasks/bridge-adapters/task_15.md`
- `.compozy/tasks/bridge-adapters/task_16.md`
- `.compozy/tasks/bridge-adapters/task_17.md`
- `.agents/skills/cy-create-tasks/SKILL.md`
- `.agents/skills/cy-create-tasks/references/task-template.md`
- `.agents/skills/cy-create-tasks/references/task-context-schema.md`
- `.compozy/tasks/bridge-adapters/adrs/adr-001.md`
- `.compozy/tasks/bridge-adapters/adrs/adr-002.md`
- `.compozy/tasks/bridge-adapters/adrs/adr-003.md`
- `docs/plans/2026-04-15-bridge-adapters-design.md`
- `.codex/ledger/2026-04-10-MEMORY-channel-adapters-review.md`
- `.codex/ledger/2026-04-13-MEMORY-network-rename-plan.md`
- `internal/daemon/bridges.go`
- `internal/bridges/types.go`
- `internal/store/globaldb/global_db_bridge.go`
- `internal/bridges/delivery_types.go`
- `internal/bridges/target.go`
- `internal/extension/manifest.go`
- `internal/extension/host_api_bridges.go`
- `internal/subprocess/handshake.go`
- `internal/api/core/bridges.go`
- `internal/api/contract/bridges.go`
- `internal/extension/protocol/host_api.go`
- `internal/extensiontest/bridge_adapter_harness.go`
- `sdk/examples/telegram-reference/{extension.toml,main.go}`
- `web/src/systems/bridges/{types.ts,adapters/bridges-api.ts,components/bridge-create-dialog.tsx}`
- Commands: `rg`, `sed`, `ls`, `find`, `compozy validate-tasks --name bridge-adapters`, `make verify`
