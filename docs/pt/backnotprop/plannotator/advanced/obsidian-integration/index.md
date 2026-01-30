---
title: "Integração com Obsidian: Salvamento Automático de Planos | plannotator"
sidebarTitle: "Salvar Automaticamente no Obsidian"
subtitle: "Integração com Obsidian: Salvamento Automático de Planos | plannotator"
description: "Aprenda a configurar a integração do plannotator com o Obsidian. Salve planos aprovados automaticamente no vault, com geração de frontmatter e tags, suportando caminhos personalizados."
tags:
- "plannotator"
- "integration"
- "obsidian"
- "advanced"
prerequisite:
- "start-getting-started"
order: 2
---

# Integração com Obsidian: Salvar Planos Automaticamente no Vault

## O Que Você Vai Aprender

- Salvar automaticamente planos aprovados ou rejeitados no vault do Obsidian
- Entender o mecanismo de geração de frontmatter e tags
- Personalizar caminhos e pastas de salvamento
- Utilizar backlinks para construir um grafo de conhecimento

## Seu Problema Atual

Você revisa planos gerados por IA no Plannotator, e depois de aprová-los, esses planos simplesmente "desaparecem". Você gostaria de salvar esses planos valiosos no Obsidian para revisá-los e encontrá-los facilmente no futuro, mas copiar e colar manualmente é muito trabalhoso e a formatação fica desorganizada.

## Quando Usar Este Recurso

- Você usa o Obsidian como ferramenta de gestão do conhecimento
- Você deseja salvar e revisar planos de implementação gerados por IA a longo prazo
- Você quer usar a visualização em grafo e o sistema de tags do Obsidian para organizar seus planos

## Conceito Central

A funcionalidade de integração com Obsidian do Plannotator salva automaticamente o conteúdo do plano no seu vault do Obsidian quando você aprova ou rejeita um plano. O sistema irá:

1. **Detectar vaults**: Ler automaticamente todos os vaults do arquivo de configuração do Obsidian
2. **Gerar frontmatter**: Incluir hora de criação, origem e tags
3. **Extrair tags**: Extrair tags automaticamente do título do plano e das linguagens dos blocos de código
4. **Adicionar backlink**: Inserir o link `[[Plannotator Plans]]` para facilitar a construção do grafo de conhecimento

::: info O Que é o Obsidian?
Obsidian é um aplicativo de notas com links bidirecionais e prioridade local, que suporta formato Markdown e permite visualizar as relações entre notas através da visualização em grafo.
:::

## 🎒 Preparação Antes de Começar

Certifique-se de que o Obsidian esteja instalado e configurado. O Plannotator detectará automaticamente os vaults no seu sistema, mas você precisa ter pelo menos um vault para usar este recurso.

## Siga os Passos

### Passo 1: Abrir o Painel de Configurações

Na interface do Plannotator, clique no ícone de engrenagem no canto superior direito para abrir o painel de configurações.

Você verá a caixa de diálogo de configurações, contendo várias opções de configuração.

### Passo 2: Habilitar a Integração com Obsidian

No painel de configurações, encontre a seção "Obsidian Integration" e clique no interruptor para habilitar este recurso.

Após habilitar, o Plannotator detectará automaticamente os vaults do Obsidian no seu sistema.

Você verá uma lista suspensa mostrando os vaults detectados (por exemplo, `My Vault`, `Work Notes`).

### Passo 3: Selecionar o Vault e a Pasta

Na lista suspensa, selecione o vault onde deseja salvar os planos. Se nenhum vault for detectado, você pode:

1. Selecionar a opção "Custom path..."
2. Digitar o caminho completo do vault na caixa de texto

Em seguida, defina o nome da pasta de salvamento no campo "Folder" (o padrão é `plannotator`).

Você verá o caminho de visualização abaixo, mostrando onde o plano será salvo.

### Passo 4: Aprovar ou Rejeitar o Plano

