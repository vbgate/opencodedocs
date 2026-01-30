---
title: "Compartilhamento por URL: Colaboração sem Backend | Plannotator"
sidebarTitle: "Compartilhar com a Equipe"
subtitle: "Compartilhamento por URL: Colaboração sem Backend"
description: "Aprenda a funcionalidade de compartilhamento por URL do Plannotator. Colabore sem backend usando compressão deflate e codificação Base64, configure variáveis de ambiente e resolva problemas comuns de compartilhamento."
tags:
  - "Compartilhamento por URL"
  - "Colaboração em Equipe"
  - "Sem Backend"
  - "Compressão Deflate"
  - "Codificação Base64"
  - "Segurança"
prerequisite:
  - "start-getting-started"
  - "platforms-plan-review-basics"
order: 1
---

# Compartilhamento por URL: Colaboração de Planos sem Backend

## O Que Você Vai Aprender

- ✅ Compartilhar planos e anotações via URL, sem necessidade de login ou servidor
- ✅ Entender como a compressão deflate e codificação Base64 incorporam dados no hash da URL
- ✅ Distinguir entre modo de compartilhamento (somente leitura) e modo local (editável)
- ✅ Configurar a variável de ambiente `PLANNOTATOR_SHARE` para controlar o compartilhamento
- ✅ Lidar com limites de tamanho de URL e falhas de compartilhamento

## Seu Problema Atual

**Problema 1**: Você quer que membros da equipe revisem planos gerados por IA, mas não tem uma plataforma de colaboração.

**Problema 2**: Compartilhar revisões via capturas de tela ou texto copiado não permite que outros vejam suas anotações diretamente.

**Problema 3**: Implantar um servidor de colaboração online é caro, ou a política de segurança da empresa não permite.

**Problema 4**: Você precisa de uma forma simples e rápida de compartilhar, mas não sabe como garantir a privacidade dos dados.

**O Plannotator pode ajudar**:
- Sem necessidade de servidor backend, todos os dados são comprimidos na URL
- O link compartilhado contém o plano completo e anotações, o destinatário pode visualizar
- Os dados não saem do seu dispositivo local, garantindo privacidade
- A URL gerada pode ser copiada para qualquer ferramenta de comunicação

## Quando Usar Este Recurso

**Cenários de uso**:
- Precisa que membros da equipe revisem planos de implementação gerados por IA
- Quer compartilhar resultados de revisão de código com colegas
- Precisa salvar conteúdo de revisão em notas (integração com Obsidian/Bear)
- Obter feedback rápido de outros sobre um plano

**Cenários não adequados**:
- Precisa de edição colaborativa em tempo real (compartilhamento do Plannotator é somente leitura)
- Conteúdo do plano excede o limite de tamanho da URL (geralmente milhares de linhas)
- Conteúdo compartilhado contém informações sensíveis (a URL em si não é criptografada)

::: warning Aviso de Segurança
A URL compartilhada contém o plano completo e anotações. Não compartilhe conteúdo com informações sensíveis (como chaves de API, senhas, etc.). A URL compartilhada pode ser acessada por qualquer pessoa e não expira automaticamente.
:::

## Conceito Principal

### O Que é Compartilhamento por URL

**Compartilhamento por URL** é um método de colaboração sem backend fornecido pelo Plannotator, que comprime planos e anotações no hash da URL, permitindo compartilhamento sem servidor.

::: info Por que "sem backend"?
Soluções tradicionais de colaboração requerem um servidor backend para armazenar planos e anotações, com usuários acessando via ID ou token. O compartilhamento por URL do Plannotator não depende de nenhum backend—todos os dados estão na URL, e o destinatário pode analisar o conteúdo simplesmente abrindo o link. Isso garante privacidade (dados não são enviados) e simplicidade (sem necessidade de implantar serviços).
:::

### Como Funciona

