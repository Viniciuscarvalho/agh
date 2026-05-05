Goal (incl. success criteria):

- Run a fresh release-grade QA loop for AGH focused on networks, tasks, extensions, hooks, triggers, jobs, agent sessions, and agent-to-agent coordination.
- Success requires fresh wave-3 scenario artifacts, real CLI/API/Web evidence, root-cause fixes for reproducible bugs, regression coverage for any fixes, and a fresh `make verify` before any readiness claim.

Constraints/Assumptions:

- Conversation may be BR-PT; artifacts, code, and QA reports stay in English.
- Do not use destructive git commands or touch unrelated dirty worktree files.
- Treat existing `.codex/ledger/2026-04-27-MEMORY-release-qa.md` and prior QA ledgers as read-only awareness, not as this session’s canonical memory.
- Browser validation must use `browser-use:browser` with the `iab` backend first; only fall back if the documented setup path fails.
- Final proof cannot rely on mocks/stubs; use real daemon/CLI/API/Web behavior whenever reachable.
- Root-cause debugging and no-workaround rules apply to every failure.

Key decisions:

- Session slug: `release-qa-tests`.
- Continue from prior release-QA awareness by opening a fresh wave-3 scenario instead of mutating prior wave folders.
- Resolve skill-relative scripts/assets from `.agents/skills/...` rather than assuming repo-root helpers.
- Keep an isolated runtime (`AGH_HOME`, HTTP port, UDS path, workspace path) for this QA wave.

State:

- Baseline gate passed in a fresh isolated scenario lab.
- Live daemon and web dev server are running for deeper CLI/API/Web scenario execution.
- High-risk scenario execution is in progress; no repo code changes from this session yet.

Done:

- Read required skills: `real-scenario-qa`, `qa-report`, `qa-execution`, `systematic-debugging`, `no-workarounds`, `browser-use:browser`.
- Read `internal/CLAUDE.md` and `web/CLAUDE.md`.
- Scanned `.codex/ledger/` and read relevant prior ledgers for cross-agent awareness:
  - `2026-04-27-MEMORY-release-qa.md`
  - `2026-04-27-MEMORY-codex-loop-global.md`
  - `2026-04-25-MEMORY-release-startup-qa.md`
  - `2026-04-25-MEMORY-network-tasks-qa.md`
- Confirmed skill-relative QA assets exist under:
  - `.agents/skills/real-scenario-qa/{scripts,references,assets}`
  - `.agents/skills/qa-report/{references,assets}`
  - `.agents/skills/qa-execution/{scripts,references,assets}`
- Confirmed repository contract candidates via `python3 .agents/skills/qa-execution/scripts/discover-project-contract.py --root .`:
  - verify: `make verify`
  - install: `make deps`
  - build: `make build`
  - test: `make test`
  - web UI detected
- Observed dirty worktree before starting this session; must not revert or disturb unrelated edits.
- Initialized fresh scenario workspace with `.agents/skills/real-scenario-qa/scripts/init-scenario-workspace.sh "release-qa-tests"`:
  - `WORKSPACE_PATH=/Users/pedronauck/dev/ai/agh-release-qa-tests-lab`
  - `QA_OUTPUT_PATH=/Users/pedronauck/dev/ai/agh-release-qa-tests-lab/qa-artifacts`
- Authored fresh QA artifacts in the scenario lab:
  - test plan: `qa/test-plans/release-qa-tests-test-plan.md`
  - cases: `TC-INT-301` through `TC-REG-306`
- Ran fresh baseline:
  - `make deps` passed
  - `make verify` passed
  - evidence log: `/Users/pedronauck/dev/ai/agh-release-qa-tests-lab/qa-artifacts/qa/logs/baseline-make-verify.log`
- Created isolated provider home at `/Users/pedronauck/dev/ai/agh-release-qa-tests-lab/.codex-provider-home` and installed AGH provider config into isolated `AGH_HOME=/Users/pedronauck/dev/ai/agh-release-qa-tests-lab/.agh-home`.
- Applied isolated runtime config sequentially after discovering that parallel `agh config set` calls raced on the same config file:
  - socket `/tmp/agh-release-qa-tests.sock`
  - HTTP `127.0.0.1:2255`
  - network enabled, default channel `launch-control`, port `64910`
  - memory disabled
- Started live daemon in foreground session `17836` with log `/Users/pedronauck/dev/ai/agh-release-qa-tests-lab/qa-artifacts/qa/logs/daemon-start.log`.
- Started live web dev server in foreground session `57933` with log `/Users/pedronauck/dev/ai/agh-release-qa-tests-lab/qa-artifacts/qa/logs/web-dev.log`.
- Verified daemon status and HTTP health:
  - runtime status running on socket `/tmp/agh-release-qa-tests.sock`, HTTP `127.0.0.1:2255`
  - observe health reports `memory.enabled=false`, `automation.enabled=true`
