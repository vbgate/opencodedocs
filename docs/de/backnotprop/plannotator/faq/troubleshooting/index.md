---
title: "Fehlerbehebung: Häufige Probleme lösen | Plannotator"
sidebarTitle: "Schnelle Problemlösung"
subtitle: "Fehlerbehebung: Häufige Probleme lösen"
description: "Lernen Sie Methoden zur Fehlerbehebung in Plannotator, einschließlich Log-Analyse, Port-Konflikte, Hook-Event-Debugging, Browser-Probleme, Git-Repository-Status und Integrationsfehler."
tags:
  - "Fehlerbehebung"
  - "Debugging"
  - "Häufige Fehler"
  - "Log-Analyse"
prerequisite:
  - "start-getting-started"
order: 2
---

# Plannotator Fehlerbehebung

## Was Sie nach diesem Tutorial können

Bei Problemen werden Sie in der Lage sein:

- Die Problemursache schnell zu lokalisieren (Port-Konflikte, Hook-Event-Parsing, Git-Konfiguration usw.)
- Fehler durch Log-Ausgaben zu diagnostizieren
- Die richtige Lösung für verschiedene Fehlertypen anzuwenden
- Verbindungsprobleme im Remote-/Devcontainer-Modus zu debuggen

## Ihre aktuelle Situation

Plannotator funktioniert plötzlich nicht mehr, der Browser öffnet sich nicht, oder der Hook gibt Fehlermeldungen aus. Sie wissen nicht, wie Sie die Logs einsehen können, und sind unsicher, welcher Teil das Problem verursacht. Vielleicht haben Sie bereits einen Neustart versucht, aber das Problem besteht weiterhin.

## Wann Sie diese Anleitung brauchen

Fehlerbehebung ist in folgenden Situationen erforderlich:

- Der Browser öffnet sich nicht automatisch
- Der Hook gibt Fehlermeldungen aus
- Port-Konflikte verhindern den Start
- Plan- oder Code-Review-Seiten werden fehlerhaft angezeigt
- Obsidian/Bear-Integration schlägt fehl
- Git diff zeigt nichts an

---

## Kernkonzept

Probleme mit Plannotator lassen sich in drei Kategorien einteilen:

1. **Umgebungsprobleme**: Port-Konflikte, fehlerhafte Umgebungsvariablen, Browser-Pfadprobleme
2. **Datenprobleme**: Hook-Event-Parsing fehlgeschlagen, leerer Plan-Inhalt, abnormaler Git-Repository-Status
3. **Integrationsprobleme**: Obsidian/Bear-Speicherung fehlgeschlagen, Verbindungsprobleme im Remote-Modus

Der Kern des Debuggings ist die **Analyse der Log-Ausgaben**. Plannotator verwendet `console.error` für Fehlerausgaben nach stderr und `console.log` für normale Informationen nach stdout. Die Unterscheidung dieser beiden hilft Ihnen, den Problemtyp schnell zu identifizieren.

---

## 🎒 Voraussetzungen

- ✅ Plannotator ist installiert (Claude Code oder OpenCode Plugin)
- ✅ Grundlegende Kommandozeilen-Kenntnisse
- ✅ Vertrautheit mit Ihrem Projektverzeichnis und Git-Repository-Status

---

## Schritt-für-Schritt-Anleitung

### Schritt 1: Log-Ausgaben prüfen

**Warum**

Alle Fehler von Plannotator werden nach stderr ausgegeben. Die Log-Analyse ist der erste Schritt zur Problemdiagnose.

**Vorgehensweise**

#### In Claude Code

Wenn der Hook Plannotator auslöst, werden Fehlermeldungen in der Terminal-Ausgabe von Claude Code angezeigt:

```bash
# Beispiel einer möglichen Fehlermeldung
Error: Port 54321 in use after 5 retries (set PLANNOTATOR_PORT to use different port)
```

#### In OpenCode

OpenCode erfasst stderr der CLI und zeigt es in der Oberfläche an:

```
[stderr] Failed to parse hook event from stdin
[stderr] No plan content in hook event
```

**Erwartetes Ergebnis**:

- Wenn keine Fehler vorliegen, sollte stderr leer sein oder nur erwartete Hinweise enthalten
- Bei Fehlern enthält die Ausgabe den Fehlertyp (z.B. EADDRINUSE), die Fehlermeldung und ggf. Stack-Trace-Informationen

---

### Schritt 2: Port-Konflikte beheben

**Warum**

Plannotator startet standardmäßig einen Server auf einem zufälligen Port. Wenn ein fester Port belegt ist, versucht der Server 5 Mal (mit jeweils 500ms Verzögerung) erneut zu starten und gibt dann einen Fehler aus.

