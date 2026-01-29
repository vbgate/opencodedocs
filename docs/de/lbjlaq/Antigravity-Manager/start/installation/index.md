---
title: "Installation: Homebrew und Releases Deployment | Antigravity Manager"
sidebarTitle: "In 5 Minuten installiert"
subtitle: "Installation und Upgrade: Beste Installationsmethode für Desktop (brew / releases)"
description: "Lernen Sie die Homebrew- und Releases-Installationsmethoden für Antigravity Tools. Stellen Sie die Bereitstellung in 5 Minuten fertig, behandeln Sie macOS-Quarantäneprobleme und häufige Fehler bei beschädigten Anwendungen, und beherrschen Sie den Upgrade-Prozess."
tags:
  - "Installation"
  - "Upgrade"
  - "Homebrew"
  - "Releases"
  - "Docker"
prerequisite:
  - "start-getting-started"
order: 2
---

# Installation und Upgrade: Beste Installationsmethode für Desktop (brew / releases)

Wenn Sie Antigravity Tools schnell installieren und die nachfolgenden Kurse durchführen möchten, hat diese Lektion nur ein Ziel: Klar zu machen, wie Sie "installieren + öffnen können + wissen, wie man aktualisiert".

## Was Sie nach dieser Lektion können

- Wählen Sie den richtigen Installationspfad: Priorität Homebrew, danach GitHub Releases
- Behandeln Sie häufige macOS-Sperrungen (Quarantine / "Anwendung beschädigt")
- Installation in speziellen Umgebungen: Arch-Skript, Headless Xvfb, Docker
- Kennen Sie den Upgrade-Einstiegspunkt und die Selbstprüfungsmethode für jede Installationsart

## Ihre aktuelle Herausforderung

- Zu viele Installationsmethoden in der Dokumentation, Sie wissen nicht, welche Sie wählen sollen
- Nach dem Download unter macOS lässt es sich nicht öffnen, Meldung "beschädigt / kann nicht geöffnet werden"
- Sie laufen auf NAS/Server, weder haben Sie eine Desktop-Oberfläche noch ist die Bevollmächtigung bequem

## Wann verwenden Sie diese Methode

- Erste Installation von Antigravity Tools
- Wiederherstellung der Umgebung nach Computerwechsel / Neuinstallation des Systems
- Nach Version-Upgrades bei Systemsperren oder Startanomalien

::: warning Vorausgesetztes Wissen
Wenn Sie noch nicht sicher sind, welches Problem Antigravity Tools löst, schauen Sie zuerst auf **[Was ist Antigravity Tools](/de/lbjlaq/Antigravity-Manager/start/getting-started/)**, die Installation geht danach leichter.
:::

## Kernkonzept

Es wird empfohlen, dass Sie in der Reihenfolge "Desktop zuerst, Server später" wählen:

1. Desktop (macOS/Linux): Mit Homebrew installieren (am schnellsten, Upgrades sind auch am unkompliziertesten)
2. Desktop (alle Plattformen): Von GitHub Releases herunterladen (geeignet für diejenigen, die brew nicht installieren möchten oder Netzwerkeinschränkungen haben)
3. Server/NAS: Priorität Docker; danach Headless Xvfb (ähnlicher wie "Desktop-Anwendung auf dem Server laufen lassen")

## Machen Sie mit

### Schritt 1: Wählen Sie zuerst Ihre Installationsmethode

**Warum**
Die Kosten für "Upgrade / Rollback / Fehlerbehebung" sind bei verschiedenen Installationsmethoden sehr unterschiedlich. Die vorherige Wahl des Pfads vermeidet Umwege.

**Empfehlung**:

| Szenario | Empfohlene Installationsmethode |
|--- | ---|
| macOS / Linux Desktop | Homebrew (Option A) |
| Windows Desktop | GitHub Releases (Option B) |
| Arch Linux | Offizielles Skript (Arch-Option) |
| Remoteserver ohne Desktop | Docker (Option D) oder Headless Xvfb (Option C-Headless) |

**Sie sollten sehen**: Sie können klar erkennen, zu welcher Zeile Sie gehören.

### Schritt 2: Installation mit Homebrew (macOS / Linux)

**Warum**
Homebrew ist der Pfad, der "Download und Installation automatisch behandelt", Upgrades sind auch am einfachsten.

```bash
#1) Abonnieren Sie den Tap dieses Repository
brew tap lbjlaq/antigravity-manager https://github.com/lbjlaq/Antigravity-Manager

#2) Installieren Sie die Anwendung
brew install --cask antigravity-tools
```

::: tip macOS-Berechtigungshinweis
Die README erwähnt: Wenn Sie unter macOS Berechtigungs-/Isolationsprobleme haben, können Sie stattdessen verwenden:

```bash
brew install --cask --no-quarantine antigravity-tools
```
:::

**Sie sollten sehen**: `brew` gibt Installationserfolg aus, und die Antigravity Tools-Anwendung erscheint im System.

### Schritt 3: Manuelle Installation von GitHub Releases (macOS / Windows / Linux)

**Warum**
Wenn Sie Homebrew nicht verwenden oder die Quelle des Installationspakets selbst kontrollieren möchten, ist dieser Weg am direktesten.

1. Öffnen Sie die Releases-Seite des Projekts: `https://github.com/lbjlaq/Antigravity-Manager/releases`
2. Wählen Sie das Installationspaket, das zu Ihrem System passt:
   - macOS: `.dmg` (Apple Silicon / Intel)
   - Windows: `.msi` oder portable Version `.zip`
   - Linux: `.deb` oder `AppImage`
