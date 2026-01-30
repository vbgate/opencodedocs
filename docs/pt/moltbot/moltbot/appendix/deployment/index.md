---
title: "Guia Completo de Deploy do Moltbot: Local, Docker, Nix, Fly.io, Hetzner VPS e exe.dev"
sidebarTitle: "Manter o Gateway 24/7"
subtitle: "Opções de Deploy"
description: "Aprenda a fazer deploy do Moltbot em diferentes plataformas: instalação local, conteinerização com Docker, configuração declarativa com Nix, deploy na nuvem com Fly.io, hospedagem em VPS Hetzner e hospedagem virtual exe.dev. Conheça as características, cenários de uso, etapas de configuração e melhores práticas de segurança de cada método."
tags:
  - "Deploy"
  - "Instalação"
  - "Docker"
  - "Nix"
  - "Cloud"
prerequisite:
  - "start-getting-started"
order: 360
---

# Opções de Deploy

## O que você poderá fazer após este tutorial

Após completar esta lição, você será capaz de:

- Escolher o método de deploy mais adequado para suas necessidades (local, Docker, Nix, nuvem)
- Instalar e executar o Moltbot em um ambiente local
- Fazer deploy containerizado do Gateway usando Docker
- Gerenciar o Moltbot declarativamente através do Nix
- Fazer deploy do Gateway em Fly.io, Hetzner VPS ou exe.dev
- Configurar acesso remoto e melhores práticas de segurança

## Sua situação atual

Você quer usar o Moltbot mas não tem certeza qual método de deploy escolher:

- A instalação local é a mais simples, mas não funciona quando o computador está desligado
- Quer executar na nuvem 24/7, mas não sabe qual serviço de nuvem é adequado
- Tem medo de configurar algo errado e quer encontrar o esquema de deploy mais seguro
- Precisa acessar o mesmo Gateway de vários dispositivos, mas não sabe como implementar isso

## Quando usar cada método

| Método de Deploy | Cenário de Uso |
|---|---|
| **Instalação Local** | Computador pessoal, testes de desenvolvimento, início rápido |
| **Docker** | Ambiente isolado, deploy em servidor, reconstrução rápida |
| **Nix** | Deploy reprodutível, usuários de NixOS/Home Manager, necessidade de rollback de versão |
| **Fly.io** | Execução 24/7 na nuvem, HTTPS automático, operação simplificada |
| **Hetzner VPS** | VPS próprio, controle total, 24/7 de baixo custo |
| **exe.dev** | Hospedagem Linux barata, sem necessidade de configurar VPS próprio |

## 🎒 Antes de começar

Antes de começar, verifique:

::: warning Requisitos de Ambiente
- Node.js ≥ 22 (obrigatório para instalação local)
- Docker Desktop + Docker Compose v2 (obrigatório para deploy Docker)
- Nix flakes + Home Manager (obrigatório para deploy Nix)
- Cliente SSH (obrigatório para acesso a deploy na nuvem)
- Conhecimento básico de operações no terminal (copiar, colar, executar comandos)
:::

::: tip Ferramentas Recomendadas
 - Se esta é sua primeira vez com Moltbot, sugerimos começar pelo [Guia de Início Rápido](../../start/getting-started/)
- Usar assistentes de IA (como Claude, Cursor) pode acelerar o processo de configuração
- Guarde bem suas API Keys (Anthropic, OpenAI, etc.) e credenciais de canais
:::

## Comparativo de Métodos de Deploy

### Instalação Local

**Adequado para**: Computador pessoal, testes de desenvolvimento, início rápido

**Vantagens**:
- ✅ Método mais simples e direto, sem infraestrutura adicional
- ✅ Inicialização rápida, fácil depuração
- ✅ Alterações na configuração entram em vigor imediatamente

**Desvantagens**:
- ❌ Não funciona quando a máquina está desligada
- ❌ Não adequado para serviço 24/7
- ❌ Sincronização entre múltiplos dispositivos requer configuração adicional

### Deploy Docker

**Adequado para**: Deploy em servidor, ambiente isolado, CI/CD

**Vantagens**:
- ✅ Isolamento de ambiente, fácil limpeza e reconstrução
- ✅ Deploy unificado em múltiplas plataformas
- ✅ Suporte à execução de ferramentas em sandbox isolado
- ✅ Configuração pode ser versionada

**Desvantagens**:
- ❌ Requer conhecimento de Docker
- ❌ Configuração inicial ligeiramente mais complexa

### Deploy Nix

**Adequado para**: Usuários NixOS, usuários Home Manager, necessidade de deploy reprodutível

**Vantagens**:
- ✅ Configuração declarativa, reprodutível
- ✅ Rollback rápido (`home-manager switch --rollback`)
- ✅ Todas as versões de componentes são fixadas
- ✅ Gateway + app macOS + ferramentas totalmente gerenciados

**Desvantagens**:
- ❌ Curva de aprendizado íngreme
- ❌ Requer familiaridade com o ecossistema Nix

### Deploy em Nuvem (Fly.io / Hetzner / exe.dev)

**Adequado para**: 24/7 online, acesso remoto, colaboração em equipe

**Vantagens**:
- ✅ Online 24/7, não depende da máquina local
- ✅ HTTPS automático, sem necessidade de gerenciamento manual de certificados
- ✅ Escalabilidade rápida
- ✅ Suporte a acesso remoto de múltiplos dispositivos

