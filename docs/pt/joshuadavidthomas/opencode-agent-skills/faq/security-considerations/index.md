---
title: "Mecanismos de Segurança: Proteção e Validação de Caminhos | opencode-agent-skills"
sidebarTitle: "Mecanismos de Segurança"
subtitle: "Mecanismos de Segurança: Proteção e Validação de Caminhos"
description: "Aprenda sobre os mecanismos de segurança do plugin OpenCode Agent Skills. Domine os recursos de segurança como proteção de caminhos, análise YAML, validação de entrada e proteção de execução de scripts para usar o plugin de habilidades com segurança."
tags:
  - "Segurança"
  - "Melhores Práticas"
  - "FAQ"
prerequisite: []
order: "2"
---

# Aviso de Segurança

## O que você será capaz de fazer após aprender

- Entender como o plugin protege seu sistema contra ameaças de segurança
- Conhecer as normas de segurança que os arquivos de habilidades devem seguir
- Dominar as melhores práticas de segurança ao usar o plugin

## Ideia Central

O plugin OpenCode Agent Skills executa em seu ambiente local, executando scripts, lendo arquivos e analisando configurações. Embora seja poderoso, pode apresentar riscos de segurança se os arquivos de habilidades vierem de fontes não confiáveis.

O plugin foi projetado com múltiplas camadas de mecanismos de segurança, como várias portas de proteção, desde acesso a caminhos, análise de arquivos até execução de scripts, cada camada é rigorosamente verificada. Compreender esses mecanismos ajudará você a usar o plugin de forma mais segura.

## Detalhes dos Mecanismos de Segurança

### 1. Verificação de Segurança de Caminho: Prevenção de Directory Traversal

**Problema**: Se o arquivo de habilidade contém caminhos maliciosos (como `../../etc/passwd`), pode acessar arquivos sensíveis do sistema.

**Medidas de Proteção**:

O plugin usa a função `isPathSafe()` (`src/utils.ts:130-133`) para garantir que todo acesso a arquivos seja limitado ao diretório de habilidades:

```typescript
export function isPathSafe(basePath: string, requestedPath: string): boolean {
  const resolved = path.resolve(basePath, requestedPath);
  return resolved.startsWith(basePath + path.sep) || resolved === basePath;
}
```

**Como funciona**:
1. Resolve o caminho solicitado para um caminho absoluto
2. Verifica se o caminho resolvido começa com o diretório de habilidades
3. Se o caminho tentar sair do diretório de habilidades (contendo `..`), é rejeitado diretamente

**Exemplo Prático**:

Quando a ferramenta `read_skill_file` lê arquivos (`src/tools.ts:101-103`), ela chama primeiro `isPathSafe`:

```typescript
// Security: ensure path doesn't escape skill directory
if (!isPathSafe(skill.path, args.filename)) {
  return `Invalid path: cannot access files outside skill directory.`;
}
```

Isso significa que:
- ✅ `docs/guide.md` → Permitido (dentro do diretório de habilidades)
- ❌ `../../../etc/passwd` → Rejeitado (tentativa de acessar arquivos do sistema)
- ❌ `/etc/passwd` → Rejeitado (caminho absoluto)

::: info Por que isso é importante
Ataques de path traversal são vulnerabilidades comuns em aplicações web. Mesmo que o plugin execute localmente, habilidades não confiáveis podem tentar acessar suas chaves SSH, configurações de projetos e outros arquivos sensíveis.
:::

### 2. Análise YAML Segura: Prevenção de Execução de Código

**Problema**: YAML suporta tags personalizadas e objetos complexos; YAML malicioso pode executar código através de tags (como `!!js/function`).

**Medidas de Proteção**:

O plugin usa a função `parseYamlFrontmatter()` (`src/utils.ts:41-49`), adotando uma estratégia rigorosa de análise YAML:

```typescript
export function parseYamlFrontmatter(text: string): Record<string, unknown> {
  try {
    const result = YAML.parse(text, {
      // Use core schema which only supports basic JSON-compatible types
      // This prevents custom tags that could execute code
      schema: "core",
      // Limit recursion depth to prevent DoS attacks
      maxAliasCount: 100,
    });
    return typeof result === "object" && result !== null
      ? (result as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}
```

**Configurações de Segurança Chave**:

| Configuração | Função |
| --- | --- |
| `schema: "core"` | Suporta apenas tipos básicos JSON (string, número, booleano, array, objeto), desabilita tags personalizadas |
| `maxAliasCount: 100` | Limita a profundidade de recursão de aliases YAML, previne ataques DoS |

**Exemplo Prático**:

```yaml
# Exemplo de YAML malicioso (será rejeitado pelo core schema)
---
!!js/function >
function () { return "malicious code" }
---

# Formato seguro correto
---
name: my-skill
description: A safe skill description
---
```

Se a análise YAML falhar, o plugin ignora silenciosamente essa habilidade e continua descobrindo outras habilidades (`src/skills.ts:142-145`):

