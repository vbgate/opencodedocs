---
title: "Best Practices: Konfiguration | opencode-dynamic-context-pruning"
subtitle: "Best Practices: Konfiguration"
sidebarTitle: "40% Token sparen"
description: "Lerne die Best Practices für DCP-Konfiguration. Beherrsche Strategieauswahl, Turn-Schutz, Tool-Schutz und Benachrichtigungsmodus-Konfiguration zur Token-Optimierung."
tags:
  - "Best Practices"
  - "Token-Einsparung"
  - "Konfiguration"
  - "Optimierung"
prerequisite:
  - "start-configuration"
  - "platforms-auto-pruning"
order: 2
---

# DCP Best Practices

## Was du nach diesem Tutorial kannst

- Verstehe den Trade-off zwischen Prompt Caching und Token-Einsparung
- Wähle die passende Schutzstrategie für dich (Turn-Schutz, geschützte Tools, Dateimuster)
- Verwende Befehle zur manuellen Token-Optimierung
- Passe die DCP-Konfiguration an deine Projektanforderungen an

## Prompt Caching Trade-off

### Verstehe den Kompromiss zwischen Caching und Pruning

DCP-Pruning-Tools ändern den Nachrichteninhalt bei der Ausgabe, was dazu führt, dass das auf **exakter Präfix-Matchierung** basierende Prompt Caching ab diesem Punkt nach vorne hin ungültig wird.

**Testdaten-Vergleich**:

| Szenario | Cache-Trefferquote | Token-Einsparung | Gesamtnutzen |
| --- | --- | --- | --- |
| Ohne DCP | ~85% | 0% | Baseline |
| Mit DCP | ~65% | 20-40% | ✅ Positiv |

### Wann du Cache-Verluste ignorieren solltest

**Empfohlene Szenarien für DCP**:

- ✅ **Lange Gespräche** (über 20 Runden): Kontextinflation ist signifikant, Token-Einsparung überwiegt Cache-Verlust
- ✅ **Pay-per-Request-Dienste**: GitHub Copilot, Google Antigravity – Cache-Verlust hat keine negativen Auswirkungen
- ✅ **Intensive Tool-Aufrufe**: Häufige Dateilesevorgänge, Suchausführungen usw.
- ✅ **Code-Refactoring-Aufgaben**: Häufige Szenarien mit wiederholten Dateilesevorgängen

**Szenarien, in denen du DCP möglicherweise deaktivieren solltest**:

- ⚠️ **Kurze Gespräche** (< 10 Runden): Pruning-Nutzen ist begrenzt, Cache-Verlust könnte deutlicher sein
- ⚠️ **Cache-sensitive Aufgaben**: Szenarien, die maximale Cache-Trefferquoten erfordern (z.B. Batch-Verarbeitung)

::: tip Flexible Konfiguration
Du kannst die DCP-Konfiguration dynamisch an Projektanforderungen anpassen, sogar bestimmte Strategien auf Projektebene deaktivieren.
:::

---

## Best Practices für Konfigurationspriorität

### Richtige Verwendung mehrerer Konfigurationsebenen

DCP-Konfigurationen werden nach folgender Priorität zusammengeführt:

```
Standardwerte < Globale Konfiguration < Benutzerdefinierte Konfiguration < Projektkonfiguration
```

::: info Konfigurationsverzeichnis-Erklärung
Das "benutzerdefinierte Konfigurationsverzeichnis" wird durch Setzen der Umgebungsvariablen `$OPENCODE_CONFIG_DIR` angegeben. In diesem Verzeichnis muss eine `dcp.jsonc` oder `dcp.json` Datei platziert werden.
:::

### Empfohlene Konfigurationsstrategien

| Szenario | Empfohlener Konfigurationsort | Beispielkonfigurationsschwerpunkt |
| --- | --- | --- |
| **Persönliche Entwicklungsumgebung** | Globale Konfiguration | Automatische Strategien aktivieren, Debug-Logs deaktivieren |
| **Teamarbeitsprojekte** | Projektkonfiguration | Projektspezifische geschützte Dateien, Strategie-Schalter |
| **CI/CD-Umgebung** | Benutzerdefinierte Konfigurationsverzeichnis | Benachrichtigungen deaktivieren, Debug-Logs aktivieren |
| **Temporäres Debugging** | Projektkonfiguration | `debug` aktivieren, detaillierter Benachrichtigungsmodus |

