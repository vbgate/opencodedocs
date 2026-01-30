---
title: "Integração Superpowers: Configuração do Fluxo de Trabalho | opencode-agent-skills"
subtitle: "Integração Superpowers: Configuração do Fluxo de Trabalho | opencode-agent-skills"
sidebarTitle: "Habilitar Superpowers"
description: "Aprenda os métodos de instalação e configuração do modo Superpowers. Ative a orientação de fluxo de trabalho através de variáveis de ambiente, domine o mapeamento de ferramentas e as regras de prioridade de namespaces."
tags:
  - "Configuração Avançada"
  - "Fluxo de Trabalho"
  - "Superpowers"
prerequisite:
  - "start-installation"
order: 2
---

# Integração do Fluxo de Trabalho Superpowers

## O Que Você Aprenderá

- Entenda o valor e os cenários aplicáveis do fluxo de trabalho Superpowers
- Instale e configure o modo Superpowers corretamente
- Compreenda o mapeamento de ferramentas e o sistema de namespace de habilidades
- Domine o mecanismo de injeção automática do Superpowers durante a compactação

## Seu Desafio Atual

Você pode estar considerando estas questões:

- **Fluxo de trabalho não padronizado**: Os hábitos de desenvolvimento da equipe não são uniformes, resultando em qualidade de código inconsistente
- **Falta de processos rigorosos**: Embora haja uma biblioteca de habilidades, o assistente de IA não tem orientação de processo clara
- **Chamadas de ferramentas confusas**: As ferramentas definidas pelo Superpowers têm nomes diferentes das ferramentas nativas do OpenCode, causando falhas nas chamadas
- **Alto custo de migração**: Você já está usando o Superpowers e preocupa-se em precisar reconfigurar após migrar para o OpenCode

Esses problemas afetam a eficiência de desenvolvimento e a qualidade do código.

## Ideia Central

::: info O que é Superpowers?
Superpowers é um framework completo de fluxo de trabalho de desenvolvimento de software que fornece orientação rigorosa de processos através de habilidades compostas. Ele define passos de desenvolvimento padronizados, métodos de chamada de ferramentas e um sistema de namespace.
:::

**O OpenCode Agent Skills oferece integração perfeita com o Superpowers**, que, uma vez ativado por variável de ambiente, injeta automaticamente orientação completa de fluxo de trabalho, incluindo:

1. **Conteúdo da habilidade using-superpowers**: Instruções principais do fluxo de trabalho Superpowers
2. **Mapeamento de ferramentas**: Mapeia os nomes de ferramentas definidos pelo Superpowers para as ferramentas nativas do OpenCode
3. **Namespace de habilidades**: Define claramente a prioridade e o método de referência das habilidades

## 🎒 Preparação Antes de Começar

Antes de começar, certifique-se de:

::: warning Verificação de Pré-requisitos
- ✅ Plugin [opencode-agent-skills](../../start/installation/) instalado
- ✅ Familiarizado com o mecanismo básico de descoberta de habilidades
:::

## Acompanhe o Processo

### Passo 1: Instalar o Superpowers

**Por que**
É necessário instalar o projeto Superpowers primeiro para que este plugin possa descobrir a habilidade `using-superpowers`.

**Como fazer**

Com base em suas necessidades, escolha uma das seguintes opções para instalar o Superpowers:

::: code-group

```bash [Como Plugin do Claude Code]
// Instale de acordo com a documentação oficial do Superpowers
// https://github.com/obra/superpowers
// A habilidade estará automaticamente em ~/.claude/plugins/...
```

```bash [Como Habilidade do OpenCode]
// Instale manualmente como habilidade do OpenCode
mkdir -p ~/.config/opencode/skills
git clone https://github.com/obra/superpowers ~/.config/opencode/skills/superpowers
// A habilidade estará em .opencode/skills/superpowers/ (nível de projeto) ou ~/.config/opencode/skills/superpowers/ (nível de usuário)
```

:::

**O que você deve ver**:
- Após a instalação, o diretório de habilidades do Superpowers contém o arquivo `using-superpowers/SKILL.md`

### Passo 2: Habilitar o Modo Superpowers

**Por que**
Através de variáveis de ambiente, informe ao plugin para habilitar o modo Superpowers, e o plugin injetará automaticamente o conteúdo relevante na inicialização da sessão.

**Como fazer**

Habilitar temporariamente (apenas sessão atual do terminal):

```bash
export OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true
opencode
```

Habilitar permanentemente (adicionar ao arquivo de configuração do Shell):

::: code-group

