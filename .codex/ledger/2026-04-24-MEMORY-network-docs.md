Goal (incl. success criteria):

- Add missing Runtime documentation coverage for AGH's internal Network protocol so it appears alongside the other Runtime categories.
- Success: Runtime Core has Network docs/navigation and an overview summary image asset in the style of `core-concepts-storyboard-v3.png`.

Constraints/Assumptions:

- Must follow documentation-writer skill workflow: clarify doc type/audience/goal/scope, propose structure, await approval before writing full docs.
- Must not touch unrelated dirty worktree changes.
- Must not run destructive git commands.
- Root AGENTS/CLAUDE apply; no deeper AGENTS found under `packages/site`.
- Existing CLI reference already has `packages/site/content/runtime/cli-reference/network/*`; missing area appears to be conceptual/core Runtime docs.

Key decisions:

- Treat this as Runtime core docs work, not CLI reference work, unless user clarifies otherwise.
- User approved proposed 5-page structure.
- Include a short v1/trust profile note only as future direction; document current behavior as `agh-network/v0`.
- Generate/save a project-bound overview image under `packages/site/public/images/runtime/`.

State:

- Updating generated Network image to include AGH octopus mascot.

Done:

- Read documentation-writer skill.
- Scanned ledger directory for cross-agent awareness.
- Checked git status; many unrelated modified/untracked files exist.
- Confirmed `packages/site/content/runtime/cli-reference/network/*` exists.
- Confirmed `packages/site/content/runtime/core/meta.json` has no `network` entry.
- Confirmed `packages/site/content/runtime/core/index.mdx` lacks Network in the core concept route lists.
- Reviewed `internal/network` and RFC docs for protocol facts: v0 envelope, channels, peers, seven kinds, presence, delivery, audit/timeline, task ingress, CLI/API surfaces.
- User approved structure and requested a summary image matching the core concepts storyboard style.
- Read design guidance and inspected `core-concepts-storyboard-v3.png` (1536x1024).
- Generated and copied `packages/site/public/images/runtime/network-overview-storyboard-v1.png`.
- Added Network docs: overview, protocol, channels/peers, delivery/safety, task ingress.
- Added `network` to `packages/site/content/runtime/core/meta.json`.
- Added Network route card to `packages/site/content/runtime/core/index.mdx`.
- Added Network to Runtime recommended reading paths.
- Verification passed:
  - `bun run --cwd packages/site source:generate`
  - `bun run --cwd packages/site typecheck`
  - `make site-build` after fixing quoted YAML description in `protocol.mdx`
  - `make verify` exit 0; web tests 190 files/1411 tests, Go tests 5820 tests, package boundaries respected.
- User noted the generated Network image missed the octopus mascot.
- Generated mascot-corrected image and copied it to `packages/site/public/images/runtime/network-overview-storyboard-v2.png`.
- Updated Network overview MDX image reference from v1 to v2.

Now:

- Run fresh docs/site and full repository verification after image reference update.

Next:

- Final response with corrected image path and verification evidence.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- Planned likely area: `packages/site/content/runtime/core/network/*`, `packages/site/content/runtime/core/meta.json`, possibly `packages/site/lib/runtime-navigation.ts`.
- Commands run: `git status --short`, `rg --files ...`, `date +%F`.
