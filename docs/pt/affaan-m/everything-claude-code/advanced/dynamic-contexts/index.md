---
title: "Contextos Dinâmicos: Injeção de Contexts | Everything Claude Code"
sidebarTitle: "Fazendo a IA Entender Seu Modo de Trabalho"
subtitle: "Contextos Dinâmicos: Injeção de Contexts"
description: "Aprenda o mecanismo de injeção de contexto dinâmico do Claude Code. Domine a alternância entre os três modos: dev, review e research. Otimize o comportamento da IA conforme o cenário e aumente sua produtividade."
tags:
  - "contexts"
  - "workflow-optimization"
  - "dynamic-prompts"
prerequisite:
  - "start-quick-start"
order: 140
---

# Injeção de Contexto Dinâmico: Usando Contexts

## O Que Você Vai Aprender

Após dominar a injeção de contexto dinâmico, você será capaz de:

- Alternar a estratégia de comportamento da IA conforme o modo de trabalho atual (desenvolvimento, revisão, pesquisa)
- Fazer o Claude seguir diferentes prioridades e preferências de ferramentas em diferentes cenários
- Evitar confusão de objetivos na mesma sessão, aumentando o foco
- Otimizar a eficiência em diferentes fases (implementação rápida vs. revisão profunda)

## Seu Problema Atual

Você já enfrentou esses problemas durante o desenvolvimento?

- **Quando quer desenvolver rapidamente**, o Claude analisa demais, dá sugestões excessivas e atrasa o progresso
- **Durante revisão de código**, o Claude quer modificar o código imediatamente, em vez de ler cuidadosamente e identificar problemas
- **Ao pesquisar novos problemas**, o Claude começa a escrever sem entender direito, levando a direções erradas
- **Na mesma sessão**, ora desenvolvendo, ora revisando, o comportamento do Claude fica caótico

A raiz desses problemas é: **o Claude não tem um sinal claro de "modo de trabalho"**, ele não sabe qual deve ser a prioridade atual.

## Quando Usar Esta Técnica

- **Fase de desenvolvimento**: Fazer a IA priorizar a implementação de funcionalidades, discutir detalhes depois
- **Revisão de código**: Fazer a IA entender completamente primeiro, depois sugerir melhorias
- **Pesquisa técnica**: Fazer a IA explorar e aprender primeiro, depois dar conclusões
- **Ao alternar modos de trabalho**: Informar claramente à IA qual é o objetivo atual

## Conceito Central

O núcleo da injeção de contexto dinâmico é **fazer a IA ter diferentes estratégias de comportamento em diferentes modos de trabalho**.

### Três Modos de Trabalho

Everything Claude Code oferece três contextos predefinidos:

| Modo | Arquivo | Foco | Prioridade | Cenário de Uso |
| --- | --- | --- | --- | --- |
| **dev** | `contexts/dev.md` | Implementar funcionalidades, iterar rapidamente | Fazer funcionar primeiro, aperfeiçoar depois | Desenvolvimento diário, novas funcionalidades |
| **review** | `contexts/review.md` | Qualidade do código, segurança, manutenibilidade | Identificar problemas primeiro, sugerir correções depois | Code Review, revisão de PR |
| **research** | `contexts/research.md` | Entender o problema, explorar soluções | Entender primeiro, agir depois | Pesquisa técnica, análise de bugs, design de arquitetura |

### Por Que Precisamos de Contexto Dinâmico?

::: info Contexto vs. Prompt do Sistema

**Prompt do sistema** são instruções fixas carregadas quando o Claude Code inicia (como conteúdo nos diretórios `agents/`, `rules/`), definindo o comportamento base da IA.

**Contexto** são instruções temporárias que você injeta dinamicamente conforme o modo de trabalho atual, sobrescrevendo ou complementando o prompt do sistema, fazendo a IA mudar seu comportamento em cenários específicos.

O prompt do sistema é o "padrão global", o contexto é a "sobrescrita de cenário".
:::

### Comparação de Modos de Trabalho

A mesma tarefa, com comportamento diferente da IA em diferentes modos:

```markdown
### Tarefa: Corrigir um bug que causa falha no login

#### Modo dev (correção rápida)
- Localizar o problema rapidamente
- Modificar o código diretamente
- Executar testes para verificar
- Fazer funcionar primeiro, otimizar depois

### Modo review (análise profunda)
- Ler completamente o código relacionado
- Verificar casos de borda e tratamento de erros
- Avaliar o impacto da solução de correção
- Identificar problemas primeiro, sugerir correções depois

### Modo research (investigação completa)
- Explorar todas as causas possíveis
- Analisar logs e mensagens de erro
- Verificar hipóteses
- Entender a causa raiz primeiro, depois propor soluções
```

## 🎒 Preparação Antes de Começar

::: warning Pré-requisitos

Este tutorial assume que você já:

- ✅ Completou o aprendizado do [Início Rápido](../../start/quickstart/)
- ✅ Instalou o plugin Everything Claude Code
- ✅ Entende os conceitos básicos de gerenciamento de sessão

:::

---

## Siga Comigo: Usando Contexto Dinâmico

### Passo 1: Entenda Como os Três Contextos Funcionam

Primeiro, conheça a definição de cada contexto:

#### dev.md - Modo de Desenvolvimento

**Objetivo**: Implementar funcionalidades rapidamente, fazer funcionar primeiro e aperfeiçoar depois

**Prioridades**:
1. Get it working (Fazer funcionar)
2. Get it right (Fazer corretamente)
3. Get it clean (Fazer limpo)

**Estratégias de Comportamento**:
- Write code first, explain after (Escrever código primeiro, explicar depois)
- Prefer working solutions over perfect solutions (Preferir soluções funcionais a soluções perfeitas)
- Run tests after changes (Executar testes após alterações)
- Keep commits atomic (Manter commits atômicos)

**Preferência de Ferramentas**: Edit, Write (modificação de código), Bash (executar testes/build), Grep/Glob (buscar código)

---

#### review.md - Modo de Revisão

**Objetivo**: Identificar problemas de qualidade de código, vulnerabilidades de segurança e problemas de manutenibilidade

**Prioridades**: Critical (Crítico) > High (Alto) > Medium (Médio) > Low (Baixo)

**Estratégias de Comportamento**:
- Read thoroughly before commenting (Ler completamente antes de comentar)
- Prioritize issues by severity (Priorizar problemas por severidade)
- Suggest fixes, don't just point out problems (Sugerir correções, não apenas apontar problemas)
- Check for security vulnerabilities (Verificar vulnerabilidades de segurança)

**Checklist de Revisão**:
- [ ] Logic errors (Erros de lógica)
- [ ] Edge cases (Casos de borda)
- [ ] Error handling (Tratamento de erros)
- [ ] Security (injection, auth, secrets) (Segurança)
- [ ] Performance (Desempenho)
- [ ] Readability (Legibilidade)
- [ ] Test coverage (Cobertura de testes)

**Formato de Saída**: Agrupado por arquivo, priorizado por severidade

---

#### research.md - Modo de Pesquisa

**Objetivo**: Entender profundamente o problema, explorar possíveis soluções

**Fluxo de Pesquisa**:
1. Understand the question (Entender a questão)
2. Explore relevant code/docs (Explorar código/documentação relevante)
3. Form hypothesis (Formular hipótese)
4. Verify with evidence (Verificar com evidências)
5. Summarize findings (Resumir descobertas)

**Estratégias de Comportamento**:
- Read widely before concluding (Ler amplamente antes de concluir)
- Ask clarifying questions (Fazer perguntas de esclarecimento)
- Document findings as you go (Documentar descobertas durante o processo)
- Don't write code until understanding is clear (Não escrever código até o entendimento estar claro)

**Preferência de Ferramentas**: Read (entender código), Grep/Glob (buscar padrões), WebSearch/WebFetch (documentação externa), Task with Explore agent (questões sobre o codebase)

**Formato de Saída**: Descobertas primeiro, sugestões depois

---

### Passo 2: Selecione e Aplique o Contexto

Escolha o contexto apropriado conforme o cenário de trabalho atual.

#### Cenário 1: Implementar Nova Funcionalidade

**Contexto Aplicável**: `dev.md`

**Como Aplicar**:

```markdown
@contexts/dev.md

Por favor, me ajude a implementar a funcionalidade de autenticação de usuário:
1. Suportar login com email e senha
2. Gerar token JWT
3. Implementar middleware para proteger rotas
```

**Como o Claude Vai Se Comportar**:
- Implementar rapidamente a funcionalidade principal
- Não fazer over-engineering
- Executar testes para verificar após implementação
- Manter commits atômicos (cada commit completa uma pequena funcionalidade)

