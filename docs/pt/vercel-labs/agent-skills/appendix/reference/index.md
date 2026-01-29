---
title: "Referência de API: Comandos e Tipos | Agent Skills"
sidebarTitle: "Referência de API"
subtitle: "Referência de API e Comandos"
description: "Consulte comandos de build, tipos TypeScript e modelos SKILL.md do Agent Skills. Inclui valores de ImpactLevel e scripts de deploy."
tags:
  - "Referência"
  - "API"
  - "Linha de Comando"
  - "Definições de Tipo"
prerequisite: []
---

# Referência de API e Comandos

Esta página fornece referência completa de API e comandos do Agent Skills, incluindo comandos da cadeia de ferramentas de build, definições de tipos TypeScript, formato de modelo SKILL.md e valores enumerados de níveis de impacto.

## Definições de Tipo TypeScript

### ImpactLevel (Nível de Impacto)

O nível de impacto indica o grau de influência da regra sobre o desempenho, com 6 níveis:

| Valor      | Descrição                     | Cenário Aplicável                                              |
| ---------- | ----------------------------- | -------------------------------------------------------------- |
| `CRITICAL` | Gargalo crítico              | Deve ser corrigido, afeta seriamente a experiência do usuário (ex: requisições em cachoeira, tamanho de empacotamento não otimizado) |
| `HIGH`     | Melhoria importante            | Melhora significativa de desempenho (ex: cache no servidor, eliminação de props duplicados) |
| `MEDIUM-HIGH` | Prioridade média-alta      | Melhoria clara de desempenho (ex: otimização de busca de dados) |
| `MEDIUM`   | Melhoria média               | Melhoria de desempenho mensurável (ex: otimização Memo, redução de Re-render) |
| `LOW-MEDIUM` | Prioridade baixa-média     | Leve melhoria de desempenho (ex: otimização de renderização) |
| `LOW`      | Melhoria incremental         | Micro-otimização (ex: estilo de código, modos avançados) |

**Localização no código fonte**: `types.ts:5`

### CodeExample (Exemplo de Código)

Estrutura de exemplos de código em regras:

| Campo       | Tipo    | Obrigatório | Descrição                                                  |
| ----------- | ------- | ---------- | ----------------------------------------------------------- |
| `label`     | string  | ✅         | Label do exemplo (como "Incorrect", "Correct")               |
| `description` | string  | ❌         | Descrição do label (opcional)                               |
| `code`      | string  | ✅         | Conteúdo do código                                          |
| `language`  | string  | ❌         | Linguagem do código (padrão 'typescript')                    |
| `additionalText` | string | ❌         | Notas adicionais (opcional)                                 |

**Localização no código fonte**: `types.ts:7-13`

### Rule (Regra)

Estrutura completa de uma regra de otimização de desempenho:

| Campo            | Tipo        | Obrigatório | Descrição                                                  |
| --------------- | ----------- | ---------- | ----------------------------------------------------------- |
| `id`            | string      | ✅         | ID da regra (gerado automaticamente, como "1.1", "2.3")   |
| `title`          | string      | ✅         | Título da regra                                            |
| `section`        | number      | ✅         | Capítulo ao qual pertence (1-8)                             |
| `subsection`     | number      | ❌         | Número de sub-capítulo (gerado automaticamente)                 |
| `impact`         | ImpactLevel  | ✅         | Nível de impacto                                            |
| `impactDescription` | string   | ❌         | Descrição de impacto (ex: "2-10× improvement")             |
| `explanation`    | string      | ✅         | Explicação da regra                                         |
| `examples`       | CodeExample[] | ✅        | Array de exemplos de código (pelo menos 1)                   |
| `references`     | string[]    | ❌         | Links de referência                                          |
| `tags`           | string[]    | ❌         | Tags (para busca)                                           |

**Localização no código fonte**: `types.ts:15-26`

### Section (Capítulo)

