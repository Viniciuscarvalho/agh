Goal (incl. success criteria):

- Define the best way to add agent-declared capabilities into AGH agent definitions, aligned with `docs/rfcs/003_agh-network-v0.md`, `docs/rfcs/001_agent-md-with-skills-memory.md`, and `internal/config/agent.go`.
- Produce grounded design options and progress toward a TechSpec process without writing `_techspec.md` before user approval.

Constraints/Assumptions:

- User explicitly asked to use `qmd` to inspect local docs for prior mentions.
- Task is design/spec work, not implementation yet.
- Must avoid workaround-style design; capabilities must be modeled at the correct boundary rather than bolted on later.
- No destructive git commands.
- `cy-create-techspec` requires interactive clarification; runtime lacks blocking question tool, so questions must be asked as the complete assistant message when reached.
- `cy-create-tasks` follow-up uses `.compozy/tasks/agent-capabilities/_techspec.md` as the primary artifact because `_prd.md` is absent.
- `.compozy/config.toml` is absent, so task `type` values fall back to the built-in defaults: `frontend`, `backend`, `docs`, `test`, `infra`, `refactor`, `chore`, `bugfix`.

Key decisions:

- Session slug: `agent-capabilities-spec`.
- Initial investigation scope: RFC 003, RFC 001, `internal/config/agent.go`, related ledgers, and local markdown references via `qmd`/repo search.
- User corrected the design boundary: the self-contained unit is the agent directory, not just `agents/<name>/AGENT.md`.
- Sidecar artifacts analogous to `mcp.json` are in-bounds for capability declaration (`capabilities.json`, `capabilities.toml`, etc.).
- User raised a new design direction: support both a single capability file and a `capabilities/` directory for larger cases.
- User explicitly rejected a reduced-scope v1; the target is now the definitive model, not a temporary compromise.
- User clarified the semantic meaning of `capabilities`: they are structured, network-visible execution offerings that can encode non-bureaucratic workflow/process chains (often as ordered skill compositions) so other agents can discover and request them without knowing internal skills or prompt details.
- Capabilities are not strict RPC-style contracts with mandatory typed input/output schemas; they are structured, outcome-oriented delegation offers suited to non-deterministic LLM-first execution, with optional context and artifact hints.
- Current preferred direction: do not introduce `kind` unless it changes runtime behavior; keep `execution_outline` optional and let presence/absence speak for itself.
- User approved the no-`kind` direction: `execution_outline` remains optional and capabilities without it are still fully valid.
- User rejected over-modeling of `execution_outline`: the field should be free-form; the agent can put whatever is useful there, including phases, skills, or other execution notes.
- User wants capability IDs to follow a simple slug style like skills (e.g. `create-landing-page`), not a dotted namespace such as `create.landing-page`.
- Same-named capabilities across different peers are disambiguated operationally by `peer_id + capability_id`; local capability IDs only need to be unique within one agent.
- User accepted brief capability summaries in network discovery; full capability definitions should not be repeated in periodic heartbeats.
- User chose the correct/clean discovery split: `Peer Card` stays brief, and rich capability detail lives in a separate AGH-specific capability catalog within the richer `whois` response shape.
- User accepted the practical two-layer discovery flow for channel operation:
  - overview first (`greet` / brief capability discovery)
  - rich capability detail only for selected peers via follow-up discovery
- User accepted the recommendation that rich capability discovery should be explicit, not automatic on every targeted `whois`.
- User accepted the recommended protocol shape: explicit rich discovery should use a structured AGH-specific extension in `whois`, not overloaded semantics hidden inside `query`.
- User accepted that rich discovery requests should support both:
  - whole-catalog fetch
  - filtered fetch by one or more `capability_ids`
- User wants both TOML and JSON accepted as official local capability catalog serialization formats.
- User reminded that the coexistence rule had already been decided earlier: local authoring is either a single file or a directory, never both at once, and there is no merge semantics between them.
- User accepted removing `_catalog` as an obligatory artifact in directory mode; each capability file should be self-contained, and directory-level manifest metadata is not justified in the current model.
- User explicitly separated two concerns that must not be conflated:
  - AGH Network RFC defines wire/discovery semantics only
  - AGH runtime defines local authoring/loading rules such as TOML vs JSON, file vs directory, and loader validation behavior
- User indicated there is now enough clarified information to draft both:
  - a runtime TechSpec for local capability catalog/loading/projection
  - an update to `docs/rfcs/003_agh-network-v0.md` for wire/discovery semantics

