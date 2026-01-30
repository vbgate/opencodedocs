---
title: "Debug-Protokollierung: Fehlersuche und Betriebsüberwachung | opencode-antigravity-auth"
sidebarTitle: "Protokolle helfen bei der Fehlersuche"
subtitle: "Debug-Protokollierung: Fehlersuche und Betriebsüberwachung"
description: "Lernen Sie, wie Sie Debug-Protokolle aktivieren, um Probleme mit dem Antigravity Auth Plugin zu beheben. Behandelt Protokollebenen, Inhaltsinterpretation, Umgebungsvariablenkonfiguration und Protokolldateiverwaltung."
tags:
  - "Erweitert"
  - "Debug"
  - "Protokollierung"
  - "Fehlerbehebung"
prerequisite:
  - "start-quick-install"
  - "start-first-request"
order: 3
---

# Debug-Protokollierung: Fehlersuche und Betriebsüberwachung

## Was Sie lernen werden

- Debug-Protokolle aktivieren, um detaillierte Informationen zu allen Anfragen und Antworten aufzuzeichnen
- Verschiedene Protokollebenen und ihre Anwendungsfälle verstehen
- Protokollinhalte interpretieren, um die Ursache von Problemen schnell zu lokalisieren
- Umgebungsvariablen verwenden, um Debug temporär zu aktivieren, ohne Konfigurationsdateien zu ändern
- Protokolldateien verwalten, um übermäßige Festplattenbelegung zu vermeiden

## Ihre aktuelle Herausforderung

Bei Problemen könnten Sie:

- Vage Fehlermeldungen sehen, ohne die genaue Ursache zu kennen
- Nicht wissen, ob die Anfrage die Antigravity API erfolgreich erreicht hat
- Vermuten, dass Kontowahl, Rate-Limiting oder Anfragetransformation das Problem ist
- Beim Hilfesuchen keine wertvollen Diagnoseinformationen bereitstellen können

## Wann Sie diese Methode brauchen

Debug-Protokollierung eignet sich für folgende Szenarien:

| Szenario | Erforderlich | Grund |
| --- | --- | --- |
| 429 Rate-Limiting beheben | ✅ Erforderlich | Sehen, welches Konto, welches Modell limitiert ist |
| Authentifizierungsfehler beheben | ✅ Erforderlich | Token-Aktualisierung, OAuth-Flow prüfen |
| Anfragetransformation beheben | ✅ Erforderlich | Original- und transformierte Anfrage vergleichen |
| Kontoauswahlstrategie beheben | ✅ Erforderlich | Sehen, wie das Plugin Konten auswählt |
| Täglichen Betrieb überwachen | ✅ Erforderlich | Anfragehäufigkeit, Erfolgs-/Fehlerrate statistisch erfassen |
| Langzeitbetrieb | ⚠️ Vorsichtig | Protokolle wachsen kontinuierlich, Verwaltung erforderlich |

::: warning Voraussetzungen prüfen
Bevor Sie mit diesem Tutorial beginnen, stellen Sie sicher:
- ✅ Sie haben das opencode-antigravity-auth Plugin installiert
- ✅ Sie haben sich erfolgreich über OAuth authentifiziert
- ✅ Sie können Anfragen mit Antigravity-Modellen senden

[Schnellinstallation](../../start/quick-install/) | [Erste Anfrage](../../start/first-request/)
:::

## Kernkonzept

Funktionsweise des Debug-Protokollierungssystems:

1. **Strukturierte Protokolle**: Jeder Protokolleintrag enthält Zeitstempel und Tags für einfaches Filtern und Analysieren
2. **Stufenweise Aufzeichnung**:
   - Level 1 (basic): Zeichnet Anfrage-/Antwort-Metainformationen, Kontowahl, Rate-Limiting-Ereignisse auf
   - Level 2 (verbose): Zeichnet vollständige Anfrage-/Antwort-Bodies auf (maximal 50.000 Zeichen)
