---
title: "Melhores Práticas: Otimização de Configuração | opencode-dynamic-context-pruning"
subtitle: "Melhores Práticas: Otimização de Configuração"
sidebarTitle: "Economize 40% dos Tokens"
description: "Aprenda as melhores práticas de configuração do DCP. Domine a escolha de estratégias, proteção de turnos, proteção de ferramentas e configuração de modos de notificação para otimizar o uso de Tokens."
tags:
  - "Melhores Práticas"
  - "Economia de Tokens"
  - "Configuração"
  - "Otimização"
prerequisite:
  - "start-configuration"
  - "platforms-auto-pruning"
order: 2
---

# Melhores Práticas do DCP

## O Que Você Aprenderá

- Entender o equilíbrio entre Prompt Caching e economia de Tokens
- Escolher a estratégia de proteção adequada (proteção de turnos, ferramentas protegidas, modo de arquivos)
- Usar comandos para otimizar manualmente o uso de Tokens
- Personalizar a configuração do DCP conforme as necessidades do projeto

## Equilíbrio do Prompt Caching

### Entendendo o Equilíbrio entre Cache e Poda

Ao podar a saída das ferramentas, o DCP altera o conteúdo das mensagens, o que causa a falha do Prompt Caching baseado em **correspondência exata de prefixo** a partir desse ponto.

**Comparação de dados de teste**:

| Cenário           | Taxa de Acerto do Cache | Economia de Tokens | Benefício Geral |
|--- | --- | --- | ---|
| Sem DCP           | ~85%                    | 0%                 | Linha de base   |
| Com DCP ativado   | ~65%                    | 20-40%             | ✅ Benefício positivo |

### Quando Ignorar a Perda de Cache

**Cenários recomendados para usar DCP**:

- ✅ **Conversas longas** (mais de 20 turnos): expansão de contexto significativa, economia de Tokens muito superior à perda de cache
- ✅ **Serviços cobrados por solicitação**: GitHub Copilot, Google Antigravity, etc., onde a perda de cache não tem impacto negativo
- ✅ **Chamadas intensas de ferramentas**: cenários com leitura frequente de arquivos, execução de buscas, etc.
- ✅ **Tarefas de refatoração de código**: leitura repetida do mesmo arquivo é frequente

**Cenários onde pode ser necessário desativar o DCP**:

- ⚠️ **Conversas curtas** (< 10 turnos): benefício da poda limitado, perda de cache pode ser mais evidente
- ⚠️ **Tarefas sensíveis ao cache**: cenários que necessitam maximizar a taxa de acerto do cache (como tarefas de processamento em lote)

::: tip Configuração Flexível
Você pode ajustar dinamicamente a configuração do DCP conforme as necessidades do projeto, e até mesmo desativar estratégias específicas na configuração de nível de projeto.
:::

---

## Melhores Práticas de Prioridade de Configuração

### Uso Correto de Configurações Multi-Nível

As configurações do DCP são mescladas na seguinte prioridade:

```
Valores Padrão < Configuração Global < Diretório de Configuração Personalizada < Configuração do Projeto
```

::: info Explicação do Diretório de Configuração
O "diretório de configuração personalizada" é especificado através da variável de ambiente `$OPENCODE_CONFIG_DIR`. Nesse diretório, é necessário colocar o arquivo `dcp.jsonc` ou `dcp.json`.
:::

### Estratégias de Configuração Recomendadas

| Cenário                 | Local de Configuração Recomendado | Foco da Configuração de Exemplo                          |
|--- | --- | ---|
| **Ambiente de Desenvolvimento Pessoal** | Configuração Global | Ativar estratégias automáticas, desativar logs de depuração |
| **Projetos de Colaboração em Equipe**   | Configuração do Projeto | Arquivos protegidos específicos do projeto, interruptores de estratégia |
| **Ambiente CI/CD**                        | Diretório de Configuração Personalizada | Desativar notificações, ativar logs de depuração |
| **Depuração Temporária**                  | Configuração do Projeto | Ativar `debug`, modo de notificação detalhado |

