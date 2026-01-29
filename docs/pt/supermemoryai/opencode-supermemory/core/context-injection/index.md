---
title: "Injeção de Contexto: Agent Preditivo | opencode-supermemory"
sidebarTitle: "Injeção de Contexto"
subtitle: "Mecanismo de Injeção Automática de Contexto: Deixando o Agent 'Preditivo'"
description: "Aprenda o mecanismo de injeção de contexto do opencode-supermemory. Entenda como o Agent obtém perfil do usuário e conhecimento do projeto automaticamente no início da sessão."
tags:
  - "contexto"
  - "injeção"
  - "prompt"
  - "memória"
prerequisite:
  - "start-getting-started"
order: 1
---

# Mecanismo de Injeção Automática de Contexto: Deixando o Agent "Preditivo"

## O Que Você Poderá Fazer Após Concluir

Após concluir esta lição, você será capaz de:
1.  **Compreender** por que o Agent conhece seus hábitos de codificação e a arquitetura do projeto desde o início.
2.  **Dominar** o "modelo tridimensional" de injeção de contexto (perfil do usuário, conhecimento do projeto, memórias relevantes).
3.  **Aprender** a usar palavras-chave (como "Remember this") para intervir ativamente no comportamento de memória do Agent.
4.  **Configurar** o número de itens injetados, equilibrando o comprimento do contexto com a riqueza de informações.

---

## Ideia Central

Antes do plugin de memória, cada nova sessão era uma folha em branco para o Agent. Você precisava repetidamente dizer: "Uso TypeScript", "este projeto usa Next.js".

A **Injeção de Contexto (Context Injection)** resolve esse problema. É como inserir um "resumo de tarefas" no cérebro do Agent no momento em que ele acorda.

### Momento de Disparo

O opencode-supermemory é extremamente contido, acionando a injeção automática apenas na **primeira mensagem da sessão**.

- **Por que a primeira?** Porque é o momento crucial para estabelecer o tom da sessão.
- **E as mensagens seguintes?** As mensagens subsequentes não injetam automaticamente para evitar interferir no fluxo da conversa, a menos que você acione manualmente (veja abaixo "Disparo por palavras-chave").

### Modelo de Injeção Tridimensional

O plugin obtém paralelamente três tipos de dados, combinando-os em um bloco de prompt `[SUPERMEMORY]`:

| Dimensão de Dados | Origem | Função | Exemplo |
|--- | --- | --- | ---|
| **1. Perfil do Usuário** (Profile) | `getProfile` | Suas preferências de longo prazo | "Usuário prefere programação funcional", "prefere arrow functions" |
| **2. Conhecimento do Projeto** (Project) | `listMemories` | Conhecimento global do projeto atual | "Este projeto usa Clean Architecture", "API está em src/api" |
| **3. Memórias Relevantes** (Relevant) | `searchMemories` | Experiências passadas relacionadas à sua primeira frase | Você pergunta "como corrigir este Bug", ele busca registros de correções anteriores semelhantes |

---

## O Que é Injetado?

Quando você envia a primeira mensagem no OpenCode, o plugin默默 insere o seguinte conteúdo no System Prompt em segundo plano.

::: details Clique para ver a estrutura real do conteúdo injetado
```text
[SUPERMEMORY]

User Profile:
- User prefers concise responses
- User uses Zod for all validations

Recent Context:
- Working on auth module refactoring

Project Knowledge:
- [100%] Architecture follows MVC pattern
- [100%] Use 'npm run test' for testing

Relevant Memories:
- [85%] Previous fix for hydration error: use useEffect
```
:::

Após ver essas informações, o Agent se comportará como um funcionário experiente que trabalhou neste projeto por muito tempo, em vez de um estagiário recém-chegado.

---

## Mecanismo de Disparo por Palavras-Chave (Nudge)

Além da injeção automática no início, você pode "despertar" a função de memória a qualquer momento durante a conversa.

O plugin possui um **detector de palavras-chave** integrado. Enquanto sua mensagem contiver palavras de gatilho específicas, o plugin enviará uma "dica invisível" (Nudge) ao Agent, forçando-o a chamar a ferramenta de salvamento.

### Palavras de Gatilho Padrão

