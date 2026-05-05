Goal (incl. success criteria):

- Audit the requested AGH runtime core documentation areas for advanced operators integrating configuration, memory, skills, workspaces, automation, bridges, hooks, extensions, and operations.
- Success means delivering a precise local-doc-only audit with: overall assessment, prioritized findings with exact file paths, explicit Diataxis mismatches, missing examples and misleading claims, and recommended fixes.

Constraints/Assumptions:

- Must use the `documentation-writer` skill for a Diataxis-based review.
- Do not edit files.
- Do not use web search; analyze local docs only.
- Scope is limited to:
  - `packages/site/content/runtime/core/configuration`
  - `packages/site/content/runtime/core/memory`
  - `packages/site/content/runtime/core/skills`
  - `packages/site/content/runtime/core/workspaces`
  - `packages/site/content/runtime/core/automation`
  - `packages/site/content/runtime/core/bridges`
  - `packages/site/content/runtime/core/hooks`
  - `packages/site/content/runtime/core/extensions`
  - `packages/site/content/runtime/core/operations`

Key decisions:

- Treat this as an audit/report task, not a rewrite task.
- Apply Diataxis explicitly to each page family and call out mixed document types where they weaken operator outcomes.
- Use local repository docs as the authority for accuracy checks; if implementation verification is needed, note it as UNCONFIRMED unless corroborated by nearby local documentation.

State:

- analysis complete; drafting final audit

Done:

- Read root instructions, user constraints, and the `documentation-writer` skill.
- Scanned existing ledgers for cross-agent awareness.
- Inventoried all requested files under the nine runtime core areas.
- Read the requested pages and compared overlapping sections for Diataxis fit, internal consistency, and operator usefulness.
- Identified concrete cross-doc drift in SKILL precedence guidance:
  - `packages/site/content/runtime/core/skills/overview.mdx` includes runtime-registered extension skills in precedence.
  - `packages/site/content/runtime/core/configuration/skill-md.mdx` and `packages/site/content/runtime/core/configuration/file-locations.mdx` omit that layer.
- Identified a likely incorrect automation trigger example in `packages/site/content/runtime/core/configuration/config-toml.mdx`:
  - example uses `event = "permission.resolved"` under `[[automation.triggers]]`
  - example also sets `filter.kind = "permission"`
  - this conflicts with `packages/site/content/runtime/core/automation/triggers.mdx`, which documents built-in trigger events and says `kind` matches the activation event name.
- Identified structural duplication between:
  - `packages/site/content/runtime/core/configuration/skill-md.mdx`
  - `packages/site/content/runtime/core/skills/skill-md.mdx`
- Identified recurring Diataxis mixing in automation, bridges, and extensions pages, where reference material, procedural setup, and explanatory narrative live on the same page.
- Noted coverage gaps for advanced operators:
  - no worked example for delegated/task automation jobs despite task fields appearing in config reference
  - no activation-envelope schema/examples for non-webhook trigger events beyond narrow snippets
  - bridge setup assumes source-build/install from repo paths instead of clearly separating “already installed provider” vs “build provider from source”

Now:

- Draft the final audit with prioritized findings, Diataxis mismatches, missing examples/misleading claims, and recommended fixes.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether any generated or index files in these directories should be considered authoritative over adjacent topic pages.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-19-MEMORY-runtime-advanced-docs-audit.md`
- `.agents/skills/documentation-writer/SKILL.md`
- `packages/site/content/runtime/core/{configuration,memory,skills,workspaces,automation,bridges,hooks,extensions,operations}/**`
- `rg --files`, `sed`, `nl`
