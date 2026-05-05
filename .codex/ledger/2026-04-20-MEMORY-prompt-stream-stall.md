Goal (incl. success criteria):

- Fix the AGH session prompt stream stall that occurs on the first tool call in a new session.
- Success means: prompt execution survives client disconnects until explicit cancel or terminal completion, HTTP tool SSE framing is AI SDK-compatible, the web stop action cancels explicitly, the startup-status repair race is fixed, regression tests are added, and `make verify` passes.

Constraints/Assumptions:

- Keep changes scoped to prompt/session/http/uds/web session-chat paths; avoid unrelated dirty worktree changes.
- Do not use destructive git commands.
- Fix root causes only; no retries, sleeps, or client-side workaround behavior.
- Preserve existing UDS-native streaming shape unless a matching behavior change is needed for prompt lifetime/cancel semantics.

Key decisions:

- Add explicit prompt cancellation instead of relying on request abort semantics.
- Detach prompt execution from HTTP/UDS request lifetime using `context.WithoutCancel(...)`, while keeping the stream writer loop request-bound.
- Make the HTTP prompt stream AI SDK v6-compliant for tool parts by emitting `tool-input-available` with normalized tool input.
- Treat `m.pending` sessions as still starting so inactive-meta repair does not classify healthy startups as crashed.

State:

- Completed.

Done:

- Investigated the repro using `~/.agh` logs and session event stores.
- Confirmed the prompt request closes at the first `tool_call` and no terminal event is persisted for the turn.
- Mapped the root causes in `internal/api/httpapi`, `internal/api/udsapi`, `internal/session`, `internal/acp`, and `web/src/systems/session`.
- Loaded relevant skill instructions and scanned existing ledgers/plans.
- Persisted the accepted implementation plan under `.codex/plans/2026-04-20-prompt-stream-stall.md`.
- Added explicit prompt cancellation to the session manager and exposed `POST /api/sessions/:id/prompt/cancel` on HTTP and UDS.
- Detached prompt execution from request cancellation in HTTP and UDS prompt handlers.
- Fixed the HTTP AI SDK stream framing to emit protocol-native tool parts, including `tool-input-available`.
- Updated the web stop flow to cancel active prompts instead of aborting the transport stream.
- Prevented metadata repair from classifying legitimately pending startups as failed starts.
- Added backend, handler, integration, and web adapter regressions for cancel/detach/race behavior.
- Regenerated required web OpenAPI artifacts to satisfy the repo verification contract.
- Verified the change set with targeted Go/unit/integration tests, web tests/typecheck/build, and full `make verify`.
- Re-ran `make verify` immediately before completion; it passed with `1522` web tests, `5457` Go tests, `0 issues`, successful build, and package-boundary checks green.

Now:

- None.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None currently blocking.

Working set (files/ids/commands):

- `internal/session/{manager_prompt.go,query.go,interfaces.go,session.go,manager_test.go,query_test.go}`
- `internal/acp/{client.go,handlers.go,types.go}`
- `internal/api/httpapi/{prompt.go,routes.go,handlers_test.go,httpapi_integration_test.go}`
- `internal/api/udsapi/{prompt.go,routes.go}`
- `internal/api/core/interfaces.go`
- `web/src/systems/session/hooks/use-session-chat.ts`
- `web/src/systems/session/hooks/use-session-actions.ts`
- `web/src/lib/{api-client.ts,api-contract.ts}`
- `web/src/generated/{agh-openapi.d.ts,compozy-openapi.d.ts}`
- `openapi/{agh.json,compozy-daemon.json}`
- `~/.agh/logs/agh.log`
- `~/.agh/sessions/sess-78f6aef98eaa4c37/events.db`
