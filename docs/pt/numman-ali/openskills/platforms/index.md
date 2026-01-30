---
title: "Funcionalidades da Plataforma: Comandos Principais e Gerenciamento de Skills | OpenSkills"
sidebarTitle: "Dominar Operações Principais"
subtitle: "Funcionalidades da Plataforma: Comandos Principais e Gerenciamento de Skills | OpenSkills"
description: "Aprenda as funcionalidades da plataforma OpenSkills, domine operações principais como comandos, instalação, listagem, atualização e remoção de skills, entenda as diferenças entre gerenciamento global e por projeto."
order: 2
---

# Funcionalidades da Plataforma

Este capítulo aprofunda os comandos principais do OpenSkills CLI e as funcionalidades de gerenciamento de skills, ajudando você a passar de "saber usar" para "dominar".

## Pré-requisitos

::: warning Antes de Começar
Antes de estudar este capítulo, certifique-se de ter concluído o capítulo [Início Rápido](../start/), especialmente:
- [Instalação do OpenSkills](../start/installation/): OpenSkills CLI instalado com sucesso
- [Instalar sua Primeira Skill](../start/first-skill/): compreensão do fluxo básico de instalação de skills
:::

## Conteúdo deste Capítulo

Este capítulo contém 6 tópicos cobrindo todas as funcionalidades principais do OpenSkills:

### [Detalhes dos Comandos](./cli-commands/)

Introdução completa aos 7 comandos, parâmetros e flags, com tabela de referência rápida. Ideal para usuários que precisam consultar rapidamente a sintaxe dos comandos.

### [Detalhes das Fontes de Instalação](./install-sources/)

Explicação detalhada das três fontes de instalação: repositórios GitHub, caminhos locais e repositórios Git privados. Cenários de aplicação, formatos de comando e considerações para cada método.

### [Instalação Global vs Local por Projeto](./global-vs-project/)

Explicação das diferenças entre instalação `--global` e padrão (local por projeto), ajudando você a escolher o local de instalação adequado e compreender as regras de prioridade de busca de skills.

### [Listar Skills Instaladas](./list-skills/)

Aprenda a usar o comando `list` para visualizar skills instaladas e compreenda o significado das etiquetas de localização `(project)` e `(global)`.

### [Atualizar Skills](./update-skills/)

Guia para usar o comando `update` para atualizar skills instaladas, com suporte para atualização total ou de skills específicas, mantendo as skills sincronizadas com o repositório de origem.

### [Remover Skills](./remove-skills/)

Introdução a dois métodos de remoção: comando interativo `manage` e comando scriptável `remove`, ajudando você a gerenciar sua biblioteca de skills de forma eficiente.

## Caminhos de Aprendizado

Escolha o caminho de aprendizado adequado às suas necessidades:

### Caminho A: Aprendizado Sistemático (Recomendado para Iniciantes)

Estude todo o conteúdo em ordem para construir um conhecimento completo:

```
Detalhes dos Comandos → Fontes de Instalação → Global vs Projeto → Listar Skills → Atualizar Skills → Remover Skills
```

### Caminho B: Consulta sob Demanda

Acesse diretamente de acordo com sua tarefa atual:

| O que você quer fazer | Leia isto |
| --- | --- |
| Consultar a sintaxe de um comando | [Detalhes dos Comandos](./cli-commands/) |
| Instalar skill de repositório privado | [Detalhes das Fontes de Instalação](./install-sources/) |
| Decidir entre instalação global ou por projeto | [Global vs Projeto](./global-vs-project/) |
| Ver quais skills estão instaladas | [Listar Skills Instaladas](./list-skills/) |
| Atualizar skills para a versão mais recente | [Atualizar Skills](./update-skills/) |
| Limpar skills não utilizadas | [Remover Skills](./remove-skills/) |

## Próximos Passos

Após concluir este capítulo, você terá dominado as skills de uso diário do OpenSkills. Em seguida, você pode:

- **[Funcionalidades Avançadas](../advanced/)**: Aprenda modos avançados como o modo Universal, caminhos de saída personalizados, links simbólicos e criação de skills personalizadas
- **[Perguntas Frequentes](../faq/)**: Consulte o FAQ e guias de solução de problemas quando encontrar dificuldades
