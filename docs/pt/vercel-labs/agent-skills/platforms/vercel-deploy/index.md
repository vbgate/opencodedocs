---
title: "Vercel Deploy: Publicação Rápida de Apps | Agent Skills"
sidebarTitle: "Vercel Deploy"
subtitle: "Deploy com Um Clique no Vercel: Publicação Rápida de Aplicativos"
description: "Aprenda a usar o Vercel Deploy do Agent Skills. Deploy com um clique, detecção automática de 40+ frameworks, links de preview e transferência de propriedade."
tags:
  - "Vercel"
  - "Deploy"
  - "Publicação com Um Clique"
  - "Frameworks Front-end"
prerequisite:
  - "start-installation"
---

# Deploy com Um Clique no Vercel: Publicação Rápida de Aplicativos

## O Que Você Poderá Fazer Após Este Curso

- Deixe o Claude fazer o deploy do seu projeto para Vercel com uma frase, sem configuração manual
- Obter links de preview acessíveis e links de transferência de propriedade
- Detectar automaticamente o framework do projeto (Next.js, React, Vue, Svelte, etc. 40+）
- Tratar sites HTML estáticos, suportando renomeação de arquivo único

## Seu Desafio Atual

Cada vez que você quiser compartilhar seu projeto, precisa:

1. Fazer login manual no site da Vercel
2. Criar novo projeto
3. Conectar repositório Git
4. Esperar conclusão do build
5. Lembrar uma longa string URL para compartilhar com outros

Se for apenas para mostrar rapidamente um demo ou protótipo, essas etapas são muito trabalhosas.

## Quando Usar Esta Abordagem

Adequado para os seguintes cenários:

- 🚀 Criar preview rápido de projeto para compartilhar com equipe
- 📦 Mostrar demo para cliente ou amigo
- 🔄 Gera automaticamente preview deploy em CI/CD
- 🌐 Deploy de páginas HTML estáticas ou Single Page Applications

## Ideia Central

O fluxo de trabalho da habilidade Vercel Deploy é bem simples:

```
Sua fala → Claude detecta palavras-chave → ativa habilidade de deploy
     ↓
           Detecta tipo de framework (do package.json）
     ↓
           Empacota projeto (exclui node_modules e .git)
     ↓
           Faz upload para API Vercel
     ↓
           Retorna dois links (preview + transferência)
```

**Por que precisa de dois links?**

- **Preview URL**: Endereço acessível imediatamente
- **Claim URL**: Transfere este deploy para sua conta Vercel abaixo de gerenciamento

O benefício deste design: o deployer (Agent) não precisa das permissões da sua conta, você pode depois obter a propriedade através do Claim URL.

## 🎒 Preparação Antes de Começar

::: warning Verificação de Pré-requisitos

- ✅ Já completou [Instalação do Agent Skills](../installation/)
- ✅ Estrutura de diretório do projeto completa (tem `package.json` ou é projeto HTML estático)
- ✅ Permissões de rede claude.ai configuradas (se estiver usando claude.ai)

:::
::: info Lembrete de Permissões de Rede

Se você usar **claude.ai** (versão web), precisa permitir acesso ao domínio `*.vercel.com`:

1. Acesse [https://claude.ai/settings/capabilities](https://claude.ai/settings/capabilities)
2. Na lista de permitidos, adicione `*.vercel.com`
3. Salve as configurações e tente novamente o deploy

Seu deploy falhar e exibir erro de rede, verifique esta configuração.
:::

## Siga-me

### Passo 1: Alternar para Diretório do Projeto

```bash
# Entre no diretório do seu projeto
cd /path/to/your/project
```

**Por Quê**
O script de deploy precisa encontrar o `package.json` e arquivos fonte do projeto, o posicionamento do diretório é importante.

### Passo 2: Dizer ao Claude para Fazer Deploy

Na conversa com Claude, digite:

```
Deploy my app to Vercel
```

Você também pode tentar estas palavras-chave de ativação:

- "Deploy this to production"
- "Deploy and give me link"
- "Push this live"
- "Create a preview deployment"

### Passo 3: Observar Processo de Deploy

Você verá uma saída semelhante a esta:

```
Preparing deployment...
Detected framework: nextjs
Creating deployment package...
Deploying...
✓ Deployment successful!

Preview URL: https://skill-deploy-abc123.vercel.app
Claim URL:   https://vercel.com/claim-deployment?code=...

View your site at Preview URL.
To transfer this deployment to your Vercel account, visit Claim URL.
```

Ao mesmo tempo, Claude também exibirá formato JSON (para facilitar análise por scripts):

```json
{
  "previewUrl": "https://skill-deploy-abc123.vercel.app",
  "claimUrl": "https://vercel.com/claim-deployment?code=...",
  "deploymentId": "dpl_...",
  "projectId": "prj_..."
}
```

**Você Deve Ver**:
- Sucesso de deploy indicado com ✓
- Dois URLs (preview e claim)
- Se for projeto de código, também exibirá nome do framework detectado

### Passo 4: Acessar Link de Preview

**Clique no Preview URL**, e você verá o site no ar online!

Se for um demo ou visualização temporária, tarefa está completa.

### Passo 5: (Opcional) Transferir Propriedade

Se você quiser gerenciar este deploy a longo prazo:

1. Clique no **Claim URL**
2. Faça login na sua conta Vercel
3. Confirme a transferência
4. O deploy agora pertence à sua conta, pode continuar editando e gerenciando
5. Pode ver logs, re-deployar, etc no Dashboard da Vercel

**Você Deve Ver**:
- Deploy aparece na sua conta Vercel
- Pode ver logs no Vercel Dashboard, fazer re-deploy, etc.

## Ponto de Verificação ✅

Após o deploy, confirme os seguintes itens:

- [ ] Preview URL pode ser acessado no navegador
- [ ] Página exibe normalmente (sem 404 ou erro de build)
- [ ] Se for projeto de código, framework detectado corretamente (Next.js, Vite, etc.)
- [ ] Se gerenciamento a longo prazo necessário, já transferiu via Claim URL

## Frameworks Suportados

Vercel Deploy habilidade pode detectar automaticamente **40+ frameworks**:

| Categoria          | Frameworks (alguns exemplos)              |
| ----------------- | ------------------------------------------- |
| **React**           | Next.js, Gatsby, Create React App, Remix   |
| **Vue**             | Nuxt, Vitepress, Vuepress, Gridsome     |
| **Svelte**           | SvelteKit, Svelte                      |
| **Angular**          | Angular, Ionic Angular                    |
| **Node.js Backend**    | Express, Hono, Fastify, NestJS           |
| **Build Tools**       | Vite, Parcel                            |
| **Outros**            | Astro, Solid Start, Ember, Hexo, Eleventy |

::: tip Princípio de Detecção de Framework

O script lê seu `package.json`, verificando `dependencies` e `devDependencies` por nomes de pacotes predefinidos.

Se houver múltiplos matches, o script escolherá o framework mais específico (por exemplo, Next.js tem prioridade sobre React genérico).
:::

## Projetos HTML Estáticos

Se seu projeto **não tem** `package.json` (site HTML puramente estático), a habilidade de deploy tratará inteligentemente:

- **Detecção automática**: Identifica arquivos `.html` no diretório raiz
- **Renomeação**: Se houver apenas um arquivo `.html` e não for `index.html`, renomeia automaticamente para `index.html`
- **Deploy direto**: Hospeda como site estático no Vercel

**Exemplo de Cenário**:
```bash
my-static-site/
└── demo.html  # Será renomeado automaticamente para index.html
```

Após o deploy, acesse o link de preview para ver o conteúdo de `demo.html`.

## Armadilhas

### Problema 1: Falha de Deploy, Erro de Rede

**Sintoma**:
```
Error: Network Egress Error
```

**Causa**: O claude.ai bloqueia acesso a domínios externos por padrão.

**Solução**:

1. Acesse [https://claude.ai/settings/capabilities](https://claude.ai/settings/capabilities)
2. Adicione `*.vercel.com` à whitelist
3. Tente o deploy novamente

### Problema 2: Detecção de Framework Imprecisa

**Sintoma**:
```
Detected framework: vite
# Mas você esperava nextjs
```

**Causa**: O script combina em ordem de prioridade, pode ter detectado `vite` após Next.js.

**Solução**:
- Verifique as dependências em `package.json`
- Se não afetar o deploy, pode ignorar
- O projeto ainda funcionará corretamente, apenas pode estar usando configuração Vite padrão

### Problema 3: Site Estático 404

**Sintoma**:
Arquivo HTML único deployado retorna 404.

**Solução**:
Garanta que o arquivo HTML esteja no diretório raiz. Se o arquivo estiver em subdiretório, o Vercel por padrão não roteará para o caminho raiz.

**Estrutura Correta**:
```
project/
└── my-site.html  # Arquivo único na raiz, será renomeado automaticamente para index.html
```

**Estrutura Incorreta**:
```
project/
└── dist/
    └── my-site.html  # Não será renomeado, acesso retorna 404
```

### Problema 4: Deploy Bem-Sucedido mas Página Apresenta Erro

**Sintoma**:
Deploy bem-sucedido, mas ao acessar página exibe erro de build ou erro de runtime.

**Solução**:
- Execute `npm run build` localmente para verificar se passa
- Verifique logs de deploy (se já transferido para sua conta Vercel)
- Verifique variáveis de ambiente (se projeto depende de `.env`)

::: tip Exclusão Automática

O script de deploy automaticamente exclui:
- `node_modules/` (evita upload de dependências)
- `.git/` (evita upload de histórico de versões)

Se seu projeto precisar excluir outros arquivos (como `.env`), sugere tratar no empacotamento manual.
:::

## Uso Avançado

### Especificar Caminho de Deploy

Você também pode especificar outro diretório para deploy:

```
Deploy project at ./my-app
```

Claude usará esse caminho para fazer o deploy.

### Deploy de Tarball Existente

Se você já tem um pacote `.tgz` empacotado:

```
Deploy /path/to/project.tgz to Vercel
```

O script fará upload do pacote existente, pulando a etapa de empacotamento.

## Resumo da Lição

Vercel Deploy pode tornar o deploy sem precedentes simples:

**Valor Principal**:
- ✅ Deploy com uma frase, sem configuração manual
- ✅ Detecção automática de framework, suporta 40+ stacks tecnológicas
- ✅ Deploy sem autenticação, segurança alta
- ✅ Retorna links de preview + links de transferência de propriedade

**Cenários Aplicáveis**:
- 🚀 Compartilhar rapidamente demos ou protótipos
- 📦 Preview compartilhável com equipe
- 🔄 Automatização de CI/CD com preview deploy
- 🌐 Hospedagem de sites estáticos

**Próximos Passos**:
Se quiser explorar mais sobre como as habilidades funcionam por baixo dos panos, consulte:
- [React/Next.js Melhores Práticas de Desempenho](../react-best-practices/)
- [Desenvolvimento de Habilidades Personalizadas](../../advanced/skill-development/)

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir localizações do código fonte</strong></summary>

> Atualizado em: 2026-01-25

| Funcionalidade              | Caminho do Arquivo                                                                                             | Número de Linha    |
| ----------------------- | --------------------------------------------------------------------------------------------------------- | ----------------- |
| Script de entrada de deploy  | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 1-250            |
| Lógica de detecção de framework      | [`deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 12-156           |
| Empacotar e upload na API         | [`deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 208-222          |
| Renomeação de HTML estático    | [`deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 192-205           |
| Definição de habilidade         | [`skills/claude.ai/vercel-deploy-claimable/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md) | 1-113            |
| Soluçãoção de erros de rede    | [`SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md#L100-L112) | 102-112            |

**Constantes Chave**:
- `DEPLOY_ENDPOINT = "https://claude-skills-deploy.vercel.com/api/deploy"`: Endpoint da API de deploy

**Funções Chave**:
- `detect_framework()`: Detecta 40+ frameworks do package.json

**Framework Suportados** (ordem de prioridade parcial):
- React: Next.js, Gatsby, Remix, React Router
- Vue: Nuxt, Vitepress, Vuepress
- Svelte: SvelteKit, Svelte
- Outros: Astro, Angular, Express, Hono, Vite, Parcel

</details>
