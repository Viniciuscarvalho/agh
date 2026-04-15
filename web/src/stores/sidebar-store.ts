export interface SidebarState {
  collapsed: boolean;
}

export interface SidebarActions {
  toggle: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export type SidebarStore = SidebarState & SidebarActions;

export { useSidebarStore } from "@/hooks/use-sidebar-store";
