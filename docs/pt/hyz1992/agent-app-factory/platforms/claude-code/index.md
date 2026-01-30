---
title: "Integração com Claude Code: Configurando Permissões para Executar Pipelines | Tutorial AI App Factory"
sidebarTitle: "Configurar Claude Code em 5 Minutos"
subtitle: "Integração com Claude Code: Configurando Permissões para Executar Pipelines | Tutorial AI App Factory"
description: "Aprenda a configurar permissões do Claude Code para executar pipelines do AI App Factory com segurança. Entenda o método de geração automática de settings.local.json, mecanismo de lista branca e melhores práticas de configuração de permissões multiplataforma, evitando o uso do parâmetro perigoso --dangerously-skip-permissions. Este tutorial cobre tratamento de caminhos Windows/macOS/Linux e solução de erros comuns de permissão."
tags:
  - "Claude Code"
  - "Configuração de Permissões"
  - "Assistente de IA"
prerequisite:
  - "start-installation"
  - "start-init-project"
order: 50
---

# Integração com Claude Code: Configurando Permissões para Executar Pipelines | Tutorial AI App Factory

## O Que Você Vai Aprender

- Configurar permissões seguras do Claude Code sem usar `--dangerously-skip-permissions`
- Entender a lista branca de permissões gerada automaticamente pelo Factory
- Executar o pipeline completo de 7 estágios no Claude Code
- Dominar a configuração de permissões multiplataforma (Windows/macOS/Linux)

## Seu Dilema Atual

Ao usar o Factory pela primeira vez, você pode encontrar:

- **Permissões bloqueadas**: Claude Code mostra "sem permissão para ler arquivo"
- **Uso de parâmetros perigosos**: Forçado a adicionar `--dangerously-skip-permissions` para contornar verificações de segurança
- **Configuração manual complicada**: Não saber quais operações devem ser permitidas
- **Problemas multiplataforma**: Permissões de caminhos inconsistentes entre Windows e Unix

Na verdade, o Factory **gera automaticamente** a configuração completa de permissões, você só precisa usá-la corretamente.

## Quando Usar Esta Técnica

Quando precisar executar pipelines do Factory no Claude Code:

- Após usar `factory init` para inicializar o projeto (inicia automaticamente)
- Ao usar `factory run` para continuar o pipeline
- Ao iniciar o Claude Code manualmente

::: info Por que Recomendamos o Claude Code?
Claude Code é o assistente de programação com IA oficial da Anthropic, com integração profunda ao sistema de permissões do Factory. Comparado a outros assistentes de IA, o gerenciamento de permissões do Claude Code é mais granular e seguro.
:::

## Conceito Principal

A configuração de permissões do Factory adota um **mecanismo de lista branca**: apenas operações explicitamente permitidas são autorizadas, todas as outras são proibidas.

### Categorias da Lista Branca de Permissões

| Categoria | Operações Permitidas | Uso |
| --- | --- | --- |
| **Operações de Arquivo** | Read/Write/Edit/Glob | Ler e modificar arquivos do projeto |
| **Operações Git** | git add/commit/push etc. | Controle de versão |
| **Operações de Diretório** | ls/cd/tree/pwd | Navegar pela estrutura de diretórios |
| **Ferramentas de Build** | npm/yarn/pnpm | Instalar dependências, executar scripts |
| **TypeScript** | tsc/npx tsc | Verificação de tipos |
| **Banco de Dados** | npx prisma | Migrações e gerenciamento de banco de dados |
| **Python** | python/pip | Sistema de design de UI |
| **Testes** | vitest/jest/test | Executar testes |
| **Factory CLI** | factory init/run/continue | Comandos do pipeline |
| **Docker** | docker compose | Implantação em containers |
| **Operações Web** | WebFetch(domain:...) | Obter documentação de APIs |
| **Skills** | superpowers/ui-ux-pro-max | Plugins de habilidades |

### Por que Não Usar `--dangerously-skip-permissions`?

| Método | Segurança | Recomendado |
| --- | --- | --- |
| `--dangerously-skip-permissions` | ❌ Permite que Claude execute qualquer operação (incluindo deletar arquivos) | Não recomendado |
| Configuração de Lista Branca | ✅ Apenas operações explícitas permitidas, violações mostram erro | Recomendado |

