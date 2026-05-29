# Skills Marketplace Install Verification PRD

## Overview

Skills marketplace install verification ensures that "installed" means visible and usable. The feature is for operators who install skills from the marketplace, agents that need to discover available skills before acting, and maintainers who need trustworthy install diagnostics.

The current user pain is a false success path: a marketplace action can appear complete while the installed skill is not clearly visible, not selectable where expected, or not discoverable by an agent. The MVP makes installation a verified product state across Web, CLI, and agent discovery surfaces.

## Goals

- A marketplace install is successful only when the installed skill is visible and usable by eligible agents.
- Web, CLI, and agent discovery surfaces report a consistent installed state.
- Failed or incomplete installs show a clear reason and next step, with no false success message.
- Operators can verify installation without manually inspecting local artifacts.
- Agents can discover newly installed skills through the same product expectation used by operators.
- Extension ecosystem expectations remain explicit: installed marketplace skills should participate in the normal skill availability model once verified.

## User Stories

- As an operator, I want the marketplace to confirm install success only after the skill appears in installed skills so that I can trust the result.
- As an operator, I want a failed install to explain what blocked usability so that I know the next action.
- As an operator, I want CLI verification of installed marketplace skills so that I can automate or diagnose setup outside the Web surface.
- As an agent, I want newly installed eligible skills to appear in discovery so that I can use them in the next turn.
- As a maintainer, I want install reports to distinguish download success from verified usability so that support can triage marketplace failures.

## Core Features

- Verified install success: the success state requires the skill to be visible in installed skills and available to eligible agents.
- Cross-surface state agreement: Web, CLI, and agent discovery present the same installed, unavailable, or failed state.
- Clear failure reasons: incomplete installation tells the user whether the next step is retry, permission review, marketplace source review, or diagnostic inspection.
- No false success: AGH must not show a successful install message when usability has not been verified.
- Agent/operator manageability: operators and agents can inspect the installed state without relying on a Web-only confirmation.
- Marketplace provenance clarity: marketplace-installed skills remain distinguishable from bundled or manually provided skills where the product already exposes source context.

## User Experience

The primary operator flow starts in the marketplace. The operator searches for a skill, chooses install, and waits for AGH to verify that the skill is now present in installed skills and available for eligible agent use. Only then does the Web surface show install success.

If verification fails, the operator sees a failure state that names the reason in plain language and gives one next action. The next action may be retrying the install, reviewing permissions, checking the marketplace source, or opening diagnostics.

The CLI flow gives operators a direct way to confirm whether a marketplace skill is installed, unavailable, or failed verification. The agent discovery flow must reflect the same state before the agent is expected to use the skill.

Accessibility expectations match existing AGH runtime surfaces: install progress, success, and failure states must be readable by assistive technology, actionable controls must be keyboard reachable, and state must not depend on color alone.

## High-Level Technical Constraints

- Verification must respect workspace, agent, and global skill visibility rules.
- Verification must not expose private local paths or sensitive marketplace details beyond what the product already permits.
- The MVP must work when installation is triggered from Web or CLI.
- Agent discovery must not advertise an installed skill before AGH has verified usability for that agent context.

## Non-Goals (Out of Scope)

- A full redesign of skill trust, permissions, or marketplace governance.
- Automatic skill recommendation or ranking changes.
- Bulk marketplace install, sync, or dependency management.
- Full marketplace authoring or publishing workflows.
- New capability exchange behavior outside local AGH skill availability.

## Phased Rollout Plan

### MVP (Phase 1)

- Define install success as visible and usable.
- Align Web, CLI, and agent discovery around the same installed state.
- Replace false success with actionable failure when verification fails.
- Success criteria: a user installs a marketplace skill and can immediately verify the same installed state through Web, CLI, and agent discovery.

### Phase 2

- Add richer install diagnostics and clearer permission guidance.
- Improve unavailable-state copy for skills that are installed but not eligible for a specific agent.
- Success criteria: support reports can identify the blocking condition without reproducing the full install flow.

### Phase 3

- Expand marketplace lifecycle management for updates, removals, trust review, and optional policy controls.
- Success criteria: operators can manage the full marketplace skill lifecycle with verified states at every step.

## Success Metrics

- Zero known cases where AGH reports marketplace install success while the skill is not visible in installed skills.
- Web, CLI, and agent discovery agree on installed state in acceptance scenarios.
- Every failed or incomplete install shows a clear reason and one next action.
- Operators can verify install state without leaving AGH-managed surfaces.
- Agents can discover newly installed eligible skills in the next usable turn after verification.

## Risks and Mitigations

- Risk: More installs may appear to fail because verification exposes gaps that were previously hidden. Mitigation: frame failures as actionable states with clear next steps.
- Risk: Operators may confuse installed-but-unavailable with install failure. Mitigation: use distinct states and plain-language explanations.
- Risk: Agent discovery timing may be misunderstood. Mitigation: define success around the next usable agent discovery point rather than a purely visual marketplace event.
- Risk: Marketplace provenance may clutter the install flow. Mitigation: keep provenance visible where needed for trust and diagnostics, not as primary install copy.

## Architecture Decision Records

- [ADR-001: Verified Marketplace Skill Installation](adrs/adr-001.md) — Selects an install definition that requires visible and usable proof across Web, CLI, and agent discovery.

## Open Questions

- Should the CLI expose verification as part of the install command output, a separate inspect command, or both?
- Which agent contexts must be included in the MVP acceptance path?
- Which failure reasons should be grouped for operators versus maintainers?
- Should Phase 2 include guided permission repair, or only explain the blocking condition?
