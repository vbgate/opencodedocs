---
title: "Compressão de Contexto: Estabilizar Sessões Longas | Antigravity-Manager"
sidebarTitle: "Sessões longas não quebram"
subtitle: "Compressão de Contexto: Estabilizar Sessões Longas"
description: "Aprenda o mecanismo de compressão de contexto em três camadas do Antigravity. Reduza erros 400 e falhas por Prompt muito longo através de cortes de rodadas de ferramenta, compressão de Thinking e cache de assinatura."
tags:
  - "compressão de contexto"
  - "cache de assinatura"
  - "Thinking"
  - "Tool Result"
  - "estabilidade"
prerequisite:
  - "start-proxy-and-first-client"
  - "advanced-monitoring"
order: 8
---

# Estabilidade de Sessão Longa: Compressão de Contexto, Cache de Assinatura e Compressão de Resultados de Ferramenta

Você está rodando sessões longas com clientes como Claude Code / Cherry Studio, o mais chato não é que o modelo não seja inteligente o suficiente, mas que de repente começa a reportar erros na conversa: `Prompt is too long`, erro de assinatura 400, cadeia de chamadas de ferramenta quebrada, ou loop de ferramenta ficando cada vez mais lento.

Esta aula explica claramente três coisas que o Antigravity Tools faz para esses problemas: compressão de contexto (três camadas progressivas intervenção), cache de assinatura (conectar a cadeia de assinatura do Thinking), compressão de resultados de ferramenta (evitar que saídas de ferramenta estourem o contexto).

## O que você poderá fazer após concluir

- Explicar claramente o que as três camadas de compressão progressiva de contexto fazem respectivamente, quais são os custos
- Saber o que o cache de assinatura armazena (três camadas Tool/Family/Session) e o impacto do TTL de 2 horas
- Entender as regras de compressão de resultados de ferramenta: quando deletará imagens base64, quando transformará snapshots de navegador em resumo cabeça+cauda
- Quando necessário, pode ajustar o ponto de disparo de compressão através de interruptores de limite em `proxy.experimental`

## Seu dilema atual

- De repente começam erros 400 após conversas longas: parece que assinatura expirou, mas você não sabe de onde a assinatura veio, onde foi perdida
- Chamadas de ferramenta cada vez mais, histórico tool_result empilado até o upstream recusar diretamente (ou ficar extremamente lento)
- Você quer usar compressão para resgatar, mas preocupado que quebre Prompt Cache, afete consistência ou faça o modelo perder informações

## Quando usar esta estratégia

- Você está rodando tarefas de ferramenta de cadeia longa (busca/ler arquivo/snapshot de navegador/loop multi-rodada de ferramenta)
- Você está usando modelos Thinking para raciocínio complexo, e sessões frequentemente excedem dezenas de rodadas
- Você está solucionando problemas de estabilidade que podem ser reproduzidos no cliente mas você não consegue explicar o porquê

## O que é compressão de contexto

**Compressão de contexto** é quando o proxy detecta que a pressão do contexto é muito alta, faz redução de ruído e emagrecimento automático no histórico de mensagens: primeiro corta rodadas de ferramenta antigas, depois comprime texto Thinking antigo em espaço reservado mas mantém assinatura, e finalmente em casos extremos gera resumo XML e Fork uma nova sessão para continuar a conversa, reduzindo falhas causadas por `Prompt is too long` e quebra de cadeia de assinatura.

::: info Como a pressão de contexto é calculada?
O processador Claude usará `ContextManager::estimate_token_usage()` para uma estimativa leve, e calibra com `estimation_calibrator`, depois usa `usage_ratio = estimated_usage / context_limit` para obter a porcentagem de pressão (logs imprimirão valores raw/calibrados).
:::

## 🎒 Preparação antes de começar

- Você já rodou o proxy local com sucesso, e o cliente realmente está percorrendo o caminho `/v1/messages` (ver iniciar proxy reverso local e conectar o primeiro cliente)
- Você pode ver logs de proxy (depuração de desenvolvedor ou arquivo de log local). O plano de teste no repositório fornece um caminho de exemplo de log e método grep (ver `docs/testing/context_compression_test_plan.md`)

