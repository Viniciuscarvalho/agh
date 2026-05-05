Goal (incl. success criteria):

- Fix all current lint errors properly, starting with Go and then TypeScript/web.
- Success means `make lint`, `make web-lint`, `make web-typecheck`, and final `make verify` all pass with root-cause fixes only.

Constraints/Assumptions:

- No workarounds: no lint suppressions, no compatibility shims kept only to appease lint, no type assertions or error swallowing to hide problems.
- Worktree was already dirty across many files; unrelated user/agent edits were preserved.
- Final completion requires fresh verification evidence from the real project commands.

Key decisions:

- Triage by real gates: Go first (`make lint`), then web (`make web-lint`, `make web-typecheck`), then full repo verification (`make verify`).
- Split the cleanup by folder ownership using `gpt-5.4` `xhigh` subagents to accelerate without overlapping write scopes.
- Fix runtime/test failures revealed by verification as production bugs, not as test adjustments.
- Use the provided `lint-plugins/react-hooks-separation-codemod.mjs` as an assistive tool, but keep manual refactors where the codemod does not apply.

State:

- Completed.

Done:

- Identified and cleaned the main Go lint/error folders:
  - `internal/acp`
  - `internal/api/**`
  - `internal/automation`
  - `internal/bridges`
  - `internal/bridgesdk`
  - `internal/cli`
  - `internal/config`
  - `internal/daemon`
  - `internal/extension`
  - `internal/extensiontest`
  - `internal/hooks`
  - `internal/memory/**`
  - `internal/network`
  - `internal/observe`
  - `internal/session`
  - `internal/subprocess`
  - `internal/task`
  - `sdk/examples/telegram-reference`
  - `extensions/bridges/{gchat,discord,slack}`
- Propagated the exported-name cleanup without compatibility aliases across backend callsites, including the `session`, `memory`, `task`, `automation`, `acp`, and `network` type families.
- Normalized task cancellation to the canonical `canceled` spelling across backend, schema/codegen, and frontend consumers.
- Regenerated contracts and types with `make codegen`.
- Cleaned the remaining web lint/typecheck folders:
  - `web/src/routes/_app/**`
  - `web/src/components/ui/**`
  - `web/src/components/app-sidebar.tsx`
  - `web/src/stores/sidebar-store.ts`
  - `web/src/systems/session/**`
  - `web/src/systems/workspace/**`
- Moved route-specific hooks out of `web/src/routes/hooks/**` into `web/src/hooks/routes/**` to satisfy TanStack route checks during build.
- Ran `node lint-plugins/react-hooks-separation-codemod.mjs --write --path web/src/routes/_app --path web/src/systems/session/components --path web/src/systems/workspace/components`; result was `Transformed 0 file(s), created 0 new hook file(s)`.
- Fixed verification-revealed runtime bugs:
  - `internal/subprocess`: removed health monitor lifecycle race by giving each run immutable stop/done channel ownership.
  - `internal/cli`: fixed SSE decode early-stop behavior and added regression coverage.
  - `sdk/examples/telegram-reference`: fixed marker directory creation and side-effect snapshot ordering; then replaced insecure directory creation with a root-scoped safe implementation.
  - `extensions/bridges/gchat`: package-specific lint/runtime fixes integrated and validated.
- Final command results:
  - `make lint` -> ok
  - `make web-lint` -> ok
  - `make web-typecheck` -> ok
  - `make verify` -> ok

Now:

- Task complete; only final user summary remains.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-15-MEMORY-fix-lint.md`
- `internal/subprocess/health.go`
- `internal/subprocess/process_test.go`
- `internal/cli/client.go`
- `internal/cli/client_test.go`
- `sdk/examples/telegram-reference/main.go`
- `extensions/bridges/gchat/{markers.go,provider.go,provider_test.go}`
- `web/src/hooks/routes/*`
- `web/src/components/ui/hooks/*`
- `web/src/systems/session/hooks/*`
- `web/src/systems/workspace/hooks/*`
- `make lint`
- `make web-lint`
- `make web-typecheck`
- `make verify`
