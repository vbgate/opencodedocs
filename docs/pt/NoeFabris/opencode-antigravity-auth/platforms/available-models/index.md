---
title: "Modelos Disponíveis: Guia de Configuração Claude e Gemini | Antigravity Auth"
sidebarTitle: "Escolhendo o Modelo de IA Certo"
subtitle: "Conheça todos os modelos disponíveis e suas configurações de variantes"
description: "Aprenda a configurar modelos no Antigravity Auth. Domine o uso das variantes Thinking do Claude Opus 4.5, Sonnet 4.5 e Gemini 3 Pro/Flash."
tags:
  - "Plataformas"
  - "Modelos"
  - "Claude"
  - "Gemini"
  - "Thinking"
prerequisite:
  - "start-what-is-antigravity-auth"
  - "start-quick-install"
order: 1
---

# Conheça todos os modelos disponíveis e suas configurações de variantes

## O que você vai aprender

- Escolher o modelo Claude ou Gemini mais adequado às suas necessidades
- Entender os diferentes níveis do modo Thinking (low/max ou minimal/low/medium/high)
- Compreender os dois pools de cota independentes: Antigravity e Gemini CLI
- Usar o parâmetro `--variant` para ajustar dinamicamente o orçamento de raciocínio

## Seu desafio atual

Você acabou de instalar o plugin e se depara com uma longa lista de nomes de modelos, sem saber qual escolher:
- Qual a diferença entre `antigravity-gemini-3-pro` e `gemini-3-pro-preview`?
- O que significa `--variant=max`? O que acontece se eu não especificar?
- O modo thinking do Claude é igual ao do Gemini?

## Conceito central

O Antigravity Auth suporta duas categorias principais de modelos, cada uma com seu próprio pool de cota:

1. **Cota Antigravity**: Acesso via Google Antigravity API, inclui Claude e Gemini 3
2. **Cota Gemini CLI**: Acesso via Gemini CLI API, inclui Gemini 2.5 e Gemini 3 Preview

::: info Sistema de Variants
O sistema de variants do OpenCode permite que você não precise definir um modelo separado para cada nível de thinking. Em vez disso, você especifica a configuração em tempo de execução através do parâmetro `--variant`. Isso torna o seletor de modelos mais limpo e a configuração mais flexível.
:::

## Modelos com Cota Antigravity

Estes modelos são acessados através do prefixo `antigravity-` e utilizam o pool de cota da API Antigravity.

### Série Gemini 3

#### Gemini 3 Pro
| Nome do Modelo | Variants | Nível de Thinking | Descrição |
| --- | --- | --- | --- |
| `antigravity-gemini-3-pro` | low, high | low, high | Equilíbrio entre qualidade e velocidade |

**Exemplo de configuração de Variant**:
```bash
# Nível de thinking baixo (mais rápido)
opencode run "resposta rápida" --model=google/antigravity-gemini-3-pro --variant=low

# Nível de thinking alto (mais profundo)
opencode run "raciocínio complexo" --model=google/antigravity-gemini-3-pro --variant=high
```

#### Gemini 3 Flash
| Nome do Modelo | Variants | Nível de Thinking | Descrição |
| --- | --- | --- | --- |
| `antigravity-gemini-3-flash` | minimal, low, medium, high | minimal, low, medium, high | Resposta ultrarrápida, suporta 4 níveis de thinking |

**Exemplo de configuração de Variant**:
```bash
# Thinking mínimo (mais rápido)
opencode run "tarefa simples" --model=google/antigravity-gemini-3-flash --variant=minimal

# Thinking equilibrado (padrão)
opencode run "tarefa comum" --model=google/antigravity-gemini-3-flash --variant=medium

# Thinking máximo (mais profundo)
opencode run "análise complexa" --model=google/antigravity-gemini-3-flash --variant=high
```

::: warning Gemini 3 Pro não suporta minimal/medium
O `gemini-3-pro` suporta apenas os níveis `low` e `high`. Se você tentar usar `--variant=minimal` ou `--variant=medium`, a API retornará um erro.
:::

### Série Claude

#### Claude Sonnet 4.5 (Sem Thinking)
| Nome do Modelo | Variants | Orçamento de Thinking | Descrição |
| --- | --- | --- | --- |
| `antigravity-claude-sonnet-4-5` | — | — | Modo padrão, sem thinking estendido |