A configuração de lista branca pode parecer complexa inicialmente, mas é gerada automaticamente e reutilizada, sendo mais segura.

## 🎒 Preparação Antes de Começar

Antes de começar, confirme:

- [x] Concluiu **Instalação e Configuração** ([start/installation/](../../start/installation/))
- [x] Concluiu **Inicialização do Projeto Factory** ([start/init-project/](../../start/init-project/))
- [x] Claude Code instalado: https://claude.ai/code
- [x] Diretório do projeto inicializado (diretório `.factory/` existe)

::: warning Verifique se o Claude Code Está Instalado
Execute o seguinte comando no terminal para confirmar:

```bash
claude --version
```

Se mostrar "command not found", instale o Claude Code primeiro.
:::

## Siga os Passos

### Passo 1: Inicializar o Projeto (Geração Automática de Permissões)

**Por quê**: `factory init` gera automaticamente `.claude/settings.local.json`, contendo a lista branca completa de permissões.

Execute no diretório do projeto:

```bash
# Criar novo diretório e entrar
mkdir my-factory-project && cd my-factory-project

# Inicializar projeto Factory
factory init
```

**Você Deverá Ver**:

```
✓ Factory project initialized!
✓ Claude Code is starting...
  (Please wait for window to open)
```

A janela do Claude Code abrirá automaticamente, mostrando a seguinte mensagem:

```
Por favor, leia .factory/pipeline.yaml e .factory/agents/orchestrator.checkpoint.md,
inicie o pipeline e me ajude a transformar fragmentos de ideias de produto em aplicativos executáveis.
A seguir, vou inserir os fragmentos de ideias. Nota: Arquivos skills/ e policies/
referenciados pelos Agentes precisam ser procurados primeiro no diretório .factory/, depois no diretório raiz.
```

**O Que Aconteceu**:

1. Cria o diretório `.factory/`, contendo configuração do pipeline
2. Gera `.claude/settings.local.json` (lista branca de permissões)
3. Inicia automaticamente o Claude Code, passando a mensagem de inicialização

### Passo 2: Verificar Configuração de Permissões

**Por quê**: Confirme que o arquivo de permissões foi gerado corretamente, evitando problemas de permissão em tempo de execução.

Verifique o arquivo de permissões gerado:

```bash
# Ver conteúdo do arquivo de permissões
cat .claude/settings.local.json
```

**Você Deverá Ver** (conteúdo parcial):

```json
{
  "permissions": {
    "allow": [
      "Read(/path/to/project/**)",
      "Write(/path/to/project/**)",
      "Glob(/path/to/project/**)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(npm install:*)",
      "Bash(npx prisma generate:*)",
      "Skill(superpowers:brainstorming)",
      "Skill(ui-ux-pro-max)",
      "WebFetch(domain:github.com)",
      "WebFetch(domain:npmjs.org)"
    ]
  },
  "features": {
    "autoSave": true,
    "telemetry": false
  }
}
```

::: tip Explicação de Caminhos
Os caminhos nas permissões são ajustados automaticamente conforme seu sistema operacional:

- **Windows**: `Read(//c/Users/...)` (suporta letra de unidade minúscula e maiúscula)
- **macOS/Linux**: `Read(/Users/...)` (caminho absoluto)
:::

### Passo 3: Iniciar o Pipeline no Claude Code

**Por quê**: O Claude Code já está configurado com permissões, podendo ler diretamente as definições de Agent e arquivos de Skill.

Na janela do Claude Code já aberta, insira sua ideia de produto:

```
Quero fazer um aplicativo de controle de despesas mobile para ajudar jovens a registrar rapidamente gastos diários,
evitar ultrapassar o orçamento no final do mês. Principais funcionalidades são registrar valor, selecionar categoria (alimentação, transporte, entretenimento, outros),
visualizar total de gastos do mês.
```

**Você Deverá Ver**:

O Claude Code executará os seguintes passos (automaticamente):

1. Ler `.factory/pipeline.yaml`
2. Ler `.factory/agents/orchestrator.checkpoint.md`
3. Iniciar o estágio **Bootstrap**, estruturando sua ideia em `input/idea.md`
4. Pausar após conclusão, aguardando sua confirmação

