Goal (incl. success criteria):

- Produce a reviewed-and-approved TechSpec for the lifecycle hooks work cited as `techspec-likecycle-hooks` in `.compozy/tasks/extensability/analysis.md`, and save the approved artifact plus ADRs under `.compozy/tasks/hooks/`.
- Success means: codebase-informed design, user-answered technical questions, at least one ADR, complete TechSpec draft presented for approval before any file is written.

Constraints/Assumptions:

- Must follow the `cy-create-techspec` skill hard gate: do not write `.compozy/tasks/hooks/_techspec.md` until all phases are complete and the user approves the final draft.
- Runtime is in Default collaboration mode, so the blocking question tool from the skill is unavailable; ask one question as the complete assistant message and wait.
- User explicitly allowed creation of docs in `.compozy/tasks/hooks` and said analysis docs may be referenced.
- User preference: conversation in Brazilian Portuguese; generated artifacts stay in English.
- User preference: whenever options are presented, mark the recommended choice explicitly with `(recomendado)`.
- Relevant architecture guidance comes from root `AGENTS.md`, `CLAUDE.md`, `.compozy/tasks/extensability/analysis.md`, and existing hook/session code.
- User explicitly requested subagent support for comparing `.resources/hermes` and `.resources/pi`; explorer agent `Einstein` was used and has completed.
- User explicitly requested another `gpt-5.4-mini` explorer pass to test whether the proposed hook surface is too small for the extensibility promised in AGH docs.

Key decisions:

- Treat the requested scope as the P0 lifecycle hook system described in `.compozy/tasks/extensability/analysis.md` despite the typo `likecycle`.
- Reuse current `internal/skills.HookRunner` and session/daemon lifecycle as the design baseline instead of inventing a separate hook subsystem.
- Do local codebase exploration directly; do not spawn sub-agents because the user did not explicitly authorize delegation.
- User selected architecture boundary `B`: define the core hook pipeline now and also formalize an executor seam so future Wasm/extension executors can plug in without redesigning the contract.
- User selected taxonomy option `A`: adopt dotted hook names as the official naming scheme immediately.
- User selected failure policy `C`: pre-hooks are fail-open by default, with fail-closed enforcement only when a hook is explicitly marked `required`; post-hooks remain fail-open and explicit deny always blocks.
- User selected mutation model `B`: hook points expose narrow, typed patch surfaces instead of whole-payload replacement.
- User selected framing `C`: this TechSpec should be robust and comprehensive enough to drive implementation, not just document a tiny initial hook subset.
- User selected execution/declaration richness `C`: the hook contract should support dual-mode dispatch (`sync` and `async`) plus matcher/priority/timeout/required-style metadata.
- User selected declaration sources `C`: Go-native callbacks, skills, settings/config, and agent definitions are all in scope for this TechSpec.

State:

- Complete. Approved draft persisted to `.compozy/tasks/hooks/` with ADRs.

Done:

- Read the `cy-create-techspec` skill instructions supplied in the prompt.
- Scanned existing ledgers for cross-agent awareness, especially `2026-04-07-MEMORY-hookrunner-dispatch.md` and `2026-04-07-MEMORY-mcp-hooks-integration.md`.
- Read `.compozy/tasks/extensability/analysis.md`, the ADR template, the TechSpec template, and an existing example TechSpec in `.compozy/tasks/web-ui-redesign/_techspec.md`.
- Inspected current hook implementation in `internal/skills/hooks.go`, hook metadata loading in `internal/skills/loader.go`, daemon hook dispatch in `internal/daemon/notifier.go`, and session lifecycle in `internal/session/manager_lifecycle.go` and `internal/session/session.go`.
- Confirmed current behavior: subprocess-only skill hooks, only `on_session_created` and `on_session_stopped`, fail-open execution, and no runtime blocking/modification semantics.
- Asked architecture-boundary question and captured answer `B` (core pipeline plus extension-ready executor seam).
- Inspected `internal/skills/types.go`, `internal/session/manager_prompt.go`, `internal/session/manager_helpers.go`, and `internal/session/interfaces.go` to map where `session.pre_prompt`, `session.pre_create`, and `event.post_record` would integrate.
- Asked naming/taxonomy question and captured answer `A` (dotted names adopted immediately).
- Inspected `parseHookDecls` in `internal/skills/loader.go` and confirmed current hook metadata only models `event`, `command`, `args`, `timeout`, and `env`.
- Asked failure-policy question and captured answer `C` (hybrid fail-open with explicit `required` enforcement on critical pre-hooks).
- Read `.compozy/tasks/extensability/analysis/analysis_hermes.md` and `.compozy/tasks/extensability/analysis/analysis_pi_mono.md` while the explorer subagent inspects local `.resources/hermes` and `.resources/pi`.
- Confirmed local resource roots exist at `.resources/hermes` and `.resources/pi`.
- Inspected Pi extension internals in `.resources/pi/packages/coding-agent/src/core/extensions/{types.ts,runner.ts}`:
  - `tool_call` allows in-place mutation of typed `event.input` plus typed block result.
  - `tool_result` allows partial typed overrides (`content`, `details`, `isError`).
  - `before_agent_start` chains structured additions (`message`, `systemPrompt`).
