---
title: "Anotação de Imagens: Três Ferramentas de Marcação | Plannotator"
sidebarTitle: "Três Ferramentas para Anotar Imagens"
subtitle: "Anotação de Imagens: Três Ferramentas de Marcação"
description: "Aprenda as três principais ferramentas de anotação de imagens do Plannotator. Anexe imagens em revisões de planos, use pincel, seta e círculo para marcar, com suporte a ajuste de cores e atalhos de teclado."
tags:
  - "anotação de imagens"
  - "pincel"
  - "seta"
  - "círculo"
  - "atalhos de teclado"
  - "revisão de planos"
  - "revisão de código"
prerequisite:
  - "platforms-plan-review-basics"
order: 3
---

# Adicionar Anotações em Imagens: Marque com Pincel, Seta e Círculo

## O Que Você Vai Aprender

- ✅ Anexar imagens em revisões de planos ou código
- ✅ Usar a ferramenta pincel para desenho livre
- ✅ Usar a ferramenta seta para destacar áreas importantes
- ✅ Usar a ferramenta círculo para selecionar regiões
- ✅ Ajustar cores e tamanho do traço das anotações
- ✅ Usar atalhos de teclado para alternar ferramentas rapidamente

## Seu Desafio Atual

**Problema 1**: Ao revisar designs de UI ou fluxogramas, descrições em texto não são intuitivas o suficiente — você precisa circular as áreas problemáticas.

**Problema 2**: Quer adicionar capturas de tela com comentários em revisões de código, mas só consegue escrever "há um problema aqui" sem poder marcar diretamente na imagem.

**Problema 3**: Recebeu um link de imagem compartilhado pela equipe e quer fazer anotações rápidas, mas não quer baixar e usar outra ferramenta.

**O Plannotator pode ajudar**:
- Anote imagens diretamente no navegador, sem precisar baixar
- Três ferramentas — pincel, seta e círculo — cobrem todos os cenários de anotação
- Cinco cores e cinco tamanhos de traço para ajuste flexível
- Atalhos de teclado para maior eficiência

## Quando Usar Esta Técnica

**Cenários de uso**:
- Revisar designs de UI, fluxogramas ou diagramas de arquitetura que precisam de marcações
- Adicionar capturas de tela com anotações em revisões de código
- Compartilhar imagens anotadas com membros da equipe
- Circular áreas importantes ou adicionar setas indicativas em imagens

## 🎒 Antes de Começar

::: warning Pré-requisitos

Este tutorial assume que você já:

- ✅ Completou [Fundamentos da Revisão de Planos](../plan-review-basics/) ou [Fundamentos da Revisão de Código](../code-review-basics/)
- ✅ Sabe como abrir a página de revisão de planos ou código
- ✅ Entende as operações básicas de comentários

:::

## Conceito Principal

**Três ferramentas de anotação de imagens**:

| Ferramenta | Ícone | Atalho | Uso |
| --- | --- | --- | --- |
| **Pincel** | 🖊️ | 1 | Desenho livre, ideal para anotações manuscritas e seleção de formas arbitrárias |
| **Seta** | ➡️ | 2 | Destacar áreas importantes ou indicar direção, ideal para marcações ponto a ponto |
| **Círculo** | ⭕ | 3 | Selecionar regiões, ideal para destacar elementos específicos |

**Fluxo de trabalho**:
```
Enviar imagem → Selecionar ferramenta → Ajustar cor e tamanho → Desenhar na imagem → Salvar
```

## Siga Comigo

### Passo 1: Abrir a Página de Revisão de Planos ou Código

**Por quê**
A funcionalidade de anotação de imagens do Plannotator está integrada nas revisões de planos e código.

**Ação**

1. Inicie uma revisão de planos (acionada pelo Claude Code ou chamando submit_plan no OpenCode)
2. Ou execute o comando `/plannotator-review` para iniciar uma revisão de código

**Você deve ver**:
- O navegador abre a página de revisão
- No canto superior direito há um botão "Upload" ou "Anexo"

### Passo 2: Enviar uma Imagem

**Por quê**
Você precisa enviar uma imagem antes de poder anotá-la.

**Ação**

1. Clique no botão "Upload" ou "Anexo" no canto superior direito da página
2. Selecione a imagem que deseja anotar (formatos suportados: PNG, JPEG, WebP)
3. Após o envio, a imagem aparecerá na lista de comentários

