---
title: "Installation: Schnellstart in 5 Minuten | opencode-dcp"
sidebarTitle: "In 5 Minuten starten"
subtitle: "Installation: Schnellstart in 5 Minuten"
description: "Lernen Sie die Installation des DCP-Plugins kennen. Richten Sie alles in 5 Minuten ein, reduzieren Sie Token-Verbrauch bei langen Konversationen durch automatische Bereinigung und verbessern Sie die KI-Antwortqualität."
tags:
  - "Installation"
  - "Schnellstart"
  - "DCP"
prerequisite:
  - "OpenCode ist installiert"
order: 1
---

# Installation und Schnellstart

## Was Sie nach diesem Tutorial können

- ✅ DCP-Plugin in 5 Minuten installieren
- ✅ Plugin konfigurieren und erfolgreiche Installation verifizieren
- ✅ Die erste automatische Bereinigung in Aktion sehen

## Ihre aktuelle Situation

Bei längerer Nutzung von OpenCode werden die Konversationen immer länger:
- Die KI liest dieselbe Datei mehrmals
- Fehlermeldungen von Tool-Aufrufen füllen den Kontext
- Jede Konversation verbraucht eine große Menge an Token
- **Je länger die Konversation, desto langsamer die KI-Antworten**

Sie möchten redundante Inhalte in der Konversation automatisch bereinigen, ohne manuell eingreifen zu müssen.

## Kernkonzept

**DCP (Dynamic Context Pruning)** ist ein OpenCode-Plugin, das redundante Tool-Aufrufe aus dem Konversationsverlauf automatisch entfernt und so den Token-Verbrauch reduziert.

So funktioniert es:
1. **Automatische Erkennung**: Vor jedem Nachrichtenversand wird der Konversationsverlauf automatisch analysiert
2. **Intelligente Bereinigung**: Entfernt wiederholte Tool-Aufrufe, veraltete Fehler und überschriebene Schreibvorgänge
3. **KI-gesteuert**: Die KI kann aktiv die Tools `discard` und `extract` aufrufen, um den Kontext zu optimieren
4. **Transparent und kontrollierbar**: Über den Befehl `/dcp` können Bereinigungsstatistiken eingesehen und manuelle Bereinigungen ausgelöst werden

::: tip Kernvorteile
- **Kostenlos**: Automatische Strategien erfordern keine LLM-Aufrufe
- **Keine Konfiguration**: Sofort einsatzbereit, die Standardkonfiguration ist bereits optimiert
- **Risikofrei**: Es wird nur der an die LLM gesendete Kontext geändert, der Konversationsverlauf bleibt unberührt
:::

## 🎒 Vorbereitung

Bevor Sie mit der Installation beginnen, prüfen Sie bitte:

- [ ] **OpenCode** ist installiert (unterstützt Plugin-Funktion)
- [ ] Sie wissen, wie Sie die **OpenCode-Konfigurationsdatei** bearbeiten
- [ ] Sie verstehen die Grundlagen der **JSONC-Syntax** (JSON mit Kommentaren)

::: warning Wichtiger Hinweis
DCP ändert den an die LLM gesendeten Kontext, beeinflusst jedoch nicht Ihren Konversationsverlauf. Sie können das Plugin jederzeit in der Konfiguration deaktivieren.
:::

## Schritt für Schritt

### Schritt 1: OpenCode-Konfigurationsdatei bearbeiten

**Warum**
Sie müssen das DCP-Plugin in der OpenCode-Konfiguration deklarieren, damit es beim Start automatisch geladen wird.

Öffnen Sie Ihre OpenCode-Konfigurationsdatei `opencode.jsonc` und fügen Sie DCP im Feld `plugin` hinzu:

```jsonc
// opencode.jsonc
{
    "plugin": ["@tarquinen/opencode-dcp@latest"],
}
```

**Sie sollten sehen**: Die Konfigurationsdatei enthält möglicherweise bereits andere Plugins (falls vorhanden). Fügen Sie DCP einfach am Ende des Arrays hinzu.

::: info Hinweis
Mit dem Tag `@latest` prüft OpenCode bei jedem Start automatisch auf die neueste Version.
:::

### Schritt 2: OpenCode neu starten

**Warum**
Nach Änderungen an der Plugin-Konfiguration ist ein Neustart erforderlich, damit diese wirksam werden.

Schließen Sie OpenCode vollständig und starten Sie es neu.

