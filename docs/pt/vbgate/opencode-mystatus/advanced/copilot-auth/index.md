---
title: "Copilot认证: OAuth与PAT | opencode-mystatus"
sidebarTitle: "Copilot认证"
subtitle: "Copilot认证: OAuth Token和Fine-grained PAT"
description: "学习配置GitHub Copilot的两种认证方法：OAuth Token和Fine-grained PAT。教程将解决OAuth Token权限不足问题，指导创建PAT并配置订阅类型，成功验证Copilot配额。"
tags:
  - "GitHub Copilot"
  - "Autenticação OAuth"
  - "Configuração de PAT"
  - "Problemas de Permissão"
prerequisite:
  - "start-quick-start"
  - "platforms-copilot-usage"
order: 2
---

# Configuração de Autenticação do Copilot: OAuth Token e Fine-grained PAT

## O Que Você Será Capaz de Fazer Após Este Tutorial

- Entender os dois métodos de autenticação do Copilot: OAuth Token e Fine-grained PAT
- Resolver problemas de permissão insuficiente do OAuth Token
- Criar Fine-grained PAT e configurar o tipo de assinatura
- Verificar com sucesso a cota de Premium Requests do Copilot

## Seu Problema Atual

Ao executar `/mystatus` para verificar a cota do Copilot, você pode ver a seguinte mensagem de erro:

```
⚠️ A verificação de cota do GitHub Copilot está temporariamente indisponível.
A nova integração OAuth do OpenCode não oferece suporte para acesso à API de cota.

Solução:
1. Crie um fine-grained PAT (visite https://github.com/settings/tokens?type=beta)
2. Em 'Account permissions', defina 'Plan' como 'Read-only'
3. Crie o arquivo de configuração ~/.config/opencode/copilot-quota-token.json:
   {"token": "github_pat_xxx...", "username": "seu-nome-de-usuário"}
```

Você não sabe:
- O que é OAuth Token? O que é Fine-grained PAT?
- Por que a integração OAuth não oferece suporte para acesso à API de cota?
- Como criar Fine-grained PAT?
- Como escolher o tipo de assinatura (free, pro, pro+ etc.)?

Essas questões estão impedindo você de verificar a cota do Copilot.

## Quando Usar Este Método

Quando você:
- Vê a mensagem "A nova integração OAuth do OpenCode não oferece suporte para acesso à API de cota"
- Deseja usar o método mais estável de Fine-grained PAT para verificar cota
- Precisa configurar verificação de cota do Copilot para contas de equipe ou corporativas

## Ideia Central

O mystatus oferece suporte a **dois métodos de autenticação do Copilot**:

| Método de Autenticação | Descrição | Vantagens | Desvantagens |
|----------------------|-----------|------------|-------------|
| **OAuth Token** (padrão) | Usa o GitHub OAuth Token obtido ao fazer login no OpenCode | Não requer configuração adicional, pronto para usar | O novo OAuth Token do OpenCode pode não ter permissões do Copilot |
| **Fine-grained PAT** (recomendado) | Fine-grained Personal Access Token criado manualmente pelo usuário | Estável e confiável, não depende de permissões OAuth | Requer criação manual uma vez |

**Regras de Prioridade**:
1. O mystatus prioriza o uso de Fine-grained PAT (se configurado)
2. Se nenhum PAT estiver configurado, ele volta ao OAuth Token

::: tip Recomendação
Se o seu OAuth Token tiver problemas de permissão, criar um Fine-grained PAT é a solução mais estável.
:::

### Diferença Entre os Dois Métodos

**OAuth Token**:
- Local de armazenamento: `~/.local/share/opencode/auth.json`
- Método de obtenção: Obtido automaticamente ao fazer login no GitHub no OpenCode
- Problemas de permissão: A nova versão do OpenCode usa um cliente OAuth diferente que pode não conceder permissões relacionadas ao Copilot

**Fine-grained PAT**:
- Local de armazenamento: `~/.config/opencode/copilot-quota-token.json`
- Método de obtenção: Criado manualmente nas Configurações do Desenvolvedor do GitHub
- Requisitos de permissão: Precisa marcar a permissão de leitura "Plan" (informações de assinatura)

