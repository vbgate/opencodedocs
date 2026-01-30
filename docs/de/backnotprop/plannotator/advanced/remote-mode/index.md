---
title: "Remote-Modus: Konfigurationsanleitung | plannotator"
subtitle: "Remote-Modus: Konfigurationsanleitung | plannotator"
sidebarTitle: "Plannotator in Remote-Umgebungen nutzen"
description: "Erfahren Sie, wie Sie den Remote-Modus von Plannotator konfigurieren. Richten Sie feste Ports in SSH-, Devcontainer- und WSL-Umgebungen ein, konfigurieren Sie Port-Forwarding und greifen Sie über Ihren lokalen Browser auf die Review-Oberfläche zu."
tags:
  - "Remote-Entwicklung"
  - "Devcontainer"
  - "Port-Forwarding"
  - "SSH"
  - "WSL"
prerequisite:
  - "start-getting-started"
order: 4
---

# Konfiguration für Remote-/Devcontainer-Modus

## Was Sie lernen werden

- Plannotator auf einem per SSH verbundenen Remote-Server verwenden
- Plannotator in einem VS Code Devcontainer konfigurieren und darauf zugreifen
- Plannotator in einer WSL-Umgebung (Windows Subsystem for Linux) nutzen
- Port-Forwarding einrichten, damit Ihr lokaler Browser auf Plannotator in der Remote-Umgebung zugreifen kann

## Das Problem

Sie verwenden Claude Code oder OpenCode auf einem Remote-Server, in einem Devcontainer oder in einer WSL-Umgebung. Wenn die KI einen Plan generiert oder ein Code-Review benötigt, versucht Plannotator, einen Browser in der Remote-Umgebung zu öffnen – aber dort gibt es keine grafische Oberfläche, oder Sie möchten die Review-Oberfläche lieber in Ihrem lokalen Browser anzeigen.

## Wann Sie diese Lösung brauchen

Typische Szenarien für den Remote-/Devcontainer-Modus:

| Szenario | Beschreibung |
| --- | --- |
| **SSH-Verbindung** | Sie sind per SSH mit einem Remote-Entwicklungsserver verbunden |
| **Devcontainer** | Sie entwickeln in VS Code mit einem Devcontainer |
| **WSL** | Sie nutzen WSL unter Windows für Linux-Entwicklung |
| **Cloud-Umgebung** | Ihr Code läuft in einem Container oder einer VM in der Cloud |

## Das Grundkonzept

Die Nutzung von Plannotator in Remote-Umgebungen erfordert die Lösung zweier Probleme:

1. **Fester Port**: Remote-Umgebungen können keinen zufälligen Port automatisch wählen, da Port-Forwarding konfiguriert werden muss
2. **Browser-Zugriff**: Remote-Umgebungen haben keine grafische Oberfläche, daher muss der Zugriff über den Browser des lokalen Rechners erfolgen

Plannotator erkennt die Umgebungsvariable `PLANNOTATOR_REMOTE` und wechselt automatisch in den „Remote-Modus":
- Verwendet einen festen Port (Standard: 19432) statt eines zufälligen Ports
- Überspringt das automatische Öffnen des Browsers
- Gibt die URL im Terminal aus, damit Sie sie manuell in Ihrem lokalen Browser öffnen können

## 🎒 Voraussetzungen

::: warning Voraussetzungen

Bevor Sie mit diesem Tutorial beginnen, stellen Sie sicher, dass Sie:
- Den [Schnellstart](../../start/getting-started/) abgeschlossen haben
- Das [Claude Code Plugin](../../start/installation-claude-code/) oder das [OpenCode Plugin](../../start/installation-opencode/) installiert und konfiguriert haben
- Grundlegende Kenntnisse über SSH- oder Devcontainer-Konfiguration besitzen

:::

---

## Schritt-für-Schritt-Anleitung

### Schritt 1: Die Umgebungsvariablen für den Remote-Modus verstehen

