---
title: "Histórico de Versões: Evolução de Recursos | opencode-agent-skills"
sidebarTitle: "O que há de novo"
subtitle: "Histórico de Versões"
description: "Aprenda sobre a evolução histórica das versões do plugin OpenCode Agent Skills. Este tutorial organiza todas as principais atualizações de recursos, correções de bugs, melhorias de arquitetura e notas sobre mudanças significativas da v0.1.0 à v0.6.4."
tags:
  - "Atualizações de Versão"
  - "changelog"
  - "Histórico de Lançamentos"
order: 3
---

# Histórico de Versões

Este documento registra todas as atualizações de versão do plugin OpenCode Agent Skills. Através do histórico de versões, você pode entender a trajetória de evolução dos recursos, problemas corrigidos e melhorias na arquitetura.

::: tip Versão Atual
A versão estável mais recente é **v0.6.4** (2026-01-20)
:::

## Linha do Tempo de Versões

| Versão | Data de Lançamento | Tipo | Conteúdo Principal |
| --- | --- | --- | --- |
| 0.6.4 | 2026-01-20 | Correção | Análise YAML, suporte Claude v2 |
| 0.6.3 | 2025-12-16 | Melhoria | Otimização de prompts de recomendação de skills |
| 0.6.2 | 2025-12-15 | Correção | Separação de nomes de skills e nomes de diretórios |
| 0.6.1 | 2025-12-13 | Melhoria | Evita recomendar skills já carregadas |
| 0.6.0 | 2025-12-12 | Novo Recurso | Correspondência semântica, pré-cálculo de embeddings |
| 0.5.0 | 2025-12-11 | Melhoria | Sugestões de correspondência fuzzy, refatoração |
| 0.4.1 | 2025-12-08 | Melhoria | Simplificação do método de instalação |
| 0.4.0 | 2025-12-05 | Melhoria | Busca recursiva de scripts |
| 0.3.3 | 2025-12-02 | Correção | Tratamento de links simbólicos |
| 0.3.2 | 2025-11-30 | Correção | Preservação do modo agente |
| 0.3.1 | 2025-11-28 | Correção | Problema de troca de modelo |
| 0.3.0 | 2025-11-27 | Novo Recurso | Funcionalidade de lista de arquivos |
| 0.2.0 | 2025-11-26 | Novo Recurso | Modo Superpowers |
| 0.1.0 | 2025-11-26 | Inicial | 4 ferramentas, descoberta em múltiplos locais |

## Registro Detalhado de Alterações

### v0.6.4 (2026-01-20)

**Correções**:
- Corrigida a análise de frontmatter YAML multilinha para skills (suporte a sintaxe de blocos `|` e `>`), substituindo o analisador personalizado pela biblioteca `yaml`
- Adicionado suporte ao formato Claude v2, onde `installed_plugins.json` agora usa array de instalações de plugins em vez de objeto único

**Melhorias**:
- A descoberta de cache do plugin Claude Code agora suporta a nova estrutura de diretórios aninhados (`cache/<marketplace>/<plugin>/<version>/skills/`)

### v0.6.3 (2025-12-16)

**Melhorias**:
- Otimizados os prompts de avaliação de skills para evitar que o modelo envie mensagens do tipo "nenhuma skill necessária" para o usuário (o usuário não vê os prompts de avaliação ocultos)

### v0.6.2 (2025-12-15)

**Correções**:
- A validação de skills agora permite que o nome do diretório seja diferente do `name` no frontmatter do SKILL.md. O `name` no frontmatter é o identificador canônico, o nome do diretório é apenas para organização. Isso está de acordo com a Anthropic Agent Skills Spec.

### v0.6.1 (2025-12-13)

**Melhorias**:
- A recomendação dinâmica de skills agora rastreia skills já carregadas em cada sessão, evitando recomendar novamente skills já carregadas, reduzindo prompts redundantes e uso de contexto

### v0.6.0 (2025-12-12)

