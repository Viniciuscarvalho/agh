# Analysis: AGH Project Compozy Runs (.compozy/runs)

## Scope

- **Source**: `/Users/pedronauck/Dev/compozy/agh/.compozy/runs/` — 84 run directories total.
- **De-duplicated**: ~48 unique runs after removing `_1` mirror copies created by Compozy's run-replay/import side-effects.
- **Date range**: 2026-04-06 (workspace-entity bootstrap) → 2026-04-24 (session-driver-override review round 4).
- **Sampling method**: Read every `run.json` and `result.json`; opened all batch prompts to enumerate scope and skill activation; deeply inspected stdout of one representative run per archetype (review batch, PRD task, exec/review-spec, harness/runtime, redesign/UI). Drilled into `err.log` files larger than 100 bytes to surface real failure modes. Cross-referenced run ids with archived issue files under `.compozy/tasks/_archived/` and active task dirs (`autonomous/`, `session-driver-override/`, `unified-capabilities/`, `redesign/`, `harness/`) to confirm what each run actually changed in the codebase.
- **Run mode breakdown**: `pr-review` ≈ 31, `prd-tasks` ≈ 14, `exec` (free-form spec review) = 1. `prd-tasks` runs span 2-32 jobs; review batches are typically 1-2 jobs covering 6-17 files / 7-34 issues each.

## Active Work Streams

The runs cluster into eight distinct PRD streams, each visible by name prefix in the run id:

1. **`workspace-entity`** (Apr 6) — first AGH PRD to land. Introduced `internal/workspace/`, `WorkspaceStore`/`WorkspaceResolver` contracts, sentinel errors, and a workspace-scoped session model (`tasks-workspace-entity-283139-*` + 2 review rounds).
2. **`skills-system` / `skills-v2`** (Apr 6-7) — bootstrap of `internal/skills/` with the SKILL.md loader, `RegistryConfig`, frontmatter parsing, and the bundled-FS contract anchored in ADR-005.
3. **`refac` / `refac-v2`** (Apr 6-7) — large-scale package re-rooting that produced today's `internal/api/{contract,core,httpapi,udsapi}` split, the SQLite recovery path, and `mage Boundaries` rules.
4. **`hooks` / `session-resilience`** (Apr 9-10) — typed hook taxonomy, hook dispatch, and session resume/repair work.
5. **`ext-architecture` / `extgaps` / `ext-parity`** (Apr 10-17) — extension/manifest system, `internal/extension/`, capability resolver, host API; this stream had 4 rounds of review.
6. **`tool-ui` / `web-pages` / `web-ui-redesign`** (Apr 13-15) — web SPA work in `web/src/systems/session/components/`, message rendering, tool-call UI.
7. **`harness` / `e2e`** (Apr 17-19) — harness runtime spec (the long-form review in `exec-20260417-232547-929722000`), Playwright/runtime E2E lanes, and the browser-vs-runtime split formalized in ADR-002 / ADR-005 of `e2e/`.
8. **`redesign` / `unified-capabilities` / `session-driver-override`** (Apr 18-24) — `@agh/ui` package and tokens migration; later runs converged on the unified-capabilities catalog (`internal/network/capability_catalog.go`) and session driver override.
9. **`autonomous`** (currently in flight, PR 75) — coordinator/scheduler/claim-lease MVP; review round 1 has 34 issues queued, QA verification recorded in `.compozy/tasks/autonomous/qa/verification-report.md`.

The taxonomy mirrors what Pedro is shipping in this repo and is more granular than the global runs view. Each stream produced its own `_techspec.md`, ADR set, `task_NN.md` files, and per-round `reviews-NNN/` issue directories.

## AGH-Specific Code Issues That Recur

These are concrete, AGH-only bug classes the issue files repeatedly surface. Citations point to real triage notes inside `.compozy/tasks/_archived/<prd>/reviews-NNN/issue_*.md`.

### 1. SQLite WAL/SHM hygiene

`refac-v2/reviews-001/issue_001.md` — critical: `recoverSQLiteDatabase` in `internal/store/sqlite.go` renamed only the `.db` file and left `-wal`/`-shm` siblings, so the replacement DB picked up stale WAL state. Triage notes the exact fix (rename companions). This is a direct consequence of the per-session SQLite event store design and recurs whenever new code paths touch `OpenSQLiteDatabase`.

