---
title: "Remover Habilidades: Remoção Interativa e Scriptada | openskills"
sidebarTitle: "Remover Habilidades Antigas com Segurança"
subtitle: "Remover Habilidades: Remoção Interativa e Scriptada"
description: "Aprenda duas formas de remoção de habilidades do OpenSkills: manage interativo e remove scriptado. Entenda cenários de uso, confirmação de localização e solução de problemas para limpar a biblioteca de habilidades com segurança."
tags:
  - "Gerenciamento de Habilidades"
  - "Uso de Comandos"
  - "CLI"
prerequisite:
  - "start-installation"
  - "start-first-skill"
  - "platforms-list-skills"
order: 6
---
# Remover Habilidades

## O Que Você Vai Aprender

- Usar `openskills manage` para remover várias habilidades interativamente
- Usar `openskills remove` para remover habilidades específicas via script
- Entender os cenários de uso das duas formas de remoção
- Confirmar se a remoção é de local project ou global
- Limpar habilidades desnecessárias com segurança

## O Seu Problema Atual

Com o aumento de habilidades instaladas, você pode enfrentar estes problemas:

- "Algumas habilidades não uso mais, quero excluir algumas, mas excluir uma por uma é trabalhoso demais"
- "Quero excluir habilidades automaticamente em scripts, o comando manage precisa de seleção interativa"
- "Não tenho certeza se a habilidade foi instalada em project ou global, quero confirmar antes de excluir"
- "Excluir várias habilidades, com medo de excluir acidentalmente as que ainda são usadas"

OpenSkills fornece duas formas de remoção para resolver esses problemas: **manage interativo** (adequado para seleção manual de várias habilidades) e **remove scriptado** (adequado para remoção precisa de habilidades específicas).

## Quando Usar

| Cenário | Método Recomendado | Comando |
|--- | --- | ---|
| Remover várias habilidades manualmente | Seleção interativa | `openskills manage` |
| Remoção automática em scripts ou CI/CD | Especificar nome da habilidade | `openskills remove <name>` |
| Apenas sabe o nome da habilidade, quer excluir rapidamente | Excluir diretamente | `openskills remove <name>` |
| Quer ver quais habilidades podem ser excluídas | Listar primeiro depois excluir | `openskills list` → `openskills manage` |

## Ideia Central

As duas formas de remoção do OpenSkills são adequadas para diferentes cenários:

### Remoção Interativa: `openskills manage`

- **Características**: Exibe todas as habilidades instaladas, permitindo marcar as que deseja excluir
- **Aplicação**: Gerenciar manualmente a biblioteca de habilidades, excluir várias de uma vez
- **Vantagens**: Não exclui acidentalmente, pode ver todas as opções com antecedência
- **Comportamento padrão**: **Não seleciona nenhuma habilidade** (evita exclusão acidental)

### Remoção Scriptada: `openskills remove <name>`

- **Características**: Exclui diretamente a habilidade especificada
- **Aplicação**: Scripts, automação, remoção precisa
- **Vantagens**: Rápido, sem interação
- **Risco**: Se o nome da habilidade estiver errado, dará erro, não excluirá outras habilidades

### Princípio de Remoção

Ambas as formas excluem **todo o diretório da habilidade** (incluindo SKILL.md, references/, scripts/, assets/ e todos os outros arquivos), sem deixar resíduos.

::: tip Remoção Irreversível
Excluir uma habilidade excluirá todo o diretório da habilidade, sem possibilidade de recuperação. Recomenda-se confirmar se a habilidade não é mais necessária antes de excluir, ou reinstalar se necessário.
:::

## Siga Comigo

### Passo 1: Remover várias habilidades interativamente

**Por que**
Quando você tem várias habilidades para excluir, a seleção interativa é mais segura e intuitiva

Execute o seguinte comando:

```bash
npx openskills manage
```

**O Que Você Deve Ver**

Primeiro você verá a lista de todas as habilidades instaladas (ordenadas por project/global):

```
? Select skills to remove:
❯◯ pdf                         (project)
  ◯ code-analyzer                (project)
  ◯ email-reader                 (global)
  ◯ git-tools                    (global)
```

- **Azul** `(project)`: habilidades de nível de projeto
- **Cinza** `(global)`: habilidades de nível global
- **Espaço**: marcar/desmarcar
- **Enter**: confirmar exclusão

