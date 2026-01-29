---
title: "Solução de Problemas: Diagnóstico e Correção | Agent Skills"
sidebarTitle: "Troubleshooting"
subtitle: "Solução de Problemas Comuns"
description: "Resolva problemas comuns do Agent Skills: erros de rede, habilidades não ativadas e falhas de validação. Aprenda diagnóstico rápido e correção eficiente."
tags:
  - "FAQ"
  - "Solução de Problemas"
  - "Depuração"
  - "Configuração de Rede"
prerequisite:
  - "start-getting-started"
  - "start-installation"
---

# Solução de Problemas Comuns

## O Que Você Poderá Fazer Após Este Curso

- Diagnosticar e resolver rapidamente erros de rede durante o deploy
- Corrigir problemas de habilidades não ativadas
- Tratar falhas de validação de regras
- Identificar causas de detecção imprecisa de frameworks

## Problemas Relacionados ao Deploy

### Network Egress Error (Erro de Rede)

**Problema**: Ao tentar fazer deploy no Vercel, ocorre erro de rede, indicando impossibilidade de acessar rede externa.

**Causa**: No ambiente claude.ai, o acesso à rede é limitado por padrão. A habilidade `vercel-deploy-claimable` precisa acessar domínio `*.vercel.com` para fazer upload de arquivos.

**Solução**:

::: tip Configurar Permissões de Rede no claude.ai

