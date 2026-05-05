## Goal (incl. success criteria):

- Produce a concise structured report on how `.resources/claude-code` updates itself, covering CLI UX, distribution channel, manifest/version lookup, integrity/signature verification, replacement/install path strategy, platform differences, rollback/failure handling, docs/tests, with concrete file references.

## Constraints/Assumptions:

- Read-only user task for repo content; no project code edits.
- Session ledger artifact required by workspace policy.
- Focus on local reference repo under `.resources/claude-code`, not web research.

## Key decisions:

- Use `cy-research-competitors` guidance as the closest matching read-only analysis workflow.
- Trace from CLI entrypoints into installer/update scripts and related docs/tests.

## State:

- Completed.

## Done:

- Read root task instructions and `internal/CLAUDE.md`.
- Located competitor-research skill and `.resources/claude-code` tree.
- Scanned existing ledger inventory for cross-agent awareness.
- Traced `claude update`, native installer, npm/local installer, package-manager updater, install command, diagnostics, and rollback entrypoint references.
- Collected concrete file/line references for UX, distribution, version lookup, integrity checks, install path strategy, platform differences, and failure handling.

## Now:

- Preparing final report.

## Next:

- None.

## Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: the actual `src/cli/rollback.js` implementation is not present in this extracted snapshot, so rollback behavior can only be inferred from command wiring and UI references.

## Working set (files/ids/commands):

- `.resources/claude-code/`
- `.agents/skills/cy-research-competitors/SKILL.md`
- `internal/CLAUDE.md`
- `rg`, `sed`, `find`
