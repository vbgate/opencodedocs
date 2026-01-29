---
title: "Inicialização: Configuração Inicial do Projeto | opencode-supermemory"
sidebarTitle: "Inicialização"
subtitle: "Inicialização do Projeto: Criando a Primeira Impressão"
description: "Aprenda a usar /supermemory-init para varredura do código, extração de arquitetura e armazenamento na memória persistente entre sessões."
tags:
  - "Inicialização"
  - "Geração de Memória"
  - "Fluxo de Trabalho"
prerequisite:
  - "start-getting-started"
order: 2
---

# Inicialização do Projeto: Criando a Primeira Impressão

## O Que Você Poderá Fazer Após Concluir

- **Familiarizar-se com o projeto em um clique**: Permita que o Agent explore e compreenda todo o código como um novo funcionário.
- **Estabelecer memória de longo prazo**: Extraia automaticamente a stack tecnológica, padrões de arquitetura e convenções de código do projeto, armazenando-os no Supermemory.
- **Eliminar explicações repetidas**: Nunca mais precise repetir "usamos Bun" ou "todos os componentes devem ter testes" no início de cada sessão.

## O Seu Problema Atual

Você já enfrentou estas situações:

- **Trabalho repetitivo**: Cada nova sessão exige que você gaste muito tempo explicando as informações básicas do projeto ao Agent.
- **Esquecimento de contexto**: O Agent frequentemente esquece a estrutura de diretórios específica do projeto e cria arquivos no lugar errado.
- **Inconsistência de padrões**: O código gerado pelo Agent oscila em estilo, às vezes usando `interface`, outras vezes `type`.

## Quando Usar Esta Técnica

- **Após instalar o plugin**: Este é o primeiro passo ao usar opencode-supermemory.
- **Ao assumir um novo projeto**: Construa rapidamente a base de memória desse projeto.
- **Após refatorações importantes**: Quando a arquitetura do projeto mudar e você precisar atualizar o conhecimento do Agent.

## 🎒 Preparação Antes de Começar

::: warning Verificação Prévia
Certifique-se de que você completou as etapas de instalação e configuração em [Início Rápido](./../getting-started/index.md) e que o `SUPERMEMORY_API_KEY` está configurado corretamente.
:::

## Ideia Central

O comando `/supermemory-init` não é essencialmente um programa binário, mas sim um **Prompt cuidadosamente projetado**.

Quando você executa este comando, ele envia um "guia de onboarding" detalhado ao Agent, instruindo-o a:

1.  **Investigação profunda**: Ler ativamente `README.md`, `package.json`, histórico de commits do Git, etc.
2.  **Análise estruturada**: Identificar a stack tecnológica, padrões de arquitetura e convenções implícitas do projeto.
3.  **Armazenamento persistente**: Usar a ferramenta `supermemory` para armazenar essas percepções no banco de dados na nuvem.

::: info Escopo da Memória
O processo de inicialização distingue dois tipos de memória:
- **Project Scope**: Aplicável apenas ao projeto atual (ex: comandos de build, estrutura de diretórios).
- **User Scope**: Aplicável a todos os seus projetos (ex: seu estilo de código preferido).
:::

## Siga Junto

### Passo 1: Executar o Comando de Inicialização

Na caixa de entrada do OpenCode, digite o seguinte comando e envie:

```bash
/supermemory-init
```

**Por que**
Isso carrega o Prompt predefinido e inicia o modo de exploração do Agent.

**O que você deve ver**
O Agent começa a responder, indicando que entendeu a tarefa e começou a planejar as etapas de investigação. Ele pode dizer: "I will start by exploring the codebase structure and configuration files..."

### Passo 2: Observar o Processo de Exploração do Agent

O Agent executará automaticamente uma série de operações, você só precisa assistir. Geralmente, ele:

1.  **Lê arquivos de configuração**: Lê `package.json`, `tsconfig.json`, etc., para entender a stack tecnológica.
2.  **Verifica o histórico do Git**: Executa `git log` para entender as convenções de commit e contribuidores ativos.
3.  **Explora a estrutura de diretórios**: Usa `ls` ou `list_files` para ver o layout do projeto.

**Exemplo de saída**:
```
[Agent] Reading package.json to identify dependencies...
[Agent] Running git log to understand commit conventions...
```

::: tip Aviso de Consumo
Este processo é uma investigação profunda e pode consumir muitos Tokens (geralmente fará 50+ chamadas de ferramentas). Por favor, aguarde pacientemente até que o Agent reporte a conclusão.
:::

### Passo 3: Verificar as Memórias Geradas

Quando o Agent indicar que a inicialização foi concluída, você pode verificar o que ele realmente se lembrou. Digite:

```bash
/ask Listar as memórias do projeto atual
```

Ou chame a ferramenta diretamente (se quiser ver os dados brutos):

```
supermemory(mode: "list", scope: "project")
```

**O que você deve ver**
O Agent lista uma série de memórias estruturadas, por exemplo:

| Tipo | Exemplo de Conteúdo |
| :--- | :--- |
| `project-config` | "Uses Bun runtime. Build command: bun run build" |
| `architecture` | "API routes are located in src/routes/, using Hono framework" |
| `preference` | "Strict TypeScript usage: no 'any' type allowed" |

### Passo 4: Complementar Omissões (Opcional)

Se o Agent perdeu algumas informações-chave (como uma regra especial que é apenas verbal), você pode complementar manualmente:

```
Por favor, lembre-se: neste projeto, todo o processamento de datas deve usar a biblioteca dayjs, o uso de Date nativo é proibido.
```

**O que você deve ver**
O Agent responde confirmando e chama `supermemory(mode: "add")` para salvar esta nova regra.

## Ponto de Verificação ✅

- [ ] Após executar `/supermemory-init`, o Agent executou automaticamente a tarefa de exploração?
- [ ] O comando `list` permite visualizar as memórias recém-geradas?
- [ ] O conteúdo das memórias reflete com precisão a situação real do projeto atual?

## Aviso de Armadilhas

::: warning Não execute com frequência
A inicialização é um processo demorado que consome muitos Tokens. Geralmente, cada projeto precisa ser executado apenas uma vez. Só execute novamente quando o projeto sofrer mudanças drásticas.
:::

::: danger Aviso de Privacidade
Embora o plugin anonimize automaticamente o conteúdo dentro de tags `<private>`, durante o processo de inicialização, o Agent lerá muitos arquivos. Certifique-se de que seu repositório não possui chaves sensíveis codificadas (como AWS Secret Key), caso contrário, elas podem ser armazenadas na memória como "configuração do projeto".
:::

## Resumo da Lição

Com `/supermemory-init`, completamos a transição de "estranho" para "experiente". Agora, o Agent já se lembrou da arquitetura central e dos padrões do projeto, e nas próximas tarefas de codificação, ele usará automaticamente esse contexto para fornecer assistência mais precisa.

## Próxima Lição

> Na próxima lição, aprenderemos sobre o **[Mecanismo de Injeção Automática de Contexto](./../../core/context-injection/index.md)**.
>
> Você aprenderá:
> - Como o Agent "se lembra" dessas memórias no início da sessão.
> - Como acionar a recuperação de memórias específicas por palavras-chave.

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Linhas |
| :--- | :--- | :--- |
| Definição do Prompt de Inicialização | [`src/cli.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/cli.ts#L13-L163) | 13-163 |
| Implementação da Ferramenta de Memória | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L183-L485) | 183-485 |

**Constantes principais**:
- `SUPERMEMORY_INIT_COMMAND`: Define o conteúdo específico do Prompt do comando `/supermemory-init`, orientando o Agent sobre como realizar a investigação e memorização.

</details>
