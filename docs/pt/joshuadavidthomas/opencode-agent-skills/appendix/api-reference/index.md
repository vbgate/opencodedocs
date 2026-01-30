---
title: "API: Referência de Ferramentas | opencode-agent-skills"
sidebarTitle: "Chamando as 4 Ferramentas"
subtitle: "API: Referência de Ferramentas | opencode-agent-skills"
description: "Aprenda a usar as 4 ferramentas principais da API do opencode-agent-skills. Domine configuração de parâmetros, tratamento de valores de retorno e técnicas de depuração de erros. Entenda o suporte a namespaces e mecanismos de segurança das ferramentas, e melhore sua eficiência de desenvolvimento com exemplos práticos."
tags:
  - "API"
  - "Referência de Ferramentas"
  - "Documentação de Interface"
prerequisite:
  - "start-installation"
order: 2
---

# Referência de Ferramentas da API

## O Que Você Vai Aprender

Através desta referência de API, você irá:

- Conhecer os parâmetros e valores de retorno das 4 ferramentas principais
- Dominar a forma correta de chamar as ferramentas
- Aprender a lidar com situações de erro comuns

## Visão Geral das Ferramentas

O plugin OpenCode Agent Skills fornece as seguintes 4 ferramentas:

| Nome da Ferramenta | Descrição | Cenário de Uso |
| --- | --- | --- |
| `get_available_skills` | Obtém lista de skills disponíveis | Visualizar todas as skills disponíveis, com suporte a filtro de busca |
| `read_skill_file` | Lê arquivo de skill | Acessar documentação, configuração e outros arquivos de suporte da skill |
| `run_skill_script` | Executa script de skill | Executar scripts de automação no diretório da skill |
| `use_skill` | Carrega skill | Injeta o conteúdo do SKILL.md no contexto da sessão |

---

## get_available_skills

Obtém a lista de skills disponíveis, com suporte a filtro de busca opcional.

### Parâmetros

| Nome do Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `query` | string | Não | String de consulta de busca, corresponde ao nome e descrição da skill (suporta curinga `*`) |

### Valor de Retorno

Retorna uma lista formatada de skills, cada item contém:

- Nome da skill e rótulo de origem (ex: `skill-name (project)`)
- Descrição da skill
- Lista de scripts disponíveis (se houver)

**Exemplo de retorno**:
```
git-helper (project)
  Git operations and workflow automation tools
  [scripts: tools/commit.sh, tools/branch.sh]

code-review (user)
  Code review checklist and quality standards
```

### Tratamento de Erros

- Quando não há resultados correspondentes, retorna uma mensagem informativa
- Se o parâmetro de consulta estiver com erro de digitação, retorna sugestões de skills similares

### Exemplos de Uso

**Listar todas as skills**:
```
Entrada do usuário:
Liste todas as skills disponíveis

Chamada da IA:
get_available_skills()
```

**Buscar skills contendo "git"**:
```
Entrada do usuário:
Encontre skills relacionadas a git

Chamada da IA:
get_available_skills({
  "query": "git"
})
```

**Busca com curinga**:
```
Chamada da IA:
get_available_skills({
  "query": "code*"
})

Retorno:
code-review (user)
  Code review checklist and quality standards
```

---

## read_skill_file

Lê arquivos de suporte no diretório da skill (documentação, configuração, exemplos, etc.).

### Parâmetros

| Nome do Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `skill` | string | Sim | Nome da skill |
| `filename` | string | Sim | Caminho do arquivo (relativo ao diretório da skill, ex: `docs/guide.md`, `scripts/helper.sh`) |

### Valor de Retorno

Retorna uma mensagem de confirmação de carregamento bem-sucedido do arquivo.

**Exemplo de retorno**:
```
File "docs/guide.md" from skill "code-review" loaded.
```

O conteúdo do arquivo é injetado no contexto da sessão em formato XML:

```xml
<skill-file skill="code-review" file="docs/guide.md">
  <metadata>
    <directory>/path/to/skills/code-review</directory>
  </metadata>
  
  <content>
[Conteúdo real do arquivo]
  </content>
</skill-file>
```

### Tratamento de Erros

| Tipo de Erro | Mensagem de Retorno |
| --- | --- |
| Skill não existe | `Skill "xxx" not found. Use get_available_skills to list available skills.` |
| Caminho inseguro | `Invalid path: cannot access files outside skill directory.` |
| Arquivo não existe | `File "xxx" not found. Available files: file1, file2, ...` |

### Mecanismo de Segurança

- Verificação de segurança de caminho: previne ataques de travessia de diretório (ex: `../../../etc/passwd`)
- Acesso limitado apenas a arquivos dentro do diretório da skill

### Exemplos de Uso

**Ler documentação da skill**:
```
Entrada do usuário:
Veja o guia de uso da skill code-review

Chamada da IA:
read_skill_file({
  "skill": "code-review",
  "filename": "docs/guide.md"
})
```

**Ler arquivo de configuração**:
```
Chamada da IA:
read_skill_file({
  "skill": "git-helper",
  "filename": "config.json"
})
```

---

## run_skill_script

Executa scripts executáveis no diretório da skill.

### Parâmetros

| Nome do Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `skill` | string | Sim | Nome da skill |
| `script` | string | Sim | Caminho relativo do script (ex: `build.sh`, `tools/deploy.sh`) |
| `arguments` | string[] | Não | Array de argumentos de linha de comando para passar ao script |

### Valor de Retorno

Retorna o conteúdo de saída do script.

**Exemplo de retorno**:
```
Building project...
✓ Dependencies installed
✓ Tests passed
Build complete.
```

