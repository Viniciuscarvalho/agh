# Analysis: Global Compozy Runs (~/.compozy/runs)

## Scope

- **Total runs available**: 760 directories under `~/.compozy/runs/`
- **Date range observed**: 2026-04-17 → 2026-04-26 (10-day window of intense activity)
- **Sampling method**:
  - Cataloged every directory by prefix (`tasks-`, `reviews-`, `exec-`, `plan-`, etc.) and project slug.
  - Read full `run.json`, `result.json`, sample `events.jsonl`, and prompt artifacts for the most recent autonomous, hermes, and qa-review runs.
  - Cross-referenced with the materialized PRD trees under `.compozy/tasks/<project>/` (autonomous, hermes, qa-review, plus `_archived/` projects) for techspecs, ADRs, task files, memory files, and review issue files.
  - Spot-checked older runs (`reviews-daemon-f77b12-round-003-*`, agent-capabilities, etc.) to confirm pattern persistence.
- **Note on inflation**: 622/760 runs are tagged `tasks-demo-2a9751-*`. These are repeated short throwaway demos (the "demo" project slug). The signal-rich corpus is the remaining ~138 runs covering autonomous, hermes, qa-review, daemon, agent-capabilities, unified-capabilities, redesign, mem-improvs, network-default, network-redesign, delete-session, session-driver-override, orphan-actions, release-adjustments, settings-ui, storybook-stories, and tasks-ui.

## Workflow Usage Patterns

Compozy run directories encode the workflow type in their prefix. After excluding the demo runs, the ranking is unambiguous:

