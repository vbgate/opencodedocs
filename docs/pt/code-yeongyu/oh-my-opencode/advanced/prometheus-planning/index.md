---
title: "Planejamento com Prometheus: Coleta de Requisitos Estilo Entrevista | oh-my-opencode"
sidebarTitle: "Gerar Planos de Trabalho de Alta Qualidade"
subtitle: "Planejamento com Prometheus: Coleta de Requisitos Estilo Entrevista"
description: "Aprenda o sistema de planejamento do Prometheus, coletando requisitos estruturados com consultas do Metis e validação do Momus para gerar planos de trabalho de alta qualidade, separando perfeitamente o planejamento da execução."
tags:
  - "planejamento"
  - "prometheus"
  - "entrevista"
prerequisite:
  - "start-sisyphus-orchestrator"
  - "advanced-ai-agents-overview"
order: 70
---

# Planejamento com Prometheus: Coleta de Requisitos Estilo Entrevista e Geração de Planos de Trabalho

## O Que Você Vai Aprender

- Iniciar uma sessão de planejamento com Prometheus, esclarecendo requisitos do projeto através do modo de entrevista
- Entender o princípio fundamental do Prometheus: "apenas planeje, não implemente"
- Colaborar com Metis e Momus para gerar planos de trabalho de alta qualidade, sem omissões
- Usar o comando `/start-work` para delegar o plano ao Atlas para execução

## Seu Dilema Atual

Imagine que você pede a uma IA para executar uma tarefa complexa: "me ajude a refatorar o sistema de autenticação".

**5 minutos depois**, a IA começa a escrever código. Você fica feliz, achando que economizou tempo.

**30 minutos depois**, você percebe:
- A IA não perguntou qual biblioteca de autenticação usar (JWT? NextAuth? Session?)
- A IA assumiu muitos requisitos (como "deve suportar OAuth", quando você na verdade não precisa)
- O código está pela metade, a direção está errada, tudo precisa ser refeito
- Testes mostram que a lógica principal é incompatível com o sistema existente

Este é o problema clássico de "misturar planejamento e execução": a IA age antes que os requisitos estejam claros, resultando em muito retrabalho.

## Quando Usar o Prometheus

::: tip Momento de Uso
**Cenários Adequados para o Prometheus**:
- Desenvolvimento de funcionalidades complexas (como "adicionar sistema de autenticação de usuários")
- Refatorações em grande escala (como "refatorar toda a camada de acesso a dados")
- Design de arquitetura (como "projetar arquitetura de microsserviços")
- Tarefas que exigem garantia rigorosa de qualidade

**Cenários para Execução Direta pelo Sisyphus**:
- Correções simples de bugs (como "corrigir erro de digitação no botão de login")
- Funcionalidades pequenas e claras (como "adicionar formulário com 3 campos de entrada")
:::

## 🎒 Preparação Antes de Começar

Certifique-se de que as seguintes configurações estão concluídas:

- [ ] O agente Prometheus está ativado (ativado por padrão)
- [ ] Pelo menos um AI Provider está configurado (Anthropic, OpenAI, etc.)
- [ ] Compreensão básica dos conceitos de agentes (concluiu "[Equipe de Agentes de IA: Visão Geral de 10 Especialistas](../ai-agents-overview/)").

**Verificar Disponibilidade do Prometheus**:

```bash
# Na caixa de chat do OpenCode, digite
@prometheus

# Você deve ver a mensagem do Prometheus:
# "Olá, eu sou o Prometheus - Consultor de Estratégia e Planejamento. ..."
```

## Ideia Central

### Restrição de Identidade do Prometheus

Qual é a característica mais importante do Prometheus? **Ele nunca escreve código**.

| Funcionalidade | Prometheus | Sisyphus | Atlas |
|---|---|---|---|
| Coleta de Requisitos | ✅ | ❌ | ❌ |
| Geração de Plano de Trabalho | ✅ | ❌ | ❌ |
| Implementação de Código | ❌ | ✅ | ✅ (delegado) |
| Execução de Tarefa | ❌ | ✅ | ✅ (delegado) |

