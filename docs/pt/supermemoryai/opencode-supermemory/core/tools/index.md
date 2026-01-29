---
title: "Ferramentas de Memória | opencode-supermemory"
sidebarTitle: "Ferramentas"
subtitle: "Detalhamento do Conjunto de Ferramentas: Ensine o Agent a Memorizar"
description: "Domine os 5 modos da ferramenta supermemory (add, search, profile, list, forget). Aprenda a controlar o comportamento de memória do Agent via linguagem natural."
tags:
  - "Uso de Ferramentas"
  - "Gerenciamento de Memória"
  - "Funcionalidades Principais"
prerequisite:
  - "start-getting-started"
order: 2
---

# Detalhamento do Conjunto de Ferramentas: Ensine o Agent a Memorizar

## O Que Você Poderá Fazer Após Concluir

Nesta lição, você dominará o método de interação principal do plugin `supermemory`. Embora o Agent geralmente gerencie as memórias automaticamente, como desenvolvedor, você frequentemente precisará intervir manualmente.

Após concluir esta lição, você será capaz de:
1.  Usar o modo `add` para salvar manualmente decisões técnicas críticas.
2.  Usar o modo `search` para verificar se o Agent se lembrou de suas preferências.
3.  Usar `profile` para ver o "você" sob a ótica do Agent.
4.  Usar `list` e `forget` para limpar memórias desatualizadas ou incorretas.

## Ideia Central

O opencode-supermemory não é uma caixa preta, ele interage com o Agent através do protocolo padrão OpenCode Tool. Isso significa que você pode chamá-lo como se chamasse uma função, ou também pode comandar o Agent a usá-lo através de linguagem natural.

O plugin registra uma ferramenta chamada `supermemory` com o Agent, que é como um canivete suíço com 6 modos:

| Modo | Função | Cenário Típico |
| :--- | :--- | :--- |
| **add** | Adicionar memória | "Lembre-se, este projeto deve ser executado com Bun" |
| **search** | Pesquisar memória | "Eu já disse antes como lidar com autenticação?" |
| **profile** | Perfil do usuário | Ver os hábitos de codificação que o Agent resumiu sobre você |
| **list** | Listar memórias | Auditar as 10 memórias salvas recentemente |
| **forget** | Excluir memória | Excluir um registro de configuração incorreto |
| **help** | Guia de uso | Ver a documentação de ajuda da ferramenta |

::: info Mecanismo de Disparo Automático
Além da chamada manual, o plugin também monitorará o conteúdo do seu chat. Quando você diz através de linguagem natural "Remember this" ou "Save this", o plugin detectará automaticamente as palavras-chave e forçará o Agent a chamar a ferramenta `add`.
:::

## Siga Junto: Gerenciar Memórias Manualmente

Embora geralmente deixemos o Agent operar automaticamente, ao depurar ou criar memórias iniciais, chamar as ferramentas manualmente é muito útil. Você pode comandar o Agent a executar essas operações diretamente na caixa de diálogo do OpenCode usando linguagem natural.

### 1. Adicionar Memória (Add)

Esta é a funcionalidade mais usada. Você pode especificar o conteúdo, tipo e escopo da memória.

**Ação**: Diga ao Agent para salvar uma memória sobre a arquitetura do projeto.

**Instrução de entrada**:
```text
Use a ferramenta supermemory para salvar uma memória:
Conteúdo: "Todo o código da camada de serviço deste projeto deve ser colocado no diretório src/services"
Tipo: architecture
Escopo: project
```

**Comportamento interno do Agent** (lógica do código fonte):
```json
{
  "tool": "supermemory",
  "args": {
    "mode": "add",
    "content": "Todo o código da camada de serviço deste projeto deve ser colocado no diretório src/services",
    "type": "architecture",
    "scope": "project"
  }
}
```

**O que você deve ver**:
O Agent retorna uma confirmação semelhante a esta:
> ✅ Memory added to project scope (ID: mem_12345...)

::: tip Escolha do Tipo de Memória (Type)
Para tornar a recuperação mais precisa, recomenda-se usar tipos precisos:
- `project-config`: Stack tecnológica, configuração de ferramentas
- `architecture`: Padrões de arquitetura, estrutura de diretórios
- `preference`: Suas preferências pessoais de codificação (ex: "prefere arrow functions")
- `error-solution`: Solução específica para um determinado erro
- `learned-pattern`: Padrões de código observados pelo Agent
:::

### 2. Pesquisar Memória (Search)

