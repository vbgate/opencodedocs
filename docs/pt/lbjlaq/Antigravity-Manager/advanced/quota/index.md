---
title: "Governança de Cota: Proteção de Cota e Preaquecimento | Antigravity-Manager"
subtitle: "Governança de Cota: Proteção de Cota e Preaquecimento | Antigravity-Manager"
sidebarTitle: "Proteja sua cota de modelos"
description: "Aprenda o mecanismo de governança de cota do Antigravity-Manager. Use Proteção de Cota para proteger modelos por limite, Smart Warmup para preaquecimento automático, suporta verificação agendada e controle de resfriamento."
tags:
  - "quota"
  - "warmup"
  - "accounts"
  - "proxy"
prerequisite:
  - "start-add-account"
  - "start-proxy-and-first-client"
order: 5
---

# Governança de Cota: Estratégia Combinada de Proteção de Cota + Smart Warmup

Você está rodando proxies com as Antigravity Tools de forma estável, mas a maior preocupação é uma coisa: a cota do seu modelo principal sendo "silenciosamente consumida", e quando você realmente precisa usar, descobre que já está muito baixa para funcionar.

Esta aula foca em **Governança de Cota**: use Proteção de Cota para manter modelos importantes reservados; use Smart Warmup para fazer um "preaquecimento leve" quando a cota for totalmente restaurada, reduzindo falhas temporárias.

## O que é Governança de Cota?

**Governança de Cota** refere-se ao uso de dois mecanismos vinculados nas Antigravity Tools para controlar "como a cota é gasta": quando a cota restante de um modelo cair abaixo de um limite, a Proteção de Cota adicionará esse modelo ao `protected_models` da conta e priorizará evitá-lo ao solicitar esse modelo; quando a cota retornar a 100%, o Smart Warmup disparará uma solicitação de preaquecimento de fluxo muito baixo e usará um arquivo histórico local para um resfriamento de 4 horas.

## O que você poderá fazer após concluir

- Ativar a Proteção de Cota para que contas com baixa cota automaticamente "cedam caminho", reservando modelos de alto valor para solicitações importantes
- Ativar o Smart Warmup para preaquecimento automático quando a cota for totalmente restaurada (e entender como o resfriamento de 4 horas afeta a frequência de disparo)
- Entender onde os campos `quota_protection` / `scheduled_warmup` / `protected_models` entram em vigor, respectivamente
- Saber quais nomes de modelos serão normalizados em "grupos de proteção" (e quais não)

## Seu dilema atual

- Você acha que está "rotacionando contas", mas na verdade continua consumindo o mesmo tipo de modelo de alto valor o tempo todo
- Você só descobre que a cota está baixa quando é tarde demais, ou até mesmo o Claude Code/cliente está consumindo a cota em segundo plano via warmup
- Você ativou o preaquecimento, mas não sabe exatamente quando ele dispara, se há resfriamento, ou se afeta a cota

## Quando usar esta estratégia

- Você tem múltiplos pools de contas e quer que modelos importantes ainda tenham recursos em "momentos críticos"
- Você não quer monitorar manualmente o tempo de restauração da cota e quer que o sistema faça automaticamente uma "verificação leve após a restauração"

## 🎒 Preparação antes de começar

::: warning Pré-requisitos
Esta aula assume que você já pode:

- Ver a lista de contas na página **Accounts** e atualizar manualmente as cotas
- Já iniciou o proxy reverso local (pelo menos acessar `/healthz`)

Se ainda não funcionou, primeiro veja **[Iniciar proxy reverso local e conectar o primeiro cliente](/pt/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)**.
:::

Além disso, o Smart Warmup gravará um arquivo histórico local `warmup_history.json`. Ele fica no diretório de dados, e a localização do diretório de dados e método de backup podem ser vistos primeiro em **[Primeira execução: diretório de dados, logs, bandeja e inicialização automática](/pt/lbjlaq/Antigravity-Manager/start/first-run-data/)**.

## Ideia central

Por trás desta "estratégia combinada" há uma abordagem simples:

- A Proteção de Cota é responsável por "não desperdiçar mais": quando um modelo fica abaixo do limite, ele é marcado como protegido, e ao solicitar esse modelo, prioriza-se evitá-lo (nível de modelo, não desativação total da conta).
- O Smart Warmup é responsável por "verificar quando a cota é totalmente restaurada": quando o modelo retorna a 100%, dispara uma solicitação leve, confirmando que o link está disponível, e usa 4 horas de resfriamento para evitar perturbações repetidas.

Os campos de configuração correspondentes estão todos no `AppConfig` do frontend:

- `quota_protection.enabled / threshold_percentage / monitored_models` (ver `src/types/config.ts`)
- `scheduled_warmup.enabled / monitored_models` (ver `src/types/config.ts`)

E a lógica que realmente decide "se deve pular esta conta ao solicitar este modelo" está no TokenManager do backend:

- O `protected_models` do arquivo da conta participará da filtragem em `get_token(..., target_model)` (ver `src-tauri/src/proxy/token_manager.rs`)
- O `target_model` será normalizado primeiro (`normalize_to_standard_id`), então variantes como `claude-sonnet-4-5-thinking` serão agrupadas no mesmo "grupo de proteção" (ver `src-tauri/src/proxy/common/model_mapping.rs`)

## Próxima aula

> Na próxima aula, aprenderemos **[Proxy Monitor: logs de solicitação, filtragem, restauração de detalhes e exportação](/pt/lbjlaq/Antigravity-Manager/advanced/monitoring/)**, transformando as chamadas de caixa preta em uma cadeia de evidências revisitável.

## Siga-me

### Passo 1: Primeiro, obtenha as cotas atualizadas

**Por que**
A Proteção de Cota é baseada no `quota.models[].percentage` da conta. Se você não tiver as cotas atualizadas, a lógica de proteção não fará nada por você.

Caminho de operação: Abra a página **Accounts**, clique no botão de atualização na barra de ferramentas (única conta ou todas, qualquer um serve).

**Você deve ver**: As porcentagens de cota dos modelos (por exemplo, 0-100) e o tempo de reset aparecerem nas linhas da conta.

### Passo 2: Ative o Smart Warmup em Settings (opcional, mas recomendado)

**Por que**
O objetivo do Smart Warmup não é "economizar cota", mas "auto-verificar o link quando a cota for totalmente restaurada". Ele só dispara quando a cota do modelo atinge 100%, e há um resfriamento de 4 horas.

Caminho de operação: Entre em **Settings**, vá para a área de configurações relacionadas à conta, ative o interruptor **Smart Warmup**, marque os modelos que deseja monitorar.

Não esqueça de salvar as configurações.

**Você deve ver**: O Smart Warmup se expande mostrando uma lista de modelos; pelo menos 1 modelo deve permanecer marcado.

### Passo 3: Ative a Proteção de Cota e defina o limite e modelos monitorados

**Por que**
A Proteção de Cota é o núcleo do "reservar recursos": quando a porcentagem de cota dos modelos monitorados `<= threshold_percentage`, esse modelo será gravado no `protected_models` do arquivo da conta, e solicitações subsequentes desse modelo priorizarão evitar este tipo de conta.

Caminho de operação: Em **Settings**, ative **Quota Protection**.

1. Defina o limite (`1-99`)
2. Marque os modelos que deseja monitorar (pelo menos 1)

::: tip Uma configuração inicial muito útil
Se você não quer pensar muito, comece com o padrão `threshold_percentage=10` (ver `src/pages/Settings.tsx`).
:::

**Você deve ver**: Pelo menos 1 modelo deve permanecer marcado na Proteção de Cota (a UI bloqueará você de desmarcar o último).

### Passo 4: Confirme que a "normalização do grupo de proteção" não vai te pegar de surpresa

**Por que**
Quando o TokenManager faz o julgamento de proteção de cota, primeiro normalizará o `target_model` em um ID padrão (`normalize_to_standard_id`). Por exemplo, `claude-sonnet-4-5-thinking` será normalizado para `claude-sonnet-4-5`.

Isso significa que:

- Você marca `claude-sonnet-4-5` na Proteção de Cota
- Quando você realmente solicita `claude-sonnet-4-5-thinking`

Ainda assim acionará a proteção (pois pertencem ao mesmo grupo).

**Você deve ver**: Quando o `protected_models` de uma conta contém `claude-sonnet-4-5`, solicitações para `claude-sonnet-4-5-thinking` priorizarão evitar essa conta.

### Passo 5: Quando precisar verificar imediatamente, use "preaquecimento manual" para disparar um warmup

**Por que**
O ciclo de varredura do Smart Warmup agendado é a cada 10 minutos (ver `src-tauri/src/modules/scheduler.rs`). Se você quer verificar o link imediatamente, o preaquecimento manual é mais direto.

Caminho de operação: Abra a página **Accounts**, clique no botão "preaquecimento" na barra de ferramentas:

- Sem selecionar contas: dispara preaquecimento total (chama `warm_up_all_accounts`)
- Com contas selecionadas: dispara preaquecimento para cada conta selecionada (chama `warm_up_account`)

**Você deve ver**: Um toast aparece, com conteúdo da string retornada pelo backend (por exemplo, "Warmup task triggered ...").

## Ponto de verificação ✅

- Você pode ver as porcentagens de cota do modelo de cada conta na página Accounts (provando que a cadeia de dados de cota está OK)
- Você pode ativar Quota Protection / Smart Warmup em Settings e salvar a configuração com sucesso
- Você entende que `protected_models` é uma restrição de "nível de modelo": uma conta pode ser evitada apenas para alguns modelos
- Você sabe que o warmup tem um resfriamento de 4 horas: repetir cliques de preaquecimento em pouco tempo pode ver avisos relacionados a "skipped/cooldown"

