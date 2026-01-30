---
title: "Namespaces: Prioridade de Skills | opencode-agent-skills"
sidebarTitle: "Resolver Conflitos de Skills"
subtitle: "Namespaces: Prioridade de Skills | opencode-agent-skills"
description: "Aprenda o sistema de namespaces e as regras de prioridade de descoberta de skills. Domine 5 labels, 6 níveis de prioridade, use namespaces para distinguir skills com o mesmo nome e resolva problemas de conflito."
tags:
  - "Avançado"
  - "Namespaces"
  - "Gerenciamento de Skills"
prerequisite:
  - "start-what-is-opencode-agent-skills"
  - "platforms-skill-discovery-mechanism"
  - "platforms-listing-available-skills"
order: 3
---

# Namespaces e Prioridade de Skills

## O Que Você Vai Aprender

- Compreender o sistema de namespaces de skills para distinguir skills com o mesmo nome de diferentes fontes
- Dominar as regras de prioridade de descoberta de skills para prever qual skill será carregada
- Usar prefixos de namespace para especificar precisamente a origem de uma skill
- Resolver problemas de conflito de skills com o mesmo nome

## Seu Dilema Atual

À medida que o número de skills cresce, você pode encontrar estas confusões:

- **Conflito de skills com o mesmo nome**: Skills chamadas `git-helper` nos diretórios de projeto e do usuário, sem saber qual foi carregada
- **Confusão sobre origem das skills**: Não estar claro quais skills vêm do nível de projeto, usuário ou cache de plugins
- **Compreensão incorreta de comportamento de sobrescrita**: Modificar uma skill de nível de usuário e descobrir que não funciona, pois foi sobrescrita pela skill de nível de projeto
- **Dificuldade de controle preciso**: Querer forçar o uso de uma skill de uma fonte específica, mas não saber como especificar

Estes problemas surgem da falta de compreensão do sistema de namespaces e regras de prioridade de skills.

## Conceito Central

**Namespace** é o mecanismo que o OpenCode Agent Skills usa para distinguir skills com o mesmo nome de diferentes fontes. Cada skill tem um label identificando sua origem, e esses labels constituem o namespace da skill.

::: info Por que precisamos de namespaces?

Imagine que você tem duas skills com o mesmo nome:
- Nível de projeto `.opencode/skills/git-helper/` (personalizada para o projeto atual)
- Nível de usuário `~/.config/opencode/skills/git-helper/` (versão genérica)

Sem namespaces, o sistema não saberia qual usar. Com namespaces, você pode especificar claramente:
- `project:git-helper` - força o uso da versão de nível de projeto
- `user:git-helper` - força o uso da versão de nível de usuário
:::

**Regras de prioridade** garantem que, quando nenhum namespace é especificado, o sistema possa fazer uma escolha razoável. Skills de nível de projeto têm prioridade sobre skills de nível de usuário, permitindo que você customize comportamentos específicos no projeto sem afetar a configuração global.

## Fontes de Skills e Labels

O OpenCode Agent Skills suporta múltiplas fontes de skills, cada uma com seu label correspondente:

| Fonte | Label | Caminho | Descrição |
| --- | --- | --- | --- |
| **Nível de Projeto OpenCode** | `project` | `.opencode/skills/` | Skill específica para o projeto atual |
| **Nível de Projeto Claude** | `claude-project` | `.claude/skills/` | Skill de projeto compatível com Claude Code |
| **Nível de Usuário OpenCode** | `user` | `~/.config/opencode/skills/` | Skill genérica compartilhada entre todos os projetos |
| **Nível de Usuário Claude** | `claude-user` | `~/.claude/skills/` | Skill de usuário compatível com Claude Code |
| **Cache de Plugins Claude** | `claude-plugins` | `~/.claude/plugins/cache/` | Plugin Claude instalado |
| **Mercado de Plugins Claude** | `claude-plugins` | `~/.claude/plugins/marketplaces/` | Plugin Claude instalado do mercado |

::: tip Recomendação prática
- Configuração específica de projeto: coloque em `.opencode/skills/`
- Skills de ferramentas genéricas: coloque em `~/.config/opencode/skills/`
- Migração do Claude Code: não precisa mover, o sistema descobrirá automaticamente
:::

## Prioridade de Descoberta de Skills

Quando o sistema descobre skills, ele verifica os locais na seguinte ordem:

```
1. .opencode/skills/              (project)        ← maior prioridade
2. .claude/skills/                (claude-project)
3. ~/.config/opencode/skills/     (user)
4. ~/.claude/skills/              (claude-user)
5. ~/.claude/plugins/cache/       (claude-plugins)
6. ~/.claude/plugins/marketplaces/ (claude-plugins)  ← menor prioridade
```

