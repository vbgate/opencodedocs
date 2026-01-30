---
title: "Skills Incorporados: Automação de Navegador e Git | oh-my-opencode"
sidebarTitle: "4 Skills Tipo Canivete Suíço"
subtitle: "Skills Incorporados: Automação de Navegador, Design UI/UX e Git"
description: "Aprenda os 4 skills incorporados do oh-my-opencode: playwright, frontend-ui-ux, git-master, dev-browser. Domine automação de navegador, design UI e operações Git."
tags:
  - "skills"
  - "browser-automation"
  - "git"
  - "ui-ux"
prerequisite:
  - "categories-skills"
order: 110
---

# Skills Incorporados: Automação de Navegador, Design UI/UX e Especialista em Git

## O Que Você Poderá Fazer Após Este Curso

Através desta lição, você aprenderá:
- Usar `playwright` ou `agent-browser` para testes automatizados de navegador e coleta de dados
- Fazer o agent adotar uma perspectiva de designer para criar interfaces UI/UX elegantes
- Automatizar operações Git, incluindo commits atômicos, busca de histórico e rebase
- Usar `dev-browser` para desenvolvimento de automação de navegador com estado persistente

## Sua Situação Atual

Você já passou por estas situações:
- Queria testar uma página frontend, mas clicar manualmente era muito lento, e você não sabia escrever scripts Playwright
- Depois de escrever código, as mensagens de commit ficaram uma bagunça, e o histórico uma confusão
- Precisava projetar uma interface UI, mas não sabia por onde começar, e o resultado carecia de estética
- Precisava automatizar operações de navegador, mas tinha que fazer login novamente a cada vez

**Skills Incorporados** são os canivetes suíços preparados para você — cada Skill é um especialista em um domínio específico, ajudando você a resolver rapidamente essas dores.

## Quando Usar Esta Técnica

| Cenário | Skill Recomendado | Por Quê |
|---------|-------------------|---------|
| Interface frontend precisa de design bonito | `frontend-ui-ux` | Perspectiva de designer, foco em tipografia, cores, animações |
| Testes de navegador, screenshots, coleta de dados | `playwright` ou `agent-browser` | Capacidade completa de automação de navegador |
| Commits Git, busca de histórico, gerenciamento de branches | `git-master` | Detecção automática de estilo de commit, geração de commits atômicos |
| Múltiplas operações de navegador (manter estado de login) | `dev-browser` | Estado de página persistente, suporta reutilização |

## Ideia Central

**O Que é um Skill?**

Skill é um mecanismo que injeta **conhecimento profissional** e **ferramentas especializadas** no agente. Quando você usa `delegate_task` e especifica o parâmetro `load_skills`, o sistema irá:
1. Carregar o `template` do Skill como parte do prompt do sistema
2. Injetar servidores MCP configurados pelo Skill (se houver)
3. Limitar o escopo de ferramentas disponíveis (se houver `allowedTools`)

**Skills Incorporados vs Personalizados**

- **Skills Incorporados**: Prontos para uso, prompts e ferramentas pré-configuradas
- **Skills Personalizados**: Você pode criar seu próprio SKILL.md no diretório `.opencode/skills/` ou `~/.claude/skills/`

Esta lição foca em 4 Skills incorporados, que cobrem os cenários de desenvolvimento mais comuns.

## 🎒 Preparação Antes de Começar

Antes de começar a usar skills incorporados, por favor certifique-se:
- [ ] Já completou o curso [Categorias e Skills](../categories-skills/)
- [ ] Entende o uso básico da ferramenta `delegate_task`
- [ ] Skills de automação de navegador precisam primeiro iniciar o servidor correspondente (Playwright MCP ou agent-browser)

---

## Skill 1: playwright (Automação de Navegador)

### Visão Geral

O Skill `playwright` usa o servidor MCP do Playwright, fornecendo capacidade completa de automação de navegador:
- Navegação e interação de páginas
- Localização e operação de elementos (clique, preenchimento de formulários)
- Screenshots e exportação de PDF
- Intercepção e simulação de requisições de rede

**Cenários de Aplicação**: Validação de UI, testes E2E, screenshots de páginas, coleta de dados

### Siga-me: Verificar Funcionalidade do Site

**Cenário**: Você precisa verificar se a função de login está funcionando normalmente.

#### Passo 1: Acionar o Skill playwright

No OpenCode, digite:

```
Use o playwright para navegar até https://example.com/login, capture a tela para mostrar o estado da página
```

**Você deve ver**: O agent chamará automaticamente as ferramentas MCP do Playwright, abrirá o navegador e capturará a tela.

#### Passo 2: Preencher Formulário e Enviar

Continue digitando:

```
Use o playwright para preencher os campos de usuário e senha (user@example.com / password123), depois clique no botão de login, capture a tela para mostrar o resultado
```

**Você deve ver**: O agent localizará automaticamente os elementos do formulário, preencherá os dados, clicará no botão e retornará o screenshot do resultado.

#### Passo 3: Verificar Redirecionamento

```
Aguarde o carregamento da página e verifique se a URL redirecionou para /dashboard
```

**Você deve ver**: O agent relata a URL atual confirmando o sucesso do redirecionamento.

### Ponto de Verificação ✅

- [ ] O navegador conseguiu navegar para a página de destino com sucesso
- [ ] O preenchimento do formulário e as operações de clique foram executadas normalmente
- [ ] O screenshot consegue exibir claramente o estado da página

::: tip Instruções de Configuração
Por padrão, o mecanismo de automação de navegador usa o `playwright`. Se você quiser mudar para o `agent-browser`, configure no `oh-my-opencode.json`:

```json
{
  "browser_automation_engine": {
    "provider": "agent-browser"
  }
}
```
:::

---

## Skill 2: frontend-ui-ux (Perspectiva de Designer)

### Visão Geral

O Skill `frontend-ui-ux` transforma o agent em um papel de "designer que virou desenvolvedor":
- Foco em **tipografia, cores, animações** e outros detalhes visuais
- Ênfase em **direção estética ousada** (minimalista, maximalista, retrô-futurista, etc.)
- Fornece **princípios de design**: evitar fontes genéricas (Inter, Roboto, Arial), criar esquemas de cores únicos

**Cenários de Aplicação**: Design de componentes UI, embelezamento de interfaces, construção de sistemas visuais

### Siga-me: Projetar um Painel de Estatísticas Elegante

**Cenário**: Você precisa projetar uma página de painel de estatísticas de dados, mas não tem designs.

#### Passo 1: Ativar o Skill frontend-ui-ux

```
Use a skill frontend-ui-ux para projetar uma página de painel de estatísticas de dados
Requisitos: incluir 3 cartões de dados (usuários, receita, número de pedidos), usar design moderno
```

**Você deve ver**: O agent fará primeiro um "planejamento de design", determinando propósito, tom, restrições e pontos de diferenciação.

#### Passo 2: Definir Direção Estética

O agent perguntará (ou determinará internamente) o estilo de design. Por exemplo:

```
**Seleção de Direção Estética**:
- Minimalismo (Minimalist)
- Maximalismo (Maximalist)
- Retrô-futurismo (Retro-futuristic)
- Luxo/Refinado (Luxury/Refined)
```

Resposta: **Minimalismo**

**Você deve ver**: O agent gera especificações de design (fontes, cores, espaçamentos) com base na direção escolhida.

#### Passo 3: Gerar Código

```
Com base nas especificações de design acima, implemente esta página de painel usando React + Tailwind CSS
```

**Você deve ver**:
- Design tipográfico e espaçamento cuidadosos
- Cores vibrantes mas harmoniosas (não gradientes roxos comuns)
- Efeitos e transições sutis

### Ponto de Verificação ✅

- [ ] A página adota um estilo de design único, não genérico "lixo de IA"
- [ ] A seleção de fontes é distintiva, evitando Inter/Roboto/Arial
- [ ] O esquema de cores é coeso, com clara hierarquia visual

::: tip Diferença de Agent Comum
Um agent comum pode escrever código funcionalmente correto, mas a interface carece de beleza estética. O valor central do Skill `frontend-ui-ux` está em:
- Ênfase no processo de design (planejamento > codificação)
- Fornecer orientação estética clara
- Avisar contra anti-padrões (design genérico, gradientes roxos)
:::

---

## Skill 3: git-master (Especialista em Git)

### Visão Geral

O Skill `git-master` é um especialista em Git que integra três capacidades profissionais:
1. **Arquiteto de Commits**: Commits atômicos, ordem de dependência, detecção de estilo
2. **Cirurgião de Rebase**: Reescrita de histórico, resolução de conflitos, limpeza de branches
3. **Arqueólogo de Histórico**: Encontrar quando/onde uma alteração específica foi introduzida