**Você deve ver**:
- Uma miniatura da imagem aparece na área de comentários
- Clicar na miniatura abre o editor de anotações

::: tip Fontes de Imagem
Você pode obter imagens das seguintes formas:
- Capturar tela e colar (Ctrl+V / Cmd+V)
- Selecionar de arquivos locais
- Arrastar e soltar imagem na página
:::

### Passo 3: Abrir o Editor de Anotações de Imagem

**Por quê**
O editor de anotações fornece ferramentas de desenho e seleção de cores.

**Ação**

1. Clique na miniatura da imagem enviada
2. O editor de anotações abrirá em uma janela modal

**Você deve ver**:
- A imagem centralizada na tela
- Uma barra de ferramentas no topo
- Da esquerda para direita: seleção de ferramenta, tamanho do traço, seleção de cor, desfazer, limpar, salvar

### Passo 4: Usar a Ferramenta Pincel para Desenho Livre

**Por quê**
A ferramenta pincel é ideal para anotações manuscritas ou seleção de formas arbitrárias.

**Ação**

1. Certifique-se de que a ferramenta pincel está selecionada (ícone 🖊️, selecionada por padrão)
2. Pressione o botão esquerdo do mouse e desenhe na imagem
3. Solte o mouse para finalizar o desenho

**Você deve ver**:
- O traço seguindo o movimento do mouse
- Após soltar o mouse, a forma desenhada fica fixa na imagem

::: info Características do Pincel
- Usa a biblioteca perfect-freehand para efeito de desenho suave
- Suporta sensibilidade à pressão (se seu dispositivo suportar)
- Quanto mais grosso o traço, mais suave a linha
:::

### Passo 5: Usar a Ferramenta Seta para Destacar Pontos Importantes

**Por quê**
Setas são ideais para marcações ponto a ponto, indicando claramente a localização do problema.

**Ação**

1. Clique na ferramenta seta (ícone ➡️) ou pressione o atalho `2`
2. Clique na imagem para definir o ponto inicial da seta
3. Arraste até a posição de destino e solte o mouse para completar a seta

**Você deve ver**:
- Uma linha reta do ponto inicial ao ponto final
- Uma ponta de seta no ponto final, apontando para o destino

::: tip Dicas para Desenhar Setas
- O **ponto inicial** é a cauda da seta, o **ponto final** é a ponta
- Durante o arraste, você pode visualizar a direção da seta em tempo real
- Ideal para marcar "há um problema aqui" ou "precisa modificar isso"
:::

### Passo 6: Usar a Ferramenta Círculo para Selecionar Regiões

**Por quê**
Círculos são ideais para destacar elementos específicos, com seleção de área clara.

**Ação**

1. Clique na ferramenta círculo (ícone ⭕) ou pressione o atalho `3`
2. Clique na imagem para definir uma borda do círculo
3. Arraste até a borda oposta e solte o mouse para completar o círculo

**Você deve ver**:
- Um círculo onde a linha conectando o ponto inicial e final é o diâmetro
- O centro do círculo é o ponto médio entre os dois pontos

::: details Princípio de Desenho do Círculo

A ferramenta círculo desenha de borda a borda:
- **1º clique**: Uma borda do círculo
- **Arraste**: Define o diâmetro do círculo
- **Solte**: Completa o círculo

Implementação no código-fonte (`utils.ts:95-124`):
```typescript
// O centro é o ponto médio entre início e fim
const cx = (x1 + x2) / 2;
const cy = (y1 + y2) / 2;

// O raio é metade da distância entre os dois pontos
const radius = Math.hypot(x2 - x1, y2 - y1) / 2;
```

:::

### Passo 7: Ajustar a Cor da Anotação

**Por quê**
Cores diferentes podem distinguir tipos de anotações (ex: vermelho para erros, verde para sugestões).

**Ação**

1. Clique no círculo de cor na barra de ferramentas
2. Cores disponíveis: vermelho, amarelo, verde, azul, branco

**Você deve ver**:
- O círculo da cor selecionada aparece ampliado
- Todas as novas anotações usarão a cor atual

::: info Sugestões de Uso de Cores
- **Vermelho**: Erros, problemas, conteúdo a ser removido
- **Amarelo**: Avisos, atenção, pontos que precisam de confirmação
- **Verde**: Sugestões, otimizações, melhorias
- **Azul**: Informações adicionais, notas
- **Branco**: Adequado para imagens com fundo escuro
:::

