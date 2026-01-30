---
title: "Recursos da Plataforma macOS: Detecção de Foco, Clique para Focar e Sons Personalizados | opencode-notify"
sidebarTitle: "Clicar na Notificação para Voltar ao Terminal"
subtitle: "Recursos da Plataforma macOS"
description: "Aprenda os recursos exclusivos do opencode-notify na plataforma macOS: detecção inteligente de foco para evitar notificações duplicadas, clique na notificação para focar automaticamente no terminal, e 12 sons embutidos para personalização. Este tutorial detalha os métodos de configuração, lista de sons disponíveis e dicas práticas para ajudá-lo a aproveitar ao máximo as capacidades nativas de notificação do macOS, melhorando sua produtividade e reduzindo trocas desnecessárias de janelas."
tags:
  - "Recursos da Plataforma"
  - "macOS"
  - "Detecção de Foco"
prerequisite:
  - "start-quick-start"
order: 30
---

# Recursos da Plataforma macOS

## O que Você Poderá Fazer Após Este Tutorial

- ✅ Configurar detecção inteligente de foco, para que o plugin saiba que você está olhando para o terminal
- ✅ Clicar na notificação para focar automaticamente na janela do terminal
- ✅ Personalizar sons de notificação para diferentes eventos
- ✅ Entender as vantagens e limitações exclusivas da plataforma macOS

## Sua Situação Atual

Você frequentemente alterna entre janelas ao usar o OpenCode: a IA está executando tarefas em segundo plano, você muda para o navegador para pesquisar, e a cada poucos segundos precisa voltar para verificar: a tarefa foi concluída? Ocorreu um erro? Ou está esperando sua entrada?

Se houvesse uma notificação nativa na área de trabalho, como receber uma mensagem do WeChat, a IA notificasse você quando a tarefa fosse concluída ou quando precisasse de você.

## Quando Usar Esta Técnica

- **Você usa OpenCode no macOS** - O conteúdo desta aula se aplica apenas ao macOS
- **Você deseja otimizar seu fluxo de trabalho** - Evite alternar frequentemente entre janelas para verificar o status da IA
- **Você quer uma melhor experiência de notificação** - Aproveite as vantagens das notificações nativas do macOS

::: info Por que o macOS é Mais Poderoso?
A plataforma macOS oferece capacidades completas de notificação: detecção de foco, clique para focar, sons personalizados. Windows e Linux atualmente suportam apenas funções básicas de notificação nativa.
:::

## 🎒 Preparação Antes de Começar

Antes de começar, certifique-se de ter concluído:

::: warning Verificação de Pré-requisitos
- [ ] Concluído o tutorial [Início Rápido](../../start/quick-start/)
- [ ] O plugin está instalado e funcionando corretamente
- [ ] Você está usando o sistema macOS
:::

## Ideia Central

A experiência completa de notificação na plataforma macOS é construída sobre três capacidades-chave:

### 1. Detecção Inteligente de Foco

O plugin sabe se você está atualmente olhando para a janela do terminal. Se você está revisando a saída da IA, não enviará notificações para incomodá-lo. As notificações só são enviadas quando você muda para outro aplicativo.

**Princípio de Implementação**: Através do serviço de sistema `osascript` do macOS, consulta o nome do processo do aplicativo em primeiro plano e compara com o nome do processo do seu terminal.

### 2. Clique na Notificação para Focar no Terminal

Após receber a notificação, basta clicar no cartão de notificação e a janela do terminal será automaticamente trazida para a frente. Você pode voltar imediatamente ao trabalho.

**Princípio de Implementação**: O Centro de Notificações do macOS suporta a opção `activate`, passando o Bundle ID do aplicativo para implementar o foco ao clicar.

### 3. Sons Personalizados

Defina sons diferentes para diferentes tipos de eventos: um som claro para tarefa concluída, um som grave para erro, para que você possa ter uma ideia geral da situação sem olhar para a notificação.

**Princípio de Implementação**: Aproveitando os 14 sons padrão embutidos do sistema macOS (como Glass, Basso, Submarine), basta especificar o campo `sounds` no arquivo de configuração.

::: tip Colaboração das Três Capacidades
Detecção de foco evita perturbações → Clique na notificação para retorno rápido → Sons distinguem rapidamente os tipos de eventos
:::

## Siga-me

### Passo 1: Verificar o Terminal Detectado Automaticamente

