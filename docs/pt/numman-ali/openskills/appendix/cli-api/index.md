---
title: "API CLI: Referência de Comandos | OpenSkills"
subtitle: "API CLI: Referência de Comandos | OpenSkills"
sidebarTitle: "Comandos Completos"
description: "Aprenda a API completa de linha de comando do OpenSkills. Consulte todos os parâmetros, opções e exemplos de uso dos comandos para dominar rapidamente a utilização."
tags:
  - "API"
  - "CLI"
  - "Referência de Comandos"
  - "Descrição de Opções"
prerequisite: []
order: 1
---

# Referência da API CLI do OpenSkills

## O Que Você Vai Aprender

- Conhecer o uso completo de todos os comandos do OpenSkills
- Dominar os parâmetros e opções de cada comando
- Saber como combinar comandos para completar tarefas

## O Que É Isso

A referência da API CLI do OpenSkills fornece documentação completa de todos os comandos, incluindo parâmetros, opções e exemplos de uso. Este é o manual de referência para consultar quando você precisa entender profundamente um comando específico.

---

## Visão Geral

A CLI do OpenSkills fornece os seguintes comandos:

```bash
openskills install <source>    # Instalar skills
openskills list                # Listar skills instalados
openskills read <name>         # Ler conteúdo do skill
openskills sync                # Sincronizar com AGENTS.md
openskills update [name...]    # Atualizar skills
openskills manage              # Gerenciar skills interativamente
openskills remove <name>       # Remover skills
```

---

## Comando install

Instala skills do GitHub, caminho local ou repositório git privado.

### Sintaxe

```bash
openskills install <source> [options]
```

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `<source>` | string | S | Fonte do skill (veja formatos de fonte abaixo) |

### Opções

| Opção | Abreviação | Tipo | Padrão | Descrição |
| --- | --- | --- | --- | --- |
| `--global` | `-g` | flag | false | Instalação global em `~/.claude/skills/` |
| `--universal` | `-u` | flag | false | Instala em `.agent/skills/` (ambiente multi-agente) |
| `--yes` | `-y` | flag | false | Pula seleção interativa, instala todos os skills encontrados |

### Formatos de Fonte

| Formato | Exemplo | Descrição |
| --- | --- | --- |
| GitHub shorthand | `anthropics/skills` | Instala de repositório público do GitHub |
| Git URL | `https://github.com/owner/repo.git` | URL Git completa |
| SSH Git URL | `git@github.com:owner/repo.git` | Repositório privado via SSH |
| Caminho local | `./my-skill` ou `~/dev/skills` | Instala de diretório local |

### Exemplos

```bash
# Instalar do GitHub (modo interativo)
openskills install anthropics/skills

# Instalar do GitHub (não interativo)
openskills install anthropics/skills -y

# Instalação global
openskills install anthropics/skills --global

# Instalação em ambiente multi-agente
openskills install anthropics/skills --universal

# Instalar de caminho local
openskills install ./my-custom-skill

# Instalar de repositório privado
openskills install git@github.com:your-org/private-skills.git
```

### Saída

Após instalação bem-sucedida, será exibido:
- Lista de skills instalados
- Local de instalação (project/global)
- Prompt para executar `openskills sync`

---

## Comando list

Lista todos os skills instalados.

### Sintaxe

```bash
openskills list
```

### Parâmetros

Nenhum.

### Opções

Nenhuma.

### Exemplo

```bash
openskills list
```

### Saída

```
Skills instalados:

┌────────────────────┬────────────────────────────────────┬──────────┐
│ Nome do Skill      │ Descrição                          │ Local    │
├────────────────────┼────────────────────────────────────┼──────────┤
│ pdf                │ PDF manipulation toolkit           │ project  │
│ git-workflow       │ Git workflow automation            │ global   │
│ skill-creator      │ Guide for creating effective skills│ project  │
└────────────────────┴────────────────────────────────────┴──────────┘

Estatísticas: 3 skills (2 em nível de projeto, 1 global)
```

