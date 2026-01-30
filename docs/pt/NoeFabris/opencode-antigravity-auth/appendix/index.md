---
title: "Apêndice: Referências Técnicas | Antigravity Auth"
sidebarTitle: "Entendendo os Princípios do Plugin"
subtitle: "Apêndice: Referências Técnicas de Arquitetura, API e Configuração"
description: "Conheça as referências técnicas do plugin Antigravity Auth, incluindo design de arquitetura, especificações de API, formatos de armazenamento e opções de configuração completas, para compreender profundamente os mecanismos internos do plugin."
order: 5
---

# Apêndice

Esta seção fornece referências técnicas do plugin Antigravity Auth, incluindo design de arquitetura, especificações de API, formatos de armazenamento e manual completo de configuração, ajudando você a compreender profundamente os mecanismos internos do plugin.

## Caminho de Aprendizado

### 1. [Visão Geral da Arquitetura](./architecture-overview/)

Conheça a estrutura modular do plugin e o fluxo de processamento de requisições.

- Design de camadas modulares e divisão de responsabilidades
- Caminho completo da requisição do OpenCode à API Antigravity
- Balanceamento de carga entre múltiplas contas e mecanismo de recuperação de sessão

### 2. [Especificação da API](./api-spec/)

Aprofunde-se nos detalhes técnicos da API Antigravity.

- Interface de gateway unificada e configuração de endpoints
- Formatos de requisição/resposta e limitações do JSON Schema
- Configuração do modelo Thinking e regras de chamada de funções

### 3. [Formato de Armazenamento](./storage-schema/)

Conheça a estrutura do arquivo de armazenamento de contas e o gerenciamento de versões.

- Localização do arquivo de armazenamento e significado de cada campo
- Evolução das versões v1/v2/v3 e migração automática
- Métodos para migrar configurações de contas entre máquinas

### 4. [Opções de Configuração Completas](./all-config-options/)

Manual de referência completo de todas as opções de configuração.

- Mais de 30 opções de configuração com valores padrão e cenários de aplicação
- Métodos para sobrescrever configurações via variáveis de ambiente
- Melhores combinações de configuração para diferentes cenários de uso

## Pré-requisitos

::: warning Recomendação
O conteúdo desta seção é tecnicamente aprofundado, recomenda-se completar primeiro:

- [Instalação Rápida](../start/quick-install/) - Complete a instalação do plugin e a primeira autenticação
- [Guia de Configuração](../advanced/configuration-guide/) - Conheça os métodos de configuração comuns
:::

## Próximos Passos

Após completar o estudo do apêndice, você pode:

- Consultar as [Perguntas Frequentes](../faq/) para resolver problemas encontrados durante o uso
- Acompanhar o [Registro de Alterações](../changelog/version-history/) para conhecer as mudanças de versão
- Participar do desenvolvimento do plugin, contribuindo com código ou documentação
