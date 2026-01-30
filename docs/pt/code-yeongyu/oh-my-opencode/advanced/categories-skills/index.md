---
title: "Categories e Skills: Composição Dinâmica de Agentes | oh-my-opencode"
sidebarTitle: "Agentes Dinâmicos como Blocos de Construção"
subtitle: "Categories e Skills: Composição Dinâmica de Agentes (v3.0)"
description: "Aprenda o sistema de Categories e Skills do oh-my-opencode, domine como combinar modelos e conhecimento para criar subagentes de IA especializados. Com 7 Categories, 4 Skills integrados e a ferramenta delegate_task, otimize os custos de desenvolvimento."
tags:
  - "categories"
  - "skills"
  - "delegate-task"
  - "sisyphus-junior"
prerequisite:
  - "start-quick-start"
order: 100
---

# Categories e Skills: Composição Dinâmica de Agentes (v3.0)

## O Que Você Poderá Fazer Após Este Tutorial

- ✅ Usar 7 Categories integradas para selecionar automaticamente o melhor modelo para diferentes tipos de tarefas
- ✅ Carregar 4 Skills integradas para injetar conhecimento profissional e ferramentas MCP nos agentes
- ✅ Combinar Category e Skill através de `delegate_task` para criar subagentes especializados
- ✅ Personalizar Categories e Skills para atender às necessidades específicas do projeto

## Seu Dilema Atual

**Seus agentes não são profissionais o suficiente? Os custos estão muito altos?**

Pense neste cenário:

| Problema | Solução Tradicional | Necessidade Real |
|---|---|---|
| **Tarefas de UI usando modelo superpotente** | Usar Claude Opus para ajustes simples de estilo | Custos altos, desperdício de poder de processamento |
| **Lógica complexa usando modelo leve** | Usar Haiku para design de arquitetura | Capacidade de raciocínio insuficiente, soluções incorretas |
| **Estilo de commits Git inconsistente** | Gerenciamento manual de commits, propenso a erros | Necessidade de detecção automática e conformidade com padrões do projeto |
| **Necessidade de testes em navegador** | Abertura manual do navegador para verificação | Necessidade de suporte a ferramentas MCP do Playwright |

**Problemas Core**:
1. Todas as tarefas são processadas por um único agente → modelos e ferramentas incompatíveis
2. 10 agentes fixos codificados manualmente → sem flexibilidade para combinação dinâmica
3. Falta de conhecimento profissional → agentes carecem de expertise em domínios específicos

**Solução**: O sistema de Categories e Skills v3.0 permite que você monte agentes como blocos de construção:
- **Category** (Abstração de Modelo): Define o tipo de tarefa → seleciona automaticamente o melhor modelo
- **Skill** (Conhecimento Profissional): Injeção de conhecimento de domínio e ferramentas MCP → torna o agente mais profissional

## Quando Usar Esta Técnica

| Cenário | Combinação Recomendada | Efeito |
|---|---|---|
| **Design e implementação de UI** | `category="visual-engineering"` + `skills=["frontend-ui-ux", "playwright"]` | Seleciona automaticamente Gemini 3 Pro + mentalidade de designer + verificação em navegador |
| **Correções rápidas e commits** | `category="quick"` + `skills=["git-master"]` | Conclui com baixo custo usando Haiku + detecção automática de estilo de commit |
| **Análise de arquitetura profunda** | `category="ultrabrain"` + `skills=[]` | Usa GPT-5.2 Codex (xhigh) para raciocínio puro |
| **Escrita de documentação** | `category="writing"` + `skills=[]` | Usa Gemini 3 Flash para geração rápida de documentos |

## 🎒 Preparação Antes de Começar

::: warning Pré-requisitos

Antes de iniciar este tutorial, certifique-se de:
1. Ter instalado o oh-my-opencode (veja o [tutorial de instalação](../../start/installation/))
2. Ter configurado pelo menos um Provider (veja [Configuração de Provider](../../platforms/provider-setup/))
3. Compreender o uso básico da ferramenta `delegate_task` (veja [Tarefas Paralelas em Segundo Plano](../background-tasks/))

