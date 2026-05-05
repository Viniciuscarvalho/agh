Goal (incl. success criteria):

- Generate one production-ready SVG cover for the blog post `Introducing AGH, the first Agent Network Protocol`.
- Save the asset at `packages/site/public/static/blog/introducing-agh-cover.svg`.
- Replace the current inline featured-post protocol placeholder on `/blog` with the saved SVG so the featured card uses the production asset.
- Finish with verification evidence, ideally `make verify`.

Constraints/Assumptions:

- Follow root `AGENTS.md`, `packages/site/AGENTS.md`, `packages/site/CLAUDE.md`, and `DESIGN.md`.
- Use exact brand/design tokens from the brief and keep the asset flat: no shadows, no blur, no generic gradient canvas.
- Keep the output as pure SVG with root `role="img"` and required `aria-label`.
- Do not touch unrelated worktree changes or use destructive git commands.
- User brief is specific enough to skip exploratory design back-and-forth and execute directly.

Key decisions:

- Use the existing `public/static/blog/` path as the canonical served asset location instead of introducing a new asset pipeline.
- Replace the inline placeholder in `packages/site/components/blog/featured-post.tsx` with a static SVG render path rather than broadening the blog UI schema.
- Keep the fallback placeholder logic unnecessary because the featured post is currently the AGH protocol launch post and this task is specifically for that card.

State:

- In progress

Done:

- Read root instructions from user context.
- Read `packages/site/CLAUDE.md`, `packages/site/AGENTS.md`, `DESIGN.md`, and `docs/design/design-system/README.md`.
- Read relevant design skills: `brainstorming`, `agh-design`, `design-taste-frontend`, and `minimalist-ui`.
- Inspected `packages/site/components/blog/featured-post.tsx`, `packages/site/app/blog/page.tsx`, `packages/site/lib/blog.ts`, and the featured post MDX.
- Confirmed the featured post is `posts/introducing-agh-the-first-agent-network-protocol.mdx`.
- Confirmed `packages/site/public/static/blog/` exists and is currently empty.

Now:

- Author the SVG asset and patch the featured blog component to use it.

Next:

- Run generation/checks and then `make verify`.

Open questions (UNCONFIRMED if needed):

- Final chat response format is ambiguous because the task asks both for raw SVG markup and for a path + summary after writing the file. Need choose the safest completion format after implementation.

Working set (files/ids/commands):

- `packages/site/public/static/blog/introducing-agh-cover.svg`
- `packages/site/components/blog/featured-post.tsx`
- `packages/site/content/blog/posts/introducing-agh-the-first-agent-network-protocol.mdx`
- `packages/site/CLAUDE.md`
- `packages/site/AGENTS.md`
- `DESIGN.md`
- `docs/design/design-system/README.md`
- `make verify`
