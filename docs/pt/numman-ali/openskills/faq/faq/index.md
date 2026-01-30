---
title: "Perguntas Frequentes: Guia de Solução de Problemas | opencode"
subtitle: "Perguntas Frequentes: Guia de Solução de Problemas"
sidebarTitle: "O que fazer se tiver problemas"
description: "Aprenda a resolver problemas comuns do OpenSkills. Solucione rapidamente falhas de instalação, habilidades não carregadas, sincronização do AGENTS.md e melhore a eficiência de gerenciamento de habilidades."
tags:
  - "FAQ"
  - "Solução de Problemas"
  - "Perguntas Frequentes"
prerequisite:
  - "start-quick-start"
order: 1
---

# Perguntas Frequentes

## O que você poderá fazer após este curso

Este curso responde a perguntas comuns sobre o uso do OpenSkills, ajudando você a:

- ✅ Localizar e resolver rapidamente problemas de falha de instalação
- ✅ Entender a relação entre OpenSkills e Claude Code
- ✅ Resolver o problema de habilidades não aparecerem no AGENTS.md
- ✅ Tratar dúvidas relacionadas à atualização e exclusão de habilidades
- ✅ Configurar habilidades corretamente em ambientes de múltiplos agentes

## Seu problema atual

Ao usar o OpenSkills, você pode encontrar:

- "A instalação sempre falha, não sei onde está o erro"
- "Não consigo ver as habilidades recém-instaladas no AGENTS.md"
- "Não sei onde as habilidades estão instaladas"
- "Quero usar o OpenSkills, mas receio conflitos com o Claude Code"

Este curso ajuda você a encontrar rapidamente a causa raiz dos problemas e suas soluções.

---

## Perguntas sobre Conceitos Principais

### Qual é a diferença entre OpenSkills e Claude Code?

**Resposta curta**: OpenSkills é um "instalador universal", Claude Code é um "agente oficial".

**Explicação detalhada**:

| Item de Comparação | OpenSkills | Claude Code |
|--- | --- | ---|
| **Posicionamento** | Carregador de habilidades universal | Agente de IA de codificação oficial da Anthropic |
| **Escopo de Suporte** | Todos os agentes de IA (Cursor, Windsurf, Aider, etc.) | Apenas Claude Code |
| **Formato de Habilidade** | Idêntico ao Claude Code (`SKILL.md`) | Especificação oficial |
| **Método de Instalação | Do GitHub, caminho local, repositório privado | Do Marketplace interno |
| **Armazenamento de Habilidade** | `.claude/skills/` ou `.agent/skills/` | `.claude/skills/` |
| **Método de Chamada** | `npx openskills read <name>` | Ferramenta interna `Skill()` |

**Valor central**: O OpenSkills permite que outros agentes usem o sistema de habilidades da Anthropic, sem esperar que cada agente implemente separadamente.

### Por que usar CLI em vez de MCP?

**Motivo principal**: Habilidades são arquivos estáticos, MCP é uma ferramenta dinâmica, eles resolvem problemas diferentes.

| Dimensão de Comparação | MCP (Model Context Protocol) | OpenSkills (CLI) |
|--- | --- | ---|
| **Cenário de Uso** | Ferramentas dinâmicas, chamadas de API em tempo real | Instruções estáticas, documentação, scripts |
| **Requisitos de Execução** | Requer servidor MCP | Sem necessidade de servidor (arquivos puros) |
| **Suporte de Agente** | Apenas agentes que suportam MCP | Todos os agentes que conseguem ler `AGENTS.md` |
| **Complexidade** | Requer implantação de servidor | Configuração zero |

**Pontos-chave**:

- **Habilidades são apenas arquivos**: SKILL.md é uma instrução estática + recursos (references/, scripts/, assets/), não precisa de servidor
- **Sem necessidade de suporte do agente**: Qualquer agente que possa executar comandos shell pode usar
- **Em conformidade com o design oficial**: O sistema de habilidades da Anthropic é, por natureza, um design de sistema de arquivos, não um design MCP

