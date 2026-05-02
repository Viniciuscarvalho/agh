# OpenClaw Heartbeat Analysis

## Scope

- Path explored: `.resources/openclaw/`
- Topic: `HEARTBEAT.md`, heartbeat runner/wake/coalescing, active hours, isolated heartbeat sessions, prompt contributions, busy-lane skip, and task boundaries.
- Read-only exploration: no files were edited, created, or deleted.

## Overview

OpenClaw models heartbeat as a periodic agent turn, not as detached durable work. Its documentation says heartbeat runs in the main session and does not create background task records; task records are reserved for detached work such as ACP runs, subagents, isolated cron jobs, and CLI operations.

`HEARTBEAT.md` is a lightweight workspace file. Empty or comment-only content skips heartbeat API calls. Non-empty content may shape the heartbeat prompt, including a simple `tasks:` block, but that still does not become durable work.

The runtime has two important layers: a runner that tracks interval/phase/next-due state per agent, and a wake layer that coalesces wake requests per target and retries when the command/session lane is busy.

## Mechanisms / Patterns

- **Prompt artifact:** `HEARTBEAT.md` is read from the agent workspace and included in heartbeat prompt resolution.
- **No task record for heartbeat:** heartbeat turns do not create background task records.
- **Structured `tasks:` as prompt shaping:** due tasks are assembled into a prompt; timestamps live in session state.
- **In-memory runner state:** per-agent heartbeat state includes interval, phase, and next due time.
- **In-memory wake coalescing:** pending wakes are keyed by agent/session, merged by priority/recency, and retried on busy-lane skips.
- **Active-hours gate:** active hours are config-owned, not `HEARTBEAT.md` authority.
- **Optional isolated session:** OpenClaw can run heartbeats in a fresh isolated session to reduce transcript cost.
- **Prompt contribution hook:** plugin hook contributions run only during heartbeat-triggered turns.
- **ACK suppression:** `HEARTBEAT_OK` can be stripped and dropped to avoid user-visible noise.

## Relevant Code Paths

- `.resources/openclaw/docs/gateway/heartbeat.md:14-17` - heartbeat is a scheduled main-session turn and not a background task record.
- `.resources/openclaw/docs/gateway/heartbeat.md:41-59` - config example for cadence, target, light context, isolated sessions, and active hours.
- `.resources/openclaw/docs/gateway/heartbeat.md:61-88` - defaults and `HEARTBEAT_OK` response contract.
- `.resources/openclaw/docs/gateway/heartbeat.md:152-185` - active-hours behavior.
- `.resources/openclaw/docs/gateway/heartbeat.md:369-418` - `HEARTBEAT.md` checklist and `tasks:` block semantics.
- `.resources/openclaw/docs/reference/templates/HEARTBEAT.md:8-12` - empty/comment-only file behavior.
- `.resources/openclaw/src/auto-reply/heartbeat.ts:20-68` - effectively-empty `HEARTBEAT.md` detection.
- `.resources/openclaw/src/auto-reply/heartbeat.ts:188-299` - `tasks:` parser and due check.
- `.resources/openclaw/src/infra/heartbeat-wake.ts:42-208` - in-memory wake coalescing, running guard, and busy retry.
- `.resources/openclaw/src/infra/heartbeat-runner.ts:610-725` - heartbeat file read and prompt construction.
- `.resources/openclaw/src/infra/heartbeat-runner.ts:727-793` - disabled, active-hours, main-lane, and session-lane gates.
- `.resources/openclaw/src/infra/heartbeat-runner.ts:1316-1455` - runner schedule state and config reload.
- `.resources/openclaw/src/plugins/hooks.ts:1264-1272` - heartbeat prompt contribution hook dispatch.

## Transferable Patterns

- Treat `HEARTBEAT.md` as wake/reentry prompt guidance, not durable work.
- Keep scheduling authority in config and runtime bounds, not in Markdown.
- Add per-target wake coalescing and busy-lane retry semantics.
- Use typed heartbeat prompt contribution hooks instead of a generic event bus.
- Use metadata/ACK suppression to avoid noisy user transcripts.
- Preserve task boundaries: any executable work must flow through AGH `task_runs` and `ClaimNextRun`.

## Risks / Mismatches

- OpenClaw's `tasks:` block would become a hidden scheduler if copied directly into AGH.
- In-memory coalescing alone is too weak for AGH's restart/debug/manageability expectations.
- OpenClaw's heartbeat runner invokes model turns directly; AGH's scheduler must only wake.
- OpenClaw lacks UDS parity; AGH must expose agent-operable UDS surfaces.
- Isolated heartbeat sessions are useful, but auto-spawn is outside the AGH MVP chosen for this TechSpec.

## Open Questions

- Should AGH allow any structured frontmatter in `HEARTBEAT.md`, or keep the body prose/checklist-only and put operational bounds in config?
- Should AGH support `HEARTBEAT_OK` suppression in v1, or treat it as future prompt behavior?
- Should a typed prompt-contribution hook be allowed to veto/defer a wake, or only append context?

## Evidence

- `.resources/openclaw/docs/gateway/heartbeat.md:14-17`
- `.resources/openclaw/docs/gateway/heartbeat.md:41-59`
- `.resources/openclaw/docs/gateway/heartbeat.md:61-88`
- `.resources/openclaw/docs/gateway/heartbeat.md:152-185`
- `.resources/openclaw/docs/gateway/heartbeat.md:369-418`
- `.resources/openclaw/docs/reference/templates/HEARTBEAT.md:8-12`
- `.resources/openclaw/src/auto-reply/heartbeat.ts:20-68`
- `.resources/openclaw/src/auto-reply/heartbeat.ts:188-299`
- `.resources/openclaw/src/infra/heartbeat-wake.ts:42-208`
- `.resources/openclaw/src/infra/heartbeat-runner.ts:610-725`
- `.resources/openclaw/src/infra/heartbeat-runner.ts:727-793`
- `.resources/openclaw/src/infra/heartbeat-runner.ts:1316-1455`
- `.resources/openclaw/src/plugins/hooks.ts:1264-1272`