| Workflow                                                             | Run count (non-demo)                 | Skill backing it                                             | Notes                                                                                                                                                                                                                                                                                                    |
| -------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tasks-<slug>-...` (PRD task execution)                              | ~25 distinct slugs, hundreds of jobs | `cy-execute-task` + `cy-workflow-memory` + `cy-final-verify` | Each run launches one job per task file in `.compozy/tasks/<slug>/`. The `tasks-autonomous-6c5e11-20260426-053213-000000000` run launched 16 jobs in parallel and all 16 succeeded, mixing `codex` (xhigh reasoning) for backend/test/docs and `claude` (`opus` xhigh) for the single frontend/E2E task. |
| `reviews-<slug>-round-NNN-...` (PR review remediation)               | ~70 directories (counting retries)   | `cy-fix-reviews` + `cy-final-verify`                         | Heavily retried — `reviews-daemon-f77b12-round-003-*` alone had 19 attempts.                                                                                                                                                                                                                             |
| `exec-...` (single ad-hoc execution)                                 | 20                                   | `cy-execute-task` (single-prompt mode)                       | Used for one-off prompt-backed jobs.                                                                                                                                                                                                                                                                     |
| `plan-*`, `review-*`, `hooks-*`, `artifact-hooks/`, `run-job-hooks/` | ~15                                  | Internal compozy CLI test fixtures                           | Confirmed by names like `TestPrepareExecModeBuildsSinglePromptBackedJobWithRunMetadata`.                                                                                                                                                                                                                 |

Evidence of the skill stack from a real prompt (`tasks-autonomous-6c5e11-20260426-053213-000000000/jobs/task_03-3b1ca1.prompt.md`, lines 11-15):

```
<required_skills>
- `cy-workflow-memory`: required when workflow memory paths are provided for this task
- `cy-execute-task`: required end-to-end workflow for a PRD task
- `cy-final-verify`: required before any completion claim or automatic commit
</required_skills>
```

The review fix prompt (`reviews-autonomous-6c5e11-round-001-20260426-152716-000000000/jobs/batch_001.prompt.md`, lines 11-14):

```
<required_skills>
- `cy-fix-reviews`: required remediation workflow for review issue batches
- `cy-final-verify`: required before any completion claim or automatic commit
</required_skills>
```

**Frequency ranking (real, signal-only)**:

1. **`cy-execute-task`** — invoked in nearly every `tasks-*` job; canonical PRD execution entry point.
2. **`cy-final-verify`** — required by both task execution and review batches before commit. Pedro explicitly added it as a hard gate.
3. **`cy-workflow-memory`** — required whenever a task prompt provides memory paths. Almost every recent task uses it.
4. **`cy-fix-reviews`** — every `reviews-*` round.
5. **`cy-create-prd` / `cy-create-techspec` / `cy-create-tasks`** — left durable artifacts (`_idea.md` for sandbox/skills-system, `_techspec.md` for autonomous/hermes, full `_tasks.md` listings) but no active runs in the 2026-04-17→04-26 window. They produced the inputs that drove the entire current workload.
6. **`qa-execution`** / **`qa-report`** — direct evidence in `.compozy/tasks/autonomous/qa/` and `.compozy/tasks/hermes/qa/`. Task 17/18 in autonomous and Task 10/11 in hermes are dedicated QA planning + execution lanes.
7. **`cy-review-round`** — used to materialize the `reviews-NNN/` directory structure that `cy-fix-reviews` then consumes.

## Recurring Review/QA Issues

Reviewer feedback (CodeRabbit, AI-generated triage) was structured and consistent across rounds. The same categories recur across `autonomous/reviews-001`, `hermes/reviews-001`, `hermes/reviews-002`, `qa-review/reviews-001`, and the archived `agent-capabilities/reviews-003,004`.

### A. Test-shape violations (the single most frequent class)

Pedro's coding guidelines mandate `t.Run("Should...")` subtests, `t.Parallel()` on independent subtests, and table-driven layouts. Reviewers flagged violations almost every round.

- `qa-review/reviews-001/issue_006.md`: _"Wrap these new test cases in `t.Run("Should...")` subtests… As per coding guidelines, `\*\*/_\_test.go`: MUST use t.Run("Should...") pattern for ALL test cases."\*
- `hermes/reviews-001/issue_005.md`: _"Refactor added cases into t.Run("Should...") table-driven subtests."_
- `hermes/reviews-001/issue_009.md`: _"Refactor into t.Run("Should...") subtests (table-driven where repeated)."_
- `hermes/reviews-001/issue_025.md`: _"Align this suite with the required Should... subtest pattern."_
- `autonomous/reviews-001/issue_028.md`: _"Split these new agent client tests into t.Run("Should...") subtests."_
- `autonomous/reviews-001/issue_026.md`: _"Break this lifecycle coverage into focused subtests."_
- `autonomous/reviews-001/issue_032.md`: _"Missing t.Parallel() for test that can run concurrently."_
- `agent-capabilities/reviews-003/issue_006.md`, `issue_007.md`: _"Add t.Parallel() for independent integration test."_

### B. Error-handling laxness

- `autonomous/reviews-001/issue_020.md` flagged a `_ = json.Marshal(...)` discard with the reviewer quoting Pedro's own rule verbatim: _"As per coding guidelines, 'Never ignore errors with `_` in Go — every error must be handled or have a written justification.'"\_
- `hermes/reviews-001/issue_002.md`: _"Wrap checkpoint error with operation context per coding guidelines."_
- `hermes/reviews-001/issue_004.md`: _"Wrap retry wait failures with stage context."_
- `hermes/reviews-001/issue_024.md`: _"Wrap retry-loop propagated errors with attempt/stage context."_

### C. Concurrency / lifecycle correctness

- `hermes/reviews-001/issue_001.md` (`internal/acp/client.go:239`): _"If `Register` fails here, the subprocess is stopped, but the `procCtx` passed into `newLocalToolHostFromPolicy` stays live. Any tool-host or terminal goroutines bound to that context can outlive the failed start."_ — classic context-leak on cleanup path.
- Recurring pattern: cleanup paths that don't cancel context, don't release leases, or don't stop background workers.

### D. External-call hazards

- `hermes/reviews-001/issue_015.md`: _"Add a timeout to the default metadata client. Falling back to `http.DefaultClient` means discovery has no client timeout, so a slow or wedged issuer can hang login/refresh indefinitely…"_ — reviewer cited Pedro's rule that _"external-call hazards like blocking calls without timeouts on request threads must be fixed before release."_
- `hermes/reviews-001/issue_016.md`: _"Require HTTPS for OAuth discovery and credential endpoints."_
- `hermes/reviews-001/issue_017.md`: _"Build the RFC 8414 well-known URL in the correct order."_

### E. Schema / migration correctness

- `hermes/reviews-001/issue_020.md` (Critical): _"Add a real migration for the widened `memory_operation_log` table. This catalog still boots through `storepkg.EnsureSchema`, so existing databases keep the old five-column table. After this change, `logEvent` inserts `scope/workspace_root/filename` and `listOperations` selects them, which will fail on upgraded installs with missing-column errors."_
- Multiple round-1 issues across daemon/hermes about silent column-drift between the in-memory model and persisted schema.

### F. Validation centralization / DRY validation

- `autonomous/reviews-001/issue_010.md`: _"`ExecutionRequest` lacks a Validate() method used by peer request types… Peer types like `EnqueueRun`, `ClaimRun`, and `StartRun` all define `Validate()` methods; `ExecutionRequest` should follow the same pattern for consistency."_

### G. Dead code / unreachable guards

- `autonomous/reviews-001/issue_004.md` and `issue_005.md`: _"Unreachable nil check after make."_ — guards on slices that are always initialized.
- `autonomous/reviews-001/issue_030.md`: `trimAgentTaskCapabilities` keeps whitespace-only entries instead of dropping them.

### H. CLI input normalization

- `autonomous/reviews-001/issue_025.md`: _"Explicit `--kind` overrides can be silently ignored on `agh ch reply`. If the user passes only `--kind status`, `metadata()` returns the zero payload before it considers that override, so the guard never runs and the command proceeds as a reply. That makes an explicit CLI flag a no-op instead of an error."_ — exact pattern of "implicit zero-value short-circuit hides explicit flag override".

### I. Test fidelity

- `autonomous/reviews-001/issue_015.md`: _"Re-use an explicit idempotency_key on the second approve call. Right now the repeated approve request has no body, so this only proves the endpoint is re-entrant after approval. It does not verify the new `TaskExecutionRequest` idempotency contract, and a handler that ignored idempotency keys entirely would still pass."_ — tests that pass without exercising the contract they claim to cover.
- `autonomous/reviews-001/issue_012.md`: _"Capture and assert the forwarded ExecutionRequest."_

### J. Severity distribution (rough counts)

| Project / round                  | Total issues | Severity skew                                                                               |
| -------------------------------- | ------------ | ------------------------------------------------------------------------------------------- |
| `hermes/reviews-001`             | 31           | 26 `major`, 6 `nitpick` (round 1 catches systemic problems)                                 |
| `hermes/reviews-002`             | 22           | 4 critical/major mixed (cleanup pass)                                                       |
| `autonomous/reviews-001`         | 34           | 22 `nitpick` plus a tail of major potential-issues without explicit `severity:` frontmatter |
| `qa-review/reviews-001`          | 25           | 9 `nitpick` plus untyped majors                                                             |
| `agent-capabilities/reviews-003` | 7            | mostly nitpick, all resolved                                                                |
| `agent-capabilities/reviews-004` | 4            | mostly nitpick, all resolved                                                                |

The pattern is clear: **first review round on a fresh PR catches structural/safety issues (24+ majors typical); second/third rounds catch test-shape and edge-case nitpicks**.

## Recurring Implementation Mistakes

These are mistakes the **execution agents** made (the codex/claude jobs that produced the code under review) rather than reviewer-flagged issues:

1. **Forgetting to wrap returned errors with operation context** — repeats across nearly every PR. Pedro's `CLAUDE.md` rule (`fmt.Errorf("context: %w", err)`) is regularly forgotten on the cleanup paths.
2. **Skipping `t.Run("Should...")` subtests when adding "just a couple more cases"** — every review round has at least one of these. Reviewer evidence: hermes-001 issue_005, issue_009, issue_025; autonomous-001 issue_006, issue_026, issue_028; qa-review-001 issue_006, issue_010.
3. **Discarding errors via `_`** — autonomous-001 issue_020 (`json.Marshal`), with the reviewer quoting the project's own rule.
4. **Missing context cancellation on cleanup/error paths** — hermes-001 issue_001 (process context leak after registration failure).
5. **Falling back to `http.DefaultClient`** for outbound calls without timeout — hermes-001 issue_015.
6. **Producing schema changes without a real migration** — hermes-001 issue_020 (Critical). Schema drift between the in-memory model and `storepkg.EnsureSchema` happened repeatedly because the migration system has two paths (global DB has migrations; catalog DB used `EnsureSchema`).
7. **Local validation duplication instead of adding `Validate()` on the domain struct** — autonomous-001 issue_010.
8. **Defensive nil-checks that are unreachable** — autonomous-001 issue_004/005. Agents over-defend after `make(...)` calls.
9. **Whitespace-only CLI flags surviving normalization** — autonomous-001 issue_030.
10. **Implicit-zero-value short-circuiting that hides explicit flag overrides** — autonomous-001 issue_025.
11. **Tests asserting status code only, with no body assertion** — agent-capabilities-003 issue*001: *"Both cases only assert the status code, so an unrelated 404/400 branch would still pass."\_
12. **Build break that isn't surfaced** — `task_03-3b1ca1.err.log` shows `sed: internal/hooks/matchers.go: No such file or directory` and the autonomous task_18 memory file (`memory/task_18.md`) explicitly logs three downstream Playwright/E2E regressions (`BUG-001`, `BUG-002`, `BUG-003`) caught only during full QA execution.
13. **Re-running fix-reviews 19 times because new issues kept appearing** — `reviews-daemon-f77b12-round-003-*` shows the agent repeatedly shrinking scope: from 8 jobs → 5 → 4 → 3 → 1 across 19 attempts in the same hour. Net signal: review remediation isn't converging on the first try when batches are too large.
14. **Test-only methods on production code / mock-behavior assertions** — surfaced indirectly by repeated activations of the `testing-anti-patterns` skill in CLAUDE.md and the issues flagging tests that "pass without exercising the contract".

## Pedro's Decision Patterns

Inferred from the techspec, ADRs, idea, task, and memory artifacts:

### Scoping and prioritization

- **Phased delivery, never one-shot**. ADR-001 explicitly: _"The TechSpec must describe the target state but split the build order into phases. Every phase after the first must name its dependencies."_
- **Always carve a "MVP boundary"**. Autonomous `_tasks.md`:1: _"GREENFIELD (alpha): do not preserve legacy behavior… **MVP boundary:** tasks 01-16 implement the autonomy kernel. Tasks 17-18 prepare and execute QA. Post-MVP network evolution, broad memory scopes, self-correction telemetry, eval/replay, and broad web visibility remain follow-up TechSpecs unless explicitly pulled into scope later."_
- **Dependencies are first-class in `_tasks.md`**: every row has explicit `Dependencies: -` or `task_NN, task_NN`.
- **QA is the last two tasks of every program** (autonomous task_17/task_18; hermes task_10/task_11). Pedro treats QA planning + execution as separate, blocking, critical-complexity items.
- **Complexity rated explicitly per task** (`medium | high | critical`). Critical-complexity tasks are reserved for transactional/lease/safety work and the final QA execution. Out of 18 autonomous tasks, 5 are `critical` and they are exactly the safety-critical primitives (`Task Claim Lease Schema`, `ClaimNextRun And Lease Fencing Service`, `Safe Spawn API CLI And Reaper`, `Coordinator Bootstrap And Restricted Orchestration`, `Autonomy MVP QA Execution`).

### Architecture and rejection patterns

- **He rejects generic event buses on principle**. ADR-009 alternative 3: _"Add a generic event bus… Why rejected: Violates the project's direct-call architecture, weakens type boundaries, and makes behavior harder to reason about."_ Same theme appears in CLAUDE.md ("no event bus") and `_techspec.md`.
- **He rejects parallel/duplicate systems**. ADR-009 alternative 2: _"Create a separate autonomy plugin system… Why rejected: AGH already has the extensibility substrate; a second system increases complexity without solving a new class of problem."_
- **He rejects compatibility shims for old alpha state**. CLAUDE.md: _"Greenfield Alpha — Zero Legacy Tolerance"_; `_techspec.md` reiterates _"No event bus, no reflection-based routing, and no compatibility shims for old alpha state."_
- **One authoritative primitive per concern**. ADR-004: _"`ClaimNextRun` is the only authoritative 'next work' primitive. The scheduler does not claim runs directly in the MVP."_ He explicitly enumerates the alternatives where ownership is split and rejects them.
- **Mechanics in daemon, semantics in agent**. ADR-004's central thesis: _"A daemon-owned mechanical scheduler owns operational safety: idle registry, capability-aware wakeups, lease sweep, recovery, backpressure signals, and deterministic state transitions"_ while _"a coordinator-agent owns semantic orchestration."_ He keeps LLM behavior away from safety-critical state transitions.
- **Manual operation is first-class**. ADR-010 (referenced 7+ times in `_techspec.md`): _"Autonomy is additive to operator workflows. User-created tasks and user-started sessions remain supported."_ He explicitly added a "Manual Control Contract" section to the techspec to enumerate this.

### Documentation patterns

- **Heavy file-and-line citations** in research artifacts. The sandbox `_idea.md` cites `internal/acp/client.go:143-191` etc. roughly every 3 lines. The autonomy `analysis.md` does the same with `(internal/network/capability_brief.go:18-51, internal/network/capability_catalog.go:14-109, internal/config/capabilities.go:43, internal/session/interfaces.go:35-49)` cited as "the same six lines referenced by eight of ten slices".
- **Tables, tables everywhere** for trade-off analysis (Component | Today | Needed; Layer | What AGH has | What's missing; Slice | …). His default reasoning structure is "matrix of state vs gap".
- **Explicit "Alternatives Considered" with Why-rejected** in every ADR.
- **Memory files structure**: `Objective Snapshot → Important Decisions → Learnings → Files / Surfaces → Errors / Corrections → Ready for Next Run`. The shared workflow `MEMORY.md` adds `Current State → Shared Decisions → Shared Learnings → Open Risks → Handoffs`. He treats these like an engineering changelog the next agent must read.
- **Tasks have a `<critical>` block at the top** that repeats `ALWAYS READ`, `MINIMIZE CODE`, `TESTS REQUIRED`, `NO WORKAROUNDS`. Pedro front-loads anti-patterns into the prompt itself.

### Quality gates

- **`make verify` passes before any completion claim** is written into both CLAUDE.md and every task prompt's `<critical>` block.
- **80% coverage minimum per package** is repeated in CLAUDE.md and in every task `## Tests` section.
- **Every task records "Completion Notes"** with explicit verification commands run, coverage percentage, and "not changed" disclaimers for `web/` / `packages/site` when applicable. See `task_01.md:88-95` for the canonical pattern.
- **Auto-commits are allowed but only after clean verification** (`task_03 prompt:24`: _"Automatic commits are enabled for this run, but only after clean verification, self-review, and tracking updates."_).

