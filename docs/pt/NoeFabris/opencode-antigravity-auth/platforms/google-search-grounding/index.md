---
title: "Google Search: Deixe o Gemini Pesquisar na Web | Antigravity"
sidebarTitle: "Faça o Gemini Pesquisar Online"
subtitle: "Google Search Grounding: Deixe o Gemini Pesquisar Informações na Web"
description: "Aprenda a habilitar o Google Search Grounding para o Gemini, permitindo que o modelo busque informações em tempo real na web. Domine as opções de configuração e ajustes de limiar para equilibrar precisão e velocidade de resposta."
tags:
  - "gemini"
  - "google-search"
  - "grounding"
  - "configuração"
prerequisite:
  - "start-quick-install"
  - "start-first-request"
order: 3
---

# Google Search Grounding: Deixe o Gemini Pesquisar Informações na Web

## O Que Você Vai Aprender

- Habilitar o Google Search para modelos Gemini, permitindo que a IA busque informações em tempo real na web
- Ajustar o limiar de pesquisa para controlar a frequência das buscas do modelo
- Compreender como o Google Search Grounding funciona e em quais cenários é mais útil
- Escolher a configuração adequada de acordo com as necessidades da tarefa

## Seu Dilema Atual

::: info O Que é o Google Search Grounding?

O **Google Search Grounding** é um recurso do Gemini que permite que o modelo busque automaticamente no Google quando necessário, obtendo informações em tempo real (como notícias, estatísticas, preços de produtos, etc.), em vez de depender totalmente dos dados de treinamento.

:::

Ao perguntar ao Gemini "como está o tempo hoje" ou "qual é a versão mais recente do VS Code", o modelo pode não conseguir responder porque seus dados de treinamento já estão desatualizados. Com o Google Search Grounding habilitado, o modelo pode pesquisar a resposta online sozinho, assim como você faz com o navegador.

## Quando Usar Este Recurso

| Cenário | É Necessário Habilitar? | Motivo |
|---------|------------------------|--------|
| Geração de código, problemas de programação | ❌ Não é necessário | O conhecimento de programação é relativamente estável, os dados de treinamento são suficientes |
| Obter informações atualizadas (notícias, preços, versões) | ✅ Altamente recomendado | Necessita de dados em tempo real |
| Verificação de fatos (datas específicas, estatísticas) | ✅ Recomendado | Evita que o modelo invente informações |
| Escrita criativa, brainstorming | ❌ Não é necessário | Não precisa de precisão factual |
| Consulta de documentação técnica | ✅ Recomendado | Encontrar documentação de API mais recente |

## Ideia Central

O núcleo do Google Search Grounding é permitir que o modelo busque automaticamente **quando necessário**, em vez de pesquisar sempre. O plugin injeta a ferramenta `googleSearchRetrieval`, permitindo que o Gemini possa chamar a API de pesquisa do Google.

::: tip Conceitos-Chave

- **Modo Auto**: O próprio modelo decide se deve pesquisar (com base no limiar)
- **Limiar (grounding_threshold)**: Controla o "limiar" para a pesquisa do modelo. Quanto menor o valor, mais frequente a pesquisa

:::

## 🎒 Preparações Antes de Começar

::: warning Verificação Prévia

Antes de começar, confirme:

  - [ ] Concluiu a [Instalação Rápida](../../start/quick-install/)
  - [ ] Adicionou pelo menos uma conta do Google
  - [ ] Já fez uma primeira solicitação com sucesso (consulte [Primeira Solicitação](../../start/first-request/))

:::

## Siga Comigo

### Passo 1: Verificar a Localização do Arquivo de Configuração

O arquivo de configuração do plugin está localizado em:

- **macOS/Linux**: `~/.config/opencode/antigravity.json`
- **Windows**: `%APPDATA%\opencode\antigravity.json`

Se o arquivo não existir, crie-o primeiro:

```bash
# macOS/Linux
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
}
EOF
```

```powershell
# Windows
@"
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
}
"@ | Out-File -FilePath "$env:APPDATA\opencode\antigravity.json" -Encoding utf8
```