**Por que isso é importante?**

- **Planejador ≠ Executor**: Assim como um gerente de produto não escreve código, a responsabilidade do Prometheus é o "como", não o "fazer"
- **Prevenção de Suposições**: Se o Prometheus pudesse escrever código diretamente, ele poderia "adivinhar" quando os requisitos não estão claros
- **Pensamento Forçado**: Após ser proibido de escrever código, o Prometheus deve perguntar todos os detalhes claramente

### Fluxo de Trabalho de Três Fases

```mermaid
flowchart LR
    A[Entrada de Requisitos do Usuário] --> B[Fase 1: Modo de Entrevista]
    B -->|Requisitos Claros?| C[Fase 2: Geração de Plano]
    C --> D[Consulta ao Metis]
    D -->|Precisão Alta?| E[Ciclo de Validação do Momus]
    E -->|Plano Aperfeiçoado| F[Gerar .sisyphus/plans/*.md]
    C -->|Não Precisa Alta Precisão| F
    F --> G[/start-work execução]
```

**Responsabilidades de Cada Fase**:

- **Fase 1 - Modo de Entrevista**: Coletar requisitos, pesquisar código base, atualizar continuamente o rascunho
- **Fase 2 - Geração de Plano**: Consultar Metis, gerar plano completo, apresentar resumo
- **Fase 3 - Execução**: Delegar ao Atlas através de `/start-work`

## Siga Comigo

### Passo 1: Iniciar Sessão de Planejamento com Prometheus

**Por quê**
Ativar o Prometheus através de palavras-chave ou comandos para entrar no modo de entrevista.

**Operação**

Na caixa de chat do OpenCode, digite:

```
@prometheus me ajude a planejar um sistema de autenticação de usuários
```

**Você deve ver**:
- Confirmação do Prometheus de entrada no modo de entrevista
- Primeira pergunta feita (como "Qual é a stack tecnológica da sua aplicação?")
- Arquivo de rascunho criado `.sisyphus/drafts/user-auth.md`

::: info Característica Chave: Arquivo de Rascunho
O Prometheus **atualiza continuamente** os arquivos em `.sisyphus/drafts/`. Esta é sua "memória externa":
- Registra decisões de cada discussão
- Salva padrões de código descobertos pela pesquisa
- Marca limites claros (IN/OUT)

Você pode verificar o rascunho a qualquer momento para validar se a compreensão do Prometheus está correta.
:::

### Passo 2: Responder às Perguntas e Permitir que o Prometheus Colete Contexto

**Por quê**
O Prometheus precisa "entender" seu projeto para gerar um plano executável. Ele não adivinha, mas obtém base pesquisando o código base e estudando as melhores práticas.

**Operação**

Responda às perguntas do Prometheus, por exemplo:

```
Entrada do Usuário:
Minha aplicação é Next.js 14, App Router, atualmente sem autenticação.
Quero suportar login com email/senha e GitHub OAuth.
```

**O que o Prometheus fará**:

- Usar o agente `explore` para analisar a estrutura de código existente
- Usar o agente `librarian` para encontrar melhores práticas de autenticação
- Atualizar as seções "Requirements" e "Technical Decisions" no arquivo de rascunho

**Você deve ver**:

```
Iniciei agentes de exploração para analisar a estrutura do seu projeto...

1. explore: Encontrar padrões de sessão existentes
2. librarian: Encontrar melhores práticas NextAuth

Vou continuar fazendo perguntas após receber os resultados.
```

### Passo 3: Verificar o Arquivo de Rascunho (Opcional)

**Por quê**
O rascunho é a "memória externa" do Prometheus, você pode verificar a qualquer momento se a compreensão está correta.

**Operação**

```bash
# Ver conteúdo do rascunho no terminal
cat .sisyphus/drafts/user-auth.md
```

**Você deve ver** conteúdo similar:

```markdown
# Rascunho: user-auth

## Requisitos (confirmados)
- Stack: Next.js 14, App Router
- Métodos de Autenticação: Email/Senha + GitHub OAuth
- Status Atual: Sem implementação de autenticação

## Decisões Técnicas
- Nenhuma decisão

## Descobertas de Pesquisa
- Agentes de exploração em execução...
```

