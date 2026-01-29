---
title: "Monitoramento e Solução de Problemas: Análise de Logs de Solicitação | Antigravity-Manager"
sidebarTitle: "Verificação de erros de log de solicitação"
subtitle: "Monitoramento e Solução de Problemas: Análise de Logs de Solicitação"
description: "Aprenda o monitoramento e solução de problemas do Proxy Monitor nas Antigravity Tools. Por meio de logs de solicitação, filtragem e recursos de restauração de detalhes, localize problemas de erro 401/429/5xx e interrupções de streaming."
tags:
  - "avançado"
  - "monitoramento"
  - "solução de problemas"
  - "Proxy"
  - "logs"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-first-run-data"
  - "advanced-config"
order: 6
---

# Proxy Monitor: Logs de Solicitação, Filtragem, Restauração de Detalhes e Exportação

Você já iniciou o proxy reverso local, mas assim que aparecem 401/429/500, interrupções de streaming, ou "de repente mudou de conta/modelo", a solução de problemas facilmente se torna cega.

Esta aula foca em apenas uma coisa: usar o **Proxy Monitor** para restaurar cada chamada em "evidências revisitáveis", permitindo que você saiba de onde a solicitação veio, para qual endpoint foi, qual conta foi usada, se o modelo foi mapeado, e aproximadamente quanto Token foi consumido.

## O que você poderá fazer após concluir

- Abrir/pausar a gravação na página `/monitor` e entender se isso afetará o Token Stats
- Usar caixa de busca, filtragem rápida e filtragem de conta para localizar rapidamente um registro de solicitação
- No popup de detalhes, ver e copiar payloads de Request/Response para analisar falhas
- Saber onde o Proxy Monitor grava dados (`proxy_logs.db`) e o comportamento de limpeza
- Entender a capacidade real atual de "exportar logs" (GUI vs comando de backend)

## Seu dilema atual

- Você só vê "falha na chamada/timeout", mas não sabe se a falha foi no upstream, no proxy ou na configuração do cliente
- Você suspeita que acionou o mapeamento de modelo ou rotação de conta, mas não tem cadeia de evidências
- Você quer revisitar o payload completo de uma solicitação (especialmente streaming/Thinking), mas não vê nos logs

## Quando usar esta estratégia

- Você precisa solucionar problemas: falha de autenticação 401, limitação de taxa 429, erro upstream 5xx, interrupção de streaming
- Você quer confirmar: qual conta foi realmente usada em uma solicitação específica (`X-Account-Email`)
- Você está trabalhando em estratégias de roteamento de modelo e quer verificar "nome do modelo do cliente -> nome do modelo mapeado"

## 🎒 Preparação antes de começar

::: warning Pré-requisitos
O Proxy Monitor registra "solicitações recebidas pelo serviço de proxy reverso". Então você precisa primeiro ter funcionado:

- Serviço de proxy reverso iniciado e capaz de acessar `/healthz`
- Você sabe a URL base e porta do proxy reverso atual

Se ainda não funcionou, primeiro veja **[Iniciar proxy reverso local e conectar o primeiro cliente](/pt/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)**.
:::

## O que é Proxy Monitor?

**Proxy Monitor** é o "painel de logs de solicitação" integrado nas Antigravity Tools. Cada vez que uma solicitação entra no proxy reverso local, ele registra hora, caminho, código de status, duração, modelo e protocolo, e tenta extrair o uso de Token da resposta; você também pode clicar em um único registro para ver os payloads de solicitação e resposta, usando-o para analisar causas de falha e resultados de seleção de rota/conta.

::: info Local de gravação de dados
Os logs do Proxy Monitor são gravados no SQLite no diretório de dados: `proxy_logs.db`. Como encontrar o diretório de dados e como fazer backup, sugiro revisar primeiro **[Primeira execução: diretório de dados, logs, bandeja e inicialização automática](/pt/lbjlaq/Antigravity-Manager/start/first-run-data/)**.
:::

## Ideia central: 6 campos que você precisa monitorar

Em um registro do Proxy Monitor (struct do backend `ProxyRequestLog`), os mais úteis são estes campos:

| Campo | Com que pergunta você o usa |
| --- | --- |
| `status` | Esta solicitação foi bem-sucedida ou falhou (200-399 vs outros) |
| `url` / `method` | Qual endpoint você realmente atingiu (por exemplo `/v1/messages`, `/v1/chat/completions`) |
| `protocol` | É qual protocolo: OpenAI / Claude(Anthropic) / Gemini |
| `account_email` | Qual conta esta solicitação finalmente usou (do cabeçalho de resposta `X-Account-Email`) |
| `model` / `mapped_model` | O nome do modelo solicitado pelo cliente foi "roteado/mapeado" para outro modelo |
| `input_tokens` / `output_tokens` | Uso de Token desta solicitação (só se puder extrair) |

::: tip Primeiro use "resumo", então clique "detalhes" quando necessário
A página da lista só mostra resumo (sem corpo request/response), clicar em um registro carregará detalhes completos do backend, evitando carregar muitos campos grandes de uma vez.
:::

## Siga-me: Use uma chamada para completar o "ciclo de monitoramento"

### Passo 1: Primeiro, crie uma solicitação que "você tem certeza que aparecerá"

**Por que**
O Proxy Monitor só registra solicitações recebidas pelo serviço de proxy reverso. Primeiro use a solicitação mais simples para verificar se há registro, depois fale de filtragem e detalhes.

::: code-group

```bash [macOS/Linux]
## 1) Verificação de vivacidade (endpoint que certamente existe)
curl "http://127.0.0.1:PORT/healthz"

## 2) Solicite models novamente (se você ativou autenticação, lembre-se de adicionar header)
curl "http://127.0.0.1:PORT/v1/models"
```

```powershell [Windows]
## 1) Verificação de vivacidade (endpoint que certamente existe)
curl "http://127.0.0.1:PORT/healthz"

## 2) Solicite models novamente (se você ativou autenticação, lembre-se de adicionar header)
curl "http://127.0.0.1:PORT/v1/models"
```

:::

**Você deve ver**: O terminal retorna `{"status":"ok"}` (ou JSON similar), e a resposta de `/v1/models` (sucesso ou 401 está ok).

### Passo 2: Abra a página Monitor e confirme o "status de gravação"

**Por que**
O Proxy Monitor tem interruptor "gravar/pausar". Você precisa primeiro confirmar o estado atual, caso contrário você pode estar solicitando o tempo todo, mas a lista estará sempre vazia.

Nas Antigravity Tools, abra o **Painel de Monitoramento de API** na barra lateral (rota `/monitor`).

Haverá um botão com ponto na parte superior da página:

```
┌───────────────────────────────────────────┐
│  ● Gravando  [Caixa de busca]  [Atualizar] [Limpar]      │
└───────────────────────────────────────────┘
```

Se você vê "Pausado", clique uma vez para mudar para "Gravando".

**Você deve ver**: O status do botão muda para "Gravando"; registros de solicitação anteriores começam a aparecer na lista.

### Passo 3: Use "busca + filtragem rápida" para localizar um registro

**Por que**
Na solução de problemas real, geralmente você só lembra um fragmento: há `messages` no caminho, ou o código de status é `401`, ou há `gemini` no nome do modelo. A caixa de busca é projetada para esse tipo de memória.

A busca do Proxy Monitor usará sua entrada como uma "palavra-chave aproximada", correspondendo no backend com SQL `LIKE` nestes campos:

- `url`
- `method`
- `model`
- `status`
- `account_email`

Você pode tentar algumas palavras-chave típicas:

- `healthz`
- `models`
- `401` (se você criou um 401)

Também pode clicar no botão "filtragem rápida": **Apenas erros / Chat / Gemini / Claude / Geração de imagem**.

**Você deve ver**: A lista só contém o tipo de solicitação que você esperava.

### Passo 4: Clique em detalhes para restaurar "payload de solicitação + payload de resposta"

**Por que**
A lista é suficiente para responder "o que aconteceu". Para responder "por que", geralmente você precisa ver o payload completo de solicitação/resposta.

Clique em qualquer registro, uma janela de detalhes aparecerá. Você pode focar em verificar:

- `protocolo` (OpenAI/Claude/Gemini)
- `modelo usado` e `modelo mapeado`
- `conta usada`
- `consumo de Token (entrada/saída)`

