---
title: "Estrutura de Arquivos: Organização de Diretórios | opencode-openskills"
sidebarTitle: "Onde Colocar Habilidades"
subtitle: "Estrutura de Arquivos: Organização de Diretórios | opencode-openskills"
description: "Aprenda a organização de diretórios e arquivos do OpenSkills. Domine os diretórios de instalação de habilidades, estrutura de diretórios, especificações de formato do AGENTS.md e prioridade de busca."
tags:
  - "Apêndice"
  - "Estrutura de Arquivos"
  - "Organização de Diretórios"
prerequisite: []
order: 3
---

# Estrutura de Arquivos

## Visão Geral

A estrutura de arquivos do OpenSkills é dividida em três categorias: **diretório de instalação de habilidades**, **estrutura de diretório de habilidades** e **arquivo de sincronização AGENTS.md**. Compreender essas estruturas ajuda você a gerenciar e usar habilidades de forma mais eficaz.

## Diretório de Instalação de Habilidades

O OpenSkills suporta 4 locais de instalação de habilidades, ordenados por prioridade (do mais alto para o mais baixo):

| Prioridade | Localização | Descrição | Quando Usar |
|--- | --- | --- | ---|
| 1 | `./.agent/skills/` | Modo Universal local do projeto | Ambientes de múltiplos agentes, evitar conflitos com Claude Code |
| 2 | `~/.agent/skills/` | Modo Universal global | Ambientes de múltiplos agentes + instalação global |
| 3 | `./.claude/skills/` | Local do projeto (padrão) | Instalação padrão, habilidades específicas do projeto |
| 4 | `~/.claude/skills/` | Instalação global | Habilidades compartilhadas entre todos os projetos |

**Recomendações de Escolha**:
- Ambiente de agente único: use o padrão `.claude/skills/`
- Ambiente de múltiplos agentes: use `.agent/skills/` (flag `--universal`)
- Habilidades comuns entre projetos: use instalação global (flag `--global`)

## Estrutura de Diretório de Habilidades

Cada habilidade é um diretório independente, contendo arquivos obrigatórios e recursos opcionais:

```
skill-name/
├── SKILL.md              # Obrigatório: arquivo principal da habilidade
├── .openskills.json      # Obrigatório: metadados de instalação (gerado automaticamente)
├── references/           # Opcional: documentos de referência
│   └── api-docs.md
├── scripts/             # Opcional: scripts executáveis
│   └── helper.py
└── assets/              # Opcional: modelos e arquivos de saída
    └── template.json
```

### Descrição dos Arquivos

#### SKILL.md (Obrigatório)

Arquivo principal da habilidade, contendo YAML frontmatter e instruções da habilidade:

```yaml
---
name: my-skill
description: Descrição da habilidade
---

## Título da Habilidade

Conteúdo das instruções da habilidade...
```

**Pontos Chave**:
- O nome do arquivo deve ser `SKILL.md` (maiúsculas)
- O YAML frontmatter deve conter `name` e `description`
- O conteúdo usa forma imperativa

#### .openskills.json (Obrigatório, Gerado Automaticamente)

Arquivo de metadados criado automaticamente pelo OpenSkills, registrando a fonte de instalação:

```json
{
  "source": "anthropics/skills",
  "sourceType": "github",
  "repoUrl": "https://github.com/anthropics/skills.git",
  "subpath": "pdf",
  "installedAt": "2026-01-24T12:00:00.000Z"
}
```

**Propósito**:
- Suporta atualizações de habilidades (`openskills update`)
- Registra o timestamp de instalação
- Rastreia a fonte da habilidade

**Localização da Fonte**:
- `src/utils/skill-metadata.ts:29-36` - Gravar metadados
- `src/utils/skill-metadata.ts:17-27` - Ler metadados

#### references/ (Opcional)

Armazena documentos de referência e especificações de API:

```
references/
├── skill-format.md      # Especificações de formato de habilidade
├── api-docs.md         # Documentação de API
└── best-practices.md   # Melhores práticas
```

**Cenários de Uso**:
- Documentação técnica detalhada (mantendo SKILL.md conciso)
- Manual de referência de API
- Código de exemplo e modelos

#### scripts/ (Opcional)

Armazena scripts executáveis:

```
scripts/
├── extract_text.py      # Script Python
├── deploy.sh          # Script Shell
└── build.js          # Script Node.js
```

**Cenários de Uso**:
- Scripts de automação que precisam ser executados durante a execução da habilidade
- Ferramentas de processamento e conversão de dados
- Scripts de implantação e compilação

#### assets/ (Opcional)

Armazena modelos e arquivos de saída:

```
assets/
├── template.json      # Modelo JSON
├── config.yaml       # Arquivo de configuração
└── output.md        # Exemplo de saída
```

**Cenários de Uso**:
- Modelos para conteúdo gerado pela habilidade
- Exemplos de arquivos de configuração
- Exemplos de saída esperada

## Estrutura do AGENTS.md

O arquivo AGENTS.md gerado por `openskills sync` contém a descrição do sistema de habilidades e a lista de habilidades disponíveis:

### Formato Completo

