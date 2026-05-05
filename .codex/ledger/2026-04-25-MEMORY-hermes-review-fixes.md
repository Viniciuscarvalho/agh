Goal (incl. success criteria):

- Resolve Hermes CodeRabbit review batch PR 69 round 001 issues 001-020.
- Success requires reading every issue file, triaging each with concrete reasoning, fixing every valid issue with tests, marking each batch issue resolved, running full verification, and creating exactly one local commit.

Constraints/Assumptions:

- Must follow `cy-fix-reviews` as the source of truth and `cy-final-verify` before completion/commit.
- Must not call provider-specific scripts, `gh` mutations, or external resolution commands.
- Must not edit issue files outside `.compozy/tasks/hermes/reviews-001/issue_001.md` through `issue_020.md`.
- Keep code edits scoped to the listed batch files unless a minimal out-of-scope test/support edit is technically required and documented.
- Do not run destructive git commands (`git restore`, `git checkout`, `git reset`, `git clean`, `git rm`) without explicit permission.
- Full repository gate is expected to be `make verify`.

Key decisions:

- All 20 scoped review issues are valid against current code.
- Issue 014 needs a minimal out-of-scope edit in `internal/environment/daytona/tool_host.go` so Daytona can expose the provider registry to ACP terminal registration while preserving ACP-owned session/turn ownership.
- Issue 020 is valid for the memory catalog DB even though a similar global DB migration already exists.

State:

- Complete. Batch issues 001-020 were fixed, verified, resolved, and committed locally.

Done:

- Read `cy-fix-reviews`, `cy-final-verify`, `golang-pro`, `systematic-debugging`, `no-workarounds`, and `testing-anti-patterns` skill instructions.
- Read review round `_meta.md`.
- Scanned `.codex/ledger/` and read relevant Hermes/MCP ledgers for cross-agent awareness.
- Read all 20 scoped issue files completely.
- Checked current code for each finding and updated issue files from `pending` to `valid` with concrete triage reasoning.
- Implemented fixes across ACP lifecycle/context cleanup, error wrapping, Go test subtest structure, shell-quoted editor parsing, uninstall process-race handling, MCP callback path normalization, probe target skipping, daemon retention failure teardown, diagnostics redaction/bounding, Daytona process-registry wiring, OAuth metadata/PKCE hardening, S256 support checks, and memory catalog migrations.
- Added/updated focused regression tests for the touched packages.
- Focused package test pass: `go test ./internal/acp ./internal/api/core ./internal/bridgesdk ./internal/cli ./internal/config ./internal/daemon ./internal/diagnostics ./internal/environment/daytona ./internal/mcp/auth ./internal/memory`.
- Full verification pass observed once with `make verify`: web lint/typecheck/test/build, Go lint, race-enabled Go tests, and package-boundary check passed.
- Updated issues `issue_001.md` through `issue_020.md` from `valid` to `resolved`.
- Second `make verify` surfaced `goconst` findings for repeated lifecycle status strings in `internal/cli/lifecycle.go`.
- Added lifecycle status constants and confirmed `go test ./internal/cli` passes.
- Final `make verify` pass: web format/lint/typecheck/test/build, Go lint (`0 issues`), race-enabled Go tests (`DONE 5896 tests`), and package-boundary check (`OK`) passed.
- Staged diff whitespace check passed after cleaning pasted-code whitespace in issue artifacts.
- Final post-cleanup `make verify` pass: Go lint (`0 issues`), race-enabled Go tests (`DONE 5896 tests`), and package-boundary check (`OK`) passed.
- Created local commit `f4caaf7f` (`fix: resolve hermes review batch`).
- Post-commit `make verify` pass confirmed commit-hook formatting did not break verification: Go lint (`0 issues`), race-enabled Go tests (`DONE 5896 tests`), package-boundary check (`OK`).
- Post-commit status only shows untracked out-of-batch review files: `_meta.md` and `issue_021.md` through `issue_031.md`.

Now:

- Done.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None yet.

Working set (files/ids/commands):

- Review dir: `.compozy/tasks/hermes/reviews-001/`
- Issue files: `issue_001.md` through `issue_020.md`
- Code scope: `internal/acp/client.go`, `internal/acp/types.go`, `internal/api/core/automation_test.go`, `internal/bridgesdk/errors.go`, `internal/bridgesdk/errors_test.go`, `internal/cli/config.go`, `internal/cli/lifecycle.go`, `internal/cli/mcp_auth.go`, `internal/config/release_config_test.go`, `internal/daemon/agent_probes.go`, `internal/daemon/daemon.go`, `internal/diagnostics/redact.go`, `internal/environment/daytona/provider.go`, `internal/mcp/auth/metadata.go`, `internal/mcp/auth/pkce.go`, `internal/mcp/auth/service.go`, `internal/memory/catalog.go`
