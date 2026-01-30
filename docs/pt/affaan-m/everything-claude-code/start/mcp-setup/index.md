---
title: "Configuração MCP: Extensão de Serviços Externos | Everything Claude Code"
sidebarTitle: "Conectar Serviços Externos"
subtitle: "Configuração de Servidores MCP: Estendendo as Capacidades de Integração de Serviços Externos do Claude Code"
description: "Aprenda a configurar MCP. Escolha entre 15 servidores pré-configurados para seu projeto, configure chaves de API e variáveis de ambiente, otimize o uso da janela de contexto."
tags:
  - "mcp"
  - "configuração"
  - "integração"
prerequisite:
  - "start-installation"
order: 40
---

# Configuração de Servidores MCP: Estendendo as Capacidades de Integração de Serviços Externos do Claude Code

## O Que Você Vai Aprender

- Entender o que é MCP e como ele estende as capacidades do Claude Code
- Escolher serviços adequados entre 15 servidores MCP pré-configurados
- Configurar corretamente chaves de API e variáveis de ambiente
- Otimizar o uso do MCP para evitar ocupação da janela de contexto

## Sua Situação Atual

O Claude Code tem apenas capacidades padrão de operação de arquivos e execução de comandos, mas você pode precisar de:

- Consultar PRs e Issues do GitHub
- Capturar conteúdo de páginas web
- Operar bancos de dados Supabase
- Consultar documentação em tempo real
- Persistência de memória entre sessões

Se processar essas tarefas manualmente, precisará alternar frequentemente entre ferramentas, copiar e colar, com baixa eficiência. Os servidores MCP (Model Context Protocol) podem ajudá-lo a completar automaticamente essas integrações de serviços externos.

## Quando Usar Esta Técnica

**Situações adequadas para usar servidores MCP**:
- Projetos envolvendo serviços de terceiros como GitHub, Vercel, Supabase
- Necessidade de consultar documentação em tempo real (como Cloudflare, ClickHouse)
- Necessidade de manter estado ou memória entre sessões
- Necessidade de captura de páginas web ou geração de componentes UI

**Situações que não precisam de MCP**:
- Apenas operações de arquivos locais
- Desenvolvimento frontend puro, sem integração de serviços externos
- Aplicações CRUD simples, com poucas operações de banco de dados

## 🎒 Preparação Antes de Começar

Antes de começar a configuração, por favor confirme:

::: warning Verificação Prévia

- ✅ Concluiu a [Instalação do Plugin](../installation/)
- ✅ Familiarizado com sintaxe básica de configuração JSON
- ✅ Possui chaves de API dos serviços a integrar (GitHub PAT, Firecrawl API Key, etc.)
- ✅ Conhece a localização do arquivo de configuração `~/.claude.json`

:::

## Ideia Central

### O Que é MCP

**MCP (Model Context Protocol)** é o protocolo que o Claude Code usa para conectar serviços externos. Permite que a IA acesse recursos externos como GitHub, bancos de dados, consulta de documentação, como uma extensão de capacidades.

**Princípio de Funcionamento**:

```
Claude Code ←→ Servidor MCP ←→ Serviço Externo
   (local)        (middleware)         (GitHub/Supabase/...)
```

### Estrutura de Configuração MCP

Cada configuração de servidor MCP inclui:

```json
{
  "mcpServers": {
    "nome-do-servidor": {
      "command": "npx",          // Comando de inicialização
      "args": ["-y", "pacote"],  // Parâmetros do comando
      "env": {                   // Variáveis de ambiente
        "API_KEY": "SUA_CHAVE"
      },
      "description": "Descrição da função"   // Descrição
    }
  }
}
```

**Tipos**:
- **Tipo npx**: Usa pacote npm para execução (como GitHub, Firecrawl)
- **Tipo http**: Conecta a endpoint HTTP (como Vercel, Cloudflare)

### Gerenciamento da Janela de Contexto (Importante!)

::: warning Alerta de Contexto

Cada servidor MCP habilitado ocupa espaço na janela de contexto. Habilitar muitos pode reduzir o contexto de 200K para 70K.

**Regra de Ouro**:
- Configure 20-30 servidores MCP (todos disponíveis)
- Habilite < 10 por projeto
- Total de ferramentas ativas < 80

Use `disabledMcpServers` na configuração do projeto para desabilitar MCPs desnecessários.

:::

## Siga Comigo

### Passo 1: Verificar Servidores MCP Disponíveis

O Everything Claude Code fornece **15 servidores MCP pré-configurados**:

| Servidor MCP | Tipo | Precisa de Chave | Uso |
| --- | --- | --- | --- |
| **github** | npx | ✅ GitHub PAT | Operações de PRs, Issues, Repos |
| **firecrawl** | npx | ✅ API Key | Captura e crawling de páginas web |
| **supabase** | npx | ✅ Project Ref | Operações de banco de dados |
| **memory** | npx | ❌ | Persistência de memória entre sessões |
| **sequential-thinking** | npx | ❌ | Aprimoramento de raciocínio encadeado |
| **vercel** | http | ❌ | Deploy e gerenciamento de projetos |
| **railway** | npx | ❌ | Deploy Railway |
| **cloudflare-docs** | http | ❌ | Busca de documentação |
| **cloudflare-workers-builds** | http | ❌ | Builds de Workers |
| **cloudflare-workers-bindings** | http | ❌ | Bindings de Workers |
| **cloudflare-observability** | http | ❌ | Logs e monitoramento |
| **clickhouse** | http | ❌ | Consultas analíticas |
| **context7** | npx | ❌ | Busca de documentação em tempo real |
| **magic** | npx | ❌ | Geração de componentes UI |
| **filesystem** | npx | ❌ (precisa de caminho) | Operações de sistema de arquivos |

**Você Deveria Ver**: Lista completa de 15 servidores MCP, cobrindo cenários comuns como GitHub, deploy, banco de dados, consulta de documentação.

---

### Passo 2: Copiar Configuração MCP para o Claude Code

Copie a configuração do diretório de código-fonte:

```bash
# Copiar template de configuração MCP
cp source/affaan-m/everything-claude-code/mcp-configs/mcp-servers.json ~/.claude/mcp-servers-backup.json
```

**Por quê**: Fazer backup da configuração original para referência e comparação posterior.

---

### Passo 3: Escolher os Servidores MCP Necessários

De acordo com as necessidades do seu projeto, escolha os servidores MCP necessários.

**Cenários de Exemplo**:

| Tipo de Projeto | MCPs Recomendados |
| --- | --- |
| **Aplicação Full Stack** (GitHub + Supabase + Vercel) | github, supabase, vercel, memory, context7 |
| **Projeto Frontend** (Vercel + consulta de docs) | vercel, cloudflare-docs, context7, magic |
| **Projeto de Dados** (ClickHouse + análise) | clickhouse, sequential-thinking, memory |
| **Desenvolvimento Geral** | github, filesystem, memory, context7 |

**Você Deveria Ver**: Relação clara entre tipos de projeto e servidores MCP correspondentes.

---

### Passo 4: Editar o Arquivo de Configuração `~/.claude.json`

Abra seu arquivo de configuração do Claude Code:

::: code-group

```bash [macOS/Linux]
vim ~/.claude.json
```

```powershell [Windows]
notepad $env:USERPROFILE\.claude.json
```

:::

Adicione a seção `mcpServers` em `~/.claude.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "SEU_GITHUB_PAT_AQUI"
      },
      "description": "Operações GitHub - PRs, issues, repos"
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "description": "Memória persistente entre sessões"
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"],
      "description": "Busca de documentação em tempo real"
    }
  }
}
```

**Por quê**: Esta é a configuração principal, informa ao Claude Code quais servidores MCP iniciar.

**Você Deveria Ver**: O objeto `mcpServers` contendo a configuração dos servidores MCP selecionados.

---

### Passo 5: Substituir Placeholders de Chaves de API

Para servidores MCP que precisam de chaves de API, substitua os placeholders `SEU_*_AQUI`:

**Exemplo de MCP GitHub**:

1. Gere o GitHub Personal Access Token:
   - Acesse https://github.com/settings/tokens
   - Crie um novo Token, marque a permissão `repo`

2. Substitua o placeholder na configuração:

```json
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"  // Substitua pelo Token real
  }
}
```

**Outros MCPs que precisam de chaves**:

| MCP | Nome da Chave | Onde Obter |
| --- | --- | --- |
| **firecrawl** | FIRECRAWL_API_KEY | https://www.firecrawl.dev/ |
| **supabase** | --project-ref | https://supabase.com/dashboard |

**Por quê**: Sem chaves reais, o servidor MCP não consegue conectar aos serviços externos.

**Você Deveria Ver**: Todos os placeholders `SEU_*_AQUI` substituídos por chaves reais.

---

### Passo 6: Configurar Desabilitação de MCP em Nível de Projeto (Recomendado)

Para evitar que todos os projetos habilitem todos os MCPs, crie `.claude/config.json` no diretório raiz do projeto:

```json
{
  "disabledMcpServers": [
    "supabase",      // Desabilitar MCPs desnecessários
    "railway",
    "firecrawl"
  ]
}
```

**Por quê**: Assim você pode controlar flexivelmente quais MCPs estão ativos em nível de projeto, evitando ocupação da janela de contexto.

**Você Deveria Ver**: O arquivo `.claude/config.json` contendo o array `disabledMcpServers`.

---

### Passo 7: Reiniciar o Claude Code

Reinicie o Claude Code para que a configuração entre em vigor:

```bash
# Parar o Claude Code (se estiver em execução)
# Depois reiniciar
claude
```

**Por quê**: A configuração MCP é carregada na inicialização, precisa reiniciar para entrar em vigor.

**Você Deveria Ver**: Após o Claude Code iniciar, os servidores MCP são carregados automaticamente.

