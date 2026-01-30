---
title: "Guia para Linux: Notificações notify-send e Detecção de Terminal | Tutorial opencode-notify"
sidebarTitle: "Notificações no Linux"
subtitle: "Recursos da Plataforma Linux: Notificações notify-send e Detecção de Terminal"
description: "Aprenda os recursos e limitações do opencode-notify na plataforma Linux. Domine as notificações nativas do Linux e a detecção de terminal, entenda as diferenças em relação ao macOS/Windows, configure estratégias de notificação adequadas para Linux e resolva problemas comuns de instalação do notify-send e exibição de notificações."
tags:
  - "Linux"
  - "Recursos da Plataforma"
  - "Detecção de Terminal"
prerequisite:
  - "start-quick-start"
order: 50
---

# Recursos da Plataforma Linux: Notificações notify-send e Detecção de Terminal

## O Que Você Vai Aprender

- Conhecer os recursos suportados pelo opencode-notify na plataforma Linux
- Dominar o funcionamento das notificações nativas e detecção de terminal no Linux
- Entender as diferenças em relação às plataformas macOS/Windows
- Configurar estratégias de notificação adequadas para Linux

## Seu Problema Atual

Você está usando o OpenCode no Linux e percebe que alguns recursos não são tão inteligentes quanto no macOS. As notificações ainda aparecem quando o terminal está em foco, e clicar na notificação não leva você de volta à janela do terminal. Isso é normal? Quais são as limitações da plataforma Linux?

## Quando Usar Este Recurso

**Entenda os recursos da plataforma Linux nos seguintes cenários**:
- Você está usando o opencode-notify em um sistema Linux
- Você percebe que alguns recursos do macOS não estão disponíveis no Linux
- Você quer saber como maximizar o uso dos recursos disponíveis no Linux

## Conceito Principal

O opencode-notify oferece **capacidade básica de notificação** na plataforma Linux, mas com algumas limitações em comparação ao macOS. Isso é determinado pelas características do sistema operacional, não é um problema do plugin.

::: info Por que o macOS tem mais recursos?

O macOS oferece APIs de sistema mais poderosas:
- NSUserNotificationCenter suporta foco ao clicar
- AppleScript pode detectar o aplicativo em primeiro plano
- A API de sons do sistema permite sons personalizados

As APIs de notificação do sistema no Linux e Windows são relativamente básicas. O opencode-notify usa `node-notifier` nessas plataformas para chamar as notificações nativas do sistema.
:::

## Visão Geral dos Recursos no Linux

| Recurso | Linux | Descrição |
| --- | --- | --- |
| **Notificações Nativas** | ✅ Suportado | Envia notificações via notify-send |
| **Detecção de Terminal** | ✅ Suportado | Reconhece automaticamente mais de 37 emuladores de terminal |
| **Detecção de Foco** | ❌ Não suportado | Não consegue detectar se o terminal está em primeiro plano |
| **Foco ao Clicar** | ❌ Não suportado | Clicar na notificação não alterna para o terminal |
| **Sons Personalizados** | ❌ Não suportado | Usa o som de notificação padrão do sistema |

### Mecanismo de Notificação no Linux

O opencode-notify usa o comando **notify-send** para enviar notificações do sistema no Linux, chamando a API nativa do sistema através da biblioteca `node-notifier`.

**Quando as notificações são acionadas**:
- Quando uma tarefa de IA é concluída (session.idle)
- Quando ocorre um erro na execução da IA (session.error)
- Quando a IA precisa de permissão (permission.updated)
- Quando a IA faz uma pergunta (tool.execute.before)

::: tip Características das notificações notify-send
- As notificações aparecem no canto superior direito da tela (GNOME/Ubuntu)
- Desaparecem automaticamente (cerca de 5 segundos)
- Usam o som de notificação padrão do sistema
- Clicar na notificação abre o centro de notificações (não alterna para o terminal)
:::

## Detecção de Terminal

### Reconhecimento Automático de Terminal

O opencode-notify usa a biblioteca `detect-terminal` para detectar automaticamente o emulador de terminal que você está usando.

