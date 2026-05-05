Goal (incl. success criteria):

- Create the first documentation illustration for `packages/site`, starting with `/runtime/core/`, inspired by the provided hand-drawn explainer style but adapted to AGH's warm-dark design language and suitable for the docs surface.
- Success means: clear visual summary of the `Core Concepts` page, aligned to AGH tokens, usable as a project asset in `packages/site/public/images/...`.

Constraints/Assumptions:

- User wants an illustration asset, not an SVG/code-native diagram.
- Must use the `imagegen` skill workflow for bitmap generation.
- Creative/design work requires upfront concept/design validation before implementation.
- AGH design constraints apply: dark mode only, warm near-black canvas, restrained accent orange `#E8572A`, no white-background aesthetic, no blue/purple bias, no heavy shadows.
- Reference image is stylistic inspiration only; output should match AGH brand more closely.

Key decisions:

- Focus the first illustration on the `/runtime/core/` landing page itself, which is a three-lane hub:
  1. Start Running AGH
  2. Understand the Runtime Model
  3. Operate and Extend the Runtime
- Use existing docs IA and copy tone as the narrative base instead of inventing new product framing.
- Inspect both MDX source and rendered localhost page before proposing the composition.
- User selected concept 2: `Operator Journey Storyboard`.
- Initial dark AGH-branded storyboard direction was rejected by the user.
- Revised direction: stay with the operator-journey/storyboard concept, but render it as a hand-drawn comic/explainer poster much closer to the provided reference image, without forcing landing-page illustration consistency.

State:

- In progress. Poster v3 with octopus-based mascot swap completed and saved; awaiting user approval or further art direction.

Done:

- Read repo-wide `AGENTS.md` / `CLAUDE.md` instructions already supplied in prompt.
- Confirmed no deeper `AGENTS.md` under `packages/site/`.
- Read relevant skill instructions: `imagegen`, `brainstorming`, `agh-design`, `design-taste-frontend`, `minimalist-ui`.
- Inspected AGH design tokens in `DESIGN.md` and `packages/ui/src/tokens.css`.
- Read `/runtime/core/index.mdx` and overview docs to capture the page narrative.
- Opened and inspected `http://localhost:3000/runtime/core/` in the browser.
- Presented 3 composition directions and received approval for option 2.
- Generated first draft `core-concepts-storyboard-v1` in a dark cinematic AGH style.
- User feedback: too dark / high-tech; documentation illustration should lean much closer to the comic/explainer reference image.
- Generated a second draft in comic/explainer poster style and saved it as `packages/site/public/images/runtime/core-concepts-storyboard-v2.png`.
- Edited the poster to replace the square orange mascot with a simplified octopus-inspired mascot based on the provided reference image.
- Saved the mascot-swapped result as `packages/site/public/images/runtime/core-concepts-storyboard-v3.png`.

Now:

- Present the saved v3 asset for review and capture any final mascot/style adjustments.

Next:

- Re-evaluate page integration only after style approval.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether the approved comic/explainer style should become the default for the other docs illustrations too.

Working set (files/ids/commands):

- `packages/site/content/runtime/core/index.mdx`
- `packages/site/content/runtime/core/overview/what-is-agh.mdx`
- `packages/site/content/runtime/core/overview/architecture.mdx`
- `packages/ui/src/tokens.css`
- `DESIGN.md`
- Browser target: `http://localhost:3000/runtime/core/`
- Existing assets: `packages/site/public/images/bento-illustrations/*.png`, `packages/site/public/images/runtime/illustration_1.png`
- Planned output: `packages/site/public/images/runtime/core-concepts-storyboard-v1.png`
