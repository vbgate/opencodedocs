---
title: "Modo Ultrawork: Ative Todos os Recursos com Um Comando"
sidebarTitle: "Modo Ultrawork"
subtitle: "Modo Ultrawork: Ative Todos os Recursos com Um Comando"
description: "Aprenda o modo Ultrawork do oh-my-opencode para ativar todos os recursos com um comando. Ativa agentes paralelos, conclusão forçada e sistema de Categoria + Skills."
tags:
  - "ultrawork"
  - "tarefas em segundo plano"
  - "colaboração de agentes"
prerequisite:
  - "start-installation"
  - "start-sisyphus-orchestrator"
order: 30
---

# Modo Ultrawork: Ative Todos os Recursos com Um Comando

## O Que Você Vai Aprender

- Ativar todos os recursos avançados do oh-my-opencode com um único comando
- Fazer com que múltiplos agentes de IA trabalhem em paralelo como uma equipe real
- Evitar configurar manualmente múltiplos agentes e tarefas em segundo plano
- Entender a filosofia de design e as melhores práticas do modo Ultrawork

## Seus Desafios Atuais

Você pode ter encontrado estas situações durante o desenvolvimento:

- **Muitos recursos, não sabe como usá-los**: Você tem 10 agentes especializados, tarefas em segundo plano, ferramentas LSP, mas não sabe como ativá-los rapidamente
- **Configuração manual necessária**: Cada tarefa complexa requer especificar manualmente agentes, concorrência em segundo plano e outras configurações
- **Colaboração de agentes ineficiente**: Chamando agentes em série, desperdiçando tempo e custos
- **Tarefas ficando presas no meio**: Os agentes não têm motivação e restrições suficientes para completar as tarefas

Isso tudo está afetando sua capacidade de liberar o verdadeiro poder do oh-my-opencode.

## Conceito Central

**Modo Ultrawork** é o mecanismo de "ativar tudo com um clique" do oh-my-opencode.

::: info O que é o Modo Ultrawork?
O Modo Ultrawork é um modo de trabalho especial acionado por uma palavra-chave. Quando seu prompt contém `ultrawork` ou sua abreviação `ulw`, o sistema ativa automaticamente todos os recursos avançados: tarefas em segundo plano paralelas, exploração profunda, conclusão forçada, colaboração multi-agente e muito mais.
:::

### Filosofia de Design

O modo Ultrawork é baseado nos seguintes princípios centrais (do [Ultrawork Manifesto](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/ultrawork-manifesto.md)):

| Princípio | Descrição |
|-----------|-------------|
| **Intervenção humana é um sinal de falha** | Se você precisa corrigir constantemente a saída da IA, significa que há um problema no design do sistema |
| **Código indistinguível** | O código escrito pela IA deve ser indistinguível do código escrito por engenheiros seniores |
| **Minimizar carga cognitiva** | Você só precisa dizer "o que fazer", os agentes são responsáveis por "como fazer" |
| **Previsível, consistente, delegável** | Os agentes devem ser tão estáveis e confiáveis quanto um compilador |

### Mecanismo de Ativação

Quando o sistema detecta a palavra-chave `ultrawork` ou `ulw`:

1. **Definir modo de precisão máxima**: `message.variant = "max"`
2. **Exibir notificação Toast**: "Modo Ultrawork Ativado - Precisão máxima engajada. Todos os agentes à sua disposição."
3. **Injetar instruções completas**: Injeta 200+ linhas de instruções ULTRAWORK nos agentes, incluindo:
   - Requer 100% de certeza antes de iniciar a implementação
   - Requer uso paralelo de tarefas em segundo plano
   - Força uso do sistema Categoria + Skills
   - Força verificação de conclusão (fluxo de trabalho TDD)
   - Proíbe qualquer desculpa do tipo "não consigo fazer isso"

## Acompanhe

### Passo 1: Acionar o Modo Ultrawork

Digite um prompt contendo a palavra-chave `ultrawork` ou `ulw` no OpenCode:

```
ultrawork desenvolver uma API REST
```

Ou de forma mais concisa:

```
ulw adicionar autenticação de usuário
```

**Você deve ver**:
- Uma notificação Toast aparece na interface: "Modo Ultrawork Ativado"
- A resposta do agente começa com "ULTRAWORK MODE ENABLED!"

### Passo 2: Observar Mudanças no Comportamento do Agente

Depois de ativar o modo Ultrawork, os agentes irão:

1. **Exploração paralela da base de código**
   ```
   delegate_task(agent="explore", prompt="encontrar padrões de API existentes", background=true)
   delegate_task(agent="explore", prompt="encontrar infraestrutura de testes", background=true)
   delegate_task(agent="librarian", prompt="encontrar melhores práticas de autenticação", background=true)
   ```

2. **Chamar agente Plan para criar plano de trabalho**
   ```
   delegate_task(subagent_type="plan", prompt="criar plano detalhado baseado no contexto reunido")
   ```

3. **Usar Categoria + Skills para executar tarefas**
   ```
   delegate_task(category="visual-engineering", load_skills=["frontend-ui-ux", "playwright"], ...)
   ```

**Você deve ver**:
- Múltiplas tarefas em segundo plano rodando simultaneamente
- Agentes chamando ativamente agentes especializados (Oracle, Librarian, Explore)
- Planos de teste completos e decomposição de trabalho
- Tarefas continuam executando até 100% completas

### Passo 3: Verificar Conclusão da Tarefa

Depois que os agentes completarem, eles irão:

1. **Mostrar evidências de verificação**: Saída real de execução de testes, descrições de verificação manual
2. **Confirmar que todos os TODOs estão completos**: Não declararão conclusão antecipadamente
3. **Resumir o trabalho realizado**: Listar o que foi feito e por quê

**Você deve ver**:
- Resultados de testes claros (não "deve funcionar")
- Todos os problemas resolvidos
- Nenhuma lista de TODO incompleta

## Ponto de Verificação ✅

Depois de completar os passos acima, confirme:

- [ ] Você vê uma notificação Toast após digitar `ulw`
- [ ] A resposta do agente começa com "ULTRAWORK MODE ENABLED!"
- [ ] Você observa tarefas em segundo plano paralelas rodando
- [ ] Os agentes usam o sistema Categoria + Skills
- [ ] Há evidências de verificação após a conclusão da tarefa

Se algum item falhar, verifique:
- A palavra-chave está escrita corretamente (`ultrawork` ou `ulw`)
- Você está na sessão principal (tarefas em segundo plano não acionarão o modo)
- O arquivo de configuração está ativado com recursos relevantes

## Quando Usar Esta Técnica

| Cenário | Usar Ultrawork | Modo Normal |
|----------|--------------|-------------|
| **Recursos complexos novos** | ✅ Recomendado (requer colaboração multi-agente) | ❌ Pode não ser eficiente o suficiente |
| **Correções urgentes** | ✅ Recomendado (precisa de diagnóstico rápido e exploração) | ❌ Pode perder contexto |
| **Modificações simples** | ❌ Exagerado (desperdiça recursos) | ✅ Mais adequado |
| **Validação rápida de ideias** | ❌ Exagerado | ✅ Mais adequado |

**Regra prática**:
- Tarefa envolve múltiplos módulos ou sistemas → Use `ulw`
- Precisa de pesquisa profunda da base de código → Use `ulw`
- Precisa chamar múltiplos agentes especializados → Use `ulw`
- Mudança pequena em arquivo único → Não precisa de `ulw`

## Armadilhas Comuns

::: warning Notas Importantes

**1. Não use `ulw` em todos os prompts**

O modo Ultrawork injeta uma grande quantidade de instruções, o que é exagerado para tarefas simples. Use-o apenas para tarefas complexas que realmente requerem colaboração multi-agente, exploração paralela e análise profunda.

