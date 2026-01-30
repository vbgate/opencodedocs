---
title: "CI/CD: Integração Não Interativa | OpenSkills"
sidebarTitle: "Automatize CI/CD com Um Comando"
subtitle: "CI/CD: Integração Não Interativa | OpenSkills"
description: "Aprenda a integração CI/CD do OpenSkills, domine a flag -y para instalação e sincronização não interativas. Inclui exemplos práticos de GitHub Actions e Docker para gerenciamento automatizado de habilidades."
tags:
  - "Avançado"
  - "CI/CD"
  - "Automação"
  - "Implantação"
prerequisite:
  - "../../start/first-skill/"
  - "../../start/sync-to-agents/"
  - "../../platforms/cli-commands/"
order: 6
---

# Integração CI/CD

## O Que Você Vai Aprender

- Entender por que ambientes CI/CD precisam do modo não interativo
- Dominar o uso da flag `--yes/-y` nos comandos `install` e `sync`
- Aprender a integrar o OpenSkills em plataformas CI como GitHub Actions e GitLab CI
- Entender o fluxo de instalação automatizada de habilidades em containers Docker
- Dominar estratégias de atualização e sincronização de habilidades em ambientes CI/CD
- Evitar falhas causadas por prompts interativos em processos CI/CD

::: info Pré-requisitos

Este tutorial assume que você já entendeu [Instalar Sua Primeira Habilidade](../../start/first-skill/) e [Sincronizar Habilidades para AGENTS.md](../../start/sync-to-agents/), bem como o básico de [Detalhes dos Comandos](../../platforms/cli-commands/).

:::

---

## Seu Desafio Atual

Você pode já estar usando o OpenSkills proficientemente em seu ambiente local, mas encontrou problemas em ambientes CI/CD:

- **Prompts interativos causam falhas**: A interface de seleção aparece no fluxo CI, impedindo a continuação da execução
- **Necessidade de instalação de habilidades durante implantação automatizada**: Cada compilação precisa reinstalar habilidades, mas não pode confirmar automaticamente
- **Configurações de múltiplos ambientes não sincronizadas**: As configurações de habilidades em ambiente de desenvolvimento, teste e produção são inconsistentes
- **Geração do AGENTS.md não automatizada**: Após cada implantação, é necessário executar manualmente o comando sync
- **Habilidades ausentes na construção da imagem Docker**: As habilidades precisam ser instaladas manualmente após o container iniciar

Na verdade, o OpenSkills oferece a flag `--yes/-y`, especificamente para ambientes não interativos, permitindo que você automatize todas as operações em processos CI/CD.

---

## Quando Usar Esta Abordagem

**Cenários de uso para integração CI/CD**:

| Cenário | Requer modo não interativo? | Exemplo |
|--- | --- | ---|
| **GitHub Actions** | ✅ Sim | Instalar habilidades automaticamente em cada PR ou push |
| **GitLab CI** | ✅ Sim | Sincronizar automaticamente o AGENTS.md em merge requests |
| **Construção Docker** | ✅ Sim | Instalar habilidades automaticamente no container durante a construção da imagem |
| **Pipelines Jenkins** | ✅ Sim | Atualizar habilidades automaticamente durante integração contínua |
| **Scripts de inicialização do ambiente de desenvolvimento** | ✅ Sim | Configurar o ambiente com um clique após novos membros puxarem o código |
| **Implantação em produção** | ✅ Sim | Sincronizar automaticamente as habilidades mais recentes durante a implantação |

::: tip Prática Recomendada

- **Use o modo interativo para desenvolvimento local**: Durante operações manuais, você pode selecionar cuidadosamente as habilidades a serem instaladas
- **Use o modo não interativo para CI/CD**: Em processos automatizados, você deve usar a flag `-y` para pular todos os prompts
- **Estratégia de diferenciação de ambientes**: Use fontes de habilidades diferentes para diferentes ambientes (como repositórios privados)

:::

---

