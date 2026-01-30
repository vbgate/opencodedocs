---
title: "Funcionalidades Principais: Três Capacidades Essenciais | opencode-dcp"
sidebarTitle: "Desbloqueie as Três Capacidades"
subtitle: "Funcionalidades Principais: Três Capacidades Essenciais"
description: "Aprenda as três funcionalidades principais do opencode-dcp: estratégias de poda automática, ferramentas orientadas por LLM e comandos Slash. Domine essas funcionalidades para aproveitar ao máximo o potencial de otimização de tokens."
order: 20
---

# Funcionalidades Principais

Este capítulo explora em profundidade as três capacidades essenciais do DCP: estratégias de poda automática, ferramentas orientadas por LLM e comandos Slash. Ao dominar essas funcionalidades, você poderá aproveitar ao máximo o potencial de otimização de tokens do DCP.

## Conteúdo deste Capítulo

<div class="grid-cards">

### [Estratégias de Poda Automática](./auto-pruning/)

Compreenda em detalhes como funcionam as três estratégias automáticas do DCP: estratégia de deduplicação, estratégia de sobrescrita e estratégia de limpeza de erros. Entenda as condições de ativação e os cenários de aplicação de cada estratégia.

### [Ferramentas de Poda Orientadas por LLM](./llm-tools/)

Entenda como a IA invoca autonomamente as ferramentas `discard` e `extract` para otimizar o contexto. Esta é a funcionalidade mais inteligente do DCP, permitindo que a IA participe ativamente do gerenciamento de contexto.

### [Uso dos Comandos Slash](./commands/)

Domine o uso de todos os comandos do DCP: `/dcp context` para visualizar o estado do contexto, `/dcp stats` para ver estatísticas e `/dcp sweep` para acionar a poda manualmente.

</div>

## Roteiro de Aprendizado

Recomendamos seguir esta ordem para estudar o conteúdo deste capítulo:

```
Estratégias de Poda Automática → Ferramentas Orientadas por LLM → Comandos Slash
            ↓                              ↓                           ↓
    Compreender os princípios      Dominar a poda inteligente    Aprender a monitorar e depurar
```

1. **Comece pelas estratégias de poda automática**: Esta é a base do DCP — entenda como funcionam as três estratégias
2. **Em seguida, aprenda as ferramentas orientadas por LLM**: Após compreender as estratégias automáticas, aprenda a capacidade mais avançada de poda proativa pela IA
3. **Por fim, aprenda os comandos Slash**: Domine os métodos de monitoramento e controle manual para facilitar a depuração e otimização

::: tip Pré-requisitos
Antes de estudar este capítulo, certifique-se de ter concluído:
- [Instalação e Início Rápido](../start/getting-started/) - Instalação do plugin DCP concluída
- [Guia Completo de Configuração](../start/configuration/) - Compreensão dos conceitos básicos do sistema de configuração
:::

## Próximos Passos

Após concluir este capítulo, você pode continuar explorando:

- **[Mecanismos de Proteção](../advanced/protection/)** - Aprenda a proteger conteúdo crítico contra poda acidental
- **[Persistência de Estado](../advanced/state-persistence/)** - Entenda como o DCP mantém o estado entre sessões
- **[Impacto no Cache de Prompts](../advanced/prompt-caching/)** - Compreenda as compensações entre DCP e Prompt Caching