O plugin detectará automaticamente o emulador de terminal que você está usando na inicialização. Vamos verificar se a identificação está correta.

**Por Quê**

O plugin precisa saber qual é o seu terminal para implementar as funções de detecção de foco e clique para focar.

**Operação**

1. Abra seu diretório de configuração do OpenCode:
   ```bash
   ls ~/.config/opencode/
   ```

2. Se você já criou o arquivo de configuração `kdco-notify.json`, verifique se há o campo `terminal`:
   ```bash
   cat ~/.config/opencode/kdco-notify.json
   ```

3. Se o arquivo de configuração não tiver o campo `terminal`, isso significa que o plugin está usando detecção automática.

**O que Você Deveria Ver**

Se o arquivo de configuração não tiver o campo `terminal`, o plugin detectará automaticamente. Os terminais suportados incluem:
- **Terminais Comuns**: Ghostty, Kitty, iTerm2, WezTerm, Alacritty
- **Terminal do Sistema**: Terminal.app nativo do macOS
- **Outros Terminais**: Hyper, Warp, Terminal Integrado do VS Code, etc.

::: info Suporte a 37+ Terminais
O plugin usa a biblioteca `detect-terminal`, suportando 37+ emuladores de terminal. Se seu terminal não estiver na lista comum, também tentará identificar automaticamente.
:::

### Passo 2: Configurar Sons Personalizados

O macOS fornece 14 sons embutidos, você pode atribuir sons diferentes para diferentes eventos.

**Por Quê**

Sons diferentes permitem que você tenha uma ideia geral do que aconteceu sem olhar para a notificação: tarefa concluída ou erro, IA esperando ou apenas concluindo a tarefa.

**Operação**

1. Abra ou crie o arquivo de configuração:
   ```bash
   nano ~/.config/opencode/kdco-notify.json
   ```

2. Adicione ou modifique a configuração `sounds`:

```json
{
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  }
}
```

3. Salve e saia (Ctrl+O, Enter, Ctrl+X)

**O que Você Deveria Ver**

O campo `sounds` no arquivo de configuração tem quatro opções:

| Campo | Função | Valor Padrão | Configuração Recomendada |
| --- | --- | --- | --- |
| `idle` | Som de tarefa concluída | Glass | Glass (claro) |
| `error` | Som de notificação de erro | Basso | Basso (grave) |
| `permission` | Som de solicitação de permissão | Submarine | Submarine (alerta) |
| `question` | Som de pergunta da IA (opcional) | permission | Purr (suave) |

::: tip Combinação Recomendada
Esta combinação padrão é intuitiva: som alegre para conclusão, som de alerta para erro, som de alerta para solicitação de permissão.
:::

### Passo 3: Conhecer a Lista de Sons Disponíveis

O macOS tem 14 sons embutidos, você pode combiná-los livremente.

**Por Quê**

Conhecer todos os sons disponíveis ajuda você a encontrar a combinação mais adequada para seus hábitos de trabalho.

**Sons Disponíveis**

| Nome do Som | Características Sonoras | Cenário de Uso |
| --- | --- | --- |
| Glass | Alegre, claro | Tarefa concluída |
| Basso | Grave, alerta | Notificação de erro |
| Submarine | Alerta, suave | Solicitação de permissão |
| Blow | Forte | Evento importante |
| Bottle | Claro | Subtarefa concluída |
| Frog | Descontraído | Lembrete informal |
| Funk | Ritmado | Múltiplas tarefas concluídas |
| Hero | Grandioso | Marco concluído |
| Morse | Código Morse | Relacionado a depuração |
| Ping | Claro | Lembrete leve |
| Pop | Curto | Tarefa rápida |
| Purr | Suave | Lembrete não perturbador |
| Sosumi | Único | Evento especial |
| Tink | Limpido | Pequena tarefa concluída |

::: tip Identificação por Som
Após a configuração, experimente diferentes combinações de sons para encontrar a configuração mais adequada para seu fluxo de trabalho.
:::

### Passo 4: Testar a Função de Clique para Focar

Após clicar na notificação, a janela do terminal será automaticamente trazida para a frente. Este é um recurso exclusivo do macOS.

**Por Quê**

Quando você recebe uma notificação, não precisa alternar manualmente para o terminal e procurar pela janela, basta clicar na notificação para voltar imediatamente ao trabalho.