1. Acesse [https://claude.ai/settings/capabilities](https://claude.ai/settings/capabilities)
2. Em "Allowed Domains", adicione `*.vercel.com`
3. Salve as configurações e tente novamente o deploy

:::

**Método de Validação**:

```bash
# Testar conexão de rede (não executa deploy)
curl -I https://claude-skills-deploy.vercel.com/api/deploy
```

**Você Deve Ver**:
```bash
HTTP/2 200
```

### Falha de Deploy: Não foi Possível Extrair URL de Preview

**Problema**: O script de deploy executa com sucesso, mas exibe "Error: Could not extract preview URL from response".

**Causa**: A API de deploy retornou resposta de erro (contém campo `"error"`), mas o script verificou primeiro a falha de extração de URL.

Com base no código fonte [`deploy.sh:224-229`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L224-L229):

```bash
# Verificar erro na resposta
if echo "$RESPONSE" | grep -q '"error"'; then
    ERROR_MSG=$(echo "$RESPONSE" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)
    echo "Error: $ERROR_MSG" >&2
    exit 1
fi
```

**Solução**:

1. Ver resposta completa de erro:
```bash
# Execute deploy novamente no diretório raiz do projeto, observe a mensagem de erro
bash skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh .
```

2. Tipos comuns de erros:

| Mensagem de Erro                     | Possível Causa             | Solução                                           |
| ------------------------------------ | -------------------------- | -------------------------------------------------- |
| "File too large"                       | Volume do projeto excede limite | Exclua arquivos desnecessários (como `*.log`, `*.test.ts`) |
| "Invalid framework"                     | Falha ao identificar framework | Adicione `package.json` ou especifique framework manualmente |
| "Network timeout"                       | Tempo limite de rede       | Verifique conexão de rede, tente novamente           |

**Medidas Preventivas**:

O script de deploy automaticamente exclui `node_modules` e `.git` (ver código fonte [`deploy.sh:210`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L210)), mas você pode otimizar ainda mais:

```bash
# Modificar deploy.sh, adicionar mais exclusões
tar -czf "$TARBALL" -C "$PROJECT_PATH" \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='*.log' \
  --exclude='coverage' \
  --exclude='.next' \
  .
```

### Detecção Imprecisa de Framework

**Problema**: Ao fazer deploy, o framework detectado não corresponde ao real, ou retorna `null`.

**Causa**: A detecção de framework depende da lista de dependências em `package.json`. Se faltar dependência ou o tipo de projeto for especial, a detecção pode falhar.

Com base no código fonte [`deploy.sh:12-156`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L12-L156), lógica de detecção:

1. Lê `package.json`
2. Verifica nomes de pacote específicos
3. Combina em ordem de prioridade (Blitz → Next.js → Gatsby → ...)

**Solução**:

| Cenário                                              | Método de Solução                                             |
| ----------------------------------------------------- | -------------------------------------------------------------- |
| `package.json` existe mas detecção falha                | Verifique se dependência está em `dependencies` ou `devDependencies` |
| Projeto HTML puramente estático                          | Certifique-se de haver `index.html` no diretório raiz, o script renomeará automaticamente arquivo HTML único (ver código fonte [`deploy.sh:198-205`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L198-L205)) |
| Framework não está na lista de suporte                    | Faça deploy diretamente (framework é null), o Vercel detectará automaticamente |

**Verificação Manual de Detecção de Framework**:

```bash
# Simular detecção de framework (requer ambiente bash)
grep -E '"(next|gatsby|vite|astro)"' package.json
```

## Problemas de Ativação de Habilidades

### Habilidade Não Ativada

**Problema**: Você insere "Deploy my app" no Claude, mas a habilidade não é ativada.

**Causa**: A ativação de habilidade depende da combinação de palavras-chave no prompt. Se palavras-chave não forem claras ou a habilidade não estiver corretamente carregada, a IA não consegue identificar qual habilidade usar.

**Solução**:

::: warning Lista de Verificação

1. **Verifique se habilidade está instalada**:
   ```bash
   # Usuário Claude Desktop
   ls ~/.claude/skills/ | grep agent-skills

   # Usuário claude.ai
   Verifique se o knowledge do projeto contém agent-skills
   ```

2. **Use palavras-chave claras**:
   - ✅ Disponível: `Deploy my app to Vercel`
   - ✅ Disponível: `Review this React component for performance`
   - ✅ Disponível: `Check accessibility of my site`
   - ❌ Indisponível: `帮我部署` (falta palavras-chave)

3. **Recarregue habilidades**:
   - Claude Desktop: Saia e reinicie o aplicativo
   - claude.ai: Atualize a página ou readicione habilidades ao projeto

:::

**Verifique Descrição da Habilidade**:

O início do arquivo `SKILL.md` de cada habilidade contém descrição, indicando palavras-chave de ativação. Por exemplo:
- `vercel-deploy`: Palavras-chave incluem "Deploy", "deploy", "production"
- `react-best-practices`: Palavras-chave incluem "React", "component", "performance"

### Habilidade de Diretrizes de Design da Web Não Consegue Buscar Regras

**Problema**: Ao usar habilidade `web-design-guidelines`, exibe impossibilidade de buscar regras do GitHub.

**Causa**: Esta habilidade precisa acessar repositório GitHub para buscar as regras mais recentes, mas o claude.ai limita acesso à rede por padrão.

**Solução**:

1. Em [https://claude.ai/settings/capabilities](https://claude.ai/settings/capabilities) adicione:
   - `raw.githubusercontent.com`
   - `github.com`

2. Valide acesso à rede:
```bash
# Testar se fonte de regras está acessível
curl -I https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

**Solução Alternativa**: Se a rede estiver restrita, baixe manualmente os arquivos de regras e coloque localmente, modifique a definição da habilidade para apontar para caminho local.

## Problemas de Validação de Regras

### VALIDATION_ERROR

**Problema**: Ao executar `pnpm validate`, exibe erro indicando falha de validação de regras.

**Causa**: O formato do arquivo de regra não está em conformidade com especificações, faltando campos obrigatórios ou exemplos de código.

Com base no código fonte [`validate.ts:21-66`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts#L21-L66), regras de validação incluem:

1. **title não vazio**: Regra deve ter título
2. **explanation não vazio**: Regra deve ter explicação
3. **examples não vazio**: Deve incluir pelo menos um exemplo de código
4. **impacto válido**: Deve ser um dos valores `ImpactLevel` válidos (CRITICAL/HIGH/MEDIUM-HIGH/MEDIUM/LOW-MEDIUM/LOW)
5. **exemplos de código completos**: Deve incluir pelo menos comparação de "Incorrect/Correct"

**Solução**:

::: tip Exemplos de Erros de Validação e Correção

| Mensagem de Erro                         | Causa                                 | Método de Correção                                                                 |
| ---------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------- |
| `Missing or empty title`                 | Frontmatter sem campo `title`        | Adicione ao topo do arquivo de regra:<br>`---`<br>`title: "Título da Regra"`<br>`---` |
| `Missing or empty explanation`            | Falta explicação de regra           | No frontmatter, adicione campo `explanation`                               |
| `Missing examples`                       | Sem exemplos de código               | Adicione `**Incorrect:**` e `**Correct:**` blocos de código                 |
| `Invalid impact level`                   | Valor de impact errado                | Verifique no frontmatter se `impact` é um valor de enumeração válido          |
| `Missing bad/incorrect or good/correct examples` | Labels de exemplo não combinam | Garanta que labels de exemplo incluam "Incorrect" ou "Correct"             |

:::

**Exemplo Completo**:

```markdown
---
title: "My Rule"
impact: "CRITICAL"
explanation: "Descrição da regra"
---

## My Rule

**Incorrect:**
\`\`\`typescript
// Exemplo incorreto
\`\`\`

**Correct:**
\`\`\`typescript
// Exemplo correto
\`\`\`
```

**Executar Validação**:

```bash
cd packages/react-best-practices-build
pnpm validate
```

**Você Deve Ver**:
```
Validating rule files...
Rules directory: ../../skills/react-best-practices/rules
✓ All 57 rule files are valid
```

### Falha na Análise do Arquivo de Regras

**Problema**: Validação exibe `Failed to parse: ...`, geralmente devido a erro de formato Markdown.

**Causa**: Erro de formato YAML do frontmatter, nível de título irregular ou erro de sintaxe de bloco de código.

**Solução**:

1. **Verifique Frontmatter**:
   - Use três hífens `---` para cercar
   - Deve haver espaço após dois pontos
   - Sugere-se envolver valores de string com aspas duplas

2. **Verifique Nível de Título**:
   - Título da regra usa `##` (H2)
   - Labels de exemplo usam `**Incorrect:**` e `**Correct:**`

3. **Verifique Bloco de Código**:
   - Use três crases `\`\`\`` para cercar código
   - Especifique tipo de linguagem (como `typescript`)

**Exemplos de Erros Comuns**:

```markdown
# ❌ Incorreto: falta espaço após dois pontos no frontmatter
---
title:"my rule"
---

# ✅ Correto
---
title: "my rule"
---

# ❌ Incorreto: label de exemplo faltando dois pontos
**Incorrect**
\`\`\`typescript
code
\`\`\`

# ✅ Correto
**Incorrect:**
\`\`\`typescript
code
\`\`\`
```

## Problemas de Permissões de Arquivo

### Não é Possível Gravar em ~/.claude/skills/

**Problema**: Ao executar comando de instalação, exibe erro de permissão.

**Causa**: Diretório `~/.claude` não existe ou usuário atual não tem permissão de escrita.

**Solução**:

```bash
# Criar diretório manualmente
mkdir -p ~/.claude/skills

# Copiar pacote de habilidades
cp -r agent-skills/* ~/.claude/skills/

# Verificar permissões
ls -la ~/.claude/skills/
```

**Você Deve Ver**:
```
drwxr-xr-x user group  size  date  react-best-practices/
drwxr-xr-x user group  size  date  web-design-guidelines/
drwxr-xr-x user group  size  date  vercel-deploy-claimable/
```

### Problemas de Caminho no Windows

**Problema**: Ao executar script de deploy no Windows, há erro de formato de caminho.

**Causa**: Windows usa barra invertida `\` como separador de caminho, mas scripts Bash esperam barra `/`.

**Solução**:

::: code-group

```bash [Git Bash / WSL]
# Converter formato de caminho
INPUT_PATH=$(pwd | sed 's/\\/\//g')
bash deploy.sh "$INPUT_PATH"
```

```powershell [PowerShell]
# Usar PowerShell para converter caminho
$INPUT_PATH = $PWD.Path -replace '\\', '/'
bash deploy.sh "$INPUT_PATH"
```

:::

**Melhor Prática**: No Windows, use Git Bash ou WSL para executar scripts de deploy.

## Problemas de Desempenho

### Velocidade Lenta de Build

**Problema**: Ao executar `pnpm build`, a velocidade é lenta, especialmente quando há muitas regras.

**Causa**: A ferramenta de build analisa arquivos de regras um a um (ver [`build.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/build.ts)), sem usar processamento paralelo.

