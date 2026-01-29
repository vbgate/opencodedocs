---
title: "Cloudflared: Expor API Local à Pública | Antigravity-Manager"
sidebarTitle: "Deixar dispositivos remotos acessarem API local"
subtitle: "Túnel Cloudflared com um clique: Expor com segurança API local para pública (não é seguro por padrão)"
description: "Aprenda túnel Cloudflared com um clique das Antigravity Tools. Execute dois métodos de início Quick/Auth, esclareça quando URL aparece, como copiar e testar, e use proxy.auth_mode + forte API Key para exposição mínima. Com anexos local de instalação, erros comuns e ideias de solução, deixando dispositivos remotos também chamarem gateway local estavelmente."
tags:
  - "Cloudflared"
  - "penetração de rede interna"
  - "acesso público"
  - "Tunnel"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 7
---
# Túnel Cloudflared com um clique: Expor com segurança API local para pública (não é seguro por padrão)

Você usará **Túnel Cloudflared com um clique** para expor o gateway de API local das Antigravity Tools para a pública (só quando você ativar explicitamente), permitindo que dispositivos remotos também chamem, enquanto esclarece diferenças de comportamento e limites de risco dos modos Quick e Auth.

## O que você poderá fazer após concluir

- Instalar e iniciar túnel Cloudflared com um clique
- Escolher modo Quick (URL temporário) ou modo Auth (túnel nomeado)
- Copiar URL público para dispositivos remotos acessarem API local
- Entender riscos de segurança do túnel e adotar estratégia de exposição mínima

## Seu dilema atual

Você rodou gateway de API local das Antigravity Tools, mas só a máquina local ou LAN pode acessar. Quer que servidor remoto, dispositivo móvel ou serviço de nuvem também possam chamar este gateway, mas não tem IP público, e não quer lidar com soluções complexas de implantação de servidor.

## Quando usar esta estratégia

- Você não tem IP público, mas precisa de dispositivos remotos acessarem API local
- Você está em fase de teste/desenvolvimento, quer expor serviço rapidamente para externo
- Você não quer comprar servidor para implantar, só quer usar máquina existente

::: warning Aviso de segurança
Expor para pública tem riscos! Certamente:
1. Configure API Key forte (`proxy.auth_mode=strict/all_except_health`)
2. Só ative túnel quando necessário, desative após usar
3. Verifique logs do Monitor regularmente, encontre anomalia e pare imediatamente
:::

## 🎒 Preparação antes de começar

::: warning Pré-requisitos
- Você já iniciou serviço de proxy reverso (interruptor de "API Proxy" na página está ligado)
- Você já adicionou pelo menos uma conta disponível
:::

## O que é Cloudflared?

**Cloudflared** é cliente de túnel fornecido pela Cloudflare, ele estabelece um canal criptografado entre sua máquina e Cloudflare, mapeando serviço HTTP local em uma URL acessível pela pública. As Antigravity Tools tornam instalação, início, parada e cópia de URL em operações de UI, convenientes para você completar rapidamente ciclo de verificação.

### Plataformas suportadas

Lógica de "download automático + instalação" embutida no projeto só cobre as seguintes combinações de OS/arquitetura (outras plataformas reportarão `Unsupported platform`).

| Sistema operacional | Arquitetura | Estado suportado |
| --- | --- | --- |
| macOS | Apple Silicon (arm64) | ✅ |
| macOS | Intel (x86_64) | ✅ |
| Linux | x86_64 | ✅ |
| Linux | ARM64 | ✅ |
| Windows | x86_64 | ✅ |

### Comparação de dois modos

| Característica | Modo Quick | Modo Auth |
| --- | --- | --- |
| **Tipo de URL** | `https://xxx.trycloudflare.com` (URL temporário extraído dos logs) | Aplicativo pode não extrair URL automaticamente (depende de logs do cloudflared); nome de domínio de entrada conforme configuração no lado Cloudflare |
| **Precisa de Token** | ❌ Não precisa | ✅ Precisa (obtido do console Cloudflare) |
| **Estabilidade** | URL pode mudar após reinício de processo | Depende de como você configura no lado Cloudflare (aplicativo só responsável por iniciar processo) |
| **Cenário adequado** | Teste temporário, verificação rápida | Serviço estável de longo prazo, ambiente de produção |
| **Grau de recomendação** | ⭐⭐⭐ Para teste | ⭐⭐⭐⭐⭐ Para produção |

