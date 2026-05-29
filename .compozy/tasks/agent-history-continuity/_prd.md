# Agent History Continuity PRD

## Overview

Agent history continuity ensures that an existing session conversation remains visible after prompt completion, reload, or reopening the session. The feature is for operators who supervise agents, and for agents that need to inspect prior session context before continuing work.

The current user pain is trust erosion: a conversation can appear empty after work has happened. A misleading empty chat makes the operator doubt whether the agent completed the prompt, whether the session still has usable context, or whether the interface failed. The MVP makes continuity verifiable across Web and CLI surfaces.

## Goals

- Existing session history remains visible after prompt completion, reload, and reopening the same session.
- Web and CLI surfaces present a consistent view of whether session history exists and what the latest visible turn contains.
- A failed history load produces an actionable error with retry and diagnostic direction, never a misleading empty conversation.
- Operators can decide whether it is safe to continue a session without guessing about missing context.
- Agents can inspect the same continuity state outside the Web surface before continuing delegated work.
- Extension-facing product expectations remain clear: history continuity should be observable by runtime participants without relying on Web-only behavior.

## User Stories

- As an operator, I want a completed session to reopen with its previous conversation visible so that I can continue supervising without reconstructing context manually.
- As an operator, I want reloads to preserve visible history so that refreshing the page does not look like data loss.
- As an operator, I want a clear error when history cannot load so that I know whether to retry, inspect diagnostics, or stop the session.
- As an agent, I want a reliable way to inspect prior session history state so that I do not continue work from a false empty context.
- As a maintainer, I want continuity failures to be explicit so that support reports distinguish missing history from display failure.

## Core Features

- Visible continuity after prompt completion: when a prompt finishes, the conversation remains visible in the active session view.
- Visible continuity after reload or reopen: returning to the same session shows the existing conversation instead of resetting to a blank chat.
- Cross-surface continuity confirmation: Web and CLI agree on whether the session has visible history and what the latest visible activity is.
- Truthful empty states: a session with no history may show an empty state, but a session whose history failed to load must show an error state.
- Actionable failure UX: history failures include retry guidance and a diagnostic path that helps the operator determine the next action.
- Agent/operator manageability: the continuity state is inspectable outside the Web surface so agents and operators can make the same decision.

## User Experience

The primary operator flow starts in an existing session. The operator sends a prompt, waits for the agent to complete work, and sees the conversation remain in place. If the operator reloads or reopens the session later, the previous conversation appears without requiring a new prompt.

When history cannot be shown, the interface presents a direct failure state. The message explains that AGH could not load the conversation, offers a retry, and points to diagnostics or session inspection. It must not show the same visual state as a genuinely empty session.

The CLI flow gives an operator or agent a concise way to confirm that the session has history, inspect the latest visible turn, and distinguish "no history" from "history unavailable."

Accessibility expectations match existing AGH runtime surfaces: error states must be readable by assistive technology, retry actions must be keyboard reachable, and the latest history state must not depend on color alone.

## High-Level Technical Constraints

- Session history visibility must preserve workspace and session boundaries.
- Redacted or hidden content must remain protected in every surface.
- The experience must work for active, idle, completed, and failed sessions.
- The MVP must not depend on a Web-only interpretation of history state.

## Non-Goals (Out of Scope)

- Full session repair or reconstruction workflows.
- Conversation export, sharing, or long-term audit reporting.
- Changing agent memory behavior or provider conversation semantics.
- Multi-session merge or cross-session history search.
- New marketplace, extension, or agent packaging behavior.

## Phased Rollout Plan

### MVP (Phase 1)

- Preserve visible history after prompt completion, reload, and reopen.
- Show a distinct failure state when history cannot load.
- Provide Web and CLI confirmation of the same continuity state.
- Success criteria: a user can complete a prompt, reload, reopen, and confirm the previous conversation without seeing a misleading empty chat.

### Phase 2

- Add richer diagnostics that explain why continuity failed and whether the session can continue safely.
- Improve operator guidance for partially available history.
- Success criteria: support reports include enough user-visible evidence to classify continuity failures quickly.

### Phase 3

- Add broader continuity tooling such as history health summaries and guided recovery entry points.
- Success criteria: operators can move from continuity detection to recovery decisions without leaving the AGH workflow.

## Success Metrics

- Zero known cases where a session with existing history renders as a normal empty chat.
- Web and CLI continuity checks agree for the same session in acceptance scenarios.
- History load failures include a retry or diagnostic next step in every affected surface.
- Operators can reopen a completed session and identify the latest visible turn within one interaction.
- Agent-facing inspection can distinguish no history from unavailable history.

## Risks and Mitigations

- Risk: Users may interpret diagnostics as a promise of automatic repair. Mitigation: keep MVP copy focused on visibility, retry, and inspection.
- Risk: Empty states become visually noisy. Mitigation: only show failure treatment when AGH cannot verify history availability.
- Risk: Agent and operator expectations diverge. Mitigation: define continuity as a shared product state across Web and CLI.
- Risk: Workspace boundaries are misunderstood during inspection. Mitigation: require continuity views to remain scoped to the selected workspace and session.

## Architecture Decision Records

- [ADR-001: Verifiable Agent History Continuity](adrs/adr-001.md) — Selects a continuity approach that requires visible, cross-surface proof instead of Web-only restoration.

## Open Questions

- What default amount of prior conversation should be visible when a long session is reopened?
- Should the CLI surface summarize continuity by default or require an explicit inspection command?
- Which diagnostic labels should be user-facing versus support-facing?
- Should Phase 2 include guided repair, or only classify recovery options?
