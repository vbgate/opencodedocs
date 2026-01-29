---
title: "Privacidade: Proteção de Dados | opencode-supermemory"
sidebarTitle: "Privacidade"
subtitle: "Privacidade e Segurança de Dados: Como Proteger Suas Informações Sensíveis"
description: "Entenda os mecanismos de privacidade do opencode-supermemory. Aprenda a usar tags private para anonimizar dados e configurar API Key com segurança."
tags:
  - "privacidade"
  - "segurança"
  - "configuração"
prerequisite:
  - "start-getting-started"
order: 1
---

# Privacidade e Segurança de Dados: Como Proteger Suas Informações Sensíveis

## O Que Você Vai Aprender

*   **Entender para onde vão os dados**: Saiba claramente quais dados serão enviados para a nuvem e quais ficarão localmente.
*   **Dominar técnicas de anonimização**: Aprenda a usar tags `<private>` para evitar que informações sensíveis (como senhas, chaves) sejam enviadas.
*   **Gerenciar chaves com segurança**: Aprenda a configurar `SUPERMEMORY_API_KEY` da forma mais segura.

## Ideia Central

Ao usar o opencode-supermemory, entender o fluxo de dados é crucial:

1.  **Armazenamento na nuvem**: Suas memórias (Memories) são armazenadas no banco de dados na nuvem do Supermemory, não em arquivos locais. Isso significa que você precisa de conexão de rede para acessar memórias.
2.  **Anonimização local**: Para proteger a privacidade, o plugin realiza anonimização localmente **antes** de enviar dados para a nuvem.
3.  **Controle explícito**: O plugin não varre todos os arquivos automaticamente para enviar; somente quando o Agent chama explicitamente a ferramenta `add` ou aciona a compactação, o conteúdo relevante será processado.

### Mecanismo de Anonimização

O plugin vem com um filtro simples, especificamente para identificar tags `<private>`.

*   **Entrada**: `A senha do banco de dados aqui é <private>123456</private>`
*   **Processamento**: O plugin detecta a tag, substitui seu conteúdo por `[REDACTED]`.
*   **Envio**: `A senha do banco de dados aqui é [REDACTED]`

::: info Dica
Este processo ocorre no código interno do plugin, antes que os dados saiam do seu computador.
:::

## Siga-me

### Passo 1: Configurar API Key com Segurança

Embora você possa escrever a API Key diretamente no arquivo de configuração, para evitar vazamento acidental (como compartilhar acidentalmente o arquivo de configuração com outros), recomendamos entender a lógica de prioridade.

**Regras de prioridade**:
1.  **Arquivo de configuração** (`~/.config/opencode/supermemory.jsonc`): Prioridade mais alta.
2.  **Variável de ambiente** (`SUPERMEMORY_API_KEY`): Se não definido no arquivo de configuração, usa esta variável.

**Prática recomendada**:
Se você deseja alternar de forma flexível ou usar em ambiente CI/CD, use variáveis de ambiente. Se você é um desenvolvedor pessoal, configurar no arquivo JSONC do diretório do usuário também é seguro (porque não está no repositório Git do seu projeto).

### Passo 2: Usar Tag `<private>`

Quando você faz o Agent lembrar certos conteúdos contendo informações sensíveis por meio de linguagem natural na conversa, pode usar a tag `<private>` para envolver partes sensíveis.

**Demonstração de operação**:

Diga ao Agent:
> Lembre-se, o IP do banco de dados de produção é 192.168.1.10, mas a senha root é `<private>SenhaSecreta!</private>`, não vaze a senha.

**Você deve ver**:
O Agent chamará a ferramenta `supermemory` para salvar a memória. Embora a resposta do Agent possa conter a senha (porque ela está no contexto), a **memória real salva na nuvem do Supermemory** já foi anonimizada.

### Passo 3: Verificar Resultado da Anonimização

Podemos verificar por meio de busca se a senha realmente não foi salva.

**Operação**:
Faça o Agent buscar a memória que acabamos de criar:
> Busque a senha do banco de dados de produção.

**Resultado esperado**:
O conteúdo que o Agent recupera do Supermemory deve ser:
`O IP do banco de dados de produção é 192.168.1.10, mas a senha root é [REDACTED]...`

Se o Agent disser "a senha é [REDACTED]", isso significa que o mecanismo de anonimização está funcionando normalmente.

## Equívocos Comuns

::: warning Equívoco 1: Todo o código será enviado
**Fato**: O plugin **não** envia automaticamente todo o seu repositório de código. Ele só envia aquele segmento específico quando executa `/supermemory-init` para varredura de inicialização, ou quando o Agent decide explicitamente "lembrar" alguma lógica de código.
:::

::: warning Equívoco 2: Arquivo .env será carregado automaticamente
**Fato**: O plugin lê `SUPERMEMORY_API_KEY` do ambiente do processo. Se você colocar um arquivo `.env` no diretório raiz do projeto, o plugin **não** o lê automaticamente, a menos que o terminal ou programa principal OpenCode que você usa o carregue.
:::

## Apêndice: Referência de Código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Última atualização: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Linha |
| --- | --- | --- |
| Lógica de anonimização de privacidade | [`src/services/privacy.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/privacy.ts#L1-L13) | 1-13 |
| Carregamento de API Key | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L90) | 90 |
| Anonimização na chamada do plugin | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L282) | 282 |

**Funções-chave**:
- `stripPrivateContent(content)`: Executa substituição regex, transformando conteúdo `<private>` em `[REDACTED]`.
- `loadConfig()`: Carrega arquivo de configuração local, prioridade mais alta que variáveis de ambiente.

</details>

## Próxima Lição

> Parabéns por completar os cursos principais do opencode-supermemory!
>
> Em seguida você pode:
> - Revisar [Configuração Avançada](/pt/supermemoryai/opencode-supermemory/advanced/configuration/) para mais opções de personalização.
