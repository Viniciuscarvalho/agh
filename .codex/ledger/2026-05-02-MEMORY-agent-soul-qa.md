Goal (incl. success criteria):

- Continue `agent-soul-qa` Codex Loop until `.compozy/tasks/agent-soul/_techspec.md` is validated with behavior-first QA in real scenarios and edge cases.
- Success requires `qa-report` artifacts, `qa-execution` evidence, root-cause fixes for reproduced bugs, updated QA report, and a fresh full monorepo gate before final.

Constraints/Assumptions:

- No destructive git commands.
- Conversation in BR-PT; artifacts/code/docs in English.
- `make verify` is required, but local raw `make verify` hits the global `mise` `mage` shim. The working full-gate command is `TURBO_ENV_MODE=loose MAGE='go run github.com/magefile/mage@v1.15.0' make verify`.
- Do not touch unrelated dirty worktree changes.

Key decisions:

- Reused same-session QA lab because the continuation is the same active QA loop.
- Deterministic focused Go tests are acceptable evidence for unsafe timing/race/retention edges; live daemon journeys are used for operator-facing flows.

State:

- Second-round gap execution is complete and the final full gate passed.
- `verification-report.md` has been updated with the second-round coverage, focused verification, and final full-gate evidence.

Done:

- Added confirmation-gap QA cases/plans under `.compozy/tasks/agent-soul/qa/`.
- Live lab proved Soul idle refresh, active task-run 409 rejection, `ClaimNextRun` metadata_json Soul provenance, spawned child `parent_soul_digest`, UDS Soul/Heartbeat read-write parity, `/agent/context` truncation, config overlay/rejection, absent `agh session heartbeat`, and HTTP missing/stale identity 401s.
- Added and passed focused regressions for Host API grant denial and hook observation-only bypass paths.
- Added and passed focused evidence for Heartbeat coalescing/rate limiting, active-prompt race, wake retention, migration v13, ClaimNextRun Soul metadata, config overlay validation, and lifecycle forwarding.
- Fixed `BUG-004` in `internal/task/actors.go` with tests.
- Fixed `BUG-005` in `internal/daemon/hooks_bridge.go` with tests.
- Fixed `BUG-006` in `internal/cli/config.go` with tests.
- Added issue files for `BUG-005` and `BUG-006`.

Now:

- Run final artifact sanity checks and close the Codex Loop goal.

Next:

- Report the final outcome with evidence.

Open questions (UNCONFIRMED if needed):

- Whether provider digest transcription should become a product prompt hardening follow-up is UNCONFIRMED; runtime surfaces return exact digests correctly.

Working set (files/ids/commands):

- QA report: `.compozy/tasks/agent-soul/qa/verification-report.md`
- QA evidence root: `.compozy/tasks/agent-soul/qa/evidence/`
- QA lab manifest: `/Users/pedronauck/dev/qa-labs/agh-agent-soul-20260502-185208-519542-lab/qa-artifacts/qa/bootstrap-manifest.json`
- Lab root: `/Users/pedronauck/dev/qa-labs/agh-agent-soul-20260502-185208-519542-lab`
- Runtime home: `/Users/pedronauck/dev/qa-labs/agh-agent-soul-20260502-185208-519542-lab/.agh/runtime`
- Base URL: `http://127.0.0.1:50140`
- UDS: `/Users/pedronauck/dev/qa-labs/agh-agent-soul-20260502-185208-519542-lab/.agh/runtime/aghd.sock`
- Final gate command: `TURBO_ENV_MODE=loose MAGE='go run github.com/magefile/mage@v1.15.0' make verify`
- Final gate log: `.compozy/tasks/agent-soul/qa/evidence/final-second-round-make-verify.log`
