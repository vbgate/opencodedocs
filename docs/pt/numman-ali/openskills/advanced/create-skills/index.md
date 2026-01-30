---
title: "Criar Habilidades: Escrevendo SKILL.md | openskills"
sidebarTitle: "Escrever uma Habilidade"
subtitle: "Criar Habilidades: Escrevendo SKILL.md"
description: "Aprenda a criar habilidades personalizadas do zero, dominando o formato SKILL.md e as especificações de YAML frontmatter. Através de exemplos completos e fluxo de desenvolvimento com symlinks, comece rapidamente a criar habilidades, garantindo conformidade com os padrões da Anthropic."
tags:
  - "advanced"
  - "skills"
  - "authoring"
  - "SKILL.md"
prerequisite:
  - "start-quick-start"
  - "start-first-skill"
order: 4
---

# Criar Habilidades Personalizadas

## O Que Você Vai Aprender

- Criar um arquivo de habilidade SKILL.md completo do zero
- Escrever YAML frontmatter em conformidade com os padrões da Anthropic
- Projetar uma estrutura de diretórios de habilidades adequada (references/, scripts/, assets/)
- Usar symlinks para desenvolvimento local e iteração
- Instalar e validar habilidades personalizadas usando o comando `openskills`

## Seu Problema Atual

Você quer que agentes de AI o ajudem a resolver problemas específicos, mas não há uma solução adequada na biblioteca de habilidades existente. Você tentou descrever as necessidades repetidamente em conversas, mas o AI sempre esquece ou executa de forma incompleta. Você precisa de uma forma de **encapsular conhecimento especializado** para que os agentes de AI possam reutilizar de forma estável e confiável.

## Quando Usar Esta Abordagem

- **Encapsular fluxos de trabalho**: Escreva passos operacionais repetitivos como habilidades para que o AI execute corretamente de uma vez
- **Acúmulo de conhecimento da equipe**: Empacote padrões internos da equipe, documentação de API e scripts como habilidades para compartilhar com todos os membros
- **Integração de ferramentas**: Crie habilidades especializadas para ferramentas específicas (como processamento de PDF, limpeza de dados, fluxos de implantação)
- **Desenvolvimento local**: Modifique e teste habilidades em tempo real durante o desenvolvimento, sem precisar instalar repetidamente

## 🎒 Preparação Antes de Começar

::: warning Verificação Prévia

Antes de começar, certifique-se de que:

- ✅ [OpenSkills](/start/installation/) instalado
- ✅ Instalou e sincronizou pelo menos uma habilidade (entenda o fluxo básico)
- ✅ Familiarizado com a sintaxe básica de Markdown

:::

## Ideia Central

### O que é SKILL.md?

**SKILL.md** é o formato padrão do sistema de habilidades da Anthropic, usando YAML frontmatter para descrever metadados da habilidade e Markdown正文 para fornecer instruções de execução. Possui três vantagens principais:

1. **Formato unificado** - Todos os agentes (Claude Code, Cursor, Windsurf, etc.) usam a mesma descrição de habilidade
2. **Carregamento progressivo** - Carrega o conteúdo completo apenas quando necessário, mantendo o contexto do AI conciso
3. **Recursos empacotáveis** - Suporta três tipos de recursos adicionais: references/, scripts/, assets/

### Estrutura Mínima vs Completa

**Estrutura mínima** (adequada para habilidades simples):
```
my-skill/
└── SKILL.md          # Apenas um arquivo
```

**Estrutura completa** (adequada para habilidades complexas):
```
my-skill/
├── SKILL.md          # Instruções principais (< 5000 palavras)
├── references/       # Documentação detalhada (carregada sob demanda)
│   └── api-docs.md
├── scripts/          # Scripts executáveis
│   └── helper.py
└── assets/           # Modelos e arquivos de saída
    └── template.json
```

::: info Quando usar a estrutura completa?