3. **Sicherheitsmaskierung**: Verbirgt automatisch sensible Informationen (wie Authorization-Header)
4. **Separate Dateien**: Erstellt bei jedem Start eine neue Protokolldatei, um Verwirrung zu vermeiden

**Protokollinhaltsübersicht**:

| Protokolltyp | Tag | Inhaltsbeispiel |
| --- | --- | --- |
| Anfrage-Tracking | `Antigravity Debug ANTIGRAVITY-1` | URL, Headers, Body-Vorschau |
| Antwort-Tracking | `Antigravity Debug ANTIGRAVITY-1` | Statuscode, Dauer, Antwort-Body |
| Kontokontext | `[Account]` | Ausgewähltes Konto, Kontoindex, Modellfamilie |
| Rate-Limiting | `[RateLimit]` | Limit-Details, Reset-Zeit, Wiederholungsverzögerung |
| Modellerkennung | `[ModelFamily]` | URL-Parsing, Modellextraktion, Modellfamilie-Bestimmung |

## Schritt-für-Schritt-Anleitung

### Schritt 1: Basis-Debug-Protokollierung aktivieren

**Warum**
Nach Aktivierung der Basis-Debug-Protokollierung zeichnet das Plugin alle Anfrage-Metainformationen auf, einschließlich URL, Headers, Kontowahl, Rate-Limiting-Ereignisse usw., um Ihnen bei der Fehlersuche zu helfen, ohne sensible Daten preiszugeben.

**Vorgehensweise**

Bearbeiten Sie die Plugin-Konfigurationsdatei:

::: code-group

```bash [macOS/Linux]
nano ~/.config/opencode/antigravity.json
```

```powershell [Windows]
notepad %APPDATA%\opencode\antigravity.json
```

:::

Fügen Sie folgende Konfiguration hinzu oder ändern Sie sie:

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "debug": true
}
```

Speichern Sie die Datei und starten Sie OpenCode neu.

**Erwartetes Ergebnis**:

1. Nach dem Start von OpenCode wird eine neue Protokolldatei im Konfigurationsverzeichnis erstellt
2. Protokolldatei-Namensformat: `antigravity-debug-YYYY-MM-DDTHH-MM-SS-mmmZ.log`
3. Nach dem Senden einer beliebigen Anfrage erscheinen neue Einträge in der Protokolldatei

::: tip Protokolldateispeicherort
- **Linux/macOS**: `~/.config/opencode/antigravity-logs/`
- **Windows**: `%APPDATA%\opencode\antigravity-logs\`
:::

### Schritt 2: Protokollinhalte interpretieren

**Warum**
Das Verständnis des Protokollformats und -inhalts ermöglicht es Ihnen, Probleme schnell zu lokalisieren.

**Vorgehensweise**

Senden Sie eine Testanfrage und sehen Sie sich dann die Protokolldatei an:

```bash
<!-- macOS/Linux -->
tail -f ~/.config/opencode/antigravity-logs/antigravity-debug-*.log

