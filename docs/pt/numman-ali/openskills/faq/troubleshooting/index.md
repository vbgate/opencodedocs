---
title: "Solução de Problemas: Resolvendo Problemas Comuns do OpenSkills | openskills"
sidebarTitle: "O que fazer ao encontrar erros"
subtitle: "Solução de Problemas: Resolvendo Problemas Comuns do OpenSkills"
description: "Resolva erros comuns do OpenSkills. Este tutorial aborda falhas no Git clone, SKILL.md não encontrado, skill não localizada, erros de permissão, atualizações ignoradas e outros problemas, fornecendo etapas detalhadas de diagnóstico e correção para ajudá-lo a resolver rapidamente vários problemas de uso."
tags:
  - FAQ
  - Solução de Problemas
  - Resolução de Erros
prerequisite:
  - "start-quick-start"
  - "start-installation"
order: 2
---

# Solução de Problemas: Resolvendo Problemas Comuns do OpenSkills

## O que você aprenderá

- Diagnosticar e corrigir rapidamente problemas comuns no uso do OpenSkills
- Compreender as causas por trás das mensagens de erro
- Dominar técnicas de diagnóstico para problemas de Git clone, permissões e formatos de arquivo
- Saber quando é necessário reinstalar uma skill

## Sua situação atual

Você encontrou erros ao usar o OpenSkills e não sabe o que fazer:

```
Error: No SKILL.md files found in repository
```

Ou falhas no git clone, erros de permissão, formatos de arquivo incorretos... Todos esses problemas podem impedir o uso normal das skills.

## Quando consultar este tutorial

Quando você encontrar as seguintes situações:

- **Falha na instalação**: Erros ao instalar do GitHub ou de caminhos locais
- **Falha na leitura**: `openskills read` indica que a skill não foi encontrada
- **Falha na sincronização**: `openskills sync` indica que não há skills ou erro de formato de arquivo
- **Falha na atualização**: `openskills update` ignora algumas skills
- **Erro de permissão**: Indicação de acesso restrito ao caminho ou erro de segurança

## Conceito central

Os erros do OpenSkills são divididos principalmente em 4 categorias:

| Tipo de Erro | Causas Comuns | Abordagem de Solução |
| --- | --- | --- |
| **Relacionado ao Git** | Problemas de rede, configuração SSH, repositório inexistente | Verificar rede, configurar credenciais Git, validar endereço do repositório |
| **Relacionado a Arquivos** | SKILL.md ausente, erro de formato, caminho incorreto | Verificar existência do arquivo, validar formato YAML |
| **Relacionado a Permissões** | Permissões de diretório, travessia de caminho, links simbólicos | Verificar permissões de diretório, validar caminho de instalação |
| **Relacionado a Metadados** | Perda de metadados na atualização, mudança no caminho de origem | Reinstalar a skill para restaurar metadados |

**Técnicas de Diagnóstico**:
1. **Leia a mensagem de erro**: A saída em vermelho geralmente contém a causa específica
2. **Leia os avisos amarelos**: Geralmente são avisos e sugestões, como `Tip: For private repos...`
3. **Verifique a estrutura de diretórios**: Use `openskills list` para ver as skills instaladas
4. **Verifique a localização do código-fonte**: A mensagem de erro listará os caminhos de pesquisa (4 diretórios)

---

## Falha na Instalação

### Problema 1: Falha no Git clone

**Mensagem de erro**:
```
Failed to clone repository
fatal: repository '...' not found
Tip: For private repos, ensure git SSH keys or credentials are configured
```

**Possíveis causas**:

| Causa | Cenário |
| --- | --- |
| Repositório inexistente | Erro de digitação em owner/repo |
| Repositório privado | Chave SSH ou credenciais Git não configuradas |
| Problema de rede | Impossibilidade de acessar o GitHub |

**Soluções**:

1. **Valide o endereço do repositório**:
   ```bash
   # Acesse a URL do repositório no navegador
   https://github.com/owner/repo
   ```

2. **Verifique a configuração do Git** (repositórios privados):
   ```bash
   # Verifique a configuração SSH
   ssh -T git@github.com

   # Configure as credenciais Git
   git config --global credential.helper store
   ```

3. **Teste o clone**:
   ```bash
   git clone https://github.com/owner/repo.git
   ```

**Você deverá ver**:
- O repositório clonado com sucesso no diretório local

---

### Problema 2: SKILL.md não encontrado

**Mensagem de erro**:
```
Error: No SKILL.md files found in repository
Error: No valid SKILL.md files found
```

