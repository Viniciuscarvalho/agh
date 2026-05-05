Goal (incl. success criteria):

- Preserve the highest-value memory from the `../_worktrees/ext-refac` ledgers inside the current `pn/ext` branch without copying low-signal task noise.
- Success means this branch keeps the important Daytona and `ext-parity` QA context needed to explain the imported fixes and future debugging.

Constraints/Assumptions:

- Source ledgers were read-only in `../_worktrees/ext-refac/.codex/ledger/`.
- Prefer distilled memory over bulk duplication; avoid importing transient execution noise, generated QA artifact paths, or task-tracker churn unless it changes engineering decisions.
- Current branch already contains the Daytona runtime/test port commit `8086aeb6`.

Key decisions:

- Do not mirror every worktree ledger file into this branch.
- Import only the cross-branch context that materially affects future work:
  - Daytona provider/launcher architecture and validation status
  - `ext-parity` QA regressions and root-cause fixes
- Treat task-specific workflow ledgers for sandbox tasks 01/02/04/07/08 and generic cutover tasks as low-value here because they mostly point back to task tracking files rather than branch-relevant operational knowledge.

State:

- completed

Done:

- Inspected `../_worktrees/ext-refac/.codex/ledger/`; the worktree uses `.codex/ledger`, not `.codex/ledgers`.
- Reviewed the highest-signal relevant ledgers:
  - `2026-04-16-MEMORY-daytona-provider.md`
  - `2026-04-16-MEMORY-daytona-ssh-validation.md`
  - `2026-04-16-MEMORY-daytona-qa-pass.md`
  - `2026-04-16-MEMORY-ext-parity-qa.md`

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-16-MEMORY-imported-ext-refac-context.md`
- `../_worktrees/ext-refac/.codex/ledger/2026-04-16-MEMORY-daytona-provider.md`
- `../_worktrees/ext-refac/.codex/ledger/2026-04-16-MEMORY-daytona-ssh-validation.md`
- `../_worktrees/ext-refac/.codex/ledger/2026-04-16-MEMORY-daytona-qa-pass.md`
- `../_worktrees/ext-refac/.codex/ledger/2026-04-16-MEMORY-ext-parity-qa.md`

Imported memory:

- Daytona provider/task context:
  - The original provider implementation ledger recorded that the package and test scaffolding were in place, but live Daytona E2E was blocked until credentials were available.
  - The SSH validation ledger established the intended non-PTY probe shape, documented the REST-based SSH access flow, and made explicit that missing `DAYTONA_API_KEY` must remain a stated verification limitation rather than a hidden skip.
  - This matters because the current branch now contains the later ported fix set, and future work should understand that the initial blocker was not "feature incomplete" but "live credential gate absent".

- Daytona live QA conclusions from `ext-refac`:
  - Raw SSH transport preserved payload integrity but missed the latency gate and did not satisfy the launcher contract reliably enough.
  - Daytona `process/session` APIs were probed and rejected as the launcher path because they did not provide the stdin-EOF / log-stream behavior AGH's ACP launcher contract expects.
  - The chosen root-cause fix was to split transports:
    - keep SSH for sync and tool-host terminal operations
    - move only the ACP launcher path onto a dedicated sidecar transport running inside the sandbox
  - Additional root-cause fixes captured by live QA:
    - sync-to-runtime no longer depends on SSH EOF to finish untar
    - `ssh.ExitMissingError` is normalized for the relevant SSH session waits
    - tar extraction ignores the root `"."` marker
    - the SSH validation harness uses thread-safe stderr capture and a long-lived session to avoid racey false signals
  - Final live validation in that worktree reported:
    - `go test ./internal/environment/daytona/...`: PASS
    - `golangci-lint run ./internal/environment/daytona/...`: PASS
    - `DAYTONA_IMAGE=ubuntu:24.04 go test -tags integration ./internal/environment/daytona -run 'TestDaytona(LauncherTransportValidation|ProviderIntegrationFullLifecycle)' -count=1 -v`: PASS
    - `DAYTONA_IMAGE=ubuntu:24.04 make test-integration`: PASS
    - `make verify`: PASS
  - Operational takeaway: if Daytona regresses again, the first question is whether the sidecar launcher path is still active and healthy, not whether the raw SSH path can be made "good enough".

- `ext-parity` QA conclusions from `ext-refac`:
  - The QA pass found and fixed several repository-side regressions at root cause, not by weakening the tests.
  - High-value remembered fixes:
    - integration harnesses needed a real environment registry (`WithEnvironmentRegistry(...)`) in HTTP/UDS/CLI/network/extension tests
    - Discord bridge startup retries needed correct `*subprocess.RPCError` detection
    - GChat bridge launch parity required the `AGH_BRIDGE_GCHAT_TOKEN_URL` env contract and env-based certificate override paths
    - GitHub multi-instance parity required shared webhook-path support while still enforcing duplicate repository ownership rejection
    - daemon marker parsing had to ignore literal helper `shutdown` lines
    - hook-binding resource persistence had to retain internal execution fields (`WorkingDir`, `PrioritySet`, `SkillSource`)
    - Telegram restart coverage had to assert contract-level resume behavior instead of flaky process-marker assumptions
  - Final `ext-parity` QA evidence in that worktree reported:
    - `make verify`: PASS
    - `make test-integration`: PASS
    - `cd sdk/typescript && bun run test`: PASS
    - isolated daemon/web public-interface QA against `/tmp/agh-ext-parity-qa-home`: PASS
  - Operational takeaway: if this branch later sees bridge/runtime parity regressions, start by checking environment-registry injection, bridge provider env contracts, and hook-binding persistence before suspecting the QA harness itself.
