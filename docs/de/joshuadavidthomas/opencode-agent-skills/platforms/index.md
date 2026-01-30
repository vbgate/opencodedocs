---
title: "Plattformfunktionen: Skill-Erkennung, Abfrage, Laden | opencode-agent-skills"
sidebarTitle: "Sechs Hauptfunktionen der Skills"
subtitle: "Plattformfunktionen: Skill-Erkennung, Abfrage, Laden | opencode-agent-skills"
description: "Lernen Sie die Kernfunktionsmodule von opencode-agent-skills kennen, einschließlich Skill-Erkennung, Abfrage, Laden und automatischer Empfehlung. Meistern Sie die Hauptfunktionen des Plugins in 10 Minuten."
order: 2
---

# Plattformfunktionen

Dieses Kapitel behandelt die Kernfunktionsmodule von OpenCode Agent Skills im Detail, einschließlich Skill-Erkennung, Abfrage, Laden, automatische Empfehlung, Skriptausführung und Dateilesen. Nach dem Erlernen dieser Funktionen können Sie die Skill-Management-Fähigkeiten des Plugins vollständig nutzen und die KI effizienter für Ihre Entwicklungsarbeit einsetzen.

## Voraussetzungen

::: warning Bitte vor dem Start überprüfen
Bevor Sie mit diesem Kapitel beginnen, stellen Sie sicher, dass Sie folgende Schritte abgeschlossen haben:

- [Installation von OpenCode Agent Skills](../start/installation/) - Das Plugin ist korrekt installiert und läuft
- [Erstellen Sie Ihren ersten Skill](../start/creating-your-first-skill/) - Sie kennen die grundlegende Struktur eines Skills
:::

## Inhalt dieses Kapitels

| Kurs | Beschreibung | Kernwerkzeuge |
| --- | --- | --- |
| [Detaillierte Erklärung des Skill-Erkennungsmechanismus](./skill-discovery-mechanism/) | Verstehen Sie, von welchen Positionen das Plugin Skills automatisch erkennt, und beherrschen Sie die Prioritätsregeln | - |
| [Abfragen und Auflisten verfügbarer Skills](./listing-available-skills/) | Verwenden Sie das Werkzeug `get_available_skills` zum Suchen und Filtern von Skills | `get_available_skills` |
| [Laden von Skills in den Sitzungskontext](./loading-skills-into-context/) | Verwenden Sie das Werkzeug `use_skill` zum Laden von Skills und verstehen Sie den XML-Injection-Mechanismus | `use_skill` |
| [Automatische Skill-Empfehlung](./automatic-skill-matching/) | Verstehen Sie das Prinzip der semantischen Übereinstimmung und lassen Sie die KI automatisch relevante Skills erkennen | - |
| [Ausführen von Skill-Skripten](./executing-skill-scripts/) | Verwenden Sie das Werkzeug `run_skill_script` zur Ausführung von Automatisierungsskripten | `run_skill_script` |
| [Lesen von Skill-Dateien](./reading-skill-files/) | Verwenden Sie das Werkzeug `read_skill_file` zum Zugriff auf Support-Dateien eines Skills | `read_skill_file` |

## Lernpfad

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Empfohlene Lernreihenfolge                                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. Skill-Erkennungsmechanismus ──→ 2. Verfügbare Skills auflisten ──→ 3. Skills laden │
│                                                                         │
│                                                                         │
│  ▼                                    ▼                                    ▼ │
│  Verstehen, woher Skills kommen       Lernen, Skills zu suchen            Laden-Methoden beherrschen │
│                                                                         │
│                                                                         │
│  ▼                                                                      │
│                                                                         │
│  4. Automatische Skill-Empfehlung ←── 5. Skripte ausführen ←── 6. Dateien lesen │
│                                                                         │
│  ▼                                    ▼                                    ▼ │
│  Intelligentes Matching verstehen     Automatisierung ausführen           Support-Dateien zugriff │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Empfohlene Lernreihenfolge**:

1. **Zuerst den Erkennungsmechanismus lernen** - Verstehen Sie, woher Skills kommen und wie die Prioritäten bestimmt werden
2. **Dann Skills abfragen lernen** - Beherrschen Sie die Verwendung des Werkzeugs `get_available_skills`
3. **Anschließend das Laden von Skills lernen** - Verstehen Sie `use_skill` und den XML-Injection-Mechanismus
4. **Danach die automatische Empfehlung lernen** - Lernen Sie, wie die semantische Übereinstimmung funktioniert (optional, eher theoretisch)
5. **Zuletzt Skripte und Dateien lernen** - Diese sind fortgeschrittene Funktionen, die bei Bedarf gelernt werden können

::: tip Schneller Einstieg
Wenn Sie das Plugin nur schnell nutzen möchten, können Sie sich auf die ersten drei Lektionen konzentrieren (Erkennung → Abfrage → Laden) und den Rest bei Bedarf nachholen.
:::

## Nächste Schritte

Nach Abschluss dieses Kapitels können Sie mit folgenden Themen fortfahren:

- [Erweiterte Funktionen](../advanced/) - Vertiefen Sie Ihr Verständnis von Claude Code-Kompatibilität, Superpowers-Integration, Namespace-Prioritäten und anderen fortgeschrittenen Themen
- [Häufig gestellte Fragen](../faq/) - Konsultieren Sie die Fehlerbehebung und Sicherheitshinweise bei Problemen
- [Anhang](../appendix/) - Sehen Sie sich die API-Referenz und Best Practices an
