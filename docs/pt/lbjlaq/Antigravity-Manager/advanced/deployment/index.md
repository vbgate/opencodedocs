---
title: "Implantação: Solução de Implantação em Servidor | Antigravity-Manager"
sidebarTitle: "Rodando no servidor"
subtitle: "Implantação: Solução de Implantação em Servidor"
description: "Aprenda os métodos de implantação de servidor do Antigravity-Manager. Compare duas soluções Docker noVNC vs Headless Xvfb, complete instalação/configuração, persistência de dados e verificação de vivacidade/solução de problemas, estabeleça ambiente de servidor operável."
tags:
  - "implantação"
  - "docker"
  - "xvfb"
  - "novnc"
  - "systemd"
  - "backup"
prerequisite:
  - "start-installation"
  - "start-backup-migrate"
  - "advanced-security"
duration: 20
order: 10
---
# Implantação em Servidor: Docker noVNC vs Headless Xvfb (Seleção e Operação)

Você quer fazer implantação de servidor do Antigravity Tools, rodar em NAS/servidor, geralmente não é para "abrir GUI remotamente para ver", mas para tratá-lo como um gateway de API local de execução longa: sempre online, pode verificar vivacidade, pode atualizar, pode fazer backup, pode localizar problemas quando ocorrerem.

Esta aula só fala dois caminhos já dados no projeto que podem ser implementados: Docker (com noVNC) e Headless Xvfb (gerenciado por systemd). Todos os comandos e valores padrão seguem os arquivos de implantação no repositório.

::: tip Se você só quer "rodar uma vez primeiro"
O capítulo de instalação já cobriu comandos de entrada de Docker e Headless Xvfb, você pode primeiro ver **[Instalação e Atualização](/pt/lbjlaq/Antigravity-Manager/start/installation/)**, depois voltar para esta aula para completar o "ciclo de operação".
:::

## O que você poderá fazer após concluir

- Selecionar a forma de implantação correta: saber o que Docker noVNC e Headless Xvfb resolvem respectivamente
- Completar um ciclo fechado: implantação -> sincronizar dados de conta -> verificar vivacidade `/healthz` -> ver logs -> backup
- Fazer atualização uma ação controlável: saber a diferença entre "atualização automática ao iniciar" do Docker e Xvfb `upgrade.sh`

## Seu dilema atual

- O servidor não tem desktop, mas você não pode viver sem operações como OAuth/autorização que "precisam de navegador"
- Rodar uma vez não é suficiente, você quer mais: recuperação automática após reinicialização de energia, pode verificar vivacidade, pode fazer backup
- Você está preocupado que expor porta 8045 terá risco de segurança, mas não sabe por onde começar a restringir

## Quando usar esta estratégia

- NAS/servidor doméstico: espera poder abrir GUI em navegador para completar autorização (Docker/noVNC é muito conveniente)
- Servidor de execução longa: você mais quer usar systemd para gerenciar processo, logs gravados em disco, script de atualização (Headless Xvfb é mais como "projeto operacional")

## O que é "implantação de servidor"?

**Implantação de servidor** significa: você não roda as Antigravity Tools no desktop local, mas as coloca em uma máquina de execução longa, e usa a porta de proxy reverso (padrão 8045) como entrada de serviço externo. O núcleo não é "ver interface remotamente", mas estabelecer um ciclo de operação estável: persistência de dados, verificação de vivacidade, logs, atualização e backup.

## Ideia central

1. Primeiro selecione "a capacidade que mais falta": falta de autorização de navegador escolha Docker/noVNC; falta de controle operacional escolha Headless Xvfb.
2. Depois determine "dados": contas/configuração estão em `.antigravity_tools/`, ou use Docker volume, ou fixe em `/opt/antigravity/.antigravity_tools/`.
3. Finalmente faça "ciclo de operação": verificar vivacidade com `/healthz`, em caso de falha ver logs primeiro, depois decidir reiniciar ou atualizar.

::: warning Aviso prévio: primeiro determine linha de base de segurança
Se você vai expor 8045 para LAN/pública, primeiro veja **[Segurança e Privacidade: auth_mode, allow_lan_access, e design de "não vazar informações de conta"](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/security.md)**.
:::

## Seleção rápida: Docker vs Headless Xvfb

| O que mais importa | Mais recomendado | Por que |
| --- | --- | --- |
| Precisa de navegador para OAuth/autorização | Docker (noVNC) | Container vem com Firefox ESR embutido, pode operar diretamente em navegador (ver `deploy/docker/README.md`) |
| Quer gerenciamento systemd/logs em disco | Headless Xvfb | Script de instalação instalará serviço systemd, e gravará logs em `logs/app.log` (ver `deploy/headless-xvfb/install.sh`) |
| Quer isolamento e limites de recursos | Docker | Compose naturalmente isola, e é mais fácil configurar limites de recursos (ver `deploy/docker/README.md`) |