**Fehlermeldung**:

```
Error: Port 54321 in use after 5 retries (set PLANNOTATOR_PORT to use different port)
```

**Lösungen**

#### Option A: Plannotator automatisch einen Port wählen lassen (Empfohlen)

Setzen Sie die Umgebungsvariable `PLANNOTATOR_PORT` nicht, dann wählt Plannotator automatisch einen verfügbaren Port.

#### Option B: Festen Port verwenden und Konflikt lösen

Wenn Sie einen festen Port verwenden müssen (z.B. im Remote-Modus), müssen Sie den Port-Konflikt lösen:

```bash
# macOS/Linux
lsof -ti:54321 | xargs kill -9

# Windows PowerShell
Get-NetTCPConnection -LocalPort 54321 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

Dann setzen Sie einen neuen Port:

```bash
# macOS/Linux/WSL
export PLANNOTATOR_PORT=54322

# Windows PowerShell
$env:PLANNOTATOR_PORT = "54322"
```

**Checkpoint ✅**:

- Lösen Sie Plannotator erneut aus, der Browser sollte sich normal öffnen
- Falls weiterhin Fehler auftreten, versuchen Sie eine andere Portnummer

---

### Schritt 3: Hook-Event-Parsing-Fehler debuggen

**Warum**

Das Hook-Event sind JSON-Daten, die von stdin gelesen werden. Wenn das Parsing fehlschlägt, kann Plannotator nicht fortfahren.

**Fehlermeldung**:

```
Failed to parse hook event from stdin
No plan content in hook event
```

**Mögliche Ursachen**:

1. Das Hook-Event ist kein gültiges JSON
2. Das Hook-Event enthält kein `tool_input.plan`-Feld
3. Inkompatible Hook-Version

**Debugging-Methode**

#### Hook-Event-Inhalt anzeigen

Geben Sie vor dem Start des Hook-Servers den stdin-Inhalt aus:

```bash
# Temporär hook/server/index.ts ändern
# Nach Zeile 91 hinzufügen:
console.error("[DEBUG] Hook event:", eventJson);
```

**Erwartete Ausgabe**:

```json
{
  "tool_input": {
    "plan": "# Implementation Plan\n\n## Task 1\n..."
  },
  "permission_mode": "default"
}
```

**Lösungen**:

- Wenn `tool_input.plan` leer ist oder fehlt, prüfen Sie, ob der AI-Agent den Plan korrekt generiert hat
- Bei JSON-Formatfehlern überprüfen Sie die Hook-Konfiguration
- Bei inkompatibler Hook-Version aktualisieren Sie Plannotator auf die neueste Version

---

### Schritt 4: Browser öffnet sich nicht

**Warum**

Plannotator verwendet die Funktion `openBrowser`, um den Browser automatisch zu öffnen. Bei Fehlern kann es sich um plattformübergreifende Kompatibilitätsprobleme oder ungültige Browser-Pfade handeln.

**Mögliche Ursachen**:

1. Kein Standard-Browser festgelegt
2. Ungültiger benutzerdefinierter Browser-Pfad
3. Spezielle Behandlung in WSL-Umgebungen
4. Im Remote-Modus öffnet sich der Browser nicht automatisch (das ist normal)

**Debugging-Methode**

#### Prüfen, ob Remote-Modus aktiv ist

```bash
# Umgebungsvariable prüfen
echo $PLANNOTATOR_REMOTE

# Windows PowerShell
echo $env:PLANNOTATOR_REMOTE
```

Wenn die Ausgabe `1` oder `true` ist, befinden Sie sich im Remote-Modus, und der Browser öffnet sich nicht automatisch – das ist das erwartete Verhalten.

#### Browser manuell testen

```bash
# macOS
open "http://localhost:54321"

# Linux
xdg-open "http://localhost:54321"

# Windows
start http://localhost:54321
```

**Erwartetes Ergebnis**:

- Wenn das manuelle Öffnen funktioniert, läuft der Plannotator-Server normal, das Problem liegt in der Auto-Open-Logik
- Wenn das manuelle Öffnen fehlschlägt, überprüfen Sie die URL (der Port könnte anders sein)

**Lösungen**:

#### Option A: Benutzerdefinierten Browser festlegen (macOS)

```bash
export PLANNOTATOR_BROWSER="Google Chrome"