**O Que Você Deve Ver**:
- Código funcional rapidamente
- Testes passando
- Funcionalidade funcionando, talvez não elegante

---

#### Cenário 2: Revisar PR de um Colega

**Contexto Aplicável**: `review.md`

**Como Aplicar**:

```markdown
@contexts/review.md

Por favor, revise este PR: https://github.com/your-repo/pull/123

Foco na verificação de:
- Segurança (SQL injection, XSS, autenticação)
- Tratamento de erros
- Problemas de desempenho
```

**Como o Claude Vai Se Comportar**:
- Ler completamente todo o código relacionado primeiro
- Ordenar problemas por severidade
- Fornecer sugestões de correção para cada problema
- Não modificar código diretamente, apenas sugerir

**O Que Você Deve Ver**:
- Relatório de revisão estruturado (por arquivo, por severidade)
- Cada problema com localização específica e sugestão de correção
- Problemas de nível Critical marcados com prioridade

---

#### Cenário 3: Pesquisar Solução de Integração de Nova Tecnologia

**Contexto Aplicável**: `research.md`

**Como Aplicar**:

```markdown
@contexts/research.md

Quero integrar o ClickHouse como banco de dados analítico no projeto, por favor pesquise:

1. Vantagens e desvantagens do ClickHouse
2. Como se integra com nossa arquitetura PostgreSQL existente
3. Estratégia de migração e riscos
4. Resultados de benchmark de desempenho

Não escreva código, primeiro pesquise a solução completamente.
```

**Como o Claude Vai Se Comportar**:
- Primeiro buscar documentação oficial e melhores práticas do ClickHouse
- Ler casos de migração relacionados
- Analisar compatibilidade com a arquitetura existente
- Documentar descobertas durante a exploração
- Por fim, dar recomendações abrangentes

**O Que Você Deve Ver**:
- Análise técnica comparativa detalhada
- Avaliação de riscos e recomendações de migração
- Sem código, apenas soluções e conclusões

---

### Passo 3: Alternar Contexto na Mesma Sessão

Você pode alternar contexto dinamicamente na mesma sessão, adaptando-se a diferentes fases de trabalho.

**Exemplo: Fluxo de Trabalho Desenvolvimento + Revisão**

```markdown
#### Passo 1: Implementar funcionalidade (modo dev)
@contexts/dev.md
Por favor, implemente a funcionalidade de login de usuário, suportando autenticação com email e senha.
...
#### Claude implementa a funcionalidade rapidamente

#### Passo 2: Auto-revisão (modo review)
@contexts/review.md
Por favor, revise o código da funcionalidade de login que acabamos de implementar:
...
#### Claude muda para modo de revisão, analisa profundamente a qualidade do código
#### Lista problemas e sugestões de melhoria por severidade

#### Passo 3: Melhorar baseado nos resultados da revisão (modo dev)
@contexts/dev.md
Baseado nas observações da revisão acima, corrija os problemas de nível Critical e High.
...
#### Claude corrige os problemas rapidamente

#### Passo 4: Revisar novamente (modo review)
@contexts/review.md
Revise novamente o código após as correções.
...
#### Claude verifica se os problemas foram resolvidos
```

**O Que Você Deve Ver**:
- Foco claro em diferentes fases
- Iteração rápida na fase de desenvolvimento
- Análise profunda na fase de revisão
- Evitar conflitos de comportamento no mesmo modo

---

### Passo 4: Criar Contexto Personalizado (Opcional)

Se os três modos predefinidos não atenderem suas necessidades, você pode criar contextos personalizados.

**Formato do Arquivo de Contexto**:

```markdown
#### My Custom Context

Mode: [Nome do modo]
Focus: [Foco]

## Behavior
- Regra de comportamento 1
- Regra de comportamento 2

## Priorities
1. Prioridade 1
2. Prioridade 2

## Tools to favor
- Ferramentas recomendadas
```

**Exemplo: `debug.md` - Modo de Depuração**

```markdown
#### Debug Context

Mode: Debugging and troubleshooting
Focus: Root cause analysis and fix

## Behavior
- Start by gathering evidence (logs, error messages, stack traces)
- Form hypothesis before proposing fixes
- Test fixes systematically (control variables)
- Document findings for future reference

## Debug Process
1. Reproduce the issue consistently
2. Gather diagnostic information
3. Narrow down potential causes
4. Test hypotheses
5. Verify the fix works

## Tools to favor
- Read for code inspection
- Bash for running tests and checking logs
- Grep for searching error patterns
```