### Explicação de Localização de Skills

- **project**: Instalado em `.claude/skills/` ou `.agent/skills/`
- **global**: Instalado em `~/.claude/skills/` ou `~/.agent/skills/`

---

## Comando read

Lê o conteúdo do skill para saída padrão (para uso por agentes de IA).

### Sintaxe

```bash
openskills read <skill-names...>
```

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `<skill-names...>` | string | S | Nomes dos skills (suporta lista separada por vírgulas) |

### Opções

Nenhuma.

### Exemplos

```bash
# Ler skill único
openskills read pdf

# Ler múltiplos skills (separados por vírgula)
openskills read pdf,git-workflow

# Ler múltiplos skills (separados por espaço)
openskills read pdf git-workflow
```

### Saída

```
=== SKILL: pdf ===
Base Directory: /path/to/.claude/skills/pdf
---
# PDF Skill Instructions

When user asks you to work with PDFs, follow these steps:
1. Install dependencies: `pip install pypdf2`
2. Extract text using scripts/extract_text.py
3. Use references/api-docs.md for details

=== END SKILL ===
```

### Uso

Este comando é usado principalmente por agentes de IA para carregar conteúdo de skills. Usuários também podem usá-lo para visualizar instruções detalhadas do skill.

---

## Comando sync

Sincroniza skills instalados para AGENTS.md (ou outro arquivo).

### Sintaxe

```bash
openskills sync [options]
```

### Parâmetros

Nenhum.

### Opções

| Opção | Abreviação | Tipo | Padrão | Descrição |
| --- | --- | --- | --- | --- |
| `--output <path>` | `-o` | string | `AGENTS.md` | Caminho do arquivo de saída |
| `--yes` | `-y` | flag | false | Pula seleção interativa, sincroniza todos os skills |

### Exemplos

```bash
# Sincronizar para AGENTS.md padrão (interativo)
openskills sync

# Sincronizar para caminho personalizado
openskills sync -o .ruler/AGENTS.md

# Sincronização não interativa (CI/CD)
openskills sync -y

# Sincronização não interativa para caminho personalizado
openskills sync -y -o .ruler/AGENTS.md
```

### Saída

Após sincronização, o seguinte conteúdo será gerado no arquivo especificado:

```xml
<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively.

How to use skills:
- Invoke: `npx openskills read <skill-name>` (run in your shell)
- The skill content will load with detailed instructions
- Base directory provided in output for resolving bundled resources

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
</usage>

<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms.</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

---

## Comando update

Atualiza skills instalados a partir da fonte.

### Sintaxe

```bash
openskills update [skill-names...]
```

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `[skill-names...]` | string | N | Nomes dos skills (separados por vírgula), padrão: todos |

### Opções

Nenhuma.

### Exemplos

```bash
# Atualizar todos os skills instalados
openskills update

# Atualizar skills específicos
openskills update pdf,git-workflow

# Atualizar skill único
openskills update pdf
```

### Saída

```
Updating skills...

✓ Updated pdf (project)
✓ Updated git-workflow (project)
⚠ Skipped old-skill (no metadata)

Summary:
- Updated: 2
- Skipped: 1
```

### Regras de Atualização

- Atualiza apenas skills com registro de metadados
- Skills de caminho local: copiados diretamente do caminho de origem
- Skills de repositório Git: re-clonados e copiados
- Skills sem metadados: ignorados com prompt para reinstalar

---

## Comando manage

Gerenciamento interativo (remoção) de skills instalados.

### Sintaxe

```bash
openskills manage
```

### Parâmetros

Nenhum.

### Opções

Nenhuma.

### Exemplo

```bash
openskills manage
```

### Interface Interativa

```
Selecione skills para remover:

[ ] pdf - PDF manipulation toolkit
[ ] git-workflow - Git workflow automation
[*] skill-creator - Guide for creating effective skills

