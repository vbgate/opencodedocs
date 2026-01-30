---
title: "Inicialização da Factory: Configuração de diretórios em 3 minutos | Agent Factory"
sidebarTitle: "Inicializar projeto em 3 minutos"
subtitle: "Inicializar projeto Factory: configuração do zero em 3 minutos"
description: "Aprenda a usar o comando factory init para inicializar rapidamente um projeto do Agent App Factory. O tutorial cobre requisitos de diretório, estrutura de arquivos, configuração de permissões e inicialização do assistente de IA."
tags:
  - "inicialização de projeto"
  - "factory init"
  - "estrutura de diretórios"
prerequisite:
  - "start-installation"
order: 30
---

# Inicializar projeto Factory: configuração do zero em 3 minutos

## O que você será capaz de fazer

- Inicializar um projeto Factory em qualquer diretório vazio
- Compreender a estrutura do diretório `.factory/` gerado
- Configurar parâmetros do projeto (stack tecnológica, preferências de UI, restrições de MVP)
- Iniciar automaticamente o assistente de IA e iniciar o pipeline

## Seu desafio atual

Quer experimentar o AI App Factory, mas não sabe por onde começar? Olhando para uma pasta vazia, sem saber quais arquivos criar? Ou já tem algum código, mas não tem certeza se pode usá-lo diretamente? Não se preocupe, o comando `factory init` resolverá tudo para você.

## Quando usar esta técnica

- Primeira vez usando o AI App Factory
- Começar uma nova ideia de produto
- Precisa de um ambiente de projeto Factory limpo

## 🎒 Preparação antes de começar

::: warning Verificação prévia

Antes de começar, certifique-se de:

- ✅ [Instalação e configuração](../installation/) concluída
- ✅ Assistente de IA instalado (Claude Code ou OpenCode)
- ✅ Tem um **diretório vazio** ou um diretório que contenha apenas configurações do Git/editor

:::

## Conceito central

O núcleo do comando `factory init` é **autossuficiência**:

1. Copiar todos os arquivos necessários (agents, skills, policies, pipeline.yaml) para o diretório `.factory/` do projeto
2. Gerar arquivos de configuração do projeto (`config.yaml` e `state.json`)
3. Configurar permissões do Claude Code (`.claude/settings.local.json`)
4. Instalar automaticamente plugins necessários (superpowers, ui-ux-pro-max)
5. Iniciar o assistente de IA e iniciar o pipeline

Assim, cada projeto Factory contém tudo o que é necessário para executar, sem depender de instalação global.

::: tip Por que autossuficiência?

Benefícios do design autossuficiente:

- **Isolamento de versão**: diferentes projetos podem usar diferentes versões da configuração Factory
- **Portabilidade**: pode enviar o diretório `.factory/` diretamente para o Git, e os membros da equipe podem reutilizá-lo
- **Segurança**: as configurações de permissão só entram em vigor no diretório do projeto, não afetando outros projetos

:::

## Siga-me

### Etapa 1: Entre no diretório do projeto

**Por que**: precisa de um diretório de trabalho limpo para armazenar o aplicativo gerado.

```bash
# Criar novo diretório
mkdir my-app && cd my-app

# Ou entrar em um diretório vazio existente
cd /path/to/your/project
```

**O que você deve ver**: diretório vazio, ou contendo apenas arquivos permitidos como `.git/`, `.gitignore`, `README.md`, etc.

### Etapa 2: Executar o comando de inicialização

**Por que**: `factory init` criará o diretório `.factory/` e copiará todos os arquivos necessários.

```bash
factory init
```

**O que você deve ver**:

```
Agent Factory - Project Initialization

✓ Factory project initialized!

Project structure created:
  .factory/
    agents/
    skills/
    templates/
    policies/
    pipeline.yaml
    config.yaml
    state.json

Checking and installing required Claude plugins...
Installing superpowers plugin... ✓
Installing ui-ux-pro-max-skill plugin... ✓
Plugins installed!

Starting Claude Code...
✓ Claude Code is starting...
  (Please wait for window to open)
```

### Etapa 3: Personalizar com parâmetros opcionais (opcional)

**Por que**: se você tiver preferências claras de stack tecnológica, pode especificá-las durante a inicialização.

```bash
factory init --name "Meu aplicativo de contabilidade" --description "Ajudar jovens a registrar despesas diárias"
```