:::

::: info Conceitos Chave
**Category** é "que tipo de trabalho é este" (determina modelo, temperatura, modo de pensamento), **Skill** é "que conhecimento e ferramentas profissionais são necessários" (injeta prompts e servidores MCP). Combine ambos através de `delegate_task(category=..., skills=[...])`.
:::

## Ideia Core

### Categories: Tipo de Tarefa Determina o Modelo

O oh-my-opencode oferece 7 Categories integradas, cada uma pré-configurada com o melhor modelo e modo de pensamento:

| Category | Modelo Padrão | Temperature | Uso |
|---|---|---|---|
| `visual-engineering` | `google/gemini-3-pro` | 0.7 | Frontend, UI/UX, tarefas de design |
| `ultrabrain` | `openai/gpt-5.2-codex` (xhigh) | 0.1 | Tarefas de alto raciocínio (decisões de arquitetura complexa) |
| `artistry` | `google/gemini-3-pro` (max) | 0.7 | Tarefas criativas e artísticas (ideias novas) |
| `quick` | `anthropic/claude-haiku-4-5` | 0.1 | Tarefas rápidas, baixo custo (modificação de arquivo único) |
| `unspecified-low` | `anthropic/claude-sonnet-4-5` | 0.1 | Tarefas médias que não se encaixam em outras categories |
| `unspecified-high` | `anthropic/claude-opus-4-5` (max) | 0.1 | Tarefas de alta qualidade que não se encaixam em outras categories |
| `writing` | `google/gemini-3-flash` | 0.1 | Tarefas de documentação e escrita |

**Por que precisamos de Categories?**

Diferentes tarefas requerem modelos com diferentes capacidades:
- Design de UI → precisa de **criatividade visual** (Gemini 3 Pro)
- Decisões de arquitetura → precisa de **raciocínio profundo** (GPT-5.2 Codex xhigh)
- Modificações simples → precisa de **resposta rápida** (Claude Haiku)

Selecionar manualmente o modelo para cada tarefa é tedioso; Categories permitem que você simplesmente declare o tipo de tarefa, e o sistema seleciona automaticamente o melhor modelo.

### Skills: Injeção de Conhecimento Profissional

Skill é um especialista de domínio definido através de um arquivo SKILL.md, capaz de injetar:
- **Conhecimento profissional** (extensão de prompts)
- **Servidores MCP** (carregamento automático)
- **Guias de fluxo de trabalho** (etapas específicas de operação)

4 Skills integradas:

| Skill | Função | MCP | Uso |
|---|---|---|---|
| `playwright` | Automação de navegador | `@playwright/mcp` | Validação de UI, screenshots, web scraping |
| `agent-browser` | Automação de navegador (Vercel) | Instalação manual | Mesmo que acima, alternativa |
| `frontend-ui-ux` | Mentalidade de designer | Nenhum | Criar interfaces elegantes |
| `git-master` | Especialista em Git | Nenhum | Commits automáticos, busca de histórico, rebase |

**Como Skills funcionam:**

Quando você carrega uma Skill, o sistema irá:
1. Ler o conteúdo de prompts do arquivo SKILL.md
2. Se MCP estiver definido, iniciar automaticamente o servidor correspondente
3. Anexar o prompt da Skill ao prompt do sistema do agente

Por exemplo, a Skill `git-master` inclui:
- Detecção de estilo de commit (identificação automática do formato do projeto)
- Regras de commits atômicos (3 arquivos → mínimo 2 commits)
- Fluxo de trabalho Rebase (squash, fixup, resolução de conflitos)
- Busca de histórico (blame, bisect, log -S)

### Sisyphus Junior: Executor de Tarefas

Quando você usa uma Category, um subagente especial é gerado — **Sisyphus Junior**.

