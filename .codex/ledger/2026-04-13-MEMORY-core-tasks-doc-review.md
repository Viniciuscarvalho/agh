# Memory Ledger

- Goal (incl. success criteria): Review `.compozy/tasks/core-tasks/_techspec.md` and ADRs `adr-001.md` through `adr-006.md` from a lifecycle/authority perspective, returning only concrete findings with file/line refs.
- Constraints/Assumptions: Review only; no product-code edits. Must avoid destructive git commands. Focus on task/run status ownership, actor identity derivation, owner mutability, cancellation propagation, session attachment rules, and multi-writer safety.
- Key decisions: Read the tech spec and all six ADRs with line numbers. Cross-checked against existing memory from `core-tasks-techspec` and `current-review`. Findings should be concrete, severity-ordered, and concise.
- State: In progress.
- Done: Read `.compozy/tasks/core-tasks/_techspec.md`, ADRs `001-006`, `.codex/ledger/2026-04-13-MEMORY-core-tasks-techspec.md`, `.codex/ledger/2026-04-13-MEMORY-current-review.md`, and `review-round-1.md`.
- Now: Finalize whether the remaining issues are real defects versus acceptable spec latitude.
- Next: Produce the review with only confirmed findings, or state no issues if nothing concrete remains.
- Open questions (UNCONFIRMED if needed): Whether session attachment is intended to be exclusive to one live run is not specified; whether multi-writer authorization is scope-bound is also not specified.
- Working set (files/ids/commands): `.compozy/tasks/core-tasks/_techspec.md`, `.compozy/tasks/core-tasks/adrs/adr-001.md`-`adr-006.md`, `.codex/ledger/2026-04-13-MEMORY-core-tasks-techspec.md`, `.codex/ledger/2026-04-13-MEMORY-current-review.md`, `.compozy/tasks/core-tasks/review-round-1.md`
