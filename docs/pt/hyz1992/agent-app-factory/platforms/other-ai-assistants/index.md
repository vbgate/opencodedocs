---
title: "OpenCode e Outros Assistentes de IA: 3 Maneiras de Executar o Pipeline | Tutorial do Agent App Factory"
sidebarTitle: "3 Maneiras de Executar"
subtitle: "OpenCode e Outros Assistentes de IA: 3 Maneiras de Executar o Pipeline"
description: "Aprenda como usar OpenCode, Cursor e outros assistentes de IA para executar o pipeline do Agent App Factory. Este tutorial detalha os métodos de início automático e manual para diferentes assistentes de IA, diferenças nos formatos de comandos, cenários aplicáveis e métodos de solução de problemas, ajudando desenvolvedores a escolher o assistente de IA mais adequado com base em seus hábitos pessoais e necessidades do projeto, completando de forma eficiente e rápida todo o processo de geração de aplicativos."
tags:
  - "Assistente de IA"
  - "OpenCode"
  - "Cursor"
  - "Execução de Pipeline"
prerequisite:
  - "start-installation"
order: 60
---

# OpenCode e Outros Assistentes de IA: 3 Maneiras de Executar o Pipeline

## O Que Você Poderá Fazer Após Este Módulo

- ✅ Usar o OpenCode para iniciar e executar o pipeline Factory
- ✅ Usar o Cursor para executar o pipeline
- ✅ Compreender as diferenças nos formatos de comandos entre diferentes assistentes de IA
- ✅ Escolher o assistente de IA adequado com base no cenário de uso

## O Seu Problema Atual

Você já inicializou o projeto Factory, mas além do Claude Code, não sabe como usar outros assistentes de IA para executar o pipeline. OpenCode e Cursor são assistentes de programação de IA populares. Eles podem executar o pipeline Factory? Quais são as diferenças nos métodos de início e formatos de comandos?

## Quando Usar Esta Estratégia

| Assistente de IA | Cenário Recomendado                          | Vantagens                     |
| ---------------- | --------------------------------------------- | ------------------------------ |
| **Claude Code**  | Precisa da experiência mais estável do modo Agent | Suporte nativo do modo Agent, formato de comando claro |
| **OpenCode**     | Usuários multiplataforma, precisam de ferramentas de IA flexíveis | Multiplataforma, suporta o modo Agent |
| **Cursor**       | Usuários pesados do VS Code, acostumados com o ecossistema VS Code | Alta integração, transição suave |

::: tip Princípio Fundamental
A lógica de execução de todos os assistentes de IA é idêntica: **ler a definição do Agent → executar o pipeline → gerar artefatos**. A diferença está apenas no método de início e formato de comandos.
:::

## 🎒 Preparação Antes de Começar

Antes de começar, certifique-se de:

- ✅ Ter completado a [Instalação e Configuração](../../start/installation/)
- ✅ Ter usado `factory init` para inicializar o projeto
- ✅ Ter instalado o OpenCode ou Cursor (pelo menos um)

## Ideia Central: Assistente de IA como Motor de Execução do Pipeline

O **Assistente de IA** é o motor de execução do pipeline, responsável por interpretar as definições do Agent e gerar artefatos. O fluxo de trabalho principal inclui cinco etapas: primeiro ler `.factory/pipeline.yaml` para entender a ordem das fases, depois carregar o scheduler para dominar as restrições de execução e regras de verificação de permissões, em seguida carregar os arquivos de definição do Agent correspondentes com base no estado atual, depois executar os comandos do Agent para gerar artefatos e verificar as condições de saída, e finalmente aguardar a confirmação do usuário para continuar para a próxima fase.

::: info Importante: O Assistente de IA Deve Suportar o Modo Agent
O pipeline Factory depende da capacidade do assistente de IA de entender e executar comandos Markdown complexos. Todos os assistentes de IA suportados (Claude Code, OpenCode, Cursor) possuem capacidade do modo Agent.
:::

## Siga-me

### Passo 1: Usar o OpenCode para Executar o Pipeline

#### Início Automático (Recomendado)

Se você já instalou o OpenCode CLI globalmente:

```bash
# Execute no diretório raiz do projeto
factory init
```

`factory init` detectará e iniciará automaticamente o OpenCode, passando o seguinte prompt:

```text
Por favor, leia .factory/pipeline.yaml e .factory/agents/orchestrator.checkpoint.md, inicie o pipeline, ajude-me a transformar fragmentos de ideias de produto em um aplicativo executável, em seguida eu vou inserir fragmentos de ideias. Nota: Arquivos skills/ e policies/ referenciados pelo Agent precisam ser procurados primeiro no diretório .factory/ e depois no diretório raiz.
```

**Você deverá ver**:
- Terminal exibindo `Starting OpenCode...`
- Janela do OpenCode abrindo automaticamente
- Prompt já colado automaticamente na caixa de entrada

#### Início Manual

Se o início automático falhar, você pode operar manualmente:

1. Abra o aplicativo OpenCode
2. Abra o diretório do seu projeto Factory
3. Copie o seguinte prompt para a caixa de entrada do OpenCode:

```text
Por favor, leia .factory/pipeline.yaml e .factory/agents/orchestrator.checkpoint.md, inicie o pipeline, ajude-me a transformar fragmentos de ideias de produto em um aplicativo executável, em seguida eu vou inserir fragmentos de ideias. Nota: Arquivos skills/ e policies/ referenciados pelo Agent precisam ser procurados primeiro no diretório .factory/ e depois no diretório raiz.
```

4. Pressione Enter para executar

#### Continuar Executando o Pipeline

Se o pipeline já está rodando em alguma fase, você pode usar o comando `factory run` para continuar:

```bash
# Verificar o estado atual e gerar comandos
factory run

# Ou começar a partir de uma fase específica
factory run prd
```

O OpenCode exibirá instruções semelhantes às do Claude Code:

```
🤖 AI Assistant Instructions:
──────────────────────────────────────────

This is an Agent Factory project. Please:

1. Read .factory/pipeline.yaml
2. Read .factory/agents/orchestrator.checkpoint.md
3. Read .factory/config.yaml
4. Execute pipeline from: bootstrap

Note: Check .factory/ first for skills/policies/ references, then root directory.
```

### Passo 2: Usar o Cursor para Executar o Pipeline

Cursor é um assistente de programação de IA baseado no VS Code, usando a funcionalidade Composer para executar o pipeline Factory.

#### Detectar Cursor

O Factory CLI detectará automaticamente o ambiente Cursor (através das variáveis de ambiente `CURSOR` ou `CURSOR_API_KEY`).

#### Usar Composer para Executar

1. Abra o diretório do seu projeto Factory no Cursor
2. Execute o comando `factory run`:

```bash
factory run
```

3. O terminal exibirá instruções específicas para o Cursor:

```
🤖 Cursor Instructions:
──────────────────────────────────────────

This is an Agent Factory project. Use Cursor Composer to:

1. @ReadFile .factory/pipeline.yaml
2. @ReadFile .factory/agents/orchestrator.checkpoint.md
3. @ReadFile .factory/config.yaml
   (Note: Check .factory/ first for skills/policies/ references)
4. Execute pipeline from: bootstrap
```

4. Copie estas instruções para a caixa de entrada do Cursor Composer
5. Execute

#### Ponto de Verificação ✅

- Janela do Cursor Composer aberta
- Pipeline começou a executar, exibindo a fase atual (como `Running: bootstrap`)
- Artefatos gerados (como `input/idea.md`)
### Passo 3: Compreender os Diferentes Formatos de Comandos dos Assistentes de IA

Embora a lógica de execução seja idêntica, existem pequenas diferenças nos formatos de comandos entre diferentes assistentes de IA:

| Operação          | Formato do Claude Code | Formato do Cursor | Outros Assistentes de IA (OpenCode, etc.) |
| ----------------- | ---------------------- | ------------------ | ----------------------------------------- |
| Ler arquivo       | `Read(filePath)`       | `@ReadFile filePath` | `Read filePath`                         |
| Ler múltiplos arquivos | `Read(file1)`, `Read(file2)` | `@ReadFile file1`, `@ReadFile file2` | - |
| Escrever arquivo  | `Write(filePath, content)` | Escrita direta     | - |
| Executar comando Bash | `Bash(command)`        | Execução direta    | - |