State:

- Approved doc/spec artifacts completed; task set authored and pending `compozy validate-tasks`.

Done:

- Identified governing repo instructions and active task goal.
- Confirmed `qmd` is installed and available.
- Read initial portions of RFC 003, RFC 001, and `internal/config/agent.go`.
- Confirmed with `qmd` that RFC 001 already states Agent Cards/discovery metadata could be generated from `AGENT.md`.
- Confirmed the runtime/network gap: local peers currently join with `DefaultPeerCard(...)` and `Capabilities: []string{}`.
- Wrote focused audit report: `.audits/architectural-analysis-2026-04-18-agent-capabilities.md`.
- Ran `compozy exec --ide claude --model opus` to expand the brainstorming space with an external design pass.
- Opus returned 6 options and recommended a TOML sidecar hybrid: keep `AGENT.md` as the prose/identity surface and move structured capability metadata into `capabilities.toml`, with deterministic projection into `PeerCard.capabilities`.
- Reframed the problem after user clarification: capability is not merely a discovery tag or grant; it is closer to a structured callable process contract that may internally chain skills.
- Analyzed network feasibility for capability summaries:
  - RFC v0 and runtime both allow up to 1 MB payloads.
  - `greet` is a periodic heartbeat (default 30s), so repeated payload size matters operationally.
  - Current runtime does not deliver `greet` messages into agent prompt context; they refresh the peer registry only.
  - Quick payload sizing shows even 100 capability summaries with short text stays around ~11 KB per `greet`, far below the 1 MB limit.
- Converged on a discovery split:
  - brief capability discovery belongs in `greet` / `PeerCard`
  - rich capability detail belongs in a richer discovery path such as targeted `whois`
- Re-confirmed the local loading rule after user correction:
  - single-file mode or directory mode
  - never both simultaneously
  - no merge/overlay behavior
- Refined directory mode:
  - no mandatory `_catalog`
  - loader reads self-contained capability files directly
  - directory-level metadata should not exist unless it carries real semantics later
- Refined spec boundary:
  - RFC should cover capability advertisement and rich discovery over the network
  - runtime spec should cover local catalog storage, parsing, validation, and projection into network messages
- Ran a `gpt-5.4-mini` subagent audit against the full conversation log under `~/.codex` plus this ledger:
  - no material inconsistencies found
  - one suggested inference about a default `kind` when omitted was rejected because it conflicts with the explicit decision to not model `kind`
- Saved approved runtime TechSpec under `.compozy/tasks/agent-capabilities/_techspec.md`.
- Created ADRs:
  - `.compozy/tasks/agent-capabilities/adrs/adr-001.md`
  - `.compozy/tasks/agent-capabilities/adrs/adr-002.md`
  - `.compozy/tasks/agent-capabilities/adrs/adr-003.md`
- Updated `docs/rfcs/003_agh-network-v0.md` with the approved capability discovery delta:
  - clarified minimal `Peer Card` capability semantics
  - added AGH brief capability discovery in `greet`
  - added explicit rich capability discovery in `whois`
  - strengthened capability-confusion guidance
- Ran `make verify`; it failed due to unrelated existing issues outside this task:
  - `internal/store/globaldb/global_db_task_aux.go:585` `gocyclo`
  - `internal/observe/tasks.go:1749` `gosec` G202 SQL string concatenation
- Ran `compozy exec --ide claude --model opus --reasoning-effort high` for a final external spec review over:
  - `.compozy/tasks/agent-capabilities/_techspec.md`
  - ADRs 001-003
  - `docs/rfcs/003_agh-network-v0.md`
- Claude review findings summary:
  - High: missing `CapabilityBrief` type in TechSpec
  - High: rich `agh.capability_catalog` lacks normative required/optional field schema in RFC
  - High: no guidance for large rich catalogs vs 1 MB envelope limit
  - Medium: no summary-length guidance for periodic `greet`
  - Medium: filename/id rule in directory mode needs extension-stripping wording
  - Medium: no-catalog projection behavior should explicitly say `capabilities=[]` and omit brief ext key
  - Medium: AGH-specific brief IDs should explicitly MUST match `peer_card.capabilities`
  - Medium: filtered `whois` with unknown `capability_ids` needs explicit behavior
  - Low: clarify operational bridge between agent-local IDs and runtime `peer_id + capability_id`
  - Low: observability warning is runtime-only, not wire-visible
  - Low: directory mode should explicitly say which files are loaded/ignored
