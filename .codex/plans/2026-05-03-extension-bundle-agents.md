# Implement Bundle Agents as Activation-Owned Preset Resources

## Summary

Implement the missing "Extension = preset bundle" gap by making bundle profiles own activation-scoped agents, not by reusing global `resources.agents` or copying folders into managed paths.

- Bundle profiles declare self-contained agent folders through `[[profiles.agents]] path = "agents/<name>"`.
- Each bundled agent folder must contain `AGENT.md` and may contain `mcp.json`, `capabilities.toml` / `capabilities/`, `SOUL.md`, and `HEARTBEAT.md`.
- Activating a bundle materializes package-owned `agent`, `agent.soul`, and `agent.heartbeat` resources in the same global/workspace scope as the activation.
- `SOUL.md` and `HEARTBEAT.md` from bundles are read-only package defaults. Runtime/session resolution can consume them, but authoring write/delete/rollback cannot mutate package content.
- Deactivating a bundle removes all resources owned by that activation: agents, sidecars, jobs, triggers, bridges, and inventory.

## Key Changes

- Extend `internal/extension` bundle loading:
  - Add `BundleProfile.Agents []BundleAgent` parsed from `[[profiles.agents]]`.
  - Resolve `path` relative to the extension root, reject absolute paths/path escapes, and require `AGENT.md`.
  - Load the folder with the existing agent loader so `AGENT.md`, `mcp.json`, and capabilities use the same rules as normal agents.
  - Read optional `SOUL.md` and `HEARTBEAT.md` as packaged sidecar content; do not represent bundled agents as static extension `resources.agents`.
  - Validate duplicate bundled agent names within a profile and preserve full loaded agent/sidecar snapshots in the bundle resource spec.

- Extend bundle activation/resource projection:
  - Add desired agent and sidecar resources to `materializeActivationResources`, `BundleActivationResourcePlan`, owned-resource maps, cleanup, clone/hash helpers, and inventory generation.
  - Add `agent`, `agent.soul`, and `agent.heartbeat` to the bundle activation owned-kind allowlist.
  - Wire agent and sidecar resource stores/codecs into `newBundleResourceStore`.
  - Use stable activation-derived IDs for agent and sidecar inventory entries.
  - Fail preview/activation if a bundled agent name conflicts with a non-owned agent in the target effective scope or another activation-owned agent in that scope.
  - Fail preview/activation if any bundled job/trigger agent reference cannot resolve after applying the profile's bundled agents plus the existing agent catalog.

- Add sidecar resource semantics:
  - Introduce typed resource specs for package-owned `SOUL.md` and `HEARTBEAT.md` content, keyed by agent name and owned by the bundle activation.
  - Parse sidecar content with the current `soul.Parse` / `heartbeat.Parse` configuration during activation validation and runtime resolution.
  - Use stable synthetic source paths such as `.agh/bundles/<activation-id>/agents/<agent>/SOUL.md` for diagnostics instead of copying files.
  - Keep package-owned sidecars immutable: authoring mutation APIs return a clear conflict/read-only error for bundle-owned sidecars.

- Update agent resolution and runtime consumption:
  - Add an additive agent resolution path that returns agent provenance: resource ID, owner kind, owner ID, scope, and source kind.
  - Keep existing `ResolveAgent` behavior as a wrapper for callers that only need `AgentDef`.
  - Teach session Soul/Heartbeat resolution to pair sidecar resources only with the resolved agent resource provenance, preventing same-name sidecar leakage across workspace/global precedence.
  - Active sessions keep their existing snapshots; bundle updates/deactivation affect future resolutions according to existing session lifecycle rules.

- Co-ship public and agent-manageable surfaces:
  - Update API contracts/OpenAPI and generated TypeScript types so bundle catalog/preview/activation payloads expose agent counts, agent summaries, and inventory resource kinds for agents/sidecars.
  - Add first-class CLI commands backed by UDS for bundle catalog, preview, activate, list/detail, update default-channel bind, deactivate, and network settings so agents can manage bundle presets without web UI.
  - Update docs for extension bundle authoring, the new `[[profiles.agents]]` folder contract, read-only package sidecars, conflict behavior, and the Linear/marketing-team preset example.
  - No SQLite schema migration is expected because this uses the existing resources store with new resource kinds and JSON codecs.

## Test Plan

- Extension loading tests:
  - Loads bundled agent folders with `AGENT.md`, `mcp.json`, capabilities, `SOUL.md`, and `HEARTBEAT.md`.
  - Rejects missing `AGENT.md`, path escapes, duplicate profile agent names, invalid agent definitions, and invalid sidecars.
  - Confirms static `resources.agents` remain always-on extension agents while `profiles.agents` remain activation-scoped.

- Bundle activation/resource tests:
  - Preview and activate a profile that includes agents, jobs, triggers, bridges, channels, Soul, and Heartbeat.
  - Verify inventory includes `agent`, `agent.soul`, and `agent.heartbeat`.
  - Verify deactivation cleans only resources owned by that activation.
  - Verify activation fails on agent name conflicts and unresolved automation agent references.
  - Verify bundle update/reconcile refreshes owned agent and sidecar resources without touching non-owned resources.

- Runtime/session tests:
  - Start a session with a bundle-owned agent and assert the resolved prompt includes the packaged Soul projection.
  - Resolve Heartbeat status/prompt contribution from a bundle-owned `HEARTBEAT.md`.
  - Assert sidecar lookup follows the same workspace/global precedence as the resolved agent and does not attach sidecars to unrelated same-name agents.
  - Assert write/delete/rollback for package-owned Soul/Heartbeat returns a read-only conflict.

- API/CLI/docs verification:
  - Contract tests cover new bundle payload fields and route counts.
  - CLI tests cover catalog/preview/activate/list/detail/deactivate and show agent/sidecar inventory.
  - Run `make codegen`, `make codegen-check`, focused Go tests for `internal/extension`, `internal/bundles`, `internal/daemon`, `internal/session`, `internal/api/*`, then full `make verify`.

## Assumptions And Defaults

- The accepted plan is persisted to `.codex/plans/2026-05-03-extension-bundle-agents.md`.
- `[[profiles.agents]] path = "agents/<folder>"` is the only supported v1 declaration form; inline agent definitions and reusing `resources.agents` as bundle agents are intentionally not supported.
- Bundled sidecars are read-only defaults, not writable copies. No folder-copy projection is allowed.
- Bundle-owned agents are scoped exactly like their activation: global activation creates global resources; workspace activation creates workspace resources.
- This implementation is a hard-cut alpha change: no compatibility aliases, no fallback field names, and no silent conflict resolution.
