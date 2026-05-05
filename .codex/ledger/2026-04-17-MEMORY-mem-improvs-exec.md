Goal (incl. success criteria):

- Execute full QA for the memory improvements using `.compozy/tasks/mem-improvs/qa/` as the artifact root.
- Success requires fresh baseline verification evidence, execution of the highest-priority memory CLI/API scenarios, appropriate Web UI validation or an explicit scope/blocker note, fixes for any regressions found, a rerun of the final gate, a verification report, and permanent daemon E2E coverage for the critical memory scenarios discovered during QA.

Constraints/Assumptions:

- User explicitly requested `qa-execution`; this task must execute flows, not only plan them.
- The provided `qa-output-path` is `.compozy/tasks/mem-improvs`.
- `scripts/discover-project-contract.py` is absent in this repository, so contract discovery falls back to root instructions, `Makefile`, `web/package.json`, and existing QA artifacts.
- Do not touch unrelated worktree changes.
- If regressions are found, fix root cause and add narrow regression coverage instead of weakening tests.
- `make verify` must pass before completion.

Key decisions:

- Use `.compozy/tasks/mem-improvs/qa/test-plans/*` and `test-cases/*` as the execution matrix seed.
- Treat the changed surface as `internal/memory`, `internal/session`, `internal/api/{core,httpapi,udsapi}`, `internal/cli/memory.go`, and `internal/store/globaldb/global_db_observe.go`.
- Treat regression-critical adjacent surfaces as daemon readiness, observe health/events, and the existing Web UI shell because the repo has a live React/Vite frontend even though the memory change does not add a dedicated UI.
- Use repository-defined gates from `Makefile`: `make deps`, `make lint`, `make build`, `make test`, `make test-integration`, then final `make verify`.
- Add permanent daemon integration coverage under `internal/daemon/` using `internal/testutil/e2e.RuntimeHarness` plus `acpmock-driver`, instead of adding brittle unit-only assertions or test-only production hooks.
- Add a small workdir-aware CLI helper to the runtime harness so the automated daemon test can exercise the real `agh memory` operator flows from a workspace root.

State:

- Completed.

Done:

- Read root instructions, previous memory-upgrade ledgers, the `qa-execution` skill, and its references.
- Confirmed `agent-browser` is installed locally.
- Confirmed Web UI surface exists via `web/package.json` (`bun run dev:raw` -> Vite on port 3000).
- Loaded the existing `qa-report` artifacts under `.compozy/tasks/mem-improvs/qa/`.
- Confirmed the skill-prescribed discovery script is missing and recorded the fallback contract source.
- Executed baseline gates and live QA scenarios against an isolated daemon runtime:
  - `make deps`, `make lint`, `make build`, `make test`, `make test-integration`, `make verify`
  - real CLI/API memory write/list/read/search/reindex/delete
  - observe health/events
  - recall-before-prompt with preserved persisted user message
  - regression guard for `.agh/memory` vs legacy `.compozy/memory`
- Captured browser-shell smoke evidence under `.compozy/tasks/mem-improvs/qa/screenshots/`, with the explicit caveat that Vite proxying prevented isolated-daemon browser validation.
- Added permanent daemon E2E coverage:
  - `internal/daemon/daemon_memory_e2e_integration_test.go`
  - `internal/testutil/acpmock/testdata/memory_recall_fixture.json`
  - `internal/testutil/e2e/runtime_harness.go` (`RunInDir` / `RunJSONInDir`)
- New automated scenarios cover:
  - CLI + HTTP + UDS parity for memory search/reindex/observe with legacy-path isolation
  - prompt recall dispatch through `acpmock-driver` without mutating stored `user_message` events
- Verified the new coverage directly with `go test -tags integration ./internal/daemon -run 'TestDaemonE2EMemory' -count=1` and `go test ./internal/testutil/e2e -count=1`.
- Re-ran `make test-integration` successfully: `DONE 5074 tests, 3 skipped in 82.270s` (Daytona skips due missing `DAYTONA_API_KEY`).
- Re-ran `make verify` successfully: web checks passed, `golangci-lint` reported `0 issues`, Go verification ended with `DONE 4707 tests in 7.836s`, and package boundaries passed.
- Wrote the QA execution report to `.compozy/tasks/mem-improvs/qa/verification-report.md`.

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-17-MEMORY-mem-improvs-exec.md`
- `.codex/ledger/2026-04-17-MEMORY-mem-improvs-qa.md`
- `.codex/ledger/2026-04-17-MEMORY-memory-standard-upgrade.md`
- `.compozy/tasks/mem-improvs/qa/verification-report.md`
- `.compozy/tasks/mem-improvs/qa/test-plans/memory-standard-upgrade-test-plan.md`
- `.compozy/tasks/mem-improvs/qa/test-plans/memory-standard-upgrade-regression.md`
- `.compozy/tasks/mem-improvs/qa/test-cases/*.md`
- `.compozy/tasks/mem-improvs/qa/screenshots/*.png`
- `internal/daemon/daemon_memory_e2e_integration_test.go`
- `internal/testutil/acpmock/testdata/memory_recall_fixture.json`
- `internal/testutil/e2e/runtime_harness.go`
- `Makefile`
- `web/package.json`
- `go test -tags integration ./internal/daemon -run 'TestDaemonE2EMemory' -count=1`
- `go test ./internal/testutil/e2e -count=1`
- `make deps`
- `make lint`
- `make build`
- `make test`
- `make test-integration`
- `make verify`
