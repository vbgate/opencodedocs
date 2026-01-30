---
title: "Solução de Problemas: Notificações Não Aparecem, Detecção de Foco Falha e Outros Problemas Comuns | Tutorial opencode-notify"
sidebarTitle: "Notificações Não Aparecem"
subtitle: "Solução de Problemas: Notificações Não Aparecem, Detecção de Foco Falha e Outros Problemas Comuns"
description: "Resolva problemas comuns do opencode-notify, incluindo notificações que não aparecem, falha na detecção de foco, erros de configuração e sons que não tocam. Aprenda a diagnosticar permissões de notificação do macOS, configurações de horário silencioso, detecção de terminal e mais, restaurando rapidamente o funcionamento normal do plugin."
tags:
  - "Solução de Problemas"
  - "FAQ"
prerequisite:
  - "start-quick-start"
order: 110
---

# Solução de Problemas: Notificações Não Aparecem, Detecção de Foco Falha e Outros Problemas Comuns

## O Que Você Aprenderá

- Identificar rapidamente a causa de notificações que não aparecem
- Resolver problemas de permissão de notificação do macOS
- Diagnosticar problemas de falha na detecção de foco
- Corrigir erros de formato no arquivo de configuração
- Entender diferenças de funcionalidade entre plataformas

## Sua Situação Atual

A IA concluiu uma tarefa, mas você não recebeu nenhuma notificação; ou ao clicar na notificação, o terminal não foi trazido para frente. Você não sabe onde está o problema nem por onde começar a investigar.

## Quando Usar Este Guia

- Após instalar o plugin pela primeira vez, você não recebe nenhuma notificação
- Após atualizar o plugin ou o sistema, as notificações param de funcionar repentinamente
- Você quer desativar certos comportamentos de notificação, mas a configuração parece não ter efeito
- Ao mudar do macOS para Windows/Linux, você descobre que certas funcionalidades não estão disponíveis

## Conceito Central

O fluxo de trabalho do opencode-notify é relativamente simples, mas envolve várias etapas: SDK OpenCode → Monitoramento de Eventos → Lógica de Filtragem → Notificação do Sistema Operacional. Qualquer problema em uma dessas etapas pode fazer com que as notificações não apareçam.

A chave para o diagnóstico é **verificar cada etapa em ordem**, começando pelas causas mais prováveis. 80% dos problemas podem ser resolvidos através das seguintes 5 categorias:

1. **Notificações não aparecem** - O problema mais comum
2. **Falha na detecção de foco** (apenas macOS)
3. **Configuração não tem efeito** - Erro de formato JSON ou caminho incorreto
4. **Sons não tocam** (apenas macOS)
5. **Diferenças entre plataformas** - Certas funcionalidades não são suportadas

---

## Problema 1: Notificações Não Aparecem

Este é o problema mais comum, com 6 possíveis causas. Verifique em ordem:

### 1.1 Verificar se o Plugin Está Instalado Corretamente

**Sintoma**: O OpenCode funciona normalmente, mas você nunca recebe nenhuma notificação.

**Passos de Diagnóstico**:

```bash
# Verificar se o plugin está instalado
ls ~/.opencode/plugin/kdco-notify

# Se não existir, reinstalar
ocx add kdco/notify
```

**O que você deve ver**: O diretório `~/.opencode/plugin/kdco-notify` existe e contém arquivos como `package.json` e `src/notify.ts`.

::: tip Verificação de Instalação Manual
Se você usou instalação manual, certifique-se de que:
1. As dependências foram instaladas: `npm install node-notifier detect-terminal`
2. Os arquivos do plugin estão no local correto: `~/.opencode/plugin/`
3. O OpenCode foi reiniciado (alterações no plugin requerem reinicialização)
:::

### 1.2 Verificar Permissões de Notificação do macOS

**Sintoma**: Apenas para usuários macOS, o plugin está instalado, mas você nunca recebe notificações.

**Causa**: O macOS requer autorização explícita para que aplicativos de terminal enviem notificações.

**Passos de Diagnóstico**:

```bash
# 1. Abrir Ajustes do Sistema
# macOS Ventura e posterior: Ajustes do Sistema → Notificações e Foco
# Versões anteriores do macOS: Preferências do Sistema → Notificações

# 2. Encontrar seu aplicativo de terminal (ex: Ghostty, iTerm2, Terminal.app)
# 3. Certifique-se de que "Permitir Notificações" está ativado
# 4. Certifique-se de que "Na Tela Bloqueada" e "Mostrar banner na tela bloqueada" estão ativados
```

