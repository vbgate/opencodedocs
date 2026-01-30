---
title: "Introdução do Plugin: Recursos e Riscos | Antigravity Auth"
sidebarTitle: "Este plugin é para você"
subtitle: "Entenda o valor principal do plugin Antigravity Auth"
description: "Aprenda o valor principal e os avisos de risco do plugin Antigravity Auth. Acesse os modelos Claude e Gemini 3 via Google OAuth com suporte a balanceamento de carga entre múltiplas contas."
tags:
  - "Primeiros passos"
  - "Introdução do plugin"
  - "OpenCode"
  - "Antigravity"
order: 1
---

# Entenda o Valor Principal do Plugin Antigravity Auth

**Antigravity Auth** é um plugin do OpenCode que acessa a Antigravity API através de autenticação OAuth do Google. Ele permite que você use sua conta Google familiar para chamar modelos avançados como Claude Opus 4.5, Sonnet 4.5 e Gemini 3 Pro/Flash, sem precisar gerenciar chaves de API. O plugin também oferece recursos como balanceamento de carga entre múltiplas contas, pools duplos de quota e recuperação automática de sessão, sendo ideal para usuários que precisam de modelos avançados e gerenciamento automático.

## O Que Você Vai Aprender

- Determinar se este plugin é adequado para o seu cenário de uso
- Conhecer quais modelos de IA e recursos principais o plugin suporta
- Entender os riscos e precauções ao usar este plugin
- Decidir se deve continuar com a instalação e configuração

## Seu Problema Atual

Você quer usar os modelos de IA mais avançados (como Claude Opus 4.5, Gemini 3 Pro), mas o acesso oficial é limitado. Procura uma forma confiável de obter esses modelos, ao mesmo tempo que deseja:

- Não precisar gerenciar manualmente múltiplas chaves de API
- Poder alternar contas automaticamente quando encontrar limites de taxa
- Recuperar automaticamente conversas interrompidas sem perder o contexto

## Ideia Central

**Antigravity Auth** é um plugin do OpenCode que acessa a Google Antigravity API através de **autenticação OAuth do Google**, permitindo que você use sua conta Google familiar para chamar modelos de IA avançados.

Ele não age como proxy para todas as requisições, mas **intercepta e converte** suas chamadas de modelo, encaminhando-as para a Antigravity API e convertendo as respostas de volta para um formato que o OpenCode possa reconhecer.

## Recursos Principais

### Modelos Suportados

| Família de Modelos | Modelos Disponíveis | Características |
|---|---|---|
| **Claude** | Opus 4.5, Sonnet 4.5 | Suporte ao modo de pensamento estendido |
| **Gemini 3** | Pro, Flash | Integração com Google Search, pensamento estendido |

::: info Modo de Pensamento (Thinking)
Os modelos Thinking realizam um "pensamento profundo" antes de gerar respostas, mostrando o processo de raciocínio. Você pode configurar o orçamento de pensamento para equilibrar qualidade e velocidade de resposta.
:::

### Balanceamento de Carga entre Múltiplas Contas

- **Suporta até 10 contas Google**
- Alterna automaticamente para a próxima conta quando encontra limites de taxa (erro 429)
- Três estratégias de seleção de conta: sticky (fixo), round-robin (rodízio), hybrid (híbrido inteligente)

### Sistema de Quotas Duplas

O plugin acessa **dois pools independentes de quotas** simultaneamente:

1. **Quota Antigravity**: Da Google Antigravity API
2. **Quota Gemini CLI**: Do Google Gemini CLI

Quando um pool atinge o limite, o plugin tenta automaticamente o outro, maximizando a utilização da quota.

### Recuperação Automática de Sessão

- Detecta falhas em chamadas de ferramentas (como interrupções por ESC)
- Injeta automaticamente tool_result sintético para evitar falhas na conversa
- Suporta envio automático de "continue" para retomar a conversa

### Integração com Google Search

Ativa a pesquisa na web para modelos Gemini, melhorando a precisão factual:

- **Modo Auto**: O modelo decide quando pesquisar com base na necessidade
- **Modo Always-on**: Pesquisa em todas as consultas

## Quando Usar Este Plugin

::: tip Adequado para estes cenários
- Você tem múltiplas contas Google e deseja aumentar a quota total
- Precisa usar modelos Thinking do Claude ou Gemini 3
- Quer ativar o Google Search para modelos Gemini
- Não quer gerenciar chaves de API manualmente, prefere autenticação OAuth
- Encontra frequentemente limites de taxa e deseja alternação automática de contas
:::

::: warning Não adequado para estes cenários
- Você precisa usar modelos não oficialmente divulgados pelo Google
- É muito sensível aos riscos dos Termos de Serviço do Google (veja avisos de risco abaixo)
- Apenas precisa de modelos básicos Gemini 1.5 ou Claude 3 (as interfaces oficiais são mais estáveis)
- Você abre navegadores com dificuldade em ambientes WSL, Docker, etc.
:::

## ⚠️ Aviso Importante de Risco

Usar este plugin **pode violar os Termos de Serviço do Google**. Alguns usuários relataram que suas contas Google foram **banidas** ou **banidas silenciosamente** (acesso restrito sem notificação clara).

### Cenários de Alto Risco

- 🚨 **Contas Google novas**: Probabilidade muito alta de banimento
- 🚨 **Contas com assinatura Pro/Ultra recém-ativada**: Fácil de serem marcadas e banidas

### Por Favor Confirme Antes de Usar

- Esta é uma **ferramenta não oficial**, não aprovada pelo Google
- Sua conta pode ser suspensa ou banida permanentemente
- Você assume todos os riscos ao usar este plugin

### Recomendações

- Use **contas Google maduras**, não crie novas contas especificamente para este plugin
- Evite usar contas importantes vinculadas a serviços críticos
- Se sua conta for banida, não há como recorrer através deste plugin

::: danger Segurança da Conta
Todos os tokens OAuth são armazenados localmente em `~/.config/opencode/antigravity-accounts.json`, não são enviados para nenhum servidor. Mas por favor mantenha seu computador seguro para evitar vazamento de tokens.
:::

## Resumo da Lição

Antigravity Auth é um poderoso plugin do OpenCode que permite acessar modelos avançados Claude e Gemini 3 através de OAuth do Google. Ele oferece recursos como balanceamento de carga entre múltiplas contas, pools duplos de quota e recuperação automática de sessão, sendo ideal para usuários que precisam de modelos avançados e gerenciamento automático.

Mas por favor esteja ciente: **há risco de banimento ao usar este plugin**. Use contas Google não críticas e entenda os riscos antes de continuar com a instalação.

## Próxima Lição

> Na próxima lição vamos aprender a **[Instalação Rápida](../quick-install/)**.
>
> Você vai aprender:
> - Instalar o plugin em 5 minutos
> - Adicionar sua primeira conta Google
> - Verificar se a instalação foi bem-sucedida