::: info Características de URL do modo Quick
URL do modo Quick pode mudar cada vez que inicia, e é subdomínio `*.trycloudflare.com` gerado aleatoriamente. Se você precisa de URL fixa, deve usar modo Auth e vincular domínio no console Cloudflare.
:::

## Siga-me

### Passo 1: Abra página API Proxy

**Por que**
Encontrar entrada de configuração Cloudflared.

1. Abra Antigravity Tools
2. Clique na navegação esquerda **"API Proxy"** (proxy reverso)
3. Encontre cartão **"Public Access (Cloudflared)"** (parte inferior da página, ícone laranja)

**Você deve ver**: Um cartão expansível, mostrando "Cloudflared not installed" (não instalado) ou "Installed: xxx" (instalado).

### Passo 2: Instalar Cloudflared

**Por que**
Baixar e instalar binário Cloudflared em pasta `bin` do diretório de dados.

#### Se não instalado

1. Clique no botão **"Install"** (instalar)
2. Espere download completar (segundo velocidade de rede, aproximadamente 10-30 segundos)

**Você deve ver**:
- Botão mostra animação de carregamento
- Após completo, exibe "Cloudflared installed successfully"
- Cartão mostra "Installed: cloudflared version 202X.X.X"

#### Se já instalado

Pule este passo, vá diretamente para Passo 3.

::: tip Local de instalação
Binário Cloudflared será instalado em pasta `bin/` do "diretório de dados" (nome do diretório de dados é `.antigravity_tools`).

::: code-group

```bash [macOS/Linux]
ls -la "$HOME/.antigravity_tools/bin/"
```

```powershell [Windows]
Get-ChildItem "$HOME\.antigravity_tools\bin\"
```

:::

Se você ainda não sabe onde está o diretório de dados, primeiro veja **[Primeira execução: diretório de dados, logs, bandeja e inicialização automática](../../start/first-run-data/)**.
:::

### Passo 3: Escolher modo de túnel

**Por que**
Escolha o modo adequado conforme seu cenário de uso.

1. No cartão, encontre área de seleção de modo (dois botões grandes)
2. Clique para escolher:

| Modo | Descrição | Quando escolher |
| --- | --- | --- |
| **Quick Tunnel** | Gera automaticamente URL temporária (`*.trycloudflare.com`) | Teste rápido, acesso temporário |
| **Named Tunnel** | Usa conta Cloudflare e domínio personalizado | Ambiente de produção, necessidade de domínio fixo |

::: tip Recomendação de escolha
Se é primeira vez que usa, **primeiro escolha modo Quick**, verifique rapidamente se a funcionalidade atende necessidades.
:::

### Passo 4: Configurar parâmetros

**Por que**
Preencher parâmetros necessários e opções conforme o modo.

#### Modo Quick

1. Porta usará automaticamente porta Proxy atual (padrão é `8045`, conforme configuração real)
2. Marque **"Use HTTP/2"** (padrão marcado)

#### Modo Auth

1. Preencha **Tunnel Token** (obtido do console Cloudflare)
2. Porta também usa porta Proxy atual (conforme configuração real)
3. Marque **"Use HTTP/2"** (padrão marcado)