**Sie sollten sehen**: OpenCode startet normal ohne Fehlermeldungen.

### Schritt 3: Plugin-Installation verifizieren

**Warum**
Bestätigen Sie, dass das DCP-Plugin korrekt geladen wurde, und sehen Sie sich die Standardkonfiguration an.

Geben Sie in der OpenCode-Konversation ein:

```
/dcp
```

**Sie sollten sehen**: Die DCP-Befehlshilfe, die anzeigt, dass das Plugin erfolgreich installiert wurde.

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Commands                         │
╰───────────────────────────────────────────────────────────╯

  /dcp context      Show token usage breakdown for current session
  /dcp stats        Show DCP pruning statistics
  /dcp sweep [n]    Prune tools since last user message, or last n tools
```

### Schritt 4: Standardkonfiguration anzeigen

**Warum**
Verstehen Sie die DCP-Standardkonfiguration und prüfen Sie, ob das Plugin wie erwartet funktioniert.

DCP erstellt beim ersten Start automatisch eine Konfigurationsdatei:

```bash
# Globale Konfigurationsdatei anzeigen
cat ~/.config/opencode/dcp.jsonc
```

**Sie sollten sehen**: Die Konfigurationsdatei wurde erstellt und enthält initial nur das Feld `$schema`:

```jsonc
{
    "$schema": "https://raw.githubusercontent.com/Opencode-DCP/opencode-dynamic-context-pruning/master/dcp.schema.json"
}
```

Die Konfigurationsdatei enthält initial nur das `$schema`-Feld. Alle anderen Konfigurationselemente verwenden die Standardwerte aus dem Code und können ohne manuelle Konfiguration genutzt werden.

::: tip Erklärung der Standardkonfiguration
Die Standardwerte von DCP im Code sind wie folgt (müssen nicht in die Konfigurationsdatei geschrieben werden):

- **deduplication**: Automatische Deduplizierung, entfernt wiederholte Tool-Aufrufe
- **purgeErrors**: Automatische Bereinigung von Fehler-Tool-Eingaben vor 4 Runden
- **discard/extract**: Von der KI aufrufbare Bereinigungstools
- **pruneNotification**: Detaillierte Bereinigungsbenachrichtigungen anzeigen

Wenn Sie eine benutzerdefinierte Konfiguration benötigen, können Sie diese Felder manuell hinzufügen. Detaillierte Konfigurationsanweisungen finden Sie unter [Konfiguration im Detail](../configuration/).
:::

### Schritt 5: Automatische Bereinigung erleben

**Warum**
DCP in der Praxis nutzen und die automatische Bereinigung in Aktion sehen.

Führen Sie in OpenCode eine Konversation, bei der die KI dieselbe Datei mehrmals liest oder einige fehlgeschlagene Tool-Aufrufe ausführt.

**Sie sollten sehen**:

1. Bei jedem Nachrichtenversand analysiert DCP automatisch den Konversationsverlauf
2. Bei wiederholten Tool-Aufrufen bereinigt DCP automatisch
3. Nach der KI-Antwort sehen Sie möglicherweise eine Bereinigungsbenachrichtigung (abhängig von der `pruneNotification`-Konfiguration)

Beispiel einer Bereinigungsbenachrichtigung:

```
▣ DCP | ~12.5K tokens saved total

▣ Pruning (~12.5K tokens)
→ read: src/config.ts
→ write: package.json
```

Geben Sie `/dcp context` ein, um die aktuelle Token-Nutzung der Sitzung anzuzeigen:

```
Session Context Breakdown:
──────────────────────────────────────────────────────────

System         15.2% │████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  25.1K tokens
User            5.1% │████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│   8.4K tokens
Assistant       35.8% │██████████████████████████████████████▒▒▒▒▒▒▒│  59.2K tokens
Tools (45)      43.9% │████████████████████████████████████████████████│  72.6K tokens

──────────────────────────────────────────────────────────

Summary:
  Pruned:          12 tools (~15.2K tokens)
  Current context: ~165.3K tokens
  Without DCP:     ~180.5K tokens
