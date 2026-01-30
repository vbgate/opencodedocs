---
title: "Poda LLM: Otimização Inteligente | opencode-dynamic-context-pruning"
sidebarTitle: "Deixe a IA Podar Automaticamente"
subtitle: "Poda LLM: Otimização Inteligente de Contexto"
description: "Aprenda as ferramentas discard/extract do DCP, entenda as diferenças, mecanismo de injeção e proteção, configure opções de alternância, valide os efeitos de poda na prática, otimize Tokens e reduza custos."
tags:
  - "DCP"
  - "Poda de Contexto"
  - "Ferramentas de IA"
  - "Otimização de Tokens"
prerequisite:
  - "start-configuration"
order: 2
---

# Ferramentas de Poda Orientadas por LLM: Deixe a IA Otimizar o Contexto de Forma Inteligente

## O Que Você Será Capaz de Fazer

- Entender a diferença entre as ferramentas discard e extract e seus cenários de uso
- Saber como a IA seleciona conteúdo para podar através da lista `<prunable-tools>`
- Configurar alternâncias, frequência de lembretes e opções de exibição das ferramentas de poda
- Compreender como os mecanismos de proteção previnem a poda acidental de arquivos críticos

## Seu Dilema Atual

À medida que a conversa avança e as chamadas de ferramentas se acumulam, o contexto cresce cada vez mais. Você pode encontrar:
- Uso de tokens disparando, custos aumentando
- IA precisando processar grandes quantidades de saídas antigas e irrelevantes de ferramentas
- Sem saber como fazer a IA limpar proativamente o contexto

A solução tradicional é limpeza manual, mas isso interrompe o fluxo da conversa. O DCP oferece uma maneira melhor: deixar a IA decidir autonomamente quando limpar o contexto.

## Quando Usar Esta Técnica

Quando você:
- Frequentemente tem conversas longas com muitas chamadas de ferramentas acumuladas
- Percebe que a IA precisa processar grandes quantidades de saídas históricas de ferramentas
- Quer otimizar custos de uso de tokens sem interromper a conversa
- Deseja escolher entre reter ou excluir conteúdo com base em cenários específicos

## Conceito Central

O DCP fornece duas ferramentas que permitem à IA otimizar proativamente o contexto durante a conversa:

| Ferramenta | Propósito | Retém Conteúdo |
|--- | --- | ---|
| **discard** | Remove tarefas concluídas ou ruído | ❌ Não retém |
| **extract** | Extrai descobertas-chave antes de excluir conteúdo original | ✅ Retém informações resumidas |

### Mecanismo de Funcionamento

Antes de cada mensagem que a IA prepara para enviar, o DCP irá:

```
1. Escanear chamadas de ferramentas na sessão atual
   ↓
2. Filtrar ferramentas já podadas e protegidas
   ↓
3. Gerar lista <prunable-tools>
   Formato: ID: ferramenta, parâmetro
   ↓
4. Injetar lista no contexto
   ↓
5. IA seleciona ferramentas da lista e chama discard/extract
   ↓
6. DCP substitui conteúdo podado por placeholder
```

### Lógica de Decisão para Seleção de Ferramentas

A IA escolherá com base neste fluxo:

```
"Esta saída de ferramenta precisa reter informações?"
  │
  ├─ Não → discard (método de limpeza padrão)
  │   - Tarefa concluída, conteúdo sem valor
  │   - Ruído, informações irrelevantes
  │
  ├─ Sim → extract (reter conhecimento)
  │   - Informações-chave necessárias para referência posterior
  │   - Assinaturas de funções, valores de configuração, etc.
  │
  └─ Incerto → extract (mais seguro)
```

::: info
A IA podará em lote, em vez de podar saídas de ferramentas pequenas individualmente. Isso é mais eficiente.
:::

### Mecanismos de Proteção

O DCP tem múltiplas camadas de proteção para prevenir que a IA pode acidentalmente conteúdo crítico:

| Camada de Proteção | Descrição | Item de Configuração |
|--- | --- | ---|
| **Ferramentas Protegidas** | Ferramentas principais como task, write, edit não podem ser podadas | `tools.settings.protectedTools` |
| **Arquivos Protegidos** | Caminhos de arquivos que correspondem a padrões glob não podem ser podados | `protectedFilePatterns` |
| **Proteção por Turnos** | Novas ferramentas não serão colocadas na lista de poda por N turnos | `turnProtection.turns` |

::: tip
Ferramentas protegidas por padrão incluem: task, todowrite, todoread, discard, extract, batch, write, edit, plan_enter, plan_exit
:::

## Siga Comigo

### Passo 1: Entenda a Lista `<prunable-tools>`

Durante a conversa, o DCP injetará automaticamente a lista `<prunable-tools>`. A IA vê conteúdo assim:

```xml
<prunable-tools>
The following tools have been invoked and are available for pruning.
This list does not mandate immediate action.
Consider your current goals and resources you need before discarding valuable tool inputs or outputs.
Consolidate your prunes for efficiency; it is rarely worth pruning a single tiny tool output.
Keep your context free of noise.

5: read, /path/to/auth.ts
12: bash, npm test
18: grep, "function login"
</prunable-tools>
```

**Você deve ver**:
- Uma ferramenta por linha, formato `ID: ferramenta, parâmetro`
- ID é um índice numérico (começando de 0)
- Apenas ferramentas podáveis são mostradas (já podadas, protegidas, arquivos protegidos não aparecem)

### Passo 2: Veja Cenários Onde a IA Usa discard

Quando a IA completa uma tarefa e julga que não há necessidade de reter informações:

```
Entrada do usuário: Testar funcionalidade de autenticação

Saída da IA:
Testes passaram. A lógica de autenticação funciona normalmente, não há necessidade de reter logs de teste.
[Chama discard(ids: ["completion", "5", "12"])]
```

**Você deve ver**:
- A IA usou a ferramenta `discard`
- Formato do parâmetro: `["razão", "ID1", "ID2", ...]`
- Razão tem apenas dois tipos: `"completion"` (tarefa concluída) ou `"noise"` (ruído)

### Passo 3: Veja Cenários Onde a IA Usa extract

Quando a IA completa uma tarefa mas precisa reter informações-chave:

```
Entrada do usuário: Analisar a implementação do serviço de autenticação

Saída da IA:
Encontrei alguns detalhes-chave, extraídos abaixo:
[Chama extract(ids: ["5", "12"], distillation: [
  "auth.ts: validateToken verifica cache (5min TTL) depois chama OIDC",
  "bash: resultado npm test - todos os testes passaram"
])]
```

**Você deve ver**:
- A IA usou a ferramenta `extract`
- O array `distillation` tem o mesmo comprimento que o array `ids`
- Cada conteúdo extraído corresponde às informações resumidas de uma saída de ferramenta

### Passo 4: Configure Opções das Ferramentas de Poda

Edite o arquivo de configuração do DCP (`~/.config/opencode/dcp.jsonc` ou nível de projeto `.opencode/dcp.jsonc`):

```jsonc
{
  "tools": {
    "discard": {
      "enabled": true
    },
    "extract": {
      "enabled": true,
      "showDistillation": false
    },
    "settings": {
      "nudgeEnabled": true,
      "nudgeFrequency": 10,
      "protectedTools": [
        "task",
        "todowrite",
        "todoread",
        "discard",
        "extract",
        "batch",
        "write",
        "edit",
        "plan_enter",
        "plan_exit"
      ]
    }
  }
}
```

**Você deve ver**:
- `discard.enabled`: Habilitar ferramenta discard (padrão true)
- `extract.enabled`: Habilitar ferramenta extract (padrão true)
- `extract.showDistillation`: Se deve mostrar conteúdo extraído (padrão false)
- `nudgeEnabled`: Se deve habilitar lembretes de poda (padrão true)
- `nudgeFrequency`: Frequência de lembretes (padrão 10, ou seja, a cada 10 chamadas de ferramentas)

**Você deve ver**:
- Se `showDistillation` for false, conteúdo extraído não aparecerá na conversa
- Se `showDistillation` for true, conteúdo extraído aparece como mensagem ignorada

### Passo 5: Teste a Funcionalidade de Poda

1. Tenha uma conversa mais longa, acionando múltiplas chamadas de ferramentas
2. Observe se a IA chama discard ou extract no momento apropriado
3. Use `/dcp stats` para ver estatísticas de poda

**Você deve ver**:
- Após as chamadas de ferramentas acumularem até certa quantidade, a IA começa a podar proativamente
- `/dcp stats` mostra a quantidade de tokens economizados
- O contexto da conversa fica mais focado na tarefa atual

## Checkpoint ✅

::: details Clique para expandir e verificar sua configuração

**Verifique se a configuração está em vigor**

```bash
# Ver configuração do DCP
cat ~/.config/opencode/dcp.jsonc

# Ou configuração de nível de projeto
cat .opencode/dcp.jsonc
```

Você deve ver:
- `tools.discard.enabled` é true (discard habilitado)
- `tools.extract.enabled` é true (extract habilitado)
- `tools.settings.nudgeEnabled` é true (lembretes habilitados)

**Verifique se a poda está funcionando**

Na conversa, após acionar múltiplas chamadas de ferramentas:

Você deve ver:
- A IA chama discard ou extract no momento apropriado
- Recebe notificação de poda (mostrando ferramentas podadas e tokens economizados)
- `/dcp stats` mostra tokens economizados acumulados

:::

## Alertas de Armadilhas

### Erro Comum 1: A IA Não Está Podando Ferramentas

**Possíveis causas**:
- Ferramentas de poda não estão habilitadas
- Configuração de proteção muito restritiva, sem ferramentas podáveis

