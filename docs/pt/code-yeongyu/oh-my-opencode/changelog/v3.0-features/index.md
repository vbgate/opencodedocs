---
title: "v3.0 Novidades: Sistema de Categories e Skills | oh-my-opencode"
sidebarTitle: "Dar à IA 7 Especialidades"
subtitle: "v3.0 Novidades: Sistema de Categories e Skills"
description: "Aprenda o sistema de Categories e Skills do oh-my-opencode v3.0. Domine 7 categorias de tarefas, 3 pacotes de habilidades e capacidade de composição dinâmica de agentes."
tags:
  - "v3.0"
  - "categories"
  - "skills"
  - "changelog"
order: 200
---

# v3.0 Novidades: Análise Completa do Sistema de Categories e Skills

## Visão Geral da Versão

O oh-my-opencode v3.0 é uma versão marco importante que introduz o novo **Sistema de Categories e Skills**, transformando completamente a forma de orquestração de agentes de IA. Esta versão visa tornar os agentes de IA mais especializados, flexíveis e composicionais.

**Melhorias Chave**:
- 🎯 **Sistema de Categories**: 7 categorias de tarefas integradas, seleção automática do modelo ideal
- 🛠️ **Sistema de Skills**: 3 pacotes de habilidades profissionais integradas, injeção de conhecimento de domínio
- 🔄 **Composição Dinâmica**: Combinação livre de Category e Skill através de `delegate_task`
- 🚀 **Sisyphus-Junior**: Novo executor de tarefas delegadas, previne loops infinitos
- 📝 **Configuração Flexível**: Suporte a Categories e Skills personalizados

---

## Novo Recurso Principal 1: Sistema de Categories

### O que é uma Category?

Category é uma **predefinição de configuração de agente** otimizada para um domínio específico. Ela responde a uma pergunta chave: **"Que tipo de trabalho é este?"**

Cada Category define:
- **Modelo usado** (model)
- **Parâmetro de temperatura** (temperature)
- **Mentalidade de prompt** (prompt mindset)
- **Capacidade de raciocínio** (reasoning effort)
- **Permissões de ferramentas** (tools)

### 7 Categories Integradas

| Category | Modelo Padrão | Temperature | Cenários de Uso |
|--- | --- | --- | ---|
| `visual-engineering` | `google/gemini-3-pro` | 0.7 | Frontend, UI/UX, design, estilos, animações |
| `ultrabrain` | `openai/gpt-5.2-codex` (xhigh) | 0.1 | Raciocínio lógico profundo, decisões de arquitetura complexas que exigem muita análise |
| `artistry` | `google/gemini-3-pro` (max) | 0.7 | Tarefas de alta criatividade/artísticas, ideias inovadoras |
| `quick` | `anthropic/claude-haiku-4-5` | 0.1 | Tarefas simples - modificação de arquivo único, correção de erros ortográficos, modificações simples |
| `unspecified-low` | `anthropic/claude-sonnet-4-5` | 0.1 | Tarefas que não se encaixam em outras categorias, baixa carga de trabalho |
| `unspecified-high` | `anthropic/claude-opus-4-5` (max) | 0.1 | Tarefas que não se encaixam em outras categorias, alta carga de trabalho |
| `writing` | `google/gemini-3-flash` | 0.1 | Documentação, ensaios, redação técnica |

**Fonte**: `docs/category-skill-guide.md:22-30`

### Como usar Categories?

Ao chamar a ferramenta `delegate_task`, especifique o parâmetro `category`:

```typescript
// Delegar tarefa de frontend para a category visual-engineering
delegate_task(
  category="visual-engineering",
  prompt="Adicionar componente de gráfico responsivo para a página do dashboard"
)
```

O sistema automaticamente:
1. Seleciona a Category `visual-engineering`
2. Usa o modelo `google/gemini-3-pro`
3. Aplica `temperature: 0.7` (alta criatividade)
4. Carrega a mentalidade de prompt da Category

### Sisyphus-Junior: Executor de Tarefas Delegadas

Quando você usa uma Category, um agente especial chamado **Sisyphus-Junior** executa a tarefa.

**Características Chave**:
- ❌ **Não pode delegar novamente** a tarefa para outros agentes
- 🎯 **Focado na tarefa atribuída**
- 🔄 **Previne loops infinitos de delegação**

**Objetivo de Design**: Garantir que o agente foque na tarefa atual, evitando a complexidade causada por delegação em camadas.

