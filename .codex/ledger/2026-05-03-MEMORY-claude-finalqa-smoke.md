# Goal (incl. success criteria):

- Validate, in a fresh isolated AGH lab, whether native Claude Code ACP auth now allows a real Claude-backed AGH session/prompt flow that is strong enough to unblock a later `.compozy/tasks/final-qa` live-agent lane.
- Success means: fresh bootstrap manifest, isolated provider home, daemon started on isolated ports, `claude` provider auth status consistent with native auth, one real AGH session created with provider `claude`, one real prompt completed or a precise blocker captured with evidence.

# Constraints/Assumptions:

- No destructive git commands.
- Conversation in Brazilian Portuguese; artifacts in English when persisted.
- Use isolated QA bootstrap/home, never raw global `~/.codex` as runtime state.
- Prior final-qa/native-auth artifacts are historical input only; this turn must produce fresh evidence.
- This is a quick validation, not a full 283-scenario final QA pass.

# Key decisions:

- Scope the smoke to the Claude native-auth path only.
- Reuse prior ledgers for awareness, but create a fresh isolated lab for this independent pass.
- Treat success as real AGH session/prompt behavior, not only `provider auth status`.

# State:

- Session started on 2026-05-03 for a quick isolated Claude/final-qa smoke.

# Done:

- Read root AGENTS/CLAUDE instructions relevant to QA isolation and ledgers.
- Read required skills: `agh-qa-bootstrap`, `real-scenario-qa`, `qa-report`, `qa-execution`, `agh-worktree-isolation`.
- Scanned related ledgers: `native-acp-auth` and `final-qa`.
- Read `.compozy/tasks/final-qa` master docs and ACP child plan.
- Bootstrapped a fresh isolated lab:
  - `SCENARIO_SLUG=claude-finalqa-smoke-20260504-023728-898221`
  - `WORKSPACE_PATH=/Users/pedronauck/dev/qa-labs/agh-claude-finalqa-smoke-20260504-023728-898221-lab`
  - `QA_OUTPUT_PATH=/Users/pedronauck/dev/qa-labs/agh-claude-finalqa-smoke-20260504-023728-898221-lab/qa-artifacts`
  - `AGH_HOME=/var/folders/7x/xg204hnd04b81fczcxvjlhzr0000gn/T/aghqa-da40324129a4/runtime`
  - `AGH_HTTP_PORT=61546`
  - `PROVIDER_HOME=/var/folders/7x/xg204hnd04b81fczcxvjlhzr0000gn/T/aghqa-da40324129a4/provider`
  - `PROVIDER_CODEX_HOME=/var/folders/7x/xg204hnd04b81fczcxvjlhzr0000gn/T/aghqa-da40324129a4/provider/.codex`
- Confirmed the isolated provider home initially had Codex state but no authenticated Claude CLI state:
  - `go run ./cmd/agh provider auth status claude --no-probe -o json` resolved `native_cli`, `filtered`, `operator`.
  - `HOME="$PROVIDER_HOME" claude auth status` returned `loggedIn=false`.
- Installed default AGH agent `general` with provider `claude`.
- Started the isolated daemon and confirmed it served on `127.0.0.1:61546` with `user_home_dir=$PROVIDER_HOME`.
- Created a real AGH session successfully:
  - `session_id=sess-92d29386682fcba0`
  - `acp_session_id=23530852-22a5-42f0-9a10-76b0625b30ec`
  - Claude ACP capabilities were returned, including `supports_load_session=true`.
- Real prompt execution failed:
  - `agh session prompt ... -o jsonl` returned typed error `{"code":-32000,"message":"Authentication required"}`
  - Crash bundle: `/var/folders/7x/xg204hnd04b81fczcxvjlhzr0000gn/T/aghqa-da40324129a4/runtime/logs/crash-bundles/sess-92d29386682fcba0-prompt_failure-1777862385151576000.json`
- Confirmed AGH currently lacks a builtin Claude native login bridge:
  - `agh provider auth login claude` returns `provider "claude" does not define auth_login_command`.
- Replaced the generated isolated `.claude.json` with the operator `.claude.json`; `HOME="$PROVIDER_HOME" claude auth status` still stayed `loggedIn=false`, so that file alone is insufficient to stage isolated auth.
- Wrote QA report:
  - `/Users/pedronauck/dev/qa-labs/agh-claude-finalqa-smoke-20260504-023728-898221-lab/qa-artifacts/qa/verification-report.md`
- Stopped the session and daemon after capture.
- User clarified the desired product behavior: AGH should use the Claude installation/login state already present on the user's machine, not a separate isolated provider home, for the normal runtime path.
- Re-ran a second smoke in the intended operator-home mode:
  - `AGH_HOME=/tmp/agh-operator-home-smoke.hl7S38`
  - Preserved `HOME=/Users/pedronauck`
  - `claude auth status` was `loggedIn=true` before the run.
