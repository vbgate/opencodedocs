

### Schritt 7: Benötigte Binärdateien in das Image einbauen (kritisch)

Binärdateien in einem laufenden Container zu installieren ist eine Falle. Alles, was zur Laufzeit installiert wird, geht beim Neustart verloren.

Alle externen Binärdateien, die von Skills benötigt werden, müssen zum Zeitpunkt des Image-Builds installiert werden.

Das folgende Beispiel zeigt nur drei häufige Binärdateien:
- `gog` für Gmail-Zugriff
- `goplaces` für Google Places
- `wacli` für WhatsApp

Dies sind Beispiele, keine vollständige Liste. Sie können mit dem gleichen Muster so viele Binärdateien installieren, wie Sie benötigen.

Wenn Sie später neue Skills hinzufügen, die zusätzliche Binärdateien benötigen, müssen Sie:

1. Das Dockerfile aktualisieren
2. Das Image neu bauen
3. Den Container neu starten

**Beispiel Dockerfile**:

```dockerfile
FROM node:22-bookworm

RUN apt-get update && apt-get install -y socat && rm -rf /var/lib/apt/lists/*

# Beispiel-Binärdatei 1: Gmail CLI
RUN curl -L https://github.com/steipete/gog/releases/latest/download/gog_Linux_x86_64.tar.gz \
| tar -xz -C /usr/local/bin

# Beispiel-Binärdatei 2: Google Places CLI
RUN curl -L https://github.com/steipete/goplaces/releases/latest/download/goplaces_Linux_x86_64.tar.gz \
| tar -xz -C /usr/local/bin

# Beispiel-Binärdatei 3: WhatsApp CLI
RUN curl -L https://github.com/steipete/wacli/releases/latest/download/wacli_Linux_x86_64.tar.gz \
| tar -xz -C /usr/local/bin

# Fügen Sie hier weitere Binärdateien mit dem gleichen Muster hinzu

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

### Schritt 8: Bauen und Starten

```bash
docker compose build
docker compose up -d clawdbot-gateway
```

Binärdateien überprüfen:

```bash
docker compose exec clawdbot-gateway which gog
docker compose exec clawdbot-gateway which goplaces
docker compose exec clawdbot-gateway which wacli
```

Erwartete Ausgabe:

```
/usr/local/bin/gog
/usr/local/bin/goplaces
/usr/local/bin/wacli
```

### Schritt 9: Gateway überprüfen

```bash
docker compose logs -f clawdbot-gateway
```

Erfolg:

```
[gateway] listening on ws://0.0.0.0:18789
```

Von Ihrem Laptop:

```bash
ssh -N -L 18789:127.0.0.1:18789 root@YOUR_VPS_IP
```

Öffnen:

`http://127.0.0.1:18789/`

Fügen Sie Ihr Gateway-Token ein.

### Ort der Statuspersistenz (Quelle der Wahrheit)

Clawdbot läuft in Docker, aber Docker ist nicht die Quelle der Wahrheit.

Alle langfristig laufenden Zustände müssen Neustarts, Neubuilds und Restarts überleben.

| Komponente | Ort | Persistenzmechanismus | Anmerkungen |
|--- | --- | --- | ---|
| Gateway-Konfiguration | `/home/node/.clawdbot/` | Host-Volume-Mount | Enthält `clawdbot.json`, Tokens |
| Modell-Auth-Profile | `/home/node/.clawdbot/` | Host-Volume-Mount | OAuth-Tokens, API-Keys |
| Skill-Konfigurationen | `/home/node/.clawdbot/skills/` | Host-Volume-Mount | Skill-Level-Status |
| Agent-Arbeitsbereich | `/home/node/clawd/` | Host-Volume-Mount | Code und Agent-Artefakte |
| WhatsApp-Sitzung | `/home/node/.clawdbot/` | Host-Volume-Mount | Behält QR-Login bei |
| Gmail-Keyring | `/home/node/.clawdbot/` | Host-Volume + Passwort | Erfordert `GOG_KEYRING_PASSWORD` |
| Externe Binärdateien | `/usr/local/bin/` | Docker-Image | Müssen zum Build-Zeitpunkt eingebacken werden |
| Node-Laufzeit | Container-Dateisystem | Docker-Image | Bei jedem Image-Build neu erstellt |
| OS-Pakete | Container-Dateisystem | Docker-Image | Nicht zur Laufzeit installieren |
| Docker-Container | Temporär | Neustartbar | Sicher zu zerstören |