**Desvantagens**:
- ❌ Requer pagamento de taxas de serviço de nuvem
- ❌ Requer conhecimento básico de operações e manutenção
- ❌ Dados armazenados em serviços de terceiros

---

## Instalação Local

### Instalação Global via npm/pnpm/bun (Recomendado)

Instalar a partir do repositório oficial npm é o mais simples:

::: code-group

```bash [npm]
# Usar npm para instalar
npm install -g clawdbot@latest
```

```bash [pnpm]
# Usar pnpm (recomendado)
pnpm add -g clawdbot@latest
```

```bash [bun]
# Usar bun (mais rápido)
bun add -g clawdbot@latest
```

:::

Após a instalação, execute o assistente:

```bash
clawdbot onboard --install-daemon
```

Este comando irá:
- Guiá-lo através da configuração do Gateway, canais e modelos
- Instalar o daemon do Gateway (macOS launchd / Linux systemd)
- Configurar o arquivo de configuração padrão `~/.clawdbot/clawdbot.json`

### Compilar a Partir do Código Fonte

Se você precisar compilar a partir do código fonte (desenvolvimento, personalização):

::: code-group

```bash [macOS/Linux]
# Clonar o repositório
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot

# Instalar dependências e compilar
pnpm install
pnpm ui:build
pnpm build

# Instalar e executar
pnpm clawdbot onboard --install-daemon
```

```bash [Windows (WSL2)]
# Compilar no WSL2 (recomendado)
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot

wsl.exe -d Ubuntu bash -c "pnpm install && pnpm ui:build && pnpm build"
```

:::

::: info Ciclo de Desenvolvimento
Execute `pnpm gateway:watch` para recarregar o Gateway automaticamente quando o código for modificado.
:::

---

## Deploy Docker

### Início Rápido (Recomendado)

Use o script fornecido para deploy com um único comando:

```bash
./docker-setup.sh
```

Este script irá:
- Construir a imagem do Gateway
- Executar o assistente de onboarding
- Imprimir dicas de configuração de provedores
- Iniciar o Gateway via Docker Compose
- Gerar o token do Gateway e escrever no `.env`

Após a conclusão:
1. Abra `http://127.0.0.1:18789/` no navegador
2. Cole o token na configuração da UI de Controle

O script criará no host:
- `~/.clawdbot/` (diretório de configuração)
- `~/clawd` (diretório de workspace)

### Processo Manual

Se você precisar personalizar a configuração do Docker Compose:

```bash
# Construir a imagem
docker build -t clawdbot:local -f Dockerfile .

# Executar o container CLI para configurar
docker compose run --rm clawdbot-cli onboard

# Iniciar o Gateway
docker compose up -d clawdbot-gateway
```

### Mounts Adicionais (Opcional)

Se você quiser montar diretórios adicionais do host no container, defina a variável de ambiente antes de executar o `docker-setup.sh`:

```bash
export CLAWDBOT_EXTRA_MOUNTS="$HOME/.codex:/home/node/.codex:ro,$HOME/github:/home/node/github:rw"
./docker-setup.sh
```

**Notas**:
- Os caminhos devem ser compartilhados com o Docker Desktop (macOS/Windows)
- Se você modificar o `CLAWDBOT_EXTRA_MOUNTS`, precisará reexecutar o `docker-setup.sh` para regenerar o arquivo compose

### Persistência do Diretório Home do Container (Opcional)

Se você deseja que o `/home/node` persista entre reconstruções do container:

```bash
export CLAWDBOT_HOME_VOLUME="clawdbot_home"
./docker-setup.sh
```

**Notas**:
- O volume nomeado persiste até ser excluído com `docker volume rm`
- Pode ser combinado com o `CLAWDBOT_EXTRA_MOUNTS`

### Instalação de Pacotes de Sistema Adicionais (Opcional)

Se você precisa instalar pacotes de sistema adicionais na imagem (por exemplo, ferramentas de build, bibliotecas de mídia):

```bash
export CLAWDBOT_DOCKER_APT_PACKAGES="ffmpeg build-essential"
./docker-setup.sh
```

### Configuração de Canais (Opcional)

Use o container CLI para configurar canais:

::: code-group

```bash [WhatsApp]
# Login no WhatsApp (exibirá QR code)
docker compose run --rm clawdbot-cli channels login
```

```bash [Telegram]
# Adicionar bot do Telegram
docker compose run --rm clawdbot-cli channels add --channel telegram --token "<token>"
```

```bash [Discord]
# Adicionar bot do Discord
docker compose run --rm clawdbot-cli channels add --channel discord --token "<token>"
```

:::

### Health Check

```bash
docker compose exec clawdbot-gateway node dist/index.js health --token "$CLAWDBOT_GATEWAY_TOKEN"
```

### Agent Sandbox (Gateway no Host + Ferramentas Docker)

