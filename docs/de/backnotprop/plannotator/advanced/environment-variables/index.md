---
title: "Umgebungsvariablen: Remote-Modus und Port-Konfiguration | plannotator"
sidebarTitle: "Remote-Konfiguration in 5 Minuten"
subtitle: "Umgebungsvariablen: Remote-Modus und Port-Konfiguration"
description: "Lernen Sie die Konfiguration von plannotator-Umgebungsvariablen. Richten Sie Remote-Modus, feste Ports, benutzerdefinierte Browser und URL-Freigabe für SSH, Devcontainer und WSL ein."
tags:
  - "Umgebungsvariablen"
  - "Remote-Modus"
  - "Port-Konfiguration"
  - "Browser-Konfiguration"
  - "URL-Freigabe"
  - "Devcontainer"
  - "WSL"
prerequisite:
  - "start-getting-started"
  - "start-installation-claude-code"
  - "start-installation-opencode"
order: 5
---

# Umgebungsvariablen-Konfiguration

## Was Sie nach diesem Tutorial können

- ✅ Plannotator korrekt in Remote-Umgebungen wie SSH, Devcontainer und WSL konfigurieren
- ✅ Feste Ports verwenden, um Port-Konflikte und häufige Port-Forwarding-Konfigurationen zu vermeiden
- ✅ Einen benutzerdefinierten Browser für die Plan-Review-Oberfläche festlegen
- ✅ URL-Freigabefunktion aktivieren oder deaktivieren
- ✅ Standardwerte und Verhalten jeder Umgebungsvariable verstehen

## Ihre aktuelle Herausforderung

**Problem 1**: Bei Verwendung von Plannotator über SSH oder Devcontainer öffnet sich der Browser nicht automatisch oder der lokale Server ist nicht erreichbar.

**Problem 2**: Bei jedem Neustart von Plannotator wird ein zufälliger Port verwendet, was ständige Aktualisierungen der Port-Forwarding-Konfiguration erfordert.

**Problem 3**: Der Standard-Browser des Systems entspricht nicht Ihren Gewohnheiten, Sie möchten Pläne in einem bestimmten Browser anzeigen.

**Problem 4**: Aus Sicherheitsgründen möchten Sie die URL-Freigabefunktion deaktivieren, um versehentliches Teilen von Plänen zu verhindern.

**Plannotator hilft Ihnen**:
- Automatische Erkennung von Remote-Umgebungen über Umgebungsvariablen und Deaktivierung des automatischen Browser-Öffnens
- Feste Ports erleichtern die Port-Forwarding-Konfiguration
- Unterstützung für benutzerdefinierte Browser
- Umgebungsvariablen zur Steuerung der URL-Freigabe

## Wann Sie diese Methode verwenden

**Anwendungsfälle**:
- Verwendung von Claude Code oder OpenCode auf SSH-Remote-Servern
- Entwicklung in Devcontainer-Containern
- Arbeit in WSL (Windows Subsystem for Linux)
- Bedarf an festen Ports zur Vereinfachung der Port-Forwarding-Konfiguration
- Verwendung eines bestimmten Browsers (z.B. Chrome, Firefox)
- Unternehmens-Sicherheitsrichtlinien erfordern Deaktivierung der URL-Freigabe

**Nicht geeignet für**:
- Lokale Entwicklung mit Standard-Browser (keine Umgebungsvariablen erforderlich)
- Kein Port-Forwarding erforderlich (vollständig lokale Entwicklung)

## Kernkonzept

### Was sind Umgebungsvariablen

**Umgebungsvariablen** sind ein vom Betriebssystem bereitgestellter Schlüssel-Wert-Konfigurationsmechanismus. Plannotator liest Umgebungsvariablen, um sich an verschiedene Laufzeitumgebungen (lokal oder remote) anzupassen.

::: info Warum werden Umgebungsvariablen benötigt?

Plannotator geht standardmäßig davon aus, dass Sie in einer lokalen Entwicklungsumgebung arbeiten:
- Lokaler Modus: Zufälliger Port (vermeidet Port-Konflikte)
- Lokaler Modus: Automatisches Öffnen des Standard-Browsers
- Lokaler Modus: URL-Freigabefunktion aktiviert

