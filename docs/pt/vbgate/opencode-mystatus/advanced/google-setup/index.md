---
title: "Google Cloud: Múltiplas Contas | opencode-mystatus"
sidebarTitle: "Google Cloud"
subtitle: "Configuração Avançada do Google Cloud: Múltiplas Contas e Gerenciamento de Modelos"
description: "Aprenda a configurar múltiplas contas do Google Cloud Antigravity. Entenda o mapeamento de 4 modelos e métodos de verificação de cota no opencode-mystatus."
tags:
  - "Google Cloud"
  - "Gerenciamento de Múltiplas Contas"
  - "Antigravity"
  - "Mapeamento de Modelos"
prerequisite:
  - "start-quick-start"
order: 1
---

# Configuração Avançada do Google Cloud: Múltiplas Contas e Gerenciamento de Modelos

## O Que Você Será Capaz de Fazer Após Este Tutorial

Configurar múltiplas contas do Google Cloud, visualizar com um clique o uso de cota de todas as contas, entender a relação de mapeamento de 4 modelos (G3 Pro, G3 Image, G3 Flash, Claude), e resolver problemas de cota insuficiente de modelo em uma única conta.

## Ideia Central

### Suporte a Múltiplas Contas

O opencode-mystatus oferece suporte para consultar simultaneamente múltiplas contas do Google Cloud Antigravity. Cada conta exibe independentemente sua cota de 4 modelos, facilitando o gerenciamento da alocação de cota de múltiplos projetos.

As contas são armazenadas em `~/.config/opencode/antigravity-accounts.json`, gerenciadas pelo plugin `opencode-antigravity-auth`. Você precisa primeiro instalar este plugin para adicionar contas do Google Cloud.

### Relação de Mapeamento de Modelos

O Google Cloud Antigravity oferece múltiplos modelos; o plugin exibirá os 4 mais comumente usados:

| Nome de Exibição | Key do Modelo (principal) | Key do Modelo (alternativo) |
|--- | --- | ---|
| G3 Pro | `gemini-3-pro-high` | `gemini-3-pro-low` |
| G3 Image | `gemini-3-pro-image` | - |
| G3 Flash | `gemini-3-flash` | - |
| Claude | `claude-opus-4-5-thinking` | `claude-opus-4-5` |

**Por que existem Keys Alternativas?**

Alguns modelos têm duas versões (high/low); o plugin priorizará a exibição de dados da key principal. Se a key principal não tiver informações de cota, o plugin usará automaticamente os dados da key alternativo.

### Uso do Project ID

Ao consultar a cota, é necessário fornecer o Project ID. O plugin priorizará o uso de `projectId`, e se não existir, usará `managedProjectId`. Ambos os IDs podem ser configurados ao adicionar a conta.

## 🎒 Preparação Antes de Começar

::: warning Pré-requisitos
Certifique-se de que você já:
- [x] Completou o tutorial de Início Rápido ([Início Rápido](/pt/vbgate/opencode-mystatus/start/quick-start/))
- [x] Instalou o plugin opencode-mystatus
- [x] Instalou o plugin [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth)
:::

## Siga Passo a Passo

### Passo 1: Adicionar a Primeira Conta do Google Cloud

**Por que**
A primeira conta é a base; após adicioná-la com sucesso, você poderá testar a consulta de múltiplas contas.

Use o plugin `opencode-antigravity-auth` para adicionar a conta. Supondo que você já instalou este plugin:

```bash
# Deixe o AI ajudar na instalação (recomendado)
# No Claude/OpenCode, digite:
Install the opencode-antigravity-auth plugin from: https://github.com/NoeFabris/opencode-antigravity-auth
```

Após a instalação, complete a autenticação Google OAuth seguindo a documentação deste plugin.

**O que você deve ver**:
- As informações da conta foram salvas em `~/.config/opencode/antigravity-accounts.json`
- O conteúdo do arquivo é semelhante a:
  ```json
  {
    "version": 1,
    "accounts": [
      {
        "email": "user1@gmail.com",
        "refreshToken": "1//...",
        "projectId": "my-project-123",
        "managedProjectId": "managed-project-456",
        "addedAt": 1737600000000,
        "lastUsed": 1737600000000
      }
    ]
  }
  ```

### Passo 2: Consultar a Cota do Google Cloud

**Por que**
Verificar se a configuração da primeira conta está correta e ver a situação da cota dos 4 modelos.

```bash
/mystatus
```

**O que você deve ver**:

```
## Cota da Conta do Google Cloud

### user1@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%
```

### Passo 3: Adicionar a Segunda Conta do Google Cloud

