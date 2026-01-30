---
title: "Perguntas Frequentes e Solução de Problemas: Resolução Rápida de Vários Problemas | Tutorial AI App Factory"
sidebarTitle: "O que fazer ao encontrar problemas"
subtitle: "Perguntas Frequentes e Solução de Problemas"
description: "Aprenda como identificar rapidamente e resolver problemas comuns ao usar o AI App Factory. Este tutorial explica em detalhes os métodos de investigação e etapas de reparo para vários problemas, como problemas de diretório durante inicialização, falhas ao iniciar o assistente de IA, falhas de estágio, conflitos de versões de dependências, erros de permissão excessiva, ajudando você a concluir o desenvolvimento de aplicativos com eficiência."
tags:
  - "Solução de Problemas"
  - "FAQ"
  - "Depuração"
prerequisite:
  - "../../start/installation/"
  - "../../start/init-project/"
order: 190
---

# Perguntas Frequentes e Solução de Problemas

## O que você será capaz de fazer após aprender

- Identificar rapidamente e resolver problemas de diretório durante a inicialização
- Investigar as razões para falhas ao iniciar o assistente de IA
- Compreender o processo de tratamento de falhas de estágio (repetir/reverter/intervenção manual)
- Resolver problemas de instalação de dependências e conflitos de versões
- Lidar com erros de permissão excessiva do Agent
- Usar `factory continue` para retomar a execução em uma nova sessão

## O seu dilema atual

Você pode ter encontrado esses problemas:

- ❌ Ao executar `factory init`, é exibida a mensagem "diretório não vazio"
- ❌ O assistente de IA não consegue iniciar, não sabe como configurar permissões
- ❌ A execução do pipeline falha repentinamente em um estágio, não sabe como continuar
- ❌ Erro na instalação de dependências, conflitos de versões graves
- ❌ Os artefatos gerados pelo Agent são marcados como "permissão excessiva"
- ❌ Não entende o mecanismo de pontos de verificação e repetição

Não se preocupe, esses problemas têm soluções claras. Este tutorial ajudará você a investigar e reparar rapidamente vários tipos de falhas.

---

## 🎒 Preparativos antes de começar

::: warning Conhecimentos prévios

Antes de começar, certifique-se de que você já:

- [ ] Completou [Instalação e Configuração](../../start/installation/)
- [ ] Completou [Inicializar Projeto Factory](../../start/init-project/)
- [ ] Compreendeu a [Visão Geral do Pipeline de 7 Estágios](../../start/pipeline-overview/)
- [ ] Sabe como usar a [Integração Claude Code](../../platforms/claude-code/)

:::

## Ideia central

O tratamento de falhas do AI App Factory segue uma estratégia rigorosa, entender esse mecanismo fará com que você não se sinta perdido ao encontrar problemas.

### Três níveis de tratamento de falhas

1. **Repetição automática**: cada estágio permite repetir uma vez
2. **Arquivamento de reversão**: artefatos com falha são movidos para `_failed/`, revertidos para o último ponto de verificação bem-sucedido
3. **Intervenção manual**: após falhar duas vezes consecutivamente, é pausado e você precisa reparar manualmente

### Regras de tratamento de permissão excessiva

- Agent grava em diretório não autorizado → movido para `_untrusted/`
- Pipeline pausado, esperando sua revisão
- Ajuste permissões ou modifique o comportamento do Agent conforme necessário

### Limites de permissão

Cada Agent tem um escopo rigoroso de permissões de leitura e gravação:

| Agent       | Pode ler                          | Pode gravar                                            |
| ----------- | --------------------------------- | ------------------------------------------------------ |
| bootstrap   | Nenhum                            | `input/`                                               |
| prd         | `input/`                          | `artifacts/prd/`                                        |
| ui          | `artifacts/prd/`                   | `artifacts/ui/`                                         |
| tech        | `artifacts/prd/`                   | `artifacts/tech/`, `artifacts/backend/prisma/`         |
| code        | `artifacts/ui/`, `artifacts/tech/`, `artifacts/backend/prisma/` | `artifacts/backend/`, `artifacts/client/`             |
| validation  | `artifacts/backend/`, `artifacts/client/` | `artifacts/validation/`                                 |
| preview     | `artifacts/backend/`, `artifacts/client/` | `artifacts/preview/`                                  |

---

## Problemas de inicialização

### Problema 1: Erro de diretório não vazio

**Sintoma**:

```bash
$ factory init
Error: Directory is not empty or contains conflicting files
```

