---
title: "Bereitstellung: Server-Bereitstellungsoptionen | Antigravity-Manager"
sidebarTitle: "Auf dem Server zum Laufen bringen"
subtitle: "Bereitstellung: Server-Bereitstellungsoptionen"
description: "Erfahren Sie die Server-Bereitstellungsmethoden von Antigravity-Manager. Vergleichen Sie Docker noVNC und Headless Xvfb, führen Sie Installation und Konfiguration durch, implementieren Sie Datenpersistenz und Health Checks, und richten Sie eine betriebsbereite Serverumgebung ein."
tags:
  - "deployment"
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
# Server-Bereitstellung: Docker noVNC vs Headless Xvfb (Auswahl und Betrieb)

Sie möchten Antigravity Tools auf einem Server bereitstellen und es auf einem NAS/Server laufen lassen. Normalerweise nicht, um "die GUI aus der Ferne zu öffnen und zu betrachten", sondern um es als einen langfristig laufenden lokalen API-Gateway zu verwenden: immer online, Health Checks fähig, upgradefähig, backupfähig und bei Problemen lokalisierbar.

Diese Lektion behandelt nur zwei bereits im Projekt bereitgestellte umsetzbare Pfade: Docker (mit noVNC) und Headless Xvfb (systemd-verwaltet). Alle Befehle und Standardwerte basieren auf den Bereitstellungsdateien im Repository.

::: tip Wenn Sie es nur einmal "zum Laufen bringen" wollen
Das Kapitel zur Installation und Einrichtung enthält bereits die Einstiegspunkte für Docker und Headless Xvfb. Sie können zuerst **[Installation und Upgrade](/de/lbjlaq/Antigravity-Manager/start/installation/)** lesen und dann zu dieser Lektion zurückkehren, um den "Betriebs-Kreislauf" zu vervollständigen.
:::

## Was Sie nach dieser Lektion tun können

- Die richtige Bereitstellungsform auswählen: Wissen, welche Probleme Docker noVNC und Headless Xvfb jeweils lösen
- Einen vollständigen Kreislauf durchlaufen: Bereitstellung -> Kontodatens synchronisieren -> Health Check `/healthz` -> Logs ansehen -> Backup
- Upgrades zu kontrollierbaren Aktionen machen: Den Unterschied zwischen Docker- "automatischer Update beim Start" und Xvfb `upgrade.sh` kennen

## Ihre aktuelle Situation

- Der Server hat keine Desktop-Oberfläche, aber Sie benötigen OAuth/Autorisierung und andere Vorgänge, die "einen Browser erfordern"
- Es reicht nicht aus, es nur einmal zum Laufen zu bringen. Sie möchten: automatische Wiederherstellung nach Stromausfall und Neustart, Health Checks fähig, backupfähig
- Sie haben Bedenken, dass das Offenlegen von Port 8045 Sicherheitsrisiken birgt, wissen aber nicht, wo Sie ansetzen sollen

## Wann Sie diesen Ansatz verwenden sollten

- NAS/Heimserver: Möchten die GUI im Browser öffnen, um Autorisierungen durchzuführen (Docker/noVNC ist sehr unkompliziert)
- Server langfristig laufen: Möchten eher Prozesse mit systemd verwalten, Protokolle auf Festplatte speichern, Upgrades über Skripte (Headless Xvfb ähnelt eher einem "Betriebs-Projekt")

## Was ist der Modus "Server-Bereitstellung"?

**Server-Bereitstellung** bedeutet, dass Sie Antigravity Tools nicht auf Ihrem lokalen Desktop ausführen, sondern auf einer dauerhaft verfügbaren Maschine, und den Reverse-Proxy-Port (Standard 8045) als externen Dienst-Eingang verwenden. Sein Kern ist nicht "Benutzeroberfläche aus der Ferne betrachten", sondern einen stabilen Betriebs-Kreislauf aufzubauen: Datenpersistenz, Health Checks, Protokollierung, Upgrade und Backup.

## Kernprinzipien