Estrutura de capítulo de regras:

| Campo            | Tipo        | Obrigatório | Descrição                                                  |
| --------------- | ----------- | ---------- | ----------------------------------------------------------- |
| `number`         | number      | ✅         | Número do capítulo (1-8)                                  |
| `title`          | string      | ✅         | Título do capítulo                                          |
| `impact`         | ImpactLevel  | ✅         | Nível de impacto geral                                       |
| `impactDescription` | string   | ❌         | Descrição de impacto                                       |
| `introduction`   | string      | ❌         | Introdução do capítulo (opcional)                            |
| `rules`          | Rule[]      | ✅         | Array de regras incluídas                                  |

**Localização no código fonte**: `types.ts:28-35`

### GuidelinesDocument (Documento de Diretrizes)

Estrutura completa do documento de diretrizes:

| Campo        | Tipo      | Obrigatório | Descrição                               |
| ----------- | --------- | ---------- | ---------------------------------------- |
| `version`    | string    | ✅         | Número de versão                        |
| `organization` | string   | ✅         | Nome da organização                      |
| `date`       | string    | ✅         | Data                                     |
| `abstract`   | string    | ✅         | Resumo                                   |
| `sections`   | Section[] | ✅         | Array de capítulos                        |
| `references` | string[]  | ❌         | Referências globais                       |

**Localização no código fonte**: `types.ts:37-44`

### TestCase (Caso de Teste)

Caso de teste extraído de regras, para avaliação automática por LLM.

| Campo       | Tipo               | Obrigatório | Descrição                                                  |
| ----------- | ------------------ | ---------- | ----------------------------------------------------------- |
| `ruleId`    | string             | ✅         | ID da regra, como "1.1"                                  |
| `ruleTitle`  | string             | ✅         | Título da regra                                            |
| `type`       | 'bad' \| 'good'   | ✅         | Tipo de caso de teste                                        |
| `code`       | string             | ✅         | Conteúdo do código                                          |
| `language`   | string             | ✅         | Linguagem do código                                          |
| `description` | string             | ❌         | Descrição                                                  |

**Localização no código fonte**: `types.ts:46-53`

## Comandos da Cadeia de Ferramentas de Build

### pnpm build

Constrói documentação de regras e extrai casos de teste.

**Comando**:
```bash
pnpm build
```

**Funcionalidade**:
1. Analisa todos os arquivos de regras (`rules/*.md`)
2. Agrupa e ordena por capítulo
3. Gera `AGENTS.md` documentação completa
4. Extrai casos de teste para `test-cases.json`

**Saída**:
```bash
Processed 57 rules
Generated AGENTS.md
Extracted 114 test cases
```

**Localização no código fonte**: `build.ts`

### pnpm build --upgrade-version

Constrói e atualiza automaticamente o número da versão.

**Comando**:
```bash
pnpm build --upgrade-version
```

**Funcionalidade**:
1. Executa todas as operações de `pnpm build`
2. Incrementa automaticamente o número da versão em `metadata.json`
   - Formato: `0.1.0` → `0.1.1`
   - Incrementa o último dígito

**Localização no código fonte**: `build.ts:19-24, 255-273`

### pnpm validate

Valida formato e integridade de todos os arquivos de regras.

**Comando**:
```bash
pnpm validate
```

**Itens Verificados**:
- ✅ Título de regra não vazio
- ✅ Explicação de regra não vazia
- ✅ Pelo menos um exemplo de código
- ✅ Inclui exemplos Bad/Incorrect e Good/Correct
- ✅ Nível de impacto válido (CRITICAL/HIGH/MEDIUM-HIGH/MEDIUM/LOW-MEDIUM/LOW)

**Saída de Sucesso**:
```bash
✓ All 57 rules are valid
```

**Saída de Falha**:
```bash
✗ Validation failed

✖ [async-parallel.md]: Missing or empty title
   rules/async-parallel.md:2

2 errors found
```

