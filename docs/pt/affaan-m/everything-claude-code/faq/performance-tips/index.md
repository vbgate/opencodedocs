---
title: "Otimização de Desempenho: Modelo e Contexto | Everything Claude Code"
sidebarTitle: "Segredo para 10x Mais Rápido"
subtitle: "Otimização de Desempenho: Aumentando a Velocidade de Resposta"
description: "Aprenda estratégias de otimização de desempenho do Everything Claude Code. Domine seleção de modelo, gerenciamento de janela de contexto, configuração MCP e compactação estratégica para melhorar velocidade de resposta e eficiência de desenvolvimento."
tags:
  - "performance"
  - "optimization"
  - "token-usage"
prerequisite:
  - "start-quick-start"
order: 180
---

# Otimização de Desempenho: Aumentando a Velocidade de Resposta

## O Que Você Será Capaz de Fazer

- Escolher o modelo apropriado com base na complexidade da tarefa, equilibrando custo e desempenho
- Gerenciar efetivamente a janela de contexto, evitando atingir limites
- Configurar servidores MCP adequadamente, maximizando o contexto disponível
- Usar compactação estratégica para manter a lógica da conversa coerente

## Seu Dilema Atual

Claude Code está respondendo lentamente? A janela de contexto enche rapidamente? Não sabe quando usar Haiku, Sonnet ou Opus? Esses problemas afetam seriamente a eficiência de desenvolvimento.

## Ideia Central

O núcleo da otimização de desempenho é **usar a ferramenta certa no momento certo**. Escolher modelos, gerenciar contexto e configurar MCP são todos trade-offs: velocidade vs inteligência, custo vs qualidade.

::: info Conceito-Chave

**Janela de contexto** é o comprimento do histórico de conversa que Claude consegue "lembrar". Os modelos atuais suportam aproximadamente 200k tokens, mas são afetados pelo número de servidores MCP, número de chamadas de ferramentas e outros fatores.

:::

## Problemas Comuns de Desempenho

### Problema 1: Velocidade de Resposta Lenta

**Sintomas**: Até tarefas simples demoram muito

**Possíveis Causas**:
- Usar Opus para tarefas simples
- Contexto muito longo, precisa processar muita informação histórica
- Muitos servidores MCP habilitados

**Soluções**:
- Usar Haiku para tarefas leves
- Compactar contexto regularmente
- Reduzir o número de MCPs habilitados

### Problema 2: Janela de Contexto Enche Rapidamente

**Sintomas**: Precisa compactar ou reiniciar sessão após pouco tempo de desenvolvimento

**Possíveis Causas**:
- Muitos servidores MCP habilitados (cada MCP ocupa contexto)
- Não compactou o histórico de conversa a tempo
- Usou cadeias complexas de chamadas de ferramentas

**Soluções**:
- Habilitar MCPs sob demanda, usar `disabledMcpServers` para desabilitar os não utilizados
- Usar compactação estratégica, compactar manualmente nos limites de tarefas
- Evitar leituras e buscas de arquivos desnecessárias

### Problema 3: Consumo Rápido de Tokens

**Sintomas**: Cota usada rapidamente, custo alto

**Possíveis Causas**:
- Sempre usar Opus para processar tarefas
- Ler repetidamente grandes quantidades de arquivos
- Não usar compactação adequadamente

**Soluções**:
- Escolher modelo com base na complexidade da tarefa
- Usar `/compact` para compactar proativamente
- Usar hooks strategic-compact para lembretes inteligentes

## Estratégia de Seleção de Modelo

Escolher o modelo apropriado com base na complexidade da tarefa pode melhorar significativamente o desempenho e reduzir custos.

### Haiku 4.5 (90% da capacidade do Sonnet, 3x economia de custo)

**Cenários Aplicáveis**:
- Agents leves, chamadas frequentes
- Programação em par e geração de código
- Worker agents em sistemas multi-agent

**Exemplo**:
```markdown
Modificações simples de código, formatação, geração de comentários
Use Haiku
```

### Sonnet 4.5 (Melhor modelo de codificação)

**Cenários Aplicáveis**:
- Trabalho principal de desenvolvimento
- Coordenação de workflows multi-agent
- Tarefas complexas de codificação

**Exemplo**:
```markdown
Implementar novos recursos, refatoração, corrigir bugs complexos
Use Sonnet
```

### Opus 4.5 (Capacidade de raciocínio mais forte)

