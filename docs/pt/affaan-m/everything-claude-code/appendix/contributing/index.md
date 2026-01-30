---
title: "Guia de Contribuição: Enviando Configurações | Everything Claude Code"
sidebarTitle: "Envie sua Primeira Configuração"
subtitle: "Guia de Contribuição: Enviando Configurações"
description: "Aprenda o processo padrão para contribuir com configurações no Everything Claude Code. Domine os passos de fork, criação de branches, formatação, testes locais e envio de PRs para se tornar um contribuidor."
tags:
  - "contributing"
  - "agents"
  - "skills"
  - "commands"
  - "hooks"
  - "rules"
  - "mcp"
  - "github"
prerequisite:
  - "start-installation"
  - "start-quickstart"
order: 230
---

# Guia de Contribuição: Como Contribuir com Configurações, Agents e Skills

## O Que Você Vai Aprender

- Entender o fluxo e as normas de contribuição do projeto
- Enviar corretamente Agents, Skills, Commands, Hooks, Rules e configurações MCP
- Seguir o estilo de código e convenções de nomenclatura
- Evitar erros comuns de contribuição
- Colaborar eficientemente com a comunidade através de Pull Requests

## Seu Desafio Atual

Você quer contribuir com o Everything Claude Code, mas enfrenta estes problemas:
- "Não sei que tipo de conteúdo seria valioso contribuir"
- "Não sei como começar meu primeiro PR"
- "Não conheço o formato de arquivo e convenções de nomenclatura"
- "Tenho receio de que minha contribuição não atenda aos requisitos"

Este tutorial oferece um guia completo de contribuição, da teoria à prática.

## Conceito Central

Everything Claude Code é um **recurso da comunidade**, não um projeto individual. O valor deste repositório está em:

1. **Validação em Produção** - Todas as configurações foram testadas em mais de 10 meses de uso em ambiente de produção
2. **Design Modular** - Cada Agent, Skill e Command é um componente independente e reutilizável
3. **Qualidade em Primeiro Lugar** - Revisão de código e auditoria de segurança garantem a qualidade das contribuições
4. **Colaboração Aberta** - Licença MIT, incentivando contribuições e customizações

::: tip Por Que Contribuir é Valioso
- **Compartilhamento de Conhecimento**: Sua experiência pode ajudar outros desenvolvedores
- **Impacto**: Configurações usadas por centenas/milhares de pessoas
- **Desenvolvimento de Habilidades**: Aprenda estrutura de projetos e colaboração em comunidade
- **Networking**: Conecte-se com a Anthropic e a comunidade Claude Code
:::

## O Que Estamos Procurando

### Agents

Sub-agentes especializados que lidam com tarefas complexas em domínios específicos:

| Tipo | Exemplos |
| --- | --- |
| Especialistas em Linguagem | Revisão de código Python, Go, Rust |
| Especialistas em Framework | Django, Rails, Laravel, Spring |
| Especialistas em DevOps | Kubernetes, Terraform, CI/CD |
| Especialistas em Domínio | Pipelines de ML, engenharia de dados, mobile |

### Skills

Definições de workflow e bases de conhecimento de domínio:

| Tipo | Exemplos |
| --- | --- |
| Melhores Práticas de Linguagem | Padrões de código Python, Go, Rust |
| Padrões de Framework | Padrões de arquitetura Django, Rails, Laravel |
| Estratégias de Teste | Testes unitários, de integração, E2E |
| Guias de Arquitetura | Microsserviços, event-driven, CQRS |
| Conhecimento de Domínio | ML, análise de dados, desenvolvimento mobile |

### Commands

Comandos slash que fornecem acesso rápido a workflows:

| Tipo | Exemplos |
| --- | --- |
| Comandos de Deploy | Deploy para Vercel, Railway, AWS |
| Comandos de Teste | Executar testes unitários, E2E, análise de cobertura |
| Comandos de Documentação | Gerar documentação de API, atualizar README |
| Comandos de Geração de Código | Gerar tipos, templates CRUD |

### Hooks

Hooks de automação que disparam em eventos específicos:

| Tipo | Exemplos |
| --- | --- |
| Linting/formatting | Formatação de código, verificação de lint |
| Verificações de Segurança | Detecção de dados sensíveis, scan de vulnerabilidades |
| Hooks de Validação | Validação de commit Git, verificação de PR |
| Hooks de Notificação | Notificações Slack/Email |

