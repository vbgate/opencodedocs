---
title: "Cota Google Cloud: Consulta de Modelos | opencode-mystatus"
sidebarTitle: "Google Cloud"
subtitle: "Consulta de cota Google Cloud: G3 Pro/Image/Flash e Claude"
description: "Aprenda a consultar a cota Google Cloud. Visualize a cota restante e tempo de redefinição dos modelos G3 Pro, G3 Image, G3 Flash e Claude."
tags:
  - "Google Cloud"
  - "Antigravity"
  - "consulta de cota"
prerequisite:
  - "start-quick-start"
  - "start-using-mystatus"
order: 4
---

# Consulta de cota Google Cloud: G3 Pro/Image/Flash e Claude

## O que você poderá fazer após concluir

- Visualizar a cota de 4 modelos de contas Google Cloud Antigravity
- Entender o tempo de redefinição e porcentagem restante de cada modelo
- Gerenciar o uso de cota de múltiplas contas Google Cloud

## O seu problema atual

O Google Cloud Antigravity fornece múltiplos modelos (G3 Pro, G3 Image, G3 Flash, Claude), cada modelo tem cota e tempo de redefinição independentes. Você precisa:
- Fazer login no console Google Cloud separadamente para ver o status de cada modelo
- Calcular manualmente a cota restante e tempo de redefinição
- Gerenciar múltiplas contas é ainda mais confuso

## Quando usar este método

Quando você:
- Quiser entender rapidamente a cota restante de todos os modelos Google Cloud
- Precisar planejar a alocação de uso entre diferentes modelos
- Tiver múltiplas contas Google Cloud que precisam de gerenciamento unificado

## 🎒 Preparação antes de começar

::: warning Verificação prévia

1. **Plugin mystatus instalado**: Consulte [Início rápido](/pt/vbgate/opencode-mystatus/start/quick-start/)
2. **Autenticação Google Cloud configurada**: Precisa primeiro instalar o plugin [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth) para completar a autenticação OAuth
3. **Arquivo de autenticação existe**: `~/.config/opencode/antigravity-accounts.json` contém pelo menos uma conta

:::

## Ideia principal

O Google Cloud Antigravity usa o mecanismo OAuth para autenticação, cada conta tem um Refresh Token independente. O plugin mystatus irá:
1. Ler `antigravity-accounts.json` para obter todas as contas configuradas
2. Usar Refresh Token para atualizar o Access Token
3. Chamar a API Google Cloud para obter a cota de todos os modelos
4. Exibir a cota e tempo de redefinição de 4 modelos agrupados por conta

## Modelos suportados Google Cloud

O mystatus exibe a cota dos seguintes 4 modelos:

| Nome de exibição | Chave do modelo (principal/alternativa) | Descrição |
|--- | --- | ---|
| G3 Pro | `gemini-3-pro-high` / `gemini-3-pro-low` | Gemini 3 Pro versão de alto desempenho |
| G3 Image | `gemini-3-pro-image` | Gemini 3 Pro geração de imagem |
| G3 Flash | `gemini-3-flash` | Gemini 3 Flash versão rápida |
| Claude | `claude-opus-4-5-thinking` / `claude-opus-4-5` | Claude Opus 4.5 modelo |

**Mecanismo de chave principal e alternativa**:
- A resposta da API pode retornar apenas dados da chave principal ou alternativa
- O mystatus tentará automaticamente obter a cota de qualquer chave
- Por exemplo: se `gemini-3-pro-high` não tiver dados, tentará `gemini-3-pro-low`

## Siga-me

### Passo 1: Executar comando de consulta

**Por que**
Obter rapidamente informações de cota de todas as contas Google Cloud

```
/mystatus
```

**O que você deve ver**
Contém informações de cota de todas as plataformas configuradas, onde a seção Google Cloud exibirá conteúdo semelhante ao seguinte:

```
## Google Cloud Account Quota

### user@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%
```

### Passo 2: Entender o formato de saída

**Por que**
Localizar rapidamente informações principais: cota restante e tempo de redefinição

Cada formato de linha:
```
[nome do modelo] [tempo de redefinição] [barra de progresso] [porcentagem restante]
```

**Explicação dos campos**:
- **Nome do modelo**: G3 Pro, G3 Image, G3 Flash, Claude
- **Tempo de redefinição**: Tempo restante até a próxima redefinição de cota (como `4h 59m`, `2d 9h`)
- **Barra de progresso**: Exibe visualmente a porcentagem restante
- **Porcentagem restante**: Valor numérico 0-100

**O que você deve ver**
Cada modelo em uma linha, exibindo claramente a cota e tempo de redefinição

### Passo 3: Verificar situação de múltiplas contas

**Por que**
Se você tiver múltiplas contas Google Cloud, serão exibidas separadamente

