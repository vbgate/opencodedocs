---
title: "Problemas Comuns: Guia de Solução de Problemas | Plannotator"
sidebarTitle: "O Que Fazer Quando Algo Dá Errado"
subtitle: "Problemas Comuns: Guia de Solução de Problemas"
description: "Aprenda a diagnosticar e resolver problemas comuns do Plannotator. Soluções rápidas para conflitos de porta, navegador não abrindo, falhas em comandos Git, upload de imagens e problemas de integração."
tags:
  - "Problemas Comuns"
  - "Solução de Problemas"
  - "Conflito de Porta"
  - "Navegador"
  - "Git"
  - "Ambiente Remoto"
  - "Problemas de Integração"
prerequisite:
  - "start-getting-started"
  - "start-installation-claude-code"
  - "start-installation-opencode"
order: 1
---

# Problemas Comuns

## O Que Você Vai Aprender

- ✅ Diagnosticar e resolver rapidamente problemas de conflito de porta
- ✅ Entender por que o navegador não abre automaticamente e como acessar
- ✅ Solucionar problemas quando o plano ou revisão de código não aparece
- ✅ Lidar com falhas na execução de comandos Git
- ✅ Resolver erros relacionados ao upload de imagens
- ✅ Diagnosticar falhas na integração com Obsidian/Bear
- ✅ Acessar corretamente o Plannotator em ambientes remotos

## Seu Problema Atual

Ao usar o Plannotator, você pode encontrar estes problemas:

- **Problema 1**: Mensagem de porta ocupada ao iniciar, servidor não consegue iniciar
- **Problema 2**: Navegador não abre automaticamente, não sabe como acessar a interface de revisão
- **Problema 3**: Página de plano ou revisão de código aparece em branco, conteúdo não carrega
- **Problema 4**: Erro de Git ao executar `/plannotator-review`
- **Problema 5**: Falha no upload de imagem ou imagem não aparece
- **Problema 6**: Integração com Obsidian/Bear configurada, mas plano não salva automaticamente
- **Problema 7**: Não consegue acessar o servidor local em ambiente remoto

Esses problemas interrompem seu fluxo de trabalho e afetam a experiência de uso.

## Conceito Central

::: info Mecanismo de Tratamento de Erros

O servidor do Plannotator implementa um **mecanismo de retry automático**:

- **Máximo de tentativas**: 5 vezes
- **Delay entre tentativas**: 500 milissegundos
- **Cenário aplicável**: Porta ocupada (erro EADDRINUSE)

Se houver conflito de porta, o sistema tentará automaticamente outras portas. Só reportará erro após 5 tentativas falharem.

:::

O tratamento de erros do Plannotator segue estes princípios:

1. **Local primeiro**: Todas as mensagens de erro são enviadas para o terminal ou console
2. **Degradação elegante**: Falhas de integração (como falha ao salvar no Obsidian) não bloqueiam o fluxo principal
3. **Mensagens claras**: Fornece mensagens de erro específicas e soluções sugeridas

## Problemas Comuns e Soluções

### Problema 1: Porta Ocupada

**Mensagem de Erro**:

```
Port 19432 in use after 5 retries
```

**Análise da Causa**:

- Porta já está sendo usada por outro processo
- Em modo remoto, porta fixa configurada mas há conflito
- Processo anterior do Plannotator não encerrou corretamente

**Soluções**:

#### Método 1: Aguardar Retry Automático (Apenas Modo Local)

Em modo local, o Plannotator tentará automaticamente portas aleatórias. Se você vir erro de porta ocupada, geralmente significa:

- 5 portas aleatórias estão todas ocupadas (muito raro)
- Porta fixa configurada (`PLANNOTATOR_PORT`) mas há conflito

**O que você deve ver**: Terminal mostra "Port X in use after 5 retries"

#### Método 2: Usar Porta Fixa (Modo Remoto)

Em ambiente remoto, você precisa configurar `PLANNOTATOR_PORT`:

::: code-group

```bash [macOS/Linux]
export PLANNOTATOR_PORT=9999
plannotator start
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_PORT = "9999"
plannotator start
```

:::

::: tip Sugestões para Escolha de Porta

- Escolha portas no intervalo 1024-49151 (portas de usuário)
- Evite portas de serviços comuns (80, 443, 3000, 5000, etc.)
- Certifique-se de que a porta não está bloqueada pelo firewall

:::

#### Método 3: Encerrar Processo que Ocupa a Porta

```bash
# Encontrar processo que ocupa a porta (substitua 19432 pela sua porta)
lsof -i :19432  # macOS/Linux
netstat -ano | findstr :19432  # Windows

# Encerrar processo (substitua PID pelo ID real do processo)
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

::: warning Atenção

Antes de encerrar o processo, confirme que não é outra aplicação importante. O Plannotator fecha automaticamente o servidor após receber uma decisão, geralmente não é necessário encerrar manualmente.

:::

---

### Problema 2: Navegador Não Abre Automaticamente

**Sintoma**: Terminal mostra que o servidor iniciou, mas o navegador não abre.

**Análise da Causa**:

| Cenário | Causa |
| --- | --- |
| Ambiente remoto | Plannotator detectou modo remoto, pula abertura automática do navegador |
| Configuração incorreta de `PLANNOTATOR_BROWSER` | Caminho ou nome do navegador incorreto |
| Navegador não instalado | Navegador padrão do sistema não existe |

**Soluções**:

#### Cenário 1: Ambiente Remoto (SSH, Devcontainer, WSL)

**Verificar se é ambiente remoto**:

```bash
echo $PLANNOTATOR_REMOTE
# Saída "1" ou "true" indica modo remoto
```

**Em ambiente remoto**:

1. **O terminal mostrará a URL de acesso**:

```
Plannotator running at: http://localhost:9999
Press Ctrl+C to stop
```

2. **Abra o navegador manualmente** e acesse a URL mostrada

3. **Configure port forwarding** (se precisar acessar do local)

**O que você deve ver**: Terminal mostra algo como "Plannotator running at: http://localhost:19432"

#### Cenário 2: Modo Local mas Navegador Não Abre

**Verificar configuração de `PLANNOTATOR_BROWSER`**:

::: code-group

```bash [macOS/Linux]
echo $PLANNOTATOR_BROWSER
# Deve mostrar nome ou caminho do navegador
```

```powershell [Windows PowerShell]
echo $env:PLANNOTATOR_BROWSER
```

:::

**Limpar configuração personalizada do navegador**:

::: code-group

```bash [macOS/Linux]
unset PLANNOTATOR_BROWSER
plannotator start
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_BROWSER = ""
plannotator start
```

:::

**Configurar navegador correto** (se precisar personalizar):

```bash
# macOS: usar nome do aplicativo
export PLANNOTATOR_BROWSER="Google Chrome"

# Linux: usar caminho do executável
export PLANNOTATOR_BROWSER="/usr/bin/google-chrome"

