---
title: "Melhores Práticas: Desenvolvimento de Skills | opencode-agent-skills"
sidebarTitle: "Escreva Skills de Alta Qualidade"
subtitle: "Melhores Práticas: Desenvolvimento de Skills"
description: "Domine as convenções de desenvolvimento de skills para OpenCode Agent Skills. Aprenda as melhores práticas para nomenclatura, descrições, organização de diretórios, scripts e frontmatter para melhorar a qualidade das skills e a eficiência de uso da IA."
tags:
  - "Melhores Práticas"
  - "Desenvolvimento de Skills"
  - "Convenções"
  - "Anthropic Skills"
prerequisite:
  - "creating-your-first-skill"
order: 1
---

# Melhores Práticas para Desenvolvimento de Skills

## O que Você Vai Aprender

Ao concluir este tutorial, você será capaz de:
- Escrever nomes de skills que sigam as convenções de nomenclatura
- Escrever descrições facilmente reconhecidas por recomendações automáticas
- Organizar uma estrutura de diretórios clara para skills
- Usar scripts de forma adequada
- Evitar erros comuns de frontmatter
- Melhorar a taxa de descoberta e usabilidade das skills

## Por Que Precisamos de Melhores Práticas

O plugin OpenCode Agent Skills não apenas armazena skills, mas também:
- **Descoberta Automática**: Escaneia diretórios de skills de várias localizações
- **Correspondência Semântica**: Recomenda skills com base na similaridade entre a descrição da skill e a mensagem do usuário
- **Gerenciamento de Namespaces**: Suporta a coexistência de skills de múltiplas fontes
- **Execução de Scripts**: Escaneia e executa scripts executáveis automaticamente

Seguir as melhores práticas permite que suas skills:
- ✅ Sejam reconhecidas e carregadas corretamente pelo plugin
- ✅ Obtenham prioridade mais alta em correspondências semânticas
- ✅ Evitem conflitos com outras skills
- ✅ Sejam mais fáceis de entender e usar pelos membros da equipe

---

## Convenções de Nomenclatura

### Regras para Nomes de Skills

Os nomes de skills devem seguir as seguintes convenções:

::: tip Regras de Nomenclatura
- ✅ Use letras minúsculas, números e hífens
- ✅ Comece com uma letra
- ✅ Use hífens para separar palavras
- ❌ Não use letras maiúsculas ou sublinhados
- ❌ Não use espaços ou caracteres especiais
:::

**Exemplos**:

| ✅ Exemplos Corretos | ❌ Exemplos Incorretos | Motivo |
| --- | --- | --- |
| `git-helper` | `GitHelper` | Contém letras maiúsculas |
| `docker-build` | `docker_build` | Usa sublinhado |
| `code-review` | `code review` | Contém espaço |
| `test-utils` | `1-test` | Começa com número |

**Baseado no código fonte**: `src/skills.ts:106-108`

```typescript
name: z.string()
  .regex(/^[\p{Ll}\p{N}-]+$/u, { message: "Name must be lowercase alphanumeric with hyphens" })
  .min(1, { message: "Name cannot be empty" }),
```

### Relação entre Nome do Diretório e Frontmatter

O nome do diretório da skill e o campo `name` no frontmatter podem ser diferentes:

```yaml
---
# O diretório é my-git-tools, mas o name no frontmatter é git-helper
name: git-helper
description: Assistente de operações Git comuns
---
```

**Práticas recomendadas**:
- Mantenha o nome do diretório e o campo `name` consistentes para facilitar a manutenção
- Use um identificador curto e fácil de lembrar para o nome do diretório
- O campo `name` pode ser mais específico para descrever a finalidade da skill

**Baseado no código fonte**: `src/skills.ts:155-158`

---

## Técnicas para Escrever Descrições

### Função da Descrição

A descrição da skill não é apenas uma explicação para os usuários, mas também é usada para:

1. **Correspondência Semântica**: O plugin calcula a similaridade entre a descrição e a mensagem do usuário
2. **Recomendação de Skills**: Recomenda skills relevantes automaticamente com base na similaridade
3. **Correspondência Fuzzy**: Usada para recomendar skills semelhantes quando o nome da skill está digitado incorretamente

### Descrições Boas vs. Ruins

| ✅ Boa Descrição | ❌ Má Descrição | Motivo |
| --- | --- | --- |
| "Automatiza o gerenciamento de branches Git e o fluxo de commit, suporta geração automática de mensagens de commit" | "Ferramenta Git" | Muito vaga, falta funcionalidades específicas |
| "Gera código de cliente API com segurança de tipos para projetos Node.js" | "Uma ferramenta útil" | Não especifica o cenário de uso |
| "Traduz PDFs para chinês preservando o layout original" | "Ferramenta de tradução" | Não explica habilidades especiais |

### Princípios para Escrever Descrições

::: tip Princípios para Escrever Descrições
1. **Seja Específico**: Explique a finalidade específica e o cenário de aplicação da skill
2. **Inclua Palavras-chave**: Inclua palavras-chave que os usuários podem procurar (como "Git", "Docker", "Tradução")
3. **Destaque o Valor Único**: Explique as vantagens desta skill em comparação com outras similares
4. **Evite Redundância**: Não repita o nome da skill
:::

