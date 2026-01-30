---
title: "Registro de Alterações: Atualizações de Funcionalidades | OpenSkills"
sidebarTitle: "Veja as Novidades"
subtitle: "Registro de Alterações: Atualizações de Funcionalidades | OpenSkills"
description: "Veja o histórico de versões do OpenSkills, conheça novas funcionalidades como o comando update, links simbólicos, repositórios privados, e importantes melhorias e correções de problemas como proteção contra travessia de caminhos."
tags:
  - "changelog"
  - "version history"
order: 1
---

# Registro de Alterações

Esta página registra o histórico de versões do OpenSkills, ajudando você a entender as novas funcionalidades, melhorias e correções de problemas de cada versão.

---

## [1.5.0] - 2026-01-17

### Novas Funcionalidades

- **`openskills update`** - Atualiza habilidades instaladas das origens registradas (padrão: todas)
- **Rastreamento de metadados de origem** - Agora registra informações de origem durante a instalação para atualização confiável de habilidades

### Melhorias

- **Leitura de múltiplas habilidades** - O comando `openskills read` agora suporta uma lista de nomes de habilidades separada por vírgulas
- **Geração de instruções de uso** - Otimizou as instruções de chamada do comando read em ambiente shell
- **README** - Adicionou guia de atualização e instruções de uso manual

### Correções de Problemas

- **Otimização da experiência de atualização** - Pula habilidades sem metadados de origem e lista essas habilidades sugerindo reinstalação

---

## [1.4.0] - 2026-01-17

### Melhorias

- **README** - Esclareceu o método de instalação local padrão do projeto, removeu sugestões redundantes de sync
- **Mensagem de instalação** - O instalador agora distingue claramente a instalação local padrão do projeto da opção `--global`

---

## [1.3.2] - 2026-01-17

### Melhorias

- **Documentação e diretrizes AGENTS.md** - Todos os exemplos de comandos e instruções de uso geradas usam `npx openskills`

---

## [1.3.1] - 2026-01-17

### Correções de Problemas

- **Instalação Windows** - Corrigiu problema de verificação de caminho no sistema Windows ("Security error: Installation path outside target directory")
- **Versão CLI** - `npx openskills --version` agora lê corretamente o número de versão do package.json
- **SKILL.md no diretório raiz** - Corrigiu problema de instalação de repositórios de habilidade única com SKILL.md no diretório raiz

---

## [1.3.0] - 2025-12-14

### Novas Funcionalidades

- **Suporte a links simbólicos** - Habilidades agora podem ser instaladas por meio de links simbólicos no diretório de habilidades ([#3](https://github.com/numman-ali/openskills/issues/3))
  - Suporta atualizações baseadas em git criando links simbólicos a partir de repositórios clonados
  - Suporta fluxo de trabalho de desenvolvimento local de habilidades
  - Links simbólicos corrompidos são pulados de forma elegante

- **Caminho de saída configurável** - O comando sync adicionou a opção `--output` / `-o` ([#5](https://github.com/numman-ali/openskills/issues/5))
  - Pode sincronizar para qualquer arquivo `.md` (como `.ruler/AGENTS.md`)
  - Se o arquivo não existir, cria automaticamente o arquivo e adiciona título
  - Cria automaticamente diretórios aninhados se necessário

- **Instalação de caminho local** - Suporta instalação de habilidades a partir de diretórios locais ([#10](https://github.com/numman-ali/openskills/issues/10))
  - Suporta caminhos absolutos (`/path/to/skill`)
  - Suporta caminhos relativos (`./skill`, `../skill`)
  - Suporta expansão de til (`~/my-skills/skill`)

- **Suporte a repositórios git privados** - Suporta instalação de habilidades a partir de repositórios privados ([#10](https://github.com/numman-ali/openskills/issues/10))
  - URLs SSH (`git@github.com:org/private-skills.git`)
  - URLs HTTPS com autenticação
  - Usa automaticamente chaves SSH do sistema

- **Suíte de testes abrangente** - 88 testes em 6 arquivos de teste
  - Testes unitários para detecção de links simbólicos, análise YAML
  - Testes de integração para comandos install, sync
  - Testes de ponta a ponta para fluxo completo de CLI

### Melhorias

- **O sinalizador `--yes` agora pula todas as solicitações** - Modo totalmente não interativo, adequado para CI/CD ([#6](https://github.com/numman-ali/openskills/issues/6))
  - Não solicita ao sobrescrever habilidades existentes
  - Exibe mensagem `Sobrescrevendo: <nome-da-habilidade>` ao pular solicitações
  - Todos os comandos agora podem ser executados em ambiente headless

- **Reordenação de fluxo de trabalho CI** - As etapas de construção agora são executadas antes dos testes
  - Garante que `dist/cli.js` exista para testes de ponta a ponta

### Segurança

- **Proteção contra travessia de caminhos** - Verifica se o caminho de instalação permanece dentro do diretório de destino
- **Desreferenciamento de link simbólico** - `cpSync` usa `dereference: true` para copiar com segurança o destino do link simbólico
- **Regex YAML não guloso** - Previne ataques potenciais de ReDoS na análise de frontmatter

---

## [1.2.1] - 2025-10-27

### Correções de Problemas

- Limpeza da documentação README - Removeu seções duplicadas e sinalizadores incorretos

---

## [1.2.0] - 2025-10-27

### Novas Funcionalidades

- Sinalizador `--universal`, instala habilidades em `.agent/skills/` em vez de `.claude/skills/`
  - Adequado para ambientes multiagente (Claude Code + Cursor/Windsurf/Aider)
  - Evita conflito com plugins de mercado nativos do Claude Code

### Melhorias

- A instalação local do projeto agora é a opção padrão (anteriormente era instalação global)
- As habilidades são instaladas em `./.claude/skills/` por padrão

---

## [1.1.0] - 2025-10-27

### Novas Funcionalidades

- README abrangente de página única com análise técnica aprofundada
- Comparação lado a lado com Claude Code

### Correções de Problemas

- O rótulo de localização agora exibe corretamente `project` ou `global` com base no local de instalação

---

## [1.0.0] - 2025-10-26

### Novas Funcionalidades

- Lançamento inicial
- `npx openskills install <source>` - Instala habilidades a partir de repositórios do GitHub
- `npx openskills sync` - Gera XML `<available_skills>` para AGENTS.md
- `npx openskills list` - Exibe habilidades instaladas
- `npx openskills read <name>` - Carrega conteúdo da habilidade para o agente
- `npx openskills manage` - Exclusão interativa de habilidades
- `npx openskills remove <name>` - Remove a habilidade especificada
- Interface TUI interativa para todos os comandos
- Suporta o formato SKILL.md do Anthropic
- Divulgação progressiva (carregar habilidades sob demanda)
- Suporte para recursos empacotados (references/, scripts/, assets/)

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Tempo de atualização: 2026-01-24

| Funcionalidade | Caminho do arquivo                                                                      |
|--- | ---|
| Registro de alterações original | [`CHANGELOG.md`](https://github.com/numman-ali/openskills/blob/main/CHANGELOG.md) |

</details>