::: tip Melhor localização com Proxy Monitor
Se você quer alinhar disparo de compressão com que tipo de solicitação/qual conta/qual rodada de ferramenta, sugiro manter o Proxy Monitor aberto ao mesmo tempo.
:::

## Ideia central

Este design de estabilidade não é deletar todo o histórico diretamente, mas intervir camada por camada do custo mais baixo para o mais alto:

| Camada | Ponto de disparo (configurável) | O que faz | Custo/efeito colateral |
|--- | --- | --- | ---|
| Camada 1 | `proxy.experimental.context_compression_threshold_l1` (padrão 0.4) | Identificar rodadas de ferramenta, só manter as últimas N rodadas (código é 5), deletar pares de tool_use/tool_result mais antigos | Não modifica conteúdo das mensagens restantes, mais amigável ao Prompt Cache |
| Camada 2 | `proxy.experimental.context_compression_threshold_l2` (padrão 0.55) | Comprimir texto Thinking antigo em `"..."`, mas manter `signature`, proteger as últimas 4 mensagens不动 | Modificará conteúdo histórico, comentários explicitamente dizem que quebrará cache, mas pode manter cadeia de assinatura |
| Camada 3 | `proxy.experimental.context_compression_threshold_l3` (padrão 0.7) | Chamar modelo de background para gerar resumo XML, depois Fork uma nova sequência de mensagens para continuar a conversa | Depende de chamada de modelo de background; se falhar retornará 400 (com prompt amigável) |

A seguir, expandirei camada por camada, e colocarei cache de assinatura e compressão de resultados de ferramenta juntos.

### Camada 1: Corte de rodadas de ferramenta (Trim Tool Messages)

O ponto chave da Camada 1 é só deletar interações completas de ferramenta, evitando meia exclusão causando inconsistência de contexto.

- Regra de identificação de uma rodada de ferramenta em `identify_tool_rounds()`: `tool_use` aparece em `assistant` começa uma rodada, `tool_result` aparecendo em `user` subsequente ainda conta como esta rodada, até encontrar texto user normal encerrar esta rodada.
- O que realmente executa o corte é `ContextManager::trim_tool_messages(&mut messages, 5)`: quando histórico de rodadas de ferramenta exceder 5 rodadas, deleta mensagens envolvidas em rodadas anteriores.

### Camada 2: Compressão de Thinking mas manter assinatura

Muitos problemas 400 não são Thinking muito longo, mas cadeia de assinatura do Thinking quebrada. A estratégia da Camada 2 é:

- Só processa `ContentBlock::Thinking { thinking, signature, .. }` em mensagens `assistant`
- Só comprime quando `signature.is_some()` e `thinking.len() > 10`, mudando `thinking` diretamente para `"..."`
- As últimas `protected_last_n = 4` mensagens não são comprimidas (aproximadamente as últimas 2 rodadas user/assistant)

Isso pode salvar muitos Tokens, mas ainda manter `signature` no histórico, evitando que quando a cadeia de ferramenta precisa preencher assinatura, não haja como recuperar.

### Camada 3: Fork + Resumo XML (último salvaguarda)

Quando a pressão continuar subindo, o processador Claude tentará reabrir a sessão sem perder informações-chave:

1. Extrair a última assinatura válida de Thinking da mensagem original (`ContextManager::extract_last_valid_signature()`)
2. Juntar todo o histórico + `CONTEXT_SUMMARY_PROMPT` em uma solicitação para gerar resumo XML, modelo fixo como `BACKGROUND_MODEL_LITE` (código atual é `gemini-2.5-flash`)
3. O resumo requer que contenha `<latest_thinking_signature>`, usado para subsequente continuação de cadeia de assinatura
4. Fork uma nova sequência de mensagens:
   - `User: Context has been compressed... + XML summary`
   - `Assistant: I have reviewed...`
   - Anexar a última mensagem user original (se não for a instrução de resumo que acabou de ser enviada)