**Checkpoint ✅**: Confirme que o estágio Bootstrap foi concluído

```bash
# Ver ideia estruturada gerada
cat input/idea.md
```

### Passo 4: Continuar o Pipeline

**Por quê**: Após cada estágio, confirmação manual é necessária para evitar acúmulo de erros.

Responda no Claude Code:

```
continuar
```

O Claude Code entrará automaticamente no próximo estágio (PRD), repetindo o fluxo "executar → pausar → confirmar" até completar todos os 7 estágios.

::: tip Usar `factory run` para Reiniciar
Se a janela do Claude Code fechar, você pode executar no terminal:

```bash
factory run
```

Isso exibirá novamente as instruções de execução do Claude Code.
:::

### Passo 5: Tratamento de Permissões Multiplataforma (Usuários Windows)

**Por quê**: Permissões de caminhos Windows precisam de tratamento especial para garantir que o Claude Code acesse corretamente os arquivos do projeto.

Se você usa Windows, `factory init` gera automaticamente permissões que suportam letras de unidade:

```json
{
  "permissions": {
    "allow": [
      "Read(//c/Users/yourname/project/**)",
      "Read(//C/Users/yourname/project/**)",
      "Write(//c/Users/yourname/project/**)",
      "Write(//C/Users/yourname/project/**)"
    ]
  }
}
```

**Checkpoint ✅**: Usuários Windows verificam permissões

```powershell
# PowerShell
Get-Content .claude\settings.local.json | Select-String -Pattern "Read|Write"
```

Se vir os dois formatos de caminho `//c/` e `//C/`, a configuração está correta.

## Checkpoints ✅

Após completar os passos acima, você deverá ser capaz de:

- [x] Encontrar o arquivo `.claude/settings.local.json`
- [x] Ver a lista branca completa de permissões (contendo Read/Write/Bash/Skill/WebFetch)
- [x] Iniciar com sucesso o estágio Bootstrap no Claude Code
- [x] Visualizar `input/idea.md` para confirmar que a ideia foi estruturada
- [x] Continuar executando o pipeline para o próximo estágio

Se encontrar erros de permissão, consulte "Armadilhas Comuns" abaixo.

## Armadilhas Comuns

### Problema 1: Permissões Bloqueadas

**Mensagem de Erro**:
```
Permission denied: Read(path/to/file)
```

**Causa**:
- Arquivo de permissões falhou ao gerar ou caminho incorreto
- Claude Code está usando cache de permissões antigo

**Solução**:

1. Verifique se o arquivo de permissões existe:

```bash
ls -la .claude/settings.local.json
```

2. Regenerar permissões:

```bash
# Deletar arquivo de permissões antigo
rm .claude/settings.local.json

# Reinicializar (vai regenerar)
factory init --force
```

3. Reinicie o Claude Code, limpando o cache.

### Problema 2: Aviso `--dangerously-skip-permissions`

**Mensagem de Erro**:
```
Using --dangerously-skip-permissions is not recommended.
```

**Causa**:
- `.claude/settings.local.json` não encontrado
- Formato do arquivo de permissões incorreto

**Solução**:

Verifique o formato do arquivo de permissões (sintaxe JSON):

```bash
# Validar formato JSON
python -m json.tool .claude/settings.local.json
```

Se mostrar erro de sintaxe, delete o arquivo e execute `factory init` novamente.

### Problema 3: Permissões de Caminho Windows Não Funcionam

**Mensagem de Erro**:
```
Permission denied: Read(C:\Users\yourname\project\file.js)
```

**Causa**:
- Configuração de permissões não inclui caminho com letra de unidade
- Formato de caminho incorreto (Windows precisa usar formato `//c/`)

**Solução**:

Edite manualmente `.claude\settings.local.json`, adicionando caminho com letra de unidade:

```json
{
  "permissions": {
    "allow": [
      "Read(//c/Users/yourname/project/**)",
      "Write(//c/Users/yourname/project/**)"
    ]
  }
}
```

Note que ambos os casos de letra de unidade são suportados (`//c/` e `//C/`).

