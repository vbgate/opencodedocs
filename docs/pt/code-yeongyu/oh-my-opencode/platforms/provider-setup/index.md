---
title: "Configuração de Provider: Estratégia Multi-Modelo de IA | oh-my-opencode"
sidebarTitle: "Conectar Múltiplos Serviços de IA"
subtitle: "Configuração de Provider: Estratégia Multi-Modelo de IA"
description: "Aprenda como configurar vários Providers de IA do oh-my-opencode, incluindo Anthropic, OpenAI, Google e GitHub Copilot, e como funciona o mecanismo de fallback automático multi-modelo."
tags:
  - "configuration"
  - "providers"
  - "models"
prerequisite:
  - "start-installation"
order: 40
---

# Configuração de Provider: Claude, OpenAI, Gemini e Estratégia Multi-Modelo

## O Que Você Vai Aprender

- Configurar múltiplos Providers de IA como Anthropic Claude, OpenAI, Google Gemini e GitHub Copilot
- Entender o mecanismo de prioridade e fallback multi-modelo, permitindo que o sistema selecione automaticamente o melhor modelo disponível
- Especificar o modelo mais adequado para diferentes agentes de IA e tipos de tarefas
- Configurar serviços de terceiros como Z.ai Coding Plan e OpenCode Zen
- Usar o comando doctor para diagnosticar a configuração de resolução de modelos

## Seu Dilema Atual

Você instalou o oh-my-opencode, mas não tem certeza de:
- Como adicionar múltiplos Providers de IA (Claude, OpenAI, Gemini, etc.)
- Por que às vezes o agente usa um modelo diferente do esperado
- Como configurar modelos diferentes para tarefas diferentes (por exemplo, tarefas de pesquisa com modelos baratos, tarefas de programação com modelos potentes)
- Como o sistema alterna automaticamente para um modelo de backup quando um Provider não está disponível
- Como a configuração de modelos funciona em conjunto entre `opencode.json` e `oh-my-opencode.json`

## Quando Usar Esta Abordagem

- **Configuração inicial**: Acabou de instalar o oh-my-opencode e precisa adicionar ou ajustar Providers de IA
- **Adicionar nova assinatura**: Comprou uma nova assinatura de serviço de IA (como Gemini Pro) e deseja integrá-la
- **Otimizar custos**: Deseja que agentes específicos usem modelos mais baratos ou mais rápidos
- **Solução de problemas**: Descobriu que um agente não está usando o modelo esperado e precisa diagnosticar o problema
- **Orquestração multi-modelo**: Deseja aproveitar ao máximo as vantagens de diferentes modelos para construir fluxos de trabalho de desenvolvimento inteligentes

## 🎒 Pré-requisitos

::: warning Verificação de Pré-requisitos
Este tutorial assume que você já:
- ✅ Concluiu a [instalação e configuração inicial](../installation/)
- ✅ Instalou o OpenCode (versão >= 1.0.150)
- ✅ Conhece os formatos básicos de arquivos de configuração JSON/JSONC
:::

## Conceito Central

O oh-my-opencode usa um **sistema de orquestração multi-modelo** que seleciona o modelo mais adequado para diferentes agentes de IA e tipos de tarefas, com base em suas assinaturas e configurações.

**Por que precisamos de múltiplos modelos?**

Diferentes modelos têm diferentes vantagens:
- **Claude Opus 4.5**: Excelente em raciocínio complexo e design de arquitetura (custo alto, mas qualidade superior)
- **GPT-5.2**: Excelente em depuração de código e consultoria estratégica
- **Gemini 3 Pro**: Excelente em tarefas de frontend e UI/UX (fortes capacidades visuais)
- **GPT-5 Nano**: Rápido e gratuito, ideal para pesquisa de código e exploração simples
- **GLM-4.7**: Excelente relação custo-benefício, ideal para pesquisa e busca de documentação

A inteligência do oh-my-opencode está em: **deixar cada tarefa usar o modelo mais adequado, em vez de usar o mesmo modelo para todas as tarefas**.

