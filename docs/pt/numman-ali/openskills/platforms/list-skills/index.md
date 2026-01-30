---
title: "Comando list: Listar Skills | OpenSkills"
sidebarTitle: "Inventariar Skills Instaladas"
subtitle: "Comando list: Listar Skills"
description: "Aprenda a usar o comando list do OpenSkills. Veja todas as skills instaladas, entenda a diferença entre as tags project e global e as regras de prioridade, localize rapidamente as skills disponíveis."
tags:
  - "Gerenciamento de Skills"
  - "Uso de Comandos"
  - "CLI"
prerequisite:
  - "start-installation"
  - "start-first-skill"
order: 4
---

# Listar Skills Instaladas

## O Que Você Poderá Fazer Após Este Tutorial

- Usar `openskills list` para ver todas as skills instaladas
- Entender a diferença entre as tags de localização `(project)` e `(global)`
- Contar rapidamente a quantidade de skills de projeto e globais
- Verificar se uma skill foi instalada com sucesso

## O Dilema Atual

Depois de instalar algumas skills, você pode encontrar esses problemas:

- "Quais skills eu acabei de instalar? Esqueci"
- "Essa skill foi instalada no projeto ou globalmente?"
- "Por que algumas skills são visíveis no projeto A, mas não no projeto B?"
- "Quero excluir algumas skills que não uso, mas não sei os nomes específicos"

O comando `openskills list` foi criado para resolver essas dúvidas — ele funciona como um "catálogo" de skills, ajudando você a ver todas as skills instaladas e suas localizações de forma clara.

## Quando Usar Este Comando

| Cenário | Ação |
| --- | --- |
| Confirmar se a instalação da skill foi bem-sucedida | Execute `openskills list` para ver se a skill aparece |
| Mudar para um novo projeto e verificar skills disponíveis | Execute `openskills list` para ver quais skills de projeto estão disponíveis |
| Inventariar skills antes da limpeza | Execute `openskills list` para listar todas as skills, depois exclua as desnecessárias |
| Depurar problemas de carregamento de skills | Confirme se o nome da skill e a localização da instalação estão corretos |

## Conceito Principal

O OpenSkills suporta a instalação de skills em **4 localizações** (por ordem de prioridade de busca):

1. **project .agent/skills** — Diretório de skills genéricas de nível de projeto (ambiente multi-agente)
2. **global .agent/skills** — Diretório de skills genéricas de nível global (ambiente multi-agente)
3. **project .claude/skills** — Diretório de skills do Claude Code de nível de projeto
4. **global .claude/skills** — Diretório de skills do Claude Code de nível global

O `openskills list` vai:

1. Percorrer esses 4 diretórios para encontrar todas as skills
2. **Remover duplicatas**: o mesmo nome de skill só é exibido uma vez (priorizando o project)
3. **Ordenar**: skills de projeto primeiro, depois globais; dentro da mesma localização, por ordem alfabética
4. **Marcar localização**: usar as tags `(project)` e `(global)` para distinguir
5. **Resumo estatístico**: mostrar a contagem de skills de projeto, globais e total

::: info Por que remover duplicatas?
Se você instalar a mesma skill no projeto e globalmente (por exemplo, `pdf`), o OpenSkills usará preferencialmente a versão do projeto. list só exibe uma vez para evitar confusão.
:::

## Siga Comigo

### Passo 1: Listar Todas as Skills Instaladas

**Por quê**
Ver rapidamente quais skills estão disponíveis no ambiente atual

Execute o seguinte comando:

```bash
npx openskills list
```

**O Que Você Deve Ver**

Se nenhuma skill estiver instalada, será exibido:

```
Available Skills:

No skills installed.

Install skills:
  npx openskills install anthropics/skills         # Project (default)
  npx openskills install owner/skill --global     # Global (advanced)
```

Se skills já estiverem instaladas, você verá algo como:

```
Available Skills:

  pdf                         (project)
    Comprehensive PDF manipulation toolkit for extracting text and tables...

  code-analyzer                (project)
    Static code analysis tool for identifying security vulnerabilities...

  email-reader                 (global)
    Read email content and attachments via IMAP protocol...

Summary: 2 project, 1 global (3 total)
```

### Passo 2: Entender o Formato de Saída

**Por quê**
Saber o que cada linha representa para localizar rapidamente as informações necessárias

Explicação do formato de saída:

| Parte | Descrição |
| --- | --- |
| `pdf` | Nome da skill (extraído do campo name do SKILL.md) |
| `(project)` | Tag de localização: azul indica skill de nível de projeto, cinza indica skill global |
| `Comprehensive PDF...` | Descrição da skill (extraída do campo description do SKILL.md) |
| `Summary: 2 project, 1 global (3 total)` | Resumo estatístico: contagem de skills de projeto, globais e total |

### Passo 3: Verificar as Tags de Localização