# Windows: usar caminho do executável
set PLANNOTATOR_BROWSER="C:\Program Files\Google\Chrome\Application\chrome.exe"
```

---

### Problema 3: Plano ou Revisão de Código Não Aparece

**Sintoma**: Navegador abre, mas página aparece em branco ou falha ao carregar.

**Possíveis Causas**:

| Causa | Revisão de Plano | Revisão de Código |
| --- | --- | --- |
| Parâmetro Plan vazio | ✅ Comum | ❌ Não aplicável |
| Problema no repositório Git | ❌ Não aplicável | ✅ Comum |
| Sem diff para mostrar | ❌ Não aplicável | ✅ Comum |
| Falha ao iniciar servidor | ✅ Possível | ✅ Possível |

**Soluções**:

#### Caso 1: Revisão de Plano Não Aparece

**Verificar saída do terminal**:

```bash
# Procurar mensagens de erro
plannotator start 2>&1 | grep -i error
```

**Erro Comum 1**: Parâmetro Plan vazio

**Mensagem de Erro**:

```
400 Bad Request - Missing plan or plan is empty
```

**Causa**: Claude Code ou OpenCode passou plan como string vazia.

**Solução**:

- Confirme que o AI Agent gerou conteúdo de plano válido
- Verifique se a configuração do Hook ou Plugin está correta
- Consulte os logs do Claude Code/OpenCode para mais informações

**Erro Comum 2**: Servidor não iniciou corretamente

**Solução**:

- Verifique se o terminal mostra a mensagem "Plannotator running at"
- Se não, consulte "Problema 1: Porta Ocupada"
- Veja [Configuração de Variáveis de Ambiente](../../advanced/environment-variables/) para confirmar configuração correta

#### Caso 2: Revisão de Código Não Aparece

**Verificar saída do terminal**:

```bash
/plannotator-review 2>&1 | grep -i error
```

**Erro Comum 1**: Sem repositório Git

**Mensagem de Erro**:

```
fatal: not a git repository
```

**Solução**:

```bash
# Inicializar repositório Git
git init

# Adicionar arquivos e fazer commit (se houver alterações não commitadas)
git add .
git commit -m "Initial commit"

# Executar novamente
/plannotator-review
```

**O que você deve ver**: Navegador mostra o diff viewer

**Erro Comum 2**: Sem diff para mostrar

**Sintoma**: Página mostra "No changes" ou mensagem similar.

**Solução**:

```bash
# Verificar se há alterações não commitadas
git status

# Verificar se há alterações staged
git diff --staged

# Verificar se há commits
git log --oneline

# Alternar tipo de diff para ver diferentes escopos
# Na interface de revisão de código, clique no menu dropdown para alternar:
# - Uncommitted changes
# - Staged changes
# - Last commit
# - vs main (se estiver em uma branch)
```

**O que você deve ver**: Diff viewer mostra alterações de código ou indica "No changes"

**Erro Comum 3**: Falha na execução do comando Git

**Mensagem de Erro**:

```
Git diff error for uncommitted: [mensagem de erro específica]
```

**Possíveis Causas**:

- Git não instalado
- Versão do Git muito antiga
- Problema de configuração do Git

**Solução**:

```bash
# Verificar versão do Git
git --version

# Testar comando git diff
git diff HEAD

# Se o Git funcionar normalmente, o problema pode ser erro interno do Plannotator
# Veja a mensagem de erro completa e reporte o Bug
```

---

### Problema 4: Falha no Upload de Imagem

**Mensagem de Erro**:

```
400 Bad Request - No file provided
500 Internal Server Error - Upload failed
```

**Possíveis Causas**:

| Causa | Solução |
| --- | --- |
| Nenhum arquivo selecionado | Clique no botão de upload e selecione uma imagem |
| Formato de arquivo não suportado | Use formato png/jpeg/webp |
| Arquivo muito grande | Comprima a imagem antes de fazer upload |
| Problema de permissão no diretório temporário | Verifique permissões do diretório /tmp/plannotator |

**Soluções**:

#### Verificar Arquivo de Upload

**Formatos suportados**:

- ✅ PNG (`.png`)
- ✅ JPEG (`.jpg`, `.jpeg`)
- ✅ WebP (`.webp`)

**Formatos não suportados**:

- ❌ BMP (`.bmp`)
- ❌ GIF (`.gif`)
- ❌ SVG (`.svg`)

**O que você deve ver**: Após upload bem-sucedido, a imagem aparece na interface de revisão

#### Verificar Permissões do Diretório Temporário

O Plannotator cria automaticamente o diretório `/tmp/plannotator`. Se o upload ainda falhar, verifique as permissões do diretório temporário do sistema.

**Se precisar verificar manualmente**:

```bash
# Verificar permissões do diretório
ls -la /tmp/plannotator

