Goal (incl. success criteria):

- Inspect `.resources/hermes` and report how execution modes, profiles, and roles are chosen automatically vs via user config.
- Success: concise, evidence-based summary with exact files/functions/config keys for:
  1. model-family-specific prompt guidance
  2. delegate/child-agent restrictions and inheritance
  3. background process completion / synthetic events
  4. whether behavior is internal policy or exposed config

Constraints/Assumptions:

- Do not use web search; this is local repo inspection.
- Avoid destructive git commands.
- Keep the final report short and concrete.

Key decisions:

- Use `run_agent.py`, `agent/prompt_builder.py`, `tools/delegate_tool.py`, `tools/terminal_tool.py`, `tools/process_registry.py`, and `gateway/run.py` as primary evidence.
- Treat docs/config examples as evidence for exposed config knobs only.

State:

- Evidence gathered for all 4 requested areas.
- Ready to summarize.

Done:

- Located relevant code and docs.
- Confirmed automatic prompt guidance and role swapping in `run_agent.py` + `agent/prompt_builder.py`.
- Confirmed delegation inheritance/restrictions in `tools/delegate_tool.py`.
- Confirmed background completion queue + synthetic event injection in `tools/process_registry.py` and `gateway/run.py`.

Now:

- Draft concise final report with file/function references.

Next:

- None unless user asks for deeper tracing.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.resources/hermes/run_agent.py`
- `.resources/hermes/agent/prompt_builder.py`
- `.resources/hermes/tools/delegate_tool.py`
- `.resources/hermes/tools/terminal_tool.py`
- `.resources/hermes/tools/process_registry.py`
- `.resources/hermes/gateway/run.py`
- `.resources/hermes/gateway/platforms/base.py`
- `.resources/hermes/website/docs/user-guide/configuration.md`
- `.resources/hermes/website/docs/user-guide/features/delegation.md`
- `.resources/hermes/website/docs/user-guide/features/fallback-providers.md`
