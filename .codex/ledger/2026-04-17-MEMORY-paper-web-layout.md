Goal (incl. success criteria):

- Answer where Paper task screens should live in `web/` by mapping the existing route, route-hook, and system-module patterns.
- Success means a concise recommendation that names the likely file paths, the responsibility split, and the patterns/risks to mirror or avoid.

Constraints/Assumptions:

- Do not edit application files.
- Use only local codebase inspection; no web browsing needed.
- The recommendation should follow existing `web/src/routes`, `web/src/hooks/routes`, `web/src/systems`, workspace-aware pages, and generated API adapter patterns.

Key decisions:

- Paper should likely follow the same workspace-aware page structure as `knowledge`, `network`, `bridges`, `automation`, `skills`, and `session`.
- Route files should remain thin composition points; route hooks should own page state and workspace wiring; system modules should own API/query/component logic.

State:

- Context gathered from `web/src/routes`, `web/src/hooks/routes`, `web/src/systems`, `web/src/generated/agh-openapi.d.ts`, and representative workspace-aware pages.

Done:

- Read route files for `_app` pages and the root layout.
- Read all route hooks in `web/src/hooks/routes`.
- Read system module barrels and representative adapters/hooks/components.
- Confirmed there is no existing `paper` or `tasks` system module in `web/src/systems`.

Now:

- Draft the final recommendation.

Next:

- None unless the user asks for deeper mapping or file scaffolding.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether Paper will need only one list screen or a list + detail route pair; the repo pattern supports either.

Working set (files/ids/commands):

- `web/src/routes/_app/*.tsx`
- `web/src/routes/_app/-*.test.tsx`
- `web/src/hooks/routes/use-*.ts`
- `web/src/systems/*`
- `web/src/generated/agh-openapi.d.ts`
