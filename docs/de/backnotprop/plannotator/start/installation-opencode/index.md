---
title: "OpenCode: Plugin-Installation | Plannotator"
sidebarTitle: "Sofort einsatzbereit"
subtitle: "Plannotator-Plugin für OpenCode installieren"
description: "Installieren Sie das Plannotator-Plugin in OpenCode. Konfigurieren Sie opencode.json, führen Sie das Installationsskript aus, richten Sie Umgebungsvariablen für den Remote-Modus ein und verifizieren Sie die Installation."
tags:
  - "Installation"
  - "Konfiguration"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
order: 3
---

# Plannotator-Plugin für OpenCode installieren

## Lernziele

- Plannotator-Plugin in OpenCode installieren
- Das `submit_plan`-Tool und den `/plannotator-review`-Befehl konfigurieren
- Umgebungsvariablen einrichten (Remote-Modus, Port, Browser usw.)
- Die Plugin-Installation verifizieren

## Das Problem

Bei der Arbeit mit AI Agents in OpenCode müssen Pläne als reiner Text im Terminal gelesen werden – präzises Feedback ist so kaum möglich. Was fehlt: eine visuelle Oberfläche zum Annotieren von Plänen, Hinzufügen von Kommentaren und automatischen Übermitteln von strukturiertem Feedback an den Agent.

## Anwendungsfall

**Pflichtschritt vor der Nutzung von Plannotator**: Wenn Sie in einer OpenCode-Umgebung entwickeln und eine interaktive Plan-Review-Erfahrung wünschen.

## 🎒 Voraussetzungen

