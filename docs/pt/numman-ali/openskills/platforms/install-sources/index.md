---
title: "Fontes de Instalação: Várias Formas de Instalar Habilidades | openskills"
sidebarTitle: "Três Fontes à Sua Escolha"
subtitle: "Detalhes das Fontes de Instalação"
description: "Aprenda três formas de instalar habilidades do OpenSkills. Domine métodos de instalação a partir de repositórios do GitHub, caminhos locais e repositórios Git privados, incluindo autenticação SSH/HTTPS e configuração de subcaminhos."
tags:
  - "Integração de Plataforma"
  - "Gerenciamento de Habilidades"
  - "Configuração de Instalação"
prerequisite:
  - "start-first-skill"
order: 2
---

# Detalhes das Fontes de Instalação

## O Que Você Poderá Fazer Depois

- Instalar habilidades usando três métodos: repositório do GitHub, caminho local, repositório Git privado
- Escolher a fonte de instalação mais adequada para cada cenário
- Compreender os prós e contras de diferentes fontes e suas considerações
- Dominar formas de escrita como GitHub shorthand, caminhos relativos, URLs de repositórios privados

::: info Conhecimento Prévio

Este tutorial assume que você já completou [Instalar a Primeira Habilidade](../../start/first-skill/), entendendo o processo básico de instalação.

:::

---

## O Seu Dilema Atual

Você já pode ter aprendido a instalar habilidades a partir do repositório oficial, mas:

- **Apenas o GitHub funciona?**: Quer usar o repositório GitLab interno da empresa, mas não sabe como configurar
- **Como instalar habilidades em desenvolvimento local?**: Está desenvolvendo suas próprias habilidades e quer testá-las na máquina local primeiro
- **Quer especificar uma habilidade diretamente**: O repositório tem muitas habilidades, não quer selecionar através da interface interativa toda vez
- **Como acessar repositórios privados?**: O repositório de habilidades da empresa é privado, não sabe como fazer a autenticação

Na verdade, o OpenSkills suporta múltiplas fontes de instalação, vamos ver uma por uma.

---

## Quando Usar Esta Abordagem

**Cenários aplicáveis para diferentes fontes de instalação**:

| Fonte de Instalação | Cenário Aplicável | Exemplo |
|--- | --- | ---|
| **Repositório GitHub** | Usar habilidades da comunidade open source | `openskills install anthropics/skills` |
| **Caminho Local** | Desenvolver e testar suas próprias habilidades | `openskills install ./my-skill` |
| **Repositório Git Privado** | Usar habilidades internas da empresa | `openskills install git@github.com:my-org/private-skills.git` |

::: tip Prática Recomendada

- **Habilidades open source**: Priorize instalação a partir de repositórios do GitHub para facilitar atualizações
- **Fase de desenvolvimento**: Instale a partir de caminhos locais para testar modificações em tempo real
- **Colaboração em equipe**: Use repositórios Git privados para gerenciar habilidades internas de forma unificada

:::

---

## Ideia Central: Três Fontes, Mesmo Mecanismo

Embora as fontes de instalação sejam diferentes, o mecanismo subjacente do OpenSkills é o mesmo:

```
[Identificar tipo de fonte] → [Obter arquivos da habilidade] → [Copiar para .claude/skills/]
```

**Lógica de identificação de fonte** (código fonte `install.ts:25-45`):

```typescript
function isLocalPath(source: string): boolean {
  return (
    source.startsWith('/') ||
    source.startsWith('./') ||
    source.startsWith('../') ||
    source.startsWith('~/')
  );
}

function isGitUrl(source: string): boolean {
  return (
    source.startsWith('git@') ||
    source.startsWith('git://') ||
    source.startsWith('http://') ||
    source.startsWith('https://') ||
    source.endsWith('.git')
  );
}
```

**Prioridade de julgamento**:
1. Primeiro verifique se é um caminho local (`isLocalPath`)
2. Depois verifique se é uma URL do Git (`isGitUrl`)
3. Finalmente, trate como GitHub shorthand (`owner/repo`)

---

## Siga Comigo

### Método 1: Instalar a partir do Repositório do GitHub

**Cenário aplicável**: Instalar habilidades da comunidade open source, como o repositório oficial da Anthropic, pacotes de habilidades de terceiros.

