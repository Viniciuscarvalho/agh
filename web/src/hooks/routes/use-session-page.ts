import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { useSessionChat } from "@/systems/session/hooks/use-session-chat";
import { useResumeSession, useStopSession } from "@/systems/session/hooks/use-session-actions";
import { useSessionStore } from "@/systems/session/hooks/use-session-store";
import { useSessionTranscript } from "@/systems/session/hooks/use-session-transcript";
import { useSession } from "@/systems/session/hooks/use-sessions";
import { useWorkspaces } from "@/systems/workspace";

function useSessionPage(id: string) {
  const navigate = useNavigate();
  const hydratedSessionIdRef = useRef<string | null>(null);

  const { data: session, isLoading, error } = useSession(id);
  const { data: workspaces } = useWorkspaces();
  const messages = useSessionStore(state => state.messages);
  const isStreaming = useSessionStore(state => state.isStreaming);
  const pendingPermission = useSessionStore(state => state.pendingPermission);
  const activeSessionId = useSessionStore(state => state.activeSessionId);

  const {
    transcriptMessages,
    isLoadingTranscript,
    error: transcriptError,
  } = useSessionTranscript(id);
  const canPrompt = session?.state === "active";
  const { sendMessage, status } = useSessionChat({ sessionId: id });
  const stopMutation = useStopSession();
  const resumeMutation = useResumeSession();

  useEffect(() => {
    hydratedSessionIdRef.current = null;
    useSessionStore.setState({
      activeSessionId: id,
      isStreaming: false,
      messages: [],
      pendingPermission: null,
    });
  }, [id]);

  useEffect(() => {
    if (!transcriptMessages || activeSessionId !== id || hydratedSessionIdRef.current === id) {
      return;
    }

    useSessionStore.getState().setActiveSession(id, transcriptMessages);
    hydratedSessionIdRef.current = id;
  }, [activeSessionId, id, transcriptMessages]);

  useEffect(() => {
    if (error?.message?.includes("not found")) {
      toast.error("Session not found");
      navigate({ to: "/" });
    }
  }, [error, navigate]);

  const handlePermissionResolved = useCallback(() => {
    useSessionStore.getState().setPendingPermission(null);
  }, []);

  const handleResume = useCallback(() => {
    resumeMutation.mutate(id);
  }, [id, resumeMutation]);

  const handleStop = useCallback(() => {
    stopMutation.mutate(id);
  }, [id, stopMutation]);

  const workspaceName = workspaces?.find(workspace => workspace.id === session?.workspace_id)?.name;
  const isDisabled =
    !canPrompt || isStreaming || status === "submitted" || pendingPermission !== null;

  return {
    canPrompt,
    fatalErrorMessage: error?.message ?? transcriptError?.message ?? "Session not found",
    handlePermissionResolved,
    handleResume,
    handleStop,
    isDisabled,
    isLoading: isLoading || isLoadingTranscript,
    isStreaming,
    messages,
    pendingPermission,
    sendMessage,
    session,
    workspaceName,
  };
}

export { useSessionPage };