- Operator-home smoke results:
  - `agh install --provider claude --model claude-sonnet-4-6` succeeded.
  - `agh daemon status -o json` showed `user_home_dir=/Users/pedronauck`.
  - `agh session new --agent general --cwd /tmp/agh-operator-home-smoke.hl7S38-workspace -o json` succeeded with live ACP session `f2f46248-6ef4-4935-b530-bf63f620ac2e`.
  - `agh session prompt ... -o jsonl` succeeded end-to-end, including real Claude tool calls (`Bash`, `Write`), and created `/tmp/agh-operator-home-smoke.hl7S38-workspace/company/planning/operator-home-smoke.md`.
  - The created file contains:
    - `- AGH used the operator's installed Claude session.`
    - `- This validates the non-isolated provider-home path.`
- Conclusion refined:
  - The prior failure is specific to the hermetic QA lane that rewrites `HOME` to an isolated provider home.
  - The normal product path using the operator's installed Claude/login state works.
- Traced the source of the wrong assumption:
  - Root rules previously said provider-home isolation was mandatory for all local QA in `AGENTS.md` and `CLAUDE.md`.
  - QA skills (`agh-qa-bootstrap`, `qa-execution`, `real-scenario-qa`) instructed provider-backed commands to run with `HOME="$PROVIDER_HOME"` / `CODEX_HOME="$PROVIDER_CODEX_HOME"`.
  - `.compozy/tasks/final-qa/_master-qa-plan.md` and multiple child plans repeated that all real-LLM lanes should stage auth into `PROVIDER_HOME`.
- Confirmed runtime/product behavior is different:
  - `internal/config/provider.go` defaults provider `home_policy` to `operator`.
  - `internal/providerenv/env.go` rewrites `HOME` only when `home_policy=isolated`.
  - `internal/session/provider_runtime.go` applies provider-home rewriting only for isolated-home providers.
- Confirmed one harness to audit later:
  - `internal/testutil/e2e/runtime_harness.go` currently seeds `HOME=homePaths.HomeDir` by default for harness launches; this is test harness behavior to review when adding more automated native-provider QA.
- Updated docs/rules/memory:
  - `AGENTS.md`, `CLAUDE.md`
  - `docs/_memory/standing_directives.md`
  - `.agents/skills/agh-qa-bootstrap/SKILL.md`
  - `.agents/skills/agh-qa-bootstrap/references/bootstrap-contract.md`
  - `.agents/skills/qa-execution/SKILL.md`
  - `.agents/skills/real-scenario-qa/SKILL.md`
  - `.compozy/tasks/final-qa/_master-qa-plan.md`
  - final-qa child plans for config, ACP, autonomy, memory, skills, tools, extensions, cron, network, API, web, docs, observability
  - new lesson: `docs/_memory/lessons/L-016-native-provider-qa-home-policy.md`

# Now:

- Summarize the source distinction between QA guidance and runtime behavior.

# Next:

- Review whether `internal/testutil/e2e/runtime_harness.go` needs a first-class native-provider operator-home mode for automated QA.

# Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: which exact Claude-native auth artifacts beyond `.claude.json` are required to make `HOME="$PROVIDER_HOME" claude auth status` return `loggedIn=true`.
- UNCONFIRMED: whether the right product fix is a builtin `auth_login_command` for `claude`, a bootstrap staging helper, or a documented manual step using Claude's own auth tooling.
- UNCONFIRMED: whether `internal/testutil/e2e/runtime_harness.go` should preserve caller `HOME` by default for native-provider lanes or expose an explicit switch.

# Working set (files/ids/commands):

- `.codex/ledger/2026-05-03-MEMORY-claude-finalqa-smoke.md`
- `.codex/ledger/2026-05-03-MEMORY-native-acp-auth.md`
- `.codex/ledger/2026-05-03-MEMORY-final-qa.md`
- `.compozy/tasks/final-qa/README.md`
- `.compozy/tasks/final-qa/_master-qa-plan.md`
- `.compozy/tasks/final-qa/_children/03-acp-sessions.md`
- `.codex/native-acp-auth/qa/verification-report.md`
- `.agents/skills/agh-qa-bootstrap/scripts/bootstrap-qa-env.py`
- `/Users/pedronauck/dev/qa-labs/agh-claude-finalqa-smoke-20260504-023728-898221-lab/qa-artifacts/qa/bootstrap-manifest.json`
- `/Users/pedronauck/dev/qa-labs/agh-claude-finalqa-smoke-20260504-023728-898221-lab/qa-artifacts/qa/verification-report.md`
- `/tmp/agh-operator-home-smoke.hl7S38`
- `/tmp/agh-operator-home-smoke.hl7S38-workspace/company/planning/operator-home-smoke.md`