# Verificação no Windows
dir %TEMP%\plannotator
```

**O que você deve ver**: `drwxr-xr-x` (ou permissões similares) indica que o diretório é gravável

#### Verificar Ferramentas de Desenvolvedor do Navegador

1. Pressione F12 para abrir as ferramentas de desenvolvedor
2. Vá para a aba "Network"
3. Clique no botão de upload
4. Procure a requisição `/api/upload`
5. Verifique o status e resposta da requisição

**O que você deve ver**:
- Código de status: 200 OK (sucesso)
- Resposta: `{"path": "/tmp/plannotator/xxx.png"}`

---

### Problema 5: Falha na Integração Obsidian/Bear

**Sintoma**: Após aprovar o plano, não há plano salvo no aplicativo de notas.

**Possíveis Causas**:

| Causa | Obsidian | Bear |
| --- | --- | --- |
| Integração não habilitada | ✅ | ✅ |
| Vault/App não detectado | ✅ | N/A |
| Configuração de caminho incorreta | ✅ | ✅ |
| Conflito de nome de arquivo | ✅ | ✅ |
| Falha no x-callback-url | N/A | ✅ |

**Soluções**:

#### Problemas de Integração com Obsidian

**Passo 1: Verificar se a integração está habilitada**

1. Na UI do Plannotator, clique em configurações (ícone de engrenagem)
2. Procure a seção "Obsidian Integration"
3. Certifique-se de que o switch está ligado

**O que você deve ver**: Switch aparece em azul (estado habilitado)

**Passo 2: Verificar detecção do Vault**

**Detecção automática**:

- O Plannotator lê automaticamente o arquivo de configuração do Obsidian
- Localização do arquivo de configuração:
  - macOS: `~/Library/Application Support/obsidian/obsidian.json`
  - Windows: `%APPDATA%\obsidian\obsidian.json`
  - Linux: `~/.config/obsidian/obsidian.json`

**Verificação manual**:

::: code-group

```bash [macOS]
cat ~/Library/Application\ Support/obsidian/obsidian.json
```

```powershell [Windows PowerShell]
cat $env:APPDATA\obsidian\obsidian.json
```

```bash [Linux]
cat ~/.config/obsidian/obsidian.json
```

:::

**O que você deve ver**: Arquivo JSON contendo o campo `vaults`

**Passo 3: Configurar caminho do Vault manualmente**

Se a detecção automática falhar:

1. Nas configurações do Plannotator
2. Clique em "Manually enter vault path"
3. Digite o caminho completo do Vault

**Exemplos de caminho**:

- macOS: `/Users/seunome/Documents/ObsidianVault`
- Windows: `C:\Users\seunome\Documents\ObsidianVault`
- Linux: `/home/seunome/Documents/ObsidianVault`

**O que você deve ver**: Menu dropdown mostra o nome do Vault que você digitou

**Passo 4: Verificar saída do terminal**

O resultado do salvamento no Obsidian é mostrado no terminal:

```bash
[Obsidian] Saved plan to: /path/to/vault/plannotator/Title - Jan 24, 2026 2-30pm.md
```

**Mensagem de Erro**:

```
[Obsidian] Save failed: [mensagem de erro específica]
```

**Erros comuns**:

- Permissão insuficiente → Verifique permissões do diretório do Vault
- Espaço em disco insuficiente → Libere espaço
- Caminho inválido → Confirme que o caminho está correto

#### Problemas de Integração com Bear

**Verificar aplicativo Bear**

- Certifique-se de que o Bear está instalado no macOS
- Certifique-se de que o aplicativo Bear está em execução

**Testar x-callback-url**:

```bash
# Testar no terminal
open "bear://x-callback-url/create?title=Test&text=Hello"
```

**O que você deve ver**: Bear abre e cria uma nova nota

**Verificar saída do terminal**:

```bash
[Bear] Saved plan to Bear
```

**Mensagem de Erro**:

```
[Bear] Save failed: [mensagem de erro específica]
```

**Solução**:

- Reinicie o aplicativo Bear
- Confirme que o Bear está na versão mais recente
- Verifique as configurações de permissão do macOS (permitir que o Bear acesse arquivos)

---

### Problema 6: Problemas de Acesso em Ambiente Remoto

**Sintoma**: Em SSH, Devcontainer ou WSL, não consegue acessar o servidor do navegador local.

**Conceito Central**:

::: info O Que é Ambiente Remoto

Ambiente remoto refere-se a um ambiente de computação remoto acessado via SSH, Devcontainer ou WSL. Neste ambiente, você precisa usar **port forwarding** para mapear a porta remota para local, para poder acessar o servidor remoto no navegador local.

:::

**Soluções**:

#### Passo 1: Configurar Modo Remoto

Configure variáveis de ambiente no ambiente remoto:

::: code-group

```bash [macOS/Linux/WSL]
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_PORT=9999
```

```powershell [Windows]
$env:PLANNOTATOR_REMOTE = "1"
$env:PLANNOTATOR_PORT = "9999"
```

:::

**O que você deve ver**: Terminal mostra "Using remote mode with fixed port: 9999"

#### Passo 2: Configurar Port Forwarding

**Cenário 1: Servidor Remoto SSH**

Edite `~/.ssh/config`:

```
Host your-server
    HostName server.example.com
    User seunome
    LocalForward 9999 localhost:9999
