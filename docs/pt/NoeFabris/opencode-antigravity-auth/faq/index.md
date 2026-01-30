---
title: "Perguntas Frequentes: Autenticação OAuth e Solução de Problemas de Modelo | Antigravity Auth"
sidebarTitle: "O que fazer quando a autenticação falha"
subtitle: "Perguntas Frequentes: Autenticação OAuth e Solução de Problemas de Modelo"
description: "Entenda as perguntas frequentes e soluções do plugin Antigravity Auth. Abrange a solução de problemas de falhas de autenticação OAuth, tratamento de erros de modelo não encontrado, configuração de compatibilidade de plugins e outros guias práticos para ajudá-lo a localizar e resolver rapidamente vários problemas encontrados durante o uso."
order: 4
---

# Perguntas Frequentes

Este capítulo coleta os problemas mais comuns encontrados ao usar o plugin Antigravity Auth e suas soluções. Seja falha na autenticação OAuth, erros de solicitação de modelo ou problemas de compatibilidade de plugins, aqui há guias de solução de problemas correspondentes.

## Pré-requisitos

::: warning Antes de começar, certifique-se
- ✅ Já completou a [Instalação Rápida](../start/quick-install/) e adicionou contas com sucesso
- ✅ Já completou a [Primeira Autenticação](../start/first-auth-login/) e entende o fluxo OAuth
:::

## Caminho de Aprendizado

Escolha o guia de solução de problemas correspondente com base no tipo de problema que você está enfrentando:

### 1. [Solução de Problemas de Falha na Autenticação OAuth](./common-auth-issues/)

Resolva problemas comuns relacionados à autenticação OAuth, atualização de tokens e contas.

- Autorização no navegador bem-sucedida, mas o terminal exibe "Falha na autorização"
- Repentinamente exibe erro "Permission Denied" ou "invalid_grant"
- Falha no callback OAuth do navegador Safari
- Não é possível completar a autenticação no ambiente WSL2/Docker

### 2. [Migração de Conta](./migration-guide/)

Migre contas entre diferentes máquinas e gerencie atualizações de versão.

- Migrar contas do computador antigo para o novo
- Entender as mudanças de versão do formato de armazenamento (v1/v2/v3)
- Resolver erros de invalid_grant após a migração

### 3. [Solução de Problemas de Modelo Não Encontrado](./model-not-found/)

Resolva problemas relacionados a modelo não encontrado, erros 400, etc.

- Solução de problemas de erro `Model not found`
- Erro 400 `Invalid JSON payload received. Unknown name "parameters"`
- Erro ao chamar servidor MCP

### 4. [Compatibilidade de Plugin](./plugin-compatibility/)

Resolva problemas de compatibilidade com plugins como oh-my-opencode, DCP, etc.

- Configure corretamente a ordem de carregamento de plugins
- Desabilite métodos de autenticação conflitantes no oh-my-opencode
- Ative deslocamento de PID para cenários de agentes paralelos

### 5. [Aviso de ToS](./tos-warning/)

Entenda os riscos de uso e evite o bloqueio de contas.

- Entenda as restrições dos Termos de Serviço do Google
- Identifique cenários de alto risco (novas contas, solicitações intensivas)
- Domine as práticas recomendadas para evitar o bloqueio de contas

## Localização Rápida de Problemas

| Fenômeno de erro | Leitura recomendada |
|---|---|
| Falha na autenticação, tempo limite de autorização | [Solução de Problemas de Falha na Autenticação OAuth](./common-auth-issues/) |
| invalid_grant, Permission Denied | [Solução de Problemas de Falha na Autenticação OAuth](./common-auth-issues/) |
| Model not found, erro 400 | [Solução de Problemas de Modelo Não Encontrado](./model-not-found/) |
| Conflito com outros plugins | [Compatibilidade de Plugin](./plugin-compatibility/) |
| Trocar para novo computador, atualização de versão | [Migração de Conta](./migration-guide/) |
| Preocupado com segurança da conta | [Aviso de ToS](./tos-warning/) |

## Próximos Passos

Depois de resolver os problemas, você pode:

- 📖 Ler [Funcionalidades Avançadas](../advanced/) para dominar profundamente recursos como múltiplas contas, recuperação de sessão, etc.
- 📚 Consultar [Apêndice](../appendix/) para entender design de arquitetura e referência de configuração completa
- 🔄 Acompanhar [Registro de Alterações](../changelog/) para obter as funcionalidades mais recentes e alterações