```markdown
<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively.

How to use skills:
- Invoke: `npx openskills read <skill-name>` (run in your shell)
- The skill content will load with detailed instructions
- Base directory provided in output for resolving bundled resources

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
</usage>

<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables...</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

### Descrição dos Componentes

| Componente | Descrição |
|--- | ---|
| `<skills_system>` | Tag XML, marca a seção do sistema de habilidades |
| `<usage>` | Instruções de uso de habilidades (informa a IA como chamar habilidades) |
| `<available_skills>` | Lista de habilidades disponíveis (cada habilidade tem uma tag `<skill>`) |
| `<skill>` | Informação de uma única habilidade (name, description, location) |
| `<!-- SKILLS_TABLE_START -->` | Marcador de início (usado para localização durante a sincronização) |
| `<!-- SKILLS_TABLE_END -->` | Marcador de fim (usado para localização durante a sincronização) |

**Campo location**:
- `project` - Habilidades locais do projeto (`.claude/skills/` ou `.agent/skills/`)
- `global` - Habilidades globais (`~/.claude/skills/` ou `~/.agent/skills/`)

## Prioridade de Busca de Diretório

Ao buscar habilidades, o OpenSkills percorre os diretórios na seguinte ordem de prioridade:

```typescript
// Localização da fonte: src/utils/dirs.ts:18-25
[
  join(process.cwd(), '.agent/skills'),   // 1. Universal do projeto
  join(homedir(), '.agent/skills'),        // 2. Universal global
  join(process.cwd(), '.claude/skills'),  // 3. Claude do projeto
  join(homedir(), '.claude/skills'),       // 4. Claude global
]
```

**Regras**:
- Para de buscar assim que encontrar a primeira habilidade correspondente
- Habilidades locais do projeto têm prioridade sobre habilidades globais
- Modo Universal tem prioridade sobre o modo padrão

**Localização da Fonte**: `src/utils/skills.ts:30-64` - Implementação de busca de todas as habilidades

## Exemplo: Estrutura Completa do Projeto

Uma estrutura de projeto típica usando OpenSkills:

```
my-project/
├── AGENTS.md                    # Lista de habilidades gerada por sincronização
├── .claude/                     # Configuração do Claude Code
│   └── skills/                  # Diretório de instalação de habilidades
│       ├── pdf/
│       │   ├── SKILL.md
│       │   ├── .openskills.json
│       │   ├── references/
│       │   ├── scripts/
│       │   └── assets/
│       └── git-workflow/
│           ├── SKILL.md
│           └── .openskills.json
├── .agent/                      # Diretório do modo Universal (opcional)
│   └── skills/
│       └── my-custom-skill/
│           ├── SKILL.md
│           └── .openskills.json
├── src/                         # Código fonte do projeto
├── package.json
└── README.md
```

## Melhores Práticas

### 1. Escolha de Diretório

| Cenário | Diretório Recomendado | Comando |
|--- | --- | ---|
| Habilidades específicas do projeto | `.claude/skills/` | `openskills install repo` |
| Compartilhamento entre múltiplos agentes | `.agent/skills/` | `openskills install repo --universal` |
| Comum entre projetos | `~/.claude/skills/` | `openskills install repo --global` |

### 2. Organização de Habilidades

- **Repositório de habilidade única**: coloque `SKILL.md` no diretório raiz
- **Repositório de múltiplas habilidades**: cada subdiretório contém seu próprio `SKILL.md`
- **Links simbólicos**: use symlink para vincular ao repositório local durante o desenvolvimento (veja [Suporte a Links Simbólicos](../../advanced/symlink-support/))

### 3. Controle de Versão do AGENTS.md

- **Recomendação de commit**: adicione `AGENTS.md` ao controle de versão
- **Sincronização CI**: execute `openskills sync -y` no CI/CD (veja [Integração CI/CD](../../advanced/ci-integration/))
- **Colaboração em equipe**: membros da equipe executam `openskills sync` para manter a consistência

## Resumo da Lição

O design da estrutura de arquivos do OpenSkills é simples e claro:

- **4 diretórios de instalação**: suporta local do projeto, global e modo Universal
- **Diretório de habilidades**: SKILL.md obrigatório + .openskills.json gerado automaticamente + recursos/scripts/assets opcionais
- **AGENTS.md**: lista de habilidades gerada por sincronização, seguindo o formato do Claude Code

Compreender essas estruturas ajuda você a gerenciar e usar habilidades com mais eficiência.

## Próxima Lição

> Na próxima lição, aprenderemos **[Glossário](../glossary/)**.
>
> Você aprenderá:
> - Termos chave do OpenSkills e do sistema de habilidades de IA
> - Definições precisas de conceitos profissionais
> - Significado de abreviações comuns

---

## Apêndice: Referência do Código-fonte

<details>
<summary><strong>Clique para expandir e ver localização do código-fonte</strong></summary>

> Data de atualização: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Linhas |
|--- | --- | ---|
| Utilitários de caminho de diretório | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts) | 1-25 |
| Busca de habilidades | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 30-84 |
| Gerenciamento de metadados | [`src/utils/skill-metadata.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-metadata.ts) | 1-36 |

**Funções Chave**:
- `getSkillsDir(projectLocal, universal)` - Obtém o caminho do diretório de habilidades
- `getSearchDirs()` - Obtém os 4 diretórios de busca (por prioridade)
- `findAllSkills()` - Busca todas as habilidades instaladas
- `findSkill(skillName)` - Busca uma habilidade específica
- `readSkillMetadata(skillDir)` - Lê metadados da habilidade
- `writeSkillMetadata(skillDir, metadata)` - Grava metadados da habilidade

</details>
