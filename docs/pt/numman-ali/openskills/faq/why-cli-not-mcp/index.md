---
title: "CLI vs MCP: Escolha de Design | OpenSkills"
sidebarTitle: "Por que CLI em vez de MCP"
subtitle: "Por que CLI em vez de MCP?"
description: "Aprenda os motivos de design por trás da escolha do OpenSkills pelo CLI em vez do MCP. Compare as diferenças de posicionamento entre os dois, entenda por que o sistema de skills é adequado para o modo de arquivos estáticos e como alcançar a universalidade multi-agente e implantação zero-config."
tags:
  - "FAQ"
  - "Filosofia de Design"
  - "MCP"
prerequisite:
  - "start-what-is-openskills"
order: 3
---

# Por que CLI em vez de MCP?

## O que você aprenderá

Esta lição ajuda você a entender:

- ✅ Compreender as diferenças de posicionamento entre MCP e sistema de skills
- ✅ Entender por que o CLI é mais adequado para carregamento de skills
- ✅ Dominar a filosofia de design do OpenSkills
- ✅ Compreender os princípios técnicos do sistema de skills

## Seu dilema atual

Você pode estar pensando:

- "Por que não usar o protocolo MCP mais avançado?"
- "A abordagem CLI não é muito antiquada?"
- "O MCP não é mais adequado para a era da IA?"

Esta lição ajuda você a entender as considerações técnicas por trás dessas decisões de design.

---

## Questão central: O que é uma skill?

Antes de discutir CLI vs MCP, vamos entender a essência da "skill".

### A essência da skill

::: info Definição de Skill
Uma skill é uma combinação de **instruções estáticas + recursos**, incluindo:
- `SKILL.md`: guias detalhados de operação e prompts
- `references/`: documentação de referência
- `scripts/`: scripts executáveis
- `assets/`: imagens, templates e outros recursos

Uma skill **não é** um serviço dinâmico, API em tempo real ou ferramenta que requer servidor.
:::

### Design oficial da Anthropic

O sistema de skills da Anthropic é projetado com base no **sistema de arquivos**:

- As skills existem como arquivos `SKILL.md`
- Descritas através do bloco XML `<available_skills>`
- O agente de IA lê o conteúdo dos arquivos no contexto conforme necessário

Isso determina que a seleção de tecnologia do sistema de skills deve ser compatível com o sistema de arquivos.

---

## MCP vs OpenSkills: Comparação de Posicionamento

| Dimensão de Comparação | MCP (Model Context Protocol) | OpenSkills (CLI) |
| --- | --- | --- |
| **Cenário de Aplicação** | Ferramentas dinâmicas, chamadas de API em tempo real | Instruções estáticas, documentos, scripts |
| **Requisitos de Execução** | Requer servidor MCP | Sem servidor (apenas arquivos) |
| **Suporte a Agentes** | Apenas agentes que suportam MCP | Todos os agentes que podem ler `AGENTS.md` |
| **Complexidade** | Requer implantação e manutenção de servidor | Zero configuração, pronto para uso |
| **Fonte de Dados** | Obtido em tempo real do servidor | Lido do sistema de arquivos local |
| **Dependência de Rede** | Necessária | Não necessária |
| **Carregamento de Skills** | Através de chamada de protocolo | Através de leitura de arquivo |

---

## Por que o CLI é mais adequado para o sistema de skills?

### 1. Skills são arquivos

**MCP requer servidor**: é necessário implantar um servidor MCP, processar solicitações, respostas, handshake de protocolo...

**CLI precisa apenas de arquivos**:

```bash
# Skills armazenadas no sistema de arquivos
.claude/skills/pdf/
├── SKILL.md              # Arquivo de instruções principal
├── references/           # Documentação de referência
│   └── pdf-format-spec.md
├── scripts/             # Scripts executáveis
│   └── extract-pdf.py
└── assets/              # Arquivos de recursos
    └── pdf-icon.png
```

