# Heartbeat TechSpec Peer Review Round 2

You are an architecture reviewer pressure-testing an AGH TechSpec authored by another LLM.
The spec ships into a greenfield-alpha codebase with zero production users; bias toward
simpler, deletable solutions over compatibility shims.

CONTEXT FILES TO READ:
- TechSpec: `.compozy/tasks/agent-soul/_techspec_heartbeat.md`
- ADRs:
  - `.compozy/tasks/agent-soul/adrs/adr-001.md`
  - `.compozy/tasks/agent-soul/adrs/adr-002.md`
  - `.compozy/tasks/agent-soul/adrs/adr-003.md`
  - `.compozy/tasks/agent-soul/adrs/adr-004.md`
  - `.compozy/tasks/agent-soul/adrs/adr-005.md`
  - `.compozy/tasks/agent-soul/adrs/adr-006.md`
  - `.compozy/tasks/agent-soul/adrs/adr-007.md`
  - `.compozy/tasks/agent-soul/adrs/adr-008.md`
  - `.compozy/tasks/agent-soul/adrs/adr-009.md`
  - `.compozy/tasks/agent-soul/adrs/adr-010.md`
  - `.compozy/tasks/agent-soul/adrs/adr-011.md`
- Research:
  - `.compozy/tasks/agent-soul/analysis/analysis_acpx.md`
  - `.compozy/tasks/agent-soul/analysis/analysis_agh_heartbeat.md`
  - `.compozy/tasks/agent-soul/analysis/analysis_claude-code.md`
  - `.compozy/tasks/agent-soul/analysis/analysis_goclaw.md`
  - `.compozy/tasks/agent-soul/analysis/analysis_harnss.md`
  - `.compozy/tasks/agent-soul/analysis/analysis_hermes.md`
  - `.compozy/tasks/agent-soul/analysis/analysis_hermes_heartbeat.md`
  - `.compozy/tasks/agent-soul/analysis/analysis_multica.md`
  - `.compozy/tasks/agent-soul/analysis/analysis_openclaw.md`
  - `.compozy/tasks/agent-soul/analysis/analysis_openclaw_heartbeat.md`
  - `.compozy/tasks/agent-soul/analysis/analysis_opencode.md`
  - `.compozy/tasks/agent-soul/analysis/analysis_openfang.md`
  - `.compozy/tasks/agent-soul/analysis/analysis_paperclip.md`
  - `.compozy/tasks/agent-soul/analysis/analysis_paperclip_heartbeat.md`
- Architecture rules: `CLAUDE.md` and `internal/CLAUDE.md`
- Lessons: `docs/_memory/lessons/`

YOUR JOB:
1. Read every context file fully before reasoning.
2. Identify BLOCKERS (issues that prevent approval): unsound concurrency, missing migration paths,
   under-specified safety invariants, parallel-queue creation, hooks tailing event tables, hidden
   coupling to deferred features, security regressions (raw claim_token leakage, unverified-format
   identity classification), schema-without-migration, partial-surface completion (CLI/HTTP only,
   UDS/docs/codegen later), test-shape violations baked into the plan.
3. Identify NITS (non-blocking improvements): clarity, naming, test-density, observability event
   coverage, doc co-ship completeness.
4. Issue a READINESS verdict: READY / BLOCKED / NEEDS_REWORK.

CONSTRAINTS:
- Greenfield: prefer "delete the old thing" over "preserve compat".
- Hard cuts only: any rename touches code, storage, APIs, CLI, extensions, specs, RFCs,
  and `.compozy/tasks/*` artifacts in the same change.
- `task_runs` is the single durable queue. Reject any parallel queue.
- `ClaimNextRun` is the only authoritative claim primitive. Reject any peer claimer.
- Manual operator paths converge with autonomous on the same primitives.
- Hooks dispatch at the call site; never tail event tables.
- `claim_token` raw value never crosses transport, channel, log, or memory.
- Generated artifacts co-ship with source change in same PR.
- Subagents are read-only.

OUTPUT FORMAT (strict JSON):
{
  "blockers": [
    {
      "id": "B-NNN",
      "section": "<spec section anchor>",
      "issue": "<one paragraph>",
      "rationale": "<why this is a blocker, with reference to rule/lesson>",
      "suggested_fix": "<concrete change>"
    }
  ],
  "nits": [
    {
      "id": "N-NNN",
      "section": "<anchor>",
      "issue": "<one line>",
      "suggested_fix": "<one line>"
    }
  ],
  "readiness": "READY|BLOCKED|NEEDS_REWORK",
  "summary": "<two sentences explaining the verdict>"
}

Do not output anything outside the JSON object. Do not soften criticism.
