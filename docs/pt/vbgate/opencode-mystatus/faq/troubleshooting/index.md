---
title: "Solução de problemas: Erros comuns | opencode-mystatus"
sidebarTitle: "FAQ"
subtitle: "Perguntas frequentes: impossível consultar cota, token expirado, problemas de permissão"
description: "Aprenda a resolver problemas comuns do opencode-mystatus: token expirado, permissões insuficientes e falha de API. Soluções para OpenAI, Copilot e Google Cloud."
tags:
  - "solução de problemas"
  - "perguntas frequentes"
  - "token expirado"
  - "problemas de permissão"
prerequisite:
  - "start-quick-start"
order: 1
---

# Perguntas frequentes: impossível consultar cota, token expirado, problemas de permissão

Ao usar o plugin opencode-mystatus, você pode encontrar vários erros: impossível de ler arquivos de autenticação, OAuth Token expirado, permissões insuficientes do GitHub Copilot, falha de solicitação de API, etc. Esses problemas comuns geralmente podem ser resolvidos por meio de configuração simples ou reautorização. Este tutorial organiza as etapas de solução de problemas para todos os erros comuns, ajudando você a localizar rapidamente a causa raiz.

## O que você poderá fazer após concluir

- Localizar rapidamente a causa da falha da consulta mystatus
- Resolver o problema de token expirado OpenAI
- Configurar o Fine-grained PAT do GitHub Copilot
- Lidar com situações em que o Google Cloud não tem project_id
- Lidar com várias falhas de solicitação de API e tempos limite

## O seu problema atual

Você executa `/mystatus` para consultar a cota, mas vê várias mensagens de erro e não sabe por onde começar a solução de problemas.

## Quando usar este método

- **Ao ver qualquer mensagem de erro**: Este tutorial cobre todos os erros comuns
- **Ao configurar uma nova conta**: Verifique se a configuração está correta
- **Quando a consulta de cota falhar repentinamente**: Pode ser expiração de token ou alterações de permissão

::: tip Princípio de solução de problemas

Ao encontrar um erro, primeiro observe as palavras-chave da mensagem de erro e, em seguida, corresponda à solução neste tutorial. A maioria dos erros tem mensagens de prompt claras.

:::

## Ideia principal

O mecanismo de tratamento de erros do mystatus é dividido em três camadas:

1. **Camada de leitura de arquivo de autenticação**: Verifica se `auth.json` existe e se o formato está correto
2. **Camada de consulta de plataforma**: Cada plataforma consulta independentemente, falha não afeta outras plataformas
3. **Camada de solicitação de API**: Solicitações de rede podem expirar ou retornar erros, mas a ferramenta continuará tentando outras plataformas

Isso significa que:
- Se uma plataforma falhar, outras plataformas ainda serão exibidas normalmente
- Mensagens de erro indicarão claramente qual plataforma tem problema
- A maioria dos erros pode ser resolvida por meio de configuração ou reautorização

## Lista de verificação de solução de problemas

### Problema 1: Impossível ler arquivo de autenticação

**Mensagem de erro**:

```
❌ 无法读取认证文件: ~/.local/share/opencode/auth.json
错误: ENOENT: no such file or directory
```

**Causa**:
- O arquivo de autenticação do OpenCode não existe
- Nenhuma conta de plataforma foi configurada ainda

**Solução**:

1. **Confirme se o OpenCode está instalado e configurado**
   - Confirme se você configurou pelo menos uma plataforma (OpenAI, Zhipu AI, etc.) no OpenCode
   - Se não, primeiro complete a autorização no OpenCode

2. **Verifique o caminho do arquivo**
   - O arquivo de autenticação do OpenCode deve estar em `~/.local/share/opencode/auth.json`
   - Se você estiver usando um diretório de configuração personalizado, verifique se o caminho do arquivo está correto

3. **Verifique o formato do arquivo**
   - Confirme que `auth.json` é um arquivo JSON válido
   - O conteúdo do arquivo deve conter pelo menos informações de autenticação de uma plataforma

**O que você deve ver**:
Após executar `/mystatus` novamente, você deve ser capaz de ver informações de cota de pelo menos uma plataforma.

---

### Problema 2: Nenhuma conta configurada encontrada

**Mensagem de erro**:

```
未找到任何已配置的账号。

支持的账号类型:
- OpenAI (Plus/Team/Pro 订阅用户)
- 智谱 AI (Coding Plan)
- Z.ai (Coding Plan)
- Google Cloud (Antigravity)
```

