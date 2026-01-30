---
title: "Proteção de Segurança: Traversal de Caminho e Links Simbólicos | OpenSkills"
sidebarTitle: "Prevenir Traversal de Caminho"
subtitle: "Proteção de Segurança: Traversal de Caminho e Links Simbólicos | OpenSkills"
description: "Aprenda o mecanismo de proteção de segurança de três camadas do OpenSkills. Entenda proteção contra traversal de caminho, processamento seguro de links simbólicos, análise segura de YAML, garantindo a segurança na instalação e uso de skills."
tags:
  - "Segurança"
  - "Traversal de Caminho"
  - "Links Simbólicos"
  - "YAML"
prerequisite:
  - "advanced-ci-integration"
order: 7
---

# Segurança do OpenSkills

## O Que Você Vai Aprender

- Entender o mecanismo de proteção de segurança de três camadas do OpenSkills
- Conhecer o princípio e método de proteção contra ataques de traversal de caminho
- Dominar o processamento seguro de links simbólicos
- Reconhecer riscos de ReDoS na análise YAML e medidas de proteção

## Seu Problema Atual

Você pode ter ouvido o ditado "executar localmente é mais seguro", mas não sabe quais medidas de proteção de segurança específicas existem. Ou você se preocupa ao instalar skills:
- Os arquivos serão gravados no diretório do sistema?
- Links simbólicos trarão riscos de segurança?
- Haverá vulnerabilidades ao analisar o YAML do SKILL.md?

## Quando Usar Esta Técnica

Quando você precisa:
- Implantar OpenSkills em ambiente corporativo
- Auditar a segurança do OpenSkills
- Avaliar soluções de gerenciamento de skills do ponto de vista de segurança
- Resistir a revisão técnica da equipe de segurança

## Conceito Central

O design de segurança do OpenSkills segue três princípios:

::: info Proteção de Segurança de Três Camadas
1. **Validação de entrada** - Verificar toda entrada externa (caminhos, URLs, YAML)
2. **Execução isolada** - Garantir que as operações ocorram dentro do diretório esperado
3. **Análise segura** - Prevenir vulnerabilidades do analisador (ReDoS)
:::

Execução local + sem upload de dados + validação de entrada + isolamento de caminho = gerenciamento seguro de skills

## Proteção Contra Traversal de Caminho

### O Que É Ataque de Traversal de Caminho

**Traversal de caminho (Path Traversal)** refere-se a atacantes acessarem arquivos fora do diretório esperado usando sequências como `../`.

**Exemplo**: Sem proteção, atacantes podem tentar:
```bash
# Tentar instalar no diretório do sistema
openskills install malicious/skill --target ../../../etc/

# Tentar sobrescrever arquivos de configuração
openskills install malicious/skill --target ../../../../.ssh/
```

### Mecanismo de Proteção do OpenSkills

O OpenSkills usa a função `isPathInside` para verificar se o caminho de instalação está dentro do diretório de destino.

**Localização do Código Fonte**: [`src/commands/install.ts:71-78`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L71-L78)

```typescript
function isPathInside(targetPath: string, targetDir: string): boolean {
  const resolvedTargetPath = resolve(targetPath);
  const resolvedTargetDir = resolve(targetDir);
  const resolvedTargetDirWithSep = resolvedTargetDir.endsWith(sep)
    ? resolvedTargetDir
    : resolvedTargetDir + sep;
  return resolvedTargetPath.startsWith(resolvedTargetDirWithSep);
}
```

**Como Funciona**:
1. Usa `resolve()` para resolver todos os caminhos relativos como caminhos absolutos
2. Normaliza o diretório de destino, garantindo que termine com separador de caminho
3. Verifica se o caminho de destino começa com o diretório de destino

**Verificação Durante Instalação** ([`src/commands/install.ts:257-260`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L257-L260)):
```typescript
if (!isPathInside(targetPath, targetDir)) {
  console.error(chalk.red('Security error: Installation path outside target directory'));
  process.exit(1);
}
```

### Verificar Efeito da Proteção

**Cenário de Teste**: Tentar ataque de traversal de caminho

