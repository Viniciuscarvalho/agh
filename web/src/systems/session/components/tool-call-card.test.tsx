import { render, screen, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import type { UIMessage } from "../types";

vi.mock("@/lib/utils", () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(" "),
}));

import { ToolCallCard } from "./tool-call-card";

function makeToolMessage(overrides: Partial<UIMessage> = {}): UIMessage {
  return {
    id: "tc-1",
    role: "tool_call",
    content: "",
    toolName: "Read",
    toolInput: { file_path: "/src/main.ts" },
    timestamp: Date.now(),
    ...overrides,
  };
}

describe("ToolCallCard", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders executing state with shimmer for tool without result", () => {
    render(<ToolCallCard message={makeToolMessage()} />);
    expect(screen.getByTestId("tool-card-executing")).toBeInTheDocument();
    expect(screen.getByTestId("tool-card-executing")).toHaveTextContent("Reading...");
  });

  it("renders success state with past-tense label for completed tool", () => {
    render(
      <ToolCallCard
        message={makeToolMessage({
          toolResult: { content: "file content" },
        })}
      />
    );
    expect(screen.getByTestId("tool-card-success")).toBeInTheDocument();
    expect(screen.getByTestId("tool-card-success")).toHaveTextContent("Read file");
  });

  it("renders error state with red icon for failed tool", () => {
    render(
      <ToolCallCard
        message={makeToolMessage({
          toolResult: { error: "not found" },
          toolError: true,
        })}
      />
    );
    expect(screen.getByTestId("tool-card-error")).toBeInTheDocument();
    expect(screen.getByTestId("tool-card-error")).toHaveTextContent("Failed to read file");
  });

  it("shows compact summary from tool input", () => {
    render(<ToolCallCard message={makeToolMessage()} />);
    expect(screen.getByText("/src/main.ts")).toBeInTheDocument();
  });

  it("auto-expands when toolResult arrives", () => {
    const msg = makeToolMessage();
    const { rerender } = render(<ToolCallCard message={msg} />);
    expect(screen.queryByTestId("tool-card-expanded")).not.toBeInTheDocument();

    // Simulate result arriving
    rerender(<ToolCallCard message={{ ...msg, toolResult: { content: "file content" } }} />);
    expect(screen.getByTestId("tool-card-expanded")).toBeInTheDocument();
  });

  it("auto-collapses after 2s when not manually toggled", () => {
    const msg = makeToolMessage();
    const { rerender } = render(<ToolCallCard message={msg} />);

    // Result arrives → auto-expand
    rerender(<ToolCallCard message={{ ...msg, toolResult: { content: "file content" } }} />);
    expect(screen.getByTestId("tool-card-expanded")).toBeInTheDocument();

    // Advance 2s → auto-collapse
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.queryByTestId("tool-card-expanded")).not.toBeInTheDocument();
  });

  it("does not auto-expand for Edit/Write tools (they start expanded)", () => {
    const msg = makeToolMessage({
      id: "tc-edit-1",
      toolName: "Edit",
      toolInput: { file_path: "/a.ts", old_string: "a", new_string: "b" },
    });
    const { rerender } = render(<ToolCallCard message={msg} />);

    // Result arrives — should not trigger auto-expand/collapse cycle
    rerender(<ToolCallCard message={{ ...msg, toolResult: { content: "ok" } }} />);

    // The card starts expanded for Edit, so it should be visible
    expect(screen.getByTestId("tool-card-expanded")).toBeInTheDocument();

    // Should NOT auto-collapse after 2s (isEditLike bypass)
    act(() => {
      vi.advanceTimersByTime(2500);
    });
    expect(screen.getByTestId("tool-card-expanded")).toBeInTheDocument();
  });

  it("cancels auto-collapse when user manually toggles", () => {
    const msg = makeToolMessage();
    const { rerender } = render(<ToolCallCard message={msg} />);

    // Result arrives → auto-expand fires
    rerender(<ToolCallCard message={{ ...msg, toolResult: { content: "result" } }} />);
    expect(screen.getByTestId("tool-card-expanded")).toBeInTheDocument();

    // User clicks to collapse (sets userToggled = true, clears timer)
    act(() => {
      screen.getByTestId("tool-card-trigger").click();
    });
    expect(screen.queryByTestId("tool-card-expanded")).not.toBeInTheDocument();

    // After 2s, card should stay collapsed because user manually toggled
    act(() => {
      vi.advanceTimersByTime(2500);
    });
    expect(screen.queryByTestId("tool-card-expanded")).not.toBeInTheDocument();
  });

  it("renders Bash tool with correct labels", () => {
    render(
      <ToolCallCard
        message={makeToolMessage({
          toolName: "Bash",
          toolInput: { command: "ls -la" },
        })}
      />
    );
    expect(screen.getByTestId("tool-card-executing")).toHaveTextContent("Running...");
    expect(screen.getByText("ls -la")).toBeInTheDocument();
  });

  it("renders unknown tool with fallback labels", () => {
    render(
      <ToolCallCard
        message={makeToolMessage({
          toolName: "CustomTool",
          toolInput: {},
          toolResult: { content: "done" },
        })}
      />
    );
    expect(screen.getByTestId("tool-card-success")).toHaveTextContent("Used CustomTool");
  });
});
