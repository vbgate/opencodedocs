---
title: "Melhores Práticas: Configuração do Projeto e Colaboração em Equipe | OpenSkills"
sidebarTitle: "Configurar Habilidades da Equipe em 5 Minutos"
subtitle: "Melhores Práticas: Configuração do Projeto e Colaboração em Equipe"
description: "Aprenda as melhores práticas do OpenSkills. Domine a instalação local vs global do projeto, configuração do modo Universal, padrões de escrita do SKILL.md e integração com CI/CD, melhorando a eficiência da colaboração em equipe."
tags:
  - "advanced"
  - "best-practices"
  - "skills"
  - "team"
prerequisite:
  - "start-quick-start"
  - "start-installation"
  - "start-first-skill"
order: 8
---

# Melhores Práticas

## O Que Você Aprenderá

- Escolher o método de instalação de habilidades adequado com base nos requisitos do projeto (local vs global vs Universal)
- Escrever arquivos SKILL.md seguindo os padrões (nome, descrição, instruções)
- Usar links simbólicos para desenvolvimento local eficiente
- Gerenciar versões e atualizações de habilidades
- Colaborar usando habilidades em ambientes de equipe
- Integrar o OpenSkills em pipelines de CI/CD

## Seu Problema Atual

Você já aprendeu a instalar e usar habilidades, mas encontrou esses problemas em projetos reais:

- As habilidades devem ser instaladas no diretório do projeto ou globalmente?
- Como compartilhar habilidades entre múltiplos agentes de IA?
- Escrevi a habilidade várias vezes, mas a IA ainda não se lembra
- Os membros da equipe instalam habilidades separadamente, com versões inconsistentes
- Depois de modificar a habilidade localmente, reinstalar toda vez é inconveniente

Nesta aula, resumimos as melhores práticas do OpenSkills para ajudá-lo a resolver esses problemas.

## Quando Usar Este Método

- **Otimização de configuração de projeto**: Escolha o local de instalação de habilidades apropriado com base no tipo de projeto
- **Ambientes de múltiplos agentes**: Use simultaneamente ferramentas como Claude Code, Cursor, Windsurf
- **Padronização de habilidades**: Formato de habilidades unificado e padrões de escrita para a equipe
- **Desenvolvimento local**: Iteração rápida e teste de habilidades
- **Colaboração em equipe**: Compartilhamento de habilidades, controle de versão, integração com CI/CD

## 🎒 Preparativos Antes de Começar

::: warning Verificação Prévia

Antes de começar, certifique-se de:

- ✅ Ter concluído [Início Rápido](../../start/quick-start/)
- ✅ Ter instalado pelo menos uma habilidade e sincronizado com AGENTS.md
- ✅ Entender o [formato básico do SKILL.md](../../start/what-is-openskills/)

:::

## Melhores Práticas de Configuração de Projeto

### 1. Instalação Local vs Global vs Universal

Escolher o local de instalação apropriado é o primeiro passo da configuração do projeto.

#### Instalação Local do Projeto (Padrão)

**Cenário de uso**: Habilidades exclusivas para projetos específicos

```bash
# Instalar em .claude/skills/
npx openskills install anthropics/skills
```

**Vantagens**:

- ✅ As habilidades são controladas por versão com o projeto
- ✅ Diferentes projetos usam diferentes versões de habilidades
- ✅ Não requer instalação global, reduzindo dependências

**Práticas recomendadas**:

- Habilidades específicas do projeto (como processos de build para frameworks específicos)
- Habilidades de negócio desenvolvidas internamente pela equipe
- Habilidades que dependem da configuração do projeto

#### Instalação Global

**Cenário de uso**: Habilidades comuns a todos os projetos

```bash
# Instalar em ~/.claude/skills/
npx openskills install anthropics/skills --global
```

**Vantagens**:

- ✅ Todos os projetos compartilham o mesmo conjunto de habilidades
- ✅ Não há necessidade de instalar repetidamente para cada projeto
- ✅ Gerenciamento centralizado de atualizações

