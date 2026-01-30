---
title: "Configuração do Gerenciador de Pacotes: Detecção Automática | Everything Claude Code"
sidebarTitle: "Comandos Unificados do Projeto"
subtitle: "Configuração do Gerenciador de Pacotes: Detecção Automática | Everything Claude Code"
description: "Aprenda a configurar a detecção automática de gerenciador de pacotes. Domine o mecanismo de 6 níveis de prioridade, com suporte para npm/pnpm/yarn/bun, comandos unificados para múltiplos projetos."
tags:
  - "package-manager"
  - "configuration"
  - "npm"
  - "pnpm"
prerequisite:
  - "start-installation"
order: 30
---

# Configuração do Gerenciador de Pacotes: Detecção e Personalização Automáticas

## O Que Você Vai Aprender

- ✅ Detectar automaticamente o gerenciador de pacotes usado no projeto atual (npm/pnpm/yarn/bun)
- ✅ Entender o mecanismo de detecção de 6 níveis de prioridade
- ✅ Configurar o gerenciador de pacotes em nível global e de projeto
- ✅ Usar o comando `/setup-pm` para configuração rápida
- ✅ Lidar com cenários de múltiplos projetos com diferentes gerenciadores de pacotes

## O Dilema Atual

Seus projetos estão se multiplicando, alguns usam npm, outros pnpm, outros ainda yarn ou bun. Toda vez que você digita um comando no Claude Code, precisa se lembrar:

- Este projeto usa `npm install` ou `pnpm install`?
- Devo usar `npx`, `pnpm dlx` ou `bunx`?
- O script é `npm run dev`, `pnpm dev` ou `bun run dev`?

Erre uma vez e o comando falha, desperdiçando tempo.

## Quando Usar Esta Técnica

- **Ao iniciar um novo projeto**: Configure imediatamente após escolher o gerenciador de pacotes
- **Ao alternar entre projetos**: Verifique se a detecção atual está correta
- **Ao trabalhar em equipe**: Garanta que todos os membros usem o mesmo estilo de comando
- **Em ambientes com múltiplos gerenciadores**: Configure globalmente + sobrescreva por projeto, gerenciando com flexibilidade

::: tip Por que configurar o gerenciador de pacotes?
Os hooks e agents do Everything Claude Code geram automaticamente comandos relacionados ao gerenciador de pacotes. Se a detecção estiver incorreta, todos os comandos usarão a ferramenta errada, causando falhas nas operações.
:::

## Preparação Antes de Começar

::: warning Pré-requisito
Antes de iniciar esta lição, certifique-se de ter completado o [Guia de Instalação](../../installation/), com o plugin corretamente instalado no Claude Code.
:::

Verifique se os gerenciadores de pacotes já estão instalados no seu sistema:

```bash
# Verificar gerenciadores de pacotes instalados
which npm pnpm yarn bun

# Ou no Windows (PowerShell)
Get-Command npm, pnpm, yarn, bun -ErrorAction SilentlyContinue
```

Se você vir uma saída similar, os gerenciadores estão instalados:

```
/usr/local/bin/npm
/usr/local/bin/pnpm
```

Se algum gerenciador de pacotes não for encontrado, você precisará instalá-lo primeiro (esta lição não cobre instalação de gerenciadores de pacotes).

## Conceito Central

O Everything Claude Code usa um **mecanismo de detecção inteligente**, que seleciona automaticamente o gerenciador de pacotes seguindo uma prioridade de 6 níveis. Você só precisa configurar no local mais apropriado uma única vez, e ele funcionará corretamente em todos os cenários.

### Prioridade de Detecção (do maior para o menor)

```
1. Variável de ambiente CLAUDE_PACKAGE_MANAGER  ─── Prioridade máxima, sobrescrita temporária
2. Configuração do projeto .claude/package-manager.json  ─── Sobrescrita em nível de projeto
3. Campo packageManager em package.json  ─── Especificação do projeto
4. Arquivo Lock (pnpm-lock.yaml etc.)  ─── Detecção automática
5. Configuração global ~/.claude/package-manager.json  ─── Padrão global
6. Fallback: encontra o primeiro disponível em ordem  ─── Plano de contingência
```