**Características-chave**:
- ✅ Herda a configuração de modelo da Category
- ✅ Herda os prompts das Skills carregadas
- ❌ **Não pode delegar novamente** (proibido usar ferramentas `task` e `delegate_task`)

**Por que proibir delegação adicional?**

Prevenir loops infinitos e divergência de tarefas:
```
Sisyphus (Agente Principal)
  ↓ delegate_task(category="quick")
Sisyphus Junior
  ↓ tenta delegate_task (se permitido)
Sisyphus Junior 2
  ↓ delegate_task
...loop infinito...
```

Ao proibir delegação adicional, Sisyphus Junior se concentra em completar a tarefa atribuída, garantindo objetivos claros e execução eficiente.

## Siga Comigo

### Passo 1: Correção Rápida (Quick + Git Master)

Vamos usar um cenário real: você modificou alguns arquivos e precisa fazer commits automáticos seguindo o estilo do projeto.

**Por quê**
Usando a Category `quick` com o modelo Haiku de baixo custo, combinado com a Skill `git-master` para detecção automática de estilo de commit, você obtém commits perfeitos.

No OpenCode, digite:

```
Use delegate_task para fazer commit das alterações atuais
- category: quick
- load_skills: ["git-master"]
- prompt: "Faça commit de todas as alterações de código atuais. Siga o estilo de commit do projeto (detectado através de git log). Garanta commits atômicos, um commit com no máximo 3 arquivos."
- run_in_background: false
```

**Você deverá ver**:

1. Sisyphus Junior iniciar, usando o modelo `claude-haiku-4-5`
2. Skill `git-master` carregada, prompt contendo conhecimento especializado em Git
3. O agente executará as seguintes operações:
   ```bash
   # Coletando contexto em paralelo
   git status
   git diff --stat
   git log -30 --oneline
   ```
4. Detectar o estilo de commit (como Semantic vs Plain vs Short)
5. Planejar commits atômicos (3 arquivos → pelo menos 2 commits)
6. Executar commits, seguindo o estilo detectado

**Checkpoint ✅**:

Verifique se o commit foi bem-sucedido:
```bash
git log --oneline -5
```

Você deverá ver vários commits atômicos, cada um com uma mensagem clara seguindo o estilo.

### Passo 2: Implementação e Validação de UI (Visual + Playwright + UI/UX)

Cenário: você precisa adicionar um componente de gráfico responsivo a uma página e realizar validação no navegador.

**Por quê**
- Category `visual-engineering` seleciona Gemini 3 Pro (especialista em design visual)
- Skill `playwright` fornece ferramentas MCP para testes no navegador
- Skill `frontend-ui-ux` injeta mentalidade de designer (cores, tipografia, animações)

No OpenCode, digite:

```
Use delegate_task para implementar o componente de gráfico
- category: visual-engineering
- load_skills: ["frontend-ui-ux", "playwright"]
- prompt: "Adicione um componente de gráfico responsivo na página do dashboard. Requisitos:
  - Use Tailwind CSS
  - Suporte para mobile e desktop
  - Use um esquema de cores vibrantes (evite gradientes roxos)
  - Adicione efeitos de animação escalonada
  - Após concluir, use o playwright para capturar screenshot e validar"
- run_in_background: false
```

**Você deverá ver**:

1. Sisyphus Junior iniciar, usando o modelo `google/gemini-3-pro`
2. Dois Skills carregados com seus prompts:
   - `frontend-ui-ux`: guia de mentalidade de designer
   - `playwright`: instruções de automação de navegador
3. Servidor `@playwright/mcp` iniciado automaticamente
4. O agente executará:
   - Projetar o componente de gráfico (aplicando mentalidade de designer)
   - Implementar layout responsivo
   - Adicionar efeitos de animação
   - Usar ferramentas do Playwright:
     ```
     playwright_navigate: http://localhost:3000/dashboard
     playwright_take_screenshot: output=dashboard-chart.png
     ```

