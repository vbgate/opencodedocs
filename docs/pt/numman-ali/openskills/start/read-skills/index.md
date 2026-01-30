---
title: "Comando read: Ler conteúdo de skills instaladas | openskills"
sidebarTitle: "Ler skills instaladas"
subtitle: "Comando read: Ler conteúdo de skills instaladas"
description: "Aprenda a usar o comando openskills read para ler conteúdo de skills instaladas. Domine os 4 níveis de prioridade de busca e o processo completo de carregamento, suporta a leitura de múltiplas skills, ajudando agentes de IA a obter rapidamente definições de skills e executar tarefas."
tags:
  - "Tutorial de introdução"
  - "Uso de skills"
prerequisite:
  - "start-first-skill"
order: 6
---

# Usando skills

## O que você aprenderá

- Usar o comando `openskills read` para ler o conteúdo de skills instaladas
- Entender como agentes de IA carregam skills para o contexto através deste comando
- Dominar a ordem dos 4 níveis de prioridade de busca de skills
- Aprender a ler múltiplas skills de uma vez (separadas por vírgula)

::: info Pré-requisitos

Este tutorial assume que você já [instalou pelo menos uma skill](../first-skill/). Se ainda não instalou nenhuma skill, por favor, complete a instalação primeiro.

:::

---

## O problema atual

Você pode ter instalado skills, mas:

- **Não sabe como fazer a IA usar skills**: As skills estão instaladas, mas como o agente de IA as lê?
- **Não entende a função do comando read**: Sabe que existe um comando `read`, mas não sabe qual é a saída
- **Não entende a ordem de busca de skills**: Tem skills globais e de projeto, qual a IA usa?

Esses problemas são muito comuns. Vamos resolvê-los passo a passo.

---

## Quando usar

**Usar skills (comando read)** é adequado para estas situações:

- **O agente de IA precisa executar tarefas específicas**: como processar PDFs, operar repositórios Git, etc.
- **Verificar se o conteúdo da skill está correto**: verificar se as instruções no SKILL.md estão conforme o esperado
- **Entender a estrutura completa da skill**: visualizar recursos como references/, scripts/, etc.

::: tip Prática recomendada

Geralmente, você não usará o comando `read` diretamente, mas sim o agente de IA o chamará automaticamente. No entanto, entender o formato de saída ajuda na depuração e no desenvolvimento de skills personalizadas.

:::

---

## 🎒 Preparação antes de começar

Antes de começar, por favor, confirme:

- [ ] Concluiu a [instalação da primeira skill](../first-skill/)
- [ ] Instalou pelo menos uma skill no diretório do projeto
- [ ] Pode visualizar o diretório `.claude/skills/`

::: warning Verificação prévia

Se ainda não instalou nenhuma skill, você pode instalar uma skill de teste rapidamente:

```bash
npx openskills install anthropics/skills
# Na interface interativa, selecione qualquer skill (como pdf)
```

:::

---

## Conceito central: Buscar por prioridade e retornar o resultado

O fluxo do comando `read` do OpenSkills é assim:

```
[Especificar nome da skill] → [Buscar por prioridade] → [Encontrar o primeiro] → [Ler SKILL.md] → [Saída para stdout]
```

**Pontos-chave**:

- **4 níveis de prioridade de busca**:
  1. `.agent/skills/` (universal do projeto)
  2. `~/.agent/skills/` (universal global)
  3. `.claude/skills/` (claude do projeto)
  4. `~/.claude/skills/` (claude global)

- **Retorna o primeiro match**: Para ao encontrar o primeiro, não busca nos diretórios subsequentes
- **Diretório base de saída**: O agente de IA precisa deste caminho para resolver arquivos de recursos na skill

---

## Vamos fazer

### Passo 1: Ler uma única skill

Primeiro, tente ler uma skill já instalada.

**Comando de exemplo**:

```bash
npx openskills read pdf
```

**Por quê**

`pdf` é o nome da skill que instalamos na lição anterior. Este comando busca e exibe o conteúdo completo da skill.

**Você deve ver**:

```
Reading: pdf
Base directory: /path/to/your/project/.claude/skills/pdf

---
name: pdf
description: Comprehensive PDF manipulation toolkit for extracting text and tables...
...

Skill read: pdf
```

**Análise da estrutura de saída**:

| Parte | Conteúdo | Função |
| --- | --- | --- |
| `Reading: pdf` | Nome da skill | Identifica qual skill está sendo lida |
| `Base directory: ...` | Diretório base da skill | A IA usa este caminho para resolver recursos como references/, scripts/, etc. |
| Conteúdo SKILL.md | Definição completa da skill | Inclui instruções, referências de recursos, etc. |
| `Skill read: pdf` | Marcador de fim | Indica que a leitura foi concluída |