#### Uso Básico: Instalar o Repositório Inteiro

```bash
npx openskills install owner/repo
```

**Exemplo**: Instalar habilidades a partir do repositório oficial da Anthropic

```bash
npx openskills install anthropics/skills
```

**Você deverá ver**:

```
Installing from: anthropics/skills
Location: project (.claude/skills)

Cloning repository...
✓ Repository cloned

Found 4 skill(s)

? Select skills to install:
❯ ◉ pdf (24 KB)
  ◯ git-workflow (12 KB)
  ◯ check-branch-first (8 KB)
  ◯ skill-creator (16 KB)
```

#### Uso Avançado: Especificar Subcaminho (Instalar uma Habilidade Diretamente)

Se o repositório contém muitas habilidades, você pode especificar diretamente o subcaminho da habilidade que deseja instalar, pulando a seleção interativa:

```bash
npx openskills install owner/repo/skill-name
```

**Exemplo**: Instalar diretamente a habilidade de processamento de PDF

```bash
npx openskills install anthropics/skills/pdf
```

**Você deverá ver**:

```
Installing from: anthropics/skills/pdf
Location: project (.claude/skills)

Cloning repository...
✓ Repository cloned
✅ Installed: pdf
   Location: /path/to/project/.claude/skills/pdf
```

::: tip Prática Recomendada

Quando você precisa de apenas uma habilidade do repositório, o formato de subcaminho permite pular a seleção interativa, sendo mais rápido.

:::

#### Regras do GitHub Shorthand (código fonte `install.ts:131-143`)

| Formato | Exemplo | Resultado da Conversão |
|--- | --- | ---|
| `owner/repo` | `anthropics/skills` | `https://github.com/anthropics/skills` |
|--- | --- | ---|

---

### Método 2: Instalar a partir de Caminho Local

**Cenário aplicável**: Está desenvolvendo suas próprias habilidades e quer testá-las localmente antes de publicar no GitHub.

#### Usar Caminho Absoluto

```bash
npx openskills install /absolute/path/to/skill
```

**Exemplo**: Instalar a partir do diretório de habilidades no diretório principal

```bash
npx openskills install ~/dev/my-skills/pdf-processor
```

#### Usar Caminho Relativo

```bash
npx openskills install ./local-skills/my-skill
```

**Exemplo**: Instalar a partir do subdiretório `local-skills/` no diretório do projeto

```bash
npx openskills install ./local-skills/web-scraper
```

**Você deverá ver**:

```
Installing from: ./local-skills/web-scraper
Location: project (.claude/skills)
✅ Installed: web-scraper
   Location: /path/to/project/.claude/skills/web-scraper
```

::: warning Aviso

A instalação por caminho local copia os arquivos da habilidade para `.claude/skills/`. Modificações subsequentes no arquivo de origem não serão sincronizadas automaticamente. Para atualizar, reinstale.

:::

#### Instalar Diretório Local Contendo Múltiplas Habilidades

Se a estrutura do seu diretório local for assim:

```
local-skills/
├── pdf-processor/SKILL.md
├── web-scraper/SKILL.md
└── git-helper/SKILL.md
```

Você pode instalar o diretório inteiro diretamente:

```bash
npx openskills install ./local-skills
```

Isso iniciará uma interface de seleção interativa, permitindo que você escolha quais habilidades instalar.

#### Formatos Suportados por Caminho Local (código fonte `install.ts:25-32`)

| Formato | Descrição | Exemplo |
|--- | --- | ---|
| `/absolute/path` | Caminho absoluto | `/home/user/skills/my-skill` |
| `./relative/path` | Caminho relativo ao diretório atual | `./local-skills/my-skill` |
| `../relative/path` | Caminho relativo ao diretório pai | `../shared-skills/common` |
| `~/path` | Caminho relativo ao diretório principal | `~/dev/my-skills` |

::: tip Dica de Desenvolvimento

Usar o atalho `~` permite referenciar rapidamente habilidades no diretório principal, adequado para ambientes de desenvolvimento pessoal.

:::

---

### Método 3: Instalar a partir de Repositório Git Privado

**Cenário aplicável**: Usar repositórios GitLab/Bitbucket internos da empresa, ou repositórios GitHub privados.

