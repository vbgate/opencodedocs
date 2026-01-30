---
title: "Falha de Conexão MCP: Solução de Problemas de Configuração | Everything Claude Code"
sidebarTitle: "Resolver Problemas de Conexão MCP"
subtitle: "Falha de Conexão MCP: Solução de Problemas de Configuração"
description: "Aprenda métodos de solução de problemas para conexões de servidores MCP. Resolva 6 problemas comuns, incluindo erros de chave de API, janela de contexto insuficiente, erros de configuração de tipo de servidor, fornecendo fluxo de reparo sistemático."
tags:
  - "troubleshooting"
  - "mcp"
  - "configuration"
prerequisite:
  - "start-mcp-setup"
order: 160
---

# Solução de Problemas Comuns: Falha de Conexão MCP

## O Problema que Você Encontra

Após configurar os servidores MCP, você pode encontrar estes problemas:

- ❌ Claude Code exibe "Failed to connect to MCP server"
- ❌ Comandos relacionados ao GitHub/Supabase não funcionam
- ❌ Janela de contexto subitamente reduzida, chamadas de ferramentas lentas
- ❌ Filesystem MCP não consegue acessar arquivos
- ❌ Muitos servidores MCP habilitados, sistema travando

Não se preocupe, esses problemas têm soluções claras. Esta lição ajuda você a diagnosticar sistematicamente problemas de conexão MCP.

---

## Problema Comum 1: Chave de API Não Configurada ou Inválida

### Sintoma

Ao tentar usar servidores MCP como GitHub, Firecrawl, o Claude Code exibe:

```
Failed to execute tool: Missing GITHUB_PERSONAL_ACCESS_TOKEN
```

Ou

```
Failed to connect to MCP server: Authentication failed
```

### Causa

Os placeholders `YOUR_*_HERE` no arquivo de configuração MCP não foram substituídos pelas chaves de API reais.

### Solução

**Passo 1: Verificar Arquivo de Configuração**

