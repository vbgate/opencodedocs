---
title: "Histórico de Versões: Acompanhe a Evolução do DCP | opencode-dynamic-context-pruning"
sidebarTitle: "Veja Novas Funcionalidades"
subtitle: "Histórico de Versões: Acompanhe a Evolução do DCP"
description: "Conheça todas as atualizações de versão do plugin OpenCode DCP, desde v1.0.1 até v1.2.7, domine novos recursos, correções e otimizações, atualize a tempo para obter melhorias na economia de tokens."
tags:
  - "Histórico de Versões"
  - "Changelog"
  - "DCP"
prerequisite: []
order: 1
---

# Histórico de Versões do DCP

Este documento registra o histórico completo de atualizações de versão do plugin OpenCode Dynamic Context Pruning (DCP).

---

## [v1.2.7] - 2026-01-22

**Novas Funcionalidades**
- ✨ Exibe contagem de tokens do conteúdo extraído (na notificação de pruning)
- 🛡️ Melhora mecanismo de defesa contra injeção de contexto (adição de verificação de array)
- 📝 Otimização: injeta contexto como mensagem de usuário quando a última mensagem é do usuário
- ⚙️ Simplifica configuração padrão (contém apenas URL do schema)

---

## [v1.2.6] - 2026-01-21

**Novas Funcionalidades**
- ✨ Adiciona comando `/dcp sweep` para remover contexto manualmente

**Detalhes do Comando**
- `/dcp sweep` - Remove todas as ferramentas após a última mensagem do usuário
- `/dcp sweep N` - Remove as últimas N ferramentas

---

## [v1.2.5] - 2026-01-20

**Novas Funcionalidades**
- ✨ Exibe contagem de ferramentas no comando `/dcp context`
- ✨ Otimiza UI do comando `/dcp context`:
  - Exibe contagem de ferramentas removidas
  - Melhora precisão da barra de progresso

**Otimizações de Desempenho**
- 🚀 Otimiza cálculo de tokens no comando de contexto

---

## [v1.2.4] - 2026-01-20

**Novas Funcionalidades**
- ✨ Unifica comandos DCP em comando único `/dcp` (estrutura de subcomandos):
  - `/dcp` - Exibe ajuda
  - `/dcp context` - Análise de contexto
  - `/dcp stats` - Estatísticas
- ✨ Adiciona seção de configuração `commands`:
  - Permite habilitar/desabilitar comandos de barra
  - Suporta configuração de lista de ferramentas protegidas

**Melhorias**
- 📝 Simplifica UI do comando de contexto
- 📝 Atualização da documentação: esclarece mecanismo de injeção de ferramenta context_info

**Correções**
- 🐛 Corrige tratamento de erros de remoção de ferramentas (lança erro ao falhar em vez de retornar string)

**Documentação**
- 📚 Adiciona estatísticas de taxa de acerto de cache ao README

---

## [v1.2.3] - 2026-01-16

**Novas Funcionalidades**
- ✨ Simplifica carregamento de prompts (move prompts para arquivos TS)

**Melhorias**
- 🔧 Compatibilidade Gemini: usa `thoughtSignature` para contornar validação de injeção de seção de ferramenta

---

## [v1.2.2] - 2026-01-15

**Correções**
- 🐛 Simplifica momento de injeção (aguarda turno de assistente)
- 🐛 Correção de compatibilidade Gemini: usa injeção de texto para evitar erros de assinatura de pensamento

---

## [v1.2.1] - 2026-01-14

**Correções**
- 🐛 Modelos Anthropic: requer bloco de raciocínio antes de injeção de contexto
- 🐛 GitHub Copilot: pula injeção de mensagem sintética de papel de usuário

---

## [v1.2.0] - 2026-01-13

**Novas Funcionalidades**
- ✨ Adiciona `plan_enter` e `plan_exit` à lista de ferramentas protegidas padrão
- ✨ Suporta ferramenta de questão (question tool) para remoção

**Melhorias**
- 🔧 Unifica mecanismo de injeção (com verificação isAnthropic)
- 🔧 Estrutura de diretório de prompts simplificada
- 🔧 Simplifica e unifica ordem de verificação de prune.ts
- 🔧 Extrai manipulador de prompt de sistema para hooks.ts

**Correções**
- 🐛 Pula injeção de prompt de sistema de sessões de subagente
- 🐛 GitHub Copilot: pula injeção quando última mensagem é de papel de usuário

