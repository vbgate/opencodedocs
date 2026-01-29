---
title: "Configuração Avançada | opencode-supermemory"
sidebarTitle: "Configuração"
subtitle: "Configuração em Profundidade: Personalize Seu Mecanismo de Memória"
description: "Domine as opções de configuração do opencode-supermemory. Personalize gatilhos de memória, ajuste injeção de contexto e otimize a estratégia de compactação."
tags:
  - "configuração"
  - "avançado"
  - "personalização"
prerequisite:
  - "start-getting-started"
order: 2
---

# Configuração em Profundidade: Personalize Seu Mecanismo de Memória

## O Que Você Vai Aprender

- **Personalizar palavras de gatilho**: Faça o Agent entender seus comandos exclusivos (como "anotar", "marcar").
- **Ajustar capacidade de memória**: Controle o número de memórias injetadas no contexto, equilibrando consumo de Token com volume de informações.
- **Otimizar estratégia de compactação**: Ajuste o momento de acionamento da compactação preemptiva de acordo com o tamanho do projeto.
- **Gerenciar múltiplos ambientes**: Alternar entre API Keys de forma flexível através de variáveis de ambiente.

## Localização do Arquivo de Configuração

opencode-supermemory procura os seguintes arquivos de configuração em ordem, **para no primeiro encontrado**:

1. `~/.config/opencode/supermemory.jsonc` (recomendado, suporta comentários)
2. `~/.config/opencode/supermemory.json`

::: tip Por que recomendar .jsonc?
O formato `.jsonc` permite escrever comentários (`//`) no JSON, muito adequado para explicar a finalidade dos itens de configuração.
:::

## Detalhes da Configuração Central

A seguir está um exemplo completo de configuração, incluindo todas as opções disponíveis e seus valores padrão.

### Configuração Básica

```jsonc
// ~/.config/opencode/supermemory.jsonc
{
  // Supermemory API Key
  // Prioridade: arquivo de configuração > variável de ambiente SUPERMEMORY_API_KEY
  "apiKey": "sua-api-key-aqui",

  // Limiar de similaridade para busca semântica (0.0 - 1.0)
  // Valores mais altos produzem resultados de busca mais precisos mas em menor quantidade; valores mais baixos geram resultados mais dispersos
  "similarityThreshold": 0.6
}
```

### Controle de Injeção de Contexto

Essas configurações determinam quantas memórias o Agent lerá automaticamente e injetará no Prompt ao iniciar uma sessão.

```jsonc
{
  // Se deve injetar automaticamente o perfil do usuário (User Profile)
  // Defina como false para economizar Tokens, mas o Agent pode esquecer suas preferências básicas
  "injectProfile": true,

  // Número máximo de itens de perfil de usuário injetados
  "maxProfileItems": 5,

  // Número máximo de memórias de nível de usuário (User Scope) injetadas
  // Estas são memórias gerais compartilhadas entre projetos
  "maxMemories": 5,

  // Número máximo de memórias de nível de projeto (Project Scope) injetadas
  // Estas são memórias específicas do projeto atual
  "maxProjectMemories": 10
}
```

### Palavras de Gatilho Personalizadas

Você pode adicionar expressões regulares personalizadas para que o Agent reconheça comandos específicos e salve memórias automaticamente.

```jsonc
{
  // Lista de palavras de gatilho personalizadas (suporta expressões regulares)
  // Essas palavras entram em vigor junto com as palavras de gatilho internas padrão
  "keywordPatterns": [
    "anotar",           // correspondência simples
    "marcar\\s+isto",     // correspondência regex: marcar isto
    "importante[:：]",         // corresponde "importante:" ou "importante："
    "TODO\\(memória\\)"  // corresponde marcador específico
  ]
}
```

::: details Ver palavras de gatilho padrão internas
O plugin vem com as seguintes palavras de gatilho, sem necessidade de configuração:
- `remember`, `memorize`
- `save this`, `note this`
- `keep in mind`, `don't forget`
- `learn this`, `store this`
- `record this`, `make a note`
- `take note`, `jot down`
- `commit to memory`
- `remember that`
- `never forget`, `always remember`
:::

### Compactação Preemptiva (Preemptive Compaction)

Quando o contexto da sessão é longo demais, o plugin ativará automaticamente o mecanismo de compactação.

```jsonc
{
  // Limiar de ativação de compactação (0.0 - 1.0)
  // Ativa compactação quando o uso de Tokens excede esta proporção
  // Padrão 0.80 (80%)
  "compactionThreshold": 0.80
}
```