**Você deve ver**: O arquivo de configuração foi criado, contendo o campo `$schema`

### Passo 2: Habilitar o Google Search

Adicione a configuração `web_search` ao arquivo de configuração:

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "web_search": {
    "default_mode": "auto",
    "grounding_threshold": 0.3
  }
}
```

**Descrição da Configuração**:

| Campo | Valor | Descrição |
|-------|-------|-----------|
| `web_search.default_mode` | `"auto"` ou `"off"` | Habilita ou desabilita o Google Search, padrão `"off"` |
| `web_search.grounding_threshold` | `0.0` - `1.0` | Limiar de pesquisa, padrão `0.3`, válido apenas no modo `auto` |

**Você deve ver**: O arquivo de configuração foi atualizado, contendo a configuração `web_search`

### Passo 3: Ajustar o Limiar de Pesquisa (Opcional)

O `grounding_threshold` controla a frequência da pesquisa do modelo:

| Limiar | Comportamento | Cenários Aplicáveis |
|--------|---------------|---------------------|
| `0.0 - 0.2` | Pesquisa frequente, quase toda dúvida aciona a pesquisa | Necessita de dados em tempo real altamente precisos |
| `0.3` (padrão) | Equilíbrio, o modelo precisa de certeza razoável para pesquisar | Uso diário, equilíbrio entre precisão e velocidade |
| `0.7 - 1.0` | Pouca pesquisa, só aciona em alta confiança | Reduzir número de pesquisas, aumentar velocidade |

::: tip Dica de Experiência

Comece com o valor padrão `0.3`, se notar:
- **O modelo não pesquisa** → Reduza o limiar (ex: `0.2`)
- **Pesquisa muito frequente, resposta lenta** → Aumente o limiar (ex: `0.5`)

:::

**Você deve ver**: O limiar foi ajustado, pode otimizar com base na experiência real de uso

### Passo 4: Verificar a Configuração

Reinicie o OpenCode, ou recarregue a configuração (se suportado), então faça uma solicitação que requer informações em tempo real:

```
Entrada do Usuário:
Qual é a versão mais recente do VS Code?

Resposta do Sistema (com Google Search habilitado):
A versão estável mais recente do VS Code é 1.96.4 (até janeiro de 2026)...

[citation:1] ← Marcador de fonte de referência
```

**Você deve ver**:
- A resposta do modelo contém fonte de referência (`[citation:1]` etc.)
- O conteúdo da resposta está atualizado, não uma versão antiga dos dados de treinamento

### Passo 5: Testar Diferentes Limiares

Tente ajustar o `grounding_threshold` e observe as mudanças no comportamento do modelo:

```json
// Limiar baixo (pesquisa frequente)
"grounding_threshold": 0.1

