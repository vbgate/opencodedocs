---
title: "Etapa 2: PRD - Gerar Documento de Requisitos do Produto | Tutorial do Agent App Factory"
sidebarTitle: "Gerar Documento de Requisitos do Produto"
subtitle: "Etapa 2: PRD - Gerar Documento de Requisitos do Produto"
description: "Aprenda como a etapa PRD transforma ideias de produtos estruturadas em documento de requisitos nível MVP. Este tutorial explica detalhadamente as responsabilidades do PRD Agent, o uso de skills/prd/skill.md, a estrutura padrão de prd.md e o framework de prioridade MoSCoW, ajudando você a definir claramente o escopo do MVP e prioridades, e escrever independentemente histórias de usuário testáveis e critérios de aceitação."
tags:
  - "Pipeline"
  - "PRD"
  - "Requisitos do Produto"
prerequisite:
  - "start-pipeline-overview"
  - "advanced-stage-bootstrap"
order: 90
---

# Etapa 2: PRD - Gerar Documento de Requisitos do Produto

A etapa PRD é a segunda etapa do pipeline do Agent App Factory, responsável por transformar `input/idea.md` em um documento de requisitos completo e orientado para MVP (Minimum Viable Product). Esta etapa definirá os usuários-alvo, funcionalidades principais, escopo do MVP e não-objetivos, fornecendo diretrizes claras para o design de UI e arquitetura técnica subsequente.

## O que você será capaz de fazer

- Transformar `input/idea.md` em documento `artifacts/prd/prd.md` seguindo o modelo padrão
- Compreender os limites de responsabilidade do PRD Agent (apenas define requisitos, não envolve implementação técnica)
- Dominar o framework de prioridade de funcionalidades MoSCoW, garantindo que o MVP foque no valor central
- Ser capaz de escrever histórias de usuário de alta qualidade e critérios de aceitação verificáveis
- Saber quais conteúdos devem estar no PRD e quais devem estar nas etapas subsequentes

## Seu dilema atual

Você pode ter uma ideia clara de produto (a etapa Bootstrap já foi concluída), mas encontra dificuldades ao transformá-la em documento de requisitos:

- "Não sei quais funcionalidades incluir, preocupado com omissões ou over-engineering"
- "Muitas funcionalidades, mas não sei quais são essenciais para o MVP"
- "Histórias de usuário não são claras, a equipe de desenvolvimento não consegue entender"
- "Acidentalmente misturar detalhes de implementação técnica nos requisitos, causando scope creep"

Um PRD não claro resultará em falta de diretrizes claras para o design de UI e desenvolvimento de código subsequente, e o aplicativo final pode se desviar de suas expectativas ou incluir complexidade desnecessária.

## Quando usar esta técnica

Quando a etapa Bootstrap for concluída e as seguintes condições forem atendidas:

1. **Estruturação do idea.md concluída** (saída da etapa Bootstrap)
2. **Ainda não iniciou design de UI ou arquitetura técnica** (estas em etapas subsequentes)
3. **Deseja definir claramente o escopo do MVP** (evitar over-engineering funcional)
4. **Precisa fornecer diretrizes claras para desenvolvimento e design** (histórias de usuário, critérios de aceitação)

## 🎒 Preparação antes de começar

::: warning Pré-requisitos
Antes de iniciar a etapa PRD, certifique-se de:

- ✅ [Inicialização do projeto](../../start/init-project/) concluída
- ✅ Entendeu a [visão geral do pipeline de 7 etapas](../../start/pipeline-overview/)
- ✅ [Etapa Bootstrap](../stage-bootstrap/) concluída, gerou `input/idea.md`
- ✅ Assistente de AI instalado e configurado (Claude Code recomendado)
:::

## Ideia central

### O que é a etapa PRD?

**PRD** (Product Requirements Document - Documento de Requisitos do Produto), a responsabilidade principal da etapa PRD é **definir o que fazer, não como fazer**.