**Por que**
Quando você tem múltiplas contas do Google Cloud, pode gerenciar simultaneamente a alocação de cota de múltiplos projetos.

Repita o processo do passo 1, faça login com outra conta do Google.

Após a conclusão da adição, o arquivo `antigravity-accounts.json` se tornará:

```json
{
  "version": 1,
  "accounts": [
    {
      "email": "user1@gmail.com",
      "refreshToken": "1//...",
      "projectId": "my-project-123",
      "addedAt": 1737600000000,
      "lastUsed": 1737600000000
    },
    {
      "email": "user2@gmail.com",
      "refreshToken": "2//...",
      "projectId": "another-project-456",
      "addedAt": 1737700000000,
      "lastUsed": 1737700000000
    }
  ]
}
```

### Passo 4: Visualizar Cota de Múltiplas Contas

**Por que**
Confirmar se a cota de ambas as contas é exibida corretamente, facilitando o planejamento do uso de cada conta.

```bash
/mystatus
```

**O que você deve ver**:

```
## Cota da Conta do Google Cloud

### user1@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%

### user2@gmail.com

G3 Pro     2h 30m     ████████████░░░░░░░░ 65%
G3 Image   2h 30m     ██████████░░░░░░░░░ 50%
G3 Flash   2h 30m     ██████████████░░░░░ 80%
Claude     1d 5h      ████████░░░░░░░░░░░ 35%
```

## Cuidados Importantes

### Conta Não Exibida

**Problema**: Adicionou a conta, mas `mystatus` não a exibe.

**Causa**: A conta não tem o campo de e-mail. O plugin filtrará contas sem `email` (ver código fonte `google.ts:318`).

**Solução**: Garanta que cada conta em `antigravity-accounts.json` tenha o campo `email`.

### Project ID Ausente

**Problema**: Exibe o erro "No project ID found".

**Causa**: A configuração da conta não tem `projectId` nem `managedProjectId`.

**Solução**: Ao readicionar a conta, garanta que o Project ID foi preenchido.

### Dados do Modelo Vazios

**Problema**: Um modelo exibe 0% ou não tem dados.

**Causa**:
1. A conta realmente não usou esse modelo
2. As informações de cota desse modelo não foram retornadas (alguns modelos podem requerer permissões especiais)

**Solução**:
- Isso é normal, contanto que a conta tenha dados de cota
- Se todos os modelos estiverem em 0%, verifique se as permissões da conta estão corretas

## Resumo da Lição

- Instalar o plugin `opencode-antigravity-auth` é um pré-requisito para usar a verificação de cota do Google Cloud
- Oferece suporte à consulta simultânea de múltiplas contas, cada conta exibe independentemente a cota de 4 modelos
- Relação de mapeamento de modelos: G3 Pro (suporta high/low), G3 Image, G3 Flash, Claude (suporta thinking/normal)
- O plugin prioriza o uso de `projectId`, se não existente usa `managedProjectId`
- A conta deve conter o campo `email` para ser consultada

## Próxima Lição

> Na próxima lição, aprenderemos **[Configuração de Autenticação do Copilot](/pt/vbgate/opencode-mystatus/advanced/copilot-auth/)**.
>
> Você aprenderá:
> - Dois métodos de autenticação do Copilot: OAuth Token e Fine-grained PAT
> - Como resolver problemas de permissão do Copilot
> - Diferenças de cota entre diferentes tipos de assinatura

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código fonte</strong></summary>

> Última atualização: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Linha |
|--- | --- | ---|
| Mapeamento de configuração de modelos | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 69-78 |
| Consulta paralela de múltiplas contas | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 327-334 |
| Filtro de contas (deve ter e-mail) | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 318 |
| Prioridade do Project ID | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 231 |
| Extração de cota de modelos | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 132-157 |
| Definição de tipo AntigravityAccount | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 78-86 |

**Constantes Chave**:
- `MODELS_TO_DISPLAY`: Configuração de 4 modelos (key, altKey, display)
- `GOOGLE_QUOTA_API_URL`: Endereço da API de cota do Google Cloud
- `USER_AGENT`: User-Agent da requisição (antigravity/1.11.9)

**Funções Chave**:
- `queryGoogleUsage()`: Consulta a cota de todas as contas do Google Cloud
- `fetchAccountQuota()`: Consulta a cota de uma única conta (inclui renovação do Token)
- `extractModelQuotas()`: Extrai informações de cota dos 4 modelos da resposta da API
- `formatAccountQuota()`: Formata a saída de cota de uma única conta

</details>
