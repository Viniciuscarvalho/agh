Goal (incl. success criteria):

- Complete ext-architecture task_03 by creating `internal/extension/manifest.go` with dual-format manifest loading (`extension.toml` first, `extension.json` fallback), schema validation, and table-driven tests.
- Success means: manifests parse without executing code, TOML/JSON equivalents produce identical `Manifest` values, task/workflow tracking is updated correctly, `make verify` passes, and one local commit is created.

Constraints/Assumptions:

- Follow root `AGENTS.md` and `CLAUDE.md`; do not touch unrelated worktree changes except the required task/workflow tracking files.
- Must use `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `golang-pro`, and `testing-anti-patterns`.
- Source of truth is `.compozy/tasks/ext-architecture/task_03.md`, `_techspec.md`, `_examples.md`, `_tasks.md`, ADR-005, ADR-003, and the provided workflow memory files.
- `internal/extension/` does not exist yet and will be created in this task.

Key decisions:

- Exported `Manifest` stays flat (`Name`, `Version`, `MinAGHVersion`, section configs), while decoders will accept the wrapped document shape used by the tech spec examples (`[extension]` / `"extension"`).
- The manifest package will define its own typed hook config mirroring `internal/config/hooks.go` because `internal/hooks.HookDecl` lacks TOML tags and cannot be decoded directly.
- `resources.mcp_servers` will be represented as a named map and normalized so equivalent TOML/JSON inputs yield identical in-memory values.
- Compatibility checks will use the current daemon build version from `internal/version`; non-semver development builds should not block local manifest parsing.

State:

- Complete.

Done:

- Read required skill docs, workflow memory, task_03, `_techspec.md`, `_examples.md`, `_tasks.md`, ADR-005, ADR-003, and relevant config/version/hook files.
- Confirmed baseline gap: `internal/extension/` is absent.
- Confirmed existing unrelated worktree changes under `.compozy/tasks/ext-architecture/` and `docs/ideas/anp/`; leave them untouched.
- Reconciled the doc tension between wrapped manifest examples and the flat `Manifest` deliverable.
- Added `internal/extension/manifest.go` with wrapped-document TOML/JSON decoders, typed manifest/resource/action/security structs, semver and daemon-compatibility validation, duration decoding, and typed manifest errors.
- Added `internal/extension/manifest_test.go` covering TOML/JSON parity, precedence, required-field/semver/incompatibility failures, typed not-found errors, wildcard security capability acceptance, and helper branches needed for coverage.
- Verified `go test ./internal/extension -coverprofile=/tmp/internal-extension.cover.out -covermode=count` at 82.2% statement coverage.
- Updated workflow memory plus task tracking (`task_03.md`, `_tasks.md`) locally without staging them for commit.
- Created local commit `fe5978f` (`feat: add extension manifest parser`).
- Re-ran `make verify` after the commit hook and it passed cleanly.

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-10-MEMORY-extension-manifest.md`
- `.compozy/tasks/ext-architecture/memory/MEMORY.md`
- `.compozy/tasks/ext-architecture/memory/task_03.md`
- `.compozy/tasks/ext-architecture/task_03.md`
- `.compozy/tasks/ext-architecture/_tasks.md`
- `.compozy/tasks/ext-architecture/_techspec.md`
- `.compozy/tasks/ext-architecture/_examples.md`
- `.compozy/tasks/ext-architecture/adrs/adr-003.md`
- `.compozy/tasks/ext-architecture/adrs/adr-005.md`
- `internal/config/config.go`
- `internal/config/hooks.go`
- `internal/config/provider.go`
- `internal/version/version.go`
- `internal/extension/manifest.go`
- `internal/extension/manifest_test.go`
- Commit: `fe5978f`
- Commands: `rg`, `sed`, `git status`, `go test`, `go tool cover -func`, `make verify`, `git commit`
