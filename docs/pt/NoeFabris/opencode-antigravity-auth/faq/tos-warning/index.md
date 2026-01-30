---
title: "Aviso de ToS: Riscos de Conta e Práticas de Segurança | Antigravity Auth"
sidebarTitle: "Evite o Banimento de Conta"
subtitle: "Aviso de ToS: Riscos de Conta e Práticas de Segurança"
description: "Aprenda sobre os riscos de uso do plugin Antigravity Auth e práticas de segurança de conta. Entenda cenários de alto risco, mecanismo de shadow ban e diferenças de limite de taxa, domine estratégias de múltiplas contas, controle de uso e métodos de aquecimento de conta."
tags:
  - FAQ
  - Aviso de Risco
  - Segurança de Conta
prerequisite:
  - start-quick-install
order: 5
---

# Aviso de ToS

Após concluir esta lição, você entenderá os riscos potenciais ao usar o plugin Antigravity Auth e como proteger a segurança da sua conta Google.

## O Desafio que Você Enfrenta Agora

Você está considerando usar o plugin Antigravity Auth para acessar os modelos de IA do Google Antigravity, mas tem algumas preocupações:

- Viu relatos na comunidade de contas sendo banidas ou recebendo shadow ban
- Preocupado que usar ferramentas não oficiais viole os Termos de Serviço do Google
- Incerto se deve usar uma conta nova ou antiga
- Quer saber como reduzir os riscos

Essas preocupações são razoáveis. Usar qualquer ferramenta não oficial envolve certos riscos, e este artigo ajudará você a entender os pontos de risco específicos e estratégias de resposta.

## Quando Você Precisa Desta Lição

- **Antes de instalar o plugin**: Entenda os riscos antes de decidir usar
- **Ao escolher uma conta**: Decida qual conta Google usar para autenticação
- **Ao encontrar banimento**: Entenda possíveis causas e medidas preventivas
- **Ao registrar nova conta**: Evite padrões de operação de alto risco

---

## Visão Geral dos Riscos Principais

::: danger Aviso Importante

**Usar este plugin pode violar os Termos de Serviço (Terms of Service) do Google.**

Um pequeno número de usuários relatou que suas contas Google foram banidas ou receberam shadow ban (restrição de acesso sem notificação explícita).

**Usar este plugin significa que você aceita as seguintes declarações:**
1. Esta é uma ferramenta não oficial, não reconhecida ou endossada pelo Google
2. Sua conta Google pode ser suspensa ou permanentemente banida
3. Você assume todos os riscos e consequências do uso deste plugin

:::

### O que é Shadow Ban?

**Shadow Ban** é uma medida restritiva que o Google aplica a contas suspeitas. Diferente de banimento direto, o shadow ban não exibe mensagens de erro claras, mas:
- Requisições de API retornam erros 403 ou 429
- A cota aparece disponível, mas não pode ser usada
- Outras contas funcionam normalmente, apenas a conta marcada é afetada

Shadow bans geralmente duram muito tempo (dias a semanas) e não podem ser recuperados por apelação.

---

## Cenários de Alto Risco

Os seguintes cenários aumentam significativamente o risco de sua conta ser marcada ou banida:

### 🚨 Cenário 1: Conta Google Totalmente Nova

**Nível de Risco: Extremamente Alto**

Contas Google recém-registradas usando este plugin têm probabilidade muito alta de banimento. Razões:
- Novas contas carecem de dados históricos de comportamento, facilmente marcadas pelo sistema de detecção de abuso do Google
- Grande volume de chamadas de API em novas contas é visto como comportamento anormal
- O Google tem auditoria mais rigorosa para novas contas

**Recomendação**: Não crie novas contas especificamente para este plugin.

### 🚨 Cenário 2: Nova Conta + Assinatura Pro/Ultra

**Nível de Risco: Extremamente Alto**

Contas recém-registradas que imediatamente assinam serviços Pro ou Ultra do Google são frequentemente marcadas e banidas. Razões:
- Padrão de alto uso após assinatura em novas contas parece abuso
- O Google tem auditoria mais rigorosa para novos usuários pagantes
- Este padrão difere muito do caminho de crescimento de usuários normais