```typescript
let frontmatterObj: unknown;
try {
  frontmatterObj = parseYamlFrontmatter(frontmatterText);
} catch {
  return null;  // Análise falhou, pula esta habilidade
}
```

### 3. Validação de Entrada: Verificação Estrita com Zod Schema

**Problema**: Os campos de frontmatter da habilidade podem não estar em conformidade com as especificações, causando comportamento anormal do plugin.

**Medidas de Proteção**:

O plugin usa Zod Schema (`src/skills.ts:105-114`) para validação rigorosa do frontmatter:

```typescript
const SkillFrontmatterSchema = z.object({
  name: z.string()
    .regex(/^[\p{Ll}\p{N}-]+$/u, { message: "Name must be lowercase alphanumeric with hyphens" })
    .min(1, { message: "Name cannot be empty" }),
  description: z.string()
    .min(1, { message: "Description cannot be empty" }),
  license: z.string().optional(),
  "allowed-tools": z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.string()).optional()
});
```

**Regras de Validação**:

| Campo | Regra | Exemplo Rejeitado |
| --- | --- | --- |
| `name` | Letras minúsculas, números, hífen, não pode estar vazio | `MySkill` (maiúsculas), `my skill` (espaço) |
| `description` | Não pode estar vazio | `""` (string vazia) |
| `license` | String opcional | - |
| `allowed-tools` | Array de strings opcional | `[123]` (não é string) |
| `metadata` | Objeto key-value opcional (valores são strings) | `{key: 123}` (valor não é string) |

**Exemplo Prático**:

```yaml
# ❌ Erro: name contém letras maiúsculas
---
name: GitHelper
description: Git operations helper
---

# ✅ Correto: está em conformidade
---
name: git-helper
description: Git operations helper
---
```

Se a validação falhar, o plugin pula essa habilidade (`src/skills.ts:147-152`):

```typescript
let frontmatter: SkillFrontmatter;
try {
  frontmatter = SkillFrontmatterSchema.parse(frontmatterObj);
} catch (error) {
  return null;  // Validação falhou, pula esta habilidade
}
```

### 4. Segurança na Execução de Scripts: Apenas Executa Arquivos Executáveis

**Problema**: Se o plugin executar arquivos arbitrários (como arquivos de configuração, documentos), pode causar consequências inesperadas.

**Medidas de Proteção**:

O plugin ao descobrir scripts (`src/skills.ts:59-99`), coleta apenas arquivos com permissão de execução:

```typescript
async function findScripts(skillPath: string, maxDepth: number = 10): Promise<Script[]> {
  const scripts: Script[] = [];
  const skipDirs = new Set(['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']);

  // ... Lógica de travessia recursiva ...

  if (stats.isFile()) {
    // Crítico: coleta apenas arquivos com bit de execução
    if (stats.mode & 0o111) {
      scripts.push({
        relativePath: newRelPath,
        absolutePath: fullPath
      });
    }
  }
  // ...
}
```

**Características de Segurança**:

| Mecanismo de Verificação | Função |
| --- | --- |
| **Verificação de Bit Executável** (`stats.mode & 0o111`) | Executa apenas arquivos explicitamente marcados como executáveis pelo usuário, evitando execução acidental de documentos ou configurações |
| **Pular Diretórios Ocultos** (`entry.name.startsWith('.')`) | Não escaneia diretórios ocultos como `.git`, `.vscode`, evitando escanear muitos arquivos |
| **Pular Diretórios de Dependências** (`skipDirs.has(entry.name)`) | Pula `node_modules`, `__pycache__`, evitando escanear dependências de terceiros |
| **Limite de Profundidade de Recursão** (`maxDepth: 10`) | Limita a recursão a 10 níveis, evitando problemas de desempenho causados por diretórios profundos de habilidades maliciosas |

**Exemplo Prático**:

No diretório de habilidades:

```bash
my-skill/
├── SKILL.md
├── deploy.sh          # ✓ Executável (reconhecido como script)
├── build.sh           # ✓ Executável (reconhecido como script)
├── README.md          # ✗ Não executável (não será reconhecido como script)
├── config.json        # ✗ Não executável (não será reconhecido como script)
└── node_modules/      # ✗ Pulado (diretório de dependências)
    └── ...           # ✗ Pulado
```

Se chamar `run_skill_script("my-skill", "README.md")`, como README.md não tem permissão de execução e não é reconhecido como script (`src/skills.ts:86`), retornará um erro de "não encontrado" (`src/tools.ts:165-177`).

## Melhores Práticas de Segurança

### 1. Obtenha Habilidades de Fontes Confiáveis

- ✓ Use repositórios oficiais de habilidades ou desenvolvedores confiáveis
- ✓ Verifique o número de GitHub Stars da habilidade e a atividade dos contribuidores
- ✗ Não baixe e execute habilidades de fontes desconhecidas aleatoriamente

### 2. Revise o Conteúdo das Habilidades

Antes de carregar novas habilidades, examine rapidamente o SKILL.md e os arquivos de scripts:

```bash
# Ver descrição da habilidade e metadados
cat .opencode/skills/skill-name/SKILL.md

# Verificar conteúdo dos scripts
cat .opencode/skills/skill-name/scripts/*.sh
```

Preste atenção especial a:
- Se os scripts acessam caminhos sensíveis do sistema (`/etc`, `~/.ssh`)
- Se os scripts instalam dependências externas
- Se os scripts modificam configurações do sistema

### 3. Configure Permissões de Scripts Corretamente

Apenas arquivos que precisam ser executados explicitamente devem ter permissão de execução:

```bash
# Correto: adicionar permissão de execução aos scripts
chmod +x .opencode/skills/my-skill/tools/deploy.sh

# Correto: documentos mantêm permissões padrão (não executáveis)
# README.md, config.json etc. não precisam ser executados
```

### 4. Oculte Arquivos Sensíveis

Não inclua informações confidenciais no diretório de habilidades:

- ✗ Arquivos `.env` (chaves de API)
- ✗ Arquivos `.pem` (chaves privadas)
- ✗ `credentials.json` (credenciais)
- ✓ Use variáveis de ambiente ou configuração externa para gerenciar dados confidenciais

### 5. Habilidades de Projeto Sobrescrevem Habilidades de Usuário

Prioridade de descoberta de habilidades (`src/skills.ts:241-246`):

1. `.opencode/skills/` (nível de projeto)
2. `.claude/skills/` (nível de projeto, Claude)
3. `~/.config/opencode/skills/` (nível de usuário)
4. `~/.claude/skills/` (nível de usuário, Claude)
5. `~/.claude/plugins/cache/` (cache de plugins)
6. `~/.claude/plugins/marketplaces/` (mercado de plugins)

**Melhores Práticas**:

- Habilidades específicas do projeto devem ser colocadas em `.opencode/skills/`, que sobrescreverão automaticamente habilidades de usuário com o mesmo nome
- Habilidades genéricas devem ser colocadas em `~/.config/opencode/skills/`, disponíveis para todos os projetos
- Não é recomendado instalar globalmente habilidades de fontes não confiáveis

## Resumo desta Lição

O plugin OpenCode Agent Skills possui múltiplas camadas de proteção de segurança integradas:

| Mecanismo de Segurança | Objetivo de Proteção | Localização do Código |
| --- | --- | --- |
| Verificação de Segurança de Caminho | Prevenir directory traversal, limitar escopo de acesso a arquivos | `utils.ts:130-133` |
| Análise YAML Segura | Prevenir execução de código por YAML malicioso | `utils.ts:41-49` |
| Validação Zod Schema | Garantir que frontmatter de habilidades esteja em conformidade | `skills.ts:105-114` |
| Verificação de Executável de Scripts | Executar apenas arquivos explicitamente marcados como executáveis | `skills.ts:86` |
| Lógica de Pular Diretórios | Evitar escanear diretórios ocultos e de dependências | `skills.ts:61, 70` |

Lembre-se: segurança é responsabilidade compartilhada. O plugin fornece mecanismos de proteção, mas a decisão final está em suas mãos — use apenas habilidades de fontes confiáveis e desenvolva o hábito de revisar código.

## Próxima Lição

> Na próxima lição, aprenderemos sobre **[Melhores Práticas de Desenvolvimento de Habilidades](../../appendix/best-practices/)**.
>
> Você verá:
> - Convenções de nomenclatura e técnicas de escrita de descrições
> - Organização de diretórios e uso de scripts
> - Melhores práticas de Frontmatter
> - Métodos para evitar erros comuns

## Apêndice: Referência de Código-Fonte

<details>
<summary><strong>Clique para ver a localização do código-fonte</strong></summary>

> Tempo de atualização: 2026-01-24

| Mecanismo de Segurança | Caminho do Arquivo | Linha |
| --- | --- | --- |
| Verificação de Segurança de Caminho | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L130-L133) | 130-133 |
| Análise YAML Segura | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L41-L56) | 41-56 |
| Validação Zod Schema | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L105-L114) | 105-114 |
| Verificação de Executável de Scripts | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L86) | 86 |
| Lógica de Pular Diretórios | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L61-L70) | 61, 70 |
| Segurança de Caminho nas Ferramentas | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L101-L103) | 101-103 |

**Funções Chave**:
- `isPathSafe(basePath, requestedPath)`: Valida se o caminho é seguro, previne directory traversal
- `parseYamlFrontmatter(text)`: Analisa YAML com segurança, usando core schema e limite de recursão
- `SkillFrontmatterSchema`: Zod schema, valida campos de frontmatter de habilidades
- `findScripts(skillPath, maxDepth)`: Pesquisa recursivamente scripts executáveis, pula diretórios ocultos e de dependências

**Constantes Chave**:
- `maxAliasCount: 100`: Número máximo de aliases na análise YAML, previne ataques DoS
- `maxDepth: 10`: Profundidade máxima de recursão para descoberta de scripts
- `0o111`: Máscara de bit executável (verifica se arquivo é executável)

</details>
