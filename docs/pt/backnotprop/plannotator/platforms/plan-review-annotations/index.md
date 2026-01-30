---
title: "Anotações de Plano: Quatro Tipos de Anotações | plannotator"
sidebarTitle: "Adicionar Quatro Tipos de Anotações"
subtitle: "Anotações de Plano: Quatro Tipos de Anotações"
description: "Domine o uso dos quatro tipos de anotações do Plannotator. Aprenda técnicas para adicionar exclusão, substituição, inserção e comentários, com suporte a entrada rápida type-to-comment e anexos de imagens, melhorando a eficiência da revisão de planos."
tags:
  - "Anotações de Plano"
  - "Tipos de Anotações"
  - "Exclusão"
  - "Substituição"
  - "Inserção"
  - "Comentário"
  - "type-to-comment"
  - "Anexos de Imagens"
prerequisite:
  - "platforms-plan-review-basics"
order: 2
---

# Adicionar Anotações de Plano: Domine os Quatro Tipos de Anotações

## O Que Você Vai Aprender

- ✅ Selecionar texto do plano e adicionar quatro tipos diferentes de anotações (exclusão, substituição, inserção, comentário)
- ✅ Usar o atalho type-to-comment para inserir comentários diretamente
- ✅ Anexar imagens às anotações (imagens de referência, capturas de tela, etc.)
- ✅ Entender o significado e cenários de uso de cada tipo de anotação
- ✅ Ver o formato Markdown exportado das anotações

## Seu Problema Atual

**Problema 1**: Sabe que precisa excluir um trecho de conteúdo, mas após selecionar o texto, não sabe qual botão clicar.

**Problema 2**: Quer substituir um trecho de código, mas a barra de ferramentas só tem "Excluir" e "Comentar", sem opção de "Substituir".

**Problema 3**: Seleciona várias linhas de texto e quer inserir um comentário diretamente, mas precisa clicar no botão "Comentar" toda vez, o que é ineficiente.

**Problema 4**: Quer anexar uma imagem de referência a um trecho de código, mas não sabe como fazer o upload da imagem.

**O Plannotator pode ajudar**:
- Ícones de botão claros, para distinguir facilmente exclusão, substituição, inserção e comentário
- Atalho type-to-comment, para inserir diretamente sem clicar em botões
- Suporte a anexos de imagens nas anotações, facilitando a adição de imagens de referência
- Anotações convertidas automaticamente para Markdown estruturado, para entendimento preciso pela IA

## Quando Usar Esta Técnica

**Cenários de uso**:
- Revisar planos de implementação gerados por IA, precisando fornecer feedback preciso sobre modificações
- Um trecho de conteúdo não é necessário (exclusão)
- Um trecho de conteúdo precisa ser alterado para outra forma (substituição)
- Um trecho de conteúdo precisa de explicações adicionais depois dele (inserção)
- Tem dúvidas ou sugestões sobre um trecho de conteúdo (comentário)

**Cenários não aplicáveis**:
- Apenas aprovar ou rejeitar o plano como um todo (não precisa de anotações, apenas tomar a decisão)
- Já está revisando alterações de código (usar a funcionalidade de revisão de código)

## 🎒 Preparação Antes de Começar

**Pré-requisitos**:
- ✅ Completou o tutorial [Revisão de Plano Básica](../plan-review-basics/)
- ✅ Sabe como acionar a interface de revisão de plano do Plannotator

**Pressupostos desta lição**:
- Você já abriu a página de revisão de plano do Plannotator
- A página exibe um plano Markdown gerado por IA

## Ideia Central

### Explicação Detalhada dos Tipos de Anotações

O Plannotator suporta quatro tipos de anotações de plano (mais um tipo de comentário global):

| Tipo de Anotação | Ícone | Finalidade | Requer Entrada de Conteúdo |
|--- | --- | --- | ---|
| **Exclusão (DELETION)** | 🗑️ | Marca este conteúdo para ser removido do plano | ❌ Não necessário |
| **Comentário (COMMENT)** | 💬 | Faz perguntas ou sugestões sobre o conteúdo selecionado | ✅ Necessário inserir comentário |
| **Substituição (REPLACEMENT)** | Implementado via comentário | Substitui o conteúdo selecionado por novo conteúdo | ✅ Necessário inserir novo conteúdo |
| **Inserção (INSERTION)** | Implementado via comentário | Insere novo conteúdo após o conteúdo selecionado | ✅ Necessário inserir novo conteúdo |
| **Comentário Global (GLOBAL_COMMENT)** | Campo de entrada na parte inferior da página | Fornece feedback sobre todo o plano | ✅ Necessário inserir comentário |

