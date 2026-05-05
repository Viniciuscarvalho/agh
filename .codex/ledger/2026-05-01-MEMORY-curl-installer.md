# Goal (incl. success criteria):

- Implement accepted curl installer plan for AGH.
- Success: `https://agh.network/install.sh` static installer exists, docs/site/release/CI know about it, tests/checks added, verification run or blockers reported.

# Constraints/Assumptions:

- Preserve unrelated dirty worktree changes; no destructive git commands.
- Accepted plan persisted at `.codex/plans/2026-05-01-curl-installer.md`.
- Canonical install command: `curl -fsSL https://agh.network/install.sh | sh`.
- Installer scope: macOS/Linux only; default release repo `compozy/agh`.
- Installer installs binary, verifies `agh version`, then runs interactive `agh install` only when TTY is available unless skipped.

# Key decisions:

- Serve installer from `packages/site/public/install.sh` because site uses static export.
- Stable release archive names: `agh_linux_x86_64.tar.gz`, `agh_linux_arm64.tar.gz`, `agh_darwin_x86_64.tar.gz`, `agh_darwin_arm64.tar.gz`.

# State:

- In progress.

# Done:

- Read relevant instructions and accepted plan.
- Persisted accepted plan.
- Added `packages/site/public/install.sh` with dry-run, version, dir, skip-bootstrap, checksum verification, atomic binary install, and interactive bootstrap.
- Wired static site headers, GoReleaser stable archive names, release extra file, release workflow validation, docs, landing install tabs, and launch-post snippets.
- Added `InstallerCheck`, `make installer-check`, Mage test coverage, and release config assertions.

# Now:

- Run targeted checks and fix any failures.

# Next:

- Run targeted installer/site/Go checks, then `make verify` if feasible.

# Open questions (UNCONFIRMED if needed):

- None.

# Working set (files/ids/commands):

- Planned: `packages/site/public/install.sh`, `packages/site/public/_headers`, `.goreleaser.yml`, `.goreleaser.release-header.md.tmpl`, `.goreleaser.release-footer.md.tmpl`, `.github/workflows/release.yml`, `magefile.go`, `magefile_test.go`, `Makefile`, `internal/config/release_config_test.go`, `packages/site/content/runtime/core/getting-started/installation.mdx`, `packages/site/components/landing/install-section.tsx`, `packages/site/components/landing/__tests__/landing.test.tsx`, `packages/site/content/blog/posts/introducing-agh-the-first-agent-network-protocol.mdx`.
