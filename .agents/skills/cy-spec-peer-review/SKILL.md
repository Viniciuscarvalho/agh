---
name: cy-spec-peer-review
description: Runs a cross-LLM peer review of a TechSpec via compozy exec --ide claude --model opus --reasoning-effort xhigh and incorporates findings before approval. Captures blockers, non-blocking nits, and readiness verdict. Use whenever a TechSpec is drafted and ready for approval, especially for autonomy/network/memory-impacting designs. Do not use for completed PRDs, code review batches, or ideation drafts before convergence.
trigger: explicit
argument-hint: "[techspec-path]"
---

# Spec Peer Review

Codex authors AGH TechSpecs with `gpt-5.4` at `reasoning_effort=xhigh`; Claude Opus pressure-tests them. This skill runs that pressure-test as a deterministic step before approval. It refuses to mark a TechSpec ready until the Opus pass returns and every blocker is resolved.

## Required Inputs

- **techspec-path** (optional): explicit path to the `_techspec.md` under review. When omitted, resolve to the most recently modified `.compozy/tasks/<slug>/_techspec.md` whose sibling `_meta.md` shows `Pending: > 0` or no `_meta.md` exists yet.

## Procedures

**Step 1: Validate Input and Context**

1. Resolve `techspec-path`. If omitted, list candidate paths and pick the freshest.
2. Read the spec and confirm it is a final-shape TechSpec (has `Architectural Boundaries`, `Implementation Steps`, `Test Strategy` sections) — not a draft.
3. Read `references/quality-markers.md` and verify the spec carries the six markers (boundary statement, listed boundaries, Go interface signatures, data-model field rationale, side-table-vs-JSON decisions, lease/safety invariants enumerated). If any marker is missing, abort and report the missing markers — Opus review is wasted on incomplete specs.
4. Resolve the slug from the path; ensure `.compozy/tasks/<slug>/` exists and is writable.

**Step 2: Compose the Review Prompt**

1. Read `references/peer-review-prompt.md` for the canonical Opus prompt template.
2. Substitute the placeholders: `{techspec_path}`, `{adr_paths}` (any `adrs/*.md` siblings), `{related_research}` (any `analysis/*.md` siblings).
3. Write the assembled prompt to `.compozy/tasks/<slug>/qa/peer-review-prompt.md` (create the `qa/` folder if needed).

**Step 3: Execute the Cross-LLM Review**

1. Run `compozy exec --ide claude --model opus --reasoning-effort xhigh --format json --prompt-file .compozy/tasks/<slug>/qa/peer-review-prompt.md`.
2. Capture stdout to `.compozy/tasks/<slug>/qa/peer-review-result.json` and stderr to `.compozy/tasks/<slug>/qa/peer-review-result.err`.
3. If the command returns a non-zero exit code, fail loudly. Do not retry silently. Inspect the stderr for model misconfiguration (see Error Handling).

**Step 4: Triage Findings**

1. Parse the JSON output. Expect three sections: `blockers`, `nits`, `readiness`.
2. For each `blocker`: open or update an ADR if architectural, or annotate the TechSpec inline with a `> [Opus blocker NNN]` comment. Block approval until resolved.
3. For each `nit`: append to a `## Nits` section at the bottom of the TechSpec. Resolution is optional but recommended.
4. For `readiness`: record verdict (`READY` / `BLOCKED` / `NEEDS_REWORK`) in `.compozy/tasks/<slug>/qa/peer-review-summary.md` along with a one-line rationale per blocker.

**Step 5: Optional Second-Round Confirmation**

1. If the user has asked for a second-round review (e.g., after resolving blockers), re-run from Step 2 with the updated spec and append the new result file as `peer-review-result-roundN.json`.
2. Do not auto-loop. The user explicitly requests further rounds.

## Error Handling

- **Model misconfiguration (`The model 'X' does not exist`):** stop and surface the configured model. The IDE may be set to a stale name like `gpt-5.5`. Do not mutate the call to substitute a model — verify with the user. (See `docs/_memory/lessons/L-010-model-name-validation.md`.)
- **`compozy exec` not found:** the skill assumes Compozy CLI is on `PATH`. If absent, fail with the install hint rather than swallowing.
- **Quality markers missing:** if Step 1.3 fails, do not run Opus. Print the missing markers and exit so the user can amend the spec first.
- **Empty Opus output:** treat empty `blockers`/`nits`/`readiness` as suspect (likely a prompt or model issue). Re-prompt the user before declaring `READY`.
- **Existing peer-review files:** never overwrite. Round files are versioned (`-roundN.json`).
