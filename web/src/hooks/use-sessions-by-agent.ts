import { useMemo } from "react";

import type { SessionPayload } from "@/systems/session";

type SessionsByAgent = Record<string, SessionPayload[]>;

function useSessionsByAgent(sessions: SessionPayload[] | undefined): SessionsByAgent {
  return useMemo(() => {
    const grouped: SessionsByAgent = {};
    if (!sessions) {
      return grouped;
    }

    for (const session of sessions) {
      const key = session.agent_name;
      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(session);
    }

    for (const key of Object.keys(grouped)) {
      grouped[key].sort(
        (left, right) => new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime()
      );
    }

    return grouped;
  }, [sessions]);
}

export { useSessionsByAgent };