### Passo 8: Ajustar o Tamanho do Traço

**Por quê**
Diferentes tamanhos de traço são adequados para diferentes cenários de anotação.

**Ação**

1. Clique nos botões `-` ou `+` na barra de ferramentas
2. Ou observe a prévia do tamanho atual do traço (um ponto)

**Você deve ver**:
- Tamanhos de traço disponíveis: 3, 6, 10, 16, 24
- A prévia do tamanho atual aparece no centro da barra de ferramentas

::: tip Sugestões de Tamanho de Traço
- **3**: Anotações precisas em elementos pequenos (botões, ícones)
- **6**: Anotações regulares (valor padrão)
- **10**: Traços grossos, adequado para circular áreas maiores
- **16**: Traços muito grossos, adequado para enfatizar pontos importantes
- **24**: Traço máximo, adequado para destacar áreas muito grandes
:::

### Passo 9: Desfazer e Limpar

**Por quê**
É inevitável cometer erros durante a anotação — você precisa desfazer ou recomeçar.

**Ação**

1. **Desfazer último passo**: Clique no ícone desfazer (↩️) ou pressione `Cmd+Z` / `Ctrl+Z`
2. **Limpar todas as anotações**: Clique no ícone limpar (❌)

**Você deve ver**:
- Desfazer: A última anotação desenhada desaparece
- Limpar: Todas as anotações são removidas, voltando à imagem original

::: warning Aviso sobre Limpar
A operação de limpar não pode ser desfeita. Use com cuidado. Recomenda-se usar desfazer para voltar gradualmente.
:::

### Passo 10: Salvar Anotações

**Por quê**
Após salvar, a imagem será mesclada ao comentário e poderá ser visualizada na revisão.

**Ação**

1. Clique no ícone salvar (✅) no lado direito da barra de ferramentas
2. Ou pressione `Esc` ou `Enter`
3. Ou clique fora da janela modal

**Você deve ver**:
- A janela modal fecha
- A miniatura da imagem é atualizada com a versão anotada
- A imagem está anexada ao comentário atual

::: tip Mecanismo de Salvamento
- Se **nenhuma anotação foi desenhada**, a imagem original é salva diretamente
- Se **há anotações**, a imagem original e as anotações são mescladas em uma nova imagem
- A imagem mesclada é salva em formato PNG, mantendo alta qualidade
:::

## Checkpoint ✅

**Verifique seu aprendizado**:

- [ ] Consegue enviar imagens para a página de revisão
- [ ] Consegue usar as três ferramentas (pincel, seta, círculo) para desenhar anotações
- [ ] Consegue ajustar cores e tamanho do traço das anotações
- [ ] Consegue usar atalhos (1/2/3, Cmd+Z, Esc) para operações rápidas
- [ ] Consegue desfazer anotações erradas
- [ ] Consegue salvar imagens anotadas

## Armadilhas Comuns

### Problema 1: Direção da Seta Invertida

**Sintoma**: A seta aponta para a direção errada.

**Causa**: A ferramenta seta desenha do ponto inicial (cauda) ao ponto final (ponta).

**Solução**:
- Redesenhe, garantindo que o ponto inicial seja a cauda e o ponto final seja a ponta
- Se já desenhou, desfaça e redesenhe

### Problema 2: Posição do Círculo Incorreta

**Sintoma**: O círculo não selecionou a área desejada.

**Causa**: A ferramenta círculo desenha de borda a borda, com o centro no ponto médio.

**Solução**:
- Primeiro clique na borda da área alvo
- Arraste até a borda oposta, garantindo que a área alvo fique dentro do círculo
- Se necessário, desfaça e redesenhe

### Problema 3: Traço Muito Grosso ou Fino

**Sintoma**: O efeito da anotação não está ideal.

**Causa**: O tamanho do traço não é adequado para o cenário atual.

**Solução**:
- Use os botões `-` ou `+` na barra de ferramentas para ajustar o tamanho
- Elementos pequenos: 3-6, áreas grandes: 10-24

### Problema 4: Cor Não Visível

**Sintoma**: Usando traço preto em fundo escuro, a anotação não é visível.

**Causa**: Escolha inadequada de cor.

**Solução**:
- Fundos escuros: use branco ou amarelo
- Fundos claros: use vermelho, verde ou azul

## Referência Rápida de Atalhos

