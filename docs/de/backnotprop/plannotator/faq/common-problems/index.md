---
title: "Häufige Probleme: Fehlerbehebungsanleitung | Plannotator"
sidebarTitle: "Was tun bei Problemen"
subtitle: "Häufige Probleme: Fehlerbehebungsanleitung"
description: "Lernen Sie die Fehlerbehebung und Problemlösung bei Plannotator. Schnelle Lösungen für Port-Konflikte, Browser-Probleme, Git-Fehler, Bild-Upload und Integrationsprobleme."
tags:
  - "Häufige Probleme"
  - "Fehlerbehebung"
  - "Port-Konflikt"
  - "Browser"
  - "Git"
  - "Remote-Umgebung"
  - "Integrationsprobleme"
prerequisite:
  - "start-getting-started"
  - "start-installation-claude-code"
  - "start-installation-opencode"
order: 1
---

# Häufige Probleme

## Was Sie lernen werden

- ✅ Port-Konflikte schnell diagnostizieren und beheben
- ✅ Verstehen, warum der Browser nicht automatisch öffnet, und wissen, wie Sie darauf zugreifen
- ✅ Probleme beheben, wenn Plan oder Code-Review nicht angezeigt wird
- ✅ Git-Befehlsfehler behandeln
- ✅ Fehler beim Bild-Upload lösen
- ✅ Ursachen für fehlgeschlagene Obsidian/Bear-Integration finden
- ✅ Plannotator in Remote-Umgebungen korrekt aufrufen

## Ihre aktuelle Situation

Bei der Verwendung von Plannotator können folgende Probleme auftreten:

- **Problem 1**: Beim Start wird gemeldet, dass der Port belegt ist und der Server nicht starten kann
- **Problem 2**: Der Browser öffnet sich nicht automatisch, und Sie wissen nicht, wie Sie auf die Review-Oberfläche zugreifen
- **Problem 3**: Die Plan- oder Code-Review-Seite zeigt eine leere Seite, der Inhalt wird nicht geladen
- **Problem 4**: Bei der Ausführung von `/plannotator-review` wird ein Git-Fehler gemeldet
- **Problem 5**: Bild-Upload schlägt fehl oder Bilder werden nicht angezeigt
- **Problem 6**: Obsidian/Bear-Integration ist konfiguriert, aber Pläne werden nicht automatisch gespeichert
- **Problem 7**: In Remote-Umgebungen kann nicht auf den lokalen Server zugegriffen werden

Diese Probleme unterbrechen Ihren Workflow und beeinträchtigen die Benutzererfahrung.

## Kernkonzept

::: info Fehlerbehandlungsmechanismus

Der Plannotator-Server implementiert einen **automatischen Wiederholungsmechanismus**:

- **Maximale Wiederholungen**: 5 Mal
- **Wiederholungsverzögerung**: 500 Millisekunden
- **Anwendungsfall**: Port-Konflikt (EADDRINUSE-Fehler)

Bei Port-Konflikten versucht das System automatisch andere Ports. Erst nach 5 fehlgeschlagenen Versuchen wird ein Fehler gemeldet.

:::

Die Fehlerbehandlung von Plannotator folgt diesen Prinzipien:

1. **Lokal zuerst**: Alle Fehlermeldungen werden im Terminal oder in der Konsole ausgegeben
2. **Graceful Degradation**: Integrationsfehler (z.B. Obsidian-Speicherfehler) blockieren nicht den Hauptprozess
3. **Klare Hinweise**: Konkrete Fehlermeldungen und Lösungsvorschläge werden bereitgestellt

## Häufige Probleme und Lösungen

### Problem 1: Port-Konflikt

**Fehlermeldung**:

```
Port 19432 in use after 5 retries
```

**Ursachenanalyse**:

- Der Port wird bereits von einem anderen Prozess verwendet
- Im Remote-Modus ist ein fester Port konfiguriert, aber es gibt einen Konflikt
- Der vorherige Plannotator-Prozess wurde nicht ordnungsgemäß beendet

**Lösungen**:

#### Methode 1: Auf automatische Wiederholung warten (nur lokaler Modus)

Im lokalen Modus versucht Plannotator automatisch zufällige Ports. Wenn Sie einen Port-Konflikt-Fehler sehen, bedeutet das normalerweise:

- Alle 5 zufälligen Ports sind belegt (sehr selten)
- Ein fester Port (`PLANNOTATOR_PORT`) ist konfiguriert, aber es gibt einen Konflikt

