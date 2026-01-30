---
title: "Integração com Bear: Salvar Planos Automaticamente | Plannotator"
sidebarTitle: "Salvar Planos no Bear"
subtitle: "Integração com Bear: Salvar Planos Aprovados Automaticamente | Plannotator"
description: "Aprenda a configurar a integração do Plannotator com o Bear. Salve planos aprovados automaticamente via x-callback-url, gere tags inteligentes e construa sua base de conhecimento."
tags:
  - "Integração"
  - "Bear"
  - "Aplicativo de Notas"
  - "Base de Conhecimento"
prerequisite:
  - "installation-claude-code"
  - "platforms-plan-review-basics"
order: 3
---

# Integração com Bear: Salvar Planos Aprovados Automaticamente

## O Que Você Vai Aprender

Com a integração Bear ativada, cada vez que você aprovar um plano, o Plannotator salvará automaticamente no seu Bear, incluindo:
- Título gerado automaticamente (extraído do plano)
- Tags inteligentes (nome do projeto, palavras-chave, linguagens de programação)
- Conteúdo completo do plano

Assim você pode gerenciar todos os planos aprovados em um só lugar, facilitando consultas futuras e a construção da sua base de conhecimento.

## O Problema Que Você Enfrenta

Você provavelmente já passou por estas situações:
- O plano gerado pela IA é ótimo, mas você quer salvá-lo para referência futura
- Copiar e colar planos manualmente no Bear é tedioso
- Planos de diferentes projetos ficam misturados, sem organização por tags

Com a integração Bear, todos esses problemas são resolvidos automaticamente.

## Quando Usar Este Recurso

- Você usa o Bear como seu principal aplicativo de notas
- Precisa arquivar planos aprovados como base de conhecimento
- Quer encontrar rapidamente planos anteriores através de tags