```

**Conectar ao servidor**:

```bash
ssh your-server
```

**O que você deve ver**: Após estabelecer conexão SSH, porta local 9999 é encaminhada para porta remota 9999

**Cenário 2: VS Code Devcontainer**

VS Code Devcontainer geralmente encaminha portas automaticamente.

**Como verificar**:

1. No VS Code, abra a aba "Ports"
2. Procure a porta 9999
3. Certifique-se de que o status da porta é "Forwarded"

**O que você deve ver**: Aba Ports mostra "Local Address: localhost:9999"

**Cenário 3: WSL (Windows Subsystem for Linux)**

WSL usa encaminhamento `localhost` por padrão.

**Como acessar**:

No navegador do Windows, acesse diretamente:

```
http://localhost:9999
```

**O que você deve ver**: UI do Plannotator aparece normalmente

#### Passo 3: Verificar Acesso

1. Inicie o Plannotator no ambiente remoto
2. No navegador local, acesse `http://localhost:9999`
3. Confirme que a página aparece normalmente

**O que você deve ver**: Interface de revisão de plano ou código carrega normalmente

---

### Problema 7: Plano/Anotações Não Salvam Corretamente

**Sintoma**: Após aprovar ou rejeitar o plano, as anotações não são salvas, ou são salvas no local errado.

**Possíveis Causas**:

| Causa | Solução |
| --- | --- |
| Salvamento de plano desabilitado | Verifique a opção "Plan Save" nas configurações |
| Caminho personalizado inválido | Verifique se o caminho é gravável |
| Conteúdo de anotação vazio | Este é o comportamento normal (só salva quando há anotações) |
| Problema de permissão do servidor | Verifique permissões do diretório de salvamento |

**Soluções**:

#### Verificar Configurações de Salvamento de Plano

1. Na UI do Plannotator, clique em configurações (ícone de engrenagem)
2. Veja a seção "Plan Save"
3. Confirme que o switch está habilitado

**O que você deve ver**: Switch "Save plans and annotations" está em azul (estado habilitado)

#### Verificar Caminho de Salvamento

**Local de salvamento padrão**:

```bash
~/.plannotator/plans/  # Planos e anotações são salvos neste diretório
```

**Caminho personalizado**:

Você pode configurar um caminho de salvamento personalizado nas configurações.

**Verificar se o caminho é gravável**:

::: code-group

```bash [macOS/Linux]
ls -la ~/.plannotator
mkdir -p ~/.plannotator/plans
touch ~/.plannotator/plans/test.txt
rm ~/.plannotator/plans/test.txt
```

