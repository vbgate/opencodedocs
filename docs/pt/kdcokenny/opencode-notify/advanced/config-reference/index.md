---
title: "Referência de Configuração do opencode-notify: Guia Completo de Parâmetros e Diferenças entre Plataformas | Tutorial"
sidebarTitle: "Personalizar Comportamento de Notificações"
subtitle: "Referência de Configuração: Guia Completo de Parâmetros"
description: "Aprenda a referência completa de configuração do opencode-notify, incluindo notificações de subsessões, sons personalizados, horário silencioso e substituição de tipo de terminal. Este tutorial fornece descrições detalhadas dos parâmetros, valores padrão, diferenças entre plataformas e exemplos completos para personalizar o comportamento das notificações e otimizar seu fluxo de trabalho no macOS, Windows e Linux."
tags:
  - "Referência de Configuração"
  - "Configuração Avançada"
prerequisite:
  - "start-quick-start"
order: 70
---

# Referência de Configuração

## O Que Você Vai Aprender

- ✅ Conhecer todos os parâmetros configuráveis e seus significados
- ✅ Personalizar o comportamento das notificações conforme suas necessidades
- ✅ Configurar horário silencioso para evitar interrupções em horários específicos
- ✅ Entender como as diferenças entre plataformas afetam a configuração

## Seu Desafio Atual

A configuração padrão já é suficiente, mas seu fluxo de trabalho pode ser especial:
- Você precisa receber notificações importantes à noite, mas não quer ser interrompido em outros momentos
- Você trabalha com múltiplas sessões em paralelo e quer notificações de todas elas
- Você trabalha no tmux e percebe que a detecção de foco não funciona como esperado
- Você quer saber exatamente o que cada opção de configuração faz

## Quando Usar Esta Técnica

- **Você precisa personalizar o comportamento das notificações** - A configuração padrão não atende seus hábitos de trabalho
- **Você quer reduzir interrupções** - Configurar horário silencioso ou controle de subsessões
- **Você quer depurar o comportamento do plugin** - Entender o papel de cada opção de configuração
- **Você usa múltiplas plataformas** - Entender como as diferenças entre plataformas afetam a configuração

## Conceito Principal

O arquivo de configuração permite ajustar o comportamento do plugin sem modificar o código, como um "menu de configurações" para o plugin. O arquivo de configuração é um JSON localizado em `~/.config/opencode/kdco-notify.json`.

**Fluxo de Carregamento da Configuração**:

```
Plugin inicia
    ↓
Lê arquivo de configuração do usuário
    ↓
Mescla com configuração padrão (configuração do usuário tem prioridade)
    ↓
Executa com a configuração mesclada
```

::: info Caminho do Arquivo de Configuração
`~/.config/opencode/kdco-notify.json`
:::

## 📋 Descrição dos Parâmetros

