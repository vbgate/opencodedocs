---
title: "Instalação Rápida: Configure o Plugin em 5 Minutos | Antigravity Auth"
sidebarTitle: "Pronto em 5 minutos"
subtitle: "Instalação Rápida do Antigravity Auth: Configure o Plugin em 5 Minutos"
description: "Aprenda a instalar rapidamente o plugin Antigravity Auth. Este tutorial cobre dois métodos de instalação (assistido por IA/manual), configuração de modelos, autenticação Google OAuth e verificação."
tags:
  - "Início Rápido"
  - "Guia de Instalação"
  - "OAuth"
  - "Configuração de Plugin"
prerequisite:
  - "start-what-is-antigravity-auth"
order: 2
---

# Instalação Rápida do Antigravity Auth: Configure o Plugin em 5 Minutos

A instalação rápida do Antigravity Auth permite configurar o plugin OpenCode em 5 minutos e começar a usar os modelos avançados Claude e Gemini 3. Este tutorial oferece dois métodos de instalação (assistido por IA/configuração manual), abrangendo instalação do plugin, autenticação OAuth, definição de modelos e etapas de verificação para garantir que você comece rapidamente.

## O Que Você Vai Aprender

- ✅ Concluir a instalação do plugin Antigravity Auth em 5 minutos
- ✅ Configurar permissões de acesso aos modelos Claude e Gemini 3
- ✅ Executar a autenticação Google OAuth e verificar a instalação

## Seu Desafio Atual

Você quer experimentar os recursos poderosos do Antigravity Auth (Claude Opus 4.5, Sonnet 4.5, Gemini 3 Pro/Flash), mas não sabe como instalar o plugin ou configurar os modelos, e teme ficar travado se errar algum passo.

## Quando Usar Este Guia

- Ao usar o plugin Antigravity Auth pela primeira vez
- Ao instalar o OpenCode em uma nova máquina
- Quando precisar reconfigurar o plugin

## 🎒 Antes de Começar

::: warning Verificação de Pré-requisitos

Antes de começar, confirme:
- [ ] OpenCode CLI instalado (comando `opencode` disponível)
- [ ] Conta Google disponível (para autenticação OAuth)
- [ ] Familiarizado com os conceitos básicos do Antigravity Auth (leia [O que é Antigravity Auth?](/pt/NoeFabris/opencode-antigravity-auth/start/what-is-antigravity-auth/))

:::

## Conceito Principal

O processo de instalação do Antigravity Auth tem 4 etapas:

1. **Instalar o plugin** → Habilitar o plugin na configuração do OpenCode
2. **Autenticação OAuth** → Fazer login com conta Google
3. **Configurar modelos** → Adicionar definições de modelos Claude/Gemini
4. **Verificar instalação** → Fazer a primeira requisição de teste

**Nota importante**: O caminho do arquivo de configuração em todos os sistemas é `~/.config/opencode/opencode.json` (no Windows, `~` é automaticamente resolvido para o diretório do usuário, como `C:\Users\SeuNome`).

## Passo a Passo

### Passo 1: Escolha o Método de Instalação

O Antigravity Auth oferece dois métodos de instalação. Escolha um deles.

::: tip Método Recomendado

Se você usa um LLM Agent (como Claude Code, Cursor, OpenCode), **recomendamos a instalação assistida por IA** — mais rápida e conveniente.

:::

**Método 1: Instalação Assistida por IA (Recomendado)**

Copie e cole o seguinte prompt para qualquer LLM Agent:

```
Install opencode-antigravity-auth plugin and add Antigravity model definitions to ~/.config/opencode/opencode.json by following: https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/dev/README.md
```

**A IA completará automaticamente**:
- Editar `~/.config/opencode/opencode.json`
- Adicionar configuração do plugin
- Adicionar definições completas de modelos
- Executar `opencode auth login` para autenticação

**Você deve ver**: A IA exibir "Plugin instalado com sucesso" ou mensagem similar.

**Método 2: Instalação Manual**

Se preferir controle manual, siga estas etapas:

**Passo 1.1: Adicionar o plugin ao arquivo de configuração**

Edite `~/.config/opencode/opencode.json` (crie o arquivo se não existir):

```json
{
  "plugin": ["opencode-antigravity-auth@latest"]
}
```

> **Versão Beta**: Para experimentar os recursos mais recentes, use `opencode-antigravity-auth@beta` em vez de `@latest`.

**Você deve ver**: O arquivo de configuração contendo o campo `plugin` com valor em array.

---

### Passo 2: Executar Autenticação Google OAuth

Execute no terminal:

```bash
opencode auth login
```

**O sistema automaticamente**:
1. Inicia um servidor OAuth local (escutando em `localhost:51121`)
2. Abre o navegador na página de autorização do Google
3. Recebe o callback OAuth e troca os tokens
4. Obtém automaticamente o ID do projeto Google Cloud

**O que você precisa fazer**:
1. Clicar em "Permitir" no navegador para autorizar o acesso
2. Em ambientes WSL ou Docker, pode ser necessário copiar manualmente a URL de callback

**Você deve ver**:

```
✅ Authentication successful
✅ Account added: your-email@gmail.com
✅ Project ID resolved: cloud-project-id-xxx
```

::: tip Suporte a Múltiplas Contas

Precisa adicionar mais contas para aumentar a cota? Execute `opencode auth login` novamente. O plugin suporta até 10 contas com balanceamento de carga automático.

:::

---

### Passo 3: Configurar Definições de Modelos