### Por que usar esta ordem?

- **Variável de ambiente no topo**: Facilita alternância temporária (como em ambientes CI/CD)
- **Configuração do projeto em seguida**: Força uniformidade no mesmo projeto
- **Campo package.json**: Este é o padrão Node.js
- **Arquivo Lock**: Arquivo realmente usado pelo projeto
- **Configuração global**: Preferência padrão pessoal
- **Fallback**: Garante que sempre haverá uma ferramenta disponível

## Siga Comigo

### Passo 1: Detectar Configuração Atual

**Por que**
Entender primeiro a situação de detecção atual, confirmando se configuração manual é necessária.

```bash
# Detectar gerenciador de pacotes atual
node scripts/setup-package-manager.js --detect
```

**Você deve ver**:

```
=== Package Manager Detection ===

Current selection:
  Package Manager: pnpm
  Source: lock-file

Detection results:
  From package.json: not specified
  From lock file: pnpm
  Environment var: not set

Available package managers:
  ✓ npm
  ✓ pnpm (current)
  ✗ yarn
  ✓ bun

Commands:
  Install: pnpm install
  Run script: pnpm [script-name]
  Execute binary: pnpm dlx [binary-name]
```

Se o gerenciador de pacotes exibido corresponder ao esperado, a detecção está correta e nenhuma configuração manual é necessária.

### Passo 2: Configurar Gerenciador de Pacotes Padrão Global

**Por que**
Definir um padrão global para todos os seus projetos, reduzindo configurações repetidas.

```bash
# Definir padrão global como pnpm
node scripts/setup-package-manager.js --global pnpm
```

**Você deve ver**:

```
✓ Global preference set to: pnpm
  Saved to: ~/.claude/package-manager.json
```

Verifique o arquivo de configuração gerado:

```bash
cat ~/.claude/package-manager.json
```

**Você deve ver**:

```json
{
  "packageManager": "pnpm",
  "setAt": "2026-01-25T12:00:00.000Z"
}
```

### Passo 3: Configurar Gerenciador de Pacotes em Nível de Projeto

**Por que**
Alguns projetos podem precisar usar um gerenciador de pacotes específico (por exemplo, dependendo de funcionalidades específicas), e a configuração em nível de projeto sobrescreverá a configuração global.

```bash
# Definir bun para o projeto atual
node scripts/setup-package-manager.js --project bun
```

**Você deve ver**:

```
✓ Project preference set to: bun
  Saved to: .claude/package-manager.json
```

Verifique o arquivo de configuração gerado:

```bash
cat .claude/package-manager.json
```

**Você deve ver**:

```json
{
  "packageManager": "bun",
  "setAt": "2026-01-25T12:00:00.000Z"
}
```

::: tip Configuração de Projeto vs Global
- **Configuração global**: ~/.claude/package-manager.json, afeta todos os projetos
- **Configuração de projeto**: .claude/package-manager.json, afeta apenas o projeto atual, tem prioridade mais alta
:::

### Passo 4: Usar o Comando /setup-pm (Opcional)

**Por que**
Se você não quiser executar scripts manualmente, pode usar o comando de barra diretamente no Claude Code.

No Claude Code, digite:

```
/setup-pm
```

O Claude Code chamará o script e mostrará opções interativas.

**Você deve ver** uma saída de detecção similar:

```
[PackageManager] Available package managers:
  - npm
  - pnpm (current)
  - bun

To set your preferred package manager:
  - Global: Set CLAUDE_PACKAGE_MANAGER environment variable
  - Or add to ~/.claude/package-manager.json: {"packageManager": "pnpm"}
  - Or add to package.json: {"packageManager": "pnpm@8"}
```

### Passo 5: Verificar a Lógica de Detecção

