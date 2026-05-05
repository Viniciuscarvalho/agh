Goal (incl. success criteria):

- Inspect `.resources/claude-code` and report how execution modes/profiles/roles are selected, layered, inherited, or overridden, with evidence and exact files/functions.

Constraints/Assumptions:

- Local repo only; no web needed.
- Do not touch unrelated worktree files.
- Focus on prompt assembly, agent selection, teammate/subagent inheritance, and background/notification handling.

Key decisions:

- Treat `constants/prompts.ts` + `utils/systemPrompt.ts` as the main prompt-layering sources.
- Treat `main.tsx`, `tools/AgentTool/AgentTool.tsx`, and `utils/swarm/*` as the runtime-selection/inheritance sources.

State:

- Evidence gathered from prompt files, settings schema/UI, agent registry, teammate spawn code, and notification/task code.

Done:

- Located system prompt layering and mode-specific prompt variants.
- Located user-config and runtime-context selectors for agent / assistant / proactive / teammate / auto modes.
- Located background task / task-notification handling.

Now:

- Synthesize concise evidence-based findings with file/function references.

Next:

- If needed, verify any line numbers or drill into a narrow file again.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.resources/claude-code/utils/systemPrompt.ts`
- `.resources/claude-code/constants/prompts.ts`
- `.resources/claude-code/main.tsx`
- `.resources/claude-code/tools/AgentTool/AgentTool.tsx`
- `.resources/claude-code/tools/AgentTool/loadAgentsDir.ts`
- `.resources/claude-code/utils/swarm/inProcessRunner.ts`
- `.resources/claude-code/utils/swarm/backends/teammateModeSnapshot.ts`
- `.resources/claude-code/utils/swarm/spawnUtils.ts`
- `.resources/claude-code/tasks/LocalAgentTask/LocalAgentTask.tsx`
- `.resources/claude-code/coordinator/coordinatorMode.ts`
