---
title: "Suporte Multilíngue: Detecção de Idioma | opencode-mystatus"
sidebarTitle: "Multilíngue"
subtitle: "Suporte multilíngue: alternância automática entre chinês e inglês"
description: "Entenda o suporte multilíngue do opencode-mystatus. Aprenda detecção de idioma via API Intl e variáveis de ambiente, e como alternar o idioma de saída."
tags:
  - "i18n"
  - "internationalization"
  - "language-detection"
  - "multi-language"
prerequisite:
  - "start-quick-start"
order: 3
---

# Suporte multilíngue: alternância automática entre chinês e inglês

## O que você poderá fazer após concluir

- Entender como o mystatus detecta automaticamente o idioma do sistema
- Saber como alternar o idioma do sistema para alterar o idioma de saída
- Compreender a prioridade de detecção de idioma e o mecanismo de fallback
- Dominar os princípios de funcionamento da API Intl e variáveis de ambiente

## O seu problema atual

Você pode ter notado que o **suporte multilíngue** do mystatus às vezes está em chinês, às vezes em inglês:

```
# Saída em chinês
3小时限额
████████████████████████████ 剩余 85%
重置: 2小时30分钟后

# Saída em inglês
3-hour limit
████████████████████████████ 85% remaining
Resets in: 2h 30m
```

Mas você não sabe:
- Como o plugin sabe qual idioma usar?
- É possível alternar manualmente para chinês ou inglês?
- O que fazer se a detecção estiver incorreta?

Esta lição ajudará você a esclarecer o mecanismo de detecção de idioma.

## Ideia principal

O **suporte multilíngue** seleciona automaticamente a saída em chinês ou inglês com base no idioma do sistema, sem necessidade de configuração manual. A prioridade de detecção é: API Intl → Variáveis de ambiente → Inglês padrão.

**Prioridade de detecção** (da maior para a menor):

1. **API Intl** (recomendado) → `Intl.DateTimeFormat().resolvedOptions().locale`
2. **Variáveis de ambiente** (fallback) → `LANG`, `LC_ALL`, `LANGUAGE`
3. **Inglês padrão** (fallback) → `"en"`

::: tip Por que não precisa de configuração manual?
Como a detecção de idioma é baseada no ambiente do sistema, o plugin identifica automaticamente ao iniciar, sem que o usuário precise modificar nenhum arquivo de configuração.
:::

**Idiomas suportados**:
| Idioma | Código | Condição de detecção |
|--- | --- | ---|
| Chinês | `zh` | locale começa com `zh` (como `zh-CN`, `zh-TW`) |
| Inglês | `en` | Outros casos |

**Conteúdo traduzido**:
- Unidades de tempo (dias, horas, minutos)
- Relacionado a limites (porcentagem restante, tempo de redefinição)
- Mensagens de erro (falha de autenticação, erro de API, tempo limite)
- Títulos de plataformas (OpenAI, Zhipu AI, Z.ai, Google Cloud, GitHub Copilot)

## Siga-me

### Passo 1: Verificar o idioma atual do sistema

Primeiro, confirme as configurações de idioma do seu sistema:

::: code-group

```bash [macOS/Linux]
echo $LANG
```

```powershell [Windows]
Get-ChildItem Env:LANG
```

:::

**Você deve ver**:

- Sistema em chinês: `zh_CN.UTF-8`, `zh_TW.UTF-8` ou similar
- Sistema em inglês: `en_US.UTF-8`, `en_GB.UTF-8` ou similar

### Passo 2: Testar a detecção de idioma

Execute o comando `/mystatus` e observe o idioma de saída:

```
/mystatus
```

**Você deve ver**:

- Se o idioma do sistema for chinês → Saída em chinês (como `3小时限额`, `重置: 2小时30分钟后`)
- Se o idioma do sistema for inglês → Saída em inglês (como `3-hour limit`, `Resets in: 2h 30m`)

### Passo 3: Alternar temporariamente o idioma do sistema (para teste)

Se você quiser testar o efeito de saída em diferentes idiomas, pode modificar temporariamente as variáveis de ambiente:

::: code-group

```bash [macOS/Linux (alternar temporariamente para inglês)]
LANG=en_US.UTF-8 /mystatus
```

```powershell [Windows (alternar temporariamente para inglês)]
$env:LANG="en_US.UTF-8"; /mystatus
```

:::

**Você deve ver**:

Mesmo que seu sistema esteja em chinês, a saída mudará para o formato em inglês.

::: warning
Isso é apenas um teste temporário e não alterará permanentemente o idioma do sistema. As configurações originais serão restauradas após fechar o terminal.
:::

### Passo 4: Entender o mecanismo de detecção da API Intl

A API Intl é uma interface de padrão de internacionalização fornecida por navegadores e Node.js. O plugin prioriza o uso dela para detectar o idioma:

**Código de detecção** (versão simplificada):

```javascript
// 1. Priorizar a API Intl
const intlLocale = Intl.DateTimeFormat().resolvedOptions().locale;
if (intlLocale.startsWith("zh")) {
  return "zh";  // Chinês
}

// 2. Fallback para variáveis de ambiente
const lang = process.env.LANG || process.env.LC_ALL || "";
if (lang.startsWith("zh")) {
  return "zh";
}

// 3. Inglês padrão
return "en";
```

**Vantagens da API Intl**:
- Mais confiável, baseada nas configurações reais do sistema
- Suporta ambientes de navegador e Node.js
- Fornece informações completas de locale (como `zh-CN`, `en-US`)

