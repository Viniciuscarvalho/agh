import { AlertCircle, Loader2, Wrench } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { PillButton } from "@/components/design-system";
import { useSkillsPage } from "@/hooks/routes/use-skills-page";
import { MarketplaceView, SkillDetailPanel, SkillListPanel } from "@/systems/skill";
import { WorkspacePageShell } from "@/systems/workspace/components/workspace-page-shell";

export const Route = createFileRoute("/_app/skills")({
  component: SkillsPage,
});

function SkillsPage() {
  const page = useSkillsPage();

  if (page.isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center" data-testid="skills-loading">
        <Loader2 className="size-5 animate-spin text-[color:var(--color-text-tertiary)]" />
      </div>
    );
  }

  if (page.error) {
    return (
      <div className="flex flex-1 items-center justify-center" data-testid="skills-error">
        <div className="flex flex-col items-center gap-2 text-center">
          <AlertCircle className="size-6 text-[color:var(--color-danger)]" />
          <p className="text-sm text-[color:var(--color-text-tertiary)]">
            {page.error.message ?? "Failed to load skills"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <WorkspacePageShell
      title="Skills"
      icon={<Wrench className="size-4" />}
      count={page.skillCount}
      controls={
        <div className="flex items-center gap-1.5" data-testid="tab-pills">
          <PillButton
            active={page.activeTab === "installed"}
            data-testid="tab-installed"
            onClick={() => page.setActiveTab("installed")}
          >
            INSTALLED
          </PillButton>
          <PillButton
            active={page.activeTab === "marketplace"}
            data-testid="tab-marketplace"
            onClick={() => page.setActiveTab("marketplace")}
          >
            MARKETPLACE
          </PillButton>
        </div>
      }
    >
      {page.activeTab === "installed" ? (
        <>
          <SkillListPanel
            skills={page.skills}
            selectedSkillName={page.effectiveSelectedName}
            onSelectSkill={page.setSelectedSkillName}
            searchQuery={page.searchQuery}
            onSearchChange={page.setSearchQuery}
          />
          <SkillDetailPanel
            skill={page.selectedSkill}
            isLoading={page.isLoadingDetail}
            error={page.detailError}
            content={page.selectedSkillContent}
            isContentLoading={page.isContentLoading}
            contentError={page.contentError}
            onViewContent={page.handleViewContent}
            onRetryContent={page.handleRetryContent}
            onDisable={page.handleDisable}
            onEnable={page.handleEnable}
            isActionPending={page.isActionPending}
          />
        </>
      ) : (
        <MarketplaceView
          skills={page.skills}
          installedSkillNames={page.installedSkillNames}
          installUnavailableReason="Marketplace install is not implemented yet"
          isInstalling={false}
        />
      )}
    </WorkspacePageShell>
  );
}