## Skill Candidates (new skills worth creating)

Each candidate below has _direct evidence_ from the runs. I'm marking weakly-supported ones as **tentative**.

### 1. `cy-test-shape-enforcer` (strong)

- **Trigger**: any time a Go test file is being modified or written.
- **Mandate**: enforce `t.Run("Should...")`, `t.Parallel()` on independent subtests, table-driven default, no inline assertions in monolithic test functions, no `_ = ...` discard, status-code-only assertions must also assert body/error message.
- **Evidence**: 12+ review issues across 4 review rounds explicitly cite the same test-shape rule. CodeRabbit even quotes Pedro's own coding guidelines verbatim. The rule is in CLAUDE.md but execution agents keep ignoring it. Need a skill that runs _before_ writing tests.

### 2. `cy-cleanup-path-auditor` (strong)

- **Trigger**: any function that creates a context, registers a resource, opens a connection, or spawns a subprocess.
- **Mandate**: enumerate every cleanup branch and require explicit `cancel()`, `Close()`, `Stop()`, lease-release, or process-stop on error returns.
- **Evidence**: hermes-001 issue_001 (procCtx leak after registry failure), the recurring "no timeout on http.DefaultClient", the recurring "lease not released on cleanup" pattern, and the `no-workarounds` skill that already exists but addresses a broader concern.

