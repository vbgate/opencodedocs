---
title: "Fase UI: Design de Interface e Prototipação - Sistema de Design ui-ux-pro-max | Tutorial do Agent App Factory"
sidebarTitle: "Design de Interface e Prototipação"
subtitle: "Fase 3: UI - Design de Interface e Prototipação"
description: "Aprenda como a fase UI gera esquemas de UI profissionais e protótipos visualizáveis a partir do PRD. Este tutorial explica as responsabilidades do Agente UI, o uso do sistema de design ui-ux-pro-max, a estrutura padrão do ui.schema.yaml, princípios de design e lista de verificação de entrega."
tags:
  - "Pipeline"
  - "UI/UX"
  - "Sistema de Design"
prerequisite:
  - "advanced-stage-prd"
order: 100
---

# Fase 3: UI - Design de Interface e Prototipação

UI é a terceira fase do pipeline do Agent App Factory, responsável por transformar as descrições de funcionalidades do PRD em estruturas de interface claras (UI Schema) e protótipos visualizáveis. Esta fase determina a aparência e a experiência de interação do aplicativo final, sendo a ponte crucial entre os requisitos do produto e a implementação técnica.

## O Que Você Poderá Fazer Após Concluir

- Converter PRDs em arquivos `ui.schema.yaml` que atendam aos padrões
- Usar a skill ui-ux-pro-max para gerar sistemas de design profissionais (estilos, paleta de cores, fontes)
- Criar protótipos visualizáveis no navegador (HTML + CSS + JS)
- Entender os limites de responsabilidade do Agente UI (design visual, não envolve implementação técnica)
- Evitar armadilhas comuns de design de IA (como uso excessivo de gradientes roxos, fonte Inter)

## Sua Situação Atual

Você pode ter um PRD claro, mas não sabe por onde começar a desenhar a interface:

- "O PRD está pronto, mas não consigo pensar em um estilo de UI adequado" (falta conhecimento de sistemas de design)
- "Não sei quais cores, fontes, layouts usar" (dependência da estética pessoal em vez de especificações profissionais)
- "O protótipo projetado não corresponde ao PRD" (estrutura da interface desconectada das necessidades funcionais)
- "Medo de que o design seja muito feio ou chamativo demais, não condizente com o posicionamento do produto" (falta de experiência em design da indústria)

Essa cegueira no design levará a falta de especificações visuais claras na fase de Code subsequente, e o aplicativo finalmente gerado pode ter aparência confusa e interação inconsistente.

## Quando Usar Esta Técnica

Quando seu PRD estiver concluído e os seguintes requisitos forem atendidos:

1. **Há um documento PRD claro** (contendo histórias de usuário, lista de funcionalidades, não-objetivos)
2. **O design da interface ainda não começou** (UI é a primeira fase de design)
3. **A stack técnica ainda não foi decidida** (detalhes de implementação técnica estão na fase Tech)
4. **Deseja controlar o escopo do design, evitando overdesign** (fase UI limitada a no máximo 3 páginas)

## 🎒 Preparação Antes de Começar

::: warning Pré-requisitos
Antes de começar a fase UI, certifique-se de que:

- ✅ A [fase PRD](../stage-prd/) foi concluída, `artifacts/prd/prd.md` foi gerado
- ✅ O plugin ui-ux-pro-max está instalado (forma recomendada: executar [factory init](../../start/installation/) instalará automaticamente)
- ✅ Você entende a [Visão Geral do Pipeline de 7 Fases](../../start/pipeline-overview/)
- ✅ Você preparou um assistente de IA (recomendado Claude Code)
:::

## Ideia Central

### O Que é a Fase UI?

A **fase UI** é a ponte entre os requisitos do produto e a implementação técnica. Sua única responsabilidade é **transformar as descrições de funcionalidades no PRD em estrutura de interface e especificações visuais**.