**Beispiel: Projekt-Level-Konfiguration überschreiben**

```jsonc
// ~/.config/opencode/dcp.jsonc (Globale Konfiguration)
{
    "enabled": true,
    "strategies": {
        "deduplication": {
            "enabled": true
        }
    }
}
```

```jsonc
// .opencode/dcp.jsonc (Projektkonfiguration)
{
    "strategies": {
        // Projekt-Level-Überschreibung: Deduplizierung deaktivieren (z.B. wenn Projekt historischen Kontext behalten muss)
        "deduplication": {
            "enabled": false
        }
    }
}
```

::: warning Konfiguration nach Änderung neu starten
Nach Konfigurationsänderungen musst du OpenCode neu starten, damit sie wirksam werden.
:::

---

## Schutzstrategie-Auswahl

### Verwendung von Turn-Schutz

**Turn-Schutz** verhindert, dass Tools innerhalb einer bestimmten Anzahl von Runden geprunt werden, sodass die KI genügend Zeit hat, auf die neuesten Inhalte zu verweisen.

**Empfohlene Einstellungen**:

| Szenario | Empfohlener Wert | Grund |
| --- | --- | --- |
| **Komplexe Problemlösung** | 4-6 Runden | KI benötigt mehrere Iterationen zur Tool-Ausgabeanalyse |
| **Code-Refactoring** | 2-3 Runden | Kontextwechsel ist schnell, zu langer Schutzzeitraum beeinträchtigt die Wirkung |
| **Schnelle Prototypentwicklung** | 2-4 Runden | Balance zwischen Schutz und Token-Einsparung |
| **Standardkonfiguration** | 4 Runden | Getesteter平衡spunkt |

**Wann Turn-Schutz aktivieren**:

```jsonc
{
    "turnProtection": {
        "enabled": true,   // Turn-Schutz aktivieren
        "turns": 6        // 6 Runden schützen (für komplexe Aufgaben geeignet)
    }
}
```

**Wann nicht empfohlen zu aktivieren**:

- Einfache Frage-Antwort-Szenarien (KI antwortet direkt, benötigt keine Tools)
- Hochfrequente kurze Gespräche (zu langer Schutzzeitraum führt zu verspätetem Pruning)

### Konfiguration geschützter Tools

**Standardmäßig geschützte Tools** (keine zusätzliche Konfiguration erforderlich):
- `task`, `write`, `edit`, `batch`, `discard`, `extract`, `todowrite`, `todoread`, `plan_enter`, `plan_exit`

::: warning Schema-Standardwerte-Erklärung
Wenn du die automatische Vervollständigung deiner IDE verwendest, zeigt die Schema-Datei (`dcp.schema.json`) möglicherweise nicht die vollständige Liste der standardmäßig geschützten Tools. Maßgeblich ist die Quelle `DEFAULT_PROTECTED_TOOLS`, die alle 10 Tools enthält.
:::

**Wann zusätzliche geschützte Tools hinzufügen**:

| Szenario | Beispielkonfiguration | Grund |
| --- | --- | --- |
| **Kritische Geschäftstools** | `protectedTools: ["critical_tool"]` | Sicherstellen, dass kritische Operationen immer sichtbar sind |
| **Tools, die historischen Kontext benötigen** | `protectedTools: ["analyze_history"]` | Vollständige Historie für Analysen behalten |
| **Benutzerdefinierte Aufgaben-Tools** | `protectedTools: ["custom_task"]` | Workflows benutzerdefinierter Aufgaben schützen |

```jsonc
{
    "strategies": {
        "deduplication": {
            "enabled": true,
            "protectedTools": ["custom_analyze"]  // Bestimmte Tools zusätzlich schützen
        }
    },
    "tools": {
        "settings": {
            "protectedTools": ["important_check"]  // Zusätzlicher LLM-Tool-Schutz
        }
    }
}
```

### Verwendung geschützter Dateimuster

**Empfohlene Schutzmuster**:

| Dateityp | Empfohlenes Muster | Schutzgrund |
| --- | --- | --- |
| **Konfigurationsdateien** | `"*.env"`, `".env*"` | Verhindern, dass sensible Informationen geprunt werden |
| **Datenbankkonfiguration** | `"**/config/database/*"` | Sicherstellen, dass Datenbankverbindungskonfiguration immer verfügbar ist |
| **Schlüsseldateien** | `"**/secrets/**"` | Alle Schlüssel und Zertifikate schützen |
| **Kerngeschäftslogik** | `"src/core/*"` | Verhindern, dass kritische Code-Kontexte verloren gehen |

```jsonc
{
    "protectedFilePatterns": [
        "*.env",                // Alle Umgebungsvariablendateien schützen
        ".env.*",              // Einschließlich .env.local usw.
        "**/secrets/**",       // secrets-Verzeichnis schützen
        "**/config/*.json",    // Konfigurationsdateien schützen
        "src/auth/**"          // Authentifizierungsbezogenen Code schützen
    ]
}
```

::: tip Musterabgleichsregeln
`protectedFilePatterns` gleicht das `filePath`-Feld in Tool-Argumenten ab (z.B. `read`, `write`, `edit` Tools).
:::

---

## Auswahl automatischer Strategien

### Deduplizierungsstrategie (Deduplication)

**Standardmäßig aktiviert**, für die meisten Szenarien geeignet.

**Anwendbare Szenarien**:
- Wiederholtes Lesen derselben Datei (z.B. Code-Review, mehrfaches Debugging)
- Ausführung derselben Such- oder Analysebefehle

**Wann nicht empfohlen zu aktivieren**:
- Beibehalten der genauen Ausgabe jedes Aufrufs (z.B. Leistungsüberwachung)
- Tool-Ausgabe enthält Zeitstempel oder Zufallswerte (jeder Aufruf ist unterschiedlich)

### Überschreibungsstrategie (Supersede Writes)

**Standardmäßig deaktiviert**, muss je nach Projektanforderungen entschieden werden.

**Empfohlene Aktivierungsszenarien**:
- Dateiänderungen werden sofort zur Überprüfung gelesen (Refactoring, Batch-Verarbeitung)
- Schreiboperationen sind sehr groß, Lesen würde ihren Wert überschreiben

```jsonc
{
    "strategies": {
        "supersedeWrites": {
            "enabled": true  // Überschreibungsstrategie aktivieren
        }
    }
}
```

**Wann nicht empfohlen zu aktivieren**:
- Verfolgen der Dateiänderungshistorie (Code-Audit)
- Schreiboperationen enthalten wichtige Metadaten (z.B. Änderungsgrund)

### Fehlerbereinigungsstrategie (Purge Errors)

**Standardmäßig aktiviert**, empfohlen, aktiviert zu bleiben.

**Konfigurationsempfehlungen**:

| Szenario | Empfohlener Wert | Grund |
| --- | --- | --- |
| **Standardkonfiguration** | 4 Runden | Getesteter平衡spunkt |
| **Schnelles-Fehlgeschlagen-Szenarien** | 2 Runden | Fehlerinput so früh wie möglich bereinigen, Kontextverschmutzung reduzieren |
| **Fehlerhistorie benötigt** | 6-8 Runden | Mehr Fehlerinformationen für Debugging behalten |

```jsonc
{
    "strategies": {
        "purgeErrors": {
            "enabled": true,
            "turns": 2  // Schnelles-Fehlgeschlagen-Szenario: Fehlerinput nach 2 Runden bereinigen
        }
    }
}
```

---

## Best Practices für LLM-gesteuerte Tools

### Optimierung der Erinnerungsfunktion

DCP erinnert die KI standardmäßig alle 10 Tool-Aufrufe daran, das Pruning-Tool zu verwenden.

**Empfohlene Konfiguration**:

| Szenario | nudgeFrequency | Wirkung |
| --- | --- | --- |
| **Intensive Tool-Aufrufe** | 8-12 | KI rechtzeitig zum Aufräumen erinnern |
| **Niedrigfrequente Tool-Aufrufe** | 15-20 | Erinnerungsstörungen reduzieren |
| **Erinnerungen deaktivieren** | Infinity | Vollständig auf KI-Autonomie verlassen |

