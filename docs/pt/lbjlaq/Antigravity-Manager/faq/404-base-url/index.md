---
title: "404 Rota Incompatível: Configuração de Base URL | Antigravity-Manager"
sidebarTitle: "Corrigir 404 Rota"
subtitle: "404/Rota Incompatível: Base URL, Prefixo /v1 e Clientes com Caminho Sobreposto"
description: "Aprenda resolver problema de incompatibilidade de rota 404 ao integrar Antigravity Tools. Domine configuração correta de Base URL, evite duplicação de prefixo /v1, lide com clientes com caminho sobreposto, abrange cenários comuns."
tags:
  - "faq"
  - "base-url"
  - "404"
  - "openai"
  - "anthropic"
  - "gemini"
prerequisite:
  - "start-proxy-and-first-client"
  - "faq-auth-401"
order: 4
---

# 404/Rota Incompatível: Base URL, Prefixo /v1 e Clientes com Caminho Sobreposto

## O que você poderá fazer após completar

- Ao ver 404, primeiro julgar se é "problema de conexão de Base URL" ou "autenticação/serviço não iniciado"
- Selecionar Base URL correto por tipo de cliente (precisa ou não de `/v1`)
- Identificar duas categorias de armadilhas de alta frequência: duplicação de prefixo (`/v1/v1/...`) e caminho sobreposto (`/v1/chat/completions/responses`)

## Seu dilema atual

Ao integrar cliente externo, encontra erro `404 Not Found`, investigando muito tempo descobre que é problema de configuração de Base URL:

- Kilo Code falha ao chamar, log mostra `/v1/chat/completions/responses` não encontrado
- Claude Code consegue conectar, mas sempre avisa rota incompatível
- Python OpenAI SDK reporta `404`, mas serviço já iniciado

A raiz destes problemas não é cota de conta ou autenticação, mas cliente "colocou seu próprio caminho" no seu Base URL escrito, então rota ficou torta.

## Quando usar esta técnica

- Você confirmou que proxy reverso iniciou, mas qualquer chamada de interface retorna 404
- Você escreveu Base URL em forma com caminho (ex: `/v1/...`), mas não sabe se cliente vai concatenar novamente
- Cliente que você usa "tem seu próprio conjunto de lógica de concatenação de caminho", rota de solicitação resultante não parece OpenAI/Anthropic/Gemini padrão

## 🎒 Preparação antes de começar

Primeiro elimine "serviço não iniciado/autenticação falhou", caso contrário você vai se afastar cada vez mais na direção errada.

### Passo 1: Confirme proxy reverso rodando

::: code-group

```bash [macOS/Linux]
curl -i http://127.0.0.1:8045/healthz
```

```powershell [Windows]
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8045/healthz | Select-Object -ExpandProperty Content
```

:::

**Você deve ver**: HTTP 200, retorna JSON (pelo menos contendo `{"status":"ok"}`).

### Passo 2: Confirme que você encontra 404 (não 401)

Se você em modo `auth_mode=strict/all_except_health/auto(allow_lan_access=true)` sem trazer key, você mais provavelmente encontrará 401. Primeiro dê uma olhada em código de estado, se necessário primeiro complete **[Solução de Falha de Autenticação 401](../auth-401/)**.

## O que é Base URL?

**Base URL** é "endereço raiz" quando cliente envia solicitação. Cliente geralmente concatenará seu caminho API depois de Base URL e depois solicitará, então Base URL precisa ou não de `/v1`, depende de que caminho cliente vai adicionar. Você só precisa alinhar "caminho final" que cliente concatenar para as rotas do Antigravity Tools, não ficará mais travado por 404.

## Ideia principal

As rotas de proxy reverso do Antigravity Tools são "caminho completo codificado" (veja `src-tauri/src/proxy/server.rs`), entradas comuns são:

| Protocolo | Rota | Finalidade |
| --- | --- | --- |
| OpenAI | `/v1/models` | Listar modelos |
| OpenAI | `/v1/chat/completions` | Chat completions |
| OpenAI | `/v1/responses` | Compatibilidade Codex CLI |
| Anthropic | `/v1/messages` | API de mensagens Claude |
| Gemini | `/v1beta/models` | Listar modelos |
| Gemini | `/v1beta/models/:model` | Gerar conteúdo |
| Verificação de saúde | `/healthz` | Endpoint de verificação |

O que você precisa fazer: fazer "caminho final" que cliente concatenar, cair exatamente nestas rotas.

---

## Siga-me

### Passo 1: Com curl primeiro acerte "caminho correto"

**Por que**
Primeiro confirme "protocolo que você quer andar" na local realmente tem rota correspondente, evitando tratar 404 como "problema de modelo/conta".

::: code-group

```bash [macOS/Linux]
# Protocolo OpenAI: listar modelos
curl -i http://127.0.0.1:8045/v1/models

# Protocolo Anthropic: interface de mensagens (aqui só olha 404/401, não exige necessariamente sucesso)
curl -i http://127.0.0.1:8045/v1/messages

# Protocolo Gemini: listar modelos
curl -i http://127.0.0.1:8045/v1beta/models
```

```powershell [Windows]
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8045/v1/models | Select-Object -ExpandProperty StatusCode
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8045/v1/messages | Select-Object -ExpandProperty StatusCode
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8045/v1beta/models | Select-Object -ExpandProperty StatusCode
```

:::

**Você deve ver**: Estes caminhos pelo menos não devem ser 404. Se aparecer 401, primeiro configure key conforme **[Solução de Falha de Autenticação 401](../auth-401/)**.

