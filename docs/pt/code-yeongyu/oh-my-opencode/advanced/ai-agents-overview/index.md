---
title: "Agentes de IA: Apresentação de 10 Especialistas | oh-my-opencode"
sidebarTitle: "Conheça 10 Especialistas de IA"
subtitle: "Agentes de IA: Apresentação de 10 Especialistas"
description: "Aprenda sobre os 10 agentes de IA do oh-my-opencode. Selecione agentes com base no tipo de tarefa para alcançar colaboração eficiente e execução paralela."
tags:
  - "agentes-ia"
  - "orquestração"
prerequisite:
  - "start-sisyphus-orchestrator"
order: 60
---

# Equipe de Agentes de IA: Apresentação de 10 Especialistas

## O Que Você Vai Aprender

- Compreender as responsabilidades e especialidades dos 10 agentes de IA integrados
- Selecionar rapidamente o agente mais adequado com base no tipo de tarefa
- Entender os mecanismos de colaboração entre agentes (delegação, paralelização, revisão)
- Dominar as restrições de permissões e cenários de uso de diferentes agentes

## Ideia Central: Colaborar Como uma Equipe Real

A ideia central do **oh-my-opencode** é: **não trate a IA como um assistente onipotente, mas como uma equipe profissional**.

Em uma equipe de desenvolvimento real, você precisa de:
- **Orquestrador Principal** (Tech Lead): responsável por planejamento, alocação de tarefas e acompanhamento de progresso
- **Consultor de Arquitetura** (Architect): fornece decisões técnicas e recomendações de design de arquitetura
- **Revisor de Código** (Reviewer): verifica a qualidade do código e identifica problemas potenciais
- **Especialista em Pesquisa** (Researcher): busca documentação, pesquisa implementações open source e investiga melhores práticas
- **Detetive de Código** (Searcher): localiza rapidamente código, encontra referências e compreende implementações existentes
- **Designer Frontend** (Frontend Designer): projeta UI e ajusta estilos
- **Especialista Git** (Git Master): faz commits de código, gerencia branches e pesquisa histórico

O oh-my-opencode transformou esses papéis em 10 agentes de IA profissionais que você pode combinar e usar de forma flexível com base no tipo de tarefa.

## Detalhamento dos 10 Agentes

### Orquestradores Principais (2)

#### Sisyphus - Orquestrador Principal

**Papel**: Orquestrador principal, seu líder técnico primário

**Capacidades**:
- Raciocínio profundo (32k thinking budget)
- Planejamento e delegação de tarefas complexas
- Execução de modificações e refatorações de código
- Gerenciamento de todo o fluxo de desenvolvimento

**Modelo Recomendado**: `anthropic/claude-opus-4-5` (temperature: 0.1)

**Cenários de Uso**:
- Tarefas de desenvolvimento diárias (novas funcionalidades, correção de bugs)
- Problemas complexos que exigem raciocínio profundo
- Decomposição e execução de tarefas em múltiplas etapas
- Cenários que exigem delegação paralela a outros agentes

**Método de Invocação**:
- Agente principal padrão ("Sisyphus" no seletor de Agentes OpenCode)
- Digite a tarefa diretamente no prompt, sem necessidade de palavras-chave especiais

**Permissões**: Permissões completas de ferramentas (write, edit, bash, delegate_task, etc.)

---

#### Atlas - Gerenciador de TODO

**Papel**: Orquestrador principal, focado em gerenciamento de listas TODO e rastreamento de execução de tarefas

**Capacidades**:
- Gerenciar e rastrear listas TODO
- Execução sistemática de planos
- Monitoramento de progresso de tarefas

**Modelo Recomendado**: `anthropic/claude-opus-4-5` (temperature: 0.1)

**Cenários de Uso**:
- Iniciar execução de projeto com o comando `/start-work`
- Necessidade de completar tarefas rigorosamente de acordo com o plano
- Rastreamento sistemático de progresso de tarefas