- Inspected Hermes hook/plugin internals in `.resources/hermes/{gateway/hooks.py,model_tools.py,cli.py}` and Hermes hook docs:
  - gateway hooks and most plugin hooks are observational/side-effect-only with ignored return values;
  - `pre_llm_call` is the notable exception and supports context injection;
  - errors are caught/logged and do not block the main pipeline.
- Asked mutation-model question and captured answer `B` (typed patch surfaces per hook point).
- Inspected hook/event definitions across additional local resources to identify common hook points:
  - Claude Code: `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `SessionStart`, `Stop`, `SubagentStop`, `UserPromptSubmit`, `Notification`, `PermissionRequest`, `PermissionDenied`, `Setup`, `FileChanged`, `CwdChanged`, `WorktreeCreate`.
  - Pi: `session_start`, `before_agent_start`, `agent_start/end`, `turn_start/end`, `message_start/update/end`, `tool_call`, `tool_result`, `session_before_switch`, `session_before_fork`, `session_before_compact`, `session_shutdown`, plus resource/context/provider hooks.
  - GoClaw: core Go-native callback hooks around bootstrap/context loading (`EnsureUserFilesFunc`, `SeedUserFilesFunc`, `ContextFileLoaderFunc`, `BootstrapCleanupFunc`) plus blocking quality/security hooks discussed in docs.
  - Hermes: `gateway:startup`, `session:start/end/reset`, `agent:start/step/end`, `on_processing_start`, `on_processing_complete`, and plugin hooks `pre_llm_call`, `on_session_finalize`, `on_session_reset`.
- Cross-project pattern confirmed: the most common load-bearing hooks cluster around session boundaries, pre-input/pre-tool execution, tool result/post-processing, and agent/turn lifecycle; file/watcher and platform/webhook-specific hooks are secondary.
- Used `qmd status` successfully and confirmed local collections relevant to this task (`agh-compozy`, `agh-docs`, `claude-code`, `pi-mono`, `goclaw`, `hermes`).
- `qmd query` semantic mode failed locally due missing SQLite `vec0` module, so fallback is lexical `qmd search` + direct doc reads.
- `qmd search` and `qmd get` confirmed AGH's own docs position hooks as foundational to extensibility, especially:
  - `tasks/extensability/analysis.md` — hooks come before extension architecture and tool registry depends on hook pipeline.
  - `rfcs/002-skills-system-final.md` and archived `skills-v2/techspec.md` — lifecycle hooks are already treated as a first-class runtime feature, even if current scope was narrower.
  - `analysis-claude-code.md` and `analysis-goclaw.md` — typed hook bus / typed function hooks are explicitly recommended as core patterns for AGH.
- Additional benchmark/docs confirmation:
  - `claude-code/wiki/concepts/hook-system.md` describes hooks as the primary extensibility surface with 25+ lifecycle events, especially session, tool, input, permission, and compaction hooks.
- Direct resource inspection already showed Pi/Hermes/GoClaw converge on rich session/input/agent/tool seams even when individual implementations differ.
- Working conclusion: a small v1 implementation may be reasonable, but the TechSpec likely needs a richer hook taxonomy than the original six-event proposal if it is meant to reflect AGH's documented extensibility ambitions.
- Asked execution/declaration richness question and captured answer `C` (dual-mode hook contract with sync/async dispatch and richer metadata).
- Asked declaration-sources question and captured answer `C` (Go-native + skills + settings/config + agent definitions).
- Drafted the full TechSpec and four ADRs for review.
- Captured user approval (`A`).
- Wrote `.compozy/tasks/hooks/_techspec.md`.
- Wrote `.compozy/tasks/hooks/adrs/adr-001.md` through `adr-004.md`.
- Verified the saved files exist on disk.

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None that block drafting. Residual implementation details can be resolved inside the draft as proposed defaults.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-09-MEMORY-lifecycle-hooks-spec.md`
- `.compozy/tasks/extensability/analysis.md`
- `.agents/skills/cy-create-techspec/references/techspec-template.md`
- `.agents/skills/cy-create-techspec/references/adr-template.md`
- `internal/skills/hooks.go`
- `internal/daemon/notifier.go`
- `internal/session/manager_lifecycle.go`
- `internal/session/session.go`
- `.compozy/tasks/extensability/analysis/analysis_hermes.md`
- `.compozy/tasks/extensability/analysis/analysis_pi_mono.md`
- `.resources/hermes`
- `.resources/pi`
- Commands used: `rg`, `sed`, `ls`, `date`
