// Types
export type {
  ACPCaps,
  AgentEventPayload,
  PermissionRequest,
  SessionEventPayload,
  SessionEventsResponse,
  SessionHistoryResponse,
  SessionPayload,
  SessionResponse,
  SessionState,
  SessionsResponse,
  TokenUsagePayload,
  ToolUseResult,
  TurnHistoryPayload,
  UIMessage,
  UIMessageRole,
} from "./types";

// Schemas
export {
  acpCapsSchema,
  agentEventPayloadSchema,
  sessionEventPayloadSchema,
  sessionEventsResponseSchema,
  sessionHistoryResponseSchema,
  sessionPayloadSchema,
  sessionResponseSchema,
  sessionStateSchema,
  sessionsResponseSchema,
  tokenUsagePayloadSchema,
  turnHistoryPayloadSchema,
  uiMessageRoleSchema,
} from "./types";

// Adapters
export type { CreateSessionParams, FetchSessionEventsParams } from "./adapters/session-api";
export {
  createSession,
  fetchSession,
  fetchSessionEvents,
  fetchSessionHistory,
  fetchSessions,
  resumeSession,
  stopSession,
} from "./adapters/session-api";

// Query infrastructure
export { sessionKeys } from "./lib/query-keys";
export {
  sessionDetailOptions,
  sessionEventsOptions,
  sessionHistoryOptions,
  sessionsListOptions,
} from "./lib/query-options";

// Lib
export { SimpleStreamingBuffer, mergeStreamingChunk } from "./lib/streaming-buffer";
export { mapAgentEventToUIMessage, extractPermissionRequest } from "./lib/event-mapper";
export {
  getToolIcon,
  getToolLabel,
  getToolCompactSummary,
  type ToolLabelTense,
} from "./lib/tool-labels";

// Stores
export { useSessionStore } from "./stores/session-store";
export type {
  SessionState as SessionStoreState,
  SessionActions,
  SessionStore,
} from "./stores/session-store";

// Hooks
export { useSession, useSessions } from "./hooks/use-sessions";
export { useCreateSession, useResumeSession, useStopSession } from "./hooks/use-session-actions";
export {
  useSessionChat,
  type UseSessionChatOptions,
  type UseSessionChatReturn,
} from "./hooks/use-session-chat";

// Components
export { SessionSidebarItem } from "./components/session-sidebar-item";
export {
  ChatView,
  buildRows,
  type RowDescriptor,
  type ChatViewProps,
} from "./components/chat-view";
export { ChatHeader, type ChatHeaderProps } from "./components/chat-header";
export { MessageBubble, type MessageBubbleProps } from "./components/message-bubble";
export { MessageComposer, type MessageComposerProps } from "./components/message-composer";
export { ThinkingBlock, type ThinkingBlockProps } from "./components/thinking-block";
export {
  ProcessingIndicator,
  type ProcessingIndicatorProps,
} from "./components/processing-indicator";
