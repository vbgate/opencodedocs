---
title: "Introdução: Gateway AI Local | Antigravity Manager"
sidebarTitle: "O que é um Gateway AI Local"
subtitle: "O que é o Antigravity Tools: Transformar 'Conta + Protocolo' em um Gateway AI Local"
description: "Entenda o posicionamento principal do Antigravity Manager. Ele fornece uma aplicação de desktop e um gateway HTTP local, suporta múltiplos endpoints de protocolos e agendamento de pool de contas, ajudando você a começar rapidamente com proxy reverso local e evitar erros comuns de configuração."
tags:
  - "Iniciante"
  - "Conceito"
  - "Gateway Local"
  - "API Proxy"
prerequisite: []
order: 1
---

# O que é o Antigravity Tools: Transformar "Conta + Protocolo" em um Gateway AI Local

Para muitos clientes/SDKs AI, a barreira de entrada não está em "saber chamar API", mas em "com qual protocolo você realmente precisa se integrar, como gerenciar múltiplas contas, como fazer com que falhas se recuperem automaticamente". O Antigravity Tools tenta consolidar essas três coisas em um gateway local.

## O que é o Antigravity Tools?

**Antigravity Tools** é uma aplicação de desktop: você gerencia contas e configurações na GUI, ela inicia um serviço de proxy reverso HTTP na sua máquina, encaminha uniformemente solicitações de diferentes fabricantes/protocolos para o upstream, e converte as respostas de volta ao formato familiar do cliente.

## O que você poderá fazer após completar

- Explicar claramente qual problema o Antigravity Tools resolve (e o que ele não resolve)
- Reconhecer seus componentes principais: GUI, pool de contas, gateway de proxy reverso HTTP, adaptação de protocolo
- Entender os limites de segurança padrão (127.0.0.1, porta, modo de autenticação) e quando precisam ser alterados
- Saber para qual capítulo ir a seguir: instalação, adicionar conta, iniciar proxy, conectar cliente

## Seu dilema atual

Você pode ter encontrado esses problemas:

- O mesmo cliente precisa suportar três protocolos (OpenAI/Anthropic/Gemini), as configurações ficam bagunçadas
- Tem múltiplas contas, mas alternância, rotação e limitação de taxa com retry são manuais
- Quando as solicitações falham, você só pode adivinhar nos logs se é "conta inválida" ou "limite de upstream/capacidade esgotada"

O objetivo do Antigravity Tools é fazer esse "trabalho de borda" entrar em um gateway local, permitindo que seu cliente/SDK se preocupe apenas com uma coisa: enviar solicitações para o local.

## Ideia Principal

Você pode entendê-lo como um "gateway de agendamento AI" local, composto por três camadas:

1) GUI (Aplicação de Desktop)
- Responsável por permitir que você gerencie contas, configurações, monitoramento e estatísticas.
- Página principal: Dashboard, Accounts, API Proxy, Monitor, Token Stats, Settings.

2) Serviço de Proxy Reverso HTTP (Axum Server)
- Responsável por expor múltiplos endpoints de protocolo externamente e encaminhar solicitações para o handler correspondente.
- O serviço de proxy reverso monta camadas de autenticação, middleware de monitoramento, CORS, Trace, etc.

3) Pool de Contas e Agendamento (TokenManager, etc.)
- Responsável por selecionar contas disponíveis do pool de contas local, atualizar tokens quando necessário, fazer rotação e auto-recuperação.

::: info O que significa "gateway local"?
Aqui "local" é literal: o serviço roda na sua própria máquina, seus clientes (Claude Code, OpenAI SDK, vários clientes de terceiros) apontam o Base URL para `http://127.0.0.1:<port>`, as solicitações chegam primeiro na sua máquina, depois são encaminhadas pelo Antigravity Tools para o upstream.
:::

## Quais endpoints ele expõe externamente

O serviço de proxy reverso registra múltiplos conjuntos de endpoints de protocolo em um Router, você pode primeiro lembrar estas "entradas":

- Compatível com OpenAI: `/v1/chat/completions`, `/v1/completions`, `/v1/responses`, `/v1/models`
- Compatível com Anthropic: `/v1/messages`, `/v1/messages/count_tokens`
- Nativo Gemini: `/v1beta/models`, `/v1beta/models/:model`, `/v1beta/models/:model/countTokens`
- Verificação de saúde: `GET /healthz`

Se seu cliente pode integrar qualquer um desses protocolos, teoricamente pode, através de "mudar o Base URL", direcionar solicitações para este gateway local.

## Limites de segurança padrão (não pule)

O maior problema com esse tipo de "proxy reverso local" geralmente não é falta de funcionalidade, mas você acidentalmente o expor para fora.

Primeiro, lembre alguns valores padrão (todos vindos da configuração padrão):

- Porta padrão: `8045`
- Apenas acesso local por padrão: `allow_lan_access=false`, endereço de escuta `127.0.0.1`
- Modo de autenticação padrão: `auth_mode=off` (não exige que o cliente traga key)
- Por padrão, gerará um `api_key` no formato `sk-...` (para você habilitar quando precisar de autenticação)

