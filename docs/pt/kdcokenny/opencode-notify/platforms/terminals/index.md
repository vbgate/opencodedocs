---
title: "Terminais Suportados: Guia Completo de 37+ Emuladores de Terminal e Detecção Automática | Tutorial opencode-notify"
sidebarTitle: "Seu terminal é suportado?"
subtitle: "Lista de Terminais Suportados: 37+ Emuladores de Terminal"
description: "Conheça os 37+ emuladores de terminal suportados pelo opencode-notify, incluindo a lista completa para macOS, Windows e Linux. Este tutorial explica o mecanismo de detecção automática, configuração manual, resolução de problemas de identificação, otimização de notificações, filtragem inteligente e como manter o foco no trabalho."
tags:
  - "terminal"
  - "detecção de terminal"
  - "suporte a plataformas"
prerequisite:
  - "start-quick-start"
order: 60
---

# Lista de Terminais Suportados: 37+ Emuladores de Terminal

## O que você vai aprender

- Conhecer todos os emuladores de terminal suportados pelo opencode-notify
- Verificar se o seu terminal está na lista de suporte
- Entender como funciona a detecção automática de terminal
- Aprender a especificar manualmente o tipo de terminal

## O problema que você enfrenta

Você instalou o opencode-notify, mas as notificações não funcionam corretamente. Talvez o terminal não seja detectado ou a verificação de foco falhe. Você usa Alacritty / Windows Terminal / tmux e não tem certeza se são suportados. Falhas na detecção do terminal fazem com que a filtragem inteligente não funcione, prejudicando a experiência de uso.

## Quando usar esta solução

**Consulte a lista de terminais suportados nos seguintes cenários**:
- Você quer saber se o seu terminal é suportado
- A detecção automática falhou e você precisa configurar manualmente
- Você alterna entre vários terminais e quer conhecer a compatibilidade
- Você quer entender os detalhes técnicos da detecção de terminal

## Conceito principal

O opencode-notify usa a biblioteca `detect-terminal` para identificar automaticamente o emulador de terminal em uso, **suportando mais de 37 terminais**. Após a detecção bem-sucedida, o plugin pode:
- **Ativar detecção de foco** (apenas macOS): Suprimir notificações quando o terminal está em primeiro plano
- **Suportar foco ao clicar** (apenas macOS): Clicar na notificação alterna para a janela do terminal

::: info Por que a detecção de terminal é importante?

A detecção de terminal é a base da filtragem inteligente:
- **Detecção de foco**: Evita notificações quando você já está olhando para o terminal
- **Foco ao clicar**: Usuários de macOS podem voltar ao terminal clicando na notificação
- **Otimização de desempenho**: Diferentes terminais podem precisar de tratamento especial

Se a detecção falhar, as notificações ainda funcionam, mas a filtragem inteligente será desativada.
:::

## Lista de terminais suportados

### Terminais macOS

| Nome do Terminal | Nome do Processo | Recursos |
| --- | --- | --- |
| **Ghostty** | Ghostty | ✅ Detecção de foco + ✅ Foco ao clicar |
| **iTerm2** | iTerm2 | ✅ Detecção de foco + ✅ Foco ao clicar |
| **Kitty** | kitty | ✅ Detecção de foco + ✅ Foco ao clicar |
| **WezTerm** | WezTerm | ✅ Detecção de foco + ✅ Foco ao clicar |
| **Alacritty** | Alacritty | ✅ Detecção de foco + ✅ Foco ao clicar |
| **Terminal.app** | Terminal | ✅ Detecção de foco + ✅ Foco ao clicar |
| **Hyper** | Hyper | ✅ Detecção de foco + ✅ Foco ao clicar |
| **Warp** | Warp | ✅ Detecção de foco + ✅ Foco ao clicar |
| **Terminal integrado do VS Code** | Code / Code - Insiders | ✅ Detecção de foco + ✅ Foco ao clicar |

::: tip Recursos dos terminais macOS
Os terminais macOS suportam funcionalidade completa:
- Notificações nativas (Notification Center)
- Detecção de foco (via AppleScript)
- Foco automático no terminal ao clicar na notificação
- Sons personalizados do sistema

Todos os terminais usam o macOS Notification Center para enviar notificações.
:::

### Terminais Windows

| Nome do Terminal | Recursos |
| --- | --- |
| **Windows Terminal** | ✅ Notificações nativas (Toast) |
| **Git Bash** | ✅ Notificações nativas (Toast) |
| **ConEmu** | ✅ Notificações nativas (Toast) |
| **Cmder** | ✅ Notificações nativas (Toast) |
| **PowerShell** | ✅ Notificações nativas (Toast) |
| **Terminal integrado do VS Code** | ✅ Notificações nativas (Toast) |
| **Outros terminais Windows** | ✅ Notificações nativas (Toast) |

