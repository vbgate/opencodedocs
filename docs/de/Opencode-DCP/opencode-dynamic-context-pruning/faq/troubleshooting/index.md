---
title: "FAQ: Fehlerbehebung | opencode-dcp"
sidebarTitle: "Was tun bei Problemen"
subtitle: "Häufige Fragen und Fehlerbehebung"
description: "Lernen Sie, wie Sie häufige Probleme bei der Verwendung von OpenCode DCP lösen, einschließlich Konfigurationsfehler, Debug-Methoden, Token-Reduktionsprobleme und andere Troubleshooting-Tipps."
tags:
  - "FAQ"
  - "Fehlerbehebung"
  - "Konfiguration"
  - "Debugging"
prerequisite:
  - "start-getting-started"
order: 1
---

# Häufige Fragen und Fehlerbehebung

## Konfigurationsbezogene Probleme

### Warum wird meine Konfiguration nicht wirksam?

DCP-Konfigurationsdateien werden nach Priorität zusammengeführt: **Standardwerte < Global < Umgebungsvariablen < Projekt**. Projektkonfiguration hat die höchste Priorität.

**Prüfschritte**:

1. **Konfigurationsdateipfad bestätigen**:
   ```bash
   # macOS/Linux
   ls -la ~/.config/opencode/dcp.jsonc
   ls -la ~/.config/opencode/dcp.json

   # Oder im Projektstammverzeichnis
   ls -la .opencode/dcp.jsonc
   ```

2. **Wirksame Konfiguration anzeigen**:
   Nach Aktivierung des Debug-Modus gibt DCP beim ersten Laden der Konfiguration Konfigurationsinformationen in die Log-Datei aus.

3. **OpenCode neu starten**:
   Nach Konfigurationsänderungen muss OpenCode neu gestartet werden, damit diese wirksam werden.

::: tip Konfigurationspriorität
Wenn Sie mehrere Konfigurationsdateien haben, überschreibt die Projektkonfiguration (`.opencode/dcp.jsonc`) die globale Konfiguration.
:::

### Was tun bei Konfigurationsdateifehlern?

DCP zeigt eine Toast-Warnung an (nach 7 Sekunden), wenn Konfigurationsfehler erkannt werden, und verwendet Standardwerte als Fallback.

**Häufige Fehlertypen**:

| Fehlertyp | Problembeschreibung | Lösung |
| --- | --- | --- |
| Typfehler | `pruneNotification` sollte `"off" | "minimal" | "detailed"` sein | Enum-Wert-Schreibweise prüfen |
| Array-Fehler | `protectedFilePatterns` muss ein String-Array sein | Sicherstellen, dass Format `["pattern1", "pattern2"]` verwendet wird |
| Unbekannter Schlüssel | Konfigurationsdatei enthält nicht unterstützte Schlüssel | Unbekannte Schlüssel löschen oder auskommentieren |

**Debug-Logs aktivieren für detaillierte Fehler**:

```jsonc
// ~/.config/opencode/dcp.jsonc
{
    "debug": true  // Debug-Logs aktivieren
}
```

Log-Dateipfad: `~/.config/opencode/logs/dcp/daily/YYYY-MM-DD.log`

---

## Funktionsbezogene Probleme

### Warum reduziert sich die Token-Nutzung nicht?

DCP pruned nur **Tool-Aufruf**-Inhalte. Wenn Ihr Gespräch keine Tools verwendet oder nur geschützte Tools verwendet, werden keine Token reduziert.

**Mögliche Ursachen**:

1. **Geschützte Tools**
   Standardmäßig geschützte Tools umfassen: `task`, `write`, `edit`, `batch`, `discard`, `extract`, `todowrite`, `todoread`, `plan_enter`, `plan_exit`

2. **Turn-Schutz noch nicht abgelaufen**
   Wenn `turnProtection` aktiviert ist, werden Tools innerhalb der Schutzperiode nicht geprunt.

3. **Keine wiederholten oder prunbaren Inhalte im Gespräch**
   Die automatische Strategie von DCP zielt nur auf:
   - Wiederholte Tool-Aufrufe (Deduplizierung)
   - Bereits gelesene und überschriebene Schreiboperationen (Supersede Writes)
   - Veraltete fehlerhafte Tool-Eingaben (Purge Errors)