### Problema 4: Permissões de Skills Bloqueadas

**Mensagem de Erro**:
```
Permission denied: Skill(superpowers:brainstorming)
```

**Causa**:
- Plugins necessários do Claude Code não instalados (superpowers, ui-ux-pro-max)
- Versão do plugin incompatível

**Solução**:

1. Adicionar marketplace de plugins:

```bash
# Adicionar marketplace de plugins superpowers
claude plugin marketplace add obra/superpowers-marketplace
```

2. Instalar plugin superpowers:

```bash
claude plugin install superpowers@superpowers-marketplace
```

3. Adicionar marketplace de plugins ui-ux-pro-max:

```bash
claude plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
```

4. Instalar plugin ui-ux-pro-max:

```bash
claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

5. Execute o pipeline novamente.

::: info Factory tenta instalar plugins automaticamente
O comando `factory init` tenta instalar esses plugins automaticamente. Se falhar, instale manualmente.
:::

## Resumo da Lição

- **Lista Branca de Permissões** é mais segura que `--dangerously-skip-permissions`
- **`factory init`** gera automaticamente `.claude/settings.local.json`
- A configuração de permissões inclui categorias como **operações de arquivo, Git, ferramentas de build, banco de dados, operações Web**, etc.
- **Suporte Multiplataforma**: Windows usa caminho `//c/`, Unix usa caminho absoluto
- **Instalação Manual de Plugins**: se a instalação automática falhar, precisa instalar manualmente superpowers e ui-ux-pro-max no Claude Code

## Próxima Lição

> Na próxima lição aprenderemos **[OpenCode e Outros Assistentes de IA](../other-ai-assistants/)**.
>
> Você vai aprender:
> - Como executar pipelines do Factory no OpenCode
> - Métodos de integração com outros assistentes de IA como Cursor, GitHub Copilot
> - Diferenças de configuração de permissões entre diferentes assistentes

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código fonte</strong></summary>

> Última atualização: 2026-01-29

| Funcionalidade | Caminho do Arquivo | Linha |
| --- | --- | --- |
| Geração de Configuração de Permissões | [`cli/utils/claude-settings.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/utils/claude-settings.js) | 1-292 |
| Inicialização Automática do Claude Code | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 119-147 |
| Detecção de Assistente de IA | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js) | 105-124 |
| Geração de Instruções do Claude Code | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js) | 138-156 |
| Tratamento de Caminhos Multiplataforma | [`cli/utils/claude-settings.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/utils/claude-settings.js) | 14-67 |

**Funções Principais**:
- `generatePermissions(projectDir)`: Gera lista branca completa de permissões, incluindo operações Read/Write/Bash/Skill/WebFetch, etc.
- `generateClaudeSettings(projectDir)`: Gera e escreve arquivo `.claude/settings.local.json`
- `launchClaudeCode(projectDir)`: Inicia janela do Claude Code e passa mensagem de inicialização
- `detectAIAssistant()`: Detecta tipo de assistente de IA em execução (Claude Code/Cursor/OpenCode)

**Constantes Principais**:
- Padrão de caminho Windows: `Read(//c/**)`, `Write(//c/**)` (suporta letra de unidade minúscula e maiúscula)
- Padrão de caminho Unix: `Read(/path/to/project/**)`, `Write(/path/to/project/**)`
- Permissões de Skills: `'Skill(superpowers:brainstorming)'`, `'Skill(ui-ux-pro-max)'`

**Categorias da Lista Branca de Permissões**:
- **Operações de Arquivo**: Read/Write/Glob (suporta wildcards)
- **Operações Git**: git add/commit/push/pull etc. (conjunto completo de comandos Git)
- **Ferramentas de Build**: npm/yarn/pnpm install/build/test/dev
- **TypeScript**: tsc/npx tsc/npx type-check
- **Banco de Dados**: npx prisma validate/generate/migrate/push
- **Python**: python/pip install (usado para ui-ux-pro-max)
- **Testes**: vitest/jest/test
- **Factory CLI**: factory init/run/continue/status/reset
- **Docker**: docker compose/ps/build/run
- **Operações Web**: WebFetch(domain:github.com) etc. (lista branca de domínios especificados)

</details>
