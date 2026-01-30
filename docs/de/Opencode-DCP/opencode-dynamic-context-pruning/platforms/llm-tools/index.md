---
title: "LLM-Pruning: Intelligente Optimierung | opencode-dynamic-context-pruning"
sidebarTitle: "KI-gesteuertes Pruning"
subtitle: "LLM-Pruning: Intelligente Kontextoptimierung"
description: "Lernen Sie die discard/extract-Tools von DCP kennen, verstehen Sie Unterschiede, Injektionsmechanismen und Schutzmechanismen, konfigurieren Sie Schalteroptionen und validieren Sie die Pruning-Effekte in der Praxis zur Optimierung von Token und Kostensenkung."
tags:
  - "DCP"
  - "Kontext-Pruning"
  - "KI-Tools"
  - "Token-Optimierung"
prerequisite:
  - "start-configuration"
order: 2
---

# LLM-gesteuerte Pruning-Tools: Intelligente Kontextoptimierung durch KI

## Was Sie nach diesem Kurs können

- Verstehen Sie den Unterschied zwischen discard- und extract-Tools sowie deren Anwendungsszenarien
- Wissen Sie, wie die KI über die `<prunable-tools>`-Liste auswählt, was getrimmt werden soll
- Konfigurieren Sie Schalter, Erinnerungshäufigkeiten und Anzeigeoptionen für Pruning-Tools
- Verstehen Sie, wie Schutzmechanismen verhindern, dass kritische Dateien versehentlich getrimmt werden

## Ihre aktuelle Situation

Mit zunehmender Gesprächstiefe und Akkumulierung von Tool-Aufrufen wird der Kontext immer größer. Mögliche Probleme:
- Explodierende Token-Nutzung, steigende Kosten
- Die KI muss eine große Menge irrelevanter alter Tool-Ausgaben verarbeiten
- Unwissenheit darüber, wie die KI den Kontext aktiv bereinigen kann

Traditionelle Lösungen erfordern manuelles Bereinigen, was den Gesprächsfluss unterbricht. DCP bietet eine bessere Lösung: Lassen Sie die KI autonom entscheiden, wann der Kontext bereinigt werden soll.

## Wann Sie diese Technik anwenden

Wenn Sie:
- Häufig lange Gespräche führen mit vielen Tool-Aufrufen
- Feststellen, dass die KI eine große Menge historischer Tool-Ausgaben verarbeiten muss
- Token-Nutzungskosten optimieren möchten, ohne den Gesprächsfluss zu unterbrechen
- Je nach Szenario entscheiden möchten, ob Inhalte beibehalten oder gelöscht werden sollen

## Kernkonzept

DCP stellt zwei Tools zur Verfügung, mit denen die KI den Kontext während des Gesprächs aktiv optimieren kann:

| Tool | Zweck | Inhalt beibehalten? |
| --- | --- | ---|
| **discard** | Entfernt abgeschlossene Aufgaben oder Rauschen | ❌ Nein |
| **extract** | Extrahiert wichtige Erkenntnisse, löscht dann Original | ✅ Ja (kompakte Info) |

### Funktionsweise

Jedes Mal, bevor die KI eine Nachricht sendet, führt DCP folgende Schritte aus:

```
1. Scannt Tool-Aufrufe in der aktuellen Sitzung
   ↓
2. Filtert bereits getrimmte, geschützte Tools
   ↓
3. Generiert <prunable-tools>-Liste
   Format: ID: tool, parameter
   ↓
4. Injiziert Liste in den Kontext
   ↓
5. KI wählt Tools und ruft discard/extract auf
   ↓
6. DCP ersetzt getrimmte Inhalte durch Platzhalter
```

### Entscheidungslogik für Tool-Auswahl

Die KI wählt nach folgendem Prozess:

```
"Muss diese Tool-Ausgabe Informationen beibehalten?"
  │
  ├─ Nein → discard (Standardbereinigung)
  │   - Aufgabe abgeschlossen, wertloser Inhalt
  │   - Rauschen, irrelevante Information
  │
  ├─ Ja → extract (Wissen beibehalten)
  │   - Kritische Information für spätere Referenz
  │   - Funktionssignaturen, Konfigurationswerte usw.
  │
  └─ Unsicher → extract (sicherer)
```

