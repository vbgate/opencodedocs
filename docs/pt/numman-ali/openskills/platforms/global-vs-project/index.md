---
title: "Global vs Projeto: Local de Instalação | OpenSkills"
sidebarTitle: "Instalação Global: Compartilhar Skills entre Projetos"
subtitle: "Instalação Global vs Instalação Local do Projeto"
description: "Aprenda a diferença entre instalação global e local de skills no OpenSkills. Domine o uso da flag --global, entenda as regras de prioridade de busca e escolha o local de instalação adequado para cada cenário."
tags:
  - "Integração de Plataformas"
  - "Gerenciamento de Skills"
  - "Dicas de Configuração"
prerequisite:
  - "start-first-skill"
  - "platforms-install-sources"
order: 3
---

# Instalação Global vs Instalação Local do Projeto

## O Que Você Vai Aprender

- Entender a diferença entre os dois locais de instalação do OpenSkills (global vs local do projeto)
- Escolher o local de instalação adequado para cada cenário
- Dominar o uso da flag `--global`
- Entender as regras de prioridade de busca de skills
- Evitar erros comuns de configuração de local de instalação

::: info Pré-requisitos

Este tutorial assume que você já completou [Instalar a Primeira Skill](../../start/first-skill/) e [Fontes de Instalação Detalhadas](../install-sources/), e entende o fluxo básico de instalação de skills.

:::

---

## Sua Situação Atual

Você pode já ter aprendido a instalar skills, mas:

- **Onde as skills foram instaladas?**: Após executar `openskills install`, não sabe em qual diretório os arquivos das skills foram copiados
- **Preciso reinstalar em cada novo projeto?**: Ao mudar para outro projeto, as skills instaladas anteriormente desaparecem
- **E as skills que quero usar globalmente apenas uma vez?**: Algumas skills são necessárias em todos os projetos, não quer instalá-las em cada um
- **Compartilhar skills entre múltiplos projetos?**: Algumas skills são comuns à equipe, quer gerenciá-las de forma centralizada

Na verdade, o OpenSkills oferece dois locais de instalação, permitindo gerenciar skills de forma flexível.

---

## Quando Usar Este Método

**Cenários de uso para os dois locais de instalação**:

| Local de Instalação | Cenário Adequado | Exemplo |
| --- | --- | --- |
| **Local do Projeto** (padrão) | Skills específicas do projeto, necessitam controle de versão | Regras de negócio da equipe, ferramentas específicas do projeto |
| **Instalação Global** (`--global`) | Skills comuns a todos os projetos, sem necessidade de controle de versão | Ferramentas de geração de código genéricas, conversão de formatos de arquivo |

::: tip Recomendação

- **Use instalação local do projeto por padrão**: Permite que as skills acompanhem o projeto, facilitando colaboração em equipe e controle de versão
- **Use instalação global apenas para ferramentas universais**: Como `git-helper`, `docker-generator` e outras ferramentas cross-project
- **Evite globalização excessiva**: Skills instaladas globalmente são compartilhadas por todos os projetos, podendo causar conflitos ou inconsistências de versão

:::

---

## Conceito Principal: Dois Locais, Escolha Flexível

O local de instalação das skills do OpenSkills é controlado pela flag `--global`:

**Padrão (Instalação Local do Projeto)**:
- Local de instalação: `./.claude/skills/` (diretório raiz do projeto)
- Adequado para: Skills específicas de um único projeto
- Vantagem: Skills acompanham o projeto, podem ser commitadas no Git, facilitando colaboração em equipe

**Instalação Global**:
- Local de instalação: `~/.claude/skills/` (diretório home do usuário)
- Adequado para: Skills comuns a todos os projetos
- Vantagem: Compartilhadas por todos os projetos, sem necessidade de reinstalação

::: info Conceito Importante

**Local do Projeto**: Skills são instaladas no diretório `.claude/skills/` do projeto atual, visíveis apenas para o projeto atual.

**Instalação Global**: Skills são instaladas em `.claude/skills/` no diretório home do usuário, visíveis para todos os projetos.

:::

---

## Siga os Passos

### Passo 1: Verificar o Comportamento Padrão de Instalação

**Por quê**
Primeiro, entenda o método de instalação padrão para compreender a filosofia de design do OpenSkills.

Abra o terminal e execute em qualquer projeto:

```bash
# Instalar uma skill de teste (padrão: local do projeto)
npx openskills install anthropics/skills -y

# Ver a lista de skills
npx openskills list
```

