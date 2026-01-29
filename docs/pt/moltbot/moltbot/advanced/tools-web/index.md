---
title: "Ferramentas de busca e scraping web: Brave, Perplexity e extração de conteúdo web | Tutorial do Clawdbot"
sidebarTitle: "Fazer o IA buscar na web"
subtitle: "Ferramentas de busca e scraping web"
description: "Aprenda a configurar e usar as ferramentas web_search e web_fetch do Clawdbot para permitir que o assistente de IA acesse informações web em tempo real. Este tutorial cobre a configuração de Brave Search API e Perplexity Sonar, extração de conteúdo web, mecanismo de cache e solução de problemas comuns. Inclui obtenção de API Key, configuração de parâmetros, configuração de região e idioma e configuração de backup do Firecrawl."
tags:
  - "advanced"
  - "tools"
  - "web"
  - "search"
  - "fetch"
prerequisite:
  - "start-getting-started"
order: 230
---

# Ferramentas de busca e scraping web

## O que você poderá fazer depois

- Configurar a ferramenta **web_search** para permitir que o assistente de IA use Brave Search ou Perplexity Sonar para busca web
- Configurar a ferramenta **web_fetch** para permitir que o assistente de IA faça scraping e extração de conteúdo web
- Compreender a diferença entre as duas ferramentas e seus casos de uso
- Configurar API Key e parâmetros avançados (região, idioma, tempo de cache, etc.)
- Resolver problemas comuns (erros de API Key, falhas de scraping, problemas de cache, etc.)

## Seu problema atual

A base de conhecimento do assistente de IA é estática e não pode acessar informações web em tempo real:

- A IA não sabe as notícias de hoje
- A IA não pode buscar os documentos de API mais recentes ou blogs técnicos
- A IA não pode recuperar o conteúdo mais recente de sites web específicos

Você quer que o assistente de IA "fique online", mas não sabe:

- Devo usar Brave ou Perplexity?
- Onde obtenho a API Key? Como configuro?
- Qual é a diferença entre web_search e web_fetch?
- Como lido com páginas web dinâmicas ou sites que exigem login?

## Quando usar esta técnica

- **web_search**: Quando você precisa buscar informações rapidamente, buscar em vários sites web, obter dados em tempo real (como notícias, preços, clima)
- **web_fetch**: Quando você precisa extrair o conteúdo completo de uma página web específica, ler páginas de documentação, analisar artigos de blog

::: tip Guia de seleção de ferramentas
| Cenário | Ferramenta recomendada | Razão |
|--- | --- | ---|
| Buscar múltiplas fontes | web_search | Retorna múltiplos resultados em uma única consulta |
| Extrair conteúdo de uma única página | web_fetch | Obtém texto completo, suporta markdown |
| Páginas dinâmicas/exigem login | [browser](../tools-browser/) | Requer execução de JavaScript |
| Páginas estáticas simples | web_fetch | Leve e rápido |
:::

## 🎒 Preparativos antes de começar

::: warning Pré-requisitos
Este tutorial assume que você completou o [Início rápido](../../start/getting-started/), instalou e iniciou o Gateway.
:::

- O daemon do Gateway está em execução
- Configuração básica de canais concluída (pelo menos um canal de comunicação disponível)
- API Key de pelo menos um provedor de busca preparada (Brave ou Perplexity/OpenRouter)

::: info Nota
web_search e web_fetch são **ferramentas leves** que não executam JavaScript. Para sites web que exigem login ou páginas dinâmicas complexas, use a [ferramenta browser](../tools-browser/).
:::

## Conceitos chave

### Diferença entre as duas ferramentas

**web_search**: Ferramenta de busca web
- Chama mecanismos de busca (Brave ou Perplexity) para retornar resultados de busca
- **Brave**: Retorna resultados estruturados (título, URL, descrição, data de publicação)
- **Perplexity**: Retorna respostas sintetizadas por IA com links de citação

**web_fetch**: Ferramenta de scraping de conteúdo web
- Faz solicitações HTTP GET para uma URL específica
- Usa o algoritmo Readability para extrair o conteúdo principal (removendo navegação, anúncios, etc.)
- Converte HTML em Markdown ou texto simples
- Não executa JavaScript

### Por que precisamos de duas ferramentas?