::: info
Die KI führt Batch-Pruning durch, anstatt einzelne kleine Tool-Ausgaben zu trimmen. Dies ist effizienter.
:::

### Schutzmechanismen

DCP verfügt über mehrere Schutzschichten, um zu verhindern, dass die KI kritische Inhalte versehentlich trimmt:

| Schutzschicht | Beschreibung | Konfiguration |
| --- | --- | ---|
| **Geschützte Tools** | Kern-Tools wie task, write, edit können nicht getrimmt werden | `tools.settings.protectedTools` |
| **Geschützte Dateien** | Dateipfade, die glob-Mustern entsprechen, können nicht getrimmt werden | `protectedFilePatterns` |
| **Rundenschutz** | Neue Tools werden erst nach N Runden in die Trimm-Liste aufgenommen | `turnProtection.turns` |

::: tip
Standardmäßig geschützte Tools umfassen: task, todowrite, todoread, discard, extract, batch, write, edit, plan_enter, plan_exit
:::

## Schritt-für-Schritt-Anleitung

### Schritt 1: Verstehen der `<prunable-tools>`-Liste

Während des Gesprächs injiziert DCP automatisch die `<prunable-tools>`-Liste. Die KI sieht dann:

```xml
<prunable-tools>
The following tools have been invoked and are available for pruning.
This list does not mandate immediate action.
Consider your current goals and resources you need before discarding valuable tool inputs or outputs.
Consolidate your prunes for efficiency; it is rarely worth pruning a single tiny tool output.
Keep your context free of noise.

5: read, /path/to/auth.ts
12: bash, npm test
18: grep, "function login"
</prunable-tools>
```

**Was Sie sehen sollten**:
- Ein Tool pro Zeile, Format: `ID: tool, parameter`
- ID ist ein numerischer Index (beginnend bei 0)
- Nur anzeigbare, trimmbare Tools (bereits getrimmte, geschützte, geschützte Dateien werden nicht angezeigt)

### Schritt 2: Beobachten, wann die KI discard verwendet

Wenn die KI eine Aufgabe abschließt und beurteilt, dass keine Informationen beibehalten werden müssen:

```
Benutzereingabe: Teste Authentifizierungsfunktion

KI-Ausgabe:
Test erfolgreich. Authentifizierungslogik funktioniert normal, keine Notwendigkeit, Test-Logs zu behalten.
[Aufruf von discard(ids: ["completion", "5", "12"])]
```

**Was Sie sehen sollten**:
- Die KI hat das `discard`-Tool verwendet
- Parameterformat: `["Grund", "ID1", "ID2", ...]`
- Nur zwei mögliche Gründe: `"completion"` (Aufgabe abgeschlossen) oder `"noise"` (Rauschen)

### Schritt 3: Beobachten, wann die KI extract verwendet

Wenn die KI eine Aufgabe abschließt und kritische Informationen beibehalten muss:

```
Benutzereingabe: Analysiere die Implementierung des Authentifizierungsdienstes

KI-Ausgabe:
Ich habe einige wichtige Details gefunden, extrahiert wie folgt:
[Aufruf von extract(ids: ["5", "12"], distillation: [
  "auth.ts: validateToken prüft Cache (5min TTL) und ruft dann OIDC auf",
  "bash: npm test Ergebnis - alle Tests bestanden"
])]
```

**Was Sie sehen sollten**:
- Die KI hat das `extract`-Tool verwendet
- `distillation`-Array hat dieselbe Länge wie `ids`-Array
- Jeder extrahierte Inhalt ist eine kompakte Information der entsprechenden Tool-Ausgabe

### Schritt 4: Konfigurieren der Pruning-Tool-Optionen

Bearbeiten Sie die DCP-Konfigurationsdatei (`~/.config/opencode/dcp.jsonc` oder projektweit `.opencode/dcp.jsonc`):

```jsonc
{
  "tools": {
    "discard": {
      "enabled": true
    },
    "extract": {
      "enabled": true,
      "showDistillation": false
    },
    "settings": {
      "nudgeEnabled": true,
      "nudgeFrequency": 10,
      "protectedTools": [
        "task",
        "todowrite",
        "todoread",
        "discard",
        "extract",
        "batch",
        "write",
        "edit",
        "plan_enter",
        "plan_exit"
      ]
    }
  }
}
```

