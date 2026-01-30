---
title: "Agent Skills Cadeia de Ferramentas de Build: Validação, Build e Integração CI | Agent Skills Tutorial"
sidebarTitle: "Validar Regras e Build Automático"
subtitle: "Uso da Cadeia de Ferramentas de Build"
description: "Aprenda a usar a cadeia de ferramentas de build do Agent Skills, incluindo validação de regras com pnpm validate, geração de AGENTS.md e test-cases.json com pnpm build, fluxo de desenvolvimento com pnpm dev, configuração de CI com GitHub Actions, extração de casos de teste e avaliação automática com LLM. Este tutorial ensina a gerenciar biblioteca de regras, automatizar validação, integrar CI, extrair casos de teste, manter sistema de build e garantir qualidade de regras."
tags:
  - "Ferramentas de Build"
  - "CI/CD"
  - "Automação"
  - "Validação de Código"
order: 80
prerequisite:
  - "start-getting-started"
  - "start-installation"
  - "advanced-rule-authoring"
---

# Uso da Cadeia de Ferramentas de Build

## O Que Você Conseguirá Após Completar Esta Lição

Ao completar esta lição, você será capaz de:

- ✅ Usar `pnpm validate` para validar o formato e integridade dos arquivos de regras
- ✅ Usar `pnpm build` para gerar AGENTS.md e test-cases.json
- ✅ Compreender o fluxo de build: parse → validate → group → sort → generate
- ✅ Configurar CI com GitHub Actions para validação e build automáticos
- ✅ Extrair casos de teste para avaliação automática com LLM
- ✅ Usar `pnpm dev` para fluxo de desenvolvimento rápido (build + validate)

## Seu Problema Atual

Se você está mantendo ou estendendo a biblioteca de regras React, provavelmente encontrou estes problemas:

- ✗ Após modificar regras, esquece de validar o formato, resultando em erros no AGENTS.md gerado
- ✗ Com cada vez mais arquivos de regras, verificar manualmente a integridade de cada arquivo consome muito tempo
- ✗ Só após submeter o código descobre que uma regra está faltando exemplos de código, afetando a eficiência de revisão de PR
- ✗ Quer validar regras automaticamente no CI, mas não sabe como configurar GitHub Actions
- ✗ Não está claro sobre o fluxo de build de `build.ts`, não sabe onde investigar ao encontrar erros

## Quando Usar Esta Técnica

Quando você precisar:

- 🔍 **Validar regras**: Garantir que todos os arquivos de regras atendam às especificações antes de submeter código
- 🏗️ **Gerar documentação**: Gerar AGENTS.md estruturado a partir de arquivos de regras Markdown
- 🤖 **Extrair casos de teste**: Preparar dados de teste para avaliação automática com LLM
- 🔄 **Integrar CI**: Automatizar validação e build no GitHub Actions
- 🚀 **Desenvolvimento rápido**: Usar `pnpm dev` para iteração rápida e validação de regras

## 🎒 Preparação Antes de Começar

Antes de começar, por favor confirme:

::: warning Verificação de Pré-requisitos

- Completou [Introdução ao Agent Skills](../../start/getting-started/)
- Instalou Agent Skills e está familiarizado com uso básico
- Entende especificações de escrita de regras React (recomendado aprender primeiro [Escrevendo Regras de Melhores Práticas React](../rule-authoring/))
- Tem experiência básica com linha de comando
- Entende uso básico do gerenciador de pacotes pnpm

:::

## Ideia Central

**Função da Cadeia de Ferramentas de Build**:

A biblioteca de regras do Agent Skills é essencialmente 57 arquivos Markdown independentes, mas o Claude precisa de um AGENTS.md estruturado para usá-lo eficientemente. A cadeia de ferramentas de build é responsável por:

1. **Analisar arquivos de regras**: Extrair campos como title, impact, examples do Markdown
2. **Validar integridade**: Verificar se cada regra tem title, explanation e exemplos de código
3. **Agrupar e ordenar**: Agrupar por seção, ordenar alfabeticamente por título, atribuir IDs (1.1, 1.2...)
4. **Gerar documentação**: Saída de AGENTS.md e test-cases.json formatados

**Fluxo de Build**:

```
rules/*.md (57 arquivos)
    ↓
[parser.ts] Analisar Markdown
    ↓
[validate.ts] Validar integridade
    ↓
[build.ts] Agrupar → Ordenar → Gerar AGENTS.md
    ↓
[extract-tests.ts] Extrair casos de teste → test-cases.json
```

