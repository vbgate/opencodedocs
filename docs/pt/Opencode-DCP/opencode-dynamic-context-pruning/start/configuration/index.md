---
title: "Configuração: Sistema Multi-Camadas DCP | opencode-dcp"
sidebarTitle: "Personalizar DCP Sob Demanda"
subtitle: "Configuração: Sistema Multi-Camadas DCP"
description: "Aprenda o sistema de configuração multi-camadas do opencode-dcp. Domine as regras de prioridade para configurações globais, de ambiente e de projeto, configuração de estratégias de poda, mecanismos de proteção e ajustes de nível de notificação."
tags:
  - "Configuração"
  - "DCP"
  - "Configurações de Plugin"
prerequisite:
  - "start-getting-started"
order: 2
---

# Guia Completo de Configuração do DCP

## O Que Você Vai Aprender

- Dominar o sistema de configuração de três níveis do DCP (global, projeto, variáveis de ambiente)
- Entender as regras de prioridade de configuração e saber qual configuração será aplicada
- Ajustar estratégias de poda e mecanismos de proteção conforme necessário
- Configurar níveis de notificação para controlar o detalhamento dos avisos de poda

## Seu Dilema Atual

O DCP funciona com as configurações padrão após a instalação, mas você pode encontrar estes problemas:

- Quer definir diferentes estratégias de poda para projetos diferentes
- Não quer que certos arquivos sejam podados
- Os avisos de poda são muito frequentes ou muito detalhados
- Quer desativar uma estratégia de poda automática específica

Neste momento, você precisa entender o sistema de configuração do DCP.

## Quando Usar Esta Técnica

- **Personalização a Nível de Projeto**: Diferentes projetos têm necessidades diferentes de poda
- **Depuração de Problemas**: Ativar logs de debug para localizar problemas
- **Otimização de Performance**: Ajustar chaves de estratégia e limites
- **Experiência Personalizada**: Modificar níveis de notificação, proteger ferramentas críticas

## Conceito Central

O DCP adota um **sistema de configuração de três níveis**, com prioridade do mais baixo para o mais alto:

```
Valores Padrão (codificados) → Configuração Global → Configuração de Variáveis de Ambiente → Configuração de Projeto
         Prioridade Mais Baixa                              Prioridade Mais Alta
```

Cada nível de configuração substitui a configuração de mesmo nome do nível anterior, então a configuração de projeto tem a prioridade mais alta.

::: info Por Que Precisamos de Configuração Multi-Camadas?

O objetivo deste design é:
- **Configuração Global**: Definir comportamentos padrão comuns, aplicáveis a todos os projetos
- **Configuração de Projeto**: Personalizar para projetos específicos sem afetar outros projetos
- **Variáveis de Ambiente**: Alternar rapidamente entre configurações em diferentes ambientes (como CI/CD)

:::

## 🎒 Preparação Antes de Começar

Certifique-se de ter concluído a [Instalação e Início Rápido](../getting-started/), e que o plugin DCP foi instalado com sucesso e está em execução no OpenCode.

## Siga Comigo

### Passo 1: Visualizar Configuração Atual

**Por Quê**
Entender a configuração padrão primeiro, depois decidir como ajustar.

O DCP cria automaticamente o arquivo de configuração global na primeira execução.

```bash
# macOS/Linux
cat ~/.config/opencode/dcp.jsonc

# Windows PowerShell
Get-Content "$env:USERPROFILE\.config\opencode\dcp.jsonc"
```

**Você Deverá Ver**: Uma configuração padrão similar à abaixo

```jsonc
{
    "$schema": "https://raw.githubusercontent.com/Opencode-DCP/opencode-dynamic-context-pruning/master/dcp.schema.json",
    "enabled": true,
    "debug": false,
    "pruneNotification": "detailed",
    "commands": {
        "enabled": true,
        "protectedTools": []
    },
    "turnProtection": {
        "enabled": false,
        "turns": 4
    },
    "protectedFilePatterns": [],
    "tools": {
        "settings": {
            "nudgeEnabled": true,
            "nudgeFrequency": 10,
            "protectedTools": []
        },
        "discard": {
            "enabled": true
        },
        "extract": {
            "enabled": true,
            "showDistillation": false
        }
    },
    "strategies": {
        "deduplication": {
            "enabled": true,
            "protectedTools": []
        },
        "supersedeWrites": {
            "enabled": false
        },
        "purgeErrors": {
            "enabled": true,
            "turns": 4,
            "protectedTools": []
        }
    }
}
```