```

## Checkpoint ✅

Nach Abschluss der obigen Schritte sollten Sie:

- [ ] DCP-Plugin in `opencode.jsonc` hinzugefügt haben
- [ ] OpenCode nach dem Neustart normal ausführen können
- [ ] `/dcp`-Befehl zeigt Hilfeinformationen an
- [ ] Konfigurationsdatei `~/.config/opencode/dcp.jsonc` wurde erstellt
- [ ] Bereinigungsbenachrichtigungen in der Konversation sehen oder Bereinigungsstatistiken über `/dcp context` einsehen können

**Falls ein Schritt fehlschlägt**:
- Prüfen Sie, ob die Syntax von `opencode.jsonc` korrekt ist (JSONC-Format)
- Sehen Sie sich die OpenCode-Logs auf Plugin-Ladefehler an
- Stellen Sie sicher, dass die OpenCode-Version Plugin-Funktionen unterstützt

## Fehlerbehebung

### Problem 1: Plugin nicht aktiv

**Symptom**: Konfiguration hinzugefügt, aber keine Bereinigungseffekte sichtbar

**Ursache**: OpenCode wurde nicht neu gestartet oder falscher Konfigurationsdateipfad

**Lösung**:
1. OpenCode vollständig schließen und neu starten
2. Prüfen Sie, ob der Pfad von `opencode.jsonc` korrekt ist
3. Logs anzeigen: Log-Dateien im Verzeichnis `~/.config/opencode/logs/dcp/daily/`

### Problem 2: Konfigurationsdatei nicht erstellt

**Symptom**: `~/.config/opencode/dcp.jsonc` existiert nicht

**Ursache**: OpenCode hat das DCP-Plugin nicht aufgerufen oder Berechtigungsprobleme im Konfigurationsverzeichnis

**Lösung**:
1. Stellen Sie sicher, dass OpenCode neu gestartet wurde
2. Konfigurationsverzeichnis manuell erstellen: `mkdir -p ~/.config/opencode`
3. Prüfen Sie in `opencode.jsonc`, ob der Plugin-Name korrekt ist: `@tarquinen/opencode-dcp@latest`

### Problem 3: Bereinigungsbenachrichtigungen werden nicht angezeigt

**Symptom**: Keine Bereinigungsbenachrichtigungen gesehen, aber `/dcp stats` zeigt Bereinigungen an

**Ursache**: `pruneNotification` ist auf `"off"` oder `"minimal"` konfiguriert

**Lösung**: Konfigurationsdatei bearbeiten:
```jsonc
"pruneNotification": "detailed"  // oder "minimal"
```

## Zusammenfassung

Die Installation des DCP-Plugins ist sehr einfach:
1. Plugin in `opencode.jsonc` hinzufügen
2. OpenCode neu starten
3. Installation mit `/dcp`-Befehl verifizieren
4. Standardkonfiguration kann sofort genutzt werden, keine weiteren Anpassungen nötig

**Standardmäßig aktivierte DCP-Funktionen**:
- ✅ Automatische Deduplizierungsstrategie (entfernt wiederholte Tool-Aufrufe)
- ✅ Fehlerbereinigungsstrategie (bereinigt veraltete Fehlereingaben)
- ✅ KI-gesteuerte Tools (`discard` und `extract`)
- ✅ Detaillierte Bereinigungsbenachrichtigungen

**Nächster Schritt**: Erfahren Sie, wie Sie die Konfiguration anpassen und Bereinigungsstrategien für verschiedene Szenarien anpassen können.

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Konfiguration im Detail](../configuration/)**
>
> Sie werden lernen:
> - Mehrstufiges Konfigurationssystem (global, Umgebungsvariablen, projektbezogen)
> - Funktion und empfohlene Einstellungen aller Konfigurationselemente
> - Rundenschutz, geschützte Tools, geschützte Dateimuster
> - Wie verschiedene Bereinigungsstrategien aktiviert/deaktiviert werden

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-23

| Funktion        | Dateipfad                                                                                    | Zeilen    |
| --- | --- | --- |
| Plugin-Einstieg    | [`index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/index.ts) | 12-102  |
| Konfigurationsverwaltung    | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 669-794 |
| Befehlsverarbeitung    | [`lib/commands/help.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/help.ts) | 1-40    |
| Token-Berechnung  | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 68-174  |

**Wichtige Konstanten**:
- `MAX_TOOL_CACHE_SIZE = 1000`: Maximale Anzahl von Einträgen im Tool-Cache

**Wichtige Funktionen**:
- `Plugin()`: Plugin-Registrierung und Hook-Einrichtung
- `getConfig()`: Laden und Zusammenführen mehrstufiger Konfigurationen
- `handleContextCommand()`: Analyse der aktuellen Sitzungs-Token-Nutzung

</details>
