## Goal (incl. success criteria):

- Analyze `.resources/paperclip` against `.compozy/tasks/autonomous/_techspec.md` and ADR-003/005/006/010.
- Produce a concise Markdown report in `.compozy/tasks/autonomous/reviews/gpt54mini-paperclip-analysis.md` covering verdict, precedents, recommended AGH flow, pre-task changes, and invariants.

## Constraints/Assumptions:

- Write scope is exactly `.compozy/tasks/autonomous/reviews/gpt54mini-paperclip-analysis.md`; do not edit any other file.
- Do not use destructive git commands.
- Treat Paperclip as the primary external reference; AGH spec/ADRs are the current model to validate.
- Need concrete file paths and line refs where possible.

## Key decisions:

- Paperclip mostly matches the corrected AGH model at the architectural level.
- The main distinction is terminology and separation of concerns: Paperclip uses issue checkout/release for task ownership, heartbeat runs for execution context, and environment leases for sandbox/runtime lifecycle.
- AGH should keep `ClaimNextRun` as the sole authoritative next-work primitive and scheduler as sweep/notify/recovery, not claimant.

## State:

- Evidence gathered from Paperclip docs/code and AGH spec/ADRs.
- Report written to `.compozy/tasks/autonomous/reviews/gpt54mini-paperclip-analysis.md`.

## Done:

- Read AGH techspec and ADR-003/005/006/010.
- Read Paperclip AGENTS and relevant docs/code around checkout, approvals, heartbeats, runtime leases, and plugin worker patterns.
- Drafted the review report in the requested path.

## Now:

- Final handoff.

## Next:

- None.

## Open questions (UNCONFIRMED if needed):

- None blocking. If a finer-grained Paperclip API precedent is needed, it can be added from the already-read sources.

## Working set (files/ids/commands):

- `.resources/paperclip/doc/SPEC-implementation.md`
- `.resources/paperclip/doc/execution-semantics.md`
- `.resources/paperclip/doc/spec/agents-runtime.md`
- `.resources/paperclip/docs/api/approvals.md`
- `.resources/paperclip/docs/api/issues.md`
- `.resources/paperclip/docs/api/agents.md`
- `.resources/paperclip/docs/guides/agent-developer/heartbeat-protocol.md`
- `.resources/paperclip/docs/guides/board-operator/execution-workspaces-and-runtime-services.md`
- `.resources/paperclip/packages/adapter-utils/src/{sandbox-managed-runtime.ts,command-managed-runtime.ts,execution-target.ts,server-utils.ts}`
- `.resources/paperclip/packages/{mcp-server,db,shared}/...`
- `.compozy/tasks/autonomous/_techspec.md`
- `.compozy/tasks/autonomous/adrs/adr-003.md`
- `.compozy/tasks/autonomous/adrs/adr-005.md`
- `.compozy/tasks/autonomous/adrs/adr-006.md`
- `.compozy/tasks/autonomous/adrs/adr-010.md`
