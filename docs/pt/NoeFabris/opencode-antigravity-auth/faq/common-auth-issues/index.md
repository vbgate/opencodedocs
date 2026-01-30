---
title: "Solução de Problemas de Autenticação OAuth: Perguntas Frequentes | Antigravity Auth"
sidebarTitle: "Falha na Autenticação OAuth"
subtitle: "Solução de Problemas de Autenticação OAuth: Perguntas Frequentes"
description: "Aprenda a solucionar problemas de autenticação OAuth do plugin Antigravity Auth. Inclui soluções para falha de callback no Safari, erros 403, limites de taxa, configuração WSL2/Docker e outros problemas comuns."
tags:
  - FAQ
  - Solução de Problemas
  - OAuth
  - Autenticação
prerequisite:
  - start-first-auth-login
  - start-quick-install
order: 1
---

# Solução de Problemas de Autenticação Comuns

Depois de concluir esta lição, você poderá resolver problemas comuns de falha de autenticação OAuth, erros de atualização de token e negação de permissão, restaurando rapidamente o funcionamento normal do plugin.

## O Desafio que Você Enfrenta Agora

Você acabou de instalar o plugin Antigravity Auth, pronto para usar modelos Claude ou Gemini 3, e então:

- Após executar `opencode auth login`, o navegador autoriza com sucesso, mas o terminal exibe "Falha de Autorização"
- Após um período de uso, ocorre erro "Permission Denied" ou "invalid_grant"
- Todas as contas exibem "Limite de Taxa", mesmo quando a cota ainda é suficiente
- Não é possível completar a autenticação OAuth em ambientes WSL2 ou Docker
- O callback OAuth no navegador Safari sempre falha

Esses problemas são muito comuns. Na maioria dos casos, você não precisa reinstalar ou entrar em contato com o suporte — basta seguir este guia passo a passo para resolvê-los.

## Quando Usar Esta Técnica

Consulte este tutorial quando encontrar as seguintes situações:

- **Falha de Autenticação OAuth**: `opencode auth login` não pode ser concluído
- **Token Inválido**: Erros invalid_grant, Permission Denied
- **Limite de Taxa**: Erro 429, "Todas as contas limitadas"
- **Problemas de Ambiente**: WSL2, Docker, ambientes de desenvolvimento remoto
- **Conflitos de Plugin**: Incompatibilidade com oh-my-opencode ou outros plugins

::: tip Redefinição Rápida
Quando problemas de autenticação ocorrem, **90% dos casos** podem ser resolvidos excluindo o arquivo de conta e reautenticando:

```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```

:::

---

## Fluxo de Diagnóstico Rápido

Quando problemas ocorrem, localize rapidamente a causa seguindo esta ordem:

1. **Verificar Caminho de Configuração** → Confirmar localização correta dos arquivos
2. **Excluir Arquivo de Conta e Reautenticar** → Resolve a maioria dos problemas de autenticação
3. **Verificar Informações de Erro** → Encontrar soluções com base no tipo de erro específico
4. **Verificar Ambiente de Rede** → WSL2/Docker requer configuração adicional

---

## Conceitos Fundamentais: Autenticação OAuth e Gerenciamento de Tokens

Antes de resolver problemas, entenda alguns conceitos-chave.

::: info O que é Autenticação OAuth 2.0 PKCE?

O Antigravity Auth usa o mecanismo de autenticação **OAuth 2.0 com PKCE** (Proof Key for Code Exchange):

1. **Código de Autorização**: Após você autorizar, o Google retorna um código de autorização temporário
2. **Troca de Token**: O plugin troca o código de autorização por um `access_token` (para chamadas API) e um `refresh_token` (para atualização)
3. **Atualização Automática**: 30 minutos antes do `access_token` expirar, o plugin atualiza automaticamente usando o `refresh_token`
4. **Armazenamento de Token**: Todos os tokens são armazenados localmente em `~/.config/opencode/antigravity-accounts.json`, não sendo enviados para nenhum servidor

