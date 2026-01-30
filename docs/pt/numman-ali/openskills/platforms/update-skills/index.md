---
title: "Atualizar Skills: Manter skills atualizadas | opencode-openskills"
sidebarTitle: "Atualizar skills com um clique"
subtitle: "Atualizar Skills: Manter skills atualizadas"
description: "Aprenda o comando OpenSkills update para atualizar skills instaladas. Suporta atualização em lote de todas as skills ou skills específicas, domine as diferenças entre atualizações de caminho local e repositório git, mantenha skills na versão mais recente."
tags:
  - "skills"
  - "update"
  - "git"
prerequisite:
  - "start-installation"
  - "start-first-skill"
order: 5
---

# Atualizar skills: manter skills sincronizadas com o repositório de origem

## O que você poderá fazer após concluir

Esta lição ensina como manter as skills do OpenSkills sempre na versão mais recente. Com o comando OpenSkills update, você poderá:

- Atualizar todas as skills instaladas com um clique
- Atualizar apenas algumas skills específicas
- Entender as diferenças de atualização de diferentes fontes de instalação
- Investigar causas de falhas de atualização

## O dilema que você enfrenta agora

Os repositórios de skills estão em constante atualização — os autores podem ter corrigido bugs, adicionado novos recursos, melhorado a documentação. Mas as skills que você instalou ainda estão na versão antiga.

Você já pode ter encontrado estas situações:
- A documentação da skill diz "suporta determinado recurso", mas seu agente de IA diz que não sabe
- A skill atualizou para mensagens de erro melhores, mas você ainda vê as antigas
- O bug na instalação foi corrigido, mas você ainda é afetado

**Excluir e reinstalar toda vez é muito problemático** — você precisa de uma maneira eficiente de atualizar.

## Quando usar esta técnica

Cenários típicos para usar o comando `update`:

| Cenário | Ação |
|--- | ---|
| Descobrir que a skill tem atualização | Executar `openskills update` |
| Atualizar apenas algumas skills | `openskills update skill1,skill2` |
| Testar skills em desenvolvimento local | Atualizar a partir de caminho local |
| Atualizar a partir do repositório GitHub | Clonar automaticamente o código mais recente via git |

::: tip Recomendação de frequência de atualização
- **Skills da comunidade**: atualize mensalmente para obter as melhorias mais recentes
- **Skills desenvolvidas por você**: atualize manualmente após cada modificação
- **Skills de caminho local**: atualize após cada alteração de código
:::

## 🎒 Preparativos antes de começar

Antes de começar, confirme que completou:

- [x] OpenSkills instalado (veja [Instalar OpenSkills](../../start/installation/))
- [x] Pelo menos uma skill instalada (veja [Instalar a primeira skill](../../start/first-skill/))
- [x] Se instalado a partir do GitHub, confirme que tem conexão com a internet

## Ideia central

O mecanismo de atualização do OpenSkills é muito simples:

**Registrar informações de origem durante cada instalação → copiar novamente da origem original ao atualizar**

::: info Por que precisa reinstalar?
Skills de versão antiga (instaladas sem registrar origem) não podem ser atualizadas. Nesse caso, é necessário reinstalar uma vez, o OpenSkills lembrará a origem e depois poderá atualizar automaticamente.
:::

**Métodos de atualização para três fontes de instalação**:

| Tipo de origem | Método de atualização | Cenário aplicável |
|--- | --- | ---|
| **Caminho local** | Copiar diretamente do caminho local | Desenvolver suas próprias skills |
| **Repositório git** | Clonar o código mais recente para um diretório temporário | Instalado a partir do GitHub/GitLab |
| **GitHub shorthand** | Converter para URL completo e clonar | Instalado a partir do repositório oficial do GitHub |

Durante a atualização, skills sem metadados de origem serão ignoradas e os nomes das skills que precisam ser reinstaladas serão listados.

## Siga comigo

### Etapa 1: Verificar skills instaladas

Primeiro, confirme quais skills podem ser atualizadas:

```bash
npx openskills list
```

**Você deverá ver**: lista de skills instaladas, incluindo nome, descrição e rótulo de localização (project/global)

### Etapa 2: Atualizar todas as skills

A maneira mais simples é atualizar todas as skills instaladas:

```bash
npx openskills update
```

**Você deverá ver**: atualizar skills uma por uma, cada skill mostra o resultado da atualização

```
✅ Updated: git-workflow
✅ Updated: check-branch-first
Skipped: my-old-skill (no source metadata; re-install once to enable updates)
Summary: 2 updated, 1 skipped (3 total)
```

::: details Significado de skills ignoradas
Se vir `Skipped: xxx (no source metadata)`, significa que esta skill foi instalada antes da função de atualização ser adicionada. É necessário reinstalar uma vez para habilitar a atualização automática.
:::

### Etapa 3: Atualizar skills específicas

Se você só deseja atualizar algumas skills específicas, passe os nomes das skills (separados por vírgula):

```bash
npx openskills update git-workflow,check-branch-first
```

**Você deverá ver**: apenas as duas skills especificadas foram atualizadas

```
✅ Updated: git-workflow
✅ Updated: check-branch-first
Summary: 2 updated, 0 skipped (2 total)
```

### Etapa 4: Atualizar skills em desenvolvimento local

Se você estiver desenvolvendo skills localmente, pode atualizar a partir do caminho local:

```bash
npx openskills update my-skill
```

**Você deverá ver**: a skill é copiada novamente do caminho local de instalação

```
✅ Updated: my-skill
Summary: 1 updated, 0 skipped (1 total)
```

::: tip Fluxo de trabalho de desenvolvimento local
Fluxo de desenvolvimento:
1. Instalar a skill: `openskills install ./my-skill`
2. Modificar o código
3. Atualizar a skill: `openskills update my-skill`
4. Sincronizar para AGENTS.md: `openskills sync`
:::

