---
title: "Solução de Invalid Grant: Recuperação de Conta Desativada | Antigravity-Manager"
sidebarTitle: "Como Recuperar Conta Desativada"
subtitle: "invalid_grant e Desativação Automática de Conta: Por Que Ocorre, Como Recuperar"
description: "Aprenda o significado do erro invalid_grant e a lógica de processamento automático. Confirme que o refresh_token expirou, recupere a conta adicionando OAuth novamente para acionar o desbloqueio automático, e verifique que a recuperação afeta o Proxy."
tags:
  - "FAQ"
  - "Solução de Problemas"
  - "OAuth"
  - "Gerenciamento de Contas"
  - "invalid_grant"
prerequisite:
  - "start-add-account"
  - "start-first-run-data"
  - "advanced-scheduling"
order: 1
---

# invalid_grant e Desativação Automática de Conta: Por Que Ocorre, Como Recuperar

## O Que Você Poderá Fazer Após Este Curso

- Ao ver `invalid_grant`, saber qual categoria de problema de refresh_token corresponde
- Entender claramente "por que a conta de repente ficou indisponível": em quais situações será desativada automaticamente, como o sistema lida após a desativação
- Recuperar a conta pelo caminho mais curto e confirmar que a recuperação já afetou o Proxy em execução

## Seus Sintomas

- Ao chamar o Proxy local, de repente falha, a mensagem de erro contém `invalid_grant`
- A conta ainda está na lista de Accounts, mas o Proxy sempre a pula (ou você sente que "nunca mais foi usada")
- Com poucas contas, após encontrar `invalid_grant` uma vez, a disponibilidade geral piora visivelmente

## O Que é invalid_grant?

**invalid_grant** é uma categoria de erro retornada pelo Google OAuth ao atualizar `access_token`. Para o Antigravity Tools, significa que o `refresh_token` de certa conta provavelmente foi revogado ou expirou, continuar tentando apenas falhará repetidamente, então o sistema marcará essa conta como indisponível e a removerá do pool de proxy.

## Ideia Central: O Sistema Não "Pula Temporariamente", Mas "Desativa Permanentemente"

Quando o Proxy descobre que a string de erro ao atualizar o token contém `invalid_grant`, fará duas coisas:

1. **Escrever a conta como disabled** (persistir no JSON da conta)
2. **Remover a conta do pool de tokens na memória** (evitar selecionar repetidamente a mesma conta ruim)

É por isso que você vê "a conta ainda existe, mas o Proxy não a usa mais".

::: info disabled vs proxy_disabled

- `disabled=true`: A conta foi "completamente desativada" (motivo típico é `invalid_grant`). Ao carregar o pool de contas, será pulada diretamente.
- `proxy_disabled=true`: A conta é apenas "indisponível para o Proxy" (desativação manual/operação em lote/lógica relacionada à proteção de cota), semântica diferente.

Esses dois estados são julgados separadamente ao carregar o pool de contas: primeiro julga `disabled`, depois faz a proteção de cota e o julgamento de `proxy_disabled`.

:::

## Siga-me

### Passo 1: Confirme se é invalid_grant Disparado pela Atualização de refresh_token

**Por Que**: `invalid_grant` pode aparecer em múltiplas cadeias de chamada, mas a "desativação automática" deste projeto só é disparada quando a **atualização de access_token falha**.

No log do Proxy, você verá logs de erro semelhantes (palavras-chave são `Token 刷新失败` + `invalid_grant`):

```text
Token 刷新失败 (<email>): <...invalid_grant...>，尝试下一个账号
Disabling account due to invalid_grant (<email>): refresh_token likely revoked/expired
```

**Você Deve Ver**: A mesma conta logo após aparecer `invalid_grant`, não será mais selecionada (porque foi removida do token pool).

### Passo 2: Verifique o Campo disabled no Arquivo da Conta (Opcional, Mais Preciso)

**Por Que**: A desativação automática é "persistente", após confirmar o conteúdo do arquivo, você pode excluir o julgamento errado de "apenas rotação temporária".

O arquivo da conta está localizado no diretório `accounts/` do diretório de dados do aplicativo (a localização do diretório de dados veja **[Primeira Inicialização: Diretório de Dados, Logs, Bandeja e Inicialização Automática](../../start/first-run-data/)**). Quando a conta é desativada, o arquivo aparecerá com estes três campos:

```json
{
  "disabled": true,
  "disabled_at": 1700000000,
  "disabled_reason": "invalid_grant: ..."
}
```

**Você Deve Ver**: `disabled` é `true`, e `disabled_reason` contém o prefixo `invalid_grant:`.

### Passo 3: Recupere a Conta (Recomendado: Adicione a Mesma Conta Novamente)