- `remember`
- `save this`
- `don't forget`
- `memorize`
- `take note`
- ... (veja mais na configuração do código fonte)

### Exemplo de Interação

**Sua entrada**:
> O formato de resposta da API mudou aqui, **remember** de agora em diante use `data.result` em vez de `data.payload`.

**Plugin detecta "remember"**:
> (injeta dica em segundo plano): `[MEMORY TRIGGER DETECTED] The user wants you to remember something...`

**Reação do Agent**:
> Entendido. Vou me lembrar dessa mudança.
> *(chama `supermemory.add` em segundo plano para salvar a memória)*

---

## Configuração Avançada

Você pode ajustar o comportamento de injeção modificando `~/.config/opencode/supermemory.jsonc`.

### Itens de Configuração Comuns

```jsonc
{
  // Se deve injetar o perfil do usuário (padrão true)
  "injectProfile": true,

  // Quantas memórias do projeto injetar por vez (padrão 10)
  // Aumentar permite que o Agent entenda melhor o projeto, mas consome mais Tokens
  "maxProjectMemories": 10,

  // Quantos itens de perfil do usuário injetar por vez (padrão 5)
  "maxProfileItems": 5,

  // Palavras de gatilho personalizadas (suporta regex)
  "keywordPatterns": [
    "记一下",
    "永久保存"
  ]
}
```

::: tip Dica
Após modificar a configuração, você precisa reiniciar o OpenCode ou recarregar o plugin para que as alterações entrem em vigor.
:::

---

## Perguntas Frequentes

### P: As informações injetadas ocuparão muitos Tokens?
**R**: Ocuparão uma parte, mas geralmente são controláveis. Na configuração padrão (10 memórias do projeto + 5 itens de perfil), isso ocupa cerca de 500-1000 Tokens. Para modelos modernos de larga escala (como Claude 3.5 Sonnet) com contexto de 200k, isso é apenas uma gota no oceano.

### P: Por que disse "remember" mas não reagiu?
**R**:
1. Verifique se a grafia está correta (suporta correspondência por regex).
2. Confirme se a API Key está configurada corretamente (se o plugin não foi inicializado, não será acionado).
3. O Agent pode decidir ignorar (embora o plugin tenha forçado a dica, o Agent tem a decisão final).

### P: Como as "memórias relevantes" são buscadas?
**R**: São baseadas no conteúdo da **sua primeira mensagem** através de busca semântica. Se sua primeira frase for apenas "Hi", pode não encontrar memórias relevantes úteis, mas "conhecimento do projeto" e "perfil do usuário" ainda serão injetados.

---

## Resumo da Lição

- **Injeção automática** só é acionada na primeira mensagem da sessão.
- **Modelo tridimensional** inclui perfil do usuário, conhecimento do projeto e memórias relevantes.
- **Disparo por palavras-chave** permite que você ordene o Agent a salvar memórias a qualquer momento.
- Você pode controlar o volume de informações injetadas através do **arquivo de configuração**.

## Próxima Lição

> Na próxima lição, aprenderemos sobre **[Ferramentas Detalhadas: Ensine o Agent a Memorizar](../tools/index.md)**.
>
> Você aprenderá:
> - Como usar manualmente as ferramentas `add`, `search`, etc.
> - Como visualizar e excluir memórias incorretas.

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Linhas |
|--- | --- | ---|
| Lógica de disparo de injeção | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L125-L176) | 125-176 |
|--- | --- | ---|
| Formatação do Prompt | [`src/services/context.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/context.ts#L14-L64) | 14-64 |
| Configuração padrão | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L44-L54) | 44-54 |

**Funções principais**:
- `formatContextForPrompt()`: Monta o bloco de texto `[SUPERMEMORY]`.
- `detectMemoryKeyword()`: Correspondência por regex das palavras de gatilho na mensagem do usuário.

</details>

## Próxima Lição

> Na próxima lição, aprenderemos sobre **[Ferramentas Detalhadas: Ensine o Agent a Memorizar](../tools/index.md)**.
>
> Você aprenderá:
> - Dominar os 5 modos de ferramentas principais: `add`, `search`, `profile`, `list`, `forget`
> - Como intervir manualmente e corrigir as memórias do Agent
> - Acionar o salvamento de memórias usando linguagem natural