Após a configuração, revise os planos gerados por IA normalmente. Quando você clicar em "Approve" ou "Send Feedback", o plano será salvo automaticamente no vault configurado.

Você verá o novo arquivo criado no Obsidian, com o formato de nome `Title - Jan 2, 2026 2-30pm.md`.

### Passo 5: Visualizar o Arquivo Salvo

No Obsidian, abra o arquivo salvo e você verá o seguinte conteúdo:

```markdown
---
created: 2026-01-24T14:30:00.000Z
source: plannotator
tags: [plan, authentication, typescript, sql]
---

[[Plannotator Plans]]

## Implementation Plan: User Authentication

...
```

Você notará que o arquivo tem YAML frontmatter no topo, contendo a hora de criação, origem e tags.

## Checkpoint ✅

- [ ] A integração com Obsidian está habilitada no painel de configurações
- [ ] Um vault foi selecionado (ou um caminho personalizado foi inserido)
- [ ] O nome da pasta foi definido
- [ ] Após aprovar ou rejeitar um plano, um novo arquivo aparece no Obsidian
- [ ] O arquivo contém frontmatter e o backlink `[[Plannotator Plans]]`

## Detalhes do Frontmatter e Tags

### Estrutura do Frontmatter

Cada plano salvo contém os seguintes campos de frontmatter:

| Campo | Exemplo de Valor | Descrição |
| --- | --- | --- |
| `created` | `2026-01-24T14:30:00.000Z` | Timestamp de criação no formato ISO 8601 |
| `source` | `plannotator` | Valor fixo, identifica a origem |
| `tags` | `[plan, authentication, typescript]` | Array de tags extraídas automaticamente |

### Regras de Geração de Tags

O Plannotator usa as seguintes regras para extrair tags automaticamente:

1. **Tag padrão**: Sempre inclui a tag `plannotator`
2. **Tag do nome do projeto**: Extraída automaticamente do nome do repositório git ou do nome do diretório
3. **Palavras-chave do título**: Extrai palavras significativas do primeiro título H1 (excluindo palavras de parada comuns)
4. **Tags de linguagem de código**: Extraídas dos identificadores de linguagem dos blocos de código (por exemplo, `typescript`, `sql`). Linguagens de configuração genéricas (como `json`, `yaml`, `markdown`) são filtradas automaticamente.

Lista de palavras de parada (não serão usadas como tags):
- `the`, `and`, `for`, `with`, `this`, `that`, `from`, `into`
- `plan`, `implementation`, `overview`, `phase`, `step`, `steps`

Limite de tags: no máximo 7 tags, ordenadas pela ordem de extração.

### Formato do Nome do Arquivo

O nome do arquivo usa um formato legível: `Title - Jan 2, 2026 2-30pm.md`

| Parte | Exemplo | Descrição |
| --- | --- | --- |
| Título | `User Authentication` | Extraído do H1, limitado a 50 caracteres |
| Data | `Jan 2, 2026` | Data atual |
| Hora | `2-30pm` | Hora atual (formato 12 horas) |

### Mecanismo de Backlink

Cada arquivo de plano terá o link `[[Plannotator Plans]]` inserido na parte inferior. Este backlink serve para:

- **Conexão do grafo de conhecimento**: Na visualização em grafo do Obsidian, todos os planos estão conectados ao mesmo nó
- **Navegação rápida**: Clicar em `[[Plannotator Plans]]` cria uma página de índice que agrega todos os planos salvos
- **Links bidirecionais**: Use backlinks reversos na página de índice para visualizar todos os planos

## Suporte Multiplataforma

O Plannotator detecta automaticamente as localizações dos arquivos de configuração do Obsidian em diferentes sistemas operacionais:

| Sistema Operacional | Caminho do Arquivo de Configuração |
| --- | --- |
| macOS | `~/Library/Application Support/obsidian/obsidian.json` |
| Windows | `%APPDATA%\obsidian/obsidian.json` |
| Linux | `~/.config/obsidian/obsidian.json` |