Der Remote-Modus von Plannotator basiert auf drei Umgebungsvariablen:

| Umgebungsvariable | Beschreibung | Standardwert |
| --- | --- | --- |
| `PLANNOTATOR_REMOTE` | Aktiviert den Remote-Modus | Nicht gesetzt (lokaler Modus) |
| `PLANNOTATOR_PORT` | Feste Portnummer | Zufällig (lokal) / 19432 (remote) |
| `PLANNOTATOR_BROWSER` | Benutzerdefinierter Browser-Pfad | Standard-Systembrowser |

**Warum**

- `PLANNOTATOR_REMOTE` teilt Plannotator mit, dass es sich um eine Remote-Umgebung handelt und kein Browser geöffnet werden soll
- `PLANNOTATOR_PORT` legt einen festen Port fest, um die Konfiguration des Port-Forwardings zu erleichtern
- `PLANNOTATOR_BROWSER` (optional) gibt den Browser-Pfad auf dem lokalen Rechner an

---

### Schritt 2: Konfiguration auf einem SSH-Remote-Server

#### SSH-Port-Forwarding konfigurieren

Bearbeiten Sie Ihre SSH-Konfigurationsdatei `~/.ssh/config`:

```bash
Host your-server
    HostName your-server.com
    User your-username
    LocalForward 9999 localhost:9999
```

**Erwartetes Ergebnis**:
- Die Zeile `LocalForward 9999 localhost:9999` wurde hinzugefügt
- Dies leitet den Datenverkehr von Port 9999 auf Ihrem lokalen Rechner an Port 9999 auf dem Remote-Server weiter

#### Umgebungsvariablen auf dem Remote-Server setzen

Nachdem Sie sich mit dem Remote-Server verbunden haben, setzen Sie die Umgebungsvariablen im Terminal:

```bash
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_PORT=9999
```

**Warum**
- `PLANNOTATOR_REMOTE=1` aktiviert den Remote-Modus
- `PLANNOTATOR_PORT=9999` verwendet den festen Port 9999 (entsprechend der Portnummer in der SSH-Konfiguration)

::: tip Dauerhafte Konfiguration
Wenn es lästig ist, die Umgebungsvariablen bei jeder Verbindung manuell zu setzen, können Sie sie zu Ihrer Shell-Konfigurationsdatei (`~/.bashrc` oder `~/.zshrc`) hinzufügen:

```bash
echo 'export PLANNOTATOR_REMOTE=1' >> ~/.bashrc
echo 'export PLANNOTATOR_PORT=9999' >> ~/.bashrc
source ~/.bashrc
```
:::

#### Plannotator verwenden

Jetzt können Sie Claude Code oder OpenCode normal auf dem Remote-Server verwenden. Wenn die KI einen Plan generiert oder ein Code-Review benötigt:

```bash
# Auf dem Remote-Server gibt das Terminal eine ähnliche Meldung aus:
[Plannotator] Server running at http://localhost:9999
[Plannotator] Access from your local machine: http://localhost:9999
```

**Erwartetes Ergebnis**:
- Das Terminal zeigt die URL von Plannotator an
- In der Remote-Umgebung wird kein Browser geöffnet (normales Verhalten)

#### Im lokalen Browser zugreifen

Öffnen Sie in Ihrem lokalen Browser:

```
http://localhost:9999
```

**Erwartetes Ergebnis**:
- Die Review-Oberfläche von Plannotator wird korrekt angezeigt
- Sie können Plan-Reviews oder Code-Reviews wie in einer lokalen Umgebung durchführen

**Checkliste ✅**:
- [ ] SSH-Port-Forwarding ist konfiguriert
- [ ] Umgebungsvariablen sind gesetzt
- [ ] Das Terminal auf dem Remote-Server zeigt die URL an
- [ ] Der lokale Browser kann auf die Review-Oberfläche zugreifen

---

### Schritt 3: Konfiguration in VS Code Devcontainer

#### Devcontainer konfigurieren

