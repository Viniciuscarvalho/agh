- Goal (incl. success criteria):
- Audit `packages/site/content/runtime/cli-reference` as an operator-facing reference surface.
- Success means delivering a concise report with: overall assessment, prioritized findings with exact file paths, recurring generated-page issues, missing or misleading examples/output, and remediation patterns.

- Constraints/Assumptions:
- Must use the `documentation-writer` skill.
- Do not edit documentation files.
- Do not use web search; analyze local docs only.
- Treat this as a reference surface for operators who already understand the runtime model and need exact CLI contracts.
- Local docs are the only authority for this audit; implementation mismatches are UNCONFIRMED unless documented elsewhere locally.

- Key decisions:
- Focus on reference quality over prose quality: command discoverability, exact syntax, flag contracts, output expectations, and workflow value.
- Evaluate generated command pages separately from hand-authored overview/index pages because they serve different roles.

- State:
- in_progress

- Done:
- Read workspace instructions and the `documentation-writer` skill.
- Scanned existing session ledgers for related site/doc audits.
- Indexed the full `packages/site/content/runtime/cli-reference` tree.
- Sampled the main overview and representative command-group pages.
- Completed a full structural sweep of 117 `.mdx` pages.
- Confirmed only 34/117 pages contain an `Examples` section.
- Confirmed there are zero JSON code blocks and zero `Output`/`Response` sections anywhere in the CLI reference.
- Confirmed 20 nested/top-level `index.mdx` pages are bare stubs without subcommand navigation.
- Identified the weakest families by example coverage: `task` 0/20, `automation` 0/16, `bridge` 0/10, `network` 0/6, `hooks` 0/5, `extension` 0/9, `observe` 0/3.

- Now:
- Synthesize prioritized findings, recurring generated-page issues, and remediation patterns.

- Next:
- Deliver the final audit report.

- Open questions (UNCONFIRMED if needed):
- UNCONFIRMED: whether every command page under `runtime/cli-reference` is generated exclusively from Cobra metadata or some pages are hand-maintained after generation.

- Working set (files/ids/commands):
- `.codex/ledger/2026-04-19-MEMORY-cli-reference-audit.md`
- `.agents/skills/documentation-writer/SKILL.md`
- `packages/site/content/runtime/cli-reference/**`
- `find .codex/ledger -maxdepth 1 -type f | sort`
- `rg --files packages/site/content/runtime/cli-reference`
- `sed -n`
- `node` structural sweep for example/output/index-page coverage
- `nl -ba` on representative files under `automation/`, `bridge/`, `network/`, `observe/`, `session/`, `task/`, `workspace/`