**Regras chave**:
- **Primeira correspondência vence**: a primeira skill encontrada é preservada
- **Remoção de duplicatas de mesmo nome**: skills com o mesmo nome encontradas posteriormente são ignoradas (mas um aviso será emitido)
- **Prioridade de nível de projeto**: skills de nível de projeto sobrescrevem skills de nível de usuário

### Exemplo de Prioridade

Suponha que você tenha a seguinte distribuição de skills:

```
Diretório do projeto:
.opencode/skills/
  └── git-helper/              ← Versão A (customizada para o projeto)

Diretório do usuário:
~/.config/opencode/skills/
  └── git-helper/              ← Versão B (genérica)

Cache de plugins:
~/.claude/plugins/cache/xxx/skills/
  └── git-helper/              ← Versão C (plugin Claude)
```

Resultado: o sistema carrega a **Versão A** (`project:git-helper`), e as duas skills com o mesmo nome subsequentes são ignoradas.

## Usando Namespaces para Especificar Skills

Quando você chama `use_skill` ou outras ferramentas, pode usar o prefixo de namespace para especificar precisamente a origem da skill.

### Formato de Sintaxe

```
namespace:skill-name
```

Ou

```
skill-name  # não especifica namespace, usa prioridade padrão
```

### Lista de Namespaces

```
project:skill-name         # Skill OpenCode de nível de projeto
claude-project:skill-name  # Skill Claude de nível de projeto
user:skill-name            # Skill OpenCode de nível de usuário
claude-user:skill-name     # Skill Claude de nível de usuário
claude-plugins:skill-name  # Skill de plugin Claude
```

### Exemplos de Uso

**Cenário 1: Carregamento padrão (por prioridade)**

```
use_skill("git-helper")
```

- O sistema procura por prioridade, carregando a primeira skill correspondente encontrada
- Ou seja, `project:git-helper` (se existir)

**Cenário 2: Forçar uso de skill de nível de usuário**

```
use_skill("user:git-helper")
```

- Ignora as regras de prioridade, carregando diretamente a skill de nível de usuário
- Mesmo que a de nível de usuário seja sobrescrita pela de nível de projeto, ainda é acessível

**Cenário 3: Carregar skill de plugin Claude**

```
use_skill("claude-plugins:plugin-name")
```

- Carrega explicitamente uma skill de plugin Claude
- Adequado para cenários que requerem funcionalidades específicas de plugins

## Lógica de Correspondência de Namespaces

Ao usar o formato `namespace:skill-name`, a lógica de correspondência do sistema é a seguinte:

1. **Analisar entrada**: separar namespace e nome da skill
2. **Percorrer todas as skills**: procurar por skills correspondentes
3. **Condições de correspondência**:
   - Nome da skill corresponde
   - O campo `label` da skill é igual ao namespace especificado
   - Ou o campo personalizado `namespace` da skill é igual ao namespace especificado
4. **Retornar resultado**: a primeira skill que atende às condições

::: details Lógica de correspondência - código fonte

```typescript
export function resolveSkill(
  skillName: string,
  skillsByName: Map<string, Skill>
): Skill | null {
  if (skillName.includes(':')) {
    const [namespace, name] = skillName.split(':');
    for (const skill of skillsByName.values()) {
      if (skill.name === name &&
          (skill.label === namespace || skill.namespace === namespace)) {
        return skill;
      }
    }
    return null;
  }
  return skillsByName.get(skillName) || null;
}
```

:::

## Namespaces no Modo Superpowers

Quando você habilita o modo Superpowers, o sistema injeta uma explicação de prioridade de namespaces na inicialização da sessão:

```markdown
**Prioridade de namespace de skills:**
1. Projeto: `project:skill-name`
2. Projeto Claude: `claude-project:skill-name`
3. Usuário: `skill-name`
4. Usuário Claude: `claude-user:skill-name`
5. Marketplace: `claude-plugins:skill-name`

A primeira correspondência descoberta vence.
```

Isso garante que a IA siga as regras de prioridade corretas ao selecionar skills.

::: tip Como habilitar o modo Superpowers

Defina a variável de ambiente:

```bash
OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true opencode
```

:::

## Cenários de Uso Comuns

### Cenário 1: Personalização de Projeto Sobrescrevendo Skill Genérica

**Necessidade**: Seu projeto precisa de um fluxo de trabalho Git especial, mas já existe uma skill `git-helper` genérica no nível do usuário.

**Solução**:
1. Crie no diretório do projeto `.opencode/skills/git-helper/`
2. Configure o fluxo de trabalho Git específico do projeto
3. A chamada padrão `use_skill("git-helper")` usará automaticamente a versão de nível de projeto

**Verificação**:

```bash
## Verifique a lista de skills, observe as labels
get_available_skills("git-helper")
```