// Limiar alto (pouca pesquisa)
"grounding_threshold": 0.7
```

Após cada ajuste, teste com a mesma pergunta e observe:
- Se houve pesquisa (verificar se há referência na resposta)
- Número de pesquisas (múltiplos `citation`)
- Velocidade de resposta

**Você deve ver**:
- Limiar baixo: pesquisa mais frequente, mas resposta um pouco mais lenta
- Limiar alto: menos pesquisas, mas pode haver imprecisão na resposta

## Ponto de Verificação ✅

::: details Clique para Expandir a Lista de Verificação

Complete as seguintes verificações para confirmar que a configuração está correta:

- [ ] O arquivo de configuração contém a configuração `web_search`
- [ ] `default_mode` está definido como `"auto"`
- [ ] `grounding_threshold` está entre `0.0` e `1.0`
- [ ] Ao fazer uma solicitação que requer informações em tempo real, o modelo retorna com referência
- [ ] Após ajustar o limiar, o comportamento de pesquisa do modelo muda

Se todos passarem, o Google Search Grounding está habilitado corretamente!

:::

## Alertas de Problemas Comuns

### Problema 1: O Modelo Não Pesquisou

**Sintoma**: Após habilitar o modo `auto`, o modelo ainda não pesquisou e não há fonte de referência.

**Causas**:
- O limiar é muito alto (ex: `0.9`), o modelo precisa de alta certeza para pesquisar
- A pergunta em si não requer pesquisa (ex: problemas de programação)

**Solução**:
- Reduza o `grounding_threshold` para `0.2` ou menor
- Teste com perguntas que claramente requerem informações em tempo real (ex: "como está o tempo hoje", "últimas notícias")

### Problema 2: Pesquisa Muito Frequente, Resposta Lenta

**Sintoma**: Cada pergunta aciona uma pesquisa, o tempo de resposta aumenta significativamente.

**Causas**:
- O limiar é muito baixo (ex: `0.1`), o modelo dispara pesquisas com muita frequência
- O tipo de pergunta em si requer informações em tempo real (ex: preços de ações, notícias)

**Solução**:
- Aumente o `grounding_threshold` para `0.5` ou maior
- Se a tarefa não requer informações em tempo real, altere o `default_mode` para `"off"`

### Problema 3: Erro de Formato no Arquivo de Configuração

**Sintoma**: O plugin apresenta erro e não consegue carregar a configuração.

**Causas**: Erro de formato JSON (ex: vírgula extra, aspas não correspondentes).

**Solução**: Use uma ferramenta de validação JSON para verificar o arquivo de configuração, garantindo que o formato esteja correto.

```bash
# Validar formato JSON
cat ~/.config/opencode/antigravity.json | python3 -m json.tool
```

## Resumo da Aula

- O **Google Search Grounding** permite que modelos Gemini pesquisem informações em tempo real na web
- Habilite através de `web_search.default_mode: "auto"`, desabilite com `"off"`
- O `grounding_threshold` controla a frequência de pesquisa: quanto menor o valor, mais frequente a pesquisa
- O limiar padrão `0.3` é adequado para a maioria dos cenários, pode ser ajustado conforme a experiência de uso
- O modelo incluirá fontes de referência na resposta, marcadas como `[citation:1]` etc.

## Próxima Aula

> Na próxima aula, aprenderemos sobre o **[Sistema de Dupla Quota](../dual-quota-system/)**.
>
> Você vai aprender:
> - Como funcionam os dois pools de quota independentes do Antigravity e Gemini CLI
> - Como alternar entre os pools de quota para maximizar o uso
> - Melhores práticas para pool de quota

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Última atualização: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Linha |
|----------------|-------------------|-------|
| Schema de Configuração do Google Search | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 303-319 |
| Definição de Tipos do Google Search | [`src/plugin/transform/types.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/types.ts) | 85-88 |
| Lógica de Injeção do Google Search | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 402-419 |
| Carregamento de Configuração do Google Search | [`src/plugin/config/loader.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/loader.ts) | 173-184 |
| Aplicação de Configuração do Google Search | [`src/plugin.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin.ts) | 1194-1196 |

**Configurações Chave**:

- `web_search.default_mode`: `"auto"` ou `"off"`, padrão `"off"`
- `web_search.grounding_threshold`: `0.0` - `1.0`, padrão `0.3`

**Funções Chave**:

- `applyGeminiTransforms()`: Aplica todas as transformações do Gemini, incluindo a injeção do Google Search
- `normalizeGeminiTools()`: Normaliza o formato das ferramentas, preservando a ferramenta `googleSearchRetrieval`
- `wrapToolsAsFunctionDeclarations()`: Empacota as ferramentas no formato `functionDeclarations`

**Princípio de Funcionamento**:

1. O plugin lê `web_search.default_mode` e `web_search.grounding_threshold` do arquivo de configuração
2. Quando `mode === "auto"`, injeta a ferramenta `googleSearchRetrieval` no array `tools` da requisição:
   ```json
   {
     "googleSearchRetrieval": {
       "dynamicRetrievalConfig": {
         "mode": "MODE_DYNAMIC",
         "dynamicThreshold": 0.3  // grounding_threshold
       }
     }
   }
   ```
3. O modelo Gemini decide se deve chamar a ferramenta de pesquisa com base no limiar
4. Os resultados da pesquisa serão incluídos na resposta, com a fonte de referência marcada (`[citation:1]` etc.)

</details>