**Resumo**: MCP e o sistema de habilidades resolvem problemas diferentes. O OpenSkills mantém a leveza e universalidade das habilidades, sem exigir que cada agente suporte MCP.

---

## Perguntas sobre Instalação e Configuração

### O que fazer se a instalação falhar?

**Erros comuns e soluções**:

#### Erro 1: Falha ao clonar

```bash
Error: Git clone failed
```

**Possíveis causas**:
- Problemas de rede (não consegue acessar o GitHub)
- Git não instalado ou versão muito antiga
- Repositório privado sem chave SSH configurada

**Soluções**:

1. Verifique se o Git está instalado:
   ```bash
   git --version
   # Deve exibir: git version 2.x.x
   ```

2. Verifique a conexão de rede:
   ```bash
   # Teste se consegue acessar o GitHub
   ping github.com
   ```

3. Repositórios privados precisam de SSH configurado:
   ```bash
   # Teste a conexão SSH
   ssh -T git@github.com
   ```

#### Erro 2: Caminho não existe

```bash
Error: Path does not exist: ./nonexistent-path
```

**Soluções**:
- Confirme que o caminho local está correto
- Use caminho absoluto ou relativo:
  ```bash
  # Caminho absoluto
  npx openskills install /Users/dev/my-skills

  # Caminho relativo
  npx openskills install ./my-skills
  ```

#### Erro 3: SKILL.md não encontrado

```bash
Error: No valid SKILL.md found
```

**Soluções**:

1. Verifique a estrutura do diretório de habilidades:
   ```bash
   ls -la ./my-skill
   # Deve conter SKILL.md
   ```

2. Confirme que o SKILL.md tem um frontmatter YAML válido:
   ```markdown
   ---
   name: my-skill
   description: Descrição da habilidade
   ---

   # Conteúdo da habilidade
   ```

### Em qual diretório as habilidades são instaladas?

**Local de instalação padrão** (local do projeto):
```bash
.claude/skills/
```

**Local de instalação global** (usando `--global`):
```bash
~/.claude/skills/
```

**Modo Universal** (usando `--universal`):
```bash
.agent/skills/
```

**Prioridade de busca de habilidades** (do maior para o menor):
1. `./.agent/skills/` (local do projeto, Universal)
2. `~/.agent/skills/` (global, Universal)
3. `./.claude/skills/` (local do projeto, padrão)
4. `~/.claude/skills/` (global, padrão)

**Verificar o local das habilidades instaladas**:
```bash
npx openskills list
# A saída exibe a tag [project] ou [global]
```

### Como coexistir com o Claude Code Marketplace?

**Problema**: Quero usar tanto o Claude Code quanto o OpenSkills, como evitar conflitos?

**Solução**: Usar o modo Universal

```bash
# Instalar em .agent/skills/ em vez de .claude/skills/
npx openskills install anthropics/skills --universal
```

**Por que funciona**:

| Diretório | Quem usa | Descrição |
|--- | --- | ---|
| `.claude/skills/` | Claude Code | Usado pelo Claude Code Marketplace |
| `.agent/skills/` | OpenSkills | Usado por outros agentes (Cursor, Windsurf) |

**Aviso de conflito**:

Ao instalar do repositório oficial, o OpenSkills exibe:
```
⚠️  Warning: These skills are also available in Claude Code Marketplace.
   Installing to .claude/skills/ may cause conflicts.
   Use --universal to install to .agent/skills/ instead.
```

---

## Perguntas sobre Uso

### A habilidade não aparece no AGENTS.md?

**Sintoma**: Após instalar uma habilidade, ela não aparece no AGENTS.md.

**Etapas de verificação**:

#### 1. Confirme se foi sincronizado

Após instalar uma habilidade, é necessário executar o comando `sync`:

```bash
npx openskills install anthropics/skills
# Selecione as habilidades...

# Deve executar sync!
npx openskills sync
```

#### 2. Verifique o local do AGENTS.md

```bash
# Por padrão, AGENTS.md está no diretório raiz do projeto
cat AGENTS.md
```

Se estiver usando um caminho de saída personalizado, confirme que o caminho está correto:
```bash
npx openskills sync -o custom-path/AGENTS.md
```

