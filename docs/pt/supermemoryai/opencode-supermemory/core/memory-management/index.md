---
title: "Memória: Escopo e Ciclo de Vida | opencode-supermemory"
sidebarTitle: "Escopo de Memória"
subtitle: "Escopo de Memória e Ciclo de Vida: Gerencie Seu Cérebro Digital"
description: "Compreenda os escopos User e Project do opencode-supermemory. Domine operações CRUD de memória para reutilização entre projetos e isolamento."
tags:
  - "memory-management"
  - "scope"
  - "crud"
prerequisite:
  - "core-tools"
order: 3
---

# Escopo de Memória e Ciclo de Vida: Gerencie Seu Cérebro Digital

## O Que Você Vai Aprender

- **Diferenciar escopos**: Entenda quais memórias "vão com você" (entre projetos) e quais "vão com o projeto" (específicas do projeto).
- **Gerenciar memórias**: Aprenda a visualizar, adicionar e excluir memórias manualmente, mantendo a cognição do Agent limpa.
- **Depurar o Agent**: Quando o Agent "lembra errado", saiba onde corrigir.

## Ideia Central

opencode-supermemory divide memórias em dois **escopos (Scope)** isolados, semelhantes a variáveis globais e locais em linguagens de programação.

### 1. Dois Escopos

| Escopo | Identificador (Scope ID) | Ciclo de Vida | Uso Típico |
| :--- | :--- | :--- | :--- |
| **User Scope**<br>(Escopo do Usuário) | `user` | **Segue você permanentemente**<br>Compartilhado entre todos os projetos | • Preferências de estilo de codificação (ex: "gosta de TypeScript")<br>• Hábitos pessoais (ex: "sempre escreve comentários")<br>• Conhecimento geral |
| **Project Scope**<br>(Escopo do Projeto) | `project` | **Limitado ao projeto atual**<br>Expira ao mudar de diretório | • Design de arquitetura do projeto<br>• Explicações de lógica de negócios<br>• Soluções para Bugs específicos |

::: info Como os escopos são gerados?
O plugin gera tags únicas automaticamente através de `src/services/tags.ts`:
- **User Scope**: Baseado no hash do email Git (`opencode_user_{hash}`).
- **Project Scope**: Baseado no hash do caminho do projeto atual (`opencode_project_{hash}`).
:::

### 2. Ciclo de Vida da Memória

1. **Criar (Add)**: Escrita por inicialização CLI ou conversa com Agent (`Remember this...`).
2. **Ativar (Inject)**: Ao iniciar cada nova sessão, o plugin puxa automaticamente memórias User e Project relevantes e injeta no contexto.
3. **Recuperar (Search)**: Durante a conversa, o Agent pode pesquisar ativamente memórias específicas.
4. **Esquecer (Forget)**: Quando memórias ficam desatualizadas ou erradas, exclua por ID.

---

## Siga-me: Gerencie Suas Memórias

Vamos gerenciar manualmente memórias desses dois escopos conversando com o Agent.

### Passo 1: Visualizar Memórias Existentes

Primeiro, veja o que o Agent lembra agora.

**Operação**: Na caixa de chat do OpenCode, digite:

```text
Liste todas as memórias do projeto atual
```

**Você deve ver**:
O Agent chama o modo `list` da ferramenta `supermemory` e retorna uma lista:

```json
// Exemplo de saída
{
  "success": true,
  "scope": "project",
  "count": 3,
  "memories": [
    {
      "id": "mem_123456",
      "content": "O projeto usa arquitetura MVC, a camada Service é responsável pela lógica de negócios",
      "createdAt": "2023-10-01T10:00:00Z"
    }
    // ...
  ]
}
```

### Passo 2: Adicionar Memória Entre Projetos (User Scope)

Suponha que você deseja que o Agent responda em chinês em **todos** os projetos. Esta é uma memória adequada para o User Scope.

**Operação**: Digite o seguinte comando:

```text
Lembre-se de minha preferência pessoal: não importa em qual projeto, sempre responda em chinês.
Salve no User Scope.
```

**Você deve ver**:
O Agent chama a ferramenta `add`, parâmetro `scope: "user"`:

```json
{
  "mode": "add",
  "content": "Usuário prefere respostas em chinês em todos os projetos",
  "scope": "user",
  "type": "preference"
}
```

O sistema confirma que a memória foi adicionada e retorna um `id`.

### Passo 3: Adicionar Memória Específica do Projeto (Project Scope)

Agora, adicionamos uma regra específica para o **projeto atual**.

**Operação**: Digite o seguinte comando:

```text
Lembre-se: neste projeto, todos os formatos de data devem ser YYYY-MM-DD.
Salve no Project Scope.
```

**Você deve ver**:
O Agent chama a ferramenta `add`, parâmetro `scope: "project"` (este é o valor padrão, o Agent pode omitir):

```json
{
  "mode": "add",
  "content": "Formato de data deve ser YYYY-MM-DD neste projeto",
  "scope": "project",
  "type": "project-config"
}
```

### Passo 4: Verificar Isolamento

Para verificar se o escopo está funcionando, podemos tentar pesquisar.

**Operação**: Digite:

```text
Pesquise memórias sobre "formato de data"
```

**Você deve ver**:
O Agent chama a ferramenta `search`. Se ele especificar `scope: "project"` ou realizar uma pesquisa mista, deve encontrar a memória que acabamos de adicionar.

::: tip Verificar capacidade entre projetos
Se você abrir uma nova janela de terminal, entrar em um diretório de projeto diferente e perguntar novamente sobre "formato de data", o Agent **não deve conseguir** encontrar essa memória (porque ela está isolada no Project Scope do projeto original). Mas se você perguntar "em qual idioma prefere que eu responda", ele deve conseguir recuperar a preferência "responder em chinês" do User Scope.
:::

### Passo 5: Excluir Memórias Desatualizadas

Se os padrões do projeto mudaram, precisamos excluir memórias antigas.

**Operação**:
1. Primeiro execute o **Passo 1** para obter o ID da memória (por exemplo, `mem_987654`).
2. Digite o comando:

```text
Esqueça a memória com ID mem_987654 sobre formato de data.
```

**Você deve ver**:
O Agent chama a ferramenta `forget`:

```json
{
  "mode": "forget",
  "memoryId": "mem_987654"
}
```

O sistema retorna `success: true`.

---

## Perguntas Frequentes (FAQ)

### P: Se eu trocar de computador, as memórias do User Scope ainda estarão lá?
**R: Depende da sua configuração do Git.**
O User Scope é gerado com base em `git config user.email`. Se você usar o mesmo email Git em dois computadores e conectar à mesma conta Supermemory (usando a mesma API Key), então as memórias estão **sincronizadas**.

### P: Por que não consigo ver a memória que acabei de adicionar?
**R: Pode ser cache ou atraso de indexação.**
O índice vetorial do Supermemory geralmente é em nível de segundos, mas pode haver um breve atraso devido a flutuações de rede. Além disso, o contexto injetado pelo Agent no início da sessão é **estático** (instantâneo), novas memórias podem precisar reiniciar a sessão (`/clear` ou reiniciar o OpenCode) para ter efeito na "injeção automática", mas podem ser encontradas imediatamente através da ferramenta `search`.

---

## Apêndice: Referência de Código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Última atualização: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Linha |
| :--- | :--- | :--- |
| Lógica de geração de Scope | [`src/services/tags.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/tags.ts#L18-L36) | 18-36 |
| Definição da ferramenta de memória | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L183-L485) | 183-485 |
| Definição de tipos de memória | [`src/types/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/types/index.ts) | - |
| Implementação do cliente | [`src/services/client.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/client.ts) | 23-182 |

**Funções-chave**:
- `getUserTag()`: Gera tag de usuário baseada no email Git
- `getProjectTag()`: Gera tag de projeto baseada no caminho do diretório
- `supermemoryClient.addMemory()`: Chamada de API para adicionar memória
- `supermemoryClient.deleteMemory()`: Chamada de API para excluir memória

</details>

## Próxima Lição

> Próxima lição: **[Princípio de Compactação Preemptiva](../../advanced/compaction/index.md)**.
>
> Você aprenderá:
> - Por que o Agent "esquece" (estouro de contexto)
> - Como o plugin detecta automaticamente o uso de Tokens
> - Como compactar sessões sem perder informações críticas