::: info Não é Desenvolvimento Frontend
O Agente UI não é um engenheiro de desenvolvimento frontend, ele não escreve componentes React ou código CSS. Sua tarefa é:
- Analisar as necessidades funcionais no PRD
- Determinar a arquitetura de informação da interface (páginas e componentes)
- Gerar sistema de design (cores, fontes, espaçamento, bordas arredondadas)
- Criar protótipos visualizáveis (HTML + CSS + JS)

Ele não decidirá "qual framework usar para implementar", apenas decidirá "como será a aparência".
:::

### Por Que Precisamos de Sistema de Design?

Imagine a reforma de uma casa sem sistema de design:

- ❌ Sem sistema de design: sala com estilo minimalista, quarto com estilo retrô, cozinha com estilo industrial, confusão geral
- ✅ Com sistema de design: tom de cor unificado em toda a casa, estilo consistente, materiais uniformes, harmonia e coerência

A fase UI gera esse "guia de reforma completo da casa" através da skill ui-ux-pro-max, garantindo que todas as interfaces geradas na fase Code subsequente sigam especificações visuais unificadas.

### Estrutura de Arquivos de Saída

A fase UI gera três arquivos:

| Arquivo | Conteúdo | Função |
|------|------|------|
| **ui.schema.yaml** | Configuração do sistema de design + Definição da estrutura da página | Fase Tech lê este arquivo para projetar modelo de dados, fase Code lê este arquivo para gerar interface |
| **preview.web/index.html** | Protótipo visualizável no navegador | Permite que você veja o efeito da interface antecipadamente, verificando se o design atende às expectativas |
| **design-system.md** (opcional) | Documentação persistente do sistema de design | Registra decisões de design, facilitando ajustes subsequentes |

## Siga-me na Operação

### Etapa 1: Confirme que o PRD Está Concluído

Antes de iniciar a fase UI, certifique-se de que `artifacts/prd/prd.md` existe e o conteúdo está completo.

**Pontos de verificação ✅**:

1. **O usuário-alvo** está claro?
   - ✅ Tem persona específica (idade/profissão/capacidade técnica)
   - ❌ Vago: "todos"

2. **As funcionalidades principais** estão listadas?
   - ✅ Tem 3-7 funcionalidades principais
   - ❌ Muitas ou poucas

3. **Os não-objetivos** são suficientes?
   - ✅ Lista pelo menos 3 funcionalidades que não serão feitas
   - ❌ Ausentes ou insuficientes

::: tip Se o PRD não está completo
Volte para a [fase PRD](../stage-prd/) para modificar, garantindo que o design tenha entrada clara.
:::

### Etapa 2: Inicie o Pipeline na Fase UI

Execute no diretório do projeto Factory:

```bash
# Continuar da fase PRD (se a fase PRD acabou de ser concluída)
factory continue

# Ou especificar diretamente para começar do ui
factory run ui
```

O CLI exibirá o status atual e as fases disponíveis.

### Etapa 3: O Assistente de IA Lê a Definição do Agente UI

O assistente de IA (como Claude Code) lerá automaticamente `agents/ui.agent.md` para entender suas responsabilidades e restrições.

::: info Responsabilidades do Agente
O Agente UI só pode:
- Ler `artifacts/prd/prd.md`
- Escrever em `artifacts/ui/`
- Usar a skill ui-ux-pro-max para gerar sistema de design
- Criar protótipos de no máximo 3 páginas

Ele não pode:
- Ler outros arquivos
- Escrever em outros diretórios
- Decidir stack tecnológica (isso está na fase Tech)
- Usar estilo padrão de IA (gradiente roxo, fonte Inter)
:::

### Etapa 4: Uso Obrigatório do Sistema de Design ui-ux-pro-max (Etapa Crucial)

Esta é a etapa central da fase UI. O assistente de IA **deve** chamar primeiro a skill `ui-ux-pro-max`, mesmo que ache que a direção do design é clara.

**Função da skill ui-ux-pro-max**:

1. **Recomendar sistema de design automaticamente**: Combina automaticamente o melhor estilo com base no tipo de produto e domínio do setor
2. **Fornece 67 estilos de UI**: Do minimalismo ao neo-brutalismo
3. **Fornece 96 paletas de cores**: Pré-projetadas por setor e estilo
4. **Fornece 57 combinações de fontes**: Evitando estilos comuns de IA (Inter, Roboto)
5. **Aplica 100 regras de inferência do setor**: Garante que o design esteja alinhado com o posicionamento do produto

**O que o assistente de IA fará**:
- Extrair informações principais do PRD: tipo de produto, domínio do setor, usuário-alvo
- Chamar a skill `ui-ux-pro-max` para obter recomendações completas do sistema de design
- Aplicar o sistema de design recomendado ao `ui.schema.yaml` e ao protótipo

::: danger Pular esta etapa será rejeitado
O scheduler Sisyphus verificará se a skill ui-ux-pro-max foi usada. Se não, os produtos gerados pelo Agente UI serão rejeitados e precisarão ser reexecutados.
:::

**O que o sistema de design inclui**?

```yaml
design_system:
  style: "Glassmorphism"           # Estilo escolhido (ex: glassmorphism, minimalismo)
  colors:
    primary: "#2563eb"             # Cor primária (para ações principais)
    secondary: "#64748b"           # Cor secundária
    success: "#10b981"             # Cor de sucesso
    warning: "#f59e0b"             # Cor de aviso
    error: "#ef4444"               # Cor de erro
    background: "#ffffff"          # Cor de fundo
    surface: "#f8fafc"            # Cor de superfície
    text:
      primary: "#1e293b"           # Texto primário
      secondary: "#64748b"         # Texto secundário
  typography:
    font_family:
      headings: "DM Sans"          # Fonte de títulos (evitar Inter)
      body: "DM Sans"              # Fonte de corpo
    font_size:
      base: 16
      lg: 18
      xl: 20
      2xl: 24
  spacing:
    unit: 8                        # Unidade de espaçamento (grade de 8px)
  border_radius:
    md: 8
    lg: 12
  effects:
    hover_transition: "200ms"      # Tempo de transição hover
    blur: "backdrop-blur-md"       # Efeito de vidro fosco
```

### Etapa 5: Projetar a Estrutura da Interface

O assistente de IA projetará a arquitetura de informação da interface (páginas e componentes) com base nas necessidades funcionais do PRD.

**Exemplo de estrutura de interface** (de `ui.schema.yaml`):

```yaml
pages:
  - id: home
    title: "Home"
    type: list
    description: "Exibe lista de todos os projetos"
    components:
      - type: header
        content: "Meu Aplicativo"
      - type: list
        source: "api/items"
        item_layout:
          - type: text
            field: "title"
            style: "heading"
          - type: text
            field: "description"
            style: "body"
        actions:
          - type: "navigate"
            target: "detail"
            params: ["id"]

  - id: detail
    title: "Detalhes"
    type: detail
    params:
      - name: "id"
        type: "number"

  - id: create
    title: "Criar"
    type: form
    fields:
      - name: "title"
        type: "text"
        label: "Título"
        required: true
    submit:
      action: "post"
      endpoint: "/api/items"
      on_success: "navigate:home"
```

**Tipos de página**:
- `list`: Página de lista (ex: home, resultados de pesquisa)
- `detail`: Página de detalhes (ex: visualizar detalhes do projeto)
- `form`: Página de formulário (ex: criar, editar)

### Etapa 6: Criar o Protótipo de Visualização

O assistente de IA usará HTML + CSS + JS para criar um protótipo visualizável, demonstrando os fluxos de interação principais.

**Características do protótipo**:
- Usa tecnologia nativa (sem dependência de frameworks)
- Aplica a paleta de cores, fontes e efeitos recomendados pelo sistema de design
- Todos os elementos clicáveis têm estados hover e `cursor-pointer`
- Design mobile-first (responsivo correto em 375px e 768px)
- Usa ícones SVG (Heroicons/Lucide), sem emoji

**Método de visualização**:
Abra `artifacts/ui/preview.web/index.html` no navegador para visualizar o protótipo.

### Etapa 7: Confirme a Saída da UI

Após a conclusão do Agente UI, você precisa verificar os arquivos de saída.

