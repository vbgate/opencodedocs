---
title: "Avançado: Configuração | opencode-mystatus"
sidebarTitle: "Avançado"
subtitle: "Avançado: Configuração"
description: "Aprenda as configurações avançadas do opencode-mystatus. Gerencie múltiplas contas do Google Cloud, resolva problemas de autenticação do Copilot e configure o suporte multilíngue."
order: 3
---

# Funcionalidades Avançadas

Este capítulo apresenta opções de configuração avançadas do opencode-mystatus, adequadas para usuários que precisam de mais personalização.

## Lista de Funcionalidades

### [Configuração do Google Cloud](./google-setup/)

Configure e gerencie múltiplas contas do Google Cloud Antigravity:

- Adicionar múltiplas contas do Google Cloud
- Relação de mapeamento de 4 modelos (G3 Pro, G3 Image, G3 Flash, Claude)
- Diferença entre projectId e managedProjectId
- Resolução de problemas de cota insuficiente de modelo em uma única conta

### [Configuração de Autenticação do Copilot](./copilot-auth/)

Resolva problemas de autenticação do GitHub Copilot:

- Diferença entre OAuth Token e Fine-grained PAT
- Resolução de problemas de permissão insuficiente do OAuth Token
- Criação de Fine-grained PAT e configuração do tipo de assinatura
- Configuração do arquivo `copilot-quota-token.json`

### [Suporte Multi-idioma](./i18n-setup/)

Entenda o mecanismo de detecção automática de idioma:

- Princípio de detecção automática de idioma do sistema
- Mecanismo de fallback da API Intl e variáveis de ambiente
- Como alternar o idioma de saída (Chinês/Inglês)

## Cenários de Uso

| Cenário | Tutorial Recomendado |
|--- | ---|
| Usar múltiplas contas do Google | [Configuração do Google Cloud](./google-setup/) |
| Falha na verificação de cota do Copilot | [Configuração de Autenticação do Copilot](./copilot-auth/) |
| Deseja alternar o idioma de saída | [Suporte Multi-idioma](./i18n-setup/) |

## Pré-requisitos

Antes de estudar este capítulo, recomenda-se completar:

- [Início Rápido](../start/) - Conclua a instalação do plugin
- [Funcionalidades da Plataforma](../platforms/) - Entenda o uso básico de cada plataforma

## Próximo Passo

Encontrou problemas? Consulte [Perguntas Frequentes](../faq/) para obter ajuda.
