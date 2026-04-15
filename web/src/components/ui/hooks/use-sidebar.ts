import * as React from "react";

type SidebarOpenState = "expanded" | "collapsed";
type SidebarOpenSetter = React.Dispatch<React.SetStateAction<boolean>>;

export interface SidebarContextProps {
  state: SidebarOpenState;
  open: boolean;
  setOpen: SidebarOpenSetter;
  openMobile: boolean;
  setOpenMobile: SidebarOpenSetter;
  isMobile: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

export { SidebarContext, useSidebar };