### 3. `cy-schema-migration-checker` (strong)

- **Trigger**: any change to a struct that round-trips through SQLite, any change to an `INSERT`/`SELECT` column list, any change to a `CREATE TABLE` statement.
- **Mandate**: confirm both DB paths get a real migration entry, not `EnsureSchema` only.
- **Evidence**: hermes-001 issue_020 was Critical. The `_techspec.md` for hermes Track 1 explicitly added "deterministic migration runner in `internal/store` that records applied migrations in `schema_migrations`" as a foundational task because of repeated drift.

### 4. `cy-cli-flag-normalization` (strong)

- **Trigger**: any new Cobra command or flag.
- **Mandate**: trim, drop empty/whitespace-only values, fail-loud on unknown overrides, never short-circuit on zero-value when a flag was explicitly set.
- **Evidence**: autonomous-001 issue_025 (`--kind` silently ignored), issue_030 (whitespace `--capability` survived). Both are direct CLI UX bugs that escaped through code review.

### 5. `cy-domain-validate-method` (medium)

- **Trigger**: when adding a request type that gets passed to a handler.
- **Mandate**: every peer-shaped request type must have `Validate()` with the same shape; transport mappers should call it, not duplicate validation locally.
- **Evidence**: autonomous-001 issue_010.

### 6. `cy-review-batch-sizer` (medium)

