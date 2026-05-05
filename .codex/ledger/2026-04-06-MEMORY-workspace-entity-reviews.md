Goal (incl. success criteria):

- Remediate CodeRabbit review batch for `workspace-entity` round `002`, update all scoped issue files with triage and resolution, run full verification, and create exactly one local commit if verification passes.

Constraints/Assumptions:

- Scope is limited to the 20 issue files under `.compozy/tasks/workspace-entity/reviews-002/issue_021.md` through `issue_040.md` and the listed code files.
- Must use `cy-fix-reviews` as workflow source of truth and `cy-final-verify` before any completion claim or commit.
- Must not use destructive git commands or provider-specific resolution commands.
- `make verify` is the repository completion gate.

Key decisions:

- Load required remediation, verification, bug-fix, testing, Go, and React skills before triage.
- Triage every issue against the current code before editing production or test files.
- Triage result:
  valid issues are 021, 024, 025, 026, 027, 029, 031, 032, and 033.
  invalid issues are 022, 023, 028, 030, 034, 035, 036, 037, 038, 039, and 040.

State:

- In progress.

Done:

- Read project and workspace instructions.
- Loaded required skills: `cy-fix-reviews`, `cy-final-verify`, `systematic-debugging`, `no-workarounds`, `testing-anti-patterns`, `golang-pro`, `react`.
- Checked `.codex/ledger`; no prior session ledger files were present.
- Read review round metadata and all scoped issue files.
- Updated all issue files from `pending` to `valid` or `invalid` with triage notes.

Now:

- Implement fixes for the nine valid issues and add or update tests.

Next:

- Run targeted checks while fixing.
- Run full verification and create one local commit if clean.

Open questions (UNCONFIRMED if needed):

- None currently.

Working set (files/ids/commands):

- `.compozy/tasks/workspace-entity/reviews-002/_meta.md`
- `.compozy/tasks/workspace-entity/reviews-002/issue_021.md` ... `issue_040.md`
- `make verify`
