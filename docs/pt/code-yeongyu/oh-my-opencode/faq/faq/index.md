---
title: "Perguntas Frequentes: Modo ultrawork | oh-my-opencode"
subtitle: "Perguntas Frequentes"
sidebarTitle: "O que fazer em caso de problemas"
description: "Aprenda as respostas para perguntas frequentes sobre oh-my-opencode. Inclui modo ultrawork, colaboração multi-agente, tarefas em segundo plano, Ralph Loop e solução de problemas de configuração."
tags:
  - "faq"
  - "troubleshooting"
  - "installation"
  - "configuration"
order: 160
---

# Perguntas Frequentes

## O que você vai aprender

Após ler este FAQ, você será capaz de:

- Encontrar rapidamente soluções para problemas de instalação e configuração
- Entender como usar corretamente o modo ultrawork
- Dominar as melhores práticas para chamadas de agentes
- Compreender os limites e restrições de compatibilidade com Claude Code
- Evitar armadilhas comuns de segurança e desempenho

---

## Instalação e Configuração

### Como instalar o oh-my-opencode?

**A maneira mais simples**: deixe um agente de IA instalar para você.

Envie o seguinte prompt para seu agente LLM (Claude Code, AmpCode, Cursor, etc.):

```
Install and configure oh-my-opencode by following the instructions here:
https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/docs/guide/installation.md
```

**Instalação manual**: consulte o [Guia de Instalação](../start/installation/).

::: tip Por que é recomendado deixar o agente de IA instalar?
Humanos tendem a cometer erros ao configurar o formato JSONC (como esquecer aspas ou posicionar dois-pontos incorretamente). Deixar o agente de IA lidar com isso evita erros de sintaxe comuns.
:::

### Como desinstalar o oh-my-opencode?

Limpe em três etapas:

**Etapa 1**: Remova o plugin da configuração do OpenCode

Edite `~/.config/opencode/opencode.json` (ou `opencode.jsonc`) e delete `"oh-my-opencode"` do array `plugin`.

```bash
# Remover automaticamente usando jq
jq '.plugin = [.plugin[] | select(. != "oh-my-opencode")]' \
    ~/.config/opencode/opencode.json > /tmp/oc.json && \
    mv /tmp/oc.json ~/.config/opencode/opencode.json
```

**Etapa 2**: Delete os arquivos de configuração (opcional)

```bash
# Deletar configuração do usuário
rm -f ~/.config/opencode/oh-my-opencode.json

# Deletar configuração do projeto (se existir)
rm -f .opencode/oh-my-opencode.json
```

**Etapa 3**: Verifique a remoção

```bash
opencode --version
# O plugin não deve mais ser carregado
```

### Onde estão os arquivos de configuração?

Os arquivos de configuração têm dois níveis:

| Nível | Localização | Uso | Prioridade |
|--- | --- | --- | ---|
| Projeto | `.opencode/oh-my-opencode.json` | Configuração específica do projeto | Baixa |
| Usuário | `~/.config/opencode/oh-my-opencode.json` | Configuração padrão global | Alta |

**Regra de mesclagem**: A configuração do usuário sobrescreve a configuração do projeto.

