---
title: "Solução de Problemas: Resolução de Problemas Comuns | opencode-agent-skills"
subtitle: "Solução de Problemas: Resolução de Problemas Comuns"
sidebarTitle: "O Que Fazer Quando Surgem Problemas"
description: "Aprenda métodos de solução de problemas do opencode-agent-skills. Abrange soluções para 9 tipos de problemas comuns, como falha no carregamento de habilidades, erros de execução de script, problemas de segurança de caminho, etc."
tags:
  - "troubleshooting"
  - "faq"
  - "resolução de problemas"
prerequisite: []
order: 1
---

# Solução de Problemas Comuns

::: info
Esta lição é adequada para todos os usuários que encontram problemas de uso, independentemente de já estarem familiarizados com as funções básicas do plugin. Se você encontrou problemas como falha no carregamento de habilidades, erros de execução de script, etc., ou deseja entender os métodos de solução de problemas comuns, esta lição ajudará você a localizar e resolver rapidamente esses problemas comuns.
:::

## O Que Você Aprenderá

- Localizar rapidamente a causa da falha no carregamento de habilidades
- Resolver erros de execução de script e problemas de permissão
- Entender o princípio das restrições de segurança de caminho
- Diagnosticar problemas de correspondência semântica e carregamento de modelo

## Habilidades Não Encontradas

### Sintoma
Ao chamar `get_available_skills`, retorna `No skills found matching your query`.

### Causas Possíveis
1. Habilidade não instalada nos caminhos de descoberta
2. Nome da habilidade escrito incorretamente
3. Formato do SKILL.md não em conformidade com as especificações

### Soluções

**Verifique se a habilidade está nos caminhos de descoberta**:

O plugin busca habilidades com as seguintes prioridades (a primeira correspondência é aplicada):

| Prioridade | Caminho | Tipo |
| --- | --- | --- |
| 1 | `.opencode/skills/` | Nível de projeto (OpenCode) |
| 2 | `.claude/skills/` | Nível de projeto (Claude) |
| 3 | `~/.config/opencode/skills/` | Nível de usuário (OpenCode) |
| 4 | `~/.claude/skills/` | Nível de usuário (Claude) |
| 5 | `~/.claude/plugins/cache/` | Cache de plugins |
| 6 | `~/.claude/plugins/marketplaces/` | Plugins instalados |

Comando de verificação:
```bash
# Verificar habilidades de nível de projeto
ls -la .opencode/skills/
ls -la .claude/skills/

# Verificar habilidades de nível de usuário
ls -la ~/.config/opencode/skills/
ls -la ~/.claude/skills/
```

**Verifique o formato do SKILL.md**:

O diretório da habilidade deve conter um arquivo `SKILL.md` e o formato deve estar em conformidade com o Anthropic Skills Spec:

```yaml
---
name: skill-name
description: Breve descrição da habilidade
license: MIT
allowed-tools:
  - read
  - write
metadata:
  author: your-name
---

Conteúdo da habilidade...
```

Itens obrigatórios:
- ✅ `name` deve ser letras minúsculas, números e hífens (como `git-helper`)
- ✅ `description` não pode estar vazio
- ✅ YAML frontmatter deve ser envolvido por `---`
- ✅ O conteúdo da habilidade deve seguir após o segundo `---`

**Use correspondência difusa**:

O plugin fornecerá sugestões de ortografia. Por exemplo:
```
No skills found matching "git-helper". Did you mean "git-helper-tool"?
```

Se você vir uma mensagem semelhante, use o nome sugerido para tentar novamente.

---

## Erro de Habilidade Inexistente

### Sintoma
Ao chamar `use_skill("skill-name")`, retorna `Skill "skill-name" not found`.

### Causas Possíveis
1. Nome da habilidade escrito incorretamente
2. Habilidade substituída por habilidade com mesmo nome (conflito de prioridade)
3. Diretório da habilidade sem SKILL.md ou formato incorreto

### Soluções

**Liste todas as habilidades disponíveis**:

```bash
Use a ferramenta get_available_skills para listar todas as habilidades
```

**Entenda as regras de substituição de prioridade**:

Se existirem habilidades com o mesmo nome em múltiplos caminhos, apenas a **prioridade mais alta** entrará em vigor. Por exemplo:
- Nível de projeto `.opencode/skills/git-helper/` → ✅ Ativo
- Nível de usuário `~/.config/opencode/skills/git-helper/` → ❌ Substituído

Verifique conflitos de mesmo nome:
```bash
# Buscar todas as habilidades com o mesmo nome
find .opencode/skills .claude/skills ~/.config/opencode/skills ~/.claude/skills \
  -name "git-helper" -type d
```

