---
title: "Estatísticas de Token: Monitoramento de Custo e Análise de Dados | Antigravity Manager"
sidebarTitle: "Veja quem é mais caro de relance"
subtitle: "Estatísticas de Token: Monitoramento de Custo e Análise de Dados"
description: "Aprenda como usar a funcionalidade de estatísticas Token Stats. Entenda como extrair dados de token de respostas, analisar uso por modelo e conta, e localizar os modelos e contas mais caros através de listas Top."
tags:
  - "Token Stats"
  - "custo"
  - "monitoramento"
  - "SQLite"
  - "estatísticas de uso"
prerequisite:
  - "start-proxy-and-first-client"
  - "advanced-model-router"
order: 7
---
# Token Stats: Métricas de Perspectiva de Custo e Interpretação de Gráficos

Você já conectou o cliente às Antigravity Tools, mas "quem está gastando dinheiro, onde está caro, ou se um modelo de repente disparou" geralmente é difícil de julgar por intuição. Esta aula faz apenas uma coisa: explicar claramente as métricas de dados na página Token Stats, e ensinar a usar gráficos para localizar rapidamente problemas de custo.

## O que você poderá fazer após concluir

- Dizer claramente de onde vêm os dados do Token Stats (quando serão gravados, em que circunstâncias estarão ausentes)
- Alternar janelas de observação por hora/dia/semana, evitando julgamento errado por "ver apenas um dia"
- Em duas visualizações "por modelo/por conta", usar gráficos de tendência para encontrar picos anormais
- Usar listas Top para travar os modelos/contas mais caros, depois voltar aos logs de solicitação para encontrar a causa raiz

## Seu dilema atual

- Você sente que chamadas ficaram mais caras, mas não sabe se o modelo mudou, a conta mudou, ou se um dia o volume de repente aumentou
- Você vê `X-Mapped-Model`, mas não tem certeza se a estatística é calculada por qual métrica de modelo
- O Token Stats ocasionalmente mostra 0 ou "sem dados", não sabe se é sem tráfego ou não foi estatizado

## Quando usar esta estratégia

- Você precisa fazer otimização de custo: primeiro quantifique "quem é mais caro"
- Você está solucionando problemas de limitação/anomalia súbita: use o ponto de tempo de pico para comparar com logs de solicitação
- Você fez mudanças de configuração em roteamento de modelo/governança de cota, e quer verificar se o custo caiu conforme esperado

## O que é Token Stats?

**Token Stats** é a página de estatísticas de uso local das Antigravity Tools: após o proxy encaminhar solicitações, tentará extrair o número de token de `usage/usageMetadata` no JSON de resposta ou dados de streaming, e gravará cada solicitação por conta e modelo no SQLite local (`token_stats.db`), e finalmente mostrará agregações por tempo/modelo/conta na UI.

::: info Primeiro esclareça um ponto fácil de tropeçar
A métrica de "modelo" do Token Stats vem do campo `model` em sua solicitação (ou parsing de caminho `/v1beta/models/<model>` do Gemini), não igual ao `X-Mapped-Model` após roteamento.
:::

## 🎒 Preparação antes de começar

- Você já completou uma chamada de proxy com sucesso (não parou em `/healthz` probe)
- Sua resposta upstream retornará campos de uso de token analisáveis (caso contrário, a estatística estará ausente)

::: tip Leitura recomendada conjunta
Se você está usando mapeamento de modelo para rotear `model` para outros modelos físicos, sugiro primeiro ver **[Roteamento de modelo: mapeamento personalizado, prioridade de curinga e estratégias predefinidas](/pt/lbjlaq/Antigravity-Manager/advanced/model-router/)**, depois voltar para "métricas de estatísticas" será mais intuitivo.
:::

## Ideia central

A cadeia de dados do Token Stats pode ser dividida em três segmentos:

1. Middleware de proxy tenta extrair uso de token da resposta (compatível com `usage`/`usageMetadata`, streaming também analisará)
2. Se ao mesmo tempo obtiver `account_email + input_tokens + output_tokens`, gravará no SQLite local (`token_stats.db`)
3. UI puxa dados agregados através de Tauri `invoke(get_token_stats_*)`, mostrando por hora/dia/semana

## Siga-me