Bearbeiten Sie Ihre `.devcontainer/devcontainer.json`-Datei:

```json
{
  "name": "Your Devcontainer",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",

  "containerEnv": {
    "PLANNOTATOR_REMOTE": "1",
    "PLANNOTATOR_PORT": "9999"
  },

  "forwardPorts": [9999]
}
```

**Warum**
- `containerEnv` setzt die Umgebungsvariablen innerhalb des Containers
- `forwardPorts` weist VS Code an, den Container-Port automatisch an den lokalen Rechner weiterzuleiten

#### Devcontainer neu erstellen und starten

1. Öffnen Sie die VS Code-Befehlspalette (`Strg+Umschalt+P` oder `Cmd+Umschalt+P`)
2. Geben Sie `Dev Containers: Rebuild Container` ein und führen Sie den Befehl aus
3. Warten Sie, bis der Container neu erstellt wurde

**Erwartetes Ergebnis**:
- VS Code zeigt unten rechts den Port-Forwarding-Status an (normalerweise ein kleines Symbol)
- Beim Klicken sehen Sie, dass „Port 9999" weitergeleitet wird

#### Plannotator verwenden

Verwenden Sie Claude Code oder OpenCode normal im Devcontainer. Wenn die KI einen Plan generiert:

```bash
# Terminal-Ausgabe im Container:
[Plannotator] Server running at http://localhost:9999
```

**Erwartetes Ergebnis**:
- Das Terminal zeigt die URL von Plannotator an
- Im Container wird kein Browser geöffnet (normales Verhalten)

#### Im lokalen Browser zugreifen

Öffnen Sie in Ihrem lokalen Browser:

```
http://localhost:9999
```

**Erwartetes Ergebnis**:
- Die Review-Oberfläche von Plannotator wird korrekt angezeigt

**Checkliste ✅**:
- [ ] Devcontainer-Konfiguration enthält Umgebungsvariablen und Port-Forwarding
- [ ] Container wurde neu erstellt
- [ ] VS Code zeigt an, dass der Port weitergeleitet wird
- [ ] Der lokale Browser kann auf die Review-Oberfläche zugreifen

---

### Schritt 4: Konfiguration in WSL-Umgebung

Die Konfiguration der WSL-Umgebung ähnelt der SSH-Verbindung, aber Sie müssen das Port-Forwarding nicht manuell einrichten – WSL leitet localhost-Datenverkehr automatisch an das Windows-System weiter.

#### Umgebungsvariablen setzen

Setzen Sie die Umgebungsvariablen im WSL-Terminal:

```bash
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_PORT=9999
```

::: tip Dauerhafte Konfiguration
Fügen Sie diese Umgebungsvariablen zu Ihrer WSL-Shell-Konfigurationsdatei (`~/.bashrc` oder `~/.zshrc`) hinzu:

```bash
echo 'export PLANNOTATOR_REMOTE=1' >> ~/.bashrc
echo 'export PLANNOTATOR_PORT=9999' >> ~/.bashrc
source ~/.bashrc
```
:::

#### Plannotator verwenden

Verwenden Sie Claude Code oder OpenCode normal in WSL:

```bash
# WSL-Terminal-Ausgabe:
[Plannotator] Server running at http://localhost:9999
```

**Erwartetes Ergebnis**:
- Das Terminal zeigt die URL von Plannotator an
- In WSL wird kein Browser geöffnet (normales Verhalten)

#### Im Windows-Browser zugreifen

Öffnen Sie im Windows-Browser:

```
http://localhost:9999
```

**Erwartetes Ergebnis**:
- Die Review-Oberfläche von Plannotator wird korrekt angezeigt

**Checkliste ✅**:
- [ ] Umgebungsvariablen sind gesetzt
- [ ] Das WSL-Terminal zeigt die URL an
- [ ] Der Windows-Browser kann auf die Review-Oberfläche zugreifen

---

## Fehlerbehebung

### Port bereits belegt

