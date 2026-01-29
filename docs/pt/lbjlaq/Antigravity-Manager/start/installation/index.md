---
title: "Instalação: Implantação com Homebrew e Releases | Antigravity Manager"
sidebarTitle: "Instale em 5 Minutos"
subtitle: "Instalação e Atualização: Melhor caminho de instalação para desktop (brew / releases)"
description: "Aprenda os métodos de instalação Homebrew e Releases do Antigravity Tools. Complete a implantação em 5 minutos, resolva problemas comuns de macOS quarantine e erros de aplicativo danificado, e domine o processo de atualização."
tags:
  - "Instalação"
  - "Atualização"
  - "Homebrew"
  - "Releases"
  - "Docker"
prerequisite:
  - "start-getting-started"
order: 2
---

# Instalação e Atualização: Melhor caminho de instalação para desktop (brew / releases)

Se você quer instalar o Antigravity Tools rapidamente e completar as aulas subsequentes, esta lição faz apenas uma coisa: deixar claro "instalar + conseguir abrir + saber como atualizar".

## O que você poderá fazer após completar

- Escolher o caminho de instalação correto: priorizar Homebrew, depois GitHub Releases
- Lidar com bloqueios comuns do macOS (quarantine / "aplicativo danificado")
- Instalar em ambientes especiais: script Arch, Headless Xvfb, Docker
- Saber o ponto de entrada de atualização e método de auto-verificação para cada método de instalação

## Seu dilema atual

- Há muitas maneiras de instalação na documentação, não sabe qual escolher
- Após baixar no macOS não consegue abrir, aviso "danificado/não é possível abrir"
- Você roda em NAS/servidor, não tem desktop, nem é conveniente autorizar

## Quando usar essa técnica

- Primeira instalação do Antigravity Tools
- Restaurar ambiente após trocar computador/reinstalar sistema
- Após atualização de versão encontrar bloqueios de sistema ou anormalidades de inicialização

::: warning Conhecimento prévio
Se você ainda não tem certeza qual problema o Antigravity Tools resolve, primeiro dê uma olhada em **[O que é o Antigravity Tools](/pt/lbjlaq/Antigravity-Manager/start/getting-started/)**, depois volte para instalar será mais suave.
:::

## Ideia Principal

Recomendamos que você escolha na ordem "desktop primeiro, servidor depois":

1. Desktop (macOS/Linux): use Homebrew para instalar (mais rápido, atualização também mais conveniente)
2. Desktop (todas plataformas): baixe do GitHub Releases (adequado para quem não quer instalar brew ou tem restrições de rede)
3. Servidor/NAS: priorize Docker; depois Headless Xvfb (mais parecido com "rodar aplicação de desktop em servidor")

## Siga-me

### Passo 1: Primeiro escolha seu método de instalação

**Por que**
O custo de "atualização/rollback/solução de problemas" varia muito entre diferentes métodos de instalação, escolher o caminho primeiro evita desvios.

**Recomendação**:

| Cenário | Método de instalação recomendado |
|---------|-----------------------------------|
| Desktop macOS / Linux | Homebrew (Opção A) |
| Desktop Windows | GitHub Releases (Opção B) |
| Arch Linux | Script oficial (Opção Arch) |
| Servidor remoto sem desktop | Docker (Opção D) ou Headless Xvfb (Opção C-Headless) |

**Você deve ver**: Você pode identificar claramente em qual linha você se encaixa.

### Passo 2: Instale com Homebrew (macOS / Linux)

**Por que**
Homebrew é o caminho "processa automaticamente download e instalação", atualização também é mais fácil.

```bash
#1) Assine o Tap deste repositório
brew tap lbjlaq/antigravity-manager https://github.com/lbjlaq/Antigravity-Manager

#2) Instale o aplicativo
brew install --cask antigravity-tools
```

::: tip Prompt de permissão macOS
README menciona: se você encontrar problemas de permissão/quarentena no macOS, pode usar:

```bash
brew install --cask --no-quarantine antigravity-tools
```
:::

**Você deve ver**: `brew` saída indica sucesso da instalação, e Antigravity Tools aparece no sistema.

### Passo 3: Instale manualmente do GitHub Releases (macOS / Windows / Linux)

**Por que**
Quando você não usa Homebrew, ou quer controlar a fonte do pacote de instalação, este caminho é mais direto.

1. Abra a página de Releases do projeto: `https://github.com/lbjlaq/Antigravity-Manager/releases`
2. Escolha o pacote de instalação correspondente ao seu sistema:
   - macOS: `.dmg` (Apple Silicon / Intel)
   - Windows: `.msi` ou versão portátil `.zip`
   - Linux: `.deb` ou `AppImage`
3. Siga as instruções do instalador do sistema para completar a instalação

**Você deve ver**: Após completar a instalação, você pode encontrar Antigravity Tools na lista de aplicativos do sistema e iniciá-lo.

### Passo 4: Lidar com "Aplicativo Danificado, Não é Possível Abrir" no macOS

**Por que**
O README explicitamente fornece a correção para este cenário; se você encontrar o mesmo aviso, basta seguir.