**Novos Recursos**:
- **Correspondência Semântica de Skills**: Após a injeção inicial da lista de skills, mensagens subsequentes usam embeddings locais para correspondência com descrições de skills
- Nova dependência `@huggingface/transformers` para geração local de embeddings (versão quantizada all-MiniLM-L6-v2)
- Quando uma mensagem corresponde a uma skill disponível, um prompt de avaliação de 3 etapas é injetado (EVALUATE → DECIDE → ACTIVATE), incentivando o carregamento da skill (inspirado no [artigo de blog](https://scottspence.com/posts/how-to-make-claude-code-skills-activate-reliably) de [@spences10](https://github.com/spences10))
- Cache em disco de embeddings para correspondência de baixa latência (`~/.cache/opencode-agent-skills/`)
- Limpeza de sessão no evento `session.deleted`

### v0.5.0 (2025-12-11)

**Novos Recursos**:
- Adicionadas sugestões de correspondência fuzzy "você quis dizer..." em todas as ferramentas (`use_skill`, `read_skill_file`, `run_skill_script`, `get_available_skills`)

**Melhorias**:
- **Mudança Significativa**: Ferramenta `find_skills` renomeada para `get_available_skills` com intenção mais clara
- **Interno**: Reorganização da base de código em módulos independentes (`claude.ts`, `skills.ts`, `tools.ts`, `utils.ts`, `superpowers.ts`), melhorando a manutenibilidade
- **Interno**: Melhoria da qualidade do código através da remoção de comentários gerados por IA e código desnecessário

### v0.4.1 (2025-12-08)

**Melhorias**:
- O método de instalação agora usa pacote npm através da configuração OpenCode, em vez de git clone + link simbólico

**Remoções**:
- Removido `INSTALL.md` (não mais necessário após simplificação da instalação)

### v0.4.0 (2025-12-05)

**Melhorias**:
- A descoberta de scripts agora busca recursivamente todo o diretório de skills (profundidade máxima 10), em vez de apenas o diretório raiz e subdiretório `scripts/`
- Scripts agora são identificados por caminho relativo (ex: `tools/build.sh`) em vez de nome base
- Parâmetro `skill_name` renomeado para `skill` em `read_skill_file`, `run_skill_script` e `use_skill`
- Parâmetro `script_name` renomeado para `script` em `run_skill_script`

### v0.3.3 (2025-12-02)

**Correções**:
- Corrigida a detecção de arquivos e diretórios para lidar corretamente com links simbólicos usando `fs.stat`

### v0.3.2 (2025-11-30)

**Correções**:
- Preservado o modo agente ao injetar mensagens sintéticas no início da sessão

### v0.3.1 (2025-11-28)

**Correções**:
- Corrigida a troca inesperada de modelo ao usar ferramentas de skills passando explicitamente o modelo atual na operação `noReply` (solução temporária para o problema #4475 do opencode)

### v0.3.0 (2025-11-27)

**Novos Recursos**:
- Adicionada funcionalidade de lista de arquivos na saída `use_skill`

### v0.2.0 (2025-11-26)

**Novos Recursos**:
- Adicionado suporte ao modo Superpowers
- Adicionadas declarações de publicação

### v0.1.0 (2025-11-26)

**Novos Recursos**:
- Adicionada ferramenta `use_skill` para carregar conteúdo de skills no contexto
- Adicionada ferramenta `read_skill_file` para ler arquivos de suporte no diretório de skills
- Adicionada ferramenta `run_skill_script` para executar scripts do diretório de skills
- Adicionada ferramenta `find_skills` para pesquisar e listar skills disponíveis
- Adicionada descoberta de skills em múltiplos locais (nível de projeto, nível de usuário e locais compatíveis com Claude)
- Adicionada validação de frontmatter conforme Anthropic Agent Skills Spec v1.0
- Adicionada injeção automática de lista de skills no início da sessão e após compactação de contexto

**Novos Contribuidores**:
- Josh Thomas <josh@joshthomas.dev> (Mantenedor)

## Visão Geral da Evolução de Recursos

| Recurso | Versão Introduzida | Caminho de Evolução |
| --- | --- | --- |
| 4 Ferramentas Básicas | v0.1.0 | v0.5.0 adiciona correspondência fuzzy |
| Descoberta de Skills em Múltiplos Locais | v0.1.0 | v0.4.1 simplifica instalação, v0.6.4 suporta Claude v2 |
| Injeção Automática de Contexto | v0.1.0 | v0.3.0 adiciona lista de arquivos, v0.6.1 evita recomendações duplicadas |
| Modo Superpowers | v0.2.0 | Estabilidade contínua |
| Busca Recursiva de Scripts | v0.4.0 | v0.3.3 corrige links simbólicos |
| Correspondência Semântica | v0.6.0 | v0.6.1 evita duplicação, v0.6.3 otimiza prompts |
| Sugestões de Correspondência Fuzzy | v0.5.0 | Estabilidade contínua |

## Notas sobre Mudanças Significativas

### v0.6.0: Funcionalidade de Correspondência Semântica

Introduzida capacidade de correspondência semântica baseada em embeddings locais, permitindo que a IA recomende automaticamente skills relevantes com base no conteúdo da mensagem do usuário, sem necessidade de memorizar manualmente os nomes das skills.

- **Detalhes Técnicos**: Usa o modelo `all-MiniLM-L6-v2` da HuggingFace (versão quantizada q8)
- **Mecanismo de Cache**: Resultados de embedding são armazenados em cache em `~/.cache/opencode-agent-skills/`, melhorando a velocidade de correspondências subsequentes
- **Fluxo de Correspondência**: Mensagem do usuário → embedding → cálculo de similaridade de cosseno com descrições de skills → Top 5 recomendações (limiar 0,35)

### v0.5.0: Refatoração e Renomeação de Ferramentas

Reestruturação da arquitetura do código para design modular, com nomenclatura de ferramentas mais clara:

- `find_skills` → `get_available_skills`
- `skill_name` → `skill`
- `script_name` → `script`

### v0.4.0: Upgrade do Mecanismo de Descoberta de Scripts

A descoberta de scripts evoluiu de "apenas diretório raiz + scripts/" para "busca recursiva em todo o diretório de skills" (profundidade máxima 10), suportando organizações de scripts mais flexíveis.

### v0.2.0: Integração Superpowers

Adicionado suporte ao modo de fluxo de trabalho Superpowers, requerendo a instalação da skill `using-superpowers` e configuração da variável de ambiente `OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true`.

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Número da Linha |
| --- | --- | --- |
| Número da Versão Atual | [`package.json`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L3-L3) | 3 |
| Histórico de Versões | [`CHANGELOG.md`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/CHANGELOG.md#L19-L152) | 19-152 |

**Informações de Versões Principais**:
- `v0.6.4`: Versão atual (2026-01-20)
- `v0.6.0`: Introdução da correspondência semântica (2025-12-12)
- `v0.5.0`: Versão refatorada (2025-12-11)
- `v0.1.0`: Versão inicial (2025-11-26)

</details>
