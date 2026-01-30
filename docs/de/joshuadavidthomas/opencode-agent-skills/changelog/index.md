---
title: "Versionshistorie: Funktionsentwicklung | opencode-agent-skills"
sidebarTitle: "Was ist neu in der Version"
subtitle: "Versionshistorie"
description: "Erfahren Sie mehr über die Versionsentwicklung des OpenCode Agent Skills Plugins. Dieses Tutorial fasst alle wichtigen Funktionsaktualisierungen, Bug-Fixes, Architekturverbesserungen und Breaking Changes von v0.1.0 bis v0.6.4 zusammen."
tags:
  - "Versionsupdate"
  - "Changelog"
  - "Veröffentlichungshistorie"
order: 3
---

# Versionshistorie

Dieses Dokument zeichnet alle Versionsaktualisierungen des OpenCode Agent Skills Plugins auf. Durch die Versionshistorie können Sie den Entwicklungspfad der Funktionen, behobene Probleme und Architekturverbesserungen nachvollziehen.

::: tip Aktuelle Version
Die neueste stabile Version ist **v0.6.4** (2026-01-20)
:::

## Versions-Zeitleiste

| Version | Veröffentlichungsdatum | Typ | Hauptinhalt |
|--- | --- | --- | ---|
| 0.6.4 | 2026-01-20 | Fix | YAML-Parsing, Claude v2-Unterstützung |
| 0.6.3 | 2025-12-16 | Verbesserung | Skill-Empfehlungshinweise optimiert |
| 0.6.2 | 2025-12-15 | Fix | Skill-Namen von Verzeichnisnamen getrennt |
| 0.6.1 | 2025-12-13 | Verbesserung | Doppelempfehlung geladener Skills vermieden |
| 0.6.0 | 2025-12-12 | Neue Funktion | Semantischer Matching, Embedding-Vorabkalkulation |
| 0.5.0 | 2025-12-11 | Verbesserung | Fuzzy-Matching-Vorschläge, Refactoring |
| 0.4.1 | 2025-12-08 | Verbesserung | Installationsmethode vereinfacht |
| 0.4.0 | 2025-12-05 | Verbesserung | Skript-Rekursivsuche |
| 0.3.3 | 2025-12-02 | Fix | Symlink-Verarbeitung |
| 0.3.2 | 2025-11-30 | Fix | Agent-Modus beibehalten |
| 0.3.1 | 2025-11-28 | Fix | Modellwechsel-Problem |
| 0.3.0 | 2025-11-27 | Neue Funktion | Dateilisten-Funktion |
| 0.2.0 | 2025-11-26 | Neue Funktion | Superpowers-Modus |
| 0.1.0 | 2025-11-26 | Initial | 4 Tools, mehrfache Erkennung |

## Detailliertes Änderungsprotokoll

### v0.6.4 (2026-01-20)

**Behoben**:
- YAML-Frontmatter-Parsing für mehrzeilige Skill-Beschreibungen behoben (unterstützt `|` und `>` Blockskalarsyntax), indem der benutzerdefinierte Parser durch die `yaml`-Bibliothek ersetzt wurde
- Unterstützung für das Claude-Plugin-v2-Format hinzugefügt, `installed_plugins.json` verwendet nun ein Plugin-Installationsarray statt eines einzelnen Objekts

**Verbessert**:
- Claude Code Plugin-Cache-Discovery unterstützt nun die neue verschachtelte Verzeichnisstruktur (`cache/<marketplace>/<plugin>/<version>/skills/`)

### v0.6.3 (2025-12-16)

**Verbessert**:
- Skill-Auswertungshinweise optimiert, um zu verhindern, dass das Modell "Kein Skill erforderlich"-Nachrichten an den Benutzer sendet (Benutzer sehen die versteckten Auswertungshinweise nicht)

### v0.6.2 (2025-12-15)

**Behoben**:
- Skill-Validierung erlaubt nun, dass Verzeichnisnamen von dem `name` in der SKILL.md-Frontmatter abweichen. Der `name` in der Frontmatter ist der Standardbezeichner, der Verzeichnisname dient nur zur Organisation. Dies entspricht der Anthropic Agent Skills-Spezifikation.

