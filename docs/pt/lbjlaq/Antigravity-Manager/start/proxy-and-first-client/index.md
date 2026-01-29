---
title: "Iniciar Proxy: Proxy Reverso e Integração de Cliente | Antigravity-Manager"
sidebarTitle: "Execute Proxy Reverso em 5 Minutos"
subtitle: "Iniciar Proxy Reverso Local e Conectar Primeiro Cliente (/healthz + Configuração SDK)"
description: "Aprenda inicialização e integração de cliente do proxy reverso Antigravity: configure porta e autenticação, use /healthz para verificação, complete primeira chamada de SDK."
tags:
  - "API Proxy"
  - "healthz"
  - "OpenAI SDK"
  - "Anthropic SDK"
  - "Gemini SDK"
  - "Base URL"
prerequisite:
  - "start-installation"
  - "start-add-account"
duration: 18
order: 6
---

# Iniciar Proxy Reverso Local e Conectar Primeiro Cliente (/healthz + Configuração SDK)

Esta lição usa o Antigravity Tools para completar o proxy reverso local (API Proxy): iniciar serviço, usar `/healthz` para verificação, depois conectar um SDK para completar a primeira solicitação.

## O que você poderá fazer após completar

- Iniciar/parar serviço de proxy reverso local na página API Proxy do Antigravity Tools
- Fazer verificação com `GET /healthz`, confirmar "porta correta, serviço realmente rodando"
- Esclarecer relação entre `auth_mode` e API Key: quais caminhos precisam de autenticação, qual Header trazer
- Escolher qualquer cliente (OpenAI / Anthropic / Gemini SDK) para completar primeira solicitação real

## Seu dilema atual

- Você já instalou o Antigravity Tools, também adicionou conta, mas não sabe "se o proxy reverso iniciou com sucesso"
- Ao integrar cliente, facilmente encontra `401` (sem key) ou `404` (Base URL errado/caminho duplicado)
- Você não quer adivinhar, quer o ciclo mais curto: iniciar → verificar → primeira solicitação com sucesso

## Quando usar essa técnica

- Você acabou de instalar, quer confirmar se gateway local pode funcionar externamente
- Você mudou porta, habilitou acesso LAN, ou mudou modo de autenticação, quer validar rapidamente que configuração não deu problema
- Você vai integrar um novo cliente/novo SDK, quer primeiro rodar com exemplo mínimo

## 🎒 Preparação antes de começar

::: warning Pré-requisitos
- Você já completou a instalação, e pode abrir o Antigravity Tools normalmente.
- Você tem pelo menos uma conta disponível; caso contrário, ao iniciar proxy reverso retornará erro `"Nenhuma conta disponível, adicione conta primeiro"` (apenas quando distribuição z.ai também não habilitada).
:::

::: info Algumas palavras que aparecerão repetidamente nesta lição
- **Base URL**: Endereço raiz de solicitação do cliente. Formas de concatenação variam entre SDKs, alguns precisam `/v1`, outros não.
- **Verificação**: Usar solicitação mínima para confirmar serviço acessível. O endpoint de verificação deste projeto é `GET /healthz`, retorna `{"status":"ok"}`.
:::

## Ideia Principal

1. Quando Antigravity Tools inicia o proxy reverso, baseado na configuração vincula endereço de monitoramento e porta:
   - Quando `allow_lan_access=false` vincula `127.0.0.1`
   - Quando `allow_lan_access=true` vincula `0.0.0.0`
2. Você não precisa escrever código primeiro. Primeiro use `GET /healthz` para verificação, confirmar "serviço rodando".
3. Se você habilitou autenticação:
   - `auth_mode=all_except_health` isenta `/healthz`
   - `auth_mode=strict` então todos os caminhos precisam de API Key

## Siga-me

### Passo 1: Confirme porta, acesso LAN, modo de autenticação

