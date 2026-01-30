---
title: "Guia do Windows: Notificações Nativas, Detecção de Terminal e Configuração | Tutorial opencode-notify"
sidebarTitle: "Notificações no Windows"
subtitle: "Recursos do Windows: Notificações Nativas e Detecção de Terminal"
description: "Aprenda os recursos e limitações do opencode-notify na plataforma Windows. Domine as notificações nativas e a detecção de terminal, entenda as diferenças funcionais com o macOS, configure a melhor estratégia de notificações para melhorar a eficiência, evite interrupções e mantenha o estado de trabalho focado."
tags:
  - "Windows"
  - "Recursos da Plataforma"
  - "Detecção de Terminal"
prerequisite:
  - "start-quick-start"
order: 40
---

# Recursos do Windows: Notificações Nativas e Detecção de Terminal

## O Que Você Vai Aprender

- Entender os recursos do opencode-notify na plataforma Windows
- Dominar como funciona a detecção de terminal no Windows
- Compreender as diferenças funcionais com o macOS
- Configurar a melhor estratégia de notificações para o Windows

## Seu Problema Atual

Você está usando o OpenCode no Windows e percebe que certos recursos não são tão inteligentes quanto no macOS. As notificações ainda aparecem quando o terminal está focado, e clicar nelas não retorna à janela do terminal. Isso é normal? Quais são as limitações da plataforma Windows?

## Quando Usar

**Entenda os recursos da plataforma Windows nos seguintes cenários**:
- Você está usando o opencode-notify no sistema Windows
- Você descobriu que certos recursos do macOS não estão disponíveis no Windows
- Você quer saber como maximizar o uso dos recursos disponíveis no Windows

## Ideia Central

O opencode-notify oferece **capacidades básicas de notificação** na plataforma Windows, mas tem algumas limitações funcionais em comparação com o macOS. Isso é determinado pelas características do sistema operacional, não é um problema do plugin.

::: info Por que o macOS tem mais recursos?

O macOS fornece APIs de sistema mais poderosas:
- NSUserNotificationCenter suporta foco ao clicar
- AppleScript pode detectar o aplicativo em primeiro plano
- APIs de sons do sistema permitem sons personalizados

As APIs de notificação do Windows e Linux são relativamente básicas. O opencode-notify chama notificações nativas do sistema através da biblioteca `node-notifier` nessas plataformas.
:::

## Visão Geral dos Recursos do Windows

| Recurso | Windows | Descrição |
|--- | --- | ---|
| **Notificações nativas** | ✅ Suporta | Envia notificações via Windows Toast |
| **Detecção de terminal** | ✅ Suporta | Identifica automaticamente 37+ emuladores de terminal |
| **Detecção de foco** | ❌ Não suporta | Não consegue detectar se o terminal é a janela em primeiro plano |
| **Foco ao clicar** | ❌ Não suporta | Clicar na notificação não alterna para o terminal |
| **Sons personalizados** | ❌ Não suporta | Usa o som de notificação padrão do sistema |

### Mecanismo de Notificação do Windows

O opencode-notify usa notificações **Windows Toast** no Windows, chamando a API nativa do sistema através da biblioteca `node-notifier`.

**Momentos de disparo da notificação**:
- Quando a tarefa da IA é concluída (session.idle)
- Quando a IA encontra um erro (session.error)
- Quando a IA precisa de permissão (permission.updated)
- Quando a IA faz uma pergunta (tool.execute.before)

::: tip Características das Notificações Windows Toast
- As notificações aparecem no canto inferior direito da tela
- Desaparecem automaticamente (aproximadamente 5 segundos)
- Usam o som de notificação padrão do sistema
- Clicar na notificação abre o centro de notificações (não alterna para o terminal)
:::

## Detecção de Terminal

### Identificação Automática de Terminal

O opencode-notify usa a biblioteca `detect-terminal` para detectar automaticamente o emulador de terminal que você está usando.

**Terminais suportados no Windows**:
- Windows Terminal (recomendado)
- Git Bash
- ConEmu
- Cmder
- PowerShell
- Terminal integrado do VS Code

::: details Princípio da Detecção de Terminal
Ao iniciar o plugin, `detect-terminal()` escaneia os processos do sistema para identificar o tipo de terminal atual.

Localização do código-fonte: `src/notify.ts:145-147`

```typescript
async function detectTerminalInfo(config: NotifyConfig): Promise<TerminalInfo> {
	const terminalName = config.terminal || detectTerminal() || null
	
	if (!terminalName) {
		return { name: null, bundleId: null, processName: null }
	}
	
	return {
		name: terminalName,
		bundleId: null,  // Windows não precisa de bundleId
		processName: null,  // Windows não precisa de nome de processo
	}
}
```
:::