---

## Novo Recurso Principal 2: Sistema de Skills

### O que é uma Skill?

Skill é um mecanismo para injetar **conhecimento especializado (Context)** e **ferramentas (MCP)** em um agente. Ela responde a outra pergunta chave: **"Quais ferramentas e conhecimento são necessários?"**

### 3 Skills Integradas

#### 1. `git-master`

**Capacidades**:
- Especialista em Git
- Detecta estilo de commits
- Divide commits atômicos
- Formula estratégias de rebase

**MCP**: Nenhum (usa comandos Git)

**Cenários de Uso**: Commits, busca de histórico, gerenciamento de branches

#### 2. `playwright`

**Capacidades**:
- Automação de navegador
- Testes de página web
- Capturas de tela
- Coleta de dados

**MCP**: `@playwright/mcp` (execução automática)

**Cenários de Uso**: Validação de UI após implementação, escrita de testes E2E

#### 3. `frontend-ui-ux`

**Capacidades**:
- Injeta mentalidade de designer
- Guias de cor, tipografia, animações

**Cenários de Uso**: Trabalho de UI estético além de implementação simples

**Fonte**: `docs/category-skill-guide.md:57-70`

### Como usar Skills?

Adicione o array `load_skills` em `delegate_task`:

```typescript
// Delegar tarefa rápida e carregar a skill git-master
delegate_task(
  category="quick",
  load_skills=["git-master"],
  prompt="Faça commit das alterações atuais. Siga o estilo de mensagem de commit."
)
```

O sistema automaticamente:
1. Seleciona a Category `quick` (Claude Haiku, baixo custo)
2. Carrega a Skill `git-master` (injeta conhecimento especializado em Git)
3. Inicia o Sisyphus-Junior para executar a tarefa

### Skills Personalizadas

Você pode adicionar Skills personalizadas diretamente em `.opencode/skills/` no diretório raiz do projeto ou em `~/.claude/skills/` no diretório do usuário.

**Exemplo: `.opencode/skills/my-skill/SKILL.md`**

```markdown
---
name: my-skill
description: Minha skill personalizada profissional
mcp:
  my-mcp:
    command: npx
    args: ["-y", "my-mcp-server"]
---

# Meu Prompt de Skill

Este conteúdo será injetado no prompt do sistema do agente.
...
```

**Fonte**: `docs/category-skill-guide.md:87-103`

---

## Novo Recurso Principal 3: Capacidade de Composição Dinâmica

### Estratégia de Composição: Criar Agentes Especializados

Combinando diferentes Categories e Skills, você pode criar agentes especializados poderosos.

#### 🎨 Designer (Implementação de UI)

- **Category**: `visual-engineering`
- **load_skills**: `["frontend-ui-ux", "playwright"]`
- **Efeito**: Implementa UI estética e valida diretamente o resultado de renderização no navegador

#### 🏗️ Arquiteto (Revisão de Design)

- **Category**: `ultrabrain`
- **load_skills**: `[]` (raciocínio puro)
- **Efeito**: Utiliza a capacidade de raciocínio lógico do GPT-5.2 para análise profunda de arquitetura de sistema

#### ⚡ Mantenedor (Correções Rápidas)

- **Category**: `quick`
- **load_skills**: `["git-master"]`
- **Efeito**: Corrige código rapidamente usando modelo custo-benefício e gera commits limpos

**Fonte**: `docs/category-skill-guide.md:111-124`

### Guia de Prompts do delegate_task

Ao delegar tarefas, prompts **claros e específicos** são cruciais. Inclua os seguintes 7 elementos:

1. **TASK**: O que precisa ser feito? (objetivo único)
2. **EXPECTED OUTCOME**: Qual é a entrega?
3. **REQUIRED SKILLS**: Quais skills devem ser carregadas via `load_skills`?
4. **REQUIRED TOOLS**: Quais ferramentas devem ser usadas? (lista de permissões)
5. **MUST DO**: O que deve ser feito (restrições)
6. **MUST NOT DO**: O que nunca deve ser feito
7. **CONTEXT**: Caminhos de arquivo, padrões existentes, materiais de referência

**❌ Exemplo Ruim**:
> "Conserte isso"