**Sie sollten sehen**: Terminal zeigt "Port X in use after 5 retries"

#### Methode 2: Festen Port verwenden (Remote-Modus)

In Remote-Umgebungen müssen Sie `PLANNOTATOR_PORT` konfigurieren:

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

::: tip Port-Auswahl-Empfehlungen

- Wählen Sie Ports im Bereich 1024-49151 (Benutzer-Ports)
- Vermeiden Sie häufig verwendete Service-Ports (80, 443, 3000, 5000 usw.)
- Stellen Sie sicher, dass der Port nicht von der Firewall blockiert wird

:::

#### Methode 3: Prozess beenden, der den Port belegt

```bash
# Prozess finden, der den Port belegt (ersetzen Sie 19432 durch Ihren Port)
lsof -i :19432  # macOS/Linux
netstat -ano | findstr :19432  # Windows

# Prozess beenden (ersetzen Sie PID durch die tatsächliche Prozess-ID)
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

::: warning Hinweis

Bevor Sie einen Prozess beenden, stellen Sie sicher, dass es sich nicht um eine andere wichtige Anwendung handelt. Plannotator schließt den Server automatisch nach Erhalt einer Entscheidung, daher ist ein manuelles Beenden normalerweise nicht erforderlich.

:::

---

### Problem 2: Browser öffnet sich nicht automatisch

**Symptom**: Das Terminal zeigt an, dass der Server gestartet wurde, aber der Browser öffnet sich nicht.

**Ursachenanalyse**:

| Szenario | Ursache |
| --- | --- |
| Remote-Umgebung | Plannotator erkennt den Remote-Modus und überspringt das automatische Öffnen des Browsers |
| `PLANNOTATOR_BROWSER` falsch konfiguriert | Browser-Pfad oder -Name ist falsch |
| Browser nicht installiert | Standard-Browser des Systems existiert nicht |

**Lösungen**:

#### Szenario 1: Remote-Umgebung (SSH, Devcontainer, WSL)

**Prüfen, ob es sich um eine Remote-Umgebung handelt**:

```bash
echo $PLANNOTATOR_REMOTE
# Ausgabe "1" oder "true" bedeutet Remote-Modus
```

**In Remote-Umgebungen**:

1. **Das Terminal zeigt die Zugriffs-URL an**:

```
Plannotator running at: http://localhost:9999
Press Ctrl+C to stop
```

2. **Öffnen Sie den Browser manuell** und rufen Sie die angezeigte URL auf

3. **Konfigurieren Sie Port-Forwarding** (falls erforderlich für lokalen Zugriff)

**Sie sollten sehen**: Terminal-Ausgabe ähnlich wie "Plannotator running at: http://localhost:19432"

#### Szenario 2: Lokaler Modus, aber Browser öffnet sich nicht

**`PLANNOTATOR_BROWSER`-Konfiguration prüfen**:

::: code-group

```bash [macOS/Linux]
echo $PLANNOTATOR_BROWSER
# Sollte Browser-Name oder -Pfad ausgeben
```

```powershell [Windows PowerShell]
echo $env:PLANNOTATOR_BROWSER
```

:::

**Benutzerdefinierte Browser-Konfiguration löschen**:

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

**Korrekten Browser konfigurieren** (falls Anpassung erforderlich):

```bash
# macOS: Anwendungsname verwenden
export PLANNOTATOR_BROWSER="Google Chrome"

# Linux: Pfad zur ausführbaren Datei verwenden
export PLANNOTATOR_BROWSER="/usr/bin/google-chrome"