Ações: [↑/↓] Selecionar [Espaço] Alternar [Enter] Confirmar [Esc] Cancelar
```

### Saída

```
1 skill removido:
- skill-creator (project)
```

---

## Comando remove

Remove skills instalados específicos (modo script).

### Sintaxe

```bash
openskills remove <skill-name>
```

### Alias

`rm`

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `<skill-name>` | string | S | Nome do skill |

### Opções

Nenhuma.

### Exemplos

```bash
# Remover skill
openskills remove pdf

# Usar alias
openskills rm pdf
```

### Saída

```
Skill removido: pdf (project)
Local: /path/to/.claude/skills/pdf
Fonte: anthropics/skills
```

---

## Opções Globais

As seguintes opções se aplicam a todos os comandos:

| Opção | Abreviação | Tipo | Padrão | Descrição |
| --- | --- | --- | --- | --- |
| `--version` | `-V` | flag | - | Exibe número da versão |
| `--help` | `-h` | flag | - | Exibe informações de ajuda |

### Exemplos

```bash
# Exibir versão
openskills --version

# Exibir ajuda global
openskills --help

# Exibir ajuda de comando específico
openskills install --help
```

---

## Prioridade de Busca de Skills

Quando existem múltiplos locais de instalação, skills são buscados na seguinte ordem de prioridade (do mais alto para o mais baixo):

1. `./.agent/skills/` - Universal em nível de projeto
2. `~/.agent/skills/` - Universal em nível global
3. `./.claude/skills/` - Nível de projeto
4. `~/.claude/skills/` - Nível global

**Importante**: Apenas o primeiro skill correspondente encontrado será retornado (o de maior prioridade).

---

## Códigos de Saída

| Código de Saída | Descrição |
| --- | --- |
| 0 | Sucesso |
| 1 | Erro (erro de parâmetro, falha no comando, etc.) |

---

## Variáveis de Ambiente

A versão atual não suporta configuração por variáveis de ambiente.

---

## Arquivos de Configuração

O OpenSkills usa os seguintes arquivos de configuração:

- **Metadados do skill**: `.claude/skills/<skill-name>/.openskills.json`
- Registra fonte de instalação, timestamps, etc.
- Usado pelo comando `update` para atualizar skills

### Exemplo de Metadados

```json
{
  "name": "pdf",
  "source": "anthropics/skills",
  "sourceType": "github",
  "repoUrl": "https://github.com/anthropics/skills.git",
  "subpath": "pdf",
  "installedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## Próxima Lição

> Na próxima lição aprenderemos **[Especificação de Formato AGENTS.md](../agents-md-format/)**.
>
> Você vai aprender:
> - A estrutura de tags XML do AGENTS.md e o significado de cada tag
> - Definições de campos da lista de skills e restrições de uso
> - Como o OpenSkills gera e atualiza o AGENTS.md
> - Métodos de marcação (marcação XML e marcação de comentários HTML)

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código fonte</strong></summary>

> Atualizado em: 2026-01-24

| Comando | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Entrada CLI | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts) | 13-80 |
| Comando install | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 1-562 |
| Comando list | [`src/commands/list.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/list.ts) | 1-50 |
| Comando read | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts) | 1-50 |
| Comando sync | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts) | 1-101 |
| Comando update | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts) | 1-173 |
| Comando manage | [`src/commands/manage.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/manage.ts) | 1-50 |
| Comando remove | [`src/commands/remove.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/remove.ts) | 1-30 |
| Definições de Tipos | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts) | 1-25 |

**Constantes Principais**:
- Sem constantes globais

**Tipos Principais**:
- `Skill`: Interface de informação do skill (name, description, location, path)
- `SkillLocation`: Interface de localização do skill (path, baseDir, source)
- `InstallOptions`: Interface de opções de instalação (global, universal, yes)

**Funções Principais**:
- `program.command()`: Define comando (commander.js)
- `program.option()`: Define opção (commander.js)
- `program.action()`: Define função de tratamento do comando (commander.js)

</details>
