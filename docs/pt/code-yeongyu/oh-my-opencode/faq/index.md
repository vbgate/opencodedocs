---
title: "Perguntas Frequentes: Solução de Problemas | oh-my-opencode"
sidebarTitle: "Perguntas Frequentes"
subtitle: "Perguntas Frequentes: Solução de Problemas | oh-my-opencode"
description: "Aprenda a diagnosticar e resolver problemas comuns do oh-my-opencode. Domine diagnóstico de configuração, solução de problemas de instalação, dicas de uso e recomendações de segurança."
order: 150
---

# Perguntas Frequentes e Solução de Problemas

Este capítulo ajuda você a resolver problemas comuns encontrados ao usar o oh-my-opencode, desde diagnóstico de configuração até dicas de uso e recomendações de segurança, permitindo que você localize rapidamente problemas e encontre soluções.

## Caminho de Aprendizado

Siga esta sequência para dominar progressivamente a solução de problemas e as melhores práticas:

### 1. [Diagnóstico e Solução de Problemas de Configuração](./troubleshooting/)

Aprenda a usar o comando Doctor para diagnosticar e resolver rapidamente problemas de configuração.
- Execute o comando Doctor para uma verificação completa de saúde
- Interprete 17+ resultados de verificação (instalação, configuração, autenticação, dependências, ferramentas, atualizações)
- Localize e corrija problemas comuns de configuração
- Use o modo verboso e saída JSON para diagnósticos avançados

### 2. [Perguntas Frequentes](./faq/)

Encontre e resolva problemas comuns durante o uso.
- Respostas rápidas para problemas de instalação e configuração
- Dicas de uso e melhores práticas (ultrawork, chamadas de proxy, tarefas em segundo plano)
- Notas de compatibilidade com Claude Code
- Avisos de segurança e recomendações de otimização de desempenho
- Recursos de contribuição e ajuda

## Pré-requisitos

Antes de iniciar este capítulo, certifique-se de que:
- Você completou a [Instalação Rápida e Configuração](../start/installation/)
- Você está familiarizado com a estrutura básica do arquivo de configuração do oh-my-opencode
- Você encontrou um problema específico ou deseja entender as melhores práticas

::: tip Tempo de Leitura Recomendado
Após concluir a instalação básica, recomendamos ler as perguntas frequentes primeiro para entender armadilhas comuns e melhores práticas. Ao encontrar problemas específicos, use as ferramentas de solução de problemas para diagnóstico.
:::

## Guia Rápido de Solução de Problemas

Se você encontrar um problema urgente, siga estas etapas para solução rápida de problemas:

```bash
# Etapa 1: Execute um diagnóstico completo
bunx oh-my-opencode doctor

# Etapa 2: Visualize informações detalhadas de erro
bunx oh-my-opencode doctor --verbose

# Etapa 3: Verifique uma categoria específica (por exemplo, autenticação)
bunx oh-my-opencode doctor --category authentication

# Etapa 4: Se ainda não resolvido, verifique as perguntas frequentes
# ou procure ajuda nas Issues do GitHub
```

## Próximos Passos

Após concluir este capítulo, você pode continuar aprendendo:
- **[Compatibilidade com Claude Code](../appendix/claude-code-compatibility/)** - Aprenda sobre suporte completo de compatibilidade com Claude Code
- **[Referência de Configuração](../appendix/configuration-reference/)** - Visualize o Schema completo do arquivo de configuração e descrições de campos
- **[Servidores MCP Integrados](../appendix/builtin-mcps/)** - Aprenda como usar servidores MCP integrados