## Localização dos Arquivos de Configuração

O oh-my-opencode suporta dois níveis de configuração:

| Localização | Caminho | Prioridade | Cenário de Uso |
| --- | --- | --- | --- |
| **Configuração do Projeto** | `.opencode/oh-my-opencode.json` | Baixa | Configurações específicas do projeto (commitadas com o repositório) |
| **Configuração do Usuário** | `~/.config/opencode/oh-my-opencode.json` | Alta | Configurações globais (compartilhadas entre todos os projetos) |

**Regra de Mesclagem de Configurações**: A configuração do usuário sobrescreve a configuração do projeto.

**Estrutura Recomendada de Arquivo de Configuração**:

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  // Habilita autocompletar JSON Schema

  "agents": {
    // Sobrescrita de modelos de agentes
  },
  "categories": {
    // Sobrescrita de modelos de categorias
  }
}
```

::: tip Autocompletar de Schema
Em editores como VS Code, após adicionar o campo `$schema`, você terá autocompletar completo e verificação de tipos ao digitar a configuração.
:::

## Métodos de Configuração de Provider

O oh-my-opencode suporta 6 principais Providers. Os métodos de configuração variam de acordo com o Provider.

### Anthropic Claude (Recomendado)

**Cenário de Uso**: Orquestrador principal Sisyphus e a maioria dos agentes principais

**Passos de Configuração**:

1. **Execute a autenticação do OpenCode**:
   ```bash
   opencode auth login
   ```

2. **Selecione o Provider**:
   - `Provider`: Selecione `Anthropic`
   - `Login method`: Selecione `Claude Pro/Max`

3. **Complete o fluxo OAuth**:
   - O sistema abrirá automaticamente o navegador
   - Faça login na sua conta Claude
   - Aguarde a conclusão da autenticação

4. **Verifique o sucesso**:
   ```bash
   opencode models | grep anthropic
   ```

   Você deverá ver:
   - `anthropic/claude-opus-4-5`
   - `anthropic/claude-sonnet-4-5`
   - `anthropic/claude-haiku-4-5`

**Mapeamento de Modelos** (configuração padrão do Sisyphus):

| Agente | Modelo Padrão | Uso |
| --- | --- | --- |
| Sisyphus | `anthropic/claude-opus-4-5` | Orquestrador principal, raciocínio complexo |
| Prometheus | `anthropic/claude-opus-4-5` | Planejamento de projeto |
| Metis | `anthropic/claude-sonnet-4-5` | Análise de pré-planejamento |
| Momus | `anthropic/claude-opus-4-5` | Revisão de planos |

### OpenAI (ChatGPT Plus)

**Cenário de Uso**: Agente Oracle (revisão de arquitetura, depuração)

**Passos de Configuração**:

1. **Execute a autenticação do OpenCode**:
   ```bash
   opencode auth login
   ```

2. **Selecione o Provider**:
   - `Provider`: Selecione `OpenAI`
   - `Login method`: Selecione OAuth ou API Key

3. **Complete o fluxo de autenticação** (de acordo com o método escolhido)

4. **Verifique o sucesso**:
   ```bash
   opencode models | grep openai
   ```

**Mapeamento de Modelos** (configuração padrão do Oracle):

| Agente | Modelo Padrão | Uso |
| --- | --- | --- |
| Oracle | `openai/gpt-5.2` | Revisão de arquitetura, depuração |

**Exemplo de Sobrescrita Manual**:

```jsonc
{
  "agents": {
    "oracle": {
      "model": "openai/gpt-5.2",  // Usa GPT para raciocínio estratégico
      "temperature": 0.1
    }
  }
}
```

### Google Gemini (Recomendado)

**Cenário de Uso**: Multimodal Looker (análise de mídia), tarefas de Frontend UI/UX

::: tip Altamente Recomendado
Para autenticação Gemini, é altamente recomendado instalar o plugin [`opencode-antigravity-auth`](https://github.com/NoeFabris/opencode-antigravity-auth). Ele oferece:
- Balanceamento de carga multi-conta (até 10 contas)
- Suporte ao sistema Variant (`low`/`high`)
- Sistema de quotas duplo (Antigravity + Gemini CLI)
:::

**Passos de Configuração**:

1. **Adicione o plugin de autenticação Antigravity**:
   
   Edite `~/.config/opencode/opencode.json`:
   ```json
   {
     "plugin": [
       "oh-my-opencode",
       "opencode-antigravity-auth@latest"
     ]
   }
   ```

2. **Configure os modelos Gemini** (importante):
   
   O plugin Antigravity usa nomes de modelo diferentes. É necessário copiar a configuração completa do modelo para `opencode.json`, mesclando cuidadosamente para evitar quebrar configurações existentes.

   Modelos disponíveis (quota Antigravity):
   - `google/antigravity-gemini-3-pro` — variantes: `low`, `high`
   - `google/antigravity-gemini-3-flash` — variantes: `minimal`, `low`, `medium`, `high`
   - `google/antigravity-claude-sonnet-4-5` — sem variantes
   - `google/antigravity-claude-sonnet-4-5-thinking` — variantes: `low`, `max`
   - `google/antigravity-claude-opus-4-5-thinking` — variantes: `low`, `max`

   Modelos disponíveis (quota Gemini CLI):
   - `google/gemini-2.5-flash`, `google/gemini-2.5-pro`, `google/gemini-3-flash-preview`, `google/gemini-3-pro-preview`

3. **Sobrescreva o modelo do agente** (em `oh-my-opencode.json`):
   
   ```jsonc
   {
     "agents": {
       "multimodal-looker": {
         "model": "google/antigravity-gemini-3-flash"
       }
     }
   }
   ```

4. **Execute a autenticação**:
   ```bash
   opencode auth login
   ```

5. **Selecione o Provider**:
   - `Provider`: Selecione `Google`
   - `Login method`: Selecione `OAuth with Google (Antigravity)`

6. **Complete o fluxo de autenticação**:
   - O sistema abrirá automaticamente o navegador
   - Complete o login do Google
   - Opcional: Adicione mais contas Google para balanceamento de carga

**Mapeamento de Modelos** (configuração padrão):

| Agente | Modelo Padrão | Uso |
| --- | --- | --- |
| Multimodal Looker | `google/antigravity-gemini-3-flash` | Análise de PDF, imagens |

### GitHub Copilot (Provider de Backup)

**Cenário de Uso**: Opção de backup quando Providers nativos não estão disponíveis

::: info Provider de Backup
O GitHub Copilot atua como um Provider de proxy, roteando solicitações para o modelo subjacente da sua assinatura.
:::

**Passos de Configuração**:

1. **Execute a autenticação do OpenCode**:
   ```bash
   opencode auth login
   ```

2. **Selecione o Provider**:
   - `Provider`: Selecione `GitHub`
   - `Login method`: Selecione `Authenticate via OAuth`

3. **Complete o fluxo OAuth do GitHub**

4. **Verifique o sucesso**:
   ```bash
   opencode models | grep github-copilot
   ```

**Mapeamento de Modelos** (quando GitHub Copilot é o melhor Provider disponível):

| Agente | Modelo | Uso |
| --- | --- | --- |
| Sisyphus | `github-copilot/claude-opus-4.5` | Orquestrador principal |
| Oracle | `github-copilot/gpt-5.2` | Revisão de arquitetura |
| Explore | `opencode/gpt-5-nano` | Exploração rápida |
| Librarian | `zai-coding-plan/glm-4.7` (se Z.ai disponível) | Busca de documentação |

### Z.ai Coding Plan (Opcional)

**Cenário de Uso**: Agente Librarian (pesquisa multi-repositório, busca de documentação)

**Características**:
- Fornece modelo GLM-4.7
- Excelente relação custo-benefício
- Quando habilitado, o **agente Librarian sempre usa** `zai-coding-plan/glm-4.7`, independentemente de outros Providers disponíveis

**Passos de Configuração**:

Use o instalador interativo:

```bash
bunx oh-my-opencode install
# Quando perguntado: "Do you have a Z.ai Coding Plan subscription?" → Selecione "Yes"
```

**Mapeamento de Modelos** (quando Z.ai é o único Provider disponível):

| Agente | Modelo | Uso |
| --- | --- | --- |
| Sisyphus | `zai-coding-plan/glm-4.7` | Orquestrador principal |
| Oracle | `zai-coding-plan/glm-4.7` | Revisão de arquitetura |
| Explore | `zai-coding-plan/glm-4.7-flash` | Exploração rápida |
| Librarian | `zai-coding-plan/glm-4.7` | Busca de documentação |

### OpenCode Zen (Opcional)

**Cenário de Uso**: Fornece modelos com prefixo `opencode/` (Claude Opus 4.5, GPT-5.2, GPT-5 Nano, Big Pickle)

**Passos de Configuração**:

```bash
bunx oh-my-opencode install
# Quando perguntado: "Do you have access to OpenCode Zen (opencode/ models)?" → Selecione "Yes"
```

**Mapeamento de Modelos** (quando OpenCode Zen é o melhor Provider disponível):

| Agente | Modelo | Uso |
| --- | --- | --- |
| Sisyphus | `opencode/claude-opus-4-5` | Orquestrador principal |
| Oracle | `opencode/gpt-5.2` | Revisão de arquitetura |
| Explore | `opencode/gpt-5-nano` | Exploração rápida |
| Librarian | `opencode/big-pickle` | Busca de documentação |

## Sistema de Resolução de Modelos (3 Etapas de Prioridade)

O oh-my-opencode usa um **mecanismo de 3 etapas de prioridade** para decidir qual modelo cada agente e categoria usa. Este mecanismo garante que o sistema sempre encontre um modelo disponível.

### Etapa 1: Sobrescrita do Usuário

Se o usuário especificar explicitamente um modelo em `oh-my-opencode.json`, use esse modelo.

**Exemplo**:
```jsonc
{
  "agents": {
    "oracle": {
      "model": "openai/gpt-5.2"  // Especificação explícita do usuário
    }
  }
}
```

Neste caso:
- ✅ Use `openai/gpt-5.2` diretamente
- ❌ Pule a etapa de downgrade do Provider

### Etapa 2: Degradê de Provider

Se o usuário não especificar explicitamente um modelo, o sistema tentará sequencialmente cada Provider na cadeia de prioridade definida para o agente, até encontrar um modelo disponível.

**Cadeia de Prioridade do Sisyphus**:

```
anthropic → github-copilot → opencode → antigravity → google
```

**Fluxo de Resolução**:
1. Tente `anthropic/claude-opus-4-5`
   - Disponível? → Retorne este modelo
   - Indisponível? → Continue para o próximo
2. Tente `github-copilot/claude-opus-4-5`
   - Disponível? → Retorne este modelo
   - Indisponível? → Continue para o próximo
3. Tente `opencode/claude-opus-4-5`
   - ...
4. Tente `google/antigravity-claude-opus-4-5-thinking` (se configurado)
   - ...
5. Retorne o modelo padrão do sistema

**Cadeias de Prioridade de Provider para Todos os Agentes**:

| Agente | Modelo (sem prefixo) | Cadeia de Prioridade de Provider |
| --- | --- | --- |
| **Sisyphus** | `claude-opus-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Oracle** | `gpt-5.2` | openai → anthropic → google → github-copilot → opencode |
| **Librarian** | `big-pickle` | opencode → github-copilot → anthropic |
| **Explore** | `gpt-5-nano` | anthropic → opencode |
| **Multimodal Looker** | `gemini-3-flash` | google → openai → zai-coding-plan → anthropic → opencode |
| **Prometheus** | `claude-opus-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Metis** | `claude-sonnet-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Momus** | `claude-opus-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Atlas** | `claude-sonnet-4-5` | anthropic → github-copilot → opencode → antigravity → google |

**Cadeias de Prioridade de Provider para Categorias**:

| Categoria | Modelo (sem prefixo) | Cadeia de Prioridade de Provider |
| --- | --- | --- |
| **ultrabrain** | `gpt-5.2-codex` | openai → anthropic → google → github-copilot → opencode |
| **artistry** | `gemini-3-pro` | google → openai → anthropic → github-copilot → opencode |
| **quick** | `claude-haiku-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **writing** | `gemini-3-flash` | google → openai → anthropic → github-copilot → opencode |