**Causa**:
- `auth.json` existe, mas não há nenhuma configuração válida dentro
- As configurações existentes estão com formato incorreto (como falta de campos obrigatórios)

**Solução**:

1. **Verifique o conteúdo de auth.json**
   Abra `~/.local/share/opencode/auth.json` e confirme que há pelo menos uma configuração de plataforma:

   ```json
   {
     "openai": {
       "type": "oauth",
       "access": "eyJ...",
       "expires": 1738000000000
     }
   }
   ```

2. **Configure pelo menos uma plataforma**
   - Complete a autorização OAuth no OpenCode
   - Ou adicione manualmente a API Key da plataforma (Zhipu AI, Z.ai)

3. **Consulte o formato de configuração**
   Requisitos de configuração de cada plataforma:
   - OpenAI: Deve ter `type: "oauth"` e `access` token
   - Zhipu AI / Z.ai: Deve ter `type: "api"` e `key`
   - GitHub Copilot: Deve ter `type: "oauth"` e `refresh` token
   - Google Cloud: Não depende de `auth.json`, requer configuração separada (veja o problema 6)

---

### Problema 3: Token OAuth OpenAI expirado

**Mensagem de erro**:

```
⚠️ OAuth 授权已过期，请在 OpenCode 中使用一次 OpenAI 模型以刷新授权。
```

**Causa**:
- O OAuth Token OpenAI tem validade limitada, após expirar não é possível consultar a cota
- O tempo de expiração do token é armazenado no campo `expires` do `auth.json`

**Solução**:

1. **Use o modelo OpenAI uma vez no OpenCode**
   - Faça uma pergunta ao ChatGPT ou Codex
   - O OpenCode atualizará automaticamente o token e atualizará `auth.json`

2. **Confirme se o token foi atualizado**
   - Verifique o campo `expires` em `auth.json`
   - Confirme que é um carimbo de data/hora futuro

3. **Execute /mystatus novamente**
   - Agora você deve ser capaz de consultar a cota OpenAI normalmente

**Por que precisa usar o modelo novamente**:
O OAuth Token OpenAI tem um mecanismo de expiração, usar o modelo acionará a atualização do token. Esta é uma característica de segurança do fluxo de autenticação OAuth oficial do OpenCode.

---

### Problema 4: Falha de solicitação de API (geral)

**Mensagem de erro**:

```
OpenAI API 请求失败 (401): Unauthorized
智谱 API 请求失败 (403): Forbidden
Google API 请求失败 (500): Internal Server Error
```

**Causa**:
- Token ou API Key inválidos
- Problema de conexão de rede
- Serviço de API temporariamente indisponível
- Permissões insuficientes (algumas plataformas exigem permissões específicas)

**Solução**:

1. **Verifique o Token ou API Key**
   - OpenAI: Confirme se o `access` token não expirou (veja o problema 3)
   - Zhipu AI / Z.ai: Confirme se a `key` está correta, sem espaços extras
   - GitHub Copilot: Confirme se o `refresh` token é válido

2. **Verifique a conexão de rede**
   - Confirme se a rede está normal
   - Algumas plataformas podem ter restrições geográficas (como Google Cloud)

3. **Tente reautorizar**
   - Reautorize OAuth no OpenCode
   - Ou atualize manualmente a API Key

4. **Verifique o código de status HTTP específico**
   - `401` / `403`: Problema de permissão, geralmente Token ou API Key inválido
   - `500` / `503`: Erro do lado do servidor, geralmente a API está temporariamente indisponível, tente novamente mais tarde
   - `429`: Solicitações muito frequentes, precisa esperar por um período

---

### Problema 5: Solicitação expirou

**Mensagem de erro**:

```
请求超时 (10秒)
```

**Causa**:
- Conexão de rede lenta
- Tempo de resposta da API muito longo
- Firewall ou proxy bloqueando a solicitação

**Solução**:

1. **Verifique a conexão de rede**
   - Confirme se a rede está estável
   - Tente acessar o site da plataforma para confirmar se consegue acessar normalmente

2. **Verifique as configurações de proxy**
   - Se você estiver usando proxy, confirme se a configuração do proxy está correta
   - Algumas plataformas podem exigir configurações de proxy especiais

3. **Tente novamente**
   - Às vezes é apenas flutuação temporária da rede
   - Tentar novamente geralmente resolve o problema

---