## Ideia Central: Modo Não Interativo

Os comandos `install` e `sync` do OpenSkills suportam a flag `--yes/-y`, usada para pular todos os prompts interativos:

**Comportamento não interativo do comando install** (código-fonte `install.ts:424-427`):

```typescript
// Seleção interativa (a menos que a flag -y seja usada ou seja uma única habilidade)
let skillsToInstall = skillInfos;

if (!options.yes && skillInfos.length > 1) {
  // Entrar no fluxo de seleção interativo
  // ...
}
```

**Características do modo não interativo**:

1. **Pula a seleção de habilidades**: Instala todas as habilidades encontradas
2. **Sobrescreve automaticamente**: Quando encontra uma habilidade já existente, sobrescreve diretamente (exibe `Overwriting: <skill-name>`)
3. **Pula confirmação de conflito**: Não pergunta se deve sobrescrever, executa diretamente
4. **Compatível com ambientes headless**: Funciona normalmente em ambientes CI sem TTY

**Comportamento da função warnIfConflict** (código-fonte `install.ts:524-527`):

```typescript
if (skipPrompt) {
  // Sobrescrever automaticamente no modo não interativo
  console.log(chalk.dim(`Overwriting: ${skillName}`));
  return true;
}
```

::: important Conceito Importante

**Modo não interativo**: Use a flag `--yes/-y` para pular todos os prompts interativos, permitindo que comandos sejam executados automaticamente em CI/CD, scripts e ambientes sem TTY, sem depender de entrada do usuário.

:::

---

## Siga os Passos

### Passo 1: Experimente a Instalação Não Interativa

**Por que**
Primeiro experimente o comportamento do modo não interativo localmente para entender a diferença em relação ao modo interativo.

Abra o terminal e execute:

```bash
# Instalação não interativa (instala todas as habilidades encontradas)
npx openskills install anthropics/skills --yes

# Ou use a forma abreviada
npx openskills install anthropics/skills -y
```

**Você deve ver**:

```
Cloning into '/tmp/openskills-temp-...'...
...
Found 3 skill(s)

Overwriting: codebase-reviewer
Overwriting: file-writer
Overwriting: git-helper

✅ Installed 3 skill(s)

Next: Run 'openskills sync' to generate AGENTS.md
```

**Explicação**:
- Após usar a flag `-y`, a interface de seleção de habilidades foi pulada
- Todas as habilidades encontradas foram instaladas automaticamente
- Se a habilidade já existia, exibe `Overwriting: <skill-name>` e sobrescreve diretamente
- Nenhuma caixa de diálogo de confirmação aparece

---

### Passo 2: Compare Interativo vs Não Interativo

**Por que**
Ao comparar, você entenderá mais claramente as diferenças entre os dois modos e seus cenários de uso.

Execute os seguintes comandos para comparar os dois modos:

```bash
# Limpar habilidades existentes (para testes)
rm -rf .claude/skills

# Instalação interativa (mostrará a interface de seleção)
echo "=== Instalação Interativa ==="
npx openskills install anthropics/skills

# Limpar habilidades existentes
rm -rf .claude/skills

# Instalação não interativa (instala automaticamente todas as habilidades)
echo "=== Instalação Não Interativa ==="
npx openskills install anthropics/skills -y
```

**Você deve ver**:

**Modo interativo**:
- Exibe a lista de habilidades, permitindo que você marque com espaço
- Precisa pressionar Enter para confirmar
- Pode instalar seletivamente algumas habilidades

**Modo não interativo**:
- Exibe diretamente o processo de instalação
- Instala automaticamente todas as habilidades
- Não requer nenhuma entrada do usuário

**Tabela comparativa**:

| Característica | Modo Interativo (padrão) | Modo Não Interativo (-y) |
|--- | --- | ---|
| **Seleção de habilidades** | Mostra interface de seleção, marcação manual | Instala automaticamente todas as habilidades encontradas |
| **Confirmação de sobrescrita** | Pergunta se deve sobrescrever habilidades existentes | Sobrescreve automaticamente, exibe informações de aviso |
| **Requisito TTY** | Precisa de terminal interativo | Não precisa, pode rodar em ambiente CI |
| **Cenários de uso** | Desenvolvimento local, operações manuais | CI/CD, scripts, processos automatizados |
| **Requisito de entrada** | Requer entrada do usuário | Zero entrada, execução automática |

---

### Passo 3: Sincronização Não Interativa do AGENTS.md

**Por que**
Aprenda a gerar o AGENTS.md em processos automatizados, garantindo que o agente de IA sempre use a lista mais recente de habilidades.

Execute:

```bash
# Sincronização não interativa (sincroniza todas as habilidades para o AGENTS.md)
npx openskills sync -y

# Visualizar o AGENTS.md gerado
cat AGENTS.md | head -20
```

**Você deve ver**:

```
✅ Synced 3 skill(s) to AGENTS.md
```

Conteúdo do AGENTS.md:

```xml
<skills_system>
This project uses the OpenSkills system for AI agent extensibility.

Usage:
- Ask the AI agent to load specific skills using: "Use the <skill-name> skill"
- The agent will read the skill definition from .claude/skills/<skill-name>/SKILL.md
- Skills provide specialized capabilities like code review, file writing, etc.
</skills_system>

<available_skills>
  <skill name="codebase-reviewer">
    <description>Review code changes for issues...</description>
  </skill>
  <skill name="file-writer">
    <description>Write files with format...</description>
  </skill>
  <skill name="git-helper">
    <description>Git operations and utilities...</description>
  </skill>
</available_skills>
```

**Explicação**:
- A flag `-y` pula a interface de seleção de habilidades
- Todas as habilidades instaladas são sincronizadas para o AGENTS.md
- Nenhuma caixa de diálogo de confirmação aparece

---

### Passo 4: Integração com GitHub Actions

**Por que**
Integre o OpenSkills em processos CI/CD reais para implementar gerenciamento automatizado de habilidades.

No projeto, crie o arquivo `.github/workflows/setup-skills.yml`:

```yaml
name: Setup Skills

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  setup-skills:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install OpenSkills
        run: npm install -g openskills

      - name: Install skills (non-interactive)
        run: openskills install anthropics/skills -y

      - name: Sync to AGENTS.md
        run: openskills sync -y

      - name: Verify AGENTS.md
        run: |
          echo "=== AGENTS.md generated ==="
          cat AGENTS.md

      - name: Upload AGENTS.md as artifact
        uses: actions/upload-artifact@v4
        with:
          name: agents-md
          path: AGENTS.md
```

Faça commit e envie para o GitHub:

```bash
git add .github/workflows/setup-skills.yml
git commit -m "Add GitHub Actions workflow for OpenSkills"
git push
```

**Você deve ver**: O GitHub Actions executa automaticamente, instala habilidades com sucesso e gera o AGENTS.md.

**Explicação**:
- Acionado automaticamente em cada push ou PR
- Usa `openskills install anthropics/skills -y` para instalação não interativa de habilidades
- Usa `openskills sync -y` para sincronização não interativa do AGENTS.md
- Salva o AGENTS.md como artifact para facilitar a depuração

---

### Passo 5: Usar Repositórios Privados

**Por que**
Em ambientes empresariais, as habilidades geralmente são hospedadas em repositórios privados e precisam ser acessadas via SSH em CI/CD.

Configure o SSH no GitHub Actions:

```yaml
name: Setup Skills from Private Repo

on:
  push:
    branches: [main]

jobs:
  setup-skills:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup SSH key
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
        run: |
          mkdir -p ~/.ssh
          echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan github.com >> ~/.ssh/known_hosts

      - name: Install OpenSkills
        run: npm install -g openskills

      - name: Install skills from private repo
        run: openskills install git@github.com:your-org/private-skills.git -y

      - name: Sync to AGENTS.md
        run: openskills sync -y
```

