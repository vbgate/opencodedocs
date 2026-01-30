---
title: "Comandos Detalhados: Referência CLI do OpenSkills | openskills"
sidebarTitle: "Domine os 7 comandos"
subtitle: "Comandos Detalhados: Referência CLI do OpenSkills"
description: "Aprenda os 7 comandos e parâmetros do OpenSkills. Domine a referência completa de install, list, read, update, sync, manage, remove para melhorar a eficiência da ferramenta CLI."
tags:
  - "CLI"
  - "Referência de comandos"
  - "Tabela de referência rápida"
prerequisite:
  - "start-installation"
  - "start-first-skill"
order: 1
---
# Comandos Detalhados: Tabela de Referência Rápida Completa do OpenSkills

## O que você poderá fazer ao final

- Usar熟练 todos os 7 comandos do OpenSkills
- Entender o papel e os cenários de uso das opções globais
- Encontrar rapidamente o significado dos parâmetros e flags dos comandos
- Usar comandos não interativos em scripts

## Visão geral dos comandos

O OpenSkills oferece os seguintes 7 comandos:

| Comando | Uso | Cenário de uso |
|--- | --- | ---|
| `install` | Instalar habilidades | Instalar novas habilidades do GitHub, caminho local ou repositório privado |
| `list` | Listar habilidades | Ver todas as habilidades instaladas e suas localizações |
| `read` | Ler habilidade | Permitir que o agente AI carregue o conteúdo da habilidade (geralmente chamado automaticamente pelo agente) |
| `update` | Atualizar habilidade | Atualizar habilidades instaladas a partir do repositório de origem |
| `sync` | Sincronizar | Escrever a lista de habilidades no AGENTS.md |
| `manage` | Gerenciar | Excluir habilidades de forma interativa |
| `remove` | Remover | Excluir habilidade especificada (forma de script) |

::: info Dica
Use `npx openskills --help` para ver uma breve descrição de todos os comandos.
:::

## Opções globais

Alguns comandos suportam as seguintes opções globais:

| Opção | Curta | Função | Comandos aplicáveis |
|--- | --- | --- | ---|
| `--global` | `-g` | Instalar no diretório global `~/.claude/skills/` | `install` |
| `--universal` | `-u` | Instalar no diretório universal `.agent/skills/` (ambiente multi-agente) | `install` |
| `--yes` | `-y` | Ignorar prompts interativos, usar comportamento padrão | `install`, `sync` |
| `--output <path>` | `-o <path>` | Especificar o caminho do arquivo de saída | `sync` |

## Detalhes dos comandos

### install - Instalar habilidade

Instala habilidades do repositório GitHub, caminho local ou repositório git privado.

```bash
openskills install <source> [options]
```

**Parâmetros**:

| Parâmetro | Obrigatório | Descrição |
|--- | --- | ---|
| `<source>` | ✅ | Fonte da habilidade (shorthand do GitHub, URL git ou caminho local) |

**Opções**:

| Opção | Curta | Padrão | Descrição |
|--- | --- | --- | ---|
| `--global` | `-g` | `false` | Instalar no diretório global `~/.claude/skills/` |
| `--universal` | `-u` | `false` | Instalar no diretório universal `.agent/skills/` |
| `--yes` | `-y` | `false` | Ignorar seleção interativa, instalar todas as habilidades encontradas |

**Exemplos do parâmetro source**:

```bash
# GitHub shorthand (recomendado)
openskills install anthropics/skills

# Especificar branch
openskills install owner/repo@branch

# Repositório privado
openskills install git@github.com:owner/repo.git

# Caminho local
openskills install ./path/to/skill

# URL Git
openskills install https://github.com/owner/repo.git
```

**Descrição do comportamento**:

- Durante a instalação, lista todas as habilidades encontradas para seleção
- Use `--yes` para pular a seleção e instalar todas as habilidades
- Prioridade de localização de instalação: `--universal` → `--global` → diretório padrão do projeto
- Após a instalação, cria um arquivo de metadados `.openskills.json` no diretório da habilidade

