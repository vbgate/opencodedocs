---
title: "Conceitos Principais: Ecossistema de Skills Unificado | OpenSkills"
sidebarTitle: "Compartilhar Skills entre Ferramentas de IA"
subtitle: "Conceitos Principais: Ecossistema de Skills Unificado | OpenSkills"
description: "Aprenda os conceitos principais e o funcionamento do OpenSkills. Como um carregador de skills unificado, suporta compartilhamento de skills entre múltiplos agentes, com carregamento progressivo."
tags:
  - "Introdução de Conceitos"
  - "Conceitos Principais"
prerequisite: []
order: 2
---

# O que é o OpenSkills?

## O que você poderá fazer após concluir

- Compreender o valor principal e o funcionamento do OpenSkills
- Saber a relação entre OpenSkills e Claude Code
- Avaliar quando usar o OpenSkills em vez do sistema de skills integrado
- Entender como fazer múltiplos agentes de codificação de IA compartilharem um ecossistema de skills

::: info Pré-requisitos
Este tutorial assume que você conhece ferramentas básicas de codificação com IA (como Claude Code, Cursor, etc.), mas não requer nenhuma experiência prévia com OpenSkills.
:::

---

## O dilema que você enfrenta agora

Você pode encontrar estes cenários:

- **Skills que funcionam bem no Claude Code desaparecem quando você muda de ferramenta de IA**: por exemplo, skills de processamento de PDF do Claude Code não funcionam no Cursor
- **Instalação repetida de skills em ferramentas diferentes**: cada ferramenta de IA precisa de configuração de skills separada, com alto custo de gerenciamento
- **Quer usar skills privadas, mas o Marketplace oficial não suporta**: skills desenvolvidas internamente ou por você não podem ser compartilhadas facilmente com a equipe

Esses problemas são essencialmente: **formatos de skills não unificados, impossibilitando o compartilhamento entre ferramentas**.

---

## Ideia central: formato de skills unificado

A ideia central do OpenSkills é simples: **transformar o sistema de skills do Claude Code em um carregador de skills universal**.

### O que é

**OpenSkills** é um carregador universal do sistema de skills da Anthropic, permitindo que qualquer agente de codificação de IA (Claude Code, Cursor, Windsurf, Aider, etc.) use skills no formato padrão SKILL.md.

Em resumo: **um instalador, servindo todas as ferramentas de codificação com IA**.

### Que problemas ele resolve

| Problema | Solução |
| --- | --- |
| Formatos de skills não unificados | Usar o formato padrão SKILL.md do Claude Code |
| Skills não podem ser compartilhadas entre ferramentas | Gerar AGENTS.md unificado, legível por todas as ferramentas |
| Gerenciamento de skills disperso | Comandos unificados para instalar, atualizar e remover |
| Dificuldade em compartilhar skills privadas | Suporte para instalar de caminhos locais e repositórios git privados |

---

## Valor principal

O OpenSkills oferece os seguintes valores principais:

### 1. Padrão unificado

Todos os agentes usam o mesmo formato de skills e descrição AGENTS.md, sem necessidade de aprender novos formatos.

- **Totalmente compatível com Claude Code**: mesmo formato de prompts, mesmo Marketplace, mesma estrutura de pastas
- **SKILL.md padronizado**: definição de skills clara, fácil de desenvolver e manter

### 2. Carregamento progressivo

Carrega skills sob demanda, mantendo o contexto da IA enxuto.

- Não precisa carregar todas as skills de uma vez
- O agente de IA carrega dinamicamente as skills relevantes conforme a tarefa
- Evita explosão de contexto, melhorando a qualidade das respostas

### 3. Suporte a múltiplos agentes

Um conjunto de skills serve vários agentes, sem necessidade de instalação repetida.

- Claude Code, Cursor, Windsurf, Aider compartilham o mesmo conjunto de skills
- Interface unificada de gerenciamento de skills
- Reduz custos de configuração e manutenção

### 4. Amigável ao código aberto

Suporta caminhos locais e repositórios git privados, adequado para colaboração em equipe.

- Instalar skills do sistema de arquivos local (em desenvolvimento)
- Instalar de repositórios git privados (compartilhamento interno da empresa)
- Skills podem ser versionados junto com o projeto

### 5. Execução local

Sem upload de dados, privacidade e segurança garantidas.

- Todos os arquivos de skills são armazenados localmente
- Não depende de serviços em nuvem, sem risco de vazamento de dados
- Adequado para projetos sensíveis e ambientes corporativos

---

## Como funciona

O fluxo de trabalho do OpenSkills é simples, dividido em três etapas:

### Etapa 1: Instalar skills

Instale skills do GitHub, caminho local ou repositório git privado no seu projeto.

```bash
# Instalar do repositório oficial da Anthropic
openskills install anthropics/skills

# Instalar de caminho local
openskills install ./my-skills
```

As skills serão instaladas no diretório `.claude/skills/` do projeto (padrão), ou no diretório `.agent/skills/` (ao usar `--universal`).

### Etapa 2: Sincronizar para AGENTS.md

