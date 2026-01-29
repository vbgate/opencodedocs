---
title: "Cota Copilot: Premium Requests | opencode-mystatus"
sidebarTitle: "Cota Copilot"
subtitle: "Consulta de cota GitHub Copilot: Premium Requests e detalhes de modelo"
description: "Aprenda a consultar Premium Requests do GitHub Copilot. Suporta OAuth Token e Fine-grained PAT para diferentes tipos de assinatura Free/Pro/Pro+/Business/Enterprise."
tags:
  - "github-copilot"
  - "cota"
  - "premium-requests"
  - "autenticação-pat"
prerequisite:
  - "start-quick-start"
order: 3
---

# Consulta de cota GitHub Copilot: Premium Requests e detalhes de modelo

## O que você poderá fazer após concluir

- Visualizar rapidamente o uso mensal de Premium Requests do GitHub Copilot
- Entender as diferenças de limites mensais para diferentes tipos de assinatura (Free / Pro / Pro+ / Business / Enterprise)
- Ver detalhes de uso por modelo (como número de usos de GPT-4, Claude, etc.)
- Identificar contagem de uso excessivo e estimar custos extras
- Resolver problemas de permissão da nova integração OpenCode (OAuth Token não consegue consultar cota)

## O seu problema atual

::: info Problema de permissão da nova integração OpenCode

A nova integração OAuth do OpenCode não concede mais permissão para acessar a API `/copilot_internal/*`, fazendo com que o método OAuth Token original não consiga consultar a cota.

Você pode encontrar o seguinte erro:
```
⚠️ GitHub Copilot 配额查询暂时不可用。
OpenCode 的新 OAuth 集成不支持访问配额 API。

解决方案:
1. 创建一个 fine-grained PAT (访问 https://github.com/settings/tokens?type=beta)
2. 在 'Account permissions' 中将 'Plan' 设为 'Read-only'
...
```

Isso é normal, este tutorial ensinará como resolver.

:::

## Ideia principal

A cota do GitHub Copilot é dividida nos seguintes conceitos centrais:

### Premium Requests (cota principal)

Premium Requests é o principal indicador de cota do Copilot, incluindo:
- Interações de Chat (conversação com assistente de IA)
- Code Completion (completamento de código)
- Funcionalidades do Copilot Workspace (colaboração no espaço de trabalho)

::: tip O que são Premium Requests?

Em termos simples: cada vez que o Copilot "trabalha" para você (gerar código, responder perguntas, analisar código) conta como um Premium Request. Esta é a principal unidade de cobrança do Copilot.

:::

### Tipos de assinatura e limites

Diferentes tipos de assinatura têm diferentes limites mensais:

| Tipo de assinatura | Limite mensal | Público-alvo |
|--- | --- | ---|
| Free | 50 vezes | Desenvolvedor individual em teste |
| Pro | 300 vezes | Desenvolvedor individual versão completa |
| Pro+ | 1.500 vezes | Desenvolvedor individual intenso |
| Business | 300 vezes | Assinatura de equipe (300 por conta) |
| Enterprise | 1.000 vezes | Assinatura corporativa (1.000 por conta) |

### Uso excessivo

Se você exceder o limite mensal, o Copilot ainda pode ser usado, mas gerará custos adicionais. A contagem de uso excessivo será exibida separadamente na saída.

## 🎒 Preparação antes de começar

### Pré-requisitos

::: warning Verificação de configuração

Este tutorial assume que você já:

1. ✅ **Instalou o plugin opencode-mystatus**
   - Consulte [Início rápido](../../start/quick-start/)

2. ✅ **Configurou pelo menos um dos seguintes**:
   - Fez login no GitHub Copilot no OpenCode (OAuth Token)
   - Criou manualmente o arquivo de configuração de Fine-grained PAT (recomendado)

:::

### Método de configuração (escolha um)

#### Método 1: Usar Fine-grained PAT (recomendado)