::: warning Quando você deve habilitar autenticação?
Sempre que você habilitar acesso LAN (`allow_lan_access=true`, endereço de escuta torna-se `0.0.0.0`), você deve habilitar autenticação simultaneamente e tratar a API Key como uma senha.
:::

## Quando usar o Antigravity Tools

Ele é mais adequado para estes cenários:

- Você tem múltiplos clientes/SDKs AI, quer passar por um único Base URL unificado
- Você precisa consolidar diferentes protocolos (OpenAI/Anthropic/Gemini) no mesmo "ponto de saída local"
- Você tem múltiplas contas, quer que o sistema seja responsável pela rotação e tratamento de estabilidade

Se você só quer "escrever duas linhas de código para chamar diretamente a API oficial", e suas contas/protocolos são fixos, pode ser um pouco pesado.

## Siga-me: primeiro estabeleça a ordem correta de uso

Esta aula não ensina configurações detalhadas, apenas alinha a ordem principal para evitar que você pule e fique preso:

### Passo 1: Primeiro instale e inicie

**Por que**
A aplicação de desktop é responsável pelo gerenciamento de contas e iniciar o serviço de proxy reverso. Sem ela, OAuth/proxy subsequente não têm sentido.

Vá para o próximo capítulo e complete a instalação seguindo o README.

**Você deve ver**: Você pode abrir o Antigravity Tools e ver a página Dashboard.

### Passo 2: Adicione pelo menos uma conta

**Por que**
O serviço de proxy reverso precisa obter uma identidade disponível do pool de contas para enviar solicitações ao upstream. Sem contas, o gateway não pode "chamar em seu nome".

Vá para o capítulo "Adicionar Conta" e adicione a conta seguindo o fluxo OAuth ou Refresh Token.

**Você deve ver**: Sua conta aparece na página Accounts, e você pode ver informações de cota/estado.

### Passo 3: Inicie o API Proxy e faça a verificação mínima com /healthz

**Por que**
Primeiro use `GET /healthz` para verificar "o serviço local está rodando", depois conecte o cliente, a solução de problemas será muito mais simples.

Vá para o capítulo "Iniciar Proxy Reverso Local e Conectar o Primeiro Cliente" para completar o ciclo.

**Você deve ver**: Seu cliente/SDK pode obter com sucesso uma resposta através do Base URL local.

## Aviso sobre armadilhas

| Cenário | O que você pode fazer (❌) | Prática recomendada (✓) |
|---------|---------------------------|--------------------------|
| Quer que celular/outro PC acesse | Abra diretamente `allow_lan_access=true` mas não configure autenticação | Habilite autenticação simultaneamente, e primeiro valide `GET /healthz` na LAN |
| Cliente reporta 404 | Mude host/port apenas, não importa como o cliente concatena `/v1` | Primeiro confirme a estratégia de concatenação base_url do cliente, depois decida se precisa prefixar `/v1` |
| Começa logo resolvendo Claude Code | Conecte diretamente o cliente complexo, quando falhar não sabe onde verificar | Primeiro execute o ciclo mínimo: inicie Proxy -> `GET /healthz` -> depois conecte o cliente |

## Resumo da lição

- O posicionamento do Antigravity Tools é "aplicação de desktop + gateway de proxy reverso HTTP local": GUI gerencia, Axum fornece múltiplos endpoints de protocolo
- Você precisa tratá-lo como uma infraestrutura local: primeiro instale, adicione conta, inicie Proxy, conecte cliente
- Por padrão apenas escuta `127.0.0.1:8045`, se expor para LAN, deve habilitar autenticação obrigatoriamente

## Próximo aviso de lição

> Na próxima lição completamos a instalação: **[Instalação e Atualização: Melhor caminho de instalação para desktop](../installation/)**.
>
> Você aprenderá:
> - Várias maneiras de instalação listadas no README (e prioridade)
> - Entrada de atualização e como lidar com bloqueios comuns do sistema

---

## Apêndice: Referência de código-fonte

<details>
<summary><strong>Clique para expandir localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Funcionalidade | Caminho do arquivo | Linha |
|---------------|---------------------|-------|
| Posicionamento do produto (hub de transbordo local AI / lacuna de protocolo) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L35-L77) | 35-77 |
| Visão geral dos endpoints do Router (OpenAI/Claude/Gemini/healthz) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| Lógica de porta padrão / acesso apenas local padrão / key padrão e bind address | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L291) | 174-291 |
| Decisão real do `auth_mode=auto` (LAN -> all_except_health) | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L10-L29) | 10-29 |
| Estrutura de roteamento da página GUI (Dashboard/Accounts/API Proxy/Monitor/Token Stats/Settings) | [`src/App.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/App.tsx#L19-L48) | 19-48 |

**Valores padrão principais**:
- `ProxyConfig.port = 8045`: porta padrão do serviço de proxy reverso
- `ProxyConfig.allow_lan_access = false`: acesso apenas local por padrão
- `ProxyAuthMode::default() = off`: não requer autenticação por padrão

</details>
