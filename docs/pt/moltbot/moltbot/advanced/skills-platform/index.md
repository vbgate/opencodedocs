---
title: "Plataforma de Habilidades e ClawdHub: Estender o Assistente IA | Tutorial do Clawdbot | Clawdbot"
sidebarTitle: "Estender Capacidades da IA"
subtitle: "Plataforma de Habilidades e ClawdHub: Estender o Assistente IA | Tutorial do Clawdbot | Clawdbot"
description: "Aprenda a arquitetura do sistema de habilidades do Clawdbot e domine as três prioridades de carregamento de habilidades Bundled, Managed e Workspace. Use o ClawdHub para instalar e atualizar habilidades, configure regras de gateamento e o mecanismo de injeção de variáveis de ambiente."
tags:
  - "sistema de habilidades"
  - "ClawdHub"
  - "extensão IA"
  - "configuração de habilidades"
prerequisite:
  - "start-getting-start"
order: 280
---

# Plataforma de Habilidades e ClawdHub para Estender o Assistente IA | Tutorial do Clawdbot

## O que você poderá fazer após este curso

Após completar este curso, você poderá:

- Entender a arquitetura do sistema de habilidades do Clawdbot (três tipos de habilidades: Bundled, Managed, Workspace)
- Descobrir, instalar e atualizar habilidades via ClawdHub para estender as capacidades do seu assistente IA
- Configurar o estado de ativação, variáveis de ambiente e chaves API das habilidades
- Usar regras de gateamento (Gating) para garantir que as habilidades sejam carregadas apenas quando as condições forem atendidas
- Gerenciar o uso compartilhado e a prioridade de substituição de habilidades em cenários multi-agent

## Seu problema atual

O Clawdbot já fornece uma rica coleção de ferramentas integradas (navegador, execução de comandos, pesquisa web, etc.), mas quando você precisa:

- Chamar ferramentas CLI de terceiros (como `gemini`, `peekaboo`)
- Adicionar scripts de automação específicos de um domínio
- Fazer a IA aprender a usar seu conjunto de ferramentas personalizadas

Você pode pensar: "Como eu digo à IA quais ferramentas estão disponíveis? Onde eu devo colocar essas ferramentas? Múltiplos agentes podem compartilhar habilidades?"

O sistema de habilidades do Clawdbot foi projetado para isso: **declare habilidades através do arquivo SKILL.md, e o agente carrega e usa automaticamente**.

## Quando usar esta abordagem

- **Quando você precisa estender as capacidades da IA**: você quer adicionar novas ferramentas ou processos de automação
- **Na colaboração multi-agent**: diferentes agentes precisam compartilhar ou ter acesso exclusivo a habilidades
- **No gerenciamento de versões de habilidades**: instalar, atualizar e sincronizar habilidades via ClawdHub
- **No gateamento de habilidades**: garantir que as habilidades sejam carregadas apenas em ambientes específicos (OS, binários, configuração)

## 🎒 Preparativos antes de começar

Antes de começar, confirme:

- [ ] Você completou o [Início Rápido](../../start/getting-start/) e o Gateway está funcionando normalmente
- [ ] Você configurou pelo menos um modelo de IA (Anthropic, OpenAI, Ollama, etc.)
- [ ] Você entende operações básicas de linha de comando (`mkdir`, `cp`, `rm`)

## Conceitos fundamentais

### O que é uma habilidade?

Uma habilidade é um diretório que contém um arquivo `SKILL.md` (instruções para o LLM e definições de ferramentas), bem como scripts ou recursos opcionais. O arquivo `SKILL.md` usa YAML frontmatter para definir metadados e Markdown para descrever o uso da habilidade.