In Remote-Umgebungen (SSH, Devcontainer, WSL) müssen diese Standardverhalten angepasst werden:
- Remote-Modus: Fester Port (erleichtert Port-Forwarding)
- Remote-Modus: Kein automatisches Öffnen des Browsers (muss auf Host-Rechner geöffnet werden)
- Remote-Modus: Möglicherweise Deaktivierung der URL-Freigabe (Sicherheitsüberlegungen)

Umgebungsvariablen ermöglichen es Ihnen, das Verhalten von Plannotator in verschiedenen Umgebungen anzupassen, ohne Code zu ändern.
:::

### Priorität der Umgebungsvariablen

Plannotator liest Umgebungsvariablen mit folgender Priorität:

```
Explizite Umgebungsvariable > Standardverhalten

Beispiel:
PLANNOTATOR_PORT=3000 > Remote-Modus Standard-Port 19432 > Lokaler Modus zufälliger Port
```

Das bedeutet:
- Wenn `PLANNOTATOR_PORT` gesetzt ist, wird dieser Port unabhängig vom Remote-Modus verwendet
- Wenn `PLANNOTATOR_PORT` nicht gesetzt ist, verwendet der Remote-Modus 19432, der lokale Modus einen zufälligen Port

## 🎒 Vorbereitung

Vor der Konfiguration der Umgebungsvariablen stellen Sie sicher:

- [ ] Plannotator-Installation abgeschlossen ([Claude Code Installation](../installation-claude-code/) oder [OpenCode Installation](../installation-opencode/))
- [ ] Sie kennen Ihre aktuelle Laufzeitumgebung (lokal, SSH, Devcontainer, WSL)
- [ ] (Remote-Umgebung) Port-Forwarding konfiguriert (z.B. SSH `-L` Parameter oder Devcontainer `forwardPorts`)

## Schritt-für-Schritt-Anleitung

### Schritt 1: Remote-Modus konfigurieren (SSH, Devcontainer, WSL)

**Warum**
Der Remote-Modus verwendet automatisch einen festen Port und deaktiviert das automatische Öffnen des Browsers, geeignet für SSH, Devcontainer, WSL und ähnliche Umgebungen.

**Vorgehensweise**

::: code-group

```bash [macOS/Linux/WSL (Bash)]
export PLANNOTATOR_REMOTE=1
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_REMOTE="1"
```

```cmd [Windows CMD]
set PLANNOTATOR_REMOTE=1
```

:::

**Was Sie sehen sollten**: Keine visuelle Rückmeldung, die Umgebungsvariable ist gesetzt.

**Dauerhaft aktivieren** (empfohlen):

::: code-group

```bash [~/.bashrc oder ~/.zshrc]
echo 'export PLANNOTATOR_REMOTE=1' >> ~/.bashrc
source ~/.bashrc
```

```powershell [PowerShell Profile]
[Environment]::SetEnvironmentVariable('PLANNOTATOR_REMOTE', '1', 'User')
```

```cmd [System-Umgebungsvariablen]
# Über "Systemeigenschaften > Umgebungsvariablen" hinzufügen
```

:::

### Schritt 2: Festen Port konfigurieren (erforderlich für Remote-Umgebungen)

**Warum**
Remote-Umgebungen benötigen einen festen Port für die Port-Forwarding-Konfiguration. Auch lokale Umgebungen können bei Bedarf einen festen Port festlegen.

**Standard-Port-Regeln**:
- Lokaler Modus (ohne `PLANNOTATOR_REMOTE`): Zufälliger Port (`0`)
- Remote-Modus (`PLANNOTATOR_REMOTE=1`): Standard `19432`
- Explizit gesetzter `PLANNOTATOR_PORT`: Verwendet angegebenen Port

**Vorgehensweise**

::: code-group

```bash [macOS/Linux/WSL (Bash)]
# Auf 19432 setzen (Remote-Modus Standard)
export PLANNOTATOR_PORT=19432

# Oder benutzerdefinierten Port
export PLANNOTATOR_PORT=3000
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_PORT="19432"
```

