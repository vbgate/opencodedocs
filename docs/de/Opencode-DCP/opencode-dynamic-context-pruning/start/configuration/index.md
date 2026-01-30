---
title: "Konfiguration: DCP Mehrstufige Einstellungen | opencode-dcp"
sidebarTitle: "DCP anpassen"
subtitle: "Konfiguration: DCP Mehrstufige Einstellungen"
description: "Lernen Sie das mehrstufige Konfigurationssystem von opencode-dcp kennen. Beherrschen Sie die Prioritätsregeln für globale, Umgebungs- und Projektkonfigurationen, Pruning-Strategien, Schutzmechanismen und Benachrichtigungsstufen."
tags:
  - "Konfiguration"
  - "DCP"
  - "Plugin-Einstellungen"
prerequisite:
  - "start-getting-started"
order: 2
---

# DCP Konfiguration im Detail

## Was Sie lernen werden

- Das dreistufige Konfigurationssystem von DCP beherrschen (Global, Projekt, Umgebungsvariablen)
- Die Prioritätsregeln verstehen und wissen, welche Konfiguration wirksam wird
- Pruning-Strategien und Schutzmechanismen nach Bedarf anpassen
- Benachrichtigungsstufen konfigurieren und die Detailtiefe der Pruning-Meldungen steuern

## Ihre aktuelle Herausforderung

DCP funktioniert nach der Installation mit der Standardkonfiguration, aber Sie könnten auf folgende Probleme stoßen:

- Sie möchten für verschiedene Projekte unterschiedliche Pruning-Strategien festlegen
- Bestimmte Dateien sollen nicht geprunt werden
- Pruning-Meldungen erscheinen zu häufig oder sind zu detailliert
- Sie möchten eine automatische Pruning-Strategie deaktivieren

In diesen Fällen müssen Sie das Konfigurationssystem von DCP verstehen.

## Wann Sie dies benötigen

- **Projektspezifische Anpassung**: Verschiedene Projekte haben unterschiedliche Pruning-Anforderungen
- **Fehlerbehebung**: Debug-Logs aktivieren, um Probleme zu lokalisieren
- **Performance-Optimierung**: Strategie-Schalter und Schwellenwerte anpassen
- **Personalisierung**: Benachrichtigungsstufen ändern, kritische Tools schützen

## Kernkonzept

DCP verwendet ein **dreistufiges Konfigurationssystem** mit aufsteigender Priorität:

```
Standardwerte (hardcodiert) → Globale Konfiguration → Umgebungsvariablen → Projektkonfiguration
        Niedrigste Priorität                                    Höchste Priorität
```

Jede Ebene überschreibt gleichnamige Konfigurationseinträge der vorherigen Ebene, daher hat die Projektkonfiguration die höchste Priorität.

::: info Warum ein mehrstufiges Konfigurationssystem?

Der Zweck dieses Designs ist:
- **Globale Konfiguration**: Allgemeines Standardverhalten festlegen, gilt für alle Projekte
- **Projektkonfiguration**: Spezifische Anpassungen für einzelne Projekte, ohne andere zu beeinflussen
- **Umgebungsvariablen**: Schneller Konfigurationswechsel in verschiedenen Umgebungen (z.B. CI/CD)

:::

## 🎒 Voraussetzungen

Stellen Sie sicher, dass Sie [Installation und Schnellstart](../getting-started/) abgeschlossen haben und das DCP-Plugin erfolgreich in OpenCode installiert ist und läuft.

## Schritt-für-Schritt-Anleitung

### Schritt 1: Aktuelle Konfiguration anzeigen

**Warum**
Verstehen Sie zuerst die Standardkonfiguration, bevor Sie Anpassungen vornehmen.

DCP erstellt beim ersten Start automatisch eine globale Konfigurationsdatei.

```bash
# macOS/Linux
cat ~/.config/opencode/dcp.jsonc

# Windows PowerShell
Get-Content "$env:USERPROFILE\.config\opencode\dcp.jsonc"
```

**Erwartete Ausgabe**: Eine Standardkonfiguration ähnlich der folgenden