**Quatro Comandos Principais**:

| Comando                | Função                                   | Cenário de Uso                     |
|--- | --- | ---|
| `pnpm validate`        | Validar formato e integridade de regras  | Verificação antes de submissão, validação CI |
| `pnpm build`           | Gerar AGENTS.md e test-cases.json        | Após modificar regras, antes de publicar |
| `pnpm dev`             | Executar build + validate (fluxo dev)   | Iteração rápida, desenvolver novas regras |
| `pnpm extract-tests`   | Extrair casos de teste separadamente     | Ao atualizar apenas dados de teste |

---

## Siga-me: Usando a Cadeia de Ferramentas de Build

### Passo 1: Validar Regras (pnpm validate)

**Por que**
Ao desenvolver ou modificar regras, primeiro garanta que todos os arquivos de regras atendam às especificações, evitando descobrir erros apenas durante o build.

Entre no diretório de ferramentas de build:

```bash
cd packages/react-best-practices-build
```

Execute o comando de validação:

```bash
pnpm validate
```

**Você deve ver**:

```bash
Validating rule files...
Rules directory: /path/to/skills/react-best-practices/rules
✓ All 57 rule files are valid
```

**Se houver erros**:

```bash
✗ Validation failed:

  async-parallel.md: Missing or empty title
  bundle-dynamic-imports.md: Missing code examples
  rerender-memo.md: Invalid impact level: SUPER_HIGH
```

**Conteúdo validado** (código-fonte: `validate.ts`):

- ✅ title não está vazio
- ✅ explanation não está vazio
- ✅ Contém pelo menos um exemplo de código
- ✅ Contém pelo menos um exemplo "Incorrect/bad" ou "Correct/good"
- ✅ Nível de impact válido (CRITICAL/HIGH/MEDIUM-HIGH/MEDIUM/LOW-MEDIUM/LOW)

### Passo 2: Construir Documentação (pnpm build)

**Por que**
Gerar AGENTS.md e test-cases.json usados pelo Claude a partir dos arquivos de regras.

Execute o comando de build:

```bash
pnpm build
```

**Você deve ver**:

```bash
Building AGENTS.md from rules...
Rules directory: /path/to/skills/react-best-practices/rules
Output file: /path/to/skills/react-best-practices/AGENTS.md
✓ Built AGENTS.md with 8 sections and 57 rules
```

**Arquivos gerados**:

1. **AGENTS.md** (localizado em `skills/react-best-practices/AGENTS.md`)
   - Guia de otimização de desempenho React estruturado
   - Contém 8 seções, 57 regras
   - Ordenado por nível de impact (CRITICAL → HIGH → MEDIUM...)

2. **test-cases.json** (localizado em `packages/react-best-practices-build/test-cases.json`)
   - Casos de teste extraídos de todas as regras
   - Contém exemplos bad e good
   - Usado para avaliação automática com LLM

**Exemplo de estrutura AGENTS.md**:

```markdown
# React Best Practices

Version 1.0
Vercel Engineering
January 2026

---

## Abstract

Performance optimization guide for React and Next.js applications, ordered by impact.

---

## Table of Contents

1. [Eliminating Waterfalls](#1-eliminating-waterfalls) — **CRITICAL**
   - 1.1 [Parallel async operations](#11-parallel-async-operations)
   - 1.2 [Deferring non-critical async operations](#12-deferring-non-critical-async-outputs)

2. [Bundle Size Optimization](#2-bundle-size-optimization) — **CRITICAL**
   - 2.1 [Dynamic imports for large components](#21-dynamic-imports-for-large-components)

---

## 1. Eliminating Waterfalls

**Impact: CRITICAL**

Eliminating request waterfalls is the most impactful performance optimization you can make in React and Next.js applications.

### 1.1 Parallel async operations

**Impact: CRITICAL**

...

**Incorrect:**

```typescript
// Sequential fetching creates waterfalls
const userData = await fetch('/api/user').then(r => r.json())
const postsData = await fetch(`/api/user/${userData.id}/posts`).then(r => r.json())
```

**Correct:**

```typescript
// Fetch in parallel
const [userData, postsData] = await Promise.all([
  fetch('/api/user').then(r => r.json()),
  fetch('/api/posts').then(r => r.json())
])
```
```

**Exemplo de estrutura test-cases.json**:

```json
[
  {
    "ruleId": "1.1",
    "ruleTitle": "Parallel async operations",
    "type": "bad",
    "code": "// Sequential fetching creates waterfalls\nconst userData = await fetch('/api/user').then(r => r.json())\nconst postsData = await fetch(`/api/user/${userData.id}/posts`).then(r => r.json())",
    "language": "typescript",
    "description": "Incorrect example for Parallel async operations"
  },
  {
    "ruleId": "1.1",
    "ruleTitle": "Parallel async operations",
    "type": "good",
    "code": "// Fetch in parallel\nconst [userData, postsData] = await Promise.all([\n  fetch('/api/user').then(r => r.json()),\n  fetch('/api/posts').then(r => r.json())\n])",
    "language": "typescript",
    "description": "Correct example for Parallel async operations"
  }
]
```

### Passo 3: Fluxo de Desenvolvimento (pnpm dev)

**Por que**
Ao desenvolver novas regras ou modificar regras existentes, precisa iteração rápida, validação e build de todo o fluxo.

Execute o comando de desenvolvimento:

```bash
pnpm dev
```

**Este comando irá**:

1. Executar `pnpm build-agents` (gerar AGENTS.md)
2. Executar `pnpm extract-tests` (gerar test-cases.json)
3. Executar `pnpm validate` (validar todas as regras)

**Você deve ver**:

```bash
pnpm build-agents && pnpm extract-tests
Building AGENTS.md from rules...
Rules directory: /path/to/skills/react-best-practices/rules
Output file: /path/to/skills/react-best-practices/AGENTS.md
✓ Built AGENTS.md with 8 sections and 57 rules

Extracting test cases from rules...
Rules directory: /path/to/skills/react-best-practices/rules
Output file: /path/to/skills/react-best-practices-build/test-cases.json
✓ Extracted 114 test cases to /path/to/skills/react-best-practices-build/test-cases.json
  - Bad examples: 57
  - Good examples: 57

Validating rule files...
Rules directory: /path/to/skills/react-best-practices/rules
✓ All 57 rule files are valid
```

**Sugestão de fluxo de desenvolvimento**:

```bash
# 1. Modificar ou criar arquivo de regras
vim skills/react-best-practices/rules/my-new-rule.md

# 2. Executar pnpm dev para validação e build rápidos
cd packages/react-best-practices-build
pnpm dev

# 3. Verificar AGENTS.md gerado
cat ../skills/react-best-practices/AGENTS.md

# 4. Testar se Claude usa corretamente a nova regra
# (ativar habilidade no Claude Code e testar)
```

**Atualizar número de versão** (opcional):

```bash
pnpm build --upgrade-version
```

Isso irá automaticamente:
- Incrementar número de versão em `metadata.json` (por exemplo, 1.0 → 1.1)
- Atualizar campo version no Front Matter do `SKILL.md`

**Você deve ver**:

```bash
Upgrading version: 1.0 -> 1.1
✓ Updated metadata.json
✓ Updated SKILL.md
```

### Passo 4: Extrair Casos de Teste Separadamente (pnpm extract-tests)

**Por que**
Se você apenas atualizou a lógica de extração de dados de teste e não precisa reconstruir AGENTS.md, pode executar `extract-tests` separadamente.

```bash
pnpm extract-tests
```

**Você deve ver**:

```bash
Extracting test cases from rules...
Rules directory: /path/to/skills/react-best-practices/rules
Output file: /path/to/skills/react-best-practices-build/test-cases.json
✓ Extracted 114 test cases to /path/to/skills/react-best-practices-build/test-cases.json
  - Bad examples: 57
  - Good examples: 57
```

---

## Ponto de Verificação ✅

Agora verifique se você entendeu a cadeia de ferramentas de build:

- [ ] Sabe quais campos o `pnpm validate` valida
- [ ] Sabe quais arquivos o `pnpm build` gera
- [ ] Sabe o fluxo de desenvolvimento do `pnpm dev`
- [ ] Sabe o propósito do test-cases.json
- [ ] Sabe como atualizar número de versão (`--upgrade-version`)
- [ ] Sabe a estrutura do AGENTS.md (seções → regras → exemplos)

---

## Integração com CI do GitHub Actions

### Por Que Precisa de CI

Na colaboração em equipe, CI pode:
- ✅ Validar automaticamente formato de arquivos de regras
- ✅ Construir automaticamente AGENTS.md
- ✅ Impedir submissão de código que não atende às especificações