```
┌─────────────────┐     web_search      ┌──────────────────┐
│  Usuário pergunta à IA│ ──────────────────→  │   API de mecanismo de busca   │
│ "Notícias mais recentes"│                      │   (Brave/Perplexity) │
└─────────────────┘                      └──────────────────┘
        ↓                                        ↓
   IA obtém 5 resultados                    Retorna resultados de busca
        ↓
┌─────────────────┐     web_fetch       ┌──────────────────┐
│  IA seleciona resultado│ ──────────────────→  │   Página web de destino   │
│ "Abrir link 1"  │                      │   (HTTP/HTTPS)   │
└─────────────────┘                      └──────────────────┘
        ↓                                        ↓
   IA obtém conteúdo completo                    Extrai Markdown
```

**Fluxo de trabalho típico**:
1. A IA usa **web_search** para buscar informações relevantes
2. A IA seleciona links apropriados dos resultados de busca
3. A IA usa **web_fetch** para fazer scraping do conteúdo da página específica
4. A IA responde à pergunta do usuário baseada no conteúdo

### Mecanismo de cache

Ambas as ferramentas incluem cache integrado para reduzir solicitações duplicadas:

| Ferramenta | Chave de cache | TTL padrão | Item de configuração |
|--- | --- | --- | ---|
| web_search | `provider:query:count:country:search_lang:ui_lang:freshness` | 15 minutos | `tools.web.search.cacheTtlMinutes` |
| web_fetch | `fetch:url:extractMode:maxChars` | 15 minutos | `tools.web.fetch.cacheTtlMinutes` |

::: info Benefícios do cache
- Reduz o número de chamadas de API externas (economiza custos)
- Acelera o tempo de resposta (mesma consulta retorna cache diretamente)
- Evita limitação de taxa por solicitações frequentes
:::

## Siga-me

### Passo 1: Selecionar provedor de busca

Clawdbot suporta dois provedores de busca:

| Provedor | Vantagens | Desvantagens | API Key |
|--- | --- | --- | ---|
| **Brave** (padrão) | Rápido, resultados estruturados, camada gratuita | Resultados de busca tradicionais | `BRAVE_API_KEY` |
| **Perplexity** | Respostas sintetizadas por IA, citações, tempo real | Requer acesso Perplexity ou OpenRouter | `OPENROUTER_API_KEY` ou `PERPLEXITY_API_KEY` |

::: tip Seleção recomendada
- **Iniciantes**: Recomenda-se usar Brave (a camada gratuita é suficiente para uso diário)
- **Precisa de resumo de IA**: Escolha Perplexity (retorna respostas sintetizadas em vez de resultados originais)
:::

### Passo 2: Obter API Key do Brave Search

**Por que usar Brave**: Camada gratuita generosa, rápido, resultados estruturados fáceis de analisar

#### 2.1 Registrar-se na Brave Search API

1. Visite https://brave.com/search/api/
2. Crie uma conta e faça login
3. No Dashboard, selecione o plano **"Data for Search"** (não "Data for AI")
4. Gere API Key

#### 2.2 Configurar API Key

**Método A: Usar CLI (recomendado)**

```bash
# Executar assistente de configuração interativo
clawdbot configure --section web
```

CLI solicitará que você insira a API Key e a salvará em `~/.clawdbot/clawdbot.json`.

**Método B: Usar variáveis de ambiente**

Adicione API Key às variáveis de ambiente do processo Gateway:

```bash
# Adicionar em ~/.clawdbot/.env
echo "BRAVE_API_KEY=suaAPIKey" >> ~/.clawdbot/.env

# Reiniciar Gateway para que as variáveis de ambiente tenham efeito
clawdbot gateway restart
```

**Método C: Editar arquivo de configuração diretamente**

Edite `~/.clawdbot/clawdbot.json`:

```json5
{
  "tools": {
    "web": {
      "search": {
        "apiKey": "BRAVE_API_KEY_HERE",
        "provider": "brave"
      }
    }
  }
}
```

**O que você deveria ver**:

- Após salvar a configuração, reinicie o Gateway
- No canal configurado (como WhatsApp), envie mensagem: "Ajude-me a buscar as notícias mais recentes de IA"
- A IA deveria retornar resultados de busca (título, URL, descrição)

### Passo 3: Configurar parâmetros avançados do web_search

Você pode configurar mais parâmetros em `~/.clawdbot/clawdbot.json`:

```json5
{
  "tools": {
    "web": {
      "search": {
        "enabled": true,           // Se ativado (padrão true)
        "provider": "brave",       // Provedor de busca
        "apiKey": "BRAVE_API_KEY_HERE",
        "maxResults": 5,          // Número de resultados a retornar (1-10, padrão 5)
        "timeoutSeconds": 30,       // Tempo limite (padrão 30)
        "cacheTtlMinutes": 15      // Tempo de cache (padrão 15 minutos)
      }
    }
  }
}
```

#### 3.1 Configurar região e idioma

Torne os resultados de busca mais precisos:

```json5
{
  "tools": {
    "web": {
      "search": {
        "provider": "brave",
        "apiKey": "BRAVE_API_KEY_HERE",
        "maxResults": 10,
        // Opcional: A IA pode substituir esses valores ao chamar
        "defaultCountry": "US",   // País padrão (código de 2 caracteres)
        "defaultSearchLang": "en",  // Idioma dos resultados de busca
        "defaultUiLang": "en"      // Idioma dos elementos de UI
      }
    }
  }
}
```

**Códigos de país comuns**: `US` (EUA), `DE` (Alemanha), `FR` (França), `CN` (China), `JP` (Japão), `ALL` (Global)

**Códigos de idioma comuns**: `en` (inglês), `zh` (chinês), `fr` (francês), `de` (alemão), `es` (espanhol)

#### 3.2 Configurar filtro de tempo (exclusivo do Brave)

```json5
{
  "tools": {
    "web": {
      "search": {
        "provider": "brave",
        "apiKey": "BRAVE_API_KEY_HERE",
        // Opcional: A IA pode substituir ao chamar
        "defaultFreshness": "pw"  // Filtrar resultados da última semana
      }
    }
  }
}
```

**Valores de Freshness**:
- `pd`: Últimas 24 horas
- `pw`: Última semana
- `pm`: Último mês
- `py`: Último ano
- `YYYY-MM-DDtoYYYY-MM-DD`: Intervalo de datas personalizado (ex: `2024-01-01to2024-12-31`)

### Passo 4: Configurar Perplexity Sonar (opcional)

Se você prefere respostas sintetizadas por IA, pode usar Perplexity.

#### 4.1 Obter API Key

**Método A: Conexão direta com Perplexity**

1. Visite https://www.perplexity.ai/
2. Crie uma conta e assine
3. Gere API Key em Settings (começa com `pplx-`)

**Método B: Através do OpenRouter (não requer cartão de crédito)**

1. Visite https://openrouter.ai/
2. Crie uma conta e recarregue (suporta criptomoeda ou pré-pago)
3. Gere API Key (começa com `sk-or-v1-`)

#### 4.2 Configurar Perplexity

Edite `~/.clawdbot/clawdbot.json`:

```json5
{
  "tools": {
    "web": {
      "search": {
        "enabled": true,
        "provider": "perplexity",
        "perplexity": {
          // API Key (opcional, também pode ser configurado via variáveis de ambiente)
          "apiKey": "sk-or-v1-...",  // ou "pplx-..."
          // Base URL (opcional, Clawdbot inferirá automaticamente conforme API Key)
          "baseUrl": "https://openrouter.ai/api/v1",  // ou "https://api.perplexity.ai"
          // Modelo (padrão perplexity/sonar-pro)
          "model": "perplexity/sonar-pro"
        }
      }
    }
  }
}
```

::: info Inferência automática de Base URL
Se você omitir `baseUrl`, Clawdbot escolherá automaticamente conforme o prefixo da API Key:
- `pplx-...` → `https://api.perplexity.ai`
- `sk-or-...` → `https://openrouter.ai/api/v1`
:::

#### 4.3 Selecionar modelo Perplexity

| Modelo | Descrição | Caso de uso |
|--- | --- | ---|
| `perplexity/sonar` | Respostas rápidas + busca web | Consultas simples, busca rápida |
| `perplexity/sonar-pro` (padrão) | Raciocínio de múltiplos passos + busca web | Problemas complexos, requer raciocínio |
| `perplexity/sonar-reasoning-pro` | Análise de cadeia de pensamento | Pesquisa profunda, requer processo de raciocínio |

### Passo 5: Configurar ferramenta web_fetch

web_fetch é ativado por padrão e pode ser usado sem configuração adicional. Mas você pode ajustar parâmetros:

```json5
{
  "tools": {
    "web": {
      "fetch": {
        "enabled": true,           // Se ativado (padrão true)
        "maxChars": 50000,        // Número máximo de caracteres (padrão 50000)
        "timeoutSeconds": 30,       // Tempo limite (padrão 30)
        "cacheTtlMinutes": 15,     // Tempo de cache (padrão 15 minutos)
        "maxRedirects": 3,         // Número máximo de redirecionamentos (padrão 3)
        "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "readability": true         // Se ativar Readability (padrão true)
      }
    }
  }
}
```

#### 5.1 Configurar backup do Firecrawl (opcional)

Se a extração do Readability falhar, você pode usar Firecrawl como backup (requer API Key):

```json5
{
  "tools": {
    "web": {
      "fetch": {
        "readability": true,
        "firecrawl": {
          "enabled": true,
          "apiKey": "FIRECRAWL_API_KEY_HERE",  // ou definir variável de ambiente FIRECRAWL_API_KEY
          "baseUrl": "https://api.firecrawl.dev",
          "onlyMainContent": true,  // Extrair apenas conteúdo principal
          "maxAgeMs": 86400000,    // Tempo de cache (milissegundos, padrão 1 dia)
          "timeoutSeconds": 60
        }
      }
    }
  }
}
```

::: tip Vantagens do Firecrawl
- Suporta renderização de JavaScript (requer ativação)
- Capacidade anti-scraping mais forte
- Suporta sites web complexos (SPA, aplicativos de página única)
:::

**Obter API Key do Firecrawl**:
1. Visite https://www.firecrawl.dev/
2. Crie uma conta e gere API Key
3. Configure na configuração ou use variável de ambiente `FIRECRAWL_API_KEY`

### Passo 6: Verificar configuração

**Verificar web_search**:

Envie mensagem no canal configurado (como WebChat):

```
Ajude-me a buscar os novos recursos do TypeScript 5.0
```

**O que você deveria ver**:
- A IA retorna 5 resultados de busca (título, URL, descrição)
- Se você usar Perplexity, retorna respostas resumidas pela IA + links de citação

**Verificar web_fetch**:

Envie mensagem:

```
Ajude-me a obter o conteúdo de https://www.typescriptlang.org/docs/handbook/intro.html
```

**O que você deveria ver**:
- A IA retorna o conteúdo no formato Markdown dessa página
- O conteúdo já tem navegação, anúncios e outros elementos irrelevantes removidos

### Passo 7: Testar funcionalidades avançadas

**Testar filtro de região**:

```
Busque cursos de treinamento de TypeScript na Alemanha
```

A IA pode usar o parâmetro `country: "DE"` para busca específica de região.

**Testar filtro de tempo**:

```
Busque notícias do campo de IA da última semana
```

A IA pode usar o parâmetro `freshness: "pw"` para filtrar resultados da última semana.

**Testar modo de extração**:

```
Recupere https://example.com e retorne no formato de texto simples
```

A IA pode usar o parâmetro `extractMode: "text"` para obter texto simples em vez de Markdown.

## Ponto de verificação ✅

Certifique-se de que a seguinte configuração esteja correta:

- [ ] Gateway está em execução
- [ ] Pelo menos um provedor de busca configurado (Brave ou Perplexity)
- [ ] API Key salva corretamente (via CLI ou variáveis de ambiente)
- [ ] Teste web_search bem-sucedido (retorna resultados de busca)
- [ ] Teste web_fetch bem-sucedido (retorna conteúdo da página)
- [ ] Configuração de cache razoável (evitar solicitações excessivas)

::: tip Comandos de verificação rápida
```bash
# Ver configuração do Gateway
clawdbot configure --show

# Ver logs do Gateway
clawdbot gateway logs --tail 50
```
:::

## Evitar armadilhas

### Erro comum 1: API Key não configurada

**Mensagem de erro**:

```json
{
  "error": "missing_brave_api_key",
  "message": "web_search needs a Brave Search API key. Run `clawdbot configure --section web` to store it, or set BRAVE_API_KEY in Gateway environment."
}
```

**Solução**:

1. Execute `clawdbot configure --section web`
2. Insira API Key
3. Reinicie o Gateway: `clawdbot gateway restart`

### Erro comum 2: Falha de scraping (páginas web dinâmicas)

**Problema**: web_fetch não pode extrair conteúdo que requer JavaScript.

**Solução**:

1. Confirme se o site web é uma SPA (aplicativo de página única)
2. Se sim, use a [ferramenta browser](../tools-browser/)
3. Ou configure backup do Firecrawl (requer API Key)

