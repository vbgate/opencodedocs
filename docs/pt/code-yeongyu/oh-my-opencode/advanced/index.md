---
title: "Avançado: Fluxos de Trabalho com IA | oh-my-opencode"
sidebarTitle: "Trabalhe Como uma Equipe"
subtitle: "Avançado: Fluxos de Trabalho com IA"
description: "Domine a orquestração avançada de fluxos de trabalho com IA no oh-my-opencode. Aprenda sobre equipes de agentes, tarefas paralelas, sistema de Categorias/Skills, ganchos de ciclo de vida e personalização profunda para construir sistemas de desenvolvimento com IA eficientes."
order: 60
---

# Avançado

Este capítulo mergulha profundamente nos recursos avançados do oh-my-opencode: equipes profissionais de agentes de IA, tarefas em segundo plano paralelas, sistema de Categorias e Skills, ganchos de ciclo de vida e mais. Dominar essas capacidades permitirá que você orquestre fluxos de trabalho com IA como gerenciar uma equipe real, alcançando uma experiência de desenvolvimento mais eficiente.

## Conteúdo do Capítulo

<div class="grid-cards">

### [Equipes de Agentes de IA: Visão Geral de 10 Especialistas](./ai-agents-overview/)

Apresentação abrangente da funcionalidade, casos de uso e métodos de chamada dos 10 agentes integrados. Aprenda a selecionar o agente certo com base no tipo de tarefa, permitindo colaboração eficiente de equipe, execução paralela de tarefas e análise profunda de código.

### [Planejamento Prometheus: Coleta de Requisitos Baseada em Entrevistas](./prometheus-planning/)

Esclareça requisitos e gere planos de trabalho através do modo de entrevista. O Prometheus continuará fazendo perguntas até que os requisitos estejam claros e consultará automaticamente Oracle, Metis e Momus para verificar a qualidade do plano.

### [Tarefas Paralelas em Segundo Plano: Trabalhe Como uma Equipe](./background-tasks/)

Explicação detalhada do uso do sistema de gerenciamento de agentes em segundo plano. Aprenda controle de concorrência, polling de tarefas e recuperação de resultados, permitindo que múltiplos agentes de IA lidem com diferentes tarefas simultaneamente, melhorando drasticamente a eficiência do trabalho.

### [LSP e AST-Grep: Ferramentas de Refatoração de Código](./lsp-ast-tools/)

Introdução ao uso de ferramentas LSP e AST-Grep. Demonstre como implementar análise e operações de código em nível de IDE, incluindo navegação de símbolos, pesquisa de referências e pesquisa de código estruturada.

### [Categorias e Skills: Composição Dinâmica de Agentes](./categories-skills/)

Aprenda a usar o sistema de Categorias e Skills para criar sub-agentes especializados. Implemente composição flexível de agentes, atribuindo dinamicamente modelos, ferramentas e habilidades com base nos requisitos da tarefa.

### [Skills Integrados: Automação de Navegador e Especialista em Git](./builtin-skills/)

Apresentação detalhada dos casos de uso e melhores práticas de três Skills integrados (playwright, frontend-ui-ux, git-master). Acesse rapidamente capacidades profissionais como automação de navegador, design de UI frontend e operações Git.

### [Ganchos de Ciclo de Vida: Contexto Automatizado e Controle de Qualidade](./lifecycle-hooks/)

Introdução ao uso de 32 ganchos de ciclo de vida. Entenda como automatizar injeção de contexto, recuperação de erros e controle de qualidade, construindo um sistema completo de automação de fluxos de trabalho com IA.

### [Comandos Slash: Fluxos de Trabalho Predefinidos](./slash-commands/)

Introdução ao uso de 6 comandos slash integrados. Incluindo /ralph-loop (loop de correção rápida), /refactor (refatoração de código), /start-work (início de execução de projeto) e outros fluxos de trabalho comuns.

### [Personalização Profunda de Configuração: Gerenciamento de Agentes e Permissões](./advanced-configuration/)

Ensine aos usuários personalização profunda de configuração de agentes, configurações de permissões, substituição de modelos e modificações de prompt. Domine capacidades completas de configuração, criando fluxos de trabalho com IA alinhados com padrões da equipe.

</div>

## Caminho de Aprendizado

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  Step 1                  Step 2                     Step 3                          Step 4                  │
│  Understand AI Agents  →   Master Planning     →   Learn Dynamic Agent     →   Deep Customization      │
│  (Basic Concepts)          & Parallel Tasks         Composition                 & Automation             │
│                                                      (Advanced Usage)          (Expert Level)           │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Sequência Recomendada**:

1. **Comece com Equipes de Agentes de IA**: Entenda as responsabilidades e casos de uso dos 10 agentes—este é o alicerce para entender todo o sistema.
2. **Depois Aprenda Planejamento e Tarefas Paralelas**: Domine o planejamento Prometheus e o sistema de tarefas em segundo plano—este é o núcleo da colaboração eficiente.
3. **Em Seguida Aprenda Composição Dinâmica de Agentes**: Aprenda Categorias e Skills para alcançar especialização flexível de agentes.
4. **Finalmente Aprenda Personalização Profunda**: Domine ganchos de ciclo de vida, comandos slash e personalização de configuração para construir fluxos de trabalho completos.

**Rotas Avançadas**:
- Se seu objetivo é **início rápido**: Foque em "Equipes de Agentes de IA" e "Comandos Slash"
- Se seu objetivo é **colaboração em equipe**: Mergulhe profundamente em "Planejamento Prometheus" e "Tarefas Paralelas em Segundo Plano"
- Se seu objetivo é **automação de fluxos de trabalho**: Aprenda "Ganchos de Ciclo de Vida" e "Personalização Profunda de Configuração"

## Pré-requisitos

::: warning Antes de Começar
Este capítulo assume que você completou:

- ✅ [Instalação Rápida e Configuração](../start/installation/): Instalou o oh-my-opencode e configurou pelo menos um Provider
- ✅ [Primeiro Olhar no Sisyphus: Orquestrador Principal](../start/sisyphus-orchestrator/): Entendeu mecanismos básicos de chamada e delegação de agentes
- ✅ [Configuração de Provider: Claude, OpenAI, Gemini](../platforms/provider-setup/): Configurou pelo menos um AI Provider
:::

## Próximos Passos

Após completar este capítulo, recomendamos continuar com:

- **[Diagnósticos de Configuração e Solução de Problemas](../faq/troubleshooting/)**: Localize e resolva rapidamente problemas quando surgirem.
- **[Referência de Configuração](../appendix/configuration-reference/)**: Visualize o esquema completo do arquivo de configuração e entenda todas as opções de configuração.
- **[Compatibilidade com Claude Code](../appendix/claude-code-compatibility/)**: Aprenda como migrar fluxos de trabalho existentes do Claude Code para o oh-my-opencode.