**Práticas recomendadas**:

- Biblioteca oficial de habilidades da Anthropic (anthropics/skills)
- Habilidades de ferramentas gerais (como processamento de PDF, operações Git)
- Habilidades pessoais comuns

#### Modo Universal (Ambientes de Múltiplos Agentes)

**Cenário de uso**: Usar simultaneamente múltiplos agentes de IA

```bash
# Instalar em .agent/skills/
npx openskills install anthropics/skills --universal
```

**Ordem de prioridade** (da mais alta para a mais baixa):

1. `./.agent/skills/` (Universal local do projeto)
2. `~/.agent/skills/` (Universal global)
3. `./.claude/skills/` (Claude Code local do projeto)
4. `~/.claude/skills/` (Claude Code global)

**Práticas recomendadas**:

- ✅ Usar ao usar múltiplos agentes (Claude Code + Cursor + Windsurf)
- ✅ Evitar conflitos com o Claude Code Marketplace
- ✅ Gerenciar unificadamente todas as habilidades dos agentes

::: tip Quando usar o modo Universal?

Se o seu `AGENTS.md` é compartilhado pelo Claude Code e outros agentes, use `--universal` para evitar conflitos de habilidades. O modo Universal usa o diretório `.agent/skills/`, isolado do `.claude/skills/` do Claude Code.

:::

### 2. Priorize o uso de npx em vez de instalação global

O OpenSkills foi projetado para usar e pronto, recomendando sempre usar `npx`:

```bash
# ✅ Recomendado: usar npx
npx openskills install anthropics/skills
npx openskills sync
npx openskills list

# ❌ Evitar: chamar diretamente após instalação global
openskills install anthropics/skills
```

**Vantagens**:

- ✅ Não requer instalação global, evitando conflitos de versão
- ✅ Sempre usa a versão mais recente (npx atualiza automaticamente)
- ✅ Reduz dependências do sistema

**Quando a instalação global é necessária**:

- Em ambientes de CI/CD (para performance)
- Chamadas frequentes em scripts (reduzir o tempo de inicialização do npx)

```bash
# Instalação global em CI/CD ou scripts
npm install -g openskills
openskills install anthropics/skills -y
openskills sync -y
```

## Melhores Práticas de Gerenciamento de Habilidades

### 1. Padrões de Escrita do SKILL.md

#### Convenção de nomenclatura: formato com hífen

**Regras**:

- ✅ Correto: `pdf-editor`, `api-client`, `git-workflow`
- ❌ Incorreto: `PDF Editor` (espaços), `pdf_editor` (sublinhado), `PdfEditor` (camelCase)

**Motivo**: O formato com hífen é um identificador amigável para URLs, em conformidade com os padrões de nomenclatura de repositórios GitHub e sistemas de arquivos.

#### Escrita de descrição: terceira pessoa, 1-2 frases

**Regras**:

- ✅ Correto: `Use this skill for comprehensive PDF manipulation.`
- ❌ Incorreto: `You should use this skill to manipulate PDFs.` (segunda pessoa)

**Comparação de exemplos**:

| Cenário | ❌ Incorreto (segunda pessoa) | ✅ Correto (terceira pessoa) |
|--- | --- | ---|
| Habilidade PDF | You can use this to extract text from PDFs. | Extract text from PDFs with this skill. |
| Habilidade Git | When you need to manage branches, use this. | Manage Git branches with this skill. |
| Habilidade API | If you want to call the API, load this skill. | Call external APIs with this skill. |

#### Escrita de instruções: forma Imperativa/Infinitiva

**Regras**:

- ✅ Correto: `"To accomplish X, execute Y"`
- ✅ Correto: `"Load this skill when Z"`
- ❌ Incorreto: `"You should do X"`
- ❌ Incorreto: `"If you need Y"`

**Método mnemônico de escrita**:

1. **Começar com verbo**: "Create" → "Use" → "Return"
2. **Omitir "You"**: Não dizer "You should"
3. **Caminho claro**: Citar recursos começando com `references/`

**Comparação de exemplos**:

| ❌ Incorreto | ✅ Correto |
|--- | ---|
| "You should create a file" | "Create a file" |
| "When you want to load this skill" | "Load this skill when" |
| "If you need to see the docs" | "See references/guide.md" |

::: tip Por que usar Imperativa/Infinitiva?

Este estilo de escrita facilita a análise e execução de instruções por agentes de IA. As formas Imperativa e Infinitiva eliminam o sujeito "você", tornando as instruções mais diretas e claras.

:::

### 2. Controle de tamanho de arquivo

**Tamanho do arquivo SKILL.md**:

- ✅ **Recomendado**: até 5000 palavras
- ⚠️ **Aviso**: mais de 8000 palavras podem causar excedente de contexto
- ❌ **Proibido**: mais de 10000 palavras

**Métodos de controle**:

Mova a documentação detalhada para o diretório `references/`:

```markdown
# SKILL.md (instruções principais)

## Instructions

To process data:

1. Call the API endpoint
2. See `references/api-docs.md` for detailed response format  # documentação detalhada
3. Process the result

## Bundled Resources

For detailed API documentation, see:
- `references/api-docs.md`  # não carregado no contexto, economiza tokens
- `references/examples.md`
```

**Comparação de tamanhos de arquivo**:

| Arquivo | Limite de tamanho | Carregado no contexto? |
|--- | --- | ---|
| `SKILL.md` | < 5000 palavras | ✅ Sim |
| `references/` | sem limite | ❌ Não (carregado sob demanda) |
| `scripts/` | sem limite | ❌ Não (executável) |
| `assets/` | sem limite | ❌ Não (arquivos de modelo) |

### 3. Prioridade de pesquisa de habilidades

O OpenSkills pesquisa habilidades na seguinte ordem de prioridade (da mais alta para a mais baixa):

```
1. ./.agent/skills/        # Universal local do projeto
2. ~/.agent/skills/        # Universal global
3. ./.claude/skills/      # Claude Code local do projeto
4. ~/.claude/skills/      # Claude Code global
```

**Mecanismo de deduplicação**:

- Habilidades com o mesmo nome retornam apenas a primeira encontrada
- Habilidades locais do projeto têm prioridade sobre habilidades globais

**Cenário de exemplo**:

```
Projeto A:
- .claude/skills/pdf        # versão local do projeto v1.0
- ~/.claude/skills/pdf     # versão global v2.0

# openskills read pdf carregará .claude/skills/pdf (v1.0)
```

**Sugestões**:

- Coloque habilidades com requisitos especiais do projeto localmente
- Coloque habilidades gerais globalmente
- Use o modo Universal em ambientes de múltiplos agentes

## Melhores Práticas de Desenvolvimento Local

### 1. Use links simbólicos para desenvolvimento iterativo

**Problema**: Cada vez que você modifica a habilidade, precisa reinstalar, o que reduz a eficiência de desenvolvimento.

**Solução**: Use links simbólicos (symlink)

```bash
# 1. Clone o repositório de habilidades para o diretório de desenvolvimento
git clone git@github.com:your-org/my-skills.git ~/dev/my-skills

# 2. Crie o diretório de habilidades
mkdir -p .claude/skills

# 3. Crie o link simbólico
ln -s ~/dev/my-skills/my-skill .claude/skills/my-skill

# 4. Sincronize com AGENTS.md
npx openskills sync
```

**Vantagens**:

- ✅ Modificações no arquivo fonte entram em vigor imediatamente (sem reinstalação)
- ✅ Suporta atualizações baseadas em Git (apenas fazer pull)
- ✅ Múltiplos projetos compartilham a mesma versão de desenvolvimento da habilidade

**Verificar links simbólicos**:

```bash
# Ver links simbólicos
ls -la .claude/skills/

# Saída de exemplo:
# my-skill -> /Users/yourname/dev/my-skills/my-skill
```

**Precauções**:

- ✅ Links simbólicos são reconhecidos por `openskills list`
- ✅ Links quebrados (broken symlinks) são automaticamente pulados (não causam crash)
- ⚠️ Usuários do Windows precisam usar Git Bash ou WSL (Windows nativamente não suporta links simbólicos)

### 2. Compartilhar habilidades entre múltiplos projetos

**Cenário**: Múltiplos projetos precisam usar o mesmo conjunto de habilidades da equipe.

**Método 1: Instalação global**

```bash
# Instale globalmente o repositório de habilidades da equipe
npx openskills install your-org/team-skills --global
```

**Método 2: Link simbólico para o diretório de desenvolvimento**

```bash
# Crie um link simbólico em cada projeto
ln -s ~/dev/team-skills/my-skill .claude/skills/my-skill
```

**Método 3: Git Submodule**

```bash
# Adicione o repositório de habilidades como um submódulo
git submodule add git@github.com:your-org/team-skills.git .claude/skills

# Atualize o submódulo
git submodule update --init --recursive
```

**Escolha recomendada**:

| Método | Cenário de uso | Vantagens | Desvantagens |
|--- | --- | --- | ---|
| Instalação global | Todos os projetos compartilham habilidades unificadas | Gerenciamento centralizado, atualizações convenientes | Não permite personalização por projeto |
| Link simbólico | Desenvolvimento e teste locais | Modificações entram em vigor imediatamente | Precisa criar links manualmente |
| Git Submodule | Colaboração em equipe, controle de versão | Controlado por versão com o projeto | Gerenciamento de submódulos complexo |

## Melhores Práticas de Colaboração em Equipe

### 1. Controle de versão de habilidades

**Melhor prática**: Versionamento independente do repositório de habilidades

```bash
# Estrutura do repositório de habilidades da equipe
team-skills/
├── .git/
├── pdf-editor/
│   └── SKILL.md
├── api-client/
│   └── SKILL.md
└── git-workflow/
    └── SKILL.md
```

**Método de instalação**:

```bash
# Instale habilidades do repositório da equipe
npx openskills install git@github.com:your-org/team-skills.git
```

**Fluxo de atualização**:

```bash
# Atualize todas as habilidades
npx openskills update

# Atualize habilidades específicas
npx openskills update pdf-editor,api-client
```

**Sugestões de gerenciamento de versão**:

- Use Git Tags para marcar versões estáveis: `v1.0.0`, `v1.1.0`
- Registre a versão da habilidade em AGENTS.md: `<skill name="pdf-editor" version="1.0.0">`
- Use versões estáveis em CI/CD

### 2. Convenção de nomenclatura de habilidades

**Convenção de nomenclatura unificada da equipe**:

| Tipo de habilidade | Padrão de nomenclatura | Exemplo |
|--- | --- | ---|
| Ferramenta geral | `<tool-name>` | `pdf`, `git`, `docker` |
| Relacionado a framework | `<framework>-<purpose>` | `react-component`, `django-model` |
| Fluxo de trabalho | `<workflow>` | `ci-cd`, `code-review` |
| Exclusivo da equipe | `<team>-<purpose>` | `team-api`, `company-deploy` |

**Exemplos**:

```bash
# ✅ Nomenclatura unificada
team-skills/
├── pdf/                     # processamento de PDF
├── git-workflow/           # fluxo de trabalho Git
├── react-component/        # geração de componentes React
└── team-api/             # cliente de API da equipe
```

### 3. Padrões de documentação de habilidades

**Estrutura de documentação unificada da equipe**:

```markdown
---
name: <skill-name>
description: <1-2 frases, terceira pessoa>
author: <equipe/autor>
version: <número da versão>
---

# <título da habilidade>

## When to Use

Load this skill when:
- cenário 1
- cenário 2

## Instructions

To accomplish task:

1. passo 1
2. passo 2

## Bundled Resources

For detailed information:
- `references/api-docs.md`
- `scripts/helper.py`
```

