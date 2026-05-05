Goal (incl. success criteria):

- Inspect `.resources/openfang` and report how execution modes/profiles/roles are chosen automatically vs via user config.
- Focus on manifest packaging, autonomous hands/scheduler behavior, model/tool/capability selection, and the user-vs-runtime boundary.
- Success = concise, evidence-based summary with exact file/doc references.

Constraints/Assumptions:

- Do not use web search for local repo facts.
- No destructive git commands.
- Need evidence from source/docs, not guesses.
- "Roles" is ambiguous; likely refers to agent/runtime roles, but auth user roles also exist in config docs. Keep both separate unless evidence says otherwise.

Key decisions:

- Treat `agent.toml` and `HAND.toml` as user-authored declarative manifests.
- Treat kernel/background/prompt-builder code as the source of runtime synthesis and defaults.

State:

- Initial exploration complete; relevant files located and read.
- Evidence gathered for manifest schema, hand packaging, autonomous scheduling, model routing, and tool filtering.

Done:

- Located agent template docs, config docs, hand registry, kernel spawn path, prompt builder, background executor, model router, and tool filtering logic.
- Confirmed bundled hands are embedded from `crates/openfang-hands/bundled/*/HAND.toml` plus `SKILL.md`.
- Confirmed `HAND.toml` settings are resolved into prompt/env overlays at activation time.
- Confirmed `profile`/`capabilities`/`tool_allowlist`/`tool_blocklist` are runtime filters layered in the kernel.

Now:

- Draft concise evidence-based answer with exact file references.

Next:

- If needed, verify any remaining ambiguity on "roles" against auth/config docs before finalizing.

Open questions (UNCONFIRMED if needed):

- Does the user mean agent roles or auth user roles when saying "roles"?

Working set (files/ids/commands):

- `.resources/openfang/crates/openfang-types/src/agent.rs`
- `.resources/openfang/crates/openfang-hands/src/lib.rs`
- `.resources/openfang/crates/openfang-hands/src/registry.rs`
- `.resources/openfang/crates/openfang-kernel/src/kernel.rs`
- `.resources/openfang/crates/openfang-kernel/src/background.rs`
- `.resources/openfang/crates/openfang-kernel/src/wizard.rs`
- `.resources/openfang/crates/openfang-kernel/src/registry.rs`
- `.resources/openfang/crates/openfang-runtime/src/prompt_builder.rs`
- `.resources/openfang/crates/openfang-runtime/src/routing.rs`
- `.resources/openfang/docs/agent-templates.md`
- `.resources/openfang/docs/configuration.md`
- `.resources/openfang/docs/workflows.md`
- `.resources/openfang/docs/api-reference.md`
- `rg`/`sed` queries over `.resources/openfang`