1. Wählen Sie zuerst "die Fähigkeit, die Ihnen am meisten fehlt": Wenn Sie Browser-Autorisierung benötigen, wählen Sie Docker/noVNC; wenn Sie betriebliche Kontrolle benötigen, wählen Sie Headless Xvfb.
2. Legen Sie dann die "Daten" fest: Konten/Konfigurationen befinden sich alle in `.antigravity_tools/`, entweder mit Docker-Volumes oder fest unter `/opt/antigravity/.antigravity_tools/`.
3. Erstellen Sie schließlich einen "betriebsbereiten Kreislauf": Health Checks mit `/healthz`, bei Fehlern zuerst Logs ansehen, dann entscheiden, ob neu gestartet oder ein Upgrade durchgeführt wird.

::: warning Vorab-Hinweis: Definieren Sie zuerst die Sicherheitsbasis
Wenn Sie 8045 im LAN/Internet offenlegen, lesen Sie zuerst **[Sicherheit und Datenschutz: auth_mode, allow_lan_access sowie das Design "Keine Kontoinformationen preisgeben"](./security/)**.
:::

## Schnellauswahl: Docker vs Headless Xvfb

| Was Ihnen am wichtigsten ist | Empfehlung | Warum |
|--- | --- | ---|
| Browser für OAuth/Autorisierung erforderlich | Docker (noVNC) | Der Container enthält Firefox ESR und ermöglicht direkte Operationen im Browser (siehe `deploy/docker/README.md`) |
| systemd-Verwaltung/Logs auf Festplatte gewünscht | Headless Xvfb | Das Installations-Skript installiert einen systemd-Dienst und hängt Logs an `logs/app.log` an (siehe `deploy/headless-xvfb/install.sh`) |
| Isolation und Ressourcenbegrenzung gewünscht | Docker | Compose-Art isoliert von Natur aus und erleichtert die Konfiguration von Ressourcenbegrenzungen (siehe `deploy/docker/README.md`) |

## Lernen Sie mit mir

### Schritt 1: Bestätigen Sie zuerst, wo sich das "Datenverzeichnis" befindet

**Warum**
Bereitstellung erfolgreich, aber "keine Konten/Konfigurationen" bedeutet im Grunde, dass das Datenverzeichnis nicht übertragen oder nicht persistiert wurde.

- Die Docker-Lösung hängt die Daten an `/home/antigravity/.antigravity_tools` im Container (compose volume)
- Die Headless Xvfb-Lösung speichert die Daten unter `/opt/antigravity/.antigravity_tools` (und fixiert den Schreibort durch `HOME=$(pwd)`)

**Was Sie sehen sollten**
- Docker: `docker volume ls` zeigt `antigravity_data`
- Xvfb: `/opt/antigravity/.antigravity_tools/` existiert und enthält `accounts/`, `gui_config.json`

### Schritt 2: Docker/noVNC zum Laufen bringen (geeignet für Browser-Autorisierung)

**Warum**
Die Docker-Lösung packt "virtueller Bildschirm + Fenster-Manager + noVNC + Anwendung + Browser" in einen Container und erspart Ihnen die Installation einer Reihe von grafischen Abhängigkeiten auf dem Server.

Führen Sie auf dem Server aus:

```bash
cd deploy/docker
docker compose up -d
```

Öffnen Sie noVNC:

```text
http://<server-ip>:6080/vnc_lite.html
```

**Was Sie sehen sollten**
- `docker compose ps` zeigt, dass der Container läuft
- Der Browser kann die noVNC-Seite öffnen

::: tip Über noVNC-Port (empfohlen, Standard beizubehalten)
`deploy/docker/README.md` erwähnt, dass der Port mit `NOVNC_PORT` angepasst werden kann. In der aktuellen Implementierung überwacht `start.sh` beim Start von `websockify` jedoch den fest codierten Port 6080. Um den Port zu ändern, müssen Sie sowohl die Port-Zuordnung in docker-compose als auch den Überwachungs-Port in start.sh anpassen.

Um Konfigurationsinkonsistenzen zu vermeiden, wird empfohlen, direkt den Standard 6080 zu verwenden.
:::

