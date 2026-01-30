---
title: "Instalação: Plugin e Manual | Everything Claude Code"
sidebarTitle: "Instalação em 5 Minutos"
subtitle: "Instalação: Plugin e Manual"
description: "Aprenda as duas formas de instalar o Everything Claude Code. Instalação via marketplace é a mais rápida, instalação manual permite configuração precisa dos componentes."
tags:
  - "installation"
  - "plugin"
  - "setup"
prerequisite:
  - "start-quickstart"
order: 20
---

# Guia de Instalação: Marketplace vs Instalação Manual

## O Que Você Vai Aprender

Ao concluir este tutorial, você será capaz de:

- Instalar o Everything Claude Code com um clique via marketplace de plugins
- Selecionar manualmente os componentes necessários para configuração personalizada
- Configurar corretamente servidores MCP e Hooks
- Verificar se a instalação foi bem-sucedida

## O Dilema Atual

Você quer começar rapidamente com o Everything Claude Code, mas não sabe:

- Usar a instalação com um clique do marketplace ou controlar manualmente cada componente?
- Como evitar erros de configuração que impedem o funcionamento das funcionalidades?
- Na instalação manual, quais arquivos copiar para quais locais?

## Quando Usar Esta Técnica

| Cenário | Método Recomendado | Motivo |
| --- | --- | --- |
| Primeira vez usando | Instalação via marketplace | Mais simples, pronto em 5 minutos |
| Quer testar funcionalidades específicas | Instalação via marketplace | Experimente completamente antes de decidir |
| Tem necessidades específicas | Instalação manual | Controle preciso de cada componente |
| Já tem configurações personalizadas | Instalação manual | Evita sobrescrever configurações existentes |

## Conceito Central

O Everything Claude Code oferece duas formas de instalação:

1. **Instalação via Marketplace** (Recomendado)
   - Adequado para a maioria dos usuários
   - Processa automaticamente todas as dependências
   - Instalação completa com um único comando

2. **Instalação Manual**
   - Adequado para usuários com necessidades específicas
   - Controle preciso sobre quais componentes instalar
   - Requer configuração manual

Independentemente do método escolhido, os arquivos de configuração serão copiados para o diretório `~/.claude/`, permitindo que o Claude Code reconheça e utilize esses componentes.

## 🎒 Preparação Antes de Começar

::: warning Pré-requisitos

Antes de começar, confirme:
- [ ] Claude Code já está instalado
- [ ] Você tem conexão de rede para acessar o GitHub
- [ ] Conhece operações básicas de linha de comando (se escolher instalação manual)

:::

---

## Siga Comigo

### Método 1: Instalação via Marketplace (Recomendado)

Este é o método mais simples, adequado para quem está usando pela primeira vez ou quer uma experiência rápida.

#### Passo 1: Adicionar o Marketplace

**Por que**
Registrar o repositório GitHub como marketplace de plugins do Claude Code para poder instalar os plugins contidos nele.

No Claude Code, digite:

```bash
/plugin marketplace add affaan-m/everything-claude-code
```

**Você deve ver**:
```
Successfully added marketplace affaan-m/everything-claude-code
```

#### Passo 2: Instalar o Plugin

**Por que**
Instalar o plugin Everything Claude Code do marketplace recém-adicionado.

No Claude Code, digite:

```bash
/plugin install everything-claude-code@everything-claude-code
```

**Você deve ver**:
```
Successfully installed everything-claude-code@everything-claude-code
```

::: tip Ponto de Verificação ✅

Verifique se o plugin foi instalado:

```bash
/plugin list
```

Você deve ver `everything-claude-code@everything-claude-code` na saída.

:::

#### Passo 3 (Opcional): Configurar Diretamente o settings.json

**Por que**
Se você preferir pular a linha de comando e modificar diretamente o arquivo de configuração.

Abra `~/.claude/settings.json` e adicione o seguinte conteúdo:

```json
{
  "extraKnownMarketplaces": {
    "everything-claude-code": {
      "source": {
        "source": "github",
        "repo": "affaan-m/everything-claude-code"
      }
    }
  },
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

**Você deve ver**:
- Após atualizar o arquivo de configuração, o Claude Code carregará automaticamente o plugin
- Todos os agents, skills, commands e hooks entrarão em vigor imediatamente

---

### Método 2: Instalação Manual

Adequado para usuários que desejam controle preciso sobre quais componentes instalar.

#### Passo 1: Clonar o Repositório

**Por que**
Obter todos os arquivos fonte do Everything Claude Code.

```bash
git clone https://github.com/affaan-m/everything-claude-code.git
cd everything-claude-code
```

**Você deve ver**:
```
Cloning into 'everything-claude-code'...
remote: Enumerating objects...
```

#### Passo 2: Copiar os Agents

**Por que**
Copiar os sub-agentes especializados para o diretório de agents do Claude Code.

```bash
cp everything-claude-code/agents/*.md ~/.claude/agents/
```

**Você deve ver**:
- 9 novos arquivos de agent no diretório `~/.claude/agents/`

::: tip Ponto de Verificação ✅

Verifique se os agents foram copiados:

```bash
ls ~/.claude/agents/
```

Você deve ver algo como:
```
planner.md architect.md tdd-guide.md code-reviewer.md ...
```

:::

#### Passo 3: Copiar as Rules

**Por que**
Copiar as regras obrigatórias para o diretório de rules do Claude Code.

```bash
cp everything-claude-code/rules/*.md ~/.claude/rules/
```

**Você deve ver**:
- 8 novos arquivos de regras no diretório `~/.claude/rules/`

#### Passo 4: Copiar os Commands

**Por que**
Copiar os comandos de barra para o diretório de commands do Claude Code.

```bash
cp everything-claude-code/commands/*.md ~/.claude/commands/
```

**Você deve ver**:
- 14 novos arquivos de comando no diretório `~/.claude/commands/`

#### Passo 5: Copiar os Skills

**Por que**
Copiar as definições de workflow e conhecimento de domínio para o diretório de skills do Claude Code.

```bash
cp -r everything-claude-code/skills/* ~/.claude/skills/
```

**Você deve ver**:
- 11 novos diretórios de skills no diretório `~/.claude/skills/`

#### Passo 6: Configurar os Hooks

**Por que**
Adicionar a configuração de hooks automatizados ao settings.json do Claude Code.

Copie o conteúdo de `hooks/hooks.json` para seu `~/.claude/settings.json`:

```bash
cat everything-claude-code/hooks/hooks.json
```

Adicione o conteúdo da saída ao `~/.claude/settings.json`, no seguinte formato:

```json
{
  "hooks": [
    {
      "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\.(ts|tsx|js|jsx)$\"",
      "hooks": [
        {
          "type": "command",
          "command": "#!/bin/bash\ngrep -n 'console\\.log' \"$file_path\" && echo '[Hook] Remove console.log' >&2"
        }
      ]
    }
  ]
}
```

**Você deve ver**:
- Ao editar arquivos TypeScript/JavaScript, se houver `console.log`, aparecerá um aviso

::: warning Lembrete Importante

Certifique-se de que o array `hooks` não sobrescreva configurações existentes em `~/.claude/settings.json`. Se já existirem hooks, você precisa mesclá-los.

:::

#### Passo 7: Configurar Servidores MCP

**Por que**
Expandir as capacidades de integração com serviços externos do Claude Code.

De `mcp-configs/mcp-servers.json`, selecione os servidores MCP que você precisa e adicione ao `~/.claude.json`:

```bash
cat everything-claude-code/mcp-configs/mcp-servers.json
```

Copie as configurações necessárias para `~/.claude.json`, por exemplo:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "YOUR_GITHUB_TOKEN_HERE"
      }
    }
  }
}
```

::: danger Importante: Substitua os Placeholders

Você deve substituir os placeholders `YOUR_*_HERE` pelas suas chaves de API reais, caso contrário os servidores MCP não funcionarão.

:::

::: tip Recomendações de Uso do MCP

**Não habilite todos os MCPs!** Muitos MCPs ocupam grande parte da janela de contexto.

- Recomenda-se configurar 20-30 servidores MCP
- Manter menos de 10 habilitados por projeto
- Manter menos de 80 ferramentas ativas

Use `disabledMcpServers` na configuração do projeto para desabilitar MCPs desnecessários:

```json
{
  "disabledMcpServers": ["firecrawl", "supabase"]
}
```

:::

---

## Pontos de Verificação ✅

### Verificar Instalação via Marketplace

```bash
/plugin list
```

Você deve ver `everything-claude-code@everything-claude-code` habilitado.

### Verificar Instalação Manual

```bash
# Verificar agents
ls ~/.claude/agents/ | head -5

# Verificar rules
ls ~/.claude/rules/ | head -5

# Verificar commands
ls ~/.claude/commands/ | head -5

# Verificar skills
ls ~/.claude/skills/ | head -5
```

Você deve ver:
- No diretório agents: `planner.md`, `tdd-guide.md`, etc.
- No diretório rules: `security.md`, `coding-style.md`, etc.
- No diretório commands: `tdd.md`, `plan.md`, etc.
- No diretório skills: `coding-standards`, `backend-patterns`, etc.

### Verificar se as Funcionalidades Estão Disponíveis

No Claude Code, digite:

```bash
/tdd
```

Você deve ver o TDD Guide agent começar a trabalhar.

---

## Alertas de Erros Comuns

### Erro Comum 1: Plugin Não Funciona Após Instalação

**Sintoma**: Após instalar o plugin, os comandos não funcionam.

**Causa**: O plugin não foi carregado corretamente.

**Solução**:
```bash
# Verificar lista de plugins
/plugin list

# Se não estiver habilitado, habilite manualmente
/plugin enable everything-claude-code@everything-claude-code
```

### Erro Comum 2: Falha na Conexão do Servidor MCP

**Sintoma**: Funcionalidades MCP não funcionam, erro de falha de conexão.

**Causa**: Chave de API não substituída ou formato incorreto.

**Solução**:
- Verifique se todos os placeholders `YOUR_*_HERE` em `~/.claude.json` foram substituídos
- Valide se a chave de API é válida
- Confirme se o caminho do comando do servidor MCP está correto

### Erro Comum 3: Hooks Não Disparam

**Sintoma**: Ao editar arquivos, não aparecem avisos dos hooks.

**Causa**: Formato incorreto da configuração de hooks em `~/.claude/settings.json`.

**Solução**:
- Verifique se o formato do array `hooks` está correto
- Certifique-se de que a sintaxe da expressão `matcher` está correta
- Valide se o caminho do comando do hook é executável

### Erro Comum 4: Problemas de Permissão de Arquivo (Instalação Manual)

**Sintoma**: Erro "Permission denied" ao copiar arquivos.

**Causa**: Permissões insuficientes no diretório `~/.claude/`.

**Solução**:
```bash
# Garantir que o diretório .claude existe e tem permissões
mkdir -p ~/.claude/{agents,rules,commands,skills}

# Usar sudo (apenas quando necessário)
sudo cp -r everything-claude-code/agents/*.md ~/.claude/agents/
```

---

## Resumo da Lição

**Comparação dos Dois Métodos de Instalação**:

| Característica | Instalação via Marketplace | Instalação Manual |
| --- | --- | --- |
| Velocidade | ⚡ Rápida | 🐌 Lenta |
| Dificuldade | 🟢 Simples | 🟡 Média |
| Flexibilidade | 🔒 Fixa | 🔓 Personalizável |
| Cenário Recomendado | Iniciantes, experiência rápida | Usuários avançados, necessidades específicas |

**Pontos-Chave**:
- Instalação via marketplace é o método mais simples, resolvido com um único comando
- Instalação manual é adequada para usuários que precisam de controle preciso dos componentes
- Ao configurar MCP, lembre-se de substituir os placeholders e não habilitar muitos
- Ao verificar a instalação, verifique a estrutura de diretórios e a disponibilidade dos comandos

---

## Prévia da Próxima Lição

> Na próxima lição vamos aprender **[Configuração do Gerenciador de Pacotes: Detecção Automática e Personalização](../package-manager-setup/)**.
>
> Você vai aprender:
> - Como o Everything Claude Code detecta automaticamente o gerenciador de pacotes
> - O mecanismo de funcionamento das 6 prioridades de detecção
> - Como personalizar a configuração do gerenciador de pacotes em nível de projeto e usuário
> - Usar o comando `/setup-pm` para configuração rápida

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Última atualização: 2026-01-25

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Metadados do plugin | [`source/affaan-m/everything-claude-code/.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28 |
| Manifesto do marketplace | [`source/affaan-m/everything-claude-code/.claude-plugin/marketplace.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/marketplace.json) | 1-45 |
| Guia de instalação | [`source/affaan-m/everything-claude-code/README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 175-242 |
| Configuração de Hooks | [`source/affaan-m/everything-claude-code/hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-146 |
| Configuração de MCP | [`source/affaan-m/everything-claude-code/mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-95 |

**Configurações-Chave**:
- Nome do plugin: `everything-claude-code`
- Repositório: `affaan-m/everything-claude-code`
- Licença: MIT
- Suporta 9 agents, 14 commands, 8 conjuntos de rules, 11 skills

**Métodos de Instalação**:
1. Instalação via marketplace: `/plugin marketplace add` + `/plugin install`
2. Instalação manual: copiar agents, rules, commands, skills para `~/.claude/`

</details>