**Recomendação**: Deixe a conta "crescer naturalmente" por um período (pelo menos alguns meses) antes de considerar assinatura.

### 🟡 Cenário 3: Grande Volume de Requisições em Curto Período

**Nível de Risco: Alto**

Fazer grande volume de requisições de API em curto período, ou usar frequentemente proxies paralelos/múltiplas sessões, acionará limites de taxa e detecção de abuso. Razões:
- O padrão de requisições do OpenCode é mais denso que aplicativos nativos (chamadas de ferramentas, tentativas, streaming, etc.)
- Requisições de alta concorrência acionam mecanismos de proteção do Google

**Recomendação**:
- Controle frequência de requisições e número de concorrência
- Evite iniciar múltiplos proxies paralelos simultaneamente
- Use rotação de múltiplas contas para distribuir requisições

### 🟡 Cenário 4: Usar Conta Google Única

**Nível de Risco: Médio**

Se você tem apenas uma conta Google e depende dela para acessar serviços críticos (Gmail, Drive, etc.), o risco é maior. Razões:
- Banimento de conta afetará seu trabalho diário
- Não pode ser recuperado por apelação
- Falta de plano alternativo

**Recomendação**: Use uma conta independente que não dependa de serviços críticos.

---

## Recomendações de Melhores Práticas

### ✅ Práticas Recomendadas

**1. Use Contas Google Estabelecidas**

Priorize contas Google que já estão em uso há algum tempo (recomendado 6 meses ou mais):
- Tenha histórico normal de uso de serviços Google (Gmail, Drive, Google Search, etc.)
- Sem histórico de violações
- Conta vinculada a número de telefone e verificada

**2. Configure Múltiplas Contas**

Adicione múltiplas contas Google, distribua requisições através de rotação:
- Configure pelo menos 2-3 contas
- Use estratégia `account_selection_strategy: "hybrid"` (padrão)
- Troque automaticamente de conta ao encontrar limite de taxa

**3. Controle o Volume de Uso**

- Evite requisições densas em curto período
- Reduza o número de proxies paralelos
- Configure `max_rate_limit_wait_seconds: 0` em `antigravity.json` para falhar rapidamente em vez de tentar novamente

**4. Monitore Status da Conta**

Verifique regularmente o status da conta:
- Veja `rateLimitResetTimes` em `~/.config/opencode/antigravity-accounts.json`
- Habilite logs de debug: `OPENCODE_ANTIGRAVITY_DEBUG=1 opencode`
- Ao encontrar erros 403/429, pause o uso por 24-48 horas

**5. "Aqueça" Primeiro na Interface Oficial**