**O que você deve ver**: Na lista de skills, cada skill tem a tag `(project)` após o nome

```
  codebase-reviewer         (project)
    Review code changes for issues...

Summary: 3 project, 0 global (3 total)
```

**Explicação**:
- Por padrão, as skills são instaladas no diretório `./.claude/skills/`
- O comando `list` exibe as tags `(project)` ou `(global)`
- Quando não se usa a flag `--global`, as skills são visíveis apenas para o projeto atual

---

### Passo 2: Verificar o Local de Instalação das Skills

**Por quê**
Confirmar o local real de armazenamento dos arquivos das skills, facilitando o gerenciamento posterior.

Execute no diretório raiz do projeto:

```bash
# Ver o diretório de skills local do projeto
ls -la .claude/skills/

# Ver o conteúdo do diretório de skills
ls -la .claude/skills/codebase-reviewer/
```

**O que você deve ver**:

```
.claude/skills/
├── codebase-reviewer/
│   ├── SKILL.md
│   └── .openskills.json    # Metadados de instalação
├── file-writer/
│   ├── SKILL.md
│   └── .openskills.json
└── ...
```

**Explicação**:
- Cada skill tem seu próprio diretório
- `SKILL.md` é o conteúdo principal da skill
- `.openskills.json` registra a origem da instalação e metadados (usado para atualizações)

---

### Passo 3: Instalar Skill Globalmente

**Por quê**
Entender o comando e o efeito da instalação global.

Execute:

```bash
# Instalar uma skill globalmente
npx openskills install anthropics/skills --global -y

# Ver a lista de skills novamente
npx openskills list
```

**O que você deve ver**:

```
  codebase-reviewer         (project)
    Review code changes for issues...
  file-writer              (global)
    Write files with format...

Summary: 1 project, 2 global (3 total)
```

**Explicação**:
- Ao usar a flag `--global`, as skills são instaladas em `~/.claude/skills/`
- O comando `list` exibe a tag `(global)`
- Skills com o mesmo nome priorizam a versão local do projeto (prioridade de busca)

---

### Passo 4: Comparar os Dois Locais de Instalação

**Por quê**
Através de comparação prática, entender as diferenças entre os dois locais de instalação.

Execute os seguintes comandos:

```bash
# Ver o diretório de skills instaladas globalmente
ls -la ~/.claude/skills/

# Comparar skills locais do projeto e globais
echo "=== Skills do Projeto ==="
ls .claude/skills/

echo "=== Skills Globais ==="
ls ~/.claude/skills/
```

**O que você deve ver**:

```
=== Skills do Projeto ===
codebase-reviewer
file-writer

=== Skills Globais ===
codebase-reviewer
file-writer
test-generator
```

**Explicação**:
- Skills locais do projeto: `./.claude/skills/`
- Skills globais: `~/.claude/skills/`
- Os dois diretórios podem conter skills com o mesmo nome, mas as locais do projeto têm prioridade maior

---

### Passo 5: Verificar a Prioridade de Busca

**Por quê**
Entender como o OpenSkills busca skills em múltiplos locais.

Execute:

```bash
# Instalar skill com mesmo nome em ambos os locais
npx openskills install anthropics/skills -y  # Local do projeto
npx openskills install anthropics/skills --global -y  # Global

# Ler skill (usará a versão local do projeto prioritariamente)
npx openskills read codebase-reviewer | head -5
```

**O que você deve ver**: A saída é o conteúdo da versão local do projeto da skill.

**Regras de Prioridade de Busca** (código-fonte `dirs.ts:18-24`):

```typescript
export function getSearchDirs(): string[] {
  return [
    join(process.cwd(), '.claude/skills'),   // 1. Local do projeto (maior prioridade)
    join(homedir(), '.claude/skills'),       // 2. Global
  ];
}
```

**Explicação**:
- Skills locais do projeto têm prioridade maior que globais
- Quando skills com o mesmo nome existem em ambos os locais, a versão local do projeto é usada prioritariamente
- Isso permite uma configuração flexível de "projeto sobrescreve global"

---

## Pontos de Verificação ✅

Complete as seguintes verificações para confirmar que você dominou o conteúdo desta aula:

- [ ] Consegue distinguir entre instalação local do projeto e instalação global
- [ ] Sabe a função da flag `--global`
- [ ] Entende as regras de prioridade de busca de skills
- [ ] Consegue escolher o local de instalação adequado para cada cenário
- [ ] Sabe como ver as tags de localização das skills instaladas

---

## Avisos de Problemas Comuns

### Erro Comum 1: Uso Incorreto da Instalação Global

