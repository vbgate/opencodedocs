---
title: "Instalação: Plugin Agent Skills | opencode-agent-skills"
sidebarTitle: "Instalação em 5 minutos"
subtitle: "Instalação: Plugin Agent Skills | opencode-agent-skills"
description: "Aprenda três métodos de instalação do opencode-agent-skills. Inclui instalação básica, instalação de versão fixa e instalação para desenvolvimento local, aplicáveis a diferentes cenários de uso."
tags:
  - "Instalação"
  - "Plugin"
  - "Início Rápido"
prerequisite: []
order: 2
---

# Instalando o OpenCode Agent Skills

## O que você poderá fazer após este tutorial

- Instalar o plugin Agent Skills para o OpenCode de três maneiras diferentes
- Verificar se o plugin foi instalado corretamente
- Entender a diferença entre versões fixas e as mais recentes

## Sua situação atual

Você quer que o AI Agent aprenda a reutilizar skills, mas não sabe como habilitar essa funcionalidade no OpenCode. O sistema de plugins do OpenCode pode parecer um pouco complexo, e você teme cometer erros de configuração.

## Quando usar este método

**Use quando precisar que o AI Agent tenha as seguintes capacidades**:
- Reutilizar skills entre diferentes projetos (como padrões de código, templates de teste)
- Carregar a biblioteca de skills do Claude Code
- Fazer o AI seguir fluxos de trabalho específicos

## 🎒 Preparação antes de começar

::: warning Verificação prévia

Antes de começar, por favor confirme:

- Você tem o [OpenCode](https://opencode.ai/) v1.0.110 ou superior instalado
- Você pode acessar o arquivo de configuração `~/.config/opencode/opencode.json` (arquivo de configuração do OpenCode)

:::

## Conceito principal

O OpenCode Agent Skills é um plugin publicado via npm. A instalação é simples: declare o nome do plugin no arquivo de configuração, e o OpenCode irá baixá-lo e carregá-lo automaticamente na inicialização.

**Cenários de uso para os três métodos de instalação**:

| Método | Cenário de Uso | Prós e Contras |
| --- | --- | --- |
| **Instalação Básica** | Usa a versão mais recente a cada inicialização | ✅ Conveniente para atualizações automáticas<br>❌ Pode encontrar atualizações que quebram compatibilidade |
| **Versão Fixa** | Ambiente de produção que precisa de estabilidade | ✅ Versão controlada<br>❌ Requer atualização manual |
| **Desenvolvimento Local** | Personalizar o plugin ou contribuir com código | ✅ Modificações flexíveis<br>❌ Requer gerenciamento manual de dependências |

---

## Siga comigo

### Método 1: Instalação Básica (Recomendado)

Esta é a maneira mais simples. A cada inicialização do OpenCode, ele verificará e baixará a versão mais recente.

**Por quê**
Adequado para a maioria dos usuários, garantindo que você sempre use as funcionalidades mais recentes e correções de bugs.

**Passos**

1. Abra o arquivo de configuração do OpenCode

```bash
# macOS/Linux
nano ~/.config/opencode/opencode.json

# Windows (usando Bloco de Notas)
notepad %APPDATA%\opencode\opencode.json
```

2. Adicione o nome do plugin no arquivo de configuração

```json
{
  "plugin": ["opencode-agent-skills"]
}
```

Se o arquivo já tiver outros plugins, basta adicionar ao array `plugin`:

```json
{
  "plugin": ["other-plugin", "opencode-agent-skills"]
}
```

3. Salve o arquivo e reinicie o OpenCode

**Você deve ver**:
- O OpenCode reinicia, e nos logs de inicialização você vê o plugin carregado com sucesso
- Na conversa com a IA, você pode usar ferramentas como `get_available_skills`

### Método 2: Instalação de Versão Fixa (Adequada para Ambiente de Produção)

Se você deseja bloquear a versão do plugin e evitar atualizações automáticas inesperadas, use este método.

**Por quê**
Ambientes de produção geralmente precisam de controle de versão. Versões fixas garantem que a equipe use a mesma versão do plugin.

**Passos**

1. Abra o arquivo de configuração do OpenCode

```bash
# macOS/Linux
nano ~/.config/opencode/opencode.json
```

2. Adicione o nome do plugin com número de versão no arquivo de configuração

```json
{
  "plugin": ["opencode-agent-skills@0.6.4"]
}
```

3. Salve o arquivo e reinicie o OpenCode

**Você deve ver**:
- O OpenCode inicia usando a versão fixa v0.6.4
- O plugin é cacheado localmente, não precisa ser baixado novamente

::: tip Gerenciamento de Versão

Versões fixas do plugin são cacheadas localmente pelo OpenCode. Ao atualizar a versão, você precisa modificar o número da versão manualmente e reiniciar. Verifique a [versão mais recente](https://www.npmjs.com/package/opencode-agent-skills) para atualizações.

:::

### Método 3: Instalação de Desenvolvimento Local (Para Contribuidores)

Se você deseja personalizar o plugin ou participar do desenvolvimento, use este método.

**Por quê**
Durante o desenvolvimento, você pode ver imediatamente o efeito das modificações de código sem esperar a publicação no npm.

**Passos**

1. Clone o repositório para o diretório de configuração do OpenCode

```bash
git clone https://github.com/joshuadavidthomas/opencode-agent-skills ~/.config/opencode/opencode-agent-skills
```

2. Entre no diretório do projeto e instale as dependências

```bash
cd ~/.config/opencode/opencode-agent-skills
bun install
```

::: info Por que usar Bun

O projeto usa Bun como runtime e gerenciador de pacotes. De acordo com o campo `engines` do package.json, requer Bun >= 1.0.0.

:::

3. Crie um link simbólico para o plugin

```bash
mkdir -p ~/.config/opencode/plugin
ln -sf ~/.config/opencode/opencode-agent-skills/src/plugin.ts ~/.config/opencode/plugin/skills.ts
```

**Você deve ver**:
- `~/.config/opencode/plugin/skills.ts` aponta para seu código de plugin local
- Após modificar o código, reinicie o OpenCode para que as alterações entrem em vigor

---

## Checkpoint ✅

Após completar a instalação, use os seguintes métodos para verificar:

**Método 1: Verificar lista de ferramentas**

Pergunte à IA no OpenCode:

```
Por favor, liste todas as ferramentas disponíveis, veja se há ferramentas relacionadas a skills?
```

Você deve ver as seguintes ferramentas incluídas:
- `use_skill` - Carregar skill
- `read_skill_file` - Ler arquivo de skill
- `run_skill_script` - Executar script de skill
- `get_available_skills` - Obter lista de skills disponíveis

**Método 2: Chamar ferramenta**

```
Por favor, chame get_available_skills para ver quais skills estão disponíveis atualmente?
```

Você deve ver a lista de skills (pode estar vazia, mas a chamada da ferramenta foi bem-sucedida).

**Método 3: Verificar logs de inicialização**

Verifique os logs de inicialização do OpenCode, deve haver algo como:

```
[plugin] Loaded plugin: opencode-agent-skills
```

---

## Avisos de Problemas Comuns

### Problema 1: Ferramentas não aparecem após inicialização do OpenCode

**Possíveis causas**:
- Erro de sintaxe JSON no arquivo de configuração (vírgulas faltando, aspas, etc.)
- Versão do OpenCode muito antiga (requer >= v1.0.110)
- Nome do plugin digitado incorretamente

**Soluções**:
1. Use uma ferramenta de validação JSON para verificar a sintaxe do arquivo de configuração
2. Execute `opencode --version` para confirmar a versão
3. Confirme que o nome do plugin é `opencode-agent-skills` (atenção aos hífens)

### Problema 2: Versão fixa não atualiza após upgrade

**Causa**: Plugins de versão fixa são cacheados localmente. Após atualizar o número da versão, é necessário limpar o cache.

**Soluções**:
1. Modifique o número da versão no arquivo de configuração
2. Reinicie o OpenCode
3. Se ainda não funcionar, limpe o cache de plugins do OpenCode (localização depende do seu sistema)

### Problema 3: Modificações não entram em vigor após instalação de desenvolvimento local

**Causa**: Erro no link simbólico ou dependências do Bun não instaladas.

**Soluções**:
1. Verifique se o link simbólico está correto:
   ```bash
   ls -la ~/.config/opencode/plugin/skills.ts
   ```
   Deve apontar para `~/.config/opencode/opencode-agent-skills/src/plugin.ts`

2. Confirme que as dependências estão instaladas:
   ```bash
   cd ~/.config/opencode/opencode-agent-skills
   bun install
   ```

---

## Resumo da Lição

Nesta lição, aprendemos três métodos de instalação:

- **Instalação Básica**: Adicione `opencode-agent-skills` no arquivo de configuração, adequado para a maioria das pessoas
- **Instalação de Versão Fixa**: Adicione `opencode-agent-skills@versão`, adequado para ambientes de produção
- **Instalação de Desenvolvimento Local**: Clone o repositório e crie um link simbólico, adequado para desenvolvedores

Após a instalação, você pode verificar através da lista de ferramentas, chamada de ferramentas ou logs de inicialização.

---

## Próxima Lição

> Na próxima lição, aprenderemos **[Criando Sua Primeira Skill](../creating-your-first-skill/)**.
>
> Você aprenderá:
> - Estrutura de diretórios de skills
> - Formato YAML frontmatter do SKILL.md
> - Como escrever conteúdo de skills

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Linha |
| --- | --- | --- |
| Definição de entrada do plugin | [`package.json:18`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L18) | 18 |
| Arquivo principal do plugin | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts) | Todo o arquivo |
| Configuração de dependências | [`package.json:27-32`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L27-L32) | 27-32 |
| Requisitos de versão | [`package.json:39-41`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L39-L41) | 39-41 |

**Configurações-chave**:
- `main: "src/plugin.ts"`: Arquivo de entrada do plugin
- `engines.bun: ">=1.0.0"`: Requisito de versão do runtime

**Dependências-chave**:
- `@opencode-ai/plugin ^1.0.115`: SDK do plugin OpenCode
- `@huggingface/transformers ^3.8.1`: Modelo de correspondência semântica
- `zod ^4.1.13`: Validação de Schema
- `yaml ^2.8.2`: Análise YAML

</details>
