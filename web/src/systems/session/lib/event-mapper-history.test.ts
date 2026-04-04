import { describe, it, expect } from "vitest";
import { mapHistoryToMessages } from "./event-mapper";
import type { SessionEventPayload, TurnHistoryPayload } from "../types";

function makeEvent(
  overrides: { type: string; content: unknown } & Partial<
    Omit<SessionEventPayload, "type" | "content">
  >
): SessionEventPayload {
  return {
    id: "evt-1",
    session_id: "sess-001",
    sequence: 1,
    turn_id: "turn-1",
    agent_name: "claude-agent",
    timestamp: "2026-04-01T00:00:00Z",
    ...overrides,
  };
}

describe("mapHistoryToMessages", () => {
  it("transforms user_message and agent_message into UIMessages", () => {
    const history: TurnHistoryPayload[] = [
      {
        turn_id: "turn-1",
        events: [
          makeEvent({
            id: "evt-1",
            type: "user_message",
            content: { text: "Hello" },
          }),
          makeEvent({
            id: "evt-2",
            type: "agent_message",
            content: { text: "Hi there!" },
          }),
        ],
      },
    ];

    const messages = mapHistoryToMessages(history);
    expect(messages).toHaveLength(2);
    expect(messages[0].role).toBe("user");
    expect(messages[0].content).toBe("Hello");
    expect(messages[0].isStreaming).toBe(false);
    expect(messages[1].role).toBe("assistant");
    expect(messages[1].content).toBe("Hi there!");
    expect(messages[1].isStreaming).toBe(false);
  });

  it("maps tool_call events to tool_call role messages", () => {
    const history: TurnHistoryPayload[] = [
      {
        turn_id: "turn-1",
        events: [
          makeEvent({
            id: "evt-1",
            type: "tool_call",
            content: { title: "Read", tool_call_id: "tc-1", raw: { file_path: "/tmp/a.ts" } },
          }),
        ],
      },
    ];

    const messages = mapHistoryToMessages(history);
    expect(messages).toHaveLength(1);
    expect(messages[0].role).toBe("tool_call");
    expect(messages[0].toolName).toBe("Read");
    expect(messages[0].toolInput).toEqual({ file_path: "/tmp/a.ts" });
    expect(messages[0].id).toBe("tc-1");
  });

  it("maps tool_result events to tool_result role messages", () => {
    const history: TurnHistoryPayload[] = [
      {
        turn_id: "turn-1",
        events: [
          makeEvent({
            id: "evt-1",
            type: "tool_result",
            content: { tool_call_id: "tc-1", raw: { content: "file contents" } },
          }),
        ],
      },
    ];

    const messages = mapHistoryToMessages(history);
    expect(messages).toHaveLength(1);
    expect(messages[0].role).toBe("tool_result");
    expect(messages[0].toolResult?.content).toBe("file contents");
  });

  it("maps thought events to messages with thinking field", () => {
    const history: TurnHistoryPayload[] = [
      {
        turn_id: "turn-1",
        events: [
          makeEvent({
            id: "evt-1",
            type: "thought",
            content: { text: "Let me think..." },
          }),
          makeEvent({
            id: "evt-2",
            type: "agent_message",
            content: { text: "The answer is 42." },
          }),
        ],
      },
    ];

    const messages = mapHistoryToMessages(history);
    expect(messages).toHaveLength(1);
    const msg = messages[0];
    expect(msg.role).toBe("assistant");
    expect(msg.thinking).toBe("Let me think...");
    expect(msg.thinkingComplete).toBe(true);
    expect(msg.content).toBe("The answer is 42.");
  });

  it("handles empty history (no events)", () => {
    const messages = mapHistoryToMessages([]);
    expect(messages).toEqual([]);
  });

  it("handles turn with no events", () => {
    const history: TurnHistoryPayload[] = [{ turn_id: "turn-1", events: [] }];
    const messages = mapHistoryToMessages(history);
    expect(messages).toEqual([]);
  });

  it("flushes assistant text before tool calls", () => {
    const history: TurnHistoryPayload[] = [
      {
        turn_id: "turn-1",
        events: [
          makeEvent({ id: "evt-1", type: "agent_message", content: { text: "Let me read..." } }),
          makeEvent({
            id: "evt-2",
            type: "tool_call",
            content: { title: "Read", tool_call_id: "tc-1", raw: { file_path: "/a.ts" } },
          }),
          makeEvent({
            id: "evt-3",
            type: "tool_result",
            content: { tool_call_id: "tc-1", raw: { content: "code here" } },
          }),
          makeEvent({
            id: "evt-4",
            type: "agent_message",
            content: { text: "Here is what I found." },
          }),
        ],
      },
    ];

    const messages = mapHistoryToMessages(history);
    expect(messages).toHaveLength(4);
    expect(messages[0].role).toBe("assistant");
    expect(messages[0].content).toBe("Let me read...");
    expect(messages[1].role).toBe("tool_call");
    expect(messages[2].role).toBe("tool_result");
    expect(messages[3].role).toBe("assistant");
    expect(messages[3].content).toBe("Here is what I found.");
  });

  it("handles multiple turns in sequence", () => {
    const history: TurnHistoryPayload[] = [
      {
        turn_id: "turn-1",
        events: [
          makeEvent({ id: "e1", type: "user_message", content: { text: "Question 1" } }),
          makeEvent({ id: "e2", type: "agent_message", content: { text: "Answer 1" } }),
        ],
      },
      {
        turn_id: "turn-2",
        events: [
          makeEvent({
            id: "e3",
            type: "user_message",
            turn_id: "turn-2",
            content: { text: "Question 2" },
          }),
          makeEvent({
            id: "e4",
            type: "agent_message",
            turn_id: "turn-2",
            content: { text: "Answer 2" },
          }),
        ],
      },
    ];

    const messages = mapHistoryToMessages(history);
    expect(messages).toHaveLength(4);
    expect(messages[0].content).toBe("Question 1");
    expect(messages[1].content).toBe("Answer 1");
    expect(messages[2].content).toBe("Question 2");
    expect(messages[3].content).toBe("Answer 2");
  });

  it("skips unknown event types gracefully", () => {
    const history: TurnHistoryPayload[] = [
      {
        turn_id: "turn-1",
        events: [
          makeEvent({ id: "e1", type: "user_message", content: { text: "Hello" } }),
          makeEvent({ id: "e2", type: "done", content: { stop_reason: "end_turn" } }),
          makeEvent({ id: "e3", type: "permission", content: { action: "execute" } }),
        ],
      },
    ];

    const messages = mapHistoryToMessages(history);
    expect(messages).toHaveLength(1);
    expect(messages[0].role).toBe("user");
  });

  it("all history messages have isStreaming: false", () => {
    const history: TurnHistoryPayload[] = [
      {
        turn_id: "turn-1",
        events: [
          makeEvent({ id: "e1", type: "user_message", content: { text: "Hi" } }),
          makeEvent({ id: "e2", type: "agent_message", content: { text: "Hello" } }),
          makeEvent({
            id: "e3",
            type: "tool_call",
            content: { title: "Bash", tool_call_id: "tc-1", raw: { command: "ls" } },
          }),
          makeEvent({
            id: "e4",
            type: "tool_result",
            content: { tool_call_id: "tc-1", raw: { stdout: "output" } },
          }),
        ],
      },
    ];

    const messages = mapHistoryToMessages(history);
    for (const msg of messages) {
      expect(msg.isStreaming).toBe(false);
    }
  });
});
