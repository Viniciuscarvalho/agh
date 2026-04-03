import { describe, it, expect } from "vitest";
import { mapAgentEventToUIMessage, extractPermissionRequest } from "./event-mapper";
import type { AgentEventPayload } from "../types";

describe("mapAgentEventToUIMessage", () => {
  it("maps tool_call event to UIMessage with toolName and toolInput", () => {
    const event: AgentEventPayload = {
      type: "tool_call",
      tool_call_id: "tc-1",
      title: "Read",
      raw: { file_path: "/tmp/test.ts" },
    };
    const result = mapAgentEventToUIMessage(event);
    expect(result.role).toBe("tool_call");
    expect(result.toolName).toBe("Read");
    expect(result.toolInput).toEqual({ file_path: "/tmp/test.ts" });
    expect(result.id).toBe("tc-1");
    expect(result.timestamp).toBeTypeOf("number");
  });

  it("maps tool_result event to UIMessage with toolResult", () => {
    const event: AgentEventPayload = {
      type: "tool_result",
      tool_call_id: "tc-1",
      raw: { content: "file contents here", filePath: "/tmp/test.ts" },
    };
    const result = mapAgentEventToUIMessage(event);
    expect(result.role).toBe("tool_result");
    expect(result.id).toBe("tc-1");
    expect(result.toolResult).toBeDefined();
    expect(result.toolResult?.content).toBe("file contents here");
    expect(result.toolResult?.filePath).toBe("/tmp/test.ts");
  });

  it("maps tool_result with text fallback when raw is missing", () => {
    const event: AgentEventPayload = {
      type: "tool_result",
      tool_call_id: "tc-2",
      text: "plain text result",
    };
    const result = mapAgentEventToUIMessage(event);
    expect(result.toolResult?.content).toBe("plain text result");
  });

  it("maps tool_result with error in raw", () => {
    const event: AgentEventPayload = {
      type: "tool_result",
      tool_call_id: "tc-3",
      raw: { error: "file not found" },
    };
    const result = mapAgentEventToUIMessage(event);
    expect(result.toolResult?.error).toBe("file not found");
  });

  it("returns empty partial for agent_message (handled by buffer)", () => {
    const event: AgentEventPayload = {
      type: "agent_message",
      text: "Hello world",
    };
    const result = mapAgentEventToUIMessage(event);
    expect(result).toEqual({});
  });

  it("returns empty partial for thought (handled by buffer)", () => {
    const event: AgentEventPayload = {
      type: "thought",
      text: "Let me think...",
    };
    const result = mapAgentEventToUIMessage(event);
    expect(result).toEqual({});
  });

  it("returns empty partial for permission (handled via store)", () => {
    const event: AgentEventPayload = {
      type: "permission",
      request_id: "req-1",
      action: "execute",
      resource: "bash",
    };
    const result = mapAgentEventToUIMessage(event);
    expect(result).toEqual({});
  });

  it("returns empty partial for done event", () => {
    const event: AgentEventPayload = {
      type: "done",
      stop_reason: "end_turn",
    };
    const result = mapAgentEventToUIMessage(event);
    expect(result).toEqual({});
  });

  it("returns empty partial for error event", () => {
    const event: AgentEventPayload = {
      type: "error",
      error: "something broke",
    };
    const result = mapAgentEventToUIMessage(event);
    expect(result).toEqual({});
  });

  it("returns empty partial for unknown event types (no crash)", () => {
    const event: AgentEventPayload = {
      type: "some_unknown_future_event",
      text: "whatever",
    };
    const result = mapAgentEventToUIMessage(event);
    expect(result).toEqual({});
  });

  it("uses existingId when tool_call has no tool_call_id", () => {
    const event: AgentEventPayload = {
      type: "tool_call",
      title: "Bash",
    };
    const result = mapAgentEventToUIMessage(event, "fallback-id");
    expect(result.id).toBe("fallback-id");
  });
});

describe("extractPermissionRequest", () => {
  it("extracts permission from a valid permission event", () => {
    const event: AgentEventPayload = {
      type: "permission",
      request_id: "req-123",
      title: "Bash",
      action: "execute",
      resource: "rm -rf /tmp/test",
      raw: { command: "rm -rf /tmp/test" },
    };
    const perm = extractPermissionRequest(event);
    expect(perm).not.toBeNull();
    expect(perm!.requestId).toBe("req-123");
    expect(perm!.toolName).toBe("Bash");
    expect(perm!.action).toBe("execute");
    expect(perm!.resource).toBe("rm -rf /tmp/test");
    expect(perm!.toolInput).toEqual({ command: "rm -rf /tmp/test" });
  });

  it("returns null when request_id is missing", () => {
    const event: AgentEventPayload = {
      type: "permission",
      title: "Bash",
      action: "execute",
    };
    expect(extractPermissionRequest(event)).toBeNull();
  });

  it("defaults toolName to 'unknown' when title is missing", () => {
    const event: AgentEventPayload = {
      type: "permission",
      request_id: "req-456",
      action: "write",
    };
    const perm = extractPermissionRequest(event);
    expect(perm!.toolName).toBe("unknown");
  });

  it("defaults toolInput to empty object when raw is missing", () => {
    const event: AgentEventPayload = {
      type: "permission",
      request_id: "req-789",
      title: "Write",
      action: "write",
      resource: "/etc/hosts",
    };
    const perm = extractPermissionRequest(event);
    expect(perm!.toolInput).toEqual({});
  });
});