```jsonc
{
    "$schema": "https://raw.githubusercontent.com/Opencode-DCP/opencode-dynamic-context-pruning/master/dcp.schema.json",
    "enabled": true,
    "debug": false,
    "pruneNotification": "detailed",
    "commands": {
        "enabled": true,
        "protectedTools": []
    },
    "turnProtection": {
        "enabled": false,
        "turns": 4
    },
    "protectedFilePatterns": [],
    "tools": {
        "settings": {
            "nudgeEnabled": true,
            "nudgeFrequency": 10,
            "protectedTools": []
        },
        "discard": {
            "enabled": true
        },
        "extract": {
            "enabled": true,
            "showDistillation": false
        }
    },
    "strategies": {
        "deduplication": {
            "enabled": true,
            "protectedTools": []
        },
        "supersedeWrites": {
            "enabled": false
        },
        "purgeErrors": {
            "enabled": true,
            "turns": 4,
            "protectedTools": []
        }
    }
}
```

### Schritt 2: Konfigurationsdatei-Speicherorte verstehen

DCP unterstützt drei Konfigurationsebenen:

| Ebene | Pfad | Priorität | Anwendungsfall |
| --- | --- | --- | --- |
| **Global** | `~/.config/opencode/dcp.jsonc` oder `dcp.json` | 2 | Standardkonfiguration für alle Projekte |
| **Umgebungsvariable** | `$OPENCODE_CONFIG_DIR/dcp.jsonc` oder `dcp.json` | 3 | Umgebungsspezifische Konfiguration |
| **Projekt** | `<project>/.opencode/dcp.jsonc` oder `dcp.json` | 4 | Konfigurationsüberschreibung für einzelne Projekte |

::: tip Konfigurationsdatei-Formate

DCP unterstützt zwei Formate: `.json` und `.jsonc`:
- `.json`: Standard-JSON-Format, keine Kommentare erlaubt
- `.jsonc`: JSON-Format mit `//`-Kommentaren (empfohlen)

:::

### Schritt 3: Pruning-Benachrichtigungen konfigurieren

**Warum**
Steuern Sie die Detailtiefe der DCP-Pruning-Meldungen, um Störungen zu vermeiden.

Bearbeiten Sie die globale Konfigurationsdatei:

```jsonc
{
    "pruneNotification": "detailed"  // Mögliche Werte: "off", "minimal", "detailed"
}
```

**Benachrichtigungsstufen im Überblick**:

| Stufe | Verhalten | Anwendungsfall |
| --- | --- | --- |
| **off** | Keine Pruning-Benachrichtigungen | Fokussiertes Arbeiten ohne Feedback |
| **minimal** | Nur kurze Statistik (eingesparte Token) | Einfaches Feedback ohne zu viele Informationen |
| **detailed** | Detaillierte Pruning-Informationen (Tool-Name, Grund) | Pruning-Verhalten verstehen, Konfiguration debuggen |

**Erwartetes Ergebnis**: Nach der Konfigurationsänderung werden Benachrichtigungen beim nächsten Pruning entsprechend der neuen Stufe angezeigt.

### Schritt 4: Automatische Pruning-Strategien konfigurieren

**Warum**
DCP bietet drei automatische Pruning-Strategien, die Sie nach Bedarf ein- oder ausschalten können.

Bearbeiten Sie die Konfigurationsdatei:

```jsonc
{
    "strategies": {
        // Deduplizierungsstrategie: Entfernt doppelte Tool-Aufrufe
        "deduplication": {
            "enabled": true,           // Aktivieren/Deaktivieren
            "protectedTools": []         // Zusätzlich geschützte Tool-Namen
        },

        // Überschreibungsstrategie: Bereinigt Schreiboperationen, die durch Leseoperationen überschrieben wurden
        "supersedeWrites": {
            "enabled": false          // Standardmäßig deaktiviert
        },

        // Fehlerbereinigungsstrategie: Bereinigt Eingaben veralteter fehlerhafter Tools
        "purgeErrors": {
            "enabled": true,           // Aktivieren/Deaktivieren
            "turns": 4,               // Nach wie vielen Runden Fehler bereinigt werden
            "protectedTools": []         // Zusätzlich geschützte Tool-Namen
        }
    }
}
```

**Strategien im Detail**:

- **deduplication (Deduplizierung)**: Standardmäßig aktiviert. Erkennt Aufrufe mit identischen Tools und Parametern, behält nur den neuesten.
- **supersedeWrites (Überschreibung)**: Standardmäßig deaktiviert. Wenn nach einer Schreiboperation eine Leseoperation folgt, wird die Eingabe der Schreiboperation bereinigt.
- **purgeErrors (Fehlerbereinigung)**: Standardmäßig aktiviert. Fehlerhafte Tools, die älter als die angegebene Rundenzahl sind, werden geprunt (nur die Fehlermeldung bleibt, potenziell große Eingabeparameter werden entfernt).

### Schritt 5: Schutzmechanismen konfigurieren

