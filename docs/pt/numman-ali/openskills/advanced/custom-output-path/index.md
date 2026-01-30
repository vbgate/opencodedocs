---
title: "Caminho de Saída Personalizado: Gerencie Habilidades com Flexibilidade | openskills"
sidebarTitle: "Coloque habilidades em qualquer lugar"
subtitle: "Caminho de Saída Personalizado: Gerencie Habilidades com Flexibilidade | openskills"
description: "Aprenda a usar o comando openskills sync -o para sincronizar habilidades flexivelmente para qualquer localização. Suporta criação automática de diretórios em ambientes de múltiplas ferramentas, atendendo necessidades de integração flexíveis."
tags:
  - "Funcionalidades Avançadas"
  - "Saída Personalizada"
  - "Sincronização de Habilidades"
  - "Flag -o"
prerequisite:
  - "start-sync-to-agents"
order: 2
---

# Caminho de Saída Personalizado

## O Que Você Vai Aprender

- Usar a flag `-o` ou `--output` para sincronizar habilidades para arquivos `.md` em qualquer localização
- Entender como a ferramenta cria automaticamente arquivos e diretórios que não existem
- Configurar diferentes AGENTS.md para diferentes ferramentas (Windsurf, Cursor, etc.)
- Gerenciar listas de habilidades em ambientes de múltiplos arquivos
- Pular o padrão `AGENTS.md` e integrar em sistemas de documentação existentes

::: info Pré-requisitos

Este tutorial assume que você já domina o uso de [sincronização básica de habilidades](../../start/sync-to-agents/). Se ainda não instalou nenhuma habilidade ou sincronizou AGENTS.md, por favor, complete os cursos pré-requisitos primeiro.

:::

---

## Sua Situação Atual

Você pode estar acostumado com `openskills sync` gerando `AGENTS.md` por padrão, mas pode encontrar:

- **Ferramentas requerem caminhos específicos**: Algumas ferramentas de IA (como Windsurf) esperam AGENTS.md em um diretório específico (como `.ruler/`), não no diretório raiz do projeto
- **Conflito de múltiplas ferramentas**: Usando simultaneamente múltiplas ferramentas de codificação, elas podem esperar AGENTS.md em locais diferentes
- **Integração com documentação existente**: Já existe um documento de lista de habilidades, deseja integrar as habilidades do OpenSkills nele, em vez de criar um novo arquivo
- **Diretório não existe**: Deseja sair para um diretório aninhado (como `docs/ai-skills.md`), mas o diretório ainda não existe

A raiz desses problemas é: **o caminho de saída padrão não pode atender a todos os cenários**. Você precisa de controle de saída mais flexível.

---

## Quando Usar Este Método

**Caminho de saída personalizado** é adequado para estes cenários:

- **Ambiente de múltiplas ferramentas**: Configure AGENTS.md independentes para diferentes ferramentas de IA (como `.ruler/AGENTS.md` vs `AGENTS.md`)
- **Requisitos de estrutura de diretório**: Ferramentas esperam AGENTS.md em um diretório específico (como `.ruler/` do Windsurf)
- **Integração com documentação existente**: Integre a lista de habilidades em sistemas de documentação existentes, em vez de criar novo AGENTS.md
- **Gerenciamento organizacional**: Armazene listas de habilidades classificadas por projeto ou funcionalidade (como `docs/ai-skills.md`)
- **Ambiente CI/CD**: Use caminho fixo de saída em fluxos automatizados

::: tip Recomendação

Se seu projeto usa apenas uma ferramenta de IA e a ferramenta suporta AGENTS.md no diretório raiz do projeto, use o caminho padrão. Use caminho de saída personalizado apenas quando precisar de gerenciamento de múltiplos arquivos ou requisitos específicos de caminho de ferramenta.

:::

---

## 🎒 Preparação Antes de Começar

Antes de começar, por favor, confirme:

- [ ] Completou [a instalação de pelo menos uma habilidade](../../start/first-skill/)
- [ ] Entrou no diretório do seu projeto
- [ ] Entende o uso básico de `openskills sync`

::: warning Verificação Prévia

Confirme se você tem habilidades instaladas:

```bash
npx openskills list
```

Se a lista estiver vazia, instale habilidades primeiro:

```bash
npx openskills install anthropics/skills
```

:::

---

## Conceito Principal: Controle de Saída Flexível

A funcionalidade de sincronização do OpenSkills tem como saída padrão `AGENTS.md`, mas você pode personalizar o caminho de saída usando a flag `-o` ou `--output`.

```
[Comportamento padrão]                    [Saída Personalizada]
openskills sync      →      AGENTS.md (diretório raiz do projeto)
openskills sync -o custom.md →  custom.md (diretório raiz do projeto)
openskills sync -o .ruler/AGENTS.md →  .ruler/AGENTS.md (diretório aninhado)
```

**Recursos-chave**:

1. **Caminho arbitrário**: Pode especificar qualquer caminho de arquivo `.md` (caminho relativo ou absoluto)
2. **Criação automática de arquivo**: Se o arquivo não existe, a ferramenta cria automaticamente
3. **Criação automática de diretório**: Se o diretório onde o arquivo está localizado não existe, a ferramenta cria recursivamente
4. **Título inteligente**: Ao criar o arquivo, adiciona automaticamente um título baseado no nome do arquivo (como `# AGENTS`)
5. **Validação de formato**: Deve terminar com `.md`, caso contrário, reportará erro

**Por que precisa desta funcionalidade?**

Diferentes ferramentas de IA podem ter caminhos esperados diferentes:

| Ferramenta | Caminho Esperado | Caminho Padrão Disponível |
|--- | --- | ---|
| Claude Code | `AGENTS.md`        | ✅ Disponível          |
| Cursor     | `AGENTS.md`        | ✅ Disponível          |
| Windsurf   | `.ruler/AGENTS.md` | ❌ Não disponível       |
| Aider      | `.aider/agents.md` | ❌ Não disponível       |

Usando a flag `-o`, você pode configurar o caminho correto para cada ferramenta.

---

## Siga os Passos

### Passo 1: Uso Básico - Saída para Diretório Atual

Primeiro, tente sincronizar habilidades para um arquivo personalizado no diretório atual:

```bash
npx openskills sync -o my-skills.md
```

**Por quê**

Usar `-o my-skills.md` diz à ferramenta para sair para `my-skills.md` em vez do padrão `AGENTS.md`.

**O que você deve ver**:

Se `my-skills.md` não existe, a ferramenta o criará:

```
Created my-skills.md
```

Em seguida, iniciará a interface de seleção interativa:

```
Found 2 skill(s)

? Select skills to sync to my-skills.md:
❯ ◉ pdf                        (project)  Comprehensive PDF manipulation toolkit...
  ◉ git-workflow                (project)  Git workflow: Best practices for commits...

<Space> selecionar  <a> selecionar todos  <i> inverter seleção  <Enter> confirmar
```

Após selecionar habilidades, você verá:

```
✅ Synced 2 skill(s) to my-skills.md
```

::: tip Verifique o arquivo gerado

Visualize o arquivo gerado:

```bash
cat my-skills.md
```

Você verá:

```markdown
<!-- Título do arquivo: # my-skills -->

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of available skills below can help...
</usage>

<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit...</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

Note que a primeira linha é `# my-skills`, que é o título gerado automaticamente pela ferramenta baseado no nome do arquivo.

:::

---

### Passo 2: Saída para Diretório Aninhado

Agora, tente sincronizar habilidades para um diretório aninhado que não existe:

```bash
npx openskills sync -o .ruler/AGENTS.md
```

**Por quê**

Algumas ferramentas (como Windsurf) esperam AGENTS.md no diretório `.ruler/`. Se o diretório não existe, a ferramenta criará automaticamente.

**O que você deve ver**:

Se o diretório `.ruler/` não existe, a ferramenta criará o diretório e o arquivo:

```
Created .ruler/AGENTS.md
```

Em seguida, iniciará a interface de seleção interativa (igual ao passo anterior).

**Guia de Operação**:

```
┌─────────────────────────────────────────────────────────────┐
│  Explicação de Criação Automática de Diretório              │
│                                                             │
│  Comando de entrada: openskills sync -o .ruler/AGENTS.md   │
│                                                             │
│  Execução da ferramenta:                                    │
│  1. Verificar se .ruler existe  →  Não existe               │
│  2. Criar diretório .ruler recursivamente  →  mkdir .ruler  │
│  3. Criar .ruler/AGENTS.md  →  Escrever título # AGENTS     │
│  4. Sincronizar conteúdo de habilidades  →  Escrever lista de habilidades em formato XML │
│                                                             │
│  Resultado: arquivo .ruler/AGENTS.md gerado, habilidades sincronizadas │
└─────────────────────────────────────────────────────────────┘
```

::: tip Criação Recursiva

A ferramenta cria recursivamente todos os diretórios pai que não existem. Por exemplo:

- `docs/ai/skills.md` - Se `docs` e `docs/ai` não existirem, ambos serão criados
- `.config/agents.md` - Criará o diretório oculto `.config`

:::

---

### Passo 3: Gerenciamento de Múltiplos Arquivos - Configurar para Diferentes Ferramentas

Suponha que você usa Windsurf e Cursor simultaneamente, precisa configurar diferentes AGENTS.md para eles:

```bash
<!-- Configurar para Windsurf (espera .ruler/AGENTS.md) -->
npx openskills sync -o .ruler/AGENTS.md

<!-- Configurar para Cursor (usa AGENTS.md no diretório raiz do projeto) -->
npx openskills sync
```

**Por quê**

Diferentes ferramentas podem esperar AGENTS.md em diferentes localizações. Usar `-o` permite configurar o caminho correto para cada ferramenta, evitando conflitos.

**O que você deve ver**:

Dois arquivos são gerados separadamente:

```bash
<!-- Visualizar AGENTS.md do Windsurf -->
cat .ruler/AGENTS.md

<!-- Visualizar AGENTS.md do Cursor -->
cat AGENTS.md
```

::: tip Independência de Arquivos

Cada arquivo `.md` é independente, contendo sua própria lista de habilidades. Você pode selecionar habilidades diferentes em diferentes arquivos:

- `.ruler/AGENTS.md` - Habilidades selecionadas para Windsurf
- `AGENTS.md` - Habilidades selecionadas para Cursor
- `docs/ai-skills.md` - Lista de habilidades na documentação

:::

---

### Passo 4: Sincronização Não-interativa para Arquivo Personalizado

Em ambientes CI/CD, você pode precisar pular a seleção interativa e sincronizar diretamente todas as habilidades para um arquivo personalizado:

```bash
npx openskills sync -o .ruler/AGENTS.md -y
```

**Por quê**

A flag `-y` pula a seleção interativa, sincronizando todas as habilidades instaladas. Combinada com a flag `-o`, pode sair para caminho personalizado em fluxos automatizados.

**O que você deve ver**:

```
Created .ruler/AGENTS.md
✅ Synced 2 skill(s) to .ruler/AGENTS.md
```

::: info Cenário de Uso CI/CD

Usar em scripts CI/CD:

```bash
#!/bin/bash
<!-- Instalar habilidades -->
npx openskills install anthropics/skills -y

<!-- Sincronizar para arquivo personalizado (não-interativo) -->
npx openskills sync -o .ruler/AGENTS.md -y
```

:::

---

### Passo 5: Verificar Arquivo de Saída

Por fim, verifique se o arquivo de saída foi gerado corretamente:

```bash
<!-- Visualizar conteúdo do arquivo -->
cat .ruler/AGENTS.md

<!-- Verificar se o arquivo existe -->
ls -l .ruler/AGENTS.md

<!-- Confirmar quantidade de habilidades -->
grep -c "<name>" .ruler/AGENTS.md
```

**O que você deve ver**:

1. O arquivo contém o título correto (como `# AGENTS`)
2. O arquivo contém tag XML `<skills_system>`
3. O arquivo contém lista de habilidades `<available_skills>`
4. Cada `<skill>` contém `<name>`, `<description>`, `<location>`

::: tip Verificar Caminho de Saída

Se você não tem certeza sobre o diretório de trabalho atual, pode usar:

```bash
<!-- Visualizar diretório atual -->
pwd

<!-- Verificar onde o caminho relativo será resolvido -->
realpath .ruler/AGENTS.md
```

:::

---

## Pontos de Verificação ✅

Após completar os passos acima, por favor, confirme:

- [ ] Usou com sucesso a flag `-o` para saída para arquivo personalizado
- [ ] A ferramenta criou automaticamente arquivos que não existiam
- [ ] A ferramenta criou automaticamente diretórios aninhados que não existiam
- [ ] O arquivo gerado contém o título correto (baseado no nome do arquivo)
- [ ] O arquivo gerado contém tag XML `<skills_system>`
- [ ] O arquivo gerado contém lista completa de habilidades
- [ ] Pode configurar diferentes caminhos de saída para diferentes ferramentas
- [ ] Pode usar combinação de `-y` e `-o` em ambientes CI/CD

Se todos os itens de verificação acima passaram, parabéns! Você dominou o uso de caminho de saída personalizado e pode sincronizar habilidades flexivelmente para qualquer localização.

---

## Avisos de Problemas Comuns

### Problema 1: Arquivo de Saída Não É Markdown

**Sintoma**:

```
Error: Output file must be a markdown file (.md)
```

**Causa**:

Ao usar a flag `-o`, a extensão do arquivo especificado não é `.md`. A ferramenta exige saída para arquivo markdown para garantir que ferramentas de IA possam analisar corretamente.

**Solução**:

Certifique-se de que o arquivo de saída termina com `.md`:

```bash
<!-- ❌ Errado -->
npx openskills sync -o skills.txt

<!-- ✅ Correto -->
npx openskills sync -o skills.md
```

---

### Problema 2: Erro de Permissão de Criação de Diretório

**Sintoma**:

```
Error: EACCES: permission denied, mkdir '.ruler'
```

**Causa**:

Ao tentar criar o diretório, o usuário atual não tem permissão de escrita no diretório pai.

**Solução**:

1. Verifique permissões do diretório pai:

```bash
ls -ld .
```

2. Se permissões insuficientes, contate o administrador ou use diretório com permissão:

```bash
<!-- Usar diretório do projeto -->
cd ~/projects/my-project
npx openskills sync -o .ruler/AGENTS.md
```

---

### Problema 3: Caminho de Saída Muito Longo

**Sintoma**:

O caminho do arquivo é muito longo, dificultando leitura e manutenção do comando:

```bash
npx openskills sync -o docs/ai/skills/v2/internal/agents.md
```

**Causa**:

Diretório aninhado muito profundo, dificultando gerenciamento do caminho.

**Solução**:

1. Use caminho relativo (começando do diretório raiz do projeto)
2. Simplifique a estrutura de diretório
3. Considere usar link simbólico (consulte [Suporte a Link Simbólico](../symlink-support/))

```bash
<!-- Prática recomendada: estrutura de diretório plana -->
npx openskills sync -o docs/agents.md
```

---

### Problema 4: Esquecer de Usar Flag -o

**Sintoma**:

Espera sair para arquivo personalizado, mas a ferramenta ainda sai para o padrão `AGENTS.md`.

**Causa**:

Esqueceu de usar a flag `-o`, ou erro de digitação.

**Solução**:

1. Verifique se o comando contém `-o` ou `--output`:

```bash
<!-- ❌ Errado: esqueceu flag -o -->
npx openskills sync

<!-- ✅ Correto: usar flag -o -->
npx openskills sync -o .ruler/AGENTS.md
```

2. Use forma completa `--output` (mais claro):

```bash
npx openskills sync --output .ruler/AGENTS.md
```

---

### Problema 5: Nome de Arquivo Contém Caracteres Especiais

**Sintoma**:

O nome do arquivo contém espaços ou caracteres especiais, causando erro de análise de caminho:

```bash
npx openskills sync -o "my skills.md"
```

**Causa**:

Alguns shells tratam caracteres especiais de maneiras diferentes, podendo causar erros de caminho.

**Solução**:

1. Evite usar espaços e caracteres especiais
2. Se precisar usar, envolva com aspas:

```bash
<!-- Não recomendado -->
npx openskills sync -o "my skills.md"

<!-- Recomendado -->
npx openskills sync -o my-skills.md
```

---

## Resumo da Aula

Nesta aula, você aprendeu:

- **Usar a flag `-o` ou `--output`** para sincronizar habilidades para arquivo `.md` personalizado
- **Mecanismo de criação automática de arquivo e diretório**, sem necessidade de preparar estrutura de diretório manualmente
- **Configurar diferentes AGENTS.md para diferentes ferramentas**, evitando conflitos de múltiplas ferramentas
- **Técnicas de gerenciamento de múltiplos arquivos**, armazenando listas de habilidades classificadas por ferramenta ou funcionalidade
- **Uso em ambiente CI/CD** com combinação de `-y` e `-o` para implementar sincronização automatizada

**Comandos Principais**:

| Comando | Função |
|--- | ---|
| `npx openskills sync -o custom.md` | Sincronizar para `custom.md` no diretório raiz do projeto |
| `npx openskills sync -o .ruler/AGENTS.md` | Sincronizar para `.ruler/AGENTS.md` (cria diretório automaticamente) |
| `npx openskills sync -o path/to/file.md` | Sincronizar para qualquer caminho (cria diretório aninhado automaticamente) |
| `npx openskills sync -o custom.md -y` | Sincronização não-interativa para arquivo personalizado |

**Pontos-chave**:

- O arquivo de saída deve terminar com `.md`
- A ferramenta cria automaticamente arquivos e diretórios que não existem
- Ao criar arquivo, adiciona automaticamente título baseado no nome do arquivo
- Cada arquivo `.md` é independente, contendo sua própria lista de habilidades
- Adequado para ambientes de múltiplas ferramentas, requisitos de estrutura de diretório, integração com documentação existente e outros cenários

---

## Próxima Aula

> Na próxima aula, vamos aprender **[Suporte a Link Simbólico](../symlink-support/)**.
>
> Você vai aprender:
> - Como usar links simbólicos para implementar atualizações de habilidades baseadas em git
> - Vantagens e cenários de uso de links simbólicos
> - Como gerenciar habilidades em desenvolvimento local
> - Mecanismo de detecção e processamento de links simbólicos

Caminho de saída personalizado permite controlar flexivelmente a localização da lista de habilidades, enquanto links simbólicos fornecem uma maneira mais avançada de gerenciamento de habilidades, especialmente adequada para cenários de desenvolvimento local.

---

## Apêndice: Referência do Código-fonte

<details>
<summary><strong>Clique para expandir e ver localização do código-fonte</strong></summary>

> Última atualização: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Linhas |
|--- | --- | ---|
| Entrada do comando sync | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L18-L109) | 18-109 |
| Definição de opções CLI | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L66) | 66 |
| Obtenção do caminho de saída | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L19) | 19 |
| Validação do arquivo de saída | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L22-L26) | 22-26 |
| Criar arquivo que não existe | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L28-L36) | 28-36 |
| Criar diretório recursivamente | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L31-L32) | 31-32 |
| Gerar título automaticamente | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L34) | 34 |
| Prompt interativo usa nome do arquivo de saída | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L70) | 70 |

**Funções-chave**:
- `syncAgentsMd(options: SyncOptions)` - Sincroniza habilidades para arquivo de saída especificado
- `options.output` - Caminho de saída personalizado (opcional, padrão 'AGENTS.md')

**Constantes-chave**:
- `'AGENTS.md'` - Nome do arquivo de saída padrão
- `'.md'` - Extensão de arquivo exigida obrigatoriamente

**Lógica Importante**:
- O arquivo de saída deve terminar com `.md`, caso contrário reporta erro e sai (sync.ts:23-26)
- Se o arquivo não existe, cria automaticamente o diretório pai (recursivamente) e o arquivo (sync.ts:28-36)
- Ao criar arquivo, escreve título baseado no nome do arquivo: `# ${outputName.replace('.md', '')}` (sync.ts:34)
- Exibe o nome do arquivo de saída no prompt interativo (sync.ts:70)
- Exibe o nome do arquivo de saída na mensagem de sucesso da sincronização (sync.ts:105, 107)

</details>
