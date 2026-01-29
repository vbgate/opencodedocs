---
title: "Adicionar Contas: Canais Duplos OAuth e Refresh Token | Antigravity Tools"
sidebarTitle: "Adicione sua Conta Google"
subtitle: "Adicionar Contas: Canais Duplos OAuth/Refresh Token e Melhores Práticas"
description: "Aprenda as duas maneiras de adicionar contas no Antigravity Tools. Através de autorização OAuth com um clique ou adição manual de Refresh Token, suporta importação em lote, lida com falhas de callback e valida o pool de contas."
tags:
  - "Gerenciamento de Contas"
  - "OAuth"
  - "refresh_token"
  - "Google"
  - "Melhores Práticas"
prerequisite:
  - "start-getting-started"
duration: 15
order: 4
---

# Adicionar Contas: Canais Duplos OAuth/Refresh Token e Melhores Práticas

No Antigravity Tools, "adicionar conta" significa escrever o `refresh_token` da conta Google no pool de contas local, permitindo que solicitações de proxy reverso subsequente usem em rotação. Você pode passar pela autorização OAuth com um clique, ou pode colar diretamente o `refresh_token` para adicionar manualmente.

## O que você poderá fazer após completar

- Usar OAuth ou Refresh Token para adicionar contas Google ao pool de contas do Antigravity Tools
- Copiar/abrir manualmente o link de autorização, e automaticamente completar a adição após o callback ser bem-sucedido
- Ao encontrar problemas como não conseguir obter `refresh_token`, callback não conectar com `localhost`, saber como lidar

## Seu dilema atual

- Clicou em "Autorização OAuth" mas fica girando, ou navegador avisa `localhost refused to connect`
- Autorização bem-sucedida, mas avisa "Não foi possível obter Refresh Token"
- Você só tem `refresh_token`, não sabe como importar em lote de uma vez

## Quando usar essa técnica

- Você quer adicionar contas da maneira mais estável (priorizar OAuth)
- Você se importa mais com portabilidade/backup (Refresh Token é mais adequado como "ativo do pool de contas")
- Você quer adicionar muitas contas, quer importar em lote `refresh_token` (suporta extração de texto/JSON)

## 🎒 Preparação antes de começar

- Você já instalou e pode abrir o Antigravity Tools desktop
- Você sabe onde fica a entrada: navegação lateral para página `Accounts` (veja rota em `source/lbjlaq/Antigravity-Manager/src/App.tsx`)

::: info Duas palavras-chave desta lição
**OAuth**: Um processo "pular para navegador e autorizar". Antigravity Tools inicia temporariamente um endereço de callback local (`http://localhost/127.0.0.1/[::1]:<port>/oauth-callback`, escolhido automaticamente baseado no monitoramento IPv4/IPv6 do sistema), espera o navegador voltar com `code` depois troca por token. (Implementação em `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/oauth_server.rs`)

**refresh_token**: Um "credencial que pode ser usado por longo tempo para renovar access_token". Este projeto ao adicionar conta usa ele para trocar access_token primeiro, depois puxar email real do Google e ignora o email que você inseriu no frontend. (Implementação em `source/lbjlaq/Antigravity-Manager/src-tauri/src/commands/mod.rs`)
:::

## Ideia Principal

O "adicionar conta" do Antigravity Tools, no fundo, é para obter um `refresh_token` disponível, e escrever informações da conta no pool de contas local.

- **Canal OAuth**: Aplicação gera link de autorização para você e monitora callback local; após autorização completada troca token automaticamente e salva conta (veja `prepare_oauth_url`, `start_oauth_login`, `complete_oauth_login`)
- **Canal Refresh Token**: Você cola diretamente o `refresh_token`, aplicação usa ele para renovar access_token, e obtém email real do Google para gravar (veja `add_account`)

## Siga-me

### Passo 1: Abra o diálogo "Adicionar Conta"

**Por que**
Todas as entradas de adição estão consolidadas na página `Accounts`.

Operação: entre na página `Accounts`, clique no botão **Add Account** no lado direito (componente: `AddAccountDialog`).

**Você deve ver**: Surge um diálogo com 3 abas: `OAuth` / `Refresh Token` / `Import` (veja `source/lbjlaq/Antigravity-Manager/src/components/accounts/AddAccountDialog.tsx`).

### Passo 2: Primeiro use autorização OAuth com um clique (recomendado)

**Por que**
Este é o caminho recomendado padrão do produto: deixa aplicação gerar link de autorização, abrir navegador automaticamente, e após callback completar automaticamente o salvamento.