### Etapa 5: Lidar com falhas de atualização

Se algumas skills falharem ao atualizar, o OpenSkills mostrará motivos detalhados:

```bash
npx openskills update
```

**Situações que você pode ver**:

```
Skipped: git-workflow (git clone failed)
Skipped: my-skill (local source missing)
Missing source metadata (1): old-skill
Clone failed (1): git-workflow
```

**Métodos de resolução correspondentes**:

| Mensagem de erro | Causa | Método de resolução |
|--- | --- | ---|
| `no source metadata` | Instalação de versão antiga | Reinstalar: `openskills install <source>` |
| `local source missing` | Caminho local foi excluído | Restaurar o caminho local ou reinstalar |
| `SKILL.md missing at local source` | Arquivo local foi excluído | Restaurar o arquivo SKILL.md |
| `git clone failed` | Problema de rede ou repositório não existe | Verificar rede ou endereço do repositório |
| `SKILL.md not found in repo` | Estrutura do repositório mudou | Entrar em contato com o autor da skill ou atualizar o subpath |

## Ponto de verificação ✅

Confirme que você aprendeu:

- [ ] Consegue usar `openskills update` para atualizar todas as skills
- [ ] Consegue usar vírgulas para separar e atualizar skills específicas
- [ ] Entende o significado de skills "ignoradas" e métodos de resolução
- [ ] Conhece o fluxo de atualização de skills em desenvolvimento local

## Alertas de armadilhas

### ❌ Erros comuns

| Erro | Ação correta |
|--- | ---|
| Verificar ignoradas e não fazer nada | Reinstalar ou resolver problemas de acordo com as instruções |
| Excluir e reinstalar toda vez | Usar o comando `update` é mais eficiente |
| Não saber de onde a skill foi instalada | Usar `openskills list` para ver a origem |

### ⚠️ Atenção

**A atualização sobrescreverá modificações locais**

Se você modificou diretamente os arquivos de skills no diretório de instalação, essas modificações serão sobrescritas ao atualizar. A maneira correta é:
1. Modificar os **arquivos de origem** (caminho local ou repositório)
2. Em seguida, execute `openskills update`

**Skills de link simbólico precisam de tratamento especial**

Se a skill foi instalada via link simbólico (veja [Suporte a links simbólicos](../../advanced/symlink-support/)), a atualização recriará o link, não quebrará o relacionamento de link simbólico.

**Skills globais e do projeto precisam ser atualizadas separadamente**

```bash
# Atualizar apenas skills do projeto (padrão)
openskills update

# Atualizar skills globais precisa de tratamento separado
# Ou use o modo --universal para gerenciar uniformemente
```

## Resumo desta lição

Nesta lição, aprendemos a função de atualização do OpenSkills:

- **Atualização em lote**: `openskills update` atualiza todas as skills com um clique
- **Atualização específica**: `openskills update skill1,skill2` atualiza skills específicas
- **Sensibilidade à origem**: reconhece automaticamente caminhos locais e repositórios git
- **Prompts de erro**: explica detalhadamente os motivos de ignorar e métodos de resolução

A função de atualização mantém as skills na versão mais recente, garantindo que as skills que você usa sempre contenham as melhorias e correções mais recentes.

## Próxima lição

> Na próxima lição aprenderemos **[Remover skills](../remove-skills/)**
>
> Você aprenderá:
> - Como usar o comando interativo `manage` para remover skills
> - Como usar o comando `remove` para remover por script
> - Precauções após remover skills

---

## Apêndice: Referência do código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Última atualização: 2026-01-24

| Funcionalidade | Caminho do arquivo | Linhas |
|--- | --- | ---|
| Lógica principal de atualização de skills | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L14-L150) | 14-150 |
| Atualização de caminho local | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L64-L82) | 64-82 |
| Atualização de repositório git | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L85-L125) | 85-125 |
| Copiar skill do diretório | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L152-L163) | 152-163 |
| Verificação de segurança de caminho | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L165-L172) | 165-172 |
| Definição de estrutura de metadados | [`src/utils/skill-metadata.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-metadata.ts#L8-L15) | 8-15 |
| Ler metadados de skill | [`src/utils/skill-metadata.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-metadata.ts#L17-L27) | 17-27 |
| Escrever metadados de skill | [`src/utils/skill-metadata.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-metadata.ts#L29-L36) | 29-36 |
| Definição de comando CLI | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L58-L62) | 58-62 |

**Constantes principais**:
- `SKILL_METADATA_FILE = '.openskills.json'`: nome do arquivo de metadados, registra a origem de instalação da skill

**Funções principais**:
- `updateSkills(skillNames)`: função principal para atualizar skills específicas ou todas
- `updateSkillFromDir(targetPath, sourceDir)`: copiar skill do diretório de origem para o diretório de destino
- `isPathInside(targetPath, targetDir)`: verificar segurança do caminho de instalação (prevenir travessia de caminho)
- `readSkillMetadata(skillDir)`: ler metadados da skill
- `writeSkillMetadata(skillDir, metadata)`: escrever/atualizar metadados da skill

**Regras de negócio**:
- **BR-5-1**: atualizar todas as skills instaladas por padrão (update.ts:37-38)
- **BR-5-2**: suportar lista de nomes de skills separados por vírgula (update.ts:15)
- **BR-5-3**: ignorar skills sem metadados de origem (update.ts:56-62)
- **BR-5-4**: suportar atualização de caminho local (update.ts:64-82)
- **BR-5-5**: suportar atualização a partir de repositório git (update.ts:85-125)
- **BR-5-6**: verificar segurança de caminho (update.ts:156-162)

</details>