**Warum**
Vermeiden Sie versehentliches Pruning kritischer Inhalte (wie wichtige Dateien oder Kern-Tools).

DCP bietet drei Schutzmechanismen:

#### 1. Rundenschutz (Turn Protection)

Schützt Tool-Ausgaben der letzten Runden, damit die KI genügend Zeit hat, darauf zu verweisen.

```jsonc
{
    "turnProtection": {
        "enabled": false,   // Bei Aktivierung werden die letzten 4 Runden geschützt
        "turns": 4          // Anzahl der geschützten Runden
    }
}
```

**Anwendungsfall**: Aktivieren Sie dies, wenn Sie feststellen, dass die KI häufig den Kontext verliert.

#### 2. Geschützte Tools (Protected Tools)

Bestimmte Tools werden standardmäßig nie geprunt:

```
task, todowrite, todoread, discard, extract, batch, write, edit, plan_enter, plan_exit
```

Sie können zusätzliche Tools zum Schutz hinzufügen:

```jsonc
{
    "tools": {
        "settings": {
            "protectedTools": [
                "myCustomTool",   // Benutzerdefiniertes Tool hinzufügen
                "databaseQuery"    // Zu schützendes Tool hinzufügen
            ]
        }
    },
    "strategies": {
        "deduplication": {
            "protectedTools": ["databaseQuery"]  // Tool für bestimmte Strategie schützen
        }
    }
}
```

#### 3. Geschützte Dateimuster (Protected File Patterns)

Verwenden Sie Glob-Muster, um bestimmte Dateien zu schützen:

```jsonc
{
    "protectedFilePatterns": [
        "**/*.config.ts",           // Alle .config.ts-Dateien schützen
        "**/secrets/**",           // Alle Dateien im secrets-Verzeichnis schützen
        "**/*.env",                // Umgebungsvariablen-Dateien schützen
        "**/critical/*.json"        // JSON-Dateien im critical-Verzeichnis schützen
    ]
}
```

::: warning Hinweis
protectedFilePatterns matcht `tool.parameters.filePath`, nicht den tatsächlichen Dateipfad. Das bedeutet, es funktioniert nur mit Tools, die einen `filePath`-Parameter haben (wie read, write, edit).

:::

### Schritt 6: Projektkonfiguration erstellen

**Warum**
Verschiedene Projekte können unterschiedliche Pruning-Strategien erfordern.

Erstellen Sie im Projektstammverzeichnis das `.opencode`-Verzeichnis (falls nicht vorhanden) und dann `dcp.jsonc`:

```bash
# Im Projektstammverzeichnis ausführen
mkdir -p .opencode
cat > .opencode/dcp.jsonc << 'EOF'
{
    "$schema": "https://raw.githubusercontent.com/Opencode-DCP/opencode-dynamic-context-pruning/master/dcp.schema.json",
    // Projektspezifische Konfiguration
    "strategies": {
        "supersedeWrites": {
            "enabled": true   // Überschreibungsstrategie für dieses Projekt aktivieren
        }
    },
    "protectedFilePatterns": [
        "**/config/**/*.ts"   // Konfigurationsdateien dieses Projekts schützen
    ]
}
EOF
```

**Erwartetes Ergebnis**:
- Die Projektkonfiguration überschreibt gleichnamige Einträge der globalen Konfiguration
- Nicht überschriebene Einträge verwenden weiterhin die globale Konfiguration

### Schritt 7: Debug-Logs aktivieren

**Warum**
Bei Problemen detaillierte Debug-Logs einsehen.

Bearbeiten Sie die Konfigurationsdatei:

```jsonc
{
    "debug": true
}
```

**Log-Speicherort**:
```
~/.config/opencode/logs/dcp/daily/YYYY-MM-DD.log
```

**Erwartetes Ergebnis**: Die Log-Datei enthält detaillierte Informationen zu Pruning-Operationen, Konfigurationsladung usw.

::: info Empfehlung für Produktionsumgebungen
Setzen Sie `debug` nach dem Debugging wieder auf `false`, um übermäßiges Wachstum der Log-Dateien zu vermeiden.

:::

## Checkpoint ✅

Nach Abschluss der obigen Schritte überprüfen Sie Folgendes:

- [ ] Sie kennen die drei Konfigurationsebenen und ihre Prioritäten
- [ ] Sie können die Benachrichtigungsstufe ändern und das Ergebnis sehen
- [ ] Sie verstehen die Funktion der drei automatischen Pruning-Strategien
- [ ] Sie können Schutzmechanismen konfigurieren (Runden, Tools, Dateien)
- [ ] Sie können eine Projektkonfiguration erstellen, die die globalen Einstellungen überschreibt

