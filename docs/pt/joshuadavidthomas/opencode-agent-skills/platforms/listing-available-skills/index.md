---
title: "Gerenciamento de Skills: Consultar Skills Disponíveis | opencode-agent-skills"
sidebarTitle: "Encontrar Skills Rapidamente"
subtitle: "Gerenciamento de Skills: Consultar Skills Disponíveis"
description: "Aprenda a usar a ferramenta get_available_skills. Localize skills rapidamente através de busca, namespace e filtros, dominando as funcionalidades essenciais de descoberta e gerenciamento de skills."
tags:
  - "Gerenciamento de Skills"
  - "Uso de Ferramentas"
  - "Namespace"
prerequisite:
  - "start-installation"
order: 2
---

# Consultar e Listar Skills Disponíveis

## O Que Você Vai Aprender

- Usar a ferramenta `get_available_skills` para listar todas as skills disponíveis
- Filtrar skills específicas através de busca por palavras-chave
- Usar namespaces (como `project:skill-name`) para localizar skills com precisão
- Identificar a origem das skills e listar scripts executáveis

## O Desafio Que Você Enfrenta

Você quer usar uma skill, mas não lembra o nome exato. Talvez você saiba que é uma skill do projeto, mas não sabe em qual caminho de descoberta está. Ou talvez você só queira navegar rapidamente pelas skills disponíveis no projeto atual.

## Quando Usar Esta Técnica

- **Explorar novos projetos**: Ao entrar em um novo projeto, entenda rapidamente quais skills estão disponíveis
- **Nome da skill incerto**: Lembre-se apenas de parte do nome ou da descrição da skill, e precisa de correspondência aproximada
- **Conflitos de namespace**: Skills com o mesmo nome no nível do projeto e do usuário, e você precisa especificar qual usar
- **Encontrar scripts**: Quer saber quais scripts de automação executáveis estão disponíveis no diretório da skill

## Conceito Principal

A ferramenta `get_available_skills` ajuda você a ver todas as skills disponíveis na sessão atual. O plugin varre automaticamente as skills de 6 caminhos de descoberta:

::: info Prioridade de Descoberta de Skills
1. `.opencode/skills/` (OpenCode nível de projeto)
2. `.claude/skills/` (Claude nível de projeto)
3. `~/.config/opencode/skills/` (OpenCode nível de usuário)
4. `~/.claude/skills/` (Claude nível de usuário)
5. `~/.claude/plugins/cache/` (cache de plugins)
6. `~/.claude/plugins/marketplaces/` (plugins instalados)
:::

Skills com o mesmo nome são deduplicadas mantendo apenas a primeira, as subsequentes são ignoradas.

As informações retornadas pela ferramenta incluem:
- **Nome da skill**
- **Etiqueta de origem** (project, user, claude-project, etc.)
- **Descrição**
- **Lista de scripts executáveis** (se houver)

::: tip Sintaxe de Namespace
Você pode especificar explicitamente a origem usando o formato `namespace:skill-name`:
- `project:my-skill` - usa skill OpenCode nível de projeto (`.opencode/skills/`)
- `claude-project:my-skill` - usa skill Claude nível de projeto (`.claude/skills/`)
- `user:my-skill` - usa skill OpenCode nível de usuário (`~/.config/opencode/skills/`)
- `claude-user:my-skill` - usa skill Claude nível de usuário (`~/.claude/skills/`)
- `claude-plugins:my-skill` - usa skill de plugins Claude
:::

## Siga o Passo a Passo

### Etapa 1: Listar Todas as Skills Disponíveis

No OpenCode, peça ao AI para listar as skills:

```
Entrada do usuário:
Liste todas as skills disponíveis

Resposta do sistema:
skill-helper (project)
  Assistente de operações Git e gerenciamento de branches [scripts: tools/branch.sh, tools/commit.sh]

test-helper (user)
  Ferramenta de teste unitário e análise de cobertura

docker-helper (project)
  Guia de containerização Docker e implantação [scripts: build.sh, deploy.sh]

claude-code-superpowers (claude-plugins)
  Fluxo completo de desenvolvimento de software
```

**Você deve ver**: uma lista de skills mostrando nome, etiqueta de origem, descrição e lista de scripts.

### Etapa 2: Usar Busca para Filtrar

Se você lembra apenas de parte do nome da skill:

```
Entrada do usuário:
Encontre skills que contenham "docker"

Resposta do sistema:
docker-helper (project)
  Guia de containerização Docker e implantação [scripts: build.sh, deploy.sh]
```

A busca corresponde palavras-chave no nome e descrição da skill, suportando curingas `*`:

```
Entrada do usuário:
Encontre skills que começam com "test"

Resposta do sistema:
test-helper (user)
  Ferramenta de teste unitário e análise de cobertura
```

**Você deve ver**: apenas skills correspondentes aos critérios de busca.

### Etapa 3: Experimentar Sugestões de Correspondência Aproximada

Se você digitar o nome da skill incorretamente:

```
Entrada do usuário:
Quero usar docker-asistant

Resposta do sistema:
Nenhuma skill encontrada correspondendo a "docker-asistant". Você quis dizer "docker-helper"?
```

O plugin calcula a similaridade baseada na distância de Levenshtein, sugerindo automaticamente o nome de skill mais próximo.

**Você deve ver**: mensagem de erro e sugestão de nome correto.

### Etapa 4: Usar Namespace para Localização Precisa

Suponha que haja uma skill chamada `build-helper` tanto no nível do projeto quanto do usuário:

```
Entrada do usuário:
Liste os detalhes de build-helper

Resposta do sistema:
build-helper (project)
  Configuração de build específica do projeto e otimização de compilação [scripts: build.sh, optimize.sh]
```

Se o usuário quiser a skill de nível de usuário:

```
Entrada do usuário:
Use user:build-helper

Resposta do sistema:
build-helper (user)
  Ferramenta de cadeia de build genérica e configuração de integração contínua [scripts: ci.sh, test.sh]
```

**Você deve ver**: acessando skills de mesmo nome de diferentes origens através de prefixos de namespace.

### Etapa 5: Verificar Scripts Executáveis

Veja quais scripts estão disponíveis no diretório da skill:

```
Entrada do usuário:
Quais scripts o docker-helper tem?

Resposta do sistema:
docker-helper (project)
  Guia de containerização Docker e implantação [scripts: build.sh, deploy.sh]
```

Os scripts são exibidos entre colchetes após o nome da skill, separados por vírgulas. Você pode usar a ferramenta `run_skill_script` para executar esses scripts.

**Você deve ver**: nome da skill seguido por `[scripts: caminho-do-script1, caminho-do-script2, ...]`.

## Checkpoints ✅

- [ ] Você consegue listar todas as skills disponíveis?
- [ ] Você consegue filtrar skills específicas usando busca?
- [ ] Você entende o significado das etiquetas de origem (project, user, claude-project, etc.)?
- [ ] Você consegue explicar a função e a sintaxe dos namespaces de skills?
- [ ] Você consegue identificar a lista de scripts executáveis nas informações da skill?

## Armadilhas Comuns

### Armadilha 1: Sobreposição de Skills com Mesmo Nome

Se houver skills com o mesmo nome no nível do projeto e do usuário, você pode ficar confuso sobre por que a skill carregada não é a que você esperava.

**Causa**: As skills são descobertas por prioridade, com o nível do projeto tendo precedência sobre o nível do usuário. Com o mesmo nome, apenas a primeira é mantida.

**Solução**: Use o namespace para especificar explicitamente, como `user:my-skill` em vez de apenas `my-skill`.

### Armadilha 2: Sensibilidade a Maiúsculas e Minúsculas na Busca

As consultas de busca usam expressões regulares, mas têm a flag `i` definida, então não diferenciam maiúsculas de minúsculas.

```bash
# Estas buscas são equivalentes
get_available_skills(query="docker")
get_available_skills(query="DOCKER")
get_available_skills(query="Docker")
```

### Armadilha 3: Escape de Curingas

O `*` na busca é automaticamente convertido para `.*` na expressão regular, não é necessário escapar manualmente:

```bash
# Busca skills que começam com "test"
get_available_skills(query="test*")

# Equivalente à expressão regular /test.*/i
```

## Resumo da Aula

`get_available_skills` é a ferramenta para explorar o ecossistema de skills, suportando:

- **Listar todas as skills**: Chamada sem parâmetros
- **Filtrar por busca**: Através do parâmetro `query` correspondendo a nomes e descrições
- **Namespace**: Use `namespace:skill-name` para localização precisa
- **Sugestões de correspondência aproximada**: Sugestão automática do nome correto quando há erro de digitação
- **Lista de scripts**: Exibe scripts de automação executáveis

O plugin injeta automaticamente a lista de skills no início da sessão, então geralmente você não precisa chamar esta ferramenta manualmente. Mas é útil nos seguintes cenários:
- Quer navegar rapidamente pelas skills disponíveis
- Não lembra o nome exato da skill
- Precisa distinguir skills de mesmo nome de diferentes origens
- Quer ver a lista de scripts de uma skill específica

## Próxima Aula

> Na próxima aula aprenderemos **[Carregar Skills no Contexto da Sessão](../loading-skills-into-context/)**.
>
> Você aprenderá:
> - Usar a ferramenta `use_skill` para carregar skills na sessão atual
> - Entender como o conteúdo da skill é injetado no contexto em formato XML
> - Dominar o mecanismo de Synthetic Message Injection (injeção de mensagem sintética)
> - Entender como as skills permanecem disponíveis após a compressão da sessão

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Linhas |
|---|---|---|
| Definição da ferramenta GetAvailableSkills | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L29-L72) | 29-72 |
| Função discoverAllSkills | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L240-L263) | 240-263 |
| Função resolveSkill | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| Função findClosestMatch | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L88-L125) | 88-125 |

**Tipos Importantes**:
- `SkillLabel = "project" | "user" | "claude-project" | "claude-user" | "claude-plugins"`: enum de etiquetas de origem das skills

**Constantes Importantes**:
- Limite de correspondência aproximada: `0.4` (`utils.ts:124`) - não retorna sugestão se a similaridade for inferior a este valor

**Funções Importantes**:
- `GetAvailableSkills()`: retorna lista formatada de skills, suporta filtragem por busca e sugestões de correspondência aproximada
- `resolveSkill(skillName: string, skillsByName: Map<string, Skill>)`: suporta análise de skills no formato `namespace:skill-name`
- `findClosestMatch(input: string, candidates: string[])`: calcula a melhor correspondência baseada em múltiplas estratégias (prefixo, contém, distância de edição)

**Regras de Negócio**:
- Skills com o mesmo nome são deduplicadas mantendo apenas a primeira (`skills.ts:258`)
- Consultas de busca suportam curingas `*`, automaticamente convertidos para expressões regulares (`tools.ts:43`)
- Sugestões de correspondência aproximada só são acionadas quando há parâmetro de consulta e nenhum resultado (`tools.ts:49-57`)

</details>
