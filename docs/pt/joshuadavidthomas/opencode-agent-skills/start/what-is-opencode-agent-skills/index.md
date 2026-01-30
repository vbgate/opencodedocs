---
title: "Introdução: OpenCode Agent Skills | opencode-agent-skills"
sidebarTitle: "Faça a IA Entender Suas Skills"
subtitle: "Introdução: OpenCode Agent Skills"
description: "Aprenda os valores e funcionalidades principais do OpenCode Agent Skills. Domine recursos como descoberta dinâmica de skills, injeção de contexto, compressão e recuperação, com compatibilidade Claude Code e recomendações automáticas."
tags:
  - "Guia de Introdução"
  - "Introdução ao Plugin"
prerequisite: []
order: 1
---

# O que é o OpenCode Agent Skills?

## O Que Você Aprenderá

- Entender os valores principais do plugin OpenCode Agent Skills
- Dominar os principais recursos e funcionalidades do plugin
- Compreender como as skills são descobertas e carregadas automaticamente
- Distinguir este plugin de outras soluções de gerenciamento de skills

## Seus Desafios Atuais

Você pode ter encontrado estas situações:

- **Skills dispersas e difíceis de gerenciar**: Skills espalhadas entre projetos, diretórios de usuário, cache de plugins e outros locais, tornando difícil encontrar a skill correta
- **Problemas com sessões longas**: Após sessões prolongadas, skills carregadas anteriormente se tornam inválidas devido à compressão de contexto
- **Ansiedade de compatibilidade**: Preocupação com a incompatibilidade de skills e plugins existentes após migrar do Claude Code
- **Configuração repetitiva**: Necessidade de reconfigurar skills para cada projeto, com falta de um mecanismo de gerenciamento unificado

Estes problemas estão afetando sua eficiência no uso de assistentes de IA.

## Conceito Central

**OpenCode Agent Skills** é um sistema de plugins que fornece capacidade de descoberta e gerenciamento dinâmico de skills para o OpenCode.

::: info O que é uma Skill?
Uma skill (habilidade) é um módulo reutilizável que contém instruções de fluxo de trabalho de IA. Geralmente é um diretório contendo um arquivo `SKILL.md` (descrevendo a funcionalidade e método de uso da skill), juntamente com arquivos auxiliares possíveis (documentação, scripts, etc.).
:::

**Valor Principal**: Através da padronização do formato de skills (SKILL.md), possibilita a reutilização de skills entre projetos e sessões.

### Arquitetura Técnica

O plugin é desenvolvido com TypeScript + Bun + Zod, fornecendo 4 ferramentas principais:

| Ferramenta | Função |
|---|---|
| `use_skill` | Injeta o conteúdo do SKILL.md da skill no contexto da sessão |
| `read_skill_file` | Lê arquivos de suporte no diretório da skill (documentação, configurações, etc.) |
| `run_skill_script` | Executa scripts executáveis no contexto do diretório da skill |
| `get_available_skills` | Obtém a lista de skills disponíveis atualmente |

## Principais Recursos e Funcionalidades

### 1. Descoberta Dinâmica de Skills

O plugin descobre skills automaticamente de múltiplos locais, ordenados por prioridade:

```
1. .opencode/skills/              (nível de projeto - OpenCode)
2. .claude/skills/                (nível de projeto - Claude Code)
3. ~/.config/opencode/skills/     (nível de usuário - OpenCode)
4. ~/.claude/skills/              (nível de usuário - Claude Code)
5. ~/.claude/plugins/cache/        (cache de plugins)
6. ~/.claude/plugins/marketplaces/ (plugins instalados)
```

**Regra**: A primeira skill correspondente é aplicada, skills subsequentes com o mesmo nome são ignoradas.

> Por que este design?
>
> Skills em nível de projeto têm prioridade sobre skills em nível de usuário, permitindo que você customize comportamentos específicos em projetos sem afetar a configuração global.

### 2. Injeção de Contexto

Quando você chama `use_skill`, o conteúdo da skill é injetado no contexto da sessão em formato XML:

- `noReply: true` - A IA não responderá à mensagem injetada
- `synthetic: true` - Marcada como mensagem gerada pelo sistema (não exibida na UI, não contada como entrada do usuário)

Isso significa que o conteúdo da skill persiste no contexto da sessão; mesmo quando a sessão cresce e a compressão de contexto ocorre, a skill permanece disponível.

### 3. Mecanismo de Compressão e Recuperação

Quando o OpenCode executa compressão de contexto (operação comum em sessões longas), o plugin escuta o evento `session.compacted` e reinjeta automaticamente a lista de skills disponíveis.

