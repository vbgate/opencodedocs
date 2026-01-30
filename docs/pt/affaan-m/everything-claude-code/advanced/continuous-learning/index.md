---
title: "Aprendizado Contínuo: Extração Automática de Padrões | Everything Claude Code"
sidebarTitle: "Tornando o Claude Code Mais Inteligente"
subtitle: "Aprendizado Contínuo: Extração Automática de Padrões Reutilizáveis"
description: "Aprenda o mecanismo de aprendizado contínuo do Everything Claude Code. Extraia padrões com /learn, configure avaliação automática e Stop hooks para que o Claude Code acumule experiência e aumente a eficiência de desenvolvimento."
tags:
  - "continuous-learning"
  - "knowledge-extraction"
  - "automation"
prerequisite:
  - "start-quick-start"
  - "platforms-commands-overview"
order: 100
---

# Mecanismo de Aprendizado Contínuo: Extração Automática de Padrões Reutilizáveis

## O Que Você Vai Aprender

- Usar o comando `/learn` para extrair manualmente padrões reutilizáveis de uma sessão
- Configurar a skill continuous-learning para avaliação automática ao final da sessão
- Configurar Stop hooks para acionar automaticamente a extração de padrões
- Salvar padrões extraídos como learned skills para reutilização em sessões futuras
- Configurar parâmetros como limiar de extração e requisitos de duração da sessão

## Seu Desafio Atual

Ao desenvolver com o Claude Code, você já enfrentou estas situações?

- Resolveu um problema complexo, mas na próxima vez teve que descobrir tudo de novo
- Aprendeu uma técnica de depuração de um framework, mas esqueceu depois de um tempo
- Descobriu convenções de código específicas do projeto, mas não conseguiu documentá-las sistematicamente
- Encontrou uma solução alternativa, mas não conseguiu lembrar na próxima vez que enfrentou um problema similar

Esses problemas impedem que sua experiência e conhecimento se acumulem efetivamente, fazendo você começar do zero toda vez.

## Quando Usar Esta Técnica

Cenários para usar o mecanismo de aprendizado contínuo:

- **Ao resolver problemas complexos**: Depurou um bug por horas e precisa lembrar da abordagem de solução
- **Ao aprender um novo framework**: Descobriu peculiaridades ou melhores práticas do framework
- **No meio do desenvolvimento do projeto**: Descobriu gradualmente convenções e padrões específicos do projeto
- **Após revisão de código**: Aprendeu novos métodos de verificação de segurança ou padrões de codificação
- **Durante otimização de performance**: Encontrou técnicas de otimização eficazes ou combinações de ferramentas

::: tip Valor Principal
O mecanismo de aprendizado contínuo torna o Claude Code mais inteligente com o uso. Ele age como um mentor experiente, registrando automaticamente padrões úteis enquanto você resolve problemas e oferecendo sugestões em situações similares no futuro.
:::

## Conceito Principal

O mecanismo de aprendizado contínuo consiste em três componentes principais:

```
1. Comando /learn        → Extração manual: execute a qualquer momento para salvar padrões valiosos
2. Skill Continuous Learning → Avaliação automática: acionada pelo Stop hook, analisa a sessão
3. Learned Skills        → Base de conhecimento: salva padrões, carrega automaticamente no futuro
```

**Como Funciona**:

- **Extração manual**: Após resolver um problema não trivial, você usa proativamente `/learn` para extrair padrões
- **Avaliação automática**: Ao final da sessão, o script do Stop hook verifica a duração da sessão e solicita ao Claude que avalie
- **Consolidação do conhecimento**: Padrões extraídos são salvos como learned skills no diretório `~/.claude/skills/learned/`
- **Reutilização futura**: O Claude Code carrega automaticamente essas skills em sessões futuras

**Por Que Escolher Stop Hook**:

- **Leve**: Executa apenas uma vez ao final da sessão, sem afetar a velocidade de resposta da interação
- **Contexto completo**: Pode acessar o registro completo da sessão, facilitando a descoberta de padrões valiosos
- **Não bloqueante**: Não executa a cada mensagem enviada, não adiciona latência

## 🎒 Preparação Antes de Começar

