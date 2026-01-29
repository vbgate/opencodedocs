---
title: "Skills: Desenvolvimento Personalizado | Agent Skills"
sidebarTitle: "Desenvolvimento"
subtitle: "Desenvolvimento de Habilidades Personalizadas"
description: "Aprenda a desenvolver habilidades personalizadas para Claude. Inclui estrutura de diretório, formato SKILL.md, scripts Bash e empacotamento Zip."
tags:
  - "Desenvolvimento de Habilidades"
  - "Claude"
  - "Auxílio de Codificação por IA"
  - "Extensões Personalizadas"
prerequisite:
  - "start-getting-started"
  - "start-installation"
---

# Desenvolvimento de Habilidades Personalizadas

## O Que Você Poderá Fazer Após Este Curso

Após completar esta lição, você será capaz de:

- ✅ Criar estruturas de diretórios de habilidades que seguem as especificações
- ✅ Escrever arquivos de definição `SKILL.md` completos (incluindo Front Matter, How It Works, Usage, etc.)
- ✅ Escrever scripts Bash compatíveis com as especificações (tratamento de erros, formato de saída, mecanismos de limpeza)
- ✅ Empacotar habilidades como arquivos Zip e publicá-las
- ✅ Otimizar a eficiência do contexto para que o Claude ative habilidades com mais precisão

## Seu Desafio Atual

Você pode ter encontrado estes cenários:

- ✗ Frequentemente repete uma operação complexa (como implantar em uma plataforma específica, analisar formatos de log) e precisa explicá-la ao Claude toda vez
- ✗ Claude não sabe quando ativar determinada funcionalidade, levando você a inserir repetidamente os mesmos comandos
- ✗ Quer encapsular as práticas recomendadas da equipe em ferramentas reutilizáveis, mas não sabe por onde começar
- ✗ Arquivos de habilidades que você escreve são frequentemente ignorados pelo Claude, e você não sabe o que está errado

## Quando Usar Esta Abordagem

Quando você precisar:

- 📦 **Encapsular operações repetitivas**: Empacotar sequências de comandos frequentemente usadas para execução em um clique
- 🎯 **Acionamento preciso**: Fazer com que o Claude ative habilidades automaticamente em cenários específicos
- 🏢 **Padronização de processos**: Automatizar padrões da equipe (como verificação de código, processos de implantação)
- 🚀 **Expansão de capacidades**: Adicionar ao Claude funcionalidades que ele não suporta nativamente

## 🎒 Preparação Antes de Começar

Antes de começar, confirme:

::: warning Verificação de Pré-requisitos

- Já completou [Introdução ao Agent Skills](../../start/getting-started/)
- Instalou o Agent Skills e está familiarizado com o uso básico
- Entende operações básicas de linha de comando (scripts Bash)
- Possui um repositório GitHub (para publicar habilidades)

:::

## Ideia Central

**Como o Agent Skills Funciona**:

O Claude carrega apenas o **nome e a descrição** das habilidades ao iniciar, e só lê o conteúdo completo do `SKILL.md` quando detecta palavras-chave relevantes. Este **mecanismo de carregamento sob demanda** minimiza o consumo de Tokens ao máximo.

**Três Elementos Principais do Desenvolvimento de Habilidades**:

1. **Estrutura de diretório**: Layout de pastas que segue as convenções de nomenclatura
2. **SKILL.md**: Arquivo de definição da habilidade, que informa ao Claude quando ativar e como usar
3. **Scripts**: Código Bash que executa as operações reais

<!-- ![Fluxo de Ativação de Habilidades](/images/advanced/skill-activation-flow.svg) -->
> [Imagem: Fluxo de Ativação de Habilidades]

---

## Siga-me: Criando Sua Primeira Habilidade

### Passo 1: Criar a Estrutura de Diretório

**Por Quê**
A estrutura de diretório correta é pré-requisito para que o Claude reconheça a habilidade.

Crie uma nova habilidade no diretório `skills/`:

```bash
cd skills
mkdir my-custom-skill
cd my-custom-skill
mkdir scripts
```

**A estrutura de diretório deve ser**:

```
skills/
  my-custom-skill/
    SKILL.md           # Arquivo de definição da habilidade (obrigatório)
    scripts/
      deploy.sh        # Script executável (obrigatório)
```

**Observação**: Após o desenvolvimento, você precisa empacotar todo o diretório da habilidade em `my-custom-skill.zip` para publicação (veja a seção "Empacotar Habilidades" abaixo)

**Você Deve Ver**:
- `my-custom-skill/` usando kebab-case (letras minúsculas e hífens)
- `SKILL.md` com nome totalmente em maiúsculas, deve corresponder exatamente
- `scripts/` contendo scripts executáveis

### Passo 2: Escrever o SKILL.md

**Por Quê**
`SKILL.md` é o núcleo da habilidade, definindo condições de acionamento, métodos de uso e formato de saída.

Crie o arquivo `SKILL.md`:

```markdown
---
name: my-custom-skill
description: Deploy my app to custom platform. Use when user says "deploy", "production", or "custom deploy".
---

# Custom Deployment Skill

Deploy your application to a custom platform with zero-config setup.

## How It Works

1. Detect the framework from `package.json` (Next.js, Vue, Svelte, etc.)
2. Create a tarball of the project (excluding `node_modules` and `.git`)
3. Upload to the deployment API
4. Return preview URL and deployment ID

## Usage

```bash
bash /mnt/skills/user/my-custom-skill/scripts/deploy.sh [path]
```

**Arguments:**
- `path` - Directory path or .tgz file to deploy (defaults to current directory)

**Examples:**

Deploy current directory:
```bash
bash /mnt/skills/user/my-custom-skill/scripts/deploy.sh .
```

Deploy specific directory:
```bash
bash /mnt/skills/user/my-custom-skill/scripts/deploy.sh ./my-app
```

## Output

You'll see:

```
✓ Deployed to https://my-app-abc123.custom-platform.io
✓ Deployment ID: deploy_12345
✓ Claim URL: https://custom-platform.io/claim?code=...
```

JSON format (for machine-readable output):
```json
{
  "previewUrl": "https://my-app-abc123.custom-platform.io",
  "deploymentId": "deploy_12345",
  "claimUrl": "https://custom-platform.io/claim?code=..."
}
```

## Present Results to User

When presenting results to the user, use this format:

```
🎉 Deployment successful!

**Preview URL**: https://my-app-abc123.custom-platform.io

To transfer ownership:
1. Visit the claim URL
2. Sign in to your account
3. Confirm the transfer

**Deployment ID**: deploy_12345
```

## Troubleshooting

**Network Error**
- Check your internet connection
- Verify the deployment API is accessible

**Permission Error**
- Ensure the directory is readable
- Check file permissions on the script

**Framework Not Detected**
- Ensure `package.json` exists in the project root
- Verify the framework is supported
```

**Você Deve Ver**:
- Front Matter contém campos `name` e `description`
- `description` contém palavras-chave de acionamento (como "deploy", "production")
- Inclui seções How It Works, Usage, Output, Present Results to User, Troubleshooting

### Passo 3: Escrever o Script Bash

**Por Quê**
O script é a parte que executa operações reais e precisa seguir as especificações de entrada/saída do Claude.

Crie `scripts/deploy.sh`:

```bash
#!/bin/bash
set -e  # Sai imediatamente ao encontrar erro

# Configuração
DEPLOY_API="${DEPLOY_API:-https://deploy.example.com/api}"

# Analisar parâmetros
INPUT_PATH="${1:-.}"

# Função de limpeza
cleanup() {
  if [ -n "$TEMP_TARBALL" ] && [ -f "$TEMP_TARBALL" ]; then
    rm -f "$TEMP_TARBALL" >&2 || true
  fi
}
trap cleanup EXIT

# Detectar framework
detect_framework() {
  local path="$1"
  local framework=""

  if [ -f "${path}/package.json" ]; then
    if grep -q '"next"' "${path}/package.json"; then
      framework="nextjs"
    elif grep -q '"vue"' "${path}/package.json"; then
      framework="vue"
    elif grep -q '"@sveltejs/kit"' "${path}/package.json"; then
      framework="sveltekit"
    fi
  fi

  echo "$framework"
}

# Fluxo principal
FRAMEWORK=$(detect_framework "$INPUT_PATH")
echo "Detected framework: ${FRAMEWORK:-unknown}" >&2

# Criar tarball
TEMP_TARBALL=$(mktemp -t deploy-XXXXXX.tgz)
echo "Creating tarball..." >&2
tar -czf "$TEMP_TARBALL" \
  --exclude='node_modules' \
  --exclude='.git' \
  -C "$INPUT_PATH" . >&2 || true

# Upload
echo "Uploading..." >&2
RESULT=$(curl -s -X POST "$DEPLOY_API" \
  -F "file=@$TEMP_TARBALL" \
  -F "framework=$FRAMEWORK")

# Verificar erros
if echo "$RESULT" | grep -q '"error"'; then
  ERROR_MSG=$(echo "$RESULT" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)
  echo "Deployment failed: $ERROR_MSG" >&2
  exit 1
fi

# Saída de resultado
echo "$RESULT"
echo "Deployment completed successfully" >&2
```

**Você Deve Ver**:
- Script usa shebang `#!/bin/bash`
- Usa `set -e` para tratamento de erros
- Mensagens de status enviadas para stderr (`>&2`)
- Saída legível por máquina (JSON) enviada para stdout
- Inclui trap de limpeza

### Passo 4: Configurar Permissões de Execução

```bash
chmod +x scripts/deploy.sh
```

**Você Deve Ver**:
- Script tornou-se executável (`ls -l scripts/deploy.sh` mostra `-rwxr-xr-x`)

### Passo 5: Testar a Habilidade

Teste a habilidade no Claude Code:

```bash
# Ativar habilidade
"Activate my-custom-skill"

# Acionar implantação
"Deploy my current directory using my-custom-skill"
```

**Você Deve Ver**:
- Claude ativou a habilidade
- Executou o script `deploy.sh`
- Saída o resultado da implantação (contendo previewUrl e deploymentId)

---

