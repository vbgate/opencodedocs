---
title: "Recursos Avançados: Gerenciamento de Múltiplas Contas | Antigravity Auth"
sidebarTitle: "Gerenciar Múltiplas Contas"
subtitle: "Recursos Avançados: Gerenciamento de Múltiplas Contas"
description: "Domine os recursos avançados do plugin Antigravity Auth. Aprofunde-se nos mecanismos principais de balanceamento de carga entre múltiplas contas, seleção inteligente de contas, tratamento de limites de taxa, recuperação de sessão e transformação de requisições."
order: 3
---

# Recursos Avançados

Este capítulo ajuda você a dominar os recursos avançados do plugin Antigravity Auth, incluindo balanceamento de carga entre múltiplas contas, seleção inteligente de contas, tratamento de limites de taxa, recuperação de sessão, transformação de requisições e outros mecanismos principais. Seja para otimizar a utilização de cotas ou solucionar problemas complexos, aqui estão as respostas que você precisa.

## Pré-requisitos

::: warning Antes de começar, certifique-se de
- ✅ Ter concluído a [Instalação Rápida](../../start/quick-install/) e adicionado a primeira conta com sucesso
- ✅ Ter concluído a [Primeira Autenticação](../../start/first-auth-login/) e entendido o fluxo OAuth
- ✅ Ter concluído a [Primeira Requisição](../../start/first-request/) e verificado que o plugin funciona corretamente
:::

## Caminho de Aprendizado

### 1. [Configuração de Múltiplas Contas](./multi-account-setup/)

Configure várias contas Google para realizar pool de cotas e balanceamento de carga.

- Adicione várias contas para aumentar o limite total de cotas
- Entenda o sistema de cotas duplo (Antigravity + Gemini CLI)
- Escolha a quantidade adequada de contas de acordo com o cenário

### 2. [Estratégias de Seleção de Contas](./account-selection-strategies/)

Domine as melhores práticas das três estratégias de seleção de contas: sticky, round-robin e hybrid.

- 1 conta → estratégia sticky para preservar o cache de prompts
- 2-3 contas → estratégia hybrid para distribuição inteligente de requisições
- 4+ contas → estratégia round-robin para maximizar o throughput

### 3. [Tratamento de Limites de Taxa](./rate-limit-handling/)

Entenda os mecanismos de detecção de limites de taxa, tentativas automáticas e alternância de contas.

- Distinga 5 tipos diferentes de erros 429
- Entenda o algoritmo de backoff exponencial para tentativas automáticas
- Domine a lógica de alternância automática em cenários de múltiplas contas

### 4. [Recuperação de Sessão](./session-recovery/)

Conheça o mecanismo de recuperação de sessão para tratamento automático de falhas e interrupções em chamadas de ferramentas.

- Tratamento automático do erro tool_result_missing
- Correção do problema thinking_block_order
- Configuração das opções auto_resume e session_recovery

### 5. [Mecanismo de Transformação de Requisições](./request-transformation/)

Aprofunde-se no mecanismo de transformação de requisições e como compatibilizar as diferenças de protocolo entre diferentes modelos de IA.

- Entenda as diferenças de protocolo entre modelos Claude e Gemini
- Solucione erros 400 causados por incompatibilidade de Schema
- Otimize a configuração de Thinking para obter o melhor desempenho

### 6. [Guia de Configuração](./configuration-guide/)

Domine todas as opções de configuração para personalizar o comportamento do plugin conforme necessário.

- Localização e prioridade dos arquivos de configuração
- Configurações de comportamento do modelo, rotação de contas e comportamento da aplicação
- Configurações recomendadas para cenários de conta única, múltiplas contas e agentes paralelos

### 7. [Otimização para Agentes Paralelos](./parallel-agents/)

Otimize a alocação de contas para cenários de agentes paralelos, habilitando o deslocamento de PID.

- Entenda os problemas de conflito de contas em cenários de agentes paralelos
- Habilite o deslocamento de PID para que processos diferentes priorizem contas diferentes
- Combine com a estratégia round-robin para maximizar a utilização de múltiplas contas

### 8. [Logs de Depuração](./debug-logging/)

Habilite os logs de depuração para solucionar problemas e monitorar o estado de execução.

- Habilite logs de depuração para registrar informações detalhadas
- Entenda os diferentes níveis de log e cenários de aplicação
- Interprete o conteúdo dos logs para localizar problemas rapidamente

## Próximos Passos

Após concluir o aprendizado dos recursos avançados, você pode:

- 📖 Consultar as [Perguntas Frequentes](../../faq/) para resolver problemas encontrados durante o uso
- 📚 Ler o [Apêndice](../../appendix/) para entender o design da arquitetura e referência completa de configuração
- 🔄 Acompanhar o [Changelog](../../changelog/) para obter as últimas funcionalidades e alterações