O Docker também pode ser usado para isolar a execução de ferramentas em sandbox para sessões não-main. Veja: [Sandboxing](https://docs.clawd.bot/gateway/sandboxing)

---

## Instalação Nix

**Método Recomendado**: Usar o módulo Home Manager [nix-clawdbot](https://github.com/clawdbot/nix-clawdbot)

### Início Rápido

Cole este texto no seu assistente de IA (Claude, Cursor, etc.):

```text
Quero configurar o nix-clawdbot no meu Mac.
Repositório: github:clawdbot/nix-clawdbot

O que preciso que você faça:
1. Verificar se o Determinate Nix está instalado (se não, instalar)
2. Criar um flake local em ~/code/clawdbot-local usando templates/agent-first/flake.nix
3. Me ajudar a criar um bot do Telegram (@BotFather) e obter meu chat ID (@userinfobot)
4. Configurar secrets (bot token, Anthropic key) - arquivos simples em ~/.secrets/ está ok
5. Preencher os placeholders do template e executar home-manager switch
6. Verificar: launchd rodando, bot responde mensagens

Consulte o README do nix-clawdbot para opções do módulo.
```

> **📦 Guia Completo**: [github.com/clawdbot/nix-clawdbot](https://github.com/clawdbot/nix-clawdbot)

### Comportamento em Modo Nix

Quando `CLAWDBOT_NIX_MODE=1` é definido (nix-clawdbot define automaticamente):

- A configuração torna-se determinística, desabilitando fluxos de instalação automática
- Se houver dependências ausentes, exibe mensagens de correção específicas do Nix
- A interface mostra um banner de modo Nix somente leitura

No macOS, aplicativos GUI não herdam automaticamente variáveis de ambiente do shell. Você também pode habilitar o modo Nix via defaults:

```bash
defaults write com.clawdbot.mac clawdbot.nixMode -bool true
```

### Caminhos de Configuração e Estado

No modo Nix, defina explicitamente estas variáveis de ambiente:

- `CLAWDBOT_STATE_DIR` (padrão: `~/.clawdbot`)
- `CLAWDBOT_CONFIG_PATH` (padrão: `$CLAWDBOT_STATE_DIR/clawdbot.json`)

Assim, o estado de runtime e configuração permanecem fora do armazenamento imutável gerenciado pelo Nix.

---

## Deploy Fly.io

**Ideal para**: Execução 24/7 na nuvem, operação simplificada, HTTPS automático

### O que você precisa

- [flyctl CLI](https://fly.io/docs/hands-on/install-flyctl/)
- Conta Fly.io (camada gratuita disponível)
- Autenticação do modelo: Anthropic API Key (ou Key de outro provedor)
- Credenciais de canais: Discord bot token, Telegram token, etc.

### Passo 1: Criar Aplicação Fly

```bash
# Clonar o repositório
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot

# Criar nova aplicação Fly (escolha seu próprio nome)
fly apps create my-clawdbot

# Criar volume persistente (1GB geralmente é suficiente)
fly volumes create clawdbot_data --size 1 --region iad
```

::: tip Escolha de Região
Escolha a região mais próxima de você. Opções comuns:
- `lhr` (Londres)
- `iad` (Virgínia)
- `sjc` (São José)
:::

### Passo 2: Configurar fly.toml

Edite o `fly.toml` para corresponder ao nome da sua aplicação e necessidades.

::: warning Nota de Segurança
A configuração padrão expõe a URL pública. Para deploys endurecidos sem IP público, veja [Deploy Privado](#hardened-private-deployment), ou use o `fly.private.toml`.
:::

```toml
app = "my-clawdbot"  # seu nome de aplicação
primary_region = "iad"

[build]
  dockerfile = "Dockerfile"

[env]
  NODE_ENV = "production"
  CLAWDBOT_PREFER_PNPM = "1"
  CLAWDBOT_STATE_DIR = "/data"
  NODE_OPTIONS = "--max-old-space-size=1536"

[processes]
  app = "node dist/index.js gateway --allow-unconfigured --port 3000 --bind lan"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 1
  processes = ["app"]

[[vm]]
  size = "shared-cpu-2x"
  memory = "2048mb"

[mounts]
  source = "clawdbot_data"
  destination = "/data"
```

**Explicação das Configurações Principais**:

| Configuração | Motivo |
|---|---|
| `--bind lan` | Liga a `0.0.0.0` para que o proxy do Fly possa acessar o Gateway |
| `--allow-unconfigured` | Inicia sem arquivo de configuração (você o criará depois) |
| `internal_port = 3000` | Deve corresponder a `--port 3000` (ou `CLAWDBOT_GATEWAY_PORT`) para health checks do Fly |
| `memory = "2048mb"` | 512MB é muito pouco; recomendado 2GB |
| `CLAWDBOT_STATE_DIR = "/data"` | Persiste estado no volume |

### Passo 3: Configurar Secrets

```bash
# Obrigatório: token do Gateway (para binding não-loopback)
fly secrets set CLAWDBOT_GATEWAY_TOKEN=$(openssl rand -hex 32)

# API Keys dos provedores de modelos
fly secrets set ANTHROPIC_API_KEY=sk-ant-...
fly secrets set OPENAI_API_KEY=sk-...
fly secrets set GOOGLE_API_KEY=...

# Tokens de canais
fly secrets set DISCORD_BOT_TOKEN=MTQ...
```

::: tip Recomendação de Segurança
Binding não-loopback (`--bind lan`) requer `CLAWDBOT_GATEWAY_TOKEN` para segurança. Trate esses tokens como senhas. Para todas as API keys e tokens, prefira usar variáveis de ambiente em vez de arquivos de configuração — isso evita que credenciais sejam expostas no `clawdbot.json`.
:::

### Passo 4: Deploy

```bash
fly deploy
```

O deploy inicial construirá a imagem Docker (aproximadamente 2-3 minutos). Deploys subsequentes serão mais rápidos.

Após o deploy, verifique:

```bash
fly status
fly logs
```

Você deve ver algo como:

```
[gateway] listening on ws://0.0.0.0:3000 (PID xxx)
[discord] logged in to discord as xxx
```

### Passo 5: Criar Arquivo de Configuração

Faça SSH na máquina para criar o arquivo de configuração:

```bash
fly ssh console
```

Crie o diretório de configuração e arquivo:

```bash
mkdir -p /data
cat > /data/clawdbot.json << 'EOF'
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-opus-4-5",
        "fallbacks": ["anthropic/claude-sonnet-4-5", "openai/gpt-4o"]
      },
      "maxConcurrent": 4
    },
    "list": [
      {
        "id": "main",
        "default": true
      }
    ]
  },
  "auth": {
    "profiles": {
      "anthropic:default": { "mode": "token", "provider": "anthropic" },
      "openai:default": { "mode": "token", "provider": "openai" }
    }
  },
  "bindings": [
    {
      "agentId": "main",
      "match": { "channel": "discord" }
    }
  ],
  "channels": {
    "discord": {
      "enabled": true,
      "groupPolicy": "allowlist",
      "guilds": {
        "YOUR_GUILD_ID": {
          "channels": { "general": { "allow": true } },
          "requireMention": false
        }
      }
    }
  },
  "gateway": {
    "mode": "local",
    "bind": "auto"
  },
  "meta": {
    "lastTouchedVersion": "2026.1.25"
  }
}
EOF
```

Reinicie para aplicar a configuração:

```bash
exit
fly machine restart <machine-id>
```

### Passo 6: Acessar o Gateway

**Control UI**:

```bash
fly open
```

Ou acesse: `https://my-clawdbot.fly.dev/`

Cole seu token do Gateway (do `CLAWDBOT_GATEWAY_TOKEN`) para autenticar.

**Logs**:

```bash
fly logs              # logs em tempo real
fly logs --no-tail    # logs recentes
```

**Console SSH**:

```bash
fly ssh console
```

### Resolução de Problemas

**"App is not listening on expected address"**:

O Gateway está fazendo bind em `127.0.0.1` em vez de `0.0.0.0`.

**Correção**: Adicione `--bind lan` ao comando do processo no `fly.toml`.

**Falha no health check / Connection refused**:

O Fly não consegue acessar o Gateway na porta configurada.

**Correção**: Certifique-se de que o `internal_port` corresponda à porta do Gateway (defina `--port 3000` ou `CLAWDBOT_GATEWAY_PORT=3000`).

**OOM / Problemas de memória**:

O container reinicia continuamente ou é encerrado. Sinais: `SIGABRT`, `v8::internal::Runtime_AllocateInYoungGeneration` ou reinícios silenciosos.

**Correção**: Aumente a memória no `fly.toml`:

```toml
[[vm]]
  memory = "2048mb"
```

Ou atualize a máquina existente:

```bash
fly machine update <machine-id> --vm-memory 2048 -y
```

**Nota**: 512MB é muito pouco. 1GB pode funcionar, mas pode OOM sob carga ou logs detalhados. **Recomendado 2GB**.

**Problema de Lock do Gateway**:

O Gateway recusa-se a iniciar com erro "already running".

Isso ocorre quando o container reinicia mas o arquivo de lock PID persiste no volume.

**Correção**: Remova o arquivo de lock:

```bash
fly ssh console --command "rm -f /data/gateway.*.lock"
fly machine restart <machine-id>
```

Os arquivos de lock estão em `/data/gateway.*.lock` (não em subdiretórios).

### Deploy Privado (Endurecido)

Por padrão, o Fly.io aloca um IP público, tornando seu Gateway acessível em `https://your-app.fly.dev`. Isso é conveniente, mas também significa que seu deploy pode ser descoberto por scanners da internet (Shodan, Censys, etc.).

**Use o template privado** para um deploy endurecido sem exposição pública:

::: info Cenários de Deploy Privado
- Você só faz chamadas/mensagens **de saída** (sem webhooks de entrada)
- Você usa túneis **ngrok ou Tailscale** para quaisquer callbacks de webhook
- Você acessa o Gateway via **SSH, proxy ou WireGuard** em vez do navegador
- Você quer que o deploy esteja **oculto de scanners da internet**
:::

**Configuração**:

Use o `fly.private.toml` em vez da configuração padrão:

```bash
# Deploy usando configuração privada
fly deploy -c fly.private.toml
```

Ou converta um deploy existente:

```bash
# Listar IPs atuais
fly ips list -a my-clawdbot

# Liberar IP público
fly ips release <public-ipv4> -a my-clawdbot
fly ips release <public-ipv6> -a my-clawdbot

# Mudar para configuração privada para que deploys futuros não realoquem IP público
fly deploy -c fly.private.toml

# Alocar apenas IPv6 privado
fly ips allocate-v6 --private -a my-clawdbot
```

**Acessar Deploy Privado**:

Como não há URL pública, use um dos métodos:

**Opção 1: Proxy Local (Mais Simples)**

```bash
# Encaminhar porta local 3000 para a aplicação
fly proxy 3000:3000 -a my-clawdbot

# Então abra http://localhost:3000 no navegador
```

**Opção 2: VPN WireGuard**

```bash
# Criar configuração WireGuard (uma vez)
fly wireguard create

# Importar para cliente WireGuard, então acesse via IPv6 interno
# Exemplo: http://[fdaa:x:x:x:x::x]:3000
```

**Opção 3: SSH Apenas**

```bash
fly ssh console -a my-clawdbot
```

### Custos

Usando a configuração recomendada (`shared-cpu-2x`, 2GB RAM):
- Aproximadamente $10-15/mês dependendo do uso
- A camada gratuita inclui algumas quotas

Veja: [Preços Fly.io](https://fly.io/docs/about/pricing/)

---

## Deploy Hetzner VPS

**Ideal para**: VPS próprio, controle total, execução 24/7 de baixo custo

### Objetivo

Executar o Gateway Moltbot persistente no Hetzner VPS usando Docker, com estado persistente, binários built-in e comportamento seguro de reinicialização.

Se você quer "Moltbot 24/7 por cerca de $5/mês", esta é a configuração mais simples e confiável.

### O que você precisa

- Hetzner VPS com acesso root
- Acesso SSH do seu laptop
- Conforto básico com SSH + copiar/colar
- Aproximadamente 20 minutos
- Docker e Docker Compose
- Credenciais de autenticação do modelo
- Credenciais de provedores opcionais (QR WhatsApp, token Telegram bot, OAuth Gmail)

### Passo 1: Configurar o VPS

Crie um VPS Ubuntu ou Debian na Hetzner.

Conecte-se como root:

```bash
ssh root@YOUR_VPS_IP
```

Este guia assume que o VPS é stateful. Não o trate como infraestrutura descartável.

### Passo 2: Instalar Docker no VPS

```bash
apt-get update
apt-get install -y git curl ca-certificates
curl -fsSL https://get.docker.com | sh
```

Verifique:

```bash
docker --version
docker compose version
```

### Passo 3: Clonar o Repositório Moltbot

```bash
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot
```

Este guia assume que você vai construir uma imagem personalizada para garantir a persistência dos binários.

### Passo 4: Criar Diretórios Persistentes no Host

Containers Docker são temporários. Todo estado de longa duração deve existir no host.

```bash
mkdir -p /root/.clawdbot
mkdir -p /root/clawd

# Definir propriedade para o usuário do container (uid 1000):
chown -R 1000:1000 /root/.clawdbot
chown -R 1000:1000 /root/clawd
```

### Passo 5: Configurar Variáveis de Ambiente

Crie o arquivo `.env` na raiz do repositório.

```bash
CLAWDBOT_IMAGE=clawdbot:latest
CLAWDBOT_GATEWAY_TOKEN=change-me-now
CLAWDBOT_GATEWAY_BIND=lan
CLAWDBOT_GATEWAY_PORT=18789
CLAWDBOT_CONFIG_DIR=/root/.clawdbot
CLAWDBOT_WORKSPACE_DIR=/root/clawd
GOG_KEYRING_PASSWORD=change-me-now
XDG_CONFIG_HOME=/home/node/.clawdbot
```

Gere secrets fortes:

```bash
openssl rand -hex 32
```

::: warning Não commit este arquivo
Adicione `.env` ao `.gitignore`.
:::

### Passo 6: Configuração Docker Compose

Crie ou atualize o `docker-compose.yml`.

```yaml
services:
  clawdbot-gateway:
    image: ${CLAWDBOT_IMAGE}
    build: .
    restart: unless-stopped
    env_file:
      - .env
    environment:
      - HOME=/home/node
      - NODE_ENV=production
      - TERM=xterm-256color
      - CLAWDBOT_GATEWAY_BIND=${CLAWDBOT_GATEWAY_BIND}
      - CLAWDBOT_GATEWAY_PORT=${CLAWDBOT_GATEWAY_PORT}
      - CLAWDBOT_GATEWAY_TOKEN=${CLAWDBOT_GATEWAY_TOKEN}
      - GOG_KEYRING_PASSWORD=${GOG_KEYRING_PASSWORD}
      - XDG_CONFIG_HOME=${XDG_CONFIG_HOME}
      - PATH=/home/linuxbrew/.linuxbrew/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
    volumes:
      - ${CLAWDBOT_CONFIG_DIR}:/home/node/.clawdbot
      - ${CLAWDBOT_WORKSPACE_DIR}:/home/node/clawd
    ports:
      # Recomendado: manter Gateway apenas loopback no VPS; acessar via túnel SSH.
      # Para expor publicamente, remova o prefixo `127.0.0.1:` e configure o firewall adequadamente.
      - "127.0.0.1:${CLAWDBOT_GATEWAY_PORT}:18789"
      # Opcional: apenas se você executar nós iOS/Android direcionados a este VPS e precisar de host Canvas.
      # Se expuser esta porta, leia /gateway/security e configure o firewall adequadamente.
      # - "18793:18793"
    command:
      [
        "node",
        "dist/index.js",
        "gateway",
        "--bind",
        "${CLAWDBOT_GATEWAY_BIND}",
        "--port",
        "${CLAWDBOT_GATEWAY_PORT}"
      ]
```

### Passo 7: Bake Binários Necessários na Imagem (Crítico)

Instalar binários em um container em execução é uma armadilha. Qualquer coisa instalada em runtime será perdida no reinício.

Todos os binários externos necessários para as skills devem ser instalados no momento da construção da imagem.

O exemplo a seguir mostra apenas três binários comuns:
- `gog` para acesso Gmail
- `goplaces` para Google Places
- `wacli` para WhatsApp

Estes são exemplos, não uma lista completa. Você pode instalar quantos binários precisar usando o mesmo padrão.

Se você adicionar novas skills no futuro que dependam de binários adicionais, deve:

1. Atualizar o Dockerfile
2. Reconstruir a imagem
3. Reiniciar o container

**Exemplo de Dockerfile**:

```dockerfile
FROM node:22-bookworm

RUN apt-get update && apt-get install -y socat && rm -rf /var/lib/apt/lists/*

# Exemplo Binário 1: Gmail CLI
RUN curl -L https://github.com/steipete/gog/releases/latest/download/gog_Linux_x86_64.tar.gz \
  | tar -xz -C /usr/local/bin

# Exemplo Binário 2: Google Places CLI
RUN curl -L https://github.com/steipete/goplaces/releases/latest/download/goplaces_Linux_x86_64.tar.gz \
  | tar -xz -C /usr/local/bin

# Exemplo Binário 3: WhatsApp CLI
RUN curl -L https://github.com/steipete/wacli/releases/latest/download/wacli_Linux_x86_64.tar.gz \
  | tar -xz -C /usr/local/bin

# Adicione mais binários abaixo usando o mesmo padrão

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY ui/package.json ./ui/package.json
COPY scripts ./scripts

RUN corepack enable
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
RUN pnpm ui:install
RUN pnpm ui:build

ENV NODE_ENV=production

CMD ["node","dist/index.js"]
```

### Passo 8: Construir e Iniciar

```bash
docker compose build
docker compose up -d clawdbot-gateway
```

Verifique os binários:

```bash
docker compose exec clawdbot-gateway which gog
docker compose exec clawdbot-gateway which goplaces
docker compose exec clawdbot-gateway which wacli
```

Saída esperada:

```
/usr/local/bin/gog
/usr/local/bin/goplaces
/usr/local/bin/wacli
```

### Passo 9: Verificar Gateway

```bash
docker compose logs -f clawdbot-gateway
```

Sucesso:

```
[gateway] listening on ws://0.0.0.0:18789
```

Do seu laptop:

```bash
ssh -N -L 18789:127.0.0.1:18789 root@YOUR_VPS_IP
```

Abra:

`http://127.0.0.1:18789/`

Cole seu token do Gateway.

### Localização da Persistência de Estado (Fonte da Verdade)

O Moltbot executa no Docker, mas o Docker não é a fonte da verdade.

Todo o estado de longa duração deve sobreviver a reinícios, reconstruções e restarts.

| Componente | Localização | Mecanismo de Persistência | Notas |
|---|---|---|---|
| Config do Gateway | `/home/node/.clawdbot/` | Mount de volume do host | Inclui `clawdbot.json`, tokens |
| Perfis de auth de modelo | `/home/node/.clawdbot/` | Mount de volume do host | Tokens OAuth, API keys |
| Configs de skills | `/home/node/.clawdbot/skills/` | Mount de volume do host | Estado nível skill |
| Workspace de agent | `/home/node/clawd/` | Mount de volume do host | Código e artefatos de agent |
| Sessão WhatsApp | `/home/node/.clawdbot/` | Mount de volume do host | Preserva login QR |
| Keyring Gmail | `/home/node/.clawdbot/` | Volume + senha | Requer `GOG_KEYRING_PASSWORD` |
| Binários externos | `/usr/local/bin/` | Imagem Docker | Deve ser baked em build time |
| Runtime Node | Sistema de arquivos do container | Imagem Docker | Reconstruído a cada build de imagem |
| Pacotes OS | Sistema de arquivos do container | Imagem Docker | Não instale em runtime |
| Container Docker | Temporário | Reiniciável | Destruição segura |

---

## Deploy exe.dev

**Ideal para**: Hospedagem Linux barata, acesso remoto, sem necessidade de configurar VPS próprio

### Objetivo

Executar o Gateway Moltbot em uma VM exe.dev, acessível do seu laptop via:
- **Proxy HTTPS exe.dev** (simples, sem túnel)
- **Túnel SSH** (mais seguro; Gateway apenas loopback)

Este guia assume **Ubuntu/Debian**. Se você escolheu uma distribuição diferente, adapte os pacotes. Se você estiver em qualquer outro VPS Linux, os mesmos passos se aplicam — você apenas não usará os comandos de proxy do exe.dev.

### O que você precisa

- Conta exe.dev + `ssh exe.dev` funcionando no seu laptop
- Chaves SSH configuradas (seu laptop → exe.dev)
- Autenticação do modelo que você usará (OAuth ou API key)
- Credenciais de provedores opcionais (QR WhatsApp, token Telegram bot, token Discord bot, etc.)

### Passo 1: Criar VM

Do seu laptop:

```bash
ssh exe.dev new --name=clawdbot
```

Então conecte:

```bash
ssh clawdbot.exe.xyz
```

::: tip Mantenha a VM stateful
Mantenha esta VM **stateful**. O Moltbot armazena estado em `~/.clawdbot/` e `~/clawd/`.
:::

### Passo 2: Instalar Pré-requisitos na VM

```bash
sudo apt-get update
sudo apt-get install -y git curl jq ca-certificates openssl
```

### Node 22

Instale Node **≥ 22.12** (qualquer método funciona). Verificação rápida:

```bash
node -v
```

Se o Node 22 ainda não estiver na VM, use seu gerenciador de Node preferido ou uma fonte de pacotes da distribuição que forneça Node 22+.

### Passo 3: Instalar Moltbot

No servidor, a instalação global via npm é recomendada:

```bash
npm i -g clawdbot@latest
clawdbot --version
```

Se a instalação de dependências nativas falhar (raro; geralmente `sharp`), adicione ferramentas de build:

```bash
sudo apt-get install -y build-essential python3
```

### Passo 4: Configuração Inicial (Assistente)

Execute o assistente de onboarding na VM:

```bash
clawdbot onboard --install-daemon
```

Ele pode configurar:
- Bootstrap do workspace `~/clawd`
- Configuração `~/.clawdbot/clawdbot.json`
- Perfis de autenticação de modelos
- Configuração/login de provedores de modelos
- Serviço **user** systemd Linux (serviço)

Se você estiver fazendo OAuth em uma VM headless, primeiro faça o OAuth em uma máquina normal e depois copie o perfil de autenticação para a VM (veja [ajuda](https://docs.clawd.bot/help/)).

### Passo 5: Opções de Acesso Remoto

#### Opção A (Recomendada): Túnel SSH (Apenas Loopback)

Mantenha o Gateway em loopback (padrão) e faça tunnel a partir do seu laptop:

```bash
ssh -N -L 18789:127.0.0.1:18789 clawdbot.exe.xyz
```

Abra localmente:

- `http://127.0.0.1:18789/` (Control UI)

Veja: [Acesso Remoto](https://docs.clawd.bot/gateway/remote)

#### Opção B: Proxy HTTPS exe.dev (Sem Túnel)

Para ter o exe.dev fazendo proxy do tráfego para a VM, faça o Gateway bind na interface LAN e configure o token:

```bash
export CLAWDBOT_GATEWAY_TOKEN="$(openssl rand -hex 32)"
clawdbot gateway --bind lan --port 8080 --token "$CLAWDBOT_GATEWAY_TOKEN"
```

Para execução como serviço, persista em `~/.clawdbot/clawdbot.json`:

```json5
{
  "gateway": {
    "mode": "local",
    "port": 8080,
    "bind": "lan",
    "auth": { "mode": "token", "token": "YOUR_TOKEN" }
  }
}
```

::: info Nota Importante
Binding não-loopback requer `gateway.auth.token` (ou `CLAWDBOT_GATEWAY_TOKEN`). O `gateway.remote.token` é apenas para chamadas CLI remotas; ele não habilita autenticação local.
:::

Então aponte o proxy no exe.dev para a porta escolhida (`8080` neste exemplo, ou qualquer porta que você escolher) e abra a URL HTTPS da sua VM:

```bash
ssh exe.dev share port clawdbot 8080
```

Abra:

`https://clawdbot.exe.xyz/`

Na Control UI, cole o token (UI → Configurações → token). A UI o envia como `connect.params.auth.token`.

::: tip Porta do Proxy
Se o proxy espera a porta da aplicação, prefira uma porta **não padrão** (como `8080`). Trate o token como uma senha.
:::

### Passo 6: Manter em Execução (Serviço)

No Linux, o Moltbot usa serviços systemd **user**. Após `--install-daemon`, verifique:

```bash
systemctl --user status clawdbot-gateway[-<profile>].service
```

Se o serviço morre após logout, habilite lingering:

```bash
sudo loginctl enable-linger "$USER"
```

### Passo 7: Atualizar

```bash
npm i -g clawdbot@latest
clawdbot doctor
clawdbot gateway restart
clawdbot health
```

Veja: [Atualizando](https://docs.clawd.bot/install/updating)

---

## Recomendações de Escolha

### Escolha por Cenário de Uso

| Cenário | Deploy Recomendado | Motivo |
|---|---|---|
| **Uso pessoal, início rápido** | Instalação Local | Mais simples, sem infraestrutura |
| **Acesso multi-dispositivo, desligamento ocasional** | Fly.io | 24/7 online, acessível de qualquer lugar |
| **Controle total, infraestrutura própria** | Hetzner VPS | Controle total, estado persistente, baixo custo |
| **Baixo custo, sem gerenciar VPS** | exe.dev | Hospedagem barata, configuração rápida |
| **Necessidade de reprodutibilidade, rollback rápido** | Nix | Configuração declarativa, versões fixadas |
| **Testes, ambiente isolado** | Docker | Fácil reconstrução, isolamento de testes |

### Melhores Práticas de Segurança

Independentemente do método de deploy escolhido, siga estes princípios de segurança:

::: warning Autenticação e Controle de Acesso
- Sempre configure token ou senha de autenticação para o Gateway (quando binding não-loopback)
- Use variáveis de ambiente para armazenar credenciais sensíveis (API keys, tokens)
- Para deploy em nuvem, evite exposição pública ou use rede privada
:::

::: tip Persistência de Estado
- Para deploys containerizados, garanta que configuração e workspace estejam corretamente montados em volumes do host
- Para deploys VPS, faça backup regular dos diretórios `~/.clawdbot/` e `~/clawd/`
:::

### Monitoramento e Logs

- Verifique regularmente o status do Gateway: `clawdbot doctor`
- Configure rotação de logs para evitar esgotamento de espaço em disco
- Use endpoints de health check para verificar disponibilidade do serviço

---

## Checkpoint ✅

**Verificação de Instalação Local**:

```bash
clawdbot --version
clawdbot health
```

Você deve ver uma mensagem indicando que o Gateway está escutando.

**Verificação Docker**:

```bash
docker compose ps
docker compose logs clawdbot-gateway
```

O status do container deve ser `Up`, e os logs devem mostrar `[gateway] listening on ws://...`.

**Verificação Nix**:

```bash
# Verificar status do serviço
systemctl --user status clawdbot-gateway

# Verificar modo Nix
defaults read com.clawdbot.mac clawdbot.nixMode
```

**Verificação Deploy Nuvem**:

```bash
# Fly.io
fly status
fly logs

# Hetzner / exe.dev
ssh root@YOUR_VPS_IP "docker compose logs -f clawdbot-gateway"
```

Você deve conseguir acessar a Control UI via navegador ou túnel SSH.

---

## Avisos de Problemas Comuns

::: warning Problemas Comuns Docker
- **Caminhos de mount incorretos**: Garanta que os caminhos do host estejam compartilhados no Docker Desktop
- **Conflitos de porta**: Verifique se a porta 18789 está em uso
- **Problemas de permissão**: O usuário do container (uid 1000) precisa de permissão de leitura/escrita nos volumes montados
:::

::: warning Problemas Deploy Nuvem
- **Erros OOM**: Aumente a alocação de memória (pelo menos 2GB)
- **Lock do Gateway**: Exclua o arquivo `/data/gateway.*.lock` e reinicie o container
- **Falha no health check**: Garanta que o `internal_port` corresponda à porta do Gateway
:::

::: tip Persistência de Binários (Hetzner)
Não instale dependências em runtime! Todos os binários necessários para as skills devem ser baked na imagem Docker, caso contrário serão perdidos após o reinício do container.
:::

---

## Resumo da Lição

Esta lição apresentou os vários métodos de deploy do Moltbot:

1. **Instalação Local**: Mais simples e rápida, ideal para uso pessoal e desenvolvimento
2. **Deploy Docker**: Ambiente isolado, fácil reconstrução, suporte a sandbox
3. **Deploy Nix**: Configuração declarativa, reprodutível, rollback rápido
4. **Fly.io**: Plataforma cloud, HTTPS automático, 24/7 online
5. **Hetzner VPS**: VPS próprio, controle total, estado persistente
6. **exe.dev**: Hospedagem barata, configuração rápida, operação simplificada

Ao escolher um método de deploy, considere seu cenário de uso, habilidades técnicas e necessidades operacionais. Garantir a persistência de estado e configuração de segurança são fundamentais para um deploy bem-sucedido.

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver localizações do código fonte</strong></summary>

> Última atualização: 2026-01-27

| Funcionalidade/Capítulo | Caminho do Arquivo | Linhas |
|---|---|---|
| Script de Deploy Docker | [`docker-setup.sh`](https://github.com/moltbot/moltbot/blob/main/docker-setup.sh) | Completo |
| Definição da Imagem Docker | [`Dockerfile`](https://github.com/moltbot/moltbot/blob/main/Dockerfile) | Completo |
| Configuração Docker Compose | [`docker-compose.yml`](https://github.com/moltbot/moltbot/blob/main/docker-compose.yml) | Completo |
| Configuração Fly.io | [`fly.toml`](https://github.com/moltbot/moltbot/blob/main/fly.toml) | Completo |
| Configuração Privada Fly | [`fly.private.toml`](https://github.com/moltbot/moltbot/blob/main/fly.private.toml) | Completo |
| Imagem Sandbox Docker | [`Dockerfile.sandbox`](https://github.com/moltbot/moltbot/blob/main/Dockerfile.sandbox) | Completo |
| Integração Nix | [`nix-clawdbot`](https://github.com/clawdbot/nix-clawdbot) | README |
| Script de Instalação | [`scripts/package-mac-app.sh`](https://github.com/moltbot/moltbot/blob/main/scripts/package-mac-app.sh) | Completo |

**Arquivos de Configuração Principais**:
- `~/.clawdbot/clawdbot.json`: Arquivo de configuração principal
- `~/.clawdbot/`: Diretório de estado (sessões, tokens, perfis de auth)
- `~/clawd/`: Diretório de workspace

**Variáveis de Ambiente Principais**:
- `CLAWDBOT_GATEWAY_TOKEN`: Token de autenticação do Gateway
- `CLAWDBOT_STATE_DIR`: Caminho do diretório de estado
- `CLAWDBOT_CONFIG_PATH`: Caminho do arquivo de configuração
- `CLAWDBOT_NIX_MODE`: Habilita modo Nix

**Scripts Principais**:
- `scripts/sandbox-setup.sh`: Constrói imagem sandbox padrão
- `scripts/sandbox-common-setup.sh`: Constrói imagem sandbox comum
- `scripts/sandbox-browser-setup.sh`: Constrói imagem sandbox de navegador

**Variáveis de Ambiente Docker** (.env):
- `CLAWDBOT_IMAGE`: Nome da imagem a ser usada
- `CLAWDBOT_GATEWAY_BIND`: Modo de bind (lan/auto)
- `CLAWDBOT_GATEWAY_PORT`: Porta do Gateway
- `CLAWDBOT_CONFIG_DIR`: Mount do diretório de configuração
- `CLAWDBOT_WORKSPACE_DIR`: Mount do workspace
- `GOG_KEYRING_PASSWORD`: Senha do keyring Gmail
- `XDG_CONFIG_HOME`: Diretório de configuração XDG

**Variáveis de Ambiente Fly.io**:
- `NODE_ENV`: Ambiente de runtime (production)
- `CLAWDBOT_PREFER_PNPM`: Usar pnpm
- `CLAWDBOT_STATE_DIR`: Diretório de estado persistente
- `NODE_OPTIONS`: Opções de runtime Node.js

</details>