**O que você deve ver**: Seu aplicativo de terminal aparece nas configurações de notificação, e o interruptor "Permitir Notificações" está verde.

::: warning Erro Comum
O OpenCode em si não aparece nas configurações de notificação. Você precisa autorizar o **aplicativo de terminal** (Ghostty, iTerm2, Terminal.app, etc.), não o OpenCode.
:::

### 1.3 Verificar Configurações de Horário Silencioso

**Sintoma**: Sem notificações em determinados períodos, mas notificações funcionam em outros horários.

**Causa**: O horário silencioso está ativado no arquivo de configuração.

**Passos de Diagnóstico**:

```bash
# Verificar arquivo de configuração
cat ~/.config/opencode/kdco-notify.json
```

**Solução**:

```json
{
  "quietHours": {
    "enabled": false,  // Alterar para false para desativar horário silencioso
    "start": "22:00",
    "end": "08:00"
  }
}
```

**O que você deve ver**: `quietHours.enabled` é `false`, ou o horário atual não está dentro do período silencioso.

::: tip Horário Silencioso que Cruza a Meia-Noite
O horário silencioso suporta cruzar a meia-noite (ex: 22:00-08:00), este é o comportamento correto. Se o horário atual estiver entre 22h e 8h do dia seguinte, as notificações serão suprimidas.
:::

### 1.4 Verificar Foco da Janela do Terminal

**Sintoma**: Quando você está olhando para o terminal, não recebe notificações.

**Causa**: Este é o **comportamento esperado**, não um bug. O mecanismo de detecção de foco suprime notificações quando você está visualizando o terminal, evitando lembretes duplicados.

**Passos de Diagnóstico**:

**Verificar se o terminal está em foco**:
1. Mude para outro aplicativo (ex: navegador, VS Code)
2. Deixe a IA executar uma tarefa
3. Aguarde a conclusão da tarefa

**O que você deve ver**: Quando em outros aplicativos, as notificações aparecem normalmente.

::: tip Explicação da Detecção de Foco
A detecção de foco é um comportamento interno e não pode ser desativada através de configuração. O plugin suprime notificações por padrão quando o terminal está em foco, evitando lembretes duplicados. Este é o comportamento esperado por design.
:::

### 1.5 Verificar Filtragem de Sessões Filhas

**Sintoma**: A IA executou várias subtarefas, mas você não recebeu notificação para cada uma.

**Causa**: Este é o **comportamento esperado**. O plugin notifica apenas sessões pai por padrão, não sessões filhas, evitando bombardeio de notificações.

**Passos de Diagnóstico**:

**Entendendo sessões pai e filhas**:
- Sessão pai: Tarefa que você pediu diretamente à IA (ex: "otimizar a base de código")
- Sessão filha: Subtarefas que a IA dividiu por conta própria (ex: "otimizar src/components", "otimizar src/utils")

**Se você realmente precisa de notificações de sessões filhas**:

```json
{
  "notifyChildSessions": true
}
```

**O que você deve ver**: Você receberá uma notificação quando cada sessão filha for concluída.

::: tip Prática Recomendada
A menos que você esteja monitorando várias tarefas simultâneas, mantenha `notifyChildSessions: false` e receba apenas notificações da sessão pai.
:::

### 1.6 Verificar se o Arquivo de Configuração Foi Excluído ou Renomeado

**Sintoma**: Você recebia notificações antes, mas de repente elas pararam.

**Passos de Diagnóstico**:

```bash
# Verificar se o arquivo de configuração existe
ls -la ~/.config/opencode/kdco-notify.json
```

**Solução**:

Se o arquivo de configuração foi excluído ou o caminho está incorreto, o plugin usará a configuração padrão:

**Excluir arquivo de configuração para restaurar padrões**:

```bash
# Excluir arquivo de configuração, usar configurações padrão
rm ~/.config/opencode/kdco-notify.json
```

**O que você deve ver**: O plugin volta a enviar notificações (usando configuração padrão).

---

## Problema 2: Falha na Detecção de Foco (Apenas macOS)

**Sintoma**: Você ainda recebe notificações quando está olhando para o terminal, a detecção de foco parece não estar funcionando.

### 2.1 Verificar se o Terminal Está Sendo Detectado Corretamente

**Causa**: O plugin usa a biblioteca `detect-terminal` para identificar automaticamente o terminal. Se a identificação falhar, a detecção de foco não funcionará.

**Passos de Diagnóstico**:

```bash
# Verificar se a detecção de terminal está funcionando
node -e "console.log(require('detect-terminal')())"
```

**O que você deve ver**: A saída mostra o nome do seu terminal (ex: `ghostty`, `iterm2`, etc.).