::: info Sobre o Bear
Bear é um aplicativo de notas Markdown para macOS que suporta tags, criptografia, sincronização e muito mais. Se você ainda não o instalou, visite [bear.app](https://bear.app/) para saber mais.
:::

## 🎒 Antes de Começar

- Plannotator instalado (veja o [tutorial de instalação](../../start/installation-claude-code/))
- Bear instalado e funcionando normalmente
- Familiaridade com o fluxo básico de revisão de planos (veja [Fundamentos da Revisão de Planos](../../platforms/plan-review-basics/))

## Conceito Principal

O núcleo da integração Bear é o protocolo **x-callback-url**:

1. Ative a integração Bear na interface do Plannotator (armazenado no localStorage do navegador)
2. Ao aprovar um plano, o Plannotator envia uma URL `bear://x-callback-url/create`
3. O sistema usa o comando `open` para abrir automaticamente o Bear e criar a nota
4. Conteúdo do plano, título e tags são preenchidos automaticamente

**Características principais**:
- Não precisa configurar caminho do vault (diferente do Obsidian)
- Tags geradas inteligentemente (máximo de 7)
- Salvamento automático ao aprovar o plano

::: tip Diferença em Relação ao Obsidian
A integração Bear é mais simples, não requer configuração de caminho do vault, apenas um botão de ativação. Porém, o Obsidian permite especificar pasta de destino e mais personalizações.
:::

## Passo a Passo

### Passo 1: Abrir as Configurações do Plannotator

Quando o AI Agent gerar um plano e abrir a interface do Plannotator, clique no botão ⚙️ **Settings** no canto superior direito.

**Você deve ver**: O painel de configurações aparece com várias opções

### Passo 2: Ativar a Integração Bear

No painel de configurações, encontre a seção **Bear Notes** e clique no botão de alternância.

**Por quê**
O botão mudará de cinza (desativado) para azul (ativado) e será salvo no localStorage do navegador.

**Você deve ver**:
- O botão Bear Notes fica azul
- Texto descritivo: "Auto-save approved plans to Bear"

### Passo 3: Aprovar o Plano

Após concluir a revisão do plano, clique no botão **Approve** na parte inferior.

**Por quê**
O Plannotator lê as configurações do Bear e, se estiver ativado, chama o x-callback-url do Bear junto com a aprovação.

**Você deve ver**:
- O aplicativo Bear abre automaticamente
- Uma janela de nova nota aparece
- Título e conteúdo já estão preenchidos
- Tags já foram geradas (começando com `#`)

### Passo 4: Verificar a Nota Salva

No Bear, verifique a nota criada e confirme:
- O título está correto (extraído do H1 do plano)
- O conteúdo está completo (inclui o plano inteiro)
- As tags fazem sentido (nome do projeto, palavras-chave, linguagens de programação)

**Você deve ver**:
Uma estrutura de nota semelhante a esta:

```markdown
## User Authentication

[Conteúdo completo do plano...]

#plannotator #myproject #authentication #typescript #api
```

## Checklist ✅

- [ ] O botão Bear Notes está ativado nas Settings
- [ ] O Bear abre automaticamente após aprovar o plano
- [ ] O título da nota corresponde ao H1 do plano
- [ ] A nota contém o conteúdo completo do plano
- [ ] As tags incluem `#plannotator` e o nome do projeto

## Solução de Problemas

### O Bear Não Abre Automaticamente

**Causa**: O comando `open` do sistema falhou, possivelmente porque:
- O Bear não está instalado ou não foi baixado da App Store
- O URL scheme do Bear foi sequestrado por outro aplicativo

**Solução**:
1. Confirme que o Bear está instalado corretamente
2. Teste manualmente no terminal: `open "bear://x-callback-url/create?title=test"`

### Tags Não São as Esperadas

**Causa**: As tags são geradas automaticamente seguindo estas regras:
- Obrigatória: `#plannotator`
- Obrigatória: nome do projeto (extraído do nome do repositório git ou diretório)
- Opcional: até 3 palavras-chave extraídas do título H1 (excluindo stopwords)
- Opcional: tags de linguagem de programação extraídas dos blocos de código (excluindo json/yaml/markdown)
- Máximo de 7 tags

**Solução**:
- Se as tags não estiverem corretas, você pode editá-las manualmente no Bear
- Se o nome do projeto estiver errado, verifique a configuração do repositório git ou o nome do diretório

### Plano Aprovado Mas Não Salvo

**Causa**:
- O botão Bear não está ativado (verifique nas Settings)
- Erro de rede ou timeout na resposta do Bear
- Conteúdo do plano está vazio

**Solução**:
1. Confirme que o botão nas Settings está azul (ativado)
2. Verifique se há logs de erro no terminal (`[Bear] Save failed:`)
3. Aprove o plano novamente

## Detalhes do Mecanismo de Geração de Tags

O Plannotator gera tags inteligentemente para que você possa encontrar planos rapidamente no Bear. Aqui estão as regras de geração:

| Origem da Tag | Exemplo | Prioridade |
| --- | --- | --- |
| Tag fixa | `#plannotator` | Obrigatória |
| Nome do projeto | `#myproject`, `#plannotator` | Obrigatória |
| Palavras-chave do H1 | `#authentication`, `#api` | Opcional (máx. 3) |
| Linguagem de programação | `#typescript`, `#python` | Opcional |

**Lista de stopwords** (não se tornam tags):
- `the`, `and`, `for`, `with`, `this`, `that`, `from`, `into`
- `plan`, `implementation`, `overview`, `phase`, `step`, `steps`

**Linguagens excluídas** (não se tornam tags):
- `json`, `yaml`, `yml`, `text`, `txt`, `markdown`, `md`

::: details Exemplo: Processo de Geração de Tags
Suponha que o título do plano seja "Implementation Plan: User Authentication System in TypeScript" e os blocos de código contenham Python e JSON:

1. **Tag fixa**: `#plannotator`
2. **Nome do projeto**: `#myproject` (assumindo o nome do repositório git)
3. **Palavras-chave do H1**:
   - `implementation` → excluída (stopword)
   - `plan` → excluída (stopword)
   - `user` → mantida → `#user`
   - `authentication` → mantida → `#authentication`
   - `system` → mantida → `#system`
   - `typescript` → mantida → `#typescript`
4. **Linguagens de programação**:
   - `python` → mantida → `#python`
   - `json` → excluída (lista de exclusão)

Tags finais: `#plannotator #myproject #user #authentication #system #typescript #python` (7 tags, limite atingido)
:::

## Comparação com a Integração Obsidian

| Característica | Integração Bear | Integração Obsidian |
| --- | --- | --- |
| Complexidade de configuração | Simples (apenas um botão) | Média (precisa escolher vault e pasta) |
| Armazenamento | Dentro do app Bear | Caminho do vault especificado |
| Nome do arquivo | Gerenciado automaticamente pelo Bear | `Title - Mon D, YYYY H-MMam.md` |
| Frontmatter | Não (Bear não suporta) | Sim (created, source, tags) |
| Multiplataforma | Apenas macOS | macOS/Windows/Linux |
| x-callback-url | ✅ Usa | ❌ Escreve arquivo diretamente |

::: tip Como Escolher
- Se você usa apenas macOS e gosta do Bear: a integração Bear é mais simples
- Se precisa de multiplataforma ou caminhos de armazenamento personalizados: a integração Obsidian é mais flexível
- Se quiser usar ambos: você pode ativar os dois (aprovar um plano salvará em ambos os lugares)
:::

## Resumo da Lição

- A integração Bear funciona através do protocolo x-callback-url, com configuração simples
- Basta ativar o botão nas Settings, sem necessidade de especificar caminhos
- Salva automaticamente no Bear ao aprovar o plano
- Tags geradas inteligentemente, incluindo nome do projeto, palavras-chave e linguagens de programação (máximo de 7)
- Comparada à integração Obsidian, a do Bear é mais simples mas com menos recursos

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos sobre o **[Modo Remoto/Devcontainer](../remote-mode/)**.
>
> Você aprenderá:
> - Como usar o Plannotator em ambientes remotos (SSH, devcontainer, WSL)
> - Configurar portas fixas e encaminhamento de portas
> - Abrir o navegador em ambiente remoto para visualizar a página de revisão

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Interface de configuração Bear | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L18-L20) | 18-20 |
| Salvar no Bear | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L234-L257) | 234-257 |
| Extração de tags | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L34-L74) | 34-74 |
| Extração de título | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L94-L105) | 94-105 |
| Interface de configurações Bear | [`packages/ui/utils/bear.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/bear.ts#L15-L17) | 15-17 |
| Ler configurações Bear | [`packages/ui/utils/bear.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/bear.ts#L22-L26) | 22-26 |
| Salvar configurações Bear | [`packages/ui/utils/bear.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/bear.ts#L31-L33) | 31-33 |
| Componente UI de configurações | [`packages/ui/components/Settings.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Settings.tsx#L496-L518) | 496-518 |
| Chamar Bear ao aprovar | [`packages/editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/editor/App.tsx#L512-L514) | 512-514 |
| Servidor processa Bear | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L250-L257) | 250-257 |

**Funções principais**:
- `saveToBear(config: BearConfig)`: Salva o plano no Bear via x-callback-url
- `extractTags(markdown: string)`: Extrai tags inteligentemente do conteúdo do plano (máximo de 7)
- `extractTitle(markdown: string)`: Extrai o título da nota do H1 do plano
- `getBearSettings()`: Lê as configurações de integração Bear do localStorage
- `saveBearSettings(settings)`: Salva as configurações de integração Bear no localStorage

**Constantes principais**:
- `STORAGE_KEY_ENABLED = 'plannotator-bear-enabled'`: Nome da chave das configurações Bear no localStorage

**Formato da URL Bear**:
```typescript
bear://x-callback-url/create?title={title}&text={content}&open_note=no
```

</details>