**Possíveis causas**:

| Causa | Descrição |
| --- | --- |
| Repositório sem SKILL.md | O repositório não é um repositório de skills |
| SKILL.md sem frontmatter | Falta metadados YAML |
| Formato SKILL.md incorreto | Erro de sintaxe YAML |

**Soluções**:

1. **Verifique a estrutura do repositório**:
   ```bash
   # Veja o diretório raiz
   ls -la

   # Verifique se existe SKILL.md
   find . -name "SKILL.md"
   ```

2. **Valide o formato do SKILL.md**:
   ```markdown
   ---
   name: Nome da Skill
   description: Descrição da skill
   ---

   Conteúdo da skill...
   ```

   **Obrigatório**:
   - Deve ter YAML frontmatter delimitado por `---` no início
   - Deve conter os campos `name` e `description`

3. **Veja o exemplo oficial**:
   ```bash
   git clone https://github.com/anthropics/skills.git
   cd skills
   ls -la
   ```

**Você deverá ver**:
- O repositório contém um ou mais arquivos `SKILL.md`
- Cada SKILL.md começa com YAML frontmatter

---

### Problema 3: Caminho não existe ou não é um diretório

**Mensagem de erro**:
```
Error: Path does not exist: /path/to/skill
Error: Path must be a directory
```

**Possíveis causas**:

| Causa | Descrição |
| --- | --- |
| Erro de digitação no caminho | Caminho incorreto inserido |
| Caminho aponta para arquivo | Deve ser um diretório, não um arquivo |
| Caminho não expandido | Ao usar `~`, é necessário expandir |

**Soluções**:

1. **Valide a existência do caminho**:
   ```bash
   # Verifique o caminho
   ls -la /path/to/skill

   # Verifique se é um diretório
   file /path/to/skill
   ```

2. **Use caminho absoluto**:
   ```bash
   # Obtenha o caminho absoluto
   realpath /path/to/skill

   # Use o caminho absoluto na instalação
   openskills install /absolute/path/to/skill
   ```

3. **Use caminho relativo**:
   ```bash
   # No diretório do projeto
   openskills install ./skills/my-skill
   ```

**Você deverá ver**:
- O caminho existe e é um diretório
- O diretório contém o arquivo `SKILL.md`

---

### Problema 4: SKILL.md inválido

**Mensagem de erro**:
```
Error: Invalid SKILL.md (missing YAML frontmatter)
```

**Possíveis causas**:

| Causa | Descrição |
| --- | --- |
| Campos obrigatórios ausentes | Deve ter `name` e `description` |
| Erro de sintaxe YAML | Problemas com dois-pontos, aspas, etc. |

**Soluções**:

1. **Verifique o YAML frontmatter**:
   ```markdown
   ---              ← Delimitador de início
   name: my-skill   ← Obrigatório
   description: Descrição da skill  ← Obrigatório
   ---              ← Delimitador de fim
   ```

2. **Use ferramentas de validação YAML online**:
   - Acesse YAML Lint ou ferramentas similares para validar a sintaxe

3. **Consulte o exemplo oficial**:
   ```bash
   openskills install anthropics/skills
   cat .claude/skills/*/SKILL.md | head -20
   ```

**Você deverá ver**:
- SKILL.md começa com YAML frontmatter correto
- Contém os campos `name` e `description`

---

### Problema 5: Erro de segurança de travessia de caminho

**Mensagem de erro**:
```
Security error: Installation path outside target directory
```

**Possíveis causas**:

| Causa | Descrição |
| --- | --- |
| Nome da skill contém `..` | Tentativa de acessar caminho fora do diretório de destino |
| Link simbólico aponta para fora | Symlink aponta para fora do diretório de destino |
| Skill maliciosa | Skill tenta contornar restrições de segurança |

**Soluções**:

1. **Verifique o nome da skill**:
   - Certifique-se de que o nome da skill não contém `..`, `/` ou caracteres especiais

2. **Verifique os links simbólicos**:
   ```bash
   # Veja os links simbólicos no diretório da skill
   find .claude/skills/skill-name -type l

   # Veja o destino do link simbólico
   ls -la .claude/skills/skill-name
   ```

3. **Use skills seguras**:
   - Instale skills apenas de fontes confiáveis
   - Revise o código da skill antes de instalar

**Você deverá ver**:
- O nome da skill contém apenas letras, números e hífens
- Não há links simbólicos apontando para fora

---

## Falha na Leitura

### Problema 6: Skill não encontrada

