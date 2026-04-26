---
name: real-scenario-qa
description: Runs production-like release and feature QA by building a realistic startup workspace, exercising mandatory CLI and Web flows through browser-use:browser with agent-browser as fallback when unavailable, creating agents/channels/tasks/automations/hooks/extensions/skills, documenting bugs, fixing root causes, and rerunning gates. Use when validating AGH release candidates or complex integration features through real scenarios. Do not use for static planning, mock-only tests, simple unit-test edits, or architecture brainstorming without execution.
trigger: explicit
argument-hint: "[scope-or-context]"
---

# Real Scenario QA

Execute release-grade QA by simulating a real startup operating on AGH. Validate the product through public surfaces, realistic workspaces, real agent sessions, real persisted data, mandatory CLI and Web browser flows, API flows when exposed, automations, tasks, networks, knowledge, hooks, extensions, and final verification gates.

## Required Inputs

- **scope-or-context** (optional): Short description of the release, branch, feature, or focus area under test. Examples: `release-candidate`, `autonomy-feature`, `network-tasks`, `cron-triggers-knowledge`. Use it to name the scenario, prioritize flows, and explain why specific surfaces were stressed.

## Procedures

**Step 1: Resolve Scope and Initialize Artifacts**

1. Parse the optional `scope-or-context`. When omitted, use `release-candidate`.
2. Execute `scripts/init-scenario-workspace.sh "<scope-or-context>"` to create a realistic workspace and QA artifact structure.
3. Read the script output and record:
   - `SCENARIO_SLUG`
   - `WORKSPACE_PATH`
   - `QA_OUTPUT_PATH`
4. Store all QA artifacts under `<QA_OUTPUT_PATH>/qa/`.
5. If the repository has a stricter artifact convention, keep the generated workspace but mirror the final report into the repository convention.

**Step 2: Activate Companion QA and Debugging Skills**

1. Use `qa-report` when planning test cases or documenting issues.
2. Use `qa-execution` when running gates, starting services, exercising CLI/API/Web flows, and writing the verification report.
3. Use `systematic-debugging` and `no-workarounds` for every unexpected behavior, failed test, flaky runtime, memory spike, bad UX, or integration issue.
4. Use `browser-use:browser` as the primary Web validation path when the Browser plugin is available. Read and follow that skill before any browser interaction. Use the in-app browser against the local Web app and capture DOM snapshot, screenshot, URL, and visible-state evidence for the tested flows.
5. Treat CLI validation and Web validation as separate mandatory release gates. A CLI-only, API-only, or unit-only pass is not enough to claim readiness when the Web app exists.
6. If `browser-use:browser` is unavailable after following its setup procedure, read and follow `agent-browser`, then use it as the approved fallback. Record the failed browser-use prerequisite, the agent-browser commands used, and the resulting URL/snapshot/screenshot evidence.
7. If both `browser-use:browser` and `agent-browser` are unavailable or blocked, record the browser blocker explicitly in the final report. Do not silently replace browser automation with shell-only, API-only, or fake Web checks.
8. Do not treat mocks, stubs, fake agent replies, or unit-only tests as final proof. Final proof must include real integration or end-to-end behavior whenever the surface is reachable.

**Step 3: Discover the Product Contract**

1. Read root agent instructions, build files, web instructions, and relevant package docs before running scenarios.
2. Identify the canonical verification gate, startup commands, daemon/API URLs, CLI commands, Web UI entry points, and persistence locations.
3. Run the broadest repository-defined baseline gate before scenario testing.
4. Record baseline command, timestamp, exit code, and output summary in `<QA_OUTPUT_PATH>/qa/verification-report.md`.
5. If baseline fails, root-cause and fix only when the failure is relevant or blocks realistic scenario execution. Otherwise document it as a pre-existing blocker with evidence.

**Step 4: Build a Realistic Startup Scenario**

1. Read `references/scenario-matrix.md` and select the scenario tracks that match `scope-or-context`.
2. Create a startup-like workspace under `WORKSPACE_PATH` with real directories for company, product, marketing, finance, operations, reviews, and QA artifacts.
3. Configure multiple realistic agents, such as CEO, CTO, backend, frontend, marketing, copy, finance, review, QA, and operator agents.
4. Create channels that represent company areas, such as leadership, development, marketing, finance, operations, review, and launch coordination.
5. Add realistic custom skills, hooks, extensions, automations, cron jobs, webhook triggers, knowledge/memory entries, and tasks/subtasks when those surfaces exist.
6. Make the scenario produce real artifacts, such as strategy notes, campaign copy, frontend pages, backend service stubs that actually run, review notes, task evidence, automation outputs, and launch reports.