### Passo 2: Entender a Localização dos Arquivos de Configuração

O DCP suporta arquivos de configuração em três níveis:

| Nível | Caminho | Prioridade | Cenário de Uso |
| --- | --- | --- | --- |
| **Global** | `~/.config/opencode/dcp.jsonc` ou `dcp.json` | 2 | Configuração padrão para todos os projetos |
| **Variáveis de Ambiente** | `$OPENCODE_CONFIG_DIR/dcp.jsonc` ou `dcp.json` | 3 | Configuração para ambientes específicos |
| **Projeto** | `<project>/.opencode/dcp.jsonc` ou `dcp.json` | 4 | Substituição de configuração para projeto individual |

::: tip Formato do Arquivo de Configuração

O DCP suporta dois formatos `.json` e `.jsonc`:
- `.json`: Formato JSON padrão, não pode conter comentários
- `.jsonc`: Formato JSON que suporta comentários `//` (recomendado)

:::

### Passo 3: Configurar Notificações de Poda

**Por Quê**
Controlar o nível de detalhamento dos avisos de poda do DCP, evitando interrupções excessivas.

Edite o arquivo de configuração global:

```jsonc
{
    "pruneNotification": "detailed"  // Valores opcionais: "off", "minimal", "detailed"
}
```

**Descrição dos Níveis de Notificação**:

| Nível | Comportamento | Cenário de Uso |
| --- | --- | --- |
| **off** | Não exibe notificações de poda | Desenvolvimento focado, sem necessidade de feedback |
| **minimal** | Exibe apenas estatísticas resumidas (tokens economizados) | Precisa de feedback simples, sem muitas informações |
| **detailed** | Exibe informações detalhadas da poda (nome da ferramenta, motivo) | Entender comportamento de poda, depurar configuração |

**Você Deverá Ver**: Após modificar a configuração, as notificações serão exibidas de acordo com o novo nível na próxima vez que a poda for acionada.

### Passo 4: Configurar Estratégias de Poda Automática

**Por Quê**
O DCP fornece três estratégias de poda automática, que você pode ativar ou desativar conforme necessário.

Edite o arquivo de configuração:

```jsonc
{
    "strategies": {
        // Estratégia de desduplicação: Remove chamadas de ferramentas duplicadas
        "deduplication": {
            "enabled": true,           // Ativar/Desativar
            "protectedTools": []         // Nomes de ferramentas adicionais protegidas
        },

        // Estratégia de substituição de escrita: Limpa operações de escrita substituídas por leituras subsequentes
        "supersedeWrites": {
            "enabled": false          // Desativado por padrão
        },

        // Estratégia de limpeza de erros: Limpa entradas de ferramentas de erro expiradas
        "purgeErrors": {
            "enabled": true,           // Ativar/Desativar
            "turns": 4,               // Limpar erros após quantos turnos
            "protectedTools": []         // Nomes de ferramentas adicionais protegidas
        }
    }
}
```

**Detalhamento das Estratégias**:

- **deduplication (desduplicação)**: Ativado por padrão. Detecta chamadas de mesma ferramenta e parâmetros, mantém apenas a mais recente.
- **supersedeWrites (substituição de escrita)**: Desativado por padrão. Se houver leitura subsequente após operação de escrita, limpa a entrada dessa operação de escrita.
- **purgeErrors (limpeza de erros)**: Ativado por padrão. Ferramentas de erro que excedem o número especificado de turnos serão podadas (mantém apenas mensagem de erro, remove parâmetros de entrada possivelmente grandes).

### Passo 5: Configurar Mecanismos de Proteção

**Por Quê**
Evitar poda acidental de conteúdo crítico (como arquivos importantes, ferramentas centrais).