# Oder mit vollständigem Pfad
export PLANNOTATOR_BROWSER="/Applications/Google Chrome.app"
```

#### Option B: Benutzerdefinierten Browser festlegen (Linux)

```bash
export PLANNOTATOR_BROWSER="/usr/bin/firefox"
```

#### Option C: Manuelles Öffnen im Remote-Modus (Devcontainer/SSH)

```bash
# Plannotator gibt URL und Port-Informationen aus
# Kopieren Sie die URL und öffnen Sie sie im lokalen Browser
# Oder verwenden Sie Port-Forwarding:
ssh -L 19432:localhost:19432 user@remote
```

---

### Schritt 5: Git-Repository-Status prüfen (Code-Review)

**Warum**

Die Code-Review-Funktion basiert auf Git-Befehlen. Wenn der Git-Repository-Status abnormal ist (z.B. keine Commits, Detached HEAD), wird das Diff leer oder fehlerhaft angezeigt.

**Fehlermeldung**:

```
Git diff error for uncommitted: Error: Command failed: git diff HEAD
```

**Debugging-Methode**

#### Git-Repository prüfen

```bash
# Prüfen, ob Sie sich in einem Git-Repository befinden
git status

# Aktuellen Branch prüfen
git branch

# Prüfen, ob Commits vorhanden sind
git log --oneline -1
```

**Erwartete Ausgabe**:

- Bei `fatal: not a git repository` befinden Sie sich nicht in einem Git-Repository
- Bei `HEAD detached at <commit>` befinden Sie sich im Detached-HEAD-Zustand
- Bei `fatal: your current branch 'main' has no commits yet` gibt es noch keine Commits

**Lösungen**:

#### Problem A: Nicht in einem Git-Repository

```bash
# Git-Repository initialisieren
git init
git add .
git commit -m "Initial commit"
```

#### Problem B: Detached-HEAD-Zustand

```bash
# Zu einem Branch wechseln
git checkout main
# Oder neuen Branch erstellen
git checkout -b feature-branch
```

#### Problem C: Keine Commits vorhanden

```bash
# Mindestens ein Commit ist erforderlich, um Diffs anzuzeigen
git add .
git commit -m "Initial commit"
```

#### Problem D: Leeres Diff (keine Änderungen)

```bash
# Einige Änderungen erstellen
echo "test" >> test.txt
git add test.txt

# /plannotator-review erneut ausführen
```

**Checkpoint ✅**:

- Führen Sie `/plannotator-review` erneut aus, das Diff sollte normal angezeigt werden
- Falls weiterhin leer, prüfen Sie, ob es nicht gestagete oder nicht committete Änderungen gibt

---

### Schritt 6: Obsidian/Bear-Integrationsfehler debuggen

**Warum**

Fehler bei der Obsidian/Bear-Integration verhindern nicht die Plan-Genehmigung, führen aber zu Speicherfehlern. Fehler werden nach stderr ausgegeben.

**Fehlermeldung**:

```
[Obsidian] Save failed: Vault not found
[Bear] Save failed: Failed to open Bear
```

**Debugging-Methode**

#### Obsidian-Konfiguration prüfen

**macOS**:
```bash
cat ~/Library/Application\ Support/obsidian/obsidian.json
```

**Windows**:
```powershell
cat $env:APPDATA\obsidian\obsidian.json
```

**Erwartete Ausgabe**:

```json
{
  "vaults": {
    "/path/to/vault": {
      "path": "/path/to/vault",
      "ts": 1234567890
    }
  }
}
```

#### Bear-Verfügbarkeit prüfen (macOS)

```bash
# Bear URL-Schema testen
open "bear://x-callback-url/create?title=Test&text=Hello"
```

**Erwartetes Ergebnis**:

- Bear öffnet sich und erstellt eine neue Notiz
- Wenn nichts passiert, ist Bear nicht korrekt installiert

**Lösungen**:

#### Obsidian-Speicherung fehlgeschlagen

- Stellen Sie sicher, dass Obsidian läuft
- Überprüfen Sie, ob der Vault-Pfad korrekt ist
- Versuchen Sie, manuell eine Notiz in Obsidian zu erstellen, um die Berechtigungen zu überprüfen

#### Bear-Speicherung fehlgeschlagen

- Stellen Sie sicher, dass Bear korrekt installiert ist
- Testen Sie, ob `bear://x-callback-url` verfügbar ist
- Überprüfen Sie in den Bear-Einstellungen, ob x-callback-url aktiviert ist

---

### Schritt 7: Detaillierte Fehler-Logs anzeigen (Debug-Modus)

**Warum**

Manchmal sind Fehlermeldungen nicht detailliert genug, und Sie benötigen den vollständigen Stack-Trace und Kontext.

**Vorgehensweise**

#### Bun-Debug-Modus aktivieren

