---
title: "Solução de Problemas de Agentes: Diagnóstico e Reparo | Everything Claude Code"
sidebarTitle: "O que fazer quando o Agente falha"
subtitle: "Solução de Problemas de Agentes: Diagnóstico e Reparo"
description: "Aprenda métodos de solução de problemas para falhas de chamada de Agentes do Everything Claude Code. Abrange o diagnóstico e resolução de problemas comuns como Agentes não carregados, erros de configuração, permissões de ferramentas insuficientes, tempo limite de chamada, ajudando você a dominar técnicas de depuração sistemáticas."
tags:
  - "agents"
  - "troubleshooting"
  - "faq"
prerequisite:
  - "platforms-agents-overview"
order: 170
---

# Solução de Problemas de Falhas de Chamadas de Agentes

## O Problema que Você Encontra

Encontrando dificuldades ao usar Agentes? Você pode encontrar os seguintes cenários:

- Digita `/plan` ou outros comandos, mas o Agente não é chamado
- Vê a mensagem de erro: "Agent not found"
- O Agente atinge o tempo limite de execução ou trava
- A saída do Agente não corresponde ao esperado
- O Agente não funciona de acordo com as regras

Não se preocupe, esses problemas geralmente têm soluções claras. Esta lição ajuda você a diagnosticar e reparar sistematicamente problemas relacionados a Agentes.

## 🎒 Preparativos Antes de Começar

::: warning Verificação Prévia
Certifique-se de que você:
1. ✅ Completou a [instalação](../../start/installation/) do Everything Claude Code
2. ✅ Entende os [conceitos de Agentes](../../platforms/agents-overview/) e os 9 sub-agentes especializados
3. ✅ Tentou chamar Agentes (como `/plan`, `/tdd`, `/code-review`)
:::

---

## Problema Comum 1: Agente Nunca é Chamado

### Sintoma
Digita `/plan` ou outros comandos, mas o Agente não é acionado, apenas conversa normal.

### Possíveis Causas

#### Causa A: Caminho do Arquivo do Agente Incorreto

**Problema**: O arquivo do Agente não está no local correto, o Claude Code não consegue encontrá-lo.

**Solução**:

Verifique se o local do arquivo do Agente está correto:

```bash
# Deve estar em um dos seguintes locais:
~/.claude/agents/              # Configuração de nível de usuário (global)
.claude/agents/                 # Configuração de nível de projeto
```

**Método de Verificação**:

```bash
# Verificar configuração de nível de usuário
ls -la ~/.claude/agents/

# Verificar configuração de nível de projeto
ls -la .claude/agents/
```

**Deve ver 9 arquivos de Agente**:
- `planner.md`
- `architect.md`
- `tdd-guide.md`
- `code-reviewer.md`
- `security-reviewer.md`
- `build-error-resolver.md`
- `e2e-runner.md`
- `refactor-cleaner.md`
- `doc-updater.md`

**Se os arquivos não existirem**, copie do diretório do plugin Everything Claude Code:

```bash
# Supondo que o plugin esteja instalado em ~/.claude-plugins/
cp ~/.claude-plugins/everything-claude-code/agents/*.md ~/.claude/agents/

# Ou copie do repositório clonado
cp everything-claude-code/agents/*.md ~/.claude/agents/
```

#### Causa B: Arquivo de Comando Ausente ou Caminho Incorreto

**Problema**: O arquivo de Comando (como `plan.md` correspondente a `/plan`) não existe ou o caminho está incorreto.

**Solução**:

Verifique o local do arquivo de Comando:

```bash
# Commands devem estar em um dos seguintes locais:
~/.claude/commands/             # Configuração de nível de usuário (global)
.claude/commands/                # Configuração de nível de projeto
```

**Método de Verificação**:

```bash
# Verificar configuração de nível de usuário
ls -la ~/.claude/commands/

# Verificar configuração de nível de projeto
ls -la .claude/commands/
```

**Deve ver 14 arquivos de Comando**:
- `plan.md` → chama o agente `planner`
- `tdd.md` → chama o agente `tdd-guide`
- `code-review.md` → chama o agente `code-reviewer`
- `build-fix.md` → chama o agente `build-error-resolver`
- `e2e.md` → chama o agente `e2e-runner`
- e por aí vai...

**Se os arquivos não existirem**, copie os arquivos de Comando:

```bash
cp ~/.claude-plugins/everything-claude-code/commands/*.md ~/.claude/commands/
```

#### Causa C: Plugin Não Carregado Corretamente