# Windows: Pfad zur ausführbaren Datei verwenden
set PLANNOTATOR_BROWSER="C:\Program Files\Google\Chrome\Application\chrome.exe"
```

---

### Problem 3: Plan oder Code-Review wird nicht angezeigt

**Symptom**: Der Browser öffnet sich, aber die Seite ist leer oder lädt nicht.

**Mögliche Ursachen**:

| Ursache | Plan-Review | Code-Review |
| --- | --- | --- |
| Plan-Parameter ist leer | ✅ Häufig | ❌ Nicht zutreffend |
| Git-Repository-Problem | ❌ Nicht zutreffend | ✅ Häufig |
| Kein Diff anzuzeigen | ❌ Nicht zutreffend | ✅ Häufig |
| Server-Start fehlgeschlagen | ✅ Möglich | ✅ Möglich |

**Lösungen**:

#### Fall 1: Plan-Review wird nicht angezeigt

**Terminal-Ausgabe prüfen**:

```bash
# Nach Fehlermeldungen suchen
plannotator start 2>&1 | grep -i error
```

**Häufiger Fehler 1**: Plan-Parameter ist leer

**Fehlermeldung**:

```
400 Bad Request - Missing plan or plan is empty
```

**Ursache**: Claude Code oder OpenCode hat einen leeren Plan-String übergeben.

**Lösung**:

- Bestätigen Sie, dass der AI-Agent gültigen Plan-Inhalt generiert hat
- Überprüfen Sie, ob Hook oder Plugin korrekt konfiguriert sind
- Sehen Sie sich die Claude Code/OpenCode-Logs für weitere Informationen an

**Häufiger Fehler 2**: Server nicht ordnungsgemäß gestartet

**Lösung**:

- Prüfen Sie, ob das Terminal die Meldung "Plannotator running at" anzeigt
- Falls nicht, siehe "Problem 1: Port-Konflikt"
- Überprüfen Sie die [Umgebungsvariablen-Konfiguration](../../advanced/environment-variables/), um die korrekte Konfiguration sicherzustellen

#### Fall 2: Code-Review wird nicht angezeigt

**Terminal-Ausgabe prüfen**:

```bash
/plannotator-review 2>&1 | grep -i error
```

**Häufiger Fehler 1**: Kein Git-Repository

**Fehlermeldung**:

```
fatal: not a git repository
```

**Lösung**:

```bash
# Git-Repository initialisieren
git init

# Dateien hinzufügen und committen (falls es nicht committete Änderungen gibt)
git add .
git commit -m "Initial commit"

# Erneut ausführen
/plannotator-review
```

**Sie sollten sehen**: Browser zeigt den Diff-Viewer an

**Häufiger Fehler 2**: Kein Diff anzuzeigen

**Symptom**: Seite zeigt "No changes" oder ähnliche Meldung.

**Lösung**:

```bash
# Prüfen, ob es nicht committete Änderungen gibt
git status

# Prüfen, ob es staged Änderungen gibt
git diff --staged

# Prüfen, ob es Commits gibt
git log --oneline

# Diff-Typ wechseln, um verschiedene Bereiche anzuzeigen
# In der Code-Review-Oberfläche auf das Dropdown-Menü klicken:
# - Uncommitted changes
# - Staged changes
# - Last commit
# - vs main (falls auf einem Branch)
```

**Sie sollten sehen**: Diff-Viewer zeigt Code-Änderungen oder meldet "No changes"

**Häufiger Fehler 3**: Git-Befehlsausführung fehlgeschlagen

**Fehlermeldung**:

```
Git diff error for uncommitted: [spezifische Fehlermeldung]
```

**Mögliche Ursachen**:

- Git ist nicht installiert
- Git-Version ist zu alt
- Git-Konfigurationsproblem

**Lösung**:

```bash
# Git-Version prüfen
git --version

# Git-Diff-Befehl testen
git diff HEAD

# Wenn Git normal funktioniert, könnte es ein interner Plannotator-Fehler sein
# Vollständige Fehlermeldung ansehen und Bug melden
```

---

### Problem 4: Bild-Upload fehlgeschlagen

**Fehlermeldung**:

```
400 Bad Request - No file provided
500 Internal Server Error - Upload failed
```

**Mögliche Ursachen**:

| Ursache | Lösung |
| --- | --- |
| Keine Datei ausgewählt | Klicken Sie auf die Upload-Schaltfläche und wählen Sie ein Bild |
| Dateiformat nicht unterstützt | Verwenden Sie png/jpeg/webp-Format |
| Datei zu groß | Komprimieren Sie das Bild vor dem Upload |
| Berechtigungsproblem im temporären Verzeichnis | Überprüfen Sie die Berechtigungen des /tmp/plannotator-Verzeichnisses |

**Lösungen**:

#### Hochgeladene Datei überprüfen

**Unterstützte Formate**:

- ✅ PNG (`.png`)
- ✅ JPEG (`.jpg`, `.jpeg`)
- ✅ WebP (`.webp`)

**Nicht unterstützte Formate**:

- ❌ BMP (`.bmp`)
- ❌ GIF (`.gif`)
- ❌ SVG (`.svg`)

**Sie sollten sehen**: Nach erfolgreichem Upload wird das Bild in der Review-Oberfläche angezeigt

#### Berechtigungen des temporären Verzeichnisses prüfen

Plannotator erstellt automatisch das Verzeichnis `/tmp/plannotator`. Wenn der Upload weiterhin fehlschlägt, überprüfen Sie die Berechtigungen des System-Temp-Verzeichnisses.

**Falls manuelle Überprüfung erforderlich**:

```bash
# Verzeichnisberechtigungen prüfen
ls -la /tmp/plannotator