::: info Como obter Tunnel Token?
1. Faça login no [console Cloudflare Zero Trust](https://dash.cloudflare.com/sign-up-to-cloudflare-zero-trust)
2. Entre em **"Networks"** → **"Tunnels"**
3. Clique **"Create a tunnel"** → **"Remote browser"** ou **"Cloudflared"**
4. Copie Token gerado (string longa como `eyJhIjoiNj...`)
:::

#### Descrição da opção HTTP/2

`Use HTTP/2` fará cloudflared iniciar com `--protocol http2`. Documento no projeto descreve como "mais compatível (recomendado para usuários da China continental)", e padrão ativado.

::: tip Recomendado marcar
**Opção HTTP/2 é recomendada por padrão**, especialmente em ambiente de rede doméstica.
:::

### Passo 5: Iniciar túnel

**Por que**
Estabelecer canal criptografado de local para Cloudflare.

1. Clique no interruptor no canto superior direito do cartão (ou botão **"Start Tunnel"** após expandir)
2. Espere túnel iniciar (aproximadamente 5-10 segundos)

**Você deve ver**:
- Ponto verde no canto superior direito do cartão
- Exibe **"Tunnel Running"**
- Mostra URL público (como `https://random-name.trycloudflare.com`)
- No lado direito há botão de cópia: botão só mostra primeiros 20 caracteres da URL, mas clicar copia URL completa

::: warning Modo Auth pode não ver URL
Aplicativo atual só extrai URLs como `*.trycloudflare.com` dos logs do cloudflared para exibir. Modo Auth geralmente não exibirá este tipo de domínio, então você pode só ver "Running", mas não URL. Neste momento, nome de domínio de entrada conforme configuração no lado Cloudflare.
:::

### Passo 6: Testar acesso público

**Por que**
Verificar se túnel está funcionando normalmente.

#### Verificação de saúde

::: code-group

```bash [macOS/Linux]
#Substitua por URL de túnel real
curl -s "https://your-url.trycloudflare.com/healthz"
```

```powershell [Windows]
Invoke-RestMethod "https://your-url.trycloudflare.com/healthz"
```

:::

**Você deve ver**: `{"status":"ok"}`

#### Consultar lista de modelos

::: code-group

```bash [macOS/Linux]
#Se você ativou autenticação, substitua <proxy_api_key> por sua chave
curl -s \
  -H "Authorization: Bearer <proxy_api_key>" \
  "https://your-url.trycloudflare.com/v1/models"
```

```powershell [Windows]
Invoke-RestMethod \
  -Headers @{ Authorization = "Bearer <proxy_api_key>" } \
  "https://your-url.trycloudflare.com/v1/models"
```

:::

**Você deve ver**: Retornar JSON de lista de modelos.

::: tip Note HTTPS
URL de túnel é protocolo HTTPS, sem necessidade de configuração adicional de certificado.
:::

#### Usar SDK OpenAI para chamar (exemplo)

```python
import openai

#Usar URL público
client = openai.OpenAI(
    api_key="sua-chave-proxy-api",  # Se ativou autenticação
    base_url="https://your-url.trycloudflare.com/v1"
)

#modelId conforme retorno real de /v1/models

response = client.chat.completions.create(
    model="<modelId>",
    messages=[{"role": "user", "content": "olá"}]
)

print(response.choices[0].message.content)
```

::: warning Lembrete de autenticação
Se você ativou autenticação na página "API Proxy" (`proxy.auth_mode=strict/all_except_health`), solicitação deve trazer API Key:
- Header: `Authorization: Bearer your-api-key`
- Ou: `x-api-key: your-api-key`
:::

### Passo 7: Parar túnel

**Por que**
Desative após usar, reduzindo tempo de exposição de segurança.

1. Clique no interruptor no canto superior direito do cartão (ou botão **"Stop Tunnel"** após expandir)
2. Espere parada completar (aproximadamente 2 segundos)

**Você deve ver**:
- Ponto verde desaparece
- Exibe **"Tunnel Stopped"**
- URL público desaparece

## Ponto de verificação ✅

Após concluir os passos acima, você deve ser capaz de:

- [ ] Instalar binário Cloudflared
- [ ] Alternar entre modos Quick e Auth
- [ ] Iniciar túnel e obter URL público
- [ ] Chamar API local através de URL público
- [ ] Parar túnel

## Avisos sobre armadilhas

### Problema 1: Falha de instalação (timeout de download)

**Sintoma**: Após clicar "Install", sem resposta por muito tempo ou indicação de falha de download.

**Causa**: Problema de rede (especialmente acessando GitHub Releases da China).

**Solução**:
1. Verifique conexão de rede
2. Use VPN ou proxy
3. Download manual: [Cloudflared Releases](https://github.com/cloudflare/cloudflared/releases), escolha versão de plataforma correspondente, coloque manualmente na pasta `bin` do diretório de dados e dê permissão de execução (macOS/Linux).

### Problema 2: Falha ao iniciar túnel

**Sintoma**: Após clicar iniciar, URL não aparece ou indica erro.

**Causa**:
- No modo Auth, Token inválido
- Serviço de proxy reverso local não iniciado
- Porta ocupada

**Solução**:
1. Modo Auth: verifique se Token está correto, se expirou
2. Verifique se interruptor de proxy reverso na página "API Proxy" está ligado
3. Verifique se porta `8045` está ocupada por outro programa

### Problema 3: URL público não pode acessar

**Sintoma**: curl ou SDK chama URL público e expira.

**Causa**:
- Processo de túnel saiu inesperadamente
- Problema de rede Cloudflare
- Firewall local bloqueando

**Solução**:
1. Verifique se cartão mostra "Tunnel Running"
2. Verifique se cartão tem prompt de erro (texto vermelho)
3. Verifique configuração de firewall local
4. Tente reiniciar túnel

### Problema 4: Falha de autenticação (401)

**Sintoma**: Solicitação retorna erro 401.

**Causa**: Proxy ativou autenticação, mas solicitação não trouxe API Key.

**Solução**:
1. Verifique modo de autenticação na página "API Proxy"
2. Adicione Header correto na solicitação:
    ```bash
    curl -H "Authorization: Bearer your-api-key" \
          https://your-url.trycloudflare.com/v1/models
    ```

## Resumo desta aula

Túnel Cloudflared é ferramenta excelente para expor rapidamente serviço local. Através desta aula, você aprendeu:

- **Instalação com um clique**: download automático e instalação de Cloudflared na UI
- **Dois modos**: escolha entre Quick (temporário) e Auth (nomeado)
- **Acesso público**: copie URL HTTPS, dispositivos remotos podem chamar diretamente
- **Consciência de segurança**: ative autenticação, desative após usar, verifique logs regularmente

Lembre-se: **túnel é faca de dois gumes**, bem usado é conveniente, mal usado tem riscos. Sempre siga princípio de exposição mínima.

## Próxima aula

Na próxima aula, aprenderemos **[Explicação completa de configuração: AppConfig/ProxyConfig, local de gravação e semântica de atualização a quente](/pt/lbjlaq/Antigravity-Manager/advanced/config/)**.

Você aprenderá:
- Campos completos de AppConfig e ProxyConfig
- Local de gravação de arquivo de configuração
- Quais configurações precisam reiniciar, quais podem atualizar a quente

---

## Apêndice: Referências de código-fonte

<details>
<summary><strong>Clique para expandir e ver localizações do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Funcionalidade | Caminho do arquivo | Número da linha |
| --- | --- | --- |
| Nome do diretório de dados (`.antigravity_tools`) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| Estrutura de configuração e valores padrão (`CloudflaredConfig`, `TunnelMode`) | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L16-L59) | 16-59 |
| Regras de URL de download automático (OS/arquitetura suportados) | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L70-L88) | 70-88 |
| Lógica de instalação (download/gravação/descompressão/permissão) | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L147-L211) | 147-211 |
| Parâmetros de início Quick/Auth (`tunnel --url` vs `tunnel run --token`) | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L233-L266) | 233-266 |
| Regras de extração de URL (só identifica `*.trycloudflare.com`) | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L390-L413) | 390-413 |
| Interface de comandos Tauri (check/install/start/stop/get_status) | [`src-tauri/src/commands/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/cloudflared.rs#L6-L118) | 6-118 |
| UI de cartão (modo/Token/HTTP2/exibição de URL e cópia) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L1597-L1753) | 1597-1753 |
| Antes de iniciar precisa Proxy Running (toast + return) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L256-L306) | 256-306 |

**Constantes-chave**:
- `DATA_DIR = ".antigravity_tools"`: nome do diretório de dados (código-fonte: `src-tauri/src/modules/account.rs`)

**Funções-chave**:
- `get_download_url()`: costura endereço de download de GitHub Releases (código-fonte: `src-tauri/src/modules/cloudflared.rs`)
- `extract_tunnel_url()`: extrai URL do modo Quick dos logs (código-fonte: `src-tauri/src/modules/cloudflared.rs`)

</details>