Exemplo de saída:
```
git-helper (project)
  Fluxo de trabalho Git específico do projeto
```

### Cenário 2: Troca Temporária para Skill Genérica

**Necessidade**: Uma tarefa específica precisa usar a skill genérica de nível de usuário, em vez da versão personalizada do projeto.

**Solução**:

```
use_skill("user:git-helper")
```

Especifica explicitamente o namespace `user:`, ignorando a sobrescrita de nível de projeto.

### Cenário 3: Carregar Skill de Plugin Claude

**Necessidade**: Você migrou do Claude Code e quer continuar usando uma skill de plugin Claude.

**Solução**:

1. Certifique-se de que o caminho de cache do plugin Claude esteja correto: `~/.claude/plugins/cache/`
2. Verifique a lista de skills:

```
get_available_skills()
```

3. Use o namespace para carregar:

```
use_skill("claude-plugins:plugin-name")
```

## Armadilhas a Evitar

### ❌ Erro 1: Não Saber que Skill de Mesmo Nome Foi Sobrescrita

**Sintoma**: Modificou a skill de nível de usuário, mas a IA ainda usa a versão antiga.

**Causa**: A skill de mesmo nome de nível de projeto tem prioridade maior, sobrescrevendo a skill de nível de usuário.

**Solução**:
1. Verifique se existe uma skill de mesmo nome no diretório do projeto
2. Use o namespace para especificar forçadamente: `use_skill("user:skill-name")`
3. Ou exclua a skill de mesmo nome de nível de projeto

### ❌ Erro 2: Erro de Digitação no Namespace

**Sintoma**: Usar `use_skill("project:git-helper")` retorna 404.

**Causa**: Erro de digitação no namespace (como escrever `projcet`) ou caso incorreto.

**Solução**:
1. Primeiro, verifique a lista de skills: `get_available_skills()`
2. Observe a label entre parênteses (como `(project)`)
3. Use o nome de namespace correto

### ❌ Erro 3: Confundir Label com Namespace Personalizado

**Sintoma**: Usar `use_skill("project:custom-skill")` não encontra a skill.

**Causa**: `project` é uma label, não um namespace personalizado. A menos que o campo `namespace` da skill seja explicitamente definido como `project`, não haverá correspondência.

**Solução**:
- Use diretamente o nome da skill: `use_skill("custom-skill")`
- Ou verifique o campo `label` da skill e use o namespace correto

## Resumo da Aula

O sistema de namespaces do OpenCode Agent Skills, através de labels e regras de prioridade, realiza o gerenciamento unificado de skills de múltiplas fontes:

- **5 tipos de labels de origem**: `project`, `claude-project`, `user`, `claude-user`, `claude-plugins`
- **6 níveis de prioridade**: Projeto > Projeto Claude > Usuário > Usuário Claude > Cache de Plugins > Mercado de Plugins
- **Primeira correspondência vence**: Skills de mesmo nome são carregadas por prioridade, subsequentes ignoradas
- **Prefixo de namespace**: Use o formato `namespace:skill-name` para especificar precisamente a origem da skill

Este mecanismo permite que você aproveite a conveniência da descoberta automática enquanto mantém controle preciso sobre a origem das skills quando necessário.

## Próxima Aula

> Na próxima aula aprenderemos sobre **[Mecanismo de Compactação e Recuperação de Contexto](../context-compaction-resilience/)**.
>
> Você vai aprender:
> - O impacto da compactação de contexto nas skills
> - Como os plugins recuperam automaticamente a lista de skills
> - Técnicas para manter skills disponíveis em sessões longas

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Linha |
| --- | --- | --- |
| Definição do tipo SkillLabel | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L30) | 30 |
| Lista de prioridade de descoberta | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L241-L246) | 241-246 |
| Lógica de remoção de duplicatas de mesmo nome | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L258-L259) | 258-259 |
| Tratamento de namespace em resolveSkill | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| Explicação de namespaces do Superpowers | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L18-L25) | 18-25 |

**Tipos-chave**:
- `SkillLabel`: enumeração de labels de origem de skills
- `Skill`: interface de metadados de skills (contém campos `namespace` e `label`)

**Funções-chave**:
- `discoverAllSkills()`: descobre skills por prioridade, remove duplicatas automaticamente
- `resolveSkill()`: resolve prefixos de namespace, busca skills
- `maybeInjectSuperpowersBootstrap()`: injeta explicação de prioridade de namespaces

**Lista de caminhos de descoberta** (ordem de prioridade):
1. `project` - `.opencode/skills/`
2. `claude-project` - `.claude/skills/`
3. `user` - `~/.config/opencode/skills/`
4. `claude-user` - `~/.claude/skills/`
5. `claude-plugins` - `~/.claude/plugins/cache/` e `~/.claude/plugins/marketplaces/`

</details>