### Rules

Regras obrigatórias que garantem qualidade de código e padrões de segurança:

| Tipo | Exemplos |
| --- | --- |
| Regras de Segurança | Proibir chaves hardcoded, verificações OWASP |
| Estilo de Código | Padrões imutáveis, limites de tamanho de arquivo |
| Requisitos de Teste | 80%+ de cobertura, fluxo TDD |
| Convenções de Nomenclatura | Nomenclatura de variáveis, nomenclatura de arquivos |

### Configurações MCP

Configurações de servidor MCP que estendem integrações com serviços externos:

| Tipo | Exemplos |
| --- | --- |
| Integração com Banco de Dados | PostgreSQL, MongoDB, ClickHouse |
| Provedores de Nuvem | AWS, GCP, Azure |
| Ferramentas de Monitoramento | Datadog, New Relic, Sentry |
| Ferramentas de Comunicação | Slack, Discord, Email |

## Como Contribuir

### Passo 1: Fork do Projeto

**Por quê**: Você precisa de sua própria cópia para fazer modificações sem afetar o repositório original.

```bash
# 1. Acesse https://github.com/affaan-m/everything-claude-code
# 2. Clique no botão "Fork" no canto superior direito
# 3. Clone seu fork
git clone https://github.com/YOUR_USERNAME/everything-claude-code.git
cd everything-claude-code

# 4. Adicione o repositório upstream (para sincronização futura)
git remote add upstream https://github.com/affaan-m/everything-claude-code.git
```

**Você deve ver**: Um diretório local `everything-claude-code` contendo todos os arquivos do projeto.

### Passo 2: Criar uma Branch de Feature

**Por quê**: Branches isolam suas modificações, facilitando o gerenciamento e merge.

```bash
# Crie um nome de branch descritivo
git checkout -b add-python-reviewer

# Ou use nomenclatura mais específica
git checkout -b feature/django-pattern-skill
git checkout -b fix/hook-tmux-reminder
```

**Convenções de nomenclatura de branch**:
- `feature/` - Novas funcionalidades
- `fix/` - Correções de bugs
- `docs/` - Atualizações de documentação
- `refactor/` - Refatoração de código

### Passo 3: Adicione Sua Contribuição

**Por quê**: Colocar arquivos no diretório correto garante que o Claude Code possa carregá-los corretamente.

```bash
# Escolha o diretório baseado no tipo de contribuição
agents/           # Novos Agents
skills/           # Novos Skills (pode ser um único .md ou diretório)
commands/         # Novos comandos slash
rules/            # Novos arquivos de regras
hooks/            # Configuração de Hooks (modifique hooks/hooks.json)
mcp-configs/      # Configurações de servidor MCP (modifique mcp-configs/mcp-servers.json)
```

::: tip Estrutura de Diretórios
- **Arquivo único**: Coloque diretamente no diretório, ex: `agents/python-reviewer.md`
- **Componentes complexos**: Crie um subdiretório, ex: `skills/coding-standards/` (contendo múltiplos arquivos)
:::

### Passo 4: Siga as Especificações de Formato

#### Formato de Agent

**Por quê**: O Front Matter define os metadados do Agent, e o Claude Code depende dessas informações para carregar o Agent.

```markdown
---
name: python-reviewer
description: Reviews Python code for PEP 8 compliance, type hints, and best practices
tools: Read, Grep, Glob, Bash, Write, Edit
model: sonnet
---

You are a senior Python code reviewer...

Your review should cover:
- PEP 8 style compliance
- Type hints usage
- Docstring completeness
- Security best practices
- Performance optimizations
```

**Campos obrigatórios**:
- `name`: Identificador do Agent (minúsculas com hífen)
- `description`: Descrição da funcionalidade
- `tools`: Lista de ferramentas permitidas (separadas por vírgula)
- `model`: Modelo preferido (`opus` ou `sonnet`)

#### Formato de Skill

**Por quê**: Definições claras de Skill são mais fáceis de reutilizar e entender.

