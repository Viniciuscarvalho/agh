Goal (incl. success criteria):

- Audit the existing task-related backend/API surfaces for Paper task screens and identify clean extension points for richer task read models and SSE/timeline endpoints.
- Success means a concise recommendation covering usable endpoints, gaps by screen/read-model category, extension points in the current architecture, and transport/OpenAPI risks.

Constraints/Assumptions:

- Do not edit code files.
- Focus on `internal/task`, `internal/observe`, `internal/api/contract`, `internal/api/spec`, `internal/api/core`, `internal/api/httpapi`, `internal/api/udsapi`, and task-related host APIs.
- User wants an architecture/read-surface audit, not an implementation plan.

Key decisions:

- Treat task detail, run list, and observe health as the only currently usable task-facing read surfaces.
- Treat `taskpkg.View`, `Observer.Health`, and the task event store as the likely extension seams for richer read models/timeline endpoints.

State:

- In progress.

Done:

- Read the relevant task, observe, contract, spec, transport, and host API files.
- Confirmed existing task transport routes and host API methods.
- Confirmed task manager read model shape and observer health/summary capabilities.

Now:

- Synthesize the current surfaces, gaps, and extension points into the requested concise recommendation.

Next:

- Deliver final response with the four requested sections.

Open questions (UNCONFIRMED if needed):

- None.

Working set (files/ids/commands):

- `internal/task/{types.go,interfaces.go,manager.go,validate.go}`
- `internal/observe/{tasks.go,health.go,query.go,observer.go}`
- `internal/api/{contract/tasks.go,spec/spec.go,core/{tasks.go,handlers.go,conversions.go,interfaces.go},httpapi/routes.go,udsapi/routes.go}`
- `internal/extension/{host_api.go,host_api_tasks.go,contract/host_api.go}`
- `internal/store/globaldb/global_db_task_aux.go`