## Checkpoint ✅

Verifique se a configuração MCP foi bem-sucedida:

1. **Verificar Status de Carregamento do MCP**:

No Claude Code, digite:

```bash
/tool list
```

**Resultado Esperado**: Ver a lista de servidores MCP e ferramentas carregadas.

2. **Testar Funcionalidade do MCP**:

Se você habilitou o MCP GitHub, teste a consulta:

```bash
# Consultar Issues do GitHub
@mcp list issues
```

**Resultado Esperado**: Retorna a lista de Issues do seu repositório.

3. **Verificar Janela de Contexto**:

Veja a quantidade de ferramentas em `~/.claude.json`:

```bash
jq '.mcpServers | length' ~/.claude.json
```

**Resultado Esperado**: Número de servidores MCP habilitados < 10.

::: tip Dica de Debug

Se o MCP não carregar com sucesso, verifique os arquivos de log do Claude Code:
- macOS/Linux: `~/.claude/logs/`
- Windows: `%USERPROFILE%\.claude\logs\`

:::

## Armadilhas Comuns

### Armadilha 1: Habilitar Muitos MCPs Causa Contexto Insuficiente

**Sintoma**: No início da conversa, a janela de contexto tem apenas 70K em vez de 200K.

**Causa**: Cada ferramenta habilitada pelo MCP ocupa espaço na janela de contexto.

**Solução**:
1. Verifique a quantidade de MCPs habilitados (`~/.claude.json`)
2. Use `disabledMcpServers` em nível de projeto para desabilitar MCPs desnecessários
3. Mantenha o total de ferramentas ativas < 80

---

### Armadilha 2: Chaves de API Não Configuradas Corretamente

**Sintoma**: Ao chamar funções do MCP, aparecem erros de permissão ou falha de conexão.

**Causa**: Os placeholders `SEU_*_AQUI` não foram substituídos.

**Solução**:
1. Verifique o campo `env` em `~/.claude.json`
2. Confirme que todos os placeholders foram substituídos por chaves reais
3. Verifique se a chave tem permissões suficientes (como GitHub Token precisa da permissão `repo`)

---

### Armadilha 3: Caminho Errado no MCP Filesystem

**Sintoma**: O MCP Filesystem não consegue acessar o diretório especificado.

**Causa**: O caminho em `args` não foi substituído pelo caminho real.

**Solução**:
```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/seunome/projetos"],  // Substitua pelo caminho do seu projeto
    "description": "Operações de sistema de arquivos"
  }
}
```

---

### Armadilha 4: Configuração em Nível de Projeto Não Entra em Vigor

**Sintoma**: O `disabledMcpServers` no diretório raiz do projeto não desabilita o MCP.

**Causa**: Caminho ou formato de `.claude/config.json` incorreto.

**Solução**:
1. Confirme que o arquivo está no diretório raiz do projeto: `.claude/config.json`
2. Verifique se o formato JSON está correto (use `jq .` para validar)
3. Confirme que `disabledMcpServers` é um array de strings

## Resumo da Aula

Esta aula aprendeu os métodos de configuração de servidores MCP:

**Pontos-chave**:
- MCP estende as capacidades de integração de serviços externos do Claude Code
- Escolha entre 15 MCPs pré-configurados (recomendado < 10)
- Substitua os placeholders `SEU_*_AQUI` por chaves de API reais
- Use `disabledMcpServers` em nível de projeto para controlar a quantidade habilitada
- Mantenha o total de ferramentas ativas < 80, evitando ocupação da janela de contexto

**Próximo Passo**: Você já configurou os servidores MCP, na próxima aula aprenda a usar os Commands principais.

## Prévia da Próxima Aula

> Na próxima aula aprendemos **[Visão Geral dos Commands Principais](../../platforms/commands-overview/)**.
>
> Você vai aprender:
> - Funcionalidades e cenários de uso dos 14 comandos de barra
> - Como o comando `/plan` cria planos de implementação
> - Como o comando `/tdd` executa desenvolvimento orientado a testes
> - Como acionar rapidamente fluxos de trabalho complexos através de comandos

---

## Apêndice: Referência do Código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Data de atualização: 2026-01-25

| Funcionalidade | Caminho do Arquivo | Linha |
| --- | --- | --- |
| Template de Configuração MCP | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-92 |
| Dicas Importantes do README | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 348-369 |

**Configurações-chave**:
- 15 servidores MCP (GitHub, Firecrawl, Supabase, Memory, Sequential-thinking, Vercel, Railway, série Cloudflare, ClickHouse, Context7, Magic, Filesystem)
- Suporta dois tipos: npx (linha de comando) e http (conexão de endpoint)
- Use `disabledMcpServers` em configuração de nível de projeto para controlar a quantidade habilitada

**Regras-chave**:
- Configure 20-30 servidores MCP
- Habilite < 10 por projeto
- Total de ferramentas ativas < 80
- Risco de redução do contexto de 200K para 70K

</details>
