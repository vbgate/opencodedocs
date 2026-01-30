---
title: "Obsidian-Integration: Pläne automatisch speichern | plannotator"
sidebarTitle: "Automatisch in Obsidian speichern"
subtitle: "Obsidian-Integration: Pläne automatisch speichern | plannotator"
description: "Erfahren Sie, wie Sie die Obsidian-Integration von plannotator konfigurieren. Speichern Sie genehmigte Pläne automatisch in Ihrem Vault mit Frontmatter- und Tag-Generierung sowie benutzerdefinierten Speicherpfaden."
tags:
  - "plannotator"
  - "integration"
  - "obsidian"
  - "advanced"
prerequisite:
  - "start-getting-started"
order: 2
---

# Obsidian-Integration: Pläne automatisch in Ihrer Notiz-Bibliothek speichern

## Was Sie lernen werden

- Genehmigte oder abgelehnte Pläne automatisch in Ihrem Obsidian Vault speichern
- Die Mechanismen der Frontmatter- und Tag-Generierung verstehen
- Speicherpfade und Ordner anpassen
- Backlinks nutzen, um einen Wissensgraphen aufzubauen

## Das Problem

Sie überprüfen KI-generierte Pläne in Plannotator, aber nach der Genehmigung „verschwinden" diese Pläne einfach. Sie möchten diese wertvollen Pläne in Obsidian speichern, um sie später nachschlagen und durchsuchen zu können – aber manuelles Kopieren und Einfügen ist mühsam und die Formatierung geht dabei verloren.

## Wann Sie diese Funktion nutzen sollten

- Sie verwenden Obsidian als Wissensmanagement-Tool
- Sie möchten KI-generierte Implementierungspläne langfristig speichern und überprüfen
- Sie möchten die Graph-Ansicht und das Tag-System von Obsidian nutzen, um Ihre Pläne zu organisieren

## Das Konzept

Die Obsidian-Integration von Plannotator speichert Planinhalte automatisch in Ihrem Obsidian Vault, wenn Sie einen Plan genehmigen oder ablehnen. Das System:

1. **Erkennt Vaults**: Liest automatisch alle Vaults aus der Obsidian-Konfigurationsdatei
2. **Generiert Frontmatter**: Enthält Erstellungszeit, Quelle und Tags
3. **Extrahiert Tags**: Extrahiert automatisch Tags aus Plantiteln und Codeblock-Sprachen
4. **Fügt Backlinks hinzu**: Fügt einen `[[Plannotator Plans]]`-Link ein, um den Aufbau eines Wissensgraphen zu erleichtern

::: info Was ist Obsidian?
Obsidian ist eine Local-First-Notiz-App mit bidirektionalen Links, die das Markdown-Format unterstützt und Beziehungen zwischen Notizen über eine Graph-Ansicht visualisieren kann.
:::

## 🎒 Voraussetzungen

Stellen Sie sicher, dass Obsidian installiert und konfiguriert ist. Plannotator erkennt automatisch die Vaults auf Ihrem System, aber Sie benötigen mindestens einen Vault, um diese Funktion nutzen zu können.

## Schritt-für-Schritt-Anleitung

### Schritt 1: Einstellungen öffnen

Klicken Sie in der Plannotator-Oberfläche auf das Zahnrad-Symbol oben rechts, um das Einstellungsfenster zu öffnen.

Sie sollten den Einstellungsdialog mit mehreren Konfigurationsoptionen sehen.

### Schritt 2: Obsidian-Integration aktivieren

Suchen Sie im Einstellungsfenster den Abschnitt „Obsidian Integration" und klicken Sie auf den Schalter, um die Funktion zu aktivieren.

Nach der Aktivierung erkennt Plannotator automatisch die Obsidian Vaults auf Ihrem System.

Sie sollten im Dropdown-Menü die erkannten Vaults sehen (z.B. `My Vault`, `Work Notes`).

### Schritt 3: Vault und Ordner auswählen

Wählen Sie aus dem Dropdown-Menü den Vault aus, in dem Sie Ihre Pläne speichern möchten. Falls kein Vault erkannt wird, können Sie:

1. Die Option „Custom path..." auswählen
2. Den vollständigen Pfad zum Vault in das Textfeld eingeben

Geben Sie dann im Feld „Folder" den Namen des Speicherordners ein (Standard ist `plannotator`).

Sie sollten unten eine Pfadvorschau sehen, die anzeigt, wo die Pläne gespeichert werden.

### Schritt 4: Pläne genehmigen oder ablehnen