Se a detecção automática falhar, você pode inserir manualmente o caminho do vault.

## Avisos de Problemas Comuns

### Problema 1: Vaults Não Detectados

**Sintoma**: A lista suspensa mostra "Detecting..." mas não retorna resultados

**Causa**: O arquivo de configuração do Obsidian não existe ou está em formato incorreto

**Solução**:
1. Confirme que o Obsidian está instalado e foi aberto pelo menos uma vez
2. Verifique se o arquivo de configuração existe (consulte a tabela de caminhos acima)
3. Use "Custom path..." para inserir manualmente o caminho do vault

### Problema 2: Arquivo Não Encontrado Após Salvamento

**Sintoma**: Após aprovar um plano, nenhum novo arquivo aparece no Obsidian

**Causa**: Caminho do vault incorreto ou Obsidian não atualizado

**Solução**:
1. Verifique se o caminho de visualização no painel de configurações está correto
2. No Obsidian, clique em "Reload vault" ou pressione `Cmd+R` (macOS) / `Ctrl+R` (Windows/Linux)
3. Verifique se o vault correto foi selecionado

### Problema 3: Nome do Arquivo Contém Caracteres Especiais

**Sintoma**: O nome do arquivo contém `_` ou outros caracteres substitutos

**Causa**: O título contém caracteres não suportados pelo sistema de arquivos (`< > : " / \ | ? *`)

**Solução**: Este é o comportamento esperado, o Plannotator substituirá automaticamente esses caracteres para evitar erros do sistema de arquivos.

## Resumo da Aula

A integração com Obsidian conecta perfeitamente seu fluxo de revisão de planos com a gestão do conhecimento:

- ✅ Salvar automaticamente planos aprovados ou rejeitados
- ✅ Extração inteligente de tags para facilitar a pesquisa posterior
- ✅ Geração de frontmatter, padronizando o formato dos metadados
- ✅ Adição de backlink, construindo um grafo de conhecimento

Após configurar uma vez, cada revisão será arquivada automaticamente, eliminando a necessidade de copiar e colar manualmente.

## Próxima Aula

> Na próxima aula, aprenderemos sobre **[Integração com Bear](../bear-integration/)**.
>
> Você vai aprender:
> - Como salvar planos no aplicativo de notas Bear
> - As diferenças entre a integração com Bear e a integração com Obsidian
> - Usar x-callback-url para criar notas automaticamente

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Detectar vaults do Obsidian | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L135-L175) | 135-175 |
| Salvar plano no Obsidian | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L180-L227) | 180-227 |
| Extrair tags | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L34-L74) | 34-74 |
| Gerar frontmatter | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L81-L89) | 81-89 |
| Gerar nome do arquivo | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L111-L127) | 111-127 |
| Armazenamento de configurações do Obsidian | [`packages/ui/utils/obsidian.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/obsidian.ts#L36-L43) | 36-43 |
| Componente de UI de Configurações | [`packages/ui/components/Settings.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Settings.tsx#L387-L491) | 387-491 |

**Funções Principais**:
- `detectObsidianVaults()`: Lê o arquivo de configuração do Obsidian, retorna a lista de caminhos de vaults disponíveis
- `saveToObsidian(config)`: Salva o plano no vault especificado, incluindo frontmatter e backlink
- `extractTags(markdown)`: Extrai tags do conteúdo do plano (palavras-chave do título, linguagens de código, nome do projeto)
- `generateFrontmatter(tags)`: Gera a string YAML frontmatter
- `generateFilename(markdown)`: Gera um nome de arquivo legível

**Regras de Negócio**:
- Máximo de 7 tags (L73)
- Nome do arquivo limitado a 50 caracteres (L102)
- Suporta detecção de caminhos de arquivo de configuração multiplataforma (L141-149)
- Cria automaticamente pastas inexistentes (L208)

</details>
