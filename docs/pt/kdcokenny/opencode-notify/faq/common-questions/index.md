---
title: "opencode-notify FAQ: Desempenho, Privacidade e Compatibilidade Entre Plataformas"
sidebarTitle: "Principais Questões"
subtitle: "FAQ: Desempenho, Privacidade e Compatibilidade"
description: "Entenda como o opencode-notify afeta o contexto da IA e consome recursos do sistema, confirme que o plugin funciona 100% localmente sem upload de dados, domine as estratégias de filtragem inteligente de notificações e configuração de horários silenciosos, aprenda sobre compatibilidade com outros plugins OpenCode e diferenças de funcionalidade entre plataformas macOS/Windows/Linux, respondendo todas as dúvidas mais comuns sobre frequência de notificações, segurança da privacidade, consumo de recursos, tratamento de falhas na detecção de terminal e localização de arquivos de configuração."
tags:
  - "FAQ"
  - "Desempenho"
  - "Privacidade"
prerequisite:
  - "start-quick-start"
order: 120
---

# FAQ: Desempenho, Privacidade e Compatibilidade

## O Que Você Aprenderá

- Entender o impacto no desempenho e consumo de recursos do plugin
- Compreender as garantias de segurança e privacidade
- Dominar estratégias de notificação e dicas de configuração
- Compreender diferenças entre plataformas e compatibilidade

---

## Desempenho

### O Plugin Aumenta o Contexto da IA?

**Não**. O plugin usa um modelo orientado a eventos e não adiciona nenhuma ferramenta ou prompt às conversas da IA.

Observando a implementação do código-fonte:

| Componente | Tipo | Implementação | Impacto no Contexto |
| --- | --- | --- | --- |
| Monitoramento de Eventos | Evento | Monitora eventos `session.idle`, `session.error`, `permission.updated` | ✅ Sem impacto |
| Hook de Ferramentas | Hook | Monitora ferramenta `question` via `tool.execute.before` | ✅ Sem impacto |
| Conteúdo da Conversa | - | Não lê, não modifica, não injeta nenhum conteúdo de conversa | ✅ Sem impacto |

O código-fonte do plugin é responsável apenas por **monitorar e notificar**; o contexto da conversa da IA não é afetado de forma alguma.

### Quanto de Recursos do Sistema Ele Consome?

**Muito baixo**. O plugin adota um design de "cache na inicialização + acionamento por evento":

1. **Carregamento de Configuração**: O plugin lê o arquivo de configuração uma vez na inicialização (`~/.config/opencode/kdco-notify.json`), não lendo mais depois
2. **Detecção de Terminal**: Detecta o tipo de terminal e armazena informações em cache (nome, Bundle ID, nome do processo) na inicialização, usando o cache para eventos subsequentes
3. **Orientado a Eventos**: O plugin só executa a lógica de notificação quando eventos específicos da IA são acionados

Características de consumo de recursos:

| Tipo de Recurso | Consumo | Descrição |
| --- | --- | --- |
| CPU | Praticamente 0 | Executa brevemente apenas quando eventos são acionados |
| Memória | < 5 MB | Entra em estado de espera após inicialização |
| Disco | < 100 KB | Arquivo de configuração e código em si |
| Rede | 0 | Não faz nenhuma requisição de rede |

---

## Privacidade e Segurança

### Os Dados São Enviados para Servidores?

**Não**. O plugin funciona completamente localmente, sem upload de nenhum dado.

**Garantia de Privacidade**:

| Tipo de Dado | Método de Processamento | Upload? |
| --- | --- | --- |
| Conteúdo da Conversa da IA | Não lê, não armazena | ❌ Não |
| Informações da Sessão (título) | Usado apenas para mensagens de notificação | ❌ Não |
| Mensagens de Erro | Usado apenas para mensagens de notificação (máx. 100 caracteres) | ❌ Não |
| Informações do Terminal | Detectado e armazenado em cache localmente | ❌ Não |
| Informações de Configuração | Arquivo local (`~/.config/opencode/`) | ❌ Não |
| Conteúdo da Notificação | Enviado via API de notificação nativa do sistema | ❌ Não |

**Implementação Técnica**:

O plugin usa notificações nativas do sistema:
- macOS: Chama `NSUserNotificationCenter` via `node-notifier`
- Windows: Chama `SnoreToast` via `node-notifier`
- Linux: Chama `notify-send` via `node-notifier`