```bash [Bash (~/.bashrc ou ~/.bash_profile)]
echo 'export OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true' >> ~/.bashrc
source ~/.bashrc
```

```zsh [Zsh (~/.zshrc)]
echo 'export OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true' >> ~/.zshrc
source ~/.zshrc
```

```powershell [PowerShell (~/.config/powershell/Microsoft.PowerShell_profile.ps1)]
[System.Environment]::SetEnvironmentVariable('OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE', 'true', 'User')
```

:::

**O que você deve ver**:
- Ao digitar `echo $OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE`, deve exibir `true`

### Passo 3: Verificar a Injeção Automática

**Por que**
Confirmar que o plugin reconhece corretamente a habilidade Superpowers e injeta o conteúdo automaticamente ao iniciar uma nova sessão.

**Como fazer**

1. Reinicie o OpenCode
2. Crie uma nova sessão
3. Digite qualquer mensagem na nova sessão (como "Olá")
4. Visualize o contexto da sessão (se o OpenCode suportar)

**O que você deve ver**:
- O plugin injetou automaticamente o seguinte conteúdo em segundo plano (formatado como XML):

```xml
<EXTREMELY_IMPORTANT>
You have superpowers.

**IMPORTANT: The using-superpowers skill content is included below. It is ALREADY LOADED - do not call use_skill for it again. Use use_skill only for OTHER skills.**

[conteúdo real da habilidade using-superpowers...]

**Tool Mapping for OpenCode:**
- `TodoWrite` → `todowrite`
- `Task` tool with subagents → Use `task` tool with `subagent_type`
- `Skill` tool → `use_skill`
- `Read`, `Write`, `Edit`, `Bash`, `Glob`, `Grep`, `WebFetch` → Use native lowercase OpenCode tools

**Skill namespace priority:**
1. Project: `project:skill-name`
2. Claude project: `claude-project:skill-name`
3. User: `skill-name`
4. Claude user: `claude-user:skill-name`
5. Marketplace: `claude-plugins:skill-name`

The first discovered match wins.
</EXTREMELY_IMPORTANT>
```

## Ponto de Verificação ✅

Após concluir as etapas acima, verifique o seguinte:

| Item de Verificação | Resultado Esperado |
|--- | ---|
| Variável de ambiente configurada corretamente | `echo $OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE` exibe `true` |
| Habilidade Superpowers pode ser descoberta | Ao chamar `get_available_skills()`, você pode ver `using-superpowers` |
| Injeção automática em nova sessão | Após criar uma nova sessão, a IA sabe que ela tem superpowers |

## Cuidados com Armadilhas

### ❌ Erro 1: Habilidade Não Descoberta

**Sintoma**: A variável de ambiente foi habilitada, mas o plugin não injetou o conteúdo do Superpowers.

**Causa**: A localização de instalação do Superpowers não está no caminho de descoberta de habilidades.

**Solução**:
- Confirme que o Superpowers está instalado em uma das seguintes localizações:
  - `.claude/plugins/...` (cache de plugins do Claude Code)
  - `.opencode/skills/...` (diretório de habilidades do OpenCode)
  - `~/.config/opencode/skills/...` (habilidades do usuário OpenCode)
  - `~/.claude/skills/...` (habilidades do usuário Claude)
- Execute `get_available_skills()` para verificar se `using-superpowers` está na lista

### ❌ Erro 2: Falha na Chamada de Ferramenta

**Sintoma**: A IA tenta chamar as ferramentas `TodoWrite` ou `Skill`, mas o sistema informa que a ferramenta não existe.

**Causa**: A IA não aplicou o mapeamento de ferramentas e ainda está usando os nomes definidos pelo Superpowers.

**Solução**:
- O plugin injeta automaticamente o mapeamento de ferramentas, certifique-se de que a tag `<EXTREMELY_IMPORTANT>` foi injetada corretamente
- Se o problema persistir, verifique se a sessão foi criada após habilitar a variável de ambiente

### ❌ Erro 3: Superpowers Desaparece Após Compactação

**Sintoma**: Após uma longa sessão, a IA não segue mais o fluxo de trabalho Superpowers.

**Causa**: A compactação de contexto faz com que o conteúdo injetado anteriormente seja limpo.

**Solução**:
- O plugin reinjetará automaticamente o conteúdo do Superpowers após o evento `session.compacted`
- Se o problema persistir, verifique se o plugin está monitorando os eventos normalmente

## Explicação Detalhada do Mapeamento de Ferramentas

O plugin injeta automaticamente o seguinte mapeamento de ferramentas, ajudando a IA a chamar corretamente as ferramentas do OpenCode:

| Ferramenta Superpowers | Ferramenta OpenCode | Descrição |
|--- | --- | ---|
| `TodoWrite` | `todowrite` | Ferramenta de escrita de Todo |
| `Task` (com subagents) | `task` + `subagent_type` | Chamada de subagente |
| `Skill` | `use_skill` | Carregar habilidade |
| `Read` / `Write` / `Edit` | Ferramentas nativas em minúsculas | Operações de arquivo |
| `Bash` / `Glob` / `Grep` / `WebFetch` | Ferramentas nativas em minúsculas | Operações do sistema |

::: tip Por que precisamos do mapeamento de ferramentas?
O design nativo do Superpowers é baseado no Claude Code, e os nomes das ferramentas não são consistentes com o OpenCode. Com o mapeamento automático, a IA pode usar perfeitamente as ferramentas nativas do OpenCode sem conversão manual.
:::

## Prioridade do Namespace de Habilidades

 Quando existem habilidades com o mesmo nome de múltiplas fontes, o plugin seleciona de acordo com a seguinte prioridade:

```
1. project:skill-name         (habilidades OpenCode em nível de projeto)
2. claude-project:skill-name  (habilidades Claude em nível de projeto)
3. skill-name                (habilidades OpenCode em nível de usuário)
4. claude-user:skill-name    (habilidades Claude em nível de usuário)
5. claude-plugins:skill-name (habilidades do marketplace de plugins)
```

::: info Referência de Namespace
Você pode especificar explicitamente o namespace: `use_skill("project:my-skill")`
Ou deixar o plugin fazer a correspondência automática: `use_skill("my-skill")`
:::

**A primeira correspondência descoberta entra em vigor**, e as habilidades subsequentes com o mesmo nome são ignoradas. Isso permite que habilidades em nível de projeto substituam habilidades em nível de usuário.

## Mecanismo de Recuperação de Compactação

Em sessões longas, o OpenCode executa a compactação de contexto para economizar tokens. O plugin garante que o Superpowers continue disponível através do seguinte mecanismo:

1. **Monitorar eventos**: O plugin monitora o evento `session.compacted`
2. **Reinjetar**: Após a conclusão da compactação, reinjeta automaticamente o conteúdo do Superpowers
3. **Alternância transparente**: A orientação de fluxo de trabalho da IA sempre existe e não será interrompida pela compactação

## Resumo da Lição

A integração do Superpowers fornece orientação rigorosa de fluxo de trabalho, os pontos principais:

- **Instalar o Superpowers**: Escolha entre plugin do Claude Code ou habilidade do OpenCode
- **Habilitar variável de ambiente**: Defina `OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true`
- **Injeção automática**: O plugin injeta o conteúdo automaticamente na inicialização da sessão e após a compactação
- **Mapeamento de ferramentas**: Mapeia automaticamente os nomes das ferramentas do Superpowers para as ferramentas nativas do OpenCode
- **Prioridade de namespace**: Habilidades em nível de projeto têm prioridade sobre habilidades em nível de usuário

## Próxima Lição

> Na próxima lição, aprenderemos **[Namespace e Prioridade de Habilidades](../namespaces-and-priority/)**.
>
> Você aprenderá:
> - Compreender o sistema de namespace de habilidades e as regras de prioridade de descoberta
> - Dominar como usar namespaces para especificar explicitamente a fonte da habilidade
> - Entender o mecanismo de substituição e tratamento de conflitos para habilidades com o mesmo nome

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Número da Linha |
|--- | --- | ---|
| Módulo de integração do Superpowers | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L1-L59) | 1-59 |
| Definição do mapeamento de ferramentas | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L12-L16) | 12-16 |
| Definição do namespace de habilidades | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L18-L25) | 18-25 |
| Função de injeção de conteúdo do Superpowers | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L31-L58) | 31-58 |
| Verificação de variável de ambiente | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L37) | 37 |
| Chamada de injeção na inicialização da sessão | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L101) | 101 |
| Reinjeção após compactação | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L148) | 148 |

**Constantes Chave**:
- `OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE`: Variável de ambiente, definida como `'true'` para habilitar o modo Superpowers

**Funções Chave**:
- `maybeInjectSuperpowersBootstrap()`: Verifica a variável de ambiente e a existência da habilidade, injeta o conteúdo do Superpowers
- `discoverAllSkills()`: Descobre todas as habilidades disponíveis (usado para encontrar `using-superpowers`)
- `injectSyntheticContent()`: Injeta o conteúdo na sessão como mensagem synthetic

</details>