### Etapa 3: Padrão do Sistema

Se todos os Providers estiverem indisponíveis, use o modelo padrão do OpenCode (lido de `opencode.json`).

**Ordem de Prioridade Global**:

```
Sobrescrita do Usuário > Degradê de Provider > Padrão do Sistema
```

## Vamos Fazer Juntos: Configurar Múltiplos Providers

### Passo 1: Planeje Suas Assinaturas

Antes de começar a configurar, organize suas assinaturas:

```markdown
- [ ] Anthropic Claude (Pro/Max)
- [ ] OpenAI ChatGPT Plus
- [ ] Google Gemini
- [ ] GitHub Copilot
- [ ] Z.ai Coding Plan
- [ ] OpenCode Zen
```

### Passo 2: Use o Instalador Interativo (Recomendado)

O oh-my-opencode fornece um instalador interativo que lida automaticamente com a maioria das configurações:

```bash
bunx oh-my-opencode install
```

O instalador perguntará:
1. **Do you have a Claude Pro/Max Subscription?**
   - `yes, max20` → `--claude=max20`
   - `yes, regular` → `--claude=yes`
   - `no` → `--claude=no`

2. **Do you have an OpenAI/ChatGPT Plus Subscription?**
   - `yes` → `--openai=yes`
   - `no` → `--openai=no`