**Verifique se SKILL.md existe**:

```bash
# Entre no diretório da habilidade
cd .opencode/skills/git-helper/

# Verifique SKILL.md
ls -la SKILL.md

# Verifique se o formato YAML está correto
head -10 SKILL.md
```

---

## Falha na Execução do Script

### Sintoma
Ao chamar `run_skill_script`, retorna erro de script ou código de saída não zero.

### Causas Possíveis
1. Caminho do script incorreto
2. Script não tem permissão executável
3. O próprio script tem erro lógico

### Soluções

**Verifique se o script está na lista de scripts da habilidade**:

Ao carregar a habilidade, os scripts disponíveis serão listados:
```
Skill loaded. Available scripts:
- tools/build.sh
- scripts/setup.js
```

Se especificar um script inexistente ao chamar:
```
Script "build.sh" not found in skill "my-skill". Available scripts: tools/build.sh, scripts/setup.js
```

**Use o caminho relativo correto**:

O caminho do script é relativo ao diretório da habilidade, não inclua `/` no início:
- ✅ Correto: `tools/build.sh`
- ❌ Incorreto: `/tools/build.sh`

**Conceda permissão executável ao script**:

O plugin executa apenas arquivos com bit executável (`mode & 0o111`).

::: code-group

```bash [macOS/Linux]
# Conceder permissão executável
chmod +x .opencode/skills/my-skill/tools/build.sh

# Verificar permissão
ls -la .opencode/skills/my-skill/tools/build.sh
# A saída deve incluir: -rwxr-xr-x
```

```powershell [Windows]
# O Windows não usa bits de permissão Unix, certifique-se de que a extensão do script está associada corretamente
# Script PowerShell: .ps1
# Script Bash (via Git Bash): .sh
```

:::

**Depurar erro de execução do script**:

Se o script retornar um erro, o plugin exibirá o código de saída e a saída:
```
Script failed (exit 1): Error: Build failed at /path/to/script.js:42
```

Depuração manual:
```bash
# Entre no diretório da habilidade
cd .opencode/skills/my-skill/

# Execute o script diretamente para ver o erro detalhado
./tools/build.sh
```

---

## Erro de Caminho Inseguro

### Sintoma
Ao chamar `read_skill_file` ou `run_skill_script`, retorna erro de caminho inseguro.

### Causas Possíveis
1. Caminho contém `..` (traversal de diretório)
2. Caminho é um caminho absoluto
3. Caminho contém caracteres não padronizados

### Soluções

**Entenda as regras de segurança de caminho**:

O plugin proíbe o acesso a arquivos fora do diretório da habilidade para evitar ataques de traversal de diretório.

Exemplos de caminhos permitidos (relativos ao diretório da habilidade):
- ✅ `docs/guide.md`
- ✅ `config/settings.json`
- ✅ `tools/setup.sh`

Exemplos de caminhos proibidos:
- ❌ `../../../etc/passwd` (traversal de diretório)
- ❌ `/tmp/file.txt` (caminho absoluto)
- ❌ `./../other-skill/file.md` (traversal para outro diretório)

**Use caminhos relativos**:

Sempre use caminhos relativos ao diretório da habilidade, não comece com `/` ou `../`:
```bash
# Ler documento da habilidade
read_skill_file("my-skill", "docs/guide.md")

# Executar script da habilidade
run_skill_script("my-skill", "tools/build.sh")
```

**Listar arquivos disponíveis**:

Se não tiver certeza do nome do arquivo, primeiro veja a lista de arquivos da habilidade:
```
Após chamar use_skill, retornará:
Available files:
- docs/guide.md
- config/settings.json
- README.md
```

---

## Falha no Carregamento do Modelo de Embedding

### Sintoma
Função de correspondência semântica não funciona, log mostra `Model failed to load`.

### Causas Possíveis
1. Problema de conexão de rede (primeiro download do modelo)
2. Arquivo do modelo corrompido
3. Problema de permissão do diretório de cache

### Soluções

**Verifique a conexão de rede**:

Ao usar pela primeira vez, o plugin precisa baixar o modelo `all-MiniLM-L6-v2` do Hugging Face (aprox. 238MB). Certifique-se de que a rede pode acessar o Hugging Face.

**Limpar e baixar novamente o modelo**:

O modelo é armazenado em cache em `~/.cache/opencode-agent-skills/`:

```bash
# Excluir diretório de cache
rm -rf ~/.cache/opencode-agent-skills/

# Reiniciar o OpenCode, o plugin baixará automaticamente o modelo novamente
```

