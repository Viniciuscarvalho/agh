Goal (incl. success criteria):

- Explore competitor code and artifacts under `.resources/*` for memory-related capabilities stronger than AGH.
- Produce a concise comparison with paths, gaps in AGH, and evidence ranked by confidence.

Constraints/Assumptions:

- Do not edit repository files.
- Prefer local source/artifact inspection over web browsing.
- Focus on persistent memory, retrieval, context injection, compaction/flush pipelines, vector or semantic search, session memory, team/shared memory, fallback/resilience, and observability.

Key decisions:

- Use `.resources/` as the competitor corpus root.
- Anchor AGH comparison on local `internal/memory`, `internal/session`, and `internal/observe` code as needed.

State:

- ready to report

Done:

- Located `.resources/` and verified no existing session-specific ledger for this task.
- Read prior memory-related ledgers and the architectural-analysis guidance.
- Gathered evidence for the strongest competitor memory stacks: OpenClaw, Hermes, GoClaw, and Claude Code.
- Verified AGH's local memory surface: dual-scope file store, consolidation runtime, prompt injection, hooks, and CRUD/health endpoints.

Now:

- Synthesize competitor-by-competitor findings and AGH gaps.

Next:

- Return the comparison with confidence-ranked evidence.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: which `.resources/*` repos are truly competitors versus broader reference artifacts.
- UNCONFIRMED: whether to treat docs-only artifacts as evidence if code is absent.

Working set (files/ids/commands):

- `.codex/ledger/2026-04-17-MEMORY-competitor-memory.md`
- `.resources/*`
- `internal/memory/*`
- `internal/session/*`
- `internal/observe/*`
- Key competitor evidence:
  - `.resources/hermes/website/docs/user-guide/features/memory.md`
  - `.resources/hermes/website/docs/developer-guide/context-compression-and-caching.md`
  - `.resources/hermes/agent/memory_manager.py`
  - `.resources/hermes/tools/session_search_tool.py`
  - `.resources/openclaw/README.md`
  - `.resources/openclaw/src/hooks/bundled/session-memory/HOOK.md`
  - `.resources/openclaw/src/plugins/memory-state.ts`
  - `.resources/openclaw/src/auto-reply/reply/memory-flush.ts`
  - `.resources/openclaw/src/gateway/session-compaction-checkpoints.ts`
  - `.resources/openclaw/src/memory-host-sdk/host/query-expansion.ts`
  - `.resources/goclaw/docs/24-knowledge-vault.md`
  - `.resources/goclaw/docs/07-bootstrap-skills-memory.md`
  - `.resources/goclaw/internal/store/pg/memory_search.go`
  - `.resources/goclaw/internal/store/pg/episodic_search.go`
  - `.resources/goclaw/examples/hooks/session-context-injector.json`
  - `.resources/claude-code/services/SessionMemory/sessionMemory.ts`
  - `.resources/claude-code/services/compact/sessionMemoryCompact.ts`
  - `.resources/claude-code/utils/memoryFileDetection.ts`
  - `.resources/claude-code/bridge/flushGate.ts`