3. **Will you integrate Gemini models?**
   - `yes` → `--gemini=yes`
   - `no` → `--gemini=no`

4. **Do you have a GitHub Copilot Subscription?**
   - `yes` → `--copilot=yes`
   - `no` → `--copilot=no`

5. **Do you have access to OpenCode Zen (opencode/ models)?**
   - `yes` → `--opencode-zen=yes`
   - `no` → `--opencode-zen=no`

6. **Do you have a Z.ai Coding Plan subscription?**
   - `yes` → `--zai-coding-plan=yes`
   - `no` → `--zai-coding-plan=no`

**Modo Não-Interativo** (adequado para instalação scriptada):

```bash
bunx oh-my-opencode install --no-tui \
  --claude=max20 \
  --openai=yes \
  --gemini=yes \
  --copilot=no
```

### Passo 3: Autentique Cada Provider

Após a configuração do instalador, autentique cada um:

```bash
# Autentique Anthropic
opencode auth login
# Provider: Anthropic
# Login method: Claude Pro/Max
# Complete o fluxo OAuth

# Autentique OpenAI
opencode auth login
# Provider: OpenAI
# Complete o fluxo OAuth

# Autentique Google Gemini (requer plugin antigravity primeiro)
opencode auth login
# Provider: Google
# Login method: OAuth with Google (Antigravity)
# Complete o fluxo OAuth

# Autentique GitHub Copilot
opencode auth login
# Provider: GitHub
# Login method: Authenticate via OAuth
# Complete o GitHub OAuth
```