Wenn Sie einen ähnlichen Fehler sehen:

```
Error: bind: EADDRINUSE: address already in use :::9999
```

**Lösung**:
1. Wechseln Sie die Portnummer:
   ```bash
   export PLANNOTATOR_PORT=10000  # Wählen Sie einen nicht belegten Port
   ```
2. Oder beenden Sie den Prozess, der Port 9999 belegt:
   ```bash
   lsof -ti:9999 | xargs kill -9
   ```

### SSH-Port-Forwarding funktioniert nicht

Wenn der lokale Browser nicht auf Plannotator zugreifen kann:

**Checkliste**:
- [ ] Die Portnummer in `LocalForward` in der SSH-Konfigurationsdatei stimmt mit `PLANNOTATOR_PORT` überein
- [ ] Sie haben die SSH-Verbindung getrennt und neu hergestellt
- [ ] Die Firewall blockiert das Port-Forwarding nicht

### Devcontainer-Port-Forwarding funktioniert nicht

Wenn VS Code den Port nicht automatisch weiterleitet:

**Lösung**:
1. Überprüfen Sie die `forwardPorts`-Konfiguration in `.devcontainer/devcontainer.json`
2. Leiten Sie den Port manuell weiter:
   - Öffnen Sie die VS Code-Befehlspalette
   - Führen Sie `Forward a Port` aus
   - Geben Sie die Portnummer `9999` ein

### Kein Zugriff in WSL

Wenn der Windows-Browser nicht auf Plannotator in WSL zugreifen kann:

**Lösung**:
1. Überprüfen Sie, ob die Umgebungsvariablen korrekt gesetzt sind
2. Versuchen Sie `0.0.0.0` statt `localhost` (abhängig von der WSL-Version und Netzwerkkonfiguration)
3. Überprüfen Sie die Windows-Firewall-Einstellungen

---

## Zusammenfassung

Die wichtigsten Punkte zum Remote-/Devcontainer-Modus:

| Punkt | Beschreibung |
| --- | --- |
| **Umgebungsvariable** | `PLANNOTATOR_REMOTE=1` aktiviert den Remote-Modus |
| **Fester Port** | Verwenden Sie `PLANNOTATOR_PORT`, um einen festen Port festzulegen (Standard: 19432) |
| **Port-Forwarding** | SSH/Devcontainer erfordern Port-Forwarding-Konfiguration, WSL leitet automatisch weiter |
| **Manueller Zugriff** | Im Remote-Modus wird kein Browser automatisch geöffnet; Sie müssen manuell im lokalen Browser zugreifen |
| **Persistenz** | Fügen Sie Umgebungsvariablen zur Konfigurationsdatei hinzu, um wiederholtes Setzen zu vermeiden |

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir die **[detaillierte Konfiguration der Umgebungsvariablen](../environment-variables/)**.
>
> Sie werden lernen:
> - Alle verfügbaren Umgebungsvariablen von Plannotator
> - Die Funktion und Standardwerte jeder Umgebungsvariable
> - Wie Sie Umgebungsvariablen für verschiedene Szenarien kombinieren

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-24

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Remote-Session-Erkennung | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts#L16-L29) | 16-29 |
| Server-Port-Ermittlung | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts#L34-L49) | 34-49 |
| Server-Startlogik | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L91-L97) | 91-97 |
| Browser-Öffnungslogik | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts#L45-L74) | 45-74 |
| WSL-Erkennung | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts#L11-L34) | 11-34 |

**Wichtige Konstanten**:
- `DEFAULT_REMOTE_PORT = 19432`: Standard-Portnummer für den Remote-Modus

**Wichtige Funktionen**:
- `isRemoteSession()`: Erkennt, ob die Anwendung in einer Remote-Session läuft
- `getServerPort()`: Ermittelt den Server-Port (fester Port für Remote, zufälliger Port für lokal)
- `openBrowser(url)`: Öffnet den Browser plattformübergreifend

</details>
