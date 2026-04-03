import { create } from "zustand";
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

export const useSessionStore = create<SessionStore>(set => ({
  activeSessionId: null,
  messages: [],
  isStreaming: false,
  pendingPermission: null,

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
      const msgs = state.messages;
      if (msgs.length === 0) return state;
      const last = msgs[msgs.length - 1];
      return {
        messages: [...msgs.slice(0, -1), { ...last, ...partial }],
      };
    }),

  setPendingPermission: req => set({ pendingPermission: req }),

  clearSession: () =>
    set({
      activeSessionId: null,
      messages: [],
      isStreaming: false,
      pendingPermission: null,
    }),
}));