**2. Tarefas em segundo plano não acionam o modo Ultrawork**

O detector de palavras-chave pula sessões em segundo plano para evitar injetar incorretamente o modo em sub-agentes. O modo Ultrawork só funciona na sessão principal.

**3. Garanta que a configuração do Provider esteja correta**

O modo Ultrawork depende de múltiplos modelos de IA trabalhando em paralelo. Se certos Providers não estiverem configurados ou indisponíveis, os agentes podem não conseguir chamar agentes especializados.
:::

## Resumo da Lição

O modo Ultrawork alcança o objetivo de design de "ativar todos os recursos com um comando" através do acionamento por palavra-chave:

- **Fácil de usar**: Basta digitar `ulw` para ativar
- **Colaboração automática**: Agentes chamam automaticamente outros agentes e executam tarefas em segundo plano em paralelo
- **Conclusão forçada**: Mecanismo de verificação completo garante 100% de conclusão
- **Configuração zero**: Não precisa definir manualmente prioridades de agentes, limites de concorrência, etc.

Lembre-se: O modo Ultrawork é projetado para fazer os agentes trabalharem como uma equipe real. Você só precisa expressar a intenção, os agentes são responsáveis pela execução.

## Próxima Lição

> Na próxima lição, aprenderemos **[Configuração de Provider](../../platforms/provider-setup/)**.
>
> Você aprenderá:
> - Como configurar múltiplos Providers como Anthropic, OpenAI, Google
> - Como a estratégia multi-modelo degrada automaticamente e seleciona modelos ótimos
> - Como testar conexões de Provider e uso de cota

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir locais de código fonte</strong></summary>

> Última atualização: 2026-01-26

| Recurso | Caminho do Arquivo | Números de Linha |
|---------|-----------|--------------|
| Filosofia de design Ultrawork | [`docs/ultrawork-manifesto.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/ultrawork-manifesto.md) | 1-198 |
| Hook de detector de palavras-chave | [`src/hooks/keyword-detector/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/index.ts) | 12-100 |
| Template de instrução ULTRAWORK | [`src/hooks/keyword-detector/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/constants.ts) | 54-280 |
| Lógica de detecção de palavras-chave | [`src/hooks/keyword-detector/detector.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/detector.ts) | 26-53 |

**Constantes principais**:
- `KEYWORD_DETECTORS`: Configuração do detector de palavras-chave, incluindo três modos: ultrawork, search, analyze
- `CODE_BLOCK_PATTERN`: Padrão regex de bloco de código, usado para filtrar palavras-chave em blocos de código
- `INLINE_CODE_PATTERN`: Padrão regex de código inline, usado para filtrar palavras-chave em código inline

**Funções principais**:
- `createKeywordDetectorHook()`: Cria Hook de detector de palavras-chave, escuta evento UserPromptSubmit
- `detectKeywordsWithType()`: Detecta palavras-chave no texto e retorna tipo (ultrawork/search/analyze)
- `getUltraworkMessage()`: Gera instruções completas do modo ULTRAWORK (seleciona Planner ou modo normal baseado no tipo de agente)
- `removeCodeBlocks()`: Remove blocos de código do texto para evitar acionar palavras-chave em blocos de código

**Regras de negócio**:
| ID da Regra | Descrição da Regra | Tag |
|---------|------------------|-----|
| BR-4.8.4-1 | Ativar modo Ultrawork quando "ultrawork" ou "ulw" é detectado | [Fact] |
| BR-4.8.4-2 | Modo Ultrawork define `message.variant = "max"` | [Fact] |
| BR-4.8.4-3 | Modo Ultrawork exibe notificação Toast: "Modo Ultrawork Ativado" | [Fact] |
| BR-4.8.4-4 | Sessões de tarefas em segundo plano pulam detecção de palavras-chave para evitar injeção de modo | [Fact] |
| BR-4.8.4-5 | Sessões não principais só permitem palavra-chave ultrawork, bloqueando outras injeções de modo | [Fact] |

</details>