### Especificação Manual do Terminal

Se a detecção automática falhar, você pode especificar manualmente o tipo de terminal no arquivo de configuração.

**Exemplo de configuração**:

```json
{
  "terminal": "Windows Terminal"
}
```

**Nomes de terminal disponíveis**: consulte a [`lista de terminais suportados pelo detect-terminal`](https://github.com/jonschlinkert/detect-terminal#supported-terminals).

## Comparação de Recursos por Plataforma

| Recurso | macOS | Windows | Linux |
|--- | --- | --- | ---|
| **Notificações nativas** | ✅ Centro de Notificações | ✅ Toast | ✅ notify-send |
| **Sons personalizados** | ✅ Lista de sons do sistema | ❌ Padrão do sistema | ❌ Padrão do sistema |
| **Detecção de foco** | ✅ AppleScript API | ❌ Não suporta | ❌ Não suporta |
| **Foco ao clicar** | ✅ activate bundleId | ❌ Não suporta | ❌ Não suporta |
| **Detecção de terminal** | ✅ 37+ terminais | ✅ 37+ terminais | ✅ 37+ terminais |

### Por que o Windows não suporta detecção de foco?

No código-fonte, a função `isTerminalFocused()` retorna diretamente `false` no Windows:

```typescript
// src/notify.ts:166-168
async function isTerminalFocused(terminalInfo: TerminalInfo): Promise<boolean> {
	if (!terminalInfo.processName) return false
	if (process.platform !== "darwin") return false  // ← Windows/Linux retorna false diretamente
	// ... lógica de detecção de foco do macOS
}
```

**Razão**:
- O Windows não fornece uma API de consulta de aplicativo em primeiro plano semelhante ao AppleScript do macOS
- O Windows PowerShell pode obter a janela em primeiro plano, mas precisa chamar interfaces COM, o que é complexo de implementar
- A versão atual prioriza a estabilidade e ainda não implementou a detecção de foco no Windows

### Por que o Windows não suporta foco ao clicar?

No código-fonte, a função `sendNotification()` só define a opção `activate` no macOS:

```typescript
// src/notify.ts:238-240
// macOS-specific: click notification to focus terminal
if (process.platform === "darwin" && terminalInfo.bundleId) {
	notifyOptions.activate = terminalInfo.bundleId
}
```

**Razão**:
- O Windows Toast não suporta o parâmetro `activate`
- As notificações do Windows só podem ser associadas por ID de aplicativo, não é possível especificar dinamicamente a janela de destino
- Clicar na notificação abre o centro de notificações, em vez de focar em uma janela específica

## Melhores Práticas para a Plataforma Windows

### Recomendações de Configuração

Como o Windows não suporta detecção de foco, recomenda-se ajustar a configuração para reduzir o ruído das notificações.

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
- `notifyChildSessions: false` - Notifica apenas sessões principais, evitando ruído de subtarefas
- `quietHours.enabled: true` - Ativa o período de silêncio para evitar interrupções noturnas

### Opções de Configuração Não Suportadas

As seguintes opções de configuração não têm efeito no Windows:

| Opção | Efeito no macOS | Efeito no Windows |
|--- | --- | ---|
| `sounds.idle` | Reproduz som Glass | Usa o som padrão do sistema |
| `sounds.error` | Reproduz som Basso | Usa o som padrão do sistema |
| `sounds.permission` | Reproduz som Submarine | Usa o som padrão do sistema |

### Dicas de Uso

**Dica 1: Desativar notificações manualmente**

Se você está visualizando o terminal e não quer ser interrompido:

1. Clique no ícone do "Centro de Ações" na barra de tarefas (Windows + A)
2. Desative as notificações do opencode-notify

**Dica 2: Usar período de silêncio**

Defina horários de trabalho e descanso para evitar interrupções fora do horário de trabalho:

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

Se você precisa desativar completamente as notificações, pode excluir o arquivo de configuração ou definir o período de silêncio para o dia todo:

```json
{
  "quietHours": {
    "enabled": true,
    "start": "00:00",
    "end": "23:59"
  }
}
```

## Prática Guiada

### Verificar Notificações do Windows

**Passo 1: Acionar notificação de teste**

No OpenCode, digite uma tarefa simples:

```
Por favor, calcule o resultado de 1+1.
```

**O que você deve ver**:
- Notificação Windows Toast no canto inferior direito
- O título da notificação é "Ready for review"
- Reproduz o som de notificação padrão do sistema

**Passo 2: Testar supressão de foco (verificar não suportado)**

Mantenha a janela do terminal em primeiro plano e acione a tarefa novamente.

**O que você deve ver**:
- A notificação ainda aparece (porque o Windows não suporta detecção de foco)

**Passo 3: Testar clique na notificação**

Clique na notificação que apareceu.

**O que você deve ver**:
- O centro de notificações se expande, em vez de alternar para a janela do terminal

### Configurar Período de Silêncio

**Passo 1: Criar arquivo de configuração**

Edite o arquivo de configuração (PowerShell):

```powershell
notepad $env:USERPROFILE\.config\opencode\kdco-notify.json
```

**Passo 2: Adicionar configuração de período de silêncio**

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

Aguarde até que o horário atual entre no período de silêncio, em seguida acione uma tarefa.

**O que você deve ver**:
- Nenhuma notificação aparece (período de silêncio em vigor)

## Ponto de Verificação ✅

Após concluir as etapas acima, confirme:

- [ ] As notificações Windows Toast aparecem corretamente
- [ ] As notificações exibem o título correto da tarefa
- [ ] A configuração do período de silêncio está funcionando
- [ ] Você entende os recursos não suportados no Windows

## Aviso sobre Armadilhas Comuns

### Problema Comum 1: Notificações não aparecem

**Causa**: Permissões de notificação do Windows não foram concedidas

**Solução**:

1. Abra "Configurações" → "Sistema" → "Notificações"
2. Certifique-se de que "Obter notificações de aplicativos e outros remetentes" está ativado
3. Encontre o OpenCode e certifique-se de que as permissões de notificação estão ativadas

### Problema Comum 2: Falha na detecção de terminal

**Causa**: `detect-terminal` não consegue reconhecer seu terminal

**Solução**:

Especifique manualmente o tipo de terminal no arquivo de configuração:

```json
{
  "terminal": "Windows Terminal"
}
```

### Problema Comum 3: Sons personalizados não funcionam

**Causa**: A plataforma Windows não suporta sons personalizados

**Explicação**: Isso é normal. As notificações Windows Toast usam o som padrão do sistema e não podem ser alteradas pelo arquivo de configuração.

### Problema Comum 4: Clicar na notificação não foca o terminal

**Causa**: Windows Toast não suporta o parâmetro `activate`

**Explicação**: Esta é uma limitação da API do Windows. Clicar na notificação abre o centro de notificações e você precisa alternar manualmente para a janela do terminal.

## Resumo da Lição

Nesta lição, aprendemos:

- ✅ A plataforma Windows suporta notificações nativas e detecção de terminal
- ✅ O Windows não suporta detecção de foco e foco ao clicar
- ✅ O Windows não suporta sons personalizados
- ✅ Configuração recomendada (período de silêncio, notificar apenas sessões principais)
- ✅ Soluções para problemas comuns

**Pontos-chave**:
1. Os recursos da plataforma Windows são relativamente básicos, mas as capacidades principais de notificação estão completas
2. A detecção de foco e o foco ao clicar são recursos exclusivos do macOS
3. Através da configuração do período de silêncio, é possível reduzir o ruído das notificações
4. A detecção de terminal suporta especificação manual, melhorando a compatibilidade

## Próximo Conteúdo

> Na próxima lição, aprenderemos **[Recursos da Plataforma Linux](../linux/)**.
>
> Você aprenderá:
> - O mecanismo de notificação do Linux (notify-send)
> - Capacidades de detecção de terminal do Linux
> - Comparação de recursos com a plataforma Windows
> - Problemas de compatibilidade entre distribuições Linux

---

## Apêndice: Referência do Código-fonte

<details>
<summary><strong>Clique para expandir e ver localização do código-fonte</strong></summary>

> Última atualização: 2026-01-27

| Recurso | Caminho do arquivo | Linha |
|--- | --- | ---|
| Verificação de limitações da plataforma Windows (osascript) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L121-L133) | 121-133 |
| Verificação de limitações da plataforma Windows (detecção de foco) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| Específico do macOS: foco ao clicar | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L238-L240) | 238-240 |
| Envio de notificação (multiplataforma) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L243) | 227-243 |
| Detecção de terminal (multiplataforma) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| Carregamento de configuração (multiplataforma) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |

**Funções-chave**:
- `runOsascript()`: só é executado no macOS, retorna null no Windows
- `isTerminalFocused()`: retorna false diretamente no Windows
- `sendNotification()`: só define o parâmetro `activate` no macOS
- `detectTerminalInfo()`: detecção de terminal multiplataforma

**Verificação de plataforma**:
- `process.platform === "darwin"`: macOS
- `process.platform === "win32"`: Windows
- `process.platform === "linux"`: Linux

</details>