```cmd [Windows CMD]
set PLANNOTATOR_PORT=19432
```

:::

**Was Sie sehen sollten**: Keine visuelle Rückmeldung, die Umgebungsvariable ist gesetzt.

**Checkpoint ✅**: Port-Wirksamkeit überprüfen

Nach Neustart von Claude Code oder OpenCode Plan-Review auslösen und Terminal-URL-Ausgabe prüfen:

```bash
# Lokaler Modus Ausgabe (zufälliger Port)
http://localhost:54321

# Remote-Modus Ausgabe (fester Port 19432)
http://localhost:19432
```

**Port-Forwarding-Konfigurationsbeispiele**:

SSH Remote-Entwicklung:
```bash
ssh -L 19432:localhost:19432 user@remote-server
```

Devcontainer (`.devcontainer/devcontainer.json`):
```json
{
  "forwardPorts": [19432]
}
```

### Schritt 3: Benutzerdefinierten Browser konfigurieren

**Warum**
Der Standard-Browser des Systems ist möglicherweise nicht Ihre Präferenz (z.B. Sie arbeiten in Chrome, aber Safari ist Standard).

**Vorgehensweise**

::: code-group

```bash [macOS (Bash)]
# Anwendungsname verwenden (macOS-Unterstützung)
export PLANNOTATOR_BROWSER="Google Chrome"

# Oder vollständigen Pfad verwenden
export PLANNOTATOR_BROWSER="/Applications/Google Chrome.app"
```

```bash [Linux (Bash)]
# Pfad zur ausführbaren Datei verwenden
export PLANNOTATOR_BROWSER="/usr/bin/firefox"

# Oder relativen Pfad (wenn in PATH)
export PLANNOTATOR_BROWSER="firefox"
```

```powershell [Windows PowerShell]
# Pfad zur ausführbaren Datei verwenden
$env:PLANNOTATOR_BROWSER="C:\Program Files\Google\Chrome\Application\chrome.exe"
```

```cmd [Windows CMD]
set PLANNOTATOR_BROWSER=C:\Program Files\Google\Chrome\Application\chrome.exe
```

:::

**Was Sie sehen sollten**: Beim nächsten Plan-Review öffnet Plannotator den angegebenen Browser.

**Checkpoint ✅**: Browser-Wirksamkeit überprüfen

Nach Neustart Plan-Review auslösen und beobachten:
- macOS: Die angegebene Anwendung wird geöffnet
- Windows: Der angegebene Browser-Prozess wird gestartet
- Linux: Der angegebene Browser-Befehl wird ausgeführt

**Gängige Browser-Pfade**:

| Betriebssystem | Browser | Pfad/Befehl |
| --- | --- | --- |
| macOS | Chrome | `Google Chrome` oder `/Applications/Google Chrome.app` |
| macOS | Firefox | `Firefox` oder `/Applications/Firefox.app` |
| macOS | Safari | `Safari` |
| Linux | Chrome | `google-chrome` oder `/usr/bin/google-chrome` |
| Linux | Firefox | `firefox` oder `/usr/bin/firefox` |
| Windows | Chrome | `C:\Program Files\Google\Chrome\Application\chrome.exe` |
| Windows | Firefox | `C:\Program Files\Mozilla Firefox\firefox.exe` |

### Schritt 4: URL-Freigabe-Schalter konfigurieren

**Warum**
Die URL-Freigabefunktion ist standardmäßig aktiviert, aber aus Sicherheitsgründen (z.B. in Unternehmensumgebungen) möchten Sie diese Funktion möglicherweise deaktivieren.

**Standardverhalten**:
- Ohne `PLANNOTATOR_SHARE`: URL-Freigabe aktiviert
- Gesetzt auf `disabled`: URL-Freigabe deaktiviert

**Vorgehensweise**

::: code-group

```bash [macOS/Linux/WSL (Bash)]
# URL-Freigabe deaktivieren
export PLANNOTATOR_SHARE="disabled"
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_SHARE="disabled"
```