Método eficaz relatado por usuários da comunidade:
1. Faça login no navegador em [Antigravity IDE](https://idx.google.com/)
2. Execute alguns prompts simples (como "olá", "quanto é 2+2")
3. Após 5-10 chamadas bem-sucedidas, use o plugin

**Princípio**: Usar a conta através da interface oficial faz o Google reconhecer como comportamento normal de usuário, reduzindo o risco de ser marcado.

### ❌ Práticas a Evitar

- ❌ Criar novas contas Google especificamente para este plugin
- ❌ Assinar Pro/Ultra imediatamente em contas recém-registradas
- ❌ Usar conta única de serviços críticos (como email de trabalho)
- ❌ Tentar repetidamente após acionar limite 429
- ❌ Iniciar grande número de proxies paralelos simultaneamente
- ❌ Submeter `antigravity-accounts.json` para controle de versão

---

## Perguntas Frequentes

### Q: Minha conta foi banida, posso apelar?

**A: Não.**

Se o banimento ou shadow ban foi acionado pela detecção de abuso do Google através deste plugin, geralmente não pode ser recuperado por apelação. Razões:
- Banimento é acionado automaticamente com base no padrão de uso de API
- O Google tem atitude rigorosa sobre uso de ferramentas não oficiais
- Ao apelar, você precisa explicar o uso da ferramenta, mas o próprio plugin pode ser visto como violação

**Recomendação**:
- Use outras contas não afetadas
- Se todas as contas foram banidas, use diretamente [Antigravity IDE](https://idx.google.com/)
- Evite continuar tentando em contas banidas

### Q: Usar este plugin definitivamente resultará em banimento?

**A: Não necessariamente.**

A maioria dos usuários não encontrou problemas ao usar este plugin. O risco depende de:
- Idade da conta e comportamento histórico
- Frequência de uso e padrão de requisições
- Se segue as melhores práticas

**Avaliação de Risco**:
- Conta antiga + uso moderado + rotação de múltiplas contas → Baixo risco
- Conta nova + requisições densas + conta única → Alto risco

### Q: Qual é a diferença entre shadow ban e limite de taxa?

**A: Natureza diferente, métodos de recuperação também diferentes.**

| Característica | Shadow Ban | Limite de Taxa (429) |
| --- | --- | --- |
| Causa do Acionamento | Detecção de abuso, marcado como suspeito | Frequência de requisições excede cota |
| Código de Erro | 403 ou falha silenciosa | 429 Too Many Requests |
| Duração | Dias a semanas | Horas a um dia |
| Método de Recuperação | Não pode recuperar, precisa usar outra conta | Aguardar reset ou trocar conta |
| Pode Prevenir | Seguir melhores práticas reduz risco | Controlar frequência de requisições |

### Q: Posso usar conta Google corporativa?

**A: Não recomendado.**

Contas corporativas geralmente estão vinculadas a serviços e dados críticos, banimento tem impacto mais sério. Além disso:
- Contas corporativas têm auditoria mais rigorosa
- Pode violar políticas de TI da empresa
- Risco é assumido individualmente, mas afeta a equipe

**Recomendação**: Use conta pessoal.

### Q: Múltiplas contas podem evitar completamente o banimento?

**A: Não pode evitar completamente, mas pode reduzir o impacto.**

Função de múltiplas contas:
- Distribuir requisições, reduzir probabilidade de conta única acionar limites
- Se uma conta for banida, outras contas ainda estão disponíveis
- Trocar automaticamente ao encontrar limites, melhorar disponibilidade

**Mas múltiplas contas não são "amuleto de proteção"**:
- Se todas as contas acionarem detecção de abuso, podem todas ser banidas
- Não abuse de múltiplas contas para requisições densas
- Cada conta ainda precisa seguir melhores práticas

---

## Checkpoint ✅

Após ler esta lição, você deve saber:
- [ ] Usar este plugin pode violar Google ToS, risco por sua conta
- [ ] Nova conta + assinatura Pro/Ultra é cenário de alto risco
- [ ] Recomendado usar contas Google estabelecidas
- [ ] Configurar múltiplas contas pode distribuir riscos
- [ ] Contas banidas não podem ser recuperadas por apelação
- [ ] Controlar frequência de requisições e volume de uso é importante

---

## Resumo da Lição

Esta lição apresentou os riscos potenciais ao usar o plugin Antigravity Auth:

1. **Riscos Principais**: Pode violar Google ToS, conta pode ser banida ou receber shadow ban
2. **Cenários de Alto Risco**: Novas contas, nova conta + assinatura, requisições densas, conta crítica única
3. **Melhores Práticas**: Use contas antigas, configure múltiplas contas, controle volume de uso, monitore status, "aqueça" primeiro
4. **Perguntas Frequentes**: Não pode apelar, risco varia por pessoa, múltiplas contas podem reduzir impacto

Antes de usar este plugin, avalie cuidadosamente os riscos. Se você não pode aceitar as consequências de possível banimento de conta, recomenda-se usar diretamente [Antigravity IDE](https://idx.google.com/).

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código fonte</strong></summary>

> Última atualização: 2026-01-23

Este conteúdo da lição é baseado na seção de aviso de risco da documentação README do projeto (README.md:23-40), não envolve implementação de código específico.

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Declaração de Aviso de ToS | [`README.md`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/README.md#L23-L40) | 23-40 |

</details>