Se Fork + resumo falhar, retornará diretamente `StatusCode::BAD_REQUEST`, e sugerirá você usar `/compact` ou `/clear` etc para processar manualmente (ver JSON de erro retornado pelo processador).

### Bypass 1: Cache de assinatura de três camadas (Tool / Family / Session)

Cache de assinatura é o fusível da compressão de contexto, especialmente quando o cliente corta/descarta campos de assinatura.

- TTL: `SIGNATURE_TTL = 2 * 60 * 60` (2 horas)
- Camada 1: `tool_use_id -> signature` (recuperação de cadeia de ferramenta)
- Camada 2: `signature -> model family` (verificação de compatibilidade entre modelos, evitando assinatura Claude ser levada para modelos família Gemini)
- Camada 3: `session_id -> latest signature` (isolamento de nível de sessão, evitando contaminação entre conversas diferentes)

Essas três camadas de cache serão gravadas/lidas durante análise SSE de streaming Claude e conversão de solicitação:

- Ao analisar signature de thinking em streaming, gravará no Cache de Sessão (e cache de família)
- Ao analisar signature de tool_use em streaming, gravará no Cache de Ferramenta + Cache de Sessão
- Ao converter chamadas de ferramenta Claude para Gemini `functionCall`, priorizará preencher assinatura do Cache de Sessão ou Cache de Ferramenta

### Bypass 2: Compressor de Resultados de Ferramenta (Tool Result Compressor)

Resultados de ferramenta tendem a estourar o contexto mais facilmente do que texto de chat, então o estágio de conversão de solicitação fará redução previsível em tool_result.

Regras principais (todas em `tool_result_compressor.rs`):

- Limite total de caracteres: `MAX_TOOL_RESULT_CHARS = 200_000`
- Blocos de imagem base64 são removidos diretamente (adiciona um texto de prompt)
- Se detectar prompt de saída salva em arquivo, extrairá informações chave e usará espaço reservado `[tool_result omitted ...]`
- Se detectar snapshot de navegador (contendo `page snapshot` / `ref=` etc características), mudará para resumo cabeça+cauda, e marcará quantos caracteres foram omitidos
- Se entrada parece HTML, primeiro removerá `<style>`/`<script>`/segmentos base64 antes de truncar

## Siga-me

### Passo 1: Confirme limites de compressão (e valores padrão)

**Por que**
Pontos de disparo de compressão não estão codificados, vêm de `proxy.experimental.*`. Você precisa primeiro saber os limites atuais, para poder julgar por que ele intervém tão cedo/tão tarde.

Valores padrão (lado Rust `ExperimentalConfig::default()`):

```json
{
  "proxy": {
    "experimental": {
      "enable_signature_cache": true,
      "enable_tool_loop_recovery": true,
      "enable_cross_model_checks": true,
      "enable_usage_scaling": true,
      "context_compression_threshold_l1": 0.4,
      "context_compression_threshold_l2": 0.55,
      "context_compression_threshold_l3": 0.7
    }
  }
}
```

**Você deve ver**: Sua configuração contém `proxy.experimental` (nomes de campo consistentes com acima), e limites são valores proporcionais como `0.x`.

::: warning Localização do arquivo de configuração não será repetido nesta aula
A localização do arquivo de configuração e se precisa reiniciar após modificação pertence à categoria de gerenciamento de configuração. De acordo com este sistema de tutorial, priorize a "Explicação completa de configuração: AppConfig/ProxyConfig, localização de gravação e semântica de atualização a quente".
:::

### Passo 2: Confirme com logs se Camada 1/2/3 disparou

**Por que**
Estas três camadas são comportamentos internos do proxy, o método de verificação mais confiável é ver se `[Layer-1]` / `[Layer-2]` / `[Layer-3]` aparecem nos logs.

O plano de teste do repositório fornece um comando de exemplo (ajuste conforme necessário para o caminho real de logs na sua máquina):

```bash
tail -f ~/Library/Application\ Support/com.antigravity.tools/logs/antigravity.log | grep -E "Layer-[123]"
```