**Was Sie sehen sollten**:
- `discard.enabled`: Aktiviert discard-Tool (Standard: true)
- `extract.enabled`: Aktiviert extract-Tool (Standard: true)
- `extract.showDistillation`: Zeigt Extraktionsinhalt an (Standard: false)
- `nudgeEnabled`: Aktiviert Pruning-Erinnerungen (Standard: true)
- `nudgeFrequency`: Erinnerungsfrequenz (Standard: 10, d.h. alle 10 Tool-Aufrufe)

**Was Sie sehen sollten**:
- Wenn `showDistillation` false ist, wird der Extraktionsinhalt nicht im Gespräch angezeigt
- Wenn `showDistillation` true ist, wird der Extraktionsinhalt als ignored message angezeigt

### Schritt 5: Testen der Pruning-Funktion

1. Führen Sie ein längeres Gespräch durch, um mehrere Tool-Aufrufe auszulösen
2. Beobachten Sie, ob die KI discard oder extract zum passenden Zeitpunkt aufruft
3. Verwenden Sie `/dcp stats`, um Pruning-Statistiken anzuzeigen

**Was Sie sehen sollten**:
- Nach Akkumulierung einer bestimmten Anzahl von Tool-Aufrufen beginnt die KI mit dem aktiven Pruning
- `/dcp stats` zeigt die Anzahl der gesparten Token an
- Der Gesprächskontext konzentriert sich stärker auf die aktuelle Aufgabe

## Prüfpunkt ✅

::: details Klicken Sie, um Ihre Konfiguration zu überprüfen

**Überprüfen, ob die Konfiguration aktiv ist**

```bash
# DCP-Konfiguration anzeigen
cat ~/.config/opencode/dcp.jsonc

# Oder projektweite Konfiguration
cat .opencode/dcp.jsonc
```

Sie sollten sehen:
- `tools.discard.enabled` ist true (discard aktiviert)
- `tools.extract.enabled` ist true (extract aktiviert)
- `tools.settings.nudgeEnabled` ist true (Erinnerungen aktiviert)

**Überprüfen, ob das Pruning funktioniert**

Während des Gesprächs, nach Auslösung mehrerer Tool-Aufrufe:

Sie sollten sehen:
- Die KI ruft discard oder extract zum passenden Zeitpunkt auf
- Sie erhalten Pruning-Benachrichtigungen (zeigt getrimmte Tools und gesparte Token an)
- `/dcp stats` zeigt kumulativ gesparte Token an

:::

## Warnhinweise für Fallstricke

### Häufiger Fehler 1: KI führt kein Pruning durch

**Mögliche Ursachen**:
- Pruning-Tools nicht aktiviert
- Schutzkonfiguration zu streng, keine trimmbaren Tools verfügbar

**Lösung**:
```jsonc
{
  "tools": {
    "discard": {
      "enabled": true  // Sicherstellen, dass aktiviert
    },
    "extract": {
      "enabled": true  // Sicherstellen, dass aktiviert
    }
  }
}
```

### Häufiger Fehler 2: Kritische Inhalte wurden fälschlicherweise getrimmt

**Mögliche Ursachen**:
- Kritische Dateien nicht zum Schutzmodus hinzugefügt
- Liste der geschützten Tools unvollständig

**Lösung**:
```jsonc
{
  "protectedFilePatterns": [
    "src/auth/*",  // Schütze authentifizierungsbezogene Dateien
    "config/*"     // Schütze Konfigurationsdateien
  ],
  "tools": {
    "settings": {
      "protectedTools": [
        "read",  // Füge read zur Schutzliste hinzu
        "write"
      ]
    }
  }
}
```

### Häufiger Fehler 3: Extraktionsinhalt nicht sichtbar

**Mögliche Ursachen**:
- `showDistillation` auf false gesetzt

**Lösung**:
```jsonc
{
  "tools": {
    "extract": {
      "showDistillation": true  // Anzeige aktivieren
    }
  }
}
```

