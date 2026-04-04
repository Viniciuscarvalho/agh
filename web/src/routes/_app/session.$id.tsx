import { useCallback, useEffect, useRef } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { useSession } from "@/systems/session/hooks/use-sessions";
import { useSessionChat } from "@/systems/session/hooks/use-session-chat";
import { useSessionHistory } from "@/systems/session/hooks/use-session-history";
import { useSessionStore } from "@/systems/session/stores/session-store";
import { useStopSession, useResumeSession } from "@/systems/session/hooks/use-session-actions";
import { ChatHeader } from "@/systems/session/components/chat-header";
import { ChatView } from "@/systems/session/components/chat-view";
import { MessageComposer } from "@/systems/session/components/message-composer";
import { PermissionPrompt } from "@/systems/session/components/permission-prompt";

export const Route = createFileRoute("/_app/session/$id")({
  component: SessionPage,
});

function SessionPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const prevIdRef = useRef<string | null>(null);

  const { data: session, isLoading, error } = useSession(id);
  const messages = useSessionStore(s => s.messages);
  const isStreaming = useSessionStore(s => s.isStreaming);
  const pendingPermission = useSessionStore(s => s.pendingPermission);
  const activeSessionId = useSessionStore(s => s.activeSessionId);

  const { historyMessages, isLoadingHistory } = useSessionHistory(id);
  const { sendMessage, status } = useSessionChat({ sessionId: id });
  const stopMutation = useStopSession();
  const resumeMutation = useResumeSession();

  // Session switch: initialize store when navigating to a new session
  useEffect(() => {
    if (prevIdRef.current === id) return;
    prevIdRef.current = id;

    // If history is loaded, set the session with history messages
    if (historyMessages) {
      useSessionStore.getState().setActiveSession(id, historyMessages);
    } else if (activeSessionId !== id) {
      // No history yet, just set the active session with empty messages
      useSessionStore.getState().setActiveSession(id, []);
    }
  }, [id, historyMessages, activeSessionId]);

  // Handle 404 — navigate away with toast
  useEffect(() => {
    if (error?.message?.includes("not found")) {
      toast.error("Session not found");
      navigate({ to: "/" });
    }
  }, [error, navigate]);

  const handlePermissionResolved = useCallback(() => {
    useSessionStore.getState().setPendingPermission(null);
  }, []);

  const isDisabled = isStreaming || status === "submitted" || pendingPermission !== null;
  const isStopped = session?.state === "stopped";

  if (isLoading || isLoadingHistory) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-5 animate-spin text-[color:var(--ds-text-muted)]" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-center">
          <AlertCircle className="size-6 text-[color:var(--ds-accent-danger)]" />
          <p className="text-sm text-[color:var(--ds-text-muted)]">
            {error?.message ?? "Session not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ChatHeader
        session={session}
        onStop={() => stopMutation.mutate(id)}
        onResume={() => resumeMutation.mutate(id)}
      />
      <ChatView messages={messages} isStreaming={isStreaming} />
      {pendingPermission && (
        <PermissionPrompt
          permission={pendingPermission}
          sessionId={id}
          onResolved={handlePermissionResolved}
        />
      )}
      {!isStopped && <MessageComposer onSend={sendMessage} disabled={isDisabled} />}
    </div>
  );
}
