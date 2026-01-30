---
title: "Poda Automática: Três Estratégias | opencode-dcp"
sidebarTitle: "Economize Tokens com Estratégias"
subtitle: "Poda Automática: Três Estratégias | opencode-dcp"
description: "Aprenda as três estratégias de poda automática do DCP: deduplicação, substituição de escritas e limpeza de erros. Entenda profundamente o funcionamento, cenários de uso e métodos de configuração para economizar custos de Tokens e melhorar a qualidade das conversas. Todas as estratégias com custo zero de LLM."
tags:
  - "Poda Automática"
  - "Estratégias"
  - "Deduplicação"
  - "Substituição de Escritas"
  - "Limpeza de Erros"
prerequisite:
  - "start-getting-started"
  - "start-configuration"
order: 1
---

# Explicação Detalhada das Estratégias de Poda Automática

## O Que Você Será Capaz de Fazer

- Entender o funcionamento das três estratégias de poda automática
- Saber quando habilitar ou desabilitar cada estratégia
- Otimizar os efeitos das estratégias através de configuração

## Seu Dilema Atual

À medida que a conversa se estende, as chamadas de ferramentas no contexto se acumulam:
- A IA lê repetidamente o mesmo arquivo, inserindo o conteúdo completo no contexto a cada vez
- Após escrever um arquivo e lê-lo novamente, o conteúdo de escrita original ainda está "acumulando poeira" no contexto
- Após falhas de chamadas de ferramentas, os enormes parâmetros de entrada continuam ocupando espaço

Esses problemas fazem a conta de Tokens crescer cada vez mais, e ainda podem "poluir" o contexto, afetando o julgamento da IA.

## Conceito Central

O DCP fornece três **estratégias de poda automática** que são executadas silenciosamente antes de cada solicitação, com **custo zero de LLM**:

| Estratégia | Padrão | Função |
| --- | --- | --- |
| Deduplicação | ✅ Habilitada | Detecta chamadas de ferramentas duplicadas, mantém apenas a mais recente |
| Substituição de Escritas | ❌ Desabilitada | Limpa entradas de operações de escrita já substituídas por leituras |
| Limpeza de Erros | ✅ Habilitada | Limpa entradas de ferramentas com erro após N turnos |

Todas as estratégias seguem estas regras:
- **Pula ferramentas protegidas**: Ferramentas críticas como task, write, edit não serão podadas
- **Pula arquivos protegidos**: Caminhos de arquivos protegidos por padrões glob configurados
- **Mantém mensagens de erro**: A estratégia de limpeza de erros remove apenas parâmetros de entrada, mantendo informações de erro

---

## Estratégia de Deduplicação

### Funcionamento

A estratégia de deduplicação detecta chamadas repetidas com **mesmo nome de ferramenta e parâmetros**, mantendo apenas a mais recente.

::: info Mecanismo de Correspondência de Assinatura

O DCP determina duplicatas através de "assinatura":
- Nome da ferramenta idêntico
- Valores de parâmetros idênticos (ignora null/undefined, ordem das chaves não afeta)

Exemplo:
```json
// 1ª chamada
{ "tool": "read", "path": "src/config.ts" }

// 2ª chamada (assinatura idêntica)
{ "tool": "read", "path": "src/config.ts" }

// 3ª chamada (assinatura diferente)
{ "tool": "read", "path": "src/utils.ts" }
```
:::

### Cenários de Uso

**Recomendado habilitar** (habilitado por padrão):
- IA lê frequentemente o mesmo arquivo para análise de código
- Consulta repetida da mesma configuração em múltiplos turnos
- Cenários onde é necessário manter o estado mais recente, saídas históricas podem ser descartadas

**Pode querer desabilitar**:
- Necessidade de manter o contexto de cada chamada de ferramenta (como depuração de saídas de ferramentas)

### Método de Configuração

```json
// ~/.config/opencode/dcp.jsonc
{
  "$schema": "https://raw.githubusercontent.com/Opencode-DCP/opencode-dynamic-context-pruning/main/dcp.schema.json",
  "strategies": {
    "deduplication": {
      "enabled": true  // true habilita, false desabilita
    }
  }
}
```