### Passo 1: Primeiro, confirme que "você tem tráfego"

**Por que**
Estatísticas do Token Stats vêm de solicitações reais. Apenas iniciar o proxy mas nunca enviar uma solicitação de modelo, a página mostrará "sem dados".

Prática: Reutilize o método de chamada que você já verificou com sucesso em **[Iniciar proxy reverso local e conectar o primeiro cliente](/pt/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)**, envie 1-2 solicitações.

**Você deve ver**: A página Token Stats muda de "carregando/sem dados" para ter gráficos ou listas.

### Passo 2: Escolha a janela de tempo correta (hora/dia/semana)

**Por que**
O mesmo conjunto de dados em diferentes janelas mostra "pico/tendência" completamente diferente. As três janelas na UI também correspondem a diferentes intervalos de coleta de dados:

- Hora: últimas 24 horas
- Dia: últimos 7 dias
- Semana: últimas 4 semanas (visualização de tendência agregará nos últimos 30 dias)

**Você deve ver**: Após alternar, a granularidade do eixo X do gráfico de tendência muda (hora mostra "hora", dia mostra "mês/dia", semana mostra "ano-Wnúmero-semana").

### Passo 3: Primeiro veja a visão geral superior, determine a "escala de custo"

**Por que**
O cartão de visão geral pode primeiro responder a 3 perguntas: se o volume total é grande, se a proporção entrada/saída é anormal, se o número de contas/modelos participantes de repente aumentou.

Foque nestes itens:

- Total de Tokens (`total_tokens`)
- Tokens de Entrada/Saída (`total_input_tokens` / `total_output_tokens`)
- Número de contas ativas (`unique_accounts`)
- Número de modelos usados (UI usa diretamente o comprimento da "lista de estatísticas por modelo")

**Você deve ver**: Se o "número de contas ativas" de repente aumentar muito, geralmente significa que você rodou mais contas em pouco tempo (por exemplo, mudou para estratégia de rotação).

### Passo 4: Use "tendência de uso por modelo/por conta" para capturar picos anormais

**Por que**
O gráfico de tendência é o ponto de entrada mais adequado para capturar "de repente ficou caro". Você não precisa primeiro saber a causa, primeiro circule "que dia/qual hora disparou".

Prática:

1. No canto superior direito do gráfico de tendência, mude para「Por modelo / Por conta」
2. Passe o mouse (Tooltip) para ver o valor Top, priorize prestar atenção naquele que "de repente chegou ao primeiro lugar"

**Você deve ver**:

- Por modelo: um modelo subiu de repente em um período de tempo específico
- Por conta: uma conta subiu de repente em um período de tempo específico

### Passo 5: Use a lista Top para "travar o alvo mais caro"

**Por que**
O gráfico de tendência diz "quando anômalo", a lista Top diz "quem é mais caro". Cruzando os dois, você pode rapidamente delimitar o escopo de solução de problemas.

Prática:

- Na visualização「Por modelo」, veja a tabela "estatísticas detalhadas por modelo" com `total_tokens / request_count / proporção`
- Na visualização「Por conta」, veja a tabela "estatísticas detalhadas de conta" com `total_tokens / request_count`

**Você deve ver**: Os modelos/contas mais caros ficam na frente, e `request_count` pode ajudá-lo a distinguir "único particularmente caro" ou "muitos 特别多".

### Passo 6 (opcional): Encontre `token_stats.db`, faça backup/verificação

**Por que**
Quando você suspeita de "estatísticas ausentes" ou quer fazer análise offline, pegar o arquivo SQLite diretamente é mais confiável.

Prática: Entre na área Advanced de Settings, clique "Abrir diretório de dados", você encontrará `token_stats.db` no diretório de dados.

**Você deve ver**: Na lista de arquivos há `token_stats.db` (o nome do arquivo é codificado no backend).

## Ponto de verificação ✅

- Você pode explicar claramente que a estatística do Token Stats é "extraída do usage/usageMetadata da resposta e gravada no SQLite local", não faturamento na nuvem
- Você pode apontar um período de pico específico em duas visualizações de tendência "por modelo/por conta"
- Você pode dar uma conclusão de solução de problemas executável usando a lista Top: primeiro verificar qual modelo ou conta

## Avisos sobre armadilhas