**Solução**:
```jsonc
{
  "tools": {
    "discard": {
      "enabled": true  // Certifique-se de habilitar
    },
    "extract": {
      "enabled": true  // Certifique-se de habilitar
    }
  }
}
```

### Erro Comum 2: Conteúdo Crítico Foi Podado Acidentalmente

**Possíveis causas**:
- Arquivos críticos não foram adicionados aos padrões de proteção
- Lista de ferramentas protegidas incompleta

**Solução**:
```jsonc
{
  "protectedFilePatterns": [
    "src/auth/*",  // Proteger arquivos relacionados à autenticação
    "config/*"     // Proteger arquivos de configuração
  ],
  "tools": {
    "settings": {
      "protectedTools": [
        "read",  // Adicionar read à lista de proteção
        "write"
      ]
    }
  }
}
```

### Erro Comum 3: Não Consigo Ver o Conteúdo Extraído

**Possíveis causas**:
- `showDistillation` configurado como false

**Solução**:
```jsonc
{
  "tools": {
    "extract": {
      "showDistillation": true  // Habilitar exibição
    }
  }
}
```

::: warning
Conteúdo extraído aparecerá como mensagem ignorada, não afetando o contexto da conversa.
:::

## Resumo da Lição

O DCP fornece duas ferramentas para a IA otimizar autonomamente o contexto:

- **discard**: Remove tarefas concluídas ou ruído, sem necessidade de reter informações
- **extract**: Extrai descobertas-chave antes de excluir conteúdo original, retendo informações resumidas

A IA entende as ferramentas podáveis através da lista `<prunable-tools>` e seleciona a ferramenta apropriada com base no cenário. Mecanismos de proteção garantem que conteúdo crítico não seja podado acidentalmente.

Pontos-chave de configuração:
- Habilitar ferramentas: `tools.discard.enabled` e `tools.extract.enabled`
- Mostrar conteúdo extraído: `tools.extract.showDistillation`
- Ajustar frequência de lembretes: `tools.settings.nudgeFrequency`
- Proteger ferramentas e arquivos críticos: `protectedTools` e `protectedFilePatterns`

## Prévia da Próxima Lição

> Na próxima lição aprenderemos **[Uso de Comandos Slash](../commands/)**
>
> Você aprenderá:
> - Usar `/dcp context` para ver a distribuição de tokens da sessão atual
> - Usar `/dcp stats` para ver estatísticas acumuladas de poda
> - Usar `/dcp sweep` para acionar poda manualmente

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver localizações do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Linhas |
|--- | --- | ---|
| Definição da ferramenta discard | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L155-L180) | 155-180 |
| Definição da ferramenta extract | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L183-L220) | 183-220 |
| Execução da operação de poda | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L26-L153) | 26-153 |
|--- | --- | ---|
| Injeção de contexto de poda | [`lib/messages/inject.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/inject.ts#L102-L156) | 102-156 |
| Especificação da ferramenta discard | [`lib/prompts/discard-tool-spec.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/discard-tool-spec.ts#L1-L41) | 1-41 |
| Especificação da ferramenta extract | [`lib/prompts/extract-tool-spec.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/extract-tool-spec.ts#L1-L48) | 1-48 |
| Prompt do sistema (ambos) | [`lib/prompts/system/both.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/system/both.ts#L1-L60) | 1-60 |
| Prompt de lembrete | [`lib/prompts/nudge/both.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/nudge/both.ts#L1-L10) | 1-10 |
| Definição de configuração | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L436-L449) | 436-449 |
| Ferramentas protegidas padrão | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L438-L441) | 438-441 |

**Constantes-chave**:
- `DISCARD_TOOL_DESCRIPTION`: Descrição do prompt da ferramenta discard
- `EXTRACT_TOOL_DESCRIPTION`: Descrição do prompt da ferramenta extract
- `DEFAULT_PROTECTED_TOOLS`: Lista padrão de ferramentas protegidas

**Funções-chave**:
- `createDiscardTool(ctx)`: Criar ferramenta discard
- `createExtractTool(ctx)`: Criar ferramenta extract
- `executePruneOperation(ctx, toolCtx, ids, reason, toolName, distillation)`: Executar operação de poda
- `buildPrunableToolsList(state, config, logger, messages)`: Gerar lista de ferramentas podáveis
- `insertPruneToolContext(state, config, logger, messages)`: Injetar contexto de poda

**Itens de configuração**:
- `tools.discard.enabled`: Se deve habilitar ferramenta discard (padrão true)
- `tools.extract.enabled`: Se deve habilitar ferramenta extract (padrão true)
- `tools.extract.showDistillation`: Se deve mostrar conteúdo extraído (padrão false)
- `tools.settings.nudgeEnabled`: Se deve habilitar lembretes (padrão true)
- `tools.settings.nudgeFrequency`: Frequência de lembretes (padrão 10)
- `tools.settings.protectedTools`: Lista de ferramentas protegidas
- `protectedFilePatterns`: Padrões glob de arquivos protegidos

</details>
