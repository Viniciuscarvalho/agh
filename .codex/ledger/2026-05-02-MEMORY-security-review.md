Goal (incl. success criteria):

- Run a repository-wide Codex Security scan of AGH and fix validated/plausible security findings before release. Success means scan artifacts exist under `.codex`, real findings are fixed with tests/validation, and required gates are reported.

Constraints/Assumptions:

- Conversation in Brazilian Portuguese; artifacts/code/docs in English.
- Repository-wide scope for `/Users/pedronauck/Dev/compozy/agh2`.
- No destructive git commands (`restore`, `checkout`, `reset`, `clean`, `git rm`) without explicit permission.
- `make verify` is the blocking final gate when feasible.
- Subagents are read-only; parent owns all edits.

Key decisions:

- Use `codex-security:security-scan` for orchestration and `codex-security:fix-finding` for remediation.
- Track scan artifacts in `.codex/security-reports/agh2/65d0ca768995_20260503T015722Z`.
- For public curl installs, official release repo is fixed to `compozy/agh`; installer now requires cosign provenance verification of `checksums.txt` before archive checksum verification.

State:

- Security loop objective is complete.
- Discovery, validation, and attack-path phases are complete.
- Fix-finding phase is complete.
- Final monorepo gate passed.

Done:

- Moved all scan reports from `/tmp/codex-security-scans/agh2/65d0ca768995_20260503T015722Z` into `.codex/security-reports/agh2/65d0ca768995_20260503T015722Z`.
- Fixed HTTP/API trust boundary findings: non-loopback API guard, strict same-origin CORS, 4 MiB API body cap, and prompt SSE redaction.
- Fixed managed extension install path containment for manifest names and marketplace installs.
- Fixed AGH Network validation: peer-card privileged capability proof, future timestamp rejection, replay deadline clamp, and raw secret rejection in body/ext.
- Fixed process/env/log issues: filtered daemon env for providers and terminals, network-owned terminal env suppression, and detached error-log redaction.
- Fixed tool approval scope binding: approval tokens now bind agent name and reject body/query scope conflicts.
- Fixed bridge issues: Telegram webhook secret is required when listening; Linear and Teams credentialed URLs are allowlisted with loopback-only HTTP for tests; Teams auth uses timeout-bound clients.
- Fixed supply-chain issue: `packages/site/public/install.sh` verifies `checksums.txt.sig` and `checksums.txt.pem` with cosign before trusting `checksums.txt`; docs/tests updated.
- Fixed Windows process-tree parity: Windows managed subprocesses/terminals now register kill-on-close Job Objects through `internal/procutil`; ACP/subprocess wrappers use shared process-tree helpers.
- Removed generated `agh.exe` created by cross-build validation.
- Wrote final remediation report at `.codex/security-reports/agh2/65d0ca768995_20260503T015722Z/artifacts/fix_report.md`.
- `make verify` passed; final evidence included `DONE 7760 tests in 116.130s` and `OK: all package boundaries respected`.

Now:

- Prepare final response.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- No live Windows runtime was available; Windows process-tree fix is cross-build validated, not runtime-executed on Windows.

Working set (files/ids/commands):

- Ledger: `.codex/ledger/2026-05-02-MEMORY-security-review.md`
- Scan dir: `.codex/security-reports/agh2/65d0ca768995_20260503T015722Z`
- Reports: `artifacts/threat_model.md`, `runtime_inventory.md`, `finding_discovery_report.md`, `validation_report.md`, `attack_path_analysis_report.md`
- Focused verification passed: `go test` for modified Go packages; `bunx vitest run packages/site/lib/public-install-contract.test.ts`; `GOOS=windows GOARCH=amd64 go build -o /tmp/agh-windows-security-review.exe ./cmd/agh`
- Final verification passed: `make verify`
