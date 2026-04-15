import { useMemo, useState } from "react";

import { useDeleteMemory, useMemories, useMemory } from "@/systems/knowledge";
import type { MemoryScope } from "@/systems/knowledge/types";
import { useActiveWorkspace } from "@/systems/workspace";

type Tab = "all" | "global" | "workspace";

function deriveScope(filename: string): Exclude<MemoryScope, undefined> {
  if (filename.startsWith("workspace/") || filename.startsWith("ws/")) {
    return "workspace";
  }

  return "global";
}

function formatDreamStatus(lastConsolidation?: string): string {
  if (!lastConsolidation) {
    return "Dream: status unavailable";
  }

  try {
    const date = new Date(lastConsolidation);
    const diffMs = Date.now() - date.getTime();
    const diffH = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffH < 1) {
      return "Dream: <1h ago";
    }

    if (diffH < 24) {
      return `Dream: ${diffH}h ago`;
    }

    const diffD = Math.floor(diffH / 24);
    return `Dream: ${diffD}d ago`;
  } catch {
    return "Dream: unknown";
  }
}

function useKnowledgePage() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [selectedFilename, setSelectedFilename] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { activeWorkspaceId } = useActiveWorkspace();
  const scopeFilter = activeTab === "all" ? undefined : activeTab;

  const {
    data: memories,
    isLoading,
    error,
  } = useMemories(scopeFilter, activeWorkspaceId || undefined);
  const deleteMutation = useDeleteMemory();

  const effectiveSelectedFilename = useMemo(() => {
    if (selectedFilename && memories?.some(memory => memory.filename === selectedFilename)) {
      return selectedFilename;
    }

    return memories?.[0]?.filename ?? null;
  }, [selectedFilename, memories]);

  const selectedMemory = useMemo(
    () => memories?.find(memory => memory.filename === effectiveSelectedFilename),
    [memories, effectiveSelectedFilename]
  );

  const selectedScope = effectiveSelectedFilename
    ? deriveScope(effectiveSelectedFilename)
    : undefined;
  const {
    data: selectedContent,
    isLoading: isContentLoading,
    error: contentError,
  } = useMemory(selectedScope, effectiveSelectedFilename ?? "", activeWorkspaceId || undefined);

  const handleDelete = (filename: string) => {
    if (!selectedScope) {
      return;
    }

    deleteMutation.mutate({
      scope: selectedScope,
      filename,
      workspace: activeWorkspaceId || undefined,
    });
  };

  return {
    activeTab,
    contentError,
    dreamStatusLabel: formatDreamStatus(),
    effectiveSelectedFilename,
    error,
    handleDelete,
    isContentLoading: isContentLoading && effectiveSelectedFilename !== null,
    isDeletePending: deleteMutation.isPending,
    isLoading,
    memoryCount: memories?.length ?? 0,
    memories: memories ?? [],
    searchQuery,
    selectedContent,
    selectedMemory,
    selectedScope,
    setActiveTab,
    setSearchQuery,
    setSelectedFilename,
  };
}

export { useKnowledgePage };
