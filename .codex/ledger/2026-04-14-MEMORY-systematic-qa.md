Goal (incl. success criteria):

- Execute a two-phase systematic QA pass for AGH, including canonical verification, daemon startup, and real browser validation of the web app via `agent-browser`.
- Phase 1 covered baseline smoke/regression. Phase 2 must stress the user-requested flows: multiple sessions, stop/resume/restart, multiple workspaces, full sidebar/deep-link/reload paths, network with `network.enabled = true`, and real automation/bridges/network mutation coverage where the runtime supports it.
- Success means: fresh evidence for baseline gates, live daemon/web readiness, exercised critical and robustness workflows, documented blocked steps if any, fixes applied for regressions found during this session, and a reusable QA/E2E playbook captured under `docs/ideas/qa-e2e/`.

Constraints/Assumptions:

- Follow root `AGENTS.md`, `CLAUDE.md`, `web/AGENTS.md`, and `web/CLAUDE.md`.
- Do not touch unrelated worktree changes in `skills-lock.json` and `.agents/skills/systematic-qa/`.
- Required skills for this session: `systematic-qa` and `agent-browser`.
- `scripts/discover-project-contract.py` is absent in this repo; fallback contract discovery must rely on `Makefile`, repo docs, and build files.

Key decisions:

- Use `make verify` as the primary repository gate and `make web-*` commands as explicit web gates where needed.
- Treat missing contract-discovery helper as a repo gap, not a blocker.
- Keep QA artifacts outside source changes unless a real regression fix requires code/test updates.
- Run live daemon/browser validation under a temporary `AGH_HOME` to avoid touching the user's real `~/.agh`.
- Planned QA matrix: baseline `make verify`; isolated daemon bootstrap/start; browser onboarding/workspace registration; internal page navigation for `skills`, `network`, `automation`, and `bridges`; live session creation/prompt only if the configured ACP provider can start locally.
- Treat the real browser `Network` failure under `network.enabled = false` as a product bug: the UI should respect the status endpoint and render a disabled-state experience instead of surfacing downstream 503s from channels/peers endpoints.
- Reopen the QA after the initial fix because the user explicitly requires broader stress coverage before treating the branch as validated.
- Continue using the isolated runtime at `/tmp/codex-qa-agh.21O7YT/.agh` and extend it with extra workspaces plus a network-enabled config instead of switching to the user's real environment.

State:

- Completed. Phase 1 and Phase 2 stress QA executed with fresh verification and browser revalidation.

Done:

- Read required skill instructions for `systematic-qa` and `agent-browser`.
- Read root/web instructions and scanned recent ledgers for web/daemon verification context.
- Checked worktree status and identified unrelated pre-existing changes to avoid.
- Confirmed `Makefile` exposes canonical backend and web verification commands.
- Confirmed contract discovery script referenced by the skill does not exist in this repository.
- Confirmed runtime isolation is possible via `AGH_HOME`.
- Confirmed `OPENAI_API_KEY` is present in the environment, making the bootstrap `codex` provider a plausible live-session candidate.
- Ran `make verify` successfully from the current repo state (web lint/typecheck/test/build, Go lint/test/build, boundaries all passed).
- Bootstrapped a temporary runtime at `/tmp/codex-qa-agh.21O7YT/.agh` with `./bin/agh install` using provider `codex` and model `gpt-4o`.
- Started the daemon from the built binary, registered `/Users/pedronauck/Dev/compozy/agh` as a workspace through the real web onboarding flow, and validated `Skills`, `Automation`, `Bridges`, `Network`, and session pages via `agent-browser`.
- Created a real session from the sidebar and sent a prompt through the web composer; the agent responded and the transcript persisted.
- Reproduced a bug in the real browser: with network disabled by default, the `Network` page rendered raw `Service Unavailable` errors from channels/peers queries.
- Fixed the root cause in the web network system by gating runtime collection queries on `networkStatus.enabled` and rendering an explicit disabled state.
- Added route-test coverage for the disabled-network case and verified:
  - `bun x vitest run web/src/routes/_app/-network.test.tsx`
  - `make web-lint`
  - `make web-typecheck`
  - `make web-test`
  - `make verify`