::: tip Observação

O **diretório base (Base directory)** é muito importante. Caminhos como `references/some-doc.md` na skill são resolvidos relativamente a este diretório.

:::

---

### Passo 2: Ler múltiplas skills

O OpenSkills suporta a leitura de múltiplas skills de uma vez, com os nomes separados por vírgula.

**Comando de exemplo**:

```bash
npx openskills read pdf,git-workflow
```

**Por quê**

Ler múltiplas skills de uma vez pode reduzir o número de chamadas de comando e melhorar a eficiência.

**Você deve ver**:

```
Reading: pdf
Base directory: /path/to/your/project/.claude/skills/pdf

---
name: pdf
description: Comprehensive PDF manipulation toolkit...
...

Skill read: pdf

Reading: git-workflow
Base directory: /path/to/your/project/.claude/skills/git-workflow

---
name: git-workflow
description: Git workflow: Best practices...
...

Skill read: git-workflow
```

**Características**:
- A saída de cada skill é separada por linhas em branco
- Cada skill tem seus próprios marcadores `Reading:` e `Skill read:`
- As skills são lidas na ordem especificada no comando

::: tip Uso avançado

Os nomes de skills podem conter espaços, o comando `read` lida com isso automaticamente:

```bash
npx openskills read pdf, git-workflow  # Os espaços são ignorados
```

:::

---

### Passo 3: Verificar a prioridade de busca

Vamos verificar se a ordem dos 4 níveis de busca está correta.

**Preparar o ambiente**:

Primeiro, instale skills nos diretórios do projeto e global (usando fontes de instalação diferentes):

```bash
# Instalação local no projeto (no diretório do projeto atual)
npx openskills install anthropics/skills

# Instalação global (usando --global)
npx openskills install anthropics/skills --global
```

**Verificar prioridade**:

```bash
# Listar todas as skills
npx openskills list
```

**Você deve ver**:

```
Available skills:

pdf (project)      /path/to/your/project/.claude/skills/pdf
pdf (global)       /home/user/.claude/skills/pdf

Total: 2 skills (1 project, 1 global)
```

**Ler a skill**:

```bash
npx openskills read pdf
```

**Você deve ver**:

```
Reading: pdf
Base directory: /path/to/your/project/.claude/skills/pdf  ← Retorna a skill do projeto primeiro
...
```

**Conclusão**: Como `.claude/skills/` (projeto) tem prioridade maior que `~/.claude/skills/` (global), a skill lida é a local do projeto.

::: tip Aplicação prática

Este mecanismo de prioridade permite que você sobrescreva skills globais em projetos específicos, sem afetar outros projetos. Por exemplo:
- Instale skills comuns globalmente (compartilhados por todos os projetos)
- Instale versões customizadas no projeto (sobrescrevem a versão global)

:::

---

### Passo 4: Ver recursos completos da skill

Skills não contêm apenas SKILL.md, mas também podem ter recursos como references/, scripts/, etc.

**Ver estrutura do diretório da skill**:

```bash
ls -la .claude/skills/pdf/
```

**Você deve ver**:

```
.claude/skills/pdf/
├── SKILL.md
├── .openskills.json
├── references/
│   ├── pdf-extraction.md
│   └── table-extraction.md
└── scripts/
    └── extract-pdf.js
```

**Ler a skill e observar a saída**:

```bash
npx openskills read pdf
```

**Você deve ver**:

O SKILL.md contém referências a recursos, como:

```markdown
## References

See [PDF extraction guide](references/pdf-extraction.md) for details.

## Scripts

Run `node scripts/extract-pdf.js` to extract text from PDF.
```

::: info Ponto chave

Quando um agente de IA lê uma skill, ele:
1. Obtém o caminho `Base directory`
2. Concatena caminhos relativos no SKILL.md (como `references/...`) com o diretório base
3. Lê o conteúdo dos arquivos de recursos reais

É por isso que o comando `read` deve retornar o `Base directory`.

:::

---

## Checkpoint ✅

Após completar os passos acima, por favor confirme:

- [ ] A linha de comando exibiu o conteúdo completo do SKILL.md da skill
- [ ] A saída contém `Reading: <name>` e `Base directory: <path>`
- [ ] A saída termina com o marcador `Skill read: <name>`
- [ ] Ao ler múltiplas skills, cada uma é separada por linhas em branco
- [ ] Prioriza a leitura da skill local do projeto em vez da global

Se todos os itens acima passarem, parabéns! Você dominou o processo central de leitura de skills.

---

## Avisos de armadilhas

### Problema 1: Skill não encontrada

**Sintoma**:

```
Error: Skill(s) not found: pdf

Searched:
  .agent/skills/ (project universal)
  ~/.agent/skills/ (global universal)
  .claude/skills/ (project)
  ~/.claude/skills/ (global)

Install skills: npx openskills install owner/repo
```