Sincronize as skills instaladas para o arquivo AGENTS.md, gerando uma lista de skills legível pelo agente de IA.

```bash
openskills sync
```

O AGENTS.md conterá XML similar a este:

```xml
<available_skills>
<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables...</description>
<location>project</location>
</skill>
</available_skills>
```

### Etapa 3: Agente de IA carrega as skills

Quando o agente de IA precisa usar uma skill, carrega o conteúdo da skill através do seguinte comando:

```bash
openskills read <skill-name>
```

O agente de IA carrega dinamicamente o conteúdo da skill no contexto e executa a tarefa.

---

## Relação com Claude Code

OpenSkills e Claude Code têm uma relação complementar, não de substituição.

### Formato totalmente compatível

| Aspecto | Claude Code | OpenSkills |
| --- | --- | --- |
| **Formato de prompts** | XML `<available_skills>` | Mesmo XML |
| **Armazenamento de skills** | `.claude/skills/` | `.claude/skills/` (padrão) |
| **Chamada de skills** | Ferramenta `Skill("name")` | `npx openskills read <name>` |
| **Marketplace** | Marketplace da Anthropic | GitHub (anthropics/skills) |
| **Carregamento progressivo** | ✅ | ✅ |

### Comparação de cenários de uso

| Cenário | Ferramenta recomendada | Motivo |
| --- | --- | --- |
| Usar apenas Claude Code | Sistema integrado do Claude Code | Sem necessidade de instalação adicional, suporte oficial |
| Usar múltiplas ferramentas de IA | OpenSkills | Gerenciamento unificado, evita repetição |
| Precisa de skills privadas | OpenSkills | Suporta repositórios locais e privados |
| Colaboração em equipe | OpenSkills | Skills podem ser versionadas, fáceis de compartilhar |

---

## Explicação dos locais de instalação

O OpenSkills suporta três locais de instalação:

| Local de instalação | Comando | Cenário aplicável |
| --- | --- | --- |
| **Local do projeto** | Padrão | Uso em projeto individual, skills versionadas com o projeto |
| **Instalação global** | `--global` | Compartilhar skills comuns entre todos os projetos |
| **Modo Universal** | `--universal` | Ambiente multi-agente, evita conflito com Claude Code |

::: tip Quando usar o modo Universal?
Se você usa Claude Code e outros agentes de codificação (como Cursor, Windsurf) simultaneamente, use `--universal` para instalar em `.agent/skills/`, permitindo que múltiplos agentes compartilhem o mesmo conjunto de skills, evitando conflitos.
:::

---

## Ecossistema de skills

O OpenSkills usa o mesmo ecossistema de skills do Claude Code:

### Biblioteca de skills oficial

Repositório de skills mantido oficialmente pela Anthropic: [anthropics/skills](https://github.com/anthropics/skills)

Inclui skills comuns:
- Processamento de PDF
- Geração de imagens
- Análise de dados
- E mais...

### Skills da comunidade

Qualquer repositório GitHub pode ser uma fonte de skills, desde que contenha um arquivo SKILL.md.

### Skills personalizadas

Você pode criar suas próprias skills, usando o formato padrão, e compartilhar com a equipe.

---

## Resumo desta lição

A ideia central do OpenSkills é:

1. **Padrão unificado**: usar o formato SKILL.md do Claude Code
2. **Suporte a múltiplos agentes**: permitir que todas as ferramentas de codificação com IA compartilhem o ecossistema de skills
3. **Carregamento progressivo**: carregar sob demanda, mantendo o contexto enxuto
4. **Execução local**: sem upload de dados, privacidade e segurança garantidas
5. **Amigável ao código aberto**: suporta repositórios locais e privados

Com o OpenSkills, você pode:
- Alternar entre diferentes ferramentas de IA sem problemas
- Gerenciar todas as skills de forma unificada
- Usar e compartilhar skills privadas
- Aumentar a eficiência do desenvolvimento

---

## Próxima lição

> Na próxima lição aprenderemos **[Instalar a ferramenta OpenSkills](../../instalacao/)**
>
> Você aprenderá:
> - Como verificar o ambiente Node.js e Git
> - Usar npx ou instalar o OpenSkills globalmente
> - Verificar se a instalação foi bem-sucedida
> - Resolver problemas comuns de instalação

---

## Apêndice: Referência do código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Última atualização: 2026-01-24

| Funcionalidade | Caminho do arquivo | Linhas |
| --- | --- | --- |
| Definições de tipos principais | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L1-L24) | 1-24 |
| Interface Skill | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L1-L6) | 1-6 |
| Interface SkillLocation | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L8-L12) | 8-12 |
| Interface InstallOptions | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L14-L18) | 14-18 |
| Interface SkillMetadata | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L20-L24) | 20-24 |

**Interfaces principais**:
- `Skill`: informações da skill instalada (name, description, location, path)
- `SkillLocation`: informações de localização da skill (path, baseDir, source)
- `InstallOptions`: opções do comando de instalação (global, universal, yes)
- `SkillMetadata`: metadados da skill (name, description, context)

**Fonte dos conceitos principais**:
- README.md:22-86 - Capítulo "What Is OpenSkills?"

</details>