- **Trigger**: when planning a `cy-fix-reviews` batch.
- **Mandate**: cap each batch at N issues (≤ 8) unless they touch one file. Track convergence — if a single round needs more than 3 retries, stop and ask for human help.
- **Evidence**: `reviews-daemon-f77b12-round-003-*` had 19 retries with shrinking scope. This is a workflow-level convergence problem, not a code problem.

### 7. `cy-context-leak-detector` (medium, overlaps with #2)

- **Trigger**: subprocess/registry/goroutine creation.
- **Mandate**: pair every long-lived context with a `defer cancel()` on every error path.
- **Evidence**: hermes-001 issue_001. CLAUDE.md already mentions this rule under "Concurrency", but it keeps being violated.

### 8. `cy-test-fidelity-checker` (tentative)

- **Trigger**: integration tests with idempotency or contract semantics.
- **Mandate**: assert the actual contract (idempotency key reuse, request payload), not just status code.
- **Evidence**: autonomous-001 issue_012, issue_015, agent-capabilities-003 issue_001. Three distinct review rounds. Tentative because it's narrower than the test-shape skill.

### 9. `cy-prompt-fixture-canonicalizer` (tentative)

- **Trigger**: ACP mock fixture work, daemon-served E2E specs, or any system that asserts exact prompt text.
- **Mandate**: strip daemon-owned situation/context augmentation before matching.
- **Evidence**: `BUG-002` in autonomous task*18 memory: *"`acpmock` exact user-text matching did not tolerate Task 04 situation-context prompt augmentation."\_ This is one incident, but it cost real QA time. Tentative.

## Lesson-Learned Candidates

Specific incidents preserved in memory files that deserve to live in durable docs:

### L1. Two-path schema bug (hermes / memory catalog)

**Incident**: `internal/memory/catalog.go` used `storepkg.EnsureSchema` while the global DB used a real migrations registry. Adding `scope/workspace_root/filename` columns to `memory_operation_log` worked on fresh installs and broke upgraded installs. CodeRabbit caught it as Critical.
**Lesson**: AGH must have **one schema migration primitive shared by all SQLite databases**. The hermes techspec Track 1 was rewritten partly to enforce this.