**Por que**
Você primeiro precisa determinar "para onde o cliente deve conectar (host/port)" e "se precisa trazer key", caso contrário depois 401/404 serão difíceis de resolver.

No Antigravity Tools abra a página `API Proxy`, foque nestes 4 campos:

- `port`: padrão é `8045`
- `allow_lan_access`: desabilitado por padrão (apenas acesso local)
- `auth_mode`: opcional `off/strict/all_except_health/auto`
- `api_key`: por padrão gerará `sk-...`, e UI validará que deve começar com `sk-` e ter pelo menos 10 caracteres

**Você deve ver**
- No canto superior direito da página há botão Start/Stop (iniciar/parar proxy reverso), caixa de entrada de porta ficará desabilitada enquanto serviço roda

::: tip Configuração recomendada para iniciantes (primeiro rode, depois adicione segurança)
- Primeira execução: `allow_lan_access=false` + `auth_mode=off`
- Se precisa acesso LAN depois: primeiro abra `allow_lan_access=true`, depois mude `auth_mode` para `all_except_health` (pelo menos não exponha toda LAN como "API sem proteção")
:::

### Passo 2: Inicie serviço de proxy reverso

**Por que**
O Start da GUI chama comando backend para iniciar Axum Server, e carrega pool de contas; este é o pré-requisito para "fornecer API externamente".

Clique no botão Start no canto superior direito da página.

**Você deve ver**
- Estado muda de stopped para running
- Ao lado aparecerá quantidade de contas carregadas atualmente (active accounts)

::: warning Se inicialização falhar, os dois erros mais comuns
- `"Nenhuma conta disponível, adicione conta primeiro"`: indica pool de contas vazio, e distribuição z.ai não habilitada.
- `"Falha ao iniciar servidor Axum: falha ao vincular endereço <host:port>: ..."`: porta ocupada ou sem permissão (tente outra porta).
:::

### Passo 3: Faça verificação com /healthz (ciclo mais curto)

**Por que**
`/healthz` é a confirmação mais estável de "conectividade". Não depende de modelo, conta ou conversão de protocolo, apenas verifica se serviço é acessível.

Substitua `<PORTA>` pela porta que você vê na UI (padrão `8045`):

::: code-group

```bash [macOS/Linux]
curl -sS "http://127.0.0.1:<PORTA>/healthz"
```

```powershell [Windows]
curl.exe -sS "http://127.0.0.1:<PORTA>/healthz"
```

:::

**Você deve ver**

```json
{"status":"ok"}
```

::: details Como testar quando precisa de autenticação?
Quando você muda `auth_mode` para `strict`, todos os caminhos precisam trazer key (incluindo `/healthz`).

```bash
curl -sS "http://127.0.0.1:<PORTA>/healthz" \
  -H "Authorization: Bearer <API_KEY>"
```

Forma recomendada de Header de autenticação (compatível com mais formas):
- `Authorization: Bearer <proxy.api_key>` ou `Authorization: <proxy.api_key>`
- `x-api-key: <proxy.api_key>`
- `x-goog-api-key: <proxy.api_key>`
:::

### Passo 4: Conecte seu primeiro cliente (escolha um entre OpenAI / Anthropic / Gemini)

**Por que**
`/healthz` apenas indica "serviço acessível"; integração real bem-sucedida deve ser baseada em SDK fazendo uma solicitação real.

::: code-group

```python [OpenAI SDK (Python)]
import openai

client = openai.OpenAI(
    api_key="<API_KEY>",
    base_url="http://127.0.0.1:8045/v1",
)

resp = client.chat.completions.create(
    model="gemini-3-flash",
    messages=[{"role": "user", "content": "Olá, por favor se apresente"}],
)

print(resp.choices[0].message.content)
```

```bash [Claude Code / Anthropic CLI]
export ANTHROPIC_API_KEY="<API_KEY>"
export ANTHROPIC_BASE_URL="http://127.0.0.1:8045"
claude
```