Antes de usar o mecanismo de aprendizado contínuo, confirme:

- ✅ Plugin Everything Claude Code instalado
- ✅ Familiarizado com o comando `/learn` em [Visão Geral dos Comandos Principais](../../platforms/commands-overview/)
- ✅ Compreendeu o conceito de Stop hook em [Automação com Hooks](../hooks-automation/)

::: warning Pré-requisitos
Este tutorial assume que você está familiarizado com as operações básicas do Claude Code e conceitos de hooks. Se ainda não completou a instalação, leia primeiro o [Início Rápido](../../start/quickstart/).
:::

## Siga Comigo: Fluxo Completo de Aprendizado Contínuo

Vamos aprender todo o fluxo através de um exemplo prático. Suponha que você estava depurando um erro de tipo TypeScript e finalmente encontrou a solução.

### Passo 1: Usar /learn para Extrair Padrões Manualmente

**Por Quê**
A extração manual é adequada para problemas importantes recém-resolvidos, salvando imediatamente para evitar esquecimento.

**Ação**
No Claude Code, digite:

```
/learn
```

**O Que Você Deve Ver**
O Claude analisará a sessão atual e perguntará se encontrou padrões extraíveis:

```markdown
Analisei a sessão atual e encontrei os seguintes padrões extraíveis:

1. Erro de tipo TypeScript: Resolvido através de restrições genéricas
   - Descrição do problema: Inferência de tipo de parâmetro de função incorreta
   - Solução: Adicionar restrição genérica explícita `<T extends ...>`
   - Cenários aplicáveis: Inferência de tipos complexos, funções callback

Deseja extrair esses padrões? (yes/no/skip)
```

**Checkpoint ✅**
- O Claude identificou o problema que você resolveu?
- A descrição do padrão extraído está precisa?
- Os cenários aplicáveis são razoáveis?

**Próximo Passo**
Se o padrão estiver correto, responda `yes`. Se precisar de modificações, especifique as alterações.

---

### Passo 2: Salvar como Learned Skill

**Por Quê**
Após salvar como arquivo de skill, sessões futuras podem carregar automaticamente esse conhecimento.

**Ação**
Se confirmar a extração, o Claude criará o arquivo de skill:

```markdown
Salvando padrão em: ~/.claude/skills/learned/typescript-generic-constraints.md

# TypeScript Generic Constraints

**Extracted:** 2026-01-25
**Context:** Resolver problemas de inferência de tipos complexos

## Problem
Inferência de tipo de parâmetro de função TypeScript incorreta, causando erros de tipo.

## Solution
Adicionar restrição genérica explícita `<T extends ...>` para esclarecer relações de tipo.

## Example
```typescript
// Before
function process(data) { ... }  // Inferência de tipo falhou

// After
function process<T extends Record<string, unknown>>(data: T) { ... }
```

## When to Use
- Cenários de inferência de tipos complexos
- Definições de tipo de função callback
- Restrições de parâmetros de funções genéricas
```

**O Que Você Deve Ver**
O Claude indica que o arquivo foi salvo:

```markdown
✅ Skill salva em: ~/.claude/skills/learned/typescript-generic-constraints.md

Quando encontrar problemas de tipo similares no futuro, o Claude carregará automaticamente esta skill.
```

**Checkpoint ✅**
- O arquivo foi criado com sucesso?
- O caminho do arquivo está no diretório `~/.claude/skills/learned/`?
- O conteúdo da skill está preciso?

---

### Passo 3: Configurar a Skill Continuous Learning

**Por Quê**
Após configurar a avaliação automática, o Claude verificará automaticamente se há padrões extraíveis ao final de cada sessão.

**Ação**

Crie o arquivo de configuração `~/.claude/skills/continuous-learning/config.json`:

```json
{
  "min_session_length": 10,
  "extraction_threshold": "medium",
  "auto_approve": false,
  "learned_skills_path": "~/.claude/skills/learned/",
  "patterns_to_detect": [
    "error_resolution",
    "user_corrections",
    "workarounds",
    "debugging_techniques",
    "project_specific"
  ],
  "ignore_patterns": [
    "simple_typos",
    "one_time_fixes",
    "external_api_issues"
  ]
}
```

