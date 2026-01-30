---
title: "Recursos da Plataforma: Modelos e Cotas | opencode-antigravity-auth"
sidebarTitle: "Desbloquear o Sistema de Cotas Duplas"
subtitle: "Recursos da Plataforma: Modelos e Cotas"
description: "Conheça os tipos de modelos e o sistema de cotas duplas do Antigravity Auth. Domine a seleção de modelos, configuração de Thinking e métodos de Google Search para otimizar o uso de cotas."
order: 2
---

# Recursos da Plataforma

Este capítulo ajuda você a entender em profundidade os modelos suportados, o sistema de cotas e os recursos da plataforma do plugin Antigravity Auth. Você aprenderá a escolher modelos adequados, configurar capacidades de Thinking, habilitar Google Search e maximizar a utilização de cotas.

## Pré-requisitos

::: warning Antes de começar
Antes de estudar este capítulo, certifique-se de que concluiu:
- [Instalação Rápida](../start/quick-install/): Instalação do plugin e autenticação inicial
- [Primeira Requisição](../start/first-request/): Envio bem-sucedido da primeira requisição ao modelo
:::

## Caminho de Aprendizado

Siga a ordem abaixo para dominar gradualmente os recursos da plataforma:

### 1. [Modelos Disponíveis](./available-models/)

Conheça todos os modelos disponíveis e suas configurações de variante

- Conheça Claude Opus 4.5, Sonnet 4.5 e Gemini 3 Pro/Flash
- Entenda a distribuição de modelos nos dois pools de cotas: Antigravity e Gemini CLI
- Domine o uso do parâmetro `--variant`

### 2. [Sistema de Cotas Duplas](./dual-quota-system/)

Entenda como funciona o sistema de pools de cotas duplas: Antigravity e Gemini CLI

- Saiba como cada conta possui dois pools independentes de cotas Gemini
- Habilite a configuração de fallback automático para duplicar as cotas
- Especifique explicitamente qual pool de cotas o modelo deve usar

### 3. [Google Search Grounding](./google-search-grounding/)

Habilite o Google Search para modelos Gemini, melhorando a precisão factual

- Permita que o Gemini busque informações da web em tempo real
- Ajuste os limites de busca para controlar a frequência das pesquisas
- Escolha a configuração adequada de acordo com as necessidades da tarefa

### 4. [Modelos Thinking](./thinking-models/)

Domine a configuração e uso de modelos Thinking do Claude e Gemini 3

- Configure o thinking budget do Claude
- Use o thinking level do Gemini 3 (minimal/low/medium/high)
- Entenda o interleaved thinking e a estratégia de retenção de blocos de pensamento

## Próximos Passos

Após concluir este capítulo, você pode continuar aprendendo:

- [Configuração de Múltiplas Contas](../advanced/multi-account-setup/): Configure múltiplas contas Google para pool de cotas e balanceamento de carga
- [Estratégias de Seleção de Contas](../advanced/account-selection-strategies/): Domine as melhores práticas das três estratégias: sticky, round-robin e hybrid
- [Guia de Configuração](../advanced/configuration-guide/): Domine todas as opções de configuração para personalizar o comportamento do plugin conforme necessário