::: tip Factory CLI Processa Automaticamente
Quando você executa `factory run`, o CLI detectará automaticamente o tipo de assistente de IA atual e gerará o formato de comando correspondente. Você só precisa copiar e colar, sem conversão manual.
:::

### Passo 4: Continuar a Executar a Partir de uma Fase Específica

Se o pipeline já completou as primeiras fases, você pode continuar a partir de qualquer fase:

```bash
# Começar a partir da fase UI
factory run ui

# Começar a partir da fase Tech
factory run tech

# Começar a partir da fase Code
factory run code
```

O Factory CLI exibirá o estado atual do pipeline:

```
Pipeline Status:
──────────────────────
Project: my-app
Status: Running
Current Stage: ui
Completed: bootstrap, prd

Available stages:
  ✓ bootstrap
  ✓ prd
  → ui
  ○ tech
  ○ code
  ○ validation
  ○ preview
```

### Passo 5: Usar factory continue para Economizar Tokens (Apenas Claude Code)

::: warning Atenção
O comando `factory continue` atualmente suporta apenas **Claude Code**. Se você usar OpenCode ou Cursor, use `factory run` diretamente para iniciar uma nova sessão manualmente.
:::

Para economizar tokens e evitar acúmulo de contexto, o Claude Code suporta execução em múltiplas sessões:

```bash
# Abra uma nova janela de terminal e execute
factory continue
```

**Efeito de Execução**:
- Lê o estado atual (`.factory/state.json`)
- Inicia automaticamente uma nova janela do Claude Code
- Continua a partir da fase onde parou pela última vez

**Cenários Aplicáveis**:
- Completou Bootstrap → PRD, quer criar uma nova sessão para executar a fase UI
- Completou UI → Tech, quer criar uma nova sessão para executar a fase Code
- Qualquer cenário que precise evitar histórico de conversas longas

## Cuidados com Armadilhas

### Problema 1: Falha no Início do OpenCode

**Sintoma**: Após executar `factory init`, o OpenCode não inicia automaticamente.

**Causa**:
- OpenCode CLI não foi adicionado ao PATH
- OpenCode não está instalado

**Solução**:

```bash
# Iniciar o OpenCode manualmente
# Windows
%LOCALAPPDATA%\Programs\OpenCode\OpenCode.exe

# macOS
/Applications/OpenCode.app

# Linux (procura por prioridade: primeiro /usr/bin/opencode, depois /usr/local/bin/opencode)
/usr/bin/opencode
# Se o caminho acima não existir, tente:
/usr/local/bin/opencode
```

Em seguida, copie o prompt manualmente e cole no OpenCode.

### Problema 2: Cursor Composer Não Reconhece Comandos

**Sintoma**: Copiar os comandos gerados por `factory run` para o Cursor Composer, mas não há resposta.

**Causa**:
- A sintaxe `@ReadFile` do Cursor Composer precisa corresponder exatamente
- O caminho do arquivo pode estar incorreto

**Solução**:
1. Confirme o uso de `@ReadFile` em vez de `Read` ou `ReadFile`
2. Confirme que o caminho do arquivo é relativo ao diretório raiz do projeto
3. Tente usar o caminho absoluto

**Exemplo**:

```text
# ✅ Correto
@ReadFile .factory/pipeline.yaml

# ❌ Incorreto
Read(.factory/pipeline.yaml)
@readfile .factory/pipeline.yaml
```

### Problema 3: Falha na Referência de Arquivos de Habilidades pelo Agent

**Sintoma**: O Agent reporta erro não encontrando `skills/bootstrap/skill.md` ou `policies/failure.policy.md`.

**Causa**:
- Ordem incorreta de caminho de busca do Agent
- O projeto contém simultaneamente `.factory/` e `skills/`, `policies/` no diretório raiz

**Solução**:
Todos os assistentes de IA seguem a mesma ordem de busca:

1. **Buscar primeiro** `.factory/skills/` e `.factory/policies/`
2. **Voltar ao diretório raiz** `skills/` e `policies/`

