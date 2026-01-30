---
title: "Uso Avançado: Dicas de Configuração e Melhores Práticas | Tutorial opencode-notify"
sidebarTitle: "Otimize a experiência de notificação em 5 minutos"
subtitle: "Uso Avançado: Dicas de Configuração e Melhores Práticas | Tutorial opencode-notify"
description: "Aprenda dicas avançadas de configuração do opencode-notify, incluindo filtragem de sessões pai, personalização de sons, configuração de terminal e silenciamento temporário para otimizar a experiência de notificação."
tags:
  - "Configuração"
  - "Melhores Práticas"
  - "Sons"
prerequisite:
  - "start-quick-start"
  - "advanced-config-reference"
order: 100
---

# Uso Avançado: Dicas de Configuração e Melhores Práticas

## O Que Você Vai Aprender

- Entender por que apenas sessões pai são notificadas por padrão, reduzindo o ruído de notificações
- Personalizar sons de notificação do macOS para distinguir diferentes tipos de eventos
- Especificar manualmente o tipo de terminal para resolver problemas de detecção automática
- Configurar silenciamento temporário para evitar interrupções durante reuniões ou períodos de foco
- Otimizar a estratégia de notificações, equilibrando prontidão e interferência

## Sua Situação Atual

Embora o plugin de notificação seja conveniente, a configuração padrão pode não se adequar aos hábitos de trabalho de todos:

- Quer rastrear todas as subtarefas de IA, mas por padrão apenas sessões pai são notificadas
- Usa um terminal menos comum e a detecção automática falha
- Deseja silenciar temporariamente durante reuniões, mas não quer modificar o arquivo de configuração toda vez
- Diferentes tipos de eventos usam o mesmo som, dificultando a distinção entre tarefa concluída ou erro

## Quando Usar Esta Técnica

Quando você já está familiarizado com o uso básico do plugin e deseja otimizar a experiência de notificação de acordo com seu fluxo de trabalho pessoal.

---

## Conceito Central

A configuração padrão do plugin de notificação foi cuidadosamente projetada, mas você pode ajustar o comportamento através do arquivo de configuração. O princípio central é:

**Reduzir o Ruído, Aumentar o Valor**

- **Filtragem de Sessões Pai**: Notifica apenas tarefas principais, ignorando subtarefas internas de IA
- **Consciência de Foco**: Não notifica quando o terminal está ativo, evitando lembretes repetidos
- **Notificações em Lote**: Mescla notificações quando várias tarefas são concluídas simultaneamente

::: info Dica
Todos os itens de configuração são detalhadamente explicados em [Referência de Configuração](../config-reference/). Esta lição foca em dicas de uso prático e melhores práticas.
:::

---

## 🎒 Preparação Antes de Começar

Certifique-se de ter concluído o [Início Rápido](../../start/quick-start/) e recebido sua primeira notificação com sucesso.

---

## Siga Comigo

### Passo 1: Entender a Filtragem de Sessões Pai

**Por Quê**

As sessões do OpenCode têm uma estrutura em árvore: uma sessão pai pode ter várias sessões filhas. Por padrão, o plugin notifica apenas a conclusão da sessão pai, evitando o ruído de notificações de subtarefas.

**Verificar Configuração**

Edite o arquivo de configuração:

```bash
# macOS/Linux
~/.config/opencode/kdco-notify.json

# Windows
%APPDATA%\opencode\kdco-notify.json
```

```json
{
  "notifyChildSessions": false  // ← padrão é false
}
```

**O Que Você Deve Ver**:
- `notifyChildSessions: false` significa que apenas a sessão raiz é notificada
- Chamadas internas de ferramentas filhas executadas pela IA não acionam notificações

**Quando Habilitar Notificações de Sessões Filhas**

Se precisar rastrear cada subtarefa (como depurar fluxos de trabalho de múltiplas etapas), defina como `true`:

```json
{
  "notifyChildSessions": true  // ← após habilitar, cada subtarefa será notificada
}
```

::: warning Atenção
Habilitar notificações de sessões filhas aumentará significativamente a frequência de notificações, use com cautela.
:::

---

### Passo 2: Personalizar Sons de Notificação do macOS

**Por Quê**

Usar sons diferentes para diferentes tipos de eventos permite que você saiba o que aconteceu sem olhar a notificação.

**Verificar Sons Disponíveis**

O sistema macOS oferece 14 sons integrados:

| Nome do Som | Cenário de Uso | Estilo |
| --- | --- | --- |
| Glass | Tarefa concluída (padrão) | Cristalino |
| Basso | Erro (padrão) | Grave |
| Submarine | Solicitação de permissão (padrão) | Suave |
| Bottle | Evento especial | Leve |
| Ping | Lembrete geral | Simples |
| Pop | Evento casual | Animado |
| Purr | Evento de sucesso | Suave |
| Blow | Aviso | Urgente |
| Funk | Marcação especial | Único |
| Frog | Lembrete | Alto |
| Hero | Evento importante | Grandioso |
| Morse | Notificação | Rítmico |
| Sosumi | Alerta do sistema | Clássico |
| Tink | Conclusão | Leve |

**Personalizar Sons**

Modifique a seção `sounds` na configuração:

```json
{
  "sounds": {
    "idle": "Ping",        // Tarefa concluída
    "error": "Blow",      // Erro (mais urgente)
    "permission": "Pop",   // Solicitação de permissão (mais leve)
    "question": "Tink"    // Pergunta (opcional, usa som de permissão por padrão)
  }
}
```

**O Que Você Deve Ver**:
- Após a modificação, diferentes tipos de eventos reproduzem os sons correspondentes
- Se `sounds.question` não estiver definido, usará o som de `sounds.permission`

::: tip Dica
Os sons só funcionam no macOS; Windows e Linux usam sons de notificação padrão do sistema.
:::

---

### Passo 3: Especificar Manualmente o Tipo de Terminal

**Por Quê**

A biblioteca `detect-terminal` suporta 37+ terminais, mas terminais menos comuns ou versões personalizadas podem não ser reconhecidos.

**Verificar Terminal Detectado Atualmente**

Não é possível visualizar diretamente os resultados da detecção no momento, mas pode-se inferir através dos logs:

```bash
# A interface do OpenCode exibirá os logs de inicialização do plugin
```

Se vir algo como "Terminal detection failed" ou notificações que não conseguem focar, pode ser necessário especificar manualmente.

**Especificar Terminal Manualmente**

Adicione o campo `terminal` na configuração:

```json
{
  "terminal": "wezterm"  // use o nome do terminal em minúsculas
}
```

**Nomes de Terminais Suportados**

Nomes comuns de terminais (não diferenciam maiúsculas/minúsculas):

| Terminal | Valor de Configuração |
| --- | --- |
| Ghostty | `"ghostty"` |
| Kitty | `"kitty"` |
| iTerm2 | `"iterm"` ou `"iterm2"` |
| WezTerm | `"wezterm"` |
| Alacritty | `"alacritty"` |
| Terminal do macOS | `"terminal"` ou `"apple_terminal"` |
| Hyper | `"hyper"` |
| Terminal do VS Code | `"code"` ou `"code-insiders"` |

**O Que Você Deve Ver**:
- Após especificar manualmente, a detecção de foco do macOS e a função de clique para focar funcionam corretamente
- Se a especificação for inválida, o plugin falhará silenciosamente e retornará à detecção automática

---

### Passo 4: Silenciar Notificações Temporariamente

**Por Quê**

Durante reuniões, revisões de código ou períodos de foco, você pode querer não receber notificações temporariamente.

**Usar Períodos de Silêncio**

Se você tem horários fixos todos os dias (como à noite) em que não deseja ser interrompido, configure períodos de silêncio:

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",  // 22:00
    "end": "08:00"     // 08:00 do dia seguinte
  }
}
```

**Suporte a Períodos Que Cruzam a Meia-Noite**

Os períodos de silêncio podem cruzar a meia-noite (como 22:00-08:00):

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"     // 22:00 - 08:00 do dia seguinte
  }
}
```

**O Que Você Deve Ver**:
- Durante o período de silêncio, nenhum evento envia notificações
- Fora do período, as notificações normais são restauradas

::: tip Dica
O formato de hora deve ser `HH:MM` (formato 24 horas), como `"22:30"`.
:::

---

### Passo 5: Equilibrar a Estratégia de Notificações

**Por Quê**

A configuração padrão já está otimizada, mas você pode precisar ajustar de acordo com seu fluxo de trabalho.

**Resumo da Estratégia Padrão**

| Item de Configuração | Valor Padrão | Efeito |
| --- | --- | --- |
| `notifyChildSessions` | `false` | Notifica apenas sessões pai |
| `quietHours.enabled` | `false` | Não habilita períodos de silêncio |

