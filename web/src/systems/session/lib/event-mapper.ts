import type {
  AgentEventPayload,
  PermissionRequest,
  SessionEventPayload,
  ToolUseResult,
  TurnHistoryPayload,
  UIMessage,
} from "../types";

/**
 * Parse the raw content of a tool_result AgentEventPayload into a ToolUseResult.
 * The daemon sends tool result data in the `raw` field or inline text fields.
 */
function parseToolResult(event: AgentEventPayload): ToolUseResult {
  if (event.raw && typeof event.raw === "object") {
    const raw = event.raw as Record<string, unknown>;
    return {
      stdout: typeof raw.stdout === "string" ? raw.stdout : undefined,
      stderr: typeof raw.stderr === "string" ? raw.stderr : undefined,
      filePath: typeof raw.filePath === "string" ? raw.filePath : undefined,
      content: typeof raw.content === "string" ? raw.content : undefined,
      structuredPatch: Array.isArray(raw.structuredPatch) ? raw.structuredPatch : undefined,
      error: typeof raw.error === "string" ? raw.error : undefined,
    };
  }
  return {
    content: event.text ?? undefined,
    error: event.error ?? undefined,
  };
}

/**
 * Map an AgentEventPayload (from `data-agh-event` or `tool-output-available` SSE data)
 * into a partial UIMessage suitable for appending or merging into the Zustand store.
 *
 * Events handled by the streaming buffer (agent_message, thought) return empty partials
 * since those are flushed via rAF from the buffer, not mapped directly.
 */
export function mapAgentEventToUIMessage(
  event: AgentEventPayload,
  existingId?: string
): Partial<UIMessage> {
  switch (event.type) {
    case "agent_message":
    case "thought":
      // Handled by streaming buffer, not direct mapping
      return {};
    case "tool_call":
      return {
        id: event.tool_call_id ?? existingId,
        role: "tool_call",
        toolName: event.title ?? undefined,
        toolInput: event.raw as Record<string, unknown> | undefined,
        timestamp: Date.now(),
      };
    case "tool_result":
      return {
        id: event.tool_call_id,
        role: "tool_result",
        toolResult: parseToolResult(event),
        timestamp: Date.now(),
      };
    case "permission":
      // Handled via Zustand pendingPermission, not as a message
      return {};
    case "done":
    case "error":
      // Handled at the stream level, not as individual messages
      return {};
    default:
      // Unknown event types return empty partial — never crash
      return {};
  }
}

/**
 * Extract a PermissionRequest from an AgentEventPayload of type "permission".
 * Returns null if the event doesn't contain valid permission data.
 */
export function extractPermissionRequest(event: AgentEventPayload): PermissionRequest | null {
  if (!event.request_id) return null;
  return {
    requestId: event.request_id,
    toolName: event.title ?? "unknown",
    toolInput: (event.raw as Record<string, unknown>) ?? {},
    action: event.action ?? "",
    resource: event.resource ?? "",
  };
}

/**
 * Parse a SessionEventPayload content field into an AgentEventPayload.
 * The daemon stores the event payload as the `content` field in stored events.
 */
function parseEventContent(event: SessionEventPayload): AgentEventPayload {
  if (event.content && typeof event.content === "object") {
    const content = event.content as Record<string, unknown>;
    return {
      type: event.type,
      session_id: event.session_id,
      turn_id: event.turn_id,
      text: typeof content.text === "string" ? content.text : undefined,
      title: typeof content.title === "string" ? content.title : undefined,
      tool_call_id: typeof content.tool_call_id === "string" ? content.tool_call_id : undefined,
      action: typeof content.action === "string" ? content.action : undefined,
      resource: typeof content.resource === "string" ? content.resource : undefined,
      error: typeof content.error === "string" ? content.error : undefined,
      raw: content.raw,
    };
  }
  return { type: event.type };
}

/**
 * Transform TurnHistoryPayload[] from the session history endpoint
 * into a flat UIMessage[] for rendering in the chat view.
 * All messages are static (isStreaming: false) — no animation.
 */
export function mapHistoryToMessages(history: TurnHistoryPayload[]): UIMessage[] {
  const messages: UIMessage[] = [];

  for (const turn of history) {
    let assistantText = "";
    let assistantThinking = "";
    let assistantId = `hist-${turn.turn_id}`;
    let hasAssistantContent = false;

    for (const event of turn.events) {
      const ts = new Date(event.timestamp).getTime();
      const parsed = parseEventContent(event);

      switch (event.type) {
        case "user_message": {
          const text = typeof parsed.text === "string" ? parsed.text : "";
          messages.push({
            id: event.id,
            role: "user",
            content: text,
            isStreaming: false,
            timestamp: ts,
          });
          break;
        }
        case "agent_message": {
          assistantText += parsed.text ?? "";
          hasAssistantContent = true;
          break;
        }
        case "thought": {
          assistantThinking += parsed.text ?? "";
          hasAssistantContent = true;
          break;
        }
        case "tool_call": {
          // Flush accumulated assistant text before tool calls
          if (hasAssistantContent) {
            messages.push({
              id: assistantId,
              role: "assistant",
              content: assistantText,
              thinking: assistantThinking || undefined,
              thinkingComplete: true,
              isStreaming: false,
              timestamp: ts,
            });
            assistantText = "";
            assistantThinking = "";
            hasAssistantContent = false;
            assistantId = `hist-${turn.turn_id}-${event.id}`;
          }

          messages.push({
            id: parsed.tool_call_id ?? event.id,
            role: "tool_call",
            content: "",
            toolName: parsed.title ?? undefined,
            toolInput: parsed.raw as Record<string, unknown> | undefined,
            isStreaming: false,
            timestamp: ts,
          });
          break;
        }
        case "tool_result": {
          messages.push({
            id: parsed.tool_call_id ?? event.id,
            role: "tool_result",
            content: "",
            toolResult: parseToolResult(parsed),
            toolError: !!parsed.error,
            isStreaming: false,
            timestamp: ts,
          });
          break;
        }
        default:
          // Skip unknown event types (done, error, permission, etc.)
          break;
      }
    }

    // Flush any remaining assistant content at the end of the turn
    if (hasAssistantContent) {
      messages.push({
        id: assistantId,
        role: "assistant",
        content: assistantText,
        thinking: assistantThinking || undefined,
        thinkingComplete: true,
        isStreaming: false,
        timestamp: Date.now(),
      });
    }
  }

  return messages;
}
