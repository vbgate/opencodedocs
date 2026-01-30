---
title: "Apêndice opencode-notify: Referência Completa de Tipos de Evento e Arquivo de Configuração | Tutorial"
sidebarTitle: "Consultar Configurações e Eventos"
subtitle: "Apêndice: Referência de Tipos de Evento e Configuração"
description: "Consulte a explicação de tipos de evento e exemplos de arquivo de configuração do plugin opencode-notify. Este tutorial lista quatro tipos de eventos OpenCode e condições de gatilho, explica detalhadamente as regras de filtragem e diferenças de plataforma para cada evento, fornece modelo completo de arquivo de configuração, comentários detalhados para todos os campos, configurações de valores padrão, exemplo de configuração mínima, método para desabilitar o plugin e lista completa de efeitos sonoros disponíveis no macOS."
order: 5
---

# Apêndice: Referência de Tipos de Evento e Configuração

Este capítulo fornece documentação de referência e exemplos de configuração para ajudá-lo a entender profundamente os tipos de evento e opções de configuração do opencode-notify. Este conteúdo é adequado como material de referência e não precisa ser aprendido em ordem.

## Caminho de Aprendizado

### 1. [Explicação dos Tipos de Evento](./event-types/)

Entenda os tipos de evento OpenCode monitorados pelo plugin e suas condições de gatilho.

- Quatro tipos de eventos (session.idle, session.error, permission.updated, tool.execute.before)
- Momento de gatilho e lógica de processamento para cada tipo de evento
- Regras de filtragem para verificação de sessão pai, verificação de período silencioso e verificação de foco do terminal
- Diferenças funcionais entre diferentes plataformas

### 2. [Exemplo de Arquivo de Configuração](./config-file-example/)

Veja exemplos completos de arquivo de configuração e comentários detalhados para todos os campos.

- Template completo de arquivo de configuração
- Explicação dos campos notifyChildSessions, sounds, quietHours, terminal, etc.
- Lista completa de efeitos sonoros disponíveis no macOS
- Exemplo de configuração mínima
- Método para desabilitar o plugin

## Pré-condições

::: tip Sugestão de Aprendizado

Este capítulo é um documento de referência e pode ser consultado quando necessário. Recomenda-se consultar o conteúdo deste capítulo após concluir os seguintes tutoriais básicos:

- [Início Rápido](../../start/quick-start/) - Conclua a instalação e configuração inicial
- [Como Funciona](../../start/how-it-works/) - Entenda o mecanismo central do plugin

:::

## Próximos Passos

Após concluir o conteúdo do apêndice, você pode:

- Ver o [Registro de Alterações](../changelog/release-notes/) para entender o histórico de versões e novos recursos
- Retornar à [Referência de Configuração](../../advanced/config-reference/) para aprender mais sobre opções de configuração avançadas
- Navegar nas [Perguntas Frequentes](../../faq/common-questions/) para encontrar respostas
