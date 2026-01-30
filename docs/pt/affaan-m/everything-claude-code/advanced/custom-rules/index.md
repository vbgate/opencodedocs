---
title: "Rules Personalizadas: Construindo Padrões de Projeto | Everything Claude Code"
subtitle: "Rules Personalizadas: Construindo Padrões de Projeto"
sidebarTitle: "Ensinando o Claude a Obedecer"
description: "Aprenda a criar arquivos de Rules personalizadas. Domine o formato de regras, checklists, regras de segurança e integração com fluxo Git para que o Claude siga automaticamente os padrões da equipe."
tags:
  - "custom-rules"
  - "project-standards"
  - "code-quality"
prerequisite:
  - "start-quick-start"
order: 130
---

# Rules Personalizadas: Construindo Padrões Específicos do Projeto

## O Que Você Vai Aprender

- Criar arquivos de Rules personalizadas para definir padrões de codificação específicos do projeto
- Usar listas de verificação para garantir consistência na qualidade do código
- Integrar padrões da equipe ao fluxo de trabalho do Claude Code
- Personalizar diferentes tipos de regras conforme as necessidades do projeto

## Seu Desafio Atual

Você já enfrentou esses problemas?

- Estilos de código inconsistentes entre membros da equipe, apontando os mesmos problemas repetidamente durante code reviews
- O projeto tem requisitos de segurança específicos que o Claude desconhece
- Verificar manualmente se o código segue os padrões da equipe toda vez que escreve
- Querer que o Claude lembre automaticamente das melhores práticas específicas do projeto

## Quando Usar Esta Técnica

- **Ao inicializar um novo projeto** - Definir padrões de codificação e segurança específicos do projeto
- **Durante colaboração em equipe** - Unificar estilo de código e padrões de qualidade
- **Após encontrar problemas frequentes em code reviews** - Consolidar problemas comuns em regras
- **Quando o projeto tem necessidades especiais** - Integrar padrões da indústria ou regras específicas da stack tecnológica

## Conceito Central

Rules são a camada de aplicação dos padrões do projeto, fazendo o Claude seguir automaticamente os padrões que você define.

### Como as Rules Funcionam

Os arquivos de Rules ficam no diretório `rules/`, e o Claude Code carrega automaticamente todas as regras no início da sessão. Cada vez que gera código ou faz uma revisão, o Claude verifica de acordo com essas regras.

::: info Diferença entre Rules e Skills

- **Rules**: Listas de verificação obrigatórias, aplicáveis a todas as operações (como verificações de segurança, estilo de código)
- **Skills**: Definições de fluxo de trabalho e conhecimento de domínio, aplicáveis a tarefas específicas (como processo TDD, design de arquitetura)

Rules são restrições "obrigatórias", Skills são guias de "como fazer".
:::

### Estrutura de Arquivos de Rules

Cada arquivo de Rule segue um formato padrão:

```markdown
# Título da Regra

## Categoria da Regra
Texto explicativo da regra...

### Lista de Verificação
- [ ] Item de verificação 1
- [ ] Item de verificação 2

### Exemplo de Código
Comparação de código correto/incorreto...
```

## Siga Comigo

### Passo 1: Conheça os Tipos de Rules Integradas

Everything Claude Code fornece 8 conjuntos de regras integradas. Primeiro, entenda suas funcionalidades.

**Por quê**

Conhecer as regras integradas ajuda a determinar o que precisa ser personalizado, evitando reinventar a roda.

**Visualizar Rules Integradas**

Verifique no diretório `rules/` do código-fonte:

```bash
ls rules/
```

Você verá os seguintes 8 arquivos de regras:

| Arquivo de Regra | Propósito | Cenário de Uso |
| --- | --- | --- |
| `security.md` | Verificações de segurança | Envolvendo chaves de API, entrada de usuário, operações de banco de dados |
| `coding-style.md` | Estilo de código | Tamanho de funções, organização de arquivos, padrões de imutabilidade |
| `testing.md` | Requisitos de teste | Cobertura de testes, processo TDD, tipos de teste |
| `performance.md` | Otimização de performance | Seleção de modelo, gerenciamento de contexto, estratégias de compressão |
| `agents.md` | Uso de Agents | Quando usar qual agent, execução paralela |
| `git-workflow.md` | Fluxo Git | Formato de commits, processo de PR, gerenciamento de branches |
| `patterns.md` | Padrões de design | Padrão Repository, formato de resposta de API, projetos skeleton |
| `hooks.md` | Sistema de Hooks | Tipos de hooks, permissões de auto-aceite, TodoWrite |

