# Goal (incl. success criteria):

- Implement first-class API-key/secondary providers for AGH using a provider catalog, Pi/pi-acp runtime materialization, and bound secret injection.
- Success means backend, contracts, CLI/agent-manageable surfaces, web UI, site docs, tests, and generated artifacts are updated consistently.

# Constraints/Assumptions:

- Never run destructive git commands without explicit permission.
- Preserve unrelated existing worktree changes.
- Conversation in Brazilian Portuguese; artifacts/code/docs in English.
- Subagents are read-only; main agent owns repository writes.
- `make verify` is the final required gate.
- Existing Plan Mode plan was accepted by user and must be persisted under `.codex/plans/`.

# Key decisions:

- API-key providers remain first-class AGH providers while v1 execution routes through `pi-acp`.
- AGH provider identity is separate from runtime harness/provider identity.
- Provider credentials use encrypted AGH-owned bound secret injection; no generic extension/agent `vault/get`.
- Support `env:` refs for operator-managed secrets and `vault:` refs for AGH-managed credentials.

# State:

- Follow-up Claude Opus remediation review returned `Not ready`; fixes are in progress for typed-nil provider vault propagation, direct-ACP required env credentials, and Pi-runtime contract coverage.

# Done:

- Read root/user instructions, relevant skills, `internal/CLAUDE.md`, `web/CLAUDE.md`, `packages/site/CLAUDE.md`, and design docs.
- Scanned existing ledgers and current dirty worktree.
- Persisted accepted plan at `.codex/plans/2026-05-01-api-key-providers.md`.
- Created requested analysis context under `.compozy/tasks/providers/analysis/`.
- Added first-class provider catalog metadata and Pi-backed builtins for OpenRouter, z.ai, Moonshot/Kimi, Vercel AI Gateway, xAI, MiniMax, Mistral, and Groq.
- Added encrypted provider vault package, global DB vault migration/store, daemon vault wiring, settings secret write path, and session launch-time bound secret injection.
- Added Pi runtime materialization under each session directory with `PI_CODING_AGENT_DIR`, `settings.json`, and `models.json`.
- Ran targeted Go tests before later docs/web refinements: `go test ./internal/config ./internal/vault ./internal/store/globaldb` and `go test ./internal/session ./internal/settings ./internal/api/core ./internal/api/contract ./internal/daemon` passed.
- Updated web provider settings/session picker surfaces and focused web tests.
- Updated provider, config, environment, spawning, troubleshooting, installation, configuration overview, and AGENT.md site docs for API-key providers and bound credentials.
- `make codegen-check` passed.
- Focused verification passed: `go test ./internal/config ./internal/vault ./internal/store/globaldb ./internal/session ./internal/settings ./internal/api/core ./internal/api/contract ./internal/daemon`, `make web-typecheck`, targeted web Vitest provider/session tests, and `cd packages/site && bun run typecheck`.
- Fixed final-gate regressions surfaced by `make verify`: provider catalog test expectations, E2E seed provider credential slot validation, a site `TabId` mismatch in an existing dirty file, and one lint warning in `internal/cli/client_tools.go`.
- Final `make verify` passed before the first Opus review.
- Ran `compozy exec --ide claude --model opus --reasoning-effort xhigh --timeout 20m --prompt-file .compozy/tasks/providers/reviews/claude_opus_review_prompt.md`.
- Saved review report at `.compozy/tasks/providers/reviews/claude_opus_review.md`.
- Re-read required Go/test/web skills plus `internal/CLAUDE.md` and `web/CLAUDE.md` context for the remediation pass.
- Mapped review hotspots: dynamic diagnostics redaction, provider runtime secret injection tracking, provider credential-slot fallback semantics, vault/store tests, builtin catalog coverage, daemon vault warning, strict `vault:` refs, and web multi-slot preservation.
- Implemented dynamic provider-secret redaction with session-lifetime cleanup.
- Added focused tests for diagnostics dynamic redaction, vault service/key handling, global DB vault CRUD, provider runtime Pi materialization, missing optional credentials, builtin provider catalog coverage, strict provider vault refs, daemon vault warning, and web multi-slot preservation.
- Focused tests passed: `go test ./internal/config ./internal/session ./internal/vault ./internal/store/globaldb ./internal/daemon ./internal/diagnostics -count=1`, `bunx vitest run web/src/hooks/routes/use-settings-providers-page.test.tsx`, `bun run --cwd web typecheck`, and `cd packages/site && bun run typecheck`.
- Test-convention helper from skill instructions is not present at `scripts/check-test-conventions.py` and no replacement was found via `rg --files`.
- Full remediation verification passed with `make verify`; final output included `OK: all package boundaries respected`.
- Ran follow-up review with `compozy exec --ide claude --model opus --reasoning-effort xhigh --timeout 20m --prompt-file .compozy/tasks/providers/reviews/claude_opus_remediation_review_prompt.md`.
- Saved follow-up review report at `.compozy/tasks/providers/reviews/claude_opus_remediation_review.md`.
- Fixed follow-up findings: true-nil daemon provider-vault dependency adapters with registry type warning, required env-slot handling for direct ACP providers, optional default slots for direct ACP builtins, stronger Pi runtime contract tests, lower-case vault slot validation, docs wording, and vault upsert coverage.
- Focused Go tests passed after fixes: `go test ./internal/config ./internal/session ./internal/vault ./internal/store/globaldb ./internal/daemon ./internal/diagnostics -count=1`.
- Race-focused Go tests passed: `go test -race ./internal/session ./internal/daemon -count=1`.

# Now:

- Running broader verification after Opus follow-up fixes.

# Next:

- Run lint/typecheck/full `make verify`, then rerun Opus review if the code changes are substantial enough to require a final external verdict.

# Open questions (UNCONFIRMED if needed):

- None blocking.

# Working set (files/ids/commands):

- Ledger: `.codex/ledger/2026-05-01-MEMORY-api-key-providers.md`
- Plan: `.codex/plans/2026-05-01-api-key-providers.md`
- Research target: `.compozy/tasks/providers/analysis/`
- Review prompt: `.compozy/tasks/providers/reviews/claude_opus_review_prompt.md`
- Review report: `.compozy/tasks/providers/reviews/claude_opus_review.md`
- Remediation review prompt: `.compozy/tasks/providers/reviews/claude_opus_remediation_review_prompt.md`
- Remediation review report: `.compozy/tasks/providers/reviews/claude_opus_remediation_review.md`