**Localização no código fonte**: `validate.ts`

### pnpm extract-tests

Extrai casos de teste de regras.

**Comando**:
```bash
pnpm extract-tests
```

**Funcionalidade**:
1. Lê todos os arquivos de regras
2. Extrai exemplos `Bad/Incorrect` e `Good/Correct`
3. Gera arquivo `test-cases.json`

**Saída**:
```bash
Extracted 114 test cases (57 bad, 57 good)
```

**Localização no código fonte**: `extract-tests.ts`

### pnpm dev

Fluxo de desenvolvimento (build + validate).

**Comando**:
```bash
pnpm dev
```

**Funcionalidade**:
1. Executa `pnpm build`
2. Executa `pnpm validate`
3. Garante formato correto de regras durante desenvolvimento

**Cenários Aplicáveis**:
- Validação após escrever nova regra
- Verificação de integridade após modificar regra

**Localização no código fonte**: `package.json:12`

## Modelo SKILL.md

### Modelo de Definição de Skill do Claude.ai

Cada Claude.ai Skill deve incluir arquivo `SKILL.md`:

```markdown
---
name: {skill-name}
description: {Uma frase descrevendo quando usar esta habilidade. Inclua frases de acionamento como "Deploy my app", "Check logs", etc.}
---

# {Título da Habilidade}

{Descrição breve do que a habilidade faz.}

## How It Works

{Lista numerada explicando fluxo de trabalho da habilidade}

## Usage

```bash
bash /mnt/skills/user/{skill-name}/scripts/{script}.sh [args]
```

**Arguments:**
- `arg1` - Descrição (padrão X)

**Examples:**
{Mostre 2-3 padrões de uso comuns}

## Output

{Mostre saída de exemplo que usuários verão}

## Present Results to User

{Modelo de como Claude deve formatar resultados ao apresentar aos usuários}

## Troubleshooting

{Problemas comuns e soluções, especialmente erros de rede/permissões}
```

**Localização no código fonte**: `AGENTS.md:29-69`

### Descrição de Campos Obrigatórios

| Campo       | Descrição                                                   | Exemplo                                                |
| ----------- | ------------------------------------------------------------ | ------------------------------------------------------ |
| `name`      | Nome da habilidade (nome do diretório)                           | `vercel-deploy`                                        |
| `description` | Descrição de uma frase, inclui frases de acionamento             | `Deploy applications to Vercel when user requests "Deploy my app"` |
| `title`     | Título da habilidade                                           | `Vercel Deploy`                                        |
| `How It Works` | Descrição de fluxo de trabalho                                 | Lista numerada, explicando 4-6 passos                    |
| `Usage`     | Método de uso                                                 | Inclui exemplo de linha de comando e descrição de parâmetros |
| `Output`    | Exemplo de saída                                             | Exibe os resultados de saída que os usuários verão         |
| `Present Results to User` | Modelo de formatação de resultado                 | Formato padrão de Claude para exibir resultados          |

**Localização no código fonte**: `skills/claude.ai/vercel-deploy-claimable/SKILL.md`

## Regras de Mapeamento de Níveis de Impacto

### Prefixo de Nome de Arquivo → Capítulo → Nível

| Prefixo de Arquivo | Número do Capítulo | Título do Capítulo     | Nível Padrão |
| ------------------- | ------------------- | ----------------------- | ------------- |
| `async-`           | 1                   | Eliminando Cachoeiras | CRITICAL      |
| `bundle-`          | 2                   | Otimização de Empacotamento | CRITICAL   |
| `server-`          | 3                   | Desempenho no Servidor | HIGH          |
| `client-`          | 4                   | Busca de Dados no Cliente | MEDIUM-HIGH |
| `rerender-`        | 5                   | Otimização de Re-render | MEDIUM        |
| `rendering-`       | 6                   | Desempenho de Renderização | MEDIUM     |
| `js-`              | 7                   | Desempenho JavaScript | LOW-MEDIUM   |
| `advanced-`        | 8                   | Modos Avançados       | LOW           |

