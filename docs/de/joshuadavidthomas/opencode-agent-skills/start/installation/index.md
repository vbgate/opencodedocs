---
title: "Installation: Agent Skills Plugin | opencode-agent-skills"
sidebarTitle: "Plugin in 5 Minuten installieren"
subtitle: "Installation: Agent Skills Plugin | opencode-agent-skills"
description: "Lernen Sie drei Installationsmethoden für opencode-agent-skills. Grundinstallation, feste Versionsinstallation und lokale Entwicklungsinstallation für unterschiedliche Anwendungsfälle."
tags:
  - "Installation"
  - "Plugin"
  - "Schnellstart"
prerequisite: []
order: 2
---

# OpenCode Agent Skills installieren

## Was Sie nach diesem Tutorial können

- Agent Skills Plugin für OpenCode auf drei Arten installieren
- Überprüfen, ob das Plugin korrekt installiert ist
- Den Unterschied zwischen fester Version und neueste Version verstehen

## Ihre aktuelle Situation

Sie möchten, dass der AI Agent Fähigkeiten wiederverwenden kann, wissen aber nicht, wie Sie diese Funktion in OpenCode aktivieren. Das Plugin-System von OpenCode scheint etwas komplex, und Sie befürchten Konfigurationsfehler.

## Wann Sie diese Methode verwenden

**Wenn Sie folgende Fähigkeiten vom AI Agent benötigen**:
- Fähigkeiten zwischen verschiedenen Projekten wiederverwenden (z.B. Code-Standards, Test-Templates)
- Claude Code Skill-Bibliothek laden
- AI-spezifische Arbeitsabläufe befolgen lassen

## 🎒 Vorbereitungen vor dem Start

::: warning Vorab-Check

Bitte bestätigen Sie vor dem Start:

- [OpenCode](https://opencode.ai/) v1.0.110 oder höher ist installiert
- Zugriff auf die Konfigurationsdatei `~/.config/opencode/opencode.json` (OpenCode Konfigurationsdatei) besteht

:::

## Kernidee

OpenCode Agent Skills ist ein Plugin, das über npm veröffentlicht wird. Die Installation ist einfach: Deklarieren Sie den Plugin-Namen in der Konfigurationsdatei, OpenCode lädt und lädt das Plugin beim Start automatisch herunter.

**Anwendungsszenarien für drei Installationsmethoden**:

| Methode | Anwendungsszenario | Vor- und Nachteile |
| --- | --- | --- |
| **Grundinstallation** | Bei jedem Start die neueste Version verwenden | ✅ Bequemes automatisches Update<br>❌ Mögliche Breaking Changes |
| **Feste Version** | Stabile Produktionsumgebung benötigt | ✅ Version kontrollierbar<br>❌ Manuelles Upgrade erforderlich |
| **Lokale Entwicklung** | Eigenes Plugin oder Code-Beitrag | ✅ Flexible Modifikation<br>❌ Manuelle Abhängigkeitsverwaltung erforderlich |

---

## Schritt für Schritt

### Methode 1: Grundinstallation (Empfohlen)

Das ist der einfachste Weg. Bei jedem OpenCode-Start wird die neueste Version geprüft und heruntergeladen.

**Warum**
Geeignet für die meisten Benutzer, stellt sicher, dass Sie immer die neuesten Funktionen und Bugfixes verwenden.

**Schritte**

1. Öffnen Sie die OpenCode-Konfigurationsdatei

```bash
# macOS/Linux
nano ~/.config/opencode/opencode.json

# Windows (mit Notepad)
notepad %APPDATA%\opencode\opencode.json
```

2. Fügen Sie den Plugin-Namen in die Konfigurationsdatei hinzu

```json
{
  "plugin": ["opencode-agent-skills"]
}
```

Wenn die Datei bereits andere Plugins enthält, fügen Sie es einfach zum `plugin`-Array hinzu:

```json
{
  "plugin": ["other-plugin", "opencode-agent-skills"]
}
```

3. Speichern Sie die Datei und starten Sie OpenCode neu

**Sie sollten sehen**:
- OpenCode startet neu, im Start-Log sehen Sie, dass das Plugin erfolgreich geladen wurde
- Im AI-Dialog können Sie Tools wie `get_available_skills` verwenden

### Methode 2: Feste Version installieren (Für Produktionsumgebung)

Wenn Sie die Plugin-Version sperren möchten, um Überraschungen durch automatische Updates zu vermeiden, verwenden Sie diese Methode.

**Warum**
Produktionsumgebungen benötigen normalerweise Versionskontrolle. Feste Versionen stellen sicher, dass das Team dieselbe Plugin-Version verwendet.

**Schritte**

1. Öffnen Sie die OpenCode-Konfigurationsdatei

```bash
# macOS/Linux
nano ~/.config/opencode/opencode.json
```

2. Fügen Sie den Plugin-Namen mit Versionsnummer in die Konfigurationsdatei hinzu

```json
{
  "plugin": ["opencode-agent-skills@0.6.4"]
}
```

3. Speichern Sie die Datei und starten Sie OpenCode neu

**Sie sollten sehen**:
- OpenCode startet mit fester Version v0.6.4
- Das Plugin wird lokal zwischengespeichert, muss nicht bei jedem Mal heruntergeladen werden

::: tip Versionsverwaltung

Feste Versionen von Plugins werden lokal von OpenCode zwischengespeichert. Bei einem Versions-Upgrade müssen Sie die Versionsnummer manuell ändern und neu starten. Sehen Sie [neueste Version](https://www.npmjs.com/package/opencode-agent-skills) für Updates.

:::

### Methode 3: Lokale Entwicklungsinstallation (Für Mitwirkende)

Wenn Sie das Plugin anpassen oder an der Entwicklung mitwirken möchten, verwenden Sie diese Methode.

**Warum**
Während der Entwicklung können Sie Code-Änderungen sofort sehen, ohne auf npm-Veröffentlichung zu warten.

**Schritte**

1. Klonen Sie das Repository in das OpenCode-Konfigurationsverzeichnis

```bash
git clone https://github.com/joshuadavidthomas/opencode-agent-skills ~/.config/opencode/opencode-agent-skills
```

2. Gehen Sie in das Projektverzeichnis und installieren Sie die Abhängigkeiten

```bash
cd ~/.config/opencode/opencode-agent-skills
bun install
```

::: info Warum Bun

Das Projekt verwendet Bun als Runtime und Paketmanager. Laut der `engines`-Zeile in package.json wird Bun >= 1.0.0 benötigt.

:::

3. Erstellen Sie den Plugin-Symbolischen Link

```bash
mkdir -p ~/.config/opencode/plugin
ln -sf ~/.config/opencode/opencode-agent-skills/src/plugin.ts ~/.config/opencode/plugin/skills.ts
```

**Sie sollten sehen**:
- `~/.config/opencode/plugin/skills.ts` zeigt auf Ihren lokalen Plugin-Code
- Nach Code-Änderungen OpenCode neu starten, um wirksam zu werden

---

## Checkpoint ✅

Nach Abschluss der Installation mit folgenden Methoden überprüfen:

**Methode 1: Tool-Liste anzeigen**

Fragen Sie die AI in OpenCode:

```
Bitte liste alle verfügbaren Tools auf, gibt es skill-bezogene Tools?
```

Sie sollten folgende Tools sehen:
- `use_skill` - Skill laden
- `read_skill_file` - Skill-Datei lesen
- `run_skill_script` - Skill-Skript ausführen
- `get_available_skills` - Verfügbare Skills abrufen

**Methode 2: Tool aufrufen**

```
Bitte rufe get_available_skills auf, um zu sehen, welche Skills aktuell verfügbar sind?
```

Sie sollten eine Skill-Liste sehen (möglicherweise leer, aber Tool-Aufruf erfolgreich).

**Methode 3: Start-Log anzeigen**

Überprüfen Sie das OpenCode Start-Log, sollte ähnlich wie folgt sein:

```
[plugin] Loaded plugin: opencode-agent-skills
```

---

## Häufige Probleme

### Problem 1: Tools erscheinen nicht nach OpenCode-Start

**Mögliche Ursachen**:
- Konfigurationsdatei JSON-Formatfehler (fehlendes Komma, Anführungszeichen usw.)
- OpenCode-Version zu niedrig (benötigt >= v1.0.110)
- Plugin-Name falsch geschrieben

**Lösungen**:
1. Verwenden Sie ein JSON-Validierungstool, um die Konfigurationsdateisyntax zu überprüfen
2. Führen Sie `opencode --version` aus, um die Version zu bestätigen
3. Bestätigen Sie, dass der Plugin-Name `opencode-agent-skills` ist (Achtung auf Bindestriche)

### Problem 2: Feste Version aktualisiert sich nicht nach Upgrade

**Ursache**: Feste Versions-Plugins werden lokal zwischengespeichert, nach Versionsnummer-Änderung muss der Cache gelöscht werden.

**Lösungen**:
1. Ändern Sie die Versionsnummer in der Konfigurationsdatei
2. Starten Sie OpenCode neu
3. Wenn es immer noch nicht wirksam wird, löschen Sie den OpenCode-Plugin-Cache (Position abhängig von Ihrem System)

### Problem 3: Lokale Entwicklungsinstallation aktualisiert sich nicht nach Änderung

**Ursache**: Symbolischer Link-Fehler oder Bun-Abhängigkeit nicht installiert.

**Lösungen**:
1. Überprüfen Sie, ob der symbolische Link korrekt ist:
   ```bash
   ls -la ~/.config/opencode/plugin/skills.ts
   ```
   Sollte auf `~/.config/opencode/opencode-agent-skills/src/plugin.ts` zeigen

2. Bestätigen Sie, dass Abhängigkeiten installiert sind:
   ```bash
   cd ~/.config/opencode/opencode-agent-skills
   bun install
   ```

---

## Lektionszusammenfassung

In dieser Lektion haben wir drei Installationsmethoden gelernt:

- **Grundinstallation**: `opencode-agent-skills` zur Konfigurationsdatei hinzufügen, geeignet für die meisten Benutzer
- **Feste Versionsinstallation**: `opencode-agent-skills@Versionsnummer` hinzufügen, geeignet für Produktionsumgebungen
- **Lokale Entwicklungsinstallation**: Repository klonen und symbolischen Link erstellen, geeignet für Entwickler

Nach der Installation kann über Tool-Liste, Tool-Aufruf oder Start-Log überprüft werden.

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Erstelle deinen ersten Skill](../creating-your-first-skill/)**.
>
> Sie lernen:
> - Skill-Verzeichnisstruktur
> - SKILL.md YAML Frontmatter Format
> - Wie man Skill-Inhalte schreibt

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken Sie zum Anzeigen der Quellcode-Position</strong></summary>

> Aktualisiert am: 2026-01-24

| Funktion | Dateipfad | Zeile |
|---|---|---|
| Plugin-Eingang Definition | [`package.json:18`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L18) | 18 |
| Plugin-Hauptdatei | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts) | Gesamte Datei |
| Abhängigkeitskonfiguration | [`package.json:27-32`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L27-L32) | 27-32 |
| Versionsanforderung | [`package.json:39-41`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L39-L41) | 39-41 |

**Wichtige Konfiguration**:
- `main: "src/plugin.ts"`: Plugin-Eingangspunkt
- `engines.bun: ">=1.0.0"`: Runtime-Versionsanforderung

**Wichtige Abhängigkeiten**:
- `@opencode-ai/plugin ^1.0.115`: OpenCode Plugin SDK
- `@huggingface/transformers ^3.8.1`: Semantisches Matching-Modell
- `zod ^4.1.13`: Schema-Validierung
- `yaml ^2.8.2`: YAML-Analyse

</details>