**Cenários Aplicáveis**:
- Decisões arquiteturais complexas
- Tarefas que requerem profundidade máxima de raciocínio
- Tarefas de pesquisa e análise

**Exemplo**:
```markdown
Design de sistema, auditoria de segurança, troubleshooting de problemas complexos
Use Opus
```

::: tip Dica de Seleção de Modelo

Especifique na configuração do agent através do campo `model`:
```markdown
---
name: my-agent
model: haiku  # ou sonnet, opus
---
```

:::

## Gerenciamento de Janela de Contexto

Evitar usar muito da janela de contexto afeta o desempenho e pode até causar falha nas tarefas.

### Evite Tarefas nos Últimos 20% da Janela de Contexto

Para essas tarefas, recomenda-se compactar o contexto primeiro:
- Refatoração em larga escala
- Implementação de recursos em múltiplos arquivos
- Depuração de interações complexas

### Tarefas com Baixa Sensibilidade ao Contexto

Essas tarefas têm baixos requisitos de contexto e podem continuar quando próximas ao limite:
- Edição de arquivo único
- Criação de ferramentas independentes
- Atualização de documentação
- Correção de bugs simples

::: warning Lembrete Importante

A janela de contexto é afetada pelos seguintes fatores:
- Número de servidores MCP habilitados
- Número de chamadas de ferramentas
- Comprimento do histórico de conversa
- Operações de arquivo na sessão atual

:::

## Otimização de Configuração MCP

Servidores MCP são uma maneira importante de estender as capacidades do Claude Code, mas cada MCP ocupa contexto.

### Princípios Básicos

Conforme recomendado no README:

```json
{
  "mcpServers": {
    "mcp-server-1": { ... },
    "mcp-server-2": { ... }
    // ... mais configurações
  },
  "disabledMcpServers": [
    "mcp-server-3",
    "mcp-server-4"
    // Desabilitar MCPs não utilizados
  ]
}
```

**Melhores Práticas**:
- Pode configurar 20-30 servidores MCP
- Habilitar não mais que 10 por projeto
- Manter o número de ferramentas ativas abaixo de 80

### Habilitar MCP Sob Demanda

Escolha MCPs relevantes com base no tipo de projeto:

| Tipo de Projeto | Recomendado Habilitar | Opcional |
| --- | --- | --- |
| Projeto Frontend | Vercel, Magic | Filesystem, GitHub |
| Projeto Backend | Supabase, ClickHouse | GitHub, Railway |
| Projeto Full-Stack | Todos | - |
| Biblioteca de Ferramentas | GitHub | Filesystem |

::: tip Como Alternar MCP

Use `disabledMcpServers` na configuração do projeto (`~/.claude/settings.json`):
```json
{
  "disabledMcpServers": ["cloudflare-observability", "clickhouse-io"]
}
```

:::

## Compactação Estratégica

A compactação automática pode ser acionada a qualquer momento, potencialmente interrompendo a lógica da tarefa. A compactação estratégica é executada manualmente nos limites de tarefas, mantendo a lógica coerente.

### Por Que Precisamos de Compactação Estratégica

**Problemas da Compactação Automática**:
- Frequentemente acionada no meio de tarefas, perdendo contexto importante
- Não entende os limites lógicos das tarefas
- Pode interromper operações complexas de múltiplas etapas

**Vantagens da Compactação Estratégica**:
- Compacta nos limites de tarefas, preservando informações-chave
- Lógica mais clara
- Evita interrupção de processos importantes

### Melhor Momento para Compactar

1. **Após Exploração, Antes da Execução** - Compactar contexto de pesquisa, preservar plano de implementação
2. **Após Completar um Marco** - Recomeçar para a próxima fase
3. **Antes de Trocar de Tarefa** - Limpar contexto de exploração, preparar para nova tarefa

### Hook Strategic Compact

Este plugin inclui o skill `strategic-compact`, que automaticamente lembra quando você deve compactar.

**Como o Hook Funciona**:
- Rastreia o número de chamadas de ferramentas
- Lembra quando atinge o limite (padrão 50 chamadas)
- Depois lembra a cada 25 chamadas

**Configurar Limite**:
```bash
# Definir variável de ambiente
export COMPACT_THRESHOLD=40
```

**Configuração do Hook** (já incluída em `hooks/hooks.json`):
```json
{
  "matcher": "tool == \"Edit\" || tool == \"Write\"",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
  }]
}
```

### Dicas de Uso

