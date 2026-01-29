---
title: "Instalação: Configuração Rápida do Claude | Agent Skills"
sidebarTitle: "Instalação"
subtitle: "Instalando o Agent Skills"
description: "Aprenda a instalar o Agent Skills no Claude Code e claude.ai. Domine instalação rápida via npx, cópia manual de habilidades e configuração de permissões de rede."
tags:
  - "Instalação"
  - "Claude Code"
  - "claude.ai"
  - "Permissões de Rede"
prerequisite:
  - "start-getting-started"
---

# Instalando o Agent Skills

## O Que Você Poderá Fazer Após Este Curso

- Instalar rapidamente o Agent Skills com um comando (recomendado)
- Copiar manualmente habilidades para o diretório local do Claude Code
- Habilitar habilidades no claude.ai e configurar permissões de rede
- Diagnosticar erros comuns durante a instalação

## Seu Desafio Atual

Você quer usar o Agent Skills para deixar o Claude ajudá-lo a implantar projetos, auditar código, mas não sabe como instalar no Claude Code ou no claude.ai. Ou você tentou a instalação, mas as habilidades não ativaram, e ao tentar deploy você recebe o erro "Network Egress Error".

## Quando Usar Esta Abordagem

- ✓ Primeiro uso do Agent Skills
- ✓ Você usa Claude Code (ferramenta de linha de comando)
- ✓ Você usa claude.ai (versão web do Claude)
- ✓ Você precisa permitir que habilidades acessem a rede (funcionalidade de deploy)

## 🎒 Preparação Antes de Começar

Antes de começar, confirme se você já:
- [ ] Instalou Node.js versão 20+
- [ ] Possui uma conta ativa do Claude Code ou claude.ai

::: tip Dica
Se você ainda não sabe o que é o Agent Skills, recomendamos ler primeiro [Introdução ao Agent Skills](../getting-started/).
:::

## Ideia Central

Existem duas formas de instalar o Agent Skills:

1. **Instalação via npx (recomendada)**: Instalação com um clique no Claude Code, completa automaticamente todas as etapas
2. **Instalação Manual**: Copia arquivos para um diretório especificado, aplicável ao claude.ai ou quando você precisa controlar a localização da instalação

Após a instalação, as habilidades serão ativadas automaticamente no Claude — você só precisa acionar palavras-chave (como "Deploy my app"), e o Claude invocará automaticamente a habilidade correspondente.

## Método 1: Instalação Rápida com npx (Recomendado)

Este é o método mais simples, ideal para usuários do Claude Code.

### Passo 1: Execute o Comando de Instalação

No terminal, execute:

```bash
npx add-skill vercel-labs/agent-skills
```

**Por Quê**
`add-skill` é um pacote npm que automaticamente baixa o Agent Skills e instala no diretório correto.

**Você Deve Ver**:
```
Skills successfully installed.
```

### Passo 2: Verifique a Instalação

No Claude Code, digite:

```
List available skills
```

**Você Deve Ver**:
Na lista de habilidades retornada pelo Claude, inclui:
- `react-best-practices`
- `web-design-guidelines`
- `vercel-deploy`

**Ponto de Verificação ✅**: Se você ver essas 3 habilidades, a instalação foi bem-sucedida.

## Método 2: Instalação Manual no Claude Code

Se você não quiser usar npx, ou precisa controlar a localização da instalação, use a instalação manual.

### Passo 1: Clone ou Baixe o Projeto

```bash
git clone https://github.com/vercel-labs/agent-skills.git
cd agent-skills
```

**Por Quê**
Instalação manual requer primeiro obter o código-fonte do projeto.

### Passo 2: Copie as Habilidades para o Diretório do Claude Code

```bash
cp -r skills/react-best-practices ~/.claude/skills/
cp -r skills/web-design-guidelines ~/.claude/skills/
cp -r skills/claude.ai/vercel-deploy-claimable ~/.claude/skills/vercel-deploy
```

**Por Quê**
As habilidades do Claude Code são armazenadas no diretório `~/.claude/skills/`. Após a cópia, o Claude poderá reconhecer essas habilidades.

**Você Deve Ver**:
Após a execução do comando, sem saída de erros.

**Ponto de Verificação ✅**:
Use `ls ~/.claude/skills/` para verificar, você deverá ver 3 diretórios de habilidades: `react-best-practices`, `web-design-guidelines`, `vercel-deploy`.

### Passo 3: Reinicie o Claude Code

Force o encerramento do Claude Code, depois reabra.

**Por Quê**
O Claude Code carrega a lista de habilidades apenas ao iniciar, requer reinício para reconhecer habilidades recém-instaladas.

## Método 3: Usando Habilidades no claude.ai

Se você usa claude.ai (versão web do Claude), o método de instalação é diferente.

### Método 3.1: Adicionar ao Conhecimento do Projeto

#### Passo 1: Selecione os Arquivos de Habilidade

Empacote todos os arquivos nestes três diretórios: `skills/react-best-practices`, `skills/web-design-guidelines`, `skills/claude.ai/vercel-deploy-claimable`.

**Por Quê**
O claude.ai precisa adicionar os arquivos de habilidade como "knowledge" ao projeto.

#### Passo 2: Faça Upload no Projeto

No claude.ai:
1. Crie ou abra um projeto
2. Clique em "Knowledge" → "Add Files"
3. Faça upload dos arquivos de habilidade (ou diretório inteiro)