**Problema**: Instalado através do marketplace de plugins, mas o plugin não foi carregado corretamente.

**Solução**:

Verifique a configuração do plugin em `~/.claude/settings.json`:

```bash
# Verificar configuração do plugin
cat ~/.claude/settings.json | jq '.enabledPlugins'
```

**Deve ver**:

```json
{
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

**Se não estiver habilitado**, adicione manualmente:

```bash
# Editar settings.json
nano ~/.claude/settings.json

# Adicionar ou modificar o campo enabledPlugins
{
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

**Reinicie o Claude Code para que a configuração entre em vigor**.

---

## Problema Comum 2: Agente Relata Erro "Agent not found"

### Sintoma
Após digitar o comando, vê a mensagem de erro: "Agent not found" ou "Could not find agent: xxx".

### Possíveis Causas

#### Causa A: Nome do Agente no Arquivo de Comando Não Correspondente

**Problema**: O campo `invokes` no arquivo de Comando não corresponde ao nome do arquivo do Agente.

**Solução**:

Verifique o campo `invokes` no arquivo de Comando:

```bash
# Verificar um arquivo de Comando
cat ~/.claude/commands/plan.md | grep -A 5 "invokes"
```

**Estrutura do Arquivo de Comando** (exemplo com `plan.md`):

```markdown
---
description: Restate requirements, assess risks, and create step-by-step implementation plan. WAIT for user CONFIRM before touching any code.
---

# Plan Command

This command invokes **planner** agent...
```

**Verificar se o arquivo do Agente existe**:

O nome do agente mencionado no arquivo de Comando (como `planner`) deve corresponder a um arquivo: `planner.md`

```bash
# Verificar se o arquivo do Agente existe
ls -la ~/.claude/agents/planner.md

# Se não existir, verificar se há arquivos com nome semelhante
ls -la ~/.claude/agents/ | grep -i plan
```

**Exemplos Comuns de Incompatibilidade**:

| Command invokes | Nome Real do Arquivo do Agente | Problema |
|--- | --- | ---|
| `planner` | `planner.md` | ✅ Correto |
| `planner` | `Planner.md` | ❌ Diferença de maiúsculas/minúsculas (Unix distingue maiúsculas/minúsculas) |
| `planner` | `planner.md.backup` | ❌ Extensão de arquivo incorreta |
| `tdd-guide` | `tdd_guide.md` | ❌ Hífen vs sublinhado |

#### Causa B: Nome do Arquivo do Agente Incorreto

**Problema**: O nome do arquivo do Agente não corresponde ao esperado.

**Solução**:

Verifique todos os nomes de arquivo dos Agentes:

```bash
# Listar todos os arquivos de Agente
ls -la ~/.claude/agents/

# 9 arquivos de Agente esperados
# planner.md
# architect.md
# tdd-guide.md
# code-reviewer.md
# security-reviewer.md
# build-error-resolver.md
# e2e-runner.md
# refactor-cleaner.md
# doc-updater.md
```

**Se o nome do arquivo estiver incorreto**, renomeie o arquivo:

```bash
# Exemplo: corrigir nome de arquivo
cd ~/.claude/agents/
mv Planner.md planner.md
mv tdd_guide.md tdd-guide.md
```

---

## Problema Comum 3: Erro de Formato do Front Matter do Agente

### Sintoma
O Agente é chamado, mas vê a mensagem de erro: "Invalid agent metadata" ou erro de formato semelhante.

### Possíveis Causas

#### Causa A: Campos Obrigatórios Ausentes

**Problema**: O Front Matter do Agente está faltando campos obrigatórios (`name`, `description`, `tools`).

**Solução**:

Verifique o formato do Front Matter do Agente:

```bash
# Verificar o cabeçalho de um arquivo de Agente
head -20 ~/.claude/agents/planner.md
```

**Formato Correto do Front Matter**:

```markdown
---
name: planner
description: Expert planning specialist for complex features and refactoring. Use PROACTIVELY when users request feature implementation, architectural changes, or complex refactoring. Automatically activated for planning tasks.
tools: Read, Grep, Glob
model: opus
---
```

**Campos Obrigatórios**:
- `name`: Nome do Agente (deve corresponder ao nome do arquivo, sem extensão)
- `description`: Descrição do Agente (usada para entender as responsabilidades do Agente)
- `tools`: Lista de ferramentas permitidas (separadas por vírgula)

**Campos Opcionais**:
- `model`: Modelo preferido (`opus` ou `sonnet`)

#### Causa B: Erro no Campo Tools

**Problema**: O campo `tools` usa nomes de ferramentas incorretos ou formato incorreto.

**Solução**:

Verifique o campo `tools`:

```bash
# Extrair o campo tools
grep "^tools:" ~/.claude/agents/*.md
```

**Nomes de Ferramentas Permitidos** (distingue maiúsculas/minúsculas):
- `Read`
- `Write`
- `Edit`
- `Bash`
- `Grep`
- `Glob`

**Erros Comuns**:

| Escrita Incorreta | Escrita Correta | Problema |
|--- | --- | ---|
| `tools: read, grep, glob` | `tools: Read, Grep, Glob` | ❌ Erro de maiúsculas/minúsculas |
| `tools: Read, Grep, Glob,` | `tools: Read, Grep, Glob` | ❌ Vírgula final (erro de sintaxe YAML) |
| `tools: "Read, Grep, Glob"` | `tools: Read, Grep, Glob` | ❌ Não precisa de aspas |
| `tools: Read Grep Glob` | `tools: Read, Grep, Glob` | ❌ Falta vírgula separadora |

#### Causa C: Erro de Sintaxe YAML

**Problema**: Formato YAML do Front Matter incorreto (como indentação, aspas, caracteres especiais).

**Solução**:

Validar o formato YAML:

```bash
# Usar Python para validar YAML
python3 -c "import yaml; yaml.safe_load(open('~/.claude/agents/planner.md'))"

# Ou usar yamllint (precisa instalar)
pip install yamllint
yamllint ~/.claude/agents/*.md
```

**Erros Comuns de YAML**:
- Indentação inconsistente (YAML é sensível a indentação)
- Falta espaço após dois pontos: `name:planner` → `name: planner`
- String contém caracteres especiais não escapados (como dois pontos, hash)
- Uso de indentação com Tab (YAML aceita apenas espaços)

---

## Problema Comum 4: Agente Atinge Tempo Limite de Execução ou Trava

### Sintoma
O Agente começa a executar, mas não há resposta por muito tempo ou trava.

### Possíveis Causas

#### Causa A: Complexidade da Tarefa Muito Alta

**Problema**: A tarefa solicitada é muito complexa, excedendo a capacidade de processamento do Agente.

**Solução**:

**Dividir a tarefa em etapas menores**:

```
❌ Errado: pedir ao Agente para processar o projeto inteiro de uma vez
"Ajude-me a refatorar todo o sistema de autenticação de usuários, incluindo todos os testes e documentação"

✅ Correto: executar em etapas
Passo 1: /plan refatorar o sistema de autenticação de usuários
Passo 2: /tdd implementar o primeiro passo (API de login)
Passo 3: /tdd implementar o segundo passo (API de registro)
...
```

**Usar o comando `/plan` para planejar primeiro**:

```
Usuário: /plan preciso refatorar o sistema de autenticação de usuários

Agente (planner):
# Implementation Plan: Refactor User Authentication System

## Phase 1: Audit Current Implementation
- Review existing auth code
- Identify security issues
- List dependencies

## Phase 2: Design New System
- Define authentication flow
- Choose auth method (JWT, OAuth, etc.)
- Design API endpoints

## Phase 3: Implement Core Features
[passos detalhados...]

**WAITING FOR CONFIRMATION**: Proceed with this plan? (yes/no/modify)
```

#### Causa B: Escolha de Modelo Inadequada

**Problema**: A complexidade da tarefa é alta, mas foi usado um modelo mais fraco (como `sonnet` em vez de `opus`).

**Solução**:

Verifique o campo `model` do Agente:

```bash
# Verificar qual modelo cada Agente usa
grep "^model:" ~/.claude/agents/*.md
```

**Configuração Recomendada**:
- **Tarefas intensivas em raciocínio** (como `planner`, `architect`): use `opus`
- **Geração/modificação de código** (como `tdd-guide`, `code-reviewer`): use `opus`
- **Tarefas simples** (como `refactor-cleaner`): pode usar `sonnet`

**Modificar a configuração do modelo**:

Edite o arquivo do Agente:

```markdown
---
name: my-custom-agent
description: Custom agent for...
tools: Read, Write, Edit, Bash, Grep
model: opus  # Use opus para melhorar o desempenho em tarefas complexas
---
```

#### Causa C: Leitura Excessiva de Arquivos

**Problema**: O Agente leu muitos arquivos, excedendo o limite de Token.

**Solução**:

**Limitar o escopo de arquivos que o Agente lê**:

```
❌ Errado: pedir ao Agente para ler o projeto inteiro
"Leia todos os arquivos no projeto, depois analise a arquitetura"

✅ Correto: especificar arquivos relevantes
"Leia os arquivos no diretório src/auth/, analise a arquitetura do sistema de autenticação"
```

**Usar padrões Glob para correspondência precisa**:

```
Usuário: Por favor, me ajude a otimizar o desempenho

Agente deve:
# Usar Glob para encontrar arquivos críticos de desempenho
Glob pattern="**/*.{ts,tsx}" path="src/api"

# E não
Glob pattern="**/*" path="."  # Ler todos os arquivos
```

---

## Problema Comum 5: Saída do Agente Não Corresponde ao Esperado

### Sintoma
O Agente é chamado e executa, mas a saída não corresponde ao esperado ou a qualidade não é alta.

### Possíveis Causas

#### Causa A: Descrição da Tarefa Não Clara

**Problema**: A solicitação do usuário é vaga, o Agente não consegue entender com precisão os requisitos.

**Solução**:

**Fornecer descrição de tarefa clara e específica**:

```
❌ Errado: solicitação vaga
"Ajude-me a otimizar o código"

✅ Correto: solicitação específica
"Ajude-me a otimizar a função searchMarkets em src/api/markets.ts,
melhore o desempenho da consulta, o objetivo é reduzir o tempo de resposta de 500ms para menos de 100ms"
```

**Incluir as seguintes informações**:
- Nome específico do arquivo ou função
- Objetivo claro (desempenho, segurança, legibilidade, etc.)
- Restrições (não pode quebrar funcionalidades existentes, deve manter compatibilidade, etc.)

#### Causa B: Falta de Contexto

**Problema**: O Agente não tem informações de contexto necessárias, não consegue tomar decisões corretas.

**Solução**:

**Fornecer proativamente informações de contexto**:

```
Usuário: Por favor, me ajude a corrigir a falha no teste

❌ Errado: sem contexto
"npm test reportou erro, me ajude a consertar"

✅ Correto: fornecer contexto completo
"Quando executei npm test, o teste searchMarkets falhou.
A mensagem de erro é: Expected 5 but received 0.
Acabei de modificar a função vectorSearch, pode estar relacionado a isso.
Por favor, me ajude a localizar o problema e corrigir."
```

**Usar Skills para fornecer conhecimento de domínio**:

Se o projeto tem uma biblioteca de habilidades específica (`~/.claude/skills/`), o Agente carregará automaticamente o conhecimento relacionado.

#### Causa C: Domínio de Especialização do Agente Não Correspondente

**Problema**: Usou o Agente inadequado para processar a tarefa.

**Solução**:

**Escolher o Agente correto com base no tipo de tarefa**:

| Tipo de Tarefa | Recomendado | Command |
|--- | --- | ---|
| Implementar novos recursos | `tdd-guide` | `/tdd` |
| Planejamento de recursos complexos | `planner` | `/plan` |
| Revisão de código | `code-reviewer` | `/code-review` |
| Auditoria de segurança | `security-reviewer` | Chamada manual |
| Corrigir erros de build | `build-error-resolver` | `/build-fix` |
| Testes E2E | `e2e-runner` | `/e2e` |
| Limpar código morto | `refactor-cleaner` | `/refactor-clean` |
| Atualizar documentação | `doc-updater` | `/update-docs` |
| Design de arquitetura de sistema | `architect` | Chamada manual |

**Veja [Visão Geral de Agentes](../../platforms/agents-overview/) para entender as responsabilidades de cada Agente**.

---

## Problema Comum 6: Permissões de Ferramentas do Agente Insuficientes

### Sintoma
O Agente tenta usar uma ferramenta e é negado, vê o erro: "Tool not available: xxx".

### Possíveis Causas

#### Causa A: Campo Tools Falta a Ferramenta

**Problema**: O campo `tools` no Front Matter do Agente não inclui a ferramenta necessária.

**Solução**:

Verifique o campo `tools` do Agente:

```bash
# Verificar as ferramentas que o Agente pode usar
grep -A 1 "^tools:" ~/.claude/agents/planner.md
```

**Se faltar uma ferramenta**, adicione ao campo `tools`:

```markdown
---
name: my-custom-agent
description: Agent that needs to write code
tools: Read, Write, Edit, Grep, Glob  # Certifique-se de incluir Write e Edit
model: opus
---
```

**Cenários de Uso de Ferramentas**:
- `Read`: ler conteúdo de arquivo (quase todos os Agentes precisam)
- `Write`: criar novos arquivos
- `Edit`: editar arquivos existentes
- `Bash`: executar comandos (como rodar testes, build)
- `Grep`: pesquisar conteúdo de arquivos
- `Glob`: encontrar caminhos de arquivos

#### Causa B: Erro de Ortografia do Nome da Ferramenta

**Problema**: O campo `tools` usa nomes de ferramentas incorretos.

**Solução**:

**Verifique a ortografia dos nomes das ferramentas** (distingue maiúsculas/minúsculas):

| ✅ Correto | ❌ Incorreto |
|--- | ---|
| `Read` | `read`, `READ` |
| `Write` | `write`, `WRITE` |
| `Edit` | `edit`, `EDIT` |
| `Bash` | `bash`, `BASH` |
| `Grep` | `grep`, `GREP` |
| `Glob` | `glob`, `GLOB` |

---

## Problema Comum 7: Agente Proativo Não Disparou Automaticamente

### Sintoma
Alguns Agentes deveriam disparar automaticamente (como chamar `code-reviewer` automaticamente após modificar código), mas não dispararam.

### Possíveis Causas

#### Causa A: Condições de Gatilho Não Atendidas

**Problema**: A descrição do Agente está marcada com `Use PROACTIVELY`, mas as condições de gatilho não foram atendidas.

**Solução**:

Verifique o campo `description` do Agente:

```bash
# Verificar a descrição do Agente
grep "^description:" ~/.claude/agents/code-reviewer.md
```

**Exemplo (code-reviewer)**:

```markdown
description: Reviews code for quality, security, and maintainability. Use PROACTIVELY when users write or modify code.
```

**Condições de Gatilho Proativo**:
- Usuário solicita explicitamente revisão de código
- Acabou de completar a escrita/modificação de código
- Antes de preparar o commit do código

**Gatilho Manual**:

Se o gatilho automático não funcionar, você pode chamar manualmente:

```
Usuário: Por favor, me ajude a revisar o código que acabou de ser feito

Ou usar o Command:
Usuário: /code-review
```

---

## Ferramentas e Técnicas de Diagnóstico

### Verificar Status de Carregamento do Agente

Verifique se o Claude Code carregou corretamente todos os Agentes:

```bash
# Verificar os logs do Claude Code (se disponível)
# macOS/Linux
tail -f ~/Library/Logs/claude-code/claude-code.log | grep -i agent

# Windows
Get-Content "$env:APPDATA\claude-code\logs\claude-code.log" -Wait | Select-String "agent"
```

### Testar Manualmente o Agente

Teste manualmente a chamada do Agente no Claude Code:

```
Usuário: Por favor, chame o agente planner para me ajudar a planejar um novo recurso

# Observe se o Agente foi chamado corretamente
# Verifique se a saída corresponde ao esperado
```

### Validar Formato do Front Matter

Use Python para validar o Front Matter de todos os Agentes:

```bash
#!/bin/bash

for file in ~/.claude/agents/*.md; do
    echo "Validando $file..."
    python3 << EOF
import yaml
import sys

try:
    with open('$file', 'r') as f:
        content = f.read()
        # Extrair front matter (entre ---)
        start = content.find('---')
        end = content.find('---', start + 3)
        if start == -1 or end == -1:
            print("Error: No front matter found")
            sys.exit(1)
        
        front_matter = content[start + 3:end].strip()
        metadata = yaml.safe_load(front_matter)
        
        # Verificar campos obrigatórios
        required = ['name', 'description', 'tools']
        for field in required:
            if field not in metadata:
                print(f"Error: Missing required field '{field}'")
                sys.exit(1)
        
        print("✅ Valid")
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
EOF
done
```

Salve como `validate-agents.sh`, execute:

```bash
chmod +x validate-agents.sh
./validate-agents.sh
```

---

## Ponto de Verificação ✅

Verifique item por item na seguinte lista:

- [ ] Arquivos do Agente no local correto (`~/.claude/agents/` ou `.claude/agents/`)
- [ ] Arquivos de Comando no local correto (`~/.claude/commands/` ou `.claude/commands/`)
- [ ] Formato do Front Matter do Agente correto (contém name, description, tools)
- [ ] Campo Tools usa nomes de ferramentas corretos (distingue maiúsculas/minúsculas)
- [ ] Campo `invokes` do Command corresponde ao nome do arquivo do Agente
- [ ] Plugin habilitado corretamente em `~/.claude/settings.json`
- [ ] Descrição da tarefa clara e específica
- [ ] Escolheu o Agente adequado para processar a tarefa

---

## Quando Precisar de Ajuda

Se os métodos acima não conseguirem resolver o problema:

1. **Coletar informações de diagnóstico**:
   ```bash
   # Produzir as seguintes informações
   echo "Claude Code version: $(claude-code --version 2>/dev/null || echo 'N/A')"
   echo "Agent files:"
   ls -la ~/.claude/agents/
   echo "Command files:"
   ls -la ~/.claude/commands/
   echo "Plugin config:"
   cat ~/.claude/settings.json | jq '.enabledPlugins'
   ```

2. **Verificar GitHub Issues**:
   - Visite [Everything Claude Code Issues](https://github.com/affaan-m/everything-claude-code/issues)
   - Procure problemas semelhantes

3. **Enviar Issue**:
   - Inclua mensagens de erro completas
   - Forneça informações do sistema operacional e versão
   - Anexe conteúdo de arquivos de Agente e Comando relevantes

---

## Resumo da Lição

Falhas de chamada de Agente geralmente têm as seguintes categorias de causas:

| Tipo de Problema | Causas Comuns | Diagnóstico Rápido |
|--- | --- | ---|
| **Nunca é chamado** | Caminho de arquivo Agente/Command incorreto, plugin não carregado | Verificar local de arquivo, validar configuração do plugin |
| **Agent not found** | Nome não corresponde (Command invokes vs nome de arquivo) | Validar nome de arquivo e campo invokes |
| **Erro de formato** | Front Matter faltando campos, erro de sintaxe YAML | Verificar campos obrigatórios, validar formato YAML |
| **Tempo limite de execução** | Alta complexidade da tarefa, escolha de modelo inadequada | Dividir tarefa, usar modelo opus |
| **Saída não corresponde ao esperado** | Descrição de tarefa não clara, falta de contexto, Agente não corresponde | Fornecer tarefa específica, escolher o Agente correto |
| **Permissões de ferramentas insuficientes** | Campo Tools faltando ferramentas, erro de ortografia de nome | Verificar campo tools, validar nomes de ferramentas |

Lembre-se: a maioria dos problemas pode ser resolvida verificando caminhos de arquivo, validando o formato do Front Matter e escolhendo o Agente correto.

---

## Próxima Lição

> Na próxima lição, vamos aprender **[Técnicas de Otimização de Desempenho](../performance-tips/)**.
>
> Você vai aprender:
> - Como otimizar o uso de Token
> - Melhorar a velocidade de resposta do Claude Code
> - Estratégias de gerenciamento de janela de contexto

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Atualizado em: 2026-01-25

| Função | Caminho do Arquivo | Linha |
|--- | --- | ---|
| Configuração do manifesto do plugin | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28 |
| Planner Agent | [`agents/planner.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/planner.md) | 1-120 |
| TDD Guide Agent | [`agents/tdd-guide.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/tdd-guide.md) | 1-281 |
| Code Reviewer Agent | [`agents/code-reviewer.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | 1-281 |
| Plan Command | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md) | 1-114 |
| TDD Command | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md) | 1-281 |
| Regras de uso de Agentes | [`rules/agents.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/agents.md) | 1-50 |

**Campos Obrigatórios do Front Matter** (todos os arquivos de Agente):
- `name`: Identificador do Agente (deve corresponder ao nome do arquivo, sem extensão `.md`)
- `description`: Descrição da funcionalidade do Agente (contém instruções de condição de disparo)
- `tools`: Lista de ferramentas permitidas (separadas por vírgula: `Read, Grep, Glob`)
- `model`: Modelo preferido (`opus` ou `sonnet`, opcional)

**Nomes de Ferramentas Permitidos** (distingue maiúsculas/minúsculas):
- `Read`: ler conteúdo de arquivo
- `Write`: criar novos arquivos
- `Edit`: editar arquivos existentes
- `Bash`: executar comandos
- `Grep`: pesquisar conteúdo de arquivos
- `Glob`: encontrar caminhos de arquivos

**Caminhos de Configuração Chave**:
- Agents de nível de usuário: `~/.claude/agents/`
- Commands de nível de usuário: `~/.claude/commands/`
- Settings de nível de usuário: `~/.claude/settings.json`
- Agents de nível de projeto: `.claude/agents/`
- Commands de nível de projeto: `.claude/commands/`

**Configuração de Carregamento do Plugin** (`~/.claude/settings.json`):
```json
{
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

</details>