### Erro comum 3: Conteúdo desatualizado por cache

**Problema**: Resultados de busca ou conteúdo extraído são antigos.

**Solução**:

1. Ajuste a configuração `cacheTtlMinutes`
2. Ou solicite explicitamente "não usar cache" no diálogo com IA
3. Reinicie o Gateway para limpar cache em memória

### Erro comum 4: Tempo limite de solicitação excedido

**Problema**: Tempo limite ao fazer scraping de páginas grandes ou sites web lentos.

**Solução**:

```json5
{
  "tools": {
    "web": {
      "search": {
        "timeoutSeconds": 60
      },
      "fetch": {
        "timeoutSeconds": 60
      }
    }
  }
}
```

### Erro comum 5: IP de rede interna bloqueado por SSRF

**Problema**: O scraping para endereços de rede interna (como `http://localhost:8080`) está bloqueado.

**Solução**:

web_fetch bloqueia por padrão IPs de rede interna para evitar ataques SSRF. Se você realmente precisa acessar rede interna:

1. Use a [ferramenta browser](../tools-browser/) (mais flexível)
2. Ou edite a configuração para permitir hosts específicos (requer modificação do código fonte)

## Resumo desta lição

- **web_search**: Ferramenta de busca web, suporta Brave (resultados estruturados) e Perplexity (respostas sintetizadas por IA)
- **web_fetch**: Ferramenta de scraping de conteúdo web, usa Readability para extrair conteúdo principal (HTML → Markdown/text)
- Ambos incluem cache integrado (padrão 15 minutos), reduzem solicitações duplicadas
- API Key do Brave pode ser configurada via CLI, variáveis de ambiente ou arquivo de configuração
- Perplexity suporta dois métodos: conexão direta e OpenRouter
- Para sites web que exigem JavaScript, use a [ferramenta browser](../tools-browser/)
- Parâmetros de configuração incluem: número de resultados, tempo limite, região, idioma, filtro de tempo, etc.

## Prévia da próxima lição

> Na próxima lição, aprenderemos **[Canvas interface visual e A2UI](../canvas/)**.
>
> Você aprenderá:
> - Mecanismo de push Canvas A2UI
> - Operação de interface visual
> - Como fazer o assistente de IA controlar elementos do Canvas

---

## Apêndice: Referência de código fonte

<details>
<summary><strong>Clique para expandir e ver localização do código fonte</strong></summary>

> Data de atualização: 2026-01-27

| Função | Caminho do arquivo | Número da linha |
|--- | --- | ---|
| Definição da ferramenta web_search | [`src/agents/tools/web-search.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-search.ts) | 409-483 |
| Definição da ferramenta web_fetch | [`src/agents/tools/web-fetch.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-fetch.ts) | 572-624 |
| Chamada de API Brave Search | [`src/agents/tools/web-search.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-search.ts) | 309-407 |
| Chamada de API Perplexity | [`src/agents/tools/web-search.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-search.ts) | 268-307 |
| Extração de conteúdo Readability | [`src/agents/tools/web-fetch-utils.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-fetch-utils.ts) | - |
| Integração Firecrawl | [`src/agents/tools/web-fetch.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-fetch.ts) | 257-330 |
| Implementação de cache | [`src/agents/tools/web-shared.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-shared.ts) | - |
| Proteção SSRF | [`src/infra/net/ssrf.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/net/ssrf.ts) | - |
| Esquema de configuração | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | - |

**Constantes chave**:

- `DEFAULT_SEARCH_COUNT = 5`: Número padrão de resultados de busca
- `MAX_SEARCH_COUNT = 10`: Número máximo de resultados de busca
- `DEFAULT_CACHE_TTL_MINUTES = 15`: Tempo de cache padrão (minutos)
- `DEFAULT_TIMEOUT_SECONDS = 30`: Tempo limite padrão (segundos)
- `DEFAULT_FETCH_MAX_CHARS = 50_000`: Número máximo de caracteres de scraping padrão

**Funções chave**:

- `createWebSearchTool()`: Cria instância da ferramenta web_search
- `createWebFetchTool()`: Cria instância da ferramenta web_fetch
- `runWebSearch()`: Executa busca e retorna resultados
- `runWebFetch()`: Executa scraping e extrai conteúdo
- `normalizeFreshness()`: Normaliza parâmetros de filtro de tempo
- `extractReadableContent()`: Extrai conteúdo usando Readability

</details>
