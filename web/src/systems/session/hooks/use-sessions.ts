import { useQuery } from "@tanstack/react-query";

import { sessionDetailOptions, sessionsListOptions } from "../lib/query-options";

export function useSessions() {
  return useQuery(sessionsListOptions());
}

export function useSession(id: string) {
  return useQuery(sessionDetailOptions(id));
}