```jsonc
{
    "tools": {
        "settings": {
            "nudgeEnabled": true,
            "nudgeFrequency": 15  // Niedrigfrequente Szenarien: Nach 15 Tool-Aufrufen erinnern
        }
    }
}
```

### Verwendung des Extract-Tools

**Wann Extract verwenden**:
- Tool-Ausgabe enthält wichtige Erkenntnisse oder Daten, Zusammenfassung muss behalten werden
- Originalausgabe ist groß, aber extrahierte Informationen reichen für nachfolgende Schlussfolgerungen aus

**Konfigurationsempfehlungen**:

```jsonc
{
    "tools": {
        "extract": {
            "enabled": true,
            "showDistillation": false  // Standardmäßig keine Extraktionsinhalte anzeigen (weniger Störungen)
        }
    }
}
```

**Wann `showDistillation` aktivieren**:
- Anzeigen möchten, welche wichtigen Informationen die KI extrahiert hat
- Debugging oder Verifizieren des Extract-Tool-Verhaltens

### Verwendung des Discard-Tools

**Wann Discard verwenden**:
- Tool-Ausgabe ist nur temporärer Status oder Rauschen
- Nach Aufgabenabschluss muss Tool-Ausgabe nicht behalten werden

**Konfigurationsempfehlungen**:

```jsonc
{
    "tools": {
        "discard": {
            "enabled": true
        }
    }
}
```

---

## Tipps zur Befehlsverwendung

### Wann `/dcp context` verwenden

**Empfohlene Verwendungsszenarien**:
- Token-Nutzung异常vermuten
- Kontextverteilung der aktuellen Sitzung verstehen müssen
- Pruning-Effekt von DCP bewerten

**Best Practices**:
- In der Mitte eines langen Gesprächs einmal prüfen, um Kontextzusammensetzung zu verstehen
- Am Ende des Gesprächs prüfen, um Gesamt-Token-Verbrauch zu sehen

### Wann `/dcp stats` verwenden

**Empfohlene Verwendungsszenarien**:
- Langfristigen Token-Einsparungseffekt verstehen müssen
- Gesamtwert von DCP bewerten
- Einsparungseffekte verschiedener Konfigurationen vergleichen

**Best Practices**:
- Wöchentlich kumulierte Statistiken ansehen
- Vor- und Nachher-Effekte nach Konfigurationsoptimierung vergleichen

### Wann `/dcp sweep` verwenden

**Empfohlene Verwendungsszenarien**:
- Kontext zu groß导致响应变慢
- Token-Verbrauch sofort reduzieren müssen
- Automatische Strategie hat kein Pruning ausgelöst

**Verwendungstipps**:

| Befehl | Verwendungszweck |
| --- | --- |
| `/dcp sweep` | Alle Tools nach der letzten Benutzernachricht prunen |
| `/dcp sweep 10` | Nur die letzten 10 Tools prunen |
| `/dcp sweep 5` | Nur die letzten 5 Tools prunen |

**Empfohlener Workflow**:
1. Zuerst `/dcp context` verwenden, um aktuellen Status zu sehen
2. Je nach Situation Pruning-Anzahl entscheiden
3. `/dcp sweep N` zum Ausführen des Pruning verwenden
4. Erneut `/dcp context` verwenden, um Effekt zu bestätigen

---

## Auswahl des Benachrichtigungsmodus

### Vergleich der drei Benachrichtigungsmodi

| Modus | Angezeigter Inhalt | Anwendbare Szenarien |
| --- | --- | --- |
| **off** | Keine Benachrichtigungen anzeigen | Arbeitsumgebung ohne Störungen |
| **minimal** | Nur Pruning-Anzahl und Token-Einsparung anzeigen | Effekt verstehen müssen, aber nicht auf Details achten |
| **detailed** | Jedes gepaarte Tool und Grund anzeigen (Standard) | Debugging oder Szenarien, die detaillierte Überwachung erfordern |

### Empfohlene Konfiguration