```
┌─────────────────────────────────────────────────────────┐
│  Usuário A (Compartilhador)                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Revisar plano, adicionar anotações                 │
│     ┌──────────────────────┐                           │
│     │ Plan: Plano de impl. │                           │
│     │ Annotations: [       │                           │
│     │   {type: 'REPLACE'},│                           │
│     │   {type: 'COMMENT'}  │                           │
│     │ ]                   │                           │
│     └──────────────────────┘                           │
│              │                                         │
│              ▼                                         │
│  2. Clicar em Export → Share                           │
│              │                                         │
│              ▼                                         │
│  3. Comprimir dados                                    │
│     JSON → deflate → Base64 → Caracteres seguros p/ URL│
│     ↓                                                │
│     https://share.plannotator.ai/#eJyrVkrLz1...       │
│                                                         │
└─────────────────────────────────────────────────────────┘
                         │
                         │ Copiar URL
                         ▼
┌─────────────────────────────────────────────────────────┐
│  Usuário B (Destinatário)                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Abrir URL compartilhada                            │
│     https://share.plannotator.ai/#eJyrVkrLz1...       │
│              │                                         │
│              ▼                                         │
│  2. Navegador analisa o hash                           │
│     Caracteres seguros → Decodificar Base64 → Descomprimir deflate → JSON│
│              │                                         │
│              ▼                                         │
│  3. Restaurar plano e anotações                        │
│     ┌──────────────────────┐                           │
│     │ Plan: Plano de impl. │  ✅ Modo somente leitura │
│     │ Annotations: [       │  (não pode enviar decisões)│
│     │   {type: 'REPLACE'},│                           │
│     │   {type: 'COMMENT'}  │                           │
│     │ ]                   │                           │
│     └──────────────────────┘                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Detalhes do Algoritmo de Compressão

**Passo 1: Serialização JSON**
```json
{
  "p": "# Plan\n\nStep 1...",
  "a": [
    ["R", "old text", "new text", null, null],
    ["C", "context", "comment text", null, null]
  ],
  "g": ["image1.png", "image2.png"]
}
```

**Passo 2: Compressão Deflate-raw**
- Usa a API nativa `CompressionStream('deflate-raw')`
- Taxa de compressão típica de 60-80% (depende da repetição do texto, não definido no código-fonte)
- Localização no código: `packages/ui/utils/sharing.ts:34`

**Passo 3: Codificação Base64**
```typescript
const base64 = btoa(String.fromCharCode(...compressed));
```

**Passo 4: Substituição de Caracteres Seguros para URL**
```typescript
base64
  .replace(/\+/g, '-')   // + → -
  .replace(/\//g, '_')   // / → _
  .replace(/=/g, '');    // = → '' (remover padding)
```

::: tip Por que substituir caracteres especiais?
Certos caracteres têm significados especiais em URLs (como `+` representa espaço, `/` é separador de caminho). A codificação Base64 pode incluir esses caracteres, causando erros de análise da URL. Substituir por `-` e `_` torna a URL segura e copiável.
:::

### Otimização do Formato de Anotações

Para eficiência de compressão, o Plannotator usa um formato compacto de anotações (`ShareableAnnotation`):

| Annotation Original | Formato Compacto | Descrição |
| --- | --- | --- |
| `{type: 'DELETION', originalText: '...', text: undefined, ...}` | `['D', 'old text', null, images?]` | D = Deletion, null indica sem texto |
| `{type: 'REPLACEMENT', originalText: '...', text: 'new...', ...}` | `['R', 'old text', 'new text', null, images?]` | R = Replacement |
| `{type: 'COMMENT', originalText: '...', text: 'comment...', ...}` | `['C', 'old text', 'comment text', null, images?]` | C = Comment |
| `{type: 'INSERTION', originalText: '...', text: 'new...', ...}` | `['I', 'context', 'new text', null, images?]` | I = Insertion |
| `{type: 'GLOBAL_COMMENT', text: '...', ...}` | `['G', 'comment text', null, images?]` | G = Global comment |

Ordem de campos fixa, nomes de chaves omitidos, reduzindo significativamente o tamanho dos dados. Localização no código: `packages/ui/utils/sharing.ts:76`

### Estrutura da URL de Compartilhamento

```
https://share.plannotator.ai/#<compressed_data>
                            ↑
                        parte do hash
```

- **Domínio base**: `share.plannotator.ai` (página de compartilhamento independente)
- **Separador de hash**: `#` (não é enviado ao servidor, analisado inteiramente pelo frontend)
- **Dados comprimidos**: JSON comprimido codificado em Base64url

## 🎒 Preparação

**Pré-requisitos**:
- ✅ Concluiu [Fundamentos de Revisão de Planos](../../platforms/plan-review-basics/), entende como adicionar anotações
- ✅ Concluiu [Tutorial de Anotações de Planos](../../platforms/plan-review-annotations/), conhece os tipos de anotações
- ✅ Navegador suporta API `CompressionStream` (todos os navegadores modernos suportam)

**Verificar se o compartilhamento está habilitado**:
```bash
# Habilitado por padrão
echo $PLANNOTATOR_SHARE

# Para desabilitar (ex: política de segurança corporativa)
export PLANNOTATOR_SHARE=disabled
```

::: info Explicação da Variável de Ambiente
`PLANNOTATOR_SHARE` controla o estado de habilitação do compartilhamento:
- **Não definido ou diferente de "disabled"**: Compartilhamento habilitado
- **Definido como "disabled"**: Compartilhamento desabilitado (Export Modal mostra apenas a aba Raw Diff)

Localização no código: `apps/hook/server/index.ts:44`, `apps/opencode-plugin/index.ts:50`
:::

**Verificar compatibilidade do navegador**:
```bash
# Execute no console do navegador
const stream = new CompressionStream('deflate-raw');
console.log('CompressionStream supported');
```

Se aparecer `CompressionStream supported`, o navegador é compatível. Navegadores modernos (Chrome 80+, Firefox 113+, Safari 16.4+) são todos compatíveis.

## Passo a Passo

### Passo 1: Completar a Revisão do Plano

**Por quê**
Antes de compartilhar, você precisa completar a revisão, incluindo adicionar anotações.

**Ação**:
1. Acione a revisão de plano no Claude Code ou OpenCode
2. Visualize o conteúdo do plano, selecione o texto que precisa de modificação
3. Adicione anotações (exclusão, substituição, comentário, etc.)
4. (Opcional) Faça upload de anexos de imagem

**Você deve ver**:
```
┌─────────────────────────────────────────────────────────────┐
│  Plan Review                                              │
├─────────────────────────────────────────────────────────────┤
│                                                           │
│  # Implementation Plan                                    │
│                                                           │
│  ## Phase 1: Setup                                      │
│  Set up WebSocket server on port 8080                    │
│                                                           │
│  ## Phase 2: Authentication                             │
│  Implement JWT authentication middleware                   │
│                    ┌─────────────────────┐               │
│  ━━━━━━━━━━━━━━━━│ Replace: "implement" │               │
│                    └─────────────────────┘               │
│                                                           │
│  Annotation Panel                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ REPLACE: "implement" → "add"                      │  │
│  │ JWT is overkill, use simple session tokens         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                           │
│  [Approve] [Request Changes] [Export]                   │
└─────────────────────────────────────────────────────────────┘
```

### Passo 2: Abrir o Export Modal

**Por quê**
O Export Modal fornece o ponto de entrada para gerar a URL de compartilhamento.

**Ação**:
1. Clique no botão **Export** no canto superior direito
2. Aguarde o Export Modal abrir

**Você deve ver**:
```
┌─────────────────────────────────────────────────────────────┐
│  Export                                     ×             │
│  1 annotation                          Share | Raw Diff   │
├─────────────────────────────────────────────────────────────┤
│                                                           │
│  Shareable URL                                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ https://share.plannotator.ai/#eJyrVkrLz1...        │ │
│  │                                              [Copy] │ │
│  │                                           3.2 KB    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                           │
│  This URL contains full plan and all annotations.          │
│  Anyone with this link can view and add to your annotations.│
│                                                           │
└─────────────────────────────────────────────────────────────┘
```

::: tip Dica de Tamanho da URL
O canto inferior direito mostra o tamanho da URL em bytes (ex: 3.2 KB). Se a URL for muito longa (mais de 8 KB), considere reduzir o número de anotações ou anexos de imagem.
:::

### Passo 3: Copiar a URL de Compartilhamento

**Por quê**
Após copiar a URL, você pode colá-la em qualquer ferramenta de comunicação (Slack, Email, WeChat, etc.).

**Ação**:
1. Clique no botão **Copy**
2. Aguarde o botão mudar para **Copied!**
3. A URL foi copiada para a área de transferência

**Você deve ver**:
```
┌─────────────────────────────────────────────────────────────┐
│  Shareable URL                                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ https://share.plannotator.ai/#eJyrVkrLz1...        │ │
│  │                                    ✓ Copied         │ │
│  │                                           3.2 KB    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

::: tip Seleção Automática
Clicar na caixa de entrada da URL seleciona automaticamente todo o conteúdo, facilitando a cópia manual (se não usar o botão Copy).
:::

### Passo 4: Compartilhar a URL com Colaboradores

**Por quê**
Os colaboradores podem visualizar o plano e as anotações abrindo a URL.

**Ação**:
1. Cole a URL na ferramenta de comunicação (Slack, Email, etc.)
2. Envie para os membros da equipe

**Exemplo de mensagem**:
```
Olá @equipe,

Por favor, ajudem a revisar este plano de implementação:
https://share.plannotator.ai/#eJyrVkrLz1...

Adicionei uma anotação de substituição na Fase 2, acredito que JWT é muito complexo.

Por favor, deem seu feedback, obrigado!
```

### Passo 5: Colaborador Abre a URL Compartilhada (Lado do Destinatário)

**Por quê**
O colaborador precisa abrir a URL no navegador para visualizar o conteúdo.

**Ação** (executada pelo colaborador):
1. Clique na URL compartilhada
2. Aguarde a página carregar

**Você deve ver** (perspectiva do colaborador):
```
┌─────────────────────────────────────────────────────────────┐
│  Plan Review                               Read-only     │
├─────────────────────────────────────────────────────────────┤
│                                                           │
│  # Implementation Plan                                    │
│                                                           │
│  ## Phase 1: Setup                                      │
│  Set up WebSocket server on port 8080                    │
│                                                           │
│  ## Phase 2: Authentication                             │
│  Implement JWT authentication middleware                   │
│                    ┌─────────────────────┐               │
│  ━━━━━━━━━━━━━━━━│ Replace: "implement" │               │
│  │                  └─────────────────────┘               │
│  │ This annotation was shared by [Your Name]             │
│                                                           │
│  Annotation Panel                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ REPLACE: "implement" → "add"                      │  │
│  │ JWT is overkill, use simple session tokens         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                           │
│  [View Only Mode - Approve and Deny disabled]            │
└─────────────────────────────────────────────────────────────┘
```

::: warning Modo Somente Leitura
Após abrir a URL compartilhada, a interface mostra o rótulo "Read-only" no canto superior direito, e os botões Approve e Deny estão desabilitados. O colaborador pode visualizar o plano e as anotações, mas não pode enviar decisões.
:::

::: info Processo de Descompressão
Quando o colaborador abre a URL, o navegador executa automaticamente os seguintes passos (acionados pelo Hook `useSharing`):
1. Extrai os dados comprimidos de `window.location.hash`
2. Executa em ordem reversa: Decodificação Base64 → Descompressão deflate → Análise JSON
3. Restaura o plano e as anotações
4. Limpa o hash da URL (evita recarregar ao atualizar)

Localização no código: `packages/ui/hooks/useSharing.ts:67`
:::

### Checkpoint ✅

**Verificar se a URL de compartilhamento é válida**:
1. Copie a URL de compartilhamento
2. Abra em uma nova aba ou modo anônimo
3. Confirme que mostra o mesmo plano e anotações

**Verificar modo somente leitura**:
1. O colaborador abre a URL compartilhada
2. Verifique se há o rótulo "Read-only" no canto superior direito
3. Confirme que os botões Approve e Deny estão desabilitados

**Verificar tamanho da URL**:
1. Veja o tamanho da URL no Export Modal
2. Confirme que não excede 8 KB (se exceder, considere reduzir anotações)

## Armadilhas Comuns

### Problema 1: Botão de Compartilhamento por URL Não Aparece

**Sintoma**: O Export Modal não tem a aba Share, apenas Raw Diff.

**Causa**: A variável de ambiente `PLANNOTATOR_SHARE` está definida como "disabled".

**Solução**:
```bash
# Verificar valor atual
echo $PLANNOTATOR_SHARE

# Remover ou definir outro valor
unset PLANNOTATOR_SHARE
# ou
export PLANNOTATOR_SHARE=enabled
```

Localização no código: `apps/hook/server/index.ts:44`

### Problema 2: URL Compartilhada Abre Página em Branco

**Sintoma**: O colaborador abre a URL, mas a página não tem conteúdo.

**Causa**: O hash da URL foi perdido ou truncado durante a cópia.

**Solução**:
1. Certifique-se de copiar a URL completa (incluindo `#` e todos os caracteres após)
2. Não use serviços de encurtamento de URL (podem truncar o hash)
3. Use o botão Copy no Export Modal, em vez de copiar manualmente

::: tip Tamanho do Hash da URL
A parte do hash da URL compartilhada geralmente tem milhares de caracteres, fácil de perder ao copiar manualmente. Recomenda-se usar o botão Copy ou copiar → colar duas vezes para verificar a integridade.
:::

### Problema 3: URL Muito Longa, Não Pode Ser Enviada

**Sintoma**: A URL excede o limite de caracteres da ferramenta de comunicação (como WeChat, Slack).

**Causa**: O conteúdo do plano é muito longo ou há muitas anotações.

**Solução**:
1. Remova anotações desnecessárias
2. Reduza anexos de imagem
3. Considere usar a exportação Raw Diff e salvar como arquivo
4. Use o recurso de revisão de código (modo diff tem maior taxa de compressão)

### Problema 4: Colaborador Não Consegue Ver Minhas Imagens

**Sintoma**: A URL compartilhada contém caminhos de imagem, mas o colaborador vê "Image not found".

**Causa**: As imagens estão salvas no diretório local `/tmp/plannotator/`, inacessível ao colaborador.

**Solução**:
- O compartilhamento por URL do Plannotator não suporta acesso a imagens entre dispositivos
- Recomenda-se usar a integração com Obsidian, onde as imagens são salvas no vault e podem ser compartilhadas
- Ou faça capturas de tela e incorpore nas anotações (descrição em texto)

Localização no código: `packages/server/index.ts:163` (caminho de salvamento de imagens)

### Problema 5: Anotações Modificadas Após Compartilhar, URL Não Atualizada

**Sintoma**: Após adicionar novas anotações, a URL no Export Modal não muda.

**Causa**: O estado `shareUrl` não foi atualizado automaticamente (caso raro, geralmente problema de atualização de estado do React).

**Solução**:
1. Feche o Export Modal
2. Reabra o Export Modal
3. A URL deve atualizar automaticamente para o conteúdo mais recente

Localização no código: `packages/ui/hooks/useSharing.ts:128` (função `refreshShareUrl`)

## Resumo da Lição

A **funcionalidade de compartilhamento por URL** permite compartilhar planos e anotações sem servidor backend:

- ✅ **Sem backend**: Dados comprimidos no hash da URL, não depende de servidor
- ✅ **Privacidade segura**: Dados não são enviados, apenas transferidos entre você e o colaborador
- ✅ **Simples e eficiente**: Gere URL com um clique, copie e cole para compartilhar
- ✅ **Modo somente leitura**: Colaboradores podem visualizar e adicionar anotações, mas não podem enviar decisões

**Princípios técnicos**:
1. **Compressão Deflate-raw**: Comprime dados JSON em aproximadamente 60-80%
2. **Codificação Base64**: Converte dados binários em texto
3. **Substituição de caracteres seguros para URL**: `+` → `-`, `/` → `_`, `=` → `''`
4. **Análise do hash**: Frontend descomprime e restaura conteúdo automaticamente

**Opções de configuração**:
- `PLANNOTATOR_SHARE=disabled`: Desabilita a funcionalidade de compartilhamento
- Padrão habilitado: Funcionalidade de compartilhamento disponível

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos sobre **[Integração com Obsidian](../obsidian-integration/)**.
>
> Você aprenderá:
> - Detecção automática de vaults do Obsidian
> - Salvar planos aprovados no Obsidian
> - Geração automática de frontmatter e tags
> - Combinar compartilhamento por URL com gerenciamento de conhecimento do Obsidian

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos sobre **[Integração com Obsidian](../obsidian-integration/)**.
>
> Você aprenderá:
> - Como configurar a integração com Obsidian para salvar planos automaticamente no vault
> - Entender o mecanismo de geração de frontmatter e tags
> - Usar backlinks para construir um grafo de conhecimento

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver as localizações no código-fonte</strong></summary>

> Atualizado em: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Comprimir dados (deflate + Base64) | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L30-L48) | 30-48 |
| Descomprimir dados | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L53-L71) | 53-71 |
| Converter formato de anotações (compacto) | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L76-L95) | 76-95 |
| Restaurar formato de anotações | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L102-L155) | 102-155 |
| Gerar URL de compartilhamento | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L162-L175) | 162-175 |
| Analisar hash da URL | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L181-L194) | 181-194 |
| Formatar tamanho da URL | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L199-L205) | 199-205 |
| Hook de compartilhamento por URL | [`packages/ui/hooks/useSharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/hooks/useSharing.ts#L45-L155) | 45-155 |
| UI do Export Modal | [`packages/ui/components/ExportModal.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ExportModal.tsx#L1-L196) | 1-196 |
| Configuração do switch de compartilhamento (Hook) | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L44) | 44 |
| Configuração do switch de compartilhamento (OpenCode) | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L50) | 50 |