**Terminais suportados no Linux**:
- gnome-terminal (padrão do desktop GNOME)
- konsole (desktop KDE)
- xterm
- lxterminal (desktop LXDE)
- alacritty
- kitty
- terminator
- guake
- tilix
- hyper
- Terminal integrado do VS Code
- E mais de 37 outros emuladores de terminal

::: details Como funciona a detecção de terminal

Quando o plugin inicia, `detect-terminal()` escaneia os processos do sistema para identificar o tipo de terminal atual.

Localização no código-fonte: `src/notify.ts:145-164`

A função `detectTerminalInfo()`:
1. Lê o campo `terminal` da configuração (se especificado manualmente)
2. Chama `detectTerminal()` para detectar automaticamente o tipo de terminal
3. Obtém o nome do processo (usado para detecção de foco no macOS)
4. No macOS, obtém o bundle ID (usado para foco ao clicar)

Na plataforma Linux, `bundleId` e `processName` serão `null`, pois o Linux não precisa dessas informações.
:::

### Especificação Manual do Terminal

Se a detecção automática falhar, você pode especificar manualmente o tipo de terminal no arquivo de configuração.

**Exemplo de configuração**:

```json
{
  "terminal": "gnome-terminal"
}
```

**Nomes de terminais disponíveis**: consulte a [lista de terminais suportados pelo `detect-terminal`](https://github.com/jonschlinkert/detect-terminal#supported-terminals).

## Comparação de Recursos entre Plataformas

| Recurso | macOS | Windows | Linux |
| --- | --- | --- | --- |
| **Notificações Nativas** | ✅ Notification Center | ✅ Toast | ✅ notify-send |
| **Sons Personalizados** | ✅ Lista de sons do sistema | ❌ Padrão do sistema | ❌ Padrão do sistema |
| **Detecção de Foco** | ✅ API AppleScript | ❌ Não suportado | ❌ Não suportado |
| **Foco ao Clicar** | ✅ activate bundleId | ❌ Não suportado | ❌ Não suportado |
| **Detecção de Terminal** | ✅ 37+ terminais | ✅ 37+ terminais | ✅ 37+ terminais |

### Por que o Linux não suporta detecção de foco?

No código-fonte, a função `isTerminalFocused()` retorna `false` diretamente no Linux:

```typescript
// src/notify.ts:166-168
async function isTerminalFocused(terminalInfo: TerminalInfo): Promise<boolean> {
	if (!terminalInfo.processName) return false
	if (process.platform !== "darwin") return false  // ← Windows/Linux retorna false diretamente
	// ... lógica de detecção de foco do macOS
}
```

**Motivos**:
- Os ambientes de desktop Linux são diversos (GNOME, KDE, XFCE, etc.), não há uma API unificada para consultar o aplicativo em primeiro plano
- O DBus do Linux pode obter a janela ativa, mas a implementação é complexa e depende do ambiente de desktop
- A versão atual prioriza a estabilidade e ainda não implementou a detecção de foco no Linux

### Por que o Linux não suporta foco ao clicar?

No código-fonte, a função `sendNotification()` só define a opção `activate` no macOS:

```typescript
// src/notify.ts:238-240
// macOS-specific: click notification to focus terminal
if (process.platform === "darwin" && terminalInfo.bundleId) {
	notifyOptions.activate = terminalInfo.bundleId
}
```

**Motivos**:
- notify-send não suporta o parâmetro `activate`
- As notificações do Linux só podem ser associadas por ID de aplicativo, não é possível especificar dinamicamente a janela de destino
- Clicar na notificação abre o centro de notificações, não foca em uma janela específica

### Por que o Linux não suporta sons personalizados?

::: details Como funciona a configuração de sons

No macOS, `sendNotification()` passa o parâmetro `sound` para a notificação do sistema:

```typescript
// src/notify.ts:227-243
function sendNotification(options: NotificationOptions): void {
	const { title, message, sound, terminalInfo } = options
	
	const notifyOptions: Record<string, unknown> = {
		title,
		message,
		sound,  // ← macOS aceita este parâmetro
	}
	
	// macOS-specific: click notification to focus terminal
	if (process.platform === "darwin" && terminalInfo.bundleId) {
		notifyOptions.activate = terminalInfo.bundleId
	}
	
	notifier.notify(notifyOptions)
}
```

O notify-send do Linux não suporta parâmetros de som personalizados, portanto a configuração `sounds` não tem efeito no Linux.
:::

## Melhores Práticas para Linux

### Recomendações de Configuração

Como o Linux não suporta detecção de foco, é recomendável ajustar a configuração para reduzir o ruído das notificações.

**Configuração recomendada**:

```json
{
  "notifyChildSessions": false,
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

**Explicação da configuração**:
- `notifyChildSessions: false` - Notifica apenas a sessão pai, evitando ruído de subtarefas
- `quietHours.enabled: true` - Ativa o horário silencioso para evitar interrupções noturnas

### Opções de Configuração Não Suportadas

As seguintes opções de configuração não têm efeito no Linux:

| Opção | Efeito no macOS | Efeito no Linux |
| --- | --- | --- |
| `sounds.idle` | Reproduz som Glass | Usa som padrão do sistema |
| `sounds.error` | Reproduz som Basso | Usa som padrão do sistema |
| `sounds.permission` | Reproduz som Submarine | Usa som padrão do sistema |

### Dicas de Uso

**Dica 1: Desativar notificações manualmente**

Se você está olhando para o terminal e não quer ser interrompido:

1. Clique no ícone de notificações no canto superior direito da tela
2. Desative as notificações do opencode-notify

**Dica 2: Usar horário silencioso**

Configure horários de trabalho e descanso para evitar interrupções fora do horário de trabalho:

```json
{
  "quietHours": {
    "enabled": true,
    "start": "18:00",
    "end": "09:00"
  }
}
```

**Dica 3: Desativar temporariamente o plugin**

Se precisar desativar completamente as notificações, é recomendável usar a configuração `quietHours` para definir silêncio o dia todo, ou excluir/renomear o arquivo de configuração para desativar o plugin.

**Dica 4: Configurar som de notificação do sistema**

Embora o opencode-notify não suporte sons personalizados, você pode alterar o som de notificação padrão nas configurações do sistema:

- **GNOME**: Configurações → Som → Som de alerta
- **KDE**: Configurações do Sistema → Notificações → Som padrão
- **XFCE**: Configurações → Aparência → Notificações → Som

## Passo a Passo

### Verificar Notificações no Linux

**Passo 1: Acionar uma notificação de teste**

No OpenCode, digite uma tarefa simples:

```
Por favor, calcule o resultado de 1+1.
```

**Você deve ver**:
- Uma notificação notify-send aparece no canto superior direito da tela (GNOME/Ubuntu)
- O título da notificação é "Ready for review"
- O som de notificação padrão do sistema é reproduzido

**Passo 2: Testar supressão de foco (verificar que não é suportado)**

Mantenha a janela do terminal em primeiro plano e acione outra tarefa.

**Você deve ver**:
- A notificação ainda aparece (porque o Linux não suporta detecção de foco)

**Passo 3: Testar clique na notificação**

Clique na notificação que apareceu.

**Você deve ver**:
- O centro de notificações se expande, em vez de alternar para a janela do terminal

### Configurar Horário Silencioso

**Passo 1: Criar arquivo de configuração**

Edite o arquivo de configuração (bash):

```bash
nano ~/.config/opencode/kdco-notify.json
```

**Passo 2: Adicionar configuração de horário silencioso**

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

**Passo 3: Salvar e testar**

Aguarde até que o horário atual entre no período silencioso e acione uma tarefa.

**Você deve ver**:
- Nenhuma notificação aparece (horário silencioso em vigor)

## Checklist ✅

Após concluir os passos acima, confirme:

- [ ] As notificações notify-send são exibidas normalmente
- [ ] As notificações mostram o título correto da tarefa
- [ ] A configuração de horário silencioso está funcionando
- [ ] Você entende os recursos não suportados na plataforma Linux

## Problemas Comuns

### Problema 1: Notificações não aparecem

**Causa 1**: notify-send não está instalado

**Solução**:

```bash
# Ubuntu/Debian
sudo apt install libnotify-bin

# Fedora/RHEL
sudo dnf install libnotify

# Arch Linux
sudo pacman -S libnotify
```

**Causa 2**: Permissão de notificação do Linux não concedida

**Solução**:

1. Abra as configurações do sistema
2. Encontre "Notificações" ou "Privacidade" → "Notificações"
3. Certifique-se de que "Permitir que aplicativos enviem notificações" está ativado
4. Encontre o OpenCode e certifique-se de que a permissão de notificação está ativada

### Problema 2: Falha na detecção de terminal

**Causa**: `detect-terminal` não consegue reconhecer seu terminal

**Solução**:

Especifique manualmente o tipo de terminal no arquivo de configuração:

```json
{
  "terminal": "gnome-terminal"
}
```

### Problema 3: Sons personalizados não funcionam

**Causa**: A plataforma Linux não suporta sons personalizados

**Explicação**: Isso é normal. O notify-send usa o som padrão do sistema, que não pode ser alterado através do arquivo de configuração.

**Solução**: Altere o som de notificação padrão nas configurações do sistema.

### Problema 4: Clicar na notificação não foca no terminal

**Causa**: notify-send não suporta o parâmetro `activate`

**Explicação**: Esta é uma limitação da API do Linux. Clicar na notificação abre o centro de notificações; você precisa alternar manualmente para a janela do terminal.

### Problema 5: Comportamento diferente das notificações em diferentes ambientes de desktop

**Sintoma**: Em diferentes ambientes de desktop (GNOME, KDE, XFCE), a posição e o comportamento das notificações podem variar.

**Explicação**: Isso é normal, cada ambiente de desktop tem sua própria implementação do sistema de notificações.

**Solução**: Ajuste o comportamento das notificações nas configurações do sistema de acordo com o ambiente de desktop que você está usando.

## Resumo da Lição

Nesta lição, aprendemos:

- ✅ A plataforma Linux suporta notificações nativas e detecção de terminal
- ✅ O Linux não suporta detecção de foco e foco ao clicar
- ✅ O Linux não suporta sons personalizados
- ✅ Configuração recomendada (horário silencioso, notificar apenas sessão pai)
- ✅ Soluções para problemas comuns

**Pontos-chave**:
1. Os recursos da plataforma Linux são relativamente básicos, mas a capacidade principal de notificação está completa
2. Detecção de foco e foco ao clicar são recursos exclusivos do macOS
3. A configuração de horário silencioso pode reduzir o ruído das notificações
4. A detecção de terminal suporta especificação manual, melhorando a compatibilidade
5. O notify-send precisa ser instalado previamente (algumas distribuições já incluem por padrão)

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos sobre **[Terminais Suportados](../terminals/)**.
>
> Você vai aprender:
> - Lista de mais de 37 terminais suportados pelo opencode-notify
> - Mecanismos de detecção para diferentes terminais
> - Método de configuração para substituir o tipo de terminal
> - Dicas de uso do terminal integrado do VS Code

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização no código-fonte</strong></summary>

> Atualizado em: 2026-01-27

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Verificação de limitação da plataforma Linux (osascript) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L121-L133) | 121-133 |
| Verificação de limitação da plataforma Linux (detecção de foco) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| Específico do macOS: foco ao clicar | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L238-L240) | 238-240 |
| Envio de notificação (multiplataforma) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L243) | 227-243 |
| Detecção de terminal (multiplataforma) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| Carregamento de configuração (multiplataforma) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |

**Funções principais**:
- `runOsascript()`: Executa apenas no macOS, retorna null no Linux
- `isTerminalFocused()`: Retorna false diretamente no Linux
- `sendNotification()`: Define o parâmetro `activate` apenas no macOS
- `detectTerminalInfo()`: Detecção de terminal multiplataforma

**Verificação de plataforma**:
- `process.platform === "darwin"`: macOS
- `process.platform === "win32"`: Windows
- `process.platform === "linux"`: Linux

**Dependências de notificação no Linux**:
- Dependência externa: `node-notifier` → comando `notify-send`
- Requisito do sistema: libnotify-bin ou pacote equivalente

</details>