Isso garante que a IA sempre saiba quais skills estão disponíveis durante sessões longas, sem perder o acesso às skills devido à compressão.

### 4. Compatibilidade com Claude Code

O plugin é totalmente compatível com o sistema de skills e plugins do Claude Code, suportando:

- Skills do Claude Code (`.claude/skills/<skill-name>/SKILL.md`)
- Cache de plugins do Claude (`~/.claude/plugins/cache/...`)
- Marketplace de plugins do Claude (`~/.claude/plugins/marketplaces/...`)

Isso significa que se você usava Claude Code anteriormente, pode continuar usando as skills e plugins existentes após migrar para o OpenCode.

### 5. Recomendação Automática de Skills

O plugin monitora suas mensagens, usando detecção de similaridade semântica para verificar se está relacionada a alguma skill disponível:

- Calcula o vetor de embedding da mensagem
- Calcula a similaridade do cosseno com as descrições de todas as skills
- Quando a similaridade excede o limiar, injeta um prompt de avaliação sugerindo que a IA carregue a skill relacionada

Este processo é completamente automático; você não precisa lembrar os nomes das skills ou solicitar explicitamente.

### 6. Integração com Superpowers (Opcional)

O plugin suporta o fluxo de trabalho Superpowers, habilitado através de variáveis de ambiente:

```bash
OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true opencode
```

Quando habilitado, o plugin detecta automaticamente a skill `using-superpowers` e injeta orientações completas do fluxo de trabalho na inicialização da sessão.

## Comparação com Outras Soluções

| Solução | Características | Cenário de Uso |
|---|---|---|
| **opencode-agent-skills** | Descoberta dinâmica, recuperação de compressão, recomendação automática | Cenários que necessitam gerenciamento unificado e recomendação automática |
| **opencode-skills** | Registro automático como ferramenta `skills_{{name}}` | Cenários que necessitam chamada independente de ferramentas |
| **superpowers** | Fluxo de trabalho completo de desenvolvimento de software | Projetos que necessitam fluxos de processo estritos |
| **skillz** | Modo servidor MCP | Cenários que necessitam uso de skills em múltiplas ferramentas |

**Por que escolher este plugin:**

- ✅ **Configuração Zero**: Descoberta e gerenciamento automático de skills
- ✅ **Recomendação Inteligente**: Recomendação automática de skills relevantes baseada em correspondência semântica
- ✅ **Recuperação de Compressão**: Estável e confiável em sessões longas
- ✅ **Compatibilidade**: Integração perfeita com o ecossistema Claude Code existente

## Resumo da Aula

O plugin OpenCode Agent Skills fornece capacidades completas de gerenciamento de skills para o OpenCode através de mecanismos de descoberta dinâmica, injeção de contexto e recuperação de compressão. Seus valores principais são:

- **Automatização**: Reduz a carga de configuração manual e memorização de nomes de skills
- **Estabilidade**: Skills sempre disponíveis durante sessões longas
- **Compatibilidade**: Integração perfeita com o ecossistema Claude Code existente

## Próxima Aula

> Na próxima aula aprenderemos **[Instalar OpenCode Agent Skills](../installation/)**.
>
> Você vai aprender:
> - Como adicionar o plugin na configuração do OpenCode
> - Como verificar se o plugin foi instalado corretamente
> - Método de configuração para modo de desenvolvimento local

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Atualizado em: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Linha |
|---|---|---|
| Entrada do plugin e visão geral | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L1-L12) | 1-12 |
| Lista de recursos principais | [`README.md`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/README.md#L5-L11) | 5-11 |
| Prioridade de descoberta de skills | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L241-L246) | 241-246 |
| Injeção de mensagem sintética | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L147-L162) | 147-162 |
| Mecanismo de recuperação de compressão | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L144-L151) | 144-151 |
| Módulo de correspondência semântica | [`src/embeddings.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/embeddings.ts#L108-L135) | 108-135 |

**Constantes-chave**:
- `EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2"`: Modelo de embedding utilizado
- `SIMILARITY_THRESHOLD = 0.35`: Limiar de similaridade semântica
- `TOP_K = 5`: Limite de número de skills retornado na recomendação automática

**Funções-chave**:
- `discoverAllSkills()`: Descobre skills de múltiplas localizações
- `use_skill()`: Injeta o conteúdo da skill no contexto da sessão
- `matchSkills()`: Correspondência de skills relacionadas baseada em similaridade semântica
- `injectSyntheticContent()`: Injeta mensagem sintética na sessão

</details>