### Estrutura Completa da Configuração

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
  "terminal": ""
}
```

### Descrição Detalhada

#### notifyChildSessions

| Parâmetro | Tipo | Valor Padrão | Descrição |
| --- | --- | --- | --- |
| `notifyChildSessions` | boolean | `false` | Se deve notificar subsessões |

**Função**: Controla se notificações são enviadas para subsessões (sub-session).

**O que são subsessões**:
Quando você usa o recurso de múltiplas sessões do OpenCode, as sessões podem ser divididas em sessões pai e subsessões. Subsessões geralmente são tarefas auxiliares iniciadas pela sessão pai, como leitura/escrita de arquivos, requisições de rede, etc.

**Comportamento padrão** (`false`):
- Notifica apenas eventos de conclusão, erro e solicitação de permissão da sessão pai
- Não notifica nenhum evento de subsessões
- Isso evita receber muitas notificações durante tarefas paralelas

**Quando habilitado** (`true`):
- Todas as sessões (pai e subsessões) enviam notificações
- Adequado para cenários onde você precisa acompanhar o progresso de todas as subtarefas

::: tip Configuração Recomendada
Mantenha o padrão `false`, a menos que você realmente precise acompanhar o status de cada subtarefa.
:::

#### Detecção de Foco (macOS)

O plugin detecta automaticamente se o terminal está em primeiro plano. Se o terminal for a janela ativa atual, as notificações são suprimidas para evitar alertas redundantes.

**Como funciona**:
- Usa `osascript` do macOS para detectar o aplicativo em primeiro plano
- Compara o nome do processo do aplicativo em primeiro plano com o nome do processo do seu terminal
- Se o terminal estiver em primeiro plano, não envia notificação
- **Exceção para notificações de perguntas** (suporta fluxo de trabalho com tmux)

::: info Diferenças entre Plataformas
A detecção de foco funciona apenas no macOS. Windows e Linux não suportam este recurso.
:::

#### sounds

| Parâmetro | Tipo | Valor Padrão | Suporte | Descrição |
| --- | --- | --- | --- | --- |
| `sounds.idle` | string | `"Glass"` | ✅ macOS | Som de tarefa concluída |
| `sounds.error` | string | `"Basso"` | ✅ macOS | Som de notificação de erro |
| `sounds.permission` | string | `"Submarine"` | ✅ macOS | Som de solicitação de permissão |
| `sounds.question` | string | não definido | ✅ macOS | Som de pergunta (opcional) |

**Função**: Define diferentes sons do sistema para diferentes tipos de notificação (apenas macOS).

**Lista de Sons Disponíveis**:

| Nome do Som | Característica | Cenário Recomendado |
| --- | --- | --- |
| Glass | Leve, nítido | Tarefa concluída (padrão) |
| Basso | Grave, alerta | Notificação de erro (padrão) |
| Submarine | Lembrete, suave | Solicitação de permissão (padrão) |
| Blow | Forte | Eventos importantes |
| Bottle | Nítido | Subtarefa concluída |
| Frog | Descontraído | Lembretes informais |
| Funk | Rítmico | Múltiplas tarefas concluídas |
| Hero | Grandioso | Marco alcançado |
| Morse | Código Morse | Relacionado a depuração |
| Ping | Nítido | Lembrete leve |
| Pop | Curto | Tarefas rápidas |
| Purr | Suave | Lembrete discreto |
| Sosumi | Único | Eventos especiais |
| Tink | Claro | Pequenas tarefas concluídas |

**Descrição do campo question**:
`sounds.question` é um campo opcional, usado para notificações quando a IA faz perguntas. Se não definido, usa o som de `permission`.

::: tip Dicas de Configuração de Sons
- Use sons leves para indicar sucesso (idle)
- Use sons graves para indicar erros (error)
- Use sons suaves para indicar que precisa de sua atenção (permission, question)
- Diferentes combinações de sons permitem entender a situação sem olhar a notificação
:::

::: warning Diferenças entre Plataformas
A configuração `sounds` funciona apenas no macOS. Windows e Linux usam o som de notificação padrão do sistema, sem possibilidade de personalização.
:::

#### quietHours

| Parâmetro | Tipo | Valor Padrão | Descrição |
| --- | --- | --- | --- |
| `quietHours.enabled` | boolean | `false` | Se o horário silencioso está habilitado |
| `quietHours.start` | string | `"22:00"` | Hora de início do silêncio (formato HH:MM) |
| `quietHours.end` | string | `"08:00"` | Hora de término do silêncio (formato HH:MM) |

**Função**: Suprime o envio de todas as notificações durante o período especificado.

**Comportamento padrão** (`enabled: false`):
- Horário silencioso não habilitado
- Notificações podem ser recebidas a qualquer momento

**Quando habilitado** (`enabled: true`):
- Durante o período de `start` até `end`, nenhuma notificação é enviada
- Suporta período que atravessa a meia-noite (ex: 22:00-08:00)

**Formato de hora**:
- Use formato 24 horas `HH:MM`
- Exemplo: `"22:30"` significa 22h30

**Período que atravessa a meia-noite**:
- Se `start > end` (ex: 22:00-08:00), indica período que atravessa a meia-noite
- Das 22:00 até as 08:00 do dia seguinte está dentro do horário silencioso

::: info Prioridade do Horário Silencioso
O horário silencioso tem a maior prioridade. Mesmo que todas as outras condições sejam atendidas, se estiver no horário silencioso, nenhuma notificação será enviada.
:::

#### terminal

| Parâmetro | Tipo | Valor Padrão | Descrição |
| --- | --- | --- | --- |
| `terminal` | string | não definido | Especificar manualmente o tipo de terminal (substitui detecção automática) |

**Função**: Especifica manualmente o tipo de emulador de terminal que você usa, substituindo a detecção automática do plugin.

**Comportamento padrão** (não definido):
- O plugin usa a biblioteca `detect-terminal` para detectar automaticamente seu terminal
- Suporta mais de 37 emuladores de terminal

**Quando definido**:
- O plugin usa o tipo de terminal especificado
- Usado para detecção de foco e funcionalidade de foco ao clicar (macOS)

**Valores comuns de terminal**:

| Aplicativo de Terminal | Valor de Configuração |
| --- | --- |
| Ghostty | `"ghostty"` |
| Kitty | `"kitty"` |
| iTerm2 | `"iterm2"` |
| WezTerm | `"wezterm"` |
| Alacritty | `"alacritty"` |
| Terminal do macOS | `"terminal"` |
| Hyper | `"hyper"` |
| Warp | `"warp"` |
| Terminal integrado do VS Code | `"vscode"` |

::: tip Quando Configurar Manualmente
- A detecção automática falha e a detecção de foco não funciona
- Você usa múltiplos terminais e precisa especificar um específico
- O nome do seu terminal não está na lista comum
:::

## Resumo das Diferenças entre Plataformas

Diferentes plataformas têm diferentes níveis de suporte para as opções de configuração:

| Parâmetro | macOS | Windows | Linux |
| --- | --- | --- | --- |
| `notifyChildSessions` | ✅ | ✅ | ✅ |
| Detecção de foco (hardcoded) | ✅ | ❌ | ❌ |
| `sounds.*` | ✅ | ❌ | ❌ |
| `quietHours.*` | ✅ | ✅ | ✅ |
| `terminal` | ✅ | ✅ | ✅ |

::: warning Atenção Usuários Windows/Linux
A configuração `sounds` e a detecção de foco não funcionam no Windows e Linux.
- Windows/Linux usam o som de notificação padrão do sistema
- Windows/Linux não suportam detecção de foco (não pode ser controlado via configuração)
:::

## Exemplos de Configuração

### Configuração Básica (Recomendada)

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

Esta configuração é adequada para a maioria dos usuários:
- Notifica apenas sessões pai, evitando ruído de subtarefas
- No macOS, notificações são automaticamente suprimidas quando o terminal está em primeiro plano (sem necessidade de configuração)
- Usa a combinação padrão de sons
- Horário silencioso não habilitado

### Habilitar Horário Silencioso

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  },
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

Adequado para usuários que não querem ser interrompidos à noite:
- Das 22h às 8h nenhuma notificação é enviada
- Notificações normais em outros horários

### Acompanhar Todas as Subtarefas

```json
{
  "notifyChildSessions": true,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine",
    "question": "Ping"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

Adequado para usuários que precisam acompanhar o progresso de todas as tarefas:
- Todas as sessões (pai e subsessões) enviam notificações
- Som independente para perguntas (Ping)

### Especificar Terminal Manualmente

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  },
  "terminal": "ghostty"
}
```

Adequado para usuários com falha na detecção automática ou que usam múltiplos terminais:
- Especifica manualmente o uso do terminal Ghostty
- Garante que a detecção de foco e o foco ao clicar funcionem corretamente

### Configuração Mínima para Windows/Linux

```json
{
  "notifyChildSessions": false,
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

Adequado para usuários Windows/Linux (configuração simplificada):
- Mantém apenas as opções de configuração suportadas pela plataforma
- A configuração `sounds` e a detecção de foco não funcionam no Windows/Linux, não é necessário configurar

## Gerenciamento do Arquivo de Configuração

### Criar Arquivo de Configuração

**macOS/Linux**:

```bash
# Criar diretório de configuração (se não existir)
mkdir -p ~/.config/opencode

# Criar arquivo de configuração
nano ~/.config/opencode/kdco-notify.json
```

**Windows (PowerShell)**:

```powershell
# Criar diretório de configuração (se não existir)
New-Item -ItemType Directory -Path "$env:APPDATA\opencode" -Force

# Criar arquivo de configuração
notepad "$env:APPDATA\opencode\kdco-notify.json"
```

### Verificar Arquivo de Configuração

**Verificar se o arquivo existe**:

```bash
# macOS/Linux
cat ~/.config/opencode/kdco-notify.json

# Windows PowerShell
Get-Content "$env:APPDATA\opencode\kdco-notify.json"
```

**Verificar se a configuração está em vigor**:

1. Modificar o arquivo de configuração
2. Reiniciar o OpenCode (ou acionar recarregamento da configuração)
3. Observar se o comportamento das notificações corresponde ao esperado

### Tratamento de Erros no Arquivo de Configuração

Se o arquivo de configuração tiver formato incorreto:
- O plugin ignora o arquivo de configuração com erro
- Continua executando com a configuração padrão
- Exibe mensagem de aviso nos logs do OpenCode

**Erros JSON comuns**:

| Tipo de Erro | Exemplo | Como Corrigir |
| --- | --- | --- |
| Vírgula faltando | `"key1": "value1" "key2": "value2"` | Adicionar vírgula: `"key1": "value1",` |
| Vírgula extra | `"key1": "value1",}` | Remover última vírgula: `"key1": "value1"}` |
| Aspas não fechadas | `"key": value` | Adicionar aspas: `"key": "value"` |
| Usando aspas simples | `'key': 'value'` | Usar aspas duplas: `"key": "value"` |
| Erro de sintaxe de comentário | `{"key": "value" /* comment */}` | JSON não suporta comentários, remover comentário |

::: tip Use Ferramentas de Validação JSON
Você pode usar ferramentas online de validação JSON (como jsonlint.com) para verificar se o formato do arquivo de configuração está correto.
:::

## Resumo da Lição

Esta lição forneceu a referência completa de configuração do opencode-notify:

**Parâmetros principais**:

| Parâmetro | Função | Valor Padrão | Suporte |
| --- | --- | --- | --- |
| `notifyChildSessions` | Controle de notificação de subsessões | `false` | Todas as plataformas |
| Detecção de foco | Supressão quando terminal focado (hardcoded) | Sem configuração | Apenas macOS |
| `sounds.*` | Sons personalizados | Ver cada campo | Apenas macOS |
| `quietHours.*` | Configuração de horário silencioso | Ver cada campo | Todas as plataformas |
| `terminal` | Especificar terminal manualmente | não definido | Todas as plataformas |

**Princípios de configuração**:
- **Maioria dos usuários**: Use a configuração padrão
- **Precisa de silêncio**: Habilite `quietHours`
- **Precisa acompanhar subtarefas**: Habilite `notifyChildSessions`
- **Usuários macOS**: Podem personalizar `sounds`, aproveitam detecção automática de foco
- **Usuários Windows/Linux**: Menos opções de configuração, foque em `notifyChildSessions` e `quietHours`

**Caminho do arquivo de configuração**: `~/.config/opencode/kdco-notify.json`

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos sobre **[Horário Silencioso em Detalhes](../quiet-hours/)**.
>
> Você vai aprender:
> - Como o horário silencioso funciona em detalhes
> - Como configurar períodos que atravessam a meia-noite
> - Prioridade do horário silencioso em relação a outras configurações
> - Problemas comuns e soluções

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização no código-fonte</strong></summary>

> Data de atualização: 2026-01-27

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Definição da interface de configuração | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L30-L48) | 30-48 |
| Configuração padrão | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |
| Carregamento do arquivo de configuração | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L91-L114) | 91-114 |
| Verificação de subsessão | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L256-L259) | 256-259 |
| Verificação de foco do terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L265) | 265 |
| Verificação de horário silencioso | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L262) | 262 |
| Uso da configuração de sons | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L236) | 227-236 |
| Exemplo de configuração no README | [`README.md`](https://github.com/kdcokenny/opencode-notify/blob/main/README.md#L68-L79) | 68-79 |

**Interface de Configuração** (NotifyConfig):

```typescript
interface NotifyConfig {
  /** Notify for child/sub-session events (default: false) */
  notifyChildSessions: boolean
  /** Sound configuration per event type */
  sounds: {
    idle: string
    error: string
    permission: string
    question?: string
  }
  /** Quiet hours configuration */
  quietHours: {
    enabled: boolean
    start: string // "HH:MM" format
    end: string // "HH:MM" format
  }
  /** Override terminal detection (optional) */
  terminal?: string
}
```

**Nota**: A interface de configuração **não possui** o campo `suppressWhenFocused`. A detecção de foco é um comportamento hardcoded da plataforma macOS, os usuários não podem controlá-lo através do arquivo de configuração.

**Configuração Padrão** (DEFAULT_CONFIG):

```typescript
const DEFAULT_CONFIG: NotifyConfig = {
  notifyChildSessions: false,
  sounds: {
    idle: "Glass",      // Som de tarefa concluída
    error: "Basso",     // Som de erro
    permission: "Submarine",  // Som de solicitação de permissão
  },
  quietHours: {
    enabled: false,     // Horário silencioso desabilitado por padrão
    start: "22:00",    // 22h
    end: "08:00",      // 8h
  },
}
```

**Função de Carregamento de Configuração** (loadConfig):

- Caminho: `~/.config/opencode/kdco-notify.json`
- Usa `fs.readFile()` para ler o arquivo de configuração
- Mescla com `DEFAULT_CONFIG` (configuração do usuário tem prioridade)
- Objetos aninhados (`sounds`, `quietHours`) também são mesclados
- Se o arquivo de configuração não existir ou tiver formato incorreto, usa a configuração padrão

**Verificação de Subsessão** (isParentSession):

- Verifica se `sessionID` contém `/` (identificador de subsessão)
- Se `notifyChildSessions` for `false`, pula notificações de subsessões
- Notificações de solicitação de permissão (`permission.updated`) são sempre enviadas, não afetadas por esta restrição

**Verificação de Foco do Terminal** (isTerminalFocused):

- Usa `osascript` para obter o nome do processo do aplicativo em primeiro plano
- Compara com o `processName` do terminal (não diferencia maiúsculas/minúsculas)
- Habilitado apenas na plataforma macOS, **não pode ser desabilitado via configuração**
- Notificações de perguntas (`question`) não fazem verificação de foco (suporta fluxo de trabalho com tmux)

**Verificação de Horário Silencioso** (isQuietHours):

- Converte a hora atual em minutos (a partir da meia-noite)
- Compara com `start` e `end` configurados
- Suporta período que atravessa a meia-noite (ex: 22:00-08:00)
- Se `start > end`, indica período que atravessa a meia-noite

**Uso da Configuração de Sons** (sendNotification):

- Lê o nome do som do evento correspondente da configuração
- Passa para a opção `sound` do `node-notifier`
- Funciona apenas na plataforma macOS
- Se o evento `question` não tiver som configurado, usa o som de `permission`

</details>