#### 3. Verifique se a habilidade foi selecionada

O comando `sync` é interativo, você precisa confirmar que selecionou as habilidades para sincronizar:

```bash
npx openskills sync

? Select skills to sync:
  ◉ pdf                  [selecionado]
  ◯ check-branch-first   [não selecionado]
```

#### 4. Visualize o conteúdo do AGENTS.md

Confirme se as tags XML estão corretas:

```xml
<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit...</description>
<location>project</location>
</skill>

</available_skills>
```

### Como atualizar habilidades?

**Atualizar todas as habilidades**:
```bash
npx openskills update
```

**Atualizar habilidades específicas** (separadas por vírgula):
```bash
npx openskills update pdf,git-workflow
```

**Problemas comuns**:

#### Habilidade não atualizada

**Sintoma**: Após executar `update`, exibe "skipped"

**Motivo**: A habilidade não tinha informações de origem registradas na instalação (comportamento de versões antigas)

**Solução**:
```bash
# Reinstalar para registrar a origem
npx openskills install anthropics/skills
```

#### Habilidades locais não podem ser atualizadas

**Sintoma**: Habilidades instaladas de caminhos locais, erro ao tentar atualizar

**Motivo**: Habilidades de caminho local precisam ser atualizadas manualmente

**Solução**:
```bash
# Reinstalar do caminho local
npx openskills install ./my-skill
```

### Como excluir habilidades?

**Método 1: Exclusão interativa**

```bash
npx openskills manage
```

Selecione as habilidades a serem excluídas, pressione espaço para selecionar, Enter para confirmar.

**Método 2: Exclusão direta**

```bash
npx openskills remove <skill-name>
```

**Após excluir**: Lembre-se de executar `sync` para atualizar o AGENTS.md:
```bash
npx openskills sync
```

**Problemas comuns**:

#### Excluiu habilidade por engano

**Método de recuperação**:
```bash
# Reinstalar da origem
npx openskills install anthropics/skills
# Selecione a habilidade excluída por engano
```

#### Ainda exibe no AGENTS.md após exclusão

**Solução**: Sincronizar novamente
```bash
npx openskills sync
```

---

## Perguntas Avançadas

### Como compartilhar habilidades em múltiplos projetos?

**Cenário**: Múltiplos projetos precisam usar o mesmo conjunto de habilidades, não quero instalar repetidamente.

**Solução 1: Instalação global**

```bash
# Instalar uma vez globalmente
npx openskills install anthropics/skills --global

# Todos os projetos podem usar
cd project-a
npx openskills read pdf

cd project-b
npx openskills read pdf
```

**Vantagens**:
- Instala uma vez, disponível em todos os lugares
- Reduz o uso de disco

**Desvantagens**:
- As habilidades não estão no projeto, não são incluídas no controle de versão

**Solução 2: Link simbólico**

```bash
# 1. Instalar habilidades globalmente
npx openskills install anthropics/skills --global

# 2. Criar link simbólico no projeto
cd project-a
ln -s ~/.claude/skills/pdf .claude/skills/pdf

# 3. O sync identificará como localização [project]
npx openskills sync
```

**Vantagens**:
- As habilidades estão no projeto (tag `[project]`)
- O controle de versão pode incluir links simbólicos
- Instala uma vez, usado em múltiplos lugares

**Desvantagens**:
- Links simbólicos podem exigir permissões em certos sistemas

**Solução 3: Git Submodule**

```bash
# Adicionar o repositório de habilidades como submodule no projeto
cd project-a
git submodule add https://github.com/anthropics/skills.git .claude/skills-repo

# Instalar habilidades do submodule
npx openskills install .claude/skills-repo/pdf
```

**Vantagens**:
- Controle de versão completo
- Pode especificar a versão da habilidade

**Desvantagens**:
- Configuração mais complexa

### Link simbólico não pode ser acessado?

**Sintoma**:

```bash
ln -s ~/dev/my-skills/my-skill .claude/skills/my-skill
# ln: failed to create symbolic link: Operation not permitted
```

**Solução por sistema**:

#### macOS

