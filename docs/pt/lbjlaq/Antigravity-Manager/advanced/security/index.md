---
title: "Segurança: Configuração de Privacidade e Autenticação | Antigravity-Manager"
sidebarTitle: "Não Exponha na LAN sem Proteção"
subtitle: 'Segurança e Privacidade: auth_mode, allow_lan_access, e o Design "Não Vaze Informações de Conta"'
description: "Aprenda métodos de configuração de segurança do Antigravity Tools. Domine os 4 modos de auth_mode, diferenças de endereço de allow_lan_access, configuração de api_key e verificação /healthz, evite vazar informações de conta."
tags:
  - "security"
  - "privacy"
  - "auth_mode"
  - "allow_lan_access"
  - "api_key"
prerequisite:
  - "start-getting-started"
  - "start-proxy-and-first-client"
duration: 16
order: 2
---

# Segurança e Privacidade: auth_mode, allow_lan_access, e o Design "Não Vaze Informações de Conta"

Quando você usa Antigravity Tools como "gateway AI local", questões de segurança geralmente giram em torno de duas coisas: a quem você expôs o serviço (apenas local, ou toda LAN/público), e se solicitações externas precisam trazer API Key. Esta aula explica claramente as regras no código-fonte, e fornece um conjunto de linha de base de segurança mínima que você pode seguir diretamente.

## O Que Você Poderá Fazer Após Este Curso

- Escolher `allow_lan_access` corretamente: saber que ele afeta endereço de escuta (`127.0.0.1` vs `0.0.0.0`)
- Escolher `auth_mode` corretamente: entender o comportamento real de `off/strict/all_except_health/auto`
- Configurar `api_key` e verificar: poder usar `curl` para ver de relance "se autenticação está ativada"
- Saber o limite de proteção de privacidade: key de proxy local não é encaminhada para upstream; para erros de cliente API evitar vazar email de conta

## Seu Problema Atual

- Você quer que celular/outra computador acesse, mas preocupa-se em "expor sem proteção" ao abrir acesso LAN
- Você quer ativar autenticação, mas não tem certeza se `/healthz` deve ser isento, preocupado em quebrar a sondagem de saúde
- Você preocupa-se em vazar key local, cookie, email de conta para clientes externos ou plataformas upstream

## Quando Usar Esta Técnica

- Você está preparando para abrir `allow_lan_access` (NAS, LAN doméstica, rede interna de equipe)
- Você quer usar cloudflared/proxy reverso para expor serviço local para público (primeiro veja **[Túnel One-Click Cloudflared](/zh/lbjlaq/Antigravity-Manager/platforms/cloudflared/)**)
- Você encontra `401`, precisa confirmar se é "não trouxe key", ou "modo não alinhado"

## 🎒 Preparação Antes de Começar

::: warning Pré-requisitos
- Você já pode iniciar API Proxy na GUI (se ainda não passou, primeiro veja **[Inicie o Proxy Reverso Local e Conecte o Primeiro Cliente](/zh/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)**).
- Você sabe qual problema precisa resolver: apenas acesso local, ou quer deixar LAN/público acessar.
:::

::: info 3 campos que aparecerão repetidamente nesta aula
- `allow_lan_access`: se permite acesso LAN.
- `auth_mode`: estratégia de autenticação (decide quais rotas precisam trazer key).
- `api_key`: API Key do proxy local (usada apenas para autenticação de proxy local, não é encaminhada para upstream).
:::

## O Que é auth_mode?

**auth_mode** é o "interruptor de autenticação de proxy + estratégia de isenção" do Antigravity Tools. Ele decide quais solicitações devem carregar `proxy.api_key` quando clientes externos acessam endpoints de proxy local, e se rotas de sondagem como `/healthz` permitem acesso sem autenticação.

## Ideia Central

1. Primeiro defina "superfície de exposição": `allow_lan_access=false` apenas escuta `127.0.0.1`; `true` escuta `0.0.0.0`.
2. Depois defina "chave de entrada": `auth_mode` decide se precisa trazer key, e se `/healthz` é isento.
3. Finalmente faça "fechamento de privacidade": não encaminhe key/cookie de proxy local para upstream; mensagens de erro externas evitam trazer email de conta.

## Siga-me

### Passo 1: Primeiro Decida Se Você Quer Abrir Acesso LAN (allow_lan_access)

**Por Que**
Você só deve abrir acesso LAN quando "precisa que outros dispositivos acessem", caso contrário, apenas acesso local é a política de segurança mais despreocupada.

No `ProxyConfig`, o endereço de escuta é decidido por `allow_lan_access`:

```rust
pub fn get_bind_address(&self) -> &str {
    if self.allow_lan_access {
        "0.0.0.0"
    } else {
        "127.0.0.1"
    }
}
```

Na página `API Proxy` da GUI, defina o interruptor "Permitir acesso LAN" de acordo com suas necessidades.

**Você Deve Ver**
- Desligado: o texto é semântica de "apenas acesso local" (texto específico depende do pacote de idioma)
- Ligado: a interface mostrará aviso proeminente (lembrando que esta é uma "expansão de superfície de exposição")

### Passo 2: Escolha um auth_mode (Recomendado Usar auto Primeiro)

**Por Que**
`auth_mode` não é apenas "ligar/desligar autenticação", também decide se endpoints de sondagem como `/healthz` são isentos.

O projeto suporta 4 modos (de `docs/proxy/auth.md`):

- `off`: nenhuma rota precisa de autenticação
- `strict`: todas as rotas precisam de autenticação
- `all_except_health`: exceto `/healthz`, outras rotas precisam de autenticação
- `auto`: modo automático, derivará estratégia real baseado em `allow_lan_access`

A lógica de derivação de `auto` está em `ProxySecurityConfig::effective_auth_mode()`:

```rust
match self.auth_mode {
    ProxyAuthMode::Auto => {
        if self.allow_lan_access {
            ProxyAuthMode::AllExceptHealth
        } else {
            ProxyAuthMode::Off
        }
    }
    ref other => other.clone(),
}
```

**Recomendado**
- Apenas acesso local: `allow_lan_access=false` + `auth_mode=auto` (finalmente equivalente a `off`)
- Acesso LAN: `allow_lan_access=true` + `auth_mode=auto` (finalmente equivalente a `all_except_health`)

**Você Deve Ver**
- Na página `API Proxy`, a caixa suspensa "Auth Mode" tem quatro opções `off/strict/all_except_health/auto`

### Passo 3: Confirme Sua api_key (Regere se Necessário)

**Por Que**
Enquanto seu proxy precisa ser acessível externamente (LAN/público), `api_key` deve ser gerenciado como senha.

Por padrão `ProxyConfig::default()` gerará uma key no formato `sk-...`:

```rust
api_key: format!("sk-{}", uuid::Uuid::new_v4().simple()),
```

Na página `API Proxy`, você pode editar, regerar, copiar a atual `api_key`.

**Você Deve Ver**
- Página tem caixa de entrada `api_key`, e botões editar/regerar/copiar

### Passo 4: Use /healthz para Verificar "Estratégia de Isenção" Atende Expectativa

**Por Que**
`/healthz` é o ciclo mais curto: você não precisa realmente chamar o modelo, pode confirmar "serviço alcançável + estratégia de autenticação correta".

Troque `<PORT>` pela sua porta (padrão `8045`):

::: code-group

```bash [macOS/Linux]
curl -sS "http://127.0.0.1:<PORT>/healthz"
```

```powershell [Windows]
curl.exe -sS "http://127.0.0.1:<PORT>/healthz"
```

:::

**Você Deve Ver**

```json
{"status":"ok"}
```

::: details Se você definir auth_mode como strict
`strict` não isentará `/healthz`. Você precisa trazer key:

```bash
curl -sS "http://127.0.0.1:<PORT>/healthz" \
  -H "Authorization: Bearer <API_KEY>"
```
:::

### Passo 5: Use um "Endpoint Não health" para Verificar 401 (e Após Trazer Key Não Mais 401)

**Por Que**
Você precisa confirmar que o middleware de autenticação realmente está em vigor, não que UI escolheu o modo mas não entrou em ação.

O corpo de solicitação abaixo é propositalmente incompleto, seu objetivo não é "chamar com sucesso", mas verificar se foi bloqueado por autenticação:

```bash
#sem key: quando auth_mode != off, deve 401 diretamente
curl -i "http://127.0.0.1:<PORT>/v1/messages" \
  -H "Content-Type: application/json" \
  -d "{}"

#com key: não deve mais ser 401 (pode retornar 400/422, porque corpo incompleto)
curl -i "http://127.0.0.1:<PORT>/v1/messages" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <API_KEY>" \
  -d "{}"
```

**Você Deve Ver**
- Sem key: `HTTP/1.1 401 Unauthorized`
- Com key: código de estado não mais 401

## Pontos de Verificação ✅

- Você pode explicar claramente sua superfície de exposição atual: apenas local (`127.0.0.1`) ou LAN (`0.0.0.0`)
- Quando `auth_mode=auto`, você pode prever modo efetivo real (LAN -> `all_except_health`, local -> `off`)
- Você pode reproduzir com 2 comandos `curl` "401 sem key"

