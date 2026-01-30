---
title: "Formato AGENTS.md: Especificação de Skills | openskills"
sidebarTitle: "Faça a IA Conhecer Suas Skills"
subtitle: "Especificação do Formato AGENTS.md"
description: "Aprenda a estrutura XML do arquivo AGENTS.md e a definição da lista de skills. Entenda os significados dos campos, mecanismos de geração e melhores práticas, dominando como o sistema de skills funciona."
tags:
  - "appendix"
  - "reference"
  - "format"
prerequisite:
  - "sync-to-agents"
order: 2
---

# Especificação do Formato AGENTS.md

**AGENTS.md** é o arquivo de descrição de skills gerado pelo OpenSkills, que informa aos agentes de IA (como Claude Code, Cursor, Windsurf, etc.) quais skills estão disponíveis e como invocá-las.

## O Que Você Vai Aprender

- Ler a estrutura XML do AGENTS.md e o significado de cada tag
- Compreender a definição dos campos da lista de skills e suas restrições de uso
- Saber como editar manualmente o AGENTS.md (não recomendado, mas às vezes necessário)
- Entender como o OpenSkills gera e atualiza este arquivo

## Exemplo Completo do Formato

Abaixo está um exemplo completo de um arquivo AGENTS.md:

```xml
# AGENTS

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: `npx openskills read <skill-name>`
- For multiple: `npx openskills read skill-one,skill-two`
- The skill content will load with detailed instructions on how to complete task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>

<available_skills>

<skill>
<name>open-source-maintainer</name>
<description>End-to-end GitHub repository maintenance for open-source projects. Use when asked to triage issues, review PRs, analyze contributor activity, generate maintenance reports, or maintain a repository.</description>
<location>project</location>
</skill>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms.</description>
<location>global</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

## Detalhes da Estrutura de Tags

### Container Externo: `<skills_system>`

```xml
<skills_system priority="1">
  <!-- conteúdo das skills -->
</skills_system>
```

- **priority**: Marcador de prioridade (valor fixo `"1"`), informa ao agente de IA a importância deste sistema de skills

::: tip Nota
O atributo `priority` está atualmente reservado para uso futuro de extensão; todos os arquivos AGENTS.md usam o valor fixo `"1"`.
:::

### Instruções de Uso: `<usage>`

A tag `<usage>` contém orientações sobre como o agente de IA deve usar as skills:

```xml
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: `npx openskills read <skill-name>`
  - For multiple: `npx openskills read skill-one,skill-two`
- The skill content will load with detailed instructions on how to complete task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>
```

**Pontos-chave**:
- **Condição de acionamento**: Verifique se as tarefas do usuário podem ser concluídas de forma mais eficiente usando skills
- **Método de invocação**: Use o comando `npx openskills read <skill-name>`
- **Invocação em lote**: Suporta múltiplos nomes de skills separados por vírgula
- **Diretório base**: A saída contém o campo `base_dir`, usado para resolver arquivos de referência nas skills (como `references/`, `scripts/`, `assets/`)
- **Restrições de uso**:
  - Use apenas as skills listadas em `<available_skills>`
  - Não recarregue skills que já estão no contexto
  - Cada invocação de skill é stateless

### Lista de Skills: `<available_skills>`

`<available_skills>` contém a lista de todas as skills disponíveis, cada skill é definida com a tag `<skill>`:

```xml
<available_skills>

<skill>
<name>skill-name</name>
<description>Descrição da skill...</description>
<location>project</location>
</skill>

<skill>
<name>another-skill</name>
<description>Outra descrição de skill...</description>
<location>global</location>
</skill>

</available_skills>
```

#### Campos da Tag `<skill>`

Cada `<skill>` contém os seguintes campos obrigatórios:

| Campo | Tipo | Valores Possíveis | Descrição |
| --- | --- | --- | --- |
| `<name>` | string | - | Nome da skill (deve corresponder ao nome do arquivo SKILL.md ou ao `name` no YAML) |
| `<description>` | string | - | Descrição da skill (do YAML frontmatter do SKILL.md) |
| `<location>` | string | `project` \| `global` | Marcador de local de instalação da skill (para o agente de IA entender a origem da skill) |

**Explicação dos campos**:

- **`<name>`**: Identificador único da skill, o agente de IA invoca a skill através deste nome
- **`<description>`**: Explica detalhadamente a funcionalidade e cenários de uso da skill, ajudando a IA a determinar se deve usar esta skill
- **`<location>`**:
  - `project`: Instalada localmente no projeto (`.claude/skills/` ou `.agent/skills/`)
  - `global`: Instalada no diretório global (`~/.claude/skills/`)

::: info Por que precisamos do marcador location?
O marcador `<location>` ajuda o agente de IA a entender o escopo de visibilidade da skill:
- Skills `project` só estão disponíveis no projeto atual
- Skills `global` estão disponíveis em todos os projetos
Isso afeta a estratégia de seleção de skills do agente de IA.
:::

## Métodos de Marcação

O AGENTS.md suporta dois métodos de marcação, o OpenSkills reconhece automaticamente:

### Método 1: Marcação XML (Recomendado)

```xml
<skills_system priority="1">
  <!-- conteúdo das skills -->
</skills_system>
```

Este é o método padrão, usando tags XML padrão para marcar o início e fim do sistema de skills.

### Método 2: Marcação por Comentários HTML (Modo de Compatibilidade)

```xml
<!-- SKILLS_TABLE_START -->

## Available Skills

<usage>
  <!-- instruções de uso -->
</usage>

<available_skills>
  <!-- lista de skills -->