1. Mude para aba `OAuth`.
2. Primeiro copie o link de autorização: após o diálogo abrir, chamará automaticamente `prepare_oauth_url` para pré-gerar URL (chamada frontend em `AddAccountDialog.tsx:111-125`; backend gera e monitora em `oauth_server.rs`).
3. Clique **Start OAuth** (corresponde a frontend `startOAuthLogin()` / backend `start_oauth_login`), permite aplicação abrir navegador padrão e começar a esperar callback.

**Você deve ver**:
- Aparece um link de autorização copiável no diálogo (nome do evento: `oauth-url-generated`)
- Navegador abre página de autorização Google; após autorização redireciona para um endereço local, e mostra "Authorization Successful!" (`oauth_success_html()`)

### Passo 3: Quando OAuth não completa automaticamente, use "Concluir OAuth" para finalizar manualmente

**Por que**
O fluxo OAuth tem dois estágios: navegador autoriza obtendo `code`, depois aplicação usa `code` para trocar token. Mesmo se você não clicou "Start OAuth", desde que você abriu manualmente o link de autorização e completou callback, o diálogo tentará finalizar automaticamente; se não conseguir, você pode clicar uma vez manualmente.

1. Se você é "copiou link para abrir em seu próprio navegador" (em vez de navegador padrão), após callback de autorização voltar, aplicação receberá evento `oauth-callback-received`, e chamará automaticamente `completeOAuthLogin()` (veja `source/lbjlaq/Antigravity-Manager/src/components/accounts/AddAccountDialog.tsx:67-109`).
2. Se você não vê conclusão automática, clique **Finish OAuth** no diálogo (corresponde a backend `complete_oauth_login`).

**Você deve ver**: Diálogo avisa sucesso e fecha automaticamente; nova conta aparece na lista `Accounts`.

::: tip Dica: se callback não conectar, priorize copiar link
Backend tentará monitorar simultaneamente IPv6 `::1` e IPv4 `127.0.0.1`, e escolherá `localhost/127.0.0.1/[::1]` como endereço de callback baseado na situação de monitoramento, principalmente para evitar falha de conexão causada por "navegador resolvendo localhost para IPv6". (Veja `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/oauth_server.rs:53-113`)
:::

### Passo 4: Adicione manualmente com Refresh Token (suporta lote)

**Por que**
Quando você não consegue obter `refresh_token` (ou você prefere "ativo portátil"), adicionar com Refresh Token é mais controlável.

1. Mude para aba `Refresh Token`.
2. Cole o `refresh_token` na caixa de texto.

Formatos de entrada suportados (frontend analisará e adicionará em lote):

| Tipo de entrada | Exemplo | Lógica de análise |
|--- | --- | ---|
| Texto de token puro | `1//abc...` | Extração por regex: `/1\/\/[a-zA-Z0-9_\-]+/g` (veja `AddAccountDialog.tsx:213-220`) |
| Misturado em texto grande | Logs/texto exportado contém múltiplos `1//...` | Extração em lote por regex e deduplicação (veja `AddAccountDialog.tsx:213-224`) |
| Array JSON | `[{"refresh_token":"1//..."}]` | Analisa array e pega `item.refresh_token` (veja `AddAccountDialog.tsx:198-207`) |

Após clicar **Confirm**, diálogo chamará `onAdd("", token)` uma por uma baseado na quantidade de tokens (veja `AddAccountDialog.tsx:231-248`), finalmente chegando no backend `add_account`.

**Você deve ver**:
- Diálogo mostra progresso em lote (ex: `1/5`)
- Após sucesso, nova conta aparece na lista `Accounts`

### Passo 5: Confirme "Pool de Contas Disponível"

**Por que**
Adição com sucesso não é igual a "pode usar estável imediatamente". Backend após adição disparará automaticamente uma "atualização de cota", e ao Proxy rodar tentará reload token pool, fazendo mudanças entrarem em vigor imediatamente.

Você pode confirmar com estes 2 sinais:

1. Conta aparece na lista, e mostra email (email vem de backend `get_user_info`, não o email que você inseriu).
2. Informações de cota/assinatura da conta começam a atualizar (backend chamará automaticamente `internal_refresh_account_quota`).

**Você deve ver**: Após adicionar, não precisa clicar atualizar manualmente, conta começará a aparecer informações de cota (sucesso baseado no que a interface realmente exibe).

## Ponto de verificação ✅

- Pode ver email da nova conta na lista de contas
- Não fica parado em estado "loading" além do tempo que você aceita (após callback OAuth completar deve finalizar rápido)
- Se você está rodando Proxy, nova conta pode participar de agendamento rápido (backend tentará reload)

## Aviso sobre armadilhas

