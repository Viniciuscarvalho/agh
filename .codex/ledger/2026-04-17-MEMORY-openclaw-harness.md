Goal (incl. success criteria):

- Inspect `.resources/openclaw` and report how the harness chooses execution modes, prompt modes, bootstrap/context files, and subagent/cron/background behavior.
- Success means a concise, evidence-based answer with exact files/functions/docs and a clear split between implicit defaults and config/env overrides.

Constraints/Assumptions:

- Read-only analysis only; do not modify repo product files.
- Prefer local source/docs over web.
- Keep repo-root-relative file references in the final answer.

Key decisions:

- Anchor the report on source-of-truth code in `src/agents/*` plus the matching docs in `docs/*`.
- Treat prompt mode, bootstrap mode, and embedded harness selection as separate layers.

State:

- Evidence gathered; ready to synthesize.

Done:

- Read repo guidance in `.resources/openclaw/AGENTS.md`, `src/agents/AGENTS.md`, and docs instructions.
- Traced prompt mode selection, bootstrap file loading/filtering, subagent spawn defaults, and embedded harness selection.
- Collected line-numbered evidence from the relevant code/docs.

Now:

- Summarize the findings in the requested four-part format.

Next:

- If needed, tighten wording against the exact evidence and verify the final answer stays concise.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether the user expects “background run behavior” to mean `exec/process` guidance, subagent session persistence, or both. Current evidence covers both the prompt guidance and subagent/session semantics.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-17-MEMORY-openclaw-harness.md`
- `.resources/openclaw/src/agents/system-prompt.ts`
- `.resources/openclaw/src/agents/bootstrap-mode.ts`
- `.resources/openclaw/src/agents/bootstrap-files.ts`
- `.resources/openclaw/src/agents/workspace.ts`
- `.resources/openclaw/src/agents/pi-embedded-runner/run/attempt.prompt-helpers.ts`
- `.resources/openclaw/src/agents/pi-embedded-runner/run/attempt-bootstrap-routing.ts`
- `.resources/openclaw/src/agents/pi-embedded-runner/run/attempt.context-engine-helpers.ts`
- `.resources/openclaw/src/agents/subagent-spawn.ts`
- `.resources/openclaw/src/agents/tools/sessions-spawn-tool.ts`
- `.resources/openclaw/src/agents/harness/selection.ts`
- `.resources/openclaw/src/agents/pi-embedded-runner/runtime.ts`
- `.resources/openclaw/docs/concepts/system-prompt.md`
- `.resources/openclaw/docs/concepts/context.md`
- `.resources/openclaw/docs/gateway/configuration-reference.md`
- `.resources/openclaw/docs/plugins/sdk-agent-harness.md`
