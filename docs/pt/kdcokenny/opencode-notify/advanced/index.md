---
title: "Uso Avançado: Configuração Profunda e Otimização | Tutorial opencode-notify"
sidebarTitle: "Personalize sua experiência de notificação"
subtitle: "Uso Avançado: Configuração Profunda e Otimização"
description: "Aprenda configuração avançada do opencode-notify: referência de configuração, horários silenciosos, detecção de terminal e melhores práticas. Otimize a experiência de notificação de acordo com suas necessidades e melhore a eficiência do trabalho."
tags:
  - "Avançado"
  - "Configuração"
  - "Otimização"
prerequisite:
  - "../../start/quick-start/"
  - "../../start/how-it-works/"
order: 3
---

# Uso Avançado: Configuração Profunda e Otimização

Esta seção ajuda você a dominar os recursos avançados do opencode-notify, entendendo profundamente as opções de configuração, otimizando a experiência de notificação e personalizando o comportamento das notificações de acordo com suas necessidades.

## Caminho de Aprendizado

Recomenda-se estudar o conteúdo desta seção na seguinte ordem:

### 1. [Referência de Configuração](./config-reference/)

Entenda completamente todas as opções de configuração disponíveis e suas funções.

- Domine a estrutura e sintaxe dos arquivos de configuração
- Aprenda métodos de personalização de efeitos sonoros de notificação
- Entenda os cenários de uso do interruptor de notificação de sub-sessão
- Conheça o método de configuração de substituição de tipo de terminal

### 2. [Detalhes dos Horários Silenciosos](./quiet-hours/)

Aprenda como definir horários silenciosos para evitar interrupções em horários específicos.

- Configure o início e o fim dos horários silenciosos
- Trate horários silenciosos que atravessam a noite (por exemplo, 22:00 - 08:00)
- Desabilite temporariamente o recurso silencioso quando necessário
- Entenda a prioridade dos horários silenciosos em relação a outras regras de filtragem

### 3. [Princípios de Detecção de Terminal](./terminal-detection/)

Aprofunde-se no mecanismo de funcionamento da detecção automática de terminal.

- Aprenda como o plugin identifica mais de 37 tipos de emuladores de terminal
- Entenda a implementação da detecção de foco na plataforma macOS
- Domine o método de especificação manual do tipo de terminal
- Entenda o comportamento padrão quando a detecção falha

### 4. [Uso Avançado](./advanced-usage/)

Domine técnicas de configuração e melhores práticas.

- Estratégias de configuração para evitar spam de notificações
- Ajuste o comportamento das notificações de acordo com o fluxo de trabalho
- Recomendações de configuração para ambientes de múltiplas janelas e múltiplos terminais
- Otimização de desempenho e técnicas de solução de problemas

## Pré-requisitos

Antes de começar o estudo desta seção, recomenda-se completar primeiro os seguintes conteúdos básicos:

- ✅ **Início Rápido**: Conclua a instalação e configuração básica do plugin
- ✅ **Como Funciona**: Entenda os recursos principais do plugin e o mecanismo de monitoramento de eventos
- ✅ **Recursos da Plataforma** (opcional): Conheça os recursos específicos da plataforma que você está usando

::: tip Sugestão de Aprendizado
Se você apenas deseja personalizar os efeitos sonoros de notificação ou definir horários silenciosos, pode ir diretamente para as subpáginas correspondentes. Se encontrar problemas, pode consultar a seção de referência de configuração a qualquer momento.
:::

## Próximos Passos

Após concluir o estudo desta seção, você pode continuar explorando:

- **[Solução de Problemas](../../faq/troubleshooting/)**: Resolva problemas comuns e dificuldades
- **[Perguntas Frequentes](../../faq/common-questions/)**: Entenda os tópicos de maior interesse dos usuários
- **[Explicação dos Tipos de Eventos](../../appendix/event-types/)**: Aprofunde-se em todos os tipos de eventos monitorados pelo plugin
- **[Exemplos de Arquivos de Configuração](../../appendix/config-file-example/)**: Visualize exemplos completos de configuração e comentários

---

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Tempo de atualização: 2026-01-27

| Funcionalidade | Caminho do Arquivo                                                                                    | Linha    |
|--- | --- | ---|
| Definição da Interface de Configuração | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L30-L48) | 30-48   |
| Configuração Padrão    | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68   |
| Carregamento de Configuração    | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114  |
| Verificação de Horários Silenciosos | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L181-L199) | 181-199 |
| Detecção de Terminal    | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L176) | 145-176 |
| Mapeamento de Nomes de Processos de Terminal | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84   |

**Interfaces Principais**:
- `NotifyConfig`: Interface de configuração, contém todos os itens configuráveis
- `quietHours`: Configuração de horários silenciosos (enabled/start/end)
- `sounds`: Configuração de sons (idle/error/permission)
- `terminal`: Substituição de tipo de terminal (opcional)

**Constantes Principais**:
- `DEFAULT_CONFIG`: Valores padrão de todos os itens de configuração
- `TERMINAL_PROCESS_NAMES`: Tabela de mapeamento de nomes de terminal para nomes de processos macOS

</details>