**Mensagem de erro**:
```
Error: Skill(s) not found: my-skill

Searched:
  .agent/skills/ (project universal)
  ~/.agent/skills/ (global universal)
  .claude/skills/ (project)
  ~/.claude/skills/ (global)

Install skills: npx openskills install owner/repo
```

**Possíveis causas**:

| Causa | Descrição |
| --- | --- |
| Skill não instalada | A skill não está instalada em nenhum diretório |
| Erro de digitação no nome | Nome não corresponde |
| Instalada em outro local | Skill instalada em diretório não padrão |

**Soluções**:

1. **Veja as skills instaladas**:
   ```bash
   openskills list
   ```

2. **Verifique o nome da skill**:
   - Compare com a saída de `openskills list`
   - Certifique-se de que o nome corresponde exatamente (diferencia maiúsculas/minúsculas)

3. **Instale a skill ausente**:
   ```bash
   openskills install owner/repo
   ```

4. **Pesquise em todos os diretórios**:
   ```bash
   # Verifique os 4 diretórios de skills
   ls -la .agent/skills/
   ls -la ~/.agent/skills/
   ls -la .claude/skills/
   ls -la ~/.claude/skills/
   ```

**Você deverá ver**:
- `openskills list` mostra a skill desejada
- A skill existe em um dos 4 diretórios

---

### Problema 7: Nenhum nome de skill fornecido

**Mensagem de erro**:
```
Error: No skill names provided
```

**Possíveis causas**:

| Causa | Descrição |
| --- | --- |
| Esqueceu de passar parâmetro | `openskills read` sem parâmetros |
| String vazia | String vazia passada |

**Soluções**:

1. **Forneça o nome da skill**:
   ```bash
   # Skill única
   openskills read my-skill

   # Múltiplas skills (separadas por vírgula)
   openskills read skill1,skill2,skill3
   ```

2. **Veja as skills disponíveis primeiro**:
   ```bash
   openskills list
   ```

**Você deverá ver**:
- Conteúdo da skill lido com sucesso para a saída padrão

---

## Falha na Sincronização

### Problema 8: Arquivo de saída não é Markdown

**Mensagem de erro**:
```
Error: Output file must be a markdown file (.md)
```

**Possíveis causas**:

| Causa | Descrição |
| --- | --- |
| Arquivo de saída não é .md | Especificado formato .txt, .json, etc. |
| Parâmetro --output incorreto | Caminho não termina com .md |

**Soluções**:

1. **Use arquivo .md**:
   ```bash
   # Correto
   openskills sync -o AGENTS.md
   openskills sync -o custom.md

   # Incorreto
   openskills sync -o AGENTS.txt
   openskills sync -o AGENTS
   ```

2. **Caminho de saída personalizado**:
   ```bash
   # Saída para subdiretório
   openskills sync -o .ruler/AGENTS.md
   openskills sync -o docs/agents.md
   ```

**Você deverá ver**:
- Arquivo .md gerado com sucesso
- Arquivo contém seção XML da skill

---

### Problema 9: Nenhuma skill instalada

**Mensagem de erro**:
```
No skills installed. Install skills first:
  npx openskills install anthropics/skills --project
```

**Possíveis causas**:

| Causa | Descrição |
| --- | --- |
| Nunca instalou skills | Primeiro uso do OpenSkills |
| Diretório de skills deletado | Arquivos de skills deletados manualmente |

**Soluções**:

1. **Instale skills**:
   ```bash
   # Instale skills oficiais
   openskills install anthropics/skills

   # Instale de outro repositório
   openskills install owner/repo
   ```

2. **Valide a instalação**:
   ```bash
   openskills list
   ```

**Você deverá ver**:
- `openskills list` mostra pelo menos uma skill
- Sincronização bem-sucedida

---

## Falha na Atualização

### Problema 10: Sem metadados de origem

**Mensagem de erro**:
```
Skipped: my-skill (no source metadata; re-install once to enable updates)
```

**Possíveis causas**:

| Causa | Descrição |
| --- | --- |
| Instalação de versão antiga | Skill instalada antes da funcionalidade de metadados |
| Cópia manual | Diretório de skill copiado diretamente, não instalado via OpenSkills |
| Arquivo de metadados corrompido | `.openskills.json` corrompido ou perdido |

**Soluções**:

1. **Reinstale a skill**:
   ```bash
   # Delete a skill antiga
   openskills remove my-skill

   # Reinstale
   openskills install owner/repo
   ```

2. **Verifique o arquivo de metadados**:
   ```bash
   # Veja os metadados da skill
   cat .claude/skills/my-skill/.openskills.json
   ```