**Solução**:

1. **Pule etapas desnecessárias**:
```bash
# Apenas construir, não validar
pnpm build

# Apenas validar, não construir
pnpm validate
```

2. **Limpe Cache**:
```bash
rm -rf node_modules/.cache
pnpm build
```

3. **Otimização de Hardware**:
   - Use armazenamento SSD
   - Garanta Node.js versão >= 20

### Upload Lento de Deploy

**Problema**: Ao fazer upload de tarball para Vercel, a velocidade é lenta.

**Causa**: Volume grande do projeto ou largura de banda de rede insuficiente.

**Solução**:

1. **Reduza Volume do Projeto**:
```bash
# Verificar tamanho de tarball
ls -lh .tgz

# Se exceder 50MB, considere otimizar
```

2. **Otimize Regras de Exclusão**:

Modifique [`deploy.sh:210`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L210), adicione exclusões:
```bash
tar -czf "$TARBALL" -C "$PROJECT_PATH" \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='*.log' \
  --exclude='.vscode' \
  --exclude='dist' \
  --exclude='build' \
  .
```

## Resumo da Lição

Problemas comuns do Agent Skills concentram-se principalmente em:

1. **Permissões de Rede**: No claude.ai, precisa configurar domínios permitidos para acesso
2. **Ativação de Habilidades**: Use palavras-chave claras para acionar habilidades
3. **Validação de Regras**: Siga o modelo `_template.md` para garantir formato correto
4. **Detecção de Framework**: Garanta que `package.json` contenha dependências corretas

