---
title: "Instalação: Implantação Rápida | OpenSkills"
sidebarTitle: "Execute em 5 Minutos"
subtitle: "Instalação: Implantação Rápida | OpenSkills"
description: "Aprenda como instalar o OpenSkills. Configure o ambiente em 5 minutos, suportando npx e instalação global, incluindo verificação de ambiente e solução de problemas."
tags:
  - "Instalação"
  - "Configuração de Ambiente"
  - "Node.js"
  - "Git"
prerequisite:
  - "Operações Básicas de Terminal"
duration: 3
order: 3
---

# Instalação do OpenSkills

## O Que Você Vai Aprender

Após concluir esta lição, você será capaz de:

- Verificar e configurar os ambientes Node.js e Git
- Usar o OpenSkills via `npx` ou instalação global
- Verificar se o OpenSkills está instalado e disponível corretamente
- Resolver problemas comuns de instalação (incompatibilidade de versão, problemas de rede, etc.)

## Seus Desafios Atuais

Você pode estar enfrentando estes problemas:

- **Requisitos de ambiente incertos**: Não sabe quais versões de Node.js e Git são necessárias
- **Não sabe como instalar**: O OpenSkills é um pacote npm, mas não sabe se deve usar npx ou instalação global
- **Falha na instalação**: Encontrou incompatibilidade de versão ou problemas de rede
- **Problemas de permissão**: Encontrou erro EACCES ao instalar globalmente

Esta lição ajudará você a resolver esses problemas passo a passo.

## Quando Usar Este Método

Quando você precisa:

- Usar o OpenSkills pela primeira vez
- Atualizar para uma nova versão
- Configurar o ambiente de desenvolvimento em uma nova máquina
- Solucionar problemas relacionados à instalação

## 🎒 Preparação Antes de Começar

::: tip Requisitos do Sistema

O OpenSkills tem requisitos mínimos de sistema. Não atender a esses requisitos causará falha na instalação ou execução anormal.

:::

::: warning Verificação Prévia

Antes de começar, certifique-se de que você tem o seguinte software instalado:

1. **Node.js 20.6 ou superior**
2. **Git** (para clonar skills do repositório)

:::

## Conceito Principal

O OpenSkills é uma ferramenta CLI do Node.js com duas formas de uso:

| Método | Comando | Vantagens | Desvantagens | Cenário de Uso |
|--- | --- | --- | --- | ---|
| **npx** | `npx openskills` | Não precisa de instalação, usa automaticamente a versão mais recente | Baixa a cada execução (com cache) | Uso ocasional, testar nova versão |
| **Instalação global** | `openskills` | Comando mais curto, resposta mais rápida | Precisa atualizar manualmente | Uso frequente, versão fixa |

**Recomenda-se usar npx**, a menos que você use o OpenSkills com muita frequência.

---

## Siga os Passos

### Passo 1: Verificar a Versão do Node.js

Primeiro, verifique se o Node.js está instalado no sistema e se a versão atende aos requisitos:

```bash
node --version
```

**Por quê**

O OpenSkills requer Node.js 20.6 ou superior. Versões abaixo causarão erros de execução.

**Você deve ver**:

```bash
v20.6.0
```

Ou versão superior (como `v22.0.0`).

::: danger Versão Muito Baixa

Se você vê `v18.x.x` ou versão inferior (como `v16.x.x`), você precisa atualizar o Node.js.

:::

**Se a versão for muito baixa**:

Recomenda-se usar [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) para instalar e gerenciar o Node.js:

::: code-group

```bash [macOS/Linux]
# Instalar o nvm (se ainda não estiver instalado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Recarregar a configuração do terminal
source ~/.bashrc  # ou source ~/.zshrc

# Instalar o Node.js 20 LTS
nvm install 20
nvm use 20

# Verificar a versão
node --version
```

```powershell [Windows]
# Baixar e instalar o nvm-windows
# Visite: https://github.com/coreybutler/nvm-windows/releases

# Após a instalação, execute no PowerShell:
nvm install 20
nvm use 20

# Verificar a versão
node --version
```

:::

**Você deve ver** (após atualização):

```bash
v20.6.0
```