### L2. SQLite `ORDER BY 0` bug (autonomy / claim service)

**Incident** (memory/task*08.md:18): *"SQLite treats `ORDER BY 0` as an invalid positional reference; zero-capability claim ordering must use a literal expression such as `(SELECT 0)` instead."\_
**Lesson**: SQLite parses positional integers in `ORDER BY` as column references, not literals. Always wrap a literal-zero ordering in `(SELECT 0)` or use an explicit constant column.

### L3. Extension manager disable-vs-unregister race (autonomy / Task 08 verify)

**Incident** (memory/task*08.md:19): *"Full `make verify` exposed an extension manager race where registry-visible disable could precede in-memory hook unregister; fixed production ordering in `internal/extension/manager.go` so disabled extensions no longer transiently expose hooks."_
**Lesson**: When a state machine has both a public-visible state and a private resource, the public flip must come \_after_ the private cleanup. This is reachable from race-flake `make verify` runs only — flaky `TestManagerDisablesExtensionAfterConsecutiveFailures` was the smoking gun. Worth a formal rule.

### L4. Scheduler scope-creep avoided (autonomy / Task 11)

**Incident** (memory/task*11.md): the agent could have added a "scheduler.*" hook taxonomy and a scheduler-side claim path. Pedro's task spec explicitly said _"NO WORKAROUNDS - do not tail task event tables to fake pre-commit hooks"_ (task*03 critical block) and the implementation memo records *"Scheduler must not call ClaimNextRun. Wake prompts are advisory and tell agents to use existing task claim verbs."*
**Lesson**: When a new component sits next to an authoritative primitive, the temptation to extend the primitive into the new component is huge. Pedro's pattern: the scheduler can *wake* and *sweep* but cannot *claim\* — claim authority stays in `task.Service.ClaimNextRun`. This is worth preserving as a general rule: **sub-systems may observe and notify, but durable ownership transitions stay in the owning service**.

### L5. Daemon E2E harness regressions only caught during full QA (autonomy / Task 18)

**Incident** (memory/task_18.md): three Playwright bugs (`BUG-001`/`002`/`003`) only surfaced during `qa-execution` even after `make verify` passed. They were stale-flow assumptions in E2E specs (onboarding-vs-shell ordering, missing session-create dialog, fallback-only Agents-panel state).
**Lesson**: `make verify` is necessary but not sufficient. **The QA execution lane must be a separate task with full critical-complexity gating** — exactly how Pedro structures task_17/18 and task_10/11. Don't let agents sign off without running the canonical QA suite.

### L6. Daemon round-3 retry storm (daemon, looper repo)

**Incident**: `reviews-daemon-f77b12-round-003-*` had 19 attempts in roughly an hour, sequentially shrinking from 8 → 5 → 4 → 3 → 1 stuck files.
**Lesson**: When `cy-fix-reviews` doesn't converge in 1-2 rounds for a given file, the underlying issue is structural (mock contract drift, schema mismatch, hidden invariant) and needs human triage, not more agent loops.

### L7. Capability-published-but-never-matched (autonomy / analysis.md)

**Incident**: the entire autonomy program's existence rested on the observation: _"Capability data is published everywhere and consumed nowhere."_ Eight of ten analysis slices independently flagged the same six source lines.
**Lesson**: when multiple independent investigations converge on the same data structure as "right shape but unconsumed", the gap is integration ergonomics, not architecture. Preserve this as a methodology note: **"if the data exists and the consumer doesn't, build the consumer; do not redesign the data."**

## System Prompt Candidates for CLAUDE.md

These are rules Pedro's reviewer agents repeatedly enforce that aren't _explicit_ in the current CLAUDE.md (or are buried where agents miss them). Each has evidence.

### S1. Test subtest mandate is non-negotiable

Current CLAUDE.md: _"Table-driven tests with subtests (`t.Run`) as default."_
Promote to: **"Every Go test case MUST be inside a `t.Run("Should...")` subtest. Adding inline test cases to an existing function is a blocking violation."**
Evidence: 12+ review issues quote the rule and still flag violations. The "default" wording is too soft.

### S2. `t.Parallel()` is the default for independent subtests

Current CLAUDE.md: _"`t.Parallel()` for independent subtests."_
Promote to: **"Independent subtests MUST call `t.Parallel()`. The default Go test that does not need shared state must run in parallel; opting out requires a comment justifying the dependency."**
Evidence: agent-capabilities-003 issue_006/007, autonomous-001 issue_032.

### S3. No `_ = errFn(...)` ever

Current CLAUDE.md: _"Never ignore errors with `_`— every error must be handled or have a written justification."_
This is already explicit but agents still ignore it. Promote to a`<critical>` block. Evidence: autonomous-001 issue_020 with the reviewer literally quoting the rule.

