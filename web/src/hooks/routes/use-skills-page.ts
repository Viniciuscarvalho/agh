import { useMemo, useState } from "react";

import {
  useDisableSkill,
  useEnableSkill,
  useSkill,
  useSkillContent,
  useSkills,
} from "@/systems/skill";
import { useActiveWorkspace } from "@/systems/workspace";

type Tab = "installed" | "marketplace";

function useSkillsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("installed");
  const [selectedSkillName, setSelectedSkillName] = useState<string | null>(null);
  const [requestedSkillContentName, setRequestedSkillContentName] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { activeWorkspaceId } = useActiveWorkspace();
  const workspaceId = activeWorkspaceId ?? "";

  const { data: skills, isLoading, error } = useSkills(workspaceId);
  const {
    data: selectedSkill,
    isLoading: isLoadingDetail,
    error: detailError,
  } = useSkill(selectedSkillName ?? "", workspaceId);

  const disableMutation = useDisableSkill();
  const enableMutation = useEnableSkill();

  const installedSkillNames = useMemo(() => {
    if (!skills) {
      return new Set<string>();
    }

    return new Set(skills.map(skill => skill.name));
  }, [skills]);

  const effectiveSelectedName = useMemo(() => {
    if (selectedSkillName && skills?.some(skill => skill.name === selectedSkillName)) {
      return selectedSkillName;
    }

    return skills?.[0]?.name ?? null;
  }, [selectedSkillName, skills]);

  const shouldLoadSelectedContent =
    effectiveSelectedName !== null && requestedSkillContentName === effectiveSelectedName;

  const {
    data: selectedSkillContent,
    isLoading: isLoadingContent,
    error: contentError,
    refetch: refetchSkillContent,
  } = useSkillContent(effectiveSelectedName ?? "", workspaceId, shouldLoadSelectedContent);

  const handleDisable = (name: string) => {
    disableMutation.mutate({ name, workspace: workspaceId });
  };

  const handleEnable = (name: string) => {
    enableMutation.mutate({ name, workspace: workspaceId });
  };

  const handleViewContent = (name: string) => {
    setRequestedSkillContentName(name);
  };

  const handleRetryContent = () => {
    void refetchSkillContent();
  };

  return {
    activeTab,
    contentError: shouldLoadSelectedContent ? contentError : null,
    detailError,
    effectiveSelectedName,
    error,
    handleDisable,
    handleEnable,
    handleRetryContent,
    handleViewContent,
    installedSkillNames,
    isActionPending: disableMutation.isPending || enableMutation.isPending,
    isContentLoading: shouldLoadSelectedContent && isLoadingContent,
    isLoading,
    isLoadingDetail: isLoadingDetail && effectiveSelectedName !== null,
    searchQuery,
    selectedSkill: effectiveSelectedName
      ? (selectedSkill ?? skills?.find(skill => skill.name === effectiveSelectedName))
      : undefined,
    selectedSkillContent: shouldLoadSelectedContent ? selectedSkillContent : undefined,
    setActiveTab,
    setSearchQuery,
    setSelectedSkillName,
    skillCount: skills?.length ?? 0,
    skills: skills ?? [],
  };
}

export { useSkillsPage };
