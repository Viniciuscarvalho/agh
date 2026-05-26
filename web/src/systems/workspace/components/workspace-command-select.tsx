import { useMemo, useState } from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  cn,
  CommandEmpty,
  CommandItem,
  CommandList,
  CommandSelect,
  CommandSelectGroup,
  CommandSelectShell,
  CommandSelectTrigger,
  CommandSeparator,
} from "@agh/ui";

import type { WorkspacePayload } from "../types";

function workspaceInitial(name: string): string {
  return name.charAt(0).toUpperCase() || "·";
}

export interface WorkspaceCommandSelectProps {
  workspaces: WorkspacePayload[] | undefined;
  value: string | null;
  onChange: (id: string) => void;
  onAddWorkspace?: () => void;
  disabled?: boolean;
  className?: string;
  triggerTestId?: string;
  testIdPrefix?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function WorkspaceCommandSelect({
  workspaces,
  value,
  onChange,
  onAddWorkspace,
  disabled,
  className,
  triggerTestId = "workspace-switcher",
  testIdPrefix = "workspace-command",
  open: openProp,
  onOpenChange,
}: WorkspaceCommandSelectProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = openProp ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;
  const selected = useMemo(
    () => workspaces?.find(workspace => workspace.id === value) ?? null,
    [workspaces, value]
  );
  const label = selected?.name ?? "No workspace";
  const initial = workspaceInitial(label);
  const hasWorkspaces = (workspaces?.length ?? 0) > 0;
  const isDisabled = disabled || !hasWorkspaces;

  const handleSelect = (workspace: WorkspacePayload) => {
    onChange(workspace.id);
    setOpen(false);
  };

  const handleAddWorkspace = () => {
    onAddWorkspace?.();
    setOpen(false);
  };

  return (
    <CommandSelect open={open} onOpenChange={next => setOpen(next)}>
      <CommandSelectTrigger
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={hasWorkspaces ? `Workspace: ${label}` : "No workspace"}
        data-testid={triggerTestId}
        disabled={isDisabled}
        selected={Boolean(selected)}
        className={cn(
          "h-12 w-full gap-2.5 border-0 bg-transparent px-2 py-0 shadow-none hover:bg-hover focus-visible:border-0 focus-visible:shadow-none [&>svg:last-child]:hidden",
          className
        )}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2.5 text-left">
          <span
            aria-hidden="true"
            data-testid="workspace-switcher-avatar"
            className="inline-flex size-button-icon-xs shrink-0 items-center justify-center rounded-sm bg-elevated font-mono text-eyebrow font-medium tracking-mono text-fg"
          >
            {initial}
          </span>
          <span
            data-testid="workspace-switcher-name"
            className="min-w-0 flex-1 truncate text-small-body font-medium tracking-tight text-fg"
          >
            {label}
          </span>
          <ChevronsUpDown
            aria-hidden="true"
            data-testid="workspace-switcher-chevron"
            className="size-3 shrink-0 text-subtle"
          />
        </span>
      </CommandSelectTrigger>
      <CommandSelectShell
        className="min-w-64"
        inputPlaceholder="Search workspaces..."
        inputProps={{ "data-testid": `${testIdPrefix}-input` }}
      >
        <CommandList>
          <CommandEmpty data-testid={`${testIdPrefix}-empty`}>
            No workspaces match your search.
          </CommandEmpty>
          <CommandSelectGroup heading="Workspaces" data-testid={`${testIdPrefix}-group`}>
            {workspaces?.map(workspace => {
              const isActive = workspace.id === value;
              return (
                <CommandItem
                  key={workspace.id}
                  value={workspace.name}
                  onSelect={() => handleSelect(workspace)}
                  data-checked={isActive ? "true" : "false"}
                  data-testid={`${testIdPrefix}-item-${workspace.id}`}
                >
                  <span
                    aria-hidden="true"
                    className="inline-flex size-button-icon-xs shrink-0 items-center justify-center rounded-sm bg-elevated font-mono text-eyebrow font-medium tracking-mono text-fg"
                  >
                    {workspaceInitial(workspace.name)}
                  </span>
                  <span className="truncate text-small-body text-fg">{workspace.name}</span>
                </CommandItem>
              );
            })}
          </CommandSelectGroup>
          {onAddWorkspace ? (
            <>
              <CommandSeparator />
              <CommandSelectGroup>
                <CommandItem
                  value="add workspace"
                  onSelect={handleAddWorkspace}
                  data-testid={`${testIdPrefix}-add`}
                >
                  <Plus aria-hidden="true" className="size-4 shrink-0 text-subtle" />
                  <span className="text-small-body text-fg">Add workspace</span>
                </CommandItem>
              </CommandSelectGroup>
            </>
          ) : null}
        </CommandList>
      </CommandSelectShell>
    </CommandSelect>
  );
}