| Fenômeno | Causa comum | O que você pode fazer |
|--- | --- | ---|
| Token Stats mostra "sem dados" | Você realmente não gerou solicitações de modelo; ou a resposta upstream não carrega campos de token analisáveis | Primeiro reutilize o cliente já verificado para enviar solicitações; depois veja se a resposta contém `usage/usageMetadata` |
| Estatísticas parecem erradas "por modelo" | Métricas estatísticas usam `model` da solicitação, não `X-Mapped-Model` | Trate roteamento de modelo como "solicitar modelo -> modelo mapeado"; estatísticas veem "modelo solicitado" |
| Dimensão de conta ausente | Só será gravado quando obtiver `X-Account-Email` e analisar uso de token | Confirme que a solicitação realmente chegou ao pool de contas; depois compare logs de solicitação/cabeçalhos de resposta |
| Dados estatísticos desviados ao ativar Proxy Monitor | Quando Proxy Monitor ativado, token de cada solicitação será gravado duas vezes | Este é um detalhe de implementação conhecido, não afeta análise de tendência relativa; se precisar de valor exato, pode desativar Monitor temporariamente e retestar |

## Resumo desta aula

- O valor central do Token Stats é "quantificar problemas de custo", primeiro localizar, depois otimizar
- Ao gravar estatísticas, conta e uso de token são obrigatórios; quando modelo ausente será gravado como `"unknown"` (não bloqueará gravação)
- Para fazer controle de custo mais refinado, geralmente o próximo passo é voltar ao roteamento de modelo ou governança de cota

## Próxima aula

> Na próxima aula, resolvemos "problemas de estabilidade ocultos" em sessões longas: **[Estabilidade de sessão longa: compressão de contexto, cache de assinatura e compressão de resultados de ferramenta](/pt/lbjlaq/Antigravity-Manager/advanced/context-compression/)**.

Você aprenderá:

- O que as três camadas de compressão progressiva de contexto fazem respectivamente
- Por que "cache de assinatura" pode reduzir erros de assinatura 400
- O que a compressão de resultados de ferramenta deletará, o que manterá

---

## Apêndice: Referências de código-fonte

<details>
<summary><strong>Clique para expandir e ver localizações do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Funcionalidade | Caminho do arquivo | Número da linha |
|--- | --- | ---|
|--- | --- | ---|
| UI do Token Stats: janela de tempo/alternância de visualização e coleta de dados | [`src/pages/TokenStats.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/TokenStats.tsx#L49-L166) | 49-166 |
| UI do Token Stats: prompt de dados vazios ("sem dados") | [`src/pages/TokenStats.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/TokenStats.tsx#L458-L507) | 458-507 |
| Extração de uso de Token: analisar model da solicitação, analisar usage/usageMetadata da resposta | [`src-tauri/src/proxy/middleware/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/monitor.rs#L32-L120) | 32-120 |
| Extração de uso de Token: analisar campo usage de resposta de streaming/JSON | [`src-tauri/src/proxy/middleware/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/monitor.rs#L122-L336) | 122-336 |
| Ponto de gravação de Token Stats: gravar no SQLite após obter conta+token | [`src-tauri/src/proxy/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/monitor.rs#L79-L136) | 79-136 |
| Nome do arquivo de banco de dados e estrutura da tabela: `token_stats.db` / `token_usage` / `token_stats_hourly` | [`src-tauri/src/modules/token_stats.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/token_stats.rs#L58-L126) | 58-126 |
| Lógica de gravação: `record_usage(account_email, model, input, output)` | [`src-tauri/src/modules/token_stats.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/token_stats.rs#L128-L159) | 128-159 |
| Lógica de consulta: hora/dia/semana, por conta/por modelo, tendência e visão geral | [`src-tauri/src/modules/token_stats.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/token_stats.rs#L161-L555) | 161-555 |
| Comandos Tauri: `get_token_stats_*` expostos para frontend | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L791-L847) | 791-847 |
| Ao iniciar aplicativo, inicializar banco de dados do Token Stats | [`src-tauri/src/lib.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/lib.rs#L50-L56) | 50-56 |
| Página de Configurações: obter/abrir diretório de dados (para encontrar `token_stats.db`) | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L76-L143) | 76-143 |

</details>