- [ ] [OpenCode](https://opencode.ai/) ist installiert
- [ ] Grundkenntnisse der `opencode.json`-Konfiguration (OpenCode-Plugin-System)

::: warning Erforderliches Vorwissen
Falls Sie mit den Grundlagen von OpenCode noch nicht vertraut sind, empfehlen wir zunächst die [offizielle OpenCode-Dokumentation](https://opencode.ai/docs).
:::

## Kernkonzept

Plannotator bietet zwei Kernfunktionen für OpenCode:

1. **`submit_plan`-Tool** - Wird aufgerufen, wenn der Agent einen Plan fertiggestellt hat, und öffnet den Browser für ein interaktives Review
2. **`/plannotator-review`-Befehl** - Löst manuell ein Git-Diff-Code-Review aus

Die Installation erfolgt in zwei Schritten:
1. Plugin-Konfiguration in `opencode.json` hinzufügen (aktiviert das `submit_plan`-Tool)
2. Installationsskript ausführen (erhält den `/plannotator-review`-Befehl)

## Schritt-für-Schritt-Anleitung

### Schritt 1: Plugin über opencode.json installieren

Suchen Sie Ihre OpenCode-Konfigurationsdatei (normalerweise im Projektstammverzeichnis oder Benutzer-Konfigurationsverzeichnis) und fügen Sie Plannotator zum `plugin`-Array hinzu:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["@plannotator/opencode@latest"]
}
```

**Warum**
`opencode.json` ist die Plugin-Konfigurationsdatei von OpenCode. Nach dem Hinzufügen des Plugin-Namens lädt OpenCode das Plugin automatisch aus dem npm-Repository herunter.

Sie sollten sehen: Beim Start von OpenCode erscheint die Meldung „Loading plugin: @plannotator/opencode...".

---

### Schritt 2: OpenCode neu starten

**Warum**
Nach Änderungen an der Plugin-Konfiguration ist ein Neustart erforderlich, damit die Änderungen wirksam werden.

Sie sollten sehen: OpenCode lädt alle Plugins neu.

---

### Schritt 3: Installationsskript für Slash-Befehle ausführen

::: code-group

```bash [macOS / Linux / WSL]
curl -fsSL https://plannotator.ai/install.sh | bash
```

```powershell [Windows PowerShell]
irm https://plannotator.ai/install.ps1 | iex
```

:::

**Warum**
Dieses Skript führt folgende Aktionen aus:
1. Lädt das `plannotator`-CLI-Tool auf Ihr System herunter
2. Installiert den `/plannotator-review`-Slash-Befehl in OpenCode
3. Bereinigt alle zwischengespeicherten Plugin-Versionen

Sie sollten sehen: Eine Erfolgsmeldung wie „Plannotator installed successfully!"

---

### Schritt 4: Installation überprüfen

Prüfen Sie in OpenCode, ob das Plugin korrekt funktioniert:

**Prüfen, ob das `submit_plan`-Tool verfügbar ist**:
- Fragen Sie den Agent im Chat: „Bitte verwende submit_plan, um den Plan einzureichen"
- Bei korrekter Plugin-Funktion sollte der Agent dieses Tool sehen und aufrufen können

**Prüfen, ob der `/plannotator-review`-Befehl verfügbar ist**:
- Geben Sie `/plannotator-review` in das Eingabefeld ein
- Bei korrekter Plugin-Funktion sollte ein Befehlsvorschlag erscheinen

Sie sollten sehen: Beide Funktionen arbeiten fehlerfrei.

---

### Schritt 5: Umgebungsvariablen konfigurieren (optional)

Plannotator unterstützt folgende Umgebungsvariablen, die Sie nach Bedarf konfigurieren können:

::: details Erklärung der Umgebungsvariablen

| Umgebungsvariable | Zweck | Standardwert | Beispiel |
| --- | --- | --- | --- |
| `PLANNOTATOR_REMOTE` | Remote-Modus aktivieren (devcontainer/SSH) | Nicht gesetzt | `export PLANNOTATOR_REMOTE=1` |
| `PLANNOTATOR_PORT` | Fester Port (erforderlich für Remote-Modus) | Lokal zufällig, Remote 19432 | `export PLANNOTATOR_PORT=9999` |
| `PLANNOTATOR_BROWSER` | Benutzerdefinierter Browser-Pfad | Systemstandard | `export PLANNOTATOR_BROWSER="/Applications/Google Chrome.app"` |
| `PLANNOTATOR_SHARE` | URL-Sharing deaktivieren | Aktiviert | `export PLANNOTATOR_SHARE=disabled` |

:::

**Konfigurationsbeispiel für Remote-Modus** (devcontainer/SSH):

In `.devcontainer/devcontainer.json`:

```json
{
  "containerEnv": {
    "PLANNOTATOR_REMOTE": "1",
    "PLANNOTATOR_PORT": "9999"
  },
  "forwardPorts": [9999]
}
```

**Warum**
- Remote-Modus: Bei Ausführung von OpenCode in einem Container oder auf einem Remote-Rechner wird ein fester Port verwendet und der Browser automatisch geöffnet
- Port-Weiterleitung: Ermöglicht dem Host-Rechner den Zugriff auf Dienste im Container

Sie sollten sehen: Wenn der Agent `submit_plan` aufruft, zeigt die Konsole die Server-URL an (anstatt den Browser automatisch zu öffnen), z.B.:
```
Plannotator server running at http://localhost:9999
```

---

### Schritt 6: OpenCode neu starten (falls Umgebungsvariablen geändert wurden)

Falls Sie in Schritt 5 Umgebungsvariablen konfiguriert haben, müssen Sie OpenCode erneut neu starten, damit die Konfiguration wirksam wird.

---

## Checkliste ✅

Nach Abschluss der Installation überprüfen Sie folgende Punkte:

- [ ] `@plannotator/opencode@latest` wurde zu `opencode.json` hinzugefügt
- [ ] Nach dem Neustart von OpenCode treten keine Plugin-Ladefehler auf
- [ ] Bei Eingabe von `/plannotator-review` erscheint ein Befehlsvorschlag
- [ ] (Optional) Umgebungsvariablen sind korrekt konfiguriert

## Fehlerbehebung

### Häufiger Fehler 1: Plugin-Laden fehlgeschlagen

**Symptom**: Beim Start von OpenCode erscheint „Failed to load plugin @plannotator/opencode"

**Mögliche Ursachen**:
- Netzwerkprobleme verhindern den Download von npm
- npm-Cache ist beschädigt

**Lösung**:
1. Netzwerkverbindung überprüfen
2. Installationsskript ausführen (bereinigt den Plugin-Cache)
3. npm-Cache manuell bereinigen: `npm cache clean --force`

---

### Häufiger Fehler 2: Slash-Befehl nicht verfügbar

**Symptom**: Bei Eingabe von `/plannotator-review` erscheint kein Befehlsvorschlag

**Mögliche Ursache**: Installationsskript wurde nicht erfolgreich ausgeführt

**Lösung**: Installationsskript erneut ausführen (Schritt 3)

---

### Häufiger Fehler 3: Browser öffnet sich nicht im Remote-Modus

**Symptom**: Bei Aufruf von `submit_plan` im devcontainer öffnet sich der Browser nicht

**Mögliche Ursachen**:
- `PLANNOTATOR_REMOTE=1` ist nicht gesetzt
- Port-Weiterleitung ist nicht konfiguriert

**Lösung**:
1. Bestätigen Sie, dass `PLANNOTATOR_REMOTE=1` gesetzt ist
2. Prüfen Sie, ob `forwardPorts` in `.devcontainer/devcontainer.json` den konfigurierten Port enthält
3. Rufen Sie die angezeigte URL manuell auf: `http://localhost:9999`

---

### Häufiger Fehler 4: Port bereits belegt

**Symptom**: Server-Start schlägt fehl mit „Port already in use"

**Mögliche Ursache**: Vorheriger Server wurde nicht ordnungsgemäß beendet

**Lösung**:
1. `PLANNOTATOR_PORT` auf einen anderen Port ändern
2. Oder den Prozess, der den Port belegt, manuell beenden (macOS/Linux: `lsof -ti:9999 | xargs kill`)

---

## Zusammenfassung

In dieser Lektion haben Sie gelernt, wie Sie das Plannotator-Plugin in OpenCode installieren und konfigurieren:

1. **Plugin über `opencode.json` hinzufügen** - Aktiviert das `submit_plan`-Tool
2. **Installationsskript ausführen** - Erhält den `/plannotator-review`-Slash-Befehl
3. **Umgebungsvariablen konfigurieren** - Anpassung an Remote-Modus und individuelle Anforderungen
4. **Installation überprüfen** - Bestätigung der korrekten Plugin-Funktion

Nach der Installation können Sie:
- Den Agent `submit_plan` verwenden lassen, um Pläne für interaktives Review einzureichen
- `/plannotator-review` für manuelles Git-Diff-Review verwenden

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen Sie die **[Grundlagen des Plan-Reviews](../../platforms/plan-review-basics/)**.
>
> Sie werden lernen:
> - Wie Sie KI-generierte Pläne anzeigen
> - Verschiedene Annotationstypen hinzufügen (Löschen, Ersetzen, Einfügen, Kommentieren)
> - Pläne genehmigen oder ablehnen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-24

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Plugin-Einstiegspunkt-Definition | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 34-280 |
| `submit_plan`-Tool-Definition | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 209-252 |
| Plugin-Konfiguration (opencode.json) Injektion | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 55-63 |
| Umgebungsvariablen-Auslesen | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 37-51 |
| Plan-Review-Server-Start | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts) | Gesamte Datei |
| Code-Review-Server-Start | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts) | Gesamte Datei |
| Remote-Modus-Erkennung | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts) | Gesamte Datei |

**Wichtige Konstanten**:
- `PLANNOTATOR_REMOTE`: Remote-Modus-Flag (auf „1" oder „true" setzen zum Aktivieren)
- `PLANNOTATOR_PORT`: Feste Portnummer (lokal standardmäßig zufällig, remote standardmäßig 19432)

**Wichtige Funktionen**:
- `startPlannotatorServer()`: Startet den Plan-Review-Server
- `startReviewServer()`: Startet den Code-Review-Server
- `getSharingEnabled()`: Ruft den URL-Sharing-Status ab (aus OpenCode-Konfiguration oder Umgebungsvariablen)

</details>