**Exemplo de uso**:
```bash
# Modo padrão
opencode run "conversa cotidiana" --model=google/antigravity-claude-sonnet-4-5
```

#### Claude Sonnet 4.5 Thinking
| Nome do Modelo | Variants | Orçamento de Thinking (tokens) | Descrição |
| --- | --- | --- | --- |
| `antigravity-claude-sonnet-4-5-thinking` | low, max | 8192 (low) / 32768 (max) | Modo equilibrado |

**Exemplo de configuração de Variant**:
```bash
# Thinking leve (mais rápido)
opencode run "raciocínio rápido" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=low

# Thinking máximo (mais profundo)
opencode run "análise profunda" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=max
```

#### Claude Opus 4.5 Thinking
| Nome do Modelo | Variants | Orçamento de Thinking (tokens) | Descrição |
| --- | --- | --- | --- |
| `antigravity-claude-opus-4-5-thinking` | low, max | 8192 (low) / 32768 (max) | Capacidade máxima de raciocínio |

**Exemplo de configuração de Variant**:
```bash
# Thinking leve
opencode run "resposta de alta qualidade" --model=google/antigravity-claude-opus-4-5-thinking --variant=low

# Thinking máximo (para tarefas mais complexas)
opencode run "análise de nível especialista" --model=google/antigravity-claude-opus-4-5-thinking --variant=max
```

::: tip Diferença entre os modos Thinking do Claude e Gemini
- **Claude** usa um thinking budget numérico (tokens), como 8192, 32768
- **Gemini 3** usa um thinking level em string (minimal/low/medium/high)
- Ambos mostram o processo de raciocínio antes da resposta, mas a configuração é diferente
:::

## Modelos com Cota Gemini CLI

Estes modelos não têm o prefixo `antigravity-` e utilizam o pool de cota independente da API Gemini CLI. Eles não suportam o modo thinking.

| Nome do Modelo | Descrição |
| --- | --- |
| `gemini-2.5-flash` | Gemini 2.5 Flash (resposta rápida) |
| `gemini-2.5-pro` | Gemini 2.5 Pro (equilíbrio entre qualidade e velocidade) |
| `gemini-3-flash-preview` | Gemini 3 Flash Preview (versão prévia) |
| `gemini-3-pro-preview` | Gemini 3 Pro Preview (versão prévia) |

**Exemplo de uso**:
```bash
# Gemini 2.5 Pro (sem thinking)
opencode run "tarefa rápida" --model=google/gemini-2.5-pro

# Gemini 3 Pro Preview (sem thinking)
opencode run "teste de modelo preview" --model=google/gemini-3-pro-preview
```

::: info Modelos Preview
Os modelos `gemini-3-*-preview` são versões prévias oficiais do Google, que podem ser instáveis ou sofrer alterações a qualquer momento. Se você deseja usar a funcionalidade Thinking, utilize os modelos `antigravity-gemini-3-*`.
:::

## Visão Geral Comparativa dos Modelos

| Característica | Claude 4.5 | Gemini 3 | Gemini 2.5 |
| --- | --- | --- | --- |
| **Suporte a Thinking** | ✅ (thinkingBudget) | ✅ (thinkingLevel) | ❌ |
| **Google Search** | ❌ | ✅ | ✅ |
| **Pool de Cota** | Antigravity | Antigravity + Gemini CLI | Gemini CLI |
| **Casos de Uso** | Raciocínio complexo, programação | Tarefas gerais + busca | Resposta rápida, tarefas simples |

## 🎯 Como Escolher o Modelo

### Claude ou Gemini?

- **Escolha Claude**: Você precisa de capacidade de raciocínio lógico mais forte, geração de código mais estável
- **Escolha Gemini 3**: Você precisa de Google Search, velocidade de resposta mais rápida

### Thinking ou modo padrão?

- **Use Thinking**: Raciocínio complexo, tarefas de múltiplas etapas, necessidade de ver o processo de raciocínio
- **Use modo padrão**: Perguntas e respostas simples, resposta rápida, sem necessidade de exibir raciocínio

### Qual nível de Thinking escolher?

| Nível | Claude (tokens) | Gemini 3 | Casos de Uso |
| --- | --- | --- | --- |
| **minimal** | — | Exclusivo do Flash | Tarefas ultrarrápidas, como tradução, resumo |
| **low** | 8192 | Pro/Flash | Equilíbrio entre qualidade e velocidade, adequado para a maioria das tarefas |
| **medium** | — | Exclusivo do Flash | Tarefas de complexidade média |
| **high/max** | 32768 | Pro/Flash | Tarefas mais complexas, como design de sistemas, análise profunda |

