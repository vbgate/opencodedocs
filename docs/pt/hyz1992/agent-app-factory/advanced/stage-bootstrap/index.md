---
title: "Fase 1: Bootstrap - Estruturar Ideias de Produto | Tutorial do Agent App Factory"
sidebarTitle: "Estruturar Ideias de Produto"
subtitle: "Fase 1: Bootstrap - Estruturar Ideias de Produto"
description: "Aprenda como a fase Bootstrap transforma ideias de produto vagas em um documento claro e estruturado input/idea.md. Este tutorial explica as responsabilidades do Bootstrap Agent, o uso da habilidade superpowers:brainstorm, a estrutura padrão do idea.md e a lista de verificação de qualidade."
tags:
  - "Pipeline"
  - "Bootstrap"
  - "Ideia de Produto"
prerequisite:
  - "start-pipeline-overview"
order: 80
---

# Fase 1: Bootstrap - Estruturar Ideias de Produto

O Bootstrap é a primeira fase do pipeline do Agent App Factory, responsável por organizar sua ideia de produto vaga em um documento claro `input/idea.md`. Este é o ponto de partida para todas as fases subsequentes (PRD, UI, Tech, etc.), determinando a direção e qualidade de todo o projeto.

## O Que Você Será Capaz de Fazer

- Organizar ideias de produto vagas em um documento `input/idea.md` que siga o modelo padrão
- Entender os limites de responsabilidade do Bootstrap Agent (apenas coleta informações, não cria requisitos)
- Saber como usar a habilidade superpowers:brainstorm para explorar profundamente a ideia do produto
- Ser capaz de julgar quais informações devem ser incluídas na fase Bootstrap e quais não devem

## Seu Problema Atual

Você pode ter uma ideia de produto, mas a descrição é vaga:

- "Quero fazer um aplicativo de fitness" (muito geral)
- "Fazer um aplicativo como o Xiaohongshu" (não especifica diferenciação)
- "Os usuários precisam de uma ferramenta melhor de gerenciamento de tarefas" (não especifica o problema específico)

Essas descrições vagas levarão a fases subsequentes (PRD, UI, Tech) sem entradas claras, e o aplicativo final pode desviar completamente das suas expectativas.

## Quando Usar Esta Técnica

Quando você estiver pronto para iniciar o pipeline e atender às seguintes condições:

1. **Ter uma ideia inicial do produto** (mesmo que seja apenas uma frase)
2. **Ainda não começou a escrever o documento de requisitos** (PRD está em fases posteriores)
3. **Ainda não decidiu a stack tecnológica ou o estilo de UI** (essas são fases posteriores)
4. **Deseja controlar o escopo do produto e evitar over-design** (a fase Bootstrap definirá explicitamente os não objetivos)

## 🎒 Preparação Antes de Começar

::: warning Pré-requisitos
Antes de começar a fase Bootstrap, certifique-se de:

- ✅ Completou [Inicialização do Projeto](../../start/init-project/)
- ✅ Entendeu [Visão Geral do Pipeline de 7 Fases](../../start/pipeline-overview/)
- ✅ Instalou e configurou o assistente de AI (recomenda-se Claude Code)
- ✅ Preparou sua ideia de produto (mesmo que seja vaga)
:::

## Ideia Central

### O que é a Fase Bootstrap?

O **Bootstrap** é o ponto de partida de todo o pipeline. Sua única responsabilidade é **organizar ideias de produto fragmentadas em um documento estruturado**.

::: info Não é um Gerente de Produto
O Bootstrap Agent não é um gerente de produto; ele não criará requisitos ou projetará recursos por você. Suas tarefas são:
- Coletar informações que você já forneceu
- Organizar e estruturar essas informações
- Apresentar de acordo com o modelo padrão

Ele não decidirá "quais recursos deve ter", apenas ajudará você a expressar claramente "o que você quer".
:::

### Por Que Estruturar?

Imagine que você diz ao cozinheiro: "Quero comer algo gostoso"

- ❌ Descrição vaga: O cozinheiro só pode adivinhar, talvez fazendo um prato que você não quer comer nada
- ✅ Descrição estruturada: "Quero um prato de Sichuan picante, sem coentro, que combine bem com arroz"

A fase Bootstrap é transformar "quero comer algo gostoso" em "um prato de Sichuan picante, sem coentro".

### Estrutura do Documento de Saída

A fase Bootstrap gerará `input/idea.md`, contendo os seguintes capítulos:

| Capítulo | Conteúdo | Exemplo |
|----------|----------|---------|
| **Descrição Breve** | 1-2 frases resumindo o produto | "Um aplicativo de contabilidade móvel para ajudar jovens a registrar rapidamente despesas diárias" |
| **Problema (Problem)** | A principal dor do usuário | "Jovens descobrem que ultrapassaram o orçamento no final do mês, mas não sabem onde o dinheiro foi" |
| **Usuário Alvo (Target User)** | Perfil específico do público | "Jovens de 18-30 anos recém-entrados no mercado de trabalho, com habilidades técnicas médias" |
| **Valor Central (Core Value)** | Por que é valioso | "Registro em 3 segundos, economizando 80% do tempo em comparação com verificação manual" |
| **Suposições (Assumptions)** | 2-4 suposições verificáveis | "Usuários estão dispostos a gastar 2 minutos aprendendo o aplicativo, se puderem controlar o orçamento" |
| **Não Objetivos (Non‑Goals)** | Explicitar o que não fazer | "Não planejamento de orçamento ou conselhos financeiros" |

