Goal (incl. success criteria):

- Replace the current thin Northstar Pay Storybook/default mock data in `web/` with a dense launch-week startup scenario that looks credible in screenshots for marketing, ads, documentation, and capture-based collateral.
- Success means the populated/default stories read like a real cross-functional company in motion, with specialized agents, dense channel traffic, a realistic task backlog, richer sessions and knowledge, regression tests that enforce density/role coverage, and Storybook/web verification passing.

Constraints/Assumptions:

- Conversation in Brazilian Portuguese; saved artifacts, code, and product-facing copy remain in English.
- Accepted plan must be persisted under `.codex/plans/`.
- Do not touch unrelated dirty files under `internal/`.
- Use root-cause changes in shared fixture and scenario sources, not scattered one-off story workarounds.
- Product-facing web copy must align with `COPY.md` and glossary terminology.
- Existing unrelated dirty files under `web/src/systems/settings/**` and `web/src/generated/agh-openapi.d.ts` are not part of this Storybook task and must remain untouched.

Key decisions:

- Scope is broad: route stories, settings route stories, shared shell stories, and major system stories.
- Canonical narrative is a fictional fintech startup in launch week, with executive, finance, product, engineering, GTM, support, compliance, and operations teams all active in the same business moment.
- The Network route/story is the hero screenshot surface and needs the highest density.
- Prefer a Storybook scenario catalog under `web/src/storybook/` and reuse it across system fixture modules instead of patching story files individually.

State:

- Completed.

Done:

- Reviewed root/web instructions plus `COPY.md` and `docs/_memory/glossary.md`.
- Audited Storybook surface size and identified the shared fixture files with the highest leverage.
- Confirmed the current weak spots: `ws_storybook`, `Storybook rollout`, `/workspaces/agh2`, placeholder registries, and Storybook-self-referential task/session/network content.
- Persisted the revised accepted implementation plan under `.codex/plans/2026-05-03-web-storybook-fintech-scenarios.md`.
- Confirmed the previous implementation is still too sparse for marketing use: only a few agent roles, few channels, and too little visible conversation/backlog density.
- Re-opened the task with a new target shape: cross-functional, marketing-heavy, launch-week storytelling.
- Expanded `web/src/storybook/fintech-scenario.ts` into a launch-week scenario catalog with executive, finance, product, engineering, GTM, support, risk, and compliance roles, new workspaces, channels, skills, people, and hero defaults.
- Rebuilt shared fixtures across agent, workspace, knowledge, session, network, tasks, skill, automation, bridges, and settings to consume the denser scenario and to show realistic launch-week data above the fold.
- Updated high-value story surfaces so the network shell/sidebar now renders many channels, a populated launch-room timeline, more specialized agents, and richer transcript/task content.
- Updated Storybook/web regression tests to assert role coverage, density, and new launch-week strings instead of the older risk-only scenario.
- Verification passed:
  - `make web-lint`
  - `make web-typecheck`
  - `bun run --cwd web test:raw src/storybook/web-storybook-stories-and-fixtures.test.tsx src/systems/network/mocks/network-mocks.test.ts src/systems/tasks/mocks/fixtures.test.ts src/systems/session/components/session-chat-runtime-provider.test.tsx`
  - `bun run --cwd web build-storybook`
  - `make verify`

Now:

- Final handoff only.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `.codex/plans/2026-05-03-web-storybook-fintech-scenarios.md`
- `.codex/ledger/2026-05-03-MEMORY-web-storybook-fintech-scenarios.md`
- `web/src/storybook/*`
- `web/src/systems/**/mocks/fixtures.ts`
- `web/src/routes/_app/**/stories/*.stories.tsx`
- `web/src/storybook/web-storybook-stories-and-fixtures.test.tsx`
- `web/src/systems/network/mocks/network-mocks.test.ts`
- `web/src/systems/tasks/mocks/fixtures.test.ts`
- `web/src/systems/session/components/session-chat-runtime-provider.test.tsx`
- `make web-lint`
- `make web-typecheck`
- `bun run --cwd web build-storybook`
- `make verify`