```cmd [Windows CMD]
set PLANNOTATOR_SHARE=disabled
```

:::

**Was Sie sehen sollten**: Nach Klick auf Export-Button verschwindet oder ist die "Share as URL"-Option nicht verfügbar.

**Checkpoint ✅**: URL-Freigabe-Deaktivierung überprüfen

1. Claude Code oder OpenCode neu starten
2. Beliebiges Plan-Review öffnen
3. Auf "Export"-Button oben rechts klicken
4. Optionsliste beobachten

**Aktivierter Zustand** (Standard):
- ✅ Zeigt "Share" und "Raw Diff" Tabs
- ✅ "Share"-Tab zeigt teilbare URL und Kopier-Button

**Deaktivierter Zustand** (`PLANNOTATOR_SHARE="disabled"`):
- ✅ Zeigt direkt "Raw Diff"-Inhalt
- ✅ Zeigt "Copy" und "Download .diff" Buttons
- ❌ Kein "Share"-Tab und keine URL-Freigabefunktion

### Schritt 5: Alle Umgebungsvariablen überprüfen

**Warum**
Sicherstellen, dass alle Umgebungsvariablen korrekt gesetzt sind und wie erwartet funktionieren.

**Überprüfungsmethode**

```bash
# macOS/Linux/WSL
echo "PLANNOTATOR_REMOTE=$PLANNOTATOR_REMOTE"
echo "PLANNOTATOR_PORT=$PLANNOTATOR_PORT"
echo "PLANNOTATOR_BROWSER=$PLANNOTATOR_BROWSER"
echo "PLANNOTATOR_SHARE=$PLANNOTATOR_SHARE"
```

```powershell
# Windows PowerShell
Write-Host "PLANNOTATOR_REMOTE=$env:PLANNOTATOR_REMOTE"
Write-Host "PLANNOTATOR_PORT=$env:PLANNOTATOR_PORT"
Write-Host "PLANNOTATOR_BROWSER=$env:PLANNOTATOR_BROWSER"
Write-Host "PLANNOTATOR_SHARE=$env:PLANNOTATOR_SHARE"
```

**Was Sie sehen sollten**: Alle gesetzten Umgebungsvariablen und ihre Werte.

**Erwartete Ausgabe** (Remote-Umgebungskonfiguration):
```bash
PLANNOTATOR_REMOTE=1
PLANNOTATOR_PORT=19432
PLANNOTATOR_BROWSER=
PLANNOTATOR_SHARE=
```

**Erwartete Ausgabe** (Lokale Umgebungskonfiguration):
```bash
PLANNOTATOR_REMOTE=
PLANNOTATOR_PORT=
PLANNOTATOR_BROWSER=Google Chrome
PLANNOTATOR_SHARE=disabled
```

## Häufige Stolperfallen

### Falle 1: Umgebungsvariable nicht wirksam

**Symptom**: Nach Setzen der Umgebungsvariable ändert sich das Plannotator-Verhalten nicht.

**Ursache**: Umgebungsvariablen werden nur in neuen Terminal-Sitzungen wirksam oder erfordern einen Anwendungsneustart.

**Lösung**:
- Bestätigen Sie, dass die Umgebungsvariable dauerhaft in die Konfigurationsdatei geschrieben wurde (z.B. `~/.bashrc`)
- Terminal neu starten oder `source ~/.bashrc` ausführen
- Claude Code oder OpenCode neu starten

### Falle 2: Port bereits belegt

**Symptom**: Nach Setzen von `PLANNOTATOR_PORT` schlägt der Start fehl.

**Ursache**: Der angegebene Port wird bereits von einem anderen Prozess verwendet.

**Lösung**:
```bash
# Port-Belegung prüfen (macOS/Linux)
lsof -i :19432

# Port wechseln
export PLANNOTATOR_PORT=19433
```

### Falle 3: Falscher Browser-Pfad

**Symptom**: Nach Setzen von `PLANNOTATOR_BROWSER` öffnet sich der Browser nicht.

