Goal (incl. success criteria):

- Update the TechSpec authoring workflow so `cy-create-techspec` gets user approval on the full draft before any peer review, then offers `cy-spec-peer-review` as an optional, user-directed step with explicit incorporation choices and optional extra rounds.
- Success criteria: all normative instructions for this flow are internally consistent across root guidance, preflight checks, and the two skill files.

Constraints/Assumptions:

- The user wants less bureaucracy and no automatic peer-review loop.
- Peer review must remain available, but only after the user approves the draft and explicitly opts in.
- Do not touch historical analysis artifacts unless needed; prefer updating active/normative instructions only.
- Follow non-destructive git rules and maintain this session ledger.

Key decisions:

- Align the flow across `AGENTS.md`, `CLAUDE.md`, `cy-create-techspec`, `cy-spec-peer-review`, `cy-spec-preflight`, and the spec authoring playbook.
- Keep `docs/_memory/analysis/*` and similar evidence artifacts unchanged because they record prior behavior, not active policy.
- Save the approved TechSpec draft before optional peer review so `cy-spec-peer-review` can operate on a concrete `_techspec.md` path.

State:

- Completed.

Done:

- Read root `AGENTS.md` instructions from the user prompt and root `CLAUDE.md`.
- Scanned existing ledgers for related TechSpec/review context.
- Read the `skill-best-practices` and `agent-md-refactor` skills because this task edits skill instructions.
- Read `.agents/skills/cy-create-techspec/SKILL.md`.
- Read `.agents/skills/cy-spec-peer-review/SKILL.md`.
- Located conflicting normative references that still force automatic pre-approval peer review in:
  - `AGENTS.md`
  - `CLAUDE.md`
  - `.agents/skills/cy-spec-preflight/SKILL.md`
  - `docs/_memory/spec-authoring-playbook.md`
- Confirmed `docs/_memory/standing_directives.md` and `quality-markers.md` also benefit from wording alignment.
- Patched the active instruction files so the authoritative flow is now:
  - user reviews and approves the complete TechSpec draft first
  - the approved draft is saved to `_techspec.md`
  - peer review is offered afterward as an explicit opt-in
  - review findings are summarized before any edits
  - the user chooses what to incorporate
  - extra review rounds happen only on explicit request
- Validated the updated skill metadata:
  - `cy-create-techspec`
  - `cy-spec-peer-review`
- Re-ran repository searches to confirm the old mandatory pre-approval peer-review wording is no longer present in the patched normative files.
- Ran `make verify` successfully after the instruction updates.
- Applied one final consistency fix in `cy-spec-peer-review` error handling and re-ran `make verify` successfully against the final tree state.

Now:

- Task complete.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None at the moment.

Working set (files/ids/commands):

- `AGENTS.md`
- `CLAUDE.md`
- `.agents/skills/cy-create-techspec/SKILL.md`
- `.agents/skills/cy-spec-peer-review/SKILL.md`
- `.agents/skills/cy-spec-preflight/SKILL.md`
- `.agents/skills/cy-spec-peer-review/references/quality-markers.md`
- `docs/_memory/spec-authoring-playbook.md`
- `docs/_memory/standing_directives.md`
- `rg -n "peer-review|peer review|cy-spec-peer-review|Every TechSpec is peer-reviewed before approval|TechSpec creation" ...`
- `sed -n`
