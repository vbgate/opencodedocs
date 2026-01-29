---
title: "Frameworks Suportados: Lista Completa de 45+ | Agent Skills"
sidebarTitle: "Frameworks"
subtitle: "Frameworks Suportados: Lista Completa"
description: "Conheça os mais de 45 frameworks suportados pelo Vercel Deploy do Agent Skills. Inclui React, Vue, Svelte, Angular e a lógica de detecção automática de projetos."
tags:
  - "Frameworks"
  - "Deploy"
  - "Compatibilidade"
  - "Referência"
prerequisite: []
---

# Lista de Frameworks Suportados

## O Que Você Poderá Fazer Após Este Curso

- Conhecer a lista completa de frameworks suportados pela habilidade Vercel Deploy (45+)
- Entender como funciona a lógica de detecção de frameworks
- Avaliar se seu projeto suporta deploy com um clique
- Ver as regras de prioridade de detecção de frameworks

## Seu Desafio Atual

Você quer usar a funcionalidade de deploy com um clique do Agent Skills, mas não tem certeza se o framework do seu projeto é suportado, ou quer entender como funciona a lógica de detecção.

## Ideia Central

A habilidade Vercel Deploy escaneia o arquivo `package.json` do projeto, checando `dependencies` e `devDependencies` por nomes de pacotes predefinidos para determinar qual framework o projeto usa.

**A detecção é em ordem de prioridade**: do framework mais específico ao mais genérico, evitando identificações incorretas. Por exemplo:
1. Detecta `next` → Combina com Next.js
2. Mesmo que também tenha `react`, reconhecerá como Next.js prioritariamente

::: tip Escopo da Detecção

A verificação analisa simultaneamente `dependencies` e `devDependencies`, então mesmo que o framework esteja instalado apenas como dependência de desenvolvimento, será identificado.

:::

## Lista Completa de Frameworks

### Ecossistema React

| Framework          | Dependência Detectada | Valor Retornado |
|--- | --- | ---|
| **Next.js**        | `next`                | `nextjs`        |
| **Gatsby**        | `gatsby`              | `gatsby`        |
| **Remix**         | `@remix-run/`         | `remix`         |
| **React Router**  | `@react-router/`      | `react-router`  |
| **Blitz**         | `blitz`               | `blitzjs`       |
| **Create React App** | `react-scripts`     | `create-react-app` |
| **Ionic React**   | `@ionic/react`        | `ionic-react`   |
| **Preact**        | `preact`              | `preact`        |

### Ecossistema Vue

| Framework       | Dependência Detectada | Valor Retornado |
|--- | --- | ---|
| **Nuxt**      | `nuxt`               | `nuxtjs`        |
| **VitePress** | `vitepress`           | `vitepress`      |
| **VuePress**  | `vuepress`            | `vuepress`       |
| **Gridsome**   | `gridsome`            | `gridsome`       |

### Ecossistema Svelte

| Framework          | Dependência Detectada    | Valor Retornado  |
|--- | --- | ---|
| **SvelteKit**      | `@sveltejs/kit`        | `sveltekit-1`   |
| **Svelte**         | `svelte`               | `svelte`         |
| **Sapper** (legacy) | `sapper`              | `sapper`         |

### Angular

| Framework         | Dependência Detectada | Valor Retornado |
|--- | --- | ---|
| **Angular**       | `@angular/core`      | `angular`       |
| **Ionic Angular** | `@ionic/angular`     | `ionic-angular` |

### Geradores de Sites Estáticos

| Framework         | Dependência Detectada | Valor Retornado |
|--- | --- | ---|
| **Astro**         | `astro`               | `astro`         |
| **Docusaurus**    | `@docusaurus/core`   | `docusaurus-2`  |
| **Hexo**          | `hexo`                | `hexo`          |
| **Eleventy**      | `@11ty/eleventy`      | `eleventy`      |
| **RedwoodJS**     | `@redwoodjs/`         | `redwoodjs`      |

### Frameworks de Backend Node.js

| Framework          | Dependência Detectada | Valor Retornado |
|--- | --- | ---|
| **Express**        | `express`             | `express`       |
| **NestJS**        | `@nestjs/core`        | `nestjs`        |
| **Hono**           | `hono`                | `hono`           |
| **Fastify**        | `fastify`             | `fastify`       |
| **Elysia**         | `elysia`              | `elysia`         |
| **h3**             | `h3`                  | `h3`             |
| **Nitro**          | `nitropack`           | `nitro`          |