- Registered scenario workspace:
  - workspace id `ws_431c4c4efb0615c1`
  - name `release-qa-tests`
  - default agent `founder`
- Authored workspace scenario fixtures under `/Users/pedronauck/dev/ai/agh-release-qa-tests-lab`:
  - `.agh/config.toml` with workspace hooks
  - `.agh/bin/capture-hook.sh`
  - agents: `founder`, `cto`, `backend`, `review`, `ops`, `qa`
  - skill: `launch-ritual`
  - additional-dir agent: `additional-context/.agh/agents/security/AGENT.md`
  - local resource extension: `extensions/wave3-resource-pack`
- Corrected two fixture bugs discovered during setup:
  - `launch-ritual` hook used `mode: sync` for async-only `automation.trigger.post_fire`; changed to `mode: async`
  - initial `capture-hook.sh` consumed stdin by feeding Python from stdin; changed to `python3 -c` so hook payload is captured correctly
- Verified workspace projection before and after extension/additional-dir mutations:
  - base workspace agents include `backend`, `cto`, `founder`, `general`, `ops`, `qa`, `review`
  - workspace skills include `launch-ritual`
  - workspace hooks include `workspace-session-post-create`, `workspace-task-run-enqueued`, and native hooks
  - installed extension `wave3-resource-pack` adds `wave3-extension-agent`, `wave3-extension-skill`, and `wave3-extension-session-post-create`
  - added additional dir exposes `security` agent
- Created real provider-backed sessions:
  - founder `sess-71bac72efb52421b`
  - ops `sess-fc76fdbb8b27b288`
  - extension agent `sess-21451660a8a1673d`
  - launch-squad collaboration sessions: `cto=sess-bd5632a9d129b71c`, `backend=sess-f69bff213d8faf53`, `review=sess-2719af6ad0a524c8`
- Confirmed real prompt side effects:
  - `company/launch-brief.md`
  - `product/release-backlog.md`
  - `ops/release-checklist.md`
  - `ops/rollback-plan.md`
- Verified hook evidence files:
  - workspace session hook: `ops/hook-session-post-create.ndjson`
  - extension session hook: `ops/hook-extension-session-post-create.ndjson`
  - task hook target prepared: `ops/hook-task-run-enqueued.ndjson`
  - trigger hook target prepared: `ops/hook-trigger-post-fire.ndjson`
- Verified network runtime state:
  - channels include `launch-control`, `launch-squad`, `leadership`, `operations`
  - peers include founder/ops/cto/backend/review plus `wave3-extension-agent`
- Confirmed `agh session prompt -o jsonl` is invalid CLI usage; only streaming commands support `jsonl`.

Now:

- Exercise network message flows on the live `launch-squad` channel, including valid and intentionally invalid envelopes.
- Build task/job/trigger execution scenarios and verify hook evidence.
- Bring the running web UI into the loop with browser-use for parity checks against the live daemon.

Next:

- Compute a canonical capability digest exactly before sending a valid capability message.
- Execute task tree and automation flows, then validate restart/churn scenarios.
- Apply root-cause fixes plus regression coverage if any scenario exposes product defects.

Open questions (UNCONFIRMED if needed):

- Need exact normalization details from `internal/config/capabilities.go` before sending a valid `network capability` message.

Working set (files/ids/commands):

- Ledger: `.codex/ledger/2026-04-27-MEMORY-release-qa-tests.md`
- Prior awareness ledger: `.codex/ledger/2026-04-27-MEMORY-release-qa.md`
- Scenario script: `.agents/skills/real-scenario-qa/scripts/init-scenario-workspace.sh`
- Scenario references:
  - `.agents/skills/real-scenario-qa/references/scenario-matrix.md`
  - `.agents/skills/real-scenario-qa/references/evidence-checklist.md`
- QA discovery script: `.agents/skills/qa-execution/scripts/discover-project-contract.py`
- Current contract command: `make verify`
- Scenario lab:
  - `/Users/pedronauck/dev/ai/agh-release-qa-tests-lab`
  - `AGH_HOME=/Users/pedronauck/dev/ai/agh-release-qa-tests-lab/.agh-home`
  - isolated provider `HOME=/Users/pedronauck/dev/ai/agh-release-qa-tests-lab/.codex-provider-home`
- Live sessions:
  - daemon exec session `17836`
  - web exec session `57933`
- Live workspace ids:
  - workspace `ws_431c4c4efb0615c1`
  - founder `sess-71bac72efb52421b`
  - ops `sess-fc76fdbb8b27b288`
  - extension `sess-21451660a8a1673d`
  - cto `sess-bd5632a9d129b71c`
  - backend `sess-f69bff213d8faf53`
  - review `sess-2719af6ad0a524c8`
- Existing dirty files include `internal/api/core/*`, `internal/cli/*`, `internal/daemon/*`, `internal/workspace/*`, `packages/site/content/runtime/cli-reference/*`, `web/src/generated/agh-openapi.d.ts`, and `docs/ideas/complex-scenarios/`.
