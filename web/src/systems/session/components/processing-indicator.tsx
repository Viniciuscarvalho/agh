import { Loader2 } from "lucide-react";

export interface ProcessingIndicatorProps {
  className?: string;
}

export function ProcessingIndicator({ className }: ProcessingIndicatorProps) {
  return (
    <div className={className} data-testid="processing-indicator">
      <div className="flex items-center gap-2 px-4 py-3">
        <Loader2 className="size-3.5 animate-spin text-[color:var(--ds-text-muted)]" />
        <span className="text-xs italic text-[color:var(--ds-text-muted)]">Thinking...</span>
      </div>
    </div>
  );
}