## Siga Minhas Instruções

### Passo 1: Prepare Sua Ideia de Produto

Antes de iniciar o pipeline, pense claramente sobre sua ideia de produto. Pode ser uma descrição completa ou apenas uma ideia simples.

**Exemplo**:
```
Quero fazer um aplicativo de fitness para ajudar iniciantes de fitness a registrar treinamentos, incluindo tipo de exercício, duração, calorias, e também ver estatísticas da semana.
```

::: tip A ideia pode ser bruta
Mesmo que seja apenas uma frase, não há problema. O Bootstrap Agent usará a habilidade superpowers:brainstorm para ajudá-lo a completar as informações.
:::

### Passo 2: Inicie o Pipeline até a Fase Bootstrap

No diretório do projeto Factory, execute:

```bash
# Inicie o pipeline (ainda não iniciado)
factory run

# Ou especifique diretamente para começar do bootstrap
factory run bootstrap
```

A CLI mostrará o status atual e as fases disponíveis.

### Passo 3: O Assistente de AI Lê a Definição do Bootstrap Agent

O assistente de AI (como Claude Code) lerá automaticamente `agents/bootstrap.agent.md`, entendendo suas responsabilidades e restrições.

::: info Responsabilidades do Agent
O Bootstrap Agent só pode:
- Ler a ideia de produto fornecida pelo usuário na conversa
- Escrever em `input/idea.md`

Ele não pode:
- Ler outros arquivos
- Escrever em outros diretórios
- Criar novos requisitos
:::

### Passo 4: Uso Obrigatório da Habilidade superpowers:brainstorm

Este é um passo crítico da fase Bootstrap. O assistente de AI **deve** primeiro chamar a habilidade `superpowers:brainstorm`, mesmo que você ache que as informações já estão completas.

**Função da habilidade brainstorm**:
1. **Explorar profundamente a essência do problema**: Descubra pontos cegos em sua descrição através de perguntas estruturadas
2. **Definir o perfil do usuário alvo**: Ajude você a esclarecer "quem exatamente vender"
3. **Validar o valor central**: Encontre diferenciação comparando com concorrentes
4. **Identificar suposições implícitas**: Liste suposições que você assume mas não verificou
5. **Controlar o escopo do produto**: Defina limites através de não objetivos

**O que o assistente de AI fará**:
- Chamar a habilidade `superpowers:brainstorm`
- Fornecer sua ideia original
- Fazer perguntas a você através das questões geradas pela habilidade
- Coletar suas respostas e refinar a ideia

::: danger Pular este passo resultará em rejeição
O scheduler Sisyphus verificará se a habilidade brainstorm foi usada. Se não, o produto gerado pelo Bootstrap Agent será rejeitado e precisará ser reexecutado.
:::

### Passo 5: Confirme o Conteúdo do idea.md

Depois que o Bootstrap Agent terminar, ele gerará `input/idea.md`. Você precisa verificar cuidadosamente:

**Pontos de Verificação ✅**:

1. **A descrição breve está clara?**
   - ✅ Inclui: o que fazer + para quem + qual problema resolver
   - ❌ Muito geral: "Uma ferramenta para melhorar a eficiência"

2. **A descrição do problema é específica?**
   - ✅ Inclui: cenário + dificuldade + resultado negativo
   - ❌ Vago: "A experiência do usuário não é boa"

3. **O usuário alvo está claro?**
   - ✅ Tem perfil específico (idade/ocupação/habilidades técnicas)
   - ❌ Vago: "Todos"

4. **O valor central é quantificável?**
   - ✅ Tem benefício específico (economiza 80% do tempo)
   - ❌ Vago: "Melhorar a eficiência"

5. **As suposições são verificáveis?**
   - ✅ Podem ser verificadas por pesquisa de usuários
   - ❌ Julgamento subjetivo: "Os usuários gostarão"

6. **Os não objetivos são suficientes?**
   - ✅ Listar pelo menos 3 recursos que não farão
   - ❌ Faltam ou muito poucos

### Passo 6: Escolha Continuar, Retentar ou Pausar

Depois de confirmar que está correto, a CLI mostrará opções:

```bash
Escolha uma ação:
[1] Continuar (entrar na fase PRD)
[2] Retentar (regenerar idea.md)
[3] Pausar (continuar depois)
```

::: tip Recomendado verificar no editor de código primeiro
Antes de confirmar no assistente de AI, abra `input/idea.md` no editor de código e verifique palavra por palavra. Uma vez entrando na fase PRD, o custo de modificação será maior.
:::

## Alertas de Erros Comuns

### Erro 1: Descrição da ideia muito vaga

**Exemplo Errado**:
```
Quero fazer um aplicativo de fitness
```