Se a saída estiver vazia, a detecção de terminal falhou.

### 2.2 Especificar Manualmente o Tipo de Terminal

**Se a detecção automática falhar, você pode especificar manualmente**:

```json
{
  "terminal": "ghostty"  // Substitua pelo nome do seu terminal
}
```

**Nomes de terminais suportados** (minúsculas):

| Terminal | Nome | Terminal | Nome |
| --- | --- | --- | --- |
| Ghostty | `ghostty` | Kitty | `kitty` |
| iTerm2 | `iterm2` ou `iterm` | WezTerm | `wezterm` |
| Alacritty | `alacritty` | Terminal macOS | `terminal` ou `apple_terminal` |
| Hyper | `hyper` | Warp | `warp` |
| Terminal VS Code | `vscode` | VS Code Insiders | `vscode-insiders` |

::: tip Mapeamento de Nomes de Processo
O plugin possui uma tabela de mapeamento interna de nomes de terminal para nomes de processo do macOS. Se você especificar `terminal` manualmente, certifique-se de usar os nomes da tabela de mapeamento (linhas 71-84).
:::

---

## Problema 3: Configuração Não Tem Efeito

**Sintoma**: Você modificou o arquivo de configuração, mas o comportamento do plugin não mudou.

### 3.1 Verificar se o Formato JSON Está Correto

**Erros comuns**:

```json
// ❌ Erro: faltam aspas
{
  notifyChildSessions: true
}

// ❌ Erro: vírgula no final
{
  "notifyChildSessions": true,
}

// ❌ Erro: comentários não são suportados
{
  "notifyChildSessions": true  // Isso causará falha na análise do JSON
}
```

**Formato correto**:

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

**Validar formato JSON**:

```bash
# Usar jq para validar formato JSON
cat ~/.config/opencode/kdco-notify.json | jq '.'

# Se a saída for JSON formatado, o formato está correto
# Se houver erro, o JSON tem problemas
```

### 3.2 Verificar Caminho do Arquivo de Configuração

**Sintoma**: Você criou um arquivo de configuração, mas o plugin parece não estar lendo.

**Caminho correto**:

```
~/.config/opencode/kdco-notify.json
```

**Passos de Diagnóstico**:

```bash
# Verificar se o arquivo de configuração existe
ls -la ~/.config/opencode/kdco-notify.json

# Se não existir, criar diretório e arquivo
mkdir -p ~/.config/opencode
cat > ~/.config/opencode/kdco-notify.json << 'EOF'
{
  "notifyChildSessions": false
}
EOF
```

### 3.3 Reiniciar o OpenCode

**Causa**: O plugin carrega a configuração uma vez na inicialização, modificações requerem reinicialização.

**Passos de Diagnóstico**:

```bash
# Reiniciar completamente o OpenCode
# 1. Sair do OpenCode
# 2. Iniciar o OpenCode novamente
```

---

## Problema 4: Sons Não Tocam (Apenas macOS)

**Sintoma**: As notificações aparecem normalmente, mas nenhum som é reproduzido.

### 4.1 Verificar se o Nome do Som Está Correto

**Sons do macOS suportados**:

| Nome do Som | Descrição | Nome do Som | Descrição |
| --- | --- | --- | --- |
| Basso | Grave | Blow | Som de sopro |
| Bottle | Som de garrafa | Frog | Som de sapo |
| Funk | Funk | Glass | Som de vidro (padrão para conclusão de tarefa) |
| Hero | Herói | Morse | Código Morse |
| Ping | Ping | Pop | Som de bolha |
| Purr | Ronronar | Sosumi | Sosumi |
| Submarine | Submarino (padrão para solicitação de permissão) | Tink | Tinido |

**Exemplo de configuração**:

```json
{
  "sounds": {
    "idle": "Glass",      // Som de conclusão de tarefa
    "error": "Basso",    // Som de erro
    "permission": "Submarine",  // Som de solicitação de permissão
    "question": "Ping"   // Som de pergunta (opcional)
  }
}
```

### 4.2 Verificar Configurações de Volume do Sistema

**Passos de Diagnóstico**:

```bash
# Abrir Ajustes do Sistema → Som → Volume de Saída
# Certifique-se de que o volume não está mudo e está em nível adequado
```

### 4.3 Outras Plataformas Não Suportam Sons Personalizados

**Sintoma**: Usuários Windows ou Linux configuraram sons, mas não há som.

**Causa**: Sons personalizados são uma funcionalidade exclusiva do macOS, Windows e Linux não suportam.

