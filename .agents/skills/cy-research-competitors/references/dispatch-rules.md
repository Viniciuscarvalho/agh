# Dispatch Rules

Subagents launched by this skill operate under a strict read-only contract. The rules below MUST be embedded in every subagent prompt verbatim.

## Read-Only Contract

1. Subagents may only read files under `.resources/<name>/` and `~/dev/knowledge/<name>/`.
2. Subagents MUST NOT edit, create, or delete files anywhere.
3. Subagents return markdown analysis content to the parent agent. The parent writes `.compozy/tasks/<slug>/analysis/analysis_<name>.md`.
4. Subagents MUST NOT run `git`, `make`, `bun`, or any command that mutates state.
5. If the subagent encounters a file that requires interpretation by another tool (compiled binary, encrypted blob), it records a note in the Open Questions section and continues.

## Tool Restrictions

- **Allowed:** Read, Grep, Glob, Bash for read-only operations (e.g., `wc -l`, `find`, `head`, `cat`).
- **Forbidden:** Write/Edit anywhere; Bash commands that mutate state (`rm`, `mv`, `>`, `>>`, `git`, `make`, package managers).

## Model Selection

- Omit explicit model selection unless the user explicitly requests it.
- If explicit model selection is requested and supported, use `gpt-5.4-mini` with `reasoning_effort=high` for breadth across many files.
- Use `gpt-5.4` with `reasoning_effort=xhigh` for architecturally complex competitors (Hermes process registry, OpenClaw daemon kernel, AGH-network research) where shallow reading would miss invariants.

## Parallelism

- All subagents in a research round dispatch in the same parallel batch. Do not stagger.
- Wait for every subagent to complete before synthesis. A partial set is unacceptable.

## Output Validation

Each subagent's returned markdown MUST contain all seven sections from `assets/analysis-template.md`. If any section is empty, the orchestrator follow-ups the subagent with the schema and a request to fill the gap. The parent may fix formatting, but must not invent evidence or conclusions.

## Failure Handling

- If a subagent crashes or returns malformed output, retry once with a stricter prompt.
- If a subagent reports the competitor directory is empty or missing, log a warning, have the parent write a stub `analysis_<name>.md` documenting the absence, and continue with the rest of the batch.
- Do not synthesize a missing competitor as if its analysis succeeded.
