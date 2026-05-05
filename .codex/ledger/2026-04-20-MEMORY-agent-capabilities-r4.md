Goal (incl. success criteria):

- Resolve review round `004` for `agent-capabilities` within the scoped files:
  - `internal/config/agent_capabilities_test.go`
  - `internal/config/capabilities.go`
  - `internal/network/capability_catalog_test.go`
  - `internal/network/router_integration_test.go`
- Success means: every scoped issue file is triaged and closed correctly, all valid fixes land with regression coverage where needed, `make verify` passes after the last code change, and exactly one local commit is created.

Constraints/Assumptions:

- Use `cy-fix-reviews` as the remediation workflow source of truth.
- Use `cy-final-verify` before any completion claim or commit.
- Do not edit issue files outside `.compozy/tasks/agent-capabilities/reviews-004/`.
- Do not use destructive git commands.
- Repository instructions require root-cause fixes, not workaround patches.
- `docs/agents/capabilities.md` is relevant read-only context for issue validation because it documents directory-mode loader behavior.

Key decisions:

- Session ledger slug is `agent-capabilities-r4` to avoid colliding with other active ledgers.
- Initial triage outcome:
  - `issue_001.md`: valid
  - `issue_002.md`: invalid
  - `issue_003.md`: valid
  - `issue_004.md`: valid
- Issue 002 is invalid because directory-mode behavior already documents and tests "regular files only"; following symlinks would expand filesystem trust rather than fix a bug.

State:

- in_progress

Done:

- Read workspace instructions from `AGENTS.md` and `CLAUDE.md`.
- Read required skills: `cy-fix-reviews`, `cy-final-verify`, `systematic-debugging`, `no-workarounds`, `testing-anti-patterns`, and `golang-pro`.
- Scanned existing `.codex/ledger/*-MEMORY-*.md` files and read recent `agent-capabilities` ledgers for cross-agent awareness.
- Read review round metadata from `.compozy/tasks/agent-capabilities/reviews-004/_meta.md`.
- Read all four scoped issue files completely before editing.
- Inspected the four scoped code files plus supporting tests/docs needed to validate the findings.
- Updated the four scoped issue files from `pending` to `valid` or `invalid` with concrete triage reasoning.
- Reworked `internal/config/agent_capabilities_test.go` to isolate the three precedence assertions into `Should...` subtests.
- Renamed the subtest table case names in `internal/network/capability_catalog_test.go` to `Should...` form.
- Raised the rich-`whois` integration-test peer registry expiry windows in `internal/network/router_integration_test.go` from `50ms` to `time.Second`.
- Verified focused coverage with:
  - `go test ./internal/config -count=1`
  - `go test ./internal/network -run 'TestParseWhoisCapabilityDiscoveryRequestCapabilityFilterPresence|TestProjectWhoisCapabilityCatalogDistinguishesAbsentAndExplicitEmptyFilters' -count=1`
  - `go test -tags integration ./internal/network -run 'TestDirectedWhoisRichDiscoveryDeliversPeerCardAndCapabilityCatalog|TestDirectedWhoisRichDiscoveryFilteringRefreshesRemotePresence' -count=1`
- Ran `make verify` successfully after the final code changes.
- Marked all four review files `resolved`.

Now:

- Stage only the scoped batch files and create the required single local commit.

Next:

- Report the completed batch with verification evidence and note the non-blocking unrelated golangci-lint runner warning emitted during `make verify`.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-20-MEMORY-agent-capabilities-r4.md`
- `.compozy/tasks/agent-capabilities/reviews-004/_meta.md`
- `.compozy/tasks/agent-capabilities/reviews-004/issue_001.md`
- `.compozy/tasks/agent-capabilities/reviews-004/issue_002.md`
- `.compozy/tasks/agent-capabilities/reviews-004/issue_003.md`
- `.compozy/tasks/agent-capabilities/reviews-004/issue_004.md`
- `internal/config/agent_capabilities_test.go`
- `internal/config/capabilities.go`
- `internal/config/capabilities_test.go`
- `internal/network/capability_catalog_test.go`
- `internal/network/router_integration_test.go`