**Por que**
Entender a prioridade de detecção permite que você preveja os resultados em diferentes situações.

Vamos testar alguns cenários:

**Cenário 1: Detecção por Arquivo Lock**

```bash
# Remover configuração do projeto
rm .claude/package-manager.json

# Detectar
node scripts/setup-package-manager.js --detect
```

**Você deve ver** `Source: lock-file` (se o arquivo lock existir)

**Cenário 2: Campo package.json**

```bash
# Adicionar em package.json
cat >> package.json << 'EOF'
  "packageManager": "pnpm@8.6.0"
EOF

# Detectar
node scripts/setup-package-manager.js --detect
```

**Você deve ver** `From package.json: pnpm@8.6.0`

**Cenário 3: Substituição por Variável de Ambiente**

```bash
# Definir variável de ambiente temporária
export CLAUDE_PACKAGE_MANAGER=yarn

# Detectar
node scripts/setup-package-manager.js --detect
```

**Você deve ver** `Source: environment` e `Package Manager: yarn`

```bash
# Limpar variável de ambiente
unset CLAUDE_PACKAGE_MANAGER
```

## Pontos de Verificação ✅

Certifique-se de que os seguintes pontos de verificação sejam atendidos:

- [ ] Executar o comando `--detect` identifica corretamente o gerenciador de pacotes atual
- [ ] O arquivo de configuração global foi criado: `~/.claude/package-manager.json`
- [ ] O arquivo de configuração do projeto foi criado (se necessário): `.claude/package-manager.json`
- [ ] As relações de substituição de diferentes prioridades estão de acordo com o esperado
- [ ] Os gerenciadores de pacotes listados como disponíveis correspondem aos realmente instalados

## Alertas de Erros Comuns

### ❌ Erro 1: Configuração Definida mas Não Aplicada

**Sintoma**: Claramente configurou `pnpm`, mas a detecção mostra `npm`.

**Causa**:
- Arquivos lock têm prioridade maior que a configuração global (se o arquivo lock existir)
- O campo `packageManager` em package.json também tem prioridade maior que a configuração global

**Solução**:
```bash
# Verificar a origem da detecção
node scripts/setup-package-manager.js --detect

# Se for arquivo lock ou package.json, verifique esses arquivos
ls -la | grep -E "(package-lock|yarn.lock|pnpm-lock|bun.lockb)"
cat package.json | grep packageManager
```

### ❌ Erro 2: Configurou um Gerenciador de Pacotes Inexistente

**Sintoma**: Configurou `bun`, mas o sistema não tem ele instalado.

**O resultado da detecção** mostrará:

```
Available package managers:
  ✓ npm
  ✗ bun (current)  ← Nota: embora marcado como current, não está instalado
```

**Solução**: Primeiro instale o gerenciador de pacotes, ou configure outro que já esteja instalado.

```bash
# Listar gerenciadores de pacotes disponíveis
node scripts/setup-package-manager.js --list

# Mudar para um já instalado
node scripts/setup-package-manager.js --global npm
```

### ❌ Erro 3: Problemas de Caminho no Windows

**Sintoma**: Ao executar o script no Windows, aparece erro de arquivo não encontrado.

**Causa**: Problemas com separadores de caminho em scripts Node.js (o código-fonte já trata isso, mas certifique-se de usar o comando correto).

**Solução**: Use PowerShell ou Git Bash, garantindo que o caminho esteja correto:

```powershell
# PowerShell
node scripts\setup-package-manager.js --detect
```

### ❌ Erro 4: Configuração do Projeto Afeta Outros Projetos

**Sintoma**: O projeto A foi configurado com `bun`, mas ao mudar para o projeto B ainda usa `bun`.

**Causa**: A configuração do projeto só é válida no diretório atual do projeto, mudar de diretório dispara uma nova detecção.

**Solução**: Este é o comportamento esperado. A configuração do projeto só afeta o projeto atual, não polui outros projetos.

## Resumo da Lição

