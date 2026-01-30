---
title: "Versionsprotokoll: Funktionsupdates | OpenSkills"
sidebarTitle: "Neue Funktionen"
subtitle: "Versionsprotokoll: Funktionsupdates | OpenSkills"
description: "Sehen Sie sich den Versionsverlauf von OpenSkills an. Erfahren Sie mehr über den Update-Befehl, symbolische Links, private Repositories und andere neue Funktionen sowie wichtige Verbesserungen wie Pfad-Traversal-Schutz."
tags:
- "changelog"
- "version history"
order: 1
---

# Änderungsprotokoll

Diese Seite dokumentiert den Versionsverlauf von OpenSkills und hilft Ihnen, die neuen Funktionen, Verbesserungen und Fehlerbehebungen jeder Version nachzuvollziehen.

---

## [1.5.0] - 2026-01-17

### Neue Funktionen

- **`openskills update`** - Aktualisiert installierte Skills aus ihren registrierten Quellen (Standard: alle aktualisieren)
- **Quellen-Metadaten-Tracking** - Installationsquellen werden jetzt erfasst, um zuverlässige Skill-Updates zu ermöglichen

### Verbesserungen

- **Mehrere Skills lesen** - Der Befehl `openskills read` unterstützt jetzt kommagetrennte Skill-Namenlisten
- **Nutzungshinweise generieren** - Optimierte Hinweise für den Aufruf des read-Befehls in Shell-Umgebungen
- **README** - Update-Anleitung und Hinweise zur manuellen Nutzung hinzugefügt

### Fehlerbehebungen

- **Update-Erlebnis optimiert** - Skills ohne Quellen-Metadaten werden übersprungen und zur Neuinstallation aufgelistet

---

## [1.4.0] - 2026-01-17

### Verbesserungen

- **README** - Lokale Projektinstallation als Standard klarer kommuniziert, redundante sync-Hinweise entfernt
- **Installationsmeldungen** - Der Installer unterscheidet jetzt klar zwischen lokaler Projektinstallation und der Option `--global`

---

## [1.3.2] - 2026-01-17

### Verbesserungen

- **Dokumentation und AGENTS.md-Anleitung** - Alle Befehlsbeispiele und generierten Nutzungshinweise verwenden einheitlich `npx openskills`

---

## [1.3.1] - 2026-01-17

### Fehlerbehebungen

- **Windows-Installation** - Pfadvalidierungsproblem auf Windows-Systemen behoben ("Sicherheitsfehler: Installationspfad außerhalb des Zielverzeichnisses")
- **CLI-Version** - `npx openskills --version` liest jetzt korrekt die Versionsnummer aus der package.json
- **SKILL.md im Root-Verzeichnis** - Installationsproblem für Single-Skill-Repositories mit SKILL.md im Repository-Root behoben

---

## [1.3.0] - 2025-12-14

### Neue Funktionen

