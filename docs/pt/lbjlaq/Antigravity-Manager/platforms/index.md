---
title: "Integração de Plataformas: Múltiplos Protocolos | Antigravity-Manager"
sidebarTitle: "Conecte Sua Plataforma AI"
subtitle: "Integração de Plataformas: Múltiplos Protocolos"
description: "Aprenda métodos de integração de protocolos de plataforma do Antigravity Tools. Suporta gateway API unificado para 7 protocolos como OpenAI, Anthropic, Gemini, etc."
order: 200
---

# Plataformas e Integração

A capacidade central do Antigravity Tools é converter protocolos de múltiplas plataformas AI em um gateway API local unificado. Este capítulo detalha métodos de integração para cada protocolo, limites de compatibilidade e melhores práticas.

## Este capítulo inclui

| Tutorial | Descrição |
|--- | ---|
| [API Compatível OpenAI](./openai/) | Estratégia de implementação de `/v1/chat/completions` e `/v1/responses`, permitindo integração transparente do OpenAI SDK |
| [API Compatível Anthropic](./anthropic/) | Contratos chave de `/v1/messages` e Claude Code, suporta capacidades principais como chain of thought, system prompts |
| [API Nativa Gemini](./gemini/) | Endpoint de integração do `/v1beta/models` e Google SDK, suporta compatibilidade `x-goog-api-key` |
| [Geração de Imagens Imagen 3](./imagen/) | Mapeamento automático de parâmetros `size`/`quality` de OpenAI Images, suporta qualquer proporção de largura/altura |
| [Transcrição de Áudio](./audio/) | Limitações de `/v1/audio/transcriptions` e tratamento de corpo grande |
| [Endpoint MCP](./mcp/) | Expõe Web Search/Reader/Vision como ferramentas chamáveis |
| [Túnel Cloudflared](./cloudflared/) | Expõe localmente API para rede pública com um clique (não é segurança padrão) |

## Sugestão de caminho de aprendizado

::: tip Ordem recomendada
1. **Primeiro aprenda o protocolo que você usa**: se usa Claude Code, veja [API Compatível Anthropic](./anthropic/); se usa OpenAI SDK, veja [API Compatível OpenAI](./openai/)
2. **Depois aprenda Gemini Nativo**: entenda método de integração direta do Google SDK
3. **Aprenda funcionalidades estendidas conforme necessário**: geração de imagens, transcrição de áudio, ferramentas MCP
4. **Por último aprenda túnel**: quando precisar de exposição pública, veja [Túnel Cloudflared](./cloudflared/)
:::

**Seleção rápida**:

| Seu cenário | Recomendado ver primeiro |
|--- | ---|
| Usa Claude Code CLI | [API Compatível Anthropic](./anthropic/) |
| Usa OpenAI Python SDK | [API Compatível OpenAI](./openai/) |
| Usa SDK oficial Google | [API Nativa Gemini](./gemini/) |
| Precisa desenhar com AI | [Geração de Imagens Imagen 3](./imagen/) |
| Precisa transcrever fala para texto | [Transcrição de Áudio](./audio/) |
| Precisa de busca na web/leitura de páginas | [Endpoint MCP](./mcp/) |
| Precisa de acesso remoto | [Túnel Cloudflared](./cloudflared/) |

## Pré-requisitos

::: warning Confirme antes de começar
- Completou [Instalação e Atualização](../start/installation/)
- Completou [Adicionar Contas](../start/add-account/)
- Completou [Iniciar Proxy Reverso Local](../start/proxy-and-first-client/) (pelo menos consegue acessar `/healthz`)
:::

## Próximos passos

Após completar este capítulo, você pode continuar aprendendo:

- [Configurações Avançadas](../advanced/): funcionalidades avançadas como roteamento de modelos, governança de cota, agendamento de alta disponibilidade
- [Perguntas Frequentes](../faq/): guia de solução de problemas ao encontrar erros 401/404/429
