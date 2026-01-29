---
title: "FAQ: Solução de Erros e Soluções | Antigravity-Manager"
sidebarTitle: "O que fazer ao encontrar erros"
subtitle: "FAQ: Solução de Erros e Soluções"
description: "Domine métodos de solução de problemas comuns do Antigravity Tools. Incluindo invalidação de conta, falha de autenticação, erros de limitação e outros cenários, com localização rápida e soluções."
order: 4
---

# Perguntas Frequentes

Este capítulo coleta os códigos de erro mais comuns e cenários de exceção encontrados durante o uso do Antigravity Tools, ajudando você a localizar rapidamente a raiz do problema e encontrar soluções.

## Conteúdo do Capítulo

| Tipo de Problema | Página | Descrição |
|--- | --- | ---|
| Invalidação de Conta | [invalid_grant 与 Desativação Automática de Conta](./invalid-grant/) | Conta subitamente indisponível? Entenda causa de expiração do OAuth Token e processo de recuperação |
| Falha de Autenticação | [401/Falha de Autenticação](./auth-401/) | Solicitação rejeitada? Verifique configuração auth_mode e formato de Header |
| Erros de Limitação | [429/Erro de Capacidade](./429-rotation/) | 429 frequente? Distingua cota insuficiente e limitação de taxa upstream, use estratégia de rotação para reduzir impacto |
| Erros de Rota | [404/Rota Incompatível](./404-base-url/) | Endpoint 404? Resolva problema de concatenação de Base URL e prefixo /v1 |
| Exceções de Fluxo | [Interrupção de Fluxo/0 Token/Falha de Assinatura](./streaming-0token/) | Resposta interrompida ou vazia? Entenda mecanismo de autocura do proxy e caminho de solução |

## Sugestão de Caminho de Aprendizado

**Solução por código de erro**: ao encontrar erro específico, vá diretamente para página correspondente.

**Aprendizado sistemático**: se você quer entender totalmente problemas que pode encontrar, recomenda ler na seguinte ordem:

1. **[404/Rota Incompatível](./404-base-url/)** — problema de integração mais comum, geralmente primeira armadilha
2. **[401/Falha de Autenticação](./auth-401/)** — rota certa mas solicitação rejeitada, verifique configuração de autenticação
3. **[invalid_grant e Desativação Automática de Conta](./invalid-grant/)** — problema em nível de conta
4. **[429/Erro de Capacidade](./429-rotation/)** — solicitação bem-sucedida mas limitada
5. **[Interrupção de Fluxo/0 Token/Falha de Assinatura](./streaming-0token/)** — problema avançado, envolve resposta de fluxo e mecanismo de assinatura

## Pré-requisitos

::: warning Recomendado completar primeiro
- [Iniciar Proxy Reverso Local e Conectar Primeiro Cliente](../start/proxy-and-first-client/) — assegurar ambiente básico está rodando
- [Adicionar Contas](../start/add-account/) — entender maneira correta de adicionar contas
:::

## Próximos Passos

Após solucionar problemas, você pode continuar aprendendo:

- **[Agendamento de Alta Disponibilidade](../advanced/scheduling/)** — usar estratégia de rotação e retry reduzir ocorrência de erros
- **[Proxy Monitor](../advanced/monitoring/)** — usar sistema de logs rastrear detalhes de solicitações
- **[Configuração Completa](../advanced/config/)** — entender todos os itens de configuração