**Você deve ver**: Quando a pressão aumenta, logs aparecem com registros como `Tool trimming triggered`, `Thinking compression triggered`, `Fork successful` (campos específicos prevalecem no texto original do log).

### Passo 3: Entenda a diferença entre purificação e compressão (não misture expectativas)

**Por que**
Alguns problemas (como downgrade forçado para modelo não suportando Thinking) precisam de purificação, não compressão. A purificação deletará diretamente blocos Thinking; a compressão manterá cadeia de assinatura.

No processador Claude, downgrade de tarefa de background irá por `ContextManager::purify_history(..., PurificationStrategy::Aggressive)`, que removerá diretamente blocos Thinking históricos.

**Você deve ver**: Você pode distinguir dois tipos de comportamento:

- Purificação é deletar blocos Thinking
- Compressão Camada 2 é substituir texto Thinking antigo por `"..."`, mas assinatura ainda está lá

### Passo 4: Quando encontrar erro de assinatura 400, primeiro veja se Cache de Sessão acerta

**Por que**
Muitas 400 não são por falta de assinatura, mas assinatura não segue a mensagem. Ao converter solicitação, priorizará preencher assinatura do Cache de Sessão.

Pistas (logs do estágio de conversão de solicitação sugerirão recuperar assinatura de SESSION/TOOL cache):

- `[Claude-Request] Recovered signature from SESSION cache ...`
- `[Claude-Request] Recovered signature from TOOL cache ...`

**Você deve ver**: Quando o cliente perde assinatura mas o cache do proxy ainda existe, logs aparecerão com registro de Recovered signature from ... cache.

### Passo 5: Entenda o que a compressão de resultados de ferramenta deletará

**Por que**
Se você deixar a ferramenta colocar grandes trechos de HTML / snapshot de navegador / imagens base64 de volta na conversa, o proxy deletará ativamente. Você precisa saber com antecedência quais conteúdos serão substituídos por espaços reservados, evitando pensar que o modelo não viu.

Foque em três pontos:

1. Imagens base64 serão removidas (mudadas para texto de prompt)
2. Snapshots de navegador se tornarão resumo cabeça/cauda (com número de caracteres omitidos)
3. Acima de 200,000 caracteres serão truncados e adicionados `...[truncated ...]` prompt

**Você deve ver**: Em `tool_result_compressor.rs`, essas regras têm constantes e ramos explícitos, não são exclusões por experiência.

## Ponto de verificação

- Você pode explicar claramente que pontos de disparo de L1/L2/L3 vêm de `proxy.experimental.context_compression_threshold_*`, padrão é `0.4/0.55/0.7`
- Você pode explicar por que Camada 2 quebrará cache: porque modificará conteúdo de histórico thinking
- Você pode explicar por que Camada 3 se chama Fork: transformará conversa em nova sequência de resumo XML + confirmação + mensagem user mais recente
- Você pode explicar que compressão de resultados de ferramenta deletará imagens base64, e mudará snapshots de navegador para resumo cabeça/cauda

## Avisos sobre armadilhas

| Fenômeno | Possível causa | O que você pode fazer |
|--- | --- | ---|
| Após disparar Camada 2, sente contexto não tão estável | Camada 2 modifica conteúdo histórico, comentários explicitamente dizem que quebrará cache | Se você depende da consistência do Prompt Cache, tente deixar L1 resolver primeiro, ou aumentar limite L2 |
| Após disparar Camada 3 retorna diretamente 400 | Fork + resumo chamando modelo de background falhou (rede/conta/erro upstream etc) | Primeiro use `/compact` ou `/clear` conforme sugerido no JSON de erro; ao mesmo tempo verifique cadeia de chamada de modelo de background |
| Imagens/conteúdo grande na saída de ferramenta desapareceram | tool_result removerá imagens base64, truncará saída muito longa | Coloque conteúdo importante em arquivo/links local e depois referencie; não espere colocar 100 mil linhas de texto diretamente na conversa |
| Aparentemente usando modelo Gemini mas carregando assinatura Claude causando erro | Assinatura incompatível entre modelos (código tem verificação de família) | Confirme origem da assinatura; se necessário, deixe o proxy desanexar assinatura histórica em cenários de retry (ver lógica de conversão de solicitação) |