### 1) OAuth avisa "Não foi possível obter Refresh Token"

Backend em `start_oauth_login/complete_oauth_login` verificará explicitamente se `refresh_token` existe; se não existir, retornará uma mensagem de erro com solução (veja `source/lbjlaq/Antigravity-Manager/src-tauri/src/commands/mod.rs:45-56`).

Maneira de lidar sugerida pelo código-fonte:

1. Abra `https://myaccount.google.com/permissions`
2. Revogue permissão de **Antigravity Tools**
3. Volte para aplicação e passe OAuth novamente

> Você também pode mudar diretamente para o canal Refresh Token desta lição.

### 2) Navegador avisa `localhost refused to connect`

Callback OAuth precisa que navegador solicite endereço de callback local. Para reduzir taxa de falha, backend:

- Tentará monitorar simultaneamente `127.0.0.1` e `::1`
- Quando ambos disponíveis usa `localhost`, caso contrário força usar `127.0.0.1` ou `[::1]`

Implementação correspondente em `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/oauth_server.rs:53-113`.

### 3) Mudar para outra aba cancela preparação OAuth

Quando diálogo muda de `OAuth` para outra aba, frontend chamará `cancelOAuthLogin()` e limpará URL (veja `AddAccountDialog.tsx:127-136`).

Se você está no processo de autorização, não mude de aba com pressa.

### 4) Exemplos corretos/errados de Refresh Token

| Exemplo | Será reconhecido | Motivo |
|--- | --- | ---|
| `1//0gAbC...` | ✓ | Atende regra de prefixo `1//` (veja `AddAccountDialog.tsx:215-219`) |
| `ya29.a0...` | ✗ | Não atende regra de extração frontend, será tratado como entrada inválida |

## Resumo da lição

- OAuth: adequado para "rápido", também suporta copiar link para seu navegador habitual e finalizar automático/manual
- Refresh Token: adequado para "estável" e "portátil", suporta extração em lote de texto/JSON `1//...`
- Quando não consegue obter `refresh_token`, revogue autorização seguindo aviso de erro e refaça, ou mude diretamente para Refresh Token

## Próximo aviso de lição

Na próxima lição faremos algo mais sólido: transformar o pool de contas em "ativo portátil".

> Vá aprender **[Backup de Contas: Importar/Exportar, Migração a quente V1/DB](../backup-migrate/)**.

---

## Apêndice: Referência de código-fonte

<details>
<summary><strong>Clique para expandir localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Funcionalidade | Caminho do arquivo | Linha |
|--- | --- | ---|
| Página Accounts monta diálogo de adição | [`src/pages/Accounts.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Accounts.tsx#L267-L731) | 267-731 |
|--- | --- | ---|
| Evento de callback OAuth dispara `completeOAuthLogin()` | [`src/components/accounts/AddAccountDialog.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/accounts/AddAccountDialog.tsx#L67-L109) | 67-109 |
| Análise em lote de Refresh Token e deduplicação | [`src/components/accounts/AddAccountDialog.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/accounts/AddAccountDialog.tsx#L185-L268) | 185-268 |
| Frontend chama comandos Tauri (add/OAuth/cancel) | [`src/services/accountService.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/services/accountService.ts#L5-L91) | 5-91 |
| Backend add_account: ignora email, usa refresh_token para obter email real e gravar | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L19-L60) | 19-60 |
| Backend OAuth: verifica falta de refresh_token e dá solução de revogação | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L38-L79) | 38-79 |
| Server de callback OAuth: monitora simultaneamente IPv4/IPv6 e escolhe redirect_uri | [`src-tauri/src/modules/oauth_server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/oauth_server.rs#L43-L113) | 43-113 |
|--- | --- | ---|

**Nomes de eventos principais**:
- `oauth-url-generated`: backend envia para frontend após gerar URL OAuth (veja `oauth_server.rs:250-252`)
- `oauth-callback-received`: backend notifica frontend após receber callback e analisar code (veja `oauth_server.rs:177-180` / `oauth_server.rs:232-235`)

**Comandos principais**:
- `prepare_oauth_url`: pré-gera link de autorização e inicia monitoramento de callback (veja `src-tauri/src/commands/mod.rs:469-473`)
- `start_oauth_login`: abre navegador padrão e espera callback (veja `src-tauri/src/commands/mod.rs:339-401`)
- `complete_oauth_login`: não abre navegador, apenas espera callback e completa troca de token (veja `src-tauri/src/commands/mod.rs:405-467`)
- `add_account`: usa refresh_token para gravar conta (veja `src-tauri/src/commands/mod.rs:19-60`)

</details>