::: warning Recomendações de definição de limiar
- **Não defina muito alto** (como > 0.95): Pode levar a esgotar a janela de contexto antes que a compactação seja concluída.
- **Não defina muito baixo** (como < 0.50): Causará compactação frequente, interrompendo o fluxo e desperdiçando Tokens.
- **Valor recomendado**: Entre 0.70 - 0.85.
:::

## Suporte a Variáveis de Ambiente

Além do arquivo de configuração, você também pode usar variáveis de ambiente para gerenciar informações sensíveis ou substituir o comportamento padrão.

| Variável de Ambiente | Descrição | Prioridade |
| :--- | :--- | :--- |
| `SUPERMEMORY_API_KEY` | Chave de API do Supermemory | Menor que arquivo de configuração |
| `USER` ou `USERNAME` | Identificador usado para gerar Hash de escopo de usuário | Padrão do sistema |

### Cenário de Uso: Alternância entre Ambientes

Se você usa diferentes contas Supermemory em projetos pessoais e da empresa, pode usar variáveis de ambiente:

::: code-group

```bash [macOS/Linux]
# Defina a Key padrão em .zshrc ou .bashrc
export SUPERMEMORY_API_KEY="key_pessoal"

# No diretório do projeto da empresa, substitua temporariamente a Key
export SUPERMEMORY_API_KEY="key_trabalho" && opencode
```

```powershell [Windows]
# Defina variável de ambiente
$env:SUPERMEMORY_API_KEY="key_trabalho"
opencode
```

:::

## Siga-me: Personalize Sua Configuração Exclusiva

Vamos criar uma configuração otimizada adequada para a maioria dos desenvolvedores.

### Passo 1: Criar Arquivo de Configuração

Se o arquivo não existir, crie-o.

```bash
mkdir -p ~/.config/opencode
touch ~/.config/opencode/supermemory.jsonc
```

### Passo 2: Escrever Configuração Otimizada

Copie o seguinte conteúdo para `supermemory.jsonc`. Esta configuração aumenta o peso das memórias do projeto e adiciona palavras de gatilho em chinês.

```jsonc
{
  // Mantém similaridade padrão
  "similarityThreshold": 0.6,

  // Aumenta quantidade de memórias do projeto, reduz memórias gerais, mais adequado para desenvolvimento profundo
  "maxMemories": 3,
  "maxProjectMemories": 15,

  // Adiciona palavras de gatilho em chinês habituais
  "keywordPatterns": [
    "anotar",
    "lembrar",
    "salvar memória",
    "não esqueça"
  ],

  // Ativa compactação um pouco antes, reservando mais espaço de segurança
  "compactionThreshold": 0.75
}
```

### Passo 3: Verificar Configuração

Reinicie o OpenCode e tente usar as novas palavras de gatilho definidas na conversa:

```
Entrada do usuário:
Anotar: o caminho base da API deste projeto é /api/v2

Resposta do sistema (esperada):
(Agent chama ferramenta supermemory para salvar memória)
Memória salva: o caminho base da API deste projeto é /api/v2
```

## Perguntas Frequentes

### P: Preciso reiniciar após modificar a configuração?
**R: Sim.** O plugin carrega a configuração ao iniciar, após modificar `supermemory.jsonc` você deve reiniciar o OpenCode para que tenha efeito.

### P: O `keywordPatterns` suporta regex chinês?
**R: Sim.** Subjacente usa `new RegExp()` do JavaScript, suporta completamente caracteres Unicode.

### P: O que acontece se o arquivo de configuração estiver errado?
**R: O plugin volta para os valores padrão.** Se o formato JSON for inválido (como vírgulas extras), o plugin captura o erro e usa o `DEFAULTS` interno, não causando falha no OpenCode.

## Próxima Lição

> Próxima lição: **[Privacidade e Segurança de Dados](../../security/privacy/)**.
>
> Você aprenderá:
> - Mecanismo de anonimização automática de dados sensíveis
> - Como usar tags `<private>` para proteger privacidade
> - Limites de segurança de armazenamento de dados

---

## Apêndice: Referência de Código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Última atualização: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Linha |
| :--- | :--- | :--- |
| Definição da interface de configuração | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L12-L23) | 12-23 |
| Definição de valores padrão | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L44-L54) | 44-54 |
| Palavras de gatilho padrão | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L25-L42) | 25-42 |
| Carregamento do arquivo de configuração | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L73-L86) | 73-86 |
| Leitura de variáveis de ambiente | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L90) | 90 |

</details>
