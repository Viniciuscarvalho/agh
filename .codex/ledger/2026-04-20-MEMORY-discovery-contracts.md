Goal (incl. success criteria):

- Align network discovery, peer details, and daemon API contracts with the unified capability model for `.compozy/tasks/unified-capabilities/task_04.md`.
- Success requires brief `greet`, rich `whois`, peer-card details, and API payloads to expose one coherent capability shape; required tests and `make verify` must pass.

Constraints/Assumptions:

- Follow `AGENTS.md`/`CLAUDE.md`, task spec, `_techspec.md`, and ADRs under `.compozy/tasks/unified-capabilities/`.
- Preserve discovery transport boundaries: brief in `greet`, rich in `whois`, transfer via `kind:"capability"`.
- Keep scope tight to task_04; update workflow memory and task tracking only after verified completion.
- Auto-commit is enabled only after clean verification and self-review.
- Dependency `task_03` is listed as pending in `_tasks.md`; current branch state must be inspected before assuming unmet dependency work.

Key decisions:

- Treat the existing PRD/task documents as the approved design source for this implementation run.
- Preserve protocol boundaries while changing daemon/API contracts: `greet` stays brief, `whois` stays rich and explicit, and API payloads will expose typed capability DTOs instead of raw capability ext blobs.
- Retain rich capability catalogs in peer state when available so peer detail surfaces can stay coherent with brief discovery.

State:

- Completed.

Done:

- Read workflow memory, task spec, `_tasks.md`, ADRs, and repository guidance.
- Loaded required skill instructions: `cy-workflow-memory`, `cy-execute-task`, `cy-final-verify`, `brainstorming`, `golang-pro`.
- Identified the pre-change gap: runtime transport behavior is mostly in place, but rich discovery still drops unified fields and daemon/API contracts still expose string-only peer capabilities plus raw capability ext blobs.
- Updated rich `whois` capability discovery and peer-state caching to preserve unified fields (`version`, `digest`, `requirements`, etc.) and keep cached catalogs coherent with brief discovery.
- Reworked daemon/API contracts so `peer_card.capabilities` is typed brief payloads and peer detail exposes `capability_catalog`, while API-visible `ext` no longer carries capability discovery blobs.
- Regenerated OpenAPI output and adjusted frontend/CLI/e2e fixtures that compile against the new typed contract.
- Fixed a self-review regression where filtered rich `whois` catalogs could blank unrelated brief summaries by merging rich summaries over `greet` brief summaries.
- Ran targeted package tests, coverage checks, and a final passing `make verify`.
- Created local commit `caeee323` (`feat: align discovery contracts with unified capabilities`).

Now:

- Prepare final handoff with verification evidence and note that task tracking/memory files remain intentionally unstaged.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether dependency `task_03` is already effectively implemented on this branch despite `_tasks.md` still showing pending.

Working set (files/ids/commands):

- `.compozy/tasks/unified-capabilities/task_04.md`
- `.compozy/tasks/unified-capabilities/_techspec.md`
- `.compozy/tasks/unified-capabilities/_tasks.md`
- `.compozy/tasks/unified-capabilities/adrs/adr-001.md`
- `.compozy/tasks/unified-capabilities/adrs/adr-002.md`
- `.compozy/tasks/unified-capabilities/adrs/adr-003.md`
- `.compozy/tasks/unified-capabilities/memory/MEMORY.md`
- `.compozy/tasks/unified-capabilities/memory/task_04.md`
