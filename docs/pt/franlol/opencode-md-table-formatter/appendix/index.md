---
title: "Apêndice: Detalhes Técnicos e Limitações | opencode-md-table-formatter"
sidebarTitle: "Entenda limitações e princípios"
subtitle: "Apêndice: Detalhes Técnicos e Limitações | opencode-md-table-formatter"
description: "Aprenda os limites técnicos e estratégias de otimização de desempenho do opencode-md-table-formatter. Entenda as limitações conhecidas do plugin, mecanismo de cache e detalhes de design, entenda profundamente o princípio de implementação."
tags:
  - "apêndice"
  - "limitações conhecidas"
  - "detalhes técnicos"
prerequisite:
  - "start-features"
order: 4
---

# Apêndice: Detalhes Técnicos e Limitações

Este capítulo contém documentação de referência e detalhes técnicos do plugin, ajudando você a entender profundamente as ideias de design, limites de limitação e estratégias de otimização de desempenho do plugin.

::: info O que você será capaz de fazer após esta aula
- Entender as limitações conhecidas do plugin e cenários de aplicação
- Dominar o mecanismo de cache e estratégias de otimização de desempenho
- Entender os limites técnicos e escolhas de design do plugin
:::

## Este capítulo contém

### 📚 [Limitações Conhecidas: Onde estão os limites do plugin](./limitations/)

Entenda as funcionalidades e limitações técnicas não suportadas pelo plugin, evitando usá-lo em cenários não suportados. Inclui:
- Não suporta tabelas HTML, células multilinha, tabelas sem linha separadora
- Não suporta células mescladas e opções de configuração
- Desempenho de tabelas muito grandes não verificado

**Público-alvo**: Usuários que querem saber o que o plugin pode e não pode fazer

### 🔧 [Detalhes Técnicos: Mecanismo de Cache e Otimização de Desempenho](./tech-details/)

Entenda profundamente a implementação interna do plugin, incluindo mecanismo de cache, estratégias de otimização de desempenho e estrutura de código. Inclui:
- Estrutura de dados widthCache e fluxo de busca de cache
- Mecanismo de limpeza automática e limiar de cache
- Análise de efeito de otimização de desempenho

**Público-alvo**: Desenvolvedores interessados no princípio de implementação do plugin

## Sugestão de caminho de aprendizado

As duas subpáginas deste capítulo são relativamente independentes e podem ser lidas conforme necessário:

1. **Usuários de início rápido**: Recomenda-se primeiro ler "Limitações Conhecidas", entender os limites do plugin e depois parar
2. **Usuários de aprendizado profundo**: Ler em ordem → "Limitações Conhecidas" → "Detalhes Técnicos"
3. **Desenvolvedores**: Recomenda-se leitura completa, ajuda a entender o design do plugin e extensões futuras

## Pré-requisitos

::: warning Preparação antes de aprender

Antes de começar este capítulo, recomenda-se que você já tenha concluído:
- [ ] [Visão Geral de Recursos: A Mágica da Formatação Automática](../../start/features/) - Entenda os recursos principais do plugin

Isso ajudará você a entender melhor os detalhes técnicos e explicações de limitações neste capítulo.
:::

## Próximos passos

Após concluir este capítulo, você pode continuar aprendendo:

- [Log de Atualizações: Histórico de Versões e Registro de Alterações](../../changelog/release-notes/) - Acompanhe a evolução de versões e novos recursos do plugin

Ou retorne ao capítulo anterior:
- [Perguntas Frequentes: O que fazer quando a tabela não é formatada](../../faq/troubleshooting/) - Localize e resolva rapidamente problemas comuns