::: info Dica
A função de detecção de foco (não notifica quando o terminal está ativo) está hardcoded habilitada e não pode ser desativada através da configuração.
:::

**Combinações de Configuração Recomendadas**

**Cenário 1: Busca por Mínima Interferência (Padrão)**

```json
{
  "notifyChildSessions": false
}
```

**Cenário 2: Rastrear Todas as Tarefas**

```json
{
  "notifyChildSessions": true
}
```

::: warning Atenção
Isso aumentará significativamente a frequência de notificações, adequado para cenários que requerem monitoramento granular.
:::

**Cenário 3: Silêncio Noturno**

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

**O Que Você Deve Ver**:
- Dependendo do cenário, o comportamento das notificações difere significativamente
- Ajuste gradualmente para encontrar a configuração mais adequada para você

---

## Ponto de Verificação ✅

Após concluir a configuração, verifique o seguinte:

| Item de Verificação | Método de Verificação |
| --- | --- |
| Filtragem de Sessões Pai | Acione uma tarefa de IA com subtarefas, deve receber apenas uma notificação "Ready for review" |
| Personalização de Sons | Acione conclusão de tarefa, erro e solicitação de permissão separadamente, deve ouvir sons diferentes |
| Substituição de Terminal | No macOS, clique na notificação, a janela do terminal deve ser corretamente trazida para frente |
| Período de Silêncio | Acione um evento durante o período de silêncio, não deve receber notificação |

---

## Alertas de Problemas Comuns

### Modificação de Configuração Não Entra em Vig

**Problema**: Após modificar o arquivo de configuração, o comportamento das notificações não muda.

**Causa**: O OpenCode pode precisar reiniciar o plugin ou o próprio OpenCode.

**Solução**: Reinicie a CLI do OpenCode ou a interface do OpenCode.

---

### Som Não Reproduz

**Problema**: Configurou som personalizado, mas ainda ouve o som padrão.

**Causa**:
- Nome do som digitado incorretamente
- Não está na plataforma macOS

**Solução**:
- Verifique se o nome do som está na lista de suporte (diferencia maiúsculas/minúsculas)
- Confirme que está usando o sistema macOS

---

### Substituição de Terminal Inválida

**Problema**: Definiu o campo `terminal`, mas clicar na notificação ainda não consegue focar.

**Causa**:
- Nome do terminal incorreto
- Nome do processo do terminal não corresponde ao valor de configuração

**Solução**:
- Tente usar nome em minúsculas
- Consulte a lista de [Terminais Suportados](../../platforms/terminals/)

---

## Resumo da Lição

Nesta lição, aprendemos sobre uso avançado e melhores práticas do opencode-notify:

- **Filtragem de Sessões Pai**: Por padrão, notifica apenas a sessão raiz, evitando ruído de subtarefas
- **Personalização de Sons**: No macOS, pode personalizar 14 sons para distinguir tipos de eventos
- **Substituição de Terminal**: Especifica manualmente o tipo de terminal para resolver problemas de detecção automática
- **Silêncio Temporário**: Define períodos de silêncio através de `quietHours`
- **Equilíbrio de Estratégia**: Ajusta configurações de acordo com o fluxo de trabalho, equilibrando prontidão e interferência

**Princípio Central**: Reduzir o ruído, aumentar o valor. A configuração padrão já está otimizada e na maioria dos casos não precisa ser modificada.

---

## Próxima Lição

> Na próxima lição, aprenderemos **[Solução de Problemas](../../faq/troubleshooting/)**.
>
> Você vai aprender:
> - O que fazer quando as notificações não aparecem
> - Como diagnosticar falhas na detecção de foco
> - Interpretação de mensagens de erro comuns
> - Soluções para problemas específicos de plataforma

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-27

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Detecção de Sessão Pai | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L205-L214) | 205-214 |
| Schema de Configuração | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L30-L68) | 30-68 |
| Configuração Padrão | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |
| Lista de Sons do macOS | [`README.md`](https://github.com/kdcokenny/opencode-notify/blob/main/README.md#L81) | 81 |
</details>

**Constantes Principais**:
- `DEFAULT_CONFIG`: Valores de configuração padrão
- `TERMINAL_PROCESS_NAMES`: Tabela de mapeamento de nomes de terminal para nomes de processo do macOS

**Funções Principais**:
- `isParentSession()`: Determina se uma sessão é uma sessão pai
- `loadConfig()`: Carrega e mescla configurações do usuário