**Método de Invocação**:
- Usar comando slash `/start-work`
- Ativação automática via Atlas Hook

**Permissões**: Permissões completas de ferramentas

---

### Consultores e Revisores (3)

#### Oracle - Consultor Estratégico

**Papel**: Consultor técnico somente leitura, especialista em raciocínio de alto nível

**Capacidades**:
- Recomendações de decisões arquiteturais
- Diagnóstico de problemas complexos
- Revisão de código (somente leitura)
- Análise de trade-offs entre múltiplos sistemas

**Modelo Recomendado**: `openai/gpt-5.2` (temperature: 0.1)

**Cenários de Uso**:
- Design de arquitetura complexa
- Auto-revisão após completar trabalho importante
- Depuração difícil após 2+ tentativas de correção falhadas
- Padrões de código ou arquitetura desconhecidos
- Questões relacionadas a segurança/desempenho

**Condições de Ativação**:
- Prompt contém `@oracle` ou usa `delegate_task(agent="oracle")`
- Recomendação automática em decisões arquiteturais complexas

**Restrições**: Permissões somente leitura (proibido write, edit, task, delegate_task)

**Princípios Fundamentais**:
- **Minimalismo**: tendência para a solução mais simples
- **Aproveitar Recursos Existentes**: priorizar modificação do código atual, evitar introdução de novas dependências
- **Experiência do Desenvolvedor em Primeiro Lugar**: legibilidade, manutenibilidade > desempenho teórico
- **Caminho Único e Claro**: fornecer uma recomendação principal, oferecer alternativas apenas quando as diferenças de trade-off são significativas

---

#### Metis - Analista de Pré-Planejamento

**Papel**: Especialista em análise de requisitos e avaliação de riscos antes do planejamento

**Capacidades**:
- Identificar requisitos ocultos e não especificados
- Detectar ambiguidades que podem levar a falhas de IA
- Sinalizar padrões potenciais de AI-slop (sobre-engenharia, expansão de escopo)
- Preparar instruções para agentes de planejamento

**Modelo Recomendado**: `anthropic/claude-sonnet-4-5` (temperature: 0.3)

**Cenários de Uso**:
- Antes do planejamento do Prometheus
- Quando a solicitação do usuário é vaga ou aberta
- Prevenir padrões de sobre-engenharia de IA

**Método de Invocação**: Invocação automática pelo Prometheus (modo entrevista)

**Restrições**: Permissões somente leitura (proibido write, edit, task, delegate_task)

**Fluxo Principal**:
1. **Classificação de Intenção**: refatoração / construir do zero / tarefa média / colaboração / arquitetura / pesquisa
2. **Análise Específica de Intenção**: fornecer recomendações direcionadas com base em diferentes tipos
3. **Geração de Perguntas**: gerar perguntas claras para o usuário
4. **Preparação de Instruções**: gerar instruções claras de "MUST" e "MUST NOT" para o Prometheus

---

#### Momus - Revisor de Planos

**Papel**: Especialista rigoroso em revisão de planos, identifica todas as omissões e pontos ambíguos

**Capacidades**:
- Verificar clareza, verificabilidade e completude do plano
- Verificar todas as referências de arquivos e contexto
- Simular etapas de implementação real
- Identificar omissões críticas

**Modelo Recomendado**: `anthropic/claude-sonnet-4-5` (temperature: 0.1)

**Cenários de Uso**:
- Após o Prometheus criar um plano de trabalho
- Antes de executar listas TODO complexas
- Validar qualidade do plano

**Método de Invocação**: Invocação automática pelo Prometheus

**Restrições**: Permissões somente leitura (proibido write, edit, task, delegate_task)

**Quatro Critérios de Revisão**:
1. **Clareza do Trabalho**: cada tarefa especifica fontes de referência?
2. **Critérios de Verificação e Aceitação**: existem métodos específicos de verificação de sucesso?
3. **Completude do Contexto**: contexto suficiente fornecido (limiar de confiança de 90%)?
4. **Compreensão Geral**: o desenvolvedor entende o WHY, WHAT e HOW?