O DCP fornece três mecanismos de proteção:

#### 1. Proteção de Turno (Turn Protection)

Protege saídas de ferramentas dos turnos mais recentes, dando tempo suficiente para a IA referenciá-las.

```jsonc
{
    "turnProtection": {
        "enabled": false,   // Após ativação, protege os últimos 4 turnos
        "turns": 4          // Número de turnos protegidos
    }
}
```

**Cenário de Uso**: Quando você descobre que a IA está perdendo contexto frequentemente, pode ativar esta opção.

#### 2. Ferramentas Protegidas (Protected Tools)

Certas ferramentas nunca serão podadas por padrão:

```
task, todowrite, todoread, discard, extract, batch, write, edit, plan_enter, plan_exit
```

Você pode adicionar ferramentas adicionais que precisam de proteção:

```jsonc
{
    "tools": {
        "settings": {
            "protectedTools": [
                "myCustomTool",   // Adicionar ferramenta personalizada
                "databaseQuery"    // Adicionar ferramenta que precisa de proteção
            ]
        }
    },
    "strategies": {
        "deduplication": {
            "protectedTools": ["databaseQuery"]  // Proteger ferramenta para estratégia específica
        }
    }
}
```

#### 3. Padrões de Arquivos Protegidos (Protected File Patterns)

Use padrões glob para proteger arquivos específicos:

```jsonc
{
    "protectedFilePatterns": [
        "**/*.config.ts",           // Proteger todos os arquivos .config.ts
        "**/secrets/**",           // Proteger todos os arquivos no diretório secrets
        "**/*.env",                // Proteger arquivos de variáveis de ambiente
        "**/critical/*.json"        // Proteger arquivos JSON no diretório critical
    ]
}
```

::: warning Atenção
protectedFilePatterns corresponde a `tool.parameters.filePath`, não ao caminho real do arquivo. Isso significa que se aplica apenas a ferramentas com parâmetro `filePath` (como read, write, edit).

:::

### Passo 6: Criar Configuração a Nível de Projeto

**Por Quê**
Diferentes projetos podem precisar de diferentes estratégias de poda.

Crie o diretório `.opencode` na raiz do projeto (se não existir), depois crie `dcp.jsonc`:

```bash
# Execute na raiz do projeto
mkdir -p .opencode
cat > .opencode/dcp.jsonc << 'EOF'
{
    "$schema": "https://raw.githubusercontent.com/Opencode-DCP/opencode-dynamic-context-pruning/master/dcp.schema.json",
    // Configuração específica deste projeto
    "strategies": {
        "supersedeWrites": {
            "enabled": true   // Ativar estratégia de substituição de escrita neste projeto
        }
    },
    "protectedFilePatterns": [
        "**/config/**/*.ts"   // Proteger arquivos de configuração deste projeto
    ]
}
EOF
```

**Você Deverá Ver**:
- A configuração de nível de projeto substituirá itens de mesmo nome na configuração global
- Itens não substituídos continuarão usando a configuração global

### Passo 7: Ativar Logs de Depuração

**Por Quê**
Quando encontrar problemas, visualize logs de depuração detalhados.

Edite o arquivo de configuração:

```jsonc
{
    "debug": true
}
```

**Localização dos Logs**:
```
~/.config/opencode/logs/dcp/daily/YYYY-MM-DD.log
```

**Você Deverá Ver**: O arquivo de log contém informações detalhadas sobre operações de poda, carregamento de configuração, etc.

::: info Recomendação para Ambiente de Produção
Após concluir a depuração, lembre-se de alterar `debug` de volta para `false`, para evitar crescimento excessivo dos arquivos de log.

:::

## Pontos de Verificação ✅

Após concluir os passos acima, confirme o seguinte:

- [ ] Sabe os três níveis de arquivos de configuração e suas prioridades
- [ ] Consegue modificar o nível de notificação e ver o efeito
- [ ] Entende a função das três estratégias de poda automática
- [ ] Sabe configurar mecanismos de proteção (turno, ferramenta, arquivo)
- [ ] Consegue criar configuração de nível de projeto para substituir configurações globais