# Windows-Prüfung
dir %TEMP%\plannotator
```

**Sie sollten sehen**: `drwxr-xr-x` (oder ähnliche Berechtigungen) zeigt an, dass das Verzeichnis beschreibbar ist

#### Browser-Entwicklertools verwenden

1. Drücken Sie F12, um die Entwicklertools zu öffnen
2. Wechseln Sie zum Tab "Network"
3. Klicken Sie auf die Upload-Schaltfläche
4. Suchen Sie die `/api/upload`-Anfrage
5. Überprüfen Sie Anfragestatus und Antwort

**Sie sollten sehen**:
- Statuscode: 200 OK (Erfolg)
- Antwort: `{"path": "/tmp/plannotator/xxx.png"}`

---

### Problem 5: Obsidian/Bear-Integration fehlgeschlagen

**Symptom**: Nach Genehmigung des Plans wird kein Plan in der Notiz-App gespeichert.

**Mögliche Ursachen**:

| Ursache | Obsidian | Bear |
| --- | --- | --- |
| Integration nicht aktiviert | ✅ | ✅ |
| Vault/App nicht erkannt | ✅ | N/A |
| Pfadkonfiguration falsch | ✅ | ✅ |
| Dateinamenskonflikt | ✅ | ✅ |
| x-callback-url fehlgeschlagen | N/A | ✅ |

**Lösungen**:

#### Obsidian-Integrationsprobleme

**Schritt 1: Prüfen, ob Integration aktiviert ist**

1. Klicken Sie in der Plannotator-UI auf Einstellungen (Zahnrad-Symbol)
2. Suchen Sie den Abschnitt "Obsidian Integration"
3. Stellen Sie sicher, dass der Schalter aktiviert ist

**Sie sollten sehen**: Schalter ist blau (aktivierter Zustand)

**Schritt 2: Vault-Erkennung prüfen**

**Automatische Erkennung**:

- Plannotator liest automatisch die Obsidian-Konfigurationsdatei
- Speicherort der Konfigurationsdatei:
  - macOS: `~/Library/Application Support/obsidian/obsidian.json`
  - Windows: `%APPDATA%\obsidian\obsidian.json`
  - Linux: `~/.config/obsidian/obsidian.json`

**Manuelle Überprüfung**:

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

**Sie sollten sehen**: JSON-Datei mit `vaults`-Feld

**Schritt 3: Vault-Pfad manuell konfigurieren**

Falls die automatische Erkennung fehlschlägt:

1. In den Plannotator-Einstellungen
2. Klicken Sie auf "Manually enter vault path"
3. Geben Sie den vollständigen Vault-Pfad ein

**Beispielpfade**:

- macOS: `/Users/yourname/Documents/ObsidianVault`
- Windows: `C:\Users\yourname\Documents\ObsidianVault`
- Linux: `/home/yourname/Documents/ObsidianVault`

**Sie sollten sehen**: Dropdown-Menü zeigt den eingegebenen Vault-Namen

**Schritt 4: Terminal-Ausgabe prüfen**

Das Obsidian-Speicherergebnis wird im Terminal ausgegeben:

```bash
[Obsidian] Saved plan to: /path/to/vault/plannotator/Title - Jan 24, 2026 2-30pm.md
```

**Fehlermeldung**:

```
[Obsidian] Save failed: [spezifische Fehlermeldung]
```

**Häufige Fehler**:

- Unzureichende Berechtigungen → Vault-Verzeichnisberechtigungen prüfen
- Nicht genügend Speicherplatz → Speicherplatz freigeben
- Ungültiger Pfad → Pfadschreibweise überprüfen

#### Bear-Integrationsprobleme

**Bear-App prüfen**

- Stellen Sie sicher, dass Bear auf macOS installiert ist
- Stellen Sie sicher, dass die Bear-App läuft

**x-callback-url testen**:

```bash
# Im Terminal testen
open "bear://x-callback-url/create?title=Test&text=Hello"
```

**Sie sollten sehen**: Bear öffnet sich und erstellt eine neue Notiz

**Terminal-Ausgabe prüfen**:

```bash
[Bear] Saved plan to Bear
```

**Fehlermeldung**:

```
[Bear] Save failed: [spezifische Fehlermeldung]
```

**Lösungen**:

- Bear-App neu starten
- Sicherstellen, dass Bear auf dem neuesten Stand ist
- macOS-Berechtigungseinstellungen prüfen (Bear Dateizugriff erlauben)

---

### Problem 6: Zugriffsprobleme in Remote-Umgebungen

**Symptom**: In SSH, Devcontainer oder WSL kann nicht vom lokalen Browser auf den Server zugegriffen werden.

**Kernkonzept**:

::: info Was ist eine Remote-Umgebung

Eine Remote-Umgebung ist eine entfernte Computerumgebung, auf die über SSH, Devcontainer oder WSL zugegriffen wird. In dieser Umgebung müssen Sie **Port-Forwarding** verwenden, um den Remote-Port auf den lokalen Port abzubilden, damit Sie im lokalen Browser auf den Remote-Server zugreifen können.

:::

**Lösungen**:

#### Schritt 1: Remote-Modus konfigurieren

Umgebungsvariablen in der Remote-Umgebung setzen:

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

**Sie sollten sehen**: Terminal gibt aus "Using remote mode with fixed port: 9999"

#### Schritt 2: Port-Forwarding konfigurieren

**Szenario 1: SSH Remote-Server**

`~/.ssh/config` bearbeiten:

```
Host your-server
    HostName server.example.com
    User yourname
    LocalForward 9999 localhost:9999