No repositório do GitHub, adicione `SSH_PRIVATE_KEY` em **Settings → Secrets and variables → Actions**.

**Você deve ver**: O GitHub Actions instala habilidades com sucesso do repositório privado.

**Explicação**:
- Use Secrets para armazenar a chave privada, evitando vazamentos
- Configure o acesso SSH ao repositório privado
- `openskills install git@github.com:your-org/private-skills.git -y` suporta instalação de repositórios privados

---

### Passo 6: Integração em Cenários Docker

**Por que**
Instale habilidades automaticamente durante a construção da imagem Docker, garantindo que elas estejam imediatamente disponíveis após o container iniciar.

Crie um `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Instalar OpenSkills
RUN npm install -g openskills

# Instalar habilidades (não interativo)
RUN openskills install anthropics/skills -y

# Sincronizar AGENTS.md
RUN openskills sync -y

# Copiar código da aplicação
COPY . .

# Outras etapas de construção...
RUN npm install
RUN npm run build

# Comando de inicialização
CMD ["node", "dist/index.js"]
```

Construa e execute:

```bash
# Construir imagem Docker
docker build -t myapp:latest .

# Executar container
docker run -it --rm myapp:latest sh

# Verificar habilidades instaladas no container
ls -la .claude/skills/
cat AGENTS.md
```

**Você deve ver**: As habilidades já estão instaladas no container e o AGENTS.md foi gerado.

**Explicação**:
- Instala habilidades durante a fase de construção da imagem Docker
- Usa `RUN openskills install ... -y` para instalação não interativa
- Não é necessário instalar habilidades manualmente após o container iniciar
- Adequado para cenários de microsserviços, serverless, etc.

---

### Passo 7: Configuração de Variáveis de Ambiente

**Por que**
Configure fontes de habilidades flexivelmente através de variáveis de ambiente, usando diferentes repositórios de habilidades para diferentes ambientes.

Crie um arquivo `.env.ci`:

```bash
# Configuração do ambiente CI/CD
SKILLS_SOURCE=anthropics/skills
SKILLS_INSTALL_FLAGS=-y
SYNC_FLAGS=-y
```

Use em scripts CI/CD:

```bash
#!/bin/bash
# .github/scripts/setup-skills.sh

set -e

# Carregar variáveis de ambiente
if [ -f .env.ci ]; then
  export $(cat .env.ci | grep -v '^#' | xargs)
fi

echo "Installing skills from: $SKILLS_SOURCE"
npx openskills install $SKILLS_SOURCE $SKILLS_INSTALL_FLAGS

echo "Syncing to AGENTS.md"
npx openskills sync $SYNC_FLAGS

echo "✅ Skills setup completed"
```

Chame no GitHub Actions:

```yaml
- name: Setup skills
  run: .github/scripts/setup-skills.sh
```

**Você deve ver**: O script configura automaticamente a fonte de habilidades e flags com base nas variáveis de ambiente.

**Explicação**:
- Configure fontes de habilidades flexivelmente através de variáveis de ambiente
- Diferentes ambientes (desenvolvimento, teste, produção) podem usar diferentes arquivos `.env`
- Mantenha a capacidade de manutenção da configuração CI/CD

---

## Ponto de Verificação ✅

Complete as seguintes verificações para confirmar que você dominou o conteúdo desta aula:

- [ ] Entende o propósito e características do modo não interativo
- [ ] É capaz de usar a flag `-y` para instalação não interativa
- [ ] É capaz de usar a flag `-y` para sincronização não interativa
- [ ] Entende as diferenças entre interativo e não interativo
- [ ] É capaz de integrar o OpenSkills no GitHub Actions
- [ ] É capaz de instalar habilidades durante a construção da imagem Docker
- [ ] Sabe como lidar com repositórios privados em CI/CD
- [ ] Entende as práticas recomendadas de configuração de variáveis de ambiente

---

## Cuidados com Armadilhas

