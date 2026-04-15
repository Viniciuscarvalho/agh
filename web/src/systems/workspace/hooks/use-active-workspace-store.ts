import { create } from "zustand";
import {
  createActiveWorkspaceStore,
  type ActiveWorkspaceStore,
} from "../stores/active-workspace-store";

export const useActiveWorkspaceStore = create<ActiveWorkspaceStore>(createActiveWorkspaceStore);
