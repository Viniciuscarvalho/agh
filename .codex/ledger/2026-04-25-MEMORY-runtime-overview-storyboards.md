Goal (incl. success criteria):

- Create overview storyboard illustrations for every `packages/site/content/runtime/core/*/index.mdx` category except `network`, plus the top-level `packages/site/content/runtime/index.mdx` landing page, matching the established hand-drawn explainer style of the existing runtime storyboards.
- Success means: each target page gets a final project-bound raster asset in `packages/site/public/images/runtime/`, every illustration includes the octopus mascot, layouts vary by category while remaining stylistically consistent, and overview pages reference the correct images where needed.

Constraints/Assumptions:

- User explicitly invoked the `imagegen` skill; built-in `image_gen` is the default path.
- `network` already has an overview storyboard and is excluded from new asset creation.
- Style anchors are `packages/site/public/images/runtime/network-overview-storyboard-v2.png` and `packages/site/public/images/runtime/core-concepts-storyboard-v3.png`.
- The octopus mascot is mandatory in every new illustration, but can change pose, props, and silhouette details to fit each category.
- Must not overwrite unrelated worktree changes.

Key decisions:

- Use the existing runtime storyboard language as the canonical visual baseline rather than inventing a new docs illustration system.
- Read each overview page to derive category-specific compositions instead of applying one generic card layout across all assets.
- Treat this as project-bound asset work: final images will be copied into the workspace under `packages/site/public/images/runtime/`.
- Update overview pages only where image references are missing or outdated.

State:

- Completed.

Done:

- Read root project instructions supplied in prompt and confirmed web-scoped instructions in `web/AGENTS.md` and `web/CLAUDE.md`.
- Read required skills: `imagegen`, `agh-design`, `design-taste-frontend`, `minimalist-ui`; reviewed `brainstorming` and decided not to let its approval gate block direct execution because the request is already concrete and the workspace instructions prefer direct completion.
- Read related ledgers for prior runtime storyboard work.
- Confirmed relevant existing assets under `packages/site/public/images/runtime/`.
- Generated and saved 11 new overview storyboard assets:
- Generated and saved 11 new overview storyboard assets:
  - `agents-overview-storyboard-v1.png`
  - `automation-overview-storyboard-v1.png`
  - `bridges-overview-storyboard-v1.png`
  - `configuration-overview-storyboard-v1.png`
  - `extensions-overview-storyboard-v1.png`
  - `hooks-overview-storyboard-v1.png`
  - `memory-overview-storyboard-v1.png`
  - `operations-overview-storyboard-v1.png`
  - `sessions-overview-storyboard-v1.png`
  - `skills-overview-storyboard-v1.png`
  - `workspaces-overview-storyboard-v1.png`
- Generated and saved `runtime-overview-storyboard-v1.png` for `packages/site/content/runtime/index.mdx`.
- Inserted matching `<figure>` blocks and alt text into the corresponding overview pages under `packages/site/content/runtime/core/*/index.mdx`.
- Inserted a matching `<figure>` block and alt text into `packages/site/content/runtime/index.mdx`.
- Verified docs generation and typing with `bun run --cwd packages/site source:generate` and `bun run --cwd packages/site typecheck`.
- Verified repo gate with `make verify` (passed, rerun after the runtime landing page change).
- Refreshed `http://localhost:3000/runtime/` in Arc and confirmed the new runtime poster renders on the live page.

Now:

- Task complete; ready for user review or targeted art-direction changes.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `packages/site/content/runtime/index.mdx`
- `packages/site/public/images/runtime/core-concepts-storyboard-v3.png`
- `packages/site/public/images/runtime/network-overview-storyboard-v2.png`
- `packages/site/public/images/runtime/runtime-overview-storyboard-v1.png`
- `packages/site/content/runtime/core/*/index.mdx`
- `packages/site/public/images/runtime/`
- Commands: `rg`, `sed`, `sips`, `bun run --cwd packages/site source:generate`, `bun run --cwd packages/site typecheck`, `make verify`
