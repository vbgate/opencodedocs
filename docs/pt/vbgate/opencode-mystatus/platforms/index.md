---
title: "Plataformas: Verificação de Cota de IA | opencode-mystatus"
sidebarTitle: "Plataformas"
subtitle: "Plataformas: Verificação de Cota de IA"
description: "Aprenda a verificar cotas de IA em OpenAI, Zhipu AI, GitHub Copilot e Google Cloud. Guia completo com detalhes de cada plataforma suportada pelo opencode-mystatus."
order: 2
---

# Funcionalidades da Plataforma

Este capítulo apresenta detalhadamente as funcionalidades de verificação de cota das várias plataformas de IA suportadas pelo opencode-mystatus.

## Plataformas Suportadas

O opencode-mystatus suporta as seguintes 4 plataformas principais de IA:

| Plataforma | Tipo de Cota | Características |
|-----------|-------------|----------------|
| OpenAI | Janela de 3 horas / 24 horas | Suporta assinaturas Plus, Team, Pro |
| Zhipu AI | Cota de 5 horas Token / Cota mensal MCP | Suporta Coding Plan |
| GitHub Copilot | Cota mensal | Exibe uso de Premium Requests |
| Google Cloud | Calculado por modelo | Suporta múltiplas contas, 4 modelos |

## Detalhes da Plataforma

### [Cota do OpenAI](./openai-usage/)

Aprofunde-se no mecanismo de verificação de cota do OpenAI:

- Diferença entre janelas de 3 horas e 24 horas
- Mecanismo de compartilhamento de cota de conta de equipe
- Análise do Token JWT para obter informações da conta

### [Cota do Zhipu AI](./zhipu-usage/)

Entenda a verificação de cota do Zhipu AI e Z.ai:

- Método de cálculo da cota de 5 horas Token
- Uso da cota mensal MCP
- Exibição de API Key mascarada

### [Cota do GitHub Copilot](./copilot-usage/)

Domine o gerenciamento de cota do GitHub Copilot:

- Significado de Premium Requests
- Diferenças de cota entre diferentes tipos de assinatura
- Cálculo do tempo de reinicialização mensal

### [Cota do Google Cloud](./google-usage/)

Aprenda a verificação de cota de múltiplas contas do Google Cloud:

- Diferença entre 4 modelos (G3 Pro, G3 Image, G3 Flash, Claude)
- Gerenciamento e alternância de múltiplas contas
- Mecanismo de leitura de arquivos de autenticação

## Guia de Escolha

Com base nas plataformas que você usa, escolha o tutorial correspondente:

- **Usa apenas OpenAI**: Veja diretamente [Cota do OpenAI](./openai-usage/)
- **Usa apenas Zhipu AI**: Veja diretamente [Cota do Zhipu AI](./zhipu-usage/)
- **Usuário de múltiplas plataformas**: Recomenda-se ler todos os tutoriais de plataformas em ordem
- **Usuário do Google Cloud**: Primeiro precisa instalar o plugin [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth)

## Próximo Passo

Após completar este capítulo, você pode continuar aprendendo [Funcionalidades Avançadas](../advanced/), para saber mais opções de configuração.
