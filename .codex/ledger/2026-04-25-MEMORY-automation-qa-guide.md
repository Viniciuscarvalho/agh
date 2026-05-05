Goal (incl. success criteria):

- Inspect AGH codebase and docs for automation scheduling and triggers only.
- Deliver a concise operator guide for release QA covering: creating a real cron-based job, supported schedule formats, webhook/event triggering, how runs appear in CLI/API/web, and the highest-value edge cases to stress.
- No code changes.

Constraints/Assumptions:

- Scope is limited to automations and triggers; exclude unrelated runtime surfaces unless they directly explain operator behavior.
- Cite concrete file paths and command examples from the repo.
- Do not modify product code or docs.
- Do not run destructive git commands.

Key decisions:

- Use code, tests, OpenAPI, CLI reference docs, and site docs as primary sources; prefer concrete implementation files over planning docs unless needed for context.
- Focus the guide on release-QA operator actions, not implementation history.

State:

- In progress; evidence collected.

Done:

- Read root instructions plus architectural-analysis and documentation-writer skill guidance.
- Scanned `.codex/ledger/` for cross-agent awareness and read relevant automation scheduler/task ledgers.
- Isolated the automation surface across `internal/automation`, `internal/config`, `internal/api`, `internal/cli`, `web/src/systems/automation`, `packages/site/content/runtime/{core,cli-reference}/automation`, and `openapi/agh.json`.
- Confirmed schedule modes and validation: `cron` (five-field only, no seconds), `every` (positive Go duration), `at` (RFC3339 in API/config; CLI also normalizes local `YYYY-MM-DDTHH:MM[:SS]` to UTC).
- Confirmed scheduler behavior: durable cursor advances before dispatch, boot catch-up policy is `skip_missed`, one-shot past `at` jobs are skipped, delivery errors are recorded without rolling back the cursor.
- Confirmed trigger behavior: built-in event families include `session.created`, `session.stopped`, `memory.consolidated`, `hook.<name>.completed`, `webhook`, and `ext.*`; filters are exact-match only on `kind`, `scope`, `workspace_id`, `source`, and `data.<field>`.
- Confirmed webhook ingress: HTTP-only routes under `/api/webhooks/global/:endpoint` and `/api/webhooks/workspaces/:workspace_id/:endpoint`; required headers are timestamp, signature, and delivery ID; freshness window is 5 minutes; replay delivery IDs are rejected within that window.
- Confirmed operator surfaces:
  - CLI `agh automation jobs|triggers|runs ...`, including manual `jobs trigger`.
  - HTTP/UDS automation management under `/api/automation/...`.
  - Web pages at `/jobs`, `/triggers`, and settings summary at `/settings/automation`.
- Confirmed run visibility fields: API/CLI/web surface run `status`, `attempt`, `session_id`, `fire_id`, `scheduled_at`, `error`, and `delivery_error`; web job detail also shows scheduler cursor data.

Now:

- Drafting the concise operator guide with file citations and QA edge cases.

Next:

- Send the guide.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `internal/automation/*`
- `internal/config/automation.go`
- `internal/api/contract/automation.go`
- `internal/api/core/automation.go`
- `internal/cli/automation.go`
- `packages/site/content/runtime/core/automation/*.mdx`
- `packages/site/content/runtime/cli-reference/automation/**/*.mdx`
- `openapi/agh.json`
- Commands: `rg`, `sed`, `nl -ba`, `find`