```python [Gemini SDK (Python)]
import google.generativeai as genai

genai.configure(
    api_key="<API_KEY>",
    transport="rest",
    client_options={"api_endpoint": "http://127.0.0.1:8045"},
)

model = genai.GenerativeModel("gemini-3-flash")
resp = model.generate_content("Hello")
print(resp.text)
```

:::

**Você deve ver**
- Cliente pode obter uma resposta de texto não vazia
- Se você habilitou Proxy Monitor, você também verá este registro de solicitação no monitoramento

## Ponto de verificação ✅

- `GET /healthz` retorna `{"status":"ok"}`
- Página API Proxy mostra running
- Um exemplo de SDK que você escolheu pode retornar conteúdo (não 401/404, nem resposta vazia)

## Aviso sobre armadilhas

::: warning 401: maioria é autenticação não alinhada
- Você habilitou `auth_mode`, mas cliente não trouxe key.
- Você trouxe key, mas nome do Header errado: este projeto simultaneamente suporta `Authorization` / `x-api-key` / `x-goog-api-key`.
:::

::: warning 404: maioria é Base URL errado ou "caminho duplicado"
- OpenAI SDK geralmente precisa `base_url=.../v1`; enquanto exemplos Anthropic/Gemini não têm `/v1`.
- Alguns clientes concatenarão caminho repetidamente algo como `/v1/chat/completions/responses`, causará 404 (README do projeto mencionou especificamente problema de caminho duplicado no modo OpenAI do Kilo Code).
:::

::: warning Acesso LAN não é "abrir e pronto"
Quando você habilita `allow_lan_access=true`, serviço vinculará a `0.0.0.0`. Isso significa que outros dispositivos na mesma LAN podem acessar através do IP da sua máquina + porta.

Se você for usar assim, pelo menos habilite `auth_mode`, e defina uma `api_key` forte.
:::

## Resumo da lição

- Após iniciar proxy reverso, primeiro use `/healthz` para verificação, depois configure SDK
- `auth_mode` decide quais caminhos precisam de key; `all_except_health` isenta `/healthz`
- Ao integrar SDK, o mais fácil de errar é se Base URL precisa de `/v1`

## Próximo aviso de lição

> Na próxima lição esclarecemos detalhes da API compatível OpenAI: incluindo limites de compatibilidade de `/v1/chat/completions` e `/v1/responses`.
>
> Vá ver **[API Compatível OpenAI: Estratégia de Implementação de /v1/chat/completions e /v1/responses](/pt/lbjlaq/Antigravity-Manager/platforms/openai/)**.

---

## Apêndice: Referência de código-fonte

<details>
<summary><strong>Clique para expandir localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Tópico | Caminho do arquivo | Linha |
|--- | --- | ---|
| Iniciar/parar/estado de serviço de proxy reverso | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L42-L178) | 42-178 |
| Verificação de pool de contas antes de iniciar (condição de erro quando sem conta) | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L81-L91) | 81-91 |
| Registro de rota (incluindo `/healthz`) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| Retorno de `/healthz` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L266-L272) | 266-272 |
| Middleware de autenticação de proxy (compatibilidade de Header e isenção `/healthz`) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L78) | 14-78 |
| Lógica real de análise `auth_mode=auto` | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L19-L30) | 19-30 |
| Valores padrão de ProxyConfig (porta 8045, apenas local padrão) | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L257) | 174-257 |
| Derivação de endereço de vinculação (127.0.0.1 vs 0.0.0.0) | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L281-L291) | 281-291 |
| Botão UI iniciar/parar chama `start_proxy_service/stop_proxy_service` | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L624-L639) | 624-639 |
| Área de configuração UI porta/LAN/autenticação/API key | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L868-L1121) | 868-1121 |
| Exemplos de integração README Claude Code / Python | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L197-L227) | 197-227 |

</details>