### S4. External-call timeouts

Current CLAUDE.md: implicitly via "production paths" wording.
Promote to explicit: **"Any outbound HTTP/network call MUST use a client with an explicit timeout. `http.DefaultClient` is forbidden in production code paths."**
Evidence: hermes-001 issue_015, marked Major, with reviewer citing project rules.

### S5. SQLite schema changes require a migration entry

Not currently in CLAUDE.md. Add: **"Any change to a column, index, or constraint on a SQLite-backed table MUST add a versioned migration. `EnsureSchema`-style boot reconciliation is forbidden for column changes."**
Evidence: hermes-001 issue_020 (Critical).

### S6. Authoritative primitives are exclusive

Not currently in CLAUDE.md. Add (lifted from ADR-004): **"When an authoritative primitive owns a state transition (e.g., `ClaimNextRun`, `Spawn`, `EnsureMigration`), no peer package may replicate the transition. Wake/observe/sweep are allowed; claim/own is not."**
Evidence: ADR-004, ADR-009, autonomy memory/task_11.md.

### S7. Cleanup paths must cancel context

Current CLAUDE.md: _"Every goroutine must have explicit ownership and shutdown via `context.Context` cancellation."_
Strengthen: **"Every error-return path that previously created or extended a `context.Context` MUST `cancel()` it. Process registration, goroutine spawn, and resource acquisition all count."**
Evidence: hermes-001 issue_001 (Major).

### S8. Implicit-zero-value short-circuit is forbidden

Not currently in CLAUDE.md. Add: **"CLI/handler logic must distinguish 'flag not set' from 'flag set to zero value'. Use `cmd.Flags().Changed(name)` (Cobra) or equivalent presence detection. Silently ignoring an explicit flag is a bug."**
Evidence: autonomous-001 issue_025.

### S9. Whitespace normalization on string-list flags

Not currently in CLAUDE.md. Add: **"String-slice CLI inputs (capabilities, IDs, tags, paths) must trim and drop empty entries before sending. Do not push whitespace-only strings to the daemon as 'validation problems'."**
Evidence: autonomous-001 issue_030.

### S10. Defensive nil-check after `make` is dead code

Not currently in CLAUDE.md. Add: **"Do not add `if x == nil` guards on values you just initialized with `make(...)`. Reviewers and lint will flag these as unreachable."**
Evidence: autonomous-001 issue_004 and 005.

### S11. Memory file discipline

Not currently in CLAUDE.md but enforced by `cy-workflow-memory`. Add a pointer: **"When a task provides workflow memory paths, read both `MEMORY.md` (shared) and the current `task_NN.md` (local) before editing code, and update both before completion. Promote durable cross-task context only to the shared file."**
Evidence: every task prompt repeats this in its critical block.

### S12. Hooks must not become an event bus

Not currently in CLAUDE.md but enforced by ADR-009. Add: **"Adding a hook event for an internal observability signal is a workaround. Internal liveness/wake/recovery signals stay as logs/metrics. Hooks are typed extension points for operator-meaningful behavior, not a fan-out bus."**
Evidence: ADR-009, autonomy task*03 critical block: *"hooks must not become a generic event bus or scheduler authority."\_

## Most Valuable Surprises