**Explicação da Configuração**:

| Campo | Descrição | Valor Recomendado |
| --- | --- | --- |
| `min_session_length` | Duração mínima da sessão (número de mensagens do usuário) | 10 |
| `extraction_threshold` | Limiar de extração | medium |
| `auto_approve` | Salvar automaticamente (recomendado false) | false |
| `learned_skills_path` | Caminho para salvar learned skills | `~/.claude/skills/learned/` |
| `patterns_to_detect` | Tipos de padrões a detectar | Ver acima |
| `ignore_patterns` | Tipos de padrões a ignorar | Ver acima |

**O Que Você Deve Ver**
Arquivo de configuração criado em `~/.claude/skills/continuous-learning/config.json`.

**Checkpoint ✅**
- Formato do arquivo de configuração correto (JSON válido)
- `learned_skills_path` contém o símbolo `~` (será substituído pelo diretório home real)
- `auto_approve` definido como `false` (recomendado)

---

### Passo 4: Configurar Stop Hook para Acionamento Automático

**Por Quê**
O Stop hook será acionado automaticamente ao final de cada sessão, sem necessidade de executar `/learn` manualmente.

**Ação**

Edite `~/.claude/settings.json` e adicione o Stop hook:

```json
{
  "hooks": {
    "Stop": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/skills/continuous-learning/evaluate-session.sh"
      }]
    }]
  }
}
```

**Explicação do Caminho do Script**:

| Plataforma | Caminho do Script |
| --- | --- |
| macOS/Linux | `~/.claude/skills/continuous-learning/evaluate-session.sh` |
| Windows | `C:\Users\SeuNome\.claude\skills\continuous-learning\evaluate-session.cmd` |

**O Que Você Deve Ver**
Stop hook adicionado a `~/.claude/settings.json`.

**Checkpoint ✅**
- Estrutura de hooks correta (Stop → matcher → hooks)
- Caminho do command aponta para o script correto
- matcher definido como `"*"` (corresponde a todas as sessões)

---

### Passo 5: Verificar se o Stop Hook Funciona Corretamente

**Por Quê**
Após verificar que a configuração está correta, você pode usar a funcionalidade de extração automática com confiança.

**Ação**
1. Abra uma nova sessão do Claude Code
2. Realize algum trabalho de desenvolvimento (envie pelo menos 10 mensagens)
3. Feche a sessão

**O Que Você Deve Ver**
Log de saída do script Stop hook:

```
[ContinuousLearning] Session has 12 messages - evaluate for extractable patterns
[ContinuousLearning] Save learned skills to: /Users/seunome/.claude/skills/learned/
```

**Checkpoint ✅**
- Log mostra número de mensagens da sessão ≥ 10
- Log mostra caminho correto das learned skills
- Sem mensagens de erro

---

### Passo 6: Sessões Futuras Carregam Learned Skills Automaticamente

**Por Quê**
Skills salvas serão carregadas automaticamente em cenários similares no futuro, fornecendo contexto.

**Ação**
Em sessões futuras, quando encontrar problemas similares, o Claude carregará automaticamente as learned skills relevantes.

**O Que Você Deve Ver**
O Claude indica que carregou skills relevantes:

```markdown
Notei que este cenário é similar ao problema de inferência de tipo resolvido anteriormente.

De acordo com a saved skill (typescript-generic-constraints), recomendo usar restrições genéricas explícitas:

```typescript
function process<T extends Record<string, unknown>>(data: T) { ... }
```
```

**Checkpoint ✅**
- O Claude referenciou a saved skill
- A solução sugerida está precisa
- Melhorou a eficiência na resolução de problemas

## Checkpoint ✅: Verificar Configuração

Após completar os passos acima, execute as seguintes verificações para confirmar que tudo está funcionando:

1. **Verificar se o arquivo de configuração existe**:
```bash
ls -la ~/.claude/skills/continuous-learning/config.json
```

2. **Verificar configuração do Stop hook**:
```bash
cat ~/.claude/settings.json | grep -A 10 "Stop"
```

3. **Verificar diretório de learned skills**:
```bash
ls -la ~/.claude/skills/learned/
```