Abra `~/.claude.json`, encontre a configuração do servidor MCP correspondente:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"  // ← Verifique aqui
      },
      "description": "GitHub operations - PRs, issues, repos"
    }
  }
}
```

**Passo 2: Substituir Placeholder**

Substitua `YOUR_GITHUB_PAT_HERE` pela sua chave de API real:

```json
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxx"
  }
}
```

**Passo 3: Obter Chaves para Servidores MCP Comuns**

| Servidor MCP | Nome da Variável de Ambiente | Onde Obter |
| --- | --- | --- |
| GitHub | `GITHUB_PERSONAL_ACCESS_TOKEN` | GitHub Settings → Developer Settings → Personal access tokens |
| Firecrawl | `FIRECRAWL_API_KEY` | Firecrawl Dashboard → API Keys |
| Supabase | Referência do projeto | Supabase Dashboard → Settings → API |

**Você Deveria Ver**: Após reiniciar o Claude Code, as ferramentas relacionadas podem ser chamadas normalmente.

### Alerta de Armadilha

::: danger Aviso de Segurança
Não faça commit de arquivos de configuração contendo chaves de API reais para repositórios Git. Certifique-se de que `~/.claude.json` está no `.gitignore`.
:::

---

## Problema Comum 2: Janela de Contexto Insuficiente

### Sintoma

- Lista de chamadas de ferramentas subitamente muito curta
- Claude exibe "Context window exceeded"
- Velocidade de resposta visivelmente mais lenta

### Causa

Muitos servidores MCP habilitados, ocupando a janela de contexto. De acordo com o README do projeto, **uma janela de contexto de 200k encolhe para 70k devido a muitos MCPs habilitados**.

### Solução

**Passo 1: Verificar Quantidade de MCPs Habilitados**

Veja a seção `mcpServers` em `~/.claude.json`, conte o número de servidores habilitados.

**Passo 2: Usar `disabledMcpServers` para Desabilitar Servidores Desnecessários**

Adicione na configuração de nível de projeto (`~/.claude/settings.json` ou `.claude/settings.json` do projeto):

```json
{
  "disabledMcpServers": [
    "railway",
    "cloudflare-docs",
    "cloudflare-workers-builds",
    "magic",
    "filesystem"
  ]
}
```

**Passo 3: Seguir Melhores Práticas**

De acordo com as recomendações no README:

- Configure 20-30 servidores MCP (definidos no arquivo de configuração)
- Habilite < 10 servidores MCP por projeto
- Mantenha ferramentas ativas < 80

**Você Deveria Ver**: Lista de ferramentas retorna ao comprimento normal, velocidade de resposta melhora.

### Alerta de Armadilha

::: tip Experiência Prática
Recomenda-se habilitar diferentes combinações de MCP por tipo de projeto. Por exemplo:
- Projeto Web: GitHub, Firecrawl, Memory, Context7
- Projeto de Dados: Supabase, ClickHouse, Sequential-thinking
:::

---

## Problema Comum 3: Erro de Configuração de Tipo de Servidor

### Sintoma

```
Failed to start MCP server: Command not found
```

Ou

```
Failed to connect: Invalid server type
```

### Causa

Confusão entre os dois tipos de servidores MCP: `npx` e `http`.

### Solução

**Passo 1: Confirmar Tipo de Servidor**

Verifique `mcp-configs/mcp-servers.json`, distinguindo os dois tipos:

**Tipo npx** (requer `command` e `args`):
```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"
    }
  }
}
```

**Tipo http** (requer `url`):
```json
{
  "vercel": {
    "type": "http",
    "url": "https://mcp.vercel.com"
  }
}
```

**Passo 2: Corrigir Configuração**

| Servidor MCP | Tipo Correto | Configuração Correta |
| --- | --- | --- |
| GitHub | npx | `command: "npx"`, `args: ["-y", "@modelcontextprotocol/server-github"]` |
| Vercel | http | `type: "http"`, `url: "https://mcp.vercel.com"` |
| Cloudflare Docs | http | `type: "http"`, `url: "https://docs.mcp.cloudflare.com/mcp"` |
| Memory | npx | `command: "npx"`, `args: ["-y", "@modelcontextprotocol/server-memory"]` |

**Você Deveria Ver**: Após reiniciar, o servidor MCP inicia normalmente.

---

## Problema Comum 4: Erro de Configuração de Caminho do Filesystem MCP

### Sintoma

- Ferramentas Filesystem não conseguem acessar nenhum arquivo
- Exibe "Path not accessible" ou "Permission denied"

### Causa

O parâmetro de caminho do Filesystem MCP não foi substituído pelo caminho real do projeto.

### Solução

**Passo 1: Verificar Configuração**

```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/your/projects"],
    "description": "Filesystem operations (set your path)"
  }
}
```

**Passo 2: Substituir pelo Caminho Real**

Substitua o caminho de acordo com seu sistema operacional:

**macOS/Linux**:
```json
{
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/yourname/projects"]
}
```

**Windows**:
```json
{
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:\\Users\\yourname\\projects"]
}
```

**Passo 3: Verificar Permissões**

Certifique-se de ter permissões de leitura e escrita no caminho configurado.

**Você Deveria Ver**: Ferramentas Filesystem podem acessar e operar normalmente arquivos no caminho especificado.

### Alerta de Armadilha

::: warning Observações
- Não use o símbolo `~`, deve usar o caminho completo
- Barras invertidas em caminhos Windows precisam ser escapadas como `\\`
- Certifique-se de que não há separadores extras no final do caminho
:::

---

## Problema Comum 5: Referência de Projeto Supabase Não Configurada

### Sintoma

Conexão MCP Supabase falha, exibindo "Missing project reference".

### Causa

O parâmetro `--project-ref` do Supabase MCP não foi configurado.

### Solução

**Passo 1: Obter Referência do Projeto**

No Supabase Dashboard:
1. Entre nas configurações do projeto
2. Encontre a seção "Project Reference" ou "API"
3. Copie o ID do projeto (formato similar a `xxxxxxxxxxxxxxxx`)

**Passo 2: Atualizar Configuração**

```json
{
  "supabase": {
    "command": "npx",
    "args": ["-y", "@supabase/mcp-server-supabase@latest", "--project-ref=your-project-ref-here"],
    "description": "Supabase database operations"
  }
}
```

**Você Deveria Ver**: Ferramentas Supabase podem consultar o banco de dados normalmente.

---

## Problema Comum 6: Comando npx Não Encontrado

### Sintoma

```
Failed to start MCP server: npx: command not found
```

### Causa

Node.js não está instalado no sistema ou npx não está no PATH.

### Solução

**Passo 1: Verificar Versão do Node.js**

```bash
node --version
```

**Passo 2: Instalar Node.js (se ausente)**

Visite [nodejs.org](https://nodejs.org/) para baixar e instalar a versão LTS mais recente.

**Passo 3: Verificar npx**

```bash
npx --version
```

**Você Deveria Ver**: Número da versão do npx exibido normalmente.

---

## Fluxograma de Diagnóstico

Ao encontrar problemas MCP, diagnostique na seguinte ordem:

```
1. Verificar se a chave de API está configurada
   ↓ (Configurada)
