---
title: "Carregar Skill: Injeção de Conteúdo XML | opencode-agent-skills"
sidebarTitle: "Faça a IA Usar as Suas Skills"
subtitle: "Carregar Skills para o Contexto da Sessão"
description: "Domine a ferramenta use_skill para carregar skills no contexto da sessão. Entenda a injeção XML e o mecanismo de Injeção de Mensagem Sintética, aprenda sobre gerenciamento de metadados de skills."
tags:
  - "Carregamento de Skills"
  - "Injeção XML"
  - "Gerenciamento de Contexto"
prerequisite:
  - "start-creating-your-first-skill"
  - "platforms-listing-available-skills"
order: 3
---

# Carregar Skills para o Contexto da Sessão

## O Que Você Será Capaz de Fazer

- Usar a ferramenta `use_skill` para carregar skills na sessão atual
- Entender como o conteúdo da skill é injetado no contexto em formato XML
- Dominar o mecanismo de Injeção de Mensagem Sintética (synthetic message injection)
- Entender a estrutura de metadados da skill (source, diretório, scripts, arquivos)
- Conhecer como as skills permanecem disponíveis após a compactação da sessão

## O Seu Dilema Atual

Você criou uma skill, mas a IA parece não conseguir acessar o seu conteúdo. Ou em conversas longas, as orientações da skill desaparecem repentinamente e a IA esquece as regras anteriores. Tudo isso está relacionado ao mecanismo de carregamento de skills.

## Quando Usar Esta Técnica

- **Carregamento manual**: Quando a recomendação automática da IA não é adequada, especifique diretamente a skill necessária
- **Manutenção em sessões longas**: Garanta que o conteúdo da skill permaneça acessível após a compactação do contexto
- **Compatibilidade com Claude Code**: Carregue skills no formato Claude para obter mapeamento de ferramentas
- **Controle preciso**: Necessidade de carregar uma versão específica da skill (usando namespace)

## Ideia Central

A ferramenta `use_skill` injeta o conteúdo do SKILL.md no contexto da sessão, permitindo que a IA siga as regras e workflows definidos na skill.

### Injeção de Conteúdo XML

O conteúdo da skill é injetado em formato XML estruturado, contendo três partes:

```xml
<skill name="skill-name">
  <metadata>
    <source>Tag de origem da skill</source>
    <directory>Caminho do diretório da skill</directory>
    <scripts>
      <script>tools/script1.sh</script>
    </scripts>
    <files>
      <file>docs/guide.md</file>
    </files>
  </metadata>

  <tool-mapping>
    <!-- Mapeamento de ferramentas do Claude Code -->
  </tool-mapping>

  <content>
    Conteúdo completo do SKILL.md
  </content>
</skill>
```

### Injeção de Mensagem Sintética

O plugin usa o método `session.prompt()` do OpenCode SDK para injetar o conteúdo da skill, definindo dois flags essenciais:

::: info Injeção de Mensagem Sintética
- `noReply: true` - A IA não responderá a esta injeção
- `synthetic: true` - Marca a mensagem como gerada pelo sistema (oculta do usuário, não conta como entrada do usuário)
:::

Isso significa que:
- **Invisível para o usuário**: A injeção da skill não é exibida no histórico de conversa
- **Não consome entrada**: Não é contabilizada nas mensagens do usuário
- **Persistentemente disponível**: O conteúdo da skill permanece no contexto mesmo após a compactação da sessão

### Ciclo de Vida da Sessão

1. **Na primeira mensagem**: O plugin injeta automaticamente a lista `<available-skills>`, mostrando todas as skills disponíveis
2. **Ao usar `use_skill`**: O conteúdo XML da skill selecionada é injetado no contexto
3. **Após compactação da sessão**: O plugin escuta o evento `session.compacted` e reinjeta a lista de skills

## Siga os Passos

### Passo 1: Carregar Uma Skill Básica

No OpenCode, peça para a IA carregar uma skill:

```
Entrada do usuário:
Carregar a skill brainstorming

Resposta do sistema:
Skill "brainstorming" loaded.
```

**O que você deve ver**: A IA retorna uma confirmação de carregamento bem-sucedido e o conteúdo da skill foi injetado no contexto.

Agora você pode testar se a IA segue as regras da skill:

```
Entrada do usuário:
Me ajude a escrever uma descrição de produto

Resposta do sistema:
(A IA vai gerar conteúdo seguindo as regras da skill brainstorming, utilizando as técnicas e o fluxo definidos)
```

### Passo 2: Verificar os Recursos Disponíveis Após o Carregamento

Ao carregar uma skill, o sistema retorna a lista de scripts e arquivos disponíveis:

```
Entrada do usuário:
Carregar git-helper

Resposta do sistema:
Skill "git-helper" loaded.
Available scripts: tools/branch.sh, tools/commit.sh
Available files: docs/usage.md, examples/workflow.md
```

Essas informações informam quais recursos estão disponíveis no diretório da skill:
- **Scripts**: Podem ser executados com a ferramenta `run_skill_script`
- **Arquivos**: Podem ser lidos com a ferramenta `read_skill_file`

**O que você deve ver**: A mensagem de sucesso seguida pela lista de scripts e arquivos disponíveis.

### Passo 3: Usar Namespace para Carregar Skills com o Mesmo Nome

Suponha que tanto a nível de projeto quanto de usuário exista a skill `build-helper`:

```
Entrada do usuário:
Carregar build-helper

Resposta do sistema:
Skill "build-helper" loaded.
Available scripts: build.sh, optimize.sh

Entrada do usuário:
(Verificando qual versão do build-helper foi carregada)
```

De acordo com a prioridade de descoberta de skills, por padrão a skill de nível de projeto é carregada. Se você precisar da skill de usuário:

```
Entrada do usuário:
Carregar user:build-helper

Resposta do sistema:
Skill "build-helper" loaded.
Available scripts: ci.sh, test.sh
Available files: README.md
```

**O que você deve ver**: Carregando skills com o mesmo nome mas de diferentes origens usando o formato `namespace:skill-name`.

### Passo 4: Experimentar o Efeito da Orientação da Skill

Após carregar a skill, o comportamento da IA deve seguir as regras definidas na skill. Usando a skill brainstorming como exemplo:

```
Entrada do usuário:
Carregar brainstorming
Me ajude a criar um ponto de venda principal para um produto de casa inteligente

Resposta do sistema:
(A IA utilizará as técnicas definidas na skill brainstorming, como:
- Listar primeiro as possíveis direções, depois explorar mais profundamente
- Evitar julgar ideias muito cedo
- Usar "sim, e..." para expandir ideias
- Registrar todas as ideias antes de filtrar)

Vamos primeiro listar as possíveis direções:
1. Controle de conveniência
2. Gerenciamento de energia
3. Proteção de segurança
...
```

**O que você deve ver**: O estilo de resposta e o processo da IA estão alinhados com o definido na skill.

### Passo 5: Entender a Persistência da Skill em Sessões Longas

Mantenha uma conversa prolongada e observe se a skill permanece efetiva:

```
Entrada do usuário:
Carregar docker-helper
(Fazer várias rodadas de conversa envolvendo construção,部署, etc.)
...
(Suponha que a conversa seja longa e acione a compactação do contexto do OpenCode)
Entrada do usuário:
Continuar com o deployment do Docker anterior

Resposta do sistema:
(A IA ainda consegue acessar o conteúdo do docker-helper,
porque o plugin reinjetou a lista de skills após a compactação)
```

::: tip Mecanismo de Recuperação Após Compactação
O plugin escuta o evento `session.compacted` e, quando a sessão é compactada, reinjeta a lista de skills, garantindo que as skills carregadas permaneçam acessíveis após a compactação.
:::

**O que você deve ver**: Mesmo com conversas longas e compactação do contexto, a IA ainda consegue acessar o conteúdo da skill.