### Arquivo de Configuração CI

Configuração do GitHub Actions localizada em `.github/workflows/react-best-practices-ci.yml`:

```yaml
name: React Best Practices CI

on:
  push:
    branches: [main]
    paths:
      - 'skills/react-best-practices/**'
      - 'packages/react-best-practices-build/**'
  pull_request:
    branches: [main]
    paths:
      - 'skills/react-best-practices/**'
      - 'packages/react-best-practices-build/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: packages/react-best-practices-build
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 10.24.0
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
          cache-dependency-path: packages/react-best-practices-build/pnpm-lock.yaml
      - run: pnpm install
      - run: pnpm validate
      - run: pnpm build
```

### Condições de Acionamento do CI

O CI será executado automaticamente nas seguintes situações:

| Evento          | Condição                                                                                                           |
|--- | ---|
| `push`          | Submeter para branch `main`, e modificou `skills/react-best-practices/**` ou `packages/react-best-practices-build/**` |
| `pull_request` | Criar ou atualizar PR para branch `main`, e modificou os caminhos acima                                           |

### Etapas de Execução do CI

1. **Fazer checkout do código**: `actions/checkout@v4`
2. **Instalar pnpm**: `pnpm/action-setup@v2` (versão 10.24.0)
3. **Instalar Node.js**: `actions/setup-node@v4` (versão 20)
4. **Instalar dependências**: `pnpm install` (usando cache pnpm para acelerar)
5. **Validar regras**: `pnpm validate`
6. **Construir documentação**: `pnpm build`

Se qualquer etapa falhar, o CI será marcado como ❌ e impedirá o merge.

---

## Avisos sobre Problemas Comuns

### Problema 1: Validação Passa mas Build Falha

**Sintoma**: `pnpm validate` passa, mas `pnpm build` relata erro.

**Causa**: Validação apenas verifica formato de arquivos de regras, não verifica _sections.md ou metadata.json.

**Solução**:
```bash
# Verificar se _sections.md existe
ls skills/react-best-practices/rules/_sections.md

# Verificar se metadata.json existe
ls skills/react-best-practices/metadata.json

# Ver erro específico nos logs de build
pnpm build 2>&1 | grep -i error
```

### Problema 2: IDs de Regras Não Contínuos

**Sintoma**: IDs de regras no AGENTS.md gerado pulam números (por exemplo, 1.1, 1.3, 1.5).

**Causa**: Regras são ordenadas alfabeticamente por título, não por nome de arquivo.

**Solução**:
```bash
# O build irá ordenar automaticamente por título e atribuir IDs
# Se precisar de ordem personalizada, modifique o título da regra
# Por exemplo: mude para "A. Parallel" (começando com A ficará na frente)
pnpm build
```

### Problema 3: test-cases.json Tem Apenas Exemplos Bad

**Sintoma**: `pnpm extract-tests` mostra "Bad examples: 0".

**Causa**: Rótulos de exemplos em arquivos de regras não atendem às especificações.

**Solução**:
```markdown
# ❌ Errado: rótulos não padronizados
**Example:**

**Typo:**

# ✅ Correto: usar Incorrect ou Correct
**Incorrect:**

**Correct:**

# Ou usar rótulos bad/good (também suporta wrong, usage etc.)
**Bad example:**

**Good example:**
```

### Problema 4: pnpm validate Falha no CI

**Sintoma**: `pnpm validate` passa localmente, mas falha no CI.

**Causa**:
- Versão do Node.js não coincide (CI usa v20, local pode ter outra versão)
- Versão do pnpm não coincide (CI usa 10.24.0)
- Diferença de fim de linha entre Windows e Linux

**Solução**:
```bash
# Verificar versão do Node local
node --version  # Deve ser v20.x

# Verificar versão do pnpm local
pnpm --version  # Deve ser >= 10.24.0

# Unificar finais de linha (converter para LF)
git config core.autocrlf input
git add --renormalize .
git commit -m "Fix line endings"
```

### Problema 5: SKILL.md Não Atualizado Após Atualizar Versão

**Sintoma**: Após `pnpm build --upgrade-version`, número de versão em `metadata.json` mudou, mas `SKILL.md` não mudou.

**Causa**: Formato do version no Front Matter do SKILL.md não coincide.