- Rebuilt the binary, restarted the isolated daemon, and revalidated in the real browser that `Network disabled` replaced the previous `Service Unavailable` output across tabs.
- Stopped the temporary daemon and closed the browser session after validation.
- Re-read the active ledger, scanned neighboring ledgers for session/network/web context, and confirmed the expanded user requirement: smoke coverage is insufficient without real stress/use-case breadth.
- Reopened the execution plan around the user-requested matrix:
  - multiple sessions with prompt/stop/resume/restart validation
  - multiple workspaces, active-workspace switching, refresh/deep-link/sidebar coverage
  - automation, network, and bridges real mutations where supported
  - robustness under reload, reconnect, and daemon restarts
  - network runtime validation with `network.enabled = true`
- Updated the isolated runtime config to enable the embedded network and set a non-default channel baseline:
  - `/tmp/codex-qa-agh.21O7YT/.agh/config.toml` now includes `[network] enabled = true` and `default_channel = "builders"`.
- Added fixture workspaces under `/tmp/codex-qa-agh.21O7YT/workspaces/`:
  - `qa-secondary` with local agent `research-scout`
  - `qa-shared` exposed via `additional_dirs` with agent `shared-planner`
- Added a local bridge extension fixture under `/tmp/codex-qa-agh.21O7YT/extensions/ext-telegram-qa/` implementing a minimal healthy `bridge.adapter` subprocess for real bridge-provider discovery.
- Restarted the isolated daemon and confirmed runtime status:
  - daemon HTTP on `http://localhost:2123`
  - embedded network running on `127.0.0.1:65341`
- Registered the extra workspace and installed the extension via public CLI surfaces:
  - workspace `qa-secondary` => `ws_00eccd3a9d29488f`
  - repo workspace `agh` => `ws_c632de85d511adf4`
  - extension `ext-telegram-qa` => enabled, state `registered`
- Revalidated active-workspace switching in the real browser:
  - `qa-secondary` network channel creation listed agents `general`, `research-scout`, `shared-planner`
  - `agh` listed only `general`
- Created a real network channel `stress-qa` from the browser under `qa-secondary`.
- Verified live network peers in the browser for that channel:
  - `research-scout` LOCAL
  - `shared-planner` LOCAL
- Sent a real network message through the CLI and confirmed live runtime counters plus persisted channel/peer state:
  - message id `msg-57830275eac10c10`
  - `network status` reported active workers and sent/received counters
  - `network channels` showed `stress-qa` with `peer_count=2`
- Created a real bridge from the browser:
  - bridge `qa-support-bridge` => `brg-c8bef1bf60475bc4`
  - workspace scope
- Covered bridge error and success delivery paths via CLI:
  - invalid `direct-send` target returns a validation error
  - valid reply-mode test delivery resolved with peer/thread target metadata
- Created real automation entities via CLI where supported:
  - workspace job `qa-job` => `job-866ef3f8781c1eb7`
  - global job `qa-global-job` => `job-7fb37164fc1ee71c`
  - workspace trigger `qa-trigger` => `trg-7c34111d09823c6c`
- Validated automation error handling by attempting an invalid trigger configuration and receiving the expected endpoint-slug validation failure.
- Triggered the workspace automation job and confirmed a real run completed:
  - run `run-2043071caa511903`
  - spawned session `sess-86feeac42a0208ee`
  - status `completed`
- Completed the stop/resume session flow on `sess-c2910c2d02e478b3` and confirmed the resumed prompt replied with `QA-RESUMED-OK`.
- Restarted the daemon during the stress round and verified persistence behavior:
  - session metadata remained accessible after restart
  - stopped sessions still rendered in the browser sidebar and deep-linked session pages loaded persisted transcripts
  - resuming `sess-c2910c2d02e478b3` after restart succeeded and replied `QA-AFTER-RESTART-OK`
  - resuming channel sessions restored `stress-qa` with 2 local peers in both CLI and browser