```bash
# Instalação normal (sucesso)
openskills install anthropics/skills

# Tentar usar ../ (falha)
openskills install malicious/skill --target ../../../etc/
# Security error: Installation path outside target directory
```

**Você Deve Ver**: Qualquer tentativa de sair do diretório de destino será rejeitada, exibindo erro de segurança.

## Segurança de Links Simbólicos

### Riscos de Links Simbólicos

**Link Simbólico (Symlink)** é um atalho que aponta para outro arquivo ou diretório. Se não for tratado corretamente, pode causar:

1. **Vazamento de informações** - Atacantes criam links simbólicos apontando para arquivos sensíveis
2. **Sobrescrita de arquivos** - Links simbólicos apontam para arquivos do sistema, que são sobrescritos pela operação de instalação
3. **Referência circular** - Links simbólicos apontam para si mesmos, causando recursão infinita

### Desreferenciação Durante Instalação

O OpenSkills usa `dereference: true` para desreferenciar links simbólicos ao copiar arquivos, copiando diretamente o arquivo de destino.

**Localização do Código Fonte**: [`src/commands/install.ts:262`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L262)

```typescript
cpSync(skillDir, targetPath, { recursive: true, dereference: true });
```

**Efeito**:
- Links simbólicos são substituídos por arquivos reais
- O link simbólico em si não é copiado
- Evita que arquivos apontados por links simbólicos sejam sobrescritos

### Verificação de Links Simbólicos ao Buscar Skills

O OpenSkills suporta skills na forma de links simbólicos, mas verifica se estão corrompidos.

**Localização do Código Fonte**: [`src/utils/skills.ts:10-25`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L10-L25)

```typescript
function isDirectoryOrSymlinkToDirectory(entry: Dirent, parentDir: string): boolean {
  if (entry.isDirectory()) {
    return true;
  }
  if (entry.isSymbolicLink()) {
    try {
      const fullPath = join(parentDir, entry.name);
      const stats = statSync(fullPath); // statSync segue symlinks
      return stats.isDirectory();
    } catch {
      // Link simbólico corrompido ou erro de permissão
      return false;
    }
  }
  return false;
}
```

**Recursos de Segurança**:
- Usa `statSync()` para seguir o link simbólico e verificar o destino
- Links simbólicos corrompidos são ignorados (bloco `catch`)
- Não causa falhas, tratamento silencioso

::: tip Casos de Uso
O suporte a links simbólicos permite que você:
- Use skills diretamente do repositório git (sem necessidade de cópia)
- Sincronize modificações durante desenvolvimento local
- Compartilhe biblioteca de skills entre múltiplos projetos
:::

## Segurança de Análise YAML

### Risco de ReDoS

**Negação de Serviço por Expressão Regular (ReDoS)** refere-se a entrada maliciosa causando tempo de correspondência exponencial de expressão regular, consumindo recursos da CPU.

O OpenSkills precisa analisar o frontmatter YAML do SKILL.md:
```yaml
---
name: skill-name
description: Skill description
---
```

### Proteção de Regex Não Greedy

O OpenSkills usa expressões regulares não greedy para evitar ReDoS.

