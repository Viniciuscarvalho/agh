import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { approveSession } from "./session-api";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("approveSession", () => {
  it("sends correct POST body with request_id, turn_id, and decision", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);

    await approveSession("sess-001", {
      request_id: "req-123",
      turn_id: "turn-1",
      decision: "allow-once",
    });

    expect(fetch).toHaveBeenCalledWith("/api/sessions/sess-001/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        request_id: "req-123",
        turn_id: "turn-1",
        decision: "allow-once",
      }),
      signal: undefined,
    });
  });

  it("sends allow-always decision", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);

    await approveSession("sess-001", {
      request_id: "req-123",
      turn_id: "",
      decision: "allow-always",
    });

    const body = JSON.parse(vi.mocked(fetch).mock.calls[0][1]?.body as string);
    expect(body.decision).toBe("allow-always");
  });

  it("sends reject-once decision", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);

    await approveSession("sess-001", {
      request_id: "req-123",
      turn_id: "",
      decision: "reject-once",
    });

    const body = JSON.parse(vi.mocked(fetch).mock.calls[0][1]?.body as string);
    expect(body.decision).toBe("reject-once");
  });

  it("sends reject-always decision", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);

    await approveSession("sess-001", {
      request_id: "req-123",
      turn_id: "",
      decision: "reject-always",
    });

    const body = JSON.parse(vi.mocked(fetch).mock.calls[0][1]?.body as string);
    expect(body.decision).toBe("reject-always");
  });

  it("throws 404 for unknown session", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 404 } as Response);
    await expect(
      approveSession("unknown", {
        request_id: "req-1",
        turn_id: "",
        decision: "allow-once",
      })
    ).rejects.toThrow("Session not found: unknown");
  });

  it("throws generic error for other failures", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 500 } as Response);
    await expect(
      approveSession("sess-001", {
        request_id: "req-1",
        turn_id: "",
        decision: "allow-once",
      })
    ).rejects.toThrow("Failed to approve permission: 500");
  });

  it("passes abort signal to fetch", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);
    const controller = new AbortController();

    await approveSession(
      "sess-001",
      { request_id: "req-1", turn_id: "", decision: "allow-once" },
      controller.signal
    );

    expect(vi.mocked(fetch).mock.calls[0][1]?.signal).toBe(controller.signal);
  });

  it("encodes session id in URL", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);

    await approveSession("id with spaces", {
      request_id: "req-1",
      turn_id: "",
      decision: "allow-once",
    });

    expect(vi.mocked(fetch).mock.calls[0][0]).toBe("/api/sessions/id%20with%20spaces/approve");
  });
});
