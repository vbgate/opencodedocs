---
title: "Solução de Erro 401: Falha de Autenticação | Antigravity-Manager"
sidebarTitle: "Resolva 401 em 3 Minutos"
subtitle: "401/Falha de Autenticação: Verifique auth_mode Primeiro, Depois Headers"
description: "Aprenda o mecanismo de autenticação do proxy do Antigravity Tools, resolva erros 401. Localize o problema seguindo a ordem auth_mode, api_key, Header, entenda as regras do modo auto e a isenção /healthz, evite erros de prioridade de Header."
tags:
  - "FAQ"
  - "Autenticação"
  - "401"
  - "API Key"
prerequisite:
  - "start-proxy-and-first-client"
order: 2
---

# 401/Falha de Autenticação: Verifique auth_mode Primeiro, Depois Headers

## O Que Você Poderá Fazer Após Este Curso

- Determinar em 3 minutos se o 401 está sendo bloqueado pelo middleware de autenticação do Antigravity Tools
- Entender o "valor efetivo" dos quatro modos de `proxy.auth_mode` (especialmente `auto`) na sua configuração atual
- Fazer solicitações passarem usando o Header de API Key correto (e evitando a armadilha de prioridade de Headers)

## Seu Problema Atual

Ao chamar o proxy reverso local pelo cliente, você recebe o erro `401 Unauthorized`:
- Python/OpenAI SDK: lança `AuthenticationError`
- curl: retorna `HTTP/1.1 401 Unauthorized`
- Cliente HTTP: código de status da resposta 401

## O Que é 401/Falha de Autenticação?

**401 Unauthorized** no Antigravity Tools geralmente significa: o proxy habilitou autenticação (determinado por `proxy.auth_mode`), mas a solicitação não carregou uma API Key correta, ou carregou um Header com prioridade mais alta mas incorreto, então `auth_middleware()` retorna diretamente 401.

::: info Primeiro Confirme se É "o Proxy Bloqueando"
O upstream também pode retornar 401, mas este FAQ só lida com "401 causado pela autenticação do proxy". Você pode primeiro usar `/healthz` abaixo para distinguir rapidamente.
:::

## Solução Rápida (Faça nesta Ordem)

### Passo 1: Use `/healthz` para Determinar "Se a Autenticação Está Bloqueando Você"

**Por Que**
`all_except_health` permite que `/healthz` passe, mas bloqueia outras rotas; isso ajuda você a localizar rapidamente se 401 vem da camada de autenticação do proxy.

```bash
 # Sem nenhum Header de autenticação
curl -i http://127.0.0.1:8045/healthz
```

**Você Deve Ver**
- `auth_mode=all_except_health` (ou `auto` e `allow_lan_access=true`): geralmente retorna `200`
- `auth_mode=strict`: retornará `401`

::: tip /healthz é GET na Camada de Rota
O proxy registra `GET /healthz` na rota (veja `src-tauri/src/proxy/server.rs`).
:::

---

### Passo 2: Confirme o "Valor Efetivo" de `auth_mode` (especialmente `auto`)

**Por Que**
`auto` não é uma "estratégia independente", ela calcula o modo que realmente será executado com base em `allow_lan_access`.

| `proxy.auth_mode` | Condição Adicional | Valor Efetivo |
| --- | --- | --- |
| `off` | - | `off` |
| `strict` | - | `strict` |
| `all_except_health` | - | `all_except_health` |
| `auto` | `allow_lan_access=false` | `off` |
| `auto` | `allow_lan_access=true` | `all_except_health` |

**Você pode verificar na página API Proxy da GUI**: `Allow LAN Access` e `Auth Mode`.

---

### Passo 3: Confirme que `api_key` Não Está Vazio e Você Está Usando o Mesmo Valor

**Por Que**
Quando a autenticação está ativada, se `proxy.api_key` estiver vazio, `auth_middleware()` rejeitará diretamente todas as solicitações e registrará um erro de log.

```text
Proxy auth is enabled but api_key is empty; denying request
```

**Você Deve Ver**
- Na página API Proxy você pode ver uma key começando com `sk-` (o valor padrão em `ProxyConfig::default()` é gerado automaticamente)
- Após clicar em "Regenerate/Editar" e salvar, solicitações externas serão verificadas imediatamente com a nova key (sem necessidade de reiniciar)

---

### Passo 4: Tente com o Header Mais Simples (Não Use SDK Complexos Primeiro)

