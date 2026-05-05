Goal (incl. success criteria):

- Remediate CodeRabbit review feedback for PR #84 end-to-end.
- Success means each actionable review item is triaged as VALID or INVALID with technical evidence, validated fixes are implemented with tests, verification is run, and the repo is left ready for a single remediation commit plus review-thread resolution.

Constraints/Assumptions:

- Do not touch unrelated dirty worktree files.
- Do not run destructive git commands.
- Use `fix-coderabbit-review` workflow, but never commit `ai-docs/` because repo policy forbids it.
- Conversation in Brazilian Portuguese; artifacts in English.
- Review feedback targets session-repair changes spanning Go, CLI, API, web, and UI tokens.

Key decisions:

- Keep review disposition evidence in local `ai-docs/` artifacts, but exclude `ai-docs/` from any eventual commit due to workspace policy.
- Validate each comment against current code before changing anything.

State:

- In progress.

Done:

- Read root AGENTS instructions from the user prompt.
- Read `internal/CLAUDE.md` and `web/CLAUDE.md`.
- Read required skills: `fix-coderabbit-review`, `systematic-debugging`, `no-workarounds`, `agh-code-guidelines`, `agh-test-conventions`, `react`, `vitest`, `app-renderer-systems`, `vercel-react-best-practices`, `tailwindcss`, `golang-pro`, `testing-anti-patterns`.
- Scanned `.codex/ledger/` for cross-agent awareness and read `2026-04-28-MEMORY-session-repair-gap.md`.
- Confirmed the worktree already contains extensive unrelated modifications/deletions outside this task.
- Triaged the pasted PR #84 review bundle against current code.
- Classified as VALID: settings nav title tooltip, session repair query-order test, repair-state doc comments, `unixSocketClient` compile-time assertion, knowledge lib/UI tone boundary, repair response assertion strength, conflicting `dry_run` alias handling, repair logic when terminal event already exists, protocol kind `capability` token hard-cut, session adapter typed errors, `session repair` CLI test subtest shape, design-system token/showcase value sync guard.
- Classified as LIKELY INVALID pending final write-up: boot-time repair latency cap/metrics nitpick, because it changes startup semantics and config/observe scope without current failure evidence.

Now:

- Implement the validated Go and web fixes, then run focused verification.

Next:

- Run focused verification, then broader gates as far as feasible.
- Write local review disposition artifacts under `ai-docs/` as a fallback because the bundled exporter is blocked by missing transient deps.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether `internal/cli/client_test.go` should be refactored enough to make a parallel repair subtest safe, or whether a dedicated helper/client is needed to avoid using the parent `testing.T` inside the transport closure.

Working set (files/ids/commands):

- .codex/ledger/2026-04-28-MEMORY-fix-coderabbit-review.md
- PR #84 review comment bundle from user prompt
- `GITHUB_TOKEN="$(gh auth token)" npx ... pr-review.ts 84 --hide-resolved` (blocked: missing transient runner deps / `tsx`)
- internal/session/repair.go
- internal/session/repair_test.go
- internal/api/core/handlers.go
- internal/api/core/handlers_test.go
- internal/cli/client.go
- internal/cli/client_test.go
- internal/cli/session_test.go
- packages/ui/src/tokens.css
- web/src/components/design-system-showcase.tsx
- web/src/components/design-system-showcase.test.tsx
- web/src/lib/kind-colors.ts
- web/src/routes/\_app/settings.tsx
- web/src/systems/knowledge/lib/knowledge-formatters.ts
- web/src/systems/knowledge/lib/knowledge-formatters.test.ts
- web/src/systems/knowledge/components/knowledge-list-panel.tsx
- web/src/systems/knowledge/components/knowledge-detail-panel.tsx
- web/src/systems/session/adapters/session-api.ts
- web/src/systems/session/adapters/session-api.test.ts
