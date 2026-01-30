---
title: "Primeira Skill: Instalar Skill Oficial | openskills"
sidebarTitle: "Instalar a primeira skill em 5 minutos"
subtitle: "Primeira Skill: Instalar Skill Oficial"
description: "Aprenda a instalar skills do repositório oficial da Anthropic em seu projeto. Domine o comando openskills install e a seleção interativa, entenda a estrutura de diretórios das skills."
tags:
  - "Tutorial Inicial"
  - "Instalação de Skills"
prerequisite:
  - "start-installation"
order: 4
---

# Instalar a Primeira Skill

## O Que Você Vai Aprender

- Instalar skills do repositório oficial da Anthropic em seu projeto
- Usar a interface de seleção interativa para escolher as skills necessárias
- Entender onde as skills são instaladas (diretório .claude/skills/)
- Verificar se a skill foi instalada com sucesso

::: info Pré-requisitos

Este tutorial assume que você já completou a [instalação do OpenSkills](../installation/). Se ainda não instalou, por favor, complete os passos de instalação primeiro.

:::

---

## Sua Situação Atual

Você pode ter acabado de instalar o OpenSkills, mas:

- **Não sabe onde encontrar skills**: Há muitos repositórios de skills no GitHub, não sabe qual é o oficial
- **Não sabe como instalar skills**: Sabe que existe um comando `install`, mas não sabe como usá-lo
- **Preocupado com a localização da instalação**: Tem medo de instalar as skills globalmente no sistema e não encontrá-las ao mudar de projeto

Esses problemas são bastante comuns. Vamos resolvê-los passo a passo.

---

## Quando Usar Este Método

**Instalar a primeira skill** é adequado para estas situações:

- Primeira vez usando o OpenSkills, quer experimentar rapidamente
- Precisa usar skills fornecidas oficialmente pela Anthropic (como processamento de PDF, fluxo de trabalho Git, etc.)
- Quer usar skills no projeto atual, em vez de instalar globalmente

::: tip Recomendação

Para a primeira instalação, recomenda-se começar pelo repositório oficial da Anthropic `anthropics/skills`, pois estas skills são de alta qualidade e verificadas.

:::

---

## 🎒 Preparação Antes de Começar

Antes de começar, por favor, confirme:

- [ ] Completou a [instalação do OpenSkills](../installation/)
- [ ] Entrou no diretório do seu projeto
- [ ] Configurou o Git (para clonar repositórios do GitHub)

::: warning Verificação Prévia

Se você ainda não tem um diretório de projeto, pode criar um diretório temporário para praticar:

```bash
mkdir my-project && cd my-project
```

:::

---

## Conceito Principal: Instalar Skills do GitHub

O OpenSkills suporta a instalação de skills a partir de repositórios do GitHub. O processo de instalação é o seguinte:

```
[Especificar repositório] → [Clonar para diretório temporário] → [Buscar SKILL.md] → [Seleção interativa] → [Copiar para .claude/skills/]
```

**Pontos-chave**:
- Use o formato `owner/repo` para especificar o repositório do GitHub
- A ferramenta clona automaticamente o repositório para um diretório temporário
- Busca todos os subdiretórios que contêm `SKILL.md`
- Seleciona as skills a instalar através de uma interface interativa
- As skills são copiadas para o diretório `.claude/skills/` do projeto

---

## Siga os Passos

### Passo 1: Entrar no Diretório do Projeto

Primeiro, entre no diretório do projeto em que está trabalhando:

```bash
cd /path/to/your/project
```

**Por quê**

O OpenSkills instala as skills por padrão no diretório `.claude/skills/` do projeto, permitindo que as skills sejam versionadas com o projeto e compartilhadas entre membros da equipe.

**O que você deve ver**:

Seu diretório de projeto deve conter um dos seguintes:

- `.git/` (repositório Git)
- `package.json` (projeto Node.js)
- outros arquivos do projeto

::: tip Recomendação

Mesmo que seja um projeto novo, recomenda-se inicializar um repositório Git primeiro, para gerenciar melhor os arquivos de skills.

:::

---

### Passo 2: Instalar a Skill

Use o seguinte comando para instalar skills do repositório oficial de skills da Anthropic:

```bash
npx openskills install anthropics/skills
```

**Por quê**

`anthropics/skills` é o repositório de skills mantido oficialmente pela Anthropic, contendo exemplos de skills de alta qualidade, ideais para a primeira experiência.

