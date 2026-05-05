Goal (incl. success criteria):

- Implement the accepted tools-refac/tools-registry review remediation plan.
- Success: network send rejects raw `claim_token` fields across tool/API/CLI/hosted paths; autonomy bridge has stale/expired writer regression; accepted plan is persisted under `.codex/plans/`; artifacts use canonical reason names; focused tests and `make verify` pass.

Constraints/Assumptions:

- Conversation in BR-PT; artifacts/code in English.
- Do not run destructive git commands.
- Preserve existing unrelated modified/untracked files.
- Go/test work must follow `internal/CLAUDE.md`, `agh-code-guidelines`, `golang-pro`, `agh-test-conventions`, `testing-anti-patterns`, `systematic-debugging`, and `no-workarounds`.
- Contract/codegen changes require co-shipped generated artifacts and verification if triggered.

Key decisions:

- Use writer-side `BEGIN IMMEDIATE` revalidation as the autonomy TOCTOU fix mechanism; add bridge test/docs rather than a new lookup+writer transaction.
- Raw token ingress policy rejects JSON keys equal to `claim_token`; it allows `claim_token_hash` and benign strings containing `agh_claim_`.
- Canonical tool reason is lower-snake `network_raw_token_rejected`.

State:

- Completed.

Done:

- Accepted plan persisted to `.codex/plans/tools-review-remediation.md`.
- Session ledger created.
- Required skills and `internal/CLAUDE.md` loaded.
- Added canonical tool reason `network_raw_token_rejected`.
- Wired raw `claim_token` JSON-field rejection through shared network send conversion, native `agh__network_send`, CLI `agh network send`, UDS/API handler path, and hosted MCP native dispatch.
- Added stdio MCP env-name denylist validation for dangerous interpreter/preload variables.
- Added tests for network send rejection, hosted MCP propagation, autonomy stale writer mapping, and MCP stdio env validation.
- Focused Go tests passed once for the touched network/daemon/config packages.
- Updated `tools-refac` TechSpec/QA artifacts from stale delete targets to residual checks, documented writer-side autonomy revalidation, normalized `network_raw_token_rejected`, and added stdio MCP env hardening notes.
- Updated `tools-registry` validation prose for stdio MCP unsafe env keys.
- Ran `make codegen`; `openapi/agh.json` was regenerated/reformatted by the current generator.
- `make codegen-check` passed.
- Focused `go test -race` passed for touched packages.
- First `make verify` run failed at Go lint because the network-send refactor left `stringPtr` unused in `internal/daemon/native_tools.go`.
- Removed the dead helper and reran `go test ./internal/daemon -run 'TestDaemonNativeTools' -count=1` successfully.
- Final `make verify` passed.

Now:

- Done.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Plan: `.codex/plans/tools-review-remediation.md`
- Ledger: `.codex/ledger/2026-04-30-MEMORY-tools-review-remediation.md`
- Code areas: `internal/tools`, `internal/api/core`, `internal/api/udsapi`, `internal/daemon`, `internal/cli`, `internal/config`, `.compozy/tasks/tools-refac`.