### Passo 4: Continuar Respondendo até que os Requisitos Estejam Claros

**Por quê**
O Prometheus tem uma "Lista de Verificação de Aprovação", e só fará a transição automática para a geração de plano quando todos os itens estiverem marcados.

**Critérios de Julgamento do Prometheus**:

```
LISTA DE VERIFICAÇÃO DE APROVAÇÃO (TODOS devem ser SIM para transição automática):
□ O objetivo principal está claro?
□ Os limites de escopo estão claros (IN/OUT)?
□ Não há ambiguidades críticas pendentes?
□ A solução técnica está determinada?
□ A estratégia de teste está confirmada (TDD/manual)?
□ Não há problemas bloqueadores?
```

**Operação**

Continue respondendo às perguntas do Prometheus até que ele diga:

```
Todos os requisitos estão claros. Consultando Metis e gerando plano...
```

**Você deve ver**:
- Prometheus chamando o agente Metis
- Metis analisando possíveis questões omitidas
- Prometheus ajustando a compreensão com base no feedback do Metis

### Passo 5: Ver o Plano Gerado

**Por quê**
O arquivo de plano é a saída final do Prometheus, contendo todas as tarefas, dependências e critérios de aceitação.

**Operação**

```bash
# Ver o plano gerado
cat .sisyphus/plans/user-auth.md
```

**Você deve ver** a estrutura completa:

```markdown
# Sistema de Autenticação de Usuários

## Contexto
[Descrição original da necessidade]
[Resumo da entrevista]
[Resultado da análise do Metis]

## Objetivos de Trabalho
- Objetivo principal: Implementar login com email/senha e GitHub OAuth
- Entregáveis específicos: Página de login, endpoints de API, gerenciamento de sessão
- Definição de conclusão: Usuários podem fazer login e acessar rotas protegidas

## Estratégia de Verificação
- Infraestrutura existe: SIM
- Usuário quer testes: TDD
- Framework: vitest

## TODOs
- [ ] 1. Instalar e configurar NextAuth.js
  - References:
    - https://next-auth.js.org/getting-started/installation
  - Critérios de Aceitação:
    - [ ] npm run test → PASS (1 test)

- [ ] 2. Criar rota de API [...nextauth]/route.ts
  - References:
    - src/lib/session.ts:10-45 - padrão de sessão existente
  - Critérios de Aceitação:
    - [ ] curl http://localhost:3000/api/auth/... → 200

- [ ] 3. Implementar UI da página de login
  - References:
    - src/app/login/page.tsx - estrutura existente da página de login
  - Critérios de Aceitação:
    - [ ] Playwright verifica: ver formulário de login
    - [ ] Screenshot salvo em .sisyphus/evidence/

...
```

### Passo 6: Escolher o Método de Execução

**Por quê**
O Prometheus oferecerá duas opções: início rápido ou revisão de alta precisão.

**Apresentação do Prometheus** (usando a ferramenta Question):

```
## Plano Gerado: user-auth

**Decisões Principais Tomadas:**
- Usar NextAuth.js (integração boa com Next.js App Router)
- Provedor GitHub OAuth + Email/Senha

**Escopo:**
- IN: Funcionalidade de login, gerenciamento de sessão, proteção de rotas
- OUT: Funcionalidade de registro, redefinição de senha, edição de perfil de usuário

**Guardrails Aplicados:**
- Deve seguir padrão de sessão existente
- Não modificar lógica de negócio principal

Plano salvo em: `.sisyphus/plans/user-auth.md`

---

**Próximo Passo**

Como prosseguir?

1. **Iniciar Trabalho**: Execute /start-work. O plano parece robusto.
2. **Revisão de Alta Precisão**: Deixe o Momus validar rigorosamente cada detalhe. Aumenta o ciclo de revisão mas garante precisão.
```

**Operação**

Escolha uma opção (clique no botão ou digite a opção no OpenCode).

**Se você escolher "Iniciar Trabalho"**:

- Prometheus exclui o arquivo de rascunho
- Solicita que você execute `/start-work`

**Se você escolher "Revisão de Alta Precisão"**:

- Prometheus entra no ciclo do Momus
- Corrige continuamente o feedback até que o Momus diga "OKAY"
- Então solicita que você execute `/start-work`

### Passo 7: Executar o Plano

**Por quê**
O plano é a saída do Prometheus, a execução é responsabilidade do Atlas.

**Operação**

```bash
# No OpenCode, digite
/start-work
```

**Você deve ver**:
- Atlas lendo `.sisyphus/plans/user-auth.md`
- Criando arquivo de estado `boulder.json`
- Executando cada TODO em ordem
- Delegando tarefas para agentes especializados (como trabalhos de UI delegados ao Frontend)

**Checkpoint ✅**

- Arquivo `boulder.json` criado
- Atlas começa a executar a tarefa 1
- Após cada tarefa ser concluída, o estado é atualizado

## Avisos de Armadilhas

### Armadilha 1: Pedir o Plano com Requisitos pela Metade

**Problema**:
```
Usuário: @prometheus faça uma autenticação de usuário
Usuário: Não faça muitas perguntas agora, apenas gere o plano
```

**Consequência**: O plano está cheio de suposições, exigindo modificações repetidas durante a execução.

**Prática Correta**:
```
Usuário: @prometheus faça uma autenticação de usuário
Prometheus: Qual é a stack tecnológica da sua aplicação? Atualmente tem autenticação?
Usuário: Next.js 14, App Router, sem autenticação
Prometheus: Quais métodos de login precisa suportar?
Usuário: Email/Senha + GitHub OAuth
...
(Continue respondendo até o Prometheus fazer a transição automaticamente)
```

::: tip Lembre este Princípio
**Tempo de Planejamento ≠ Tempo Perdido**
- Gastar 5 minutos esclarecendo requisitos pode economizar 2 horas de retrabalho
- O modo de entrevista do Prometheus está economizando dinheiro "para o futuro você"
:::

### Armadilha 2: Não Verificar o Arquivo de Rascunho

**Problema**: O Prometheus registra muitas decisões e limites no rascunho, você não verifica e apenas pede para gerar o plano.

**Consequência**:
- O plano contém interpretações erradas
- Durante a execução você descobre "como eu não pedi isso?"

**Prática Correta**:
```
1. Após iniciar o planejamento, preste atenção constante aos arquivos em .sisyphus/drafts/
2. Ao encontrar mal-entendidos, corrija imediatamente: "Errado, não quero OAuth, quero JWT simples"
3. Continue após a correção
```

### Armadilha 3: Gerar o Plano em Múltiplas Vezes

**Problema**:
```
Usuário: Este projeto é muito grande, vamos planejar a primeira fase primeiro
```

**Consequência**:
- O contexto entre a primeira e segunda fase é interrompido
- Decisões arquitetônicas inconsistentes
- Requisitos perdidos em múltiplas sessões

**Prática Correta**:
```
✅ Princípio do Plano Único: Independentemente do tamanho, todos os TODOs estão em um único arquivo .md em .sisyphus/plans/
```

**Por que?**
- Prometheus e Atlas podem lidar com planos grandes
- Plano único garante consistência arquitetônica
- Evita fragmentação de contexto

### Armadilha 4: Esquecer o Papel do Metis

**Problema**:
```
Usuário: Requisitos terminados, gere o plano rapidamente
Prometheus: (gera diretamente, pulando o Metis)
```

**Consequência**:
- O plano pode omitir limites críticos
- Não há "Must NOT Have" para excluir explicitamente o escopo
- AI slop aparece durante a execução (design excessivo)

**Prática Correta**:
```
✅ Consulta ao Metis é obrigatória, você não precisa apressar
```

**O que o Metis fará?**
- Identificar perguntas que o Prometheus deveria fazer mas não fez
- Levantar limites que precisam ser clarificados
- Prevenir engenharia excessiva da IA

### Armadilha 5: Ignorar a Decisão de Estratégia de Testes