Todas as notificações são acionadas localmente, não passando pelos serviços em nuvem da OpenCode.

### O Plugin Rouba o Conteúdo das Minhas Sessões?

**Não**. O plugin lê apenas **metadados necessários**:

| Dados Lidos | Uso | Limitação |
| --- | --- | --- |
| Título da Sessão | Mensagem de notificação | Apenas 50 primeiros caracteres |
| Mensagem de Erro | Mensagem de notificação | Apenas 100 primeiros caracteres |
| Informações do Terminal | Detecção de foco e clique para focar | Não lê conteúdo do terminal |
| Arquivo de Configuração | Configurações personalizadas do usuário | Arquivo local |

No código-fonte não existe nenhuma lógica para ler mensagens de conversa ou entrada do usuário.

---

## Estratégias de Notificação

### Vou Ser Bombardeado por Notificações?

**Não**. O plugin possui mecanismos de filtragem inteligente múltiplos para evitar bombardeio de notificações.

**Estratégia Padrão de Notificação**:

| Tipo | Evento/Ferramenta | Notificar? | Justificativa |
| --- | --- | --- | --- |
| Evento | Sessão pai concluída (session.idle) | ✅ Sim | Tarefa principal concluída |
| Evento | Sessão filha concluída (session.idle) | ❌ Não | Sessão pai notificará em conjunto |
| Evento | Erro de sessão (session.error) | ✅ Sim | Requer atenção imediata |
| Evento | Solicitação de permissão (permission.updated) | ✅ Sim | IA aguardando bloqueio |
| Hook de Ferramentas | Pergunta (tool.execute.before - question) | ✅ Sim | IA precisa de entrada |

**Mecanismos de Filtragem Inteligente**:

1. **Apenas Notifica da Sessão Pai**
   - Código-fonte: `notify.ts:256-259`
   - Configuração padrão: `notifyChildSessions: false`
   - Evita notificações para cada subtarefa quando a IA divide tarefas

2. **Supressão quando Terminal em Foco** (macOS)
   - Código-fonte: `notify.ts:265`
   - Lógica: Não envia notificações quando o terminal é a janela em primeiro plano (comportamento interno, sem necessidade de configuração)
   - Evita lembretes duplicados "notificar enquanto olho para o terminal"
   - **Nota**: Esta função está disponível apenas no macOS (requer informações do terminal para detectar)

3. **Horário Silencioso**
   - Código-fonte: `notify.ts:262`, `notify.ts:181-199`
   - Configuração padrão: `quietHours: { enabled: false, start: "22:00", end: "08:00" }`
   - Configurável, evita perturbações noturnas

4. **Solicitações de Permissão Sempre Notificam**
   - Código-fonte: `notify.ts:319`
   - Justificativa: IA aguardando autorização do usuário, notificação oportuna necessária
   - Sem verificação de sessão pai

### Posso Receber Apenas Tipos Específicos de Notificações?

**Sim**. Embora o plugin não tenha interruptores separados para notificações, você pode usar horários silenciosos e detecção de foco do terminal para conseguir isso:

- **Apenas notificações urgentes**: Detecção de foco do terminal é comportamento interno, quando você está no terminal não recebe notificações (macOS)
- **Apenas notificações noturnas**: Ative horários silenciosos (ex: 09:00-18:00), use inversamente

Se precisar de controle mais granular, considere enviar uma Solicitação de Funcionalidade.

---

## Compatibilidade de Plugins

### O Plugin Conflita com Outros Plugins OpenCode?

**Não**. O plugin se integra através da API Padrão de Plugins OpenCode, não modificando o comportamento da IA ou interferindo em outros plugins.

**Método de Integração**:

| Componente | Método de Integração | Risco de Conflito |
| --- | --- | --- |
| Monitoramento de Eventos | Hook `event` do SDK OpenCode | ❌ Sem conflito |
| Hook de Ferramentas | Hook `tool.execute.before` da API de Plugins OpenCode (apenas monitora ferramenta `question`) | ❌ Sem conflito |
| Consulta de Sessão | `client.session.get()` do SDK OpenCode | ❌ Sem conflito (apenas leitura) |
| Envio de Notificação | Processo independente `node-notifier` | ❌ Sem conflito |

**Outros Plugins que Podem Coexistir**:

- Plugins oficiais OpenCode (ex: `opencode-coder`)
- Plugins de terceiros (ex: `opencode-db`, `opencode-browser`)
- Plugins personalizados

Todos os plugins funcionam em paralelo através da API Padrão de Plugins, sem interferir uns nos outros.

### Quais Plataformas São Suportadas? Existem Diferenças de Funcionalidade?

**Suporta as três principais plataformas: macOS, Windows e Linux, mas com diferenças de funcionalidade**.

| Funcionalidade | macOS | Windows | Linux |
| --- | --- | --- | --- |
| Notificações Nativas | ✅ Suportado | ✅ Suportado | ✅ Suportado |
| Sons Personalizados | ✅ Suportado | ❌ Não Suportado | ❌ Não Suportado |
| Detecção de Foco do Terminal | ✅ Suportado | ❌ Não Suportado | ❌ Não Suportado |
| Clique na Notificação para Focar | ✅ Suportado | ❌ Não Suportado | ❌ Não Suportado |
| Detecção Automática de Terminal | ✅ Suportado | ✅ Suportado | ✅ Suportado |
| Horário Silencioso | ✅ Suportado | ✅ Suportado | ✅ Suportado |

**Razões das Diferenças entre Plataformas**:

| Plataforma | Explicação das Diferenças |
| --- | --- |
| macOS | O sistema fornece APIs de notificação ricas e interfaces de gerenciamento de aplicativos (ex: `osascript`), suportando sons, detecção de foco e clique para focar |
| Windows | A API de notificação do sistema tem funcionalidade limitada, sem suporte para detecção de primeiro plano a nível de aplicativo e personalização de sons |
| Linux | Depende do padrão `notify-send`, funcionalidade similar ao Windows |

**Funcionalidades Principais em Todas as Plataformas**:

Independentemente da plataforma usada, as seguintes funcionalidades principais estão disponíveis:
- Notificação de conclusão de tarefa (session.idle)
- Notificação de erro (session.error)
- Notificação de solicitação de permissão (permission.updated)
- Notificação de pergunta (tool.execute.before)
- Configuração de horário silencioso

---

## Terminal e Sistema

### Quais Terminais São Suportados? Como é a Detecção?

**Suporta 37+ emuladores de terminal**.

