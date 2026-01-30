---
title: "Execução de Scripts: Execução no Diretório de Skills | opencode-agent-skills"
sidebarTitle: "Executar Scripts Automatizados"
subtitle: "Execução de Scripts: Execução no Diretório de Skills"
description: "Domine os métodos de execução de scripts de skills. Aprenda a executar scripts no contexto do diretório de skills, passar parâmetros, tratar erros e definir permissões, aproveitando a capacidade de automação para melhorar a eficiência do trabalho."
tags:
  - "execução de scripts"
  - "automação"
  - "uso de ferramentas"
prerequisite:
  - "start-installation"
  - "platforms-listing-available-skills"
order: 5
---

# Executar Scripts de Skills

## O Que Você Poderá Fazer

- Usar a ferramenta `run_skill_script` para executar scripts executáveis no diretório de skills
- Passar argumentos de linha de comando para scripts
- Entender o contexto do diretório de trabalho da execução de scripts
- Tratar erros de execução de scripts e códigos de saída
- Dominar configurações de permissões de scripts e mecanismos de segurança

## Seu Problema Atual

Você quer que a IA execute scripts automatizados de uma skill específica, como construir o projeto, executar testes ou implantar o aplicativo. Mas você não tem certeza de como chamar o script, ou encontra erros de permissão, scripts não encontrados e outros problemas durante a execução.

## Quando Usar Esta Abordagem

- **Automação de build**: Executar scripts `build.sh` ou `build.py` da skill para construir o projeto
- **Execução de testes**: Acionar a suíte de testes da skill para gerar relatórios de cobertura
- **Fluxo de implantação**: Executar scripts de implantação para publicar o aplicativo em ambiente de produção
- **Processamento de dados**: Executar scripts para processar arquivos e converter formatos de dados
- **Instalação de dependências**: Executar scripts para instalar dependências necessárias para a skill

## Ideia Central

A ferramenta `run_skill_script` permite executar scripts executáveis no contexto do diretório de skills. Os benefícios são:

- **Ambiente de execução correto**: O script é executado no diretório de skills, podendo acessar configurações e recursos da skill
- **Fluxo de trabalho automatizado**: A skill pode conter um conjunto de scripts automatizados, reduzindo operações repetitivas
- **Verificação de permissões**: Só executa arquivos com permissões executáveis, evitando execução acidental de arquivos de texto comuns
- **Captura de erros**: Captura o código de saída e a saída do script, facilitando a depuração

::: info Regras de Descoberta de Scripts
O plugin procura recursivamente por arquivos executáveis no diretório de skills (máximo de 10 níveis de profundidade):
- **Ignorar diretórios**: Diretórios ocultos (começados com `.`), `node_modules`, `__pycache__`, `.git`, `.venv`, etc.
- **Verificação de executável**: Apenas arquivos com permissões executáveis (mode & 0o111) são incluídos na lista de scripts
- **Caminho relativo**: O caminho do script é relativo ao diretório de skills, como `tools/build.sh`
:::

::: tip Primeiro Verifique Scripts Disponíveis
Antes de executar, use `get_available_skills` para ver a lista de scripts da skill:
```
docker-helper (projeto)
  Guia de containerização e implantação do Docker [scripts: build.sh, deploy.sh]
```
::

## Siga Comigo

### Passo 1: Executar Script de Skill

Suponha que você tenha uma skill `docker-helper` contendo o script `build.sh`:

```
Entrada do usuário:
Execute o script build.sh do docker-helper

Resposta do sistema:
Building Docker image...
Successfully built abc123def456
Tagged as myapp:latest
```

**O que você deve ver**: O conteúdo de saída do script é exibido na resposta.

O diretório de trabalho durante a execução do script é alternado para o diretório de skills, então o `build.sh` pode acessar corretamente recursos como o `Dockerfile` da skill.

### Passo 2: Passar Argumentos de Linha de Comando

Muitos scripts aceitam parâmetros, por exemplo, o `deploy.sh` pode precisar especificar o ambiente:

```
Entrada do usuário:
Execute o deploy.sh do docker-helper, parâmetro é production

Resposta do sistema:
Deploying to production environment...
Uploading image to registry...
Deployment successful: https://myapp.example.com
```

Você também pode passar múltiplos parâmetros:

```
Entrada do usuário:
Implante usando deploy.sh, parâmetros são staging e --force

Resposta do sistema:
Deploying to staging environment (--force mode)...
Skipping validation...
Deployment successful
```

**O que você deve ver**: O script recebe os parâmetros e executa as operações correspondentes.

