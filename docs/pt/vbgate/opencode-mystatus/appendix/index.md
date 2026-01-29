---
title: "Apêndice: Modelos de Dados e APIs | opencode-mystatus"
sidebarTitle: "Apêndice"
subtitle: "Apêndice: Modelos de Dados e APIs"
description: "Aprenda os modelos de dados e APIs do opencode-mystatus. Entenda a estrutura dos arquivos de autenticação e os formatos de resposta para solucionar problemas e estender suporte."
order: 5
---

# Apêndice

Este capítulo fornece material de referência técnica para o opencode-mystatus, adequado para desenvolvedores e usuários avançados.

## Documentação de Referência

### [Modelos de Dados](./data-models/)

Entenda as estruturas de dados do plugin:

- Estrutura de arquivos de autenticação (`auth.json`, `antigravity-accounts.json`, `copilot-quota-token.json`)
- Formatos de resposta de API de cada plataforma
- Definições de tipos de dados internos
- Como estender o suporte para novas plataformas

### [Resumo de APIs](./api-endpoints/)

Veja todas as APIs oficiais chamadas pelo plugin:

- API de verificação de cota do OpenAI
- API de verificação de cota do Zhipu AI / Z.ai
- API de verificação de cota do GitHub Copilot
- API de verificação de cota do Google Cloud Antigravity
- Métodos de autenticação e formatos de requisição

## Cenários de Uso

| Cenário | Documentação Recomendada |
|---------|--------------------------|
| Quer entender como o plugin funciona | [Modelos de Dados](./data-models/) |
| Quer chamar a API manualmente | [Resumo de APIs](./api-endpoints/) |
| Quer estender suporte para novas plataformas | Ambas as documentações são necessárias |
| Problemas com formato de dados | [Modelos de Dados](./data-models/) |

## Links Relacionados

- [Repositório GitHub](https://github.com/vbgate/opencode-mystatus) - Código fonte completo
- [Pacote NPM](https://www.npmjs.com/package/opencode-mystatus) - Versões e dependências
- [Log de Alterações](../changelog/) - Histórico de versões
