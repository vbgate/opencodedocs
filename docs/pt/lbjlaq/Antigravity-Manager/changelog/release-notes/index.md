---
title: "Notas de Lançamento: Versões | Antigravity-Manager"
sidebarTitle: "Entenda atualizações de versão em 3 minutos"
subtitle: "Versões: baseadas em Changelog embutido no README"
description: "Aprenda método de versões do Antigravity-Manager. Confirme versão na página Settings e verifique atualizações, veja correções e avisos no README Changelog, use /healthz para verificar disponibilidade após atualização."
tags:
  - "changelog"
  - "lançamento"
  - "upgrade"
  - "solução de problemas"
prerequisite:
  - "start-installation"
  - "start-proxy-and-first-client"
order: 1
---

# Versões: baseadas em Changelog embutido no README

Você prepara atualizar Antigravity Tools, o que mais teme não é "não atualizou", mas "atualizou só descobrir que há mudanças de compatibilidade". Esta página deixa claro método de leitura de **Antigravity Tools Changelog (versões)**, permitindo que você antes de atualizar julgue: esta atualização afetará o quê.

## O que você poderá fazer após concluir

- Na página About de Settings, confirmar rapidamente versão atual, verificar atualização e obter entrada de download
- No README do Changelog, só ler parágrafos de versão que afetam você (não precisa ler do início ao fim)
- Antes de atualizar, fazer uma coisa: confirmar se há avisos de "precisa modificar configuração/mapeamento de modelo manualmente"
- Após atualizar, fazer verificação mínima (`/healthz`) para confirmar que proxy ainda funciona

## O que é Changelog?

**Changelog** é lista que registra "o que mudou desta vez" por versão. Antigravity Tools escrevem diretamente em "Versões" do README, cada versão marcará data e mudanças-chave. Antes de atualizar, primeiro ver Changelog pode reduzir probabilidade de encontrar mudanças de compatibilidade ou problemas de regressão.

## Quando usar esta página

- Você prepara atualizar de versão antiga para nova, primeiro confirmar pontos de risco
- Você encontra certo problema (como 429/0 Token/Cloudflared), quer confirmar se foi corrigido em versões recentes
- Você mantém versão unificada em equipe, precisa dar a colegas método de "ler mudanças por versão"

## 🎒 Preparação antes de começar

::: warning Sugiro primeiro preparar caminho de atualização
Muitos métodos de instalação/atualização (brew, download manual de Releases, atualização no aplicativo). Se ainda não determinou qual caminho usar, primeiro veja **[Instalação e Atualização: melhor caminho de instalação de desktop (brew / releases)](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/installation.md)**.
:::

## Siga-me

### Passo 1: Confirme versão atual na página About

**Por que**
Changelog é organizado por versão. Você primeiro sabe versão atual, depois sabe "a partir de onde começar a ler".

Caminho de operação: **Settings** → **About**.

**Você deve ver**: Área de título da página mostra nome do aplicativo e número de versão (por exemplo `v3.3.49`).

### Passo 2: Clique "verificar atualizações", obtenha versão mais recente e entrada de download

**Por que**
Você precisa primeiro saber "qual é número da versão mais recente", depois no Changelog escolher parágrafos de versão entre versões cruzadas.

Na página About, clique "verificar atualizações".

**Você deve ver**:
- Se houver atualização: exibe "new version available", aparece botão de download (abre `download_url`)
- Se já mais recente: exibe "latest version"

### Passo 3: Vá ao README do Changelog e só veja versões que você cruzou

**Por que**
Você só se preocupa com "mudanças entre sua versão atual e versão mais recente", outras versões históricas podem primeiro pular.

Abra README, localize **"Versões (Changelog)"**, comece da versão mais recente e desça até ver sua versão atual.

**Você deve ver**: Versões listadas no formato `vX.Y.Z (YYYY-MM-DD)`, cada versão tem agrupamento de descrição (como correções principais/aperfeiçoamentos de funcionalidade).

### Passo 4: Após atualização, faça verificação mínima

**Por que**
A primeira coisa após atualizar não é "rodar cenários complexos", mas primeiro confirmar que proxy ainda pode iniciar normalmente, pode ser verificado por cliente.

Seguindo fluxo de **[Iniciar proxy reverso local e conectar primeiro cliente (/healthz + configuração SDK)](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy-and-first-client.md)**, pelo menos verifique `GET /healthz` uma vez.

**Você deve ver**: `/healthz` retorna sucesso (usado para confirmar serviço disponível).

## Resumo de versões recentes (do README)

| Versão | Data | Pontos que você deve prestar atenção |
|--- | --- | ---|
| `v3.3.49` | 2026-01-22 | Defesa de interrupção Thinking e 0 Token; remover `gemini-2.5-flash-lite` e avisar você substituir manualmente mapeamento personalizado; configuração de idioma/tema entra em vigor imediatamente; aprimoramento de painel de monitoramento; melhoria de compatibilidade OAuth |
| `v3.3.48` | 2026-01-21 | Processo de segundo plano em modo silencioso no Windows (corrigiu cintilação de console) |
| `v3.3.47` | 2026-01-21 | Aprimoramento de mapeamento de parâmetros de geração de imagem (`size`/`quality`); suporte a túnel Cloudflared; correção de falha de início causada por conflito de merge; compressão de contexto progressiva de três camadas |

::: tip Como julgar rapidamente "esta atualização me afetará"
Priorize encontrar estes dois tipos de frases:

- **Aviso do usuário/você precisa modificar**: como nomear explicitamente que modelo padrão foi removido, requer que você ajuste manualmente mapeamento personalizado
- **Correção principal/correção de compatibilidade**: como 0 Token, 429, cintilação Windows, falha de início etc. problemas que "farão você não conseguir usar"
:::

---

## Apêndice: Referências de código-fonte

<details>
<summary><strong>Clique para expandir e ver localizações do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Conteúdo | Caminho do arquivo | Número da linha |
|--- | --- | ---|
| Changelog embutido no README (versões) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L324-L455) | 324-455 |
| Página About exibe número de versão e botão "verificar atualizações" | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L821-L954) | 821-954 |
| Página About "verificar atualizações" retorna estrutura de comando | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L187-L215) | 187-215 |
| Notificação de atualização automática (download e reinício) | [`src/components/UpdateNotification.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/UpdateNotification.tsx#L33-L96) | 33-96 |
| Número da versão atual (metadados de compilação) | [`package.json`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/package.json#L1-L4) | 1-4 |

</details>
