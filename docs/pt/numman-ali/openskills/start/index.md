---
title: "Início Rápido: Comece a Usar o OpenSkills | OpenSkills"
sidebarTitle: "Comece em 15 Minutos"
subtitle: "Início Rápido: Comece a Usar o OpenSkills | OpenSkills"
description: "Aprenda os primeiros passos com o OpenSkills. Em 15 minutos, complete a instalação de ferramentas e habilidades, permitindo que agentes de IA usem novas habilidades e entendam seu funcionamento."
order: 1
---

# Início Rápido

Esta seção ajuda você a começar rapidamente com o OpenSkills, desde a instalação da ferramenta até fazer com que agentes de IA usem habilidades, em apenas 10-15 minutos.

## Caminho de Aprendizado

Recomendamos seguir esta ordem:

### 1. [Início Rápido](./quick-start/)

Complete a instalação da ferramenta, instalação de habilidades e sincronização em 5 minutos, experimentando o valor principal do OpenSkills.

- Instalar a ferramenta OpenSkills
- Instalar habilidades do repositório oficial da Anthropic
- Sincronizar habilidades para o AGENTS.md
- Verificar se o agente de IA pode usar as habilidades

### 2. [O que é o OpenSkills?](./what-is-openskills/)

Entenda os conceitos principais e o funcionamento do OpenSkills.

- A relação entre OpenSkills e Claude Code
- Formato unificado de habilidades, carregamento progressivo, suporte multi-agente
- Quando usar o OpenSkills em vez do sistema de habilidades integrado

### 3. [Guia de Instalação](./installation/)

Passos detalhados de instalação e configuração do ambiente.

- Verificação do ambiente Node.js e Git
- Uso temporário com npx vs instalação global
- Solução de problemas comuns de instalação

### 4. [Instalar Sua Primeira Habilidade](./first-skill/)

Instale habilidades do repositório oficial da Anthropic e experimente a seleção interativa.

- Usar o comando `openskills install`
- Selecionar interativamente as habilidades necessárias
- Entender a estrutura de diretórios de habilidades (.claude/skills/)

### 5. [Sincronizar Habilidades para AGENTS.md](./sync-to-agents/)

Gere o arquivo AGENTS.md para que o agente de IA saiba quais habilidades estão disponíveis.

- Usar o comando `openskills sync`
- Entender o formato XML do AGENTS.md
- Selecionar quais habilidades sincronizar, controlando o tamanho do contexto

### 6. [Usar Habilidades](./read-skills/)

Entenda como os agentes de IA carregam o conteúdo das habilidades.

- Usar o comando `openskills read`
- A ordem de prioridade de 4 níveis para busca de habilidades
- Ler múltiplas habilidades de uma vez

## Pré-requisitos

Antes de começar, confirme que:

- Você tem o [Node.js](https://nodejs.org/) 20.6.0 ou superior instalado
- Você tem o [Git](https://git-scm.com/) instalado (para instalar habilidades do GitHub)
- Você tem pelo menos um agente de codificação de IA instalado (Claude Code, Cursor, Windsurf, Aider, etc.)

::: tip Verificação Rápida do Ambiente
```bash
node -v # deve mostrar v20.6.0 ou superior
git -v  # deve mostrar git version x.x.x
```
:::

## Próximos Passos

Após completar esta seção, você pode continuar aprendendo:

- [Detalhes dos Comandos](../platforms/cli-commands/): Aprofunde-se em todos os comandos e parâmetros
- [Fontes de Instalação](../platforms/install-sources/): Aprenda a instalar habilidades do GitHub, caminho local, repositórios privados
- [Criar Habilidades Personalizadas](../advanced/create-skills/): Crie suas próprias habilidades