**Pontos de verificação ✅**:

1. **ui.schema.yaml existe?**
   - ✅ Arquivo no diretório `artifacts/ui/`
   - ❌ Ausente ou caminho incorreto

2. **O sistema de design usou a skill ui-ux-pro-max?**
   - ✅ Declaração clara na saída ou schema
   - ❌ Sistema de design escolhido independentemente

3. **O número de páginas não excede 3?**
   - ✅ 1-3 páginas (MVP focado em funcionalidades principais)
   - ❌ Mais de 3 páginas

4. **O protótipo pode ser aberto no navegador?**
   - ✅ Abrir `preview.web/index.html` no navegador exibe normalmente
   - ❌ Não é possível abrir ou exibe erro

5. **Evitou o estilo padrão de IA?**
   - ✅ Sem gradiente roxo/rosa
   - ✅ Sem uso da fonte Inter
   - ✅ Usa ícones SVG (sem emoji)
   - ❌ Aparece estilo IA acima

6. **Todos os elementos clicáveis têm feedback de interação?**
   - ✅ Tem `cursor-pointer` e estado hover
   - ✅ Transição suave (150-300ms)
   - ❌ Sem indicação de interação ou mudança instantânea

### Etapa 8: Escolha Continuar, Tentar Novamente ou Pausar

Após a confirmação, o CLI exibirá opções:

```bash
Por favor, escolha a operação:
[1] Continuar (entrar na fase Tech)
[2] Tentar Novamente (regenerar UI)
[3] Pausar (continuar mais tarde)
```

::: tip Recomenda-se visualizar o protótipo primeiro
Antes de confirmar no assistente de IA, abra o protótipo no navegador primeiro para verificar se o design atende às expectativas. Uma vez na fase Tech, o custo de modificação do design será maior.
:::

## Alertas de Armadilhas

### Armadilha 1: Não Usar a Skill ui-ux-pro-max

**Exemplo de erro**:
```
O assistente de IA escolheu independentemente o estilo glassmorphism, paleta de cores azul
```

**Consequência**: O scheduler Sisyphus rejeitará os produtos, exigindo reexecução.

**Sugestão**:
```
O assistente de IA deve chamar primeiro a skill ui-ux-pro-max, obter recomendações de sistema de design
```

### Armadilha 2: Usar Estilo Padrão de IA

**Exemplo de erro**:
- Fundo com gradiente roxo/rosa
- Fonte Inter ou Roboto
- Emoji como ícones de UI

**Consequência**: Design não profissional, facilmente identificado como gerado por IA, afetando a imagem do produto.

**Sugestão**:
- Escolher entre 57 combinações de fontes recomendadas pelo ui-ux-pro-max
- Usar bibliotecas de ícones SVG (Heroicons/Lucide)
- Evitar uso excessivo de gradientes e cores neon

### Armadilha 3: Número de Páginas Excedendo 3

**Exemplo de erro**:
```
Gerou 5 páginas: Home, Detalhes, Criar, Editar, Configurações
```

**Consequência**: Escopo do MVP fora de controle, aumento significativo do trabalho nas fases Tech e Code.

**Sugestão**: Controle em 1-3 páginas, focando no caminho de uso principal.

### Armadilha 4: Protótipo Sem Feedback de Interação

**Exemplo de erro**:
```
Botão sem estado hover, link sem cursor-pointer
```

**Consequência**: Experiência do usuário ruim, protótipo não realista.

**Sugestão**: Todos os elementos clicáveis adicionam `cursor-pointer` e estado hover (transição de 150-300ms).

### Armadilha 5: Contraste Insuficiente no Modo Claro

**Exemplo de erro**:
```
Cor de fundo do cartão de vidro bg-white/10 (muito transparente), cor do texto #94A3B8 (muito claro)
```

**Consequência**: Conteúdo invisível no modo claro, acessibilidade não atendida.

**Sugestão**:
- Cartões de vidro no modo claro use `bg-white/80` ou superior
- Contraste de texto >= 4.5:1 (padrão WCAG AA)