**O que você deve ver**:

O comando iniciará uma interface de seleção interativa:

```
Installing from: anthropics/skills
Location: project (.claude/skills)
Default install is project-local (./.claude/skills). Use --global for ~/.claude/skills.

Cloning repository...
✓ Repository cloned

Found 4 skill(s)

? Select skills to install:
❯ ◉ pdf (24 KB)    Comprehensive PDF manipulation toolkit for extracting text and tables...
  ◯ git-workflow (12 KB)   Git workflow: Best practices for commits, branches, and PRs...
  ◯ check-branch-first (8 KB)    Git workflow: Always check current branch before making changes...
  ◯ skill-creator (16 KB)   Guide for creating effective skills...

<Space> selecionar  <a> selecionar todos  <i> inverter seleção  <Enter> confirmar
```

**Guia de Operação**:

```
┌─────────────────────────────────────────────────────────────┐
│  Instruções de Operação                                     │
│                                                             │
│  Passo 1         Passo 2          Passo 3                   │
│  Mover cursor  →  Pressionar Space  →  Pressionar Enter     │
│                                                             │
│  ○ Não selecionado      ◉ Selecionado                       │
└─────────────────────────────────────────────────────────────┘

Você deve ver:
- O cursor pode mover para cima e para baixo
- Pressione a barra de espaço para alternar o estado de seleção (○ ↔ ◉)
- Pressione Enter para confirmar a instalação
```

---

### Passo 3: Selecionar a Skill

Na interface interativa, selecione a skill que deseja instalar.

**Exemplo**:

Suponha que você queira instalar a skill de processamento de PDF:

```
? Select skills to install:
❯ ◉ pdf (24 KB)    ← selecione este
  ◯ git-workflow (12 KB)
  ◯ check-branch-first (8 KB)
  ◯ skill-creator (16 KB)
```

Operação:
1. **Mover cursor**: Use as setas para cima/baixo para mover até a linha `pdf`
2. **Selecionar skill**: Pressione a **barra de espaço**, certificando-se de que é `◉` e não `◯`
3. **Confirmar instalação**: Pressione **Enter** para iniciar a instalação

**O que você deve ver**:

```
✅ Installed: pdf
   Location: /path/to/your/project/.claude/skills/pdf

Skills installed to: /path/to/your/project/.claude/skills/

Next steps:
  → Run openskills sync to generate AGENTS.md with your installed skills
  → Run openskills list to see all installed skills
```

::: tip Operação Avançada

Se você quiser instalar várias skills de uma vez:
- Pressione a barra de espaço para selecionar cada skill necessária (vários `◉`)
- Pressione `<a>` para selecionar todas as skills
- Pressione `<i>` para inverter a seleção atual

:::

---

### Passo 4: Verificar a Instalação

Após a instalação, verifique se a skill foi instalada com sucesso no diretório do projeto.

**Verificar a estrutura de diretórios**:

```bash
ls -la .claude/skills/
```

**O que você deve ver**:

```
.claude/skills/
└── pdf/
    ├── SKILL.md
    ├── .openskills.json
    ├── references/
    │   ├── pdf-extraction.md
    │   └── table-extraction.md
    └── scripts/
        └── extract-pdf.js
```

**Descrição dos Arquivos-chave**:

| Arquivo | Propósito |
| --- | --- |
| `SKILL.md` | Conteúdo principal e instruções da skill |
| `.openskills.json` | Metadados da instalação (registra a origem, usado para atualizações) |
| `references/` | Documentação de referência e descrições detalhadas |
| `scripts/` | Scripts executáveis |

**Visualizar metadados da skill**:

```bash
cat .claude/skills/pdf/.openskills.json
```

**O que você deve ver**:

```json
{
  "source": "anthropics/skills",
  "sourceType": "git",
  "repoUrl": "https://github.com/anthropics/skills",
  "subpath": "pdf",
  "installedAt": "2026-01-24T10:30:00.000Z"
}
```

Este arquivo de metadados registra as informações de origem da skill, que serão usadas posteriormente com o comando `openskills update`.

---

## Pontos de Verificação ✅

Após completar os passos acima, por favor, confirme:

- [ ] A interface de seleção interativa foi exibida na linha de comando
- [ ] Pelo menos uma skill foi selecionada com sucesso (indicado por `◉`)
- [ ] A instalação foi bem-sucedida, exibindo a mensagem `✅ Installed:`
- [ ] O diretório `.claude/skills/` foi criado
- [ ] O diretório da skill contém o arquivo `SKILL.md`
- [ ] O diretório da skill contém o arquivo de metadados `.openskills.json`

Se todos os itens de verificação acima passaram, parabéns! A primeira skill foi instalada com sucesso.

---

## Avisos de Problemas Comuns

### Problema 1: Falha ao Clonar o Repositório

**Sintoma**:

```
✗ Failed to clone repository
fatal: repository 'https://github.com/anthropics/skills' not found
```

**Causa**:
- Problema de conexão de rede
- Endereço do repositório GitHub incorreto

**Solução**:
1. Verifique a conexão de rede: `ping github.com`
2. Confirme se o endereço do repositório está correto (formato `owner/repo`)

---

### Problema 2: Nenhuma Interface de Seleção Interativa

**Sintoma**:

O comando instalou todas as skills diretamente, sem exibir a interface de seleção.

**Causa**:
- Há apenas um arquivo `SKILL.md` no repositório (repositório de skill única)
- Usou a flag `-y` ou `--yes` (pular seleção)

**Solução**:
- Se for um repositório de skill única, este é o comportamento normal
- Se precisar selecionar, remova a flag `-y`

---

### Problema 3: Erro de Permissão

**Sintoma**:

```
Error: EACCES: permission denied, mkdir '.claude/skills'
```

**Causa**:
- O diretório atual não tem permissão de escrita

**Solução**:
1. Verifique as permissões do diretório: `ls -la`
2. Use `sudo` ou mude para um diretório com permissão

---

### Problema 4: SKILL.md Não Encontrado

**Sintoma**:

```
Error: No SKILL.md files found in repository
```

**Causa**:
- Não há arquivos de skill no formato correto no repositório

**Solução**:
1. Confirme se o repositório é um repositório de skills
2. Verifique a estrutura de diretórios do repositório

---

## Resumo da Aula

Nesta aula, você aprendeu:

- **Usar `openskills install anthropics/skills`** para instalar skills do repositório oficial
- **Selecionar skills na interface interativa**, usando a barra de espaço para selecionar e Enter para confirmar
- **As skills são instaladas em `.claude/skills/`**, contendo `SKILL.md` e metadados
- **Verificar a instalação bem-sucedida**, verificando a estrutura de diretórios e o conteúdo dos arquivos

**Comandos Principais**:

| Comando | Função |
| --- | --- |
| `npx openskills install anthropics/skills` | Instalar skills do repositório oficial |
| `ls .claude/skills/` | Ver skills instaladas |
| `cat .claude/skills/<name>/.openskills.json` | Ver metadados da skill |

---

## Próxima Aula

> Na próxima aula, vamos aprender **[Usar Skills](../read-skills/)**.
>
> Você vai aprender:
> - Usar o comando `openskills read` para ler o conteúdo das skills
> - Entender como o agente de IA carrega skills no contexto
> - Dominar a ordem de prioridade de 4 níveis para busca de skills

Instalar skills é apenas o primeiro passo, em seguida, é necessário entender como o agente de IA usa essas skills.

---

## Apêndice: Referência do Código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Última atualização: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Entrada do comando de instalação | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L83-L183) | 83-183 |
| Determinação da localização de instalação (project vs global) | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L84-L92) | 84-92 |
| Análise do shorthand do GitHub | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L131-L143) | 131-143 |
| Clonagem do repositório | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L155-L169) | 155-169 |
| Busca recursiva de skills | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L358-L373) | 358-373 |
| Interface de seleção interativa | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L427-L455) | 427-455 |
| Cópia e instalação da skill | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L461-L486) | 461-486 |
| Lista de skills oficiais (aviso de conflito) | [`src/utils/marketplace-skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/marketplace-skills.ts) | 1-25 |

**Funções-chave**:
- `installFromRepo()` - Instalar skills do repositório, suporta seleção interativa
- `installSpecificSkill()` - Instalar skill de subcaminho especificado
- `installFromLocal()` - Instalar skills de caminho local
- `warnIfConflict()` - Verificar e avisar sobre conflitos de skills

**Constantes-chave**:
- `ANTHROPIC_MARKETPLACE_SKILLS` - Lista de skills do Anthropic Marketplace, usada para avisos de conflito

</details>
