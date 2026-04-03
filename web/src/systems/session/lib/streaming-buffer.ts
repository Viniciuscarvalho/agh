/**
 * Merge a streamed chunk into the current buffer while tolerating
 * overlapping or cumulative snapshots from upstream.
 *
 * Adapted from .resources/harnss/src/lib/streaming-buffer.ts
 */
export function mergeStreamingChunk(current: string, incoming: string): string {
  if (!incoming) return current;
  if (!current) return incoming;

  // Some SDK paths resend the full accumulated value instead of a pure delta.
  if (incoming.startsWith(current)) return incoming;
  if (current.endsWith(incoming)) return current;

  // Cap at 200 chars — SDK thinking deltas are small incremental chunks, so a
  // 200-char window is more than sufficient for overlap detection. Without the
  // cap, this O(n*m) scan grows with accumulated thinking text length.
  const maxOverlap = Math.min(200, current.length, incoming.length);
  for (let overlap = maxOverlap; overlap > 0; overlap -= 1) {
    if (current.endsWith(incoming.slice(0, overlap))) {
      return current + incoming.slice(overlap);
    }
  }

  return current + incoming;
}

/**
 * Lightweight streaming buffer for accumulating text and thinking chunks
 * from SSE deltas. Pure data — no React dependency, easily testable.
 *
 * Text deltas are pure incremental chunks (simple concatenation).
 * Thinking deltas may arrive as cumulative snapshots (overlap detection needed).
 */
export class SimpleStreamingBuffer {
  messageId: string | null = null;
  private textChunks: string[] = [];
  private thinkingChunks: string[] = [];
  thinkingComplete = false;

  appendText(text: string): void {
    this.textChunks.push(text);
  }

  appendThinking(text: string): void {
    const current = this.thinkingChunks.join("");
    this.thinkingChunks = [mergeStreamingChunk(current, text)];
  }

  getText(): string {
    return this.textChunks.join("");
  }

  getThinking(): string {
    return this.thinkingChunks.join("");
  }

  reset(): void {
    this.messageId = null;
    this.textChunks = [];
    this.thinkingChunks = [];
    this.thinkingComplete = false;
  }
}