**Causa**: O diretório atual contém arquivos conflitantes (não são arquivos permitidos como `.git`, `README.md`, etc.).

**Solução**:

1. **Confirmar o conteúdo do diretório**:

```bash
ls -la
```

2. **Limpar arquivos conflitantes**:

```bash
# Método 1: excluir arquivos conflitantes
rm -rf <conflicting-files>

# Método 2: mover para um novo diretório
mkdir ../my-app && mv . ../my-app/
cd ../my-app
```

3. **Reinicializar**:

```bash
factory init
```

**Arquivos permitidos**: `.git`, `.gitignore`, `README.md`, `.vscode/*`, `.idea/*`

### Problema 2: Já existe um projeto Factory

**Sintoma**:

```bash
$ factory init
Error: This is already a Factory project
```

**Causa**: O diretório já contém os diretórios `.factory/` ou `artifacts/`.

**Solução**:

- Se for um novo projeto, limpe antes de inicializar:

```bash
rm -rf .factory artifacts
factory init
```

- Se quiser restaurar um projeto antigo, execute `factory run` diretamente

### Problema 3: Falha ao iniciar o assistente de IA

**Sintoma**:

```bash
$ factory init
✓ Factory project initialized
Could not find Claude Code installation.
```

**Causa**: Claude Code não está instalado ou não está configurado corretamente.

**Solução**:

1. **Instalar Claude Code**:

```bash
# macOS
brew install claude

# Linux (baixar do site oficial)
# https://claude.ai/code
```

2. **Verificar instalação**:

```bash
claude --version
```

3. **Iniciar manualmente**:

```bash
# No diretório do projeto Factory
claude "Por favor, leia .factory/pipeline.yaml e .factory/agents/orchestrator.checkpoint.md, inicie o pipeline"
```

**Fluxo de inicialização manual**: 1. Ler `pipeline.yaml` → 2. Ler `orchestrator.checkpoint.md` → 3. Aguardar a IA executar

---

## Problemas de execução do pipeline

### Problema 4: Erro de diretório não é um projeto

**Sintoma**:

```bash
$ factory run
Error: Not a Factory project. Run 'factory init' first.
```

**Causa**: O diretório atual não é um projeto Factory (falta o diretório `.factory/`).

**Solução**:

1. **Confirmar a estrutura do projeto**:

```bash
ls -la .factory/
```

2. **Alternar para o diretório correto** ou **reinicializar**:

```bash
# Alternar para o diretório do projeto
cd /path/to/project

# Ou reinicializar
factory init
```

### Problema 5: Arquivo do Pipeline não encontrado

**Sintoma**:

```bash
$ factory run
Error: Pipeline configuration not found
```

**Causa**: O arquivo `pipeline.yaml` está ausente ou o caminho está incorreto.

**Solução**:

1. **Verificar se o arquivo existe**:

```bash
ls -la .factory/pipeline.yaml
ls -la pipeline.yaml
```

2. **Copiar manualmente** (se o arquivo estiver perdido):

```bash
cp /path/to/factory/source/hyz1992/agent-app-factory/pipeline.yaml .factory/
```

3. **Reinicializar** (mais confiável):

```bash
rm -rf .factory
factory init
```

---

## Tratamento de falhas de estágio

### Problema 6: Falha no estágio Bootstrap

**Sintoma**:

- `input/idea.md` não existe
- `idea.md` falta seções críticas (usuários-alvo, valor central, hipóteses)

**Causa**: O usuário não forneceu informações suficientes ou o Agent não gravou o arquivo corretamente.

**Fluxo de tratamento**:

```
1. Verificar se o diretório input/ existe → criar se não existir
2. Repetir uma vez, solicitando ao Agent usar o modelo correto
3. Se ainda falhar, solicitar ao usuário fornecer uma descrição mais detalhada do produto
```

**Reparo manual**:

1. **Verificar o diretório de artefatos**:

```bash
ls -la artifacts/_failed/bootstrap/
```