**Usando Contexto Personalizado**:

```markdown
@contexts/debug.md

Encontrei este problema em produção:
[Mensagem de erro]
[Logs relacionados]

Por favor, me ajude a depurar.
```

---

## Checkpoint ✅

Após completar os passos acima, você deve:

- [ ] Entender como os três contextos predefinidos funcionam e seus cenários de uso
- [ ] Ser capaz de escolher o contexto apropriado conforme o cenário de trabalho
- [ ] Saber alternar contexto dinamicamente na sessão
- [ ] Saber como criar contextos personalizados
- [ ] Experimentar a diferença clara no comportamento da IA em diferentes contextos

---

## Armadilhas Comuns

### ❌ Erro 1: Não alternar contexto, esperando que a IA se adapte automaticamente

**Problema**: Na mesma sessão, ora desenvolvendo ora revisando, sem informar à IA o objetivo atual.

**Sintoma**: Comportamento caótico do Claude, às vezes analisando demais, às vezes modificando código apressadamente.

**Abordagem Correta**:
- Alternar contexto explicitamente: `@contexts/dev.md` ou `@contexts/review.md`
- Declarar o objetivo atual no início de cada fase
- Usar `## Passo X: [Objetivo]` para deixar a fase clara

---

### ❌ Erro 2: Usar modo research para desenvolvimento rápido

**Problema**: Precisa implementar uma funcionalidade em 30 minutos, mas usou `@contexts/research.md`.

**Sintoma**: Claude gasta muito tempo pesquisando, discutindo, analisando, demorando para escrever código.

**Abordagem Correta**:
- Desenvolvimento rápido usa modo `dev`
- Pesquisa profunda usa modo `research`
- Escolher o modo baseado na pressão de tempo e complexidade da tarefa

---

### ❌ Erro 3: Usar modo dev para revisar código crítico

**Problema**: Revisar código crítico envolvendo segurança, dinheiro, privacidade, mas usou `@contexts/dev.md`.

**Sintoma**: Claude faz uma varredura rápida, pode perder vulnerabilidades de segurança graves.

**Abordagem Correta**:
- Revisão de código crítico deve usar modo `review`
- Revisão de PR comum usa modo `review`
- Usar modo `dev` apenas para iteração rápida pessoal

---

## Resumo da Lição

A injeção de contexto dinâmico otimiza a estratégia de comportamento da IA em diferentes cenários, deixando claro o modo de trabalho atual:

**Três Modos Predefinidos**:
- **dev**: Implementação rápida, fazer funcionar primeiro e aperfeiçoar depois
- **review**: Revisão profunda, identificar problemas e sugerir correções
- **research**: Pesquisa completa, entender antes de concluir

**Pontos-Chave de Uso**:
1. Alternar contexto conforme a fase de trabalho
2. Usar `@contexts/xxx.md` para carregar contexto explicitamente
3. Pode alternar múltiplas vezes na mesma sessão
4. Pode criar contextos personalizados para necessidades específicas

**Valor Central**: Evitar comportamento caótico da IA, aumentar foco e eficiência em diferentes fases.

---

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos **[Referência Completa de Configuração: settings.json](../../appendix/config-reference/)**.
>
> Você vai aprender:
> - Opções completas de configuração do settings.json
> - Como personalizar configurações de Hooks
> - Estratégias de habilitação e desabilitação de servidores MCP
> - Prioridade de configurações a nível de projeto e global

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-25

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Definição do contexto dev | [`contexts/dev.md`](https://github.com/affaan-m/everything-claude-code/blob/main/contexts/dev.md) | 1-21 |
| Definição do contexto review | [`contexts/review.md`](https://github.com/affaan-m/everything-claude-code/blob/main/contexts/review.md) | 1-23 |
| Definição do contexto research | [`contexts/research.md`](https://github.com/affaan-m/everything-claude-code/blob/main/contexts/research.md) | 1-27 |

**Arquivos de Contexto Principais**:
- `dev.md`: Contexto do modo de desenvolvimento, prioriza implementação rápida de funcionalidades
- `review.md`: Contexto do modo de revisão, prioriza identificação de problemas de qualidade de código
- `research.md`: Contexto do modo de pesquisa, prioriza entendimento profundo do problema

</details>