---

## [v1.1.6] - 2026-01-12

**Correções**
- 🐛 **Correção Crítica para Usuários GitHub Copilot**: usa mensagem de assistente concluída e seção de ferramenta para injetar lista de ferramentas removíveis

**Alcance do Impacto**
- Esta correção resolve problemas críticos para usuários do GitHub Copilot ao usar DCP

---

## [v1.1.5] - 2026-01-10

**Novas Funcionalidades**
- ✨ Adiciona suporte a JSON Schema para autocompletar configuração
- ✨ Adiciona configuração de padrão de arquivo protegido (protectedFilePatterns)
- ✨ Suporta proteção de operações de arquivo através de padrões glob

**Melhorias**
- 📝 Documentação: documenta limitações de subagentes

**Correções**
- 🐛 Corrige URL de schema usando branch master
- 🐛 Adiciona `$schema` à lista de chaves de configuração válidas

---

## [v1.1.4] - 2026-01-06

**Correções**
- 🐛 Remove sinalizador `isInternalAgent` (devido a condição de corrida de ordem de hook)

**Melhorias**
- 🔧 Otimiza lógica de detecção de agente interno

---

## [v1.1.3] - 2026-01-05

**Correções**
- 🐛 Pula injeção DCP para agentes internos (title, summary, compaction)
- 🐛 Desabilita remoção para ferramentas de escrita/edição

**Melhorias**
- 🔧 Melhora detecção de limitações de subagentes

---

## [v1.1.2] - 2025-12-26

**Melhorias**
- 🔧 Mescla distillation em notificação unificada
- 🔧 Simplifica UI de distillation

---

## [v1.1.1] - 2025-12-25

**Novas Funcionalidades**
- ✨ Adiciona estratégia de purge errors, remove entradas após chamadas de ferramenta falhas
- ✨ Adiciona suporte a ferramenta de skill para `extractParameterKey`

**Melhorias**
- 📝 Melhora texto de substituição para remoção de erros
- 📝 Documentação: atualiza prompts sobre context poisoning e OAuth

---

## [v1.1.0] - 2025-12-24

**Novas Funcionalidades**
- ✨ Atualização da versão principal de funcionalidades
- ✨ Adiciona estratégias automáticas de remoção:
  - Estratégia de remoção de duplicatas
  - Estratégia de sobrescrita
  - Estratégia de limpeza de erros

**Novas Ferramentas**
- ✨ Ferramentas de remoção controladas por LLM:
  - `discard` - Remove conteúdo de ferramenta
  - `extract` - Extrai descobertas-chave

**Sistema de Configuração**
- ✨ Suporte a configuração multicamadas (global/variáveis de ambiente/projeto)
- ✨ Funcionalidade de proteção de turno
- ✨ Configuração de ferramentas protegidas

---

## [v1.0.4] - 2025-12-18

**Correções**
- 🐛 Não remove entradas de ferramentas pendentes ou em execução

**Melhorias**
- 🔧 Otimiza lógica de detecção de estado de ferramenta

---

## [v1.0.3] - 2025-12-18

**Novas Funcionalidades**
- ✅ Detecção de compactação baseada em mensagem

**Melhorias**
- 🔧 Verifica timestamp de compactação na inicialização da sessão

---

## [v1.0.2] - 2025-12-17

**Novas Funcionalidades**
- ✅ Detecção de compactação baseada em mensagem

**Melhorias**
- 🔧 Limpa estrutura de código

---

## [v1.0.1] - 2025-12-16

**Versão Inicial**

- ✅ Implementação de funcionalidades principais
- ✅ Integração de plugin OpenCode
- ✅ Capacidade básica de remoção de contexto

---

## Regras de Nomenclatura de Versões

- **Número de Versão Principal** (como 1.x) - Atualizações importantes incompatíveis
- **Número de Versão Secundária** (como 1.2.x) - Novas funcionalidades compatíveis
- **Número de Revisão** (como 1.2.7) - Correções de problemas compatíveis

---

## Obtenha a Última Versão

Recomenda-se usar a tag `@latest` na configuração do OpenCode para garantir obtenção automática da versão mais recente:

```jsonc
// opencode.jsonc
{
    "plugin": ["@tarquinen/opencode-dcp@latest"],
}
```

Verifique a versão mais recente publicada: [pacote npm](https://www.npmjs.com/package/@tarquinen/opencode-dcp)
