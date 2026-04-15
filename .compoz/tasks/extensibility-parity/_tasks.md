# Extensibility Parity — Task List

## Tasks

| #   | Title                                                    | Status  | Complexity | Dependencies                       |
| --- | -------------------------------------------------------- | ------- | ---------- | ---------------------------------- |
| 01  | Build resource persistence kernel                        | pending | critical   | —                                  |
| 02  | Add typed codecs, stores, and projector adapters         | pending | high       | task_01                            |
| 03  | Implement the reconcile driver runtime                   | pending | high       | task_01, task_02                   |
| 04  | Add extension surface registry and resource grant config | pending | high       | task_01                            |
| 05  | Add extension resource protocol and SDK support          | pending | high       | task_02, task_04                   |
| 06  | Expose UDS-first resource CRUD APIs                      | pending | high       | task_01, task_02, task_03          |
| 07  | Migrate hook bindings and wire tool/permission hooks     | pending | critical   | task_03, task_04, task_05          |
| 08  | Migrate tools and MCP servers to resources               | pending | high       | task_03, task_04, task_05, task_06 |
| 09  | Migrate agents and skills to resources                   | pending | high       | task_08                            |
| 10  | Migrate automation definitions to resource projection    | pending | high       | task_07, task_09                   |
| 11  | Migrate bridge instances to resource projection          | pending | high       | task_07, task_08                   |
| 12  | Migrate bundles and activation fan-out                   | pending | high       | task_10, task_11                   |