- **references/**: Quando documentação de API, schema de banco de dados ou guias detalhados excederem 5000 palavras
- **scripts/**: Quando for necessário executar tarefas determinísticas e repetíveis (como conversão de dados, formatação)
- **assets/**: Quando for necessário gerar modelos, imagens ou código boilerplate

:::

## Siga Comigo

### Passo 1: Criar diretório da habilidade

**Por que**: Criar um diretório independente para organizar arquivos da habilidade

```bash
mkdir my-skill
cd my-skill
```

**O que você deve ver**: O diretório atual está vazio

---

### Passo 2: Escrever estrutura principal do SKILL.md

**Por que**: SKILL.md deve começar com YAML frontmatter para definir metadados da habilidade

Crie o arquivo `SKILL.md`:

```markdown
---
name: my-skill                    # Obrigatório: identificador em formato de hifenização
description: When to use this skill.  # Obrigatório: 1-2 frases, terceira pessoa
---

# Título da Habilidade

Descrição detalhada da habilidade.
```

**Ponto de verificação**:

- ✅ A primeira linha é `---`
- ✅ Contém campo `name` (formato de hifenização, como `pdf-editor`, `api-client`)
- ✅ Contém campo `description` (1-2 frases, usando terceira pessoa)
- ✅ Após terminar o YAML, use `---` novamente

::: danger Erros Comuns

| Exemplo de Erro | Correção |
|--- | ---|
| `name: My Skill` (espaços) | Mude para `name: my-skill` (hífens) |
| `description: You should use this for...` (segunda pessoa) | Mude para `description: Use this skill for...` (terceira pessoa) |
|--- | ---|
| `description` muito longa (mais de 100 palavras) | Simplifique para um resumo de 1-2 frases |

:::

---

### Passo 3: Escrever conteúdo das instruções

**Por que**: As instruções dizem ao agente de AI como executar a tarefa, devem usar forma imperativa/infinitiva

Continue editando `SKILL.md`:

```markdown
---
name: my-skill
description: Use this skill to demonstrate how to write proper instructions.
---

# My Skill

## When to Use

Load this skill when:
- Demonstrating instruction writing patterns
- Understanding imperative/infinitive form
- Learning SKILL.md format

## Instructions

To execute this skill:

1. Read the user's input
2. Process the data
3. Return the result

For detailed information, see references/guide.md
```

**Regras de escrita**:

| ✅ Escrita Correta (imperativo/infinitivo) | ❌ Escrita Incorreta (segunda pessoa) |
|--- | ---|
| "To accomplish X, execute Y"        | "You should do X"          |
| "Load this skill when Z"            | "If you need Y"            |
| "See references/guide.md"           | "When you want Z"           |

::: tip Dica

**Três princípios da escrita de instruções**:
1. **Começar com verbo**: "Create" → "Use" → "Return"
2. **Omitir "You"**: Não dizer "You should"
3. **Caminho claro**: Recursos referenciados começam com `references/`

:::

---

### Passo 4: Adicionar Bundled Resources (opcional)

**Por que**: Quando a habilidade precisa de muita documentação detalhada ou scripts executáveis, use bundled resources para manter o SKILL.md conciso

#### 4.1 Adicionar references/

```bash
mkdir references
```

Crie `references/api-docs.md`:

```markdown
# API Documentation

## Overview

This section provides detailed API information...

## Endpoints

### GET /api/data

Returns processed data.

Response:
```json
{
  "status": "success",
  "data": [...]
}
```
```

Em `SKILL.md`, referencie:

```markdown
## Instructions

To fetch data:

1. Call the API endpoint
2. See `references/api-docs.md` for detailed response format
3. Process the result
```

#### 4.2 Adicionar scripts/

```bash
mkdir scripts
```

Crie `scripts/process.py`:

```python
#!/usr/bin/env python3
import sys

def main():
    # Processing logic
    print("Processing complete")

if __name__ == "__main__":
    main()
```

Em `SKILL.md`, referencie:

```markdown
## Instructions

To process data:

1. Execute the script:
   ```bash
   python scripts/process.py
   ```
2. Review the output
```

::: info Vantagens de scripts/

- **Não carregado no contexto**: Economiza tokens, adequado para arquivos grandes
- **Independente para execução**: O agente de AI pode chamar diretamente sem carregar conteúdo primeiro
- **Adequado para tarefas determinísticas**: Conversão de dados, formatação, geração, etc.

:::

#### 4.3 Adicionar assets/

```bash
mkdir assets
```

Adicione arquivo de modelo `assets/template.json`:

```json
{
  "title": "{{ title }}",
  "content": "{{ content }}"
}
```

Em `SKILL.md`, referencie:

```markdown
## Instructions

To generate output:

1. Load the template: `assets/template.json`
2. Replace placeholders with actual data
3. Write to output file
```

---

### Passo 5: Validar formato SKILL.md

**Por que**: Validar o formato antes de instalar para evitar erros durante a instalação

```bash
npx openskills install ./my-skill
```

**O que você deve ver**:

```
✔ Found skill: my-skill
  Description: Use this skill to demonstrate how to write proper instructions.
  Size: 1.2 KB

? Select skills to install: (Use arrow keys)
❯ ☑ my-skill
```

Selecione a habilidade e pressione Enter, você deve ver:

```
✔ Installing my-skill...
✔ Skill installed successfully to .claude/skills/my-skill

Next steps:
  Run: npx openskills sync
  Then: Ask your AI agent to use the skill
```

::: tip Lista de Verificação

Antes de instalar, verifique os seguintes itens:

- [ ] SKILL.md começa com `---`
- [ ] Contém campos `name` e `description`
- [ ] `name` usa formato de hifenização (`my-skill` não `my_skill`)
- [ ] `description` é um resumo de 1-2 frases
- [ ] Instruções usam forma imperativa/infinitiva
- [ ] Todos os caminhos de referência para `references/`, `scripts/`, `assets/` estão corretos

:::

---

### Passo 6: Sincronizar com AGENTS.md

**Por que**: Fazer o agente de AI saber que esta habilidade está disponível

```bash
npx openskills sync
```

**O que você deve ver**:

```
✔ Found 1 skill:
  ☑ my-skill

✔ Syncing to AGENTS.md...
✔ Updated AGENTS.md successfully
```

Verifique o `AGENTS.md` gerado:

```markdown
<!-- SKILLS_SYSTEM_START -->
...
<available_skills>
  <skill name="my-skill">Use this skill to demonstrate how to write proper instructions.</skill>
</available_skills>
...
<!-- SKILLS_SYSTEM_END -->
```

---

### Passo 7: Testar carregamento da habilidade

**Por que**: Verificar se a habilidade pode ser carregada corretamente no contexto do AI

```bash
npx openskills read my-skill
```

**O que você deve ver**:

```
Loading skill: my-skill
Base directory: /path/to/project/.claude/skills/my-skill

---
name: my-skill
description: Use this skill to demonstrate how to write proper instructions.
---

# My Skill
... (conteúdo completo do SKILL.md)
```

## Ponto de Verificação ✅

Após completar as etapas acima, você deve:

- ✅ Criou um diretório de habilidade contendo SKILL.md
- ✅ SKILL.md contém YAML frontmatter e conteúdo Markdown corretos
- ✅ A habilidade foi instalada com sucesso em `.claude/skills/`
- ✅ A habilidade foi sincronizada com AGENTS.md
- ✅ Usar `openskills read` pode carregar o conteúdo da habilidade

## Armadilhas Comuns

### Problema 1: Erro "Invalid SKILL.md (missing YAML frontmatter)" durante a instalação

**Causa**: SKILL.md não começa com `---`

**Solução**: Verifique se a primeira linha do arquivo é `---`, não `# My Skill` ou outro conteúdo

---

### Problema 2: O agente de AI não consegue reconhecer a habilidade

**Causa**: Não executou `openskills sync` ou AGENTS.md não foi atualizado

**Solução**: Execute `npx openskills sync` e verifique se AGENTS.md contém a entrada da habilidade

---

### Problema 3: Erro de análise de caminho de recursos

**Causa**: Usou caminhos absolutos ou caminhos relativos incorretos no SKILL.md

**Solução**:
- ✅ Correto: `references/api-docs.md` (caminho relativo)
- ❌ Incorreto: `/path/to/skill/references/api-docs.md` (caminho absoluto)
- ❌ Incorreto: `../other-skill/references/api-docs.md` (referência entre habilidades)

---

### Problema 4: SKILL.md muito longo levando ao limite de tokens

**Causa**: SKILL.md excede 5000 palavras ou contém grande quantidade de documentação detalhada

**Solução**: Mova o conteúdo detalhado para o diretório `references/`, referenciando no SKILL.md

## Resumo da Lição

Etapas principais para criar habilidades personalizadas:

1. **Criar estrutura de diretório**: Estrutura mínima (apenas SKILL.md) ou estrutura completa (incluindo references/, scripts/, assets/)
2. **Escrever YAML frontmatter**: Campos obrigatórios `name` (formato de hifenização) e `description` (1-2 frases)
3. **Escrever conteúdo das instruções**: Use forma imperativa/infinitiva, evite segunda pessoa
4. **Adicionar recursos** (opcional): references/, scripts/, assets/
5. **Validar formato**: Use `openskills install ./my-skill` para validar
6. **Sincronizar com AGENTS.md**: Execute `openskills sync` para informar o agente de AI
7. **Testar carregamento**: Use `openskills read my-skill` para validar o carregamento

## Próxima Lição

> Na próxima lição, aprenderemos **[Estrutura de Habilidades Detalhada](../skill-structure/)**.
>
> Você aprenderá:
> - Descrição completa dos campos do SKILL.md
> - Melhores práticas para references/, scripts/, assets/
> - Como otimizar a legibilidade e manutenibilidade das habilidades

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Atualizado em: 2026-01-24

| Funcionalidade           | Caminho do Arquivo                                                                 | Linha    |
|--- | --- | ---|
| Validação de YAML frontmatter | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 12-14   |
| Extração de campo YAML  | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 4-7     |
| Validação de formato durante instalação  | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 242, 291, 340 |
| Extração de nome da habilidade    | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 344-345 |

**Arquivos de habilidade de exemplo**:
- [`examples/my-first-skill/SKILL.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/SKILL.md) - Exemplo de estrutura mínima
- [`examples/my-first-skill/references/skill-format.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/references/skill-format.md) - Referência de especificação de formato

**Funções principais**:
- `hasValidFrontmatter(content: string): boolean` - Valida se SKILL.md começa com `---`
- `extractYamlField(content: string, field: string): string` - Extrai valor de campo YAML (correspondência não-greedy)

</details>