**Por que substituição e inserção não têm botões independentes?**

Pela implementação do código-fonte, substituição e inserção são essencialmente tipos especiais de comentário (`packages/ui/utils/parser.ts:287-296`):
- **Substituição**: O conteúdo do comentário serve como o novo texto de substituição
- **Inserção**: O conteúdo do comentário serve como o novo texto de inserção

Ambos são criados usando o botão **Comentário (COMMENT)**, a diferença está em como você descreve a intenção.

### Fluxo de Trabalho da Barra de Ferramentas

```
Selecionar texto → Barra de ferramentas aparece (etapa de menu)
                  │
                  ├── Clicar Delete → Criar anotação de exclusão imediatamente
                  ├── Clicar Comment → Ir para etapa de entrada → Inserir conteúdo → Salvar
                  └── Digitar caractere diretamente → type-to-comment → Ir automaticamente para etapa de entrada
```

**Diferença entre as duas etapas**:
- **Etapa de menu**: Selecionar o tipo de operação (excluir, comentar, cancelar)
- **Etapa de entrada**: Inserir conteúdo do comentário ou anexar imagens (a partir de comentário/substituição/inserção)

### Atalho type-to-comment

Esta é a funcionalidade chave para melhorar a eficiência. Quando você seleciona um trecho de texto, **comece a digitar diretamente** (sem clicar em nenhum botão), a barra de ferramentas automaticamente:
1. Alterna para o modo "comentário"
2. Coloca o primeiro caractere que você digitou no campo de entrada
3. Posiciona o cursor automaticamente no final do campo de entrada

Localização da implementação no código-fonte: `packages/ui/components/AnnotationToolbar.tsx:127-147`

## Siga comigo

### Passo 1: Iniciar a Revisão de Plano

**Por que**
Precisa de um plano real para praticar a adição de anotações.

**Operação**

Acione a revisão de plano no Claude Code ou OpenCode:

```bash
# Exemplo Claude Code: Após a IA gerar um plano, ela chamará ExitPlanMode
"Por favor, gere um plano de implementação para funcionalidade de autenticação de usuário"

# Aguarde a IA completar o plano, o Plannotator abrirá automaticamente no navegador
```

**Você deve ver**:
- O navegador abre a página de revisão de plano
- A página exibe um plano de implementação em formato Markdown

### Passo 2: Adicionar Anotação de Exclusão

**Por que**
Anotações de exclusão são usadas para marcar conteúdo que não deseja que apareça no plano final.

**Operação**

1. Encontre no plano um parágrafo que não precisa (por exemplo, uma descrição de funcionalidade irrelevante)
2. Selecione o texto com o mouse
3. A barra de ferramentas aparece automaticamente, clique no **botão Excluir (🗑️)**

**Você deve ver**:
- O texto selecionado é exibido com estilo de exclusão (geralmente tachado ou fundo vermelho)
- A barra de ferramentas fecha automaticamente

::: tip Características da Anotação de Exclusão
Anotações de exclusão **não exigem inserir nenhum conteúdo**. Após clicar no botão Excluir, a anotação é criada imediatamente.
:::

### Passo 3: Usar type-to-comment para Adicionar Comentário

**Por que**
Comentário é o tipo de anotação mais comum, e type-to-comment permite economizar um clique.

**Operação**

1. Selecione texto no plano (por exemplo, um nome de função ou descrição)
2. **Não clique em nenhum botão, comece a digitar diretamente**
3. Digite o conteúdo do seu comentário (por exemplo: "este nome de função não é claro")
4. Pressione `Enter` para salvar, ou clique no botão **Save**

**Você deve ver**:
- A barra de ferramentas alterna automaticamente para o modo de campo de entrada
- O primeiro caractere que você digitou já está no campo de entrada
- O cursor é posicionado automaticamente no final do campo de entrada
- Após pressionar `Enter`, o texto selecionado é exibido com estilo de comentário (geralmente fundo amarelo)

::: tip Atalhos do type-to-comment
- `Enter`: Salvar anotação (se o campo de entrada tiver conteúdo)
- `Shift + Enter`: Nova linha (usado ao inserir comentários de várias linhas)
- `Escape`: Cancelar entrada, retornar à etapa de menu
:::

### Passo 4: Adicionar Anotação de Substituição

**Por que**
Anotações de substituição são usadas para substituir o conteúdo selecionado por novo conteúdo, e a IA modificará o plano com base no seu comentário.

