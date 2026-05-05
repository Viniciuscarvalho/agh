Goal (incl. success criteria):

- Extract `codex-timed-loop` out of AGH into `/Users/pedronauck/dev/ai/codex-loop-plugin`, convert it from repo-local bootstrap to global `~/.codex` installation, and add `rounds="<num>"` as an alternative to `min="<time>"`.
- Success requires a standalone plugin repo with a personal/global marketplace, global hook installer/uninstaller, generalized prompts/config, AGH cleanup, passing plugin tests, and fresh `make verify` in AGH.

Constraints/Assumptions:

- Follow AGH root `AGENTS.md` and `~/.codex/AGENTS.md`: no destructive git commands, maintain a ledger, and run `make verify` before completion.
- The approved plan already exists in chat and must also live in `.codex/plans/`.
- Current Codex CLI version is `0.125.0`; it supports `codex plugin marketplace add/remove` but not a direct CLI `plugin install`.
- Global hooks should be loaded from `~/.codex`, remain opt-in via `[[CODEX_LOOP ...]]`, and work even outside trusted repo-local `.codex` layers.
- The current AGH plugin artifacts are untracked; remove them by normal filesystem edits only, not git cleanup commands.

Key decisions:

- Keep the plugin id `codex-timed-loop`.
- Use `/Users/pedronauck/dev/ai/codex-loop-plugin` as the marketplace root, with the publishable bundle stored under `plugins/codex-timed-loop/`.
- Use global runtime paths under `~/.codex/codex-timed-loop/`.
- Header contract requires exactly one limit mode: `min="..."` or `rounds="..."`.
- In `rounds` mode, each intercepted `Stop` counts as one completed round; completion of the target round ends the loop, but rapid-stop protection can still cut the loop short before the target is reached.
- Replace AGH-specific `real-scenario-qa` behavior with optional global config.
- Expand duration parsing to human-friendly aliases and optional whitespace while preserving the compact short-unit format.

State:

- Completed.

Done:

- Re-read AGH root instructions, `~/.codex/AGENTS.md`, and the relevant skills (`brainstorming`, `skill-best-practices`, `crafting-effective-readmes`).
- Confirmed the current plugin is still only present inside AGH at `scripts/plugins/codex-timed-loop/` and via cached global install metadata under `~/.codex/plugins/cache/agh-local-plugins/...`.
- Confirmed `~/.codex/config.toml` currently enables `codex-timed-loop@agh-local-plugins`, while `~/.codex/hooks.json` and `~/.agents/plugins/marketplace.json` do not exist yet.
- Created the standalone repo scaffold at `/Users/pedronauck/dev/ai/codex-loop-plugin/`, initialized git there, and copied the existing bundle into `plugins/codex-timed-loop/`.
- Added new root files in the standalone repo: `.gitignore`, `.agents/plugins/marketplace.json`, and `README.md`.
- Inspected the copied bundle and confirmed it is still fully repo-local: installer uses `--repo-root`, hooks point at `$(git rev-parse --show-toplevel)`, loop state lives under repo `.codex/loops`, only `min` is supported, and continuation still hardcodes `real-scenario-qa`.
- Persisted the approved implementation plan in `.codex/plans/2026-04-27-codex-loop-global.md`.
- Rewrote the standalone bundle for global `~/.codex` install, including:
  - new `min|rounds` activation parsing
  - human-friendly duration parsing
  - optional continuation guidance config
  - global installer and uninstaller
  - global hook templates and runtime
  - updated plugin manifest, README, and skill docs
- Rewrote plugin tests for global `CODEX_HOME` behavior and round semantics.
- Verified the standalone plugin with:
  - `python3 -m py_compile ...`
  - `python3 -m unittest discover -s /Users/pedronauck/dev/ai/codex-loop-plugin/plugins/codex-timed-loop/tests -v`
  - `git diff --check` in both repos
  - metadata validation via `validate-metadata.py`
- Added the personal marketplace with `codex plugin marketplace add /Users/pedronauck/dev/ai/codex-loop-plugin`.
- Installed the global runtime with `python3 /Users/pedronauck/dev/ai/codex-loop-plugin/plugins/codex-timed-loop/scripts/install.py`.
- Confirmed global runtime files exist under `~/.codex/codex-timed-loop/`, `~/.codex/hooks.json`, and `~/.codex/config.toml`.
- Ran a direct smoke test against the installed runtime hooks for both `min="30m"` and `rounds="2"`, then cleaned the temporary loop files.
- Removed AGH-local plugin artifacts:
  - `scripts/plugins/codex-timed-loop/`
  - `.agents/plugins/`
  - `.codex/hooks/`
  - `.codex/loops/`
- Removed the old `codex-timed-loop@agh-local-plugins` config entry and deleted the stale cached plugin directory under `~/.codex/plugins/cache/agh-local-plugins/codex-timed-loop/`.
- Updated AGH `.gitignore` to ignore `.codex/hooks/` and `.codex/loops/`.
- Ran `make verify` in AGH successfully after cleanup.

Now:

- Final state recorded and ready to report.

Next:

- Optional manual step after this session: restart Codex, then install `codex-timed-loop` from `/plugins` if you want the plugin skill itself exposed in the UI in addition to the already-installed global runtime.

Open questions (UNCONFIRMED if needed):

- No blocking questions. The runtime behavior is already active globally. The only remaining UI-level question is whether the user wants the plugin skill exposed through `/plugins`, which still appears to be a manual Codex step.

Working set (files/ids/commands):

- `scripts/plugins/codex-timed-loop/`
- `.agents/plugins/marketplace.json`
- `~/.codex/config.toml`
- `~/.codex/plugins/cache/agh-local-plugins/codex-timed-loop/0.1.0/`
- Target repo: `/Users/pedronauck/dev/ai/codex-loop-plugin`
- Plan: `.codex/plans/2026-04-27-codex-loop-global.md`
- Commands used: `git status --short`, `sed -n`, `find`, `ls -la`, `codex --version`, `codex plugin marketplace --help`, `codex plugin marketplace add`, plugin unit tests, smoke script, and `make verify`