::: info Não é documento técnico
O PRD Agent não é arquiteto ou designer de UI, ele não decidirá por você:
- ❌ Qual stack tecnológico usar (React vs Vue, Express vs Koa)
- ❌ Como projetar o banco de dados (estrutura de tabelas, índices)
- ❌ Layout de UI e detalhes de interação (posição dos botões, esquema de cores)

Sua tarefa é:
- ✅ Definir usuários-alvo e seus pontos problemáticos
- ✅ Listar funcionalidades principais e prioridades
- ✅ Definir claramente escopo do MVP e não-objetivos
- ✅ Fornecer histórias de usuário e critérios de aceitação testáveis
:::

### Por que PRD?

Imagine que você diz à equipe de construção: "Quero construir uma casa"

- ❌ Sem plantas: a equipe de construção só pode adivinhar, pode construir uma casa que você não quer morar
- ✅ Com plantas detalhadas: número de quartos, layout funcional, requisitos de materiais, a equipe de construção segue as plantas

A etapa PRD é transformar "quero construir uma casa" em plantas detalhadas como "três quartos e duas salas, quarto principal voltado para o sul, cozinha aberta".

### Framework de prioridade de funcionalidades MoSCoW

A etapa PRD usa o **framework MoSCoW** para classificar funcionalidades, garantindo que o MVP foque no valor central:

| Categoria | Definição | Critério de julgamento | Exemplo |
| --- | --- | --- | --- |
| **Must Have** | Funcionalidades absolutamente essenciais para o MVP | Sem ela, o produto não pode entregar valor central | Aplicativo de contabilidade: adicionar registro de despesas, visualizar lista de despesas |
| **Should Have** | Funcionalidades importantes mas não bloqueantes | Usuários sentirão claramente a falta, mas podem usar soluções alternativas temporariamente | Aplicativo de contabilidade: exportar relatórios, estatísticas por categoria |
| **Could Have** | Funcionalidades que agregam valor | Não afeta a experiência central, usuários não notarão especialmente a ausência | Aplicativo de contabilidade: lembretes de orçamento, suporte multi-moeda |
| **Won't Have** | Funcionalidades explicitamente excluídas | Irrelevante para o valor central ou complexidade técnica alta | Aplicativo de contabilidade: compartilhamento social, conselhos de investimento |

::: tip Núcleo do MVP
Funcionalidades Must Have devem ser controladas em 5-7 itens, garantindo que o MVP foque no valor central e evitando scope creep.
:::

## Siga-me

### Passo 1: Confirme que a etapa Bootstrap foi concluída

Antes de iniciar a etapa PRD, certifique-se de que `input/idea.md` existe e o conteúdo atende ao padrão.

```bash
# Verifique se idea.md existe
cat input/idea.md
```

**Você deve ver**: documento estruturado contendo seções como breve descrição, problema, usuários-alvo, valor central, suposições, não-objetivos, etc.

::: tip Se idea.md não atende ao padrão
Volte para [Etapa Bootstrap](../stage-bootstrap/) para regenerar, ou edite manualmente para complementar informações.
:::

### Passo 2: Inicie o pipeline até a etapa PRD

Execute no diretório do projeto Factory:

```bash
# Se o pipeline já foi iniciado, continue até a etapa PRD
factory run prd

# Ou inicie o pipeline desde o início
factory run
```

A CLI exibirá o status atual e as etapas disponíveis, e gerará as instruções do assistente PRD Agent.

### Passo 3: O assistente de AI lê a definição do PRD Agent

O assistente de AI (como Claude Code) lerá automaticamente `agents/prd.agent.md`, entendendo suas responsabilidades e restrições.

::: info Responsabilidades do PRD Agent
O PRD Agent só pode:
- Ler `input/idea.md`
- Escrever `artifacts/prd/prd.md`
- Usar framework de pensamento e princípios de decisão em `skills/prd/skill.md`

Ele não pode:
- Discutir quaisquer detalhes de implementação técnica ou design de UI
- Ler outros arquivos (incluindo artefatos upstream)
- Escrever em outros diretórios
:::