---

### Passo 2: Verificar a Instalação do Git

O OpenSkills precisa usar o Git para clonar repositórios de skills:

```bash
git --version
```

**Por quê**

Ao instalar skills do GitHub, o OpenSkills usará o comando `git clone` para baixar o repositório.

**Você deve ver**:

```bash
git version 2.40.0
```

(O número da versão pode ser diferente, qualquer saída é suficiente)

::: danger Git Não Instalado

Se você vê `command not found: git` ou erro semelhante, você precisa instalar o Git.

:::

**Se o Git não estiver instalado**:

::: code-group

```bash [macOS]
# O macOS geralmente já vem com o Git pré-instalado. Se não, use o Homebrew:
brew install git
```

```powershell [Windows]
# Baixar e instalar o Git for Windows
# Visite: https://git-scm.com/download/win
```

```bash [Linux (Ubuntu/Debian)]
sudo apt update
sudo apt install git
```

```bash [Linux (CentOS/RHEL)]
sudo yum install git
```

:::

Após a instalação, execute `git --version` novamente para verificar.

---

### Passo 3: Verificar o Ambiente

Agora verifique se o Node.js e o Git estão disponíveis:

```bash
node --version && git --version
```

**Você deve ver**:

```bash
v20.6.0
git version 2.40.0
```

Se ambos os comandos tiverem saída com sucesso, o ambiente está configurado corretamente.

---

### Passo 4: Usar o Método npx (Recomendado)

O OpenSkills recomenda usar `npx` para executar diretamente, sem necessidade de instalação adicional:

```bash
npx openskills --version
```

**Por quê**

O `npx` baixa automaticamente e executa a versão mais recente do OpenSkills, sem necessidade de instalação ou atualização manual. Na primeira execução, ele baixa o pacote para o cache local, execuções subsequentes usarão o cache, tornando-o muito rápido.

**Você deve ver**:

```bash
1.5.0
```

(O número da versão pode ser diferente)

::: tip Como o npx Funciona

O `npx` (Node Package eXecute) é uma ferramenta incluída no npm 5.2.0+:
- Primeira execução: baixa o pacote do npm para um diretório temporário
- Execuções subsequentes: usa o cache (expira após 24 horas por padrão)
- Atualização: baixa automaticamente a versão mais recente quando o cache expira

:::

**Testar o comando de instalação**:

```bash
npx openskills list
```

**Você deve ver**:

```bash
Installed Skills:

No skills installed. Run: npx openskills install <source>
```

Ou uma lista de skills já instalados.

---

### Passo 5: (Opcional) Instalação Global

Se você usa o OpenSkills com frequência, pode optar por instalação global:

```bash
npm install -g openskills
```

**Por quê**

Após a instalação global, você pode usar o comando `openskills` diretamente, sem precisar digitar `npx` toda vez, com resposta mais rápida.

**Você deve ver**:

```bash
added 4 packages in 3s
```

(A saída pode ser diferente)

::: warning Problemas de Permissão

Se você encontrar um erro `EACCES` ao instalar globalmente, significa que você não tem permissão para escrever no diretório global.

**Solução**:

```bash
# Método 1: usar sudo (macOS/Linux)
sudo npm install -g openskills

# Método 2: corrigir permissões do npm (recomendado)
# Ver o diretório de instalação global
npm config get prefix

# Definir as permissões corretas (substitua /usr/local pelo caminho real)
sudo chown -R $(whoami) /usr/local/lib/node_modules
sudo chown -R $(whoami) /usr/local/bin
```

:::

**Verificar a instalação global**:

```bash
openskills --version
```

**Você deve ver**:

```bash
1.5.0
```

::: tip Atualizar Instalação Global

Para atualizar o OpenSkills instalado globalmente:

```bash
npm update -g openskills
```

:::

---

## Ponto de Verificação ✅

Após concluir as etapas acima, você deve confirmar:

- [ ] Versão do Node.js é 20.6 ou superior (`node --version`)
- [ ] Git está instalado (`git --version`)
- [ ] `npx openskills --version` ou `openskills --version` exibe o número da versão corretamente
- [ ] `npx openskills list` ou `openskills list` executa normalmente