**Princípio Central**: Por padrão, crie **múltiplos commits**, rejeitando o comportamento preguiçoso de "um commit contendo múltiplos arquivos".

**Cenários de Aplicação**: Commits de código, busca de histórico, gerenciamento de branches, operações de rebase

### Siga-me: Commit de Código Inteligente

**Cenário**: Você modificou 5 arquivos e precisa fazer o commit.

#### Passo 1: Acionar o Skill git-master (recomendado usar quick category)

```
Use delegate_task(category='quick', load_skills=['git-master']) para fazer commit das alterações de código atuais
```

**Por que usar `quick` category?**
- Operações Git não precisam de raciocínio complexo
- O modelo `claude-haiku-4-5` é suficientemente rápido para lidar
- Economia de custos (Haiku é 10x mais barato que Opus)

**Você deve ver**: O agent executa análise paralela (Fase 0), incluindo:
- `git status` e `git diff --stat`
- Logs dos últimos 30 commits (para detecção de estilo)
- Estado atual do branch

#### Passo 2: Detecção de Estilo (Fase 1)

O agent irá gerar:

```
RESULTADO DA DETECÇÃO DE ESTILO
===============================
Analisado: 30 commits do git log

Idioma: INGLÊS
  - Commits em inglês: 28 (93%)
  
Estilo: SEMÂNTICO
  - Semântico (feat:, fix:, etc.): 25 (83%)
  - Simples: 3 (10%)
  
Exemplos de referência do repositório:
  1. "feat: add user authentication"
  2. "fix: resolve database connection issue"
  3. "refactor: extract validation logic"

Todos os commits seguirão: INGLÊS + SEMÂNTICO
```

**Você deve ver**: O agent claramente informará o estilo de commit e o idioma a serem usados.

#### Passo 3: Planejamento de Commits Atômicos (Fase 3)

O agent analisará as alterações de arquivos e gerará:

```
PLANO DE COMMIT
===============
Arquivos alterados: 5
Commits mínimos necessários: ceil(5/3) = 2
Commits planejados: 3
Status: 3 >= 2 (PASSOU)

COMMIT 1: feat: add authentication service
  - src/services/auth.ts
  - src/types/auth.ts
  Justificativa: implementação do serviço + suas definições de tipos

COMMIT 2: feat: implement login page
  - src/pages/login.tsx
  - src/components/login-form.tsx
  Justificativa: página e seus componentes

COMMIT 3: feat: add API endpoint
  - src/api/auth.ts
  - tests/auth.test.ts
  Justificativa: endpoint da API + seu teste

Ordem de execução: Commit 1 -> Commit 2 -> Commit 3
```

**Você deve ver**: O agent claramente divide os commits e explica por que esses arquivos devem estar juntos.

#### Passo 4: Execução de Commits (Fase 5)

O agent executará automaticamente:
```bash
git add src/services/auth.ts src/types/auth.ts
git commit -m "feat: add authentication service"

git add src/pages/login.tsx src/components/login-form.tsx
git commit -m "feat: implement login page"

git add src/api/auth.ts tests/auth.test.ts
git commit -m "feat: add API endpoint"
```

**Você deve ver**:
- 3 commits independentes, cada um com uma mensagem semântica clara
- Diretório de trabalho limpo (`git status` sem arquivos não commitados)

### Ponto de Verificação ✅

- [ ] O agent realizou detecção de estilo e informou claramente
- [ ] A quantidade de commits atende à regra de "commits mínimos" (número de arquivos / 3, arredondado para cima)
- [ ] Cada mensagem de commit está em conformidade com o estilo detectado (semântico, descrição simples, etc.)
- [ ] Arquivos de teste e arquivos de implementação estão no mesmo commit

::: tip Funcionalidade de Busca de Histórico
O `git-master` também suporta busca de histórico poderosa:

- "when was X added" → `git log -S` (busca pickaxe)
- "who wrote this line" → `git blame`
- "when did bug start" → `git bisect`
- "find commits changing X pattern" → `git log -G` (busca regex)

Exemplo: `Use git-master para encontrar em qual commit a função 'calculate_discount' foi adicionada`
:::

::: warning Anti-padrão: Um único commit grande
A regra obrigatória do `git-master` é:

| Quantidade de Arquivos | Commits Mínimos |
|----------------------|-----------------|
| 3+ arquivos | 2+ commits |
| 5+ arquivos | 3+ commits |
| 10+ arquivos | 5+ commits |

