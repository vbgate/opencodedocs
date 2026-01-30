---
title: "Tarefas em Segundo Plano: Execução Paralela de Múltiplos Agentes | oh-my-opencode"
sidebarTitle: "Múltiplas IAs Trabalhando Simultaneamente"
subtitle: "Tarefas em Segundo Plano: Execução Paralela de Múltiplos Agentes | oh-my-opencode"
description: "Aprenda sobre o sistema de tarefas em segundo plano do oh-my-opencode e sua capacidade de execução paralela. Domine o controle de concorrência em três níveis, gerenciamento do ciclo de vida de tarefas e uso das ferramentas delegate_task e background_output."
tags:
  - "background-tasks"
  - "parallel-execution"
  - "concurrency"
prerequisite:
  - "start-sisyphus-orchestrator"
order: 80
---

# Tarefas Paralelas em Segundo Plano: Trabalhando como uma Equipe

## O Que Você Vai Aprender

- ✅ Iniciar múltiplas tarefas paralelas em segundo plano, permitindo que diferentes agentes de IA trabalhem simultaneamente
- ✅ Configurar limites de concorrência para evitar limitação de taxa de API e custos descontrolados
- ✅ Obter resultados de tarefas em segundo plano sem precisar esperar a conclusão
- ✅ Cancelar tarefas e liberar recursos

## O Problema Atual

**Apenas uma pessoa fazendo o trabalho?**

Imagine este cenário:
- Você precisa que o agente **Explore** encontre a implementação de autenticação na base de código
- Ao mesmo tempo, o agente **Librarian** pesquisa as melhores práticas
- E o agente **Oracle** revisa o design da arquitetura

Se executado sequencialmente, o tempo total = 10 minutos + 15 minutos + 8 minutos = **33 minutos**

Mas e se pudéssemos executar em paralelo? Com 3 agentes trabalhando simultaneamente, o tempo total = **max(10, 15, 8) = 15 minutos**, economizando **54%** do tempo.

**Problema**: Por padrão, o OpenCode só pode processar uma sessão por vez. Para alcançar paralelismo, você precisa gerenciar manualmente múltiplas janelas ou esperar as tarefas terminarem.

**Solução**: O sistema de tarefas em segundo plano do oh-my-opencode pode executar múltiplos agentes de IA simultaneamente, rastreando seu progresso em segundo plano enquanto você continua com outras atividades.

## Quando Usar Esta Técnica

Cenários onde o sistema de tarefas em segundo plano pode aumentar a eficiência:

| Cenário | Exemplo | Valor |
| --- | --- | --- |
| **Pesquisa Paralela** | Explore encontra implementação + Librarian consulta documentação | 3x mais rápido na pesquisa |
| **Revisão Multi-especialista** | Oracle revisa arquitetura + Momus valida plano | Feedback rápido de múltiplas perspectivas |
| **Tarefas Assíncronas** | Revisão de código enquanto faz commit no Git | Não bloqueia o fluxo principal |
| **Recursos Limitados** | Limitar concorrência para evitar limitação de taxa de API | Controle de custos e estabilidade |

::: tip Modo Ultrawork
Adicione `ultrawork` ou `ulw` ao seu prompt para ativar automaticamente o modo de máximo desempenho, incluindo todos os agentes especializados e tarefas paralelas em segundo plano. Nenhuma configuração manual necessária.
:::

## 🎒 Antes de Começar

::: warning Pré-requisitos

Antes de iniciar este tutorial, certifique-se de que:
1. Você instalou o oh-my-opencode (veja o [Tutorial de Instalação](../../start/installation/))
2. Você completou a configuração básica com pelo menos um Provedor de IA disponível
3. Você entende o uso básico do orquestrador Sisyphus (veja o [Tutorial do Sisyphus](../sisyphus-orchestrator/))

:::

## Conceitos Fundamentais

O princípio de funcionamento do sistema de tarefas em segundo plano pode ser resumido em três conceitos principais:

### 1. Execução Paralela

O sistema de tarefas em segundo plano permite iniciar múltiplas tarefas de agentes de IA simultaneamente, cada uma executando em uma sessão independente. Isso significa:

- **Explore** pesquisa código
- **Librarian** consulta documentação
- **Oracle** revisa design

Três tarefas executam em paralelo, e o tempo total é igual ao da tarefa mais lenta.

### 2. Controle de Concorrência

Para evitar que muitas tarefas iniciadas simultaneamente causem limitação de taxa de API ou custos descontrolados, o sistema fornece controle de concorrência em três níveis:

```
Prioridade: Model > Provider > Default

Exemplo de configuração:
modelConcurrency:     claude-opus-4-5 → 2
providerConcurrency:  anthropic → 3
defaultConcurrency:   todos → 5
```

**Regras**:
- Se um limite de nível de modelo for especificado, use esse limite
- Caso contrário, se um limite de nível de provedor for especificado, use esse limite
- Caso contrário, use o limite padrão (valor padrão 5)

### 3. Mecanismo de Polling

O sistema verifica o status das tarefas a cada 2 segundos para determinar se estão concluídas. Condições de conclusão:

- **Sessão ociosa** (evento session.idle)
- **Detecção de estabilidade**: 3 verificações consecutivas com contagem de mensagens inalterada
- **Lista TODO vazia**: Todas as tarefas foram concluídas

## Siga Comigo

### Passo 1: Iniciar Tarefas em Segundo Plano

Use a ferramenta `delegate_task` para iniciar tarefas em segundo plano:

```markdown
Iniciar tarefas paralelas em segundo plano:

1. Explore encontra implementação de autenticação
2. Librarian pesquisa melhores práticas
3. Oracle revisa design de arquitetura

Executar em paralelo:
```

**Por quê**
Este é o caso de uso mais clássico para demonstrar tarefas em segundo plano. 3 tarefas podem ser executadas simultaneamente, economizando tempo significativo.

**O Que Você Deve Ver**
O sistema retornará 3 IDs de tarefas:

```
Background task launched successfully.

Task ID: bg_abc123
Session ID: sess_xyz789
Description: Explore: encontrar implementação de autenticação
Agent: explore
Status: pending
...

Background task launched successfully.

Task ID: bg_def456
Session ID: sess_uvwx012
Description: Librarian: pesquisar melhores práticas
Agent: librarian
Status: pending
...
```

::: info Explicação dos Status das Tarefas
- **pending**: Na fila aguardando slot de concorrência
- **running**: Em execução
- **completed**: Concluída
- **error**: Erro
- **cancelled**: Cancelada
:::

### Passo 2: Verificar Status da Tarefa

Use a ferramenta `background_output` para verificar o status da tarefa:

```markdown
Verificar status de bg_abc123:
```

**Por quê**
Para saber se a tarefa está concluída ou ainda em execução. Por padrão, não espera e retorna o status imediatamente.

**O Que Você Deve Ver**
Se a tarefa ainda estiver em execução:

```
## Task Status

| Field | Value |
| --- | --- |
| Task ID | `bg_abc123` |
| Description | Explore: encontrar implementação de autenticação |
| Agent | explore |
| Status | **running** |
| Duration | 2m 15s |
| Session ID | `sess_xyz789` |

> **Note**: No need to wait explicitly - system will notify you when this task completes.

## Original Prompt

Encontrar implementação de autenticação no diretório src/auth, incluindo login, registro, gerenciamento de Token, etc.
```

Se a tarefa estiver concluída:

```
Task Result

Task ID: bg_abc123
Description: Explore: encontrar implementação de autenticação
Duration: 5m 32s
Session ID: sess_xyz789

---

Encontradas 3 implementações de autenticação:
1. `src/auth/login.ts` - Autenticação JWT
2. `src/auth/register.ts` - Registro de usuário
3. `src/auth/token.ts` - Atualização de Token
...
```

### Passo 3: Configurar Controle de Concorrência