### Armadilha 6: Protótipo e Schema Inconsistentes

**Exemplo de erro**:
```
Schema definiu 2 páginas, mas o protótipo mostrou 3 páginas
```

**Consequência**: Fases Tech e Code ficarão confusas, não sabendo qual seguir.

**Sugestão**: Garanta que protótipo e schema sejam completamente consistentes, número de páginas e estrutura de componentes devem corresponder.

## Resumo da Aula

O núcleo da fase UI é o **sistema de design**:

1. **Entrada**: Documento PRD claro (`artifacts/prd/prd.md`)
2. **Processo**: Assistente de IA gera sistema de design profissional através da skill ui-ux-pro-max
3. **Saída**: `ui.schema.yaml` (sistema de design + estrutura de interface) + `preview.web/index.html` (protótipo visualizável)
4. **Validação**: Verificar se o sistema de design é profissional, se o protótipo é visualizável, se evita estilo padrão de IA

::: tip Princípios-chave
- ❌ O que não fazer: Não decidir stack tecnológica, não escrever código frontend, não usar estilo padrão de IA
- ✅ O que fazer apenas: Gerar sistema de design, projetar estrutura de interface, criar protótipo visualizável
:::

## Prévia da Próxima Aula

> Na próxima aula aprenderemos **[Fase 4: Tech - Design de Arquitetura Técnica](../stage-tech/)**.
>
> Você aprenderá:
> - Como projetar arquitetura técnica com base no PRD e UI Schema
> - Como escolher a stack tecnológica adequada (Express + Prisma + React Native)
> - Como projetar modelo de dados mínimo viável (Prisma Schema)
> - Por que a fase Tech não pode envolver detalhes de implementação de UI

---

## Apêndice: Referência do Código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Última atualização: 2026-01-29

| Função | Caminho do Arquivo | Número da Linha |
| ------ | ------------------------------------------------------------- | ------- |
| Definição do Agente UI | [`agents/ui.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/ui.agent.md) | 1-98 |
| Skill UI | [`skills/ui/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/ui/skill.md) | 1-430 |
| Definição do Pipeline (Fase UI) | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 34-47 |
| Definição do Scheduler | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 1-100+ |

**Restrições-chave**:
- **Uso obrigatório da skill ui-ux-pro-max**: ui.agent.md:33, 53-54
- **Proibição de paleta de cores de estilo de IA**: ui.agent.md:36
- **Proibição de ícones emoji**: ui.agent.md:37
- **Deve adicionar cursor-pointer e estado hover**: ui.agent.md:38
- **Protótipo não excede 3 páginas**: ui.agent.md:34
- **Usar HTML/CSS/JS nativo**: ui.agent.md:35

**Condições de Saída** (pipeline.yaml:43-47):
- ui.schema.yaml existe
- Número de páginas não excede 3
- Página de visualização pode ser aberta no navegador
- Agente usou a skill `ui-ux-pro-max` para gerar sistema de design

**Estrutura do Conteúdo da Skill UI**:
- **Framework Mental**: Propósito, tom, diferenciação, arquitetura de informação
- **Fluxo de Trabalho de Geração do Sistema de Design**: Analisar necessidades → Gerar sistema de design → Pesquisa complementar → Obter guia de stack tecnológica
- **67 Estilos de UI**: Minimalismo, neumorfismo, glassmorphism, brutalismo, etc.
- **Regras de Inferência do Setor**: 100 regras, recomendação automática do sistema de design por tipo de produto
- **Guia do Sistema de Design**: Sistema de cores, sistema tipográfico, sistema de espaçamento, especificações de componentes
- **Lista de Verificação Pré-entrega**: Qualidade visual, interação, modo claro/escuro, layout, acessibilidade
- **Princípios de Decisão**: Orientado a propósito, mobile-first, acessibilidade, simplicidade limitada, consistência de visualização, prioridade a ferramentas
- **NUNCA FAÇA**: Fontes/cores de estilo de IA, ícones emoji, baixo contraste, mais de 3 páginas, etc.

</details>