**✅ Exemplo Bom**:
> **TASK**: Consertar problema de quebra de layout mobile em `LoginButton.tsx`
> **CONTEXT**: `src/components/LoginButton.tsx`, usando Tailwind CSS
> **MUST DO**: Alterar flex-direction no breakpoint `md:`
> **MUST NOT DO**: Modificar layout de desktop existente
> **EXPECTED**: Botão alinhado verticalmente em mobile

**Fonte**: `docs/category-skill-guide.md:130-148`

---

## Guia de Configuração

### Schema de Configuração de Category

Você pode ajustar Categories em `oh-my-opencode.json`.

| Campo | Tipo | Descrição |
|--- | --- | ---|
| `description` | string | Descrição legível do propósito da Category. Exibido no prompt de delegate_task. |
| `model` | string | ID do modelo de IA usado (ex: `anthropic/claude-opus-4-5`) |
| `variant` | string | Variante do modelo (ex: `max`, `xhigh`) |
| `temperature` | number | Nível de criatividade (0.0 ~ 2.0). Quanto menor, mais determinístico. |
| `top_p` | number | Parâmetro de amostragem de núcleo (0.0 ~ 1.0) |
| `prompt_append` | string | Conteúdo anexado ao prompt do sistema quando esta Category é selecionada |
| `thinking` | object | Configuração do modelo Thinking (`{ type: "enabled", budgetTokens: 16000 }`) |
| `reasoningEffort` | string | Nível de esforço de raciocínio (`low`, `medium`, `high`) |
| `textVerbosity` | string | Verbosidade de texto (`low`, `medium`, `high`) |
| `tools` | object | Controle de uso de ferramentas (use `{ "tool_name": false }` para desabilitar) |
| `maxTokens` | number | Número máximo de tokens de resposta |
| `is_unstable_agent` | boolean | Marca o agente como instável - força modo em segundo plano para monitoramento |

**Fonte**: `docs/category-skill-guide.md:159-172`

### Exemplo de Configuração

```jsonc
{
  "categories": {
    // 1. Definir nova category personalizada
    "korean-writer": {
      "model": "google/gemini-3-flash",
      "temperature": 0.5,
      "prompt_append": "You are a Korean technical writer. Maintain a friendly and clear tone."
    },

    // 2. Sobrescrever category existente (alterar modelo)
    "visual-engineering": {
      "model": "openai/gpt-5.2",
      "temperature": 0.8
    },

    // 3. Configurar modelo thinking e limitar ferramentas
    "deep-reasoning": {
      "model": "anthropic/claude-opus-4-5",
      "thinking": {
        "type": "enabled",
        "budgetTokens": 32000
      },
      "tools": {
        "websearch_web_search_exa": false // desabilitar busca na web
      }
    }
  },

  // Desabilitar skills
  "disabled_skills": ["playwright"]
}
```

**Fonte**: `docs/category-skill-guide.md:175-206`

---

## Outras Melhorias Importantes

Além do sistema de Categories e Skills, a v3.0 inclui as seguintes melhorias importantes:

### Melhoria de Estabilidade
- ✅ Versão marcada como estável (3.0.1)
- ✅ Otimizou mecanismo de delegação de agentes
- ✅ Melhorou capacidade de recuperação de erros

### Otimização de Performance
- ✅ Reduziu injeção de contexto desnecessária
- ✅ Otimizou mecanismo de polling de tarefas em segundo plano
- ✅ Melhorou eficiência de orquestração multi-modelo

### Compatibilidade com Claude Code
- ✅ Compatibilidade completa com formato de configuração do Claude Code
- ✅ Suporta carregamento de Skills, Commands e MCPs do Claude Code
- ✅ Descoberta e configuração automáticas

**Fonte**: `README.md:18-20`, `README.md:292-304`

---

## Próximos Passos

O sistema de Categories e Skills da v3.0 estabelece a base para extensão flexível do oh-my-opencode. Se você deseja entender melhor como usar esses novos recursos, consulte as seguintes seções:

- [Categories e Skills: Composição Dinâmica de Agentes](../../advanced/categories-skills/) - Guia de uso detalhado
- [Skills Integradas: Automação de Navegador e Especialista em Git](../../advanced/builtin-skills/) - Análise aprofundada de Skills
- [Personalização Avançada de Configuração: Agentes e Gerenciamento de Permissões](../../advanced/advanced-configuration/) - Guia de configuração personalizada

Comece a explorar esses novos recursos e torne seus agentes de IA mais especializados e eficientes!
