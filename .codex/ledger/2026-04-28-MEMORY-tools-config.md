# Goal (incl. success criteria):

- Implement Task 02 "Tools Config Lifecycle and Agent Grammar" for `/Users/pedronauck/Dev/compozy/agh`: add tools config sections/defaults/validation, agent `toolsets`/`deny_tools`, overlay behavior, examples/docs references, focused tests, tracking updates, clean `make verify`, and one local commit if verification is clean.

# Constraints/Assumptions:

- Must use `cy-workflow-memory`, `cy-execute-task`, and `cy-final-verify`.
- Must not run destructive git commands (`restore`, `checkout`, `reset`, `clean`, `rm`) without explicit permission.
- Must not add compatibility aliases, fallback key names, old-state migrations, or hand-edit `go.mod`.
- Need keep workflow memory/task tracking out of commit unless repository explicitly requires staging them.

# Key decisions:

- Keep Task 02 scoped to config load/parse validation. Runtime policy evaluation remains for task_03.
- Use canonical `internal/tools.ToolID` and `ToolsetID` validators for agent `tools`, `deny_tools`, and `toolsets`.
- Represent trusted external sources as `mcp:<server_name>` or `extension:<extension_name>` strings. MCP entries must resolve to configured top-level/provider MCP servers at config validation time; extension entries are syntax-validated because installed extensions are not loaded by the config package.
- Bound config-only safety values with deterministic daemon limits: approval timeout 1-600 seconds, hosted MCP bind nonce TTL 1-300 seconds, default result budget 0-16 MiB.

# State:

- Implementation, generated artifacts, focused checks, self-review, tracking updates, local commit `ba3aec81`, and post-commit `make verify` are complete. Remaining work is final response.

# Done:

- Read root and internal AGENTS/CLAUDE guidance.
- Read required workflow memory files.
- Read task spec, `_tasks.md`, relevant `_techspec.md` sections, ADR-005, ADR-006, ADR-007.
- Loaded required task workflow skills and AGH Go/test skills.
- Scanned ignored `.codex/ledger/*MEMORY*.md` files and read the tool-registry adjacent ledgers.
- Inspected existing `internal/config` defaults, validation, merge overlays, agent parsing, provider resolution, agent resource normalization, and tool ID validators.
- Captured pre-change baseline: `go test ./internal/config -run TestParseAgentDefValidFrontmatterAndBody -count=1` passed while the fixture still used old ad hoc tool names.
- Added tools config structs/defaults/validation for `[tools]`, `[tools.hosted_mcp]`, and `[tools.policy]`.
- Added strict agent grammar for canonical `tools`, `toolsets`, and `deny_tools`, including resource/provider/API/clone propagation.
- Updated merge overlays, example `config.toml`, bundled agent setup docs, and site config/agent docs.
- Added focused config tests covering defaults, validation, overlays, realistic load paths, and agent grammar.
- Focused checks already passed: `go test ./internal/config -count=1`, `go test ./internal/config -cover -count=1` at 81.8%, `go test -race ./internal/config -count=1`, `go test ./internal/config ./internal/daemon ./internal/workspace ./internal/extension -count=1`, `go test ./internal/api/core -run TestAgentPayloadFromDef -count=1`, `python3 .agents/skills/agh-test-conventions/scripts/check-test-conventions.py internal/config/tools_test.go`, and `git diff --check`.
- Regenerated OpenAPI/web types with `make codegen`; `make codegen-check` passed.
- Fixed the full-verify E2E seed helper failure by adding `toolsets`/`deny_tools` support and replacing legacy `read`/`write` tool fixture atoms with canonical IDs.
- Full `make verify` passed after all code changes: JS format/lint/typecheck/tests/build, Go lint, race-enabled Go tests (`DONE 6583 tests`), Go build, and package boundaries.
- Updated workflow memory files.
- Updated task tracking and created local commit `ba3aec81 feat: add tools config lifecycle`.
- Post-commit `make verify` exited 0. Tail evidence included `0 issues.`, `DONE 6583 tests in 6.078s`, and `OK: all package boundaries respected`.

# Now:

- Prepare final response with verification evidence.

# Next:

- None.

# Open questions (UNCONFIRMED if needed):

- Whether later tasks will choose stricter source policy defaults beyond parse-time validation is UNCONFIRMED.

# Working set (files/ids/commands):

- PRD dir: `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/tools-registry`
- Workflow memory: `.compozy/tasks/tools-registry/memory/MEMORY.md`, `.compozy/tasks/tools-registry/memory/task_02.md`
- Code surfaces: `internal/config/*`, `internal/api/contract/contract.go`, `internal/api/core/conversions.go`, daemon/extension/workspace clone/resource propagation.
- Generated surface: OpenAPI/TypeScript contracts via `make codegen`.
- Docs/examples: root `config.toml`, bundled `agh-agent-setup` skill, `packages/site/content/runtime/core/configuration/{config-toml,agent-md}.mdx`, `packages/site/content/runtime/core/agents/definitions.mdx`.