---

### list - Listar habilidades

Lista todas as habilidades instaladas.

```bash
openskills list
```

**Opções**: Nenhuma

**Formato de saída**:

```
Available Skills:

skill-name           [description]            (project/global)
```

**Descrição do comportamento**:

- Ordenado por localização: habilidades do projeto primeiro, habilidades globais depois
- Dentro da mesma localização, ordenado alfabeticamente
- Exibe nome da habilidade, descrição e etiqueta de localização

---

### read - Ler habilidade

Lê o conteúdo de uma ou mais habilidades para a saída padrão. Este comando é usado principalmente para que agentes AI carreguem habilidades sob demanda.

```bash
openskills read <skill-names...>
```

**Parâmetros**:

| Parâmetro | Obrigatório | Descrição |
|--- | --- | ---|
| `<skill-names...>` | ✅ | Lista de nomes de habilidades (suporta múltiplos, separados por espaço ou vírgula) |

**Opções**: Nenhuma

**Exemplos**:

```bash
# Ler uma única habilidade
openskills read pdf

# Ler múltiplas habilidades
openskills read pdf git

# Separado por vírgula (também suportado)
openskills read "pdf,git,excel"
```

**Formato de saída**:

```
Skill: pdf
Base Directory: /path/to/.claude/skills/pdf

---SKILL.md 内容---

[SKILL.END]
```

**Descrição do comportamento**:

- Busca habilidades em 4 níveis de prioridade de diretório
- Exibe nome da habilidade, caminho do diretório base e conteúdo completo do SKILL.md
- Exibe mensagem de erro para habilidades não encontradas

---

### update - Atualizar habilidade

Atualiza habilidades instaladas a partir da fonte gravada. Se nenhum nome de habilidade for especificado, atualiza todas as habilidades instaladas.

```bash
openskills update [skill-names...]
```

**Parâmetros**:

| Parâmetro | Obrigatório | Descrição |
|--- | --- | ---|
| `[skill-names...]` | ❌ | Lista de nomes de habilidades a atualizar (padrão: todas) |

**Opções**: Nenhuma

**Exemplos**:

```bash
# Atualizar todas as habilidades
openskills update

# Atualizar habilidades específicas
openskills update pdf git

# Separado por vírgula (também suportado)
openskills update "pdf,git,excel"
```

**Descrição do comportamento**:

- Atualiza apenas habilidades com metadados (habilidades instaladas via install)
- Pula habilidades sem metadados e exibe aviso
- Atualiza o timestamp de instalação após atualização bem-sucedida
- Usa shallow clone (`--depth 1`) ao atualizar de repositórios git

---

### sync - Sincronizar para AGENTS.md

Sincroniza habilidades instaladas para AGENTS.md (ou outro arquivo personalizado), gerando uma lista de habilidades usável por agentes AI.

```bash
openskills sync [options]
```

**Opções**:

| Opção | Curta | Padrão | Descrição |
|--- | --- | --- | ---|
| `--output <path>` | `-o <path>` | `AGENTS.md` | Caminho do arquivo de saída |
| `--yes` | `-y` | `false` | Ignorar seleção interativa, sincronizar todas as habilidades |

**Exemplos**:

```bash
# Sincronizar para arquivo padrão
openskills sync

# Sincronizar para arquivo personalizado
openskills sync -o .ruler/AGENTS.md

# Ignorar seleção interativa
openskills sync -y
```

**Descrição do comportamento**:

- Analisa arquivo existente e pré-seleciona habilidades já habilitadas
- Na primeira sincronização, seleciona habilidades do projeto por padrão
- Gera formato XML compatível com Claude Code
- Suporta substituir ou anexar seção de habilidades em arquivo existente

---

### manage - Gerenciar habilidades

Remove habilidades instaladas de forma interativa. Fornece uma interface amigável de remoção.

```bash
openskills manage
```

**Opções**: Nenhuma