**Ferramentas protegidas** (não podadas por padrão):
- task, write, edit, batch, plan_enter, plan_exit
- todowrite, todoread (ferramentas de lista de tarefas)
- discard, extract (ferramentas próprias do DCP)

Essas ferramentas não podem ser podadas por deduplicação mesmo na configuração (proteção hardcoded).

---

## Estratégia de Substituição de Escritas

### Funcionamento

A estratégia de substituição de escritas limpa **entradas de operações de escrita já substituídas por leituras subsequentes**.

::: details Exemplo: Escrita seguida de Leitura

```text
Passo 1: Escrever arquivo
IA chama write("config.json", {...})
↓
Passo 2: Ler arquivo para confirmar
IA chama read("config.json") → retorna conteúdo mais recente
↓
Estratégia de substituição de escritas identifica
A entrada do write (possivelmente grande) torna-se redundante
Porque o read já capturou o estado atual do arquivo
↓
Poda
Mantém apenas a saída do read, remove a entrada do write
```

:::

### Cenários de Uso

**Recomendado habilitar**:
- Cenários de desenvolvimento iterativo frequente "escrever→verificar→modificar"
- Operações de escrita contêm grandes quantidades de templates ou conteúdo completo de arquivos

**Razão para desabilitação padrão**:
- Alguns fluxos de trabalho dependem de "histórico de escritas" como contexto
- Pode afetar algumas chamadas de ferramentas relacionadas a controle de versão

**Quando habilitar manualmente**:
```json
{
  "strategies": {
    "supersedeWrites": {
      "enabled": true
    }
  }
}
```

### Observações

Esta estratégia **poda apenas a entrada da ferramenta write**, não a saída. Porque:
- A saída do write geralmente é uma mensagem de confirmação (pequena)
- A entrada do write pode conter conteúdo completo do arquivo (grande)

---

## Estratégia de Limpeza de Erros

### Funcionamento

A estratégia de limpeza de erros, após falha de chamada de ferramenta, aguarda N turnos e então remove **parâmetros de entrada** (mantém mensagem de erro).

::: info O que é um turno (turn)?
Em conversas do OpenCode:
- Usuário envia mensagem → IA responde = 1 turno
- Chamadas de ferramentas não contam como turnos separados

O limiar padrão é 4 turnos, significando que entradas de ferramentas com erro serão automaticamente limpas após 4 turnos.
:::

### Cenários de Uso

**Recomendado habilitar** (habilitado por padrão):
- Falha de chamada de ferramenta com entrada grande (como falha ao ler arquivo muito grande)
- Informação de erro precisa ser mantida, mas parâmetros de entrada não têm mais valor

**Pode querer desabilitar**:
- Necessidade de manter entrada completa de ferramentas falhadas para depuração
- Encontra frequentemente erros "intermitentes", deseja manter histórico

### Método de Configuração

```json
{
  "strategies": {
    "purgeErrors": {
      "enabled": true,   // Alternância de habilitação
      "turns": 4        // Limiar de limpeza (número de turnos)
    }
  }
}
```

**Ferramentas protegidas** (não podadas por padrão):
- Mesma lista de ferramentas protegidas da estratégia de deduplicação

---

## Ordem de Execução das Estratégias

As três estratégias são executadas em **ordem fixa**:

```mermaid
graph LR
    A["Lista de Mensagens"] --> B["Sincronizar Cache de Ferramentas"]
    B --> C["Estratégia de Deduplicação"]
    C --> D["Estratégia de Substituição de Escritas"]
    D --> E["Estratégia de Limpeza de Erros"]
    E --> F["Substituição de Conteúdo Podado"]
```

Isso significa:
1. Primeiro deduplicação (reduz redundância)
2. Depois substituição de escritas (limpa escritas invalidadas)
3. Por último limpeza de erros (limpa entradas de erro expiradas)

Cada estratégia se baseia no resultado da estratégia anterior, não podando repetidamente a mesma ferramenta.

---

## Alertas de Armadilhas

### ❌ Equívoco 1: Achar que todas as ferramentas serão podadas automaticamente

**Problema**: Por que ferramentas como task, write não foram podadas?

**Razão**: Essas ferramentas estão na **lista de ferramentas protegidas**, com proteção hardcoded.