## Siga Passo a Passo

### Passo 1: Verificar se o Fine-grained PAT Já Está Configurado

Execute o seguinte comando no terminal para verificar se o arquivo de configuração existe:

::: code-group

```bash [macOS/Linux]
ls -la ~/.config/opencode/copilot-quota-token.json
```

```powershell [Windows]
Test-Path "$env:APPDATA\opencode\copilot-quota-token.json"
```

:::

**O que você deve ver**:
- Se o arquivo existir, significa que o Fine-grained PAT já está configurado
- Se o arquivo não existir ou houver uma mensagem de erro, você precisará criar um

### Passo 2: Criar Fine-grained PAT (se não estiver configurado)

Se a verificação no passo anterior mostrar que o arquivo não existe, siga estes passos para criar:

#### 2.1 Acessar a Página de Criação de PAT do GitHub

No navegador, acesse:
```
https://github.com/settings/tokens?type=beta
```

Esta é a página de criação de Fine-grained PAT do GitHub.

#### 2.2 Criar Novo Fine-grained PAT

Clique em **Generate new token (classic)** ou **Generate new token (beta)**; é recomendado usar Fine-grained (beta).

**Configuração dos Parâmetros**:

| Campo | Valor |
|-------|-------|
| **Name** | `mystatus-copilot` (ou qualquer nome de sua preferência) |
| **Expiration** | Escolha o tempo de expiração (ex: 90 dias ou No expiration) |
| **Resource owner** | Não é necessário selecionar (padrão) |

**Configuração de Permissões** (importante!):

Na seção **Account permissions**, marque:
- ✅ **Plan** → Selecione **Read** (esta permissão é necessária para verificar a cota)

::: warning Aviso Importante
Marque apenas a permissão de leitura "Plan". Não marque outras permissões desnecessárias para proteger a segurança da conta.
:::

**O que você deve ver**:
- "Plan: Read" marcado
- Nenhuma outra permissão marcada (princípio de menor privilégio)

#### 2.3 Gerar e Salvar o Token

Clique no botão **Generate token** na parte inferior da página.

**O que você deve ver**:
- A página exibirá o Token recém-gerado (semelhante a `github_pat_xxxxxxxxxxxx`)
- ⚠️ **Copie este Token imediatamente**; após atualizar a página, você não poderá mais vê-lo

### Passo 3: Obter o Nome de Usuário do GitHub

No navegador, acesse sua página inicial do GitHub:
```
https://github.com/
```

**O que você deve ver**:
- Seu nome de usuário é exibido no canto superior direito ou esquerdo (ex: `john-doe`)

Anote este nome de usuário; você precisará dele durante a configuração.

### Passo 4: Determinar o Tipo de Assinatura do Copilot

Você precisa saber o tipo de assinatura do seu Copilot, pois diferentes tipos têm diferentes limites mensais:

| Tipo de Assinatura | Cota Mensal | Cenário Aplicável |
|-------------------|-------------|-------------------|
| `free` | 50 | Copilot Free (usuários gratuitos) |
| `pro` | 300 | Copilot Pro (versão profissional individual) |
| `pro+` | 1500 | Copilot Pro+ (versão individual aprimorada) |
| `business` | 300 | Copilot Business (versão comercial de equipe) |
| `enterprise` | 1000 | Copilot Enterprise (versão empresarial) |