Quando você quer confirmar se o Agent "sabe" sobre algo, pode usar a função de busca.

**Ação**: Pesquisar memórias sobre "serviços".

**Instrução de entrada**:
```text
Consulte o supermemory, a palavra-chave é "services", o escopo é project
```

**Comportamento interno do Agent**:
```json
{
  "tool": "supermemory",
  "args": {
    "mode": "search",
    "query": "services",
    "scope": "project"
  }
}
```

**O que você deve ver**:
O Agent lista os fragmentos de memória relevantes e sua similaridade (Similarity).

### 3. Ver Perfil do Usuário (Profile)

O Supermemory manterá automaticamente um "perfil de usuário", contendo suas preferências de longo prazo.

**Ação**: Ver seu perfil.

**Instrução de entrada**:
```text
Chame o modo profile da ferramenta supermemory para ver o que você sabe sobre mim
```

**O que você deve ver**:
Retorna duas categorias de informações:
- **Static**: Fatos estáticos (ex: "o usuário é um engenheiro full-stack")
- **Dynamic**: Preferências dinâmicas (ex: "o usuário tem se interessado recentemente por Rust")

### 4. Auditoria e Esquecimento (List & Forget)

Se o Agent se lembrou de informações incorretas (como uma API Key descontinuada), você precisa excluí-las.

**Primeiro passo: Listar memórias recentes**
```text
Liste as 5 memórias do projeto mais recentes
```
*(Agent chama `mode: "list", limit: 5`)*

**Segundo passo: Obter o ID e excluir**
Suponha que você veja uma memória incorreta com ID `mem_abc123`.

```text
Exclua o registro com ID de memória mem_abc123
```
*(Agent chama `mode: "forget", memoryId: "mem_abc123"`)*

**O que você deve ver**:
> ✅ Memory mem_abc123 removed from project scope

## Avançado: Disparo por Linguagem Natural

Você não precisa descrever detalhadamente os parâmetros da ferramenta toda vez. O plugin possui um mecanismo integrado de detecção de palavras-chave.

**Experimente**:
Na conversa, diga diretamente:
> **Remember this**: Todo o processamento de datas deve usar a biblioteca date-fns, o uso de moment.js é proibido.

**O que aconteceu?**
1.  O hook `chat.message` do plugin detectou a palavra-chave "Remember this".
2.  O plugin injetou um prompt de sistema no Agent: `[MEMORY TRIGGER DETECTED]`.
3.  O Agent recebeu a instrução: "You MUST use the supermemory tool with mode: 'add'...".
4.  O Agent extraiu automaticamente o conteúdo e chamou a ferramenta.

Esta é uma forma de interação muito natural, permitindo que você "congele" conhecimento a qualquer momento durante o processo de codificação.

## Perguntas Frequentes (FAQ)

**P: Qual é o padrão do `scope`?**
R: O padrão é `project`. Se você quiser salvar preferências que se aplicam a todos os projetos (como "sempre uso TypeScript"), especifique explicitamente `scope: "user"`.

**P: Por que a memória que adicionei não entrou em vigor imediatamente?**
R: A operação `add` é assíncrona. Geralmente, o Agent "saberá" sobre esta nova memória imediatamente após a chamada da ferramenta ser bem-sucedida, mas em alguns casos extremos de latência de rede, pode levar alguns segundos.

**P: Informações sensíveis serão enviadas?**
R: O plugin automaticamente desanonymiza o conteúdo dentro de tags `<private>`. Mas por segurança, recomenda-se não colocar senhas ou API Keys nas memórias.

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Linhas |
| :--- | :--- | :--- |
| Definição da ferramenta | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L183-L485) | 183-485 |
| Detecção de palavras-chave | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L34-L37) | 34-37 |
| Prompt de disparo | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L20-L28) | 20-28 |
| Implementação do cliente | [`src/services/client.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/client.ts) | Arquivo completo |

**Definições de tipos principais**:
- `MemoryType`: Definido em [`src/types/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/types/index.ts)
- `MemoryScope`: Definido em [`src/types/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/types/index.ts)

</details>

## Próxima Lição

> Na próxima lição, aprenderemos sobre **[Escopo de Memória e Ciclo de Vida](../memory-management/index.md)**.
>
> Você aprenderá:
> - Mecanismo de isolamento subjacente entre User Scope e Project Scope
> - Como projetar estratégias de partição de memória eficientes
> - Gerenciamento do ciclo de vida das memórias
