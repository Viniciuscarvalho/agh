Goal (incl. success criteria):

- Rebase the current `vault` branch from `vault-docs` while preserving existing work and resolving any conflicts correctly.
- Success: clean worktree, current branch rebased onto the latest `origin/vault-docs`, no unresolved rebase state, and verification appropriate to any conflict scope.
  Constraints/Assumptions:
- User requested `$git-rebase from vault-docs`; interpreted as using the git-rebase skill to rebase current branch `vault` onto `origin/vault-docs`.
- Do not run destructive git commands (`git restore`, `git checkout`, `git reset`, `git clean`, `git rm`) without explicit permission.
- Create a safety backup before rebasing.
- Use local git inspection for project code; no web search for repo state.
  Key decisions:
- Use the simple linear rebase strategy to preserve the 21 local commits; divergence analysis showed only 3 likely overlapping docs files.
  State:
- Complete.
  Done:
- Read `git-rebase` skill.
- Scanned `.codex/ledger/` and read relevant Vault ledgers for cross-agent awareness.
- Confirmed current branch is `vault`, tracking `origin/vault`; `origin/vault-docs` exists; initial status output showed no porcelain worktree changes.
- Created safety backup branch `backup-rebase-vault-from-vault-docs-20260502_205026`.
- Ran `git fetch origin` successfully.
- Divergence before rebase: `origin/vault-docs...HEAD` = 2 target-only commits and 21 local-only commits.
- Likely overlapping conflict files: `packages/site/content/runtime/core/agents/index.mdx`, `packages/site/content/runtime/core/network/protocol.mdx`, `packages/site/content/runtime/core/sessions/index.mdx`.
- `git rebase origin/vault-docs` stopped at commit `2107c1bc` with one content conflict in `packages/site/content/runtime/core/network/protocol.mdx`.
- Resolved the conflict by preserving both the `vault-docs` Related pages section and the authored-context/network-presence section from the rebased commit; `git diff --check` passed.
- Continued the rebase successfully through commit 21/21; `refs/heads/vault` was updated.
- Post-rebase audit: `origin/vault-docs...HEAD` = 0 target-only commits and 21 local-only commits; no `.git/rebase-merge` or `.git/rebase-apply` state remains.
- `git status --short --branch` shows `vault...origin/vault [ahead 23, behind 21]`, expected because local `vault` was rebased and remote `origin/vault` still has the pre-rebase history.
- First `make verify` failed in `@agh/site#typecheck` because `fumadocs-openapi` was declared in `packages/site/package.json` and `bun.lock` but missing from local `node_modules`.
- Ran `bun install --frozen-lockfile` successfully; it installed 18 packages without changing the lockfile by intent.
- Second `make verify` passed Bun lint/typecheck, then failed in `packages/site/lib/content-frontmatter-quality.test.ts` because `packages/site/content/runtime/core/sessions/health.mdx` frontmatter description was 203 characters.
- Shortened the `health.mdx` description to satisfy the 160-character frontmatter limit while preserving the same technical meaning.
- Focused frontmatter test passed: `bunx vitest run packages/site/lib/content-frontmatter-quality.test.ts`.
- Third `make verify` passed fully: Bun lint/typecheck/tests, web build, Go lint, race tests (`DONE 7740 tests`), build, and boundaries.
- The `health.mdx` frontmatter fix remains as one unstaged working-tree change; it must be committed so the rebased branch is clean.
- Created commit `e2a19421 docs: shorten session health description`.
- Post-commit `make verify` passed fully: Bun lint/typecheck/tests, web build, Go lint, race tests (`DONE 7740 tests`), build, and boundaries.
- Final audit:
  - `git status --short --branch` shows no file changes, only `vault...origin/vault [ahead 24, behind 21]`.
  - `origin/vault-docs...HEAD` = 0 target-only commits and 22 local-only commits.
  - `origin/vault-docs` is an ancestor of `HEAD`.
  - No `.git/rebase-merge` or `.git/rebase-apply` state remains.
  - No conflict markers remain in `packages/site/content/runtime/core/network/protocol.mdx` or `packages/site/content/runtime/core/sessions/health.mdx`.
    Now:
- Done.
  Next:
- None; remote `origin/vault` was not force-pushed.
  Open questions (UNCONFIRMED if needed):
- None.
  Working set (files/ids/commands):
- Ledger: `.codex/ledger/2026-05-02-MEMORY-rebase-vault-docs.md`
- Target/base branch: `origin/vault-docs`
- Current branch: `vault`
- Backup branch: `backup-rebase-vault-from-vault-docs-20260502_205026`