### Passo 3: Executar Scripts em Diretórios Aninhados

Scripts podem estar em subdiretórios da skill, como `tools/setup.sh`:

```
Entrada do usuário:
Execute o tools/setup.sh do docker-helper

Resposta do sistema:
Setting up Docker environment...
✓ Docker network created
✓ Volume mounted
✓ Environment configured
```

O caminho relativo é sempre relativo ao diretório de skills, independentemente da profundidade da localização real do script.

**O que você deve ver**: Scripts em diretórios aninhados também são executados corretamente.

### Passo 4: Tratar Erro de Skill Não Existente

Se você inserir um nome de skill incorreto:

```
Entrada do usuário:
Execute o build.sh do docker-asistant

Resposta do sistema:
Skill "docker-asistant" not found. Did you mean "docker-helper"?
```

O plugin sugerirá o nome correto da skill com base em correspondência aproximada. Você pode primeiro chamar `get_available_skills` para ver as skills disponíveis.

**O que você deve ver**: Mensagem de erro e sugestão do nome correto.

### Passo 5: Tratar Erro de Script Não Existente

Se o script não está na lista de scripts da skill:

```
Entrada do usuário:
Execute o run.sh do docker-helper

Resposta do sistema:
Script "run.sh" not found in skill "docker-helper". Did you mean "build.sh"?
Available scripts: build.sh, deploy.sh
```

O plugin listará todos os scripts disponíveis, facilitando a escolha do nome correto do script.

**O que você deve ver**: Mensagem de erro e lista de scripts disponíveis.

### Passo 6: Entender Falha na Execução do Script

Se a execução do script falhar (código de saída diferente de 0), o plugin retornará informações de erro:

```
Entrada do usuário:
Execute o build.sh do docker-helper

Resposta do sistema:
Script failed (exit 1): Dockerfile not found in /path/to/skill
```

As informações de erro incluem:
- **Código de saída**: `exit 1` indica que o script saiu com status diferente de zero
- **Saída de erro**: Conteúdo do stderr ou stdout do script
- **Motivo da falha**: Mensagens de erro específicas do script

**O que você deve ver**: Informações de erro detalhadas para ajudá-lo a localizar o problema.

## Ponto de Verificação ✅

- [ ] Você consegue executar scripts executáveis no diretório de skills?
- [ ] Você consegue passar argumentos de linha de comando para scripts?
- [ ] Você entende o contexto do diretório de trabalho da execução de scripts?
- [ ] Você consegue identificar e tratar erros de execução de scripts?
- [ ] Você sabe como verificar as configurações de permissões de scripts?

## Cuidados com Armadilhas

### Armadilha 1: Script Sem Permissão Executável

Se você criar um novo script mas esquecer de definir permissões executáveis, ele não aparecerá na lista de scripts.

**Comportamento do erro**:
```
Available scripts: build.sh  # Seu novo script new-script.sh não está na lista
```

**Causa**: O arquivo não tem permissões executáveis (mode & 0o111 é falso).

**Solução**: Defina permissões executáveis no terminal:
```bash
chmod +x .opencode/skills/my-skill/new-script.sh
```

**Verificação**: Chame `get_available_skills` novamente para ver a lista de scripts.

### Armadilha 2: Caminho do Script Incorreto

O caminho do script deve ser um caminho relativo ao diretório de skills, não pode usar caminhos absolutos ou referências ao diretório pai.

**Exemplos incorretos**:

```bash
# ❌ Errado: Usar caminho absoluto
Execute o /path/to/skill/build.sh do docker-helper

# ❌ Errado: Tentar acessar diretório pai (embora passe na verificação de segurança, o caminho está incorreto)
Execute o ../build.sh do docker-helper
```

**Exemplos corretos**:

```bash
# ✅ Correto: Usar caminho relativo
Execute o build.sh do docker-helper
Execute o tools/deploy.sh do docker-helper
```

**Causa**: O plugin verifica a segurança do caminho, prevenindo ataques de travessia de diretório, enquanto o caminho relativo é baseado no diretório de skills.

### Armadilha 3: Script Dependente do Diretório de Trabalho

Se o script assume que o diretório atual é o diretório raiz do projeto em vez do diretório de skills, a execução pode falhar.

**Exemplo de erro**:
```bash
# build.sh no diretório de skill
#!/bin/bash
# ❌ Errado: Assume que o diretório atual é o diretório raiz do projeto
docker build -t myapp .
```

**Problema**: Durante a execução, o diretório atual é o diretório de skills (`.opencode/skills/docker-helper`), não o diretório raiz do projeto.