**Você Deve Ver**:
O conhecimento exibe a lista de arquivos do projeto.

### Método 3.2: Cole o Conteúdo SKILL.md

Se você não quiser fazer upload do diretório inteiro, pode copiar diretamente o conteúdo do `SKILL.md`.

#### Passo 1: Copie a Definição da Habilidade

Abra `skills/react-best-practices/SKILL.md`, copie todo o conteúdo.

**Por Quê**
`SKILL.md` contém a definição completa da habilidade, e o Claude entenderá a funcionalidade da habilidade baseado neste arquivo.

#### Passo 2: Cole na Conversa

Cole o conteúdo do `SKILL.md` na conversa do claude.ai, ou adicione à seção "Instructions" do projeto.

**Você Deve Ver**:
O Claude confirma o recebimento da definição da habilidade.

## Configurando Permissões de Rede (Importante)

Se você usar a habilidade `vercel-deploy` para deploy de projeto, precisa configurar permissões de rede.

::: warning Importante
A habilidade `vercel-deploy` precisa acessar o domínio `*.vercel.com` para fazer upload do deploy. Pular esta etapa causará falha de deploy!
:::

### Passo 1: Abra as Configurações de Capacidades do Claude

No navegador, acesse:
```
https://claude.ai/settings/capabilities
```

**Por Quê**
Aqui controla a lista de domínios que o Claude pode acessar.

### Passo 2: Adicione o Domínio Vercel

Clique em "Add domain", digite:
```
*.vercel.com
```

Clique em "Save" para salvar.

**Você Deve Ver**:
`*.vercel.com` aparece na lista de domínios.

**Ponto de Verificação ✅**: Domínio adicionado, habilidade agora pode acessar a rede.

## Armadilhas

### Problema 1: Habilidade Não Ativada

**Sintoma**: Você digita "Deploy my app", mas o Claude não sabe o que fazer.

**Possíveis Causas**:
- Claude Code não foi reiniciado (instalação manual)
- O conhecimento do projeto do claude.ai não carregou corretamente as habilidades

**Solução**:
- Claude Code: reinicie o aplicativo
- claude.ai: verifique se os arquivos de habilidade foram enviados ao Knowledge do projeto

### Problema 2: Falha de Deploy (Network Egress Error)

**Sintoma**:
```
Deployment failed due to network restrictions
```

**Solução**:
Verifique se `*.vercel.com` foi adicionado às permissões de rede:
```
Acesse https://claude.ai/settings/capabilities
Verifique se contém *.vercel.com
```

### Problema 3: Não Encontra Diretório `~/.claude/skills/`

**Sintoma**: Instalação manual indica diretório não existe.

**Solução**:
```bash
mkdir -p ~/.claude/skills/
```

### Problema 4: Falha na Instalação via npx

**Sintoma**:
```
npx: command not found
```

**Solução**:
```bash
# Confirme que Node.js e npm estão instalados
node -v
npm -v

# Se não estiverem instalados, instale a versão LTS de https://nodejs.org/
```

## Resumo da Lição

Este curso apresentou três métodos de instalação do Agent Skills:
- **Instalação rápida via npx**: Recomendado para Claude Code, conclui com um clique
- **Instalação manual**: Copia arquivos para `~/.claude/skills/`, aplicável quando você precisa controlar a localização da instalação
- **Instalação no claude.ai**: Faça upload de arquivos ao knowledge do projeto ou cole o `SKILL.md`

Se você usar a habilidade `vercel-deploy`, não esqueça de adicionar a permissão de rede `*.vercel.com` em `https://claude.ai/settings/capabilities`.

Após a instalação, você pode deixar o Claude usar automaticamente essas habilidades para auditoria de código, verificação de acessibilidade e deploy de projetos.

## Próxima Lição

> Na próxima lição, aprenderemos **[Melhores Práticas de Otimização de Desempenho do React/Next.js](../../platforms/react-best-practices/)**.
>
> Você aprenderá:
> - Como usar 57 regras de otimização de desempenho do React
> - Eliminar cachoeiras, otimizar tamanho do empacotamento, reduzir Re-render
> - Deixar a IA auditar código automaticamente e dar sugestões de correção

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir localizações do código fonte</strong></summary>

> Atualizado em: 2026-01-25

| Funcionalidade        | Caminho do Arquivo                                                                                      | Número de Linha    |
| ------------------- | ----------------------------------------------------------------------------------------------------- | ------------------ |
| Método de instalação npx | [`README.md:83-86`](https://github.com/vercel-labs/agent-skills/blob/main/README.md#L83-L86)  | 83-86              |
| Instalação manual no Claude Code | [`AGENTS.md:98-105`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L98-L105) | 98-105             |
| Método de instalação no claude.ai | [`AGENTS.md:106-109`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L106-L109) | 106-109            |
| Configuração de permissões de rede  | [`skills/claude.ai/vercel-deploy-claimable/SKILL.md:104-112`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md#L104-L112) | 104-112            |

**Pacotes de Habilidades Chave**:
- `react-best-practices`: 57 regras de otimização de desempenho do React (quantidade real de arquivos de regras)
- `web-design-guidelines`: Mais de 100 regras de diretrizes de design web
- `vercel-deploy`: Deploy com um clique no Vercel (suporte a 40+ frameworks)

</details>