**Localização do Código Fonte**: [`src/utils/yaml.ts:4`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts#L4)

```typescript
export function extractYamlField(content: string, field: string): string {
  const match = content.match(new RegExp(`^${field}:\\s*(.+?)$`, 'm'));
  return match ? match[1].trim() : '';
}
```

**Pontos-chave**:
- `+?` é um quantificador **não greedy**, correspondendo à menor possibilidade
- `^` e `$` fixam o início e o fim da linha
- Corresponde apenas a uma linha, evitando aninhamento complexo

**Exemplo Errado (correspondência greedy)**:
```typescript
// ❌ Perigoso: + corresponde de forma greedy, pode encontrar explosão de backtracking
new RegExp(`^${field}:\\s*(.+)$`, 'm')
```

**Exemplo Correto (correspondência não greedy)**:
```typescript
// ✅ Seguro: +? não greedy, para na primeira quebra de linha
new RegExp(`^${field}:\\s*(.+?)$`, 'm')
```

## Permissões de Arquivo e Verificação de Fonte

### Herdar Permissões do Sistema

O OpenSkills não gerencia permissões de arquivos, herdando diretamente o controle de permissões do sistema operacional:

- Arquivos pertencem ao mesmo usuário que executa o OpenSkills
- Permissões de diretório seguem as configurações de umask do sistema
- Gerenciamento de permissões é controlado uniformemente pelo sistema de arquivos

### Verificação de Fonte de Repositórios Privados

Ao instalar de repositórios git privados, o OpenSkills depende da verificação de chave SSH do git.

**Localização do Código Fonte**: [`src/commands/install.ts:167`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L167)

::: tip Recomendação
Certifique-se de que sua chave SSH está configurada corretamente e adicionada à lista de chaves autorizadas do servidor git.
:::

## Segurança de Execução Local

O OpenSkills é uma ferramenta puramente local, sem envolvimento de comunicação de rede (exceto clonagem de repositórios git):

### Sem Upload de Dados

| Operação | Fluxo de Dados |
|--- | ---|
| Instalar skill | Repositório Git → Local |
| Ler skill | Local → Saída Padrão |
| Sincronizar AGENTS.md | Local → Arquivo Local |
| Atualizar skill | Repositório Git → Local |

### Proteção de Privacidade

- Todos os arquivos de skills são armazenados localmente
- Agentes AI leem através do sistema de arquivos local
- Sem dependências na nuvem ou coleta de telemetria

::: info Diferença do Marketplace
O OpenSkills não depende do Anthropic Marketplace, executando-se inteiramente localmente.
:::

## Resumo da Lição

Três camadas de proteção de segurança do OpenSkills:

| Camada de Segurança | Medida de Proteção | Localização do Código |
|--- | --- | ---|
| **Proteção contra traversal de caminho** | `isPathInside()` verifica se o caminho está dentro do diretório de destino | `install.ts:71-78` |
| **Segurança de links simbólicos** | `dereference: true` desreferencia links simbólicos | `install.ts:262` |
| **Segurança de análise YAML** | Regex não greedy `+?` previne ReDoS | `yaml.ts:4` |

**Lembre-se**:
- Ataques de traversal de caminho acessam arquivos fora do diretório esperado através de sequências `../`
- Links simbólicos precisam ser desreferenciados ou verificados para evitar vazamento de informações e sobrescrita de arquivos
- Análise YAML usa regex não greedy para evitar ReDoS
- Execução local + sem upload de dados = maior segurança de privacidade

## Próxima Lição

> Na próxima lição aprenderemos **[Melhores Práticas](../best-practices/)**.
>
> Você vai aprender:
> - Melhores práticas de configuração de projeto
> - Soluções de colaboração em equipe para gerenciamento de skills
> - Dicas de uso em ambiente de múltiplos agentes
> - Armadilhas comuns e métodos de evitação

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código fonte</strong></summary>

> Última atualização: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Linhas |
|--- | --- | ---|
| Proteção contra traversal de caminho | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L71-L78) | 71-78 |
| Verificação de caminho de instalação | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L257-L260) | 257-260 |
| Desreferenciação de link simbólico | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L262) | 262 |
| Verificação de caminho de atualização | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L156-L172) | 156-172 |
| Verificação de links simbólicos | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L10-L25) | 10-25 |
| Segurança de análise YAML | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts#L4) | 4 |

**Funções-chave**:
- `isPathInside(targetPath, targetDir)`: Verifica se o caminho de destino está dentro do diretório de destino (previne traversal de caminho)
- `isDirectoryOrSymlinkToDirectory(entry, parentDir)`: Verifica se o diretório ou link simbólico aponta para um diretório
- `extractYamlField(content, field)`: Usa regex não greedy para extrair campos YAML (previne ReDoS)

**Registro de Alterações**:
- [`CHANGELOG.md:64-68`](https://github.com/numman-ali/openskills/blob/main/CHANGELOG.md#L64-L68) - Notas de atualização de segurança v1.5.0

</details>