Certifique-se de:
- Após a inicialização do projeto Factory, `skills/` e `policies/` foram copiados para `.factory/`
- Na definição do Agent, é claramente indicado: "buscar primeiro no diretório `.factory/`, depois no diretório raiz"

### Problema 4: Estado do Pipeline Não Sincronizado

**Sintoma**: O assistente de IA mostra que uma fase foi completada, mas `factory run` ainda exibe o estado `running`.

**Causa**:
- O assistente de IA atualizou manualmente `state.json`, mas está inconsistente com o estado do CLI
- Pode ser múltiplas janelas modificando simultaneamente o arquivo de estado

**Solução**:
```bash
# Redefinir o estado do projeto
factory reset

# Executar novamente o pipeline
factory run
```

::: warning Melhor Prática
Evite executar o pipeline do mesmo projeto simultaneamente em múltiplas janelas de assistentes de IA. Isso causará conflitos de estado e sobrescrita de artefatos.
:::

## Resumo da Lição

Nesta lição, aprendemos como usar OpenCode, Cursor e outros assistentes de IA para executar o pipeline Factory:

**Pontos Principais**:
- ✅ Factory suporta múltiplos assistentes de IA (Claude Code, OpenCode, Cursor)
- ✅ `factory init` detecta e inicia automaticamente os assistentes de IA disponíveis
- ✅ `factory run` gera comandos correspondentes com base no assistente de IA atual
- ✅ `factory continue` (apenas Claude Code) suporta execução em múltiplas sessões, economizando tokens
- ✅ Todos os assistentes de IA seguem a mesma lógica de execução, apenas os formatos de comandos são diferentes

**Arquivos Chave**:
- `.factory/pipeline.yaml` — Definição do pipeline
- `.factory/agents/orchestrator.checkpoint.md` — Regras do scheduler
- `.factory/state.json` — Estado do pipeline

**Recomendações de Escolha**:
- Claude Code: Experiência mais estável do modo Agent (recomendado)
- OpenCode: Primeira escolha para usuários multiplataforma
- Cursor: Usuários pesados do VS Code

## Próxima Lição

> Na próxima lição, aprenderemos **[Instalação de Plugins Obrigatórios](../plugins/)**.
>
> Você aprenderá:
> - Por que precisa instalar os plugins superpowers e ui-ux-pro-max
> - Como instalar plugins automaticamente ou manualmente
> - Métodos de tratamento quando a instalação de plugins falhar

---

## Apêndice: Referência de Código-fonte

<details>
<summary><strong>Clique para expandir e ver as localizações do código-fonte</strong></summary>

> Tempo de atualização: 2026-01-29

| Funcionalidade     | Caminho do Arquivo                                                                                     | Linha  |
| ------------------ | ------------------------------------------------------------------------------------------------------ | ------ |
| Início do OpenCode   | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L152-L215) | 152-215 |
| Início do Claude Code | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L119-L147) | 119-147 |
| Detecção de Assistente de IA   | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js#L105-L124)     | 105-124 |
| Geração de Comandos     | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js#L130-L183)     | 130-183 |

**Constantes Chave**:
- `CLAUDE_CODE` / `ANTHROPIC_API_KEY`: Detecção de variáveis de ambiente do Claude Code (run.js:109-110)
- `CURSOR` / `CURSOR_API_KEY`: Detecção de variáveis de ambiente do Cursor (run.js:114-115)
- `OPENCODE` / `OPENCODE_VERSION`: Detecção de variáveis de ambiente do OpenCode (run.js:119-120)

**Funções Chave**:
- `launchClaudeCode(projectDir)`: Inicia o Claude Code e passa o prompt (init.js:119-147)
- `launchOpenCode(projectDir)`: Inicia o OpenCode, suporta dois métodos: CLI e executável (init.js:152-215)
- `detectAIAssistant()`: Detecta o tipo de assistente de IA atual através de variáveis de ambiente (run.js:105-124)
- `getAssistantInstructions(assistant, ...)`: Gera comandos correspondentes com base no tipo de assistente de IA (run.js:130-183)

</details>