Os arquivos de configuração suportam o formato JSONC (JSON com Comentários), permitindo adicionar comentários e vírgulas finais:

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/assets/oh-my-opencode.schema.json",
  // Este é um comentário
  "disabled_agents": [], // Vírgulas finais são permitidas
  "agents": {}
}
```

### Como desabilitar uma funcionalidade específica?

Use os arrays `disabled_*` no arquivo de configuração:

```json
{
  "disabled_agents": ["oracle", "librarian"],
  "disabled_skills": ["playwright"],
  "disabled_hooks": ["comment-checker", "auto-update-checker"],
  "disabled_mcps": ["websearch"]
}
```

**Opções de compatibilidade com Claude Code**:

```json
{
  "claude_code": {
    "mcp": false,        // Desabilitar MCP do Claude Code
    "commands": false,    // Desabilitar Commands do Claude Code
    "skills": false,      // Desabilitar Skills do Claude Code
    "hooks": false        // Desabilitar hooks do settings.json
  }
}
```

---

## Uso

### O que é ultrawork?

**ultrawork** (ou abreviado `ulw`) é a palavra mágica — incluí-la no seu prompt ativa automaticamente todas as funcionalidades:

- ✅ Tarefas paralelas em segundo plano
- ✅ Todos os agentes especializados (Sisyphus, Oracle, Librarian, Explore, Prometheus, etc.)
- ✅ Modo de exploração profunda
- ✅ Mecanismo de conclusão forçada de Todo

**Exemplo de uso**:

```
ultrawork desenvolver uma REST API com autenticação JWT e gerenciamento de usuários
```

Ou mais curto:

```
ulw refatorar este módulo
```

::: info Como funciona
O Hook `keyword-detector` detecta as palavras-chave `ultrawork` ou `ulw`, então define `message.variant` para um valor especial, ativando todas as funcionalidades avançadas.
:::

### Como chamar um agente específico?

**Método 1: Usar o símbolo @**

```
Ask @oracle to review this design and propose an architecture
Ask @librarian how this is implemented - why does behavior keep changing?
Ask @explore for policy on this feature
```

**Método 2: Usar a ferramenta delegate_task**

```
delegate_task(agent="oracle", prompt="Review this architecture design")
delegate_task(agent="librarian", prompt="Find implementation examples of JWT auth")
```

**Restrições de permissão dos agentes**:

| Agente | Pode escrever código | Pode executar Bash | Pode delegar tarefas | Descrição |
|--- | --- | --- | --- | ---|
| Sisyphus | ✅ | ✅ | ✅ | Orquestrador principal |
| Oracle | ❌ | ❌ | ❌ | Consultor somente leitura |
| Librarian | ❌ | ❌ | ❌ | Pesquisa somente leitura |
| Explore | ❌ | ❌ | ❌ | Busca somente leitura |
| Multimodal Looker | ❌ | ❌ | ❌ | Análise de mídia somente leitura |
| Prometheus | ✅ | ✅ | ✅ | Planejador |

### Como funcionam as tarefas em segundo plano?

As tarefas em segundo plano permitem que você trabalhe como uma equipe de desenvolvimento real, com múltiplos agentes de IA trabalhando em paralelo:

**Iniciar uma tarefa em segundo plano**:

```
delegate_task(agent="explore", background=true, prompt="Find auth implementations")
```

**Continue trabalhando...**

**O sistema notifica automaticamente quando concluído** (via Hook `background-notification`)

**Obter resultados**:

```
background_output(task_id="bg_abc123")
```

**Controle de concorrência**:

```json
{
  "background_task": {
    "defaultConcurrency": 3,
    "providerConcurrency": {
      "anthropic": 2,
      "openai": 3
    },
    "modelConcurrency": {
      "anthropic/claude-opus-4-5": 1,
      "openai/gpt-5.2": 2
    }
  }
}
```

**Prioridade**: `modelConcurrency` > `providerConcurrency` > `defaultConcurrency`

::: tip Por que o controle de concorrência é necessário?
Para evitar limitação de taxa da API e custos descontrolados. Por exemplo, Claude Opus 4.5 é caro, então limite sua concorrência; enquanto Haiku é barato, permitindo mais concorrência.
:::

### Como usar o Ralph Loop?

**Ralph Loop** é um ciclo de desenvolvimento auto-referencial — trabalha continuamente até que a tarefa seja concluída.

**Iniciar**:

```
/ralph-loop "Build a REST API with authentication"
/ralph-loop "Refactor the payment module" --max-iterations=50
```

**Como determinar a conclusão**: O agente emite a tag `<promise>DONE</promise>`.

**Cancelar o loop**:

```
/cancel-ralph
```

**Configuração**:

```json
{
  "ralph_loop": {
    "enabled": true,
    "default_max_iterations": 100
  }
}
```

::: tip Diferença do ultrawork
`/ralph-loop` é o modo normal, `/ulw-loop` é o modo ultrawork (todas as funcionalidades avançadas ativadas).
:::

### O que são Categories e Skills?

**Categories** (novo na v3.0): Camada de abstração de modelos que seleciona automaticamente o modelo ideal com base no tipo de tarefa.

**Categories integradas**:

| Category | Modelo padrão | Temperature | Caso de uso |
|--- | --- | --- | ---|
| visual-engineering | google/gemini-3-pro | 0.7 | Frontend, UI/UX, design |
| ultrabrain | openai/gpt-5.2-codex | 0.1 | Tarefas de raciocínio de alto QI |
| artistry | google/gemini-3-pro | 0.7 | Tarefas criativas e artísticas |
| quick | anthropic/claude-haiku-4-5 | 0.1 | Tarefas rápidas e de baixo custo |
| writing | google/gemini-3-flash | 0.1 | Documentação e tarefas de escrita |

**Skills**: Módulos de conhecimento especializado que injetam melhores práticas de domínios específicos.

**Skills integradas**:

| Skill | Condição de ativação | Descrição |
|--- | --- | ---|
| playwright | Tarefas relacionadas a navegador | Automação de navegador com Playwright MCP |
| frontend-ui-ux | Tarefas de UI/UX | Designer virou desenvolvedor, criando interfaces bonitas |
| git-master | Operações Git (commit, rebase, squash) | Especialista em Git, commits atômicos, busca no histórico |

**Exemplo de uso**:

```
delegate_task(category="visual", skills=["frontend-ui-ux"], prompt="Projetar a UI desta página")
delegate_task(category="quick", skills=["git-master"], prompt="Fazer commit dessas alterações")
```

::: info Vantagens
Categories otimizam custos (usando modelos mais baratos), Skills garantem qualidade (injetando conhecimento especializado).
:::

---

## Compatibilidade com Claude Code

### Posso usar as configurações do Claude Code?

**Sim**, oh-my-opencode fornece uma **camada de compatibilidade completa**:

**Tipos de configuração suportados**:

| Tipo | Local de carregamento | Prioridade |
|--- | --- | ---|
| Commands | `~/.claude/commands/`, `.claude/commands/` | Baixa |
| Skills | `~/.claude/skills/*/SKILL.md`, `.claude/skills/*/SKILL.md` | Média |
| Agents | `~/.claude/agents/*.md`, `.claude/agents/*.md` | Alta |
| MCPs | `~/.claude/.mcp.json`, `.claude/.mcp.json` | Alta |
| Hooks | `~/.claude/settings.json`, `.claude/settings.json` | Alta |

**Prioridade de carregamento de configuração**:

Configuração do projeto OpenCode > Configuração do usuário Claude Code

```json
{
  "claude_code": {
    "plugins_override": {
      "claude-mem@thedotmack": false  // Desabilitar plugin específico
    }
  }
}
```

### Posso usar a assinatura do Claude Code?

**Tecnicamente possível, mas não recomendado**.

::: warning Restrições de acesso OAuth do Claude
Em janeiro de 2026, a Anthropic restringiu o acesso OAuth de terceiros, citando violação dos ToS.
:::

**Declaração oficial** (do README):

> De fato, existem algumas ferramentas da comunidade que falsificam assinaturas de solicitação OAuth do Claude Code. Essas ferramentas podem ser tecnicamente indetectáveis, mas os usuários devem estar cientes das implicações dos ToS, e eu pessoalmente não recomendo usá-las.
>
> **Este projeto não é responsável por quaisquer problemas decorrentes do uso de ferramentas não oficiais, não temos implementações personalizadas desses sistemas OAuth.**

**Solução recomendada**: Use suas assinaturas existentes de provedores de IA (Claude, OpenAI, Gemini, etc.).

### Os dados são compatíveis?

**Sim**, o formato de armazenamento de dados é compatível:

| Dados | Localização | Formato | Compatibilidade |
|--- | --- | --- | ---|
| Todos | `~/.claude/todos/` | JSON | ✅ Compatível com Claude Code |
| Transcrições | `~/.claude/transcripts/` | JSONL | ✅ Compatível com Claude Code |

Você pode alternar perfeitamente entre Claude Code e oh-my-opencode.

---

## Segurança e Desempenho

### Há avisos de segurança?

**Sim**, há um aviso claro no topo do README:

::: danger Aviso: Sites Impostores
**ohmyopencode.com não está associado a este projeto.** Não operamos nem endossamos esse site.
>
> OhMyOpenCode é **gratuito e de código aberto**. Não baixe instaladores nem insira informações de pagamento em sites de terceiros que afirmam ser "oficiais".
>
> Como o site impostor está atrás de um paywall, **não podemos verificar o que eles distribuem**. Trate qualquer download de lá como **potencialmente inseguro**.
>
> ✅ Download oficial: https://github.com/code-yeongyu/oh-my-opencode/releases
:::

### Como otimizar o desempenho?

**Estratégia 1: Use o modelo apropriado**

- Tarefas rápidas → Use a category `quick` (modelo Haiku)
- Design de UI → Use a category `visual` (Gemini 3 Pro)
- Raciocínio complexo → Use a category `ultrabrain` (GPT 5.2)

**Estratégia 2: Habilite o controle de concorrência**

```json
{
  "background_task": {
    "providerConcurrency": {
      "anthropic": 2,  // Limitar concorrência da Anthropic
      "openai": 5       // Aumentar concorrência da OpenAI
    }
  }
}
```

**Estratégia 3: Use tarefas em segundo plano**

Deixe modelos leves (como Haiku) coletarem informações em segundo plano, enquanto o agente principal (Opus) foca na lógica central.

**Estratégia 4: Desabilite funcionalidades desnecessárias**

```json
{
  "disabled_hooks": ["comment-checker", "auto-update-checker"],
  "claude_code": {
    "hooks": false  // Desabilitar hooks do Claude Code (se não usar)
  }
}
```

### Requisitos de versão do OpenCode?

**Recomendado**: OpenCode >= 1.0.132

::: warning Bug em versões antigas
Se você estiver usando a versão 1.0.132 ou anterior, um bug no OpenCode pode corromper a configuração.
>
> A correção foi mesclada após 1.0.132 — use uma versão mais recente.
:::

Verificar versão:

```bash
opencode --version
```

---

## Solução de Problemas

### O agente não está funcionando?

**Lista de verificação**:

1. ✅ Verifique se o formato do arquivo de configuração está correto (sintaxe JSONC)
2. ✅ Verifique a configuração do Provider (se a API Key é válida)
3. ✅ Execute a ferramenta de diagnóstico: `oh-my-opencode doctor --verbose`
4. ✅ Verifique mensagens de erro nos logs do OpenCode

**Problemas comuns**:

| Problema | Causa | Solução |
|--- | --- | ---|
| Agente recusa tarefa | Configuração de permissão incorreta | Verifique a configuração `agents.permission` |
| Tarefa em segundo plano expira | Limite de concorrência muito restrito | Aumente `providerConcurrency` |
| Erro no bloco de pensamento | Modelo não suporta thinking | Mude para um modelo que suporte thinking |

### O arquivo de configuração não está funcionando?

**Possíveis causas**:

1. Erro de sintaxe JSON (aspas ou vírgulas esquecidas)
2. Localização incorreta do arquivo de configuração
3. Configuração do usuário não sobrescrevendo a configuração do projeto

**Etapas de verificação**:

```bash
# Verificar se o arquivo de configuração existe
ls -la ~/.config/opencode/oh-my-opencode.json
ls -la .opencode/oh-my-opencode.json

# Validar sintaxe JSON
cat ~/.config/opencode/oh-my-opencode.json | jq .
```

**Usar validação de JSON Schema**:

Adicione o campo `$schema` no início do arquivo de configuração, e o editor indicará erros automaticamente:

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/assets/oh-my-opencode.schema.json"
}
```

### A tarefa em segundo plano não foi concluída?

**Lista de verificação**:

1. ✅ Verifique o status da tarefa: `background_output(task_id="...")`
2. ✅ Verifique o limite de concorrência: há slots de concorrência disponíveis?
3. ✅ Verifique os logs: há erros de limitação de taxa da API?

**Forçar cancelamento da tarefa**:

```javascript
background_cancel(task_id="bg_abc123")
```

**TTL da tarefa**: Tarefas em segundo plano são automaticamente limpas após 30 minutos.

---

## Mais Recursos

### Onde buscar ajuda?

- **GitHub Issues**: https://github.com/code-yeongyu/oh-my-opencode/issues
- **Comunidade Discord**: https://discord.gg/PUwSMR9XNk
- **X (Twitter)**: https://x.com/justsisyphus

### Ordem de leitura recomendada

Se você é iniciante, recomendamos ler na seguinte ordem:

1. [Instalação e Configuração Rápida](../start/installation/)
2. [Conhecendo o Sisyphus: O Orquestrador Principal](../start/sisyphus-orchestrator/)
3. [Modo Ultrawork](../start/ultrawork-mode/)
4. [Diagnóstico de Configuração e Solução de Problemas](../troubleshooting/)

### Contribuindo com código

Pull Requests são bem-vindos! 99% do código do projeto foi construído usando OpenCode.

Se você quiser melhorar uma funcionalidade ou corrigir um bug, por favor:

1. Faça fork do repositório
2. Crie um branch de feature
3. Faça commit das alterações
4. Faça push para o branch
5. Crie um Pull Request

---

## Resumo da Lição

Este FAQ cobriu perguntas frequentes sobre oh-my-opencode, incluindo:

- **Instalação e Configuração**: Como instalar, desinstalar, localização dos arquivos de configuração, desabilitar funcionalidades
- **Dicas de Uso**: Modo ultrawork, chamadas de agentes, tarefas em segundo plano, Ralph Loop, Categories e Skills
- **Compatibilidade com Claude Code**: Carregamento de configuração, restrições de uso de assinatura, compatibilidade de dados
- **Segurança e Desempenho**: Avisos de segurança, estratégias de otimização de desempenho, requisitos de versão
- **Solução de Problemas**: Problemas comuns e soluções

Lembre-se destes pontos-chave:

- Use as palavras-chave `ultrawork` ou `ulw` para ativar todas as funcionalidades
- Deixe modelos leves coletarem informações em segundo plano, enquanto o agente principal foca na lógica central
- Arquivos de configuração suportam formato JSONC, permitindo comentários
- Configurações do Claude Code podem ser carregadas perfeitamente, mas o acesso OAuth tem restrições
- Baixe do repositório oficial do GitHub, cuidado com sites impostores

## Prévia da Próxima Lição

> Se você encontrar problemas específicos de configuração durante o uso, consulte **[Diagnóstico de Configuração e Solução de Problemas](../troubleshooting/)**.
>
> Você aprenderá:
> - Como usar ferramentas de diagnóstico para verificar a configuração
> - Significado dos códigos de erro comuns e soluções
> - Técnicas de solução de problemas de configuração de Provider
> - Dicas de localização e otimização de problemas de desempenho

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver as localizações do código-fonte</strong></summary>

> Atualizado em: 2026-01-26

| Funcionalidade | Caminho do arquivo | Linhas |
|--- | --- | ---|
| Keyword Detector (detecção ultrawork) | [`src/hooks/keyword-detector/`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/) | Diretório completo |
| Background Task Manager | [`src/features/background-agent/manager.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/manager.ts) | 1-1377 |
| Concurrency Control | [`src/features/background-agent/concurrency.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/concurrency.ts) | Arquivo completo |
| Ralph Loop | [`src/hooks/ralph-loop/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/ralph-loop/index.ts) | Arquivo completo |
| Delegate Task (análise de Category & Skill) | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | 1-1070 |
| Config Schema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | Arquivo completo |
| Claude Code Hooks | [`src/hooks/claude-code-hooks/`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/claude-code-hooks/) | Diretório completo |

**Constantes-chave**:
- `DEFAULT_MAX_ITERATIONS = 100`: Número máximo padrão de iterações do Ralph Loop
- `TASK_TTL_MS = 30 * 60 * 1000`: TTL de tarefas em segundo plano (30 minutos)
- `POLL_INTERVAL_MS = 2000`: Intervalo de polling de tarefas em segundo plano (2 segundos)

**Configurações-chave**:
- `disabled_agents`: Lista de agentes desabilitados
- `disabled_skills`: Lista de skills desabilitadas
- `disabled_hooks`: Lista de hooks desabilitados
- `claude_code`: Configuração de compatibilidade com Claude Code
- `background_task`: Configuração de concorrência de tarefas em segundo plano
- `categories`: Configuração personalizada de Categories
- `agents`: Configuração de substituição de agentes

</details>
