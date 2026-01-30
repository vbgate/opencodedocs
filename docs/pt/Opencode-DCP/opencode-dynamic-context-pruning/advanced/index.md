---
title: "Funcionalidades Avançadas: Análise Profunda | opencode-dcp"
sidebarTitle: "Evite Poda Acidental de Conteúdo Crítico"
subtitle: "Funcionalidades Avançadas: Análise Profunda"
description: "Aprenda os mecanismos de proteção, persistência de estado e outros recursos avançados do DCP. Domine técnicas de uso em cenários complexos, evite poda de conteúdo crítico e otimize o acerto de cache."
order: 30
---

# Funcionalidades Avançadas

Este capítulo explora em profundidade os recursos avançados do DCP, ajudando você a entender os mecanismos internos do plugin e a usar o DCP corretamente em cenários complexos.

::: warning Pré-requisitos
Antes de estudar este capítulo, certifique-se de ter concluído:
- [Instalação e Início Rápido](../start/getting-started/) - Entenda a instalação básica e o uso do DCP
- [Guia Completo de Configuração](../start/configuration/) - Familiarize-se com o sistema de configuração do DCP
- [Estratégias de Poda Automática Detalhadas](../platforms/auto-pruning/) - Compreenda as principais estratégias de poda do DCP
:::

## Conteúdo deste Capítulo

| Curso | Descrição | Cenário Adequado |
|--- | --- | ---|
| [Mecanismos de Proteção](./protection/) | Modos de proteção de turnos, ferramentas protegidas e arquivos protegidos | Evite poda de conteúdo crítico |
| [Persistência de Estado](./state-persistence/) | Como o DCP mantém o estado de poda e estatísticas entre sessões | Entenda o mecanismo de armazenamento de dados |
| [Impacto no Cache de Prompts](./prompt-caching/) | Impacto da poda do DCP no Prompt Caching | Otimize a taxa de acerto de cache |
| [Tratamento de Subagentes](./subagent-handling/) | Comportamento e limitações do DCP em sessões de subagentes | Ao usar a ferramenta Task |

## Sugestão de Roteiro de Aprendizado

```
Mecanismos de Proteção → Persistência de Estado → Impacto no Cache de Prompts → Tratamento de Subagentes
    ↓                   ↓                              ↓                              ↓
  Obrigatório        Aprenda conforme necessário    Aprenda ao otimizar          Aprenda ao usar subagentes
```

**Ordem Recomendada**:

1. **Mecanismos de Proteção** (Obrigatório) - Este é o recurso avançado mais importante. Entendê-lo evita que o DCP remova acidentalmente conteúdo crítico
2. **Persistência de Estado** (Conforme necessário) - Se você deseja entender como o DCP registra estatísticas ou precisa depurar problemas de estado
3. **Impacto no Cache de Prompts** (Ao otimizar desempenho) - Quando você se preocupa com otimização de custos de API, precisa equilibrar a relação entre poda e cache
4. **Tratamento de Subagentes** (Ao usar subagentes) - Se você usa a ferramenta Task do OpenCode para despachar subtarefas, precisa entender as limitações do DCP

## Próximos Passos

Após concluir este capítulo, você pode:

- Consultar [Perguntas Frequentes e Solução de Problemas](../faq/troubleshooting/) para resolver problemas encontrados durante o uso
- Ler [Melhores Práticas](../faq/best-practices/) para aprender como maximizar a economia de tokens
- Aprofundar-se na [Visão Geral da Arquitetura](../appendix/architecture/) para entender a implementação interna do DCP