### Passo 2: Escolha Base URL por "cliente vai ou não concatenar /v1"

**Por que**
A armadilha de Base URL, essencialmente é "caminho que você escreveu" e "caminho que cliente adiciona" ficaram juntos.

| Coisa que você está usando | Escrita recomendada de Base URL | Rota que você está alinhando |
| --- | --- | --- |
| OpenAI SDK (Python/Node, etc) | `http://127.0.0.1:8045/v1` | `/v1/chat/completions`, `/v1/models` |
| Claude Code CLI (Anthropic) | `http://127.0.0.1:8045` | `/v1/messages` |
| Gemini SDK / Cliente estilo Gemini | `http://127.0.0.1:8045` | `/v1beta/models/*` |

::: tip Dica
OpenAI SDK geralmente exige que você coloque `/v1` no Base URL; Anthropic/Gemini mais comum é só escrever até host:port.
:::

### Passo 3: Lide com cliente "caminho sobreposto" como Kilo Code

**Por que**
Antigravity Tools não tem rota `/v1/chat/completions/responses`. Se cliente concatenar este caminho, com certeza será 404.

Conforme recomendação README:

1. Seleção de protocolo: priorize usar **Protocolo Gemini**
2. Base URL: preencha `http://127.0.0.1:8045`

**Você deve ver**: Solicitação vai por conjunto de rotas `/v1beta/models/...`, não mais aparece `/v1/chat/completions/responses`.

### Passo 4: Não escreva Base URL até "caminho de recurso específico"

**Por que**
Muitos SDKs concatenarão seu próprio caminho de recurso depois de Base URL. Se você escreveu Base URL muito fundo, finalmente vai se tornar "caminho em duas camadas".

✅ Recomendado (OpenAI SDK):

```text
http://127.0.0.1:8045/v1
```

❌ Erros comuns:

```text
http://127.0.0.1:8045
http://127.0.0.1:8045/v1/chat/completions
```

**Você deve ver**: Após corrigir Base URL mais raso, caminho de solicitação volta para `/v1/...` ou `/v1beta/...`, 404 desaparece.

---

## Ponto de verificação ✅

Você pode usar esta tabela para verificar rapidamente se seu "caminho de solicitação final" pode atingir rotas do Antigravity Tools:

| Caminho que você vê nos logs | Conclusão |
| --- | --- |
| Começando com `/v1/` (ex: `/v1/models`, `/v1/chat/completions`) | Rotas compatíveis OpenAI/Anthropic |
| Começando com `/v1beta/` (ex: `/v1beta/models/...`) | Rotas geradoras Gemini |
| Aparecendo `/v1/v1/` | Base URL trouxe `/v1`, cliente concatenou novamente |
| Aparecendo `/v1/chat/completions/responses` | Cliente com caminho sobreposto, tabela de rota atual não suporta |

---

## Aviso sobre armadilhas

### Armadilha 1: Duplicar prefixo /v1

**Fenômeno de erro**: Caminho se torna `/v1/v1/chat/completions`

**Causa**: Base URL já tem `/v1`, cliente concatenou novamente.

**Solução**: Mude Base URL para "só até `/v1`", não continue escrevendo caminho de recurso específico.

### Armadilha 2: Cliente com caminho sobreposto

**Fenômeno de erro**: Caminho se torna `/v1/chat/completions/responses`

**Causa**: Cliente adicionou caminho de negócio adicional em cima de caminho de protocolo OpenAI.

**Solução**: Priorize mudar para outro modo de protocolo desse cliente (ex: Kilo Code usar Gemini).

### Armadilha 3: Porta escrita errada

**Fenômeno de erro**: `Connection refused` ou timeout

**Solução**: Na página "API Reverso" do Antigravity Tools confirme porta de escuta atual (padrão 8045), porta do Base URL deve ser igual.

---

## Resumo da lição

| Fenômeno | Causa mais comum | Como você deve corrigir |
| --- | --- | --- |
| Sempre 404 | Conexão de Base URL errada | Primeiro verifique com curl `/v1/models`/`/v1beta/models` não é 404 |
| `/v1/v1/...` | `/v1` duplicado | Base URL do OpenAI SDK mantenha até terminar em `/v1` |
| `/v1/chat/completions/responses` | Cliente com caminho sobreposto | Mude para protocolo Gemini ou faça reescrita de caminho (não recomendado para iniciante) |

---

## Próximo aviso de lição

> Na próxima lição aprendemos **[Interrupção de Fluxo e Problema de 0 Token](../streaming-0token/)**
>
> Você aprenderá:
> - Por que resposta de fluxo inesperadamente interrompe
> - Método de solução de erro de 0 Token
> - Mecanismo de garantia automática do Antigravity

---

## Apêndice: Referência de código-fonte

<details>
<summary><strong>Clique para expandir localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Funcionalidade | Caminho do arquivo | Linha |
| --- | --- | --- |
| Definição de rota de proxy reverso (tabela completa de rotas) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L193) | 120-193 |
| `AxumServer::start()` (entrada de construção de rota) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L79-L216) | 79-216 |
| `health_check_handler()` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L266-L272) | 266-272 |
| README: recomendação de Base URL do Claude Code | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L197-L204) | 197-204 |
| README: explicação de caminho sobreposto do Kilo Code e protocolo recomendado | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L206-L211) | 206-211 |
| README: exemplo de base_url do Python OpenAI SDK | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L213-L227) | 213-227 |

**Funções principais**:
- `AxumServer::start()`: inicia servidor de proxy reverso Axum e registra todas as rotas externas
- `health_check_handler()`: processador de verificação de saúde (`GET /healthz`)

</details>