**Problema**: O Prometheus pergunta "precisa de testes?", você diz "não importa" ou ignora.

**Consequência**:
- Se houver infraestrutura de testes, mas não aproveitar TDD, perde a oportunidade
- Se não houver testes, e não houver etapas detalhadas de verificação manual, alta taxa de falha na execução

**Prática Correta**:
```
Prometheus: Vejo que você tem o framework de testes vitest. O trabalho deve incluir testes?
Usuário: SIM (TDD)
```

**Impacto**:
- Prometheus estruturará cada tarefa como: RED → GREEN → REFACTOR
- Critérios de Aceitação do TODO incluirão explicitamente comandos de teste
- Atlas seguirá o fluxo de trabalho TDD ao executar

## Resumo da Lição

**Valor Central do Prometheus**:
- **Separação de Planejamento e Execução**: Através da restrição forçada de "não escrever código", garante que os requisitos estejam claros
- **Modo de Entrevista**: Fazer perguntas contínuas, pesquisar código base, atualizar rascunhos
- **Garantia de Qualidade**: Consulta ao Metis, validação do Momus, princípio do plano único

**Fluxo de Trabalho Típico**:
1. Digite `@prometheus [necessidade]` para iniciar o planejamento
2. Responda às perguntas, verifique o rascunho em `.sisyphus/drafts/`
3. Aguarde a transição automática do Prometheus (Lista de Verificação de Aprovação totalmente marcada)
4. Veja o `.sisyphus/plans/{name}.md` gerado
5. Escolha "Iniciar Trabalho" ou "Revisão de Alta Precisão"
6. Execute `/start-work` para delegar ao Atlas para execução

**Melhores Práticas**:
- Gaste tempo entendendo os requisitos, não apresse para obter o plano
- Verifique continuamente os arquivos de rascunho, corrija mal-entendidos prontamente
- Siga o princípio do plano único, não divida tarefas grandes
- Estratégia de testes clara, afeta toda a estrutura do plano

## Próxima Aula

> Na próxima aula aprenderemos **[Tarefas em Segundo Plano: Trabalhando como uma Equipe](../background-tasks/)**.
>
> Você vai aprender:
> - Como fazer múltiplos agentes trabalharem em paralelo, aumentando drasticamente a eficiência
> - Configurar limites de concorrência, evitando rate limits de API
> - Gerenciar tarefas em segundo plano, obter resultados e cancelar operações
> - Coordenar múltiplos agentes especialistas como uma "equipe real"

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-26

| Funcionalidade | Caminho do Arquivo | Linha |
|---|---|---|
| Prompt do Sistema Prometheus | [`src/agents/prometheus-prompt.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/prometheus-prompt.ts) | 19-1184 |
| Configuração de Permissões do Prometheus | [`src/agents/prometheus-prompt.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/prometheus-prompt.ts) | 1187-1197 |
| Agente Metis | [`src/agents/metis.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/metis.ts) | - |
| Agente Momus | [`src/agents/momus.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/momus.ts) | - |
| Documento Guia de Orquestração | [`docs/orchestration-guide.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/orchestration-guide.md) | 67-90 |

**Constantes Principais**:
- `PROMETHEUS_SYSTEM_PROMPT`: Prompt do sistema completo, define a identidade, fluxo de trabalho e restrições do Prometheus

**Funções/Ferramentas Chave**:
- `PROMETHEUS_PERMISSION`: Define permissões de ferramentas do Prometheus (apenas permite edição de arquivos .md)

**Regras de Negócio**:
- Modo padrão do Prometheus: INTERVIEW MODE (Modo de Entrevista)
- Condição de transição automática: Lista de Verificação de Aprovação totalmente SIM
- Consulta ao Metis: Obrigatória, executada antes da geração do plano
- Ciclo do Momus: Modo de alta precisão opcional, cicla até "OKAY"
- Princípio do Plano Único: Independentemente do tamanho da tarefa, todos os TODOs em um único arquivo `.md`
- Gerenciamento de Rascunhos: Atualizar continuamente `.sisyphus/drafts/{name}.md`, excluir após a conclusão do plano
</details>