**Operação**

1. Selecione texto no plano (por exemplo, "usar JWT token para autenticação")
2. Use type-to-comment ou clique no botão de comentário
3. No campo de entrada, digite o novo conteúdo (por exemplo: "usar session cookie para autenticação")
4. Pressione `Enter` para salvar

**Você deve ver**:
- O texto selecionado é exibido com estilo de comentário
- A barra lateral de anotações exibe o conteúdo do seu comentário

**Formato após exportação** (`packages/ui/utils/parser.ts:292-296`):

```markdown
## 1. Change this

**From:**
```
usar JWT token para autenticação
```

**To:**
```
usar session cookie para autenticação
```
```

::: info Diferença entre Substituição e Exclusão
- **Exclusão**: Remove conteúdo diretamente, não precisa explicar o motivo
- **Substituição**: Substitui conteúdo antigo por novo conteúdo, precisa especificar o novo conteúdo
:::

### Passo 5: Adicionar Anotação de Inserção

**Por que**
Anotações de inserção são usadas para adicionar explicações ou trechos de código após o conteúdo selecionado.

**Operação**

1. Selecione texto no plano (por exemplo, o final de uma assinatura de função)
2. Use type-to-comment ou clique no botão de comentário
3. No campo de entrada, digite o conteúdo a ser inserido (por exemplo: ", precisa tratar casos de falha de autenticação")
4. Pressione `Enter` para salvar

**Você deve ver**:
- O texto selecionado é exibido com estilo de comentário
- A barra lateral de anotações exibe seu comentário

**Formato após exportação** (`packages/ui/utils/parser.ts:287-290`):

```markdown
## 1. Add this

```
, precisa tratar casos de falha de autenticação
```
```

### Passo 6: Anexar Imagens à Anotação

**Por que**
Às vezes a descrição textual não é intuitiva o suficiente, precisa anexar imagens de referência ou capturas de tela.

**Operação**

1. Selecione qualquer texto, vá para a etapa de entrada (clique no botão de comentário ou use type-to-comment)
2. Ao lado do campo de entrada da barra de ferramentas, clique no **botão de Anexo (📎)**
3. Selecione a imagem para upload (suporta formatos PNG, JPEG, WebP)
4. Pode continuar inserindo conteúdo de comentário
5. Pressione `Enter` para salvar

**Você deve ver**:
- A miniatura da imagem é exibida no campo de entrada
- Após salvar, a imagem é exibida na barra lateral de anotações

::: warning Local de Armazenamento de Imagens
As imagens enviadas são salvas no diretório local `/tmp/plannotator` (localização no código-fonte: `packages/server/index.ts:163`). Se os arquivos temporários forem limpos, as imagens serão perdidas.
:::

### Passo 7: Adicionar Comentário Global

**Por que**
Quando você tem feedback sobre todo o plano (não direcionado a um trecho específico de texto), use comentário global.

**Operação**

1. Na parte inferior da página, encontre o campo de entrada (a etiqueta pode ser "Add a general comment about the plan...")
2. Digite o conteúdo do seu comentário
3. Pressione `Enter` para salvar ou clique no botão de enviar

**Você deve ver**:
- O comentário aparece na área de comentário global na parte inferior da página
- O comentário é exibido como um cartão independente, não associado a nenhum bloco de texto

::: tip Comentário Global vs Comentário de Texto
- **Comentário Global**: Feedback sobre todo o plano, não associado a texto específico (por exemplo, "o plano inteiro carece de considerações de desempenho")
- **Comentário de Texto**: Feedback sobre um trecho de texto, que destaca o texto correspondente
:::

## Ponto de Verificação ✅

Após concluir as etapas acima, você deve:

- [ ] Adicionou com sucesso pelo menos uma anotação de exclusão
- [ ] Usou type-to-comment para adicionar comentário
- [ ] Adicionou anotações de substituição e inserção
- [ ] Anexou imagens às anotações
- [ ] Adicionou comentário global
- [ ] Viu a lista de todas as anotações na barra lateral direita

## Cuidados com Armadilhas

### Armadilha 1: Não Encontrar o Botão "Substituir"

**Operação incorreta**:
- Após selecionar texto, a barra de ferramentas só tem Delete e Comment, sem botões Replace ou Insert

**Operação correta**:
- Substituição e inserção são implementadas através do botão **Comentário (COMMENT)**
- Descreva sua intenção no conteúdo do comentário (substituir ou inserir)
- A IA entenderá sua intenção com base no conteúdo do comentário

