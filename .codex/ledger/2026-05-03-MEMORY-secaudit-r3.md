Goal (incl. success criteria):

- Remediate the `secaudit` CodeRabbit review batch for PR 90 round 003 in `/Users/pedronauck/Dev/compozy/agh2`. Success means the scoped issue file is triaged and closed correctly, any valid fix is implemented in scope, `make verify` passes, and exactly one local commit is created.

Constraints/Assumptions:

- Scope is limited to `.compozy/tasks/secaudit/reviews-003/issue_001.md` and the scoped code file `internal/network/validate_test.go`.
- Do not run destructive git commands or provider-specific review-resolution commands.
- Use `cy-fix-reviews` as the workflow source of truth and `cy-final-verify` before any completion claim or commit.
- Conversation in Brazilian Portuguese; code/artifacts stay in English.

Key decisions:

- Work in `agh2` because the batch scope and review artifacts point there.
- Treat prior `secaudit` ledgers as read-only context from completed rounds.
- The finding is valid: the touched table-driven test block violates the mandatory `Should ...` subtest naming rule, so the local fix should normalize the affected table names instead of selectively renaming only a subset.

State:

- In progress.

Done:

- Loaded the required skills: `cy-fix-reviews`, `cy-final-verify`, `systematic-debugging`, `no-workarounds`, `agh-test-conventions`, and `golang-pro`.
- Read the root and `internal/` instructions for `agh2`.
- Listed ledger files and read the related `secaudit` ledgers from rounds 001 and 002 for cross-agent awareness.
- Read the scoped review issue file completely.
- Inspected `internal/network/validate_test.go` and confirmed the cited table-driven cases currently use plain names, with `t.Run(tc.name, ...)`.

Now:

- Update the issue file triage/status and rename the relevant table-driven test case names in `internal/network/validate_test.go`.

Next:

- Run focused validation on the touched test file/package.
- Run full `make verify`.
- If verification passes, create the single required local commit and rerun `make verify` post-commit.

Open questions (UNCONFIRMED if needed):

- Whether the repo’s test-convention helper lives outside `scripts/`; locate and use it if present.

Working set (files/ids/commands):

- Ledger: `.codex/ledger/2026-05-03-MEMORY-secaudit-r3.md`
- Review file: `.compozy/tasks/secaudit/reviews-003/issue_001.md`
- Scoped code file: `internal/network/validate_test.go`
- Commands run: `git status --short`, `sed -n '220,460p' internal/network/validate_test.go`, `rg -n 't.Run\\(' internal/network/validate_test.go`
