---
title: "Instalação de Plugins Obrigatórios: superpowers e ui-ux-pro-max | Tutorial AI App Factory"
sidebarTitle: "Instalar Plugins em 5 Minutos"
subtitle: "Instalação de Plugins Obrigatórios: superpowers e ui-ux-pro-max | Tutorial AI App Factory"
description: "Aprenda como instalar e verificar os dois plugins obrigatórios do AI App Factory: superpowers (para brainstorming Bootstrap) e ui-ux-pro-max (para sistema de design UI). Este tutorial abrange instalação automática, instalação manual, métodos de verificação e solução de problemas comuns, garantindo que o pipeline execute sem problemas e gere aplicativos de alta qualidade e funcionais, evitando falhas causadas por plugins ausentes."
tags:
  - "Instalação de Plugins"
  - "Claude Code"
  - "superpowers"
  - "ui-ux-pro-max"
prerequisite:
  - "start-installation"
  - "start-init-project"
  - "platforms-claude-code"
order: 70
---

# Instalação de Plugins Obrigatórios: superpowers e ui-ux-pro-max | Tutorial AI App Factory

## O Que Você Vai Aprender

- Verificar se os plugins superpowers e ui-ux-pro-max estão instalados
- Instalar manualmente esses dois plugins obrigatórios (se a instalação automática falhar)
- Verificar se os plugins estão corretamente habilitados
- Entender por que esses dois plugins são pré-requisitos para a execução do pipeline
- Solucionar problemas comuns de instalação de plugins

## Sua Situação Atual

Ao executar o pipeline do Factory, você pode encontrar:

- **Falha na fase Bootstrap**: Mensagem "não utilizou a skill superpowers:brainstorm"
- **Falha na fase UI**: Mensagem "não utilizou a skill ui-ux-pro-max"
- **Falha na instalação automática**: Erros durante a instalação de plugins no `factory init`
- **Conflito de plugins**: Já existe um plugin com o mesmo nome, mas versão incorreta
- **Problemas de permissão**: Plugins instalados não estão sendo habilitados corretamente

Na verdade, o Factory **tenta instalar automaticamente** esses dois plugins durante a inicialização, mas se falhar, você precisará lidar manualmente.

## Quando Usar Este Guia

Você precisará instalar os plugins manualmente quando:

- O `factory init` indicar falha na instalação de plugins
- As fases Bootstrap ou UI detectarem que as skills obrigatórias não foram utilizadas
- Estiver usando o Factory pela primeira vez e quiser garantir que o pipeline funcione corretamente
- A versão do plugin estiver desatualizada e precisar ser reinstalada

## Por Que Precisa Destes Dois Plugins

O pipeline do Factory depende de dois plugins cruciais do Claude Code:

| Plugin | Propósito | Fase do Pipeline | Skills Fornecidas |
| --- | --- | --- | --- |
| **superpowers** | Aprofundar ideias de produto | Bootstrap | `superpowers:brainstorm` - brainstorming sistemático, analisando problemas, usuários, valor e hipóteses |
| **ui-ux-pro-max** | Gerar sistema de design profissional | UI | `ui-ux-pro-max` - 67 estilos, 96 paletas de cores, 100 regras do setor |

::: warning Requisito Obrigatório
De acordo com a definição em `agents/orchestrator.checkpoint.md`, esses dois plugins são **obrigatórios**:
- **Fase Bootstrap**: Deve usar a skill `superpowers:brainstorm`, caso contrário o produto será rejeitado
- **Fase UI**: Deve usar a skill `ui-ux-pro-max`, caso contrário o produto será rejeitado

:::

## 🎒 Preparação Antes de Começar

Antes de começar, certifique-se de que:

- [ ] O Claude CLI está instalado (`claude --version` funciona)
- [ ] O projeto foi inicializado com `factory init`
- [ ] As permissões do Claude Code estão configuradas (consulte o [Guia de Integração do Claude Code](../claude-code/))
- [ ] A conexão de rede está funcionando (necessário para acessar o marketplace de plugins do GitHub)

## Ideia Central

A instalação de plugins segue um fluxo de quatro passos: **Verificar → Adicionar ao Marketplace → Instalar → Verificar**:

1. **Verificar**: Verificar se o plugin já está instalado
2. **Adicionar ao Marketplace**: Adicionar o repositório do plugin ao marketplace do Claude Code
3. **Instalar**: Executar o comando de instalação
4. **Verificar**: Confirmar que o plugin está habilitado

Os scripts de instalação automática do Factory (`cli/scripts/check-and-install-*.js`) executam esses passos automaticamente, mas você precisa conhecer o método manual para lidar com falhas.

## Siga os Passos

### Passo 1: Verificar o Status dos Plugins

**Por quê**
Primeiro confirme se já estão instalados para evitar operações repetidas.

Abra o terminal e execute no diretório raiz do projeto:

```bash
claude plugin list
```

**Você deve ver**: Uma lista de plugins instalados. Se contiver o seguinte, significa que já estão instalados:

```
✅ superpowers (enabled)
✅ ui-ux-pro-max (enabled)
```

Se não vir esses dois plugins, ou se mostrarem `disabled`, continue com os passos abaixo.

::: info Instalação Automática do factory init
O comando `factory init` executa automaticamente a verificação de instalação de plugins (linhas 360-392 do `init.js`). Se bem-sucedido, você verá:

```
📦 Installing superpowers plugin... ✓
📦 Installing ui-ux-pro-max-skill plugin... ✓
✅ Plugins installed!
```
:::

### Passo 2: Instalar o Plugin superpowers

**Por quê**
A fase Bootstrap precisa usar a skill `superpowers:brainstorm` para brainstorming.

#### Adicionar ao Marketplace de Plugins

```bash
claude plugin marketplace add obra/superpowers-marketplace
```

**Você deve ver**:

```
✅ Plugin marketplace added successfully
```

::: tip Falha ao Adicionar ao Marketplace
Se aparecer "marketplace de plugins já existe", pode ignorar e continuar com o passo de instalação.
:::

#### Instalar o Plugin

```bash
claude plugin install superpowers@superpowers-marketplace
```

**Você deve ver**:

```
✅ Plugin installed successfully
```

#### Verificar a Instalação

```bash
claude plugin list
```

**Você deve ver**: A lista contém `superpowers (enabled)`.

### Passo 3: Instalar o Plugin ui-ux-pro-max

**Por quê**
A fase UI precisa usar a skill `ui-ux-pro-max` para gerar o sistema de design.

#### Adicionar ao Marketplace de Plugins

```bash
claude plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
```

**Você deve ver**:

```
✅ Plugin marketplace added successfully
```

#### Instalar o Plugin

```bash
claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

**Você deve ver**:

```
✅ Plugin installed successfully
```

#### Verificar a Instalação

```bash
claude plugin list
```

**Você deve ver**: A lista contém `ui-ux-pro-max (enabled)`.

### Passo 4: Verificar se Ambos os Plugins Funcionam Corretamente

**Por quê**
Garantir que o pipeline pode chamar as skills desses dois plugins normalmente.

#### Verificar superpowers

Execute no Claude Code:

```
Por favor, use a skill superpowers:brainstorm para me ajudar a analisar a seguinte ideia de produto: [sua ideia]
```

**Você deve ver**: O Claude começa a usar a skill brainstorm, analisando sistematicamente problemas, usuários, valor e hipóteses.

#### Verificar ui-ux-pro-max

Execute no Claude Code:

```
Por favor, use a skill ui-ux-pro-max para projetar um esquema de cores para meu aplicativo
```

**Você deve ver**: O Claude retorna uma sugestão profissional de cores contendo várias opções de design.

## Pontos de Verificação ✅

Após completar os passos acima, confirme os seguintes pontos:

- [ ] Executar `claude plugin list` mostra ambos os plugins marcados como `enabled`
- [ ] No Claude Code, pode chamar a skill `superpowers:brainstorm`
- [ ] No Claude Code, pode chamar a skill `ui-ux-pro-max`
- [ ] Executar `factory run` não mostra mais mensagens de plugins ausentes

## Avisos de Problemas Comuns

### ❌ Plugin Instalado Mas Não Habilitado

**Sintoma**: `claude plugin list` mostra que o plugin existe mas não tem a marcação `enabled`.

**Solução**: Reexecute o comando de instalação:

```bash
claude plugin install <plugin-id>
```

### ❌ Permissão Bloqueada

**Sintoma**: Mensagem "Permission denied: Skill(superpowers:brainstorming)"

**Causa**: A configuração de permissões do Claude Code não inclui a permissão `Skill`.

**Solução**: Verifique se `.claude/settings.local.json` contém:

```json
{
  "permissions": [
    "Skill(superpowers:brainstorming)",
    "Skill(ui-ux-pro-max)"
  ]
}
```

::: info Configuração Completa de Permissões
Esta é uma configuração mínima de permissões. O comando `init` do Factory gera automaticamente um arquivo de configuração de permissões completo (incluindo `Skill(superpowers:brainstorm)` e outras permissões necessárias), geralmente não precisa ser editado manualmente.

Se precisar regenerar a configuração de permissões, execute no diretório raiz do projeto:
```bash
factory init --force-permissions
```
:::

Consulte o [Guia de Integração do Claude Code](../claude-code/) para regenerar a configuração de permissões.

### ❌ Falha ao Adicionar ao Marketplace

**Sintoma**: `claude plugin marketplace add` falha, mostrando "not found" ou erro de rede.

**Solução**:

1. Verifique a conexão de rede
2. Confirme que a versão do Claude CLI está atualizada: `npm update -g @anthropic-ai/claude-code`
3. Tente instalar diretamente: pule a adição ao marketplace e execute `claude plugin install <plugin-id>`

### ❌ Conflito de Versão do Plugin

**Sintoma**: Já existe um plugin com o mesmo nome instalado, mas a versão incorreta causa falha no pipeline.

**Solução**:

```bash
# Desinstalar versão antiga
claude plugin uninstall <nome-do-plugin>

