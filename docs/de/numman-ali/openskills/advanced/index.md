---
title: "Erweiterte Funktionen: Multi-Agent & Skill-Entwicklung | OpenSkills"
sidebarTitle: "Multi-Agent & Benutzerdefinierte Skills"
subtitle: "Erweiterte Funktionen: Multi-Agent & Skill-Entwicklung"
description: "Lernen Sie die erweiterten Funktionen von OpenSkills kennen, einschließlich Multi-Agent-Umgebungskonfiguration, benutzerdefinierte Skill-Entwicklung, CI/CD-Integration und Sicherheitsmechanismen zur effizienten Verwaltung komplexer Szenarien."
order: 3
---

# Erweiterte Funktionen

Dieser Abschnitt behandelt die fortgeschrittene Verwendung von OpenSkills, einschließlich Multi-Agent-Umgebungskonfiguration, benutzerdefinierte Ausgaben, Symlink-Entwicklung, Skill-Erstellung, CI/CD-Integration und Sicherheitsmechanismen. Nach der Beherrschung dieser Inhalte können Sie Skills effizient in komplexen Szenarien verwalten und Ihre eigene exklusive Skill-Bibliothek erstellen.

::: warning Voraussetzungen
Stellen Sie vor dem Lernen dieses Kapitels sicher, dass Sie Folgendes abgeschlossen haben:
- [Schnellstart](../start/quick-start/): Grundlagen der Installation und Verwendung
- [Erste Skill-Installation](../start/first-skill/): Skill-Installationsmethoden beherrschen
- [Skills zu AGENTS.md synchronisieren](../start/sync-to-agents/): Skill-Synchronisationsmechanismus verstehen
:::

## Inhalt dieses Kapitels

### Multi-Agent & Ausgabekonfiguration

| Tutorial | Beschreibung |
| --- | --- |
| [Universal-Modus](./universal-mode/) | Konfiguration der Multi-Agent-Umgebung, die Claude Code, Cursor, Windsurf und andere gleichzeitig unterstützt, mit automatischer Erkennung der aktuellen Agent-Umgebung |
| [Benutzerdefinierter Ausgabepfad](./custom-output-path/) | Konfigurieren von AGENTS.md-Ausgabepfaden, Unterstützung für projektspezifische oder global einheitliche Konfiguration, automatische Anpassung an unterschiedliche Arbeitsabläufe |

### Skill-Entwicklung

| Tutorial | Beschreibung |
| --- | --- |
| [Symlink-Unterstützung](./symlink-support/) | Symlink-basierte Entwicklung für git-basierte Skill-Updates und lokale Entwicklungsworkflows, Skill-Sharing über mehrere Projekte |
| [Benutzerdefinierte Skills erstellen](./create-skills/) | Erstellen von SKILL.md-Skill-Dateien von Grund auf, Beherrschung von YAML-Frontmatter und Verzeichnisstrukturstandards |
| [Skill-Struktur im Detail](./skill-structure/) | Tiefes Verständnis der vollständigen SKILL.md-Feldspezifikation, Ressourcendesign für references/scripts/assets/ und Leistungsoptimierung |

### Automatisierung & Sicherheit

| Tutorial | Beschreibung |
| --- | --- |
| [CI/CD-Integration](./ci-integration/) | Automatische Generierung von AGENTS.md in CI/CD-Pipelines, Unterstützung für GitHub Actions, GitLab CI und andere Tools, nahtlose Integration in bestehende Arbeitsabläufe |
| [Sicherheitsübersicht](./security/) | Verständnis der dreistufigen Schutzmechanismen: Pfad-Traversalschutz, sichere Symlink-Verarbeitung, YAML-Parsing-Sicherheit und weitere Sicherheitsmaßnahmen |

### Umfassende Leitfäden

| Tutorial | Beschreibung |
| --- | --- |
| [Best Practices](./best-practices/) | Zusammenfassung von Erfahrungen in Projektkonfiguration, Skill-Verwaltung und Teamzusammenarbeit, um Ihnen zu helfen, OpenSkills effizient zu nutzen |

## Lernpfad-Empfehlungen

Wählen Sie je nach Anwendungsszenario den passenden Lernpfad:

### Pfad A: Multi-Agent-Benutzer

Wenn Sie gleichzeitig mehrere KI-Codierungstools verwenden (Claude Code + Cursor + Windsurf usw.):

```
Universal-Modus → Benutzerdefinierter Ausgabepfad → Best Practices
```

### Pfad B: Skill-Entwickler

Wenn Sie Ihre eigenen Skills erstellen und mit dem Team teilen möchten:

```
Benutzerdefinierte Skills erstellen → Skill-Struktur im Detail → Symlink-Unterstützung → Best Practices
```

### Pfad C: DevOps/Automatisierung

Wenn Sie OpenSkills in CI/CD-Workflows integrieren müssen:

```
CI/CD-Integration → Sicherheitsübersicht → Best Practices
```

### Pfad D: Vollständiges Lernen

Wenn Sie alle erweiterten Funktionen umfassend beherrschen möchten, lernen Sie in dieser Reihenfolge:

1. [Universal-Modus](./universal-mode/) - Multi-Agent-Umgebungsgrundlagen
2. [Benutzerdefinierter Ausgabepfad](./custom-output-path/) - Flexible Ausgabekonfiguration
3. [Symlink-Unterstützung](./symlink-support/) - Effizienter Entwicklungsworkflow
4. [Benutzerdefinierte Skills erstellen](./create-skills/) - Einstieg in die Skill-Erstellung
5. [Skill-Struktur im Detail](./skill-structure/) - Tiefes Verständnis des Skill-Formats
6. [CI/CD-Integration](./ci-integration/) - Automatisierte Bereitstellung
7. [Sicherheitsübersicht](./security/) - Detaillierte Sicherheitsmechanismen
8. [Best Practices](./best-practices/) - Erfahrungszusammenfassung

## Nächste Schritte

Nach Abschluss dieses Kapitels können Sie:

- Die [FAQ](../faq/faq/) konsultieren, um auftretende Probleme zu lösen
- Die [CLI API-Referenz](../appendix/cli-api/) lesen, um die vollständige Befehlszeilenschnittstelle zu verstehen
- Das [AGENTS.md-Format](../appendix/agents-md-format/) lesen, um das generierte Dateiformat tief zu verstehen
- Das [Changelog](../changelog/changelog/) ansehen, um die neuesten Funktionen und Änderungen zu erfahren