### Passo 4: Verifique a Configuração

```bash
# Verifique a versão do OpenCode
opencode --version
# Deve ser >= 1.0.150

# Veja todos os modelos disponíveis
opencode models

# Execute o diagnóstico doctor
bunx oh-my-opencode doctor --verbose
```

**Você deve ver** (exemplo de saída do doctor):

```
✅ OpenCode version: 1.0.150
✅ Plugin loaded: oh-my-opencode

📊 Model Resolution:
┌─────────────────────────────────────────────────────┐
│ Agent           │ Requirement            │ Resolved         │
├─────────────────────────────────────────────────────┤
│ Sisyphus        │ anthropic/claude-opus-4-5  │ anthropic/claude-opus-4-5 │
│ Oracle           │ openai/gpt-5.2              │ openai/gpt-5.2              │
│ Librarian        │ opencode/big-pickle           │ opencode/big-pickle           │
│ Explore          │ anthropic/gpt-5-nano          │ anthropic/gpt-5-nano          │
│ Multimodal Looker│ google/gemini-3-flash          │ google/gemini-3-flash          │
└─────────────────────────────────────────────────────┘

✅ All models resolved successfully
```

### Passo 5: Personalize Modelos de Agentes (Opcional)

Se você deseja especificar um modelo diferente para um agente específico:

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "agents": {
    // Oracle usa GPT para revisão de arquitetura
    "oracle": {
      "model": "openai/gpt-5.2",
      "temperature": 0.1
    },

    // Librarian usa modelo mais barato para pesquisa
    "librarian": {
      "model": "opencode/gpt-5-nano",
      "temperature": 0.1
    },

    // Multimodal Looker usa Gemini Antigravity
    "multimodal-looker": {
      "model": "google/antigravity-gemini-3-flash",
      "variant": "high"
    }
  }
}
```

### Passo 6: Personalize Modelos de Categoria (Opcional)

Especifique modelos para diferentes tipos de tarefas:

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "categories": {
    // Tarefas rápidas usam modelo barato
    "quick": {
      "model": "opencode/gpt-5-nano",
      "temperature": 0.1
    },

    // Tarefas de frontend usam Gemini
    "visual-engineering": {
      "model": "google/gemini-3-pro",
      "temperature": 0.7,
      "prompt_append": "Use shadcn/ui components and Tailwind CSS."
    },

    // Tarefas de raciocínio de alta inteligência usam GPT Codex
    "ultrabrain": {
      "model": "openai/gpt-5.2-codex",
      "temperature": 0.1
    }
  }
}
```

