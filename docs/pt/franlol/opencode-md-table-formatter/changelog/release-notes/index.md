---
title: "Log de Atualizações: Histórico de Versões | opencode-md-table-formatter"
sidebarTitle: "Visão geral das mudanças de versão"
subtitle: "Log de Atualizações: Histórico de Versões e Registro de Alterações"
description: "Entenda a evolução de versões e novos recursos do opencode-md-table-formatter. Veja os recursos do v0.1.0, incluindo formatação automática e cache de largura."
tags:
  - "log de atualizações"
  - "histórico de versões"
  - "notas de versão"
prerequisite: []
order: 90
---

# Log de Atualizações: Histórico de Versões e Registro de Alterações

::: info O que você será capaz de fazer após esta aula
- Acompanhar a evolução de versões do plugin
- Entender os novos recursos e correções de cada versão
- Dominar limitações conhecidas e detalhes técnicos
- Entender possíveis melhorias futuras
:::

---

## [0.1.0] - 2025-01-07

### Novos recursos

Esta é a **versão de lançamento inicial** do opencode-md-table-formatter, contendo os seguintes recursos principais:

- **Formatação automática de tabelas**: Formata automaticamente tabelas Markdown geradas por IA através do hook `experimental.text.complete`
- **Suporte ao modo de ocultação**: Processa corretamente símbolos Markdown ocultos (como `**`, `*`) ao calcular a largura
- **Processamento de Markdown aninhado**: Suporta sintaxe Markdown aninhada em profundidade arbitrária, usando algoritmo de remoção de múltiplas passagens
- **Proteção de blocos de código**: Símbolos Markdown dentro do código em linha (`` `code` ``) permanecem na forma literal, não participando do cálculo de largura
- **Suporte a métodos de alinhamento**: Suporta alinhamento à esquerda (`---` ou `:---`), alinhamento centralizado (`:---:`), alinhamento à direita (`---:`)
- **Otimização de cache de largura**: Cache os resultados de cálculo de largura de exibição de strings, melhorando o desempenho
- **Validação de tabelas inválidas**: Valida automaticamente a estrutura da tabela, tabelas inválidas recebem comentário de erro
- **Suporte a múltiplos caracteres**: Suporta Emoji, caracteres Unicode, células vazias, conteúdo muito longo
- **Tratamento silencioso de erros**: Falhas na formatação não interrompem o fluxo de trabalho do OpenCode

### Detalhes técnicos

Esta versão contém aproximadamente **230 linhas de código TypeScript pronto para produção**:

- **12 funções**: Responsabilidades claras, bem separadas
- **Segurança de tipos**: Uso correto da interface `Hooks`
- **Limpeza inteligente de cache**: Aciona limpeza quando o número de operações excede 100 ou o número de entradas de cache excede 1000
- **Processamento de múltiplas passagens com regex**: Suporta remoção de símbolos Markdown com profundidade de aninhamento arbitrária

::: tip Mecanismo de cache
O cache foi projetado para otimizar o cálculo de largura de conteúdo repetido. Por exemplo, quando o mesmo texto de célula aparece várias vezes em uma tabela, a largura é calculada apenas uma vez, e as leituras subsequentes são feitas diretamente do cache.
:::

### Limitações conhecidas

Esta versão não suporta os seguintes cenários:

- **Tabelas HTML**: Suporta apenas tabelas de pipe Markdown (Pipe Table)
- **Células multilinha**: Não suporta células contendo tags `<br>`
- **Tabelas sem linha separadora**: As tabelas devem conter uma linha separadora (`|---|`) para serem formatadas
- **Requisitos de dependência**: Requer `@opencode-ai/plugin` >= 0.13.7 (usa o hook `experimental.text.complete` não documentado)

::: info Requisitos de versão
O plugin requer OpenCode >= 1.0.137 e `@opencode-ai/plugin` >= 0.13.7 para funcionar corretamente.
:::

---

## Planos futuros

Os seguintes recursos estão planejados para serem implementados em versões futuras:

- **Opções de configuração**: Suportar personalização de largura mínima/máxima de colunas, desabilitar recursos específicos
- **Suporte a tabelas sem cabeçalho**: Formatar tabelas sem linhas de cabeçalho
- **Otimização de desempenho**: Análise e otimização de desempenho para tabelas muito grandes (100+ linhas)
- **Mais opções de alinhamento**: Expandir a sintaxe e funcionalidade dos métodos de alinhamento

::: tip Participar da contribuição
Se você tem sugestões de recursos ou deseja contribuir com código, sinta-se à vontade para apresentar suas ideias em [GitHub Issues](https://github.com/franlol/opencode-md-table-formatter/issues).
:::

---

## Formato de registro de alterações

O log de atualizações deste projeto segue o formato [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), e os números de versão seguem a [Especificação de Versionamento Semântico (Semantic Versioning)](https://semver.org/spec/v2.0.0.html).

**Formato do número da versão**: `MAJOR.MINOR.PATCH`

- **MAJOR**: Alterações de API incompatíveis
- **MINOR**: Novos recursos compatíveis com versões anteriores
- **PATCH**: Correções de problemas compatíveis com versões anteriores

**Tipos de alterações**:

- **Added**: Novos recursos
- **Changed**: Alterações em recursos existentes
- **Deprecated**: Recursos que serão removidos em breve
- **Removed**: Recursos removidos
- **Fixed**: Correções de problemas
- **Security**: Correções relacionadas à segurança

---

## Ordem de leitura recomendada

Se você é um novo usuário, recomenda-se aprender na seguinte ordem:

1. [Comece em 1 minuto: Instalação e Configuração](../../start/getting-started/) —— Comece rapidamente
2. [Visão Geral de Recursos: A Mágica da Formatação Automática](../../start/features/) —— Entenda os recursos principais
3. [Perguntas Frequentes: O que fazer quando a tabela não é formatada](../../faq/troubleshooting/) —— Solução de problemas
4. [Limitações Conhecidas: Onde estão os limites do plugin](../../appendix/limitations/) —— Entenda as limitações