**Ursache**: Pfad ist falsch oder Datei existiert nicht.

**Lösung**:
- macOS: Anwendungsname statt vollständigem Pfad verwenden (z.B. `Google Chrome`)
- Linux/Windows: `which` oder `where` Befehl verwenden, um Pfad zur ausführbaren Datei zu bestätigen
  ```bash
  which firefox  # Linux
  where chrome   # Windows
  ```

### Falle 4: Browser öffnet sich unerwartet im Remote-Modus

**Symptom**: Nach Setzen von `PLANNOTATOR_REMOTE=1` öffnet sich der Browser immer noch auf dem Remote-Server.

**Ursache**: Der Wert von `PLANNOTATOR_REMOTE` ist nicht `"1"` oder `"true"`.

**Lösung**:
```bash
# Korrekte Werte
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_REMOTE=true

# Falsche Werte (werden nicht wirksam)
export PLANNOTATOR_REMOTE=yes
export PLANNOTATOR_REMOTE=enabled
```

### Falle 5: URL-Freigabe-Option wird nach Deaktivierung weiterhin angezeigt

**Symptom**: Nach Setzen von `PLANNOTATOR_SHARE=disabled` ist "Share as URL" immer noch sichtbar.

**Ursache**: Anwendungsneustart erforderlich, damit die Änderung wirksam wird.

**Lösung**: Claude Code oder OpenCode neu starten.

## Zusammenfassung

In diesem Tutorial haben Sie die 4 Kern-Umgebungsvariablen von Plannotator kennengelernt:

| Umgebungsvariable | Zweck | Standardwert | Anwendungsfall |
| --- | --- | --- | --- |
| `PLANNOTATOR_REMOTE` | Remote-Modus-Schalter | Nicht gesetzt (lokaler Modus) | SSH, Devcontainer, WSL |
| `PLANNOTATOR_PORT` | Fester Port | Remote-Modus 19432, lokaler Modus zufällig | Port-Forwarding oder Vermeidung von Port-Konflikten |
| `PLANNOTATOR_BROWSER` | Benutzerdefinierter Browser | System-Standard-Browser | Verwendung eines bestimmten Browsers |
| `PLANNOTATOR_SHARE` | URL-Freigabe-Schalter | Nicht gesetzt (aktiviert) | Deaktivierung der Freigabefunktion erforderlich |

**Kernpunkte**:
- Remote-Modus verwendet automatisch festen Port und deaktiviert automatisches Browser-Öffnen
- Explizit gesetzte Umgebungsvariablen haben höhere Priorität als Standardverhalten
- Änderungen an Umgebungsvariablen erfordern Anwendungsneustart
- Unternehmensumgebungen erfordern möglicherweise Deaktivierung der URL-Freigabe

## Vorschau auf das nächste Tutorial

> Im nächsten Tutorial lernen Sie **[Häufige Probleme beheben](../../faq/common-problems/)**.
>
> Sie werden lernen:
> - Wie man Port-Belegungsprobleme löst
> - Umgang mit nicht öffnendem Browser
> - Behebung von Fehlern bei nicht angezeigten Plänen
> - Debugging-Techniken und Log-Anzeige

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-24

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Remote-Modus-Erkennung | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts) | 16-29 |
| Port-Abruf-Logik | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts) | 34-49 |
| Browser-Öffnen-Logik | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts) | 45-74 |
| URL-Freigabe-Schalter (Hook) | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts) | 44 |
| URL-Freigabe-Schalter (OpenCode) | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 37-51 |

**Wichtige Konstanten**:
- `DEFAULT_REMOTE_PORT = 19432`: Remote-Modus Standard-Port

**Wichtige Funktionen**:
- `isRemoteSession()`: Erkennt, ob in Remote-Umgebung ausgeführt wird (SSH, Devcontainer, WSL)
- `getServerPort()`: Ruft Server-Port ab (Priorität: Umgebungsvariable, dann Remote-Modus Standard, dann zufällig)
- `openBrowser(url)`: Öffnet URL im angegebenen Browser oder System-Standard-Browser

</details>