**Descrição do comportamento**:

- Exibe todas as habilidades instaladas para seleção
- Não seleciona nenhuma habilidade por padrão
- Remove imediatamente após seleção, sem confirmação secundária

---

### remove - Remover habilidade

Remove habilidades instaladas especificadas (forma de script). Mais conveniente que `manage` ao usar em scripts.

```bash
openskills remove <skill-name>
```

**Parâmetros**:

| Parâmetro | Obrigatório | Descrição |
|--- | --- | ---|
| `<skill-name>` | ✅ | Nome da habilidade a ser removida |

**Opções**: Nenhuma

**Exemplos**:

```bash
openskills remove pdf

# Também pode usar alias
openskills rm pdf
```

**Descrição do comportamento**:

- Remove todo o diretório da habilidade (incluindo todos os arquivos e subdiretórios)
- Exibe localização de remoção e origem
- Exibe erro e sai quando a habilidade não é encontrada

## Tabela de referência rápida de operações

| Tarefa | Comando |
|--- | ---|
| Ver todas as habilidades instaladas | `openskills list` |
| Instalar habilidades oficiais | `openskills install anthropics/skills` |
| Instalar do caminho local | `openskills install ./my-skill` |
| Instalar habilidade globalmente | `openskills install owner/skill --global` |
| Atualizar todas as habilidades | `openskills update` |
| Atualizar habilidades específicas | `openskills update pdf git` |
| Remover habilidades de forma interativa | `openskills manage` |
| Remover habilidade especificada | `openskills remove pdf` |
| Sincronizar para AGENTS.md | `openskills sync` |
| Caminho de saída personalizado | `openskills sync -o custom.md` |

## Avisos de armadilhas

### 1. Comando não encontrado

**Problema**: Executar o comando e receber "command not found"

**Causas**:
- Node.js não instalado ou versão muito antiga (necessário 20.6+)
- Não usando `npx` ou não instalado globalmente

**Solução**:
```bash
# Usar npx (recomendado)
npx openskills list

# Ou instalar globalmente
npm install -g openskills
```

### 2. Habilidade não encontrada

**Problema**: `openskills read skill-name` exibe "Skill not found"

**Causas**:
- Habilidade não instalada
- Erro de ortografia do nome da habilidade
- Localização de instalação da habilidade não está no caminho de busca

**Solução**:
```bash
# Verificar habilidades instaladas
openskills list

# Ver diretórios de habilidades
ls -la .claude/skills/
ls -la ~/.claude/skills/
```

### 3. Falha na atualização

**Problema**: `openskills update` exibe "No metadata found"

**Causas**:
- Habilidade não instalada via comando `install`
- Arquivo de metadados `.openskills.json` foi excluído

**Solução**: Reinstalar a habilidade
```bash
openskills install <original-source>
```

## Resumo da lição

O OpenSkills fornece uma interface de linha de comando completa, cobrindo instalação, listagem, leitura, atualização, sincronização e gerenciamento de habilidades. Dominar esses comandos é a base para usar o OpenSkills de forma eficiente:

- `install` - Instalar novas habilidades (suporta GitHub, local, repositório privado)
- `list` - Ver habilidades instaladas
- `read` - Ler conteúdo da habilidade (usado por agentes AI)
- `update` - Atualizar habilidades instaladas
- `sync` - Sincronizar para AGENTS.md
- `manage` - Remover habilidades de forma interativa
- `remove` - Remover habilidade especificada

Lembre o papel das opções globais:
- `--global` / `--universal` - Controlar localização de instalação
- `--yes` - Ignorar prompts interativos (adequado para CI/CD)
- `--output` - Caminho do arquivo de saída personalizado

## Próximo anúncio de lição

> Na próxima lição, aprenderemos **[Detalhes das fontes de instalação](../install-sources/)**.
>
> Você aprenderá:
> - Uso detalhado de três métodos de instalação
> - Cenários aplicáveis para cada método
> - Métodos de configuração de repositórios privados
