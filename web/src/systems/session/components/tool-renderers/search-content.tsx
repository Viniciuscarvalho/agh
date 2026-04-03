import { FileText } from "lucide-react";

import type { UIMessage } from "../../types";

function shortenPath(filePath: string): string {
  const parts = filePath.split("/");
  if (parts.length <= 3) return filePath;
  return parts.slice(-3).join("/");
}

export function SearchContent({ message }: { message: UIMessage }) {
  const pattern = String(message.toolInput?.pattern ?? "");
  const glob = message.toolInput?.glob ? String(message.toolInput.glob) : "";
  const path = message.toolInput?.path ? String(message.toolInput.path) : "";
  const result = message.toolResult;

  const resultText = result?.stdout ?? result?.content ?? "";
  const lines = resultText ? resultText.split("\n").filter(Boolean) : [];

  return (
    <div className="space-y-1.5 text-xs" data-testid="search-content">
      {pattern && (
        <div className="font-mono text-[11px] text-[color:var(--ds-text-muted)]">
          {pattern}
          {glob && <span className="text-[color:var(--ds-text-muted)]/30 ms-1.5">in {glob}</span>}
          {!glob && path && (
            <span className="text-[color:var(--ds-text-muted)]/30 ms-1.5">
              in {shortenPath(path)}
            </span>
          )}
        </div>
      )}
      {lines.length > 0 ? (
        <div className="rounded-md border border-[color:var(--ds-line-subtle)] overflow-hidden">
          {lines.slice(0, 20).map((line, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 px-3 py-1 text-[11px] ${
                i > 0 ? "border-t border-[color:var(--ds-line-subtle)]" : ""
              }`}
            >
              <FileText className="size-3 shrink-0 text-[color:var(--ds-text-muted)]/20" />
              <span className="truncate text-[color:var(--ds-text-muted)] font-mono" title={line}>
                {shortenPath(line)}
              </span>
            </div>
          ))}
          {lines.length > 20 && (
            <div className="px-3 py-1 border-t border-[color:var(--ds-line-subtle)] text-[10px] text-[color:var(--ds-text-muted)]/40">
              +{lines.length - 20} more
            </div>
          )}
        </div>
      ) : result ? (
        <span className="text-[10px] text-[color:var(--ds-text-muted)]/30 italic">No matches</span>
      ) : null}
    </div>
  );
}