**Exemplo: Substituição de Configuração em Nível de Projeto**

```jsonc
// ~/.config/opencode/dcp.jsonc (configuração global)
{
    "enabled": true,
    "strategies": {
        "deduplication": {
            "enabled": true
        }
    }
}
```

```jsonc
// .opencode/dcp.jsonc (configuração do projeto)
{
    "strategies": {
        // Substituição em nível de projeto: desativar desduplicação (por exemplo, o projeto precisa manter o contexto histórico)
        "deduplication": {
            "enabled": false
        }
    }
}
```

::: warning Reiniciar Após Modificar Configuração
Após modificar a configuração, é necessário reiniciar o OpenCode para que as alterações entrem em vigor.
:::

---

## Escolha de Estratégias de Proteção

### Cenários de Uso da Proteção de Turnos

**Proteção de Turnos** (Turn Protection) impede que ferramentas sejam podadas dentro de um número especificado de turnos, dando ao IA tempo suficiente para referenciar o conteúdo recente.

**Configurações recomendadas**:

| Cenário                   | Valor Recomendado | Motivo                     |
|--- | --- | ---|
| **Resolução de Problemas Complexos**       | 4-6 turnos | IA precisa de múltiplas iterações para analisar saídas de ferramentas      |
| **Refatoração de Código**           | 2-3 turnos | Alternância de contexto rápida, período de proteção longo afeta o efeito    |
| **Desenvolvimento Rápido de Protótipos**       | 2-4 turnos | Equilibrar proteção e economia de Tokens        |
| **Configuração Padrão**           | 4 turnos    | Ponto de equilíbrio testado              |

**Quando ativar proteção de turnos**:

```jsonc
{
    "turnProtection": {
        "enabled": true,   // Ativar proteção de turnos
        "turns": 6        // Proteger 6 turnos (adequado para tarefas complexas)
    }
}
```

**Quando não é recomendado ativar**:

- Cenários de perguntas e respostas simples (IA responde diretamente, não precisa de ferramentas)
- Conversas curtas de alta frequência (período de proteção longo causa poda insuficiente)

### Configuração de Ferramentas Protegidas

**Ferramentas protegidas por padrão** (sem necessidade de configuração adicional):
- `task`, `write`, `edit`, `batch`, `discard`, `extract`, `todowrite`, `todoread`, `plan_enter`, `plan_exit`

::: warning Explicação dos Valores Padrão do Schema
Se você usar o recurso de autocompletar do IDE, a lista de ferramentas protegidas por padrão no arquivo de Schema (`dcp.schema.json`) pode aparecer incompleta. Na realidade, use `DEFAULT_PROTECTED_TOOLS` definido no código-fonte como referência, que inclui todas as 10 ferramentas.
:::

**Quando adicionar ferramentas protegidas extras**:

| Cenário                   | Exemplo de Configuração                              | Motivo                     |
|--- | --- | ---|
| **Ferramentas Críticas de Negócios**       | `protectedTools: ["critical_tool"]` | Garantir que operações críticas permaneçam visíveis            |
| **Ferramentas que Precisam de Contexto Histórico** | `protectedTools: ["analyze_history"]` | Manter histórico completo para análise            |
| **Ferramentas de Tarefa Personalizada**     | `protectedTools: ["custom_task"]` | Proteger fluxos de trabalho de tarefas personalizadas            |

```jsonc
{
    "strategies": {
        "deduplication": {
            "enabled": true,
            "protectedTools": ["custom_analyze"]  // Proteção adicional para ferramenta específica
        }
    },
    "tools": {
        "settings": {
            "protectedTools": ["important_check"]  // Proteção adicional para ferramentas de LLM
        }
    }
}
```

### Uso de Padrões de Arquivos Protegidos

