---
title: "Início Rápido: Instalação do Plugin | opencode-supermemory"
sidebarTitle: "Início Rápido"
subtitle: "Início Rápido: Instalação e Configuração"
description: "Aprenda a instalar o plugin opencode-supermemory, configurar a API Key e resolver conflitos, permitindo memória persistente ao Agent."
tags:
  - "instalação"
  - "configuração"
  - "introdução"
prerequisite:
  - ""
order: 1
---

# Início Rápido: Instalação e Configuração

## O Que Você Vai Aprender

Nesta lição, você aprenderá:
1. Instalar o plugin **opencode-supermemory** em seu ambiente OpenCode.
2. Configurar a Supermemory API Key para conectar ao banco de memória na nuvem.
3. Verificar se o plugin foi carregado com sucesso.
4. Resolver conflitos potenciais com outros plugins (como o Oh My OpenCode).

Após completar, seu Agent terá a capacidade básica de conectar ao banco de memória na nuvem.

## Seu Problema Atual

Você pode ter percebido que, embora o Agent do OpenCode seja inteligente, ele é muito esquecido:
- Cada vez que inicia uma nova sessão, ele parece ter perdido a memória e não se lembra de suas preferências anteriores.
- Você ensinou-lhe padrões de arquitetura no projeto A, mas no projeto B ele esqueceu.
- Em sessões longas, informações importantes anteriores são "expulsas" do contexto.

Você precisa de um cérebro externo para ajudar o Agent a lembrar essas coisas.

## Quando Usar Esta Abordagem

- **Primeira vez**: Quando você está começando a usar o opencode-supermemory.
- **Reinstalação**: Quando você migra para um novo computador ou redefiniu a configuração do OpenCode.
- **Solução de problemas**: Quando você suspeita que o plugin não foi instalado corretamente ou há problemas de conexão da API.

---

## 🎒 Preparação Antes de Começar

Antes de começar, certifique-se de que você já:

1. **Instalou o OpenCode**: Certifique-se de que o comando `opencode` está disponível no terminal.
2. **Obteve a API Key**:
    - Visite o [Supermemory Console](https://console.supermemory.ai)
    - Registre-se/faca login na conta
    - Crie uma nova API Key (começa com `sm_`)

::: info O que é Supermemory?
Supermemory é uma camada de memória na nuvem projetada especificamente para AI Agent. Não apenas armazena dados, mas também ajuda o Agent a lembrar da coisa certa no momento certo por meio de busca semântica.
:::

---

## Ideia Central

O processo de instalação é muito simples, essencialmente três passos:

1. **Instalar o plugin**: Execute o script de instalação, registre o plugin no OpenCode.
2. **Configurar a chave**: Diga ao plugin qual é a sua API Key.
3. **Verificar a conexão**: Reinicie o OpenCode, confirme que o Agent consegue ver as novas ferramentas.

---

## Siga-me

### Passo 1: Instalar o Plugin

Fornecemos dois métodos de instalação, escolha o que melhor lhe convier.

::: code-group

```bash [Sou Humano (instalação interativa)]
# Recomendado: terá orientação interativa, ajudando você a lidar automaticamente com a configuração
bunx opencode-supermemory@latest install
```

```bash [Sou Agent (instalação automática)]
# Se você estiver pedindo ao Agent para instalar, use este comando (pula confirmação interativa e resolve automaticamente conflitos)
bunx opencode-supermemory@latest install --no-tui --disable-context-recovery
```

:::

**Você deve ver**:
Saída do terminal `✓ Setup complete!`, indicando que o plugin foi registrado com sucesso em `~/.config/opencode/opencode.jsonc`.

### Passo 2: Configurar a API Key

O plugin precisa da API Key para ler e gravar sua memória na nuvem. Você tem duas formas de configurar:

#### Método A: Variável de Ambiente (Recomendado)

Adicione diretamente ao seu arquivo de configuração Shell (como `.zshrc` ou `.bashrc`):

```bash
export SUPERMEMORY_API_KEY="sm_sua-chave..."
```

#### Método B: Arquivo de Configuração

Ou crie um arquivo de configuração dedicado `~/.config/opencode/supermemory.jsonc`:

```json
{
  "apiKey": "sm_sua-chave..."
}
```

**Por que**: Variáveis de ambiente são mais seguras e não são comprometidas acidentalmente para o repositório de código; arquivos de configuração são mais convenientes para gerenciar múltiplas configurações.

### Passo 3: Resolver Conflitos (se você usa o Oh My OpenCode)

Se você instalou o [Oh My OpenCode](https://github.com/code-yeongyu/oh-my-opencode), sua funcionalidade de gerenciamento de contexto pode entrar em conflito com o Supermemory.

**Como verificar**:
O script de instalação geralmente detecta e solicita automaticamente desabilitar hooks conflitantes. Se não, verifique manualmente `~/.config/opencode/oh-my-opencode.json`:

```json
{
  "disabled_hooks": [
    "anthropic-context-window-limit-recovery"  // ✅ Certifique-se de que esta linha existe
  ]
}
```

**Por que**: O Supermemory fornece "compactação preemptiva" (Preemptive Compaction) mais inteligente; se dois plugins tentam gerenciar o contexto simultaneamente, isso causará confusão.

### Passo 4: Verificar a Instalação

Reinicie o OpenCode e execute o comando de verificação:

```bash
opencode -c
```

Ou entre diretamente no modo interativo do OpenCode e visualize a lista de ferramentas.

**Você deve ver**:
Na lista de ferramentas (Tools), aparece a ferramenta `supermemory`.

```
Available Tools:
- supermemory (add, search, profile, list, forget)
...
```

---

## Ponto de Verificação ✅

Verifique os seguintes itens para garantir que tudo esteja pronto:

- [ ] Execute `cat ~/.config/opencode/opencode.jsonc`, você pode ver `"opencode-supermemory"` na lista de `plugin`.
- [ ] A variável de ambiente `SUPERMEMORY_API_KEY` está em vigor (verifique com `echo $SUPERMEMORY_API_KEY`).
- [ ] Após executar `opencode`, o Agent não relata erros.

---

## Avisos sobre Armadilhas

::: warning Erro Comum: API Key não está em vigor
Se você configurou a variável de ambiente mas o plugin indica não autenticado, verifique:
1. Você reiniciou o terminal? (após modificar `.zshrc`, você precisa de `source ~/.zshrc` ou reiniciar)
2. Você reiniciou o OpenCode? (o processo OpenCode precisa ser reiniciado para ler novas variáveis)
:::

::: warning Erro Comum: Erro de formato JSON
Se você modificar manualmente `opencode.jsonc`, certifique-se de que o formato JSON está correto (especialmente vírgulas). O script de instalação lida com isso automaticamente, mas modificações manuais são propensas a erros.
:::

---

## Resumo da Lição

Parabéns! Você instalou com sucesso "hipocampo" para o OpenCode. Agora seu Agent está pronto para começar a memorizar.

- Instalamos o plugin `opencode-supermemory`.
- Configuramos as credenciais de conexão à nuvem.
- Excluímos conflitos potenciais de plugins.

## Próxima Lição

> Próxima lição: **[Inicialização do Projeto: Estabeleça a Primeira Impressão](../initialization/index.md)**.
>
> Você aprenderá:
> - Como fazer com que o Agent faça uma varredura profunda de todo o projeto com um comando.
> - Como fazer com que o Agent lembre da arquitetura, stack tecnológico e regras implícitas do projeto.
> - Como ver exatamente o que o Agent lembrou.

---

## Apêndice: Referência de Código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Última atualização: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Linha |
| --- | --- | --- |
| Lógica do script de instalação | [`src/cli.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/cli.ts#L327-L410) | 327-410 |
| Lógica de registro do plugin | [`src/cli.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/cli.ts#L195-L248) | 195-248 |
| Lógica de detecção de conflitos | [`src/cli.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/cli.ts#L273-L320) | 273-320 |
| Carregamento do arquivo de configuração | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts) | - |

</details>