### Erro Comum 1: Esquecer de adicionar a flag -y

**Cenário de erro**: Esquecer de usar a flag `-y` no GitHub Actions

```yaml
# ❌ Errado: esquecer a flag -y
- name: Install skills
  run: openskills install anthropics/skills
```

**Problema**:
- O ambiente CI não tem terminal interativo (TTY)
- O comando aguardará entrada do usuário, causando falha por timeout do workflow
- A mensagem de erro pode não ser clara

**Abordagem correta**:

```yaml
# ✅ Correto: usar a flag -y
- name: Install skills
  run: openskills install anthropics/skills -y
```

---

### Erro Comum 2: Sobrescrita de habilidades causa perda de configuração

**Cenário de erro**: CI/CD sempre sobrescreve habilidades, causando perda de configurações locais

```bash
# CI/CD instala habilidades no diretório global
openskills install anthropics/skills --global -y

# Usuário local instala no diretório do projeto, é sobrescrito pelo global
```

**Problema**:
- Habilidades instaladas globalmente têm prioridade menor que as locais do projeto
- Locais de instalação inconsistentes entre CI/CD e local causam confusão
- Pode sobrescrever habilidades cuidadosamente configuradas pelo usuário local

**Abordagem correta**:

```bash
# Solução 1: CI/CD e local usam instalação no projeto
openskills install anthropics/skills -y

# Solução 2: Usar o modo Universal para evitar conflitos
openskills install anthropics/skills --universal -y

# Solução 3: CI/CD usa diretório dedicado (através de caminho de saída personalizado)
openskills install anthropics/skills -y
openskills sync -o .agents-md/AGENTS.md -y
```

---

### Erro Comum 3: Permissões de acesso Git insuficientes

**Cenário de erro**: Instalar habilidades de um repositório privado sem configurar a chave SSH

```yaml
# ❌ Errado: não configurar chave SSH
- name: Install from private repo
  run: openskills install git@github.com:your-org/private-skills.git -y
```

**Problema**:
- O ambiente CI não pode acessar o repositório privado
- Mensagem de erro: `Permission denied (publickey)`
- Falha no clone, falha no workflow

**Abordagem correta**:

```yaml
# ✅ Correto: configurar chave SSH
- name: Setup SSH key
  env:
    SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
  run: |
    mkdir -p ~/.ssh
    echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
    chmod 600 ~/.ssh/id_rsa
    ssh-keyscan github.com >> ~/.ssh/known_hosts

- name: Install from private repo
  run: openskills install git@github.com:your-org/private-skills.git -y
```

---

### Erro Comum 4: Imagem Docker muito grande

**Cenário de erro**: Instalar habilidades no Dockerfile causa tamanho excessivo da imagem

```dockerfile
# ❌ Errado: clona e reinstala toda vez
RUN openskills install anthropics/skills -y
```

**Problema**:
- Clona o repositório do GitHub em cada construção
- Aumenta o tempo de construção e o tamanho da imagem
- Problemas de rede podem causar falhas

**Abordagem correta**:

```dockerfile
# ✅ Correto: usar construção em múltiplos estágios e cache
FROM node:20-alpine AS skills-builder

RUN npm install -g openskills
RUN openskills install anthropics/skills -y
RUN openskills sync -y

# Imagem principal
FROM node:20-alpine

WORKDIR /app

# Copiar habilidades já instaladas
COPY --from=skills-builder ~/.claude /root/.claude
COPY --from=skills-builder /app/AGENTS.md /app/

# Copiar código da aplicação
COPY . .

# Outras etapas de construção...
```

---

### Erro Comum 5: Esquecer de atualizar habilidades

**Cenário de erro**: CI/CD sempre instala a versão antiga das habilidades

```yaml
# ❌ Errado: apenas instalar, não atualizar
- name: Install skills
  run: openskills install anthropics/skills -y
```

