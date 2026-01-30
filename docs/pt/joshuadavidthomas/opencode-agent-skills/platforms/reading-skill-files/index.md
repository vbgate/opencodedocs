---
title: "Lendo Arquivos de Skill: Acesso a Recursos | opencode-agent-skills"
subtitle: "Lendo Arquivos de Skill: Acesso a Recursos | opencode-agent-skills"
sidebarTitle: "Acessar Recursos Adicionais da Skill"
description: "Aprenda a ler arquivos de skill. Domine verificações de segurança de caminho e mecanismos de injeção XML para acessar documentos e configurações no diretório da skill com segurança."
tags:
  - "Arquivos de Skill"
  - "Uso de Ferramentas"
  - "Segurança de Caminho"
prerequisite:
  - "start-installation"
  - "platforms-listing-available-skills"
order: 6
---

# Lendo Arquivos de Skill

## O Que Você Poderá Fazer Após Este Tutorial

- Usar a ferramenta `read_skill_file` para ler documentos, configurações e arquivos de exemplo no diretório da skill
- Entender o mecanismo de segurança de caminho para prevenir ataques de directory traversal
- Dominar o método de injeção de conteúdo de arquivo em formato XML
- Lidar com mensagens de erro quando arquivos não existem e listas de arquivos disponíveis

## Sua Situação Atual

O SKILL.md da skill contém apenas orientações principais, mas muitas skills fornecem documentação complementar, exemplos de configuração, guias de uso e outros arquivos de suporte. Você deseja acessar esses arquivos para obter instruções mais detalhadas, mas não sabe como ler arquivos no diretório da skill com segurança.

## Quando Usar Esta Técnica

- **Ver documentação detalhada**: O diretório `docs/` da skill contém guias de uso detalhados
- **Exemplos de configuração**: Precisa consultar arquivos de configuração de exemplo no diretório `config/`
- **Exemplos de código**: O diretório `examples/` da skill contém exemplos de código
- **Auxílio de depuração**: Verificar o README ou outros arquivos de instrução da skill
- **Entender a estrutura de recursos**: Explorar quais arquivos estão disponíveis no diretório da skill

## Conceito Central

A ferramenta `read_skill_file` permite que você acesse arquivos de suporte no diretório da skill com segurança. Ela garante segurança e usabilidade através dos seguintes mecanismos:

::: info Mecanismo de Segurança
O plugin verifica rigorosamente o caminho do arquivo para prevenir ataques de directory traversal:
- Proíbe o uso de `..` para acessar arquivos fora do diretório da skill
- Proíbe o uso de caminhos absolutos
- Permite apenas o acesso a arquivos no diretório da skill e seus subdiretórios
:::

Fluxo de execução da ferramenta:
1. Verifica se o nome da skill existe (suporta namespace)
2. Verifica se o caminho do arquivo solicitado é seguro
3. Lê o conteúdo do arquivo
4. Empacota em formato XML e injeta no contexto da sessão
5. Retorna mensagem de confirmação de carregamento bem-sucedido

::: tip Persistência de Conteúdo de Arquivo
O conteúdo do arquivo é injetado com as flags `synthetic: true` e `noReply: true`, o que significa:
- O conteúdo do arquivo torna-se parte do contexto da sessão
- Mesmo que a sessão seja compactada, o conteúdo permanece acessível
- A injeção não dispara uma resposta direta da IA
:::

## Siga Comigo

### Passo 1: Ler Documentação da Skill

Suponha que o diretório da skill tenha documentação de uso detalhada:

```
Entrada do usuário:
Leia a documentação do git-helper

Chamada do sistema:
read_skill_file(skill="git-helper", filename="docs/usage-guide.md")

Resposta do sistema:
Arquivo "docs/usage-guide.md" da skill "git-helper" carregado.
```

O conteúdo do arquivo será injetado no contexto da sessão em formato XML:

```xml
<skill-file skill="git-helper" file="docs/usage-guide.md">
  <metadata>
    <directory>/path/to/project/.opencode/skills/git-helper</directory>
  </metadata>

  <content>
# Guia de Uso do Git Helper

Esta skill fornece orientações sobre gerenciamento de branches Git, convenções de commit e fluxos de colaboração...

[Conteúdo do documento continua]
  </content>
</skill-file>
```

**Você deve ver**: Mensagem de carregamento bem-sucedido, conteúdo do arquivo injetado no contexto da sessão.

### Passo 2: Ler Exemplos de Configuração

Ver exemplos de configuração da skill:

```
Entrada do usuário:
Mostre o exemplo de configuração do docker-helper

Chamada do sistema:
read_skill_file(skill="docker-helper", filename="config/docker-compose.yml.example")

Resposta do sistema:
Arquivo "config/docker-compose.yml.example" da skill "docker-helper" carregado.
```

**Você deve ver**: O conteúdo do arquivo de configuração é injetado, a IA pode referenciar o exemplo para gerar a configuração real para você.

### Passo 3: Usar Namespace para Ler Arquivos

Se houver skills com o mesmo nome em nível de projeto e nível de usuário:

```
Entrada do usuário:
Leia o script de build do project:build-helper

Chamada do sistema:
read_skill_file(skill="project:build-helper", filename="scripts/build.sh")

Resposta do sistema:
Arquivo "scripts/build.sh" da skill "build-helper" carregado.
```

**Você deve ver**: A origem da skill é especificada explicitamente através do namespace.

### Passo 4: Lidar com Arquivos Inexistentes

Se você tentar ler um arquivo que não existe:

```
Entrada do usuário:
Leia o api-docs.md do git-helper

Chamada do sistema:
read_skill_file(skill="git-helper", filename="api-docs.md")

Resposta do sistema:
Arquivo "api-docs.md" não encontrado. Arquivos disponíveis: docs/usage-guide.md, examples/branch-flow.md, README.md, SKILL.md
```

A ferramenta listará todos os arquivos disponíveis no diretório da skill, ajudando você a encontrar o nome de arquivo correto.

**Você deve ver**: Mensagem de erro e lista de arquivos disponíveis.

### Passo 5: Experimentar a Proteção de Segurança de Caminho

Tente acessar arquivos fora do diretório da skill:

```
Entrada do usuário:
Leia o arquivo do diretório pai do git-helper

Chamada do sistema:
read_skill_file(skill="git-helper", filename="../secrets.txt")

Resposta do sistema:
Caminho inválido: não é possível acessar arquivos fora do diretório da skill.
```

A ferramenta recusará qualquer solicitação que tente acessar fora do diretório da skill.

**Você deve ver**: Mensagem de erro de segurança de caminho.

## Pontos de Verificação ✅

- [ ] Você consegue usar `read_skill_file` para ler arquivos de skill?
- [ ] Você entende a função do mecanismo de segurança de caminho?
- [ ] Você consegue identificar o formato XML da injeção de conteúdo de arquivo?
- [ ] Você consegue encontrar a lista de arquivos disponíveis nas mensagens de erro?
- [ ] Você consegue usar namespace para localizar a skill com precisão?

## Alertas de Armadilhas

### Armadilha 1: Erro de Caminho de Arquivo

Se você esquecer que o arquivo está em um subdiretório:

```
Entrada do usuário:
Leia o usage-guide.md do git-helper

Resposta do sistema:
Arquivo "usage-guide.md" não encontrado. Arquivos disponíveis: docs/usage-guide.md, examples/branch-flow.md, README.md
```

**Causa**: O arquivo pode estar em um subdiretório, é necessário especificar o caminho relativo.

**Solução**: Use o caminho completo, como `docs/usage-guide.md`.

### Armadilha 2: Ignorar Conflitos de Namespace

Quando skills com o mesmo nome existem em múltiplos namespaces:

```
Entrada do usuário:
Leia o README do build-helper

Resposta do sistema:
Arquivo "README.md" da skill "build-helper" carregado.
```

Você pode estar lendo a skill em nível de projeto, mas esperava a skill em nível de usuário.

**Solução**: Use namespace para especificar explicitamente, como `read_skill_file(skill="user:build-helper", filename="README.md")`.

### Armadilha 3: Tentativa de Directory Traversal

Tentar usar `..` para acessar o diretório superior:

```
Entrada do usuário:
Leia arquivos fora do diretório da skill

Chamada do sistema:
read_skill_file(skill="my-skill", filename="../../../etc/passwd")

Resposta do sistema:
Caminho inválido: não é possível acessar arquivos fora do diretório da skill.
```

**Causa**: Esta é uma restrição de segurança para prevenir ataques de directory traversal.

**Solução**: Só é possível acessar arquivos dentro do diretório da skill, quando precisar de outros arquivos, deixe a IA usar a ferramenta `Read` diretamente.

### Armadilha 4: Arquivo Já Existente no Contexto da Sessão

Se você já carregou a skill, o conteúdo do arquivo pode estar no SKILL.md da skill ou em outro conteúdo já injetado:

```
Entrada do usuário:
Leia o documento principal da skill

Chamada do sistema:
read_skill_file(skill="my-skill", filename="core-guide.md")
```

Mas isso pode ser desnecessário, pois o conteúdo principal geralmente está no SKILL.md.

**Solução**: Primeiro verifique o conteúdo da skill já carregada, confirme se precisa de arquivos adicionais.

## Resumo da Lição

A ferramenta `read_skill_file` permite que você acesse arquivos de suporte no diretório da skill com segurança:

- **Verificação de Segurança de Caminho**: Previne directory traversal, permite apenas acesso a arquivos dentro do diretório da skill
- **Mecanismo de Injeção XML**: Conteúdo do arquivo empacotado em tags XML `<skill-file>`, incluindo metadados
- **Erros Amigáveis**: Quando o arquivo não existe, lista arquivos disponíveis para ajudar a encontrar o caminho correto
- **Suporte a Namespace**: Pode usar `namespace:skill-name` para localizar skills com o mesmo nome com precisão
- **Persistência de Contexto**: Através da flag `synthetic: true`, o conteúdo do arquivo permanece acessível após a compactação da sessão

Esta ferramenta é muito adequada para ler:
- Documentação detalhada (diretório `docs/`)
- Exemplos de configuração (diretório `config/`)
- Exemplos de código (diretório `examples/`)
- README e arquivos de instrução
- Código-fonte de scripts (se precisar ver a implementação)

## Próxima Lição

> Na próxima lição aprenderemos **[Compatibilidade com Skills do Claude Code](../../advanced/claude-code-compatibility/)**.
>
> Você aprenderá:
> - Como o plugin é compatível com o sistema de skills e plugins do Claude Code
> - Entender o mecanismo de mapeamento de ferramentas (conversão de ferramentas do Claude Code para ferramentas do OpenCode)
> - Dominar o método de descoberta de skills a partir do local de instalação do Claude Code

---

## Apêndice: Referência de Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Data de atualização: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Definição da ferramenta ReadSkillFile | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L74-L135) | 74-135 |
| Verificação de segurança de caminho | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L130-L133) | 130-133 |
| Listar arquivos de skill | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L289-L316) | 289-316 |
| Função resolveSkill | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| Função injectSyntheticContent | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L147-L162) | 147-162 |

**Tipos Principais**:
- `Skill`: Interface de metadados da skill (`skills.ts:43-52`)
- `OpencodeClient`: Tipo de cliente do SDK do OpenCode (`utils.ts:140`)
- `SessionContext`: Contexto da sessão, contém informações de model e agent (`utils.ts:142-145`)

**Funções Principais**:
- `ReadSkillFile(directory: string, client: OpencodeClient)`: Retorna a definição da ferramenta, processa a leitura de arquivos de skill
- `isPathSafe(basePath: string, requestedPath: string): boolean`: Verifica se o caminho está dentro do diretório base, prevenindo directory traversal
- `listSkillFiles(skillPath: string, maxDepth: number = 3): Promise<string[]>`: Lista todos os arquivos no diretório da skill (excluindo SKILL.md)
- `resolveSkill(skillName: string, skillsByName: Map<string, Skill>): Skill | null`: Suporta análise de skills no formato `namespace:skill-name`
- `injectSyntheticContent(client, sessionID, text, context)`: Injeta conteúdo na sessão através de `noReply: true` e `synthetic: true`

**Regras de Negócio**:
- A verificação de segurança de caminho usa `path.resolve()` para validar, garantindo que o caminho resolvido comece com o diretório base (`utils.ts:131-132`)
- Quando o arquivo não existe, tenta `fs.readdir()` para listar arquivos disponíveis, fornecendo mensagens de erro amigáveis (`tools.ts:126-131`)
- O conteúdo do arquivo é empacotado em formato XML, contendo atributos `skill`, `file` e tags `<metadata>`, `<content>` (`tools.ts:111-119`)
- Durante a injeção, obtém o contexto de model e agent da sessão atual, garantindo que o conteúdo seja injetado no contexto correto (`tools.ts:121-122`)

**Mecanismos de Segurança**:
- Proteção contra directory traversal: `isPathSafe()` verifica se o caminho está dentro do diretório base (`utils.ts:130-133`)
- Quando a skill não existe, fornece sugestões de correspondência aproximada (`tools.ts:90-95`)
- Quando o arquivo não existe, lista arquivos disponíveis para ajudar o usuário a encontrar o caminho correto (`tools.ts:126-131`)

</details>