::: details Limitações dos terminais Windows
A plataforma Windows tem funcionalidade mais básica:
- ✅ Notificações nativas (Windows Toast)
- ✅ Detecção de terminal
- ❌ Detecção de foco (limitação do sistema)
- ❌ Foco ao clicar (limitação do sistema)

Todos os terminais Windows enviam notificações via Windows Toast, usando o som padrão do sistema.
:::

### Terminais Linux

| Nome do Terminal | Recursos |
| --- | --- |
| **konsole** | ✅ Notificações nativas (notify-send) |
| **xterm** | ✅ Notificações nativas (notify-send) |
| **lxterminal** | ✅ Notificações nativas (notify-send) |
| **alacritty** | ✅ Notificações nativas (notify-send) |
| **kitty** | ✅ Notificações nativas (notify-send) |
| **wezterm** | ✅ Notificações nativas (notify-send) |
| **Terminal integrado do VS Code** | ✅ Notificações nativas (notify-send) |
| **Outros terminais Linux** | ✅ Notificações nativas (notify-send) |

::: details Limitações dos terminais Linux
A plataforma Linux tem funcionalidade mais básica:
- ✅ Notificações nativas (notify-send)
- ✅ Detecção de terminal
- ❌ Detecção de foco (limitação do sistema)
- ❌ Foco ao clicar (limitação do sistema)

Todos os terminais Linux enviam notificações via notify-send, usando o som padrão do ambiente de desktop.
:::

### Outros terminais suportados

A biblioteca `detect-terminal` também suporta os seguintes terminais (lista possivelmente incompleta):

**Windows / WSL**:
- Terminal WSL
- Prompt de Comando do Windows (cmd)
- PowerShell (pwsh)
- PowerShell Core (pwsh-preview)
- Cygwin Mintty
- MSYS2 MinTTY

**macOS / Linux**:
- tmux (detectado via variável de ambiente)
- screen
- rxvt-unicode (urxvt)
- rxvt
- Eterm
- eterm
- aterm
- wterm
- sakura
- roxterm
- xfce4-terminal
- pantheon-terminal
- lxterminal
- mate-terminal
- terminator
- tilix
- guake
- yakuake
- qterminal
- terminology
- deepin-terminal
- gnome-terminal
- konsole
- xterm
- uxterm
- eterm