### Schritt 3: Persistenz, Health Checks und Backup bei Docker

**Warum**
Die Verfügbarkeit von Containern hängt von zwei Dingen ab: Prozessgesundheit (läuft er noch) und Datenpersistenz (Konten nach Neustart noch vorhanden).

1) Bestätigen Sie, dass das persistente Volume eingehängt ist:

```bash
cd deploy/docker
docker compose ps
```

2) Volume sichern (das Projekt-README bietet eine tar-Backup-Methode):

```bash
docker run --rm -v antigravity_data:/data -v $(pwd):/backup alpine \
  tar czf /backup/antigravity-backup.tar.gz /data
```

3) Container-Health-Check (Dockerfile hat HEALTHCHECK):

```bash
docker inspect --format '{{json .State.Health}}' antigravity-manager | jq
```

**Was Sie sehen sollten**
- `.State.Health.Status` ist `healthy`
- Im aktuellen Verzeichnis wird `antigravity-backup.tar.gz` erstellt

### Schritt 4: Headless Xvfb Ein-Klick-Installation (geeignet für systemd-Betrieb)

**Warum**
Headless Xvfb ist kein "reiner Backend-Modus", sondern verwendet einen virtuellen Bildschirm, um GUI-Programme auf dem Server auszuführen. Dafür erhalten Sie jedoch eine vertrautere Betriebsart: systemd, festes Verzeichnis, Protokolle auf Festplatte.

Führen Sie auf dem Server aus (ein vom Projekt bereitgestelltes Ein-Klick-Skript):

```bash
curl -fsSL https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/headless-xvfb/install.sh | sudo bash
```

**Was Sie sehen sollten**
- Das Verzeichnis `/opt/antigravity/` existiert
- `systemctl status antigravity` zeigt, dass der Dienst läuft

::: tip Sicherer Ansatz: Skript zuerst prüfen
Laden Sie `curl -O .../install.sh` herunter und lesen Sie es zuerst, bevor Sie `sudo bash install.sh` ausführen.
:::

### Schritt 5: Lokale Konten auf den Server synchronisieren (bei Xvfb-Lösung erforderlich)

**Warum**
Die Xvfb-Installation bringt das Programm nur zum Laufen. Damit der Reverse-Proxy wirklich funktionieren kann, müssen Sie die bereits vorhandenen lokalen Konten/Konfigurationen in das Datenverzeichnis des Servers synchronisieren.

Das Projekt bietet `sync.sh`, das automatisch auf Ihrem Computer Datenverzeichnisse nach Priorität durchsucht (z.B. `~/.antigravity_tools`, `~/Library/Application Support/Antigravity Tools`) und dann mit rsync auf den Server überträgt:

```bash
curl -O https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/headless-xvfb/sync.sh
chmod +x sync.sh

./sync.sh root@your-server /opt/antigravity
```

**Was Sie sehen sollten**
- Terminal-Ausgabe ähnlich: `Synchronisierung: <local> -> root@your-server:/opt/antigravity/.antigravity_tools/`
- Der Remotedienst wird versucht neu zu starten (das Skript ruft `systemctl restart antigravity` auf)

### Schritt 6: Health Checks und Fehlerbehebung (für beide Lösungen anwendbar)

**Warum**
Die erste Aufgabe nach der Bereitstellung ist nicht "zuerst einen Client anzuschließen", sondern zuerst einen Eingang zu erstellen, mit dem Sie schnell die Gesundheit beurteilen können.

1) Health Check (Reverse-Proxy-Dienst bietet `/healthz`):

```bash
curl -i http://127.0.0.1:8045/healthz
```

2) Logs ansehen:

```bash
## Docker
cd deploy/docker
docker compose logs -f

## Headless Xvfb
tail -f /opt/antigravity/logs/app.log
```

**Was Sie sehen sollten**
- `/healthz` gibt 200 zurück (die genaue Antwort richtet sich nach der tatsächlichen Implementierung)
- In den Logs sind Startinformationen des Reverse-Proxy-Dienstes zu sehen