### Armadilha 2: type-to-comment Não Funciona

**Possíveis causas**:
1. Não selecionou texto
2. Clicou em algum botão primeiro, a barra de ferramentas já entrou na etapa de entrada
3. Digitou teclas especiais (`Ctrl`, `Alt`, `Escape`, etc.)

**Operação correta**:
1. Selecione texto primeiro, certifique-se de que a barra de ferramentas exibe a etapa de menu (com botões Delete, Comment)
2. Digite caracteres comuns diretamente (letras, números, pontuação)
3. Não pressione teclas de função

### Armadilha 3: Imagens Enviadas Não Encontradas

**Possíveis causas**:
- As imagens são salvas no diretório `/tmp/plannotator`
- O sistema limpou os arquivos temporários

**Operação correta**:
- Se precisar salvar imagens a longo prazo, recomenda-se copiar para o diretório do projeto
- Ao exportar anotações, os caminhos das imagens são caminhos absolutos, certifique-se de que outras ferramentas possam acessá-los

### Armadilha 4: Pressionar `Enter` para Nova Linha, mas Salvou a Anotação

**Operação incorreta**:
- No campo de entrada, queria fazer nova linha, pressionou `Enter` diretamente, e a anotação foi salva

**Operação correta**:
- Use `Shift + Enter` para nova linha
- A tecla `Enter` é dedicada a salvar anotações

## Resumo da Lição

**Quatro tipos de anotações**:
- **Exclusão (DELETION)**: Marca conteúdo que não deseja que apareça no plano
- **Substituição (REPLACEMENT)**: Substitui o conteúdo selecionado por novo conteúdo (implementado via comentário)
- **Inserção (INSERTION)**: Adiciona conteúdo após o conteúdo selecionado (implementado via comentário)
- **Comentário (COMMENT)**: Faz perguntas ou sugestões sobre o conteúdo selecionado
- **Comentário Global (GLOBAL_COMMENT)**: Feedback sobre todo o plano

**Operações chave**:
- Selecionar → Barra de ferramentas aparece → Selecionar tipo de operação
- type-to-comment: Digitar caractere diretamente, alternar automaticamente para modo de comentário
- `Shift + Enter`: Nova linha; `Enter`: Salvar
- Botão de anexo: Enviar imagens para anotações

**Formato de exportação de anotações**:
- Exclusão: `## Remove this` + texto original
- Inserção: `## Add this` + novo texto
- Substituição: `## Change this` + comparação From/To
- Comentário: `## Feedback on: "..."` + conteúdo do comentário

## Próxima Lição

> Na próxima lição, aprenderemos **[Adicionar Anotações de Imagem](../plan-review-images/)**.
>
> Você aprenderá:
> - Como anexar imagens na revisão de planos
> - Usar ferramentas de pincel, seta e círculo para anotar
> - Imagens anotadas como feedback de referência

---

## Apêndice: Referência de Código-fonte

<details>
<summary><strong>Clique para expandir e ver localizações do código-fonte</strong></summary>

> Atualizado em: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Linhas |
|--- | --- | ---|
| Definição de enumeração de tipos de anotação | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L1-L7) | 1-7 |
| Interface Annotation | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L11-L33) | 11-33 |
| Componente de barra de ferramentas de anotações | [`packages/ui/components/AnnotationToolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationToolbar.tsx#L29-L272) | 29-272 |
|--- | --- | ---|
| Formatação de exportação de anotações | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L246-L323) | 246-323 |
| Parser de Markdown para Blocks | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L70-L244) | 70-244 |
| Componente Viewer (processamento de seleção de texto) | [`packages/ui/components/Viewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Viewer.tsx#L66-L350) | 66-350 |

**Constantes chave**:
- `AnnotationType.DELETION = 'DELETION'`: Tipo de anotação de exclusão
- `AnnotationType.INSERTION = 'INSERTION'`: Tipo de anotação de inserção
- `AnnotationType.REPLACEMENT = 'REPLACEMENT'`: Tipo de anotação de substituição
- `AnnotationType.COMMENT = 'COMMENT'`: Tipo de anotação de comentário
- `AnnotationType.GLOBAL_COMMENT = 'GLOBAL_COMMENT'`: Tipo de comentário global

**Funções chave**:
- `exportDiff(blocks, annotations)`: Exporta anotações para formato Markdown, incluindo comparação From/To
- `parseMarkdownToBlocks(markdown)`: Converte Markdown para array linear de Blocks
- `createAnnotationFromSource()`: Cria objeto Annotation a partir da seleção de texto

</details>
