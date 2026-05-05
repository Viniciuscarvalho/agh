Goal (incl. success criteria):

- Implement the accepted “Session Chat Production Hardening” plan end-to-end: durable session chat history, live tool-call rendering without refresh, explicit thinking/loading feedback, removal of the `skills` selector, real clear-conversation reset on the same session id, and verification via web/backend tests plus `make verify`.

Constraints/Assumptions:

- User explicitly requested at least 6 `gpt-5.4-mini` subagents analyzing `.resources/harnss` and `~/Dev/compozy/compozy-code`; their findings must be persisted under `~/.codex/analysis/session-chat-ux/`.
- Root `AGENTS.md` and `CLAUDE.md` plus `web/AGENTS.md` and `web/CLAUDE.md` apply.
- Dirty worktree exists across many unrelated files; never revert or touch unrelated edits.
- Use root-cause fixes only; no refresh hacks, no UI-only clear, no context-preserving “fake reset”.

Key decisions:

- Treat persisted transcript as the durable history source of truth and AI SDK `useChat` as live in-flight turn state only.
- Add a backend `clear` operation that resets persisted transcript/event state and runtime conversation context in place while keeping the same `session_id`.
- Remove `skillId` from the composer/draft path entirely; keep channel selection only.
- Surface header control pending state (`stop`, `resume`, `clear`) explicitly instead of relying on silent disabled buttons.

State:

- Completed.

Done:

- Read root/web instructions and reloaded critical frontend/backend session files after compaction.
- Reconstructed accepted plan and subagent findings from prior turn context.
- Confirmed current root causes: `use-session-chat` overwrites hydrated transcript with AI SDK messages and flattens tool parts, causing missing tool rows until refresh.
- Confirmed backend already streams AI SDK tool lifecycle parts; frontend transform/state is the main live-rendering bug.
- Implemented backend `ClearConversation` flow plus HTTP/UDS route, conflict handling, tests, and rollback-safe event DB reset.
- Refactored the session store and session page flow around `historyMessages + liveMessages`, keeping transcript history durable and the current round isolated in the AI SDK tail.
- Replaced the old AI SDK flattening path with `mapLiveChatMessages(...)`, so tool call/tool result rows materialize live from `message.parts` instead of only after a transcript refresh.
- Removed the composer `skills` selector and `skillId` payload path, added `inert` handling for pending permission prompts, and kept channel selection only.
- Added explicit `Thinking...` processing state plus header loading/clear UX for stop, resume, and clear actions.
- Updated/added frontend tests for mapper/store/composer/header/page/action flows and fixed daemon test fakes for the new `ClearConversation` interface method.

Now:

- Final verification passed across web and Go gates.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Files: backend clear flow + API route files above, `internal/daemon/daemon_test.go`, `internal/api/httpapi/handlers_test.go`, `internal/api/udsapi/handlers_test.go`, `web/src/hooks/routes/use-session-page.ts`, `web/src/routes/_app/session.$id.tsx`, `web/src/storybook/route-story.tsx`, `web/src/systems/session/{adapters,hooks,stores,lib,components}/...`, related tests and stories.
- Commands: `make web-lint`, `make web-typecheck`, `make web-test`, `go test ./internal/session ./internal/api/core ./internal/api/httpapi ./internal/api/udsapi`, `make verify`.
