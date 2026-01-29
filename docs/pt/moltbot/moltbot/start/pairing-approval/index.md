---
title: "Emparelhamento de DM e Controle de Acesso: Proteja seu Assistente de IA | Tutorial Clawdbot"
sidebarTitle: "Gerenciar Acesso de Estranhos"
subtitle: "Emparelhamento de DM e Controle de Acesso: Proteja seu Assistente de IA"
description: "Entenda o mecanismo de proteção de emparelhamento de DM do Clawdbot, aprenda a aprovar solicitações de emparelhamento de remetentes desconhecidos via CLI, listar solicitações pendentes e gerenciar a lista de permissão. Este tutorial apresenta o processo de emparelhamento, uso de comandos CLI, configuração de políticas de acesso e práticas de segurança, incluindo solução de problemas e comando doctor."
tags:
  - "Introdução"
  - "Segurança"
  - "Emparelhamento"
  - "Controle de Acesso"
prerequisite:
  - "start-gateway-startup"
order: 50
---

# Emparelhamento de DM e Controle de Acesso: Proteja seu Assistente de IA

## O Que Você Vai Aprender

Ao completar este tutorial, você será capaz de:

- ✅ Entender o mecanismo padrão de proteção de emparelhamento de DM
- ✅ Aprovar solicitações de emparelhamento de remetentes desconhecidos
- ✅ Listar e gerenciar solicitações de emparelhamento pendentes
- ✅ Configurar diferentes políticas de acesso de DM (pairing/allowlist/open)
- ✅ Executar verificações doctor na configuração de segurança

## Seu Problema Atual

Você pode ter configurado o WhatsApp ou Telegram e quer conversar com seu assistente de IA, mas encontrou os seguintes problemas:

- "Por que o Clawdbot não responde a estranhos que me enviam mensagens?"
- "Recebi um código de emparelhamento e não sei o que significa"
- "Quero aprovar a solicitação de alguém, mas não sei qual comando usar"
- "Como verificar quem está aguardando aprovação?"

A boa notícia é: **o Clawdbot habilita proteção de emparelhamento de DM por padrão**, isso garante que apenas remetentes que você autorizou possam conversar com seu assistente de IA.

## Quando Usar Esta Abordagem

Quando você precisa:

- 🛡 **Proteger privacidade**: Garantir que apenas pessoas confiáveis possam conversar com seu assistente de IA
- ✅ **Aprovar estranhos**: Permitir que novos remetentes acessem seu assistente de IA
- 🔒 **Controle de acesso estrito**: Limitar permissões de acesso para usuários específicos
- 📋 **Gerenciamento em lote**: Visualizar e gerenciar todas as solicitações de emparelhamento pendentes

---

## Ideia Central

### O Que É Emparelhamento de DM?

O Clawdbot se conecta a plataformas de mensagens reais (WhatsApp, Telegram, Slack, etc.), e **mensagens privadas (DM) nessas plataformas são consideradas entrada não confiável por padrão**.

Para proteger seu assistente de IA, o Clawdbot fornece um **mecanismo de emparelhamento**:

::: info Processo de Emparelhamento
1. Um remetente desconhecido envia uma mensagem para você
2. O Clawdbot detecta que o remetente não está autorizado
3. O Clawdbot retorna um **código de emparelhamento** (8 caracteres)
4. O remetente precisa fornecer o código de emparelhamento para você
5. Você aprova o código via CLI
6. O ID do remetente é adicionado à lista de permissão
7. O remetente pode conversar normalmente com o assistente de IA
:::

### Política de DM Padrão

**Todos os canais usam `dmPolicy="pairing"` por padrão**, o que significa:

| Política | Comportamento |
|--- | ---|
| `pairing` | Remetentes desconhecidos recebem código de emparelhamento, mensagens não são processadas (padrão) |
| `allowlist` | Apenas permite remetentes da lista `allowFrom` |
| `open` | Permite todos os remetentes (requer configuração explícita `"*"`) |
| `disabled` | Desabilita completamente a funcionalidade DM |

::: warning Lembrete de Segurança
O modo `pairing` padrão é a opção mais segura. A menos que você tenha necessidades especiais, não altere para o modo `open`.
:::

---

## 🎒 Preparativos

Certifique-se de que você:

- [x] Completou o tutorial [Início Rápido](../getting-started/)
- [x] Completou o tutorial [Iniciando o Gateway](../gateway-startup/)
- [x] Configurou pelo menos um canal de mensagens (WhatsApp, Telegram, Slack, etc.)
- [x] O Gateway está em execução

---

## Siga-me

### Passo 1: Entender a Origem do Código de Emparelhamento

Quando um remetente desconhecido envia uma mensagem para seu Clawdbot, eles recebem uma resposta semelhante a esta:

```
Clawdbot: access not configured.

Telegram ID: 123456789

Pairing code: AB3D7X9K

Ask the bot owner to approve with:
clawdbot pairing approve telegram <code>
```

**Características-chave do Código de Emparelhamento** (fonte: `src/pairing/pairing-store.ts`):

- **8 caracteres**: Fácil de digitar e lembrar
- **Letras maiúsculas e números**: Evita confusão
- **Exclui caracteres confusos**: Não contém 0, O, 1, I
- **Validade de 1 hora**: Expira automaticamente após esse tempo
- **Máximo de 3 solicitações pendentes**: Limpa automaticamente a solicitação mais antiga quando excedido

### Passo 2: Listar Solicitações de Emparelhamento Pendentes

Execute o seguinte comando no terminal:

```bash
clawdbot pairing list telegram
```

**Você deve ver**:

```
Pairing requests (1)

┌──────────────────┬────────────────┬────────┬──────────────────────┐
│ Code            │ ID            │ Meta   │ Requested            │
├──────────────────┼────────────────┼────────┼──────────────────────┤
│ AB3D7X9K        │ 123456789      │        │ 2026-01-27T10:30:00Z │
└──────────────────┴────────────────┴────────┴──────────────────────┘
```

Se não houver solicitações pendentes, você verá:

```
No pending telegram pairing requests.
```

::: tip Canais Suportados
A funcionalidade de emparelhamento suporta os seguintes canais:
- telegram
- whatsapp
- slack
- discord
- signal
- imessage
- msteams
- googlechat
- bluebubbles
:::

### Passo 3: Aprovar Solicitação de Emparelhamento

Use o código de emparelhamento fornecido pelo remetente para aprovar o acesso:

```bash
clawdbot pairing approve telegram AB3D7X9K
```

**Você deve ver**:

```
✅ Approved telegram sender 123456789
```

::: info Efeito após Aprovação
Após a aprovação, o ID do remetente (123456789) é adicionado automaticamente à lista de permissão desse canal, armazenado em:
`~/.clawdbot/credentials/telegram-allowFrom.json`
:::

### Passo 4: Notificar o Remetente (Opcional)

Se você quiser notificar automaticamente o remetente, use a flag `--notify`:

```bash
clawdbot pairing approve telegram AB3D7X9K --notify
```

O remetente receberá a seguinte mensagem (fonte: `src/channels/plugins/pairing-message.ts`):

```
✅ Clawdbot access approved. Send a message to start chatting.
```

**Nota**: A flag `--notify` exige que o Clawdbot Gateway esteja em execução e que o canal esteja ativo.

### Passo 5: Verificar que o Remetente Pode Conversar Normalmente

Peça ao remetente para enviar outra mensagem, o assistente de IA deve responder normalmente.

---

## Ponto de Verificação ✅

Complete as seguintes verificações para confirmar que a configuração está correta:

- [ ] Executar `clawdbot pairing list <channel>` pode mostrar solicitações pendentes
- [ ] Usar `clawdbot pairing approve <channel> <code>` pode aprovar com sucesso
- [ ] O remetente aprovado pode conversar normalmente com o assistente de IA
- [ ] O código de emparelhamento expira automaticamente após 1 hora (pode verificar enviando outra mensagem)

---

## Armadilhas Comuns

### Erro 1: Código de Emparelhamento Não Encontrado

**Mensagem de erro**:
```
No pending pairing request found for code: AB3D7X9K
```

**Causas possíveis**:
- O código de emparelhamento expirou (mais de 1 hora)
- O código de emparelhamento foi inserido incorretamente (verifique maiúsculas/minúsculas)
- O remetente não enviou uma mensagem real (o código de emparelhamento só é gerado quando uma mensagem é recebida)

**Solução**:
- Peça ao remetente para enviar outra mensagem para gerar um novo código de emparelhamento
- Certifique-se de que o código de emparelhamento foi copiado corretamente (observe maiúsculas/minúsculas)

### Erro 2: Canal Não Suporta Emparelhamento