## Lembrete de Armadilhas

::: warning Abordagem Errada vs Recomendado

| Cenário | ❌ Erro Comum | ✓ Recomendado |
| --- | --- | --- |
| Precisa Acesso LAN | Apenas abrir `allow_lan_access=true`, mas `auth_mode=off` | Use `auth_mode=auto`, e defina `api_key` forte |
| Autenticação Ativada Mas Sempre 401 | Cliente trouxe key, mas nome de header não compatível | Proxy compatível com três headers `Authorization`/`x-api-key`/`x-goog-api-key` |
| Autenticação Ativada Mas Sem Configurar key | `api_key` vazio mas autenticação ativada | Backend rejeitará diretamente (log avisará key vazia) |
:::

::: warning Isenção de /healthz só entra em vigor em all_except_health
O middleware permitirá quando "modo efetivo" for `all_except_health` e caminho for `/healthz`; você deve tratá-lo como "porta de sondagem", não usá-lo como API de negócio.
:::

## Privacidade e Design "Não Vaze Informações de Conta"

### 1) Key de Proxy Local Não é Encaminhada para Upstream

Autenticação apenas acontece na entrada de proxy local; `docs/proxy/auth.md` explica claramente: a API key do proxy não é encaminhada para upstream.

### 2) Ao Encaminhar para z.ai, Contrairá Intencionalmente Headers Possíveis de Encaminhar

Quando a solicitação é encaminhada para z.ai (compatível com Anthropic), o código só permitirá poucos headers, evitando levar key/cookie de proxy local:

```rust
// Only forward a conservative set of headers to avoid leaking the local proxy key or cookies.
```

### 3) Mensagem de Erro de Falha de Atualização de Token Evita Incluir Email de Conta

Quando a atualização de token falha, o log registrará a conta específica, mas o erro retornado ao cliente API será reescrito em forma não contendo email:

```rust
// Avoid leaking account emails to API clients; details are still in logs.
last_error = Some(format!("Token refresh failed: {}", e));
```

## Resumo da Lição

- Primeiro defina superfície de exposição (`allow_lan_access`), depois defina chave de entrada (`auth_mode` + `api_key`)
- Regra de `auth_mode=auto` é simples: LAN pelo menos `all_except_health`, apenas local então `off`
- A linha de base de privacidade é "key local não leva externamente, email de conta não vaza em erro externo", detalhes no middleware e código de encaminhamento upstream

## Próximo Passo

> Na próxima lição veremos **[Agendamento de Alta Disponibilidade: Rotação, Conta Fixa, Sessão Pegajosa e Retry de Falha](/zh/lbjlaq/Antigravity-Manager/advanced/scheduling/)**, complementando a "saída estável" após a "entrada segura".

---

## Apêndice: Referência do Código-fonte

<details>
<summary><strong>Clique para Expandir e Ver Localização do Código-fonte</strong></summary>

> Última Atualização: 2026-01-23

| Função | Caminho do Arquivo | Número da Linha |
| --- | --- | --- |
| Quatro modos de auth_mode e explicação de semântica auto | [`docs/proxy/auth.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/auth.md#L10-L24) | 10-24 |
| Enumeração ProxyAuthMode e valor padrão (padrão off) | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L5-L18) | 5-18 |
| Campos Chave de ProxyConfig e Valores Padrão (allow_lan_access, api_key) | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L259) | 174-259 |
| Derivação de Endereço de Escuta (127.0.0.1 vs 0.0.0.0) | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L281-L292) | 281-292 |
| Lógica de Derivação auto -> effective_auth_mode | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L10-L30) | 10-30 |
| Middleware de Autenticação (OPTIONS passa, /healthz isento, três headers compatíveis) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L78) | 14-78 |
| UI: interruptores/caixas suspensas de allow_lan_access e auth_mode | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L943-L1046) | 943-1046 |
| UI: editar/reativar/copiar api_key | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L1048-L1120) | 1048-1120 |
| Desativação Automática invalid_grant e Reescrita de Erro "Evitar Vazar Email" | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L841-L940) | 841-940 |
| disable_account: escrever disabled/disabled_at/disabled_reason e remover do pool de memória | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L942-L969) | 942-969 |
| Encaminhamento z.ai contrair headers possíveis de encaminhar (evitar vazar key/cookies local) | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L70-L89) | 70-89 |
| Explicação de Comportamento de Desativação de Pool de Contas e Exibição de UI (documentação) | [`docs/proxy/accounts.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/accounts.md#L9-L44) | 9-44 |

</details>