**Solução**: Usuários Windows e Linux receberão notificações, mas os sons são controlados pelas configurações padrão do sistema, não podem ser configurados através do plugin.

::: tip Sons no Windows/Linux
Os sons de notificação no Windows e Linux são controlados pelas configurações do sistema:
- Windows: Configurações → Sistema → Notificações → Selecionar som de notificação
- Linux: Configurações do ambiente de desktop → Notificações → Sons
:::

---

## Problema 5: Clicar na Notificação Não Foca (Apenas macOS)

**Sintoma**: Após clicar na notificação, a janela do terminal não é trazida para frente.

### 5.1 Verificar se o Bundle ID Foi Obtido com Sucesso

**Causa**: A funcionalidade de focar ao clicar na notificação requer obter o Bundle ID do terminal (ex: `com.ghostty.Ghostty`). Se a obtenção falhar, não será possível focar.

**Passos de Diagnóstico**:

O plugin detecta automaticamente o terminal e obtém o Bundle ID na inicialização. Se falhar, a funcionalidade de focar ao clicar não estará disponível.

**Causas comuns**:
1. O terminal não está na tabela de mapeamento (ex: terminal personalizado)
2. Falha na execução do `osascript` (problema de permissão do macOS)

**Solução**: Especificar manualmente o tipo de terminal (veja seção 2.2).

### 5.2 Verificar Permissões de Acessibilidade do Sistema

**Causa**: O macOS requer permissão de "Acessibilidade" para controlar janelas de outros aplicativos.

**Passos de Diagnóstico**:

```bash
# Abrir Ajustes do Sistema → Privacidade e Segurança → Acessibilidade
# Certifique-se de que o aplicativo de terminal tem permissão de acessibilidade
```

**O que você deve ver**: Seu aplicativo de terminal (Ghostty, iTerm2, etc.) está na lista de Acessibilidade, e o interruptor está ativado.

---

## Problema 6: Diferenças de Funcionalidade Entre Plataformas

**Sintoma**: Ao mudar do macOS para Windows/Linux, você descobre que certas funcionalidades não estão disponíveis.

### 6.1 Tabela de Comparação de Funcionalidades

| Funcionalidade | macOS | Windows | Linux |
| --- | --- | --- | --- |
| Notificações Nativas | ✅ | ✅ | ✅ |
| Sons Personalizados | ✅ | ❌ | ❌ |
| Detecção de Foco | ✅ | ❌ | ❌ |
| Clicar na Notificação para Focar | ✅ | ❌ | ❌ |
| Detecção de Terminal | ✅ | ✅ | ✅ |
| Horário Silencioso | ✅ | ✅ | ✅ |
| Notificação de Sessão Filha | ✅ | ✅ | ✅ |

**Explicação**:
- **Windows/Linux**: Suportam apenas funcionalidades básicas de notificação, funcionalidades avançadas (detecção de foco, clicar para focar, sons personalizados) não estão disponíveis
- **macOS**: Suporta todas as funcionalidades

### 6.2 Compatibilidade do Arquivo de Configuração Entre Plataformas

**Problema**: Você configurou `sounds` no macOS, mas ao mudar para Windows os sons não funcionam.

**Causa**: A configuração `sounds` só funciona no macOS.

**Solução**: O arquivo de configuração pode ser usado entre plataformas, o plugin ignorará automaticamente itens de configuração não suportados. Não é necessário excluir o campo `sounds`, Windows/Linux o ignorarão silenciosamente.

::: tip Melhor Prática
Use o mesmo arquivo de configuração ao alternar entre múltiplas plataformas, o plugin tratará automaticamente as diferenças entre plataformas. Não é necessário criar arquivos de configuração separados para cada plataforma.
:::

---

## Resumo da Aula

A solução de problemas do opencode-notify pode ser resumida nas seguintes 6 categorias:

1. **Notificações não aparecem**: Verificar instalação do plugin, permissões de notificação do macOS, horário silencioso, foco do terminal, filtragem de sessão filha, se o plugin está desativado
2. **Falha na detecção de foco** (macOS): Verificar se o terminal está sendo detectado corretamente, ou especificar manualmente o tipo de terminal
3. **Configuração não tem efeito**: Verificar formato JSON, caminho do arquivo de configuração, reiniciar OpenCode
4. **Sons não tocam** (macOS): Verificar se o nome do som está correto, confirmar que sons só são suportados no macOS
5. **Clicar na notificação não foca** (macOS): Verificar obtenção do Bundle ID e permissões de acessibilidade
6. **Diferenças entre plataformas**: Windows/Linux suportam apenas notificações básicas, funcionalidades avançadas estão disponíveis apenas no macOS