**Por Que**: A "recuperação" deste projeto não é clicar um interruptor no Proxy, mas acionar o desbloqueio automático através de "atualização explícita de token".

Vá para a página **Accounts**, adicione a conta novamente com suas novas credenciais (escolha um dos dois métodos):

1. Execute o processo de autorização OAuth novamente (veja **[Adicionar Contas: Canal Duplo OAuth/Refresh Token e Melhores Práticas](../../start/add-account/)**)
2. Adicione novamente com o novo `refresh_token` (o sistema usará o email retornado pelo Google como base para fazer upsert)

Quando o sistema detecta que o `refresh_token` ou `access_token` deste upsert é diferente do valor antigo, e a conta anteriormente estava em `disabled=true`, limpará automaticamente:

- `disabled`
- `disabled_reason`
- `disabled_at`

**Você Deve Ver**: A conta não está mais no estado disabled, e (se o Proxy estiver em execução) o pool de contas será recarregado automaticamente, fazendo a recuperação entrar em vigor imediatamente.

### Passo 4: Verifique se a Recuperação Já Afetou o Proxy

**Por Que**: Se você só tem uma conta, ou outras contas também estão indisponíveis, após a recuperação você deve ver imediatamente "a disponibilidade voltou".

Método de verificação:

1. Faça uma solicitação que dispare a atualização de token (por exemplo, aguarde o token próximo de expirar antes de solicitar)
2. Observe que o log não aparece mais a dica "pular conta disabled"

**Você Deve Ver**: Solicitação passa normalmente, e o log não aparece mais o processo de desativação `invalid_grant` para essa conta.

## Lembrete de Armadilhas

### ❌ Tratar disabled como "Rotação Temporária"

Se você só vê na UI "a conta ainda existe", é fácil julgar erroneamente como "o sistema apenas não a usa temporariamente". Mas `disabled=true` é escrito no disco, continuará em vigor após reiniciar.

### ❌ Apenas Suplementar access_token, Não Atualizar refresh_token

O ponto de gatilho de `invalid_grant` é o `refresh_token` usado ao atualizar `access_token`. Se você apenas obteve temporariamente um `access_token` ainda utilizável, mas `refresh_token` ainda expirou, subsequentemente ainda disparará a desativação.

## Pontos de Verificação ✅

- [ ] Você pode confirmar no log que `invalid_grant` vem da falha de atualização de refresh_token
- [ ] Você sabe a diferença semântica entre `disabled` e `proxy_disabled`
- [ ] Você pode recuperar a conta adicionando novamente (OAuth ou refresh_token)
- [ ] Você pode verificar que a recuperação já afetou o Proxy em execução

## Resumo da Lição

- Quando `invalid_grant` é disparado, o Proxy **persistirá a conta como disabled** e a removerá do token pool, evitando falhas repetidas
- A chave da recuperação é "atualização explícita de token" (OAuth novamente ou adicionar novamente com novo refresh_token), o sistema limpará automaticamente os campos `disabled_*`
- O JSON da conta no diretório de dados é a fonte mais autoritária de estado (desativação/motivo/tempo estão dentro)

## Próximo Passo

> Na próxima lição aprenderemos **[401/Falha de Autenticação: auth_mode, Compatibilidade de Header e Lista de Verificação de Configuração de Cliente](../auth-401/)**.
>
> Você aprenderá:
> - 401 geralmente é qual camada não corresponde entre "modo/Key/Header"
> - Quais Headers de autenticação diferentes clientes devem trazer
> - Como fazer autodiagnóstico e reparo pelo caminho mais curto

---

## Apêndice: Referência do Código-fonte

<details>
<summary><strong>Clique para Expandir e Ver Localização do Código-fonte</strong></summary>

> Última Atualização: 2026-01-23

| Função | Caminho do Arquivo | Número da Linha |
|--- | --- | ---|
| Explicação de Design: Problema de invalid_grant e Comportamento de Mudança | [`docs/proxy-invalid-grant.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy-invalid-grant.md#L1-L52) | 1-52 |
| Ao carregar o pool de contas, pular `disabled=true` | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L70-L158) | 70-158 |
| Ao falhar a atualização de token, identificar `invalid_grant` e desativar conta | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L840-L890) | 840-890 |
| Persistir gravar `disabled/disabled_at/disabled_reason` e remover da memória | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L942-L969) | 942-969 |
| Truncamento de `disabled_reason` (evitar inflar arquivo de conta) | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L1464-L1471) | 1464-1471 |
| Ao upsert, limpar automaticamente `disabled_*` (mudança de token vista como usuário corrigiu credenciais) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L178-L206) | 178-206 |
| Após adicionar conta novamente, recarregar automaticamente contas de proxy (entra em vigor imediatamente em execução) | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L21-L59) | 21-59 |

</details>