#### Método SSH (Recomendado)

```bash
npx openskills install git@github.com:owner/private-skills.git
```

**Exemplo**: Instalar a partir de repositório GitHub privado

```bash
npx openskills install git@github.com:my-org/internal-skills.git
```

**Você deverá ver**:

```
Installing from: git@github.com:my-org/internal-skills.git
Location: project (.claude/skills)

Cloning repository...
✓ Repository cloned

Found 3 skill(s)
? Select skills to install:
```

::: tip Configuração de Autenticação

O método SSH requer que você tenha configurado chaves SSH. Se a clonagem falhar, verifique:

```bash
# Testar conexão SSH
ssh -T git@github.com

# Se aparecer "Hi username! You've successfully authenticated...", a configuração está correta
```

:::

#### Método HTTPS (Requer Credenciais)

```bash
npx openskills install https://github.com/owner/private-skills.git
```

::: warning Autenticação HTTPS

Ao clonar repositórios privados via HTTPS, o Git solicitará nome de usuário e senha (ou Personal Access Token). Se você estiver usando autenticação de dois fatores, use um Personal Access Token em vez da senha da conta.

:::

#### Outras Plataformas de Hospedagem Git

**GitLab (SSH)**:

```bash
npx openskills install git@gitlab.com:owner/skills.git
```

**GitLab (HTTPS)**:

```bash
npx openskills install https://gitlab.com/owner/skills.git
```

**Bitbucket (SSH)**:

```bash
npx openskills install git@bitbucket.org:owner/skills.git
```

**Bitbucket (HTTPS)**:

```bash
npx openskills install https://bitbucket.org/owner/skills.git
```

::: tip Prática Recomendada

Para habilidades internas da equipe, recomenda-se usar repositórios Git privados, pois:
- Todos os membros podem instalar a partir da mesma fonte
- Ao atualizar habilidades, basta usar `openskills update`
- Facilita o gerenciamento de versões e controle de acesso

:::

#### Regras de Identificação de URL do Git (código fonte `install.ts:37-45`)

| Prefixo/Sufixo | Descrição | Exemplo |
|--- | --- | ---|
| `git@` | Protocolo SSH | `git@github.com:owner/repo.git` |
| `git://` | Protocolo Git | `git://github.com:owner/repo.git` |
| `http://` | Protocolo HTTP | `http://github.com/owner/repo.git` |
| `https://` | Protocolo HTTPS | `https://github.com/owner/repo.git` |
| Sufixo `.git` | Repositório Git (qualquer protocolo) | `owner/repo.git` |

---

## Ponto de Verificação ✅

Após completar esta lição, confirme:

- [ ] Sabe como instalar habilidades a partir de repositórios do GitHub (formato `owner/repo`)
- [ ] Sabe como instalar diretamente uma habilidade específica do repositório (`owner/repo/skill-name`)
- [ ] Sabe como usar caminhos locais para instalar habilidades (`./`, `~/`, etc.)
- [ ] Sabe como instalar habilidades a partir de repositórios Git privados (SSH/HTTPS)
- [ ] Compreende os cenários aplicáveis para diferentes fontes de instalação

---

## Avisos sobre Armadilhas

### Problema 1: Caminho Local Não Existe

**Sintoma**:

```
Error: Path does not exist: ./local-skills/my-skill
```

**Causa**:
- Erro de digitação no caminho
- Cálculo incorreto do caminho relativo

**Solução**:
1. Verifique se o caminho existe: `ls ./local-skills/my-skill`
2. Use caminho absoluto para evitar confusão com caminhos relativos

---

### Problema 2: Falha ao Clonar Repositório Privado

**Sintoma**:

```
✗ Failed to clone repository
fatal: repository 'git@github.com:owner/private-skills.git' does not appear to be a git repository
```

**Causa**:
- Chaves SSH não configuradas
- Sem permissão de acesso ao repositório
- Endereço do repositório incorreto

**Solução**:
1. Teste a conexão SSH: `ssh -T git@github.com`
2. Confirme que você tem permissão de acesso ao repositório
3. Verifique se o endereço do repositório está correto

::: tip Dica

Para repositórios privados, a ferramenta mostrará a seguinte mensagem (código fonte `install.ts:167`):