O plugin usa a biblioteca [`detect-terminal`](https://github.com/jonschlinkert/detect-terminal) para identificar automaticamente o terminal, suportando terminais incluindo:

**Terminais macOS**:
- Ghostty, Kitty, iTerm2, WezTerm, Alacritty
- Terminal do macOS, Hyper, Warp
- Terminal integrado do VS Code (Code / Code - Insiders)

**Terminais Windows**:
- Windows Terminal, Git Bash, ConEmu, Cmder
- PowerShell, CMD (via detecção padrão)

**Terminais Linux**:
- gnome-terminal, konsole, xterm, lxterminal
- terminator, tilix, alacritty, kitty

**Mecanismo de Detecção**:

1. **Detecção Automática**: O plugin chama a biblioteca `detectTerminal()` na inicialização
2. **Substituição Manual**: Os usuários podem especificar o campo `terminal` no arquivo de configuração para substituir a detecção automática
3. **Mapeamento macOS**: Nomes de terminal são mapeados para nomes de processo (ex: `ghostty` → `Ghostty`), usados para detecção de foco

**Exemplo de Configuração**:

```json
{
  "terminal": "ghostty"
}
```

### O Que Acontece se a Detecção do Terminal Falhar?

**O plugin ainda funciona normalmente, apenas a funcionalidade de detecção de foco falha**.

**Lógica de Tratamento de Falhas**:

| Cenário de Falha | Comportamento | Impacto |
| --- | --- | --- |
| `detectTerminal()` retorna `null` | Informações do terminal são `{ name: null, bundleId: null, processName: null }` | Sem detecção de foco, mas notificações enviadas normalmente |
| Falha na execução do `osascript` do macOS | Falha na obtenção do Bundle ID | Funcionalidade de clique para focar do macOS falha, mas notificações normais |
| Valor `terminal` no arquivo de configuração inválido | Usa resultado da detecção automática | Se detecção automática também falhar, sem detecção de foco |

Lógica relevante no código-fonte (`notify.ts:149-150`):

```typescript
if (!terminalName) {
  return { name: null, bundleId: null, processName: null }
}
```

**Solução**:

Se a detecção do terminal falhar, você pode especificar manualmente o tipo de terminal:

```json
{
  "terminal": "iterm2"
}
```

---

## Configuração e Solução de Problemas

### Onde Está o Arquivo de Configuração? Como Modificar?

**Caminho do Arquivo de Configuração**: `~/.config/opencode/kdco-notify.json`

**Exemplo Completo de Configuração**:

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
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  },
  "terminal": "ghostty"
}
```

**Passos para Modificar a Configuração**:

1. Abra o terminal, edite o arquivo de configuração:
   ```bash
   # macOS/Linux
   nano ~/.config/opencode/kdco-notify.json
   
   # Windows
   notepad %USERPROFILE%\.config\opencode\kdco-notify.json
   ```

2. Modifique os itens de configuração (consulte o exemplo acima)

3. Salve o arquivo, a configuração entra em vigor automaticamente (sem necessidade de reiniciar)

### O Que Acontece se o Arquivo de Configuração Estiver Corrompido?

**O plugin usará a configuração padrão e tratará erros silenciosamente**.

**Lógica de Tratamento de Erros** (`notify.ts:110-113`):

```typescript
} catch {
  // Config doesn't exist or is invalid, use defaults
  return DEFAULT_CONFIG
}
```

**Solução**:

Se o arquivo de configuração estiver corrompido (erro de formato JSON), o plugin retornará para a configuração padrão. Passos para corrigir:

1. Delete o arquivo de configuração corrompido:
   ```bash
   rm ~/.config/opencode/kdco-notify.json
   ```

2. O plugin usará a configuração padrão e continuará funcionando

3. Se precisar de configuração personalizada, recrie o arquivo de configuração

---

## Resumo da Aula

Esta aula respondeu às perguntas mais comuns dos usuários:

- **Impacto no Desempenho**: O plugin não aumenta o contexto da IA, consumo de recursos extremamente baixo (CPU praticamente 0, memória < 5 MB)
- **Segurança e Privacidade**: Funciona completamente localmente, não faz upload de dados, lê apenas metadados necessários
- **Estratégia de Notificação**: Mecanismos de filtragem inteligente (apenas notifica sessão pai, supressão quando terminal em foco no macOS, horário silencioso)
- **Compatibilidade de Plugins**: Não conflita com outros plugins, suporta três plataformas principais mas com diferenças de funcionalidade
- **Suporte a Terminais**: Suporta 37+ terminais, ainda funciona normalmente quando detecção automática falha

---

## Prévia da Próxima Aula

> Na próxima aula aprenderemos sobre **[Tipos de Eventos](../../appendix/event-types/)**.
>
> Você aprenderá:
> - Os quatro tipos de eventos OpenCode que o plugin monitora
> - O momento de acionamento e conteúdo da notificação de cada tipo de evento
> - Regras de filtragem de eventos (verificação de sessão pai, horário silencioso, foco do terminal)
> - Diferenças no tratamento de eventos entre plataformas

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Última atualização: 2026-01-27

| Funcionalidade | Caminho do Arquivo | Linha |
| --- | --- | --- |
| Inicialização do Plugin e Carregamento de Configuração | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L357-L364) | 357-364 |
| Lógica de Monitoramento de Eventos | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L372-L400) | 372-400 |
| Verificação de Sessão Pai | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L256-L259) | 256-259 |
| Verificação de Horário Silencioso | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L262) | 262 |
| Detecção de Foco do Terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L265) | 265 |
| Carregamento do Arquivo de Configuração | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |
| Detecção de Informações do Terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L176) | 145-176 |
| Definição de Configuração Padrão | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |

**Constantes Principais**:
- `DEFAULT_CONFIG`: Configuração padrão (apenas notifica sessão pai, sons Glass/Basso/Submarine, horário silencioso desativado por padrão)

**Funções Principais**:
- `loadConfig()`: Carrega configuração do usuário e mescla com padrões
- `detectTerminalInfo()`: Detecta informações do terminal e armazena em cache
- `isQuietHours()`: Verifica se a hora atual está no horário silencioso
- `isTerminalFocused()`: Verifica se o terminal é a janela em primeiro plano (macOS)
- `isParentSession()`: Verifica se a sessão é uma sessão pai

</details>