**Lista de verificação obrigatória**:

- [ ] `name` usa formato com hífen
- [ ] `description` é 1-2 frases, terceira pessoa
- [ ] Instruções usam forma imperativa/infinitiva
- [ ] Inclui campos `author` e `version` (padrão da equipe)
- [ ] Inclui descrição detalhada de `When to Use`

## Melhores Práticas de Integração com CI/CD

### 1. Instalação e sincronização não interativas

**Cenário**: Automação de gerenciamento de habilidades em ambientes de CI/CD

**Use a flag `-y` para pular prompts interativos**:

```bash
# Exemplo de script CI/CD
#!/bin/bash

# Instale habilidades (não interativo)
npx openskills install anthropics/skills -y
npx openskills install git@github.com:your-org/team-skills.git -y

# Sincronize com AGENTS.md (não interativo)
npx openskills sync -y
```

**Exemplo de GitHub Actions**:

```yaml
name: Setup Skills

on: [push]

jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install OpenSkills
        run: npx openskills install anthropics/skills -y

      - name: Sync to AGENTS.md
        run: npx openskills sync -y

      - name: Verify Skills
        run: npx openskills list
```

### 2. Automação de atualização de habilidades

**Atualização agendada de habilidades**:

```yaml
# .github/workflows/update-skills.yml
name: Update Skills

on:
  schedule:
    - cron: '0 0 * * 0'  # atualização semanal
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Update Skills
        run: npx openskills update -y

      - name: Sync to AGENTS.md
        run: npx openskills sync -y

      - name: Commit Changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add AGENTS.md
          git diff --staged --quiet || git commit -m "Update skills"
          git push
```

### 3. Caminho de saída personalizado

**Cenário**: Sincronizar habilidades para um arquivo personalizado (como `.ruler/AGENTS.md`)

```bash
# Sincronize para um arquivo personalizado
npx openskills sync -o .ruler/AGENTS.md -y
```

**Exemplo de CI/CD**:

```yaml
# Gerar diferentes AGENTS.md para diferentes agentes de IA
- name: Sync for Claude Code
  run: npx openskills sync -o AGENTS.md -y

- name: Sync for Cursor
  run: npx openskills sync -o .cursor/AGENTS.md -y

- name: Sync for Windsurf
  run: npx openskills sync -o .windsurf/AGENTS.md -y
```

## Problemas Comuns e Soluções

### Problema 1: Habilidade não encontrada

**Sintomas**:

```bash
npx openskills read my-skill
# Error: Skill not found: my-skill
```

**Etapas de solução de problemas**:

1. Verifique se a habilidade está instalada:
   ```bash
   npx openskills list
   ```

2. Verifique se o nome da habilidade está correto (diferencia maiúsculas de minúsculas):
   ```bash
   # ❌ Incorreto
   npx openskills read My-Skill

   # ✅ Correto
   npx openskills read my-skill
   ```

3. Verifique se a habilidade está sendo substituída em um diretório de prioridade mais alta:
   ```bash
   # Verifique o local da habilidade
   ls -la .claude/skills/my-skill
   ls -la ~/.claude/skills/my-skill
   ```

### Problema 2: Link simbólico inacessível

**Sintomas**:

```bash
ln -s ~/dev/my-skills/my-skill .claude/skills/my-skill
# ln: failed to create symbolic link: Operation not permitted
```

**Soluções**:

- **macOS**: Permita links simbólicos nas preferências do sistema
- **Windows**: Use Git Bash ou WSL (Windows nativamente não suporta links simbólicos)
- **Linux**: Verifique as permissões do sistema de arquivos

### Problema 3: Atualização da habilidade não entrou em vigor

**Sintomas**:

```bash
npx openskills update
# ✅ Skills updated successfully

npx openskills read my-skill
# conteúdo ainda é a versão antiga
```