**Princípio Fundamental**: **Revisor de documentos, não consultor de design**. Avalia se "o plano está claro o suficiente para ser executado", não se "o método escolhido está correto".

---

### Pesquisa e Exploração (3)

#### Librarian - Especialista em Pesquisa Multi-Repositório

**Papel**: Especialista em compreensão de repositórios de código open source, especializado em encontrar documentação e exemplos de implementação

**Capacidades**:
- GitHub CLI: clonar repositórios, pesquisar issues/PRs, visualizar histórico
- Context7: consultar documentação oficial
- Web Search: pesquisar informações mais recentes
- Gerar evidências com permalinks

**Modelo Recomendado**: `opencode/big-pickle` (temperature: 0.1)

**Cenários de Uso**:
- "Como usar [biblioteca]?"
- "Quais são as melhores práticas para [recurso do framework]?"
- "Por que [dependência externa] se comporta assim?"
- "Encontrar exemplos de uso de [biblioteca]"

**Condições de Ativação**:
- Ativação automática ao mencionar bibliotecas/fontes externas
- Prompt contém `@librarian`

**Classificação de Tipos de Solicitação**:
- **Tipo A (Conceitual)**: "Como fazer X?", "Melhores práticas"
- **Tipo B (Referência de Implementação)**: "Como X implementa Y?", "Mostrar código-fonte de Z"
- **Tipo C (Contexto e Histórico)**: "Por que mudou assim?", "Histórico de X?"
- **Tipo D (Pesquisa Abrangente)**: solicitações complexas/vagas

**Restrições**: Permissões somente leitura (proibido write, edit, task, delegate_task, call_omo_agent)

**Requisito Obrigatório**: Todas as declarações de código devem incluir permalinks do GitHub

---

#### Explore - Especialista em Exploração Rápida de Codebase

**Papel**: Especialista em busca de código com consciência de contexto

**Capacidades**:
- Ferramentas LSP: definições, referências, navegação de símbolos
- AST-Grep: busca de padrões estruturais
- Grep: busca de padrões de texto
- Glob: correspondência de padrões de nomes de arquivos
- Execução paralela (3+ ferramentas executando simultaneamente)

**Modelo Recomendado**: `opencode/gpt-5-nano` (temperature: 0.1)

**Cenários de Uso**:
- Busca ampla que requer 2+ ângulos de pesquisa
- Estrutura de módulo desconhecida
- Descoberta de padrões entre camadas
- Encontrar "Onde está X?", "Qual arquivo tem Y?"

**Condições de Ativação**:
- Ativação automática quando 2+ módulos estão envolvidos
- Prompt contém `@explore`

**Formato de Saída Obrigatório**:
```
<analysis>
**Literal Request**: [solicitação literal do usuário]
**Actual Need**: [o que realmente é necessário]
**Success Looks Like**: [como deve ser o sucesso]
</analysis>

<results>
<files>
- /absolute/path/to/file1.ts — [por que este arquivo é relevante]
- /absolute/path/to/file2.ts — [por que este arquivo é relevante]
</files>

<answer>
[resposta direta à necessidade real]
</answer>

<next_steps>
[o que fazer a seguir]
</next_steps>
</results>
```

**Restrições**: Permissões somente leitura (proibido write, edit, task, delegate_task, call_omo_agent)

---

#### Multimodal Looker - Especialista em Análise de Mídia

**Papel**: Interpretar arquivos de mídia que não podem ser lidos como texto puro

**Capacidades**:
- PDF: extrair texto, estrutura, tabelas, dados de seções específicas
- Imagens: descrever layout, elementos de UI, texto, gráficos
- Diagramas: explicar relacionamentos, fluxos, arquitetura

**Modelo Recomendado**: `google/gemini-3-flash` (temperature: 0.1)