Ao encontrar problemas, priorize visualizar mensagens de erro e lógica de tratamento de erros no código fonte (como `validate.ts` e `deploy.sh`).

## Obter Ajuda

Se os métodos acima não conseguirem resolver o problema:

1. **Ver Código Fonte**:
   - Script de deploy: [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh)
   - Script de validação: [`packages/react-best-practices-build/src/validate.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts)
   - Definição de habilidades: [`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md)

2. **GitHub Issues**: Submeta problema em [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/issues)

3. **Discussões na Comunidade**: Busque ajuda em fóruns técnicos relevantes (como Twitter, Discord)

## Próxima Lição

> Na próxima lição, aprenderemos **[Usar Melhores Práticas](../best-practices/)**.
>
> Você aprenderá:
> - Como escolher eficientemente palavras-chave para ativar habilidades
> - Técnicas de gerenciamento de contexto
> - Cenários de colaboração multi-habilidades
> - Sugestões de otimização de desempenho

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir localizações do código fonte</strong></summary>

> Atualizado em: 2026-01-25

| Funcionalidade        | Caminho do Arquivo                                                                                      | Número de Linha    |
| ------------------- | --------------------------------------------------------------------------------------------------------- | ----------------- |
| Tratamento de erros de rede | [`skills/claude.ai/vercel-deploy-claimable/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md#L100-L113) | 100-113           |
| Lógica de validação de regras | [`packages/react-best-practices-build/src/validate.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts) | 21-66             |
| Lógica de detecção de framework | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 12-156            |
| Tratamento de erros de deploy | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 224-239           |
| Tratamento de HTML estático | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 192-205           |

**Constantes Chave**:
- `DEPLOY_ENDPOINT = "https://claude-skills-deploy.vercel.com/api/deploy"`: Endpoint da API de deploy

**Funções Chave**:
- `detect_framework()`: Detecta tipo de framework a partir de package.json
- `validateRule()`: Valida formato completo de arquivo de regra
- `cleanup()`: Limpa arquivos temporários

**Códigos de Erro**:
- `VALIDATION_ERROR`: Falha de validação de regras
- `INPUT_INVALID`: Entrada inválida de deploy (não é diretório ou .tgz)
- `API_ERROR`: Erro retornado pela API de deploy

</details>