Se todas as verificações passarem, parabéns! O OpenSkills foi instalado com sucesso.

---

## Avisos sobre Problemas Comuns

### Problema 1: Versão do Node.js Muito Baixa

**Mensagem de erro**:

```bash
Error: The module was compiled against a different Node.js version
```

**Causa**: Versão do Node.js abaixo de 20.6

**Solução**:

Use o nvm para instalar o Node.js 20 ou superior:

```bash
nvm install 20
nvm use 20
```

---

### Problema 2: Comando npx Não Encontrado

**Mensagem de erro**:

```bash
command not found: npx
```

**Causa**: Versão do npm muito baixa (npx requer npm 5.2.0+)

**Solução**:

```bash
# Atualizar o npm
npm install -g npm@latest

# Verificar a versão
npx --version
```

---

### Problema 3: Timeout de Rede ou Falha no Download

**Mensagem de erro**:

```bash
Error: network timeout
```

**Causa**: Acesso limitado ao repositório npm

**Solução**:

```bash
# Usar um espelho npm (como o espelho Taobao)
npm config set registry https://registry.npmmirror.com

# Tentar novamente
npx openskills --version
```

Restaurar para a fonte padrão:

```bash
npm config set registry https://registry.npmjs.org
```

---

### Problema 4: Erro de Permissão na Instalação Global

**Mensagem de erro**:

```bash
Error: EACCES: permission denied
```

**Causa**: Sem permissão para escrever no diretório de instalação global

**Solução**:

Consulte o método de correção de permissões no "Passo 5", ou use `sudo` (não recomendado).

---

### Problema 5: Falha no Clone do Git

**Mensagem de erro**:

```bash
Error: git clone failed
```

**Causa**: Chave SSH não configurada ou problema de rede

**Solução**:

```bash
# Testar conexão Git
git ls-remote https://github.com/numman-ali/openskills.git

# Se falhar, verifique a rede ou configure um proxy
git config --global http.proxy http://proxy.example.com:8080
```

---

## Resumo da Lição

Nesta lição aprendemos:

1. **Requisitos de ambiente**: Node.js 20.6+ e Git
2. **Método de uso recomendado**: `npx openskills` (sem instalação)
3. **Instalação global opcional**: `npm install -g openskills` (para uso frequente)
4. **Verificação de ambiente**: verificar números de versão e disponibilidade de comandos
5. **Problemas comuns**: incompatibilidade de versão, problemas de permissão, problemas de rede

Agora você completou a instalação do OpenSkills. Na próxima lição, aprenderemos como instalar o primeiro skill.

---

## Próxima Lição

> Na próxima lição aprenderemos **[Instalar o Primeiro Skill](../first-skill/)**
>
> Você aprenderá:
> - Como instalar skills do repositório oficial da Anthropic
> - Técnicas de seleção interativa de skills
> - Estrutura de diretórios de skills
> - Verificar se o skill foi instalado corretamente

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-24

### Configuração Principal

| Item de Configuração | Caminho do Arquivo                                                                                       | Número da Linha      |
|--- | --- | ---|
| Requisito de versão do Node.js | [`package.json`](https://github.com/numman-ali/openskills/blob/main/package.json) | 45-47     |
| Informações do pacote         | [`package.json`](https://github.com/numman-ali/openskills/blob/main/package.json) | 1-9       |
| Entrada CLI       | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts)             | 39-80     |

### Constantes Chave

- **Requisito do Node.js**: `>=20.6.0` (package.json:46)
- **Nome do pacote**: `openskills` (package.json:2)
- **Versão**: `1.5.0` (package.json:3)
- **Comando CLI**: `openskills` (package.json:8)

### Explicação das Dependências

**Dependências de runtime** (package.json:48-53):
- `@inquirer/prompts`: seleção interativa
- `chalk`: saída colorida no terminal
- `commander`: análise de parâmetros CLI
- `ora`: animação de carregamento

**Dependências de desenvolvimento** (package.json:54-59):
- `typescript`: compilação TypeScript
- `vitest`: testes de unidade
- `tsup`: ferramenta de empacotamento

</details>