Nach Abschluss der Konfiguration können Sie KI-generierte Pläne wie gewohnt überprüfen. Wenn Sie auf „Approve" oder „Send Feedback" klicken, wird der Plan automatisch im konfigurierten Vault gespeichert.

Sie sollten in Obsidian eine neu erstellte Datei sehen, deren Dateiname das Format `Title - Jan 2, 2026 2-30pm.md` hat.

### Schritt 5: Gespeicherte Dateien anzeigen

Öffnen Sie die gespeicherte Datei in Obsidian. Sie werden folgenden Inhalt sehen:

```markdown
---
created: 2026-01-24T14:30:00.000Z
source: plannotator
tags: [plan, authentication, typescript, sql]
---

[[Plannotator Plans]]

## Implementation Plan: User Authentication

...
```

Beachten Sie das YAML-Frontmatter am Anfang der Datei, das Erstellungszeit, Quelle und Tags enthält.

## Checkliste ✅

- [ ] Obsidian Integration ist im Einstellungsfenster aktiviert
- [ ] Ein Vault wurde ausgewählt (oder ein benutzerdefinierter Pfad eingegeben)
- [ ] Der Ordnername wurde festgelegt
- [ ] Nach dem Genehmigen oder Ablehnen eines Plans erscheint eine neue Datei in Obsidian
- [ ] Die Datei enthält Frontmatter und den `[[Plannotator Plans]]`-Backlink

## Frontmatter und Tags im Detail

### Frontmatter-Struktur

Jeder gespeicherte Plan enthält die folgenden Frontmatter-Felder:

| Feld | Beispielwert | Beschreibung |
| --- | --- | --- |
| `created` | `2026-01-24T14:30:00.000Z` | Erstellungszeitstempel im ISO 8601-Format |
| `source` | `plannotator` | Fester Wert zur Kennzeichnung der Quelle |
| `tags` | `[plan, authentication, typescript]` | Automatisch extrahiertes Tag-Array |

### Regeln für die Tag-Generierung

Plannotator verwendet die folgenden Regeln zur automatischen Tag-Extraktion:

1. **Standard-Tag**: Enthält immer das Tag `plannotator`
2. **Projektname-Tag**: Wird automatisch aus dem Git-Repository-Namen oder Verzeichnisnamen extrahiert
3. **Titel-Schlüsselwörter**: Extrahiert bedeutungsvolle Wörter aus der ersten H1-Überschrift (unter Ausschluss gängiger Stoppwörter)
4. **Codesprachen-Tags**: Werden aus den Sprachkennzeichnungen von Codeblöcken extrahiert (z.B. `typescript`, `sql`). Allgemeine Konfigurationssprachen (wie `json`, `yaml`, `markdown`) werden automatisch herausgefiltert.

Stoppwortliste (werden nicht als Tags verwendet):
- `the`, `and`, `for`, `with`, `this`, `that`, `from`, `into`
- `plan`, `implementation`, `overview`, `phase`, `step`, `steps`

Tag-Limit: Maximal 7 Tags, sortiert nach Extraktionsreihenfolge.

### Dateinamenformat

Der Dateiname verwendet ein gut lesbares Format: `Title - Jan 2, 2026 2-30pm.md`

| Teil | Beispiel | Beschreibung |
| --- | --- | --- |
| Titel | `User Authentication` | Aus H1 extrahiert, auf 50 Zeichen begrenzt |
| Datum | `Jan 2, 2026` | Aktuelles Datum |
| Uhrzeit | `2-30pm` | Aktuelle Uhrzeit (12-Stunden-Format) |

### Backlink-Mechanismus

Am Ende jeder Plandatei wird ein `[[Plannotator Plans]]`-Link eingefügt. Dieser Backlink dient folgenden Zwecken:

- **Wissensgraph-Verbindung**: In der Graph-Ansicht von Obsidian sind alle Pläne mit demselben Knoten verbunden
- **Schnelle Navigation**: Durch Klicken auf `[[Plannotator Plans]]` können Sie eine Indexseite erstellen, die alle gespeicherten Pläne zusammenfasst
- **Bidirektionale Links**: Auf der Indexseite können Sie über Backlinks alle Pläne einsehen

## Plattformübergreifende Unterstützung

Plannotator erkennt automatisch den Speicherort der Obsidian-Konfigurationsdatei auf verschiedenen Betriebssystemen:

| Betriebssystem | Konfigurationsdateipfad |
| --- | --- |
| macOS | `~/Library/Application Support/obsidian/obsidian.json` |
| Windows | `%APPDATA%\obsidian/obsidian.json` |
| Linux | `~/.config/obsidian/obsidian.json` |