::: warning
Der Extraktionsinhalt wird als ignored message angezeigt und beeinflusst den Gesprächskontext nicht.
:::

## Zusammenfassung dieser Lektion

DCP stellt zwei Tools zur Verfügung, mit denen die KI den Kontext autonom optimieren kann:

- **discard**: Entfernt abgeschlossene Aufgaben oder Rauschen, keine Informationen müssen beibehalten werden
- **extract**: Extrahiert wichtige Erkenntnisse und löscht dann das Original, kompakte Informationen werden beibehalten

Die KI versteht über die `<prunable-tools>`-Liste, welche Tools getrimmt werden können, und wählt basierend auf dem Szenario das passende Tool. Schutzmechanismen stellen sicher, dass kritische Inhalte nicht versehentlich getrimmt werden.

Konfigurationspunkte:
- Tools aktivieren: `tools.discard.enabled` und `tools.extract.enabled`
- Extraktionsinhalt anzeigen: `tools.extract.showDistillation`
- Erinnerungsfrequenz anpassen: `tools.settings.nudgeFrequency`
- Kritische Tools und Dateien schützen: `protectedTools` und `protectedFilePatterns`

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Slash-Befehle verwenden](../commands/)**
>
> Sie werden lernen:
> - Verwendung von `/dcp context` zur Anzeige der Token-Verteilung der aktuellen Sitzung
> - Verwendung von `/dcp stats` zur Anzeige kumulativer Pruning-Statistiken
> - Verwendung von `/dcp sweep` zum manuellen Auslösen des Pruning

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie, um die Quellcode-Position anzuzeigen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | ---|
| discard-Tool-Definition | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L155-L180) | 155-180 |
| extract-Tool-Definition | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L183-L220) | 183-220 |
| Pruning-Operation-Ausführung | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L26-L153) | 26-153 |
| --- | --- | --- |
| Pruning-Kontext-Injektion | [`lib/messages/inject.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/inject.ts#L102-L156) | 102-156 |
| discard-Tool-Spezifikation | [`lib/prompts/discard-tool-spec.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/discard-tool-spec.ts#L1-L41) | 1-41 |
| extract-Tool-Spezifikation | [`lib/prompts/extract-tool-spec.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/extract-tool-spec.ts#L1-L48) | 1-48 |
| System-Prompt (beide) | [`lib/prompts/system/both.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/system/both.ts#L1-L60) | 1-60 |
| Erinnerungs-Prompt | [`lib/prompts/nudge/both.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/nudge/both.ts#L1-L10) | 1-10 |
| Konfigurationsdefinition | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L436-L449) | 436-449 |
| Standardmäßig geschützte Tools | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L438-L441) | 438-441 |

**Wichtige Konstanten**:
- `DISCARD_TOOL_DESCRIPTION`: Prompt-Beschreibung für discard-Tool
- `EXTRACT_TOOL_DESCRIPTION`: Prompt-Beschreibung für extract-Tool
- `DEFAULT_PROTECTED_TOOLS`: Liste der standardmäßig geschützten Tools

**Wichtige Funktionen**:
- `createDiscardTool(ctx)`: Erstellt discard-Tool
- `createExtractTool(ctx)`: Erstellt extract-Tool
- `executePruneOperation(ctx, toolCtx, ids, reason, toolName, distillation)`: Führt Pruning-Operation aus
- `buildPrunableToolsList(state, config, logger, messages)`: Generiert Liste trimmbarer Tools
- `insertPruneToolContext(state, config, logger, messages)`: Injiziert Pruning-Kontext

**Konfigurationspunkte**:
- `tools.discard.enabled`: Ob discard-Tool aktiviert ist (Standard: true)
- `tools.extract.enabled`: Ob extract-Tool aktiviert ist (Standard: true)
- `tools.extract.showDistillation`: Ob Extraktionsinhalt angezeigt wird (Standard: false)
- `tools.settings.nudgeEnabled`: Ob Erinnerungen aktiviert sind (Standard: true)
- `tools.settings.nudgeFrequency`: Erinnerungsfrequenz (Standard: 10)
- `tools.settings.protectedTools`: Liste geschützter Tools
- `protectedFilePatterns`: Glob-Muster für geschützte Dateien

</details>