### Passo 4: Carregue skills/prd/skill.md

O PRD Agent carregará `skills/prd/skill.md`, obtendo as seguintes diretrizes:

**Framework de pensamento**:
- Usuário-alvo: quem usará? Contexto, papel, pontos problemáticos são?
- Problema central: qual problema fundamental o produto resolve?
- Valor central: por que esta solução tem valor? Quais são as vantagens em relação aos concorrentes?
- Indicadores de sucesso: como medir o sucesso?

**Prioridade de funcionalidades MoSCoW**:
- Must Have (Deve ter): funcionalidades absolutamente essenciais para o MVP
- Should Have (Deveria ter): funcionalidades importantes mas não bloqueantes
- Could Have (Poderia ter): funcionalidades que agregam valor
- Won't Have (Não terá): funcionalidades explicitamente excluídas

**Guia de escrita de histórias de usuário**:
```
Como [papel/tipo de usuário]
Quero [funcionalidade/operação]
Para [valor de negócio/objetivo]
```

**Requisitos de estrutura do documento PRD** (8 seções):
1. Visão geral
2. Persona de usuários-alvo
3. Proposta de valor central
4. Requisitos funcionais (classificação MoSCoW)
5. Fluxo do usuário
6. Não-objetivos (Won't Have)
7. Indicadores de sucesso
8. Suposições e riscos

### Passo 5: Gere o documento PRD

O assistente de AI gerará um documento PRD completo com base no conteúdo de `input/idea.md`, usando o framework de pensamento e os princípios de decisão das habilidades.

**O que o PRD Agent fará**:
1. Ler `input/idea.md`, extrair elementos-chave (usuários-alvo, problema, valor central, etc.)
2. Classificar funcionalidades de acordo com o framework MoSCoW
3. Escrever histórias de usuário e critérios de aceitação para funcionalidades Must Have
4. Listar não-objetivos, prevenindo scope creep
5. Fornecer indicadores de sucesso quantificáveis
6. Escrever o documento organizado em `artifacts/prd/prd.md`

::: tip Restrições-chave
O PRD Agent é proibido de discutir detalhes de implementação técnica ou design de UI. Se detectar tais conteúdos, o PRD Agent recusará escrever.
:::

### Passo 6: Confirme o conteúdo de prd.md

Após o PRD Agent concluir, ele gerará `artifacts/prd/prd.md`. Você precisa verificar cuidadosamente:

**Pontos de verificação ✅**:

1. **Usuário-alvo** é específico?
   - ✅ Tem persona específica (idade/profissão/habilidade técnica/cenário de uso/pontos problemáticos)
   - ❌ Vago: "todas as pessoas" ou "pessoas que precisam de contabilidade"

2. **Problema central** é claro?
   - ✅ Descreve problemas que os usuários encontram em cenários do mundo real
   - ❌ Genérico: "experiência do usuário ruim"

3. **Valor central** é quantificável?
   - ✅ Tem benefício específico (economizar 80% do tempo, aumentar eficiência em 50%)
   - ❌ Genérico: "melhorar eficiência", "melhor experiência"

4. **Funcionalidades Must Have** são focadas?
   - ✅ Não mais que 5-7 funcionalidades principais
   - ❌ Funcionalidades excessivas ou contendo funcionalidades secundárias

5. **Cada funcionalidade Must Have** tem história de usuário?
   - ✅ Usa formato padrão (Como...Quero...Para...)
   - ❌ Falta história de usuário ou formato incorreto

6. **Critérios de aceitação** são verificáveis?
   - ✅ Tem padrões verificáveis específicos (pode inserir valor, exibir na lista)
   - ❌ Vago ("amigável ao usuário", "experiência suave")

7. **Should Have** e **Won't Have** estão listados explicitamente?
   - ✅ Should Have marcado como "iteração futura" com motivo
   - ✅ Won't Have explica por que excluído
   - ❌ Falta ou muito pouco

8. **Indicadores de sucesso** são quantificáveis?
   - ✅ Tem valores específicos (taxa de retenção > 30%, tempo de conclusão < 30 segundos)
   - ❌ Vago ("usuários gostam", "boa experiência")

9. **Suposições** são verificáveis?
   - ✅ Pode ser verificado por pesquisa de usuário
   - ❌ Julgamento subjetivo ("usuários gostarão")

10. **Contém detalhes de implementação técnica ou design de UI**?
    - ✅ Sem detalhes técnicos e descrições de UI
    - ❌ Contém escolha de stack, design de banco de dados, layout de UI, etc.

### Passo 7: Escolha continuar, tentar novamente ou pausar

Após a verificação, a CLI exibirá opções:

```bash
Escolha uma ação:
[1] Continuar (entrar na etapa UI)
[2] Tentar novamente (regenerar prd.md)
[3] Pausar (continuar mais tarde)
```

::: tip Recomendação: verifique no editor de código primeiro
Antes de confirmar no assistente de AI, abra `artifacts/prd/prd.md` no editor de código e verifique palavra por palavra. Uma vez que você entrar na etapa UI, o custo de modificação será maior.
:::

## Avisos sobre armadilhas

### Armadilha 1: Muitas funcionalidades Must Have

**Exemplo de erro**:
```
Must Have:
1. Adicionar registro de despesas
2. Visualizar lista de despesas
3. Exportar relatórios
4. Estatísticas por categoria
5. Lembretes de orçamento
6. Suporte multi-moeda
7. Compartilhamento social
8. Conselhos de investimento
```

**Consequência**: Escopo do MVP muito grande, ciclo de desenvolvimento longo, alto risco.

**Recomendação**: Controle em 5-7 funcionalidades principais:
```
Must Have:
1. Adicionar registro de despesas
2. Visualizar lista de despesas
3. Selecionar categoria de despesas

Should Have (iteração futura):
4. Exportar relatórios
5. Estatísticas por categoria

Won't Have (explicitamente excluído):
6. Compartilhamento social (irrelevante para o valor central)
7. Conselhos de investimento (requer qualificação profissional, alta complexidade técnica)
```

### Armadilha 2: Falta de histórias de usuário ou formato incorreto

**Exemplo de erro**:
```
Funcionalidade: Adicionar registro de despesas
Descrição: Usuário pode adicionar registro de despesas
```

**Consequência**: A equipe de desenvolvimento não sabe para quem está fazendo, qual problema resolve.

**Recomendação**: Use formato padrão:
```
Funcionalidade: Adicionar registro de despesas
História de usuário: Como um usuário com consciência de orçamento
Quero registrar cada despesa
Para entender para onde meu dinheiro está indo e controlar o orçamento

Critérios de aceitação:
- Pode inserir valor e descrição da despesa
- Pode selecionar categoria de despesa
- Registro aparece imediatamente na lista de despesas
- Exibe data e hora atual
```

### Armadilha 3: Critérios de aceitação não verificáveis

**Exemplo de erro**:
```
Critérios de aceitação:
- Interface amigável
- Operação suave
- Boa experiência
```

**Consequência**: Não é possível testar, a equipe de desenvolvimento não sabe o que conta como "amigável", "suave", "boa".

**Recomendação**: Escreva padrões verificáveis específicos:
```
Critérios de aceitação:
- Pode inserir valor e descrição da despesa
- Pode selecionar de 10 categorias predefinidas
- Registro aparece na lista de despesas em 1 segundo
- Registra automaticamente data e hora atual
```

### Armadilha 4: Descrição de usuários-alvo muito genérica

**Exemplo de erro**:
```
Usuário-alvo: Todas as pessoas que precisam de contabilidade
```

**Consequência**: O design de UI subsequente e a arquitetura técnica não podem ter direção clara.

**Recomendação**: Defina persona:
```
Principais grupos de usuários:
- Papel: Jovens recém-empregados com 18-30 anos
- Idade: 18-30 anos
- Habilidade técnica: Intermediário, familiarizado com aplicativos de smartphone
- Cenário de uso: Registrar imediatamente após consumo diário, visualizar estatísticas no final do mês
- Ponto problemático: Descobrir estourou o orçamento no final do mês, mas não sabe onde o dinheiro foi gasto, sem controle de orçamento
```

### Armadilha 5: Falta de não-objetivos ou muito pouco

**Exemplo de erro**:
```
Não-objetivos: Nenhum
```

**Consequência**: As etapas subsequentes de PRD e Code podem fazer over-engineering, aumentando a complexidade técnica.

**Recomendação**: Liste pelo menos 3 itens:
```
Não-objetivos (Out of Scope):
- Funcionalidade de compartilhamento social (MVP foca em contabilidade pessoal)
- Conselhos financeiros e análise de investimento (requer qualificação profissional, além do valor central)
- Integração com sistemas financeiros de terceiros (alta complexidade técnica, MVP não precisa)
- Análise de dados complexa e relatórios (Should Have, iteração futura)
```

### Armadilha 6: Inclui detalhes de implementação técnica

**Exemplo de erro**:
```
Funcionalidade: Adicionar registro de despesas
Implementação técnica: Use React Hook Form para gerenciar formulário, endpoint de API POST /api/expenses
```

**Consequência**: O PRD Agent recusará esses conteúdos (apenas define requisitos, não envolve implementação técnica).

**Recomendação**: Apenas diga "o que fazer", não "como fazer":
```
Funcionalidade: Adicionar registro de despesas
História de usuário: Como um usuário com consciência de orçamento
Quero registrar cada despesa
Para entender para onde meu dinheiro está indo e controlar o orçamento

Critérios de aceitação:
- Pode inserir valor e descrição da despesa
- Pode selecionar categoria de despesa
- Registro aparece imediatamente na lista de despesas
- Exibe data e hora atual
```

### Armadilha 7: Indicadores de sucesso não quantificáveis

**Exemplo de erro**:
```
Indicadores de sucesso:
- Usuários gostam do nosso aplicativo
- Experiência suave
- Alta retenção de usuários
```

**Consequência**: Não é possível medir se o produto é bem-sucedido.

**Recomendação**: Escreva indicadores quantificáveis:
```
Indicadores de sucesso:
Objetivos do produto:
- Obter 100 usuários ativos no primeiro mês
- Usuários usam pelo menos 3 vezes por semana
- Taxa de uso de funcionalidades centrais (adicionar registro de despesas) > 80%

Principais indicadores (KPIs):
- Taxa de retenção de usuários: retenção de 7 dias > 30%, retenção de 30 dias > 15%
- Taxa de uso de funcionalidades centrais: uso de adicionar registro de despesas > 80%
- Tempo de conclusão de tarefa: adicionar uma despesa < 30 segundos

Método de verificação:
- Registrar comportamento do usuário através de logs de backend
- Usar A/B testing para verificar retenção de usuários
- Coletar satisfação através de questionários de feedback do usuário
```

### Armadilha 8: Suposições não verificáveis

**Exemplo de erro**:
```
Suposição: Usuários gostarão do nosso design
```

**Consequência**: Não é possível verificar através de pesquisa de usuário, o MVP pode falhar.

**Recomendação**: Escreva suposições verificáveis:
```
Suposições:
Suposições de mercado:
- Jovens (18-30 anos) têm ponto problemático de "não sabem para onde o dinheiro foi gasto"
- Aplicativos de contabilidade existentes são muito complexos, jovens precisam de uma solução mais simples

Suposições de comportamento do usuário:
- Usuários estão dispostos a gastar 2 minutos para registrar despesas após cada consumo, se ajudar a controlar o orçamento
- Usuários preferem UI minimalista, não precisam de gráficos e análises complexas

Suposições de viabilidade técnica:
- Aplicativo móvel pode implementar processo rápido de contabilidade de 3 etapas
- Armazenamento offline pode atender necessidades básicas
```

## Resumo desta lição

O núcleo da etapa PRD é **definir requisitos, não implementação**:

1. **Entrada**: `input/idea.md` estruturado (saída da etapa Bootstrap)
2. **Processo**: Assistente de AI usa framework de pensamento de `skills/prd/skill.md` e framework de prioridade MoSCoW
3. **Saída**: Documento completo `artifacts/prd/prd.md`
4. **Verificação**: Verifique se usuários são claros, valor é quantificável, funcionalidades são focadas, se contém detalhes técnicos

::: tip Princípios-chave
- ❌ O que não fazer: não discutir implementação técnica, não projetar layout de UI, não decidir estrutura de banco de dados
- ✅ O que apenas fazer: definir usuários-alvo, listar funcionalidades principais, definir escopo do MVP, fornecer histórias de usuário testáveis
:::

## Preview da próxima lição

> Na próxima lição, aprenderemos **[Etapa 3: UI - Design de Interface e Protótipo](../stage-ui/)**.
>
> Você aprenderá:
> - Como projetar estrutura de UI com base no PRD
> - Como usar a habilidade ui-ux-pro-max para gerar sistema de design
> - Como gerar protótipos de HTML visualizáveis
> - Arquivos de saída da etapa UI e condições de saída

---

## Apêndice: Referência de código-fonte

<details>
<summary><strong>Clique para expandir e ver localização do código-fonte</strong></summary>

> Última atualização: 2026-01-29

| Funcionalidade | Caminho do arquivo | Número da linha |
| --- | --- | --- |
| Definição do PRD Agent | [`agents/prd.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/prd.agent.md) | 1-33 |
| Habilidade PRD | [`skills/prd/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/prd/skill.md) | 1-325 |
| Definição do pipeline (Etapa PRD) | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 20-33 |
| Definição do orquestrador | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 1-100+ |

**Restrições-chave**:
- **Proibir detalhes de implementação técnica**: prd.agent.md:23
- **Proibir descrições de design de UI**: prd.agent.md:23
- **Deve incluir usuários-alvo**: pipeline.yaml:29
- **Deve definir escopo do MVP**: pipeline.yaml:30
- **Deve listar não-objetivos**: pipeline.yaml:31
- **Arquivo de saída deve ser salvo em artifacts/prd/prd.md**: prd.agent.md:13

**Condições de saída** (pipeline.yaml:28-32):
- PRD inclui usuários-alvo
- PRD define escopo do MVP
- PRD lista não-objetivos (Out of Scope)
- PRD não contém quaisquer detalhes de implementação técnica

**Framework de conteúdo da habilidade**:
- **Framework de pensamento**: usuários-alvo, problema central, valor central, indicadores de sucesso
- **Framework de prioridade de funcionalidades MoSCoW**: Must Have, Should Have, Could Have, Won't Have
- **Guia de escrita de histórias de usuário**: formato padrão e exemplos
- **Requisitos de estrutura do documento PRD**: 8 seções obrigatórias
- **Princípios de decisão**: centrado no usuário, foco no MVP, não-objetivos claros, testabilidade
- **Lista de verificação de qualidade**: usuários e problema, escopo de funcionalidades, histórias de usuário, integridade do documento, verificação de itens proibidos
- **Não fazer (NEVER)**: 7 comportamentos explicitamente proibidos

**Seções obrigatórias do documento PRD**:
1. Visão geral (visão geral do produto, contexto e objetivos)
2. Persona de usuários-alvo (principais grupos de usuários, grupos secundários de usuários)
3. Proposta de valor central (problema resolvido, nossa solução, vantagem diferenciada)
4. Requisitos funcionais (Must Have, Should Have, Could Have)
5. Fluxo do usuário (descrição do fluxo principal)
6. Não-objetivos (Won't Have)
7. Indicadores de sucesso (objetivos do produto, principais indicadores, método de verificação)
8. Suposições e riscos (suposições de mercado, suposições de comportamento do usuário, suposições de viabilidade técnica, tabela de riscos)

</details>