4. **Testar Stop hook manualmente**:
```bash
node ~/.claude/skills/continuous-learning/scripts/hooks/evaluate-session.js
```

## Armadilhas Comuns

### Armadilha 1: Sessão Muito Curta Não Aciona Extração

**Problema**:
O script do Stop hook verifica a duração da sessão e pula quando está abaixo de `min_session_length`.

**Causa**:
O padrão `min_session_length: 10` significa que sessões curtas não acionam avaliação.

**Solução**:
```json
{
  "min_session_length": 5  // Reduzir o limiar
}
```

::: warning Atenção
Não defina muito baixo (como < 5), caso contrário extrairá muitos padrões sem sentido (como correções simples de sintaxe).
:::

---

### Armadilha 2: `auto_approve: true` Causa Salvamento Automático de Padrões Ruins

**Problema**:
No modo de salvamento automático, o Claude pode salvar padrões de baixa qualidade.

**Causa**:
`auto_approve: true` pula a etapa de confirmação manual.

**Solução**:
```json
{
  "auto_approve": false  // Sempre manter false
}
```

**Prática Recomendada**:
Sempre confirme manualmente os padrões extraídos para garantir qualidade.

---

### Armadilha 3: Diretório de Learned Skills Não Existe Causa Falha ao Salvar

**Problema**:
O Stop hook executa com sucesso, mas o arquivo de skill não é criado.

**Causa**:
O diretório apontado por `learned_skills_path` não existe.

**Solução**:
```bash
# Criar diretório manualmente
mkdir -p ~/.claude/skills/learned/

# Ou usar caminho absoluto na configuração
{
  "learned_skills_path": "/caminho/absoluto/para/learned/"
}
```

---

### Armadilha 4: Caminho do Script Stop Hook Incorreto (Windows)

**Problema**:
Stop hook não é acionado no Windows.

**Causa**:
O arquivo de configuração usa caminhos estilo Unix (`~/.claude/...`), mas o caminho real do Windows é diferente.

**Solução**:
```json
{
  "command": "C:\\Users\\SeuNome\\.claude\\skills\\continuous-learning\\evaluate-session.cmd"
}
```

**Prática Recomendada**:
Use scripts Node.js (multiplataforma) em vez de scripts Shell.

---

### Armadilha 5: Padrões Extraídos Muito Genéricos, Baixa Reutilização

**Problema**:
Descrições de padrões extraídos muito vagas (como "corrigir erro de tipo"), faltando contexto específico.

**Causa**:
Não incluiu informações de contexto suficientes durante a extração (mensagens de erro, exemplos de código, cenários aplicáveis).

**Solução**:
Forneça contexto mais detalhado ao usar `/learn`:

```
/learn Resolvi um erro de tipo TypeScript: Property 'xxx' does not exist on type 'yyy'. Resolvi temporariamente usando type assertion as, mas o melhor método é usar restrições genéricas.
```

**Checklist**:
- [ ] Descrição do problema específica (inclui mensagem de erro)
- [ ] Solução detalhada (inclui exemplo de código)
- [ ] Cenários aplicáveis claros (quando usar este padrão)
- [ ] Nomenclatura específica (como "typescript-generic-constraints" em vez de "type-fix")

---

### Armadilha 6: Muitas Learned Skills, Difícil de Gerenciar

**Problema**:
Com o tempo, o diretório `learned/` acumula muitas skills, difíceis de encontrar e gerenciar.

**Causa**:
Não limpou regularmente skills de baixa qualidade ou desatualizadas.

**Solução**:

1. **Revisão periódica**: Verifique learned skills mensalmente
```bash
# Listar todas as skills
ls -la ~/.claude/skills/learned/

# Ver conteúdo da skill
cat ~/.claude/skills/learned/nome-do-padrao.md
```

2. **Marcar skills de baixa qualidade**: Adicione prefixo `deprecated-` ao nome do arquivo
```bash
mv ~/.claude/skills/learned/padrao-antigo.md \
   ~/.claude/skills/learned/deprecated-padrao-antigo.md
```