Edite `~/.config/opencode/oh-my-opencode.json`:

```jsonc
{
  "$schema": "https://code-yeongyu.github.io/oh-my-opencode/schema.json",

  "background_task": {
    // Limite de concorrência por provedor (configuração recomendada)
    "providerConcurrency": {
      "anthropic": 3,     // Modelos Anthropic: máximo 3 simultâneos
      "openai": 2,         // Modelos OpenAI: máximo 2 simultâneos
      "google": 2          // Modelos Google: máximo 2 simultâneos
    },

    // Limite de concorrência por modelo (prioridade mais alta)
    "modelConcurrency": {
      "claude-opus-4-5": 2,    // Opus 4.5: máximo 2 simultâneos
      "gpt-5.2": 2              // GPT 5.2: máximo 2 simultâneos
    },

    // Limite de concorrência padrão (usado quando nenhum dos acima está configurado)
    "defaultConcurrency": 3
  }
}
```

**Por quê**
O controle de concorrência é fundamental para evitar custos descontrolados. Se você não definir limites, iniciar 10 tarefas Opus 4.5 simultaneamente pode consumir rapidamente sua cota de API.

::: tip Configuração Recomendada
Para a maioria dos cenários, a configuração recomendada é:
- `providerConcurrency.anthropic: 3`
- `providerConcurrency.openai: 2`
- `defaultConcurrency: 5`
:::

**O Que Você Deve Ver**
Após a configuração entrar em vigor, ao iniciar tarefas em segundo plano:
- Se o limite de concorrência for atingido, as tarefas entrarão no status **pending** e aguardarão na fila
- Assim que uma tarefa for concluída, as tarefas na fila serão iniciadas automaticamente

### Passo 4: Cancelar Tarefas

Use a ferramenta `background_cancel` para cancelar tarefas:

```markdown
Cancelar todas as tarefas em segundo plano:
```

**Por quê**
Às vezes as tarefas travam ou não são mais necessárias, e você pode cancelá-las proativamente para liberar recursos.

**O Que Você Deve Ver**

```
Cancelled 3 background task(s):

| Task ID | Description | Status | Session ID |
| --- | --- | --- | --- |
| `bg_abc123` | Explore: encontrar implementação de autenticação | running | `sess_xyz789` |
| `bg_def456` | Librarian: pesquisar melhores práticas | running | `sess_uvwx012` |
| `bg_ghi789` | Oracle: revisar design de arquitetura | pending | (not started) |

## Continue Instructions

To continue a cancelled task, use:

    delegate_task(session_id="<session_id>", prompt="Continue: <your follow-up>")

Continuable sessions:
- `sess_xyz789` (Explore: encontrar implementação de autenticação)
- `sess_uvwx012` (Librarian: pesquisar melhores práticas)
```

## Checkpoint ✅

Confirme que você entendeu os seguintes pontos:

- [ ] Consegue iniciar múltiplas tarefas paralelas em segundo plano
- [ ] Entende os status das tarefas (pending, running, completed)
- [ ] Configurou limites de concorrência razoáveis
- [ ] Consegue visualizar e obter resultados das tarefas
- [ ] Consegue cancelar tarefas desnecessárias

## Armadilhas Comuns

### Armadilha 1: Esquecer de Configurar Limites de Concorrência

**Sintoma**: Iniciar muitas tarefas e esgotar a cota de API instantaneamente, ou acionar Rate Limit.

**Solução**: Configure `providerConcurrency` ou `defaultConcurrency` em `oh-my-opencode.json`.

### Armadilha 2: Verificar Resultados com Polling Muito Frequente

**Sintoma**: Chamar `background_output` a cada poucos segundos para verificar o status da tarefa, adicionando sobrecarga desnecessária.

**Solução**: O sistema notificará você automaticamente quando a tarefa for concluída. Verifique manualmente apenas quando realmente precisar de resultados intermediários.

### Armadilha 3: Timeout de Tarefa