**Solução**:
- Se realmente precisa podar write, considere habilitar a estratégia de substituição de escritas
- Se precisa podar task, pode controlar indiretamente através de configuração adicionando caminhos de arquivos protegidos

### ❌ Equívoco 2: Estratégia de substituição de escritas causa contexto incompleto

**Problema**: Após habilitar substituição de escritas, a IA não encontra conteúdo de escrita anterior.

**Razão**: A estratégia limpa apenas operações de escrita "já substituídas por leitura", mas se após escrever nunca foi lido, não será podado.

**Solução**:
- Verifique se o arquivo foi realmente lido (`/dcp context` pode visualizar)
- Se realmente precisa manter registro de escritas, desabilite esta estratégia

### ❌ Equívoco 3: Estratégia de limpeza de erros limpa muito rápido

**Problema**: Entrada de erro acabou de ser podada, IA imediatamente encontra o mesmo erro novamente.

**Razão**: Limiar `turns` configurado muito pequeno.

**Solução**:
```json
{
  "strategies": {
    "purgeErrors": {
      "turns": 8  // Aumentar de padrão 4 para 8
    }
  }
}
```

---

## Quando Usar Esta Técnica

| Cenário | Combinação de Estratégias Recomendada |
| --- | --- |
| Desenvolvimento diário (mais leitura, menos escrita) | Deduplicação + Limpeza de erros (configuração padrão) |
| Verificação frequente de escritas | Todas habilitadas (habilitar manualmente substituição de escritas) |
| Depuração de falhas de ferramentas | Apenas deduplicação (desabilitar limpeza de erros) |
| Necessidade de histórico completo de contexto | Todas desabilitadas |

---

## Resumo da Lição

- **Estratégia de deduplicação**: Detecta chamadas de ferramentas duplicadas, mantém a mais recente (habilitada por padrão)
- **Estratégia de substituição de escritas**: Limpa entradas de operações de escrita já substituídas por leituras (desabilitada por padrão)
- **Estratégia de limpeza de erros**: Limpa entradas de ferramentas com erro após N turnos (habilitada por padrão, limiar 4)
- Todas as estratégias pulam ferramentas protegidas e caminhos de arquivos protegidos
- Estratégias executam em ordem fixa: deduplicação → substituição de escritas → limpeza de erros

---

## Prévia da Próxima Lição

> Na próxima lição aprenderemos **[Ferramentas de Poda Orientadas por LLM](../llm-tools/)**.
>
> Você aprenderá:
> - Como a IA chama autonomamente as ferramentas discard e extract
> - Forma de implementação de otimização de contexto em nível semântico
> - Melhores práticas para extração de descobertas-chave

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver localizações do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Implementação da estratégia de deduplicação | [`lib/strategies/deduplication.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/deduplication.ts) | 13-83 |
| Implementação da estratégia de substituição de escritas | [`lib/strategies/supersede-writes.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/supersede-writes.ts) | 16-105 |
| Implementação da estratégia de limpeza de erros | [`lib/strategies/purge-errors.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/purge-errors.ts) | 16-80 |
| Exportação de entrada de estratégias | [`lib/strategies/index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/index.ts) | 1-5 |
| Configuração padrão | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 423-464 |
| Lista de ferramentas protegidas | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 68-79 |

**Funções-chave**:
- `deduplicate()` - Função principal da estratégia de deduplicação
- `supersedeWrites()` - Função principal da estratégia de substituição de escritas
- `purgeErrors()` - Função principal da estratégia de limpeza de erros
- `createToolSignature()` - Criar assinatura de ferramenta para correspondência de deduplicação
- `normalizeParameters()` - Normalização de parâmetros (remover null/undefined)
- `sortObjectKeys()` - Ordenação de chaves de parâmetros (garantir consistência de assinatura)

**Valores de configuração padrão**:
- `strategies.deduplication.enabled = true`
- `strategies.supersedeWrites.enabled = false`
- `strategies.purgeErrors.enabled = true`
- `strategies.purgeErrors.turns = 4`

**Ferramentas protegidas (não podadas por padrão)**:
- task, todowrite, todoread, discard, extract, batch, write, edit, plan_enter, plan_exit

</details>
