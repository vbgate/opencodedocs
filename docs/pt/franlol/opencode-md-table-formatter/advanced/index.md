---
title: "Recursos Avançados: Princípio de Formatação | opencode-md-table-formatter"
subtitle: "Recursos Avançados: Princípio de Formatação | opencode-md-table-formatter"
sidebarTitle: "Entenda como funciona"
order: 2
description: "Entenda profundamente o princípio de formatação do opencode-md-table-formatter. Domine o modo de ocultação, especificações de tabelas e métodos de alinhamento, entenda abrangentemente como o plugin funciona."
prerequisite:
  - "start-getting-started"
  - "start-features"
tags:
  - "avançado"
  - "princípio"
  - "especificações"
---

# Recursos Avançados: Entenda Profundamente os Detalhes Técnicos da Formatação de Tabelas Markdown

## Visão geral do capítulo

Este capítulo explora profundamente os detalhes técnicos da formatação de tabelas Markdown, incluindo o princípio de funcionamento do modo de ocultação do OpenCode, as especificações de estrutura de tabelas válidas e explicações detalhadas dos métodos de alinhamento. Ao aprender este conteúdo, você entenderá abrangentemente como o plugin processa a formatação de tabelas e como evitar erros comuns.

## Caminho de aprendizado

Recomenda-se aprender o conteúdo deste capítulo na seguinte ordem:

::: info Caminho de aprendizado
1. **Princípio do Modo de Ocultação** → Entenda por que é necessário tratamento especial para o modo de ocultação do OpenCode
2. **Especificações de Tabelas** → Domine que tipo de tabelas podem ser formatadas corretamente
3. **Detalhes de Alinhamento** → Aprenda como controlar o alinhamento e a estética das tabelas
:::

## Pré-requisitos

Antes de começar este capítulo, certifique-se de que você já:

- [x] Concluiu [Comece em 1 minuto](../start/getting-started/), instalou e configurou o plugin com sucesso
- [x] Leu [Visão Geral de Recursos](../start/features/), entendeu as funcionalidades básicas do plugin

::: warning Dica importante
Se você ainda não concluiu o aprendizado básico, recomenda-se voltar ao [Guia de Início](../start/getting-started/) para começar.
:::

## Navegação do curso

### [Princípio do Modo de Ocultação](./concealment-mode/)

Entenda o princípio de funcionamento do modo de ocultação do OpenCode e como o plugin calcula corretamente a largura de exibição. Você aprenderá:
- O que é o modo de ocultação e por que precisa de tratamento especial
- Como funciona o algoritmo de remoção de símbolos Markdown
- O papel do `Bun.stringWidth()` no cálculo de largura

**Tempo estimado**: 8 minutos | **Dificuldade**: Média | **Pré-requisito**: Visão Geral de Recursos

---

### [Especificações de Tabelas](./table-spec/)

Domine os requisitos de estrutura de tabelas Markdown válidas, evitando erros de "tabela inválida". Você aprenderá:
- Que tipo de estrutura de tabela é válida
- O papel e requisitos de formato da linha separadora
- Princípio de verificação de consistência do número de colunas
- Como identificar rapidamente problemas de estrutura de tabela

**Tempo estimado**: 6 minutos | **Dificuldade**: Iniciante | **Pré-requisito**: Princípio do Modo de Ocultação

---

### [Detalhes de Alinhamento](./alignment/)

Domine a sintaxe e efeitos dos três métodos de alinhamento, tornando as tabelas mais bonitas. Você aprenderá:
- Sintaxe de alinhamento à esquerda, centralizado e alinhamento à direita
- Como especificar o método de alinhamento na linha separadora
- Algoritmo de preenchimento de conteúdo de células
- Relação entre alinhamento e largura de exibição

**Tempo estimado**: 10 minutos | **Dificuldade**: Média | **Pré-requisito**: Especificações de Tabelas

---

## Resumo do capítulo

Após concluir este capítulo, você:

- ✅ Entenderá o princípio de funcionamento do modo de ocultação do OpenCode
- ✅ Dominará os requisitos de estrutura de tabelas válidas
- ✅ Será capaz de identificar e corrigir tabelas inválidas
- ✅ Usará proficientemente os três métodos de alinhamento
- ✅ Entenderá os detalhes técnicos da implementação interna do plugin

## Próximos passos

Após concluir este capítulo, você pode:

1. **Resolver problemas práticos** → Aprenda [Perguntas Frequentes](../../faq/troubleshooting/), localize e resolva rapidamente problemas
2. **Entender limites técnicos** → Leia [Limitações Conhecidas](../../appendix/limitations/), entenda os cenários de aplicação do plugin
3. **Entender profundamente a implementação** → Veja [Detalhes Técnicos](../../appendix/tech-details/), entenda o mecanismo de cache e otimização de desempenho

---

::: tip Sugestão prática
Se você quer resolver rapidamente problemas de formatação de tabelas, pode primeiro ler [Especificações de Tabelas](./table-spec/) deste capítulo, que contém os casos mais comuns de tabelas inválidas.
:::