3. **Gerenciamento por categorias**: Use subdiretórios para categorizar
```bash
mkdir -p ~/.claude/skills/learned/{types,debugging,testing}
mv ~/.claude/skills/learned/*types*.md ~/.claude/skills/learned/types/
```

**Prática Recomendada**:
Limpe trimestralmente para manter learned skills enxutas e eficazes.

---

## Resumo da Lição

O mecanismo de aprendizado contínuo funciona através de três componentes principais:

1. **Comando `/learn`**: Extrai manualmente padrões reutilizáveis da sessão
2. **Skill Continuous Learning**: Configura parâmetros de avaliação automática (duração da sessão, limiar de extração)
3. **Stop Hook**: Aciona automaticamente a avaliação ao final da sessão

**Pontos-Chave**:

- ✅ Extração manual é adequada para problemas importantes recém-resolvidos
- ✅ Avaliação automática é acionada pelo Stop hook ao final da sessão
- ✅ Padrões extraídos são salvos como learned skills no diretório `~/.claude/skills/learned/`
- ✅ Configure `min_session_length` para controlar a duração mínima da sessão (recomendado 10)
- ✅ Sempre mantenha `auto_approve: false`, confirme manualmente a qualidade da extração
- ✅ Limpe regularmente learned skills de baixa qualidade ou desatualizadas

**Melhores Práticas**:

- Após resolver problemas não triviais, use imediatamente `/learn` para extrair padrões
- Forneça contexto detalhado (descrição do problema, solução, exemplo de código, cenários aplicáveis)
- Use nomenclatura específica para skills (como "typescript-generic-constraints" em vez de "type-fix")
- Revise e limpe regularmente learned skills para manter a base de conhecimento enxuta

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos **[Estratégias de Otimização de Tokens](../token-optimization/)**.
>
> Você aprenderá:
> - Como otimizar o uso de tokens para maximizar a eficiência da janela de contexto
> - Configuração e uso da skill strategic-compact
> - Automação com hooks PreCompact e PostToolUse
> - Escolher o modelo adequado (opus vs sonnet) equilibrando custo e qualidade

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-25

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Definição do comando /learn | [`commands/learn.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/learn.md) | 1-71 |
| Skill Continuous Learning | [`skills/continuous-learning/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/continuous-learning/SKILL.md) | 1-81 |
| Script Stop Hook | [`scripts/hooks/evaluate-session.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/evaluate-session.js) | 1-79 |
| Comando Checkpoint | [`commands/checkpoint.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/checkpoint.md) | 1-75 |

**Constantes-Chave**:
- `min_session_length = 10`: Duração mínima padrão da sessão (número de mensagens do usuário)
- `CLAUDE_TRANSCRIPT_PATH`: Variável de ambiente, caminho do registro da sessão
- `learned_skills_path`: Caminho para salvar learned skills, padrão `~/.claude/skills/learned/`

**Funções-Chave**:
- `main()`: Função principal do evaluate-session.js, lê configuração, verifica duração da sessão, gera log
- `getLearnedSkillsDir()`: Obtém caminho do diretório de learned skills (processa expansão de `~`)
- `countInFile()`: Conta ocorrências de padrões correspondentes em um arquivo

**Itens de Configuração**:
| Item de Configuração | Tipo | Valor Padrão | Descrição |
| --- | --- | --- | --- |
| `min_session_length` | number | 10 | Duração mínima da sessão (número de mensagens do usuário) |
| `extraction_threshold` | string | "medium" | Limiar de extração |
| `auto_approve` | boolean | false | Salvar automaticamente (recomendado false) |
| `learned_skills_path` | string | "~/.claude/skills/learned/" | Caminho para salvar learned skills |
| `patterns_to_detect` | array | Ver código-fonte | Tipos de padrões a detectar |
| `ignore_patterns` | array | Ver código-fonte | Tipos de padrões a ignorar |

**Tipos de Padrões**:
- `error_resolution`: Padrões de resolução de erros
- `user_corrections`: Padrões de correção do usuário
- `workarounds`: Soluções alternativas
- `debugging_techniques`: Técnicas de depuração
- `project_specific`: Padrões específicos do projeto

**Tipos de Hook**:
- Stop: Executa ao final da sessão (evaluate-session.js)

</details>
