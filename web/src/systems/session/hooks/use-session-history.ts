import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { sessionHistoryOptions } from "../lib/query-options";
import { mapHistoryToMessages } from "../lib/event-mapper";
import type { UIMessage } from "../types";

export interface UseSessionHistoryReturn {
  historyMessages: UIMessage[] | undefined;
  isLoadingHistory: boolean;
  error: Error | null;
}

/**
 * Hook that fetches session history (turns + events) and transforms them
 * into UIMessage[] for rendering in the chat view. History messages are
 * rendered statically (isStreaming: false) with no animation.
 */
export function useSessionHistory(sessionId: string): UseSessionHistoryReturn {
  const { data: history, isLoading, error } = useQuery(sessionHistoryOptions(sessionId));

  const historyMessages = useMemo(() => {
    if (!history) return undefined;
    return mapHistoryToMessages(history);
  }, [history]);

  return {
    historyMessages,
    isLoadingHistory: isLoading,
    error: error as Error | null,
  };
}
