import { create } from "zustand";

import type { SidebarStore } from "@/stores/sidebar-store";

const useSidebarStore = create<SidebarStore>(set => ({
  collapsed: false,

  toggle: () => set(state => ({ collapsed: !state.collapsed })),
  setCollapsed: (collapsed: boolean) => set({ collapsed }),
}));

export { useSidebarStore };
