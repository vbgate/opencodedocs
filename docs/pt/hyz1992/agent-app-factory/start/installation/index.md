---
title: "Instalação e Configuração | Tutorial do Agent App Factory"
sidebarTitle: "Instalação em 5 Minutos"
subtitle: "Instalação e Configuração | Tutorial do Agent App Factory"
description: "Aprenda como instalar a ferramenta CLI do Agent App Factory, configurar o Claude Code ou OpenCode, e instalar os plugins necessários. Este tutorial cobre os requisitos do Node.js, configuração do assistente de IA e etapas de instalação de plugins."
tags:
  - "Instalação"
  - "Configuração"
  - "Claude Code"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
order: 20
---

# Instalação e Configuração

## O que Você Vai Aprender

✅ Instalar a ferramenta CLI do Agent App Factory e verificar a instalação
✅ Configurar o Claude Code ou OpenCode como motor de execução de IA
✅ Instalar os plugins necessários para executar o pipeline
✅ Completar a inicialização do projeto e iniciar o primeiro projeto Factory

## Seu Desafio Atual

Você quer usar o AI App Factory para transformar suas ideias em aplicativos, mas não sabe quais ferramentas instalar nem como configurar o ambiente. Depois de instalar tudo, teme ter esquecido algum plugin essencial que fará o pipeline falhar no meio da execução.

## Quando Usar Este Método

Use este método quando estiver usando o AI App Factory pela primeira vez, ou configurando um novo ambiente de desenvolvimento em uma máquina nova. Complete a instalação e configuração antes de começar a gerar aplicativos.

## 🎒 Preparação Antes de Começar

::: warning Requisitos Prévios

Antes de iniciar a instalação, certifique-se de:

- **Node.js versão >= 16.0.0** - Este é o requisito mínimo para a ferramenta CLI
- **npm ou yarn** - Para instalação global de pacotes
- **Um assistente de IA** - Claude Code ou OpenCode (recomendado: Claude Code)

:::

**Verificar versão do Node.js**:

```bash
node --version
```

