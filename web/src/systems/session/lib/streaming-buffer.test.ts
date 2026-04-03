import { describe, it, expect } from "vitest";
import { mergeStreamingChunk, SimpleStreamingBuffer } from "./streaming-buffer";

describe("mergeStreamingChunk", () => {
  it("appends non-overlapping text correctly", () => {
    expect(mergeStreamingChunk("Hello ", "world")).toBe("Hello world");
  });

  it("returns incoming when current is empty", () => {
    expect(mergeStreamingChunk("", "hello")).toBe("hello");
  });

  it("returns current when incoming is empty", () => {
    expect(mergeStreamingChunk("hello", "")).toBe("hello");
  });

  it("returns empty string when both are empty", () => {
    expect(mergeStreamingChunk("", "")).toBe("");
  });

  it("handles cumulative snapshot (incoming starts with current)", () => {
    expect(mergeStreamingChunk("Hello", "Hello world")).toBe("Hello world");
  });

  it("handles exact duplicate (current ends with incoming)", () => {
    expect(mergeStreamingChunk("Hello world", "world")).toBe("Hello world");
  });

  it("detects and merges overlapping thinking deltas", () => {
    expect(mergeStreamingChunk("Let me think about", "think about this")).toBe(
      "Let me think about this"
    );
  });

  it("detects single-char overlap", () => {
    expect(mergeStreamingChunk("abc", "cd")).toBe("abcd");
  });

  it("appends when no overlap exists", () => {
    expect(mergeStreamingChunk("abc", "xyz")).toBe("abcxyz");
  });

  it("caps overlap detection at 200 chars", () => {
    const longCurrent = "x".repeat(300);
    const incoming = "y".repeat(10);
    // No overlap, should just append
    expect(mergeStreamingChunk(longCurrent, incoming)).toBe(longCurrent + incoming);
  });
});

describe("SimpleStreamingBuffer", () => {
  it("initializes with null messageId and empty content", () => {
    const buf = new SimpleStreamingBuffer();
    expect(buf.messageId).toBeNull();
    expect(buf.getText()).toBe("");
    expect(buf.getThinking()).toBe("");
    expect(buf.thinkingComplete).toBe(false);
  });

  it("appendText accumulates chunks correctly", () => {
    const buf = new SimpleStreamingBuffer();
    buf.appendText("Hello ");
    buf.appendText("world");
    buf.appendText("!");
    expect(buf.getText()).toBe("Hello world!");
  });

  it("appendThinking merges with overlap detection", () => {
    const buf = new SimpleStreamingBuffer();
    buf.appendThinking("Let me think");
    buf.appendThinking("Let me think about this");
    expect(buf.getThinking()).toBe("Let me think about this");
  });

  it("appendThinking appends non-overlapping chunks", () => {
    const buf = new SimpleStreamingBuffer();
    buf.appendThinking("First thought.");
    buf.appendThinking(" Second thought.");
    expect(buf.getThinking()).toBe("First thought. Second thought.");
  });

  it("reset clears all state", () => {
    const buf = new SimpleStreamingBuffer();
    buf.messageId = "msg-1";
    buf.appendText("some text");
    buf.appendThinking("some thinking");
    buf.thinkingComplete = true;

    buf.reset();

    expect(buf.messageId).toBeNull();
    expect(buf.getText()).toBe("");
    expect(buf.getThinking()).toBe("");
    expect(buf.thinkingComplete).toBe(false);
  });

  it("handles rapid sequential text appends (100+ deltas)", () => {
    const buf = new SimpleStreamingBuffer();
    for (let i = 0; i < 150; i++) {
      buf.appendText(`chunk${i} `);
    }
    const text = buf.getText();
    expect(text).toContain("chunk0 ");
    expect(text).toContain("chunk149 ");
    expect(text.split("chunk").length - 1).toBe(150);
  });

  it("keeps text and thinking independent", () => {
    const buf = new SimpleStreamingBuffer();
    buf.appendText("text content");
    buf.appendThinking("thinking content");
    expect(buf.getText()).toBe("text content");
    expect(buf.getThinking()).toBe("thinking content");
  });
});
