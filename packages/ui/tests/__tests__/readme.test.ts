import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { describe, expect, it } from "vitest";

const PACKAGE_ROOT = resolve(__dirname, "../..");
const README_PATH = resolve(PACKAGE_ROOT, "README.md");

const README_CONTENT = readFileSync(README_PATH, "utf8");

function collectMarkdownLinks(markdown: string): Array<{ label: string; target: string }> {
  const results: Array<{ label: string; target: string }> = [];
  // Markdown link syntax: [label](target) — skip images, code fences, and inline code.
  const linkPattern = /(?<!!)\[([^\]\n]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let insideCodeFence = false;
  for (const rawLine of markdown.split("\n")) {
    if (rawLine.startsWith("```")) {
      insideCodeFence = !insideCodeFence;
      continue;
    }
    if (insideCodeFence) continue;
    const stripped = rawLine.replace(/`[^`\n]*`/g, "");
    let match: RegExpExecArray | null;
    linkPattern.lastIndex = 0;
    while ((match = linkPattern.exec(stripped)) !== null) {
      results.push({ label: match[1], target: match[2] });
    }
  }
  return results;
}

describe("packages/ui README", () => {
  it("resolves every relative markdown link", () => {
    const readmeDir = dirname(README_PATH);
    const links = collectMarkdownLinks(README_CONTENT);
    expect(links.length).toBeGreaterThan(0);

    const broken: string[] = [];
    for (const { target } of links) {
      // Skip http(s), mailto, and pure anchor links.
      if (/^(https?:|mailto:|tel:)/.test(target)) continue;
      if (target.startsWith("#")) continue;
      const [rawPath] = target.split("#");
      if (!rawPath) continue;
      const absolute = resolve(readmeDir, rawPath);
      if (!existsSync(absolute)) {
        broken.push(`${target} → ${absolute}`);
      }
    }
    expect(broken).toEqual([]);
  });
});