### Passo 6: Carregar Skills no Formato Claude Code

Se você tiver skills do Claude Code, elas serão descobertas automaticamente:

```
Entrada do usuário:
Listar todas as skills disponíveis

Resposta do sistema:
...
claude-code-superpowers (claude-plugins)
  Fluxo de trabalho completo de desenvolvimento de software

Entrada do usuário:
Carregar claude-code-superpowers

Resposta do sistema:
Skill "claude-code-superpowers" loaded.
```

Ao carregar skills no formato Claude, o mapeamento de ferramentas (toolTranslation) é injetado automaticamente, mapeando as ferramentas do Claude para as ferramentas do OpenCode:

::: info Exemplo de Mapeamento de Ferramentas
- `TodoWrite` do Claude → `todowrite` do OpenCode
- `Task` do Claude → `task` do OpenCode (sub-agente)
- `Bash` do Claude → `bash` do OpenCode
:::

**O que você deve ver**: A skill carrega com sucesso e a IA consegue compreender e usar workflows no formato Claude.

## Pontos de Verificação ✅

- [ ] Você consegue usar `use_skill` para carregar skills?
- [ ] Você consegue entender o mecanismo de injeção do conteúdo da skill em formato XML?
- [ ] Você consegue citar os dois flags essenciais da mensagem synthetic?
- [ ] Você consegue explicar por que a skill permanece disponível após a compactação da sessão?
- [ ] Você consegue usar namespace para carregar diferentes versões de skills com o mesmo nome?

## Avisos de Problemas Comuns

### Armadilha 1: Nome da Skill Digitado Incorretamente

Se você digitar o nome da skill incorretamente:

```
Entrada do usuário:
Carregar brainstormig

Resposta do sistema:
Skill "brainstormig" not found. Did you mean "brainstorming"?
```

O plugin oferece sugestões de correspondência parcial baseadas em distância de edição.

**Solução**: Verifique a ortografia ou use `get_available_skills` para ver o nome correto.

### Armadilha 2: Confusão de Skills com o Mesmo Nome

Se houver skills com o mesmo nome no nível de projeto e usuário, você pode carregar a versão errada:

```
Entrada do usuário:
Carregar build-helper

Resposta do sistema:
Skill "build-helper" loaded.
Available scripts: build.sh, optimize.sh  # Esta é a de nível de projeto

O usuário esperava carregar a de nível de usuário, mas a padrão é a de nível de projeto
```

**Solução**: Use namespace para especificar claramente, como `user:build-helper`.

### Armadilha 3: Conteúdo da Skill Não Faz Efeito

Às vezes você carrega uma skill, mas a IA parece não seguir as regras:

```
Entrada do usuário:
Carregar my-conventions
(Espera que a IA siga as convenções de código)
Entrada do usuário:
Escreva uma função

Resposta do sistema:
(O código escrito pela IA não segue as convenções esperadas)
```

**Possíveis causas**:
- O conteúdo do SKILL.md da skill não é claro o suficiente
- A descrição da skill não é detalhada e a IA tem desvio de compreensão
- Em conversas longas, o contexto foi compactado e a lista de skills precisa ser reinjetada

**Solução**:
- Verifique se o frontmatter e o conteúdo da skill estão claros
- Informe explicitamente à IA para usar regras específicas: "Por favor, use as regras da skill my-conventions"
- Recarregue a skill após a compactação

### Armadilha 4: Problemas de Mapeamento de Ferramentas de Skills do Claude

Após carregar skills do Claude Code, a IA ainda pode usar nomes de ferramentas incorretos:

```
Entrada do usuário:
Carregar claude-code-superpowers
Usar a ferramenta TodoWrite

Resposta do sistema:
(A IA pode tentar usar o nome de ferramenta incorreto, porque o mapeamento não foi feito corretamente)
```

**Causa**: O mapeamento de ferramentas é injetado automaticamente ao carregar a skill, mas a IA pode precisar de uma instrução explícita.