3. **Preserve a skill mas adicione metadados**:
   - Crie manualmente `.openskills.json` (não recomendado)
   - Reinstalar é mais simples e confiável

**Você deverá ver**:
- Atualização bem-sucedida, sem avisos de ignorado

---

### Problema 11: Fonte local ausente

**Mensagem de erro**:
```
Skipped: my-skill (local source missing)
```

**Possíveis causas**:

| Causa | Descrição |
| --- | --- |
| Caminho local movido | Localização do diretório de origem alterada |
| Caminho local deletado | Diretório de origem não existe |
| Caminho não expandido | Uso de `~` mas metadados armazenaram caminho expandido |

**Soluções**:

1. **Verifique o caminho local nos metadados**:
   ```bash
   cat .claude/skills/my-skill/.openskills.json
   ```

2. **Restaure o diretório de origem ou atualize os metadados**:
   ```bash
   # Se o diretório de origem foi movido
   openskills remove my-skill
   openskills install /new/path/to/skill

   # Ou edite manualmente os metadados (não recomendado)
   vi .claude/skills/my-skill/.openskills.json
   ```

**Você deverá ver**:
- Caminho de origem local existe e contém `SKILL.md`

---

### Problema 12: SKILL.md não encontrado no repositório

**Mensagem de erro**:
```
SKILL.md missing for my-skill
Skipped: my-skill (SKILL.md not found in repo at subpath)
```

**Possíveis causas**:

| Causa | Descrição |
| --- | --- |
| Mudança na estrutura do repositório | Subcaminho ou nome da skill alterado |
| Skill deletada | Repositório não contém mais essa skill |
| Subcaminho incorreto | Subcaminho registrado nos metadados está incorreto |

**Soluções**:

1. **Acesse o repositório para ver a estrutura**:
   ```bash
   # Clone o repositório para verificar
   git clone https://github.com/owner/repo.git
   cd repo
   ls -la
   find . -name "SKILL.md"
   ```

2. **Reinstale a skill**:
   ```bash
   openskills remove my-skill
   openskills install owner/repo/subpath
   ```

3. **Verifique o histórico de atualizações do repositório**:
   - Veja o histórico de commits no GitHub
   - Procure registros de movimentação ou exclusão da skill

**Você deverá ver**:
- Atualização bem-sucedida
- SKILL.md existe no subcaminho registrado

---

## Problemas de Permissão

### Problema 13: Permissão de diretório restrita

**Sintomas**:

| Operação | Sintoma |
| --- | --- |
| Instalação falha | Indicação de erro de permissão |
| Remoção falha | Indicação de incapacidade de deletar arquivo |
| Leitura falha | Indicação de acesso restrito ao arquivo |

**Possíveis causas**:

| Causa | Descrição |
| --- | --- |
| Permissões de diretório insuficientes | Usuário sem permissão de escrita |
| Permissões de arquivo insuficientes | Arquivo somente leitura |
| Proteção do sistema | Restrições do macOS SIP, Windows UAC |

**Soluções**:

1. **Verifique as permissões do diretório**:
   ```bash
   # Veja as permissões
   ls -la .claude/skills/

   # Modifique as permissões (use com cautela)
   chmod -R 755 .claude/skills/
   ```

2. **Use sudo (não recomendado)**:
   ```bash
   # Último recurso
   sudo openskills install owner/repo
   ```

3. **Verifique a proteção do sistema**:
   ```bash
   # macOS: verifique o status do SIP
   csrutil status

   # Para desabilitar SIP (requer modo de recuperação)
   # Não recomendado, use apenas quando necessário
   ```

**Você deverá ver**:
- Leitura e escrita normais de diretórios e arquivos

---

## Problemas de Link Simbólico

### Problema 14: Link simbólico quebrado

**Sintomas**:

| Sintoma | Descrição |
| --- | --- |
| Skill ignorada ao listar | `openskills list` não mostra a skill |
| Falha na leitura | Indicação de arquivo inexistente |
| Falha na atualização | Caminho de origem inválido |

**Possíveis causas**:

| Causa | Descrição |
| --- | --- |
| Diretório de destino deletado | Link simbólico aponta para caminho inexistente |
| Link simbólico corrompido | Arquivo de link em si está corrompido |
| Link entre dispositivos | Alguns sistemas não suportam links simbólicos entre dispositivos |

**Soluções**:

1. **Verifique os links simbólicos**:
   ```bash
   # Encontre todos os links simbólicos
   find .claude/skills -type l

   # Veja o destino do link
   ls -la .claude/skills/my-skill

   # Teste o link
   readlink .claude/skills/my-skill
   ```

2. **Delete o link simbólico quebrado**:
   ```bash
   openskills remove my-skill
   ```

3. **Reinstale**:
   ```bash
   openskills install owner/repo
   ```

**Você deverá ver**:
- Nenhum link simbólico quebrado
- Skill exibida e lida normalmente

---

## Avisos Importantes

::: warning Erros Comuns de Operação

**❌ Não faça isso**:

- **Copiar diretório de skill diretamente** → Causará perda de metadados, falha na atualização
- **Editar manualmente `.openskills.json`** → Fácil de corromper o formato, causando falha na atualização
- **Usar sudo para instalar skills** → Criará arquivos de propriedade do root, operações subsequentes podem precisar de sudo
- **Deletar `.openskills.json`** → Causará ignorada da skill durante atualização

**✅ Faça isso**:

- Instale via `openskills install` → Cria metadados automaticamente
- Delete via `openskills remove` → Limpa arquivos corretamente
- Atualize via `openskills update` → Atualiza automaticamente da origem
- Verifique via `openskills list` → Confirma o status da skill

:::

::: tip Técnicas de Diagnóstico

1. **Comece simples**: Execute `openskills list` primeiro para confirmar o status
2. **Leia a mensagem de erro completa**: Dicas amarelas geralmente contêm sugestões de solução
3. **Verifique a estrutura de diretórios**: Use `ls -la` para ver arquivos e permissões
4. **Valide a localização do código-fonte**: A mensagem de erro listará 4 diretórios de pesquisa
5. **Use -y para pular interação**: Use a flag `-y` em CI/CD ou scripts

:::

---

## Resumo da Lição

Nesta lição, você aprendeu a diagnosticar e corrigir problemas comuns do OpenSkills:

| Tipo de Problema | Solução Principal |
| --- | --- |
| Falha no Git clone | Verificar rede, configurar credenciais, validar endereço do repositório |
| SKILL.md não encontrado | Verificar estrutura do repositório, validar formato YAML |
| Falha na leitura | Use `openskills list` para verificar o status da skill |
| Falha na atualização | Reinstalar a skill para restaurar metadados |
| Problema de permissão | Verificar permissões de diretório, evitar usar sudo |

**Lembre-se**:
- Mensagens de erro geralmente contêm dicas claras
- Reinstalar é o método mais simples para resolver problemas de metadados
- Instale skills apenas de fontes confiáveis

## Próximos Passos

- **Consulte [Perguntas Frequentes (FAQ)](../faq/)** → Mais respostas para dúvidas
- **Aprenda [Melhores Práticas](../../advanced/best-practices/)** → Evite erros comuns
- **Explore [Notas de Segurança](../../advanced/security/)** → Entenda os mecanismos de segurança

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Última atualização: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Tratamento de falha no Git clone | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L162-L168) | 162-168 |
| Erro de caminho inexistente | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L205-L207) | 205-207 |
| Erro de não é diretório | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L210-L213) | 210-213 |
| SKILL.md inválido | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L241-L243) | 241-243 |
| Erro de segurança de travessia de caminho | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L256-L259) | 256-259 |
| SKILL.md não encontrado | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L378-L380) | 378-380 |
| Nenhum nome de skill fornecido | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts#L10-L12) | 10-12 |
| Skill não encontrada | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts#L26-L34) | 26-34 |
| Arquivo de saída não é Markdown | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L23-L25) | 23-25 |
| Nenhuma skill instalada | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L40-L43) | 40-43 |
| Ignorado sem metadados de origem | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L57-L61) | 57-61 |
| Fonte local ausente | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L66-L71) | 66-71 |
| SKILL.md não encontrado no repositório | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L102-L107) | 102-107 |

**Funções Principais**:
- `hasValidFrontmatter(content)`: Valida se SKILL.md tem YAML frontmatter válido
- `isPathInside(targetPath, targetDir)`: Valida se o caminho está dentro do diretório de destino (verificação de segurança)
- `findSkill(name)`: Busca skill por prioridade nos 4 diretórios
- `readSkillMetadata(path)`: Lê metadados da origem de instalação da skill

**Constantes Principais**:
- Ordem de diretórios de pesquisa (`src/utils/skills.ts`):
  1. `.agent/skills/` (project universal)
  2. `~/.agent/skills/` (global universal)
  3. `.claude/skills/` (project)
  4. `~/.claude/skills/` (global)

</details>
