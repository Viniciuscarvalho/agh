import { expect, type Page } from "@playwright/test";

export async function reloadDaemonServedPage(
  page: Page,
  runtime: { url(pathname?: string): string },
  pathname: string
): Promise<void> {
  const targetURL = runtime.url(pathname);

  await expect
    .poll(
      async () => {
        try {
          await page.goto(targetURL, {
            waitUntil: "domcontentloaded",
            timeout: 2_000,
          });
          return new URL(page.url()).pathname;
        } catch {
          return "";
        }
      },
      {
        timeout: 45_000,
        intervals: [250, 500, 1_000, 2_000],
      }
    )
    .toBe(pathname);
}