</available_skills>

<!-- SKILLS_TABLE_END -->
```

Este formato remove o container externo `<skills_system>`, usando apenas comentários HTML para marcar o início e fim da área de skills.

::: tip Lógica de processamento do OpenSkills
A função `replaceSkillsSection()` (`src/utils/agents-md.ts:67-93`) procura marcadores na seguinte ordem de prioridade:
1. Primeiro procura a marcação XML `<skills_system>`
2. Se não encontrar, procura o comentário HTML `<!-- SKILLS_TABLE_START -->`
3. Se nenhum for encontrado, anexa o conteúdo ao final do arquivo
:::

## Como o OpenSkills Gera o AGENTS.md

Quando executa `openskills sync`, o OpenSkills:

1. **Encontra todas as skills instaladas** (`findAllSkills()`)
2. **Seleciona skills interativamente** (a menos que use a flag `-y`)
3. **Gera conteúdo XML** (`generateSkillsXml()`)
   - Constrói as instruções de uso `<usage>`
   - Gera tags `<skill>` para cada skill
4. **Substitui a seção de skills no arquivo** (`replaceSkillsSection()`)
   - Procura marcações existentes (XML ou comentários HTML)
   - Substitui o conteúdo entre as marcações
   - Se não houver marcações, anexa ao final do arquivo

### Localização do Código Fonte

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Geração XML | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L23-L62) | 23-62 |
| Substituição da seção de skills | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L67-L93) | 67-93 |
| Parsing de skills existentes | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L6-L18) | 6-18 |

## Notas sobre Edição Manual

::: warning Não recomendamos edição manual
Embora seja possível editar o AGENTS.md manualmente, recomendamos:
1. Usar o comando `openskills sync` para gerar e atualizar
2. O conteúdo editado manualmente será sobrescrito na próxima execução do `sync`
3. Se precisar personalizar a lista de skills, use a seleção interativa (sem a flag `-y`)
:::

Se realmente precisar editar manualmente, observe:

1. **Mantenha a sintaxe XML correta**: Certifique-se de que todas as tags estão fechadas corretamente
2. **Não modifique as marcações**: Preserve as marcações como `<skills_system>` ou `<!-- SKILLS_TABLE_START -->`
3. **Campos completos**: Cada `<skill>` deve conter os três campos `<name>`, `<description>`, `<location>`
4. **Sem skills duplicadas**: Não adicione skills com o mesmo nome repetidamente

## Perguntas Frequentes

### P1: Por que às vezes o AGENTS.md não tem a tag `<skills_system>`?

**R**: Este é o modo de compatibilidade. Se seu arquivo usa marcação por comentários HTML (`<!-- SKILLS_TABLE_START -->`), o OpenSkills também reconhecerá. Na próxima execução do `sync`, será convertido automaticamente para marcação XML.

### P2: Como remover todas as skills?

**R**: Execute `openskills sync` e desmarque todas as skills na interface interativa, ou execute:

```bash
openskills sync -y --output /dev/null
```

Isso limpará a seção de skills do AGENTS.md (mas preservará as marcações).

### P3: O campo location tem impacto real no agente de IA?

**R**: Isso depende da implementação específica do agente de IA. Geralmente:
- `location="project"` indica que a skill só faz sentido no contexto do projeto atual
- `location="global"` indica que a skill é uma ferramenta genérica, usável em qualquer projeto

O agente de IA pode ajustar sua estratégia de carregamento de skills com base neste marcador, mas a maioria dos agentes (como Claude Code) ignora este campo e invoca diretamente `openskills read`.

### P4: Qual o tamanho ideal para a descrição da skill?

**R**: A descrição da skill deve:
- **Ser concisa mas completa**: Explicar a funcionalidade principal e os principais cenários de uso
- **Evitar ser muito curta**: Descrições de uma linha dificultam a compreensão da IA sobre quando usar
- **Evitar ser muito longa**: Descrições longas desperdiçam contexto, a IA não lê cuidadosamente

Tamanho recomendado: **50-150 palavras**.

## Melhores Práticas

1. **Use o comando sync**: Sempre use `openskills sync` para gerar o AGENTS.md, em vez de editar manualmente
2. **Atualize regularmente**: Após instalar ou atualizar skills, lembre-se de executar `openskills sync`
3. **Escolha skills apropriadas**: Nem todas as skills instaladas precisam estar no AGENTS.md, selecione de acordo com as necessidades do projeto
4. **Verifique o formato**: Se o agente de IA não consegue reconhecer as skills, verifique se as tags XML do AGENTS.md estão corretas

## Próxima Aula

> Na próxima aula vamos aprender **[Estrutura de Arquivos](../file-structure/)**.
>
> Você vai aprender:
> - A estrutura de diretórios e arquivos gerada pelo OpenSkills
> - A função e localização de cada arquivo
> - Como entender e gerenciar o diretório de skills

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Atualizado em: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Geração XML de skills | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L23-L62) | 23-62 |
| Substituição da seção de skills | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L67-L93) | 67-93 |
| Parsing de skills existentes | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L6-L18) | 6-18 |
| Definição do tipo Skill | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L1-L6) | 1-6 |

**Constantes-chave**:
- `priority="1"`: Marcador de prioridade do sistema de skills (valor fixo)

**Funções-chave**:
- `generateSkillsXml(skills: Skill[])`: Gera lista de skills no formato XML
- `replaceSkillsSection(content: string, newSection: string)`: Substitui ou anexa a seção de skills
- `parseCurrentSkills(content: string)`: Analisa nomes de skills habilitadas do AGENTS.md

</details>