## Alertas de Armadilhas

### Modificação de Configuração Não Entra em Vig

**Problema**: Após modificar o arquivo de configuração, o OpenCode não reage.

**Causa**: O OpenCode não recarrega automaticamente o arquivo de configuração.

**Solução**: Após modificar a configuração, é necessário **reiniciar o OpenCode**.

### Erro de Sintaxe no Arquivo de Configuração

**Problema**: O arquivo de configuração tem erro de sintaxe, DCP não consegue analisar.

**Manifestação**: O OpenCode exibirá aviso Toast "Invalid config".

**Solução**: Verifique a sintaxe JSON, especialmente:
- Aspas, vírgulas, parênteses estão balanceados
- Não há vírgulas extras (como após o último elemento)
- Valores booleanos usam `true`/`false`, não use aspas

**Prática Recomendada**: Use editor que suporte JSONC (como VS Code + plugin JSONC).

### Ferramentas Protegidas Não Funcionam

**Problema**: Adicionou `protectedTools`, mas a ferramenta ainda é podada.

**Causa**:
1. Nome da ferramenta digitado incorretamente
2. Adicionou ao array `protectedTools` errado (como `tools.settings.protectedTools` vs `strategies.deduplication.protectedTools`)
3. A chamada da ferramenta está dentro do período de proteção de turno (se proteção de turno estiver ativada)

**Solução**:
1. Confirme que o nome da ferramenta está digitado corretamente
2. Verifique se foi adicionado na localização correta
3. Consulte os logs de debug para entender o motivo da poda

## Resumo da Aula

Pontos-chave do sistema de configuração do DCP:

- **Configuração de Três Níveis**: Valores padrão → Global → Variáveis de ambiente → Projeto, prioridade crescente
- **Substituição Flexível**: Configuração de projeto pode substituir configuração global
- **Mecanismos de Proteção**: Proteção de turno, ferramentas protegidas, padrões de arquivos protegidos, evitam poda acidental
- **Estratégias Automáticas**: Desduplicação, substituição de escrita, limpeza de erros, ative conforme necessário
- **Reinício para Efeito**: Após modificar configuração, lembre-se de reiniciar o OpenCode

## Próxima Aula

> Na próxima aula aprenderemos **[Detalhamento das Estratégias de Poda Automática](../../platforms/auto-pruning/)**.
>
> Você vai aprender:
> - Como a estratégia de desduplicação detecta chamadas de ferramentas duplicadas
> - Princípio de funcionamento da estratégia de substituição de escrita
> - Condições de acionamento da estratégia de limpeza de erros
> - Como monitorar o efeito das estratégias

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Data de atualização: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Número da Linha |
| --- | --- | --- |
| Núcleo de Gerenciamento de Configuração | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 1-798 |
| Schema de Configuração | [`dcp.schema.json`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/dcp.schema.json) | 1-232 |
| Configuração Padrão | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L423-L464) | 423-464 |
| Prioridade de Configuração | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L669-L797) | 669-797 |
| Validação de Configuração | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L147-L375) | 147-375 |
| Caminho do Arquivo de Configuração | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L484-L526) | 484-526 |
| Ferramentas Protegidas por Padrão | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-L79) | 68-79 |
| Mesclar Configuração de Estratégias | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L565-L595) | 565-595 |
| Mesclar Configuração de Ferramentas | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L597-L622) | 597-622 |

**Constantes-Chave**:
- `DEFAULT_PROTECTED_TOOLS`: Lista de nomes de ferramentas protegidas por padrão (`lib/config.ts:68-79`)

**Funções-Chave**:
- `getConfig()`: Carrega e mescla configurações de todos os níveis (`lib/config.ts:669-797`)
- `getInvalidConfigKeys()`: Valida chaves inválidas no arquivo de configuração (`lib/config.ts:135-138`)
- `validateConfigTypes()`: Valida tipos de valores de configuração (`lib/config.ts:147-375`)
- `getConfigPaths()`: Obtém caminhos de todos os arquivos de configuração (`lib/config.ts:484-526`)

</details>