**Vantagens**:
- ✅ Zero configuração, sem servidor necessário
- ✅ Skills podem ser versionadas
- ✅ Disponível offline
- ✅ Implantação simples

### 2. Universalidade: Todos os agentes podem usar

**Limitações do MCP**:

Apenas agentes que suportam o protocolo MCP podem usar. Se agentes como Cursor, Windsurf, Aider implementarem MCP individualmente, trará:
- Trabalho de desenvolvimento duplicado
- Problemas de compatibilidade de protocolo
- Dificuldade de sincronização de versões

**Vantagens do CLI**:

Qualquer agente que possa executar comandos shell pode usar:

```bash
# Chamada do Claude Code
npx openskills read pdf

# Chamada do Cursor
npx openskills read pdf

# Chamada do Windsurf
npx openskills read pdf
```

**Custo de integração zero**: basta que o agente possa executar comandos shell.

### 3. Conformidade com o design oficial

O sistema de skills da Anthropic é projetado como **sistema de arquivos**, não design MCP:

```xml
<!-- Descrição de skills em AGENTS.md -->
<available_skills>
<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit...</description>
<location>project</location>
</skill>
</available_skills>
```

**Método de chamada**:

```bash
# Método de chamada do design oficial
npx openskills read pdf
```

O OpenSkills segue completamente o design oficial da Anthropic, mantendo compatibilidade.

### 4. Carregamento Progressivo (Progressive Disclosure)

**Vantagem central do sistema de skills**: carregamento sob demanda, mantendo o contexto enxuto.

**Implementação do CLI**:

```bash
# Carrega o conteúdo da skill apenas quando necessário
npx openskills read pdf
# Saída: conteúdo completo do SKILL.md para stdout
```

**Desafios do MCP**:

Se implementado com MCP, seria necessário:
- Servidor gerenciar lista de skills
- Implementar lógica de carregamento sob demanda
- Gerenciar contexto

Enquanto a abordagem CLI suporta naturalmente o carregamento progressivo.

---

## Cenários de Aplicação do MCP

O MCP resolve problemas **diferentes** do sistema de skills:

| Problemas que o MCP Resolve | Exemplos |
| --- | --- |
| **Chamadas de API em tempo real** | Chamar API OpenAI, consultas de banco de dados |
| **Ferramentas dinâmicas** | Calculadora, serviço de conversão de dados |
| **Integração de serviços remotos** | Operações Git, sistemas CI/CD |
| **Gerenciamento de estado** | Ferramentas que precisam manter estado do servidor |

Esses cenários requerem **servidor** e **protocolo**, o MCP é a escolha correta.

---

## Sistema de Skills vs MCP: Não é uma relação competitiva

**Ponto central**: MCP e sistema de skills resolvem problemas diferentes, não é uma escolha mutuamente exclusiva.

### Posicionamento do Sistema de Skills

```
[Instruções Estáticas] → [SKILL.md] → [Sistema de Arquivos] → [Carregamento CLI]
```

Cenários de aplicação:
- Guias de operação e melhores práticas
- Documentação e materiais de referência
- Scripts estáticos e templates
- Configurações que precisam de controle de versão

### Posicionamento do MCP

```
[Ferramenta Dinâmica] → [Servidor MCP] → [Chamada de Protocolo] → [Resposta em Tempo Real]
```

Cenários de aplicação:
- Chamadas de API em tempo real
- Consultas de banco de dados
- Serviços remotos que precisam de estado
- Cálculos e conversões complexas

### Relação Complementar

O OpenSkills não exclui o MCP, mas **foca no carregamento de skills**:

```
Agente de IA
  ├─ Sistema de Skills (OpenSkills CLI) → Carrega instruções estáticas
  └─ Ferramentas MCP → Chama serviços dinâmicos
```

Eles são complementares, não substitutos.

---

## Casos Práticos: Quando usar qual?

### Caso 1: Operações Git