- Diagnosed a second real web bug in the Automation editor:
  - browser create flow submitted `POST /api/automation/jobs`
  - HAR capture showed `400 Bad Request`
  - root cause: frontend emitted invalid retry payloads for `strategy = "none"` by preserving `max_retries` and `base_delay`
  - confirmed with direct server response: `job.retry.max_retries must be zero when retry.strategy is "none"`
- Fixed the automation retry normalization in the web layer for both jobs and triggers:
  - drafts now normalize `retry.none` to `max_retries = 0` and `base_delay = ""`
  - retry fields are disabled unless `strategy = "backoff"`
  - submit handlers normalize retry payloads before mutation
- Added regression coverage for the automation retry fix across:
  - draft helper tests
  - job form tests
  - trigger form tests
  - automation route integration tests
- Re-ran focused verification after the automation fix:
  - `bun x vitest run web/src/systems/automation/lib/automation-drafts.test.ts web/src/systems/automation/components/automation-job-form.test.tsx web/src/systems/automation/components/automation-trigger-form.test.tsx web/src/routes/_app/-automation.integration.test.tsx`
  - `make web-typecheck`
- Re-ran full fresh verification with `make verify` successfully after the fix.
- Rebuilt and restarted the isolated daemon from the fresh binary, then revalidated in the real browser that:
  - `Create Job` now closes successfully and persists `qa-browser-job-fixed`
  - `Create Trigger` now closes successfully and persists `qa-browser-trigger-fixed`
  - both persisted with valid `retry = { strategy: "none", max_retries: 0, base_delay: "" }`
- Created the reusable QA/E2E playbook at `docs/ideas/qa-e2e/README.md`, covering:
  - execution profiles
  - suite matrix
  - detailed test cases
  - required assertions
  - edge cases and permanent regressions
  - future automation priorities

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: the bridge fixture remains in `starting` state even though creation and test-delivery paths worked; this may be a limitation of the synthetic adapter fixture rather than a product bug.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-14-MEMORY-systematic-qa.md`
- `docs/ideas/qa-e2e/README.md`
- `AGENTS.md`
- `CLAUDE.md`
- `web/AGENTS.md`
- `web/CLAUDE.md`
- `Makefile`
- `web/src/routes/_app/network.tsx`
- `web/src/routes/_app/-network.test.tsx`
- `web/src/routes/_app/automation.tsx`
- `web/src/routes/_app/-automation.integration.test.tsx`
- `web/src/systems/automation/components/automation-job-form.tsx`
- `web/src/systems/automation/components/automation-job-form.test.tsx`
- `web/src/systems/automation/components/automation-trigger-form.tsx`
- `web/src/systems/automation/components/automation-trigger-form.test.tsx`
- `web/src/systems/automation/lib/automation-drafts.ts`
- `web/src/systems/automation/lib/automation-drafts.test.ts`
- `web/src/systems/automation/index.ts`
- `web/src/systems/network/hooks/use-network.ts`
- `web/src/systems/network/lib/query-options.ts`
- Commands: `git status --short`, `rg`, `sed`, `python3 scripts/discover-project-contract.py --root .`, `make verify`, `make web-lint`, `make web-typecheck`, `make web-test`, `bun x vitest run web/src/routes/_app/-network.test.tsx`, `bun x vitest run web/src/systems/automation/lib/automation-drafts.test.ts web/src/systems/automation/components/automation-job-form.test.tsx web/src/systems/automation/components/automation-trigger-form.test.tsx web/src/routes/_app/-automation.integration.test.tsx`, `./bin/agh install`, `./bin/agh daemon start`, `./bin/agh daemon stop`, `./bin/agh daemon status`, `./bin/agh session --help`, `./bin/agh workspace --help`, `./bin/agh automation --help`, `agent-browser ...`