Suponha que você selecionou `pdf` e `git-tools`, e depois pressionou Enter:

**O Que Você Deve Ver**

```
✅ Removed: pdf (project)
✅ Removed: git-tools (global)

✅ Removed 2 skill(s)
```

::: info Não Selecionado por Padrão
O comando manage **não seleciona nenhuma habilidade por padrão**, isso é para evitar exclusão acidental. Você precisa usar a tecla espaço para marcar manualmente as habilidades que deseja excluir.
:::

### Passo 2: Remover uma única habilidade via script

**Por que**
Quando você sabe o nome da habilidade e quer excluir rapidamente

Execute o seguinte comando:

```bash
npx openskills remove pdf
```

**O Que Você Deve Ver**

```
✅ Removed: pdf
   From: project (/Users/yourname/project/.claude/skills/pdf)
```

Se a habilidade não existir:

```
Error: Skill 'pdf' not found
```

O programa sairá e retornará código de erro 1 (adequado para scripts verificarem).

### Passo 3: Confirmar localização de exclusão

**Por que**
Confirmar a localização da habilidade (project vs global) antes de excluir, evitar exclusão acidental

Ao excluir uma habilidade, o comando exibirá a localização de exclusão:

```bash
# A exclusão via script exibirá a localização detalhada
npx openskills remove pdf
✅ Removed: pdf
   From: project (/Users/yourname/project/.claude/skills/pdf)

# A exclusão interativa também exibirá a localização de cada habilidade
npx openskills manage
# Após selecionar, pressione Enter
✅ Removed: pdf (project)
✅ Removed: git-tools (global)
```

**Regra de julgamento**:
- Se o caminho contém o diretório do projeto atual → `(project)`
- Se o caminho contém o diretório home → `(global)`

### Passo 4: Verificar após exclusão

**Por que**
Confirmar exclusão bem-sucedida, evitar omissões

Após excluir a habilidade, use o comando list para verificar:

```bash
npx openskills list
```

**O Que Você Deve Ver**

As habilidades excluídas não aparecerão mais na lista.

## Ponto de Verificação ✅

Confirme o seguinte:

- [ ] Executar `openskills manage` pode ver a lista de todas as habilidades
- [ ] Pode usar a tecla espaço para marcar/desmarcar habilidades
- [ ] Não seleciona nenhuma habilidade por padrão (evita exclusão acidental)
- [ ] Executar `openskills remove <name>` pode excluir a habilidade especificada
- [ ] Ao excluir, exibirá se é localização project ou global
- [ ] Após excluir, usar `openskills list` para verificar que a habilidade desapareceu

## Avisos de Problemas

### Problema Comum 1: Excluiu acidentalmente uma habilidade em uso

**Sintoma**: Descobriu que a habilidade ainda está em uso após a exclusão

**Solução**:

Basta reinstalar:

```bash
# Se foi instalado a partir do GitHub
npx openskills install anthropics/skills

# Se foi instalado a partir de um caminho local
npx openskills install ./path/to/skill
```

OpenSkills registra a fonte de instalação (no arquivo `.openskills.json`), ao reinstalar não perderá informações do caminho original.

### Problema Comum 2: Comando manage exibe "No skills installed"

**Sintoma**: Executar `openskills manage` indica que nenhuma habilidade está instalada

**Causa**: De fato não há habilidades no diretório atual

**Etapas de solução de problemas**:

1. Verifique se está no diretório correto do projeto
2. Confirme se instalou habilidades globais (`openskills list --global`)
3. Alterne para o diretório onde as habilidades foram instaladas e tente novamente

```bash
# Alterne para o diretório do projeto
cd /path/to/your/project

# Tente novamente
npx openskills manage
```

### Problema Comum 3: Comando remove exibe erro "Skill not found"

**Sintoma**: Executar `openskills remove <name>` indica que a habilidade não existe

**Causa**: Nome da habilidade escrito incorretamente, ou a habilidade já foi excluída

**Etapas de solução de problemas**:

1. Primeiro use o comando list para ver o nome correto da habilidade:

```bash
npx openskills list
```

2. Verifique a ortografia do nome da habilidade (atenção a maiúsculas/minúsculas e hífens)