---

## exe.dev-Bereitstellung

**Geeignet für**: Günstiger Linux-Host, Fernzugriff, keine eigene VPS-Konfiguration erforderlich

### Ziel

Clawdbot Gateway auf exe.dev-VM ausführen, zugänglich von Ihrem Laptop über:
- **exe.dev HTTPS-Proxy** (einfach, kein Tunnel erforderlich)
- **SSH-Tunnel** (sicherste; nur Loopback-Gateway)

Diese Anleitung geht von **Ubuntu/Debian** aus. Wenn Sie eine andere Distribution gewählt haben, passen Sie die Pakete entsprechend an. Wenn Sie auf einem anderen Linux-VPS sind, gelten die gleichen Schritte - Sie verwenden einfach nicht die exe.dev-Proxy-Befehle.

### Was Sie brauchen

- exe.dev-Konto + `ssh exe.dev` funktioniert auf Ihrem Laptop
- SSH-Keys eingerichtet (Ihr Laptop → exe.dev)
- Modell-Authentifizierung, die Sie verwenden möchten (OAuth oder API-Key)
- Optionale Anbieter-Anmeldeinformationen (WhatsApp-QR-Scan, Telegram-Bot-Token, Discord-Bot-Token usw.)

### Schritt 1: VM erstellen

Von Ihrem Laptop:

```bash
ssh exe.dev new --name=clawdbot
```

Dann verbinden:

```bash
ssh clawdbot.exe.xyz
```

::: tip VM zustandsbehaftet halten
Halten Sie diese VM **zustandsbehaftet**. Clawdbot speichert Zustände unter `~/.clawdbot/` und `~/clawd/`.
:::

### Schritt 2: Voraussetzungen auf der VM installieren

```bash
sudo apt-get update
sudo apt-get install -y git curl jq ca-certificates openssl
```

### Node 22

Node **≥ 22.12** installieren (jede Methode funktioniert). Schnelle Überprüfung:

```bash
node -v
```

Falls Node 22 noch nicht auf der VM ist, verwenden Sie Ihren bevorzugten Node-Manager oder Distribution-Paketquellen, die Node 22+ bereitstellen.

### Schritt 3: Clawdbot installieren

Auf dem Server wird die globale npm-Installation empfohlen:

```bash
npm i -g clawdbot@latest
clawdbot --version
```

Wenn die Installation nativer Abhängigkeiten fehlschlägt (selten; normalerweise `sharp`), fügen Sie Build-Tools hinzu:

```bash
sudo apt-get install -y build-essential python3
```

### Schritt 4: Erstmalige Einrichtung (Assistent)

Führen Sie den Onboarding-Assistenten auf der VM aus:

```bash
clawdbot onboard --install-daemon
```

Es kann einrichten:
- `~/clawd` Arbeitsbereich-Bootstrap
- `~/.clawdbot/clawdbot.json` Konfiguration
- Modell-Authentifizierungs-Profile
- Modellanbieter-Konfiguration/Login
- Linux systemd **User**-Service (Service)

