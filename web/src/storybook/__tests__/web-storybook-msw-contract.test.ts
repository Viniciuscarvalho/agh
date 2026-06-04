import type { HttpHandler } from "msw";
import { describe, expect, it } from "vitest";

const { storybookSystemHandlerGroups, storybookSystemHandlers } =
  await import("../../../.storybook/preview");
const { flattenStorybookHandlerGroups } = await import("../msw");

function handlerSignature(handler: HttpHandler) {
  const method = String(handler.info.method);
  const path = String(handler.info.path);
  return `${method} ${path}`;
}

describe("web Storybook MSW contract", () => {
  it("exposes default Storybook system handlers", () => {
    expect(storybookSystemHandlers.length).toBeGreaterThan(0);
    expect(flattenStorybookHandlerGroups(storybookSystemHandlerGroups).length).toBe(
      storybookSystemHandlers.length
    );
  });

  it("does not register duplicate method/path handler pairs across the combined system set", () => {
    const signatures = storybookSystemHandlers.map(handlerSignature);
    const uniqueSignatures = new Set(signatures);

    expect(uniqueSignatures.size).toBe(signatures.length);
  });

  it("registers the onboarding status handler required by app route stories", () => {
    const signatures = storybookSystemHandlers.map(handlerSignature);

    expect(signatures).toContain("GET /api/onboarding");
  });
});
