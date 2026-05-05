Goal (incl. success criteria):

- Remediate CodeRabbit batched review issues 001-020 for PRD `release-adjustments`, round 001, PR 66.
- Read and triage every scoped issue file, implement complete fixes/tests for valid issues, run full verification, mark issues resolved, and create exactly one local commit if verification is clean.

Constraints/Assumptions:

- Follow `cy-fix-reviews` workflow as source of truth.
- Use `cy-final-verify` before completion/commit.
- Do not call provider-specific scripts, `gh` mutations, or external resolution commands.
- Do not edit issue files outside `/Users/pedronauck/Dev/compozy/agh/.compozy/tasks/release-adjustments/reviews-001/issue_001.md` through `issue_020.md`.
- Keep code edits constrained to batch scope unless technically required and documented.
- Never run destructive git commands without explicit user permission.

Key decisions:

- Use `make verify` as the full repository verification gate unless fresh project evidence shows otherwise.
- Read all issue files completely before editing code.

State:

- Completed.

Done:

- Loaded required workflow skills: `cy-fix-reviews`, `cy-final-verify`, plus Go/test/debugging guardrail skills.
- Read review `_meta.md` for round 001.
- Read all scoped issue files `issue_001.md` through `issue_020.md` completely.
- Triaged issues: `issue_001` invalid because TOML v2 is imported; `issue_002` through `issue_020` valid.
- Implemented code/test fixes for valid issues and regenerated OpenAPI artifacts after contract JSON tag changes.
- Targeted Go tests passed for affected non-integration packages.
- Touched Teams integration test passed in isolation with `go test -tags integration ./internal/extension -run TestTeamsProviderLaunchNegotiatesBridgeRuntime -v`.
- Web gates passed: `make web-typecheck`, `make web-lint`.
- Full `make verify` passed after implementation fixes.
- Scoped issue files `issue_001.md` through `issue_020.md` are marked `status: resolved`.
- Final `make verify` passed after all issue metadata updates.
- `git diff --cached --check` passed.
- Staged batch files only; unrelated existing worktree changes remain unstaged.
- Created local commit `6afb5c8a` (`fix: resolve release adjustment review batch`).
- Post-commit `make verify` passed against the final committed code and current worktree.

Now:

- Done.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Review dir: `.compozy/tasks/release-adjustments/reviews-001`
- Issue files: `issue_001.md` through `issue_020.md`
- Code scope: files listed in the user batch scope.