**Sintoma**: Tarefa é cancelada automaticamente após executar por mais de 30 minutos.

**Causa**: Tarefas em segundo plano têm um TTL (tempo de vida) de 30 minutos.

**Solução**: Se você precisar de tarefas de longa duração, considere dividi-las em múltiplas subtarefas, ou use `delegate_task(background=false)` para executar em primeiro plano.

### Armadilha 4: Tarefas Pending que Nunca Iniciam

**Sintoma**: O status da tarefa permanece `pending` e nunca entra em `running`.

**Causa**: O limite de concorrência está cheio, sem slots disponíveis.

**Solução**:
- Aguarde as tarefas existentes serem concluídas
- Aumente a configuração do limite de concorrência
- Cancele tarefas desnecessárias para liberar slots

## Resumo da Lição

O sistema de tarefas em segundo plano permite que você trabalhe como uma equipe real, com múltiplos agentes de IA executando tarefas em paralelo:

1. **Iniciar tarefas paralelas**: Use a ferramenta `delegate_task`
2. **Controlar concorrência**: Configure `providerConcurrency`, `modelConcurrency`, `defaultConcurrency`
3. **Obter resultados**: Use a ferramenta `background_output` (o sistema notifica automaticamente)
4. **Cancelar tarefas**: Use a ferramenta `background_cancel`

**Regras principais**:
- Polling do status das tarefas a cada 2 segundos
- 3 verificações estáveis consecutivas ou idle significa tarefa concluída
- Tarefas expiram automaticamente após 30 minutos
- Prioridade: modelConcurrency > providerConcurrency > defaultConcurrency

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos sobre **[LSP e AST-Grep: Ferramentas Poderosas para Refatoração de Código](../lsp-ast-tools/)**.
>
> Você aprenderá:
> - Como usar ferramentas LSP para navegação e refatoração de código
> - Como usar AST-Grep para busca e substituição precisa de padrões
> - Melhores práticas para combinar LSP e AST-Grep

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-26

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Gerenciador de tarefas em segundo plano | [`src/features/background-agent/manager.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/manager.ts) | 1-1378 |
| Controle de concorrência | [`src/features/background-agent/concurrency.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/concurrency.ts) | 1-138 |
| Ferramenta delegate_task | [`src/tools/background-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/background-task/tools.ts) | 51-119 |
| Ferramenta background_output | [`src/tools/background-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/background-task/tools.ts) | 320-384 |
| Ferramenta background_cancel | [`src/tools/background-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/background-task/tools.ts) | 386-514 |

**Constantes principais**:
- `TASK_TTL_MS = 30 * 60 * 1000`: Tempo de expiração da tarefa (30 minutos)
- `MIN_STABILITY_TIME_MS = 10 * 1000`: Tempo de início da detecção de estabilidade (10 segundos)
- `DEFAULT_STALE_TIMEOUT_MS = 180_000`: Tempo de expiração padrão (3 minutos)
- `MIN_IDLE_TIME_MS = 5000`: Tempo mínimo para ignorar idle inicial (5 segundos)

**Classes principais**:
- `BackgroundManager`: Gerenciador de tarefas em segundo plano, responsável por iniciar, rastrear, fazer polling e concluir tarefas
- `ConcurrencyManager`: Gerenciador de controle de concorrência, implementa prioridade em três níveis (model > provider > default)

**Funções principais**:
- `BackgroundManager.launch()`: Iniciar tarefa em segundo plano
- `BackgroundManager.pollRunningTasks()`: Polling do status das tarefas a cada 2 segundos (linha 1182)
- `BackgroundManager.tryCompleteTask()`: Concluir tarefa com segurança, prevenindo condições de corrida (linha 909)
- `ConcurrencyManager.getConcurrencyLimit()`: Obter limite de concorrência (linha 24)
- `ConcurrencyManager.acquire()` / `ConcurrencyManager.release()`: Adquirir/liberar slot de concorrência (linhas 41, 71)

</details>