**Padrões de proteção recomendados**:

| Tipo de Arquivo             | Padrão Recomendado                     | Motivo de Proteção                 |
|--- | --- | ---|
| **Arquivos de Configuração**           | `"*.env"`, `".env*"`        | Evitar perda de informações sensíveis devido à poda          |
| **Configuração de Banco de Dados**          | `"**/config/database/*"`    | Garantir que a configuração de conexão do banco de dados esteja sempre disponível        |
| **Arquivos de Chaves**           | `"**/secrets/**"`          | Proteger todas as chaves e certificados            |
| **Lógica de Negócios Principal**        | `"src/core/*"`            | Evitar perda de contexto de código crítico          |

```jsonc
{
    "protectedFilePatterns": [
        "*.env",                // Proteger todos os arquivos de variáveis de ambiente
        ".env.*",              // Incluir .env.local, etc.
        "**/secrets/**",       // Proteger diretório de secrets
        "**/config/*.json",    // Proteger arquivos de configuração
        "src/auth/**"          // Proteger código relacionado à autenticação
    ]
}
```

::: tip Regras de Correspondência de Padrões
`protectedFilePatterns` corresponde ao campo `filePath` nos parâmetros das ferramentas (como ferramentas `read`, `write`, `edit`).
:::

---

## Escolha de Estratégias Automáticas

### Estratégia de Desduplicação (Deduplication)

**Ativada por padrão**, adequada para a maioria dos cenários.

**Cenários aplicáveis**:
- Leitura repetida do mesmo arquivo (como revisão de código, depuração em múltiplas rodadas)
- Execução dos mesmos comandos de busca ou análise

**Quando não é recomendado ativar**:
- Necessidade de manter a saída exata de cada chamada (como monitoramento de desempenho)
- Saída de ferramentas contém carimbos de tempo ou valores aleatórios (cada chamada é diferente)

### Estratégia de Substituição de Escritas (Supersede Writes)

**Desativada por padrão**, requer decisão de ativação conforme as necessidades do projeto.

**Cenários recomendados para ativar**:
- Ler para validar imediatamente após modificar arquivos (refatoração, processamento em lote)
- Saída de operações de escrita é grande, a leitura subsequente substitui seu valor

```jsonc
{
    "strategies": {
        "supersedeWrites": {
            "enabled": true  // Ativar estratégia de substituição de escritas
        }
    }
}
```

**Quando não é recomendado ativar**:
- Necessidade de rastrear histórico de modificações de arquivos (auditoria de código)
- Operações de escrita contêm metadados importantes (como motivo da mudança)

### Estratégia de Limpeza de Erros (Purge Errors)

**Ativada por padrão**, recomendado manter ativado.

**Sugestões de configuração**:

| Cenário                   | Valor Recomendado  | Motivo                     |
|--- | --- | ---|
| **Configuração Padrão**           | 4 turnos | Ponto de equilíbrio testado              |
| **Cenário de Falha Rápida**       | 2 turnos | Limpar entradas de erro precocemente, reduzir contaminação do contexto       |
| **Necessita Histórico de Erros**       | 6-8 turnos | Manter mais informações de erro para depuração          |

```jsonc
{
    "strategies": {
        "purgeErrors": {
            "enabled": true,
            "turns": 2  // Cenário de falha rápida: limpar entradas de erro após 2 turnos
        }
    }
}
```

---

## Melhor Uso de Ferramentas Impulsionadas por LLM

### Otimização da Função de Lembrete

Por padrão, o DCP lembra o IA a usar ferramentas de poda a cada 10 chamadas de ferramentas.

**Configurações recomendadas**:

| Cenário                   | nudgeFrequency | Explicação do Efeito                |
|--- | --- | ---|
| **Chamadas Intensas de Ferramentas**       | 8-12          | Lembrar o IA para limpar prontamente            |
| **Chamadas de Baixa Frequência de Ferramentas**       | 15-20         | Reduzir interferência de lembretes              |
| **Desativar Lembretes**           | Infinity      | Depender completamente do julgamento autônomo do IA         |