**Segurança**: O mecanismo PKCE evita que o código de autorização seja interceptado, e mesmo que os tokens sejam vazados, o invasor não pode reautorizar.

:::

::: info O que é Limite de Taxa (Rate Limit)?

O Google tem limites de frequência para chamadas API de cada conta Google. Quando os limites são atingidos:

- **429 Too Many Requests**: Requisições muito frequentes, necessita aguardar
- **403 Permission Denied**: Possivelmente soft-banned ou gatilho de detecção de abuso
- **Requisições Pendentes**: 200 OK mas sem resposta, geralmente indica limitação silenciosa

**Vantagens de Múltiplas Contas**: Ao alternar entre múltiplas contas, é possível contornar os limites de uma única conta, maximizando a cota total.

:::

---

## Explicação dos Caminhos de Configuração

Todas as plataformas (incluindo Windows) usam `~/.config/opencode/` como diretório de configuração:

| Arquivo | Caminho | Descrição |
|---------|---------|-----------|
| Config Principal | `~/.config/opencode/opencode.json` | Arquivo de configuração principal do OpenCode |
| Arquivo de Contas | `~/.config/opencode/antigravity-accounts.json` | Informações de token OAuth e contas |
| Config do Plugin | `~/.config/opencode/antigravity.json` | Configurações específicas do plugin |
| Logs de Debug | `~/.config/opencode/antigravity-logs/` | Arquivos de log de debug |

> **Nota para Usuários Windows**: `~` é automaticamente resolvido para seu diretório de usuário (ex: `C:\Users\SeuNome`). Não use `%APPDATA%`.

---

## Problemas de Autenticação OAuth

### Falha de Callback OAuth no Safari (macOS)

**Sintomas**:
- Após autorização no navegador com sucesso, o terminal exibe "fail to authorize"
- Safari exibe "Safari não consegue abrir a página" ou "Conexão recusada"

**Causa**: O modo "HTTPS-Only" do Safari bloqueia endereços de callback `http://localhost`.

**Soluções**:

**Opção 1: Usar outro navegador (mais simples)**

1. Execute `opencode auth login`
2. Copie a URL OAuth exibida no terminal
3. Cole no Chrome ou Firefox
4. Complete a autorização

**Opção 2: Desativar temporariamente o modo HTTPS-Only**

1. Safari → Configurações (⌘,) → Privacidade
2. Desmarque "Ativar modo HTTPS-Only"
3. Execute `opencode auth login`
4. Reative o modo HTTPS-Only após autenticação

**Opção 3: Extrair callback manualmente (avançado)**

