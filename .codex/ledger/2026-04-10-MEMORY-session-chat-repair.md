Goal (incl. success criteria):

- Restore end-to-end session chat in the web app. Success means stale sessions no longer appear chatable when they are not active, poisoned half-started sessions can be recovered, browser QA can send and receive a prompt through the real UI, and `make verify` passes.

Constraints/Assumptions:

- Must follow root and `web/` AGENTS/CLAUDE guidance, including `systematic-debugging`, `no-workarounds`, required web checks, and `make verify` before completion.
- The repo already contains unrelated dirty changes from the workspace-shell task; do not revert or rewrite them.
- User explicitly required `agent-browser`; browser QA must be part of verification.
- Current daemon on `127.0.0.1:2123` is serving the app and reproduces the bug with session `sess-648f205f93ce11dc`.

Key decisions:

- Treat the bug as a session lifecycle repair problem, not a generic prompt transport failure.
- Normalize stale transitional metadata for inactive sessions so the API reports them as stopped instead of `starting`/`active` ghosts.
- For sessions whose original start never completed, clear the stale ACP session id during repair so resume performs a fresh start instead of `session/load` against a missing upstream resource.
- Tighten the web session route so only truly active sessions expose the composer.

State:

- Completed.

Done:

- Reproduced the failure with `agent-browser` on the real app.
- Confirmed the broken route was `/session/sess-648f205f93ce11dc`.
- Captured backend state for the broken session: metadata was being reported as `state: "starting"` with `stop_reason: "error"` and `stop_detail: "start did not complete"`.
- Confirmed `POST /api/sessions/sess-648f205f93ce11dc/resume` returns `500`.
- Pulled the unmasked CLI resume error: ACP `session/load` fails with `Resource not found` for stale ACP session id `ed82d47a-63e7-48ee-b101-3129d4e2cf1e`.
- Verified fresh sessions still work through the same daemon: created `sess-4b65525171d39c60` and successfully prompted it via HTTP SSE.
- Isolated the root cause: stale half-started sessions are left in transitional metadata and the web route exposes the composer for non-active sessions.
- Added inactive-metadata repair plus resume fallback so missing upstream ACP sessions are converted into a fresh start instead of a hard failure.
- Added ACP error classification for missing `session/load` resources and restored failed resume attempts back to stopped metadata instead of leaking `starting`.
- Tightened the web session route so the composer only renders for truly active sessions.
- Verified the real browser flow with `agent-browser`: stopped session hides the composer, resume from the page succeeds, prompt posts to `/api/sessions/sess-648f205f93ce11dc/prompt`, and the assistant replied `OK`.
- Fixed a test-only deadlock introduced while hardening version access by separating override serialization from runtime reads in `internal/version`.
- Passed `go test -race ./internal/version ./internal/extension ./cmd/agh`, `make web-lint`, `make web-typecheck`, and `make verify`.

Now:

- Nothing pending.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-10-MEMORY-session-chat-repair.md`
- `internal/session/query.go`
- `internal/session/manager_lifecycle.go`
- `internal/session/resume_repair.go`
- `internal/acp/client.go`
- `internal/session/resume_repair_test.go`
- `internal/session/manager_test.go`
- `internal/session/additional_test.go`
- `internal/acp/client_test.go`
- `internal/version/version.go`
- `internal/version/version_test.go`
- `internal/extension/manifest_test.go`
- `cmd/agh/main_test.go`
- `web/src/routes/_app/session.$id.tsx`
- `web/src/routes/_app/-session.$id.test.tsx`
- `agent-browser --session agh-qa4 ...`
- `curl -X POST http://localhost:2123/api/sessions/sess-648f205f93ce11dc/resume`
- `./bin/agh session resume sess-648f205f93ce11dc -o json`
- `make web-lint`
- `make web-typecheck`
- `make verify`