Falls die automatische Erkennung fehlschlägt, können Sie den Vault-Pfad manuell eingeben.

## Fehlerbehebung

### Problem 1: Vaults werden nicht erkannt

**Symptom**: Das Dropdown-Menü zeigt „Detecting..." an, aber keine Ergebnisse

**Ursache**: Die Obsidian-Konfigurationsdatei existiert nicht oder hat ein falsches Format

**Lösung**:
1. Stellen Sie sicher, dass Obsidian installiert ist und mindestens einmal geöffnet wurde
2. Überprüfen Sie, ob die Konfigurationsdatei existiert (siehe Pfade in der obigen Tabelle)
3. Verwenden Sie „Custom path...", um den Vault-Pfad manuell einzugeben

### Problem 2: Datei nach dem Speichern nicht auffindbar

**Symptom**: Nach der Genehmigung eines Plans erscheint keine neue Datei in Obsidian

**Ursache**: Falscher Vault-Pfad oder Obsidian wurde nicht aktualisiert

**Lösung**:
1. Überprüfen Sie, ob der Vorschaupfad im Einstellungsfenster korrekt ist
2. Klicken Sie in Obsidian auf „Reload vault" oder drücken Sie `Cmd+R` (macOS) / `Ctrl+R` (Windows/Linux)
3. Überprüfen Sie, ob der richtige Vault ausgewählt ist

### Problem 3: Dateiname enthält Sonderzeichen

**Symptom**: Im Dateinamen erscheinen `_` oder andere Ersatzzeichen

**Ursache**: Der Titel enthält Zeichen, die vom Dateisystem nicht unterstützt werden (`< > : " / \ | ? *`)

**Lösung**: Dies ist das erwartete Verhalten. Plannotator ersetzt diese Zeichen automatisch, um Dateisystemfehler zu vermeiden.

## Zusammenfassung

Die Obsidian-Integration verbindet Ihren Plan-Review-Workflow nahtlos mit Ihrem Wissensmanagement:

- ✅ Automatisches Speichern genehmigter oder abgelehnter Pläne
- ✅ Intelligente Tag-Extraktion für einfaches späteres Auffinden
- ✅ Frontmatter-Generierung für einheitliches Metadatenformat
- ✅ Backlinks hinzufügen, um einen Wissensgraphen aufzubauen

Nach einmaliger Konfiguration wird jede Überprüfung automatisch archiviert – kein manuelles Kopieren und Einfügen mehr erforderlich.

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir die **[Bear-Integration](../bear-integration/)**.
>
> Sie werden lernen:
> - Wie Sie Pläne in der Bear-Notiz-App speichern
> - Die Unterschiede zwischen Bear- und Obsidian-Integration
> - Wie Sie x-callback-url verwenden, um automatisch Notizen zu erstellen

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie hier, um die Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert: 2026-01-24

| Funktion | Dateipfad | Zeilen |
| --- | --- | --- |
| Obsidian Vaults erkennen | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L135-L175) | 135-175 |
| Plan in Obsidian speichern | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L180-L227) | 180-227 |
| Tags extrahieren | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L34-L74) | 34-74 |
| Frontmatter generieren | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L81-L89) | 81-89 |
| Dateinamen generieren | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L111-L127) | 111-127 |
| Obsidian-Einstellungen speichern | [`packages/ui/utils/obsidian.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/obsidian.ts#L36-L43) | 36-43 |
| Settings UI-Komponente | [`packages/ui/components/Settings.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Settings.tsx#L387-L491) | 387-491 |

**Wichtige Funktionen**:
- `detectObsidianVaults()`: Liest die Obsidian-Konfigurationsdatei und gibt eine Liste verfügbarer Vault-Pfade zurück
- `saveToObsidian(config)`: Speichert den Plan im angegebenen Vault, einschließlich Frontmatter und Backlink
- `extractTags(markdown)`: Extrahiert Tags aus dem Planinhalt (Titel-Schlüsselwörter, Codesprachen, Projektname)
- `generateFrontmatter(tags)`: Generiert den YAML-Frontmatter-String
- `generateFilename(markdown)`: Generiert einen lesbaren Dateinamen

**Geschäftsregeln**:
- Maximal 7 Tags (L73)
- Dateiname auf 50 Zeichen begrenzt (L102)
- Unterstützt plattformübergreifende Erkennung von Konfigurationsdateipfaden (L141-149)
- Erstellt automatisch nicht vorhandene Ordner (L208)

</details>