**Consequência**: O Bootstrap Agent fará muitas perguntas através da habilidade brainstorm para completar as informações.

**Recomendação**: Descreva claramente desde o início:
```
Quero fazer um aplicativo de fitness móvel para ajudar iniciantes de fitness a registrar treinamentos, incluindo tipo de exercício, duração, calorias, e também ver estatísticas da semana.
```

### Erro 2: Incluir detalhes de implementação técnica

**Exemplo Errado**:
```
Espero usar React Native para construir, backend com Express, banco de dados é Prisma...
```

**Consequência**: O Bootstrap Agent rejeitará esses conteúdos (ele só coleta ideias de produto, a stack tecnológica é decidida na fase Tech).

**Recomendação**: Diga apenas "o que fazer", não "como fazer".

### Erro 3: Descrição do usuário alvo muito vaga

**Exemplo Errado**:
```
Todos que precisam de fitness
```

**Consequência**: Fases subsequentes não podem definir claramente a direção de design.

**Recomendação**: Defina o perfil:
```
Iniciantes de fitness de 18-30 anos, começando a treinar sistematicamente, habilidades técnicas médias, esperam registro simples e visualização de estatísticas.
```

### Erro 4: Falta ou poucos não objetivos

**Exemplo Errado**:
```
Não objetivos: Nenhum
```

**Consequência**: As fases subsequentes PRD e Code podem ter over-design, aumentando a complexidade técnica.

**Recomendação**: Liste pelo menos 3 itens:
```
Não objetivos:
- Colaboração em equipe e recursos sociais (MVP focado no individual)
- Análise de dados complexos e relatórios
- Integração com dispositivos de fitness de terceiros
```

### Erro 5: Suposições não verificáveis

**Exemplo Errado**:
```
Suposição: Os usuários gostarão do nosso design
```

**Consequência**: Não pode ser verificada por pesquisa de usuários, o MVP pode falhar.

**Recomendação**: Escreva suposições verificáveis:
```
Suposição: Os usuários estão dispostos a gastar 5 minutos aprendendo o aplicativo, se puderem ajudar a registrar treinamentos sistematicamente.
```

## Resumo da Lição

O núcleo da fase Bootstrap é **estruturação**:

1. **Entrada**: Sua ideia de produto vaga
2. **Processo**: O assistente de AI explora profundamente através da habilidade superpowers:brainstorm
3. **Saída**: `input/idea.md` que segue o modelo padrão
4. **Validação**: Verificar se a descrição é específica, se o usuário está claro, se o valor é quantificável

::: tip Princípios Chave
- ❌ O que não fazer: não criar requisitos, não projetar recursos, não decidir a stack tecnológica
- ✅ O que fazer apenas: coletar informações, organizar estruturar, apresentar por modelo
:::

## Próximo Passo

> Na próxima lição, aprenderemos **[Fase 2: PRD - Gerar Documento de Requisitos de Produto](../stage-prd/)**.
>
> Você aprenderá:
> - Como transformar idea.md em PRD nível MVP
> - O que inclui PRD (histórias de usuários, lista de recursos, requisitos não funcionais)
> - Como definir o escopo e prioridade do MVP
> - Por que o PRD não pode incluir detalhes técnicos

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir para ver localização do código fonte</strong></summary>

> Última atualização: 2026-01-29

| Funcionalidade | Caminho do Arquivo | Linhas |
|----------------|-------------------|--------|
| Definição do Bootstrap Agent | [`agents/bootstrap.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/bootstrap.agent.md) | 1-93 |
| Bootstrap Skill | [`skills/bootstrap/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/bootstrap/skill.md) | 1-433 |
| Definição do Pipeline (Fase Bootstrap) | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 8-18 |
| Definição do Scheduler | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 1-100+ |

**Restrições Chave**:
- **Uso obrigatório da habilidade brainstorm**: bootstrap.agent.md:70-71
- **Proibição de detalhes técnicos**: bootstrap.agent.md:47
- **Proibição de mesclar múltiplas ideias**: bootstrap.agent.md:48
- **O arquivo de saída deve ser salvo em input/idea.md**: bootstrap.agent.md:50

**Condições de Saída** (pipeline.yaml:15-18):
- idea.md existe
- idea.md descreve uma ideia de produto coerente
- O Agent usou a habilidade `superpowers:brainstorm` para exploração profunda

**Framework do Conteúdo da Skill**:
- **Framework de Pensamento**: extrair vs criar, problema primeiro, concretização, verificação de suposições
- **Modelo de Perguntas**: sobre problema, usuário alvo, valor central, suposições MVP, não objetivos
- **Técnicas de Extração de Informações**: de recursos para problema, de reclamações para requisitos, identificar suposições implícitas
- **Lista de Verificação de Qualidade**: integridade, especificidade, consistência, itens proibidos
- **Princípios de Decisão**: perguntar primeiro, orientado a problema, específico优于 abstrato, verificabilidade, controle de escopo
- **Tratamento de Cenários Comuns**: usuário fornece apenas uma frase, descreve muitos recursos, descreve concorrentes, ideia contraditória
- **Comparação de Exemplos**: idea.md ruim vs idea.md bom

</details>