```markdown
# Python Best Practices

## When to Use

Use this skill when:
- Writing new Python code
- Reviewing Python code
- Refactoring Python modules

## How It Works

Follow these principles:

1. **Type Hints**: Always include type hints for function parameters and return values
2. **Docstrings**: Use Google style docstrings for all public functions
3. **PEP 8**: Follow PEP 8 style guide
4. **Immutability**: Prefer immutable data structures

## Examples

### Good
```python
def process_user_data(user_id: str) -> dict:
    """Process user data and return result.

    Args:
        user_id: The user ID to process

    Returns:
        A dictionary with processed data
    """
    user_data = fetch_user(user_id)
    return transform_data(user_data)
```

### Bad
```python
def process_user_data(user_id):
    user_data = fetch_user(user_id)
    return transform_data(user_data)
```
```

**Seções recomendadas**:
- `When to Use`: Cenários de uso
- `How It Works`: Como funciona
- `Examples`: Exemplos (Bom vs Ruim)
- `References`: Recursos relacionados (opcional)

#### Formato de Command

**Por quê**: Descrições claras de comandos ajudam os usuários a entender a funcionalidade.

Front Matter (obrigatório):

```markdown
---
description: Run Python tests with coverage report
---
```

Conteúdo do corpo (opcional):

```markdown
# Test

Run tests for the current project:

Coverage requirements:
- Minimum 80% line coverage
- 100% coverage for critical paths
```

Exemplos de comando (opcional):

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Run specific test file
pytest tests/test_user.py
```

**Campos obrigatórios**:
- `description`: Descrição curta da funcionalidade

#### Formato de Hook

**Por quê**: Hooks precisam de regras de correspondência claras e ações de execução.

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(py)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.log('Python file edited')\""
    }
  ],
  "description": "Triggered when Python files are edited"
}
```

**Campos obrigatórios**:
- `matcher`: Expressão de condição de disparo
- `hooks`: Array de ações a executar
- `description`: Descrição da funcionalidade do Hook

### Passo 5: Teste Sua Contribuição

**Por quê**: Garantir que a configuração funcione corretamente em uso real.

::: warning Importante
Antes de enviar um PR, **certifique-se** de testar a configuração em seu ambiente local.
:::

**Passos de teste**:

```bash
# 1. Copie para sua configuração do Claude Code
cp agents/python-reviewer.md ~/.claude/agents/
cp skills/python-patterns/* ~/.claude/skills/

# 2. Teste no Claude Code
# Inicie o Claude Code e use a nova configuração

# 3. Verifique a funcionalidade
# - O Agent pode ser chamado corretamente?
# - O Command executa corretamente?
# - O Hook dispara no momento certo?
```

**Você deve ver**: A configuração funcionando normalmente no Claude Code, sem erros ou anomalias.

### Passo 6: Envie o PR

**Por quê**: Pull Request é a forma padrão de colaboração em comunidade.

```bash
# Adicione todas as alterações
git add .

# Commit (use uma mensagem de commit clara)
git commit -m "Add Python code reviewer agent

- Implements PEP 8 compliance checks
- Adds type hints validation
- Includes security best practices
- Tested on real Python projects"

# Push para seu fork
git push origin add-python-reviewer
```

**Então crie o PR no GitHub**:

1. Acesse seu repositório fork
2. Clique em "Compare & pull request"
3. Preencha o template do PR:

```markdown
## What you added
- [ ] Description of what you added

## Why it's useful
- [ ] Why this contribution is valuable

## How you tested it
- [ ] Testing steps you performed

## Related issues
- [ ] Link to any related issues
```

**Você deve ver**: PR criado com sucesso, aguardando revisão dos mantenedores.

## Diretrizes

### Do (Deve Fazer)

✅ **Mantenha configurações focadas e modulares**
- Cada Agent/Skill deve fazer apenas uma coisa
- Evite misturar funcionalidades

✅ **Inclua descrições claras**
- Descrições precisas no Front Matter
- Comentários de código úteis

✅ **Teste antes de enviar**
- Valide a configuração localmente
- Certifique-se de que não há erros

✅ **Siga padrões existentes**
- Consulte o formato de arquivos existentes
- Mantenha consistência no estilo de código

✅ **Documente dependências**
- Liste dependências externas
- Especifique requisitos de instalação

### Don't (Não Deve Fazer)

❌ **Incluir dados sensíveis**
- API keys, tokens
- Caminhos hardcoded
- Credenciais pessoais