**O que você deve ver**:
- Cada arquivo de regra tem título e categorização claros
- Regras incluem listas de verificação e exemplos de código
- Regras são aplicáveis a cenários específicos e necessidades técnicas

### Passo 2: Criar Arquivo de Regra Personalizada

Crie um novo arquivo de regra no diretório `rules/` do projeto.

**Por quê**

Regras personalizadas podem resolver problemas específicos do projeto, fazendo o Claude seguir os padrões da equipe.

**Criar Arquivo de Regra**

Supondo que seu projeto use Next.js e Tailwind CSS, você precisa definir padrões de componentes frontend:

```bash
# Criar arquivo de regra
touch rules/frontend-conventions.md
```

**Editar Arquivo de Regra**

Abra `rules/frontend-conventions.md` e adicione o seguinte conteúdo:

```markdown
# Frontend Conventions

## Component Design
ALL components must follow these conventions:

### Component Structure
- Export default function component
- Use TypeScript interfaces for props
- Keep components focused (<300 lines)
- Use Tailwind utility classes, not custom CSS

### Naming Conventions
- Component files: PascalCase (UserProfile.tsx)
- Component names: PascalCase
- Props interface: `<ComponentName>Props`
- Utility functions: camelCase

### Code Example

\`\`\`typescript
// CORRECT: Following conventions
interface UserProfileProps {
  name: string
  email: string
  avatar?: string
}

export default function UserProfile({ name, email, avatar }: UserProfileProps) {
  return (
    <div className="flex items-center gap-4 p-4">
      {avatar && <img src={avatar} alt={name} className="w-12 h-12 rounded-full" />}
      <div>
        <h3 className="font-semibold">{name}</h3>
        <p className="text-gray-600">{email}</p>
      </div>
    </div>
  )
}
\`\`\`

\`\`\`typescript
// WRONG: Violating conventions
export const UserProfile = (props: any) => {
  return <div>...</div>  // Missing TypeScript, wrong export
}
\`\`\`

### Checklist
Before marking frontend work complete:
- [ ] Components follow PascalCase naming
- [ ] Props interfaces properly typed with TypeScript
- [ ] Components <300 lines
- [ ] Tailwind utility classes used (no custom CSS)
- [ ] Default export used
- [ ] Component file name matches component name
```