```jsonc
{
    "tools": {
        "settings": {
            "nudgeEnabled": true,
            "nudgeFrequency": 15  // Cenário de baixa frequência: lembrar após 15 chamadas de ferramentas
        }
    }
}
```

### Uso da Ferramenta Extract

**Quando usar Extract**:
- A saída da ferramenta contém descobertas ou dados críticos que precisam ser mantidos em resumo
- A saída original é grande, mas as informações extraídas são suficientes para apoiar o raciocínio subsequente

**Sugestões de configuração**:

```jsonc
{
    "tools": {
        "extract": {
            "enabled": true,
            "showDistillation": false  // Por padrão, não mostrar conteúdo extraído (reduzir interferência)
        }
    }
}
```

**Quando ativar `showDistillation`**:
- Necessidade de ver quais informações críticas o IA extraiu
- Depuração ou verificação do comportamento da ferramenta Extract

### Uso da Ferramenta Discard

**Quando usar Discard**:
- A saída da ferramenta é apenas estado temporário ou ruído
- Após a conclusão da tarefa, não há necessidade de manter a saída da ferramenta

**Sugestões de configuração**:

```jsonc
{
    "tools": {
        "discard": {
            "enabled": true
        }
    }
}
```

---

## Dicas de Uso de Comandos

### Quando Usar `/dcp context`

**Cenários recomendados**:
- Suspeita de uso anormal de Tokens
- Necessidade de entender a distribuição de contexto da sessão atual
- Avaliar o efeito da poda do DCP

**Melhores práticas**:
- Verificar uma vez no meio de conversas longas para entender a composição do contexto
- Verificar no final da conversa para ver o consumo total de Tokens

### Quando Usar `/dcp stats`

**Cenários recomendados**:
- Necessidade de entender o efeito de economia de Tokens a longo prazo
- Avaliar o valor geral do DCP
- Comparar o efeito de economia de diferentes configurações

**Melhores práticas**:
- Verificar estatísticas acumuladas uma vez por semana
- Comparar o efeito antes e depois de otimizar a configuração

### Quando Usar `/dcp sweep`

**Cenários recomendados**:
- Contexto muito grande causando lentidão na resposta
- Necessidade de reduzir o consumo de Tokens imediatamente
- Estratégias automáticas não dispararam a poda

**Dicas de uso**:

| Comando              | Propósito               |
|--- | ---|
| `/dcp sweep`      | Podar todas as ferramentas após a última mensagem do usuário |
| `/dcp sweep 10`   | Podar apenas as últimas 10 ferramentas      |
| `/dcp sweep 5`    | Podar apenas as últimas 5 ferramentas       |

**Fluxo de trabalho recomendado**:
1. Primeiro use `/dcp context` para ver o status atual
2. Decida a quantidade de poda com base na situação
3. Use `/dcp sweep N` para executar a poda
4. Use `/dcp context` novamente para confirmar o efeito

---

## Escolha de Modos de Notificação

### Comparação dos Três Modos de Notificação

| Modo       | Conteúdo Exibido                          | Cenários Aplicáveis             |
|--- | --- | ---|
| **off**   | Não exibir nenhuma notificação                       | Ambiente de trabalho que não precisa de interferência      |
| **minimal** | Exibir apenas quantidade de podas e economia de Tokens             | Necessidade de entender o efeito mas não focar em detalhes    |
| **detailed** | Exibir cada ferramenta podada e o motivo (padrão)          | Cenários de depuração ou monitoramento detalhado   |

### Configuração Recomendada

| Cenário             | Modo Recomendado   | Motivo               |
|--- | --- | ---|
| **Desenvolvimento Diário**       | minimal | Focar no efeito, reduzir interferência        |
| **Depuração de Problemas**       | detailed | Ver o motivo de cada operação de poda      |
| **Demonstração ou Gravação de Demonstração**  | off     | Evitar interferência de notificações no fluxo de demonstração       |