Este é o método mais confiável, não afetado por alterações na integração OAuth do OpenCode.

1. Visite https://github.com/settings/tokens?type=beta
2. Clique em "Generate new token (classic)" ou "Generate new token (beta)"
3. Em "Account permissions", defina **Plan** como **Read-only**
4. Gere o Token, formato semelhante a `github_pat_11A...`
5. Crie o arquivo de configuração `~/.config/opencode/copilot-quota-token.json`:

```json
{
  "token": "github_pat_11A...",
  "username": "your-username",
  "tier": "pro"
}
```

**Explicação dos campos do arquivo de configuração**:
- `token`: Seu Fine-grained PAT
- `username`: Nome de usuário GitHub (usado para chamadas de API)
- `tier`: Tipo de assinatura, valores opcionais: `free` / `pro` / `pro+` / `business` / `enterprise`

#### Método 2: Usar OAuth Token OpenCode

Se você já fez login no GitHub Copilot no OpenCode, o mystatus tentará usar seu OAuth Token.

::: warning Aviso de compatibilidade

Este método pode falhar devido a limitações de permissão da integração OAuth OpenCode. Se falhar, use o método 1 (Fine-grained PAT).

:::

## Siga-me

### Passo 1: Executar comando de consulta

No OpenCode, execute o comando de barra:

```bash
/mystatus
```

**O que você deve ver**:

Se você configurou uma conta Copilot (usando Fine-grained PAT ou OAuth Token), a saída conterá conteúdo semelhante ao seguinte:

```
## GitHub Copilot Account Quota

Account:        GitHub Copilot (pro)

Premium Requests [████████░░░░░░░░░░] 40% (180/300)

模型使用明细:
  gpt-4: 120 requests
  claude-3-5-sonnet: 60 requests

Period: 2026-01
```

### Passo 2: Interpretar os resultados de saída

A saída contém as seguintes informações principais:

#### 1. Informações da conta

```
Account:        GitHub Copilot (pro)
```

Exibe seu tipo de assinatura Copilot (pro / free / business, etc.).

#### 2. Cota de Premium Requests

```
Premium Requests [████████░░░░░░░░░░] 40% (180/300)
```

- **Barra de progresso**: Exibe visualmente a proporção restante
- **Porcentagem**: 40% restante
- **Usado/total**: 180 vezes usadas, 300 vezes totais

::: tip Explicação da barra de progresso

Preenchimento verde/amarelo indica uso, vazio indica restante. Quanto mais preenchido, maior o uso.

:::

#### 3. Detalhes de uso por modelo (apenas API Pública)

```
模型使用明细:
  gpt-4: 120 requests
  claude-3-5-sonnet: 60 requests
```

Exibe a contagem de uso de cada modelo, ordenado por uso em ordem decrescente (exibe até os 5 principais).

::: info Por que minha saída não tem detalhes do modelo?

Os detalhes do modelo são exibidos apenas no modo de API Pública (Fine-grained PAT). Se você usar OAuth Token (API Interna), os detalhes do modelo não serão exibidos.

:::

#### 4. Uso excessivo (se houver)

Se você exceder o limite mensal, será exibido:

```
超额使用: 25 次请求
```

O uso excessivo gerará custos adicionais, consulte a preços do GitHub Copilot para taxas específicas.

#### 5. Tempo de redefinição (apenas API Interna)

```
配额重置: 12d 5h (2026-02-01)
```

Exibe a contagem regressiva até a redefinição da cota.

### Passo 3: Verificar situações comuns

#### Situação 1: Ver "⚠️ 配额查询暂时不可用"

Isso é normal, indicando que o OAuth Token OpenCode não tem permissão para acessar a API de cota.

**Solução**: Configure o PAT seguindo "Método 1: Usar Fine-grained PAT".

#### Situação 2: Barra de progresso totalmente vazia ou quase cheia