| Atalho | Função |
| --- | --- |
| `1` | Alternar para ferramenta pincel |
| `2` | Alternar para ferramenta seta |
| `3` | Alternar para ferramenta círculo |
| `Cmd+Z` / `Ctrl+Z` | Desfazer último passo |
| `Esc` / `Enter` | Salvar anotações |

## Resumo da Lição

Nesta lição você aprendeu:

1. **Enviar imagens**: Via botão de upload ou colando na página de revisão
2. **Três ferramentas de anotação**:
   - Pincel (1): Desenho livre, ideal para anotações manuscritas
   - Seta (2): Marcação ponto a ponto, ideal para indicar pontos importantes
   - Círculo (3): Seleção de região, ideal para destacar elementos
3. **Ajustar estilo de anotação**: 5 cores, 5 tamanhos de traço
4. **Desfazer e limpar**: Corrigir anotações erradas
5. **Salvar anotações**: Mesclar anotações na imagem

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos **[Fundamentos da Revisão de Código](../code-review-basics/)**.
>
> Você vai aprender:
> - Como usar o comando /plannotator-review para revisar git diff
> - Alternar entre visualizações side-by-side e unified
> - Clicar em números de linha para selecionar intervalos de código
> - Adicionar comentários por linha (comment/suggestion/concern)
> - Alternar entre diferentes tipos de diff
> - Enviar feedback para o AI Agent

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Definição de tipos de ferramentas | [`packages/ui/components/ImageAnnotator/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ImageAnnotator/types.ts#L1-L40) | 1-40 |
| Funções de renderização | [`packages/ui/components/ImageAnnotator/utils.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ImageAnnotator/utils.ts#L1-L148) | 1-148 |
| Componente principal | [`packages/ui/components/ImageAnnotator/index.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ImageAnnotator/index.tsx#L1-L233) | 1-233 |
| Componente da barra de ferramentas | [`packages/ui/components/ImageAnnotator/Toolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ImageAnnotator/Toolbar.tsx#L1-L219) | 1-219 |
| Interface Annotation | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L11-L33) | 11-33 |

**Tipos principais**:

**Tool** (tipo de ferramenta):
```typescript
export type Tool = 'pen' | 'arrow' | 'circle';
```

**Point** (ponto de coordenada):
```typescript
export interface Point {
  x: number;
  y: number;
  pressure?: number;
}
```

**Stroke** (traço):
```typescript
export interface Stroke {
  id: string;
  tool: Tool;
  points: Point[];
  color: string;
  size: number;
}
```

**AnnotatorState** (estado do anotador):
```typescript
export interface AnnotatorState {
  tool: Tool;
  color: string;
  strokeSize: number;
  strokes: Stroke[];
  currentStroke: Stroke | null;
}
```

**COLORS** (array de cores):
```typescript
export const COLORS = [
  '#ef4444', // vermelho
  '#eab308', // amarelo
  '#22c55e', // verde
  '#3b82f6', // azul
  '#ffffff', // branco
] as const;
```

**STROKE_SIZES** (tamanhos de traço):
```typescript
const STROKE_SIZES = [3, 6, 10, 16, 24];
```

**Funções principais**:

**renderPenStroke()** (renderizar traço do pincel):
- Usa a biblioteca perfect-freehand para efeito de desenho suave
- Suporta sensibilidade à pressão (campo pressure)

**renderArrow()** (renderizar seta):
- Desenha uma linha reta do ponto inicial ao ponto final
- Desenha a ponta da seta no ponto final

**renderCircle()** (renderizar círculo):
- Calcula o ponto médio entre os dois pontos como centro
- Calcula metade da distância entre os dois pontos como raio

**renderStroke()** (renderizar por tipo de ferramenta):
- Chama a função de renderização correspondente baseada no campo tool
- Suporta escala (parâmetro scale)

**Annotation.imagePaths** (campo de imagens anexadas):
```typescript
export interface Annotation {
  // ...
  imagePaths?: string[]; // Imagens anexadas (caminhos locais ou URLs)
}
```

**Tratamento de atalhos** (index.tsx:33-59):
```typescript
// 1/2/3 para alternar ferramentas
if (e.key === '1') setState(s => ({ ...s, tool: 'pen' }));
if (e.key === '2') setState(s => ({ ...s, tool: 'arrow' }));
if (e.key === '3') setState(s => ({ ...s, tool: 'circle' }));

// Cmd+Z para desfazer
if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
  e.preventDefault();
  handleUndo();
}
```

</details>