**Usando Categorias**:

```markdown
// Use delegate_task na conversa
delegate_task(category="visual", prompt="Create a responsive dashboard component")
delegate_task(category="quick", skills=["git-master"], prompt="Commit these changes")
```

## Pontos de Verificação ✅

- [ ] `opencode --version` mostra versão >= 1.0.150
- [ ] `opencode models` lista os modelos de todos os Providers configurados
- [ ] `bunx oh-my-opencode doctor --verbose` mostra que todos os modelos dos agentes foram resolvidos corretamente
- [ ] Você pode ver `"oh-my-opencode"` no array `plugin` em `opencode.json`
- [ ] Tentou usar um agente (como Sisyphus) e confirmou que o modelo funciona normalmente

## Avisos de Armadilhas

### ❌ Armadilha 1: Esquecer de Autenticar o Provider

**Sintoma**: Provider configurado, mas resolução de modelo falha.

**Causa**: O instalador configurou os modelos, mas a autenticação não foi concluída.

**Solução**:
```bash
opencode auth login
# Selecione o Provider correspondente e complete a autenticação
```

### ❌ Armadilha 2: Nomes de Modelos Antigravity Incorretos

**Sintoma**: Gemini configurado, mas o agente não o usa.

**Causa**: O plugin Antigravity usa nomes de modelo diferentes (`google/antigravity-gemini-3-pro` em vez de `google/gemini-3-pro`).

**Solução**:
```jsonc
{
  "agents": {
    "multimodal-looker": {
      "model": "google/antigravity-gemini-3-flash"  // Correto
      // model: "google/gemini-3-flash"  // ❌ Incorreto
    }
  }
}
```

### ❌ Armadilha 3: Localização Incorreta do Arquivo de Configuração

**Sintoma**: Configuração modificada, mas o sistema não aplica.

**Causa**: Modificou o arquivo de configuração errado (configuração do usuário vs configuração do projeto).

**Solução**:
```bash
# Configuração do usuário (global, prioridade alta)
~/.config/opencode/oh-my-opencode.json

# Configuração do projeto (local, prioridade baixa)
.opencode/oh-my-opencode.json

# Verifique qual arquivo está sendo usado
bunx oh-my-opencode doctor --verbose
```

