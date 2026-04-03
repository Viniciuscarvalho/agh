import { createFileRoute } from "@tanstack/react-router";
import { Loader2, AlertCircle } from "lucide-react";

import { useSession } from "@/systems/session/hooks/use-sessions";
import { useSessionChat } from "@/systems/session/hooks/use-session-chat";
import { useSessionStore } from "@/systems/session/stores/session-store";
import { useStopSession, useResumeSession } from "@/systems/session/hooks/use-session-actions";
import { ChatHeader } from "@/systems/session/components/chat-header";
import { ChatView } from "@/systems/session/components/chat-view";
import { MessageComposer } from "@/systems/session/components/message-composer";

export const Route = createFileRoute("/_app/session/$id")({
  component: SessionPage,
});

function SessionPage() {
  const { id } = Route.useParams();
  const { data: session, isLoading, error } = useSession(id);
  const messages = useSessionStore(s => s.messages);
  const isStreaming = useSessionStore(s => s.isStreaming);
  const pendingPermission = useSessionStore(s => s.pendingPermission);

  const { sendMessage, status } = useSessionChat({ sessionId: id });
  const stopMutation = useStopSession();
  const resumeMutation = useResumeSession();

  const isDisabled = isStreaming || status === "submitted" || pendingPermission !== null;

  if (isLoading) {
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
      <MessageComposer onSend={sendMessage} disabled={isDisabled} />
    </div>
  );
}