```

**Mit Server verbinden**:

```bash
ssh your-server
```

**Sie sollten sehen**: Nach Aufbau der SSH-Verbindung wird lokaler Port 9999 auf Remote-Port 9999 weitergeleitet

**Szenario 2: VS Code Devcontainer**

VS Code Devcontainer leitet Ports normalerweise automatisch weiter.

**Überprüfungsmethode**:

1. Öffnen Sie in VS Code den Tab "Ports"
2. Suchen Sie Port 9999
3. Stellen Sie sicher, dass der Port-Status "Forwarded" ist

**Sie sollten sehen**: Ports-Tab zeigt "Local Address: localhost:9999"

**Szenario 3: WSL (Windows Subsystem for Linux)**

WSL verwendet standardmäßig `localhost`-Weiterleitung.

**Zugriffsmethode**:

Im Windows-Browser direkt aufrufen:

```
http://localhost:9999
```

**Sie sollten sehen**: Plannotator-UI wird normal angezeigt

#### Schritt 3: Zugriff verifizieren

1. Plannotator in der Remote-Umgebung starten
2. Im lokalen Browser `http://localhost:9999` aufrufen
3. Bestätigen, dass die Seite normal angezeigt wird

**Sie sollten sehen**: Plan-Review- oder Code-Review-Oberfläche lädt normal

---

### Problem 7: Plan/Anmerkungen werden nicht korrekt gespeichert

**Symptom**: Nach Genehmigung oder Ablehnung des Plans werden Anmerkungen nicht gespeichert oder am falschen Ort gespeichert.

**Mögliche Ursachen**:

| Ursache | Lösung |
| --- | --- |
| Plan-Speicherung deaktiviert | Option "Plan Save" in den Einstellungen prüfen |
| Benutzerdefinierter Pfad ungültig | Überprüfen, ob der Pfad beschreibbar ist |
| Anmerkungsinhalt leer | Dies ist normales Verhalten (wird nur gespeichert, wenn Anmerkungen vorhanden sind) |
| Server-Berechtigungsproblem | Berechtigungen des Speicherverzeichnisses prüfen |

**Lösungen**:

#### Plan-Speichereinstellungen prüfen

1. Klicken Sie in der Plannotator-UI auf Einstellungen (Zahnrad-Symbol)
2. Sehen Sie sich den Abschnitt "Plan Save" an
3. Bestätigen Sie, dass der Schalter aktiviert ist

**Sie sollten sehen**: Schalter "Save plans and annotations" ist blau (aktivierter Zustand)

#### Speicherpfad prüfen

**Standard-Speicherort**:

```bash
~/.plannotator/plans/  # Pläne und Anmerkungen werden in diesem Verzeichnis gespeichert
```

**Benutzerdefinierter Pfad**:

In den Einstellungen kann ein benutzerdefinierter Speicherpfad konfiguriert werden.

**Überprüfen, ob Pfad beschreibbar ist**:

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

**Sie sollten sehen**: Befehle werden erfolgreich ausgeführt, keine Berechtigungsfehler

#### Terminal-Ausgabe prüfen

Speicherergebnisse werden im Terminal ausgegeben:

```bash
[Plan] Saved annotations to: ~/.plannotator/annotations/slug.json
[Plan] Saved snapshot to: ~/.plannotator/plans/slug-approved.md
```

**Sie sollten sehen**: Ähnliche Erfolgsmeldungen

---

## Zusammenfassung

In dieser Lektion haben Sie gelernt:

- **Port-Konflikte diagnostizieren**: Festen Port verwenden oder belegenden Prozess beenden
- **Browser öffnet sich nicht behandeln**: Remote-Modus erkennen, manuell zugreifen oder Browser konfigurieren
- **Inhalt wird nicht angezeigt beheben**: Plan-Parameter, Git-Repository, Diff-Status prüfen
- **Bild-Upload-Fehler lösen**: Dateiformat, Verzeichnisberechtigungen, Entwicklertools prüfen
- **Integrationsfehler beheben**: Konfiguration, Pfade, Berechtigungen und Terminal-Ausgabe prüfen
- **Remote-Zugriff konfigurieren**: PLANNOTATOR_REMOTE und Port-Forwarding verwenden
- **Pläne und Anmerkungen speichern**: Plan-Speicherung aktivieren und Pfadberechtigungen überprüfen

**Merken Sie sich**:

1. Die Terminal-Ausgabe ist die beste Quelle für Debug-Informationen
2. Remote-Umgebungen erfordern Port-Forwarding
3. Integrationsfehler blockieren nicht den Hauptprozess
4. Verwenden Sie Entwicklertools, um Netzwerkanfrage-Details anzuzeigen

## Nächste Schritte

Wenn Ihr Problem in dieser Lektion nicht behandelt wurde, können Sie nachschlagen:

- [Fehlerbehebung](../troubleshooting/) - Vertiefte Debugging-Techniken und Log-Analysemethoden
- [API-Referenz](../../appendix/api-reference/) - Alle API-Endpunkte und Fehlercodes verstehen
- [Datenmodelle](../../appendix/data-models/) - Plannotator-Datenstrukturen verstehen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um Quellcode-Speicherorte anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-24

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Server-Start und Wiederholungslogik | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L79-L335) | 79-335 |
| Port-Konflikt-Fehlerbehandlung (Plan-Review) | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L319-L334) | 319-334 |
| Port-Konflikt-Fehlerbehandlung (Code-Review) | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L252-L267) | 252-267 |
| Remote-Modus-Erkennung | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts) | Vollständig |
| Browser-Öffnungslogik | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts) | Vollständig |
| Git-Befehlsausführung und Fehlerbehandlung | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L36-L147) | 36-147 |
| Bild-Upload-Verarbeitung (Plan-Review) | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L153-L174) | 153-174 |
| Bild-Upload-Verarbeitung (Code-Review) | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L181-L201) | 181-201 |
| Obsidian-Integration | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts) | Vollständig |
| Plan-Speicherung | [`packages/server/storage.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/storage.ts) | Vollständig |

**Wichtige Konstanten**:

| Konstante | Wert | Beschreibung |
| --- | --- | --- |
| `MAX_RETRIES` | 5 | Maximale Wiederholungsversuche beim Server-Start |
| `RETRY_DELAY_MS` | 500 | Wiederholungsverzögerung (Millisekunden) |

**Wichtige Funktionen**:

- `startPlannotatorServer()` - Plan-Review-Server starten
- `startReviewServer()` - Code-Review-Server starten
- `isRemoteSession()` - Prüfen, ob Remote-Umgebung
- `getServerPort()` - Server-Port abrufen
- `openBrowser()` - Browser öffnen
- `runGitDiff()` - Git-Diff-Befehl ausführen
- `detectObsidianVaults()` - Obsidian-Vaults erkennen
- `saveToObsidian()` - Plan in Obsidian speichern
- `saveToBear()` - Plan in Bear speichern

</details>