### ❌ Armadilha 4: Cadeia de Prioridade de Provider Interrompida

**Sintoma**: Um agente sempre usa o modelo errado.

**Causa**: A sobrescrita do usuário (Etapa 1) ignora completamente o degradê de Provider (Etapa 2).

**Solução**: Se você deseja aproveitar o fallback automático, não codifique o modelo em `oh-my-opencode.json`, mas deixe o sistema escolher automaticamente com base na cadeia de prioridade.

**Exemplo**:
```jsonc
{
  "agents": {
    "oracle": {
      // ❌ Codificado: sempre usa GPT, mesmo que Anthropic esteja disponível
      "model": "openai/gpt-5.2"
    }
  }
}
```

Se deseja aproveitar o degradê, remova o campo `model` e deixe o sistema selecionar automaticamente:
```jsonc
{
  "agents": {
    "oracle": {
      // ✅ Automático: anthropic → google → github-copilot → opencode
      "temperature": 0.1
    }
  }
}
```

### ❌ Armadilha 5: Z.ai Sempre Ocupando o Librarian

**Sintoma**: Mesmo configurando outros Providers, o Librarian ainda usa GLM-4.7.

**Causa**: Quando Z.ai está habilitado, o Librarian é codificado para usar `zai-coding-plan/glm-4.7`.

**Solução**: Se não precisa deste comportamento, desabilite Z.ai:
```bash
bunx oh-my-opencode install --no-tui --zai-coding-plan=no
```

Ou sobrescreva manualmente:
```jsonc
{
  "agents": {
    "librarian": {
      "model": "opencode/big-pickle"  // Sobrescreve o codificado do Z.ai
    }
  }
}
```

## Resumo da Lição

- O oh-my-opencode suporta 6 principais Providers: Anthropic, OpenAI, Google, GitHub Copilot, Z.ai, OpenCode Zen
- Use o instalador interativo `bunx oh-my-opencode install` para configurar rapidamente múltiplos Providers
- O sistema de resolução de modelos seleciona dinamicamente modelos através de 3 etapas de prioridade (sobrescrita do usuário → degradê de Provider → padrão do sistema)
- Cada agente e Categoria tem sua própria cadeia de prioridade de Provider, garantindo que sempre seja encontrado um modelo disponível
- Use o comando `doctor --verbose` para diagnosticar a configuração de resolução de modelos
- Ao personalizar modelos de agentes e Categorias, tenha cuidado para não quebrar o mecanismo de fallback automático

## Próxima Lição

> Na próxima lição aprenderemos **[Estratégia Multi-Modelo: Fallback Automático e Prioridade](../model-resolution/)**.
>
> Você vai aprender:
> - O fluxo de trabalho completo do sistema de resolução de modelos
> - Como projetar combinações ótimas de modelos para diferentes tarefas
> - Estratégias de controle de concorrência em tarefas em segundo plano
> - Como diagnosticar problemas de resolução de modelos

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-26

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | ---|
| Definição do Schema de Configuração | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 1-378 |
| Guia de Instalação (Configuração de Provider) | [`docs/guide/installation.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/guide/installation.md) | 1-299 |
| Referência de Configuração (Resolução de Modelos) | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/configurations.md) | 391-512 |
| Schema de Configuração de Sobrescrita de Agente | [`src/config/schema.ts:AgentOverrideConfigSchema`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts#L98-L119) | 98-119 |
| Schema de Configuração de Categoria | [`src/config/schema.ts:CategoryConfigSchema`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts#L154-L172) | 154-172 |
| Documentação da Cadeia de Prioridade de Providers | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/configurations.md#L445-L473) | 445-473 |

**Constantes Principais**:
- Nenhuma: A cadeia de prioridade de Providers está codificada na documentação de configuração, não em constantes de código

**Funções Principais**:
- Nenhuma: A lógica de resolução de modelos é tratada pelo núcleo do OpenCode; o oh-my-opencode fornece definições de configuração e prioridade

</details>