```jsonc
{
    "pruneNotification": "minimal"  // Recomendado para desenvolvimento diário
}
```

---

## Tratamento de Cenários de Sub-Agentes

### Entendendo as Limitações de Sub-Agentes

**O DCP é completamente desativado em sessões de sub-agentes**.

**Motivos**:
- O objetivo do sub-agente é retornar um resumo conciso de descobertas
- A poda do DCP pode interferir no comportamento de resumo do sub-agente
- Sub-agentes geralmente têm tempo de execução curto, expansão de contexto limitada

### Como Determinar se é uma Sessão de Sub-Agente

1. **Ativar logs de depuração**:
    ```jsonc
    {
        "debug": true
    }
    ```

2. **Verificar logs**:
    Os logs mostrarão a marcação `isSubAgent: true`

### Sugestões de Otimização de Tokens para Sub-Agentes

Embora o DCP seja desativado em sub-agentes, você ainda pode:

- Otimizar os prompts dos sub-agentes para reduzir o comprimento da saída
- Limitar o escopo de chamadas de ferramentas dos sub-agentes
- Usar o parâmetro `max_length` da ferramenta `task` para controlar a saída

---

## Resumo da Lição

| Área de Melhores Práticas       | Sugestão Principal                          |
|--- | ---|
| **Prompt Caching**  | Em conversas longas, a economia de Tokens geralmente supera a perda de cache          |
| **Prioridade de Configuração**      | Configuração global para configurações gerais, configuração do projeto para necessidades específicas         |
| **Proteção de Turnos**       | Tarefas complexas 4-6 turnos, tarefas rápidas 2-3 turnos         |
| **Ferramentas Protegidas**     | Proteção padrão é suficiente, adicionar ferramentas críticas de negócios conforme necessário             |
| **Arquivos Protegidos**     | Proteger arquivos de configuração, chaves, lógica de negócios principal               |
| **Estratégias Automáticas**       | Desduplicação e limpeza de erros ativadas por padrão, substituição de escritas ativada conforme necessário           |
| **Ferramentas LLM**     | Frequência de lembretes 10-15 vezes, mostrar conteúdo extraído durante depuração do Extract    |
| **Uso de Comandos**     | Verificar o contexto regularmente, podar manualmente conforme necessário                |
| **Modos de Notificação**       | Uso diário com minimal, depuração com detailed       |

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver localizações do código-fonte</strong></summary>

> Última atualização: 2026-01-23

| Funcionalidade         | Caminho do Arquivo                                                                                              | Número de Linhas        |
|--- | --- | ---|
| Mesclagem de Configuração      | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L691-794)    | 691-794     |
| Validação de Configuração      | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L147-375)    | 147-375     |
| Configuração Padrão      | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-134)     | 68-134      |
| Proteção de Turnos      | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L432-437)   | 432-437     |
| Ferramentas Protegidas     | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-79)     | 68-79       |
| Padrões de Arquivos Protegidos   | [`protected-file-patterns.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/protected-file-patterns.ts#L1-60) | 1-60        |
| Detecção de Sub-Agentes     | [`lib/state/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/utils.ts#L1-8)      | 1-8         |
| Função de Lembrete      | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L438-441)   | 438-441     |

**Constantes Chave**:
- `MAX_TOOL_CACHE_SIZE = 1000`: número máximo de entradas no cache de ferramentas
- `turnProtection.turns`: proteção de 4 turnos por padrão

**Funções Chave**:
- `getConfig()`: carrega e mescla configurações de múltiplos níveis
- `validateConfigTypes()`: valida tipos de itens de configuração
- `mergeConfig()`: mescla configurações por prioridade
- `isSubAgentSession()`: detecta sessões de sub-agentes

</details>