## Siga-me

### Passo 1: Primeiro, confirme onde está o "diretório de dados"

**Por que**
Implantação bem-sucedida mas "sem contas/configuração", essencialmente é porque o diretório de dados não foi levado ou não foi persistido.

- Solução Docker montará dados em `/home/antigravity/.antigravity_tools` no container (compose volume)
- Solução Headless Xvfb colocará dados em `/opt/antigravity/.antigravity_tools` (e fixará local de gravação através de `HOME=$(pwd)`)

**Você deve ver**
- Docker: `docker volume ls` pode ver `antigravity_data`
- Xvfb: `/opt/antigravity/.antigravity_tools/` existe, e contém `accounts/`, `gui_config.json`

### Passo 2: Rodar Docker/noVNC (adequado para autorização de navegador)

**Por que**
A solução Docker empacota "monitor virtual + gerenciador de janelas + noVNC + aplicativo + navegador" em um container, poupando você de instalar muitas dependências gráficas no servidor.

No servidor, execute:

```bash
cd deploy/docker
docker compose up -d
```

Abra noVNC:

```text
http://<server-ip>:6080/vnc_lite.html
```

**Você deve ver**
- `docker compose ps` mostra container rodando
- Navegador pode abrir página noVNC

::: tip Sobre porta noVNC (recomendado manter padrão)
`deploy/docker/README.md` menciona que pode usar `NOVNC_PORT` para personalizar porta, mas na implementação atual `start.sh` ao iniciar `websockify` escuta porta 6080 codificada. Para modificar porta precisa ajustar simultaneamente mapeamento de porta do docker-compose e porta de escuta do start.sh.

Para evitar configuração inconsistente, recomendo usar diretamente 6080 padrão.
:::

### Passo 3: Persistência, verificação de vivacidade e backup do Docker

**Por que**
Disponibilidade do container depende de duas coisas: saúde do processo (se ainda está rodando) e persistência de dados (contas ainda lá após reinício).

1) Confirme volume de persistência montado:

```bash
cd deploy/docker
docker compose ps
```

2) Backup do volume (README do projeto fornece método de backup tar):

```bash
docker run --rm -v antigravity_data:/data -v $(pwd):/backup alpine \
  tar czf /backup/antigravity-backup.tar.gz /data
```

3) Verificação de saúde do container (Dockerfile tem HEALTHCHECK):

```bash
docker inspect --format '{{json .State.Health}}' antigravity-manager | jq
```

**Você deve ver**
- `.State.Health.Status` é `healthy`
- Arquivo `antigravity-backup.tar.gz` gerado no diretório atual

### Passo 4: Instalação Headless Xvfb com um clique (adequado para operação systemd)

**Por que**
Headless Xvfb não é "modo puramente backend", mas usa monitor virtual para rodar programas GUI no servidor; mas em troca traz método de operação mais familiar: systemd, diretório fixo, logs em disco.

No servidor, execute (script de um clique fornecido pelo projeto):

```bash
curl -fsSL https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/headless-xvfb/install.sh | sudo bash
```

**Você deve ver**
- Diretório `/opt/antigravity/` existe
- `systemctl status antigravity` mostra serviço rodando

::: tip Prática mais estável: primeiro reveja o script
`curl -O .../install.sh` baixe primeiro e veja, depois `sudo bash install.sh`.
:::

### Passo 5: Sincronizar contas locais para o servidor (necessário para solução Xvfb)

**Por que**
Instalação Xvfb só roda o programa. Para o proxy realmente funcionar, você precisa sincronizar contas/configurações existentes da máquina local para o diretório de dados do servidor.

O projeto fornece `sync.sh`, que automaticamente procurará diretório de dados na sua máquina por prioridade (como `~/.antigravity_tools`, `~/Library/Application Support/Antigravity Tools`), depois rsync para o servidor:

```bash
curl -O https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/headless-xvfb/sync.sh
chmod +x sync.sh

./sync.sh root@your-server /opt/antigravity
```

**Você deve ver**
- Saída do terminal similar: `sincronizar: <local> -> root@your-server:/opt/antigravity/.antigravity_tools/`
- Serviço remoto tentará reiniciar (script chamará `systemctl restart antigravity`)

### Passo 6: Verificação de vivacidade e solução de problemas (comum para ambas as soluções)

**Por que**
A primeira coisa após implantação não é "conectar cliente primeiro", mas estabelecer uma entrada que possa julgar saúde rapidamente.

1) Verificação de vivacidade (serviço de proxy fornece `/healthz`):

```bash
curl -i http://127.0.0.1:8045/healthz
```

2) Ver logs:

```bash
## Docker
cd deploy/docker
docker compose logs -f

## Headless Xvfb
tail -f /opt/antigravity/logs/app.log
```

