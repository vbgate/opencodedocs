---
title: "Visualização Diff: Revisar Alterações de Múltiplos Ângulos | Plannotator"
sidebarTitle: "Alternar entre 5 tipos de visualização diff"
subtitle: "Visualização Diff: Revisar Alterações de Múltiplos Ângulos"
description: "Aprenda a alternar entre tipos de diff no code review do Plannotator. Selecione visualizações uncommitted, staged, last commit ou branch no menu suspenso para revisar alterações de código de múltiploslos ângulos."
tags:
  - "code-review"
  - "git"
  - "diff"
  - "tutorial"
prerequisite:
  - "code-review-basics"
order: 6
---

# Alternar Visualização Diff

## O Que Você Será Capaz de Fazer

Ao fazer code review, você poderá:
- Alternar rapidamente entre 5 tipos de visualização diff usando o menu suspenso
- Entender o escopo de alterações de código exibido em cada visualização
- Escolher o tipo de diff apropriado com base nas necessidades de revisão
- Evitar perder alterações importantes por selecionar a visualização errada

## Seu Problema Atual

**Ao revisar, você só vê a área de trabalho e perde arquivos já staged**:

Você executa o comando `/plannotator-review`, vê algumas alterações de código e adiciona alguns comentários. Mas após o commit, descobre que a revisão perdeu os arquivos que já foram `git add` para a área de staging—esses arquivos simplesmente não apareceram no diff.

**Quer ver as diferenças gerais entre o branch atual e o branch main**:

Você está desenvolvendo em um branch feature por algumas semanas e quer ver o que mudou no total, mas a visualização padrão de "alterações não commitadas" só mostra as modificações dos últimos dias.

**Quer comparar as diferenças entre dois commits específicos**:

Você quer confirmar se uma correção de bug está correta e precisa comparar o código antes e depois da correção, mas não sabe como fazer o Plannotator mostrar o diff de commits históricos.

## Quando Usar Esta Técnica

- **Ao fazer revisão completa**: Verificar alterações da área de trabalho e da área de staging simultaneamente
- **Antes de mesclar branches**: Verificar todas as alterações do branch atual em relação a main/master
- **Ao revisar rollback**: Confirmar quais arquivos foram alterados no último commit
- **Ao colaborar em equipe**: Verificar código que colegas staged mas ainda não commitaram

## Ideia Central

O comando Git diff tem muitas variantes, cada uma exibindo um escopo diferente de código. O Plannotator centraliza essas variantes em um menu suspenso, para que você não precise memorizar comandos git complexos.

::: info Referência Rápida de Tipos de Diff Git

| Tipo de diff | Escopo exibido | Cenário típico de uso |
|--- | --- | ---|
| Uncommitted changes | Área de trabalho + Área de staging | Revisar todas as modificações deste desenvolvimento |
| Staged changes | Apenas área de staging | Revisar conteúdo preparado para commit antes de commitar |
| Unstaged changes | Apenas área de trabalho | Revisar modificações ainda não `git add` |
| Last commit | Commit mais recente | Revisar commit anterior ou fazer rollback |
| vs main | Branch atual vs branch padrão | Verificação completa antes de mesclar branch |

:::

As opções do menu suspenso mudam dinamicamente com base no seu estado Git:
- Se você não está no branch padrão, a opção "vs main" será exibida
- Se não houver arquivos staged, a visualização Staged mostrará "No staged changes"

## Siga os Passos

### Passo 1: Iniciar Code Review

**Por que**

É necessário abrir primeiro a interface de code review do Plannotator.

**Operação**

Execute no terminal:

```bash
/plannotator-review
```

**O que você deve ver**

O navegador abriu a página de code review, acima da árvore de arquivos à esquerda há um menu suspenso mostrando o tipo de diff atual (geralmente "Uncommitted changes").

### Passo 2: Alternar para Visualização Staged

**Por que**

Ver arquivos que já foram `git add` mas ainda não foram commitados.

**Operação**

1. Clique no menu suspenso acima da árvore de arquivos à esquerda
2. Selecione "Staged changes"

**O que você deve ver**

- Se houver arquivos staged, a árvore de arquivos mostrará esses arquivos
- Se não houver arquivos staged, a área principal mostrará: "No staged changes. Stage some files with git add."

### Passo 3: Alternar para Visualização Last Commit

**Por que**

Revisar o código que acabou de ser commitado, confirmando que não há problemas.

**Operação**

1. Abra o menu suspenso novamente
2. Selecione "Last commit"

**O que você deve ver**

- Exibe todos os arquivos modificados no commit mais recente
- O conteúdo do diff é a diferença entre `HEAD~1..HEAD`