```bash
export DEBUG="*"
plannotator review

# Windows PowerShell
$env:DEBUG = "*"
plannotator review
```

#### Plannotator-Server-Logs anzeigen

Interne Server-Fehler werden über `console.error` ausgegeben. Wichtige Log-Stellen:

- `packages/server/index.ts:260` - Integrations-Fehler-Logs
- `packages/server/git.ts:141` - Git-Diff-Fehler-Logs
- `apps/hook/server/index.ts:100-106` - Hook-Event-Parsing-Fehler

**Erwartete Ausgabe**:

```bash
# Erfolgreich in Obsidian gespeichert
[Obsidian] Saved plan to: /path/to/vault/Plan - 2026-01-24.md

# Speicherung fehlgeschlagen
[Obsidian] Save failed: Cannot write to directory
[Bear] Save failed: Failed to open Bear

# Git-Diff-Fehler
Git diff error for uncommitted: Error: Command failed: git diff HEAD
```

**Checkpoint ✅**:

- Die Fehler-Logs enthalten genügend Informationen zur Problemlokalisierung
- Wenden Sie die entsprechende Lösung basierend auf dem Fehlertyp an

---

## Häufige Fallstricke

### ❌ stderr-Ausgabe ignorieren

**Falsch**:

```bash
# Nur stdout beachten, stderr ignorieren
plannotator review 2>/dev/null
```

**Richtig**:

```bash
# Sowohl stdout als auch stderr anzeigen
plannotator review
# Oder Logs trennen
plannotator review 2>error.log
```

### ❌ Blindes Neustarten des Servers

**Falsch**:

- Bei Problemen einfach neustarten, ohne die Fehlerursache zu prüfen

**Richtig**:

- Zuerst die Fehler-Logs prüfen und den Problemtyp bestimmen
- Die entsprechende Lösung basierend auf dem Fehlertyp anwenden
- Neustart nur als letztes Mittel

### ❌ Im Remote-Modus automatisches Browser-Öffnen erwarten

**Falsch**:

```bash
export PLANNOTATOR_REMOTE=1
plannotator review
# Erwarten, dass sich der Browser automatisch öffnet (passiert nicht)
```

**Richtig**:

```bash
export PLANNOTATOR_REMOTE=1
plannotator review
# Die ausgegebene URL notieren und manuell im Browser öffnen
# Oder Port-Forwarding verwenden
```

---

## Zusammenfassung

- Plannotator verwendet `console.error` für Fehlerausgaben nach stderr und `console.log` für normale Informationen nach stdout
- Häufige Probleme sind: Port-Konflikte, Hook-Event-Parsing-Fehler, Browser öffnet sich nicht, abnormaler Git-Repository-Status, Integrationsfehler
- Der Kern des Debuggings: Logs prüfen → Problemtyp identifizieren → Entsprechende Lösung anwenden
- Im Remote-Modus öffnet sich der Browser nicht automatisch; Sie müssen die URL manuell öffnen oder Port-Forwarding konfigurieren

---

## Vorschau auf das nächste Tutorial

> Im nächsten Tutorial lernen wir **[Häufige Probleme](../common-problems/)**.
>
> Sie werden lernen:
> - Wie Sie Installations- und Konfigurationsprobleme lösen
> - Häufige Nutzungsfehler und Hinweise
> - Tipps zur Performance-Optimierung

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Stellen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-24

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Port-Retry-Mechanismus | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L79-L80) | 79-80 |
| EADDRINUSE-Fehlerbehandlung | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L320-L334) | 320-334 |
| Hook-Event-Parsing | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L91-L107) | 91-107 |
| Browser öffnen | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts#L45-L74) | 45-74 |
| Git-Diff-Fehlerbehandlung | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L139-L144) | 139-144 |
| Obsidian-Speicher-Logs | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L242-L246) | 242-246 |
| Bear-Speicher-Logs | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L252-L256) | 252-256 |

**Wichtige Konstanten**:
- `MAX_RETRIES = 5`: Maximale Anzahl der Port-Wiederholungsversuche
- `RETRY_DELAY_MS = 500`: Verzögerung zwischen Wiederholungsversuchen (Millisekunden)

**Wichtige Funktionen**:
- `startPlannotatorServer()`: Startet den Plan-Review-Server
- `startReviewServer()`: Startet den Code-Review-Server
- `openBrowser()`: Plattformübergreifendes Browser-Öffnen
- `runGitDiff()`: Führt Git-Diff-Befehl aus
- `saveToObsidian()`: Speichert Plan in Obsidian
- `saveToBear()`: Speichert Plan in Bear

</details>