Depois use botões para copiar:

- `payload de solicitação (Request)`
- `payload de resposta (Response)`

**Você deve ver**: Há dois blocos de JSON (ou texto) na visualização de detalhes; após copiar, você pode colar em tickets/notas para análise.

### Passo 5: Quando você precisa "recriar do zero", limpe os logs

**Por que**
Na solução de problemas, o pior é "dados antigos interferindo no julgamento". Limpe e recrie uma vez, sucesso/falha ficará muito claro.

Clique no botão "Limpar" na parte superior, uma caixa de confirmação aparecerá.

::: danger Esta é uma operação irreversível
Limpar excluirá todos os registros em `proxy_logs.db`.
:::

**Você deve ver**: Após confirmação, a lista fica vazia, os números estatísticos voltam a 0.

## Ponto de verificação ✅

- [ ] Você pode ver registros de `/healthz` ou `/v1/models` que você acabou de enviar em `/monitor`
- [ ] Você pode filtrar um registro específico usando a caixa de busca (por exemplo, digite `healthz`)
- [ ] Você pode clicar em um registro para ver payloads de solicitação/resposta e copiá-los
- [ ] Você sabe que limpar logs excluirá todos os registros históricos

## Avisos sobre armadilhas

| Cenário | Você pode entender (❌) | Comportamento real (✓) |
| --- | --- | --- |
| "Pausado" = nenhum custo de monitoramento | Acredita que após pausar, solicitações não serão analisadas | Pausar só afeta "se grava ou não logs do Proxy Monitor". Mas análise de solicitação/resposta (incluindo análise SSE de dados de streaming) ainda ocorrerá, apenas dados analisados não serão salvos. Token Stats ainda gravará (independentemente do monitor estar ativado). |
| Logs binários/grandes ficam vazios | Acredita que monitoramento quebrou | Solicitações/respostas binárias mostrarão como `[Binary Request Data]` / `[Binary Response Data]`. Corpos de resposta acima de 100MB serão marcados como `[Response too large (>100MB)]`; corpos de solicitação acima do limite não serão gravados. |
| Quer usar Monitor para encontrar "quem iniciou a solicitação" | Acredita que pode rastrear até o processo do cliente | O Monitor registra informações na camada HTTP (método/caminho/modelo/conta), não contém "nome do processo solicitante". Você precisa combinar logs do próprio cliente ou captura de pacotes de rede do sistema para localizar a fonte. |
| Dados de Token Stats anormais quando monitor ativado | Acredita que é erro estatístico | Quando monitor ativado, Token Stats pode ser gravado duas vezes (uma no início da função de monitoramento, uma ao gravar assincronamente no banco de dados). Este é o comportamento do código-fonte da versão atual. |

## Exportação e retenção a longo prazo: primeiro esclareça os limites de capacidade

### 1) O que pode ser feito na GUI atualmente

Na UI do Monitor da versão atual (`ProxyMonitor.tsx`), você pode:

- Buscar/filtrar/navegar paginado
- Clicar em detalhes para ver e copiar payload
- Limpar todos os logs

Mas **não há "botão de exportação"** (a fonte não vê nenhuma UI relacionada).

### 2) Que capacidade de exportação o backend já tem (adequado para desenvolvimento secundário)

O comando Tauri do backend fornece dois métodos de exportação:

- `export_proxy_logs(file_path)`: exporta "todos os logs" do banco de dados para arquivo JSON
- `export_proxy_logs_json(file_path, json_data)`: grava o array JSON que você passou formatado em arquivo (requer que a entrada seja formato de array)

Se você quer desenvolver secundariamente a GUI, ou escrever seu próprio script de chamada, pode reutilizar diretamente esses comandos.

### 3) O "export" mais simples: backup direto de `proxy_logs.db`

Como o Proxy Monitor é essencialmente SQLite, você também pode tratar `proxy_logs.db` como "pacote de evidências de solução de problemas" e fazer backup junto (por exemplo, junto com `token_stats.db`). Localização do diretório de dados veja **[Primeira execução](/pt/lbjlaq/Antigravity-Manager/start/first-run-data/)**.

## Leitura recomendada