Wenn Sie OAuth auf einer headless-VM durchführen, führen Sie OAuth zuerst auf einer normalen Maschine durch und kopieren Sie dann das Authentifizierungsprofil auf die VM (siehe [Hilfe](https://docs.clawd.bot/help/)).

### Schritt 5: Fernzugriffsoptionen

#### Option A (empfohlen): SSH-Tunnel (nur Loopback)

Halten Sie das Gateway auf Loopback (Standard) und tunneln Sie es von Ihrem Laptop:

```bash
ssh -N -L 18789:127.0.0.1:18789 clawdbot.exe.xyz
```

Lokal öffnen:

- `http://127.0.0.1:18789/` (Control UI)

Details: [Fernzugriff](https://docs.clawd.bot/gateway/remote)

#### Option B: exe.dev HTTPS-Proxy (kein Tunnel erforderlich)

Um exe.dev Traffic an Ihre VM zu proxyen, binden Sie das Gateway an die LAN-Schnittstelle und setzen Sie ein Token:

```bash
export CLAWDBOT_GATEWAY_TOKEN="$(openssl rand -hex 32)"
clawdbot gateway --bind lan --port 8080 --token "$CLAWDBOT_GATEWAY_TOKEN"
```

Für den Service-Betrieb persistieren Sie es in `~/.clawdbot/clawdbot.json`:

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

::: info Wichtiger Hinweis
Nicht-Loopback-Bindung erfordert `gateway.auth.token` (oder `CLAWDBOT_GATEWAY_TOKEN`). `gateway.remote.token` ist nur für Remote-CLI-Aufrufe; es aktiviert keine lokale Authentifizierung.
:::

Dann zeigen Sie den Proxy auf Ihren gewählten Port in exe.dev (in diesem Beispiel `8080`, oder einen anderen Port Ihrer Wahl) und öffnen Sie die HTTPS-URL Ihrer VM:

```bash
ssh exe.dev share port clawdbot 8080
```

Öffnen:

`https://clawdbot.exe.xyz/`

Fügen Sie in der Control UI das Token ein (UI → Einstellungen → Token). Die UI sendet es als `connect.params.auth.token`.

::: tip Proxy-Port
Wenn der Proxy einen Anwendungsport erwartet, verwenden Sie vorzugsweise einen **nicht-standard**-Port (z.B. `8080`). Behandeln Sie das Token wie ein Passwort.
:::

### Schritt 6: Am Laufen halten (Service)

Auf Linux verwendet Clawdbot systemd **User**-Services. Nach `--install-daemon` überprüfen:

```bash
systemctl --user status clawdbot-gateway[-<profile>].service
```

Wenn der Service nach Abmeldung stoppt, aktivieren Sie Lingering:

```bash
sudo loginctl enable-linger "$USER"
```

### Schritt 7: Aktualisieren

```bash
npm i -g clawdbot@latest
clawdbot doctor
clawdbot gateway restart
clawdbot health
```

Details: [Aktualisierung](https://docs.clawd.bot/install/updating)

---

## Auswahl Empfehlungen

### Nach Anwendungsszenario wählen

| Szenario | Empfohlene Bereitstellung | Grund |
|--- | --- | ---|
| **Persönliche Nutzung, schneller Einstieg** | Lokale Installation | Am einfachsten, keine Infrastruktur erforderlich |
| **Multi-Device-Zugriff, gelegentliches Herunterfahren** | Fly.io | 24/7 online, von überall zugänglich |
| **Volle Kontrolle, eigene Infrastruktur** | Hetzner VPS | Volle Kontrolle, persistenter Status, kostengünstig |
| **Kostengünstig, kein VPS-Management** | exe.dev | Günstiges Hosting, schnelle Einrichtung |
| **Reproduzierbar, schnelles Rollback** | Nix | Deklarative Konfiguration, Versionen fixiert |
| **Tests, isolierte Umgebung** | Docker | Einfacher Neuaufbau, Test-Isolation |

### Sicherheits-Best-Practices

Unabhängig von der gewählten Bereitstellungsmethode sollten Sie folgende Sicherheitsprinzipien beachten:

::: warning Authentifizierung und Zugriffskontrolle
- Setzen Sie immer Token- oder Passwort-Authentifizierung für das Gateway (bei Nicht-Loopback-Bindung)
- Verwenden Sie Umgebungsvariablen zum Speichern sensibler Anmeldeinformationen (API-Keys, Tokens)
- Vermeiden Sie bei Cloud-Bereitstellungen öffentliche Exposition oder verwenden Sie private Netzwerke
:::

::: tip Statuspersistenz
- Stellen Sie bei containerisierten Bereitstellungen sicher, dass Konfiguration und Arbeitsbereich korrekt auf Host-Volumes gemountet sind
- Sichern Sie bei VPS-Bereitstellungen regelmäßig die Verzeichnisse `~/.clawdbot/` und `~/clawd/`
:::

### Überwachung und Logs

- Überprüfen Sie regelmäßig den Gateway-Status: `clawdbot doctor`
- Konfigurieren Sie Log-Rotation, um Festplattenplatz zu schonen
- Verwenden Sie Health-Check-Endpunkte, um die Dienstverfügbarkeit zu überprüfen

---

## Checkpoint ✅

**Lokale Installationsüberprüfung**:

```bash
clawdbot --version
clawdbot health
```

Sie sollten eine Nachricht sehen, dass das Gateway lauscht.

**Docker-Überprüfung**:

```bash
docker compose ps
docker compose logs clawdbot-gateway
```

Der Container-Status sollte `Up` sein, die Logs sollten `[gateway] listening on ws://...` anzeigen.

**Nix-Überprüfung**:

```bash
# Service-Status überprüfen
systemctl --user status clawdbot-gateway

# Nix-Modus überprüfen
defaults read com.clawdbot.mac clawdbot.nixMode
```

**Cloud-Bereitstellungsüberprüfung**:

```bash
# Fly.io
fly status
fly logs

# Hetzner / exe.dev
ssh root@YOUR_VPS_IP "docker compose logs -f clawdbot-gateway"
```

Sie sollten in der Lage sein, auf die Control UI über den Browser zuzugreifen oder über SSH-Tunnel.

---

## Häufige Probleme

::: warning Häufige Docker-Probleme
- **Falsche Mount-Pfade**: Stellen Sie sicher, dass Host-Pfade in Docker Desktop geteilt sind
- **Port-Konflikte**: Überprüfen Sie, ob Port 18789 bereits belegt ist
- **Berechtigungsprobleme**: Container-Benutzer (uid 1000) benötigt Lese-/Schreibrechte für gemountete Volumes
:::

::: warning Cloud-Bereitstellungsprobleme
- **OOM-Fehler**: Erhöhen Sie die Speicherzuweisung (mindestens 2GB)
- **Gateway-Lock**: Löschen Sie die Datei `/data/gateway.*.lock` und starten Sie den Container neu
- **Health-Check-Fehler**: Stellen Sie sicher, dass `internal_port` mit dem Gateway-Port übereinstimmt
:::

::: tip Binärdatei-Persistenz (Hetzner)
Installieren Sie keine Abhängigkeiten zur Laufzeit! Alle von Skills benötigten Binärdateien müssen in das Docker-Image eingebacken werden, sonst gehen sie nach dem Container-Neustart verloren.
:::

---

## Zusammenfassung dieser Lektion

Diese Lektion hat die verschiedenen Bereitstellungsmethoden für Clawdbot vorgestellt:

1. **Lokale Installation**: Am einfachsten und schnellsten, geeignet für persönliche Nutzung und Entwicklung
2. **Docker-Bereitstellung**: Isolierte Umgebung, einfacher Neuaufbau, Sandbox-Unterstützung
3. **Nix-Bereitstellung**: Deklarative Konfiguration, reproduzierbar, schnelles Rollback
4. **Fly.io**: Cloud-Plattform, automatisches HTTPS, 24/7-Online
5. **Hetzner VPS**: Eigener VPS, volle Kontrolle, persistenter Status
6. **exe.dev**: Günstiges Hosting, schnelle Einrichtung, vereinfachtes Operations-Management

Bei der Auswahl der Bereitstellungsmethode berücksichtigen Sie Ihr Anwendungsszenario, Ihre technischen Fähigkeiten und Ihre Operations-Anforderungen. Die Gewährleistung von Statuspersistenz und sicherer Konfiguration ist der Schlüssel zu einer erfolgreichen Bereitstellung.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie zum Erweitern der Quellcode-Positionen</strong></summary>

> Letzte Aktualisierung: 2026-01-27

| Funktion/Kapitel | Dateipfad | Zeilennummer |
|--- | --- | ---|
| Docker-Bereitstellungsskript | [`docker-setup.sh`](https://github.com/moltbot/moltbot/blob/main/docker-setup.sh) | Vollständiger Text |
| Docker-Image-Definition | [`Dockerfile`](https://github.com/moltbot/moltbot/blob/main/Dockerfile) | Vollständiger Text |
| Docker Compose-Konfiguration | [`docker-compose.yml`](https://github.com/moltbot/moltbot/blob/main/docker-compose.yml) | Vollständiger Text |
| Fly.io-Konfiguration | [`fly.toml`](https://github.com/moltbot/moltbot/blob/main/fly.toml) | Vollständiger Text |
| Fly Private-Konfiguration | [`fly.private.toml`](https://github.com/moltbot/moltbot/blob/main/fly.private.toml) | Vollständiger Text |
| Docker Sandbox-Image | [`Dockerfile.sandbox`](https://github.com/moltbot/moltbot/blob/main/Dockerfile.sandbox) | Vollständiger Text |
| Nix-Integration | [`nix-clawdbot`](https://github.com/clawdbot/nix-clawdbot) | README |
| Installationsskript | [`scripts/package-mac-app.sh`](https://github.com/moltbot/moltbot/blob/main/scripts/package-mac-app.sh) | Vollständiger Text |

**Wichtige Konfigurationsdateien**:
- `~/.clawdbot/clawdbot.json`: Hauptkonfigurationsdatei
- `~/.clawdbot/`: Statusverzeichnis (Sitzungen, Tokens, Auth-Profile)
- `~/clawd/`: Arbeitsbereichsverzeichnis

**Wichtige Umgebungsvariablen**:
- `CLAWDBOT_GATEWAY_TOKEN`: Gateway-Authentifizierungs-Token
- `CLAWDBOT_STATE_DIR`: Statusverzeichnispfad
- `CLAWDBOT_CONFIG_PATH`: Konfigurationsdateipfad
- `CLAWDBOT_NIX_MODE`: Nix-Modus aktivieren

**Wichtige Skripte**:
- `scripts/sandbox-setup.sh`: Standard-Sandbox-Image bauen
- `scripts/sandbox-common-setup.sh`: Allgemeines Sandbox-Image bauen
- `scripts/sandbox-browser-setup.sh`: Browser-Sandbox-Image bauen

**Docker-Umgebungsvariablen** (.env):
- `CLAWDBOT_IMAGE`: Zu verwendender Image-Name
- `CLAWDBOT_GATEWAY_BIND`: Bindungsmodus (lan/auto)
- `CLAWDBOT_GATEWAY_PORT`: Gateway-Port
- `CLAWDBOT_CONFIG_DIR`: Konfigurationsverzeichnis-Mount
- `CLAWDBOT_WORKSPACE_DIR`: Arbeitsbereich-Mount
- `GOG_KEYRING_PASSWORD`: Gmail-Keyring-Passwort
- `XDG_CONFIG_HOME`: XDG-Konfigurationsverzeichnis

**Fly.io-Umgebungsvariablen**:
- `NODE_ENV`: Laufzeitumgebung (production)
- `CLAWDBOT_PREFER_PNPM`: pnpm verwenden
- `CLAWDBOT_STATE_DIR`: Persistenzstatusverzeichnis
- `NODE_OPTIONS`: Node.js-Laufzeitoptionen

</details>
