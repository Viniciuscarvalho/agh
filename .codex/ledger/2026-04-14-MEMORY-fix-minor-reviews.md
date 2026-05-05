Goal (incl. success criteria):

- Resolve the still-valid minor review findings from the provided list across `web/` and `internal/`.
- Success means: only current, valid findings are fixed; touched tests pass; `make verify` passes; unrelated worktree changes remain untouched.

Constraints/Assumptions:

- Follow root `AGENTS.md`, `CLAUDE.md`, `web/AGENTS.md`, and `web/CLAUDE.md`.
- Required skills loaded for this turn: `systematic-debugging`, `no-workarounds`, `testing-anti-patterns`, `golang-pro`, `react`, `vercel-react-best-practices`, `tanstack-query-best-practices`, `app-renderer-systems`, `vitest`, `typescript-advanced`.
- Verify each comment against current code before changing anything.
- Do not use destructive git commands or modify unrelated dirty files.

Key decisions:

- Treat already-resolved comments as no-ops rather than re-editing those files.
- Leave speculative/non-root-cause suggestions alone unless the current code clearly shows a real defect.
- Batch low-risk alias/interface cleanup together with the related functional fixes in the same files.

State:

- Completed.

Done:

- Read root and `web/` instructions plus relevant prior ledgers for review context.
- Loaded required bug-fix, web, testing, Go, and TypeScript skills.
- Inspected all referenced files from the review list and identified which comments are already fixed versus still valid.
- Fixed the remaining valid automation, bridges, network, workspace, and Go store/API review findings.
- Wrapped async post-mutation assertions in automation/bridge tests where needed and hardened several route tests to avoid full-suite timeouts by replacing expensive per-keystroke/click user events in create flows with direct DOM events.
- Added/updated regression coverage for automation schedule/summary labels, network peer display-name fallback, network create-channel agent assertions, and audit timeline text preservation.
- Verified focused suites:
- `go test ./internal/api/core -run 'TestNetworkConversionHelpersPreserveMetadata|TestBaseHandlersCreateNetworkChannelCreatesSessionsPerAgent'`
- `go test ./internal/network -run TestAuditWriterPersistsTimelineMessagesForSayEnvelopesOnly`
- `go test ./internal/store/globaldb -run 'TestGlobalDBNetworkMessageGuardClauses|TestGlobalDBListNetworkMessagesWrapsTimestampParseFailures'`
- `bun x vitest run web/src/routes/_app/-automation.integration.test.tsx web/src/systems/automation/components/automation-job-form.test.tsx web/src/systems/automation/components/automation-detail-panel.test.tsx web/src/systems/automation/lib/automation-formatters.test.ts`
- `bun x vitest run web/src/routes/_app/-bridges.test.tsx web/src/routes/_app/-network.test.tsx`
- Verified required gates:
- `make web-lint`
- `make web-typecheck`
- `make verify`

Now:

- None.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- The `useTestBridgeDelivery` optimistic-update suggestion remained intentionally untouched because the current UI does not expose a rollback-safe optimistic state for that mutation and inventing one would be a workaround, not a fix.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-14-MEMORY-fix-minor-reviews.md`
- `web/src/routes/_app/-automation.integration.test.tsx`
- `web/src/systems/automation/components/automation-detail-panel.tsx`
- `web/src/systems/automation/components/automation-job-form.tsx`
- `web/src/systems/automation/lib/automation-formatters.ts`
- `web/src/systems/session/components/message-bubble.tsx`
- `web/src/systems/network/hooks/use-network-actions.ts`
- `web/src/systems/network/lib/network-formatters.ts`
- `web/src/systems/bridges/**`
- `internal/api/httpapi/httpapi_integration_test.go`
- `internal/api/core/network.go`
- `internal/api/core/network_test.go`
- `internal/network/audit.go`
- `internal/store/globaldb/global_db_network_messages.go`