**Solução**:
```yaml
# Verificar Front Matter do SKILL.md
---
version: "1.0"  # ✅ Deve ter aspas duplas
---

# Se o número de versão não tem aspas, adicione manualmente
---
version: 1.0   # ❌ Errado
version: "1.0" # ✅ Correto (com aspas duplas)
---
```

---

## Resumo da Lição

**Pontos Principais**:

1. **Validação (validate)**: Verificar formato de regras, integridade, nível de impact
2. **Build**: Analisar regras → agrupar → ordenar → gerar AGENTS.md
3. **Extração de Testes (extract-tests)**: Extrair exemplos bad/good de examples
4. **Fluxo de Desenvolvimento (dev)**: `validate + build + extract-tests` iteração rápida
5. **Integração CI**: GitHub Actions valida e constrói automaticamente, impedindo submissão de código incorreto

**Fluxo de Trabalho de Desenvolvimento**:

```
Modificar/Criar regras
    ↓
pnpm dev (validar + build + extrair testes)
    ↓
Verificar AGENTS.md e test-cases.json
    ↓
Submeter código → CI executa automaticamente
    ↓
Revisão PR → Merge para main
```

**Mnemônica de Melhores Práticas**:

> Modificar primeiro validar, build antes de submeter
> Comando dev fluxo completo, um passo eficiência alta
> CI controla automaticamente, revisão PR mais fácil
> Número de versão deve atualizar, metadata lembre de modificar

---

## Próxima Lição

> Na próxima lição vamos aprender **[Solução de Problemas Comuns](../../faq/troubleshooting/)**.
>
> Você aprenderá:
> - Resolver erros de rede de implantação (Network Egress Error)
> - Lidar com problema de habilidades não ativadas
> - Investigar falhas de validação de regras (VALIDATION_ERROR)
> - Corrigir problema de detecção de framework imprecisa
> - Resolver problemas de permissão de arquivo

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir para ver localização do código fonte</strong></summary>

> Data de Atualização: 2026-01-25

| Função                    | Caminho do Arquivo                                                                                                                                                             | Linha   |
|--- | --- | ---|
| Definição de scripts package.json | [`packages/react-best-practices-build/package.json`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/package.json)                 | 6-12    |
| Função de entrada do build        | [`packages/react-best-practices-build/src/build.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/build.ts)                 | 131-290 |
| Analisador de regras               | [`packages/react-best-practices-build/src/parser.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/parser.ts)               | Arquivo completo    |
| Função de validação de regras      | [`packages/react-best-practices-build/src/validate.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts)           | 21-66   |
| Extração de casos de teste         | [`packages/react-best-practices-build/src/extract-tests.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/extract-tests.ts) | 15-38   |
| Configuração de caminho            | [`packages/react-best-practices-build/src/config.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/config.ts)               | Arquivo completo    |
| GitHub Actions CI                  | [`.github/workflows/react-best-practices-ci.yml`](https://github.com/vercel-labs/agent-skills/blob/main/.github/workflows/react-best-practices-ci.yml)                       | Arquivo completo    |
| Modelo de arquivo de regras        | [`skills/react-best-practices/rules/_template.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/_template.md)                     | Arquivo completo    |

**Constantes Chave** (`config.ts`):
- `RULES_DIR`: Caminho do diretório de arquivos de regras
- `METADATA_FILE`: Caminho do arquivo de metadados (metadata.json)
- `OUTPUT_FILE`: Caminho de saída do AGENTS.md
- `TEST_CASES_FILE`: Caminho de saída JSON de casos de teste

**Funções Chave**:
- `build()`: Função principal de build, analisa regras → agrupa → ordena → gera documentação
- `validateRule()`: Valida integridade de uma única regra (title, explanation, examples, impact)
- `extractTestCases()`: Extrai casos de teste bad/good de examples das regras
- `generateMarkdown()`: Gera conteúdo AGENTS.md a partir de array de Section

**Regras de Validação** (`validate.ts:21-66`):
- title não está vazio
- explanation não está vazio
- Contém pelo menos um exemplo de código
- Contém pelo menos um exemplo "Incorrect/bad" ou "Correct/good"
- Nível de impact válido

**Fluxo de Trabalho CI**:
- Condição de acionamento: push/PR para main, e modificou `skills/react-best-practices/**` ou `packages/react-best-practices-build/**`
- Etapas de execução: checkout → instalar pnpm → instalar Node.js → pnpm install → pnpm validate → pnpm build

</details>