Se o agent tentar fazer 1 commit com vários arquivos, falhará automaticamente e replanejará.
:::

---

## Skill 4: dev-browser (Navegador do Desenvolvedor)

### Visão Geral

O Skill `dev-browser` fornece capacidade de automação de navegador com estado persistente:
- **Persistência de Estado de Página**: Mantém estado de login entre execuções de múltiplos scripts
- **ARIA Snapshot**: Descobre automaticamente elementos de página, retornando estrutura em árvore com referências (`@e1`, `@e2`)
- **Suporte a Modo Duplo**:
  - **Modo Standalone**: Inicia um novo navegador Chromium
  - **Modo Extension**: Conecta ao navegador Chrome existente do usuário

**Cenários de Aplicação**: Operações de navegador que precisam ser executadas várias vezes (manter estado de login), automação de fluxos de trabalho complexos

### Siga-me: Escrever Script para Operações Após Login

**Cenário**: Você precisa automatizar uma série de operações após login, mantendo o estado da sessão.

#### Passo 1: Iniciar o servidor dev-browser

**macOS/Linux**:
```bash
cd skills/dev-browser && ./server.sh &
```

**Windows (PowerShell)**:
```powershell
cd skills/dev-browser
Start-Process -NoNewWindow -FilePath "node" -ArgumentList "server.js"
```

**Você deve ver**: O console exibe a mensagem `Ready`.

#### Passo 2: Escrever Script de Login

No OpenCode, digite:

```bash
cd skills/dev-browser && npx tsx <<'EOF'
import { connect, waitForPageLoad } from "@/client.js";

const client = await connect();
const page = await client.page("login", { viewport: { width: 1920, height: 1080 } });

await page.goto("https://example.com/login");
await waitForPageLoad(page);

console.log({
  title: await page.title(),
  url: page.url()
});

await client.disconnect();
EOF
```

**Você deve ver**: O navegador abre a página de login e exibe o título e URL da página.

#### Passo 3: Adicionar Operação de Preenchimento de Formulário

Modifique o script:

```bash
cd skills/dev-browser && npx tsx <<'EOF'
import { connect, waitForPageLoad } from "@/client.js";

const client = await connect();
const page = await client.page("login", { viewport: { width: 1920, height: 1080 } });

await page.goto("https://example.com/login");
await waitForPageLoad(page);

// Obter ARIA snapshot
const snapshot = await client.getAISnapshot("login");
console.log(snapshot);

// Selecionar e preencher formulário (de acordo com ref no snapshot)
await client.fill("input[name='username']", "user@example.com");
await client.fill("input[name='password']", "password123");
await client.click("button[type='submit']");

await waitForPageLoad(page);

console.log({
  title: await page.title(),
  url: page.url(),
  loggedIn: page.url().includes("/dashboard")
});

await client.disconnect();
EOF
```

**Você deve ver**:
- Saída do ARIA Snapshot (exibindo elementos da página e referências)
- Formulário preenchido automaticamente e enviado
- Página redirecionada para dashboard (verificando sucesso do login)

#### Passo 4: Reutilizar Estado de Login

Agora escreva o segundo script, operando páginas que precisam de login:

```bash
cd skills/dev-browser && npx tsx <<'EOF'
import { connect, waitForPageLoad } from "@/client.js";

const client = await connect();

// Reutilizar a página "login" criada anteriormente (sessão já salva)
const page = await client.page("login");

// Acessar diretamente página que precisa de login
await page.goto("https://example.com/settings");
await waitForPageLoad(page);

console.log({
  title: await page.title(),
  url: page.url()
});

await client.disconnect();
EOF
```

**Você deve ver**: A página pula diretamente para a página de configurações, sem precisar fazer login novamente (porque o estado da sessão foi salvo).

### Ponto de Verificação ✅

- [ ] Servidor dev-browser iniciado com sucesso e exibiu `Ready`
- [ ] ARIA Snapshot conseguiu descobrir corretamente elementos da página
- [ ] Estado da sessão após login pode ser reutilizado entre scripts
- [ ] Não é necessário fazer login novamente entre execuções de múltiplos scripts

::: tip Diferença entre playwright vs dev-browser