::: tip Como Determinar o Tipo de Assinatura?
1. Acesse a [Página de Assinatura do GitHub Copilot](https://github.com/settings/copilot)
2. Veja o plano de assinatura exibido atualmente
3. Selecione o tipo correspondente na tabela acima
:::

### Passo 5: Criar Arquivo de Configuração

Com base no seu sistema operacional, crie o arquivo de configuração e preencha as informações.

::: code-group

```bash [macOS/Linux]
mkdir -p ~/.config/opencode
cat > ~/.config/opencode/copilot-quota-token.json << 'EOF'
{
  "token": "seu_PAT_Token",
  "username": "seu_nome_de_usuario_GitHub",
  "tier": "tipo_de_assinatura"
}
EOF
```

```powershell [Windows]
# Criar diretório (se não existir)
New-Item -ItemType Directory -Force -Path "$env:APPDATA\opencode" | Out-Null

# Criar arquivo de configuração
@"
{
  "token": "seu_PAT_Token",
  "username": "seu_nome_de_usuario_GitHub",
  "tier": "tipo_de_assinatura"
}
"@ | Out-File -FilePath "$env:APPDATA\opencode\copilot-quota-token.json" -Encoding utf8
```

:::

**Exemplo de Configuração**:

Supondo que seu PAT seja `github_pat_abc123`, seu nome de usuário seja `johndoe` e o tipo de assinatura seja `pro`:

```json
{
  "token": "github_pat_abc123",
  "username": "johndoe",
  "tier": "pro"
}
```

::: danger Aviso de Segurança
- Não submeta o Token para um repositório Git ou compartilhe com outras pessoas
- O Token é uma credencial para acessar sua conta GitHub; vazamentos podem causar problemas de segurança
:::

### Passo 6: Verificar a Configuração

Execute o comando `/mystatus` no OpenCode.

**O que você deve ver**:
- A seção do Copilot exibe normalmente as informações de cota
- Mensagens de erro de permissão não aparecem mais
- Conteúdo semelhante a este é exibido:

```
## Cota da Conta do GitHub Copilot

Conta:         GitHub Copilot (@johndoe)

Solicitações Premium
████████████████████░░░░░░░ 70% (90/300)

Período: 2026-01
```

## Pontos de Verificação ✅

Verifique se você entendeu:

| Cenário | O Que Você Deve Ver/Fazer |
|---------|-------------------------|
| Arquivo de configuração existe | `ls ~/.config/opencode/copilot-quota-token.json` exibe o arquivo |
| PAT criado com sucesso | O Token começa com `github_pat_` |
| Tipo de assinatura correto | O valor de `tier` na configuração é um de free/pro/pro+/business/enterprise |
| Verificação bem-sucedida | Após executar `/mystatus`, você vê as informações de cota do Copilot |

## Cuidados Importantes

### ❌ Erro Comum: Esquecer de Marcar a Permissão "Plan: Read"

**Sintoma**: Ao executar `/mystatus`, você vê um erro de API (403 ou 401)

**Causa**: Ao criar o PAT, você não marcou a permissão necessária.

**Solução Correta**:
1. Exclua o Token antigo (nas Configurações do GitHub)
2. Recrie, garantindo que **Plan: Read** esteja marcado
3. Atualize o campo `token` no arquivo de configuração

### ❌ Erro Comum: Tipo de Assinatura Incorreto

**Sintoma**: A cota exibida está incorreta (ex: usuário Free mostra cota de 300)

**Causa**: O campo `tier` foi preenchido incorretamente (ex: preencheu `pro` mas é `free` na realidade)

**Solução Correta**:
1. Acesse a página de configurações do GitHub Copilot para confirmar o tipo de assinatura
2. Modifique o campo `tier` no arquivo de configuração

### ❌ Erro Comum: Token Expirado

**Sintoma**: Ao executar `/mystatus`, você vê um erro 401

**Causa**: O Fine-grained PAT tem um tempo de expiração definido e já expirou.

**Solução Correta**:
1. Acesse GitHub Settings → Tokens
2. Encontre o Token expirado e exclua-o
3. Crie um novo Token e atualize o arquivo de configuração

### ❌ Erro Comum: Erro de Maiúsculas/Minúsculas no Nome de Usuário

**Sintoma**: Você vê um erro 404 ou usuário inexistente

**Causa**: Nomes de usuário do GitHub diferenciam maiúsculas e minúsculas (ex: `Johndoe` e `johndoe` são usuários diferentes).

**Solução Correta**:
1. Copie o nome de usuário exibido na página inicial do GitHub (idêntico)
2. Não digite manualmente para evitar erros de maiúsculas/minúsculas

::: tip Dica
Se encontrar um erro 404, copie o nome de usuário diretamente da URL do GitHub, por exemplo, ao acessar `https://github.com/SeuNome`, o `SeuNome` na URL é seu nome de usuário.
:::

## Resumo da Lição

O mystatus oferece suporte a dois métodos de autenticação do Copilot:

1. **OAuth Token** (padrão): Obtido automaticamente, mas pode ter problemas de permissão
2. **Fine-grained PAT** (recomendado): Configurado manualmente, estável e confiável

Etapas recomendadas para configurar Fine-grained PAT:
1. Crie Fine-grained PAT nas Configurações do GitHub
2. Marque a permissão "Plan: Read"
3. Anote o nome de usuário do GitHub e o tipo de assinatura
4. Crie o arquivo de configuração `~/.config/opencode/copilot-quota-token.json`
5. Verifique se a configuração foi bem-sucedida

Após a configuração, o mystatus priorizará o uso do PAT para verificar a cota do Copilot, evitando problemas de permissão do OAuth.

## Próxima Lição

> Na próxima lição, aprenderemos **[Suporte Multi-idioma: Alternância Automática Entre Chinês e Inglês](../i18n-setup/)**.
>
> Você aprenderá:
> - Mecanismo de detecção de idioma (API Intl, variáveis de ambiente)
> - Como alternar manualmente o idioma
> - Tabela comparativa chinês-inglês

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código fonte</strong></summary>

> Última atualização: 2026-01-23

| Funcionalidade                        | Caminho do Arquivo                                                                                   | Linha    |
| --------------------------- | ------------------------------------------------------------------------------------------ | ------- |
| Estratégia de autenticação Copilot        | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L481-L524) | 481-524 |
| Leitura de configuração Fine-grained PAT  | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L122-L151) | 122-151 |
| Chamada de API pública de Billing       | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L157-L177) | 157-177 |
| Troca de OAuth Token           | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L183-L208) | 183-208 |
| Chamada de API interna (OAuth)     | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L242-L304) | 242-304 |
| Formatação de saída de API pública de Billing | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L410-L468) | 410-468 |
| Definição de tipo CopilotAuthData    | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L46-L51)    | 46-51   |
| Definição de tipo CopilotQuotaConfig | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L66-L73)    | 66-73   |
| Definição de enumeração CopilotTier       | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L57)        | 57      |
| Cota de tipo de assinatura Copilot       | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L397-L403) | 397-403 |