Se a versão for inferior a 16.0.0, baixe e instale a versão mais recente do LTS em [Node.js oficial](https://nodejs.org).

## Ideia Central

A instalação do AI App Factory consiste em 3 componentes-chave:

1. **Ferramenta CLI** - Fornece interface de linha de comando, gerencia o estado do projeto
2. **Assistente de IA** - O "cérebro" que executa o pipeline, interpreta comandos de Agentes
3. **Plugins necessários** - Pacotes de extensão que aumentam as capacidades da IA (brainstorm do Bootstrap, sistema de design de UI)

Fluxo de instalação: Instalar CLI → Configurar assistente de IA → Inicializar projeto (instala plugins automaticamente)

## Siga-me

### Passo 1: Instalar a ferramenta CLI

Instale globalmente o Agent App Factory CLI para que você possa usar o comando `factory` em qualquer diretório.

```bash
npm install -g agent-app-factory
```

**O que você deve ver**: Saída de instalação bem-sucedida

```
added 1 package in Xs
```

**Verificar instalação**:

```bash
factory --version
```

**O que você deve ver**: Saída do número da versão

```
1.0.0
```

Se você não consegue ver o número da versão, verifique se a instalação foi bem-sucedida:

```bash
which factory  # macOS/Linux
where factory  # Windows
```

::: tip Falha na instalação?

Se você encontrar problemas de permissão (macOS/Linux), tente:

```bash
sudo npm install -g agent-app-factory
```

Ou use o npx sem instalar globalmente (não recomendado, baixa a cada vez que usar):

```bash
npx agent-app-factory init
```

:::

### Passo 2: Instalar o assistente de IA

O AI App Factory precisa funcionar em conjunto com um assistente de IA, pois as definições de Agent e arquivos Skill são comandos de IA em formato Markdown que precisam ser interpretados e executados pela IA.

#### Opção A: Claude Code (Recomendado)

Claude Code é o assistente de programação de IA oficial da Anthropic, profundamente integrado ao AI App Factory.

**Como instalar**:

1. Acesse [Claude Code oficial](https://claude.ai/code)
2. Baixe e instale o aplicativo para sua plataforma
3. Após a conclusão da instalação, verifique se o comando está disponível:

```bash
claude --version
```

**O que você deve ver**: Saída do número da versão

```
Claude Code 1.x.x
```

#### Opção B: OpenCode

OpenCode é outro assistente de programação de IA que suporta o modo Agent.

**Como instalar**:

1. Acesse [OpenCode oficial](https://opencode.sh)
2. Baixe e instale o aplicativo para sua plataforma
3. Se não houver ferramenta de linha de comando, baixe e instale manualmente em:

- **Windows**: `%LOCALAPPDATA%\Programs\OpenCode\`
- **macOS**: `/Applications/OpenCode.app/`
- **Linux**: `/usr/bin/opencode` ou `/usr/local/bin/opencode`

::: info Por que o Claude Code é recomendado?

- Suporte oficial, melhor integração com o sistema de permissões do AI App Factory
- Instalação automatizada de plugins, `factory init` configurará automaticamente os plugins necessários
- Melhor gerenciamento de contexto, economiza Tokens

:::
### Passo 3: Inicializar o primeiro projeto Factory

Agora que você tem uma fábrica limpa, vamos inicializar o primeiro projeto.

**Criar diretório do projeto**:

```bash
mkdir meu-primeiro-app && cd meu-primeiro-app
```

**Inicializar projeto Factory**:

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
    policies/
    templates/
    pipeline.yaml
    config.yaml
    state.json

✓ Plugins installed!

Starting Claude Code...
✓ Claude Code is starting...
  (Please wait for window to open)
```

**Ponto de verificação ✅**: Confirme que os seguintes arquivos foram criados

```bash
ls -la .factory/
```

**O que você deve ver**:

```
agents/
skills/
policies/
templates/
pipeline.yaml
config.yaml
state.json
```

Ao mesmo tempo, a janela do Claude Code deve abrir automaticamente.

::: tip O diretório deve estar vazio

`factory init` só pode ser executado em um diretório vazio ou em um diretório que contenha apenas arquivos de configuração como `.git`, `README.md`, etc.

Se houver outros arquivos no diretório, você verá um erro:

```
Cannot initialize: directory is not empty.
Factory init requires an empty directory or one with only git/config files.
```

:::

### Passo 4: Plugins instalados automaticamente

`factory init` tentará instalar automaticamente dois plugins necessários:

1. **superpowers** - Habilidades de brainstorm para a fase Bootstrap
2. **ui-ux-pro-max-skill** - Sistema de design para a fase UI (67 estilos, 96 paletas de cores, 100 regras do setor)

Se a instalação automática falhar, você verá um aviso:

```
Note: superpowers plugin installation failed
The bootstrap stage may prompt you to install it manually
```

::: warning O que fazer se a instalação do plugin falhar?

Se a instalação do plugin falhar durante a inicialização, você pode instalar manualmente no Claude Code posteriormente:

1. No Claude Code, digite:
   ```
   /install superpowers
   /install ui-ux-pro-max-skill
   ```

2. Ou visite a marketplace de plugins para instalar manualmente

:::

### Passo 5: Verificar permissões do assistente de IA

`factory init` gerará automaticamente o arquivo `.claude/settings.local.json` e configurará as permissões necessárias.

**Verificar configuração de permissões**:

```bash
cat .claude/settings.local.json
```

**O que você deve ver** (versão simplificada):

```json
{
  "allowedCommands": [
    "read",
    "write",
    "glob",
    "bash"
  ],
  "allowedPaths": [
    ".factory/**",
    "input/**",
    "artifacts/**"
  ]
}
```

Essas permissões garantem que o assistente de IA possa:
- Ler definições de Agent e arquivos Skill
- Escrever artefatos no diretório `artifacts/`
- Executar scripts e testes necessários

::: danger Não use --dangerously-skip-permissions

As configurações de permissão geradas pelo AI App Factory já são suficientemente seguras. Não use `--dangerously-skip-permissions` no Claude Code, pois isso reduzirá a segurança e poderá levar a operações não autorizadas.

:::
## Problemas Comuns

### ❌ Versão do Node.js muito baixa

**Erro**: `npm install -g agent-app-factory` falha na instalação ou exibe erros durante a execução

**Motivo**: Versão do Node.js inferior a 16.0.0

**Solução**: Atualize o Node.js para a versão mais recente do LTS

```bash
# Usar nvm para atualizar (recomendado)
nvm install --lts
nvm use --lts
```

### ❌ Claude Code não instalado corretamente

**Erro**: Após executar `factory init`, aparece a mensagem "Claude CLI not found"

**Motivo**: Claude Code não foi adicionado ao PATH corretamente

**Solução**: Reinstale o Claude Code, ou adicione manualmente o caminho do executável às variáveis de ambiente

- **Windows**: Adicione o diretório de instalação do Claude Code ao PATH
- **macOS/Linux**: Verifique se existe o executável `claude` em `/usr/local/bin/`

### ❌ Diretório não vazio

**Erro**: `factory init` exibe a mensagem "directory is not empty"

**Motivo**: O diretório já contém outros arquivos (além de arquivos de configuração como `.git`, `README.md`)

**Solução**: Inicialize em um novo diretório vazio, ou limpe o diretório existente

```bash
# Remover arquivos não de configuração do diretório
rm -rf * !(.git) !(README.md)
```

### ❌ Falha na instalação do plugin

**Erro**: `factory init` exibe um aviso de falha na instalação do plugin

**Motivo**: Problemas de rede ou a marketplace de plugins do Claude Code está temporariamente indisponível

**Solução**: Instale os plugins manualmente no Claude Code, ou siga as instruções durante a execução subsequente do pipeline

```
/install superpowers
/install ui-ux-pro-max-skill
```

## Resumo

Esta lição completou a instalação e configuração completa do AI App Factory:

1. ✅ **Ferramenta CLI** - Instalada globalmente via `npm install -g agent-app-factory`
2. ✅ **Assistente de IA** - Claude Code ou OpenCode, recomendado Claude Code
3. ✅ **Inicialização do projeto** - `factory init` cria o diretório `.factory/` e configura automaticamente
4. ✅ **Plugins necessários** - superpowers e ui-ux-pro-max-skill (instalação automática ou manual)
5. ✅ **Configuração de permissões** - Gera automaticamente o arquivo de permissões do Claude Code

Agora você tem um projeto Factory funcional, a janela do Claude Code está aberta e pronta para executar o pipeline.
## Próxima Lição

> Na próxima lição, aprenderemos **[Inicializar projeto Factory](../init-project/)**.
>
> Você aprenderá:
> - Entender a estrutura de diretório gerada por `factory init`
> - Compreender a finalidade de cada arquivo no diretório `.factory/`
> - Dominar como modificar a configuração do projeto
> - Aprender como verificar o estado do projeto

Pronto para começar a gerar seu primeiro aplicativo? Vamos lá!

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-29

| Função           | Caminho do arquivo                                                                                           | Linha    |
| -------------- | -------------------------------------------------------------------------------------------------- | ------- |
| Entrada CLI       | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js)         | 1-123   |
| Comando inicialização     | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js)     | 1-457   |
| Requisito Node.js   | [`package.json`](https://github.com/hyz1992/agent-app-factory/blob/main/package.json)                    | 41      |
| Inicialização Claude Code | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L119-L147) | 119-147 |
| Inicialização OpenCode | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L152-L215) | 152-215 |
| Verificação de instalação de plugins | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L360-L392) | 360-392 |
| Geração de configuração de permissões   | [`cli/utils/claude-settings.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/utils/claude-settings.js) | 1-275   |

**Constantes-chave**:
- `NODE_VERSION_MIN = "16.0.0"`: Requisito mínimo de versão do Node.js (package.json:41)

**Funções-chave**:
- `getFactoryRoot()`: Obtém o diretório raiz de instalação do Factory (factory.js:22-52)
- `init()`: Inicializa o projeto Factory (init.js:220-456)
- `launchClaudeCode()`: Inicia o Claude Code (init.js:119-147)
- `launchOpenCode()`: Inicia o OpenCode (init.js:152-215)
- `generateClaudeSettings()`: Gera a configuração de permissões do Claude Code

</details>