**Problema**:
- O repositório de habilidades pode ter sido atualizado
- A versão das habilidades instaladas pelo CI/CD não é a mais recente
- Pode causar recursos ausentes ou bugs

**Abordagem correta**:

```yaml
# ✅ Correto: atualizar antes de sincronizar
- name: Update skills
  run: openskills update -y

- name: Sync to AGENTS.md
  run: openskills sync -y

# Ou usar estratégia de atualização ao instalar
- name: Install or update skills
  run: |
    openskills install anthropics/skills -y || openskills update -y
```

---

## Resumo da Aula

**Pontos principais**:

1. **Modo não interativo para CI/CD**: Use a flag `-y` para pular todos os prompts interativos
2. **Flag -y do comando install**: Instala automaticamente todas as habilidades encontradas, sobrescreve habilidades existentes
3. **Flag -y do comando sync**: Sincroniza automaticamente todas as habilidades para o AGENTS.md
4. **Integração com GitHub Actions**: Use comandos não interativos no workflow para gerenciamento automatizado de habilidades
5. **Cenários Docker**: Instale habilidades durante a fase de construção da imagem, garantindo disponibilidade imediata após o container iniciar
6. **Acesso a repositórios privados**: Configure o acesso a repositórios privados de habilidades através de chaves SSH
7. **Configuração de variáveis de ambiente**: Configure fontes de habilidades e parâmetros de instalação flexivelmente através de variáveis de ambiente

**Fluxo de decisão**:

```
[Precisa usar o OpenSkills em CI/CD] → [Instalar habilidades]
                                     ↓
                             [Usar flag -y para pular interação]
                                     ↓
                             [Gerar AGENTS.md]
                                     ↓
                             [Usar flag -y para pular interação]
                                     ↓
                             [Verificar habilidades instaladas corretamente]
```

**Fórmulas mnemônicas**:

- **CI/CD lembre-se de adicionar -y**: O modo não interativo é a chave
- **GitHub Actions usa SSH**: Repositórios privados precisam de chaves configuradas
- **Docker construa e instale cedo**: Preste atenção ao tamanho da imagem
- **Configure variáveis de ambiente**: Diferentes ambientes precisam ser diferenciados

---

## Próxima Aula

> Na próxima aula, vamos aprender **[Notas de Segurança](../security/)**.
>
> Você vai aprender:
> - Recursos de segurança do OpenSkills e mecanismos de proteção
> - Como funciona a proteção contra traversal de caminho
> - Maneiras seguras de lidar com links simbólicos
> - Medidas de segurança de análise YAML
> - Práticas recomendadas de gerenciamento de permissões

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver localizações do código fonte</strong></summary>

> Última atualização: 2026-01-24

| Funcionalidade              | Caminho do arquivo                                                                                                    | Linhas    |
|--- | --- | ---|
| Instalação não interativa      | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L424-L455) | 424-455 |
| Detecção de conflito e sobrescrita    | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L521-L550) | 521-550 |
| Sincronização não interativa      | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L46-L93)   | 46-93   |
| Definição de argumentos CLI    | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L49)                          | 49      |
| Definição de argumentos CLI    | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L65)                          | 65      |

**Constantes principais**:
- `-y, --yes`: Flag de linha de comando para pular seleção interativa

**Funções principais**:
- `warnIfConflict(skillName, targetPath, isProject, skipPrompt)`: Detecta conflitos de habilidades e decide se deve sobrescrever
- `installFromRepo()`: Instala habilidades de um repositório (suporta modo não interativo)
- `syncAgentsMd()`: Sincroniza habilidades para o AGENTS.md (suporta modo não interativo)

**Regras de negócio**:
- Ao usar a flag `-y`, todos os prompts interativos são pulados
- Quando a habilidade já existe, o modo não interativo sobrescreve automaticamente (exibe `Overwriting: <skill-name>`)
- O modo não interativo funciona normalmente em ambientes headless (sem TTY)
- Os comandos `install` e `sync` suportam a flag `-y`

</details>
