---
title: "Recursos Avançados: Otimização | opencode-supermemory"
sidebarTitle: "Recursos Avançados"
subtitle: "Recursos Avançados: Otimização e Configuração do Supermemory"
description: "Aprenda os mecanismos avançados do Supermemory: compactação preemptiva e configuração detalhada. Otimize o desempenho da memória para seu projeto."
order: 3
---

# Recursos Avançados

Este capítulo explica profundamente os mecanismos subjacentes do Supermemory e opções de configuração avançadas. Você aprenderá como otimizar o desempenho do mecanismo de memória e personalizar o comportamento do plugin de acordo com as necessidades do projeto.

## Conteúdo do Capítulo

<div class="grid-cards">

### [Princípio de Compactação Preemptiva](./compaction/)

Entenda o mecanismo de compactação automática acionado por limite de Token. Aprenda como o Supermemory gera resumos estruturados e salva de forma persistente antes que o contexto esteja prestes a estourar, prevenindo problemas de "esquecimento" em sessões longas.

### [Configuração em Profundidade](./configuration/)

Personalize limites de compactação, regras de gatilho de palavras-chave e parâmetros de busca. Domine todas as opções do arquivo de configuração para que o Supermemory se adapte perfeitamente ao seu fluxo de trabalho.

</div>

## Caminho de Aprendizado

```
┌─────────────────────────────────────────────────────────────┐
│  Passo 1                 Passo 2                              │
│  Princípio de    →       Configuração em Profundidade        │
│  Compactação             (Personalização)                     │
│  Preemptiva                                                  │
│  (Entender o                                                    │
│   mecanismo)                                                  │
└─────────────────────────────────────────────────────────────┘
```

**Sequência recomendada**:

1. **Primeiro aprenda o princípio de compactação**: Entenda como o Supermemory gerencia automaticamente o contexto, esta é a base para configurações avançadas.
2. **Depois aprenda a configuração detalhada**: Só após entender o mecanismo você pode tomar decisões de configuração razoáveis (por exemplo, qual limite é apropriado definir).

## Pré-requisitos

::: warning Confirme antes de começar
Este capítulo assume que você completou o seguinte aprendizado:

- ✅ [Início Rápido](../start/getting-started/): Plugin instalado e API Key configurada
- ✅ [Escopo de Memória e Ciclo de Vida](../core/memory-management/): Entende a diferença entre User Scope e Project Scope
:::

## Próximos Passos

Após completar este capítulo, recomenda-se continuar aprendendo:

- **[Privacidade e Segurança de Dados](../security/privacy/)**: Entenda o mecanismo de anonimização de dados sensíveis, garantindo que seu código e chaves não sejam enviados acidentalmente.