```
Tip: For private repos, ensure git SSH keys or credentials are configured
```

:::

---

### Problema 3: SKILL.md Não Encontrado no Subcaminho

**Sintoma**:

```
Error: SKILL.md not found at skills/my-skill
```

**Causa**:
- Subcaminho incorreto
- A estrutura de diretórios no repositório é diferente do esperado

**Solução**:
1. Primeiro instale o repositório inteiro sem subcaminho: `npx openskills install owner/repo`
2. Através da interface interativa, veja as habilidades disponíveis
3. Reinstale usando o subcaminho correto

---

### Problema 4: Erro de Reconhecimento do GitHub Shorthand

**Sintoma**:

```
Error: Invalid source format
Expected: owner/repo, owner/repo/skill-name, git URL, or local path
```

**Causa**:
- O formato não corresponde a nenhuma regra
- Erro de digitação (por exemplo, `owner / repo` com espaço no meio)

**Solução**:
- Verifique se o formato está correto (sem espaços, número correto de barras)
- Use a URL completa do Git em vez do shorthand

---

## Resumo da Lição

Nesta lição, você aprendeu:

- **Três fontes de instalação**: Repositório GitHub, caminho local, repositório Git privado
- **GitHub shorthand**: Dois formatos `owner/repo` e `owner/repo/skill-name`
- **Formatos de caminho local**: Caminho absoluto, caminho relativo, atalho de diretório principal
- **Instalação de repositórios privados**: Dois métodos SSH e HTTPS, formatos para diferentes plataformas
- **Lógica de identificação de fontes**: Como a ferramenta determina o tipo de fonte de instalação que você forneceu

**Comandos Essenciais em Referência Rápida**:

| Comando | Função |
|--- | ---|
| `npx openskills install owner/repo` | Instalar a partir de repositório GitHub (seleção interativa) |
| `npx openskills install owner/repo/skill-name` | Instalar diretamente uma habilidade específica do repositório |
| `npx openskills install ./local-skills/skill` | Instalar a partir de caminho local |
| `npx openskills install ~/dev/my-skills` | Instalar a partir do diretório principal |
| `npx openskills install git@github.com:owner/private-skills.git` | Instalar a partir de repositório Git privado |

---

## Previsão da Próxima Lição

> Na próxima lição, aprenderemos **[Instalação Global vs. Instalação Local do Projeto](../global-vs-project/)**.
>
> Você aprenderá:
> - A função da flag `--global` e local de instalação
> - Diferença entre instalação global e instalação local do projeto
> - Escolher o local de instalação apropriado conforme o cenário
> - Melhores práticas para compartilhar habilidades entre múltiplos projetos

As fontes de instalação são apenas uma parte do gerenciamento de habilidades. Em seguida, é necessário compreender como o local de instalação das habilidades afeta o projeto.

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Número da Linha |
|--- | --- | ---|
| Entrada do comando de instalação | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L83-L184) | 83-184 |
| Verificação de caminho local | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L25-L32) | 25-32 |
| Verificação de URL do Git | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L37-L45) | 37-45 |
| Parsing do GitHub shorthand | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L131-L143) | 131-143 |
| Instalação por caminho local | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L199-L226) | 199-226 |
| Clonagem de repositório Git | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L155-L169) | 155-169 |
| Mensagem de erro para repositório privado | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L167) | 167 |

**Funções Chave**:
- `isLocalPath(source)` - Determina se é um caminho local (linhas 25-32)
- `isGitUrl(source)` - Determina se é uma URL do Git (linhas 37-45)
- `installFromLocal()` - Instala habilidades a partir de caminho local (linhas 199-226)
- `installSpecificSkill()` - Instala habilidades de subcaminho especificado (linhas 272-316)
- `getRepoName()` - Extrai nome do repositório de uma URL do Git (linhas 50-56)

**Lógica Chave**:
1. Prioridade de julgamento de tipo de fonte: caminho local → URL do Git → GitHub shorthand (linhas 111-143)
2. GitHub shorthand suporta dois formatos: `owner/repo` e `owner/repo/skill-name` (linhas 132-142)
3. Ao falhar a clonagem de repositório privado, sugere configurar chaves SSH ou credenciais (linha 167)

</details>