**Lista de Verificação Rápida**:

```
□ O plugin está instalado corretamente?
□ As permissões de notificação do macOS estão autorizadas?
□ O horário silencioso está ativado?
□ O terminal está em foco?
□ A filtragem de sessão filha está ativada?
□ O formato JSON do arquivo de configuração está correto?
□ O caminho do arquivo de configuração está correto?
□ O OpenCode foi reiniciado?
□ O nome do som está na lista de suportados (apenas macOS)?
□ O Bundle ID foi obtido com sucesso (apenas macOS)?
□ O volume do sistema está normal?
```

---

## Prévia da Próxima Aula

> Na próxima aula aprenderemos sobre **[Principais Questões](../common-questions/)**.
>
> Você aprenderá:
> - Se o opencode-notify aumenta o contexto da conversa da IA
> - Se você será bombardeado por muitas notificações
> - Como desativar temporariamente as notificações
> - Impacto no desempenho e questões de privacidade e segurança

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Última atualização: 2026-01-27

| Funcionalidade | Caminho do Arquivo | Linha |
| --- | --- | --- |
| Carregamento de Configuração e Tratamento de Erros | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |
| Detecção de Terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| Execução do osascript macOS | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L120-L133) | 120-133 |
| Detecção de Foco do Terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| Verificação de Horário Silencioso | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L181-L199) | 181-199 |
| Detecção de Sessão Pai | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L205-L214) | 205-214 |
| Envio de Notificação | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L243) | 227-243 |
| Configuração Padrão | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |
| Mapeamento de Nomes de Processo de Terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84 |
| Tratamento de Conclusão de Tarefa | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L249-L284) | 249-284 |
| Tratamento de Notificação de Erro | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L286-L313) | 286-313 |
| Tratamento de Solicitação de Permissão | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L315-L334) | 315-334 |
| Tratamento de Pergunta | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L336-L351) | 336-351 |

**Constantes Principais**:

- `DEFAULT_CONFIG`: Configuração padrão (linhas 56-68)
  - `notifyChildSessions: false`: Não notifica sessões filhas por padrão
  - `sounds.idle: "Glass"`: Som de conclusão de tarefa
  - `sounds.error: "Basso"`: Som de erro
  - `sounds.permission: "Submarine"`: Som de solicitação de permissão
  - `quietHours.start: "22:00"`, `quietHours.end: "08:00"`: Horário silencioso padrão

- `TERMINAL_PROCESS_NAMES`: Mapeamento de nomes de terminal para nomes de processo do macOS (linhas 71-84)

**Funções Principais**:

- `loadConfig()`: Carrega e mescla arquivo de configuração com configuração padrão, usa padrões se o arquivo não existir ou for inválido
- `detectTerminalInfo()`: Detecta informações do terminal (nome, Bundle ID, nome do processo)
- `isTerminalFocused()`: Verifica se o terminal é o aplicativo em primeiro plano (macOS)
- `isQuietHours()`: Verifica se o horário atual está dentro do período silencioso
- `isParentSession()`: Verifica se a sessão é uma sessão pai
- `sendNotification()`: Envia notificação nativa, suporta clicar para focar no macOS
- `runOsascript()`: Executa AppleScript (macOS), retorna null em caso de falha
- `getBundleId()`: Obtém o Bundle ID do aplicativo (macOS)

**Regras de Negócio**:

- BR-1-1: Notifica apenas sessão pai por padrão, não notifica sessões filhas (`notify.ts:256-259`)
- BR-1-2: Suprime notificações quando terminal está em foco (`notify.ts:265`)
- BR-1-3: Não envia notificações durante horário silencioso (`notify.ts:262`)
- BR-1-4: Solicitações de permissão sempre notificam, sem verificação de sessão pai (`notify.ts:319`)
- BR-1-5: Perguntas não verificam foco, suportam fluxo de trabalho tmux (`notify.ts:340`)
- BR-1-6: macOS suporta clicar na notificação para focar terminal (`notify.ts:238-240`)

**Tratamento de Exceções**:

- `loadConfig()`: Usa configuração padrão se arquivo não existir ou análise JSON falhar (`notify.ts:110-113`)
- `isParentSession()`: Assume sessão pai se consulta falhar (notifica em vez de omitir) (`notify.ts:210-212`)
- `runOsascript()`: Retorna null se execução do osascript falhar (`notify.ts:120-132`)
- `handleSessionIdle()`: Usa título padrão se obtenção de informações da sessão falhar (`notify.ts:274-276`)

</details>
