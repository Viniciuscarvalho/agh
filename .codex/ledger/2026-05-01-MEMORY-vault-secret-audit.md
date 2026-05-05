# Goal (incl. success criteria):

- Read-only exploration for vault-secret unification hard cut.
- Success: identify raw/env-only secret paths across MCP, hooks, extensions, and sandbox env surfaces; propose replacements using `client_secret_ref`, `secret_env` maps, and vault-backed token refs; include schema migration, codegen, web, docs, tests, and dynamic redaction impacts.

# Constraints/Assumptions:

- Current user request is read-only: do not edit source files.
- Ledger write is required by workspace policy; all code exploration remains read-only.
- Do not run destructive git commands.
- Use local search only for project code.
- Conversation in BR-PT; artifact-style findings may use English identifiers.

# Key decisions:

- Treat existing `2026-05-01-MEMORY-vault-secret-unification.md` as another implementation session ledger, not this session's ledger.
- Use security and architecture audit framing; inspect Go runtime plus web/site/docs impacts without changing files.

# State:

- Exploration complete; final findings prepared for the user.

# Done:

- Read root AGENTS instructions provided by user.
- Read `internal/CLAUDE.md`, `web/CLAUDE.md`, and `packages/site/CLAUDE.md`.
- Activated/read `security-review`, `architectural-analysis`, `agh-schema-migration`, `agh-contract-codegen-coship`, and `agh-test-conventions` guidance.
- Scanned ledger directory and read relevant MCP/sandbox/vault ledgers for cross-agent awareness.
- Mapped MCP `client_secret_env`, MCP env maps, `mcp_auth_tokens`, hook env, extension/skill env, and sandbox env surfaces.
- Identified hard-cut replacements: `client_secret_ref`, `secret_env` maps, vault-backed OAuth token refs, structured redaction, and dynamic redaction on materialization.

# Now:

- Ready to report read-only findings.

# Next:

- No implementation performed in this read-only pass.

# Open questions (UNCONFIRMED if needed):

- None.

# Working set (files/ids/commands):

- Ledger: `.codex/ledger/2026-05-01-MEMORY-vault-secret-audit.md`
- Context ledgers: `.codex/ledger/2026-05-01-MEMORY-vault-secret-unification.md`, `.codex/ledger/2026-04-25-MEMORY-mcp-auth-security.md`, `.codex/ledger/2026-04-29-MEMORY-hosted-mcp.md`, `.codex/ledger/2026-04-28-MEMORY-sandbox-hard-cut.md`