**Cenários de Uso**:
- Necessidade de extrair dados estruturados de PDFs
- Descrever elementos de UI ou gráficos em imagens
- Analisar diagramas em documentação técnica

**Método de Invocação**: Ativação automática via ferramenta `look_at`

**Restrições**: **Whitelist somente leitura** (apenas ferramenta read permitida)

---

### Planejamento e Execução (2)

#### Prometheus - Planejador Estratégico

**Papel**: Especialista em coleta de requisitos estilo entrevista e geração de planos de trabalho

**Capacidades**:
- Modo entrevista: fazer perguntas contínuas até que os requisitos estejam claros
- Geração de plano de trabalho: documento de plano estruturado em Markdown
- Delegação paralela: consultar Oracle, Metis, Momus para validar plano

**Modelo Recomendado**: `anthropic/claude-opus-4-5` (temperature: 0.1)

**Cenários de Uso**:
- Criar planos detalhados para projetos complexos
- Projetos que exigem requisitos claros
- Fluxo de trabalho sistemático

**Método de Invocação**:
- Prompt contém `@prometheus` ou "usar Prometheus"
- Usar comando slash `/start-work`

**Fluxo de Trabalho**:
1. **Modo Entrevista**: fazer perguntas contínuas até que os requisitos estejam claros
2. **Rascunhar Plano**: gerar plano estruturado em Markdown
3. **Delegação Paralela**:
   - `delegate_task(agent="oracle", prompt="revisar decisões arquiteturais")` → execução em segundo plano
   - `delegate_task(agent="metis", prompt="identificar riscos potenciais")` → execução em segundo plano
   - `delegate_task(agent="momus", prompt="validar completude do plano")` → execução em segundo plano
4. **Integrar Feedback**: refinar plano
5. **Saída do Plano**: salvar em `.sisyphus/plans/{name}.md`

**Restrições**: Apenas planejamento, não implementação de código (forçado pelo Hook `prometheus-md-only`)

---

#### Sisyphus Junior - Executor de Tarefas

**Papel**: Executor de sub-agentes gerado por categoria

**Capacidades**:
- Herdar configuração de Categoria (modelo, temperature, prompt_append)
- Carregar Skills (habilidades especializadas)
- Executar subtarefas delegadas

**Modelo Recomendado**: Herdado da Categoria (padrão `anthropic/claude-sonnet-4-5`)

**Cenários de Uso**:
- Geração automática ao usar `delegate_task(category="...", skills=["..."])`
- Tarefas que exigem combinação específica de Categoria e Skill
- Tarefas rápidas e leves (Categoria "quick" usa modelo Haiku)

**Método de Invocação**: Geração automática via ferramenta `delegate_task`

**Restrições**: Proibido task, delegate_task (não pode delegar novamente)

---

## Referência Rápida de Invocação de Agentes

| Agente | Método de Invocação | Condição de Ativação |
| --- | --- | --- |
| **Sisyphus** | Agente principal padrão | Tarefas de desenvolvimento diárias |
| **Atlas** | Comando `/start-work` | Iniciar execução de projeto |
| **Oracle** | `@oracle` ou `delegate_task(agent="oracle")` | Decisões arquiteturais complexas, 2+ tentativas de correção falhadas |
| **Librarian** | `@librarian` ou `delegate_task(agent="librarian")` | Ativação automática ao mencionar bibliotecas/fontes externas |
| **Explore** | `@explore` ou `delegate_task(agent="explore")` | Ativação automática quando 2+ módulos estão envolvidos |
| **Multimodal Looker** | Ferramenta `look_at` | Necessidade de analisar PDF/imagens |
| **Prometheus** | `@prometheus` ou `/start-work` | Prompt contém "Prometheus" ou necessidade de planejamento |
| **Metis** | Invocação automática pelo Prometheus | Análise automática antes do planejamento |
| **Momus** | Invocação automática pelo Prometheus | Revisão automática após geração do plano |
| **Sisyphus Junior** | `delegate_task(category=...)` | Geração automática ao usar Categoria/Skill |

