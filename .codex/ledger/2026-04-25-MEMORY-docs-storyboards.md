Goal (incl. success criteria):

- Regenerar `packages/site/public/images/runtime/core-concepts-storyboard-v3.png` e `packages/site/public/images/runtime/network-overview-storyboard-v2.png` com linguagem visual alinhada, usando o estilo-base da imagem de network e o mascote correto da imagem de core.
- Success means: os dois assets finais ficam coerentes entre si, o poster de core mantém o conteúdo atual com revisão de estilo, o poster de network deixa de resumir a seção em apenas 3 blocos e passa a refletir o conteúdo real das páginas de Network, e as docs passam a referenciar/descrerver corretamente as novas imagens.

Constraints/Assumptions:

- Usuário pediu explicitamente uso do skill `imagegen`; built-in `image_gen` é o caminho padrão.
- Não sobrescrever ou tocar mudanças não relacionadas no worktree.
- Root `AGENTS.md` / `CLAUDE.md` já vieram no prompt; não há `AGENTS.md` mais profundo conhecido em `packages/site`.
- Design AGH continua válido: dark-mode product language, warm orange `#E8572A`, docs operator-first, sem visual frio/azulado.
- O usuário quer substituir os assets finais existentes, não criar variantes paralelas.

Key decisions:

- Usar `network-overview-storyboard-v2.png` como referência principal de estilo/composição e `core-concepts-storyboard-v3.png` como referência do mascote.
- Não usar o skill `brainstorming`: o pedido já fixa artefatos, estilo, mascote e direção editorial o suficiente para execução direta.
- Reformular a arte de Network a partir do conteúdo real das páginas `protocol`, `channels-and-peers`, `delivery-and-safety`, `task-ingress`, em vez do fluxo simplificado 1-2-3 atual.
- Ajustar `alt`/copy nas MDX se a nova composição passar a comunicar elementos diferentes dos textos atuais.

State:

- Completed

Done:

- Li o skill `imagegen` e referências mínimas de design (`DESIGN.md`, `agh-design`, `design-taste-frontend`, `minimalist-ui`).
- Li os ledgers correlatos: `runtime-core-illustration`, `network-docs`, `daemon-session-illustrations`.
- Inspecionei visualmente os assets atuais `core-concepts-storyboard-v3.png` e `network-overview-storyboard-v2.png`.
- Localizei os usos nas docs: `packages/site/content/runtime/core/index.mdx` e `packages/site/content/runtime/core/network/index.mdx`.
- Li a overview e os subdocs de `packages/site/content/runtime/core/network/*.mdx` para extrair os conceitos reais que a ilustração deve cobrir.

Now:

- Task complete; final response with verification evidence and changed paths.

Next:

- None.

Open questions (UNCONFIRMED if needed):

- UNCONFIRMED: se o novo poster de Network deve continuar usando uma headline em inglês (`AGH NETWORK`) ou migrar parte da microcopy para outra formulação; assumindo manutenção do padrão atual em inglês porque toda a doc art existente está nesse idioma.

Working set (files/ids/commands):

- `packages/site/public/images/runtime/core-concepts-storyboard-v3.png`
- `packages/site/public/images/runtime/network-overview-storyboard-v2.png`
- `packages/site/content/runtime/core/index.mdx`
- `packages/site/content/runtime/core/network/index.mdx`
- `packages/site/content/runtime/core/network/protocol.mdx`
- `packages/site/content/runtime/core/network/channels-and-peers.mdx`
- `packages/site/content/runtime/core/network/delivery-and-safety.mdx`
- `packages/site/content/runtime/core/network/task-ingress.mdx`
- Verification:
  - `bun run --cwd packages/site source:generate`
  - `bun run --cwd packages/site typecheck`
  - `make verify`
