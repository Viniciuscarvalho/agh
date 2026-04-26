---
name: cy-research-competitors
description: >-
  Dispatches read-only subagents to study reference repos under .resources
  (claude-code, hermes, openclaw, openfang, multica, paperclip, goclaw,
  codex-cli), then writes parent-authored per-competitor analysis files at
  .compozy/tasks/SLUG/analysis/analysis_NAME.md. Each analysis covers mechanisms,
  relevant paths, transferable patterns, risks, open questions, and evidence.
  Use when a TechSpec or refactor needs cross-system reference grounding before
  architectural decisions. Do not use for scope-internal questions or final
  implementation planning.
trigger: explicit
argument-hint: "[task-slug] [competitor-list]"
---

# Research Competitors

Pedro routinely studies 3-5 reference repos under `.resources/` before drafting any TechSpec. This skill formalizes that pattern as parallel read-only subagent dispatch with a fixed analysis schema. Subagents are read-only and return analysis content to the parent; the parent agent writes the files.

## Required Inputs

- **task-slug**: the `.compozy/tasks/<slug>/` to receive analysis output. Must already exist.
- **competitor-list** (optional): comma-separated names. When omitted, infer from the task's `_idea.md` references and from `references/competitor-catalog.md`.

## Procedures

**Step 1: Resolve Inputs**

1. Validate `task-slug` and confirm `.compozy/tasks/<slug>/` exists.
2. Create `.compozy/tasks/<slug>/analysis/` if absent.
3. If `competitor-list` is omitted, read `_idea.md` and any existing techspec/PRD for `.resources/<name>/` references. Augment with `references/competitor-catalog.md` for adjacent systems.
4. For each named competitor, verify `.resources/<name>/` exists. Skip missing competitors with a warning rather than failing.

**Step 2: Compose the Analysis Prompt**

1. Read `assets/analysis-template.md`. This is the canonical schema each subagent fills.
2. For each selected competitor, compose a parallel subagent prompt instructing it to:
   - Read `.resources/<name>/` (focus on the directories named in the competitor catalog).
   - Cross-reference the AGH TechSpec or `_idea.md` topic.
   - Return markdown exactly matching the schema in the template.
   - Not write or modify files.
3. Omit explicit model selection unless the user explicitly requests the multi-LLM pipeline for this run. When explicit model selection is requested and supported, use `gpt-5.4-mini` with `reasoning_effort=high` for breadth or `gpt-5.4` with `reasoning_effort=xhigh` for architecturally complex competitors.

**Step 3: Dispatch Read-Only Subagents in Parallel**

1. Launch one subagent per competitor, all in the same dispatch round. Read `references/dispatch-rules.md` for the read-only contract.
2. Subagents MUST NOT edit, create, or delete files. They return analysis content only.
3. Wait for all subagents to complete before continuing. Do not synthesize until every selected competitor has returned analysis content.

**Step 4: Write Analysis Files**

1. As the parent agent, write each completed analysis to `.compozy/tasks/<slug>/analysis/analysis_<name>.md`.
2. Preserve each subagent's evidence paths and open questions. Do not invent missing evidence.
3. If a subagent returned malformed content, request one follow-up before writing.

**Step 5: Verify Schema Compliance**

1. For each `analysis/analysis_<name>.md`, confirm all seven sections are present (Overview, Mechanisms/Patterns, Relevant Code Paths, Transferable Patterns, Risks/Mismatches, Open Questions, Evidence).
2. Confirm the Evidence section cites real file paths under `.resources/<name>/` (no fabricated paths).
3. Reject empty sections. Send the offending subagent a follow-up requesting completion before synthesis.

**Step 6: Append References to TechSpec / Tasks**

1. After analyses converge, update the TechSpec (`_techspec.md`) or task files to include explicit `.resources/<name>/<file>` paths in their bodies. The implementation agent reads competitor code through these citations.
2. Do not summarize the analyses inside the TechSpec — keep the analysis files as the authoritative artifact and link them.

## Error Handling

- **`.resources/<name>/` missing:** skip with a logged warning. Do not invent the competitor's structure.
- **Subagent attempts to edit any file:** abort the subagent and re-dispatch with strengthened read-only contract.
- **Schema-incomplete analysis:** request completion; do not synthesize partial analyses into the TechSpec.
- **Network/disk error during dispatch:** fail the round entirely. Do not produce a half-set of analyses.
