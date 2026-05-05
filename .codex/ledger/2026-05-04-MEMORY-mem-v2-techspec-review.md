Goal (incl. success criteria):

- Read-only review of `.compozy/tasks/mem-v2/_techspec.md` against ADRs `adr-001.md` through `adr-012.md` and existing review artifacts in the same folder, limited to normative contradictions that would mislead task generation.
- Success means returning only: blockers with file:line references, non-blocking drift to clean before task generation, and explicit READY/NOT-READY verdict.

Constraints/Assumptions:

- User requested no file edits to product/spec artifacts; review only.
- Workspace policy still requires a session ledger under `.codex/ledger/`.
- Scope is limited to contradictions such as stale ADR language, schema/event enum mismatches, slice-boundary conflicts, and invariant conflicts.
- Local repository evidence only; no web search.

Key decisions:

- Reuse prior mem-v2 ledgers for awareness, but independently verify current file contents.
- Treat prior review artifacts as evidence to cross-check, not as authoritative conclusions.

State:

- Review complete; final verdict being prepared.

Done:

- Scanned `.codex/ledger/` for related mem-v2 sessions.
- Read prior mem-v2 review ledgers for awareness.
- Started execution plan for current read-only review.
- Verified current `_techspec.md`, ADRs `001..012`, and local review artifacts with line anchors.
- Confirmed some older review findings are now fixed (`ADR-012` event-count wording, WAL retention event enum).
- Isolated remaining contradictions that still mislead task generation: ADR-001 persistence-authority drift, ADR-009 stale `memory_decisions` schema/event names, ADR-011 stale `memory_recall_signals` schema/slice language, and residual workspace-id wording drift.

Now:

- Writing final blocker/drift verdict.

Next:

- None after final response.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.compozy/tasks/mem-v2/_techspec.md`
- `.compozy/tasks/mem-v2/adrs/adr-001.md` .. `adr-012.md`
- `.compozy/tasks/mem-v2/*review*.md`
- `.codex/ledger/2026-05-04-MEMORY-mem-v2-techspec-review.md`