1. **Compactar Após Planejamento** - Após o plano estar definido, compactar e recomeçar
2. **Compactar Após Depuração** - Limpar contexto de resolução de erros, continuar para o próximo passo
3. **Não Compactar Durante Implementação** - Preservar contexto de mudanças relacionadas
4. **Prestar Atenção aos Lembretes** - Hook diz "quando", você decide "se compactar"

::: tip Ver Estado Atual

Use o comando `/checkpoint` para salvar o estado atual, depois compacte a sessão.

:::

## Lista de Verificação de Desempenho

No uso diário, verifique regularmente os seguintes itens:

### Uso de Modelo
- [ ] Usar Haiku em vez de Sonnet/Opus para tarefas simples
- [ ] Usar Opus em vez de Sonnet para raciocínio complexo
- [ ] Modelo apropriado especificado na configuração do Agent

### Gerenciamento de Contexto
- [ ] MCPs habilitados não excedem 10
- [ ] Usar `/compact` regularmente para compactar
- [ ] Compactar nos limites de tarefas, não no meio delas

### Configuração MCP
- [ ] Projeto habilita apenas MCPs necessários
- [ ] Usar `disabledMcpServers` para gerenciar MCPs não utilizados
- [ ] Verificar regularmente o número de ferramentas ativas (recomendado < 80)

## Perguntas Frequentes

### Q: Quando usar Haiku, Sonnet ou Opus?

**A**: Com base na complexidade da tarefa:
- **Haiku**: Tarefas leves, chamadas frequentes (como formatação de código, geração de comentários)
- **Sonnet**: Trabalho principal de desenvolvimento, coordenação de Agent (como implementação de recursos, refatoração)
- **Opus**: Raciocínio complexo, decisões arquiteturais (como design de sistema, auditoria de segurança)

### Q: O que fazer quando a janela de contexto está cheia?

**A**: Use `/compact` imediatamente para compactar a sessão. Se você habilitou o hook strategic-compact, ele lembrará você no momento apropriado. Antes de compactar, pode usar `/checkpoint` para salvar o estado importante.

### Q: Como saber quantos MCPs estão habilitados?

**A**: Verifique as configurações `mcpServers` e `disabledMcpServers` em `~/.claude/settings.json`. Número de MCPs ativos = total - número em `disabledMcpServers`.

### Q: Por que minhas respostas estão particularmente lentas?

**A**: Verifique os seguintes pontos:
1. Está usando Opus para tarefas simples?
2. A janela de contexto está quase cheia?
3. Muitos servidores MCP habilitados?
4. Está executando operações de arquivo em larga escala?

## Resumo da Lição

O núcleo da otimização de desempenho é "usar a ferramenta certa no momento certo":

- **Seleção de Modelo**: Escolher Haiku/Sonnet/Opus com base na complexidade da tarefa
- **Gerenciamento de Contexto**: Evitar os últimos 20% da janela, compactar a tempo
- **Configuração MCP**: Habilitar sob demanda, não mais que 10
- **Compactação Estratégica**: Compactar manualmente nos limites de tarefas, manter lógica coerente

## Cursos Relacionados

- [Estratégias de Otimização de Token](../../advanced/token-optimization/) - Aprofunde-se no gerenciamento de janela de contexto
- [Automação com Hooks](../../advanced/hooks-automation/) - Entenda a configuração do hook strategic-compact
- [Configuração de Servidor MCP](../../start/mcp-setup/) - Aprenda como configurar servidores MCP

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código fonte</strong></summary>

> Última atualização: 2026-01-25

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Regras de Otimização de Desempenho | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| Skill de Compactação Estratégica | [`skills/strategic-compact/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/strategic-compact/SKILL.md) | 1-64 |
| Configuração de Hooks | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| Hook Strategic Compact | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json#L46-L54) | 46-54 |
| Script Suggest Compact | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | - |
| Exemplo de Configuração MCP | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | - |

**Regras-Chave**:
- **Seleção de Modelo**: Haiku (tarefas leves), Sonnet (desenvolvimento principal), Opus (raciocínio complexo)
- **Janela de Contexto**: Evitar usar os últimos 20%, compactar a tempo
- **Configuração MCP**: Habilitar não mais que 10 por projeto, ferramentas ativas < 80
- **Compactação Estratégica**: Compactar manualmente nos limites de tarefas, evitar interrupção por compactação automática

**Variáveis de Ambiente Chave**:
- `COMPACT_THRESHOLD`: Limite de número de chamadas de ferramentas (padrão: 50)

</details>
