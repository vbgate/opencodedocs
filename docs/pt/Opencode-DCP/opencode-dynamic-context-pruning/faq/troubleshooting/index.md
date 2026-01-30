---
title: "FAQ: Resolução de Problemas | opencode-dcp"
sidebarTitle: "O que fazer ao encontrar problemas"
subtitle: "Perguntas Frequentes e Resolução de Problemas"
description: "Aprenda a resolver problemas comuns ao usar o OpenCode DCP, incluindo correção de erros de configuração, ativação de métodos de depuração, razões para Tokens não serem reduzidos e outras técnicas de resolução de problemas."
tags:
  - "FAQ"
  - "troubleshooting"
  - "configuração"
  - "depuração"
prerequisite:
  - "start-getting-started"
order: 1
---

# Perguntas Frequentes e Resolução de Problemas

## Problemas de Configuração

### Por que minha configuração não está funcionando?

Os arquivos de configuração do DCP são mesclados por prioridade: **Padrão < Global < Variáveis de Ambiente < Projeto**. A configuração de nível de projeto tem a maior prioridade.

**Etapas de verificação**:

1. **Confirme a localização do arquivo de configuração**:
   ```bash
   # macOS/Linux
   ls -la ~/.config/opencode/dcp.jsonc
   ls -la ~/.config/opencode/dcp.json

   # Ou no diretório raiz do projeto
   ls -la .opencode/dcp.jsonc
   ```

2. **Visualize a configuração em vigor**:
   Após ativar o modo de depuração, o DCP exibirá as informações de configuração no arquivo de log na primeira vez que carregar a configuração.

3. **Reinicie o OpenCode**:
   Após modificar a configuração, você deve reiniciar o OpenCode para que as alterações entrem em vigor.

::: tip Prioridade de Configuração
Se você tiver vários arquivos de configuração ao mesmo tempo, a configuração de nível de projeto (`.opencode/dcp.jsonc`) substituirá a configuração global.
:::

### O que fazer se o arquivo de configuração apresentar erros?

O DCP exibirá um aviso Toast (aparece após 7 segundos) quando detectar erros de configuração e usará os valores padrão como fallback.

**Tipos de erros comuns**:

| Tipo de Erro | Descrição do Problema | Solução |
| --- | --- | --- |
| Erro de Tipo | `pruneNotification` deve ser `"off" | "minimal" | "detailed"` | Verifique a ortografia dos valores de enumeração |
| Erro de Array | `protectedFilePatterns` deve ser um array de strings | Certifique-se de usar o formato `["padrão1", "padrão2"]` |
| Chave Desconhecida | O arquivo de configuração contém chaves não suportadas | Remova ou comente as chaves desconhecidas |

**Ative os logs de depuração para ver erros detalhados**:

```jsonc
// ~/.config/opencode/dcp.jsonc
{
    "debug": true  // Ativa os logs de depuração
}
```

Localização do arquivo de log: `~/.config/opencode/logs/dcp/daily/YYYY-MM-DD.log`

---

## Problemas de Funcionalidade

### Por que o uso de Tokens não diminuiu?

O DCP só poda o conteúdo de **chamadas de ferramentas**. Se sua conversa não usar ferramentas, ou se usar apenas ferramentas protegidas, os Tokens não serão reduzidos.

**Possíveis causas**:

1. **Ferramentas Protegidas**
   As ferramentas protegidas por padrão incluem: `task`, `write`, `edit`, `batch`, `discard`, `extract`, `todowrite`, `todoread`, `plan_enter`, `plan_exit`

2. **Proteção de Turno Não Expirada**
   Se `turnProtection` estiver ativado, as ferramentas não serão podadas durante o período de proteção.

3. **Sem Conteúdo Repetitivo ou Podável na Conversa**
   A estratégia automática do DCP visa apenas:
   - Chamadas de ferramentas repetidas (deduplicação)
   - Operações de escrita que foram substituídas por leituras (escrita de substituição)
   - Entradas de ferramentas de erro expiradas (limpeza de erros)

**Método de verificação**:

```bash
# Digite no OpenCode
/dcp context
```

Verifique o campo `Pruned` na saída para saber quantas ferramentas foram podadas e quantos Tokens foram economizados.

::: info Poda Manual
Se a estratégia automática não for acionada, você pode usar `/dcp sweep` para podar ferramentas manualmente.
:::

### Por que as sessões de sub-agente não são podadas?

**Este é o comportamento esperado**. O DCP está completamente desativado em sessões de sub-agente.

**Razão**: O objetivo de design dos sub-agentes é retornar resumos concisos de descobertas, não otimizar o uso de Tokens. A poda do DCP pode interferir no comportamento de resumo dos sub-agentes.

**Como determinar se é uma sessão de sub-agente**:
- Verifique o campo `parentID` nos metadados da sessão
- Após ativar os logs de depuração, você verá a marcação `isSubAgent: true`

---

## Depuração e Logs

### Como ativar os logs de depuração?

```jsonc
// ~/.config/opencode/dcp.jsonc
{
    "debug": true
}
```

**Localização dos arquivos de log**:
- **Logs Diários**: `~/.config/opencode/logs/dcp/daily/YYYY-MM-DD.log`
- **Snapshots de Contexto**: `~/.config/opencode/logs/dcp/context/{sessionId}/{timestamp}.json`

::: warning Impacto no Desempenho
Os logs de depuração são escritos em arquivos no disco, o que pode afetar o desempenho. Recomenda-se desativar em ambientes de produção.
:::

### Como visualizar a distribuição de Tokens da sessão atual?

```bash
# Digite no OpenCode
/dcp context
```

**Exemplo de saída**:

```
╭───────────────────────────────────────────────────────────╮
│                  DCP Context Analysis                     │
╰───────────────────────────────────────────────────────────╯

Session Context Breakdown:
────────────────────────────────────────────────────────────

System         15.2% │████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  25.1K tokens
User            5.1% │████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│   8.4K tokens
Assistant       35.8% │██████████████████████████████████████▒▒▒▒▒▒▒│  59.2K tokens
Tools (45)      43.9% │████████████████████████████████████████████████│  72.6K tokens

────────────────────────────────────────────────────────────

Summary:
  Pruned:          12 tools (~15.2K tokens)
  Current context: ~165.3K tokens
  Without DCP:     ~180.5K tokens
```

### Como visualizar as estatísticas de poda acumuladas?

```bash
# Digite no OpenCode
/dcp stats
```

Isso exibirá o número total de Tokens podados em todas as sessões históricas.

---

## Sobre Prompt Caching

### O DCP afeta o Prompt Caching?

**Sim**, mas após ponderação geral, geralmente é um benefício líquido positivo.

Os provedores de LLM (como Anthropic, OpenAI) armazenam em cache o prompt com base em **correspondência exata de prefixo**. Quando o DCP poda a saída da ferramenta, o conteúdo da mensagem muda, invalidando o cache a partir desse ponto.

**Resultados de testes reais**:
- Sem DCP: Taxa de acerto de cache de aproximadamente 85%
- Com DCP ativado: Taxa de acerto de cache de aproximadamente 65%

**Mas a economia de Tokens geralmente supera a perda de cache**, especialmente em conversas longas.

**Melhores cenários de uso**:
- Ao usar serviços cobrados por requisição (como GitHub Copilot, Google Antigravity), a perda de cache não tem impacto negativo

---

## Configuração Avançada

### Como proteger arquivos específicos de serem podados?

Use a configuração `protectedFilePatterns` para padrões glob:

```jsonc
{
    "protectedFilePatterns": [
        "src/config/*",     // Protege o diretório config
        "*.env",           // Protege todos os arquivos .env
        "**/secrets/**"    // Protege o diretório secrets
    ]
}
```

A correspondência de padrões é aplicada ao campo `filePath` nos parâmetros da ferramenta (como ferramentas `read`, `write`, `edit`).

### Como personalizar ferramentas protegidas?

Cada configuração de estratégia e ferramenta tem um array `protectedTools`:

```jsonc
{
    "strategies": {
        "deduplication": {
            "enabled": true,
            "protectedTools": ["custom_tool"]  // Ferramentas adicionais protegidas
        }
    },
    "tools": {
        "settings": {
            "protectedTools": ["another_tool"]
        }
    },
    "commands": {
        "protectedTools": ["sweep_protected"]
    }
}
```

Essas configurações serão **acumuladas** à lista padrão de ferramentas protegidas.

---

## Cenários de Erro Comuns

### Erro: DCP não carregado

**Possíveis causas**:
1. O plugin não está registrado em `opencode.jsonc`
2. Falha na instalação do plugin
3. Versão do OpenCode incompatível

**Soluções**:
1. Verifique se `opencode.jsonc` contém `"plugin": ["@tarquinen/opencode-dcp@latest"]`
2. Reinicie o OpenCode
3. Verifique o arquivo de log para confirmar o status de carregamento

### Erro: Arquivo de configuração JSON inválido

**Possíveis causas**:
- Vírgula ausente
- Vírgula extra
- Strings não usando aspas duplas
- Formato de comentário JSONC incorreto

**Soluções**:
Use um editor que suporte JSONC (como VS Code) para editar, ou use uma ferramenta de validação JSON online para verificar a sintaxe.

### Erro: Comando /dcp não responde

**Possíveis causas**:
- `commands.enabled` definido como `false`
- Plugin não carregado corretamente

**Soluções**:
1. Verifique se `"commands.enabled"` no arquivo de configuração é `true`
2. Confirme que o plugin foi carregado (verifique os logs)

---

## Obter Ajuda

Se os métodos acima não resolverem o problema:

1. **Ative os logs de depuração** e reproduza o problema
2. **Visualize o snapshot de contexto**: `~/.config/opencode/logs/dcp/context/{sessionId}/`
3. **Submeta um Issue no GitHub**:
   - Anexe o arquivo de log (remova informações sensíveis)
   - Descreva os passos de reprodução
   - Explique o comportamento esperado e o comportamento real

---

## Próxima Lição

> Na próxima lição aprenderemos **[Melhores Práticas do DCP](../best-practices/)**.
>
> Você aprenderá:
> - A relação de trade-off entre Prompt Caching e economia de Tokens
> - Regras de prioridade de configuração e estratégias de uso
> - Seleção e configuração de mecanismos de proteção
> - Dicas de uso de comandos e recomendações de otimização

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Números de Linha |
| --- | --- | --- |
| Validação de Configuração | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L147-375) | 147-375 |
| Tratamento de Erros de Configuração | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L391-421) | 391-421 |
| Sistema de Logs | [`lib/logger.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/logger.ts#L6-109) | 6-109 |
| Snapshot de Contexto | [`lib/logger.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/logger.ts#L196-210) | 196-210 |
| Detecção de Sub-Agente | [`lib/state/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/utils.ts#L1-8) | 1-8 |
| Ferramentas Protegidas | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-79) | 68-79 |

**Funções-chave**:
- `validateConfigTypes()`: Valida os tipos dos itens de configuração
- `getInvalidConfigKeys()`: Detecta chaves desconhecidas no arquivo de configuração
- `Logger.saveContext()`: Salva snapshot de contexto para depuração
- `isSubAgentSession()`: Detecta sessões de sub-agente

</details>
