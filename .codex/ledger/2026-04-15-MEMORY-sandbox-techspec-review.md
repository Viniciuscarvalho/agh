Goal (incl. success criteria):

- Apply the recommended `.resources/sandbox-agent`-inspired updates to `.compozy/tasks/sandbox/_techspec.md`, relevant ADRs, and sandbox task files, keeping edits scoped to sandbox docs.

Constraints/Assumptions:

- User explicitly asked to apply recommended changes to the sandbox spec/docs.
- Do not use web search for local project code.
- Do not run destructive git commands.
- Worktree is very dirty with many unrelated modified files; do not touch or revert unrelated files.
- Treat user's "ok, aplique" as approval of the previously presented design/recommendation.

Key decisions:

- Use architectural-analysis workflow as a lightweight cross-spec comparison, not a full dead-code audit.

State:

- Sandbox spec/ADRs/task files aligned. Verification attempted and blocked by unrelated existing web lint failures.

Done:

- Scanned existing ledgers for sandbox-related context.
- Confirmed current sandbox spec exists at `.compozy/tasks/sandbox/_techspec.md`.
- Located reference directory at `.resources/sandbox-agent` (singular).
- Compared AGH sandbox spec against sandbox-agent docs for filesystem batch upload, Daytona snapshots, persistence/restoration, daemon lifecycle, observability, and process/terminal design.
- Updated `.compozy/tasks/sandbox/_techspec.md` with tar-first sync, Daytona snapshot profile input, idempotent provider create/reattach state, SSH token refresh state, filesystem sync safety rules, observability spans, testing coverage, sequencing, and risk updates.
- Updated ADR-001 with daemon-owned `EnvironmentID`/provider state lifecycle.
- Updated ADR-002 with distinct ACP vs bulk sync SSH stream classes and proactive token refresh.
- Updated ADR-003 with tar-over-SSH as first-class session-boundary sync and extraction safety.
- Ran `make verify`; it failed before fmt/lint/test/build because `openapi/agh.json` is stale and asks to run codegen.
- Scanned sandbox tasks and found drift in task_01, task_04, task_06, task_07, and task_08.
- Updated task_01 with snapshot config validation and expanded `SessionEnvironmentMeta` fields.
- Updated task_04 with daemon-owned `EnvironmentID`, creating-state persistence before provider calls, provider-state persistence, API columns, lifecycle ordering, and observability spans.
- Updated task_06 with tar-over-SSH sync, snapshot-aware Daytona creation, provider labels/tags, token refresh, provider-state reattach, and tar extraction safety.
- Updated task_07 with partial-create recovery/reattach by `agh_environment_id` and provider-state persistence.
- Updated task_08 with `environment_id`, sync stats, `sync_state`, and `last_sync_error` payload requirements.
- Ran focused `rg` checks; old `ResumeToken`/Daytona SDK bulk-sync wording is gone from sandbox task files. Remaining `ResumeToken` matches are explanatory lines in `_techspec.md`.
- Ran `make verify` after task edits; it failed in existing frontend lint/React complexity and hooks-location rules unrelated to sandbox docs.

Now:

- Ready to report final docs/task alignment and verification status.

Next:

- None unless user wants the unrelated lint/codegen drift addressed separately.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.compozy/tasks/sandbox/_techspec.md`
- `.compozy/tasks/sandbox/adrs/adr-001.md`
- `.compozy/tasks/sandbox/adrs/adr-002.md`
- `.compozy/tasks/sandbox/adrs/adr-003.md`
- `.resources/sandbox-agent/docs/file-system.mdx`
- `.resources/sandbox-agent/docs/deploy/daytona.mdx`
- `.resources/sandbox-agent/docs/session-persistence.mdx`
- `.resources/sandbox-agent/docs/session-restoration.mdx`
- `.resources/sandbox-agent/docs/observability.mdx`
- `.resources/sandbox-agent/docs/daemon.mdx`
- `.resources/sandbox-agent/research/process-terminal-design.md`
- `.codex/ledger/2026-04-15-MEMORY-sandbox-techspec-review.md`
- `rg -n "ResumeToken|tar-over-SSH|ProviderState|EnvironmentID|OpenTelemetry" .compozy/tasks/sandbox/_techspec.md .compozy/tasks/sandbox/adrs/*.md`
- `make verify` → failed: `openapi/agh.json: generated file is stale; run codegen`
- `.compozy/tasks/sandbox/_tasks.md`
- `.compozy/tasks/sandbox/task_01.md`
- `.compozy/tasks/sandbox/task_04.md`
- `.compozy/tasks/sandbox/task_06.md`
- `.compozy/tasks/sandbox/task_07.md`
- `.compozy/tasks/sandbox/task_08.md`
- `rg -n "ResumeToken|resume token|resume_token|via Daytona filesystem SDK|filesystem SDK \\(upload/download\\)|SDK upload|SDK download|calls SDK upload|calls SDK download|with resume token" .compozy/tasks/sandbox/_tasks.md .compozy/tasks/sandbox/task_*.md .compozy/tasks/sandbox/_techspec.md .compozy/tasks/sandbox/adrs/*.md || true`
- `make verify` after task edits → failed in existing frontend lint (e.g. `src/routes/_app/skills.tsx`, `src/routes/_app/session.$id.tsx`, `src/routes/_app/network.tsx`, `src/components/ui/sidebar.tsx`, `src/systems/session/components/tool-call-card.tsx`)