**Variáveis de ambiente como fallback**:
- Compatível com ambientes que não suportam a API Intl
- Fornece uma maneira de controlar manualmente o idioma (modificando variáveis de ambiente)

### Passo 5: Alternar permanentemente o idioma do sistema (se necessário)

Se você quiser que o mystatus sempre use um idioma específico, pode modificar as configurações de idioma do sistema:

::: info
Modificar o idioma do sistema afetará todos os aplicativos, não apenas o mystatus.
:::

**macOS**:
1. Abra "Configurações do Sistema" → "Geral" → "Idioma e Região"
2. Adicione o idioma desejado e arraste-o para o topo
3. Reinicie o OpenCode

**Linux**:
```bash
# Modifique ~/.bashrc ou ~/.zshrc
export LANG=zh_CN.UTF-8

# Recarregue a configuração
source ~/.bashrc
```

**Windows**:
1. Abra "Configurações" → "Hora e Idioma" → "Idioma e Região"
2. Adicione o idioma desejado e defina como padrão
3. Reinicie o OpenCode

## Ponto de verificação ✅

Verifique se a detecção de idioma está correta:

| Item de teste | Operação | Resultado esperado |
|--- | --- | ---|
| Sistema em chinês | Executar `/mystatus` | Saída em chinês (como `3小时限额`) |
| Sistema em inglês | Executar `/mystatus` | Saída em inglês (como `3-hour limit`) |
| Alternância temporária | Modificar a variável de ambiente `LANG` e executar o comando | O idioma de saída muda de acordo |

## Avisos sobre armadilhas

### Problemas comuns

| Problema | Causa | Solução |
|--- | --- | ---|
| O idioma de saída não corresponde ao esperado | Configuração de idioma do sistema incorreta | Verifique a variável de ambiente `LANG` ou as configurações de idioma do sistema |
| API Intl não disponível | Versão do Node.js muito antiga ou ambiente não suportado | O plugin fará fallback automaticamente para a detecção de variáveis de ambiente |
| Sistema em chinês exibindo inglês | A variável de ambiente `LANG` não está definida como `zh_*` | Defina o valor correto de `LANG` (como `zh_CN.UTF-8`) |

### Explicação da lógica de detecção

**Quando usar a API Intl**:
- Node.js ≥ 0.12 (suporta API Intl)
- Ambiente de navegador (todos os navegadores modernos)

**Quando fazer fallback para variáveis de ambiente**:
- A API Intl lança uma exceção
- O ambiente não suporta a API Intl

**Quando usar inglês padrão**:
- Variáveis de ambiente não definidas
- Variáveis de ambiente não começam com `zh`

::: tip
O plugin detecta o idioma **apenas uma vez** durante o carregamento do módulo. É necessário reiniciar o OpenCode após modificar o idioma do sistema para que as alterações entrem em vigor.
:::

## Resumo desta lição

- **Detecção automática**: O mystatus detecta automaticamente o idioma do sistema, sem necessidade de configuração manual
- **Prioridade de detecção**: API Intl → Variáveis de ambiente → Inglês padrão
- **Idiomas suportados**: Chinês (zh) e Inglês (en)
- **Cobertura de tradução**: Unidades de tempo, limites relacionados, mensagens de erro, títulos de plataformas
- **Alternar idioma**: Modificar as configurações de idioma do sistema, reiniciar o OpenCode

## Próxima lição

> Na próxima lição, aprenderemos **[Perguntas frequentes: impossível consultar cota, token expirado, problemas de permissão](../../faq/troubleshooting/)**.
>
> Você aprenderá:
> - Como solucionar problemas de leitura de arquivos de autenticação
> - Soluções quando o token expira
> - Recomendações de configuração quando as permissões são insuficientes

---

## Apêndice: Referência do código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Data de atualização: 2026-01-23

| Funcionalidade | Caminho do arquivo | Número da linha |
|--- | --- | ---|
| Função de detecção de idioma | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L24-L40) | 24-40 |
| Definição de tradução em chinês | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L46-L124) | 46-124 |
| Definição de tradução em inglês | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L125-L203) | 125-203 |
| Exportação do idioma atual | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L210) | 210 |
| Exportação da função de tradução | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L213) | 213 |

**Funções principais**:
- `detectLanguage()`: Detecta o idioma do sistema do usuário, priorizando a API Intl, com fallback para variáveis de ambiente, padrão em inglês
- `currentLang`: Idioma atual (detectado uma vez durante o carregamento do módulo)
- `t`: Função de tradução que retorna o conteúdo de tradução correspondente com base no idioma atual

**Constantes principais**:
- `translations`: Dicionário de tradução, contendo pacotes de idioma `zh` e `en`
- Tipos de tradução suportados: unidades de tempo (dias, horas, minutos), limites relacionados (hourLimit, dayLimit, remaining, resetIn), mensagens de erro (authError, apiError, timeoutError), títulos de plataformas (openaiTitle, zhipuTitle, googleTitle, copilotTitle)

**Lógica de detecção**:
1. Priorizar o uso de `Intl.DateTimeFormat().resolvedOptions().locale` para detectar o idioma
2. Se a API Intl não estiver disponível, fazer fallback para as variáveis de ambiente `LANG`, `LC_ALL`, `LANGUAGE`
3. Se as variáveis de ambiente também não existirem ou não começarem com `zh`, usar inglês padrão

</details>