**Causa**:
- Skill não está instalada
- Nome da skill digitado incorretamente

**Solução**:
1. Liste as skills instaladas: `npx openskills list`
2. Confirme se o nome da skill está correto
3. Se não estiver instalada, use `openskills install` para instalar

---

### Problema 2: Lendo a skill errada

**Sintoma**:

Esperava ler a skill do projeto, mas leu a skill global.

**Causa**:
- O diretório do projeto não é o local correto (usou o diretório errado)

**Solução**:
1. Verifique o diretório de trabalho atual: `pwd`
2. Certifique-se de estar no diretório correto do projeto
3. Use `openskills list` para ver a etiqueta `location` das skills

---

### Problema 3: Ordem de leitura de múltiplas skills não conforme o esperado

**Sintoma**:

```bash
npx openskills read skill-a,skill-b
```

Esperava ler skill-b primeiro, mas leu skill-a primeiro.

**Causa**:
- O comando `read` lê na ordem especificada nos parâmetros, não ordena automaticamente

**Solução**:
- Se precisar de uma ordem específica, especifique os nomes das skills na ordem desejada no comando

---

### Problema 4: Conteúdo do SKILL.md truncado

**Sintoma**:

O conteúdo do SKILL.md na saída está incompleto, faltando a parte final.

**Causa**:
- Arquivo da skill corrompido ou com erro de formato
- Problema de codificação do arquivo

**Solução**:
1. Verifique o arquivo SKILL.md: `cat .claude/skills/<name>/SKILL.md`
2. Confirme se o arquivo está completo e com formato correto (deve ter frontmatter YAML)
3. Reinstale a skill: `openskills update <name>`

---

## Resumo desta lição

Nesta lição, você aprendeu:

- **Usar `openskills read <name>`** para ler o conteúdo de skills instaladas
- **Entender os 4 níveis de prioridade de busca**: projeto universal > global universal > projeto claude > global claude
- **Suporte a leitura de múltiplas skills**: use vírgulas para separar nomes
- **Formato de saída**: inclui `Reading:`, `Base directory`, conteúdo da skill, marcador `Skill read:`

**Conceitos centrais**:

| Conceito | Descrição |
| --- | ---|
| **Prioridade de busca** | 4 diretórios buscados em ordem, retorna o primeiro match |
| **Diretório base** | Diretório de referência usado pelo agente de IA para resolver caminhos relativos na skill |
| **Leitura de múltiplas skills** | Separadas por vírgulas, lidas na ordem especificada |

**Comandos principais**:

| Comando | Função |
| --- | ---|
| `npx openskills read <name>` | Ler uma única skill |
| `npx openskills read name1,name2` | Ler múltiplas skills |
| `npx openskills list` | Ver skills instaladas e suas localizações |

---

## Próxima lição

> Na próxima lição aprenderemos **[Detalhes dos comandos](../../platforms/cli-commands/)**.
>
> Você aprenderá:
> - Lista completa de todos os comandos OpenSkills e seus parâmetros
> - Como usar flags de linha de comando e suas funções
> - Referência rápida dos comandos mais usados

Depois de aprender a usar skills, o próximo passo é conhecer todos os comandos que o OpenSkills oferece e suas funções.

---

## Apêndice: Referência do código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-24

| Função | Caminho do arquivo | Linhas |
| --- | --- | ---|
| Entrada do comando read | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts#L8-L48) | 8-48 |
| Busca de skill (findSkill) | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L69-L84) | 69-84 |
| Normalização de nomes de skills | [`src/utils/skill-names.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-names.ts) | 1-8 |
| Obtenção de diretórios de busca | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts#L18-L25) | 18-25 |
| Definição de comandos CLI | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L52-L55) | 52-55 |

**Funções-chave**:
- `readSkill(skillNames)` - Lê skills para stdout, suporta múltiplos nomes
- `findSkill(skillName)` - Busca skills por 4 níveis de prioridade, retorna o primeiro match
- `normalizeSkillNames(input)` - Normaliza lista de nomes de skills, suporta separação por vírgulas e deduplicação
- `getSearchDirs()` - Retorna 4 diretórios de busca, ordenados por prioridade

**Tipos-chave**:
- `SkillLocation` - Informações de localização da skill, inclui path, baseDir, source

**Prioridade de diretórios** (de dirs.ts:18-24):
```typescript
[
  process.cwd() + '/.agent/skills',   // 1. Project universal
  homedir() + '/.agent/skills',       // 2. Global universal
  process.cwd() + '/.claude/skills',  // 3. Project claude
  homedir() + '/.claude/skills',      // 4. Global claude
]
```

</details>