Esses parâmetros serão gravados em `config.yaml` e afetarão o código gerado subsequentemente.

### Etapa 4: Verificar a estrutura de diretórios gerada

**Por que**: confirmar que todos os arquivos foram gerados corretamente.

```bash
ls -la
```

**O que você deve ver**:

```
.claude/              # Diretório de configuração do Claude Code
  └── settings.local.json   # Configuração de permissões

.factory/            # Diretório principal do Factory
  ├── agents/          # Arquivos de definição de Agent
  ├── skills/          # Módulos de habilidades
  ├── templates/       # Modelos de configuração
  ├── policies/        # Políticas e especificações
  ├── pipeline.yaml    # Definição do pipeline
  ├── config.yaml      # Configuração do projeto
  └── state.json      # Estado do pipeline
```

## Ponto de verificação ✅

Certifique-se de que os seguintes arquivos foram criados:

- [ ] `.factory/pipeline.yaml` existe
- [ ] `.factory/config.yaml` existe
- [ ] `.factory/state.json` existe
- [ ] `.claude/settings.local.json` existe
- [ ] diretório `.factory/agents/` contém 7 arquivos `.agent.md`
- [ ] diretório `.factory/skills/` contém 6 módulos de habilidades
- [ ] diretório `.factory/policies/` contém 7 documentos de políticas

## Explicação detalhada dos arquivos gerados

### config.yaml: configuração do projeto

`config.yaml` contém informações básicas do projeto e estado do pipeline:

```yaml
project:
  name: my-app                  # Nome do projeto
  description: ""                # Descrição do projeto
  created_at: "2026-01-30T00:00:00.000Z"  # Data de criação
  updated_at: "2026-01-30T00:00:00.000Z"  # Data de atualização

pipeline:
  current_stage: null           # Etapa de execução atual
  completed_stages: []          # Lista de etapas concluídas
  last_checkpoint: null         # Último ponto de verificação

settings:
  auto_save: true               # Salvar automaticamente
  backup_on_error: true        # Fazer backup ao ocorrer erro
```

::: tip Modificar configuração

Você pode editar `config.yaml` diretamente após `factory init`, e ele entrará em vigor automaticamente durante a execução do pipeline. Não é necessário reinicializar.

:::

### state.json: estado do pipeline

`state.json` registra o progresso de execução do pipeline:

```json
{
  "version": 1,
  "status": "idle",
  "current_stage": null,
  "completed_stages": [],
  "started_at": null,
  "last_updated": "2026-01-30T00:00:00.000Z"
}
```

- `status`: estado atual (é `idle` na inicialização, mudará dinamicamente para `running`, `waiting_for_confirmation`, `paused`, `failed` durante a execução)
- `current_stage`: etapa em execução
- `completed_stages`: lista de etapas concluídas

::: info Explicação de estados

O pipeline usa uma máquina de estados para executar. O estado é `idle` na inicialização. Outros valores de estado são definidos dinamicamente durante a execução do pipeline:
- `idle`: aguardando início
- `running`: executando uma etapa
- `waiting_for_confirmation`: aguardando confirmação manual para continuar, tentar novamente ou pausar
- `paused`: pausado manualmente
- `failed`: falha detectada, exigindo intervenção manual

:::

::: warning Não edite manualmente

`state.json` é mantido automaticamente pelo pipeline. A edição manual pode causar inconsistência de estado. Para redefinir, use o comando `factory reset`.

:::

### pipeline.yaml: definição do pipeline

Define a ordem de execução e as dependências de 7 etapas:

```yaml
stages:
  - id: bootstrap
    description: Inicializar ideia do projeto
    agent: agents/bootstrap.agent.md
    inputs: []
    outputs: [input/idea.md]

  - id: prd
    description: Gerar documento de requisitos do produto
    agent: agents/prd.agent.md
    inputs: [input/idea.md]
    outputs: [artifacts/prd/prd.md]

  # ... outras etapas
```

::: info Ordem do pipeline

O pipeline é executado estritamente em ordem, não podendo ser ignorado. Cada etapa será pausada após a conclusão, aguardando confirmação.

:::

### .claude/settings.local.json: configuração de permissões

Configuração de permissões do Claude Code gerada automaticamente, contendo:

- **Permissões de arquivo**: Read/Write/Glob/Edit para o diretório do projeto
- **Permissões de comando Bash**: git, npm, npx, docker, etc.
- **Permissões de Skills**: superpowers, ui-ux-pro-max e outras habilidades necessárias
- **Permissões de WebFetch**: permitindo acesso a domínios específicos (GitHub, NPM, etc.)

::: danger Segurança

As configurações de permissão se aplicam apenas ao diretório do projeto atual e não afetam outros locais do sistema. Este é um dos designs de segurança do Factory.

:::

## Avisos sobre armadilhas

### Erro de diretório não vazio

**Mensagem de erro**:

```
Cannot initialize: directory is not empty.
Factory init requires an empty directory or one with only git/config files.
```

**Causa**: existem arquivos ou diretórios incompatíveis no diretório (como `artifacts/`, `input/`, etc.)

**Solução**:

1. Limpar arquivos conflitantes:
   ```bash
   rm -rf artifacts/ input/
   ```

2. Ou usar um novo diretório:
   ```bash
   mkdir my-app-new && cd my-app-new
   factory init
   ```

### Já é um projeto Factory

**Mensagem de erro**:

```
This directory is already a Factory project:
  Name: my-app
  Created: 2026-01-29T13:00:00.000Z

To reset project, use: factory reset
```

**Causa**: o diretório `.factory/` já existe

**Solução**:

```bash
# Redefinir estado do projeto (manter artefatos)
factory reset

# Ou reinicializar completamente (excluir todo o conteúdo)
rm -rf .factory/
factory init
```

### Claude Code não instalado

**Mensagem de erro**:

```
Claude CLI not found - skipping plugin installation
Install Claude Code to enable plugins: https://claude.ai/code
```

**Causa**: CLI do Claude Code não instalado

**Solução**:

1. Instalar Claude Code: https://claude.ai/code
2. Ou executar o pipeline manualmente (consulte [Início rápido](../getting-started/))

### Falha na instalação de plugins

**Mensagem de erro**:

```
Installing superpowers plugin... (failed)
Note: superpowers plugin installation failed
The bootstrap stage may prompt you to install it manually
```

**Causa**: problemas de rede ou problemas de configuração do Claude Code

**Solução**:

Ignore o aviso e continue usando. A etapa Bootstrap solicitará que você instale o plugins manualmente.

## Resumo da lição

Nesta lição você aprendeu:

1. ✅ Usar o comando `factory init` para inicializar um projeto Factory
2. ✅ Compreender a estrutura do diretório `.factory/` gerado
3. ✅ Conhecer as opções de configuração do `config.yaml`
4. ✅ Entender o gerenciamento de estado do `state.json`
5. ✅ Saber a configuração de permissões do `.claude/settings.local.json`

Após a conclusão da inicialização, o projeto está pronto para executar o pipeline. O próximo passo é aprender[Visão geral do pipeline](../pipeline-overview/) e entender o processo completo da ideia ao aplicativo.

## Próximo teaser

> Na próxima lição, aprenderemos **[Visão geral do pipeline](../pipeline-overview/)**.
>
> Você aprenderá:
> - Ordem e dependências das 7 etapas
> - Entrada e saída de cada etapa
> - Como o mecanismo de pontos de verificação garante a qualidade
> - Tratamento de falhas e estratégias de nova tentativa

---

## Apêndice: referência de código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Hora da atualização: 2026-01-29

| Funcionalidade        | Caminho do arquivo                                                                                    | Número da linha    |
| ----------- | ------------------------------------------------------------------------------------------- | ------- |
| Lógica principal do init | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js)         | 220-456  |
| Verificação de segurança do diretório | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js)         | 32-53    |
| Geração de configuração    | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js)         | 58-76    |
| Configuração de permissões do Claude | [`cli/utils/claude-settings.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/utils/claude-settings.js) | 41-248   |
| Definição do pipeline  | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml)               | 7-111    |
| Modelo de configuração do projeto | [`config.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/config.yaml)                   | 1-102    |

**Funções principais**:
- `isFactoryProject()`: verifica se o diretório já é um projeto Factory (linhas 22-26)
- `isDirectorySafeToInit()`: verifica se o diretório pode ser inicializado com segurança (linhas 32-53)
- `generateConfig()`: gera configuração do projeto (linhas 58-76)
- `generateClaudeSettings()`: gera configuração de permissões do Claude Code (linhas 256-275)

</details>
