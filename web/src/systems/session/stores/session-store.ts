import type { StateCreator } from "zustand";
import type { PermissionRequest, UIMessage } from "../types";

export interface SessionState {
  activeSessionId: string | null;
  messages: UIMessage[];
  isStreaming: boolean;
  pendingPermission: PermissionRequest | null;
}

export interface SessionActions {
  setActiveSession: (id: string, messages: UIMessage[]) => void;
  appendMessage: (msg: UIMessage) => void;
  updateLastMessage: (partial: Partial<UIMessage>) => void;
  setPendingPermission: (req: PermissionRequest | null) => void;
  clearSession: () => void;
}

export type SessionStore = SessionState & SessionActions;

export const initialSessionState: SessionState = {
  activeSessionId: null,
  messages: [],
  isStreaming: false,
  pendingPermission: null,
};

export const createSessionStore: StateCreator<SessionStore> = set => ({
  ...initialSessionState,

  setActiveSession: (id, messages) =>
    set({
      activeSessionId: id,
      messages,
      isStreaming: false,
      pendingPermission: null,
    }),

  appendMessage: msg => set(state => ({ messages: [...state.messages, msg] })),

  updateLastMessage: partial =>
    set(state => {
      const lastMessage = state.messages.at(-1);
      if (!lastMessage) {
        return state;
      }

      return {
        messages: [...state.messages.slice(0, -1), { ...lastMessage, ...partial }],
      };
    }),

  setPendingPermission: pendingPermission => set({ pendingPermission }),

  clearSession: () => set(initialSessionState),
});