- **Totalmente vazia** `░░░░░░░░░░░░░░░`: Cota totalmente usada, exibirá contagem de uso excessivo
- **Quase cheia** `██████████████████`: Quase esgotada, controle o uso com atenção

#### Situação 3: Exibir "Unlimited"

Algumas assinaturas Enterprise podem exibir "Unlimited", indicando ilimitado.

### Passo 4: Lidar com erros (se a consulta falhar)

Se você vir o seguinte erro:

```
GitHub Copilot API 请求失败 (403): Resource not accessible by integration
```

**Causa**: O OAuth Token não tem permissões suficientes para acessar a API Copilot.

**Solução**: Use o método Fine-grained PAT (veja o método 1).

---

## Ponto de verificação ✅

Após concluir as etapas acima, você deve ser capaz de:

- [ ] Ver informações de cota GitHub Copilot na saída `/mystatus`
- [ ] Entender a barra de progresso e porcentagem de Premium Requests
- [ ] Entender seu tipo de assinatura e limite mensal
- [ ] Saber como visualizar detalhes de uso por modelo (se usar Fine-grained PAT)
- [ ] Entender o que significa uso excessivo

## Avisos sobre armadilhas

### Armadilha 1: OAuth Token não consegue consultar cota (mais comum)

::: danger Erro comum

```
⚠️ GitHub Copilot 配额查询暂时不可用。
OpenCode 的新 OAuth 集成不支持访问配额 API。
```

**Causa**: A integração OAuth do OpenCode não concede permissão de acesso à API `/copilot_internal/*`.

**Solução**: Use o método Fine-grained PAT, veja "Método 1: Usar Fine-grained PAT".

:::

### Armadilha 2: Erro de formato do arquivo de configuração

Se o arquivo de configuração `~/.config/opencode/copilot-quota-token.json` estiver com formato incorreto, a consulta falhará.

**Exemplo de erro**:

```json
// ❌ Erro: campo username ausente
{
  "token": "github_pat_11A...",
  "tier": "pro"
}
```

**Exemplo correto**:

```json
// ✅ Correto: contém todos os campos obrigatórios
{
  "token": "github_pat_11A...",
  "username": "your-username",
  "tier": "pro"
}
```

### Armadilha 3: Tipo de assinatura preenchido incorretamente

Se você preencher `tier` diferente da assinatura real, o cálculo do limite estará incorreto.

| Sua assinatura real | Campo tier deve ser | Exemplo de preenchimento incorreto |
|--- | --- | ---|
| Free | `free` | `pro` ❌ |
| Pro | `pro` | `free` ❌ |
| Pro+ | `pro+` | `pro` ❌ |
| Business | `business` | `enterprise` ❌ |
| Enterprise | `enterprise` | `business` ❌ |

**Como ver seu tipo de assinatura real**:
- Visite https://github.com/settings/billing
- Veja a seção "GitHub Copilot"

### Armadilha 4: Permissões de token insuficientes

Se você estiver usando Classic Token (não Fine-grained), sem permissão de leitura "Plan", retornará erro 403.

**Solução**:
1. Certifique-se de usar Fine-grained Token (gerado na página beta)
2. Certifique-se de ter concedido "Account permissions → Plan → Read-only"

### Armadilha 5: Detalhes do modelo não exibidos

::: tip Fenômeno normal

Se você usar o método OAuth Token (API Interna), os detalhes de uso do modelo não serão exibidos.

Isso ocorre porque a API Interna não retorna estatísticas de uso em nível de modelo. Se precisar de detalhes do modelo, use o método Fine-grained PAT.

:::

## Resumo desta lição

Esta lição ensinou como usar o opencode-mystatus para consultar a cota do GitHub Copilot:

**Pontos principais**:

1. **Premium Requests** é o principal indicador de cota do Copilot, incluindo Chat, Completion, Workspace e outras funcionalidades
2. **Tipo de assinatura** determina o limite mensal: Free 50 vezes, Pro 300 vezes, Pro+ 1.500 vezes, Business 300 vezes, Enterprise 1.000 vezes
3. **Uso excessivo** gerará custos adicionais, exibido separadamente na saída
4. **Fine-grained PAT** é o método de autenticação recomendado, não afetado por alterações na integração OAuth OpenCode
5. **OAuth Token** pode falhar devido a limitações de permissão, precisa usar PAT como solução alternativa

**Interpretação de saída**:
- Barra de progresso: exibe visualmente a proporção restante
- Porcentagem: quantidade restante específica
- Usado/total: detalhes de uso
- Detalhes do modelo (opcional): contagem de uso de cada modelo
- Tempo de redefinição (opcional): contagem regressiva até a próxima redefinição

## Próxima lição

> A próxima lição aprenderemos **[Configuração de autenticação Copilot](../../advanced/copilot-auth/)**.
>
> Você aprenderá:
> - Comparação detalhada entre OAuth Token e Fine-grained PAT
> - Como gerar Fine-grained PAT (etapas completas)
> - Várias soluções para resolver problemas de permissão
> - Melhores práticas em diferentes cenários

---

## Apêndice: Referência do código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Data de atualização: 2026-01-23

| Funcionalidade | Caminho do arquivo | Número da linha |
|--- | --- | ---|
| Consulta de cota Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 481-524 |
|--- | --- | ---|
| Consulta de API de cobrança pública | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 157-177 |
| Consulta de API interna | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 242-304 |
| Lógica de troca de token | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 183-208 |
| Formatação de API interna | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 354-393 |
| Formatação de API pública | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 410-468 |
| Definição de tipo de assinatura Copilot | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 57-58 |
| Definição de tipo CopilotQuotaConfig | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 66-73 |
| Definição de tipo CopilotAuthData | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 46-51 |
| Constantes de limite de assinatura Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 397-403 |

**Constantes principais**:

- `COPILOT_PLAN_LIMITS`: Limites mensais para cada tipo de assinatura (linhas 397-403)
  - `free: 50`
  - `pro: 300`
  - `pro+: 1500`
  - `business: 300`
  - `enterprise: 1000`

- `COPILOT_QUOTA_CONFIG_PATH`: Caminho do arquivo de configuração de Fine-grained PAT (linhas 93-98)
  - `~/.config/opencode/copilot-quota-token.json`

**Funções principais**:

- `queryCopilotUsage()`: Função principal de consulta, suporta dois métodos de autenticação (linhas 481-524)
- `fetchPublicBillingUsage()`: Consulta a API de cobrança pública usando Fine-grained PAT (linhas 157-177)
- `fetchCopilotUsage()`: Consulta a API interna usando OAuth Token (linhas 242-304)
- `exchangeForCopilotToken()`: Lógica de troca de OAuth Token (linhas 183-208)
- `formatPublicBillingUsage()`: Formatação de resposta da API pública, inclui detalhes do modelo (linhas 410-468)
- `formatCopilotUsage()`: Formatação de resposta da API interna (linhas 354-393)

**Estratégias de autenticação**:

1. **Estratégia 1 (prioridade)**: Usar Fine-grained PAT + API de cobrança pública
   - Vantagem: estável, não afetado por alterações na integração OAuth OpenCode
   - Desvantagem: requer que o usuário configure o PAT manualmente

2. **Estratégia 2 (fallback)**: Usar OAuth Token + API interna
   - Vantagem: sem necessidade de configuração adicional
   - Desvantagem: pode falhar devido a limitações de permissão (integração OpenCode atual não suporta)

**Endpoints da API**:

- API de cobrança pública: `https://api.github.com/users/{username}/settings/billing/premium_request/usage`
- API de cota interna: `https://api.github.com/copilot_internal/user`
- API de troca de token: `https://api.github.com/copilot_internal/v2/token`

</details>