### Passo 4: Alternar para Visualização vs main (se disponível)

**Por que**

Ver todas as alterações do branch atual em relação ao branch padrão.

**Operação**

1. Verifique se há uma opção "vs main" ou "vs master" no menu suspenso
2. Se houver, selecione-a

**O que você deve ver**

- A árvore de arquivos mostra todos os arquivos diferentes entre o branch atual e o branch padrão
- O conteúdo do diff são as alterações completas de `main..HEAD`

::: tip Verificar Branch Atual

Se você não vir a opção "vs main", significa que está no branch padrão. Você pode usar o seguinte comando para ver o branch atual:

```bash
git rev-parse --abbrev-ref HEAD
```

Tente novamente após alternar para um branch feature:

```bash
git checkout feature-branch
```

:::

## Ponto de Verificação ✅

Confirme que você dominou:

- [ ] Consegue encontrar e abrir o menu suspenso de tipos de diff
- [ ] Entende a diferença entre "Uncommitted", "Staged" e "Last commit"
- [ ] Consegue identificar quando a opção "vs main" aparece
- [ ] Sabe qual tipo de diff usar em qual cenário

## Cuidado com Armadilhas

### Armadilha 1: Ao revisar, só vê Uncommitted e perde arquivos Staged

**Sintoma**

Após o commit, descobre que a revisão perdeu alguns arquivos já staged.

**Causa**

A visualização Uncommitted mostra todas as alterações da área de trabalho e da área de staging (`git diff HEAD`), então arquivos já staged também serão incluídos.

**Solução**

Antes da revisão, alterne para a visualização Staged para verificar uma vez, ou use a visualização Uncommitted (que inclui a área de staging).

### Armadilha 2: Não comparou com main antes de mesclar branch

**Sintoma**

Após mesclar com main, descobre que introduziu modificações não relacionadas.

**Causa**

Só viu os commits dos últimos dias, não comparou a diferença do branch inteiro em relação a main.

**Solução**

Antes de mesclar, faça a verificação completa usando a visualização "vs main".

### Armadilha 3: Acha que alternar visualização perde comentários

**Sintoma**

Não ousa alternar o tipo de diff, preocupado que os comentários adicionados anteriormente desapareçam.

**Causa**

Mal-entendido do mecanismo de alternância.

**Situação Real**

Ao alternar o tipo de diff, o Plannotator preserva os comentários anteriores—eles ainda podem ser aplicáveis, ou você pode excluir manualmente comentários não relacionados.

## Resumo da Lição

Os 5 tipos de diff suportados pelo Plannotator:

| Tipo | Comando Git | Cenário |
|--- | --- | ---|
| Uncommitted | `git diff HEAD` | Revisar todas as modificações deste desenvolvimento |
| Staged | `git diff --staged` | Revisar área de staging antes de commitar |
| Unstaged | `git diff` | Revisar modificações da área de trabalho |
| Last commit | `git diff HEAD~1..HEAD` | Fazer rollback ou revisar commit recente |
| vs main | `git diff main..HEAD` | Verificação completa antes de mesclar branch |

Alternar visualizações não perde comentários, você pode ver o mesmo lote ou novos comentários de diferentes perspectivas.

## Próxima Lição

> Na próxima lição, aprenderemos **[Compartilhamento de URL](../../advanced/url-sharing/)**.
>
> Você aprenderá:
> - Como compactar o conteúdo de revisão em uma URL para compartilhar com colegas
> - Como o destinatário abre o link de revisão compartilhado
> - Limitações e considerações no modo de compartilhamento

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código-fonte</strong></summary>

> Última atualização: 2026-01-24

| Funcionalidade | Caminho do arquivo | Número da linha |
|--- | --- | ---|
| Definição de tipos de Diff | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L10-L15) | 10-15 |
| Obtenção de contexto Git | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L79-L96) | 79-96 |
| Execução de Git Diff | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L101-L147) | 101-147 |
| Tratamento de alternância de Diff | [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx#L300-L331) | 300-331 |
| Renderização de opções Diff na árvore de arquivos | [`packages/review-editor/components/FileTree.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/FileTree.tsx) | - |

**Tipos principais**:

- `DiffType`: `'uncommitted' | 'staged' | 'unstaged' | 'last-commit' | 'branch'`

**Funções principais**:

- `getGitContext()`: Obtém branch atual, branch padrão e opções de diff disponíveis
- `runGitDiff(diffType, defaultBranch)`: Executa o comando git correspondente com base no tipo de diff

**APIs principais**:

- `POST /api/diff/switch`: Alterna tipo de diff, retorna novos dados de diff

</details>