**Constantes Chave**:
- `COPILOT_QUOTA_CONFIG_PATH = "~/.config/opencode/copilot-quota-token.json"`: Caminho do arquivo de configuração Fine-grained PAT
- `COPILOT_PLAN_LIMITS`: Limites mensais de cota para cada tipo de assinatura (linhas 397-403)

**Funções Chave**:
- `queryCopilotUsage(authData)`: Função principal de consulta de cota do Copilot, contém duas estratégias de autenticação
- `readQuotaConfig()`: Lê o arquivo de configuração Fine-grained PAT
- `fetchPublicBillingUsage(config)`: Chama a API pública de Billing do GitHub (usa PAT)
- `fetchCopilotUsage(authData)`: Chama a API interna do GitHub (usa OAuth Token)
- `exchangeForCopilotToken(oauthToken)`: Troca OAuth Token por Copilot Session Token
- `formatPublicBillingUsage(data, tier)`: Formata a resposta da API pública de Billing
- `formatCopilotUsage(data)`: Formata a resposta da API interna

**Comparação de Fluxos de Autenticação**:

| Estratégia | Tipo de Token | Endpoint da API | Prioridade |
|------|-----------|---------|--------|
| Fine-grained PAT | Fine-grained PAT | `/users/{username}/settings/billing/premium_request/usage` | 1 (prioridade) |
| OAuth Token (cache) | Copilot Session Token | `/copilot_internal/user` | 2 |
| OAuth Token (direto) | GitHub OAuth Token | `/copilot_internal/user` | 3 |
| OAuth Token (troca) | Copilot Session Token (após troca) | `/copilot_internal/v2/token` | 4 |

</details>