2. Verificar se a quantidade de MCPs habilitados é < 10
   ↓ (Quantidade normal)
3. Verificar tipo de servidor (npx vs http)
   ↓ (Tipo correto)
4. Verificar parâmetros de caminho (Filesystem, Supabase)
   ↓ (Caminho correto)
5. Verificar se Node.js e npx estão disponíveis
   ↓ (Disponível)
Problema resolvido!
```

---

## Resumo da Lição

Problemas de conexão MCP estão principalmente relacionados à configuração, lembre-se dos seguintes pontos:

- ✅ **Chave de API**: Substitua todos os placeholders `YOUR_*_HERE`
- ✅ **Gerenciamento de Contexto**: Habilite < 10 MCPs, use `disabledMcpServers` para desabilitar desnecessários
- ✅ **Tipo de Servidor**: Distinga tipos npx e http
- ✅ **Configuração de Caminho**: Filesystem e Supabase precisam configurar caminho/referência específicos
- ✅ **Dependências de Ambiente**: Certifique-se de que Node.js e npx estão disponíveis

Se o problema ainda não for resolvido, verifique se há conflitos entre `~/.claude/settings.json` e configuração de nível de projeto.

---



## Prévia da Próxima Lição

> Na próxima lição aprendemos **[Solução de Problemas de Falhas de Agentes](../troubleshooting-agents/)**.
>
> Você vai aprender:
> - Métodos de diagnóstico para Agentes não carregados e erros de configuração
> - Estratégias de resolução para permissões de ferramentas insuficientes
> - Diagnóstico de tempo limite de execução de Agentes e saída não correspondente ao esperado

---

## Apêndice: Referência do Código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Data de atualização: 2026-01-25

| Funcionalidade | Caminho do Arquivo | Linha |
| --- | --- | --- |
| Arquivo de Configuração MCP | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-91 |
| Aviso de Janela de Contexto | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 67-75 |

**Configurações-chave**:
- `mcpServers.mcpServers.*.command`: Comando de inicialização para servidores tipo npx
- `mcpServers.mcpServers.*.args`: Parâmetros de inicialização
- `mcpServers.mcpServers.*.env`: Variáveis de ambiente (chaves de API)
- `mcpServers.mcpServers.*.type`: Tipo de servidor ("npx" ou "http")
- `mcpServers.mcpServers.*.url`: URL para servidores tipo http

**Comentários Importantes**:
- `mcpServers._comments.env_vars`: Substituir placeholders `YOUR_*_HERE`
- `mcpServers._comments.disabling`: Usar `disabledMcpServers` para desabilitar servidores
- `mcpServers._comments.context_warning`: Habilitar < 10 MCPs para preservar janela de contexto

</details>