::: tip Contagem de terminais
O opencode-notify suporta **mais de 37 emuladores de terminal** através da biblioteca `detect-terminal`.
Se o seu terminal não está na lista, consulte a [lista completa do detect-terminal](https://github.com/jonschlinkert/detect-terminal#supported-terminals).
:::

## Como funciona a detecção de terminal

### Fluxo de detecção automática

O plugin detecta automaticamente o tipo de terminal ao iniciar:

```
1. Chama a biblioteca detect-terminal()
    ↓
2. Escaneia os processos do sistema para identificar o terminal atual
    ↓
3. Retorna o nome do terminal (ex: "ghostty", "kitty")
    ↓
4. Consulta a tabela de mapeamento para obter o nome do processo macOS
    ↓
5. macOS: Obtém dinamicamente o Bundle ID
    ↓
6. Salva as informações do terminal para uso nas notificações
```

### Tabela de mapeamento de terminais macOS

O código-fonte define um mapeamento de nomes de processo para terminais comuns:

```typescript
// src/notify.ts:71-84
const TERMINAL_PROCESS_NAMES: Record<string, string> = {
    ghostty: "Ghostty",
    kitty: "kitty",
    iterm: "iTerm2",
    iterm2: "iTerm2",
    wezterm: "WezTerm",
    alacritty: "Alacritty",
    terminal: "Terminal",
    apple_terminal: "Terminal",
    hyper: "Hyper",
    warp: "Warp",
    vscode: "Code",
    "vscode-insiders": "Code - Insiders",
}
```

::: details Código-fonte da detecção
Lógica completa de detecção de terminal:

```typescript
// src/notify.ts:145-164
async function detectTerminalInfo(config: NotifyConfig): Promise<TerminalInfo> {
    // Use config override if provided
    const terminalName = config.terminal || detectTerminal() || null
    
    if (!terminalName) {
        return { name: null, bundleId: null, processName: null }
    }
    
    // Get process name for focus detection
    const processName = TERMINAL_PROCESS_NAMES[terminalName.toLowerCase()] || terminalName
    
    // Dynamically get bundle ID from macOS (no hardcoding!)
    const bundleId = await getBundleId(processName)
    
    return {
        name: terminalName,
        bundleId,
        processName,
    }
}
```

:::

### Tratamento especial para macOS

A plataforma macOS tem etapas adicionais de detecção:

1. **Obter Bundle ID**: Consulta dinamicamente o Bundle ID do aplicativo via `osascript` (ex: `com.mitchellh.ghostty`)
2. **Detecção de foco**: Consulta o nome do processo do aplicativo em primeiro plano via `osascript`
3. **Foco ao clicar**: A notificação define o parâmetro `activate`, alternando para o terminal via Bundle ID ao clicar

::: info Vantagens do Bundle ID dinâmico
O código-fonte não codifica o Bundle ID diretamente, mas o consulta dinamicamente via `osascript`. Isso significa:
- ✅ Suporte a atualizações do terminal (desde que o Bundle ID não mude)
- ✅ Menor custo de manutenção (não precisa atualizar a lista manualmente)
- ✅ Melhor compatibilidade (teoricamente qualquer terminal macOS é suportado)
:::

### Suporte ao tmux

O tmux é um multiplexador de terminal. O plugin detecta sessões tmux através de variáveis de ambiente:

```bash
# Dentro de uma sessão tmux
echo $TMUX
# Saída: /tmp/tmux-1000/default,1234,0

# Fora do tmux
echo $TMUX
# Saída: (vazio)
```

::: tip Suporte ao fluxo de trabalho tmux
Usuários de tmux podem usar as notificações normalmente:
- Detecção automática de sessão tmux
- Notificações enviadas para a janela do terminal atual
- **Sem detecção de foco** (suporta fluxo de trabalho com múltiplas janelas tmux)
:::

## Especificar terminal manualmente

Se a detecção automática falhar, você pode especificar manualmente o tipo de terminal no arquivo de configuração.

### Quando é necessário especificar manualmente

As seguintes situações requerem configuração manual:
- O terminal que você usa não está na lista de suporte do `detect-terminal`
- Você usa um terminal dentro de outro (ex: tmux + Alacritty)
- O resultado da detecção automática está incorreto (identificado como outro terminal)

### Método de configuração

**Passo 1: Abrir o arquivo de configuração**

::: code-group

```bash [macOS/Linux]
nano ~/.config/opencode/kdco-notify.json
```

```powershell [Windows]
notepad $env:USERPROFILE\.config\opencode\kdco-notify.json
```

:::

**Passo 2: Adicionar a configuração do terminal**

```json
{
  "terminal": "ghostty"
}
```

**Passo 3: Salvar e reiniciar o OpenCode**

### Nomes de terminal disponíveis

O nome do terminal deve ser um nome reconhecido pela biblioteca `detect-terminal`. Nomes comuns:

| Terminal | Valor de configuração |
| --- | --- |
| Ghostty | `"ghostty"` |
| iTerm2 | `"iterm2"` ou `"iterm"` |
| Kitty | `"kitty"` |
| WezTerm | `"wezterm"` |
| Alacritty | `"alacritty"` |
| macOS Terminal | `"terminal"` ou `"apple_terminal"` |
| Hyper | `"hyper"` |
| Warp | `"warp"` |
| VS Code | `"vscode"` |
| VS Code Insiders | `"vscode-insiders"` |
| Windows Terminal | `"windows-terminal"` ou `"Windows Terminal"` |

::: details Lista completa de nomes disponíveis
Consulte o [código-fonte do detect-terminal](https://github.com/jonschlinkert/detect-terminal) para a lista completa.
:::

### Exemplo completo para terminal macOS

```json
{
  "terminal": "ghostty",
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  }
}
```

### Exemplo para terminal Windows/Linux

```json
{
  "terminal": "Windows Terminal",
  "notifyChildSessions": false,
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

::: warning Limitações de configuração no Windows/Linux
Windows e Linux não suportam a configuração `sounds` (usam o som padrão do sistema), nem suportam detecção de foco (limitação do sistema).
:::

## Checklist ✅

Após concluir a leitura, confirme:

- [ ] Sabe se o terminal que você usa é suportado
- [ ] Entende como funciona a detecção automática de terminal
- [ ] Sabe como especificar manualmente o tipo de terminal
- [ ] Compreende as diferenças de funcionalidade entre plataformas

## Problemas comuns

### Problema 1: Falha na detecção do terminal

**Sintoma**: Notificações não aparecem ou a detecção de foco não funciona.

**Causa**: O `detect-terminal` não consegue identificar o seu terminal.

**Solução**:

1. Confirme se o nome do terminal está correto (sensível a maiúsculas/minúsculas)
2. Especifique manualmente no arquivo de configuração:

```json
{
  "terminal": "nome-do-seu-terminal"
}
```

3. Consulte a [lista de suporte do detect-terminal](https://github.com/jonschlinkert/detect-terminal#supported-terminals)

### Problema 2: Foco ao clicar não funciona no macOS

**Sintoma**: Clicar na notificação não alterna para a janela do terminal.

**Causa**: Falha ao obter o Bundle ID ou o terminal não está na tabela de mapeamento.

**Solução**:

1. Verifique se o terminal está na tabela de mapeamento `TERMINAL_PROCESS_NAMES`
2. Se não estiver, especifique manualmente o nome do terminal

**Método de verificação**:

```typescript
// Debug temporário (adicione console.log em notify.ts)
console.log("Terminal info:", terminalInfo)
// Deve mostrar { name: "ghostty", bundleId: "com.mitchellh.ghostty", processName: "Ghostty" }
```

### Problema 3: Detecção de foco não funciona no tmux

**Sintoma**: No tmux, notificações aparecem mesmo quando o terminal está em primeiro plano.

**Causa**: O tmux tem seu próprio gerenciamento de sessão, a detecção de foco pode não ser precisa.

**Explicação**: Este é o comportamento esperado. No fluxo de trabalho tmux, a detecção de foco é limitada, mas as notificações ainda funcionam normalmente.

### Problema 4: Terminal integrado do VS Code identificado como Code

**Sintoma**: Tanto `"vscode"` quanto `"vscode-insiders"` funcionam na configuração, mas você não sabe qual usar.

**Explicação**:
- Usando **VS Code Stable** → configure `"vscode"`
- Usando **VS Code Insiders** → configure `"vscode-insiders"`

A detecção automática seleciona o nome do processo correto com base na versão instalada.

### Problema 5: Falha na identificação do Windows Terminal

**Sintoma**: Windows Terminal usa o nome "windows-terminal", mas não é detectado.

**Causa**: O nome do processo do Windows Terminal pode ser `WindowsTerminal.exe` ou `Windows Terminal`.

**Solução**: Tente diferentes valores de configuração:

```json
{
  "terminal": "windows-terminal"  // ou "Windows Terminal"
}
```

## Resumo da lição

Nesta lição, aprendemos:

- ✅ O opencode-notify suporta mais de 37 emuladores de terminal
- ✅ Terminais macOS suportam funcionalidade completa (detecção de foco + foco ao clicar)
- ✅ Terminais Windows/Linux suportam notificações básicas
- ✅ Como funciona a detecção automática de terminal e sua implementação no código
- ✅ Como especificar manualmente o tipo de terminal
- ✅ Soluções para problemas comuns de identificação de terminal

**Pontos-chave**:
1. A detecção de terminal é a base da filtragem inteligente, suportando mais de 37 terminais
2. Terminais macOS têm mais recursos, Windows/Linux têm funcionalidade mais básica
3. Quando a detecção automática falha, você pode configurar manualmente o nome do terminal
4. Usuários de tmux podem usar notificações normalmente, mas a detecção de foco é limitada
5. O Bundle ID dinâmico do macOS oferece melhor compatibilidade

## Prévia da próxima lição

> Na próxima lição, aprenderemos sobre **[Referência de Configuração](../../advanced/config-reference/)**.
>
> Você vai aprender:
> - Descrição completa das opções de configuração e valores padrão
> - Personalização de sons (macOS)
> - Configuração de horário silencioso
> - Controle de notificações de sessões filhas
> - Substituição do tipo de terminal
> - Técnicas avançadas de configuração

---

## Apêndice: Referência do código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização no código-fonte</strong></summary>

> Atualizado em: 2026-01-27

| Funcionalidade | Caminho do arquivo | Linhas |
| --- | --- | --- |
| Tabela de mapeamento de terminais | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84 |
| Função de detecção de terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| Obtenção de Bundle ID macOS | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L135-L137) | 135-137 |
| Detecção de app em primeiro plano macOS | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L139-L143) | 139-143 |
| Detecção de foco macOS | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |

**Constantes principais**:
- `TERMINAL_PROCESS_NAMES`: Tabela de mapeamento de nomes de terminal para nomes de processo macOS

**Funções principais**:
- `detectTerminalInfo()`: Detecta informações do terminal (nome, Bundle ID, nome do processo)
- `detectTerminal()`: Chama a biblioteca detect-terminal para identificar o terminal
- `getBundleId()`: Obtém dinamicamente o Bundle ID de aplicativos macOS via osascript
- `getFrontmostApp()`: Consulta o nome do aplicativo em primeiro plano
- `isTerminalFocused()`: Verifica se o terminal está em primeiro plano (apenas macOS)

**Dependências externas**:
- [detect-terminal](https://github.com/jonschlinkert/detect-terminal): Biblioteca de detecção de terminal, suporta mais de 37 terminais

</details>