### Outros Frameworks

| Framework          | Dependência Detectada          | Valor Retornado    |
|--- | --- | ---|
| **SolidStart**    | `@solidjs/start`             | `solidstart-1`    |
| **Ember**         | `ember-cli`, `ember-source`    | `ember`           |
| **Dojo**          | `@dojo/framework`            | `dojo`            |
| **Polymer**       | `@polymer/`                 | `polymer`         |
| **Stencil**       | `@stencil/core`             | `stencil`         |
| **UmiJS**         | `umi`                        | `umijs`           |
| **Saber**         | `saber`                     | `saber`           |
| **Sanity**        | `sanity`, `@sanity/`        | `sanity` ou `sanity-v3` |
| **Storybook**     | `@storybook/`              | `storybook`       |
| **Hydrogen** (Shopify) | `@shopify/hydrogen`        | `hydrogen`        |
| **TanStack Start** | `@tanstack/start`           | `tanstack-start`  |

### Ferramentas de Build

| Framework          | Dependência Detectada | Valor Retornado |
|--- | --- | ---|
| **Vite**          | `vite`                | `vite`          |
| **Parcel**        | `parcel`              | `parcel`        |

### Projetos HTML Estáticos

Se seu projeto **não tem** `package.json` (site HTML puramente estático), a detecção de framework retornará `null`.

O script de deploy tratará automaticamente:
- Detecta automaticamente arquivos `.html` no diretório raiz
- Se houver apenas um arquivo `.html` e não for `index.html`, renomeia automaticamente para `index.html`
- Hospeda diretamente como site estático no Vercel

**Exemplo de Cenário**:
```bash
my-static-site/
└── demo.html  # Será renomeado automaticamente para index.html
```

## Princípios de Detecção de Framework

### Fluxo de Detecção

```
Lê package.json
    ↓
Escaneia dependencies e devDependencies
    ↓
Combina com nomes de pacote predefinidos por prioridade
    ↓
Encontra primeira combinação → Retorna identificador de framework correspondente
    ↓
Não encontrou combinação → Retorna null (projeto HTML estático)
```

### Ordem de Detecção

A detecção é ordenada pela especificidade do framework, **priorizando combinações mais específicas**:

```bash
# Exemplo: Projeto Next.js
dependencies:
  next: ^14.0.0        # Combina → nextjs
  react: ^18.0.0       # Pula (já há combinação de prioridade maior)
  react-dom: ^18.0.0
```

**Parte da Ordem de Detecção**:
1. Next.js, Gatsby, Remix, Blitz (frameworks específicos)
2. SvelteKit, Nuxt, Astro (metaframeworks)
3. React, Vue, Svelte (bibliotecas base)
4. Vite, Parcel (ferramentas de build genéricas)

### Regras de Detecção

- **Verifica simultaneamente** `dependencies` e `devDependencies`
- **Combina um a um**, retorna ao encontrar primeiro
- **Combinação de nome de pacote**: Combinação exata ou prefixo
  - Combinação exata: `"next"` → Next.js
  - Combinação de prefixo: `"@remix-run/"` → Remix

```bash
# Lógica de detecção em shell (versão simplificada)
has_dep() {
    echo "$content" | grep -q "\"$1\""
}

if has_dep "next"; then
    echo "nextjs"
fi
```

## Como Validar o Framework do Seu Projeto

### Método 1: Ver package.json

Abra o `package.json` do projeto, procure nomes de pacote da lista acima em `dependencies` ou `devDependencies`.

```json
{
  "dependencies": {
    "next": "^14.0.0",  ← Next.js
    "react": "^18.0.0"
  }
}
```

### Método 2: Tentar Deploy

Use diretamente a funcionalidade Vercel Deploy:

```
Deploy my app to Vercel
```

O Claude exibirá o framework detectado:

```
Detected framework: nextjs
```

### Método 3: Executar Manualmente Script de Detecção

Se você quiser testar com antecedência, pode executar:

```bash
bash skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh
```

Exibirá as informações de framework detectado (stderr).

## Armadilhas

### Problema 1: Detecção de Framework Incorreta

**Sintoma**:
```
Detected framework: vite
# Mas você esperava nextjs
```

**Causa**: A detecção é por ordem de prioridade, Vite é detectado após Next.js, mas se o projeto tiver ambos `vite` e `next`, pode combinar com Vite.