**Solução**: Após carregar a skill, informe explicitamente à IA para usar a ferramenta mapeada:

```
Entrada do usuário:
Carregar claude-code-superpowers
Atenção para usar a ferramenta todowrite (não TodoWrite)
```

## Resumo da Lição

A ferramenta `use_skill` injeta o conteúdo da skill no contexto da sessão em formato XML, através do mecanismo de Injeção de Mensagem Sintética:

- **Injeção XML estruturada**: Contém metadados, mapeamento de ferramentas e conteúdo da skill
- **Mensagem synthetic**: `noReply: true` e `synthetic: true` garantem que a mensagem seja oculta do usuário
- **Disponibilidade persistente**: Mesmo após a compactação do contexto, o conteúdo da skill permanece acessível
- **Suporte a namespace**: Formato `namespace:skill-name` para especificar precisamente a origem da skill
- **Compatibilidade com Claude**: Mapeamento de ferramentas injetado automaticamente, suportando skills do Claude Code

O carregamento de skills é o mecanismo fundamental para fazer a IA seguir workflows e regras específicas. Através da injeção de conteúdo, a IA pode manter um comportamento consistente durante toda a conversa.

## Próxima Lição

> Na próxima lição, aprenderemos sobre **Recomendação Automática de Skills: Princípio de Correspondência Semântica../automatic-skill-matching/)**.
>
> Você aprenderá:
> - Como o plugin recomenda automaticamente skills relacionadas com base em similaridade semântica
> - Dominar os princípios básicos do modelo embedding e cálculo de similaridade por cosseno
> - Conhecer técnicas de otimização de descrição de skills para melhores recomendações
> - Entender como o cache de embedding melhora a performance

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para ver a localização do código-fonte</strong></summary>

> Data de atualização: 2026-01-24

| Função        | Caminho do Arquivo                                                                                  | Linhas    |
| --- | --- | --- |
| Definição da Ferramenta UseSkill | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L200-L267)         | 200-267 |
| Função injectSyntheticContent | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L147-L162)    | 147-162 |
| Função injectSkillsList | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L345-L370) | 345-370 |
| Função resolveSkill | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| Função listSkillFiles | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L289-L316) | 289-316 |

**Constantes principais**:
- Nenhuma

**Funções principais**:
- `UseSkill()`: Aceita o parâmetro `skill`, constrói o conteúdo da skill em formato XML e injeta na sessão
- `injectSyntheticContent(client, sessionID, text, context)`: Injeta mensagens synthetic através de `client.session.prompt()`, definindo `noReply: true` e `synthetic: true`
- `injectSkillsList()`: Injeta a lista `<available-skills>` na primeira mensagem
- `resolveSkill(skillName: string, skillsByName: Map<string, Skill>)`: Suporta resolução de skills no formato `namespace:skill-name`
- `listSkillFiles(skillPath: string, maxDepth: number)`: Lista recursivamente todos os arquivos no diretório da skill (excluindo SKILL.md)

**Regras de negócio**:
- O conteúdo da skill é injetado em formato XML, contendo metadados, mapeamento de ferramentas e conteúdo (`tools.ts:238-249`)
- Mensagens injetadas são marcadas como synthetic, não contabilizadas na entrada do usuário (`utils.ts:159`)
- Skills já carregadas não são mais recomendadas na sessão atual (`plugin.ts:128-132`)
- A lista de skills é injetada automaticamente na primeira mensagem (`plugin.ts:70-105`)
- A lista de skills é reinjetada após a compactação da sessão (`plugin.ts:145-151`)

**Formato do Conteúdo XML**:
```xml
<skill name="${skill.name}">
  <metadata>
    <source>${skill.label}</source>
    <directory>${skill.path}</directory>
    <scripts>
      <script>${script.relativePath}</script>
    </scripts>
    <files>
      <file>${file}</file>
    </files>
  </metadata>

  ${toolTranslation}

  <content>
  ${skill.template}
  </content>
</skill>
```

</details>