---

## Quando Usar Qual Agente

::: tip Árvore de Decisão Rápida

**Cenário 1: Desenvolvimento diário (escrever código, corrigir bugs)**
→ **Sisyphus** (padrão)

**Cenário 2: Decisões arquiteturais complexas**
→ Consultar **@oracle**

**Cenário 3: Necessidade de encontrar documentação ou implementação de biblioteca externa**
→ **@librarian** ou ativação automática

**Cenário 4: Codebase desconhecido, necessidade de encontrar código relacionado**
→ **@explore** ou ativação automática (2+ módulos)

**Cenário 5: Projeto complexo que requer plano detalhado**
→ **@prometheus** ou usar `/start-work`

**Cenário 6: Necessidade de analisar PDF ou imagem**
→ Ferramenta **look_at** (ativa automaticamente Multimodal Looker)

**Cenário 7: Tarefa rápida e simples, quer economizar**
→ `delegate_task(category="quick")`

**Cenário 8: Necessidade de operações profissionais Git**
→ `delegate_task(category="quick", skills=["git-master"])`

**Cenário 9: Necessidade de design de UI frontend**
→ `delegate_task(category="visual-engineering")`

**Cenário 10: Necessidade de tarefa de raciocínio de alto nível**
→ `delegate_task(category="ultrabrain")`

:::

---

## Exemplos de Colaboração de Agentes: Fluxo de Trabalho Completo

### Exemplo 1: Desenvolvimento de Funcionalidade Complexa

```
Usuário: Desenvolver um sistema de autenticação de usuários

→ Sisyphus recebe a tarefa
  → Analisa requisitos, descobre necessidade de biblioteca externa (JWT)
  → Delegação paralela:
    - @librarian: "Encontrar melhores práticas de JWT no Next.js" → [segundo plano]
    - @explore: "Encontrar código relacionado a autenticação existente" → [segundo plano]
  → Aguarda resultados, integra informações
  → Implementa funcionalidade de autenticação JWT
  → Após conclusão, delega:
    - @oracle: "Revisar design de arquitetura" → [segundo plano]
  → Otimiza com base em recomendações
```

---

### Exemplo 2: Planejamento de Projeto

```
Usuário: Usar Prometheus para planejar este projeto

→ Prometheus recebe a tarefa
  → Modo entrevista:
    - Pergunta 1: Quais são as funcionalidades principais?
    - [Resposta do usuário]
    - Pergunta 2: Qual é o público-alvo?
    - [Resposta do usuário]
    - ...
  → Após requisitos claros, delegação paralela:
    - delegate_task(agent="oracle", prompt="revisar decisões arquiteturais") → [segundo plano]
    - delegate_task(agent="metis", prompt="identificar riscos potenciais") → [segundo plano]
    - delegate_task(agent="momus", prompt="validar completude do plano") → [segundo plano]
  → Aguarda conclusão de todas as tarefas em segundo plano
  → Integra feedback, refina plano
  → Gera documento de plano em Markdown
→ Usuário revisa plano, confirma
→ Usa /start-work para iniciar execução
```

---

## Permissões e Restrições de Agentes

| Agente | write | edit | bash | delegate_task | webfetch | read | LSP | AST-Grep |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Sisyphus** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Atlas** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Oracle** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Librarian** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Explore** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Multimodal Looker** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Prometheus** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Metis** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Momus** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Sisyphus Junior** | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |

---

## Resumo da Lição

Os 10 agentes de IA do oh-my-opencode cobrem todos os aspectos do fluxo de desenvolvimento:

- **Orquestração e Execução**: Sisyphus (orquestrador principal), Atlas (gerenciamento TODO)
- **Consultores e Revisores**: Oracle (consultor estratégico), Metis (análise pré-planejamento), Momus (revisão de planos)
- **Pesquisa e Exploração**: Librarian (pesquisa multi-repositório), Explore (exploração de codebase), Multimodal Looker (análise de mídia)
- **Planejamento**: Prometheus (planejamento estratégico), Sisyphus Junior (execução de subtarefas)

