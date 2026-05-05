Goal (incl. success criteria):

- Read-only audit of `packages/site` for documentation-release risks not covered by active `improve-docs` guardrails; return only concrete findings with paths, line evidence, and suggested regression tests.

Constraints/Assumptions:

- Do not edit audited source files.
- Avoid duplicate guardrails already active for CLI examples, internal links, API routes, meta navigation, frontmatter title/description, and Mermaid caption/theme quality.
- Focus areas: broken static media/image references, OG/social metadata, stale examples, orphaned navigation, and content quality gaps.
- Conversation in Brazilian Portuguese; artifacts/findings in English acceptable for file/test names.
- No destructive git commands.

Key decisions:

- Use direct file inspection and local searches only; no web search needed.
- Treat the active `2026-05-02-MEMORY-improve-docs.md` as the exclusion list for already-covered risks.

State:

- Audit complete; preparing concrete findings only.

Done:

- Read active improve-docs ledger.
- Read `packages/site/CLAUDE.md` / AGENTS overlap.
- Loaded `documentation-writer` and `seo-audit` skills relevant to docs quality and OG/social metadata.
- Verified public asset references are already guarded by `packages/site/lib/public-assets.test.ts`; no broken static media/image reference finding found.
- Identified remaining non-duplicative risks around social metadata, landing truth claims, landing deep navigation, provider display drift, and copy-system compliance.

Now:

- Final response.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- None blocking.

Working set (files/ids/commands):

- Ledger: `.codex/ledger/2026-05-02-MEMORY-docs-release-audit.md`
- Related ledger: `.codex/ledger/2026-05-02-MEMORY-improve-docs.md`
- Target: `packages/site`
- Key evidence: `packages/site/components/landing/network-section.tsx`, `packages/site/lib/site-config.ts`, `packages/site/app/blog/[slug]/page.tsx`, `packages/site/components/blog/featured-post.tsx`, `packages/site/components/landing/{runtime,extensibility,supported-agents}.tsx`, `packages/site/app/changelog/page.tsx`.
