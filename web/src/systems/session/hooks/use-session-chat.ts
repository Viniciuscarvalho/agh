import { useCallback, useEffect, useMemo, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage as AIUIMessage } from "ai";
import { SimpleStreamingBuffer } from "../lib/streaming-buffer";
import { extractPermissionRequest } from "../lib/event-mapper";
import { useSessionStore } from "./use-session-store";
import type { AgentEventPayload, UIMessage } from "../types";

/**
 * Transform an AI SDK UIMessage (with parts) into our flat UIMessage format.
 */
function transformAIMessage(msg: AIUIMessage): UIMessage {
  let content = "";
  let thinking = "";
  let thinkingComplete = false;
  let toolName: string | undefined;
  let toolInput: Record<string, unknown> | undefined;
  let isStreaming = false;

  for (const part of msg.parts) {
    if (part.type === "text") {
      content += part.text;
      if (part.state === "streaming") isStreaming = true;
    } else if (part.type === "reasoning") {
      thinking += part.text;
      thinkingComplete = part.state === "done";
      if (part.state === "streaming") isStreaming = true;
    } else if (part.type === "dynamic-tool" || part.type.startsWith("tool-")) {
      const toolPart = part as { toolName?: string; toolCallId?: string; input?: unknown };
      toolName = toolPart.toolName ?? part.type.replace("tool-", "");
      if (toolPart.input && typeof toolPart.input === "object") {
        toolInput = toolPart.input as Record<string, unknown>;
      }
    }
  }

  const role = msg.role === "user" ? "user" : msg.role === "assistant" ? "assistant" : "system";

  return {
    id: msg.id,
    role,
    content,
    thinking: thinking || undefined,
    thinkingComplete: thinkingComplete || undefined,
    toolName,
    toolInput,
    isStreaming: isStreaming || undefined,
    timestamp: Date.now(),
  };
}

export interface UseSessionChatOptions {
  sessionId: string | null;
}

export interface UseSessionChatReturn {
  /** Send a message to the session */
  sendMessage: (text: string) => void;
  /** Stop the current generation */
  stop: () => void;
  /** Current chat status from AI SDK */
  status: "submitted" | "streaming" | "ready" | "error";
  /** Error from the chat, if any */
  error: Error | undefined;
}

/**
 * Hook that wires AI SDK `useChat` to SimpleStreamingBuffer with rAF flush
 * to the Zustand session store. Handles SSE transport to `POST /api/sessions/:id/prompt`,
 * custom daemon events (permissions, agh data), and 60fps rendering.
 */
export function useSessionChat({ sessionId }: UseSessionChatOptions): UseSessionChatReturn {
  const bufferRef = useRef(new SimpleStreamingBuffer());
  const rafRef = useRef<number | null>(null);
  const prevLengthRef = useRef(0);

  const store = useSessionStore;

  const transport = useMemo(() => {
    if (!sessionId) return undefined;
    return new DefaultChatTransport({
      api: `/api/sessions/${sessionId}/prompt`,
    });
  }, [sessionId]);

  const chat = useChat({
    transport,
    onFinish: () => {
      // Flush any remaining buffer content
      const buf = bufferRef.current;
      if (buf.messageId) {
        store.getState().updateLastMessage({
          content: buf.getText(),
          thinking: buf.getThinking() || undefined,
          thinkingComplete: buf.thinkingComplete || undefined,
          isStreaming: false,
        });
        buf.reset();
      }
      store.setState({ isStreaming: false });
    },
    onError: error => {
      console.error("[session-chat] Stream error:", error);
      store.setState({ isStreaming: false });
    },
    onData: dataPart => {
      // Handle custom daemon data parts (agh-event, agh-permission)
      const partType = dataPart.type as string;
      if (partType === "data-agh-permission") {
        const event = dataPart.data as unknown as AgentEventPayload;
        const permission = extractPermissionRequest(event);
        if (permission) {
          store.getState().setPendingPermission(permission);
        }
      }
      // data-agh-event parts are informational (tool call metadata);
      // tool calls are already handled by AI SDK's tool parts
    },
  });

  // Schedule a rAF flush from buffer to Zustand store.
  // Coalesces rapid streaming updates to ~60fps.
  const scheduleFlush = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const buf = bufferRef.current;
      if (!buf.messageId) return;
      store.getState().updateLastMessage({
        content: buf.getText(),
        thinking: buf.getThinking() || undefined,
        thinkingComplete: buf.thinkingComplete || undefined,
      });
    });
  }, [store]);

  // Sync AI SDK messages → Zustand store via rAF-throttled transform.
  // On each AI SDK message update, we detect what changed and buffer it.
  useEffect(() => {
    const aiMessages = chat.messages;
    if (aiMessages.length === 0) return;

    const isStreaming = chat.status === "streaming" || chat.status === "submitted";

    // Full sync: transform all AI SDK messages to our format
    // For the last message during streaming, use the buffer for rAF throttling
    if (isStreaming && aiMessages.length > 0) {
      const lastMsg = aiMessages[aiMessages.length - 1];

      // Buffer the streaming message content
      if (lastMsg.role === "assistant") {
        const buf = bufferRef.current;
        if (buf.messageId !== lastMsg.id) {
          // New streaming message started
          buf.reset();
          buf.messageId = lastMsg.id;
        }

        // Extract accumulated content from AI SDK parts.
        // AI SDK already accumulates deltas — we snapshot for rAF flushing.
        let text = "";
        let thinking = "";
        let thinkingDone = false;
        for (const part of lastMsg.parts) {
          if (part.type === "text") {
            text += part.text;
          } else if (part.type === "reasoning") {
            thinking += part.text;
            if (part.state === "done") thinkingDone = true;
          }
        }

        // Use buffer's public API to snapshot the accumulated content.
        // reset + re-append ensures the buffer reflects the latest AI SDK state.
        buf.reset();
        buf.messageId = lastMsg.id;
        if (text) buf.appendText(text);
        if (thinking) buf.appendThinking(thinking);
        buf.thinkingComplete = thinkingDone;

        // Sync non-streaming messages immediately, buffer the last one
        const stableMessages = aiMessages.slice(0, -1).map(transformAIMessage);
        const streamingMsg: UIMessage = {
          id: lastMsg.id,
          role: "assistant",
          content: buf.getText(),
          thinking: buf.getThinking() || undefined,
          thinkingComplete: buf.thinkingComplete || undefined,
          isStreaming: true,
          timestamp: Date.now(),
        };

        store.setState({
          messages: [...stableMessages, streamingMsg],
          isStreaming: true,
        });

        scheduleFlush();
        return;
      }
    }

    // Non-streaming: full sync
    const uiMessages = aiMessages.map(transformAIMessage);
    store.setState({ messages: uiMessages });
    prevLengthRef.current = aiMessages.length;
  }, [chat.messages, chat.status, store, scheduleFlush]);

  // Cleanup rAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  // Reset buffer on session change
  useEffect(() => {
    bufferRef.current.reset();
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, [sessionId]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!sessionId) return;
      store.setState({ isStreaming: true });
      chat.sendMessage({ text });
    },
    [sessionId, chat, store]
  );

  const stop = useCallback(() => {
    chat.stop();
    bufferRef.current.reset();
    store.setState({ isStreaming: false });
  }, [chat, store]);

  return {
    sendMessage,
    stop,
    status: chat.status,
    error: chat.error,
  };
}