- **Symbolische Link-Unterstützung** - Skills können jetzt über symbolische Links im Skill-Verzeichnis installiert werden ([#3](https://github.com/numman-ali/openskills/issues/3))
- Unterstützung für Git-basierte Skill-Updates durch Erstellen symbolischer Links aus geklonten Repositories
- Unterstützung für lokale Skill-Entwicklungs-Workflows
- Defekte symbolische Links werden elegant übersprungen

- **Konfigurierbarer Ausgabepfad** - Der sync-Befehl erhält neue Optionen `--output` / `-o` ([#5](https://github.com/numman-ali/openskills/issues/5))
- Synchronisation in beliebige `.md`-Dateien möglich (z.B. `.ruler/AGENTS.md`)
- Automatische Dateierstellung mit Titel, falls die Datei nicht existiert
- Automatische Erstellung verschachtelter Verzeichnisse bei Bedarf

- **Installation aus lokalem Pfad** - Unterstützung für die Installation aus lokalen Verzeichnissen ([#10](https://github.com/numman-ali/openskills/issues/10))
- Unterstützung für absolute Pfade (`/path/to/skill`)
- Unterstützung für relative Pfade (`./skill`, `../skill`)
- Unterstützung für Tilde-Expansion (`~/my-skills/skill`)

- **Unterstützung für private Git-Repositories** - Installation aus privaten Repositories möglich ([#10](https://github.com/numman-ali/openskills/issues/10))
- SSH-URLs (`git@github.com:org/private-skills.git`)
- HTTPS-URLs mit Authentifizierung
- Automatische Verwendung systemweiter SSH-Schlüssel

- **Umfassende Testsuite** - 88 Tests in 6 Testdateien
- Unit-Tests für symbolische Link-Erkennung und YAML-Parsing
- Integrationstests für install- und sync-Befehle
- End-to-End-Tests für komplette CLI-Workflows

### Verbesserungen

- **`--yes`-Flag überspringt jetzt alle Eingabeaufforderungen** - Vollständiger Non-Interactive-Modus für CI/CD ([#6](https://github.com/numman-ali/openskills/issues/6))
- Keine Eingabeaufforderung beim Überschreiben bestehender Skills
- Anzeige der Meldung `Overwriting: <skill-name>` beim Überspringen von Eingabeaufforderungen
- Alle Befehle können jetzt in Headless-Umgebungen ausgeführt werden

- **CI-Workflow neu angeordnet** - Build-Schritt läuft jetzt vor den Tests
- Stellt sicher, dass `dist/cli.js` für End-to-End-Tests existiert

### Sicherheit

- **Pfad-Traversal-Schutz** - Validierung, dass Installationspfade innerhalb des Zielverzeichnisses bleiben
- **Symbolische Link-Dereferenzierung** - `cpSync` verwendet `dereference: true` zum sicheren Kopieren symbolischer Link-Ziele
- **Nicht-gieriger YAML-Regex** - Verhindert potenzielle ReDoS-Angriffe beim Frontmatter-Parsing

---

## [1.2.1] - 2025-10-27

### Fehlerbehebungen

- README-Dokumentation bereinigt - Doppelte Abschnitte und falsche Flags entfernt

---

## [1.2.0] - 2025-10-27

### Neue Funktionen

- `--universal`-Flag installiert Skills in `.agent/skills/` statt `.claude/skills/`
- Geeignet für Multi-Agent-Umgebungen (Claude Code + Cursor/Windsurf/Aider)
- Vermeidet Konflikte mit nativen Claude Code Marketplace-Plugins

### Verbesserungen

- Lokale Projektinstallation ist jetzt die Standardoption (zuvor: globale Installation)
- Skills werden standardmäßig in `./.claude/skills/` installiert

---

## [1.1.0] - 2025-10-27

### Neue Funktionen

- Umfassende einseitige README mit technischen Tiefeneinblicken
- Direkter Vergleich mit Claude Code

### Fehlerbehebungen

- Standort-Tag zeigt jetzt basierend auf dem Installationsort korrekt `project` oder `global` an

---

## [1.0.0] - 2025-10-26

### Neue Funktionen

- Erstveröffentlichung
- `npx openskills install <source>` - Installiert Skills aus GitHub-Repositories
- `npx openskills sync` - Generiert `<available_skills>`-XML für AGENTS.md
- `npx openskills list` - Zeigt installierte Skills an
- `npx openskills read <name>` - Lädt Skill-Inhalte für Agenten
- `npx openskills manage` - Interaktives Löschen von Skills
- `npx openskills remove <name>` - Löscht einen bestimmten Skill
- Interaktive TUI-Oberfläche für alle Befehle
- Unterstützung für Anthropics SKILL.md-Format
- Progressive Disclosure (Skills bei Bedarf laden)
- Unterstützung für gebündelte Ressourcen (references/, scripts/, assets/)

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken zum Anzeigen der Quellcode-Positionen</strong></summary>

> Aktualisiert: 2026-01-24

| Funktion | Dateipfad |
| --- | --- |
| Original-Änderungsprotokoll | [`CHANGELOG.md`](https://github.com/numman-ali/openskills/blob/main/CHANGELOG.md) |

</details>