| Szenario | Empfohlener Modus | Grund |
| --- | --- | --- |
| **Tägliche Entwicklung** | minimal | Auf Effekt fokussiert, Störungen reduzieren |
| **Debugging-Probleme** | detailed | Grund jedes Pruning-Vorgangs sehen |
| **Demonstration oder Demo-Aufnahme** | off | Benachrichtigungen stören Demo-Flow vermeiden |

```jsonc
{
    "pruneNotification": "minimal"  // Für tägliche Entwicklung empfohlen
}
```

---

## Umgang mit Sub-Agent-Szenarien

### Verstehe Sub-Agent-Beschränkungen

**DCP ist in Sub-Agent-Sitzungen vollständig deaktiviert**.

**Grund**:
- Das Ziel von Sub-Agents ist eine prägnante Zusammenfassung der Erkenntnisse zurückzugeben
- Das Pruning von DCP kann das Zusammenfassungsverhalten von Sub-Agents stören
- Sub-Agents führen normalerweise kurz aus, Kontextinflation ist begrenzt

### Wie feststellen, ob es sich um eine Sub-Agent-Sitzung handelt

1. **Debug-Logs aktivieren**:
   ```jsonc
   {
       "debug": true
   }
   ```

2. **Logs ansehen**:
   Logs zeigen `isSubAgent: true` Markierung

### Token-Optimierungstipps für Sub-Agents

Obwohl DCP in Sub-Agents deaktiviert ist, kannst du immer noch:

- Prompt des Sub-Agents optimieren, Ausgabelänge reduzieren
- Tool-Aufrufbereich des Sub-Agents einschränken
- `max_length`-Parameter des `task`-Tools verwenden, um Ausgabe zu kontrollieren

---

## Zusammenfassung dieser Lektion

| Best-Practice-Bereich | Kernempfehlung |
| --- | --- |
| **Prompt Caching** | Token-Einsparung übertrifft normalerweise Cache-Verlust in langen Gesprächen |
| **Konfigurationspriorität** | Globale Konfiguration für allgemeine Einstellungen, Projektkonfiguration für spezifische Anforderungen |
| **Turn-Schutz** | Komplexe Aufgaben 4-6 Runden, schnelle Aufgaben 2-3 Runden |
| **Geschützte Tools** | Standard-Schutz ist ausreichend, kritische Geschäftstools nach Bedarf hinzufügen |
| **Geschützte Dateien** | Konfigurationen, Schlüssel, Kerngeschäftslogik-Dateien schützen |
| **Automatische Strategien** | Deduplizierung und Fehlerbereinigung standardmäßig aktiviert, Überschreibung nach Bedarf aktivieren |
| **LLM-Tools** | Erinnerungsfrequenz 10-15 Mal, Extraktion bei Debugging anzeigen |
| **Befehlsverwendung** | Regelmäßig Kontext prüfen, bei Bedarf manuell prunen |
| **Benachrichtigungsmodus** | Tägliche Entwicklung mit minimal, Debugging mit detailed |

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Aufklappen der Quellcode-Positionen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Konfigurationszusammenführung | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L691-794) | 691-794 |
| Konfigurationsvalidierung | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L147-375) | 147-375 |
| Standardkonfiguration | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-134) | 68-134 |
| Turn-Schutz | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L432-437) | 432-437 |
| Geschützte Tools | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-79) | 68-79 |
| Geschützte Dateimuster | [`protected-file-patterns.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/protected-file-patterns.ts#L1-60) | 1-60 |
| Sub-Agent-Erkennung | [`lib/state/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/utils.ts#L1-8) | 1-8 |
| Erinnerungsfunktion | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L438-441) | 438-441 |

**Wichtige Konstanten**:
- `MAX_TOOL_CACHE_SIZE = 1000`: Maximale Anzahl von Tool-Cache-Einträgen
- `turnProtection.turns`: Standardmäßig 4 Runden Schutz

**Wichtige Funktionen**:
- `getConfig()`: Mehrschichtige Konfiguration laden und zusammenführen
- `validateConfigTypes()`: Konfigurationstypen validieren
- `mergeConfig()`: Konfiguration nach Priorität zusammenführen
- `isSubAgentSession()`: Sub-Agent-Sitzung erkennen

</details>