**Prüfmethode**:

```bash
# In OpenCode eingeben
/dcp context
```

Sehen Sie sich das Feld `Pruned` in der Ausgabe an, um die Anzahl der geprunten Tools und eingesparten Token zu verstehen.

::: info Manuelles Pruning
Wenn die automatische Strategie nicht ausgelöst wird, können Sie `/dcp sweep` verwenden, um Tools manuell zu prunen.
:::

### Warum werden Sub-Agent-Sitzungen nicht geprunt?

**Dies ist beabsichtigtes Verhalten**. DCP ist in Sub-Agent-Sitzungen vollständig deaktiviert.

**Grund**: Das Designziel von Sub-Agents ist es, prägnante Zusammenfassungen der Erkenntnisse zurückzugeben, nicht die Token-Nutzung zu optimieren. Das Pruning von DCP könnte das Zusammenfassungsverhalten von Sub-Agents stören.

**Wie feststellen, ob es sich um eine Sub-Agent-Sitzung handelt**:
- Prüfen Sie das Feld `parentID` in den Sitzungsmetadaten
- Nach Aktivierung der Debug-Logs sehen Sie die Markierung `isSubAgent: true`

---

## Debugging und Logs

### Wie aktiviere ich Debug-Logs?

```jsonc
// ~/.config/opencode/dcp.jsonc
{
    "debug": true
}
```

**Log-Dateipfade**:
- **Tägliche Logs**: `~/.config/opencode/logs/dcp/daily/YYYY-MM-DD.log`
- **Kontext-Snapshots**: `~/.config/opencode/logs/dcp/context/{sessionId}/{timestamp}.json`

::: warning Leistungsauswirkung
Debug-Logs werden auf die Festplatte geschrieben und können die Leistung beeinträchtigen. In Produktionsumgebungen wird empfohlen, sie zu deaktivieren.
:::

### Wie zeige ich die Token-Verteilung der aktuellen Sitzung an?

```bash
# In OpenCode eingeben
/dcp context
```

**Ausgabebeispiel**:

```
╭───────────────────────────────────────────────────────────╮
│                  DCP Context Analysis                     │
╰───────────────────────────────────────────────────────────╯

Session Context Breakdown:
────────────────────────────────────────────────────────────

System         15.2% │████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  25.1K tokens
User            5.1% │████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│   8.4K tokens
Assistant       35.8% │██████████████████████████████████████▒▒▒▒▒▒▒│  59.2K tokens
Tools (45)      43.9% │████████████████████████████████████████████████│  72.6K tokens

────────────────────────────────────────────────────────────

Summary:
  Pruned:          12 tools (~15.2K tokens)
  Current context: ~165.3K tokens
  Without DCP:     ~180.5K tokens
```

### Wie zeige ich kumulative Pruning-Statistiken an?

```bash
# In OpenCode eingeben
/dcp stats
```

Dies zeigt die kumulativen geprunten Token über alle historischen Sitzungen hinweg an.

---

## Prompt Caching-bezogen

### Beeinflusst DCP das Prompt Caching?

**Ja**, aber nach Abwägung ist es normalerweise ein positiver Nettogewinn.

LLM-Anbieter (wie Anthropic, OpenAI) cachen Prompts basierend auf **exakter Präfix-Übereinstimmung**. Wenn DCP Tool-Ausgaben prunt, ändert sich der Nachrichteninhalt, wodurch der Cache ab diesem Punkt nach vorne ungültig wird.

**Tatsächliche Testergebnisse**:
- Ohne DCP: Cache-Trefferquote ca. 85%
- Mit DCP aktiviert: Cache-Trefferquote ca. 65%

**Aber Token-Einsparungen überwiegen normalerweise Cache-Verluste**, besonders in langen Gesprächen.

**Beste Anwendungsszenarien**:
- Bei Verwendung von Pay-per-Request-Diensten (wie GitHub Copilot, Google Antigravity) hat Cache-Verlust keine negativen Auswirkungen

---

## Erweiterte Konfiguration

### Wie schütze ich bestimmte Dateien vor Pruning?

Verwenden Sie `protectedFilePatterns`, um Glob-Muster zu konfigurieren:

```jsonc
{
    "protectedFilePatterns": [
        "src/config/*",     // config-Verzeichnis schützen
        "*.env",           // Alle .env-Dateien schützen
        "**/secrets/**"    // secrets-Verzeichnis schützen
    ]
}
```

Muster gleichen das Feld `filePath` in Tool-Argumenten ab (wie `read`, `write`, `edit` Tools).

### Wie passe ich geschützte Tools an?

Jede Strategie und Tool-Konfiguration hat ein `protectedTools`-Array:

```jsonc
{
    "strategies": {
        "deduplication": {
            "enabled": true,
            "protectedTools": ["custom_tool"]  // Zusätzlich geschützte Tools
        }
    },
    "tools": {
        "settings": {
            "protectedTools": ["another_tool"]
        }
    },
    "commands": {
        "protectedTools": ["sweep_protected"]
    }
}
```

Diese Konfigurationen werden zur Standard-Liste geschützter Tools **hinzugefügt**.

---

## Häufige Fehlerszenarien

### Fehler: DCP nicht geladen

**Mögliche Ursachen**:
1. Plugin nicht in `opencode.jsonc` registriert
2. Plugin-Installation fehlgeschlagen
3. OpenCode-Version nicht kompatibel

**Lösung**:
1. Prüfen Sie, ob `opencode.jsonc` `"plugin": ["@tarquinen/opencode-dcp@latest"]` enthält
2. OpenCode neu starten
3. Log-Dateien prüfen, um Ladestatus zu bestätigen

### Fehler: Konfigurationsdatei ungültiges JSON

**Mögliche Ursachen**:
- Fehlendes Komma
- Überflüssiges Komma
- String nicht in doppelten Anführungszeichen
- JSONC-Kommentarformat falsch

**Lösung**:
Verwenden Sie einen Editor, der JSONC unterstützt (wie VS Code), oder verwenden Sie ein Online-JSON-Validierungstool zur Syntaxprüfung.

### Fehler: /dcp-Befehl reagiert nicht

**Mögliche Ursachen**:
- `commands.enabled` auf `false` gesetzt
- Plugin nicht korrekt geladen

**Lösung**:
1. Prüfen Sie, ob `"commands.enabled"` in der Konfigurationsdatei auf `true` steht
2. Bestätigen Sie, dass das Plugin geladen wurde (Logs prüfen)

---

## Hilfe erhalten

Wenn die obigen Methoden das Problem nicht lösen:

1. **Debug-Logs aktivieren** und Problem reproduzieren
2. **Kontext-Snapshots anzeigen**: `~/.config/opencode/logs/dcp/context/{sessionId}/`
3. **Issue auf GitHub erstellen**:
   - Log-Dateien anhängen (sensible Informationen entfernen)
   - Reproduktionsschritte beschreiben
   - Erwartetes und tatsächliches Verhalten erklären

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[DCP Best Practices](../best-practices/)**.
>
> Sie werden lernen:
> - Trade-off zwischen Prompt Caching und Token-Einsparung
> - Konfigurationsprioritätsregeln und Nutzungsstrategien
> - Auswahl und Konfiguration von Schutzmechanismen
> - Tipps zur Befehlsverwendung und Optimierungsempfehlungen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Aufklappen der Quellcode-Positionen</strong></summary>

> Aktualisierungszeit: 2026-01-23

| Funktion | Dateipfad | Zeilennummer |
| --- | --- | --- |
| Konfigurationsvalidierung | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L147-375) | 147-375 |
| Konfigurationsfehlerbehandlung | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L391-421) | 391-421 |
| Log-System | [`lib/logger.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/logger.ts#L6-109) | 6-109 |
| Kontext-Snapshot | [`lib/logger.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/logger.ts#L196-210) | 196-210 |
| Sub-Agent-Erkennung | [`lib/state/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/utils.ts#L1-8) | 1-8 |
| Geschützte Tools | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-79) | 68-79 |

**Wichtige Funktionen**:
- `validateConfigTypes()`: Konfigurationselementtypen validieren
- `getInvalidConfigKeys()`: Unbekannte Schlüssel in Konfigurationsdatei erkennen
- `Logger.saveContext()`: Kontext-Snapshot für Debugging speichern
- `isSubAgentSession()`: Sub-Agent-Sitzung erkennen

</details>