1. Abra "Preferências do Sistema"
2. Vá para "Segurança e Privacidade"
3. Em "Acesso total ao disco", permita seu aplicativo de terminal

#### Windows

O Windows não suporta links simbólicos nativamente, recomenda:
- **Usar Git Bash**: Suporte nativo para links simbólicos
- **Usar WSL**: Subsistema Linux suporta links simbólicos
- **Habilitar modo desenvolvedor**: Configurações → Atualização e Segurança → Modo Desenvolvedor

```bash
# Criar link simbólico no Git Bash
ln -s /c/dev/my-skills/my-skill .claude/skills/my-skill
```

#### Linux

Verifique as permissões do sistema de arquivos:

```bash
# Verificar permissões do diretório
ls -la .claude/

# Adicionar permissão de gravação
chmod +w .claude/
```

### Habilidade não encontrada?

**Sintoma**:

```bash
npx openskills read my-skill
# Error: Skill not found: my-skill
```

**Etapas de verificação**:

#### 1. Confirme se a habilidade está instalada

```bash
npx openskills list
```

#### 2. Verifique o uso de maiúsculas e minúsculas no nome da habilidade

```bash
# ❌ Errado (maiúsculas)
npx openskills read My-Skill

# ✅ Correto (minúsculas)
npx openskills read my-skill
```

#### 3. Verifique se a habilidade foi substituída por outra de maior prioridade

```bash
# Verifique todos os locais de habilidades
ls -la .claude/skills/my-skill
ls -la ~/.claude/skills/my-skill
ls -la .agent/skills/my-skill
ls -la ~/.agent/skills/my-skill
```

**Regra de busca de habilidades**: O local de maior prioridade substitui habilidades com o mesmo nome em outros locais.

---

## Resumo do Curso

Principais pontos das perguntas frequentes do OpenSkills:

### Conceitos Principais

- ✅ OpenSkills é um instalador universal, Claude Code é o agente oficial
- ✅ CLI é mais adequado que MCP para sistema de habilidades (arquivos estáticos)

### Instalação e Configuração

- ✅ As habilidades são instaladas por padrão em `.claude/skills/`
- ✅ Use `--universal` para evitar conflitos com o Claude Code
- ✅ Falhas de instalação geralmente são problemas de rede, Git ou caminho

### Dicas de Uso

- ✅ Após instalar, deve executar `sync` para aparecer no AGENTS.md
- ✅ O comando `update` atualiza apenas habilidades com informações de origem
- ✅ Lembre-se de `sync` após excluir habilidades

### Cenários Avançados

- ✅ Compartilhar habilidades em múltiplos projetos: instalação global, link simbólico, Git Submodule
- ✅ Problemas com links simbólicos: configure permissões por sistema
- ✅ Habilidade não encontrada: verifique o nome, veja a prioridade

## Próximo Curso

> No próximo curso aprenderemos **[Solução de Problemas](../troubleshooting/)**.
>
> Você aprenderá:
> - Diagnóstico rápido e métodos de resolução de erros comuns
> - Tratamento de problemas como erros de caminho, falhas de clonagem, SKILL.md inválido
> - Técnicas de verificação de problemas de permissões e falhas em links simbólicos

---

## Apêndice: Referência do Código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Última atualização: 2026-01-24

| Funcionalidade | Caminho do Arquivo                                                                                                   | Linha   |
|--- | --- | ---|
| Comando de instalação | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts)              | 1-424   |
| Comando de sincronização | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts)                  | 1-99    |
| Comando de atualização | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts)              | 1-113   |
| Comando de exclusão | [`src/commands/remove.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/remove.ts)              | 1-30    |
| Busca de habilidades | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts)                    | 1-50    |
| Prioridade de diretórios | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts)                      | 14-25   |
| Geração do AGENTS.md | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts)            | 23-93   |

**Funções principais**:
- `findAllSkills()`: Encontra todas as habilidades (ordenadas por prioridade)
- `findSkill(name)`: Encontra uma habilidade específica
- `generateSkillsXml()`: Gera formato XML do AGENTS.md
- `updateSkillFromDir()`: Atualiza habilidade a partir do diretório

</details>