### v0.6.1 (2025-12-13)

**Verbessert**:
- Die dynamische Skill-Empfehlung verfolgt nun pro Sitzung bereits geladene Skills und vermeidet Doppelempfehlung bereits geladener Skills, was redundante Hinweise und Kontextnutzung reduziert

### v0.6.0 (2025-12-12)

**Neu**:
- **Semantisches Skill-Matching**: Nach der anfänglichen Skill-Listeneinblendung werden nachfolgende Nachrichten mit lokalen Embeddings mit den Skill-Beschreibungen abgeglichen
- `@huggingface/transformers`-Abhängigkeit für lokale Embedding-Generierung hinzugefügt (quantisierte Version von all-MiniLM-L6-v2)
- Wenn Nachrichten verfügbare Skills entsprechen, wird ein 3-Schritte-Auswertungshinweis eingefügt (EVALUATE → DECIDE → ACTIVATE), der zum Laden der Skills anregt (inspiriert von [@spences10](https://github.com/spences10)s [Blogpost](https://scottspence.com/posts/how-to-make-claude-code-skills-activate-reliably))
- Embeddings auf der Festplatte zwischengespeichert für Matching mit geringer Latenz (~/.cache/opencode-agent-skills/)
- Sitzungen beim `session.deleted`-Event bereinigt

### v0.5.0 (2025-12-11)

**Neu**:
- "Meinten Sie..." Fuzzy-Matching-Vorschläge zu allen Tools hinzugefügt (`use_skill`, `read_skill_file`, `run_skill_script`, `get_available_skills`)

**Verbessert**:
- **Breaking Change**: Das Tool `find_skills` in `get_available_skills` umbenannt, um die Absicht klarer zu machen
- **Intern**: Die Codebasis in unabhängige Module reorganisiert (`claude.ts`, `skills.ts`, `tools.ts`, `utils.ts`, `superpowers.ts`), um die Wartbarkeit zu verbessern
- **Intern**: Codequalität durch Entfernen von KI-generierten Kommentaren und unnötigem Code verbessert

### v0.4.1 (2025-12-08)

**Verbessert**:
- Die Installationsmethode verwendet nun NPM-Pakete über die OpenCode-Konfiguration statt git clone + Symlink

**Entfernt**:
- `INSTALL.md` entfernt (nach der Vereinfachung nicht mehr benötigt)

### v0.4.0 (2025-12-05)

**Verbessert**:
- Die Skript-Erkennung durchsucht nun rekursiv das gesamte Skill-Verzeichnis (maximale Tiefe 10) statt nur das Stammverzeichnis und das `scripts/`-Unterverzeichnis
- Skripte werden nun über relative Pfade (z. B. `tools/build.sh`) statt nur über Basisnamen identifiziert
- Den Parameter `skill_name` in den Tools `read_skill_file`, `run_skill_script` und `use_skill` in `skill` umbenannt
- Den Parameter `script_name` im Tool `run_skill_script` in `script` umbenannt

### v0.3.3 (2025-12-02)

**Behoben**:
- Datei- und Verzeichniserkennung korrigiert, um Symlinks korrekt zu verarbeiten, indem `fs.stat` verwendet wird

### v0.3.2 (2025-11-30)

**Behoben**:
- Beibehaltung des Agent-Modus beim Einfügen synthetischer Nachrichten am Sitzungsstart

### v0.3.1 (2025-11-28)

**Behoben**:
- Unerwarteter Modellwechsel bei der Verwendung von Skill-Tools behoben, indem das aktuelle Modell explizit in der `noReply`-Operation übergeben wird (temporäre Lösung für opencode issue #4475)

### v0.3.0 (2025-11-27)

**Neu**:
- Dateiliste zur `use_skill`-Ausgabe hinzugefügt

### v0.2.0 (2025-11-26)

**Neu**:
- Unterstützung für Superpowers-Modus hinzugefügt
- Veröffentlichungsnachweis hinzugefügt

### v0.1.0 (2025-11-26)

**Neu**:
- Tool `use_skill` hinzugefügt, um Skill-Inhalte in den Kontext zu laden
- Tool `read_skill_file` hinzugefügt, um unterstützende Dateien im Skill-Verzeichnis zu lesen
- Tool `run_skill_script` hinzugefügt, um Skripte aus dem Skill-Verzeichnis auszuführen
- Tool `find_skills` hinzugefügt, um verfügbare Skills zu suchen und aufzulisten
- Mehrfache Skill-Erkennung hinzugefügt (Projektebene, Benutzerebene und Claude-kompatible Orte)
- Frontmatter-Validierung gemäß Anthropic Agent Skills Spec v1.0 hinzugefügt
- Automatische Skill-Listeneinblendung am Sitzungsstart und nach der Kontextkomprimierung hinzugefügt

**Neue Mitwirkende**:
- Josh Thomas <josh@joshthomas.dev> (Betreuer)

## Übersicht der Funktionsentwicklung

| Funktion | eingeführt in Version | Entwicklungspfad |
|--- | --- | ---|
| 4 Basis-Tools | v0.1.0 | v0.5.0 Fuzzy-Matching hinzugefügt |
| Mehrfache Skill-Erkennung | v0.1.0 | v0.4.1 Installation vereinfacht, v0.6.4 Claude v2-Unterstützung |
| Automatische Kontexteinfügung | v0.1.0 | v0.3.0 Dateiliste hinzugefügt, v0.6.1 Doppelempfehlung vermieden |
| Superpowers-Modus | v0.2.0 | Stabil |
| Skript-Rekursivsuche | v0.4.0 | v0.3.3 Symlink-Fix |
| Semantisches Matching | v0.6.0 | v0.6.1 Duplikate vermieden, v0.6.3 Hinweise optimiert |
| Fuzzy-Matching-Vorschläge | v0.5.0 | Stabil |

## Hinweise zu Breaking Changes

### v0.6.0: Semantisches Matching

Einführung der semantischen Matching-Fähigkeit basierend auf lokalen Embeddings, die es der KI ermöglicht, relevante Skills basierend auf dem Inhalt der Benutzernachrichten automatisch zu empfehlen, ohne dass der Benutzer die Skill-Namen manuell merken muss.

- **Technische Details**: Verwendung des HuggingFace-Modells `all-MiniLM-L6-v2` (q8-quantisiert)
- **Cache-Mechanismus**: Embedding-Ergebnisse werden in `~/.cache/opencode-agent-skills/` zwischengespeichert, um die nachfolgende Matching-Geschwindigkeit zu erhöhen
- **Matching-Ablauf**: Benutzernachricht → Embedding → Kosinusähnlichkeit mit Skill-Beschreibungen berechnen → Top 5 Empfehlungen (Schwellenwert 0,35)

### v0.5.0: Refactoring und Tool-Umbenennung

Die Code-Architektur wurde zu einem modularen Design umgebaut, die Tool-Benennung ist nun klarer:

- `find_skills` → `get_available_skills`
- `skill_name` → `skill`
- `script_name` → `script`

### v0.4.0: Upgrade des Skript-Erkennungsmechanismus

Die Skript-Erkennung wurde von "nur Stammverzeichnis + scripts/" auf "rekursive Suche des gesamten Skill-Verzeichnisses" (maximale Tiefe 10) hochgestuft, was eine flexiblere Skript-Organisation ermöglicht.

### v0.2.0: Superpowers-Integration

Unterstützung für den Superpowers-Workflow-Modus hinzugefügt, erfordert die Installation des `using-superpowers`-Skills und das Setzen der Umgebungsvariable `OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true`.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-24

| Funktion | Dateipfad                                                                                    | Zeile    |
|--- | --- | ---|
| Aktuelle Versionsnummer  | [`package.json`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L3-L3)         | 3       |
| Versionshistorie    | [`CHANGELOG.md`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/CHANGELOG.md#L19-L152) | 19-152  |

**Wichtige Versionsinformationen**:
- `v0.6.4`: Aktuelle Version (2026-01-20)
- `v0.6.0`: Semantisches Matching eingeführt (2025-12-12)
- `v0.5.0`: Refactoring-Version (2025-12-11)
- `v0.1.0`: Initialversion (2025-11-26)

</details>
