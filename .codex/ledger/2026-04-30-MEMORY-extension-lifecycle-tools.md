Goal (incl. success criteria):

- Implement tools-refac Task 08: expose extension search/list/info/install/update/remove/enable/disable as built-in tools over the existing extension manager, registry, marketplace, managed-install, approval, and reconciliation flows.
- Success requires focused unit/integration coverage, >=80% affected-package coverage, clean `make verify`, tracking updates, and one local commit.

Constraints/Assumptions:

- Conversation in BR-PT; artifacts/code/tests/commit messages in English.
- No destructive git commands (`restore`, `checkout`, `reset`, `clean`, `rm`) without explicit permission.
- Must use workflow memory files under `.compozy/tasks/tools-refac/memory/`.
- Must reuse existing extension lifecycle paths; no parallel tool-only install/update/remove pipeline.
- Mutating extension operations must require approval and deterministic denials.

Key decisions:

- Implemented the tool family in the same native-tool patterns used by Tasks 05-07.
- Added reusable `internal/extension` marketplace lifecycle helpers so daemon tools use registry/installer/staged rollback primitives instead of ad-hoc mutation code.
- Kept tool install source inference deterministic: `path` implies local, `slug` implies marketplace, and mixed local/marketplace inputs are rejected.

State:

- Implementation complete; code committed locally; pre-commit and post-commit verification passed.

Done:

- Read shared workflow memory and task_08 memory.
- Read required skills: cy-workflow-memory, cy-execute-task, cy-final-verify, agh-code-guidelines, golang-pro, agh-test-conventions, testing-anti-patterns.
- Read root AGENTS/CLAUDE guidance, internal/CLAUDE, standing directives, tools-refac task, \_tasks, \_techspec, ADR-001..006, and competitor notes.
- Added `agh__extensions` descriptors/toolset/IDs/reason codes.
- Added daemon native handlers for extension search/list/info/install/update/remove/enable/disable.
- Added marketplace lifecycle helpers and tests for search/install/update/remove, denial, rollback, and source validation.
- Passed focused tests, coverage, test convention checks, and pre-commit `make verify`.
- Updated `.compozy/tasks/tools-refac/task_08.md`, `_tasks.md`, and task workflow memory.
- Created local commit `5735b42c feat: add extension lifecycle tools`.
- Passed post-commit `make verify` with Go lint `0 issues`, `DONE 7070 tests`, and package boundaries respected.

Now:

- Ready to report completion.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.compozy/tasks/tools-refac/task_08.md`
- `.compozy/tasks/tools-refac/_techspec.md`
- `.compozy/tasks/tools-refac/_tasks.md`
- `.compozy/tasks/tools-refac/memory/MEMORY.md`
- `.compozy/tasks/tools-refac/memory/task_08.md`
- `internal/extension/*`
- `internal/tools/*`
- `internal/daemon/extensions.go`
- `internal/daemon/native_extension_tools.go`
- Verification: focused unit/integration/coverage checks passed; `make verify` passed before and after commit with 7070 Go tests and package boundaries respected.