## Resumo desta aula

- Núcleo de compressão de três camadas é classificação por custo: primeiro deletar rodadas de ferramenta antigas, depois comprimir Thinking antigo, finalmente só Fork + resumo XML
- Cache de assinatura é chave para manter cadeia de ferramenta não quebrada: três camadas Session/Tool/Family gerenciam um tipo de problema cada, TTL é 2 horas
- Compressão de resultados de ferramenta é limite rígido para evitar saídas de ferramenta estourarem contexto: limite 200,000 caracteres + especialização em snapshot/arquivos grandes

## Próxima aula

> Na próxima aula, falaremos sobre capacidade do sistema: multi-idioma/tema/atualização/inicialização automática/HTTP API Server.

---

## Apêndice: Referências de código-fonte

<details>
<summary><strong>Clique para expandir e ver localizações do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Funcionalidade | Caminho do arquivo | Número da linha |
|--- | --- | ---|
| Configuração experimental: limites de compressão e interruptores padrão | `src-tauri/src/proxy/config.rs` | 119-168 |
|--- | --- | ---|
| Estimativa de uso de Token: percorrer system/messages/tools/thinking | `src-tauri/src/proxy/mappers/context_manager.rs` | 103-198 |
| Camada 1: identificar rodadas de ferramenta + cortar rodadas antigas | `src-tauri/src/proxy/mappers/context_manager.rs` | 311-439 |
| Camada 2: compressão de Thinking mas manter assinatura (proteger últimas N) | `src-tauri/src/proxy/mappers/context_manager.rs` | 200-271 |
| Auxiliar Camada 3: extrair última assinatura válida | `src-tauri/src/proxy/mappers/context_manager.rs` | 73-109 |
| Downgrade de tarefa de background: purificação Aggressiva de blocos Thinking | `src-tauri/src/proxy/handlers/claude.rs` | 540-583 |
| Fluxo principal de compressão de três camadas: estimativa, calibração, disparar L1/L2/L3 por limite | `src-tauri/src/proxy/handlers/claude.rs` | 379-731 |
| Camada 3: implementação de Fork de resumo XML | `src-tauri/src/proxy/handlers/claude.rs` | 1560-1687 |
| Cache de assinatura: TTL/estrutura de cache de três camadas (Tool/Family/Session) | `src-tauri/src/proxy/signature_cache.rs` | 5-88 |
| Cache de assinatura: gravação/leitura de assinatura Session | `src-tauri/src/proxy/signature_cache.rs` | 141-223 |
| Análise de streaming SSE: gravar signature de thinking/tool para Session/Tool cache | `src-tauri/src/proxy/mappers/claude/streaming.rs` | 766-776 |
|--- | --- | ---|
| Conversão de solicitação: tool_use priorizar preencher assinatura de Session/Tool cache | `src-tauri/src/proxy/mappers/claude/request.rs` | 1045-1142 |
| Conversão de solicitação: tool_result disparar compressão de resultados de ferramenta | `src-tauri/src/proxy/mappers/claude/request.rs` | 1159-1225 |
| Compressor de resultados de ferramenta: entrada `compact_tool_result_text()` | `src-tauri/src/proxy/mappers/tool_result_compressor.rs` | 28-69 |
| Compressor de resultados de ferramenta: resumo cabeça/cauda de snapshot de navegador | `src-tauri/src/proxy/mappers/tool_result_compressor.rs` | 123-178 |
| Compressor de resultados de ferramenta: remover imagens base64 + limite total de caracteres | `src-tauri/src/proxy/mappers/tool_result_compressor.rs` | 247-320 |
| Plano de teste: disparo de compressão de três camadas e verificação de logs | `docs/testing/context_compression_test_plan.md` | 1-116 |

</details>
