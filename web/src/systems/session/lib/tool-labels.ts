import {
  Terminal,
  FileText,
  FileEdit,
  Search,
  FolderSearch,
  Globe,
  Bot,
  Wrench,
  ListChecks,
  Lightbulb,
  Map,
  MessageCircleQuestion,
  PackageSearch,
  Sparkles,
  NotebookPen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// --- Tool Icons ---

const TOOL_ICONS: Record<string, LucideIcon> = {
  Bash: Terminal,
  Read: FileText,
  Write: FileEdit,
  Edit: FileEdit,
  Grep: Search,
  Glob: FolderSearch,
  WebSearch: Globe,
  WebFetch: Globe,
  Task: Bot,
  Agent: Bot,
  Think: Lightbulb,
  TodoWrite: ListChecks,
  NotebookEdit: NotebookPen,
  EnterPlanMode: Lightbulb,
  ExitPlanMode: Map,
  AskUserQuestion: MessageCircleQuestion,
  ToolSearch: PackageSearch,
  Skill: Sparkles,
};

export function getToolIcon(toolName: string): LucideIcon {
  return TOOL_ICONS[toolName] ?? Wrench;
}

// --- Tool Labels ---

export type ToolLabelTense = "active" | "past" | "failure";

interface ToolLabels {
  active: string;
  past: string;
  failure: string;
}

const TOOL_LABELS: Record<string, ToolLabels> = {
  Bash: { active: "Running...", past: "Ran command", failure: "run command" },
  Read: { active: "Reading...", past: "Read file", failure: "read file" },
  Write: { active: "Writing...", past: "Wrote file", failure: "write file" },
  Edit: { active: "Editing...", past: "Edited file", failure: "edit file" },
  Grep: { active: "Searching...", past: "Searched content", failure: "search content" },
  Glob: { active: "Finding files...", past: "Found files", failure: "find files" },
  WebSearch: { active: "Searching web...", past: "Searched web", failure: "search web" },
  WebFetch: { active: "Fetching page...", past: "Fetched page", failure: "fetch page" },
  Task: { active: "Running task...", past: "Ran task", failure: "run task" },
  Agent: { active: "Running agent...", past: "Ran agent", failure: "run agent" },
  Think: { active: "Thinking...", past: "Thought", failure: "think" },
  TodoWrite: { active: "Updating tasks...", past: "Updated tasks", failure: "update tasks" },
  NotebookEdit: {
    active: "Editing notebook...",
    past: "Edited notebook",
    failure: "edit notebook",
  },
  EnterPlanMode: {
    active: "Entering plan mode...",
    past: "Entered plan mode",
    failure: "enter plan mode",
  },
  ExitPlanMode: {
    active: "Preparing plan...",
    past: "Presented plan",
    failure: "prepare plan",
  },
  AskUserQuestion: { active: "Asking...", past: "Asked question", failure: "ask question" },
  ToolSearch: { active: "Loading tools...", past: "Loaded tools", failure: "load tools" },
  Skill: { active: "Loading skill...", past: "Loaded skill", failure: "load skill" },
};

export function getToolLabel(toolName: string, tense: ToolLabelTense): string {
  const labels = TOOL_LABELS[toolName];
  if (labels) return labels[tense];

  // Fallback for unknown tools
  switch (tense) {
    case "active":
      return `Running ${toolName}...`;
    case "past":
      return `Used ${toolName}`;
    case "failure":
      return `use ${toolName}`;
  }
}

// --- Compact Summary Extractors ---

/**
 * Extract a short summary string from tool input for display in collapsed tool cards.
 * Returns undefined if no meaningful summary can be extracted.
 */
export function getToolCompactSummary(
  toolName: string,
  toolInput?: Record<string, unknown>
): string | undefined {
  if (!toolInput) return undefined;

  switch (toolName) {
    case "Bash":
      return truncate(String(toolInput.command ?? ""), 80);
    case "Read":
      return truncate(String(toolInput.file_path ?? toolInput.filePath ?? ""), 60);
    case "Write":
      return truncate(String(toolInput.file_path ?? toolInput.filePath ?? ""), 60);
    case "Edit":
      return truncate(String(toolInput.file_path ?? toolInput.filePath ?? ""), 60);
    case "Grep":
      return truncate(String(toolInput.pattern ?? ""), 60);
    case "Glob":
      return truncate(String(toolInput.pattern ?? ""), 60);
    case "WebSearch":
      return truncate(String(toolInput.query ?? ""), 60);
    case "WebFetch":
      return truncate(String(toolInput.url ?? ""), 60);
    default:
      return undefined;
  }
}

function truncate(str: string, maxLen: number): string {
  if (!str) return "";
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1) + "\u2026";
}