**Step 5: Execute Real CLI, API, and Web Flows**

1. Drive all setup and operations through public CLI, HTTP/API, Web UI, or documented daemon interfaces.
2. Exercise the changed feature first, then exercise cross-system integrations that could regress.
3. Execute at least one complete CLI workflow for each selected scenario track, using real commands and persisted state.
4. Execute at least one matching Web workflow through `browser-use:browser` for each operator-facing selected scenario track, using the same or directly related persisted state created by the CLI/runtime flow. If browser-use is unavailable, execute the same Web workflow through `agent-browser`.
5. Compare CLI/API/runtime state against Web rendering for at least one core workflow. The same task, automation run, channel, knowledge entry, hook result, or extension state must be visible and correct across surfaces when the product exposes it.
6. For network scenarios, require multiple agents to join channels, exchange messages, reply, hand off work, and coordinate around tasks.
7. For task scenarios, create root tasks, subtasks, dependencies, runs, claims, starts, completions, failures, retries, and task-linked sessions.
8. For automation scenarios, validate manual runs, scheduled cron/every jobs, webhook triggers, run history, retry/fire-limit behavior, and resulting artifacts.
9. For knowledge scenarios, write, search, list, open, and use knowledge entries from real workspace state.
10. For Web scenarios, validate default states, navigation, detail pages, filters/toggles, real data rendering, error states, and stale or historical data presentation in the browser, not only through API responses.
11. Read `references/evidence-checklist.md` before marking a scenario complete.

**Step 6: Diagnose, File, Fix, and Re-Verify Issues**

1. Reproduce every issue with the narrowest real command or Web flow before editing code.
2. Write an issue under `<QA_OUTPUT_PATH>/qa/issues/BUG-<num>.md` using `assets/scenario-issue-template.md`.
3. Fix the production code, configuration, or runtime contract at the root cause. Do not patch symptoms or weaken tests.
4. Add focused regression coverage for the bug at the correct layer.
5. Re-run the narrow reproduction, impacted scenario, and relevant package tests.
6. Continue the realistic scenario after the fix; do not stop at the first green unit test.

**Step 7: Validate Final Release Readiness**

1. Re-run the full canonical verification gate from scratch after the last code change.
2. Re-run the highest-risk realistic scenario flows against the current build.
3. Re-run both the CLI and Web browser versions of the highest-risk workflow after the last code change.
4. Confirm no active sessions, stuck runs, unhealthy memory state, scheduler failures, or runaway persisted data remain unless the scenario intentionally leaves them running.
5. Write the final report using `assets/final-report-template.md`.
6. Include pass/fail status for every selected scenario track from `references/scenario-matrix.md`.
7. Include all blocked validations with exact environment or tool failure details, including browser-use setup failures and any `agent-browser` fallback usage or failure.
8. Do not claim release readiness unless the full gate, the CLI evidence, and the browser-based Web evidence are fresh for the current state.

## Error Handling

- If `scripts/init-scenario-workspace.sh` fails, inspect stderr, create the missing parent directory or choose a writable workspace root, and rerun it.
- If a required CLI/API/Web surface does not exist, record that as out-of-scope only after proving the repository has no supported public entry point for it.
- If `browser-use:browser` cannot access the app, diagnose setup, local URL, auth, and service health first. If browser-use is unavailable after that procedure, use `agent-browser` with `open`, `snapshot -i`, interaction commands, `get url`, and screenshots as the Web fallback. If `agent-browser` also fails, keep testing via CLI/API/runtime surfaces and document both browser limitations in the final report.
- If a live integration lacks credentials, validate every local boundary up to the credential boundary and record the exact missing prerequisite.
- If scenario data grows unexpectedly in memory or disk, stop new load generation, inspect persistence growth, root-cause the largest writer, and fix before continuing.
- If the system produces excessive noisy operational history, distinguish protocol/audit data from operator-facing history and validate both read-side cleanup and write-side prevention.