- Quer entender mapeamento de modelo: **[Roteamento de modelo: mapeamento personalizado, prioridade de curinga e estratégias predefinidas](/pt/lbjlaq/Antigravity-Manager/advanced/model-router/)**
- Quer solucionar problemas de autenticação: **[401/Falha de autenticação: auth_mode, compatibilidade de Header e lista de configuração de cliente](/pt/lbjlaq/Antigravity-Manager/faq/auth-401/)**
- Quer combinar Monitor com estatísticas de custo: a próxima seção abordará Token Stats (`token_stats.db`)

## Resumo desta aula

- O valor do Proxy Monitor é "revisitável": registra código de status/caminho/protocolo/conta/mapeamento de modelo/uso de Token, e fornece detalhes de solicitação
- Busca e filtragem rápida são pontos de entrada para solução de problemas: primeiro缩小范围, depois clique em detalhes para ver payload
- Limpar logs é irreversível; exportar atualmente tende mais a "capacidade de desenvolvimento secundário" e "arquivo de banco de dados"

## Próxima aula

> Na próxima aula, aprenderemos **[Token Stats: métricas de perspectiva de custo e interpretação de gráficos](/pt/lbjlaq/Antigravity-Manager/advanced/token-stats/)**, transformando "sensação de caro" em otimização quantificável.

---

## Apêndice: Referências de código-fonte

<details>
<summary><strong>Clique para expandir e ver localizações do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Funcionalidade | Caminho do arquivo | Número da linha |
| --- | --- | --- |
| Entrada da página Monitor (montando ProxyMonitor) | [`src/pages/Monitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Monitor.tsx#L1-L12) | 1-12 |
| UI do Monitor: tabela/filtragem/popup de detalhes | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L13-L713) | 13-713 |
| UI: ler configuração e sincronizar enable_logging | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L174-L243) | 174-243 |
| UI: alternar gravação (gravar config + set_proxy_monitor_enabled) | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L254-L267) | 254-267 |
| UI: listener de eventos em tempo real (proxy://request) e desduplicação | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L273-L355) | 273-355 |
| UI: limpar logs (clear_proxy_logs) | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L389-L403) | 389-403 |
| UI: carregar detalhes únicos (get_proxy_log_detail) | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L505-L519) | 505-519 |
| Middleware de monitoramento: capturar solicitação/resposta, analisar token, gravar monitor | [`src-tauri/src/proxy/middleware/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/monitor.rs#L13-L337) | 13-337 |
| ProxyMonitor: interruptor habilitado, gravar DB, enviar evento | [`src-tauri/src/proxy/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/monitor.rs#L33-L194) | 33-194 |
| Servidor montando middleware de monitoramento (layer) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L183-L194) | 183-194 |
| Comandos Tauri: get/count/filter/detail/clear/export | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L180-L314) | 180-314 |
| SQLite: caminho proxy_logs.db, estrutura de tabela e SQL de filtragem | [`src-tauri/src/modules/proxy_db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/proxy_db.rs#L1-L416) | 1-416 |
| Documentação de design de monitoramento (pode diferir da implementação, prevalece o código-fonte) | [`docs/proxy-monitor-technical.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy-monitor-technical.md#L1-L53) | 1-53 |

**Constantes-chave**:
- `MAX_REQUEST_LOG_SIZE = 100 * 1024 * 1024`: corpo de solicitação máximo que middleware de monitoramento pode ler (falhará se exceder)
- `MAX_RESPONSE_LOG_SIZE = 100 * 1024 * 1024`: corpo de resposta máximo que middleware de monitoramento pode ler (usado para grandes respostas como imagens)

**Funções/comandos-chave**:
- `monitor_middleware(...)`: coletar solicitação e resposta na camada HTTP e chamar `monitor.log_request(...)`
- `ProxyMonitor::log_request(...)`: gravar memória + SQLite, e推送 resumo através de evento `proxy://request`
- `get_proxy_logs_count_filtered(filter, errors_only)` / `get_proxy_logs_filtered(...)`: filtragem e paginação da página de lista
- `get_proxy_log_detail(log_id)`: carregar corpo completo de request/response de log único
- `export_proxy_logs(file_path)`: exportar todos os logs para arquivo JSON (botão UI não exposto atualmente)

</details>