Quando Safari exibir erro, a barra de endereço contém `?code=...&scope=...`. Você pode extrair os parâmetros de callback manualmente. Veja [issue #119](https://github.com/NoeFabris/opencode-antigravity-auth/issues/119).

### Porta Já em Uso

**Mensagem de erro**: `Address already in use`

**Causa**: O servidor de callback OAuth usa `localhost:51121` por padrão. Se a porta estiver ocupada, não consegue iniciar.

**Solução**:

**macOS / Linux:**
```bash
# Encontrar processo usando a porta
lsof -i :51121

# Matar processo (substitua <PID> pelo ID real)
kill -9 <PID>

# Reautenticar
opencode auth login
```

**Windows:**
```powershell
# Encontrar processo usando a porta
netstat -ano | findstr :51121

# Matar processo (substitua <PID> pelo ID real)
taskkill /PID <PID> /F

# Reautenticar
opencode auth login
```

### WSL2 / Docker / Ambientes de Desenvolvimento Remoto

**Problema**: OAuth callback requer que o navegador acesse `localhost` onde OpenCode está rodando, mas em containers ou ambientes remotos isso não é acessível diretamente.

**Solução WSL2**:
- Usar encaminhamento de portas do VS Code
- Ou configurar encaminhamento de portas Windows → WSL

**Solução SSH / Desenvolvimento Remoto:**
```bash
# Estabelecer túnel SSH, encaminhando porta 51121 remota para local
ssh -L 51121:localhost:51121 user@remote-host
```

**Solução Docker / Container:**
- Containers não conseguem usar localhost callback
- Aguarde 30 segundos e use fluxo manual URL
- Ou use encaminhamento de portas SSH

### Problemas de Autenticação Multi-Conta

**Sintomas**: Múltiplas contas falham na autenticação ou se confundem.

**Solução**:
1. Excluir arquivo de contas: `rm ~/.config/opencode/antigravity-accounts.json`
2. Reautenticar: `opencode auth login`
3. Garantir que cada conta use um email Google diferente

---

## Problemas de Atualização de Token

### Erro invalid_grant

**Mensagem de erro**:
```
Error: invalid_grant
Token has been revoked or expired.
```

**Causas**:
- Senha da conta Google alterada
- Evento de segurança na conta (ex: login suspeito)
- `refresh_token` expirado

**Solução**:
```bash
# Excluir arquivo de contas
rm ~/.config/opencode/antigravity-accounts.json

# Reautenticar
opencode auth login
```

### Token Expirado

**Sintomas**: Após um período sem uso, erro ao chamar modelos novamente.

**Causas**: `access_token` válido por cerca de 1 hora, `refresh_token` válido por mais tempo mas também expira.

**Solução**:
- O plugin atualiza automaticamente 30 minutos antes do token expirar, sem ação manual necessária
- Se atualização automática falhar, reautentique: `opencode auth login`

---

## Erros de Permissão

### 403 Permission Denied (rising-fact-p41fc)

**Mensagem de erro**:
```
Permission 'cloudaicompanion.companions.generateChat' denied on resource
'//cloudaicompanion.googleapis.com/projects/rising-fact-p41fc/locations/global'
```

**Causa**: Quando o plugin não encontra um projeto válido, ele recai para um Project ID padrão (como `rising-fact-p41fc`). Isso funciona para modelos Antigravity, mas falha para modelos Gemini CLI porque Gemini CLI requer um projeto GCP em sua própria conta.

**Solução**:

**Passo 1: Criar ou Selecionar Projeto GCP**

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Anote o ID do projeto (ex: `meu-projeto-gemini`)

**Passo 2: Habilitar API Gemini for Google Cloud**

1. No Google Cloud Console, vá para "APIs e Serviços" → "Biblioteca"
2. Pesquise "Gemini for Google Cloud API" (`cloudaicompanion.googleapis.com`)
3. Clique em "Habilitar"

**Passo 3: Adicionar projectId no Arquivo de Contas**

Edite `~/.config/opencode/antigravity-accounts.json`:

```json
{
  "version": 3,
  "accounts": [
    {
      "email": "seu@gmail.com",
      "refreshToken": "...",
      "projectId": "meu-projeto-gemini"
    }
  ]
}
```

::: warning Configuração Multi-Conta
Se múltiplas contas Google estiverem configuradas, cada conta precisa de seu próprio `projectId`.
:::

---

## Problemas de Limite de Taxa

### Todas as Contas Limitadas (Mas Cota Disponível)

**Sintomas**:
- Prompt "Todas as contas com limite de taxa"
- A cota parece suficiente, mas novas requisições não podem ser feitas
- Novas contas adicionadas são imediatamente limitadas

**Causa**: Este é um bug em cascata no modo híbrido do plugin (`clearExpiredRateLimits()`), já corrigido nas versões beta mais recentes.

**Soluções**:

**Opção 1: Atualizar para Versão Beta Mais Recente**
```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

**Opção 2: Excluir Arquivo de Contas e Reautenticar**
```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```

**Opção 3: Alternar Estratégia de Seleção de Conta**
Edite `~/.config/opencode/antigravity.json`, alterando a estratégia para `sticky`:
```json
{
  "account_selection_strategy": "sticky"
}
```

### 429 Too Many Requests

**Sintomas**:
- Requisições frequentemente retornam erro 429
- Prompt "Limite de taxa excedido"

**Causa**: O Google significativamente apertou a aplicação de cotas e limites de taxa. Todos os usuários são afetados, não apenas este plugin. Fatores-chave:

1. **Aplicação Mais Rígida**: Mesmo quando a cota "parece disponível", o Google pode limitar ou soft-banir contas que disparam detecção de abuso
2. **Padrão de Requisições do OpenCode**: O OpenCode faz mais chamadas API que aplicativos nativos (chamadas de ferramentas, tentativas, streaming, cadeias de conversação multi-turno), acionando limites mais rapidamente que uso "normal"
3. **Shadow bans**: Algumas contas, uma vez sinalizadas, ficam inutilizáveis por períodos prolongados, enquanto outras contas continuam funcionando normalmente

::: danger Riscos de Uso
Usar este plugin pode aumentar as chances de acionar proteções automáticas de abuso/limites de taxa. Provedores upstream podem restringir, suspender ou terminar acesso a seu próprio critério. **Use por sua conta e risco**.
:::

**Soluções**:

**Opção 1: Aguardar Redefinição (Mais Confiável)**

Limites de taxa geralmente redefinem após algumas horas. Se o problema persistir:
- Pare de usar a conta afetada por 24-48 horas
- Use outras contas durante este período
- Verifique `rateLimitResetTimes` no arquivo de contas para ver quando os limites expiram

**Opção 2: "Aquecer" Conta no Antigravity IDE (Experiência da Comunidade)**

Usuários relataram que este método funciona:
1. Abra o [Antigravity IDE](https://idx.google.com/) diretamente no navegador
2. Faça login com a conta Google afetada
3. Execute alguns prompts simples (ex: "olá", "quanto é 2+2")
4. Após 5-10 prompts bem-sucedidos, tente usar a conta com o plugin novamente

**Princípio**: Usar a conta através da interface "oficial" pode redefinir alguns sinalizadores internos, ou fazer a conta parecer menos suspeita.

**Opção 3: Reduzir Volume e Rajada de Requisições**

- Use sessões mais curtas
- Evite fluxos de trabalho paralelo/intensivos em tentativas (ex: gerar múltiplos sub-agentes simultaneamente)
- Se usar oh-my-opencode, considere reduzir o número de agentes gerados simultaneamente
- Defina `max_rate_limit_wait_seconds: 0` para falhar rapidamente em vez de tentar novamente

**Opção 4: Usar Antigravity IDE Diretamente (Usuários de Conta Única)**

Se você tiver apenas uma conta, usar o [Antigravity IDE](https://idx.google.com/) diretamente pode oferecer uma experiência melhor, pois o padrão de requisições do OpenCode aciona limites mais rapidamente.

**Opção 5: Configuração de Nova Conta**

Se estiver adicionando uma nova conta:
1. Exclua o arquivo de contas: `rm ~/.config/opencode/antigravity-accounts.json`
2. Reautentique: `opencode auth login`
3. Atualize para a versão beta mais recente: `"plugin": ["opencode-antigravity-auth@beta"]`
4. Considere "aquecer" a conta no Antigravity IDE primeiro

**Informações para Relatar**:

Se encontrar comportamento anormal de limite de taxa, compartilhe no [GitHub issue](https://github.com/NoeFabris/opencode-antigravity-auth/issues):
- Códigos de status nos logs de debug (403, 429, etc.)
- Duração do estado de limite de taxa
- Número de contas e estratégia de seleção usada

### Requisições Pendentes (Sem Resposta)

**Sintomas**:
- Prompt permanece pendente, sem retorno
- Logs mostram 200 OK, mas sem conteúdo de resposta

**Causa**: Geralmente é limitação silenciosa da Google ou soft-ban.

**Solução**:
1. Pare a requisição atual (Ctrl+C ou ESC)
2. Aguarde 24-48 horas antes de usar a conta novamente
3. Use outras contas durante este período

---

## Problemas de Recuperação de Sessão

### Erro Após Interrupção de Execução de Ferramenta

**Sintomas**: Pressionar ESC durante execução de ferramenta, conversa subsequente retorna erro `tool_result_missing`.

**Solução**:
1. Digite `continue` na conversa para acionar recuperação automática
2. Se bloqueado, use `/undo` para reverter ao estado pré-erro
3. Tente a operação novamente

::: tip Recuperação Automática
A função de recuperação de sessão do plugin está habilitada por padrão. Se a execução da ferramenta for interrompida, ela injetará automaticamente `tool_result` sintético e tentará recuperar.
:::

---

## Problemas de Compatibilidade de Plugins

### Conflito com oh-my-opencode

**Problema**: oh-my-opencode tem autenticação Google integrada, conflitando com este plugin.

**Solução**: Desative a autenticação integrada em `~/.config/opencode/oh-my-opencode.json`:
```json
{
  "google_auth": false,
  "agents": {
    "frontend-ui-ux-engineer": { "model": "google/antigravity-gemini-3-pro" },
    "document-writer": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

**Problema de Agente Paralelo**: Ao gerar sub-agentes paralelos, múltiplos processos podem atingir a mesma conta. **Soluções**:
- Habilite `pid_offset_enabled: true` (configure em `antigravity.json`)
- Ou adicione mais contas

### Conflito com @tarquinen/opencode-dcp

**Problema**: DCP cria mensagens synthetic assistant sem blocos de pensamento, conflitando com este plugin.

**Solução**: **Liste este plugin antes de DCP**:
```json
{
  "plugin": [
    "opencode-antigravity-auth@latest",
    "@tarquinen/opencode-dcp@latest"
  ]
}
```

### Outros Plugins gemini-auth

**Problema**: Instalou outros plugins de autenticação Google Gemini, causando conflito.

**Solução**: Você não precisa deles. Este plugin já gerencia toda a autenticação Google OAuth. Desinstale outros plugins gemini-auth.

---

## Problemas de Configuração

### Erro de Digitação na Chave de Configuração

**Mensagem de erro**: `Unrecognized key: "plugins"`

**Causa**: Usou nome de chave incorreto.

**Solução**: A chave correta é `plugin` (singular):
```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

**Não** `"plugins"` (plural), isso causará erro "Unrecognized key".

### Modelo Não Encontrado

**Sintomas**: Ao usar modelo, erro "Model not found" ou erro 400.

**Solução**: Adicione na configuração do provider `google`:
```json
{
  "provider": {
    "google": {
      "npm": "@ai-sdk/google",
      "models": { ... }
    }
  }
}
```

---

## Problemas de Migração

### Migração de Conta Entre Máquinas

**Problema**: Após copiar `antigravity-accounts.json` para nova máquina, erro "API key missing".

**Solução**:
1. Garanta que o plugin está instalado: `"plugin": ["opencode-antigravity-auth@beta"]`
2. Copie `~/.config/opencode/antigravity-accounts.json` para o mesmo caminho na nova máquina
3. Se ainda reportar erro, `refresh_token` pode ter expirado → reautentique: `opencode auth login`

---

## Técnicas de Debug

### Habilitar Logs de Debug

**Log Básico**:
```bash
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode
```

**Log Detalhado** (requisição/resposta completa):
```bash
OPENCODE_ANTIGRAVITY_DEBUG=2 opencode
```

Localização dos arquivos de log: `~/.config/opencode/antigravity-logs/`

### Verificar Estado de Limite de Taxa

Veja o campo `rateLimitResetTimes` no arquivo de contas:
```bash
cat ~/.config/opencode/antigravity-accounts.json | grep rateLimitResetTimes
```

---

## Checkpoint ✅

Após completar a solução de problemas, você deve ser capaz de:
- [ ] Compreender corretamente os caminhos de configuração (`~/.config/opencode/`)
- [ ] Resolver problemas de falha de callback OAuth no Safari
- [ ] Lidar com erros invalid_grant e 403
- [ ] Entender causas e estratégias de resposta a limites de taxa
- [ ] Resolver conflitos com oh-my-opencode
- [ ] Habilitar logs de debug para localizar problemas

---

## Alertas de Problemas Comuns

### Não Submeta Arquivo de Contas para Controle de Versão

`antigravity-accounts.json` contém refresh tokens OAuth, equivalentes a arquivos de senha. O plugin cria automaticamente `.gitignore`, mas certifique-se de que seu `.gitignore` inclui:
```
~/.config/opencode/antigravity-accounts.json
```

### Evite Tentativas Frequentes

Após acionar limite 429, não tente repetidamente. Aguarde um período antes de tentar novamente, caso contrário pode ser sinalizado como abuso.

### Atenção ao projectId em Configuração Multi-Conta

Se usar modelos Gemini CLI, **cada conta** precisa de seu próprio `projectId`. Não use o mesmo project ID para múltiplas contas.

---

## Resumo da Aula

Esta aula cobriu os problemas de autenticação e conta mais comuns do plugin Antigravity Auth:

1. **Problemas de Autenticação OAuth**: Falha de callback no Safari, porta ocupada, ambientes WSL2/Docker
2. **Problemas de Atualização de Token**: invalid_grant, token expirado
3. **Erros de Permissão**: 403 Permission Denied, projectId ausente
4. **Problemas de Limite de Taxa**: Erro 429, shadow bans, todas as contas limitadas
5. **Compatibilidade de Plugins**: Conflitos com oh-my-opencode, DCP
6. **Problemas de Configuração**: Erros de digitação, modelo não encontrado

Ao encontrar problemas, primeiro tente **Redefinição Rápida** (excluir arquivo de contas e reautenticar) — resolve 90% dos casos. Se o problema persistir, habilite logs de debug para ver detalhes.

---

## Próxima Aula

> Na próxima aula aprenderemos **[Solução de Erros de Modelo Não Encontrado](../model-not-found/)**.
>
> Você vai aprender:
> - Erro 400 de modelos Gemini 3 (Unknown name 'parameters')
> - Problemas de incompatibilidade de Tool Schema
> - Métodos de diagnóstico para erros causados por servidores MCP
> - Como localizar a origem do problema através de debug

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código fonte</strong></summary>

> Última atualização: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Linhas |
|---|---|---|
| Autenticação OAuth (PKCE) | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts) | 91-270 |
| Verificação e Atualização de Token | [`src/plugin/auth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/auth.ts) | 1-53 |
| Armazenamento e Gerenciamento de Contas | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts) | 1-715 |
| Detecção de Limite de Taxa | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts) | 9-75 |
| Recuperação de Sessão | [`src/plugin/recovery/index.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/index.ts) | 1-150 |
| Sistema de Logs de Debug | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts) | 1-300 |

**Constantes Chave**:
- `OAUTH_PORT = 51121`: Porta do servidor de callback OAuth (`constants.ts:25`)
- `CLIENT_ID`: ID do cliente OAuth (`constants.ts:4`)
- `TOKEN_EXPIRY_BUFFER = 30 * 60 * 1000`: Atualizar token 30 minutos antes da expiração (`auth.ts:33`)

**Funções Chave**:
- `authorizeAntigravity()`: Inicia fluxo de autenticação OAuth (`oauth.ts:91`)
- `exchangeAntigravity()`: Troca código de autorização por token (`oauth.ts:209`)
- `refreshAccessToken()`: Atualiza token de acesso expirado (`oauth.ts:263`)
- `isOAuthAuth()`: Verifica se é tipo de autenticação OAuth (`auth.ts:5`)
- `accessTokenExpired()`: Verifica se token está prestes a expirar (`auth.ts:33`)
- `markRateLimitedWithReason()`: Marca conta como estado de limite de taxa (`accounts.ts:9`)
- `detectErrorType()`: Detecta tipos de erro recuperáveis (`recovery/index.ts`)

</details>