3. Confirme se a habilidade é project ou global (procure em diferentes diretórios)

```bash
# Ver habilidades do projeto
ls -la .claude/skills/

# Ver habilidades globais
ls -la ~/.claude/skills/
```

### Problema Comum 4: Após excluir, a habilidade ainda está no AGENTS.md

**Sintoma**: Após excluir a habilidade, o AGENTS.md ainda tem referência a essa habilidade

**Causa**: Excluir a habilidade não atualiza automaticamente o AGENTS.md

**Solução**:

Execute novamente o comando sync:

```bash
npx openskills sync
```

O sync escaneará novamente as habilidades instaladas e atualizará o AGENTS.md, as habilidades excluídas serão automaticamente removidas da lista.

## Resumo da Lição

OpenSkills fornece duas formas de exclusão de habilidades:

### Remoção Interativa: `openskills manage`

- 🎯 **Cenário de aplicação**: Gerenciar manualmente a biblioteca de habilidades, excluir várias habilidades
- ✅ **Vantagens**: Intuitivo, sem exclusão acidental, pode visualizar antecipadamente
- ⚠️ **Atenção**: Não seleciona nenhuma habilidade por padrão, precisa marcar manualmente

### Remoção Scriptada: `openskills remove <name>`

- 🎯 **Cenário de aplicação**: Scripts, automação, remoção precisa
- ✅ **Vantagens**: Rápido, sem interação
- ⚠️ **Atenção**: Se o nome da habilidade estiver errado, dará erro

**Pontos Principais**:

1. Ambas as formas excluem o diretório inteiro da habilidade (irreversível)
2. Ao excluir, exibirá se é localização project ou global
3. Após excluir, use `openskills list` para verificar
4. Lembre-se de executar novamente `openskills sync` para atualizar o AGENTS.md

## Próxima Lição

> Na próxima lição aprenderemos **[Modo Universal: Ambiente Multi-Agent](../../advanced/universal-mode/)**.
>
> Você aprenderá:
> - Como usar a flag `--universal` para evitar conflitos com Claude Code
> - Gerenciamento unificado de habilidades em ambiente multi-agent
> - O papel do diretório `.agent/skills`

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Atualizado em: 2026-01-24

| Função | Caminho do Arquivo | Linha |
|--- | --- | ---|
| Implementação do comando manage | [`src/commands/manage.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/manage.ts) | 10-62 |
| Implementação do comando remove | [`src/commands/remove.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/remove.ts) | 8-21 |
| Encontrar todas as habilidades | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 30-64 |
| Encontrar uma habilidade específica | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 66-90 |

**Funções Principais**:
- `manageSkills()`: Remoção interativa de habilidades, usa inquirer checkbox para o usuário selecionar
- `removeSkill(skillName)`: Remoção scriptada de habilidade específica, sai com erro se não encontrar
- `findAllSkills()`: Percorre 4 diretórios de busca, coleta todas as habilidades
- `findSkill(skillName)`: Busca habilidade específica, retorna objeto Skill

**Constantes Principais**:
- Nenhuma (todos os caminhos e configurações são calculados dinamicamente)

**Lógica Principal**:

1. **Comando manage** (src/commands/manage.ts):
   - Chama `findAllSkills()` para obter todas as habilidades (linha 11)
   - Ordena por project/global (linhas 20-25)
   - Usa inquirer `checkbox` para o usuário selecionar (linhas 33-37)
   - Padrão `checked: false`, não seleciona nenhuma habilidade (linha 30)
   - Percorre as habilidades selecionadas, chama `rmSync` para excluir (linhas 45-52)

2. **Comando remove** (src/commands/remove.ts):
   - Chama `findSkill(skillName)` para buscar habilidade (linha 9)
   - Se não encontrar, exibe erro e `process.exit(1)` (linhas 12-14)
   - Chama `rmSync` para excluir o diretório inteiro da habilidade (linha 16)
   - Usa `homedir()` para determinar se é project ou global (linha 18)

3. **Operação de exclusão**:
   - Usa `rmSync(baseDir, { recursive: true, force: true })` para excluir o diretório inteiro da habilidade
   - `recursive: true`: exclui recursivamente todos os subarquivos e subdiretórios
   - `force: true`: ignora erros de arquivo inexistente

</details>
