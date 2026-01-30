---
title: "Início Rápido: Instalação e Configuração do Antigravity Auth | OpenCode"
sidebarTitle: "Execute em 10 Minutos"
subtitle: "Início Rápido: Instalação e Configuração do Antigravity Auth"
description: "Aprenda a instalar e configurar o plug-in Antigravity Auth. Conclua a autenticação do Google OAuth em 10 minutos, envie a primeira solicitação de modelo e verifique se o acesso aos modelos Claude e Gemini foi bem-sucedido."
order: 1
---

# Início Rápido

Este capítulo ajuda você a começar a usar o plug-in Antigravity Auth do zero. Você entenderá o valor central do plug-in, concluirá a instalação e a autenticação OAuth, e enviará a primeira solicitação de modelo para verificar se a configuração foi bem-sucedida.

## Caminho de Aprendizado

Aprenda na seguinte ordem, cada passo constrói sobre o anterior:

### 1. [Introdução ao Plug-in](./what-is-antigravity-auth/)

Entenda o valor central, os cenários aplicáveis e os avisos de risco do plug-in Antigravity Auth.

- Determine se o plug-in é adequado para o seu cenário de uso
- Conheça os modelos de IA suportados (Claude Opus 4.5, Sonnet 4.5, Gemini 3 Pro/Flash)
- Entenda os riscos de uso e as precauções

### 2. [Instalação Rápida](./quick-install/)

Complete a instalação do plug-in e a primeira autenticação em 5 minutos.

- Dois métodos de instalação (assistido por IA / configuração manual)
- Configure as definições dos modelos
- Execute a autenticação do Google OAuth

### 3. [Autenticação OAuth 2.0 PKCE](./first-auth-login/)

Entenda o processo de autenticação OAuth 2.0 PKCE e conclua o primeiro login.

- Entenda o mecanismo de segurança da autenticação PKCE
- Conclua o primeiro login para obter permissões de acesso à API
- Entenda o processamento automatizado de atualização de tokens

### 4. [Primeira Solicitação](./first-request/)

Envie a primeira solicitação de modelo para verificar se a instalação foi bem-sucedida.

- Envie a primeira solicitação de modelo Antigravity
- Entenda os parâmetros `--model` e `--variant`
- Solucione erros comuns de solicitação de modelo

## Pré-requisitos

Antes de começar este capítulo, confirme:

- ✅ OpenCode CLI instalado (comando `opencode` disponível)
- ✅ Conta do Google disponível (para autenticação OAuth)

## Próximos Passos

Após concluir o início rápido, você pode:

- **[Conhecer Modelos Disponíveis](../platforms/available-models/)** — Explore todos os modelos suportados e suas configurações de variantes
- **[Configurar Múltiplas Contas](../advanced/multi-account-setup/)** — Configure múltiplas contas do Google para implementar pool de cotas
- **[Problemas Comuns de Autenticação](../faq/common-auth-issues/)** — Consulte o guia de solução de problemas quando encontrar problemas