| Característica | playwright | dev-browser |
|----------------|------------|-------------|
| **Persistência de Sessão** | ❌ Nova sessão a cada vez | ✅ Salva entre scripts |
| **ARIA Snapshot** | ❌ Usa API do Playwright | ✅ Gera referências automaticamente |
| **Modo Extension** | ❌ Não suportado | ✅ Conecta ao navegador do usuário |
| **Cenário de Aplicação** | Operação única, teste | Múltiplas operações, fluxo complexo |
:::

---

## Melhores Práticas

### 1. Escolher o Skill Apropriado

Escolha o Skill de acordo com o tipo de tarefa:

| Tipo de Tarefa | Combinação Recomendada |
|----------------|------------------------|
| Commit Git rápido | `delegate_task(category='quick', load_skills=['git-master'])` |
| Design de interface UI | `delegate_task(category='visual-engineering', load_skills=['frontend-ui-ux'])` |
| Validação de navegador | `delegate_task(category='quick', load_skills=['playwright'])` |
| Fluxo de trabalho complexo de navegador | `delegate_task(category='quick', load_skills=['dev-browser'])` |

### 2. Combinar Múltiplos Skills

Você pode carregar múltiplos Skills simultaneamente:

```typescript
delegate_task(
  category="quick",
  load_skills=["git-master", "playwright"],
  prompt="Testar função de login, depois fazer commit do código"
)
```

### 3. Evitar Erros Comuns

::: warning Aviso

- ❌ **Errado**: Especificar manualmente a mensagem de commit ao usar `git-master`
  - ✅ **Certo**: Deixar o `git-master` detectar automaticamente e gerar mensagens de commit em conformidade com o estilo do projeto

- ❌ **Errado**: Ao usar `frontend-ui-ux`, pedir "só normal"
  - ✅ **Certo**: Deixar o agent exercer plenamente suas capacidades de designer, criar designs únicos

- ❌ **Errado**: Usar anotações de tipo TypeScript em scripts `dev-browser`
  - ✅ **Certo**: Usar JavaScript puro em `page.evaluate()` (o navegador não reconhece sintaxe TS)
:::

---

## Resumo da Lição

Esta lição apresentou 4 Skills incorporados:

| Skill | Valor Principal | Cenários Típicos |
|-------|-----------------|------------------|
| **playwright** | Automação completa de navegador | Testes de UI, screenshots, crawlers |
| **frontend-ui-ux** | Perspectiva de designer, prioridade estética | Design de componentes UI, embelezamento de interfaces |
| **git-master** | Operações Git automatizadas, commits atômicos | Commits de código, busca de histórico |
| **dev-browser** | Sessão persistente, fluxo de trabalho complexo | Múltiplas operações de navegador |

**Pontos Principais**:
1. **Skill = Conhecimento Profissional + Ferramentas**: Injetar melhores práticas específicas de domínio no agente
2. **Uso Combinado**: `delegate_task(category=..., load_skills=[...])` para correspondência precisa
3. **Otimização de Custos**: Tarefas simples usam category `quick`, evitando uso de modelos caros
4. **Aviso Anti-padrão**: Cada Skill tem orientação clara do que "não fazer"

---

## Próxima Lição

> Na próxima lição aprenderemos **[Lifecycle Hooks](../lifecycle-hooks/)**.
>
> Você aprenderá:
> - O papel e a ordem de execução dos 32 lifecycle hooks
> - Como automatizar injeção de contexto e recuperação de erros
> - Métodos de configuração de hooks comuns (todo-continuation-enforcer, keyword-detector, etc.)

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Data de atualização: 2026-01-26

| Funcionalidade | Caminho do Arquivo | Linha |
|----------------|-------------------|-------|
| Definição do Skill playwright | [`src/features/builtin-skills/skills.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/skills.ts) | 4-16 |
| Função createBuiltinSkills | [`src/features/builtin-skills/skills.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/skills.ts) | 1723-1729 |
| Definição do tipo BuiltinSkill | [`src/features/builtin-skills/types.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/types.ts) | 3-16 |
| Lógica de carregamento de Skills Incorporados | [`src/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/index.ts) | 51, 311-319 |
| Configuração do motor de navegador | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | - |

**Configurações Principais**:
- `browser_automation_engine.provider`: Motor de automação de navegador (padrão `playwright`, opcional `agent-browser`)
- `disabled_skills`: Lista de Skills desabilitados

**Funções Principais**:
- `createBuiltinSkills(options)`: Retorna o array de Skills correspondente com base na configuração do motor de navegador

</details>