### Problema 6: Consulta de cota GitHub Copilot indisponível

**Mensagem de erro**:

```
⚠️ GitHub Copilot 配额查询暂时不可用。
OpenCode 的新 OAuth 集成不支持访问配额 API。

解决方案:
1. 创建一个 fine-grained PAT (访问 https://github.com/settings/tokens?type=beta)
2. 在 'Account permissions' 中将 'Plan' 设为 'Read-only'
3. 创建配置文件并填写以下内容（包含必需的 `tier` 字段）：
   ```json
   {
     "token": "github_pat_xxx...",
     "username": "你的用户名",
     "tier": "pro"
   }
   ```

其他方法:
• 在 VS Code 中点击状态栏的 Copilot 图标查看配额
• 访问 https://github.com/settings/billing 查看使用情况
```

**Causa**:
- A integração OAuth oficial do OpenCode usa o novo fluxo de autenticação
- O novo OAuth Token não tem permissão `copilot`, não consegue chamar a API de cota interna
- Esta é uma limitação de segurança oficial do OpenCode

**Solução** (recomendada):

1. **Crie um Fine-grained PAT**
   - Visite https://github.com/settings/tokens?type=beta
   - Clique em "Generate new token" → "Fine-grained token"
   - Preencha o nome do token (como "OpenCode Copilot Quota")

2. **Configurar permissões**
   - Em "Account permissions", encontre a permissão "Plan"
   - Defina como "Read-only"
   - Clique em "Generate token"

3. **Criar arquivo de configuração**
   Crie `~/.config/opencode/copilot-quota-token.json`:

   ```json
   {
     "token": "github_pat_xxx...",
     "username": "你的 GitHub 用户名",
     "tier": "pro"
   }
   ```

   **Explicação do campo tier**:
   - `free`: Copilot Free (50 vezes/mês)
   - `pro`: Copilot Pro (300 vezes/mês)
   - `pro+`: Copilot Pro+ (1500 vezes/mês)
   - `business`: Copilot Business (300 vezes/mês)
   - `enterprise`: Copilot Enterprise (1000 vezes/mês)

4. **Execute /mystatus novamente**
   - Agora você deve ser capaz de consultar a cota GitHub Copilot normalmente

**Solução alternativa**:

Se não quiser configurar o PAT, você pode:
- Clique no ícone Copilot na barra de status do VS Code para ver a cota
- Visite https://github.com/settings/billing para ver o uso

---

### Problema 7: Google Cloud não tem project_id

**Mensagem de erro**:

```
⚠️ 缺少 project_id，无法查询额度。
```

**Causa**:
- A configuração da conta Google Cloud está faltando `projectId` ou `managedProjectId`
- O mystatus precisa do ID do projeto para chamar a API Google Cloud

**Solução**:

1. **Verifique antigravity-accounts.json**
   Abra o arquivo de configuração, confirme se a configuração da conta contém `projectId` ou `managedProjectId`:

   ::: code-group

   ```bash [macOS/Linux]
   ~/.config/opencode/antigravity-accounts.json
   ```

   ```powershell [Windows]
   %APPDATA%\opencode\antigravity-accounts.json
   ```

   :::

   ```json
   {
     "accounts": [
       {
         "email": "your-email@gmail.com",
         "refreshToken": "1//xxx",
         "projectId": "your-project-id",
         "addedAt": 1738000000000,
         "lastUsed": 1738000000000,
         "rateLimitResetTimes": {}
       }
     ]
   }
   ```

2. **Como obter o project_id**
   - Visite https://console.cloud.google.com/
   - Selecione seu projeto
   - Encontre "Project ID" nas informações do projeto
   - Copie-o para o arquivo de configuração

3. **Se não tiver project_id**
   - Se você estiver usando um projeto gerenciado, pode precisar usar `managedProjectId`
   - Entre em contato com seu administrador Google Cloud para confirmar o ID do projeto

---

### Problema 8: API Zhipu AI / Z.ai retorna dados inválidos

**Mensagem de erro**:

```
智谱 API 请求失败 (200): {"code": 401, "msg": "Invalid API key"}
Z.ai API 请求失败 (200): {"code": 400, "msg": "Bad request"}
```

**Causa**:
- API Key inválido ou formato incorreto
- API Key expirou ou foi revogado
- A conta não tem permissão para o serviço correspondente

**Solução**:

1. **Confirme se a API Key está correta**
   - Faça login no console Zhipu AI ou Z.ai
   - Verifique se sua API Key é válida
   - Confirme que não há espaços ou quebras de linha extras

2. **Verifique as permissões da API Key**
   - Zhipu AI: Confirme se você tem permissão "Coding Plan"
   - Z.ai: Confirme se você tem permissão "Coding Plan"

3. **Regere a API Key**
   - Se a API Key tiver problemas, você pode regerá-la no console
   - Atualize o campo `key` em `auth.json`

---

## Ponto de verificação ✅

Confirme se você consegue resolver problemas comuns de forma independente:

| Habilidade | Método de verificação | Resultado esperado |
| ---------- | ------------------- | ------------------ |
| Solucionar problemas de arquivo de autenticação | Verifique se auth.json existe e se o formato está correto | O arquivo existe, formato JSON correto |
| Atualizar token OpenAI | Use o modelo OpenAI uma vez no OpenCode | Token atualizado, pode consultar cota normalmente |
| Configurar PAT Copilot | Crie copilot-quota-token.json | Pode consultar cota Copilot normalmente |
| Lidar com erros de API | Veja o código de status HTTP e tome medidas correspondentes | Sabe o significado de códigos de erro como 401/403/500 |
| Configurar project_id do Google | Adicione projectId ao antigravity-accounts.json | Pode consultar cota Google Cloud normalmente |

## Resumo desta seção

O tratamento de erros do mystatus é dividido em três camadas: leitura de arquivo de autenticação, consulta de plataforma, solicitação de API. Ao encontrar um erro, primeiro observe as palavras-chave da mensagem de erro e, em seguida, corresponda à solução. Os problemas mais comuns incluem:

1. **Problemas de arquivo de autenticação**: Verifique se `auth.json` existe e se o formato está correto
2. **Token expirado**: Use o modelo correspondente uma vez no OpenCode para atualizar o token
3. **Erro de API**: Julgue se é um problema de permissão ou do servidor com base no código de status HTTP
4. **Permissões especiais do Copilot**: A nova integração OAuth requer configuração de Fine-grained PAT
5. **Configuração Google**: Precisa de project_id para consultar a cota

A maioria dos erros pode ser resolvida por configuração ou reautorização, a falha de uma plataforma não afeta a consulta de outras plataformas.

## Próxima seção

> A próxima seção aprenderemos **[Segurança e privacidade: acesso a arquivos locais, mascaramento de API, interfaces oficiais](/pt/vbgate/opencode-mystatus/faq/security/)**.
>
> Você aprenderá:
> - Como o mystatus protege seus dados sensíveis
> - Princípio de mascaramento automático de API Key
> - Por que o plugin é uma ferramenta local segura
> - Garantia de não armazenamento e não upload de dados

---

## Apêndice: Referência do código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Data de atualização: 2026-01-23

| Funcionalidade | Caminho do arquivo | Número da linha |
| -------------- | ----------------- | --------------- |
| Lógica principal de tratamento de erros | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 41-87 |
| Leitura de arquivo de autenticação | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 38-46 |
| Prompt de nenhuma conta encontrada | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 78-80 |
| Coleta e resumo de resultados | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 58-89 |
| Verificação de expiração de token OpenAI | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts) | 216-221 |
| Tratamento de erro de API | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts) | 149-152 |
| Leitura de PAT Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 122-151 |
| Prompt de falha de OAuth Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 298-303 |
| Verificação de project_id do Google | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 232-234 |
| Tratamento de erro de API Zhipu | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 94-103 |
| Definição de mensagens de erro | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts) | 66-123 (chinês), 144-201 (inglês) |

**Constantes principais**:

- `HIGH_USAGE_THRESHOLD = 80`: Limiar de aviso de alto uso (`plugin/lib/types.ts:111`)

**Funções principais**:

- `collectResult()`: Coleta resultados de consulta em arrays de resultados e erros (`plugin/mystatus.ts:100-116`)
- `queryOpenAIUsage()`: Consulta cota OpenAI, inclui verificação de expiração de token (`plugin/lib/openai.ts:207-236`)
- `readQuotaConfig()`: Lê configuração de PAT Copilot (`plugin/lib/copilot.ts:122-151`)
- `fetchAccountQuota()`: Consulta cota de uma única conta Google Cloud (`plugin/lib/google.ts:218-256`)
- `fetchUsage()`: Consulta uso Zhipu/Z.ai (`plugin/lib/zhipu.ts:81-106`)

</details>