```
### user@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%

### another@gmail.com

G3 Pro     2h 30m     ████████████░░░░░░░░░ 75%
G3 Image   2h 30m     ████████████░░░░░░░░░ 75%
```

**O que você deve ver**
Cada conta em um bloco separado, contendo a cota de 4 modelos dessa conta

### Passo 4: Verificar avisos de cota

**Por que**
Evitar uso excessivo causando interrupção do serviço

Se a taxa de uso de qualquer modelo exceder 80%, um aviso será exibido:

```
### user@gmail.com

G3 Pro     1h 30m     ████░░░░░░░░░░░░░░░ 20%
G3 Image   1h 30m     ████░░░░░░░░░░░░░░░ 20%

⚠️ 使用率已达到或超过 80%
```

**O que você deve ver**
Aviso de aviso aparece abaixo da lista de modelos da conta correspondente

## Ponto de verificação ✅

Complete as seguintes verificações para garantir que você fez corretamente:

- [ ] Após executar `/mystatus`, pode ver informações de cota Google Cloud
- [ ] Pode entender os nomes e tempos de redefinição dos 4 modelos
- [ ] Pode identificar barras de progresso e porcentagem restante
- [ ] Se houver múltiplas contas, pode ver a cota de todas as contas

## Avisos sobre armadilhas

### Problema 1: Não vê cota Google Cloud

**Possíveis causas**:
- Plugin opencode-antigravity-auth não instalado
- Autenticação OAuth Google não completada
- Arquivo `antigravity-accounts.json` não existe ou está vazio

**Solução**:
1. Instale o plugin opencode-antigravity-auth
2. Complete a autenticação seguindo as instruções do repositório GitHub
3. Execute `/mystatus` novamente

### Problema 2: Alguma conta exibe erro

**Possíveis causas**:
- Refresh Token expirou
- projectId ausente

**Exemplo de erro**:
```
user@gmail.com: No project ID found
```

**Solução**:
1. Reautentique a conta usando o plugin opencode-antigravity-auth
2. Certifique-se de definir corretamente o ID do projeto durante a autenticação

### Problema 3: Modelo exibe "-" ou tempo de redefinição anormal

**Possíveis causas**:
- Campo resetTime da API está ausente ou com formato anormal
- O modelo não tem informações de cota

**Solução**:
- Isso é normal, o mystatus exibirá "-" indicando que os dados não estão disponíveis
- Se todos os modelos exibirem "-", verifique a conexão de rede ou status da API Google Cloud

## Resumo desta seção

- Google Cloud Antigravity suporta 4 modelos: G3 Pro, G3 Image, G3 Flash, Claude
- Cada modelo tem cota e tempo de redefinição independentes
- Suporta gerenciamento de múltiplas contas, cada conta exibida separadamente
- Quando a taxa de uso exceder 80%, um aviso será exibido

## Próxima seção

> A próxima seção aprenderemos **[Configuração avançada Google Cloud: múltiplas contas e gerenciamento de modelos](../../advanced/google-setup/)**.
>
> Você aprenderá:
> - Como adicionar e gerenciar múltiplas contas Google Cloud
> - Entender a relação de mapeamento de 4 modelos
> - Diferença entre projectId e managedProjectId

---

## Apêndice: Referência do código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Data de atualização: 2026-01-23

| Funcionalidade | Caminho do arquivo | Número da linha |
|--- | --- | ---|
| Configuração de modelo | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L69-L78) | 69-78 |
| Lógica de consulta de conta | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L304-L370) | 304-370 |
| Atualização de token | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L162-L184) | 162-184 |
| Extração de cota | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L132-L157) | 132-157 |
| Formatação de saída | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L265-L294) | 265-294 |
| Definições de tipo | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L78-L94) | 78-94 |

**Constantes principais**:
- `GOOGLE_QUOTA_API_URL = "https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels"`: API de consulta de cota Google Cloud
- `GOOGLE_TOKEN_REFRESH_URL = "https://oauth2.googleapis.com/token"`: API de atualização de token OAuth
- `USER_AGENT = "antigravity/1.11.9 windows/amd64"`: User-Agent de solicitação de API

**Funções principais**:
- `queryGoogleUsage()`: Consulta a cota de todas as contas Antigravity
- `fetchAccountQuota()`: Consulta a cota de uma única conta
- `extractModelQuotas()`: Extrai a cota de 4 modelos da resposta da API
- `formatAccountQuota()`: Formata a exibição de cota de uma única conta

**Regras de mapeamento de modelos**:
- G3 Pro suporta `gemini-3-pro-high` e `gemini-3-pro-low`, prioridade para chave principal
- Claude suporta `claude-opus-4-5-thinking` e `claude-opus-4-5`, prioridade para chave principal
- G3 Image e G3 Flash têm apenas uma chave

</details>