### Schritt 7: Upgrade-Strategie (betrachten Sie "automatisches Update" nicht als einzige Lösung)

**Warum**
Upgrades sind die Aktionen, die am leichtesten "das System auf nicht verfügbar upgraden". Sie müssen wissen, was bei jedem Upgrade-Ansatz tatsächlich geschieht.

- Docker: Beim Start des Containers versucht er, über die GitHub-API die neueste `.deb` herunterzuladen und zu installieren (bei Rate-Limit oder Netzwerkausnahmen wird die zwischengespeicherte Version verwendet).
- Headless Xvfb: Verwendet `upgrade.sh`, um die neueste AppImage herunterzuladen, und rollt bei Fehlern nach einem Neustart auf die Sicherung zurück.

Headless Xvfb Upgrade-Befehl (aus dem Projekt-README):

```bash
cd /opt/antigravity
sudo ./upgrade.sh
```

**Was Sie sehen sollten**
- Ausgabe ähnlich: `Upgrade: v<current> -> v<latest>`
- Nach dem Upgrade ist der Dienst weiterhin aktiv (das Skript führt `systemctl restart antigravity` aus und prüft den Status)

## Häufige Fallstricke

| Szenario | Häufiger Fehler (❌) | Empfohlener Ansatz (✓) |
|--- | --- | ---|
| Konten/Konfigurationen verloren | ❌ Nur darauf achten, dass "das Programm läuft" | ✓ Bestätigen Sie zuerst, dass `.antigravity_tools/` persistiert ist (volume oder `/opt/antigravity`) |
| noVNC-Portänderung nicht wirksam | ❌ Nur `NOVNC_PORT` ändern | ✓ Behalten Sie den Standard 6080 bei; wenn Sie ändern, prüfen Sie gleichzeitig den `websockify`-Port in `start.sh` |
| 8045 im Internet offenlegen | ❌ Keinen `api_key` festlegen/auth_mode ignorieren | ✓ Führen Sie zuerst die **[Sicherheit und Datenschutz](./security/)**-Basis durch, dann überlegen Sie Tunnel/Reverse-Proxy |

## Zusammenfassung dieser Lektion

- Docker/noVNC löst das Problem "Server hat keinen Browser/keine Desktop-Oberfläche, aber Autorisierung erforderlich", geeignet für NAS-Szenarien
- Headless Xvfb ähnelt eher einem Standard-Betrieb: Festes Verzeichnis, systemd-Verwaltung, Skripte für Upgrade/Rollback
- Unabhängig von der Lösung: Machen Sie zuerst den Kreislauf richtig: Daten -> Health Check -> Logs -> Backup -> Upgrade

## Empfohlene weitere Lektüre

- Wenn Sie den Dienst im LAN/Internet offenlegen wollen: **[Sicherheit und Datenschutz: auth_mode, allow_lan_access](./security/)**
- 401 nach der Bereitstellung: **[401/Authentifizierungsfehler: auth_mode, Header-Kompatibilität und Client-Konfigurations-Checkliste](../../faq/auth-401/)**
- Wenn Sie den Dienst über einen Tunnel offenlegen wollen: **[Cloudflared Ein-Klick-Tunnel](../../platforms/cloudflared/)**

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
| Headless Xvfb: Verzeichnisstruktur und Betriebsbefehle (systemctl/healthz) | [`deploy/headless-xvfb/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/README.md#L19-L78) | 19-78 |
| Headless Xvfb: install.sh installiert Abhängigkeiten und initialisiert gui_config.json (Standard 8045) | [`deploy/headless-xvfb/install.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/install.sh#L16-L67) | 16-67 |
| Headless Xvfb: sync.sh sucht automatisch lokale Datenverzeichnisse und rsynct auf den Server | [`deploy/headless-xvfb/sync.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/sync.sh#L8-L32) | 8-32 |
| Headless Xvfb: upgrade.sh lädt neue Version herunter und rollt bei Fehlern zurück | [`deploy/headless-xvfb/upgrade.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/upgrade.sh#L11-L51) | 11-51 |
|--- | --- | ---|

</details>