**Você deve ver**
- `/healthz` retorna 200 (corpo de resposta específico conforme realidade)
- Logs podem ver informações de início do serviço de proxy

### Passo 7: Estratégia de atualização (não trate "atualização automática" como única solução)

**Por que**
Atualização é a ação mais fácil para "atualizar sistema para indisponível". Você precisa saber exatamente o que cada solução de atualização faz.

- Docker: ao iniciar container tentará baixar último `.deb` via API do GitHub e instalar (se limitado ou exceção de rede, continuará usando versão em cache).
- Headless Xvfb: usa `upgrade.sh` para baixar último AppImage, e reverta para backup se reinício falhar.

Comando de atualização Headless Xvfb (README do projeto):

```bash
cd /opt/antigravity
sudo ./upgrade.sh
```

**Você deve ver**
- Saída similar: `atualizar: v<current> -> v<latest>`
- Após atualização serviço ainda active (script chamará `systemctl restart antigravity` e verificar estado)

## Avisos sobre armadilhas

| Cenário | Erro comum (❌) | Prática recomendada (✓) |
| --- | --- | --- |
| Contas/configuração perdidas | ❌ Só se importa com "programa rodando" | ✓ Primeiro confirme que `.antigravity_tools/` é persistente (volume ou `/opt/antigravity`) |
| Porta noVNC alterada não entra em vigor | ❌ Só muda `NOVNC_PORT` | ✓ Mantenha 6080 padrão; se mudar, verifique simultaneamente porta `websockify` em `start.sh` |
| Expor 8045 para pública | ❌ Não configura `api_key`/não olha auth_mode | ✓ Primeiro faça linha de base conforme **[Segurança e Privacidade](/pt/lbjlaq/Antigravity-Manager/advanced/security/)**, depois considere túnel/proxy reverso |

## Resumo desta aula

- Docker/noVNC resolve problema de "servidor sem navegador/sem desktop mas precisa autorização", adequado para cenário NAS
- Headless Xvfb é mais como operação padrão: diretório fixo, gerenciamento systemd, atualização/rollback por script
- Não importa qual solução, primeiro faça o ciclo certo: dados -> verificar vivacidade -> logs -> backup -> atualização

## Continuação recomendada

- Você quer expor serviço para LAN/pública: **[Segurança e Privacidade: auth_mode, allow_lan_access](/pt/lbjlaq/Antigravity-Manager/advanced/security/)**
- Após implantação encontrar 401: **[401/Falha de autenticação: auth_mode, compatibilidade de Header e lista de configuração de cliente](/pt/lbjlaq/Antigravity-Manager/faq/auth-401/)**
- Você quer usar túnel para expor serviço: **[Túnel Cloudflared com um clique](/pt/lbjlaq/Antigravity-Manager/platforms/cloudflared/)**

---

## Apêndice: Referências de código-fonte

<details>
<summary><strong>Clique para expandir e ver localizações do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Funcionalidade | Caminho do arquivo | Número da linha |
| --- | --- | --- |
| Entrada de implantação Docker e URL noVNC | [`deploy/docker/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/README.md#L5-L13) | 5-13 |
| Descrição de variáveis de ambiente de implantação Docker (VNC_PASSWORD/RESOLUTION/NOVNC_PORT) | [`deploy/docker/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/README.md#L32-L39) | 32-39 |
| Mapeamento de porta e volume de dados do docker compose (antigravity_data) | [`deploy/docker/docker-compose.yml`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/docker-compose.yml#L1-L21) | 1-21 |
| Script de início Docker: atualização automática de versão (GitHub rate limit) | [`deploy/docker/start.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/start.sh#L27-L58) | 27-58 |
| Script de início Docker: iniciar Xtigervnc/Openbox/noVNC/aplicativo | [`deploy/docker/start.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/start.sh#L60-L78) | 60-78 |
| Verificação de saúde Docker: confirmar processos Xtigervnc/websockify/antigravity_tools existem | [`deploy/docker/Dockerfile`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/Dockerfile#L60-L79) | 60-79 |
| Headless Xvfb: estrutura de diretório e comandos operacionais (systemctl/healthz) | [`deploy/headless-xvfb/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/README.md#L19-L78) | 19-78 |
| Headless Xvfb: install.sh instalar dependências e inicializar gui_config.json (padrão 8045) | [`deploy/headless-xvfb/install.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/install.sh#L16-L67) | 16-67 |
| Headless Xvfb: sync.sh descobrir automaticamente diretório de dados local e rsync para servidor | [`deploy/headless-xvfb/sync.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/sync.sh#L8-L32) | 8-32 |
| Headless Xvfb: upgrade.sh baixar nova versão e revertar em caso de falha | [`deploy/headless-xvfb/upgrade.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/upgrade.sh#L11-L51) | 11-51 |
| Endpoint de verificação de vivacidade do serviço de proxy `/healthz` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |

</details>