**Impacto**: Geralmente não afeta o deploy, o Vercel detectará automaticamente a configuração de build.

**Solução**:
- Verifique as dependências em `package.json`
- Se não afetar o deploy, pode ignorar
- O deploy ainda funciona corretamente, apenas usa configuração diferente

### Problema 2: Projeto Não Está na Lista

**Sintoma**: O framework do seu projeto não está na lista acima.

**Possíveis Causas**:
- É um framework muito novo ou obscuro
- O framework usa nome de pacote diferente
- O script de deploy ainda não adicionou suporte

**Solução**:
1. Verifique se o projeto usa **Vite** ou **Parcel** ou outras ferramentas de build genéricas
2. Tente o deploy, o Vercel pode reconhecer automaticamente
3. Se for projeto HTML estático, deploy diretamente
4. Submeta PR para [agent-skills](https://github.com/vercel-labs/agent-skills) adicionando suporte ao framework

### Problema 3: Projeto com Múltiplos Frameworks

**Sintoma**: Projeto usa simultaneamente múltiplos frameworks (como Remix + Storybook).

**Comportamento de Detecção**: Retorna o primeiro framework combinado por prioridade.

**Impacto**: Geralmente não afeta o deploy, o framework principal será identificado corretamente.

## Perguntas Frequentes

### Q: Meu framework não está na lista, consigo fazer deploy?

R: Pode tentar. Se o projeto usar ferramentas de build genéricas como Vite ou Parcel, pode ser reconhecido como essas ferramentas. O Vercel também tentará detectar automaticamente a configuração de build.

### Q: Erro de detecção afetará o deploy?

R: Geralmente não. O Vercel possui um poderoso mecanismo de detecção automática, mesmo que o identificador de framework não seja preciso, ainda pode construir e fazer deploy corretamente.

### Q: Como adicionar suporte para novo framework?

R: Modifique a função `detect_framework()` em `deploy.sh`, adicione novas regras de detecção, depois submeta PR para [agent-skills](https://github.com/vercel-labs/agent-skills).

### Q: Projetos HTML estáticos precisam de package.json?

R: Não precisam. Projetos HTML estáticos (sem build JavaScript) podem ser diretamente implantados, o script tratará automaticamente.

## Resumo da Lição

A funcionalidade Vercel Deploy do Agent Skills suporta **mais de 45 frameworks**, abrangendo todo o stack de tecnologias frontend principais:

**Valor Principal**:
- ✅ Amplo suporte a frameworks, React/Vue/Svelte/Angular totalmente cobertos
- ✅ Detecção inteligente de framework, identifica automaticamente o tipo de projeto
- ✅ Suporte a projetos HTML estáticos, deploy sem dependências
- ✅ Open source, extensível para adicionar novos frameworks

**Princípios de Detecção**:
- Escaneia `dependencies` e `devDependencies` do package.json
- Combina com nomes de pacote de frameworks predefinidos por prioridade
- Retorna o identificador de framework correspondente para uso pelo Vercel

**Próximo Passo**:
Consulte o [Tutorial de Deploy com um Clique no Vercel](../../platforms/vercel-deploy/) para aprender como usar esta funcionalidade.

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir localizações do código fonte</strong></summary>

> Atualizado em: 2026-01-25

| Funcionalidade        | Caminho do Arquivo                                                                                             | Número de Linha    |
|--- | --- | ---|
| Lógica de detecção de framework | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 11-156            |
| Entrada do script de deploy | [`deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 1-250             |
| Tratamento de HTML estático | [`deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 192-205           |

**Funções Chave**:
- `detect_framework()`: Detecta mais de 45 frameworks a partir do package.json (11-156 linhas)
- `has_dep()`: Verifica se dependência existe (23-25 linhas)

**Ordem de Detecção de Framework** (parte):
1. Blitz (blitzjs)
2. Next.js (nextjs)
3. Gatsby (gatsby)
4. Remix (remix)
5. React Router (react-router)
6. TanStack Start (tanstack-start)
7. Astro (astro)
8. Hydrogen (hydrogen)
9. SvelteKit (sveltekit-1)
10. Svelte (svelte)
... (lista completa ver 11-156 linhas)

**Valores de Retorno Exemplo**:
- Next.js: `nextjs`
- Nuxt: `nuxtjs`
- HTML estático: `null`

</details>
