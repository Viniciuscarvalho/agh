Goal (incl. success criteria):

- Analyze `.resources/harnss` chat rendering patterns for live tool calls, explicit thinking/loading states, and bottom composer UX.
- Success means exact files/symbols, reusable behaviors for AGH web, and architectural cautions grounded in the current harness code.

Constraints/Assumptions:

- Read-only analysis only; do not edit product code or write implementation docs.
- Use repo instructions and local harness instructions as applicable.
- Focus on renderer-side chat behavior, not backend/session runtime work.

Key decisions:

- Treat `useClaude` and `useCodex` as the primary streaming/event seams.
- Treat `ChatView`, `ToolCall`, `ThinkingBlock`, `MessageBubble`, and `InputBar` as the main rendering/UX seams.
- Use line-anchored evidence from the harness files rather than inference where possible.

State:

- Analysis complete enough to report.

Done:

- Mapped live tool-call insertion paths for Claude and Codex.
- Mapped explicit thinking UI and per-token reveal behavior.
- Mapped bottom composer loading/stop/queue affordances.
- Collected exact file and symbol references.

Now:

- Draft final analysis for the user.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether AGH web should adopt the same DOM-surgery reveal approach or a less invasive animation path.

Working set (files/ids/commands):

- `.resources/harnss/src/hooks/useClaude.ts`
- `.resources/harnss/src/hooks/useCodex.ts`
- `.resources/harnss/src/components/ChatView.tsx`
- `.resources/harnss/src/components/MessageBubble.tsx`
- `.resources/harnss/src/components/ThinkingBlock.tsx`
- `.resources/harnss/src/components/ToolCall.tsx`
- `.resources/harnss/src/components/ToolGroupBlock.tsx`
- `.resources/harnss/src/components/input-bar/InputBar.tsx`
- `.resources/harnss/src/components/BottomComposer.tsx`
- `.resources/harnss/src/components/chat-ui-state.tsx`
- `.resources/harnss/src/hooks/useStreamingTextReveal.ts`