1. **AGH was 80% built before the autonomy program**. The opening of `autonomous/analysis/analysis.md`: _"AGH already has roughly 80% of the substrate for autonomy… What is missing is structural — not algorithmic, not even mostly new code."_ The autonomy program is **integration work, not invention**. This shapes how all 18 tasks decompose.
2. **The `__DYNAMIC_BOUNDARY__` pattern from claude-code is referenced by name** in `analysis.md` as the architectural template for refreshable system prompts. Pedro is pulling design ideas directly from the harnesses he benchmarks against (Claude Code, GoClaw, Hermes, OpenClaw, OpenFang, AGH v1).
3. **The same six lines of code are flagged by eight of ten parallel research slices**. The `internal/network/capability_brief.go:18-51` + `capability_catalog.go:14-109` + `config/capabilities.go:43` + `session/interfaces.go:35-49` cluster is the "right shape, no consumer" canonical example. This is rare validation that an investigation has reached a real architectural fact.
4. **Pedro names the trigger explicitly: publish/start/approve, not create**. Every single ADR around coordinator triggers (`ADR-005`, `ADR-010`, `ADR-012`) re-states the boundary: _"Task creation is not blocked by autonomy. Once a user gives a task the go-ahead to run, by publishing, starting, or approving execution so a run is enqueued, the coordinator becomes the default orchestrator for that run."_ He's preventing the agent from auto-spawning on `task.created` even though that would be the most obvious wiring.
5. **The 19-attempt daemon round-3 retry storm is invisible from inside any single attempt**. Each individual `result.json` says `"status": "succeeded"`. Convergence/divergence across attempts is only legible by listing the runs directory and comparing job counts. **Compozy lacks a "convergence health" signal** — there's no metric like "this batch needed N attempts to drain". Worth instrumenting if review fix loops continue.
6. **Pedro explicitly preserves errors from QA execution as separate from production code in commits**. `task_18.md:30`: _"Local commit created: `dcb89534 test: complete autonomy qa execution`. Tracking/memory files remain local tracking artifacts; the commit intentionally includes only code fixes and required QA evidence."_ He treats memory files and PRD scaffolding as **deliberately uncommitted runtime state**, not code. This explains why the `git status` at session start shows so many `M` files — they're durable workflow memory, not pending code.
7. **One QA pass surfaced three E2E regressions that `make verify` missed**. `task_18.md` lists `BUG-001` (workspace fixture/onboarding race), `BUG-002` (acpmock prompt-prefix mismatch after Task 04 augmentation), and `BUG-003` (stale Agents-panel selector). These are exactly the kind of cross-component drift bugs that pure unit/lint/build coverage cannot catch. The case for keeping `qa-execution` as a separate critical-complexity task is empirically strong.
8. **The greenfield-alpha discipline is real and visible**. ADR-001: _"AGH is greenfield alpha, so the system can make clean schema and API changes."_ And `_techspec.md` rejects compatibility shims explicitly. The autonomy program adds `migration v7` (task_07.md) and changes the `claim_token` storage shape mid-program without a single "preserve old format" branch. This works only because Pedro has been militant about it.
9. **Codex `xhigh` reasoning is used for all backend tasks; Claude `opus xhigh` is used only for the single frontend task**. From the 16-job autonomy run: 15 jobs were `"ide": "codex", "reasoning_effort": "xhigh"`; 1 job (`task_15`, the Tasks UI Manual-First labels work) was `"ide": "claude", "model": "opus", "reasoning_effort": "xhigh"`. Pedro has empirically settled on Codex for Go and Claude-Opus for React/E2E.
10. **The autonomous program shipped 12 ADRs alongside an 18-task techspec**. ADRs are not optional — every architectural decision is named, justified, and links its alternatives. The total artifact set for autonomous alone is 5.4 MB across 131 markdown files (counting `analysis/`, `adrs/`, `memory/`, `qa/`, `reviews-001/`, and 18 task files). This is the documentation-density baseline he expects for a critical-complexity program.

## Notes for Synthesis

- **Demo-run inflation**. 622 of 760 directories are `tasks-demo-2a9751-*`. They share one slug and were probably generated by a CLI development loop or a single fixture. They contribute almost no substantive signal — sampling 5 confirmed identical structure with empty/short jobs. Treat the effective corpus as ~138 runs.
- **One looper run leaked into the agh corpus**. `reviews-daemon-f77b12-round-003-*` sets `workspace_root: /Users/pedronauck/dev/compozy/looper`, not agh. This is a different repo. The retry-storm pattern still applies as a Compozy workflow observation, but the specific file paths it cites are looper, not agh. Do not import lessons that mention `internal/cli/daemon_commands.go` etc. as agh-specific.
- **Severity frontmatter is inconsistent**. Many issue files have `severity: major` while others omit it (the `_⚠️ Potential issue_ | _🟠 Major_` markers are inside the body, not frontmatter). Counts in this report are approximate. If exact severity ratios matter, parse both the frontmatter and the body markup.
- **Memory files are sometimes left dirty in `git status`**. The session-start `git status` shows 26 modified `.compozy/tasks/autonomous/*` files. These are durable workflow tracking, not pending code, and Pedro explicitly chose not to commit them with the QA pass. Don't treat this as "uncommitted work".
- **Cross-reference candidates**:
  - The `cy-test-shape-enforcer` skill recommendation overlaps with the existing `testing-anti-patterns` skill — they should be evaluated together to avoid duplication.
  - The `cy-cleanup-path-auditor` skill overlaps with `deadlock-finder-and-fixer` and the existing CLAUDE.md "Concurrency" rules.
  - The `lesson-learned` skill exists as a generic git-history analyzer; this analysis populates the same kind of artifact at a higher level (workflow runs vs commits).
  - `compozy` and `cy-workflow-memory` skills together cover the "how to use Compozy" surface; the system-prompt candidates above are about _what to enforce inside the agents Compozy launches_, which is a different layer.
- **Tentative findings**: anywhere this document says "tentative" the evidence was 1-2 incidents. Promote to durable rules only if a second independent run exhibits the same failure.
- **Suggested follow-up**: the run history would be far more analyzable if Compozy emitted a per-batch convergence summary (attempt N of M, issues_remaining trend). The 19-attempt storm should never have survived to attempt 19 silently.