**Operação**

1. Certifique-se de que o OpenCode está em execução e inicie uma tarefa de IA
2. Mude para outro aplicativo (como o navegador)
3. Aguarde a conclusão da tarefa de IA, você receberá a notificação "Ready for review"
4. Clique no cartão de notificação

**O que Você Deveria Ver**

- A notificação desaparece
- A janela do terminal é automaticamente trazida para a frente e recebe foco
- Você pode revisar imediatamente a saída da IA

::: info Princípio de Foco
O plugin obtém dinamicamente o Bundle ID do aplicativo do terminal através do osascript e, ao enviar a notificação, passa a opção `activate`. O Centro de Notificações do macOS, ao receber esta opção, ativará automaticamente o aplicativo correspondente quando você clicar na notificação.
:::

### Passo 5: Verificar a Função de Detecção de Foco

Quando você está olhando para o terminal, não receberá notificações. Isso evita lembretes duplicados.

**Por Quê**

Se você já está olhando para o terminal, a notificação é redundante. As notificações só fazem sentido quando você muda para outro aplicativo.

**Operação**

1. Abra o OpenCode, inicie uma tarefa de IA
2. Mantenha a janela do terminal em primeiro plano (não alterne)
3. Aguarde a conclusão da tarefa

**O que Você Deveria Ver**

- Não recebeu a notificação "Ready for review"
- A tarefa é exibida como concluída no terminal

**Em Seguida, Experimente**:

1. Inicie outra tarefa de IA
2. Mude para o navegador ou outro aplicativo
3. Aguarde a conclusão da tarefa

**O que Você Deveria Ver**

- Recebeu a notificação "Ready for review"
- Reproduziu o som configurado (padrão Glass)

::: tip A Inteligência da Detecção de Foco
O plugin sabe quando você está olhando para o terminal e quando não está. Isso evita que você perca lembretes importantes e também não é incomodado por notificações duplicadas.
:::

## Ponto de Verificação ✅

### Verificação de Configuração

- [ ] O arquivo de configuração `~/.config/opencode/kdco-notify.json` existe
- [ ] O campo `sounds` está configurado (contém pelo menos idle, error, permission)
- [ ] Não há campo `terminal` definido (usando detecção automática)

### Verificação de Funções

- [ ] Pode receber notificação após a conclusão da tarefa de IA
- [ ] A janela do terminal é trazida para a frente ao clicar na notificação
- [ ] Não recebe notificações duplicadas quando a janela do terminal está em primeiro plano
- [ ] Diferentes tipos de eventos reproduzem sons diferentes

::: danger Detecção de Foco Não Funcionando?
Se o terminal não for trazido para a frente ao clicar na notificação, pode ser:
1. O aplicativo do terminal não foi identificado corretamente - verifique o campo `terminal` no arquivo de configuração
2. Falha na obtenção do Bundle ID - verifique as mensagens de erro nos logs do OpenCode
:::

## Avisos de Armadilhas

### Som Não Reproduz

**Problema**: Configurou o som, mas não há som ao receber notificação

**Possíveis Causas**:
1. O volume do sistema está muito baixo ou mudo
2. O som de notificação está desabilitado nas preferências do sistema macOS

**Solução**:
1. Verifique o volume do sistema e as configurações de notificação
2. Abra "Configurações do Sistema → Notificações → OpenCode" e certifique-se de que o som está habilitado

### Clique na Notificação Não Foca

**Problema**: Ao clicar na notificação, a janela do terminal não é trazida para a frente

**Possíveis Causas**:
1. O aplicativo do terminal não foi detectado automaticamente
2. Falha na obtenção do Bundle ID

**Solução**:
1. Especifique manualmente o tipo de terminal:
   ```json
   {
     "terminal": "ghostty"  // ou outro nome de terminal
   }
   ```

2. Certifique-se de que o nome do aplicativo do terminal está correto (sensível a maiúsculas/minúsculas)

### Detecção de Foco Não Funciona

**Problema**: Mesmo com o terminal em primeiro plano, ainda recebe notificações

**Possíveis Causas**:
1. Falha na detecção do nome do processo do terminal
2. O aplicativo do terminal não está na lista de detecção automática

**Solução**:
1. Especifique manualmente o tipo de terminal:
   ```json
   {
     "terminal": "ghostty"  // ou outro nome de terminal
   }
   ```