❌ **Adicionar configurações muito complexas ou de nicho**
- Priorize generalidade
- Evite over-engineering

❌ **Enviar configurações não testadas**
- Testes são obrigatórios
- Forneça passos de teste

❌ **Criar funcionalidades duplicadas**
- Pesquise configurações existentes
- Evite reinventar a roda

❌ **Adicionar configurações que dependem de serviços pagos específicos**
- Forneça alternativas gratuitas
- Ou use ferramentas open source

## Convenções de Nomenclatura de Arquivos

**Por quê**: Convenções de nomenclatura unificadas tornam o projeto mais fácil de manter.

### Regras de Nomenclatura

| Regra | Exemplo |
| --- | --- |
| Use minúsculas | `python-reviewer.md` |
| Use hífen como separador | `tdd-workflow.md` |
| Nomenclatura descritiva | `django-pattern-skill.md` |
| Evite nomes vagos | ❌ `workflow.md` → ✅ `tdd-workflow.md` |

### Princípio de Correspondência

O nome do arquivo deve corresponder ao nome do Agent/Skill/Command:

```bash
# Agent
agents/python-reviewer.md          # name: python-reviewer

# Skill
skills/django-patterns/SKILL.md    # # Django Patterns

# Command
commands/test.md                   # # Test
```

::: tip Dicas de Nomenclatura
- Use terminologia da indústria (como "PEP 8", "TDD", "REST")
- Evite abreviações (exceto abreviações padrão)
- Mantenha conciso mas descritivo
:::

## Checklist de Contribuição

Antes de enviar um PR, certifique-se de atender às seguintes condições:

### Qualidade de Código
- [ ] Segue o estilo de código existente
- [ ] Inclui Front Matter necessário
- [ ] Tem descrições e documentação claras
- [ ] Passou nos testes locais

### Especificações de Arquivo
- [ ] Nome do arquivo segue convenções de nomenclatura
- [ ] Arquivo está no diretório correto
- [ ] Formato JSON correto (se aplicável)
- [ ] Sem dados sensíveis

### Qualidade do PR
- [ ] Título do PR descreve claramente as alterações
- [ ] Descrição do PR inclui "O quê", "Por quê", "Como"
- [ ] Link para issue relacionada (se houver)
- [ ] Fornece passos de teste

### Normas da Comunidade
- [ ] Certifique-se de que não há funcionalidade duplicada
- [ ] Forneça alternativas (se envolver serviços pagos)
- [ ] Responda aos comentários de revisão
- [ ] Mantenha discussões amigáveis e construtivas

## Perguntas Frequentes

### P: Como saber que tipo de contribuição é valiosa?

**R**: Comece com suas próprias necessidades:
- Que problema você encontrou recentemente?
- Que solução você usou?
- Essa solução pode ser reutilizada?

Você também pode verificar as Issues do projeto:
- Feature requests não resolvidos
- Sugestões de melhorias
- Relatórios de bugs

### P: Minha contribuição pode ser rejeitada?

**R**: Possivelmente, mas isso é normal. Razões comuns:
- Funcionalidade já existe
- Configuração não segue as especificações
- Falta de testes
- Problemas de segurança ou privacidade

Os mantenedores fornecerão feedback detalhado, e você pode modificar e reenviar com base no feedback.

### P: Como acompanhar o status do PR?

**R**: 
1. Verifique o status na página do PR no GitHub
2. Acompanhe os comentários de revisão
3. Responda ao feedback dos mantenedores
4. Atualize o PR conforme necessário

### P: Posso contribuir com correções de bugs?

**R**: Claro! Correções de bugs são uma das contribuições mais valiosas:
1. Pesquise ou crie uma nova issue nas Issues
2. Faça fork do projeto e corrija o bug
3. Adicione testes (se necessário)
4. Envie o PR, referenciando a issue na descrição

### P: Como manter meu fork sincronizado com o upstream?

**R**:

```bash
# 1. Adicione o repositório upstream (se ainda não tiver)
git remote add upstream https://github.com/affaan-m/everything-claude-code.git

# 2. Busque atualizações do upstream
git fetch upstream

# 3. Faça merge das atualizações do upstream na sua branch main
git checkout main
git merge upstream/main

# 4. Push das atualizações para seu fork
git push origin main

# 5. Rebase na branch main mais recente
git checkout your-feature-branch
git rebase main
```