# Reinstalar
claude plugin install <plugin-id>
```

### ❌ Problema de Caminho no Windows

**Sintoma**: Ao executar scripts no Windows, aparece "comando não encontrado".

**Solução**:

Use Node.js para executar os scripts de instalação diretamente:

```bash
node cli/scripts/check-and-install-superpowers.js
node cli/scripts/check-and-install-ui-skill.js
```

## Como Lidar com Falha na Instalação Automática

Se a instalação automática durante o `factory init` falhar, você pode:

1. **Verificar mensagens de erro**: O terminal mostrará a causa específica da falha
2. **Instalar manualmente**: Siga os passos acima para instalar os dois plugins manualmente
3. **Reexecutar**: O `factory run` detectará o status dos plugins e continuará o pipeline se já estiverem instalados

::: warning Não Afeta a Inicialização do Pipeline
Mesmo que a instalação de plugins falhe, o `factory init` ainda completará a inicialização. Você pode instalar os plugins manualmente posteriormente, sem afetar operações futuras.
:::

## Função dos Plugins no Pipeline

### Fase Bootstrap (requer superpowers)

- **Chamada de skill**: `superpowers:brainstorm`
- **Saída**: `input/idea.md` - Documento estruturado de ideia de produto
- **Ponto de verificação**: Verificar se o Agent explicitamente declarou o uso desta skill (`orchestrator.checkpoint.md:60-70`)

### Fase UI (requer ui-ux-pro-max)

- **Chamada de skill**: `ui-ux-pro-max`
- **Saída**: `artifacts/ui/ui.schema.yaml` - UI Schema contendo o sistema de design
- **Ponto de verificação**: Verificar se a configuração do sistema de design veio desta skill (`orchestrator.checkpoint.md:72-84`)

## Resumo da Aula

- O Factory depende de dois plugins obrigatórios: `superpowers` e `ui-ux-pro-max`
- O `factory init` tenta instalar automaticamente, mas requer tratamento manual se falhar
- Fluxo de instalação de plugins: Verificar → Adicionar ao Marketplace → Instalar → Verificar
- Certifique-se de que ambos os plugins estão no estado `enabled` e a configuração de permissões está correta
- As fases Bootstrap e UI do pipeline verificam obrigatoriamente o uso desses dois plugins

## Próxima Aula

> Na próxima aula aprenderemos **[Visão Geral do Pipeline de 7 Fases](../../start/pipeline-overview/)**.
>
> Você vai aprender:
> - O fluxo completo de execução do pipeline
> - Entradas, saídas e responsabilidades de cada fase
> - Como o mecanismo de checkpoints garante qualidade
> - Como recuperar de uma fase que falhou

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-29

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Script de verificação do plugin Superpowers | [`cli/scripts/check-and-install-superpowers.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/scripts/check-and-install-superpowers.js) | 1-208 |
| Script de verificação do plugin UI/UX Pro Max | [`cli/scripts/check-and-install-ui-skill.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/scripts/check-and-install-ui-skill.js) | 1-209 |
| Lógica de instalação automática de plugins | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 360-392 |
| Validação de skill na fase Bootstrap | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 60-70 |
| Validação de skill na fase UI | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 72-84 |

**Constantes Principais**:
- `PLUGIN_NAME = 'superpowers'`: Nome do plugin superpowers
- `PLUGIN_ID = 'superpowers@superpowers-marketplace'`: ID completo do superpowers
- `PLUGIN_MARKETPLACE = 'obra/superpowers-marketplace'`: Repositório do marketplace de plugins
- `UI_PLUGIN_NAME = 'ui-ux-pro-max'`: Nome do plugin UI
- `UI_PLUGIN_ID = 'ui-ux-pro-max@ui-ux-pro-max-skill'`: ID completo do plugin UI
- `UI_PLUGIN_MARKETPLACE = 'nextlevelbuilder/ui-ux-pro-max-skill'`: Repositório do marketplace de plugins UI

**Funções Principais**:
- `isPluginInstalled()`: Verificar se o plugin está instalado (através da saída de `claude plugin list`)
- `addToMarketplace()`: Adicionar plugin ao marketplace (`claude plugin marketplace add`)
- `installPlugin()`: Instalar plugin (`claude plugin install`)
- `verifyPlugin()`: Verificar se o plugin está instalado e habilitado
- `main()`: Função principal, executa o fluxo completo de Verificar → Adicionar → Instalar → Verificar

</details>