<!-- Windows PowerShell -->
Get-Content "$env:APPDATA\opencode\antigravity-logs\antigravity-debug-*.log" -Wait
```

**Erwartetes Ergebnis**:

```log
[2026-01-23T10:30:15.123Z] [Account] Request: Account 1 (1/2) family=claude
[2026-01-23T10:30:15.124Z] [Antigravity Debug ANTIGRAVITY-1] POST https://cloudcode-pa.googleapis.com/...
[2026-01-23T10:30:15.125Z] [Antigravity Debug ANTIGRAVITY-1] Streaming: yes
[2026-01-23T10:30:15.126Z] [Antigravity Debug ANTIGRAVITY-1] Headers: {"user-agent":"opencode-antigravity-auth/1.3.0","authorization":"[redacted]",...}
[2026-01-23T10:30:15.127Z] [Antigravity Debug ANTIGRAVITY-1] Body Preview: {"model":"google/antigravity-claude-sonnet-4-5",...}
[2026-01-23T10:30:18.456Z] [Antigravity Debug ANTIGRAVITY-1] Response 200 OK (3330ms)
[2026-01-23T10:30:18.457Z] [Antigravity Debug ANTIGRAVITY-1] Response Headers: {"content-type":"application/json",...}
```

**Protokollinterpretation**:

1. **Zeitstempel**: `[2026-01-23T10:30:15.123Z]` - ISO 8601-Format, präzise auf Millisekunden
2. **Kontowahl**: `[Account]` - Plugin wählte Konto 1, insgesamt 2 Konten, Modellfamilie ist claude
3. **Anfrage-Start**: `Antigravity Debug ANTIGRAVITY-1` - Anfrage-ID ist 1
4. **Anfragemethode**: `POST https://...` - HTTP-Methode und Ziel-URL
5. **Streaming**: `Streaming: yes/no` - Ob SSE-Streaming-Antwort verwendet wird
6. **Anfrage-Headers**: `Headers: {...}` - Verbirgt automatisch Authorization (zeigt `[redacted]`)
7. **Anfrage-Body**: `Body Preview: {...}` - Anfrageinhalt (maximal 12.000 Zeichen, darüber hinaus abgeschnitten)
8. **Antwortstatus**: `Response 200 OK (3330ms)` - HTTP-Statuscode und Dauer
9. **Antwort-Headers**: `Response Headers: {...}` - Antwort-Headers

### Schritt 3: Verbose-Protokollierung aktivieren

**Warum**
Verbose-Protokolle zeichnen vollständige Anfrage-/Antwort-Bodies auf (maximal 50.000 Zeichen), geeignet für die Behebung von Anfragetransformation, Antwort-Parsing und anderen tieferen Problemen.

**Vorgehensweise**

Ändern Sie die Konfiguration auf Verbose-Level:

```json
{
  "debug": true,
  "OPENCODE_ANTIGRAVITY_DEBUG": "2"
}
```

Oder verwenden Sie Umgebungsvariablen (empfohlen, keine Änderung der Konfigurationsdatei erforderlich):

::: code-group

```bash [macOS/Linux]
export OPENCODE_ANTIGRAVITY_DEBUG=2
opencode
```

```powershell [Windows]
$env:OPENCODE_ANTIGRAVITY_DEBUG="2"
opencode
```

:::

**Erwartetes Ergebnis**:

1. In der Protokolldatei erscheinen vollständige Anfrage-/Antwort-Bodies (nicht mehr abgeschnittene Vorschau)
2. Bei großen Antworten werden die ersten 50.000 Zeichen angezeigt und die Anzahl der abgeschnittenen Zeichen markiert

```log
[2026-01-23T10:30:15.127Z] [Antigravity Debug ANTIGRAVITY-1] Response Body (200): {"id":"msg_...","type":"message","role":"assistant",...}
```

::: warning Warnung vor Festplattenspeicher
Verbose-Protokolle zeichnen vollständige Anfrage-/Antwort-Inhalte auf, was zu schnellem Wachstum der Protokolldateien führen kann. Nach Abschluss des Debuggings sollten Sie den Verbose-Modus unbedingt deaktivieren.
:::

### Schritt 4: Rate-Limiting-Probleme beheben

**Warum**
Rate-Limiting (429-Fehler) ist eines der häufigsten Probleme. Protokolle können Ihnen genau sagen, welches Konto, welches Modell limitiert ist und wie lange Sie warten müssen.

**Vorgehensweise**

Senden Sie mehrere gleichzeitige Anfragen, um Rate-Limiting auszulösen:

```bash
<!-- macOS/Linux -->
for i in {1..10}; do
  opencode run "Test $i" --model=google/antigravity-claude-sonnet-4-5 &
done
wait
```

Sehen Sie sich Rate-Limiting-Ereignisse in den Protokollen an:

```bash
grep "RateLimit" ~/.config/opencode/antigravity-logs/antigravity-debug-*.log
```

**Erwartetes Ergebnis**:

```log
[2026-01-23T10:30:20.123Z] [RateLimit] 429 on Account 1 family=claude retryAfterMs=60000
[2026-01-23T10:30:20.124Z] [RateLimit] message: Resource has been exhausted
[2026-01-23T10:30:20.125Z] [RateLimit] quotaResetTime: 2026-01-23T10:31:00.000Z
[2026-01-23T10:30:20.126Z] [Account] Request: Account 2 (2/2) family=claude
[2026-01-23T10:30:20.127Z] [RateLimit] snapshot family=claude Account 1=wait 60s | Account 2=ready
```

**Protokollinterpretation**:

1. **Limit-Details**: `429 on Account 1 family=claude retryAfterMs=60000`
   - Konto 1 (claude-Modellfamilie) hat einen 429-Fehler erhalten
   - Muss 60.000 Millisekunden (60 Sekunden) warten, bevor erneut versucht wird
2. **Fehlermeldung**: `message: Resource has been exhausted` - Kontingent erschöpft
3. **Reset-Zeit**: `quotaResetTime: 2026-01-23T10:31:00.000Z` - Genaue Zeit der Kontingent-Zurücksetzung
4. **Kontowechsel**: Plugin wechselt automatisch zu Konto 2
5. **Globaler Snapshot**: `snapshot` - Zeigt den Limit-Status aller Konten

### Schritt 5: Protokollverzeichnis anpassen

**Warum**
Standardmäßig werden Protokolldateien im Verzeichnis `~/.config/opencode/antigravity-logs/` gespeichert. Wenn Sie Protokolle an einem anderen Ort speichern möchten (z.B. im Projektverzeichnis), können Sie das Protokollverzeichnis anpassen.

**Vorgehensweise**

Fügen Sie in der Konfigurationsdatei die Konfigurationsoption `log_dir` hinzu:

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "debug": true,
  "log_dir": "/path/to/your/custom/logs"
}
```

Oder verwenden Sie Umgebungsvariablen:

```bash
export OPENCODE_ANTIGRAVITY_LOG_DIR="/path/to/your/custom/logs"
opencode
```

**Erwartetes Ergebnis**:

1. Protokolldateien werden in das angegebene Verzeichnis geschrieben
2. Wenn das Verzeichnis nicht existiert, erstellt das Plugin es automatisch
3. Das Protokolldatei-Namensformat bleibt unverändert

::: tip Pfadempfehlungen
- Entwicklungs-Debugging: Im Projektstammverzeichnis speichern (`.logs/`)
- Produktionsumgebung: Im System-Protokollverzeichnis speichern (`/var/log/` oder `~/Library/Logs/`)
- Temporäres Debugging: Im `/tmp/`-Verzeichnis speichern, einfach zu bereinigen
:::

### Schritt 6: Protokolldateien bereinigen und verwalten

**Warum**
Bei Langzeitbetrieb wachsen Protokolldateien kontinuierlich und belegen viel Festplattenspeicher. Regelmäßige Bereinigung ist notwendig.

**Vorgehensweise**

Protokollverzeichnisgröße anzeigen:

```bash
<!-- macOS/Linux -->
du -sh ~/.config/opencode/antigravity-logs/

<!-- Windows PowerShell -->
Get-ChildItem "$env:APPDATA\opencode\antigravity-logs\" | Measure-Object -Property Length -Sum
```

Alte Protokolle bereinigen:

```bash
<!-- macOS/Linux -->
find ~/.config/opencode/antigravity-logs/ -name "antigravity-debug-*.log" -mtime +7 -delete

<!-- Windows PowerShell -->
Get-ChildItem "$env:APPDATA\opencode\antigravity-logs\antigravity-debug-*.log" |
  Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } |
  Remove-Item