**Solução**: O script deve usar caminhos absolutos ou localizar dinamicamente o diretório raiz do projeto:
```bash
# ✅ Correto: Usar caminho relativo para localizar o diretório raiz do projeto
docker build -t myapp ../../..

# Ou: Usar variáveis de ambiente ou arquivos de configuração
PROJECT_ROOT="${SKILL_DIR}/../../.."
docker build -t myapp "$PROJECT_ROOT"
```

**Explicação**: O diretório de skills pode não ter o `Dockerfile` do projeto, então o script precisa localizar os arquivos de recursos.

### Armadilha 4: Saída do Script Muito Longa

Se o script gerar uma grande quantidade de informações de log (como o progresso de download do npm install), a resposta pode ficar muito longa.

**Comportamento**:

```bash
Resposta do sistema:
npm WARN deprecated package...
npm notice created a lockfile...
added 500 packages in 2m
# Pode ter centenas de linhas de saída
```

**Recomendação**: O script deve simplificar a saída, exibindo apenas informações importantes:

```bash
#!/bin/bash
echo "Installing dependencies..."
npm install --silent
echo "✓ Dependencies installed (500 packages)"
```

## Resumo da Lição

A ferramenta `run_skill_script` permite executar scripts executáveis no contexto do diretório de skills, suportando:

- **Passagem de parâmetros**: Passar argumentos de linha de comando através do array `arguments`
- **Alteração do diretório de trabalho**: O CWD é alterado para o diretório de skills durante a execução
- **Tratamento de erros**: Captura código de saída e saída de erro, facilitando a depuração
- **Verificação de permissões**: Executa apenas arquivos com permissões executáveis
- **Segurança de caminho**: Verifica o caminho do script, prevenindo travessia de diretório

Regras de descoberta de scripts:
- Varre recursivamente o diretório de skills, profundidade máxima de 10 níveis
- Ignora diretórios ocultos e diretórios de dependências comuns
- Inclui apenas arquivos com permissões executáveis
- O caminho é um caminho relativo ao diretório de skills

**Melhores práticas**:
- A saída do script deve ser concisa, exibindo apenas informações importantes
- O script não deve assumir que o diretório atual é o diretório raiz do projeto
- Use `chmod +x` para definir permissões executáveis para novos scripts
- Primeiro use `get_available_skills` para ver os scripts disponíveis

## Próxima Lição

> Na próxima lição, aprenderemos **[Ler Arquivos de Skills](../reading-skill-files/)**.
>
> Você aprenderá:
> - Usar a ferramenta read_skill_file para acessar documentação e configurações da skill
> - Entender o mecanismo de verificação de segurança de caminho, prevenindo ataques de travessia de diretório
> - Dominar o formato de leitura de arquivos e injeção de conteúdo XML
> - Aprender a organizar arquivos de suporte na skill (documentação, exemplos, configurações, etc.)

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-24

| Funcionalidade        | Caminho do Arquivo                                                                                    | Linha    |
|--- | --- | ---|
| Definição da ferramenta RunSkillScript | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L137-L198) | 137-198 |
| Função findScripts | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L59-L99) | 59-99   |

**Tipos principais**:
- `Script = { relativePath: string; absolutePath: string }`: Metadados do script, contendo caminho relativo e caminho absoluto

**Constantes principais**:
- Profundidade máxima de recursão: `10` (`skills.ts:64`) - Limite de profundidade de busca de scripts
- Lista de diretórios a ignorar: `['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']` (`skills.ts:61`)
- Máscara de permissão executável: `0o111` (`skills.ts:86`) - Verifica se o arquivo é executável

**Funções principais**:
- `RunSkillScript(skill: string, script: string, arguments?: string[])`: Executa script de skill, suporta passagem de parâmetros e alteração do diretório de trabalho
- `findScripts(skillPath: string)`: Procura recursivamente por arquivos executáveis no diretório de skills, retorna ordenado por caminho relativo

**Regras de negócio**:
- Durante a execução do script, o diretório de trabalho é alterado para o diretório de skills (`tools.ts:180`): `$.cwd(skill.path)`
- Executa apenas scripts na lista de scripts da skill (`tools.ts:165-177`)
- Quando o script não existe, retorna a lista de scripts disponíveis, suporta sugestões de correspondência aproximada (`tools.ts:168-176`)
- Quando a execução falha, retorna código de saída e saída de erro (`tools.ts:184-195`)
- Ignora diretórios ocultos (começados com `.`) e diretórios de dependências comuns (`skills.ts:70-71`)

</details>