### Tratamento de Erros

| Tipo de Erro | Mensagem de Retorno |
| --- | --- |
| Skill não existe | `Skill "xxx" not found. Use get_available_skills to list available skills.` |
| Script não existe | `Script "xxx" not found in skill "yyy". Available scripts: script1, script2, ...` |
| Falha na execução | `Script failed (exit 1): error message` |

### Regras de Descoberta de Scripts

O plugin escaneia automaticamente arquivos executáveis no diretório da skill:

- Profundidade máxima de recursão: 10 níveis
- Ignora diretórios ocultos (começando com `.`)
- Ignora diretórios de dependências comuns (`node_modules`, `__pycache__`, `.git`, etc.)
- Inclui apenas arquivos com bit de execução (`mode & 0o111`)

### Ambiente de Execução

- O diretório de trabalho (CWD) é alterado para o diretório da skill
- O script é executado no contexto do diretório da skill
- A saída é retornada diretamente para a IA

### Exemplos de Uso

**Executar script de build**:
```
Entrada do usuário:
Execute o script de build do projeto

Chamada da IA:
run_skill_script({
  "skill": "git-helper",
  "script": "tools/build.sh"
})
```

**Executar com argumentos**:
```
Chamada da IA:
run_skill_script({
  "skill": "deployment",
  "script": "deploy.sh",
  "arguments": ["--env", "production", "--force"]
})
```

---

## use_skill

Carrega o conteúdo do SKILL.md da skill no contexto da sessão.

### Parâmetros

| Nome do Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `skill` | string | Sim | Nome da skill (suporta prefixo de namespace, ex: `project:my-skill`, `user:my-skill`) |

### Valor de Retorno

Retorna uma mensagem de confirmação de carregamento bem-sucedido da skill, incluindo lista de scripts e arquivos disponíveis.

**Exemplo de retorno**:
```
Skill "code-review" loaded.
Available scripts: tools/check.sh, tools/format.sh
Available files: docs/guide.md, examples/bad.js
```

O conteúdo da skill é injetado no contexto da sessão em formato XML:

```xml
<skill name="code-review">
  <metadata>
    <source>user</source>
    <directory>/path/to/skills/code-review</directory>
    <scripts>
      <script>tools/check.sh</script>
      <script>tools/format.sh</script>
    </scripts>
    <files>
      <file>docs/guide.md</file>
      <file>examples/bad.js</file>
    </files>
  </metadata>

  [Mapeamento de ferramentas Claude Code...]
  
  <content>
[Conteúdo real do SKILL.md]
  </content>
</skill>
```

### Suporte a Namespace

Use prefixos de namespace para especificar precisamente a origem da skill:

| Namespace | Descrição | Exemplo |
| --- | --- | --- |
| `project:` | Skill OpenCode de nível de projeto | `project:my-skill` |
| `user:` | Skill OpenCode de nível de usuário | `user:my-skill` |
| `claude-project:` | Skill Claude de nível de projeto | `claude-project:my-skill` |
| `claude-user:` | Skill Claude de nível de usuário | `claude-user:my-skill` |
| Sem prefixo | Usa prioridade padrão | `my-skill` |

### Tratamento de Erros

| Tipo de Erro | Mensagem de Retorno |
| --- | --- |
| Skill não existe | `Skill "xxx" not found. Use get_available_skills to list available skills.` |

### Funcionalidade de Injeção Automática

Ao carregar uma skill, o plugin automaticamente:

1. Lista todos os arquivos no diretório da skill (exceto SKILL.md)
2. Lista todos os scripts executáveis
3. Injeta mapeamento de ferramentas Claude Code (se a skill necessitar)

### Exemplos de Uso

**Carregar skill**:
```
Entrada do usuário:
Ajude-me a fazer uma revisão de código

Chamada da IA:
use_skill({
  "skill": "code-review"
})
```

**Especificar origem usando namespace**:
```
Chamada da IA:
use_skill({
  "skill": "user:git-helper"
})
```

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-24

| Ferramenta | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Ferramenta GetAvailableSkills | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L29-L72) | 29-72 |
| Ferramenta ReadSkillFile | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L74-L135) | 74-135 |
| Ferramenta RunSkillScript | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L137-L198) | 137-198 |
| Ferramenta UseSkill | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L200-L267) | 200-267 |
| Registro de Ferramentas | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L160-L167) | 160-167 |
| Definição de Tipo Skill | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L43-L52) | 43-52 |
| Definição de Tipo Script | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L35-L38) | 35-38 |
| Definição de Tipo SkillLabel | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L30) | 30 |
| Função resolveSkill | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |

**Tipos principais**:
- `Skill`: Metadados completos da skill (name, description, path, scripts, template, etc.)
- `Script`: Metadados do script (relativePath, absolutePath)
- `SkillLabel`: Identificador de origem da skill (project, user, claude-project, etc.)

**Funções principais**:
- `resolveSkill()`: Resolve o nome da skill, suporta prefixos de namespace
- `isPathSafe()`: Valida segurança do caminho, previne travessia de diretório
- `findClosestMatch()`: Sugestão de correspondência aproximada

</details>

---

## Prévia da Próxima Lição

Este curso completou a documentação de referência de ferramentas da API do OpenCode Agent Skills.

Para mais informações, consulte:
- [Melhores Práticas de Desenvolvimento de Skills](../best-practices/) - Aprenda técnicas e padrões para escrever skills de alta qualidade
- [Solução de Problemas Comuns](../../faq/troubleshooting/) - Resolva problemas comuns ao usar o plugin