**Mensagem de erro**:
```
Channel xxx does not support pairing
```

**Causas possíveis**:
- Erro de ortografia do nome do canal
- O canal não suporta funcionalidade de emparelhamento

**Solução**:
- Execute `clawdbot pairing list` para ver a lista de canais suportados
- Use o nome correto do canal

### Erro 3: Falha na Notificação

**Mensagem de erro**:
```
Failed to notify requester: <error details>
```

**Causas possíveis**:
- Gateway não está em execução
- Conexão do canal foi perdida
- Problema de rede

**Solução**:
- Confirme que o Gateway está em execução
- Verifique o status da conexão do canal: `clawdbot channels status`
- Não use a flag `--notify`, notifique o remetente manualmente

---

## Resumo

Este tutorial apresentou o mecanismo de proteção de emparelhamento de DM do Clawdbot:

- **Segurança padrão**: Todos os canais usam o modo `pairing` por padrão, protegendo seu assistente de IA
- **Processo de emparelhamento**: Remetentes desconhecidos recebem um código de emparelhamento de 8 caracteres, você precisa aprovar via CLI
- **Comandos de gerenciamento**:
  - `clawdbot pairing list <channel>`: Listar solicitações pendentes
  - `clawdbot pairing approve <channel> <code>`: Aprovar emparelhamento
- **Local de armazenamento**: A lista de permissão é armazenada em `~/.clawdbot/credentials/<channel>-allowFrom.json`
- **Expiração automática**: Solicitações de emparelhamento expiram automaticamente após 1 hora

Lembre-se: **o mecanismo de emparelhamento é a base de segurança do Clawdbot**, garantindo que apenas pessoas autorizadas por você possam conversar com o assistente de IA.

---

## Próximo

> Na próxima lição, aprenderemos **[Solução de Problemas: Resolvendo Problemas Comuns](../../faq/troubleshooting/)**.
>
> Você vai aprender:
> - Diagnóstico rápido e verificação de status do sistema
> - Resolver problemas de inicialização do Gateway, conexão de canais, erros de autenticação, etc.
> - Métodos de solução de problemas para falhas de chamadas de ferramentas e otimização de desempenho

---

## Apêndice: Referência do Código-fonte

<details>
<summary><strong>Clique para expandir e ver localizações do código-fonte</strong></summary>

> Última atualização: 2026-01-27

| Funcionalidade | Caminho do Arquivo | Linhas |
|--- | --- | ---|
| Geração de código de emparelhamento (8 caracteres, exclui caracteres confusos) | [`src/pairing/pairing-store.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/pairing/pairing-store.ts#L173-L181) | 173-181 |
| Armazenamento e TTL de solicitações de emparelhamento (1 hora) | [`src/pairing/pairing-store.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/pairing/pairing-store.ts#L11-L14) | 11-14 |
| Comando de aprovação de emparelhamento | [`src/cli/pairing-cli.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/pairing-cli.ts#L107-L143) | 107-143 |
| Geração de mensagem de código de emparelhamento | [`src/pairing/pairing-messages.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/pairing/pairing-messages.ts#L4-L20) | 4-20 |
| Armazenamento da lista de permissão | [`src/pairing/pairing-store.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/pairing/pairing-store.ts#L457-L461) | 457-461 |
| Lista de canais que suportam `pairing` | [`src/channels/plugins/pairing.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/pairing.ts#L11-L16) | 11-16 |
| Política de DM padrão (pairing) | [`src/config/zod-schema.providers-core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.providers-core.ts#L93) | 93 |

**Constantes-chave**:
- `PAIRING_CODE_LENGTH = 8`: Comprimento do código de emparelhamento
- `PAIRING_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"`: Conjunto de caracteres do código de emparelhamento (exclui 0O1I)
- `PAIRING_PENDING_TTL_MS = 60 * 60 * 1000`: Validade da solicitação de emparelhamento (1 hora)
- `PAIRING_PENDING_MAX = 3`: Número máximo de solicitações pendentes

**Funções-chave**:
- `approveChannelPairingCode()`: Aprovar código de emparelhamento e adicionar à lista de permissão
- `listChannelPairingRequests()`: Listar solicitações de emparelhamento pendentes
- `upsertChannelPairingRequest()`: Criar ou atualizar solicitação de emparelhamento
- `addChannelAllowFromStoreEntry()`: Adicionar remetente à lista de permissão

</details>