**Checkpoint ✅**:

Verifique se o componente está renderizando corretamente:
```bash
# Verificar novos arquivos
git diff --name-only
git diff --stat

# Ver screenshots
ls screenshots/
```

Você deverá ver:
- Novo arquivo de componente de gráfico
- Código de estilo responsivo
- Arquivo de screenshot (validação aprovada)

### Passo 3: Análise Profunda de Arquitetura (Ultrabrain Puro)

Cenário: você precisa projetar um padrão de comunicação complexo para arquitetura de microsserviços.

**Por quê**
- Category `ultrabrain` seleciona GPT-5.2 Codex (xhigh), fornecendo a capacidade de raciocínio mais forte
- Não carregar Skills → raciocínio puro, evitando interferência de conhecimento profissional

No OpenCode, digite:

```
Use delegate_task para analisar arquitetura
- category: ultrabrain
- load_skills: []
- prompt: "Projete um padrão de comunicação eficiente para nossa arquitetura de microsserviços. Requisitos:
  - Suportar descoberta de serviços
  - Lidar com partições de rede
  - Minimizar latência
  - Fornecer estratégias de degradação

  Arquitetura atual: [descrição breve]
  Stack tecnológica: gRPC, Kubernetes, Consul"
- run_in_background: false
```

**Você deverá ver**:

1. Sisyphus Junior iniciar, usando o modelo `openai/gpt-5.2-codex` (variante xhigh)
2. Nenhuma Skill carregada
3. O agente realiza raciocínio profundo:
   - Analisar arquitetura existente
   - Comparar padrões de comunicação (como CQRS, Event Sourcing, Saga)
   - Pesar prós e contras
   - Fornecer recomendações em camadas (Bottom Line → Plano de Ação → Riscos)

**Estrutura de Saída**:

```
Bottom Line: Recomendação de usar padrão híbrido (gRPC + Event Bus)

Plano de Ação:
1. Use gRPC para comunicação síncrona entre serviços
2. Publique eventos críticos de forma assíncrona via Event Bus
3. Implemente processamento idempotente para mensagens duplicadas

Riscos e Mitigações:
- Risco: Perda de mensagens devido a partições de rede
  Mitigação: Implemente retentativas de mensagens e filas de mensagens mortas
```

**Checkpoint ✅**:

Verifique se a solução é abrangente:
- A descoberta de serviços foi considerada?
- As partições de rede foram tratadas?
- As estratégias de degradação foram fornecidas?

### Passo 4: Category Personalizada (Opcional)

Se as Categories integradas não atenderem às suas necessidades, você pode personalizar em `oh-my-opencode.json`.

**Por quê**
Alguns projetos precisam de configurações de modelo específicas (como Korean Writer, Deep Reasoning).

Edite `~/.config/opencode/oh-my-opencode.json`:

```jsonc
{
  "categories": {
    "korean-writer": {
      "model": "google/gemini-3-flash",
      "temperature": 0.5,
      "prompt_append": "You are a Korean technical writer. Maintain a friendly and clear tone."
    },
    
    "deep-reasoning": {
      "model": "anthropic/claude-opus-4-5",
      "thinking": {
        "type": "enabled",
        "budgetTokens": 32000
      },
      "tools": {
        "websearch_web_search_exa": false
      }
    }
  }
}
```

**Descrição dos Campos**:

| Campo | Tipo | Descrição |
|---|---|---|
| `model` | string | Substitui o modelo usado pela Category |
| `temperature` | number | Nível de criatividade (0-2) |
| `prompt_append` | string | Conteúdo anexado ao prompt do sistema |
| `thinking` | object | Configuração de Thinking (`{ type, budgetTokens }`) |
| `tools` | object | Desativação de permissões de ferramentas (`{ toolName: false }`) |

**Checkpoint ✅**:

Verifique se a Category personalizada está funcionando:
```bash
# Usar Category personalizada
delegate_task(category="korean-writer", load_skills=[], prompt="...")
```

Você deverá ver o sistema usando o modelo e prompt configurados.

## Armadilhas Comuns

### Armadilha 1: Prompts Category Quick Muito Vagos

**Problema**: A Category `quick` usa o modelo Haiku, com capacidade de raciocínio limitada. Se o prompt for muito vago, os resultados serão ruins.

**Exemplo Errado**:
```
delegate_task(category="quick", load_skills=["git-master"], prompt="fazer commit das alterações")
```

**Maneira Correta**:
```
TASK: Fazer commit de todas as alterações de código atuais

MUST DO:
1. Detectar o estilo de commit do projeto (através de git log -30)
2. Dividir 8 arquivos em 3+ commits atômicos por diretório
3. Cada commit com no máximo 3 arquivos
4. Seguir o estilo detectado (Semantic/Plain/Short)

MUST NOT DO:
- Mesclar arquivos de diretórios diferentes no mesmo commit
- Pular o planejamento de commits e executar diretamente

EXPECTED OUTPUT:
- Múltiplos commits atômicos
- Cada mensagem de commit combinando com o estilo do projeto
- Seguir ordem de dependências (definições de tipos → implementação → testes)
```

### Armadilha 2: Esquecer de Especificar `load_skills`

**Problema**: `load_skills` é um **parâmetro obrigatório**, não especificar resultará em erro.

**Erro**:
```
delegate_task(category="quick", prompt="...")
```

**Saída de Erro**:
```
Error: Invalid arguments: 'load_skills' parameter is REQUIRED.
Pass [] if no skills needed, but IT IS HIGHLY RECOMMENDED to pass proper skills.
```

**Maneira Correta**:
```
# Não precisa de Skill, passe array vazio explicitamente
delegate_task(category="unspecified-low", load_skills=[], prompt="...")
```

### Armadilha 3: Category e subagent_type Especificados Simultaneamente

**Problema**: Estes dois parâmetros são mutuamente exclusivos, não podem ser especificados ao mesmo tempo.

**Erro**:
```
delegate_task(
  category="quick",
  subagent_type="oracle",  # ❌ Conflito
  ...
)
```

**Maneira Correta**:
```
# Usar Category (recomendado)
delegate_task(category="quick", load_skills=[], prompt="...")

# Ou especificar o agente diretamente
delegate_task(subagent_type="oracle", load_skills=[], prompt="...")
```

### Armadilha 4: Regras de Múltiplos Commits do Git Master

**Problema**: A Skill `git-master` **exige obrigatoriamente múltiplos commits**, 1 commit com 3+ arquivos falhará.

**Erro**:
```
# Tentar 1 commit com 8 arquivos
git commit -m "Update landing page"  # ❌ git-master vai recusar
```

**Maneira Correta**:
```
# Dividir em múltiplos commits por diretório
git add app/page.tsx app/layout.tsx
git commit -m "Add app layer"  # ✅ Commit 1

git add components/demo/*
git commit -m "Add demo components"  # ✅ Commit 2

git add e2e/*
git commit -m "Add tests"  # ✅ Commit 3
```

### Armadilha 5: Skill Playwright sem MCP Instalado

**Problema**: Antes de usar a Skill `playwright`, você precisa garantir que o servidor MCP esteja disponível.

**Erro**:
```
delegate_task(category="visual-engineering", load_skills=["playwright"], prompt="screenshot...")
```

**Maneira Correta**:

Verifique a configuração MCP (`~/.config/opencode/mcp.json` ou `.claude/.mcp.json`):