**O que você deve ver**:
- Arquivo de regra usa formato Markdown padrão
- Título e categorização claros (##)
- Comparação de exemplos de código (CORRECT vs WRONG)
- Lista de verificação (checkbox)
- Descrição de regra concisa e clara

### Passo 3: Definir Regras Personalizadas de Segurança

Se seu projeto tem requisitos de segurança especiais, crie regras de segurança dedicadas.

**Por quê**

O `security.md` integrado contém verificações de segurança genéricas, mas o projeto pode ter necessidades de segurança específicas.

**Criar Regras de Segurança do Projeto**

Crie `rules/project-security.md`:

```markdown
# Project Security Requirements

## API Authentication
ALL API calls must include authentication:

### JWT Token Management
- Store JWT in httpOnly cookies (not localStorage)
- Validate token expiration on each request
- Refresh tokens automatically before expiration
- Include CSRF protection headers

// CORRECT: JWT in httpOnly cookie
const response = await fetch('/api/users', {
  credentials: 'include',
  headers: {
    'X-CSRF-Token': getCsrfToken()
  }
})

// WRONG: JWT in localStorage (vulnerable to XSS)
const token = localStorage.getItem('jwt')
const response = await fetch('/api/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

## Data Validation
ALL user inputs must be validated server-side:

import { z } from 'zod'
const CreateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  age: z.number().int().min(18, 'Must be 18 or older')
})
const validatedData = CreateUserSchema.parse(req.body)

## Checklist
Before marking security work complete:
- [ ] API calls use httpOnly cookies for JWT
- [ ] CSRF protection enabled
- [ ] All user inputs validated server-side
- [ ] Sensitive data never logged
- [ ] Rate limiting configured on all endpoints
- [ ] Error messages don't leak sensitive information
```

**O que você deve ver**:
- Regras direcionadas à stack tecnológica específica do projeto (JWT, Zod)
- Exemplos de código mostram implementações corretas e incorretas
- Lista de verificação cobre todos os itens de verificação de segurança

### Passo 4: Definir Regras de Fluxo Git Específicas do Projeto

Se a equipe tem convenções especiais de commits Git, você pode estender `git-workflow.md` ou criar regras personalizadas.

**Por quê**

O `git-workflow.md` integrado contém formato básico de commits, mas a equipe pode ter requisitos adicionais.

**Criar Regras Git**

Crie `rules/team-git-workflow.md`:

```markdown
# Team Git Workflow

## Commit Message Format
Follow Conventional Commits with team-specific conventions:

### Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring (no behavior change)
- `perf`: Performance improvement
- `docs`: Documentation changes
- `test`: Test updates
- `chore`: Maintenance tasks
- `team` (custom): Team-specific changes (onboarding, meetings)

### Commit Scope (REQUIRED)
Must include scope in brackets after type:

Format: 

Examples:
- feat(auth): add OAuth2 login
- fix(api): handle 404 errors
- docs(readme): update installation guide
- team(onboarding): add Claude Code setup guide

### Commit Body (Required for breaking changes)

feat(api): add rate limiting

BREAKING CHANGE: API now requires authentication for all endpoints

- Rate limit: 100 requests per minute per IP
- Retry-After header included in 429 responses

## Pull Request Requirements

### PR Checklist
Before requesting review:
- [ ] Title follows conventional commits format
- [ ] Description includes test plan
- [ ] All tests passing
- [ ] Code coverage maintained or improved
- [ ] Breaking changes documented
- [ ] Related issues linked

### PR Review Checklist
Before approving:
- [ ] Code follows project coding standards
- [ ] Security checks passed
- [ ] Test coverage >= 80%
- [ ] No TODOs or FIXMEs in production code
- [ ] Documentation updated
```


Examples:
feat(auth): add OAuth2 login
fix(api): handle 404 errors
docs(readme): update installation guide
team(onboarding): add Claude Code setup guide
```

### Commit Body (Required for breaking changes)

```
feat(api): add rate limiting

BREAKING CHANGE: API now requires authentication for all endpoints

- Rate limit: 100 requests per minute per IP
- Retry-After header included in 429 responses
```

## Pull Request Requirements

### PR Checklist

Before requesting review:
- [ ] Title follows conventional commits format
- [ ] Description includes test plan
- [ ] All tests passing
- [ ] Code coverage maintained or improved
- [ ] Breaking changes documented
- [ ] Related issues linked

### PR Review Checklist

Before approving:
- [ ] Code follows project coding standards
- [ ] Security checks passed
- [ ] Test coverage >= 80%
- [ ] No TODOs or FIXMEs in production code
- [ ] Documentation updated

## Checklist

Before marking Git work complete:
- [ ] Commit message includes type and scope
- [ ] Breaking changes documented in commit body
- [ ] PR title follows conventional commits format
- [ ] Test plan included in PR description
- [ ] Related issues linked to PR
```

**O que você deve ver**:
- Formato de commit Git inclui tipo personalizado da equipe (`team`)
- Escopo de commit obrigatório
- PR tem lista de verificação clara
- Regras aplicáveis ao fluxo de colaboração da equipe

### Passo 5: Verificar Carregamento das Rules

Após criar as regras, verifique se o Claude Code as carrega corretamente.

**Por quê**

Garantir que o formato do arquivo de regra está correto e que o Claude pode ler e aplicar as regras.

**Método de Verificação**

1. Inicie uma nova sessão do Claude Code
2. Peça ao Claude para verificar as regras carregadas:
   ```
   Quais arquivos de Rules estão carregados?
   ```

3. Teste se as regras estão funcionando:
   ```
   Crie um componente React seguindo as regras de frontend-conventions
   ```

**O que você deve ver**:
- Claude lista todas as rules carregadas (incluindo regras personalizadas)
- Código gerado segue os padrões que você definiu
- Se violar regras, Claude sugere correções

### Passo 6: Integrar ao Fluxo de Code Review

Faça as regras personalizadas serem verificadas automaticamente durante code reviews.

**Por quê**

Aplicar regras automaticamente durante code reviews garante que todo código atenda aos padrões.

**Configurar code-reviewer para Referenciar Regras**

Certifique-se de que `agents/code-reviewer.md` referencia as regras relevantes:

```markdown
---
name: code-reviewer
description: Review code for quality, security, and adherence to standards
---

When reviewing code, check these rules:

1. **Security checks** (rules/security.md)
   - No hardcoded secrets
   - All inputs validated
   - SQL injection prevention
   - XSS prevention

2. **Coding style** (rules/coding-style.md)
   - Immutability
   - File organization
   - Error handling
   - Input validation

3. **Project-specific rules**
   - Frontend conventions (rules/frontend-conventions.md)
   - Project security (rules/project-security.md)
   - Team Git workflow (rules/team-git-workflow.md)

Report findings in this format:
- CRITICAL: Must fix before merge
- HIGH: Should fix before merge
- MEDIUM: Consider fixing
- LOW: Nice to have
```

**O que você deve ver**:
- Agent code-reviewer verifica todas as regras relevantes durante revisões
- Relatórios categorizados por severidade
- Padrões específicos do projeto incluídos no fluxo de revisão

## Checkpoint ✅

- [ ] Criou pelo menos um arquivo de regra personalizada
- [ ] Arquivo de regra segue formato padrão (título, categorização, exemplos de código, lista de verificação)
- [ ] Regras incluem comparação de exemplos de código correto/incorreto
- [ ] Arquivo de regra está no diretório `rules/`
- [ ] Verificou que Claude Code carrega as regras corretamente
- [ ] Agent code-reviewer referencia regras personalizadas

## Armadilhas Comuns

### ❌ Erro Comum 1: Nomenclatura Irregular de Arquivos de Regra

**Problema**: Nome do arquivo de regra contém espaços ou caracteres especiais, impedindo o Claude de carregar.

**Correção**:
- ✅ Correto: `frontend-conventions.md`, `project-security.md`
- ❌ Incorreto: `Frontend Conventions.md`, `project-security(v2).md`

Use letras minúsculas e hífens, evite espaços e parênteses.

### ❌ Erro Comum 2: Regras Muito Genéricas

**Problema**: Descrição de regra vaga, impossível determinar claramente conformidade.

**Correção**: Forneça lista de verificação específica e exemplos de código:

```markdown
❌ Regra vaga: Componentes devem ser concisos e legíveis

✅ Regra específica:
- Componentes devem ter <300 linhas
- Funções devem ter <50 linhas
- Proibido aninhamento maior que 4 níveis
```

### ❌ Erro Comum 3: Falta de Exemplos de Código

**Problema**: Apenas descrição textual, sem mostrar implementações corretas e incorretas.

**Correção**: Sempre inclua comparação de exemplos de código:

```markdown
CORRECT: Seguindo padrões
function example() { ... }

WRONG: Violando padrões
function example() { ... }
```

### ❌ Erro Comum 4: Lista de Verificação Incompleta

**Problema**: Lista de verificação omite itens-chave, impedindo execução completa das regras.

**Correção**: Cubra todos os aspectos descritos nas regras:

```markdown
Lista de verificação:
- [ ] Item de verificação 1
- [ ] Item de verificação 2
- [ ] ... (cubra todos os pontos das regras)
```

## Resumo da Lição

Rules personalizadas são fundamentais para padronização do projeto:

1. **Conheça as regras integradas** - 8 conjuntos de regras padrão cobrem cenários comuns
2. **Crie arquivos de regra** - Use formato Markdown padrão
3. **Defina padrões do projeto** - Personalize para stack tecnológica e necessidades da equipe
4. **Verifique o carregamento** - Garanta que Claude leia as regras corretamente
5. **Integre ao fluxo de revisão** - Faça code-reviewer verificar regras automaticamente

Com Rules personalizadas, você pode fazer o Claude seguir automaticamente os padrões do projeto, reduzir trabalho de code review e melhorar consistência na qualidade do código.

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos **[Injeção Dinâmica de Contexto: Usando Contexts](../dynamic-contexts/)**.
>
> Você vai aprender:
> - Definição e propósito de Contexts
> - Como criar Contexts personalizados
> - Alternar Contexts em diferentes modos de trabalho
> - Diferença entre Contexts e Rules

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-25

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Regras de segurança | [`rules/security.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/security.md) | 1-37 |
| Regras de estilo de código | [`rules/coding-style.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/coding-style.md) | 1-71 |
| Regras de teste | [`rules/testing.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/testing.md) | 1-31 |
| Regras de otimização de performance | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| Regras de uso de Agent | [`rules/agents.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/agents.md) | 1-50 |
| Regras de fluxo Git | [`rules/git-workflow.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/git-workflow.md) | 1-46 |
| Regras de padrões de design | [`rules/patterns.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/patterns.md) | 1-56 |
| Regras do sistema de Hooks | [`rules/hooks.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/hooks.md) | 1-47 |
| Code Reviewer | [`agents/code-reviewer.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | 1-200 |

**Constantes-chave**:
- `MIN_TEST_COVERAGE = 80`: Requisito mínimo de cobertura de testes
- `MAX_FILE_SIZE = 800`: Limite máximo de linhas por arquivo
- `MAX_FUNCTION_SIZE = 50`: Limite máximo de linhas por função
- `MAX_NESTING_LEVEL = 4`: Nível máximo de aninhamento

**Regras-chave**:
- **Immutability (CRITICAL)**: Proibido modificar objetos diretamente, use operador spread
- **Secret Management**: Proibido hardcode de chaves, use variáveis de ambiente
- **TDD Workflow**: Requer escrever testes primeiro, implementar, depois refatorar
- **Model Selection**: Selecione Haiku/Sonnet/Opus conforme complexidade da tarefa

</details>