**Exemplo**:

```markdown
---
name: pdf-translator
description: Traduz documentos PDF de inglês para chinês, preservando o formato original, posição das imagens e estrutura das tabelas. Suporta tradução em lote e glossários personalizados.
---
```

Esta descrição contém:
- ✅ Funcionalidade específica (traduzir PDF, preservar formato)
- ✅ Cenário de aplicação (documentos em inglês)
- ✅ Valor único (preservar formato, lote, glossário)

**Baseado no código fonte**: `src/skills.ts:109`

```typescript
description: z.string()
  .min(1, { message: "Description cannot be empty" }),
```

---

## Organização de Diretórios

### Estrutura Básica

Um diretório de skill padrão contém:

```
my-skill/
├── SKILL.md              # Arquivo principal da skill (obrigatório)
├── README.md             # Documentação detalhada (opcional)
├── tools/                # Scripts executáveis (opcional)
│   ├── setup.sh
│   └── run.sh
└── docs/                 # Documentos de suporte (opcional)
    ├── guide.md
    └── examples.md
```

### Diretórios Ignorados

O plugin ignora automaticamente os seguintes diretórios (não escaneia scripts):

::: warning Diretórios Ignorados Automaticamente
- `node_modules` - Dependências Node.js
- `__pycache__` - Cache de bytecode Python
- `.git` - Controle de versão Git
- `.venv`, `venv` - Ambientes virtuais Python
- `.tox`, `.nox` - Ambientes de teste Python
- Qualquer diretório oculto começando com `.`
:::

**Baseado no código fonte**: `src/skills.ts:61`

```typescript
const skipDirs = new Set(['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']);
```

### Nomenclatura Recomendada para Diretórios

| Finalidade | Nome de Diretório Recomendado | Descrição |
| --- | --- | --- |
| Arquivos de script | `tools/` ou `scripts/` | Armazena scripts executáveis |
| Documentação | `docs/` ou `examples/` | Armazena documentação auxiliar |
| Configuração | `config/` | Armazena arquivos de configuração |
| Templates | `templates/` | Armazena arquivos de template |

---

## Uso de Scripts

### Regras de Descoberta de Scripts

O plugin escaneia automaticamente arquivos executáveis no diretório da skill:

::: tip Regras de Descoberta de Scripts
- ✅ O script deve ter permissão de execução (`chmod +x script.sh`)
- ✅ Profundidade máxima de recursão é 10 níveis
- ✅ Ignora diretórios ocultos e de dependência
- ❌ Arquivos não executáveis não serão reconhecidos como scripts
:::

**Baseado no código fonte**: `src/skills.ts:86`

```typescript
if (stats.mode & 0o111) {
  scripts.push({
    relativePath: newRelPath,
    absolutePath: fullPath
  });
}
```

### Configurando Permissões de Script

**Scripts Bash**:
```bash
chmod +x tools/setup.sh
chmod +x tools/run.sh
```

**Scripts Python**:
```bash
chmod +x tools/scan.py
```

E adicione o shebang no início do arquivo:
```python
#!/usr/bin/env python3
import sys
# ...
```

### Exemplo de Chamada de Script

Quando uma skill é carregada, a IA verá a lista de scripts disponíveis:

```
Scripts disponíveis:
- tools/setup.sh: Inicializa ambiente de desenvolvimento
- tools/build.sh: Constrói o projeto
- tools/deploy.sh: Faz deploy para produção
```

A IA pode chamar esses scripts usando a ferramenta `run_skill_script`:

```javascript
run_skill_script({
  skill: "project-builder",
  script: "tools/build.sh",
  arguments: ["--release", "--verbose"]
})
```

---

## Melhores Práticas para Frontmatter

### Campos Obrigatórios

**name**: Identificador único da skill
- Letras minúsculas, números e hífens
- Curto mas descritivo
- Evite nomes genéricos (como `helper`, `tool`)

**description**: Descrição da skill
- Explique especificamente o que faz
- Inclua cenários de aplicação
- Tamanho moderado (1-2 frases)

### Campos Opcionais

**license**: Informação de licença
```yaml
license: MIT
```

**allowed-tools**: Restringe quais ferramentas a skill pode usar
```yaml
allowed-tools:
  - read
  - write
  - bash
```

**metadata**: Metadados personalizados
```yaml
metadata:
  author: "Your Name"
  version: "1.0.0"
  category: "development"
```

**Baseado no código fonte**: `src/skills.ts:105-114`

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

### Exemplo Completo

```markdown
---
name: docker-deploy
description: Automatiza a construção e deploy de imagens Docker, suporta configuração de múltiplos ambientes, health checks e rollback
license: MIT
allowed-tools:
  - read
  - write
  - bash
metadata:
  version: "2.1.0"
  author: "DevOps Team"
  category: "deployment"
---

# Deploy Automático com Docker

Esta skill ajuda você a automatizar o processo de build, push e deploy de imagens Docker.

## Como Usar

...
```