::: tip Configuração Recomendada
- **Desenvolvimento diário**: `antigravity-claude-sonnet-4-5-thinking --variant=low`
- **Raciocínio complexo**: `antigravity-claude-opus-4-5-thinking --variant=max`
- **Perguntas rápidas + busca**: `antigravity-gemini-3-flash --variant=low` + Google Search ativado
:::

## Exemplo de Configuração Completa

Adicione a seguinte configuração ao `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-antigravity-auth@latest"],
  "provider": {
    "google": {
      "models": {
        "antigravity-gemini-3-pro": {
          "name": "Gemini 3 Pro (Antigravity)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingLevel": "low" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-gemini-3-flash": {
          "name": "Gemini 3 Flash (Antigravity)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "minimal": { "thinkingLevel": "minimal" },
            "low": { "thinkingLevel": "low" },
            "medium": { "thinkingLevel": "medium" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-claude-sonnet-4-5": {
          "name": "Claude Sonnet 4.5 (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "antigravity-claude-sonnet-4-5-thinking": {
          "name": "Claude Sonnet 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "antigravity-claude-opus-4-5-thinking": {
          "name": "Claude Opus 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "gemini-2.5-flash": {
          "name": "Gemini 2.5 Flash (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-2.5-pro": {
          "name": "Gemini 2.5 Pro (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-flash-preview": {
          "name": "Gemini 3 Flash Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-pro-preview": {
          "name": "Gemini 3 Pro Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        }
      }
    }
  }
}
```

::: details Copiar configuração
Clique no botão de copiar no canto superior direito do bloco de código acima e cole no seu arquivo `~/.config/opencode/opencode.json`.
:::

## Checkpoint ✅

Complete os seguintes passos para confirmar que você domina a seleção de modelos:

- [ ] Entender os dois pools de cota independentes: Antigravity e Gemini CLI
- [ ] Saber que Claude usa thinkingBudget (tokens) e Gemini 3 usa thinkingLevel (string)
- [ ] Conseguir escolher a variant adequada de acordo com a complexidade da tarefa
- [ ] Ter adicionado a configuração completa ao `opencode.json`

## Resumo da Lição

O Antigravity Auth oferece uma rica seleção de modelos e configuração flexível de variants:

- **Cota Antigravity**: Suporta Claude 4.5 e Gemini 3, com capacidade de Thinking
- **Cota Gemini CLI**: Suporta Gemini 2.5 e Gemini 3 Preview, sem capacidade de Thinking
- **Sistema de Variants**: Ajuste dinamicamente o nível de thinking através do parâmetro `--variant`, sem precisar definir múltiplos modelos

Ao escolher um modelo, considere o tipo de tarefa (raciocínio vs busca), complexidade (simples vs complexa) e necessidade de velocidade de resposta.

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos sobre **[Modelos Thinking em Detalhes](../thinking-models/)**.
>
> Você vai aprender:
> - Os princípios dos modos Thinking do Claude e Gemini
> - Como configurar orçamentos de thinking personalizados
> - Técnicas para preservar blocos de thinking (signature caching)

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Resolução de modelo e extração de tier | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 177-282 |
| Definição de orçamento de thinking tier | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 14-19 |
| Definição de níveis de thinking Gemini 3 | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 26 |
| Mapeamento de aliases de modelo | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 36-57 |
| Resolução de configuração de Variant | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 374-422 |
| Definições de tipo | [`src/plugin/transform/types.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/types.ts) | 1-115 |

**Constantes principais**:
- `THINKING_TIER_BUDGETS`: Mapeamento de orçamento de thinking do Claude e Gemini 2.5 (low/medium/high → tokens)
- `GEMINI_3_THINKING_LEVELS`: Níveis de thinking suportados pelo Gemini 3 (minimal/low/medium/high)

**Funções principais**:
- `resolveModelWithTier(requestedModel)`: Resolve o nome do modelo e a configuração de thinking
- `resolveModelWithVariant(requestedModel, variantConfig)`: Resolve o modelo a partir da configuração de variant
- `budgetToGemini3Level(budget)`: Mapeia o orçamento de tokens para o nível do Gemini 3

</details>