```powershell [Windows PowerShell]
dir $env:USERPROFILE\.plannotator
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.plannotator\plans"
```

:::

**O que você deve ver**: Comandos executam com sucesso, sem erros de permissão

#### Verificar Saída do Terminal

O resultado do salvamento é mostrado no terminal:

```bash
[Plan] Saved annotations to: ~/.plannotator/annotations/slug.json
[Plan] Saved snapshot to: ~/.plannotator/plans/slug-approved.md
```

**O que você deve ver**: Mensagens de sucesso similares

---

## Resumo da Lição

Nesta lição, você aprendeu:

- **Diagnosticar problemas de porta ocupada**: Usar porta fixa ou encerrar processos que ocupam a porta
- **Lidar com navegador não abrindo**: Identificar modo remoto, acessar manualmente ou configurar navegador
- **Solucionar conteúdo não aparecendo**: Verificar parâmetro Plan, repositório Git, status do diff
- **Resolver falha no upload de imagem**: Verificar formato de arquivo, permissões de diretório, ferramentas de desenvolvedor
- **Corrigir falha de integração**: Verificar configuração, caminho, permissões e saída do terminal
- **Configurar acesso remoto**: Usar PLANNOTATOR_REMOTE e port forwarding
- **Salvar planos e anotações**: Habilitar salvamento de plano e verificar permissões de caminho

**Lembre-se**:

1. A saída do terminal é a melhor fonte de informações de depuração
2. Ambientes remotos precisam de port forwarding
3. Falhas de integração não bloqueiam o fluxo principal
4. Use ferramentas de desenvolvedor para ver detalhes das requisições de rede

## Próximos Passos

Se o problema que você encontrou não está coberto nesta lição, você pode consultar:

- [Solução de Problemas](../troubleshooting/) - Técnicas avançadas de depuração e métodos de análise de logs
- [Referência da API](../../appendix/api-reference/) - Conheça todos os endpoints da API e códigos de erro
- [Modelos de Dados](../../appendix/data-models/) - Entenda a estrutura de dados do Plannotator

---

## Apêndice: Referência do Código-Fonte

<details>
<summary><strong>Clique para expandir e ver as localizações do código-fonte</strong></summary>

> Atualizado em: 2026-01-24

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Lógica de inicialização e retry do servidor | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L79-L335) | 79-335 |
| Tratamento de erro de porta ocupada (revisão de plano) | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L319-L334) | 319-334 |
| Tratamento de erro de porta ocupada (revisão de código) | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L252-L267) | 252-267 |
| Detecção de modo remoto | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts) | Arquivo completo |
| Lógica de abertura do navegador | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts) | Arquivo completo |
| Execução de comandos Git e tratamento de erros | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L36-L147) | 36-147 |
| Processamento de upload de imagem (revisão de plano) | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L153-L174) | 153-174 |
| Processamento de upload de imagem (revisão de código) | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L181-L201) | 181-201 |
| Integração com Obsidian | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts) | Arquivo completo |
| Salvamento de plano | [`packages/server/storage.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/storage.ts) | Arquivo completo |

**Constantes Importantes**:

| Constante | Valor | Descrição |
| --- | --- | --- |
| `MAX_RETRIES` | 5 | Número máximo de tentativas de inicialização do servidor |
| `RETRY_DELAY_MS` | 500 | Delay entre tentativas (milissegundos) |

**Funções Importantes**:

- `startPlannotatorServer()` - Inicia o servidor de revisão de planos
- `startReviewServer()` - Inicia o servidor de revisão de código
- `isRemoteSession()` - Detecta se é ambiente remoto
- `getServerPort()` - Obtém a porta do servidor
- `openBrowser()` - Abre o navegador
- `runGitDiff()` - Executa comando Git diff
- `detectObsidianVaults()` - Detecta vaults do Obsidian
- `saveToObsidian()` - Salva plano no Obsidian
- `saveToBear()` - Salva plano no Bear

</details>