2. **Criar o diretório input/**:

```bash
mkdir -p input
```

3. **Fornecer uma descrição detalhada do produto**:

Forneça à IA uma ideia de produto mais clara e detalhada, incluindo:
- Quem são os usuários-alvo (pessoa específica)
- Qual é a dor central
- Qual problema deseja resolver
- Ideias preliminares de funcionalidade

### Problema 7: Falha no estágio PRD

**Sintoma**:

- PRD contém detalhes técnicos (viola limites de responsabilidade)
- Funcionalidades Must Have > 7 (escopo inflado)
- Falta o não-alvo (limites não claramente definidos)

**Causa**: O Agent ultrapassou os limites ou o controle de escopo não foi rigoroso.

**Fluxo de tratamento**:

```
1. Verificar se prd.md não contém palavras-chave técnicas
2. Verificar se o número de funcionalidades Must Have ≤ 7
3. Verificar se os usuários-alvo têm personas específicas
4. Fornecer requisitos de correção específicos ao repetir
```

**Exemplos de erros comuns**:

| Tipo de erro | Exemplo de erro | Exemplo correto |
|-------------|------------------|------------------|
| Contém detalhes técnicos | "Implementado usando React Native" | "Suporta as plataformas iOS e Android" |
| Escopo inflado | "Contém 10 funcionalidades como pagamento, social, mensagens" | "Não mais de 7 funcionalidades principais" |
| Objetivo vago | "Todos podem usar" | "Trabalhadores urbanos de 25-35 anos" |

**Reparo manual**:

1. **Verificar o PRD com falha**:

```bash
cat artifacts/_failed/prd/prd.md
```

2. **Corrigir o conteúdo**:

- Excluir descrição do stack técnico
- Simplificar a lista de funcionalidades para ≤ 7
- Complementar a lista de não-alvo

3. **Mover manualmente para a posição correta**:

```bash
mv artifacts/_failed/prd/prd.md artifacts/prd/prd.md
```

### Problema 8: Falha no estágio UI

**Sintoma**:

- Número de páginas > 8 (escopo inflado)
- Arquivo HTML de pré-visualização corrompido
- Usando estilo de IA (fonte Inter + gradiente roxo)
- Falha na análise YAML

**Causa**: O escopo da interface é muito grande ou as diretrizes estéticas não foram seguidas.

**Fluxo de tratamento**:

```
1. Contar o número de páginas em ui.schema.yaml
2. Tentar abrir preview.web/index.html no navegador
3. Verificar a sintaxe YAML
4. Verificar se estão sendo usados elementos de estilo proibidos
```

**Reparo manual**:

1. **Verificar a sintaxe YAML**:

```bash
npx js-yaml .factory/artifacts/ui/ui.schema.yaml
```

2. **Abrir a pré-visualização no navegador**:

```bash
open artifacts/ui/preview.web/index.html  # macOS
xdg-open artifacts/ui/preview.web/index.html  # Linux
```

3. **Reduzir o número de páginas**: verificar `ui.schema.yaml`, garantir que o número de páginas ≤ 8

### Problema 9: Falha no estágio Tech

**Sintoma**:

- Erro de sintaxe no esquema Prisma
- Introdução de microsserviços, cache, etc. (design excessivo)
- Modelos de dados excessivos (número de tabelas > 10)
- Falta definição de API

**Causa**: Complexidade da arquitetura ou problemas de design de banco de dados.

**Fluxo de tratamento**:

```
1. Executar npx prisma validate para verificar o schema
2. Verificar se tech.md contém seções necessárias
3. Contar o número de modelos de dados
4. Verificar se foram introduzidas tecnologias complexas desnecessárias
```

**Reparo manual**:

1. **Verificar o esquema Prisma**:

```bash
cd artifacts/backend/
npx prisma validate
```

2. **Simplificar a arquitetura**: verificar `artifacts/tech/tech.md`, remover tecnologias desnecessárias (microsserviços, cache, etc.)

3. **Complementar definição de API**: garantir que `tech.md` contenha todos os endpoints de API necessários

### Problema 10: Falha no estágio Code

**Sintoma**:

- Falha na instalação de dependências
- Erro de compilação TypeScript
- Falta de arquivos necessários
- Testes falhando
- API não consegue iniciar

**Causa**: Conflitos de versões de dependências, problemas de tipo ou erros lógicos no código.

**Fluxo de tratamento**:

```
1. Executar npm install --dry-run para verificar dependências
2. Executar npx tsc --noEmit para verificar tipos
3. Verificar a estrutura do diretório em relação à lista de arquivos
4. Executar npm test para verificar testes
5. Se tudo acima passar, tentar iniciar o serviço
```

**Reparo de problemas comuns de dependências**:

```bash
# Conflito de versões
rm -rf node_modules package-lock.json
npm install

# Versão do Prisma não correspondente
npm install @prisma/client@latest prisma@latest

# Problemas de dependências do React Native
npx expo install --fix
```

**Tratamento de erros TypeScript**:

```bash
# Verificar erros de tipo
npx tsc --noEmit

# Verificar novamente após reparo
npx tsc --noEmit
```

**Verificação da estrutura do diretório**:

Garanta que contém os seguintes arquivos/diretórios necessários:

```
artifacts/backend/
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── index.ts
│   ├── lib/
│   └── routes/
└── vitest.config.ts

artifacts/client/
├── package.json
├── tsconfig.json
├── app.json
└── src/
```

### Problema 11: Falha no estágio Validation

**Sintoma**:

- Relatório de validação incompleto
- Muitos problemas graves (número de erros > 10)
- Problemas de segurança (chaves codificadas detectadas)

**Causa**: Qualidade pobre no estágio Code ou existem problemas de segurança.

**Fluxo de tratamento**:

```
1. Analisar report.md para confirmar que todas as seções existem
2. Contar o número de problemas graves
3. Se problemas graves > 10, sugerir reverter ao estágio Code
4. Verificar resultados da verificação de segurança
```

**Reparo manual**:

1. **Ver o relatório de validação**:

```bash
cat artifacts/validation/report.md
```

2. **Reparar problemas graves**: reparar item por item de acordo com o relatório

3. **Reverter ao estágio Code** (se houver muitos problemas):

```bash
factory run code  # Reiniciar a partir do estágio Code
```

### Problema 12: Falha no estágio Preview

**Sintoma**:

- README incompleto (falta etapas de instalação)
- Falha na construção Docker
- Falta configuração de implantação

**Causa**: Conteúdo perdido ou problemas de configuração.

**Fluxo de tratamento**:

```
1. Verificar se README.md contém todas as seções necessárias
2. Tentar docker build para verificar o Dockerfile
3. Verificar se os arquivos de configuração de implantação existem
```

**Reparo manual**:

1. **Verificar a configuração Docker**:

```bash
cd artifacts/preview/
docker build -t my-app .
```

2. **Verificar arquivos de implantação**:

Garanta que existem os seguintes arquivos:

```
artifacts/preview/
├── README.md
├── Dockerfile
├── docker-compose.yml
└── .github/workflows/ci.yml  # Configuração CI/CD
```

---

## Tratamento de erros de permissão excessiva

### Problema 13: Agent escreveu sem autorização

**Sintoma**:

```bash
Error: Unauthorized write to <path>
Artifacts moved to: artifacts/_untrusted/<stage-id>/
Pipeline paused. Manual intervention required.
```

**Causa**: O Agent gravou conteúdo em um diretório ou arquivo não autorizado.

**Solução**:

1. **Verificar arquivos não autorizados**:

```bash
ls -la artifacts/_untrusted/<stage-id>/
```

2. **Revisar a matriz de permissões**: confirmar o escopo gravável desse Agent

3. **Escolher método de tratamento**:

   - **Opção A: corrigir o comportamento do Agent** (recomendado)

   No assistente de IA, aponte claramente o problema de permissão excessiva, solicite correção.

   - **Opção B: mover arquivos para a posição correta** (cuidado)

   Se você tem certeza de que o arquivo deve existir, mova manualmente:

   ```bash
   mv artifacts/_untrusted/<stage-id>/<file> artifacts/<target-stage>/
   ```

   - **Opção C: ajustar a matriz de permissões** (avançado)

   Modifique `.factory/policies/capability.matrix.md`, aumente as permissões de gravação desse Agent.

4. **Continuar execução**:

```bash
factory continue
```

**Cenários de exemplo**:

- Code Agent tenta modificar `artifacts/prd/prd.md` (viola limites de responsabilidade)
- UI Agent tenta criar diretório `artifacts/backend/` (excede o escopo de permissões)
- Tech Agent tenta gravar no diretório `artifacts/ui/` (ultrapassa os limites)

---

## Problemas de execução em múltiplas sessões

### Problema 14: Insuficiência de tokens ou acumulação de contexto

**Sintoma**:

- Respostas da IA ficam mais lentas
- Contexto muito longo leva à queda de desempenho do modelo
- Consumo excessivo de tokens

**Causa**: Acúmulo de muito histórico de conversas na mesma sessão.

**Solução: usar `factory continue`**

O comando `factory continue` permite que você:

1. **Salvar o estado atual** em `.factory/state.json`
2. **Iniciar uma nova janela do Claude Code**
3. **Continuar executando a partir do estágio atual**

**Etapas de execução**:

1. **Verificar o estado atual**:

```bash
factory status
```

Exemplo de saída:

```bash
Pipeline Status:
───────────────────────────────────────
Project: my-app
Status: Waiting
Current Stage: tech
Completed: bootstrap, prd, ui
```

2. **Continuar em uma nova sessão**:

```bash
factory continue
```

**Efeito**:

- Cada estágio possui um contexto limpo e exclusivo
- Evita acúmulo de tokens
- Suporta recuperação de interrupção

**Iniciar manualmente uma nova sessão** (se `factory continue` falhar):

```bash
# Regenerar configuração de permissões
claude "Por favor, regenere .claude/settings.local.json, permita operações Read/Write/Glob/Bash"

# Iniciar manualmente uma nova sessão
claude "Por favor, continue executando o pipeline, o estágio atual é tech"
```

---

## Problemas de ambiente e permissões

### Problema 15: Versão do Node.js muito baixa

**Sintoma**:

```bash
Error: Node.js version must be >= 16.0.0
```

**Causa**: A versão do Node.js não atende aos requisitos.

**Solução**:

1. **Verificar a versão**:

```bash
node --version
```

2. **Atualizar o Node.js**:

```bash
# macOS
brew install node@18
brew link --overwrite node@18

# Linux (usando nvm)
nvm install 18
nvm use 18

# Windows (baixar do site oficial)
# https://nodejs.org/
```

### Problema 16: Problemas de permissão do Claude Code

**Sintoma**:

- A IA solicita "não tem permissões de leitura/gravação"
- A IA não consegue acessar o diretório `.factory/`

**Causa**: A configuração de permissões em `.claude/settings.local.json` está incorreta.

**Solução**:

1. **Verificar o arquivo de permissões**:

```bash
cat .claude/settings.local.json
```

2. **Regenerar permissões**:

```bash
factory continue  # Regenera automaticamente
```

Ou execute manualmente:

```bash
node -e "
const { generateClaudeSettings } = require('./cli/utils/claude-settings');
generateClaudeSettings(process.cwd());
"
```

3. **Exemplo de configuração de permissões correta**:

```json
{
  \"allowedCommands\": [\"npm\", \"npx\", \"node\", \"git\"],
  \"allowedPaths\": [
    \"/absolute/path/to/project/.factory\",
    \"/absolute/path/to/project/artifacts\",
    \"/absolute/path/to/project/input\",
    \"/absolute/path/to/project/node_modules\"
  ]
}
```

### Problema 17: Problemas de rede levam a falha na instalação de dependências

**Sintoma**:

```bash
Error: Network request failed
npm ERR! code ECONNREFUSED
```

**Causa**: Problemas de conexão de rede ou falha ao acessar a fonte npm.

**Solução**:

1. **Verificar a conexão de rede**:

```bash
ping registry.npmjs.org
```

2. **Alternar a fonte npm**:

```bash
# Usar espelho Taobao
npm config set registry https://registry.npmmirror.com

# Verificar
npm config get registry
```

3. **Reinstalar dependências**:

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Árvore de decisão de intervenção manual

```
Estágio falhou
    │
    ▼
É a primeira falha?
    ├─ Yes → Repetição automática
    │         │
    │         ▼
    │     Repetição bem-sucedida? → Yes → Continuar o processo
    │            │
    │            No → Segunda falha
    │
    └─ No → Analisar a causa da falha
              │
              ▼
          É um problema de entrada?
              ├─ Yes → Modificar arquivos de entrada
              │         └─ Reverter ao estágio upstream
              │
              └─ No → Solicitar intervenção manual
```

**Pontos de decisão**:

- **Primeira falha**: permite repetição automática, observe se o erro desaparece
- **Segunda falha**: interrompe o processamento automático, você precisa revisar manualmente
- **Problema de entrada**: modifique `input/idea.md` ou artefatos upstream
- **Problema técnico**: verifique dependências, configuração ou lógica do código
- **Problema de permissão excessiva**: revise a matriz de permissões ou comportamento do Agent

---

## Avisos sobre armadilhas comuns

### ❌ Erros comuns

1. **Modificar diretamente artefatos upstream**

   Abordagem incorreta: modificar `input/idea.md` no estágio PRD
   
   Abordagem correta: reverter ao estágio Bootstrap

2. **Ignorar confirmação de pontos de verificação**

   Abordagem incorreta: pular rapidamente todos os pontos de verificação
   
   Abordagem correta: verificar cuidadosamente se os artefatos de cada estágio atendem às expectativas

3. **Excluir manualmente artefatos com falha**

   Abordagem incorreta: excluir o diretório `_failed/`
   
   Abordagem correta: preservar artefatos com falha para comparação e análise

4. **Não regenerar permissões após modificação**

   Abordagem incorreta: não atualizar `.claude/settings.local.json` após modificar a estrutura do projeto
   
   Abordagem correta: executar `factory continue` para atualizar automaticamente as permissões

### ✅ Melhores práticas

1. **Falha precoce**: descobrir problemas o mais cedo possível, evitando desperdício de tempo em estágios subsequentes

2. **Logs detalhados**: preservar logs completos de erros, facilitando a investigação de problemas

3. **Operações atômicas**: a saída de cada estágio deve ser atômica, facilitando a reversão

4. **Preservar evidências**: arquivar artefatos com falha antes de repetir, facilitando comparação e análise

5. **Repetição progressiva**: ao repetir, fornecer orientações mais específicas, em vez de simplesmente repetir

---

## Resumo desta aula

Este curso cobre vários problemas comuns ao usar o AI App Factory:

| Categoria | Número de problemas | Método principal de solução |
|-----------|---------------------|---------------------------|
| Inicialização | 3 | Limpar diretório, instalar assistente de IA, iniciar manualmente |
| Execução do pipeline | 2 | Confirmar estrutura do projeto, verificar arquivos de configuração |
| Falha de estágio | 7 | Repetir, reverter, reparar e executar novamente |
| Tratamento de permissão excessiva | 1 | Revisar matriz de permissões, mover arquivos ou ajustar permissões |
| Execução em múltiplas sessões | 1 | Usar `factory continue` para iniciar nova sessão |
| Ambiente e permissões | 3 | Atualizar Node.js, regenerar permissões, alternar fonte npm |

**Pontos-chave**:

- Cada estágio permite **repetição automática uma vez**
- Após falhar duas vezes consecutivamente, é necessária **intervenção manual**
- Artefatos com falha são arquivados automaticamente em `_failed/`
- Arquivos com permissão excessiva são movidos para `_untrusted/`
- Use `factory continue` para economizar tokens

**Lembre-se**:

Ao encontrar problemas, não entre em pânico, primeiro verifique os logs de erro, depois verifique os diretórios de artefatos correspondentes, consulte as soluções deste curso e investigue passo a passo. A maioria dos problemas pode ser resolvida repetindo, revertendo ou reparando arquivos de entrada.

## Próxima aula

> Na próxima aula, vamos aprender **[Melhores Práticas](../best-practices/)**.
>
> Você aprenderá:
> - Como fornecer uma descrição clara do produto
> - Como usar o mecanismo de pontos de verificação
> - Como controlar o escopo do projeto
> - Como otimizar iterativamente passo a passo

**Leituras relacionadas**:

- [Tratamento de falhas e reversão](../../advanced/failure-handling/) - Compreenda em profundidade as estratégias de tratamento de falhas
- [Mecanismo de permissões e segurança](../../advanced/security-permissions/) - Entenda a matriz de limites de capacidade
- [Otimização de contexto](../../advanced/context-optimization/) - Técnicas para economizar tokens

---

## Apêndice: referência de código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Data de atualização: 2026-01-29

| Função | Caminho do arquivo | Número da linha |
|--------|-------------------|-----------------|
| Verificação de diretório de inicialização | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 32-53 |
| Inicialização do assistente de IA | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 119-147 |
| Definição da estratégia de falhas | [`policies/failure.policy.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/failure.policy.md) | 1-276 |
| Especificação de códigos de erro | [`policies/error-codes.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/error-codes.md) | 1-469 |
| Matriz de limites de capacidade | [`policies/capability.matrix.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/capability.matrix.md) | 1-23 |
| Configuração do pipeline | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | Texto completo |
| Núcleo do agendador | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 1-301 |
| Comando Continue | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js) | 1-144 |

**Constantes-chave**:
- Número permitido de funcionalidades Must Have: ≤ 7
- Número permitido de páginas da interface: ≤ 8
- Número permitido de modelos de dados: ≤ 10
- Número de repetições: cada estágio permite repetir uma vez

**Funções-chave**:
- `isFactoryProject(dir)` - Verifica se é um projeto Factory
- `isDirectorySafeToInit(dir)` - Verifica se o diretório pode ser inicializado
- `generateClaudeSettings(projectDir)` - Gera configuração de permissões do Claude Code
- `factory continue` - Continua executando o pipeline em uma nova sessão

</details>