## Avisos sobre armadilhas

### 1) Você ativou a Proteção de Cota, mas nunca entrou em vigor

A razão mais comum é: a conta não tem dados de `quota`. A lógica de proteção no backend precisa ler `quota.models[]` primeiro para julgar o limite (ver `src-tauri/src/proxy/token_manager.rs`).

Você pode voltar ao **Passo 1** e atualizar as cotas primeiro.

### 2) Por que apenas alguns modelos são tratados como "grupos de proteção"?

A normalização do `target_model` pelo TokenManager é de "lista de permissões": apenas nomes de modelos explicitamente listados serão mapeados para IDs padrão (ver `src-tauri/src/proxy/common/model_mapping.rs`).

A lógica após normalização é: usar o nome normalizado (ID padrão ou nome de modelo original) para corresponder ao campo `protected_models` da conta. Se a correspondência for bem-sucedida, a conta será pulada (ver `src-tauri/src/proxy/token_manager.rs:555-560, 716-719`). Isso significa:

- Modelos na lista de permissões (como `claude-sonnet-4-5-thinking`) serão normalizados para o ID padrão (`claude-sonnet-4-5`), depois julgados se estão em `protected_models`
- Quando a normalização falha para modelos fora da lista de permissões, volta ao nome do modelo original, ainda correspondendo a `protected_models`

Em outras palavras, o julgamento de proteção de cota se aplica a "todos os nomes de modelo", apenas que modelos na lista de permissões são normalizados primeiro.

### 3) Por que o preaquecimento manual/agendado precisa do proxy rodando?

As solicitações de preaquecimento chegarão ao endpoint interno do proxy local: `POST /internal/warmup` (ver rotas em `src-tauri/src/proxy/server.rs`, e implementação em `src-tauri/src/proxy/handlers/warmup.rs`). Se você não iniciar o serviço de proxy, o warmup falhará.

Além disso, a porta chamada pelo preaquecimento vem da configuração: `proxy.port` (se a leitura da configuração falhar, voltará para `8045`, ver `src-tauri/src/modules/quota.rs`).

## Resumo desta aula

- A Proteção de Cota faz "limitar perdas": abaixo do limite, grava o modelo em `protected_models`, priorizando evitá-lo ao solicitar esse modelo
- O Smart Warmup faz "auto-verificar quando totalmente restaurado": só dispara em 100%, varre a cada 10 minutos, 4 horas de resfriamento
- Ambos dependem da cadeia de "atualização de cota": primeiro ter `quota.models[]`, depois a governança tem base

## Próxima aula

A governança de cota resolve "como gastar de forma mais estável". A próxima aula sugere ver o Proxy Monitor, transformando logs de solicitação, correspondência de conta, mapeamento de modelo em uma cadeia de evidências revisitável.

---

## Apêndice: Referências de código-fonte

<details>
<summary><strong>Clique para expandir e ver localizações do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Funcionalidade | Caminho do arquivo | Número da linha |
| --- | --- | --- |
| UI de Proteção de Cota (limite, seleção de modelo, manter pelo menos 1) | [`src/components/settings/QuotaProtection.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/settings/QuotaProtection.tsx#L13-L168) | 13-168 |
| UI de Smart Warmup (ativado por padrão, manter pelo menos 1) | [`src/components/settings/SmartWarmup.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/settings/SmartWarmup.tsx#L14-L120) | 14-120 |
| Campos de configuração de governança de cota (`quota_protection` / `scheduled_warmup`) | [`src/types/config.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/types/config.ts#L54-L94) | 54-94 |
| Limite padrão e configuração padrão (`threshold_percentage: 10`) | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L20-L51) | 20-51 |
| Gravar/recuperar `protected_models` (julgamento de limite e gravação em disco) | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L254-L467) | 254-467 |
| Filtragem de proteção de cota no lado da solicitação (`get_token(..., target_model)`) | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L470-L674) | 470-674 |
| Normalização do grupo de proteção (`normalize_to_standard_id`) | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L230-L254) | 230-254 |
| Varredura agendada do Smart Warmup (a cada 10 minutos + 4 horas de resfriamento + `warmup_history.json`) | [`src-tauri/src/modules/scheduler.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/scheduler.rs#L11-L221) | 11-221 |
| Comandos de preaquecimento manual (`warm_up_all_accounts` / `warm_up_account`) | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L167-L212) | 167-212 |
| Implementação de preaquecimento (chama endpoint interno `/internal/warmup`) | [`src-tauri/src/modules/quota.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/quota.rs#L271-L512) | 271-512 |
| Implementação do endpoint de preaquecimento interno (construir solicitação + chamar upstream) | [`src-tauri/src/proxy/handlers/warmup.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/warmup.rs#L3-L220) | 3-220 |

</details>