- Performed code-guided triage against `internal/network/envelope.go`, `internal/network/router.go`, `internal/network/validate.go`, `internal/network/peer.go`, and `internal/config/agent.go`.
- Accepted and applied the materially relevant review findings to the saved docs/spec:
  - defined `CapabilityBrief` in the TechSpec
  - made rich catalog entry fields explicit in RFC (`id`, `summary`, `outcome` required; others optional)
  - added v0 guidance for large rich catalogs under the 1 MB envelope limit
  - added brief summary length guidance for `greet`
  - clarified filename/id matching as basename-without-extension in directory mode
  - made no-catalog projection behavior explicit
  - tightened AGH brief ID alignment with `peer_card.capabilities`
  - defined filtered unknown-ID behavior as empty rich catalog
  - clarified `peer_id + capability_id` as the operational wire identity
  - stated that no-catalog warning is runtime-local only
  - positively specified which files are loaded/ignored in directory mode
- Re-ran `make verify` after the doc/spec updates; it failed on the same unrelated pre-existing issues:
  - `internal/store/globaldb/global_db_task_aux.go:585` `gocyclo`
  - `internal/observe/tasks.go:1749` `gosec` G202 SQL string concatenation
- User approved the `cy-create-tasks` breakdown and explicitly requested non-generic unit/integration test lists in the generated tasks.
- Generated the task artifacts:
  - `.compozy/tasks/agent-capabilities/_tasks.md`
  - `.compozy/tasks/agent-capabilities/task_01.md`
  - `.compozy/tasks/agent-capabilities/task_02.md`
  - `.compozy/tasks/agent-capabilities/task_03.md`
  - `.compozy/tasks/agent-capabilities/task_04.md`
  - `.compozy/tasks/agent-capabilities/task_05.md`
  - `.compozy/tasks/agent-capabilities/task_06.md`
  - `.compozy/tasks/agent-capabilities/task_07.md`
- The generated tasks include:
  - 5 implementation/doc tasks
  - 2 QA tasks modeled after `harness`, one for `/qa-report` and one for `/qa-execution`
  - concrete unit/integration test checklists anchored in real repo files and current runtime/network seams
- Ran `compozy validate-tasks --name agent-capabilities`:
  - exit 0
  - output: `all tasks valid (7 scanned)`
- Re-ran `make verify` after generating the task files; it failed on the same unrelated pre-existing Go lint issues:
  - `internal/store/globaldb/global_db_task_aux.go:585` `gocyclo`
  - `internal/observe/tasks.go:1749` `gosec` G202 SQL string concatenation

Now:

- Report the validated task set, the successful `compozy validate-tasks` result, and the unchanged pre-existing `make verify` failures.

Next:

- Hand off to the user for the next workflow step (`cy-execute-task` or equivalent) starting from `task_01`.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether any future taxonomy should be derived from capability metadata rather than declared explicitly.
- UNCONFIRMED: whether there is already a hidden/older task directory for this topic under `.compozy/tasks/`.

Working set (files/ids/commands):

- `.compozy/tasks/agent-capabilities/_tasks.md`
- `.compozy/tasks/agent-capabilities/task_01.md`
- `.compozy/tasks/agent-capabilities/task_02.md`
- `.compozy/tasks/agent-capabilities/task_03.md`
- `.compozy/tasks/agent-capabilities/task_04.md`
- `.compozy/tasks/agent-capabilities/task_05.md`
- `.compozy/tasks/agent-capabilities/task_06.md`
- `.compozy/tasks/agent-capabilities/task_07.md`
- `docs/rfcs/003_agh-network-v0.md`
- `.compozy/tasks/agent-capabilities/_techspec.md`
- `.compozy/tasks/agent-capabilities/adrs/adr-001.md`
- `.compozy/tasks/agent-capabilities/adrs/adr-002.md`
- `.compozy/tasks/agent-capabilities/adrs/adr-003.md`
- `docs/rfcs/001_agent-md-with-skills-memory.md`
- `internal/config/agent.go`
- `internal/network/peer.go`
- `internal/network/manager.go`
- `.codex/ledger/2026-04-15-MEMORY-runtime-capabilities.md`
- `.audits/architectural-analysis-2026-04-18-agent-capabilities.md`
- `qmd status`
- `qmd search -c agh-rfcs-local`
- `rg -n 'capabilities|capability' ...`
- `make verify`