### 2. Goroutine-ownership drift in `internal/session`

`refac-v2/reviews-001/issue_007.md` — high (triaged invalid that round but flagged again later): `watchProcess` and `pumpPrompt` in `internal/session/manager_lifecycle.go` and `manager_prompt.go` start untracked goroutines while `consolidation.Runtime` correctly uses `sync.WaitGroup`. The CLAUDE.md rule "every goroutine must have explicit ownership" is repeatedly tested by review.

### 3. Context-bounded subprocess shutdown

`ext-architecture/reviews-001/issue_006.md` — major: in `internal/acp/client.go:356` (now `Stop`), the managed-process branch called `proc.Wait()` unconditionally after `proc.managed.Shutdown(ctx)`, blocking forever on context cancellation. Fix template was a `select { case <-proc.Done(): case <-ctx.Done(): }`. The non-managed path already had it — proves drift between two parallel implementations of the same contract.

### 4. `make Boundaries` rule rot after package splits

`refac-v2/reviews-001/issue_008.md` — medium: `magefile.go`'s `Boundaries()` enforced rules for the old top-level packages but missed the new `internal/api/{contract,core,httpapi,udsapi}` subtree. After every refactor that introduces a new package layer, the boundary list silently goes stale. This is a unique AGH cost of the "CI-enforceable boundaries" architecture decision.

### 5. Error-wrapping discipline

Across `ext-architecture/reviews-001/issue_001.md`, `issue_017.md` (and many others), CodeRabbit repeatedly flags raw error returns that drop operation/path context. The exact fix is always `fmt.Errorf("context: %w", err)`. The CLAUDE.md rule is in force, but the chained-provider pattern in `internal/daemon/hooks_bridge.go` and `cmd/agh-codegen/main.go` keeps re-introducing thin error returns.

### 6. Codegen + formatter ordering

`reviews-ext-architecture-f041a7-round-001` ended with a _second_ commit `788c554 fix: stabilize codegen checks after formatter hooks` because the first commit revealed a real mismatch between `agh-codegen`'s output and the formatter pipeline. The agent compared raw bytes of generated SDK contracts against pre-formatted output. The fix forced semantic JSON comparison and ran TypeScript formatting _before_ the byte/SDK contract write/check.

### 7. `t.Run("Should...")` test structure compliance

`unified-capabilities/reviews-004` — multiple issues forced reviewed Go tests in `internal/api/udsapi/handlers_test.go`, `internal/daemon/daemon_test.go`, and `internal/procutil/procutil_test.go` into the project's table-driven `t.Run("Should ...")` shape. CodeRabbit calls this out repeatedly; the convention is implicit in CLAUDE.md but is not always followed by first-pass code.

### 8. Self-referential / pointless test fixtures

`session-driver-override/reviews-004` removed a self-referential provider oracle in `internal/api/httpapi/handlers_test.go:934` and a dead `uncancelreadMeta` wrapper in `internal/session/query.go:196`. Pattern: tests that mock a thing in terms of itself or wrap a function that never gets called outside a test. The `testing-anti-patterns` skill is named for exactly this.

### 9. SSE prompt provisional-vs-real input race

`unified-capabilities/reviews-004/issue_001.md` (`internal/api/httpapi/prompt.go`) — when an early `tool_result` event arrives before the corresponding `tool_call`, the SSE handler synthesized an empty input that then prevented the real input from replacing it. Domain-specific to AGH's SSE bridge between session events and the web client.

### 10. Symlink-escape detection over-eager on macOS

