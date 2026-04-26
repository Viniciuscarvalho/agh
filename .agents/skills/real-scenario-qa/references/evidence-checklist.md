# Evidence Checklist

Use this checklist before claiming a realistic scenario is complete.

## Baseline and Environment

- Canonical verification gate was discovered from repository files.
- Baseline gate was run before scenario mutation or runtime stress.
- Scenario workspace path is outside unrelated user work.
- Daemon/API/Web services were started through supported commands.
- Health/readiness checks succeeded before interaction.
- `browser-use:browser` was loaded and used for Web validation when the Browser plugin was available.
- If browser-use was unavailable after setup, `agent-browser` was used as the approved Web fallback.
- Any Web fallback names the failed browser-use prerequisite and includes the exact `agent-browser` commands or captured evidence.

## Realistic Data

- Agents were created or selected from real project configuration.
- Channels represent real company areas or product functions.
- Tasks, subtasks, dependencies, and runs use persisted task APIs or CLI commands.
- Automations, cron jobs, and triggers create real runs and artifacts.
- Knowledge entries are written to the real workspace or configured memory store.
- Hooks and extensions produce real observable side effects when in scope.

## Public Surface Coverage

- CLI commands were exercised for every selected scenario track with a public CLI surface.
- Web UI was exercised through `browser-use:browser` for every selected operator-facing track with a Web surface, or through `agent-browser` only when browser-use was unavailable.
- CLI and Web evidence cover at least one overlapping persisted object, such as the same task, automation run, channel, message, knowledge entry, hook result, or extension state.
- HTTP/API endpoints were exercised for at least one core workflow when the product exposes public API behavior.
- Browser evidence includes the tool used, final URL, and a DOM snapshot or screenshot for each high-risk flow.
- Persistence was inspected through supported APIs or direct DB reads when needed for debugging.
- Logs, health payloads, and generated artifacts were captured as evidence.

## Failure Handling

- Every discovered issue has a reproducible command or browser flow.
- Issues that affect both CLI and Web include reproduction steps for both surfaces.
- Every bug report includes expected behavior, actual behavior, impact, and evidence.
- Fixes target production behavior, not test expectations.
- Regression coverage proves the bug and protects the intended invariant.
- Full verification gate was rerun after the last code change.

## Release Readiness

- No critical bugs remain open.
- No active sessions, stuck task runs, runaway cron jobs, or unhealthy memory state remain unless intentionally left for a soak.
- Operator-facing history is understandable and not dominated by protocol noise.
- Browser-use limitations, `agent-browser` fallback usage or failure, missing credentials, and external blockers are named explicitly.
- Release readiness is not claimed unless both CLI and Web browser gates pass through browser-use or the approved `agent-browser` fallback, or the Web surface is proven out-of-scope.
