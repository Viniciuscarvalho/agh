Goal (incl. success criteria):

- Restore persisted session history when reopening an AGH conversation after the assistant-ui migration.
- Success means the session route binds assistant-ui thread identity to the AGH backend session identity, transcript replay hydrates on initial mount and remount, and verification gates pass.

Constraints/Assumptions:

- Follow root `AGENTS.md` / `CLAUDE.md` plus `web/AGENTS.md` / `web/CLAUDE.md`.
- No destructive git commands; do not touch unrelated worktree changes.
- Fix root cause only; no manual transcript import shim, localStorage workaround, or duplicate chat state.
- Keep AGH backend/ACP as the source of truth for sessions, transcript replay, and live prompt streaming.

Key decisions:

- Replace the implicit assistant-ui in-memory thread list with an AGH session-backed thread-list adapter built on `useRemoteThreadListRuntime`.
- Bind assistant-ui `threadId` to the route `sessionId` so reopened sessions mount the existing remote thread instead of a new local thread.
- Reuse TanStack Query for session list/detail/transcript lookups inside assistant-ui adapters via `ensureQueryData`.
- Keep `useChatRuntime` for the AI SDK transport/runtime layer, nested inside the outer AGH session thread-list runtime.

State:

- Completed.

Done:

- Traced the bug to assistant-ui thread identity: `useChatRuntime` defaulted to an in-memory thread list, so `useExternalHistory` never saw a `remoteId` for reopened AGH sessions.
- Added a regression test covering initial mount + remount of the same session route and asserting persisted transcript replay.
- Added `web/src/systems/session/lib/session-thread-list-adapter.ts` to map AGH session APIs/query cache into assistant-ui remote thread metadata.
- Added `web/src/systems/session/hooks/use-session-chat-runtime.ts` to compose the outer AGH thread-list runtime with the nested AI SDK runtime.
- Updated `SessionChatRuntimeProvider` and the session route to pass `workspaceId` and use the new runtime path.
- Updated `session-history-adapter.ts` to hydrate transcript replay through the existing query cache.
- Added `Element.prototype.scrollTo` to `web/src/test-setup.ts` because assistant-ui viewport auto-scroll needs it in jsdom.
- Verified with targeted regression test, `make web-typecheck`, `make web-lint`, `make web-test`, and `make verify`.

Now:

- No active implementation work.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `web/src/systems/session/components/session-chat-runtime-provider.tsx`
- `web/src/systems/session/hooks/use-session-chat-runtime.ts`
- `web/src/systems/session/lib/{session-history-adapter.ts,session-thread-list-adapter.ts}`
- `web/src/routes/_app/session.$id.tsx`
- `web/src/systems/session/components/session-chat-runtime-provider.test.tsx`
- `web/src/test-setup.ts`
- Verification: `bun vitest run web/src/systems/session/components/session-chat-runtime-provider.test.tsx`, `make web-typecheck`, `make web-lint`, `make web-test`, `make verify`