### Exemplo de Arquivos

| Nome do Arquivo                | Capítulo Inferido Automaticamente | Nível Inferido Automaticamente |
| ------------------------------ | ------------------------------ | --------------------------- |
| `async-parallel.md`         | 1 (Eliminando Cachoeiras)    | CRITICAL                    |
| `bundle-dynamic-imports.md`  | 2 (Otimização de Empacotamento) | CRITICAL                  |
| `server-cache-react.md`       | 3 (Desempenho no Servidor)    | HIGH                        |
| `rerender-memo.md`           | 5 (Otimização de Re-render)   | MEDIUM                      |

**Localização no código fonte**: `parser.ts:201-210`

## Referência de Comandos de Deploy

### bash deploy.sh [path]

Comando de script de deploy Vercel.

**Comando**:
```bash
bash /mnt/skills/user/vercel-deploy/scripts/deploy.sh [path]
```

**Parâmetros**:
- `path` - Diretório ou arquivo .tgz para deploy (padrão diretório atual)

**Exemplos**:
```bash
# Deploy do diretório atual
bash /mnt/skills/user/vercel-deploy/scripts/deploy.sh

# Deploy de projeto específico
bash /mnt/skills/user/vercel-deploy/scripts/deploy.sh /path/to/project

# Deploy de tarball existente
bash /mnt/skills/user/vercel-deploy/scripts/deploy.sh /path/to/project.tgz
```

**Formato de Saída**:
- **Legível por humanos** (stderr): URL de preview e link de transferência de propriedade
- **JSON** (stdout): Dados estruturados (inclui deploymentId, projectId)

**Localização no código fonte**: `skills/claude.ai/vercel-deploy-claimable/SKILL.md:20-65`

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir localizações do código fonte</strong></summary>

> Atualizado em: 2026-01-25

| Funcionalidade            | Caminho do Arquivo                                                                                      | Número de Linha  |
| ----------------------- | --------------------------------------------------------------------------------------------------------- | ---------------- |
| Tipo ImpactLevel         | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L5) | 5                |
| Interface CodeExample   | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L7-L13) | 7-13             |
| Interface Rule          | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L15-L26) | 15-26            |
| Interface Section       | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L28-L35) | 28-35            |
| Interface GuidelinesDocument | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L37-L44) | 37-44            |
| Interface TestCase       | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L46-L53) | 46-53            |
| Argumentos de linha de comando build.ts | [`packages/react-best-practices-build/src/build.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/build.ts#L12-L14) | 12-14            |
| Lógica de atualização de versão build.ts | [`packages/react-best-practices-build/src/build.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/build.ts#L19-L24) | 19-24            |
| Lógica de validação validate.ts | [`packages/react-best-practices-build/src/validate.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts#L21-L66) | 21-66            |
| Arquivo de modelo de regras | [`skills/react-best-practices/rules/_template.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/_template.md) | Total            |
| Formato de modelo SKILL.md | [`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L31-L69) | 31-69            |
| SKILL do Vercel Deploy | [`skills/claude.ai/vercel-deploy-claimable/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md) | Total            |
| Mapeamento de prefixo de arquivo | [`packages/react-best-practices-build/src/parser.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/parser.ts#L201-L210) | 201-210          |

**Constantes Chave**:
- `ImpactLevel` enum: `'CRITICAL' | 'HIGH' | 'MEDIUM-HIGH' | 'MEDIUM' | 'LOW-MEDIUM' | 'LOW'`

**Funções Chave**:
- `incrementVersion(version: string)`: Incrementa número de versão (build.ts)
- `generateMarkdown(sections, metadata)`: Gera AGENTS.md (build.ts)
- `validateRule(rule, file)`: Valida integridade de arquivo de regra (validate.ts)

</details>