**Por quê**
Confirmar se a skill foi instalada na localização esperada, evitando a dúvida "por que não vejo essa skill neste projeto"

Tente as seguintes operações para entender as tags de localização:

```bash
# 1. Instalar uma skill de nível de projeto
npx openskills install anthropics/skills -y

# 2. Verificar a lista (deve exibir a tag project)
npx openskills list

# 3. Instalar uma skill global
npx openskills install anthropics/skills --global -y

# 4. Verificar a lista novamente (duas skills pdf, exibida apenas uma vez, com tag project)
npx openskills list
```

**O Que Você Deve Ver**

```
Available Skills:

  pdf                         (project)
    Comprehensive PDF manipulation toolkit for extracting text...

Summary: 1 project, 0 global (1 total)
```

Mesmo que a mesma skill seja instalada globalmente e no projeto, o comando list só a exibirá uma vez, porque a versão do projeto tem prioridade mais alta.

## Ponto de Verificação ✅

Confirme o seguinte conteúdo:

- [ ] Executar `openskills list` para ver a lista de skills instaladas
- [ ] Conseguir distinguir as tags `(project)` e `(global)` (cores diferentes: azul vs cinza)
- [ ] Os números estatísticos do Summary estão corretos (número de skills de projeto + número de skills globais = total)
- [ ] Entender a regra de que o mesmo nome de skill só é exibido uma vez

## Alertas de Armadilhas Comuns

### Problema Comum 1: Não Encontra a Skill Recém-Instalada

**Fenômeno**: O comando `install` é executado com sucesso, mas `list` não a mostra

**Passos de Diagnóstico**:

1. Verifique se está no diretório correto do projeto (skills de projeto só são visíveis para o projeto atual)
2. Confirme se foi instalado globalmente (usando a flag `--global`)
3. Verifique a localização da instalação:

```bash
# Verificar diretório do projeto
ls -la .claude/skills/

# Verificar diretório global
ls -la ~/.claude/skills/
```

### Problema Comum 2: Ver Nomes de Skills Estranhos

**Fenômeno**: O nome da skill não é o esperado (por exemplo, nome da pasta vs name no SKILL.md)

**Causa**: O OpenSkills usa o campo `name` do SKILL.md como o nome da skill, não o nome da pasta

**Solução**: Verifique o frontmatter do SKILL.md:

```yaml
---
name: pdf  # Este é o nome exibido pelo comando list
description: Comprehensive PDF manipulation toolkit...
---
```

### Problema Comum 3: Descrição Incompleta

**Fenômeno**: A descrição da skill está truncada

**Causa**: Isso é uma limitação da largura do terminal e não afeta o conteúdo da skill

**Solução**: Verifique diretamente o arquivo SKILL.md para obter a descrição completa

## Resumo da Aula

O `openskills list` é o comando "catálogo" do gerenciamento de skills, ajudando você a:

- 📋 **Ver todas as skills**: Ver todas as skills instaladas de forma clara
- 🏷️ **Distinguir tags de localização**: `(project)` indica nível de projeto, `(global)` indica nível global
- 📊 **Resumo estatístico**: Entender rapidamente a contagem de skills de projeto e globais
- 🔍 **Diagnosticar problemas**: Verificar se a skill foi instalada com sucesso e localizar a posição da skill

Regras principais:

1. O mesmo nome de skill só é exibido uma vez (prioridade do projeto)
2. Skills de projeto primeiro, depois globais
3. Dentro da mesma localização, ordenadas alfabeticamente

## Próxima Aula

> Na próxima aula aprenderemos **[Atualizar Skills](../update-skills/)**.
>
> Você aprenderá:
> - Como atualizar skills instaladas do repositório fonte
> - Atualização em lote de todas as skills
> - Lidar com skills antigas sem metadados

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Número da Linha |
| --- | --- | ---|
| Implementação do comando list | [`src/commands/list.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/list.ts) | 7-43 |
| Encontrar todas as skills | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 30-64 |
| Configuração de diretórios de busca | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts) | 18-25 |
| Definição do tipo Skill | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts) | 1-6 |

**Funções Principais**:
- `listSkills()`: Lista todas as skills instaladas, formata a saída
- `findAllSkills()`: Percorre 4 diretórios de busca, coleta todas as skills
- `getSearchDirs()`: Retorna 4 caminhos de diretórios de busca (por prioridade)

**Constantes Principais**:
- Nenhuma (os caminhos dos diretórios de busca são calculados dinamicamente)

**Lógica Principal**:
1. **Mecanismo de desduplicação**: Usa `Set` para registrar nomes de skills já processados (skills.ts:32-33, 43, 57)
2. **Julgamento de localização**: Determina se é um diretório de projeto através de `dir.includes(process.cwd())` (skills.ts:48)
3. **Regra de ordenação**: Projeto tem prioridade, mesma localização por ordem alfabética (list.ts:21-26)

</details>
