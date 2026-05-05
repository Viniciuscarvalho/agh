# Memory Ledger

- Goal (incl. success criteria): Analyze how Paperclip models tasks, subtasks, issues, workflow units, and coordination surfaces so AGH core-task design can borrow the right patterns. Success means `.compozy/tasks/core-tasks/analysis/analysis_paperclip.md` exists, cites concrete local paths from both `~/dev/knowledge/paperclip` and `~/dev/knowledge/.resources/paperclip`, and clearly separates transferable patterns from non-fits.
- Constraints/Assumptions: No web. Only modify `.compozy/tasks/core-tasks/analysis/analysis_paperclip.md` plus this ledger. Do not touch unrelated worktree edits. Prefer primary local sources: `~/dev/knowledge/paperclip`, `~/dev/knowledge/.resources/paperclip`, plus `qmd`/`kb` where useful.
- Key decisions: Treat Paperclip as a first-class issue/task control plane rather than a checklist system. Focus evidence on issue schema, relations, checkout/heartbeat flow, approvals, routines, and agent inbox APIs.
- State: Evidence gathered; writeup completed and verified.
- Done: Read root and topic instructions, `qmd status`, `kb version`, Paperclip topic scaffold/log, and key repo docs/services/schemas/routes. Wrote `.compozy/tasks/core-tasks/analysis/analysis_paperclip.md` and verified its section structure.
- Now: None.
- Next: None unless the user requests revisions.
- Open questions (UNCONFIRMED if needed): Whether AGH should mirror Paperclip's board/agent/company hierarchy or keep a slimmer task model is still UNCONFIRMED.
- Working set (files/ids/commands): `/Users/pedronauck/dev/knowledge/paperclip/{CLAUDE.md,log.md,wiki/codebase/*}`, `/Users/pedronauck/dev/knowledge/.resources/paperclip/{README.md,doc/TASKS.md,doc/TASKS-mcp.md,skills/paperclip/SKILL.md,server/src/routes/{issues.ts,agents.ts,routines.ts,issues-checkout-wakeup.ts},server/src/services/{issues.ts,issue-approvals.ts,routines.ts},packages/db/src/schema/{issues.ts,issue_relations.ts,issue_approvals.ts,routines.ts},packages/shared/src/{validators/issue.ts,types/issue.ts,types/routine.ts,api.ts}}`