**Constantes principais**:
- `SHARE_BASE_URL = 'https://share.plannotator.ai'`: Domínio base da página de compartilhamento

**Funções principais**:
- `compress(payload: SharePayload): Promise<string>`: Comprime payload para string base64url
- `decompress(b64: string): Promise<SharePayload>`: Descomprime string base64url para payload
- `toShareable(annotations: Annotation[]): ShareableAnnotation[]`: Converte anotações completas para formato compacto
- `fromShareable(data: ShareableAnnotation[]): Annotation[]`: Restaura formato compacto para anotações completas
- `generateShareUrl(markdown, annotations, attachments): Promise<string>`: Gera URL de compartilhamento completa
- `parseShareHash(): Promise<SharePayload | null>`: Analisa o hash da URL atual

**Tipos de dados**:
```typescript
interface SharePayload {
  p: string;  // plan markdown
  a: ShareableAnnotation[];
  g?: string[];  // global attachments
}

type ShareableAnnotation =
  | ['D', string, string | null, string[]?]  // Deletion
  | ['R', string, string, string | null, string[]?]  // Replacement
  | ['C', string, string, string | null, string[]?]  // Comment
  | ['I', string, string, string | null, string[]?]  // Insertion
  | ['G', string, string | null, string[]?];  // Global Comment
```

</details>