```jsonc
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

Se o Playwright MCP não estiver configurado, a Skill `playwright` irá iniciá-lo automaticamente.

## Resumo da Lição

O sistema de Categories e Skills permite que você combine agentes de forma flexível:

| Componente | Função | Método de Configuração |
|---|---|---|
| **Category** | Determina modelo e modo de pensamento | `delegate_task(category="...")` ou arquivo de configuração |
| **Skill** | Injeta conhecimento profissional e MCP | `delegate_task(load_skills=["..."])` ou arquivo SKILL.md |
| **Sisyphus Junior** | Executa tarefas, não pode delegar novamente | Gerado automaticamente, sem especificação manual necessária |

**Estratégias de Combinação**:
1. **Tarefas de UI**: `visual-engineering` + `frontend-ui-ux` + `playwright`
2. **Correções rápidas**: `quick` + `git-master`
3. **Raciocínio profundo**: `ultrabrain` (sem Skill)
4. **Escrita de documentação**: `writing` (sem Skill)

**Melhores Práticas**:
- ✅ Sempre especifique `load_skills` (mesmo que seja array vazio)
- ✅ Prompts para Category `quick` devem ser claros (Haiku tem capacidade de raciocínio limitada)
- ✅ Tarefas Git sempre usem Skill `git-master` (detecção automática de estilo)
- ✅ Tarefas de UI sempre usem Skill `playwright` (validação no navegador)
- ✅ Escolha a Category apropriada para o tipo de tarefa (em vez de usar o agente principal por padrão)

## Próxima Lição

> Na próxima lição, aprenderemos sobre **[Skills Integradas: Automação de Navegador, Especialista em Git e Designer de UI](../builtin-skills/)**.
>
> Você aprenderá:
> - O fluxo de trabalho detalhado da Skill `playwright`
> - Os 3 modos da Skill `git-master` (Commit/Rebase/Busca de Histórico)
> - A filosofia de design da Skill `frontend-ui-ux`
> - Como criar uma Skill personalizada

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-26

| Função | Caminho do Arquivo | Linha |
|---|---|---|
| Implementação da ferramenta delegate_task | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | Completo (1070 linhas) |
| Função resolveCategoryConfig | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | 113-152 |
| Função buildSystemContent | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | 176-188 |
| Configuração padrão das Categories | [`src/tools/delegate-task/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/constants.ts) | 158-166 |
| Anexos de prompts das Categories | [`src/tools/delegate-task/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/constants.ts) | 168-176 |
| Descrições das Categories | [`src/tools/delegate-task/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/constants.ts) | 178-186 |
| Schema de configuração da Category | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 154-172 |
| Definição das Skills integradas | [`src/features/builtin-skills/`](https://github.com/code-yeongyu/oh-my-opencode/tree/main/src/features/builtin-skills) | Estrutura de diretórios |
| Prompt da Skill git-master | [`src/features/builtin-skills/git-master/SKILL.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/git-master/SKILL.md) | Completo (1106 linhas) |

**Constantes-chave**:
- `SISYPHUS_JUNIOR_AGENT = "sisyphus-junior"`: Agente executor para delegação de Category
- `DEFAULT_CATEGORIES`: Configurações de modelo das 7 Categories integradas
- `CATEGORY_PROMPT_APPENDS`: Anexos de prompts para cada Category
- `CATEGORY_DESCRIPTIONS`: Descrições de cada Category (exibidas no prompt do delegate_task)

**Funções-chave**:
- `resolveCategoryConfig()`: Analisa configuração de Category, mesclando substituições do usuário e padrões
- `buildSystemContent()`: Mescla conteúdo de prompts de Skill e Category
- `createDelegateTask()`: Cria definição da ferramenta delegate_task

**Arquivos das Skills integradas**:
- `src/features/builtin-skills/frontend-ui-ux/SKILL.md`: Prompt de mentalidade de designer
- `src/features/builtin-skills/git-master/SKILL.md`: Fluxo de trabalho completo especialista em Git
- `src/features/builtin-skills/agent-browser/SKILL.md`: Configuração do Vercel agent-browser
- `src/features/builtin-skills/dev-browser/SKILL.md`: Documentação de referência de automação de navegador

</details>