Copie a configuração completa abaixo e adicione ao `~/.config/opencode/opencode.json` (cuidado para não sobrescrever o campo `plugin` existente):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-antigravity-auth@latest"],
  "provider": {
    "google": {
      "models": {
        "antigravity-gemini-3-pro": {
          "name": "Gemini 3 Pro (Antigravity)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingLevel": "low" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-gemini-3-flash": {
          "name": "Gemini 3 Flash (Antigravity)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "minimal": { "thinkingLevel": "minimal" },
            "low": { "thinkingLevel": "low" },
            "medium": { "thinkingLevel": "medium" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-claude-sonnet-4-5": {
          "name": "Claude Sonnet 4.5 (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "antigravity-claude-sonnet-4-5-thinking": {
          "name": "Claude Sonnet 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "antigravity-claude-opus-4-5-thinking": {
          "name": "Claude Opus 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "gemini-2.5-flash": {
          "name": "Gemini 2.5 Flash (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-2.5-pro": {
          "name": "Gemini 2.5 Pro (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-flash-preview": {
          "name": "Gemini 3 Flash Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-pro-preview": {
          "name": "Gemini 3 Pro Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        }
      }
    }
  }
}
```

::: info Categorias de Modelos

- **Cota Antigravity** (Claude + Gemini 3): `antigravity-gemini-*`, `antigravity-claude-*`
- **Cota Gemini CLI** (independente): `gemini-2.5-*`, `gemini-3-*-preview`

Para mais detalhes sobre configuração de modelos, consulte [Lista Completa de Modelos Disponíveis](/pt/NoeFabris/opencode-antigravity-auth/platforms/available-models/).

:::

**Você deve ver**: O arquivo de configuração contendo a definição completa de `provider.google.models`, com formato JSON válido (sem erros de sintaxe).

---

### Passo 4: Verificar a Instalação

Execute o seguinte comando para testar se o plugin está funcionando corretamente:

```bash
opencode run "Hello" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=max
```

**Você deve ver**:

```
Usando: google/antigravity-claude-sonnet-4-5-thinking (max)
...

Claude: Olá! Sou o Claude Sonnet 4.5 Thinking.
```

::: tip Checkpoint ✅

Se você vir a resposta normal da IA, parabéns! O plugin Antigravity Auth foi instalado e configurado com sucesso.

:::

---

## Solução de Problemas

### Problema 1: Falha na Autenticação OAuth

**Sintoma**: Após executar `opencode auth login`, aparece uma mensagem de erro como `invalid_grant` ou a página de autorização não abre.

**Causa**: Senha da conta Google alterada, evento de segurança ou URL de callback incompleta.

**Solução**:
1. Verifique se o navegador abriu corretamente a página de autorização do Google
2. Em ambientes WSL/Docker, copie manualmente a URL de callback exibida no terminal para o navegador
3. Delete `~/.config/opencode/antigravity-accounts.json` e autentique novamente

### Problema 2: Modelo Não Encontrado (Erro 400)

**Sintoma**: Ao fazer uma requisição, retorna `400 Unknown name 'xxx'`.

**Causa**: Nome do modelo com erro de digitação ou problema no formato do arquivo de configuração.

**Solução**:
1. Verifique se o parâmetro `--model` corresponde exatamente à chave no arquivo de configuração (diferencia maiúsculas/minúsculas)
2. Valide se `opencode.json` é um JSON válido (use `cat ~/.config/opencode/opencode.json | jq` para verificar)
3. Confirme que existe a definição do modelo correspondente em `provider.google.models`

### Problema 3: Caminho do Arquivo de Configuração Incorreto

**Sintoma**: Mensagem "arquivo de configuração não existe" ou modificações não têm efeito.

**Causa**: Uso de caminho incorreto em diferentes sistemas.

**Solução**: Use `~/.config/opencode/opencode.json` em todos os sistemas, incluindo Windows (`~` é automaticamente resolvido para o diretório do usuário).

| Sistema | Caminho Correto | Caminho Incorreto |
| --- | --- | --- |
| macOS/Linux | `~/.config/opencode/opencode.json` | `/usr/local/etc/...` |
| Windows | `C:\Users\SeuNome\.config\opencode\opencode.json` | `%APPDATA%\opencode\...` |

## Resumo da Lição

Nesta lição, concluímos:
1. ✅ Dois métodos de instalação (assistido por IA / configuração manual)
2. ✅ Fluxo de autenticação Google OAuth
3. ✅ Configuração completa de modelos (Claude + Gemini 3)
4. ✅ Verificação da instalação e solução de problemas comuns

**Pontos-chave**:
- Caminho unificado do arquivo de configuração: `~/.config/opencode/opencode.json`
- A autenticação OAuth obtém automaticamente o Project ID, sem necessidade de configuração manual
- Suporte a múltiplas contas para aumentar o limite de cota
- Use o parâmetro `variant` para controlar a profundidade de raciocínio dos modelos Thinking

## Prévia da Próxima Lição

> Na próxima lição, aprenderemos **[Primeira Autenticação: Entendendo o Fluxo OAuth 2.0 PKCE](/pt/NoeFabris/opencode-antigravity-auth/start/first-auth-login/)**.
>
> Você aprenderá:
> - Como funciona o OAuth 2.0 PKCE
> - Mecanismo de atualização de tokens
> - Processo de resolução automática do Project ID
> - Formato de armazenamento de contas

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Geração da URL de autorização OAuth | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L91-L113) | 91-113 |
| Geração do par de chaves PKCE | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L1-L2) | 1-2 |
| Troca de tokens | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L201-L270) | 201-270 |
| Obtenção automática do Project ID | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L131-L196) | 131-196 |
| Obtenção de informações do usuário | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L231-L242) | 231-242 |

**Constantes principais**:
- `ANTIGRAVITY_CLIENT_ID`: ID do cliente OAuth (para autenticação Google)
- `ANTIGRAVITY_REDIRECT_URI`: Endereço de callback OAuth (fixo em `http://localhost:51121/oauth-callback`)
- `ANTIGRAVITY_SCOPES`: Lista de escopos de permissão OAuth

**Funções principais**:
- `authorizeAntigravity()`: Constrói a URL de autorização OAuth, incluindo o challenge PKCE
- `exchangeAntigravity()`: Troca o código de autorização por tokens de acesso e atualização
- `fetchProjectID()`: Resolve automaticamente o ID do projeto Google Cloud
- `encodeState()` / `decodeState()`: Codifica/decodifica o parâmetro state do OAuth (contém o verifier PKCE)

</details>