`reviews-extgaps-2d5f2e-round-000-20260415-034745` failures (TestCopyInstallTreeMaterializesSymlinkTargets, TestInstallLocalManagedUsesInstalledChecksumForMaterializedSymlinks, TestCopyInstallTreeRejectsSymlinkDirectoryCycles) — the extension installer rejected symlinks because `/var/folders/.../source/loop` resolved through `/private/var/folders/...` (macOS's symlinked `/var`), looking like an escape. AGH-specific: the extension copy tree code in `internal/extension/install_managed.go` needs path canonicalization through `EvalSymlinks` _before_ containment check.

## Architecture Decisions Recorded

The `.compozy/tasks/<prd>/adrs/` directories now total 12+ ADRs for `autonomous/` alone. The runs reveal which decisions have stuck and which were renegotiated:

- **ADR-002 (autonomous): "Agent-Facing CLI Before Built-In MCP Tools"** — explicitly defers `agh.*` MCP tools; agent identity inferred from `AGH_SESSION_ID`/`AGH_AGENT`; canonical commands `agh me context`, `agh ch reply`, `agh ch recv --wait`, `agh task next/heartbeat/complete/fail/release`. Avoids alias proliferation in the MVP.
- **ADR-012 (autonomous, 2026-04-26): "Task-Run Coordination Channels"** — every workspace-scoped coordinated `task_run` carries one durable `coordination_channel_id`; channels are not authoritative for ownership ("bind always, speak when useful"). Forbids posting raw `claim_token` through channel messages. This decision was directly informed by the harness review (`exec-20260417-232547-929722000`) that warned against `BackgroundRun` becoming a third runtime.
- **ADR-005 (skills-system): "go:embed for Bundled Skills via fs.FS Interface"** — concrete skills task wired the `RegistryConfig.BundledFS` to `fs.FS` (not `embed.FS`) for testability. Visible in `tasks-skills-system-e5f5d9` task_01.
- **ADR-002 / ADR-004 / ADR-005 (e2e)** — split runtime E2E from browser E2E lanes (`internal/extensiontest/bridge_adapter_harness.go` is runtime truth; `web/e2e/` asserts on browser-visible outcomes only). Tiered execution: PR-required vs nightly.
- **`refac-v2`** locked in the `daemon/` composition root rule and the new `internal/api/{contract,core,httpapi,udsapi}` layer split. The Boundaries() rule now enforces these.
- **Rejected from autonomous**: the harness review rejected a single `HarnessProfile` enum that conflated session shape with turn origin; rejected `BackgroundRun` as a third runtime when `task_runs` already had `status`, `attempt`, `idempotency_key`, `origin_kind/ref`. Quote from `exec-20260417-232547-929722000/turns/0001/response.txt`: "Spec não declara: big-bang, adapter, ou coexistência — e política zero-legacy exige declarar 'delete'".

## Tool Call Patterns

Real Codex behavior captured in batch_001.out.log streams (note: tokens are streamed individually, so reading the full out.log is expensive — ~100k LOC for one ~30-min run):

### What works well

1. **Memory loading first**: every batch starts with `ls -1 .codex/ledger` and `ls -1 .codex/plans` to load prior continuity. The session-driver-override round 4 run listed 169+ ledger entries before doing anything else. This is `cy-workflow-memory` discipline in action.
2. **Triage-before-edit pattern** is real and mechanical. Codex reads every `issue_NNN.md` first, updates frontmatter `status` to `valid`/`invalid` with technical reasoning, and only then opens code. The `<execution_contract>` in every batch prompt enforces this.
3. **Fresh `make verify` evidence**: every successful run ends with a `VERIFICATION REPORT` containing literal `make verify` exit code, oxlint warnings/errors, vitest counts, Go test counts, and `OK: all package boundaries respected`. This is `cy-final-verify` discipline.
4. **Single local commit per batch** with structured message `fix: resolve <prd> review round <N>`. Working tree is intentionally left dirty when `_meta.md` files were modified by Compozy itself — agent does not re-stage them.

### What wastes effort

1. **Repetition of identical setup commands across ~30 task subagents**: each task in `tasks-redesign-62ed61-20260418-173215-000000000` re-reads the same `_techspec.md`, `_tasks.md`, ADR files, and CLAUDE.md. The 32-job redesign run paid this cost 32 times. Workflow memory partially mitigates but does not avoid the per-task re-load.
2. **`rg` queries that come back empty** are common — `rg -n "type stubRegistryStore" -A80 internal/bridges/managed_sync_test.go` returned exit 1 in the extgaps run because the file did not exist anymore. Codex eventually corrects, but each blind probe burns context.
3. **Git index lock contention**: `tasks-skills-v2-d2eb18-20260407-222116-000000000_1/jobs/task_05-f8e6c1.err.log` shows `fatal: Unable to create '.git/index.lock': File exists.` Concurrent task workers tried to commit in the same worktree simultaneously. This is a Compozy-orchestration-level bug — multiple subagents must not share a worktree for `git add`.
4. **Auto-pasted `🤖 Prompt for AI Agents` blocks from CodeRabbit** are huge (often 30+ lines) and arrive verbatim inside issue files. Codex reads them but rarely benefits — the human-readable triage section is what drives the fix.

### Failure modes seen in the wild

- **`exit_code: -1, error: "ACP agent process exited before all sessions completed"`** — `tasks-e2e-6d8749-20260417-023432-000000000` task_12 died this way; the parent run was marked `failed` even though tasks 09/10/11/13 succeeded. Root cause is the daemon-side ACP process group, but it is a production-runtime concern: when one Codex subagent crashes, sibling tasks in the same run lose their session.
- **`exit_code: -2, error: "activity timeout: no output received for 10m0s"`** — same run, task_14. The 10-minute idle timeout triggered. Task_14 was "Browser bridges operator flow", a high-complexity Playwright task; the timeout suggests the Playwright fixture seeding hung.
- **`ACP error -32603: stream disconnected before completion: The model `gpt-5.5` does not exist`** — `reviews-session-driver-override-79f260-round-000-20260424-021709`. The codex driver was configured with `model: "gpt-5.4"` in run.json but the upstream API rejected `gpt-5.5`. The human re-ran the same batch within the hour with the correct model and succeeded (`-20260424-023216`).

## Skill Candidates

Each candidate is justified by 3+ pieces of evidence visible in the runs.

### 1. `agh-store-sqlite` — SQLite WAL/SHM and corruption-recovery hygiene

Evidence: (a) `refac-v2/reviews-001/issue_001.md` critical SQLite WAL recovery bug; (b) `refac-v2/reviews-001/issue_002.md` migrate_workspace.go schema evolution warnings; (c) harness review (`exec-20260417-232547-929722000`) called out `globalSchemaStatements` using `CREATE TABLE IF NOT EXISTS` without versioning. A skill that bakes in: rename `-wal`/`-shm` on recovery, schema-version bump procedure, and SQLite transaction discipline for `internal/store/{globaldb,sessiondb}/*.go` would catch all three.

### 2. `agh-acp-subprocess` — ACP client lifecycle and process-group contracts

Evidence: (a) `ext-architecture/reviews-001/issue_006.md` managed-process Stop without ctx; (b) `tasks-e2e-6d8749` task_12 "ACP agent process exited" failure mode; (c) repeated `internal/procutil/process_started_at_unix.go` reviews about Unix-only ps execution and locale handling in `unified-capabilities/reviews-004/issue_008-009`. A skill that codifies AGH's subprocess + JSON-RPC patterns and the `procutil` constraints would gate all three.

### 3. `agh-session-manager-goroutines` — session/manager goroutine ownership

Evidence: (a) `refac-v2/reviews-001/issue_007.md` watchProcess/pumpPrompt fire-and-forget; (b) the `session-driver-override` round-4 fixes around `internal/session/manager_workspace.go:125` nilguard regressions; (c) `provider_lifecycle_test.go` strengthening across multiple rounds. A skill that enforces the WaitGroup pattern, ctx propagation, and the manager\_\*.go file split would catch all three.

### 4. `agh-codegen-pipeline` — `agh-codegen` + formatter + check ordering

Evidence: (a) `ext-architecture/round-001` follow-up commit `788c554` fixing pre/post-format byte-comparison; (b) `unified-capabilities/reviews-004/issue_003-005` typed-generated-file errors in `internal/codegen/openapits/generate.go`; (c) `cmd/agh-codegen/main.go` repeatedly receiving error-context fixes (`reviews-001/issue_001.md`, `round-004/issue_001-002.md`). A codegen-specific skill enforces "format before write/check" and "compare semantically, not byte-for-byte".

### 5. `agh-extension-installer` — symlink + path canonicalization for `internal/extension`

Evidence: (a) extgaps run failures with macOS `/private/var/folders/...` symlink containment; (b) installLocalManaged checksum-for-materialized-symlinks bugs; (c) ext-architecture round-2 issues around `host_api.go` reference support tests. A skill that encodes "always `EvalSymlinks` the source root before containment, and materialize symlinks before checksum" would close all three.

### 6. `agh-review-batch-driver` — operationalizing the review-batch contract

Evidence: (a) ~30 review-batch runs that all follow the identical `<execution_contract>`; (b) the recurring "leave \_meta.md untouched / commit code-only" pattern; (c) the consistent `VERIFICATION REPORT` block format. The pattern is uniform enough to deserve its own skill that codifies the triage-then-edit-then-verify-then-commit sequence as an explicit AGH-specific protocol on top of `cy-fix-reviews`.

## Lesson-Learned Candidates

### LL-1: Greenfield + zero-legacy means _delete_, not _adapt_

In the harness TechSpec review (Portuguese, `exec-20260417-232547-929722000/turns/0001/response.txt`), the reviewer wrote: _"política zero-legacy exige declarar 'delete'"_ — the spec proposed migrating the `inputAugmenter` callback to a `TurnAugmenter` pipeline but did not say whether the old callback was deleted, kept as adapter, or coexisting. The lesson is repeatable across AGH: every breaking-change spec must explicitly name the delete target. This belongs in CLAUDE.md as an explicit reviewer checkpoint.

### LL-2: Per-session SQLite stores need explicit schema-version + `wipe` semantics

The harness review flagged `CREATE TABLE IF NOT EXISTS` schema evolution as silent technical debt. Combined with the `recoverSQLiteDatabase` WAL bug and the migrate_workspace.go reviews, the lesson is: any new column or table on `agh.db`/`events.db` requires (a) a schema version bump, (b) an explicit migration path or a `wipe` statement under zero-legacy policy, and (c) a recovery test covering WAL/SHM siblings.

### LL-3: Codegen output stability is its own subsystem

The `788c554` follow-up commit and repeated codegen reviews show that AGH's `cmd/agh-codegen/main.go` is the most frequently-broken non-runtime path. Lesson: format outputs _before_ the canonical compare; compare JSON semantically; never byte-equality-compare TypeScript.

### LL-4: Concurrent worktree commits will deadlock

`tasks-skills-v2-d2eb18` task_05 hit `.git/index.lock` contention because concurrent task workers tried to commit in one worktree. Lesson: Compozy must serialize commits per worktree (or each subagent must own its own worktree, which is what the harness runs in `Compozy/_worktrees/harness/.compozy/runs/...` actually do — the run.json paths confirm this).

### LL-5: `gpt-5.5` (and any non-existent model name) silently breaks the entire batch

The session-driver-override round at 02:17 (UTC) failed with ACP -32603 because the codex driver called for an unavailable model. There was no upfront validation. Lesson: when launching a Compozy run in `pr-review` mode, validate the configured model against the IDE's actual model list at run start, before subprocess spawn — otherwise an entire 13-issue batch is wasted.

### LL-6: Budget-by-budget augmenter pipelines need explicit failure policy

The harness review surfaced that `manager_prompt.go:99` does silent skip-and-continue on augmenter failure today. With N ordered augmenters, fail-fast vs skip-and-continue must be explicit per-augmenter, with an observable event in either path. Critical because memory recall has a 1500-char budget — a silent fallthrough loses information without a trace.

## System Prompt Candidates for CLAUDE.md

These are AGH-specific rules backed by run evidence that are not currently in CLAUDE.md (or are hinted at but not enforced):

1. **"Every breaking-change techspec must name its delete targets explicitly."** — Evidence: harness review LL-1. CLAUDE.md says "delete the old thing instead of working around it" but does not require the techspec to _list_ the deleted artifacts.

2. **"SQLite recovery code paths must rename or remove `-wal` and `-shm` companions."** — Evidence: `refac-v2/issue_001`. Add as a hard rule under the Coding Style section.

3. **"`magefile.go` Boundaries() must be updated in the same commit that introduces a new internal/api/\* subpackage."** — Evidence: `refac-v2/issue_008` showing rule rot. The rule is implicit in "CI-enforceable boundaries" but agents miss it.

4. **"Per-batch review commits must use exactly one local commit and leave Compozy-managed `_meta.md` files unstaged."** — Evidence: every successful review run does this. Currently lives only in `cy-fix-reviews` skill, not CLAUDE.md.

5. **"Codegen output is canonicalized — format before compare, semantic JSON compare for JSON files, byte-compare only after a deterministic formatter pass."** — Evidence: `cmd/agh-codegen/main.go` reviews + the `788c554` follow-up. Belongs under a new "Codegen" subsection.

6. **"Subprocess managed-stop must respect `ctx.Done()` between Shutdown and Wait."** — Evidence: `ext-architecture/issue_006`. Strengthens the existing "context.Context as first argument" rule with a specific subprocess-shutdown idiom.

7. **"Goroutines spawned by `internal/session/manager_*.go` must be tracked by Manager-owned WaitGroup and joined in Manager shutdown."** — Evidence: `refac-v2/issue_007`, `session-driver-override/issue_009`. Strengthens the existing "every goroutine must have explicit ownership" rule with a specific package-level enforcement.

8. **"Agent-facing CLI commands stay identity-inferred from `AGH_SESSION_ID` / `AGH_AGENT`; do not introduce `agh.*` MCP tools before the CLI/UDS contract stabilizes."** — Evidence: ADR-002 of autonomous. Belongs alongside the CLI commands list in CLAUDE.md if/when CLAUDE.md acquires that section.

## Cross-Reference Hints

What this analysis suggests other sources should confirm or extend:

- **Codex sessions**: the streamed `batch_001.out.log` files show ledger references like `.codex/ledger/2026-04-XX-MEMORY-*.md`. There are 169+ such ledger entries listed in the session-driver-override stream alone. A codex-sessions analysis can show what's _inside_ those ledgers — they were not in scope here. The ledger naming convention is `YYYY-MM-DD-MEMORY-<topic>.md`.
- **`.compozy/tasks/_archived/`**: this analysis sampled `20260411-014454-ext-architecture` and `20260407-185953-refac-v2`. A QMD/global-runs analysis can enumerate the _full_ set of archived PRDs (40+ visible) and produce a chronology of which streams shipped successfully vs were abandoned.
- **`docs/ideas/`**: the harness review prompt (turn 0001 of exec-20260417) listed `docs/ideas/orchestration/multi-agent-patterns-analysis.md`, `docs/ideas/from-claude-code/filtered_recommendations.md`, `docs/ideas/market-pair/gap-analysis.md` as input artifacts. A `docs/ideas/` analysis would show the "research feeding into specs" side of the workflow.
- **`_worktrees/`**: the harness PRD `tasks-harness-49f756-20260418-172235-000000000` ran out of `/Users/pedronauck/Dev/compozy/_worktrees/harness/`. This is evidence that AGH uses `git worktree` for parallel PRD execution — confirms the LL-4 hypothesis about worktree isolation. A separate analysis of `_worktrees/` would show the per-PRD physical isolation pattern.
- **CodeRabbit review hashes**: each issue file carries `provider_ref: review:<id>,nitpick_hash:<hash>` (e.g., `e83f8666f561`). These are stable across runs and could be cross-referenced against GitHub PR threads for ground-truth on which reviews actually merged vs were rejected.

## Notes for Synthesis

- The runs _prove_ AGH is a high-velocity, review-driven development environment. The cycle is: PRD → techspec (often with ADRs) → tasks (numbered, dep-graphed) → implementation → CodeRabbit review → batched-review fix → verify → commit. Every stage has a Compozy run with frozen artifacts.
- The dominant tool driving runs is **Codex (gpt-5.4)**. Claude (`opus`) appears only in: the harness techspec review (`exec-20260417-232547-929722000` — a free-form spec review using subagents) and the `tasks-redesign-62ed61-20260418-173215-000000000` 32-job redesign run. Pattern: Codex for code-edit batches, Claude for spec/review/design synthesis.
- The Compozy artifact surface is **stable across two months of runs** — same batch_NNN naming, same `<execution_contract>`, same `VERIFICATION REPORT` shape, same `_meta.md` summary block, same `Co-Authored-By: Claude / Codex` commit footers (visible in the streamed git output). This stability is itself a finding: the orchestration contract has not drifted.
- The mirrored `_1` directories (every old run has a `_1` twin from Apr 19 01:12) are an artifact of a single bulk re-import on that date, not duplicate runs. They contain the same content. For dedupe purposes, treat `_1` as a no-op.
- The autonomous PR (#75) is the **largest live work stream as of Apr 26**: 18 tasks, 12 ADRs, 34 review issues queued, full QA verification report with 18 test cases passed. It is the most likely source of the next round of run artifacts.
- The harness exec review (in Portuguese) is the single richest review artifact in the corpus — 76 numbered findings, a verdict, and concrete spec-modification recommendations. It demonstrates what a high-quality AGH techspec review looks like and should be treated as a reference template.
- A dedicated "AGH ops" skill that bundles `cy-fix-reviews` + `cy-final-verify` + the `make verify` gate + the single-commit-per-batch protocol could replace the three-skill activation that every review run currently does.