**Por Que**
O middleware lê primeiro `Authorization`, depois `x-api-key`, e finalmente `x-goog-api-key`. Se você enviar múltiplos Headers ao mesmo tempo, e o primeiro estiver errado, mesmo que o último esteja correto, não será usado.

```bash
 # Escrita recomendada: Authorization + Bearer
curl -i http://127.0.0.1:8045/v1/models \
  -H "Authorization: Bearer sk-REPLACE_WITH_YOUR_PROXY_API_KEY"
```

**Você Deve Ver**: `HTTP/1.1 200 OK` (ou pelo menos não mais 401)

::: info Detalhes de Compatibilidade com Authorization do Proxy
`auth_middleware()` fará um strip do valor de `Authorization` pelo prefixo `Bearer `; se não houver o prefixo `Bearer `, usará todo o valor como key para comparação. A documentação ainda recomenda `Authorization: Bearer <key>` (mais consistente com a convenção de SDKs gerais).
:::

**Se Você Precisar Usar `x-api-key`**:

```bash
curl -i http://127.0.0.1:8045/v1/models \
  -H "x-api-key: sk-REPLACE_WITH_YOUR_PROXY_API_KEY"
```

---

## Armadilhas Comuns (Ocorrem Realmente no Código-fonte)

| Fenômeno | Causa Real | Como Você Deve Corrigir |
| --- | --- | --- |
| `auth_mode=auto`, mas chamadas locais ainda dão 401 | `allow_lan_access=true` faz `auto` se tornar `all_except_health` | Desligue `allow_lan_access`, ou faça o cliente carregar a key |
| Você acha "eu claramente trouxe x-api-key", mas ainda 401 | Trouxe simultaneamente um `Authorization` incorreto, o middleware o usa por prioridade | Remova Headers extras, mantenha apenas aquele que você tem certeza que está correto |
| `Authorization: Bearer<key>` ainda 401 | Faltou espaço após `Bearer`, impossível fazer strip pelo prefixo `Bearer ` | Mude para `Authorization: Bearer <key>` |
| Todas as solicitações dão 401, log mostra `api_key is empty` | `proxy.api_key` está vazio | Regere/defina uma key não vazia na GUI |

## Resumo da Lição

- Primeiro use `/healthz` para localizar se 401 vem da camada de autenticação do proxy
- Depois confirme `auth_mode` (especialmente o modo efetivo de `auto`)
- Finalmente, carregue apenas um Header correto para verificar (evite a armadilha de prioridade de Headers)

## Próximo Passo

> Na próxima lição aprenderemos **[429/Erros de Capacidade: Expectativas Corretas de Rotação de Contas e Equívocos de Esgotamento de Capacidade de Modelo](../429-rotation/)**.
>
> Você aprenderá:
> - Se 429 é "cota insuficiente" ou "limitação upstream"
> - Expectativas corretas de rotação de contas (quando muda automaticamente e quando não)
> - Usar configuração para reduzir a probabilidade de 429

---

## Apêndice: Referência do Código-fonte

<details>
<summary><strong>Clique para Expandir e Ver Localização do Código-fonte</strong></summary>

> Última Atualização: 2026-01-23

| Função        | Caminho do Arquivo                                                                                             | Número da Linha    |
| ----------- | ---------------------------------------------------------------------------------------------------- | ------- |
| Enumeração ProxyAuthMode | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L5-L18) | 5-18 |
| ProxyConfig: allow_lan_access/auth_mode/api_key e Valores Padrão | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L258) | 174-258 |
| Resolução do Modo Auto (effective_auth_mode) | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L1-L30) | 1-30 |
| Middleware de Autenticação (Extração e Prioridade de Header, Isenção /healthz, Permissão OPTIONS) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L77) | 14-77 |
| Registro de Rota /healthz e Ordem de Middleware | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L170-L193) | 170-193 |
| Documentação de Autenticação (Modos e Convenções de Cliente) | [`docs/proxy/auth.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/auth.md#L1-L45) | 1-45 |

**Enumerações Chave**:
- `ProxyAuthMode::{Off, Strict, AllExceptHealth, Auto}`: Modos de Autenticação

**Funções Chave**:
- `ProxySecurityConfig::effective_auth_mode()`: Converte `auto` em estratégia real
- `auth_middleware()`: Executa autenticação (inclui ordem de extração de Header e isenção /healthz)

</details>