3. Schließen Sie die Installation nach den Hinweisen des System-Installationsprogramms ab

**Sie sollten sehen**: Nach Abschluss der Installation finden Sie Antigravity Tools in der Systemanwendungsliste und können es starten.

### Schritt 4: Behandlung von macOS "Anwendung beschädigt, kann nicht geöffnet werden"

**Warum**
Die README gibt explizit die Reparaturmethode für dieses Szenario; wenn Sie die gleiche Meldung erhalten, können Sie es einfach tun.

```bash
sudo xattr -rd com.apple.quarantine "/Applications/Antigravity Tools.app"
```

**Sie sollten sehen**: Beim erneuten Start der Anwendung erscheint die Sperrmeldung "beschädigt / kann nicht geöffnet werden" nicht mehr.

### Schritt 5: Upgrade (wählen Sie entsprechend Ihrer Installationsmethode)

**Warum**
Bei Upgrades besteht das größte Problem darin, dass "die Installationsmethode geändert wurde", sodass Sie nicht wissen, wo Sie aktualisieren sollen.

::: code-group

```bash [Homebrew]
#Vor dem Upgrade zuerst Tap-Informationen aktualisieren
brew update

#Cask upgraden
brew upgrade --cask antigravity-tools
```

```text [Releases]
Laden Sie das neueste Installationspaket (.dmg/.msi/.deb/AppImage) neu herunter und installieren Sie es über die Systemhinweise durch Überschreiben.
```

```bash [Headless Xvfb]
cd /opt/antigravity
sudo ./upgrade.sh
```

```bash [Docker]
cd deploy/docker

#Die README erklärt, dass der Container beim Start versucht, das neueste Release zu ziehen; die einfachste Upgrade-Methode ist der Neustart des Containers
docker compose restart
```

:::

**Sie sollten sehen**: Nach Abschluss des Upgrades kann die Anwendung weiterhin normal gestartet werden; wenn Sie Docker/Headless verwenden, können Sie weiterhin auf den Health-Check-Endpunkt zugreifen.

## Andere Installationsmethoden (spezifische Szenarien)

### Arch Linux: Offizielles Ein-Klick-Installationsskript

Die README bietet den Einstieg für das Arch-Skript:

```bash
curl -sSL https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/arch/install.sh | bash
```

::: details Was macht dieses Skript?
Es ruft über die GitHub API das neueste Release ab, lädt das `.deb`-Asset herunter, berechnet SHA256, generiert dann PKGBUILD und installiert mit `makepkg -si`.
:::

### Remoteserver: Headless Xvfb

Wenn Sie GUI-Anwendungen auf einem Linux-Server ohne Benutzeroberfläche ausführen müssen, stellt das Projekt Xvfb-Bereitstellung bereit:

```bash
curl -fsSL https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/headless-xvfb/install.sh | sudo bash
```

Nach Abschluss der Installation umfassen die in der Dokumentation angegebenen häufigen Selbstprüfungsbefehle:

```bash
systemctl status antigravity
tail -f /opt/antigravity/logs/app.log
curl localhost:8045/healthz
```

### NAS/Server: Docker (mit Browser-VNC)

Docker-Bereitstellung stellt im Browser noVNC bereit (bequem für OAuth/Authorisierungsvorgänge) und leitet gleichzeitig Proxy-Ports weiter:

```bash
cd deploy/docker
docker compose up -d
```

Sie sollten auf `http://localhost:6080/vnc_lite.html` zugreifen können.

## Warnungen vor häufigen Problemen

- brew-Installation fehlgeschlagen: Bestätigen Sie zuerst, dass Sie Homebrew installiert haben, und versuchen Sie dann erneut das `brew tap` / `brew install --cask` aus der README
- macOS kann nicht geöffnet werden: Versuchen Sie zuerst `--no-quarantine`; bereits installiert verwenden Sie `xattr`, um Quarantine zu bereinigen
- Einschränkungen bei Serverbereitstellung: Headless Xvfb ist im Wesentlichen "Desktop-Anwendung mit virtuellem Bildschirm ausführen", die Ressourcennutzung ist höher als bei reinen Backend-Diensten

## Zusammenfassung dieser Lektion

- Für Desktop am empfehlenswertesten: Homebrew (Installation und Upgrade sind unkompliziert)
- Ohne brew: Direkt GitHub Releases verwenden
- Server/NAS: Priorität Docker; benötigen Sie systemd-Verwaltung, verwenden Sie Headless Xvfb

## Vorschau auf die nächste Lektion

In der nächsten Lektion machen wir einen Schritt weiter von "kann geöffnet werden": Wir klären **[Datenverzeichnis, Protokolle, Tray und automatischer Start](/de/lbjlaq/Antigravity-Manager/start/first-run-data/)**, damit Sie bei Problemen wissen, wo Sie Fehler suchen können.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Thema | Dateipfad | Zeilennummer |
|--- | --- | ---|
|--- | --- | ---|
| Releases manuelles Download (Installationspakete für verschiedene Plattformen) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L128-L133) | 128-133 |
|--- | --- | ---|
|--- | --- | ---|
| Headless Xvfb-Installationseinstieg (curl | sudo bash) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L141-L149) | 141-149 |
|--- | --- | ---|
| Headless Xvfb install.sh (systemd + 8045 Standardkonfiguration) | [`deploy/headless-xvfb/install.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/install.sh#L1-L99) | 1-99 |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|

</details>