## Ponto de Verificação ✅

Agora verifique se sua habilidade está em conformidade com as especificações:

- [ ] Nome do diretório usa kebab-case (como `my-custom-skill`)
- [ ] `SKILL.md` com nome totalmente em maiúsculas, sem erros
- [ ] Front Matter contém campos `name` e `description`
- [ ] `description` contém palavras-chave de acionamento
- [ ] Script usa shebang `#!/bin/bash`
- [ ] Script usa `set -e` para tratamento de erros
- [ ] Mensagens de status enviadas para stderr (`>&2`)
- [ ] Saída JSON para stdout
- [ ] Script inclui trap de limpeza

---

## Armadilhas

### Armadilha 1: Habilidade Não é Ativada

**Sintoma**: Você diz "Deploy my app", mas o Claude não ativa a habilidade.

**Causa**: `description` não contém palavras-chave de acionamento.

**Solução**:
```markdown
# ❌ Incorreto
description: A tool for deploying applications

# ✅ Correto
description: Deploy my app to production. Use when user says "deploy", "production", or "push to live".
```

### Armadilha 2: Saída do Script Confusa

**Sintoma**: Claude não consegue analisar a saída JSON.

**Causa**: Mensagens de status e saída JSON misturadas.

**Solução**:
```bash
# ❌ Incorreto: tudo para stdout
echo "Creating tarball..."
echo '{"previewUrl": "..."}'

# ✅ Correto: mensagens de status para stderr
echo "Creating tarball..." >&2
echo '{"previewUrl": "..."}'
```

### Armadilha 3: Arquivos Temporários Não Limpados

**Sintoma**: Espaço em disco sendo gradualmente ocupado.

**Causa**: Script não limpa arquivos temporários ao sair.

**Solução**:
```bash
# ✅ Correto: usar cleanup trap
cleanup() {
  rm -f "$TEMP_TARBALL" >&2 || true
}
trap cleanup EXIT
```

### Armadilha 4: SKILL.md Muito Longo

**Sintoma**: Habilidade ocupa muito contexto, afetando o desempenho.

**Causa**: `SKILL.md` excede 500 linhas.

**Solução**:
- Coloque documentação de referência detalhada em arquivo separado
- Use Divulgação Progressiva
- Priorize scripts em vez de código inline

---

## Resumo da Lição

**Pontos Principais**:

1. **Estrutura de Diretório**: Use kebab-case, inclua `SKILL.md` e diretório `scripts/`
2. **Formato SKILL.md**: Front Matter + How It Works + Usage + Output + Present Results to User + Troubleshooting
3. **Padrões de Script**: `#!/bin/bash`, `set -e`, stderr para status, stdout para JSON, trap de limpeza
4. **Eficiência de Contexto**: Mantenha `SKILL.md` < 500 linhas, use divulgação progressiva, priorize scripts
5. **Empacotamento e Publicação**: Use comando `zip -r` para empacotar como `{skill-name}.zip`

**Fórmula de Práticas Recomendadas**:

> Descrição específica, acionamento claro
> Status para stderr, JSON para stdout
> Lembre-se do trap, limpe arquivos temporários
> Arquivos não muito longos, scripts ocupam espaço

---

## Próxima Lição

> Na próxima lição, aprenderemos **[Escrever Regras de Melhores Práticas do React](../rule-authoring/)**.
>
> Você aprenderá:
> - Como escrever arquivos de regras conformes
> - Usar o modelo `_template.md` para gerar regras
> - Definir níveis de impacto e tags
> - Escrever exemplos de código Incorreto/Correto
> - Adicionar referências e validar regras

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir localizações do código fonte</strong></summary>

> Atualizado em: 2026-01-25

| Funcionalidade            | Caminho do Arquivo                                                                                       | Número de Linha |
|--- | --- | ---|
| Especificação de desenvolvimento de habilidades | [`AGENTS.md:9-69`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L9-L69)     | 9-69          |
| Definição de estrutura de diretório   | [`AGENTS.md:11-20`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L11-L20)   | 11-20         |
| Convenções de nomenclatura           | [`AGENTS.md:22-27`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L22-L27)   | 22-27         |
| Formato SKILL.md                    | [`AGENTS.md:29-68`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L29-L68)   | 29-68         |
| Melhores práticas de eficiência de contexto | [`AGENTS.md:70-78`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L70-L78)   | 70-78         |
| Requisitos de script                | [`AGENTS.md:80-87`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L80-L87)   | 80-87         |
| Empacotamento Zip                   | [`AGENTS.md:89-96`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L89-L96)   | 89-96         |
| Método de instalação do usuário     | [`AGENTS.md:98-110`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L98-L110) | 98-110        |

**Constantes Chave**:
- Nome do arquivo `SKILL.md`: Deve ser totalmente em maiúsculas, corresponder exatamente
- `/mnt/skills/user/{skill-name}/scripts/{script}.sh`: Formato de caminho do script

**Funções Chave**:
- Função de limpeza de script `cleanup()`: Usada para excluir arquivos temporários
- Função de detecção de framework `detect_framework()`: Infere tipo de framework do package.json

</details>