**Verifique as permissões do diretório de cache**:

```bash
# Ver diretório de cache
ls -la ~/.cache/opencode-agent-skills/

# Certificar-se de ter permissão de leitura e escrita
chmod -R 755 ~/.cache/opencode-agent-skills/
```

**Verificar manualmente o carregamento do modelo**:

Se o problema persistir, você pode ver o erro detalhado no log do plugin:
```
Verifique o log do OpenCode, pesquise "embedding" ou "model"
```

---

## Falha na Análise do SKILL.md

### Sintoma
O diretório da habilidade existe, mas não foi descoberto pelo plugin, ou retorna erro de formato ao carregar.

### Causas Possíveis
1. Erro de formato do YAML frontmatter
2. Campos obrigatórios ausentes
3. Valores de campos não atendem às regras de validação

### Soluções

**Verifique o formato YAML**:

A estrutura do SKILL.md deve ser a seguinte:

```markdown
---
name: my-skill
description: Descrição da habilidade
---

Conteúdo da habilidade...
```

Erros comuns:
- ❌ Falta o separador `---`
- ❌ Recuo YAML incorreto (YAML usa recuo de 2 espaços)
- ❌ Falta espaço após o dois-pontos

**Verifique campos obrigatórios**:

| Campo | Tipo | Obrigatório | Restrição |
| --- | --- | --- | --- |
| name | string | ✅ | Letras minúsculas, números e hífens, não vazio |
| description | string | ✅ | Não vazio |

**Teste a validade do YAML**:

Use ferramentas online para verificar o formato YAML:
- [YAML Lint](https://www.yamllint.com/)

Ou use ferramentas de linha de comando:
```bash
# Instalar yamllint
pip install yamllint

# Verificar arquivo
yamllint SKILL.md
```

**Verifique a área de conteúdo da habilidade**:

O conteúdo da habilidade deve seguir após o segundo `---`:

```markdown
---
name: my-skill
description: Descrição da habilidade
---

Aqui começa o conteúdo da habilidade, que será injetado no contexto do AI...
```

Se o conteúdo da habilidade estiver vazio, o plugin ignorará essa habilidade.

---

## Recomendação Automática Não Funciona

### Sintoma
Após enviar mensagem relevante, o AI não recebeu prompt de recomendação de habilidade.

### Causas Possíveis
1. Similaridade abaixo do limite (padrão 0.35)
2. Descrição da habilidade não detalhada o suficiente
3. Modelo não carregado

### Soluções

**Melhore a qualidade da descrição da habilidade**:

Quanto mais específica a descrição da habilidade, mais precisa a correspondência semântica.

| ❌ Descrição ruim | ✅ Boa descrição |
| --- | --- |
| "Ferramenta Git" | "Ajuda a executar operações Git: criar branch, commitar código, mesclar PR, resolver conflitos" |
| "Auxílio de teste" | "Gerar testes unitários, executar suíte de testes, analisar cobertura de testes, corrigir testes com falha" |

**Chamar habilidade manualmente**:

Se a recomendação automática não funcionar, você pode carregar manualmente:

```
Use a ferramenta use_skill("skill-name")
```

**Ajustar limite de similaridade** (avançado):

O limite padrão é 0.35, se achar que há poucas recomendações, você pode ajustar no código-fonte (`src/embeddings.ts:10`):

```typescript
export const SIMILARITY_THRESHOLD = 0.35; // Reduzir este valor aumentará as recomendações
```

::: warning
Modificar o código-fonte requer recompilar o plugin, não recomendado para usuários comuns.
:::

---

## Habilidade Perde Efeito Após Compressão de Contexto

### Sintoma
Após conversa longa, o AI parece "esquecer" as habilidades carregadas.

### Causas Possíveis
1. Versão do plugin menor que v0.1.0
2. Inicialização da sessão não concluída

### Soluções

**Verifique a versão do plugin**:

A funcionalidade de recuperação de compressão é suportada em v0.1.0+. Se o plugin foi instalado via npm, verifique a versão:

```bash
# Veja o package.json no diretório do plugin OpenCode
cat ~/.config/opencode/plugins/opencode-agent-skills/package.json | grep version
```

**Confirme que a inicialização da sessão foi concluída**:

O plugin injeta a lista de habilidades na primeira mensagem. Se a inicialização da sessão não for concluída, a recuperação de compressão pode falhar.

Sintomas:
- Não vê a lista de habilidades após a primeira mensagem
- O AI não conhece as habilidades disponíveis

**Reinicie a sessão**:

Se o problema persistir, exclua a sessão atual e crie uma nova:
```
No OpenCode, exclua a sessão e reinicie a conversa
```

---

## Falha na Pesquisa Recursiva de Script

### Sintoma
A habilidade contém scripts profundamente aninhados, mas não foi descoberta pelo plugin.

### Causas Possíveis
1. Profundidade recursiva excede 10 camadas
2. Script em diretório oculto (começa com `.`)
3. Script em diretório de dependência (como `node_modules`)

### Soluções

**Entenda as regras de pesquisa recursiva**:

Ao pesquisar scripts recursivamente, o plugin:
- Profundidade máxima: 10 camadas
- Ignora diretórios ocultos (nome do diretório começa com `.`): `.git`, `.vscode`, etc.
- Ignora diretórios de dependência: `node_modules`, `__pycache__`, `vendor`, `.venv`, `venv`, `.tox`, `.nox`

**Ajuste a posição do script**:

Se o script estiver em um diretório profundo, você pode:
- Mover para um diretório mais raso (como `tools/` em vez de `src/lib/utils/tools/`)
- Use soft link para a posição do script (sistema Unix)

```bash
# Criar soft link
ln -s ../../../scripts/build.sh tools/build.sh
```

**Listar scripts já descobertos**:

Após carregar a habilidade, o plugin retornará a lista de scripts. Se o script não estiver na lista, verifique:
1. Arquivo tem permissão executável
2. Diretório foi correspondido por regras de ignorar

---

## Resumo da Lição

Esta lição cobre 9 tipos de problemas comuns ao usar o plugin OpenCode Agent Skills:

| Tipo de Problema | Pontos Chave de Verificação |
| --- | --- |
| Habilidades não encontradas | Caminhos de descoberta, formato SKILL.md, ortografia |
| Habilidade inexistente | Correção do nome, substituição de prioridade, existência do arquivo |
| Falha na execução de script | Caminho do script, permissão executável, lógica do script |
| Caminho inseguro | Caminho relativo, sem `..`, sem caminho absoluto |
| Falha no carregamento do modelo | Conexão de rede, limpeza de cache, permissões de diretório |
| Falha na análise | Formato YAML, campos obrigatórios, conteúdo da habilidade |
| Recomendação automática não funciona | Qualidade da descrição, limite de similaridade, chamada manual |
| Perde efeito após compressão de contexto | Versão do plugin, inicialização da sessão |
| Falha na pesquisa recursiva de script | Limite de profundidade, regras de ignorar diretório, permissão executável |

---

## Próxima Lição

> Na próxima lição, aprenderemos **[Considerações de Segurança](../security-considerations/)**.
>
> Você aprenderá:
> - Design do mecanismo de segurança do plugin
> - Como escrever habilidades seguras
> - Princípio de verificação de caminho e controle de permissões
> - Melhores práticas de segurança

---

## Apêndice: Referência do Código-fonte

<details>
<summary><strong>Clique para expandir e ver localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Número da Linha |
| --- | --- | --- |
| Sugestão de correspondência difusa de habilidades | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L49-L59) | 49-59 |
| Tratamento de erro de habilidade inexistente | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L89-L97) | 89-97 |
| Tratamento de erro de script inexistente | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L167-L177) | 167-177 |
| Tratamento de erro de falha na execução do script | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L184-L195) | 184-195 |
| Verificação de segurança de caminho | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L130-L133) | 130-133 |
| Tratamento de erro de análise do SKILL.md | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L127-L152) | 127-152 |
| Erro de falha no carregamento do modelo | [`src/embeddings.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/embeddings.ts#L38-L40) | 38-40 |
| Algoritmo de correspondência difusa | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L88-L125) | 88-125 |

**Constantes chave**:
- `SIMILARITY_THRESHOLD = 0.35` (limite de similaridade): `src/embeddings.ts:10`
- `TOP_K = 5` (quantidade de habilidades mais similares a retornar): `src/embeddings.ts:11`

**Outros valores importantes**:
- `maxDepth = 10` (profundidade máxima recursiva de script, parâmetro padrão da função findScripts): `src/skills.ts:59`
- `0.4` (limite de correspondência difusa, condição de retorno da função findClosestMatch): `src/utils.ts:124`

**Funções chave**:
- `findClosestMatch()`: algoritmo de correspondência difusa, usado para gerar sugestões de ortografia
- `isPathSafe()`: verificação de segurança de caminho, evita traversal de diretório
- `ensureModel()`: garante que o modelo de embedding foi carregado
- `parseSkillFile()`: analisa o SKILL.md e valida o formato

</details>