**Pontos-Chave**:
1. Não trate a IA como assistente onipotente, trate como equipe profissional
2. Selecione o agente mais adequado com base no tipo de tarefa
3. Aproveite a delegação paralela para aumentar a eficiência (Librarian, Explore, Oracle podem executar em segundo plano)
4. Entenda as restrições de permissões de cada agente (agentes somente leitura não podem modificar código)
5. A colaboração entre agentes pode formar um fluxo de trabalho completo (planejamento → execução → revisão)

---

## Prévia da Próxima Aula

> Na próxima aula aprenderemos **[Planejamento com Prometheus: Coleta de Requisitos Estilo Entrevista](../prometheus-planning/)**.
>
> Você vai aprender:
> - Como usar o Prometheus para coleta de requisitos estilo entrevista
> - Como gerar planos de trabalho estruturados
> - Como fazer Metis e Momus validarem planos
> - Como obter e cancelar tarefas em segundo plano

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-26

| Agente | Caminho do Arquivo | Linha |
| --- | --- | --- |
| Orquestrador Principal Sisyphus | [`src/agents/sisyphus.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/sisyphus.ts) | - |
| Orquestrador Principal Atlas | [`src/agents/atlas.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/atlas.ts) | - |
| Consultor Oracle | [`src/agents/oracle.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/oracle.ts) | 1-123 |
| Especialista em Pesquisa Librarian | [`src/agents/librarian.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/librarian.ts) | 1-327 |
| Especialista em Busca Explore | [`src/agents/explore.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/explore.ts) | 1-123 |
| Multimodal Looker | [`src/agents/multimodal-looker.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/multimodal-looker.ts) | 1-57 |
| Planejador Prometheus | [`src/agents/prometheus-prompt.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/prometheus-prompt.ts) | 1-1196 |
| Análise Pré-Planejamento Metis | [`src/agents/metis.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/metis.ts) | 1-316 |
| Revisor de Planos Momus | [`src/agents/momus.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/momus.ts) | 1-445 |
| Sisyphus Junior | [`src/agents/sisyphus-junior.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/sisyphus-junior.ts) | - |
| Definição de Metadados de Agentes | [`src/agents/types.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/types.ts) | - |
| Restrições de Ferramentas de Agentes | [`src/shared/permission-compat.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/shared/permission-compat.ts) | - |

**Configurações Principais**:
- `ORACLE_PROMPT_METADATA`: Metadados do agente Oracle (condições de ativação, cenários de uso)
- `LIBRARIAN_PROMPT_METADATA`: Metadados do agente Librarian
- `EXPLORE_PROMPT_METADATA`: Metadados do agente Explore
- `MULTIMODAL_LOOKER_PROMPT_METADATA`: Metadados do agente Multimodal Looker
- `METIS_SYSTEM_PROMPT`: Prompt do sistema do agente Metis
- `MOMUS_SYSTEM_PROMPT`: Prompt do sistema do agente Momus

**Funções Principais**:
- `createOracleAgent(model)`: Criar configuração do agente Oracle
- `createLibrarianAgent(model)`: Criar configuração do agente Librarian
- `createExploreAgent(model)`: Criar configuração do agente Explore
- `createMultimodalLookerAgent(model)`: Criar configuração do agente Multimodal Looker
- `createMetisAgent(model)`: Criar configuração do agente Metis
- `createMomusAgent(model)`: Criar configuração do agente Momus

**Restrições de Permissões**:
- `createAgentToolRestrictions()`: Criar restrições de ferramentas de agentes (usado por Oracle, Librarian, Explore, Metis, Momus)
- `createAgentToolAllowlist()`: Criar whitelist de ferramentas de agentes (usado por Multimodal Looker)

</details>