---

## Evitando Erros Comuns

### Erro 1: Nome Não Conforme com as Regras

**Exemplo Incorreto**:
```yaml
name: MyAwesomeSkill  # ❌ Letras maiúsculas
```

**Correção**:
```yaml
name: my-awesome-skill  # ✅ Letras minúsculas + hífen
```

### Erro 2: Descrição Muito Vaga

**Exemplo Incorreto**:
```yaml
description: "Uma ferramenta útil"  # ❌ Muito vaga
```

**Correção**:
```yaml
description: "Automatiza o fluxo de commits Git, gerando automaticamente mensagens de commit em conformidade com as convenções"  # ✅ Específica e clara
```

### Erro 3: Script Sem Permissão de Execução

**Problema**: O script não é reconhecido como um script executável

**Solução**:
```bash
chmod +x tools/setup.sh
```

**Verificação**:
```bash
ls -l tools/setup.sh
# Deve mostrar: -rwxr-xr-x (tem permissão x)
```

### Erro 4: Conflito de Nomes de Diretórios

**Problema**: Múltiplas skills usando o mesmo nome

**Soluções**:
- Use namespaces (através da configuração do plugin ou estrutura de diretórios)
- Ou use nomes mais descritivos

**Baseado no código fonte**: `src/skills.ts:258-259`

```typescript
// Apenas a primeira skill com o mesmo nome é mantida, as subsequentes são ignoradas
if (skillsByName.has(skill.name)) {
  continue;
}
```

---

## Melhorando a Taxa de Descoberta

### 1. Otimize as Palavras-chave na Descrição

Inclua palavras-chave na descrição que os usuários podem procurar:

```yaml
---
name: code-reviewer
description: Ferramenta automatizada de revisão de código, verifica a qualidade do código, bugs potenciais, vulnerabilidades de segurança e problemas de performance. Suporta várias linguagens como JavaScript, TypeScript, Python.
---
```

Palavras-chave: revisão de código, qualidade do código, bug, vulnerabilidade de segurança, problema de performance, JavaScript, TypeScript, Python

### 2. Use Localizações de Skills Padronizadas

O plugin descobre skills na seguinte ordem de prioridade:

1. `.opencode/skills/` - Nível de projeto (maior prioridade)
2. `.claude/skills/` - Nível de projeto Claude
3. `~/.config/opencode/skills/` - Nível de usuário
4. `~/.claude/skills/` - Nível de usuário Claude

**Práticas Recomendadas**:
- Skills específicas de projeto → Coloque no nível de projeto
- Skills genéricas → Coloque no nível de usuário

### 3. Forneça Documentação Detalhada

Além do SKILL.md, você também pode fornecer:
- `README.md` - Explicações detalhadas e exemplos de uso
- `docs/guide.md` - Guia completo de uso
- `docs/examples.md` - Exemplos práticos

---

## Resumo da Lição

Este tutorial apresentou as melhores práticas para desenvolvimento de skills:

- **Convenções de Nomenclatura**: Use letras minúsculas, números e hífens
- **Escrita de Descrições**: Seja específico, inclua palavras-chave, destaque o valor único
- **Organização de Diretórios**: Estrutura clara, ignore diretórios desnecessários
- **Uso de Scripts**: Configure permissões de execução, atenção aos limites de profundidade
- **Convenções de Frontmatter**: Preencha corretamente os campos obrigatórios e opcionais
- **Evitar Erros**: Problemas comuns e soluções

Seguir estas melhores práticas permite que suas skills:
- ✅ Sejam reconhecidas e carregadas corretamente pelo plugin
- ✅ Obtenham prioridade mais alta em correspondências semânticas
- ✅ Evitem conflitos com outras skills
- ✅ Sejam mais fáceis de entender e usar pelos membros da equipe

## Próxima Lição

> Na próxima lição aprenderemos sobre a **[Referência da API de Ferramentas](../api-reference/)**.
>
> Você verá:
> - Descrições detalhadas de parâmetros de todas as ferramentas disponíveis
> - Exemplos de chamadas de ferramentas e formatos de retorno
> - Usos avançados e precauções

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-24

| Função | Caminho do Arquivo | Linhas |
| --- | --- | ---|
| Validação de nome de skill | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L106-L108) | 106-108 |
| Validação de descrição de skill | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L109-L110) | 109-110 |
| Definição do Schema de Frontmatter | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L105-L114) | 105-114 |
| Lista de diretórios ignorados | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L61) | 61 |
| Verificação de permissão executável de scripts | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L86) | 86 |
| Lógica de deduplicação de skills com mesmo nome | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L258-L259) | 258-259 |

**Constantes Importantes**:
- Diretórios ignorados: `['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']`

**Funções Importantes**:
- `findScripts(skillPath: string, maxDepth: number = 10)`: Busca recursivamente scripts executáveis no diretório da skill
- `parseSkillFile(skillPath: string)`: Analisa SKILL.md e valida o frontmatter

</details>