```bash
sudo xattr -rd com.apple.quarantine "/Applications/Antigravity Tools.app"
```

**Você deve ver**: Ao iniciar o aplicativo novamente, o aviso de bloqueio "danificado/não é possível abrir" não aparece mais.

### Passo 5: Atualização (escolha de acordo com seu método de instalação)

**Por que**
O problema mais comum ao atualizar é "o método de instalação mudou", fazendo com que você não saiba onde atualizar.

::: code-group

```bash [Homebrew]
#Atualize informações do tap antes da atualização
brew update

#Atualize cask
brew upgrade --cask antigravity-tools
```

```text [Releases]
Baixe novamente o pacote de instalação da versão mais recente (.dmg/.msi/.deb/AppImage), substitua a instalação seguindo as instruções do sistema.
```

```bash [Headless Xvfb]
cd /opt/antigravity
sudo ./upgrade.sh
```

```bash [Docker]
cd deploy/docker

#README explica que o container tenta puxar o último release ao iniciar; a maneira mais simples de atualizar é reiniciar o container
docker compose restart
```

:::

**Você deve ver**: Após completar a atualização, o aplicativo ainda inicia normalmente; se você usa Docker/Headless, também pode continuar acessando o endpoint de verificação.

## Outros métodos de instalação (cenários específicos)

### Arch Linux: script oficial de instalação com um clique

README fornece entrada para script Arch:

```bash
curl -sSL https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/arch/install.sh | bash
```

::: details O que esse script faz?
Ele obtém o último release através da API do GitHub, baixa o asset `.deb`, calcula SHA256, depois gera PKGBUILD e instala com `makepkg -si`.
:::

### Servidor remoto: Headless Xvfb

Se você precisa rodar aplicação GUI no servidor Linux sem interface, o projeto fornece implantação Xvfb:

```bash
curl -fsSL https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/headless-xvfb/install.sh | sudo bash
```

Após completar a instalação, os comandos comuns de auto-verificação fornecidos pela documentação incluem:

```bash
systemctl status antigravity
tail -f /opt/antigravity/logs/app.log
curl localhost:8045/healthz
```

### NAS/Servidor: Docker (com navegador VNC)

A implantação Docker fornece noVNC no navegador (conveniente para operações OAuth/autorização), enquanto mapeia a porta do proxy:

```bash
cd deploy/docker
docker compose up -d
```

Você deve ser capaz de acessar: `http://localhost:6080/vnc_lite.html`.

## Aviso sobre armadilhas

- Instalação brew falha: primeiro confirme se você instalou Homebrew, depois tente novamente `brew tap` / `brew install --cask` do README
- macOS não consegue abrir: tente primeiro `--no-quarantine`; se já instalado, use `xattr` para limpar quarantine
- Limitações da implantação em servidor: Headless Xvfb é essencialmente "rodar programa de desktop com monitor virtual", uso de recursos será maior que serviço puro de backend

## Resumo da lição

- Desktop mais recomendado: Homebrew (instalação e atualização convenientes)
- Sem brew: use diretamente GitHub Releases
- Servidor/NAS: priorize Docker; se precisa de gerenciamento systemd, use Headless Xvfb

## Próximo aviso de lição

Na próxima lição vamos avançar "conseguir abrir" um passo mais: esclarecer **[Diretório de dados, logs, bandeja e início automático](/pt/lbjlaq/Antigravity-Manager/start/first-run-data/)**, assim você sabe onde verificar ao encontrar problemas.

---

## Apêndice: Referência de código-fonte

<details>
<summary><strong>Clique para expandir localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-23

| Tópico | Caminho do arquivo | Linha |
|--------|---------------------|-------|
| Instalação Homebrew (tap + cask) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L112-L127) | 112-127 |
| Download manual Releases (pacotes de instalação por plataforma) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L128-L133) | 128-133 |
| Entrada para script Arch de instalação com um clique | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L134-L140) | 134-140 |
| Implementação do script de instalação Arch (API GitHub + makepkg) | [`deploy/arch/install.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/arch/install.sh#L1-L56) | 1-56 |
| Entrada para instalação Headless Xvfb (curl \| sudo bash) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L141-L149) | 141-149 |
| Comandos de implantação/atualização/operação do Headless Xvfb | [`deploy/headless-xvfb/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/README.md#L1-L99) | 1-99 |
| Headless Xvfb install.sh (systemd + configuração padrão 8045) | [`deploy/headless-xvfb/install.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/install.sh#L1-L99) | 1-99 |
| Entrada para implantação Docker (docker compose up -d) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L150-L166) | 150-166 |
| Explicação da implantação Docker (noVNC 6080 / proxy 8045) | [`deploy/docker/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/README.md#L1-L35) | 1-35 |
| Configuração de porta/volume de dados Docker (8045 + antigravity_data) | [`deploy/docker/docker-compose.yml`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/docker-compose.yml#L1-L25) | 1-25 |
| Solução de problemas "danificado, não é possível abrir" do macOS (xattr / --no-quarantine) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L171-L186) | 171-186 |

</details>