O Clawdbot é compatível com a especificação [AgentSkills](https://agentskills.io), de modo que as habilidades podem ser carregadas por outras ferramentas que seguem esta especificação.

#### Três locais de carregamento de habilidades

As habilidades são carregadas de três lugares, em ordem de prioridade do mais alto para o mais baixo:

1. **Habilidades Workspace**: `<workspace>/skills` (prioridade mais alta)
2. **Habilidades Managed/locais**: `~/.clawdbot/skills`
3. **Habilidades Bundled**: fornecidas com o pacote de instalação (prioridade mais baixa)

::: info Regra de prioridade
Se existir uma habilidade com o mesmo nome em múltiplos locais, as habilidades Workspace substituem as habilidades Managed e Bundled.
:::

Além disso, você pode configurar diretórios de habilidades adicionais via `skills.load.extraDirs` (prioridade mais baixa).

#### Compartilhamento de habilidades em cenários multi-agent

Em uma configuração multi-agent, cada agente tem seu próprio workspace:

- **Habilidades Per-agent**: localizadas em `<workspace>/skills`, visíveis apenas para esse agente
- **Habilidades compartilhadas**: localizadas em `~/.clawdbot/skills`, visíveis para todos os agentes na mesma máquina
- **Pasta compartilhada**: pode ser adicionada via `skills.load.extraDirs` (prioridade mais baixa), usada para que múltiplos agentes compartilhem o mesmo pacote de habilidades

Em caso de conflito de nomes, a regra de prioridade também se aplica: Workspace > Managed > Bundled.

#### Gateamento de habilidades (Gating)

O Clawdbot filtra habilidades com base no campo `metadata` ao carregar, garantindo que as habilidades sejam carregadas apenas quando as condições forem atendidas:

```markdown
---
name: nano-banana-pro
description: Generate or edit images via Gemini 3 Pro Image
metadata: {"clawdbot":{"requires":{"bins":["uv"],"env":["GEMINI_API_KEY"],"config":["browser.enabled"]},"primaryEnv":"GEMINI_API_KEY"}}
---
```

Campos sob `metadata.clawdbot`:

- `always: true`: sempre carregar a habilidade (pular outros gateamentos)
- `emoji`: emoji exibido na interface de habilidades do macOS
- `homepage`: link para o site exibido na interface de habilidades do macOS
- `os`: lista de plataformas (`darwin`, `linux`, `win32`), a habilidade só está disponível nestes sistemas operacionais
- `requires.bins`: lista, cada um deve existir em `PATH`
- `requires.anyBins`: lista, pelo menos um deve existir em `PATH`
- `requires.env`: lista, as variáveis de ambiente devem existir ou serem fornecidas na configuração
- `requires.config`: lista de caminhos `clawdbot.json`, devem ser verdadeiros
- `primaryEnv`: nome da variável de ambiente associada a `skills.entries.<name>.apiKey`
- `install`: array de especificações de instalador opcionais (para interface de habilidades do macOS)

::: warning Verificação de binários em ambiente de sandbox
`requires.bins` é verificado no **host** ao carregar a habilidade. Se o agente está sendo executado em um sandbox, o binário também deve existir dentro do contêiner.
Dependências podem ser instaladas via `agents.defaults.sandbox.docker.setupCommand`.
:::

### Injeção de variáveis de ambiente

Quando a execução do agente começa, o Clawdbot:

1. Lê os metadados da habilidade
2. Aplica todos os `skills.entries.<key>.env` ou `skills.entries.<key>.apiKey` ao `process.env`
3. Constrói o prompt do sistema usando habilidades que atendem às condições
4. Restaura o ambiente original após o término da execução do agente

Isso é **limitado ao escopo de execução do agente**, não é o ambiente global do Shell.

## Siga estes passos

### Passo 1: Ver as habilidades instaladas

Use a CLI para listar as habilidades disponíveis atualmente:

```bash
clawdbot skills list
```

Ou ver apenas as habilidades que atendem às condições:

```bash
clawdbot skills list --eligible
```

**Você deveria ver**: lista de habilidades, incluindo nome, descrição, se atende às condições (como binários, variáveis de ambiente)

### Passo 2: Instalar habilidades via ClawdHub

O ClawdHub é o registro público de habilidades do Clawdbot, onde você pode navegar, instalar, atualizar e publicar habilidades.

#### Instalar CLI

Escolha um método para instalar a CLI do ClawdHub:

```bash
npm i -g clawdhub
```

ou

```bash
pnpm add -g clawdhub
```

#### Pesquisar habilidades

```bash
clawdhub search "postgres backups"
```

#### Instalar habilidade

```bash
clawdhub install <skill-slug>
```

Por padrão, a CLI instala no subdiretório `./skills` do diretório de trabalho atual (ou volta para o workspace do Clawdbot configurado). O Clawdbot carregará como `<workspace>/skills` na próxima sessão.

**Você deveria ver**: saída de instalação, mostrando a pasta de habilidade e informações de versão.

### Passo 3: Atualizar habilidades instaladas

Atualizar todas as habilidades instaladas:

```bash
clawdhub update --all
```

Ou atualizar uma habilidade específica:

```bash
clawdhub update <slug>
```

**Você deveria ver**: status de atualização de cada habilidade, incluindo mudanças de versão.

### Passo 4: Configurar substituição de habilidades

Em `~/.clawdbot/clawdbot.json`, configure o estado de ativação, variáveis de ambiente, etc., das habilidades:

```json5
{
  "skills": {
    "entries": {
      "nano-banana-pro": {
        "enabled": true,
        "apiKey": "GEMINI_KEY_HERE",
        "env": {
          "GEMINI_API_KEY": "GEMINI_KEY_HERE"
        },
        "config": {
          "endpoint": "https://example.invalid",
          "model": "nano-pro"
        }
      },
      "peekaboo": { "enabled": true },
      "sag": { "enabled": false }
    }
  }
}
```

**Regras**:

- `enabled: false`: desabilita a habilidade, mesmo se for Bundled ou instalada
- `env`: injeta variáveis de ambiente (apenas quando a variável não está configurada no processo)
- `apiKey`: campo conveniente para habilidades que declaram `metadata.clawdbot.primaryEnv`
- `config`: pacote de campos personalizados opcionais, chaves personalizadas devem ser colocadas aqui

**Você deveria ver**: após salvar a configuração, o Clawdbot aplicará essas configurações na próxima execução do agente.

### Passo 5: Habilitar monitor de habilidades (opcional)

Por padrão, o Clawdbot monitora a pasta de habilidades e atualiza o snapshot de habilidades quando o arquivo `SKILL.md` muda. Você pode configurar isso em `skills.load`:

```json5
{
  "skills": {
    "load": {
      "watch": true,
      "watchDebounceMs": 250
    }
  }
}
```

**Você deveria ver**: após modificar o arquivo de habilidade, sem necessidade de reiniciar o Gateway, o Clawdbot atualizará automaticamente a lista de habilidades no próximo turno do agente.

### Passo 6: Depurar problemas de habilidades

Ver informações detalhadas da habilidade e dependências faltantes:

```bash
clawdbot skills info <name>
```

Verificar o status de dependências de todas as habilidades:

```bash
clawdbot skills check
```

**Você deveria ver**: informações detalhadas da habilidade, incluindo binários, variáveis de ambiente, status de configuração, e condições faltantes.

## Ponto de verificação ✅

Após completar os passos acima, você deve ser capaz de:

- [ ] Usar `clawdbot skills list` para ver todas as habilidades disponíveis
- [ ] Instalar novas habilidades via ClawdHub
- [ ] Atualizar habilidades instaladas
- [ ] Configurar substituição de habilidades em `clawdbot.json`
- [ ] Usar `skills check` para depurar problemas de dependências de habilidades

## Avisos comuns

### Erro comum 1: nome de habilidade contendo hífenes

**Problema**: usar o nome da habilidade com hífenes como chave em `skills.entries`

```json
// ❌ Erro: sem aspas
{
  "skills": {
    "entries": {
      nano-banana-pro: { "enabled": true }  // Erro de sintaxe JSON
    }
  }
}
```

**Correção**: envolver a chave com aspas (JSON5 suporta chaves com aspas)

```json
// ✅ Correto: com aspas
{
  "skills": {
    "entries": {
      "nano-banana-pro": { "enabled": true }
    }
  }
}
```

### Erro comum 2: variáveis de ambiente em ambiente de sandbox

**Problema**: a habilidade está sendo executada em um sandbox, mas `skills.entries.<skill>.env` ou `apiKey` não têm efeito

**Causa**: o `env` global e `skills.entries.<skill>.env/apiKey` se aplicam apenas à **execução no host**, o sandbox não herda o `process.env` do host.

**Correção**: usar um dos seguintes métodos:

```json5
{
  "agents": {
    "defaults": {
      "sandbox": {
        "docker": {
          "env": {
            "GEMINI_API_KEY": "your_key_here"
          }
        }
      }
    }
  }
}
```

Ou bake as variáveis de ambiente na imagem sandbox personalizada.

### Erro comum 3: habilidade não aparece na lista

**Problema**: habilidade instalada, mas `clawdbot skills list` não a exibe

**Possíveis causas**:

1. A habilidade não atende às condições de gateamento (binários faltando, variáveis de ambiente, configuração)
2. A habilidade está desabilitada (`enabled: false`)
3. A habilidade não está nos diretórios escaneados pelo Clawdbot

**Etapas de solução de problemas**:

```bash
# Verificar dependências de habilidade
clawdbot skills check

# Verificar se o diretório de habilidades está sendo escaneado
ls -la ~/.clawdbot/skills/
ls -la <workspace>/skills/
```

### Erro comum 4: conflitos de habilidades e confusão de prioridade

**Problema**: existe uma habilidade com o mesmo nome em múltiplos locais, qual é carregada?

**Lembre-se da prioridade**:

`<workspace>/skills` (mais alta) → `~/.clawdbot/skills` → bundled skills (mais baixa)

Se você quiser usar habilidades Bundled em vez de substituição de Workspace:

1. Excluir ou renomear `<workspace>/skills/<skill-name>`
2. Ou desabilitar essa habilidade em `skills.entries`

## Resumo do curso

Neste curso, você aprendeu os conceitos fundamentais da plataforma de habilidades do Clawdbot:

- **Três tipos de habilidades**: Bundled, Managed, Workspace, carregadas por prioridade
- **Integração ClawdHub**: registro público para navegar, instalar, atualizar e publicar habilidades
- **Gateamento de habilidades**: filtrar habilidades pelo campo `requires` dos metadados
- **Configuração de substituição**: controlar ativação, variáveis de ambiente e configuração personalizada em `clawdbot.json`
- **Monitor de habilidades**: atualiza automaticamente a lista de habilidades sem necessidade de reiniciar o Gateway

O sistema de habilidades é o mecanismo central para estender as capacidades do Clawdbot. Dominá-lo permite que seu assistente IA se adapte a mais cenários e ferramentas.

## Próximo curso

> No próximo curso, aprenderemos **[Segurança e Isolamento de Sandbox](../security-sandbox/)**.
>
> Você aprenderá:
> - Modelo de segurança e controle de permissões
> - Allowlist/denylist de permissões de ferramentas
> - Mecanismo de isolamento de sandbox Docker
> - Configuração de segurança do Gateway remoto

---

#### Apêndice: Referência do código-fonte

<details>
<summary><strong>Clique para expandir e ver locais do código-fonte</strong></summary>

> Data de atualização: 2026-01-27

| Funcionalidade | Caminho do arquivo | Número da linha |
|--- | --- | ---|
| Definição de tipo de configuração de habilidades | [`src/config/types.skills.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/types.skills.ts) | 1-32 |
| Documentação do sistema de habilidades | [`docs/tools/skills.md`](https://github.com/moltbot/moltbot/blob/main/docs/tools/skills.md) | 1-260 |
| Referência de configuração de habilidades | [`docs/tools/skills-config.md`](https://github.com/moltbot/moltbot/blob/main/docs/tools/skills-config.md) | 1-76 |
| Documentação ClawdHub | [`docs/tools/clawdhub.md`](https://github.com/moltbot/moltbot/blob/main/docs/tools/clawdhub.md) | 1-202 |
| Guia de criação de habilidades | [`docs/tools/creating-skills.md`](https://github.com/moltbot/moltbot/blob/main/docs/tools/creating-skills.md) | 1-42 |
| Comandos CLI | [`docs/cli/skills.md`](https://github.com/moltbot/moltbot/blob/main/docs/cli/skills.md) | 1-26 |

**Tipos principais**:

- `SkillConfig`: configuração de habilidade individual (enabled, apiKey, env, config)
- `SkillsLoadConfig`: configuração de carregamento de habilidades (extraDirs, watch, watchDebounceMs)
- `SkillsInstallConfig`: configuração de instalação de habilidades (preferBrew, nodeManager)
- `SkillsConfig`: configuração de habilidades de nível superior (allowBundled, load, install, entries)

**Exemplos de habilidades integradas**:

- `skills/gemini/SKILL.md`: habilidade de CLI Gemini
- `skills/peekaboo/SKILL.md`: habilidade de automação de UI macOS Peekaboo

</details>
