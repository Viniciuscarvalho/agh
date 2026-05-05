# Goal (incl. success criteria):

- Patch `.compozy/tasks/agh-network/_techspec.md` and related ADRs so the 8 previously identified review issues are actually resolved.
- Re-validate the corrected spec against `docs/rfcs/003_agh-network-v0.md`, `docs/rfcs/004_agh-network-v1.md`, and the current AGH runtime shape.
- Success = the spec/ADR set is internally consistent, implementation-directed, and no longer carries the prior partial/open contradictions.

# Constraints/Assumptions:

- Spec/ADR editing only; no product code changes in this turn.
- Must respect workspace ledger rules and avoid destructive git commands.
- No web search for local project code; use repository files only.
- User explicitly requested multiple agents/reviewers for this workstream.

# Key decisions:

- Close the remaining forks in the spec by choosing one implementation path per concern instead of leaving alternatives inline.
- Keep the local security model explicit: single-user local-operator trust boundary, no supported local broker credential handoff.
- Align ADR-001/003/004/005 with the chosen techspec behavior so later sections do not re-open the earlier findings.

# State:

- completed

# Done:

- Read root instructions (`AGENTS.md`, `CLAUDE.md`) and prior network review ledgers.
- Re-read `.compozy/tasks/agh-network/_techspec.md`, RFCs `003`/`004`, and the relevant runtime code in `internal/session`, `internal/acp`, `internal/daemon`, and `internal/api/contract`.
- Patched `_techspec.md` to resolve the remaining contradictions:
  - late-bound boot wiring via setters only
  - session-scoped skill injection after prompt assembly / before ACP start
  - explicit `PromptWithOpts` + `TurnSource` propagation
  - per-session delivery workers with no global `deliveryLoop`
  - sender-side presence preflight + remote peer cache model
  - in-memory-only NATS auth token, no local credential handoff
  - safe `<network-message>` wrapper with escaped preview + base64 JSON body
  - argv-structural allowlist for `agh network` terminal commands
  - `network_owned` terminal ownership rules for output/wait/kill/release during network turns
  - persisted `Space` metadata for resume/rejoin consistency
- Patched related ADRs:
  - `adr-001.md` to remove direct local broker client support and disk token handoff
  - `adr-003.md` to align skill injection and inbound `PromptNetwork` behavior, including resume flows
  - `adr-004.md` and `adr-005.md` to align with late-binding and runtime-created spaces
- Ran parallel `codex exec` reviewers for RFC/protocol, runtime/architecture, and security lenses. Their intermediate output was noisy/truncated, but it converged with the local validation on the core corrections.
- Final local validation of the original 8 issues: all 8 are now resolved at the spec level.
- Ran `make verify` successfully after the doc edits.

# Now:

- Ready to hand off the corrected-spec summary with validation notes.

# Next:

- If requested, do one more narrow review pass or convert the corrected techspec into implementation tasks.

# Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: whether future multi-daemon bootstrap deserves its own ADR/spec instead of staying only as a v0 out-of-scope note.

# Working set (files/ids/commands):

- `.compozy/tasks/agh-network/_techspec.md`
- `.compozy/tasks/agh-network/adrs/adr-001.md`
- `.compozy/tasks/agh-network/adrs/adr-003.md`
- `.compozy/tasks/agh-network/adrs/adr-004.md`
- `.compozy/tasks/agh-network/adrs/adr-005.md`
- `docs/rfcs/003_agh-network-v0.md`
- `docs/rfcs/004_agh-network-v1.md`
- `internal/session/manager.go`
- `internal/session/manager_start.go`
- `internal/session/manager_prompt.go`
- `internal/session/manager_hooks.go`
- `internal/session/session.go`
- `internal/api/contract/contract.go`
- `internal/acp/handlers.go`
- `internal/daemon/boot.go`
- `git diff -- .compozy/tasks/agh-network/_techspec.md .compozy/tasks/agh-network/adrs/adr-001.md .compozy/tasks/agh-network/adrs/adr-003.md .compozy/tasks/agh-network/adrs/adr-004.md .compozy/tasks/agh-network/adrs/adr-005.md`
- `sed -n`, `nl -ba`, `rg`, `codex exec`, `make verify`
