---
title: "FAQ: Perguntas Frequentes | opencode-mystatus"
sidebarTitle: "FAQ"
subtitle: "Perguntas Frequentes"
description: "Encontre soluções para problemas comuns do opencode-mystatus. Inclui erros de autenticação, timeout de API, questões de segurança e privacidade do plugin."
order: 4
---

# Perguntas Frequentes

Este capítulo coleta perguntas comuns e soluções ao usar o opencode-mystatus.

## Categorização de Problemas

### [Solução de Problemas](./troubleshooting/)

Resolva vários problemas de falha na verificação:

- Não consegue ler arquivos de autenticação
- Token expirado ou permissões insuficientes
- Falha ou tempo limite de requisição de API
- Tratamento de erros específicos de cada plataforma

### [Segurança e Privacidade](./security/)

Entenda os mecanismos de segurança do plugin:

- Acesso somente leitura a arquivos locais
- Mascaramento automático de API Key
- Chama apenas APIs oficiais
- Sem upload ou armazenamento de dados

## Localização Rápida

Encontre soluções rapidamente com base em mensagens de erro:

| Palavra-chave de erro | Possível Causa | Solução |
|--- | --- | ---|
| `auth.json not found` | Arquivo de autenticação não existe | [Solução de Problemas](./troubleshooting/) |
| `Token expired` | Token expirou | [Solução de Problemas](./troubleshooting/) |
| `Permission denied` | Permissões insuficientes | [Configuração de Autenticação do Copilot](../advanced/copilot-auth/) |
| `project_id missing` | Configuração do Google Cloud incompleta | [Configuração do Google Cloud](../advanced/google-setup/) |
| `Request timeout` | Problemas de rede | [Solução de Problemas](./troubleshooting/) |

## Obter Ajuda

Se este capítulo não resolver seu problema:

- Envie um [Issue](https://github.com/vbgate/opencode-mystatus/issues) - Relate bug ou solicite nova funcionalidade
- Veja o [Repositório GitHub](https://github.com/vbgate/opencode-mystatus) - Obtenha a versão mais recente e código fonte
