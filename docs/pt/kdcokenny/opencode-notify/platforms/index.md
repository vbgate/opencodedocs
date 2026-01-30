---
title: "Plataformas e Integrações: Funcionalidades e Suporte de Terminal para macOS, Windows e Linux | opencode-notify"
sidebarTitle: "Adaptar à Sua Plataforma"
subtitle: "Plataformas e Integrações"
description: "Aprenda as diferenças funcionais do opencode-notify em macOS, Windows e Linux, domine o suporte a terminais (37+ emuladores), detecção de foco, foco ao clicar e efeitos sonoros personalizados."
tags:
  - "Funcionalidades de Plataforma"
  - "Suporte a Terminal"
  - "Compatibilidade do Sistema"
prerequisite:
  - "start-quick-start"
  - "start-how-it-works"
order: 2
---

# Plataformas e Integrações

Este capítulo ajuda você a entender as diferenças funcionais do opencode-notify em diferentes sistemas operacionais, dominar configurações específicas da plataforma e como fazer seu terminal ter o melhor desempenho.

## Caminho de Aprendizado

### 1. [Funcionalidades do macOS](../macos/)

Conheça totalmente os recursos avançados no macOS, incluindo detecção inteligente de foco, foco ao clicar em notificações e efeitos sonoros personalizados.

- Detecção de foco: determina automaticamente se o terminal é a janela ativa atual
- Foco ao clicar: alterna automaticamente para o terminal após clicar na notificação
- Efeitos sonoros personalizados: configure sons exclusivos para diferentes eventos
- Suporte a 37+ terminais: incluindo Ghostty, iTerm2, terminal integrado do VS Code, etc.

### 2. [Funcionalidades do Windows](../windows/)

Domine os fundamentos e métodos de configuração de notificações na plataforma Windows.

- Notificações nativas: use o centro de notificações do Windows 10/11
- Permissões de notificação: garanta que o OpenCode tenha permissão para enviar notificações
- Configuração básica: localização do arquivo de configuração no ambiente Windows
- Notas de limitação: o Windows ainda não suporta a funcionalidade de detecção de foco

### 3. [Funcionalidades do Linux](../linux/)

Entenda o mecanismo de notificações da plataforma Linux e a instalação de dependências.

- Integração libnotify: use notify-send para enviar notificações
- Suporte a ambientes de desktop: GNOME, KDE Plasma, XFCE e outros ambientes principais
- Instalação de dependências: comandos de instalação para diferentes distribuições
- Notas de limitação: o Linux ainda não suporta a funcionalidade de detecção de foco

### 4. [Terminais Suportados](../terminals/)

Veja todos os 37+ emuladores de terminal suportados e entenda o mecanismo de detecção automática.

- Detecção de terminal: como identificar automaticamente o tipo de terminal
- Lista de terminais: lista completa de terminais suportados
- Configuração manual: como especificar manualmente quando a detecção automática falha
- Terminais especiais: tratamento do terminal integrado do VS Code, sessões SSH remotas

## Pré-requisitos

::: warning Antes de estudar este capítulo, certifique-se de ter concluído

- ✅ **[Início Rápido](../../start/quick-start/)**: concluiu a instalação do opencode-notify
- ✅ **[Como Funciona](../../start/how-it-works/)**: entenda os quatro tipos de notificações e o mecanismo de filtragem inteligente

:::

## Recomendações de Seleção de Plataforma

Escolha o capítulo correspondente com base no seu sistema operacional:

| Sistema Operacional | Ordem de Estudo Recomendada | Funcionalidades Principais |
|--- | --- | ---|
| **macOS** | 1. Funcionalidades do macOS → 4. Terminais Suportados | Detecção de foco, foco ao clicar, efeitos sonoros personalizados |
| **Windows** | 2. Funcionalidades do Windows → 4. Terminais Suportados | Notificações nativas, configuração básica |
| **Linux** | 3. Funcionalidades do Linux → 4. Terminais Suportados | Integração libnotify, instalação de dependências |

::: tip Recomendação Geral
Independentemente da plataforma que você usa, a lição 4 "Terminais Suportados" vale a pena estudar, pois pode ajudá-lo a entender o mecanismo de detecção de terminal e resolver problemas de configuração.
:::

## Tabela de Comparação de Funcionalidades

| Funcionalidade | macOS | Windows | Linux |
|--- | --- | --- | ---|
| Notificações nativas | ✅ | ✅ | ✅ |
| Detecção de foco do terminal | ✅ | ❌ | ❌ |
| Foco ao clicar na notificação | ✅ | ❌ | ❌ |
| Efeitos sonoros personalizados | ✅ | ✅ | ✅ (parcial) |
| Período silencioso | ✅ | ✅ | ✅ |
| Verificação de sessão pai | ✅ | ✅ | ✅ |
| Suporte a 37+ terminais | ✅ | ✅ | ✅ |
| Detecção automática de terminal | ✅ | ✅ | ✅ |

## Próximos Passos

Após concluir este capítulo, você entenderá as diferenças funcionais entre diferentes plataformas e os métodos de configuração.

Recomenda-se continuar estudando:

### [Configuração Avançada](../../advanced/config-reference/)

Aprenda todas as opções do arquivo de configuração e domine técnicas de configuração avançadas.

- Referência completa de configuração: descrições detalhadas de todas as opções de configuração
- Explicação detalhada do período silencioso: como configurar e como funciona
- Princípio de detecção de terminal: mecanismo interno de detecção automática
- Uso avançado: técnicas de configuração e práticas recomendadas

### [Solução de Problemas](../../faq/troubleshooting/)

Se encontrar problemas, veja as soluções para problemas comuns.

- Notificações não aparecem: problemas de permissão e configurações do sistema
- Falha na detecção de foco: configuração de terminal e mecanismo de detecção
- Erros de configuração: formato do arquivo de configuração e descrição dos campos
- Problemas de efeitos sonoros: configuração de efeitos sonoros e compatibilidade do sistema

::: info Recomendações do Caminho de Aprendizado
Se você está começando a usar, recomenda-se estudar na ordem **capítulos de plataforma → configuração avançada → solução de problemas**. Se tiver um problema específico, pode pular diretamente para o capítulo de solução de problemas.
:::
