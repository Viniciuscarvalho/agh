Goal (incl. success criteria):

- Resolve review batch `mem-improvs` round `003` for PR `35`.
- Update only scoped review files under `.compozy/tasks/mem-improvs/reviews-003/`.
- Fix all valid findings in the memory catalog/search path and mage test path.
- Run fresh full verification and create exactly one local commit if verification passes.

Constraints/Assumptions:

- Required skills: `cy-fix-reviews`, `cy-final-verify`.
- Project rules also require root-cause debugging, no workaround fixes, and proper Go test practice.
- Do not use destructive git commands or provider-specific review resolution commands.
- Batch issue files are the only review-progress files allowed to change.
- Test file edits outside the listed code files are allowed only if minimally required to validate a fix.

Key decisions:

- Issue `001` is valid: current `rows.Close()` suppression needs explicit justification at the defer sites.
- Issue `002` is valid: `Store.Search` validates tokenless queries too late and does not clamp large limits before catalog warm-up.
- Issue `003` is valid: readiness is inferred only from row count, so legitimately empty scopes reindex forever.
- Issue `004` is valid: robust typed error assertions require a sentinel in `magefile.go`, which is outside the listed code-file scope but is the minimal root-cause fix.

State:

- Implementation and verification complete; issue-file closeout and commit in progress.

Done:

- Loaded required skill instructions.
- Read `_meta.md` and all four scoped issue files completely.
- Inspected `internal/memory/catalog.go`, `internal/memory/store.go`, `magefile.go`, `magefile_test.go`, and relevant existing tests.
- Checked worktree status; only the review directory is untracked.
- Triaged all four scoped issue files as valid.
- Added search-query validation, bounded search limits, and persisted empty-scope readiness handling in the memory catalog/store path.
- Added regression coverage in `internal/memory/store_test.go` and converted the mage error assertions to `errors.Is`/`errors.As` with a production sentinel in `magefile.go`.
- Ran targeted checks for `internal/memory` and magefile tests.
- Ran `make verify` successfully after the final code changes.

Now:

- Update the four scoped issue files to `resolved` and create the required local commit.

Next:

- Remove the session ledger after final handoff if no further turn is needed.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.compozy/tasks/mem-improvs/reviews-003/_meta.md`
- `.compozy/tasks/mem-improvs/reviews-003/issue_001.md`
- `.compozy/tasks/mem-improvs/reviews-003/issue_002.md`
- `.compozy/tasks/mem-improvs/reviews-003/issue_003.md`
- `.compozy/tasks/mem-improvs/reviews-003/issue_004.md`
- `internal/memory/catalog.go`
- `internal/memory/store.go`
- `internal/memory/store_test.go`
- `magefile.go`
- `magefile_test.go`
- Commands: `git status --short`, `sed`, `rg`, `gofmt -w ...`, `go test ./internal/memory -run 'TestStoreSearchAndReindex|TestStoreSearchTreatsFTSReservedWordsAsLiteralTerms'`, `go test -tags mage -run TestRunRaceEnabledGoCommand magefile.go magefile_test.go`, `make verify`