**Cenário de erro**: Instalar skills específicas do projeto globalmente

```bash
# ❌ Erro: Regras de negócio da equipe não devem ser instaladas globalmente
npx openskills install my-company/rules --global
```

**Problema**:
- Outros membros da equipe não conseguem obter essa skill
- A skill não será versionada
- Pode conflitar com skills de outros projetos

**Solução correta**:

```bash
# ✅ Correto: Skills específicas do projeto usam instalação padrão (local do projeto)
npx openskills install my-company/rules
```

---

### Erro Comum 2: Esquecer a Flag `--global`

**Cenário de erro**: Quer compartilhar skill entre todos os projetos, mas esquece de adicionar `--global`

```bash
# ❌ Erro: Instalação padrão é local do projeto, outros projetos não podem usar
npx openskills install universal-tool
```

**Problema**:
- A skill é instalada apenas em `./.claude/skills/` do projeto atual
- Ao mudar para outro projeto, precisa reinstalar

**Solução correta**:

```bash
# ✅ Correto: Ferramentas universais usam instalação global
npx openskills install universal-tool --global
```

---

### Erro Comum 3: Conflito de Skills com Mesmo Nome

**Cenário de erro**: Skills com mesmo nome instaladas local e globalmente, mas espera usar a versão global

```bash
# Tanto local do projeto quanto global têm codebase-reviewer
# Mas quer usar a versão global (mais nova)
npx openskills install codebase-reviewer --global  # Instalar nova versão
npx openskills read codebase-reviewer  # ❌ Ainda lê a versão antiga
```

**Problema**:
- A versão local do projeto tem prioridade maior
- Mesmo instalando nova versão globalmente, ainda lê a versão antiga local do projeto

**Solução correta**:

```bash
# Opção 1: Remover a versão local do projeto
npx openskills remove codebase-reviewer  # Remover local do projeto
npx openskills read codebase-reviewer  # ✅ Agora lê a versão global

# Opção 2: Atualizar localmente no projeto
npx openskills update codebase-reviewer  # Atualizar versão local do projeto
```

---

## Resumo da Aula

**Pontos-chave**:

1. **Instalação padrão é local do projeto**: Skills são instaladas em `./.claude/skills/`, visíveis apenas para o projeto atual
2. **Instalação global usa `--global`**: Skills são instaladas em `~/.claude/skills/`, compartilhadas por todos os projetos
3. **Prioridade de busca**: Local do projeto > Global
4. **Princípio recomendado**: Use local para skills específicas do projeto, use global para ferramentas universais

**Fluxo de Decisão**:

```
[Precisa instalar skill] → [É específica do projeto?]
                               ↓ Sim
                       [Instalação local do projeto (padrão)]
                               ↓ Não
                       [Precisa de controle de versão?]
                               ↓ Sim
                       [Instalação local do projeto (pode commitar no Git)]
                               ↓ Não
                       [Instalação global (--global)]
```

**Dica de Memorização**:

- **Local do projeto**: Skills acompanham o projeto, colaboração em equipe sem preocupações
- **Instalação global**: Ferramentas universais ficam globais, todos os projetos podem usar

---

## Prévia da Próxima Aula

> Na próxima aula, vamos aprender **[Listar Skills Instaladas](../list-skills/)**.
>
> Você vai aprender:
> - Como ver todas as skills instaladas
> - Entender o significado das tags de localização das skills
> - Como contar a quantidade de skills do projeto e globais
> - Como filtrar skills por localização

---

## Apêndice: Referência do Código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Última atualização: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Determinação do local de instalação | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L84-L92) | 84-92 |
| Utilitário de caminhos de diretório | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts#L7-L25) | 7-25 |
| Exibição da lista de skills | [`src/commands/list.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/list.ts#L20-L43) | 20-43 |

**Constantes-chave**:
- `.claude/skills`: Diretório de skills padrão (compatível com Claude Code)
- `.agent/skills`: Diretório de skills universal (ambiente multi-agente)

**Funções-chave**:
- `getSkillsDir(projectLocal, universal)`: Retorna o caminho do diretório de skills com base nas flags
- `getSearchDirs()`: Retorna a lista de diretórios de busca de skills (ordenados por prioridade)
- `listSkills()`: Lista todas as skills instaladas, exibindo tags de localização

**Regras de Negócio**:
- Instalação padrão é local do projeto (`!options.global`)
- Prioridade de busca de skills: Local do projeto > Global
- O comando `list` exibe as tags `(project)` e `(global)`

</details>