## Häufige Fallstricke

### Konfigurationsänderungen werden nicht wirksam

**Problem**: Nach Änderung der Konfigurationsdatei reagiert OpenCode nicht.

**Ursache**: OpenCode lädt Konfigurationsdateien nicht automatisch neu.

**Lösung**: Nach Konfigurationsänderungen muss **OpenCode neu gestartet** werden.

### Syntaxfehler in der Konfigurationsdatei

**Problem**: Die Konfigurationsdatei enthält Syntaxfehler, DCP kann sie nicht parsen.

**Symptom**: OpenCode zeigt eine Toast-Warnung "Invalid config" an.

**Lösung**: Überprüfen Sie die JSON-Syntax, insbesondere:
- Anführungszeichen, Kommas und Klammern müssen übereinstimmen
- Keine überflüssigen Kommas (z.B. nach dem letzten Element)
- Boolesche Werte verwenden `true`/`false`, nicht in Anführungszeichen

**Empfehlung**: Verwenden Sie einen Editor mit JSONC-Unterstützung (z.B. VS Code + JSONC-Plugin).

### Geschützte Tools funktionieren nicht

**Problem**: Sie haben `protectedTools` hinzugefügt, aber das Tool wird trotzdem geprunt.

**Ursachen**:
1. Tippfehler im Tool-Namen
2. Zum falschen `protectedTools`-Array hinzugefügt (z.B. `tools.settings.protectedTools` vs. `strategies.deduplication.protectedTools`)
3. Der Tool-Aufruf liegt innerhalb des Rundenschutzzeitraums (falls Rundenschutz aktiviert ist)

**Lösung**:
1. Überprüfen Sie die korrekte Schreibweise des Tool-Namens
2. Prüfen Sie, ob es an der richtigen Stelle hinzugefügt wurde
3. Sehen Sie in den Debug-Logs nach dem Pruning-Grund

## Zusammenfassung

Die wichtigsten Punkte des DCP-Konfigurationssystems:

- **Drei Ebenen**: Standardwerte → Global → Umgebungsvariablen → Projekt, mit aufsteigender Priorität
- **Flexible Überschreibung**: Projektkonfiguration kann globale Konfiguration überschreiben
- **Schutzmechanismen**: Rundenschutz, geschützte Tools, geschützte Dateimuster – vermeiden versehentliches Pruning
- **Automatische Strategien**: Deduplizierung, Überschreibung, Fehlerbereinigung – nach Bedarf ein-/ausschalten
- **Neustart erforderlich**: Nach Konfigurationsänderungen OpenCode neu starten

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen Sie **[Automatische Pruning-Strategien im Detail](../../platforms/auto-pruning/)**.
>
> Sie werden lernen:
> - Wie die Deduplizierungsstrategie doppelte Tool-Aufrufe erkennt
> - Wie die Überschreibungsstrategie funktioniert
> - Wann die Fehlerbereinigungsstrategie ausgelöst wird
> - Wie Sie die Strategieeffektivität überwachen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Speicherorte anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-23

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Konfigurationsmanagement-Kern | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 1-798 |
| Konfigurations-Schema | [`dcp.schema.json`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/dcp.schema.json) | 1-232 |
| Standardkonfiguration | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L423-L464) | 423-464 |
| Konfigurationspriorität | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L669-L797) | 669-797 |
| Konfigurationsvalidierung | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L147-L375) | 147-375 |
| Konfigurationsdateipfade | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L484-L526) | 484-526 |
| Standard geschützte Tools | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-L79) | 68-79 |
| Strategiekonfiguration zusammenführen | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L565-L595) | 565-595 |
| Tool-Konfiguration zusammenführen | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L597-L622) | 597-622 |

**Wichtige Konstanten**:
- `DEFAULT_PROTECTED_TOOLS`: Liste der standardmäßig geschützten Tool-Namen (`lib/config.ts:68-79`)

**Wichtige Funktionen**:
- `getConfig()`: Lädt und führt alle Konfigurationsebenen zusammen (`lib/config.ts:669-797`)
- `getInvalidConfigKeys()`: Validiert ungültige Schlüssel in der Konfigurationsdatei (`lib/config.ts:135-138`)
- `validateConfigTypes()`: Validiert die Typen der Konfigurationswerte (`lib/config.ts:147-375`)
- `getConfigPaths()`: Gibt alle Konfigurationsdateipfade zurück (`lib/config.ts:484-526`)

</details>