O mecanismo de detecção de gerenciador de pacotes do Everything Claude Code é muito inteligente:

- **6 Níveis de Prioridade**: variável de ambiente > configuração do projeto > package.json > arquivo lock > configuração global > fallback
- **Configuração Flexível**: suporta padrão global e sobrescrita por projeto
- **Detecção Automática**: na maioria dos casos não requer configuração manual
- **Comandos Unificados**: após a configuração, todos os hooks e agents usarão os comandos corretos

**Estratégia de Configuração Recomendada**:

1. Defina globalmente o gerenciador de pacotes que você mais usa (como `pnpm`)
2. Projetos específicos podem ser sobrescritos no nível do projeto (como quando dependem do desempenho do `bun`)
3. Deixe a detecção automática lidar com outros casos

## Próxima Lição

> Na próxima lição vamos aprender **[Configuração de Servidores MCP](../mcp-setup/)**.
>
> Você vai aprender:
> - Como configurar mais de 15 servidores MCP pré-configurados
> - Como servidores MCP expandem as capacidades do Claude Code
> - Como gerenciar o estado de habilitação e uso de Token dos servidores MCP

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Última atualização: 2026-01-25

| Funcionalidade | Caminho do Arquivo | Linhas |
|---|---|---|
| Lógica central de detecção do gerenciador de pacotes | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L157-L236) | 157-236 |
| Detecção de arquivo Lock | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L92-L102) | 92-102 |
| Detecção de package.json | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L107-L126) | 107-126 |
| Definição do gerenciador de pacotes (configuração) | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L13-L54) | 13-54 |
| Definição de prioridade de detecção | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L57) | 57 |
| Salvamento de configuração global | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L241-L252) | 241-252 |
| Salvamento de configuração do projeto | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L257-L272) | 257-272 |
| Entrada do script de linha de comando | [`scripts/setup-package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/setup-package-manager.js#L158-L206) | 158-206 |
| Implementação do comando de detecção | [`scripts/setup-package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/setup-package-manager.js#L62-L95) | 62-95 |

**Constantes-chave**:
- `PACKAGE_MANAGERS`: Gerenciadores de pacotes suportados e suas configurações de comando (linhas 13-54)
- `DETECTION_PRIORITY`: Ordem de prioridade de detecção `['pnpm', 'bun', 'yarn', 'npm']` (linha 57)

**Funções-chave**:
- `getPackageManager()`: Lógica central de detecção, retorna gerenciador de pacotes por prioridade (linhas 157-236)
- `detectFromLockFile()`: Detecta gerenciador de pacotes a partir de arquivo lock (linhas 92-102)
- `detectFromPackageJson()`: Detecta gerenciador de pacotes a partir de package.json (linhas 107-126)
- `setPreferredPackageManager()`: Salva configuração global (linhas 241-252)
- `setProjectPackageManager()`: Salva configuração do projeto (linhas 257-272)

**Implementação da Prioridade de Detecção** (linhas 157-236 do código-fonte):
```javascript
function getPackageManager(options = {}) {
  // 1. Variável de ambiente (prioridade máxima)
  if (envPm && PACKAGE_MANAGERS[envPm]) { return { name: envPm, source: 'environment' }; }

  // 2. Configuração do projeto
  if (projectConfig) { return { name: config.packageManager, source: 'project-config' }; }

  // 3. Campo package.json
  if (fromPackageJson) { return { name: fromPackageJson, source: 'package.json' }; }

  // 4. Arquivo Lock
  if (fromLockFile) { return { name: fromLockFile, source: 'lock-file' }; }

  // 5. Configuração global
  if (globalConfig) { return { name: globalConfig.packageManager, source: 'global-config' }; }

  // 6. Fallback: encontra o primeiro disponível em ordem
  for (const pmName of fallbackOrder) {
    if (available.includes(pmName)) { return { name: pmName, source: 'fallback' }; }
  }

  // Padrão npm
  return { name: 'npm', source: 'default' };
}
```

</details>