❌ **Não adequado para sistema de skills**:
- Operações Git são dinâmicas, requerem interação em tempo real
- Dependem do estado do servidor Git

✅ **Adequado para MCP**:
```bash
# Chamada através de ferramenta MCP
git:checkout(branch="main")
```

### Caso 2: Guia de Processamento de PDF

❌ **Não adequado para MCP**:
- O guia de operação é estático
- Não requer servidor em execução

✅ **Adequado para sistema de skills**:
```bash
# Carregado através de CLI
npx openskills read pdf
# Saída: etapas detalhadas de processamento de PDF e melhores práticas
```

### Caso 3: Consulta de Banco de Dados

❌ **Não adequado para sistema de skills**:
- Precisa conectar ao banco de dados
- Resultados são dinâmicos

✅ **Adequado para MCP**:
```bash
# Chamada através de ferramenta MCP
database:query(sql="SELECT * FROM users")
```

### Caso 4: Padrões de Revisão de Código

❌ **Não adequado para MCP**:
- Os padrões de revisão são documentos estáticos
- Precisam de controle de versão

✅ **Adequado para sistema de skills**:
```bash
# Carregado através de CLI
npx openskills read code-review
# Saída: lista detalhada de verificação de revisão de código e exemplos
```

---

## Futuro: Fusão de MCP e Sistema de Skills

### Possíveis direções de evolução

**MCP + Sistema de Skills**:

```bash
# Skills referenciam ferramentas MCP
npx openskills read pdf-tool

# Conteúdo do SKILL.md
Esta skill requer o uso de ferramentas MCP:

1. Use mcp:pdf-extract para extrair texto
2. Use mcp:pdf-parse para analisar estrutura
3. Use os scripts fornecidos por esta skill para processar resultados
```

**Vantagens**:
- Skills fornecem instruções avançadas e melhores práticas
- MCP fornece ferramentas dinâmicas de baixo nível
- Combinação dos dois, funcionalidade mais poderosa

### Estágio Atual

O OpenSkills escolheu CLI porque:
1. O sistema de skills já é um design maduro de sistema de arquivos
2. A abordagem CLI é simples de implementar e altamente universal
3. Não é necessário esperar que cada agente implemente suporte a MCP

---

## Resumo da Lição

Razões principais do OpenSkills para escolher CLI em vez de MCP:

### Razões Principais

- ✅ **Skills são arquivos estáticos**: sem servidor necessário, armazenados em sistema de arquivos
- ✅ **Maior universalidade**: todos os agentes podem usar, não depende do protocolo MCP
- ✅ **Conformidade com design oficial**: o sistema de skills da Anthropic é projetado como sistema de arquivos
- ✅ **Implantação zero-config**: sem servidor necessário, pronto para uso

### MCP vs Sistema de Skills

| MCP | Sistema de Skills (CLI) |
| --- | --- |
| Ferramentas dinâmicas | Instruções estáticas |
| Requer servidor | Sistema de arquivos puro |
| API em tempo real | Documentos e scripts |
| Requer suporte a protocolo | Custo de integração zero |

### Não é competição, é complementaridade

- MCP resolve problemas de ferramentas dinâmicas
- Sistema de skills resolve problemas de instruções estáticas
- Ambos podem ser usados em conjunto

---

## Leitura Relacionada

- [O que é OpenSkills?](../../start/what-is-openskills/)
- [Detalhes dos Comandos](../../platforms/cli-commands/)
- [Criar Skills Personalizadas](../../advanced/create-skills/)

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Atualizado em: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Entrada CLI | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts) | 39-80 |
| Comando de Leitura | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts) | 1-50 |
| Geração de AGENTS.md | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts) | 23-93 |

**Decisões-chave de design**:
- Abordagem CLI: carrega skills através de `npx openskills read <name>`
- Armazenamento em sistema de arquivos: skills armazenadas em `.claude/skills/` ou `.agent/skills/`
- Compatibilidade universal: saída no mesmo formato XML do Claude Code

</details>