**Causa**: O agente de IA armazenou em cache o conteúdo antigo da habilidade.

**Soluções**:

1. Ressincronize AGENTS.md:
   ```bash
   npx openskills sync
   ```

2. Verifique o timestamp do arquivo de habilidade:
   ```bash
   ls -la .claude/skills/my-skill/SKILL.md
   ```

3. Se usar links simbólicos, recarregue a habilidade:
   ```bash
   npx openskills read my-skill
   ```

## Resumo da Aula

Principais pontos das melhores práticas do OpenSkills:

### Configuração do Projeto

- ✅ Instalação local do projeto: habilidades exclusivas para projetos específicos
- ✅ Instalação global: habilidades comuns a todos os projetos
- ✅ Modo Universal: compartilhamento de habilidades em ambientes de múltiplos agentes
- ✅ Priorize o uso de `npx` em vez de instalação global

### Gerenciamento de Habilidades

- ✅ Padrões de escrita do SKILL.md: nomenclatura com hífen, descrição em terceira pessoa, instruções imperativas
- ✅ Controle de tamanho de arquivo: SKILL.md < 5000 palavras, documentação detalhada em `references/`
- ✅ Prioridade de pesquisa de habilidades: entenda a prioridade de 4 diretórios e o mecanismo de deduplicação

### Desenvolvimento Local

- ✅ Use links simbólicos para desenvolvimento iterativo
- ✅ Compartilhamento de habilidades entre múltiplos projetos: instalação global, links simbólicos, Git Submodule

### Colaboração em Equipe

- ✅ Controle de versão de habilidades: repositório independente, Git Tag
- ✅ Convenção de nomenclatura unificada: ferramentas, frameworks, fluxos de trabalho
- ✅ Padrões de documentação unificados: author, version, When to Use

### Integração com CI/CD

- ✅ Instalação e sincronização não interativas: flag `-y`
- ✅ Automação de atualizações: tarefas agendadas, workflow_dispatch
- ✅ Caminho de saída personalizado: flag `-o`

## Próxima Aula

> Na próxima aula, aprenderemos **[Perguntas Frequentes](../faq/faq/)**.
>
> Você aprenderá:
> - Respostas rápidas para perguntas comuns do OpenSkills
> - Métodos de solução de problemas para falhas de instalação, habilidades não carregadas, etc.
> - Dicas de configuração para coexistência com Claude Code

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Data de atualização: 2026-01-24

| Funcionalidade | Caminho do arquivo | Linha |
|--- | --- | ---|
| Prioridade de pesquisa de habilidades | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts) | 14-25 |
| Mecanismo de deduplicação de habilidades | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 42-43, 57 |
| Processamento de links simbólicos | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 10-25 |
| Extração de campos YAML | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 4-7 |
| Proteção contra travessia de caminho | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 71-78 |
| Instalação não interativa | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 424 |
| Caminho de saída personalizado | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts) | 19-36 |

**Constantes principais**:
- 4 diretórios de pesquisa de habilidades: `./.agent/skills/`, `~/.agent/skills/`, `./.claude/skills/`, `~/.claude/skills/`

**Funções principais**:
- `getSearchDirs(): string[]` - Retorna diretórios de pesquisa de habilidades ordenados por prioridade
- `isDirectoryOrSymlinkToDirectory(entry: Dirent, parentDir: string): boolean` - Verifica se é diretório ou link simbólico apontando para diretório
- `extractYamlField(content: string, field: string): string` - Extrai valor de campo YAML (correspondência não gulosa)
- `isPathInside(path: string, targetDir: string): boolean` - Verifica se o caminho está dentro do diretório alvo (previne travessia de caminho)

**Exemplos de arquivos de habilidades**:
- [`examples/my-first-skill/SKILL.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/SKILL.md) - Exemplo de estrutura mínima
- [`examples/my-first-skill/references/skill-format.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/references/skill-format.md) - Referência de formato de padrão

</details>