## Contato

Se você tiver alguma dúvida ou precisar de ajuda:

- **Abra uma Issue**: [GitHub Issues](https://github.com/affaan-m/everything-claude-code/issues)
- **Twitter**: [@affaanmustafa](https://x.com/affaanmustafa)
- **Email**: Entre em contato via GitHub

::: tip Dicas para Perguntas
- Pesquise primeiro nas Issues e Discussions existentes
- Forneça contexto claro e passos de reprodução
- Seja educado e construtivo
:::

## Resumo da Lição

Esta lição explicou sistematicamente o fluxo e as normas de contribuição do Everything Claude Code:

**Conceitos Centrais**:
- Recurso da comunidade, construção coletiva
- Validação em produção, qualidade em primeiro lugar
- Design modular, fácil reutilização
- Colaboração aberta, compartilhamento de conhecimento

**Tipos de Contribuição**:
- **Agents**: Sub-agentes especializados (linguagem, framework, DevOps, especialistas de domínio)
- **Skills**: Definições de workflow e bases de conhecimento de domínio
- **Commands**: Comandos slash (deploy, teste, documentação, geração de código)
- **Hooks**: Hooks de automação (linting, verificações de segurança, validação, notificações)
- **Rules**: Regras obrigatórias (segurança, estilo de código, testes, nomenclatura)
- **Configurações MCP**: Configurações de servidor MCP (banco de dados, nuvem, monitoramento, comunicação)

**Fluxo de Contribuição**:
1. Fork do projeto
2. Criar branch de feature
3. Adicionar conteúdo da contribuição
4. Seguir especificações de formato
5. Testes locais
6. Enviar PR

**Especificações de Formato**:
- Agent: Front Matter + Descrição + Instruções
- Skill: When to Use + How It Works + Examples
- Command: Description + Exemplos de uso
- Hook: Matcher + Hooks + Description

**Diretrizes**:
- **Do**: Focado, claro, testado, seguir padrões, documentar
- **Don't**: Dados sensíveis, complexo/nicho, não testado, duplicado, dependência de serviços pagos

**Nomenclatura de Arquivos**:
- Minúsculas + hífen
- Nomenclatura descritiva
- Consistente com nome do Agent/Skill/Command

**Checklist**:
- Qualidade de código, especificações de arquivo, qualidade do PR, normas da comunidade

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos sobre **[Configurações de Exemplo: Configurações de Projeto e Usuário](../examples/)**.
>
> Você aprenderá:
> - Melhores práticas para configurações de nível de projeto
> - Configurações personalizadas de nível de usuário
> - Como customizar configurações para projetos específicos
> - Exemplos de configuração de projetos reais

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-25

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Guia de Contribuição | [`CONTRIBUTING.md`](https://github.com/affaan-m/everything-claude-code/blob/main/CONTRIBUTING.md) | 1-192 |
| Exemplo de Agent | [`agents/code-reviewer.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | - |
| Exemplo de Skill | [`skills/coding-standards/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/coding-standards/SKILL.md) | - |
| Exemplo de Command | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md) | - |
| Configuração de Hook | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| Exemplo de Rule | [`rules/coding-style.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/coding-style.md) | - |
| Exemplo de Configuração MCP | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-92 |
| Configurações de Exemplo | [`examples/CLAUDE.md`](https://github.com/affaan-m/everything-claude-code/blob/main/examples/CLAUDE.md) | - |

**Campos-chave do Front Matter**:
- `name`: Identificador do Agent/Skill/Command
- `description`: Descrição da funcionalidade
- `tools`: Ferramentas permitidas (Agent)
- `model`: Modelo preferido (Agent, opcional)

**Estrutura de Diretórios Principal**:
- `agents/`: 9 sub-agentes especializados
- `skills/`: 11 definições de workflow
- `commands/`: 14 comandos slash
- `rules/`: 8 conjuntos de regras
- `hooks/`: Configurações de hooks de automação
- `mcp-configs/`: Configurações de servidor MCP
- `examples/`: Arquivos de configuração de exemplo

**Links Relacionados à Contribuição**:
- GitHub Issues: https://github.com/affaan-m/everything-claude-code/issues
- Twitter: https://x.com/affaanmustafa

</details>