2. Certifique-se de que o nome do aplicativo do terminal está correto (sensível a maiúsculas/minúsculas)
3. Verifique os logs para confirmar se o terminal foi identificado corretamente

## Resumo desta Aula

A plataforma macOS oferece uma experiência completa de notificação:

| Função | Função | Suporte da Plataforma |
| --- | --- | --- |
| Notificação Nativa | Exibir notificação de nível de sistema | ✅ macOS<br>✅ Windows<br>✅ Linux |
| Som Personalizado | Sons diferentes para diferentes eventos | ✅ macOS |
| Detecção de Foco | Evitar notificações duplicadas | ✅ macOS |
| Clique para Focar | Retorno rápido ao trabalho | ✅ macOS |

**Configuração Principal**:
```json
{
  "sounds": {
    "idle": "Glass",       // Tarefa concluída
    "error": "Basso",      // Erro
    "permission": "Submarine"  // Solicitação de permissão
  }
}
```

**Fluxo de Trabalho**:
1. IA conclui tarefa → Envia notificação → Reproduz som Glass
2. Você trabalha no navegador → Recebe notificação → Clica
3. Terminal é trazido automaticamente para a frente → Revisa saída da IA

## Prévia da Próxima Aula

> Na próxima aula aprenderemos **[Recursos da Plataforma Windows](../windows/)**.
>
> Você aprenderá:
> - Quais funções a plataforma Windows suporta
> - Quais são as diferenças em comparação com o macOS
> - Como configurar notificações no Windows

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para Expandir e Ver a Localização do Código Fonte</strong></summary>

> Atualizado em: 2026-01-27

| Função | Caminho do Arquivo | Número da Linha |
| --- | --- | --- |
| Detecção de Foco | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| Clique para Focar | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L238-L240) | 238-240 |
| Obtenção de Bundle ID | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L135-L137) | 135-137 |
| Detecção de Aplicativo em Primeiro Plano | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L139-L143) | 139-143 |
| Mapeamento de Nomes de Terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84 |
| Configuração de Som Padrão | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L59-L61) | 59-61 |
| Lista de Sons do macOS | [`README.md`](https://github.com/kdcokenny/opencode-notify/blob/main/README.md#L81) | 81 |
| Tabela de Comparação de Recursos da Plataforma | [`README.md`](https://github.com/kdcokenny/opencode-notify/blob/main/README.md#L54-L62) | 54-62 |

**Constantes Principais**:

- `TERMINAL_PROCESS_NAMES` (linhas 71-84): Tabela de mapeamento de nomes de terminal para nomes de processo do macOS
  - `ghostty` → `"Ghostty"`
  - `kitty` → `"kitty"`
  - `iterm` / `iterm2` → `"iTerm2"`
  - `wezterm` → `"WezTerm"`
  - `alacritty` → `"Alacritty"`
  - `terminal` / `apple_terminal` → `"Terminal"`
  - `hyper` → `"Hyper"`
  - `warp` → `"Warp"`
  - `vscode` → `"Code"`
  - `vscode-insiders` → `"Code - Insiders"`

**Configuração Padrão**:

- `sounds.idle = "Glass"`: Som de tarefa concluída
- `sounds.error = "Basso"`: Som de notificação de erro
- `sounds.permission = "Submarine"`: Som de solicitação de permissão

**Funções Principais**:

- `isTerminalFocused(terminalInfo)` (linhas 166-175): Detecta se o terminal é o aplicativo em primeiro plano
  - Usa `osascript` para obter o nome do processo do aplicativo em primeiro plano
  - Compara com o `processName` do terminal (não diferencia maiúsculas/minúsculas)
  - Habilitado apenas na plataforma macOS

- `getBundleId(appName)` (linhas 135-137): Obtém dinamicamente o Bundle ID do aplicativo
  - Usa `osascript` para consultar
  - O Bundle ID é usado para a função de foco ao clicar na notificação

- `getFrontmostApp()` (linhas 139-143): Obtém o aplicativo atualmente em primeiro plano
  - Usa `osascript` para consultar os Eventos do Sistema
  - Retorna o nome do processo do aplicativo em primeiro plano

- `sendNotification(options)` (linhas 227-243): Envia notificação
  - Recurso do macOS: se detectar a plataforma como darwin e houver `terminalInfo.bundleId`, define a opção `activate` para implementar o foco ao clicar

</details>