```

**Erwartetes Ergebnis**:

1. Die Größe des Protokollverzeichnisses nimmt ab
2. Nur Protokolldateien der letzten 7 Tage werden beibehalten

::: tip Automatisierte Bereinigung
Sie können das Bereinigungsskript zu cron (Linux/macOS) oder dem Aufgabenplaner (Windows) hinzufügen, um die Bereinigung regelmäßig auszuführen.
:::

## Checkpoint ✅

Nach Abschluss der obigen Schritte sollten Sie in der Lage sein:

- [ ] Debug-Protokollierung über die Konfigurationsdatei aktivieren
- [ ] Umgebungsvariablen verwenden, um Debug temporär zu aktivieren
- [ ] Protokollinhalte interpretieren, Anfrage-/Antwort-Details finden
- [ ] Die Funktion verschiedener Protokollebenen verstehen
- [ ] Protokollverzeichnis anpassen
- [ ] Protokolldateien verwalten und bereinigen

## Häufige Fallstricke

### Protokolldateien wachsen kontinuierlich

**Symptom**: Festplattenspeicher wird von Protokolldateien belegt

**Ursache**: Debug-Protokollierung langfristig aktiviert, insbesondere im Verbose-Modus

**Lösung**:

1. Nach Abschluss des Debuggings sofort deaktivieren `debug: false`
2. Regelmäßiges Bereinigungsskript einrichten (wie in Schritt 6)
3. Protokollverzeichnisgröße überwachen, Schwellenwert-Alarm einrichten

### Protokolldatei nicht gefunden

**Symptom**: `debug: true` aktiviert, aber Protokollverzeichnis ist leer

**Ursache**:
- Falscher Konfigurationsdateipfad
- Berechtigungsproblem (kann nicht in Protokollverzeichnis schreiben)
- Umgebungsvariable überschreibt Konfiguration

**Lösung**:

1. Konfigurationsdateipfad bestätigen:
   ```bash
   # Konfigurationsdatei suchen
   find ~/.config/opencode/ -name "antigravity.json" 2>/dev/null
   ```
2. Prüfen, ob Umgebungsvariable Konfiguration überschreibt:
   ```bash
   echo $OPENCODE_ANTIGRAVITY_DEBUG
   ```
3. Protokollverzeichnisberechtigungen prüfen:
   ```bash
   ls -la ~/.config/opencode/antigravity-logs/
   ```

### Unvollständige Protokollinhalte

**Symptom**: Anfrage-/Antwort-Body nicht in Protokollen sichtbar

**Ursache**: Standardmäßig wird Basic-Level (Level 1) verwendet, zeichnet nur Body-Vorschau auf (maximal 12.000 Zeichen)

**Lösung**:

1. Verbose-Level (Level 2) aktivieren:
   ```json
   {
     "OPENCODE_ANTIGRAVITY_DEBUG": "2"
   }
   ```
2. Oder Umgebungsvariable verwenden:
   ```bash
   export OPENCODE_ANTIGRAVITY_DEBUG=2
   ```

### Offenlegung sensibler Informationen

**Symptom**: Bedenken, dass Protokolle sensible Daten enthalten (wie Authorization-Token)

**Ursache**: Plugin maskiert automatisch `Authorization`-Header, aber andere Headers können sensible Informationen enthalten

**Lösung**:

1. Plugin maskiert automatisch `Authorization`-Header (zeigt `[redacted]`)
2. Beim Teilen von Protokollen prüfen, ob andere sensible Headers vorhanden sind (wie `Cookie`, `Set-Cookie`)
3. Wenn sensible Informationen gefunden werden, manuell löschen, bevor Sie teilen

### Protokolldatei kann nicht geöffnet werden

**Symptom**: Protokolldatei wird von einem anderen Prozess verwendet, kann nicht angezeigt werden

**Ursache**: OpenCode schreibt gerade in die Protokolldatei

**Lösung**:

1. Verwenden Sie den Befehl `tail -f`, um Echtzeit-Protokolle anzuzeigen (sperrt Datei nicht)
2. Wenn Sie bearbeiten müssen, schließen Sie zuerst OpenCode
3. Verwenden Sie den Befehl `cat`, um Inhalte anzuzeigen (sperrt Datei nicht)

## Zusammenfassung

- Debug-Protokollierung ist ein leistungsstarkes Werkzeug zur Fehlersuche, kann Anfrage-/Antwort-Details, Kontowahl, Rate-Limiting-Ereignisse aufzeichnen
- Es gibt zwei Protokollebenen: basic (Level 1) und verbose (Level 2)
- Umgebungsvariablen können Debug temporär aktivieren, ohne Konfigurationsdatei zu ändern
- Plugin maskiert automatisch sensible Informationen (wie Authorization-Header)
- Bei Langzeitbetrieb müssen Protokolldateien regelmäßig bereinigt werden

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Rate-Limiting-Behandlung](../rate-limit-handling/)**.
>
> Sie werden lernen:
> - Rate-Limiting-Erkennungsmechanismus und Wiederholungsstrategie
> - Funktionsweise des exponentiellen Backoff-Algorithmus
> - Wie man maximale Wartezeit und Wiederholungsversuche konfiguriert
> - Rate-Limiting-Behandlung in Multi-Account-Szenarien

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um Quellcode-Speicherorte anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-23

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Debug-Modul | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts) | Vollständig |
| Debug-Initialisierung | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L98-L118) | 98-118 |
| Anfrage-Tracking | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L189-L212) | 189-212 |
| Antwort-Aufzeichnung | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L217-L250) | 217-250 |
| Header-Maskierung | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L255-L270) | 255-270 |
| Rate-Limiting-Protokolle | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L354-L396) | 354-396 |
| Konfigurations-Schema | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts#L64-L72) | 64-72 |

**Wichtige Konstanten**:

| Konstantenname | Wert | Beschreibung |
| --- | --- | --- |
| `MAX_BODY_PREVIEW_CHARS` | 12000 | Body-Vorschaulänge auf Basic-Level |
| `MAX_BODY_VERBOSE_CHARS` | 50000 | Body-Vorschaulänge auf Verbose-Level |
| `DEBUG_MESSAGE_PREFIX` | `"[opencode-antigravity-auth debug]"` | Debug-Protokoll-Präfix |

**Wichtige Funktionen**:

- `initializeDebug(config)`: Initialisiert Debug-Status, liest Konfiguration und Umgebungsvariablen
- `parseDebugLevel(flag)`: Parst Debug-Level-String ("0"/"1"/"2"/"true"/"verbose")
- `getLogsDir(customLogDir?)`: Ruft Protokollverzeichnis ab, unterstützt benutzerdefinierten Pfad
- `createLogFilePath(customLogDir?)`: Generiert Protokolldateipfad mit Zeitstempel
- `startAntigravityDebugRequest(meta)`: Startet Anfrage-Tracking, zeichnet Anfrage-Metainformationen auf
- `logAntigravityDebugResponse(context, response, meta)`: Zeichnet Antwort-Details auf
- `logAccountContext(label, info)`: Zeichnet Kontoauswahlkontext auf
- `logRateLimitEvent(...)`: Zeichnet Rate-Limiting-Ereignisse auf
- `maskHeaders(headers)`: Maskiert sensible Headers (Authorization)

**Konfigurationsoptionen** (aus schema.ts):

| Konfigurationsoption | Typ | Standardwert | Beschreibung |
| --- | --- | --- | --- |
| `debug` | boolean | `false` | Debug-Protokollierung aktivieren |
| `log_dir` | string? | undefined | Benutzerdefiniertes Protokollverzeichnis |

**Umgebungsvariablen**:

| Umgebungsvariable | Wert | Beschreibung |
| --- | --- | --- |
| `OPENCODE_ANTIGRAVITY_DEBUG` | "0"/"1"/"2"/"true"/"verbose" | Überschreibt Debug-Konfiguration, steuert Protokollebene |
| `OPENCODE_ANTIGRAVITY_LOG_DIR` | string | Überschreibt log_dir-Konfiguration, gibt Protokollverzeichnis an |

</details>
