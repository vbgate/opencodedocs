---
title: "Exemplo de Arquivo de Configuração: notifyChildSessions e sons | Tutorial opencode-notify"
sidebarTitle: "Arquivo de Configuração Personalizado"
subtitle: "Exemplo de Arquivo de Configuração: notifyChildSessions e sons"
description: "Veja o exemplo completo do arquivo de configuração do opencode-notify, aprenda comentários detalhados, configurações de valores padrão, exemplos de configuração mínima, lista completa de sons disponíveis no macOS e método de desativação do plugin para todos os campos de configuração como notifyChildSessions, sounds, quietHours, terminal, e acesse o changelog para conhecer o histórico de versões e melhorias de novos recursos."
tags:
  - "Configuração"
  - "Exemplo"
  - "Apêndice"
order: 140
---

# Exemplo de Arquivo de Configuração

## Exemplo de Configuração Completa

Salve o seguinte conteúdo em `~/.config/opencode/kdco-notify.json`:

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine",
    "question": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  },
  "terminal": "Ghostty"
}
```

## Descrição dos Campos

### notifyChildSessions

- **Tipo**: boolean
- **Valor Padrão**: `false`
- **Descrição**: Se deve notificar subsessões (subtarefas)

Por padrão, o plugin notifica apenas a sessão pai, evitando ruído de notificações de subtarefas. Se você precisa acompanhar o status de conclusão de todas as subtarefas, defina como `true`.

```json
{
  "notifyChildSessions": false  // Notifica apenas sessão pai (recomendado)
}
```

### sounds

Configuração de sons, funciona apenas na plataforma macOS.

#### sounds.idle

- **Tipo**: string
- **Valor Padrão**: `"Glass"`
- **Descrição**: Som quando a tarefa é concluída

Reproduzido quando a sessão de IA entra em estado ocioso (tarefa concluída).

#### sounds.error

- **Tipo**: string
- **Valor Padrão**: `"Basso"`
- **Descrição**: Som quando ocorre erro

Reproduzido quando a sessão de IA encontra um erro durante a execução.

#### sounds.permission

- **Tipo**: string
- **Valor Padrão**: `"Submarine"`
- **Descrição**: Som para solicitação de permissão

Reproduzido quando a IA precisa de autorização do usuário para executar uma operação.

#### sounds.question

- **Tipo**: string (opcional)
- **Valor Padrão**: não definido (usa o som de permission)
- **Descrição**: Som quando há uma pergunta

Reproduzido quando a IA faz uma pergunta ao usuário. Se não definido, usa o som de `permission`.

### quietHours

Configuração de horário silencioso, evita receber notificações que interrompam durante períodos específicos.

#### quietHours.enabled

- **Tipo**: boolean
- **Valor Padrão**: `false`
- **Descrição**: Se o horário silencioso está habilitado

#### quietHours.start

- **Tipo**: string
- **Valor Padrão**: `"22:00"`
- **Descrição**: Hora de início do silêncio (formato 24 horas, HH:MM)

#### quietHours.end

- **Tipo**: string
- **Valor Padrão**: `"08:00"`
- **Descrição**: Hora de término do silêncio (formato 24 horas, HH:MM)

Suporta períodos que atravessam a meia-noite, por exemplo, `"22:00"` até `"08:00"` significa que não serão enviadas notificações das 22h até as 8h do dia seguinte.

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

### terminal

- **Tipo**: string (opcional)
- **Valor Padrão**: não definido (detecção automática)
- **Descrição**: Especificar manualmente o tipo de terminal, substituindo o resultado da detecção automática

Se a detecção automática falhar ou você precisar especificar manualmente, pode definir como o nome do seu terminal.

```json
{
  "terminal": "Ghostty"  // Ou "iTerm", "Kitty", "WezTerm", etc.
}
```

## Lista de Sons Disponíveis no macOS

A seguir estão os sons de notificação integrados do sistema macOS, que podem ser usados na configuração `sounds`:

- Basso
- Blow
- Bottle
- Frog
- Funk
- Glass
- Hero
- Morse
- Ping
- Pop
- Purr
- Sosumi
- Submarine
- Tink

## Exemplo de Configuração Mínima

Se você deseja modificar apenas algumas configurações, pode incluir apenas os campos que precisa modificar, os outros campos usarão os valores padrão:

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

## Desativar o Plugin

Para desativar temporariamente o plugin, basta excluir o arquivo de configuração, e o plugin voltará à configuração padrão.

## Prévia da Próxima Lição

> Na próxima lição aprenderemos sobre **[Changelog](../changelog/release-notes/)**.
>
> Você vai aprender:
> - Histórico de versões e mudanças importantes
> - Registro de novos recursos e melhorias
